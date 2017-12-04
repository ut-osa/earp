var FileIO = {

    makeFilePersistent: function(tempURI, newName, callback) {
        //resolve the file URI
        //console.log("[FILEIO]: makeFilePersistent: " + tempURI);
        if (Device.platform === "FirefoxOS") {
            newName = Globals.appName.replace(/ /g, '') + "/" + newName;
            //console.log("tempURI: " + tempURI);
            //console.log("newname: " + newName);
            
            //var elDom = document.getElementById("imgSImage");
            var elDom = document.createElement("img");
            //console.log("created img");
            function myLoad() {
                
                //console.log("load");
                elDom.removeEventListener('load', myLoad); // to avoid a loop
                var imgCanvas = document.createElement("canvas"),
                imgContext = imgCanvas.getContext("2d");
                imgCanvas.width = elDom.width;
                imgCanvas.height = elDom.height;
                imgContext.drawImage(elDom, 0, 0, elDom.width, elDom.height);
                imgCanvas.toBlob(function(blob) {
                    //console.log("Blob");
                    //console.log(blob);
                    var sdcard = navigator.getDeviceStorage("pictures");
                    var requestAdd = sdcard.addNamed(blob, newName);
                    
                    requestAdd.onsuccess = function() {
                        $.mobile.loading("hide");
                        //console.log("RequestAdd success");
                        callback(newName);
                    };
                    
                    requestAdd.onerror = function() {
                        $.mobile.loading("hide");
                        FileIO.errorHandler("Unable to write file: " + this.error.name);
                    };
                });
            }
            $.mobile.loading("show");
            elDom.addEventListener("load", myLoad, false);
            //console.log("setting src");
            elDom.src = tempURI; 
            
        } else {
            window.resolveLocalFileSystemURL(tempURI, function(fileEntry) {
                //console.log("[FILEIO]: Resolved Temp File to FileEntry");
                //console.log(fileEntry);
                window.requestFileSystem(LocalFileSystem.PERSISTENT, 0,
                    function(fileSystem) {
                        //console.log("[FILEIO]: Got filesystem");
                        //console.log(fileSystem);
                        if (Device.platform === "Android") {
                            fileSystem.root.getDirectory(Globals.appName.replace(/ /g, ''), {create: true}, function(dirEntry) {
                                fileEntry.copyTo(dirEntry, newName, function(newFileEntry) {
                                    //console.log("[FILEIO]: Moved File");
                                    //console.log("[FILEIO]: New URI: " + newFileEntry.fullPath);
                                    callback(newFileEntry.fullPath);
                                }, FileIO.errorHandler);  
                            });
                        } else {
                            fileEntry.moveTo(fileSystem.root, newName, function(newFileEntry) {
                                //console.log("[FILEIO]: Moved File");
                                //console.log("[FILEIO]: New URI: " + newFileEntry.fullPath);
                                callback(newFileEntry.fullPath);
                            }, FileIO.errorHandler);    
                        }
                    }, FileIO.errorHandler);
            }, FileIO.errorHandler);   
        }
    },
    
    deleteFile: function(fileURI, callback) {
        //console.log("[FILEIO]: deleteFile: " + fileURI);
        window.resolveLocalFileSystemURL(fileURI, function(fileEntry) {
            //console.log("[FILEIO]: Resolved File to FileEntry");
            fileEntry.remove();
            //console.log("removed");
            callback(true);
        }, FileIO.errorHandler);
    },
    
    writeBinaryFile: function(binaryData, fileName, callback) {
        //console.log("[FILEIO]: writeBinaryFile");
        window.requestFileSystem(LocalFileSystem.PERSISTENT, 0,
            function(fileSystem) {
                fileSystem.root.getFile(fileName, {create: true, exclusive: false}, function(fileEntry) {
                    fileEntry.createWriter(function(writer) {
                        //console.log("[FILEIO]: created writer");
                        writer.onwriteend = function(evt) {
                            //console.log("[FILEIO]: write end");
                            //console.log(evt);
                            callback(fileEntry.fullPath);
                        };
        
                        writer.write(binaryData); 
                    });
                }, FileIO.errorHandler);
            }, FileIO.errorHandler);
    },

    getFileURI: function(partialPath, callback) {
        if (Device.platform === "Browser" || partialPath.indexOf("Local:") > -1) {
            if (partialPath.indexOf("Local:") > -1) {
                //console.log("Replace Local");
                partialPath = partialPath.replace("Local:", "");
            }
            callback(partialPath);
        } else if (Device.platform === "FirefoxOS") {
            var files = navigator.getDeviceStorage("pictures");
            var cursor = files.enumerate();

            cursor.onsuccess = function () {
              
              var file = this.result;
              
              if (file != null) {
               //console.log("Got file: " + file.name);
               if (file.name === "/sdcard/" + partialPath) {
                   //console.log("FOUND IT");
                  fileURI = window.URL.createObjectURL(file);
                  //console.log("FileURI: " + fileURI);
                  callback(fileURI);
                  this.done = true;
               } else {
                  this.done = false;   
               }

              } else {
                this.done = true;
              }

              if (!this.done) {
                this.continue();
              }
            };
        } else if (partialPath === "") {
            callback("");
        } else {
            window.requestFileSystem(LocalFileSystem.PERSISTENT, 0,
            function(fileSystem) {
                //console.log("[FILEIO]: Got filesystem");
                var fileURI = fileSystem.root.toURL() + partialPath;
                //console.log("[FILEIO]: Full Path: " + fileURI);
                callback(fileURI);
            }, FileIO.errorHandler);   
        }
    },
    
    getB64FromFileURI: function(fileURI, callback) {
        //console.log('[FILEIO]: getB64FromFileURI: ' + fileURI);
        window.resolveLocalFileSystemURL(fileURI, function(fileEntry) {
            //console.log("[FILEIO]: Resolved FileURI to FileEntry");
            //console.log(fileEntry);
            fileEntry.file(function(file) {
                var reader = new FileReader();
                var b64='';
                reader.onloadend = function(evt) {
                    b64 = evt.target.result;
                    //console.log("[FILEIO]: got base64 len: " + b64.length);
                    //console.log("[FILEIO]: line breaks: " + b64.indexOf("\n"));
                    callback(b64);
                };
                reader.readAsDataURL(file);
            }, FileIO.errorHandler);
        }, FileIO.errorHandler);
    },
    
    getBlobFromBase64: function (b64Data, contentType, sliceSize) { 
        //console.log('[FILEIO]: getBlobFromBase64');
        //console.log('b64Data');
        var binary;
        if (b64Data.indexOf(',') > -1) {
            binary = atob(b64Data.split(',')[1]);             
        } else {
            binary = b64Data;
        }

        // atob() decode base64 data.. 
        //console.log("[FILEIO]: got binary");
        var array = []; 
        for (var i = 0; i < binary.length; i++) { 
            array.push(binary.charCodeAt(i));   
            // convert to binary.. 
        } 
        //console.log("[FILEIO]: pushed to array");
        var blob=null;
        var byteArrays = [new Uint8Array(array)];
        var byteArray = new Uint8Array(array);
        var binaryArray=byteArray.buffer;
        contentType = 'image/jpeg';
        try{
           blob = new Blob(byteArrays, {type: contentType});
        }
        catch(e){
            // TypeError old chrome and FF
            blob = binaryArray;
        }
        //var file = new Blob([new Uint8Array(array)], {type: 'image/jpeg'});    // create blob file.. 
        //console.log('[FILEIO]: Got Blob');
        //console.log(blob);
        return blob;


    },

    // simple error handler
    errorHandler: function(e) {
        //console.log('[FILEIO]: Error: ');
        //console.log(e);
    }
};