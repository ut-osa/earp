/* -*- Mode: Java; tab-width: 2; indent-tabs-mode: nil; c-basic-offset: 2 -*- /
/* vim: set shiftwidth=2 tabstop=2 autoindent cindent expandtab: */

'use strict';

/**
 * This file defines an asynchronous version of the localStorage API, backed by
 * an IndexedDB database.  It creates a global asyncStorage object that has
 * methods like the localStorage object.
 *
 * To store a value use setItem:
 *
 *   asyncStorage.setItem('key', 'value');
 *
 * If you want confirmation that the value has been stored, pass a callback
 * function as the third argument:
 *
 *  asyncStorage.setItem('key', 'newvalue', function() {
 *    console.log('new value stored');
 *  });
 *
 * To read a value, call getItem(), but note that you must supply a callback
 * function that the value will be passed to asynchronously:
 *
 *  asyncStorage.getItem('key', function(value) {
 *    console.log('The value of key is:', value);
 *  });
 *
 * Note that unlike localStorage, asyncStorage does not allow you to store and
 * retrieve values by setting and querying properties directly. You cannot just
 * write asyncStorage.key; you have to explicitly call setItem() or getItem().
 *
 * removeItem(), clear(), length(), and key() are like the same-named methods of
 * localStorage, but, like getItem() and setItem() they take a callback
 * argument.
 *
 * The asynchronous nature of getItem() makes it tricky to retrieve multiple
 * values. But unlike localStorage, asyncStorage does not require the values you
 * store to be strings.  So if you need to save multiple values and want to
 * retrieve them together, in a single asynchronous operation, just group the
 * values into a single object. The properties of this object may not include
 * DOM elements, but they may include things like Blobs and typed arrays.
 *
 * Unit tests are in apps/gallery/test/unit/asyncStorage_test.js
 */

// TH: replaced with rdb backend
var wrapCursor = function(cursor, callback) {
  this.cursor = cursor;
  this.cb = callback;
};

wrapCursor.prototype = {
  _set_self: function(row){
    this.value = JSON.parse(this.cursor.getByName('value'));
    this.key = this.cursor.getByName('key');
  },
  advance: function(steps){
    while(this.cursor.next()){
      if(steps-- === 0){
        this._set_self(this.cursor.row);
        this.cb(this);
        return;
      }
    }
    this.cb(null);
  },
  continue: function(){
    if(this.cursor.next()){
      console.log("In prototype continue");
      this._set_self();
      this.cb(this);
      return;
    }
    this.cb(null);
  },
  delete: function(){throw "delete not implemented";},
  update: function(){throw "update not implemented";},
};

this.asyncStorage = (function() {
  var DBNAME = 'ignitetm_quick_note';
  var DBCOLS = ['key', 'value'];
  var DBTYPES = ['TEXT', 'TEXT'];
  var TABLENAME = 'note';
  var db = null;

  function withStore(f) {
    if (db) {
      f(db);
    } else {
      var openreq = new mozrRDB(DBNAME,
        "67942581711-3g3s7m3489883kftb999fj94l8ce89bl.apps.googleusercontent.com",
        "https://www.cs.utexas.edu/~thunt/test.html",
        ["profile","https://www.googleapis.com/auth/drive"]); 

      openreq.onerror = function() {
        console.error("asyncStorage: can't open database:", openreq.error.name);
      };
      openreq.onsuccess = function() {
        //var createreq = openreq.createTable(TABLENAME, DBCOLS, DBTYPES, null);
        //createreq.onerror = function(e){
          //console.error("asyncStorage: can't open database:", 
          //               createreq.error.name);
        //};
        //createreq.onsuccess = function(e){
          db = openreq;
          f(db);
      };
      //};
    }
  }

  function getItem(key, callback) {
    console.log("calling getItem");
    withStore(function(store) {
      var req = store.query([TABLENAME], ['*'], {type: '=', key: key}, null);
      req.onsuccess = function(e) {
        if(req.next()){
          console.log("in success");
          var value = JSON.parse(req.getByName('value'));
        }
        if (value === undefined)
          value = null;
        callback(value);
      };
      req.onerror = function getItemOnError() {
        console.error('Error in asyncStorage.getItem(): ');
      };
    });
  }

  function setItem(key, value, callback) {
    console.log("calling setItem");
    removeItem(key, function(){
      withStore(function(store) {
        console.log("about to call insert");
        var req = store.insert(TABLENAME, {value: JSON.stringify(value), 
                                           key: key});
        console.log("just called insert");
        if (callback) {
          req.onsuccess = function(e) {
            callback();
          };
        }
        req.onerror = function(e) {
          console.error('Error in asyncStorage.setItem(): ', req.error.name);
        };
      });
    });
  }

  function removeItem(key, callback) {
    console.log("calling removeItem");
    withStore(function(store) {
      var req = store.delete(TABLENAME, {type: "=", key: key});
      if (callback) {
        req.onsuccess = function(e) {
          callback();
        };
      }
      req.onerror = function(e) {
        console.error('Error in asyncStorage.removeItem(): ', req.error.name);
      };
    });
  }

  function clear(callback) {
    console.log("calling clear");
    withStore('readwrite', function clearBody(store) {
      var req = store.delete(TABLENAME, null);
      if (callback) {
        req.onsuccess = function clearOnSuccess() {
          callback();
        };
      }
      req.onerror = function clearOnError() {
        console.error('Error in asyncStorage.clear(): ', req.error.name);
      };
    });
  }

  function length(callback) {
    console.log("calling length");
    withStore('readonly', function lengthBody(store) {
      var req = store.query([TABLENAME], "COUNT (*)", null, null);
      req.onsuccess = function(e) {
        var res = 0;
        if(req.next())
          res = req.getByIndex(0);
        callback(res);
      };
      req.onerror = function lengthOnError() {
        console.error('Error in asyncStorage.length(): ', req.error.name);
      };
    });
  }

  function key(n, callback) {
    console.log("calling key");
    if (n < 0) {
      callback(null);
      return;
    }

    withStore(function(store) {
      var advanced = false;
      var req = store.query([TABLENAME], ['key'], null, null);
      req.onsuccess = function() {
        var res = null;
        while(req.next()){
          if(n-- === 0){
            res = req.row.key;
            break;
          }
        }
        callback(res);
      }
      req.onerror = function keyOnError() {
        console.error('Error in asyncStorage.key(): ', req.error.name);
      };
    });
  }

  function cursor(startRecordIndex, callback) {
    console.log("calling cursor");
    if (startRecordIndex < 0) {
      callback(null);
      return;
    }

    withStore(function(store) {
      var req = store.query([TABLENAME], ['*'], null, null);
      req.onsuccess = function(e){
        var cursor = new wrapCursor(req, callback);
        cursor.continue();
      };
      req.onerror = function(e){
        console.error('Error in asyncStorage.cursor(): ', req.error.name);
      };
    });
  }

  return {
    getItem: getItem,
    setItem: setItem,
    removeItem: removeItem,
    clear: clear,
    length: length,
    key: key,
    cursor: cursor
  };
}());
