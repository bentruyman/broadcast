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
              console.log(data.channels.length);
              // determine current, next, and previous page indexes
              data.currentPage = parseInt(app.params.page, 10) || 1;
              data.totalPages  = Math.ceil(data.channels.length / ITEMS_PER_PAGE);
              data.prevPage    = (data.currentPage - 1 > 0) ? data.currentPage - 1 : null;
              data.nextPage    = (data.currentPage < data.totalPages) ? data.currentPage + 1 : null;
              
              // slice out current page's channels
              data.channels = data.channels.slice((data.currentPage - 1) * ITEMS_PER_PAGE, ((data.currentPage - 1) * ITEMS_PER_PAGE) + ITEMS_PER_PAGE);
              
              console.log(data);
              
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
            
          });
        });
        
        // update channels
        this.get('/admin/channels/update/:id', function () {
          this.renderPage().then(function () {
            
          });
        });
        
        // list channel sets
        this.get('/admin/channel-sets/', function () {
          this.renderPage().then(function () {
            
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
