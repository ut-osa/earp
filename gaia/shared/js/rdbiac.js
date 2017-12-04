'use strict';

function registerInterAppService(name, ops) {
  var ias = navigator.registerRDBIAS(name);
  ias.onreceived = function(event) {
    var r = this.ias.getNextRequest();
    switch (r.op) {
      case 'list':
        if (this.ops.list) {
          try {
            this.ops.list(r);
          } catch (er) {
            r.notifyFailure();
          }
        } else {
          r.notifyFailure();
        }
        break;
      case 'remove':
        if (this.ops.remove) {
          try {
            this.ops.remove(r);
          } catch (er) {
            r.notifyFailure();
          }
        } else {
          r.notifyFailure();
        }
        break;
      case 'alter':
        if (this.ops.alter) {
          try {
            this.ops.alter(r);
          } catch (er) {
            r.notifyFailure();
          }
        } else {
          r.notifyFailure();
        }
        break;
      case 'add':
        if (this.ops.add) {
          try {
            this.ops.add(r);
          } catch (er) {
            r.notifyFailure();
          }
        } else {
          r.notifyFailure();
        }
        break;
    }
  }.bind({ias: ias, ops: ops});
  return ias;
}

function registerPortInterAppService(name, ops, schema) {
  var ias = navigator.portRDBIASManager.registerService(name, schema);
  ias.onreceived = function(event) {
    var r = this.ias.getNextRequest();
    switch (r.op) {
      case 'list':
        if (this.ops.list) {
          try {
            this.ops.list(r);
          } catch (er) {
            r.notifyFailure();
          }
        } else {
          r.notifyFailure();
        }
        break;
      case 'remove':
        if (this.ops.remove) {
          try {
            this.ops.remove(r);
          } catch (er) {
            r.notifyFailure();
          }
        } else {
          r.notifyFailure();
        }
        break;
      case 'alter':
        if (this.ops.alter) {
          try {
            this.ops.alter(r);
          } catch (er) {
            r.notifyFailure();
          }
        } else {
          r.notifyFailure();
        }
        break;
      case 'add':
        if (this.ops.add) {
          try {
            this.ops.add(r);
          } catch (er) {
            r.notifyFailure();
          }
        } else {
          r.notifyFailure();
        }
        break;
    }
  }.bind({ias: ias, ops: ops});
  return ias;
}
