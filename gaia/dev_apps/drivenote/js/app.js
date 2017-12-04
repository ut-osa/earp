var KEY_LOCAL_IDS = "KEY_LOCAL_IDS";
//var localIds = [];
var gPrefix = "drive_note_item_";
var gIsOutOfSync = true;
var iac_drive = navigator.portRDBIACManager.connect("https-www.cs.utexas.edu/GDrive");
iac_drive.onerror = function() {
  alert(this.error);
}
var benchmark = true;

function blob_to_text(blob, cb){
  var reader = new FileReader();
  reader.onloadend = function(){
    cb(reader.result);
  }
  reader.readAsText(blob);
}

function getAll(cb){
  var begin = performance.now();
  var req = iac_drive.query(['files'], ['name', 'desc', 'content'], null, null);
  req.onsuccess = function(){
    var res = [], end = performance.now();
    while(req.next())
      res.push(req.row);
    document.getElementById('benchres').innerHTML = JSON.stringify(res);
    document.getElementById('time').innerHTML = "" + (end - begin);
    if(cb) cb(res);
  }
}

function modAll(){
  getAll(function(res){
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
    /*for(var elem of items){*/
      var req = iac_drive.update('files',/* {type:'=', name:elem.name},*/ null,  items[0]);
      req.onsuccess = function(){
        //if(++count < items.length) return;
        var end = performance.now();
        document.getElementById('time').innerHTML = "Mod: " + (end - begin);
      //}
      req.onerror = function(){
        alert('something went wrong!');
      }
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
    desc: "some_desc",
  }
  var count = 0;
  var begin = performance.now();
  for (var i = 0; i < TOTAL; ++i) {
    val.name = genString(8);
    var req = iac_drive.insert('files', val);
    req.onsuccess = function() {
      if (++count >= TOTAL) {
        var end = performance.now();
        document.getElementById('time').innerHTML = "Insert: " + (end - begin);
      }
    };
    req.onerror = function() {
      throw "Create failed!";
    };
  }
}

document.addEventListener("DOMContentLoaded", function(){

  document.getElementById("getAll").onclick = getAll;
  document.getElementById("modAll").onclick = modAll;
  document.getElementById("create10").onclick = createTen;
});

document.addEventListener('drive_change', displayItems);

function createUUID() {
	return gPrefix + new Date().getTime();
}

function reset() {
	$('#item_input').val("");
	$('#note_input').val("");
	$('#item_id_input').val("");
}

function clearList() {
	$('#items_list li').remove();
}

function saveItem() {
	var desc = $('#item_input').val();
	var note = $('#note_input').val();
	var name = $('#item_id_input').val();
  if(typeof name !== 'string')
    name = name.toString();
  if(typeof desc !== 'string')
    desc = desc.toString();
  if(typeof note !== 'string')
    note = note.toString();

	var hasDesc = (desc != null && desc != "") ? true : false;
	var hasName = (name != null && name != "") ? true : false;

	if(hasDesc) {
		var item = {
      desc: desc,
      content: note,
      name: hasName ? name : createUUID()
    };

    if(hasName){
      var req = iac_drive.update('files', {type:'=',name:name}, item);
      req.onsuccess = function(){
        console.log(name, "saved successfully");
        document.dispatchEvent(new Event('drive_change'));
      };
      req.onerror = function(){console.log("problem saving", item.name);};
    }
    else{
      var req = iac_drive.insert('files', item);
      req.onsuccess = function(){
        console.log(name, "saved successfully");
        document.dispatchEvent(new Event('drive_change'));
      };
      req.onerror = function(){console.log("problem creating", item.name);};
    }
	}
	reset();
}

function removeItem(name) {
  var req = iac_drive.delete('files', {type:'=',name:name});
  req.onsuccess = function(){
    console.log(name, 'successfully removed');
    document.dispatchEvent(new Event('drive_change'));
  };
  req.onerror = function(){console.log('could not remove', name);};
}

function displayItems() {
  if(benchmark) return;
	var count = 0;
	var itemsList = $('#items_list');

	var cursor = iac_drive.query(['files'], ['name','desc'], null, null);
	cursor.onsuccess = function() {
	  clearList();
		while(cursor.next()) {
      console.log(JSON.stringify(cursor.row));
			var item = cursor.row;
      if(!item.desc) continue;
			itemsList.append("<li><a class=\"view_item_link\" href=\"#view_item\" data-id=\"" + item.name + "\">" + item.desc + "</a></li>");
			cursor.continue();
			count++;
		}
    if(count <= 0) {
      itemsList.append("<li>" + "No entries" + "</li>");
    }

    try {
      $('#items_list').listview('refresh');
    } catch (err) {
      console.log(err);
    }
	};
}

function displayItem(name) {
  if(typeof name !== 'string')
    name = name.toString();
	var req = iac_drive.query(['files'],
                            ['name','desc','content'],
                            {type: '=', name: name},
                            null);
  req.onsuccess = function() {
    if(req.next()){
      blob_to_text(req.row.content, function(text){
        $('#item_name').html(req.row.desc);
        $('#item_note').html(text);
        $('#item_id_input').val(req.row.name);
      });
    }
	};
  req.onerror = function(){
    console.error('could not retrieve', name);
  }
}

function goToEditItemPage(name) {
  if(typeof name !== 'string')
    name = name.toString();
	var req = iac_drive.query(['files'],
                            ['name','desc','content'],
                            {type:'=',name:name},
                            null);
  req.onsuccess = function() {
    if(req.next()){
      try {
        var item = req.row;
        blob_to_text(item.content, function(text){
          $('#item_input').val(item.desc);
          $('#note_input').val(text);
          $('#item_id_input').val(item.name);
          $.mobile.navigate("#edit_item");
        });
      } catch(err) {
        console.log(err);
      }
    }
  }
  req.onerror = function(){
    console.error('could not retrieve', name);
  }
}

function email(name) {
  if(typeof name !== 'string')
    name = name.toString();
	var req = iac_drive.query(['files'], 
                            ['desc','content'],
                            {type:'=',name:name}, 
                            null);
  req.onsuccess = function() {
    if(req.next()){
      try{

        blob_to_text(req.row.content, function(text){
          var item = req.row;
          var subject = item.desc;
          var emailBody = text + "\r\n\r\n" + navigator.mozL10n.get('sent_via') + " - https://marketplace.firefox.com/app/quick-note";
          var url = encodeURI("mailto:?subject=" + subject + "&body=" + emailBody);
          document.location.href = url;
        });
      } catch(err) {
        console.log(err);
      }
    }
  }
  req.onerror = function(){
    console.error('could not retrieve', name);
  }
}

$(function() {
	displayItems();

	$('#action_clear').click(function() {
		reset();
	});

	$('.add_item').click(function() {
		reset();
		$('#edit_item_title').html(navigator.mozL10n.get('add'));
		$.mobile.navigate("#edit_item");
	});

	$('#save_item').click(function() {
		saveItem();
	});

	$('#action_delete').click(function() {
		var r = confirm(navigator.mozL10n.get('are_you_sure'));
		if(r == true) {
			var itemId = $('#item_id_input').val();
			removeItem(itemId);
			$.mobile.navigate("#main");
		}
	});

	$('.action_edit').click(function() {
		$('#edit_item_title').html(navigator.mozL10n.get('edit'));
		var itemId = $('#item_id_input').val();
		goToEditItemPage(itemId);
	});

	$('#action_email').click(function() {
		var itemId = $('#item_id_input').val();
		email(itemId);
	});

	$(document).on('click', '.view_item_link', function(event) {
	    event.preventDefault();
	    var itemId = $(this).data("id");
	    displayItem(itemId);
		$.mobile.navigate("#view_item");
	});

	navigator.mozL10n.ready( function() {
		$('#items_list').prev().find(".ui-input-search .ui-input-text").attr('placeholder', navigator.mozL10n.get('search'));
	});
});
