


const MT = "mt"; // main table
const PK = "id"; // primary key
const NAME = "name"; // name col
const DATA = "BLOBdata"; //data col

var exifFields = {"ImageWidth": "INTEGER", 
                    "ImageHeight": "INTEGER",
                    "Orientation": "INTEGER",
                    "Make": "TEXT",
                    "Model": "TEXT",
                    "DateTimeOriginal": "TEXT", 
                    "DateTimeDigitized": "TEXT",
                    "ComponentsConfiguration": "TEXT",
                    "ShutterSpeedValue": "REAL",
                    "Flash": "TEXT",
                    "LightSource": "TEXT"}; 


function makeid()
{
    // http://stackoverflow.com/questions/1349404/generate-a-string-of-5-random-characters-in-javascript
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for( var i=0; i < 20; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}

function fireSuccess(request){
  if(request.onsuccess)
     request.onsuccess.call(this);
  else request.watch(onsuccess, request.onsuccess);
}

function fireError(request){
   if(request.onerror)
      request.onerror.call(this);
  else request.watch(onerror, request.onerror);
}


photo_db.prototype = {
   init: function(){
      this.rdb = navigator.getRDB("photos");
      this.rdb.onsuccess = function(event){
         console.log("connection successful");
         columns = [PK, NAME, DATA];
         types = ["INTEGER PRIMARY KEY", "TEXT", "FILEBLOB"];
         for(key in exifFields){
            columns.push(key);
            types.push(exifFields[key]);
         }
         var req = this.rdb.createTable(MT, columns, types, null); 
         req.onsuccess = function(event){console.log("Table CREATED!");}; 
      }.bind(this);
   },

   storageName: "pictures",
   default: true,
   add: function(file, _exif){
      return this.addNamed(file, makeid(), _exif);
   },
   addNamed: function(file, name, _exif){
      var res = {readyState: "pending", result: null, error: null};
      var to_ins = {};
      var self = this
      if(_exif){
         for(key in exifFields){
            if(_exif[key])
               to_ins[key] = _exif[key];
         }
         self._exif_rm_save(name, file, to_ins, res);
      }
      else EXIF.getData(file, function(){
         for(key in exifFields){
            if(this.exifdata[key])
               to_ins[key] = this.exifdata[key];
         }
         self._exif_rm_save(name, file, to_ins, res);
      });
         
      return res;
   },
   _exif_rm_save: function(name, file, to_ins, res){
      var self = this;
      EXIF.rm(file, function(binData){
         to_ins[NAME] = name;
         to_ins[DATA] = new Blob([binData]);
         var req = self.rdb.insert(MT, to_ins);
         req.onsuccess = function(event){
             res.readyState = "done";
             res.result = name;
             fireSuccess(res);
         };
         req.onerror = function(event){
            res.readyState = "done";
            res.error = req.error;
            fireError(res);
         };
      });
   },
   delete: function(name){
      console.log("in delete");
      return this.rdb.delete(MT, {type: "=", NAME: name});
   },
   enumerate: function(){
      // since the default enumerate behaves slightly differenctly we'er going
      // to have to fake out the cursor with this light wrapper
      var res = {done: false, readyState: "pending"};
      var next;
      var cursor;
      res.continue = function(){
         if(!next){
            res.result = null;
            fireSuccess(res);
            return;
         }
         res.result = next; 
         if(!cursor.next()){
            res.done = true;
            res.readyState = "done";
            next = null;
         }
         else next = new File([cursor.row[DATA]], cursor.row[NAME]);
         fireSuccess(res);  
      }
      cursor = this.rdb.query([MT], ['*'], null, NAME);
      cursor.onsuccess = function(event){
         if(cursor.next()){
            next = new File([cursor.row[DATA]], cursor.row[NAME]);
            res.continue();
         }
         else{
            res.error = "no files found!";
            console.error("cursor.onsuccess");
            fireError(res);
         }
      }
      cursor.onerror = function(event){
         res.error = cursor.error;
         console.error(res.error);
         fireError(res);
      }
      return res;
   },
   getEditable: function(name){
      var req = this.rdb.query([MT], ['*'], {type: "=", NAME: name}, null);
      var res = {readyState: "pending"};
      req.onsuccess = function(event){
         res.readyState = "done";
         if(req.next()){
            res.result = new File([req.row[DATA]], req.row[name]);
            fireSuccess(res);
         }
         else{
            res.error = "No files by that name";
            fireError(res);
         }
      }
      req.onerror = function(event){
         res.error = req.error;
         fireError(res);
      }
      return res;
   },
   get: function(name){
      // XXX this returns an editable object for now
      return this.getEditable(name);
   }
}

function photo_db(){
   this.init();
}

var pdb = new photo_db();
/*var ___old_dev_storage = navigator.getDeviceStorage;
var __new_photo_storage = new photodb();

navigator.getDeviceStorage = function(name){
   if(name === "pictures")
      return __new_photo_storage;
   else
      return __old_dev_storage(name);
}*/
