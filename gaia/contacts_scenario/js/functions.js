//Functions

function toTitleCase(str) {
    return str.replace(/\w\S*/g, function(txt) {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
}

function changePage(myTarget) {
    $(":mobile-pagecontainer").pagecontainer("change", myTarget);
}

function alertDebug(s) {
    if (Globals.bDebug === true) {
        alert(s);
    }
}

function doPad(s, l) {
    //console.log(s);
    //console.log(l);
    //console.log("len: " + s.length);
   while (s.length < l) {
       s = "0" + s;
   }
   return s;
}

function getTimestamp(optDate) {
    var d = new Date();
    if (optDate !== undefined) {
        d = optDate;
    }
    var i = d.getTime();
    //var j = d.getTimezoneOffset();
    //console.log('timeZoneOffset: ' + j);
    //j *= 60000;
    //j = 0;
    //var k = i - j;
    //e = new Date(k);
    //Toast.toast(i + " " + j + " " + humaneDate(e));
    return i;
}

function roundHalf(num) {
    num = Math.round(num * 2) / 2;
    return num;
}

function roundQuarter(num) {
    num = Math.round(num * 4) / 4;
    return num;
}

Array.prototype.clean = function(deleteValue) {
    for (var i = 0; i < this.length; i++) {
        if (this[i] == deleteValue) {
            this.splice(i, 1);
            i--;
        }
    }
    return this;
};

function twoDigits(d) {
    if (0 <= d && d < 10) return "0" + d.toString();
    if (-10 < d && d < 0) return "-0" + (-1 * d).toString();
    return d.toString();
}

Date.prototype.toMysqlFormat = function() {
    return this.getUTCFullYear() + "-" + twoDigits(1 + this.getUTCMonth()) + "-" + twoDigits(this.getUTCDate()) + " " + twoDigits(this.getUTCHours()) + ":" + twoDigits(this.getUTCMinutes()) + ":" + twoDigits(this.getUTCSeconds());
};

function getDots(dots) {
    var s = "";
    dots++;
    if (dots > 3) {
        dots = 0;
    }
    for (var i = 0; i < dots; i++) {
        s += ".";
    }
    return s;
}







function playAudio(src, preload) {
    if (Device.platform === "FirefoxOS" || Device.platform === "Browser" || Device.platform === "WinPhone") {
        if (preload === false) {
          // create an audio element that can be played in the background
          var audio = new Audio(); 
          audio.src = src;
          audio.preload = 'auto';
          audio.mozAudioChannelType = 'content';
          audio.play();   
        }
    } else {
        var my_media;
        //console.log("playAudio");
        function audioSuccess() {
            //console.log("[AUDIO]: Success " + src);
        }
        
        function audioError(msg) {
            //console.log("[AUDIO]: Error " + msg);
        }
    
        if (Device.platform !== "Browser") {
            //console.log('[AUDIO]: Mobile Device');
                 // Create Media object from src
            if (Device.platform == 'Android') { 
                src = '/android_asset/www/' + src; 
                //console.log("Android src: " + src);
            } 
                 
            my_media = new Media(src, audioSuccess, audioError);
        
            // Play audio
            if (preload === true) {
                //console.log("[AUDIO]: Preloading " + src);
                if (Device.platform !== "Android") {
                   my_media.setVolume('0.0');   
                   my_media.play(); 
                }
            } else {
                my_media.setVolume('1.0');
                my_media.play(); 
                //console.log("[AUDIO]: Playing " + src);
            }
              
        } else {
            //console.log("[AUDIO]: Skipped");
        }    
    }
}





function serialize(obj) {
    var str = [];
    for (var p in obj)
        if (obj.hasOwnProperty(p)) {
            str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
        }
    return str.join("&");
}

function isNumber(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
}

if (!Array.prototype.indexOf) {
    Array.prototype.indexOf = function(needle) {
        for (var i = 0; i < this.length; i++) {
            if (this[i] === needle) {
                return i;
            }
        }
        return -1;
    };
}

function isALetter(s) {
    s = s.toLowerCase;
    switch (s) {
        case "a":
            return true;
        case "b":
            return true;
        case "c":
            return true;
        case "d":
            return true;
        case "e":
            return true;
        case "f":
            return true;
        case "g":
            return true;
        case "h":
            return true;
        case "i":
            return true;
        case "j":
            return true;
        case "k":
            return true;
        case "l":
            return true;
        case "m":
            return true;
        case "n":
            return true;
        case "o":
            return true;
        case "p":
            return true;
        case "q":
            return true;
        case "r":
            return true;
        case "s":
            return true;
        case "t":
            return true;
        case "u":
            return true;
        case "v":
            return true;
        case "w":
            return true;
        case "x":
            return true;
        case "y":
            return true;
        case "z":
            return true;
        default:
            return false;
    }
}

function dynamicSort(property) {
    var sortOrder = 1;
    if (property[0] === "-") {
        sortOrder = -1;
        property = property.substr(1, property.length - 1);
    }
    return function(a, b) {
        var result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
        return result * sortOrder;
    };
}

function dynamicSortMultiple() {
    /*
     * save the arguments object as it will be overwritten
     * note that arguments object is an array-like object
     * consisting of the names of the properties to sort by
     */
    var props = arguments;
    return function(obj1, obj2) {
        var i = 0,
            result = 0,
            numberOfProperties = props.length;
        /* try getting a different result from 0 (equal)
         * as long as we have extra properties to compare
         */
        while (result === 0 && i < numberOfProperties) {
            result = dynamicSort(props[i])(obj1, obj2);
            i++;
        }
        return result;
    };
}

Array.prototype.shuffle = function(callback) {
    //console.log("Shuffle");
    var i = this.length,
        j, tempi, tempj;
    if (i === 0) {
        return this;
    }
    while (--i) {
        j = Math.floor(Math.random() * (i + 1));
        tempi = this[i];
        tempj = this[j];
        this[i] = tempj;
        this[j] = tempi;
    }
    return this;
};

String.prototype.trimMore = function() {
    var s = this.trim();
    s = s.replace(/^\s+|\s+$/g, '');
    return s;
};

function findLowest(a, b, c) {
    if ((a <= b) && (a <= c)) {
        return a;
    } else if ((b <= a) && (b <= c)) {
        return b;
    } else {
        return c;
    }
}

String.prototype.sanitize = function() {
    var s = this.trim();
    s = s.replace(/ /g, "");
    s = s.replace(/,/g, "");
    s = s.replace(/-/g, "");
    s = s.replace(/:/g, "");
    s = s.replace(/@/g, "");
    s = s.replace(/#/g, "");
    s = s.replace(/$/g, "");
    s = s.replace(/%/g, "");
    s = s.replace(/&/g, "");
    s = s.replace(/\*/g, "");
    s = s.replace(/\(/g, "");
    s = s.replace(/\)/g, "");
    s = s.replace(/=/g, "");
    s = s.replace(/\+/g, "");
    s = s.replace(/!/g, "");
    s = s.replace(/`/g, "");
    s = s.replace(/~/g, "");
    s = s.replace(/\?/g, "");
    s = s.replace(/\./g, "");
    s = s.replace(/</g, "");
    s = s.replace(/>/g, "");
    s = s.replace(/\//g, "");
    s = s.replace(/\\/g, "");
    s = s.replace(/"/g, "");
    s = s.replace(/'/g, "");
    s = s.replace(/:/g, "");
    return s;
};

String.prototype.sanitizeBrackets = function() {
    var s = this.trim();
    s = s.replace(/</g, "");
    s = s.replace(/>/g, "");
    return s;
};

function cleanArray(actual) {
    var newArray = [];
    for (var i = 0; i < actual.length; i++) {
        if (actual[i]) {
            newArray.push(actual[i]);
        }
    }
    return newArray;
}