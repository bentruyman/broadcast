define(function () {
  return {
    creator: function (sandbox) {
      // services
      var $        = sandbox.getService('query'),
          API      = sandbox.getService('api'),
          template = sandbox.getService('template'),
          utils    = sandbox.getService('utils');
      
      // locals
      var id    = '#' + sandbox.getOption('id'),
          currentPage = sandbox.getOption('currentPage'),
          limit       = sandbox.getOption('limit');
      
      return {
        create: function () {
          // load all channels
          API.channels.read().then(function (channels) {
            // determine current, next, and previous page indexes
            var data = {},
                pagination = utils.calculatePagination(
                  channels.length, // number of items
                  limit, // items per page
                  parseInt(currentPage, 10) || 1 // current page
                );
            
            data.currentPage = pagination.currentPage;
            data.totalPages  = pagination.totalPages;
            data.prevPage    = pagination.prevPage;
            data.nextPage    = pagination.nextPage;
            
            // slice out current page's channels
            var startOfItems = (data.currentPage - 1) * limit,
                endOfItems   = startOfItems + limit;
            
            data.channels = channels.slice(startOfItems, endOfItems);
            
            // sort channels by name
            data.channels = utils.sortItemsByProperty(data.channels, 'name');
            
            console.log(data.channels);
            
            // inject channels data into channels template
            template.apply('admin.channels', data).then(function (content) {
              $(id).append(content);
              
              // handle channel removal requests
              $(id).delegate('.remove', 'click', function (event) {
                var $element = $(this);
                
                API.channels.delete($element.data('id'))
                  .done(function () {
                    // deleted the channel successfully, remove the row
                    $element.parent().parent().remove();
                  })
                  .fail(function () {
                    // TODO: handle failure
                  });
              });
            });
          });
        },
        destroy: function () {
          $(id)
            .remove()
            .undelegate();
        }
      };
    }
  };
});
