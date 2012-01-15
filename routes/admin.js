module.exports = function (ctx) {
  var ADMIN_PATH = '/admin',
      api = ctx.api,
      app = ctx.app;
  
  // responsible for rendering a view and setting common locals
  function adminRender(res, viewName, locals) {
    locals = locals || {};
    
    locals.layout = 'admin/layout';
    
    res.render(viewName, locals);
  }
  
  // lists all channels and channel sets
  app.get(ADMIN_PATH, function (req, res) {
    adminRender(res, 'admin/index', { type: 'dashboard', method: '' });
  });
  
  // lists all channel sets or a views single channel set
  app.get(ADMIN_PATH + '/channel-sets/', function (req, res) {
    adminRender(res, 'admin/channel-sets/index', { type: 'channel-sets', method: 'read' });
  });
  
  // creates a channel set
  app.get(ADMIN_PATH + '/channel-sets/create', function (req, res) {
    adminRender(res, 'admin/channel-sets/create', { type: 'channel-sets', method: 'create' });
  });
  
  // updates a channel set
  app.get(ADMIN_PATH + '/channel-sets/update/:id', function (req, res) {
    adminRender(res, 'admin/channel-sets/update', { type: 'channel-sets', method: 'update' });
  });
  
  // lists all channels or a views single channel
  app.get(ADMIN_PATH + '/channels/', function (req, res) {
    adminRender(res, 'admin/channels/index', { type: 'channels', method: 'read' });
  });
  
  // creates a channel
  app.get(ADMIN_PATH + '/channels/create', function (req, res) {
    adminRender(res, 'admin/channels/create', { type: 'channels', method: 'create' });
  });
  
  // updates a channel
  app.get(ADMIN_PATH + '/channels/update/:id', function (req, res) {
    adminRender(res, 'admin/channels/update', {
      type: 'channels',
      method: 'update'
    });
  });
};
