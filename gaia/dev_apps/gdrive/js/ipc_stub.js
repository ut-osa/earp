'use strict';
const CLIENT_ID = '67942581711-3g3s7m3489883kftb999fj94l8ce89bl.apps.googleusercontent.com';
const  SCOPES = 'https://www.googleapis.com/auth/drive';
const  TABLE = 'files';
// thunt
const DEBUG = true;
function debug(st){
  console.log(st);
}

/*
 * Google Dive Communication Stuff
 */
function handleClientLoad(){
  window.setTimeout(checkAuth, 1);
}
function checkAuth(){
  gapi.auth.authorize(
      {'client_id': CLIENT_ID, 'scope': SCOPES, 'immediate': true},
      handleAuthResult);
}

/**
 * Called when authorization server replies.
 *
 * @param {Object} authResult Authorization result.
 */
function handleAuthResult(authResult) {
  if (!authResult || authResult.error) {
    gapi.auth.authorize(
         {'client_id': CLIENT_ID, 'scope': SCOPES, 'immediate': false},
         handleAuthResult);
  }
}

/*
 * mostly coppied from google's example in the dev docs
 * (https://developers.google.com/drive/v2/reference/files/update)
 */
function updateFile(fileId, fileMetadata, fileData, callback) {
  const boundary = '-------314159265358979323846';
  const delimiter = "\r\n--" + boundary + "\r\n";
  const close_delim = "\r\n--" + boundary + "--";

  var reader = new FileReader();
  reader.readAsBinaryString(fileData);
  reader.onload = function(e) {
    var contentType = fileData.type || 'application/octet-stream';
    // Updating the metadata is optional and you can instead use the value from drive.files.get.
    var base64Data = btoa(reader.result);
    var multipartRequestBody =
        delimiter +
        'Content-Type: application/json\r\n\r\n' +
        JSON.stringify(fileMetadata) +
        delimiter +
        'Content-Type: ' + contentType + '\r\n' +
        'Content-Transfer-Encoding: base64\r\n' +
        '\r\n' +
        base64Data +
        close_delim;

    var request = gapi.client.request({
        'path': '/upload/drive/v2/files' + (fileId ? '/'+fileId :''),
        'method': (fileId ? 'PUT' : 'POST'),
        'params': {'uploadType': 'multipart', 'alt': 'json'},
        'headers': {
           'Content-Type': 'multipart/mixed; boundary="' + boundary + '"'
        },
       'body': multipartRequestBody});
    if (!callback) {
      callback = function(file) {
        console.log(file)
      };
    }
    request.execute(callback);
  }
}

function buildq(pfx, mpfx){
  var retpfx, retmpfx;
  if(pfx) retpfx = "title contains '"+pfx+"'";
  if(mpfx) retmpfx = "mimeType contains '"+mpfx+"/'";
  return (retpfx && retmpfx) ? retpfx+" and "+retmpfx : (retpfx || retmpfx);
}

function parse_md_objs(objs, full){
  var name, prefix, desc;
  function parse_title(title){
    var t = title.split("__");
    switch(t.length){
      case 0:
        throw new Error("Impossible!");
      case 1:
        name = t[0]; prefix = null; desc = null;
        break;
      case 2:
        prefix = t[0]; name = t[1]; desc = null;
        break;
      case 3:
      default:
        prefix = t[0]; name = t[1]; desc = t[2];
    }
  }
  return objs.map(function(file){
    parse_title(file.title);
    return {id:       file.id,
            clildOf:  file.parents[0] ? file.parents[0].id : undefined, 
            prefix: prefix,
            name: name,
            mimeType: file.mimeType,
            mimePref: file.mimeType.split("/")[0],
            desc: desc,
            link: full ? file.downloadUrl : undefined};

  });
}

