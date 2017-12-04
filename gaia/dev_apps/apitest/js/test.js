var rdb;

function connect(){
    rdb = navigator.getRDB("testrdb");
    rdb.onsuccess = function(event) {
	alert("connected");
    }
    var piac = navigator.portIACManager;
    alert(piac);
    alert(piac.connect('111').get());
}

function insert_by_attr() {
    var obj = {data : "newval", num : null, DIRaaa: null};
    var req = rdb.insert("mt", obj);
    req.onsuccess = function(event) {
	alert("inserted");
    }
}

function query() {
    var cursor = rdb.query(["mt"], ["data", "DIRaaa"], null, null);
    cursor.onsuccess = function(event) {
	var text = "Result:<br>";
  var cnt = 0;
	while (cursor.next()) {
    cnt += 1;
    text += cnt + "<br>"
    var file = new Blob([cnt + " This is a text file."], {type: "text/plain"});
    var dir = cursor.getDirDS("DIRaaa");
    var request = dir.addNamed(file, cnt + "-my-file.txt");
    request.onsuccess = function(event) {
      var req = this.dir.get(this.cnt + "-my-file.txt");
      req.onsuccess = function() {
        alert(this.cnt);
        this.dir.addNamed(this.req.result, this.cnt + '-clone.txt');
      }.bind({req:req, cnt:this.cnt, dir:this.dir});
    }.bind({cnt:cnt, dir:dir});
    //var req = dir.storeFile(cnt + "", file)
    //req.onsuccess = function(event) {
    //  alert("created file " + this.cnt);
    //  var blob = this.dir.getFile(this.cnt + "");
    //  r = this.dir.storeFile(this.cnt + ".clone", blob);
    //  r.onsuccess = function(event) {
    //    rr = this.dir.deleteFile(this.cnt + "");
    //    rr.onsuccess = function(event) {
    //      alert("deleted " + this);
    //    }.bind(this.cnt)
    //  }.bind({dir:this.dir, cnt: this.cnt})
    //}.bind({cnt: cnt, dir: dir});
	}
	document.getElementById("resSpace").innerHTML = text;
    }
}

function createTab() {
    var req = rdb.createTable("mt", ["data", "num", "DIRaaa"], ["TEXT", "INTEGER", "DIR"], null);
    req.onsuccess = function(event) {
	alert("created");
    }
}

document.getElementById("conb").onclick = function(){return connect();};
document.getElementById("insb").onclick = function(){return insert_by_attr();};
document.getElementById("creb").onclick = function(){return createTab();};
document.getElementById("queb").onclick = function(){return query()};
