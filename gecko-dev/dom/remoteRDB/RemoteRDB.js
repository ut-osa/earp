// vim: set filetype=javascript tabstop=2 shiftwidth=2:
/*
 * RemoteRDB.js
 *
 * thunt
 */
"use strict";
//let's do single callbacks all the time
const DEBUG = false;

/* database info */
const DB_NAME   = "oauth_creds";
const TABLE     = "google";
const TOKEN     = "token";
const CLIENT_ID = "client_id";

const GOOGLE_OAUTH = "https://accounts.google.com/o/oauth2/auth"
const file_upload_url = "https://www.googleapis.com/upload/drive/v2/files?uploadType=multipart";
const files_endpoint = "https://www.googleapis.com/drive/v2/files"
const file_delete_url = "https://www.googleapis.com/drive/v2/files/"

const termRGX = /term\d+/i;

function debug(s) { dump("-*- rRDBManager: " + s + "\n"); }

const driveNames = { key: "title", value: "content", id: "id"}

const Cc = Components.classes;
const Ci = Components.interfaces;
const Cu = Components.utils;

Cu.import("resource://gre/modules/XPCOMUtils.jsm");
Cu.import("resource://gre/modules/Services.jsm");
Cu.import("resource://gre/modules/Oauth.jsm");
Cu.import("resource://gre/modules/DOMRequestHelper.jsm");

XPCOMUtils.defineLazyServiceGetter(Services, "DOMRequest",
                                   "@mozilla.org/dom/dom-request-service;1",
                                   "nsIDOMRequestService");
XPCOMUtils.defineLazyModuleGetter(this, "SystemAppProxy",
                                  "resource://gre/modules/SystemAppProxy.jsm");
function rRDBCursor() {};

rRDBCursor.prototype = {
  __proto__: DOMRequestIpcHelper.prototype,

  row: {},

  __init: function(){
    this.cache = [];
  },
  set_cache: function(cache){
    this.cache = cache;
  },
  next: function(){
    if(this.row = this.cache.shift()){
      return true;
    }
    else
      return false;
  },
  getByName: function(name){
    return this.row[name];
  },
  classID: Components.ID("{72b5ff28-82d8-4af8-90b3-ae935396cc66}"),
  contractID: "@mozilla.org/rRDBcursor;1",
  QueryInterface: XPCOMUtils.generateQI([Ci.nsISupports]),
};

////////// mozrRDB impl ///////////// 
function rRDB() {}

const INIT = "init";
const READY = "ready";
const FAILED = "failed";

