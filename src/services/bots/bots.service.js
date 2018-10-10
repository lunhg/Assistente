
// Initializes the `bots` service on path `/bots`. (Can be re-generated.)
const createService = require('./bots.class');
const hooks = require('./bots.hooks');
// !code: imports
const jwt = require('jsonwebtoken');
const middlewares = require('./bots.middlewares')
// !end

// !code: init // !end

let moduleExports = function (app) {

  let paginate = app.get('paginate');
  // !code: func_init // !end

  let options = {
    paginate,
    // !code: options_more // !end
  };
  // !code: options_change // !end
   
  // !end auth_telegram_middleware
  // Initialize our service with any options it requires
  app.use('/bots', ...middlewares, createService(options));

  // Get our initialized service so that we can register hooks
  const service = app.service('bots');

  service.hooks(hooks);
  // !end

};

// !code: exports // !end
module.exports = moduleExports;

// !code: funcs // !end
// !code: end // !end
