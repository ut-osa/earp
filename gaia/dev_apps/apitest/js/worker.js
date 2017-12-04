var data = [];

N = 4000;

var word = "";

for (var i = 0; i < 1024; i++) {
  word += 'a';
}

for (var i = 0; i < N; i++) {
  data.push(word);
}

onmessage = function(e) {
  if (e.data.req_info.op != "query") {
    postMessage({succeeded: false, error: "unknown op", id: id, ctx: e.data.ctx});
  }
  var id = e.data.req_info.id;
  postMessage({succeeded: true, d: data[id], end: id === N-1, id: id, ctx: e.data.ctx});
}
