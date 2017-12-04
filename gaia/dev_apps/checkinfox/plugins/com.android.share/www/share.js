cordova.define("com.android.share.Share", function(require, exports, module) { //cordova.define("com.android.share.Share", function (require, exports, module) {
var exec = require("cordova/exec");
module.exports = {
show: function (message, win, fail) {
exec(win, fail, "Share", "show", [message]);
}
};
//});

});
