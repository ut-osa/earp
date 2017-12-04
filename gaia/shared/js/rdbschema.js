'use strict';

function RDBSchema(schema) {
  this.schema = schema;

  this.tabs = {};
  for (var tab in this.schema) {
    var props = [];
    this.tabs[tab] = {props: props};
  }
  for (var tab in this.schema) {
    var t = this.schema[tab];
    var all_cols = ['pk'];
    var normal_cols = [];
    var caps = [];
    this.tabs[tab].acl = false;
    for (var col in t) {
      var coldef = t[col];
      if (coldef === 'cap') {
        caps.push(col);
        all_cols.push('CAP_' + col);
      } else if (coldef === 'prop') {
        this.tabs[col].props.push(tab);
        all_cols.push('PROP_' + col);
      } else if (col === 'acl') {
        this.tabs[tab].acl = true;
        all_cols.push("APPID");
      } else {
        all_cols.push(col);
        normal_cols.push(col);
      }
    }
    this.tabs[tab].cols = all_cols;
    this.tabs[tab].caps = caps;
    this.tabs[tab].normal_cols = normal_cols;
  }
}

// given a schema schema object, strip out the unaccessible columns in a descriptor
// Input format:
// var photoSchema = {
//   photo: {data: 'TEXT', acl: true},
//   tag: {photo: 'prop', name: 'TEXT'},
//   album: {name: 'TEXT', acl: true},
//   album_data: {photo: 'cap', album: 'prop'},
// };
function getSubSchema(schema, desc) {
  var res = {};
  for (var tab in schema) {
    var t = schema[tab];
    var newcols = {};
    for (var col in t) {
      var coldef = t[col];
      if (coldef === 'cap') {
        if (desc.tabHasCol(tab, 'CAP_' + col)) {
          newcols[col] = 'cap';
        }
      } else if (coldef === 'prop') {
        if (desc.tabHasCol(tab, 'PROP_' + col)) {
          newcols[col] = 'prop';
        }
      } else if (col === 'acl') {
        if (desc.tabHasCol(tab, 'APPID')) {
          newcols.acl = coldef;
        }
      } else {
        if (desc.tabHasCol(tab, col)) {
          newcols[col] = coldef;
        }
      }
    }
    res[tab] = newcols;
  }
  return res;
}


// If the underlying db is synchronous cb is not required (return t/f indicate success/fail);
// otherwise, cb should be provided:
// "function cb(res)", where res.succeeded is a boolean value;
RDBSchema.prototype.createSchema = function(rdb, cb) {
  var ntabs = Object.keys(this.schema).length;
  var binder = {succeeded: 0, failed: 0, ntabs: ntabs, cb: cb};
  for (var tab in this.schema) {
    var cols = [];
    var coldefs = [];
    var t = this.schema[tab];
    for (var col in t) {
      var coldef = t[col];
      if (col === 'acl') {
        if (coldef === true) {
          col = 'APPID';
          coldef = 'INTEGER DEFAULT 0';
        } else {
          continue;
        }
      } else if (coldef === 'cap') {
        coldef = 'INTEGER REFERENCES ' + col + '(pk) ON DELETE CASCADE';
        col = 'CAP_' + col;
      } else if (coldef === 'prop') {
        coldef = 'INTEGER REFERENCES ' + col + '(pk) ON DELETE CASCADE';
        col = 'PROP_' + col;
      }

      cols.push(col);
      coldefs.push(coldef);
    }

    var req = rdb.createTable(tab, cols, coldefs);
    if (rdb.sync) {
      if (req === null)
        return false;
    } else {
      req.onsuccess = function(event) {
        this.succeeded++;
        if (this.succeeded === this.ntabs) {
          this.cb({succeeded: true});
        }
      }.bind(binder);
      req.onerror = function(event) {
        if (this.failed === 0) {
          this.cb({succeeded: false});
        }
        this.failed++;
      }.bind(binder);
    }
  }
  return true;
}

