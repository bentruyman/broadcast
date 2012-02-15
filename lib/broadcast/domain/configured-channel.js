var _ = require('underscore');

/*
 * channel: Channel*_id
 * timeout: Number
 */
function ConfiguredChannel(data) {
  _.extend(this, { timeout: data.channel.timeout }, data);
}

module.exports = ConfiguredChannel;
