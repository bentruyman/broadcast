module.exports = function (ctx) {
  var api = ctx.api,
      app = ctx.app;
  
  // list all channel sets by title
  app.get('/channel-sets', function (req, res) {
    // retrieve all channel sets
    api.channelSet.read(function (response) {
      res.render('channel-sets/index', {
        channelSets: response.channelSets,
        layout: 'layout'
      });
    });
  });
  
  // renders an empty channel set
  app.get('/channel-sets/:slug', function (req, res) {
    res.render('channel-sets/set', {
      modules: [
        {
          name: 'tuner',
          options: {
            id: 'channel',
            slug: req.params.slug
          }
        }
      ]
    });
  });
};
