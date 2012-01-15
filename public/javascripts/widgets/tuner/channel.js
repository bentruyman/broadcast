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
        });
      },
      destroy: function () {
        console.log('Hello World');
        $(container).remove();
      }
    };
  });
  
  App.register(Channel);
}(this.Weld, this.Broadcast.App));
