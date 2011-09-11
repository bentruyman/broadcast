var Schema = require('../../../node_modules/mongoose').Schema;

var Channel = new Schema({
  index: { type: Number, unique: true }, // the channel's number
  label: String, // name of the channel
  url: String, // url of the channel's asset
  type: String, // image, video, page (defaults to page)
  timeout: { type: Number, 'default': 30 * 1000 } // the amount of time a channel should stay on screen (default, 30 seconds)
});

module.exports = Channel;
