var Popup = {
    addGameDialog: function() {
        $('<div>').simpledialog2({
            mode: 'button',
            headerText: "Add Game",
            headerClose: true,
            top: 25,
            buttons: {
                'Game Database': {
                    id: 'addGameScoreGeek',
                    click: function() {
                        changePage("#gamesDatabase");
                    },
                    icon: "check",
                    theme: "d"
                },
                'Custom Game': {
                    id: 'addGameCustom',
                    click: function() {
                        changePage("#addgame");
                    },
                    icon: "edit",
                    theme: "d"
                }
            }
        });   
    },
    cameraDialogGame: function() {
        if (Device.platform === "FirefoxOS") {
            app.gamePhotoFromCamera(1);
        } else {
            $('<div>').simpledialog2({
                mode: 'button',
                headerText: "Photo Source",
                headerClose: true,
                top: 100,
                buttons: {
                    'Camera': {
                        id: 'camera',
                        click: function() {
                            app.gamePhotoFromCamera(1);
                        },
                        icon: "camera",
                        theme: "d"
                    },
                    'Camera Roll': {
                        id: 'cameraRoll',
                        click: function() {
                            app.gamePhotoFromCamera(0);
                        },
                        icon: "grid",
                        theme: "c"
                    }
                }
            });    
        }  
    },
    cameraDialogPlayer: function() {
        if (Device.platform === "FirefoxOS") {
            app.playerPhotoFromCamera(1);
        } else {
             $('<div>').simpledialog2({
                mode: 'button',
                headerText: "Photo Source",
                headerClose: true,
                top: 100,
                buttons: {
                    'Camera': {
                        id: 'camera',
                        click: function() {
                            app.playerPhotoFromCamera(1);
                        },
                        icon: "camera",
                        theme: "d"
                    },
                    'Camera Roll': {
                        id: 'cameraRoll',
                        click: function() {
                            app.playerPhotoFromCamera(0);
                        },
                        icon: "grid",
                        theme: "c"
                    }
                }
            });     
        } 
    },
    cameraDialogSession: function() {
        if (Device.platform === "FirefoxOS") {
            app.sessionPhotoFromCamera(1);
        } else {
            $('<div>').simpledialog2({
                mode: 'button',
                headerText: "Photo Source",
                headerClose: true,
                top: 100,
                buttons: {
                    'Camera': {
                        id: 'camera',
                        click: function() {
                            app.sessionPhotoFromCamera(1);
                        },
                        icon: "camera",
                        theme: "d"
                    },
                    'Camera Roll': {
                        id: 'cameraRoll',
                        click: function() {
                            app.sessionPhotoFromCamera(0);
                        },
                        icon: "grid",
                        theme: "c"
                    }
                }
            }); 
        }
    },
    socialDialog: function() {       
        $('<div>').simpledialog2({
            mode: 'button',
            headerText: "Social Options",
            headerClose: true,
            top: 25,
            buttons: {
                'Send Love': {
                    id: 'socialRate',
                    click: function() {
                        app.askForReview(true);
                    },
                    icon: "heart",
                    theme: "d"
                },
                'Send Feedback': {
                    id: 'socialFeedback',
                    click: function() {
                        app.launchFeedback();
                    },
                    icon: "comment",
                    theme: "d"
                },
                'Share': {
                    id: 'socialTweet',
                    click: function() {
                        Social.tweet("If you like #boardgames check out #ScoreGeek, the app I've been using to track scores and statistics: http://bit.ly/13aXBHV");
                    },
                    icon: "forward",
                    theme: "d"
                },
                'Follow': {
                    id: 'socialFollow',
                    click: function() {
                        Social.follow();
                    },
                    icon: "user",
                    theme: "d"
                },
                'Friend': {
                    id: 'socialFriend',
                    click: function() {
                        Social.friend();
                    },
                    icon: "user",
                    theme: "d"
                },
                'Like on Facebook': {
                    id: 'socialLike',
                    click: function() {
                        Social.launchLike();
                    },
                    icon: "check",
                    theme: "d"
                },
                'Support': {
                    id: 'socialSupport',
                    click: function() {
                        var url = Globals.socialSupportURL;
                        Social.launchURL(url);
                    },
                    icon: "info",
                    theme: "d"
                }
            }
        });   
    },
    toolsDialog1: function() {       
        $('<div>').simpledialog2({
            mode: 'button',
            headerText: "Tools",
            headerClose: true,
            top: 25,
            buttons: {
                'Buzzer': {
                    id: 'tools1Buzzer',
                    click: function() {
                        app.toolDialogBuzzer();
                    },
                    icon: "audio",
                    theme: "d"
                },
                
                'Photo': {
                    id: 'tools1Photo',
                    click: function() {
                        app.toolsPhotoFromCamera(1);    
                    },
                    icon: "camera",
                    theme: "d"
                },
                'StopWatch': {
                    id: 'tools1StopWatch',
                    click: function() {
                        app.toolDialogTimer();
                    },
                    icon: "clock",
                    theme: "d"
                },
                'Timer': {
                    id: 'tools1Timer',
                    click: function() {
                        app.toolDialogCountdown();
                    },
                    icon: "clock",
                    theme: "d"
                }
            }
        });   
    }, 
    toolsDialog2: function() {       
        $('<div>').simpledialog2({
            mode: 'button',
            headerText: "Tools",
            headerClose: true,
            top: 25,
            buttons: {
                'Buzzer': {
                    id: 'tools1Buzzer',
                    click: function() {
                        app.toolDialogBuzzer();
                    },
                    icon: "audio",
                    theme: "d"
                },
                'Notes': {
                    id: 'tools1Photo',
                    click: function() {
                        app.toolDialogNotes();   
                    },
                    icon: "bars",
                    theme: "d"
                },
                'Photo': {
                    id: 'tools1Photo',
                    click: function() {
                        app.toolsPhotoFromCamera(1);    
                    },
                    icon: "camera",
                    theme: "d"
                },
                'StopWatch': {
                    id: 'tools1StopWatch',
                    click: function() {
                        app.toolDialogTimer();
                    },
                    icon: "clock",
                    theme: "d"
                },
                'Timer': {
                    id: 'tools1Timer',
                    click: function() {
                        app.toolDialogCountdown();
                    },
                    icon: "clock",
                    theme: "d"
                }
            }
        });   
    },  
};
