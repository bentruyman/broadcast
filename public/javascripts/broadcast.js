// TODO: consider using an ES5 shim
(function () {
  // application namespace
  var Broadcast = this.Broadcast = {};
  
  // templating service
  var template = (function () {
    var 
      // reference to the jade template engine
      jade = require('jade'),
      // a collection of all templates
      templates = {};
    
    var service = {
      get: function (name) {
        return templates[name];
      },
      set: function (name, template) {
        templates[name] = jade.compile(template);
      },
      apply: function (name, locals) {
        return templates[name](locals);
      }
    };
    
    // find all templates on a page, import them
    $(function () {
      $('script[type="text/x-jade-template"]').each(function () {
        service.set($(this).data('name'), this.innerHTML);
      });
    });
    
    return service;
  }());
  
  // utilities service
  var utils = {
    calculatePagination: function (numberOfItems, itemsPerPage, currentPage) {
      var totalPages = Math.ceil(numberOfItems / itemsPerPage);
      
      return {
        currentPage: currentPage,
        totalPages: Math.max(totalPages, 1),
        prevPage: (currentPage - 1 > 0) ? currentPage - 1 : null,
        nextPage: (currentPage < totalPages) ? currentPage + 1 : null
      };
    },
    serializeForm: function (form) {
      var serialized = {},
          inputs = $(form).serializeArray();
      
      inputs.forEach(function (input) {
        // if an input of this name already exists, make it an array of values
        if (typeof serialized[input.name] !== 'undefined') {
          if (isArray(serialized[input.name])) {
            serialized[input.name].push(input.value);
          } else {
            serialized[input.name] = [serialized[input.name], input.value];
          }
        }
        // if an input of this name doesn't exist, add it to the object as a
        // simple key/value pair
        else {
          serialized[input.name] = input.value;
        }
      });
      
      return serialized;
    },
    preloadImages: function (imagePaths) {
      var promises = [];
      
      if ($.type(imagePaths) === 'string') {
        imagePaths = [imagePaths];
      }
      
      if (imagePaths.length) {
        imagePaths.forEach(function (path) {
          var deferred = $.Deferred();
          
          // create a new image object
          var image = new Image();
          image.onload = function () {
            // if the image loads correctly, resolve this deferred
            deferred.resolve(image);
          };
          image.onerror = function () {
            // if the image loads incorrectly, reject this deferred
            deferred.reject(image);
          };
          image.src = path;
          
          promises.push(deferred.promise());
        });
        
        return $.when.apply($, promises);
      } else {
        var deferred = $.Deferred();
        deferred.resolve();
        return deferred.promise();
      }
    }
  };
  
  // determines if the passed in value is an instance of an array
  function isArray(val) {
    return Object.prototype.toString.call(val) === '[object Array]';
  }
  
  // weld application instance
  Broadcast.App = new Weld.App({
    services: {
      query: jQuery,
      template: template,
      utils: utils
    },
    defaultServices: ['api', 'query', 'template', 'utils']
  });
}());
