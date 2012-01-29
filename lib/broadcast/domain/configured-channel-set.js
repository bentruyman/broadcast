var mongoose = require('../../../node_modules/mongoose'),
    Schema   = mongoose.Schema;

var ConfiguredChannelSetSchema = new Schema({
  // reference to a Channel Set
  ref: { type: Schema.ObjectId, ref: 'ChannelSet', required: true },
  // the time, in milliseconds relative from the start of a week, a channel set should start
  startTime: { type: Number, required: true }
});

module.exports = ConfiguredChannelSetSchema;
