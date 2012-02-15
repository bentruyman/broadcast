var Q = require('q');

var client = require('../../services/db').client,
    formatRows = require('../../web/utils').api.formatRows;

var channelSetApi = require('./channel-set');

var ChannelSet = require('../../domain/channel-set'),
    Display    = require('../../domain/display');

// populates a display object with its referenced channel sets
function populateChannelSets(display) {
  var deferred = Q.defer(),
      configuredChannelSets = display.configuredChannelSets,
      keys;
  
  keys = configuredChannelSets.map(function (c) {
    return c.channelSet;
  });
  
  // find all referenced channel set data
  channelSetApi.read({ keys: keys }).then(function (sets) {
    // merge display data with configured channel sets
    configuredChannelSets.forEach(function (c, index) {
      c.channelSet = sets[index];
    });
    
    deferred.resolve(display);
  });
  
  return deferred.promise;
}

var displayApi = module.exports = {
  create: function (data) {
    var deferred = Q.defer(),
        display = new Display(data);
    
    client.insert(display, function (err, resp) {
      display._id  = resp.id;
      display._rev = resp.rev;
      
      if (err) {
        deferred.reject(err);
      } else {
        deferred.resolve(display);
      }
    });
    
    return deferred.promise;
  },
  read: function (condition) {
    var deferred = Q.defer();
    
    if (typeof params === 'undefined') {
      params = {};
    }
    
    client.view('displays', 'byId', params, function (err, resp) {
      var promises = [];
      
      formatRows(resp.rows).forEach(function (row) {
        promises.push(populateChannelSets(row));
      });
      
      Q.all(promises).then(function (sets) {
        deferred.resolve(sets);
      });
    });
    
    return deferred.promise;
  },
  update: function (data) {
    // TODO: throw if no rev is present
    var deferred = Q.defer(),
        display = new Display(data);
    
    client.insert(display, function (err, resp) {
      // TODO: throw for conflicts
      display._id = resp.id;
      display._rev = resp.rev;
      
      if (err) {
        deferred.reject(err);
      } else {
        deferred.resolve(display);
      }
    });
    
    return deferred.promise;
  },
  delete: function (id) {
    // TODO: throw if no id is present
    var deferred = Q.defer();
    
    // find the latest rev of the doc
    displayApi.read({ key: id }).then(function (display) {
      // TODO: handle a delete request on a document that doesn't exist
      client.destroy(display[0]._id, display[0]._rev, function (err, resp) {
        if (err) {
          deferred.reject(err);
        } else {
          deferred.resolve();
        }
      });
    });
    
    return deferred.promise;
  }
};
