var Contents; var elgg_data = {};
var elgg_image = {};
/* used for caching */
var req_obj = {};
var blob_obj = {};
var img_obj = {};

/* used for on-demand image fetching */
var http_req = {};
var http_obj = {};
var ipc_req = {};

/* for timing measurement */
var start = 0;
var end = 0;

var serviceSchema = {
	elgg_data: {pk: '', name: '', ptime: '', geoloc: '', posting: '', img_url: '', priv: ''},
	elgg_image: {pk: '', img_url: '', blob : '', elgg_data: 'prop'},
};

var schema = new RDBSchema(serviceSchema);

/* Contents.result format 
 * elgg_data
 * {"pk": "...", "name": "...", "ptime": "...", "geoloc": "...", "posting": "...", "img_url": "....", "priv": "0/1" },
 * {"pk": "...", "name": "...", "ptime": "...", "geoloc": "...", "posting": "...", "img_url": "....", "priv": "0/1" },
 * ...
 *
 * elgg_image
 * {"pk": "...", "img_url": "...", "PROP_elgg_data" : "...", "blob": "...."},
 * {"pk": "...", "img_url": "...", "PROP_elgg_data" : "...", "blob": "...."},
 * ...
 */
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

var elgg_ops = {
	list: function(req) {
		var table = req.getTabs();

		switch (table[0]) {
			case 'elgg_data':
			{
        //DispatchPosting(function() {
          var result = [];
          for (var key in elgg_data)
            result.push(elgg_data[key]);
          req.list(result);
          req.notifySuccess();
          return;
        //});
			}
			break;
			case 'elgg_image':
			{
				var w = req.securityWhere;
				if (!w || !w["PROP_elgg_data"]) {
					req.notifyFailure();
					return;
				}

				var fk = w["PROP_elgg_data"];
				/* on-the-fly image fetching request */
        /*
				if (elgg_image[fk]) {
					if (elgg_image[fk]['img_url'] != '') {
						var http_req = new XMLHttpRequest();
						http_req.open('GET', elgg_image[fk]['img_url']  + "?id=" + new Date().getTime(), true);
						//console.log(elgg_image[fk]['img_url']);
						http_req.responseType = 'blob';
						http_req.unique_id = fk;
						elgg_image[fk]['blob'] = '';

						http_req.onreadystatechange = function(r) {
							if (this.hreq.readyState == 4) {
								var id = this.hreq.unique_id;
								elgg_image[id]['blob'] = this.hreq.response;
								//console.log("Get image data " + id);
								this.ireq.list([elgg_image[id]]);
								this.ireq.notifySuccess();
								return;
							}
						}.bind({hreq: http_req, ireq: req});
						http_req.send();
					} else {
						req.list([elgg_image[fk]]);
					}
				} else {
					req.list([]);
					req.notifySuccess();
					return
				}
        */

				/* get from cached data  */
        if (fk in elgg_image)
          req.list([elgg_image[fk]]);
        else
          req.list([]);
				req.notifySuccess();
				return;
			}
			break;
			default:
				console.log('improper table name');
				req.notifyFailure();
				return;
		}
	},

	remove: function(req) {
		req.notifySuccess();
	},

	alter: function(req) {
		req.notifySuccess();
	},

	add: function(req) {
		var table = req.tab;
		var row = req.val;

		//console.log(row.posting);

		if (table != 'elgg_data') {
			req.notifyFailure();
			return;
		}

		var http_req = new XMLHttpRequest();
		var url = "http://192.168.0.23:18080/services/api/rest/xml/?method=wmd.do_posting&posting=";
		url = url + row.posting;
		http_req.open('GET', url, true);

		http_req.onreadystatechange = function(r) {
			if (this.hreq.readyState == 4) {
				if (this.hreq.responseText != null) {
					Contents = JSON.parse(this.hreq.responseText);
					//console.log(Contents.result);
					if (Contents.result == 0) {
						this.ireq.notifySuccess();
						return;
					} else {
						this.ireq.notifyFailure();
						return;
					}
				}
			}
		}.bind({hreq: http_req, ireq: req});

		http_req.send();
	}
};

/* policy setting */
var ias = registerPortInterAppService("ElggDispatching", elgg_ops, schema);
ias.setPolicyForMyself({
					elgg_data: {cols: "pk,name,ptime,geoloc,posting,img_url,priv", 
					insertable: true, updatable: true, queryable: true, deletable: true},
					elgg_image: {cols: "pk,img_url,PROP_elgg_data,blob", 
					insertable: true, updatable: true, queryable: true, deletable: true}
});

ias.setPolicyForApp("app-elgg_client.gaiamobile.org", {
				elgg_data: {cols: "pk,name,posting,priv", 
					insertable: true, updatable: true, queryable: true, deletable: false,
					where : {type : '=', priv: 0}
				},
				elgg_image: {cols: "pk,img_url,PROP_elgg_data,blob",
				   insertable: true, updatable: true, queryable: true, deletable: false},
});

console.log("ElggDispatching is registered");

