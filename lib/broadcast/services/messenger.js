var faye   = require('faye'),
    server = require('../web/server'),
    bayeux;

var messenger = module.exports = {
  init: function () {
    bayeux = new faye.NodeAdapter({mount: '/faye', timeout: 45});
    bayeux.attach(server.app);
    
    messenger.client = bayeux.getClient();
  },
  client: null
};
