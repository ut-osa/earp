var result_space = document.getElementById("Result");
const N_CONTACTS = 10000;
var _image_blob;
var loadedImages;

var oMyBlob = new Blob(["some test text"], {type: 'text/plain'});
var oMyBlob2 = new Blob(["other test text"], {type: 'text/plain'});

// table meta
var repo = {
  a: {pk: 'a', d: 'aa'},
  b: {pk: 'b', d: 'bb'},
  c: {pk: 'c', d: 'cc'},
  d: {pk: 'd', d: 'dd'},
};

// table blob
var datarepo = {
  a: {pk: 'a', PROP_meta: 'a', b: oMyBlob},
  d: {pk: 'd', PROP_meta: 'd', b: oMyBlob2},
};

var gcnt = 0;

var queryStates = {};

var ops = {
  list: function(req) {
    var tabs = req.getTabs();
    if (tabs.length !== 1) {
      req.notifyFailure();
      return;
    }
    switch (tabs[0]) {
      case 'meta':
      {
        var l = [];
        // an example to feed data in two rounds
        if (queryStates['r' + req.sequenceNumber]) {
          for (var row in repo) {
            if (row !== 'a' && row !== 'b')
              l.push(repo[row]);
          }
          delete queryStates['r' + req.sequenceNumber];
          req.list(l);
          req.notifySuccess();
          return;
        } else {
          for (var row in repo) {
            if (row === 'a' || row === 'b')
              l.push(repo[row]);
          }
          queryStates['r' + req.sequenceNumber] = 1;
          req.list(l);
          req.notifyIncomplete();
          return;
        }
      }
        break;
      case 'blob':
      {
        var w = req.securityWhere;
        if (!w || !w["PROP_meta"]) {
          req.notifyFailure();
          return;
        }
        var fk = w["PROP_meta"];
        if (datarepo[fk]) {
          req.list([datarepo[fk]]);
        } else {
          req.list([]);
        }
        req.notifySuccess();
        return;
      }
        break;
      default:
        req.notifyFailure();
        return;
    }
  },

  remove: function (req) {
    if (req.tab !== 'meta') {
      req.notifyFailure();
      return;
    }
    delete repo[req.val.pk];
    req.notifySuccess();
  },

  alter: function(req) {
    if (req.tab !== 'meta') {
      req.notifyFailure();
      return;
    }
    var entry = repo[req.val.pk];
    var updatedCols = req.updatedCols;
    for (var col in updatedCols) {
      entry[col] = updatedCols[col];
    }
    req.notifySuccess();
  },

  add: function(req) {
    switch (req.tab) {
      case 'meta':
      {
        var row = req.val;
        row.pk = 'z' + (gcnt++);
        repo[row.pk] = row;
        req.setNewPk(row.pk);
        req.notifySuccess();
        return;
      }
        break;
      case 'blob':
      {
        var row = req.val;
        if (row["PROP_meta"]) {
          datarepo[row["PROP_meta"]] = row;
        }
        req.notifySuccess();
        return;
      }
        break;
      default:
        req.notifyFailure();
        return;
    }
  }
};

var ias = registerInterAppService("TestInterAppService", ops);
ias.setPolicyForMyself({meta: {cols: "pk,d", insertable: true, updatable: true, queryable: true, deletable: true},
                        blob: {cols: "pk,b,PROP_meta"}});

// for the browser app (just for test purpose)
ias.setPolicyForApp("app-system.gaiamobile.org",
                    {meta: {cols: "pk,d", insertable: true, updatable: true, queryable: true, deletable: false,
                            fixedCols: {d: "fixed"}, where: {type: '!=', d: 'cc'}},
                        blob: {cols: "pk,b,PROP_meta"}});

//var NROUND = 4000;
//var bw = [];
//var word = '';
//for (var i = 0; i < 1024; i++) {
//  word += 'a';
//}
//
//for (var i = 0; i < 1; i++) {
//  bw.push({d: word});
//}

var mworker = new Worker("js/worker.js");

//var counter = 0;
//function processMozIACRequest(e) {
//  counter++;
//  if (counter < NROUND) {
//    e.detail.port.postMessage({d: bw, end: false, req: e.detail.m.req});
//  } else {
//    e.detail.port.postMessage({d: bw, end: true, req: e.detail.m.req});
//    counter = 0;
//  }
//}
//
//document.body.addEventListener("receiveMozIACRequest", processMozIACRequest, false);