RDBSchema.prototype.getObjectsHelper = function(cursor, res, tab, cb) {
  while (cursor.next()) {
    var obj = {};
    if (cursor.backend === 'iac') {
      obj = cursor.row;
      for (var e in obj) {
        if (e.substring(0, 5) == 'PROP_') {
          delete obj[e];
        }
      }
    } else {
      for (var i = 0; i < this.tabs[tab].normal_cols.length; i++) {
        var col = this.tabs[tab].normal_cols[i];
        if (col.substring(0, 4) === 'BLOB') {
          obj[col] = cursor.getFile(col);
        } else {
          obj[col] = cursor.getByName(col);
        }
      }
    }
    for (var i = 0; i < this.tabs[tab].caps.length; i++) {
      var cap = this.tabs[tab].caps[i];
      obj['CAP_' + cap] = cursor.getCapDesc(cap);
    }
    for (var i = 0; i < this.tabs[tab].props.length; i++) {
      var prop = this.tabs[tab].props[i];
      obj['PROP_' + prop] = cursor.getPropDesc(prop);
    }
    if (this.tabs[tab].acl) {
      obj['APPID'] = cursor.getByName("APPID");
      obj['SELF_TOKEN'] = cursor.getToken();
    }
    if (cursor.backend !== 'iac') {
      obj.DESC = cursor.getSelfDesc();
    }
    res.push(obj);
  }
}


//
//options: an object that contains (optional) properties: {where, orderby, cb}
//cb is required for synchronous db:
//function cb(res), where
// res.succeeded
// res.res is the array of objects (if succeeded)
RDBSchema.prototype.getObjects = function(db, tab, options) {
  if (options === null || typeof options === 'undefined') {
    options = {};
  }
  var where = options.where;
  var orderby = options.orderby;
  var cb = options.cb;
  where = typeof where !== 'undefined' ? where : null;
  orderby = typeof orderby !== 'undefined' ? orderby : null;

  var sync = db.sync;
  var cursor = db.query([tab], this.tabs[tab].cols, where, orderby);

  if (cursor === null) {
    return null;
  }

  if (sync) {
    var res = [];
    this.getObjectsHelper(cursor, res, tab, null);
    return res;
  } else {
    cursor.onsuccess = function(event) {
      var res = [];
      this.schema.getObjectsHelper(this.cursor, res, this.tab, null);
      if (this.cursor.backend === 'iac') {
        if (!this.cursor.continue()) {
          this.cb({succeeded: true, res: res, complete: true});
        } else {
          this.cb({succeeded: true, res: res, complete: false});
        }
      } else
        this.cb({succeeded: true, res: res});
    }.bind({schema: this, cursor: cursor, tab: tab, cb: cb});
    cursor.onerror = function(event) {
      this.cb({succeeded: false});
    }.bind({cb: cb});
  }
}

//cb is required for synchronous db:
//function cb(res), where
// res.succeeded
// res.res is the returned object (if succeeded)
RDBSchema.prototype.getObject = function(db, tab, cb) {
  if (!db.sync) {
    var tmpcb = function(res) {
      if (res.succeeded && res.res.length > 0) {
        res.res = res.res[0];
      } else {
        res.res = null;
      }
      this.cb(res);
    }.bind({cb: cb});
    this.getObjects(db, tab, {cb: tmpcb});
  } else {
    var res = this.getObjects(db, tab, null);
    if (res !== null && res.length > 0) {
      return res[0];
    } else {
      return null;
    }
  }
}

