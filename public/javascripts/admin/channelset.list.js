(function (App, Widgets, Widget) {
  App.register(new Widget('channelset-list', function (sandbox) {
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
        API.channelSets.read().then(function (data) {
          // determine current, next, and previous page indexes
          var pagination = utils.calculatePagination(
            data.channelSets.length, // number of items
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
          
          data.channelSets = data.channelSets.slice(startOfItems, endOfItems);
          
          // inject channels data into channels template
          $(id).append(template.apply('channel-sets', data));
          
          $(id).delegate('.remove', 'click', function (event) {
            API.channelSets.delete($(this).data('id'))
              .done(function () {
                // deleted the channel set successfully, remove the row
                $element.parent().parent();
              })
              .fail(function () {
                // TODO: handle failure
              });
          });
        });
      },
      destroy: function () {
        $(id).remove();
      }
    };
  }));
}(this.Broadcast.App, this.Broadcast.Widgets, this.Weld.Widget));