(function () {
  var API_URL   = '/api/',
      resources = ['channels', 'channelSets'];
  
  var API = this.API = {};
  
  // RESTful/CRUDful resource class
  function RestfulResource(resource) {
    this.create = function (data) {
      return $.ajax(API_URL + resource, { type: 'POST', data: data });
    };
    this.read = function (id) {
      return $.ajax(API_URL + resource + (id ? '/' + id : ''), { type: 'GET' });
    };
    this.update = function (data) {
      return $.ajax(API_URL + resource + '/' + data._id, { type: 'PUT', data: data });
    };
    this.delete = function (id) {
      return $.ajax(API_URL + resource + '/' + id, { type: 'DELETE' });
    };
  }
  
  // for all of the API resources, generate their RESTful methods
  resources.forEach(function (resource) {
    API[resource] = new RestfulResource(resource);
  });
}());
