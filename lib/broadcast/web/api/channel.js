var Q = require('q');

var client         = require('../../services/db').client,
    formatRows     = require('../../web/utils').api.formatRows,
    sortRowsByName = require('../../web/utils').api.sortRowsByName;

var Channel = require('../../domain/channel');

var channelApi = module.exports = {
  create: function (data) {
    var deferred = Q.defer(),
        channel = new Channel(data);
    
    client.insert(channel, function (err, resp) {
      channel._id  = resp.id;
      channel._rev = resp.rev;
      
      if (err) {
        deferred.reject(err);
      } else {
        deferred.resolve(channel);
      }
    });
    
    return deferred.promise;
  },
  read: function (params) {
    var deferred = Q.defer();
    
    if (typeof params === 'undefined') {
      params = {};
    }
    
    client.view('channels', 'byId', params, function (err, resp) {
      if (err) {
        deferred.reject(err);
      } else {
        deferred.resolve(sortRowsByName(formatRows(resp.rows)));
      }
    });
    
    return deferred.promise;
  },
  update: function (data) {
    // TODO: throw if no rev is present
    var deferred = Q.defer(),
        channel = new Channel(data);
    
    client.insert(channel, function (err, resp) {
      // TODO: throw for conflicts
      channel._id = resp.id;
      channel._rev = resp.rev;
      
      if (err) {
        deferred.reject(err);
      } else {
        deferred.resolve(channel);
      }
    });
    
    return deferred.promise;
  },
  delete: function (id) {
    // TODO: throw if no id is present
    var deferred = Q.defer();
    
    // find the latest rev of the doc
    channelApi.read({ key: id }).then(function (channels) {
      // TODO: handle a delete request on a document that doesn't exist
      client.destroy(channels[0]._id, channels[0]._rev, function (err, resp) {
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
