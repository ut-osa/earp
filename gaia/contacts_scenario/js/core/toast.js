var Toast = {
    toast: function(msg, bMini, bLong, sAlign) {
        var duration = 400;
        if (bLong === true) {
            duration = 800;
        }
    
        if (bMini === undefined) {
            bMini = false;
        }
    
        if (bLong === undefined) {
            bLong = false;
        }
                
        if (sAlign === undefined) {
            sAlign = "center";
        }
    
        if (msg !== "") {
            if (bMini === false) {
                $("<div class='ui-loader ui-overlay-shadow ui-body-c ui-corner-all'><h3>" + msg + "</h3></div>")
                    .css({
                        display: "inline-block",
                        opacity: 0.90,
                        position: "fixed",
                        padding: "7px",
                        width: "270px",
                        left: ($(window).width() - 284) / 2,
                        top: $(window).height() / 4,
                        "text-align": sAlign,
                        "background-color": "#FFFFCC"
                    })
                    .appendTo($.mobile.pageContainer).delay(1500)
                    .fadeOut(duration, function() {
                        $(this).remove();
                    });
            } else {
                $("<div class='ui-loader ui-overlay-shadow ui-body-c ui-corner-all'><small>" + msg + "</small></div>")
                    .css({
                        display: "inline-block",
                        opacity: 0.70,
                        position: "fixed",
                        padding: "4px",
                        "text-align": "center",
                        width: "270px",
                        left: ($(window).width() - 284) / 16,
                        top: ($(window).height() - 100),
                        "background-color": "#FFFFCC"
                    })
                    .appendTo($.mobile.pageContainer).delay(1500)
                    .fadeOut(duration, function() {
                        $(this).remove();
                    });
            }
        }
    },
    
    toastLeft: function(msg) {
        Toast.toast(msg, false, false, "left");  
    },
    
    toastMini: function(msg) {
        Toast.toast(msg, true, false);
    },

    toastMiniLong: function(msg) {
        Toast.toast(msg, true, true);
    },

    toastLong: function(msg) {
        Toast.toast(msg, false, true);
    }
  
};
