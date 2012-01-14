(function (App, Widgets, Widget) {
  App.register(new Widget('redirector', function (sandbox) {
    var app = sandbox.getOption('app'),
        handle;
    
    return {
      create: function () {
        handle = App.subscribe('/redirect', function (path) {
          app.setLocation(path);
        });
      },
      destroy: function () {
        App.unsubscribe(handle);
      }
    };
  }));
}(this.Broadcast.App, this.Broadcast.Widgets, this.Weld.Widget));