//Objects 
/*global escape: true */
function OnlineGameData(id, bggId, gameName, gameImage, scoring, advanced, version, notes) {
    this.id = id;
    this.bggId = bggId;
    this.gameName = gameName;
    this.gameImage = gameImage;
    this.scoring = scoring;
    this.advanced = advanced;
    this.version = version;
    this.notes = notes;
}

function DeviceImage(id, url) {
    this.id = id;
    this.url = url;
}

function TallyHistory(id) {
    this.id = id;
    this.history = [];
}

function FakeContact(dName) {
    //console.log("dname:");
    //console.log(dName);
    if (dName !== undefined && dName !== "") {
        var a = dName.split(" ");
        var fName = "";
        var lName = "";
        if (a.length >= 1) {
            fName = a[0];
        }
        if (a.length >= 2) {
            lName = a[1];
        }
        this.nickname = "";
        this.name = {
            "givenName": '"' + fName + '"',
            "familyName": '"' + lName + '"'
        };
    } else {
        this.name = {
            "givenName": '""',
            "familyName": '""'
        };
        this.nickname = "";
    }
    this.urls = null;
    this.photos = null;
}

function ScoreDetails(name, valueBefore, math, valueAfter, tally, saveVar, saveVarLetter) {
    this.name = name;
    this.valueBefore = valueBefore;
    this.math = math;
    this.valueAfter = valueAfter;
    this.tally = tally;
    this.saveVar = saveVar;
    this.saveVarLetter = saveVarLetter;
}

function Team(name) {
    this.name = name;
}

function Location(name) {
    this.name = name;
}

function Faction(name, gameId) {
    this.id = name + gameId;
    this.name = name;
    this.gameId = gameId;
}

function Score(scoreId, sessionId, playerId, points, win, color, team, faction, position) {
    this.scoreId = scoreId;
    this.sessionId = sessionId;
    this.playerId = playerId;
    this.points = points;
    this.win = win;
    this.color = color;
    this.team = team;
    this.faction = faction;
    this.position = position;
}

function Award(id, name, desc, icon) {
    this.id = id;
    this.name = name;
    this.desc = desc;
    this.icon = icon;

}

function Avatar(id, name) {
    this.id = id;
    this.name = name;
}

function AwardEarned(earnedId, awardId, awardValue, gameId, playerId, sessionId, dateEarned, gameData) {
    this.awardId = awardId;
    this.earnedId = earnedId;
    this.awardValue = awardValue;
    this.gameId = gameId;
    this.gameData = gameData;
    this.playerId = playerId;
    this.sessionId = sessionId;
    this.dateEarned = dateEarned;
    this.desc = "";
}

function getAwardDesc(desc, playerName, playerTwitter, gameName, gameId, awardValue, gameData, bTwitter) {
    var descTweet = "";
    var newData = "";
    desc = desc.replace("$$VALUE$$", awardValue);
    desc = desc.replace("$$DATA$$", gameData);
    if (gameData !== "" && gameData !== undefined && gameData !== "undefined") {
        desc = desc.replace("$$DATA2$$", "(Previous record: " + gameData + ")");
    } else {
        desc = desc.replace("$$DATA2$$", "");
    }


    if (awardValue !== 1) {
        desc = desc.replace("$$S$$", "s");
    } else {
        desc = desc.replace("$$S$$", "");
    }
    descTweet = desc;
    descTweet = descTweet.replace("$$GAME$$", "#" + gameId);
    if (playerTwitter !== "") {
        descTweet = descTweet.replace("$$PLAYER$$", playerName + " (@" + playerTwitter + ")");
    } else {
        descTweet = descTweet.replace("$$PLAYER$$", playerName);
    }
    desc = desc.replace("$$PLAYER$$", playerName);
    desc = desc.replace("$$GAME$$", gameName);

    if (bTwitter === true) {
        return descTweet;
    } else {
        return desc;
    }
}

