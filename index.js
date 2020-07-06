const { ApolloServer } = require('apollo-server');
const typeDefs = require('./db/schema');
const resolvers = require('./db/resolvers');
const connectionDB = require('./config/db');


//MongoDB
connectionDB();

const server = new ApolloServer({
  typeDefs,
  resolvers
});

//Server
server.listen().then(( {url} ) => {
  console.log("Server listen on port: " + url);
});