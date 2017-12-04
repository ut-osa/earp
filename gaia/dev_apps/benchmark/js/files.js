var files_result;
var _filenames = [];

const _SCHEMA = {file: {name: 'TEXT', BLOBdata: 'FILEBLOB', acl: true}};
const _DIRSCHEMA = {file: {DIRname: 'DIR', acl: true}};
const N_FILES = 100;



function createFiles(){
  var sdcard = navigator.getDeviceStorage('sdcard');
  var file = new Blob([""]/*, {type: "text/plain"}*/);
  var count = N_FILES;
  var begin;
  function again() {
    if (count) {
      count -= 1;
      var request = sdcard.addNamed(file, _filenames[count]); request.onsuccess = again;
      request.onerror = function() {
        console.warn("SOMETHING WENT WRONG: " + this.error.name);
      };
    }
    else {
      var end = performance.now();
      var total = end - begin;
      files_result.innerHTML = "Native " + total;
    }
  }

  begin = performance.now();

  again();
}

function deleteFiles(){
  var sdcard = navigator.getDeviceStorage('sdcard');
  var count = N_FILES;
  var begin;

  function again() {
    if (count) {
      count -= 1;
      var request = sdcard.delete(_filenames[count]);
      request.onsuccess = again;
      request.onerror = function() {
        console.warn("SOMETHING WENT WRONG: " + this.error.name);
      };
    }
    else {
      var end = performance.now();
      var total = end - begin;
      files_result.innerHTML = "Native " + total;
    }
  }

  begin = performance.now();

  again();
}

function createFilesDB(){
  var file = new Blob([""], {type: "text/plain"});
  var count = N_FILES;
  var begin;
  var dbs;
  var _schema = new RDBSchema(_SCHEMA);
  var open_req = navigator.getRDB("testfiledb");
  open_req.onsuccess = function() {
      db = open_req;
    function again() {
      if (count) {
        count -= 1;
        var obj = {name: _filenames[count], BLOBdata: file};
        var req = _schema.insertObj(dbs, "file", obj);
        req.onsuccess = again;
        req.onerror = function() {
          Console.error("SOMETHING WENT WRONG");
        };
      }
      else {
        var end = performance.now();
        var total = end - begin;
        files_result.innerHTML = "DB " + total;
      }
    }
    _schema.createSchema(db, function(res) {
      if(res.succeeded) {
        dbs = db.getDesc();
        begin = performance.now();
        again();
      }
    });
  };
}

function createFilesDBDir(){
  var file = new Blob([""], {type: "text/plain"});
  var count = N_FILES;
  var begin;
  var dbs;
  var dir;
  var _schema = new RDBSchema(_DIRSCHEMA);
  var open_req = navigator.getRDB("testfileDIRdb");
  var cursor;
  open_req.onsuccess = function() {
    db = open_req;
    function again() {
      if (!dir) {
        begin = performance.now();
        var cursor = dbs.query(["file"], ["DIRname"], null, null)
        cursor.onsuccess = function() {
        cursor.next();
        dir = cursor.getDirDS("DIRname");
        cursor.reset();
        again();
        };
        cursor.onerror = function() {
        throw "Cursor returned error";
        };
      }
      else if (count) {
        count -= 1;
        var req = dir.addNamed(file, _filenames[count]);
        req.onsuccess = again;
        req.onerror = function() {
          console.error("SOMETHING WENT WRONG");
        };
      }
      else {
        var end = performance.now();
        var total = end - begin;
        files_result.innerHTML = "DB_dir " + total;
      }
    }

    _schema.createSchema(db, function(res) {
      if(res.succeeded) {
        dbs = db.getDesc();
        var req = _schema.insertObj(dbs, "file", {DIRname: "dir"});
        req.onsuccess = again;
        req.onerror = function() {
          Console.log("error in insert dirname");
        };
      }
    });
  };
}

function deleteFilesDBDir(){
  var count = N_FILES;
  var begin;
  var dbs;
  var dir;
  var _schema = new RDBSchema(_DIRSCHEMA);
  var open_req = navigator.getRDB("testfileDIRdb");
  var cursor;
  open_req.onsuccess = function() {
    db = open_req;
    function again() {
      if (!dir) {
        var cursor = dbs.query(["file"], ["DIRname"], null, null)
        cursor.onsuccess = function() {
          cursor.next();
          dir = cursor.getDirDS("DIRname");
          dir_desc = cursor.getSelfDesc();
          cursor.reset();
          begin = performance.now();
          again();
        };
        cursor.onerror = function() {
          throw "Cursor returned error";
        };
      }
      else if (count) {
        count -= 1;
        var req = dir.delete(_filenames[count]);
        req.onsuccess = again;
        req.onerror = function() {
          Console.error("SOMETHING WENT WRONG");
        };
      }
      else {
        var end = performance.now();
        var total = end - begin;
        files_result.innerHTML = "DB_dir " + total;
        dir_desc.delete("file", null);
      }
    }
    _schema.createSchema(db, function(res) {
      if(res.succeeded) {
        dbs = db.getDesc();
        again();
      }
    });
  };
}

function deleteFilesDB(){
  var file = new Blob([""], {type: "text/plain"});
  var count = N_FILES;
  var begin;
  var db;
  var dbs;
  var _schema = new RDBSchema(_SCHEMA);
  var open_req = navigator.getRDB("testfiledb");
  open_req.onsuccess = function() {
    db = open_req;
    function again() {
      _schema.getObjects(dbs, "file", {cb: function(res) {
        if (res) {
          var do_it = function() {
            if (count) {
              count -= 1;
              var ___res  = _schema.removeObj(res.res[count], "file");
              ___res.onsuccess = do_it;
              ___res.onerror = function() {
              console.log("ERROR IN REMOVe");
              }
            }
            else {
              var end = performance.now();
              var total = end - begin;
              files_result.innerHTML = "remove (DB) " + total;
            }
          }
            do_it();
        }
      }});
    }
    _schema.createSchema(db, function(res) {
      if(res.succeeded) {
        dbs = db.getDesc();
        begin = performance.now();
        again();
      }
    });
  };
}



document.addEventListener('DOMContentLoaded', function(){
  for (var i = 0; i < N_FILES; i += 1) {
    _filenames[i] = "_" + i;
  }
  files_result = document.getElementById("files-result");
  document.getElementById("create-files").onclick = createFiles;
  document.getElementById("delete-files").onclick = deleteFiles;
  document.getElementById("create-files-db").onclick = createFilesDB;
  document.getElementById("delete-files-db").onclick = deleteFilesDB;
  document.getElementById("create-files-db-dir").onclick = createFilesDBDir;
  document.getElementById("delete-files-db-dir").onclick = deleteFilesDBDir;
  inserter = dl_contacts();
}, false);
