var _ = require('underscore'),
    generateSlug = require('../web/utils').string.generateSlug;

/*
 * name: String
 * configuredChannelSets: [ConfiguredChannelSet]
 */
function Display(data) {
  // merge this instance with user data and defaults
  _.extend(this, {
    configuredChannelSets: []
  }, data);
  
  // convert configured channel set start times to numbers
  this.configuredChannelSets = this.configuredChannelSets.map(function (set) {
    return {
      channelSet: set.channelSet,
      startTime: set.startTime = parseInt(set.startTime, 10)
    };
  });
}

// force display type
Object.defineProperty(Display.prototype, 'type', {
  value: 'display',
  writable: false
});

Object.defineProperty(Display.prototype, 'slug', {
  get: function () {
    return generateSlug(this.name);
  },
  enumerable: true
});

Display.prototype.toJSON = function () {
  var display = {};
  
  if (this._id)  { display._id  = this._id; }
  if (this._rev) { display._rev = this._rev; }
  
  display.type                  = this.type;
  display.name                  = this.name;
  display.slug                  = this.slug;
  display.configuredChannelSets = this.configuredChannelSets;
  
  return display;
};

module.exports = Display;
