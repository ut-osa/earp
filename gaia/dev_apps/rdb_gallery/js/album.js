// Hide the information view again, when clicking on cancel
var g_records;
$('create-album-save-button').onclick = function() {
  // Enable NFC sharing when user closes info and returns to fullscreen view
  var e = $('album-list');
  var val = e.options[e.selectedIndex].value;
  if(val === '__create_new__')
    createAlbum();
  else
    saveAlbum(val);
  setNFCSharing(true);
  $('create-album-view').classList.add('hidden');
};
$('create-album-close-button').onclick = function hideFileInformation() {
  // Enable NFC sharing when user closes info and returns to fullscreen view
  setNFCSharing(true);
  $('create-album-view').classList.add('hidden');
};

function createAlbum(){
  var name = $('album-name').value;
  function good(){
    console.log("Album Created:", name);
    $('create-album-view').classList.add('hidden');
  }
  function bad(){
    throw new Error("Could not create new album");
  }
  if(name !== ''){
    photodb.createAlbum(name, g_records, good, bad);
  }
}

function saveAlbum(name){
  function good(){
    console.log("Album Updated:", name);
    $('create-album-view').classList.add('hidden');
  }
  function bad(){
    throw new Error("Could not update album");
  }
  photodb.updateAlbum(name, g_records, good, bad);
}

function chooseAlbumAndAdd(records) {
  g_records = records;

  function show(albums){
    var albumlist = $('album-list');
    // remove stuff from last time
    while(albumlist.firstChild){
      albumlist.removeChild(albumlist.firstChild);
    }
    var op = document.createElement("option");
    op.innerHTML = "Create New";
    op.setAttribute("value", "__create_new__");
    albumlist.appendChild(op);
    albums.forEach(function(obj){
      op = document.createElement("option");
      op.innerHTML = obj.name;
      op.setAttribute("value", obj.name);
      albumlist.appendChild(op);
    });
    $('create-album-view').classList.remove('hidden');
  }
  function err(){
    throw new Error("Could not get albums");
  }

  photodb.getAlbumRecords(show, err);
  /*
  if (fileinfo.metadata.video) {
    var req = videostorage.get(fileinfo.metadata.video);
    req.onsuccess = function() {
      fileinfo.size = req.result.size;
      fileinfo.type = req.result.type || 'video/3gp';
      populateMediaInfo(fileinfo);
    };
  } else {
    populateMediaInfo(fileinfo);
  }
  // We need to disable NFC sharing when showing file info view
  setNFCSharing(false);
  $('info-view').classList.remove('hidden');

  function populateMediaInfo(fileinfo) {
    var data = {
      //set the video filename using metadata
      'info-name': getFileName(fileinfo.metadata.video || fileinfo.name),
      'info-size': MediaUtils.formatSize(fileinfo.size),
      'info-type': fileinfo.type,
      'info-date': MediaUtils.formatDate(fileinfo.date),
      'info-resolution':
        fileinfo.metadata.width + 'x' + fileinfo.metadata.height
    };

    // Populate info overlay view
    MediaUtils.populateMediaInfo(data);
  }

  function getFileName(path) {
    return path.split('/').pop();
  }
  */
}