function getSessionDesc(gameId, allPlayers, sDate) {
    //console.log(allPlayers);
    var desc = "Our #$$GAME$$ game was won by $$WINNERS$$ with $$POINTS$$ point$$S$$ ($$PLAYERS$$) #$$DATE$$";
    var descLoss = "Our #$$GAME$$ game was lost ($$PLAYERS$$) #$$DATE$$";
    var winners = [];
    var players = [];
    var sWinners = "";
    var sPlayers = "";
    var i;
    var l;
    var highscore = 0;
    var today = new Date(sDate);
    var dd = today.getDate();
    var mm = today.getMonth() + 1; //January is 0!
    var yyyy = today.getFullYear();
    if (dd < 10) {
        dd = '0' + dd;
    }
    if (mm < 10) {
        mm = '0' + mm;
    }
    today = yyyy + "-" + mm + '-' + dd;

    l = allPlayers.length;
    for (i = 0; i < l; i++) {
        if (allPlayers[i].points > highscore) {
            highscore = allPlayers[i].points;
        }
        if (allPlayers[i].winner === true || allPlayers[i].winner === "true" || allPlayers[i].winner == -1 || allPlayers[i].winner == "-1") {
            winners.push(allPlayers[i]);

        } else {
            players.push(allPlayers[i]);
        }
    }

    l = winners.length;
    for (i = 0; i < l; i++) {
        if (i > 0) {
            if (l > (i + 1)) {
                sWinners += ", ";
            } else {
                sWinners += " and ";
            }
        }
        if (winners[i].player.twitter !== "") {
            sWinners += winners[i].player.name + "(@" + winners[i].player.twitter + ")";
        } else {
            sWinners += winners[i].player.name;
        }
    }

    l = players.length;
    for (i = 0; i < l; i++) {
        if (i > 0) {
            sPlayers += ", ";

        }
        if (players[i].player.twitter !== "") {
            sPlayers += "@" + players[i].player.twitter + " " + players[i].points;
        } else {
            sPlayers += players[i].player.name + " " + players[i].points;
        }
    }

    desc = desc.replace("$$GAME$$", gameId);
    desc = desc.replace("$$WINNERS$$", sWinners);
    desc = desc.replace("$$PLAYERS$$", sPlayers);
    descLoss = descLoss.replace("$$GAME$$", gameId);
    descLoss = descLoss.replace("$$WINNERS$$", sWinners);
    descLoss = descLoss.replace("$$PLAYERS$$", sPlayers);
    if (winners[0] !== undefined) {
        highscore = winners[0].points;
        desc = desc.replace("$$POINTS$$", winners[0].points);
    } else {
        if (highscore > 0) {
            desc = desc.replace("$$POINTS$$", highscore);
        } else {
            desc = descLoss;
        }
    }

    if (highscore !== 1) {
        desc = desc.replace("$$S$$", "s");
    } else {
        desc = desc.replace("$$S$$", "");
    }
    desc = desc.replace("$$DATE$$", today);
    //console.log(desc);
    return desc;
}

