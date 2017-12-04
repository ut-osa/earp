var myport;
var lastTime = 0;
var gres;
var counter = 0;
var session_counter = 0;
navigator.mozApps.getSelf().onsuccess = function() {
this.result.connect('moziac').then(function onConnectionAccepted(ports) {
  myport = ports[0];
  myport.onmessage = function(m) {
    counter++;
    var d = m.data;
    for (var i = 0; i < d.d.length; i++) {
      gres.push(d.d[i]);
    }
    if (d.end) {
      document.getElementById("iac-result").innerHTML = (new Date().getTime() - lastTime);
    } else {
      myport.postMessage({name:'test', ctx: {session_id: d.req.ctx.session_id}, req: {op: 'query', id: counter}});
    }
  };
}, function onConnectionRejected(reason) {
  alert(reason);
});
}

function fmoziac() {
  counter = 0;
  gres = [];
  lastTime = new Date().getTime();
  myport.postMessage({name:'test', ctx: {session_id: session_counter}, req: {op: 'query', id: counter}});
  session_counter++;
}

var iact = navigator.portRDBIACManager.connect("app-piacserver.gaiamobile.org/TestTimeService");
iact.onerror = function() {
  alert(iact.error);
};
iact.onsuccess = function() {
  alert("connect to PortIDBIAS success");
};

function processRes(e) {
  //alert('success');
  //var r = e.target;

  var c = e.target;
  while (c.next()) {
    gres.push(c.row.d);
  }
  if (!c.continue()) {
    document.getElementById("iac-result").innerHTML = (new Date().getTime() - lastTime);
  }
}

function fiac() {
  //var req = iact.update('a', null, {d: 'aaa'});
  //req.onsuccess = processRes;
  //req.onerror = function(e) {
  //  alert(this.error)}.bind(req);

  lastTime = new Date().getTime();
  gres = [];
  var cur = iact.query(['a'], ['d'], null, null);
  cur.onsuccess = processRes;
}

document.getElementById("moziacbutton").onclick = fmoziac;
document.getElementById("iacbutton").onclick = fiac;
