// TODO: handle errors, especially mongo and "not found" errors

// import node modules
////////////////////////////////////////////////////////////////////////////////
var express  = require('./node_modules/express'),
    faye     = require('./node_modules/faye'),
    mongoose = require('./node_modules/mongoose'),
    nib      = require('./node_modules/nib'),
    stylus   = require('./node_modules/stylus'),
    Q        = require('qq');

// declare constants
////////////////////////////////////////////////////////////////////////////////

// local directories
const BROADCAST_DIR = __dirname + '/lib/broadcast';
const CONFIG_DIR    = __dirname + '/config';
const PUBLIC_DIR    = __dirname + '/public';
const VIEWS_DIR     = __dirname + '/views';

// route prefixes
const ADMIN_PATH = '/admin';
const API_PATH   = '/api';

// get user config
var config = require(CONFIG_DIR + '/base');

// setup mongoose
////////////////////////////////////////////////////////////////////////////////

// set models
mongoose.model('Channel'          , require(BROADCAST_DIR + '/domain/channel'));
mongoose.model('ChannelSet'       , require(BROADCAST_DIR + '/domain/channel-set'));
mongoose.model('ConfiguredChannel', require(BROADCAST_DIR + '/domain/configured-channel'));

// get models
var Channel           = mongoose.model('Channel');
var ChannelSet        = mongoose.model('ChannelSet');
var ConfiguredChannel = mongoose.model('ConfiguredChannel');

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

// retrieves a channel set and cylces through its channels
app.get('/channel-sets/:slug.json', function (req, res) {
  // attempt to find a channel set by the slug parameter in the url
  api.channelSet.read({ slug: req.params.slug}, function (response) {
    res.send(response.channelSet);
  });
});
app.get('/channel-sets/:slug', function (req, res) {
  res.render('channel-set');
});

// private routes
////////////////////////////////////////////////////////////////////////////////

// lists all channels and channel sets
app.get('/admin', function (req, res) {
  res.render('admin/index', { layout: 'admin/layout' });
});

// lists all channel sets or a views single channel set
app.get('/admin/channel-sets/', function (req, res) {
  api.channel.read(function (response) {
    var channels = response.channels;
    
    api.channelSet.read(function (response) {
      ChannelSet.find(function (err, channelSets) {
        res.render('admin/channel-sets/index', {
          layout: 'admin/layout',
          channelSets: response.channelSets,
          channels: channels
        });
      });
    });
  });
});

// creates a channel set
app.get('/admin/channel-sets/create', function (req, res) {
  api.channel.read(function (response) {
    res.render('admin/channel-sets/create', {
      layout: 'admin/layout',
      channels: response.channels
    });
  });
});
app.post('/admin/channel-sets/create', function (req, res) {
  var input = req.body;
  
  // format channels data into usable array
  var channels = [];
  for (var i = 0, j = input.channels.length; i < j; i++) {
    channels.push({
      ref: input.channels[i],
      timeout: input.timeouts[i]
    });
  }
  
  api.channelSet.create({
    title: input.title,
    channels: channels
  }, function (response) {
    // redirect back to the listing page
    res.redirect('/admin/channel-sets/');
  });
});

// removes a channel set
app.get('/admin/channel-sets/remove', function (req, res) {
  api.channelSet.delete(req.query.id, function (response) {
    res.redirect('/admin/channel-sets/');
  });
});
app.post('/admin/channel-sets/remove', function (req, res) {
  api.channelSet.delete(req.body.id, function (response) {
    res.redirect('/admin/channel-sets/');
  });
});

// updates a channel set
app.get('/admin/channel-sets/update', function (req, res) {
  api.channel.read(function (response) {
    var channels = response.channels;
    
    api.channelSet.read({ _id: req.query.id }, function (response) {
      res.render('admin/channel-sets/update', {
        layout: 'admin/layout',
        channelSet: response.channelSet,
        channels: channels
      });
    });
  });
});
app.post('/admin/channel-sets/update', function (req, res) {
  var input = req.body;
  
  // TODO: throw error if ids length isn't equal to delays length
  // create a new list of configured channels
  var channels = [],
      thisChannel;
  for (var i = 0, j = input.channels.length; i < j; i++) {
    thisChannel = {
      ref: input.channels[i],
      timeout: input.timeouts[i]
    };
    
    channels.push(thisChannel);
  }
  
  api.channelSet.update({
    id: input.id,
    title: input.title,
    channels: channels
  }, function (response) {
    res.redirect('/admin/channel-sets/update?id=' + input.id);
  });
});

// lists all channels or a views single channel
app.get('/admin/channels/', function (req, res) {
  api.channel.read(function (response) {
    res.render('admin/channels/index', {
      layout: 'admin/layout',
      channels: response.channels
    });
  });
});

// creates a channel
app.get('/admin/channels/create', function (req, res) {
  res.render('admin/channels/create', { layout: 'admin/layout' });
});
app.post('/admin/channels/create', function (req, res) {
  var input = req.body;
  
  // TODO: Validation!!!
  api.channel.create(input, function (response) {
    // redirect back to the listing page
    res.redirect('/admin/channels/');
  });
});

// removes a channel
app.get('/admin/channels/remove', function (req, res) {
  api.channel.delete(req.query.id, function (response) {
    res.redirect('/admin/channels/');
  });
});
app.post('/admin/channels/remove', function (req, res) {
  api.channel.delete(req.body.id, function (response) {
    res.redirect('/admin/channels/');
  });
});

// updates a channel
app.get('/admin/channels/update', function (req, res) {
  api.channel.read(req.query.id, function (response) {
    res.render('admin/channels/update', {
      layout: 'admin/layout',
      channel: response.channel
    });
  });
});
app.post('/admin/channels/update', function (req, res) {
  var input = req.body;
  
  api.channel.update(input, function (response) {
    console.log('response', response);
    res.redirect('/admin/channels/');
  });
});

// listen for incoming connections
app.listen(config.server.port);