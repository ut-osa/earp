var CloudLocal = {
    parseGet: function(myCloud, callback) {
        //console.log("Parsing Cloud Get");
        //console.log("Cloud ID Remote: " + myCloud.cloudIdRemote);
        //console.log("Cloud Data: " + myCloud.cloudData);
        var dNow = getTimestamp();
        //console.log(dNow - CloudAll.lastMini);

        var teamName;
        var locationName;
        var factionName;
        var factionId;
        var playerId;
        var playerName;
        var playerPoints;
        var playerWin;
        var playerIcon;
        var playerBGGUsername;
        var playerTwitter;
        var playerColor;
        var playerTeam;
        var playerFaction;
        var playerPosition;
        var gameId;
        var gameIdSan;
        var gameBGGId;
        var gameIcon;
        var gameImage;
        var gameName;
        var gameCustom;
        var gamePhoto;
        var gameNotes;
        var gameWon;
        var gameDate;
        var gameScoretype;
        var gamePickrounds;
        var gameAdvanced;
        var winnerId;
        var winnerName;
        var winnerPoints;
        var dummy;
        var scoreId;
        var session_id;
        var earnedId;
        var awardId;
        var awardValue;
        var awardData;
        var awardDate;
        var sort;
        var scoreItem;
        var points;
        var win;
        var sessionId;
        var gameDuration;
        var gameLocation;
        var gameVersion;
        var id1;
        var id2;
        //console.log(myCloud);
        if (myCloud.pushClient == CloudAll.pushClient) {
            //console.log("SKIP: Same client");
            callback(false, myCloud);
        } else {

            //console.log(myCloud.cloudData);
            if (myCloud.cloudData !== undefined) {
                if (dNow - CloudAll.lastMini > 1500) {
                    CloudAll.lastMini = dNow;
                    app.getSetting("chkCloudActivity", "true", function(setting) {
                        if (setting === "true") {
                            Toast.toastMini("Downloading cloud data");
                        }
                    });

                }
                //console.log("PROCESS: " + myCloud.cloudData);
                var a = myCloud.cloudData.split("|");
                switch (a[0]) {
                    case "AddFaction":
                        factionName = a[1];
                        gameId = a[2];
                        factionName = factionName.replace(/@@BAR@@/g, "|");
                        var myFaction = new Faction(factionName, gameId);
                        app.store.addFaction(myFaction, function() {
                            callback(true, myCloud);
                        });
                        break;
                    case "AddTeam":
                        teamName = a[1];
                        teamName = teamName.replace(/@@BAR@@/g, "|");
                        var myTeam = new Team(teamName);
                        app.store.addTeam(myTeam, function() {
                            callback(true, myCloud);
                        });
                        break;

                    case "AddLocation":
                        locationName = a[1];
                        locationName = locationName.replace(/@@BAR@@/g, "|");
                        var myLocation = new Location(locationName);
                        app.store.addLocation(myLocation, function() {
                            callback(true, myCloud);
                        });
                        break;
                    case "AddPlayer": //Add Player
                        //console.log("C Add Player");
                        //add player here
                        playerId = a[1];
                        playerName = a[2];
                        if (a[3] == "BLOB") {
                            a[3] = "1";
                        }
                        if (a[3].length <= 2) {
                            playerIcon = "img/players/Player" + a[3] + ".png";
                        } else {
                            playerIcon = a[3];
                        }
                        if (a.length >= 5) {
                            playerBGGUsername = a[4];
                        } else {
                            playerBGGUsername = "";
                        }
                        if (a.length >= 6) {
                            playerTwitter = a[5];
                        } else {
                            playerTwitter = "";
                        }

                        playerName = playerName.replace(/@@BAR@@/g, "|");
                        playerIcon = playerIcon.replace(/@@BAR@@/g, "|");
                        playerBGGUsername = playerBGGUsername.replace(/@@BAR@@/g, "|");
                        var myPlayer = new Player(playerId, playerBGGUsername, playerTwitter, playerName, playerIcon, false);
                        
                        app.findPlayerById(myPlayer.id, function(existingPlayer) {
                            //console.log("existing player: ");
                            //console.log(existingPlayer);
                            
                            if (existingPlayer) {
                                myPlayer.hiddenOnDevice = existingPlayer.hiddenOnDevice;
                                myPlayer.hidden = existingPlayer.hidden;
                                // if (myPlayer.icon === "EXISTING") {
                                    // //console.log("Use existing image");
                                    // myPlayer.icon = existingPlayer.icon;
                                // }
                            }
                            
                            var playerLower = myPlayer.icon.toLowerCase();
                            if (playerLower.indexOf("http://") >= 0 && Device.platform !== "Browser") {
                                var a = myPlayer.icon.split(".");
                                var l = a.length;
                                var ext = a[l - 1];
                                //console.log("ext: " + ext);
                    
                                downloadImage(myPlayer.icon, "player" + myPlayer.id + '.' + ext, "ScoreGeek", function(fileURL) {
                                    if (fileURL !== null) {
                                        //console.log("Player File: " + fileURL.length);
                                        myPlayer.icon = fileURL;
                                    } else {
                                        //console.log("NULL player file!");
                                    }
                                    app.addPlayer(myPlayer, function() {
                                        //console.log("After cloud addplayer");
                                        //console.log(callback);
                                        app.historyIsLoaded = false;
                                        app.lastPlayerAdd = getTimestamp();
                                        callback(true, myCloud);
                                    });
                                });
                            } else {
                                app.addPlayer(myPlayer, function() {
                                    app.historyIsLoaded = false;
                                    app.lastPlayerAdd = getTimestamp();
                                    callback(true, myCloud);
                                });
                            }
                        });
                        break;
                    case "DelPlayer": //delete player
                        playerId = a[1];
                        app.store.deletePlayerById(playerId, function() {
                            app.historyIsLoaded = false;
                            app.lastPlayerAdd = getTimestamp();
                            callback(true, myCloud);
                        });
                        break;
                    case "AddSession": //Add Session
                        //console.log("Cloud Add Session");
                        //console.log(a);
                        //AddSession|1373490503718|7Wonders|MikeGibson|Mike|54|0|7 Wonders|undefined||1373490503718|-1
                        sessionId = a[1];
                        gameId = app.sanitizeGame(a[2]);
                        winnerId = [3];
                        winnerName = a[4];
                        winnerPoints = a[5];
                        gameCustom = a[7];
                        gameName = a[6];
                        gamePhoto = a[8];
                        gameNotes = a[9];
                        gameDate = a[10];
                        gameWon = a[11];

                        if (a.length > 11) {
                            gameLocation = a[12];
                        } else {
                            gameLocation = "ScoreGeek";
                        }

                        if (a.length > 12) {
                            gameDuration = a[13];
                        } else {
                            gameDuration = 0;
                        }
                        gameDate = parseInt(gameDate, 10);
                        winnerName = winnerName.replace(/@@BAR@@/g, "|");
                        gameName = gameName.replace(/@@BAR@@/g, "|");
                        gamePhoto = gamePhoto.replace(/@@BAR@@/g, "|");
                        gameNotes = gameNotes.replace(/@@BAR@@/g, "|");
                        if (gameLocation !== undefined) {
                            gameLocation = gameLocation.replace(/@@BAR@@/g, "|");
                        }

                        app.findGameById(gameId, function(game) {
                            //console.log("Looking for " + gameId + ":");
                            //console.log(game);
                            if (game === null || game === undefined) {
                                app.store.findOldGameById(gameId, function(myGame) {
                                    if (myGame !== null && myGame !== undefined) {
                                        //console.log("Found old game");
                                        //console.log(myGame);
                                        //console.log(app.oldFavorites);
                                        if (app.oldFavorites.indexOf(gameId) !== -1) {
                                            //console.log("Found favorite");
                                            myGame.favorite = true;
                                        }
                                        //console.log("Add game from cloud session");
                                        //console.log(myGame.name);
                                        app.store.addGame(myGame, function() {
                                            app.historyIsLoaded = false;
                                        });
                                    }
                                });
                            }
                        });

                        //app.store.addSessionData(sessionId, gameId, winnerId, winnerName, winnerPoints, gameName, gameCustom, gamePhoto, gameNotes, gameDate, gameWon, gameLocation, gameDuration);
                        //addSessionData =        session_id game_id winner_id winner_name winner_points, game_name, game_custom, game_photo, game_notes, game_date, game_won, callback) {
                        var mySession = new Session(sessionId, gameId, gameDate, gameNotes, gamePhoto, gameWon, gameLocation, gameDuration);
                        //console.log("Adding Session");
                        //console.log(mySession);
                        app.store.addSession(mySession, function() {
                            app.historyIsLoaded = false;
                            app.lastHistoryAdd = getTimestamp();
                            callback(true, myCloud);
                        });
                        break;

                    case "DelSession":
                        //console.log("DEL SESSION");
                        sessionId = a[1];
                        app.store.deleteSessionBySessionId(sessionId, function() {
                            app.store.deleteScoresBySessionId(sessionId, function() {
                                app.store.deleteAwardsEarnedBySessionId(sessionId, function() {
                                    app.historyIsLoaded = false;
                                    app.lastHistoryAdd = getTimestamp();
                                    callback(true, myCloud);
                                });
                            });
                        });

                        break;
                    case "AddScore": //Add Score
                        //console.log("C Add Score");
                        //session_id, player_id, player_points, player_win
                        scoreId = a[1];
                        sessionId = a[2];
                        playerId = a[3];
                        playerPoints = a[4];
                        playerWin = a[5];
                        if (a.length >= 7) {
                            playerColor = a[6];
                        } else {
                            playerColor = "";
                        }
                        if (a.length >= 8) {
                            playerTeam = a[7];
                        } else {
                            playerTeam = "";
                        }
                        if (a.length >= 9) {
                            playerFaction = a[8];
                        } else {
                            playerFaction = "";
                        }
                        if (a.length >= 10) {
                            playerPosition = a[9];
                        } else {
                            playerPosition = "";
                        }
                        playerTeam = playerTeam.replace(/@@BAR@@/g, "|");
                        playerFaction = playerFaction.replace(/@@BAR@@/g, "|");
                        //console.log("Add Score player win: " + playerWin); 
                        //app.addScoreData(scoreId, sessionId, playerId, playerPoints, playerWin);
                        var myScore = new Score(scoreId, sessionId, playerId, parseFloat(playerPoints), playerWin, playerColor, playerTeam, playerFaction, playerPosition);
                        app.store.addScore(myScore, function() {
                            app.historyIsLoaded = false;
                            app.lastHistoryAdd = getTimestamp();
                            callback(true, myCloud);
                        });

                        break;
                    case "AddAward": //Add Achievement
                        //console.log("C add score");
                        //award_id,award_value,game_id,game_custom, game_icon,game_name,session_id,player_name,player_id,award_data
                        earnedId = a[1];
                        awardId = a[2];
                        awardValue = a[3];
                        gameId = app.sanitizeGame(a[4]);
                        gameCustom = a[5];
                        gameIcon = "img/games/" + a[6];
                        gameName = a[7];
                        sessionId = a[8];
                        playerName = a[9];
                        playerId = a[10];
                        awardData = a[11];
                        awardDate = a[12];
                        if (a.length >= 14) {
                            playerTwitter = a[13];
                        } else {
                            playerTwitter = "";
                        }
                        gameName = gameName.replace(/@@BAR@@/g, "|");
                        playerName = playerName.replace(/@@BAR@@/g, "|");
                        //app.store.addAward(earnedId, awardId, awardValue, gameId, gameCustom, gameIcon, gameName, sessionId, playerName, playerId, awardData, awardDate, playerTwitter);
                        //                 award_id,award_value,game_id,game_custom, game_icon,game_name,session_id,player_name,player_id,award_data
                        var myAward = new AwardEarned(earnedId, awardId, awardValue, gameId, playerId, sessionId, awardDate, awardData);
                        app.store.addAwardEarned(myAward, function() {
                            app.historyIsLoaded = false;
                            app.lastHistoryAdd = getTimestamp();
                            callback(true, myCloud);
                        });
                        break;
                    case "AddGame":
                        //console.log(a);
                        gameId = app.sanitizeGame(a[1]);
                        gameName = a[2];
                        if (a[3].length <= 2) {
                            gameImage = "img/games/Game" + a[3] + ".png";
                        } else {
                            gameImage = a[3];
                        }
                        if (a[3] == "BLOB") {
                            a[3] = "1";
                        }
                        gameCustom = a[4];
                        gameScoretype = a[5];
                        gamePickrounds = a[6];
                        gameAdvanced = a[7];
                        gameAdvanced = gameAdvanced.replace(/@@BAR@@/g, "|");
                        gameAdvanced = gameAdvanced.replace(/\[BAR\]/g, "|");
                        if (a.length >= 9) {
                            gameBGGId = a[8];
                        } else {
                            gameBGGId = "";
                        }
                        if (a.length >= 10) {
                            gameVersion = a[9];
                        } else {
                            gameVersion = "1";
                        }
                        gameName = gameName.replace(/@@BAR@@/g, "|");
                        gameImage = gameImage.replace(/@@BAR@@/g, "|");
                        gameAdvanced = gameAdvanced.replace(/@@BAR@@/g, "|");

                        if (gameAdvanced === "") {
                            switch (gameScoretype) {
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
                        }

                        if (gamePickrounds == "-1") {
                            if (gameAdvanced.indexOf("PickRounds=True;") === -1) {
                                gameAdvanced += "PickRounds=True;";
                            }
                        }

                        //console.log("GAME CUSTOM: " + gameCustom);
                        var myGame = new Game(gameId, gameBGGId, gameName, gameImage, gameScoretype, gameAdvanced, gameVersion);
                        //console.log("Add game from cloud game");
                        //console.log(myGame);
                        
                        app.findGameById(myGame.gameId, function(existingGame) {
                           if (existingGame) {
                               //console.log("Game exists");
                               myGame.hidden = existingGame.hidden;
                               // if (myGame.gameImage === "EXISTING") {
                                   // //console.log("Reuse image");
                                   // myGame.gameImage = existingGame.gameImage;
                               // }
                           } 
                           
                           var gameLower = gameImage.toLowerCase();

                            if (gameLower.indexOf("http://") >= 0 && Device.platform !== "Browser") {
                                var a2 = gameImage.split(".");
                                var l2 = a2.length;
                                var ext = a2[l2 - 1];
                                //console.log("ext: " + ext);
    
                                downloadImage(gameImage, gameId + '.' + ext, "ScoreGeek", function(fileURL) {
                                    if (fileURL !== null) {
                                        //console.log("Game File: " + fileURL);
                                        myGame.icon = fileURL;
                                    }
                                    app.store.addGame(myGame, function() {
                                        app.lastGameAdd = getTimestamp();
                                        //console.log("setting app.lastGameAdd: " + app.lastGameAdd);
                                        
                                        callback(myCloud);
                                    });
                                });
                            } else {
                                app.store.addGame(myGame, function() {
                                    app.lastGameAdd = getTimestamp();
                                    //console.log("setting app.lastGameAdd: " + app.lastGameAdd);
                                    
                                    callback(true, myCloud);
                                });
                            }

                           
                        });
                        break;
                    case "DelGame":
                        gameId = a[1]; //app.sanitizeGame(a[1]);
                        gameIdSan = app.sanitizeGame(a[1]);
                        //console.log("1: " + gameId);
                        //console.log("2: " + gameIdSan);
                        app.store.deleteGameById(gameId, function() {
                            app.lastGameAdd = getTimestamp();
                            //console.log("setting app.lastGameAdd: " + app.lastGameAdd);
                            
                            callback(true, myCloud);
                        });
                        break;
                    case "AddGamePhoto":
                        gameId = app.sanitizeGame(a[1]);
                        gameImage = a[2];
                        //Toast.toast("Add Game Photo")
                        app.store.updateGameIcon(gameId, gameImage, function() {
                            app.lastGameAdd = getTimestamp();
                            //console.log("setting app.lastGameAdd: " + app.lastGameAdd);
                            
                            callback(true, myCloud);
                        });
                        break;
                    case "AddPlayerPhoto":
                        //console.log("Add Player Photo");
                        playerId = a[1];
                        //console.log("PlayerId: " + playerId);
                        playerIcon = a[2];
                        //console.log("PlayerIcon: " + playerIcon);
                        app.store.updatePlayerPhoto(playerId, playerIcon, function() {
                            app.lastPlayerAdd = getTimestamp();
                            callback(true, myCloud);
                        });
                        break;
                    case "AddSessionPhoto":
                        if (Globals.cloudAllowSessionPhotos === true) {
                            sessionId = a[1];
                            gamePhoto = a[2];
                            app.store.updateSessionPhoto(sessionId, gamePhoto, function() {
                                app.historyIsLoaded = false;
                                app.lastHistoryAdd = getTimestamp();
                                callback(true, myCloud);
                            });
                        } else {
                            callback(false, myCloud);
                        }
                        break;
                    default:
                        callback(false, myCloud);
                }

            }
        }
    },
    
    queueEditSession: function(session_id, winner_id, winner_name, winner_points, callback) {
        //console.log("cloudQueueEditSession");
        var cloudMsg = "EditSession" + "|" + session_id + "|" + winner_id + "|" + winner_name + "|" + winner_points;
        app.store.saveCloudQueue(cloudMsg, function() {
            callback();
        });
    },

    queueEditScore: function(score_id, points, win, callback) {
        //console.log("cloudQueueEditScore");
        var cloudMsg = "EditScore" + "|" + score_id + "|" + points + "|" + win;
        app.store.saveCloudQueue(cloudMsg, function() {
            callback();
        });
    },

    queueFaction: function(name, gameId, callback) {
        //console.log("cloudQueueFaction");
        if (name !== undefined) {
            name = name.replace(/\|/g, "@@BAR@@");
        }
        var cloudMsg = "AddFaction" + "|" + name + "|" + gameId;
        app.store.saveCloudQueue(cloudMsg, "fa" + name, 0, "", function() {
            callback();
        });
    },

    queueTeam: function(name, callback) {
        //console.log("cloudQueueTeam");
        if (name !== undefined) {
            name = name.replace(/\|/g, "@@BAR@@");
        }
        var id = name;
        var cloudMsg = "AddTeam" + "|" + id + "|" + name;
        app.store.saveCloudQueue(cloudMsg, "te" + id, 0, "", function() {
            callback();
        });
    },

    queueLocation: function(name, callback) {
        //console.log("cloudQueueLocation");
        if (name !== undefined) {
            name = name.replace(/\|/g, "@@BAR@@");
        }
        var id = name;
        var cloudMsg = "AddLocation" + "|" + id + "|" + name;
        app.store.saveCloudQueue(cloudMsg, "lo" + id, 0, "", function() {
            callback();
        });
    },

    queuePlayer: function(playerId, playerName, playerImage, playerBGGUsername, playerTwitter, photoChanged, callback) {
        //console.log("CloudQueuePlayer");
        //console.log("queue: " + playerImage);
        var blob = "";
        var playerImageLower = playerImage.toLowerCase();
        if (playerImage.indexOf("img/players/Player") >= 0) {
            playerImage = playerImage.replace("img/players/Player", "");
            playerImage = playerImage.replace(".png", "");
        } else if (playerImageLower.indexOf("http://") > -1 || playerImageLower.indexOf("https://") > -1) {
            //do nothing, it's a url
        } else {
            //if (photoChanged === true) {
                blob = "AddPlayerPhoto|" + playerId + "|" + playerImage; 
                playerImage = "BLOB";
            // } else {
                // playerImage = "EXISTING";
            // }
            
        }

        if (playerName !== undefined) {
            playerName = playerName.replace(/\|/g, "@@BAR@@");
        }
        if (playerImage !== undefined) {
            playerImage = playerImage.replace(/\|/g, "@@BAR@@");
        }
        if (playerBGGUsername !== undefined) {
            playerBGGUsername = playerBGGUsername.replace(/\|/g, "@@BAR@@");
        }
        if (playerTwitter !== undefined) {
            playerTwitter = playerTwitter.replace(/\|/g, "@@BAR@@");
        }

        var cloudMsg = "AddPlayer" + "|" + playerId + "|" + playerName + "|" + playerImage + "|" + playerBGGUsername + "|" + playerTwitter;
        //console.log(cloudMsg);
        app.store.saveCloudQueue(cloudMsg, playerId, 0, blob, function(id) {
            if (blob !== "") {
                CloudLocal.queueBlob(id, blob, function() {
                    callback();
                });
            } else {
                callback();
            }
        });
    },

    queueBlob: function(cloudIdLocal, cloudBlob, callback) {
        //console.log("cloudQueueBlob");
         if (cloudBlob !== undefined && cloudBlob !== "") {
             //console.log("CloudQueueBlob cloudIdLocal: " + cloudIdLocal);
             //console.log(cloudBlob);
             app.store.saveCloudBlob(cloudIdLocal, cloudBlob, function() {
                 //console.log("saved blob");
                 callback();
             });
         } else {
             //console.log("skipped blob");
             callback();
         }
        callback();
    },

    queueDelPlayer: function(playerId, callback) {
        //console.log('cloudQueueDelPlayer');
        var cloudMsg = "DelPlayer" + "|" + playerId;
        app.store.saveCloudQueue(cloudMsg, playerId, function() {
            callback();
        });
    },

    queueSession: function(sessionId, gameId, winnerId, winnerName, winnerScore, gameName, gameCustom, gamePhoto, gameNotes, gameDate, gameWon, gameLocation, gameDuration, callback) {
        //console.log("cloudQueueSession");
        var blob = "";
        if (gamePhoto !== "" && gamePhoto !== undefined && gamePhoto !== null && gamePhoto != 'undefined') {
            if (Globals.cloudAllowSessionPhotos === true) {
                blob = "AddSessionPhoto|" + sessionId + "|" + gamePhoto;
                gamePhoto = "BLOB";
            } else {
                gamePhoto = "";
            }
        } else {
            gamePhoto = "";
        }

        //console.log("Blob len: " + blob.length);
        //console.log("Gamephoto len: " + gamePhoto.length);

        if (winnerName !== undefined) {
            winnerName = winnerName.replace(/\|/g, "@@BAR@@");
        }
        if (gameName !== undefined) {
            gameName = gameName.replace(/\|/g, "@@BAR@@");
        }
        if (gamePhoto !== undefined) {
            gamePhoto = gamePhoto.replace(/\|/g, "@@BAR@@");
        }
        if (gameNotes !== undefined) {
            gameNotes = gameNotes.replace(/\|/g, "@@BAR@@");
        }
        if (gameLocation !== undefined) {
            gameLocation = gameLocation.replace(/\|/g, "@@BAR@@");
        }

        //console.log("Gamephoto len: " + gamePhoto.length);

        var cloudMsg = "AddSession" + "|" + sessionId + "|" + gameId + "|" + winnerId + "|" + winnerName + "|" + winnerScore + "|" + gameName + "|" + gameCustom + "|" + gamePhoto + "|" + gameNotes + "|" + gameDate + "|" + gameWon + "|" + gameLocation + "|" + gameDuration;
        app.store.saveCloudQueue(cloudMsg, sessionId, 0, blob, function(id) {
            //console.log("After save cloud queue");
            if (blob !== "") {
                //console.log("cloud queue blob:");
                CloudLocal.queueBlob(id, blob, function() {

                });
            }
        });
        //Moved this here to callback independent of queueing the cloud blob
        callback();
    },

    queueDelSession: function(sessionId, callback) {
        //console.log('cloudQueueDelSession');
        var cloudMsg = "DelSession" + "|" + sessionId;
        app.store.saveCloudQueue(cloudMsg, sessionId, function() {
            callback();
        });
    },

    queueScore: function(scoreId, sessionId, playerId, playerScore, playerWon, color, team, faction, position, callback) {
        //console.log("CloudQueueScore");
        if (team !== undefined) {
            team = team.replace(/\|/g, "@@BAR@@");
        }
        if (faction !== undefined) {
            faction = faction.replace(/\|/g, "@@BAR@@");
        }
        var cloudMsg = "AddScore" + "|" + scoreId + "|" + sessionId + "|" + playerId + "|" + playerScore + "|" + playerWon + "|" + color + "|" + team + "|" + faction + "|" + position;
        app.store.saveCloudQueue(cloudMsg, scoreId, function() {
            callback();
        });
    },

    queueAward: function(earnedId, awardId, awardValue, gameId, gameCustom, gameImage, gameName, sessionId, playerName, playerId, awardData, awardDate, playerTwitter, callback) {
        //console.log('cloudQueueAward');

        if (gameImage.indexOf("img/games/") >= 0) {
            gameImage = gameImage.replace("img/games/", "");
        } else {
            gameImage = "Game1.png";
        }

        if (playerName !== undefined) {
            playerName = playerName.replace(/\|/g, "@@BAR@@");
        }
        if (playerTwitter !== undefined) {
            playerTwitter = playerTwitter.replace(/\|/g, "@@BAR@@");
        }

        var cloudMsg = "AddAward" + "|" + earnedId + "|" + awardId + "|" + awardValue + "|" + gameId + "|" + gameCustom + "|" + gameImage + "|" + gameName + "|" + sessionId + "|" + playerName + "|" + playerId + "|" + awardData + "|" + awardDate + "|" + playerTwitter;
        app.store.saveCloudQueue(cloudMsg, earnedId, function() {
            callback();
        });
    },

    queueGame: function(gameId, gameName, gameImage, gameCustom, scoreType, advanced, gameBGGID, gameVersion, photoChanged, callback) {
        //console.log("CloudQueueGame");
        var cloudMsg;
        var blob = "";
        var gameImageLower = gameImage;
        var pickRounds = '';
        gameImageLower = gameImageLower.toLowerCase();

        if (gameImageLower.indexOf("http://") > -1 || gameImageLower.indexOf("https://") > -1 || gameImageLower.indexOf("cdvfile://") > -1) {
            //console.log("do nothing, it's a URL");
        } else if (gameImage.indexOf("img/games/Game") >= 0) {
            //console.log("it's a game image");
            gameImage = gameImage.replace("img/games/Game", "");
            gameImage = gameImage.replace(".png", "");
        } else if (gameImage.indexOf("img/games") >= 0) {
            //console.log("Do nothing, it's a stored image");
        } else {
            //it's a photo, replace it with the default image
            //if (photoChanged === true) {
                blob = "AddGamePhoto|" + gameId + "|" + gameImage;
                //console.log(blob);
                gameImage = "BLOB";
            // } else {
                // gameImage = "EXISTING";
            // }
            
        }

        //console.log("Blob len: " + blob.length);
        //console.log("GameImage len: " + gameImage.length);

        if (gameName !== undefined) {
            gameName = gameName.replace(/\|/g, "@@BAR@@");
        }
        if (gameImage !== undefined) {
            gameImage = gameImage.replace(/\|/g, "@@BAR@@");
        }
        if (advanced !== undefined) {
            //console.log("replacing " + advanced);
            advanced = advanced.replace(/\|/g, "@@BAR@@");
            //console.log("After: " + advanced);
        }
        if (gameBGGID !== undefined) {
            gameBGGID = gameBGGID.replace(/\|/g, "@@BAR@@");
        }

        cloudMsg = "AddGame" + "|" + gameId + "|" + gameName + "|" + gameImage + "|" + gameCustom + "|" + scoreType + "|" + pickRounds + "|" + advanced + "|" + gameBGGID + "|" + gameVersion;
        //console.log("cloudMsg: " + cloudMsg);
        app.store.saveCloudQueue(cloudMsg, gameId, 0, blob, function(id) {
            //console.log("SaveCLoudQueueCalledBack: " + id);
            if (blob !== "") {
                //console.log("Blob !== ''");
                CloudLocal.queueBlob(id, blob, function() {
                    //console.log("callback blob");
                    callback();
                });
            } else {
                //console.log("callback normal");
                callback();
            }
        });
    },

    queueDelGame: function(gameId, callback) {
        //console.log("CloudQueueDelGame");
        var cloudMsg = "DelGame" + "|" + gameId;
        app.store.saveCloudQueue(cloudMsg, gameId, function() {
            callback();
        });
    },
    
    initialize: function(callback) {
        //console.log("[CloudLocal] Initialized");
    }
};

CloudLocal.initialize();
