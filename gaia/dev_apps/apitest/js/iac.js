var iac = navigator.connectRDBIAC("TestInterAppService");

var serviceSchema = {
  meta: {d: ''},
  blob: {b: '', meta: 'prop'},
}

var schema = new RDBSchema(serviceSchema);

function iactestquery() {
  //var cur = iac.query(['a'], ['pk', 'd'], null, null);
  document.getElementById("resSpace").innerHTML = "Result:<br>";

  schema.getObjects(iac, "meta", {cb: function(res) {
    if (res.succeeded) {
      var v = res.res;
      for (var i = 0; i < v.length; i++) {
        schema.fillObject(v[i], true, function(innerres){
          if (innerres.succeeded) {
            var e = innerres.res;
            if (e.blob && e.blob.length > 0) {
              var reader = new FileReader();
              reader.onload = function(ev) {
                var con = ev.target.result;
                document.getElementById("resSpace").innerHTML += "<br>" + JSON.stringify(this.e) + " b:" + con;
              }.bind({e: e});
              reader.readAsText(e.blob[0].b);
            } else {
              document.getElementById("resSpace").innerHTML += "<br>" + JSON.stringify(e);
            }
          }
        });
      }
    } else {
      alert("failed in getObjects");
    }
  }});
  //cur.onsuccess = function(event) {
  //  while (this.next()) {
  //    if (this.row.b) {
  //      var reader = new FileReader();
  //      reader.onload = function(e) {
  //        var contents = e.target.result;
  //        document.getElementById("resSpace").innerHTML +=
  //          JSON.stringify(this.row) + " b: " + contents + "<br>";
  //      }.bind({row: this.row});
  //      reader.readAsText(this.row.b);
  //    } else {
  //      document.getElementById("resSpace").innerHTML += JSON.stringify(this.row) + "<br>";
  //    }
  //  }
  //  this.continue();
  //}
  //cur.onerror = function(event) {
  //  alert("error");
  //}
}

function iactestdelete() {
  var req = iac.delete('meta', {type: "or", term1: {type: '=', pk: 'a'}, term2: {type: '=', pk: 'c'}});
  req.onsuccess = function(event) {
    alert("success");
  }
  req.onerror = function(event) {
    alert("error");
  }
}


function iactestupdate() {
  var req = iac.update('meta', {type: "or", term1: {type: '=', pk: 'b'}, term2: {type: '=', pk: 'd'}}, {d: 'x'});
  req.onsuccess = function(event) {
    alert("success");
  }
  req.onerror = function(event) {
    alert("error");
  }
}

function iactestinsert() {
  schema.storeTree(iac, {tab: 'meta', obj:{d: 'zzz'}, props: [
                          {tab: 'blob', obj: {b: new Blob(["new text"], {type: 'text/plain'})}}
                        ]},
                  function(res) {
                    if (res.succeeded) {
                      alert("success");
                    } else {
                      alert(res.error);
                    }
                  });
  //var req = iac.insert('a', {d: 'zzz'});
  //req.onsuccess = function(event) {
  //  alert("success");
  //}
  //req.onerror = function(event) {
  //  alert("error");
  //}
}


document.getElementById("iacinsert").onclick = iactestinsert;
document.getElementById("iacquery").onclick = iactestquery;
document.getElementById("iacupdate").onclick = iactestupdate;
document.getElementById("iacdelete").onclick = iactestdelete;
