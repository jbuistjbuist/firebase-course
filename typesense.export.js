//this is to configure typesense for development, should be run seperately, assumes typesense is installed locally with default options


const Typesense = require('typesense')

let client = new Typesense.Client({
  'nodes': [{
    'host': '127.0.0.1', // where xxx is the ClusterID of your Typesense Cloud cluster
    'port': '8108',
    'protocol': 'http'
  }],
  'apiKey': 'xyz',
  'connectionTimeoutSeconds': 2
})


let schema = {
  'name': 'users',
  'fields': [
    {'name': 'about', 'type': 'auto'},
    {'name': 'displayName', 'type': 'auto' },
    {'name': 'isAdmin', 'type': 'auto' },
    {'name': 'id', 'type': 'auto'},
  ],
}

//create schema and initial users respectively 

client.collections().create(schema)

client.collections('users').documents().create({about: "controlling le animals", displayName: "Animal Control", isAdmin: true, id: "7VR8WtEMU42OEaSEY9yU7W3LUsfU"})
client.collections('users').documents().create({about: "a chicken yes indeed", displayName: "Chicken Chicken", isAdmin: false, id: "hhppdE0yOO20eZA7fop0JIlhl4ks"})
client.collections('users').documents().create({about: "Panda is a bear species endemic to China. It is characterised by its bold black-and-white coat and rotund body. Though it belongs to the order Carnivora, the giant panda is a folivore, with bamboo shoots and leaves making up more than 99% of its diet. It's cool", displayName: "Peach Panda", isAdmin: false, id: "wV7ZadgO5IYWA3z6WtL5BYS7aCUm"})
client.collections('users').documents().create({about: "hi my name is otter olive and I like to swim fast", displayName: "Otter Olive", isAdmin: true, id: "6aocMkwjLAy0myqaQCUMrBwannF9"})


