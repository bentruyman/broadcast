var mongoose  = require('../../../node_modules/mongoose'),
    responses = require('./responses');

// The API is responsible for creating, reading, updating, and deleting data.
// It's also responsible for returning responses in a uniform manner.
module.exports = function () {
  var Channel           = mongoose.model('Channel');
  var ChannelSet        = mongoose.model('ChannelSet');
  var ConfiguredChannel = mongoose.model('ConfiguredChannel');
  
  function ErrorResponse(options) {
    options = options || {};
    options.code = options.code || '100';
    
    var response = responses[options.code];
    
    var error = {
      error: options.code,
      type: response.type,
      message: response.message,
      data: options.data || {}
    };
    
    console.log(error);
    
    return error;
  }
  
  return {
    channel: {
      create: function (data, callback) {
        var response = null;
        
        Channel.create(data, function (err, channel) {
          if (err) {
            if (err.name && err.name === 'ValidationError') {
              response = new ErrorResponse({ code: '103', data: err.errors });
            } else { // unknown error
              response = new ErrorResponse({ data: err });
            }
          } else { // created successfully
            response = { channel: channel };
          }
          
          callback.call(null, response);
        });
      },
      read: function (id, callback) {
        var response = null;
        
        if (arguments.length === 1) { // if no ID is specified, find all channels
          callback = id;
          
          // fetch channels sorted by their index in ascending order
          Channel.find().sort('index', 1).run(function (err, channels) {
            if (err) {
              response = new ErrorResponse({ data: err });
            } else {
              response = { channels: channels };
            }
            
            callback.call(null, response);
          });
        } else { // ID is specified, find it by ID
          Channel.findById(id, function (err, channel) {
            if (err && err.message === 'Invalid ObjectId') { // if the channel doesn't exist
              response = new ErrorResponse({ code: '101' });
            } else if (err) { // unknown error
              response = new ErrorResponse({ data: err });
            } else { // found channel
              response = { channel: channel };
            }
            
            callback.call(null, response);
          });
        }
      },
      update: function (data, callback) {
        var response = null;
        
        if (typeof data.id === 'undefined') { // if no ID is given
          callback.call(null, new ErrorResponse({ code: '102' }));
        } else {
          Channel.update({ _id: data.id }, data, function (err) {
            if (err) { // unknown error
              response = new ErrorResponse({ data: err });
            } else { // updated successfully
              response = { success: true };
            }
            
            callback.call(null, response);
          });
        }
      },
      delete: function (id, callback) {
        var response = null;
        
        if (typeof id === 'undefined') { // if no ID is given
          callback.call(null, new ErrorResponse({ code: '102' }));
        } else {
          Channel.findOne({ _id: id }, function (err, channel) {
            if (err && err.message === 'Invalid ObjectId') { // if the channel doesn't exist
              response = new ErrorResponse({ code: '101' });
            } else if (err) { // unknown error
              response = new ErrorResponse({ data: err });
            } else { // all is good
              return channel.remove(function () {
                callback.call(null, { success: true });
              });
            }
            
            callback.call(null, response);
          });
        }
      }
    },
    channelSet: {
      create: function (data, callback) {
        var response = null;
        
        ChannelSet.create(data, function (err, set) {
          if (err && err.name === 'ValidationError') { // validation error
            response = new ErrorResponse({ code: 103, data: err.errors });
          } else if (err) { // unknown error
            response = new ErrorResponse({ data: err });
          } else { // creation successful
            response = { channelSet: set };
          }
          
          callback.call(null, response);
        });
      },
      read: function (condition, callback) {
        var response = null;
        
        if (arguments.length === 1) { // if no condition is specified, find all channels
          callback = condition;
          
          // fetch channels sorted by their index in ascending order
          ChannelSet.find().populate('channels.ref').run(function (err, sets) {
            if (err) {
              response = new ErrorResponse({ data: err });
            } else {
              response = { channelSets: sets };
            }
            
            callback.call(null, response);
          });
        } else { // condition is specified, find it by the condition
          ChannelSet.findOne(condition).populate('channels.ref').run(function (err, set) {
            if (err && err.message === 'Invalid ObjectId') { // if the channel set doesn't exist
              response = new ErrorResponse({ code: '101' });
            } else if (err) { // unknown error
              response = new ErrorResponse({ data: err });
            } else { // found channel set
              
              response = { channelSet: set };
            }
            
            callback.call(null, response);
          });
        }
      },
      update: function (data, callback) {
        var response = null;
        
        if (typeof data.id === 'undefined') { // if no ID is given
          callback.call(null, new ErrorResponse({ code: '102' }));
        } else {
          ChannelSet.findById(data.id, function (err, set) {
            set.title = data.title;
            
            if (err && err.message === 'Invalid ObjectId') { // if the channel doesn't exist
              return callback.call(new ErrorResponse({ code: '101' }));
            } else if (err) { // unknown error
              return callback.call(new ErrorResponse({ data: err }));
            }
            
            set.updateChannels(data.channels, function (err, updatedSet) {
              if (err) {
                response = new ErrorResponse({ data: err });
              } else {
                response = { channelSet: updatedSet };
              }
              
              callback.call(null, response);
            });
          });
        }
      },
      delete: function (id, callback) {
        var response = null;
        
        if (typeof id === 'undefined') { // if no ID is given
          callback.call(null, new ErrorResponse({ code: '102' }));
        } else {
          ChannelSet.findOne({ _id: id }, function (err, set) {
            if (err && err.message === 'Invalid ObjectId') { // if the channel set doesn't exist
              response = new ErrorResponse({ code: '101' });
            } else if (err) { // unknown error
              response = new ErrorResponse({ data: err });
            } else { // all is good
              return set.remove(function () {
                callback.call(null, { success: true });
              });
            }
            
            callback.call(null, response);
          });
        }
      }
    }
  };
};