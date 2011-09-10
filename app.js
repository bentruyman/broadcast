var express  = require('./node_modules/express'),
    faye     = require('./node_modules/faye'),
    mongoose = require('./node_modules/mongoose'),
    stylus   = require('./node_modules/stylus');

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

// connect to the database
mongoose.connect(config.database.host, config.database.name);

// create the app server
var app = express.createServer();

// configure the app server
app.configure(function () {
  app.set('views', VIEWS_DIR);
  app.set('view engine', 'jade');
  
  app.use(stylus.middleware({
    src: VIEWS_DIR,
    dest: PUBLIC_DIR,
    compress: true
  }));
});

// public routes

// list all channel sets by label
app.get('/', function (req, res) {
  
});

// retrieves a channel set and cylces through its channels
app.get('/:slug', function (req, res) {
  
});

// private routes

// lists all channels and channel sets
app.get('/admin', function (req, res) {
  
});

// lists all channel sets or a views single channel set
app.get('/admin/channel-sets', function (req, res) {
  
});

// creates a channel set
app.post('/admin/channel-sets/create', function (req, res) {
  
});

// removes a channel set
app.post('/admin/channel-sets/remove', function (req, res) {
  
});

// updates a channel set
app.post('/admin/channel-sets/update', function (req, res) {
  
});

// deletes a channel set
app.post('/admin/channel-sets/delete', function (req, res) {
  
});

// lists all channels or a views single channel
app.get('/admin/channels', function (req, res) {
  
});

// creates a channel
app.post('/admin/channels/create', function (req, res) {
  
});

// removes a channel
app.post('/admin/channels/remove', function (req, res) {
  
});

// updates a channel
app.post('/admin/channels/update', function (req, res) {
  
});

// deletes a channel
app.post('/admin/channels/delete', function (req, res) {
  
});
