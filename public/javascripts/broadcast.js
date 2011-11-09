// TODO: consider using an ES5 shim
(function () {
  // application namespace
  var Broadcast = this.Broadcast = {};
  
  Broadcast.init = function () {};
  
  Broadcast.utils = {
    calculatePagination: function (numberOfItems, itemsPerPage, currentPage) {
      var totalPages = Math.ceil(numberOfItems / itemsPerPage);
      
      return {
        currentPage: currentPage,
        totalPages: totalPages,
        prevPage: (currentPage - 1 > 0) ? currentPage - 1 : null,
        nextPage: (currentPage < totalPages) ? currentPage + 1 : null
      };
    },
    parseUrl: function (url) {
      var regexp = /^(([^:\/\?#]+):)?(\/\/([^\/\?#]*))?([^\.\?#]*)(\.([^\?#]*))?(\?([^#]*))?(#(.*))?/,
          exploded = regexp.exec(url),
          urlFragments = {
            scheme: exploded[2],
            authority: exploded[4],
            path: exploded[5],
            extension: exploded[7],
            query: {},
            fragment: exploded[11]
          };
      
      var queryPieces = exploded[9];
      
      if (queryPieces) {
        var chunk;
        
        queryPieces = queryPieces.split('&');
        
        for (var i = 0, j = queryPieces.length; i < j; i = i + 1) {
          chunk = queryPieces[i].split('=');
          urlFragments.query[chunk[0]] = chunk[1];
        }
      }
      
      return urlFragments;
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
}());
