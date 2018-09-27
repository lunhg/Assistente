const path = require('path');
const favicon = require('serve-favicon');
const compress = require('compression');
const cors = require('cors');
const helmet = require('helmet');
const logger = require('winston');
const feathers = require('@feathersjs/feathers');
const configuration = require('@feathersjs/configuration');
const express = require('@feathersjs/express');
const middleware = require('./middleware');
const services = require('./services');
const appHooks = require('./app.hooks');
const fs = require('fs');
const mongoose = require('./mongoose');
const authentication = require('./authentication');
const swagger = require('feathers-swagger');

// # Feathers
// [Feathers](https://feathersjs.com/) is a framework that have a nice
// paradigm on bootstrap a express.js server application.
const app = express(feathers());

// # Configuration
// Load app configuration with
// a customization of official @feathersjs/configuration
// (see [package.json](../package.json) for more) 
app.configure(configuration());

// Reconfigure public/index.html

// specify the views directory
app.set('views', path.join(__dirname, 'views'));
app.set('assets', path.join(__dirname, 'assets'));
app.set('public', path.join(__dirname, '..', 'public')); 
app.set('view engine', 'tml');

let auth = app.get('authentication');
auth.telegram.admins = auth.telegram.admins.split(' ');
app.set('authentication', auth);


// Enable CORS, security, compression, favicon and body parsing
app.use(cors());
app.use(helmet());
app.use(compress());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(favicon(path.join(app.get('public'), 'favicon.ico')));

// Host the public folder
app.use(express.static(app.get('public')));
const __index__ = function(name, fn){
  let index_path = path.join(app.get('assets'), name);
  fs.readFile(index_path, function(err, data){
    if(err) {
      logger.debug(err);
      fn(err);
    } else {
      logger.debug('Sending '+index_path);
      fn(data);
    }
  });
};

// The index.html, bundle.js and bundle.css are build with Vue
app.get('/', function(req, res){
  __index__('index.html', function(data){
    res.send(data);
  });
});

app.get('/assets/js/bundle.js', function(req, res){
  __index__('public/bundle.js', function(data){
    res.send(data);
  });
});

app.get('/assets/css/bundle.css', function(req, res){
  __index__('public/bundle.css', function(data){
    res.send(data);
  });
});

// Configure Swagger Api
const _swagger_ = app.get('swagger');
_swagger_['uiIndex'] = path.join(__dirname, '..', _swagger_['uiIndex']);
app.configure(swagger(_swagger_));
    
// Set up Plugins and providers
app.configure(express.rest());
app.configure(mongoose);

// Configure other middleware (see `middleware/index.js`)
app.configure(middleware);
app.configure(authentication);

// Set up our services (see `services/index.js`)
app.configure(services);

// Configure a middleware for 404s and the error handler
app.use(express.notFound());
app.use(express.errorHandler({ logger }));
app.hooks(appHooks);

// Go
module.exports = app;
