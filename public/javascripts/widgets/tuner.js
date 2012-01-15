(function (Weld, App) {
  var Tuner = new Weld.Widget('tuner', function (sandbox) {
    // service references
    var API = sandbox.getService('api'),
        $   = sandbox.getService('query');
    
    // dom references
    var container = document.getElementById(sandbox.getOption('id'));
    
    // tuner state
    var 
      // reference to the current channel set object
      channelSet,
      // a collection of channel modules for the current channel set
      channelModules = [],
      // reference to the current channels module ID
      currentChannel = null,
      // the currently viewed channel's index
      currentChannelIndex = null,
      // reference to the current channel's timeout
      timeout = null;
    
    // retreives a channel set by slug using the API
    function getChannelSet() {
      var deferred = $.Deferred();
      
      // load channel set by slug
      API.channelSets.read({ slug: sandbox.getOption('slug') })
        .done(function (resp) {
          if (resp.channelSets && resp.channelSets.length === 1) {
            deferred.resolve(resp.channelSets[0]);
          } else {
            // TODO: handle error
            deferred.reject();
          }
        })
        .fail(function () {
          // TODO: handle error
          deferred.reject();
        });
      
      return deferred.promise();
    }
    
    // reloads the channel set and starts from the first channel
    function refresh() {
      getChannelSet().then(function (set) {
        // store the current channel set
        channelSet = set;
        
        // go to the first channel
        goToChannel(0);
      });
    }
    
    // creates a new channel
    function createChannel(channel) {
      var id = App.create('tuner-channel', {
        host: container,
        index: channel.ref.index,
        title: channel.ref.title,
        type:  channel.ref.type,
        url:   channel.ref.url
      });
      
      App.start(id);
      
      return id;
    }
    
    // destroys an existing channel
    function destroyChannel(id) {
      App.stop(id);
    }
    
    // stops any existing channel, starts a new one
    function goToChannel(index) {
      var channel;
      
      // if a channel is already running, stop it
      if (currentChannelIndex !== null) {
        destroyChannel(currentChannel);
        window.clearTimeout(timeout);
      }
      
      currentChannelIndex = index;
      channel = channelSet.channels[index];
      
      currentChannel = createChannel(channel);
      window.setTimeout(nextChannel, channel.timeout);
    }
    
    // navigates to the previous channel
    function previousChannel() {
      goToChannel(
        currentChannelIndex - 1 < 0 ? channelSet.channels.length : currentChannelIndex - 1
      );
    }
    
    // navigates to the next channel
    function nextChannel() {
      goToChannel(
        currentChannelIndex + 1 === channelSet.channels.length ? 0 : currentChannelIndex + 1
      );
    }
    
    return {
      create: function () {
        // listen for tuner refresh messages
        App.subscribe('/tuner/refresh', refresh);
        
        // listen for channel messages
        App.subscribe('/tuner/previous-channel', previousChannel);
        App.subscribe('/tuner/next-channel', nextChannel);
        
        // trigger initial refresh
        App.publish('/tuner/refresh');
      },
      destroy: function () {
        $(container).empty();
      }
    };
  });
  
  App.register(Tuner);
}(this.Weld, this.Broadcast.App));
