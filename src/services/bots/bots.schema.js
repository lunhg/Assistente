
// Define the Feathers schema for service `bots`. (Can be re-generated.)
// !code: imports // !end
// !code: init // !end

// Define the model using JSON-schema
let schema = {
  // !<DEFAULT> code: schema_header
  title: 'Bots',
  description: 'Bots database.',
  // !end
  // !code: schema_definitions // !end

  // Required fields.
  required: [
    // !code: schema_required
    'apiKey',
    'src',
    'name'
    // !end
  ],
  // Fields with unique values.
  uniqueItemProperties: [
    // !code: schema_unique
    'apiKey',
    'name'
    // !end
  ],

  // Fields in the model.
  properties: {
    // !code: schema_properties
    'apiKey',
    'src',
    'name'
    // !end
  },
  // !code: schema_more // !end
};

// Define optional, non-JSON-schema extensions.
let extensions = {
  // GraphQL generation.
  graphql: {
    // !code: graphql_header
    name: 'Bots',
    service: {
      sort: { _id: 1 },
    },
    // sql: {
    //   sqlTable: 'Bots',
    //   uniqueKey: '_id',
    //   sqlColumn: {
    //     __authorId__: '__author_id__',
    //   },
    // },
    // !end
    discard: [
      // !code: graphql_discard
      'apiKey'
      // !end
    ],
    add: {
      // !<DEFAULT> code: graphql_add
      __author__: { type: '__User__!', args: false, relation: { ourTable: '__authorId__', otherTable: '_id' } },
      apiKey:{ type: 'String', args: false},
      name:{ type: 'String', args: true},
      src:{ type: 'String', args: true}
      // !end
    },
    // !code: graphql_more // !end
  },
};

// !code: more // !end

let moduleExports = {
  schema,
  extensions,
  // !code: moduleExports // !end
};

// !code: exports // !end
module.exports = moduleExports;

// !code: funcs // !end
// !code: end // !end
