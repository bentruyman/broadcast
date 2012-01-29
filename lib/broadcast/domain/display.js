var mongoose = require('../../../node_modules/mongoose'),
    ConfiguredChannelSetSchema = require('./configured-channel-set'),
    Schema   = mongoose.Schema;

var DAYS_IN_WEEK = 7;

var Display = new Schema({
  // name of the display
  title: { type: String, required: true },
  channelSets: [ConfiguredChannelSetSchema]
});

// ensure a channel set doesn't have the same start time as another
Display.path('channelSets').validate(function (value, next) {
  var isValid = true;
  
  for (var i = 0, j = this.channelSets.length; i < j; i++) {
    if (this.channelSets[i].startTime === value.startTime) {
      isValid = false;
      break;
    }
  }
  
  next(isValid);
});

Display.methods.removeAllChannelSets = function (callback) {
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

Display.methods.updateChannelSets = function (sets, callback) {
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

module.exports = Display;
