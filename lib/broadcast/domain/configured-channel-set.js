var _ = require('underscore');

/*
 * channelSet: ChannelSet
 * startTime: Number
 */
function ConfiguredChannelSet(data) {
  _.extend(this, data);
}

_.extend(ConfiguredChannelSet.prototype, {
  timeout: 0
});

module.exports = ConfiguredChannelSet;
