(function (App, Widgets, Widget) {
  App.register(new Widget('channel-create-form', function (sandbox) {
    // services
    var API      = sandbox.getService('api'),
        template = sandbox.getService('template'),
        utils    = sandbox.getService('utils');
    
    // locals
    var id = '#' + sandbox.getOption('id');
    
    return {
      create: function () {
        var data = {
          action: '/api/channels',
          method: 'POST'
        };
        
        // inject form template
        $(id).append(template.apply('channels-form', data));
        
        // handle form submission
        $('form', id).submit(function (event) {
          event.preventDefault();
          
          var params = utils.serializeForm(this),
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
              App.publish('/redirect', '/admin/channels/');
            })
            .fail(function (response) {
              // TODO: handle error
              var error = JSON.parse(response.responseText);
              console.error(error);
            });
        });
      },
      destroy: function () {
        $(id).remove();
        $('form', id).unbind();
      }
    };
  }));
}(this.Broadcast.App, this.Broadcast.Widgets, this.Weld.Widget));