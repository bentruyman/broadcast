module.exports = function (ctx) {
  var api = ctx.api,
      app = ctx.app;
  
  // list all channel sets by title
  app.get('/', function (req, res) {
    // retrieve all channel sets
    api.channelSet.read(function (response) {
      res.render('index', { channelSets: response.channelSets });
    });
  });
  
  // renders an empty channel set
  app.get('/channel-sets/:slug', function (req, res) {
    res.render('channel-set', {
      modules: [
        { name: 'tuner', options: { id: 'channel', slug: req.params.slug } }
      ]
    });
  });
};
