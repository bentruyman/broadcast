// TODO: consider using an ES5 shim
(function () {
  // application namespace
  var Broadcast = this.Broadcast = {};
  
  Broadcast.init = function () {
    Broadcast.Templates.init();
  };
  
  // templating system
  Broadcast.Templates = (function () {
    var 
      // reference to the jade template engine
      jade = require('jade'),
      // a collection of all templates
      templates = {};
    
    var Templates = {
      init: function () {
        // find all templates on a page, import them
        $('script[type="text/x-jade-template"]').each(function () {
          Templates.set($(this).data('name'), this.innerHTML);
        });
      },
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
    
    return Templates;
  }());
  
  // utilities
  Broadcast.utils = {
    calculatePagination: function (numberOfItems, itemsPerPage, currentPage) {
      var totalPages = Math.ceil(numberOfItems / itemsPerPage);
      
      return {
        currentPage: currentPage,
        totalPages: Math.max(totalPages, 1),
        prevPage: (currentPage - 1 > 0) ? currentPage - 1 : null,
        nextPage: (currentPage < totalPages) ? currentPage + 1 : null
      };
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
  
  $(Broadcast.init);
}());
