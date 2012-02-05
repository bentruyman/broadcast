var cradle = require('../../../node_modules/cradle'),
    Q      = require('../../../node_modules/q');

module.exports = {
  init: function () {
    var deferred = Q.defer();
    
    deferred.resolve();
    
    return deferred.promise;
  }
};
