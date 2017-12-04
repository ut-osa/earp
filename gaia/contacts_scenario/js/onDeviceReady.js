// Call onDeviceReady when PhoneGap is loa ded.
          //
          // At this point, the document has loaded but phonegap-1.0.0.js has not.
          // When PhoneGap is loaded and talking with the native device,
          // it will call the event `deviceready`.
          // 
          Device.initialize(function(success) {
             if (Device.platform === "Browser") {
                 onDeviceReady();
             } else {
                 document.addEventListener("deviceready", onDeviceReady, false);
                // PhoneGap is loaded and it is now safe to make calls PhoneGap methods    
             }
          });
    
          function onDeviceReady() {
            //console.log("[Device Ready]");
            
            if (Device.platform == "Android") {
              document.addEventListener("backbutton", backKeyDown, true);
              document.addEventListener("menubutton", menuKeyDown, false);
            }
            
            //console.log($(window).width());
            if ($(window).width() >= 380) {
                Globals.bMiniDefault = "big";
            } else {
                Globals.bMiniDefault = "small";
            }
            
            //alertDebug("convert old stuff");
            //console.log("[Convert Old Stuff]");
            app.checkConvertOldDb(function(success) {
                //alertDebug("converted old db: " + success);
                //console.log("[Convert Old DB] " + success);
                app.checkConvertOldPhotos(function(success) {
                    //alertDebug("convertedOldPhotos: " + success);
                    //console.log("[Convert Old DB Photos] " + success);
                }); 
            });
            
            
            if (Device.platform === "WinPhone") {
              //make all footers fixed
              app.removeAllFixedFooters();
              $('#clickToShare').hide();
              //$('#addPlayerContact').hide(); //WinPhone Contacts doesn't work properly SG v 1.4.5
            }
            
            if (Device.platform === "WinPhone" || Device.platform == "Browser") {
              $('#clickToShare').hide();
            }
            
            CloudAll.ready(function(success) {
                
            });
          }
          
          function backKeyDown() {
            //navigator.app.exitApp(); // To exit the app!
            if (app.backButtonLocked === false) {
              parent.history.back();
              return false;
            }
            else {
              Toast.toastMini("The back button is currently disabled to avoid accidental data loss");
            }
          }
          
          function menuKeyDown() {
            //navigator.app.exitApp(); // To exit the app!
            if (app.menuButtonLocked === false) {
              changePage("#edit");
            }
            else {
              Toast.toastMini("The menu button is currently disabled to avoid accidental data loss");
            }
            
          }