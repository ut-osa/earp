var KEY_LOCAL_IDS = "KEY_LOCAL_IDS";
//var localIds = [];
var gPrefix = "item_";
var gIsOutOfSync = true;

function createUUID() {
	return gPrefix + new Date().getTime();

	/*
	return gPrefix +'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
	    var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
	    return v.toString(16);
	});
*/
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
	var name = $('#item_input').val();
	var note = $('#note_input').val();
	var itemId = $('#item_id_input').val();

	var hasName = (name != null && name != "") ? true : false;
	var hasItemId = (itemId != null && itemId != "") ? true : false;

	if(hasName) {
		var item = new Object();
		item.name = name;
		item.note = note;

		if(hasItemId) {
			item.id = itemId;
			asyncStorage.setItem(itemId, item, function() {
	
			});
			
		} else {
			var newUuid = createUUID();
			item.id = newUuid;
			//localIds.push(newUuid);
			//asyncStorage.setItem(KEY_LOCAL_IDS, localIds, function() {
				asyncStorage.setItem(newUuid, item, function() {

				});
			//});
		}
	}

	reset();
}

function removeItem(itemId) {
	asyncStorage.removeItem(itemId, function() {
		/*localIds.splice(localIds.indexOf(itemId), 1);
		asyncStorage.setItem(KEY_LOCAL_IDS, localIds, function() {

		});*/
	});
}

function displayItems() {
	clearList();

	var count = 0;
	var itemsList = $('#items_list');

	asyncStorage.cursor(0, function(cursor) {
		if(cursor) {
			var item = cursor.value;
			itemsList.append("<li><a class=\"view_item_link\" href=\"#view_item\" data-id=\"" + cursor.key + "\">" + item.name + "</a></li>");
			count++;
			cursor.continue();
		} else {
			if(count <= 0) {
				itemsList.append("<li>" + "No Data yet" + "</li>");
			}

			try {
				$('#items_list').listview('refresh');
			} catch (err) {
				console.log(err);
			}
		}
	});
	/*
	asyncStorage.getItem(KEY_LOCAL_IDS, function(localIdsFromDb) {
		localIds = localIdsFromDb || [];
		localIds.reverse();

		if(localIds) {
			var itemCount = localIds.length;

			if(itemCount > 0) {
				interval = setInterval(function() {
					if(count < itemCount) {
						asyncStorage.getItem(localIds[count], function(item) {
							itemsList.append("<li><a class=\"view_item_link\" href=\"#view_item\" data-id=\"" + item.id + "\">" + item.name + "</a></li>");
						});
					} else {
						clearInterval(interval);
						$('#items_list').listview('refresh');		
					}
					count++;
				}, 2);
			} else {
				itemsList.append("<li>No data yet.</li>");
				$('#items_list').listview('refresh');
			}
		}
	});
*/
}

function displayItem(itemId) {

	asyncStorage.getItem(itemId, function(item) {
		try {
			$('#item_name').html(item.name);
			$('#item_note').html(item.note);
			$('#item_id_input').val(itemId);
			//$('#action_delete').attr('data-id', itemId);
			//$('.action_edit').attr('data-id', itemId);
		} catch(err) {
			console.log(err);
		}
	});
}

function goToEditItemPage(itemId) {

	asyncStorage.getItem(itemId, function(item) {
		try {
			$('#item_input').val(item.name);
			$('#note_input').val(item.note);
			$('#item_id_input').val(itemId);
			$.mobile.navigate("#edit_item");
		} catch(err) {
			console.log(err);
		}
	});
}

function email(itemId) {
	asyncStorage.getItem(itemId, function(item) {
		try {
			var subject = item.name;
			var emailBody = item.note + "\r\n\r\n" + navigator.mozL10n.get('sent_via') + " - https://marketplace.firefox.com/app/quick-note";
			var url = encodeURI("mailto:?subject=" + subject + "&body=" + emailBody);
			document.location.href = url;
		} catch(err) {
			console.log(err);
		}
	});
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
		gIsOutOfSync = true;
	});

	$('#action_delete').click(function() {
		var r = confirm(navigator.mozL10n.get('are_you_sure'));
		if(r == true) {
			var itemId = $('#item_id_input').val();
			removeItem(itemId);
			gIsOutOfSync = true;
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

	$('#main').on('pageshow',function(event){
		if(gIsOutOfSync) {
	    	displayItems();
	    	gIsOutOfSync = false;
	    }
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
