var path = require('path');

var api       = require('../lib/broadcast/web/api'),
    messenger = require('../lib/broadcast/services/messenger'),
    server    = require('../lib/broadcast/web/server'),
    VIEWS_DIR = path.normalize(__dirname + '/../views');

module.exports = {
  init: function () {
    messenger.init();
    
    var ctx = {
      api: api,
      app: server.app,
      messenger: messenger,
      VIEWS_DIR: VIEWS_DIR
    };
    
    require('./main-menu')(ctx);
    require('./tuner')(ctx);
    require('./admin')(ctx);
    require('./api')(ctx);
    require('./misc')(ctx);
    require('./error')(ctx);
  }
};
