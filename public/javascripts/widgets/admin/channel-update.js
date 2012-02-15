define(function () {
  return {
    creator: function (sandbox) {
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
                channel: response[0]
              };
              
              // inject form template
              template.apply('admin.channels.form', data).then(function (content) {
                $(id).append(content);
                
                // handle form submissions
                $('form', id).submit(function (event) {
                  event.preventDefault();
                  
                  var params = utils.serializeForm(this),
                      channel = {
                        _id: params.id,
                        _rev: params.rev,
                        index: params.index,
                        name: params.name,
                        url: params.url,
                        assetType: params.assetType,
                        timeout: params.timeout
                      };
                  
                  API.channels.update(channel)
                    .done(function () {
                      // created channel successfully, redirect to channel listing
                      sandbox.app.publish('/redirect', '/admin/channels/');
                    })
                    .fail(function (response) {
                      // TODO: handle error
                      var error = JSON.parse(response.responseText);
                      console.error(error);
                    });
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
    }
  };
});