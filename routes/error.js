module.exports = function (ctx) {
  var app = ctx.app;
  
  function NotFound(msg){
    this.name = 'NotFound';
    Error.call(this, msg);
    Error.captureStackTrace(this, arguments.callee);
  }
  NotFound.prototype = new Error();
  
  app.get('/*', function (req, res) {
    throw new NotFound;
  });
  
  app.error(function (err, req, res, next) {
    if (err instanceof NotFound) {
      res.render('errors/404', { error: err, status: 404, pageName: 'four_oh_four', referrer: req.headers.referer || null });
    } else {
      console.error(err);
      res.render('errors/500', { error: err, status: 500, pageName: 'five_hundred', referrer: req.headers.referer || null });
    }
  });
};
