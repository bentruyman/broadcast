module.exports = function (ctx) {
  var TEMPLATE_DIR  = ctx.VIEWS_DIR + '/templates',
      app = ctx.app,
      fs = require('fs');
  
  // retrieves a template
  app.get('/templates/:template', function (req, res) {
    fs.readFile(TEMPLATE_DIR + '/' + req.params.template + '.jade', function (err, data) {
      if (err) {
        // TODO: handle it
        res.send(404);
      } else {
        res.send(data);
      }
    });
  });
};
