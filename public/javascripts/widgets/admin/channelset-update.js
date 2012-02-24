define(function () {
  return {
    creator: function (sandbox) {
      // services
      var $        = sandbox.getService('query'),
          API      = sandbox.getService('api'),
          template = sandbox.getService('template'),
          utils    = sandbox.getService('utils');
      
      // locals
      var id = '#' + sandbox.getOption('id'),
          channelSetId = sandbox.getOption('channelSetId'),
          addChannelButton;
      
      // given a collection of channels, return one by a specified ID
      function findChannelById(channels, id) {
        for (var i = 0, j = channels.length; i < j; i++) {
          if (channels[i]._id === id) {
            return channels[i];
          }
        }
        
        return null;
      }
      
      return {
        create: function () {
          API.channelSets.readOne(channelSetId).then(function (channelSet) {
            API.channels.read().then(function (channels) {
              var data = {
                action: '/api/channelSets',
                method: 'PUT',
                channelSet: channelSet,
                channels: channels
              };
              
              // inject form template
              template.apply('admin.channel-sets.form', data).then(function (content) {
                $(id).append(content);
                
                var addChannelButton = $('#channel-set-add-channel', id).get(0);
                
                // populate existing channels
                $(channelSet.configuredChannels).each(function () {
                  template.apply('admin.channel-sets.form.channel', {
                    id: this.channel,
                    timeout: this.timeout,
                    channels: channels
                  }).then(function (content) {
                    $('tbody', id).append(content);
                  });
                });
                
                // make channel rows sortable via drag & drop
                $('tbody', id).sortable({
                  helper: function(e, ui) {
                    ui.children().each(function() {
                      $(this).width($(this).width());
                    });
                    return ui;
                  }
                }).disableSelection();
                
                // handle channel additions
                $(addChannelButton).click(function (event) {
                  // if there are no channels, throw up an alert
                  if (channels.length === 0) {
                    alert('No channels are available.');
                  }
                  // otherwise, render a new channel row
                  else {
                    template.apply('admin.channel-sets.form.channel', {
                      channels: channels
                    }).then(function (content) {
                      $('tbody', id).append(content);
                    });
                  }
                });
                
                // handle channel removals
                $(id).delegate('.remove', 'click', function (event) {
                  $(this).parent().parent().remove();
                });
                
                // handle form submissions
                $('form', id).submit(function (event) {
                  event.preventDefault();
                  
                  var params = utils.serializeForm(this),
                      channelSet = {
                        _id: params.id,
                        _rev: params.rev,
                        name: params.name,
                        configuredChannels: []
                      };
                  
                  if (params.configuredChannels) {
                    channelSet.configuredChannels = utils.formatChannelSetChannels(params.configuredChannels, params.timeouts);
                  }
                  
                  API.channelSets.update(channelSet)
                    .done(function () {
                      // created channel successfully, redirect to channel listing
                      sandbox.app.publish('/redirect', '/admin/channel-sets/');
                    })
                    .fail(function (response) {
                      // TODO: handle error
                      var error = JSON.parse(response.responseText);
                      console.error(error);
                    });
                });
                
                // handle channel changes
                $(id).delegate('.channel select', 'change', function (event) {
                  var id = $(this).val(),
                      channel = findChannelById(channels, id);
                  
                  // when a channel is changed in a dropdown, update the timeout to
                  // the channel's default timeout
                  $(this).parent().parent().find('.timeout input').val(channel.timeout);
                });
              });
            });
          });
        },
        destroy: function () {
          $(id).undelegate();
          $('form', id).unbind();
          $(addChannelButton).unbind();
        }
      };
    }
  };
});
