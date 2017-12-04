var iac = navigator.portRDBIACManager.connect("app-elgg_dispatcher.gaiamobile.org/ElggDispatching");

var serviceSchema = {
	elgg_data: {name: '', posting: '', priv: ''},
	elgg_image: {img_url: '', blob : '', elgg_data: 'prop'},
};

/* for timing measurement */
var start = 0;
var end = 0;

var schema = new RDBSchema(serviceSchema);

/* used for debugging */
var TYPES = {
	'undefined'        : 'undefined',
	'number'           : 'number',
	'boolean'          : 'boolean',
	'string'           : 'string',
	'[object Function]': 'function',
	'[object RegExp]'  : 'regexp',
	'[object Array]'   : 'array',
	'[object Date]'    : 'date',
	'[object Error]'   : 'error'
},
TOSTRING = Object.prototype.toString;

function type(o) {
	return TYPES[typeof o] || TYPES[TOSTRING.call(o)] || (o ? 'object' : 'null');
};

function GetPosting()
{
	start = new Date().getTime();
	document.getElementById("contents").innerHTML = '';

	/* old way to query data 
	var cursor = iac.query(['elgg'], ['name', 'geoloc'], null, null);
	cursor.onsuccess = function(event) {
		var out = "";
		out += 'result<br>';
		while (this.next()) {
			if (this.row.geoloc) {
				out += JSON.stringify(this.row) + " geoloc: " + 
					this.row.geoloc + "<br>";
			} else {
				out += JSON.stringify(this.row) + '<br>';
			}
		}

		document.getElementById("contents").innerHTML += out;
	}

	cursor.onerror = function(event) {
		alert('fail to get data');
	}
	*/

  var cursor = iac.objOps({op: "getForest", schema: serviceSchema, tab: 'elgg_data'});
  cursor.onsuccess = function(e) {
    end = new Date().getTime();
    document.getElementById("timing").innerHTML =
      (end - start) + " msec";
    while (cursor.next()) {
			var r = cursor.row;
      document.getElementById("contents").innerHTML +=
        '<p id="' + r['pk'] + '"> name: ' + r['name']
        +' posting: ' + r['posting'] + '</p>';
      if (r.elgg_image && r.elgg_image.length > 0) {
        var urlCreator = window.URL || window.webkitURL;
        var blob = r.elgg_image[0]['blob'];
        if (blob == '') {
          continue;
        }
        var imageUrl = urlCreator.createObjectURL(blob);
        document.getElementById(r.elgg_image[0]['pk']).innerHTML
          += '<br><img src="'+ imageUrl +
          '" style="width:128px;height:128px">';
      }
    }
  }

  /*
	schema.getObjects(iac, 'elgg_data', {cb: function(res) {
		document.getElementById("contents").innerHTML = 'result<br>';
		if (res.succeeded) {
			var r = res.res;
			for (var i = 0; i < r.length; i++) {
				document.getElementById("contents").innerHTML += 
				'<p id="' + r[i]['pk'] + '"> name: ' + r[i]['name'] 
				+' posting: ' + r[i]['posting'] + '</p>';
				schema.fillObject(r[i], true, function(innerres) {
					if (innerres.succeeded) {
						var data = innerres.res;
						if (data.elgg_image && data.elgg_image.length > 0) {
							var urlCreator = window.URL || window.webkitURL;
							var blob = data.elgg_image[0]['blob'];
							//console.log(type(blob));
							if (blob == '') {
								console.log("cannot read image");
							} else {
								var imageUrl = urlCreator.createObjectURL(blob);
								document.getElementById(data.elgg_image[0]['pk']).innerHTML 
									+= '<br><img src="'+ imageUrl + 
									'" style="width:128px;height:128px">';
							}
						} 
					}
					end = new Date().getTime();
					document.getElementById("timing").innerHTML =
					(end - start) + " msec";
				});
			}
		} else {
			document.getElementById("contents").innerHTML 
			+= "fail to get objects<br>";
		}
	}});
  */
}

function InsertPosting()
{
	var posting_text = 'generated text for benchmark: seq ';
	start = new Date().getTime();
	for (var i = 0; i < 50; i++) { 
		var text = posting_text + i;
		schema.storeTree(iac, {tab: 'elgg_data', obj:{name: 'osa_sosp', posting : text, priv : 0},
				props: []},
				function(res) {
					if (res.succeeded) {
						end = new Date().getTime();
						document.getElementById("timing").innerHTML =
							(end - start) + " msec";
					} else {
						console.log('fail to insert post');
					}
				}
				);
	}
}
