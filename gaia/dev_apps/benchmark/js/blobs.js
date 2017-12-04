var blobs_result, inserted, photordb, simple_mediadb, schema;
var sdcard, rawdbdirhandle;
var isPhone = true;
var begin;

var photo_names_inserted = [];

const CONFIG_MAX_IMAGE_PIXEL_SIZE = 10000000000000000;

function metadataParserWrapper(file, onsuccess, onerror, bigFile) {
  metadataParser(file, onsuccess, onerror, bigFile);
}

function genString(len)
{
  var text = "";
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for( var i=0; i < (len || 8); i++ )
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  return text;
}

function init_databases(){
  photordb = new RMediaDB('pictures', null, {autoscan: false});
  simple_mediadb = new MediaDB('sdcard', null, {autoscan: false});
  sdcard = navigator.getDeviceStorage('sdcard');
  var _db = navigator.getRDB("testfileDIRdb");
  _db.onsuccess = function() {
    var __schema = new RDBSchema(_DIRSCHEMA); /* from js/files.js */
    __schema.createSchema(_db, function(res) {
        if(res.succeeded) {
          var desc = _db.getDesc();
          var req = __schema.insertObj(desc, "file", {DIRname: "photos"});
          req.onsuccess = function() {
            var cursor = desc.query(["file"], ["DIRname"], null, null);
            cursor.onsuccess = function() {
              cursor.next();
              rawdbdirhandle = cursor.getDirDS("DIRname");
              cursor.reset();
              console.log("SUCCESSFULLY GOT DIR HANDLE");
            }
            cursor.onerror = function () {
              throw "problem with query";
            }
          }
          req.onerror = function() {
            throw "problem with insert";
          }
        }
        else {
          throw "issue with createSchema";
        }
      });
  }
  _db.onerror = function () {
    throw this.error;
  }
}

function retrievePhoto(url, callback){
  var req = new XMLHttpRequest();
  req.open('GET', url, true);
  req.responseType = 'blob';
  req.onerror = function(){
    callback(null);
  };
  req.onload = function(){
    callback(req.response);
  };
  req.send();
}

function getInfo(blob, callback){
  var fileinfo = {
    name: genString(8),
    type: blob.type,
    size: blob.size,
    date: Date.now()
  };

  metadataParser(blob, gotMetadata, metadataError, null);
  function gotMetadata(md){
    fileinfo.metadata = md;
    callback(fileinfo);
  }
  function metadataError(e){
    throw e.error;
  }
}

function storePhotoOld(blob, fileinfo, cb){
    var good = function(){
      cb(true);
    };
    var bad = function(msg){
      throw new Error("media db doesn't like us:" + msg);
    }
    simple_mediadb.wholeInsert(fileinfo.name, blob, fileinfo, good, bad);
}

function storePhotoNew(blob, fileinfo, cb){
  var filetree = {
    tab: 'photo',
    obj: {
      name:     fileinfo.name,
      BLOBdata: blob,
      type:     fileinfo.type,
      size:     fileinfo.size,
      date:     fileinfo.date,
      Mtype:    fileinfo.metadata.type || null,
      width:    fileinfo.metadata.width || null,
      height:   fileinfo.metadata.height || null,
      BLOBthumbnail: fileinfo.metadata.thumbnail || null
    }
  };

  photordb.wholeInsert(filetree, function(){cb(true);}, function(){cb(false);});
}

function storePhotoRawOld(blob, fileinfo, cb){
  var req = sdcard.addNamed(blob, fileinfo.name);
  req.onsuccess = function(){cb(true);};
  req.onerror = function(){cb(false);};
}

function storePhotoRawNew(blob, fileinfo, cb){
  var req = rawdbdirhandle.addNamed(blob, fileinfo.name);
  req.onsuccess = function(){cb(true);};
  req.onerror = function(){cb(false);};
}

