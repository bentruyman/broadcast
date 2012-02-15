var Q = require('q');

var client         = require('../../services/db').client,
    formatRows     = require('../../web/utils').api.formatRows,
    sortRowsByName = require('../../web/utils').api.sortRowsByName;

var channelApi = require('./channel');

var ChannelSet        = require('../../domain/channel-set'),
    ConfiguredChannel = require('../../domain/configured-channel');

// populates a channel set object with its referenced channels
function populateChannels(channelSet) {
  var deferred = Q.defer(),
      configuredChannels = channelSet.configuredChannels,
      keys;
  
  keys = configuredChannels.map(function (c) {
    return c.channel;
  });
  
  // find all referenced channel data
  channelApi.read({ keys: keys }).then(function (channels) {
    // merge channel data with configured channels
    configuredChannels.forEach(function (c, index) {
      c.channel = channels[index];
    });
    
    deferred.resolve(channelSet);
  });
  
  return deferred.promise;
}

var channelSetApi = module.exports = {
  create: function (data) {
    var deferred = Q.defer(),
        set = new ChannelSet(data);
    
    client.insert(set, function (err, resp) {
      set._id  = resp.id;
      set._rev = resp.rev;
      
      if (err) {
        deferred.reject(err);
      } else {
        deferred.resolve(set);
      }
    });
    
    return deferred.promise;
  },
  read: function (params) {
    var deferred = Q.defer();
    
    if (typeof params === 'undefined') {
      params = {};
    }
    
    client.view('channelSets', 'byId', params, function (err, resp) {
      var promises = [];
      
      formatRows(resp.rows).forEach(function (row) {
        promises.push(populateChannels(row));
      });
      
      Q.all(promises).then(function (sets) {
        deferred.resolve(sortRowsByName(sets));
      });
    });
    
    return deferred.promise;
  },
  update: function (data) {
    // TODO: throw if no rev is present
    var deferred = Q.defer(),
        channelSet = new ChannelSet(data);
    
    client.insert(channelSet, function (err, resp) {
      // TODO: throw for conflicts
      channelSet._id = resp.id;
      channelSet._rev = resp.rev;
      
      if (err) {
        deferred.reject(err);
      } else {
        deferred.resolve(channelSet);
      }
    });
    
    return deferred.promise;
  },
  delete: function (id) {
    // TODO: throw if no id is present
    var deferred = Q.defer();
    
    // find the latest rev of the doc
    channelSetApi.read({ key: id }).then(function (sets) {
      // TODO: handle a delete request on a document that doesn't exist
      client.destroy(sets[0]._id, sets[0]._rev, function (err, resp) {
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