// cb: only needed for async mode:
// function cb(res):
// res.succeeded indicates result
// res.res: the object after filling
//
// Note: descriptors should be either all sync, or all async.
// (this should be true, since now all descriptors rely on the
// same underlying db)
RDBSchema.prototype.fillObject = function(obj, recursive, cb) {
  recursive = typeof recursive !== 'undefined' ? recursive : false;
  cb = typeof cb !== 'undefined' ? cb : null;
  var asyncCnt = 0;

  var caps = {};
  var props = {};
  //alert(JSON.stringify(obj));
  for (var col in obj) {
    //alert("=== " + col); //JSON.stringify(props));
    if (col.substring(0, 4) === 'CAP_') {
      var desc = obj[col];
      caps[col.substring(4)] = desc;
      if (!desc.sync) {
        asyncCnt++;
      }
    } else if (col.substring(0, 5) === 'PROP_') {
      var desc = obj[col];
      props[col.substring(5)] = desc;
      if (!desc.sync) {
        asyncCnt++;
      }
    }
  }

  var binder = {cb: cb, recursive: recursive, schema: this, succeeded: 0, failed: 0, asyncCnt: asyncCnt, obj: obj};

  for (var cap in caps) {
    var desc = caps[cap];
    if (desc.sync) {
      var capobj = this.getObject(desc, cap);
      if (recursive) {
        this.fillObject(capobj, true);
      }
      obj[cap] = capobj;
    } else {
      this.getObject(desc, cap, function(res) {
        if (res.succeeded) {
          var capobj = res.res;
          this.binder.obj[this.cap] = capobj;
          if (this.binder.recursive) {
            this.binder.schema.fillObject(capobj, true, function(ires){
              if (ires.succeeded) {
                this.binder.succeeded++;
                if (this.binder.succeeded === this.binder.asyncCnt) {
                  this.binder.cb({succeeded: true, res: this.binder.obj});
                }
              } else {
                if (this.binder.failed === 0) {
                  this.binder.cb({succeeded: false});
                }
                this.binder.failed++;
              }
            }.bind(this));
          } else {
            this.binder.succeeded++;
            if (this.binder.succeeded === this.binder.asyncCnt) {
              this.binder.cb({succeeded: true, res: this.binder.obj});
            }
          }
        } else {
          if (this.binder.failed === 0) {
            this.binder.cb({succeeded: false});
          }
          this.binder.failed++;
        }
      }.bind({binder: binder, cap: cap}));
    }
  }

  for (var prop in props) {
    var desc = props[prop];
    if (prop.sync) {
      var propobj = this.getObjects(desc, prop);
      obj[prop] = propobj;
      if (recursive) {
        for (var i = 0; i < propobj.length; i++) {
          this.fillObject(propobj[i], true);
        }
      }
    } else {
      this.getObjects(desc, prop, {cb: function(res) {
        if (res.succeeded) {
          var propobj = res.res;
          this.binder.obj[this.prop] = propobj;
          if (this.binder.recursive && propobj.length > 0) {
            this.binder.asyncCnt += (propobj.length - 1);
            for (var i = 0; i < propobj.length; i++) {
              this.binder.schema.fillObject(propobj[i], true, function(ires){
                if (ires.succeeded) {
                  this.binder.succeeded++;
                  if (this.binder.succeeded === this.binder.asyncCnt) {
                    this.binder.cb({succeeded: true, res: this.binder.obj});
                  }
                } else {
                  if (this.binder.failed === 0) {
                    this.binder.cb({succeeded: false});
                  }
                  this.binder.failed++;
                }
              }.bind(this));
            }
          } else {
            this.binder.succeeded++;
            if (this.binder.succeeded === this.binder.asyncCnt) {
              this.binder.cb({succeeded: true, res: this.binder.obj});
            }
          }
        } else {
          if (this.binder.failed === 0) {
            this.binder.cb({succeeded: false});
          }
          this.binder.failed++;
        }
      }.bind({binder: binder, prop: prop})});
    }
  }

  if (asyncCnt == 0 && cb !== null) {
    cb({succeeded: true, res: obj});
  }

//  for (var col in obj) {
//    if (col.substring(0, 4) === 'CAP_') {
//      var ctab = col.substring(4);
//      var capobj = this.getObject(obj[col], ctab);
//      if (recursive) {
//        this.fillObject(capobj, true);
//      }
//      obj[ctab] = capobj;
//    } else if (col.substring(0, 5) === 'PROP_') {
//      var ptab = col.substring(5);
//      var propobj = this.getObjects(obj[col], ptab);
//      if (recursive) {
//        for (var i = 0; i < propobj.length; i++) {
//          this.fillObject(propobj[i], true);
//        }
//      }
//      obj[ptab] = propobj;
//    }
//  }
  //
}

RDBSchema.prototype.insertObj = function(db, tab, obj) {
  return db.insert(tab, obj);
};

