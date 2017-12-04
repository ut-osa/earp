// vim: set filetype=javascript tabstop=2 shiftwidth=2:

"use strict";

const Cc = Components.classes;
const Ci = Components.interfaces;
const Cu = Components.utils;

Cu.import("resource://gre/modules/XPCOMUtils.jsm");
Cu.import("resource://gre/modules/Services.jsm");
Cu.import("resource://gre/modules/rdbschema.jsm");

// a hacky 'secret' to authenticate chrom from apps using raw postMessage
const PORT_RDB_IAC_SECRET = "23ncwjfsdbifbcihab23rfds";

function PortRDBIASManager() {}

PortRDBIASManager.prototype = {
  _messageHandler: function (connectionRequest) {
    var port = connectionRequest.port;
    port.onmessage = function(m) {
      let d = m.data;
      if (d.secret !== PORT_RDB_IAC_SECRET) {
        return;
      }
      if (d.service in this.services) {
        let service = this.services[d.service];
        service.processRequest(d.descId, d.cmd, d.req, this.port);
      }
    }.bind({port: port, services: this.services});
  },

  init: function(aWindow){
    this._window = aWindow;
    this.services = {};
    aWindow.navigator.mozSetMessageHandler('connection', this._messageHandler.bind(this));
  },

  registerService: function (aName, aSchema) {
    var pias = new PortRDBIAS(aName, this._window, aSchema);
    var name = pias.name;
    this.services[name] = pias;
    return pias;
  },

  classID: Components.ID("{d7564dc5-54fc-11e5-a44d-7831c1c34f92}"),
  contractID: "@mozilla.org/PortRDBIASManager;1",
  QueryInterface: XPCOMUtils.generateQI([Ci.nsISupports,
                                         Ci.nsIDOMGlobalPropertyInitializer]),
};

function PortRDBIAS(name, window, aSchema) {
  this._window = window;
  this._ias = window.navigator.registerRDBIAS(name);
  this._schema = aSchema;
  this._descs = [];
  this._cursors = {};
  this._cursor_counter = 0;
};

