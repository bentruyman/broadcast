var _ = require('underscore');

/*
 * name: String
 * configuredChannelSets: [ConfiguredChannelSet]
 */
function Display(data) {
  // merge this instance with user data and defaults
  _.extend(this, {
    type: 'display',
    name: '',
    configuredChannelSets: []
  }, data);
}

module.exports = Display;
