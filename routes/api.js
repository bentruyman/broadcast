var RestfulResource = require('../lib/broadcast/web/api/restful-resource');

module.exports = function (ctx) {
  var api       = ctx.api,
      app       = ctx.app,
      messenger = ctx.messenger;
  
  new RestfulResource('channel',    api.channel,    app);
  new RestfulResource('channelSet', api.channelSet, app);
  new RestfulResource('display',    api.display,    app);
};
