const Typesense = require('typesense')

let typesenseClient = new Typesense.Client({
  'nodes': [{
    'host': '127.0.0.1', // where xxx is the ClusterID of your Typesense Cloud cluster
    'port': '8108',
    'protocol': 'http'
  }],
  'apiKey': process.env.TYPESENSE_API_KEY,
  'connectionTimeoutSeconds': 2
})

export default typesenseClient;