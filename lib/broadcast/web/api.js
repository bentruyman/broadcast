var Q = require('q');

// configure and create a database client
var config = require('../../../config/base'),
    nano   = require('nano')(config.database.url),
    db = nano.use(config.database.name);

var CouchResource = require('./api/couch-resource');

// import each of the domain objects
var Channel    = require('../domain/channel'),
    ChannelSet = require('../domain/channel-set'),
    Display    = require('../domain/display');

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
var api = {
  channel:    new CouchResource('channel',     Channel,    db),
  channelSet: new CouchResource('channelSet',  ChannelSet, db),
  display:    new CouchResource('display',     Display,    db)
};

module.exports = api;
