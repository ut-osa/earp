   function downloadImage(url, filename, dir, callback) {
       //console.log('downloadFile');
       function onRequestFileSystemSuccess(fileSystem) {
           //console.log('onRequestFileSystemSuccess');
           fileSystem.root.getDirectory(Globals.appName.replace(/ /g, '') + "DLs", {create: true}, function(dirEntry) {
               dirEntry.getFile(
                   'dummy.html', {
                       create: true,
                       exclusive: false
                   },
                   onGetFileSuccess,
                   fail
               ); 
           });
       }

       function onGetFileSuccess(fileEntry) {
           //console.log('onGetFileSuccess!');
           var path = fileEntry.toURL().replace('dummy.html', '');
           var fileTransfer = new FileTransfer();
           fileEntry.remove();

           fileTransfer.download(
               url,
               path + filename,
               function(file) {
                   //console.log(file);
                   //console.log('download complete: ' + file.toURL());
                   callback(file.toURL());
               },
               function(error) {
                   //console.log(error);
                   //console.log('download error source ' + error.source);
                   //console.log('download error target ' + error.target);
                   //console.log('upload error code: ' + error.code);
                   callback(null);
               }
           );
       }

       function fail(evt) {
           //console.log(evt.target.error.code);
           callback(null);
       }

       if (true) {
       //if (Device.platform === "FirefoxOS") {
           //console.log("download firefox");
           downloadImageAsBase64(url, filename, dir, function(result) {
               callback(result);
           });
       } else {
           //console.log("download mobile");
           window.requestFileSystem(
               LocalFileSystem.PERSISTENT,
               0,
               onRequestFileSystemSuccess,
               fail
           );
       }
   }


   function downloadImageAsBase64(url, filename, dir, callback) {
       //console.log("Download Image as Base64: " + url);
       var xhr = new XMLHttpRequest({
           mozSystem: true
       });

       if (dir !== undefined && dir !== "") {
           filename = dir + "/" + filename;
       }

       xhr.open("GET", url, true);
       xhr.responseType = "arraybuffer";

       xhr.onload = function() {

           if (this.status == 200) {
               var base64Image = "";
               var uInt8Array = new Uint8Array(this.response);
               var i = uInt8Array.length;
               var binaryString = new Array(i);
               while (i--) {
                   binaryString[i] = String.fromCharCode(uInt8Array[i]);
               }
               var data = binaryString.join('');

               var base64 = window.btoa(data);
               //console.log("Image: " + base64Image);
               base64Image = "data:image/png;base64," + base64;
               callback(base64Image);
           } else {
               //console.log("download failed: " + this.status);
               callback(url);
           }
       };


       xhr.onerror = function() {
           //console.log("Error with System XHR");
           callback(url);
       };
       xhr.send();
   }