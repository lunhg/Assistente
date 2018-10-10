// !code: imports
const axios = require('axios');
const graphql = require('graphql')
const GraphQLSchema = graphql.GraphQLSchema;
const GraphQLObjectType = graphql.GraphQLObjectType;
const GraphQLString = graphql.GraphQLObjectType;
const graphqlfy = function(fields){
  const FIELDS = fields;
  const __fields__ = {};

  // !code: generate_graphql
  console.log('==> Generating graphql')
  Object.keys(fields).forEach(function(k){
    __fields__[k] = {};
    __fields__[k].type = GraphQLString
    __fields__[k].resolve = function (){
      return FIELDS[k];
    };
    console.log(`  ${k}`)
  })
  return new GraphQLSchema({
    query: new GraphQLObjectType({
      name: 'SessionQueryType',
      fields: __fields__
    })
  });
  // !end
};
// !end

// !code exports
module.exports = [
  // !code: auth_telegram_middleware
  function(req, res, next){
    if (!req.headers['jwt-tg-bot']) next(new Error('No Auth Token'));
        
    // !code: jwt_verify
    jwt.verify(req.headers['jwt-tg-bot'], process.env.SECRET, function(err, decoded){
      if(err) next(err)

      // !code: session_schema 
      if (!req.session[decoded.data._id]) {
        // !code: graphql_session_schema
        Promise.all(decoded.data.commands.map(function(cmd){
          let url = decoded.data.url + '/raw/' + decoded.data.branch + '/' + cmd + '.yml';
          decoded.data.schema = {};
          return axios.get(url).then(function(result){
            decoded.data.schema[cmd] = yaml.safeLoad(result.data);
          })
        // !end
        // !code: session_jwt
        })).then(function(){ 
          let id = decoded.data._id;
          delete decoded.data._id
          let extra = {expiresIn: decoded.data.expiresIn };
          req.session[id] = jwt.sign(decoded.data, req.headers['jwt-tg-bot'], extra);
          next(); 
        // !end
        })
      }
      // !end
      next()
      

    });
    // !end
  }
  // !end
];
// !end