function BGGObject(objectid, playdate, location, length, comments) {
    //'{"dummy":"1","ajax":"1","version":"2","objecttype":"thing","objectid":"68448","playid":"","action":"save","playdate":"2013-06-24","dateinput":"2013-06-24",
    //"YIUButton":"","location":"Home","quantity":"1","length":"60","incomplete":"0","nowinstats":"0","comments":"These%20are%20some%20comments",
    var d = new Date();
    var l;
    var j;
    this.dummy = 1;
    this.ajax = 1;
    this.version = 2;
    this.objecttype = "thing";
    this.objectid = objectid;
    this.playid = "";
    this.action = "save";
    this.playdate = playdate;
    this.dateinput = playdate;
    this.YIUButton = "";
    this.location = escape(location);
    this.quantity = 1;
    this.length = length;
    this.incomplete = 0;
    this.nowinstats = 0;
    this.comments = escape(comments);
    this.players = [];
    this.addPlayer = function(name, username, score, color, position, win) {
        //console.log(name + username + score + color + position + win);
        var myPlayer = new BGGPlayer(name, username, score, color, position, win);
        //console.log(myPlayer);
        this.players.push(myPlayer);
    };
    this.dataString = function() {
        var ret = "";
        ret += 'dummy=' + this.dummy;
        ret += '&ajax=' + this.ajax;
        ret += '&version=' + this.version;
        ret += '&objecttype=' + this.objecttype;
        ret += '&objectid=' + this.objectid;
        ret += '&playid=' + this.playid;
        ret += '&action=' + this.action;
        ret += '&playdate=' + this.playdate;
        ret += '&dateinput=' + this.dateinput;
        ret += '&YIUButton=' + this.YIUButton;
        ret += '&location=' + this.location;
        ret += '&quantity=' + this.quantity;
        ret += '&length=' + this.length;
        ret += '&incomplete=' + this.incomplete;
        ret += '&nowinstats=' + this.nowinstats;
        ret += '&comments=' + this.comments;
        //"players[1][playerid]":"","players[1][name]":"Mike","players[1][username]":"rebrandsoftware","players[1][score]":"123","players[1][color]":"blue",
        //"players[1][position]":"1","players[1][rating]":"6.1","players[1][new]":"0","players[1][win]":"0",
        l = this.players.length;
        for (var i = 0; i < l; i++) {
            j = i + 1;
            ret += '&players[' + j + '][playerid]=' + this.players[i].playerid;
            ret += '&players[' + j + '][name]=' + this.players[i].name;
            ret += '&players[' + j + '][username]=' + this.players[i].username;
            ret += '&players[' + j + '][score]=' + this.players[i].score;
            ret += '&players[' + j + '][color]=' + this.players[i].color;
            ret += '&players[' + j + '][position]=' + this.players[i].position;
            ret += '&players[' + j + '][rating]=' + this.players[i].rating;
            ret += '&players[' + j + '][new]=' + this.players[i].isnew;
            ret += '&players[' + j + '][win]=' + this.players[i].win;
        }
        //console.log(ret);
        return ret;
    };
}

function BGGPlayer(name, username, score, color, position, win) {
    this.playerid = "";
    this.name = name;
    this.username = username;
    this.score = score;
    this.color = color;
    this.position = position;
    this.rating = "";
    this.isnew = 0;
    this.win = win;
}

function History(game, session, scores, players, awards) {
    this.game = game;
    this.session = session;
    this.scores = scores;
    this.players = players;
    this.awards = awards;

}

function Setting(settingName, settingValue, user) {
    this.settingName = settingName;
    this.settingValue = settingValue;
    this.user = user;
}

function Session(sessionId, gameId, sessionDate, sessionNotes, sessionPhoto, sessionWon, sessionLocation, sessionDuration) {
    this.sessionId = sessionId;
    this.gameId = gameId;
    this.sessionDate = sessionDate;
    this.sessionNotes = sessionNotes;
    this.sessionPhoto = sessionPhoto;
    this.sessionWon = sessionWon;
    this.sessionLocation = sessionLocation;
    this.sessionDuration = sessionDuration;
    this.desc = "";
    if (sessionDate === "") {
        this.sessionDate = this.sessionId;
    }
}

function getHistoryDesc(winners, won, points, playdate) {
    //console.log("getHistoryDesc");
    //console.log(playdate);
    var desc = "";
    var sWinners = "";
    if (winners.length === 0) {
        desc = "This game was $$WIN$$ ($$DATE$$)";
    } else {
        desc = "$$PLAYER$$ $$WIN$$ this game with $$VALUE$$ point$$S$$ ($$DATE$$)";
    }
    for (var i = 0; i < winners.length; i++) {
        if (i > 0) {
            sWinners += " and " + winners[i];
        } else {
            sWinners = winners[i];
        }
    }
    desc = desc.replace("$$PLAYER$$", sWinners);
    desc = desc.replace("$$VALUE$$", points);
    //console.log(newDate);
    var newDate = new Date(playdate);
    //console.log(newDate);
    desc = desc.replace("$$DATE$$", humaneDate(newDate));
    if (points != 1) {
        desc = desc.replace("$$S$$", "s");
    } else {
        desc = desc.replace("$$S$$", "");
    }
    if (winners.length === 0) {
        desc = desc.replace("$$WIN$$", "lost");
    } else {
        desc = desc.replace("$$WIN$$", "won");
    }
    return desc;
}

function PlayerDisplay(playerName, playerId) {
    this.playerName = playerName;
    this.playerId = playerId;
}

function GameDisplay(gameName, gameId) {
    this.gameName = gameName;
    this.gameId = gameId;
}

function AwardDisplay(awardName, awardId) {
    this.awardName = awardName;
    this.awardId = awardId;
}

