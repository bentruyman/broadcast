var _ = require('underscore');

var DEFAULT_TIMEOUT = 30000;

/*
 * name: String
 * description: String
 * type: String
 * url: String
 * timeout: Number
 */
function Channel(data) {
  // merge this instance with user data and defaults
  _.extend(this, {
    type: 'channel',
    name: '',
    description: '',
    assetType: 'page',
    url: ''
  }, data);
  
  this.timeout = (!this.timeout || this.timeout < 0) ? 30000 : parseInt(this.timeout, 10);
}

module.exports = Channel;
