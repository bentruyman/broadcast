(function (Broadcast, Sammy) {
  Broadcast.Admin = {
    init: function () {
      var containerSelector = '#main';
      
      // how many items to list per page
      var ITEMS_PER_PAGE = 15;
      
      Sammy(containerSelector, function (app) {
        var $main = $(containerSelector);
        
        // page renderer helper
        app.helper('renderPage', function () {
          var deferred = $.Deferred(),
              self = this;
              
          // load this current page, and inject the content of its main container
          // into the current page's main container
          $.ajax(this.path).then(function (html) {
            // update current <body> element to match the requested page's body ID
            // and classname
            var match     = html.match(/<body id="(.+?)" class="(.+?)">/),
                bodyId    = match[1],
                bodyClass = match[2];
            
            $('body').attr({ id: bodyId, 'class': bodyClass });
            
            // grab the main container
            var mainContainer = $(containerSelector, html).get(0);
            self.$element().html(mainContainer.innerHTML);
            deferred.resolve();
          });
          
          return deferred.promise();
        });
        
        // dashboard
        this.get('/admin/', function () {
          this.renderPage().then(function () {
            
          });
        });
        
        // list channels
        this.get('/admin/channels/', function (app) {
          this.renderPage().then(function () {
            // load all channels
            API.channels.read().then(function (data) {
              // determine current, next, and previous page indexes
              var pagination = Broadcast.utils.calculatePagination(
                data.channels.length, // number of items
                ITEMS_PER_PAGE, // items per page
                parseInt(app.params.page, 10) || 1 // current page
              );
              data.currentPage = pagination.currentPage;
              data.totalPages  = pagination.totalPages;
              data.prevPage    = pagination.prevPage;
              data.nextPage    = pagination.nextPage;
              
              // slice out current page's channels
              var startOfItems = (data.currentPage - 1) * ITEMS_PER_PAGE,
                  endOfItems   = startOfItems + ITEMS_PER_PAGE;
              
              data.channels = data.channels.slice(startOfItems, endOfItems);
              
              // inject channels data into channels template
              $('#channels').append(
                $('#template-channels').tmpl(data)
              );
            });
          });
        });
        
        // create channels
        this.get('/admin/channels/create', function () {
          this.renderPage().then(function () {
            // inject form template
            $('#channel-form').append(
              $('#template-channels-form').tmpl()
            );
          });
        });
        
        // update channels
        this.get('/admin/channels/update/:id', function () {
          this.renderPage().then(function () {
            
          });
        });
        
        // list channel sets
        this.get('/admin/channel-sets/', function (app) {
          this.renderPage().then(function () {
            API.channelSets.read().then(function (data) {
              // determine current, next, and previous page indexes
              var pagination = Broadcast.utils.calculatePagination(
                data.channelSets.length, // number of items
                ITEMS_PER_PAGE, // items per page
                parseInt(app.params.page, 10) || 1 // current page
              );
              data.currentPage = pagination.currentPage;
              data.totalPages  = pagination.totalPages;
              data.prevPage    = pagination.prevPage;
              data.nextPage    = pagination.nextPage;
              
              // slice out current page's channels
              var startOfItems = (data.currentPage - 1) * ITEMS_PER_PAGE,
                  endOfItems   = startOfItems + ITEMS_PER_PAGE;
              
              data.channelSets = data.channelSets.slice(startOfItems, endOfItems);
              console.log(data);
              // inject channels data into channels template
              $('#channel-sets').append(
                $('#template-channel-sets').tmpl(data)
              );
            });
          });
        });
        
        // create channels
        this.get('/admin/channel-sets/create', function () {
          this.renderPage().then(function () {
            
          });
        });
        
        // update channel sets
        this.get('/admin/channel-sets/update/:id', function () {
          this.renderPage().then(function () {
            
          });
        });
      }).run();
    }
  };
  
  $(Broadcast.Admin.init);
}(this.Broadcast, this.Sammy));
