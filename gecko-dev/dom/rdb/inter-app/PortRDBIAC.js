// vim: set filetype=javascript tabstop=2 shiftwidth=2:

"use strict";

const Cc = Components.classes;
const Ci = Components.interfaces;
const Cu = Components.utils;

Cu.import("resource://gre/modules/XPCOMUtils.jsm");
Cu.import("resource://gre/modules/Services.jsm");

// a hacky 'secret' to authenticate chrom from apps using raw postMessage
const PORT_RDB_IAC_SECRET = "23ncwjfsdbifbcihab23rfds";

function PortRDBIACManager() {}

PortRDBIACManager.prototype = {
  init: function(aWindow){
    this._window = aWindow;
    this.appId = this._window.document.nodePrincipal.appId;
  },

  connect: function(name) {
    var piac = new PortRDBIAC();
    piac.initOriginal(name, this._window);
    var req = this._window.navigator.mozApps.getSelf();
    req.onsuccess = function() {
      this.result.connect(name).then(function onConnectionAccepted(ports) {
        this._port = ports[0];
        this.connect();
      }.bind(piac), function onConnectionRejected(reason) {
        this.error = reason;
        this.dispatch("error");
      }.bind(piac))
    };
    req.onerror = function() {
      this.error = "Error in navigator.mozApps.getSelf()";
      this.dispatch("error");
    }.bind(piac);
    return piac;
  },

  classID: Components.ID("{799dbb85-54d4-11e5-8267-7831c1c34f92}"),
  contractID: "@mozilla.org/PortRDBIACManager;1",
  QueryInterface: XPCOMUtils.generateQI([Ci.nsISupports,
                                         Ci.nsIDOMGlobalPropertyInitializer]),
};

function PortRDBIAC() {}

PortRDBIAC.prototype = {

  uninit: function() {
  },

  initOriginal: function(name, window) {
    this._window = window;
    this._service = name;
    this._appId = window.document.nodePrincipal.appId;
    this._reqs = [];
    this._descId = -1;
  },

  createDerived: function(descId) {
    var piac = new PortRDBIAC();
    piac._window = this._window;
    piac._service = this._service;
    piac._appId = this._appId;
    piac._reqs = this._reqs;
    piac._port = this._port;
    piac._descId = descId;
    return piac;
  },

  getPort: function() {
    return this._port;
  },

  _processResponse: function(m) {
    var response = m.data;
    switch (response.cmd) {
      case "connect":
      {
        if (response.success) {
          this._descId = response.descId;
          this.dispatch("success");
        } else {
          this.error = response.error;
          this.dispatch("error");
        }
      }
      break;

      case "insert":
      case "update":
      case "delete":
      {
        if (response.reqId >=0 && response.reqId < this._reqs.length) {
          let req = this._reqs[response.reqId];
          if (response.success) {
            req._derivedDescs = response.derivedDescs;
            req.dispatch("success");
          } else {
            req.error = response.error;
            req.dispatch("error");
          }
        } else {
          this.error = "request ID not found";
          this.dispatch("error");
        }
      }
      break;

      case "query":
      {
        if (response.reqId >=0 && response.reqId < this._reqs.length) {
          let cursor = this._reqs[response.reqId];
          if (response.success) {
            cursor._resSet = response.resSet;
            cursor._cursor = -1;
            cursor._hasMore = response.hasMore;
            if (response.hasMore) {
              cursor._cursorId = response.cursorId;
            }
            cursor.dispatch("success");
          } else {
            cursor.error = response.error;
            cursor.dispatch("error");
          }
        } else {
          this.error = "request ID not found";
          this.dispatch("error");
        }
      }
      break;
    }
  },

  sendReq: function(cmd, req) {
    this._port.postMessage({secret: PORT_RDB_IAC_SECRET, descId: this._descId, cmd: cmd, service: this._service, req: req})
  },

  connect: function() {
    this._port.onmessage = this._processResponse.bind(this);
    this.sendReq("connect", {appId: this._appId});
  },

  insert: function(aTab, aVals) {
    var req = new PortRDBIACRequest(this._window);
    req._desc = this;
    var reqId = this._reqs.length;
    this._reqs[reqId] = req;
    this.sendReq("insert", {reqId: reqId, aTab: aTab, aVals: aVals});
    return req;
  },

  update: function(aTab, aWhere, aVals) {
    var req = new PortRDBIACRequest(this._window);
    var reqId = this._reqs.length;
    this._reqs[reqId] = req;
    this.sendReq("update", {reqId: reqId, aTab: aTab, aWhere: aWhere, aVals: aVals});
    return req;
  },

  delete: function(aTab, aWhere) {
    var req = new PortRDBIACRequest(this._window);
    var reqId = this._reqs.length;
    this._reqs[reqId] = req;
    this.sendReq("delete", {reqId: reqId, aTab: aTab, aWhere: aWhere});
    return req;
  },

  query: function(aTabs, aCols, aWhere, aOrderBy) {
    var cursor = new PortRDBIACRequest(this._window);
    cursor._desc = this;
    var reqId = this._reqs.length;
    this._reqs[reqId] = cursor;
    cursor._reqId = reqId;
    cursor._cursorId = "";
    this.sendReq("query", {reqId: reqId, aTabs: aTabs, aCols: aCols, aWhere: aWhere, aOrderBy: aOrderBy, cursorId: cursor._cursorId});
    return cursor;
  },

  objOps: function(aArgs) {
    var req = new PortRDBIACRequest(this._window);
    var reqId = this._reqs.length;
    this._reqs[reqId] = req;
    this.sendReq("objOps", {reqId: reqId, args: aArgs});
    return req;
  },

  set onsuccess(aCallback) {
    this.__DOM_IMPL__.setEventHandler("onsuccess", aCallback);
  },

  get onsuccess() {
    return this.__DOM_IMPL__.getEventHandler("onsuccess");
  },

  set onerror(aCallback) {
    this.__DOM_IMPL__.setEventHandler("onerror", aCallback);
  },

  get onerror() {
    return this.__DOM_IMPL__.getEventHandler("onerror");
  },

  dispatch: function(eventName) {
    var ev = new this._window.Event(eventName);
    this.__DOM_IMPL__.dispatchEvent(ev);
  },

  classID: Components.ID("{6fbef8f3-54cd-11e5-a7dc-7831c1c34f92}"),
  contractID: "@mozilla.org/PortRDBIAC;1",
  QueryInterface: XPCOMUtils.generateQI([Ci.nsISupports]),
};

