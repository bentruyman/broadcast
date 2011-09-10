var ConfiguredChannel = require('./configured-channel'),
    Schema = require('../../../node_modules/mongoose').Schema;

var ChannelSet = new Schema({
  label: String, // name of the channel set
  slug: { type: String, unique: true }, // slug to be used in url to point to this channel set
  channels: [ConfiguredChannel] // list of configured channels
});

module.exports = ChannelSet;