RDBSchema.prototype.addProperty = function(obj, proptab, prop, capcols, tokens){
  if(capcols && tokens)
    return obj["PROP_" + proptab].insert(proptab,
                                         prop,
                                         capcols || null, 
                                         tokens || null);
  else
    return obj["PROP_" + proptab].insert(proptab, prop);
};

RDBSchema.prototype.purgeProperties = function(obj, proptab, cb){
  var self = this;
  self.getObjects(obj["PROP_"+proptab], proptab, {cb: function(res){
    if(res.succeeded){
      var count = 0;
      res.res.forEach(function(obj){
        var req = self.removeObj(obj, proptab);
        req.onsuccess = function(){
          if(++count === res.res.length)
            cb({succeeded:true});
        };
        req.onerror = function(){
          cb({suceeded:false});
        };
      });
    }
    else{
      cb({succeeeded:false});
    }
  }});
}

RDBSchema.prototype.addProperties = function(obj, props, cb){
  var self = this;
  var count = 0;
  function exec(prop){
    var req = self.addProperty(obj, prop.tab, prop.obj, prop.capcols, prop.tokens);
    req.onsuccess = function(){
      if(++count >= props.length){
        cb(true);
      }
      else{
        exec(props[count]);
      }
    }
    req.onerror = function(){
      cb(false);
    }
  }
  exec(props[count]);
}

RDBSchema.prototype.addPropertiesTx = function(db, obj, props, cb){
  db.startTx();
  this.addProperties(obj, props, function(good){
    if(good){
      console.log('hello?');
      db.commitTx().onsuccess = function(){
        cb(true);
      }
    }
    else{
      db.abortTx();
      cb(false);
    }
  });
}

RDBSchema.prototype.removeObj = function(obj, tab) {
  return obj.DESC.delete(tab, null);
};

RDBSchema.prototype.getToken = function(obj, tab, cb){
  var cursor = obj.DESC.query([tab], this.tabs[tab].cols, null, null);
  cursor.onsuccess = function(){
    if(cursor.next()){
      var t = cursor.getToken();
      cursor.reset();
      cb(t);
    }
    else{
      cb(null);
    }
  }
  cursor.onerror = function(){
    throw new Error('Could not get token!');
    cb(null);
  }
}

RDBSchema.prototype.insertHelperEntryAndProp = function(db, obj, cb) {
  var req;
  try {
    if (obj.capcols === null || typeof obj.capcols === 'undefined') {
      req = db.insert(obj.tab, obj.obj);
    } else {
      req = db.insert(obj.tab, obj.obj, obj.capcols, obj.tokens);
    }
  } catch(err) {
    cb({succeeded: false, error: "Exception when inserting " + JSON.stringify(obj.obj) + " to " + obj.tab});
    return;
  }
  req.onsuccess = function(event) {
    // insert properties
    var ireq = event.target;
    if (this.obj.props !== null && typeof this.obj.props !== 'undefined'
           && this.obj.props.length > 0) {
      var info = {req: ireq, cb: this.cb, succeeded: 0, failed: 0,
          n: this.obj.props.length, tab: this.obj.tab};
      var func = function(res) {
        if (res.succeeded) {
          this.succeeded += 1;
          if (this.succeeded === this.n) {
            this.cb({res: this.req, succeeded: true, tab: this.tab});
          } else if (this.failed + this.succeeded === this.n) {
            this.cb({succeeded: false, error: this.error});
          }
        } else {
          this.failed += 1;
          if (this.failed + this.succeeded === this.n) {
            this.cb({succeeded: false, error: res.error});
          } else {
            this.error = res.error;
          }
        }
      }.bind(info);

      for (var i = 0; i < info.n; i++) {
        var p = this.obj.props[i];
        try {
          this.sch.storeTree(ireq.getPropDesc(p.tab), p, func);
        } catch (error) {
          func({succeeded: false, error: "cannot get desc for table " + p.tab});
        }
      }
    } else {
      this.cb({succeeded: true, res: req, tab: this.obj.tab});
    }
  }.bind({cb: cb, obj: obj, sch: this});
  req.onerror = function(event) {
    this.cb({succeeded: false, error: "error inserting to " + obj.tab});
  }.bind({cb: cb});
}

