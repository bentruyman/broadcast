var mongoose = require('../../../node_modules/mongoose'),
    Schema   = mongoose.Schema;


var DEFAULT_TIMEOUT = 30 * 1000; // 30 seconds

var ChannelSchema = new Schema({
  // channel's index number
  index: { type: Number, unique: true, required: true },
  // name of the channel
  title: { type: String, required: true },
  // url of the channel's asset
  url: { type: String, required: true },
  // image, video, or page (defaults to page)
  type: { type: String, 'enum': ['image', 'video', 'page'], 'default': 'page', required: true },
  // time (in milliseconds) this channel lives
  timeout: { type: Number, 'default': DEFAULT_TIMEOUT }
});

// if timeout is set to null, reset it to the default timeout
ChannelSchema.path('timeout').set(function (value) {
  return (value === null) ? DEFAULT_TIMEOUT : value;
});

// when a channel is removed, remove references to it from other channel sets
ChannelSchema.pre('remove', function (next) {
  var ChannelSet = mongoose.model('ChannelSet'),
      id = this._id;
  
  // find channel sets with references to this channel
  ChannelSet.find({ 'channels.ref': id }, function (err, sets) {
    // for each set, loop through their channels removing references to the
    // channel being removed
    if (sets !== null) {
      sets.forEach(function (set) {
        for (var i = 0; i < set.channels.length; i++) {
          if (set.channels[i].ref.toString() === id.toString()) {
            set.channels[i].remove();
          }
        }
        
        set.save();
      });
    }
  });
  
  next();
});

// retrieves all channels sorted by their index
ChannelSchema.statics.getAllSorted = function (callback) {
  return this.find().sort('index', 1).run(callback);
};

module.exports = ChannelSchema;
