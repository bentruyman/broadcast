(function (App, undefined) {
  var API_URL   = '/api/',
      resources = ['channels', 'channelSets'];
  
  var API = {};
  
  // RESTful/CRUDful resource class
  function RestfulResource(resource) {
    this.create = function create (data) {
      return $.ajax(API_URL + resource, { type: 'POST', data: data, dataType: 'json' });
    };
    this.read = function (query) {
      if (query !== undefined && query.id) {
        return $.ajax(API_URL + resource + '/' + query.id, { type: 'GET' });
      } else if (query !== undefined) {
        return $.ajax(API_URL + resource, { data: { query: query }, type: 'GET' });
      } else {
        return $.ajax(API_URL + resource, { type: 'GET' });
      }
    };
    this.update = function (data) {
      // remove id attribute as it's not valid for updates
      var id = '' + data.id;
      delete data.id;
      
      return $.ajax(API_URL + resource + '/' + id, { type: 'PUT', data: data });
    };
    this.delete = function (id) {
      return $.ajax(API_URL + resource + '/' + id, { type: 'DELETE' });
    };
  }
  
  // for all of the API resources, generate their RESTful methods
  resources.forEach(function (resource) {
    API[resource] = new RestfulResource(resource);
  });
  
  // add this service to the app
  App.addService('api', API);
}(this.Broadcast.App));