// sample obj:
// {tab: 'album_data', obj: {}, caps: [
//     {tab: 'photo', obj: {data: 'xx'}, props: [
//         {tab: 'tag', obj: {tag: 'a'}},
//         {tab: 'tag', obj: {tag: 'b'}}
//       ]
//     }
//   ]
// }
// if db is sync, db is required:
// cb(res): res.succeeded/not, res.res: insert request
RDBSchema.prototype.storeTree = function(db, obj, cb) {
  // sync
  if (db.sync) {
    return false;
    //if (obj.caps !== null && typeof obj.caps !== 'undefined') {
    //  for (var i = 0; i < obj.caps.length; i++) {
    //    var c = obj.caps[i]
    //    if (this.storeTree(db.expandCap())) {
    //    } else {
    //      return false;
    //    }
    //  }
    //}
  }


  // async
  if (obj.caps !== null && typeof obj.caps !== 'undefined'
        && obj.caps.length > 0) {
    // insert caps
    var info = {succeeded: 0, failed: 0, n: obj.caps.length, cb: cb, db: db, sch: this, obj: obj};
    var func = function(res) {
      if (res.succeeded) {
        if (obj.capcols === null || typeof obj.capcols === 'undefined') {
          obj.capcols = [];
        }
        if (obj.tokens === null || typeof obj.tokens === 'undefined') {
          obj.tokens= [];
        }
        obj.capcols.push('CAP_' + res.tab);
        obj.tokens.push(res.res.getToken());
        this.succeeded += 1;
        if (this.succeeded === this.n) {
          this.sch.insertHelperEntryAndProp(this.db, this.obj, this.cb);
        } else if (this.failed + this.succeeded === this.n) {
          this.cb({succeeded: false, error: this.error});
        }
      } else {
        this.failed += 1;
        if (this.failed + this.succeeded === this.n) {
          this.cb({succeeded: false, error: res.error});
        } else {
          this.error = res.error;
        }
      }
    }.bind(info);
    for (var i = 0; i < obj.caps.length; i++) {
      var c = obj.caps[i];
      if (db.insertable(c.tab)) {
        this.storeTree(db, c, func);
      } else {
        try {
          this.storeTree(db.expandCap(obj.tab, c.tab), c, func);
        } catch (error) {
          func({succeeded: false, error: "no capability from " + obj.tab + " to " + c.tab});
        }
      }
    }
  } else {
    this.insertHelperEntryAndProp(db, obj, cb);
  }
}

RDBSchema.prototype.storeTreeTx = function(db, obj, cb) {
  db.startTx();
  this.storeTree(db, obj, function(res) {
    if (res.succeeded) {
      var r = this.db.commitTx();
      r.onsuccess = function(e) {
        this.cb(this.res);
      }.bind({cb: this.cb, res: res});
      r.onerror = function(e) {
        this.cb({succeeded: false, error: 'tx'});
      }.bind({cb: this.cb});
    } else {
      this.db.abortTx();
      this.cb(res);
    }
  }.bind({cb: cb, db: db}));
}

RDBSchema.prototype.storeTreeTxNoWait = function(db, obj, cb) {
  db.startTx();
  this.storeTree(db, obj, function(res) {
    if (res.succeeded) {
      this.db.commitTx();
      this.cb(res);
    } else {
      this.db.abortTx();
      this.cb(res);
    }
  }.bind({cb: cb, db: db}));
}

