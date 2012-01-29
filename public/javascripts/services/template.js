(function (undefined) {
  define(function () {
    // templating service
    var
      // base directory where templates can be found
      BASE_TEMPLATE_URI = '/templates',
      // a collection of all templates
      templates = {};
    
    function apply(name, locals) {
      return templates[name](locals);
    }
    
    var service = {
      apply: function (name, locals) {
        var deferred = $.Deferred();
        
        // if the template hasn't been loaded into the private cache, download it
        if (templates[name] === undefined) {
          $.get(BASE_TEMPLATE_URI + '/' + name, function (data) {
            // TODO: handle errors
            
            // define and compile the template
            templates[name] = jade.compile(data);
            
            // apply it
            deferred.resolve(apply(name, locals));
          });
        }
        // if the template exists, immediately apply it
        else {
          deferred.resolve(apply(name, locals));
        }
        
        return deferred.promise();
      }
    };
    
    return service;
  });
}());