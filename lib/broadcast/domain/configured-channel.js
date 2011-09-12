var mongoose = require('../../../node_modules/mongoose'),
    Schema   = mongoose.Schema;

var ConfiguredChannelSchema = new Schema({
  // reference to a Channel
  ref: { type: Schema.ObjectId, ref: 'Channel', required: true },
  // (defaults to Channel timeout)
  timeout: Number
});

ConfiguredChannelSchema.pre('save', function (next) {
  var self = this;
  
  // if a timeout hasn't been specified, default to the reference channel's timeout
  if (typeof this.timeout === 'undefined' || this.timeout === null) {
    mongoose.model('Channel').findById(this.ref, function (err, channel) {
      self.timeout = channel.timeout;
      next();
    });
  } else {
    next();
  }
});

module.exports = ConfiguredChannelSchema;
