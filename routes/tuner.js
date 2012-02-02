module.exports = function (ctx) {
  var api = ctx.api,
      app = ctx.app;
  
  // list all displays by title
  app.get('/displays', function (req, res) {
    // retrieve all displays
    api.display.read(function (response) {
      res.render('displays/index', {
        displays: response.displays,
        layout: 'layout'
      });
    });
  });
  
  // renders an display
  app.get('/displays/:slug', function (req, res) {
    res.render('displays/display', {
      modules: [
        {
          name: 'tuner',
          options: {
            id: 'display',
            slug: req.params.slug
          }
        }
      ]
    });
  });
};
