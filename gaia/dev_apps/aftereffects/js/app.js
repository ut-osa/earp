require.config({
	paths: {
        jQuery: "vendor/jquery/jquery-1.10.2.min",
		jQueryMobile: "vendor/jquery_mobile/jquery.mobile-1.3.2.min",
        Underscore: "vendor/underscore/underscore-min",
		Backbone: "vendor/backbone/backbone-min",
		CamanJs: "vendor/camanjs/caman.full.min",
		eventie: "vendor/eventie/eventie",
		eventEmitter: "vendor/eventemitter/EventEmitter",
		ImagesLoaded: "vendor/imagesloaded/imagesloaded.pkgd.min"
    },
    shim: {
		jQuery: {
			exports: "$"
		},
		jQueryMobile: {
			exports: "$m",
			deps: ["jQuery"]
        },
		Underscore: {
			exports: "_"
		},
		Backbone: {
			exports: "Backbone",
			deps: ["Underscore", "jQuery"]
		},
		ImagesLoaded: {
			exports: "ImagesLoaded",
			deps: ["jQuery", "eventie", "eventEmitter"]
		}
    }
});

// COLUMN TYPES
const TEXT = 'TEXT', INT = 'INTEGER', BLOB = 'FILEBLOB', PROP = 'prop',
      CAP = 'cap';
// TABLE NAMES (must match SCHEMA)
const PHOTO = 'photo', ALBUM = 'album', TAG = 'tag', ALBUM_DATA = 'album_data';
const SCHEMA = {photo:      {name: TEXT, BLOBdata: BLOB, type: TEXT, size: TEXT,
                             date: INT, Mtype: TEXT, width: INT, height: INT,
                             BLOBthumbnail: BLOB, acl: true},
                tag:        {photo: PROP, name: TEXT},
                album:      {name: TEXT, acl: true},
                album_data: {photo: CAP, album: PROP}
               };

var activity, shared_desc;
function photo_handler(data){
  var begin = Date.now();
  if(data.tokens){
    var count = 0;
    for(var token of data.tokens){
      shared_desc = navigator.getReceivedRDBDesc(token);
      var cursor = shared_desc.query(['photo'], ['BLOBdata'], null, null);
      cursor.onsuccess = function(){
        if(cursor.next()){
          if(++count === tokens.length){
            var running_time = Date.now() - begin;
            alert('making token: ' + option.data.time);
            alert('using token: ' + running_time);
          }
        }
        else
          alert('no blob :(');
      }
    }
  }
  else{
    var running_time = Date.now() - option.data.time;
    alert('got blob: ' + running_time);
  }
}
function displayBlobs(blobs){
  var container = document.getElementById('pick-photo-page-content');
  for(var blob of blobs){
    var element = document.createElement('img');
    element.src = URL.createObjectURL(blob);
    container.appendChild(element);
  }
}

function album_handler(data){
  if(data.tokens){
    var schema = new RDBSchema(SCHEMA);
    var count = 0;
    var token = data.tokens[0];
    var doFill = function(res){
      var blobs = [];
      var album = res.res;
      schema.fillObject(album, true, function(res){
        displayBlobs(res.res.album_data.map(function(o){
          return o.photo.BLOBdata;
        }));
        var total = Date.now() - data.time;
        alert('time: ' +  total);
      });
    }
    shared_desc = navigator.getReceivedRDBDesc(token);
    schema.getObject(shared_desc, ALBUM, doFill);
  }
  else{
    displayBlobs(data.blobs);
    var total = Date.now() - data.time;
    alert('total: ' + total);
  }
}

navigator.mozSetMessageHandler('activity', function(activityRequest){
  var option = activityRequest.source;
  activity = activityRequest;
  switch(option.data.type){
    case 'album':
      album_handler(option.data);
      break;
    case 'photo':
      photo_handler(option.data);
  }
}.bind(window));
var exif_data; // canvas strips the exif data we can store it here


require(["jQuery", "jQueryMobile", "CamanJs", "modules/pick_photo"], function($, $m, CamanJs, pickPhoto) {
	$(document).ready(function(){
		$.mobile.page.prototype.options.domCache = false;
    console.log("in here");
		pickPhoto.MozActivityPick();
	});
});