RDBSchema.prototype.queryPathInternal = function(db, tabs, where, orderby, cb, needRoot) {
  var ii = tabs.length - 1;
  if (ii === 0) {
    return this.getObjects(db, tabs[0], {where: where, orderby: orderby, cb: cb});
  }
  var lastTab = tabs[ii];
  var joindef = {tab: lastTab, cols: this.tabs[lastTab].cols};
  ii--;
  for (;ii>=0;ii--) {
    var currTab = tabs[ii];
    var outer = {tab: currTab};
    if (ii == 0 && !needRoot) {
      outer.cols = ['pk'];
    } else {
      outer.cols = this.tabs[currTab].cols;
    }
    if (this.tabs[currTab].props.indexOf(lastTab) > -1) {
      outer.prop = joindef;
    } else if (this.tabs[currTab].caps.indexOf(lastTab) > -1) {
      outer.cap = joindef;
    } else {
      cb({succeeded: false, error: "No foreign key found between " + currTab + " and " + lastTab});
    }
    joindef = outer;
    lastTab = currTab;
  }

  var cursor = db.joinPropCap(joindef, where, orderby);
  cursor.onsuccess = function(event) {
    var res = [];
    var c = event.target;
    while (c.next()) {
      var one = {};
      for (var j = 0; j < tabs.length; j++) {
        var tab = tabs[j];
        var obj = {};
        for (var i = 0; i < this.tabdefs[tab].normal_cols.length; i++) {
          var col = this.tabdefs[tab].normal_cols[i];
          if (col.substring(0, 4) === 'BLOB') {
            obj[col] = c.getFile(tab, col);
          } else {
            obj[col] = c.getByName(tab + '__' + col);
          }
        }
        for (var i = 0; i < this.tabdefs[tab].caps.length; i++) {
          var cap = this.tabdefs[tab].caps[i];
          obj['CAP_' + cap] = c.getCapDesc(tab, cap);
        }
        for (var i = 0; i < this.tabdefs[tab].props.length; i++) {
          var prop = this.tabdefs[tab].props[i];
          obj['PROP_' + prop] = c.getPropDesc(tab, prop);
        }
        if (this.tabdefs[tab].acl) {
          obj['APPID'] = c.getByName(tab + "__APPID");
          obj['SELF_TOKEN'] = c.getToken(tab);
        }
        obj.DESC = c.getSelfDesc(tab);
        one[tab] = obj;
      }
      res.push(one);
    }
    this.cb({succeeded: true, res: res});
  }.bind({cb: cb, tabs: tabs, tabdefs: this.tabs});
  cursor.onerror = function(event) {
    this.cb({succeeded: false, error: "Error in performing join with " + JSON.stringify(this.joindef)});
  }.bind({cb: cb, joindef: joindef});
}


// tabs: e.g., ['album_data', 'photo', 'tag']
// cb(res)
// res.succeeded
// res.error : message
// res.res: array of results (matched paths), each path:
//  {album_data: *album_data obj like the res of getObject*,
//   photo: *photo obj like the res of getObject*
//   tag: *tag obj like the res of getObject*
//  }
RDBSchema.prototype.queryPath = function(db, tabs, where, orderby, cb) {
  return this.queryPathInternal(db, tabs, where, orderby, cb, true);
}

