(function (App, Sammy, Weld) {
  var
    // a selector to match the main container
    CONTAINER_SELECTOR = '#main',
    // how many items to list per page
    ITEMS_PER_PAGE = 15;
  
  // determines if the passed in value is an instance of an array
  function isArray(val) {
    return Object.prototype.toString.call(val) === '[object Array]';
  }
  
  // setup routes
  Sammy(CONTAINER_SELECTOR, function (app) {
    // a collection of running module IDs
    var runningModules = [];
    
    // start the redirector widget
    var redirector = App.create('admin/redirector', { app: this });
    App.start(redirector);
    
    // route widget creator
    app.helper('createPageWidget', function (name, settings) {
      var module = App.create('admin/' + name, settings);
      
      runningModules.push(module);
      
      App.start(module);
    });
    
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
        var mainContainer = $(CONTAINER_SELECTOR, html).get(0);
        self.$element().html(mainContainer.innerHTML);
        deferred.resolve();
      });
      
      return deferred.promise();
    });
    
    // common route actions
    this.around(function (callback, app) {
      // stop all running modules
      while (runningModules.length) {
        App.stop(runningModules.splice(0, 1));
      }
      
      if (this.verb === 'get') {
        // render a page for all "GET" requests
        this.renderPage().then(callback);
      } else {
        callback();
      }
    });
    
    // dashboard
    this.get('/admin/', function () {
      
    });
    
    // list channels
    this.get('/admin/channels/', function (app) {
      this.createPageWidget('channel-list', {
        id: 'channels',
        currentPage: app.params.page,
        limit: ITEMS_PER_PAGE,
        templates: ['admin.channels']
      });
    });
    
    // create channels
    this.get('/admin/channels/create', function (app) {
      this.createPageWidget('channel-create', { id: 'channel-form' });
    });
    
    // update channels
    this.get('/admin/channels/update/:id', function (app) {
      this.createPageWidget('channel-update', {
        id: 'channel-form',
        channelId: app.params.id
      });
    });
    
    // list channel sets
    this.get('/admin/channel-sets/', function (app) {
      this.createPageWidget('channelset-list', {
        id: 'channel-sets',
        currentPage: app.params.page,
        limit: ITEMS_PER_PAGE
      });
    });
    
    // create channel sets
    this.get('/admin/channel-sets/create', function (app) {
      this.createPageWidget('channelset-create', { id: 'channel-set-form' });
    });
    
    // update channel sets
    this.get('/admin/channel-sets/update/:id', function (app) {
      this.createPageWidget('channelset-update', {
        id: 'channel-set-form',
        channelSetId: app.params.id
      });
    });
    
    // list displays
    this.get('/admin/displays/', function (app) {
      this.createPageWidget('display-list', {
        id: 'displays',
        currentPage: app.params.page,
        limit: ITEMS_PER_PAGE
      });
    });
    
    // create displays
    this.get('/admin/displays/create', function (app) {
      this.createPageWidget('display-create', { id: 'display-form' });
    });
    
    // update display
    this.get('/admin/displays/update/:id', function (app) {
      this.createPageWidget('display-update', {
        id: 'display-form',
        displayId: app.params.id
      });
    });
    
  }).run();
  
}(this.Broadcast.App, this.Sammy, this.Weld));
