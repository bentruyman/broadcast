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

// routes
////////////////////////////////////////////////////////////////////////////////
var ctx = {
  api: api,
  app: app,
  VIEWS_DIR: VIEWS_DIR
};

require('./routes/api')(ctx);
require('./routes/index')(ctx);
require('./routes/tuner')(ctx);
require('./routes/admin')(ctx);
require('./routes/misc')(ctx);
require('./routes/error')(ctx);

// listen for incoming connections
app.listen(config.server.port);
