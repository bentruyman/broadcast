// import node modules
////////////////////////////////////////////////////////////////////////////////
var express  = require('./node_modules/express'),
    faye     = require('./node_modules/faye'),
    fs       = require('fs'),
    mongoose = require('./node_modules/mongoose'),
    nib      = require('./node_modules/nib'),
    stylus   = require('./node_modules/stylus'),
    Q        = require('qq');

// declare constants
////////////////////////////////////////////////////////////////////////////////

// local directories
var BROADCAST_DIR = __dirname + '/lib/broadcast';
var CONFIG_DIR    = __dirname + '/config';
var PUBLIC_DIR    = __dirname + '/public';
var VIEWS_DIR     = __dirname + '/views';
var TEMPLATE_DIR  = VIEWS_DIR + '/templates';

// route prefixes
var ADMIN_PATH = '/admin';
var API_PATH   = '/api';

// get user config
var config = require(CONFIG_DIR + '/base');

// setup mongoose
////////////////////////////////////////////////////////////////////////////////

// set models
mongoose.model('Channel'          , require(BROADCAST_DIR + '/domain/channel'));
mongoose.model('ChannelSet'       , require(BROADCAST_DIR + '/domain/channel-set'));
mongoose.model('ConfiguredChannel', require(BROADCAST_DIR + '/domain/configured-channel'));

// connect to the database
mongoose.connect(config.database.host, config.database.name);

// initialize api
////////////////////////////////////////////////////////////////////////////////
var api = require(BROADCAST_DIR + '/web/api')();

// setup the app server
////////////////////////////////////////////////////////////////////////////////
var app = express.createServer();

// configure the app server
app.configure(function () {
  app.set('views', VIEWS_DIR);
  app.set('view engine', 'jade');
  
  // handle cookies and sessions
  app.use(express.cookieParser());
  app.use(express.session({
    secret: config.security.secretKey
  }));
  
  // handle form bodies
  app.use(express.bodyParser());
  
  app.use(stylus.middleware({
    src: VIEWS_DIR,
    dest: PUBLIC_DIR,
    compile: function(str, path) {
      return stylus(str).set('filename', path).set('compress', true).use(nib()).define('durl', stylus.url({
        paths: [PUBLIC_DIR]
      }));
    }
  }));
  
  app.use(express['static'](PUBLIC_DIR));
});

// public routes
////////////////////////////////////////////////////////////////////////////////

// list all channel sets by title
app.get('/', function (req, res) {
  // retrieve all channel sets
  api.channelSet.read(function (response) {
    res.render('index', { channelSets: response.channelSets });
  });
});

// renders an empty channel set
app.get('/channel-sets/:slug', function (req, res) {
  res.render('channel-set', {
    modules: [
      { name: 'tuner', options: { id: 'channel', slug: req.params.slug } }
    ]
  });
});

// retrieves a template
app.get('/templates/:template', function (req, res) {
  fs.readFile(TEMPLATE_DIR + '/' + req.params.template + '.jade', function (err, data) {
    if (err) {
      // TODO: handle it
      res.send(404);
    } else {
      res.send(data);
    }
  });
});

// private routes
////////////////////////////////////////////////////////////////////////////////

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

// api routes
////////////////////////////////////////////////////////////////////////////////

function sendApiResponse (res, data, error) {
  res.json(data, error ? 500 : 200);
}

// overview
app.get(API_PATH + '/', function (req, res) {
  res.json({
    channelSetsUri: API_PATH + '/channel-sets/',
    channelsUri: API_PATH + '/channels/'
  });
});

// channel sets
app.get(API_PATH + '/channelSets', function (req, res) {
  if (req.query.query) {
    api.channelSet.read(req.query.query, function (response) {
      sendApiResponse(res, response, response.error);
    });
  } else {
    api.channelSet.read(function (response) {
      sendApiResponse(res, response, response.error);
    });
  }
});
app.get(API_PATH + '/channelSets/:id', function (req, res) {
  api.channelSet.read({ _id: req.params.id }, function (response) {
    if (response.channelSets && response.channelSets.length === 1) { // one channel set
      sendApiResponse(res, { channelSet: response.channelSets[0] }, response.error);
    } else { // error
      sendApiResponse(res, response, response.error);
    }
  });
});
app.put(API_PATH + '/channelSets/:id', function (req, res) {
  var set = req.body,
      id  = req.params.id;
  
  api.channelSet.update(set, req.params.id, function (response) {
    sendApiResponse(res, response, response.error);
  });
});
app.post(API_PATH + '/channelSets', function (req, res) {
  api.channelSet.create(req.body, function (response) {
    sendApiResponse(res, response, response.error);
  });
});
app.delete(API_PATH + '/channelSets/:id', function (req, res) {
  api.channelSet.delete(req.params.id, function (response) {
    sendApiResponse(res, response, response.error);
  });
});

// channels
app.get(API_PATH + '/channels', function (req, res) {
  api.channel.read(function (response) {
    sendApiResponse(res, response, response.error);
  });
});
app.get(API_PATH + '/channels/:id', function (req, res) {
  api.channel.read({ _id: req.params.id }, function (response) {
    if (response.channels && response.channels.length === 1) { // one channel
      sendApiResponse(res, { channel: response.channels[0]}, response.error);
    } else { // error
      sendApiResponse(res, response, response.error);
    }
  });
});
app.put(API_PATH + '/channels/:id', function (req, res) {
  var channel = req.body,
      id      = req.params.id;
  
  api.channel.update(channel, id, function (response) {
    sendApiResponse(res, response, response.error);
  });
});
app.post(API_PATH + '/channels', function (req, res) {
  api.channel.create(req.body, function (response) {
    sendApiResponse(res, response, response.error);
  });
});
app.delete(API_PATH + '/channels/:id', function (req, res) {
  api.channel.delete(req.params.id, function (response) {
    sendApiResponse(res, response, response.error);
  });
});

// error routes
////////////////////////////////////////////////////////////////////////////////

function NotFound(msg){
  this.name = 'NotFound';
  Error.call(this, msg);
  Error.captureStackTrace(this, arguments.callee);
}

NotFound.prototype = new Error();

// app.get('/*', function (req, res) {
//   throw new NotFound;
// });
// 
// app.error(function (err, req, res, next) {
//   if (err instanceof NotFound) {
//     res.render('errors/404', { error: err, status: 404, pageName: 'four_oh_four', referrer: req.headers.referer || null });
//   } else {
//     console.error(err);
//     res.render('errors/500', { error: err, status: 500, pageName: 'five_hundred', referrer: req.headers.referer || null });
//   }
// });

// listen for incoming connections
app.listen(config.server.port);
