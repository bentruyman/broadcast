define(function () {
  return {
    creator: function (sandbox) {
      // services
      var $        = sandbox.getService('query'),
          API      = sandbox.getService('api'),
          template = sandbox.getService('template'),
          utils    = sandbox.getService('utils');
      
      // constants
      var MS = {
        inDay: 86400000,
        inHour: 3600000,
        inMinute: 60000
      };
      
      // locals
      var id = '#' + sandbox.getOption('id'),
          addChannelSetButton;
      
      // given a collection of channel sets, return one by a specified ID
      function findChannelSetById(channelSets, id) {
        for (var i = 0, j = channels.length; i < j; i++) {
          if (channelSets[i]._id === id) {
            return channelSets[i];
          }
        }
        
        return null;
      }
      
      return {
        create: function () {
          API.channelSets.read().then(function (response) {
            var channelSets = response.channelSets,
                data = {
                  action: '/api/displays',
                  method: 'POST'
                };
            
            // inject form template
            template.apply('admin.displays.form', data).then(function (content) {
              $(id).append(content);
              
              addChannelSetButton = $('#display-add-channel-set', id).get(0);
              
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
              $(addChannelSetButton).click(function (event) {
                template.apply('admin.displays.form.channel-set', {
                  channelSets: channelSets
                }).then(function (content) {
                  $('tbody', id).append(content);
                });
              });
              
              // handle channel removals
              $(id).delegate('.remove', 'click', function (event) {
                $(this).parent().parent().remove();
              });
              
              // handle form submissions
              $('form', id).submit(function (event) {
                event.preventDefault();
                
                var params = utils.serializeForm(this),
                    display = {
                      title: params.title,
                      channelSets: []
                    };
                
                if (params.channelSets) {
                  display.channelSets = utils.formatDisplayChannelSets(
                    params.channelSets,
                    params.days,
                    params.hours,
                    params.minutes
                  );
                }
                
                API.displays.create(display)
                  .done(function () {
                    // created display successfully, redirect to display listing
                    sandbox.app.publish('/redirect', '/admin/displays/');
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
          $(id).remove();
          $(id).undelegate();
          $('form', id).unbind();
          $(addChannelSetButton).unbind();
        }
      };
    }
  };
});