function PortRDBIACRequest(window) {
  this._window = window;
};

PortRDBIACRequest.prototype = {

  uninit: function() {
  },

  next: function() {
    this._cursor++;
    this._derivedDescs = {};
    if (this._cursor < this._resSet.length) {
      let row = this._resSet[this._cursor];
      for (var e in row) {
        if (e.substring(0, 5) == 'PROP_' || e.substring(0, 4) == 'CAP_') {
          this._derivedDescs[e] = row[e];
          delete row[e];
        }
      }
      return true;
    }
    return false;
  },

  continue: function() {
    if (this._hasMore) {
      this._desc.sendReq("continue", {reqId: this._reqId, cursorId: this._cursorId});
    }
    return this._hasMore;
  },

  get row() {
    return this._resSet[this._cursor];
  },

  getByName: function(aColName) {
    return this._resSet[this._cursor][aColName];
  },

  getPropDesc: function(aAttrTab) {
    if (!(('PROP_' + aAttrTab) in this._derivedDescs)) {
      return null;
    }
    var descId = this._derivedDescs['PROP_' + aAttrTab];
    return this._desc.createDerived(descId);
  },

  getCapDesc: function(aCap) {
    if (!(('CAP_' + aCap) in this._derivedDescs)) {
      return null;
    }
    var descId = this._derivedDescs['CAP_' + aCap];
    return this._desc.createDerived(descId);
  },

  get backend() {
    return "iac";
  },

  set onsuccess(aCallback) {
    this.__DOM_IMPL__.setEventHandler("onsuccess", aCallback);
  },

  get onsuccess() {
    return this.__DOM_IMPL__.getEventHandler("onsuccess");
  },

  set onerror(aCallback) {
    this.__DOM_IMPL__.setEventHandler("onerror", aCallback);
  },

  get onerror() {
    return this.__DOM_IMPL__.getEventHandler("onerror");
  },

  dispatch: function(eventName) {
    var ev = new this._window.Event(eventName);
    this.__DOM_IMPL__.dispatchEvent(ev);
  },

  classID: Components.ID("{3240b805-54e8-11e5-bbfd-7831c1c34f92}"),
  contractID: "@mozilla.org/PortRDBIACRequest;1",
  QueryInterface: XPCOMUtils.generateQI([Ci.nsISupports]),
};

this.NSGetFactory = XPCOMUtils.generateNSGetFactory([
  PortRDBIACManager, PortRDBIAC, PortRDBIACRequest
]);
