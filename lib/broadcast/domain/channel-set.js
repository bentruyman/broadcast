var _ = require('underscore');

/*
 * name: String
 * description: String
 * configuredChannels: [ConfiguredChannel*_id]
 */
function ChannelSet(data) {
  _.extend(this, {
    type: 'channelSet',
    name: '',
    description: '',
    configuredChannels: []
  }, data);
}

module.exports = ChannelSet;
