module.exports = function (ctx) {
  var API_PATH = '/api',
      api       = ctx.api,
      app       = ctx.app,
      messenger = ctx.messenger;
  
  function sendApiResponse (res, data) {
    res.json(data, 200);
  }
  
  // overview
  app.get(API_PATH + '/', function (req, res) {
    res.json({
      channelSetsUri: API_PATH + '/channel-sets/',
      channelsUri: API_PATH + '/channels/'
    });
  });
  
  // channels
  app.get(API_PATH + '/channels', function (req, res) {
    api.channel.read().then(function (response) {
      sendApiResponse(res, response);
    });
  });
  app.get(API_PATH + '/channels/:id', function (req, res) {
    api.channel.read({ key: req.params.id }).then(function (response) {
      if (response.channels && response.channels.length === 1) { // one channel
        sendApiResponse(res, { channel: response.channels[0]});
      } else { // error
        sendApiResponse(res, response);
      }
    });
  });
  app.put(API_PATH + '/channels/:id', function (req, res) {
    var channel = req.body;
    
    api.channel.update(channel).then(function (response) {
      sendApiResponse(res, response);
    });
  });
  app.post(API_PATH + '/channels', function (req, res) {
    api.channel.create(req.body).then(function (response) {
      console.log('post', arguments);
      sendApiResponse(res, response);
    });
  });
  app.delete(API_PATH + '/channels/:id', function (req, res) {
    api.channel.delete(req.params.id).then(function (response) {
      sendApiResponse(res, response);
    });
  });
  
  // channel sets
  app.get(API_PATH + '/channelSets', function (req, res) {
    if (req.query.query) {
      api.channelSet.read(req.query.query).then(function (response) {
        sendApiResponse(res, response);
      });
    } else {
      api.channelSet.read().then(function (response) {
        sendApiResponse(res, response);
      });
    }
  });
  app.get(API_PATH + '/channelSets/:id', function (req, res) {
    api.channelSet.read({ _id: req.params.id }).then(function (response) {
      if (response.channelSets && response.channelSets.length === 1) { // one channel set
        sendApiResponse(res, { channelSet: response.channelSets[0] });
      } else { // error
        sendApiResponse(res, response);
      }
    });
  });
  app.put(API_PATH + '/channelSets/:id', function (req, res) {
    var set = req.body;
    
    api.channelSet.update(set).then(function (response) {
      messenger.client.publish('/channelSets/' + req.body._id + '/update', true);
      sendApiResponse(res, response);
    });
  });
  app.post(API_PATH + '/channelSets', function (req, res) {
    api.channelSet.create(req.body).then(function (response) {
      sendApiResponse(res, response);
    });
  });
  app.delete(API_PATH + '/channelSets/:id', function (req, res) {
    api.channelSet.delete(req.params.id).then(function (response) {
      sendApiResponse(res, response);
    });
  });
  
  // displays
  app.get(API_PATH + '/displays', function (req, res) {
    if (req.query.query) {
      api.display.read(req.query.query).then(function (response) {
        sendApiResponse(res, response);
      });
    } else {
      api.display.read().then(function (response) {
        sendApiResponse(res, response);
      });
    }
  });
  app.get(API_PATH + '/displays/:id', function (req, res) {
    api.display.read({ _id: req.params.id }).then(function (response) {
      if (response.displays && response.displays.length === 1) { // one display
        sendApiResponse(res, { display: response.displays[0] });
      } else { // error
        sendApiResponse(res, response);
      }
    });
  });
  app.put(API_PATH + '/displays/:id', function (req, res) {
    var set = req.body;
    
    api.display.update(set).then(function (response) {
      messenger.client.publish('/displays/' + req.body._id + '/update', true);
      sendApiResponse(res, response);
    });
  });
  app.post(API_PATH + '/displays', function (req, res) {
    api.display.create(req.body).then(function (response) {
      sendApiResponse(res, response);
    });
  });
  app.delete(API_PATH + '/displays/:id', function (req, res) {
    api.display.delete(req.params.id).then(function (response) {
      sendApiResponse(res, response);
    });
  });
};