var basehandler = function(connectionRequest) {
  var port = connectionRequest.port;
  var mworker = new Worker("js/worker.js");
  mworker.onmessage = function(e) {
    if (e.data.succeeded)
      this.postMessage({succeeded: true, d: [e.data.d], end: e.data.end, req: {id: e.data.id, ctx: e.data.ctx}});
    else
      this.postMessage({succeeded: false, error: e.data.error, req: {id: e.data.id, ctx: e.data.ctx}});
  }.bind(port);
  //console.log('connect:' + new Date().getTime());
  port.onmessage = function(m) {
    //console.log('received: ' + new Date().getTime());
    //var ev = new CustomEvent("receiveMozIACRequest", {'detail': {port: this, m: m}});
    mworker.postMessage({req_info: m.data.req, ctx: m.data.ctx});
    //document.body.dispatchEvent(ev);
  };
  port.start();
}

navigator.mozSetMessageHandler('connection', basehandler);


function makeid()
{
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for( var i=0; i < 20; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}

var begin;
var end;
var count;
var done;

function end_timer(){
   end = performance.now();
   result_space.innerHTML = "completed in: " + (end - begin) + " ms";
}
function success_on(){
   count--;
   if(count === 0 && done)
      end_timer();
}

function test_contacts_save(){
   begin = performance.now();
   var toInsert;
   count = 0;
   done = false;
   for(var i = 0; i < 500; i++){
      toInsert = new mozContact();
      toInsert.givenName = [makeid()];
      toInsert.familyName = [makeid()];
      toInsert.nickname = [makeid()];
      
      count++;
      
      var saving = navigator.mozContacts.save(toInsert);
      saving.onsuccess = function() {
         success_on();
      }
   }
   done = true;
}

function test_contacts_read(){
   done = false;
   begin = performance.now();
   var allContacts = navigator.mozContacts.getAll();
   allContacts.onsuccess = function(event) {
      var cursor = event.target;
      if(cursor.result){
         cursor.continue();
      }
      else{
         done = true;
         end_timer();
      }
   }
}

function test_contacts_readFromDB(){
   done = false;
   begin = performance.now();
   var rdb = navigator.getRDB("contacts");
   rdb.onsuccess = function(event){
      var req = rdb.query(["mt"], ["*"], null, null, null);
      req.onsuccess = function(event){
         while(req.next());
         done = true;
         end_timer();
      }
   }
}

function pick(){
   var act = new MozActivity({
      name: "pick",
      data: { type: "image/jpeg" }
   });
   act.onsuccess = function() {
      _image_blob = this.result.blob;
      result_space.innerHTML = "BLOB loaded...";
   }
}

function test_add(){
   var req = pdb.add(_image_blob);
   req.onsuccess = function(){
      result_space.innerHTML = "add Complete";
   }
}

function test_addNamed(){
   var req = pdb.addNamed(_image_blob, "just_a_name.jpg");
   req.onsuccess = function(){
      result_space.innerHTML = "addNamed Complete";
   }
}

function test_delete(){
   var req = pdb.delete("just_a_name.jpg");
   req.onsuccess = function(){
      result_space.innerHTML = "delete successful";
   }
   req.onerror = function(){
      result_space.innerHTML = "delete error: " + req.error;
   }
}

function test_enumerate(){
   var cursor = pdb.enumerate();
   loadedImages = [];
   cursor.onsuccess = function () {
      if(cursor.result){
         loadedImages.push(this.result);
         cursor.continue();
      }
      else{
         result_space.innerHTML = "loaded " + loadedImages.length + " images";
      }
   }
   cursor.onerror = function(){
      console.error(cursor.error);
   }
}

function test_apps(){
   var request = navigator.mozApps.getInstalled();
   request.onsuccess = function(e) {
      console.log("request granted: " + request.result.length);
   };
   request.onerror = function(e) {
      console.log("Request denied!");
   };
}

function remote_test(){
   var req = navigator.mozrRDBs.get("test");

   req.onsuccess = function(){
      document.getElementById("Result").innerHTML = req.result.show();
   }
   req.onerror = function(){
      console.log(req.error.name);
   }
}

document.getElementById("pick").onclick =
         function(){return pick();};
document.getElementById("test_add").onclick =
         function(){return test_add();};
document.getElementById("test_addNamed").onclick =
         function(){return test_addNamed();};
document.getElementById("test_delete").onclick =
         function(){return test_delete();};
document.getElementById("test_enumerate").onclick =
         function(){return test_enumerate();};
document.getElementById("test_getEditable").onclick =
         function(){return test_getEditable();};
document.getElementById("test_get").onclick =
         function(){return test_get();};
document.getElementById("test_contacts_save").onclick =
         function(){return test_contacts_save();};
document.getElementById("test_contacts_read").onclick =
         function(){return test_contacts_read();};
document.getElementById("test_contacts_readFromDB").onclick =
         function(){return test_contacts_readFromDB();};
document.getElementById("test_apps").onclick =
         function(){return test_apps();};
document.getElementById("test_remoteshow").onclick = 
         function(){return remote_test()};