function TypeDisplay(typeName, typeId) {
    this.typeName = typeName;
    this.typeId = typeId;
}

function NumPlayersDisplay(number, id) {
    this.number = number;
    this.id = id;
}

function PlayerTemp(playerObject) {
    this.player = playerObject;
    this.points = 0;
    this.winner = false;
    this.scoreId = 0;
    this.scoreLogName = [];
    this.scoreLogCombo = [];
    this.scoreLogMath = [];
    this.scoreLogAdd = [];
    this.scoreLogPoints = [];
    this.color = "";
    this.position = "";
    this.team = "";
    this.faction = "";
    this.addPoints = function(myScoreDetails) {
        var scoreLog = "";
        if (myScoreDetails.tally === true) {

            this.points += parseFloat(myScoreDetails.valueAfter);
            scoreLog = myScoreDetails.valueAfter;
        } else {
            scoreLog = "[" + myScoreDetails.valueAfter + "]";
        }
        if (myScoreDetails.saveVar === true) {
            //scoreLog += " >> " + myScoreDetails.saveVarLetter;
        }
        this.scoreLogAdd.push(scoreLog);
        this.scoreLogName.push(myScoreDetails.name);
        this.scoreLogCombo.push(myScoreDetails.valueBefore);
        this.scoreLogMath.push(myScoreDetails.math);
        this.scoreLogPoints.push(this.points);

    };
    this.getLogText = function(val) {
        //console.log("ouput log text")
        var ret = "";
        ret += "Name: " + this.scoreLogName[val] + " | " + "Combo: " + this.scoreLogCombo[val] + " | " + "Math: " + this.scoreLogMath[val] + " | " + "Add: " + this.scoreLogAdd[val] + " | " + "Total: " + this.scoreLogPoints[val];
        //console.log(ret);
    };
    this.reset = function() {
        this.points = 0;
        this.scoreLogName = [];
        this.scoreLogCombo = [];
        this.scoreLogMath = [];
        this.scoreLogAdd = [];
        this.scoreLogPoints = [];
        this.winner = false;
    };
}

function Player(id, bggUsername, twitter, name, icon, hiddenOnDevice) {
    //console.log("Hidden? " + hidden);
    this.id = id;
    this.bggUsername = bggUsername;
    this.twitter = twitter;
    this.name = name;
    this.icon = icon;
    this.iconURL = icon;
    this.hiddenOnDevice = hiddenOnDevice;
    this.hidden = false;
}

function Game(id, bggId, name, icon, scoreType, advancedText, version) {
    this.id = id;
    this.bggId = bggId;
    this.name = name;
    this.icon = icon;
    this.iconURL = icon;
    this.scoreType = scoreType;
    this.advancedText = advancedText;
    this.favorite = false;
    this.hidden = false;
    this.version = version;
}



function SavedItem(id, value) {
    this.id = id;
    this.value = value;
}

function Dice(id, value, max, locked) {
    this.id = id;
    this.value = value;
    this.max = max;
    this.locked = locked;
    this.result = 1;
    function roll() {
        this.result = Math.floor(Math.random() * max) + 1;
    }
}

