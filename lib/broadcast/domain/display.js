var mongoose = require('../../../node_modules/mongoose'),
    ConfiguredChannelSetSchema = require('./configured-channel-set'),
    Schema   = mongoose.Schema;

var DAYS_IN_WEEK = 7;

var DisplaySchema = new Schema({
  // name of the display
  title: { type: String, required: true },
  // slug to be used in url to point to this channel set
  slug: { type: String, unique: true },
  // list of configured channel sets
  channelSets: [ConfiguredChannelSetSchema]
});

// ensure a channel set doesn't have the same start time as another
DisplaySchema.path('channelSets').validate(function (value, next) {
  var isValid = true;
  
  for (var i = 0, j = this.channelSets.length; i < j; i++) {
    if (this.channelSets[i].startTime === value.startTime) {
      isValid = false;
      break;
    }
  }
  
  next(isValid);
});

DisplaySchema.methods.removeAllChannelSets = function (callback) {
  var self = this;
  
  // FIXME: temporary workardound, mongoose has a bug where multiple embedded
  //        documents can't be removed in one save
  if (this.channelSets && this.channelSets.length > 0) {
    this.channelSets[0].remove();
    this.save(function (err) {
      self.removeAllChannelSets(callback);
    });
  } else {
    callback.call(null);
  }
};

DisplaySchema.methods.updateChannelSets = function (sets, callback) {
  var self = this;
  
  this.removeAllChannelSets(function () {
    if (sets) {
      // add new configured channel sets
      for (var i = 0, j = sets.length; i < j; i++) {
        self.channelSets.push(sets[i]);
      }
    }
    
    self.save(callback);
  });
};

// automatically generates slugs
DisplaySchema.path('title').set(function (value) {
  this.slug = value.toLowerCase().replace(/-+/g, '').replace(/\s+/g, '-').replace(/[^a-z0-9\-]/g, '');
  return value;
});

module.exports = DisplaySchema;
