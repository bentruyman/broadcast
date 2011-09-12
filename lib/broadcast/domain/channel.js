var Schema = require('../../../node_modules/mongoose').Schema;

const DEFAULT_TIMEOUT = 30 * 1000; // 30 seconds

var ChannelSchema = new Schema({
  // channel's index number
  index: { type: Number, unique: true, required: true },
  // name of the channel
  label: { type: String, required: true },
  // url of the channel's asset
  url: { type: String, required: true },
  // image, video, or page (defaults to page)
  type: { type: String, 'enum': ['image', 'video', 'page'], 'default': 'page', required: true},
  // time (in milliseconds) this channel lives
  timeout: { type: Number, 'default': DEFAULT_TIMEOUT }
});

// if timeout is set to null, reset it to the default timeout
ChannelSchema.path('timeout').set(function (value) {
  return (value === null) ? DEFAULT_TIMEOUT : value;
});

// retrieves all channels sorted by their index
ChannelSchema.statics.getAllSorted = function (callback) {
  return this.find().sort('index', 1).run(callback);
};

module.exports = ChannelSchema;