function GameDetails(game) {
    this.game = game;
    this.id = getTimestamp();
    this.players = [];
    this.teams = [];
    this.scoreItems = [];
    this.winners = [];
    this.winningTeams = [];
    this.factions = [];
    this.savedItems = [];
    this.tallyHistory = [];
    this.useTeams = false;
    this.teamType = "byPlayer"; //scoreAsPlayer, scoreAsTeam
    this.pickRounds = false;
    this.rounds = 1;
    this.lowPointsWin = false;
    this.paused = false;
    this.coop = false;
    this.playDate = 0;
    this.photo = null;
    this.playDuration = 0;
    this.notes='';
    this.photo='';
    this.varA = 0;
    this.varB = 0;
    this.varC = 0;
    this.varD = 0;
    this.varE = 0;
    this.varF = 0;
    this.varG = 0;
    this.varH = 0;
    this.varI = 0;
    this.varJ = 0;
    this.varK = 0;
    this.varL = 0;
    this.varM = 0;
    this.varN = 0;
    this.varO = 0;
    this.varP = 0;
    this.varQ = 0;
    this.varR = 0;
    this.varS = 0;
    this.varT = 0;
    this.varU = 0;
    this.varV = 0;
    this.varW = 0;
    this.varX = 0;
    this.varY = 0;
    this.varZ = 0;
    this.reset = function() {
        this.winners = [];
        this.winningTeams = [];
        this.varA = 0;
        this.varB = 0;
        this.varC = 0;
        this.varD = 0;
        this.varE = 0;
        this.varF = 0;
        this.varG = 0;
        this.varH = 0;
        this.varI = 0;
        this.varJ = 0;
        this.varK = 0;
        this.varL = 0;
        this.varM = 0;
        this.varN = 0;
        this.varO = 0;
        this.varP = 0;
        this.varQ = 0;
        this.varR = 0;
        this.varS = 0;
        this.varT = 0;
        this.varU = 0;
        this.varV = 0;
        this.varW = 0;
        this.varX = 0;
        this.varY = 0;
        this.varZ = 0;
    };
    this.setVar = function(letter, value) {
        //console.log("setting var: " + letter + " " + value);
        letter = letter.toLowerCase();
        switch (letter) {
            case "a":
                this.varA = value;
                break;
            case "b":
                this.varB = value;
                break;
            case "c":
                this.varC = value;
                break;
            case "d":
                this.varD = value;
                break;
            case "e":
                this.varE = value;
                break;
            case "f":
                this.varF = value;
                break;
            case "g":
                this.varG = value;
                break;
            case "h":
                this.varH = value;
                break;
            case "i":
                this.varI = value;
                break;
            case "j":
                this.varJ = value;
                break;
            case "k":
                this.varK = value;
                break;
            case "l":
                this.varL = value;
                break;
            case "m":
                this.varM = value;
                break;
            case "n":
                this.varN = value;
                break;
            case "o":
                this.varO = value;
                break;
            case "p":
                this.varP = value;
                break;
            case "q":
                this.varQ = value;
                break;
            case "r":
                this.varR = value;
                break;
            case "s":
                this.varS = value;
                break;
            case "t":
                this.varT = value;
                break;
            case "u":
                this.varU = value;
                break;
            case "v":
                this.varV = value;
                break;
            case "w":
                this.varW = value;
                break;
            case "x":
                this.varX = value;
                break;
            case "y":
                this.varY = value;
                break;
            case "z":
                this.varZ = value;
                break;
        }
    };

    this.getVar = function(letter) {
        //console.log("getting var: " + letter);
        letter = letter.toLowerCase();
        var value = 0;
        switch (letter) {
            case "a":
                value = this.varA;
                break;
            case "b":
                value = this.varB;
                break;
            case "c":
                value = this.varC;
                break;
            case "d":
                value = this.varD;
                break;
            case "e":
                value = this.varE;
                break;
            case "f":
                value = this.varF;
                break;
            case "g":
                value = this.varG;
                break;
            case "h":
                value = this.varH;
                break;
            case "i":
                value = this.varI;
                break;
            case "j":
                value = this.varJ;
                break;
            case "k":
                value = this.varK;
                break;
            case "l":
                value = this.varL;
                break;
            case "m":
                value = this.varM;
                break;
            case "n":
                value = this.varN;
                break;
            case "o":
                value = this.varO;
                break;
            case "p":
                value = this.varP;
                break;
            case "q":
                value = this.varQ;
                break;
            case "r":
                value = this.varR;
                break;
            case "s":
                value = this.varS;
                break;
            case "t":
                value = this.varT;
                break;
            case "u":
                value = this.varU;
                break;
            case "v":
                value = this.varV;
                break;
            case "w":
                value = this.varW;
                break;
            case "x":
                value = this.varX;
                break;
            case "y":
                value = this.varY;
                break;
            case "z":
                value = this.varZ;
                break;
        }
        //console.log("return " + value);
        return value;
    };
}

function OldScoreItem(id, gameId, sort, scoreItem) {
    this.id = id;
    this.gameId = gameId;
    this.sort = sort;
    this.scoreItem = scoreItem;
}

