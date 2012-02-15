var config = require('../../../config/base').database,
    nano   = require('nano')(config.url);

var db = module.exports = {
  init: function () {
    db.client = nano.use(config.name);
  },
  client: null
};
