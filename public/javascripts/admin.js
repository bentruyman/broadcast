Sammy(function () {
  // get channels
  this.get('/admin/channels/', function () {
    API.channels.read().then(function (data) {
      // inject channels data into channels template
      $('#channels').append(
        $('#template-channels').tmpl(data)
      );
    });
  });
  
  // get channels
  this.get('/admin/channels/update/:id', function () {
    console.log('Hello World');
  });
}).run();