function ScoreItem(scoreItemText) {
    this.id = "";
    this.scoreName = "";
    this.scoreType = "";
    this.scoreValues = [];
    this.scoreValue = 0;
    this.divideBy = 1;
    this.square = false;
    this.scoreDefault = 0;
    this.scorePickRounds = false;
    this.scoreItemText = scoreItemText;
    this.round = "normal";
    this.min = -100;
    this.max = 0;
    this.maxWrite = "";
    this.tally = true;
    this.saveVar = false;
    this.saveVarLetter = "A";
    this.buttonHalf = false;
    this.button1 = true;
    this.button5 = true;
    this.button10 = true;
    this.button50 = false;
    this.button100 = false;
    this.button500 = false;
    this.button1000 = false;
    this.button5000 = false;
    this.button10000 = false;
    this.buttonmHalf = false;
    this.buttonm1 = true;
    this.buttonm5 = false;
    this.buttonm10 = false;
    this.buttonm50 = false;
    this.buttonm100 = false;
    this.buttonm500 = false;
    this.buttonm1000 = false;
    this.buttonm5000 = false;
    this.buttonm10000 = false;
    this.processScoreItem = function(myDetails, callback) {
        //console.log("process");
        var s = scoreItemText;
        var a = s.split("|");
        for (var i = 0; i < a.length; i++) {
            var b = a[i].split("=");
            b[0] = b[0].toLowerCase();
            b[0] = b[0].trimMore();
            switch (b[0]) {
                case "type":
                    this.scoreType = b[1].toLowerCase();
                    var types = b[1].toLowerCase();
                    //console.log(types);
                    switch (types) {
                        case "combo":
                            break;
                        case "toggle":
                            break;
                        case "tally":
                            break;
                        case "hiddentally":
                            break;
                        case "counter":
                            break;
                        case "footnote":
                            break;
                        case "math":
                            break;
                        default:
                            this.scoreType = "footnote";
                            this.scoreName = "Error with type: " + b[1];
                            Toast.toast("Unknown type: " + b[1]);
                            break;
                    }
                    break;
                case "factions":
                    var facts;
                    facts = b[1].split(",");
                    var m = facts.length;
                    //console.log("Factions: " + m);
                    for (var j = 0; j < m; j++) {
                        myDetails.factions.push(facts[j].trim());
                    }
                    //console.log("Factions:");
                    //console.log(myDetails.factions);
                    break;
                case "square":
                    this.square = true;
                    break;
                case "min":
                    this.min = parseInt(b[1], 10);
                    break;
                case "max":
                    this.max = parseInt(b[1], 10);
                    this.maxWrite = ' max="' + this.max + '"';
                    break;
                case "rounding":
                    b[1] = b[1].toLowerCase();
                    b[1] = b[1].trimMore();
                    switch (b[1]) {
                        case "normal":
                            this.round = "normal";
                            break;
                        case "half":
                            this.round = "half";
                            break;
                        case "quarter":
                            this.round = "quarter";
                            break;
                        case "up":
                            this.round = "up";
                            break;
                        case "down":
                            this.round = "down";
                            break;
                        default:
                            Toast.toast("Unknown Rounding value: " + b[1]);
                            break;
                    }
                    break;
                case "buttonon":
                    b[1] = b[1].toLowerCase();
                    b[1] = b[1].trimMore();
                    switch (b[1]) {
                        case "-10000":
                            this.buttonm10000 = true;
                            break;
                        case "-5000":
                            this.buttonm5000 = true;
                            break;
                        case "-1000":
                            this.buttonm1000 = true;
                            break;
                        case "-500":
                            this.buttonm500 = true;
                            break;
                        case "-100":
                            this.buttonm100 = true;
                            break;
                        case "-50":
                            this.buttonm50 = true;
                            break;
                        case "-10":
                            this.buttonm10 = true;
                            break;
                        case "-5":
                            this.buttonm5 = true;
                            break;
                        case "-1":
                            this.buttonm1 = true;
                            break;
                        case "-half":
                            this.buttonmHalf = true;
                            break;
                        case "half":
                            this.buttonHalf = true;
                            break;
                        case "1":
                            this.button1 = true;
                            break;
                        case "5":
                            this.button5 = true;
                            break;
                        case "10":
                            this.button10 = true;
                            break;
                        case "50":
                            this.button50 = true;
                            break;
                        case "100":
                            this.button100 = true;
                            break;
                        case "500":
                            this.button500 = true;
                            break;
                        case "1000":
                            this.button1000 = true;
                            break;
                        case "5000":
                            this.button5000 = true;
                            break;
                        case "10000":
                            this.button10000 = true;
                            break;
                        default:
                            Toast.toast("Unknown ButtonOn value: " + b[1]);
                            break;
                    }
                    break;
                case "buttonoff":
                    b[1] = b[1].toLowerCase();
                    b[1] = b[1].trimMore();
                    switch (b[1]) {
                        case "-10000":
                            this.buttonm10000 = false;
                            break;
                        case "-5000":
                            this.buttonm5000 = false;
                            break;
                        case "-1000":
                            this.buttonm1000 = false;
                            break;
                        case "-500":
                            this.buttonm500 = false;
                            break;
                        case "-100":
                            this.buttonm100 = false;
                            break;
                        case "-50":
                            this.buttonm50 = false;
                            break;
                        case "-10":
                            this.buttonm10 = false;
                            break;
                        case "-5":
                            this.buttonm5 = false;
                            break;
                        case "-1":
                            this.buttonm1 = false;
                            break;
                        case "-half":
                            this.buttonmHalf = false;
                            break;
                        case "half":
                            this.buttonHalf = false;
                            break;
                        case "1":
                            this.button1 = false;
                            break;
                        case "5":
                            this.button5 = false;
                            break;
                        case "10":
                            this.button10 = false;
                            break;
                        case "50":
                            this.button50 = false;
                            break;
                        case "100":
                            this.button100 = false;
                            break;
                        case "500":
                            this.button500 = false;
                            break;
                        case "1000":
                            this.button1000 = false;
                            break;
                        case "5000":
                            this.button5000 = false;
                            break;
                        case "10000":
                            this.button10000 = false;
                            break;
                        default:
                            Toast.toast("Unknown ButtonOff value: " + b[1]);
                            break;
                    }
                    break;
                case "notally":
                    //don't add this value to the player's score
                    this.tally = false;
                    break;
                case "savevar":
                    //save the value to a variable
                    this.saveVar = true;
                    this.saveVarLetter = b[1];
                    break;
                case "name":
                    this.scoreName = b[1];
                    this.id = b[1].sanitize();
                    break;
                case "value":
                    this.scoreValue = b[1];
                    break;
                case "values":
                    this.scoreValues = b[1].split(",");
                    break;
                case "default":
                    this.scoreDefault = b[1];
                    break;
                case "divideby":
                    this.divideBy = b[1];
                    break;
                case "pickrounds":
                    if (b[1].toLowerCase() == "true") {
                        myDetails.pickRounds = true;
                    } else {
                        myDetails.pickRounds = false;
                    }
                    break;
                case "rounds":
                    myDetails.rounds = parseInt(b[1], 10);
                    break;
                case "lowpointswin":
                    //console.log("setting LowPointsWin=" + b[1]);
                    if (b[1] == 'True') {
                        //console.log("true");
                        myDetails.lowPointsWin = true;
                    } else {
                        //console.log("false");
                        myDetails.lowPointsWin = false;
                    }
                    break;
                case "coop":
                    if (b[1] == 'True') {
                        //console.log("true");
                        myDetails.coop = true;
                    } else {
                        //console.log("false");
                        myDetails.coop = false;
                    }
                    break;
                case "math":
                    var math = b[1].toLowerCase();
                    switch (math) {
                        case "sum":
                            break;
                        case "subtract":
                            break;
                        case "multiply":
                            break;
                        case "divide":
                            break;
                        case "inrange":
                            break;
                        case "greaterthan":
                            break;
                        case "lessthan":
                            break;
                        case "largest":
                            break;
                        case "smallest":
                            break;
                        case "square":
                            break;
                        default:
                            Toast.toast("Unknown Math type: " + b[1]);
                            break;
                    }
                    break;
                case "":
                    break;
                default:
                    Toast.toast("Unknown Value: '" + b[0] + "'");
                    break;
            }
        }
        if (callback !== undefined) {
            //console.log("callback from process score item");

            callback(myDetails);
        }
    };
}