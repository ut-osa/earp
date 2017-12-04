//Storage



var lsGet = function(key) {
    return window.localStorage.getItem(key);
};

var lsSet = function(key, value) {
    window.localStorage.setItem(key, value);
    return true;
};

var lsRemove = function(key, index) {
    window.localStorage.removeItem(key);
    if (index !== undefined) {
        lsRemoveFromIndex("index" + index, key);
    }
    return true;
};

var lsRemoveFromIndex = function(index, key) {
    var s = lsGet("Index" + index);
    if (s !== null && s !== undefined) {
        s = s.replace("," + key + ",", ",");
        lsSet("Index" + index, s);
    }
    return true;
};

var lsGetObj = function(key) {
    return JSON.parse(window.localStorage.getItem(key));
};

var lsSetObj = function(key, value, index) {
    window.localStorage.setItem(key, JSON.stringify(value));
    if (index !== undefined) {
        lsSetIndex(index, key);
    }
    return true;
};

var lsSetIndex = function(index, key) {
    var s = lsGet("Index" + index);
    if (s !== null && s !== undefined) {
        s = s.replace("," + key + ",", ",");
        s += "," + key + ",";
        s = s.replace(",,", ",");
    } else {
        s = "," + key + ",";
    }
    lsSet("Index" + index, s);
    return true;
};

var lsGetIndex = function(index) {
    var s = lsGet("Index" + index);
    //console.log("GetIndex: " + s);
    var a = [];
    if (s !== null && s !== undefined) {
        a = s.split(",");
        a.clean();
    }
    return a;
};

var lsGetAllIndexItems = function(index) {
    var indexKeys = lsGetIndex(index);
    var l = indexKeys.length;
    var o;
    var objects = [];
    for (var i = 0; i < l; i++) {
        o = lsGetObj(indexKeys[i]);
        if (o !== null && o !== undefined) {
            objects.push(o);
        }
    }
    return objects;
};

var lsGetAutoInc = function(index) {
    var s = lsGetObj("autoInc" + index);
    if (s === undefined || s === null) {
        s = new Setting("autoInc" + index, 0, "");
        lsSetObj("autoInc" + index, s);
    } else {
        s.settingValue++;
        lsSetObj("autoInc" + index, s);
    }
    return s.settingValue;
};

var lsSetAutoInc = function(index, myValue) {
    //console.log("Forcing auto inc: " + index + value);
    var s = new Setting("autoInc" + index, myValue, "");
    var i = lsGetAutoInc(index);
    //console.log("Existing autoinc: " + i);
    //console.log("Incoming autoinc: " + value);
    if (myValue > i) {
        //console.log("Incoming > so setting autoInc");
        lsSetObj("autoInc" + index, s);
    }

};

