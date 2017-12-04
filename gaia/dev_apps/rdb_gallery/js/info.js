// Hide the information view again, when clicking on cancel
$('info-close-button').onclick = function hideFileInformation() {
  // Enable NFC sharing when user closes info and returns to fullscreen view
  setNFCSharing(true);
  $('info-view').classList.add('hidden');
};

var tagField = $('add-tag-field');
var currentinfo;
var currentidx;

$('add-tag-button').onclick = function addTag(){
  if(! tagField.value ) return;
  photodb.addTag(currentinfo, tagField.value, good, bad);
  function good(){
    photodb.refresh(currentinfo, function(updated){
      showFileInformation(updated, currentidx);
      document.dispatchEvent(new CustomEvent('tagged', {'detail': {
                                                          idx: currentidx,
                                                          info: currentinfo}}));
    }, function(){throw new Error("problem refetching data " +
                                  "for: " + JSON.stringify(currentinfo));});
  }
  function bad(){
    throw new Error("could not add tag");
  }
}


$('drop-tags-button').onclick = function delTags(){
  photodb.dropTags(currentinfo, good, bad);
  function good(){
    photodb.refresh(currentinfo, function(updated){
      showFileInformation(updated, currentidx);
      document.dispatchEvent(new CustomEvent('tagged', {'detail': {
                                                          idx: currentidx,
                                                          info: currentinfo}}));
    }, function(){throw new Error("problem refetching data " +
                                  "for: " + JSON.stringify(currentinfo));});
  }
  function bad(){
    throw new Error("could not drop tags");
  }
}

function showFileInformation(fileinfo, idx) {
  currentinfo = fileinfo;
  currentidx = idx;
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
  tagField.value = '';
  $('info-view').classList.remove('hidden');

  function populateMediaInfo(fileinfo) {
    var data = {
      //set the video filename using metadata
      'info-name': getFileName(fileinfo.metadata.video || fileinfo.name),
      'info-size': MediaUtils.formatSize(fileinfo.size),
      'info-type': fileinfo.type,
      'info-date': MediaUtils.formatDate(fileinfo.date),
      'info-resolution':
        fileinfo.metadata.width + 'x' + fileinfo.metadata.height,
      'info-tags': JSON.stringify(fileinfo.tag)
    };

    // Populate info overlay view
    MediaUtils.populateMediaInfo(data);
  }

  function getFileName(path) {
    return path.split('/').pop();
  }
}


