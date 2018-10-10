// !code: imports
const axios = require('axios');
const graphql = require('graphql')
const GraphQLSchema = graphql.GraphQLSchema;
const GraphQLObjectType = graphql.GraphQLObjectType;
const GraphQLString = graphql.GraphQLObjectType;
// !end

// !code: download_raw_command
const downloadRawCmd = function(url, branch, cmd){
  let url = `https://www.gitlab.com/${url}/raw/${__fields__.branch}/${cmd}.yml`
  return axios.get(url).then(function(res){
    return yaml.parse(res.data[0]);
  });
}
// !end

// !code: graphql
const graphqlfy = function(decoded){
  // !code: generate_graphql
  console.log('==> Generating graphql');
  const __fields__ = {};
  decoded.data.commands.forEach(function(e, i){
    __fields__[e] = {};
    __fields__[e].type = GraphQLString;
    __fields__[e].resolve = function (){
      return downloadRawCmd(decoded.data.repo, decoded.data.branch, e);
    };
  });
  decoded.data.schema = new GraphQLSchema({
    query: new GraphQLObjectType({
      name: 'BotQueryType',
      fields: __fields__
    })
  });
  return decoded;
  // !end
};
// !end

// !code: jwt_verify
const __jwt_verify__ = function(req, name, secret) {
  return new Promise(function(resolve, reject){
    let header = req.headers[name] ? req.headers[name] : false;
    let regexp = /[0-9]+\:[a-zA-Z\_\-]+/g;
    if(!header) {
      let msg = `No ${name} provided in headers`;
      let err = new Error(msg);
      reject(err);
    }
    else if (!header.match(regexp)){
      let msg = `Invalid ${name} header`;
      let err = new Error(msg);
      reject(err);  
    }
    let onVerify = function(err, decoded){
      if(err) reject(err);
      resolve(decoded);
    };
    jwt.verify(header, secret, onVerify);
  });
};
// !end

// !code exports
module.exports = [
  // !code: auth_telegram_middleware
  function(req, res, next){

    // Verify if telegram have a jwt containing specific data for graphql and commands
    if (!req.headers['jwt-tg-bot']) next(new Error('No Auth Token'));

    // !code: jwt_verify
    let name = process.env.JWT_SESSION_NAME;
    let id = '';
    let onVerified = function(decoded){
      id = decoded.data._id;
      delete decoded.data._id
      if (!req.session[id]) {  
        req.session[id] = '';
      }
      return decoded; 
    };
    let onCreateJWTArgs = function(decoded){
      let __auth__ = app.get('authentication');
      let __expiresIn__ = __auth__.jwt.headers.expiresIn;
      let s = __expiresIn__.seconds;
      let min = __expiresIn__.minutes;
      let hour = __expiresIn__.hours;
      let days = __expiresIn__.days;
      let expiresIn = (Math.floor(Date.now()) / 1000) * s * min * hour * days;
      return [
        decoded,
        req.headers[name],
        { expiresIn: expiresIn }
      ];
    };
    let onSignJWT = function(__args__){
      req.session[id] = jwt.sign(...__args__);
    };
    __jwt_verify__(req, name)
        .then(onVerified)
        .then(graphqlify)
        .then(onCreateJWTArgs)
        .then(onSignJWT)
        .then(next)
        .catch(next);
    // !end
  }
  // !end
];
// !end
