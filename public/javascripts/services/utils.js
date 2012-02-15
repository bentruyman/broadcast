(function (undefined) {
  define(function () {
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
      // combines lists of ids and timeouts into a consumable format for the API
      formatChannelSetChannels: function (ids, timeouts) {
        var channels = [];
        
        // format channels from param data
        if (isArray(ids)) {
          // handle multiple channels
          for (var i = 0, j = ids.length; i < j; i++) {
            channels.push({
              channel: ids[i],
              timeout: timeouts[i]
            });
          }
        } else {
          // just a single channel
          channels.push({
            channel: ids,
            timeout: timeouts
          });
        }
        
        return channels;
      },
      // combines lists of ids and times into a consumable format for the API
      formatDisplayChannelSets: function (ids, days, hours, minutes) {
        var sets = [];
        
        // format channel sets from param data
        if (isArray(ids)) {
          // handle multiple channel sets
          for (var i = 0, j = ids.length; i < j; i++) {
            sets.push({
              channelSet: ids[i],
              startTime: parseInt(days[i], 10) + parseInt(hours[i], 10) + parseInt(minutes[i], 10)
            });
          }
        } else {
          // just a single display
          sets.push({
            channelSet: ids,
            startTime: parseInt(days, 10) + parseInt(hours, 10) + parseInt(minutes, 10)
          });
        }
        
        return sets;
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
    
    return utils;
  });
}());
