(function () {
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
        var mainContainer = $(html).filter(containerSelector).get(0);
        self.$element().html(mainContainer.innerHTML);
        deferred.resolve();
      });
      
      return deferred.promise();
    });
    
    // get channels
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
    
    // get channels
    this.get('/admin/channels/update/:id', function () {
      this.renderPage().then(function () {
        console.log('Hello World');
      });
    });
  }).run();
}());
