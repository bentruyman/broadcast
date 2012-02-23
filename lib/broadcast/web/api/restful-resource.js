var inflection = require('inflection');

function sendApiResponse (res, err, docs) {
  if (err) {
    res.json({ error: err.message ? err.message : err }, 500);
  } else {
    res.json(docs, 200);
  }
}

var API_PATH = '/api';

var RestfulResource = module.exports = function (type, api, app, messenger) {
  var BASE_URI = API_PATH + '/' + inflection.pluralize(type);
  
  // read all resources
  app.get(BASE_URI, function (req, res) {
    api.read(function (err, resources) {
      sendApiResponse(res, err, resources);
    });
  });
  
  // read a single resource
  app.get(BASE_URI + '/:id', function (req, res) {
    api.readOne(req.params.id, function (err, resource) {
      sendApiResponse(res, err, resource);
    });
  });
  
  // create a new resource
  app.put(BASE_URI + '/:id', function (req, res) {
    var doc = req.body;
    
    api.update(doc, function (err, response) {
      sendApiResponse(res, err, response);
    });
  });
  
  // update a resource
  app.post(BASE_URI, function (req, res) {
    api.create(req.body, function (err, response) {
      sendApiResponse(res, err, response);
    });
  });
  
  // delete a resource
  app.delete(BASE_URI + '/:id', function (req, res) {
    api.delete(req.params.id, function (err, response) {
      sendApiResponse(res, err, response);
    });
  });
};
