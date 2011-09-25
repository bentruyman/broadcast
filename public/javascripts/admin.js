(function (Broadcast, Sammy) {
  
  Broadcast.Admin = {
    init: function () {
      var containerSelector = '#main';
      
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
        this.get('/admin/channels/', function () {
          this.renderPage().then(function () {
            // load all channels
            API.channels.read().then(function (data) {
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
