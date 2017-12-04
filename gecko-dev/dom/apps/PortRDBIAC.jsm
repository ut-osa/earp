// vim: set filetype=javascript shiftwidth=2 tabstop=2:
"use strict";

this.EXPORTED_SYMBOLS = ["PortRDBIAC"];

const Cc = Components.classes;
const Ci = Components.interfaces;
const Cu = Components.utils;

Cu.import("resource://gre/modules/DOMRequestHelper.jsm");

this.PortRDBIAC = function() {}

this.PortRDBIAC.prototype = {
  __proto__: DOMRequestIpcHelper.prototype,
  __init: function() {
    this.reqs = {};
    dump('aaaaa\n');
  }
}
