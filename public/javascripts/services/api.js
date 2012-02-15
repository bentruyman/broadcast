(function (undefined) {
  define(function () {
    var API_URL   = '/api/',
        resources = ['channels', 'channelSets', 'displays'];
    
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
        var id = data._id;
        
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
    
    return API;
  });
}());
