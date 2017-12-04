var rdb;
var schema;

var photoSchema = {
  photo: {data: 'TEXT', acl: true},
  tag: {photo: 'prop', name: 'TEXT'},
  album: {name: 'TEXT', acl: true},
  album_data: {photo: 'cap', album: 'prop'},
};


function connect(){
    rdb = navigator.getRDB("sys/photo");
    rdb.onsuccess = function(event) {
      schema = new RDBSchema(photoSchema);
      schema.createSchema(rdb, function(res){
        rdb = rdb.getDesc();
        alert(res.succeeded + ": create ");
      });
    };
}

function revoke() {
  rdb.revoke();
}

function printObj(obj, prefix) {
  if (typeof prefix === 'undefined')
    prefix = '';
  if (typeof obj !== 'object') {
    return obj + '';
  }
  var res = '<br>';
  var cnt = 0;
  for (var k in obj) {
    if (k.substring(0, 4) === 'CAP_' ||
        k.substring(0, 5) === 'PROP_' ||
        k === 'DESC')
        continue;
    cnt++;
    if (cnt > 1) {
      res += '<br>';
    }
    res += prefix + '-+-' + k + ': ';
    res += printObj(obj[k], prefix + '-|-');
  }
  return res;
}

navigator.mozSetMessageHandler("activity", function(a) {
  var desc = navigator.getReceivedRDBDesc(a.source.data.token);
  //alert(JSON.stringify(desc) + " s ss " + desc.appId);

  var sc = new RDBSchema(photoSchema);
  sc.getObject(desc, "photo", function(res) {
    this.sc.fillObject(res.res, true, function(r) {
      document.getElementById("resSpace").innerHTML = printObj(res.res);
    });
  }.bind({sc: sc}));
});

function query() {
  document.getElementById("resSpace").innerHTML = 'Result:';
  schema.getObjects(rdb, "album", {cb: function(res) {
    if (res.succeeded) {
      var als = res.res;
      for (var i = 0; i < als.length; i++) {
        schema.fillObject(als[i], true, function(res) {
          if (res.succeeded) {
            document.getElementById("resSpace").innerHTML += "<br><br>=========<br>" + printObj(res.res);
          }
        });
      }
    } else {
      alert("failed in getObjects");
    }
  }});
}

var globalcnt = 1;

function showPhoto(e, pl, alb) {
  var row = document.createElement("tr");
  var pname = document.createElement("td");
  pname.innerHTML = e.photo.data;
  var ptags = document.createElement("td");
  var text = "";
  var tags = e.photo.tag;
  var hastag = false;
  for (var ii = 0; ii < tags.length; ii++) {
    hastag = true;
    if (ii > 0) {
      text += ", ";
    }
    text += tags[ii].name;
  }
  var ctrls = document.createElement("td");
  var rmbutton = document.createElement("button");
  var dupbutton = document.createElement("button");
  var sharebutton = document.createElement("button");
  var tagbutton = document.createElement("button");
  var textf = document.createElement("input");
  textf.type = "text";
  tagbutton.type = "button";
  tagbutton.innerHTML = "tag";
  tagbutton.onclick = function() {
    this.tags.insert("tag", {name: this.text.value}).onsuccess = function() {
      if (this.hastag)
        this.ptags.innerHTML += ", ";
      this.ptags.innerHTML += this.value;
    }.bind({ptags: ptags, value: this.text.value, hastag: this.hastag});
  }.bind({tags: e.photo.PROP_tag, text: textf, ptags: ptags, hastag: hastag});
  rmbutton.type = "button";
  rmbutton.innerHTML = "delete";
  rmbutton.onclick = function() {
    schema.removeObj(this.photo, "photo").onsuccess = function(event) {
      showAlbum(this.alb);
      //this.pl.removeChild(this.row);
    }.bind(this);
  }.bind({photo: e.photo, row: row, alb: alb});

  dupbutton.type = 'button';
  dupbutton.innerHTML = 'dup';
  dupbutton.onclick = function() {
    var req = this.alb.PROP_album_data.insert("album_data", {}, ['CAP_photo'], [this.token]);
    req.onsuccess = function(event) {
      showAlbum(this);
    }.bind(this.alb);
  }.bind({alb: alb, token: e.photo.SELF_TOKEN});

  sharebutton.type = "button";
  sharebutton.innerHTML = "share";
  sharebutton.onclick = function() {
    var token = this.photo.DESC.saveForShare();
    var act = new MozActivity({name: "view", data: {type: "rdbphoto", token: token}});
    act.onerror = function() {
      alert("error: " + this.error.name);
    }
  }.bind({photo: e.photo});

  ptags.innerHTML = text;
  row.appendChild(pname);
  row.appendChild(ptags);
  ctrls.appendChild(textf);
  ctrls.appendChild(tagbutton);
  ctrls.appendChild(rmbutton);
  ctrls.appendChild(dupbutton);
  ctrls.appendChild(sharebutton);
  row.appendChild(ctrls);
  pl.appendChild(row);
}

