define (function () {
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
  
  return {
    creator: function (sandbox) {
      // locals
      var container;
      
      // import options
      var host      = sandbox.getOption('host'),
          assetType = sandbox.getOption('assetType'),
          url       = sandbox.getOption('url');
      
      // import services
      var template = sandbox.getService('template');
      
      return {
        create: function () {
          template.apply('channel.' + assetType, { url: url }).then(function (content) {
            container = $(content).get(0);
            $(host).append(container);
            creators[assetType](container);
          });
        },
        destroy: function () {
          destroyers[assetType](container);
        }
      };
    }
  };
});
