(function (Weld, App) {
  var Channel = new Weld.Widget('tuner-channel', function (sandbox) {
    return {
      create: function () {
        console.log('Hello World');
      },
      destroy: function () {
        
      }
    };
  });
  
  App.register(Channel);
}(this.Weld, this.Broadcast.App));