//main
/*jshint -W083 */
var app = {

    removeAllFixedFooters: function() {
        //console.log("unfixed all footers");
        $('[id^="FixedFooter"]').removeAttr('data-position');
    },

    updateEditGameImage: function(src, callback) {
        if (src !== "") {
            var $img = $('#imgGameImage');
            //console.log("load image");
            $img.attr('src', src).load();
            $img.nailthumb({
                width: 80,
                height: 80
            });
            $img.show();
        }
        callback();
    },

    loadEditGame: function(callback) {
        if (app.currEditGame !== null) {
            //console.log("load edit game");
            var myGame = app.currEditGame;
            var $elSelect = $('#selectNewGameScoring');
            var $elAdvancedField = $('#advancedTextField');
            var $elAdvanced = $('#advancedText');
            var $elRounds = $('#flip-rounds');
            var $elScore = $('#flip-score');
            var src;
            //console.log(myGame);
            myGame.name = myGame.name.replace(/&#39;/g, "'");
            myGame.advancedText = myGame.advancedText.replace(/&#39;/g, "'");
            $('#textNewGameName').val(myGame.name); //works
            $('#textBGGID').val(myGame.bggId);
            $elSelect.val(myGame.scoreType);
            //console.log("select menu val set: " + app.currGames[i].scoreType);
            $elSelect.selectmenu('refresh');
            if (myGame.scoreType == 'advanced') {
                $elAdvancedField.show();
                $elAdvanced.val(myGame.advancedText); //set to saved text somehow
            } else {
                $elAdvancedField.hide();
                $elAdvanced.val(''); //set to saved text somehow
            }

            var lower = myGame.advancedText;
            lower = lower.toLowerCase();
            //console.log("lower: " + lower);
            if (lower.indexOf('pickrounds=true;') >= 0 || app.pickRoundsWasOn === true) {
                $elRounds.val('on');
            } else {
                $elRounds.val('off');
            }
            $elRounds.flipswitch();
            $elRounds.flipswitch('refresh');
            
            if (lower.indexOf('lowpointswin=true;') >= 0 || app.pickScoreWasOn === true) {
                $elScore.val('low');
            } else {
                $elScore.val('high');
            }
            $elScore.flipswitch();
            $elScore.flipswitch('refresh');
            //console.log("myGame.icon");
            //console.log(myGame.icon);

            if (myGame.iconURL === "BLOB" || myGame.iconURL === "") {
                src = myGame.icon;
            } else {
                src = myGame.iconURL;
            }
            app.updateEditGameImage(src, function() {
                callback();
            });
        }

    },

    saveEditGame: function(bRequireName, callback) {
        //do some stuff
        var myGame = null;
        var gameId = "";
        var gameRounds;
        var lowPointsWin;
        if ($('#flip-rounds').val() === "on") {
            gameRounds = true;
        } else {
            gameRounds = false;
        }
        app.pickRoundsWasOn = gameRounds;
        
        if ($('#flip-score').val() === "low") {
            lowPointsWin = true;
        } else {
            lowPointsWin = false;
        }
        app.pickScoreWasOn = lowPointsWin;
        
        var gameName = $("#textNewGameName").val();
        var gameBGGID = $('#textBGGID').val();
        var gameIcon = $("#imgGameImage").attr("src");
        var gameScoreType = $("#selectNewGameScoring option:selected").val();
        var gameAdvanced = $("#advancedText").val();
        
        if (bRequireName === true && gameName.trim() === "") {
            Toast.toast("Please enter a game name first");
            callback(null);
        } else {
            switch (gameScoreType) {
                case "points":
                    gameAdvanced = "Name=Points|Type=Counter|Value=1|Default=0;";
                    break;
                case "tally":
                    gameAdvanced = "Name=Points|Type=Tally|Value=1|Default=0;";
                    break;
                case "hiddentally":
                    gameAdvanced = "Name=Points|Type=HiddenTally|Value=1|Default=0;";
                    break;
                case "winLose":
                    gameAdvanced = "Name=Win/Lose|Type=Toggle;";
                    break;
                case "areasControlled":
                    gameAdvanced = "Name=Areas Controlled|Type=Counter|Value=1|Default=0;";
                    break;
            }
            
            if (lowPointsWin === true) {
                gameAdvanced += "LowPointsWin=True;";
            }
            
            if (gameRounds === true) {
                gameAdvanced += "PickRounds=True;";
            }

            app.sanitizeGame(gameName, function(sanitized) {
                if (app.gameEditMode === true) {
                    gameId = app.currGame.id;
                } else {
                    gameId = sanitized;
                }
    
                if (isNumber(gameBGGID) === false) {
                    gameBGGID = "";
                }
    
                myGame = new Game(gameId, gameBGGID, gameName, gameIcon, gameScoreType, gameAdvanced);
                //console.log(myGame);
                callback(myGame);
            });
        }
        
        
    },
    
    
    
    toolDialogBuzzer: function() {
        //console.log("BUZZER DIALOG");
        var header = "Buzzer";
        var myAudio = "audio/buzzer.mp3";
        
        $('<div>').simpledialog2({
            mode: 'blank',
            headerText: header,
            headerClose: true,
            callbackOpen: function() {
                //console.log("open");
                playAudio(myAudio, true);
            },
            top: 25,
            blankContent: '<div class="ui-simpledialog-withpadding" style="padding-left: 40px;">' +
                '<img src="img/ui/buzzer.png" alt="" id="imgBuzzer" >' +
                '</div>'
        });
        
        // $('#frmGameSearch').on('submit', function(e) {
           // e.preventDefault();
           // return app.searchSubmit();
        // });
// //         
        // $('#frmOnlineGameSearch').on('submit', function(e) {
           // e.preventDefault();
           // return app.searchSubmit2();
        // });
    
        $('#imgBuzzer').on('click', function() {
            
            //if (Device.platform === "Browser") {
                //playAudio(myAudio, false);
                //console.log("[BUZZ1]");
                //Toast.toast("Buzz! Audio is only available on mobile devices");
            //} else {
                //console.log("[BUZZ2]");
                playAudio(myAudio, false);
            //}

        });
    },
    
    toolDialogTimer: function() {
        //console.log("TIMER DIALOG");
        var header = "Stopwatch";
        
        $('<div>').simpledialog2({
            callbackClose: function() {
                //console.log("killTimer");
                $('#myTimer').TimeCircles().stop();
                $('#myTimer').TimeCircles().destroy();
            },
            mode: 'blank',
            headerText: header,
            headerClose: true,
            top: 25,
            blankContent: '<div class="ui-simpledialog-withpadding" style="padding-left: 15px;">' +
                '<div id="myTimer" data-timer="0">' +
                '</div>' +
                '<a data-role="button" data-theme="d" data-icon="check" id="btnStartTimer" data-mini="true">Start</a>' +
                '<a data-role="button" data-theme="e" data-icon="delete" id="btnStopTimer" data-mini="true">Stop</a>' +
                '<a data-role="button" data-theme="b" data-icon="arrow-r" id="btnResetTimer" data-mini="true">Reset</a>' +
                '</div>'
        });
        
        
        
        $('#myTimer').TimeCircles({
            start: false, 
            time: {
                Days: { show: false },
                Hours: { show: false },
                Minutes: { show: true },
                Seconds: { show: true }
            }
        });
        
        $('#btnStartTimer').on('click', function() {
            //console.log("start");
           
            $('#myTimer').TimeCircles().start();
        });
        
        $('#btnStopTimer').on('click', function() {
            //console.log("stop");
            $('#myTimer').TimeCircles().stop();
        });
        
        $('#btnResetTimer').on('click', function() {
            $("#myTimer").data('timer', 0).TimeCircles().restart();
        });
    },
    
    toolDialogCountdown: function() {
        //console.log("COUNTDOWN DIALOG");
        var header = "Timer";
        var init = false;
        var myAudio = 'audio/ding.mp3';
        var first=true;
        
        
        function timesUp() {
            // if (Device.platform === "Browser") {
                    // Toast.toast("Time's Up!");
                // } else {
                    playAudio(myAudio, false);
                //}
        }
        
        function listener(unit, value, total) {
            //console.log(unit + " " + value + " " + total);
            if (total === 0 && first === false) {
                setTimeout(timesUp, 1000);
            }
            first = false;
        }
        
        
        function initCountdown() {
            //console.log("InitCountdown");
            var days=0;
            var hours=0;
            var minutes=0;
            var seconds=0;
            var totalSeconds=0;
            var a;
            var b;
            var myText;
            var audio = "audio/ding.mp3";
            myText = $('#myTimerbox').val();
            //console.log(myText);
            a = myText.split(" ");
            if (a.length === 3) {
                days = parseInt(a[0], 10);
                b = a[2].split(":");
                if (b.length === 3) {
                    hours = parseInt(b[0], 10);
                    minutes = parseInt(b[1], 10);
                    seconds = parseInt(b[2], 10);
                }
                
            }
            
            totalSeconds = (days * 86400) + (hours * 3600) + (minutes * 60) + seconds;
            //console.log("days: " + days);
            //console.log("hours: " + hours);
            //console.log("minutes: " + minutes);
            //console.log("seconds: " + seconds);
            //console.log("totalSeconds: " + totalSeconds);
            
            
            
            
            
            if(totalSeconds <= 59) {
                //console.log("SECONDS");
                $("#myCountdown").data('timer', totalSeconds).TimeCircles({ time: { Minutes: { show: false }, Hours: { show: false }, Days: { show: false } }}).rebuild().restart();
            }
            else if(totalSeconds <= 3599) {
                //console.log("MINUTES");
                $("#myCountdown").data('timer', totalSeconds).TimeCircles({ time: { Minutes: { show: true }, Hours: { show: false }, Days: { show: false } }}).rebuild().restart();
             }
            else if(totalSeconds <= 86399) {
                //console.log("HOURS");
                $("#myCountdown").data('timer', totalSeconds).TimeCircles({ time: { Minutes: { show: true }, Hours: { show: true }, Days: { show: false } }}).rebuild().restart();
            } else {
                //console.log("DAYS");
                $("#myCountdown").data('timer', totalSeconds).TimeCircles({ time: { Minutes: { show: true }, Hours: { show: true }, Days: { show: true } }}).rebuild().restart();
            }
            init = true;
        }
        
        $('<div>').simpledialog2({
            mode: 'blank',
            callbackClose: function() {
                //console.log("unload");
                $('#myCountdown').TimeCircles().stop();
                $('#myCountdown').TimeCircles().destroy();
                //unloadAudio(audio);   
            },
            callbackOpen: function() {
                //console.log("open");
                playAudio(myAudio, true);
            },
            headerText: header,
            headerClose: true,
            top: 25,
            blankContent: '<div class="ui-simpledialog-withpadding" style="padding-left: 15px;">' +
                '<input name="myTimerbox" id="myTimerbox" type="text" data-role="datebox" data-options={"mode":"durationbox","useNewStyle":true} />' +
                '<div id="myCountdown" data-timer="0">' +
                '</div>' +
                '<a data-role="button" data-theme="d" data-icon="check" id="btnStartCountdown" data-mini="true">Start</a>' +
                '<a data-role="button" data-theme="e" data-icon="delete" id="btnStopCountdown" data-mini="true">Stop</a>' +
                '<a data-role="button" data-theme="b" data-icon="arrow-r" id="btnRestartCountdown" data-mini="true">Resume</a>' +
                '</div>'
        });
        
        $('#myCountdown').TimeCircles({
            start: false, 
            count_past_zero: false,
            time: {
                Days: { show: false },
                Hours: { show: false },
                Minutes: { show: true },
                Seconds: { show: true }
            }
        });
    
        $('#btnStartCountdown').on('click', function() {
            //console.log("start");
            if (init === false) {
                $('#myCountdown').TimeCircles().addListener(listener);
            }
                initCountdown();
            
        });
        
        $('#btnStopCountdown').on('click', function() {
            //console.log("stop");
            $('#myCountdown').TimeCircles().stop();
        });
        
        $('#btnRestartCountdown').on('click', function() {
            $('#myCountdown').TimeCircles().start();
        });
    },
    
    toolDialogNotes: function() {
        //console.log("NOTES DIALOG");
        var header = "Notes";
        $('<div>').simpledialog2({
            mode: 'blank',
            headerText: header,
            headerClose: true,
            top: 25,
            blankContent: '<div class="ui-simpledialog-withpadding" >' +
                '<textarea name="textAreaNotes2" id="textAreaNotes2">' + app.lastNotes + '</textarea>' +
                '<a data-role="button" data-theme="d" data-icon="check" id="btnSaveNotes">Save</a>' +
                '</div>'
        });
    
    
    
        $('#btnSaveNotes').on('click', function() {
            
            app.lastNotes = $('#textAreaNotes2').val();
            //console.log("Saved " + app.lastNotes);
            $(document).trigger('simpledialog', {
                'method': 'close'
            });
        });
    },

    convertOldDbCloudQueue: function(oldStore, callback) {
        var i;
        var l;
        var s;
        var c;
        var highestId = 0;
        var that = this;
        //Need old cloud Username.
        //console.log("app.oldCloudUsername: " + app.oldCloudUsername);
        app.oldGetCloudQueue(oldStore, function(cloudQueue) {
            app.oldGetCloudBlob(oldStore, function(cloudBlob) {
                app.oldGetCloudHist(oldStore, function(cloudHist) {
                    //CLOUDQUEUE
                    if (cloudQueue) {
                        l = cloudQueue.length;
                        for (i = 0; i < l; i++) {

                            c = cloudQueue[i];
                            if (Globals.cloudAllowSessionPhotos === false) {
                                if (c.cloudData.indexOf("AddSession|") > -1) {
                                    c.cloudData = c.cloudData.replace("|BLOB|", "||");
                                }
                            }

                            that.store.addCloud(c, function() {

                            });

                            if (c.cloudId > highestId) {
                                highestId = c.cloudId;
                            }

                            if (app.oldCloudUsername !== "") {
                                that.store.cloudSaveHist(cloudQueue[i].cloudId, Globals.mUsername, app.oldCloudUsername, "push", function() {

                                });
                            }
                        }
                        highestId += 100;
                        that.store.addCloudAutoInc(highestId);
                    }
                    //CLOUDBLOB
                    if (cloudBlob) {
                        l = cloudBlob.length;
                        for (i = 0; i < l; i++) {
                            //console.log("Adding blob");
                            //console.log(cloudBlob[i]);
                            that.store.addCloudBlob(cloudBlob[i], function() {

                            });
                        }
                    }
                    //CLOUDHIST
                    if (cloudHist) {
                        l = cloudHist.length;
                        for (i = 0; i < l; i++) {
                            //console.log(cloudHist[i]);
                            that.store.cloudSaveHist(cloudHist[i].cloudId, Globals.mUsername, app.oldCloudUsername, "get", function() {

                            });
                        }
                        s = "Imported " + cloudQueue.length + " clouds, " + cloudBlob.length + " blobs, " + cloudHist.length + " hist";
                    }
                    //Toast.toastMini(s);
                    callback();
                });
            });
        });
    },

    convertOldDbNoCloud: function(oldStore, callback) {
        var that = this;
        var allGameIds = [];
        var games = [];
        var i;
        var l;
        var j;
        var m;
        var g;
        var s;
        var advanced = "";
        var mySetting;
        app.oldGetFavorites(function(favorites) {
            //console.log("a");

            app.oldGetPlayers(oldStore, function(players) {
                //console.log("b");
                app.oldGetSettings(oldStore, function(settings) {
                    //console.log("c");
                    app.oldGetSessions(oldStore, function(sessions, gameIds) {
                        //console.log("d");
                        if (gameIds) {
                            l = gameIds.length;
                            for (i = 0; i < l; i++) {
                                if (allGameIds.indexOf(gameIds[i]) === -1) {
                                    allGameIds.push(gameIds[i]);
                                }
                            }
                        }
                        app.oldGetAwardsEarned(oldStore, function(awardsEarned, gameIds) {
                            //console.log("e");
                            if (gameIds) {
                                l = gameIds.length;
                                for (i = 0; i < l; i++) {
                                    if (allGameIds.indexOf(gameIds[i]) === -1) {
                                        allGameIds.push(gameIds[i]);
                                    }
                                }
                            }
                            app.oldGetScores(oldStore, function(scores) {
                                //console.log("f");
                                app.oldGetGamesCustom(oldStore, favorites, function(customGames) {
                                    //console.log("g");
                                    //console.log("Custom games");
                                    //console.log(customGames);
                                    app.oldGetCustomScoreItems(oldStore, function(customScoreItems) {
                                        //console.log("h");
                                        //assign all scoreitems to custom games
                                        if (customGames) {
                                            l = customGames.length;
                                            var bPickRounds = false;
                                            for (i = 0; i < l; i++) {
                                                //console.log(advanced);
                                                if (advanced.indexOf("PickRounds=True;") >= 0) {
                                                    bPickRounds = true;
                                                } else {
                                                    bPickRounds = false;
                                                }
                                                //console.log("bPickRounds: " + bPickRounds);
                                                advanced = "";

                                                g = customGames[i];
                                                //console.log(g);
                                                m = customScoreItems.length;
                                                for (j = 0; j < m; j++) {
                                                    s = customScoreItems[j];
                                                    if (g.id === s.gameId) {
                                                        advanced += s.scoreItem + ";";
                                                    }
                                                }

                                                if (bPickRounds === true) {
                                                    advanced += "PickRounds=True;";
                                                }

                                                customGames[i].advancedText = advanced;

                                                m = allGameIds.length;
                                                for (j = 0; j < m; j++) {
                                                    if (allGameIds[j] == g.id) {
                                                        allGameIds.splice(j, 1);
                                                        break;
                                                    }
                                                }
                                            }
                                        }

                                        that.store.findAllOldGames(function(oldGames) {
                                            //console.log("i");
                                            //console.log("OldGames:");
                                            //console.log(oldGames);
                                            //console.log("AllGameIds:");
                                            //console.log(allGameIds);
                                            if (oldGames) {
                                                l = allGameIds.length;
                                                for (i = 0; i < l; i++) {
                                                    m = oldGames.length;
                                                    for (j = 0; j < m; j++) {
                                                        if (oldGames[j].id == allGameIds[i]) {
                                                            games.push(oldGames[j]);
                                                        }
                                                    }
                                                }
                                            }
                                            //SAVE EVERYTHING TO LOCAL STORAGE

                                            //CUSTOM GAMES
                                            if (customGames) {
                                                l = customGames.length;
                                                for (i = 0; i < l; i++) {
                                                    //console.log("Add custom game from import db");
                                                    //console.log(customGames[i].name);
                                                    that.store.addGame(customGames[i], function() {

                                                    });
                                                }
                                            }
                                            //GAMES
                                            if (games) {
                                                l = games.length;
                                                for (i = 0; i < l; i++) {
                                                    //console.log("Add game from import db");
                                                    //console.log(games[i].name);
                                                    that.store.addGame(games[i], function() {

                                                    });
                                                }
                                            }
                                            //PLAYERS
                                            if (players) {
                                                l = players.length;
                                                for (i = 0; i < l; i++) {
                                                    that.store.addPlayer(players[i], function() {

                                                    });
                                                }
                                            }
                                            //SETTINGS
                                            if (settings) {
                                                l = settings.length;
                                                for (i = 0; i < l; i++) {
                                                    //console.log(settings[i]);
                                                    mySetting = new Setting(settings[i].settingName, settings[i].settingValue);
                                                    if (mySetting.settingName == "cloudUsername") {
                                                        app.oldCloudUsername = mySetting.settingValue;
                                                        //console.log("Found old cloud username: " + app.oldCloudUsername);
                                                    }
                                                    that.store.addSetting(mySetting, function() {

                                                    });
                                                }
                                            }
                                            //SESSIONS
                                            if (sessions) {
                                                l = sessions.length;
                                                for (i = 0; i < l; i++) {
                                                    that.store.addSession(sessions[i], function() {

                                                    });
                                                }
                                            }
                                            //SCORES
                                            if (scores) {
                                                l = scores.length;
                                                for (i = 0; i < l; i++) {
                                                    that.store.addScore(scores[i], function() {

                                                    });
                                                }
                                            }
                                            //AWARDSEARNED
                                            if (awardsEarned) {
                                                l = awardsEarned.length;
                                                for (i = 0; i < l; i++) {
                                                    that.store.addAwardEarned(awardsEarned[i], function() {

                                                    });
                                                }
                                            }


                                            //console.log("Converted DB");
                                            app.saveSetting("convertedDb", true, function() {
                                                if (players) {
                                                    if (players.length > 0) {
                                                        s = "Thanks for upgrading!\n\nImported " + players.length + " players, " + (games.length + customGames.length) + " games, " + sessions.length + " sessions, " + scores.length + " scores, " + awardsEarned.length + " awards and " + settings.length + " settings";
                                                        Toast.toastMiniLong(s);
                                                    }
                                                }
                                                $.mobile.loading('hide');
                                                callback(true);
                                            });
                                        });
                                    });
                                });

                            });
                        });
                    });
                });
            });


        });

    },
    oldGetFavorites: function(callback) {
        //console.log("OLD Get Favorites");
        app.getSetting("oldFavList", "", function(fav) {
            if (fav !== "") {
                app.oldFavorites = fav.split(",");
                for (var i = 0; i < app.oldFavorites.length; i++) {
                    app.oldFavorites[i] = app.sanitizeGame(app.oldFavorites[i]);
                }
            } else {
                app.oldFavorites = [];
            }
            callback(true);
        });
    },

    oldGetCustomScoreItems: function(oldStore, callback) {
        //console.log("OLD get custom score items");
        var i;
        var l;
        var customScoreItems = [];
        var customScoreItem;
        var o;
        oldStore.findAllCustomScoreItems(function(oldCustomScoreItems) {
            l = oldCustomScoreItems.length;
            for (i = 0; i < l; i++) {
                o = oldCustomScoreItems[i];
                customScoreItem = new OldScoreItem(o.item_id, app.sanitizeGame(o.game_id), o.sort, o.scoreitem);
                customScoreItems.push(customScoreItem);
                if (i == l - 1) {
                    callback(customScoreItems);
                }
            }
            if (l <= 0) {
                callback(Globals.empty);
            }
        });
    },

    processContact: function(contact, callback) {
        if (contact !== null) {

            var $elName = $('#textNewPlayerName');
            var $elId = $('#textNewPlayerId');
            var $elPhoto = $('#imgPlayerImage');
            var $elTwitter = $('#textNewPlayerTwitter');
            var name = "";
            var nameId = "";
            var urls;
            var twitter = "";
            var s;
            var a;
            var photo;
            var photob64 = "";
            var imageURI = '';
            if (contact.nickname !== "" && contact.nickname !== null) {
                name = contact.nickname.sanitize;
            } else {
                name = contact.name.givenName.sanitize();
            }
            nameId = contact.name.givenName + contact.name.familyName;
            nameId = nameId.sanitize();
            $elName.val(name);
            if (app.playerEditMode === false) {
                $elId.val(nameId);                
            }


            urls = contact.urls;
            //console.log("Urls Length: " + urls.length);
            if (urls !== null) {


                for (var i = 0; i < urls.length; i++) {
                    s = urls[i].value;
                    s = s.toLowerCase();
                    if (s.indexOf("twitter.com/") !== -1) {
                        //console.log(s);
                        s = s.replace("http://", "");
                        //console.log(s);
                        s = s.replace("https://", "");
                        //console.log(s);
                        a = s.split("/");
                        //console.log(a);
                        twitter = a[1];
                        //console.log("Twiter:" + twitter);
                    }
                }
            }
            if (twitter !== "") {
                $elTwitter.val(twitter);
            }

            //console.log("photos length: " + contact.photos.length);
            if (contact.photos !== null) {
                if (contact.photos.length > 0) {
                    app.playerPhotoChanged = true;
                    photo = contact.photos[0];
                    //console.log("photo");
                    //console.log(photo);
                    if (photo.type == "url") {
                        imageURI = "file://" + photo.value;
                        var gotFileEntry = function(fileEntry) {
                            //console.log("got image file entry: " +  fileEntry.fullPath); 
                            fileEntry.file(function(file) {
                                var reader = new FileReader();
                                reader.onloadend = function(evt) {
                                    //console.log("Read complete!");
                                    //console.log(evt);
                                    //image64.value = Base64.encode(evt.target.result);
                                    photob64 = evt.target.result;
                                    //console.log("photob64");
                                    //console.log(photob64);
                                    $elPhoto.attr('src', photob64).load();
                                    $elPhoto.nailthumb({
                                        width: 80,
                                        height: 80
                                    });
                                };
                                //reader.readAsText(file);
                                reader.readAsDataURL(file);
                            }, function() {
                                //console.log("fail file");
                            });
                        };

                        //console.log("resolving " + imageURI);

                        window.resolveLocalFileSystemURL(imageURI, gotFileEntry, function() {
                            //console.log("resolve failed");
                        });
                    } else {
                        photob64 = photo.value;
                        $elPhoto.attr('src', photob64).load();
                        $elPhoto.nailthumb({
                            width: 80,
                            height: 80
                        });
                    }
                }
            }

        }
    },

    convertOldIds: function(oldId, newId, callback) {
        //console.log("Convert OLD IDs " + oldId + " > " + newId);
        //get all games and convert
        //get all sessions and convert
        //get all awards
        //get all factions
        var that = this;
        var i, l;
        var j, m;
        var k, n;
        var p, q;
        var ga;
        var se;
        var sc;
        var aw;
        var fa;

        // that.store.findAllGames(true, function(games) {
        // l = games.length;
        // for (i=0;i<l;i++) {
        // ga = games[i];
        // if (ga.id == oldId) {
        // that.store.deleteGameById(oldId, function() {
        // //console.log("Deleted " + oldId);
        // });
        // ga.id = newId;
        // that.store.addGame(ga, function() {
        // //console.log("Added");
        // //console.log(ga);
        // });
        // }
        // }
        // });
        //       
        // that.store.findAllSessions(function(sessions) {
        // m = sessions.length;
        // for (j=0;j<m;j++) {
        // se = sessions[j];
        // if (se.gameId == oldId) {
        // se.gameId = newId;
        // that.store.addSession(se, function() {
        // //console.log("edited session");
        // //console.log(se);
        // });
        // }
        // }
        // });
        //       
        // that.store.findAllAwardsEarned(function(awards) {
        // n = awards.length;
        // for (k=0;k<n;k++) {
        // aw = awards[k];
        // if (aw.gameId == oldId) {
        // aw.gameId = newId;
        // that.store.addAwardEarned(aw, function() {
        // //console.log("Edited award");
        // //console.log(aw);
        // });
        // }
        // }
        // });
        //       
        // that.store.findAllFactions(function(factions) {
        // q = factions.length;
        // for (p=0;p<q;p++) {
        // fa = factions[p];
        // if (fa.gameId == oldId) {
        // fa.id = fa.name + newId;
        // fa.gameId = newId;
        // that.store.addFaction(fa, function() {
        // //console.log("Edited Faction");
        // //console.log(fa);
        // });
        // }
        // }
        // });

        if (callback !== undefined) {
            callback(true);
        }
    },

    oldGetScoreItems: function(oldStore, callback) {
        //console.log("OLD get score items");
        var i;
        var l;
        var scoreItems = [];
        var scoreItem;
        var o;
        oldStore.findAllScoreItems(function(oldScoreItems) {
            l = oldScoreItems.length;
            for (i = 0; i < l; i++) {
                o = oldScoreItems[i];
                scoreItem = new OldScoreItem(o.item_id, app.sanitizeGame(o.game_id), o.sort, o.scoreitem);
                scoreItems.push(scoreItem);
                if (i == l - 1) {
                    callback(scoreItems);
                }
            }
            if (l <= 0) {
                callback(Globals.empty);
            }
        });
    },

    addScoreTally: function(id, value) {
        //console.log("Adding Tally");
        var i;
        var o;

        var found = false;
        var myTallyHistory = null;
        var l = app.currGameDetails.tallyHistory.length;
        for (i = 0; i < l; i++) {
            o = app.currGameDetails.tallyHistory[i];
            if (o.id == id) {
                //console.log("Adding to existing");
                found = true;
                o.history.push(value);
            }
        }
        if (found === false) {
            //console.log("Creating new");
            myTallyHistory = new TallyHistory(id);
            myTallyHistory.history.push(value);
            app.currGameDetails.tallyHistory.push(myTallyHistory);
        }
    },

    oldGetGamesCustom: function(oldStore, oldFavories, callback) {
        //console.log("OLD Get Games Custom");
        var i;
        var l;
        var customGames = [];
        var customGame;
        var o;
        var bHidden = false;
        var scoreType = "";
        var advanced = "";
        var pickRounds = "";
        var game_id;
        oldStore.findAllCustomGames(function(oldCustomGames) {
            //console.log("customgames");
            //console.log(customgames);
            l = oldCustomGames.length;
            //console.log("Custom games length: " + l2);
            for (i = 0; i < l; i++) {

                o = oldCustomGames[i];
                //scoreType = o.game_scoreType;
                //console.log(o);
                pickRounds = o.game_pickRounds;
                //console.log("Pickrounds: " + pickRounds);
                //advanced = "";
                advanced = o.advancedText;
                if (advanced === "undefined" || advanced === undefined) {
                    advanced = "";
                }
                //console.log("scoreType:" + o.game_scoreType);

                switch (o.game_scoreType.toLowerCase()) {
                    case "points":
                        advanced += "Name=Points|Type=Counter|Value=1|Default=0;";
                        break;
                    case "tally":
                        advanced += "Name=Points|Type=Tally|Value=1|Default=0;";
                        break;
                    case "hiddentally":
                        advanced += "Name=Points|Type=HiddenTally|Value=1|Default=0;";
                        break;
                    case "winlose":
                        advanced += "Name=Win/Lose|Type=Toggle;";
                        break;
                    case "areascontrolled":
                        advanced += "Name=Areas Controlled|Type=Counter|Value=1|Default=0;";
                        break;
                }



                if (pickRounds === true || pickRounds == "true" || pickRounds == -1 || pickRounds == "-1") {
                    advanced += "PickRounds=True;";
                }
                //             

                game_id = app.sanitizeGame(o.game_id);
                //function Game(id, bggId, name, icon, scoreType, advancedText, version)
                customGame = new Game(game_id, o.game_bggid, o.game_name, o.game_icon, o.game_scoreType, advanced, "1");
                //console.log(advanced);
                //customGame.advancedText = advanced;
                if (o.game_visible == -1) {
                    bHidden = false;
                } else {
                    bHidden = true;
                }
                customGame.hidden = bHidden;
                if (app.oldFavorites.indexOf(game_id) !== -1) {
                    customGame.favorite = true;
                }
                //console.log(customGame);
                customGames.push(customGame);
                if (i == l - 1) {
                    //console.log(customGames);
                    callback(customGames);
                }
            }

            if (l <= 0) {
                callback(Globals.empty);
            }
            //console.log("Game from DB");
            //console.log(o2);
        });

    },

    oldGetCloudHist: function(oldStore, callback) {
        //console.log("OLD Get Cloud Hist");
        var i;
        var l;
        var o;
        var cloudHists = [];
        var cloudHist;
        var match;
        var cloudId;
        var username;
        var numberPattern = /\d+/g;
        oldStore.findAllCloudHist(function(oldCloudHists) {
            l = oldCloudHists.length;
            for (i = 0; i < l; i++) {
                o = oldCloudHists[i];

                //console.log("cloudblob from db");
                //console.log(o);
                //console.log("split this id?");
                match = o.cloud_id.match(numberPattern);
                if (match.length > 0) {
                    cloudId = match[0];
                } else {
                    cloudId = o.cloud_id;
                }
                username = o.cloud_id;
                username = username.replace(cloudId, "");
                cloudHist = new CloudHist(cloudId, app.oldCloudUsername); //console.log(add);
                cloudHists.push(cloudHist);
                if (i == l - 1) {
                    callback(cloudHists);
                }
            }
            if (l <= 0) {
                callback(Globals.empty);
            }
        });
    },

    oldGetCloudBlob: function(oldStore, callback) {
        //console.log("OLD get cloud blob");
        var i;
        var l;
        var o;
        var cloudBlobs = [];
        var cloudBlob;
        oldStore.findAllCloudBlob(function(oldCloudBlobs) {
            l = oldCloudBlobs.length;
            for (i = 0; i < l; i++) {
                o = oldCloudBlobs[i];

                //console.log("cloudblob from db");
                //console.log(o);
                //console.log("split this id?");
                cloudBlob = new CloudBlob(o.cloud_blob_id, o.cloud_blob_data, CloudAll.username, o.cloud_local_id);
                //console.log("CloudBlob");
                //console.log(add);
                cloudBlobs.push(cloudBlob);
                if (i == l - 1) {
                    callback(cloudBlobs);
                }
            }
            if (l <= 0) {
                callback(Globals.empty);
            }
        });
    },

    oldGetCloudQueue: function(oldStore, callback) {
        //console.log("OLD get cloud queue");
        var i;
        var l;
        var o;
        var clouds = [];
        var myCloud;
        oldStore.findAllCloudQueue(function(oldClouds) {
            l = oldClouds.length;
            for (i = 0; i < l; i++) {
                o = oldClouds[i];

                //console.log("cloud from db");
                //console.log(o);
                //function Cloud(cloudId, user, Globals.appId, cloudIdRemote, cloudIdLocal, cloudData, username, password, encoding, cloudDataId, cloudHasBlob) {
                //var c = new Cloud(id, mUsername, Globals.appId, cloudIdRemote, id, cloudData, "", "", false, cloudDataId, cloudHasBlob, cloudIsBlob, 1, 1);
                myCloud = new Cloud(o.cloud_id, CloudAll.username, Globals.appId, o.cloud_id_remote, o.cloud_id, o.cloud_data, "", "", false, o.cloud_data_id, o.cloud_hasblob, o.cloud_isblob, 1, 1);
                //console.log("CloudQueue");
                //console.log(add);
                clouds.push(myCloud);
                if (i == l - 1) {
                    callback(clouds);
                }
            }
            if (l <= 0) {
                callback(Globals.empty);
            }
        });
    },

    oldGetScores: function(oldStore, callback) {
        //console.log("OLD get scores");
        var l;
        var i;
        var o;
        var scores = [];
        var score;
        var lastSess = "";
        var position;
        var bWin;
        oldStore.findAllScores(function(oldScores) {
            l = oldScores.length;

            //console.log("scores");
            //console.log(scores);
            for (i = 0; i < l; i++) {
                o = oldScores[i];

                //console.log("score from db");
                //console.log(o);
                if (o.session_id !== lastSess) {
                    lastSess = o.session_id;
                    position = 1;
                } else {
                    position++;
                }

                if (o.win == -1 || o.win == "true" || o.win === true || o.win == "-1") {
                    bWin = true;
                } else {
                    bWin = false;
                }
                //console.log(position);
                score = new Score(o.score_id, o.session_id, o.player_id, parseFloat(o.score), bWin, "", "", "", position);
                //console.log("Score");
                //console.log(add);
                scores.push(score);
                if (i == l - 1) {
                    callback(scores);
                }
            }
            if (l <= 0) {
                callback(Globals.empty);
            }
        });
    },

    oldGetAwardsEarned: function(oldStore, callback) {
        //console.log("OLD get awards earned");
        var o;
        var i;
        var l;
        var gameIds = [];
        var awardEarned;
        var awardsEarned = [];
        var game_id;
        oldStore.findAllAwardsEarned(function(oldAwards) {
            l = oldAwards.length;
            for (i = 0; i < l; i++) {
                o = oldAwards[i];

                //console.log("award from db");
                //console.log(o);
                game_id = app.sanitizeGame(o.game_id);
                if (gameIds.indexOf(game_id) === -1) {
                    gameIds.push(game_id);
                }
                //console.log("Award");
                //console.log(add);
                awardEarned = new AwardEarned(o.earned_id, o.award_id, o.award_value, game_id, o.player_id, o.session_id, o.award_date, o.award_data);
                awardsEarned.push(awardEarned);
                if (i == l - 1) {
                    callback(awardsEarned, gameIds);
                }
            }
            if (l <= 0) {
                callback(Globals.empty);
            }
        });
    },

    oldGetSessions: function(oldStore, callback) {
        //console.log("OLD get sessions");
        var o;
        var i;
        var l;
        var gameIds = [];
        var sessions = [];
        var session;
        var game_id;
        oldStore.findAllSessions(function(oldSessions) {
            l = oldSessions.length;
            //console.log("Sessions returned");
            for (i = 0; i < l; i++) {
                o = oldSessions[i];
                //console.log("session from db");
                //console.log(o);
                game_id = app.sanitizeGame(o.game_id);
                if (gameIds.indexOf(game_id) === -1) {
                    gameIds.push(game_id);
                }
                session = new Session(o.session_id, game_id, o.game_date, o.game_notes, o.game_photo, o.game_won, o.game_location, o.game_duration);
                sessions.push(session);
                if (i == l - 1) {
                    callback(sessions, gameIds);
                }

            }
            if (l <= 0) {
                callback(Globals.empty);
            }
        });
    },

    oldGetSettings: function(oldStore, callback) {
        //console.log("OLD get settings");
        var i;
        var l;
        var s;
        var setting;
        var settings = [];
        var favList;
        oldStore.findAllSettings(function(oldSettings) {
            l = oldSettings.length;
            for (i = 0; i < l; i++) {
                s = oldSettings[i];
                setting = new Setting(s.setting_name, s.setting_value, Globals.mUsername);
                settings.push(setting);
                //console.log("Setting");
                //console.log(add);
                if (setting.settingName == "cloudUsername") {
                    CloudAll.username = setting.settingValue;
                    //console.log("cloud username: " + cloudUsername);
                }
                if (setting.settingName == "favList") {
                    favList = setting.settingValue;
                    app.saveSetting("oldFavList", favList);
                }

                if (i == l - 1) {
                    callback(settings);
                }
            }
            if (l <= 0) {
                callback(Globals.empty);
            }
        });
    },

    oldGetPlayers: function(oldStore, callback) {
        //console.log("OLD get players");
        var players = [];
        var p;
        var i;
        var l;
        var o;
        //console.log(oldStore);
        oldStore.findAllPlayers(function(oldPlayers) {
            //console.log(oldPlayers); 
            l = oldPlayers.length;
            for (i = 0; i < l; i++) {
                o = oldPlayers[i];
                //console.log("player from db");
                //console.log(o);
                // if (o.player_visible === 0 || o.player_visible == "0") {
                    // bHidden = true;
                // } else {
                    // bHidden = false;
                // }
                //function Player(id, bggUsername, twitter, name, icon, hiddenOnDevice
                p = new Player(o.player_id, o.player_bggusername, o.player_twitter, o.player_name, o.player_icon, false);
                players.push(p);
                //console.log("Player");
                //console.log(add);
                if (i == l - 1) {
                    callback(players);
                }
            }
            if (l <= 0) {
                callback(Globals.empty);
            }
        });
    },

    loadPrefs: function(callback) {
        var $elRadioSelection1 = $('#radioSelection-1');
        var $elRadioSelection2 = $('#radioSelection-2');
        var $elRadioHistory1 = $('#radioHistory-1');
        var $elRadioHistory2 = $('#radioHistory-2');
        var $elRadioAwards1 = $('#radioAwards-1');
        var $elRadioAwards2 = $('#radioAwards-2');
        var $elRadioStats1 = $('#radioStats-1');
        var $elRadioStats2 = $('#radioStats-2');
        var $elRadioStats3 = $('#radioStats-3');
        var $elRadioGallery1 = $('#radioGallery-1');
        var $elRadioGallery2 = $('#radioGallery-2');

        var $elChkCloudActivity = $('#chkCloudActivity');
        var $elChkCloudInactive = $('#chkCloudInactive');
        var $elChkSessionTimer = $('#chkSessionTimer');
        var $elChkBGG = $('#chkBGG');
        var $elChkGameOverMan = $('#chkGameOverMan');
        var $elChkHiddenPlayers = $('#chkHiddenPlayers');
        var $elchkOnlineGames = $('#chkOnlineGames');
        var $elFlipButtons = $('#flip-buttons');
        var $elFlipOnline = $('#flip-online');
        
        app.getSetting('chkOnlineGames', 'true', function(setting) {
            $elFlipOnline.val(setting).flipswitch('refresh');
        });
        
        app.getSetting('flip-buttons', Globals.bMiniDefault, function(setting) {
            //console.log("Setting: " + setting);
            
            $elFlipButtons.val(setting).flipswitch('refresh');
        });

        app.getSetting('chkCloudActivity', 'true', function(setting) {
            if (setting === 'true') {
                $elChkCloudActivity.attr("checked", true).checkboxradio("refresh");
            } else {
                $elChkCloudActivity.attr("checked", false).checkboxradio("refresh");
            }
        });

        app.getSetting('chkCloudInactive', 'true', function(setting) {
            if (setting === 'true') {
                $elChkCloudInactive.attr("checked", true).checkboxradio("refresh");
            } else {
                $elChkCloudInactive.attr("checked", false).checkboxradio("refresh");
            }
        });

        app.getSetting('chkSessionTimer', 'true', function(setting) {
            if (setting === 'true') {
                $elChkSessionTimer.attr("checked", true).checkboxradio("refresh");
            } else {
                $elChkSessionTimer.attr("checked", false).checkboxradio("refresh");
            }
        });

        app.getSetting('chkBGG', 'true', function(setting) {
            if (setting === 'true') {
                $elChkBGG.attr("checked", true).checkboxradio("refresh");
            } else {
                $elChkBGG.attr("checked", false).checkboxradio("refresh");
            }
        });

        app.getSetting('chkGameOverMan', 'true', function(setting) {
            if (setting === 'true') {
                $elChkGameOverMan.attr("checked", true).checkboxradio("refresh");
            } else {
                $elChkGameOverMan.attr("checked", false).checkboxradio("refresh");
            }
        });

        app.getSetting('chkHiddenPlayers', 'true', function(setting) {
            if (setting === 'true') {
                $elChkHiddenPlayers.attr("checked", true).checkboxradio("refresh");
            } else {
                $elChkHiddenPlayers.attr("checked", false).checkboxradio("refresh");
            }
        });

        // app.getSetting('chkOnlineGames', 'false', function(setting) {
            // if (setting === 'true') {
                // $elchkOnlineGames.attr("checked", false).checkboxradio("refresh");
            // } else {
                // $elchkOnlineGames.attr("checked", true).checkboxradio("refresh");
            // }
        // });

        app.getSetting('filterHistoryPlayers', 'soft', function(setting) {
            if (setting === 'none') {
                $elRadioSelection1.attr("checked", true).checkboxradio("refresh");
                $elRadioSelection2.attr("checked", false).checkboxradio("refresh");
            } else if (setting === 'soft') {
                $elRadioSelection1.attr("checked", false).checkboxradio("refresh");
                $elRadioSelection2.attr("checked", true).checkboxradio("refresh");
            } else {
                Toast.toast("unknown setting filterHistoryPlayers: " + setting);
            }
        });

        app.getSetting('filterHistory', 'hard', function(setting) {
            if (setting === 'none') {
                $elRadioHistory1.attr("checked", true).checkboxradio("refresh");
                $elRadioHistory2.attr("checked", false).checkboxradio("refresh");
            } else if (setting === 'hard') {
                $elRadioHistory1.attr("checked", false).checkboxradio("refresh");
                $elRadioHistory2.attr("checked", true).checkboxradio("refresh");
            } else {
                Toast.toast("unknown setting filterHistory: " + setting);
            }
        });

        app.getSetting('filterHistoryAwards', 'soft', function(setting) {
            if (setting === 'none') {
                $elRadioAwards1.attr("checked", true).checkboxradio("refresh");
                $elRadioAwards2.attr("checked", false).checkboxradio("refresh");
            } else if (setting === 'soft') {
                $elRadioAwards1.attr("checked", false).checkboxradio("refresh");
                $elRadioAwards2.attr("checked", true).checkboxradio("refresh");
            } else {
                Toast.toast("unknown setting filterHistoryAwards: " + setting);
            }
        });

        app.getSetting('filterHistoryStats', 'hard', function(setting) {
            if (setting === 'none') {
                $elRadioStats1.attr("checked", true).checkboxradio("refresh");
                $elRadioStats2.attr("checked", false).checkboxradio("refresh");
                $elRadioStats3.attr("checked", false).checkboxradio("refresh");
            } else if (setting === 'soft') {
                $elRadioStats1.attr("checked", false).checkboxradio("refresh");
                $elRadioStats2.attr("checked", true).checkboxradio("refresh");
                $elRadioStats3.attr("checked", false).checkboxradio("refresh");
            } else if (setting === 'hard') {
                $elRadioStats1.attr("checked", false).checkboxradio("refresh");
                $elRadioStats2.attr("checked", false).checkboxradio("refresh");
                $elRadioStats3.attr("checked", true).checkboxradio("refresh");
            } else {
                Toast.toast("unknown setting filterHistoryStats: " + setting);
            }
        });

        app.getSetting('filterHistoryGallery', 'hard', function(setting) {
            if (setting === 'none') {
                $elRadioGallery1.attr("checked", true).checkboxradio("refresh");
                $elRadioGallery2.attr("checked", false).checkboxradio("refresh");
            } else if (setting === 'hard') {
                $elRadioGallery1.attr("checked", false).checkboxradio("refresh");
                $elRadioGallery2.attr("checked", true).checkboxradio("refresh");
            } else {
                Toast.toast("unknown setting filterHistoryGallery: " + setting);
            }
        });

        callback();
    },

    loadPlayers: function(noToast, callback) {
        //console.log("Load Players");
        app.getSetting("filterHistoryPlayers", "soft", function(filterType) {
            if (filterType === "soft" || filterType === "hard") {
                app.bShowHidden = false;
                app.countHiddenPlayers(function(iHidden) {
                    if (iHidden > 0) {
                        app.getSetting("chkHiddenPlayers", "true", function(setting) {
                            if (setting === "true" && noToast === false) {
                                Toast.toastMini(iHidden + " hidden players were filtered");
                            }
                        });

                    }
                });
                app.findAllPlayers(false, app.bShowHidden, function(players) {
                    callback(players);
                });
            } else {
                app.bShowHidden = true;
                app.findAllPlayers(false, app.bShowHidden, function(players) {
                    callback(players);
                });
            }

            //console.log("app.bShowHidden: " + app.bShowHidden);


        });
        //if (app.currPlayers.length === 0) {
        //console.log("Find Players");

        // } else {
        // callback();
        // }

    },

    isPlayerHiddenOnDevice: function(id) {
        if (id === "" || id === undefined || id === null) {
            return false;
        } else {
            var l = app.currPlayers.length;
            var bFound;
            for (var i = 0; i < l; i++) {
                bFound = false;
                if (app.currPlayers[i].id === id) {
                    bFound = true;
                    break;
                }
            }
            //console.log("Player hidden " + id + " " + !bFound);
            return (!bFound);
        }
    },

    loadAwards: function(callback) {
        //Toast.toast("Load Awards");

        app.findAllAwardsEarned(function(awards) {

            //Toast.toast("Found awards");
            //Toast.toast(awards);
            awards.sort(dynamicSort("-earnedId"));
            //Toast.toast("After Sort");
            app.currAwardsEarned = awards;
            var awardNames = [];
            app.awardsDisplay = [];
            var l = app.currAwardsEarned.length;
            var awardName;
            var myAwardDisplay;
            var a;
            var k;
            var j;
            //Toast.toast("for i=0 to " + l + " awards");
            for (var i = 0; i < l; i++) {

                a = app.currAwardsEarned[i];
                //Toast.toast(a);

                k = app.currAwards.length;
                for (j = 0; j < k; j++) {
                    if (app.currAwards[j].id == a.awardId) {
                        awardName = app.currAwards[j].name;
                    }
                }
                if (awardNames.indexOf(awardName) === -1 && awardName !== "") {
                    awardNames.push(awardName);


                    myAwardDisplay = new AwardDisplay(awardName, a.awardId);
                    app.awardsDisplay.push(myAwardDisplay);
                }

            }


            app.awardsDisplay.sort(dynamicSort("awardName"));
            myAwardDisplay = new AwardDisplay("All", "");
            app.awardsDisplay.unshift(myAwardDisplay);
            //Toast.toast("Call back");

            if (!app.historyIsLoaded) {
                app.findAllHistory(function() {
                    callback();
                });
            } else {
                callback();
            }



        });
    },

    loadStats: function(callback) {
        if (!app.historyIsLoaded) {
            app.findAllHistory(function() {
                var gameIds = [];
                var numPlayers = [];
                app.gamesDisplay = [];
                app.numPlayersDisplay = [];
                var l = app.currHistory.length;
                var m;
                var j;
                var g;
                var scores;
                var s;
                var myGameDisplay;
                var myNumPlayersDisplay;
                //console.log("history: " + l);
                for (var i = 0; i < l; i++) {
                    g = app.currHistory[i].game;
                    scores = app.currHistory[i].scores;
                    if (gameIds.indexOf(g.id) === -1) {
                        gameIds.push(g.id);
                        myGameDisplay = new GameDisplay(g.name, g.id);
                        app.gamesDisplay.push(myGameDisplay);
                    }
                    m = scores.length;
                    //console.log("NumPlayers: " + m);

                    if (numPlayers.indexOf(m) === -1) {
                        numPlayers.push(m);
                        myNumPlayersDisplay = new NumPlayersDisplay(m, m);
                        app.numPlayersDisplay.push(myNumPlayersDisplay);
                    }

                }
                app.gamesDisplay.sort(dynamicSort("gameName"));
                myGameDisplay = new GameDisplay("All", "");
                app.gamesDisplay.unshift(myGameDisplay);
                app.numPlayersDisplay.sort(dynamicSort("number"));
                myNumPlayersDisplay = new NumPlayersDisplay("All", "");
                app.numPlayersDisplay.unshift(myNumPlayersDisplay);
                callback();
            });
        } else {
            callback();
        }

    },

    loadingShow: function(text, textonly, method, callback) {
        //console.log("[LoadingShow] " + text);
        if (text !== "") {
            $.mobile.loading('show', {
                text: text,
                textonly: textonly,
                textVisible: true,
                theme: 'a',
                html: ""
            });
        }

        setTimeout(method, 100, callback);
    },


    writeGamesToPageDelay: function(bShow, callback) {
        //console.log("write games to page delay");
        var text;
        if (bShow === true) {
            text = "Loading Games";
        } else {
            text = "";
        }
        app.loadingShow(text, true, app.writeGamesToPage, "games");
    },
    
    clearHistoryLists: function() {
      var $el;
      $el = $('#history-list');
      $el.listview();
      $el.empty();
      $el.append('<li data-role="list-divider">History</li><li>Choose filter options above</li>');
      $el.listview("refresh");
      $el = $('#award-list');
      $el.listview();
      $el.empty();
      $el.append('<li data-role="list-divider">Achievements</li><li>Choose filter options above</li>');
      $el.listview("refresh");
      $el = $('#history-list');
      $el.listview();
      $el.empty();
      $el.append('<li data-role="list-divider">History</li><li>Choose filter options above</li>');
      $el.listview("refresh");
      $el = $('#delete-history-list');
      $el.listview();
      $el.empty();
      $el.append('<li data-role="list-divider">Select a history item to delete</li><li>Choose filter options above</li>');
      $el.listview("refresh");
    },

    loadHistoryDelay: function(callback) {
        var text;
        if (!app.historyIsLoaded) {
            text = "Loading History";
            app.clearHistoryLists();
        } else {
            text = "";
        }
        app.loadingShow(text, true, app.loadHistory, callback);
    },

    loadAwardsDelay: function(callback) {
        var text;
        if (!app.historyIsLoaded) {
            text = "Loading History";
            app.clearHistoryLists();
        } else {
            text = "";
        }
        //console.log(text);
        app.loadingShow(text, true, app.loadAwards, callback);
    },

    loadStatsDelay: function(callback) {
        var text;
        if (!app.historyIsLoaded) {
            text = "Loading History";
            app.clearHistoryLists();
        } else {
            text = "";
        }
        app.loadingShow(text, true, app.loadStats, callback);
    },

    saveScoresDelay: function() {
        var text = "Calculating Achievements";
        app.loadingShow(text, true, app.saveScores);
    },

    loadHistory: function(callback) {
        //console.log("load history");
        if (!app.historyIsLoaded) {
            app.findAllHistory(function() {
                callback();
            });
        } else {
            callback();
        }
    },

    loadGames: function(callback) {
        if (app.currGames.length === 0) {
            //console.log("Load Games");
            this.store.findAllGames(false, function(games) {
                //console.log(games);
                app.currGames = games;
                callback();

            });
        } else {
            callback();
        }

    },

    loadAllFactions: function(existingFactions, callback) {
        //console.log('loading categories');
        app.currFactions = [];
        var j = 0;
        var faction = '';
        var l1 = 0;
        var l2 = 0;
        var i = 0;
        var bFound = false;
        var iPushed = 0;
        var factionText = "Factions";

        var defFactions = [
            "None",
        ];

        l1 = app.currGameDetails.factions.length;
        if (l1 > 0) {
            app.currGameDetails.factions.sort();
        }
        for (i = 0; i < l1; i++) {
            defFactions.push(app.currGameDetails.factions[i]);
        }



        l1 = app.currGameDetails.players.length;
        //console.log('allPasswords.length: ' + l1);
        for (i = 0; i < l1; i++) {
            bFound = false;
            l2 = app.currFactions.length;
            //console.log('app.currCategories.length: ' + l2);

            faction = app.currGameDetails.players[i].faction.trim();
            //console.log('Cat: ' + cat);
            for (j = 0; j < l2; j++) {
                //console.log('app.currCatJ: ' + app.currCategories[j].toLowerCase());
                //console.log('cat: ' + cat);
                if (app.currFactions[j].toLowerCase() === faction.toLowerCase()) {
                    //console.log('Found = true');
                    bFound = true;
                }
            }
            if (bFound === false) {
                //console.log('Adding category: ' + cat);
                if (faction !== '') {
                    app.currFactions.push(faction);
                }
            }
        }
        app.currFactions.sort();
        if (app.currFactions.length > 0) {
            app.currFactions.push('---');
        }

        l1 = existingFactions.length;
        //console.log('defcats.length: ' + l1)
        for (i = 0; i < l1; i++) {
            bFound = false;
            l2 = app.currFactions.length;
            faction = existingFactions[i].name;
            //console.log('defcat: ' + cat);
            for (j = 0; j < l2; j++) {
                if (app.currFactions[j].toLowerCase() === faction.toLowerCase()) {
                    //console.log('Found!');
                    bFound = true;
                    break;
                }
            }
            //console.log('bfound: ' + bFound);
            if (bFound === false) {
                //console.log('Adding team: ' + team);
                if (faction !== '') {
                    iPushed++;
                    app.currFactions.push(faction);
                }
            }
        }

        if (app.currFactions.length > 0 && iPushed > 0) {
            app.currFactions.push('---');
        }

        l1 = defFactions.length;
        //console.log('defcats.length: ' + l1)
        for (i = 0; i < l1; i++) {
            bFound = false;
            l2 = app.currFactions.length;
            faction = defFactions[i].trim();
            //console.log('defcat: ' + cat);
            for (j = 0; j < l2; j++) {
                if (app.currFactions[j].toLowerCase() === faction.toLowerCase()) {
                    //console.log('Found!');
                    bFound = true;
                    break;
                }
            }
            //console.log('bfound: ' + bFound);
            if (bFound === false) {
                //console.log('Adding team: ' + team);
                if (faction !== '') {
                    app.currFactions.push(faction);
                }
            }
        }
        app.currFactions.unshift(factionText);
        callback(true);

    },

    loadAllTeams: function(existingTeams, callback) {
        //console.log('loading categories');
        app.currTeams = [];
        var j = 0;
        var team = '';
        var l1 = 0;
        var l2 = 0;
        var i = 0;
        var iPushed = 0;
        var bFound = false;
        var teamText = "Team Names";
        app.findAllTeams(function(existingTeams) {
            var defTeams = [
                "None",
                "Team 1",
                "Team 2",
                "Team 3",
                "Team 4",
                "Team 5",
                "Team 6"
            ];
            l1 = app.currGameDetails.players.length;
            //console.log('allPasswords.length: ' + l1);
            for (i = 0; i < l1; i++) {
                bFound = false;
                l2 = app.currTeams.length;
                //console.log('app.currCategories.length: ' + l2);

                team = app.currGameDetails.players[i].team.trim();
                //console.log('Cat: ' + cat);
                for (j = 0; j < l2; j++) {
                    //console.log('app.currCatJ: ' + app.currCategories[j].toLowerCase());
                    //console.log('cat: ' + cat);
                    if (app.currTeams[j].toLowerCase() === team.toLowerCase()) {
                        //console.log('Found = true');
                        bFound = true;
                    }
                }
                if (bFound === false) {
                    //console.log('Adding category: ' + cat);
                    if (team !== '') {
                        app.currTeams.push(team);
                    }
                }
            }
            app.currTeams.sort();
            if (app.currTeams.length > 0) {
                app.currTeams.push('---');
            }

            l1 = existingTeams.length;
            //console.log('defcats.length: ' + l1)
            for (i = 0; i < l1; i++) {
                bFound = false;
                l2 = app.currTeams.length;
                team = existingTeams[i].name;
                //console.log('defcat: ' + cat);
                for (j = 0; j < l2; j++) {
                    if (app.currTeams[j].toLowerCase() === team.toLowerCase()) {
                        //console.log('Found!');
                        bFound = true;
                        break;
                    }
                }
                //console.log('bfound: ' + bFound);
                if (bFound === false) {
                    //console.log('Adding team: ' + team);
                    if (team !== '') {
                        iPushed++;
                        app.currTeams.push(team);
                    }
                }
            }

            if (app.currTeams.length > 0 && iPushed > 0) {
                app.currTeams.push('---');
            }

            l1 = defTeams.length;
            //console.log('defcats.length: ' + l1)
            for (i = 0; i < l1; i++) {
                bFound = false;
                l2 = app.currTeams.length;
                team = defTeams[i].trim();
                //console.log('defcat: ' + cat);
                for (j = 0; j < l2; j++) {
                    if (app.currTeams[j].toLowerCase() === team.toLowerCase()) {
                        //console.log('Found!');
                        bFound = true;
                        break;
                    }
                }
                //console.log('bfound: ' + bFound);
                if (bFound === false) {
                    //console.log('Adding team: ' + team);
                    if (team !== '') {
                        app.currTeams.push(team);
                    }
                }
            }
            app.currTeams.unshift(teamText);
            callback(true);
        });

    },

    loadAllLocations: function(existingLocations, callback) {
        //console.log('loading locations');
        app.currLocations = [];
        var j = 0;
        var locations = '';
        var l1 = 0;
        var l2 = 0;
        var i = 0;
        var iPushed = 0;
        var bFound = false;
        var locationText = "Locations";
        var loc;
        app.findAllLocations(function(existingLocations) {
            //console.log("Existing locations");
            //console.log(existingLocations);
            var defLocations = [

                "Home"
            ];
            l1 = defLocations.length;
            for (i = 0; i < l1; i++) {
                loc = defLocations[i];
                app.currLocations.push(loc);
            }

            l1 = existingLocations.length;
            //console.log('defcats.length: ' + l1)
            for (i = 0; i < l1; i++) {
                loc = existingLocations[i].name;
                app.currLocations.push(loc);

            }
            app.currLocations.sort();
            app.currLocations.unshift("None");
            app.currLocations.unshift(locationText);
            callback(true);
        });

    },

    generateScoreDetails: function(myGame, callback) {
        //console.log("Generate score details");
        var a = [];
        var myGameDetails = new GameDetails(myGame);
        var game_advanced = myGame.advancedText;
        a = game_advanced.split(";");
        var l = a.length;
        for (var i = 0; i < l; i++) {
            if (a[i].indexOf("=") > 1) {
                var myScoreItem = new ScoreItem(a[i]);
                //console.log("Adding item: " + a[i]);
                myScoreItem.processScoreItem(myGameDetails, function(detailsAfter) {
                    //console.log("Add Scoreitem: " + myScoreItem.id);
                    myGameDetails = detailsAfter;
                    myGameDetails.scoreItems.push(myScoreItem);
                    //console.log("i: " + i + " l:" + l);
                    if (i === (l - 1)) {
                        callback(myGameDetails);
                    }
                });
            } else {
                if (i === (l - 1)) {
                    callback(myGameDetails);
                }
            }
        }
        if (l === 0) {
            callback(myGameDetails);
        }
    },

    gamePhotoFromCamera: function(source) {
        var saveToPhotoAlbum=true;
        
        if (source !== 1) {
            saveToPhotoAlbum=false;
        }
        if (Device.platform != "Browser") {
            // event.preventDefault();
            // event.stopPropagation();
            if (Device.platform === "FirefoxOSXXX") {
                //console.log("using pick");
                var pick = new MozActivity({
                    name: "pick",
                    data: {
                        type: ["image/png"]
                    }
                });

                //var myPhoto = pick;
                // On successful pick, display image in the checkin dialog
                pick.onsuccess = function() {
                    //console.log("picSuccess");
                    var res = pick.result;
                    //console.log("res");
                    //console.log(res);
                    // Create object url for picked image
                    var photoURL = window.URL.createObjectURL(res.blob);
                    //console.log("photoURL");
                    //console.log(photoURL);
                    app.gamePicSuccess(photoURL);
                };

                pick.onerror = function() {
                    //console.log(this.error);
                };
            } else {
                navigator.camera.getPicture(app.gamePicSuccess, app.gamePicFail, {
                    quality: 50,
                    destinationType: Camera.DestinationType.DATA_URL,
                    targetWidth: 80,
                    targetHeight: 80,
                    sourceType: source,
                    saveToPhotoAlbum: saveToPhotoAlbum
                });
            }

        } else {
            Toast.toast("This feature is only available on mobile.");
            if (Globals.bDebug === true) {
                app.gamePicSuccess(Globals.fakePhoto);
            }
        }
    },

    sessionPhotoFromCamera: function(source) {
        var saveToPhotoAlbum=true;
        
        if (source !== 1) {
            saveToPhotoAlbum=false;
        }
        if (Device.platform != "Browser") {
            // event.preventDefault();
            // event.stopPropagation();
            if (Device.platform === "FirefoxOSXXX") {
                //console.log("using pick");
                var pick = new MozActivity({
                    name: "pick",
                    data: {
                        type: ["image/png"]
                    }
                });

                //var myPhoto = pick;
                // On successful pick, display image in the checkin dialog
                pick.onsuccess = function() {
                    //console.log("picSuccess");
                    var res = pick.result;
                    //console.log("res");
                    //console.log(res);
                    //console.log(res.blob);
                    // Create object url for picked image
                    //var photoURL = window.URL.createObjectURL(res.blob);
                    //console.log("photoURL");
                    //console.log(photoURL);
                    app.sessionPicSuccess(res.blob);
                };

                pick.onerror = function() {
                    //console.log(this.error);
                };
            } else {
                navigator.camera.getPicture(app.sessionPicSuccess, app.sessionPicFail, {
                    quality: 90,
                    targetWidth: 1600,
                    targetHeight: 1200,
                    destinationType: Camera.DestinationType.FILE_URI,
                    sourceType: source,
                    saveToPhotoAlbum: saveToPhotoAlbum,
                    allowEdit: false
                });
            }

        } else {
            Toast.toast("This feature is only available on mobile.");
            if (Globals.bDebug === true) {
                app.sessionPicSuccess(Globals.fakePhoto);
            }
        }
    },
    
    toolsPhotoFromCamera: function(source) {
        var saveToPhotoAlbum=true;
        
        if (source !== 1) {
            saveToPhotoAlbum=false;
        }
        if (Device.platform != "Browser") {
            // event.preventDefault();
            // event.stopPropagation();
            if (Device.platform === "FirefoxOSXXX") {
                //console.log("using pick");
                var pick = new MozActivity({
                    name: "pick",
                    data: {
                        type: ["image/png"]
                    }
                });

                //var myPhoto = pick;
                // On successful pick, display image in the checkin dialog
                pick.onsuccess = function() {
                    //console.log("picSuccess");
                    var res = pick.result;
                    //console.log("res");
                    //console.log(res);
                    // Create object url for picked image
                    //var photoURL = window.URL.createObjectURL(res.blob);
                    //console.log("photoURL");
                    //console.log(photoURL);
                    app.toolPicSuccess(res.blob);
                };

                pick.onerror = function() {
                    //console.log(this.error);
                };
            } else {
                navigator.camera.getPicture(app.toolPicSuccess, app.toolPicFail, {
                    quality: 90,
                    targetWidth: 1600,
                    targetHeight: 1200,
                    destinationType: Camera.DestinationType.FILE_URI,
                    sourceType: source,
                    saveToPhotoAlbum: saveToPhotoAlbum,
                    allowEdit: false
                });
            }

        } else {
            Toast.toast("This feature is only available on mobile.");
        }
    },

    playerPhotoFromCamera: function(source) {
        var saveToPhotoAlbum=true;
        
        if (source !== 1) {
            saveToPhotoAlbum=false;
        }
        if (Device.platform != "Browser") {
            // event.preventDefault();
            // event.stopPropagation();
            if (Device.platform === "FirefoxOSXXX") {
                //console.log("using pick");
                var pick = new MozActivity({
                    name: "pick",
                    data: {
                        type: ["image/png"]
                    }
                });

                //var myPhoto = pick;
                // On successful pick, display image in the checkin dialog
                pick.onsuccess = function() {
                    //console.log("picSuccess");
                    var res = pick.result;
                    //console.log("res");
                    //console.log(res);
                    // Create object url for picked image
                    var photoURL = window.URL.createObjectURL(res.blob);
                    //console.log("photoURL");
                    //console.log(photoURL);
                    app.playerPicSuccess(photoURL);
                };

                pick.onerror = function() {
                    //console.log(this.error);
                };
            } else {
                navigator.camera.getPicture(app.playerPicSuccess, app.playerPicFail, {
                    quality: 50,
                    destinationType: Camera.DestinationType.DATA_URL,
                    targetWidth: 80,
                    targetHeight: 80,
                    sourceType: source,
                    saveToPhotoAlbum: saveToPhotoAlbum
                });
            }

        } else {
            Toast.toast("This feature is only available on mobile.");
            if (Globals.bDebug === true) {
                app.playerPicSuccess(Globals.fakePhoto);
            }
        }
    },

    gamePicSuccess: function(imageData) {
        //console.log("Success");
        app.gamePhotoChanged = true;
        var $el = $('#imgGameImage');
        var myLoad;
        var imgAsDataURL;
        if (Device.platform === "FirefoxOS") {
            var elDom = document.getElementById("imgGameImage");
            myLoad = function() {
                elDom.removeEventListener('load', myLoad);
                var imgCanvas = document.createElement("canvas"),
                    imgContext = imgCanvas.getContext("2d");
                imgCanvas.width = elDom.width;
                imgCanvas.height = elDom.height;
                imgContext.drawImage(elDom, 0, 0, elDom.width, elDom.height);
                var imgAsDataURL = imgCanvas.toDataURL("image/png");
                $el.attr('src', imgAsDataURL).load();
            };

            elDom.addEventListener("load", myLoad, false);

            $el.attr('src', imageData).load();
        } else {
            //Toast.toast(imageData.length);
            imgAsDataURL = "data:image/jpeg;base64," + imageData;
            $el.attr('src', imgAsDataURL).load();
            app.currEditGame.icon = imgAsDataURL;
            app.currEditGame.iconURL = "";
        }

    },
    // there was an error, message contains its cause
    gamePicFail: function(message) {
        //console.log("failed " + message);
        alertDebug("Failed because: " + message);
        //tempGamePic=null;
    },

    sessionPicSuccess: function(imageURI) {
      var fileName="SessionPic_" + getTimestamp() + ".jpg";
      FileIO.makeFilePersistent(imageURI, fileName, function(partialURI) {
          //console.log("Partial URI: " + partialURI);
          app.lastPhoto = partialURI;
        app.sessionPicUpdate(partialURI);
      });
    },
    
    checkConvertOldDb: function(callback) {
        //console.log(Device.platform);
        if (Device.platform === "Android" || Device.platform === "iOS" || Device.platform === "Browser") {
            app.getSetting("convertedDb", false, function(convertedDb) {
                //console.log(convertedDb);
                if (convertedDb === false) {
                    //console.log("converting db");
                    app.convertOldDb(function(success) {
                        //console.log("convert db success: " + success);
                        if (success === true) {
                            app.saveSetting("convertedDb", true);
                            app.bJustConverted = true;    
                        }
                        callback(success);
                    });
                } else {
                    //console.log("db already converted");
                    callback(true);
                }
            });
        } else {
            //console.log("No need to convert db on this device");
            callback(true);
        }
    },
    
    convertOldDb: function(callback) {
        app.oldStore = new WebSqlStore(
            function webSqlSuccess() {
                //console.log("webSQLSuccess");
                app.convertOldDbNoCloud(app.oldStore, function() {
                    //console.log("convertedOldDB no cloud");
                    app.convertOldDbCloudQueue(app.oldStore, function() {
                        //console.log("converted old db cloud queue");
                        callback(true);
                        
                    });
                });

            },
            function webSqlError(errorMessage) {
                alertDebug("Error: " + errorMessage);
                callback(false);
            },
            this
        );
    },
    
    checkConvertOldPhotos: function(callback) {
            //check converted photos
            if (Device.platform === "Android" || Device.platform === "iOS" || Device.platform === "WinPhone" || Device.platform === "Browser") {
                //console.log("Proper device, so converting photos");
                app.getSetting("convertedOldPhotos", false, function(convertedOldPhotos) {
                    //console.log("convertedOldPhotos: " + convertedOldPhotos);
                    if (convertedOldPhotos === false) {
                        app.convertOldPhotos(function(success) {
                            //console.log("convertOldPhotos success: " + success);
                            if (success === true) {
                                app.saveSetting("convertedOldPhotos", true);
                                //console.log("saved setting, converted old photos");
                            }
                            callback(success);
                        });   
                    } else {
                        //console.log("Already converted photos");
                        callback(true);
                    }
                });
            } else {
                //console.log("No need to convert photos on this device");
                callback(true);
            }  
    },
    
    convertOldPhotos: function(callback) {
        //console.log("[convertOldPhotos]");
        //console.log("[convertOldPhotos] finding blobs");
        app.store.findAllCloudBlobs(function(blobs) {
            //console.log("[convertOldPhotos] found blobs " + blobs.length);
          var l = blobs.length;
          var b;
          var total=0;
          //delete all the photos that have been queued to save space
          for (var i=0; i<l;i++) {
              //console.log("[convertOldPhotos] Check blob " + i);
              b = blobs[i];
              //console.log(b);
              if (b.data.indexOf("AddSessionPhoto") >= 0) {
                  total += b.data.length;
                  //console.log("[convertOldPhotos] deleteBlob: " + b.id);
                  app.store.deleteCloudBlobById(b.id, function(success) {
                      //console.log("[convertOldPhotos] delete blob success");
                  });   
              }
          }  
          
          var writeFile = function(myTimestamp, myFileName, mySession, myPhoto, myCallback) {
            var myBlob = FileIO.getBlobFromBase64(myPhoto);
            //console.log("[writeFile] Got Blob for " + mySession.sessionId);
            //console.log(myBlob);
            FileIO.writeBinaryFile(myBlob, myFileName, function(fileURI) {
                //console.log("[writeFile] Got Blob URI: " + fileURI);
                mySession.sessionPhoto = fileURI;
                   //overwrite old session 
                   app.store.addSession(mySession, function() {
                       //console.log("[writeFile] Session " + mySession.sessionId + " Saved with new URI " + mySession.sessionPhoto);
                        myCallback(true);
                   });
            });
          };
          
          //find all the sessions that have photos
          //read the photo base64
          //decode the base64 to binary
          //save the photo to filesystem
          //put the photo in camera roll
          //replace the session photo with the file URL
          //replace the old session with the new session
          //Queue the new session to the cloud
          app.store.findAllSessions(function(sessions) {
             //console.log("Founds " + sessions.length + " sessions");
             l = sessions.length;
             var s;
             var p;
             var binary;
             var path;
             var a;
             var ts;
             var fileName;
             var iMoved=0;
             for (i=0; i<l;i++) {
                 s = sessions[i];
                 p = s.sessionPhoto;
                //console.log(s);
                //console.log(p);
                if (p == "undefined" || p === undefined || p == "null" || p === null || p === "") {
                    //there is no photo so skip it
                    //console.log("[convertOldPhotos] no photo");
                    if (i === l-1) {
                            if (iMoved > 0) {
                                Toast.toastMini("Thanks for upgrading! Moved " + iMoved + " photos to device storage.");  
                            }
                            callback(true);
                        }
                } else {
                    if (p.indexOf("base64") === -1) {
                        //not base64, so skip it
                        //console.log("[convertOldPhotos] no base64 encoding");
                        if (i === l-1) {
                            if (iMoved > 0) {
                                Toast.toastMini("Thanks for upgrading! Moved " + iMoved + " photos to device storage.");  
                            }
                            callback(true);
                        }
                    } else {
                        //console.log("[convertOldPhotos] found photo");
                        ts = getTimestamp();
                        fileName = "sessionPhoto_" + ts + ".jpg";
                        iMoved++;
                        writeFile(ts, fileName, s, p, function() {
                            
                        });  
                        if (i === l-1) {
                            if (iMoved > 0) {
                                Toast.toastMini("Thanks for upgrading! Moved " + iMoved + " photos to device storage.");   
                            }
                            callback(true);
                        } 
                    }
                }
             }
             if (l === 0) {
                 callback(true);
             }
          });
        }); 
    },
    
    sessionPicUpdate: function(imageURI, callback) {
        //console.log("[SESSIONPIC] " + imageURI);
        var $elImg = $('#imgResultsImage');
        var $elA = $('#aResultsImage');
        var $elDiv = $('#imgResultsContainer');
        $elDiv.empty();
        $elImg.attr("data-imageURI", imageURI);
        FileIO.getFileURI(imageURI, function(fullPath) {
            //console.log("Got full path: " + fullPath);
            $elDiv.append('<a href="' + fullPath + '" title="Session Photo" id="aResultsImage"><img src="' + fullPath + '" id="imgResultsImage" height="240" width="320" style="" alt=""></a>');
            $elImg = $('#imgResultsImage');
            $elImg.nailthumb({
                                width: 320,
                                height: 240,
                                method: 'resize'
                            });
            $elA = $('#aResultsImage');
            $elDiv.show();
            $elA.swipebox();
        });        
    },
    
    // there was an error, message contains its cause
    sessionPicFail: function(message) {
        alertDebug("Failed because: " + message);
        //tempSessionPic=null;
    },
    
    toolPicSuccess: function(imageURI) {
      var fileName="ToolPic_" + getTimestamp() + ".jpg";
      FileIO.makeFilePersistent(imageURI, fileName, function(partialURI) {
        app.lastPhoto = partialURI;  
      });
    },
    
    // there was an error, message contains its cause
    toolPicFail: function(message) {
        alertDebug("[TOOLPIC]: Failed because: " + message);
        //tempSessionPic=null;
    },

    playerPicSuccess: function(imageData) {
        app.playerPhotoChanged = true;
        var $el = $('#imgPlayerImage');

        if (Device.platform === "FirefoxOS") {
            var elDom = document.getElementById("imgPlayerImage");
            var myLoad;

            myLoad = function() {
                elDom.removeEventListener('load', myLoad);
                var imgCanvas = document.createElement("canvas"),
                    imgContext = imgCanvas.getContext("2d");
                imgCanvas.width = elDom.width;
                imgCanvas.height = elDom.height;
                imgContext.drawImage(elDom, 0, 0, elDom.width, elDom.height);
                var imgAsDataURL = imgCanvas.toDataURL("image/png");
                $el.attr('src', imgAsDataURL).load();
            };

            elDom.addEventListener("load", myLoad, false);

            $el.attr('src', imageData).load();
        } else {
            $el.attr('src', "data:image/jpeg;base64," + imageData).load();
        }
        $el.nailthumb({
            width: 80,
            height: 80
        });
    },

    // there was an error, message contains its cause
    playerPicFail: function(message) {
        alertDebug("Failed because: " + message);

    },

    addFactionData: function(name, gameId, callback) {
        CloudLocal.queueFaction(name, gameId, function() {

        });
        var myFaction = new Faction(name, gameId);
        this.store.addFaction(myFaction, function() {
            if (callback !== undefined) {
                callback(myFaction);
            }
        });
    },

    addLocationData: function(name, callback) {
        //console.log("addLocationData");
        CloudLocal.queueLocation(name, function() {

        });
        var myLocation = new Location(name);
        this.store.addLocation(myLocation, function() {
            if (callback !== undefined) {
                callback(myLocation);
            }
        });
    },

    addTeamData: function(name, callback) {
        CloudLocal.queueTeam(name, function() {

        });
        var myTeam = new Team(name);
        this.store.addTeam(myTeam, function() {
            if (callback !== undefined) {
                callback(myTeam);
            }
        });
    },

    addPlayerData: function(player_id, player_name, player_icon, player_bggusername, player_twitter, player_hidden, photoChanged, callback) {
        //console.log("addPlayerData: " + player_name + ", " + player_icon);
        app.historyIsLoaded = false;
        var that = this;
        var changed = false;
        player_id = player_id.sanitize();
        
        app.findPlayerById(player_id, function(existingPlayer) {
            //console.log("existing player: ");
            //console.log(existingPlayer);
            
            if (existingPlayer) {
                if (existingPlayer.name !== player_name) {
                    changed = true;
                }
                if (existingPlayer.twitter !== player_twitter) {
                    changed = true;
                }
                if (existingPlayer.bggUsername !== player_bggusername) {
                    changed = true;
                }
                if (existingPlayer.iconURL !== player_icon) {
                    changed = true;
                }                
                if (photoChanged === true) {
                    changed = true;
                }
                
            } else {
                //new player
                changed = true;
                
            }
            
            if (changed === true) {
                //console.log("Player changed, queueing");
                CloudLocal.queuePlayer(player_id, player_name, player_icon, player_bggusername, player_twitter, photoChanged, function() {

                });
            } else {
                //console.log("Player didn't change.");
            }
            
            var myPlayer = new Player(player_id, player_bggusername, player_twitter, player_name, player_icon, player_hidden);

            var playerLower = player_icon.toLowerCase();
            if (playerLower.indexOf("http://") >= 0 && Device.platform !== "Browser") {
                var a = player_icon.split(".");
                var l = a.length;
                var ext = a[l - 1];
                //console.log("ext: " + ext);
    
                downloadImage(player_icon, "player" + player_id + '.' + ext, "ScoreGeek", function(fileURL) {
                    if (fileURL !== null) {
                        //console.log("Player File: " + fileURL.length);
                        myPlayer.icon = fileURL;
                    } else {
                        //console.log("NULL player file!");
                    }
                    app.addPlayer(myPlayer, function() {
                        //console.log("After store addplayer");
                        //console.log(callback);
                        if (callback !== undefined) {
                            //console.log("calling back");
                            callback(myPlayer);
                        }
                    });
                });
            } else {
                app.addPlayer(myPlayer, function() {
                    if (callback !== undefined) {
                        callback(myPlayer);
                    }
                });
            }
            
        });
        
    },

    installOnlineGame: function(callback) {
        //console.log("app.onlineGameToAdd:");
        //console.log(app.onlineGameToAdd);
        if (app.onlineGameToAdd !== null) {
            if ((app.onlineGameToAdd.name !== "") && (app.onlineGameToAdd.icon !== "") && (app.onlineGameToAdd.scoreType !== "")) {
                //console.log("not nothing");
                app.sanitizeGame(app.onlineGameToAdd.name, function(sanitized) {
                    //console.log("sanitized: " + sanitized);
                    app.onlineGameToAdd.advancedText = app.onlineGameToAdd.advancedText.replace(/&#39;/g, "'");
                    app.addGameData(sanitized, app.onlineGameToAdd.name, app.onlineGameToAdd.icon, "", app.onlineGameToAdd.scoreType, app.onlineGameToAdd.advancedText, app.onlineGameToAdd.bggId, app.onlineGameToAdd.version, false, false, function(myGame) {
                        //console.log("after add game data");
                        var l;
                        var i;
                        l = app.currGames.length;
                        for (i = 0; i < l; i++) {
                            if (app.currGames[i].id === sanitized) {
                                app.currGames.splice(i, 1);
                                break;
                            }
                        }
                        app.currGames.push(myGame);
                        app.currGames.sort(dynamicSort("name"));
                        app.writeGamesToPage("games", function() {
                            //console.log("from install");
                            Toast.toast('Game Installed');
                            callback();
                        });

                    });
                });
            } else {
                Toast.toast("Error adding game data");
                callback();
            }
        } else {
            Toast.toast("Error adding null game");
            callback();
        }
    },

    addGameData: function(game_id, game_name, game_icon, game_custom, game_scoreType, game_advanced, game_bggid, version, rounds, photoChanged, callback) {
        //console.log("Add game data");
        //console.log("game_id: " + game_id);
        //console.log("game_name: " + game_name);
        //console.log("game_icon: " + game_icon);
        //console.log("game_custom: " + game_custom);
        //console.log("game_scoreType: " + game_scoreType);
        //console.log("game_advanced: " + game_advanced);
        if (game_advanced === "") {
            switch (game_scoreType.toLowerCase()) {
                case "points":
                    game_advanced = "Name=Points|Type=Counter|Value=1|Default=0;";
                    break;
                case "tally":
                    game_advanced += "Name=Points|Type=Tally|Value=1|Default=0;";
                    break;
                case "hiddentally":
                    game_advanced += "Name=Points|Type=HiddenTally|Value=1|Default=0;";
                    break;
                case "winwose":
                    game_advanced = "Name=Win/Lose|Type=Toggle;";
                    break;
                case "areascontrolled":
                    game_advanced = "Name=Areas Controlled|Type=Counter|Value=1|Default=0;";
                    break;
            }
        }
        var lower;
        if (rounds === true) {
            lower = game_advanced;
            lower = lower.toLowerCase();
            if (lower.indexOf('pickrounds=true;') === -1) {
                game_advanced += "PickRounds=True;";
            }
        }
        //console.log("Sanitized: " + sanitized);
        game_id = app.sanitizeGame(game_id);
        var myGame = new Game(game_id, game_bggid, game_name, game_icon, game_scoreType, game_advanced, version);


        //console.log(myGame);
        //queueGame: function(gameId, gameName, gameImage, gameCustom, scoreType, advanced, gameBGGID, gameVersion, photoChanged, callback) {)
        CloudLocal.queueGame(game_id, game_name, game_icon, game_custom, game_scoreType, game_advanced, game_bggid, version, photoChanged, function() {
            //game_id, game_name, game_icon, game_custom, game_scoreType, game_advanced, game_bggid, version, rounds, callback) {
            //console.log("Cloud queued");
        });


        lower = game_icon.toLowerCase();
        //console.log("lower: " + lower);
        if (lower.indexOf("http://") >= 0 && Device.platform !== "Browser") {
            //console.log("getting icon");
            var a = game_icon.split(".");
            var l = a.length;
            var ext = a[l - 1];
            //console.log("ext: " + ext);

            downloadImage(game_icon, "game" + game_id + '.' + ext, "ScoreGeek", function(fileURL) {
                if (fileURL !== null) {
                    //console.log("Game File: " + fileURL);
                    myGame.icon = fileURL;
                } else {
                    //console.log("game file null!");
                }
                app.addGame(myGame, function() {
                    //console.log("after addgame before callback");
                    callback(myGame);
                });
            });
        } else {
            //console.log("add game normal");
            app.addGame(myGame, function() {
                callback(myGame);
            });
        }


    },

    pauseGame: function(callback) {
        //console.log("pause game");
        var l = app.currGameDetails.savedItems.length;
        var sId;
        var value;
        var now = getTimestamp();
        app.calculateScores(function() {
            for (var i = 0; i < l; i++) {
                sId = app.currGameDetails.savedItems[i].id;
                var $el = $('#' + sId);
                value = $el.val();
                app.currGameDetails.savedItems[i].value = value;
                //console.log("id: " + sId + " - Value: " + value);
            }
            app.currGameDetails.playDuration = now - app.playStart;
            app.currGameDetails.photo = app.lastPhoto;
            app.currGameDetails.notes = app.lastNotes;
            app.addPausedGame(app.currGameDetails, function() {
                callback();
            });
        });
    },

    addPausedGame: function(details, callback) {
        app.lastGamePausedAdd = getTimestamp();
        //console.log("setting app.lastGamePausedAdd: " + app.lastGamePausedAdd);
        this.store.addPaused(details, function() {
            callback(true);
        });
    },

    addSessionData: function(session_id, game_id, winner_id, winner_name, winner_points, game_name, game_custom, game_photo, game_notes, game_date, game_won, game_location, game_duration, callback) {
        //console.log("addSessionData");
        app.historyIsLoaded = false;
        //addSessionData = n(session_id, game_id, winner_id, winner_name, winner_points, game_name, game_custom, game_photo, game_notes, game_date, game_won, callback) {
        var mySession = new Session(session_id, game_id, game_date, game_notes, game_photo, game_won, game_location, game_duration);
        //= function(game_id, winner_id, game_custom, game_photo, game_notes, callback) {
            //console.log("mySession:");
            //console.log(mySession);
        CloudLocal.queueSession(session_id, game_id, winner_id, winner_name, winner_points, game_name, game_custom, game_photo, game_notes, game_date, game_won, game_location, game_duration, function() {
            //console.log("cloudqueuesession complete");
        });
        //addSessionData = fu(session_id, game_id, winner_id, winner_name, winner_points, game_name, game_custom, game_photo, game_notes, game_date, game_won, callback) {

        //console.log("about to add session: " + game_photo.length);

        this.store.addSession(mySession, function(success) {
            //console.log("After store add session");
            if (callback !== undefined) {
                //console.log("Calling back from session");
                callback();
            }
        });
        //addSessionData = functi(session_id, game_id, winner_id, winner_name, winner_points, game_name, game_custom, game_photo, game_notes, game_date, game_won, callback) {

    },

    editSessionData: function(session_id, winner_id, winner_name, winner_points, that, callback) {
        CloudLocal.queueEditSession(session_id, winner_id, winner_name, winner_points, function() {

        });
        this.store.editSessionData(session_id, winner_id, winner_name, winner_points, function() {
            if (callback !== undefined) {
                callback();
            }
        });
    },

    editScoreData: function(score_id, points, win, that, callback) {
        CloudLocal.queueEditScore(score_id, points, win, function() {

        });
        this.store.editScoreData(score_id, points, win, function() {
            if (callback !== undefined) {
                callback();
            }
        });
    },

    initAwards: function(callback) {
        app.currAwards = [];
        var myAward;
        myAward = new Award(0, "Total Games Played", "You scored $$VALUE$$ game$$S$$!", "img/awards/Award0.png");
        app.currAwards.push(myAward);
        myAward = new Award(1, "Game Top Score", "$$PLAYER$$ achieved a record score of $$VALUE$$ point$$S$$ in $$GAME$$! $$DATA2$$", "img/awards/Award1.png");
        app.currAwards.push(myAward);
        myAward = new Award(2, "Game Wins", "$$PLAYER$$ achieved a record of $$VALUE$$ win$$S$$ in $$GAME$$!", "img/awards/Award2.png");
        app.currAwards.push(myAward);
        myAward = new Award(3, "Game Plays", "$$PLAYER$$ has $$VALUE$$ game$$S$$ scored in $$GAME$$!", "img/awards/Award3.png");
        app.currAwards.push(myAward);
        myAward = new Award(4, "Game Score Upset", "$$PLAYER$$, who holds the high score in $$GAME$$, was defeated by $$PLAYER$$", "img/awards/Award4.png");
        app.currAwards.push(myAward);
        myAward = new Award(5, "Game Wins Upset", "$$DATA$$, who has the most wins in $$GAME$$, was defeated by $$PLAYER$$", "img/awards/Award5.png");
        app.currAwards.push(myAward);
        myAward = new Award(6, "Personal Best Score", "$$PLAYER$$ achieved a personal best score of $$VALUE$$ in $$GAME$$! $$DATA2$$", "img/awards/Award6.png");
        app.currAwards.push(myAward);
        myAward = new Award(7, "Personal Wins", "$$PLAYER$$ won $$GAME$$ $$VALUE$$ time$$S$$!", "img/awards/Award7.png");
        app.currAwards.push(myAward);
        myAward = new Award(8, "Personal Plays", "$$PLAYER$$ played $$GAME$$ $$VALUE$$ time$$S$$!", "img/awards/Award8.png");
        app.currAwards.push(myAward);
        myAward = new Award(9, "Game Winning Streak", "$$PLAYER$$ won $$GAME$$ $$VALUE$$ times in a row!", "img/awards/Award9.png");
        app.currAwards.push(myAward);
        myAward = new Award(10, "Meta Winning Streak", "$$PLAYER$$ won $$VALUE$$ games in a row!", "img/awards/Award10.png");
        app.currAwards.push(myAward);
        myAward = new Award(11, "Meta Game Wins", "$$PLAYER$$ won $$VALUE$$ game$$S$$!", "img/awards/Award11.png");
        app.currAwards.push(myAward);
        myAward = new Award(12, "Biggest Game Winning Streak", "$$PLAYER$$ has the longest winning streak of $$VALUE$$ win$$S$$ in $$GAME$$!", "img/awards/Award12.png");
        app.currAwards.push(myAward);
        myAward = new Award(13, "Biggest Meta Winning Streak", "$$PLAYER$$ has the longest winning streak of $$VALUE$$ in all games!", "img/awards/Award13.png");
        app.currAwards.push(myAward);
        //app.currAwards = awards;
        callback();
    },

    initAvatars: function(callback) {
        var a;
        a = new Avatar(29, "Banjo");
        app.avatars.push(a);
        a = new Avatar(30, "Terminator");
        app.avatars.push(a);
        a = new Avatar(31, "Bows");
        app.avatars.push(a);
        a = new Avatar(32, "Drunk");
        app.avatars.push(a);
        a = new Avatar(33, "Jack-o-cat");
        app.avatars.push(a);
        a = new Avatar(34, "Top Hat");
        app.avatars.push(a);
        a = new Avatar(35, "Vader");
        app.avatars.push(a);
        a = new Avatar(36, "Tree");
        app.avatars.push(a);
        a = new Avatar(37, "Yarn");
        app.avatars.push(a);
        a = new Avatar(38, "Boxer");
        app.avatars.push(a);
        a = new Avatar(39, "Grrr");
        app.avatars.push(a);
        a = new Avatar(40, "Potter");
        app.avatars.push(a);
        a = new Avatar(41, "Yowl");
        app.avatars.push(a);
        a = new Avatar(42, "Snowman");
        app.avatars.push(a);
        a = new Avatar(43, "Skullcat");
        app.avatars.push(a);
        a = new Avatar(44, "Frankenstein");
        app.avatars.push(a);
        a = new Avatar(45, "Big Eyes");
        app.avatars.push(a);
        a = new Avatar(46, "Batcat");
        app.avatars.push(a);
        a = new Avatar(47, "Candy");
        app.avatars.push(a);
        a = new Avatar(48, "Cheers");
        app.avatars.push(a);
        a = new Avatar(49, "Fancy");
        app.avatars.push(a);
        a = new Avatar(50, "Elvis");
        app.avatars.push(a);
        a = new Avatar(51, "Wrinkles");
        app.avatars.push(a);
        a = new Avatar(52, "Love");
        app.avatars.push(a);
        a = new Avatar(53, "Awww");
        app.avatars.push(a);
        a = new Avatar(54, "Old Chap");
        app.avatars.push(a);
        a = new Avatar(55, "Present");
        app.avatars.push(a);
        a = new Avatar(56, "Wriggly");
        app.avatars.push(a);
        a = new Avatar(57, "Flexible");
        app.avatars.push(a);
        a = new Avatar(58, "Poo");
        app.avatars.push(a);
        a = new Avatar(59, "Wreath");
        app.avatars.push(a);
        a = new Avatar(60, "Elton");
        app.avatars.push(a);
        a = new Avatar(61, "Ghostcat");
        app.avatars.push(a);
        a = new Avatar(62, "Cupidcat");
        app.avatars.push(a);
        a = new Avatar(63, "Angry");
        app.avatars.push(a);
        a = new Avatar(64, "Poodle");
        app.avatars.push(a);
        a = new Avatar(65, "Smiley");
        app.avatars.push(a);
        a = new Avatar(66, "Birdcat");
        app.avatars.push(a);
        a = new Avatar(67, "Boxcat");
        app.avatars.push(a);
        a = new Avatar(68, "Fluff");
        app.avatars.push(a);
        a = new Avatar(69, "Boozy");
        app.avatars.push(a);
        a = new Avatar(70, "Sherlock");
        app.avatars.push(a);
        a = new Avatar(71, "Jack");
        app.avatars.push(a);
        a = new Avatar(72, "Dancer");
        app.avatars.push(a);
        a = new Avatar(73, "Yum");
        app.avatars.push(a);
        a = new Avatar(74, "Sadcat");
        app.avatars.push(a);
        a = new Avatar(75, "Diva");
        app.avatars.push(a);
        a = new Avatar(76, "Bernard");
        app.avatars.push(a);
        a = new Avatar(77, "Ouch");
        app.avatars.push(a);
        a = new Avatar(78, "Hiss");
        app.avatars.push(a);
        a = new Avatar(79, "Rudolph");
        app.avatars.push(a);
        a = new Avatar(80, "Frosty");
        app.avatars.push(a);
        a = new Avatar(81, "Xmax");
        app.avatars.push(a);
        a = new Avatar(82, "Santa");
        app.avatars.push(a);
        callback();
    },

    doAwards: function(details, callback) {
        //console.log("doAwards");
        var gameSessions = [];
        var gameScores = [];
        var gameAwards = [];
        var i;
        var j;
        var l;
        var m;
        var gameId = details.game.id;
        //console.log("Do awards for session: " + details.id);
        $.mobile.loading('show', {
            text: 'Calculating Achievements',
            textVisible: true,
            theme: 'a',
            html: ""
        });
        app.findAllSessions(function(sessions) {
            //console.log("All Sessions: ");
            //console.log(sessions);
            l = sessions.length;
            sessions.sort(dynamicSort("-sessionId"));
            for (i = 0; i < l; i++) {
                if (sessions[i].gameId === gameId) {
                    gameSessions.push(sessions[i]);
                }
            }
            app.findAllAwardsEarned(function(awards) {
                //console.log("All Awards");
                //console.log(awards);
                l = awards.length;
                for (i = 0; i < l; i++) {
                    if (awards[i].gameId === gameId) {
                        gameAwards.push(awards[i]);
                    }
                }
                app.findAllScores(function(scores) {
                    l = gameSessions.length;
                    for (i = 0; i < l; i++) {
                        m = scores.length;
                        for (j = 0; j < m; j++) {
                            if (scores[j].sessionId === gameSessions[i].sessionId) {
                                gameScores.push(scores[j]);
                            }
                        }
                    }
                    //console.log("Game Arrays");
                    //console.log(gameSessions);
                    //console.log(gameAwards);
                    //console.log(gameScores);

                    app.doAward0(details, sessions, function() {
                        app.doAward1(details, gameAwards, function() {
                            app.doAward2(details, gameAwards, gameScores, function() {
                                app.doAward3(details, gameScores, function() {
                                    app.doAward4(function() {
                                        app.doAward5(function() {
                                            app.doAward6(details, gameAwards, function() {
                                                app.doAward7(details, gameScores, function() {
                                                    app.doAward8(details, gameScores, function() {
                                                        app.doAward9(details, gameSessions, gameScores, function(gameStreaks) {
                                                            app.doAward10(details, sessions, scores, function(metaStreaks) {
                                                                app.doAward11(details, scores, function() {
                                                                    app.doAward12(details, gameStreaks, gameAwards, function() {
                                                                        app.doAward13(details, metaStreaks, gameAwards, function() {
                                                                            //console.log("callback from 13");
                                                                            $.mobile.loading('hide');
                                                                            callback();
                                                                        });
                                                                    });
                                                                });
                                                            });
                                                        });
                                                    });
                                                });
                                            });
                                        });
                                    });
                                });
                            });
                        });
                    });
                });
            });
        });


    },

    importGame: function(importText, callback) {
        var $elTextNewGameName = $('#textNewGameName');
        var $elBGGID = $('#textBGGID');
        var $elSelectNewGameScoring = $('#selectNewGameScoring');
        var $elAdvancedText = $('#advancedText');
        var $elAdvancedTextField = $('#advancedTextField');
        var $elMultipleRounds = $('#multipleRounds');
        var $elImgGameImage = $('#imgGameImage');
        var sVal = "";
        var $elRounds = $('#flip-rounds');
        var $elScore = $('#flip-score');
        var myGame;

        //console.log("Before parse");
        //console.log($elTextareaImportGame.val());

        var objGame;
        objGame = $.parseJSON(importText);
        //console.log(objGame);
        
        if (objGame) {
            myGame = new Game('', objGame.bggId, objGame.gameName, objGame.gameImage, objGame.scoring, objGame.advanced, 1);

            //$elMultipleRounds.val(objGame.multiRound);
            //$elMultipleRounds.flipswitch('refresh');
            
        }
        //console.log(myGame);
        callback(myGame);
    },

    doAddAward: function(awardId, value, gameId, playerId, sessionId, playDate, data, callback) {
        //console.log("doAddAward");
        app.historyIsLoaded = false;
        var earnedId = getTimestamp();
        Globals.globalSeed = Globals.globalSeed + 1000;
        earnedId = earnedId + Globals.globalSeed;
        var myEarned = new AwardEarned(earnedId, awardId, value, gameId, playerId, sessionId, playDate, data);
        CloudLocal.queueAward(earnedId, awardId, value, gameId, "true", "", "", sessionId, "", playerId, data, playDate, "", function() {

        });
        this.store.addAwardEarned(myEarned, function() {
            //console.log("after store add award");
            callback();
        });
    },

    doAward0: function(details, sessions, callback) {
        //console.log("doAward0: Games Played");
        var l = sessions.length;
        //console.log(l);
        if (l % 5 === 0) {
            //console.log("yes");
            var i = (l / 5);
            //console.log("Avatars unlcoked: " + i);
            app.saveSetting("avatarsUnlocked", i, function() {
                if (i <= 82) {
                    Toast.toast("You unlocked a new avatar!");
                }

                app.doAddAward(0, l, "", "", details.id, details.playDate, "", function() {
                    callback();
                });
            });
        } else {
            //console.log("no");
            callback();
        }
    },

    doAward1: function(details, gameAwards, callback) {
        //console.log("doAward1: Game High Score");
        //console.log(details);
        var l = gameAwards.length;
        var prevHighScore = 0;
        var winnerScore = 0;
        var p;
        
        if (details.lowPointsWin === true) {
            prevHighScore = 999999999;
        }
        
        for (var i = 0; i < l; i++) {
            if (gameAwards[i].awardId == 1) {
                if (details.lowPointsWin === true) {
                    if (parseFloat(gameAwards[i].awardValue, 10) < prevHighScore) {
                        prevHighScore = parseFloat(gameAwards[i].awardValue, 10);
                    }
                } else {
                    if (parseFloat(gameAwards[i].awardValue, 10) > prevHighScore) {
                        prevHighScore = parseFloat(gameAwards[i].awardValue, 10);
                    }   
                }
            }
        }
        l = details.players.length;
        for (var j = 0; j < l; j++) {
            p = details.players[j];
            if (p.winner === true || p.winner == "true" || p.winner == -1 || p.winner == "-1") {
                winnerScore = parseFloat(p.points, 10);
                //console.log("Winner Score: " + winnerScore + " PrevHighScore: " + prevHighScore);
                if (details.lowPointsWin === true) {
                    if (winnerScore < prevHighScore) {
                        if (prevHighScore === 999999999) {
                            prevHighScore = 0;
                        }
                        app.doAddAward(1, winnerScore, details.game.id, p.player.id, details.id, details.playDate, prevHighScore, function() {
                            if (j === l - 1) {
                                //console.log("Callback1");
                                callback();
                            }
                        });
                    } else {
                        if (j === l - 1) {
                            //console.log("Callback2");
                            callback();
                        }
                    }
                } else {
                    if (winnerScore > prevHighScore) {
                        app.doAddAward(1, winnerScore, details.game.id, p.player.id, details.id, details.playDate, prevHighScore, function() {
                            if (j === l - 1) {
                                //console.log("Callback1");
                                callback();
                            }
                        });
                    } else {
                        if (j === l - 1) {
                            //console.log("Callback2");
                            callback();
                        }
                    }
                }
            } else {
                if (j === l - 1) {
                    //console.log("Callback3");
                    callback();
                }
            }
        }
    },

    doAward2: function(details, gameAwards, gameScores, callback) {
        //console.log("doAward2: Game Most Wins");
        var i;
        var j;
        var l;
        var m;
        var k;
        var wins = 0;
        var plays = 0;
        var prevHighScore = 0;
        var winnerScore = 0;
        var p;
        var s;
        l = gameAwards.length;
        for (i = 0; i < l; i++) {
            if (gameAwards[i].awardId == 2) {
                if (parseFloat(gameAwards[i].awardValue, 10) > prevHighScore) {
                    prevHighScore = parseFloat(gameAwards[i].awardValue, 10);
                }
            }

        }

        //console.log("prevHighScore: " + prevHighScore);

        l = details.players.length;
        for (j = 0; j < l; j++) {
            wins = 0;
            p = details.players[j];
            //console.log("player:");
            //console.log(p);
            if (p.winner === true || p.winner == "true" || p.winner == -1 || p.winner == "-1") {
                //console.log("Winner");
                m = gameScores.length;
                for (k = 0; k < m; k++) {
                    s = gameScores[k];
                    //console.log(s.playerId + " === " + p.player.id + " && " + s.win + "==true");
                    if (s.playerId == p.player.id && (s.win === true || s.win == "true" || s.win == -1 || s.win == "-1")) {
                        //console.log("Wins++");
                        wins++;
                    }
                }
                winnerScore = wins;
                //console.log("Winner Score: " + winnerScore + " PrevHighScore: " + prevHighScore);
                if (winnerScore > prevHighScore) {

                    app.doAddAward(2, winnerScore, details.game.id, p.player.id, details.id, details.playDate, prevHighScore, function() {
                        //console.log("Added award 2");
                        if (j === l - 1) {
                            //console.log("Callback1");
                            callback();
                        }
                    });
                } else {
                    //console.log("not high enough");
                    if (j === l - 1) {
                        //console.log("Callback2");
                        callback();
                    }
                }
            } else {
                //console.log("not winner");
                if (j === l - 1) {
                    //console.log("Callback3");
                    callback();
                }
            }
        }
    },

    doAward3: function(details, gameScores, callback) {
        //console.log("doAward3: Game Plays");
        var i;
        var j;
        var l;
        var m;
        var k;
        var plays = 0;
        var winnerScore;
        var p;
        var s;

        l = details.players.length;
        for (j = 0; j < l; j++) {
            plays = 0;
            p = details.players[j];

            m = gameScores.length;
            for (k = 0; k < m; k++) {
                s = gameScores[k];
                if (s.playerId === p.id) {
                    plays++;
                }
            }
            winnerScore = plays;
            //console.log("Winner Score: " + winnerScore);
            if (winnerScore % 5 === 0 && winnerScore > 0) {
                app.doAddAward(3, winnerScore, details.game.id, p.player.id, details.id, details.playDate, "", j, l, function() {
                    //console.log("j" + j + "l" + l);
                    if (j === l - 1) {
                        //console.log("Callback1");
                        callback();
                    }
                });
            } else {
                if (j === l - 1) {
                    //console.log("Callback2");
                    callback();
                }
            }

        }
    },

    doAward4: function(callback) {
        //console.log("doAward4: Game Score Upset");
        callback();
    },

    doAward5: function(callback) {
        //console.log("doAward5: Game Wins Upset");
        callback();
    },

    doAward6: function(details, gameAwards, callback) {
        //console.log("doAward6: Personal High Score");
        var l;
        var j;
        var m;
        var prevHighScore = 0;
        var winnerScore = 0;
        var p;

        if (details.lowPointsWin === true) {
            prevHighScore = 999999999;
        }

        l = details.players.length;

        for (var i = 0; i < l; i++) {
            p = details.players[i];



            winnerScore = parseFloat(p.points, 10);
            m = gameAwards.length;
            for (j = 0; j < m; j++) {
                if (gameAwards[j].awardId == 6 && gameAwards[j].playerId == p.player.id) {
                    if (details.lowPointsWin === true) {
                        if (parseFloat(gameAwards[j].awardValue, 10) < prevHighScore) {
                            prevHighScore = parseFloat(gameAwards[j].awardValue, 10);
                        }
                    } else {
                        if (parseFloat(gameAwards[j].awardValue, 10) > prevHighScore) {
                            prevHighScore = parseFloat(gameAwards[j].awardValue, 10);
                        }   
                    }
                }
            }
            //console.log("Winner Score: " + winnerScore + " PrevHighScore: " + prevHighScore);
            
            if (details.lowPointsWin === true) {
                if (winnerScore < prevHighScore) {
                    if (prevHighScore === 999999999) {
                        prevHighScore = 0;
                    }
                    app.doAddAward(6, winnerScore, details.game.id, p.player.id, details.id, details.playDate, prevHighScore, function() {
                        if (i === l - 1) {
                            //console.log("Callback1");
                            callback();
                        }
                    });
                } else {
                    if (i === l - 1) {
                        //console.log("Callback2");
                        callback();
                    }
                }
            } else {
                if (winnerScore > prevHighScore) {
                    app.doAddAward(6, winnerScore, details.game.id, p.player.id, details.id, details.playDate, prevHighScore, function() {
                        if (i === l - 1) {
                            //console.log("Callback1");
                            callback();
                        }
                    });
                } else {
                    if (i === l - 1) {
                        //console.log("Callback2");
                        callback();
                    }
                }
            }
            
            
        }
        if (l === 0) {
            //console.log("Callback3");
            callback();
        }
    },

    doAward7: function(details, gameScores, callback) {
        //console.log("doAward7: Personal Wins");
        var l;
        var m;
        var j;
        var prevHighScore = 0;
        var winnerScore = 0;
        var p;
        var scores;
        var score;
        l = details.players.length;

        for (var i = 0; i < l; i++) {
            winnerScore = 0;
            prevHighScore = 0;
            p = details.players[i];
            //console.log(p);
            if (p.winner === true || p.winner == "true" || p.winner == -1 || p.winner == "-1") {
                //console.log("winner = true");
                m = gameScores.length;
                for (j = 0; j < m; j++) {
                    score = gameScores[j];
                    if (score.playerId == p.player.id && (score.win === true || score.win == "true" || score.win == -1 || score.win == "-1")) {
                        winnerScore++;
                    }
                }


                //console.log("Winner Score: " + winnerScore + " PrevHighScore: " + prevHighScore);
                if (winnerScore > 0 && winnerScore % 5 === 0) {
                    app.doAddAward(7, winnerScore, details.game.id, p.player.id, details.id, details.playDate, "", function() {
                        if (i === l - 1) {
                            //console.log("Callback1");
                            callback();
                        }
                    });
                } else {
                    if (i === l - 1) {
                        //console.log("Callback2");
                        callback();
                    }
                }
            } else {
                if (i === l - 1) {
                    //console.log("Callback2");
                    callback();
                }
            }
        }
        if (l === 0) {
            //console.log("Callback3");
            callback();
        }
    },

    doAward8: function(details, gameScores, callback) {
        //console.log("doAward8: Personal Plays");
        var j;
        var l;
        var m;
        var prevHighScore = 0;
        var winnerScore = 0;
        var p;
        var scores;
        var score;
        l = details.players.length;

        for (var i = 0; i < l; i++) {
            winnerScore = 0;
            prevHighScore = 0;
            p = details.players[i];
            m = gameScores.length;
            for (j = 0; j < m; j++) {
                score = gameScores[j];
                if (score.playerId == p.player.id) {
                    winnerScore++;
                }
            }


            //console.log("Winner Score: " + winnerScore + " PrevHighScore: " + prevHighScore);
            if (winnerScore > 0 && winnerScore % 5 === 0) {
                app.doAddAward(8, winnerScore, details.game.id, p.player.id, details.id, details.playDate, "", function() {
                    if (i === l - 1) {
                        //console.log("Callback1");
                        callback();
                    }
                });
            } else {
                if (i === l - 1) {
                    //console.log("Callback2");
                    callback();
                }
            }
        }
        if (l === 0) {
            //console.log("Callback3");
            callback();
        }
    },

    doAward9: function(details, gameSessions, gameScores, callback) {
        //console.log("doAward9: Game Winning Streak");
        var i;
        var l;
        var j;
        var m;
        var k;
        var n;
        var streak;
        var winner;
        var session;
        var score;
        var doBreak;
        var streaks = [];
        var winners = [];
        //console.log("app.current session");
        //console.log(details.id);
        winners = details.winners;
        l = winners.length;
        //console.log("winners: ");
        //console.log(winners);
        for (i = 0; i < l; i++) {
            streak = 0;
            doBreak = false;
            winner = winners[i];
            //console.log("winner");
            //console.log(winner);
            m = gameSessions.length;
            //console.log("GameSessions length: " + m);
            for (j = 0; j < m; j++) {
                session = gameSessions[j];
                //console.log("session");
                //console.log(session);
                n = gameScores.length;
                //console.log("GameScores length; " + n);
                for (k = 0; k < n; k++) {
                    score = gameScores[k];
                    //console.log(session.sessionId + " === " + score.sessionId);
                    if (session.sessionId == score.sessionId) {
                        //console.log(score.playerId + " === " + winner.player.id);
                        if (score.playerId == winner.player.id) {
                            //console.log(score.win + " === true");
                            if (score.win === true || score.win == "true" || score.win == -1 || score.win == "-1") {
                                //console.log("Streak++");
                                streak++;
                                //console.log(streak);
                            } else {
                                //console.log("Break streak");
                                doBreak = true;
                                break;
                            }
                        }
                    }
                }
                if (doBreak === true) {
                    break;
                }
            }
            //console.log("streak: " + streak);
            if (streak > 1) {
                var myStreak = new Score("", "", winner.player.id, streak);
                streaks.push(myStreak);
                //console.log("Add award streak " + streak);
                app.doAddAward(9, streak, details.game.id, winner.player.id, details.id, details.playDate, "", function() {});
            }
            if (i === l - 1) {
                //console.log("Callback1");
                callback(streaks);
            }
        }
        if (l === 0) {
            //console.log("callback2");
            callback(streaks);
        }

    },

    doAward10: function(details, sessions, scores, callback) {
        //console.log("doAward10: Meta Winning Streak");
        var i;
        var l;
        var j;
        var m;
        var k;
        var n;
        var o;
        var p;
        var streak;
        var winner;
        var session;
        var score;
        var doBreak;
        var gameIds = [];
        var streaks = [];
        var myStreak;
        var winners = [];
        winners = details.winners;
        l = winners.length;
        for (i = 0; i < l; i++) {
            gameIds = [];
            streak = 0;
            doBreak = false;
            winner = winners[i];
            //console.log("winner");
            //console.log(winner);
            m = sessions.length;
            for (j = 0; j < m; j++) {
                session = sessions[j];
                if (gameIds.indexOf(session.gameId) === -1) {
                    gameIds.push(session.gameId);
                }
                //console.log("session");
                //console.log(session);
                n = scores.length;
                doBreak = true;
                for (k = 0; k < n; k++) {
                    score = scores[k];
                    if (score.sessionId == session.sessionId) {
                        //console.log(score.playerId + " === " + winner.player.id);
                        if (score.playerId == winner.player.id) {
                            if (score.win === true || score.win == "true" || score.win == -1 || score.win == "-1") {
                                streak++;
                                doBreak = false;
                                //console.log("streak++");
                            } else {
                                doBreak = true;
                                break;
                            }
                        }
                    }
                }
                if (doBreak === true) {
                    break;
                }
            }

            //console.log("gameIds: " + gameIds.length);
            //console.log("streak:" + streak);
            if (streak > 1 && gameIds.length > 1) {
                //console.log("streak winner");
                //console.log(winner);
                myStreak = new Score("", "", winner.player.id, streak);
                streaks.push(myStreak);
                //console.log("Add award meta streak " + streak);
                app.doAddAward(10, streak, "", winner.player.id, details.id, details.playDate, "", function() {});
            }
            if (i === l - 1) {
                //console.log("Callback1");
                callback(streaks);
            }
        }
        if (l === 0) {
            //console.log("callback2");
            callback(streaks);
        }
    },

    doAward11: function(details, scores, callback) {
        //console.log("doAward11: Meta Game Wins");
        var j;
        var l;
        var m;
        var prevHighScore = 0;
        var winnerScore = 0;
        var p;
        var score;
        l = details.players.length;

        for (var i = 0; i < l; i++) {
            winnerScore = 0;
            prevHighScore = 0;
            p = details.players[i];
            if (p.winner === true || p.winner == "true" || p.winner == "-1" || p.winner == -1) {


                m = scores.length;
                for (j = 0; j < m; j++) {
                    score = scores[j];
                    if (score.playerId == p.player.id && (score.win === true || score.win == "true" || score.win == -1 || score.win == "-1")) {
                        winnerScore++;
                    }
                }


                //console.log("Winner Score: " + winnerScore + " PrevHighScore: " + prevHighScore);
                if (winnerScore > 0 && winnerScore % 5 === 0) {
                    app.doAddAward(11, winnerScore, "", p.player.id, details.id, details.playDate, "", function() {
                        if (i === l - 1) {
                            //console.log("Callback1");
                            callback();
                        }
                    });
                } else {
                    if (i === l - 1) {
                        //console.log("Callback2");
                        callback();
                    }
                }
            } else {
                if (i === l - 1) {
                    //console.log("Callback2");
                    callback();
                }
            }
        }
        if (l === 0) {
            //console.log("Callback3");
            callback();
        }
    },

    doAward12: function(details, streaks, gameAwards, callback) {
        //console.log("doAward12: Biggest Game Winning Streak");
        //console.log("streaks:");
        //console.log(streaks);
        var j;
        var l;
        var m;
        var prevHighScore = 0;
        var winnerScore = 0;
        var s;

        l = streaks.length;

        for (var i = 0; i < l; i++) {
            s = streaks[i]; //Score object
            winnerScore = s.points;
            m = gameAwards.length;
            for (j = 0; j < m; j++) {
                if (gameAwards[j].awardId == 9) {
                    if (parseFloat(gameAwards[j].awardValue, 10) > prevHighScore) {
                        prevHighScore = parseFloat(gameAwards[j].awardValue, 10);
                    }
                }
            }
            //console.log("Winner Score: " + winnerScore + " PrevHighScore: " + prevHighScore);
            if (winnerScore > prevHighScore) {
                //console.log("Add award player" + s.playerId);
                //console.log(s);
                app.doAddAward(12, winnerScore, details.game.id, s.playerId, details.id, details.playDate, prevHighScore, function() {
                    if (i === l - 1) {
                        //console.log("Callback1");
                        callback();
                    }
                });
            } else {
                if (i === l - 1) {
                    //console.log("Callback2");
                    callback();
                }
            }
        }
        if (l === 0) {
            //console.log("Callback3");
            callback();
        }
    },

    doAward13: function(details, streaks, awards, callback) {
        //console.log("doAward13: Biggest Meta Winning Streak");
        //console.log("streaks:");
        //console.log(streaks);
        var j;
        var l;
        var m;
        var prevHighScore = 0;
        var winnerScore = 0;
        var s;

        l = streaks.length;

        for (var i = 0; i < l; i++) {
            s = streaks[i]; //Score object
            winnerScore = s.points;
            m = awards.length;
            for (j = 0; j < m; j++) {
                if (awards[j].awardId == 10) {
                    if (parseFloat(awards[j].awardValue, 10) > prevHighScore) {
                        prevHighScore = parseFloat(awards[j].awardValue, 10);
                    }
                }
            }
            //console.log("Winner Score: " + winnerScore + " PrevHighScore: " + prevHighScore);
            if (winnerScore > prevHighScore) {
                app.doAddAward(13, winnerScore, details.game.id, s.playerId, details.id, details.playDate, prevHighScore, function() {
                    if (i === l - 1) {
                        //console.log("Callback1");
                        callback();
                    }
                });
            } else {
                if (i === l - 1) {
                    //console.log("Callback2");
                    callback();
                }
            }
        }
        if (l === 0) {
            //console.log("Callback3");
            callback();
        }
    },

    addScoreData: function(session_id, callback) {
        //console.log("addScoreData");
        app.historyIsLoaded = false;
        app.globalSessionId = session_id;
        //console.log("got session id: " + session_id);
        var score_id = getTimestamp();
        var l = app.currGameDetails.players.length;

        for (var i = 0; i < l; i++) {
            //console.log("Add score data " + i);
            Globals.globalSeed = Globals.globalSeed + 10000;
            score_id = score_id + Globals.globalSeed;
            var p = app.currGameDetails.players[i];

            app.addPlayerScoreData(score_id, session_id, p.player.id, p.points, p.winner, p.color, p.team, p.faction, p.position, function() {
                //console.log("callback from apsd " + i + " " + p);
                if (i === (l - 1)) {
                    //console.log("call back?");
                    if (callback !== undefined) {
                        //console.log("done adding scores");
                        callback();
                    }
                }
            });
        }
    },

    addPlayerScoreData: function(score_id, session_id, player_id, points, winner, color, team, faction, position, callback) {
        //console.log("Add player score");
        app.historyIsLoaded = false;
        CloudLocal.queueScore(score_id, session_id, player_id, points, winner, color, team, faction, position, function() {

        });
        var myScore = new Score(score_id, session_id, player_id, parseFloat(points), winner, color, team, faction, position);
        this.store.addScore(myScore, function() {
            if (callback !== undefined) {
                callback();
            }
        });
    },

    resetAch: function(callback) {
        app.bPostBGG = true;
        app.bStat0 = false;
        app.bStat1 = false;
        app.bStat2 = false;
        app.bStat3 = false;
        app.bStat4 = false;
        app.bStat5 = false;
        app.bStat6 = false;
        app.bStat7 = false;
        app.bStat8 = false;
        app.bStat9 = false;
        app.bStat10 = false;
        app.bStat11 = false;
        app.bStat12 = false;
        app.bStat13 = false;
        if (callback !== undefined) {
            callback(); //callback to addAch
        }
    },

    addAch: function(session_id, callback) {
        //console.log("Ach");
        this.store.addAch(session_id, function() {
            callback();
        });
    },

    addGame: function(game, callback) {
        app.lastGameAdd = getTimestamp();
        this.store.addGame(game, function() {
            callback();
        });
    },

    addPlayer: function(player, callback) {
        //console.log("[addPlayer]");
        app.lastPlayerAdd = getTimestamp();
        this.store.addPlayer(player, function() {
            callback();
        });
    },

    addImage: function(id, base64Image, callback) {
        this.store.addImage(id, base64Image, function() {
            callback();
        });
    },

    trackAward: function(id, session_id, callback) {
        switch (id) {
            case 0:
                app.bStat0 = true;
                break;
            case 1:
                app.bStat1 = true;
                break;
            case 2:
                app.bStat2 = true;
                break;
            case 3:
                app.bStat3 = true;
                break;
            case 4:
                app.bStat4 = true;
                break;
            case 5:
                app.bStat5 = true;
                break;
            case 6:
                app.bStat6 = true;
                break;
            case 7:
                app.bStat7 = true;
                break;
            case 8:
                app.bStat8 = true;
                break;
            case 9:
                app.bStat9 = true;
                break;
            case 10:
                app.bStat10 = true;
                break;
            case 11:
                app.bStat11 = true;
                break;
            case 12:
                app.bStat12 = true;
                break;
            case 13:
                app.bStat13 = true;
                break;
        }
        if (callback !== undefined) {
            callback(session_id);
        }
    },

    deletePlayerById: function(player_id, callback) {
        CloudLocal.queueDelPlayer(player_id, function() {

        });
        this.store.deletePlayerById(player_id, function() {
            if (callback !== undefined) {
                callback();
            }
        });
    },

    deleteGameById: function(game_id, callback) {
        CloudLocal.queueDelGame(game_id, function() {

        });
        this.store.deleteGameById(game_id, function() {
            if (callback !== undefined) {
                callback();
            }
        });
    },

    deletePausedGameById: function(id, callback) {
        app.lastGamePausedAdd = getTimestamp();
        //console.log("setting app.lastGamePausedAdd: " + app.lastGamePausedAdd);
        
        this.store.deletePausedById(id, function() {
            if (callback !== undefined) {
                callback();
            }
        });
    },

    deleteHistoryById: function(sessionId, callback) {
        //console.log("DELETE " + sessionId);
        app.historyIsLoaded = false;
        CloudLocal.queueDelSession(sessionId, function() {

        });
        app.store.deleteSessionBySessionId(sessionId, function() {
            app.store.deleteScoresBySessionId(sessionId, function() {
                app.store.deleteAwardsEarnedBySessionId(sessionId, function() {
                    if (callback !== undefined) {
                        callback(true);
                    }
                });
            });
        });
    },

    findGameById: function(id, callback) {
        //console.log("Find game by id");
        this.store.findGameById(id, function(game) {
            //console.log(game);
            callback(game);
        });
    },

    findBGGID: function(gameName, callback) {

        var online = Internet.isOnline();
        if (online) {

            if (gameName !== "") {
                gameName = gameName.replace(/ /g, '+');
                //console.log("gameName: " + gameName);
                var dataString = "gameName=" + encodeURIComponent(gameName);
                Internet.getURLSource("https://rebrandcloud.secure.omnis.com/extras/geekbggid.asp", dataString, true, function(data) {
                    if (data) {
                        //console.log(data);
                        var myXML = data.searchXML;
                        myXML = myXML.replace(/&quot;/g, "");
                        var dom = parseXml(myXML);
                        var json = xml2json(dom);
                        json = json.replace('undefined"items', '"items');
                        json = json.replace(/@/g, "");
                        var jsonObj = $.parseJSON(json);
                        if (jsonObj.items.item !== null && jsonObj.items.item !== undefined) {
                            callback(jsonObj.items.item);
                        } else {
                            callback(null);
                        }
                    } else {
                        callback(null);
                    }
                });
                // $.ajax({
                // url: "https://rebrandcloud.secure.omnis.com/extras/geekbggid.asp",
                // data: "gameName=" + gameName,
                // crossDomain: true,
                // dataType: "jsonp"
                // })
                // .done(function (data) {
                // //console.log("done");
                // //console.log(data);
                // //function Cloud(Globals.appId, cloudIdRemote, cloudIdLocal, cloudData, username, password, encoding, cloudDataId, cloudHasBlob)
                // var myXML = data.searchXML;
                // //console.log("myXML");
                // //console.log(myXML);
                // 
                // var dom = parseXml(myXML);
                // // var all = dom.getElementsByTagName("*");
                // // //console.log("domItems");
                // // //console.log(all);
                // // //console.log("domItemsLength:" + all.length);
                // var json = xml2json(dom);
                // json = json.replace('undefined"items', '"items');
                // json = json.replace(/@/g, "");
                // //console.log("json");
                // //console.log(json);
                // var jsonObj = $.parseJSON(json);
                // //console.log("jsonObj");
                // //console.log(jsonObj);
                // if (jsonObj.items.item !== null && jsonObj.items.item !== undefined) {
                // callback(jsonObj.items.item);
                // } else {
                // callback(null);
                // }
                // })
                // .fail(function (xhr, err) {
                // //console.log("failed");
                // var responseTitle = $(xhr.responseText).filter('title').get(0);
                // var response = $(xhr.responseText).filter('body').get(0);
                // app.choosePicSource = "";
                // //console.log(response);
                // if (Globals.bDebug === true) {
                // Toast.toast($(responseTitle).text() + "\n" + formatErrorMessage(xhr, err));}
                // callback(null);
                // })
                // .always(function () {
                // //console.log("complete");

                // });
            } else {
                Toast.toast("Please enter a BGG ID first");
            }
        } else {
            Toast.toast("You must be connected to the internet");
        }
    },

    prepTeamPage: function(callback) {
        var $elTxtTeamAdd = $('#txtTeamAdd');
        var $elTxtFactionAdd = $('#txtFactionAdd');
        var $elTeamPlayerName = $('#teamPlayerName');
        var $el = $('#teamPlayerImage');
        var $el2 = $('#selPlayerColor2');
        $el2.val(app.currEditPlayer.color);
        var $img = $('#imgPlayerColor2');
        //console.log($el.val());
        $img.attr('src', "img/colors/" + app.currEditPlayer.color + "0032.png");
        $el2.val(app.currEditPlayer.color);
        $el.attr('src', app.currEditPlayer.player.icon).load();
        $el.nailthumb({
            width: 80,
            height: 80
        });
        $elTeamPlayerName.html(app.currEditPlayer.player.name);
        $elTxtTeamAdd.val(app.currEditPlayer.team);
        $elTxtFactionAdd.val(app.currEditPlayer.faction);
        changePage('#promptTeam', {
            transition: 'pop',
            role: 'dialog'
        });
        callback(true);
    },

    findAllPaused: function(callback) {
        //console.log("find all paused");
        this.store.findAllPaused(function(paused) {
            callback(paused);
        });
    },

    findAllSessions: function(callback) {
        var loadPhoto = function(session, i, callback) {
            //console.log("Loading Photo: " + session.sessionPhoto);
            var p = session.sessionPhoto;
            if (p !== undefined && p !== '' && p !== null && p !== 'undefined') {
                FileIO.getFileURI(session.sessionPhoto, function(fileURI) {
                    session.sessionPhoto = fileURI;
                    callback(session, i); 
                });   
            } else {
                callback(session, i);
            } 
        };
        
        //console.log("findAllSessions");
        this.store.findAllSessions(function(sessions) {
            
            
            //console.log(sessions);
            //insert fake photos to test gallery
             //if (Globals.bDebug === true) {
//                 
             //    for (var i=0;i<sessions.length;i++) {
                     //fake session photos
                     //sessions[i].sessionPhoto = "img/photos/Photo" + (i + 1) + ".jpg";
               //  }
            // }
            var l = sessions.length;
            //console.log("Sessions length: " + l);
            for (var i=0;i<l;i++) {
                loadPhoto(sessions[i], i, function(newSession, i2) {
                    sessions[i2] = newSession;
                   //console.log("Loaded Photo " + i2 +" of " + l); 
                   if (i2 === l-1) {
                       callback(sessions);
                   }
                });
            }
            
            if (l === 0) {
                callback(Globals.empty);
            }
            
            //callback(sessions);
        });
    },

    findAllTeams: function(callback) {
        this.store.findAllTeams(function(teams) {
            teams.sort(dynamicSort("name"));
            callback(teams);
        });
    },

    findAllLocations: function(callback) {
        this.store.findAllLocations(function(locations) {
            locations.sort(dynamicSort("name"));
            callback(locations);
        });
    },

    findFactionsByGameId: function(gameId, callback) {
        this.store.findAllFactions(function(factions) {
            var i;
            var l;
            l = factions.length;
            for (i = 0; i < l; i++) {
                if (factions[i].gameId !== gameId) {
                    factions.splice(i, 1);
                    i--;
                    l--;
                }
            }
            factions.sort(dynamicSort("name"));
            callback(factions);
        });
    },

    findAllScores: function(callback) {
        //console.log("findAllScores");
        this.store.findAllScores(function(scores) {
            //console.log(scores);
            callback(scores);
        });
    },

    findAllAwardsEarned: function(callback) {
        //console.log("findAllAwardsEarned");
        this.store.findAllAwardsEarned(function(awards) {
            //console.log(awards);
            callback(awards);
        });
    },

    findAllGames: function(bHidden, callback) {
        //console.log("find all games");
        this.store.findAllGames(bHidden, function(games) {
            //console.log(games);
            callback(games);
        });
    },

    findAllPlayers: function(bHidden, bHiddenOnDevice, callback) {
        //console.log("find all players");
        app.lastPlayerLoad = getTimestamp();
        this.store.findAllPlayers(bHidden, bHiddenOnDevice, function(players) {
            //console.log(players);
            callback(players);
        });
    },

    findScoresById: function(session_id, callback) {
        //console.log("find scores id");
        this.store.findScoresBySession(session_id, function(scores) {
            //console.log(scores);
            callback(scores);
        });
    },

    findImageById: function(id, callback) {
        //console.log("find scores id");
        this.store.findImageById(id, function(result) {
            //console.log(scores);
            callback(result);
        });
    },

    findGamesByName: function(searchTerm, bHidden, callback) {
        //console.log('findGamesByName: ' + searchTerm );

        if (searchTerm === "") {
            this.store.findAllGames(bHidden, function(games) {
                app.currGames = games;
                app.currGames.sort(dynamicSort("name"));
                callback();

            });
        } else {
            searchTerm = searchTerm.replace(/'/g, "&#39;");
            this.store.findGamesByName(searchTerm, bHidden, function(games) {
                app.currGames = games;
                app.currGames.sort(dynamicSort("name"));
                callback();

            });
        }
    },

    findGamesOnline: function(searchTerm, start) {
        searchTerm = searchTerm.replace(/'/g, "&#39;");
        app.bSearching2 = true;
        //console.log('findGamesOnline: ' + searchTerm + " / " + start);
        
        var that = this;
        var dataString = 'search=' + encodeURIComponent(searchTerm) + '&start=' + start;
        var online = Internet.isOnline();
        var i;
        var l;
        var max;
        var done = 0;
        //console.log($elFlipOnline.val());
        app.getSetting("chkOnlineGames", 'true', function(setting) {
            //console.log("setting: " + setting);
            if (setting == "true") {
                if (online) {
                    //console.log('Navigator online');
                    if (Internet.hostReachable) {
                        //console.log('Host reachable, begin cloud');
                        //console.log('sending');
                        //console.log(myCloud);
                        Internet.getURLSource("https://rebrandcloud.secure.omnis.com/cloud/searchPlugin.asp", dataString, true, function(data) {
                            if (data) {
                                var l = data.length;
                                var obj;
                                //console.log("data.length: " + l);
                                app.currGamesOnline = [];
                                for (i = 0; i < l; i++) {
                                    obj = data[i];
                                    //console.log("OBJECT:");
                                    //console.log(obj);
                                    if (obj !== undefined) {
                                        if (obj.type === "game") {
                                            var myGame = new Game(obj.id, obj.bggid, obj.name, obj.icon, "", "", obj.version);
                                            app.currGamesOnline.push(myGame);
                                            //console.log("Push: " + myGame.name);
                                        } else if (obj.type === "data") {
                                            app.iCurrGamesOnline = parseInt(obj.start, 10);
                                            if (obj.more == "False") {
                                                app.iCurrGamesOnline = app.currGamesOnline + 10;
                                                app.bCurrGamesOnline = false;
                                            } else {
    
                                                app.bCurrGamesOnline = true;
                                            }
                                        }
                                    }
    
                                }
                            }
                            app.writeGamesToPage("online", function() {
                                //console.log("changepage");
                                changePage("#gamesDatabase");
                            });
                            app.bGameSearch2 = false;
                            app.bSearching2 = false;
                        });
                        // $.ajax({
                        // url: 'https://rebrandcloud.secure.omnis.com/cloud/searchPlugin.asp',
                        // data: dataString,
                        // crossDomain: true,
                        // dataType: 'jsonp',
                        // mozSystem: true
                        // })
                        // .done(function (data) {
                        // //console.log('done');
                        // //console.log('data:');
                        // //console.log(data);
                        // var l = data.length;
                        // var obj;
                        // //console.log("data.length: " + l);
                        // app.currGamesOnline = [];
                        // for (i = 0; i < l; i++) {
                        // obj = data[i];
                        // //console.log("OBJECT:");
                        // //console.log(obj);
                        // if (obj !== undefined) {
                        // if (obj.type === "game") {
                        // var myGame = new Game(obj.id, obj.bggid, obj.name, obj.icon, "", "", obj.version);
                        // app.currGamesOnline.push(myGame);
                        // //console.log("Push: " + myGame.name);
                        // } else if (obj.type === "data") {
                        // app.currGamesOnline = parseInt(obj.start, 10);
                        // if (obj.more == "False") {
                        // app.currGamesOnline = app.currGamesOnline + 10;
                        // app.currGamesOnline = false;
                        // } else {
                        // 
                        // app.currGamesOnline = true;
                        // }
                        // }
                        // }
                        // 
                        // }
                        // app.writeGamesToPage("online", function () {
                        // //console.log("changepage");
                        // changePage("#gamesDatabase");
                        // });
                        // })
                        // .fail(function (xhr, err) {
                        // //console.log('failed');
                        // var responseTitle = $(xhr.responseText).filter('title').get(0);
                        // var response = $(xhr.responseText).filter('body').get(0);
                        // //console.log(response);
                        // if (Globals.bDebug === true) {
                        // Toast.toast($(responseTitle).text() + '\n' + formatErrorMessage(xhr, err));}
                        // })
                        // .always(function () {
                        // //console.log('complete');
                        // $.mobile.loading("hide");
                        // app.bGameSearch2 = false;
                        // app.bSearching2 = false;
                        // });
                    } else {
                        Toast.toast("Could not connect to game server, please try again later"); //"Please connect to the internet first"
                    }
                } else {
                    Toast.toast("Could not connect to the internet"); //Please connect to the internet first
                }
            } else {
                app.currGamesOnline = [];
                app.store.findOldGamesByName(searchTerm, function(oldGames) {
                    l = oldGames.length;
                    max = 10;
                    for (i = start - 1; i < l; i++) {
    
                        app.currGamesOnline.push(oldGames[i]);
                        done++;
                        if (done >= max) {
                            break;
                        }
                    }
                    //console.log("i:" + i + " l:" + l);
    
                    if (i >= l - 1) {
                        app.iCurrGamesOnline = i + 12;
                        app.bCurrGamesOnline = false;
                    } else {
                        app.iCurrGamesOnline = i + 2;
                        app.bCurrGamesOnline = true;
                    }
                    app.writeGamesToPage("online", function() {
                        //console.log("changepage");
                        changePage("#gamesDatabase");
                        app.bGameSearch2 = false;
                        $.mobile.loading('hide');
                    });
                });
            }
        });
        

    },

    findPluginOnline: function(searchTerm) {
        //console.log('findPluginOnline: ' + searchTerm );
        var that = this;
        var dataString = 'id=' + encodeURIComponent(searchTerm);
        var online = Internet.isOnline();
        if (online) {
            //console.log('Navigator online');
            if (Internet.hostReachable) {
                //console.log('Host reachable, begin cloud');
                //console.log('sending');
                //console.log(myCloud);
                Internet.getURLSource("https://rebrandcloud.secure.omnis.com/cloud/getPlugin.asp", dataString, true, function(data) {
                    if (data) {
                        app.writeGameToOnlineDialog(data, function() {

                            changePage('#promptOnlineGame', {
                                transition: 'pop',
                                role: 'dialog'
                            });
                        });
                    }
                });
                // $.ajax({
                // url: 'https://rebrandcloud.secure.omnis.com/cloud/getPlugin.asp',
                // data: dataString,
                // crossDomain: true,
                // dataType: 'jsonp'
                // })
                // .done(function (data) {
                // //console.log('done');
                // //console.log('data:');
                // //console.log(data);
                // 
                // app.writeGameToOnlineDialog(data, function () {
                // 
                // });
                // })
                // .fail(function (xhr, err) {
                // //console.log('failed');
                // var responseTitle = $(xhr.responseText).filter('title').get(0);
                // var response = $(xhr.responseText).filter('body').get(0);
                // //console.log(response);
                // if (Globals.bDebug === true) 
                // Toast.toast($(responseTitle).text() + '\n' + formatErrorMessage(xhr, err));
                // })
                // .always(function () {
                // //console.log('complete');
                // $.mobile.loading("hide");
                // });
            } else {
                Toast.toast("Please connect to the internet first"); //"Please connect to the internet first"
            }
        } else {
            Toast.toast("Please connect to the internet first"); //Please connect to the internet first
        }

    },

    findPluginOnline2: function(myGame) {
        //console.log('findPluginOnline: ' + searchTerm );
        var data = new OnlineGameData(myGame.id, myGame.bggId, myGame.name, myGame.icon, myGame.scoreType, myGame.advancedText, myGame.version, "");
        //console.log("Data");
        //console.log(data);
        app.writeGameToOnlineDialog(data, function() {
            changePage('#promptOnlineGame', {
                transition: 'pop',
                role: 'dialog'
            });
        });
    },

    findAwardsBySession: function(session_id, callback) {
        //console.log('findAwardsBySession: ' + session_id);
        this.store.findAwardsBySession(session_id, function(awards) {
            callback(awards);
        });
    },

    findOrphans: function() {
        app.findAllSessions(function(sessions) {
            app.findAllScores(function(scores) {
                var i;
                var l = sessions.length;
                var m;
                var j;
                var s;
                var bFound;
                var badSess = [];
                m = scores.length;
                //console.log("Scores before: " + m);
                for (i = 0; i < l; i++) {
                    bFound = false;
                    s = sessions[i];

                    for (j = 0; j < m; j++) {
                        if (s.sessionId == scores[j].sessionId) {
                            bFound = true;
                            scores.splice(j, 1);
                            j--;
                            m--;
                        }
                    }
                    if (bFound === false) {
                        badSess.push(s);
                    }
                }
                m = scores.length;
                l = badSess.length;
                //console.log("Scores after: " + m);
                //console.log(scores);
                //console.log("Bad sessions: " + l);
                //console.log(badSess);

            });

        });
    },

    populateDropdowns: function(callback) {
        var gameIds = [];
        var playerIds = [];
        var numPlayers = [];
        app.playersDisplay = [];
        app.gamesDisplay = [];
        app.numPlayersDisplay = [];
        var l = app.currHistory.length;
        var m;
        var j;
        var g;
        var scores;
        var s;
        var myNumPlayersDisplay;
        var myGameDisplay;
        var myPlayerDisplay;

        l = app.currHistory.length;
        for (var i = 0; i < l; i++) {
            g = app.currHistory[i].game;
            //console.log("GAME");
            //console.log(g);
            scores = app.currHistory[i].scores;
            if (gameIds.indexOf(g.id) === -1) {
                gameIds.push(g.id);
                myGameDisplay = new GameDisplay(g.name, g.id);
                app.gamesDisplay.push(myGameDisplay);
            }
            m = scores.length;

            if (numPlayers.indexOf(m) === -1) {
                numPlayers.push(m);
                myNumPlayersDisplay = new NumPlayersDisplay(m, m);
                app.numPlayersDisplay.push(myNumPlayersDisplay);
            }

            for (j = 0; j < m; j++) {
                s = scores[j];
                if (playerIds.indexOf(s.playerId) === -1) {
                    playerIds.push(s.playerId);
                }
            }
        }
        app.numPlayersDisplay.sort(dynamicSort("number"));
        myNumPlayersDisplay = new NumPlayersDisplay("All", "");
        app.numPlayersDisplay.unshift(myNumPlayersDisplay);
        app.gamesDisplay.sort(dynamicSort("gameName"));
        myGameDisplay = new GameDisplay("All", "");
        app.gamesDisplay.unshift(myGameDisplay);
        l = playerIds.length;
        if (l > 0) {
            for (i = 0; i < l; i++) {
                app.findPlayerById(playerIds[i], function(player) {
                    if (player !== null) {
                        if (app.isPlayerHiddenOnDevice(player.id) === false) {
                            myPlayerDisplay = new PlayerDisplay(player.name, player.id);
                            app.playersDisplay.push(myPlayerDisplay);
                        }
                    }
                    if (i === l - 1) {
                        app.playersDisplay.sort(dynamicSort("playerName"));
                        myPlayerDisplay = new PlayerDisplay("Any", "");
                        app.playersDisplay.unshift(myPlayerDisplay);
                        callback();
                    }
                });
            }
        } else {
            myPlayerDisplay = new PlayerDisplay("All", "");
            app.playersDisplay.unshift(myPlayerDisplay);
            callback();
        }
    },

    findAllHistory: function(callback) {
        app.findAllSessions(function(sessions) {
            //console.log("Found " + sessions.length + " history");
            sessions.sort(dynamicSort('-sessionDate'));
            var l = sessions.length;
            var session;
            var myHist;
            var totalScores = 0;
            app.currHistory = [];
            if (l === 0) {
                callback();
            } else {
                for (var i = 0; i < l; i++) {
                    session = sessions[i];
                    app.findScoresById(session.sessionId, function(scores) {
                        totalScores += scores.length;
                        //console.log("scores");
                        //console.log(scores);
                        app.findPlayersFromScores(scores, function(players) {
                            app.findGameById(session.gameId, function(game) {
                                //console.log("game");
                                //console.log(game);
                                app.findAwardsBySession(session.sessionId, function(awards) {
                                    //console.log("awards");
                                    //console.log(awards);
                                    myHist = new History(game, session, scores, players, awards);
                                    //console.log("history");
                                    //console.log(myHist);
                                    if (myHist.game !== null && myHist.session !== null && myHist.scores !== null && myHist.players !== null && myHist.awards !== null) {
                                        app.currHistory.push(myHist);
                                    }
                                    if (i === (l - 1)) {
                                        //console.log("Total scores found by session id: " + totalScores);
                                        //console.log("sorting");

                                        //console.log("CurrHistory: ");
                                        //console.log(app.currHistory);
                                        app.populateDropdowns(function() {
                                            app.historyIsLoaded = true;
                                            callback();
                                        });
                                    }
                                });
                            });
                        });
                    });
                }
            }
        });
    },

    countVisiblePlayers: function(callback) {
        app.findAllPlayers(false, true, function(players) {
            var visiblePlayers = 0;
            for (var i = 0; i < players.length; i++) {
                if (players[i].hiddenOnDevice === false) {
                    visiblePlayers++;
                }
            }
            callback(visiblePlayers);
        });

    },

    countHiddenPlayers: function(callback) {
        var i = app.currPlayersHidden.length;
        //console.log("Hidden player count: " + i);
        callback(i);
    },

    filterHistory: function(gameId, playerId, winnerId, callback) {
        //FOR HISTORY
        app.getSetting("filterHistory", "hard", function(filterType) {
            app.countHiddenPlayers(function(hiddenPlayers) {
                if (filterType === "none") {
                    hiddenPlayers = 0;
                }
                //console.log("game: " + gameId + " player: " + playerId + " winner: " + winnerId + " hidden: " + hiddenPlayers);

                app.currHistoryDisplay = [];
                var i = 0;
                for (i = 0; i < app.currHistory.length; i++) {
                    app.currHistoryDisplay.push(app.currHistory[i]);
                }
                //console.log("CurrHistoryDisplay Before");
                //console.log(app.currHistoryDisplay);
                if (gameId === "" && playerId === "" && winnerId === "" && hiddenPlayers === 0) {
                    //console.log("no filters");
                    callback();
                } else {
                    var l;
                    var m;
                    var j;
                    var obj;
                    var s;
                    var bFound;
                    if (gameId !== "") {
                        //console.log("Filter by game");
                        l = app.currHistoryDisplay.length;
                        for (i = 0; i < l; i++) {
                            obj = app.currHistoryDisplay[i].game;
                            //console.log(obj);
                            //console.log(obj.gameId + " = " + gameId);
                            if (obj.id != gameId) {
                                //console.log("splice");
                                app.currHistoryDisplay.splice(i, 1);
                                l -= 1;
                                i -= 1;
                            }
                        }
                    }
                    if (playerId !== "") {
                        //console.log("Filter by player");
                        l = app.currHistoryDisplay.length;
                        for (i = 0; i < l; i++) {
                            obj = app.currHistoryDisplay[i].scores;
                            bFound = false;
                            m = obj.length;
                            for (j = 0; j < m; j++) {
                                s = obj[j];
                                if (s.playerId == playerId) {
                                    bFound = true;
                                    break;
                                }
                            }

                            if (bFound === false) {
                                app.currHistoryDisplay.splice(i, 1);
                                l -= 1;
                                i -= 1;
                            }

                        }
                    }
                    if (winnerId !== "") {
                        //console.log("filter on winner");
                        l = app.currHistoryDisplay.length;
                        for (i = 0; i < l; i++) {
                            obj = app.currHistoryDisplay[i].scores;
                            bFound = false;
                            m = obj.length;

                            for (j = 0; j < m; j++) {
                                s = obj[j];
                                //console.log("checking " + s.playerId + " = " + winnerId);
                                if (s.playerId == winnerId) {
                                    //console.log("Win: " + s.win);
                                    if (s.win === true || s.win == "true" || s.win == -1 || s.win == "-1") {
                                        //console.log("found proper winner");
                                        bFound = true;
                                        break;
                                    }
                                }
                            }

                            //console.log("bFound: " + bFound);

                            if (bFound === false) {
                                //console.log("splicing");
                                app.currHistoryDisplay.splice(i, 1);
                                l -= 1;
                                i -= 1;
                            } else {
                                //console.log("keeping");
                                //console.log(app.currHistoryDisplay[i]);
                            }

                        }
                    }

                    var iHidden = 0;

                    //remove history items where all players are app.currently hidden

                    //console.log("Hidden Players: " + hiddenPlayers);
                    if (hiddenPlayers > 0) {
                        //console.log("Some players are hidden so remove some shit");
                        l = app.currHistoryDisplay.length;
                        for (i = 0; i < l; i++) {
                            obj = app.currHistoryDisplay[i].scores;
                            bFound = false;
                            m = obj.length;

                            for (j = 0; j < m; j++) {
                                s = obj[j];
                                //console.log("checking " + s.playerId + " hidden");
                                if (app.isPlayerHiddenOnDevice(s.playerId) === true) {
                                    bFound = true;
                                    break;
                                }
                            }

                            //console.log("bFound: " + bFound);

                            if (bFound === true) {
                                //contains hidden players
                                app.currHistoryDisplay.splice(i, 1);
                                iHidden++;
                                l -= 1;
                                i -= 1;
                            } else {
                                //console.log("keeping");
                                //console.log(app.currHistoryDisplay[i]);
                            }

                        }
                    }

                    if (iHidden > 0) {
                        app.getSetting("chkHiddenPlayers", "true", function(setting) {
                            if (setting === "true") {
                                Toast.toastMiniLong(iHidden + " sessions by hidden players were filtered");
                            }
                        });
                    }

                    //console.log("after: ");
                    //console.log(app.currHistoryDisplay);
                    callback();
                }
            });
        });
    },

    filterHistoryStats: function(gameId, statType, numPlayers, callback) {
        //FOR STATS
        app.getSetting("filterHistoryStats", "hard", function(filterType) {
            app.countHiddenPlayers(function(hiddenPlayers) {
                //console.log("game: " + gameId + " statType: " + statType + " numPlayers: " + numPlayers + " hidden: " + hiddenPlayers);

                if (filterType === "none") {
                    hiddenPlayers = 0;
                }
                app.currHistoryDisplay = [];
                var i = 0;
                for (i = 0; i < app.currHistory.length; i++) {
                    app.currHistoryDisplay.push(app.currHistory[i]);
                }
                //console.log("CurrHistoryDisplay Before");
                //console.log(app.currHistoryDisplay);
                //console.log(app.currHistoryDisplay.length);
                if (gameId === "" && statType === "player" && numPlayers === "" && hiddenPlayers === 0) {
                    //console.log("no filters");
                    callback();
                } else {
                    //console.log("filtered");
                    var l;
                    var m;
                    var j;
                    var s;
                    var obj;
                    var bFound;
                    var score;
                    if (gameId !== "") {
                        l = app.currHistoryDisplay.length;
                        for (i = 0; i < l; i++) {
                            obj = app.currHistoryDisplay[i].game;
                            //console.log(obj.id);
                            //console.log(gameId);
                            if (obj.id !== gameId) {
                                //console.log("splicegame");
                                app.currHistoryDisplay.splice(i, 1);
                                l -= 1;
                                i -= 1;
                            }
                        }
                    }
                    if (statType !== "player") {
                        l = app.currHistoryDisplay.length;
                        for (i = 0; i < l; i++) {
                            obj = app.currHistoryDisplay[i].scores;
                            bFound = false;
                            m = obj.length;
                            for (j = 0; j < m; j++) {
                                score = obj[j];
                                switch (statType) {
                                    case "faction":
                                        //console.log("faction: " + obj[j].faction);
                                        if (score.faction !== "") {
                                            bFound = true;
                                        }
                                        break;
                                    case "position":
                                        if (score.position !== "") {
                                            bFound = true;
                                        }
                                        break;
                                    case "color":
                                        if (score.color !== "") {
                                            bFound = true;
                                        }
                                        break;
                                    case "team":
                                        if (score.team !== "") {
                                            bFound = true;
                                        }
                                        break;
                                }
                                if (bFound === true) {
                                    break;
                                }

                            }

                            if (bFound === false) {
                                //console.log("spliceplayer");
                                app.currHistoryDisplay.splice(i, 1);
                                l -= 1;
                                i -= 1;
                            }

                        }
                    }
                    if (numPlayers !== "") {
                        //console.log("filter on numplayers");
                        l = app.currHistoryDisplay.length;
                        for (i = 0; i < l; i++) {
                            obj = app.currHistoryDisplay[i].scores;
                            bFound = false;
                            m = obj.length;

                            if (m == numPlayers) {
                                bFound = true;
                            }

                            //console.log("bFound: " + bFound);

                            if (bFound === false) {
                                //console.log("splicing");
                                //console.log("splicenumplayers");
                                app.currHistoryDisplay.splice(i, 1);
                                l -= 1;
                                i -= 1;
                            } else {
                                //console.log("keeping");
                                //console.log(app.currHistoryDisplay[i]);
                            }

                        }
                    }

                    var iHidden = 0;

                    //remove history items where all players are app.currently hidden

                    //console.log("Hidden Players: " + hiddenPlayers);
                    if (hiddenPlayers > 0) {
                        //console.log("Some players are hidden so remove some shit");
                        l = app.currHistoryDisplay.length;
                        for (i = 0; i < l; i++) {
                            obj = app.currHistoryDisplay[i].scores;
                            bFound = false;
                            m = obj.length;

                            for (j = 0; j < m; j++) {
                                s = obj[j];
                                //console.log("checking " + s.playerId + " hidden");
                                if (app.isPlayerHiddenOnDevice(s.playerId) === true) {
                                    //console.log("hidden");
                                    bFound = true;
                                    if (filterType === "hard") {
                                        //console.log("break");
                                        break;
                                    } else {
                                        //console.log("spliceScore");
                                        iHidden++;
                                        obj.splice(j, 1);
                                        j -= 1;
                                        m -= 1;
                                    }
                                }
                            }

                            //console.log("bFound: " + bFound);

                            if (bFound === true && filterType === "hard") {
                                //contains hidden players
                                //console.log("splice session: ");
                                app.currHistoryDisplay.splice(i, 1);
                                iHidden++;
                                l -= 1;
                                i -= 1;
                            } else if (bFound === true && filterType === "soft") {
                                app.currHistoryDisplay[i] = obj;
                            } else {
                                //console.log("keeping");
                                //console.log(app.currHistoryDisplay[i]);
                            }

                        }
                    }

                    if (iHidden > 0) {
                        app.getSetting("chkHiddenPlayers", "true", function(setting) {
                            if (setting === "true") {
                                if (filterType === "hard") {
                                    Toast.toastMiniLong(iHidden + " sessions with hidden players were not calculated");
                                } else {
                                    Toast.toastMiniLong(iHidden + " scores by hidden players were not calculated");
                                }
                            }
                        });
                    }
                    //console.log("after: ");
                    //console.log(app.currHistoryDisplay);
                    //console.log(app.currHistoryDisplay.length);
                    callback();
                }
            });
        });
    },

    filterHistoryGallery: function(gameId, playerId, winnerId, callback) {
        //FOR GALLERY
        //console.log("game: " + gameId + " player: " + playerId + " winner: " + winnerId);
        app.getSetting("filterHistoryGallery", "hard", function(filterType) {


            app.countHiddenPlayers(function(hiddenPlayers) {
                if (filterType === "none") {
                    hiddenPlayers = 0;
                }
                app.currHistoryDisplay = [];
                var i = 0;
                for (i = 0; i < app.currHistory.length; i++) {
                    app.currHistoryDisplay.push(app.currHistory[i]);
                }
                //console.log("CurrHistoryDisplay Before");
                //console.log(app.currHistoryDisplay);
                app.currHistoryDisplay.sort(dynamicSort("session.sessionId"));
                var l;
                var g;
                var m;
                var j;
                var obj;
                var s;
                var p;
                var bFound;
                var gameIds = [];
                var playerIds = [];
                var myGameDisplay;
                var myPlayerDisplay;
                var scores; 
                app.gamesDisplay = [];
                app.playersDisplay = [];
                l = app.currHistoryDisplay.length;
                //console.log("Filter by p null");
                for (i = 0; i < l; i++) {
                    obj = app.currHistoryDisplay[i];
                    //console.log(obj);
                    p = obj.session.sessionPhoto;
                    //console.log(p);
                    if (p == "undefined" || p === undefined || p == "null" || p === null || p === "") {
                        //console.log("splice");
                        app.currHistoryDisplay.splice(i, 1);
                        i--;
                        l--;
                    }
                }

                //console.log("After splice");
                //console.log(app.currHistoryDisplay);

                if (gameId !== "") {
                    //console.log("Filter by game");
                    l = app.currHistoryDisplay.length;
                    for (i = 0; i < l; i++) {
                        obj = app.currHistoryDisplay[i].game;
                        //console.log(obj);
                        //console.log(obj.gameId + " = " + gameId);
                        if (obj.id != gameId) {
                            //console.log("splice");
                            app.currHistoryDisplay.splice(i, 1);
                            l -= 1;
                            i -= 1;
                        }
                    }
                }
                if (playerId !== "") {
                    //console.log("Filter by player");
                    l = app.currHistoryDisplay.length;
                    for (i = 0; i < l; i++) {
                        obj = app.currHistoryDisplay[i].scores;
                        bFound = false;
                        m = obj.length;
                        for (j = 0; j < m; j++) {
                            s = obj[j];
                            if (s.playerId == playerId) {
                                bFound = true;
                                break;
                            }
                        }

                        if (bFound === false) {
                            app.currHistoryDisplay.splice(i, 1);
                            l -= 1;
                            i -= 1;
                        }

                    }
                }
                if (winnerId !== "") {
                    //console.log("filter on winner");
                    l = app.currHistoryDisplay.length;
                    for (i = 0; i < l; i++) {
                        obj = app.currHistoryDisplay[i].scores;
                        bFound = false;
                        m = obj.length;

                        for (j = 0; j < m; j++) {
                            s = obj[j];
                            //console.log("checking " + s.playerId + " = " + winnerId);
                            if (s.playerId == winnerId) {
                                //console.log("Win: " + s.win);
                                if (s.win === true || s.win == "true" || s.win == -1 || s.win == "-1") {
                                    //console.log("found proper winner");
                                    bFound = true;
                                    break;
                                }
                            }
                        }

                        //console.log("bFound: " + bFound);

                        if (bFound === false) {
                            //console.log("splicing");
                            app.currHistoryDisplay.splice(i, 1);
                            l -= 1;
                            i -= 1;
                        } else {
                            //console.log("keeping");
                            //console.log(app.currHistoryDisplay[i]);
                        }

                    }
                }
                //console.log("after: ");
                //console.log(app.currHistoryDisplay);

                var iHidden = 0;

                //remove history items where all players are app.currently hidden

                //console.log("Hidden Players: " + hiddenPlayers);
                if (hiddenPlayers > 0) {
                    //console.log("Some players are hidden so remove some shit");
                    l = app.currHistoryDisplay.length;
                    for (i = 0; i < l; i++) {
                        obj = app.currHistoryDisplay[i].scores;
                        bFound = false;
                        m = obj.length;

                        for (j = 0; j < m; j++) {
                            s = obj[j];
                            //console.log("checking " + s.playerId + " hidden");
                            if (app.isPlayerHiddenOnDevice(s.playerId) === true) {
                                bFound = true;
                                break;
                            }
                        }

                        //console.log("bFound: " + bFound);

                        if (bFound === true) {
                            //contains hidden players
                            app.currHistoryDisplay.splice(i, 1);
                            iHidden++;
                            l -= 1;
                            i -= 1;
                        } else {
                            //console.log("keeping");
                            //console.log(app.currHistoryDisplay[i]);
                        }

                    }
                }

                if (iHidden > 0) {
                    app.getSetting("chkHiddenPlayers", "true", function(setting) {
                        if (setting === "true") {
                            Toast.toastMiniLong(iHidden + " photos of sessions with hidden players were filtered");
                        }
                    });

                }

                l = app.currHistoryDisplay.length;


                for (i = 0; i < l; i++) {
                    g = app.currHistoryDisplay[i].game;
                    //console.log("GAME");
                    //console.log(g);
                    scores = app.currHistoryDisplay[i].scores;
                    if (gameIds.indexOf(g.id) === -1) {
                        gameIds.push(g.id);
                        myGameDisplay = new GameDisplay(g.name, g.id);
                        app.gamesDisplay.push(myGameDisplay);
                    }
                    m = scores.length;
                    for (j = 0; j < m; j++) {
                        s = scores[j];
                        if (playerIds.indexOf(s.playerId) === -1) {
                            playerIds.push(s.playerId);
                        }
                    }
                }
                app.gamesDisplay.sort(dynamicSort("gameName"));
                myGameDisplay = new GameDisplay("All", "");
                app.gamesDisplay.unshift(myGameDisplay);
                l = playerIds.length;
                if (l > 0) {
                    for (i = 0; i < l; i++) {
                        app.findPlayerById(playerIds[i], function(player) {
                            if (player !== null) {

                                myPlayerDisplay = new PlayerDisplay(player.name, player.id);
                                app.playersDisplay.push(myPlayerDisplay);

                            }
                            if (i === l - 1) {
                                app.playersDisplay.sort(dynamicSort("playerName"));
                                myPlayerDisplay = new PlayerDisplay("All", "");
                                app.playersDisplay.unshift(myPlayerDisplay);
                                callback();
                            }
                        });
                    }
                } else {
                    myPlayerDisplay = new PlayerDisplay("All", "");
                    app.playersDisplay.unshift(myPlayerDisplay);
                    callback();
                }
            });
        });
    },

    filterHistoryAwards: function(gameId, playerId, awardId, callback) {
        app.getSetting("filterHistoryAwards", "soft", function(filterType) {


            app.countHiddenPlayers(function(hiddenPlayers) {
                if (filterType === "none") {
                    hiddenPlayers = 0;
                }
                //console.log("game: " + gameId + " player: " + playerId + " awardId: " + awardId + " hidden: " + hiddenPlayers);
                app.currAwardDisplay = [];
                var i = 0;
                for (i = 0; i < app.currAwardsEarned.length; i++) {
                    app.currAwardDisplay.push(app.currAwardsEarned[i]);
                }
                //console.log("CurrAwardDisplay Before");
                //console.log(app.currAwardDisplay);
                if (gameId === "" && playerId === "" && awardId === "" && hiddenPlayers === 0) {
                    //console.log("no filters");
                    callback();
                } else {
                    var l;
                    var m;
                    var j;
                    var obj;
                    var s;
                    var bFound;
                    if (gameId !== "") {
                        l = app.currAwardDisplay.length;
                        for (i = 0; i < l; i++) {
                            obj = app.currAwardDisplay[i];
                            if (obj.gameId !== gameId) {
                                app.currAwardDisplay.splice(i, 1);
                                l -= 1;
                                i -= 1;
                            }
                        }
                    }
                    if (playerId !== "") {
                        l = app.currAwardDisplay.length;
                        for (i = 0; i < l; i++) {
                            obj = app.currAwardDisplay[i];
                            if (obj.playerId !== playerId) {
                                app.currAwardDisplay.splice(i, 1);
                                l -= 1;
                                i -= 1;
                            }
                        }
                    }
                    if (awardId !== "") {
                        l = app.currAwardDisplay.length;
                        for (i = 0; i < l; i++) {
                            obj = app.currAwardDisplay[i];
                            //console.log(obj);
                            //console.log(obj.awardId + " !== " + awardId);
                            if (obj.awardId != awardId) {
                                //console.log("splice");
                                app.currAwardDisplay.splice(i, 1);
                                l -= 1;
                                i -= 1;
                            }
                        }
                    }

                    var iHidden = 0;

                    //remove history items where all players are app.currently hidden

                    //console.log("Hidden Players: " + hiddenPlayers);
                    if (hiddenPlayers > 0) {
                        //console.log("Some players are hidden so remove some awards");
                        l = app.currAwardDisplay.length;
                        for (i = 0; i < l; i++) {
                            obj = app.currAwardDisplay[i];
                            bFound = false;
                            //console.log(obj);
                            //console.log("checking " + obj.playerId + " hidden");
                            if (app.isPlayerHiddenOnDevice(obj.playerId) === true) {
                                //console.log("splice");
                                app.currAwardDisplay.splice(i, 1);
                                iHidden++;
                                l -= 1;
                                i -= 1;
                            }
                        }
                    }

                    if (iHidden > 0) {
                        app.getSetting("chkHiddenPlayers", "true", function(setting) {
                            if (setting === "true") {
                                Toast.toastMiniLong(iHidden + " achievements by hidden players were filtered");
                            }
                        });

                    }
                    //console.log("after: ");
                    //console.log(app.currAwardDisplay);
                    callback();
                }
            });
        });
    },

    findPlayersFromScores: function(scores, callback) {
        var players = [];
        var l = scores.length;
        for (var i = 0; i < l; i++) {
            //console.log(scores[i].playerId);
            app.findPlayerById(scores[i].playerId, function(player) {
                if (player !== null) {
                    players.push(player);
                }
                if (i === (l - 1)) {
                    callback(players);
                }
            });
        }
    },

    findPlayersByName: function(searchTerm, bHidden, bHiddenOnDevice, callback) {
        //console.log('findPlayersByName: ' + searchTerm );
        $.mobile.loading('show');
        if (searchTerm === "") {
            this.store.findAllPlayers(bHidden, bHiddenOnDevice, function(players) {
                players.sort(dynamicSort("name"));
                callback(players);
            });
        } else {
            this.store.findPlayersByName(searchTerm, bHidden, bHiddenOnDevice, function(players) {

                players.sort(dynamicSort("name"));
                callback(players);
            });
        }
    },

    findPlayerById: function(player_id, callback) {
        //console.log("findPlayerById: " + player_id);
        this.store.findPlayerById(player_id, function(player) {
            //console.log("Found: ");
            //console.log(player);
            callback(player);
        });
    },

    findPlayerWinsById: function(player_id, callback) {
        //console.log("findPlayerWinsById: " + player_id);
        this.store.findPlayerWinsById(player_id, function(sessions) {
            var l = sessions.length;
            //console.log("Found " + l + " sessions");
            callback(l);
        });
    },

    sortPlayers: function(callback) {
        //console.log("sortPlayers");
        var newArray = [];
        var l = app.selectedPlayerIds.length;
        //console.log("l: " + l);
        var m = app.currPlayers.length;
        //console.log("m: " + m);
        for (var i = 0; i < l; i++) {
            //for each selected player ID
            for (var j = 0; j < m; j++) {
                //for each player
                //console.log(app.currPlayers[j].id + " " + app.selectedPlayerIds[i]);
                if (app.currPlayers[j].id == app.selectedPlayerIds[i]) {
                    //console.log("Add player " + app.currPlayers[j].name);
                    newArray.push(app.currPlayers[j]);
                }
            }
        }
        if (callback !== undefined) {
            callback(newArray);
        }
    },

    sortPlayersTemp: function(callback) {
        //console.log("sortPlayersTemp");
        var newArray = [];
        var l = app.selectedPlayerIds.length;
        //console.log("l: " + l);
        var m = app.currGameDetails.players.length;
        //console.log("m: " + m);
        for (var i = 0; i < l; i++) {
            //for each selected player ID
            for (var j = 0; j < m; j++) {
                //for each player
                //console.log(app.currGameDetails.players[j].player.id + " " + app.selectedPlayerIds[i]);
                if (app.currGameDetails.players[j].player.id == app.selectedPlayerIds[i]) {
                    //console.log("Add player " + app.currGameDetails.players[j].player.name);
                    newArray.push(app.currGameDetails.players[j]);
                }
            }
        }
        if (callback !== undefined) {
            callback(newArray);
        }
    },

    writeAwardsToPage: function(awards, pagename, callback) {
        //console.log("writeAwardsToPage");
        //console.log(awards);
        var $el;
        var l = awards.length;
        var i;
        var j;
        var a;
        var k = app.currAwards.length;
        var myAward;
        var myDesc = "";
        var myDescTwitter = "";
        var myIcon = "";
        switch (pagename) {
            case "awards":
                $el = $('#award-list-session');
                $el.empty();
                $el.append('<li data-role="list-divider" role="heading" >Achievements <span style="float: right; margin-right: 0px;">Share</span></li>');
                if (l > 0) {
                    for (i = 0; i < l; i++) {
                        a = awards[i];
                        for (j = 0; j < k; j++) {
                            if (app.currAwards[j].id === a.awardId) {
                                myAward = app.currAwards[j];
                                break;
                            }
                        }
                        app.findPlayerById(a.playerId, function(player) {
                            app.findGameById(a.gameId, function(game) {
                                if (player === undefined || player === null) {
                                    player = new Player(0, "", "", "", "", "");
                                }
                                if (game === undefined || game === null) {
                                    game = new Game("", "", "", "", "", "", "");
                                }
                                myDesc = getAwardDesc(myAward.desc, player.name, player.twitter, game.name, game.id, a.awardValue, a.gameData, false);
                                myDescTwitter = getAwardDesc(myAward.desc, player.name, player.twitter, game.name, game.id, a.awardValue, a.gameData, true);

                                //console.log("award id: " + a.awardId);
                                app.myTwitterPhoto = "";
                                if (a.awardId === 0 || a.awardId == "0") {
                                    //console.log("award value: " + a.awardValue);
                                    var z = a.awardValue / 5;
                                    z += 28;
                                    //console.log("Player avatar " + z);
                                    if (z <= 82) {
                                        myIcon = "img/players/Player" + z + ".png";
                                        myDesc += " New avatar unlocked!";
                                        myDescTwitter += " New avatar unlocked!";
                                        app.myTwitterPhoto = myIcon;
                                    } else {
                                        myIcon = myAward.icon;
                                    }
                                } else {
                                    myIcon = myAward.icon;
                                }
                                $el.append('<li><a href="#"><img src="' + myIcon + '" /><h3>' + myAward.name + '</h3><p class="desc">' + myDesc + '</p></a><a href="#" class="share" id="' + myDescTwitter + '"></a></li>');
                                $el.listview("refresh");
                            });
                        });

                        //$el.listview("refresh");
                    }
                } else {
                    $el.append('<li><h3>No achievements were awarded for this game</h3></li>');
                    $el.listview("refresh");
                }
                break;
            case "session":
                $el = $('#award-list');
                $el.empty();
                $el.append('<li data-role="list-divider" role="heading" >Achievements <span style="float: right; margin-right: 0px;">Share</span></li>');
                if (l > 0) {
                    for (i = 0; i < l; i++) {
                        $el.append('<li><a href="#"><img src="' + awards[i].icon + '" /><h3>' + awards[i].name + '</h3><p class="desc">' + awards[i].desc + '</p></a><a href="#" id="' + awards[i].earnedId + '"></a></li>');
                        $el.listview("refresh");
                        //$el.listview("refresh");
                    }
                } else {
                    $el.append('<li><h3>No achievements found</h3></li>');
                    $el.listview("refresh");
                }
                break;
        }

        if (callback !== undefined) {
            callback();
        }
    },

    writeHistoryToPage: function(history, pagename, start, callback) {
        //console.log("writeHistoryToPage");
        var $el;
        var obj;
        var l;
        var s;
        var i;
        var j;
        var k;
        var max = 10;
        var desc = "";
        var winners = [];
        var winnerPoints = 0;
        var score;
        switch (pagename) {
            case "history1":
                $el = $('#history-list');
                $el.empty();
                $el.append('<li data-role="list-divider" role="heading">History</li>');
                l = history.length;
                //console.log("displayHistoryLen: " + l);
                if (l === 0) {
                    $el.append('<li>None found</li>');
                    $el.listview("refresh");
                } else {
                    app.wroteHist = true;
                    for (i = start; i < l; i++) {
                        winners = [];
                        winnerPoints = 0;
                        obj = history[i];
                        //console.log("scores:");
                        //console.log(obj.scores);
                        for (j = 0; j < obj.scores.length; j++) {
                            score = obj.scores[j];
                            //console.log(score);
                            //console.log("score.win: " + score.win);
                            if (score.win == "true" || score.win === true || score.win == -1 || score.win == "-1") {
                                winnerPoints = score.points;
                                for (k = 0; k < obj.players.length; k++) {
                                    if (score.playerId === obj.players[k].id) {
                                        winners.push(obj.players[k].name);
                                    }
                                }
                            }
                        }
                        desc = getHistoryDesc(winners, obj.session.sessionWon, winnerPoints, obj.session.sessionDate);
                        $el.append('<li id="' + obj.session.sessionId + '"><a href="#"><img src="' + obj.game.icon + '" /><h3>' + obj.game.name + '</h3><p class="desc">' + desc + '</p></a></li>');
                        $el.listview("refresh");
                        if (i >= (start + max - 1)) {
                            break;
                        }
                        app.historyPage = app.historyPage + 1;
                    }
                    $el = $('#divNextHistory');

                    if (i < l) {
                        $el.show();
                    } else {
                        $el.hide();
                    }
                    app.historyPage = app.historyPage + 1;
                }
                break;

            case "delete":
                $el = $('#delete-history-list');
                $el.empty();
                $el.append('<li data-role="list-divider" role="heading">Select a history item to delete</li>');
                l = history.length;
                //console.log("displayHistoryLen: " + l);
                if (l === 0) {
                    $el.append('<li>None found</li>');
                    $el.listview("refresh");
                } else {
                    app.wroteHistDel = true;
                    for (i = start; i < l; i++) {
                        winners = [];
                        winnerPoints = 0;
                        obj = history[i];
                        //console.log("scores:");
                        //console.log(obj.scores);
                        for (j = 0; j < obj.scores.length; j++) {
                            score = obj.scores[j];
                            //console.log("score.win: " + score.win);
                            if (score.win === true || score.win == "true" || score.win == -1 || score.win == "-1") {
                                winnerPoints = score.points;
                                for (k = 0; k < obj.players.length; k++) {
                                    if (score.playerId === obj.players[k].id) {
                                        winners.push(obj.players[k].name);
                                    }
                                }
                            }
                        }
                        desc = getHistoryDesc(winners, obj.session.sessionWon, winnerPoints, obj.session.sessionDate);
                        $el.append('<li id="' + obj.session.sessionId + '"><a href="#promptForDeleteHistory"><img src="' + obj.game.icon + '" /><h3>' + obj.game.name + '</h3><p class="desc">' + desc + '</p></a></li>');
                        $el.listview("refresh");
                        if (i >= (start + max - 1)) {
                            break;
                        }
                        app.historyPage = app.historyPage + 1;
                    }
                    $el = $('#divNextHistoryDel');

                    if (i < l) {
                        $el.show();
                    } else {
                        $el.hide();
                    }
                }
                break;
        }

        if (callback !== undefined) {
            callback();
        }
    },

    writeAwardsToPage2: function(awardsEarned, pagename, start, callback) {
        //console.log("writeHistoryToPage");
        var $el;
        var a;
        var l;
        var s;
        var i;
        var j;
        var k;
        var myAward;
        var myIcon;
        var myDesc;
        var max = 10;
        var desc = "";
        switch (pagename) {
            case "awards":
                $el = $('#award-list');
                $el.empty();
                $el.append('<li data-role="list-divider" role="heading">Achievements</li>');
                l = awardsEarned.length;
                //console.log("displayAwardLen: " + l);

                if (l === 0) {
                    $el.append('<li>None found</li>');
                    $el.listview("refresh");
                } else {
                    app.wroteAch = true;
                    for (i = start; i < l; i++) {
                        a = awardsEarned[i];
                        k = app.currAwards.length;
                        for (j = 0; j < k; j++) {
                            if (app.currAwards[j].id == a.awardId) {
                                myAward = app.currAwards[j];
                                break;
                            }
                        }
                        app.findPlayerById(a.playerId, function(player) {
                            app.findGameById(a.gameId, function(game) {
                                if (player === undefined || player === null) {
                                    player = new Player(0, "", "", "", "", "");
                                }
                                if (game === undefined || game === null) {
                                    game = new Game("", "", "", "", "", "", "");
                                }
                                myDesc = getAwardDesc(myAward.desc, player.name, player.twitter, game.name, game.id, a.awardValue, a.gameData, false);
                                //console.log("award id: " + a.awardId);
                                if (a.awardId === 0 || a.awardId == "0") {
                                    //console.log("award value: " + a.awardValue);
                                    var z = a.awardValue / 5;
                                    z += 28;
                                    //console.log("Player avatar " + z);
                                    if (z <= 82) {
                                        myIcon = "img/players/Player" + z + ".png";
                                        myDesc += " New avatar unlocked!";
                                    } else {
                                        myIcon = myAward.icon;
                                    }
                                } else {
                                    myIcon = myAward.icon;
                                }
                                $el.append('<li id="' + a.sessionId + '"><a href="#"><img src="' + myIcon + '" /><h3>' + myAward.name + '</h3><p class="desc">' + myDesc + '</p></a></li>');
                                $el.listview("refresh");
                            });
                        });


                        if (i >= (start + max - 1)) {
                            break;
                        }
                        app.awardPage = app.awardPage + 1;
                    }
                    $el = $('#divNextAward');

                    if (i < l) {
                        $el.show();
                    } else {
                        $el.hide();
                    }
                    app.awardPage = app.awardPage + 1;
                }
                break;
        }

        if (callback !== undefined) {
            callback();
        }
    },

    hideGallery: function(callback) {
        var $el;
      for (var i=0;i<10;i++) {
          $el = $('#divGallery' + i);
          $el.hide();
      }  
      callback();
    },
    
    showGallery: function(i) {
        //console.log("[showGallery]: " + i);
        var $el = $('#divGallery' + i);
          //console.log($el);
          $el.show();  
    },
   
    writeGalleryToPage: function(history, start, callback) {
        //console.log("Write Gallery: " + start);
        var i;
        var l;
        var $el;
        var $elImg;
        var imgSrc = "";
        var imgB64="";
        var imgName = "";
        var today;
        var dd;
        var mm; //January is 0!
        var yyyy;
        var max = 11;
        var $elNext;
        var $elNone;
        var $elHidden;
        var iLast = 0;
        var iWrote = 0;
        var photo;
        var toAppend;
        var toAppendLast="";
        var rel="";

        //app.gallery = [];

        //app.hideGallery(function() {
            $el = $('#galleryContainer');
            $el.empty();
            $el.hide();
            $elHidden = $('#galleryContainerHidden');
            $elHidden.empty();
            $elHidden.hide();
            $elNone = $('#divGalleryNoneFound');
            $elNone.hide();
    
            l = history.length;
            //console.log("history length: " + l);
            //$el.empty();
            if (l <= 0) {
                $elNone.show();
            } else {
                app.wroteGal = true;
                if (l > 1) {
                    rel = ' data-rel="gallery"';
                } else {
                    rel = '';
                }
                for (i = 0; i < l; i++) {
                    //console.log(history[i].session);
                    photo = history[i].session.sessionPhoto;
    
                    if (photo == "BLOB" || photo === null) {
                        photo = history[i].session.gamePhoto;
                    }
    
                    imgSrc = photo;
                    //console.log("imgSrc: " + imgSrc);
                    //console.log(history[i].session);
                    //console.log(i + " " + (start + max -1));
    
                    today = new Date(history[i].session.sessionDate);
                    dd = today.getDate();
                    mm = today.getMonth() + 1; //January is 0!
                    yyyy = today.getFullYear();
    
    
                    if (dd < 10) {
                        dd = '0' + dd;
                    }
                    if (mm < 10) {
                        mm = '0' + mm;
                    }
                    today = yyyy + '-' + mm + '-' + dd;
                    imgName = history[i].game.name + " " + today;
                    //console.log("imgSrc: " + imgSrc);
                    if (imgSrc !== "" && imgSrc !== null && imgSrc !== undefined && imgSrc !== "undefined") {
                        toAppend = '<a href="' + imgSrc + '" id="aGallery' + i + '" class="gallery-swipebox"' + rel + ' title="' + imgName +'"><img src="' + imgSrc + '" id="imgGallery' + i + '" height="240" width="320" style="" alt=""></a>';
                    } else {
                        toAppend = "";
                    }
                    //console.log(toAppend);
                                  
    
                    if (i >= (start + max - 1)) {
                        //console.log("--hiddenfirst");
                        $elHidden.append(toAppend);
                    } else if (i >= start && i < (start + max + 1)) {
                        //console.log("--visible");
                        //$el.append("<div class='ui-field-contain'>");
                        $el.append(toAppend);
                        //$el.append("</div>");
                        iLast = i;
                        iWrote++;
                        app.galleryPage = app.galleryPage + 1;
                    } else {
                        //console.log("--hiddenlast");
                        toAppendLast += toAppend;
                    }
    
                }
                
                $elHidden.append(toAppendLast);
                
                if (iWrote > 0) {
                    $el.show();
                }
                
                //$el.enhanceWithin();
                for (i = 0; i < l; i++) {
                    if (i >= start && i < (start + max - 1)) {
                        $elImg = $('#imgGallery' + i);
                        $elImg.nailthumb({
                            width: 320,
                            height: 240,
                            method: 'resize'
                        });
                    }
                    $el = $('#aGallery' + i);
                    //$el.swipebox();
                }
            }
            
            $(".gallery-swipebox").swipebox();
    
            $elNext = $('#divNextGal');
            //console.log("if " + iLast + " < (" + l + " - 1)");
            if (iLast < (l - 1)) {
                //console.log("Showing Next");
                $elNext.show();
            } else {
                //console.log("Hiding Next");
                $elNext.hide();
            }
        //});
        

    },

    writeGalleryToPageDelete: function(history, callback) {
        
        var doAppend = function(el, i, imgName, sessionId, imgSrc) {
            //FileIO.getFileURI(imgSrc, function(fileURI) {   
                el.append('<div class="ui-field-contain"><a href="#" title="' + imgName + '" id="' + sessionId + '" class="galleryDelete" data-fileURI="' + imgSrc + '"><img id="gallery' + i + '" src="' + imgSrc + '" height="240" width="320" style=""></a></div>');
                var elImg = $('#gallery' + i);
                elImg.nailthumb({
                    width: 320,
                    height: 240,
                    method: 'resize'
                });
            //});
        };
        
        //console.log("Write Gallery: " + start);
        var i;
        var l;
        var $el = $('#galleryDeleteContainer');
        var $elImg;
        var imgSrc = "";
        var imgName = "";
        var today;
        var dd;
        var mm; //January is 0!
        var yyyy;
        var max = 11;
        var $elNext;
        var $elHidden;
        var iLast = 0;
        var photo;


        l = history.length;
        //console.log("history length: " + l);
        $el.empty();
        if (l === 0) {
            $el.append("<h3>No photos found</h3>");
        } else {

            for (i = 0; i < l; i++) {
                //console.log(history[i].session);
                photo = history[i].session.sessionPhoto;

                if (photo == "BLOB" || photo === null) {
                    photo = history[i].session.gamePhoto;
                }

                imgSrc = photo;
                //console.log("imgSrc: " + imgSrc);
                //console.log(history[i].session);
                //console.log(i + " " + (start + max -1));

                today = new Date(history[i].session.sessionDate);
                dd = today.getDate();
                mm = today.getMonth() + 1; //January is 0!
                yyyy = today.getFullYear();


                if (dd < 10) {
                    dd = '0' + dd;
                }
                if (mm < 10) {
                    mm = '0' + mm;
                }
                today = yyyy + '-' + mm + '-' + dd;
                imgName = history[i].game.name + " " + today;


                //console.log("vis");
                if (imgSrc !== "" && imgSrc !== null && imgSrc !== undefined && imgSrc !== "undefined") {
                    doAppend($el, i, imgName, history[i].session.sessionId, imgSrc);
                }
            }
        }

    },
    
    lightBoxShift: function(start, callback) {
        //console.log("start: " + start);
        app.gallerySorted = app.gallery;
        if (start) {
            for (var i=0; i<start; i++) {
                app.gallerySorted.push(app.gallerySorted.shift());
            }   
        }
        callback();
    },

    lightBoxImage: function(aId, imgId, partialPath, height, width, title, gallery, start, callback) {
        //console.log("[lightBoxImage]");
        //console.log("aId: " + aId);
        //console.log("imgId: " + imgId);
        //console.log("partialPath: " + partialPath);
        //console.log("title: " + title);
        //console.log("gallery: " + gallery);
        //console.log("start: " + start);
        app.getSetting("lastGallery", "", function(lastGallery) {
            //console.log("lastGallery: " + lastGallery);
            app.saveSetting("lastGallery", gallery);
            if (gallery === "" || gallery !== lastGallery) {
                //console.log("resetting gallery");
                app.gallery = [];
            }
            var $aEl = $('#' + aId);
            var $imgEl = null;
            if (imgId !== "") {
                //console.log("Visible image");
                $imgEl = $('#' + imgId);            
            }
            
            FileIO.getFileURI(partialPath, function(fullPath) {
               
               if ($imgEl !== null) {
                   //console.log("Visible Image: " + fullPath);
                   $imgEl.attr('src', fullPath).load();              
               }
               //console.log("Start: " + start);
               $aEl.attr("data-start", start);
               var item = {};
               item.src = fullPath;
               item.title = title;
               app.gallery.push(item);
               //console.log("Gallery push: " + fullPath);     
    
                if (callback) {
                    callback();
                }
            });   
        });
    },

    tweetChart: function($el, sTweet) {
            var today = new Date();
            var dd = today.getDate();
            var mm = today.getMonth() + 1; //January is 0!
            var yyyy = today.getFullYear();


            if (dd < 10) {
                dd = '0' + dd;
            }
            if (mm < 10) {
                mm = '0' + mm;
            }
            today = yyyy + '-' + mm + '-' + dd;
            sTweet += " as of #" + today + ", generated by";
            var imgData = chartToImageStr($el, {});
            //console.log("imgData: " + imgData);
            // var imgData = $el.jqplotToImageStr({});
            // //console.log("imgData: " + imgData);
            Social.tweet(sTweet, imgData);
    },

    writeHistoryDetailsToPage: function(history, callback) {
        //console.log("writeHistoryDetailsToPage: ");
        //console.log(history);

        var $elNameHistory = $('#name-history');
        var $elDateHistory = $('#date-history');
        var $elNotesHistory = $('#notes-history');
        var $elImgHistoryImage = $('#imgHistoryImage');
        var $elAHistoryImage = $('#aHistoryImage');
        var $elPlayerHistory = $('#player-history');
        var $elAwardListHistory = $('#award-list-history');
        var $elImgHistoryGameImage = $('#imgHistoryGameImage');
        var $elLocationHistory = $('#location-history');
        var $elDurationHistory = $('#duration-history');
        var $elImgHistoryContainer = $('#historyImageContainer');
        var sWinner;
        var i;
        var j;
        var k;
        var l;
        var m;
        var n;
        var score;
        var player;
        var award;
        var earned;
        var sTweet = "";
        var sLink1 = "";
        var sLink2 = "";
        var sFaction = "";
        var sTeam = "";
        var sImage = '';
        var awards;
        var game;
        var session;
        var players;
        var scores;
        var descTwitter;
        var playerTemps = [];
        var playerTemp;
        var bTweet = false;
        var desc;
        var imgSrc;
        $elNameHistory.empty();
        $elDateHistory.empty();
        $elNotesHistory.empty();
        $elLocationHistory.empty();
        $elDurationHistory.empty();

        game = history.game;
        session = history.session;
        scores = history.scores;
        awards = history.awards;
        players = history.players;

        //console.log(session);

        scores.sort(dynamicSort("-points"));

        $elImgHistoryGameImage.attr('src', game.icon).load();
        $elImgHistoryGameImage.nailthumb({
            width: 80,
            height: 80,
            method: 'resize'
        });
        $elNameHistory.append(game.name);
        var myDate = new Date(session.sessionDate);
        $elDateHistory.append("Played " + humaneDate(myDate) + ": " + myDate.toMysqlFormat());
        $elLocationHistory.append(session.sessionLocation);
        $elDurationHistory.append(session.sessionDuration);
        $elNotesHistory.append(session.sessionNotes);
        $elImgHistoryContainer.empty();
        if (session.sessionPhoto !== "" && session.sessionPhoto !== undefined) {
            app.currHistoryPhoto = session.sessionPhoto;
            //console.log("Set currHistoryPhoto to " + app.currHistoryPhoto);
            $elImgHistoryContainer.append('<a href="' + session.sessionPhoto + '" title="Session Photo" id="aHistoryImage"><img src="' + session.sessionPhoto + '" id="imgHistoryImage" height="240" width="320" style="" alt=""></a>');
            $elImgHistoryImage = $('#imgHistoryImage');
            $elImgHistoryImage.nailthumb({
                                width: 320,
                                height: 240,
                                method: 'resize'
                            });
            $elAHistoryImage = $('#aHistoryImage');
            $elAHistoryImage.swipebox();
        }
        //app.lightBoxImage("aHistoryImage", "imgHistoryImage", session.sessionPhoto, 240, 320, game.name + " " + myDate.toMysqlFormat(), "", 0);
        
        
        $elPlayerHistory.empty();
        $elPlayerHistory.append('<li data-role="list-divider" role="heading">Scores <span style="float: right; margin-right: 0px;">Share</span></li>');
        l = scores.length;

        for (i = 0; i < l; i++) {
            score = scores[i];
            m = players.length;
            for (j = 0; j < m; j++) {
                if (score.playerId == players[j].id) {
                    playerTemp = new PlayerTemp(players[j]);
                    if (score.win === true || score.win == "true" || score.win == -1 || score.win == "-1") {
                        playerTemp.winner = true;
                    } else {
                        playerTemp.winner = false;
                    }
                    playerTemp.points = score.points;
                    playerTemps.push(playerTemp);
                }
            }
        }

        descTwitter = getSessionDesc(session.gameId, playerTemps, session.sessionDate);

        for (i = 0; i < l; i++) {

            score = scores[i];
            //console.log(score);
            if (score.win === true || score.win == "true" || score.win == -1 || score.win == "-1") {

                sWinner = " - Winner!";
                if (bTweet === false) {
                    sTweet = "<a href='#' class='share' id='" + descTwitter + "'></a>";
                    sLink1 = "<a href='#'>";
                    sLink2 = '</a>';
                    bTweet = true;
                }
            } else {
                sWinner = "";
                sTweet = "";
                sLink1 = "";
                sLink2 = "";
            }
            if (score.faction !== "") {
                sFaction = " - " + score.faction;
            }
            if (score.team !== "") {
                sTeam = " [" + score.team + "]";
            }

            m = players.length;
            for (j = 0; j < m; j++) {
                if (players[j].id === score.playerId) {
                    player = players[j];
                    break;
                }
            }
            if (score.color === "") {
                imgSrc = '<img src="' + player.icon + '" />';
            } else {
                imgSrc = '<img src="img/colors/' + score.color + '0032.png" class="colorMain" /><img class="colorOverlay" src="' + player.icon + '" />';
            }
            $elPlayerHistory.append('<li>' + sLink1 + imgSrc + '<h3>' + score.points + ' points' + sWinner + '</h3><p class="desc">' + player.name + sTeam + sFaction + "</p>" + sLink2 + sTweet + '</li>');
            //$elPlayerHistory.listview("refresh");
        }
        $elPlayerHistory.enhanceWithin();
        //$elPlayerHistory.listview('refresh');

        $elAwardListHistory.empty();


        //$elPlayerHistory.append('<li data-role="list-divider">Achievements</li>');
        l = awards.length;


        //console.log("app.currawards: " + n);
        $elAwardListHistory.append('<li data-role="list-divider" role="heading">Achievements <span style="float: right; margin-right: 0px;">Share</span></li>');
        if (l === 0) {
            $elAwardListHistory.append('<li>No achievements were awarded for this game</li>');
            //$elAwardListHistory.listview("refresh");
        } else {
            for (i = 0; i < l; i++) {
                //console.log(k);
                earned = awards[i];
                m = app.currAwards.length;
                for (j = 0; j < m; j++) {
                    if (app.currAwards[j].id == earned.awardId) {
                        award = app.currAwards[j];
                        break;
                    }
                }
                player = new Player("", "", "", "", "", "", "");
                m = players.length;
                for (j = 0; j < m; j++) {
                    if (players[j].id === earned.playerId) {
                        player = players[j];
                        break;
                    }
                }

                desc = getAwardDesc(award.desc, player.name, player.twitter, game.name, game.id, earned.awardValue, earned.gameData, false);
                descTwitter = getAwardDesc(award.desc, player.name, player.twitter, game.name, game.id, earned.awardValue, earned.gameData, true);
                //function Award(earnedId, id, name, desc, value, gameName, gameId, gameCustom, gameIcon, playerId, playerName, sessionId, dateEarned, icon, gameData)
                $elAwardListHistory.append('<li><a href="#"><img src="' + award.icon + '" /><h3>' + award.name + '</h3><p class="desc">' + desc + '</p></a><a class="share" href="#" id="' + descTwitter + '"></a></li>');
                //$elAwardListHistory.listview("refresh");
            }
        }
        $elAwardListHistory.listview("refresh");
        //$elAwardListHistory.listview("refresh");

        if (callback !== undefined) {
            callback();
        }



    },


    writeGameToOnlineDialog: function(myGameData, callback) {
        //console.log("write game to dialog");
        var sVers = "";
        var $elOnlineGameName = $('#onlineGameName');
        var $elOnlineGameVersion = $('#onlineGameVersion');
        var $elOnlineGameVersionNotes = $('#onlineGameVersionNotes');
        var $elTxtOnlineGameFeatures = $('#txtOnlineGameFeatures');
        var sFeatures = "";
        var a = [];
        var b = [];
        var c = [];
        var id;
        var advanced;
        var sMath = "";
        var sControl = "";

        app.sanitizeGame(myGameData.gameName, function(sanitized) {
            id = sanitized;
            app.findGameById(id, function(existingGame) {
                //console.log("existing game:");
                //console.log(existingGame);
                if (existingGame !== undefined && existingGame !== null) {
                    sVers = " (Replaces existing version " + existingGame.version + " keeping all score data)";
                }
                $elOnlineGameName.html(myGameData.gameName);
                //console.log("html: " + myGameData.gameName);
                $elOnlineGameVersion.html("Version: " + app.currGameOnline.version + sVers);
                $elOnlineGameVersionNotes.html("Notes: " + myGameData.notes);
                //console.log("Version: " + app.currGameOnline.version + sVers);
                //app.currGameOnline = myGameData;

                var myNewGame = new Game(id, myGameData.bggId, myGameData.gameName, myGameData.gameImage, myGameData.scoring, myGameData.advanced, app.currGameOnline.version);
                app.onlineGameToAdd = myNewGame;
                advanced = myGameData.advanced;
                a = advanced.split(";");
                for (var i = 0; i < a.length; i++) {
                    var lower = a[i].toLowerCase();
                    b = a[i].split("|");
                    sMath = "";
                    if (lower.indexOf("type=math") >= 0) {
                        sMath = "Math: ";
                    }
                    if (lower.indexOf("type=counter") >= 0) {
                        sMath = "Counter: ";
                    }
                    if (lower.indexOf("type=combo") >= 0) {
                        sMath = "Combo: ";
                    }
                    if (lower.indexOf("type=toggle") >= 0) {
                        sMath = "Toggle: ";
                    }
                    if (lower.indexOf("factions=") >= 0) {
                        sMath = "Factions: ";
                    }
                    if (lower.indexOf("rounds=") >= 0) {
                        sMath = "Rounds: ";
                    }
                    if (lower.indexOf("pickrounds=") >= 0) {
                        sMath = "Pick Rounds: ";
                    }
                    if (lower.indexOf("type=footnote") >= 0) {
                        sMath = "Footnote: ";
                    }
                    if (lower.indexOf("type=tally") >= 0) {
                        sMath = "Tally: ";
                    }
                    if (lower.indexOf("type=hiddentally") >= 0) {
                        sMath = "Hidden Tally: ";
                    }
                    if (lower.indexOf("lowpointswin=") >= 0) {
                        sMath = "Low Points Win: ";
                    }

                    for (var j = 0; j < b.length; j++) {
                        c = b[j].split("=");
                        if (c[0].toLowerCase() === "name") {
                            sFeatures = sFeatures + sMath + c[1] + "\n";
                        } else if (c[0].toLowerCase() == "factions") {
                            if (sMath === "Factions: ") {
                                sFeatures = sFeatures + sMath + c[1] + "\n";
                            }
                        } else if (c[0].toLowerCase() == "pickrounds") {
                            if (sMath === "Pick Rounds: ") {
                                sFeatures = sFeatures + sMath + c[1] + "\n";
                            }
                        } else if (c[0].toLowerCase() == "rounds") {
                            if (sMath === "Rounds: ") {
                                sFeatures = sFeatures + sMath + c[1] + "\n";
                            }
                        } else if (c[0].toLowerCase() == "lowpointswin") {
                            if (sMath === "Low Points Win: ") {
                                sFeatures = sFeatures + sMath + c[1] + "\n";
                            }
                        }
                    }

                }
                //console.log("features: " + sFeatures);
                $elTxtOnlineGameFeatures.css('height', '50px');
                $elTxtOnlineGameFeatures.val(sFeatures);
                if (callback) {
                    callback();
                }
            });
        });
    },

    writeGamesToPage: function(pageName, callback) {
        var $el;
        var $el2;
        var $elPrev;
        var $elSearch;
        var $elSearchDiv;
        var $elNext;
        var i;
        var l = 0;
        var m = 0;
        var n = 0;
        var s;
        var sClass = "";
        var bWrite = true;
        var iCount = 0;
        var toAppend = "";

                
        //console.log("writeGamesToPage: " + pageName);
        switch (pageName) {
            case "games":
                l = app.currGames.length;
                m = app.currGamesPaused.length;
                //console.log("app.currGames: " + l);

                $el = $('#game-list');
                $el2 = $('#paused-game-list');
                $elSearch = $('#search-key');

                $el.empty();
                $el2.empty();

                var sPlayers = "";

                if (m > 0) {

                    $el2.show();
                    $el2.append('<li data-role="list-divider" role="heading">Paused Games</li>');
                    for (i = 0; i < m; i++) {
                        var myPlayers = app.currGamesPaused[i].players;
                        n = myPlayers.length;
                        sPlayers = "";
                        for (var j = 0; j < n; j++) {
                            var myPlayer = myPlayers[j];
                            //console.log("Player: ");
                            //console.log(myPlayer);
                            if (sPlayers !== "") {
                                sPlayers += " - ";
                            }
                            //console.log(app.currGamesPaused[i]);
                            //console.log("scoreType: " + app.currGamesPaused[i].game.scoreType.toLowerCase());
                            if (app.currGamesPaused[i].game.scoreType.toLowerCase() === "hiddentally") {
                                sPlayers += myPlayer.player.name + " (???)";
                            } else {
                                sPlayers += myPlayer.player.name + " (" + myPlayer.points + ")";
                            }

                            //console.log("sPlayers: " + sPlayers);
                        }
                        //console.log(app.currGamesPaused[i]);
                        var myPausedGame = app.currGamesPaused[i].game;
                        //console.log(myPausedGame);
                        s += myPausedGame.name + "\n";
                        toAppend = '<li id="' + app.currGamesPaused[i].id + '" data-icon="arrow-r"><a href="#"><img src="' + myPausedGame.icon + '" /><h3>' + myPausedGame.name + '</h3><p>' + sPlayers + '</p></a></li>';
                        //console.log(toAppend);
                        $el2.append(toAppend);
                        $el2.listview("refresh");
                    }
                    
                    //console.log("setting app.lastGamePausedLoad: " + app.lastGamePausedLoad);
                } else {
                    
                    $el2.hide();
                }

                $el.append('<li data-role="list-divider" role="heading">Installed Games<span style="float: right; margin-right: 0px;">Favorite</span></li>');
                for (i = 0; i < l; i++) {
                    s += app.currGames[i].name + "\n";

                    if (app.currGames[i].favorite === true) {
                        sClass = "ui-btn-pressed";
                    } else {
                        sClass = "ui-btn-not-pressed";
                    }

                    if (app.bOnlyFav === true) {
                        if (app.currGames[i].favorite === true) {
                            bWrite = true;
                        } else {
                            bWrite = false;
                        }
                    } else {
                        bWrite = true;
                    }

                    if (app.currGames[i].hidden === true) {
                        bWrite = false;
                    }

                    if (bWrite === true) {
                        iCount++;
                        //console.log(app.currGames[i].icon);
                        toAppend = '<li id="' + app.currGames[i].id + '"><a id="gameLink' + app.currGames[i].id + '" class="gameLink" href="#"><img src="' + app.currGames[i].icon + '" /><h3>' + app.currGames[i].name + '</h3></a><a class="' + sClass + '" id="favStar' + app.currGames[i].id + '" href="#"></a></li>';
                        //console.log(toAppend);
                        $el.append(toAppend);
                        $el.listview("refresh");
                    }

                    //$('#writegames').text(s); //list all games
                }
                
                if (iCount === 0) {
                    if ($elSearch.val() === "" || app.bOnlyFav === true) {
                        $el.append("<li id='AddGame'><a href='#popupAddGame' data-rel='popup' data-transition='slidedown' class='noneFound'><h3>No Games Found</h3><p>Use the Add Game button to create your game library</p></a></li>");
                    } else {
                        $elSearch = $('#search-key');
                        $el.append("<li id='SearchGame'><a href='#' id='gameSearch' class='gameSearch'><h3>No games matched your criteria.</h3><p>Click to search the ScoreGeek Games Database for " + $elSearch.val() + ".</p></a></li>");
                    }

                    $el.listview("refresh");

                }
                app.lastGamePausedLoad = getTimestamp();
                app.lastGameLoad = getTimestamp();
                //console.log("setting app.lastGameLoad: " + app.lastGameLoad);
                //console.log("setting app.lastGamePausedLoad: " + app.lastGamePausedLoad);
                break;
            case "online":
                l = app.currGamesOnline.length;
                //console.log("l=" + l);
                $el = $('#onlinegame-list');
                $elSearch = $('#search-key2');
                $elNext = $('#divNextOnline');
                $elPrev = $('#divPrevOnline');
                $elSearchDiv = $('#divSearchBGG');

                $el.empty();
                $el.append('<li data-role="list-divider" role="heading">Games</li>');
                for (i = 0; i < l; i++) {
                    s += app.currGamesOnline[i].name + "\n";



                    iCount++;
                    $el.append('<li id="' + app.currGamesOnline[i].id + '"><a href="#"><img src="' + app.currGamesOnline[i].icon + '" /><h3>' + app.currGamesOnline[i].name + '</h3></a></li>');
                    $el.listview("refresh");

                    //$('#writegames').text(s); //list all games
                }
                if (app.bCurrGamesOnline === true) {
                    $elNext.show();
                } else {
                    $elNext.hide();
                }

                //console.log("app.currGamesOnline: " + app.currGamesOnline);
                if (app.iCurrGamesOnline > 11) {
                    $elPrev.show();
                } else {
                    $elPrev.hide();
                }

                if ($elSearch.val().trim() !== '') {
                    $elSearchDiv.show();
                } else {
                    $elSearchDiv.hide();
                }

                if (iCount === 0) {
                    if ($elSearch.val() === "") {
                        $el.append("<li id=''><a href='#'><h3>No games found.</h3></a></li>");
                        $elNext.hide();
                    } else {
                        $el.append("<li id=''><a href='#'><h3>No games matched your criteria.</h3></a></li>");
                        $elNext.hide();
                    }

                    $el.listview("refresh");

                } else {
                    app.wroteGames = true;
                }
                break;

            case "edit":
                l = app.currGames.length;
                $el = $('#edit-game-list');
                $el.empty();
                $el.append('<li data-role="list-divider" role="heading">Select a game to edit</li>');
                if (l === 0) {
                    $el.append('<li><h3>No games were found.</h3></li>');
                    $el.listview("refresh");
                } else {
                    for (i = 0; i < l; i++) {
                        toAppend = '<li id="' + app.currGames[i].id + '"><a href="#editgame"><img src="' + app.currGames[i].icon + '" /><h3>' + app.currGames[i].name + '</h3></a></li>';
                        //console.log(toAppend);
                        $el.append(toAppend);
                        $el.listview("refresh");
                    }
                }
                break;
            case "delete":
                l = app.currGames.length;
                $el = $('#delete-game-list');
                $el.empty();
                $el.append('<li data-role="list-divider" role="heading">Select a game to delete</li>');
                if (l === 0) {
                    $el.append('<li><h3>No games were found.</h3></li>');
                    $el.listview("refresh");
                } else {
                    for (i = 0; i < l; i++) {
                        toAppend = '<li id="' + app.currGames[i].id + '"><a href="#promptForDeleteGame"><img src="' + app.currGames[i].icon + '" /><h3>' + app.currGames[i].name + '</h3></a></li>';
                        //console.log(toAppend);
                        $el.append(toAppend);
                        $el.listview("refresh");
                    }
                }
        }

        if (callback !== undefined) {
            //console.log("write games callback");
            callback();
        }
    },

    writePlayersToPage: function(pageName, callback) {
        //console.log('writePlayersToPage: ' + pageName );
        var sWinner = "";
        var $el;
        var i;
        var l;
        var j;
        var p;
        var iFound = 0;
        var bTeams = false;
        var sTeam;
        var sFaction;
        var sPosition;
        var option = "";
        var option2 = "";
        var option3 = "";
        var append = "";
        var toAppend = "";
        var checked = "";
        var sHidden = "";
        var youLose = "";
        var playerIcon = "";
        var imgSrc="";
        if (app.currGameDetails !== undefined && app.currGameDetails !== null) {
            if (app.currGameDetails.useTeams === true) {
                bTeams = true;
            }
        }
        if (app.currGameDetails !== null) {
            if (app.currGameDetails.winners.length === 0) {
                youLose = ": You Lost";
            } else {
                youLose = "";
            }
        }
        //console.log(pageName);
        switch (pageName) {
            case "players":
                app.currPlayers.sort(dynamicSort('name'));
                l = app.currPlayers.length;
                $el = $('#player-list');
                $el.empty();

                $el.append('<legend>Select which players will play this game:</legend>');
                for (i = 0; i < l; i++) {

                    if (app.lastSelectedPlayerIds.indexOf(app.currPlayers[i].id) !== -1) {
                        checked = " checked";
                    } else {
                        checked = "";
                    }

                    $el.append('<input id="player' + app.currPlayers[i].id + '" name="player' + app.currPlayers[i].id + '" value="' + app.currPlayers[i].id + '" data-theme="a" type="checkbox"' + checked + '><label for="player' + app.currPlayers[i].id + '">' + app.currPlayers[i].name + '</label>');

                }
                if (l === 0) {
                    $el.append("<p><b>No players found. Use the Add Player button.</b></p>");
                }
                $("input[type='checkbox']").checkboxradio().checkboxradio("refresh");
                break;
            case "playerOrder":
                //console.log("write players");
                l = app.currGameDetails.players.length;
                $el = $('#sortable');
                $el.empty();
                //$el.append('<li data-role="list-divider">Drag to select player order</li>');
                //console.log("l: " + l);
                for (i = 0; i < l; i++) {
                    p = app.currGameDetails.players[i];

                    //console.log(p.player.icon);
                    sTeam = "";
                    sFaction = "";
                    if (p.faction !== "") {
                        sFaction = "<p>" + p.faction + "</p>";
                    }
                    if (p.team !== "") {
                        sTeam = "<p>" + p.team + "</p>";
                    }

                    //$el.append('<li id="' + app.currGames[i].id + '" data-icon="gear"><a id="gameLink' + app.currGames[i].id + '" class="gameLink" href="#"><img src="' + app.currGames[i].icon + '" /><h3>' + app.currGames[i].name + '</h3></a><a class="' + sClass + '" id="favStar' + app.currGames[i].id + '" href="#"></a></li>');

                    if (p.color === "") {
                        $el.append('<li id="' + p.player.id + '"><a class="playerMove" href="#"><img src="' + p.player.icon + '" /><h3>' + p.player.name + '</h3>' + sTeam + sFaction + '</a><a id="' + p.player.id + '" class="app.playerEdit" href="#"></a></li>');

                    } else {
                        $el.append('<li id="' + p.player.id + '"><a class="playerMove" href="#"><img src="img/colors/' + p.color + '0032.png" class="colorMain" /><img height="80" width="80" class="colorOverlay" src="' + p.player.icon + '" /><h3>' + p.player.name + '</h3>' + sTeam + sFaction + '</a><a id="' + p.player.id + '" class="app.playerEdit" href="#"></a></li>');

                    }
                    $el.listview("refresh");
                    //console.log("wrote player order");
                }
                break;
            case "playerTie":
                //console.log("[WRITEPLAYERS]: Tie");
                $el = $('#player-tie');
                $el.empty();

                if (bTeams === true) {
                    l = app.currGameDetails.teams.length;
                    //console.log("[WRITEPLAYERS]: Teams: " + l);
                    $el.append('<h3>Tie Game!</h3><p>These teams are tied.  Please use any tie-breaking methods available to select the winners(s).</p>');
                    for (i = 0; i < l; i++) {
                        p = app.currGameDetails.teams[i];
                        //console.log(p);
                        if (p.winner === true) {
                            toAppend = '<input id="playertie' + p.player.id + '" name="player' + p.player.id + '" value="' + p.player.id + '" data-theme="a" type="checkbox"><label for="playertie' + p.player.id + '">' + p.player.name + ' ( ' + p.points + ' points)</label>';
                            //console.log('[WRITEPLAYERS]: ' + toAppend);
                            $el.append(toAppend);
                        }
                    }
                } else {
                    l = app.currGameDetails.players.length;
                    //console.log("[WRITEPLAYERS]: Players: " + l);
                    $el.append('<h3>Tie Game!</h3><p>These players are tied.  Please use any tie-breaking methods available to select the winners(s).</p>');
                    for (i = 0; i < l; i++) {
                        p = app.currGameDetails.players[i];
                        //console.log(p);
                        if (p.winner === true) {
                            //console.log('[WRITEPLAYERS]: ' + toAppend);
                            toAppend = '<input id="playertie' + p.player.id + '" name="player' + p.player.id + '" value="' + p.player.id + '" data-theme="a" type="checkbox"><label for="playertie' + p.player.id + '">' + p.player.name + ' ( ' + p.points + ' points)</label>';
                            $el.append(toAppend);
                        }
                    }
                }
                $("input[type='checkbox']").checkboxradio().checkboxradio("refresh");
                $el.listview();
                $el.listview("refresh");
                break;
            case "playerResults":
                if (bTeams === true) {
                    l = app.currGameDetails.teams.length;
                } else {
                    l = app.currGameDetails.players.length;
                }


                $el = $('#player-results');
                $el.empty();
                $el.append('<li data-role="list-divider">Results' + youLose + '</li>');
                for (i = 0; i < l; i++) {
                    iFound = 0;
                    imgSrc = "";
                    sTeam = "";
                    sFaction = "";


                    if (bTeams === true) {
                        p = app.currGameDetails.teams[i];
                    } else {
                        p = app.currGameDetails.players[i];
                        if (p.faction !== "") {
                            sFaction = " - " + p.faction;
                        }
                    }

                    if (p.winner === true) {
                        sWinner = "- Winner!";
                    } else {
                        sWinner = "";
                    }

                    sTeam = "";
                    sFaction = "";
                    if (p.faction !== "") {
                        sFaction = " - " + p.faction;
                    }
                    if (p.team !== "") {
                        sTeam = " [ " + p.team + " ]";
                    }



                    if (bTeams === true) {
                        imgSrc = '<img class="teamMain" src="' + app.currGameDetails.teams[i].player.icon + '" />';
                        for (j = 0; j < app.currGameDetails.players.length; j++) {

                            if (app.currGameDetails.players[j].team === app.currGameDetails.teams[i].player.name) {
                                imgSrc += '<img class="teamOverlay' + (iFound + 1) + '" src="' + app.currGameDetails.players[j].player.icon + '">';
                                iFound++;
                            }
                            if (iFound === 4) {
                                break;
                            }
                        }
                    } else {

                        if (p.color === "") {
                            imgSrc = '<img src="' + p.player.icon + '" />';
                        } else {
                            imgSrc = '<img src="img/colors/' + p.color + '0032.png" class="colorMain" /><img class="colorOverlay" src="' + p.player.icon + '" />';

                        }
                    }
                    append = '<li id="' + p.player.id + '">' + imgSrc + '<h3>' + p.points + ' points ' + sWinner + '</h3><p>' + p.player.name + sTeam + sFaction + '</li>';
                    //console.log("Append: " + append);
                    $el.append(append);
                    $el.listview("refresh");
                }

                break;
            case "playerResults2":
                //console.log("players:");
                //console.log(app.currGameDetails.players);
                app.currGameDetails.players.sort(dynamicSort("-points"));
                l = app.currGameDetails.players.length;
                $el = $('#player-results-2');
                $el.empty();
                $el.append('<li data-role="list-divider" role="heading">Results<span style="float: right; margin-right: 0px;">Share</span></li>');
                for (i = 0; i < l; i++) {
                    iFound = 0;
                    imgSrc = "";
                    sTeam = "";
                    sFaction = "";



                    p = app.currGameDetails.players[i];
                    if (p.faction !== "") {
                        sFaction = " - " + p.faction;
                    }

                    if (p.winner === true) {
                        sWinner = "- Winner!";
                        if (i === 0) {
                            option = '<a class="share" href="#"></a>';
                            option2 = '<a href="#">';
                            option3 = '</a>';
                        } else {
                            option = "";
                            option2 = "";
                            option3 = "";
                        }

                    } else {
                        sWinner = "";
                        option = "";
                        option2 = "";
                        option3 = "";
                    }

                    if (p.color === "") {
                        imgSrc = '<img src="' + p.player.icon + '" />';
                    } else {
                        imgSrc = '<img src="img/colors/' + p.color + '0032.png" class="colorMain" /><img class="colorOverlay" src="' + p.player.icon + '" />';

                    }

                    append = '<li>' + option2 + imgSrc + '<h3>' + p.points + ' points ' + sWinner + '</h3><p class="desc">' + p.player.name + sTeam + sFaction + '</p>' + option3 + option + '</li>';
                    //console.log(append);
                    $el.append(append);

                    $el.listview("refresh");
                }

                break;
            case "testResults":
                if (bTeams === true) {
                    l = app.currGameDetails.teams.length;
                } else {
                    l = app.currGameDetails.players.length;
                }


                $el = $('#test-player-results');
                $el.empty();
                $el.append('<li data-role="list-divider">Test Results' + youLose + '</li>');
                for (i = 0; i < l; i++) {
                    iFound = 0;
                    imgSrc = "";
                    sTeam = "";
                    sFaction = "";


                    if (bTeams === true) {
                        p = app.currGameDetails.teams[i];
                    } else {
                        p = app.currGameDetails.players[i];
                        if (p.faction !== "") {
                            sFaction = " - " + p.faction;
                        }
                    }

                    if (p.winner === true) {
                        sWinner = " - Winner!";
                    } else {
                        sWinner = "";
                    }

                    sTeam = "";
                    sFaction = "";
                    if (p.faction !== "") {
                        sFaction = " - " + p.faction;
                    }
                    if (p.team !== "") {
                        sTeam = " [ " + p.team + " ]";
                    }


                    if (bTeams === true) {
                        imgSrc = '<img class="teamMain" src="' + app.currGameDetails.teams[i].player.icon + '" />';
                        for (j = 0; j < app.currGameDetails.players.length; j++) {

                            if (app.currGameDetails.players[j].team === app.currGameDetails.teams[i].player.name) {
                                imgSrc += '<img class="teamOverlay' + (iFound + 1) + '" src="' + app.currGameDetails.players[j].player.icon + '">';
                                iFound++;
                            }
                            if (iFound === 4) {
                                break;
                            }
                        }
                    } else {

                        if (p.color === "") {
                            imgSrc = '<img src="' + p.player.icon + '" />';
                        } else {
                            imgSrc = '<img src="img/colors/' + p.color + '0032.png" class="colorMain" /><img class="colorOverlay" src="' + p.player.icon + '" />';

                        }
                    }
                    //console.log("Img Src= " + imgSrc);
                    $el.append('<li id="' + p.player.id + '">' + imgSrc + '<h3>' + p.points + ' points ' + sWinner + '</h3><p class="desc">' + p.player.name + sTeam + sFaction + '</li>');
                    $el.listview("refresh");
                }

                break;
            case "edit":
                app.currPlayers.sort(dynamicSortMultiple("hiddenOnDevice", "name"));
                //console.log(app.currPlayers);
                l = app.currPlayers.length;
                $el = $('#edit-player-list');
                $el.empty();
                $el.append('<li data-role="list-divider" role="heading">Select a player to edit</li>');


                if (l === 0) {
                    $el.append('<li>None found</li>');
                    $el.listview("refresh");
                } else {
                    for (i = 0; i < l; i++) {
                        if (app.currPlayers[i].hiddenOnDevice === true) {
                            sHidden = " (Hidden)";
                        } else {
                            sHidden = "";
                        }
                        $el.append('<li id="' + app.currPlayers[i].id + '"><a href="#editplayer"><img src="' + app.currPlayers[i].icon + '" /><h3>' + app.currPlayers[i].name + sHidden + '</h3></a></li>');
                        $el.listview("refresh");
                    }
                }
                break;
            case "delete":
                l = app.currPlayers.length;
                $el = $('#delete-player-list');
                $el.empty();
                $el.append('<li data-role="list-divider" role="heading">Select a player to delete</li>');

                if (l === 0) {
                    $el.append('<li>None found</li>');
                    $el.listview("refresh");
                } else {
                    for (i = 0; i < l; i++) {
                        $el.append('<li id="' + app.currPlayers[i].id + '"><a href="#promptForDeletePlayer"><img src="' + app.currPlayers[i].icon + '" /><h3>' + app.currPlayers[i].name + '</h3></a></li>');
                        $el.listview("refresh");
                    }
                }
                break;
        }
        if (callback !== undefined) {
            callback();
        }
    },

    writePausedValues: function(callback) {
        var sId = "";
        var item;
        var itemType;
        var elementType;
        var history;
        var $el;
        var j;
        var k;
        var total=0;
        var m;
        var n;
        if (app.currGameDetails.paused === true) {
            //console.log(app.currGameDetails);
            var l = app.currGameDetails.savedItems.length;
            for (var i = 0; i < l; i++) {
                item = app.currGameDetails.savedItems[i];
                //console.log(item);
                sId = item.id;
                $el = $('#' + sId);
                elementType = $el.prop('tagName');
                itemType = $el.prop('className');
                //console.log(elementType);
                //console.log(itemType);
                switch (elementType) {
                    case "INPUT":
                        $el.val(item.value);
                        break;
                    case "SELECT":
                        //console.log(item);
                        //console.log($el);
                        //console.log(itemType);

                        switch (itemType) {
                            case "ui-slider-switch":
                                //console.log("Refresh slider");
                                $el.flipswitch();
                                $el.val(item.value).flipswitch('refresh');
                                break;
                            case "":
                                //console.log("Refresh select");
                                $el.selectmenu();
                                $el.val(item.value).selectmenu('refresh');
                                break;
                        }

                        break;
                }
                
                n = app.currGameDetails.tallyHistory.length;
                for (k=0;k<n;k++) {
                    item = app.currGameDetails.tallyHistory[k];
                    sId = "total" + item.id;   
                    m = item.history.length;
                    total = 0;
                    for (j=0;j<m;j++) {
                        total += item.history[j];
                    }
                    $el = $('#' + sId);
                    $el.val(total);
                }
            }
        }
        callback();
    },
    
    getScoreDataButtons: function(myItem) {
        var dataButtons = "";
            dataButtons += ' data-button1="' + myItem.button1 + '" ';
            dataButtons += ' data-buttonHalf="' + myItem.buttonHalf + '" ';
            dataButtons += ' data-button5="' + myItem.button5 + '" ';
            dataButtons += ' data-button10="' + myItem.button10 + '" ';
            dataButtons += ' data-button50="' + myItem.button50 + '" ';
            dataButtons += ' data-button100="' + myItem.button100 + '" ';
            dataButtons += ' data-button500="' + myItem.button500 + '" ';
            dataButtons += ' data-button1000="' + myItem.button1000 + '" ';
            dataButtons += ' data-button5000="' + myItem.button5000 + '" ';
            dataButtons += ' data-button10000="' + myItem.button10000 + '" ';
            dataButtons += ' data-buttonm1="' + myItem.buttonm1 + '" ';
            dataButtons += ' data-buttonmHalf="' + myItem.buttonmHalf + '" ';
            dataButtons += ' data-buttonm5="' + myItem.buttonm5 + '" ';
            dataButtons += ' data-buttonm10="' + myItem.buttonm10 + '" ';
            dataButtons += ' data-buttonm50="' + myItem.buttonm50 + '" ';
            dataButtons += ' data-buttonm100="' + myItem.buttonm100 + '" ';
            dataButtons += ' data-buttonm500="' + myItem.buttonm500 + '" ';
            dataButtons += ' data-buttonm1000="' + myItem.buttonm1000 + '" ';
            dataButtons += ' data-buttonm5000="' + myItem.buttonm5000 + '" ';
            dataButtons += ' data-buttonm10000="' + myItem.buttonm10000 + '" '; 
            return dataButtons; 
    },
    
    getScoreButtonCount: function(myItem) {
        var itemCount = 0;
       if (myItem.buttonHalf === "true") {
            itemCount ++;
        }
        
        if (myItem.button1 !== "false") {
            itemCount ++;
        }
        
        if (myItem.button5 !== "false") {
            itemCount ++;
        }
        
        if (myItem.button10 !== "false") {
            itemCount ++;
        }
        
        if (myItem.button50 === "true") {
            itemCount ++;
        }
        
        if (myItem.button100 === "true") {
            itemCount ++;
        }
        
        if (myItem.button500 === "true") {
            itemCount ++;
        }
        
        if (myItem.button1000 === "true") {
            itemCount ++;
        }
        
        if (myItem.button5000 === "true") {
            itemCount ++;
        }
        
        if (myItem.button10000 === "true") {
            itemCount ++;
        }
        
        if (myItem.buttonmHalf === "true") {
            itemCount ++;
        }
        
        if (myItem.buttonm1 !== "false") {
            itemCount ++;
        }
        
        if (myItem.buttonm5 === "true") {
            itemCount ++;
        }
        
        if (myItem.buttonm10 === "true") {
            itemCount ++;
        }
        
        if (myItem.buttonm50 === "true") {
            itemCount ++;
        }
        
        if (myItem.buttonm100 === "true") {
            itemCount ++;
        }
        
        if (myItem.buttonm500 === "true") {
            itemCount ++;
        }
        
        if (myItem.buttonm1000 === "true") {
            itemCount ++;
        }
        
        if (myItem.buttonm5000 === "true") {
            itemCount ++;
        }
        
        if (myItem.buttonm10000 === "true") {
            itemCount ++;
        }
        
        if (myItem.scoreType === "tally" || myItem.scoreType === "hiddentally") {
            itemCount = itemCount + 2;
        }  
        return itemCount;
    },
    
    getScoreWidget: function(myItem, sId) {
        var sWidgets="";
        var dataButtons="";
        var n, k, vals;
        if (myItem.scoreType === "counter" || myItem.scoreType === "tally" || myItem.scoreType ===  "hiddentally") {
            dataButtons = app.getScoreDataButtons(myItem);
        }
        
        switch (myItem.scoreType) {
            case "counter":
                sWidgets += '<input type="tel" data-role="spinbox" data-type="horizontal" data-mini="' + myItem.isMini + '"style="width:' + myItem.myWidth + 'px" name="' + sId + '" id="' + sId + '" value="' + myItem.scoreDefault + '"';
                sWidgets += ' min="' + myItem.min + '" ';
                sWidgets += myItem.maxWrite;
                sWidgets += dataButtons;
                sWidgets += 'data-mini="' + myItem.isMini + '" />';
                break;
            case "tally":
                sWidgets += '<input type="tel" data-role="spinbox" style="width:' + myItem.myWidth + 'px;" data-type="horizontal" data-mini="' + myItem.isMini + '" name="' + sId + '" id="' + sId + '" value="' + myItem.scoreDefault + '"';

                sWidgets += ' min="' + myItem.min + '" ';
                sWidgets += myItem.maxWrite;
                sWidgets += dataButtons;
                sWidgets += ' data-tally="true" ';
                sWidgets += 'data-mini="false" />';
                sWidgets += '<label for="total' + sId + '">Total:</label><div data-role="controlgroup" data-type="horizontal" data-mini="false" style="width:auto;"><input type="tel" value="0" class="tallyTotal" name="total' + sId + '" id="total' + sId + '" /></div>';
                break;
            case "hiddentally":
                sWidgets += '<input type="tel" data-role="spinbox" data-type="horizontal" data-mini="' + myItem.isMini + '"name="' + sId + '" id="' + sId + '" value="' + myItem.scoreDefault + '"';
                sWidgets += ' min="' + myItem.min + '" ';
                sWidgets += myItem.maxWrite;
                sWidgets += dataButtons;
                sWidgets += ' data-tally="true" ';
                sWidgets += 'data-mini="false" />';
                sWidgets += '<div class="ui-field-contain"><input type="hidden" value="0" class="tallyTotal" name="total' + sId + '" id="total' + sId + '" style="width: ' + myItem.myWidth + 'px" data-mini="' + myItem.isMini +'"/></div>';
                break;
            case "combo":
                sWidgets += '<select id="' + sId + '" name="' + sId + '" data-mini="false">';
                n = myItem.scoreValues.length;
                //console.log("Combo len: " + n);
                for (k = 0; k < n; k++) {
                    vals = myItem.scoreValues[k].split("^");
                    //console.log("Adding: " + myItem.scoreValues[k]);
                    sWidgets += '<option value="' + vals[1] + '">' + vals[0] + '</option>';
                }
                sWidgets += "</select>";
                break;
            case "toggle":
                sWidgets += '<select name="' + sId + '" id="' + sId + '" data-theme="" data-role="flipswitch">';
                if (myItem !== undefined) {
                    n = myItem.scoreValues.length;
                    if (n > 0) {
                        for (k = 0; k < n; k++) {
                            vals = myItem.scoreValues[k].split("^");
                            sWidgets += '<option value="' + vals[1] + '">' + vals[0] + '</option>';
                        }
                    } else {
                        sWidgets += '<option value="0">Lost</option><option value="1">Won</option>';
                    }
                } else {
                    sWidgets += '<option value="0">Lost</option><option value="1">Won</option>';
                }

                sWidgets += '</select>';
                break;
        }
      return sWidgets;  
    },


    writeScoreWidgetsToPageByPlayer: function(bTeams, callback) {
        //console.log("writeScoreWidgetsToPageByPlayer");
        if (app.loadedWidgets === false) {
            if (app.currGameDetails.paused === false) {
                app.currGameDetails.savedItems = [];
                //console.log("resetting saved item 2");
            }
            var $el = $('#player-scores');
            //console.log("app.loadedWidgets");
            var l;

            if (bTeams === true) {
                l = app.currGameDetails.teams.length;
            } else {
                l = app.currGameDetails.players.length;
            }

            //console.log("players: " + l);
            var sInsert = "";
            var sWidgets = "";
            var sRound = "";
            var sFootnote = "";
            var n;
            var k;
            var p;
            var vals;
            var defaultVal = '0';
            var isMini="true";
            var itemCount=0;
            var myWidthB=60;
            var sTotal="";
            var myWidth;
            var asterix="*";
            
            if (Globals.bMini === true) {
                isMini = "true";
            } else {
                isMini = "false";
            }
            
            $el.empty();
            for (var i = 0; i < l; i++) {
                if (bTeams === true) {
                    p = app.currGameDetails.teams[i];
                } else {
                    p = app.currGameDetails.players[i];
                }
                //console.log(p);
                //for each player selected write a collapsible.
                sWidgets = "";
                sInsert += '<div data-role="collapsible" data-collapsed="true"><h3>' + p.player.name + '</h3>$$WIDGETS$$</div>';
                //for each round
                for (var r = 0; r < app.currGameDetails.rounds; r++) {
                    //console.log("Round " + (r + 1));
                    if (app.currGameDetails.rounds > 1) {
                        sRound = "Round " + (r + 1) + " - ";
                    }
                    var m = app.currGameDetails.scoreItems.length;
                    //console.log("Scoreitems: " + m);
                    for (var j = 0; j < m; j++) {
                        var myItem = app.currGameDetails.scoreItems[j];
                        
                        //console.log(myItem);
                        var sId = p.player.id + "_" + myItem.id + "_" + r;
                        if (myItem.scoreType.toLowerCase() === "tally" || myItem.scoreType.toLowerCase() === "hiddentally") { //it's a tally object
                            sTotal = "total";
                        } else {
                            sTotal = "";
                        }
                        if (app.currGameDetails.paused === false) {
                            var mySavedItem = new SavedItem(sTotal + sId, "");
                            app.currGameDetails.savedItems.push(mySavedItem);
                            //console.log("Adding saved item 2: ");
                            //console.log(mySavedItem);
                        }

                        //console.log("Widget Type: " + myItem.scoreType);
                        itemCount = app.getScoreButtonCount(myItem);
                        //console.log("itemcount: " + itemCount);

                        if (itemCount > 3) {
                            myItem.isMini = "true";
                            myItem.myWidth = 60;
                        } else {
                            myItem.isMini = "false";
                            myItem.myWidth = 75;
                        }

                        switch (myItem.scoreType) {
                            case "counter":
                                sWidgets += '<div class="ui-field-contain">';
                                sWidgets += '<label for="' + sId + '">' + sRound + myItem.scoreName + ':</label>';
                                sWidgets += app.getScoreWidget(myItem, sId);
                                sWidgets += "</div>";
                                //console.log("Widget: " + sWidgets);
                                break;
                            case "tally":
                                sWidgets += '<div class="ui-field-contain">';
                                sWidgets += '<label for="' + sId + '">' + sRound + myItem.scoreName + ':</label>';
                                sWidgets += app.getScoreWidget(myItem, sId);
                                sWidgets += "</div>";
                                //console.log("Widget: " + sWidgets);
                                break;
                            case "hiddentally":
                                sWidgets += '<div class="ui-field-contain">';
                                sWidgets += '<label for="' + sId + '">' + sRound + myItem.scoreName + ':</label>';
                                sWidgets += app.getScoreWidget(myItem, sId);
                                sWidgets += "</div>";
                                //console.log("Widget: " + sWidgets);
                                break;
                            case "combo":
                                //insert a combobox with values listed in Values
                                sWidgets += '<div class="ui-field-contain">';
                                sWidgets += '<label for="' + sId + '">' + sRound + myItem.scoreName + ':</label>';
                                sWidgets += app.getScoreWidget(myItem, sId);
                                sWidgets += "</div>";
                                break;
                            case "toggle":
                                // insert a toggle
                                sWidgets += '<div class="ui-field-contain">';
                                sWidgets += '<label for="' + sId + '">' + sRound + myItem.scoreName + ':</label>';
                                sWidgets += app.getScoreWidget(myItem, sId);
                                sWidgets += "</div>";
                                break;
                            case "footnote":
                                //insert text as p
                                if (myItem.scoreName.indexOf("*") === -1) {
                                    asterix = "*";
                                } else {
                                    asterix = "";
                                }
                                if (sFootnote.indexOf(asterix + myItem.scoreName) === -1) {
                                    
                                    sFootnote += '<p><i>' + asterix + myItem.scoreName + '</i></p>';
                                }
                                break;
                            case "factions":
                                break;
                            case "skip":
                                break;
                            case "pickrounds":
                                break;
                            case "coop":
                                break;
                            default:
                                //Toast.toast("unknown type: " + app.currGameDetails.scoreItems[j].scoreType);
                                break;
                        }
                        
                    }
                }
                sInsert = sInsert.replace("$$WIDGETS$$", sWidgets);
            }

            if (i === l) {
                sInsert += sFootnote;
            }


            $el.append(sInsert).enhanceWithin();
            app.loadedWidgets = true;
        }
        if (callback !== undefined) {
            callback();
        }
    },


    writeScoreWidgetsToPageByCategory: function(bTeams, callback) {
        if (app.loadedWidgets === false) {
            if (app.currGameDetails.paused === false) {
                app.currGameDetails.savedItems = [];
                //console.log("resetting saved items");
            }
            var $el = $('#player-scores');
            var l = app.currGameDetails.scoreItems.length;
            //console.log("len: " + l);
            var sInsert = "";
            var sRound = "";
            var sFootnote = "";
            var m;
            var n;
            var k;
            var vals;
            var p;
            var isMini="false";
            var myWidth="60";
            var asterix = "*";
            var itemCount = 0;
            
            if (Globals.bMini === true) {
                isMini = "true";
            } else {
                isMini = "false";
            }

            $el.empty();
            for (var i = 0; i < l; i++) {
                var sWidgets = "";
                var myItem = app.currGameDetails.scoreItems[i];
                //for each category write a collapsible.
                //console.log("scorename: " + myItem.scoreName);
                if (myItem.scoreName !== "") {
                    //for each round
                    for (var r = 0; r < app.currGameDetails.rounds; r++) {
                        sWidgets = "";
                        if (app.currGameDetails.rounds > 1) {
                            sRound = "Round " + (r + 1) + " - ";
                        }

                        //for each score widget write it to page
                        //console.log(myItem);

                        if (myItem.scoreType == 'counter' || myItem.scoreType == "combo" || myItem.scoreType == "toggle" || myItem.scoreType == "tally" || myItem.scoreType == "hiddentally") {
                            //console.log("scoreitem: " + myItem.scoreName);
                            //console.log("scoretype: " + myItem.scoreType);
                            sInsert += '<div data-role="collapsible" data-collapsed="true"><h3>' + sRound + myItem.scoreName + '</h3>$$WIDGETS$$</div>';
                        }

                        if (bTeams === true) {
                            m = app.currGameDetails.teams.length;
                        } else {
                            m = app.currGameDetails.players.length;
                        }

                        for (var j = 0; j < m; j++) {
                            if (bTeams === true) {
                                p = app.currGameDetails.teams[j];
                            } else {
                                p = app.currGameDetails.players[j];
                            }

                            //for each score widget write it to page
                            //console.log(app.currGameDetails.players);
                            //console.log(p);

                            
                            var sId = p.player.id + "_" + myItem.id + "_" + r;

                            if (app.currGameDetails.paused === false) {
                                var mySavedItem = new SavedItem(sId, "");
                                app.currGameDetails.savedItems.push(mySavedItem);
                                //console.log("Adding saved item: ");
                                //console.log(mySavedItem);
                            }
                            
                        
                        itemCount = app.getScoreButtonCount(myItem);


                        if (itemCount > 3) {
                            myItem.isMini = "true";
                            myItem.myWidth = 45;
                        } else {
                            myItem.isMini = "false";
                            myItem.myWidth = 60;
                        }

                            
                            switch (myItem.scoreType) {
                                case "counter":
                                    // insert a spinbox
                                    sWidgets += '<div class="ui-field-contain">';
                                    sWidgets += '<label for="' + sId + '">' + p.player.name + ':</label>';
                                    sWidgets += app.getScoreWidget(myItem, sId);
                                    sWidgets += "</div>";
                                    break;

                                case "tally":
                                    sWidgets += '<div class="ui-field-contain">';                                
                                    sWidgets += '<label for="' + sId + '">' + p.player.name + ':</label>';
                                    sWidgets += app.getScoreWidget(myItem, sId);
                                    sWidgets += "</div>";
                                    break;
                                case "hiddentally":
                                    sWidgets += '<div class="ui-field-contain">';
                                    sWidgets += '<label for="' + sId + '">' + p.player.name + ':</label>';
                                    sWidgets += app.getScoreWidget(myItem, sId);
                                    sWidgets += "</div>";
                                    break;
                                case "combo":
                                    //insert a combobox with values listed in Values
                                    sWidgets += '<div class="ui-field-contain">';
                                    sWidgets += '<label for="' + sId + '">' + sRound + p.player.name + ':</label>';
                                    sWidgets += app.getScoreWidget(myItem, sId);
                                    sWidgets += "</div>";
                                    break;
                                case "toggle":
                                    // insert a toggle
                                    sWidgets += '<div class="ui-field-contain">';
                                    sWidgets += '<label for="' + sId + '">' + sRound + p.player.name + ':</label>';
                                    sWidgets += app.getScoreWidget(myItem, sId);
                                    sWidgets += "</div>";
                                    break;
                                case "footnote":
                                    if (myItem.scoreName.indexOf("*") === -1) {
                                        asterix = "*";
                                    } else {
                                        asterix = "";
                                    }
                                    if (sFootnote.indexOf(asterix + myItem.scoreName) === -1) {
                                        sFootnote += '<p><i>' + asterix + myItem.scoreName + '</i></p>';
                                    }
                                    break;
                                case "skip":
                                    break;
                                case "pickrounds":
                                    break;
                                case "coop":
                                    break;
                                default:
                                    //Toast.toast("unknown type: " + app.currGameDetails.scoreItems[i].scoreType);
                                    break;
                            }
                        }
                        sInsert = sInsert.replace("$$WIDGETS$$", sWidgets);
                        //console.log("replacing widgets with: " + sWidgets);
                    }
                }
            }

            sInsert += sFootnote;

            $el.append(sInsert).enhanceWithin();
            app.loadedWidgets = true;
        }

        if (callback !== undefined) {
            callback();
        }
    },

    drawCharts: function(gameName, callback) {
        //console.log("gameName: " + gameName);
        if (gameName === "" || gameName === undefined) {
            gameName = "All Games";
        }
        $.jqplot.config.enablePlugins = true;
        //console.log("drawcharts");
        var s;
        var plot1;
        var plot2;
        var plot3;
        var plot4;

        app.bStatTotalWins = true;
        app.bStatWinPercent = true;
        app.bStatAvgScore = true;
        app.bStatTopTen = true;
        var $elHeader = $('#clickToShare');

        // app.statTotalWins = [];
        // app.statWinPercent = [];
        // app.statAvgScore = [];
        // app.statTopTen = [];

        if (app.statTotalWins.length === 0) {
            app.bStatTotalWins = false;
        }

        if (app.statWinPercent.length === 0) {
            app.bStatWinPercent = false;
        }

        if (app.statAvgScore.length === 0) {
            app.bStatAvgScore = false;
        }

        if (app.statTopTen.length === 0) {
            app.bStatTopTen = false;
        }

        if (app.bStatTotalWins === false && app.bStatWinPercent === false && app.bStatAvgScore === false && app.bStatTopTen === false) {
            Toast.toast("No data matched your filters");
            $elHeader.hide();
        } else {
            if (Device.platform !== "WinPhone" && Device.platform !== "Browser") {
                $elHeader.show();   
            }
        }

        $("#pie1").html('');
        $("#bar1").html('');
        $("#bar2").html('');
        $("#bar3").html('');

        if (gameName === "All Games") {
            app.bStatAvgScore = false;
            app.bStatTopTen = false;
        }


        //console.log("app.bStatTotalWins: " + app.bStatTotalWins);
        if (app.bStatTotalWins === true) {
            //console.log("app.statTotal    Wins: " + app.statTotalWins)
            plot1 = jQuery.jqplot('pie1', [app.statTotalWins], {
                seriesDefaults: {
                    // Make this a pie chart.
                    renderer: jQuery.jqplot.PieRenderer,
                    rendererOptions: {
                        // Put data labels on the pie slices.
                        // By default, labels show the percentage of the slice.
                        showDataLabels: true,
                        sortData: false
                    }
                },
                legend: {
                    show: true,
                    location: 'e'
                },
                title: gameName + " - Total Wins"
            });
        }

        if (app.bStatWinPercent === true) {
            //console.log("app.statWinPercent: " + [app.statWinPercent])
            //console.log(app.statWinPercent)

            plot2 = jQuery.jqplot('bar1', [app.statWinPercent], {
                title: gameName + " - Chance of Winning",
                animate: !$.jqplot.use_excanvas,
                seriesDefaults: {
                    renderer: $.jqplot.BarRenderer,
                    rendererOptions: {
                        // Set the varyBarColor option to true to use different colors for each bar.
                        // The default series colors are used.
                        barPadding: 1,
                        barMargin: 15,
                        barDirection: 'vertical',
                        barWidth: 50,
                        varyBarColor: true
                    },
                    pointLabels: {
                        show: true,
                        location: 'e',
                        edgeTolerance: -15
                    }
                },
                axesDefaults: {
                    tickRenderer: $.jqplot.CanvasAxisTickRenderer,
                    tickOptions: {
                        angle: -80,
                        fontSize: '10pt'
                    }
                },
                axes: {
                    xaxis: {
                        renderer: $.jqplot.CategoryAxisRenderer
                    }
                }
            });
        }

        if (app.bStatAvgScore === true) {
            //console.log("app.statAvgScore: " + [app.statAvgScore])
            plot3 = jQuery.jqplot('bar2', [app.statAvgScore], {
                title: gameName + " - Average Score",
                animate: !$.jqplot.use_excanvas,
                seriesDefaults: {
                    renderer: $.jqplot.BarRenderer,
                    rendererOptions: {
                        // Set the varyBarColor option to true to use different colors for each bar.
                        // The default series colors are used.
                        sortData: true,
                        barPadding: 1,
                        barMargin: 15,
                        barDirection: 'vertical',
                        barWidth: 50,
                        varyBarColor: true
                    },
                    pointLabels: {
                        show: true,
                        location: 'e',
                        edgeTolerance: -15
                    }
                },
                axesDefaults: {
                    tickRenderer: $.jqplot.CanvasAxisTickRenderer,
                    tickOptions: {
                        angle: -80,
                        fontSize: '10pt'
                    }
                },
                axes: {
                    xaxis: {
                        renderer: $.jqplot.CategoryAxisRenderer
                    }
                }
            });
        } else {
            $('#bar2').empty();
        }

        if (app.bStatTopTen === true) {
            //console.log("app.statTopTen: " + [app.statTopTen])
            plot4 = jQuery.jqplot('bar3', [app.statTopTen], {
                title: gameName + " - Top Scores",
                animate: !$.jqplot.use_excanvas,
                seriesDefaults: {
                    renderer: $.jqplot.BarRenderer,
                    rendererOptions: {
                        // Set the varyBarColor option to true to use different colors for each bar.
                        // The default series colors are used.
                        barPadding: 1,
                        barMargin: 15,
                        barDirection: 'vertical',
                        barWidth: 50,
                        varyBarColor: true
                    },
                    pointLabels: {
                        show: true,
                        location: 'e',
                        edgeTolerance: -15
                    }
                },
                axesDefaults: {
                    tickRenderer: $.jqplot.CanvasAxisTickRenderer,
                    tickOptions: {
                        angle: -80,
                        fontSize: '10pt'
                    }
                },
                axes: {
                    xaxis: {
                        renderer: $.jqplot.CategoryAxisRenderer
                    }
                }
            });
        } else {
            $('#bar3').empty();
        }

        window.onresize = function() {

            try {
                plot1.replot();
            } catch (err) {

            }

            try {
                plot2.replot();
            } catch (err) {

            }

            try {
                plot3.replot();
            } catch (err) {

            }

            try {
                plot4.replot();
            } catch (err) {

            }

        };
        if (callback !== undefined) {
            callback();
        }
    },

    getBGGImage: function(bggID, callback) {
        //console.log("Getting image for BGG ID " + bggID);
        var online = Internet.isOnline();
        var dataString = "bggId=" + encodeURIComponent(bggID);
        var imageURL="";
        if (online) {
            if (bggID !== "") {
                Internet.getURLSource('https://rebrandcloud.secure.omnis.com/extras/geekimage.asp', dataString, true, function(data) {
                    if (data) {
                        //console.log(data);
                        imageURL = data.imageURL;
                        if (imageURL.indexOf("http://") === -1) {
                            imageURL = "http://" + imageURL;
                        }
                        
                        imageURL = imageURL.replace(":////", "://");
                        imageURL = imageURL.replace(":///", "://");
                        
                        //console.log("imageURL: " + imageURL);
                        
                        if (imageURL.indexOf("/pic0_t.jpg") === -1) {
                            callback(imageURL);
                        } else {
                            Toast.toast("BGG Icon Error: No Icon Found ");
                            callback("");
                        }
                    } else {
                        callback('');
                    }
                });
            } else {
                Toast.toast("Please enter a BGG ID first");
            }
        } else {
            Toast.toast("You must be connected to the internet");
        }
    },

    getGameExport: function(forSharing, callback) {
        var $elTextNewGameName = $('#textNewGameName');
        var $elBGGID = $('#textBGGID');
        var $elSelectNewGameScoring = $('#selectNewGameScoring');
        var $elAdvancedText = $('#advancedText');
        var $elImgGameImage = $('#imgGameImage');
        var $elTextareaExportGame = $('#textareaExportGame');
        var $elNotes = $('#taNotes');
        var s = "";
        var sAdv = $elAdvancedText.val();
        var game_scoreType = $elSelectNewGameScoring.val();
        var name = $elTextNewGameName.val();
        var bggId = $elBGGID.val();
        var notes = $elNotes.val().trim();
        var sImg;
        sImg = $elImgGameImage.attr("src");
        //Toast.toast(sImg.length);
        var sImgLower = sImg.toLowerCase();


        if (app.gameEditMode === true) {
            if (sImgLower.indexOf('http://') === -1) {
                if (app.currEditGame.iconURL !== "" && app.currEditGame.iconURL !== undefined) {
                    sImg = app.currEditGame.iconURL;
                }
            }
        }

        if (forSharing === true) {
            if (sImg.length > 250) {
                sImg = "http://cf.geekdo-static.com/images/geekdo/bgg_cornerlogo.png";
            }
        }

        name = name.replace(/'/g, "&#39;");
        notes = notes.replace(/'/g, "&#39;");
        if (isNumber(bggId) === false) {
            bggId = "0";
        }
        sAdv = sAdv.replace(/'/g, "&#39;");
        sAdv = sAdv.replace(/(\r\n|\n|\r)/gm, "");



        if (game_scoreType !== "advanced") {
            sAdv = "";
        }
        

        switch (game_scoreType) {
            case "points":
                sAdv = "Name=Points|Type=Counter|Value=1|Default=0;";
                break;
            case "tally":
                sAdv = "Name=Points|Type=Tally|Value=1|Default=0;";
                break;
            case "hiddentally":
                sAdv = "Name=Points|Type=HiddenTally|Value=1|Default=0;";
                break;
            case "winLose":
                sAdv = "Name=Win/Lose|Type=Toggle;";
                break;
            case "areasControlled":
                sAdv = "Name=Areas Controlled|Type=Counter|Value=1|Default=0;";
                break;
        }

        var lower = sAdv;
        lower = lower.toLowerCase();

        var game_rounds;
        if ($('#flip-rounds').val() === "on") {
            game_rounds = true;
        } else {
            game_rounds = false;
        }

        if (game_rounds === true) {
            
            if (lower.indexOf('pickrounds=true;') === -1) {
                sAdv += "PickRounds=True;";
            }
        }
        
        var game_score;
        if ($('#flip-score').val() === "low") {
            game_score = true;
        } else {
            game_score = false;
        }

        if (game_score === true) {
            if (lower.indexOf('lowpointswin=true;') === -1) {
                sAdv += "LowPointsWin=True;";
            }
        }

        s = s + "{";
        s = s + '"comment":"ScoreGeek Game Definition",';
        s = s + '"version":"' + Globals.appVersion + '",';
        s = s + '"gameName":"' + name + '",';
        s = s + '"bggId":"' + bggId + '",';
        s = s + '"scoring":"' + game_scoreType + '",';
        s = s + '"advanced":"' + sAdv + '",';
        s = s + '"gameImage":"' + sImg + '",';
        s = s + '"notes":"' + notes + '"';
        s = s + "}";
        callback(s);
    },

    sendGameExport: function(myExport) {

        //dataString='{"dummy":"1","ajax":"1","version":"2","objecttype":"thing","objectid":"68448","playid":"","action":"save","playdate":"2013-06-24","dateinput":"2013-06-24","YIUButton":"","location":"Home","quantity":"1","length":"60","incomplete":"0","nowinstats":"0","comments":"These%20are%20some%20comments","players[1][playerid]":"","players[1][name]":"Mike","players[1][username]":"rebrandsoftware","players[1][score]":"123","players[1][color]":"blue","players[1][position]":"1","players[1][rating]":"6.1","players[1][new]":"0","players[1][win]":"0","players[2][playerid]":"","players[2][name]":"Jen","players[2][username]":"","players[2][score]":"456","players[2][color]":"green","players[2][position]":"2","players[2][rating]":"6.2","players[2][new]":"0","players[2][win]":"1"}';
        app.getSetting("shareId", "", function(shareId) {
            if (shareId === "") {
                var today = getTimestamp();
                shareId = today;
                app.saveSetting("shareId", shareId);
            }
            var dataString = 'password=scoregeek&appId=34&id=' + encodeURIComponent(shareId) + '&plugin=' + escape(myExport);
            //console.log("Datastring: " + dataString);
            Internet.getURLSource("https://rebrandcloud.secure.omnis.com/cloud/pushPlugin.asp", dataString, false, function(data) {
                if (data) {
                    Toast.toast("Thanks for sharing!");
                }
            });
            // $.ajax({
            // url: "https://rebrandcloud.secure.omnis.com/cloud/pushPlugin.asp",
            // data: dataString,
            // crossDomain: true,
            // dataType: "jsonp"
            // })
            // .done(function (data) {
            // Toast.toast("Thanks for sharing!");
            // })
            // .fail(function (xhr, err) {
            // var responseTitle = $(xhr.responseText).filter('title').get(0);
            // var response = $(xhr.responseText).filter('body').get(0);
            // //console.log(response);
            // if (Globals.bDebug === true) {
            // Toast.toast($(responseTitle).text() + "\n" + formatErrorMessage(xhr, err) ); }
            // })
            // .always(function () {
            // //console.log("complete");
            // $.mobile.loading('hide');
            // });
        });
    },

    saveScores: function() {

        //console.log("saveScores");
        var $elGameStats = $('#gameStats');
        if ($elGameStats.is(":checked")) {
            app.bStats = true;
        } else {
            app.bStats = false;
        }
        if (app.bStats === true) {


            var winner_id = 0;
            var winner_name = "";
            var winner_points = 0;
            var won = 0;
            var bggWin = 0;
            var today = new Date();
            var dd = today.getDate();
            var mm = today.getMonth() + 1; //January is 0!
            var yyyy = today.getFullYear();
            var h = today.getHours();
            var m = today.getMinutes();
            var s = today.getSeconds();
            var gamePhoto = app.lastPhoto;
            //console.log("GamePhoto: " + gamePhoto);
            var $elDate = $('#playDate');
            var dateVal = $elDate.val();
            var dateValNoTime;
            var a;
            if (dd < 10) {
                dd = '0' + dd;
            }
            if (mm < 10) {
                mm = '0' + mm;
            }
            if (h < 10) {
                h = '0' + h;
            }
            if (m < 10) {
                m = '0' + m;
            }
            if (s < 10) {
                s = '0' + s;
            }
            today = yyyy + '-' + mm + '-' + dd + 'T' + h + ':' + m + ':' + s;

            //console.log("dateVal:" + dateVal);


            if (dateVal.indexOf("/") > -1) {
                a = dateVal.split("/");
                if (a.length >= 3) {
                    if (a[2].length === 4) {
                        //mm/dd/yyyy
                        yyyy = a[2];
                        mm = a[0];
                        dd = a[1];
                    } else if (a[0].length === 4) {
                        //yyyy/mm//dd
                        yyyy = a[0];
                        mm = a[1];
                        dd = a[2];
                    } else {
                        //mm/dd/yy
                        yyyy = '20' + a[2];
                        mm = a[0];
                        dd = a[1];
                    }

                    if (dd < 10) {
                        dd = '0' + dd;
                    }
                    if (mm < 10) {
                        mm = '0' + mm;
                    }
                    

                    dateVal = yyyy + '-' + mm + "-" + dd + 'T' + h + ':' + m + ':' + s;
                }
            }
            //console.log("dateVal2:" + dateVal);
            if (dateVal === "" || dateVal === "Now" || dateVal === "mm/dd/yyyy") {
                dateVal = today;
            }
            //console.log("dateVal3:" + dateVal);
            if (dateVal.indexOf("T") === -1) {

                dateVal += "T" + h + ":" + m + ":" + s;
            }
            //console.log("DateVal3a:" + dateVal);
            a = dateVal.split("T");
            if (a.length >= 1) {
                dateValNoTime = a[0];
            }

            //console.log("dateVal4:" + dateVal);
            //console.log("dateValNoTime:" + dateValNoTime);
            var d = new Date(dateVal);
            //console.log(d);
            var gameDate = getTimestamp(d);
            //console.log("Game Date: " + gameDate);
            var $elLocation = $('#textLocation');
            var $elDuration = $('#textDuration');
            var location = $elLocation.val();
            var duration = $elDuration.val();
            var that = this;

            if (location !== "" && location !== null && location !== undefined) {
                app.addLocationData(location, function() {

                });
            }

            //console.log("Duration: " + duration);
            if (isNumber(duration) === true || duration === "") {
                if (isNumber(duration) === false) {
                    duration = 0;
                }

                if (location === "") {
                    location = "ScoreGeek";
                }

                $.mobile.loading('show');


                var notes = $('#textareaNotes').val();
                $('#textAreaNotes').focus();
                //var playDate = $('#playDate').val();
                var session_id = app.currGameDetails.id;
                //console.log("playDate: " + playDate);
                //if (playDate !== undefinded && playDate !== "") {
                //    gameDate = new Date(playDate);
                //} else {
                //    gameDate = today;
                //}
                //console.log("dateVal: " + dateVal);
                //console.log("Today: " + today);
                //console.log("SessionID: " + session_id);
                app.bPostBGG = false;
                app.saveGamesPlayed();
                //console.log("BGG");
                //console.log("app.currGame");
                var myBGGObject = new BGGObject(app.currGameDetails.game.bggId, dateValNoTime, location, duration, notes);
                app.addBGGPlayers(myBGGObject, function(myBGGObject) {
                    app.bggPost(myBGGObject, function() {

                    });
                });

                //console.log("calculate");

                for (var i = 0; i < app.currGameDetails.players.length; i++) {
                    var p = app.currGameDetails.players[i];
                    if (p.winner === true) {
                        winner_id = p.player.id;
                        winner_name = p.player.name;
                        winner_points = p.points;
                        won = -1;
                        break;
                    }
                }

                app.currGameDetails.playDate = gameDate;
                app.currGameDetails.photo = gamePhoto;

                //gamePhoto = "TOTESTWITH";

                var mySession = new Session(session_id, app.currGame.id, gameDate, notes, gamePhoto, won, location, duration);
                //addSessionData: function(session_id, game_id, winner_id, winner_name, winner_points, game_name, game_custom, game_photo, game_notes, game_date, game_won, game_location, game_duration, callback) {

                app.addSessionData(session_id, app.currGame.id, winner_id, winner_name, winner_points, app.currGame.name, "-1", gamePhoto, notes, gameDate, won, location, duration, function() {
                    //console.log("after session data");
                    app.addScoreData(session_id, function() {
                        //console.log("after add score data");
                        app.doAwards(app.currGameDetails, function() {
                            app.currHistoryDisplay = [];
                            //console.log("after do awards");
                            changePage("#game-achievements");
                        });
                    });
                });

            } else {
                Toast.toast("Please enter only numbers for duration");
                $.mobile.loading('hide');
            }
        } else {
            $.mobile.loading('hide');
            changePage("#promptForNoStats");
        }
    },

    calculateScores: function(callback) {
        //console.log("Calculate scores");
        $.mobile.loading('show', {
            text: 'Generating Score Sheet',
            textVisible: true,
            theme: 'a',
            html: ""
        });
        var $elScoreDetailsTable = $('#score-details-table');
        $elScoreDetailsTable.empty();
        var score = 0;
        var l;
        var m;
        var k;
        var i;
        var j;
        var p;

        var x;
        var z;
        var bTeams = false;
        if (app.currGameDetails.useTeams === true && app.currGameDetails.teamType === "byTeam") {
            bTeams = true;
        }
        //console.log("THIS");
        //console.log(app.currGameDetails);
        app.currGameDetails.reset();
        //console.log("Length: " + l);
        if (bTeams === true) {
            l = app.currGameDetails.teams.length;
        } else {
            l = app.currGameDetails.players.length;
        }
        for (i = 0; i < l; i++) {
            //for each player selected calculate scores
            if (bTeams === true) {
                p = app.currGameDetails.teams[i];
            } else {
                p = app.currGameDetails.players[i];
            }

            p.reset();
            z = app.currGameDetails.scoreItems.length;
            //console.log(m + " score items");
            //for each round
            for (var r = 0; r < app.currGameDetails.rounds; r++) {
                //console.log("Round " + (r + 1));

                for (x = 0; x < z; x++) {
                    //console.log(j + " < " + m);
                    var myItem = app.currGameDetails.scoreItems[x];
                    //console.log(myItem);
                    //for each score widget
                    var sId = p.player.id + "_" + myItem.id + "_" + r;
                    //console.log("ID: " + sId);
                    var divide = myItem.divideBy;
                    var rounding = myItem.round;
                    var scoreValue = myItem.scoreValue;
                    var scoreType = myItem.scoreType.toLowerCase();
                    var scoreName = myItem.scoreName;
                    var square = myItem.square;
                    var tally = myItem.tally;
                    var saveVar = myItem.saveVar;
                    var saveVarLetter = myItem.saveVarLetter;
                    var scoreValues = myItem.scoreValues;
                    var mod;
                    var bFound = true;
                    var myScoreDetails;
                    var valueBefore = "";
                    var valueAfter = 0;
                    var math = "-";
                    var iVal = 0;
                    var t;
                    if (scoreType == "counter") {

                        iVal = $("#" + sId).val();
                        valueBefore = iVal;
                        //console.log("scoreValue: " + scoreValue);
                        if (isNaN(scoreValue)) {
                            if (scoreValue.length === 1) {
                                scoreValue = app.currGameDetails.getVar(scoreValue);
                            } else {
                                scoreValue = 0;
                            }
                        } else {
                            if (square === true) {
                                scoreValue = iVal;
                            }

                            if (scoreValue > 1) {
                                math = iVal + " * " + scoreValue;
                            }

                            scoreValue = iVal * scoreValue;

                            if (divide > 1) {

                                math = scoreValue + " / " + divide;
                                mod = (score % divide);
                                if (mod > 0) {
                                    scoreValue -= mod;
                                }
                                scoreValue /= divide;

                            }
                            valueAfter = scoreValue; //addPoints(scoreName, scoreCombo, scoreValue, multiply, divide, scoreTotal)
                        }
                    } else if (scoreType == "tally" || scoreType == "hiddentally") {
                        iVal = $("#total" + sId).val();
                        valueBefore = iVal;
                        //console.log("scoreValue: " + scoreValue);
                        if (isNaN(scoreValue)) {
                            if (scoreValue.length === 1) {
                                scoreValue = app.currGameDetails.getVar(scoreValue);
                            } else {
                                scoreValue = 0;
                            }
                        } else {
                            if (square === true) {
                                scoreValue = iVal;
                            }

                            if (scoreValue > 1) {
                                math = iVal + " * " + scoreValue;
                            }

                            scoreValue = iVal * scoreValue;

                            if (divide > 1) {

                                math = scoreValue + " / " + divide;
                                mod = (score % divide);
                                if (mod > 0) {
                                    scoreValue -= mod;
                                }
                                scoreValue /= divide;

                            }
                            valueAfter = scoreValue; //addPoints(scoreName, scoreCombo, scoreValue, multiply, divide, scoreTotal)
                        }
                    } else if (myItem.scoreType == "combo") {
                        iVal = $("#" + sId).find(":selected").val();
                        valueBefore = $("#" + sId).find(":selected").text();
                        if (isNaN(scoreValue)) {
                            //console.log("Found NaN check for var value");
                            if (scoreValue.length === 1) {
                                //it's 1 letter
                                scoreValue = app.currGameDetails.getVar(scoreValue);
                            } else {
                                scoreValue = 0;
                            }
                        } else {
                            scoreValue = iVal;
                        }
                        if (divide > 1) {
                            math = scoreValue + " / " + divide;
                            mod = (score % divide);
                            if (mod > 0) {
                                scoreValue -= mod;
                            }
                            scoreValue /= divide;
                        }
                        valueAfter = scoreValue;
                    } else if (myItem.scoreType == "toggle") {
                        iVal = $("#" + sId).val();
                        scoreValue = iVal;
                        valueBefore = $("#" + sId).find(":selected").text();
                        //console.log("Toggle Value: " + iVal);
                        if (isNaN(scoreValue)) {
                            //console.log("Found NaN check for var value");
                            if (scoreValue.length === 1) {
                                //it's 1 letter
                                scoreValue = app.currGameDetails.getVar(scoreValue);
                            } else {
                                scoreValue = 0;
                            }
                        }
                        valueAfter = scoreValue;
                    } else if (myItem.scoreType == "math") {
                        valueBefore = scoreValue;
                        scoreValue = scoreValue.toLowerCase();
                        var l2 = scoreValues.length;
                        var i2;
                        var num1;
                        var num2;
                        var num3;
                        iVal = 0;
                        //console.log(scoreValue);
                        switch (scoreValue) {
                            case "sum":

                                for (i2 = 0; i2 < l2; i2++) {
                                    if (isNaN(scoreValues[i2])) {
                                        //console.log("Found NaN check for var value");
                                        if (scoreValues[i2].length === 1) {
                                            //it's 1 letter
                                            scoreValue = app.currGameDetails.getVar(scoreValues[i2]);
                                        } else {
                                            scoreValue = 0;
                                        }
                                    } else {
                                        scoreValue = scoreValues[i2];
                                    }
                                    //console.log(iVal + "+" + scoreValue);
                                    if (i2 === 0) {
                                        iVal = scoreValue;
                                        math = scoreValue + " ";
                                    } else {
                                        iVal += scoreValue;
                                        math += "+ " + scoreValue + " ";
                                    }



                                }
                                valueAfter = iVal;
                                break;
                            case "subtract":
                                for (i2 = 0; i2 < l2; i2++) {
                                    if (isNaN(scoreValues[i2])) {
                                        //console.log("Found NaN check for var value");
                                        if (scoreValues[i2].length === 1) {
                                            //it's 1 letter
                                            scoreValue = app.currGameDetails.getVar(scoreValues[i2]);
                                        } else {
                                            scoreValue = 0;
                                        }
                                    } else {
                                        scoreValue = scoreValues[i2];
                                    }

                                    if (i2 === 0) {
                                        iVal = scoreValue;
                                        math = scoreValue + " ";
                                    } else {
                                        iVal -= scoreValue;
                                        math += "- " + scoreValue + " ";
                                    }



                                }
                                valueAfter = iVal;
                                break;
                            case "multiply":
                                for (i2 = 0; i2 < l2; i2++) {
                                    if (isNaN(scoreValues[i2])) {
                                        //console.log("Found NaN check for var value");
                                        if (scoreValues[i2].length === 1) {
                                            //it's 1 letter
                                            scoreValue = app.currGameDetails.getVar(scoreValues[i2]);
                                        } else {
                                            scoreValue = 0;
                                        }
                                    } else {
                                        scoreValue = scoreValues[i2];
                                    }



                                    if (i2 === 0) {
                                        //console.log(scoreValue + "=" + scoreValue);
                                        iVal = scoreValue;
                                        math = iVal + " ";
                                    } else {
                                        //console.log(iVal + "x" + scoreValue);
                                        iVal *= scoreValue;
                                        math += "* " + scoreValue;
                                    }


                                }
                                valueAfter = iVal;
                                break;
                            case "divide":
                                for (i2 = 0; i2 < l2; i2++) {
                                    if (isNaN(scoreValues[i2])) {
                                        //console.log("Found NaN check for var value");
                                        if (scoreValues[i2].length === 1) {
                                            //it's 1 letter
                                            scoreValue = app.currGameDetails.getVar(scoreValues[i2]);
                                        } else {
                                            scoreValue = 0;
                                        }
                                    } else {
                                        scoreValue = scoreValues[i2];
                                    }



                                    if (i2 === 0) {
                                        //console.log(scoreValue + "=" + scoreValue);
                                        iVal = scoreValue;
                                        math = scoreValue + " ";
                                    } else {
                                        mod = (iVal % divide);
                                        if (mod > 0) {
                                            iVal -= mod;
                                        }
                                        //console.log(iVal + "/" + scoreValue);
                                        iVal /= scoreValue;
                                        math += "/ " + scoreValue;
                                    }




                                }
                                valueAfter = iVal;
                                break;
                            case "inrange":
                                //console.log("inrange");
                                num1 = 0;
                                num2 = 0;
                                num3 = 0;
                                if (scoreValues.length >= 3) {
                                    num1 = scoreValues[0];
                                    num2 = scoreValues[1];
                                    num3 = scoreValues[2];
                                    if (isNaN(num1) === true) {
                                        if (num1.length === 1) {
                                            //it's 1 letter
                                            num1 = app.currGameDetails.getVar(num1);
                                        } else {
                                            num1 = 0;
                                        }
                                    }
                                    if (isNaN(num2) === true) {
                                        if (num2.length === 1) {
                                            //it's 1 letter
                                            num2 = app.currGameDetails.getVar(num2);
                                        } else {
                                            num2 = 0;
                                        }
                                    }
                                    if (isNaN(num3) === true) {
                                        if (num3.length === 1) {
                                            //it's 1 letter
                                            num3 = app.currGameDetails.getVar(num3);
                                        } else {
                                            num3 = 0;
                                        }
                                    }

                                    //console.log(num1 + " " + num2 + " " + num3);


                                    if ((num1 >= num2) && (num1 <= num3)) {
                                        iVal = 1;
                                    } else {
                                        iVal = 0;
                                    }
                                } else {
                                    iVal = 0;
                                }
                                valueAfter = iVal;
                                break;
                            case "greaterthan":
                                num1 = 0;
                                num2 = 0;

                                if (scoreValues.length >= 1) {
                                    num1 = scoreValues[0];
                                    num2 = scoreValues[1];
                                    if (isNaN(num1) === true) {
                                        if (num1.length === 1) {
                                            //it's 1 letter
                                            num1 = app.currGameDetails.getVar(num1);
                                        } else {
                                            num1 = 0;
                                        }
                                    }
                                    if (isNaN(num2) === true) {
                                        if (num2.length === 1) {
                                            //it's 1 letter
                                            num2 = app.currGameDetails.getVar(num2);
                                        } else {
                                            num2 = 0;
                                        }
                                    }
                                    if (num1 > num2) {
                                        iVal = 1;
                                    } else {
                                        iVal = 0;
                                    }
                                    math = num1 + " > " + num2;
                                } else {
                                    iVal = 0;
                                    math = "Err: req 2 values";
                                }
                                //console.log("Greaterthan = " + iVal);
                                valueAfter = iVal;
                                break;
                            case "lessthan":
                                num1 = 0;
                                num2 = 0;

                                if (scoreValues.length >= 1) {
                                    num1 = scoreValues[0];
                                    num2 = scoreValues[1];
                                    if (isNaN(num1) === true) {
                                        if (num1.length === 1) {
                                            //it's 1 letter
                                            num1 = app.currGameDetails.getVar(num1);
                                        } else {
                                            num1 = 0;
                                        }
                                    }
                                    if (isNaN(num2) === true) {
                                        if (num2.length === 1) {
                                            //it's 1 letter
                                            num2 = app.currGameDetails.getVar(num2);
                                        } else {
                                            num2 = 0;
                                        }
                                    }
                                    if (num1 < num2) {
                                        iVal = 1;
                                    } else {
                                        iVal = 0;
                                    }
                                    math = num1 + " < " + num2;
                                } else {
                                    iVal = 0;
                                    math = "Err: req 2 values";
                                }
                                //console.log("Lessthan = " + iVal);
                                valueAfter = iVal;
                                break;
                            case "largest":
                                for (i2 = 0; i2 < l2; i2++) {
                                    if (isNaN(scoreValues[i2])) {
                                        //console.log("Found NaN check for var value");
                                        if (scoreValues[i2].length === 1) {
                                            //it's 1 letter
                                            scoreValue = app.currGameDetails.getVar(scoreValues[i2]);
                                        } else {
                                            scoreValue = 0;
                                        }
                                    } else {
                                        scoreValue = scoreValues[i2];
                                    }

                                    if (i2 === 0) {
                                        iVal = scoreValue;
                                        math = iVal;
                                    } else {
                                        math += ", " + scoreValue;
                                        if (scoreValue > iVal) {

                                            iVal = scoreValue;
                                        }
                                    }
                                }
                                valueAfter = iVal;
                                //console.log(scoreValues);
                                //console.log("Largest: " + iVal);
                                break;
                            case "smallest":
                                for (i2 = 0; i2 < l2; i2++) {
                                    if (isNaN(scoreValues[i2])) {
                                        //console.log("Found NaN check for var value");
                                        if (scoreValues[i2].length === 1) {
                                            //it's 1 letter
                                            scoreValue = app.currGameDetails.getVar(scoreValues[i2]);
                                        } else {
                                            scoreValue = 0;
                                        }
                                    } else {
                                        scoreValue = scoreValues[i2];
                                    }

                                    if (i2 === 0) {
                                        iVal = scoreValue;
                                        math = iVal;
                                    } else {
                                        math += ", " + scoreValue;
                                        if (scoreValue < iVal) {
                                            iVal = scoreValue;
                                        }
                                    }

                                }
                                valueAfter = iVal;
                                //console.log(scoreValues);
                                //console.log("smallest: " + iVal);
                                break;

                            case "square":
                                //console.log("SQUARE");
                                //console.log(scoreValues);
                                //console.log(scoreValues.length);
                                if (isNaN(scoreValues[0])) {
                                    //console.log("Found NaN check for var value");
                                    if (scoreValues[0].length === 1) {
                                        //it's 1 letter
                                        scoreValue = app.currGameDetails.getVar(scoreValues[0]);
                                    } else {
                                        scoreValue = 0;
                                    }
                                } else {
                                    scoreValue = scoreValues[0];
                                }
                                valueBefore = scoreValue;
                                iVal = scoreValue;

                                math = iVal + " x " + iVal;
                                iVal = iVal * iVal;

                                valueAfter = iVal;
                                break;
                            default:
                                bFound = false;
                                break;
                        }
                    }
                    //console.log("ScoreType: " + scoreType + " / bFound: " + bFound);
                    if (bFound === true && scoreType !== "footnote" && scoreType !== "" && scoreType !== undefined) {
                        if (valueAfter % 1 !== 0) {
                            switch (rounding) {
                                case "normal":
                                    valueAfter = parseInt(valueAfter, 10);
                                    break;
                                case "half":
                                    valueAfter = roundHalf(valueAfter);
                                    break;
                                case "quarter":
                                    valueAfter = roundQuarter(valueAfter);
                                    break;
                                case "up":
                                    valueAfter = round(valueAfter);
                                    break;
                                case "down":
                                    valueAfter = Math.floor(valueAfter);
                                    break;
                            }
                        }
                        myScoreDetails = new ScoreDetails(scoreName, valueBefore, math, valueAfter, tally, saveVar, saveVarLetter);
                        //console.log(myScoreDetails);
                        p.addPoints(myScoreDetails);
                        if (app.currGameDetails.useTeams === true && app.currGameDetails.teamType === "byPlayer") {
                            //console.log("Adding points to team");
                            m = app.currGameDetails.teams.length;
                            for (j = 0; j < m; j++) {

                                t = app.currGameDetails.teams[j];
                                //console.log(p);
                                //console.log(t);

                                if (p.team === t.player.name) {
                                    t.addPoints(myScoreDetails);
                                    app.currGameDetails.teams[j] = t;
                                }

                            }

                        } else if (app.currGameDetails.useTeams === true && app.currGameDetails.teamType === "byTeam") {
                            //console.log("Adding points to player");
                            m = app.currGameDetails.players.length;
                            for (j = 0; j < m; j++) {

                                t = app.currGameDetails.players[j];
                                //console.log(t.team + " - " + p.player.name);
                                if (t.team === p.player.name) {
                                    t.addPoints(myScoreDetails);
                                    app.currGameDetails.players[j] = t;
                                }

                            }
                        }

                    }
                    if (saveVar === true) {
                        //console.log("saving var: " + saveVarLetter);
                        app.currGameDetails.setVar(saveVarLetter, valueAfter);
                    }

                }
                //console.log("pre: " + p);
            }

            for (k = 0; k < p.scoreLogName.length; k++) {
                p.getLogText(k);
            }
            //console.log(p.player.name + ": " + p.points);
            //console.log("pushing: " + i);
            //console.log(p);
            if (bTeams === true) {
                app.currGameDetails.teams[i] = p;
            } else {
                app.currGameDetails.players[i] = p;
            }
        }

        if (app.currGameDetails.useTeams === true) {

        }

        var highScore = 0;
        bTeams = app.currGameDetails.useTeams;

        if (bTeams === true) {
            //console.log("TEAMS");
            if (app.currGameDetails.lowPointsWin === false) {
                app.currGameDetails.teams.sort(dynamicSortMultiple("-winner", "-points"));
            } else {
                app.currGameDetails.teams.sort(dynamicSortMultiple("-winner", "points"));
            }
            l = app.currGameDetails.teams.length;
            for (i = 0; i < l; i++) {
                //console.log("Item: " + i);
                //console.log(app.currGameDetails.teams[i]);
                if (i === 0) {
                    app.currGameDetails.teams[i].winner = true;
                    highScore = app.currGameDetails.teams[i].points;
                } else {
                    if (app.currGameDetails.teams[i].points == highScore) {
                        app.currGameDetails.teams[i].winner = true;
                    }
                }
            }
            for (i = 0; i < l; i++) {
                if (app.currGameDetails.teams[i].winner === true) {
                    //console.log("Adding Team Winner1");
                    //console.log("Team:");
                    //console.log(app.currGameDetails.teams[i]);
                    k = app.currGameDetails.players.length;
                    for (j = 0; j < k; j++) {
                        //console.log("Player:");
                        //console.log(app.currGameDetails.players[j]);
                        //console.log(app.currGameDetails.players[j].team + "===" +  app.currGameDetails.teams[i].player.name);

                        if (app.currGameDetails.players[j].team === app.currGameDetails.teams[i].player.name) {
                            app.currGameDetails.players[j].winner = true;
                            app.currGameDetails.players[j].points = highScore;
                            app.currGameDetails.winners.push(app.currGameDetails.players[j]);
                        }
                    }
                    //app.currGameDetails.winners.push(app.currGameDetails.teams[i]);
                } else {
                    k = app.currGameDetails.players.length;
                    for (j = 0; j < k; j++) {
                        if (app.currGameDetails.players[j].team === app.currGameDetails.teams[i].player.name) {
                            app.currGameDetails.players[j].points = app.currGameDetails.teams[i].points;
                        }
                    }
                }
            }
        } else {
            //console.log("NO TEAMS");
            if (app.currGameDetails.lowPointsWin === false) {
                app.currGameDetails.players.sort(dynamicSortMultiple("-winner", "-points"));
            } else {
                app.currGameDetails.players.sort(dynamicSortMultiple("-winner", "points"));
            }
            for (i = 0; i < app.currGameDetails.players.length; i++) {
                //console.log("Item: " + i);
                //console.log(app.currGameDetails.players[i]);
                if (i === 0) {
                    app.currGameDetails.players[i].winner = true;
                    highScore = app.currGameDetails.players[i].points;
                } else {
                    if (app.currGameDetails.players[i].points == highScore) {
                        app.currGameDetails.players[i].winner = true;
                    }
                }
            }
            for (i = 0; i < app.currGameDetails.players.length; i++) {
                if (app.currGameDetails.players[i].winner === true) {


                    app.currGameDetails.winners.push(app.currGameDetails.players[i]);
                }
            }
        }

        if (highScore === 0 && app.currGameDetails.lowPointsWin === false) {
            //console.log("All zero scores, clear winners, count as loss");
            app.getSetting("chkGameOverMan", "true", function(setting) {
                if (setting === "true") {
                    Toast.toast("Game over, man! Game over!");
                }
            });
            app.currGameDetails.winners.length = [];
            for (i = 0; i < app.currGameDetails.players.length; i++) {
                app.currGameDetails.players[i].winner = false;
            }
        }

        $.mobile.loading('hide');

        if (callback !== undefined) {
            //console.log(app.currGameDetails.winners);


            callback(app.currGameDetails.winners.length);

        }
    },

    removeUnselectedPlayers: function(callback) {
        var l = app.currPlayers.length;
        //console.log("Remove unselected players");
        //console.log(app.selectedPlayerIds);
        //console.log(app.selectedPlayerIds.length);
        //console.log(app.currPlayers.length);
        app.currGameDetails.players = [];
        if (app.selectedPlayerIds.length > 0) {
            for (var i = 0; i < l; i++) {
                var bFound = false;
                for (var j = 0; j < app.selectedPlayerIds.length; j++) {
                    if (app.selectedPlayerIds[j] == app.currPlayers[i].id) {
                        bFound = true;
                        break;
                    }
                }
                //console.log("bfound: " + bFound);
                if (bFound === true) {
                    //console.log("Adding " + app.currPlayers[i].name);
                    var p = new PlayerTemp(app.currPlayers[i]);
                    app.currGameDetails.players.push(p);

                }
                if (i === (l - 1)) {
                    if (callback !== undefined) {
                        //console.log("callback from remove unselected players");
                        callback();
                    }
                }
            }
        }
    },

    removeUnselectedWinners: function(callback) {
        //console.log("Remove unselected winners");
        //console.log(app.selectedPlayerIds);
        app.currGameDetails.winners = [];
        var bFound;
        var i;
        var l;
        var j;
        var m;
        var id;
        var pid;
        l = app.currGameDetails.players.length;
        m = app.selectedPlayerIds.length;
        //console.log(app.currGameDetails.players);
        for (i = 0; i < l; i++) {

            pid = app.currGameDetails.players[i].player.id;
            bFound = false;
            for (j = 0; j < m; j++) {
                id = app.selectedPlayerIds[j];
                if (id == pid) {
                    bFound = true;
                    break;
                }
            }
            //console.log(app.currGameDetails.players[i].player.id + " winner=" + bFound);
            app.currGameDetails.players[i].winner = bFound;
            if (bFound === true) {
                app.currGameDetails.winners.push(app.currGameDetails.players[i]);
            }
        }

        if (callback !== undefined) {
            callback();
        }
    },

    writeScoreDetailsToPage: function(callback) {
        //console.log("ScoreDetails");
        var $el = $('#score-details-table');
        var l = app.currGameDetails.players.length;
        //console.log("len: " + l);
        var sInsert = "";
        var sWidgets = "";
        var bold1 = "";
        var bold2 = "";
        var add = "";
        $el.empty();
        for (var i = 0; i < l; i++) {
            var iTotal = 0;
            //for each player selected write a collapsible.
            sWidgets = "";
            sInsert += '<div data-role="collapsible" data-collapsed="true"><h3>' + app.currGameDetails.players[i].player.name + '</h3>$$WIDGETS$$</div>';
            var m = app.currGameDetails.scoreItems.length;


            sWidgets += '<table data-role="table" class="ui-responsive table-stroke"><thead><tr><th data-priority="persist">Name</th><th>Value</th><th>Math</th><th>Add</th><th data-priority="persist">Total</th></tr></thead><tbody>';
            //for player score item
            for (var r = 0; r < app.currGameDetails.players[i].scoreLogName.length; r++) {
                add = app.currGameDetails.players[i].scoreLogAdd[r];
                if (typeof add === 'string') {
                    if (add.indexOf("[") === -1) {
                        if (parseInt(add, 10) > 0) {
                            bold1 = "<b>";
                            bold2 = "</b>";
                        } else {
                            bold1 = "";
                            bold2 = "";
                        }

                    } else {
                        bold1 = "";
                        bold2 = "";
                    }
                } else {
                    if (add !== 0) {
                        bold1 = "<b>";
                        bold2 = "</b>";
                    } else {
                        bold1 = "";
                        bold2 = "";
                    }
                }
                sWidgets += '<tr><td>' + app.currGameDetails.players[i].scoreLogName[r] + '</td><td>' + app.currGameDetails.players[i].scoreLogCombo[r] + '</td><td>' + app.currGameDetails.players[i].scoreLogMath[r] + '</td><td>' + add + '</td><td>' + bold1 + app.currGameDetails.players[i].scoreLogPoints[r] + bold2 + '</td></tr>';
                iTotal = app.currGameDetails.players[i].scoreLogPoints[r];
                //ret += "Name: " + this.scoreLogName[val] + " | " + "Combo: " + this.scoreLogCombo[val] + " | " + "Math: " + this.scoreLogMath[val] + " | " + "Add: " + this.scoreLogAdd[val] + " | " + "Total: " + this.scoreLogPoints[val];
            }
            sWidgets += '</tbody></table><h3>Total: ' + iTotal;
            sInsert = sInsert.replace("$$WIDGETS$$", sWidgets);
        }
        //console.log("Going to insert: " + sInsert);
        $el.append(sInsert).enhanceWithin();
        if (callback !== undefined) {
            callback();
        }
    },

    saveSetting: function(name, value, callback) {
        this.store.saveSetting(name, value, function() {
            if (callback !== undefined) {
                callback();
            }
        });
    },

    getSetting: function(name, sDefault, callback) {
        var s;
        var l;
        var ret;
        //console.log("name: " + name);
        this.store.getSetting(name, sDefault, function(setting) {
            //console.log("value: " + setting);
            callback(setting);
        });
    },

    doStats: function(history, game, statType, callback) {
        //console.log("statType: " + statType);
        //console.log(history);
        app.bStatTotalWins = true;
        app.bStatWinPercent = true;
        app.bStatAvgScore = true;
        app.bStatTopTen = true;
        var allPlayerNames = [];
        var allPlayerIds = [];
        var allFactions = [];
        var allTeams = [];
        var allPositions = [];
        var allColors = [];

        app.statTotalWins = [];
        app.statWinPercent = [];
        app.statAvgScore = [];
        app.statTopTen = [];

        var i;
        var l;
        var j;
        var m;
        var obj;
        var s;

        l = history.length;
        for (i = 0; i < l; i++) {
            if (statType === "player") {
                obj = history[i].players;
                //console.log(obj);
                m = obj.length;
                for (j = 0; j < m; j++) {
                    if (allPlayerIds.indexOf(obj[j].id) === -1 && obj[j].id !== "") {
                        allPlayerIds.push(obj[j].id);
                        allPlayerNames.push(obj[j].name);
                    }
                }
            }
            obj = history[i].scores;
            m = obj.length;
            if (statType === "faction") {
                for (j = 0; j < m; j++) {
                    //console.log("obj[j].faction");
                    //console.log(obj[j].faction);
                    if (allFactions.indexOf(obj[j].faction) === -1 && obj[j].faction !== "") {
                        allFactions.push(obj[j].faction);
                    }
                }
            }
            if (statType === "team") {
                for (j = 0; j < m; j++) {
                    if (allTeams.indexOf(obj[j].team) === -1 && obj[j].team !== "") {
                        allTeams.push(obj[j].team);
                    }
                }
            }
            if (statType === "position") {
                for (j = 0; j < m; j++) {
                    if (allPositions.indexOf(obj[j].position) === -1 && obj[j].position !== "") {
                        allPositions.push(obj[j].position);
                    }
                }
            }
            if (statType === "color") {
                for (j = 0; j < m; j++) {
                    if (allColors.indexOf(obj[j].color) === -1 && obj[j].color !== "") {
                        allColors.push(obj[j].color);
                    }
                }
            }

        }

        if (game.name === "All Games") {
            app.bStatAvgScore = false;
            app.bStatTopTen = false;
        }

        //console.log(history);
        //console.log(allPlayerIds);
        //console.log(allPlayerNames);
        //console.log(allFactions);
        //console.log(allTeams);
        //console.log(allPositions);
        //console.log(allColors);
        //console.log(statType);

        app.doStatsTotalWins(history, allPlayerIds, allPlayerNames, allFactions, allTeams, allPositions, allColors, app.bStatTotalWins, statType, function() {
            app.doStatsWinPercent(history, allPlayerIds, allPlayerNames, allFactions, allTeams, allPositions, allColors, app.bStatWinPercent, statType, function() {
                app.doStatsAvgScore(history, allPlayerIds, allPlayerNames, allFactions, allTeams, allPositions, allColors, app.bStatAvgScore, statType, function() {
                    app.doStatsTopTen(history, allPlayerIds, allPlayerNames, allFactions, allTeams, allPositions, allColors, app.bStatTopTen, statType, function() {
                        callback();
                    });
                });
            });
        });
    },

    doStatsTotalWins: function(history, allPlayerIds, allPlayerNames, allFactions, allTeams, allPositions, allColors, bDoIt, statType, callback) {

        if (bDoIt === false) {
            callback();
        } else {
            //console.log("Total Wins");
            var iVal;
            var i;
            var l;
            var j;
            var m;
            var k;
            var n;
            var toFind;
            var toWrite;
            var obj;
            var s;
            var score;
            iVal = 0;
            switch (statType) {
                case "player":
                    l = allPlayerIds.length;
                    break;
                case "faction":
                    l = allFactions.length;
                    break;
                case "team":
                    l = allTeams.length;
                    break;
                case "position":
                    l = allPositions.length;
                    break;
                case "color":
                    l = allColors.length;
                    break;
            }
            for (i = 0; i < l; i++) {
                iVal = 0;
                switch (statType) {
                    case "player":
                        toFind = allPlayerIds[i];
                        toWrite = allPlayerNames[i];
                        break;
                    case "faction":
                        toFind = allFactions[i];
                        toWrite = toFind;
                        break;
                    case "team":
                        toFind = allTeams[i];
                        toWrite = toFind;
                        break;
                    case "position":
                        toFind = allPositions[i];
                        toWrite = toFind;
                        break;
                    case "color":
                        toFind = allColors[i];
                        toWrite = toFind;
                        break;
                }
                //console.log("toFind: " + toFind);
                //console.log("toWrite: " + toWrite);
                var teamsWithWins = [];
                m = history.length;
                for (j = 0; j < m; j++) {
                    teamsWithWins = [];
                    obj = history[j].scores;
                    n = obj.length;
                    for (k = 0; k < n; k++) {
                        score = obj[k];
                        switch (statType) {
                            case "player":
                                if (score.playerId == toFind && (score.win === true || score.win == "true" || score.win == -1 || score.win == "-1")) {
                                    iVal += 1;
                                }
                                break;
                            case "faction":
                                if (score.faction == toFind && (score.win === true || score.win == "true" || score.win == -1 || score.win == "-1")) {
                                    iVal += 1;
                                }
                                break;
                            case "team":
                                if (score.team == toFind && (score.win === true || score.win == "true" || score.win == -1 || score.win == "-1")) {
                                    if (teamsWithWins.indexOf(score.team) === -1) {
                                        iVal += 1;
                                        teamsWithWins.push(score.team);
                                    }
                                }
                                break;
                            case "position":
                                if (score.position == toFind && (score.win === true || score.win == "true" || score.win == -1 || score.win == "-1")) {
                                    iVal += 1;
                                }
                                break;
                            case "color":
                                if (score.color === toFind && (score.win === true || score.win == "true" || score.win == -1 || score.win == "-1")) {
                                    iVal += 1;
                                }
                                break;
                        }
                    }
                }
                if (iVal === 1) {
                    s = "";
                } else {
                    s = "s";
                }
                app.statTotalWins.push([toWrite + ' (' + iVal + ' win' + s + ')', iVal]);
            }
            app.statTotalWins.sort(function(a, b) {
                if (a[1] < b[1]) {
                    return 1;
                }
                if (a[1] > b[1]) {
                    return -1;
                }
                return 0;
            });
            //console.log(app.statTotalWins);
            callback();
        }
    },

    doStatsWinPercent: function(history, allPlayerIds, allPlayerNames, allFactions, allTeams, allPositions, allColors, bDoIt, statType, callback) {

        if (bDoIt === false) {
            callback();
        } else {
            //console.log("win percent");
            var iPlayed;
            var iWon;
            var iVal;
            var rounded;
            var i;
            var l;
            var j;
            var m;
            var k;
            var n;
            var toFind;
            var toWrite;
            var obj;
            var score;
            iVal = 0;
            switch (statType) {
                case "player":
                    l = allPlayerIds.length;
                    break;
                case "faction":
                    l = allFactions.length;
                    break;
                case "team":
                    l = allTeams.length;
                    break;
                case "position":
                    l = allPositions.length;
                    break;
                case "color":
                    l = allColors.length;
                    break;
            }
            for (i = 0; i < l; i++) {
                iPlayed = 0;
                iWon = 0;
                switch (statType) {
                    case "player":
                        toFind = allPlayerIds[i];
                        toWrite = allPlayerNames[i];
                        break;
                    case "faction":
                        toFind = allFactions[i];
                        toWrite = toFind;
                        break;
                    case "team":
                        toFind = allTeams[i];
                        toWrite = toFind;
                        break;
                    case "position":
                        toFind = allPositions[i];
                        toWrite = toFind;
                        break;
                    case "color":
                        toFind = allColors[i];
                        toWrite = toFind;
                        break;
                }
                m = history.length;
                for (j = 0; j < m; j++) {
                    obj = history[j].scores;
                    n = obj.length;
                    for (k = 0; k < n; k++) {
                        score = obj[k];
                        switch (statType) {
                            case "player":
                                if (score.playerId == toFind) {
                                    iPlayed += 1;
                                    if (score.win === true || score.win == "true" || score.win == -1 || score.win == "-1") {
                                        iWon += 1;
                                    }
                                }
                                break;
                            case "faction":
                                if (score.faction == toFind) {
                                    iPlayed += 1;
                                    if (score.win === true || score.win == "true" || score.win == -1 || score.win == "-1") {
                                        iWon += 1;
                                    }
                                }
                                break;
                            case "team":
                                if (score.team == toFind) {
                                    iPlayed += 1;
                                    if (score.win === true || score.win == "true" || score.win == -1 || score.win == "-1") {
                                        iWon += 1;
                                    }
                                }
                                break;
                            case "position":
                                if (score.position == toFind) {
                                    iPlayed += 1;
                                    if (score.win === true || score.win == "true" || score.win == -1 || score.win == "-1") {
                                        iWon += 1;
                                    }
                                }
                                break;
                            case "color":
                                if (score.color === toFind) {
                                    iPlayed += 1;
                                    if (score.win === true || score.win == "true" || score.win == -1 || score.win == "-1") {
                                        iWon += 1;
                                    }
                                }
                                break;
                        }
                    }
                }
                if (iPlayed > 0) {
                    iVal = ((iWon / iPlayed) * 100);
                    rounded = Math.round(iVal * 10) / 10;
                    if (rounded > 0) {
                        app.statWinPercent.push([toWrite + ' (' + rounded + '%)', iVal]);
                    }
                }
            }
            app.statWinPercent.sort(function(a, b) {
                if (a[1] < b[1]) {
                    return 1;
                }
                if (a[1] > b[1]) {
                    return -1;
                }
                return 0;
            });
            //console.log(app.statWinPercent);
            callback();
        }
    },

    doStatsAvgScore: function(history, allPlayerIds, allPlayerNames, allFactions, allTeams, allPositions, allColors, bDoIt, statType, callback) {

        if (bDoIt === false) {
            callback();
        } else {
            //console.log("Average Score");
            var iPlayed;
            var iTotal;
            var iVal;
            var rounded;
            var i;
            var l;
            var j;
            var m;
            var k;
            var n;
            var toFind;
            var toWrite;
            var obj;
            var points;
            var score;
            iVal = 0;
            switch (statType) {
                case "player":
                    l = allPlayerIds.length;
                    break;
                case "faction":
                    l = allFactions.length;
                    break;
                case "team":
                    l = allTeams.length;
                    break;
                case "position":
                    l = allPositions.length;
                    break;
                case "color":
                    l = allColors.length;
                    break;
            }
            for (i = 0; i < l; i++) {
                iPlayed = 0;
                iTotal = 0;

                switch (statType) {
                    case "player":
                        toFind = allPlayerIds[i];
                        toWrite = allPlayerNames[i];
                        break;
                    case "faction":
                        toFind = allFactions[i];
                        toWrite = toFind;
                        break;
                    case "team":
                        toFind = allTeams[i];
                        toWrite = toFind;
                        break;
                    case "position":
                        toFind = allPositions[i];
                        toWrite = toFind;
                        break;
                    case "color":
                        toFind = allColors[i];
                        toWrite = toFind;
                        break;
                }
                m = history.length;
                for (j = 0; j < m; j++) {
                    obj = history[j].scores;
                    n = obj.length;
                    for (k = 0; k < n; k++) {
                        score = obj[k];
                        points = parseFloat(score.points);
                        switch (statType) {
                            case "player":
                                //console.log(score);
                                //console.log(score.playerId);
                                //console.log("toFind: " + toFind);
                                if (score.playerId == toFind) {
                                    iPlayed += 1;
                                    iTotal += points;
                                }
                                break;
                            case "faction":
                                if (score.faction == toFind) {
                                    iPlayed += 1;
                                    iTotal += points;
                                }
                                break;
                            case "team":
                                if (score.team == toFind) {
                                    iPlayed += 1;
                                    iTotal += points;

                                }
                                break;
                            case "position":
                                if (score.position == toFind) {
                                    iPlayed += 1;
                                    iTotal += points;

                                }
                                break;
                            case "color":
                                if (score.color === toFind) {
                                    iPlayed += 1;
                                    iTotal += points;

                                }
                                break;
                        }
                    }
                }
                //console.log("iPlayed: " + iPlayed);
                if (iPlayed > 0) {
                    //console.log("iTotal: " + iTotal);

                    iVal = (iTotal / iPlayed);
                    rounded = Math.round(iVal * 10) / 10;
                    //console.log("Rounded: " + rounded);   
                    if (rounded > 0) {
                        app.statAvgScore.push([toWrite + ' (' + rounded + ')', iVal]);
                    }
                }
            }
            app.statAvgScore.sort(function(a, b) {
                if (a[1] < b[1]) {
                    return 1;
                }
                if (a[1] > b[1]) {
                    return -1;
                }
                return 0;
            });
            //console.log(app.statAvgScore);
            callback();
        }
    },

    doStatsTopTen: function(history, allPlayerIds, allPlayerNames, allFactions, allTeams, allPositions, allColors, bDoIt, statType, callback) {

        if (bDoIt === false) {
            callback();
        } else {
            //console.log("Top Ten");
            var allScores = [];
            var i;
            var l;
            var j;
            var m;
            var k;
            var n;
            var playerId;
            var playerName;
            var obj;
            var scores;
            var score;
            var points;
            var iVal;
            var toWrite;
            iVal = 0;
            l = history.length;

            for (i = 0; i < l; i++) {
                scores = history[i].scores;
                m = scores.length;
                for (j = 0; j < m; j++) {
                    score = scores[j];
                    //console.log(typeof score.points);
                    //console.log(score.points.length);
                    allScores.push(score);
                }
            }

            allScores.sort(dynamicSort("-points"));

            //console.log(allScores);
            l = allScores.length;
            switch (statType) {
                case "faction":
                    for (i = 0; i < l; i++) {
                        if (allScores[i].faction === "") {
                            allScores.splice(i, 1);
                            i--;
                            l--;
                        }
                    }
                    break;
                case "team":
                    for (i = 0; i < l; i++) {
                        if (allScores[i].team === "") {
                            allScores.splice(i, 1);
                            i--;
                            l--;
                        }
                    }
                    break;
                case "color":
                    for (i = 0; i < l; i++) {
                        if (allScores[i].color === "") {
                            allScores.splice(i, 1);
                            i--;
                            l--;
                        }
                    }
                    break;
            }

            l = 10;
            if (allScores.length < 10) {
                l = allScores.length;
            }
            //console.log("l:" + l);
            for (i = 0; i < l; i++) {
                iVal = 0;
                score = allScores[i];
                iVal = parseFloat(score.points, 10);
                switch (statType) {
                    case "player":
                        m = allPlayerIds.length;
                        for (j = 0; j < m; j++) {
                            if (allPlayerIds[j] === score.playerId) {
                                toWrite = allPlayerNames[j];
                            }
                        }
                        break;
                    case "faction":
                        toWrite = score.faction;
                        break;
                    case "team":
                        toWrite = score.team;
                        break;
                    case "position":
                        toWrite = score.position;
                        break;
                    case "color":
                        toWrite = score.color;
                        break;
                }
                //console.log("iVal: " + iVal);
                //console.log("toWrite: " + toWrite);
                if (iVal > 0) {
                    app.statTopTen.push([toWrite + ' (' + iVal + ')', iVal]);
                }
            }
            //console.log(app.statTopTen);
            callback();
        }
    },

    sanitizeGame: function(gameName, callback) {
        var s = gameName;
        s = s.toLowerCase();
        var sOrig = s;
        s = s.trim();

        if (s.indexOf(", The") !== -1) {
            s = "The " + s;
        }
        s = s.replace(/&#39;/g, "'");
        s = s.replace(/, The/g, "");

        if (s.indexOf("catanthe") >= 0 || s.indexOf("resistancethe") >= 0 || s.indexOf("lifethe") >= 0) {
            s = "the" + s;
            s = s.slice(0, -3);
            //console.log("SLICED: " + s);
        }

        s = s.sanitize();
        if (s !== sOrig) {
            //console.log("Org: " + sOrig);
            //console.log("New: " + s);
        }

        if (callback !== undefined) {
            callback(s);
        } else {
            return s;
        }
    },

    saveGamesPlayed: function(callback) {
        //console.log("saveGamesPlayed");
        var s;
        var l;
        var ret;
        var that = this;

        app.getSetting("reviewUse", "0", function(setting) {
            //console.log("settings callback review");
            //console.log(setting);

            s = setting;
            //console.log("Got setting '" + s + "'");
            ret = parseInt(s, 10);
            //console.log("ret=" + ret);

            ret = ret + 1;
            that.store.saveSetting("reviewUse", ret, function() {
                if (callback !== undefined) {
                    callback();
                }
            });
            //console.log("saved setting reviewGamesPlayed = " + ret);
        });
    },

    setScoreWidget: function(callback) {
        var $elSelectWidgetDisplay = $('#selectWidgetDisplay');
        app.getSetting("app.widgetDisplay", "byPlayer", function(setting) {

            var s = setting;
            $elSelectWidgetDisplay.val(s);
            $elSelectWidgetDisplay.selectmenu('refresh');

            if (callback !== undefined) {
                //console.log("Callback set score widget");
                callback();
            }
        });
    },

    askForReview: function(alwaysShow) {
        //console.log('ask for review');
        var os;
        var askForReview;
        var reviewVersion;
        var s;
        var l;
        var ret;
        var parse;
        var url;
        var that = this;
        this.store.getSetting('reviewUse', '0', function(setting) {
            //console.log('reviewUse: ' + setting);
            ret = parseInt(setting);
            //console.log('ret=' + ret);
            if (alwaysShow === true) {
                ret = 3;
            }
            if (ret >= 3) {
                //they have stored at lease three passwors so see if we should ask about reviewing
                //console.log('getting askForReview');
                that.store.getSetting('askForReview', 'remind', function(setting) {

                    askForReview = setting;
                    //console.log('ask for review: ' + askForReview);
                    //}

                    if (alwaysShow === true) {
                        askForReview = 'remind';
                    }

                    switch (askForReview) {
                        case 'remind':
                            Social.reviewDialog(false, that);
                            break;
                        case 'never':
                            //ignore it forever
                            that.store.saveSetting('askForReview', 'never');
                            break;
                        case 'reviewed':
                            //get setting, check if it matches version, ask if it has been updated
                            that.store.getSetting('reviewVersion', '0.0', function(setting) {
                                //s = settings[0];
                                reviewVersion = setting;
                                if (reviewVersion != Globals.appVersion) {
                                    that.store.saveSetting('askForReview', 'remind');
                                    that.store.saveSetting('reviewUse', '1');
                                }
                            });
                            break;
                    }
                });

            }
        });
    },

    

    
    

    bggClearLogin: function(callback) {
        this.store.saveSetting("bggUsername", "");
        this.store.saveSetting("bggPassword", "");
        if (callback) {
            callback();
        }
    },

    findNextCloud: function(username, cloudUsername, cloudType, callback) {
        //console.log("APP findnext cloud: " + cloudType + username + cloudUsername);
        this.store.findNextCloud(username, cloudUsername, cloudType, function(cloud, pct) {
            //console.log("Found ");
            //console.log(cloud);
            callback(cloud, pct);
        });
    },

    setPlayerPositions: function() {
        for (var i = 0; i < app.currGameDetails.players.length; i++) {
            app.currGameDetails.players[i].position = i + 1;
        }
    },
    
    clearPage: function(page) {
        //console.log("clearpage: " + page);
        var $el;
        page = page.toLowerCase();
        switch (page) {
            case "addgame":
                $el = $('#imgGameImage');
                $('#textNewGameName').val('');
                $('#textBGGID').val('');
                //$('#selectNewGameScoring').selectmenu();
                $('#selectNewGameScoring').val('points');
                $('#selectNewGameScoring').selectmenu('refresh');
                $('#advancedTextField').hide();
                $('#advancedText').text('');
                $('#advancedText').val('');
                $('#flip-rounds').flipswitch();
                $('#flip-rounds').val('off');
                $('#flip-rounds').flipswitch('refresh');
                $('#flip-score').flipswitch();
                $('#flip-score').val('high');
                $('#flip-score').flipswitch('refresh');
                $el.attr('src', "img/games/Game1.png").load();
                $el.nailthumb({
                    width: 100,
                    height: 100
                });
                break;
            case "players":
                $('.player-list').empty();
                break;
            case "addplayer":
                $el = $('#imgPlayerImage');
                $('#textNewPlayerName').val('');
                $('#textNewPlayerId').val('');
                $('#textNewPlayerTwitter').val('');
                $('#textBGGUsername2').val('');
                $el.attr('src', "img/players/Player1.png").load();
                $el.nailthumb({
                    width: 100,
                    height: 100
                });
                break;
            case "playerorder":
                $('#gameOptionsPickRounds').hide();
                $('#spinPickRounds').val('1');
                app.setScoreWidget();
                break;
            case "play":
                $('#playerScores').empty();
                break;
            case "tie":
                $('.player-tie').empty();
                break;
            case "results":
                $('#player-results').empty();
                $('#textareaNotes').val('');
                var $image = $('#imgResultsImage');
                $image.removeAttr('src').replaceWith($image.clone());
                if (app.lastPhoto === "") {
                    $('#imgResultsContainer').hide();   
                }
                $('#textLocation').val('');
                $('#selLocationAdd').val('Locations').selectmenu('refresh');
                $('#textDuration').val('');
                $('#playDate').val('');
                $el = $('#gameStats');
                $el.prop('checked', true);
                $el.checkboxradio("refresh");
                break;
            case "testresults":
                $('#test-player-results').empty();
                break;
            case "game-details":
                $('#score-details-table').empty();
                break;
            case "game-achievements":
                $('#player-achievements').empty();
                break;
            case "scoring":
                $("#player-list").html('');
                $("#player-sort").html('');
                $("#player-scores").html('');
                $("#player-results").html('');
                $("#award-list-session").html('');
                break;
        }
    },

    loadCloudLogin: function() {
        var that = this;
        var cloudUsername2;
        var cloudPassword2;
        var $el = $('#saveCloudLogin');
        $el.text('Sign In');
        app.getSetting('cloudUsername' + Globals.cloudUserSpecific, '', function(setting) {
            //console.log('Get Username');

            cloudUsername2 = setting;
            //console.log('cloud username: ' + cloudUsername);
            if (cloudUsername2 !== '') {
                app.getSetting('cloudPassword' + Globals.cloudUserSpecific, '', function(setting) {
                    cloudPassword2 = setting;
                    //console.log('cloud password: ' + cloudPassword2);
                    if (cloudPassword2 !== '') {
                        $('#textCloudUsername').val(cloudUsername2);
                        $('#textCloudPassword').val(cloudPassword2);
                        CloudAll.username = cloudUsername2;
                        CloudAll.password = cloudPassword2;
                        $el.text("Sign Out"); //"Sign Out"
                    } else {
                        $el.text("Sign In"); //"Sign Out"
                    }
                });
            } else {
                $el.text("Sign In"); //"Sign Out"
            }

        });
    },

    loadBGGLogin: function() {
        var that = this;
        var bggUsername;
        var bggPassword;
        var $el = $('#saveBGGLogin');
        var l;
        var s;
        $el.text("Sign In");
        app.getSetting("bggUsername", "", function(setting) {
            //console.log("Get BGGUsername");

            bggUsername = setting;
            //console.log("bgg username: " + bggUsername);
            if (bggUsername !== "") {
                app.getSetting("bggPassword", "", function(setting) {

                    bggPassword = setting;
                    //console.log("bgg password: " + bggPassword);
                    if (bggPassword !== "") {
                        $('#textBGGUsername').val(bggUsername);
                        $('#textBGGPassword').val(bggPassword);
                        $el.text("Sign Out");
                    }

                });
            }

        });
    },

    loadBGGLogin2: function() {
        var that = this;
        var bggUsername;
        var bggPassword;
        var bggComments;
        var l;
        var s;
        bggComments = $('#textareaNotes').val();
        $('#textareaBGGPostComments').val(bggComments);
        app.getSetting("bggUsername", "", function(setting) {
            //console.log("Get BGGUsername");


            bggUsername = setting;
            //console.log("bgg username: " + bggUsername);
            if (bggUsername !== "") {
                app.getSetting("bggPassword", "", function(setting) {

                    bggPassword = setting;
                    //console.log("bgg password: " + bggPassword);
                    if (bggPassword !== "") {
                        $('#textBGGPostUsername').val(bggUsername);
                        $('#textBGGPostPassword').val(bggPassword);
                    }

                });
            }

        });
    },

    bggLogin: function(myBGGObject, username, password, callback) {
        //console.log("myBGGObject");
        //console.log(myBGGObject);
        //dataString='{"dummy":"1","ajax":"1","version":"2","objecttype":"thing","objectid":"68448","playid":"","action":"save","playdate":"2013-06-24","dateinput":"2013-06-24","YIUButton":"","location":"Home","quantity":"1","length":"60","incomplete":"0","nowinstats":"0","comments":"These%20are%20some%20comments","players[1][playerid]":"","players[1][name]":"Mike","players[1][username]":"rebrandsoftware","players[1][score]":"123","players[1][color]":"blue","players[1][position]":"1","players[1][rating]":"6.1","players[1][new]":"0","players[1][win]":"0","players[2][playerid]":"","players[2][name]":"Jen","players[2][username]":"","players[2][score]":"456","players[2][color]":"green","players[2][position]":"2","players[2][rating]":"6.2","players[2][new]":"0","players[2][win]":"1"}';
        var dataString = 'username=' + encodeURIComponent(username) + '&password=' + encodeURIComponent(password);
        //console.log("data: " + dataString);

        Internet.getURLSource('https://rebrandcloud.secure.omnis.com/extras/geeklogin.asp', dataString, false, function(data) {
            if (data) {
                //console.log("after login");
                //console.log(data);  
                //console.log(data.bggusername);
                if (data.bggusername !== undefined && data.bggpassword !== undefined) {
                    if (data.bggusername !== "" && data.bggpassword !== "") {
                        if (callback !== undefined) {
                            if (myBGGObject !== null) {
                                //console.log("callback");
                                if (myBGGObject.objectid.length > 0) {
                                    callback(data.bggpassword);
    
                                } else {
                                    if (app.bggVerbose === true) {
                                        Toast.toast("Could not post to BGG: no BGG ID associated with this game.");
    
                                    }
                                }   
                            } else {
                                callback();
                            }

                        } else {
                            app.saveSetting("bggUsername", username);
                            app.saveSetting("bggPassword", password);
                            $('#saveBGGLogin').text("Sign Out");
                            Toast.toast("Signed in! Future games will be posted automatically.");
                        }
                    } else {
                        Toast.toast("Your BoardGameGeek login is incorrect or the service is down.");
                    }
                } else {
                    if (app.bggVerbose === true) {
                        Toast.toast("Please login first");
                        changePage("#editbgg", {
                            changeHash: false //do not track it in history
                        });
                    }
                    app.bPostBGG = true;
                }
            }
        });

        // $.ajax({
        // url: "https://rebrandcloud.secure.omnis.com/extras/geeklogin.asp",
        // data: dataString,
        // crossDomain: true,
        // dataType: "jsonp"
        // })
        // .done(function (data) {
        // //console.log("after login");
        // //console.log(data);  
        // //console.log(data.bggusername);
        // if (data.bggusername !== undefined && data.bggpassword !== undefined) {
        // if (data.bggusername !== "" && data.bggpassword !== "") {
        // if (callback !== undefined) {
        // //console.log("callback");
        // if (myBGGObject.objectid.length > 0) {
        // callback(data.bggpassword);
        // 
        // } else {
        // if (app.bggVerbose === true) {
        // Toast.toast("Could not post to BGG: no BGG ID associated with this game.");
        // 
        // }
        // }
        // 
        // } else {
        // app.saveSetting("bggUsername", username);
        // app.saveSetting("bggPassword", password);
        // $('#saveBGGLogin .ui-btn-text').text("Sign Out");
        // Toast.toast("Signed in! Future games will be posted automatically.");
        // }
        // } else {
        // Toast.toast("Your BoardGameGeek login is incorrect or the service is down.");
        // }
        // } else {
        // if (app.bggVerbose === true) {
        // Toast.toast("Please login first");
        // changePage("#editbgg", {
        // changeHash: false //do not track it in history
        // });
        // }
        // app.bPostBGG = true;
        // }
        // })
        // .fail(function (xhr, err) {
        // app.bPostBGG = true;
        // //console.log("failed");
        // var responseTitle = $(xhr.responseText).filter('title').get(0);
        // var response = $(xhr.responseText).filter('body').get(0);
        // //console.log(response);
        // if (Globals.bDebug === true) {
        // Toast.toast($(responseTitle).text() + "\n" + formatErrorMessage(xhr, err) ); 
        // }
        // })
        // .always(function () {
        // //console.log("complete");
        // $.mobile.loading('hide');
        // });
    },

    bggPost: function(myBGGObject, callback) {
        //console.log("bggPost");
        var bggUsername;
        var bggPassword;
        var l;
        var s;
        app.bggPosted = false;
        app.getSetting("bggUsername", "", function(setting) {

            bggUsername = setting;
            //console.log("bgg username: " + bggUsername);
            if (bggUsername !== "") {
                app.getSetting("bggPassword", "", function(setting) {

                    bggPassword = setting;
                    //console.log("bgg password: " + bggPassword);
                    if (bggPassword !== "") {
                        app.bggLogin(myBGGObject, bggUsername, bggPassword, function(bggPasswordAfter) {
                            $.mobile.loading('hide');
                            app.bggPush(myBGGObject, bggUsername, bggPasswordAfter, function() {
                                if (callback !== undefined) {
                                    callback();
                                }
                            });
                        });
                    } else {
                        if (app.bggVerbose === true) {
                            Toast.toast("Please login first");
                            changePage("#editbgg", {
                                changeHash: false //do not track it in history
                            });
                        }
                        app.bPostBGG = true;
                    }

                });
            } else {
                if (app.bggVerbose === true) {
                    Toast.toast("Please login first");
                    changePage("#editbgg", {
                        changeHash: false //do not track it in history
                    });
                }
                app.bPostBGG = true;
            }

        });
    },


    bggPush: function(myBGGObject, username, password, callback) {
        //console.log("username: " + username);
        //console.log("password: " + password);
        var dataString = myBGGObject.dataString();
        dataString += '&bggusername=' + encodeURIComponent(username);
        dataString += '&bggpassword=' + encodeURIComponent(password);
        //console.log("datastring: " + dataString);
        Internet.getURLSource('https://rebrandcloud.secure.omnis.com/extras/geekplay.asp', dataString, false, function(data) {
            if (data) {
                if (data.html != 'undefined') {
                    //console.log("parsing data for Plays");
                    //console.log(data.html);
                    if (data.html.indexOf("plays") > 0 && data.html.indexOf("You must login") === -1) {
                        app.getSetting("chkBGG", "true", function(setting) {
                            if (setting === "true") {
                                Toast.toast("BGG Game Posted");
                            }
                        });

                        app.bggPosted = true;
                        app.bPostBGG = true;
                    } else {
                        app.bPostBGG = true;
                        Toast.toast("BGG Post Error");
                    }
                } else {
                    if (app.bggVerbose === true) {
                        Toast.toast("Data/Internet Connection Error, please try again.");
                    }
                    app.bPostBGG = true;
                }
            }
        });

        if (callback) {
            callback();
        }
        // $.ajax({
        // url: "https://rebrandcloud.secure.omnis.com/extras/geekplay.asp",
        // data: dataString,
        // crossDomain: true,
        // dataType: "jsonp"
        // })
        // .done(function (data) {
        // //console.log("done");
        // //console.log(data);    
        // //console.log(data.length);
        // //for (var i=0; i< data.length; i++) {
        // //console.log(data.html);
        // if (data.html != 'undefined') {
        // //console.log("parsing data for Plays");
        // //console.log(data.html);
        // if (data.html.indexOf("plays") > 0 && data.html.indexOf("You must login") === -1) {
        // Toast.toast("BGG Game Posted");
        // app.bggPosted = true;
        // app.bPostBGG = true;
        // } else {
        // app.bPostBGG = true;
        // Toast.toast("BGG Post Error");
        // }
        // } else {
        // if (app.bggVerbose === true) {
        // Toast.toast("Data/Internet Connection Error, please try again.");
        // }
        // app.bPostBGG = true;
        // }
        // //}                       
        // })
        // .fail(function (xhr, err) {
        // //console.log("failed");
        // app.bPostBGG = true;
        // var responseTitle = $(xhr.responseText).filter('title').get(0);
        // var response = $(xhr.responseText).filter('body').get(0);
        // //console.log(response);
        // //Toast.toast($(responseTitle).text() + "\n" + formatErrorMessage(xhr, err) ); 
        // if (Globals.bDebug === true) {
        // Toast.toast("BGG connection failed, not posted.");
        // }
        // })
        // .always(function () {
        // //console.log("complete");
        // $.mobile.loading('hide');
        // if (callback !== undefined) {
        // callback();
        // }
        // });
    },

    addBGGPlayers: function(myBGGObject, callback) {
        //console.log("addBGGPlayers");
        var that = this;
        var bggWin = 0;
        var color = "";
        for (var i = 0; i < app.currGameDetails.players.length; i++) {
            var p = app.currGameDetails.players[i];
            //console.log("winner:" + p.winner);
            //console.log("P");
            //console.log(p);
            if (p.color !== "") {
                color = p.color;
            } else if (p.faction !== "") {
                color = p.faction;
            } else if (p.team !== "") {
                color = p.team;
            }
            if (p.winner === true || p.winner == 'true' || p.winner == -1 || p.winner == "-1") {
                bggWin = 1;
                //console.log("Winner: " + i);
            } else {
                bggWin = 0;
            }
            myBGGObject.addPlayer(p.player.name, p.player.bggUsername, p.points, color, p.position, bggWin);
        }
        //console.log(myBGGObject);
        callback(myBGGObject); //app.bggpost
    },

    addBGGPlayers2: function(myBGGObject, hist, callback) {
        var that = this;
        var bggWin = 0;
        var color = "";
        var p;
        var i;
        var l;
        for (i = 0; i < hist.scores.length; i++) {
            var s = hist.scores[i];
            //console.log("winner:" + p.winner);
            //console.log("s");
            //console.log(s);
            if (s.color !== "") {
                color = s.color;
            } else if (s.faction !== "") {
                color = s.faction;
            } else if (s.team !== "") {
                color = s.team;
            }
            if (s.win === true || s.win == "true" || s.win == -1 || s.win == "-1") {
                bggWin = 1;
                //console.log("Winner: " + i);
            } else {
                bggWin = 0;
            }

            l = hist.players.length;
            for (i = 0; i < l; i++) {
                if (s.playerId == hist.players[i].id) {
                    p = hist.players[i];
                    break;
                }
            }

            myBGGObject.addPlayer(p.name, p.bggUsername, s.points, color, s.position, bggWin);
        }
        //console.log(myBGGObject);
        callback(myBGGObject); //app.bggpost
    },

    launchReview: function() {
        this.store.saveSetting("askForReview", "reviewed");
        this.store.saveSetting("reviewVersion", Globals.appVersion);
        Globals.launchReview2();
    },


    launchFeedback: function() {
        this.store.saveSetting('askForReview', 'reviewed');
        this.store.saveSetting('reviewVersion', Globals.appVersion);
        Social.feedbackDialog();
    },

    updatePlayerPhoto: function(playerId, b64Image, callback) {
        this.store.updatePlayerPhoto(playerId, b64Image, function() {
            if (callback !== undefined) {
                callback();
            }
        });
    },

    updateGamePhoto: function(gameId, b64Image, callback) {
        this.store.updateGamePhoto(gameId, b64Image, function() {
            if (callback !== undefined) {
                callback();
            }
        });
    },

    updateSessionPhoto: function(sessionId, b64Image, callback) {
        //console.log(sessionId);
        //console.log(b64Image);
        app.historyIsLoaded = false;
        this.store.updateSessionPhoto(sessionId, b64Image, function() {
            if (callback !== undefined) {
                callback();
            }
        });
    },
    
    deleteSessionPhoto: function(fileURI, callback) {
        app.historyIsLoaded = false;
        //console.log("[deleteSesssionPhoto]");
        //console.log(sessionId);
        //console.log(b64Image);
        FileIO.deleteFile(fileURI, function(success) {
           //console.log("Finished delete"); 
           callback(true);
        });
    },

    checkSearch: function() {
        app.iSearch++;
        //console.log("Search: " + app.iSearch);
        if (app.iSearch >= 5) {
            var $el = $('#search-key');
            app.findGamesByName($el.val(), false, function() {
                clearTimeout(app.searchTimeout);
                app.bGameSearch = false;
                //console.log("From search");
                app.writeGamesToPage("games");
            });
        } else {
            app.searchTimeout = setTimeout(app.checkSearch, 500);
        }
    },

    searchSubmit: function() {
        $.mobile.loading("show");
        var $el = $('#search-key');
        clearTimeout(app.searchTimeout);
        app.bGameSearch = false;
        app.iSearch = 0;
        app.findGamesByName($el.val(), false, function() {
            app.writeGamesToPage("games");
            $.mobile.loading('hide');
        });
        return false;
    },

    checkSearch2: function() {
        //console.log("CheckSearch2 " + app.iSearch2);
        if (app.bSearching2 === false) {
            app.iSearch2++;
            //console.log("Search: " + app.iSearch2);
            if (app.iSearch2 >= 5) {
                clearTimeout(app.searchTimeout2);

                var $el = $('#search-key2');
                app.iCurrGamesOnline = 0;
                app.findGamesOnline($el.val(), app.iCurrGamesOnline);
            } else {
                app.searchTimeout2 = setTimeout(app.checkSearch2, 500);
            }

        } else {
            clearTimeout(app.searchTimeout2);
        }
    },

    searchSubmit2: function() {
        //console.log("SearchSubmit2");
        $.mobile.loading('show');
        var $el = $('#search-key2');
        clearTimeout(app.searchTimeout2);
        app.bGameSearch2 = false;
        app.iSearch2 = 0;
        app.findGamesOnline($el.val(), app.iCurrGamesOnline);
        return false;
    },

    initialize: function(callback) {
        //console.log("[APP] Initialize");
        var ts = getTimestamp();
        this.oldStore=null;
        this.gallery=[];
        this.gallerySorted=[];
        this.bShowHidden=false;
        this.lastNotes = '';
        this.lastPhoto = '';
        this.lastOnlineGameSearch = "";
        this.gamePhotoChanged=false;
        this.playerPhotoChanged=false;
        this.lastSearchTerm = "";
        this.pickRoundsWasOn = false;
        this.pickScoreWasOn = false;
        this.myTwitterPhoto = "";
        this.wroteHist = false;
        this.wroteAch = false;
        this.wroteGal = false;
        this.wroteGames = false;
        this.wroteHistDel = false;
        this.avatars = [];
        this.playStart = 0;
        this.playEnd = 0;
        this.oldFavorites = [];
        this.bJustConverted = false;
        this.currSessionPhoto='';
        this.lastAvatar = 0;
        this.oldCloudUsername = "";
        this.searchedOnce = false;
        this.searchedOnce2 = false;
        this.currGame = null;
        this.currGameDetails = null;
        this.currGames = [];
        this.currGamesPaused = [];
        this.currGameOnline = null;
        this.currGamesOnline = [];
        this.iCurrGamesOnline = 1;
        this.bCurrGamesOnline = false;
        this.onlineGameToAdd = null;
        this.currPlayers = [];
        this.currPlayersHidden = [];
        this.currPlayersTemp = [];
        this.currAwards = [];
        this.currAwardsEarned = [];
        this.currHistory = [];
        this.currHistoryDisplay = [];
        this.currHist = null;
        this.currAwardDisplay = [];
        this.historyPage = 0;
        this.galleryPage = 0;
        this.awardPage = 0;
        this.selectedPlayerIds = [];
        this.currTeams = [];
        this.currTeamsTemp = [];
        this.currFactions = [];
        this.currFactionsTemp = [];
        this.currLocations = [];
        this.currLocationsTemp = [];
        this.currBGGIDs = null;
        this.currHistoryId = "";
        this.currEditPlayerId = "";
        this.currEditPlayer = null;
        this.currDeletePlayerName = "";
        this.currDeletePhotoName = "";
        this.currDeletePhotoId = -1;
        this.currDeleteFileURI = "";
        this.currEditGameId = "";
        this.currDeletePlayerId = "";
        this.currDeleteGameId = "";
        this.currDeleteGameName = "";
        this.currDeleteHistoryId = "";
        this.currDeleteHistoryName = "";
        this.currEditGame = null;
        this.loadedWidgets = false;
        this.widgetDisplay = "byPlayer";
        this.globalSessionId = 0;
        this.currPlayerIcon = 1;
        this.currGameIcon = 1;
        this.choosePlayerPicSource = "";
        this.lastAchGameSelection = ",0";
        this.lastAchPlayerSelection = "-1";
        this.lastHistGameSelection = ",0";
        this.lastHistPlayerSelection = "-1";
        this.lastStatsGameSelection = ",0";
       
        this.playerFromSettings = false;
        this.gameFromSettings = false;
        this.gameChoosePic = false;
        this.gameChooseIcon = false;
        this.playerChoosePic = false;
        this.playerChooseIcon = false;
        this.choosePicSource = "";
        this.playerEditMode = false;
        this.playerEditAdd = false;
        this.gameEditMode = false;
        this.statTotalWins = [];
        this.bStatTotalWins = false;
        this.bStatTotalWinsComplete = false;
        this.statTotalWinsGame = [];
        this.bStatTotalWinsGame = false;
        this.bStatTotalWinsGameComplete = false;
        this.statWinPercent = [];
        this.statWinPercentTicks = [];
        this.bStatWinPercent = false;
        this.bStatWinPercentComplete = false;
        this.statWinPercentGame = [];
        this.bStatWinPercentGame = false;
        this.bStatWinPercentGameComplete = false;
        this.statAvgScore = [];
        this.bStatAvgScore = false;
        this.bStatAvgScoreComplete = false;
        this.statTopTen = [];
        this.bStatTopTen = false;
        this.bStatTopTenComplete = false;
        this.lastSelectedPlayerIds = [];
        this.bSearching2 = false;
        this.searchTimeout = "";
        this.searchTimeout2 = "";
        this.bGameSearch = false;
        this.bGameSearch2 = false;
        this.bggVerbose = false;
        this.gameImportMode = false;
        this.gameFromSettings = false;
        this.gameTestMode = false;
        this.backButtonLocked = false;
        this.menuButtonLocked = false;
        this.historyIsLoaded = false;
        this.bPostBGG = false;
        this.bStat0 = false;
        this.bStat1 = false;
        this.bStat2 = false;
        this.bStat3 = false;
        this.bStat4 = false;
        this.bStat5 = false;
        this.bStat6 = false;
        this.bStat7 = false;
        this.bStat8 = false;
        this.bStat9 = false;
        this.bStat10 = false;
        this.bStat11 = false;
        this.bStat12 = false;
        this.bStat13 = false;
        this.bggPosted = false;
        this.iSearch = 0;
        this.iSearch2 = 0;
        this.bOnlyFav = false;
        this.playersDisplay = [];
        this.gamesDisplay = [];
        this.awardsDisplay = [];
        this.typeDisplay = [];
        this.numPlayersDisplay = [];
        this.currFactions = [];
        this.lastGameAdd = ts;
        this.lastGameLoad = 0;
        this.lastGamePausedAdd = ts;
        this.lastGamePausedLoad = 0;
        this.lastPlayerAdd = ts;
        this.lastPlayerLoad = 0;
        this.lastHistoryAdd = ts;
        this.lastHistoryLoad = 0;
        this.lastTeamAdd = ts;
        this.lastTeamLoad = 0;
        this.lastFactionAdd = ts;
        this.lastFactionLoad = 0;
        this.tempEditGame = null;
        this.tempEditPlayer = null;
        this.store = new LocalStore(
            function storeCreated(success) {
                //console.log("store created");
            },
            function LocalStoreError(errorMessage) {
                alertDebug('Error: ' + errorMessage);
            });



        //SORTABLE START

        $(document).bind('pagecreate', function() {
            $("#sortable").sortable();
            $("#sortable").disableSelection();
            $("#sortable").bind("sortstop", function(event, ui) {
                $('#sortable').listview('refresh');
            });
        });

        //SORTABLE END

        $("img").error(function(){
                $(this).hide();
        });
        
        $("img").load(function(){
                $(this).show();
        });
        
        $(function() {
            $('div[data-role="dialog"]').on('pagebeforeshow', function(e, ui) {
                ui.prevPage.addClass("ui-dialog-background ");
            });

            $('div[data-role="dialog"]').on('pagebeforeshow', function(e, ui) {
                $(".ui-dialog-background ").removeClass("ui-dialog-background ");
            });
        });

        //NAILTHUMB
        //$('.nailthumb-container').nailthumb();
        //console.log("[SWIPEBOX INIT]");
        $('.test-swipebox').swipebox();
        
        this.store.findAllGames(false, function(games) {
            //console.log(games); 
            app.currGames = games;

        });

        app.loadPlayers(true, function(players) {
            //console.log(players);
            app.currPlayers = players;

        });

        app.initAwards(function() {

        });

        app.initAvatars(function() {

        });
        
        app.hideGallery(function() {
            
        });

        app.getSetting("AddOldGameData", false, function(added) {
            if (added === false) {
                app.store.addOldGameData(function() {
                    app.saveSetting("AddOldGameData", true, function() {

                    });
                });
            }
        });
        
        app.getSetting("flip-buttons", Globals.bMiniDefault, function(setting) {
           if (setting === "big") {
                Globals.bMini = false;               
           } else {
               Globals.bMini = true;
           }
           //console.log("bMini: " + Globals.bMini); 
        });
        
        //initialize game search bar
        $(document).on('pagecreate', function() {
            var $el = $('#search-key');
            $el.keyup(function() {
                app.iSearch = 0;
                if (app.bGameSearch === false) {
                    //console.log("KeyUp1!");
                    app.bGameSearch = true;
                    app.searchTimeout = setTimeout(app.checkSearch, 500);
                }
            });

            $el = $('#search-key2');
            $el.keyup(function() {

                app.iSearch2 = 0;
                if (app.bSearching2 === false) {
                    //console.log("KeyUp2!");
                    app.bGameSearch2 = true;
                    app.searchTimeout2 = setTimeout(app.checkSearch2, 500);
                }
            });
        });

        $(document).ready(function() {
            //console.log("Ready from init");
            $.mobile.defaultPageTransition   = 'none';
            $.mobile.defaultDialogTransition = 'none';
            $.mobile.buttonMarkup.hoverDelay = 0;

        });
        
        $('#test').on('click', function() {
           app.convertOldPhotos(function(){
              //console.log("called back to test"); 
           });
        });

        $('.lightBox').on('click', function(e) {
            //console.log("lightbox click");
            e.preventDefault();
            var start = $(this).attr("data-start");
           app.lightBoxDisplay(start); 
        });

        $('#chkCloudActivity').on('change', function() {
            var isChecked = $('#chkCloudActivity').is(':checked');
            //console.log("autologout: " + isChecked);
            if (isChecked === true) {
                app.saveSetting("chkCloudActivity", "true");
            } else {
                app.saveSetting("chkCloudActivity", "false");
            }
        });

        $('#chkCloudInactive').on('change', function() {
            var isChecked = $('#chkCloudInactive').is(':checked');
            //console.log("autologout: " + isChecked);
            if (isChecked === true) {
                app.saveSetting("chkCloudInactive", "true");
            } else {
                app.saveSetting("chkCloudInactive", "false");
            }
        });

        $('#chkSessionTimer').on('change', function() {
            var isChecked = $('#chkSessionTimer').is(':checked');
            //console.log("autologout: " + isChecked);
            if (isChecked === true) {
                app.saveSetting("chkSessionTimer", "true");
            } else {
                app.saveSetting("chkSessionTimer", "false");
            }
        });

        $('#chkBGG').on('change', function() {
            var isChecked = $('#chkBGG').is(':checked');
            //console.log("autologout: " + isChecked);
            if (isChecked === true) {
                app.saveSetting("chkBGG", "true");
            } else {
                app.saveSetting("chkBGG", "false");
            }
        });



        $('#chkGameOverMan').on('change', function() {
            var isChecked = $('#chkGameOverMan').is(':checked');
            //console.log("autologout: " + isChecked);
            if (isChecked === true) {
                app.saveSetting("chkGameOverMan", "true");
            } else {
                app.saveSetting("chkGameOverMan", "false");
            }
        });

        $('#chkHiddenPlayers').on('change', function() {
            var isChecked = $('#chkHiddenPlayers').is(':checked');
            //console.log("autologout: " + isChecked);
            if (isChecked === true) {
                app.saveSetting("chkHiddenPlayers", "true");
            } else {
                app.saveSetting("chkHiddenPlayers", "false");
            }
        });

        // $('#chkOnlineGames').on('change', function() {
            // var isChecked = $('#chkOnlineGames').is(':checked');
            // //console.log("autologout: " + isChecked);
            // if (isChecked === true) {
                // app.saveSetting("chkOnlineGames", "false");
            // } else {
                // app.saveSetting("chkOnlineGames", "true");
            // }
        // });

        $('#radioSelection-1').on('change', function() {
            //console.log('clicked external');
            app.saveSetting("filterHistoryPlayers", "none");
            app.historyIsLoaded = false;
        });

        $('#radioSelection-2').on('change', function() {
            //console.log('clicked external');
            app.saveSetting("filterHistoryPlayers", "soft");
            app.historyIsLoaded = false;
        });

        $('#radioHistory-1').on('change', function() {
            //console.log('clicked external');
            app.saveSetting("filterHistory", "none");
            app.historyIsLoaded = false;
        });

        $('#radioHistory-2').on('change', function() {
            //console.log('clicked external');
            app.saveSetting("filterHistory", "hard");
            app.historyIsLoaded = false;
        });

        $('#radioAwards-1').on('change', function() {
            //console.log('clicked external');
            app.saveSetting("filterHistoryAwards", "none");
            app.historyIsLoaded = false;
        });

        $('#radioAwards-2').on('change', function() {
            //console.log('clicked external');
            app.saveSetting("filterHistoryAwards", "soft");
            app.historyIsLoaded = false;
        });

        $('#radioStats-1').on('change', function() {
            //console.log('clicked external');
            app.saveSetting("filterHistoryStats", "none");
            app.historyIsLoaded = false;
        });

        $('#radioStats-2').on('change', function() {
            //console.log('clicked external');
            app.saveSetting("filterHistoryStats", "soft");
            app.historyIsLoaded = false;
        });

        $('#radioStats-3').on('change', function() {
            //console.log('clicked external');
            app.saveSetting("filterHistoryStats", "hard");
            app.historyIsLoaded = false;
        });

        $('#radioHistory-1').on('change', function() {
            //console.log('clicked external');
            app.saveSetting("filterHistory", "none");
            app.historyIsLoaded = false;
        });

        $('#radioHistory-2').on('change', function() {
            //console.log('clicked external');
            app.saveSetting("filterHistory", "hard");
            app.historyIsLoaded = false;
        });

        $('#radioGallery-1').on('change', function() {
            //console.log('clicked external');
            app.saveSetting("filterHistoryGallery", "none");
            app.historyIsLoaded = false;
        });

        $('#radioGallery-2').on('change', function() {
            //console.log('clicked external');
            app.saveSetting("filterHistoryGallery", "hard");
            app.historyIsLoaded = false;
        });

        $('#buttonPromptGameURL').on('click', function() {
            app.saveEditGame(false, function(g) {
                if (g) {
                    app.currEditGame = g;
                    changePage('#promptGameURL', {
                        transition: 'pop',
                        role: 'dialog'
                    });   
                }
            });
        });

        $('#buttonPromptGameIcon').on('click', function() {
            app.saveEditGame(false, function(g) {
                if (g) {
                    app.currEditGame = g;
                    changePage('#promptGameIcon', {
                        transition: 'pop',
                        role: 'dialog'
                    });   
                }
            });
        });

        $('#deletePhotoBySessionId').on('click', function() {
            //console.log("clicked");
            var sessionId = "-1";
            app.updateSessionPhoto(app.currDeletePhotoId, "", function() {
                //console.log("called back");

                for (var i = 0; i < app.currHistoryDisplay.length; i++) {
                    //console.log(app.currHistoryDisplay[i]);
                    if (app.currHistoryDisplay[i].session.sessionId == app.currDeletePhotoId) {
                        //console.log("Delete");
                        app.currHistoryDisplay[i].session.sessionPhoto = "";
                        break;
                    }
                }
                
                app.deleteSessionPhoto(app.currDeleteFileURI, function() {
                    Toast.toast("Deleted Photo");
                    changePage("#delete"); 
                });
            });
        });

        $(document).on('click', '.galleryDelete', function() {
            //console.log("Clicked");
            var id = $(this).attr('id');
            var imgName = $(this).attr('title');
            var fileURI = $(this).attr("data-fileURI");
            //console.log(id);
            //console.log(imgName);
            //console.log(fileURI);
            app.currDeletePhotoName = imgName;
            app.currDeletePhotoId = id;
            app.currDeleteFileURI = fileURI;
            changePage('#promptForDeletePhoto', {
                transition: 'pop',
                role: 'dialog'
            });


        });

        $('#btnFindOrphans').on('click', function() {
            app.findOrphans();
        });

        $('#pie1').on('click', function() {
            var game = $('#statsChooseGame').val();
            var statType = $('#statsChooseType').val();
            var numPlayers = $('#statsChooseNumPlayers').val();
            var sGame;
            var sPlayers;
            
            if (game === "") {
                sGame = "All Games";
            } else {
                sGame = "#" + game;
            }
            if (numPlayers === "") {
                sPlayers = "in";
            } else {
                sPlayers = "in " + numPlayers + "-player games of";
            }
            var sTweet = "Our #boardgame stats for Total Wins By " + toTitleCase(statType) + " " + sPlayers + " " + sGame;
            if (Device.platform !== "WinPhone" && Device.platform !== "Browser") {
                app.tweetChart($('#pie1'), sTweet);   
            }
        });

        $('#bar1').on('click', function() {
            var game = $('#statsChooseGame').val();
            var statType = $('#statsChooseType').val();
            var numPlayers = $('#statsChooseNumPlayers').val();
            var sGame;
            var sPlayers;
            
            if (game === "") {
                sGame = "All Games";
            } else {
                sGame = "#" + game;
            }
            if (numPlayers === "") {
                sPlayers = "in";
            } else {
                sPlayers = "in " + numPlayers + "-player games of";
            }
            var sTweet = "Our #boardgame stats for Chance Of Winning By " + toTitleCase(statType) + " " + sPlayers + " " + sGame;
            
            if (Device.platform !== "WinPhone" && Device.platform !== "Browser") {
                app.tweetChart($('#bar1'), sTweet);   
            }
            //var imgData = $('#bar1').jqplotToImageStr({});
            //Social.tweet(sTweet, imgData);
        });

        $('#bar2').on('click', function() {
            var game = $('#statsChooseGame').val();
            var statType = $('#statsChooseType').val();
            var numPlayers = $('#statsChooseNumPlayers').val();
            var sGame;
            var sPlayers;
            
            if (game === "") {
                sGame = "All Games";
            } else {
                sGame = "#" + game;
            }
            if (numPlayers === "") {
                sPlayers = "in";
            } else {
                sPlayers = "in " + numPlayers + "-player games of";
            }
            var sTweet = "Our #boardgame stats for Average Score By " + toTitleCase(statType) + " " + sPlayers + " " + sGame;
            //var imgData = $('#bar2').jqplotToImageStr({});
            //Social.tweet(sTweet, imgData);
            if (Device.platform !== "WinPhone" && Device.platform !== "Browser") {
                app.tweetChart($('#bar2'), sTweet);   
            }
        });

        $('#bar3').on('click', function() {
            var game = $('#statsChooseGame').val();
            var statType = $('#statsChooseType').val();
            var numPlayers = $('#statsChooseNumPlayers').val();
            var sGame;
            var sPlayers;
          
            if (game === "") {
                sGame = "All Games";
            } else {
                sGame = "#" + game;
            }
            if (numPlayers === "") {
                sPlayers = "in";
            } else {
                sPlayers = "in " + numPlayers + "-player games of";
            }
            var sTweet = "Our #boardgame stats for Top Scores By " + toTitleCase(statType) + " " + sPlayers + " " + sGame;
            //var imgData = $('#bar3').jqplotToImageStr({});
            //Social.tweet(sTweet, imgData);
            if (Device.platform !== "WinPhone" && Device.platform !== "Browser") {
                app.tweetChart($('#bar3'), sTweet);   
            }
        });

        $('#btnInstall').on('click', function() {
            //console.log("btnInstall");
            app.installOnlineGame(function() {
                // $('[data-role=dialog]').dialog( "close" ); 
                // $('#promptOnlineGame').dialog("close");
                window.history.back();
            });
        });

        $('#findBGGID').on('click', function() {
            //console.log("find bgg id");
            app.saveEditGame(false, function(g) {
                if (g) {
                    app.currEditGame = g;
                    var $el = $('#txtBGGSearch');
                    var name = $el.val();
                    name = name.trim();
                    if (name !== "") {
                        app.findBGGID(name, function(results) {
                            app.currBGGIDs = results;
                            app.gameImportMode = true;
                            changePage('#promptBGGID', {
                                transition: 'pop',
                                role: 'dialog'
                            });
                        });
                    }   
                }
            });
        });

        $('#findBGGID2').on('click', function() {
            //console.log("find bgg id");

            var $el = $('#search-key2');
            var name = $el.val();

            name = name.trim();
            if (name === '') {
                name = app.lastOnlineGameSearch;
            }
            if (name !== "") {
                app.lastOnlineGameSearch = name;
                app.findBGGID(name, function(results) {
                    app.currBGGIDs = results;
                    app.gameImportMode = true;
                    changePage('#promptBGGID2', {
                        transition: 'pop',
                        role: 'dialog'
                    });
                });
            } else {
                Toast.toast("Please enter a search term first");
            }
        });

        $('#btnShowHist').on('click', function() {
            var game = $('#histChooseGame').val();
            var player = $('#histChoosePlayer').val();
            var winner = $('#histChooseWinner').val();
            app.historyPage = 0;
            //console.log(game + " " + player + " " + winner);
            app.filterHistory(game, player, winner, function() {
                app.writeHistoryToPage(app.currHistoryDisplay, "history1", app.historyPage, function() {

                });
            });
        });

        $('#btnShowGal').on('click', function() {
            var game = $('#galChooseGame').val();
            var player = $('#galChoosePlayer').val();
            var winner = $('#galChooseWinner').val();
            app.galleryPage = 0;
            //console.log(game + " " + player + " " + winner);
            app.filterHistoryGallery(game, player, winner, function() {
                //console.log("Write Gal from btnShowGal");
                app.writeGalleryToPage(app.currHistoryDisplay, app.galleryPage, function() {

                });
            });
        });

        $('#btnShowHistDel').on('click', function() {
            var game = $('#histChooseGameDel').val();
            var player = $('#histChoosePlayerDel').val();
            var winner = $('#histChooseWinnerDel').val();
            app.historyPage = 0;
            //console.log(game + " " + player + " " + winner);
            app.filterHistory(game, player, winner, function() {
                app.writeHistoryToPage(app.currHistoryDisplay, "delete", app.historyPage, function() {

                });
            });
        });

        $('#btnShowStats').on('click', function() {
            var game = $('#statsChooseGame').val();
            var statType = $('#statsChooseType').val();
            var numPlayers = $('#statsChooseNumPlayers').val();
            var allowedPlayers = [];
            var $elHeader = $('#clickToShare');
            $elHeader.hide();
            //console.log(game + " " + statType + " " + numPlayers);
            app.filterHistoryStats(game, statType, numPlayers, function() {
                app.findGameById(game, function(myGame) {
                    //console.log(myGame);
                    if (myGame === null || myGame === undefined) {
                        myGame = new Game("", "", "All Games", "", "", "", "");
                    }
                    app.doStats(app.currHistoryDisplay, myGame, statType, function() {
                        //console.log("stats complete");
                        app.drawCharts(myGame.name, function() {
                            //console.log("Draw charts complete");

                        });
                    });
                });
            });
        });

        $('#btnShowAwards').on('click', function() {
            var game = $('#awardChooseGame').val();
            var player = $('#awardChoosePlayer').val();
            var type = $('#awardChooseType').val();
            app.awardPage = 0;
            //console.log(game + " " + player + " " + type);
            app.filterHistoryAwards(game, player, type, function() {
                app.writeAwardsToPage2(app.currAwardDisplay, "awards", app.awardPage, function() {

                });
            });
        });

        $('#btnGallery').on('click', function() {
            app.loadHistoryDelay(function() {
                app.filterHistoryGallery("", "", "", function() {
                    app.galleryPage = 0;
                    changePage('#gallery');
                });
            });
        });

        $('#btnDeleteHist').on('click', function() {
            app.loadHistoryDelay(function() {
                app.historyPage = 0;
                changePage('#deletehist');
            });
        });

        $('#btnStats').on('click', function() {
            app.loadStatsDelay(function() {
                changePage('#stats');
            });
        });

        $('#btnHistory').on('click', function() {
            app.loadHistoryDelay(function() {
                //$.mobile.loading("hide");
                app.historyPage = 0;
                changePage('#history');
            });
        });

        $('#btnAwards').on('click', function() {
            app.loadAwardsDelay(function() {
                app.awardPage = 0;
                changePage('#achievements');
            });
        });

        $('#btnNextHist').on('click', function() {
            app.writeHistoryToPage(app.currHistoryDisplay, "history1", app.historyPage, function() {

            });
        });

        $('#btnNextHistDel').on('click', function() {
            app.writeHistoryToPage(app.currHistoryDisplay, "delete", app.historyPage, function() {

            });
        });

        $('#btnNextGal').on('click', function() {
            app.writeGalleryToPage(app.currHistoryDisplay, app.galleryPage, function() {

            });
        });

        $('#btnNextAward').on('click', function() {
            app.writeAwardsToPage2(app.currAwardDisplay, "awards", app.awardPage, function() {

            });
        });

        $('#btnPauseGame').on('click', function() {
            app.pauseGame(function() {
                //console.log("Adding paused game:");
                //console.log(app.currGameDetails);
                app.addPausedGame(app.currGameDetails, function() {
                    changePage('#games');
                });
            });
        });
        
        $('#btnPauseErase').on('click', function() {
            app.pauseGame(function() {
                //console.log("Adding paused game:");
                //console.log(app.currGameDetails);
                app.addPausedGame(app.currGameDetails, function() {
                    changePage('#games');
                });
            });
        });

        $('#btnSaveTeams').on('click', function() {
            var $elTeam = $('#txtTeamAdd');
            var $elFaction = $('#txtFactionAdd');
            var $elColor = $('#selPlayerColor2');
            var bTeams = false;
            var newTeam;
            var newFaction;
            var myTeam = $elTeam.val();
            if (myTeam === "None" || myTeam === "---" || myTeam === "Team Names") {
                myTeam = "";
            }
            if (myTeam !== "") {
                app.addTeamData(myTeam, function() {

                });
            }
            if ($elFaction.val() !== "") {
                app.addFactionData($elFaction.val(), app.currGame.id, function() {

                });
            }
            //console.log("app.currEditPlayer");
            //console.log(app.currEditPlayer);
            app.currEditPlayer.faction = $elFaction.val();
            app.currEditPlayer.team = myTeam;
            app.currEditPlayer.color = $elColor.val();
            var l = app.currGameDetails.players.length;
            //console.log("l: " + l);
            for (var i = 0; i < l; i++) {
                if (app.currGameDetails.players[i].team !== "") {
                    bTeams = true;
                }
                //console.log(app.currGameDetails.players[i].player.id + " === " + app.currEditPlayer.player.id);
                if (app.currGameDetails.players[i].player.id === app.currEditPlayer.player.id) {
                    //console.log(app.currEditPlayer);
                    //console.log(i);
                    app.currGameDetails.players[i] = app.currEditPlayer;
                    break;
                }
            }
            app.currGameDetails.useTeams = bTeams;
            changePage("#playerorder");
        });

        $('#btnInstall2').on('click', function() {
            //console.log("Install 2");
            app.installOnlineGame(function() {
                //console.log("after install");
                for (var i = 0; i < app.currGames.length; i++) {
                    if (app.currGames[i].id == app.onlineGameToAdd.id) {
                        app.currGame = app.currGames[i];
                        app.generateScoreDetails(app.currGame, function(newGameDetails) {
                            app.currGameDetails = newGameDetails;
                            app.loadedWidgets = false;
                            //console.log("Current game: " + app.currGame.name);
                            $('#imgResultsContainer').empty();
                            $('#textareaNotes').val('');
                            app.lastPhoto = '';
                            app.lastNotes = '';
                            changePage("#players");
                        });
                        break;
                    }
                }
            });
        });

        $('#gamesDatabase').on('pagebeforeshow', function() {
            //console.log("pagebeforeshow");
            //app.writeGamesToPage("online", function() {

            //});
        });

        $('#deletephoto').on('pagebeforeshow', function() {
            app.filterHistoryGallery("", "", "", function() {
                //console.log("Write Gal from btnShowGal");
                app.writeGalleryToPageDelete(app.currHistoryDisplay, function() {
                    //console.log("wrote delte");
                });
            });
        });

        $('#prefs').on('pagebeforeshow', function() {
            app.loadPrefs(function() {

            });
        });

        $('#promptBGGID2').on("pagebeforeshow", function() {
            //console.log("Hide button");
            var $el = $('#bgg-id-list2');
            $el.empty();
            $el.append('<li data-role="list-divider" role="heading" >Create New Game From BGG Data</li>');
            //console.log("app.currBGGIDs: " );
            //console.log(app.currBGGIDs);

            if (app.currBGGIDs === null) {
                $el.append("<li>No results found</li>");
            } else {
                var l = app.currBGGIDs.length;
                var item;
                var name;
                for (var i = 0; i < l; i++) {
                    item = app.currBGGIDs[i];
                    name = item.name.value.replace(/'/g, "&#39;");
                    //console.log("item:");
                    //console.log(item);
                    if (item.id !== undefined && item.name !== undefined && item.yearpublished !== undefined) {
                        $el.append("<li id='" + item.id + "' name='" + name + "'><a href='#'>" + item.name.value + " (" + item.yearpublished.value + ")</a></li>");
                    }
                }
            }
            $el.listview("refresh");
        });

        $('#promptBGGID').on("pagebeforeshow", function() {
            //console.log("Hide button");
            var $el = $('#bgg-id-list');
            $el.empty();
            $el.append('<li data-role="list-divider" role="heading" >Games</li>');
            //console.log("app.currBGGIDs: " );
            //console.log(app.currBGGIDs);

            if (app.currBGGIDs === null) {
                $el.append("<li>No results found</li>");
            } else {
                var l = app.currBGGIDs.length;
                var item;
                var name;
                for (var i = 0; i < l; i++) {
                    item = app.currBGGIDs[i];
                    name = item.name.value.replace(/'/g, "&#39;");
                    //console.log("item:");
                    //console.log(item);
                    if (item.id !== undefined && item.name !== undefined && item.yearpublished !== undefined) {
                        $el.append("<li id='" + item.id + "' name='" + name + "'><a href='#'>" + item.name.value + " (" + item.yearpublished.value + ")</a></li>");
                    }
                }
            }
            $el.listview("refresh");
        });

        $('#history').on("pagebeforeshow", function() {
            //console.log("Hide button");
            if (app.wroteHist === false) {
                var $el = $('#divNextHistory');
                $el.hide();
            }
        });

        $('#gallery').on("pagebeforeshow", function() {
            //console.log("Hide button");
            if (app.wroteGal === false) {
                var $el = $('#divNextGal');
                $el.hide();
                $el = $('#divGalleryNoneFound');
                $el.hide();
            }
        });

        $('#deletehist').on("pagebeforeshow", function() {
            //console.log("Hide button");
            if (app.wroteHistDel === false) {
                var $el = $('#divNextHistoryDel');
                $el.hide();
            }
        });

        $('#achievements').on("pagebeforeshow", function() {
            //console.log("Hide button");
            if (app.wroteAch === false) {
                var $el = $('#divNextAward');
                $el.hide();
            }
        });

        $('#btnShareWithFriends').on('click', function() {
           Social.tweet("If you like #boardgames check out #ScoreGeek, the app I've been using to track scores and statistics: http://bit.ly/13aXBHV"); 
        });

        $('#home').on("pagebeforeshow", function() {
            app.loadedStatsGames = false;
            app.bggVerbose = false;
            app.clearPage("scoring");
            if (Device.platform !== "Browser") {
                $('#freeWebVersion').hide();
            } else {
                $('#freeWebVersion').show();
                Toast.toast("Please help support this free version: buy mobile, tell your friends and donate", false, true);
            }
            

            app.getSetting("flip-fav", "off", function(setting) {
                if (setting === "on") {
                    app.bOnlyFav = true;
                } else {
                    app.bOnlyFav = false;
                }
            });
            if (CloudAll.isReady === true) {
                //console.log("cloud ready so starting");
                CloudAll.timeout = setTimeout(CloudAll.start(true, true), 50);
            } else {
                //console.log("Cloud not ready, waiting");
            }
        });

        $('#home').on("pagebeforeshow", function() {
            //console.log("1");
            app.askForReview();
            app.loadPlayers(true, function(players) {
                //console.log(players);
                app.currPlayers = players;

            });
        });

        $('#edit').on("pagebeforeshow", function() {
            if (CloudAll.isReady === true) {
                //console.log("cloud ready so starting");
                CloudAll.start(true, true);
            }
            $('#addGameBackButton').attr('href', "#editgames");
            $('#btnBackFromBGG').attr('href', "#edit");
        });

        $('#buttonBackFromPlayers').on('click', function() {
            if (app.gameTestMode === true) {
                changePage("#addgame");
            } else {
                changePage("#games");
            }
        });


        $('#cloud').on('pagebeforeshow', function() {
            app.loadCloudLogin();
        });

        $('#editbgg').on('pagebeforeshow', function() {
            app.loadBGGLogin();
        });

        $('#popupBGG').on('pagebeforeshow', function() {
            //console.log("loading comments");
            app.loadBGGLogin2();
        });

        $('#addgame').on("pagebeforeshow", function() {
            //console.log("addgame pagebeforeshow");
            app.gamePhotoChanged = false;
            
            if (app.currEditGame !== null) {
                app.loadEditGame(function() {

                });
            } else {
                //console.log("app.clearPage");
                app.clearPage("AddGame");
            }

            app.bGameSearch = false;

            if ((app.gameEditMode === true || app.gameTestMode === true) && app.gameImportMode !== true && app.gameTestMode !== true) {

                $('#addGameBackButton').attr('href', "#editgames");

            } else if (app.gameImportMode !== true && app.gameTestMode !== true) {
                if (app.gameFromSettings === true) {
                    $('#addGameBackButton').attr('href', "#editgames");
                } else {
                    $('#addGameBackButton').attr('href', "#games");
                }
            }

            //if (Device.platform === "Browser") {
            //$('#buttonChangeGamePicture').hide();
            //}    
        });

        $('#btnImageFromBGG').on('click', function() {
            var $elBGGID = $('#textBGGID');
            var bggID = $elBGGID.val();
            var $elURL = $('#textImageURL');
            app.getBGGImage(bggID, function(url) {
                $elURL.val(url);
                app.choosePicSource = url;
            });
        });

        $('#btnImageURLSave').on('click', function() {
            var $elURL = $('#textImageURL');
            var myURL = $elURL.val();
            var myURLLower = myURL.toLowerCase();
            if (myURLLower.indexOf('http://') === -1 && myURLLower.indexOf('https://') === -1) {
                myURL = "http://" + myURL;
            }
            app.currEditGame.icon = myURL;
            app.currEditGame.iconURL = myURL;
            $.mobile.back();
        });

        $('#btnPlayerImageURLSave').on('click', function() {
            var $elURL = $('#textPlayerImageURL');
            var myURL = $elURL.val();
            var myURLLower = myURL.toLowerCase();
            if (myURLLower.indexOf('http://') === -1 && myURLLower.indexOf('https://') === -1) {
                myURL = "http://" + myURL;
            }
            //app.playerEditMode = false;
            app.choosePlayerPicSource = myURL;
            app.playerChoosePic = true;
            $.mobile.back();
        });

        $('#launchDocs').on("click", function() {
            Social.launchURL("https://getsatisfaction.com/rebrand_software/topics/scoregeek_advanced_scoring");
        });

        $('#buttonEndTest').on('click', function() {
            changePage('#addgame');
        });

        $('#testNewGame').on('click', function() {
            app.gameTestMode = true;
            
            app.saveEditGame(true, function(testGame) {
                if (testGame) {
                    app.loadedWidgets = false;
                    app.generateScoreDetails(testGame, function(newGameDetails) {
                        app.currGame = testGame;
                        app.currEditGame = testGame;
                        app.currGameDetails = newGameDetails;
                        changePage("#players");
                    });
                } 
            });
        });

        $('#promptExportGame').on('pagebeforeshow', function() {
            app.gameImportMode = true;
            var $elTextareaExportGame = $('#textareaExportGame');
            app.getGameExport(false, function(myExport) {
                $elTextareaExportGame.val(myExport);
            });
        });

        $('#importGameDef').on('click', function() {
            app.gameImportMode = true;
        });

        $('#importGame').on('click', function() {
            var importText = $('#textareaImportGame').val();
            app.importGame(importText, function(myGame) {
                if (myGame) {
                    Toast.toast("Import Complete");
                    app.currEditGame = myGame;
                    window.history.back();
                } else {
                    Toast.toast("Import failed, check format at jsonlint.com");
                }
            });
        });

        $('#btnEditScores').on('click', function() {
            changePage("#editScores", {
                changeHash: false //do not track it in history
            });
        });

        $('#addPlayerContact').on('click', function() {

            var c;
            //console.log("Device.platform: " + Device.platform);
            if (Device.platform === "iOS" || Device.platform === "WinPhone") {
                //console.log("clicked");
                navigator.contacts.pickContact(function(contact) {
                    //console.log('The following contact has been selected:' + JSON.stringify(contact));
                    //console.log(contact);
                    app.processContact(contact, function() {

                    });

                }, function(err) {
                    //console.log('Error: ' + err);
                });
            } else if (Device.platform === "FirefoxOS") {
                //console.log("using pick");
                var pick = new MozActivity({
                    name: "pick",
                    data: {
                        type: "webcontacts/contact"
                    }
                });

                pick.onsuccess = function() {
                    //console.log("got contact");
                    var contact = this.result;
                    //console.log(contact);
                    if (contact) {
                        var name = contact.name[0];
                        //console.log("Name: " + name);
                        c = new FakeContact(name);
                        app.processContact(c, function() {

                        });
                    } else {
                        //console.log("contact failed1");
                        c = new FakeContact("");
                        app.processContact(c, function() {

                        });
                    }
                };

                pick.onerror = function() {
                    //console.log("contact failed");
                    c = new FakeContact("");
                    app.processContact(c, function() {

                    });
                };

                // var options      = new ContactFindOptions();
                // options.filter   = "Bob";
                // options.multiple = true;
                // options.desiredFields = [navigator.contacts.fieldType.id];
                // var fields       = [navigator.contacts.fieldType.displayName, navigator.contacts.fieldType.name];
                // navigator.contacts.find(fields, onSuccess, onError, options);
            } else if (Device.platform === "Android") {
                //ANDROID
                window.plugins.ContactPicker.chooseContact(function(contactInfo) {
                    //console.log(contactInfo);
                    c = new FakeContact(contactInfo.displayName);
                    app.processContact(c, function() {

                    });
                });
            } else {
                Toast.toast("Not supported on this device");
            }

        });

        $('#historyBGG').on('click', function() {
            app.getSetting("bggUsername", "", function(bggUsername) {
                app.getSetting("bggPassword", "", function(bggPassword) {
                    if (bggUsername !== "" && bggPassword !== "") {
                        $.mobile.loading("show");
                        //console.log(app.currHist);
                        var today = new Date(app.currHist.session.sessionDate);
                        var dd = today.getDate();
                        var mm = today.getMonth() + 1; //January is 0!
                        var yyyy = today.getFullYear();
                        if (dd < 10) {
                            dd = '0' + dd;
                        }
                        if (mm < 10) {
                            mm = '0' + mm;
                        }
                        today = yyyy + '-' + mm + '-' + dd;
                        var myBGGObject = new BGGObject(app.currHist.game.bggId, today, app.currHist.session.sessionLocation, app.currHist.session.sessionLocation, app.currHist.session.sessionNotes);
                        app.addBGGPlayers2(myBGGObject, app.currHist, function(myBGGObject) {
                            app.bggPost(myBGGObject, function() {
                                $.mobile.loading('hide');
                            });
                        });
                    } else {
                        $('#btnBackFromBGG').attr('href', "#history-details");
                        changePage("#editbgg");
                    }
                });
            });

        });

        $('#addplayer').on("pagebeforeshow", function() {
            //console.log("ADDpLAYER");
            app.playerPhotoChanged = false;
            var $elContacts = $('#addPlayerContact');


            //Device.platform = "Android";
            if (Device.platform === "Browser") {
                $elContacts.remove();
            }

            var $elPlayerHidden = $('#playerHidden');
            var $elPlayerHiddenDiv = $('#playerHiddenDiv');

            if (app.playerChoosePic !== true && app.playerChooseIcon !== true) {
                app.currPlayerIcon = 1;
            }

            var $el = $('#imgPlayerImage');
            var $elCol = $('#imgPlayerColor');

            if (app.playerEditMode === true) {
                $elPlayerHiddenDiv.show();
                $('#addPlayerBackButton').attr('href', "#editplayers");
                $("#textNewPlayerId").prop('disabled', true);
                for (var i = 0; i < app.currPlayers.length; i++) {
                    if (app.currPlayers[i].id == app.currEditPlayerId) {
                        var myPlayer = app.currPlayers[i];
                        //console.log(myPlayer);

                        $('#textNewPlayerName').val(myPlayer.name);
                        $('#textNewPlayerId').val(myPlayer.id);
                        //console.log("myPlayer.bggusername: " + myPlayer.bggusername);
                        $('#textBGGUsername2').val(myPlayer.bggUsername);
                        $('#textNewPlayerTwitter').val(myPlayer.twitter);

                        if (myPlayer.iconURL == "BLOB") {
                            $el.attr('src', myPlayer.icon).load();
                        } else {
                            $el.attr('src', myPlayer.iconURL).load();
                        }

                        $el.nailthumb({
                            width: 80,
                            height: 80
                        });
                        $elCol.attr('src', 'img/colors/' + myPlayer.color + '0032.png');
                        $el.show();
                        //console.log("CURRPLAYER HIDDEN: " + myPlayer.hiddenOnDevice);
                        if (myPlayer.hiddenOnDevice === true) {
                            //console.log("checked");
                            $elPlayerHidden.prop('checked', true).checkboxradio('refresh');
                        } else {
                            $elPlayerHidden.prop('checked', false).checkboxradio('refresh');
                            //console.log("false");
                        }
                        break;
                    }
                }
            } else {
                $elPlayerHiddenDiv.hide();
                $("#textNewPlayerId").prop('disabled', false);
                if (app.playerFromSettings === true) {
                    $('#addPlayerBackButton').attr('href', "#editplayers");
                } else {
                    //console.log("players length: " + app.currPlayers.length);
                    if (app.currPlayers.length === 0) {
                        $('#addPlayerBackButton').attr('href', "#games");
                    } else {
                        $('#addPlayerBackButton').attr('href', "#players");
                    }

                }
                $elPlayerHidden.attr('checked', false).checkboxradio('refresh');
                if (app.playerChoosePic !== true && app.playerChooseIcon !== true) {
                    app.clearPage("addplayer");
                }

            }

            if (app.playerChoosePic === true) {
                app.playerChoosePic = false;
                //console.log("choose player pic: " + app.currPlayerIcon);
                //console.log("source: " + choosePlayerPicSource);
                if (app.choosePlayerPicSource !== "") {
                    $el.attr('src', app.choosePlayerPicSource).load();
                    $el.nailthumb({
                        width: 80,
                        height: 80
                    });
                }
            }

            if (app.playerChooseIcon === true) {
                app.playerChooseIcon = false;
            }

        });

        $('#promptGameURL').on("pagebeforeshow", function() {
            app.gameChoosePic = true;
            var $elImageURL = $('#textImageURL');
            $elImageURL.val("");
        });

        $('#promptGameIcon').on("pagebeforeshow", function() {
            app.gameChooseIcon = true;
        });

        $('#promptPlayerURL').on("pagebeforeshow", function() {
            app.playerChoosePic = true;
        });

        $('#promptPlayerIcon').on("pagebeforeshow", function() {
            app.playerChooseIcon = true;
            var $el = $('#player-icon-list');
            app.getSetting("avatarsUnlocked", 0, function(avatarsUnlocked) {
                var l = avatarsUnlocked;
                for (var i = app.lastAvatar; i < l; i++) {
                    app.lastAvatar = i + 1;
                    var a = app.avatars[i];
                    $el.append('<li id="playerIcon' + a.id + '"><a href="#"><img src="img/players/Player' + a.id + '.png" /><h3>' + a.name + '</h3></a></li>');
                    $el.listview("refresh");
                }
            });
        });

        $('#results').on("pagebeforeshow", function() {
            app.clearPage("results");
            app.playEnd = getTimestamp();
            var playDuration = (app.playEnd - app.playStart);
            var playMinutes = parseInt((playDuration / 60000), 10);
            var $elDuration = $('#textDuration');
            $elDuration.attr("Placeholder", playMinutes + " minutes since scoring started");
            app.backButtonLocked = false;
            app.menuButtonLocked = false;
        });

        $('#testresults').on("pagebeforeshow", function() {
            app.clearPage("testresults");
        });

        //clear search
        $('#frmGameSearch').on('click', '.ui-input-clear', function() {
            app.findGamesByName("", false, function() {
                //console.log("from click");
                app.writeGamesToPage("games");
            });
        });

        //clear search
        $('#frmOnlineGameSearch').on('click', '.ui-input-clear', function() {
            app.iCurrGamesOnline = 1;
            app.findGamesOnline("", app.iCurrGamesOnline);
        });

        $('#cloudSignup').on('click', function() {
            var url = "https://rebrandcloud.secure.omnis.com";
            Social.launchURL(url);
        });

        $('#bggSignup').on('click', function() {
            var url = "http://www.boardgamegeek.com/register";
            Social.launchURL(url);
        });

        $('#addPlayerFromSettings').on('click', function() {
            //console.log("add player from settings");
            app.playerEditMode = false;
            app.playerEditAdd = true;
            changePage("#addplayer");
        });

        $('#addGameFromSettings').on('click', function() {
            app.gameFromSettings = true;
            app.gameEditMode = false;
            app.gameImportMode = false;
            app.gameTestMode = false;
            app.currEditGame = null;
            changePage("#addgame");
        });

        //load all games
        $('#games').on("pagebeforeshow", function() {
            
            //console.log("app.lastGameAdd: " + app.lastGameAdd);
            //console.log("app.lastGameLod: " + app.lastGameLoad);
            //console.log("app.lastGamePsA: " + app.lastGamePausedAdd);
            //console.log("app.lastGamePsL: " + app.lastGamePausedLoad);
            app.gameTestMode = false;
            app.lastSearchTerm = "";
            app.gameFromSettings = false;
            var $elFlip = $('#flip-fav');

            if (app.bOnlyFav === true) {
                $elFlip.flipswitch();
                $elFlip.val("on");
                $elFlip.flipswitch('refresh');
            } else {
                $elFlip.flipswitch();
                $elFlip.val("off");
                $elFlip.flipswitch('refresh');
            }

            app.findAllPaused(function(paused) {
                app.currGamesPaused = paused;
                //console.log('if (app.bJustConverted === true || app.lastGameAdd > app.lastGameLoad || app.lastGamePausedAdd > app.lastGamePausedLoad');
                //console.log("if " + app.bJustConverted + " = true || " + app.lastGameAdd + " > " + app.lastGameLoad + " || " + app.lastGamePausedAdd  + " > " + app.lastGamePausedLoad);

                if (app.bJustConverted === true || app.lastGameAdd > app.lastGameLoad || app.lastGamePausedAdd > app.lastGamePausedLoad) {
                    //console.log("Out of sync, loading");
                    //app.loadGamesDelay(function(games) {
                    app.findAllGames(false, function(games) {
                        //console.log("After find games delay");
                        //console.log(games);
                        games.sort(dynamicSort("name"));
                        app.currGames = games;
                        // app.writeGamesToPage("games", function() {
                        //                         
                        // });
                        app.writeGamesToPageDelay(true);
                        //app.writeGamesToPage("games");
                    });

                } else {
                    //console.log("cached");
                    //app.writeGamesToPage("games");
                }


            });
        });

        $('#gamesDatabase').on("pagebeforeshow", function() {
            var $elNext = $('#divNextOnline');
            var $elPrev = $('#divPrevOnline');
            var $elSearch = $('#divSearchBGG');
            var $el = $('#search-key2');
            $el.val(app.lastSearchTerm);

            if (app.wroteGames === false) {
                $elNext.hide();
                $elPrev.hide();
                $elSearch.hide();
            }
            if (app.searchedOnce2 === false) {
                app.searchedOnce2 = true;

                app.findGamesOnline($el.val(), app.iCurrGamesOnline);
            }
        });

        $("#flip-fav").on("change", function() {
            //console.log("clicked");
            var $elFlip = $('#flip-fav');
            var $el = $('#search-key');
            var flipVal = $elFlip.val();
            //console.log("Value: " + flipVal);
            app.saveSetting("flip-fav", flipVal);

            if (flipVal === "on") {
                app.bOnlyFav = true;

            } else {
                app.bOnlyFav = false;
            }
            //console.log("app.bOnlyFav: " + app.bOnlyFav);
            app.findGamesByName($el.val(), false, function() {
                //console.log("from flipfav");
                app.writeGamesToPage("games");
            });
        });


        //show advanced area when selected
        $('#selectNewGameScoring').on("change", function() {
            //console.log("change");

            var textarea = $('#advancedTextField');
            var text = $('#advancedText');
            var select = $('#selectNewGameScoring :selected').val();
            //console.log ("selected " + select);
            textarea.hide();
            text.text('');

            if (select == 'advanced') {
                textarea.show();
            }
        });

        $('#flip-online').on('change', function() {
            app.iCurrGamesOnline = 1;
            var setting = $('#flip-online').val();
            //console.log("setting: " + setting);
            app.saveSetting("chkOnlineGames", setting);
                if (setting === "true") {
                    //Toast.toast("Online search enabled. Internet connection required.");
                } else {
                    Toast.toast("Offline search enabled. Not all games are available offline.");
                }
        });
        
        $('#flip-buttons').on('change', function() {
            var setting = $('#flip-buttons').val();
            //console.log("setting: " + setting);
            if (setting === "small") {
                Globals.bMini = true;
                //Toast.toast("Small buttons enabled");
            } else {
                Globals.bMini = false;
                //Toast.toast("Big buttons enabled");
            }
            app.saveSetting("flip-buttons", setting);
        });

        $('#btnNextOnline').on('click', function() {

            app.searchSubmit2();
        });

        $('#btnPrevOnline').on('click', function() {
            //console.log(app.iCurrGamesOnline);
            var rem = app.iCurrGamesOnline % 10;
            //console.log("rem: " + rem);
            app.iCurrGamesOnline -= rem;
            app.iCurrGamesOnline -= 19;
            //console.log(app.currGamesOnline);
            if (app.iCurrGamesOnline < 1) {
                app.iCurrGamesOnline = 1;
            }
            app.searchSubmit2();
        });

        $('#selTeamAdd').on('change', function() {
            var $elTxtTeamAdd = $('#txtTeamAdd');
            var $elSelTeamAdd = $('#selTeamAdd');
            var myTeam = $elSelTeamAdd.val();
            myTeam = myTeam.replace(/&#39;/g, "'");
            if (myTeam === "---" || myTeam === "Team Names" || myTeam === "None") {
                myTeam = "";
            }
            $elTxtTeamAdd.val(myTeam);
        });

        $('#selFactionAdd').on('change', function() {
            var $elTxtFactionAdd = $('#txtFactionAdd');
            var $elSelFactionAdd = $('#selFactionAdd');
            var myFaction = $elSelFactionAdd.val();
            myFaction = myFaction.replace(/&#39;/g, "'");
            if (myFaction === "---" || myFaction === "Factions" || myFaction === "None") {
                myFaction = "";
            }
            $elTxtFactionAdd.val(myFaction);
        });


        $('#selLocationAdd').on('change', function() {
            var $elTxtLocation = $('#textLocation');
            var $elSelLocationAdd = $('#selLocationAdd');
            var myLocation = $elSelLocationAdd.val();
            myLocation = myLocation.replace(/&#39;/g, "'");
            if (myLocation === "---" || myLocation === "Locations" || myLocation === "None") {
                myLocation = "";
            }
            $elTxtLocation.val(myLocation);
        });

        $('#saveCloudLogin').on('click', function() {
            var $el = $('#saveCloudLogin');
            var text = $el.text().trim();
            if (text.indexOf("Sign In") > -1) {
                var cloudUsername = $('#textCloudUsername').val();
                var cloudPassword = $('#textCloudPassword').val();
                //console.log("Login username: " + cloudUsername);
                //console.log("Login password: " + cloudPassword);
                if (cloudUsername !== "" && cloudPassword !== "") {
                    $.mobile.loading('show');
                    CloudAll.login(Globals.appId, cloudUsername, cloudPassword, function(success, myCloud) {
                        CloudAll.parseLogin(myCloud, function(success) {
                            $.mobile.loading('hide');
                            if (success === true) {
                                $el.text("Sign Out");
                                CloudAll.ready(function() {

                                });
                            }
                        });
                    });
                } else {
                    Toast.toast("Please enter your cloud username and password");
                }
            } else {
                $el.text("Sign In");
                $('#textCloudPassword').val('');
                CloudAll.clearLogin(function() {

                });
            }
        });

        $('#saveBGGLogin').on('click', function() {
            var $el = $('#saveBGGLogin');
            var text = $el.text().trim();
            //console.log("text: " + text);
            if (text.indexOf("Sign In") > -1) {
                //console.log("Test clicked");
                var username = $('#textBGGUsername').val();
                var password = $('#textBGGPassword').val();
                //console.log("Username: " + username);
                //console.log("Password: " + password)
                if (username !== "" && password !== "") {
                    $.mobile.loading('show');
                    app.bggLogin(null, username, password, function() {
                        $.mobile.loading('hide');
                        app.saveSetting("bggUsername", username);
                        app.saveSetting("bggPassword", password);
                        $el.text("Sign Out");
                        Toast.toast("Signed in! Future games will be posted automatically.");
                    });
                } else {
                    Toast.toast("Please enter your BoardGameGeek.com username and password");
                }
            } else {
                $el.text("Sign In");
                $('#textBGGPassword').val('');
                app.bggClearLogin();
            }
        });

        $('#player-results2').on('click', 'a', function() {
            //  Toast.toast("clicked" + $(this).attr("id"));
            var tweetText = "";
            var tweetDate;
            var sWon;
            var sHandle = "";
            var players = "";
            var gamePhoto = $('#imgResultsImage').attr('data-imageURI');
            //console.log("gamePhoto: " + gamePhoto);
            var today = new Date();
            var dd = today.getDate();
            var mm = today.getMonth() + 1; //January is 0!
            var yyyy = today.getFullYear();
            var q;
            var p;
            var j;
            if (dd < 10) {
                dd = '0' + dd;
            }
            if (mm < 10) {
                mm = '0' + mm;
            }
            today = yyyy + '-' + mm + '-' + dd;
            tweetDate = "#" + today;
            //console.log("Clicked");
            //console.log(app.currGameDetails.players.length);
            for (var i = 0; i < app.currGameDetails.players.length; i++) {
                p = app.currPlayerTemp[i];
                if (p.winner === false) {

                    q = app.currGameDetails.players[j];
                    if (j != i) {
                        if (players !== "") {
                            players += ", ";
                        }
                        if (q.player.twitter.length > 0) {
                            sHandle = "@" + q.twitter;
                        } else {
                            sHandle = q.name;
                        }
                        players += sHandle + " " + q.points;
                    }
                }

                if (players !== "") {
                    players = "(" + players + ") ";
                }
            }

            if (p.winner === true && sHandle === "") {
                if (p.player.twitter.length > 0) {
                    sHandle = "@" + p.player.twitter;
                } else {
                    sHandle = p.name;
                }
            }


            if (sHandle === "") {
                tweetText = "Our #" + app.currGame.id + " game was lost by " + players + " #" + tweetDate;
            } else {
                tweetText = "Our #" + app.currGame.id + " game was won by " + sHandle + " with " + p.points + " points!" + " " + players + tweetDate;
            }

            if (gamePhoto !== "" && gamePhoto !== undefined && gamePhoto !== null) {
                //console.log("GamePhoto: " + gamePhoto);
                FileIO.getFileURI(gamePhoto, function(fileURI) {
                    Social.tweet(tweetText, fileURI);    
                });  
            } else {
                Social.tweet(tweetText);
            }

        });

        $('#player-history').on('click', 'a', function() {
            //console.log("clicked");
            var sTweet=this.id;
            var photo = app.currHistoryPhoto;
            //console.log("Photo: " + photo);
            //FileIO.getFileURI(photo, function(fileURI) {
                Social.tweet(sTweet, photo);                
            //});

        });


        $('#award-list-session').on('click', 'a', function() {
            //  Toast.toast("clicked" + $(this).attr("id"));
            var myClass = $(this).attr('class');
            if (myClass.indexOf('share') >= 0) {
                var awardId = $(this).attr("id");
                var tweetDate;
                var today = new Date();
                var dd = today.getDate();
                var mm = today.getMonth() + 1; //January is 0!
                var yyyy = today.getFullYear();
                if (dd < 10) {
                    dd = '0' + dd;
                }
                if (mm < 10) {
                    mm = '0' + mm;
                }
                today = yyyy + '-' + mm + '-' + dd;
                tweetDate = today;
    
                var tweetText = awardId; //+ " #" + tweetDate;
                //if (app.myTwitterPhoto === "" || app.myTwitterPhoto === null || app.myTwitterPhoto === undefined) {
                    Social.tweet(tweetText);
                // } else {
                    // Social.tweet(tweetText, app.myTwitterPhoto);
                // }
            }
        });

       // $('#award-list-history').on('click', 'a', function() {
            //console.log("clicked" + $(this).attr("id"));
            // var myClass = $(this).attr('class');
            // if (myClass.indexOf('share') >= 0) {
                // var awardId = $(this).attr("id");
                // var tweetDate;
                // var today = new Date();
                // var dd = today.getDate();
                // var mm = today.getMonth() + 1; //January is 0!
                // var yyyy = today.getFullYear();
                // if (dd < 10) {
                    // dd = '0' + dd;
                // }
                // if (mm < 10) {
                    // mm = '0' + mm;
                // }
                // today = yyyy + '-' + mm + '-' + dd;
                // tweetDate = today;
                // for (var i = 0; i < app.currAwards.length; i++) {
                    // if (app.currAwards[i].earnedId == awardId) {
                        // var tweetText = app.currAwards[i].descTweet + " #" + tweetDate;
                        // Social.tweet(tweetText);
                        // break;
                    // }
                // }
            // }
        // });

        $('#award-list').on('click', 'a', function() {
            //  Toast.toast("clicked" + $(this).attr("id"));
            var myClass = $(this).attr('class');
            if (myClass.indexOf('share') >= 0) {
                var awardId = $(this).attr("id");
                var tweetDate;
                var today = new Date();
                var dd = today.getDate();
                var mm = today.getMonth() + 1; //January is 0!
                var yyyy = today.getFullYear();
                if (dd < 10) {
                    dd = '0' + dd;
                }
                if (mm < 10) {
                    mm = '0' + mm;
                }
                today = yyyy + '-' + mm + '-' + dd;
                tweetDate = today;
                //console.log("currAwardDisplay.length: " + currAwardDisplay.length);
                for (var i = 0; i < app.currAwardDisplay.length; i++) {
                    if (app.currAwardDisplay[i].earnedId == awardId) {
                        var tweetText = app.currAwardDisplay[i].descTweet + " #" + tweetDate;
                        Social.tweet(tweetText);
                        break;
                    }
                }
            }
        });

        $("#buttonChangeGamePicture").on("click", function() {
            var $popupMenu = $('#cameraPopupMenu');
            if (Device.platform === "FirefoxOS") {
                $popupMenu.popup("close");
                app.gamePhotoFromCamera(1);
            }
        });

        $("#buttonChangeGamePicture2").on("click", function() {
            var $el = $('#imgGameImage');
            app.currGameIcon++;
            if (app.currGameIcon > 7) {
                app.currGameIcon = 1;
            }
            $el.attr('src', "img/games/Game" + app.currGameIcon + ".png").load();
            $el.nailthumb({
                width: 80,
                height: 80
            });
        });

        $("#buttonChangeGamePicture3").on("click", function() {
            var $el = $('#imgGameImage');
            app.currGameIcon--;
            if (app.currGameIcon < 1) {
                app.currGameIcon = 7;
            }
            $el.attr('src', "img/games/Game" + app.currGameIcon + ".png").load();
            $el.nailthumb({
                width: 80,
                height: 80
            });
        });

        $("#buttonChangePlayerPicture").on("click", function() {

            var $popupMenu = $('#cameraPlayerPopupMenu');
            if (Device.platform === "FirefoxOS") {
                $popupMenu.popup("close");
                app.playerPhotoFromCamera(1);
            }
        });

        $("#selPlayerColor").on("change", function() {
            var $el = $('#selPlayerColor');
            var $img = $('#imgPlayerColor');
            //console.log($el.val());
            $img.attr('src', "img/colors/" + $el.val() + "0032.png");
        });

        $("#selPlayerColor2").on("change", function() {
            var $el = $('#selPlayerColor2');
            var $img = $('#imgPlayerColor2');
            //console.log($el.val());
            $img.attr('src', "img/colors/" + $el.val() + "0032.png");
        });

        $("#buttonChangePlayerPicture2").on("click", function() {
            var $el = $('#imgPlayerImage');
            app.currPlayerIcon++;
            if (app.currPlayerIcon > 28) {
                app.currPlayerIcon = 1;
            }
            $el.attr('src', "img/players/Player" + app.currPlayerIcon + ".png").load();
            //$el.nailthumb({width:100,height:100});
        });

        $("#buttonChangePlayerPicture3").on("click", function() {
            var $el = $('#imgPlayerImage');
            app.currPlayerIcon--;
            if (app.currPlayerIcon < 1) {
                app.currPlayerIcon = 28;
            }
            $el.attr('src', "img/players/Player" + app.currPlayerIcon + ".png").load();
            $el.nailthumb({
                width: 80,
                height: 80
            });
        });

        $("#buttonAttachPhoto").on("click", function() {

            var $popupMenu = $('#cameraSessionPopupMenu');
            if (Device.platform === "FirefoxOS") {
                $popupMenu.popup("close");
                app.sessionPhotoFromCamera(1);
            }
        });

        //add new game
        $("#saveNewGame").on("click", function() {
            //do some stuff
            var gameShare = false;
            var $elGameShare = $('#gameShare');
            if ($elGameShare.is(":checked")) {
                gameShare = true;
            } else {
                gameShare = false;
            }

            app.saveEditGame(true, function(g) {
                if (g) {
                    //console.log("Adding data");
                    app.addGameData(g.id, g.name, g.icon, true, g.scoreType, g.advancedText, g.bggId, "1", 1, app.gamePhotoChanged, function(myGame) {
                        //console.log(myGame);
                        if (gameShare === true) {
                            app.getGameExport(true, function(myExport) {
                                app.sendGameExport(myExport);
                            });
                        }
                        app.lastGameAdd = getTimestamp();
                        //console.log("setting app.lastGameAdd: " + app.lastGameAdd);
                        
                        var l = app.currGames.length;
                        for (var i = 0; i < l; i++) {
                            //console.log(app.currGames[i].id + " " + game_id);
                            if (app.currGames[i].id == g.id) {
                                //console.log("Splice game id");
                                app.currGames.splice(i, 1);
                                break;
                            }
                        }


                        app.currGames.push(myGame);
                        app.currGames.sort(dynamicSort("name"));
                        //app.writeGamesToPage("games", function () {
                        app.currEditGame = null;
                        if (app.gameFromSettings === true) {
                            changePage("#editgames");
                        } else {
                            changePage("#games");
                        }


                        //});
                    });
                }
            });



        });

        $('#addGameCustom').on('click', function() {
            app.gameFromSettings = false;
            app.currEditGame = null;
        });

        //load all players
        $('#players').on("pagebeforeshow", function() {
            app.getSetting("flip-buttons", Globals.bMiniDefault, function(setting) {
               if (setting === "big") {
                    Globals.bMini = false;               
               } else {
                   Globals.bMini = true;
               }
               //console.log("bMini: " + Globals.bMini); 
            });
            app.playerEditMode = false;
            app.playerEditAdd = false;
            app.gameEditMode = false;
            app.gameImportMode = false;
            app.playerFromSettings = false;
            if (app.lastPlayerAdd > app.lastPlayerLoad) {
                app.findPlayersByName("", false, true, function(players) {
                    app.currPlayers = players;
                    app.writePlayersToPage("players");
                });
            } else {
                app.writePlayersToPage("players");         
            }

            if (CloudAll.isReady === true) {
                //console.log("cloud ready so starting");
                CloudAll.start(true, true);
            } else {
                CloudAll.ready(function(success) {
                    
                });
            }
        });



        //add new player
        $("#saveNewPlayer").on("click", function() {
            //do some stuff
            var $elPlayerHidden = $('#playerHidden');
            var player_name = $("#textNewPlayerName").val();
            var player_id = $("#textNewPlayerId").val();
            var player_bggusername = $('#textBGGUsername2').val();
            var player_hidden = 0;
            var player_twitter = $('#textNewPlayerTwitter').val();
            var src;
            //console.log("player color: " + player_color);
            if ($elPlayerHidden.is(":checked")) {
                player_hidden = true;
            } else {
                player_hidden = false;
            }
            //console.log("HIdden: " + $elPlayerHidden.is(":checked"));
            player_id = player_id.sanitize();
            player_twitter = player_twitter.sanitize();
            var player_icon = $("#imgPlayerImage").attr("src");
            if (player_name !== "" && player_icon !== "" && player_id !== "") {
                //console.log("Player_hidden: " + player_hidden);

                app.addPlayerData(player_id, player_name, player_icon, player_bggusername, player_twitter, player_hidden, app.playerPhotoChanged, function(myPlayer) {
                    //console.log("app.playerEditAdd: " + app.playerEditAdd);
                    if (app.playerEditMode === false && app.playerEditAdd === false && player_hidden === false) {
                        app.currPlayers.push(myPlayer);
                        app.currPlayers.sort(dynamicSort("name"));
                        changePage("#players");

                    } else {
                        changePage("#editplayers");
                    }
                });
            } else {
                Toast.toast("Please enter a Name and ID");
            }
        });


        $("#edit").on("pagebeforeshow", function() {
            app.playerFromSettings = true;
            app.gameFromSettings = true;
        });

        $("#playerorder").on("pagebeforeshow", function() {
            //console.log("playerorder beforeshow");
            app.clearPage("playerorder");
            app.loadedWidgets = false;
            app.currFactions = [];
            var $elPickRounds = $('#spinPickRounds');
            $elPickRounds.val(app.currGameDetails.rounds);
            if (app.currGameDetails.pickRounds === true) {
                $('#gameOptionsPickRounds').show();
            } else {
                $('#gameOptionsPickRounds').val('1');
            }
            if (app.currGameDetails.useTeams === true) {
                $('#gameOptionsTeamScoring').show();
            } else {
                $('#gameOptionsTeamScoring').hide();
            }
            app.currGameDetails.tallyHistory=[];
            app.writePlayersToPage("playerOrder");
        });

        //set app.currGameIcon on game listview click
        $('.game-icon-list').on('click', 'li', function() {
            var src;
            app.currGameIcon = $(this).attr("id");
            //console.log("app.currGameIcon: " + app.currGameIcon);
            src = "img/games/Game" + app.currGameIcon + ".png";
            app.currEditGame.icon = src;
            app.currEditGame.iconURL = "";
            $.mobile.back();
        });

        $('.bgg-id-list').on('click', 'li', function() {
            //console.log(this);
            //var $elName = $('#textNewGameName');
            //var $elId = $('#textBGGID');
            var id = $(this).attr("id");
            var name = $(this).attr("name");
            name = name.replace(/&#39;/g, "'");
            app.currEditGame.name = name;
            app.currEditGame.bggId = id;
            //$elName.val(name);
            //$elId.val(id);
            app.getBGGImage(id, function(url) {
                //console.log("URL: " + url);
                app.currEditGame.icon = url;
                app.currEditGame.iconURL = url;
                $.mobile.back();
            });
        });

        $('.bgg-id-list2').on('click', 'li', function() {
            //console.log(this);
            //var $elName = $('#textNewGameName');
            //var $elId = $('#textBGGID');
            var id = $(this).attr("id");
            var name = $(this).attr("name");

            app.getBGGImage(id, function(url) {
                app.currEditGame = new Game("", id, name, url, "points", "", "1");
                app.currEditGame.iconURL = url;
                //$('#promptBGGID2').dialog( "close" );
                $('#addGameBackButton').attr('href', "#gamesDatabase");
                changePage('#addgame');
            });
        });

        $('.player-sort').on('click', 'a', function() {
            var myClass = $(this).attr('class');
            //console.log("myClass: " + myClass);
            //console.log(myClass.indexOf("app.playerEdit"));
            if (myClass.indexOf("app.playerEdit") > -1) {

                var i;
                var l;
                var $el = $(".player-sort li");
                var $elRounds = $('#spinPickRounds');
                var $elTeamScoring = $('#selectTeamScoring :selected');
                app.currEditPlayerId = $(this).attr("id");
                app.currEditPlayer = null;
                l = app.currGameDetails.players.length;
                for (i = 0; i < l; i++) {
                    if (app.currGameDetails.players[i].player.id === app.currEditPlayerId) {
                        app.currEditPlayer = app.currGameDetails.players[i];
                        break;
                    }
                }


                app.selectedPlayerIds = [];
                app.widgetDisplay = $("#selectWidgetDisplay :selected").val();
                app.saveSetting("app.widgetDisplay", app.widgetDisplay);
                app.currGameDetails.rounds = $elRounds.val();
                app.currGameDetails.teamType = $elTeamScoring.val();

                var count = $el.length;
                for (i = 0; i < count; i++) {
                    //console.log("Sort Player: " + $el[i].id);
                    app.selectedPlayerIds.push($el[i].id);
                }

                app.sortPlayersTemp(function(results) {
                    app.currGameDetails.players = results;
                });

                //console.log(app.currEditPlayer);
                if (app.currEditPlayer !== null) {
                    app.findAllTeams(function(teams) {
                        app.currTeams = teams;
                        var gameId = app.currGameDetails.game.id;
                        app.findFactionsByGameId(gameId, function(factions) {
                            //console.log("FACTIONS");
                            //console.log(factions);
                            app.currFactions = factions;
                            app.loadAllTeams(teams, function() {
                                //console.log("TEAMS");
                                //console.log(teams);
                                app.loadAllFactions(app.currFactions, function() {
                                    app.prepTeamPage(function() {});
                                });
                            });
                        });
                    });
                }
            }

        });

        //set playerIcon on player listview click
        $('.player-icon-list').on('click', 'li', function() {

            app.playerChoosePic = true;
            app.currPlayerIcon = $(this).attr("id");
            app.currPlayerIcon = app.currPlayerIcon.replace("playerIcon", "");
            app.choosePlayerPicSource = "img/players/Player" + app.currPlayerIcon + ".png";
            //console.log("Clicked " + app.currPlayerIcon);
            $.mobile.back();
        });

        //set app.currGame on game listview click
        $('#game-list').on('click', 'a', function(e) {
            e.stopImmediatePropagation();
            var myClass = $(this).attr("class");
            var myId = $(this).attr("id");
            var i = 0;
            //console.log("myClass: " + myClass);
            //console.log("myId: " + myId);
            var myType = "";
            if (myClass.indexOf('gameLink') >= 0) {
                myType = "Game";
            } else if (myClass.indexOf('gameSearch') >= 0) {
                myType = "Search";
            } else if (myClass.indexOf('noneFound') >= 0) {
                myType = "NoneFound";
            } else {
                myType = "Favorite";
            }
            //console.log(myType);

            if (myType === "Game") {
                $('#imgResultsContainer').empty();
                $('#textareaNotes').val('');
                app.lastPhoto = '';
                app.lastNotes = '';
                for (i = 0; i < app.currGames.length; i++) {
                    //console.log(app.currGames[i].id + " " + myId);
                    if ("gameLink" + app.currGames[i].id == myId) {
                        //console.log("item " + i);
                        app.currGame = app.currGames[i];
                        app.currFactions = [];
                        //console.log(app.currGame);
                        app.generateScoreDetails(app.currGame, function(newGameDetails) {
                            //console.log("callback");
                            app.currGameDetails = newGameDetails;
                            app.loadedWidgets = false;
                            //console.log("Current game: " + app.currGame.name);
                            changePage("#players");
                        });
                        break;
                    }
                }
            }

            if (myType === "Search") {
                //prefill online game search
                var $el = $('#search-key');
                app.lastSearchTerm = $el.val();
                app.wroteGames = false;
                app.searchedOnce2 = false;
                app.iCurrGamesOnline = 1;
                //console.log("Searching for " + app.lastSearchTerm);
                changePage('#gamesDatabase');
            }

            if (myType === "Favorite") {
                //console.log("Favorite");
                $(this).toggleClass("ui-btn-pressed");
                for (i = 0; i < app.currGames.length; i++) {
                    if ("favStar" + app.currGames[i].id == myId) {
                        //console.log("Found clicked " + app.currGames[i].id);
                        //console.log("fav: " + app.currGames[i].favorite);
                        if (app.currGames[i].favorite === true) {
                            app.currGames[i].favorite = false;
                            app.addGame(app.currGames[i], function() {
                                //console.log("Unfavorited");
                                Toast.toast("Unfavorited " + app.currGames[i].name);
                            });
                        } else {
                            app.currGames[i].favorite = true;
                            app.addGame(app.currGames[i], function() {
                                //console.log("Favorited");
                                Toast.toast("Favorited " + app.currGames[i].name);
                            });
                        }
                        break;
                    }
                }
            }
            
            if (myType === "NoneFound") {
                changePage('#popupAddGame', {
                    transition: 'pop',
                    role: 'dialog'
                });
            }
            
            return false;
        });

        $('#player-results-2').on('click', 'a', function() {
            var myClass = $(this).attr('class');
            if (myClass.indexOf('share') >= 0) {
                var sTweet = getSessionDesc(app.currGameDetails.game.id, app.currGameDetails.players, app.currGameDetails.playDate);
                //console.log("Photo: " + app.currGameDetails.photo);
                FileIO.getFileURI(app.currGameDetails.photo, function(fileURI) {
                    Social.tweet(sTweet, fileURI);    
                });            
            }
        });


        $('#award-list-history').on('click', 'a', function() {
            var myClass = $(this).attr('class');
            if (myClass.indexOf('share') >= 0) {
                var sTweet = $(this).attr("id");
                Social.tweet(sTweet, null);
            }
        });

        //set app.currGame on game listview click
        $('.paused-game-list').on('click', 'li', function() {
            //console.log("game clicked");
            var j;
            var p;
            var myPlayer;
            for (var i = 0; i < app.currGamesPaused.length; i++) {
                //console.log("id: " + app.currGames[i].id);

                if (app.currGamesPaused[i].id == $(this).attr("id")) {
                    var g = app.currGamesPaused[i];
                    app.playStart = getTimestamp();
                    app.playStart = app.playStart - app.currGamesPaused[i].playDuration;
                    app.lastPhoto = app.currGamesPaused[i].photo;
                    app.lastNotes = app.currGamesPaused[i].notes;
                    //console.log("app.playStart:" + app.playStart);
                    app.currGame = g.game;
                    //app.generateScoreDetails(app.currGame, function(newGameDetails) {
                    app.currGameDetails = new GameDetails(g.game);
                    app.currGameDetails.id = g.id;
                    for (j = 0; j < g.players.length; j++) {
                        p = g.players[j];
                        myPlayer = new PlayerTemp(p.player);
                        myPlayer.points = p.points;
                        myPlayer.winner = p.winner;
                        myPlayer.scoreId = p.scoreId;
                        myPlayer.scoreLogName = p.scoreLogName;
                        myPlayer.scoreLogCombo = p.scoreLogCombo;
                        myPlayer.scoreLogMath = p.scoreLogMath;
                        myPlayer.scoreLogAdd = p.scoreLogAdd;
                        myPlayer.scoreLogPoints = p.scoreLogPoints;
                        myPlayer.color = p.color;
                        myPlayer.position = p.position;
                        myPlayer.team = p.team;
                        myPlayer.faction = p.faction;
                        app.currGameDetails.players.push(myPlayer);
                    }
                    app.currGameDetails.players.sort(dynamicSort("position"));
                    for (j = 0; j < g.teams.length; j++) {
                        p = g.teams[j];
                        myPlayer = new PlayerTemp(p.player);
                        myPlayer.points = p.points;
                        myPlayer.winner = p.winner;
                        myPlayer.scoreId = p.scoreId;
                        myPlayer.scoreLogName = p.scoreLogName;
                        myPlayer.scoreLogCombo = p.scoreLogCombo;
                        myPlayer.scoreLogMath = p.scoreLogMath;
                        myPlayer.scoreLogAdd = p.scoreLogAdd;
                        myPlayer.scoreLogPoints = p.scoreLogPoints;
                        myPlayer.color = p.color;
                        myPlayer.position = p.position;
                        myPlayer.team = p.team;
                        myPlayer.faction = p.faction;
                        app.currGameDetails.teams.push(myPlayer);
                    }
                    app.currGameDetails.tallyHistory = g.tallyHistory;
                    app.currGameDetails.scoreItems = g.scoreItems;
                    app.currGameDetails.winners = g.winners;
                    app.currGameDetails.winningTeams = g.winningTeams;
                    app.currGameDetails.savedItems = g.savedItems;
                    app.currGameDetails.useTeams = g.useTeams;
                    app.currGameDetails.teamType = g.teamType;
                    app.currGameDetails.pickRounds = g.pickRounds;
                    app.currGameDetails.rounds = g.rounds;
                    app.currGameDetails.lowPointsWin = g.lowPointsWin;
                    app.currGameDetails.coop = g.coop;
                    app.currGameDetails.paused = true;
                    app.loadedWidgets = false;
                    //console.log("Current game: " + app.currGame.name);
                    //console.log("app.lastGamePausedAdd before: " + app.lastGamePausedAdd);
                    app.deletePausedGameById(g.id, function() {
                        //console.log("app.lastGamePausedAdd after: " + app.lastGamePausedAdd);
                        changePage("#play");
                    });
                    break;
                }

            }
        });

        $('#onlinegame-list').on('click', 'li', function() {
            //console.log("online game clicked");
            //console.log($(this).attr("id"));
            //var $elFlip = $('#flip-online');
            var id = $(this).attr("id");
            //console.log("id: " + id);
            app.getSetting("chkOnlineGames", 'true', function(setting) {
                
                for (var i = 0; i < app.currGamesOnline.length; i++) {
                    //console.log("id: " + app.currGamesOnline[i].id);
                    //console.log($(this).attr("id"));
                    //console.log("if " + app.currGamesOnline[i].id + " == " + id);
                    if (app.currGamesOnline[i].id == id) {
                        app.currGameOnline = app.currGamesOnline[i];
    
                        //console.log("Current online game: "  + app.currGameOnline.name);
                        //console.log("id: " + app.currGameOnline.id);
                        //console.log("setting:" + setting);
                        if (setting == "true") {
                            //console.log("1");
                            app.findPluginOnline(app.currGameOnline.id);
                        } else {
                            //console.log("2");
                            app.findPluginOnline2(app.currGamesOnline[i]);
                        }
                        break;
                    }
    
                } 
            });
        });
        
        $('#popupAddGame').on('click', function() {
           //console.log("Popup Add Game");
           Popup.addGameDialog(); 
        });
        
        $('#popupCameraSession').on('click', function() {
           //console.log("Popup Camera Session");
           Popup.cameraDialogSession(); 
        });
        
        $('#popupCameraPlayer').on('click', function() {
           //console.log("Popup Camera Player");
           Popup.cameraDialogPlayer(); 
        });
        
        $('#popupCameraGame').on('click', function() {
           //console.log("Popup Camera Game");
           Popup.cameraDialogGame(); 
        });
        
        $('#popupSocial').on('click', function() {
           //console.log("Popup Social");
           Popup.socialDialog(); 
        });
        
        $('#popupTools1').on('click', function() {
           //console.log("Popup Tools1");
           Popup.toolsDialog1(); 
        });
        
        $('#popupTools2').on('click', function() {
           //console.log("Popup Tools2");
           Popup.toolsDialog2(); 
        });

        // $('#social-list').on('click', 'li', function() {
            // //console.log("social clicked: " + $(this).attr("id"));
// 
            // var url;
            // var $popupMenu = $('#popupMenu');
            // switch ($(this).attr('id')) {
                // case 'socialRate':
                    // app.askForReview(true);
                    // $popupMenu.popup("close");
                    // break;
                // case 'socialFeedback':
                    // app.launchFeedback();
                    // $popupMenu.popup("close");
                    // break;
                // case 'socialTweet':
                    // Social.tweet("If you like #boardgames check out #ScoreGeek, the app I've been using to track scores and statistics: http://bit.ly/13aXBHV");
                    // break;
                // case 'socialFollow':
                    // Social.follow();
                    // break;
                // case 'socialLike':
                    // Social.launchLike();
                    // break;
                // case 'socialFriend':
                    // Social.friend();
                    // break;
                // case 'socialHomepage':
                    // url = Globals.socialHomepageURL;
                    // Social.launchURL(url);
                    // break;
                // case 'socialSupport':
                    // url = Globals.socialSupportURL;
                    // Social.launchURL(url);
                    // break;
            // }
// 
        // });
        
        // $('#tools-list').on('click', 'li', function() {
            // //console.log("click");
            // var $popupMenu = $('#toolsPopupMenu');
            // $popupMenu.popup('close');
            // switch ($(this).attr('id')) {
                // case 'toolsBuzzer':
                    // app.toolDialogBuzzer();
                    // break;
                // case 'toolsCountdown':
                    // app.toolDialogCountdown();
                    // break;
                // case 'toolsNotes':
                    // app.toolDialogNotes();
                    // break;
                // case 'toolsPhoto':
                    // app.toolsPhotoFromCamera(1);
                    // break;
                // case 'toolsTimer':
                    // app.toolDialogTimer();
                    // break;
            // }
        // });
//         
        // $('#tools-list2').on('click', 'li', function() {
            // //console.log("click");
            // var $popupMenu = $('#toolsPopupMenu2');
            // $popupMenu.popup('close');
            // switch ($(this).attr('id')) {
                // case 'toolsBuzzer2':
                    // app.toolDialogBuzzer();
                    // break;
                // case 'toolsCountdown2':
                    // app.toolDialogCountdown();
                    // break;
                // case 'toolsNotes2':
                    // app.toolDialogNotes();
                    // break;
                // case 'toolsPhoto2':
                    // app.toolsPhotoFromCamera(1);
                    // break;
                // case 'toolsTimer2':
                    // app.toolDialogTimer();
                    // break;
            // }
        // });

        // $('#camera-list').on('click', 'li', function() {
            // //console.log("social clicked: " + $(this).attr("id"));
// 
// 
            // var $popupMenu = $('#cameraPopupMenu');
            // switch ($(this).attr('id')) {
                // case 'cameraNewGame':
                    // app.gamePhotoFromCamera(1);
                    // $popupMenu.popup("close");
                    // break;
                // case 'cameraExistingGame':
                    // app.gamePhotoFromCamera(0);
                    // $popupMenu.popup("close");
                    // break;
            // }
// 
        // });

        $('#camera-player-list').on('click', 'li', function() {
            //console.log("social clicked: " + $(this).attr("id"));


            var $popupMenu = $('#cameraPlayerPopupMenu');
            switch ($(this).attr('id')) {
                case 'cameraNewPlayer':
                    app.playerPhotoFromCamera(1);
                    $popupMenu.popup("close");
                    break;
                case 'cameraExistingPlayer':
                    app.playerPhotoFromCamera(0);
                    $popupMenu.popup("close");
                    break;
            }

        });

        $('#camera-session-list').on('click', 'li', function() {
            //console.log("social clicked: " + $(this).attr("id"));


            var $popupMenu = $('#cameraSessionPopupMenu');
            switch ($(this).attr('id')) {
                case 'cameraNewSession':
                    app.sessionPhotoFromCamera(1);
                    $popupMenu.popup("close");
                    break;
                case 'cameraExistingSession':
                    app.sessionPhotoFromCamera(0);
                    $popupMenu.popup("close");
                    break;
            }

        });


        //set app.currHistory on history click
        $('#history-list').on('click', 'li', function() {
            //console.log("history clicked: " + $(this).attr("id"));
            var id = $(this).attr("id");
            var hist;
            var l = app.currHistoryDisplay.length;
            //console.log("len: " + l);
            for (var i = 0; i < l; i++) {
                hist = app.currHistoryDisplay[i];
                //console.log("compare " + hist.session.sessionId + " " + id);
                if (hist.session.sessionId == id) {
                    //console.log("found match");
                    app.currHist = hist;
                    var $el = $('#btnBackFromHistoryDetails');
                    $el.attr("href", "#history");
                    changePage('#history-details');

                }
            }
        });

        //set app.currHistory on history click
        $('#award-list').on('click', 'li', function() {
            //console.log("award clicked: " + $(this).attr("id"));
            var id = $(this).attr("id");
            var hist;
            var i = 0;
            var $el;
            var l = app.currHistoryDisplay.length;
            var bFound = false;
            //console.log("len: " + l);
            if (l === 0) {

                app.currHistoryDisplay = app.currHistory;
                l = app.currHistoryDisplay.length;
                //console.log("History length: " + l);
                for (i = 0; i < l; i++) {
                    hist = app.currHistoryDisplay[i];
                    //console.log("compare " + hist.session.sessionId + " " + id);
                    if (hist.session.sessionId == id) {
                        //console.log("found match 1");
                        bFound = true;
                        app.currHist = hist;
                        //app.writeHistoryDetailsToPage(hist, function() {
                            $el = $('#btnBackFromHistoryDetails');
                            $el.attr("href", "#achievements");
                            changePage('#history-details');
                        //});
                        break;
                    }
                }

            } else {
                //console.log("Else");
                for (i = 0; i < l; i++) {
                    hist = app.currHistoryDisplay[i];
                    //console.log("compare " + hist.session.sessionId + " " + id);
                    if (hist.session.sessionId == id) {
                        bFound = true;
                        //console.log("found match 2");
                        app.currHist = hist;
                        //app.writeHistoryDetailsToPage(hist, function() {
                            $el = $('#btnBackFromHistoryDetails');
                            $el.attr("href", "#achievements");
                            changePage('#history-details');
                        //});
                        break;
                    }
                }
            }

            if (bFound === false) {
                //reload history
                app.findAllHistory(function() {
                    app.currHistoryDisplay = app.currHistory;
                    l = app.currHistoryDisplay.length;
                    for (var i = 0; i < l; i++) {
                        hist = app.currHistoryDisplay[i];
                        //console.log("compare " + hist.session.sessionId + " " + id);
                        if (hist.session.sessionId == id) {
                            //console.log("found match");
                            bFound = true;
                            app.currHist = hist;
                            app.writeHistoryDetailsToPage(hist, function() {
                                var $el = $('#btnBackFromHistoryDetails');
                                $el.attr("href", "#achievements");
                                changePage('#history-details');
                            });
                        }
                    }

                });
            }

        });

        //set edit player id
        $('#edit-player-list').on('click', 'li', function() {
            //console.log("edit player clicked2: " + $(this).attr("id"));
            app.currEditPlayerId = $(this).attr("id");
            app.playerEditMode = true;
            changePage("#addplayer");
        });

        //set edit game id
        $('#edit-game-list').on('click', 'li', function() {
            //console.log("edit game clicked2: " + $(this).attr("id"));

            //console.log("game clicked");
            for (var i = 0; i < app.currGames.length; i++) {

                //console.log("id: " + app.currGames[i].id + app.currGames[i].custom);
                var s = $(this).attr("id");
                //console.log(s);
                if (app.currGames[i].id == $(this).attr("id")) {
                    app.currGame = app.currGames[i];

                    //console.log("Current game: " + app.currGame.name);
                    //console.log(app.currGame);
                    //app.loadScorecardsByGameId(app.currGame.id, function () {
                    app.currEditGameId = $(this).attr("id");
                    app.currEditGame = app.currGame;
                    app.gameEditMode = true;
                    app.gameImportMode = false;
                    app.gameFromSettings = true;
                    //console.log("addgame");
                    changePage("#addgame");
                    //});
                }

            }
        });

        //set delete player id
        $('#delete-player-list').on('click', 'li', function() {
            //console.log("delete player clicked2: " + $(this).attr("id"));
            app.currDeletePlayerId = $(this).attr("id");
            app.currDeletePlayerName = $(this).text();
        });

        $('#deletePlayerById').on('click', function() {
            //console.log("confirmed id" + app.currDeletePlayerId);
            app.deletePlayerById(app.currDeletePlayerId, function() {
                app.findPlayersByName("", false, true, function(players) {
                    //console.log(players);
                    app.currPlayers = players;
                    app.writePlayersToPage("delete", function() {
                        changePage("#deleteplayer");
                    });


                });
            });
        });

        $('#deleteGameById').on('click', function() {
            //console.log("confirmed id: " + app.currDeleteGameId);
            app.deleteGameById(app.currDeleteGameId);
            app.currGames = [];
            changePage("#deletegame");
        });

        $('#deleteHistoryById').on('click', function() {
            //console.log("confirmed: " + app.currDeleteHistoryId);
            app.deleteHistoryById(app.currDeleteHistoryId, function() {
                for (var i = 0; i < app.currHistoryDisplay.length; i++) {
                    if (app.currHistoryDisplay[i].sessionId == app.currDeleteHistoryId) {
                        //console.log(app.currHistoryDisplay[i]);
                        var fileURI = app.currHistoryDisplay[i].sessionPhoto;
                        app.deleteSessionPhoto(fileURI, function() {
                            
                        });
                        
                        app.currHistoryDisplay.splice(i, 1);
                        Toast.toast("Deleted History Item");
                        break;
                        
                    }
                }
                changePage("#delete");
            });
        });

        //set delete game id
        $('#delete-game-list').on('click', 'li', function() {
            //console.log("delete game clicked2: " + $(this).attr("id"));
            app.currDeleteGameId = $(this).attr("id");
            app.currDeleteGameName = $(this).text();
        });

        //set delete history id
        $('#delete-history-list').on('click', 'li', function() {
            //console.log("delete history clicked2: " + $(this).attr("id"));
            app.currDeleteHistoryId = $(this).attr("id");
            app.currDeleteHistoryName = "Session " + $(this).attr("id");
            //console.log(app.currDeleteHistoryId);
        });

        $('#delete').on('pagebeforeshow', function() {
            var l = app.currHistory.length;
            if (l <= 0) {
                app.findAllHistory(function() {

                });
            }
        });

        $('#stats').on('pagebeforeshow', function() {
            //console.log("app.gamesDisplay:");
            //console.log(app.gamesDisplay);
            //console.log("app.numPlayersDisplay");
            //console.log(app.numPlayersDisplay);
            if (app.gamesDisplay.length === 0) {
                var myGameDisplay = new GameDisplay("All", "");
                app.gamesDisplay.push(myGameDisplay);
            }
            
            if (app.numPlayersDisplay.length === 0) {
                var myNumPlayersDisplay = new NumPlayersDisplay("All", "");
                app.numPlayersDisplay.push(myNumPlayersDisplay);
            }
            
            var $el = $('#statsChooseGame');
            var $elHeader = $('#clickToShare');
            var i;
            $elHeader.hide();
            var l = app.gamesDisplay.length;
            var s;
            $el.empty();
            for (i = 0; i < l; i++) {
                s += '<option value="' + app.gamesDisplay[i].gameId + '">' + app.gamesDisplay[i].gameName + '</option>';
            }
            $el.append(s);
            $el.trigger('change');

            s = "";
            l = app.numPlayersDisplay.length;
            //console.log(app.numPlayersDisplay);
            $el = $('#statsChooseNumPlayers');
            $el.empty();
            for (i = 0; i < l; i++) {
                s += '<option value="' + app.numPlayersDisplay[i].id + '">' + app.numPlayersDisplay[i].number + '</option>';
            }
            $el.append(s);
            $el.trigger('change');

        });



        $('#promptTeam').on('pagebeforeshow', function() {
            //console.log("CurrFactions: ");
            //console.log(app.currFactions);
            var optionList = "";
            var $elSelTeamAdd = $('#selTeamAdd');
            var $el2 = $('#selPlayerColor2');
            var $elSelFactionAdd = $('#selFactionAdd');
            var team = "";
            var faction = "";
            //console.log("color: " + app.currEditPlayer.color);
            $el2.val(app.currEditPlayer.color);
            //$el2.text(app.currEditPlayer.color);
            var i = 0;
            for (i = 0; i < app.currTeams.length; i++) {
                team = app.currTeams[i];
                team = team.replace(/'/g, "&#39;");
                optionList += "<option value='" + team + "'>" + app.currTeams[i] + "</option>";
            }
            $elSelTeamAdd.html(optionList).selectmenu('refresh', true);
            optionList = "";
            for (i = 0; i < app.currFactions.length; i++) {
                faction = app.currFactions[i];
                faction = faction.replace(/'/g, "&#39;");
                optionList += "<option value='" + faction + "'>" + app.currFactions[i] + "</option>";
            }
            $elSelFactionAdd.html(optionList).selectmenu('refresh', true);
            $el2.selectmenu('refresh', true);

        });
        //display entire history

        $("#editplayers").on("pagebeforeshow", function() {
            app.findPlayersByName("", false, true, function(players) {
                app.currPlayers = players;
                app.writePlayersToPage("edit");

            });

        });

        $("#editgames").on("pagebeforeshow", function() {
            app.currEditGame = null;
            app.pickRoundsWasOn = false;
            app.pickScoreWasOn = false;
            app.findGamesByName("", false, function() {
                app.writeGamesToPage("edit");
                app.currEditGame = null;
            });
        });

        $("#deleteplayer").on("pagebeforeshow", function() {
            app.findPlayersByName("", false, true, function(players) {
                app.currPlayers = players;
                app.writePlayersToPage("delete");


            });
        });


        $("#deletegame").on("pagebeforeshow", function() {
            app.findGamesByName("", false, function() {
                app.bGameSearch = false;
                app.writeGamesToPage("delete");
            });

        });

        $("#deletehist").on("pagebeforeshow", function() {


        });

        $("#editplayer").on("pagebeforeshow", function() {
            //write player id, player name, player icon to edit page
        });

        $("#editgame").on("pagebeforeshow", function() {
            //write game id, game name, game scoretype, game_advanced, game_rounds to edit page

        });

        $("#deleteplayer").on("pagebeforeshow", function() {
            //write player name to prompt
        });

        $("#deletegame").on("pagebeforeshow", function() {
            //write game name to prompt
        });

        $("#deletehistitem").on("pagebeforeshow", function() {
            //are you sure prompt
        });

        //display entire history

        $('#credits').on("pagebeforeshow", function() {
            var $el = $('#creditsTitle');
            $el.html("ScoreGeek v" + Globals.appVersion);
        });

        $("#history-details").on("pagebeforeshow", function() {
            
            app.writeHistoryDetailsToPage(app.currHist, function() {
                var $elPlayerHistory = $('#player-history');
                var $elAwardListHistory = $('#award-list-history');
                $elPlayerHistory.listview("refresh");
                $elAwardListHistory.listview("refresh");
            });
            
        });

        $('#play').on('pagebeforeshow', function() {
            $("#tallyScoresHeader2").html(app.currGame.name);
        });

        $('#play').on('pageshow', function() {
            app.backButtonLocked = true;
            app.menuButtonLocked = true;
            app.writePausedValues(function() {

                    });
        });
        
        $('#playerorder').on('pageshow', function() {
            app.backButtonLocked = false;
            app.menuButtonLocked = false;
        });

        //build score heirarchy for selected game
        $('#play').on('pagebeforeshow', function() {
            //if (app.currGameDetails.paused !== true) {
            //console.log("WRITE BEFORESHOW");
            var bTemp = false;

            if (app.currGameDetails.useTeams === true && app.currGameDetails.teamType === "byTeam") {
                bTemp = true;
            }
            var $el = $('#btnPauseGame');
            if (app.gameTestMode === true) {
                $el.hide();
            } else {
                $el.show();
            }

            $.mobile.loading('show');
            app.setPlayerPositions();
            if (app.widgetDisplay == "byPlayer") {
                app.writeScoreWidgetsToPageByPlayer(bTemp, function() {
                    
                });
            } else {
                app.writeScoreWidgetsToPageByCategory(bTemp, function() {
                    
                });
            }
            //}
        });

        //allow score type change
        $("#spinPickRounds").on("click", function() {
            app.loadedWidgets = false;
        });


        //allow rounds change
        $("#selectWidgetDisplay").on("change", function() {
            app.loadedWidgets = false;

        });

        $("#calculate-scores").on('click', function() {
            //event.stopImmediatePropagation();
            //console.log("click");
            app.calculateScores(function(iWinners) {
                //console.log(iWinners + " winners");
                //console.log(app.currGameDetails.players.length + " players");
                var bTie = false;
                var i;
                var l;
                var value;
                var sId;
                var now = getTimestamp();
                var winningTeams = [];
                l = app.currGameDetails.savedItems.length;
                for (i = 0; i < l; i++) {
                    sId = app.currGameDetails.savedItems[i].id;
                    var $el = $('#' + sId);
                    value = $el.val();
                    app.currGameDetails.savedItems[i].value = value;
                    //console.log("id: " + sId + " - Value: " + value);
                }
                app.currGameDetails.playDuration = now - app.playStart;
                app.currGameDetails.photo = app.lastPhoto;
                app.currGameDetails.notes = app.lastNotes;
                
                

                if (iWinners > 1 && app.currGameDetails.players.length > 1) {
                    if (app.currGameDetails.useTeams === true) {
                        l = app.currGameDetails.winners.length;
                        for (i = 0; i < l; i++) {
                            if (winningTeams.indexOf(app.currGameDetails.winners[i].team) === -1) {
                                winningTeams.push(app.currGameDetails.winners[i].team);
                            }
                        }
                        if (winningTeams.length > 1) {
                            bTie = true;
                        }
                    } else {
                        bTie = true;
                    }
                }
                app.loadAllLocations(app.currLocations, function() {
                    if (bTie === true) {
                        changePage("#tie");
                        //console.log("Tie Game");
                    } else {
                        if (app.gameTestMode === true) {
                            changePage("#testresults");
                        } else {
                            changePage("#results");
                        }

                        //console.log("No tie");
                    }
                });
            });
        });

        //See if there is a tie
        $("#tie").on("pagebeforeshow", function() {
            app.writePlayersToPage("playerTie");
        });

        $('#buttonBackFromDetails').on('click', function() {
            if (app.gameTestMode === true) {
                changePage("#testresults");
            } else {
                changePage("#results");
            }
        });

        //display final scores
        $("#results").on("pagebeforeshow", function() {
            app.writePlayersToPage("playerResults");
            var $elPlayDate = $('#playDate');
            var $elNotes = $('#textareaNotes');
            var d = new Date();
            var s = d.toISOString();
            var a = [];
            var loc;
            var i;
            a = s.split("T");
            s = a[0];

            var today = new Date();
            var dd = today.getDate();
            var mm = today.getMonth() + 1; //January is 0!
            var yyyy = today.getFullYear();
            if (dd < 10) {
                dd = '0' + dd;
            }
            if (mm < 10) {
                mm = '0' + mm;
            }
            //today = mm + '/' + dd + '/' + yyyy;
            //$elPlayDate.val(today);

            var optionList;
            var $elSelLocationAdd = $('#selLocationAdd');
            optionList = "";
            for (i = 0; i < app.currLocations.length; i++) {
                loc = app.currLocations[i];
                loc = loc.replace(/'/g, "&#39;");
                optionList += "<option value='" + loc + "'>" + app.currLocations[i] + "</option>";
            }
            $elSelLocationAdd.html(optionList).selectmenu('refresh', true);
            $elNotes.val(app.lastNotes);
            //console.log('[RESULTS]: app.lastPhoto: ' + app.lastPhoto);
            if (app.lastPhoto !== '') {  
                app.sessionPicUpdate(app.lastPhoto, function() {
                    
                });
            }
        });

        $("#testresults").on("pagebeforeshow", function() {
            //console.log("writing test results");
            app.writePlayersToPage("testResults");
        });

        //display final score details to page
        $("#game-details").on("pagebeforeshow", function() {
            $.mobile.loading('show');
            app.writeScoreDetailsToPage();
        });

        //display awards
        $("#game-achievements").on("pagebeforeshow", function() {
            app.findAwardsBySession(app.globalSessionId, function(awards) {
                //console.log("callback after find awards");
                app.writePlayersToPage("playerResults2", function() {
                    app.writeAwardsToPage(awards, "awards", function() {
                        if (CloudAll.isReady === true) {
                            //console.log("cloud ready so starting");
                            CloudAll.timeout = setTimeout(CloudAll.start(true, true), 50);
                        } else {
                            //console.log("Cloud not ready, waiting");
                        }
                    });
                });
            });
        });

        $('#promptForDeletePlayer').on("pagebeforeshow", function() {
            $('p#deletePlayerName').text(app.currDeletePlayerName);
        });

        $('#promptForDeletePhoto').on("pagebeforeshow", function() {
            $('p#deletePhotoName').text(app.currDeletePhotoName);
        });

        $('#promptForDeleteGame').on("pagebeforeshow", function() {
            var $el = $('#deleteGameName');
            $el.text(app.currDeleteGameName);
        });

        $('#promptForDeleteHistory').on("pagebeforeshow", function() {
            var $el = $('#deleteHistoryName');
            $el.text(app.currDeleteHistoryName);
        });

        //display history
        $('#history').on('pagebeforeshow', function() {
            //console.log("GamesDisplay:");
            //console.log(app.gamesDisplay);
            //console.log("app.playersDisplay:");
            //console.log(app.playersDisplay);
            var i;
            
            if (app.gamesDisplay.length === 0) {
                var myGameDisplay = new GameDisplay("All", "");
                app.gamesDisplay.push(myGameDisplay);
            }
            
            if (app.playersDisplay.length === 0) {
                var myPlayerDisplay = new PlayerDisplay("All", "");
                app.playersDisplay.push(myPlayerDisplay);
            }
            
            var $el = $('#histChooseGame');
            var l = app.gamesDisplay.length;
            var s;
            $el.empty();
            for (i = 0; i < l; i++) {
                s += '<option value="' + app.gamesDisplay[i].gameId + '">' + app.gamesDisplay[i].gameName + '</option>';
            }
            $el.append(s);
            $el.trigger('change');

            s = "";
            l = app.playersDisplay.length;
            $el = $('#histChoosePlayer');
            $el.empty();
            for (i = 0; i < l; i++) {
                s += '<option value="' + app.playersDisplay[i].playerId + '">' + app.playersDisplay[i].playerName + '</option>';
            }
            $el.append(s);
            $el.trigger('change');

            s = "";
            $el = $('#histChooseWinner');
            $el.empty();
            for (i = 0; i < l; i++) {
                s += '<option value="' + app.playersDisplay[i].playerId + '">' + app.playersDisplay[i].playerName + '</option>';
            }
            $el.append(s);
            $el.trigger('change');

        });

        $('#gallery').on('pagebeforeshow', function() {
            //console.log("GamesDisplay:");
            //console.log(app.gamesDisplay);
            //console.log("app.playersDisplay:");
            //console.log(app.playersDisplay);
            
            if (app.gamesDisplay.length === 0) {
                var myGameDisplay = new GameDisplay("All", "");
                app.gamesDisplay.push(myGameDisplay);
            }
            
            if (app.playersDisplay.length === 0) {
                var myPlayerDisplay = new PlayerDisplay("All", "");
                app.playersDisplay.push(myPlayerDisplay);
            }
            
            var $el = $('#galChooseGame');
            var l = app.gamesDisplay.length;
            var s;
            var i;
            $el.empty();
            for (i = 0; i < l; i++) {
                s += '<option value="' + app.gamesDisplay[i].gameId + '">' + app.gamesDisplay[i].gameName + '</option>';
            }
            $el.append(s);
            $el.trigger('change');

            s = "";
            l = app.playersDisplay.length;
            $el = $('#galChoosePlayer');
            $el.empty();
            for (i = 0; i < l; i++) {
                s += '<option value="' + app.playersDisplay[i].playerId + '">' + app.playersDisplay[i].playerName + '</option>';
            }
            $el.append(s);
            $el.trigger('change');

            s = "";
            $el = $('#galChooseWinner');
            $el.empty();
            for (i = 0; i < l; i++) {
                s += '<option value="' + app.playersDisplay[i].playerId + '">' + app.playersDisplay[i].playerName + '</option>';
            }
            $el.append(s);
            $el.trigger('change');

        });

        $('#deletehist').on('pagebeforeshow', function() {
            //console.log("GamesDisplay:");
            //console.log(app.gamesDisplay);
            //console.log("app.playersDisplay:");
            //console.log(app.playersDisplay);
            if (app.gamesDisplay.length === 0) {
                var myGameDisplay = new GameDisplay("All", "");
                app.gamesDisplay.push(myGameDisplay);
            }
            
            if (app.playersDisplay.length === 0) {
                var myPlayerDisplay = new PlayerDisplay("All", "");
                app.playersDisplay.push(myPlayerDisplay);
            }
            
            var $el = $('#histChooseGameDel');
            var l = app.gamesDisplay.length;
            var s;
            var i;
            $el.empty();
            for (i = 0; i < l; i++) {
                s += '<option value="' + app.gamesDisplay[i].gameId + '">' + app.gamesDisplay[i].gameName + '</option>';
            }
            $el.append(s);
            $el.trigger('change');

            s = "";
            l = app.playersDisplay.length;
            $el = $('#histChoosePlayerDel');
            $el.empty();
            for (i = 0; i < l; i++) {
                s += '<option value="' + app.playersDisplay[i].playerId + '">' + app.playersDisplay[i].playerName + '</option>';
            }
            $el.append(s);
            $el.trigger('change');

            s = "";
            $el = $('#histChooseWinnerDel');
            $el.empty();
            for (i = 0; i < l; i++) {
                s += '<option value="' + app.playersDisplay[i].playerId + '">' + app.playersDisplay[i].playerName + '</option>';
            }
            $el.append(s);
            $el.trigger('change');

        });

        $('#achievements').on('pagebeforeshow', function() {
            //console.log("GamesDisplay:");
            //console.log(app.gamesDisplay);
            //console.log("app.playersDisplay:");
            //console.log(app.playersDisplay);
            //console.log("app.awardsDisplay");
            //console.log(app.awardsDisplay);
            
            if (app.gamesDisplay.length === 0) {
                var myGameDisplay = new GameDisplay("All", "");
                app.gamesDisplay.push(myGameDisplay);
            }
            
            if (app.playersDisplay.length === 0) {
                var myPlayerDisplay = new PlayerDisplay("All", "");
                app.playersDisplay.push(myPlayerDisplay);
            }
            
            if (app.awardsDisplay.length === 0) {
                var myAwardDisplay = new AwardDisplay("All", "");
                app.awardsDisplay.push(myAwardDisplay);
            }
            
            
            var $el = $('#awardChooseGame');
            var l = app.gamesDisplay.length;
            var s;
            var i;
            $el.empty();
            for (i = 0; i < l; i++) {
                s += '<option value="' + app.gamesDisplay[i].gameId + '">' + app.gamesDisplay[i].gameName + '</option>';
            }
            $el.append(s);
            $el.trigger('change');

            s = "";
            l = app.playersDisplay.length;
            $el = $('#awardChoosePlayer');
            $el.empty();
            for (i = 0; i < l; i++) {
                s += '<option value="' + app.playersDisplay[i].playerId + '">' + app.playersDisplay[i].playerName + '</option>';
            }
            $el.append(s);
            $el.trigger('change');

            s = "";
            l = app.awardsDisplay.length;
            app.awardsDisplay.sort(dynamicSort("awardName"));
            $el = $('#awardChooseType');
            $el.empty();
            for (i = 0; i < l; i++) {
                s += '<option value="' + app.awardsDisplay[i].awardId + '">' + app.awardsDisplay[i].awardName + '</option>';
            }
            $el.append(s);
            $el.trigger('change');

        });

        //set app.currPlayers on players Next click
        $('#saveSelectedPlayers').on('click', function() {
            //console.log("saveClicked");
            var $el = $(".player-list input:checked");
            app.selectedPlayerIds = [];
            app.loadedWidgets = false;
            //console.log("app.widgetDisplay = " + app.widgetDisplay);
            var l = $el.length;
            //console.log("selected length: " + $el.length);
            if (l === 0) {
                Toast.toast("Please select one or more players");
            } else {
                for (var i = 0; i < l; i++) {
                    app.selectedPlayerIds.push($el[i].value);
                }
                app.lastSelectedPlayerIds = app.selectedPlayerIds;
                app.removeUnselectedPlayers(function() {
                    //console.log(app.currGameDetails.players);
                    if (app.currGameDetails.players.length > 0) {

                        changePage("#playerorder");

                    } else {
                        Toast.toast("Please select at least one player");
                    }
                });
            }
        });

        //set winner in tiebreaker
        $('#saveSelectedWinners').on('click', function() {
            var $el = $(".player-tie input:checked");
            app.selectedPlayerIds = [];
            var l = $el.length;
            for (var i = 0; i < l; i++) {
                app.selectedPlayerIds.push($el[i].value);
            }
            app.removeUnselectedWinners(function() {
                app.currGameDetails.players.sort(dynamicSortMultiple("-winner", "-points"));
                if (app.gameTestMode === true) {
                    changePage("#testresults");
                } else {
                    changePage("#results");
                }
            });
        });

        //set app.currPlayers sorted on players Play click
        $('#saveSortedPlayers').on('click', function() {
            var $el = $(".player-sort li");
            var bCont = true;
            var $elTeamScoring = $('#selectTeamScoring');
            var i = 0;
            var $elRounds = $('#spinPickRounds');
            app.playStart = getTimestamp();
            app.getSetting("chkSessionTimer", "true", function(setting) {
                if (setting === "true") {
                    Toast.toastMini("Play timer started");
                }
            });

            app.selectedPlayerIds = [];
            app.loadedWidgets = false;
            app.widgetDisplay = $("#selectWidgetDisplay :selected").val();
            app.saveSetting("app.widgetDisplay", app.widgetDisplay);
            app.currGameDetails.rounds = $elRounds.val();
            app.currGameDetails.teamType = $elTeamScoring.val();

            var count = $el.length;
            for (i = 0; i < count; i++) {
                //console.log("Sort Player: " + $el[i].id);
                app.selectedPlayerIds.push($el[i].id);
            }

            if (app.currGameDetails.useTeams === true) {
                var teamNames = [];
                var j = 0;
                var iFound = 0;
                var team;
                var bFound = false;
                var myTeam;
                var myTeamTemp;
                var teamColor;
                for (i = 0; i < app.currGameDetails.players.length; i++) {
                    team = app.currGameDetails.players[i].team;
                    bFound = false;
                    for (j = 0; j < teamNames.length; j++) {
                        if (teamNames[j] === team) {
                            bFound = true;
                            break;
                        }
                    }
                    if (bFound === false) {
                        teamNames.push(team);
                    }
                }

                app.currTeams = [];
                app.currGameDetails.teams = [];
                for (i = 0; i < teamNames.length; i++) {
                    switch (iFound) {
                        case 0:
                            teamColor = "green";
                            break;
                        case 1:
                            teamColor = "blue";
                            break;
                        case 2:
                            teamColor = "red";
                            break;
                        case 3:
                            teamColor = "orange";
                            break;
                        case 4:
                            teamColor = "yellow";
                            break;
                        case 5:
                            teamColor = "purple";
                            break;
                        case 6:
                            teamColor = "pink";
                            break;
                        case 7:
                            teamColor = "gold";
                            break;
                        case 8:
                            teamColor = "brown";
                            break;
                        default:
                            teamColor = "black";
                            break;
                    }
                    myTeam = new Player(i, "", "", teamNames[i], "img/colors/" + teamColor + "0032.png", false, teamColor);

                    app.currTeams.push(myTeam);
                    iFound++;
                    myTeamTemp = new PlayerTemp(myTeam);
                    app.currGameDetails.teams.push(myTeamTemp);
                }

            }

            app.sortPlayersTemp(function(results) {
                app.currGameDetails.players = results;
                if (app.currGameDetails.useTeams === true) {
                    for (var i = 0; i < app.currGameDetails.players.length; i++) {
                        if (app.currGameDetails.players[i].team === "") {
                            bCont = false;
                        }
                    }
                    if (bCont === false) {
                        Toast.toast("Please assign teams to all players");
                    } else {
                        changePage("#play");
                    }
                } else {
                    changePage("#play");
                }
            });
        });

        $("#frmGameSearch").submit(function(e) {
            e.preventDefault();
            return app.searchSubmit();
        });

        $("#frmOnlineGameSearch").submit(function(e) {
            e.preventDefault();
            return app.searchSubmit2();
        });

        //randomize players Randomize click
        $('#player-rand').on('click', function() {
            //console.log("Player rand");
            app.currGameDetails.players.shuffle();
            app.writePlayersToPage("playerOrder");
            Toast.toast("Randomized!");
        });

        $('#btnSelAll').on('click', function() {
            //console.log("All");
            var i;
            var l = app.currPlayers.length;
            var $el;
            for (i = 0; i < l; i++) {
                $el = $('#player' + app.currPlayers[i].id); //comment
                $el.prop('checked', true);
                $el.checkboxradio("refresh");
                //console.log("#player" + app.currPlayers[i].id);
            }
        });

        $('#creditsButton').on('click', function() {
            changePage('#credits');
        });

        $('#btnSelNone').on('click', function() {
            var i;
            var l = app.currPlayers.length;
            var $el;
            for (i = 0; i < l; i++) {
                $el = $('#player' + app.currPlayers[i].id);
                $el.prop('checked', false);
                $el.checkboxradio("refresh");
                //console.log("#player" + app.currPlayers[i].id);
            }
        });

        $('#creditsMikeGibson').on('click', function() {
            Social.follow();
        });

        $('#creditsBenDevens').on('click', function() {
            //Social.launchURL("http://www.google.com");
            Toast.toast('Call me misanthropic if you will, but the best part of an elevator being out of service is watching illiterates push the call button repeatedly while looking directly at the "out of service" sign with growing iritance.');
        });

        $('#creditsIconka').on('click', function() {
            Social.launchURL("http://www.iconka.com/");
        });

        $('#buttonSaveScores').on('click', function() {
            app.saveScoresDelay();
        });
        
        //console.log("[APP] Initialize Complete");
        if (callback) {
            callback(true);   
        }
    }
};

app.initialize();
/*
jshint
var $;
var chartToImageStr;
var Toast;
var Popup;
var Device;
var Globals;
var Game;
var isNumber;
var playAudio;
var Setting;
var OldScoreItem;
var TallyHistory;
var CloudHist;
var CloudBlob;
var Score;
var AwardEarned;
var Session;
var Player;
var dynamicSort;
var AwardDisplay;
var GameDisplay;
var NumPlayersDisplay;
var GameDetails;
var ScoreItem;
var MozActivity;
var Camera;
var alertDebug;
var getTimestamp;
var FileIO;
var CloudLocal;
var Faction;
var Location;
var Team;
var downloadImage;
var Award;
var Avatar;
var Internet;
var Social;
var changePage;
var dynamicSortMultiple;
var SavedItem;
var CloudAll;
var LocalStore;
var WebSqlStore;
var toTitleCase;
var parseXml;
var xml2json;
var OnlineGameData;
var PlayerDisplay;
var History;
var getAwardDesc;
var getHistoryDesc;
var humaneDate;
var PlayerTemp;
var getSessionDesc;
var jQuery;
var escape;
var BGGObject;
var roundHalf;
var roundQuarter;
var ScoreDetails;
var FakeContact;
var BGGObject;
var round;
var Cloud;
*/
