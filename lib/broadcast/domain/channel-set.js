var _ = require('underscore'),
    generateSlug = require('../web/utils').string.generateSlug;

/*
 * name: String
 * description: String
 * configuredChannels: [ConfiguredChannel*_id]
 */
function ChannelSet(data) {
  _.extend(this, {
    description: '',
    configuredChannels: []
  }, data);
}

// force channelSet type
Object.defineProperty(ChannelSet.prototype, 'type', {
  value: 'channelSet',
  writable: false
});

Object.defineProperty(ChannelSet.prototype, 'slug', {
  get: function () {
    return generateSlug(this.name);
  },
  enumerable: true
});

ChannelSet.prototype.toJSON = function () {
  var channelSet = {};
  
  if (this._id)  { channelSet._id  = this._id; }
  if (this._rev) { channelSet._rev = this._rev; }
  
  channelSet.type               = this.type;
  channelSet.name               = this.name;
  channelSet.slug               = this.slug;
  channelSet.description        = this.description;
  channelSet.configuredChannels = this.configuredChannels;
  
  return channelSet;
};

module.exports = ChannelSet;
