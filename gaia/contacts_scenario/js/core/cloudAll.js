function cloudEncode(data, encoding) {
    //console.log("Cloud Data Before: " + data);
    if (encoding == "encode") {
        data = escape(data);
    } else if (encoding == "decode") {
        data = unescape(data);
    }
    //console.log("Cloud Data After: " + data);
    return data;
}

function Cloud(cloudId, user, appId, cloudIdRemote, cloudIdLocal, cloudData, username, password, encoding, cloudDataId, cloudHasBlob, cloudIsBlob, dataPart, dataTotal) {
    this.cloudId = cloudId;
    this.appId = Globals.appId;
    this.cloudData = cloudData;
    this.cloudIdRemote = cloudIdRemote;
    this.cloudIdLocal = cloudIdLocal;
    this.username = escape(username);
    this.password = escape(password);
    this.cloudHasBlob = cloudHasBlob;
    this.cloudIsBlob = cloudIsBlob;
    this.cloudDataId = cloudDataId;
    this.pushClient = CloudAll.pushClient;
    this.dataPart = dataPart;
    this.dataTotal = dataTotal;
}

function CloudBlob(id, data, user, localId) {
    this.id = id;
    this.data = data;
    this.user = user;
    this.localId = localId;
}

function CloudHist(cloudId, cloudUsername) {
    //cloudId format: "cloudHistPush" + Globals.mUsername + cloudUsername + cloudHist.cloudId
    //cloudId format: "cloudHistGet" + Globals.mUsername + cloudUsername + cloudHist.cloudIdRemote
    this.cloudId = cloudId;
    this.cloudUsername = cloudUsername;
}

