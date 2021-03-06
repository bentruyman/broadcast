////////////////////////////////////////////////////////////////////////////////
// BROADCAST
////////////////////////////////////////////////////////////////////////////////

var server    = require('./lib/broadcast/web/server'),
    routes    = require('./routes');

server.init();
routes.init();

module.exports = server.app;
