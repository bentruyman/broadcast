define(function () {
  return {
    options: {
      services: ['messenger']
    },
    creator: function (sandbox) {
      // service references
      var API       = sandbox.getService('api'),
          $         = sandbox.getService('query'),
          messenger = sandbox.getService('messenger');
      
      // constants
      var MS = {
        inDay: 86400000,
        inHour: 3600000,
        inMinute: 60000
      };
      
      // dom references
      var container = document.getElementById(sandbox.getOption('id'));
      
      // tuner state
      var
        // reference to the current channel set object
        currentChannelSet,
        // a collection of channel modules for the current channel set
        channelModules = [],
        // reference to the current channels module ID
        currentChannel = null,
        // the currently viewed channel's index
        currentChannelIndex = null,
        // reference to the current display object
        display,
        // reference to the current display's slug
        displaySlug = sandbox.getOption('slug'),
        // serverside messenger subscriptions
        subscriptions = [],
        // reference to the current channel's timeout
        timeout = null;
      
      // determine's the current time in milliseconds using the start of the
      // week as a starting point
      function getStartOfWeekTime(date) {
        // set the date object's date to Sunday
        date.setDate(-date.getDay() + 1);
        
        // set hours, minutes, and seconds to zero
        date.setHours(0);
        date.setMinutes(0);
        date.setSeconds(0);
        
        // return the date in milliseconds
        return date.getTime();
      }
      
      // retreives a display by slug using the API
      function getDisplayBySlug(slug) {
        var deferred = $.Deferred();
        
        // load channel set by slug
        API.displays.read({ slug: slug })
          .done(function (displays) {
            if (displays && displays.length === 1) {
              deferred.resolve(displays[0]);
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
      
      // determines the current channel set that should be present based on
      // start time based on a display
      function getDisplaysCurrentChannelSetId(display) {
        var deferred = $.Deferred(),
            startOfWeek = getStartOfWeekTime(new Date),
            currentTime = (new Date).getTime(),
            timeDifference = currentTime - startOfWeek,
            configuredChannelSets = display.configuredChannelSets,
            channelSetId;
        
        // loop through all channel sets to find the current one
        for (var i = 0, j = configuredChannelSets.length; i < j; i++) {
          if (configuredChannelSets[i].startTime < timeDifference) {
            channelSetId = configuredChannelSets[i].channelSet;
          } else {
            break;
          }
        }
        
        API.channelSets.readOne(channelSetId).then(function (channelSet) {
          deferred.resolve(channelSet);
        });
        
        return deferred.promise();
      }
      
      // retreives a channel set by slug using the API
      function getChannelSetById(id) {
        var deferred = $.Deferred();
        
        // load channel set by slug
        API.channelSets.read({ id: id })
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
      
      // reloads the current channel set and starts from the first channel
      function refresh() {
        // clear any serverside messenger subscriptions
        cancelSubscriptions();
        
        // starts the display
        getDisplayBySlug(displaySlug).then(function (display) {
          // store the current channel set
          getDisplaysCurrentChannelSetId(display).then(function (channelSet) {
            currentChannelSet = channelSet;
            // subscribe to update messages on the serverside to know when to
            // refresh the display again when data changes
            // createSubscription('/displays/' + display._id + '/update', refresh);
            // createSubscription('/channelSets/' + channelSet._id + '/update', refresh);
            
            // go to the first channel
            goToChannel(0);
          });
        });
      }
      
      // creates a new channel
      function createChannel(channelId) {
        var deferred = $.Deferred();
        
        // FIXME: This shouldn't be necessary
        API.channels.readOne(channelId).then(function (channel) {
          var id = sandbox.app.create('tuner/channel', {
                host: container,
                title: channel.name,
                assetType: channel.assetType,
                url:   channel.url
              });
          
          sandbox.app.start(id);
          
          deferred.resolve(id);
        });
        
        return deferred.promise();
      }
      
      // destroys an existing channel
      function destroyChannel(id) {
        sandbox.app.stop(id);
      }
      
      // stops any existing channel, starts a new one
      function goToChannel(index) {
        var configuredChannel;
        
        // if a channel is already running, stop it
        if (currentChannelIndex !== null) {
          destroyChannel(currentChannel);
          window.clearTimeout(timeout);
        }
        
        currentChannelIndex = index;
        configuredChannel = currentChannelSet.configuredChannels[index];
        
        // FIXME
        createChannel(configuredChannel.channel).then(function (id) {
          currentChannel = id;
          timeout = window.setTimeout(nextChannel, configuredChannel.timeout);
        });
      }
      
      // navigates to the previous channel
      function previousChannel() {
        goToChannel(
          currentChannelIndex - 1 < 0 ? currentChannelSet.configuredChannels.length : currentChannelIndex - 1
        );
      }
      
      // navigates to the next channel
      function nextChannel() {
        goToChannel(
          currentChannelIndex + 1 === currentChannelSet.configuredChannels.length ? 0 : currentChannelIndex + 1
        );
      }
      
      // creates a subscription to the serverside messenger
      function createSubscription(channel, callback) {
        subscriptions.push(messenger.subscribe(channel, callback));
      }
      
      // cancels all subscriptions
      function cancelSubscriptions() {
        subscriptions.forEach(function (sub) {
          sub.cancel();
        });
      }
      
      return {
        create: function () {
          // listen for tuner refresh messages
          sandbox.app.subscribe('/tuner/refresh', refresh);
          
          // listen for channel messages
          sandbox.app.subscribe('/tuner/previous-channel', previousChannel);
          sandbox.app.subscribe('/tuner/next-channel', nextChannel);
          
          // trigger initial refresh
          sandbox.app.publish('/tuner/refresh');
        },
        destroy: function () {
          $(container).empty();
        }
      };
    }
  };
});
