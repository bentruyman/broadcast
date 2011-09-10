var Channel = require('./channel'),
    Schema = require('../../../node_modules/mongoose').Schema;

var ChannelSet = new Schema({
  channel: [Channel], // reference to a Channel
  timeout: Number // (defaults to Channel timeout)
});

ChannelSet.pre('save', function (next) {
  var timeout = this.timeout;
  
  if (typeof timeout === 'undefined' || timeout === null) {
    timeout = this.channel.timeout;
  }
  
  next();
});

module.exports = ChannelSet;
