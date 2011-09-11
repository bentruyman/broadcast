// TODO: handle errors, especially mongo and "not found" errors
var express  = require('./node_modules/express'),
    faye     = require('./node_modules/faye'),
    mongoose = require('./node_modules/mongoose'),
    nib      = require('./node_modules/nib'),
    stylus   = require('./node_modules/stylus'),
    Q        = require('qq');

const BROADCAST_DIR = __dirname + '/lib/broadcast';
const CONFIG_DIR    = __dirname + '/config';
const PUBLIC_DIR    = __dirname + '/public';
const VIEWS_DIR     = __dirname + '/views';

// get user config
var config = require(CONFIG_DIR + '/base');

// set models
mongoose.model('Channel'          , require(BROADCAST_DIR + '/domain/channel'));
mongoose.model('ChannelSet'       , require(BROADCAST_DIR + '/domain/channel-set'));
mongoose.model('ConfiguredChannel', require(BROADCAST_DIR + '/domain/configured-channel'));

// get models
var Channel = mongoose.model('Channel');
var ChannelSet = mongoose.model('ChannelSet');
var ConfiguredChannel = mongoose.model('ConfiguredChannel');

// connect to the database
mongoose.connect(config.database.host, config.database.name);

// create the app server
var app = express.createServer();

// configure the app server
app.configure(function () {
  app.set('views', VIEWS_DIR);
  app.set('view engine', 'jade');
  
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

// list all channel sets by label
app.get('/', function (req, res) {
  // retrieve all channel sets
  ChannelSet.find(function (err, channelSets) {
    if (!err) {
      res.render('index', { channelSets: channelSets });
    }
  });
});

// retrieves a channel set and cylces through its channels
app.get('/channel-sets/:slug.json', function (req, res) {
  // attempt to find a channel set by the slug parameter in the url
  ChannelSet
    .findOne({ slug: req.params.slug })
    .populate('channels.channel')
    .run(function (err, channelSet) {
      if (!err) {
        res.send(channelSet);
      }
    });
});
app.get('/channel-sets/:slug', function (req, res) {
  res.render('channel-set');
});

// private routes

// lists all channels and channel sets
app.get('/admin', function (req, res) {
  
  res.render('admin/index', { layout: 'admin/layout' });
});

// lists all channel sets or a views single channel set
app.get('/admin/channel-sets/', function (req, res) {
  Channel.find(function (err, channels) {
    ChannelSet.find(function (err, channelSets) {
      res.render('admin/channel-sets/index', {
        layout: 'admin/layout',
        channelSets: channelSets,
        channels: channels
      });
    });
  });
});

// creates a channel set
app.get('/admin/channel-sets/create', function (req, res) {
  
});
app.post('/admin/channel-sets/create', function (req, res) {
  var input = req.body;
  
  // TODO: throw error if ids length isn't equal to delays length
  // create a new list of configured channels
  var channels = [];
  for (var i = 0, j = input.channels.length; i < j; i++) {
    channels.push({
      channel: input.channels[i],
      timeout: input.timeouts[i]
    });
  }
  
  ChannelSet.create({
    label: input.label,
    slug: input.slug,
    channels: channels
  }, function (err) {
    // redirect back to the listing page
    res.redirect('/admin/channel-sets/');
  });
});

// removes a channel set
app.get('/admin/channel-sets/remove', function (req, res) {
  // TODO: handle invalid id, or lack thereof
  ChannelSet.remove({ _id: req.query.id }, function (err) {
    res.redirect('/admin/channel-sets/');
  });
});
app.post('/admin/channel-sets/remove', function (req, res) {
  // TODO: handle invalid id, or lack thereof
  ChannelSet.remove({ _id: req.body.id }, function (err) {
    res.redirect('/admin/channel-sets/');
  });
});

// updates a channel set
app.get('/admin/channel-sets/update', function (req, res) {
  // TODO: handle invalid id, or lack thereof
  
  Channel.find(function (err, channels) {
    ChannelSet
      .findById(req.query.id)
      .populate('channels.channel')
      .run(function (err, channelSet) {
        res.render('admin/channel-sets/update', {
          layout: 'admin/layout',
          channelSet: channelSet,
          channels: channels
        });
      });
  });
});
app.post('/admin/channel-sets/update', function (req, res) {
  var input = req.body;
  
  // TODO: Validation!!!
  
  // TODO: throw error if ids length isn't equal to delays length
  // create a new list of configured channels
  var channels = [],
      thisChannel;
  for (var i = 0, j = input.channels.length; i < j; i++) {
    thisChannel = {
      channel: input.channels[i],
      timeout: input.timeouts[i]
    };
    
    channels.push(thisChannel);
  }
  
  ChannelSet.findById(input.id, function (err, channelSet) {
    channelSet.label = input.label;
    channelSet.slug  = input.slug;
    
    channelSet.updateChannels(channels, function (err) {
      res.redirect('/admin/channel-sets/update?id=' + input.id);
    });
  });
});

// lists all channels or a views single channel
app.get('/admin/channels/', function (req, res) {
  // fetch channels sorted by their index in ascending order
  Channel
    .find()
    .sort('index', 1)
    .run(function (err, channels) {
    res.render('admin/channels/index', {
      layout: 'admin/layout',
      channels: channels
    });
  });
});

// creates a channel
app.get('/admin/channels/create', function (req, res) {
  
});
app.post('/admin/channels/create', function (req, res) {
  var input = req.body;
  
  // TODO: Validation!!!
  Channel.create(input, function (err) {
    // redirect back to the listing page
    res.redirect('/admin/channels/');
  });
});

// removes a channel
app.get('/admin/channels/remove', function (req, res) {
  // TODO: handle invalid id, or lack thereof
  Channel.remove({ _id: req.query.id }, function (err) {
    res.redirect('/admin/channels/');
  });
});
app.post('/admin/channels/remove', function (req, res) {
  // TODO: handle invalid id, or lack thereof
  Channel.remove({ _id: req.body.id }, function (err) {
    res.redirect('/admin/channels/');
  });
});

// updates a channel
app.get('/admin/channels/update', function (req, res) {
  // TODO: handle invalid id, or lack thereof
  Channel.findById(req.query.id, function (err, channel) {
    res.render('admin/channels/update', {
      layout: 'admin/layout',
      channel: channel
    });
  });
});
app.post('/admin/channels/update', function (req, res) {
  var input = req.body;
  
  if (input.timeout === null) {
    delete input.timeout;
  }
  
  // TODO: Validation!!!
  Channel.update({ _id: input.id }, input, function (err) {
    res.redirect('/admin/channels/');
  });
});

// listen for incoming connections
app.listen(config.server.port);
