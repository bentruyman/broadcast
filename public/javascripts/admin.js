(function (Broadcast, Sammy) {
  Broadcast.Admin = {
    init: function () {
      var containerSelector = '#main';
      
      // how many items to list per page
      var ITEMS_PER_PAGE = 15;
      
      // determines if the passed in value is an instance of an array
      function isArray(val) {
        return toString.call(val) === '[object Array]';
      }
      
      Sammy(containerSelector, function (app) {
        var $main = $(containerSelector);
        
        // page renderer helper
        app.helper('renderPage', function () {
          var deferred = $.Deferred(),
              self = this;
              
          // load this current page, and inject the content of its main container
          // into the current page's main container
          $.ajax(this.path).then(function (html) {
            // update current <body> element to match the requested page's body ID
            // and classname
            var match     = html.match(/<body id="(.+?)" class="(.+?)">/),
                bodyId    = match[1],
                bodyClass = match[2];
            
            $('body').attr({ id: bodyId, 'class': bodyClass });
            
            // grab the main container
            var mainContainer = $(containerSelector, html).get(0);
            self.$element().html(mainContainer.innerHTML);
            deferred.resolve();
          });
          
          return deferred.promise();
        });
        
        // dashboard
        this.get('/admin/', function () {
          this.renderPage().then(function () {
            
          });
        });
        
        // list channels
        this.get('/admin/channels/', function (app) {
          this.renderPage().then(function () {
            // load all channels
            API.channels.read().then(function (data) {
              // determine current, next, and previous page indexes
              var pagination = Broadcast.utils.calculatePagination(
                data.channels.length, // number of items
                ITEMS_PER_PAGE, // items per page
                parseInt(app.params.page, 10) || 1 // current page
              );
              data.currentPage = pagination.currentPage;
              data.totalPages  = pagination.totalPages;
              data.prevPage    = pagination.prevPage;
              data.nextPage    = pagination.nextPage;
              
              // slice out current page's channels
              var startOfItems = (data.currentPage - 1) * ITEMS_PER_PAGE,
                  endOfItems   = startOfItems + ITEMS_PER_PAGE;
              
              data.channels = data.channels.slice(startOfItems, endOfItems);
              
              // inject channels data into channels template
              $('#channels').append(
                Broadcast.Templates.apply('channels', data)
              );
            });
          });
        });
        
        // create channels
        this.get('/admin/channels/create', function (app) {
          this.renderPage().then(function () {
            var data = {
              action: '/api/channels',
              method: 'POST'
            };
            
            // inject form template
            $('#channel-form').append(
              Broadcast.Templates.apply('channels-form', data)
            );
          });
        });
        this.post('/api/channels', function (app) {
          var params = app.params,
              channel = {
                index: params.index,
                title: params.title,
                url: params.url,
                type: params.type,
                timeout: params.timeout
              };
          
          API.channels.create(channel)
            .done(function () {
              // created channel successfully, redirect to channel listing
              app.redirect('/admin/channels/');
            })
            .fail(function (response) {
              // TODO: handle error
              var error = JSON.parse(response.responseText);
              console.error(error);
            });
        });
        
        // update channels
        this.get('/admin/channels/update/:id', function (app) {
          this.renderPage().then(function () {
            API.channels.read(app.params.id)
              .done(function (response) {
                var data = {
                  action: '/api/channels',
                  method: 'PUT',
                  channel: response.channel
                };
                
                // inject form template
                $('#channel-form').append(
                  Broadcast.Templates.apply('channels-form', data)
                );
              })
              .fail(function () {
                // TODO: handle error
              });
          });
        });
        this.put('/api/channels', function (app) {
          var params = app.params,
              channel = {
                id: params.id,
                index: params.index,
                title: params.title,
                url: params.url,
                type: params.type,
                timeout: params.timeout
              };
          
          API.channels.update(channel)
            .done(function () {
              // created channel successfully, redirect to channel listing
              app.redirect('/admin/channels/');
            })
            .fail(function (response) {
              // TODO: handle error
              var error = JSON.parse(response.responseText);
              console.error(error);
            });
        });
        
        // delete channels
        this.get('/admin/channels/delete/:id', function (app) {
          API.channels.delete(app.params.id)
            .done(function () {
              // deleted the channel successfully, redirect to channel listing
              app.redirect('/admin/channels/');
            })
            .fail(function () {
              // TODO: handle failure
            });
        });
        
        // list channel sets
        this.get('/admin/channel-sets/', function (app) {
          this.renderPage().then(function () {
            API.channelSets.read().then(function (data) {
              // determine current, next, and previous page indexes
              var pagination = Broadcast.utils.calculatePagination(
                data.channelSets.length, // number of items
                ITEMS_PER_PAGE, // items per page
                parseInt(app.params.page, 10) || 1 // current page
              );
              data.currentPage = pagination.currentPage;
              data.totalPages  = pagination.totalPages;
              data.prevPage    = pagination.prevPage;
              data.nextPage    = pagination.nextPage;
              
              // slice out current page's channel sets
              var startOfItems = (data.currentPage - 1) * ITEMS_PER_PAGE,
                  endOfItems   = startOfItems + ITEMS_PER_PAGE;
              
              data.channelSets = data.channelSets.slice(startOfItems, endOfItems);
              
              // inject channels data into channels template
              $('#channel-sets').append(
                Broadcast.Templates.apply('channel-sets', data)
              );
            });
          });
        });
        
        // create channel sets
        this.get('/admin/channel-sets/create', function (app) {
          this.renderPage().then(function () {
            API.channels.read().then(function (response) {
              var data = {
                action: '/api/channelSets',
                method: 'POST'
              };
              
              // inject form template
              $('#channel-set-form').append(
                Broadcast.Templates.apply('channel-sets-form', data)
              );
              
              // append an empty add channel row
              $('#channel-set-add-channel').click(function (event) {
                $('#channel-set-channels tbody').append(
                  Broadcast.Templates.apply('channel-sets-form-channel', {
                    channels: response.channels
                  })
                );
              });
              
              // handle channel removals
              $('#channel-set-channels').delegate('.remove', 'click', function (event) {
                $(this).parent().parent().remove();
              });
            });
          });
        });
        this.post('/api/channelSets', function (app) {
          var params = app.params,
              channelSet = {
                title: params.title,
                channels: formatChannelSetChannels(params.channels, params.timeouts)
              };
          
          API.channelSets.create(channelSet)
            .done(function () {
              // created channel successfully, redirect to channel listing
              app.redirect('/admin/channel-sets/');
            })
            .fail(function (response) {
              // TODO: handle error
              var error = JSON.parse(response.responseText);
              console.error(error);
            });
        });
        
        // update channel sets
        this.get('/admin/channel-sets/update/:id', function (app) {
          this.renderPage().then(function () {
            API.channelSets.read(app.params.id).then(function (setResponse) {
              API.channels.read().then(function (channelResponse) {
                var data = {
                  action: '/api/channelSets',
                  method: 'PUT',
                  channelSet: setResponse.channelSet
                };
                
                // inject form template
                $('#channel-set-form').append(
                  Broadcast.Templates.apply('channel-sets-form', data)
                );
                
                // populate existing channels
                $(setResponse.channelSet.channels).each(function () {
                  console.log(this);
                  $('#channel-set-channels tbody').append(
                    Broadcast.Templates.apply('channel-sets-form-channel', {
                      id: this.ref._id,
                      timeout: this.timeout,
                      channels: channelResponse.channels
                    })
                  );
                });
                
                // handle adding new channels
                $('#channel-set-add-channel').click(function (event) {
                  $('#channel-set-channels tbody').append(
                    Broadcast.Templates.apply('channel-sets-form-channel', {
                      channels: channelResponse.channels
                    })
                  );
                });
                
                // handle channel removals
                $('#channel-set-channels').delegate('.remove', 'click', function (event) {
                  $(this).parent().parent().remove();
                });
              });
            });
          });
        });
        this.put('/api/channelSets', function (app) {
          var params = app.params,
              channelSet = {
                id: params.id,
                title: params.title,
                channels: formatChannelSetChannels(params.channels, params.timeouts)
              };
          
          API.channelSets.update(channelSet)
            .done(function () {
              // created channel successfully, redirect to channel listing
              app.redirect('/admin/channel-sets/');
            })
            .fail(function (response) {
              // TODO: handle error
              var error = JSON.parse(response.responseText);
              console.error(error);
            });
        });
        
        // delete channel sets
        this.get('/admin/channel-sets/delete/:id', function (app) {
          API.channelSets.delete(app.params.id)
            .done(function () {
              // deleted the channel set successfully, redirect to channel set listing
              app.redirect('/admin/channel-sets/');
            })
            .fail(function () {
              // TODO: handle failure
            });
        });
        
        function formatChannelSetChannels(ids, timeouts) {
          var channels = [];
          
          // format channels from param data
          if (isArray(ids)) {
            // handle multiple channels
            for (var i = 0, j = ids.length; i < j; i++) {
              channels.push({
                ref: ids[i],
                timeout: timeouts[i]
              });
            }
          } else {
            // just a single channel
            channels.push({
              ref: ids,
              timeout: timeouts
            });
          }
          
          return channels;
        }
        
      }).run();
    }
  };
  
  $(Broadcast.Admin.init);
}(this.Broadcast, this.Sammy));
