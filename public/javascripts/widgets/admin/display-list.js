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
          API.displays.read().then(function (data) {
            // determine current, next, and previous page indexes
            var pagination = utils.calculatePagination(
              data.displays.length, // number of items
              limit, // items per page
              parseInt(currentPage, 10) || 1 // current page
            );
            data.currentPage = pagination.currentPage;
            data.totalPages  = pagination.totalPages;
            data.prevPage    = pagination.prevPage;
            data.nextPage    = pagination.nextPage;
            
            // slice out current page's displays
            var startOfItems = (data.currentPage - 1) * limit,
                endOfItems   = startOfItems + limit;
            
            data.displays = data.displays.slice(startOfItems, endOfItems);
            
            // inject displays data into channels template
            template.apply('admin.displays', data).then(function (content) {
              $(id).append(content);
              
              $(id).delegate('.remove', 'click', function (event) {
                API.displays.delete($(this).data('id'))
                  .done(function () {
                    // deleted the display successfully, remove the row
                    $element.parent().parent();
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
