module.exports = function (ctx) {
  var API_PATH   = '/api',
      api = ctx.api,
      app = ctx.app;
  
  function sendApiResponse (res, data, error) {
    res.json(data, error ? 500 : 200);
  }
  
  // overview
  app.get(API_PATH + '/', function (req, res) {
    res.json({
      channelSetsUri: API_PATH + '/channel-sets/',
      channelsUri: API_PATH + '/channels/'
    });
  });
  
  // channel sets
  app.get(API_PATH + '/channelSets', function (req, res) {
    if (req.query.query) {
      api.channelSet.read(req.query.query, function (response) {
        sendApiResponse(res, response, response.error);
      });
    } else {
      api.channelSet.read(function (response) {
        sendApiResponse(res, response, response.error);
      });
    }
  });
  app.get(API_PATH + '/channelSets/:id', function (req, res) {
    api.channelSet.read({ _id: req.params.id }, function (response) {
      if (response.channelSets && response.channelSets.length === 1) { // one channel set
        sendApiResponse(res, { channelSet: response.channelSets[0] }, response.error);
      } else { // error
        sendApiResponse(res, response, response.error);
      }
    });
  });
  app.put(API_PATH + '/channelSets/:id', function (req, res) {
    var set = req.body,
        id  = req.params.id;
    
    api.channelSet.update(set, req.params.id, function (response) {
      sendApiResponse(res, response, response.error);
    });
  });
  app.post(API_PATH + '/channelSets', function (req, res) {
    api.channelSet.create(req.body, function (response) {
      sendApiResponse(res, response, response.error);
    });
  });
  app.delete(API_PATH + '/channelSets/:id', function (req, res) {
    api.channelSet.delete(req.params.id, function (response) {
      sendApiResponse(res, response, response.error);
    });
  });
  
  // channels
  app.get(API_PATH + '/channels', function (req, res) {
    api.channel.read(function (response) {
      sendApiResponse(res, response, response.error);
    });
  });
  app.get(API_PATH + '/channels/:id', function (req, res) {
    api.channel.read({ _id: req.params.id }, function (response) {
      if (response.channels && response.channels.length === 1) { // one channel
        sendApiResponse(res, { channel: response.channels[0]}, response.error);
      } else { // error
        sendApiResponse(res, response, response.error);
      }
    });
  });
  app.put(API_PATH + '/channels/:id', function (req, res) {
    var channel = req.body,
        id      = req.params.id;
    
    api.channel.update(channel, id, function (response) {
      sendApiResponse(res, response, response.error);
    });
  });
  app.post(API_PATH + '/channels', function (req, res) {
    api.channel.create(req.body, function (response) {
      sendApiResponse(res, response, response.error);
    });
  });
  app.delete(API_PATH + '/channels/:id', function (req, res) {
    api.channel.delete(req.params.id, function (response) {
      sendApiResponse(res, response, response.error);
    });
  });
  
  // displays
  app.get(API_PATH + '/displays', function (req, res) {
    if (req.query.query) {
      api.display.read(req.query.query, function (response) {
        sendApiResponse(res, response, response.error);
      });
    } else {
      api.display.read(function (response) {
        sendApiResponse(res, response, response.error);
      });
    }
  });
  app.get(API_PATH + '/displays/:id', function (req, res) {
    api.display.read({ _id: req.params.id }, function (response) {
      if (response.displays && response.displays.length === 1) { // one display
        sendApiResponse(res, { display: response.displays[0] }, response.error);
      } else { // error
        sendApiResponse(res, response, response.error);
      }
    });
  });
  app.put(API_PATH + '/displays/:id', function (req, res) {
    var set = req.body,
        id  = req.params.id;
    
    api.display.update(set, req.params.id, function (response) {
      sendApiResponse(res, response, response.error);
    });
  });
  app.post(API_PATH + '/displays', function (req, res) {
    api.display.create(req.body, function (response) {
      sendApiResponse(res, response, response.error);
    });
  });
  app.delete(API_PATH + '/displays/:id', function (req, res) {
    api.display.delete(req.params.id, function (response) {
      sendApiResponse(res, response, response.error);
    });
  });
};
