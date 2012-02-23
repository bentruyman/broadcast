var _ = require('underscore'),
    generateSlug = require('../web/utils').string.generateSlug;

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
    name: '',
    description: '',
    assetType: 'page',
    url: '',
    timeout: 10000
  }, data);
}

// force channel type
Object.defineProperty(Channel.prototype, 'type', {
  value: 'channel',
  writable: false
});

Object.defineProperty(Channel.prototype, 'slug', {
  get: function () {
    return generateSlug(this.name);
  },
  enumerable: true
});

Channel.prototype.toJSON = function () {
  var channel = {};
  
  if (this._id)  { channel._id  = this._id; }
  if (this._rev) { channel._rev = this._rev; }
  
  channel.type        = this.type;
  channel.name        = this.name;
  channel.slug        = this.slug;
  channel.description = this.description;
  channel.assetType   = this.assetType;
  channel.url         = this.url;
  channel.timeout     = this.timeout;
  
  return channel;
};

module.exports = Channel;