//Storage
var LocalStore = function(successCallback, errorCallback) {
    "use strict";
    this.initializeStorage = function(successCallback, errorCallback) {
        //console.log("Initialize");
        //console.log("bDebug: " + bDebug);
        if (Globals.bDebug === false) {
            Globals.deleteLocalStorage = false;
        }

        if (window.localStorage !== undefined) {
            //console.log("LocalStorage is ACTIVE");
            // Yes! localStorage and sessionStorage support!
            if (Globals.deleteLocalStorage === true) {
                //console.log("Clearing all storage");
                //window.localStorage.clear();
                var r = confirm("Really delete all data (users, passwords, settings)?");
                if (r === true) {
                    window.localStorage.clear();
                } else {
                    //console.log("Cancelled");
                }
            }
            //console.log("Success callback: ");
            successCallback(true);
        } else {
            // Sorry! No web storage support..
            //console.log("LocalStorage is ....INACTIVE");
            errorCallback("No web storage support");
        }
    };

    this.forceAutoInc = function(index, value) {
        lsSetAutoInc(index, value);
    };

    this.addSetting = function(mySetting, callback) {
        lsSetObj("setting" + mySetting.settingName, mySetting, "Settings");
    };

    this.addCloud = function(myCloud, callback) {
        //console.log("AddCloud");
        lsSetObj("cloud" + myCloud.cloudId, myCloud, "CloudQueue");
        callback(true);
    };

    this.addCloudAutoInc = function(cloudId) {
        //console.log("Set Auto Inc To: " + cloudId);
        lsSetAutoInc("CloudQueue", cloudId);
    };

    this.addCloudBlob = function(myCloudBlob, callback) {

        //console.log("addCloudBlob");
        //console.log(myCloudBlob);
        //lsSetAutoInc("CloudBlob", myCloudBlob.id);
        lsSetObj("cloudBlob" + myCloudBlob.localId, myCloudBlob, "CloudBlob");
        callback(true);
    };

    this.addAward = function(myAward, callback) {
        lsSetObj("award" + myAward.id, myAward, "Awards");
        callback(true);
    };

    this.addAwardEarned = function(awardEarned, callback) {
        //console.log("Adding award");
        //console.log(awardEarned);
        lsSetObj("awardEarned" + awardEarned.earnedId, awardEarned, "AwardsEarned");
        callback(true);
    };

    this.addGame = function(game, callback) {
        //console.log("Add Game " + game.id);
        //console.log(game);
        lsSetObj("game" + game.id, game, "Games");
        callback(true);
    };

    this.addOldGame = function(game, callback) {
        lsSetObj("oldgame" + game.id, game, "OldGames");
        callback(true);
    };

    this.addPlayer = function(player, callback) { //TODO add cloud ID
        //console.log("Add Player");
        //console.log(player);
        //lsRemove("player" + player.id, "Players");
        lsSetObj("player" + player.id, player, "Players");
        callback(true);
    };

    this.addFaction = function(faction, callback) {
        lsSetObj("faction" + faction.id, faction, "Factions");
        callback(true);
    };

    this.addTeam = function(team, callback) {
        lsSetObj("team" + team.name, team, "Teams");
        callback(true);
    };

    this.addLocation = function(location, callback) {
        lsSetObj("location" + location.name, location, "Locations");
        callback(true);
    };

    this.addPaused = function(details, callback) {
        lsSetObj("paused" + details.id, details, "Paused");
        callback(true);
    };

    this.addScore = function(score, callback) {
        //console.log("Adding score: ");
        //console.log(score);
        lsSetObj("score" + score.scoreId, score, "Scores");
        callback(true);
    };

    this.addSession = function(session, callback) {
        //console.log("Saving session: " + session.sessionId);
        lsSetObj("session" + session.sessionId, session, "Sessions");
        //console.log("after setObj");
        callback(true);
    };

    this.deletePlayerById = function(player_id, callback) {
        var p = lsGetObj("player" + player_id);
        if (p !== null) {
            p.hidden = true;
            lsSetObj("player" + player_id, p, "Players");
        }
        callback(true);
    };

    this.hidePlayerById = function(player_id, callback) {
        var p = lsGetObj("player" + player_id);
        if (p !== null) {
            p.hideOnDevice = true;
            lsSetObj("player" + player_id, p, "Players");
        }

        callback(true);
    };


    this.deleteGameById = function(game_id, callback) {
        var g = lsGetObj("game" + game_id);
        if (g !== null) {
            g.hidden = true;
            lsSetObj("game" + game_id, g, "Games");
        }
        callback(true);
    };



    this.deletePausedById = function(details_id, callback) {
        var paused = [];
        var i;
        var l;

        paused = lsGetAllIndexItems("Paused");

        l = paused.length;
        for (i = 0; i < l; i++) {
            if (paused[i].id === details_id) {
                lsRemove("paused" + details_id, "Paused");
            }
        }
        callback(true);
    };

    this.deleteGameByIdForever = function(game_id, callback) {
        //console.log("delete history by id: " + session_id);

        var games = [];
        var i;
        var l;

        games = lsGetAllIndexItems("Games");

        l = games.length;
        for (i = 0; i < l; i++) {
            //console.log(sessions[i].sessionId + "==" + session_id);
            if (games[i].id == game_id) {
                //console.log("Removed " + session_id);
                lsRemove("game" + game_id, "Games");
            }
        }
        callback(true);
    };

    this.deleteSessionBySessionId = function(session_id, callback) {
        //console.log("delete history by id: " + session_id);

        var sessions = [];
        var i;
        var l;

        sessions = lsGetAllIndexItems("Sessions");

        l = sessions.length;
        for (i = 0; i < l; i++) {
            //console.log(sessions[i].sessionId + "==" + session_id);
            if (sessions[i].sessionId == session_id) {
                //console.log("Removed " + session_id);
                lsRemove("session" + session_id, "Sessions");
            }
        }
        callback(true);
    };

    this.deleteAwardsEarnedBySessionId = function(session_id, callback) {
        //console.log("delete award by id: " + session_id);
        var awardsEarned = [];
        var i;
        var l;

        awardsEarned = lsGetAllIndexItems("AwardsEarned");

        l = awardsEarned.length;
        for (i = 0; i < l; i++) {
            //console.log(awardsEarned[i].sessionId + "==" + session_id);
            if (awardsEarned[i].sessionId == session_id) {
                //console.log("removed award");
                //console.log(awardsEarned[i]);
                lsRemove("awardEarned" + awardsEarned[i].earnedId, "AwardsEarned");
            }
        }
        callback(true);
    };

    this.deleteScoresBySessionId = function(session_id, callback) {
        //console.log("delete scores by id: " + session_id);
        var scores = [];
        var i;
        var l;

        scores = lsGetAllIndexItems("Scores");

        l = scores.length;
        for (i = 0; i < l; i++) {
            //console.log(scores[i].sessionId + "==" + session_id);
            if (scores[i].sessionId == session_id) {
                //console.log("Deleted score ");
                //console.log(scores[i]);
                lsRemove("score" + scores[i].scoreId, "Scores");
            }
        }
        callback(true);
    };

    this.findAllSessions = function(callback) {

        var sessions = [];
        sessions = lsGetAllIndexItems("Sessions");
        callback(sessions);
    };
    
    this.findAllCloudBlobs = function(callback) {
      var blobs = [];
      blobs = lsGetAllIndexItems("CloudBlob");
      callback(blobs);  
    };

    this.findAllOldGames = function(callback) {
        var oldGames = [];
        oldGames = lsGetAllIndexItems("OldGames");
        callback(oldGames);
    };

    this.findAllScores = function(callback) {

        var scores = [];
        scores = lsGetAllIndexItems("Scores");
        callback(scores);
    };


    this.findSessionById = function(session_id, callback) {
        var session = lsGetObj("session" + session_id);
        callback(session);
    };

    this.findAwardsBySession = function(session_id, callback) {
        var awardsEarned = [];
        awardsEarned = lsGetAllIndexItems("AwardsEarned");
        //console.log("Find awards by session");
        //console.log(awardsEarned);
        var l = awardsEarned.length;
        for (var i = 0; i < l; i++) {
            //console.log(awardsEarned[i].sessionId + " = " + session_id);
            if (awardsEarned[i].sessionId != session_id) {
                //console.log("splice");
                awardsEarned.splice(i, 1);
                i -= 1;
                l -= 1;
            }
        }
        //console.log("After:");
        //console.log(awardsEarned);
        callback(awardsEarned);
    };

    this.findScoresBySession = function(session_id, callback) {
        //console.log("find scores by session id: " + session_id);
        var scores = [];
        var l;
        scores = lsGetAllIndexItems("Scores");
        //console.log("found " + scores.length + " total scores");
        //console.log(scores);
        l = scores.length;
        for (var i = 0; i < l; i++) {
            //console.log("id1:" + scores[i].sessionId + " id2: " + session_id);
            if (scores[i].sessionId != session_id) {
                //console.log("removing score");
                scores.splice(i, 1);
                i -= 1;
                l -= 1;
            }
        }
        //console.log("found " + scores.length + " session scores");
        //console.log(scores);
        callback(scores);
    };

    this.findAllAwardsEarned = function(callback) {
        var awards = [];
        awards = lsGetAllIndexItems("AwardsEarned");
        callback(awards);
    };

    this.findAllAwards = function(callback) {
        var awards = [];
        awards = lsGetAllIndexItems("Awards");
        callback(awards);
    };

    this.findAllGames = function(bHidden, callback) {
        var games = [];
        games = lsGetAllIndexItems("Games");
        if (bHidden === false) {
            var i;
            var l;
            l = games.length;
            for (i = 0; i < l; i++) {
                if (games[i].hidden === true) {
                    games.splice(i, 1);
                    i--;
                    l--;
                }
            }
        }
        callback(games);
    };

    this.findAllPaused = function(callback) {
        var details = [];
        details = lsGetAllIndexItems("Paused");
        //console.log(details);
        callback(details);
    };

    this.findAllTeams = function(callback) {
        var teams = [];
        teams = lsGetAllIndexItems("Teams");
        callback(teams);
    };

    this.findAllLocations = function(callback) {
        var locations = [];
        locations = lsGetAllIndexItems("Locations");
        callback(locations);
    };

    this.findAllFactions = function(callback) {
        var factions = [];
        factions = lsGetAllIndexItems("Factions");
        callback(factions);
    };

    this.findAllPlayers = function(bHidden, bHiddenOnDevice, callback) {
        //console.log("FindAllPlayers, hiddenOnDevice: " + bHiddenOnDevice);
        var players = [];
        var i;
        var l;
        app.currPlayersHidden = [];
        players = lsGetAllIndexItems("Players");
        l = players.length;

        if (bHidden === false) {
            for (i = 0; i < l; i++) {
                if (players[i].hidden === true) {
                    players.splice(i, 1);
                    i--;
                    l--;
                }
            }
        }
        l = players.length;
        if (bHiddenOnDevice === false) {
            for (i = 0; i < l; i++) {
                if (players[i].hiddenOnDevice === true) {
                    app.currPlayersHidden.push(players[i]);
                    players.splice(i, 1);
                    i--;
                    l--;
                }
            }
        }

        //console.log(players);
        callback(players);
    };

    this.findGamesByName = function(name, bHidden, callback) {
        var games = [];
        var s;
        var i;
        var l;
        name = name.toLowerCase();
        games = lsGetAllIndexItems("Games");
        l = games.length;
        for (i = 0; i < l; i++) {
            s = games[i].name.toLowerCase();
            if (s.indexOf(name) === -1) {
                games.splice(i, 1);
                i--;
                l--;
            }
        }
        if (bHidden === false) {
            l = games.length;
            for (i = 0; i < l; i++) {
                if (games[i].hidden === true) {
                    games.splice(i, 1);
                    i--;
                    l--;
                }
            }

        }
        callback(games);
    };

    this.findGameById = function(id, callback) {
        //console.log(id);
        var game;
        game = lsGetObj("game" + id);
        callback(game);
    };

    this.findOldGameById = function(id, callback) {
        //console.log("findOldGame: " + id);
        var game;
        game = lsGetObj("oldgame" + id);
        //console.log("Found: ");
        //console.log(game);
        callback(game);
    };

    this.findOldGamesByName = function(name, callback) {
        //console.log("findOldGameByName: " + name);
        var games;
        var i;
        var l;
        var s;
        name = name.toLowerCase();
        games = lsGetAllIndexItems("OldGames");
        if (name !== "") {
            l = games.length;
            for (i = 0; i < l; i++) {
                s = games[i].name.toLowerCase();
                if (s.indexOf(name) === -1) {
                    games.splice(i, 1);
                    i--;
                    l--;
                }
            }
        }
        games.sort(dynamicSort("name"));
        callback(games);
    };

    this.findPlayerByName = function(name, bHidden, bHiddenOnDevice, callback) {
        var players = [];
        var s;
        var i;
        var l;
        players = lsGetAllIndexItems("Players");
        l = players.length;
        for (i = 0; i < l; i++) {
            s = players[i].name;
            if (s.indexOf(name) === -1) {
                players.splice(i, 1);
                i--;
                l--;
            }
        }
        l = players.length;
        if (bHidden === false) {
            for (i = 0; i < l; i++) {
                if (players[i].hidden === true) {
                    players.splice(i, 1);
                    i--;
                    l--;
                }
            }
        }
        l = players.length;
        if (bHiddenOnDevice === false) {
            for (i = 0; i < l; i++) {
                if (players[i].hiddenOnDevice === true) {
                    players.splice(i, 1);
                    i--;
                    l--;
                }
            }
        }
        callback(players);
    };

    this.findPlayerById = function(id, callback) {
        //console.log("Find player by id: " + id);
        var player = lsGetObj("player" + id);
        callback(player);
    };

    this.updatePlayerPhoto = function(player_id, player_icon) {
        var p = lsGetObj("player" + player_id);
        p.icon = player_icon;
        p.iconURL = "BLOB";
        lsSetObj("player" + player_id, p, "Players");
        //console.log("Update player photo");
    };



    this.updateSessionPhoto = function(session_id, game_photo, callback) {
        //console.log("Update Session Photo: " + session_id);
        //console.log(game_photo);
        var s = lsGetObj("session" + session_id);
        if (s !== undefined && s !== null) {
            s.sessionPhoto = game_photo;
            //console.log(s);
            lsSetObj("session" + session_id, s, "Sessions");
        }
        if (callback) {
            callback();
        }
    };



    this.updateGameIcon = function(game_id, game_icon) {
        var g = lsGetObj("game" + game_id);
        if (g !== undefined) {
            g.icon = game_icon;
            lsSetObj("game" + game_id, g, "Games");
        }
    };


    this.saveCloudQueue = function(cloudData, cloudDataId, cloudIdRemote, cloudBlob, callback) {
        //console.log("Save Cloud Queue");
        var id = lsGetAutoInc("CloudQueue");
        //console.log(cloudData);
        //console.log("new id: " + id);
        //console.log("saveCloudQueue user: " + Globals.mUsername);
        if (cloudDataId === undefined || cloudDataId == "undefined" || cloudDataId === null) {
            cloudDataId = "";
        }
        if (cloudBlob === undefined || cloudBlob == "undefined" || cloudBlob === null) {
            cloudBlob = "";
        }
        if (cloudIdRemote === undefined || cloudIdRemote == "undefined" || cloudIdRemote === null) {
            cloudIdRemote = 0;
        }
        var cloudHasBlob;
        if (cloudBlob === "" || cloudBlob === false || cloudBlob === undefined) {
            //console.log("No BLOB: " + cloudBlob);
            cloudHasBlob = 0;
        } else {
            cloudHasBlob = -1;
        }
        //console.log("CLOUDHASBLOB: " + cloudHasBlob);
        var cloudIsBlob = 0;
        //function Cloud(cloudId, user, Globals.appId, cloudIdRemote, cloudIdLocal, cloudData, username, password, encoding, cloudDataId, cloudHasBlob) {
        var c = new Cloud(id, Globals.mUsername, Globals.appId, cloudIdRemote, id, cloudData, "", "", false, cloudDataId, cloudHasBlob, cloudIsBlob, 1, 1);
        //console.log("Queueing:");
        //console.log(c);
        lsSetObj("cloud" + id, c, "CloudQueue");
        //console.log("after set obj");
        if (callback) {
            //console.log("calling back");
            callback(id);
        } else {
            //console.log("callback null");
        }
        //console.log("WTF?");

    };

    this.saveCloudQueueBlob = function(cloudData, cloudIdRemote, cloudPieceId, cloudIdLocal, maxParts, callback) {
        //console.log("Save Cloud Queue Blob ");
        //console.log("Remote: " + cloudIdRemote + " Local: " + cloudIdLocal + " cloudPieceId: " + cloudPieceId + " maxParts: " + maxParts);
        var id = lsGetAutoInc("CloudQueue");
        //console.log("New Cloud ID: " + id);
        var cloudHasBlob = 0;
        var cloudIsBlob = -1;
        var cloudPlusOne = cloudPieceId + 1;
        //function Cloud(cloudId, user, Globals.appId, cloudIdRemote, cloudIdLocal, cloudData, username, password, encoding, cloudDataId, cloudHasBlob, cloudIsBlob, dataPart, dataTotal) {

        var c = new Cloud(id, Globals.mUsername, Globals.appId, cloudIdRemote, cloudIdLocal, cloudData, "", "", false, "", cloudHasBlob, cloudIsBlob, cloudPieceId, maxParts);
        //console.log("Queue From Blob:");
        //console.log(c);
        lsSetObj("cloud" + id, c, "CloudQueue");

        // if (cloudPlusOne == maxParts) {
        // this.deleteCloudBlobById(cloudIdLocal, function() {
        // //console.log("Deleted Blob");
        // callback();
        // });
        // } else {
        //console.log("Queued blob part");
        callback();
        //}
    };

    this.saveCloudBlob = function(blobLocalId, blobData, callback) {
        //console.log("Save Cloud Blob");
        //var id = lsGetAutoInc("CloudBlob");
        if (blobData !== undefined) {
            var id = "cloudBlob" + blobLocalId;
            var c = new CloudBlob(id, blobData, Globals.mUsername, blobLocalId);
            //console.log(c);
            lsSetObj(id, c, "CloudBlob");
        }
        callback();
    };

    this.saveCloudHist = function(cloudIdLocalOrRemote, username, cloudUsername, histType, callback) {
        //console.log("Save Cloud Hist: " + cloudIdLocalOrRemote + " " + username + " " + cloudUsername + " " + histType);
        var i = parseInt(cloudIdLocalOrRemote, 10);
        var cloudHist = new CloudHist(i, cloudUsername);
        var id;
        switch (histType) {
            case "get":
                id = "cloudHistGet" + username + cloudUsername + cloudHist.cloudId;
                //console.log("HIST GET ID: " + id);
                lsSetObj(id, cloudHist, "CloudHistGet");
                break;
            case "push":
                id = "cloudHistPush" + username + cloudUsername + cloudHist.cloudId;
                //console.log("HIST PUSH ID: " + id);
                lsSetObj(id, cloudHist, "CloudHistPush");
                break;
        }
        callback(true);
    };

    this.findCloudHist = function(cloudIdLocalOrRemote, username, cloudUsername, histType, callback) {
        //console.log("Find Cloud Hist: " + histType + " " + cloudIdLocalOrRemote);
        var id;
        switch (histType) {
            case "get":
                id = "cloudHistGet" + username + cloudUsername + cloudIdLocalOrRemote;
                break;
            case "push":
                id = "cloudHistPush" + username + cloudUsername + cloudIdLocalOrRemote;
                break;
        }
        //console.log("Find cloud hist id: " + id);
        var cloudHist = lsGetObj(id);
        //console.log("Find cloud hist: " + cloudHist);
        if (callback) {
            callback(cloudHist);
        } else {
            return cloudHist;
        }
    };

    this.findNextCloud = function(username, cloudUsername, cloudType, callback) {
        //console.log("findNextCloud: " + cloudType + username + cloudUsername);
        var i;
        var clouds;
        var cloudRet = null;
        var l;
        var pct = 0;
        var myHist = null;
        switch (cloudType) {
            case "push":
                clouds = lsGetAllIndexItems("CloudQueue");
                //console.log("clouds:" + clouds.length);
                l = clouds.length;

                for (i = 0; i < l; i++) {
                    myHist = CloudAll.findHistNoCallback(clouds[i].cloudId, username, cloudUsername, "push");
                    //console.log(myHist);
                    if (myHist === null) {
                        cloudRet = clouds[i];
                        //console.log("FOUND NEXT CLOUD PUSH: " + cloudRet.cloudId);
                        //console.log(cloudRet.cloudData);
                        break;
                    }
                }
                pct = l - i;
                //console.log("pct: " + pct);
                break;
            case "get":
                clouds = lsGetAllIndexItems("CloudHistGet");
                l = clouds.length;
                for (i = 0; i < l; i++) {
                    if (clouds[i].cloudUsername != cloudUsername) {
                        clouds.splice(i, 1);
                        i--;
                        l--;
                    }
                }
                clouds.sort(dynamicSort("-cloudId"));
                //console.log("Clouds sorted with highest number at top");
                //console.log(clouds);
                l = clouds.length;
                if (l > 0) {
                    cloudRet = clouds[0];
                } else {
                    cloudRet = new CloudHist(0, cloudUsername);
                }
                break;
        }
        //console.log(cloudRet);
        callback(cloudRet, pct);
    };

    this.deleteCloudById = function(myCloud, callback) {
        //console.log("Delete cloud by id");
        //console.log(myCloud);
        if (myCloud.cloudId !== undefined) {
            //console.log('deleteCloudById: cloud' + myCloud.cloudId);
            lsRemove("cloud" + myCloud.cloudId, "CloudQueue");
        }
        callback();
    };

    this.deleteCloudBlobById = function(cloudBlobId, callback) {
        //console.log("Delete cloud blob by id " + cloudBlobId);
        if (cloudBlobId !== undefined) {
            //console.log('deleteCloudBlobById: ' + cloudBlobId);
            lsRemove(cloudBlobId, "CloudBlob");
        }
        callback();
    };

    this.findBlobById = function(localId, callback) {
        //console.log("Find blob by localId: " + localId);
        // var blobs;
        // var myBlob=null;
        // blobs=lsGetAllIndexItems("CloudBlob");
        // for (var i=0;i<blobs.length;i++){
        // if (blobs[i].localId == localId) {
        // myBlob = blobs[i];
        // break;
        // }
        // }
        // callback(myBlob);
        var id = "cloudBlob" + localId;
        var myBlob = lsGetObj(id);
        //console.log("found:");
        //console.log(myBlob);
        callback(myBlob);
    };

    this.saveSetting = function(settingName, settingValue, callback) {
        //console.log("savsetting: " + settingName + " " + settingValue);
        var s = new Setting(settingName, settingValue, Globals.mUsername);
        lsSetObj("setting" + settingName, s, "Settings");
        if (callback !== undefined) {
            callback();
        }
    };

    this.getSetting = function(settingName, settingDefault, callback) {
        //console.log("getsetting: " + settingName);
        var s = lsGetObj("setting" + settingName);
        if (s !== null && s !== undefined) {
            //console.log("Value: " + s.settingValue);
            callback(s.settingValue);
        } else {
            //console.log("Default: " + settingDefault);
            callback(settingDefault);
        }
    };

    this.addOldGameData = function(callback) {
        var games = [{
                "game_bggid": "822",
                "game_id": "Carcassonne",
                "game_name": "Carcassonne",
                "game_icon": "img/games/BoxCarcassonne.jpg"
            }, {
                "game_bggid": "171",
                "game_id": "Chess",
                "game_name": "Chess",
                "game_icon": "img/games/BoxChess.jpg"
            }, {
                "game_bggid": "18602",
                "game_id": "Caylus",
                "game_name": "Caylus",
                "game_icon": "img/games/BoxCaylus.jpg"
            }, {
                "game_bggid": "3076",
                "game_id": "PuertoRico",
                "game_name": "Puerto Rico",
                "game_icon": "img/games/BoxPuertoRico.jpg"
            }, {
                "game_bggid": "13",
                "game_id": "TheSettlersofCatan",
                "game_name": "The Settlers of Catan",
                "game_icon": "img/games/BoxTheSettlersOfCatan.jpg"
            }, {
                "game_bggid": "2453",
                "game_id": "Blokus",
                "game_name": "Blokus",
                "game_icon": "img/games/BoxBlokus.jpg"
            }, {
                "game_bggid": "68448",
                "game_id": "7Wonders",
                "game_name": "7 Wonders",
                "game_icon": "img/games/Box7Wonders.jpg"
            }, {
                "game_bggid": "6472",
                "game_id": "AGameofThronesFirstEdition",
                "game_name": "A Game of Thrones (first edition)",
                "game_icon": "img/games/BoxAGameOfThrones.jpg"
            }, {
                "game_bggid": "31260",
                "game_id": "Agricola",
                "game_name": "Agricola",
                "game_icon": "img/games/BoxAgricola.jpg"
            }, {
                "game_bggid": "43018",
                "game_id": "AgricolaFarmersoftheMoor",
                "game_name": "Agricola, Farmers of the Moor",
                "game_icon": "img/games/BoxAgricolaFarmersOfTheMoor.jpg"
            }, {
                "game_bggid": "15987",
                "game_id": "ArkhamHorror",
                "game_name": "Arkham Horror",
                "game_icon": "img/games/BoxArkhamHorror.jpg"
            }, {
                "game_bggid": "27225",
                "game_id": "Bananagrams",
                "game_name": "Bananagrams",
                "game_icon": "img/games/BoxBananagrams.jpg"
            }, {
                "game_bggid": "2425",
                "game_id": "Battleship",
                "game_name": "Battleship",
                "game_icon": "img/games/BoxBattleship.jpg"
            }, {
                "game_bggid": "37111",
                "game_id": "BattlestarGalactica",
                "game_name": "Battlestar Galactica",
                "game_icon": "img/games/BoxBattlestarGalactica.jpg"
            }, {
                "game_bggid": "1293",
                "game_id": "Boggle",
                "game_name": "Boggle",
                "game_icon": "img/games/BoxBoggle.jpg"
            }, {
                "game_bggid": "28720",
                "game_id": "Brass",
                "game_name": "Brass",
                "game_icon": "img/games/BoxBrass.jpg"
            }, {
                "game_bggid": "5048",
                "game_id": "CandyLand",
                "game_name": "Candy Land",
                "game_icon": "img/games/BoxCandyLand.jpg"
            }, {
                "game_bggid": "2083",
                "game_id": "Checkers",
                "game_name": "Checkers",
                "game_icon": "img/games/BoxCheckers.jpg"
            }, {
                "game_bggid": "1294",
                "game_id": "Clue",
                "game_name": "Clue",
                "game_icon": "img/games/BoxClue.jpg"
            }, {
                "game_bggid": "39856",
                "game_id": "Dixit",
                "game_name": "Dixit",
                "game_icon": "img/games/BoxDixit.jpg"
            }, {
                "game_bggid": "62219",
                "game_id": "DominantSpecies",
                "game_name": "Dominant Species",
                "game_icon": "img/games/BoxDominantSpecies.jpg"
            }, {
                "game_bggid": "36218",
                "game_id": "Dominion",
                "game_name": "Dominion",
                "game_icon": "img/games/BoxDominion.jpg"
            }, {
                "game_bggid": "40834",
                "game_id": "DominionIntrigue",
                "game_name": "Dominion: Intrigue",
                "game_icon": "img/games/BoxDominionIntrigue.jpg"
            }, {
                "game_bggid": "72125",
                "game_id": "Eclipse",
                "game_name": "Eclipse",
                "game_icon": "img/games/BoxEclipse.jpg"
            }, {
                "game_bggid": "93",
                "game_id": "ElGrande",
                "game_name": "El Grande",
                "game_icon": "img/games/BoxElGrande.jpg"
            }, {
                "game_bggid": "9216",
                "game_id": "Goa",
                "game_name": "Goa",
                "game_icon": "img/games/BoxGoa.jpg"
            }, {
                "game_bggid": "30381",
                "game_id": "Hamburgum",
                "game_name": "Hamburgum",
                "game_icon": "img/games/BoxHamburgum.jpg"
            }, {
                "game_bggid": "35677",
                "game_id": "LeHavre",
                "game_name": "Le Havre",
                "game_icon": "img/games/BoxLeHavre.jpg"
            }, {
                "game_bggid": "96848",
                "game_id": "MageKnight",
                "game_name": "Mage Knight",
                "game_icon": "img/games/BoxMageKnight.jpg"
            }, {
                "game_bggid": "1406",
                "game_id": "Monopoly",
                "game_name": "Monopoly",
                "game_icon": "img/games/BoxMonopoly.jpg"
            }, {
                "game_bggid": "3737",
                "game_id": "Operation",
                "game_name": "Operation",
                "game_icon": "img/games/BoxOperation.jpg"
            }, {
                "game_bggid": "70149",
                "game_id": "OraEtLabora",
                "game_name": "Ora Et Labora",
                "game_icon": "img/games/BoxOraEtLabora.jpg"
            }, {
                "game_bggid": "2651",
                "game_id": "PowerGrid",
                "game_name": "Power Grid",
                "game_icon": "img/games/BoxPowerGrid.jpg"
            }, {
                "game_bggid": "28143",
                "game_id": "RacefortheGalaxy",
                "game_name": "Race for the Galaxy",
                "game_icon": "img/games/BoxRaceForTheGalaxy.jpg"
            }, {
                "game_bggid": "12962",
                "game_id": "ReefEncounter",
                "game_name": "Reef Encounter",
                "game_icon": "img/games/BoxReefEncounter.jpg"
            }, {
                "game_bggid": "181",
                "game_id": "Risk",
                "game_name": "Risk",
                "game_icon": "img/games/BoxRisk.jpg"
            }, {
                "game_bggid": "9217",
                "game_id": "SaintPetersburg",
                "game_name": "Saint Petersburg",
                "game_icon": "img/games/BoxSaintPetersburg.jpg"
            }, {
                "game_bggid": "3",
                "game_id": "Samurai",
                "game_name": "Samurai",
                "game_icon": "img/games/BoxSamurai.jpg"
            }, {
                "game_bggid": "8217",
                "game_id": "SanJuan",
                "game_name": "San Juan",
                "game_icon": "img/games/BoxSanJuan.jpg"
            }, {
                "game_bggid": "320",
                "game_id": "Scrabble",
                "game_name": "Scrabble",
                "game_icon": "img/games/BoxScrabble.jpg"
            }, {
                "game_bggid": "2407",
                "game_id": "Sorry",
                "game_name": "Sorry",
                "game_icon": "img/games/BoxSorry.jpg"
            }, {
                "game_bggid": "2921",
                "game_id": "TheGameofLife",
                "game_name": "Game of Life, The",
                "game_icon": "img/games/BoxTheGameOfLife.jpg"
            }, {
                "game_bggid": "41114",
                "game_id": "TheResistance",
                "game_name": "Resistance, The",
                "game_icon": "img/games/BoxTheResistance.jpg"
            }, {
                "game_bggid": "25613",
                "game_id": "ThroughtheAges",
                "game_name": "Through the Ages",
                "game_icon": "img/games/BoxThroughTheAges.jpg"
            }, {
                "game_bggid": "9209",
                "game_id": "TickettoRide",
                "game_name": "Ticket to Ride",
                "game_icon": "img/games/BoxTicketToRide.jpg"
            }, {
                "game_bggid": "14996",
                "game_id": "TickettoRideEurope",
                "game_name": "Ticket to Ride: Europe",
                "game_icon": "img/games/BoxTicketToRideEurope.jpg"
            }, {
                "game_bggid": "42",
                "game_id": "TigrisandEuphrates",
                "game_name": "Tigris and Euphrates",
                "game_icon": "img/games/BoxTigrisAndEuphrates.jpg"
            }, {
                "game_bggid": "88",
                "game_id": "Torres",
                "game_name": "Torres",
                "game_icon": "img/games/BoxTorres.jpg"
            }, {
                "game_bggid": "2952",
                "game_id": "TrivialPursuit",
                "game_name": "Trivial Pursuit",
                "game_icon": "img/games/BoxTrivialPursuit.jpg"
            }, {
                "game_bggid": "9609",
                "game_id": "WaroftheRingFirstEdition",
                "game_name": "War of the Ring (first edition)",
                "game_icon": "img/games/BoxWarOfTheRing.jpg"
            }, {
                "game_bggid": "12333",
                "game_id": "TwilightStruggle",
                "game_name": "Twilight Struggle",
                "game_icon": "img/games/BoxTwilightStruggle.jpg"
            }, {
                "game_bggid": "30549",
                "game_id": "Pandemic",
                "game_name": "Pandemic",
                "game_icon": "img/games/BoxPandemic.jpg"
            }, //win lose coop
            {
                "game_bggid": "478",
                "game_id": "Citadels",
                "game_name": "Citadels",
                "game_icon": "img/games/BoxCitadels.jpg"
            }, {
                "game_bggid": "40692",
                "game_id": "Smallworld",
                "game_name": "Smallworld",
                "game_icon": "img/games/BoxSmallworld.jpg"
            }, {
                "game_bggid": "50",
                "game_id": "LostCities",
                "game_name": "Lost Cities",
                "game_icon": "img/games/BoxLostCities.jpg"
            }, {
                "game_bggid": "34635",
                "game_id": "StoneAge",
                "game_name": "Stone Age",
                "game_icon": "img/games/BoxStoneAge.jpg"
            }, {
                "game_bggid": "92539",
                "game_id": "7WondersLeaders",
                "game_name": "7 Wonders - Leaders",
                "game_icon": "img/games/Box7WondersLeaders.jpg"
            }, {
                "game_bggid": "111661",
                "game_id": "7WondersCities",
                "game_name": "7 Wonders - Cities",
                "game_icon": "img/games/Box7WondersCities.jpg"
            }, {
                "game_bggid": "115746",
                "game_id": "WaroftheRingSecondEdition",
                "game_name": "War of the Ring (second edition)",
                "game_icon": "img/games/BoxWarOfTheRing2.jpg"
            }, {
                "game_bggid": "31627",
                "game_id": "TickettoRideNordicCountries",
                "game_name": "Ticket to Ride: Nordic Countries",
                "game_icon": "img/games/BoxTicketToRideNordic.jpg"
            }, {
                "game_bggid": "103343",
                "game_id": "AGameofThronesSecondEdition",
                "game_name": "A Game of Thrones (second edition)",
                "game_icon": "img/games/BoxAGameOfThrones2.jpg"
            }, {
                "game_bggid": "105134",
                "game_id": "RiskLegacy",
                "game_name": "Risk Legacy",
                "game_icon": "img/games/BoxRiskLegacy.jpg"
            }
        ];
        var scoreitems = [
            //{"game_id": 1, "game_name": "Carcassonne", "game_icon": "img/games/BoxCarcassonne.jpg"},
            {
                "item_id": 1,
                "game_id": "Carcassonne",
                "sort": 0,
                "scoreitem": "Name=Points|Type=Counter|Value=1|Default=0"
            },
            //{"game_id": 2, "game_name": "Chess", "game_icon": "img/games/BoxChess.jpg"},
            {
                "item_id": 2,
                "game_id": "Chess",
                "sort": 0,
                "scoreitem": "Name=Win/Lose|Type=Toggle"
            },
            //{"item_id": 1, "game_id": 3, "game_name": "Caylus", "game_icon": "img/games/BoxCaylus.jpg"},
            {
                "item_id": 3,
                "game_id": "Caylus",
                "sort": 0,
                "scoreitem": "Name=Game Points|Type=Counter|Value=1|Default=0"
            }, {
                "item_id": 4,
                "game_id": "Caylus",
                "sort": 1,
                "scoreitem": "Name=Total Deniers|Type=Counter|Value=1|Default=0|DivideBy=4"
            }, {
                "item_id": 5,
                "game_id": "Caylus",
                "sort": 2,
                "scoreitem": "Name=Total Non-gold Cubes|Type=Counter|Value=1|Default=0|DivideBy=3"
            }, {
                "item_id": 6,
                "game_id": "Caylus",
                "sort": 3,
                "scoreitem": "Name=Total Gold Cubes|Type=Counter|Value=3|Default=0"
            },
            //{"item_id" 1, "game_id": 4, "game_name": "Puerto Rico", "game_icon": "img/games/BoxPuertoRico.jpg"},
            {
                "item_id": 7,
                "game_id": "PuertoRico",
                "sort": 0,
                "scoreitem": "Name=VP Chips|Type=Counter|Value=1|Default=0"
            }, {
                "item_id": 8,
                "game_id": "PuertoRico",
                "sort": 1,
                "scoreitem": "Name=Buiding Points|Type=Counter|Value=1|Default=0"
            }, {
                "item_id": 9,
                "game_id": "PuertoRico",
                "sort": 2,
                "scoreitem": "Name=Large Building Points|Type=Counter|Value=1|Default=0"
            }, {
                "item_id": 10,
                "game_id": "PuertoRico",
                "sort": 3,
                "scoreitem": "Name=Nobles|Type=Counter|Value=1|Default=0"
            },
            //{"item_id": 1, "game_id": 5, "game_name": "The Settlers of Catan", "game_icon": "img/games/BoxTheSettlersOfCatan.jpg"},
            {
                "item_id": 11,
                "game_id": "TheSettlersofCatan",
                "sort": 0,
                "scoreitem": "Name=Points|Type=Counter|Value=1|Default=0"
            },
            //{"item_id": 1, "game_id": 6, "game_name": "Blokus", "game_icon": "img/games/BoxBlokus.jpg"},
            {
                "item_id": 12,
                "game_id": "Blokus",
                "sort": 0,
                "scoreitem": "Name=Unplayed blocks|Type=Counter|Value=-1|Default=0"
            }, {
                "item_id": 13,
                "game_id": "Blokus",
                "sort": 1,
                "scoreitem": "Name=Bonus Points|Type=Combo|Values=Some pieces remain^0,All pieces played^15,All pieces played and last piece monimo^20|"
            },
            //{"item_id": 1, "game_id": 8, "game_name": "7 Wonders", "game_icon": "img/games/BoxPowerGrid.jpg"},
            {
                "item_id": 14,
                "game_id": "7Wonders",
                "sort": 0,
                "scoreitem": "Name=Military (Red) Points|Type=Counter|Value=1|Default=0;Name=Total Coins|Type=Counter|DivideBy=3|Value=1|Default=0;Name=Wonder Points|Type=Counter|Value=1|Default=0;Name=Civilian (Blue) Points|Type=Counter|Value=1|Default=0;Name=Commercial (Yellow) Points|Type=Counter|Value=1|Default=0;Name=Science (Green) - Tablet Count|Type=Counter|Value=1|Default=0|NoTally=True|SaveVar=A;Name=Science (Green) - Compass Count|Type=Counter|Value=1|Default=0|NoTally=True|SaveVar=B;Name=Science (Green) - Gear Count|Type=Counter|Value=1|Default=0|NoTally=True|SaveVar=C;Name=Science Tablets Points|Type=Math|Value=Square|Values=A;Name=Science Compass Points|Type=Math|Value=Square|Values=B;Name=Science Gear Points|Type=Math|Value=Square|Values=C;Name=Science Set Count|Type=Math|Value=Smallest|Values=A,B,C|SaveVar=D|NoTally=True;Name=Science Set Points|Type=Math|Value=Multiply|Values=D,7;Name=Guild (Purple) Points|Type=Counter|Value=1|Default=0;Name=Count total coins and science cards, not points gained for those items|Type=Footnote"
            },
            //{"item_id": 23, "game_id": 8, "sort": 9, "scoreitem": "Name=Leader (White) Points|Type=Counter|Value=1|Default=0"},
            //{"item_id": 1, "game_id": 9, "game_name": "A Game of Thrones", "game_icon": "img/games/BoxPowerGrid.jpg"},
            {
                "item_id": 24,
                "game_id": "AGameofThronesFirstEdition",
                "sort": 0,
                "scoreitem": "Name=Areas Controlled|Type=Counter|Value=1|Default=0"
            },
            //{"item_id": 1, "game_id": "Agricola", "game_name": "Agricola", "game_icon": "img/games/BoxPowerGrid.jpg"},
            {
                "item_id": 25,
                "game_id": "Agricola",
                "sort": 0,
                "scoreitem": "Name=Fields|Type=Combo|Values=0-1^-1,2^1,3^2,4^3,5+^4|"
            }, {
                "item_id": 26,
                "game_id": "Agricola",
                "sort": 1,
                "scoreitem": "Name=Pastures|Type=Combo|Values=0^-1,1^1,2^2,3^3,4+^4|"
            }, {
                "item_id": 27,
                "game_id": "Agricola",
                "sort": 2,
                "scoreitem": "Name=Grain*|Type=Combo|Values=0^-1,1-3^1,4-5^2,6-7^3,8+^4|"
            }, {
                "item_id": 28,
                "game_id": "Agricola",
                "sort": 3,
                "scoreitem": "Name=Vegetables*|Type=Combo|Values=0^-1,1^1,2^2,3^3,4+^4|"
            }, {
                "item_id": 29,
                "game_id": "Agricola",
                "sort": 4,
                "scoreitem": "Name=Sheep|Type=Combo|Values=0^-1,1-3^1,4-5^2,6-7^3,8+^4|"
            }, {
                "item_id": 30,
                "game_id": "Agricola",
                "sort": 5,
                "scoreitem": "Name=Wild Boar|Type=Combo|Values=0^-1,1-2^1,3-4^2,5-6^3,7+^4|"
            }, {
                "item_id": 31,
                "game_id": "Agricola",
                "sort": 6,
                "scoreitem": "Name=Cattle|Type=Combo|Values=0^-1,1^1,2-3^2,4-5^3,6+^4|"
            }, {
                "item_id": 32,
                "game_id": "Agricola",
                "sort": 7,
                "scoreitem": "Name=Unused space in the farmyard|Type=Counter|Value=-1|Default=0"
            }, {
                "item_id": 33,
                "game_id": "Agricola",
                "sort": 8,
                "scoreitem": "Name=Fenced stables|Type=Counter|Value=1|Default=0"
            }, {
                "item_id": 34,
                "game_id": "Agricola",
                "sort": 9,
                "scoreitem": "Name=Clay hut rooms|Type=Counter|Value=1|Default=0"
            }, {
                "item_id": 35,
                "game_id": "Agricola",
                "sort": 10,
                "scoreitem": "Name=Stone house room|Type=Counter|Value=2|Default=0"
            }, {
                "item_id": 36,
                "game_id": "Agricola",
                "sort": 11,
                "scoreitem": "Name=Family members|Type=Counter|Value=3|Default=2"
            }, {
                "item_id": 37,
                "game_id": "Agricola",
                "sort": 12,
                "scoreitem": "Name=Points for cards|Type=Counter|Value=1|Default=0"
            }, {
                "item_id": 38,
                "game_id": "Agricola",
                "sort": 13,
                "scoreitem": "Name=Bonus points|Type=Counter|Value=1|Default=0"
            }, {
                "item_id": 39,
                "game_id": "Agricola",
                "sort": 14,
                "scoreitem": "Name=*Planted and harvested Grain/Vegetables|Type=Footnote"
            },
            //{"item_id": 1, "game_id": "AgricolaFarmersoftheMoor", "game_name": "Agricola, Farmers of the Moor", "game_icon": "img/games/BoxPowerGrid.jpg"},
            {
                "item_id": 40,
                "game_id": "AgricolaFarmersoftheMoor",
                "sort": 0,
                "scoreitem": "Name=Fields|Type=Combo|Values=0-1^-1,2^1,3^2,4^3,5+^4|"
            }, {
                "item_id": 41,
                "game_id": "AgricolaFarmersoftheMoor",
                "sort": 1,
                "scoreitem": "Name=Pastures|Type=Combo|Values=0^-1,1^1,2^2,3^3,4+^4|"
            }, {
                "item_id": 42,
                "game_id": "AgricolaFarmersoftheMoor",
                "sort": 2,
                "scoreitem": "Name=Grain*|Type=Combo|Values=0^-1,1-3^1,4-5^2,6-7^3,8+^4|"
            }, {
                "item_id": 43,
                "game_id": "AgricolaFarmersoftheMoor",
                "sort": 3,
                "scoreitem": "Name=Vegetables*|Type=Combo|Values=0^-1,1^1,2^2,3^3,4+^4|"
            }, {
                "item_id": 44,
                "game_id": "AgricolaFarmersoftheMoor",
                "sort": 4,
                "scoreitem": "Name=Sheep|Type=Combo|Values=0^-1,1-3^1,4-5^2,6-7^3,8+^4|"
            }, {
                "item_id": 45,
                "game_id": "AgricolaFarmersoftheMoor",
                "sort": 5,
                "scoreitem": "Name=Wild Boar|Type=Combo|Values=0^-1,1-2^1,3-4^2,5-6^3,7+^4|"
            }, {
                "item_id": 46,
                "game_id": "AgricolaFarmersoftheMoor",
                "sort": 6,
                "scoreitem": "Name=Cattle|Type=Combo|Values=0^-1,1^1,2-3^2,4-5^3,6+^4|"
            }, {
                "item_id": 47,
                "game_id": "AgricolaFarmersoftheMoor",
                "sort": 7,
                "scoreitem": "Name=Horses|Type=Counter|Value=1|Default=0|"
            }, {
                "item_id": 48,
                "game_id": "AgricolaFarmersoftheMoor",
                "sort": 8,
                "scoreitem": "Name=Unused space in the farmyard|Type=Counter|Value=-1|Default=0"
            }, {
                "item_id": 49,
                "game_id": "AgricolaFarmersoftheMoor",
                "sort": 9,
                "scoreitem": "Name=Fenced stables|Type=Counter|Value=1|Default=0"
            }, {
                "item_id": 50,
                "game_id": "AgricolaFarmersoftheMoor",
                "sort": 10,
                "scoreitem": "Name=Clay hut rooms|Type=Counter|Value=1|Default=0"
            }, {
                "item_id": 51,
                "game_id": "AgricolaFarmersoftheMoor",
                "sort": 11,
                "scoreitem": "Name=Stone house room|Type=Counter|Value=2|Default=0"
            }, {
                "item_id": 52,
                "game_id": "AgricolaFarmersoftheMoor",
                "sort": 12,
                "scoreitem": "Name=Healthy family members|Type=Counter|Value=3|Default=2"
            }, {
                "item_id": 53,
                "game_id": "AgricolaFarmersoftheMoor",
                "sort": 13,
                "scoreitem": "Name=Sick family members|Type=Counter|Value=1|Default=0"
            }, {
                "item_id": 54,
                "game_id": "AgricolaFarmersoftheMoor",
                "sort": 14,
                "scoreitem": "Name=Points for cards|Type=Counter|Value=1|Default=0"
            }, {
                "item_id": 55,
                "game_id": "AgricolaFarmersoftheMoor",
                "sort": 15,
                "scoreitem": "Name=Bonus points|Type=Counter|Value=1|Default=0"
            }, {
                "item_id": 56,
                "game_id": "AgricolaFarmersoftheMoor",
                "sort": 16,
                "scoreitem": "Name=*Planted and harvested Grain/Vegetables|Type=Footnote"
            },
            //{"item_id": 1, "game_id": "ArkhamHorror", "game_name": "Arkham Horror", "game_icon": "img/games/BoxPowerGrid.jpg"},
            {
                "item_id": 57,
                "game_id": "ArkhamHorror",
                "sort": 0,
                "scoreitem": "Coop=True|"
            }, {
                "item_id": 58,
                "game_id": "ArkhamHorror",
                "sort": 0,
                "scoreitem": "Name=Win/Lose*|Type=Toggle|"
            }, {
                "item_id": 59,
                "game_id": "ArkhamHorror",
                "sort": 3,
                "scoreitem": "Name=Highest Number on Doom Track|Type=Counter|Value=1|Default=0|Coop=True|"
            }, {
                "item_id": 60,
                "game_id": "ArkhamHorror",
                "sort": 1,
                "scoreitem": "Name=Unpaid/Defaulted Bank Loans|Type=Counter|Value=-1|"
            }, {
                "item_id": 61,
                "game_id": "ArkhamHorror",
                "sort": 2,
                "scoreitem": "Name=Elder Signs Played|Type=Counter|Value=-1|"
            }, {
                "item_id": 62,
                "game_id": "ArkhamHorror",
                "sort": 3,
                "scoreitem": "Name=Gate Trophies|Type=Counter|Value=1|Default=0|"
            }, {
                "item_id": 63,
                "game_id": "ArkhamHorror",
                "sort": 4,
                "scoreitem": "Name=Monster Trophies|Type=Counter|Value=1|"
            }, {
                "item_id": 64,
                "game_id": "ArkhamHorror",
                "sort": 5,
                "scoreitem": "Name=Sane, Surviving Investigator|Type=Counter|Value=1|"
            }, {
                "item_id": 65,
                "game_id": "ArkhamHorror",
                "sort": 6,
                "scoreitem": "Name=*If victory was achieved calculate your score|Type=Footnote"
            },
            //{"item_id": 1, "game_id": "Bananagrams", "game_name": "Bananagrams", "game_icon": "img/games/BoxPowerGrid.jpg"},
            {
                "item_id": 66,
                "game_id": "Bananagrams",
                "sort": 0,
                "scoreitem": "PickRounds=True|"
            },
            //{"item_id": 1, "game_id": "Bananagrams", "sort": 0, "scoreitem": "LowPointsWin=True|"},
            {
                "item_id": 67,
                "game_id": "Bananagrams",
                "sort": 0,
                "scoreitem": "PickRounds=True|"
            }, {
                "item_id": 68,
                "game_id": "Bananagrams",
                "sort": 1,
                "scoreitem": "Name=Points*|Type=Counter|Value=1|Default=0"
            }, {
                "item_id": 69,
                "game_id": "Bananagrams",
                "sort": 2,
                "scoreitem": "Name=*1 point for last place, 2 points for second to last, and so on|Type=Footnote"
            },
            //{"item_id": 1, "game_id": 14, "game_name": "Battleship", "game_icon": "img/games/BoxPowerGrid.jpg"},
            {
                "item_id": 70,
                "game_id": "Battleship",
                "sort": 0,
                "scoreitem": "Name=Win/Lose|Type=Toggle"
            },
            //{"item_id": 1, "game_id": 15, "game_name": "Battlestar Galactica", "game_icon": "img/games/BoxPowerGrid.jpg"},
            {
                "item_id": 71,
                "game_id": "BattlestarGalactica",
                "sort": 0,
                "scoreitem": "Name=Win/Lose|Type=Toggle"
            },
            //{"item_id": 1, "game_id": 17, "game_name": "Boggle", "game_icon": "img/games/BoxPowerGrid.jpg"},
            {
                "item_id": 72,
                "game_id": "Boggle",
                "sort": 0,
                "scoreitem": "Name=Points|Type=Counter|Value=1|Default=0"
            },
            //{"item_id": 1, "game_id": 18, "game_name": "Brass", "game_icon": "img/games/BoxPowerGrid.jpg"},
            {
                "item_id": 73,
                "game_id": "Brass",
                "sort": 0,
                "scoreitem": "Name=Points|Type=Counter|Value=1|Default=0"
            },
            //{"item_id": 1, "game_id": 19, "game_name": "Candy Land", "game_icon": "img/games/BoxPowerGrid.jpg"},
            {
                "item_id": 74,
                "game_id": "CandyLand",
                "sort": 0,
                "scoreitem": "Name=Win/Lose|Type=Toggle"
            },
            //{"item_id": 1, "game_id": 21, "game_name": "Checkers", "game_icon": "img/games/BoxPowerGrid.jpg"},
            {
                "item_id": 75,
                "game_id": "Checkers",
                "sort": 0,
                "scoreitem": "Name=Win/Lose|Type=Toggle"
            },
            //{"item_id": 1, "game_id": 22, "game_name": "Clue", "game_icon": "img/games/BoxPowerGrid.jpg"},
            {
                "item_id": 76,
                "game_id": "Clue",
                "sort": 0,
                "scoreitem": "Name=Win/Lose|Type=Toggle"
            },
            //{"item_id": 1, "game_id": 23, "game_name": "Dixit", "game_icon": "img/games/BoxPowerGrid.jpg"},
            {
                "item_id": 77,
                "game_id": "Dixit",
                "sort": 0,
                "scoreitem": "Name=Points|Type=Counter|Value=1|Default=0"
            },
            //{"item_id": 1, "game_id": 24, "game_name": "Dominant Species", "game_icon": "img/games/BoxPowerGrid.jpg"},
            {
                "item_id": 78,
                "game_id": "DominantSpecies",
                "sort": 0,
                "scoreitem": "Name=Points|Type=Counter|Value=1|Default=0"
            },
            //{"item_id": 1, "game_id": 25, "game_name": "Dominion", "game_icon": "img/games/BoxPowerGrid.jpg"},
            {
                "item_id": 79,
                "game_id": "Dominion",
                "sort": 0,
                "scoreitem": "Name=Points|Type=Counter|Value=1|Default=0"
            },
            //{"item_id": 1, "game_id": 26, "game_name": "Dominion Intrigue", "game_icon": "img/games/BoxPowerGrid.jpg"},
            {
                "item_id": 80,
                "game_id": "DominionIntrigue",
                "sort": 0,
                "scoreitem": "Name=Points|Type=Counter|Value=1|Default=0"
            },
            //{"item_id": 1, "game_id": "Eclipse", "game_name": "Eclipse", "game_icon": "img/games/BoxPowerGrid.jpg"},
            {
                "item_id": 81,
                "game_id": "Eclipse",
                "sort": 0,
                "scoreitem": "Name=Reputation Tile Points|Type=Counter|Value=1|Default=0"
            }, {
                "item_id": 82,
                "game_id": "Eclipse",
                "sort": 1,
                "scoreitem": "Name=Abassador Tile Points|Type=Counter|Value=1|Default=0"
            }, {
                "item_id": 83,
                "game_id": "Eclipse",
                "sort": 2,
                "scoreitem": "Name=Controlled Hex Points|Type=Counter|Value=1|Default=0"
            }, {
                "item_id": 84,
                "game_id": "Eclipse",
                "sort": 3,
                "scoreitem": "Name=Total Discovery Tiles|Type=Counter|Value=2|Default=0"
            }, {
                "item_id": 85,
                "game_id": "Eclipse",
                "sort": 4,
                "scoreitem": "Name=Total Monoliths|Type=Counter|Value=3|Default=0"
            }, {
                "item_id": 86,
                "game_id": "Eclipse",
                "sort": 5,
                "scoreitem": "Name=Military Technology Track Progress|Type=Combo|Values=<4 Tiles^0,4 Tiles^1,5 Tiles^2,6 Tiles^3,7 Tiles^5|"
            }, {
                "item_id": 193,
                "game_id": "Eclipse",
                "sort": 6,
                "scoreitem": "Name=Grid Technology Track Progress|Type=Combo|Values=<4 Tiles^0,4 Tiles^1,5 Tiles^2,6 Tiles^3,7 Tiles^5|"
            }, {
                "item_id": 194,
                "game_id": "Eclipse",
                "sort": 7,
                "scoreitem": "Name=Nano Technology Track Progress|Type=Combo|Values=<4 Tiles^0,4 Tiles^1,5 Tiles^2,6 Tiles^3,7 Tiles^5|"
            }, {
                "item_id": 195,
                "game_id": "Eclipse",
                "sort": 8,
                "scoreitem": "Name=Has Traitor Card|Type=Combo|Values=No^0,Yes^-2|"
            }, {
                "item_id": 196,
                "game_id": "Eclipse",
                "sort": 9,
                "scoreitem": "Name=Species Bonuses|Type=Counter|Value=1|Default=0|"
            },
            //{"item_id": 1, "game_id": 28, "game_name": "El Grande", "game_icon": "img/games/BoxPowerGrid.jpg"},
            {
                "item_id": 88,
                "game_id": "ElGrande",
                "sort": 0,
                "scoreitem": "Name=Points|Type=Counter|Value=1|Default=0"
            },
            //{"item_id": 1, "game_id": "Goa", "game_name": "Goa", "game_icon": "img/games/BoxPowerGrid.jpg"},
            {
                "item_id": 89,
                "game_id": "Goa",
                "sort": 0,
                "scoreitem": "Name=Success Marker Ship VPs|Type=Combo|Values=0^0,1^1,3^3,6^6,10^10|"
            }, {
                "item_id": 90,
                "game_id": "Goa",
                "sort": 1,
                "scoreitem": "Name=Success Marker Harvest VPs|Type=Combo|Values=0^0,1^1,3^3,6^6,10^10|"
            }, {
                "item_id": 91,
                "game_id": "Goa",
                "sort": 2,
                "scoreitem": "Name=Success Marker Taxes VPs|Type=Combo|Values=0^0,1^1,3^3,6^6,10^10|"
            }, {
                "item_id": 92,
                "game_id": "Goa",
                "sort": 3,
                "scoreitem": "Name=Success Marker Expedition VPs|Type=Combo|Values=0^0,1^1,3^3,6^6,10^10|"
            }, {
                "item_id": 93,
                "game_id": "Goa",
                "sort": 4,
                "scoreitem": "Name=Success Marker Found Colony VPs|Type=Combo|Values=0^0,1^1,3^3,6^6,10^10|"
            }, {
                "item_id": 94,
                "game_id": "Goa",
                "sort": 5,
                "scoreitem": "Name=Founded Colonies|Type=Combo|Values=0^0,1^1,2^3,3^6,4^10|"
            }, {
                "item_id": 95,
                "game_id": "Goa",
                "sort": 6,
                "scoreitem": "Name=Expedition Tiger Symbols|Type=Combo|Values=0^0,1^1,2^3,3^6,4^10,5^15,6^20|"
            }, {
                "item_id": 96,
                "game_id": "Goa",
                "sort": 7,
                "scoreitem": "Name=Expedition Fish Symbols|Type=Combo|Values=0^0,1^1,2^3,3^6,4^10,5^15,6^20|"
            }, {
                "item_id": 97,
                "game_id": "Goa",
                "sort": 8,
                "scoreitem": "Name=Expedition Palm Symbols|Type=Combo|Values=0^0,1^1,2^3,3^6,4^10,5^15,6^20|"
            }, {
                "item_id": 98,
                "game_id": "Goa",
                "sort": 9,
                "scoreitem": "Name=Expedition Shell Symbols|Type=Combo|Values=0^0,1^1,2^3,3^6,4^10,5^15,6^20|"
            }, {
                "item_id": 99,
                "game_id": "Goa",
                "sort": 10,
                "scoreitem": "Name=Expedition Statue Symbols|Type=Combo|Values=0^0,1^1,2^3,3^6,4^10,5^15,6^20|"
            }, {
                "item_id": 100,
                "game_id": "Goa",
                "sort": 11,
                "scoreitem": "Name=Has most money*|Type=Combo|Values=No^0,Yes^3|"
            }, {
                "item_id": 101,
                "game_id": "Goa",
                "sort": 12,
                "scoreitem": "Name=Plantations|Type=Counter|Value=1|Default=0"
            }, {
                "item_id": 102,
                "game_id": "Goa",
                "sort": 13,
                "scoreitem": "Name=Has fulfilled Duty tile*|Type=Combo|Values=No^0,Yes^4|"
            }, {
                "item_id": 103,
                "game_id": "Goa",
                "sort": 14,
                "scoreitem": "Name=Mission Tile VPs|Type=Counter|Value=1|Default=0"
            }, {
                "item_id": 104,
                "game_id": "Goa",
                "sort": 15,
                "scoreitem": "Name=*Several players may tie for the most money|Type=Footnote|"
            },
            //{"item_id": 1, "game_id": 30, "game_name": "Hamburgum", "game_icon": "img/games/BoxPowerGrid.jpg"},
            {
                "item_id": 105,
                "game_id": "Hamburgum",
                "sort": 0,
                "scoreitem": "Name=Points|Type=Counter|Value=1|Default=0"
            },
            //{"item_id": 1, "game_id": "LeHavre", "game_name": "Le Havre", "game_icon": "img/games/BoxPowerGrid.jpg"},
            {
                "item_id": 106,
                "game_id": "LeHavre",
                "sort": 0,
                "scoreitem": "Name=Total Building Values|Type=Counter|Value=1|Default=0"
            }, {
                "item_id": 107,
                "game_id": "LeHavre",
                "sort": 1,
                "scoreitem": "Name=Total Ship Values|Type=Counter|Value=1|Default=0"
            }, {
                "item_id": 108,
                "game_id": "LeHavre",
                "sort": 2,
                "scoreitem": "Name=Bonus Building Points|Type=Counter|Value=1|Default=0"
            }, {
                "item_id": 109,
                "game_id": "LeHavre",
                "sort": 3,
                "scoreitem": "Name=Cash|Type=Counter|Value=1|Default=0"
            }, {
                "item_id": 110,
                "game_id": "LeHavre",
                "sort": 4,
                "scoreitem": "Name=Unpaid Loans|Type=Counter|Value=-7|Default=0"
            },
            //{"item_id": 1, "game_id": 32, "game_name": "Mage Knight", "game_icon": "img/games/BoxPowerGrid.jpg"},
            {
                "item_id": 111,
                "game_id": "MageKnight",
                "sort": 0,
                "scoreitem": "Name=Points|Type=Counter|Value=1|Default=0"
            },
            //{"item_id": 1, "game_id": 33, "game_name": "Monopoly", "game_icon": "img/games/BoxPowerGrid.jpg"},
            {
                "item_id": 112,
                "game_id": "Monopoly",
                "sort": 0,
                "scoreitem": "Name=Win/Lose|Type=Toggle"
            },
            //{"item_id": 1, "game_id": 34, "game_name": "Operation", "game_icon": "img/games/BoxPowerGrid.jpg"},
            {
                "item_id": 113,
                "game_id": "Operation",
                "sort": 0,
                "scoreitem": "Name=Win/Lose|Type=Toggle"
            },
            //{"item_id": 1, "game_id": "OraEtLabora", "game_name": "Ora Et Labora", "game_icon": "img/games/BoxPowerGrid.jpg"},
            {
                "item_id": 114,
                "game_id": "OraEtLabora",
                "sort": 0,
                "scoreitem": "Name=Goods Tiles Points|Type=Counter|Value=1|Default=0"
            }, {
                "item_id": 115,
                "game_id": "OraEtLabora",
                "sort": 1,
                "scoreitem": "Name=Economic Value of Buildings|Type=Counter|Value=1|Default=0"
            }, {
                "item_id": 116,
                "game_id": "OraEtLabora",
                "sort": 2,
                "scoreitem": "Name=Settlement Scores|Type=Counter|Value=1|Default=0"
            },
            //{"item_id": 1, "game_id": 36, "game_name": "Power Grid", "game_icon": "img/games/BoxPowerGrid.jpg"},
            {
                "item_id": 117,
                "game_id": "PowerGrid",
                "sort": 0,
                "scoreitem": "Name=Points|Type=Counter|Value=1|Default=0"
            },
            //{"item_id": 1, "game_id": "RacefortheGalaxy", "game_name": "Race for the Galaxy", "game_icon": "img/games/BoxPowerGrid.jpg"},
            {
                "item_id": 118,
                "game_id": "RacefortheGalaxy",
                "sort": 0,
                "scoreitem": "Name=Development and World VPs|Type=Counter|Value=1|Default=0"
            }, {
                "item_id": 119,
                "game_id": "RacefortheGalaxy",
                "sort": 1,
                "scoreitem": "Name=VP Chips|Type=Counter|Value=1|Default=0"
            }, {
                "item_id": 120,
                "game_id": "RacefortheGalaxy",
                "sort": 2,
                "scoreitem": "Name=Bonus VPs|Type=Counter|Value=1|Default=0"
            },
            //{"item_id": 1, "game_id": 38, "game_name": "Reef Encounter", "game_icon": "img/games/BoxPowerGrid.jpg"},
            {
                "item_id": 121,
                "game_id": "ReefEncounter",
                "sort": 0,
                "scoreitem": "Name=Points|Type=Counter|Value=1|Default=0"
            },
            //{"item_id": 1, "game_id": 39, "game_name": "Risk", "game_icon": "img/games/BoxPowerGrid.jpg"},
            {
                "item_id": 122,
                "game_id": "Risk",
                "sort": 0,
                "scoreitem": "Name=Win/Lose|Type=Toggle"
            },
            //{"item_id": 1, "game_id": 40, "game_name": "Saint Petersburg", "game_icon": "img/games/BoxPowerGrid.jpg"},
            {
                "item_id": 123,
                "game_id": "SaintPetersburg",
                "sort": 0,
                "scoreitem": "Name=Points|Type=Counter|Value=1|Default=0"
            },
            //{"item_id": 1, "game_id": 41, "game_name": "Samurai", "game_icon": "img/games/BoxPowerGrid.jpg"},
            {
                "item_id": 124,
                "game_id": "Samurai",
                "sort": 0,
                "scoreitem": "Name=Win/Lose|Type=Toggle"
            },
            //{"item_id": 1, "game_id": "SanJuan", "game_name": "San Juan", "game_icon": "img/games/BoxPowerGrid.jpg"},
            {
                "item_id": 125,
                "game_id": "SanJuan",
                "sort": 0,
                "scoreitem": "Name=Building VPs|Type=Counter|Value=1|Default=0"
            }, {
                "item_id": 126,
                "game_id": "SanJuan",
                "sort": 1,
                "scoreitem": "Name=Chapel VPs|Type=Counter|Value=1|Default=0"
            }, {
                "item_id": 127,
                "game_id": "SanJuan",
                "sort": 2,
                "scoreitem": "Name=Arch - Guild Hall - City Hall VPs|Type=Counter|Value=1|Default=0"
            }, {
                "item_id": 128,
                "game_id": "SanJuan",
                "sort": 3,
                "scoreitem": "Name=Palace VPs|Type=Counter|Value=1|Default=0"
            },
            //{"item_id": 1, "game_id": 43, "game_name": "Scrabble", "game_icon": "img/games/BoxPowerGrid.jpg"},
            {
                "item_id": 129,
                "game_id": "Scrabble",
                "sort": 0,
                "scoreitem": "Name=Points|Type=Counter|Value=1|Default=0"
            },
            //{"item_id": 1, "game_id": 44, "game_name": "Sorry", "game_icon": "img/games/BoxPowerGrid.jpg"},
            {
                "item_id": 130,
                "game_id": "Sorry",
                "sort": 0,
                "scoreitem": "Name=Win/Lose|Type=Toggle"
            },
            //{"item_id": 1, "game_id": 45, "game_name": "The Game of Life", "game_icon": "img/games/BoxPowerGrid.jpg"},
            {
                "item_id": 131,
                "game_id": "TheGameofLife",
                "sort": 0,
                "scoreitem": "Name=Win/Lose|Type=Toggle"
            },
            //{"item_id": 1, "game_id": 46, "game_name": "The Resistance", "game_icon": "img/games/BoxPowerGrid.jpg"},
            {
                "item_id": 132,
                "game_id": "TheResistance",
                "sort": 0,
                "scoreitem": "Name=Win/Lose|Type=Toggle"
            },
            //{"item_id": 1, "game_id": 47, "game_name": "Through the Ages", "game_icon": "img/games/BoxPowerGrid.jpg"},
            {
                "item_id": 133,
                "game_id": "ThroughtheAges",
                "sort": 0,
                "scoreitem": "Name=Points|Type=Counter|Value=1|Default=0"
            },
            //{"item_id": 1, "game_id": 48, "game_name": "Ticket to Ride", "game_icon": "img/games/BoxPowerGrid.jpg"},
            {
                "item_id": 134,
                "game_id": "TickettoRide",
                "sort": 0,
                "scoreitem": "Name=Route Points|Type=Counter|Value=1|Default=0"
            }, {
                "item_id": 184,
                "game_id": "TickettoRide",
                "sort": 1,
                "scoreitem": "Name=Destination Ticket Points|Type=Counter|Value=1|Default=0"
            }, {
                "item_id": 185,
                "game_id": "TickettoRide",
                "sort": 2,
                "scoreitem": "Name=Longest Route Bonus|Type=Toggle|Values=No^0,Yes^10"
            },
            //{"item_id": 1, "game_id": 49, "game_name": "Ticket to Ride: Europe", "game_icon": "img/games/BoxPowerGrid.jpg"},
            {
                "item_id": 135,
                "game_id": "TickettoRideEurope",
                "sort": 0,
                "scoreitem": "Name=Route Points|Type=Counter|Value=1|Default=0"
            }, {
                "item_id": 186,
                "game_id": "TickettoRideEurope",
                "sort": 1,
                "scoreitem": "Name=Destination Ticket Points|Type=Counter|Value=1|Default=0"
            }, {
                "item_id": 187,
                "game_id": "TickettoRideEurope",
                "sort": 2,
                "scoreitem": "Name=Remaining Stations|Type=Counter|Value=4|Default=0"
            }, {
                "item_id": 188,
                "game_id": "TickettoRideEurope",
                "sort": 3,
                "scoreitem": "Name=European Express Bonus|Type=Toggle|Values=No^0,Yes^10"
            },
            //{"item_id": 1, "game_id": 50, "game_name": "Tigris and Euphrates", "game_icon": "img/games/BoxPowerGrid.jpg"},
            {
                "item_id": 136,
                "game_id": "TigrisandEuphrates",
                "sort": 0,
                "scoreitem": "Name=Points|Type=Counter|Value=1|Default=0"
            },
            //{"item_id": 1, "game_id": 51, "game_name": "Torres", "game_icon": "img/games/BoxPowerGrid.jpg"},
            {
                "item_id": 137,
                "game_id": "Torres",
                "sort": 0,
                "scoreitem": "Name=Points|Type=Counter|Value=1|Default=0"
            },
            //{"item_id": 1, "game_id": 52, "game_name": "Trivial Pursuit", "game_icon": "img/games/BoxPowerGrid.jpg"},
            {
                "item_id": 138,
                "game_id": "TrivialPursuit",
                "sort": 0,
                "scoreitem": "Name=Win/Lose|Type=Toggle"
            },
            //{"item_id": 1, "game_id": 53, "game_name": "War of the Ring", "game_icon": "img/games/BoxPowerGrid.jpg"},
            {
                "item_id": 139,
                "game_id": "WaroftheRingFirstEdition",
                "sort": 0,
                "scoreitem": "Name=Win/Lose|Type=Toggle"
            },
            //{"item_id": 1, "game_id": 54, "game_name": "Twilight Struggle", "game_icon": "img/games/BoxTwilightStruggle.jpg"},
            {
                "item_id": 140,
                "game_id": "TwilightStruggle",
                "sort": 0,
                "scoreitem": "Name=Win/Lose|Type=Toggle"
            },
            //Pandemic
            {
                "item_id": 141,
                "game_id": "Pandemic",
                "sort": 0,
                "scoreitem": "Coop=True|"
            }, {
                "item_id": 142,
                "game_id": "Pandemic",
                "sort": 0,
                "scoreitem": "Name=Win/Lose|Type=Toggle"
            },
            //Citadels
            {
                "item_id": 143,
                "game_id": "Citadels",
                "sort": 0,
                "scoreitem": "Name=Gold Cost of District Cards|Type=Counter|Value=1|Default=0"
            }, {
                "item_id": 144,
                "game_id": "Citadels",
                "sort": 0,
                "scoreitem": "Name=District Colors Bonus|Type=Combo|Values=Fewer than one district in each color^0,One district in each color^3|"
            }, {
                "item_id": 145,
                "game_id": "Citadels",
                "sort": 0,
                "scoreitem": "Name=District Building Bonus|Type=Combo|Values=Did not build 8 districts^0,Built 8 districts but not first^2,First to build 8 districts^4|"
            },
            //Smallworld
            {
                "item_id": 146,
                "game_id": "Smallworld",
                "sort": 0,
                "scoreitem": "Name=Victory coins|Type=Counter|Value=1|Default=0"
            },
            //Lost cities
            {
                "item_id": 147,
                "game_id": "LostCities",
                "sort": 0,
                "scoreitem": "Name=Points|Type=Counter|Value=1|Default=0"
            },
            //Stone Age
            {
                "item_id": 148,
                "game_id": "StoneAge",
                "sort": 0,
                "scoreitem": "Name=Scoring Track Points|Type=Counter|Value=1|Default=0;Name=Different Civ. Cards (Green)|Type=Counter|Value=1|Default=0|Square=True;Name=Farmers|Type=Counter|Value=1|NoTally=True|SaveVar=A|Default=0;Name=Food Production|Type=Counter|Value=1|NoTally=True|SaveVar=B|Default=0;Name=Farmers X Food Production|Type=Math|Value=Multiply|Values=A,B;Name=Tool Makers|Type=Counter|Value=1|NoTally=True|SaveVar=C|Default=0;Name=Tools|Type=Counter|Value=1|NoTally=True|SaveVar=D|Default=0;Name=Tool Makers X Tools|Type=Math|Value=Multiply|Values=C,D;Name=Hut Builders|Type=Counter|Value=1|NoTally=True|SaveVar=E|Default=0;Name=Buildings|Type=Counter|Value=1|NoTally=True|SaveVar=F|Default=0;Name=Hut Builders X Buildings|Type=Math|Value=Multiply|Values=E,F;Name=Shamen|Type=Counter|Value=1|NoTally=True|SaveVar=G|Default=0;Name=People|Type=Counter|Value=1|NoTally=True|SaveVar=H|Default=0;Name=Shamen X People|Type=Math|Value=Multiply|Values=G,H;Name=Non-food Resources|Type=Counter|Value=1|Default=0"
            },

            //{"item_id": 1, "game_id": "7WondersLeaders", "game_name": "7 Wonders - Leaders", "game_icon": "img/games/BoxPowerGrid.jpg"},
            {
                "item_id": 158,
                "game_id": "7WondersLeaders",
                "sort": 0,
                "scoreitem": "Name=Military (Red) Points|Type=Counter|Value=1|Default=0;Name=Total Coins|Type=Counter|DivideBy=3|Value=1|Default=0;Name=Wonder Points|Type=Counter|Value=1|Default=0;Name=Civilian (Blue) Points|Type=Counter|Value=1|Default=0;Name=Commercial (Yellow) Points|Type=Counter|Value=1|Default=0;Name=Science (Green) - Tablet Count|Type=Counter|Value=1|Default=0|NoTally=True|SaveVar=A;Name=Science (Green) - Compass Count|Type=Counter|Value=1|Default=0|NoTally=True|SaveVar=B;Name=Science (Green) - Gear Count|Type=Counter|Value=1|Default=0|NoTally=True|SaveVar=C;Name=Science Tablets Points|Type=Math|Value=Square|Values=A;Name=Science Compass Points|Type=Math|Value=Square|Values=B;Name=Science Gear Points|Type=Math|Value=Square|Values=C;Name=Science Set Count|Type=Math|Value=Smallest|Values=A,B,C|SaveVar=D|NoTally=True;Name=Science Set Points|Type=Math|Value=Multiply|Values=D,7;Name=Guild (Purple) Points|Type=Counter|Value=1|Default=0;Name=Leaders (White) Points|Type=Counter|Value=1|Default=0;Name=Count total coins and science cards, not points gained for those items|Type=Footnote"
            },


            //{"item_id": 1, "game_id": "7WondersLeaders", "game_name": "7 Wonders - Leaders", "game_icon": "img/games/BoxPowerGrid.jpg"},
            {
                "item_id": 168,
                "game_id": "7WondersCities",
                "sort": 0,
                "scoreitem": "Name=Military (Red) Points|Type=Counter|Value=1|Default=0;Name=Total Coins|Type=Counter|DivideBy=3|Value=1|Default=0;Name=Wonder Points|Type=Counter|Value=1|Default=0;Name=Civilian (Blue) Points|Type=Counter|Value=1|Default=0;Name=Commercial (Yellow) Points|Type=Counter|Value=1|Default=0;Name=Science (Green) - Tablet Count|Type=Counter|Value=1|Default=0|NoTally=True|SaveVar=A;Name=Science (Green) - Compass Count|Type=Counter|Value=1|Default=0|NoTally=True|SaveVar=B;Name=Science (Green) - Gear Count|Type=Counter|Value=1|Default=0|NoTally=True|SaveVar=C;Name=Science Tablets Points|Type=Math|Value=Square|Values=A;Name=Science Compass Points|Type=Math|Value=Square|Values=B;Name=Science Gear Points|Type=Math|Value=Square|Values=C;Name=Science Set Count|Type=Math|Value=Smallest|Values=A,B,C|SaveVar=D|NoTally=True;Name=Science Set Points|Type=Math|Value=Multiply|Values=D,7;Name=Guild (Purple) Points|Type=Counter|Value=1|Default=0;Name=Leaders (White) Points|Type=Counter|Value=1|Default=0;Name=City (Black) Points|Type=Counter|Value=1|Default=0;Name=Count total coins and science cards, not points gained for those items|Type=Footnote"
            },

            //game of thrones
            {
                "item_id": 179,
                "game_id": "AGameofThronesSecondEdition",
                "sort": 0,
                "scoreitem": "Name=Areas Controlled|Type=Counter|Value=1|Default=0"
            },
            //War of the ring second edition
            {
                "item_id": 183,
                "game_id": "WaroftheRingSecondEdition",
                "sort": 0,
                "scoreitem": "Name=Win/Lose|Type=Toggle"
            },
            //item_id": 184-188: Ticket to ride"
            {
                "item_id": 189,
                "game_id": "TickettoRideNordicCountries",
                "sort": 0,
                "scoreitem": "Name=Route Points|Type=Counter|Value=1|Default=0"
            }, {
                "item_id": 190,
                "game_id": "TickettoRideNordicCountries",
                "sort": 1,
                "scoreitem": "Name=Destination Ticket Points|Type=Counter|Value=1|Default=0"
            }, {
                "item_id": 191,
                "game_id": "TickettoRideNordicCountries",
                "sort": 2,
                "scoreitem": "Name=Globetrotter Bonus|Type=Toggle|Values=No^0,Yes^10"
            },
            //Risk Legacy
            {
                "item_id": 192,
                "game_id": "RiskLegacy",
                "sort": 0,
                "scoreitem": "Name=Win/Lose|Type=Toggle"
            }
        ];
        var i;
        var l = games.length;
        var g;
        var myGame;
        var advancedText;
        var scoreCard;
        var j;
        var m;
        for (i = 0; i < l; i++) {
            g = games[i];
            advancedText = "";
            //function Game(id, bggId, name, icon, scoreType, advancedText, version)
            m = scoreitems.length;
            for (j = 0; j < m; j++) {
                scoreCard = scoreitems[j];
                if (scoreCard.game_id == g.game_id) {
                    advancedText += (scoreCard.scoreitem + ";");
                }
            }
            myGame = new Game(app.sanitizeGame(g.game_id), g.game_bggid, g.game_name, g.game_icon, "advanced", advancedText, "1");
            //console.log(myGame);
            lsSetObj("oldgame" + myGame.id, myGame, "OldGames");
            if (i === (l - 1)) {
                if (callback !== undefined) {
                    callback();
                }
            }
        }
        if (l <= 0) {
            if (callback !== undefined) {
                callback();
            }
        }
    };



    this.initializeStorage(successCallback, errorCallback);

};