/* globals indexedDB */
/* exported MediaDB */

'use strict';

var MediaDB = (function() {

  function MediaDB(mediaType, metadataParser, options) {
    this.mediaType = mediaType;
    this.metadataParser = metadataParser;
    if (!options) {
      options = {};
    }
    this.indexes = options.indexes || [];
    this.version = options.version || 1;
    this.mimeTypes = options.mimeTypes;
    this.autoscan = (options.autoscan !== undefined) ? options.autoscan : true;
    this.state = MediaDB.OPENING;
    this.scanning = false;  // becomes true while scanning
    this.parsingBigFiles = false;
    this.updateRecord = options.updateRecord; // for data upgrade from client.
    if (options.excludeFilter && (options.excludeFilter instanceof RegExp)) {
      // only regular expression object is accepted.
      this.clientExcludeFilter = options.excludeFilter;
    }

    // While scanning, we attempt to send change events in batches.
    // After finding a new or deleted file, we'll wait this long before
    // sending events in case we find another new or deleted file right away.
    this.batchHoldTime = options.batchHoldTime || 100;

    // But we'll send a batch of changes right away if it gets this big
    // A batch size of 0 means no maximum batch size
    this.batchSize = options.batchSize || 0;

    this.dbname = 'MediaDB/' + this.mediaType + '/';

    var media = this;  // for the nested functions below

    // Private implementation details in this object
    this.details = {
      // This maps event type -> array of listeners
      // See addEventListener and removeEventListener
      eventListeners: {},

      // Properties for queuing up db insertions and deletions and also
      // for queueing up notifications to be sent
      pendingInsertions: [],   // Array of filenames to insert
      pendingDeletions: [],    // Array of filenames to remove
      whenDoneProcessing: [],  // Functions to run when queue is empty

      pendingCreateNotifications: [],  // Array of fileinfo objects
      pendingDeleteNotifications: [],  // Ditto
      pendingNotificationTimer: null,

      // This property holds the modification date of the newest file we have.
      // We need to know the newest file in order to look for newer ones during
      // scanning. We initialize newestFileModTime during initialization by
      // actually checking the database (using the date index). We also update
      // this property every time a new record is added to the database.
      newestFileModTime: 0
    };

    // Define a dummy metadata parser if we're not given one
    if (!this.metadataParser) {
      this.metadataParser = function(file, callback) {
        setTimeout(function() { callback({}); }, 0);
      };
    }

    // Open the database
    // Note that the user can upgrade the version and we can upgrade the version
    // DB Version is a 32bits unsigned short: upper 16bits is client app db
    // number, lower 16bits is MediaDB version number.
    var dbVersion = (0xFFFF & this.version) << 16 | (0xFFFF & MediaDB.VERSION);
    var openRequest = indexedDB.open(this.dbname,
                                     dbVersion);

    // This should never happen for Gaia apps
    openRequest.onerror = function(e) {
      console.error('MediaDB():', openRequest.error.name);
    };

    // This should never happen for Gaia apps
    openRequest.onblocked = function(e) {
      console.error('indexedDB.open() is blocked in MediaDB()');
    };

    // This is where we create (or delete and recreate) the database
    openRequest.onupgradeneeded = function(e) {
      var db = openRequest.result;
      // read transaction from event for data manipulation (read/write).
      var transaction = e.target.transaction;
      var oldVersion = e.oldVersion;
      // translate to db version and client version.
      var oldDbVersion = 0xFFFF & oldVersion;
      var oldClientVersion = 0xFFFF & (oldVersion >> 16);

      // if client version is 0, oldVersion is the version number prior to
      // bug 891797. The MediaDB.VERSION may be 2, and other parts is client
      // version.
      if (oldClientVersion === 0) {
        oldDbVersion = 2;
        oldClientVersion = oldVersion / oldDbVersion;
      }

      if (0 === db.objectStoreNames.length) {
        // No objectstore found. It is the first time use MediaDB, we need to
        // create it.
        createObjectStores(db);
      } else {
        // ObjectStore found, we need to upgrade data for both client upgrade
        // and mediadb upgrade.
        handleUpgrade(db, transaction, oldDbVersion, oldClientVersion);
      }
    };

    // This is called when we've got the database open and ready.
    openRequest.onsuccess = function(e) {
      media.db = openRequest.result;

      // Log any errors that propagate up to here
      media.db.onerror = function(event) {
        console.error('MediaDB: ',
                      event.target.error && event.target.error.name);
      };

      // Query the db to find the modification time of the newest file
      var cursorRequest =
        media.db.transaction('files', 'readonly')
        .objectStore('files')
        .index('date')
        .openCursor(null, 'prev');

      cursorRequest.onerror = function() {
        // If anything goes wrong just display an error.
        // If this fails, don't even attempt error recovery
        console.error('MediaDB initialization error', cursorRequest.error);
      };
      cursorRequest.onsuccess = function() {
        var cursor = cursorRequest.result;
        if (cursor) {
          media.details.newestFileModTime = cursor.value.date;
        }
        else {
          // No files in the db yet, so use a really old time
          media.details.newestFileModTime = 0;
        }

        // The DB is initialized, and we've got our mod time
        // so move on and initialize device storage
        initDeviceStorage();
      };
    };

    // helper function to create all indexes
    function createObjectStores(db) {
      // Now build the database
      var filestore = db.createObjectStore('files', { keyPath: 'name' });
      // Always index the files by modification date
      filestore.createIndex('date', 'date');
      // And index them by any other file properties or metadata properties
      // passed to the constructor
      media.indexes.forEach(function(indexName)  {
        // Don't recreate indexes we've already got
        if (indexName === 'name' || indexName === 'date') {
          return;
        }
        // the index name is also the keypath
        filestore.createIndex(indexName, indexName);
      });
    }

    // helper function to list all files and invoke callback with db, trans,
    // dbfiles, db version, client version as arguments.
    function enumerateOldFiles(store, callback) {
      var openCursorReq = store.openCursor();

      openCursorReq.onsuccess = function() {
        var cursor = openCursorReq.result;
        if (cursor) {
          callback(cursor.value);
          cursor.continue();
        }
      };
    }

    function handleUpgrade(db, trans, oldDbVersion, oldClientVersion) {
      // change state to upgrading that client apps may use it.
      media.state = MediaDB.UPGRADING;

      var evtDetail = {'oldMediaDBVersion': oldDbVersion,
                       'oldClientVersion': oldClientVersion,
                       'newMediaDBVersion': MediaDB.VERSION,
                       'newClientVersion': media.version};
      // send upgrading event
      dispatchEvent(media, 'upgrading', evtDetail);

      // The upgrade contains upgrading indexes and upgrading data.
      var store = trans.objectStore('files');

      // Part 1: upgrading indexes
      if (media.version != oldClientVersion) {
        // upgrade indexes changes from client app.
        upgradeIndexesChanges(store);
      }

      var clientUpgradeNeeded = (media.version != oldClientVersion) &&
                                media.updateRecord;

      // checking if we need to enumerate all files. This may improve the
      // performance of only changing indexes. If client app changes indexes,
      // they may not need to update records. In this case, we don't need to
      // enumerate all files.
      if ((2 != oldDbVersion || 3 != MediaDB.VERSION) && !clientUpgradeNeeded) {
        return;
      }

      // Part 2: upgrading data
      enumerateOldFiles(store, function doUpgrade(dbfile) {
        // handle mediadb upgrade from 2 to 3
        if (2 == oldDbVersion && 3 == MediaDB.VERSION) {
          upgradeDBVer2to3(store, dbfile);
        }
        // handle client upgrade
        if (clientUpgradeNeeded) {
          handleClientUpgrade(store, dbfile, oldClientVersion);
        }
      });
    }

    function upgradeIndexesChanges(store) {
      var dbIndexes = store.indexNames; // note: it is DOMStringList not array.
      var clientIndexes = media.indexes;

      for (var i = 0; i < dbIndexes.length; i++) {
        // indexes provided by mediadb, can't remove it.
        if ('name' === dbIndexes[i] || 'date' === dbIndexes[i]) {
          continue;
        }

        if (clientIndexes.indexOf(dbIndexes[i]) < 0) {
          store.deleteIndex(dbIndexes[i]);
        }
      }

      for (i = 0; i < clientIndexes.length; i++) {
        if (!dbIndexes.contains(clientIndexes[i])) {
          store.createIndex(clientIndexes[i], clientIndexes[i]);
        }
      }
    }

    function upgradeDBVer2to3(store, dbfile) {
      // if record is already starting with '/', don't update them.
      if (dbfile.name[0] === '/') {
        return;
      }
      store.delete(dbfile.name);
      dbfile.name = '/sdcard/' + dbfile.name;
      store.add(dbfile);
    }

    function handleClientUpgrade(store, dbfile, oldClientVersion) {
      try {
        dbfile.metadata = media.updateRecord(dbfile, oldClientVersion,
                                             media.version);
        store.put(dbfile);
      } catch (ex) {
        // discard client upgrade error, client app should handle it.
        console.warn('client app updates record, ' + dbfile.name +
                     ', failed: ' + ex.message);
      }
    }

    function initDeviceStorage() {
      var details = media.details;

      // Get the individual device storage objects, so that we can listen
      // for events on the different volumes separately.
      details.storages = navigator.getDeviceStorages(mediaType);
      details.availability = {};

      // Start off by getting the initial availablility of the storage areas
      // This is an async function that will call the next initialization
      // step when it is done.
      getStorageAvailability();

      // This is an asynchronous step in the db initialization process
      function getStorageAvailability() {
        var next = 0;
        getNextAvailability();

        function getNextAvailability() {
          if (next >= details.storages.length) {
            // We've gotten the availability of all storage areas, so
            // move on to the next step.
            setupHandlers();
            return;
          }

          var s = details.storages[next++];
          var name = s.storageName;
          var req = s.available();
          req.onsuccess = function(e) {
            details.availability[name] = req.result;
            getNextAvailability();
          };
          req.onerror = function(e) {
            details.availability[name] = 'unavailable';
            getNextAvailability();
          };
        }
      }

      function setupHandlers() {
        // Now that we know the state of all of the storage areas, register
        // an event listener to monitor changes to that state.
        /*for (var i = 0; i < details.storages.length; i++) {
          details.storages[i].addEventListener('change', changeHandler);
        }*/

        // Remember the listener so we can remove it in stop()
        //details.dsEventListener = changeHandler;

        // Move on to the next step
        sendInitialEvent();
      }

      function sendInitialEvent() {
        // Get our current state based on the device storage availability
        var state = getState(details.availability);

        // Switch to that state and send an appropriate event
        changeState(media, state);

        // If the state is ready, and we're auto scanning then start a scan
        /*if (media.autoscan) {
          scan(media);
        }*/
      }

      // Given a storage name -> availability map figure out what state
      // the mediadb object should be in
      function getState(availability) {
        var n = 0;   // total number of storages
        var a = 0;   // # that are available
        var u = 0;   // # that are unavailable
        var s = 0;   // # that are shared

        for (var name in availability) {
          n++;
          switch (availability[name]) {
          case 'available':
            a++;
            break;
          case 'unavailable':
            u++;
            break;
          case 'shared':
            s++;
            break;
          }
        }

        // If any volume is shared, then behave as if they are all shared
        // and make the entire MediaDB shared. This is because shared volumes
        // are generally shared transiently and most files on the volume will
        // probably still be there when the volume comes back. If we want to
        // keep the MediaDB available while one volume is shared we have to
        // rescan and discard all the files on the shared volume, which means
        // it will take much longer to recover when the volume comes back. So
        // it is better to just act as if all volumes are shared together
        if (s > 0) {
          return MediaDB.UNMOUNTED;
        }

        // If all volumes are unavailable, then MediaDB is unavailable
        if (u === n) {
          return MediaDB.NOCARD;
        }

        // Otherwise, there is at least one available volume, so MediaDB
        // is available.
        return MediaDB.READY;
      }

      function changeHandler(e) {
        switch (e.reason) {
        case 'modified':
        case 'deleted':
          fileChangeHandler(e);
          return;

        case 'available':
        case 'unavailable':
        case 'shared':
          volumeChangeHandler(e);
          return;

        default:  // we ignore created events and handle modified instead.
          return;
        }
      }

      function volumeChangeHandler(e) {
        var storageName = e.target.storageName;

        // If nothing changed, ignore this event
        if (details.availability[storageName] === e.reason) {
          return;
        }

        var oldState = media.state;

        // Record the new availability of the volume that changed.
        details.availability[storageName] = e.reason;

        // And figure out what our new state is
        var newState = getState(details.availability);

        // If the state changed, send out an event about it
        if (newState !== oldState) {
          changeState(media, newState);

          // Start scanning if we're available, and cancel scanning otherwise
          if (newState === MediaDB.READY) {
            if (media.autoscan) {
              scan(media);
            }
          }
          else {
            endscan(media);
          }
        }
        else if (newState === MediaDB.READY) {
          // In this case, the state did not change. But we may still need to
          // send out an event. If both states are READY, then the user
          // just inserted or removed an sdcard. If the user just added a
          // card, then we want to send another available event and start a
          // scan.  If the user just removed a card then we need to immediately
          // tell the client that happened so the music app (for example) can
          // stop playing. If it is playing a file that just disappeared it is
          // in danger of crashing. Also, in this case we must delete the
          // records (and send events) for all of the files on that card.
          if (e.reason === 'available') {
            // An SD card was just inserted, so send another ready event.
            dispatchEvent(media, 'ready');

            // And if we're automatically scanning, start the scan now.
            // It would be more efficient if the scan() function could scan
            // just one storage area at a time. But SD card insertion should
            // be rare enough that efficiency is not so important.
            if (media.autoscan) {
              scan(media);
            }
          }
          else if (e.reason === 'unavailable') {
            // An SD card was just removed. First send an event.
            dispatchEvent(media, 'cardremoved');

            // Now figure out all the files we know about that were on that
            // volume and remove their records from the database and send events
            // to the client.
            deleteAllFiles(storageName);
          }
        }
      }

      function fileChangeHandler(e) {
        var filename = e.path;
        if (ignoreName(media, filename)) {
          return;
        }

        // insertRecord and deleteRecord will send events to the client once
        // the db has been updated.
        if (e.reason === 'modified') {
          insertRecord(media, filename);
        } else {
          deleteRecord(media, filename);
        }
      }

      // Enumerate all entries in the DB and call deleteRecord for any whose
      // filename begins with the specified storageName
      function deleteAllFiles(storageName) {
        var storagePrefix = storageName ? '/' + storageName + '/' : '';
        var store = media.db.transaction('files').objectStore('files');
        var cursorRequest = store.openCursor();
        cursorRequest.onsuccess = function() {
          var cursor = cursorRequest.result;
          if (cursor) {
            if (cursor.value.name.startsWith(storagePrefix)) {
              // This will generate an event to notify the client that the
              // file is now gone.
              deleteRecord(media, cursor.value.name);
            }
            cursor.continue();
          }
        };
      }
    }
  }

  MediaDB.prototype = {
    close: function close() {
      // Close the database
      this.db.close();

      // There is no way to close device storage, but we at least want
      // to stop receiving events from it.
      /*for (var i = 0; i < this.details.storages.length; i++) {
        var s = this.details.storages[i];
        s.removeEventListener('change', this.details.dsEventListener);
      }*/

      // Change state and send out an event
      changeState(this, MediaDB.CLOSED);
    },

    addEventListener: function addEventListener(type, listener) {
      /*
      if (!this.details.eventListeners.hasOwnProperty(type)) {
        this.details.eventListeners[type] = [];
      }
      var listeners = this.details.eventListeners[type];
      if (listeners.indexOf(listener) !== -1) {
        return;
      }
      listeners.push(listener);
      */
    },

    removeEventListener: function removeEventListener(type, listener) {
      if (!this.details.eventListeners.hasOwnProperty(type)) {
        return;
      }
      var listeners = this.details.eventListeners[type];
      var position = listeners.indexOf(listener);
      if (position === -1) {
        return;
      }
      listeners.splice(position, 1);
    },

    // Look up the database record for the specfied filename and pass it
    // to the specified callback.
    getFileInfo: function getFile(filename, callback, errback) {
      if (this.state === MediaDB.OPENING) {
        throw Error('MediaDB is not ready. State: ' + this.state);
      }

      var media = this;

      // First, look up the fileinfo record in the db
      var read = media.db.transaction('files', 'readonly')
        .objectStore('files')
        .get(filename);

      read.onerror = function() {
        var msg = 'MediaDB.getFileInfo: unknown filename: ' + filename;
        if (errback) {
          errback(msg);
        } else {
          console.error(msg);
        }
      };

      read.onsuccess = function() {
        if (callback) {
          callback(read.result);
        }
      };
    },

    // Look up the specified filename in DeviceStorage and pass the
    // resulting File object to the specified callback.
    getFile: function getFile(filename, callback, errback) {
      if (this.state !== MediaDB.READY) {
        throw Error('MediaDB is not ready. State: ' + this.state);
      }

      var storage = navigator.getDeviceStorage(this.mediaType);
      var getRequest = storage.get(filename);
      getRequest.onsuccess = function() {
        callback(getRequest.result);
      };
      getRequest.onerror = function() {
        var errmsg = getRequest.error && getRequest.error.name;
        if (errback) {
          errback(errmsg);
        } else {
          console.error('MediaDB.getFile:', errmsg);
        }
      };
    },

    clear: function clear(callback, errback){
      if (this.state !== MediaDB.READY) {
        throw Error('MediaDB is not ready. State: ' + this.state);
      }
      var req = this.db.transaction('files', "readwrite")
        .objectStore('files').clear()
      req.onsuccess = callback;
      req.onerror = errback;
    },

    getRecord: function getRecord(filename, callback, errback){
      if (this.state !== MediaDB.READY) {
        throw Error('MediaDB is not ready. State: ' + this.state);
      }
      var ready = false;
      var ret = {};
      function good(res){
        if(res instanceof Blob)
          ret.data = res;
        else
          ret.info = res;
        if(ready){
          callback(ret);
        }
        ready = true;
      }
      function bad(){
        errback();
      }
      this.getFile(filename, good, bad);
      this.getFileInfo(filename, good, bad);
    },

    // Delete the named file from device storage.
    // This will cause a device storage change event, which will cause
    // mediadb to remove the file from the database and send out a
    // mediadb change event, which will notify the application UI.
    deleteFile: function deleteFile(filename) {
      if (this.state !== MediaDB.READY) {
        throw Error('MediaDB is not ready. State: ' + this.state);
      }

      var storage = navigator.getDeviceStorage(this.mediaType);
      storage.delete(filename).onerror = function(e) {
        console.error('MediaDB.deleteFile(): Failed to delete', filename,
                      'from DeviceStorage:', e.target.error);
      };
    },

    //
    // Save the specified blob to device storage, using the specified filename.
    // This will cause device storage to send us an event, and that event
    // will cause mediadb to add the file to its database, and that will
    // send out a mediadb event to the application UI.
    //
    addFile: function addFile(filename, file) {
      if (this.state !== MediaDB.READY) {
        throw Error('MediaDB is not ready. State: ' + this.state);
      }

      var media = this;
      // Refetch the default storage area, since the user can change it
      // in the settings app.
      var storage = navigator.getDeviceStorage(media.mediaType);

      // Delete any existing file by this name, then save the file.
      var deletereq = storage.delete(filename);
      deletereq.onsuccess = deletereq.onerror = save;

      function save() {
        var request = storage.addNamed(file, filename);
        request.onerror = function() {
          console.error('MediaDB: Failed to store', filename,
                        'in DeviceStorage:', request.error);
        };
      }
    },

    wholeInsert: function wholeInsert(filename, file, metadata, callback, errback){
      if (this.state !== MediaDB.READY) {
        throw Error('MediaDB is not ready. State: ' + this.state);
      }
      var blob_store = navigator.getDeviceStorage(this.mediaType);
      var finished = false;
      var error = false;

      var transaction = this.db.transaction('files', 'readwrite');
      var store = transaction.objectStore('files');
      store.add(metadata);
      var req = blob_store.addNamed(file, filename);
      var onsuccess = function(){
        if(finished){
          callback();
        }
        if(error){
          errback(this.error.name);
        }
        finished = true;
      }
      var onerror = function(){
        if(error || finished){
          errback('transaction Failed: ' + this.error.name);
        }
        error = true;
      };

      req.onerror = onerror.bind(req);
      req.onsuccess = onsuccess.bind(req);

      transaction.onerror = onerror.bind(transaction);
      transaction.oncomplete = onsuccess.bind(transaction);
    },

    // Look up the database record for the named file, and copy the properties
    // of the metadata object into the file's metadata, and then write the
    // updated record back to the database. The third argument is optional. If
    // you pass a function, it will be called when the metadata is written.
    updateMetadata: function(filename, metadata, callback) {
      if (this.state === MediaDB.OPENING) {
        throw Error('MediaDB is not ready. State: ' + this.state);
      }

      var media = this;

      // First, look up the fileinfo record in the db
      var read = media.db.transaction('files', 'readonly')
        .objectStore('files')
        .get(filename);

      read.onerror = function() {
        console.error('MediaDB.updateMetadata called with unknown filename');
      };

      read.onsuccess = function() {
        var fileinfo = read.result;

        // Update the fileinfo metadata
        Object.keys(metadata).forEach(function(key) {
          fileinfo.metadata[key] = metadata[key];
        });

        // And write it back into the database.
        var write = media.db.transaction('files', 'readwrite')
          .objectStore('files')
          .put(fileinfo);

        write.onerror = function() {
          console.error('MediaDB.updateMetadata: database write failed',
                        write.error && write.error.name);
        };

        if (callback) {
          write.onsuccess = function() {
            callback();
          };
        }
      };
    },

    // Count the number of records in the database and pass that number to the
    // specified callback. key is 'name', 'date' or one of the index names
    // passed to the constructor. range is be an IDBKeyRange that defines a
    // the range of key values to count.  key and range are optional
    // arguments.  If one argument is passed, it is the callback. If two
    // arguments are passed, they are assumed to be the range and callback.
    count: function(key, range, callback) {
      if (this.state !== MediaDB.READY) {
        throw Error('MediaDB is not ready. State: ' + this.state);
      }

      // range is an optional argument
      if (arguments.length === 1) {
        callback = key;
        range = undefined;
        key = undefined;
      }
      else if (arguments.length === 2) {
        callback = range;
        range = key;
        key = undefined;
      }

      var store = this.db.transaction('files').objectStore('files');
      if (key && key !== 'name') {
        store = store.index(key);
      }

      var countRequest = store.count(range || null);

      countRequest.onerror = function() {
        console.error('MediaDB.count() failed with', countRequest.error);
      };

      countRequest.onsuccess = function(e) {
        callback(e.target.result);
      };
    },


    // Enumerate all files in the filesystem, sorting by the specified
    // property (which must be one of the indexes, or null for the filename).
    // Direction is ascending or descending. Use whatever string
    // constant IndexedDB uses.  f is the function to pass each record to.
    //
    // Each record is an object like this:
    //
    // {
    //    // The basic fields are all from the File object
    //    name: // the filename
    //    type: // the file type
    //    size: // the file size
    //    date: // file mod time
    //    metadata: // whatever object the metadata parser returns
    // }
    //
    // This method returns an object that you can pass to cancelEnumeration()
    // to cancel an enumeration in progress. You can use the state property
    // of the returned object to find out the state of the enumeration. It
    // should be one of the strings 'enumerating', 'complete', 'cancelling'
    // 'cancelled', or 'error'
    //
    enumerate: function enumerate(key, range, direction, callback) {
      if (this.state !== MediaDB.READY) {
        throw Error('MediaDB is not ready. State: ' + this.state);
      }

      var handle = { state: 'enumerating' };

      // The first three arguments are optional, but the callback
      // is required, and we don't want to have to pass three nulls
      if (arguments.length === 1) {
        callback = key;
        key = undefined;
      }
      else if (arguments.length === 2) {
        callback = range;
        range = undefined;
      }
      else if (arguments.length === 3) {
        callback = direction;
        direction = undefined;
      }

      var store = this.db.transaction('files').objectStore('files');

      // If a key other than "name" is specified, then use the index for that
      // key instead of the store.
      if (key && key !== 'name') {
        store = store.index(key);
      }

      // Now create a cursor for the store or index.
      var cursorRequest = store.openCursor(range || null, direction || 'next');

      cursorRequest.onerror = function() {
        console.error('MediaDB.enumerate() failed with', cursorRequest.error);
        handle.state = 'error';
      };

      cursorRequest.onsuccess = function() {
        // If the enumeration has been cancelled, return without
        // calling the callback and without calling cursor.continue();
        if (handle.state === 'cancelling') {
          handle.state = 'cancelled';
          return;
        }

        var cursor = cursorRequest.result;
        if (cursor) {
          try {
            if (!cursor.value.fail) {  // if metadata parsing succeeded
              callback(cursor.value);
            }
          }
          catch (e) {
            console.warn('MediaDB.enumerate(): callback threw', e, e.stack);
          }
          cursor.continue();
        }
        else {
          // Final time, tell the callback that there are no more.
          handle.state = 'complete';
          callback(null);
        }
      };

      return handle;
    },

    // Basically this function is a variation of enumerate(), since retrieving
    // a large number of records from indexedDB takes some time and if the
    // enumeration is cancelled, people can use this function to resume getting
    // the rest records by providing an index where it was stopped.
    // Also, if you want to get just one record, just give the target index and
    // the first returned record is the record you want, remember to call
    // cancelEnumeration() immediately after you got the record.
    // All the arguments are required because this function is for advancing
    // enumeration, people who use this function should already have all the
    // arguments, and pass them again to get the target records from the index.
    advancedEnumerate: function(key, range, direction, index, callback) {
      if (this.state !== MediaDB.READY) {
        throw Error('MediaDB is not ready. State: ' + this.state);
      }

      var handle = { state: 'enumerating' };

      var store = this.db.transaction('files').objectStore('files');

      // If a key other than "name" is specified, then use the index for that
      // key instead of the store.
      if (key && key !== 'name') {
        store = store.index(key);
      }

      // Now create a cursor for the store or index.
      var cursorRequest = store.openCursor(range || null, direction || 'next');
      var isTarget = false;

      cursorRequest.onerror = function() {
        console.error('MediaDB.enumerate() failed with', cursorRequest.error);
        handle.state = 'error';
      };

      cursorRequest.onsuccess = function() {
        // If the enumeration has been cancelled, return without
        // calling the callback and without calling cursor.continue();
        if (handle.state === 'cancelling') {
          handle.state = 'cancelled';
          return;
        }

        var cursor = cursorRequest.result;
        if (cursor) {
          try {
            // if metadata parsing succeeded and is the target record
            if (!cursor.value.fail && isTarget) {
              callback(cursor.value);
              cursor.continue();
            }
            else {
              cursor.advance(index - 1);
              isTarget = true;
            }
          }
          catch (e) {
            console.warn('MediaDB.enumerate(): callback threw', e, e.stack);
          }
        }
        else {
          // Final time, tell the callback that there are no more.
          handle.state = 'complete';
          callback(null);
        }
      };

      return handle;
    },

    // This method takes the same arguments as enumerate(), but batches
    // the results into an array and passes them to the callback all at
    // once when the enumeration is complete. It uses enumerate() so it
    // is no faster than that method, but may be more convenient.
    enumerateAll: function enumerateAll(key, range, direction, callback) {
      var batch = [];

      // The first three arguments are optional, but the callback
      // is required, and we don't want to have to pass three nulls
      if (arguments.length === 1) {
        callback = key;
        key = undefined;
      }
      else if (arguments.length === 2) {
        callback = range;
        range = undefined;
      }
      else if (arguments.length === 3) {
        callback = direction;
        direction = undefined;
      }

      return this.enumerate(key, range, direction, function(fileinfo) {
        if (fileinfo !== null) {
          batch.push(fileinfo);
        } else {
          callback(batch);
        }
      });
    },

    // Cancel a pending enumeration. After calling this the callback for
    // the specified enumeration will not be invoked again.
    cancelEnumeration: function cancelEnumeration(handle) {
      if (handle.state === 'enumerating') {
        handle.state = 'cancelling';
      }
    },

    // Use the non-standard mozGetAll() function to return all of the
    // records in the database in one big batch. The records will be
    // sorted by filename
    getAll: function getAll(callback) {
      if (this.state !== MediaDB.READY) {
        throw Error('MediaDB is not ready. State: ' + this.state);
      }

      var store = this.db.transaction('files').objectStore('files');
      var request = store.mozGetAll();
      request.onerror = function() {
        console.error('MediaDB.getAll() failed with', request.error);
      };
      request.onsuccess = function() {
        var all = request.result;  // All records in the object store

        // Filter out files that failed metadata parsing
        var good = all.filter(function(fileinfo) { return !fileinfo.fail; });

        callback(good);
      };
    },

    // Scan for new or deleted files.
    // This is only necessary if you have explicitly disabled automatic
    // scanning by setting autoscan:false in the options object.
    /*scan: function() {
      scan(this);
    },*/

    // Use the device storage freeSpace() method and pass the returned
    // value to the callback.
    freeSpace: function freeSpace(callback) {
      if (this.state !== MediaDB.READY) {
        throw Error('MediaDB is not ready. State: ' + this.state);
      }

      var storage = navigator.getDeviceStorage(this.mediaType);
      var freereq = storage.freeSpace();
      freereq.onsuccess = function() {
        callback(freereq.result);
      };
    }
  };

  // This is the version number of the MediaDB schema. If we change this
  // number it will cause existing data stores to be deleted and rebuilt,
  // which is useful when the schema changes. Note that the user can also
  // upgrade the version number with an option to the MediaDB constructor.
  // The final indexedDB version number we use is the product of our version
  // and the user's version.
  // Version 2: We modified the default schema to include an index for file
  //            modification date.
  // Version 3: DeviceStorage had changed the file path from relative path(v1)
  //            to full qualified name(v1.1). We changed the code to handle the
  //            full qualified name and the upgrade from relative path to full
  //            qualified name.
  MediaDB.VERSION = 3;

  // These are the values of the state property of a MediaDB object
  // The NOCARD, UNMOUNTED, and CLOSED values are also used as the detail
  // property of 'unavailable' events
  MediaDB.OPENING = 'opening';     // MediaDB is initializing itself
  MediaDB.UPGRADING = 'upgrading'; // MediaDB is upgrading database
  MediaDB.READY = 'ready';         // MediaDB is available and ready for use
  MediaDB.NOCARD = 'nocard';       // Unavailable because there is no sd card
  MediaDB.UNMOUNTED = 'unmounted'; // Unavailable because card unmounted
  MediaDB.CLOSED = 'closed';       // Unavailalbe because MediaDB has closed

  /* Details of helper functions follow */

  //
  // Return true if media db should ignore this file.
  //
  // If any components of the path begin with a . we'll ignore the file.
  // The '.' prefix indicates hidden files and directories on Unix and
  // when files are "moved to trash" during a USB Mass Storage session they
  // are sometimes not actually deleted, but moved to a hidden directory.
  //
  // If an array of media types was specified when the MediaDB was created
  // and the type of this file is not a member of that list, then ignore it.
  //
  function ignore(media, file) {
    if (ignoreName(media, file.name)) {
      return true;
    }
    if (media.mimeTypes && media.mimeTypes.indexOf(file.type) === -1) {
      return true;
    }
    return false;
  }

  // Test whether this filename is one we ignore.
  // This is a separate function because device storage change events
  // give us a name only, not the file object.
  // Ignore files having directories beginning with .
  // Bug https://bugzilla.mozilla.org/show_bug.cgi?id=838179
  function ignoreName(media, filename) {
    if (media.clientExcludeFilter && media.clientExcludeFilter.test(filename)) {
      return true;
    } else {
      var path = filename.substring(0, filename.lastIndexOf('/') + 1);
      return (path[0] === '.' || path.indexOf('/.') !== -1);
    }
  }

  // Tell the db to start a manual scan. I think we don't do
  // this automatically from the constructor, but most apps will start
  // a scan right after calling the constructor and then will proceed to
  // enumerate what is already in the db. If scan performance is bad
  // for large media collections, apps can just have the user specify
  // when to rescan rather than doing it automatically. Until we have
  // change event notifications, gaia apps might want to do a scan
  // every time they are made visible.
  //
  // Filesystem changes discovered by a scan are generally
  // batched. If a scan discovers 10 new files, the information
  // about those files will generally be passed as an array to a the
  // onchange handler rather than calling that handler once for each
  // newly discovered file.  Apps can decide whether to handle
  // batches by processing each element individually or by just starting
  // fresh with a new call to enumerate().
  //
  // Scan details are not tightly specified, but the goal is to be
  // as efficient as possible.  We'll try to do a quick date-based
  // scan to look for new files and report those first. Following
  // that, a full scan will be compared with a full dump of the DB
  // to see if any files have been deleted.
  //
  function scan(media) {
    media.scanning = true;
    dispatchEvent(media, 'scanstart');

    // First, scan for new files since the last scan, if there was one
    // When the quickScan is done it will begin a full scan.  If we don't
    // have a last scan date, then the database is empty and we don't
    // have to do a full scan, since there will be no changes or deletions.
    quickScan(media.details.newestFileModTime);

    // Do a quick scan and then follow with a full scan
    function quickScan(timestamp) {
      var cursor;
      if (timestamp > 0) {
        media.details.firstscan = false;
        cursor = enumerateAll(media.details.storages, '', {
          // add 1 so we don't find the same newest file again
          since: new Date(timestamp + 1)
        });
      }
      else {
        // If there is no timestamp then this is the first time we've
        // scanned and we don't have any files in the database, which
        // allows important optimizations during the scanning process
        media.details.firstscan = true;
        media.details.records = [];
        cursor = enumerateAll(media.details.storages, '');
      }

      cursor.onsuccess = function() {
        if (!media.scanning) { // Abort if scanning has been cancelled
          return;
        }
        var file = cursor.result;
        if (file) {
          if (!ignore(media, file)) {
            insertRecord(media, file);
          }
          cursor.continue();
        }
        else {
          // Quick scan is done. When the queue is empty, force out
          // any batched created events and move on to the slower
          // more thorough full scan.
          whenDoneProcessing(media, function() {
            sendNotifications(media);
            if (media.details.firstscan) {
              // If this was the first scan, then we're done
              endscan(media);
            }
            else {
              // If this was not the first scan, then we need to go
              // ensure that all of the old files we know about are still there
              fullScan();
            }
          });
        }
      };

      cursor.onerror = function() {
        // We can't scan if we can't read device storage.
        // Perhaps the card was unmounted or pulled out
        console.warning('Error while scanning', cursor.error);
        endscan(media);
      };
    }

    // Get a complete list of files from DeviceStorage
    // Get a complete list of files from IndexedDB.
    // Sort them both (the indexedDB list will already be sorted)
    // Step through the lists noting deleted files and created files.
    // Pay attention to files whose size or date has changed and
    // treat those as deletions followed by insertions.
    // Sync up the database while stepping through the lists.
    function fullScan() {
      if (media.state !== MediaDB.READY) {
        endscan(media);
        return;
      }

      // The db may be busy right about now, processing files that
      // were found during the quick scan.  So we'll start off by
      // enumerating all files in device storage
      var dsfiles = [];
      var cursor = enumerateAll(media.details.storages, '');
      cursor.onsuccess = function() {
        if (!media.scanning) { // Abort if scanning has been cancelled
          return;
        }
        var file = cursor.result;
        if (file) {
          if (!ignore(media, file)) {
            dsfiles.push(file);
          }
          cursor.continue();
        }
        else {
          // We're done enumerating device storage, so get all files from db
          getDBFiles();
        }
      };

      cursor.onerror = function() {
        // We can't scan if we can't read device storage.
        // Perhaps the card was unmounted or pulled out
        console.warning('Error while scanning', cursor.error);
        endscan(media);
      };

      function getDBFiles() {
        var store = media.db.transaction('files').objectStore('files');
        var getAllRequest = store.mozGetAll();

        getAllRequest.onsuccess = function() {
          if (!media.scanning) { // Abort if scanning has been cancelled
            return;
          }
          var dbfiles = getAllRequest.result;  // Should already be sorted
          compareLists(dbfiles, dsfiles);
        };
      }

      function compareLists(dbfiles, dsfiles) {
        // The dbfiles are sorted when we get them from the db.
        // But the ds files are not sorted
        dsfiles.sort(function(a, b) {
          if (a.name < b.name) {
            return -1;
          } else {
            return 1;
          }
        });

        // Loop through both the dsfiles and dbfiles lists
        var dsindex = 0, dbindex = 0;
        while (true) {
          // Get the next DeviceStorage file or null
          var dsfile;
          if (dsindex < dsfiles.length) {
            dsfile = dsfiles[dsindex];
          } else {
            dsfile = null;
          }

          // Get the next DB file or null
          var dbfile;
          if (dbindex < dbfiles.length) {
            dbfile = dbfiles[dbindex];
          } else {
            dbfile = null;
          }

          // Case 1: both files are null.  If so, we're done.
          if (dsfile === null && dbfile === null) {
            break;
          }

          // Case 2: no more files in the db.  This means that
          // the file from ds is a new one
          if (dbfile === null) {
            insertRecord(media, dsfile);
            dsindex++;
            continue;
          }

          // Case 3: no more files in ds. This means that the db file
          // has been deleted
          if (dsfile === null) {
            deleteRecord(media, dbfile.name);
            dbindex++;
            continue;
          }

          // Case 4: two files with the same name.
          // 4a: date and size are the same for both: do nothing
          // 4b: file has changed: it is both a deletion and a creation
          if (dsfile.name === dbfile.name) {
            // In release 1.3 and before files reported local times, and in 1.4
            // and later they report UTC times. If the user has upgraded from
            // 1.3 to 1.4 they may have files in the db whose times are in a
            // local timezone. We want to recognize those files as matching
            // existing files so we consider two files to have the same time if
            // they are within +/- 12 hours of each other and if the difference
            // in times is an exactly multiple of 10 minutes. (This assumes all
            // world timezones are exact multiples of 10 minutes.)
            var lastModified = dsfile.lastModifiedDate;
            var timeDifference = lastModified.getTime() - dbfile.date;
            var sameTime = (timeDifference === 0 ||
              ((Math.abs(timeDifference) <= 12 * 60 * 60 * 1000) &&
              (timeDifference % 10 * 60 * 1000 === 0)));
            var sameSize = dsfile.size === dbfile.size;

            if (!sameTime || !sameSize) {
              deleteRecord(media, dbfile.name);
              insertRecord(media, dsfile);
            }
            dsindex++;
            dbindex++;
            continue;
          }

          // Case 5: the dsfile name is less than the dbfile name.
          // This means that the dsfile is new.  Like case 2
          if (dsfile.name < dbfile.name) {
            insertRecord(media, dsfile);
            dsindex++;
            continue;
          }

          // Case 6: the dsfile name is greater than the dbfile name.
          // this means that the dbfile no longer exists on disk
          if (dsfile.name > dbfile.name) {
            deleteRecord(media, dbfile.name);
            dbindex++;
            continue;
          }

          // That should be an exhaustive set of possiblities
          // and we should never reach this point.
          console.error('Assertion failed');
        }

        // Push a special value onto the queue so that when it is
        // processed we can trigger a 'scanend' event
        insertRecord(media, null);
      }
    }
  }

  // Called to send out a scanend event when scanning is done.
  // This event is sent on normal scan termination and also
  // when something goes wrong, such as the device storage being
  // unmounted during a scan.
  function endscan(media) {
    if (media.scanning) {
      media.scanning = false;
      media.parsingBigFiles = false;
      dispatchEvent(media, 'scanend');
    }
  }

  // Pass in a file, or a filename.  The function queues it up for
  // metadata parsing and insertion into the database, and will send a
  // mediadb change event (possibly batched with other changes).
  // Ensures that only one file is being parsed at a time, but tries
  // to make as many db changes in one transaction as possible.  The
  // special value null indicates that scanning is complete.
  function insertRecord(media, fileOrName) {
    var details = media.details;

    // Add this file to the queue of files to process
    details.pendingInsertions.push(fileOrName);

    // If the queue is already being processed, just return
    if (details.processingQueue) {
      return;
    }

    // Otherwise, start processing the queue.
    processQueue(media);
  }

  // Delete the database record associated with filename.
  function deleteRecord(media, filename) {
    var details = media.details;

    // Add this file to the queue of files to process
    details.pendingDeletions.push(filename);

    // If there is already a transaction in progress return now.
    if (details.processingQueue) {
      return;
    }

    // Otherwise, start processing the queue
    processQueue(media);
  }

  function whenDoneProcessing(media, f) {
    var details = media.details;
    if (details.processingQueue) {
      details.whenDoneProcessing.push(f);
    } else {
      f();
    }
  }

  function processQueue(media) {
    var details = media.details;

    details.processingQueue = true;

    // Now get one filename off a queue and store it
    next();

    // Take an item from a queue and process it.
    // Deletions are always processed before insertions because we want
    // to clear away non-functional parts of the UI ASAP.
    function next() {
      if (details.pendingDeletions.length > 0) {
        deleteFiles();
      }
      else if (details.pendingInsertions.length > 0) {
        insertFile(details.pendingInsertions.shift());
      }
      else {
        details.processingQueue = false;
        if (details.whenDoneProcessing.length > 0) {
          var functions = details.whenDoneProcessing;
          details.whenDoneProcessing = [];
          functions.forEach(function(f) { f(); });
        }
      }
    }

    // Delete all of the pending files in a single transaction
    function deleteFiles() {
      var transaction = media.db.transaction('files', 'readwrite');
      var store = transaction.objectStore('files');

      deleteNextFile();

      function deleteNextFile() {
        if (details.pendingDeletions.length === 0) {
          next();
          return;
        }
        var filename = details.pendingDeletions.shift();
        var request = store.delete(filename);
        request.onerror = function() {
          // This probably means that the file wasn't in the db yet
          console.warn('MediaDB: Unknown file in deleteRecord:',
                       filename, getreq.error);
          deleteNextFile();
        };
        request.onsuccess = function() {
          // We succeeded, so remember to send out an event about it.
          queueDeleteNotification(media, filename);
          deleteNextFile();
        };
      }
    }

    // Insert a file into the db. One transaction per insertion.
    // The argument might be a filename or a File object.
    function insertFile(f) {
      // null is a special value pushed on to the queue when a scan()
      // is complete.  We use it to trigger a scanend event
      // after all the change events from the scan are delivered
      if (f === null) {
        sendNotifications(media);
        endscan(media);
        next();
        return;
      }

      // If we got a filename, look up the file in device storage
      if (typeof f === 'string') {
        // Note: Even though we're using the default storage area, if the
        //       filename is fully qualified, it will get redirected to the
        //       appropriate storage area.
        var storage = navigator.getDeviceStorage(media.mediaType);
        var getreq = storage.get(f);
        getreq.onerror = function() {
          console.warn('MediaDB: Unknown file in insertRecord:',
                       f, getreq.error);
          next();
        };
        getreq.onsuccess = function() {
          // We got the filename from a device storage change event and
          // verified that the filename was not one that we wanted to ignore.
          // But until now, we haven't had the file and its type to check
          // against the mimeTypes array. So if necessary we check again.
          // If the file is not one of the types we're interested in we skip
          // it. Otherwise, parse its metadata.
          if (media.mimeTypes && ignore(media, getreq.result)) {
            next();
          } else {
            parseMetadata(getreq.result, f);
          }
        };
      }
      else {
        // otherwise f is the file we want
        parseMetadata(f, f.name);
      }
    }

    function parseMetadata(file, filename) {
      if (!file.lastModifiedDate) {
        console.warn('MediaDB: parseMetadata: no lastModifiedDate for',
                     filename,
                     'using Date.now() until #793955 is fixed');
      }

      // Basic information about the file
      var fileinfo = {
        name: filename, // we can't trust file.name
        type: file.type,
        size: file.size,
        date: file.lastModifiedDate ?
          file.lastModifiedDate.getTime() :
          Date.now()
      };

      if (fileinfo.date > details.newestFileModTime) {
        details.newestFileModTime = fileinfo.date;
      }

      // Get metadata about the file
      media.metadataParser(file, gotMetadata, metadataError, parsingBigFile);
      function parsingBigFile() {
        media.parsingBigFiles = true;
      }
      function metadataError(e) {
        console.warn('MediaDB: error parsing metadata for',
                     filename, ':', e);
        // If we get an error parsing the metadata, assume it is invalid
        // and make a note in the fileinfo record that we store in the database
        // If we don't store it in the database, we'll keep finding it
        // on every scan. But we make sure never to return the invalid file
        // on an enumerate call.
        fileinfo.fail = true;
        storeRecord(fileinfo);
      }
      function gotMetadata(metadata) {
        fileinfo.metadata = metadata;
        storeRecord(fileinfo);
        if (!media.scanning) {
          // single file parsing.
          media.parsingBigFiles = false;
        }
      }
    }

    function storeRecord(fileinfo) {
      if (media.details.firstscan) {
        // If this is the first scan then we know this is a new file and
        // we can assume that adding it to the db will succeed.
        // So we can just queue a notification about the new file without
        // waiting for a db operation.
        media.details.records.push(fileinfo);
        if (!fileinfo.fail) {
          queueCreateNotification(media, fileinfo);
        }
        // And go on to the next
        next();
      }
      else {
        // If this is not the first scan, then we may already have a db
        // record for this new file. In that case, the call to add() above
        // is going to fail. We need to handle that case, so we can't send
        // out the new file notification until we get a response to the add().
        var transaction = media.db.transaction('files', 'readwrite');
        var store = transaction.objectStore('files');
        var request = store.add(fileinfo);

        request.onsuccess = function() {
          // Remember to send an event about this new file
          if (!fileinfo.fail) {
            queueCreateNotification(media, fileinfo);
          }
          // And go on to the next
          next();
        };
        request.onerror = function(event) {
          // If the error name is 'ConstraintError' it means that the
          // file already exists in the database. So try again, using put()
          // instead of add(). If that succeeds, then queue a delete
          // notification along with the insert notification.  If the
          // second try fails, or if the error was something different
          // then issue a warning and continue with the next.
          if (request.error.name === 'ConstraintError') {
            // Don't let the higher-level DB error handler report the error
            event.stopPropagation();
            // And don't spew a default error message to the console either
            event.preventDefault();
            var putrequest = store.put(fileinfo);
            putrequest.onsuccess = function() {
              queueDeleteNotification(media, fileinfo.name);
              if (!fileinfo.fail) {
                queueCreateNotification(media, fileinfo);
              }
              next();
            };
            putrequest.onerror = function() {
              // Report and move on
              console.error('MediaDB: unexpected ConstraintError',
                            'in insertRecord for file:', fileinfo.name);
              next();
            };
          }
          else {
            // Something unexpected happened!
            // All we can do is report it and move on
            console.error('MediaDB: unexpected error in insertRecord:',
                          request.error, 'for file:', fileinfo.name);
            next();
          }
        };
      }
    }
  }

  // Don't send out notification events right away. Wait a short time to
  // see if others arrive that we can batch up.  This is common for scanning
  function queueCreateNotification(media, fileinfo) {
    var creates = media.details.pendingCreateNotifications;
    creates.push(fileinfo);
    if (media.batchSize && creates.length >= media.batchSize) {
      sendNotifications(media);
    } else {
      resetNotificationTimer(media);
    }
  }

  function queueDeleteNotification(media, filename) {
    var deletes = media.details.pendingDeleteNotifications;
    deletes.push(filename);
    if (media.batchSize && deletes.length >= media.batchSize) {
      sendNotifications(media);
    } else {
      resetNotificationTimer(media);
    }
  }

  function resetNotificationTimer(media) {
    var details = media.details;
    if (details.pendingNotificationTimer) {
      clearTimeout(details.pendingNotificationTimer);
    }
    details.pendingNotificationTimer =
      setTimeout(function() { sendNotifications(media); },
                 media.scanning ? media.batchHoldTime : 100);
  }

  // Send out notifications for creations and deletions
  function sendNotifications(media) {
    var details = media.details;
    if (details.pendingNotificationTimer) {
      clearTimeout(details.pendingNotificationTimer);
      details.pendingNotificationTimer = null;
    }
    if (details.pendingDeleteNotifications.length > 0) {
      var deletions = details.pendingDeleteNotifications;
      details.pendingDeleteNotifications = [];
      dispatchEvent(media, 'deleted', deletions);
    }

    if (details.pendingCreateNotifications.length > 0) {
      var creations = details.pendingCreateNotifications;
      details.pendingCreateNotifications = [];

      // If this is a first scan, and we have records that are not
      // in the db yet, write them to the db now
      if (details.firstscan && details.records.length > 0) {
        var transaction = media.db.transaction('files', 'readwrite');
        var store = transaction.objectStore('files');
        for (var i = 0; i < details.records.length; i++) {
          store.add(details.records[i]);
        }
        details.records.length = 0;

        // One of the original points of this firstscan optimization was that
        // we could dispatch the created events without waiting for the
        // database writes to complete. It turns out (see bug 963917) that
        // we can't do that because the Gallery app needs to read records
        // from the db in order to be sure it is holding file-based blobs
        // instead of memory-based blobs. So we wait for the transaction to
        // complete before sending the notifications.
        transaction.oncomplete = function() {
          dispatchEvent(media, 'created', creations);
        };
      }
      else {
        dispatchEvent(media, 'created', creations);
      }
    }
  }

  function dispatchEvent(media, type, detail) {
    var handler = media['on' + type];
    var listeners = media.details.eventListeners[type];

    // Return if there is nothing to handle the event
    if (!handler && (!listeners || listeners.length === 0)) {
      return;
    }

    // We use a fake event object
    var event = {
      type: type,
      target: media,
      currentTarget: media,
      timestamp: Date.now(),
      detail: detail
    };

    // Call the 'on' handler property if there is one
    if (typeof handler === 'function') {
      try {
        handler.call(media, event);
      }
      catch (e) {
        console.warn('MediaDB: ', 'on' + type,
                     'event handler threw', e, e.stack);
      }
    }

    // Now call the listeners if there are any
    if (!listeners) {
      return;
    }
    for (var i = 0; i < listeners.length; i++) {
      try {
        var listener = listeners[i];
        if (typeof listener === 'function') {
          listener.call(media, event);
        }
        else {
          listener.handleEvent(event);
        }
      }
      catch (e) {
        console.warn('MediaDB: ', type, 'event listener threw', e, e.stack);
      }
    }
  }

  function changeState(media, state) {
    if (media.state !== state) {
      media.state = state;
      if (state === MediaDB.READY) {
        dispatchEvent(media, 'ready');
      } else {
        dispatchEvent(media, 'unavailable', state);
      }
    }
  }

  return MediaDB;

}());
