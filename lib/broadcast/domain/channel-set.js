var ConfiguredChannelSchema = require('./configured-channel'),
    Schema = require('../../../node_modules/mongoose').Schema,
    Q = require('../../../node_modules/qq');

var ChannelSetSchema = new Schema({
  // name of the channel set
  label: { type: String, required: true },
  // slug to be used in url to point to this channel set
  slug: { type: String, unique: true },
  // list of configured channels
  channels: [ConfiguredChannelSchema]
});

ChannelSetSchema.methods.removeAllChannels = function (callback) {
  var self = this;
  
  // FIXME: temporary workardound, mongoose has a bug where multiple embedded
  //        documents can't be removed in one save
  if (this.channels.length > 0) {
    this.channels[0].remove();
    this.save(function (err) {
      self.removeAllChannels(callback);
    });
  } else {
    callback.call(null);
  }
};

ChannelSetSchema.methods.updateChannels = function (channels, callback) {
  var self = this;
  
  this.removeAllChannels(function () {
    // add new configured channels
    for (var i = 0, j = channels.length; i < j; i++) {
      self.channels.push(channels[i]);
    }
    
    self.save(callback);
  });
};

module.exports = ChannelSetSchema;
