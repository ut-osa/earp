define(function() {
  'use strict';

  function debug(str) {
    dump('DeviceStorage: ' + str + '\n');
  }


  function save(uid, cmd, storage, blob, filename) {
    var deviceStorage = navigator.getDeviceStorage(storage);

    if (!deviceStorage) {
      self.sendMessage(uid, cmd, [false, 'no-device-storage']);
      return;
    }

    var rdb = navigator.getRDB("wmd-mail");
    rdb.onsuccess = function(event) {
        var now = new Date();
        var epoch = now.getTime();
        var obj = {BLOB: blob, name: filename, date: epoch, mime: blob.type};
        var request = rdb.insert("attachments", obj);
        request.onerror = function() {
            alert("Failed to insert FILENAME: " + filename);
        }
    };
    rdb.onerror = function() {
        alert("Failed to connect to the database");
    }

    var req = deviceStorage.addNamed(blob, filename);
    req.onerror = function() {
      alert("ERROR: " + JSON.stringify(error.this));
      self.sendMessage(uid, cmd, [false, req.error.name]);
    };

    req.onsuccess = function(e) {
      var prefix = '';

      if (typeof window.IS_GELAM_TEST !== 'undefined') {
        prefix = 'TEST_PREFIX/';
      }

      // Bool success, String err, String filename
      self.sendMessage(uid, cmd, [true, null, prefix + e.target.result]);
    };
  }

  var self = {
    name: 'devicestorage',
    sendMessage: null,
    process: function(uid, cmd, args) {
      debug('process ' + cmd);
      switch (cmd) {
        case 'save':
          save(uid, cmd, args[0], args[1], args[2]);
          break;
      }
    }
  };
  return self;
});
