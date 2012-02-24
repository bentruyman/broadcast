////////////////////////////////////////////////////////////////////////////////
// BROADCAST
////////////////////////////////////////////////////////////////////////////////

var messenger = require('./lib/broadcast/services/messenger'),
    server    = require('./lib/broadcast/web/server'),
    config    = require('./config'),
    routes    = require('./routes');

server.init();
routes.init();

module.exports = server.app;