PortRDBIAS.prototype = {
  uninit: function() {
  },

  get name() {
    return this._ias.name;
  },

  processRequest: function (descId, cmd, req, port) {
    switch (cmd) {
      case "connect":
      {
        let desc = this._ias.createClientFor(req.appId);
        let descId = this._descs.length;
        this._descs[descId] = desc;
        port.postMessage({cmd: "connect", success: true, descId: descId});
      }
      break;
      case "insert":
      case "update":
      case "delete":
      {
        if (descId < 0 || descId >= this._descs.length) {
          port.postMessage({cmd: cmd, success: false, reqId: req.reqId, error: "unknown descId"});
          break;
        }
        let lreq = null;
        try {
          switch (cmd) {
            case "insert":
            lreq = this._descs[descId].insert(req.aTab, req.aVals);
            break;
            case "update":
            lreq = this._descs[descId].update(req.aTab, req.aWhere, req.aVals);
            break;
            case "delete":
            lreq = this._descs[descId].delete(req.aTab, req.aWhere);
            break;
          }
        } catch (e) {
          port.postMessage({cmd: cmd, success: false, reqId: req.reqId, error: cmd + " exception"});
          break;
        }
        lreq.onsuccess = function() {
          let msg = {cmd: cmd, success: true, reqId: this.reqId};
          if (cmd == "insert") {
            let descs = {};
            if (this.ias._schema) {
              let entry = this.ias._schema.tabs[this.tab];
              for (var i = 0; i < entry.props.length; i++) {
                let prop = entry.props[i];
                let desc = this.lreq.getPropDesc(prop);
                if (!desc) {
                  continue;
                }
                let descId = this.ias._descs.length;
                descs['PROP_' + prop] = descId;
                this.ias._descs[descId] = desc;
              }
            }
            msg.derivedDescs = descs;
          }
          this.port.postMessage(msg);
        }.bind({ias: this, port: port, reqId: req.reqId, tab: req.aTab, lreq: lreq});
        lreq.onerror = function() {
          this.port.postMessage({cmd: cmd, success: false, reqId: this.reqId, error: cmd + " failed"});
        }.bind({port: port, reqId: req.reqId});
      }
      break;

      case "query":
      {
        if (descId < 0 || descId >= this._descs.length) {
          port.postMessage({cmd: cmd, success: false, reqId: req.reqId, error: "unknown descId"});
          break;
        }
        let lcursor = this._descs[descId].query(req.aTabs, req.aCols, req.aWhere, req.aOrderBy);
        lcursor.onsuccess = function() {
          let resSet = [];
          let entry = null;
          if (this.ias._schema) {
            entry = this.ias._schema.tabs[this.tab];
          }
          while (this.cursor.next()) {
            let row = this.cursor.row;
            if (entry) {
              for (var e in row) {
                if (e.substring(0, 5) == 'PROP_') {
                  delete row[e];
                }
              }
              for (var i = 0; i < entry.caps.length; i++) {
                let cap = entry.caps[i];
                let desc = this.cursor.getCapDesc(cap);
                if (!desc) {
                  continue;
                }
                let descId = this.ias._descs.length;
                row['CAP_' + cap] = descId;
                this.ias._descs[descId] = desc;
              }
              for (var i = 0; i < entry.props.length; i++) {
                let prop = entry.props[i];
                let desc = this.cursor.getPropDesc(prop);
                if (!desc) {
                  continue;
                }
                let descId = this.ias._descs.length;
                row['PROP_' + prop] = descId;
                this.ias._descs[descId] = desc;
              }
            }
            resSet.push(row);
          }
          let msg = {cmd: "query", success: true, reqId: this.reqId, resSet: resSet};
          let hasMore = this.cursor.hasMore;
          if (hasMore) {
            if (this.cursorId === "") {
              let cursorId = 'c_' + this.ias._cursor_counter;
              this.ias._cursor_counter++;
              this.ias._cursors[cursorId] = this.cursor;
              msg.cursorId = cursorId;
            } else {
              msg.cursorId = this.cursorId;
            }
          } else if (this.cursorId in this.ias._cursors) {
            delete this.ias._cursors[this.cursorId];
          }
          msg.hasMore = hasMore;
          this.port.postMessage(msg);
        }.bind({ias: this, cursor: lcursor, port: port, reqId: req.reqId, cursorId: req.cursorId, tab: req.aTabs[0], cols: req.aCols});
        lcursor.onerror = function() {
          this.port.postMessage({cmd: "query", success: false, reqId: this.reqId, error: "query failed"});
        }.bind({port: port, reqId: req.reqId});
      }
      break;

      case "continue":
      {
        if (!(req.cursorId in this._cursors)) {
          port.postMessage({cmd: "continue", success: false, reqId: req.reqId, error: "unknown cursorId"});
          break;
        }
        let lcursor = this._cursors[req.cursorId];
        lcursor.continue();
      }
      break;

      case "objOps": {
        if (descId < 0 || descId >= this._descs.length) {
          port.postMessage({cmd: cmd, success: false, reqId: req.reqId, error: "unknown descId"});
          break;
        }
        let desc = this._descs[descId];

        switch (req.args.op) {
          case "getForest": {
            let failcb = function(err) {
              this.port.postMessage({cmd: "query", success: false, reqId: this.reqId, error: err});
            }.bind({port: port, reqId: req.reqId})

            let sch = new RDBSchema(req.args.schema);
            sch.getObjects(desc, req.args.tab,
                           {where: req.args.where, orderby: req.args.orderby, cb: function(res) {
              if (res.succeeded) {
                let r = res.res;
                let ctr = {n: r.length, s: 0, f: 0, port: this.port, failcb: this.failcb,
                  reqId: this.reqId, resSet: r};
                for (var i = 0; i < r.length; i++) {
                  this.sch.fillObject(r[i], true, function(innerres) {
                    if (innerres.succeeded) {
                      this.s++;
                      if (this.s === this.n) {
                        this.port.postMessage({cmd: "query", success: true, reqId: this.reqId,
                                              resSet: this.resSet, hasMore: false});
                      }
                    } else {
                      this.f++;
                      if (this.f === 1)
                        this.failcb("error in fillObject");
                    }
                  }.bind(ctr), true);
                }
                if (ctr.n === 0)
                  this.port.postMessage({cmd: "query", success: true, reqId: this.reqId,
                                        resSet: [], hasMore: false});
              } else {
                this.failcb("error in getObjects");
              }
            }.bind({reqId: req.reqId, sch: sch, failcb: failcb, port: port})});
          }
          break;
          default: {
            port.postMessage({cmd: cmd, success: false, reqId: req.reqId, error: "unknown op"});
          }
          break;
        }
      }
    }
  },

  getNextRequest: function() {
    return this._ias.getNextRequest();
  },

  setPolicyForMyself: function(aPolicy) {
    this._ias.setPolicyForMyself(aPolicy);
  },

  setDefaultPolicy: function(aPolicy) {
    this._ias.setDefaultPolicy(aPolicy);
  },

  setPolicyForApp: function(aAppName, aPolicy) {
    this._ias.setPolicyForApp(aAppName, aPolicy);
  },

  set onreceived(aCallback) {
    this._ias.onreceived = aCallback.bind(this._ias);
  },

  get onreceived() {
    return this._ias.onreceived;
  },

  set onerror(aCallback) {
    this._ias.onerror = aCallback.bind(this._ias);
  },

  get onerror() {
    return this._ias.onerror;
  },

  classID: Components.ID("{a0223ce1-5500-11e5-ad71-7831c1c34f92}"),
  contractID: "@mozilla.org/PortRDBIAS;1",
  QueryInterface: XPCOMUtils.generateQI([Ci.nsISupports]),
};

this.NSGetFactory = XPCOMUtils.generateNSGetFactory([
  PortRDBIASManager, PortRDBIAS
]);
