module.exports = function (ctx) {
  var api = ctx.api,
      app = ctx.app;
  
  // list the main menu
  app.get('/', function (req, res) {
    res.render('index');
  });
};
