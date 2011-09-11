var mongoose = require('../../../node_modules/mongoose'),
    Channel  = require('./channel'),
    Schema   = mongoose.Schema;

var ConfiguredChannel = new Schema({
  channel: { type: Schema.ObjectId, ref: 'Channel', required: true }, // reference to a Channel
  timeout: Number // (defaults to Channel timeout)
});

ConfiguredChannel.pre('save', function (next) {
  var self = this;
  
  // if a timeout hasn't been specified, default to the reference channel's timeout
  if (typeof this.timeout === 'undefined' || this.timeout === null) {
    mongoose.model('Channel').findById(this.channel, function (err, channel) {
      self.timeout = channel.timeout;
      next();
    });
  } else {
    next();
  }
});

module.exports = ConfiguredChannel;
