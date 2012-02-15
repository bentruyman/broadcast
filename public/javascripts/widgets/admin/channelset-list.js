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
          API.channelSets.read().then(function (channelSets) {
            // determine current, next, and previous page indexes
            var data = {},
                pagination = utils.calculatePagination(
                  channelSets.length, // number of items
                  limit, // items per page
                  parseInt(currentPage, 10) || 1 // current page
                );
            
            data.currentPage = pagination.currentPage;
            data.totalPages  = pagination.totalPages;
            data.prevPage    = pagination.prevPage;
            data.nextPage    = pagination.nextPage;
            
            // slice out current page's channel sets
            var startOfItems = (data.currentPage - 1) * limit,
                endOfItems   = startOfItems + limit;
            
            data.channelSets = channelSets.slice(startOfItems, endOfItems);
            
            // inject channels data into channels template
            template.apply('admin.channel-sets', data).then(function (content) {
              $(id).append(content);
              
              $(id).delegate('.remove', 'click', function (event) {
                var $element = $(this);
                
                API.channelSets.delete($(this).data('id'))
                  .done(function () {
                    // deleted the channel set successfully, remove the row
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
          $(id).remove();
        }
      };
    }
  };
});
