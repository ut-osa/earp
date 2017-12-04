//Storage

var WebSqlStore = function(successCallback, errorCallback, that) {
    "use strict";
    console.log("bdebug2: " + Globals.bDebug);
    if (Globals.bDebug === false) {
        Globals.deleteWebSQL = false;
    }
    this.initializeDatabase = function(successCallback, errorCallback) {
        var self = this;
        this.db = window.openDatabase("dbScore", "1.0", "ScoreGeek Game DB", 1000000);
        this.db.transaction(
                function(tx) {
                    if (Globals.deleteWebSQL === true) {
                    var r=confirm("Really delete all websql data (users, passwords, settings)?");
                    if (r===true)
                      {
                      Globals.deleteWebSQL = true;
                      }
                    else
                      {
                      Globals.deleteWebSQL = false;
                      }}
                    self.createTblGames(tx);
                    self.createTblGamesCustom(tx);
                    self.createTblScoreItems(tx);
                    self.createTblScoreItemsCustom(tx);
                    self.createTblPlayers(tx); //
                    self.createTblSessions(tx); //
                    self.createTblScores(tx); //
                    self.createTblAwards(tx);//
                    self.createTblAwardsEarned(tx); //
                    self.createTblSettings(tx);
                    self.createTblCloudQueue(tx);//
                    self.createTblCloudBlob(tx); //
                    self.createTblCloudHist(tx); //
                    self.addSampleGameData(tx);
                    self.addSampleScorecardData(tx);
                    //self.addSamplePlayerData(tx);
                    self.addSampleAwardData(tx);
                    //self.addSampleSessionData(tx);
                },
                function(error) {
                    alertDebug('Transaction error1: ' + error.code + error.message);
                    if (errorCallback) {
                        errorCallback(error.message);
                    }
                },
                function() {
                    //console.log('Transaction success');
                    if (successCallback) {
                        
                        successCallback(that);
                    }
                }
        );
    };
    
    this.findAllCloudQueue = function(callback) {
        //console.log("find all clouds");
        this.db.transaction(
            function(tx) {

                var sql = "SELECT * FROM tblCloudQueue WHERE cloud_id >= ?";
                
                tx.executeSql(sql, ["0"], function(tx, results) {
                    var len = results.rows.length,
                        ret = [],
                        i = 0;
                    //console.log("len: " + len);
                    for (i=0; i < len; i++) {
                        ret[i] = results.rows.item(i);
                        //console.log("push: " + ret[i]);
                    }
                    callback(ret);
                },
                function(tx, error) {
                    alertDebug("Error: " + error.message + " in " + sql);  
                });
            },
            function(error) {
                alertDebug("Transaction Error2a: " + error.message);
                callback(empty);
            }
        );
    };
    
    this.findGameByIdNew = function(id, callback) {
        //console.log("find game " + id);
        this.db.transaction(
            function(tx) {

                var sql = "SELECT * FROM tblGames WHERE game_id=?" ;
                
                tx.executeSql(sql, [id], function(tx, results) {
                    var len = results.rows.length,
                        ret = [],
                        i = 0;
                    //console.log("len: " + len);
                    for (i=0; i < len; i++) {
                        ret[i] = results.rows.item(i);
                        //console.log("push: " + games.length);
                    }
                    callback(ret);
                });
            },
            function(error) {
                alertDebug("Transaction Error3: " + error.message);
                callback(empty);
            }
        );
    };

    this.findScoreItemsByIdNew = function(o, callback) {
        //console.log("find scoreitems by " + o.game_id);
        this.db.transaction(
            function(tx) {

                var sql = "SELECT * FROM tblScoreItems WHERE game_id=? ORDER BY sort" ;
                
                tx.executeSql(sql, [o.game_id], function(tx, results) {
                    var len = results.rows.length,
                        ret = [],
                        i = 0;
                    //console.log("len: " + len);
                    for (i=0; i < len; i++) {
                        ret[i] = results.rows.item(i);
                        //console.log("push: " + games.length);
                    }
                    callback(o, ret);
                });
            },
            function(error) {
                alertDebug("Transaction Error4: " + error.message);
                callback(empty);
            }
        );
    };
    
    this.findCustomScoreItemsByIdNew = function(o2, callback) {
        //console.log("find custom scoreitems by " + o2.game_id);
        this.db.transaction(
            function(tx) {

                var sql = "SELECT * FROM tblScoreItemsCustom WHERE game_id=? ORDER BY sort" ;
                
                tx.executeSql(sql, [o2.game_id], function(tx, results) {
                    var len = results.rows.length,
                        ret = [],
                        i = 0;
                    //console.log("len: " + len);
                    for (i=0; i < len; i++) {
                        ret[i] = results.rows.item(i);
                        //console.log("push: " + games.length);
                    }
                    callback(o2, ret);
                });
            },
            function(error) {
                //alertDebug("Transaction Error5: " + error.message);
                //var empty=[];
                callback(empty);
            }
        );
    };
    
    this.findAllCloudBlob = function(callback) {
        //console.log("find all cloud blobs");
        this.db.transaction(
            function(tx) {
                var sql = "SELECT cloud_blob_id, cloud_blob_data, cloud_local_id FROM tblCloudBlob";
                
                tx.executeSql(sql, [], function(tx, results) {
                    var len = results.rows.length,
                        ret = [],
                        i = 0;
                    //console.log("len: " + len);
                    for (i=0; i < len; i++) {
                        ret[i] = results.rows.item(i);
                        //console.log("push: " + games.length);
                    }
                    //console.log(ret);
                    callback(ret);
                });
            },
            function(error) {
                alertDebug("Transaction Error6: " + error.message);
                //var empty=[];
                callback(empty);
            }
        );
    };
    
    
    
    this.findAllCloudHist = function(callback) {
        //console.log("find all cloud hist");
        
        function errorCB(err) {
            alertDebug("Error processing SQL: "+err.code + " " + err.message);
            callback([]);
        }
        
        function dataHandler(tx, results) {
            var len = results.rows.length,
                ret = [],
                i = 0;
            //console.log("len: " + len);
            for (i=0; i < len; i++) {
                ret[i] = results.rows.item(i);
                //console.log("push: " + games.length);
            }
            
            callback(ret);
        }
        
        this.db.transaction(
            function(tx) {

                var sql = "SELECT * FROM tblCloudHist WHERE cloud_id >= ?";
                
                tx.executeSql(sql, ["0"], dataHandler, errorCB);
            },
            function(error) {
                alertDebug("Transaction Error7: " + error.code + " " + error.message);
                //var empty=[];
                callback(empty);
            }
        );
    };
    
    this.findAllSessions = function(callback) {
        //console.log("find all sessions");
        this.db.transaction(
            function(tx) {

                var sql = "SELECT * FROM tblSessions";
                
                tx.executeSql(sql, [], function(tx, results) {
                    var len = results.rows.length,
                        ret = [],
                        i = 0;
                    //console.log("len: " + len);
                    for (i=0; i < len; i++) {
                        ret[i] = results.rows.item(i);
                        //console.log("push: " + games.length);
                    }
                    callback(ret);
                });
            },
            function(error) {
                alertDebug("Transaction Error8: " + error.message);
                //var empty=[];
                callback(empty);
            }
        );
    };
    
    this.findAllSettings = function(callback) {
        //console.log("find all settings");
        this.db.transaction(
            function(tx) {

                var sql = "SELECT * FROM tblSettings";
                
                tx.executeSql(sql, [], function(tx, results) {
                    var len = results.rows.length,
                        ret = [],
                        i = 0;
                    //console.log("len: " + len);
                    for (i=0; i < len; i++) {
                        ret[i] = results.rows.item(i);
                        //console.log("push: " + games.length);
                    }
                    callback(ret);
                });
            },
            function(error) {
                alertDebug("Transaction Error9: " + error.message);
                //var empty=[];
                callback(empty);
            }
        );
    };
    
    this.findAllScoreItems = function(callback) {
        //console.log("find all score items");
        this.db.transaction(
            function(tx) {

                var sql = "SELECT * FROM tblScoreItems";
                
                tx.executeSql(sql, [], function(tx, results) {
                    var len = results.rows.length,
                        ret = [],
                        i = 0;
                    //console.log("len: " + len);
                    for (i=0; i < len; i++) {
                        ret[i] = results.rows.item(i);
                        //console.log("push: " + games.length);
                    }
                    callback(ret);
                });
            },
            function(error) {
                alertDebug("Transaction Error9aa: " + error.message);
                //var empty=[];
                callback(empty);
            }
        );
    };
    
    this.findAllCustomScoreItems = function(callback) {
        //console.log("find all score items");
        this.db.transaction(
            function(tx) {

                var sql = "SELECT * FROM tblScoreItemsCustom";
                
                tx.executeSql(sql, [], function(tx, results) {
                    var len = results.rows.length,
                        ret = [],
                        i = 0;
                    //console.log("len: " + len);
                    for (i=0; i < len; i++) {
                        ret[i] = results.rows.item(i);
                        //console.log("push: " + games.length);
                    }
                    callback(ret);
                });
            },
            function(error) {
                alertDebug("Transaction Error9bb: " + error.message);
                //var empty=[];
                callback(empty);
            }
        );
    };
    
    this.findAllScores = function(callback) {
        //console.log("find all scores");
        this.db.transaction(
            function(tx) {

                var sql = "SELECT * FROM tblScores ORDER BY score_id DESC";
                
                tx.executeSql(sql, [], function(tx, results) {
                    var len = results.rows.length,
                        ret = [],
                        i = 0;
                    //console.log("len: " + len);
                    for (i=0; i < len; i++) {
                        ret[i] = results.rows.item(i);
                        //console.log("push: " + games.length);
                    }
                    callback(ret);
                });
            },
            function(error) {
                alertDebug("Transaction Error10: " + error.message);
                //var empty=[];
                callback(empty);
            }
        );
    };
    
    this.findAllAwardsEarned = function(callback) {
        //console.log("find all awards");
        this.db.transaction(
            function(tx) {

                var sql = "SELECT * FROM tblAwardsEarned";
                
                tx.executeSql(sql, [], function(tx, results) {
                    var len = results.rows.length,
                        ret = [],
                        i = 0;
                    //console.log("len: " + len);
                    for (i=0; i < len; i++) {
                        ret[i] = results.rows.item(i);
                        //console.log("push: " + games.length);
                    }
                    callback(ret);
                });
            },
            function(error) {
                alertDebug("Transaction Error11: " + error.message);
                //var empty=[];
                callback(empty);
            }
        );
    };
    
    this.findAllPlayers = function(callback) {
        //console.log("find all players");
        this.db.transaction(
            function(tx) {

                var sql = "SELECT * FROM tblPlayers";
                
                tx.executeSql(sql, [], function(tx, results) {
                    var len = results.rows.length,
                        ret = [],
                        i = 0;
                    //console.log("len: " + len);
                    for (i=0; i < len; i++) {
                        ret[i] = results.rows.item(i);
                        //console.log("push: " + games.length);
                    }
                    callback(ret);
                });
            },
            function(error) {
                alertDebug("Transaction Error12: " + error.message);
                //var empty=[];
                callback(empty);
            }
        );
    };

    this.findAllCustomGames = function(callback) {
        //console.log("find all custom games");
        this.db.transaction(
            function(tx) {

                var sql = "SELECT * FROM tblGamesCustom";
                
                tx.executeSql(sql, [], function(tx, results) {
                     var len = results.rows.length,
                        ret = [],
                        i = 0;
                    //console.log("len: " + len);
                    for (i=0; i < len; i++) {
                        ret[i] = results.rows.item(i);
                        //console.log("push: " + games.length);
                    }
                    callback(ret);
                });
            },
            function(error) {
                alertDebug("Transaction Error13: " + error.message);
                //var empty=[];
                callback(empty);
            }
        );
    };
    
    this.findAllGames = function(callback) {
        //console.log("find all games");
        this.db.transaction(
            function(tx) {

                var sql = "SELECT * FROM tblGames";
                
                tx.executeSql(sql, [], function(tx, results) {
                     var len = results.rows.length,
                        ret = [],
                        i = 0;
                    //console.log("len: " + len);
                    for (i=0; i < len; i++) {
                        ret[i] = results.rows.item(i);
                        //console.log("push: " + games.length);
                    }
                    callback(ret);
                });
            },
            function(error) {
                alertDebug("Transaction Error14: " + error.message);
                //var empty=[];
                callback(empty);
            }
        );
    };
    
    this.createTblGames = function(tx) {
        var sql;
        tx.executeSql('DROP TABLE IF EXISTS tblGames');
        sql = "CREATE TABLE IF NOT EXISTS tblGames ( " +
            "game_id VARCHAR(50) PRIMARY KEY, " +
            "game_bggid VARCHAR(50), " +
            "game_name VARCHAR(50), " +
            "game_icon VARCHAR(50), " +
            "game_custom TINYINT(4) DEFAULT '0', " +
            "game_scoreType VARCHAR(50), " +
            "game_advancedText VARCHAR(1500), " + 
            "game_visible TINYINT DEFAULT '-1', " + 
            "game_pickRounds TINYINT(4) DEFAULT '0')";
        tx.executeSql(sql, null, function() {
            //console.log('INSERT success');
            },function(tx, error) {
                //console.log(tx + ' error: ' + error.message);
                });
    };
    
    this.createTblGamesCustom = function(tx) {
        var sql;
        if (Globals.deleteWebSQL === true) {
            tx.executeSql('DROP TABLE IF EXISTS tblGamesCustom');   
        }
        sql = "CREATE TABLE IF NOT EXISTS tblGamesCustom ( " +
            "game_id VARCHAR(50) PRIMARY KEY, " +
            "game_bggid VARCHAR(50), " +
            "game_name VARCHAR(50), " +
            "game_icon VARCHAR(50), " +
            "game_custom TINYINT(4) DEFAULT '-1', " +
            "game_scoreType VARCHAR(50) DEFAULT 'points', " +
            "game_advancedText VARCHAR(1500), " +
            "game_visible TINYINT DEFAULT '-1', " + 
            "game_pickRounds TINYINT(4) DEFAULT '0')";
        tx.executeSql(sql, null, function() {
            //console.log('INSERT success');
            },function(tx, error) {
                //console.log(tx + ' error: ' + error.message);
                });
    };
    this.createTblScoreItems = function(tx) {
        var sql;
        tx.executeSql('DROP TABLE IF EXISTS tblScoreItems');
        sql = "CREATE TABLE IF NOT EXISTS tblScoreItems ( " +
            "item_id INTEGER PRIMARY KEY AUTOINCREMENT, " +
            "game_id INTEGER, " +
            "sort INTEGER, " + 
            "scoreitem VARCHAR(100))";
        tx.executeSql(sql, null, function() {
            //console.log('INSERT success');
            },function(tx, error) {
                //console.log(tx + ' error: ' + error.message);
                });
    };
    this.createTblScoreItemsCustom = function(tx) {
        var sql;
        if (Globals.deleteWebSQL === true) {
            tx.executeSql('DROP TABLE IF EXISTS tblScoreItemsCustom');  
        }
        sql = "CREATE TABLE IF NOT EXISTS tblScoreItemsCustom ( " +
            "item_id INTEGER PRIMARY KEY AUTOINCREMENT, " +
            "game_id VARCHAR(50), " +
            "sort INTEGER, " + 
            "scoreitem VARCHAR(100))";
        tx.executeSql(sql, null, function() {
            //console.log('INSERT success');
            },function(tx, error) {
                //console.log(tx + ' error: ' + error.message);
                });
    };
    this.createTblPlayers = function(tx) {  
        var sql;  
        if (Globals.deleteWebSQL === true) {
            tx.executeSql('DROP TABLE IF EXISTS tblPlayers');   
        }
        sql = "CREATE TABLE IF NOT EXISTS tblPlayers ( " +
            "player_id VARCHAR(150) PRIMARY KEY, " +
            "player_name VARCHAR(50), " +
            "player_bggusername VARCHAR(100), " + 
            "player_twitter VARCHAR(100), " +
            "player_visible TINYINT DEFAULT '-1', " + 
            "player_device_hidden TINYINT DEFAULT '0', " + 
            "player_icon LONGTEXT DEFAULT 'img/players/Player1.png')";
        tx.executeSql(sql, null, function() {
            //console.log('INSERT success');
            },function(tx, error) {
                //console.log(tx + ' error: ' + error.message);
                });
    };
    this.createTblSessions = function(tx) {
        var sql;
        if (Globals.deleteWebSQL === true) {
            tx.executeSql('DROP TABLE IF EXISTS tblSessions');  
        }
        sql = "CREATE TABLE IF NOT EXISTS tblSessions ( " +
            "session_id INTEGER PRIMARY KEY, " +
            "game_id INTEGER, " +
            "winner_id VARCHAR(150), " +
            "winner_name VARCHAR(450), " + 
            "winner_points INTEGER, " +
            "game_name VARCHAR(450), " +
            "game_custom TINYINT(4), " +
            "game_photo LONGTEXT, " + 
            "game_date DATETIME, " +
            "game_won TINYINT(4), " + 
            "game_notes VARCHAR(1500))";
        tx.executeSql(sql, null, function() {
            //console.log('INSERT success');
            },function(tx, error) {
                //console.log(tx + ' error: ' + error.message);
                });
        sql = "ALTER TABLE tblSessions ADD game_location VARCHAR(450)";
        try {
                 tx.executeSql(sql, null, function() {
                     //console.log('Alter success');
                     },function(tx, error) {
                         //console.log(tx + ' error: ' + error.message);
                         });   
        } catch(err) {
            //do nothing
        }
        sql = "ALTER TABLE tblSessions ADD game_duration INTEGER";
        try {
                 tx.executeSql(sql, null, function() {
                     //console.log('Alter success');
                     },function(tx, error) {
                         //console.log(tx + ' error: ' + error.message);
                         });   
        } catch(err) {
            //do nothing
        }
        
    };
    this.createTblScores = function(tx) {
        var sql;
        if (Globals.deleteWebSQL === true) {
            tx.executeSql('DROP TABLE IF EXISTS tblScores');    
        }
        sql = "CREATE TABLE IF NOT EXISTS tblScores ( " +
            "score_id INTEGER PRIMARY KEY, " +
            "session_id INTEGER, " +
            "player_id VARCHAR(150), " +
            "score INTEGER, " +  
            "win TINYINT(4))";
        tx.executeSql(sql, null, function() {
            //console.log('INSERT success');
            },function(tx, error) {
                //console.log(tx + ' error: ' + error.message);
                });
    };
    this.createTblAwards = function(tx) {
        var sql;
        if (Globals.deleteWebSQL === true) {
            tx.executeSql('DROP TABLE IF EXISTS tblAwards');    
        }
        sql = "CREATE TABLE IF NOT EXISTS tblAwards ( " +
            "award_id INTEGER PRIMARY KEY, " +
            "award_desc VARCHAR(450), " + 
            "award_name VARCHAR(450), " + 
            "award_icon VARCHAR(450))";
        tx.executeSql(sql, null, function() {
            //console.log('INSERT success');
            },function(tx, error) {
                //console.log(tx + ' error: ' + error.message);
                });
    };
    this.createTblAwardsEarned = function(tx) {
        var sql;
        if (Globals.deleteWebSQL === true) {
            tx.executeSql('DROP TABLE IF EXISTS tblAwardsEarned');  
        }
        sql = "CREATE TABLE IF NOT EXISTS tblAwardsEarned ( " +
            "earned_id INTEGER PRIMARY KEY, " +
            "award_id INTEGER, " +
            "award_value INTEGER, " + 
            "award_date DATETIME, " + 
            "award_data VARCHAR(450), " + 
            "game_id VARCHAR(50), " + 
            "game_custom TINYINT(4), " + 
            "game_icon LONGTEXT, " + 
            "game_name VARCHAR(150), " +
            "session_id INTEGER, " +
            "player_name VARCHAR(150), " + 
            "player_twitter VARCHAR(150), " + 
            "player_id VARCHAR(150))";
        tx.executeSql(sql, null, function() {
            //console.log('INSERT success');
            },function(tx, error) {
                //console.log(tx + ' error: ' + error.message);
                });
    };
    this.createTblSettings = function(tx) {
        var sql;
        if (Globals.deleteWebSQL === true) {
            tx.executeSql('DROP TABLE IF EXISTS tblSettings');  
        }
        sql = "CREATE TABLE IF NOT EXISTS tblSettings ( " +
            "setting_name VARCHAR(50) PRIMARY KEY, " +
            "setting_value VARCHAR(450))"; 
        tx.executeSql(sql, null, function() {
            //console.log('INSERT success');
            },function(tx, error) {
                //console.log(tx + ' error: ' + error.message);
                });
    };
    this.createTblCloudQueue = function(tx) {
        var sql;
        if (Globals.deleteWebSQL === true) {
            tx.executeSql('DROP TABLE IF EXISTS tblCloudQueue');    
        }
        sql = "CREATE TABLE IF NOT EXISTS tblCloudQueue ( " +
            "cloud_id INTEGER PRIMARY KEY AUTOINCREMENT, " +
            "cloud_data LONGTEXT, " + 
            "cloud_hasblob TINYINT, " +
            "cloud_isblob TINYINT, " +  
            "cloud_piece_id INTEGER, " +
            "cloud_id_remote INTEGER DEFAULT 0, " + 
            "cloud_data_id VARCHAR(450))"; 
        tx.executeSql(sql, null, function() {
            //console.log('INSERT success');
            },function(tx, error) {
                //console.log(tx + ' error: ' + error.message);
                });
    };
    this.createTblCloudBlob = function(tx) {
        var sql;
        if (Globals.deleteWebSQL === true) {
            tx.executeSql('DROP TABLE IF EXISTS tblCloudBlob'); 
        }
        sql = "CREATE TABLE IF NOT EXISTS tblCloudBlob ( " +
            "cloud_blob_id INTEGER PRIMARY KEY AUTOINCREMENT, " +
            "cloud_blob_data LONGTEXT, " + 
            "cloud_local_id INTEGER)"; 
        tx.executeSql(sql, null, function() {
            //console.log('INSERT success');
            },function(tx, error) {
                //console.log(tx + ' error: ' + error.message);
                });
    };
    this.createTblCloudHist = function(tx) {    
        var sql; 
        if (Globals.deleteWebSQL === true) {
            tx.executeSql('DROP TABLE IF EXISTS tblCloudHist'); 
        }
        sql = "CREATE TABLE IF NOT EXISTS tblCloudHist ( " +
            "cloud_id VARCHAR(150) PRIMARY KEY)";
        tx.executeSql(sql, null, function() {
            //console.log('INSERT success');
            },function(tx, error) {
                //console.log(tx + ' error: ' + error.message);
                });
    };
    
    this.addSampleAwardData = function(tx, awards) {
        awards = [
                {"award_id": 0, "award_name": "Total Games Played", "award_desc": "You scored $$VALUE$$ game$$S$$!", "award_icon": "img/awards/Award0.png"},
                {"award_id": 1, "award_name": "Game High Score", "award_desc": "$$PLAYER$$ achieved a record score of $$VALUE$$ point$$S$$ in $$GAME$$!", "award_icon": "img/awards/Award1.png"},
                {"award_id": 2, "award_name": "Game Wins", "award_desc": "$$PLAYER$$ achieved a record of $$VALUE$$ win$$S$$ in $$GAME$$!", "award_icon": "img/awards/Award2.png"},
                {"award_id": 3, "award_name": "Game Plays", "award_desc": "$$PLAYER$$ has $$VALUE$$ game$$S$$ scored in $$GAME$$!", "award_icon": "img/awards/Award3.png"},
                {"award_id": 4, "award_name": "Game Score Upset", "award_desc": "$$PLAYER$$ beat $$DATA$$, the record holder for high score in $$GAME$$!", "award_icon": "img/awards/Award4.png"},
                {"award_id": 5, "award_name": "Game Wins Upset", "award_desc": "$$PLAYER$$ beat $$DATA$$, the record holder for most wins in $$GAME$$!", "award_icon": "img/awards/Award5.png"},
                {"award_id": 6, "award_name": "Personal High Score", "award_desc": "$$PLAYER$$ achieved a personal high score of $$VALUE$$ in $$GAME$$!", "award_icon": "img/awards/Award6.png"},
                {"award_id": 7, "award_name": "Personal Wins", "award_desc": "$$PLAYER$$ won $$GAME$$ $$VALUE$$ time$$S$$!", "award_icon": "img/awards/Award7.png"},
                {"award_id": 8, "award_name": "Personal Plays", "award_desc": "$$PLAYER$$ played $$GAME$$ $$VALUE$$ time$$S$$!", "award_icon": "img/awards/Award8.png"},
                {"award_id": 9, "award_name": "Game Winning Streak", "award_desc": "$$PLAYER$$ won $$GAME$$ $$VALUE$$ times in a row!", "award_icon": "img/awards/Award9.png"},
                {"award_id": 10, "award_name": "Meta Winning Streak", "award_desc": "$$PLAYER$$ won $$VALUE$$ games in a row!", "award_icon": "img/awards/Award10.png"},
                {"award_id": 11, "award_name": "Meta Game Wins", "award_desc": "$$PLAYER$$ won $$VALUE$$ game$$S$$!", "award_icon": "img/awards/Award11.png"},
                {"award_id": 12, "award_name": "Biggest Game Winning Streak", "award_desc": "$$PLAYER$$ has the longest winning streak of $$VALUE$$ win$$S$$ in $$GAME$$!", "award_icon": "img/awards/Award12.png"},
                {"award_id": 13, "award_name": "Biggest Meta Winning Streak", "award_desc": "$$PLAYER$$ has the longest winning streak of $$VALUE$$ in all games!", "award_icon": "img/awards/Award13.png"}
            ]; 
        var l = awards.length;
        var sql = "INSERT OR REPLACE INTO tblAwards " +
            "(award_id, award_name, award_desc, award_icon) " +
            "VALUES (?, ?, ?, ?)";
        var g;
        for (var i = 0; i < l; i++) {
            g = awards[i];
            tx.executeSql(sql, [g.award_id, g.award_name, g.award_desc, g.award_icon], function() {
                //console.log('INSERT success');
                },function(tx, error) {
                    //console.log(tx + ' error: ' + error.message);
                    });
        }
    };

    this.addSampleGameData = function(tx, games) {
        games = [
                {"game_bggid": "822", "game_id": "Carcassonne", "game_name": "Carcassonne", "game_icon": "img/games/BoxCarcassonne.jpg"},
                {"game_bggid": "171", "game_id": "Chess", "game_name": "Chess", "game_icon": "img/games/BoxChess.jpg"},
                {"game_bggid": "18602", "game_id": "Caylus", "game_name": "Caylus", "game_icon": "img/games/BoxCaylus.jpg"},
                {"game_bggid": "3076", "game_id": "PuertoRico", "game_name": "Puerto Rico", "game_icon": "img/games/BoxPuertoRico.jpg"},
                {"game_bggid": "13", "game_id": "SettlersofCatanThe", "game_name": "Settlers of Catan, The", "game_icon": "img/games/BoxTheSettlersOfCatan.jpg"},
                {"game_bggid": "2453", "game_id": "Blokus", "game_name": "Blokus", "game_icon": "img/games/BoxBlokus.jpg"},
                {"game_bggid": "68448", "game_id": "7Wonders", "game_name": "7 Wonders", "game_icon": "img/games/Box7Wonders.jpg"},
                {"game_bggid": "6472", "game_id": "AGameofThronesFirstEdition", "game_name": "A Game of Thrones (first edition)", "game_icon": "img/games/BoxAGameOfThrones.jpg"},
                {"game_bggid": "31260", "game_id": "Agricola", "game_name": "Agricola", "game_icon": "img/games/BoxAgricola.jpg"},
                {"game_bggid": "43018", "game_id": "AgricolaFarmersoftheMoor", "game_name": "Agricola, Farmers of the Moor", "game_icon": "img/games/BoxAgricolaFarmersOfTheMoor.jpg"},
                {"game_bggid": "15987", "game_id": "ArkhamHorror", "game_name": "Arkham Horror", "game_icon": "img/games/BoxArkhamHorror.jpg"},
                {"game_bggid": "27225", "game_id": "Bananagrams", "game_name": "Bananagrams", "game_icon": "img/games/BoxBananagrams.jpg"},
                {"game_bggid": "2425", "game_id": "Battleship", "game_name": "Battleship", "game_icon": "img/games/BoxBattleship.jpg"},
                {"game_bggid": "37111", "game_id": "BattlestarGalactica", "game_name": "Battlestar Galactica", "game_icon": "img/games/BoxBattlestarGalactica.jpg"},
                {"game_bggid": "1293", "game_id": "Boggle", "game_name": "Boggle", "game_icon": "img/games/BoxBoggle.jpg"},
                {"game_bggid": "28720", "game_id": "Brass", "game_name": "Brass", "game_icon": "img/games/BoxBrass.jpg"},
                {"game_bggid": "5048", "game_id": "CandyLand", "game_name": "Candy Land", "game_icon": "img/games/BoxCandyLand.jpg"},
                {"game_bggid": "2083", "game_id": "Checkers", "game_name": "Checkers", "game_icon": "img/games/BoxCheckers.jpg"},
                {"game_bggid": "1294", "game_id": "Clue", "game_name": "Clue", "game_icon": "img/games/BoxClue.jpg"},
                {"game_bggid": "39856", "game_id": "Dixit", "game_name": "Dixit", "game_icon": "img/games/BoxDixit.jpg"},
                {"game_bggid": "62219", "game_id": "DominantSpecies", "game_name": "Dominant Species", "game_icon": "img/games/BoxDominantSpecies.jpg"},
                {"game_bggid": "36218", "game_id": "Dominion", "game_name": "Dominion", "game_icon": "img/games/BoxDominion.jpg"},
                {"game_bggid": "40834", "game_id": "DominionIntrigue", "game_name": "Dominion: Intrigue", "game_icon": "img/games/BoxDominionIntrigue.jpg"},
                {"game_bggid": "72125", "game_id": "Eclipse", "game_name": "Eclipse", "game_icon": "img/games/BoxEclipse.jpg"},
                {"game_bggid": "93", "game_id": "ElGrande", "game_name": "El Grande", "game_icon": "img/games/BoxElGrande.jpg"},
                {"game_bggid": "9216", "game_id": "Goa", "game_name": "Goa", "game_icon": "img/games/BoxGoa.jpg"},
                {"game_bggid": "30381", "game_id": "Hamburgum", "game_name": "Hamburgum", "game_icon": "img/games/BoxHamburgum.jpg"},
                {"game_bggid": "35677", "game_id": "LeHavre", "game_name": "Le Havre", "game_icon": "img/games/BoxLeHavre.jpg"},
                {"game_bggid": "96848", "game_id": "MageKnight", "game_name": "Mage Knight", "game_icon": "img/games/BoxMageKnight.jpg"},
                {"game_bggid": "1406", "game_id": "Monopoly", "game_name": "Monopoly", "game_icon": "img/games/BoxMonopoly.jpg"},
                {"game_bggid": "3737", "game_id": "Operation", "game_name": "Operation", "game_icon": "img/games/BoxOperation.jpg"},
                {"game_bggid": "70149", "game_id": "OraEtLabora", "game_name": "Ora Et Labora", "game_icon": "img/games/BoxOraEtLabora.jpg"},
                {"game_bggid": "2651", "game_id": "PowerGrid", "game_name": "Power Grid", "game_icon": "img/games/BoxPowerGrid.jpg"},
                {"game_bggid": "28143", "game_id": "RacefortheGalaxy", "game_name": "Race for the Galaxy", "game_icon": "img/games/BoxRaceForTheGalaxy.jpg"},
                {"game_bggid": "12962", "game_id": "ReefEncounter", "game_name": "Reef Encounter", "game_icon": "img/games/BoxReefEncounter.jpg"},
                {"game_bggid": "181", "game_id": "Risk", "game_name": "Risk", "game_icon": "img/games/BoxRisk.jpg"},
                {"game_bggid": "9217", "game_id": "SaintPetersburg", "game_name": "Saint Petersburg", "game_icon": "img/games/BoxSaintPetersburg.jpg"},
                {"game_bggid": "3", "game_id": "Samurai", "game_name": "Samurai", "game_icon": "img/games/BoxSamurai.jpg"},
                {"game_bggid": "8217", "game_id": "SanJuan", "game_name": "San Juan", "game_icon": "img/games/BoxSanJuan.jpg"},
                {"game_bggid": "320", "game_id": "Scrabble", "game_name": "Scrabble", "game_icon": "img/games/BoxScrabble.jpg"},
                {"game_bggid": "2407", "game_id": "Sorry", "game_name": "Sorry", "game_icon": "img/games/BoxSorry.jpg"},
                {"game_bggid": "2921", "game_id": "GameofLifeThe", "game_name": "Game of Life, The", "game_icon": "img/games/BoxTheGameOfLife.jpg"},
                {"game_bggid": "41114", "game_id": "ResistanceThe", "game_name": "Resistance, The", "game_icon": "img/games/BoxTheResistance.jpg"},
                {"game_bggid": "25613", "game_id": "ThroughtheAges", "game_name": "Through the Ages", "game_icon": "img/games/BoxThroughTheAges.jpg"},
                {"game_bggid": "9209", "game_id": "TickettoRide", "game_name": "Ticket to Ride", "game_icon": "img/games/BoxTicketToRide.jpg"},
                {"game_bggid": "14996", "game_id": "TickettoRideEurope", "game_name": "Ticket to Ride: Europe", "game_icon": "img/games/BoxTicketToRideEurope.jpg"},
                {"game_bggid": "42", "game_id": "TigrisandEuphrates", "game_name": "Tigris and Euphrates", "game_icon": "img/games/BoxTigrisAndEuphrates.jpg"},
                {"game_bggid": "88", "game_id": "Torres", "game_name": "Torres", "game_icon": "img/games/BoxTorres.jpg"},
                {"game_bggid": "2952", "game_id": "TrivialPursuit", "game_name": "Trivial Pursuit", "game_icon": "img/games/BoxTrivialPursuit.jpg"},
                {"game_bggid": "9609", "game_id": "WaroftheRingFirstEdition", "game_name": "War of the Ring (first edition)", "game_icon": "img/games/BoxWarOfTheRing.jpg"},
                {"game_bggid": "12333", "game_id": "TwilightStruggle", "game_name": "Twilight Struggle", "game_icon": "img/games/BoxTwilightStruggle.jpg"},
                {"game_bggid": "30549", "game_id": "Pandemic", "game_name": "Pandemic", "game_icon": "img/games/BoxPandemic.jpg"}, //win lose coop
                {"game_bggid": "478", "game_id": "Citadels", "game_name": "Citadels", "game_icon": "img/games/BoxCitadels.jpg"},
                {"game_bggid": "40692", "game_id": "Smallworld", "game_name": "Smallworld", "game_icon": "img/games/BoxSmallworld.jpg"},
                {"game_bggid": "50", "game_id": "LostCities", "game_name": "Lost Cities", "game_icon": "img/games/BoxLostCities.jpg"},
                {"game_bggid": "34635", "game_id": "StoneAge", "game_name": "Stone Age", "game_icon": "img/games/BoxStoneAge.jpg"},
                {"game_bggid": "92539", "game_id": "7WondersLeaders", "game_name": "7 Wonders - Leaders", "game_icon": "img/games/Box7WondersLeaders.jpg"},
                {"game_bggid": "111661", "game_id": "7WondersCities", "game_name": "7 Wonders - Cities", "game_icon": "img/games/Box7WondersCities.jpg"},
                {"game_bggid": "115746", "game_id": "WaroftheRingSecondEdition", "game_name": "War of the Ring (second edition)", "game_icon": "img/games/BoxWarOfTheRing2.jpg"},                
                {"game_bggid": "31627", "game_id": "TickettoRideNordicCountries", "game_name": "Ticket to Ride: Nordic Countries", "game_icon": "img/games/BoxTicketToRideNordic.jpg"},
                {"game_bggid": "103343", "game_id": "AGameofThronesSecondEdition", "game_name": "A Game of Thrones (second edition)", "game_icon": "img/games/BoxAGameOfThrones2.jpg"},
                {"game_bggid": "105134", "game_id": "RiskLegacy", "game_name": "Risk Legacy", "game_icon": "img/games/BoxRiskLegacy.jpg"}
                //risk legacy
                //{"game_id": "7WondersLeaders", "game_name": "", "game_icon": "img/games/Box.jpg"},
                //{"game_id": "7WondersCities", "game_name": "", "game_icon": "img/games/Box.jpg"},
                //{"game_id": 62, "game_name": "", "game_icon": "img/games/Box.jpg"},
                //{"game_id": 63, "game_name": "", "game_icon": "img/games/Box.jpg"},
                //{"game_id": 64, "game_name": "", "game_icon": "img/games/Box.jpg"},
                //{"game_id": 65, "game_name": "", "game_icon": "img/games/Box.jpg"},
                //{"game_id": 66, "game_name": "", "game_icon": "img/games/Box.jpg"},
                //{"game_id": 67, "game_name": "", "game_icon": "img/games/Box.jpg"},
                //{"game_id": 68, "game_name": "", "game_icon": "img/games/Box.jpg"},
                //{"game_id": 69, "game_name": "", "game_icon": "img/games/Box.jpg"},                
            ];
        var l = games.length;
        var sql = "INSERT OR REPLACE INTO tblGames " +
            "(game_id, game_bggid, game_name, game_icon) " +
            "VALUES (?, ?, ?, ?)";
        var g;
        for (var i = 0; i < l; i++) {
            g = games[i];
            tx.executeSql(sql, [g.game_id, g.game_bggid, g.game_name, g.game_icon], function() {
                //console.log('INSERT success');
                },function(tx, error) {
                    //console.log(tx + ' error: ' + error.message);
                    });
        }
    };

    this.addSampleScorecardData = function(tx, scoreitems) {
    //console.log("adding score item data");
        scoreitems = [
                //{"game_id": 1, "game_name": "Carcassonne", "game_icon": "img/games/BoxCarcassonne.jpg"},
                {"item_id": 1, "game_id": "Carcassonne", "sort": 0, "scoreitem": "Name=Points|Type=Counter|Value=1|Default=0"},
                //{"game_id": 2, "game_name": "Chess", "game_icon": "img/games/BoxChess.jpg"},
                {"item_id": 2, "game_id": "Chess", "sort": 0, "scoreitem": "Name=Win/Lose|Type=Toggle"},
                //{"item_id": 1, "game_id": 3, "game_name": "Caylus", "game_icon": "img/games/BoxCaylus.jpg"},
                {"item_id": 3, "game_id": "Caylus", "sort": 0, "scoreitem": "Name=Game Points|Type=Counter|Value=1|Default=0"},
                {"item_id": 4, "game_id": "Caylus", "sort": 1, "scoreitem": "Name=Total Deniers|Type=Counter|Value=1|Default=0|DivideBy=4"}, 
                {"item_id": 5, "game_id": "Caylus", "sort": 2, "scoreitem": "Name=Total Non-gold Cubes|Type=Counter|Value=1|Default=0|DivideBy=3"},
                {"item_id": 6, "game_id": "Caylus", "sort": 3, "scoreitem": "Name=Total Gold Cubes|Type=Counter|Value=3|Default=0"},
                //{"item_id" 1, "game_id": 4, "game_name": "Puerto Rico", "game_icon": "img/games/BoxPuertoRico.jpg"},
                {"item_id": 7, "game_id": "PuertoRico", "sort": 0, "scoreitem": "Name=VP Chips|Type=Counter|Value=1|Default=0"},
                {"item_id": 8, "game_id": "PuertoRico", "sort": 1, "scoreitem": "Name=Buiding Points|Type=Counter|Value=1|Default=0"},
                {"item_id": 9, "game_id": "PuertoRico", "sort": 2, "scoreitem": "Name=Large Building Points|Type=Counter|Value=1|Default=0"},
                {"item_id": 10, "game_id": "PuertoRico", "sort": 3, "scoreitem": "Name=Nobles|Type=Counter|Value=1|Default=0"},
                //{"item_id": 1, "game_id": 5, "game_name": "The Settlers of Catan", "game_icon": "img/games/BoxTheSettlersOfCatan.jpg"},
                {"item_id": 11, "game_id": "SettlersofCatanThe", "sort": 0, "scoreitem": "Name=Points|Type=Counter|Value=1|Default=0"},
                //{"item_id": 1, "game_id": 6, "game_name": "Blokus", "game_icon": "img/games/BoxBlokus.jpg"},
                {"item_id": 12, "game_id": "Blokus", "sort": 0, "scoreitem": "Name=Unplayed blocks|Type=Counter|Value=-1|Default=0"},
                {"item_id": 13, "game_id": "Blokus", "sort": 1, "scoreitem": "Name=Bonus Points|Type=Combo|Values=Some pieces remain^0,All pieces played^15,All pieces played and last piece monimo^20|"},
                //{"item_id": 1, "game_id": 8, "game_name": "7 Wonders", "game_icon": "img/games/BoxPowerGrid.jpg"},
                {"item_id": 14, "game_id": "7Wonders", "sort": 0, "scoreitem": "Name=Military (Red) Points|Type=Counter|Value=1|Default=0"},
                {"item_id": 15, "game_id": "7Wonders", "sort": 1, "scoreitem": "Name=Total Coins|Type=Counter|DivideBy=3|Value=1|Default=0"},
                {"item_id": 16, "game_id": "7Wonders", "sort": 2, "scoreitem": "Name=Wonder Points|Type=Counter|Value=1|Default=0"},
                {"item_id": 17, "game_id": "7Wonders", "sort": 3, "scoreitem": "Name=Civilian (Blue) Points|Type=Counter|Value=1|Default=0"},
                {"item_id": 18, "game_id": "7Wonders", "sort": 4, "scoreitem": "Name=Commercial (Yellow) Points|Type=Counter|Value=1|Default=0"},
                {"item_id": 19, "game_id": "7Wonders", "sort": 5, "scoreitem": "Name=Guild (Purple) Points|Type=Counter|Value=1|Default=0"},
                {"item_id": 20, "game_id": "7Wonders", "sort": 6, "scoreitem": "Name=Science (Green) - Tablet Count|Type=Counter|Value=A|Default=0"},
                {"item_id": 21, "game_id": "7Wonders", "sort": 7, "scoreitem": "Name=Science (Green) - Compass Count|Type=Counter|Value=B|Default=0"},
                {"item_id": 22, "game_id": "7Wonders", "sort": 8, "scoreitem": "Name=Science (Green) - Gear Count|Type=Counter|Value=C|Default=0"},
                //{"item_id": 23, "game_id": 8, "sort": 9, "scoreitem": "Name=Leader (White) Points|Type=Counter|Value=1|Default=0"},
                //{"item_id": 1, "game_id": 9, "game_name": "A Game of Thrones", "game_icon": "img/games/BoxPowerGrid.jpg"},
                {"item_id": 24, "game_id": "AGameofThronesFirstEdition", "sort": 0, "scoreitem": "Name=Areas Controlled|Type=Counter|Value=1|Default=0"},
                //{"item_id": 1, "game_id": "Agricola", "game_name": "Agricola", "game_icon": "img/games/BoxPowerGrid.jpg"},
                {"item_id": 25, "game_id": "Agricola", "sort": 0, "scoreitem": "Name=Fields|Type=Combo|Values=0-1^-1,2^1,3^2,4^3,5+^4|"},
                {"item_id": 26, "game_id": "Agricola", "sort": 1, "scoreitem": "Name=Pastures|Type=Combo|Values=0^-1,1^1,2^2,3^3,4+^4|"},
                {"item_id": 27, "game_id": "Agricola", "sort": 2, "scoreitem": "Name=Grain*|Type=Combo|Values=0^-1,1-3^1,4-5^2,6-7^3,8+^4|"},
                {"item_id": 28, "game_id": "Agricola", "sort": 3, "scoreitem": "Name=Vegetables*|Type=Combo|Values=0^-1,1^1,2^2,3^3,4+^4|"},
                {"item_id": 29, "game_id": "Agricola", "sort": 4, "scoreitem": "Name=Sheep|Type=Combo|Values=0^-1,1-3^1,4-5^2,6-7^3,8+^4|"},
                {"item_id": 30, "game_id": "Agricola", "sort": 5, "scoreitem": "Name=Wild Boar|Type=Combo|Values=0^-1,1-2^1,3-4^2,5-6^3,7+^4|"},
                {"item_id": 31, "game_id": "Agricola", "sort": 6, "scoreitem": "Name=Cattle|Type=Combo|Values=0^-1,1^1,2-3^2,4-5^3,6+^4|"},
                {"item_id": 32, "game_id": "Agricola", "sort": 7, "scoreitem": "Name=Unused space in the farmyard|Type=Counter|Value=-1|Default=0"},
                {"item_id": 33, "game_id": "Agricola", "sort": 8, "scoreitem": "Name=Fenced stables|Type=Counter|Value=1|Default=0"},
                {"item_id": 34, "game_id": "Agricola", "sort": 9, "scoreitem": "Name=Clay hut rooms|Type=Counter|Value=1|Default=0"},
                {"item_id": 35, "game_id": "Agricola", "sort": 10, "scoreitem": "Name=Stone house room|Type=Counter|Value=2|Default=0"},
                {"item_id": 36, "game_id": "Agricola", "sort": 11, "scoreitem": "Name=Family members|Type=Counter|Value=3|Default=2"},
                {"item_id": 37, "game_id": "Agricola", "sort": 12, "scoreitem": "Name=Points for cards|Type=Counter|Value=1|Default=0"},
                {"item_id": 38, "game_id": "Agricola", "sort": 13, "scoreitem": "Name=Bonus points|Type=Counter|Value=1|Default=0"},
                {"item_id": 39, "game_id": "Agricola", "sort": 14, "scoreitem": "Name=*Planted and harvested Grain/Vegetables|Type=Footnote"},
                //{"item_id": 1, "game_id": "AgricolaFarmersoftheMoor", "game_name": "Agricola, Farmers of the Moor", "game_icon": "img/games/BoxPowerGrid.jpg"},
                {"item_id": 40, "game_id": "AgricolaFarmersoftheMoor", "sort": 0, "scoreitem": "Name=Fields|Type=Combo|Values=0-1^-1,2^1,3^2,4^3,5+^4|"},
                {"item_id": 41, "game_id": "AgricolaFarmersoftheMoor", "sort": 1, "scoreitem": "Name=Pastures|Type=Combo|Values=0^-1,1^1,2^2,3^3,4+^4|"},
                {"item_id": 42, "game_id": "AgricolaFarmersoftheMoor", "sort": 2, "scoreitem": "Name=Grain*|Type=Combo|Values=0^-1,1-3^1,4-5^2,6-7^3,8+^4|"},
                {"item_id": 43, "game_id": "AgricolaFarmersoftheMoor", "sort": 3, "scoreitem": "Name=Vegetables*|Type=Combo|Values=0^-1,1^1,2^2,3^3,4+^4|"},
                {"item_id": 44, "game_id": "AgricolaFarmersoftheMoor", "sort": 4, "scoreitem": "Name=Sheep|Type=Combo|Values=0^-1,1-3^1,4-5^2,6-7^3,8+^4|"},
                {"item_id": 45, "game_id": "AgricolaFarmersoftheMoor", "sort": 5, "scoreitem": "Name=Wild Boar|Type=Combo|Values=0^-1,1-2^1,3-4^2,5-6^3,7+^4|"},
                {"item_id": 46, "game_id": "AgricolaFarmersoftheMoor", "sort": 6, "scoreitem": "Name=Cattle|Type=Combo|Values=0^-1,1^1,2-3^2,4-5^3,6+^4|"},
                {"item_id": 47, "game_id": "AgricolaFarmersoftheMoor", "sort": 7, "scoreitem": "Name=Horses|Type=Counter|Value=1|Default=0|"},
                {"item_id": 48, "game_id": "AgricolaFarmersoftheMoor", "sort": 8, "scoreitem": "Name=Unused space in the farmyard|Type=Counter|Value=-1|Default=0"},
                {"item_id": 49, "game_id": "AgricolaFarmersoftheMoor", "sort": 9, "scoreitem": "Name=Fenced stables|Type=Counter|Value=1|Default=0"},
                {"item_id": 50, "game_id": "AgricolaFarmersoftheMoor", "sort": 10, "scoreitem": "Name=Clay hut rooms|Type=Counter|Value=1|Default=0"},
                {"item_id": 51, "game_id": "AgricolaFarmersoftheMoor", "sort": 11, "scoreitem": "Name=Stone house room|Type=Counter|Value=2|Default=0"},
                {"item_id": 52, "game_id": "AgricolaFarmersoftheMoor", "sort": 12, "scoreitem": "Name=Healthy family members|Type=Counter|Value=3|Default=2"},
                {"item_id": 53, "game_id": "AgricolaFarmersoftheMoor", "sort": 13, "scoreitem": "Name=Sick family members|Type=Counter|Value=1|Default=0"},
                {"item_id": 54, "game_id": "AgricolaFarmersoftheMoor", "sort": 14, "scoreitem": "Name=Points for cards|Type=Counter|Value=1|Default=0"},
                {"item_id": 55, "game_id": "AgricolaFarmersoftheMoor", "sort": 15, "scoreitem": "Name=Bonus points|Type=Counter|Value=1|Default=0"},
                {"item_id": 56, "game_id": "AgricolaFarmersoftheMoor", "sort": 16, "scoreitem": "Name=*Planted and harvested Grain/Vegetables|Type=Footnote"},
                //{"item_id": 1, "game_id": "ArkhamHorror", "game_name": "Arkham Horror", "game_icon": "img/games/BoxPowerGrid.jpg"},
                {"item_id": 57, "game_id": "ArkhamHorror", "sort": 0, "scoreitem": "Coop=True|"},
                {"item_id": 58, "game_id": "ArkhamHorror", "sort": 0, "scoreitem": "Name=Win/Lose*|Type=Toggle|"},
                {"item_id": 59, "game_id": "ArkhamHorror", "sort": 3, "scoreitem": "Name=Highest Number on Doom Track|Type=Counter|Value=1|Default=0|Coop=True|"},
                {"item_id": 60, "game_id": "ArkhamHorror", "sort": 1, "scoreitem": "Name=Unpaid/Defaulted Bank Loans|Type=Counter|Value=-1|"},
                {"item_id": 61, "game_id": "ArkhamHorror", "sort": 2, "scoreitem": "Name=Elder Signs Played|Type=Counter|Value=-1|"},
                {"item_id": 62, "game_id": "ArkhamHorror", "sort": 3, "scoreitem": "Name=Gate Trophies|Type=Counter|Value=1|Default=0|"},
                {"item_id": 63, "game_id": "ArkhamHorror", "sort": 4, "scoreitem": "Name=Monster Trophies|Type=Counter|Value=1|"},
                {"item_id": 64, "game_id": "ArkhamHorror", "sort": 5, "scoreitem": "Name=Sane, Surviving Investigator|Type=Counter|Value=1|"},
                {"item_id": 65, "game_id": "ArkhamHorror", "sort": 6, "scoreitem": "Name=*If victory was achieved calculate your score|Type=Footnote"},
                //{"item_id": 1, "game_id": "Bananagrams", "game_name": "Bananagrams", "game_icon": "img/games/BoxPowerGrid.jpg"},
                {"item_id": 66, "game_id": "Bananagrams", "sort": 0, "scoreitem": "PickRounds=True|"},
                //{"item_id": 1, "game_id": "Bananagrams", "sort": 0, "scoreitem": "LowPointsWin=True|"},
                {"item_id": 67, "game_id": "Bananagrams", "sort": 0, "scoreitem": "PickRounds=True|"},
                {"item_id": 68, "game_id": "Bananagrams", "sort": 1, "scoreitem": "Name=Points*|Type=Counter|Value=1|Default=0"},
                {"item_id": 69, "game_id": "Bananagrams", "sort": 2, "scoreitem": "Name=*1 point for last place, 2 points for second to last, and so on|Type=Footnote"},
                //{"item_id": 1, "game_id": 14, "game_name": "Battleship", "game_icon": "img/games/BoxPowerGrid.jpg"},
                {"item_id": 70, "game_id": "Battleship", "sort": 0, "scoreitem": "Name=Win/Lose|Type=Toggle"},
                //{"item_id": 1, "game_id": 15, "game_name": "Battlestar Galactica", "game_icon": "img/games/BoxPowerGrid.jpg"},
                {"item_id": 71, "game_id": "BattlestarGalactica", "sort": 0, "scoreitem": "Name=Win/Lose|Type=Toggle"},
                //{"item_id": 1, "game_id": 17, "game_name": "Boggle", "game_icon": "img/games/BoxPowerGrid.jpg"},
                {"item_id": 72, "game_id": "Boggle", "sort": 0, "scoreitem": "Name=Points|Type=Counter|Value=1|Default=0"},
                //{"item_id": 1, "game_id": 18, "game_name": "Brass", "game_icon": "img/games/BoxPowerGrid.jpg"},
                {"item_id": 73, "game_id": "Brass", "sort": 0, "scoreitem": "Name=Points|Type=Counter|Value=1|Default=0"},
                //{"item_id": 1, "game_id": 19, "game_name": "Candy Land", "game_icon": "img/games/BoxPowerGrid.jpg"},
                {"item_id": 74, "game_id": "CandyLand", "sort": 0, "scoreitem": "Name=Win/Lose|Type=Toggle"},                
                //{"item_id": 1, "game_id": 21, "game_name": "Checkers", "game_icon": "img/games/BoxPowerGrid.jpg"},
                {"item_id": 75, "game_id": "Checkers", "sort": 0, "scoreitem": "Name=Win/Lose|Type=Toggle"},
                //{"item_id": 1, "game_id": 22, "game_name": "Clue", "game_icon": "img/games/BoxPowerGrid.jpg"},
                {"item_id": 76, "game_id": "Clue", "sort": 0, "scoreitem": "Name=Win/Lose|Type=Toggle"},
                //{"item_id": 1, "game_id": 23, "game_name": "Dixit", "game_icon": "img/games/BoxPowerGrid.jpg"},
                {"item_id": 77, "game_id": "Dixit", "sort": 0, "scoreitem": "Name=Points|Type=Counter|Value=1|Default=0"},
                //{"item_id": 1, "game_id": 24, "game_name": "Dominant Species", "game_icon": "img/games/BoxPowerGrid.jpg"},
                {"item_id": 78, "game_id": "DominantSpecies", "sort": 0, "scoreitem": "Name=Points|Type=Counter|Value=1|Default=0"},
                //{"item_id": 1, "game_id": 25, "game_name": "Dominion", "game_icon": "img/games/BoxPowerGrid.jpg"},
                {"item_id": 79, "game_id": "Dominion", "sort": 0, "scoreitem": "Name=Points|Type=Counter|Value=1|Default=0"},
                //{"item_id": 1, "game_id": 26, "game_name": "Dominion Intrigue", "game_icon": "img/games/BoxPowerGrid.jpg"},
                {"item_id": 80, "game_id": "DominionIntrigue", "sort": 0, "scoreitem": "Name=Points|Type=Counter|Value=1|Default=0"},
                //{"item_id": 1, "game_id": "Eclipse", "game_name": "Eclipse", "game_icon": "img/games/BoxPowerGrid.jpg"},
                {"item_id": 81, "game_id": "Eclipse", "sort": 0, "scoreitem": "Name=Reputation Tile Points|Type=Counter|Value=1|Default=0"},
                {"item_id": 82, "game_id": "Eclipse", "sort": 1, "scoreitem": "Name=Abassador Tile Points|Type=Counter|Value=1|Default=0"},
                {"item_id": 83, "game_id": "Eclipse", "sort": 2, "scoreitem": "Name=Controlled Hex Points|Type=Counter|Value=1|Default=0"},
                {"item_id": 84, "game_id": "Eclipse", "sort": 3, "scoreitem": "Name=Total Discovery Tiles|Type=Counter|Value=2|Default=0"},
                {"item_id": 85, "game_id": "Eclipse", "sort": 4, "scoreitem": "Name=Total Monoliths|Type=Counter|Value=3|Default=0"},
                {"item_id": 333, "game_id": "Eclipse", "sort": 5, "scoreitem": "Name=Military Technology Track Progress|Type=Combo|Values=<4 Tiles^0,4 Tiles^1,5 Tiles^2,6 Tiles^3,7 Tiles^5|"},
                {"item_id": 334, "game_id": "Eclipse", "sort": 6, "scoreitem": "Name=Grid Technology Track Progress|Type=Combo|Values=<4 Tiles^0,4 Tiles^1,5 Tiles^2,6 Tiles^3,7 Tiles^5|"},
                {"item_id": 335, "game_id": "Eclipse", "sort": 7, "scoreitem": "Name=Nano Technology Track Progress|Type=Combo|Values=<4 Tiles^0,4 Tiles^1,5 Tiles^2,6 Tiles^3,7 Tiles^5|"},
                
                {"item_id": 87, "game_id": "Eclipse", "sort": 8, "scoreitem": "Name=Has Traitor Card|Type=Combo|Values=No^0,Yes^-2|"},
                //{"item_id": 1, "game_id": 28, "game_name": "El Grande", "game_icon": "img/games/BoxPowerGrid.jpg"},
                {"item_id": 88, "game_id": "ElGrande", "sort": 0, "scoreitem": "Name=Points|Type=Counter|Value=1|Default=0"},
                //{"item_id": 1, "game_id": "Goa", "game_name": "Goa", "game_icon": "img/games/BoxPowerGrid.jpg"},
                {"item_id": 89, "game_id": "Goa", "sort": 0, "scoreitem": "Name=Success Marker Ship VPs|Type=Combo|Values=0^0,1^1,3^3,6^6,10^10|"},
                {"item_id": 90, "game_id": "Goa", "sort": 1, "scoreitem": "Name=Success Marker Harvest VPs|Type=Combo|Values=0^0,1^1,3^3,6^6,10^10|"},
                {"item_id": 91, "game_id": "Goa", "sort": 2, "scoreitem": "Name=Success Marker Taxes VPs|Type=Combo|Values=0^0,1^1,3^3,6^6,10^10|"},
                {"item_id": 92, "game_id": "Goa", "sort": 3, "scoreitem": "Name=Success Marker Expedition VPs|Type=Combo|Values=0^0,1^1,3^3,6^6,10^10|"},
                {"item_id": 93, "game_id": "Goa", "sort": 4, "scoreitem": "Name=Success Marker Found Colony VPs|Type=Combo|Values=0^0,1^1,3^3,6^6,10^10|"},
                {"item_id": 94, "game_id": "Goa", "sort": 5, "scoreitem": "Name=Founded Colonies|Type=Combo|Values=0^0,1^1,2^3,3^6,4^10|"},
                {"item_id": 95, "game_id": "Goa", "sort": 6, "scoreitem": "Name=Expedition Tiger Symbols|Type=Combo|Values=0^0,1^1,2^3,3^6,4^10,5^15,6^20|"},
                {"item_id": 96, "game_id": "Goa", "sort": 7, "scoreitem": "Name=Expedition Fish Symbols|Type=Combo|Values=0^0,1^1,2^3,3^6,4^10,5^15,6^20|"},
                {"item_id": 97, "game_id": "Goa", "sort": 8, "scoreitem": "Name=Expedition Palm Symbols|Type=Combo|Values=0^0,1^1,2^3,3^6,4^10,5^15,6^20|"},
                {"item_id": 98, "game_id": "Goa", "sort": 9, "scoreitem": "Name=Expedition Shell Symbols|Type=Combo|Values=0^0,1^1,2^3,3^6,4^10,5^15,6^20|"},
                {"item_id": 99, "game_id": "Goa", "sort": 10, "scoreitem": "Name=Expedition Statue Symbols|Type=Combo|Values=0^0,1^1,2^3,3^6,4^10,5^15,6^20|"},
                {"item_id": 100, "game_id": "Goa", "sort": 11, "scoreitem": "Name=Has most money*|Type=Combo|Values=No^0,Yes^3|"},
                {"item_id": 101, "game_id": "Goa", "sort": 12, "scoreitem": "Name=Plantations|Type=Counter|Value=1|Default=0"},
                {"item_id": 102, "game_id": "Goa", "sort": 13, "scoreitem": "Name=Has fulfilled Duty tile*|Type=Combo|Values=No^0,Yes^4|"},
                {"item_id": 103, "game_id": "Goa", "sort": 14, "scoreitem": "Name=Mission Tile VPs|Type=Counter|Value=1|Default=0"},
                {"item_id": 104, "game_id": "Goa", "sort": 15, "scoreitem": "Name=*Several players may tie for the most money|Type=Footnote|"},
                //{"item_id": 1, "game_id": 30, "game_name": "Hamburgum", "game_icon": "img/games/BoxPowerGrid.jpg"},
                {"item_id": 105, "game_id": "Hamburgum", "sort": 0, "scoreitem": "Name=Points|Type=Counter|Value=1|Default=0"},
                //{"item_id": 1, "game_id": "LeHavre", "game_name": "Le Havre", "game_icon": "img/games/BoxPowerGrid.jpg"},
                {"item_id": 106, "game_id": "LeHavre", "sort": 0, "scoreitem": "Name=Total Building Values|Type=Counter|Value=1|Default=0"},
                {"item_id": 107, "game_id": "LeHavre", "sort": 1, "scoreitem": "Name=Total Ship Values|Type=Counter|Value=1|Default=0"},
                {"item_id": 108, "game_id": "LeHavre", "sort": 2, "scoreitem": "Name=Bonus Building Points|Type=Counter|Value=1|Default=0"},
                {"item_id": 109, "game_id": "LeHavre", "sort": 3, "scoreitem": "Name=Cash|Type=Counter|Value=1|Default=0"},
                {"item_id": 110, "game_id": "LeHavre", "sort": 4, "scoreitem": "Name=Unpaid Loans|Type=Counter|Value=-7|Default=0"},
                //{"item_id": 1, "game_id": 32, "game_name": "Mage Knight", "game_icon": "img/games/BoxPowerGrid.jpg"},
                {"item_id": 111, "game_id": "MageKnight", "sort": 0, "scoreitem": "Name=Points|Type=Counter|Value=1|Default=0"},
                //{"item_id": 1, "game_id": 33, "game_name": "Monopoly", "game_icon": "img/games/BoxPowerGrid.jpg"},
                {"item_id": 112, "game_id": "Monopoly", "sort": 0, "scoreitem": "Name=Win/Lose|Type=Toggle"},
                //{"item_id": 1, "game_id": 34, "game_name": "Operation", "game_icon": "img/games/BoxPowerGrid.jpg"},
                {"item_id": 113, "game_id": "Operation", "sort": 0, "scoreitem": "Name=Win/Lose|Type=Toggle"},
                //{"item_id": 1, "game_id": "OraEtLabora", "game_name": "Ora Et Labora", "game_icon": "img/games/BoxPowerGrid.jpg"},
                {"item_id": 114, "game_id": "OraEtLabora", "sort": 0, "scoreitem": "Name=Goods Tiles Points|Type=Counter|Value=1|Default=0"},
                {"item_id": 115, "game_id": "OraEtLabora", "sort": 1, "scoreitem": "Name=Economic Value of Buildings|Type=Counter|Value=1|Default=0"},
                {"item_id": 116, "game_id": "OraEtLabora", "sort": 2, "scoreitem": "Name=Settlement Scores|Type=Counter|Value=1|Default=0"},
                //{"item_id": 1, "game_id": 36, "game_name": "Power Grid", "game_icon": "img/games/BoxPowerGrid.jpg"},
                {"item_id": 117, "game_id": "PowerGrid", "sort": 0, "scoreitem": "Name=Points|Type=Counter|Value=1|Default=0"},
                //{"item_id": 1, "game_id": "RacefortheGalaxy", "game_name": "Race for the Galaxy", "game_icon": "img/games/BoxPowerGrid.jpg"},
                {"item_id": 118, "game_id": "RacefortheGalaxy", "sort": 0, "scoreitem": "Name=Development and World VPs|Type=Counter|Value=1|Default=0"},
                {"item_id": 119, "game_id": "RacefortheGalaxy", "sort": 1, "scoreitem": "Name=VP Chips|Type=Counter|Value=1|Default=0"},
                {"item_id": 120, "game_id": "RacefortheGalaxy", "sort": 2, "scoreitem": "Name=Bonus VPs|Type=Counter|Value=1|Default=0"},
                //{"item_id": 1, "game_id": 38, "game_name": "Reef Encounter", "game_icon": "img/games/BoxPowerGrid.jpg"},
                {"item_id": 121, "game_id": "ReefEncounter", "sort": 0, "scoreitem": "Name=Points|Type=Counter|Value=1|Default=0"},
                //{"item_id": 1, "game_id": 39, "game_name": "Risk", "game_icon": "img/games/BoxPowerGrid.jpg"},
                {"item_id": 122, "game_id": "Risk", "sort": 0, "scoreitem": "Name=Win/Lose|Type=Toggle"},
                //{"item_id": 1, "game_id": 40, "game_name": "Saint Petersburg", "game_icon": "img/games/BoxPowerGrid.jpg"},
                {"item_id": 123, "game_id": "SaintPetersburg", "sort": 0, "scoreitem": "Name=Points|Type=Counter|Value=1|Default=0"},
                //{"item_id": 1, "game_id": 41, "game_name": "Samurai", "game_icon": "img/games/BoxPowerGrid.jpg"},
                {"item_id": 124, "game_id": "Samurai", "sort": 0, "scoreitem": "Name=Win/Lose|Type=Toggle"},
                //{"item_id": 1, "game_id": "SanJuan", "game_name": "San Juan", "game_icon": "img/games/BoxPowerGrid.jpg"},
                {"item_id": 125, "game_id": "SanJuan", "sort": 0, "scoreitem": "Name=Building VPs|Type=Counter|Value=1|Default=0"},
                {"item_id": 126, "game_id": "SanJuan", "sort": 1, "scoreitem": "Name=Chapel VPs|Type=Counter|Value=1|Default=0"},
                {"item_id": 127, "game_id": "SanJuan", "sort": 2, "scoreitem": "Name=Arch - Guild Hall - City Hall VPs|Type=Counter|Value=1|Default=0"},
                {"item_id": 128, "game_id": "SanJuan", "sort": 3, "scoreitem": "Name=Palace VPs|Type=Counter|Value=1|Default=0"},
                //{"item_id": 1, "game_id": 43, "game_name": "Scrabble", "game_icon": "img/games/BoxPowerGrid.jpg"},
                {"item_id": 129, "game_id": "Scrabble", "sort": 0, "scoreitem": "Name=Points|Type=Counter|Value=1|Default=0"},
                //{"item_id": 1, "game_id": 44, "game_name": "Sorry", "game_icon": "img/games/BoxPowerGrid.jpg"},
                {"item_id": 130, "game_id": "Sorry", "sort": 0, "scoreitem": "Name=Win/Lose|Type=Toggle"},
                //{"item_id": 1, "game_id": 45, "game_name": "The Game of Life", "game_icon": "img/games/BoxPowerGrid.jpg"},
                {"item_id": 131, "game_id": "GameofLifeThe", "sort": 0, "scoreitem": "Name=Win/Lose|Type=Toggle"},
                //{"item_id": 1, "game_id": 46, "game_name": "The Resistance", "game_icon": "img/games/BoxPowerGrid.jpg"},
                {"item_id": 132, "game_id": "ResistanceThe", "sort": 0, "scoreitem": "Name=Win/Lose|Type=Toggle"},
                //{"item_id": 1, "game_id": 47, "game_name": "Through the Ages", "game_icon": "img/games/BoxPowerGrid.jpg"},
                {"item_id": 133, "game_id": "ThroughtheAges", "sort": 0, "scoreitem": "Name=Points|Type=Counter|Value=1|Default=0"},
                //{"item_id": 1, "game_id": 48, "game_name": "Ticket to Ride", "game_icon": "img/games/BoxPowerGrid.jpg"},
                {"item_id": 134, "game_id": "TickettoRide", "sort": 0, "scoreitem": "Name=Route Points|Type=Counter|Value=1|Default=0"},
                {"item_id": 184, "game_id": "TickettoRide", "sort": 1, "scoreitem": "Name=Destination Ticket Points|Type=Counter|Value=1|Default=0"},
                {"item_id": 185, "game_id": "TickettoRide", "sort": 2, "scoreitem": "Name=Longest Route Bonus|Type=Toggle|Values=No^0,Yes^10"},
                //{"item_id": 1, "game_id": 49, "game_name": "Ticket to Ride: Europe", "game_icon": "img/games/BoxPowerGrid.jpg"},
                {"item_id": 135, "game_id": "TickettoRideEurope", "sort": 0, "scoreitem": "Name=Route Points|Type=Counter|Value=1|Default=0"},
                {"item_id": 186, "game_id": "TickettoRideEurope", "sort": 1, "scoreitem": "Name=Destination Ticket Points|Type=Counter|Value=1|Default=0"},
                {"item_id": 187, "game_id": "TickettoRideEurope", "sort": 2, "scoreitem": "Name=Remaining Stations|Type=Counter|Value=4|Default=0"},
                {"item_id": 188, "game_id": "TickettoRideEurope", "sort": 3, "scoreitem": "Name=European Express Bonus|Type=Toggle|Values=No^0,Yes^10"},
                //{"item_id": 1, "game_id": 50, "game_name": "Tigris and Euphrates", "game_icon": "img/games/BoxPowerGrid.jpg"},
                {"item_id": 136, "game_id": "TigrisandEuphrates", "sort": 0, "scoreitem": "Name=Points|Type=Counter|Value=1|Default=0"},
                //{"item_id": 1, "game_id": 51, "game_name": "Torres", "game_icon": "img/games/BoxPowerGrid.jpg"},
                {"item_id": 137, "game_id": "Torres", "sort": 0, "scoreitem": "Name=Points|Type=Counter|Value=1|Default=0"},
                //{"item_id": 1, "game_id": 52, "game_name": "Trivial Pursuit", "game_icon": "img/games/BoxPowerGrid.jpg"},
                {"item_id": 138, "game_id": "TrivialPursuit", "sort": 0, "scoreitem": "Name=Win/Lose|Type=Toggle"},
                //{"item_id": 1, "game_id": 53, "game_name": "War of the Ring", "game_icon": "img/games/BoxPowerGrid.jpg"},
                {"item_id": 139, "game_id": "WaroftheRingFirstEdition", "sort": 0, "scoreitem": "Name=Win/Lose|Type=Toggle"},
                //{"item_id": 1, "game_id": 54, "game_name": "Twilight Struggle", "game_icon": "img/games/BoxTwilightStruggle.jpg"},
                {"item_id": 140, "game_id": "TwilightStruggle", "sort": 0, "scoreitem": "Name=Win/Lose|Type=Toggle"},
                //Pandemic
                {"item_id": 141, "game_id": "Pandemic", "sort": 0, "scoreitem": "Coop=True|"},
                {"item_id": 142, "game_id": "Pandemic", "sort": 0, "scoreitem": "Name=Win/Lose|Type=Toggle"},
                //Citadels
                {"item_id": 143, "game_id": "Citadels", "sort": 0, "scoreitem": "Name=Gold Cost of District Cards|Type=Counter|Value=1|Default=0"},
                {"item_id": 144, "game_id": "Citadels", "sort": 0, "scoreitem": "Name=District Colors Bonus|Type=Combo|Values=Fewer than one district in each color^0,One district in each color^3|"},
                {"item_id": 145, "game_id": "Citadels", "sort": 0, "scoreitem": "Name=District Building Bonus|Type=Combo|Values=Did not build 8 districts^0,Built 8 districts but not first^2,First to build 8 districts^4|"},
                //Smallworld
                {"item_id": 146, "game_id": "Smallworld", "sort": 0, "scoreitem": "Name=Victory coins|Type=Counter|Value=1|Default=0"},
                //Lost cities
                {"item_id": 147, "game_id": "LostCities", "sort": 0, "scoreitem": "Name=Points|Type=Counter|Value=1|Default=0"},
                //Stone Age
                {"item_id": 148, "game_id": "StoneAge", "sort": 0, "scoreitem": "Name=Different Civ. Cards (Green)|Type=Counter|Value=1|Default=0|Square=True"},
                {"item_id": 149, "game_id": "StoneAge", "sort": 1, "scoreitem": "Name=Farmers|Type=Counter|Value=A|Default=0"},
                {"item_id": 150, "game_id": "StoneAge", "sort": 1, "scoreitem": "Name=Food Production|Type=Counter|Value=B|Default=0"},
                {"item_id": 151, "game_id": "StoneAge", "sort": 1, "scoreitem": "Name=Tool Makers|Type=Counter|Value=C|Default=0"},
                {"item_id": 152, "game_id": "StoneAge", "sort": 1, "scoreitem": "Name=Tools|Type=Counter|Value=D|Default=0"},
                {"item_id": 153, "game_id": "StoneAge", "sort": 1, "scoreitem": "Name=Hut Builders|Type=Counter|Value=E|Default=0"},
                {"item_id": 154, "game_id": "StoneAge", "sort": 1, "scoreitem": "Name=Buildings|Type=Counter|Value=F|Default=0"},
                {"item_id": 155, "game_id": "StoneAge", "sort": 1, "scoreitem": "Name=Shamen|Type=Counter|Value=G|Default=0"},
                {"item_id": 156, "game_id": "StoneAge", "sort": 1, "scoreitem": "Name=People|Type=Counter|Value=H|Default=0"},
                {"item_id": 157, "game_id": "StoneAge", "sort": 1, "scoreitem": "Name=Resources|Type=Counter|Value=1|Default=0"},
                //{"item_id": 1, "game_id": "7WondersLeaders", "game_name": "7 Wonders - Leaders", "game_icon": "img/games/BoxPowerGrid.jpg"},
                {"item_id": 158, "game_id": "7WondersLeaders", "sort": 0, "scoreitem": "Name=Military (Red) Points|Type=Counter|Value=1|Default=0"},
                {"item_id": 159, "game_id": "7WondersLeaders", "sort": 1, "scoreitem": "Name=Total Coins|Type=Counter|DivideBy=3|Value=1|Default=0"},
                {"item_id": 160, "game_id": "7WondersLeaders", "sort": 2, "scoreitem": "Name=Wonder Points|Type=Counter|Value=1|Default=0"},
                {"item_id": 161, "game_id": "7WondersLeaders", "sort": 3, "scoreitem": "Name=Civilian (Blue) Points|Type=Counter|Value=1|Default=0"},
                {"item_id": 162, "game_id": "7WondersLeaders", "sort": 4, "scoreitem": "Name=Commercial (Yellow) Points|Type=Counter|Value=1|Default=0"},
                {"item_id": 163, "game_id": "7WondersLeaders", "sort": 5, "scoreitem": "Name=Guild (Purple) Points|Type=Counter|Value=1|Default=0"},
                {"item_id": 164, "game_id": "7WondersLeaders", "sort": 6, "scoreitem": "Name=Science (Green) - Tablet Count|Type=Counter|Value=A|Default=0"},
                {"item_id": 165, "game_id": "7WondersLeaders", "sort": 7, "scoreitem": "Name=Science (Green) - Compass Count|Type=Counter|Value=B|Default=0"},
                {"item_id": 166, "game_id": "7WondersLeaders", "sort": 8, "scoreitem": "Name=Science (Green) - Gear Count|Type=Counter|Value=C|Default=0"},
                {"item_id": 167, "game_id": "7WondersLeaders", "sort": 9, "scoreitem": "Name=Leaders (White) Points|Type=Counter|Value=1|Default=0"},
                
                 //{"item_id": 1, "game_id": "7WondersLeaders", "game_name": "7 Wonders - Leaders", "game_icon": "img/games/BoxPowerGrid.jpg"},
                {"item_id": 168, "game_id": "7WondersCities", "sort": 0, "scoreitem": "Name=Military (Red) Points|Type=Counter|Value=1|Default=0"},
                {"item_id": 169, "game_id": "7WondersCities", "sort": 1, "scoreitem": "Name=Total Coins|Type=Counter|DivideBy=3|Value=1|Default=0"},
                {"item_id": 170, "game_id": "7WondersCities", "sort": 2, "scoreitem": "Name=Wonder Points|Type=Counter|Value=1|Default=0"},
                {"item_id": 171, "game_id": "7WondersCities", "sort": 3, "scoreitem": "Name=Civilian (Blue) Points|Type=Counter|Value=1|Default=0"},
                {"item_id": 172, "game_id": "7WondersCities", "sort": 4, "scoreitem": "Name=Commercial (Yellow) Points|Type=Counter|Value=1|Default=0"},
                {"item_id": 173, "game_id": "7WondersCities", "sort": 5, "scoreitem": "Name=Guild (Purple) Points|Type=Counter|Value=1|Default=0"},
                {"item_id": 174, "game_id": "7WondersCities", "sort": 6, "scoreitem": "Name=Science (Green) - Tablet Count|Type=Counter|Value=A|Default=0"},
                {"item_id": 175, "game_id": "7WondersCities", "sort": 7, "scoreitem": "Name=Science (Green) - Compass Count|Type=Counter|Value=B|Default=0"},
                {"item_id": 176, "game_id": "7WondersCities", "sort": 8, "scoreitem": "Name=Science (Green) - Gear Count|Type=Counter|Value=C|Default=0"},
                {"item_id": 177, "game_id": "7WondersCities", "sort": 9, "scoreitem": "Name=Leaders (White) Points|Type=Counter|Value=1|Default=0"},
                {"item_id": 178, "game_id": "7WondersCities", "sort": 10, "scoreitem": "Name=City (Black) Points|Type=Counter|Value=1|Default=0"},
                //game of thrones
                {"item_id": 179, "game_id": "AGameofThronesSecondEdition", "sort": 0, "scoreitem": "Name=Areas Controlled|Type=Counter|Value=1|Default=0"},
                {"item_id": 180, "game_id": "7 Wonders", "sort": 9, "scoreitem": "Name=*Count total coins and science cards, not points gained for those items|Type=Footnote"},
                {"item_id": 181, "game_id": "7 WondersLeaders", "sort": 10, "scoreitem": "Name=*Count total coins and science cards, not points gained for those items|Type=Footnote"},
                {"item_id": 182, "game_id": "7 WondersCities", "sort": 11, "scoreitem": "Name=*Count total coins and science cards, not points gained for those items|Type=Footnote"},
                //War of the ring second edition
                {"item_id": 183, "game_id": "WaroftheRingSecondEdition", "sort": 0, "scoreitem": "Name=Win/Lose|Type=Toggle"},
                //item_id": 184-188: Ticket to ride"
                {"item_id": 189, "game_id": "TickettoRideNordicCountries", "sort": 0, "scoreitem": "Name=Route Points|Type=Counter|Value=1|Default=0"},
                {"item_id": 190, "game_id": "TickettoRideNordicCountries", "sort": 1, "scoreitem": "Name=Destination Ticket Points|Type=Counter|Value=1|Default=0"},
                {"item_id": 191, "game_id": "TickettoRideNordicCountries", "sort": 2, "scoreitem": "Name=Globetrotter Bonus|Type=Toggle|Values=No^0,Yes^10"},
                //Risk Legacy
                {"item_id": 192, "game_id": "RiskLegacy", "sort": 0, "scoreitem": "Name=Win/Lose|Type=Toggle"}
        ];
        var l = scoreitems.length;
        var sql = "INSERT OR REPLACE INTO tblScoreItems" +
            "(game_id, sort, scoreitem) " +
            "VALUES (?, ?, ?)";
        var s;
        for (var i = 0; i < l; i++) {
            s = scoreitems[i];
            tx.executeSql(sql, [s.game_id, s.sort, s.scoreitem], function() {
                //console.log('INSERT success');
                },function(tx, error) {
                    //console.log(tx + ' error: ' + error.message);
                    });
        }
    };

    this.saveSetting = function(setting_name, setting_value, callback) {
        this.db.transaction(
            function(tx) {
                var sql = "INSERT OR REPLACE INTO tblSettings" +
                "(setting_name, setting_value) " +
                "VALUES (?, ?)";
                tx.executeSql(sql, [setting_name, setting_value], function() {
                    //console.log('SAVE success');
                    },function(tx, error) {
                        //console.log(tx + ' error: ' + error.message);
                        });
            if (callback !== undefined) {
                callback();
            }
        });
    };
    
    this.saveCloudQueue = function(cloudData, cloudDataId, cloudIdRemote, cloudBlob, callback) {
        //console.log("saveCloudQueue");
        if (cloudDataId === undefined || cloudDataId == "undefined" || cloudDataId==null) {
            cloudDataId = "";
        }
        if (cloudBlob === undefined || cloudBlob == "undefined" || cloudBlob==null) {
            cloudBlob="";
        }
        if (cloudIdRemote === undefined || cloudIdRemote == "undefined" || cloudIdRemote==null) {
            cloudIdRemote=0;
        }
        var cloudHasBlob;
        if (cloudBlob === "") {
            cloudHasBlob=0;
        } else {
            cloudHasBlob=-1;
        }
        //console.log("CLOUDHASBLOB: " + cloudHasBlob);
        var cloudIsBlob=0;
        this.db.transaction(
            function(tx) {
                var sql = "INSERT INTO tblCloudQueue" +
                "(cloud_data, cloud_data_id, cloud_hasblob, cloud_isblob, cloud_id_remote) " +
                "VALUES (?, ?, ?, ?, ?)";
                //console.log("Saving SQL: " + sql);
                //console.log("Saving cloud_data: " + cloudData);
                tx.executeSql(sql, [cloudData, cloudDataId, cloudHasBlob, cloudIsBlob, cloudIdRemote], function(tx, result) {
                        //console.log('SAVE success');
                        var myId = result.insertId; // WRONG: insert the ID of the entry in tbl
                        //console.log("got insert id: " + myId);
                        if (cloudHasBlob==-1) {
                            app.cloudQueueBlob(myId, cloudBlob); //app.cloudQueueBlob(cloudIdLocal, cloudBlob)  
                        }
                    },function(tx, error) {
                        //console.log(tx + ' error: ' + error.message);
                        });
        });
    };
    
    this.saveCloudQueueBlob = function(cloudData, cloudIdRemote, cloudPieceId, cloudIdLocal, maxParts) {
        //console.log("Save Cloud Queue Blob");
        var that = this;
        var cloudHasBlob=0;
        var cloudIsBlob=-1;
        var cloudPlusOne=cloudPieceId+1;
        this.db.transaction(
            function(tx) {
                var sql = "INSERT OR REPLACE INTO tblCloudQueue" +
                "(cloud_data, cloud_id_remote, cloud_hasblob, cloud_isblob, cloud_piece_id) " +
                "VALUES (?, ?, ?, ?, ?)";
                //console.log("Saving SQL: " + sql);
                //console.log("Saving cloud_data: " + cloudData);
                //console.log("Saving Remote Cloud ID: " + cloudIdRemote);
                //console.log("Saving Cloud Piece ID: " + cloudPieceId);
                tx.executeSql(sql, [cloudData, cloudIdRemote, cloudHasBlob, cloudIsBlob, cloudPieceId], function(tx, result) {
                        //console.log('SAVE BLOB CHUNK success');
                        if (cloudPlusOne == maxParts) {
                            that.deleteCloudBlobById(cloudIdLocal);
                        }
                    },function(tx, error) {
                        //console.log(tx + ' error: ' + error.message);
                        });
        });
    };
    
    this.saveCloudBlob = function(blobLocalId, blobData) {
        this.db.transaction(
            function(tx) {
                var sql = "INSERT OR REPLACE INTO tblCloudBlob" +
                "(cloud_blob_data, cloud_local_id) " +
                "VALUES (?, ?)";
                //console.log("Saving SQL: " + sql);
                //console.log("Saving cloud_blob_data: " + blobData);
                //console.log("Saving cloud_local_id: " + blobLocalId);
                tx.executeSql(sql, [blobData, blobLocalId], function() {
                    //console.log('');
                    },function(tx, error) {
                        //console.log(tx + ' error: ' + error.message);
                        });
        });
    };
    
    this.saveCloudHist = function(myCloud) {
        var cloud_id = myCloud.cloudIdRemote + myCloud.username;
        //console.log("SaveCloudHist: " + cloud_id);
        this.db.transaction(
            function(tx) {
                var sql = "INSERT OR REPLACE INTO tblCloudHist" +
                "(cloud_id) " +
                "VALUES (?)";
                tx.executeSql(sql, [cloud_id], function() {
                    //console.log('SAVE success');
                    },function(tx, error) {
                        //console.log(tx + ' error: ' + error.message);
                        });
        });
    };
    
    this.findCloudData = function(lastCloudIdLocal, callback) {
        //console.log("findCloudData lastCloudIdLocal: " + lastCloudIdLocal);
        var i;
        this.db.transaction(
            function(tx) {
                var sql = "SELECT * FROM tblCloudQueue WHERE cloud_id > ?";
                //console.log(sql);
                tx.executeSql(sql, [lastCloudIdLocal], function(tx, results) {
                    var len = results.rows.length,
                        clouds = [],
                        i = 0;
                    //console.log("len: " + len);
                    for (i=0; i < len; i++) {
                        clouds[i] = results.rows.item(i);
                        //console.log("push: " + games.length);
                    }
                    
                    callback(clouds);
                });            
            },
            function(error) {
                alertDebug("Transaction Error14: " + error.message);
            }
        );
    };
    
    this.findCloudHist = function(myCloud, callback, that) {
        //console.log("findCloudHist");
        var what = that;
        var cloud_id = myCloud.cloudIdRemote + myCloud.username;
        if (myCloud.cloudIdRemote !== undefined) {
            //console.log("findCloudHist");
            var i;
            this.db.transaction(
                function(tx) {
                    var sql = "SELECT * FROM tblCloudHist WHERE cloud_id=?";
                    tx.executeSql(sql, [cloud_id], function(tx, results) {
                        var len = results.rows.length;
                        if (len === 0) {
                            //console.log('ID ' + cloud_id + ' does not exist');
                            //success, we have not processed this cloud yet
                            callback(myCloud, what);
                        } else {
                            //console.log('ID ' + cloud_id + ' already exists');
                            that.saveCloudHist(myCloud);
                            app.saveCloudIdRemote(myCloud);
                        }
                    });            
                },
                function(error) {
                    alertDebug("Transaction Error15: " + error.message);
                }
            );  
        }
    };
    
    this.deleteCloudById = function(myCloud) {
        if (myCloud.cloudIdLocal !== undefined) {
            //console.log('deleteCloudById: ' + myCloud.cloudIdLocal);
                this.db.transaction(
                    function(tx) {
                    
                        var sql = "DELETE FROM tblCloudQueue WHERE cloud_id=?";
                        tx.executeSql(sql, [myCloud.cloudIdLocal], function() {
                            //console.log('DELETE success');
                            },function(tx, error) {
                                //console.log(tx + ' error: ' + error.message);
                                });
                }); 
        }
    };
    
    this.deleteCloudBlobById = function(cloudBlobId) {
        if (cloudBlobId !== undefined) {
            //console.log('deleteCloudBlobById: ' + cloudBlobId);
            this.db.transaction(
                function(tx) {
                    var sql = "DELETE FROM tblCloudBlob WHERE cloud_blob_id=?";
                    tx.executeSql(sql, [cloudBlobId], function() {
                        //console.log('DELETE success');
                        },function(tx, error) {
                            //console.log(tx + ' error: ' + error.message);
                            });
            }); 
        }
    };
    
    this.getSetting = function(setting_name, setting_default, callback) {
        var i;
        this.db.transaction(
            function(tx) {
                var sql = "SELECT * FROM tblSettings WHERE setting_name = ?";
                var mySetting;
                //console.log(sql + " " + setting_name);
                tx.executeSql(sql, [setting_name], function(tx, results) {
                    var len = results.rows.length,
                        settings = [],
                        i = 0;
                    //console.log("len: " + len);
                    for (i=0; i < len; i++) {
                        settings[i] = results.rows.item(i);
                        mySetting = new Setting(setting_name, settings[i].setting_value);
                        settings[0] = mySetting;
                    }
                    if (len === 0) {
                        mySetting = new Setting(setting_name, setting_default);
                        settings[0] = mySetting;
                    }
                    //console.log(settings);
                    callback(settings);
                });            
            },
            function(error) {
                alertDebug("Transaction Error16: " + error.message);
            }
        );
    };

    this.deletePlayerById = function(player_id, callback) {
        this.db.transaction(
            function(tx) {
            
                //var sql = "DELETE FROM tblPlayers WHERE player_id=?";
                var sql = "UPDATE tblPlayers SET player_visible=0 WHERE player_id=?";
                tx.executeSql(sql, [player_id], function() {
                    //console.log('DELETE success');
                    },function(tx, error) {
                        //console.log(tx + ' error: ' + error.message);
                        });
                if (callback !== undefined) {
                    callback();
                }
        });
    };
    
    this.hidePlayerById = function(player_id, callback) {
        this.db.transaction(
            function(tx) {
            
                //var sql = "DELETE FROM tblPlayers WHERE player_id=?";
                var sql = "UPDATE tblPlayers SET player_hide_device=-1 WHERE player_id=?";
                tx.executeSql(sql, [player_id], function() {
                    //console.log('HIDE success');
                    },function(tx, error) {
                        //console.log(tx + ' error: ' + error.message);
                        });
                if (callback !== undefined) {
                    callback();
                }
        });
    };
    
    
    this.deleteGameById = function(game_id, callback) {
        //console.log("STORE del game by id: " + game_id);
        this.db.transaction(
            function(tx) {
            
                //var sql = "DELETE FROM tblGamesCustom WHERE game_id=?";
                var sql = "UPDATE tblGamesCustom SET game_visible=0 WHERE game_id=?";
                //console.log(sql + " ?=" + game_id);
                tx.executeSql(sql, [game_id], function() {
                    //console.log('DELETE success');
                    },function(tx, error) {
                        //console.log(tx + ' error: ' + error.message);
                        });
                if (callback !== undefined) {
                    callback();
                }
        });
    };
    
    this.deleteHistoryById = function(session_id, callback) {
        //console.log("delete history by id: " + session_id);
        this.db.transaction(
            function(tx) {
            
                var sql = "DELETE FROM tblSessions WHERE session_id=?";
                //console.log("sql");
                tx.executeSql(sql, [session_id], function() {
                    //console.log('DELETE success');
                    },function(tx, error) {
                        //console.log(tx + ' error: ' + error.message);
                        });
                
                sql = "DELETE FROM tblAwardsEarned WHERE session_id=?";
                //console.log("sql");
                tx.executeSql(sql, [session_id], function() {
                    //console.log('DELETE success');
                    },function(tx, error) {
                        //console.log(tx + ' error: ' + error.message);
                        });
                
                sql = "DELETE FROM tblScores WHERE session_id=?";
                //console.log("sql");
                tx.executeSql(sql, [session_id], function() {
                    //console.log('DELETE success');
                    },function(tx, error) {
                        //console.log(tx + ' error: ' + error.message);
                        });
                if (callback !== undefined) {
                    callback();
                }
        });
    };

    this.addPlayerData = function(player_id, player_name, player_icon, player_bggusername, player_twitter, player_hidden, player_color, callback) {  //TODO add cloud ID
        var playerDeviceHidden=0;
        //console.log("player_hiddenStore " + player_hidden);
        if (player_hidden == -1) {
            playerDeviceHidden = -1;
        }
        //console.log("playerDeviceHidden: " + playerDeviceHidden);
        this.db.transaction(
            function(tx) {
                var sql="";
                if (player_icon !== "") {
                    sql = "INSERT OR REPLACE INTO tblPlayers " +
                    "(player_id, player_name, player_icon, player_bggusername, player_twitter, player_visible, player_device_hidden) " +
                    "VALUES (?, ?, ?, ?, ?, -1, ?)";    
                    tx.executeSql(sql, [player_id, player_name, player_icon, player_bggusername, player_twitter, playerDeviceHidden], function() {
                        //console.log('INSERT success');
                        },function(tx, error) {
                            //console.log(tx + ' error: ' + error.message);
                            });
                } else {
                    sql = "INSERT OR REPLACE INTO tblPlayers " + 
                    "(player_id, player_name, player_bggusername, player_twitter, player_visible, player_device_hidden) " + 
                    "VALUES (?, ?, ?, -1, ?)";
                    tx.executeSql(sql, [player_id, player_name, player_bggusername, player_twitter, playerDeviceHidden], function() {
                        //console.log('INSERT success');
                        },function(tx, error) {
                            //console.log(tx + ' error: ' + error.message);
                            });
                }
                if (callback !== undefined) {
                    callback();
                }
        });
    };
    
    this.updatePlayerPhoto = function(player_id, player_icon, callback) {
        //console.log("Update player photo");
        this.db.transaction(
            function(tx) {
                var sql = "UPDATE tblPlayers SET player_icon=? WHERE player_id=?";
                tx.executeSql(sql, [player_icon, player_id], function() {
                    //console.log('UPDATE success');
                    },function(tx, error) {
                        //console.log(tx + ' error: ' + error.message);
                        });
                if (callback !== undefined) {
                    callback();
                }
        });
    };
    
    this.addSessionData = function(session_id, game_id, winner_id, winner_name, winner_points, game_name, game_custom, game_photo, game_notes, game_date, game_won, game_location, game_duration, that, callback) {
                                // session_id, game_id, winner_id, winner_name, winner_points, game_custom, game_photo, game_notes, game_date, game_won
        //console.log("session_id:" + session_id);
        //console.log("game_id:" + game_id);
        //console.log("winner_id:" + winner_id);
        //console.log("winner_name:" + winner_name);
        //console.log("winner_points:" + winner_points);
        //console.log("game_custom:" + game_custom);
        //console.log("game_photo:" + game_photo);
        //console.log("game_notes:" + game_notes);
        //console.log("game_date:" + game_date);
        //console.log("game_won:" + game_won);
       
        var lastInsert = -1;
        var today = new Date();
        var gameDate = new Date();
        if (session_id === "" || session_id === "undefined" || session_id === undefined) {
            session_id = new Date().getTime();
        }
        
        gameDate = new Date(session_id);
        gameDate = gameDate.setTime(session_id);
        //console.log("session_id: " + session_id);
        //console.log("gameDate: " + gameDate);
        this.db.transaction(
            function(tx) {
            
                var sql = "INSERT OR REPLACE INTO tblSessions " +
                "(session_id, game_id, winner_id, winner_name, winner_points, game_name, game_custom, game_photo, game_notes, game_date, game_won, game_location, game_duration) " +
                "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
                //console.log(sql);
                tx.executeSql(sql, [session_id, game_id, winner_id, winner_name, winner_points, game_name, game_custom, game_photo, game_notes, gameDate, game_won, game_location, game_duration], function(tx, results) {
                    //console.log('INSERT success');
                    //var lastInsert = results.insertId;
                    if (callback !== undefined) {
                        callback(session_id, that); //app.addScoreData(session_id, that, app.addAch0)
                    }
                },
                function(tx, error) {
                    //console.log(tx + ' addSessionData error: ' + error.message);
                    });
        });
    };
    
    this.editSessionData = function(session_id, winner_id, winner_name, winner_points) {
        this.db.transaction(
            function(tx) {
                var sql = "UPDATE tblSessions SET winner_id=?, winner_name=?, winner_points=? WHERE session_id=?";
                tx.executeSql(sql, [winner_id, winner_name, winner_points, session_id], function() {
                    //console.log('EDIT success');
                    },function(tx, error) {
                        //console.log(tx + ' error: ' + error.message);
                        });
            }
        );
    };
    
    this.editScoreData = function(score_id, points, win) {
        //console.log("editScoreData");
        //console.log(score_id);
        //console.log(points);
        //console.log(win);
        this.db.transaction(
            function(tx) {
                var sql = "UPDATE tblScores SET score=?, win=? WHERE score_id=?";
                tx.executeSql(sql, [points, win, score_id], function() {
                    //console.log('EDIT success');
                    },function(tx, error) {
                        //console.log(tx + ' error: ' + error.message);
                        });
            }
        );
    };
    
    this.updateSessionPhoto = function(session_id, game_photo, callback) {
        this.db.transaction(
            function(tx) {
                var sql = "UPDATE tblSessions SET game_photo=? WHERE session_id=?";
                tx.executeSql(sql, [game_photo, session_id], function() {
                    //console.log('UPDATE success');
                    },function(tx, error) {
                        //console.log(tx + ' error: ' + error.message);
                        });
                if (callback !== undefined) {
                    callback();
                }
            }
        );
    };
    
    //this.store.addScoreData(session_id, p.id, p.points, p.winner);
    
    this.addScoreData = function(score_id, session_id, player_id, player_points, player_win, callback) {
        //console.log("score_id=" + score_id);
        //console.log("session_id=" + session_id);
        //console.log("player_id=" + player_id);
        //console.log("player_points=" + player_points);
        //console.log("player_win=" + player_win);
        this.db.transaction(
            function(tx) {
            
                var sql = "INSERT OR REPLACE INTO tblScores " +
                "(score_id, session_id, player_id, score, win) " +
                "VALUES (?, ?, ?, ?, ?)";
                tx.executeSql(sql, [score_id, session_id, player_id, player_points, player_win ], function() {
                    //console.log('INSERT success');
                    },function(tx, error) {
                        //console.log(tx + ' AddScoreData Error: ' + score_id + " " + error.message);
                        });
                if (callback !== undefined) {
                    callback();
                }
        });
    };
    
    this.addAch = function(session_id) {
        
    };
    
    this.addAward = function(earned_id, award_id,award_value,game_id,game_custom, game_icon,game_name,session_id,player_name,player_id,award_data,award_date,player_twitter,cloudQueue, callback) {
        //console.log("addAward: " + earned_id);
        if (cloudQueue === true) {
            app.cloudQueueAward(earned_id, award_id, award_value, game_id, game_custom, game_icon, game_name, session_id, player_name, player_id, award_data, award_date, player_twitter);
        }
        this.db.transaction(
            function(tx) {
                //var earned_id = new Date().getTime();
                //globalSeed++;
                //earned_id += globalSeed;
                
                var sql = "INSERT OR REPLACE INTO tblAwardsEarned " +
                "(earned_id, award_id, award_value, game_id, game_custom, game_icon, game_name, session_id, player_name, player_id, award_data, award_date, player_twitter) " +
                "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
                tx.executeSql(sql, [earned_id, award_id, award_value, game_id, game_custom, game_icon, game_name, session_id, player_name, player_id, award_data, award_date, player_twitter], 
                    function(tx, results) {
                        //console.log(sql);
                        //console.log(award_id + ', ' + award_value + ', ' + game_id + ', ' + game_custom + ', ' + game_name + ', ' + session_id + ', ' + player_name + ', ' + player_id);
                        //console.log('INSERT success');
                        //lastInsert = results.insertId;
                        //callback(lastInsert, game_advanced);
                        if (callback !== undefined) {
                            callback();
                        }
                    },
                    function(tx, error) {
                        alertDebug('addAward error: ' + error.message);
                        return -1;
                    });
        });
    };
    
    this.addGameData = function(game_id, game_name, game_icon, game_scoreType, game_pickRounds, game_advanced, game_bggid, callback) {
        //console.log("game_id: " + game_id);
        //console.log("game_name: " + game_name);
        //console.log("game_icon: " + game_icon);
        //console.log("game_scoreType: " + game_scoreType);
        //console.log("game_pickRounds:" + game_pickRounds);
        //console.log("game_advanced: " + game_advanced);
        var lastInsert = -1;
        //console.log("scoreType=" + game_scoreType);
        switch (game_scoreType)
        {
        case "points":
            game_advanced="Name=Points|Type=Counter|Value=1|Default=0;";
            break;
        case "winLose":
            game_advanced="Name=Win/Lose|Type=Toggle;";
            break;
        case "areasControlled":
            game_advanced = "Name=Areas Controlled|Type=Counter|Value=1|Default=0;";
            break;
        }
        
        this.db.transaction(
            function(tx) {
            
                var sql = "INSERT OR REPLACE INTO tblGamesCustom " +
                "(game_id, game_name, game_icon, game_scoreType, game_pickRounds, game_advancedText, game_bggid, game_visible) " +
                "VALUES (?, ?, ?, ?, ?, ?, ?, -1)";
                tx.executeSql(sql, [game_id, game_name, game_icon, game_scoreType, game_pickRounds, game_advanced, game_bggid], 
                    function(tx, results) {
                        //console.log('INSERT success');
                        //lastInsert = results.insertId;
                        sql = "DELETE FROM tblScoreItemsCustom WHERE game_id=?";
                        tx.executeSql(sql, [game_id],
                            function(tx, results) {
                                if (callback !== undefined) {
                                    callback(game_id, game_advanced);   
                                }
                            },
                            function(tx, error) {
                                alertDebug("Clearing Scoreitems Error: " + error.message);
                                return -1;
                            });
                    },
                    function(tx, error) {
                        alertDebug('AddGame INSERT error: ' + error.message);
                        return -1;
                    });
                    
                    if (callback !== undefined) {
                        callback();
                    }
        });
    };
    
    this.updateGamePhoto = function(game_id, game_icon, callback) {
        this.db.transaction(
            function(tx) {
                var sql = "UPDATE tblGamesCustom SET game_icon=? WHERE game_id=?";
                tx.executeSql(sql, [game_icon, game_id], function() {
                    //console.log('UPDATE success');
                    },function(tx, error) {
                        //console.log(tx + ' error: ' + error.message);
                        });
            }
        );
    };
    
    this.addScorecardDataStore = function(game_id, sort, scoreitem, callback) {
        //console.log("game_id: " & game_id);
        //console.log("sort: " & sort);
        //console.log("scoreitem: " & scoreitem)
        this.db.transaction(
            function(tx) {
            
                var sql = "INSERT INTO tblScoreItemsCustom " +
                "(game_id, sort, scoreitem) " +
                "VALUES (?, ?, ?)";
                tx.executeSql(sql, [game_id, sort, scoreitem ], 
                    function() {
                        //console.log('INSERT success');
                    },
                    function(tx, error) {
                        alertDebug('AddScorecardDataStore INSERT error: ' + error.message);
                    });
                    if (callback !== undefined) {
                        callback();
                    }
        });
    };

    this.findGamesStats = function(callback) {
        var i;
        this.db.transaction(
            function(tx) {
                var sql = "SELECT * FROM tblSessions";  
                
                //console.log(sql);
                //console.log('session_id: ' + session_id);
                //console.log("? = " + session_id);
                tx.executeSql(sql, [], function(tx, results) {
                    var len = results.rows.length,
                        history = [],
                        i = 0;
                    //console.log("len: " + len);
                    if (len > 0) {
                        for (i=0; i < len; i++) {
                            history[i] = results.rows.item(i);
                            //console.log("push: " + games.length);
                        }
                    }
                    callback(history);
                });            
            },
            function(error) {
                alertDebug("Transaction Error20: " + error.message);
            }
        );
    };

    this.findSession = function(session_id, callback) {
        var i;
        this.db.transaction(
            function(tx) {
                var sql = "SELECT * FROM tblGames, tblSessions WHERE tblGames.game_id = tblSessions.game_id AND tblSessions.session_id=?";  
                
                //console.log(sql);
                //console.log('session_id: ' + session_id);
                //console.log("? = " + session_id);
                tx.executeSql(sql, [session_id], function(tx, results) {
                    var len = results.rows.length,
                        history = [],
                        i = 0;
                    //console.log("len: " + len);
                    if (len > 0) {
                        for (i=0; i < len; i++) {
                            history[i] = results.rows.item(i);
                            //console.log("push: " + games.length);
                        }
                        callback(history);
                    } else {
                        var sql = "SELECT * FROM tblGamesCustom, tblSessions WHERE tblGamesCustom.game_id = tblSessions.game_id AND tblSessions.session_id=?";  
                        tx.executeSql(sql, [session_id], function(tx, results) {
                        var len = results.rows.length,
                            history = [],
                            i = 0;
                        //console.log("len2: " + len);
                        for (i=0; i < len; i++) {
                            history[i] = results.rows.item(i);
                            //console.log("push: " + games.length);
                        }
                        callback(history);  
                        });     
                    }
                });            
            },
            function(error) {
                alertDebug("Transaction Error21: " + error.message);
            }
        );
    };

    this.findAwardsBySession = function(session_id, callback) {
        var i;
        this.db.transaction(
            function(tx) {
                var sql = "SELECT * FROM tblAwards, tblAwardsEarned WHERE tblAwardsEarned.award_id = tblAwards.award_id AND tblAwardsEarned.session_id=? ORDER BY tblAwardsEarned.earned_id DESC";
                //console.log(sql);
                //console.log("? = " + session_id);
                tx.executeSql(sql, [session_id], function(tx, results) {
                    var len = results.rows.length,
                        awards = [],
                        i = 0;
                    //console.log("len: " + len);
                    for (i=0; i < len; i++) {
                        awards[i] = results.rows.item(i);
                        //console.log("push: " + games.length);
                    }
                    
                    callback(awards);
                });            
            },
            function(error) {
                alertDebug("Transaction Error22: " + error.message);
            }
        );
    };
    
    this.findScoresBySession = function(session_id, callback) {
        var i;
        this.db.transaction(
            function(tx) {
                var sql = "SELECT * FROM tblScores, tblPlayers WHERE tblScores.player_id = tblPlayers.player_id AND tblScores.session_id=? ORDER BY tblScores.score DESC";
                //console.log(sql);
                //console.log("? = " + session_id);
                tx.executeSql(sql, [session_id], function(tx, results) {
                    var len = results.rows.length,
                        scores = [],
                        i = 0;
                    //console.log("len: " + len);
                    for (i=0; i < len; i++) {
                        scores[i] = results.rows.item(i);
                        //console.log("push: " + games.length);
                    }
                    
                    callback(scores);
                });            
            },
            function(error) {
                alertDebug("Transaction Error23: " + error.message);
            }
        );
    };

    this.findHistoryPlayers = function(session_id, callback) {
        var i;
        this.db.transaction(
            function(tx) {
                var sql = "SELECT * FROM tblScores, tblPlayers WHERE tblScores.player_id=tblPlayers.player_id AND session_id=? ORDER BY tblScores.win DESC,tblScores.score DESC";
                //console.log(sql);
                //console.log("? = " + session_id);
                tx.executeSql(sql, [session_id], function(tx, results) {
                    var len = results.rows.length,
                        players = [],
                        i = 0;
                    //console.log("len: " + len);
                    for (i=0; i < len; i++) {
                        players[i] = results.rows.item(i);
                        //console.log("push: " + games.length);
                    }
                    
                    callback(players);
                });            
            },
            function(error) {
                alertDebug("Transaction Error24: " + error.message);
            }
        );
    };


    this.findAwards = function(callback) {
        var i;
        this.db.transaction(
            function(tx) {
                var sql = "SELECT * FROM tblAwards, tblAwardsEarned WHERE tblAwardsEarned.award_id = tblAwards.award_id ORDER BY tblAwardsEarned.earned_id DESC";
                //console.log(sql);
                tx.executeSql(sql, [], function(tx, results) {
                    var len = results.rows.length,
                        awards = [],
                        i = 0;
                    //console.log("len: " + len);
                    for (i=0; i < len; i++) {
                        awards[i] = results.rows.item(i);
                        //console.log("push: " + games.length);
                    }
                    
                    callback(awards);
                });            
            },
            function(error) {
                alertDebug("Transaction Error25: " + error.message);
            }
        );
    };
    
    this.generateStats = function(gameId, gameCustom, callback) {
        var that = this;
        var s = "";
        var callClosure;
        var playerName="";
        var playerId="";
        //console.log("Generate Stats");
        
        function closureFindTotalWins(pid, pn, ipos, max, that) {
            //console.log("closureFindTotalWins");
            //console.log("i: " + i);
            //console.log("max: " + max);
            return that.db.transaction(
                function(tx) {
                    var sql = "SELECT * FROM tblScores WHERE player_id=?";
                    var iWon = 0;
                    tx.executeSql(sql, [pid], function(tx, results) {
                        var len = results.rows.length;
                        //console.log(len);
                        var r;
                        //console.log("pushing " + pn + ", " + len);
                        for (var i=0; i<len; i++) {
                            r = results.rows.item(i);
                            if (r.win == 'true') {
                                iWon++;
                            }
                        }
                        if (len == 1) {
                            s = "";
                        } else {
                            s = "s";
                        }
                        if (iWon > 0) {
                            bStatTotalWins = true;
                            statTotalWins.push([pn + ' (' + iWon + ' win' + s + ')', iWon]);
                        }
                        max = max - 1;
                        //console.log("max: " + max);
                        if (ipos == max) {
                            //console.log("triggered");
                            bStatTotalWinsComplete = true;
                        }
                    });            
                },
                function(error) {
                    alertDebug("Transaction Error26: " + error.message);
                }
            );
        }
        
        function closureFindTotalWinsGame(gid, gc, pid, pn, ipos, max, that) {
            //console.log("closureFindTotalWinsGame");
            return that.db.transaction(
                function(tx) {
                    var sql = "SELECT tblScores.session_id, tblScores.player_id, tblScores.win, tblSessions.session_id, tblSessions.game_id, tblSessions.game_custom FROM tblScores, tblSessions WHERE tblScores.player_id=? AND tblSessions.game_id=? and tblSessions.game_custom=? AND tblScores.session_id = tblSessions.session_id";
                    var iWon = 0;
                    tx.executeSql(sql, [pid, gid, gc], function(tx, results) {
                        var len = results.rows.length;
                        //console.log("Find Total Wins Game: " + pid + " " + gid + " " + len);
                        var r;
                        
                        for (var i=0; i<len; i++) {
                            r = results.rows.item(i);
                            if (r.win == 'true') {
                                iWon++;
                            }
                        }
                        if (len == 1) {
                            s = "";
                        } else {
                            s = "s";
                        }
                        if (iWon > 0) {
                            //console.log("pushing " + pn + ", " + iWon);
                            bStatTotalWinsGame = true;
                            statTotalWinsGame.push([pn + ' (' + iWon + ' win' + s + ')', iWon]);    
                        }
                        //console.log("POS: " + ipos + " MAX: " + max);
                        max = max - 1;
                        if (ipos == max) {
                            //console.log("SETTING TRUE");
                            bStatTotalWinsGameComplete = true;
                        }
                    });            
                },
                function(error) {
                    alertDebug("Transaction Error27: " + error.message);
                }
            );
        }
        
        function closureFindAverageScoreGame(gid, gc, pid, pn, ipos, max, that) {
            //console.log("closureFindAverageScoreGame");
            return that.db.transaction(
                function(tx) {
                    var sql = "SELECT tblScores.session_id, tblScores.player_id, tblScores.score, tblSessions.session_id, tblSessions.game_date, tblSessions.game_id, tblSessions.game_custom FROM tblScores, tblSessions WHERE tblScores.player_id=? AND tblSessions.game_id=? and tblSessions.game_custom=? AND tblScores.session_id = tblSessions.session_id ORDER BY tblSessions.game_date";
                    var iPlays = 0;
                    var iPoints = 0;
                    var iAvg = 0;
                    tx.executeSql(sql, [pid, gid, gc], function(tx, results) {
                        var len = results.rows.length;
                        //console.log(len);
                        var r;
                        //console.log("pushing " + pn + ", " + len);
                        for (var i=0; i<len; i++) {
                            r = results.rows.item(i);
                            iPoints += r.score;
                            iPlays++;
                        }
                        
                        //console.log("Plays: " + iPlays);
                        //console.log("PointsTotal: " + iPoints);
                        
                        if (iPlays > 0) {
                            iAvg = (iPoints / iPlays);
                        }
                        //console.log("AVG: " + iAvg);
                        var rounded = Math.round( iAvg * 10 ) / 10;
                        if (rounded > 0) {
                            bStatAvgScore = true;
                            statAvgScore.push([pn + " (" + rounded + ")",rounded]);
                            statAvgScore.sort(function (a,b) {
                                if (a[1] < b[1]) {return  1;}
                                if (a[1] > b[1]) {return -1;}
                                return 0;
                            });
                        }
                        
                        max = max - 1;
                        if (ipos == max) {
                            bStatAvgScoreComplete = true;
                        }   
                    });            
                },
                function(error) {
                    alertDebug("Transaction Error28: " + error.message);
                }
            );
        }
        
        function closureFindWinPercent(pid, pn, ipos, max, that) {
            //console.log("closureFindWinPercent");
            return that.db.transaction(
                function(tx) {
                    var sql = "SELECT * FROM tblScores WHERE player_id=?";
                    var iPlayed = 0;
                    var iWon = 0;
                    var iPct = 0;
                    tx.executeSql(sql, [pid], function(tx, results) {
                        var len = results.rows.length;
                        //console.log(len);
                        var r;
                        iPlayed = len;
                        for (var i=0; i<len; i++) {
                            r = results.rows.item(i);
                            
                            if (r.win == 'true') {
                                iWon++;
                            }
                        }
                        if (len > 0) {
                            iPct = ((iWon / iPlayed) * 100);
                        }
                        
                        var rounded = Math.round( iPct * 10 ) / 10;
                        if (rounded > 0) {
                            bStatWinPercent = true;
                            statWinPercent.push([pn + " (" + rounded + "%)", rounded]); 
                            statWinPercent.sort(function (a,b) {
                                if (a[1] < b[1]) {return  1;}
                                if (a[1] > b[1]) {return -1;}
                                return 0;
                            });
                        }
                        max = max - 1;
                        if (ipos == max) {
                            bStatWinPercentComplete = true;
                        }
                    });            
                },
                function(error) {
                    alertDebug("Transaction Error29: " + error.message);
                }
            );
        }
        
        function closureFindWinPercentGame(gid, gc, pid, pn, ipos, max, that) {
            //console.log("closureFindWinPercentGame");
            return that.db.transaction(
                function(tx) {
                    var sql = "SELECT * FROM tblScores, tblSessions WHERE tblScores.player_id=? AND tblSessions.game_id=? and tblSessions.game_custom=? AND tblScores.session_id = tblSessions.session_id";
                    //console.log(sql);
                    var iPlayed = 0;
                    var iWon = 0;
                    var iPct = 0;
                    tx.executeSql(sql, [pid, gid, gc], function(tx, results) {
                        var len = results.rows.length;
                        //console.log(len);
                        var r;
                        iPlayed = len;
                        for (var i=0; i<len; i++) {
                            r = results.rows.item(i);
                            
                            if (r.win == 'true') {
                                iWon++;
                            }
                        }
                        if (len > 0) {
                            iPct = ((iWon / iPlayed) * 100);
                        }
                     
                        var rounded = Math.round( iPct * 10 ) / 10;
                        if (rounded > 0) {
                            bStatWinPercentGame = true;
                            statWinPercentGame.push([pn + ' (' + rounded + '%)', rounded]); 
                            statWinPercentGame.sort(function (a,b) {
                                if (a[1] < b[1]) {return  1;}
                                if (a[1] > b[1]) {return -1;}
                                return 0;
                            });                         
                        }
                        
                        max = max - 1;
                        if (ipos == max) {
                            bStatWinPercentGameComplete = true;
                        }
                    });            
                },
                function(error) {
                    alertDebug("Transaction Error30: " + error.message);
                }
            );
        }
        
        function closureFindTopTen(gid, gc, that) {
            //console.log("closureFindTopTen");
            return that.db.transaction(
                function(tx) {
                    var sql = "SELECT tblScores.session_id, tblScores.player_id, tblScores.player_id, tblScores.score, tblSessions.session_id, tblSessions.game_id, tblSessions.game_custom, tblPlayers.player_id, tblPlayers.player_name FROM tblScores, tblSessions, tblPlayers WHERE tblSessions.game_id=? and tblSessions.game_custom=? AND tblScores.session_id = tblSessions.session_id AND tblScores.player_id = tblPlayers.player_id ORDER BY tblScores.score DESC";
                    var iPlays = 0;
                    var iPoints = 0;
                    var playerName="";
                    var playerId="";
                    var bPush=false;
                    tx.executeSql(sql, [gid, gc], function(tx, results) {
                        var len = results.rows.length;
                        //console.log(len);
                        var r;
                        //console.log("pushing " + pn + ", " + len);
                        for (var i=0; i<len; i++) {
                            r = results.rows.item(i);
                            iPoints = r.score;
                            playerName = r.player_name;
                            playerId = r.player_id;
                            bPush = false;
                            for (var j=0; j<currPlayers.length; j++) {
                                if (currPlayers[j].id == playerId) {
                                    if (currPlayers[j].hidden != -1) {
                                        bPush = true;
                                        break;
                                    }
                                }
                            }
                            
                            if (bPush === true) {
                                bStatTopTen = true;
                                statTopTen.push([playerName + ' (' + iPoints + ')', iPoints]);
                                if (i >= 9) {
                                    break;
                                }
                            }
                        }
                        bStatTopTenComplete = true;
                    });            
                },
                function(error) {
                    alertDebug("Transaction Error31: " + error.message);
                }
            );
        }
        
        //console.log("gameId: " + gameId);
        //console.log("gameCustom: " + gameCustom);
        //console.log("currPlayers: " + currPlayers.length);
        
        if (gameId === "") {
            //console.log("Game ID is blank so doing all games");
            for (var i=0;i<currPlayers.length;i++) {
                if (currPlayers[i].hidden != -1) {
                    //console.log("1-" + i);
                    playerName = currPlayers[i].name;
                    playerId = currPlayers[i].id;
                    callClosure = closureFindTotalWins(playerId, playerName, i, currPlayers.length, that);
                    callClosure = closureFindWinPercent(playerId, playerName, i, currPlayers.length, that); 
                }
            }   
        } else {
            for (var j=0;j<currPlayers.length;j++) {
                //console.log("2-" + j)
                if (currPlayers[j].hidden != -1) {
                    playerName = currPlayers[j].name;
                    playerId = currPlayers[j].id;
                    callClosure = closureFindTotalWinsGame(gameId, gameCustom, playerId, playerName, j, currPlayers.length, that);
                    callClosure = closureFindWinPercentGame(gameId, gameCustom, playerId, playerName, j, currPlayers.length, that);
                    callClosure = closureFindAverageScoreGame(gameId, gameCustom, playerId, playerName, j, currPlayers.length, that);
                }
            }
            callClosure = closureFindTopTen(gameId, gameCustom, that);
        }
        callback();
    };

    this.findHistory = function(callback) {
        var i;
        var that = this;
        this.db.transaction(
            function(tx) {
                var sql = "SELECT * FROM (SELECT * FROM tblGames, tblSessions WHERE tblGames.game_id = tblSessions.game_id AND tblGames.game_custom=tblSessions.game_custom UNION SELECT * FROM tblGamesCustom, tblSessions WHERE tblGamesCustom.game_id = tblSessions.game_id AND tblGamesCustom.game_custom = tblSessions.game_custom) AS U ORDER BY U.session_id ASC";
                //var sql = "SELECT * FROM tblGames, tblSessions WHERE tblGames.game_id = tblSessions.game_id AND tblGames.game_custom=tblSessions.game_custom ORDER BY tblSessions.session_id DESC";
                //console.log(sql);
                tx.executeSql(sql, [], function(tx, results) {
                    
                    var len = results.rows.length,
                        history = [],
                        i = 0;
                    //console.log("len: " + len);
                    for (i=0; i < len; i++) {
                        history[i] = results.rows.item(i);
                        //console.log("push: " + games.length);
                    }
                    
                    
                        callback(history);
                    
                });            
            },
            function(error) {
                alertDebug("Transaction Error32: " + error.message);
            }
        );
    };

    this.findGameByName = function(searchKey, callback) {
        //console.log("SearchKey: " + searchKey);
        var i;
        this.db.transaction(
            function(tx) {
                var sql = "SELECT * FROM (SELECT * FROM tblGames UNION SELECT * FROM tblGamesCustom) AS U WHERE U.game_name LIKE ? ORDER BY U.game_name";
                
                //console.log(sql);
                
                tx.executeSql(sql, ['%' + searchKey + '%'], function(tx, results) {
                    var len = results.rows.length,
                        games = [],
                        i = 0;
                        
                    for (i=0; i < len; i++) {
                        games[i] = results.rows.item(i);
                        //console.log("push: " + games.length);
                    }
                    
                    callback(games);
                });            
            },
            function(error) {
                alertDebug("Transaction Error33: " + error.message);
            }
        );
    };

    this.findGameByNameEdit = function(searchKey, callback) {
        var i;
        this.db.transaction(
            function(tx) {
                //var sql = "SELECT * FROM tblGamesCustom WHERE game_visible=-1 AND game_name LIKE ? ORDER BY game_name";
                var sql = "SELECT * FROM tblGames WHERE game_name LIKE ? ORDER BY game_name";
                //todo change back 
                //console.log(sql);
                
                tx.executeSql(sql, ['%' + searchKey + '%'], function(tx, results) {
                    var len = results.rows.length,
                        games = [],
                        i = 0;
                        
                    for (i=0; i < len; i++) {
                        games[i] = results.rows.item(i);
                        //console.log("push: " + games.length);
                    }
                    
                    callback(games);
                });            
            },
            function(error) {
                alertDebug("Transaction Error34: " + error.message);
            }
        );
    };

    this.findScorecardsByGameId = function(searchKey, callback) {
        //console.log("Find scorecards by game id: " + searchKey);
        this.db.transaction(
            function(tx) {

                var sql = "SELECT s.item_id, s.game_id, s.sort, s.scoreitem " +
                    "FROM tblScoreItems s " +
                    "WHERE s.game_id = ? " +
                    "ORDER BY s.sort";

                tx.executeSql(sql, [searchKey], function(tx, results) {
                    var len = results.rows.length,
                        items = [],
                        i = 0;
                    for (i=0; i < len; i++) {
                        items[i] = results.rows.item(i);
                    }
                    callback(items);
                });
            },
            function(error) {
                alertDebug("Transaction Error35: " + error.message);
            }
        );
    };

    this.findScorecardsByCustomGameId = function(searchKey, callback) {
        //console.log("Find scorecards by custom game id: " + searchKey);
        this.db.transaction(
            function(tx) {

                var sql = "SELECT s.item_id, s.game_id, s.sort, s.scoreitem " +
                    "FROM tblScoreItemsCustom s " +
                    "WHERE s.game_id = ? " +
                    "ORDER BY s.sort";

                tx.executeSql(sql, [searchKey], function(tx, results) {
                    var len = results.rows.length,
                        items = [],
                        i = 0;
                    for (i=0; i < len; i++) {
                        items[i] = results.rows.item(i);
                    }
                    callback(items);
                });
            },
            function(error) {
                alertDebug("Transaction Error36: " + error.message);
            }
        );
    };

    this.findBlobById = function(id, callback) {
        //console.log("searching for game id: " + id);
        this.db.transaction(
            function(tx) {

                var sql = "SELECT g.cloud_blob_id, g.cloud_blob_data, g.cloud_local_id " +
                    "FROM tblCloudBlob g " +
                    "WHERE g.cloud_local_id=:id";
                //console.log(sql);
                
                tx.executeSql(sql, [id], function(tx, results) {
                    //console.log("len: " + results.rows.length);
                    //console.log(results.rows.item(0));
                    callback(results.rows.length === 1 ? results.rows.item(0) : null);
                });
            },
            function(error) {
                alertDebug("Transaction Error37: " + error.message);
            }
        );
    };

    

    this.findGameById = function(id, callback) {
        //console.log("searching for game id: " + id);
        this.db.transaction(
            function(tx) {

                var sql = "SELECT g.game_id, g.game_name " +
                    "FROM tblGames g " +
                    "WHERE g.game_id=:id";
                //console.log(sql);
                
                tx.executeSql(sql, [id], function(tx, results) {
                    //console.log("len: " + results.rows.length);
                    //console.log(results.rows.item(0));
                    
                    callback(results.rows.length === 1 ? results.rows.item(0) : null);
                });
            },
            function(error) {
                alertDebug("Transaction Error38: " + error.message);
            }
        );
    };

    

    this.findGameByIdCustom = function(id, callback) {
        //console.log("searching for game id: " + id);
        this.db.transaction(
            function(tx) {

                var sql = "SELECT g.game_id, g.game_name " +
                    "FROM tblGamesCustom g " +
                    "WHERE g.game_id=:id";
                //console.log(sql);
                
                tx.executeSql(sql, [id], function(tx, results) {
                    //console.log("len: " + results.rows.length);
                    //console.log(results.rows.item(0));
                    
                    callback(results.rows.length === 1 ? results.rows.item(0) : null);
                });
            },
            function(error) {
                alertDebug("Transaction Error39: " + error.message);
            }
        );
    };

    this.findPlayerByName = function(searchKey, callback) {
        
        this.db.transaction(
            function(tx) {

                var sql = "SELECT p.player_id, p.player_name, p.player_icon, p.player_bggusername, p.player_twitter, p.player_visible, p.player_device_hidden " +
                    "FROM tblPlayers p " +
                    "WHERE p.player_visible = -1 AND p.player_name LIKE ? " +
                    "ORDER BY p.player_name";

                tx.executeSql(sql, ['%' + searchKey + '%'], function(tx, results) {
                    var len = results.rows.length,
                        players = [],
                        i = 0;
                    for (i=0; i < len; i++) {
                        players[i] = results.rows.item(i);
                    }
                    callback(players);
                });
            },
            function(error) {
                alertDebug("Transaction Error40: " + error.message);
            }
        );
    };

    this.findPlayerByNameStats = function(searchKey, callback) {
        
        this.db.transaction(
            function(tx) {

                var sql = "SELECT p.player_id, p.player_name, p.player_icon, p.player_bggusername, p.player_twitter, p.player_visible, p.player_device_hidden  " +
                    "FROM tblPlayers p " +
                    "WHERE p.player_name LIKE ? " +
                    "ORDER BY p.player_name";

                tx.executeSql(sql, ['%' + searchKey + '%'], function(tx, results) {
                    var len = results.rows.length,
                        players = [],
                        i = 0;
                    for (i=0; i < len; i++) {
                        players[i] = results.rows.item(i);
                    }
                    callback(players);
                });
            },
            function(error) {
                alertDebug("Transaction Error41: " + error.message);
            }
        );
    };

    this.findPlayerWinsById = function(player_id, callback) {
        //console.log("STORE.findPlayerWinsById: " + player_id)
        this.db.transaction(
            function(tx) {

                var sql = "SELECT winner_id " +
                    "FROM tblSessions p " +
                    "WHERE p.player_visible = -1 AND p.winner_id = ?";

                tx.executeSql(sql, [player_id], function(tx, results) {
                    var len = results.rows.length,
                        sessions = [],
                        i = 0;
                    for (i=0; i < len; i++) {
                        sessions[i] = results.rows.item(i);
                    }
                    callback(sessions);
                });
            },
            function(error) {
                alertDebug("Transaction Error42: " + error.message);
            }
        );
    };

    this.findPlayerById = function(id, callback) {
        //console.log("searching for player id: " + id);
        this.db.transaction(
            function(tx) {

                var sql = "SELECT p.player_id, p.player_name, p.player_icon, p.player_bggusername, p.player_twitter " +
                    "FROM tblPlayers p " +
                    "WHERE p.player_visible = -1 AND p.player_id=:id";
                //console.log(sql);
                
                tx.executeSql(sql, [id], function(tx, results) {
                    //console.log("len: " + results.rows.length);
                    //console.log(results.rows.item(0));
                    callback(results.rows.length === 1 ? results.rows.item(0) : null);
                });
            },
            function(error) {
                alertDebug("Transaction Error43: " + error.message);
            }
        );
    };

    this.initializeDatabase(successCallback, errorCallback);

};