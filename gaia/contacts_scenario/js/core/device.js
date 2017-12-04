var Device = {
  getPlatform: function() {
        //toast("getDevicePlatform");
        var device;
        var deviceArray;
        var userAgent = navigator.userAgent;
        //console.log(navigator.userAgent);
        //userAgent = "Mozilla/5.0 (Mobile; rv:14.0) Gecko/14.0 Firefox/14.0";
        if (userAgent.match(/(iOS|iPhone|iPod|iPad|Android|Windows Phone|Mobile)/)) {
            deviceArray = userAgent.match(/(iPhone|iPod|iPad|Android|Windows Phone|Mobile)/);
            //console.log(devicePlatformArray);
            device = deviceArray[0];
            if (device === "Mobile") {
                deviceArray = userAgent.match(/(Firefox)/);
                device = deviceArray[0];
                if (device === "Firefox") {
                    device = "FirefoxOS";
                } else {
                    device = "Browser";
                }
            }
            //console.log("matched user agent");
            //console.log(device);
            if (device === "iPhone" || device === "iPod" || device === "iPad") {
                device = "iOS";
            }
            if (device === "Windows Phone") {
                device = "WinPhone";
            }
        } else {
            device = "Browser";
        }
        //console.log("returning: " + device);
        //toast("GetDevicePlatform: " + device);
        return device;
    },
    
    initialize: function(callback) {
        this.platform = Device.getPlatform();
        //console.log("[DEVICE] Initialize: " + this.platform);
        callback(true);
    }  
};

//Device.initialize();
