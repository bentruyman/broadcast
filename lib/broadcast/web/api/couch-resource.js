var inflection = require('inflection');

var CouchResource = module.exports = function (type, domainObject, db) {
  this._type = type;
  this._domain = domainObject;
  this._db = db;
};

// formats an array of rows returned from couchdb for use by api users
CouchResource.prototype._formatRows = function (rows) {
  return rows.map(function (row) {
    return row.value;
  });
};

// sorts a list of rows by a given property
CouchResource.prototype._sortRowsByProperty = function (rows, prop, desc) {
  rows = rows.sort(function (a, b) {
    return (desc) ? a[prop] < b[prop] : a[prop] > b[prop];
  });
  
  return rows;
};

CouchResource.prototype._viewRequest = function () {
  var self = this,
    // get all args, except the callback
    args = Array.prototype.slice.call(arguments, 0, -1),
    // get user supplied callback
    callback = Array.prototype.slice.call(arguments, -1)[0];
  
  // make the view request
  self._db.view.apply(this._db, [].concat(args, function (err, res) {
    // if an error occurred, send it
    if (err) {
      callback(err);
    }
    // otherwise, send the response data
    else {
      callback(null, self._formatRows(res.rows));
    }
  }));
};

CouchResource.prototype.create = function (doc, callback) {
  doc = new this._domain(doc);
  
  this._db.insert(doc, function (err, res) {
    if (err) {
      callback(new Error(err));
    } else {
      doc._id = res.id;
      doc._rev = res.rev;
      
      callback(null, doc);
    }
  });
};

CouchResource.prototype.read = function (params, callback) {
  var self = this;
  
  if (!callback) {
    callback = params;
    params = {};
  }
  
  self._viewRequest(inflection.pluralize(this._type), 'byId', params, function (err, docs) {
    callback(err, docs.map(function (doc) {
      return new self._domain(doc);
    }));
  });
};

CouchResource.prototype.readOne = function (id, callback) {
  this.read({ key: id }, function (err, docs) {
    if (docs.length !== 1) {
      callback(new Error('Document "' + id + '" not found'));
    } else {
      callback(null, docs[0]);
    }
  });
};

CouchResource.prototype.update = function (doc, callback) {
  if (!doc._id || !doc._rev) {
    callback(new Error('Document must contain an _id and _rev in order to be updated'));
  } else {
    this.create(doc, callback);
  }
};

CouchResource.prototype.delete = function (id, callback) {
  var self = this;
  
  self.readOne(id, function (err, doc) {
    if (err) {
      return callback(err);
    }
    self._db.destroy(id, doc._rev, function (err, res) {
      callback(null);
    });
  });
};
