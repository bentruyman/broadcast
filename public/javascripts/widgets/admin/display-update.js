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
          displayId = sandbox.getOption('displayId'),
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
          API.displays.readOne(displayId).then(function (display) {
            API.channelSets.read().then(function (channelSets) {
              var data = {
                    action: '/api/displays',
                    method: 'PUT',
                    display: display,
                    channelSets: channelSets
                  };
              
              // inject form template
              template.apply('admin.displays.form', data).then(function (content) {
                $(id).append(content);
                
                var addChannelSetButton = $('#display-add-channel-set', id).get(0);
                
                // populate existing channels
                $(display.configuredChannelSets).each(function () {
                  // transform the start time into a human-readible format
                  var day    = Math.floor(this.startTime / MS.inDay),
                      hour   = Math.floor((this.startTime - day * MS.inDay) / MS.inHour),
                      minute = Math.floor((this.startTime - day * MS.inDay - hour * MS.inHour) / MS.inMinute);
                  
                  template.apply('admin.displays.form.channel-set', {
                    id: this.channelSet,
                    dayIndex: day,
                    hourIndex: hour,
                    minuteIndex: minute,
                    channelSets: channelSets
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
                
                // handle channel set additions
                $(addChannelSetButton).click(function (event) {
                  template.apply('admin.displays.form.channel-set', {
                    channelSets: channelSets
                  }).then(function (content) {
                    $('tbody', id).append(content);
                  });
                });
                
                // handle channel set removals
                $(id).delegate('.remove', 'click', function (event) {
                  $(this).parent().parent().remove();
                });
                
                // handle form submissions
                $('form', id).submit(function (event) {
                  event.preventDefault();
                  
                  var params = utils.serializeForm(this),
                      display = {
                        _id: params.id,
                        _rev: params.rev,
                        name: params.name,
                        configuredChannelSets: []
                      };
                  
                  if (params.configuredChannelSets) {
                    display.configuredChannelSets = utils.formatDisplayChannelSets(
                      params.configuredChannelSets,
                      params.days,
                      params.hours,
                      params.minutes
                    );
                  }
                  
                  API.displays.update(display)
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
              });
            });
          });
        },
        destroy: function () {
          $(id).undelegate();
          $('form', id).unbind();
          $(addChannelSetButton).unbind();
        }
      };
    }
  };
});
