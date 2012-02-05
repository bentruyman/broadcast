////////////////////////////////////////////////////////////////////////////////
// BROADCAST
////////////////////////////////////////////////////////////////////////////////

var db        = require('./lib/broadcast/services/db'),
    messenger = require('./lib/broadcast/services/messenger'),
    api       = require('./lib/broadcast/web/api'),
    server    = require('./lib/broadcast/web/server'),
    routes    = require('./routes');

server.init();
routes.init();
messenger.init();

db.init().then(function () {
  server.listen();
});
