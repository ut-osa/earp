var Internet = {
    isOnline: function() {
        var ret = navigator.onLine;
        if (Device.platform === "Android") {
            ret = true;
        }
        return ret;
    },
    
    hostReachable: function(host) {
        if (!host) {
            host = "https://rebrandcloud.secure.omnis.com/cloud/online.asp";
        }
        // Handle IE and more capable browsers
        var xhr = new(window.ActiveXObject || XMLHttpRequest)("Microsoft.XMLHTTP");
        var status;
    
        // Open new request as a HEAD to the root hostname with a random param to bust the cache
        xhr.open("HEAD", host + "?rand=" + Math.floor((1 + Math.random()) * 0x10000), false);
    
        // Issue request and handle response
        try {
            xhr.send();
            return (xhr.status >= 200 && xhr.status < 300 || xhr.status === 304);
        } catch (error) {
            return false;
        }
    
    },
    
    getURLSource: function(url, data, spinner, callback) {
        //console.log(url + "?" + serialize(data));
        if (spinner === true) {
            $.mobile.loading("show");
        }
    
        if (Device.platform === "FirefoxOS") {
            //console.log("Using xhr");
            //console.log(typeof(data));
            if (typeof(data) === "object") {
                //console.log("convert object");
                data = $.param(data);
                //console.log("after: " + data);
            }
    
            if (data !== undefined) {
                url += "?";
                url += data;
            }
            //console.log("GetURLSource: " + url);
            var xhr = new XMLHttpRequest({
                mozSystem: true
            });
    
            xhr.open("GET", url, true);
            xhr.responseType = "text";
    
            xhr.onload = function() {
                //console.log(this.response);
                var data = JSON.parse(this.response);
                //console.log("xhr done");
                //console.log(data);
                $.mobile.loading("hide");
                callback(data);
            };
            xhr.onerror = function() {
                $.mobile.loading("hide");
                if (Globals.bDebug === true) {
                    Toast.toast("Error with system XHR");
                }
                callback(null);
            };
            xhr.send();
        } else {
            $.ajax({
                    url: url,
                    data: data,
                    crossDomain: true,
                    dataType: "jsonp"
                })
                .done(function(data) {
                    //console.log("ajax done");
                    //console.log(data);
                    callback(data);
                })
                .fail(function(xhr, err) {
                    //console.log("failed");
                    var responseTitle = $(xhr.responseText).filter('title').get(0);
                    var response = $(xhr.responseText).filter('body').get(0);
                    //console.log(response);
                    if (Globals.bDebug === true) {
                        Toast.toast($(responseTitle).text() + "\n" + Internet.formatErrorMessage(xhr, err));
                    }
                    callback(null);
                })
                .always(function() {
                    //console.log("complete");
                    $.mobile.loading("hide");
                });
        }
    },
    
    formatErrorMessage: function(jqXHR, exception) {
        //console.log(jqXHR);
        if (jqXHR.status === 0) {
            return ('Not connected.\nPlease verify your network connection.');
        } else if (jqXHR.status == 404) {
            return ('The requested page not found. [404]');
        } else if (jqXHR.status == 500) {
            return ('Internal Server Error [500].');
        } else if (exception === 'parsererror') {
            return ('Requested JSON parse failed.');
        } else if (exception === 'timeout') {
            return ('Time out error.');
        } else if (exception === 'abort') {
            return ('Ajax request aborted.');
        } else {
            return ('Uncaught Error.\n' + jqXHR.responseText);
        }
    }
    
      
};


