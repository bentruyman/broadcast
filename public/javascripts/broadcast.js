(function () {
  // application namespace
  var Broadcast = this.Broadcast = {};
  
  Broadcast.init = function () {
    Broadcast.Tuner.init();
  };
  
  Broadcast.getChannelSet = function () {
    return $.ajax(window.location.toString().split('?')[0] + '.json');
  };
  
  Broadcast.Tuner = (function () {
    var channelSet = null,
        container = null,
        currentChannelIndex = null,
        timeout = null;
    
    function createNewChannel(channel) {
      switch (channel.channel.type) {
        case 'page':
          var $el = $('<iframe src="' + channel.channel.url + '" height="100%" width="100%"></iframe>');
          break;
      }
      
      $(container).append($el);
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
        
        if (currentChannelIndex === null || currentChannelIndex + 1 >= channelSet.channels.length) {
          nextIndex = 0;
        } else {
          nextIndex = currentChannelIndex + 1;
        }
        console.log(nextIndex);
        Tuner.goTo(nextIndex);
      },
      prevChannel: function () {
        var nextIndex = null;
        
        if (currentChannelIndex === null || currentChannelIndex - 1 < 0) {
          currentChannelIndex = channelSet.channels.length - 1;
        } else {
          nextIndex = currentChannelIndex - 1;
        }
        
        Tuner.goTo(nextIndex);
      }
    };
    
    return Tuner;
  }());
  
  // initialize on document ready
  $(Broadcast.init);
}());
