(function (App, Widgets, Widget) {
  App.register(new Widget('channelset-update-form', function (sandbox) {
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
        API.channelSets.read({ id: channelSetId }).then(function (setResponse) {
          API.channels.read().then(function (channelResponse) {
            var channels = channelResponse.channels,
                data = {
                  action: '/api/channelSets',
                  method: 'PUT',
                  channelSet: setResponse.channelSet
                };
            
            // inject form template
            $(id).append(template.apply('channel-sets-form', data));
            addChannelButton = $('#channel-set-add-channel', id).get(0);
            
            // populate existing channels
            $(setResponse.channelSet.channels).each(function () {
              $('tbody', id).append(
                template.apply('channel-sets-form-channel', {
                  id: this.ref._id,
                  timeout: this.timeout,
                  channels: channels
                })
              );
            });
            
            // handle adding new channels
            $(addChannelButton).click(function (event) {
              $('tbody', id).append(
                template.apply('channel-sets-form-channel', {
                  channels: channelResponse.channels
                })
              );
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
                    id: params.id,
                    title: params.title,
                    channels: formatChannelSetChannels(params.channels, params.timeouts)
                  };
              
              API.channelSets.update(channelSet)
                .done(function () {
                  // created channel successfully, redirect to channel listing
                  App.publish('/redirect', '/admin/channel-sets/');
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
      },
      destroy: function () {
        $(id).undelegate();
        $('form', id).unbind();
        $(addChannelButton).unbind();
      }
    };
  }));
}(this.Broadcast.App, this.Broadcast.Widgets, this.Weld.Widget));