rRDB.prototype = {
  __proto__: DOMRequestIpcHelper.prototype,
  get console(){
    return this._window.console;
  },


  state: INIT,
  // call relavant handlers
  ready: function(){
    this.state = READY;
    if(this.onready){
      this.onready.call(this);
    }
    if(this.onsuccess){
      this.onsuccess.call(this);
    }
  },

  failed: function(){
    this.state = FAILED;
    if(this.onerror){
      this.onerror.call(this);
    }
  },

  init: function(aWindow){
    this._window = aWindow;
  },

  /*
   * Constructor (chrome only)
   * @param target: oauth token getting endpoint
   * @param clienId: requesting app's registered client id
   * @param redirectURI: requesting app's registered token recieving
   *                     endpoing
   * @param scopes: scopes requested for this session (oauth provider specific)
   * @param aWindow: app's window; used to find the system window and send
   *                 event to trigger flow
   */
  __init: function(name, clientId, redirectURI, scopes) {
    this.name = name;
    
    this.oauth_manager = new Oauth(GOOGLE_OAUTH,
                                   clientId, 
                                   redirectURI, 
                                   scopes, 
                                   this._window,
                                   this.ready.bind(this),
                                   this.failed.bind(this));

    this.oauth_manager.init();
  },
  where2driveQuery: function(obj, prefix){
    // god this is sloppy...at least I only have to look
    // through once
    var terms = [], left, right;
    for(var t in obj){
      if(t.match(termRGX))
        terms.push(where2driveQuery(obj[t]));
      else if(t !== 'type'){
        left = driveNames[t];
        right = obj[t];
        if(left === 'title')
          right = prefix+right;
      }
    }
    var type = obj.type.toLowerCase();
    switch(type){
      case ">":
      case "<":
      case "<=":
      case ">=":
        this.console.warn(type + "is only supported for dates");
      case "=":
      case "!=":
        return left+" "+type+" '"+right+"'";
      case "and":
      case "or":
        return "(" + terms.join(") "+type+" (") + ")";
      case "not":
        return "not " + terms[0]; // we only allow not to be unary
      case "like":
      // not supported 
      default:
        throw "Where type not supported: " + type;
    }
  },
 
  where2query: function(obj, prefix){
    return encodeURIComponent(this.where2driveQuery(obj, prefix));
  },

 
  blob_to_string: function blob_to_string(blob, callback){
    var reader = new FileReader();
    reader.readAsBinaryString(blob);
    reader.onload = function() {
      callback(blob.type || 'application/octet-stream', btoa(reader.result),
               'base64');
    }
  },
  
  upload: function upload(metadata, data, callback) {
    var self = this;
    const boundary = 'hopefullyunfound-6464440604161';
    const delimiter = "\r\n--" + boundary + "\r\n";
    const close_delim = "\r\n--" + boundary + "--";
    
    function upload_string(type, string, encoding){
      metadata.mimetype = type
      var body = delimiter + 'Content-Type: application/json\r\n\r\n' +
                 JSON.stringify(metadata) +
                 // data
                 delimiter + 'Content-Type: ' + type +
                 (encoding ? '\r\nContent-Transfer-Encoding: '+encoding : '' )+
                 '\r\n\r\n' + string + close_delim;
      var headers = {};
      headers['Content-Type'] = 'multipart/mixed; boundary="' + boundary + '"';
      self.oauth_manager.do_xhr(file_upload_url, 'POST', 'json', headers,
                                body, callback);
    }
    if(typeof data === 'string'){
      upload_string('txt/plain', data);
    }
    else {
      // we assume blob
      self.blob2string(data, upload_string);
    }
  },

  correct_key: function(file){
    var i = file.key.indexof('/');
    if(i !== -1)
      file.key = file.key.slice(i);
  },

  fill_cache: function(files, cols, callback){
    var self = this;
    
    if(! files || files.length === 0){
      callback([]);
      return;
    }
    var cache = [];
    var to_insert = (cols[0] === "*" ? ['key','value'] : cols);
    var doDownload = false;

    for(var val of to_insert){
      switch(val){
        case "id":
          for(var i = 0; i < files.length; ++i){
            if(! cache[i]){
              cache[i] = {};
            }
            cache[i][val] = files[i][driveNames[val]];
          }
          break;
        case "key":
          for(var i = 0; i < files.length; ++i){
            if(! cache[i]){
              cache[i] = {};
            }
            cache[i][val] = files[i][driveNames[val]];
            cache[i][val] = cache[i][val].slice(cache[i][val].indexOf('/')+1);
          }
          break;
        case "value":
          doDownload = true;
          break;
        default:
          throw new Error("Unknown column");
      }
    }
    
    if(doDownload){
      var count = files.length;
      var build_callback = function(obj){
        return function(status, response){
          if(status < 200 || status >= 300 || !response){
            callback([]);
          }
          else{
            obj["value"] = response;
            if(! --count){
              callback(cache);
            }
          }
        };
      }
      for(var i = 0; i < files.length; i++){
        self.oauth_manager.do_xhr(files[i].downloadUrl, 'GET', null,
                                  null, null,
                                  build_callback(cache[i], files[i]));
      }
    }
    else{ 
      callback(cache);
    }
  },


  delete_file: function detete_file(id, callback){
    var self = this;
    this.oauth_manager.do_xhr(file_delete_url + id, 'DELETE', 'json', null, null,
        function(status, response){
          if(status < 200 || status >= 300){
            callback(false);
          }
          else
            callback(true);
        });
  },
  /****** API calls ****/
  // Database looks like this:
  // table(pk INT, key TEXT, value TEXT)
  // We're going to store the value as a
  // text blob on the user's google drive
  // with table.key as the name of the file
  insert: function(table, vals){
    var self = this;
    let request = self.createRequest();
    let metadata = {
      title: self.name + '-' + table + '/' + vals.key,
    }

    self.upload(metadata, vals.value, function(status, response){
      if(status < 200 || status >= 300 || response.title != metadata.title){
        Services.DOMRequest.fireError(request, "upload resulted in error");
      }
      else{
        Services.DOMRequest.fireSuccess(request, null);
      }
    });
    return request;
  },

  query: function(tables, columns, where, orderBy){
    var self = this;
    let cursor = self._window.mozrRDBCursor();
    let prefix = self.name + '-' + tables[0] + '/';
    let endpoint = files_endpoint;

    // on drive we distinguish tables by a prefix
    endpoint += "?q=" + encodeURIComponent("title contains '" + prefix + "'");

    if(where)
      endpoint += encodeURIComponent(' and ') + self.where2query(where, prefix);
    
    //call the api get a list of files
    self.oauth_manager.do_xhr(endpoint, 'GET', 'json', null, null,
     function(status, response){
      if(status < 200 || status >= 300){
        if(cursor.onerror)
          cursor.onerror();
      } else {
        self.fill_cache(response.items, columns, function(cache){
          cursor.set_cache(cache);
          if(cursor.onsuccess)
            cursor.onsuccess();
        });
      }
    });
    return cursor;
  },

  delete: function(table, where){
    var self = this;
    let request = this.createRequest();

    var query = this.query([table], ["id"], where);
    query.onsuccess = function(e){
      if(query.next()){
        self.delete_file(query.getByName("id"), function(good){
          if(good)
            Services.DOMRequest.fireSuccess(request, null);
          else
            Servieces.DOMRequest.fireError(request, null);
        });
      }
      else
        Services.DOMRequest.fireSuccess(request, null);
    };
    query.onerror = function(e){
      Services.DOMRequest.fireError(request, null);
    };

    return request;
  },

  update: function(table, where, vals){
    var self = this;
    let request = this.createRequest();
    return request;
  },

  classID: Components.ID("{72b5ee28-81d8-4af8-90b3-ae935396cc66}"),
  contractID: "@mozilla.org/rRDB;1",
  QueryInterface: XPCOMUtils.generateQI([Ci.nsIDOMGlobalPropertyInitializer]),
};

this.NSGetFactory = XPCOMUtils.generateNSGetFactory([
  rRDBCursor, rRDB
]);
