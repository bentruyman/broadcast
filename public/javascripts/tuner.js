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
      channelSet = null,
      // a collection of channel modules for the current channel set
      channelModules = [],
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
    
    // stops any existing channel, starts a new one
    function goToChannel(index) {
      var channel;
      
      if (channelSet !== null) {
        
      }
    }
    
    // navigates to the previous channel
    function previousChannel() {
      
    }
    
    // navigates to the next channel
    function nextChannel() {
      
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
  
  var Channel = new Weld.Widget('tuner-channel', function (sandbox) {
    return {
      create: function () {
        
      },
      destroy: function () {
        
      }
    };
  });
  
  App.register(Channel);
  App.register(Tuner);
}(this.Weld, this.Broadcast.App));
