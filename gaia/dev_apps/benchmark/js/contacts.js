var contacts_result, contacts_inserted, contacts_idx;
var begin;

var inserter;

function dl_contacts(){
  var contacts;
  var req = new XMLHttpRequest();
  req.open('GET', 'data/contacts.json', true);
  req.responseType = 'json';
  contacts_idx = 0;
  if(contacts_inserted){
    delete contacts_inserted;
    contacts_inserted = [];
  }
  else{
    contacts_inserted = [];
  }
  req.onload = function(){
     console.log("found", req.response.length, "contacts to insert");
     contacts = req.response.map(function(c){return new mozContact(c)});
     console.log('dowloaded contacts');
  }
  req.onerror = function(){
    throw new Error('what?');
  }
  req.send();

  function next(){
    var c = contacts.shift();
    if(!c){
      throw new Error("called insert with no contact ready to go");
    }
    var save_begin = performance.now();
    var req = navigator.mozContacts.save(c);
    req.onsuccess = function(){
      contacts_inserted.push(c);
      var end = performance.now();
      contacts_result.innerHTML = "" + (end - save_begin);
      return;
    }
    req.onerror = function(){
      throw new Error("Save Contact:", req.error.name);
    }
  }
  return next;
}

function insertAll(){
  for(var i = 0; i < 500; i++)
    inserter()
}

function saveContacts(){
  inserter();
}

function enumContacts(){
  var begin = performance.now();
  var request = navigator.mozContacts.getAll();
  contacts_idx = 0;
  if(contacts_inserted){
    delete contacts_inserted;
    contacts_inserted = [];
  }
  else{
    contacts_inserted = [];
  }

  var count = 0;
  request.onsuccess = function(){
    if(this.result){
      ++count;
      contacts_inserted.push(this.result);
      this.continue();
    }
    else {
      var end = performance.now();
      console.log("Contacts found:", count);
      contacts_result.innerHTML = "" + (end - begin);
    }
  };

  request.onerror = function(){
    throw new Error("Enum Contact:", req.error.name);
  };
}

function readSuccess(){
  var end = performance.now();
  contacts_result.innerHTML = "" + (end - begin);
  console.log(this.result.length, 'entries found');
}

function readError(){
  throw new Error("oh no!");
}

function get_idx(){
  contacts_idx %= contacts_inserted.length;
  return contacts_idx++;
}

function readContactsByName(){
  count = 500;
  begin = performance.now();

  function readNameSuccess(){
    if (count <= 0) {
      var end = performance.now();
      contacts_result.innerHTML = "" + (end - begin);
      console.log(this.result.length, 'entries found');
    }
    else {
      count -= 1;
      again();
    }
  }
  function again() {
	  var name = contacts_inserted[get_idx()].name[0];
	  var filter = {
	    filterBy: ['name'],
	    filterValue: name,
	    filterOp: 'equals',
	  };
	  var req = window.navigator.mozContacts.find(filter);
	  req.onsuccess = readNameSuccess.bind(req, 'name', name);
	  req.onerror = readError;
  }
  again();
}

function readContactsByCat(){
  var cat = contacts_inserted[get_idx()].category[0];
  var filter = {
    filterBy: ['category'],
    filterValue: cat,
    filterOp: 'equals',
  };
  begin = performance.now();
  var req = window.navigator.mozContacts.find(filter);
  req.onsuccess = readSuccess.bind(req, 'category', cat);
  req.onerror = readError;
}

function readContactsByTel(){
  count = 500;
  begin = performance.now();
  begin = performance.now();

  function readTelSuccess(){
    if (count <= 0) {
      var end = performance.now();
      contacts_result.innerHTML = "" + (end - begin);
      console.log(this.result.length, 'entries found');
    }
    else {
      count -= 1;
      again();
    }
  }
  function again() {
	  var tel = contacts_inserted[get_idx()].tel[0].value;
	  var filter = {
	    filterBy: ['tel'],
	    filterValue: tel,
	    filterOp: 'equals',
	  };
	  var req = window.navigator.mozContacts.find(filter);
	  req.onsuccess = readTelSuccess.bind(req, 'tel', tel);
	  req.onerror = readError;
  }
  again();
}

function clearContacts(){
  var req = window.navigator.mozContacts.clear();
  console.log('cleared!');
}

document.addEventListener('DOMContentLoaded', function(){
  contacts_result = document.getElementById("contacts-result");
  document.getElementById("contacts-save").onclick = saveContacts;
  document.getElementById("contacts-enum").onclick = enumContacts;
  document.getElementById("contacts-name").onclick = readContactsByName;
  document.getElementById("contacts-cat").onclick = readContactsByCat;
  document.getElementById("contacts-tel").onclick = readContactsByTel;
  document.getElementById("contacts-clear").onclick = clearContacts;
  document.getElementById("contacts-all").onclick = insertAll;
  inserter = dl_contacts();
}, false);