function get(full, pfx, mpfx, cb){
  gapi.client.load('drive', 'v2', function(){
     var request = gapi.client.request({
       'path': 'drive/v2/files',
       'method': 'GET',
       'params': {q: buildq(pfx, mpfx)}
     });
     request.execute(function(res){
       var ret = parse_md_objs(res.items, full);
       if(full && ret.length > 0){
          var count = 0;
          ret.forEach(function(file){
            var req = new XMLHttpRequest();
            req.open('GET', file.link);
            req.setRequestHeader('Authorization',
                                 'Bearer '+gapi.auth.getToken().access_token);
            req.responseType = 'blob';//(file.mimeType.split("/")[0] === 'text' ? "text" : "blob");
            req.onload = function(){
              file.content = req.response;
              delete file.link;
              if(++count === ret.length){
                cb(ret);
              }
            }
            req.onerror = function(){
              console.error(file_download, req.error.name);
              cb(null);
            }
            req.send();
           });
        }
        else{
           cb(ret);
        }
     });
  });
}

function rm(val, cb){
  if(!val.id){
    cb(false);
    return;
  }
  var request = gapi.client.drive.files.delete({'fileId': val.id});
  request.execute(function(resp) {
     cb(resp.result);
  });
}

function mod(val, cb){
  if(!val.id){
    console.warn('drive mod got a value with no id!');
    cb(false);
    return;
  }
  var fileId = val.id, fileData = val.content;
  console.log(val.content.type);
  var fileMetadata = {
     mimeType: val.mimeType,
     parents: val.childOf ? [val.childOf] : [],
     title: val.prefix + "__" + val.name + "__" + val.desc,
  };
  updateFile(fileId, fileMetadata, fileData, function(resp){
     cb(resp.id === val.id);
  });
}

function create(val, cb){
  var fileData = val.content;
  var fileMetadata = {
     mimeType: val.mimeType,
     parents: val.childOf ? [val.childOf] : [],
     title: val.prefix + "__" + val.name + "__" + val.desc,
  };
  updateFile(null, fileMetadata, fileData, function(resp){
     cb(resp);
  });
}

function test_create(){
   create({content: "seems to work", desc: "test_file", name: "191921"}, function(id){
      console.log('id', id);
   });
}
function test_list(){
   get(false, function(){});
}


function parse_where(where, att){
  if(!where) return undefined;
  switch(where.type){
    case '=':
      return where[att];
    case 'AND':
      return parse_where(where.term1) || parse_where(where.term2);
    case 'OR':
      return parse_where(where.term1) || parse_where(where.term2);
    default:
      throw new Error("Unsupported whre op");
  }
}

var cache;
var ipc_ops = {
  list: function(req) {
    if(req.clientOp !== 'query' && cache){
      req.list(cache);
      req.notifySuccess();
      return;
    }
    var tabs = req.getTabs();
    if(DEBUG) debug(tabs[0]);
    if(tabs.length !== 1 || tabs[0] !== TABLE){
       console.error('table should be \'files\'');
       req.notifyFailure();
       return;
    }
    var dl_content = false;
    var prefix   = parse_where(req.securityWhere, 'prefix')   ||
                   parse_where(req.originalWhere, 'prefix');
    var mimePref = parse_where(req.securityWhere, 'mimePref') || 
                   parse_where(req.originalWhere, 'mimePref');
    for(var col of req.getCols()){
       if(col === 'content' || col === '*') dl_content = true;
    }
    get(dl_content, prefix, mimePref, function(res){
      cache = res;
      if(res){
        req.list(res);
        req.notifySuccess();
      }
      req.notifyFailure();
    });
  },

  remove: function(req) {
    if(req.tab !== TABLE){
      console.error('table should be \'files\'');
      req.notifyFailure();
      return;
    }
    rm(req.val, function(good){
      if(good) req.notifySuccess();
      else req.notifyFailure();
    });
  },

  alter: function(req) {
    if(req.tab !== TABLE){
      console.error('table should be \'files\'');
      req.notifyFailure();
      return;
    }
    var newVal = {};
    for(var col in req.val){
       newVal[col] = req.val[col];
    }
    for(var col in req.updatedCols){
       if(col === 'id'){
         req.notifyFailure();
         return;
       }
       newVal[col] = req.updatedCols[col];
    }
    mod(newVal, function(good){
      if(good) req.notifySuccess();
      else req.notifyFailure();
    });
  },

  add: function(req) {
    if(req.tab != TABLE){
      console.error('table should be \'files\'');
      req.notifyFailure();
      return;
    }
    create(req.val, function(good){
      if(good) req.notifySuccess();
      else req.notifyFailure();
    });
  }
};

