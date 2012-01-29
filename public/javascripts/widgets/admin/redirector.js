define(function () {
  return {
    creator: function (sandbox) {
      var app = sandbox.getOption('app'),
          handle;
      
      return {
        create: function () {
          handle = sandbox.app.subscribe('/redirect', function (path) {
            app.setLocation(path);
          });
        },
        destroy: function () {
          sandbox.app.unsubscribe(handle);
        }
      };
    }
  };
});
