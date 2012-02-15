// import database
var db = require('../services/db'),
    client;

// initialize the database and store a reference to its client
db.init();
client = db.client;

// import each of the domain objects
// var Channel              = require('../domain/channel'),
//     ChannelSet           = require('../domain/channel-set'),
//     ConfiguredChannel    = require('../domain/configured-channel'),
//     ConfiguredChannelSet = require('../domain/configured-channel-set'),
//     Display              = require('../domain/display');

function ErrorResponse(options) {
  options = options || {};
  options.code = options.code || '100';
  
  var response = responses[options.code];
  
  return {
    error: options.code,
    type: response.type,
    message: response.message,
    data: options.data || {}
  };
}

// The API is responsible for creating, reading, updating, and deleting data.
// It's also responsible for returning responses in a uniform manner.
var api = module.exports = {
  channel: require('./api/channel'),
  channelSet: require('./api/channel-set'),
  display: require('./api/display')
};
