var path = require('path');

var express = require('../../../node_modules/express'),
    nib     = require('../../../node_modules/nib'),
    stylus  = require('../../../node_modules/stylus');

var config = require('../../../config/base'),
    PUBLIC_DIR = path.normalize(__dirname + '../../../../public'),
    VIEWS_DIR  = path.normalize(__dirname + '../../../../views');

var server = module.exports = {
  init: function () {
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
      
      app.use(express.static(PUBLIC_DIR));
    });
    
    // export the app
    server.app = app;
  },
  listen: function () {
    server.app.listen(config.server.port);
  },
  app: null
};
