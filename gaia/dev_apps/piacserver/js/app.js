var oMyBlob = new Blob(["some test text"], {type: 'text/plain'});
var oMyBlob2 = new Blob(["other test text"], {type: 'text/plain'});

var serviceSchema = {
  meta: {d: ''},
  blob: {b: '', meta: 'prop'},
}

var schema = new RDBSchema(serviceSchema);

// table meta
var repo = {
  a: {pk: 'a', d: 'aa'},
  b: {pk: 'b', d: 'bb'},
  c: {pk: 'c', d: 'cc'},
  d: {pk: 'd', d: 'dd'},
};

// table blob
var datarepo = {
  a: {pk: 'a', PROP_meta: 'a', b: oMyBlob},
  d: {pk: 'd', PROP_meta: 'd', b: oMyBlob2},
};

var gcnt = 0;

var queryStates = {};

var ops = {
  list: function(req) {
    var tabs = req.getTabs();
    if (tabs.length !== 1) {
      req.notifyFailure();
      return;
    }
    switch (tabs[0]) {
      case 'meta':
      {
        var l = [];
        // an example to feed data in two rounds
        if (queryStates['r' + req.sequenceNumber]) {
          for (var row in repo) {
            if (row !== 'a' && row !== 'b')
              l.push(repo[row]);
          }
          delete queryStates['r' + req.sequenceNumber];
          req.list(l);
          req.notifySuccess();
          return;
        } else {
          for (var row in repo) {
            if (row === 'a' || row === 'b')
              l.push(repo[row]);
          }
          queryStates['r' + req.sequenceNumber] = 1;
          req.list(l);
          req.notifyIncomplete();
          return;
        }
      }
        break;
      case 'blob':
      {
        var w = req.securityWhere;
        if (!w || !w["PROP_meta"]) {
          req.notifyFailure();
          return;
        }
        var fk = w["PROP_meta"];
        if (datarepo[fk]) {
          req.list([datarepo[fk]]);
        } else {
          req.list([]);
        }
        req.notifySuccess();
        return;
      }
        break;
      default:
        req.notifyFailure();
        return;
    }
  },

  remove: function (req) {
    if (req.tab !== 'meta') {
      req.notifyFailure();
      return;
    }
    delete repo[req.val.pk];
    req.notifySuccess();
  },

  alter: function(req) {
    if (req.tab !== 'meta') {
      req.notifyFailure();
      return;
    }
    var entry = repo[req.val.pk];
    var updatedCols = req.updatedCols;
    for (var col in updatedCols) {
      entry[col] = updatedCols[col];
    }
    req.notifySuccess();
  },

  add: function(req) {
    switch (req.tab) {
      case 'meta':
      {
        var row = req.val;
        row.pk = 'z' + (gcnt++);
        repo[row.pk] = row;
        req.setNewPk(row.pk);
        req.notifySuccess();
        return;
      }
        break;
      case 'blob':
      {
        var row = req.val;
        if (row["PROP_meta"]) {
          datarepo[row["PROP_meta"]] = row;
        }
        req.notifySuccess();
        return;
      }
        break;
      default:
        req.notifyFailure();
        return;
    }
  }
};

var ias = registerPortInterAppService("TestInterAppService", ops, schema);
ias.setPolicyForMyself({meta: {cols: "pk,d", insertable: true, updatable: true, queryable: true, deletable: true},
                        blob: {cols: "pk,b,PROP_meta"}});

// for the browser app (just for test purpose)
ias.setPolicyForApp("app-piacclient.gaiamobile.org",
                    {meta: {cols: "pk,d", insertable: true, updatable: true, queryable: true, deletable: true,
                            fixedCols: {d: "fixed"}, where: {type: '!=', d: 'cc'}},
                        blob: {cols: "pk,b,PROP_meta"}});

var NROUND = 4000;
var bw = [];
var word = '';
for (var i = 0; i < 1024; i++) {
  word += 'a';
}

for (var i = 0; i < 1; i++) {
  bw.push({d: word});
}


var cnt = 0;
var opst = {
  list: function(req) {
    cnt++;
    req.list(bw);
    if (cnt < NROUND) {
      req.notifyIncomplete();
    } else {
      cnt = 0;
      req.notifySuccess();
    }
  },

  add: function(req) {
    req.notifySuccess();
  },

  alter: function(req) {
    req.notifySuccess();
  },

  remove: function(req) {
    req.notifySuccess();
  }
}

var iast = registerPortInterAppService("TestTimeService", opst);
iast.setPolicyForApp("app-benchmark.gaiamobile.org",
                    {'a': {cols: "d", queryable: true, insertable: false}});
