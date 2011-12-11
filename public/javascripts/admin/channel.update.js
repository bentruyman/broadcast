(function (App, Widgets, Widget) {
  App.register(new Widget('channel-update-form', function (sandbox) {
    // services
    var $        = sandbox.getService('query'),
        API      = sandbox.getService('api'),
        template = sandbox.getService('template'),
        utils    = sandbox.getService('utils');
    
    // locals
    var id = '#' + sandbox.getOption('id');
    
    return {
      create: function () {
        API.channels.read({ id: sandbox.getOption('channelId') })
          .done(function (response) {
            var data = {
              action: '/api/channels',
              method: 'PUT',
              channel: response.channel
            };
            
            // inject form template
            $(id).append(template.apply('channels-form', data));
            
            // handle form submissions
            $('form', id).submit(function (event) {
              event.preventDefault();
              
              var params = utils.serializeForm(this),
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
                  App.publish('/redirect', '/admin/channels/');
                })
                .fail(function (response) {
                  // TODO: handle error
                  var error = JSON.parse(response.responseText);
                  console.error(error);
                });
            });
          })
          .fail(function () {
            // TODO: handle error
          });
      },
      destroy: function () {
        $(id).remove();
        $('form', id).unbind();
      }
    };
  }));
}(this.Broadcast.App, this.Broadcast.Widgets, this.Weld.Widget));