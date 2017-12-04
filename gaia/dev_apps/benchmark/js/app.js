var c_res, b_res;
function clear(){
  c_res.innerHTML = "";
  b_res.innerHTML = "";
}

document.addEventListener('DOMContentLoaded', function(){
  document.getElementById("clear").onclick = clear;
  c_res = document.getElementById("contacts-result");
  b_res = document.getElementById("blobs-result");
}, false);