var bench_prefix = "_drivenote.gaiamobile.org"
function getAll(GetContent, cb){
  var begin = performance.now();
  get(GetContent, bench_prefix, null, function(res){
    var end = performance.now();
    document.getElementById('time').innerHTML = "Get: " + (end - begin);
    document.getElementById('results').innerHTML = JSON.stringify(res);
    if(cb) cb(res);
  });
}

function getPics(){
  var begin = performance.now();
  get(true, null, 'image', function(res){
    var end = performance.now();
    document.getElementById('time').innerHTML = 'Photos: ' + (end -begin);
    console.log('got', res.length, 'photos');
  });
}

function blob_to_text(blob, cb){
  var reader = new FileReader();
  reader.onloadend = function(){
    cb(reader.result);
  }
  reader.readAsText(blob);
}

function modAll(){
  getAll(true, function(res){
    var count = 0;
    for(var elem of res){
      blob_to_text(elem.content, function(text){
        this.content = new Blob([text.split('').reverse().join('')],
                                {type: this.mimeType});
        if(++count >= res.length)
          _upload(res);
      }.bind(elem));
    }
  });
  function _upload(items){
    var count = 0;
    var begin = performance.now();
    for(var elem of items){
      mod(elem, function(good){
        if(good){
          if(++count < items.length) return;
          var end = performance.now();
          document.getElementById('time').innerHTML = "Mod: " + (end - begin);
        }
        else{
          alert('something went wrong!');
        }
      });
    }
  }
}

function genString(len)
{
  var text = "";
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for( var i=0; i < (len || 8); i++ )
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  return text;
}

const SIZE = 1628;
const TOTAL = 10;
function createTen() {
  var val = {
    content: new Blob([genString(SIZE)], {type: "text/plain"}),
    mimeType: "text/plain",
    prefix: "file_insert_prefix",
    desc: "some_desc",
  }
  var count = 0;
  var begin = performance.now();
  for (var i = 0; i < TOTAL; ++i) {
    val.name = genString(8);
    create(val, function(good){
      if(good){
        if (++count >= TOTAL) {
          var end = performance.now();
          document.getElementById('time').innerHTML = "Insert: " + (end - begin);
        }
      } else {
        throw "Create failed!";
      }
    });
  }
}

/*
* Schema:
*  file: {id: TEXT, prefix: TEXT, desc: TEXT, childOf: TEXT, name: TEXT,
*         mimeType: TEXT, mimePref: TEXT, content: TEXT}
*  is_dir is 1 if file is a directory, one otherwise
*/
var ias = registerPortInterAppService("GDrive", ipc_ops);

/* DRIVE NOTE */
ias.setPolicyForApp("app-drivenote.gaiamobile.org",
    {files: {cols: 'desc,name,content', insertable: true, queryable: true,
             deletable: true, fixedCols:{ prefix: "_drivenote.gaiamobile.org"},
             where: {type:'=',
                                    prefix: "_drivenote.gaiamobile.org"},
            }
    }
);

/* GALLERY++ */
ias.setPolicyForApp("app-rdb_gallery.gaiamobile.org",
    {files: {cols: 'desc,name,content,mimeType,mimePref',insertable: false,
              queryable: true, deletable: false}
    }
);