var CloudAll = {
  get: function(appId, username, password, callback) {
        //console.log('CloudGet');
        app.findNextCloud(Globals.mUsername, username, "get", function(cloudHist) {

            var s;
            var cloudIdRemote;
            var l;
            cloudIdRemote = cloudHist.cloudId;
            //console.log("Last cloud id remote: " + cloudIdRemote);
            //function Cloud(cloudId, user, Globals.appId, cloudIdRemote, cloudIdLocal, cloudData, username, password, encoding, cloudDataId, cloudHasBlob, cloudIsBlob, dataPart, dataTotal)
            var myCloud = new Cloud(0, '', Globals.appId, cloudIdRemote, 0, '', username, password, null, '', 0, 0, 0, 1, 1);
            //console.log('GET REQUEST:');
            //console.log(myCloud);

            Internet.getURLSource('https://rebrandcloud.secure.omnis.com/cloud/get.asp', myCloud, false, function(data) {
                if (data) {
                    //console.log('CloudGet done');
                    //console.log(data);
                    l = data.length;
                    for (var i = 0; i < l; i++) {
                        //console.log(data[i].cloudData);
                        if (data[i].cloudData != 'undefined') {
                            //function Cloud(cloudId, user, Globals.appId, cloudIdRemote, cloudIdLocal, cloudData, username, password, encoding, cloudDataId, cloudHasBlob, cloudIsBlob, dataPart, dataTotal)
                            var myCloud = new Cloud(0, Globals.mUsername, Globals.appId, data[i].cloudIdRemote, 0, unescape(data[i].cloudData), username, password, 'decode', '', data[i].cloudHasBlob, 0, 1, 1);

                            myCloud.pushClient = data[i].pushClient;
                            //console.log('GOT CLOUD');
                            //console.log(myCloud);
                            callback(true, myCloud, i, l - 1);
                        } else {
                            //console.log("undefined?");
                            callback(false, null, i, l - 1);
                        }
                    }
                    if (l <= 0) {
                        //console.log("no length");
                        callback(false, null, 0, 0);
                    }
                } else {
                    callback(false, null, 0, 0);
                }
            });
        });
    },

    getBlob: function(myCloud, callback) {
        //console.log('cloudGetBlob');
        var clouds = [];
        var empty = [];
        //var url = 'https://rebrandcloud.secure.omnis.com/cloud/getBlobTest.asp';
        var url = 'https://rebrandcloud.secure.omnis.com/cloud/getBlob.asp';
        //console.log(url + "?" + serialize(myCloud));
        Internet.getURLSource(url, myCloud, false, function(data) {
             if (data) {
                 //console.log('CloudGetBlob done' + data.length);
                 //console.log(data);
// 
                 for (var i = 0; i < data.length; i++) {
                    // //console.log(data[i].cloudData);
                     if (data[i].cloudData != 'undefined') {
                         //function Cloud(cloudId, user, Globals.appId, cloudIdRemote, cloudIdLocal, cloudData, username, password, encoding, cloudDataId, cloudHasBlob, cloudIsBlob, dataPart, dataTotal)
                         var newCloud = new Cloud(0, Globals.mUsername, Globals.appId, data[i].cloudIdRemote, 0, unescape(data[i].cloudData), myCloud.username, myCloud.password, 'decode', '', 0, -1, 1, 1);
                         newCloud.pushClient = 0;
                         //console.log(myCloud);
                         clouds.push(newCloud);
                     }
                 }
             }
            callback(true, clouds);
        });

    },  
    
    login: function(appId, username, password, callback) {
        //console.log("Cloud login");
        //function Cloud(cloudId, user, Globals.appId, cloudIdRemote, cloudIdLocal, cloudData, username, password, encoding, cloudDataId, cloudHasBlob, cloudIsBlob, dataPart, dataTotal)
        var myCloud = new Cloud(0, Globals.mUsername, Globals.appId, 0, 0, '', username, password, null, '', 0, 0, 1, 1);
        var online = Internet.isOnline();
        if (online) {
            //console.log('Navigator online');
            if (Internet.hostReachable()) {
                //console.log('Host reachable, begin cloud');
                //console.log('sending');
                //console.log(myCloud);
                Internet.getURLSource('https://rebrandcloud.secure.omnis.com/cloud/login.asp', myCloud, false, function(data) {
                    if (data) {
                        if (data.cloudData !== undefined) {
                            //function Cloud(cloudId, user, Globals.appId, cloudIdRemote, cloudIdLocal, cloudData, username, password, encoding, cloudDataId, cloudHasBlob, cloudIsBlob, dataPart, dataTotal) {
                            var myCloud = new Cloud(0, Globals.mUsername, Globals.appId, 0, 0, unescape(data.cloudData), username, password, 'decode', '', 0, 0, 1, 1);
                            callback(true, myCloud);
                        }
                    }
                });

            } else {
                Toast.toast("Please connect to the internet first"); //"Please connect to the internet first"
                callback(false, null);
            }
        } else {
            Toast.toast("Please connect to the internet first"); //Please connect to the internet first
            callback(false, null);
        }
    },
    
    parseLogin: function(myCloud, callback) {
        //console.log('Parsing Cloud Login');
        //console.log(myCloud);
        //console.log('Cloud ID: ' + myCloud.cloudIdLocal);
        //console.log('Cloud Data: ' + myCloud.cloudData);
        if (myCloud !== null) {
            switch (myCloud.cloudData) {
                case 'success':
                    app.saveSetting('cloudUsername' + Globals.cloudUserSpecific, myCloud.username);
                    app.saveSetting('cloudPassword' + Globals.cloudUserSpecific, myCloud.password);
                    $('#saveCloudLogin').text("Sign Out"); //"Sign Out"
    
                    Toast.toast("Cloud storage active!"); //"Cloud storage active!"
                    callback(true);
                    break;
                case 'fail':
                    Toast.toast("Incorrect username or password"); //"Incorrect username or password"
                    callback(false);
                    break;
                case undefined:
                    Toast.toast("Login error"); //"Incorrect username or password"
                    callback(false);
                    break;
            }    
        } else {
            callback(false);
        }
        
        
    },

    parsePush: function(myCloud, callback) {
        //console.log("cloudParsePush: " + myCloud.cloudData);
        switch (myCloud.cloudData) {
            case 'success':
                callback(true, myCloud);
                break;
            default:
                callback(false, myCloud);
                break;
        }

    },

    processBlob: function(myCloud, callback) {
        //console.log('cloudProcessBlob');
        var cloudIdLocal = myCloud.cloudId;
        //console.log("Cloud ID Local: " + cloudIdLocal);
        var empty = [];
        //find blob from local id
        app.store.findBlobById(cloudIdLocal, function(blob) {
            if (blob !== null) {
                //console.log("blob part found");
                var myBlob = blob.data;
                //console.log(myBlob);
                //split blob into chunks
                //var re = new RegExp("[\s\S]{1," + cloudBlobLength + "}", "g");
                //4096 = success
                //6144 = success
                //8192 = fail
                var parts = myBlob.match(/[\s\S]{1,4096}/g) || [];
                //console.log(parts[0].length);
                //console.log("Blob split to " + parts.length + "parts");
                callback(parts);
            } else {
                //console.log("No blob parts found");
                callback(empty);
            }
        });
    },

    clearLogin: function(callback) {
        app.saveSetting('cloudUsername' + Globals.cloudUserSpecific, '');
        app.saveSetting('cloudPassword' + Globals.cloudUserSpecific, '');
        if (callback) {
            callback();
        }
    },

    queueBlobPart: function(cloudData, cloudIdRemote, cloudPartId, cloudIdLocal, maxParts, callback) {
        app.store.saveCloudQueueBlob(cloudData, cloudIdRemote, cloudPartId, cloudIdLocal, maxParts, function() {
            callback();
        });
    },
    
    push: function(appId, username, password, callback) {
        //console.log('CloudPush');
        var a;
        var ddd;
        var lastCloudIdLocal;
        //console.log("lastCloudIdLocal username: " + cloudUsername);

        app.findNextCloud(Globals.mUsername, username, "push", function(c, pct) {
            //console.log("Found next cloud");
            if (c !== null) {
                //console.log("cloud not null");
                //console.log("PUSHING:");
                //console.log(c);
                var cloudURL;
                var cloudHasBlob;
                var sToast = "";
                //var l = clouds.length;
                //console.log('clouds found: ' + l);
                //for (var i = 0; i < l; i++) {
                //c = clouds[i];

                cloudHasBlob = c.cloudHasBlob;
                //function Cloud(cloudId, user, Globals.appId, cloudIdRemote, cloudIdLocal, cloudData, username, password, encoding, cloudDataId, cloudHasBlob, cloudIsBlob, dataPart, dataTotal)

                var myCloud = new Cloud(c.cloudId, Globals.mUsername, Globals.appId, c.cloudIdRemote, c.cloudId, escape(c.cloudData), username, password, 'encode', c.cloudDataId, c.cloudHasBlob, c.cloudIsBlob, c.dataPart, c.dataTotal);
                //console.log("Cloud Is Blob: " + c.cloudIsBlob);


                if (c.cloudIsBlob == -1 || c.cloudIsBlob == "-1") {


                    //ddd = getDots(iDots);

                    sToast = "Uploading Photo (" + pct + " pieces)";
                    //console.log(sToast);

                    //cloudURL = 'https://rebrandcloud.secure.omnis.com/cloud/pushBlobTest.asp';
                    cloudURL = 'https://rebrandCloud.secure.omnis.com/cloud/pushBlob.asp';
                } else {

                    //ddd = getDots(iDots);

                    sToast = "Uploading Data (" + pct + " pieces)";
                    //console.log(sToast);
                    
                    //cloudURL = 'https://rebrandcloud.secure.omnis.com/cloud/pushTest.asp';
                    cloudURL = 'https://rebrandcloud.secure.omnis.com/cloud/push.asp';
                }
                //console.log(cloudURL + "?" + serialize(myCloud));
                Internet.getURLSource(cloudURL, myCloud, false, function(data) {
                    if (data) {
                        //console.log(data);
                        var myCloud = new Cloud(data.cloudIdLocal, Globals.mUsername, Globals.appId, data.cloudIdRemote, data.cloudIdLocal, unescape(data.cloudData), username, password, 'decode', '', data.cloudHasBlob, 0, 1, 1);
                        //console.log(myCloud);
                        if (myCloud.cloudData == "success") {
                            if (c.cloudIsBlob == -1 || c.cloudIsBlob == "-1") {
                                CloudAll.deleteById(myCloud, function() {
                                    //console.log("deleted part " + myCloud.cloudId);
                                });
                            }

                            var dNow = getTimestamp();
                            if (dNow - CloudAll.lastMini > 1500) {
                                CloudAll.lastMini = dNow;
                                app.getSetting("chkCloudActivity", "true", function(setting) {
                                    if (setting === "true") {
                                        Toast.toastMini(sToast);
                                    }
                                });
                            }
                            callback(true, myCloud);
                        } else {
                            //console.log(myCloud);
                            callback(false, null);
                        }
                    } else {
                        callback(false, null);
                    }
                });
                
            } else {
                //console.log("C WAS NULL, Not pushing");
                callback(false, null);
            }
            //}
        });
    },
    
    start: function(bGet, bPush) {
        //console.log("CloudStart");
        clearTimeout(CloudAll.timeout);
        if (CloudAll.active === false) {
            CloudAll.active = true;
            CloudAll.resetTimeout = setTimeout(CloudAll.resetQueue, 10000);
            //console.log("------CLOUD START: Get=" + bGet + ", Push=" + bPush);
            if (bGet === true && bPush === true) {
                CloudAll.startGet(function(getSuccess) {
                    //console.log("CALLBACK FROM CLOUDSTARTGET: " + getSuccess);
                    CloudAll.startPush(function(pushSuccess) {
                        clearTimeout(CloudAll.resetTimeout);
                        //console.log("CALLBACK FROM CLOUDSTARTPUSH: " + pushSuccess);
                        CloudAll.active = false;
                        if (pushSuccess === true) {
                            //console.log('SET TIMEOUT1');
                            CloudAll.timeout = setTimeout(CloudAll.start(false, pushSuccess), 50);
                        }
                    });
                });
            } else if (bPush === true) {
                CloudAll.startPush(function(pushSuccess) {
                    clearTimeout(CloudAll.resetTimeout);
                    //console.log("CALLBACK FROM CLOUDSTARTPUSH2: " + pushSuccess);
                    CloudAll.active = false;
                    if (pushSuccess === true) {
                        //console.log('SET TIMEOUT2');
                        CloudAll.timeout = setTimeout(CloudAll.start(false, pushSuccess), 50);
                    }
                });
            }
        } else {
            //console.log("Cloud Already Active, Skipping");
        }
    },

    startPush: function(callback) {
        //console.log('cloudStartPush');
        var i;
        var l;
        var part;
        var cloudIdRemote = 0;
        var cloudIdLocal = 0;
        app.getSetting('cloudUsername' + Globals.cloudUserSpecific, '', function(setting) {
            //console.log(setting);
            CloudAll.username = setting;
            if (CloudAll.username !== '') {
                app.getSetting('cloudPassword' + Globals.cloudUserSpecific, '', function(setting) {
                    //console.log(setting);
                    CloudAll.password = setting;
                    if (CloudAll.password !== '') {
                        //console.log("pass not blank");
                        var online = Internet.isOnline();

                        if (online) {
                            //console.log("online");
                            if (Internet.hostReachable()) {
                                //console.log("reachable");
                                CloudAll.push(Globals.appId, CloudAll.username, CloudAll.password, function(success, myCloud) {
                                    //console.log("PUSH SUCCESS: " + success);
                                    if (success === true) {
                                        cloudIdRemote = myCloud.cloudIdRemote;
                                        cloudIdLocal = myCloud.cloudIdLocal;
                                        CloudAll.parsePush(myCloud, function(success) {
                                            if (success === true) {
                                                //console.log("Saving cloud history");
                                                CloudAll.saveHist(myCloud.cloudId, Globals.mUsername, CloudAll.username, "push", function() {
                                                     if (myCloud.cloudHasBlob == -1 || myCloud.cloudHasBlob == '-1') {
                                                         CloudAll.processBlob(myCloud, function(blobParts) {
// 
                                                             l = blobParts.length;
                                                             //console.log("blob parts: " + l);
                                                             for (i = 0; i < l; i++) {
                                                                 part = blobParts[i];
                                                                 //console.log(part);
                                                                 CloudAll.queueBlobPart(part, cloudIdRemote, i, cloudIdLocal, blobParts.length, function() {
                                                                     //console.log("Queued");
                                                                 });
                                                             }
                                                             if (l <= 0) {
                                                                 callback(false);
                                                             } else {
                                                                 callback(true);
                                                             }
                                                         });
                                                     } else {
                                                        //console.log("Saved History");
                                                        callback(true);
                                                     }
                                                });
                                            } else {
                                                //console.log("NOT saving cloud history");
                                                callback(false);
                                            }
                                        });
                                    } else {
                                        //console.log("NOT successful push");
                                        callback(false);
                                    }
                                });
                            } else {
                                //console.log("NOT host reachable");
                                callback(false);
                            }
                        } else {
                            //console.log("NOT online");
                            callback(false);
                        }
                    } else {
                        //console.log("NOT password");
                        callback(false);
                    }
                });
            } else {
                //console.log("NOT username");
                callback(false);
            }
        });
    },
    
    startGet: function(callback) {
        //console.log('cloudStartGet');
        var i;
        var l;
        var cloudBlob;
        app.getSetting('cloudUsername' + Globals.cloudUserSpecific, '', function(setting) {
            CloudAll.username = setting;
            if (CloudAll.username !== '') {
                app.getSetting('cloudPassword' + Globals.cloudUserSpecific, '', function(setting) {
                    CloudAll.password = setting;
                    if (CloudAll.password !== '') {
                        var online = Internet.isOnline();
                        if (online) {
                            if (Internet.hostReachable()) {
                                CloudAll.get(Globals.appId, CloudAll.username, CloudAll.password, function(cloudGetSuccess, myCloud, cloudNumber, cloudMax) {
                                    //This is being called multiple times and causing multiple callbacks
                                    //console.log("CloudGetCallback num: " + cloudNumber + " max: " + cloudMax);

                                    if (cloudGetSuccess === true) {
                                        CloudAll.findHist(myCloud.cloudIdRemote, Globals.mUsername, CloudAll.username, "get", function(hist) {
                                            if (hist === null) {
                                                CloudLocal.parseGet(myCloud, function(parseSuccess) {

                                                    CloudAll.saveHist(myCloud.cloudIdRemote, Globals.mUsername, CloudAll.username, "get", function() {
                                                        //console.log(myCloud);
                                                        if (parseSuccess === true) {
                                                             if (myCloud.cloudHasBlob == "-1") {
                                                                 //console.log("BLOB");
                                                                 CloudAll.getBlob(myCloud, function(success, blobs) {
                                                                     if (success === true) {
                                                                         l = blobs.length;
                                                                         for (i = 0; i < l; i++) {
                                                                             cloudBlob = blobs[i];
                                                                             CloudLocal.parseGet(cloudBlob, function(afterParseSuccess, afterParse) {
                                                                                 if (afterParseSuccess === true) {
// 
                                                                                     if (i === l - 1) {
                                                                                         //console.log("if " + cloudNumber + " >= " + cloudMax);
                                                                                         if (cloudNumber >= cloudMax) {
                                                                                             callback(cloudGetSuccess);
                                                                                         }
                                                                                     }
// 
                                                                                 } else {
                                                                                     //console.log("Blob parse failed");
                                                                                     if (i === l - 1) {
                                                                                         //console.log("if " + cloudNumber + " >= " + cloudMax);
                                                                                         if (cloudNumber >= cloudMax) {
                                                                                             callback(cloudGetSuccess);
                                                                                         }
                                                                                     }
                                                                                 }
                                                                             });
                                                                         }
                                                                         if (l <= 0) {
                                                                             //console.log("if " + cloudNumber + " >= " + cloudMax);
                                                                             if (cloudNumber >= cloudMax) {
                                                                                 callback(cloudGetSuccess);
                                                                             }
                                                                         }
                                                                     } else {
                                                                         //console.log("blob success was false");
                                                                         //console.log("if " + cloudNumber + " >= " + cloudMax);
                                                                         if (cloudNumber >= cloudMax) {
                                                                             callback(cloudGetSuccess);
                                                                         }
                                                                     }
                                                                 });
                                                             } else {
                                                                //console.log("no blob so finished");
                                                                //console.log("if " + cloudNumber + " >= " + cloudMax);
                                                                if (cloudNumber >= cloudMax) {
                                                                    callback(cloudGetSuccess);
                                                                }
                                                            }
                                                        } else {
                                                            //console.log("parse success failed");
                                                            //console.log("if " + cloudNumber + " >= " + cloudMax);
                                                            if (cloudNumber >= cloudMax) {
                                                                callback(cloudGetSuccess);
                                                            }
                                                        }
                                                    });
                                                });
                                            } else {
                                                //console.log("Already Processed this cloud");
                                                //console.log("if " + cloudNumber + " >= " + cloudMax);
                                                if (cloudNumber >= cloudMax) {
                                                    callback(false);
                                                }
                                            }
                                        });
                                    } else {
                                        //console.log("CloudGetSuccess = false");
                                        //console.log("if " + cloudNumber + " >= " + cloudMax);
                                        if (cloudNumber >= cloudMax) {
                                            callback(false);
                                        }
                                    }
                                });
                            } else {
                                //console.log("get NOT HOSTONLINE");
                                callback(false);
                            }
                        } else {
                            //console.log("get NOT ONLINE");
                            callback(false);
                        }
                    } else {
                        //console.log("get NOT PASSWORD");
                        callback(false);
                    }
                });
            } else {
                //console.log("Get NOT USERNAME");
                callback(false);
            }
        });
    },
    
    ready: function(callback) {
        //console.log('CloudReady?');
        //console.log(this);
        //console.log(this.store);
        if (app.store !== undefined) {
            //console.log("store is ready");
            if (CloudAll.isReady === false) {
                CloudAll.pushClient = getTimestamp();
                //console.log('PUSH CLIENT: ' + CloudAll.pushClient);
                CloudAll.isReady = true;
                //console.log("Cloud is ready");
            }
            CloudAll.timeout = setTimeout(CloudAll.start(true, true), 50);
            callback();
        }
    },
    
    resetQueue: function(callback) {
        //console.log("Resetting Cloud Active State to False");
        clearTimeout(CloudAll.timeout);
        clearTimeout(CloudAll.resetTimeout);
        CloudAll.active = false;
        CloudAll.timeout = setTimeout(CloudAll.start(true, true), 50);
    },
    
    saveHist: function(cloudIdLocalOrRemote, username, cloudUsername, histType, callback) {
        app.store.saveCloudHist(cloudIdLocalOrRemote, username, cloudUsername, histType, function() {
            callback();
        });
    },
    
    deleteById: function(myCloud, callback) {
        //console.log("cloudDeleteById");
        app.store.deleteCloudById(myCloud, function() {
            callback();
        });
    },
    
    findHist: function(cloudIdLocalOrRemote, username, cloudUsername, histType, callback) {
        //console.log("cloudFindHist");
        app.store.findCloudHist(cloudIdLocalOrRemote, username, cloudUsername, histType, function(hist) {
            callback(hist);
        });
    },

    findHistNoCallback: function(cloudIdLocalOrRemote, username, cloudUsername, histType) {
        //console.log("cloudFindHist");
        var hist = app.store.findCloudHist(cloudIdLocalOrRemote, username, cloudUsername, histType);
        return hist;
    },
    
    initialize: function(callback) {
        //console.log("[Cloud] Initialized");
        this.active = false;
        this.timeout = null;
        this.resetTimeout = null;
        this.lastMini = 0;
        this.isReady=false;
        this.username = "";
        this.password = "";
        this.pushClient = 0;
        
    }
};

CloudAll.initialize();