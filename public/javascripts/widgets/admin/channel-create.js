define(function () {
  return {
    creator: function (sandbox) {
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
          template.apply('admin.channels.form', data).then(function (content) {
            $(id).append(content);
            
            // handle form submission
            $('form', id).submit(function (event) {
              event.preventDefault();
              
              var params = utils.serializeForm(this),
                  channel = {
                    index: params.index,
                    name: params.name,
                    url: params.url,
                    assetType: params.assetType,
                    timeout: params.timeout
                  };
              
              API.channels.create(channel)
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
        },
        destroy: function () {
          $(id).remove();
          $('form', id).unbind();
        }
      };
    }
  };
});
