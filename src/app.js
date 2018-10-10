
// Configure Feathers app. (Can be re-generated.)
const path = require('path');
const favicon = require('serve-favicon');
const compress = require('compression');
const cors = require('cors');
const helmet = require('helmet');
const logger = require('./logger');
const feathers = require('@feathersjs/feathers');
const configuration = require('@feathersjs/configuration');
const express = require('@feathersjs/express');
const middleware = require('./middleware');
const services = require('./services');
const appHooks = require('./app.hooks');
const channels = require('./channels');
const generatorSpecs = require('../feathers-gen-specs.json');
// !code: imports
const redis = require('redis');
const session = require('express-session');
const RedisStore = require('connect-redis')(session);
// !end


logger.debug('Preparing feathers')
const app = express(feathers());
// !code: use_start // !end

// Load app configuration
app.configure(configuration());
// !<DEFAULT> code: init_config
app.set('generatorSpecs', generatorSpecs);
// !end

// !code: init
logger.debug('Preparing redis')
const client = redis.createClient({
  host: process.env[app.get('redis').host],
  port: process.env[app.get('redis').port],
});

client.on('ready', function(){
    logger.debug('Redis ready');
});

client.on('connected', function(){
    logger.debug('Redis connected')
})
// !end

// !code security_CORS_compression_favicon_bodyParsing_session
app.use(helmet());
app.use(cors());
app.use(session({
  secret: process.env[app.get('secret')],
  store: new RedisStore({
    client: client,
    ttl: 260
  }),
  saveUninitialized: false,
  resave: false
}));
app.use(compress());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(favicon(path.join(app.get('public'), 'favicon.ico')));
// Host the public folder
app.use('/', express.static(app.get('public')));
// !code: use_end // !end

// Set up Plugins and providers
// !code: config_start // !end
app.configure(express.rest(
  // !code: express_rest // !end
));

// Configure other middleware (see `middleware/index.js`)
app.configure(middleware);
// Set up our services (see `services/index.js`)
app.configure(services);
// Set up event channels (see channels.js)
app.configure(channels);
// !code: config_middle // !end

// Configure a middleware for 404s and the error handler
app.use(express.notFound());
app.use(express.errorHandler({ logger }));
// !code: config_end // !end

app.hooks(appHooks);

const moduleExports = app;
// !code: exports // !end
module.exports = moduleExports;

// !code: funcs // !end
// !code: end // !end