function doStore(count, store, url, cb, trash_names){
  retrievePhoto(url, function(blob){
    blob.name = 'testimg.png';
    getInfo(blob, function(fileinfo){
      begin = performance.now();
      var insert_photo = function() {
        fileinfo.name = genString(8) + '.png';
        if (!trash_names) {
          photo_names_inserted.push(fileinfo.name);
        }
        store(blob, fileinfo, function(good){
          if(!good){
            console.log('issue with store');
            cb(false);
          }
          else{
            count -= 1;
            if (count < 0) cb(true);
            else insert_photo();
          }
        });
      };
      insert_photo();
    });
  });
}

function saveBlobs(url, method){
  var number = parseInt(document.getElementById("blobs-number").value);

  doStore(number, method, url, function(good, error){
    var end = performance.now();
    if(!good){
      throw new Error('something unexpected: ' + error);
    }
    blobs_result.innerHTML = "" + (end - begin);
  });
}

function getBlobs(db){
  var count = parseInt(document.getElementById("blobs-number").value);
  console.log(count, "blobs to receive");
  function good(res){
    count -= 1;
    if(count <= 0){
      var end = performance.now()
      blobs_result.innerHTML = "" + (end - begin);
    }
    else getBlobsInternal();
  }
  function bad(res){
    throw new Error('problem fetching blob');
  }
  function getBlobsInternal(){
    db.getRecord(photo_names_inserted.shift(), good, bad);
  }
  begin = performance.now();
  getBlobsInternal();
}

// insert
function saveBlobsNewSmall(){
  saveBlobs('img/ut_longhorn.png', storePhotoNew);
}
function saveBlobsNewLarge(){
  saveBlobs('img/earth-huge.png', storePhotoNew);
}
function saveBlobsOrigSmall(){
  saveBlobs('img/ut_longhorn.png', storePhotoOld);
}
function saveBlobsOrigLarge(){
  saveBlobs('img/earth-huge.png', storePhotoOld);
}

function saveBlobsRawNewSmall(){
  saveBlobs('img/ut_longhorn.png', storePhotoRawNew, true);
}
function saveBlobsRawNewLarge(){
  saveBlobs('img/earth-huge.png', storePhotoRawNew, true);
}
function saveBlobsRawOrigSmall(){
  saveBlobs('img/ut_longhorn.png', storePhotoRawOld, true);
}
function saveBlobsRawOrigLarge(){
  saveBlobs('img/earth-huge.png', storePhotoRawOld, true);
}

function clear_storage() {
  var cursor = sdcard.enumerateEditable();

  cursor.onsuccess = function () {
    var file = this.result;
    console.log("File updated on: " + file.lastModifiedDate);

    // Once we found a file we check if there are other results
    if (!this.done) {
      // Then we move to the next result, which calls the cursor
      // success with the next file as result.
      this.continue();
    }
  }
}

//query
function getBlobsOrig(){
  getBlobs(simple_mediadb);
}
function getBlobsNew(){
  getBlobs(photordb);
}

function clearAll(){
  photo_names_inserted = [];
  function good(){
    console.log('cleared!');
  }
  function bad(){
    throw new Error('error on clear!!!');
  }
  photordb.clear(good, bad);
  simple_mediadb.clear(good, bad);
}

document.addEventListener('DOMContentLoaded', function(){
  blobs_result = document.getElementById("blobs-result");
  document.getElementById("blobs-save-new").onclick = saveBlobsNewSmall;
  document.getElementById("blobs-save-new-big").onclick = saveBlobsNewLarge;
  document.getElementById("blobs-save-orig").onclick = saveBlobsOrigSmall;
  document.getElementById("blobs-save-orig-big").onclick = saveBlobsOrigLarge;

  document.getElementById("blobs-save-raw-new-small").onclick = saveBlobsRawNewSmall;
  document.getElementById("blobs-save-raw-new-large").onclick = saveBlobsRawNewLarge;
  document.getElementById("blobs-save-raw-orig-small").onclick = saveBlobsRawOrigSmall;
  document.getElementById("blobs-save-raw-orig-large").onclick = saveBlobsRawOrigLarge;

  document.getElementById("blobs-get-new").onclick = getBlobsNew;
  document.getElementById("blobs-get-orig").onclick = getBlobsOrig;
  document.getElementById("blobs-clear").onclick = clearAll;
  init_databases();
}, false);