//cb: function(res)
//res.succeeded
//res.res is an array of trees
RDBSchema.prototype.enumForest= function(db, tab, recursive, orderby, cb) {
  if (recursive) {
    cb({succeeded: false, error: 'no support for recursive'});
  }

  if (orderby) {
    orderby += "," + tab + "__pk"
  } else {
    orderby = tab + "__pk";
  }

  var tabs = {};
  tabs[tab] = this.tabs[tab].cols;
  var props = this.tabs[tab].props;
  for (var i = 0; i < props.length; i++) {
    tabs[props[i]] = this.tabs[props[i]].cols;
  }

  var cur = db.joinFlatProp(tab, tabs, null, orderby);
  cur.onsuccess = function(e) {
    var res = [];
    var obj = {};
    var c = e.target;
    var lastone = -1;
    while (c.next()) {
      var one = {};
      for (var tab in this.tabs) {
        var obj = {};
        var pk = c.getByName(tab + '__pk');
        if (typeof pk === 'undefined' || pk === null) {
          continue;
        }
        if (lastone !== -1) {
          if (tab === this.root) {
            if (lastone.pk === pk)
              continue;
            else {
              res.push(lastone);
              lastone = {};
            }
          } else if (typeof lastone[tab] !== 'undefined') {
            for (var k = 0; k < lastone[tab].length; k++) {
              if (lastone[tab][k].pk === pk)
                continue;
            }
          } else {
            lastone[tab] = [];
          }
        } else {
          lastone = {};
        }
        obj.pk = pk;
        for (var i = 0; i < this.tabdefs[tab].normal_cols.length; i++) {
          var col = this.tabdefs[tab].normal_cols[i];
          if (col.substring(0, 4) === 'BLOB') {
            obj[col] = c.getFile(tab, col);
          } else {
            obj[col] = c.getByName(tab + '__' + col);
          }
        }
        for (var i = 0; i < this.tabdefs[tab].caps.length; i++) {
          var cap = this.tabdefs[tab].caps[i];
          obj['CAP_' + cap] = c.getCapDesc(tab, cap);
        }
        for (var i = 0; i < this.tabdefs[tab].props.length; i++) {
          var prop = this.tabdefs[tab].props[i];
          obj['PROP_' + prop] = c.getPropDesc(tab, prop);
        }
        if (this.tabdefs[tab].acl) {
          obj['APPID'] = c.getByName(tab + "__APPID");
          obj['SELF_TOKEN'] = c.getToken(tab);
        }
        obj.DESC = c.getSelfDesc(tab);
        if (tab === this.root) {
          for (var e in obj) {
            lastone[e] = obj[e];
          }
        } else {
          lastone[tab].push(obj);
        }
      }
    }
    res.push(lastone);
    cb({succeeded: true, res: res});
  }.bind({root: tab, cb: cb, tabs: tabs, tabdefs: this.tabs});

  cur.onerror = function(e) {
    cb({succeeded: false, error: "execute join failed"});
  };

  //var f = function(m, p) {
  //  for (var i = 0; i < m.length; i++) {
  //    for (var j in p) {
  //      var t = p[j][m[i].pk];
  //      if (typeof t !== 'undefined')
  //        m[i][j] = t;
  //    }
  //  }
  //};

  //var info = {f: f, tab: tab, n: 1 + props.length, succeeded: 0, failed: 0, cb: cb, p: {}};

  //this.getObjects(db, tab, {orderby: orderby, cb: function(r) {
  //  if (r.succeeded) {
  //    this.succeeded += 1;
  //    if (this.succeeded === this.n) {
  //      this.f(r.res, this.p);
  //      this.cb({succeeded: true, res: r.res});
  //    } else if (this.failed + this.succeeded === this.n) {
  //      this.cb({succeeded: false, error: this.error});
  //    } else {
  //      this.m = r.res;
  //    }
  //  } else {
  //    this.error = "get object";
  //    this.failed += 1;
  //    if (this.failed + this.succeeded === this.n) {
  //      this.cb({succeeded: false, error: this.error});
  //    }
  //  }
  //}.bind(info)});
  //for (var i = 0; i < props.length; i++) {
  //  this.queryPathInternal(db, [tab, props[i]], null, null, function(r) {
  //    if (r.succeeded) {
  //      this.info.succeeded += 1;
  //      var t = {};
  //      for (var k = 0; k < r.res.length; k++) {
  //        var el = r.res[k];
  //        var mel = el[this.info.tab];
  //        var pel = el[this.pt];
  //        if (typeof t[mel.pk] === 'undefined')
  //          t[mel.pk] = [pel];
  //        else
  //          t[mel.pk].push(pel);
  //      }
  //      this.info.p[this.pt] = t;
  //      if (this.info.succeeded === this.info.n) {
  //        this.info.f(this.info.m, this.info.p);
  //        this.info.cb({succeeded: true, res: this.info.m});
  //      } else if (this.info.succeeded + this.info.failed === this.info.n) {
  //        this.info.cb({succeeded: false, error: this.info.error});
  //      }
  //    } else {
  //      this.info.error = r.error;
  //      this.info.failed += 1;
  //      if (this.info.failed + this.info.succeeded === this.info.n) {
  //        this.info.cb({succeeded: false, error: this.info.error});
  //      }
  //    }
  //  }.bind({info: info, pt: props[i]}), false);
  //}
  //return recursive;
}