function DispatchPosting(cb)
{
	var xmlhttp = new XMLHttpRequest();
	var url = "http://192.168.0.23:18080/services/api/rest/xml/?method=wmd.get_recent&string=wmd";

	start =  new Date().getTime();
	//xmlhttp.withCredentials = true;
	xmlhttp.open("get", url, true);
	xmlhttp.send();
		
	xmlhttp.onreadystatechange = function() 
	{
		if (xmlhttp.readyState == 4) {

			if (xmlhttp.responseText != null) {
				Contents = JSON.parse(xmlhttp.responseText);

				/* Create two table, elgg_data, elgg_image from fetched contents */
				for (var i = 0; i < Contents.result.length; i++) {
					/* cloning object */
					var obj_data = JSON.parse(JSON.stringify(Contents.result[i]));
					delete obj_data['img_url'];
					elgg_data[obj_data['pk']] = obj_data;

					var obj_image = JSON.parse(JSON.stringify(Contents.result[i]));

					if (obj_image['img_url'] != '' ) {
						delete obj_image['name'];
						delete obj_image['ptime'];
						delete obj_image['geoloc'];
						delete obj_image['posting'];
						obj_image['PROP_elgg_data'] = Contents.result[i]['pk'];
						obj_image['blob'] = '';
						elgg_image[obj_image['pk']] = obj_image;
					}
				}
        if (cb) {
          cb();
        } else {
          DisplayContents(elgg_data, elgg_image);
        }
			}
		}
	}
}


function DisplayContents(elgg_data, elgg_image)
{
	var out = "";
	for (var key in elgg_data)
		out += JSON.stringify(elgg_data[key], null, 4) + '<br>';

	out += '=================================<br>'

	for (var key in elgg_image)
		out += JSON.stringify(elgg_image[key], null, 4) + '<br>';

	document.getElementById("contents").innerHTML = out;

	end =  new Date().getTime();
	document.getElementById("timing").innerHTML 
		= (end - start) + " msec";

	DisplayImages(elgg_image);
}

/* this code can be used to cache images in dispatcher */
function DisplayImages(elgg_image) 
{
	var num_object = 0;
	var count = 0;
	document.getElementById("img_contents").innerHTML = '';
	for (var key in elgg_image) 
    if (elgg_image[key]['img_url'] != '')
      num_object++;

	for (var key in elgg_image) {
		if (elgg_image[key]['img_url'] != '') {
			req_obj[key] = new XMLHttpRequest();
			req_obj[key].open('GET', elgg_image[key]['img_url'] + "?id=" + new Date().getTime(), true);
			req_obj[key].responseType = 'blob';
			req_obj[key].uniqueid = key;

			req_obj[key].onreadystatechange = function(e) {
				if (this.readyState == 4) {
					var urlCreator = window.URL || window.webkitURL;
					var id = this.uniqueid;

					//console.log(id);
					blob_obj[id] = this.response;
					img_obj[id] = urlCreator.createObjectURL(blob_obj[id]);
					var img = document.getElementById(id);
					img.src = img_obj[id];
					//caching blob 
					elgg_image[id]['blob'] = blob_obj[id];

					count++;
					if (count == num_object){
						end =  new Date().getTime();
						document.getElementById("timing").innerHTML 
							= (end - start) + " msec";
					}
				}
			};
			req_obj[key].send();
			document.getElementById("img_contents").innerHTML
				+= '<br><img src="" style="width:128px;height:128px"' + ' id=' + key + '>';
		}
	}
}

function InsertPosting()
{
	var posting_text = document.getElementById('post_text').value;
	start =  new Date().getTime();

	posting_text = "generated text for benchmark:";
	for (var i = 0; i < 50; i++) {
		var xmlhttp = new XMLHttpRequest();
		var url = "http://192.168.0.23:18080/services/api/rest/xml/?method=wmd.do_posting&posting="
			+ posting_text + " seq " + i;

		xmlhttp.open("get", url, true);

		xmlhttp.onreadystatechange = function()
		{
			if (this.ireq.readyState == 4) {

				if (this.ireq.responseText != null) {
					Contents = JSON.parse(this.ireq.responseText);
					if (Contents.result != 0)
						alert('fail to insert posts');

					end =  new Date().getTime();
					document.getElementById("timing").innerHTML
						= (end - start) + " msec";
				}
			}
		}.bind({ireq: xmlhttp});

		xmlhttp.send();
	}
}

function DeletePosting()
{
	var xmlhttp = new XMLHttpRequest();
	var url = "http://192.168.0.23:18080/services/api/rest/xml/?method=wmd.delete_posting&user=osa_sosp";

	start =  new Date().getTime();
	xmlhttp.open("get", url, true);

	xmlhttp.onreadystatechange = function()
	{
		if (this.hreq.readyState == 4) {

			if (this.hreq.responseText != null) {
				Contents = JSON.parse(this.hreq.responseText);
				if (Contents.result != 0)
					alert('fail to delete posts');

				end =  new Date().getTime();
				document.getElementById("timing").innerHTML
					= (end - start) + " msec";
			}
		}
	}.bind({hreq: xmlhttp});

	xmlhttp.send();
}