function showAlbum(alb) {
  document.getElementById("newPhoto").onclick = function(){
    schema.storeTreeTx(this.PROP_album_data, {tab: 'album_data', obj:{},
                     caps:[ {tab: 'photo', obj: {data: 'p-' + globalcnt++}, props:[
                       {tab: 'tag', obj: {name: 't-' + globalcnt++}},
                       {tab: 'tag', obj: {name: 't-' + globalcnt++}},
                     ]}]}, function(res) {
                if (res.succeeded) {
                  showAlbum(this);
                } else {
                  alert(res.error);
                }
              }.bind(this));
    //var inserter = this.PROP_album_data.expandCap("album_data", "photo");
    //var req = inserter.insert("photo", {data: "p-" + globalcnt++});
    //req.onsuccess = function(event) {
    //  var token = event.target.getToken();
    //  //var newrow = event.target.getDesc();
    //  //schema.getObject(newrow, "photo", function(res) {
    //  //  if (res.succeeded) {
    //  //    res.res.PROP_tag.insert("tag", {name: "t-" + globalcnt++});
    //  //  }
    //  //});

    //  var areq = this.inserter.insert("album_data", {}, ['CAP_photo'], [token]);
    //  areq.onsuccess = function(event) {
    //    showAlbum(this);
    //  }.bind(this.alb);
    //}.bind({inserter: inserter, alb: this});
  }.bind(alb);

  document.getElementById("searchButton").onclick = function(){
    var tag = document.getElementById("searchTag").value;
    var queryPathCb = function(res) {
      if (!res.succeeded) {
        alert(res.error);
        return;
      }
      var pl = document.getElementById("photoList");
      var fc = pl.firstChild;
      while (fc) {
        pl.removeChild(fc);
        fc = pl.firstChild;
      }
      var hdr_name = document.createElement("th");
      hdr_name.innerHTML = "name";
      var hdr_tags = document.createElement("th");
      hdr_tags.innerHTML = "tags";
      pl.appendChild(hdr_name);
      pl.appendChild(hdr_tags);
      for (var i = 0; i < res.res.length; i++) {
        var e = res.res[i].album_data;
        schema.fillObject(e, true, function(res) {
          if (res.succeeded) {
            showPhoto(this.e, this.pl, this.alb);
          }
        }.bind({e: e, pl: pl, alb: this}));
      }
    }.bind(this);

    schema.queryPath(this.PROP_album_data, ['album_data', 'photo', 'tag'],
                     {type: "=", tag__name: tag}, null, queryPathCb);
  }.bind(alb);

  schema.fillObject(alb, true, function(res) {
    if (res.succeeded) {
      var pl = document.getElementById("photoList");
      var fc = pl.firstChild;
      while (fc) {
        pl.removeChild(fc);
        fc = pl.firstChild;
      }
      var hdr_name = document.createElement("th");
      hdr_name.innerHTML = "name";
      var hdr_tags = document.createElement("th");
      hdr_tags.innerHTML = "tags";
      pl.appendChild(hdr_name);
      pl.appendChild(hdr_tags);
      for (var i = 0; i < this.album_data.length; i++) {
        var e = this.album_data[i];
        showPhoto(e, pl, this);
      }
    }
  }.bind(alb));
}

function newAlbum() {
  var cb = function(res) {
    if (res.succeeded) {
      listAlbums();
    } else {
      alert(res.error);
    }
  }
  schema.storeTreeTx(rdb, {tab: "album", obj: {name: "a-" + globalcnt++},
                props: [{tab: 'album_data', obj: {}, caps:[
                  {tab: 'photo', obj: {data: 'an initial sample'}, props: [
                    {tab: 'tag', obj: {name: 'a'}},
                    {tab: 'tag', obj: {name: 'b'}}
                  ]}
                ]}]}, cb);
}

function listAlbums() {
  var list = document.getElementById('albumList');
  var fc = list.firstChild;
  while (fc) {
    list.removeChild(fc);
    fc = list.firstChild;
  }

  schema.getObjects(rdb, "album", {cb: function(res) {
      var als = res.res;
      for (var i = 0; i < als.length; i++) {
        var radio = document.createElement('input');
        radio.type = 'radio';
        radio.name = 'album';
        //radio.value = als[i];
        radio.onclick = function(){
          showAlbum(this);
        }.bind(als[i]);
        //radio.obj = als[i];
        list.appendChild(radio);
        var label = document.createElement('label');
        label.innerHTML = als[i].name + " | ";
        list.appendChild(label);
      }
      }});
}

document.getElementById("listAlbumsButton").onclick = function(){return listAlbums();};
document.getElementById("newAlbumButton").onclick = function(){return newAlbum();};
document.getElementById("connectButton").onclick = function(){return connect();};
document.getElementById("revokeButton").onclick = function(){return revoke();};
document.getElementById("queryButton").onclick = function(){return query()};
