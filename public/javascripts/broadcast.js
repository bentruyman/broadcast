// TODO: consider using an ES5 shim
(function () {
  // application namespace
  var Broadcast = this.Broadcast = {};
  
  Broadcast.init = function () {
    Broadcast.Tuner.init();
  };
  
  Broadcast.getChannelSet = function () {
    // loads the JSON document of this page's channel set
    // transforms the url from "/channel-set/foo-bar" to "/channel-set/foo-bar.json"
    return $.ajax(window.location.toString().split('?')[0] + '.json');
  };
  
  Broadcast.Tuner = (function () {
    var channelSet = null, // copy of the page's current channel set
        container = null, // main container where channels are inserted
        currentChannelIndex = null, // index of the currently showing channel
        timeout = null; // reference to the id of the current timeout
    
    // map of functions used to create channel elements
    var creators = {
      page: function (channel, next) {
        var element = $('<iframe></iframe>')
          .attr('src', channel.ref.url)
          .height('100%')
          .width('100%');
        
        next(element);
      },
      image: function (channel, next) {
        // preload the image to get it's dimensions to determine how it
        // should be sized
        Broadcast.utils.preloadImages(channel.ref.url).then(function (image) {
          if (image.height > image.width) {
            $(image).height('100%');
          } else {
            $(image).width('100%');
          }
          
          next(image);
        });
      },
      video: function (channel, next) {
        var element = $('<video></video>')
          .attr('src', channel.ref.url)
          .prop('autoplay', true)
          .height('100%')
          .width('100%');
        
        next(element);
      }
    };
    
    function createNewChannel(channel) {
      var type = channel.ref.type;
      
      creators[type](channel, function (element) {
        $(container).append(element);
      });
    }
    
    function destroyCurrentChannel() {
      $(container).empty();
    }
    
    var Tuner = {
      init: function () {
        container = $('#channel').get(0);
        Tuner.refresh();
      },
      refresh: function () {
        Broadcast.getChannelSet().then(function (data) {
          channelSet = data;
          Tuner.nextChannel();
        });
      },
      // TODO: handle out of bounds error
      goTo: function (index) {
        if (currentChannelIndex !== null) {
          destroyCurrentChannel();
        }
        
        // update the current channel index
        currentChannelIndex = index;
        
        // create the next channel
        var nextChannel = channelSet.channels[currentChannelIndex];
        createNewChannel(nextChannel);
        
        // clear any past timeout
        if (timeout !== null) {
          window.clearTimeout(timeout);
        }
        
        // set new timeout
        timeout = window.setTimeout(function () {
          Tuner.nextChannel();
        }, nextChannel.timeout);
      },
      nextChannel: function () {
        var nextIndex = null;
        
        // if there's no current channel or the current channel is the last, set
        // the next channel to be the first one in the list
        if (currentChannelIndex === null || currentChannelIndex + 1 >= channelSet.channels.length) {
          nextIndex = 0;
        } else {
          nextIndex = currentChannelIndex + 1;
        }
        
        Tuner.goTo(nextIndex);
      },
      prevChannel: function () {
        var nextIndex = null;
        
        // if there's no current channel or the current channel is at 0, set the
        // next channel to be the last one in the list
        if (currentChannelIndex === null || currentChannelIndex === 0) {
          currentChannelIndex = channelSet.channels.length - 1;
        } else {
          nextIndex = currentChannelIndex - 1;
        }
        
        Tuner.goTo(nextIndex);
      }
    };
    
    return Tuner;
  }());
  
  Broadcast.utils = {
    preloadImages: function (imagePaths) {
      var promises = [];
      
      if ($.type(imagePaths) === 'string') {
        imagePaths = [imagePaths];
      }
      
      if (imagePaths.length) {
        imagePaths.forEach(function (path) {
          var deferred = $.Deferred();
          
          // create a new image object
          var image = new Image();
          image.onload = function () {
            // if the image loads correctly, resolve this deferred
            deferred.resolve(image);
          };
          image.onerror = function () {
            // if the image loads incorrectly, reject this deferred
            deferred.reject(image);
          };
          image.src = path;
          
          promises.push(deferred.promise());
        });
        
        return $.when.apply($, promises);
      } else {
        var deferred = $.Deferred();
        deferred.resolve();
        return deferred.promise();
      }
    }
  };
  
  // initialize on document ready
  $(Broadcast.init);
}());
