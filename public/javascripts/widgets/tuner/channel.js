(function (Weld, App) {
  var Channel = new Weld.Widget('tuner-channel', function (sandbox) {
    // locals
    var container;
    
    // import options
    var host = sandbox.getOption('host'),
        type = sandbox.getOption('type'),
        url  = sandbox.getOption('url');
    
    // import services
    var template = sandbox.getService('template');
    
    return {
      create: function () {
        template.apply('channel.' + type, { url: url }).then(function (content) {
          container = $(content).get(0);
          $(host).append(container);
          creators[type](container);
        });
      },
      destroy: function () {
        destroyers[type](container);
      }
    };
  });
  
  // channel specific creator functions
  var creators = {
    image: function (container) {
      // need to yield to allow CSS animation to happen
      window.setTimeout(function () {
        $(container).addClass('active');
      }, 0);
    },
    page: function (container) {},
    video: function (container) {}
  };
  
  // channel specific destroyer functions
  var destroyers = {
    image: function (container) {
      $(container).removeClass('active');
      
      setTimeout(function () {
        $(container).remove();
      }, 1000);
    },
    page: function (container) {
      $(container).remove();
    },
    video: function (container) {
      $(container).remove();
    }
  };
  
  App.register(Channel);
}(this.Weld, this.Broadcast.App));
