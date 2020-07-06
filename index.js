const { ApolloServer } = require('apollo-server');
const typeDefs = require('./db/schema');
const resolvers = require('./db/resolvers');
const connectionDB = require('./config/db');
const jwt = require('jsonwebtoken');
require('dotenv').config({path: 'variables.env'});

//MongoDB
connectionDB();

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context:({req}) => {
    //console.log(req.headers['authorization']);
    const token = req.headers['authorization'] || "";
    if (token) {
      try {
        const user = jwt.verify(token, process.env.SECRET_KEY_TOKEN)
        return {user};
      } catch (error) {
        console.log(error);
      }
    }

  }
});

//Server
server.listen().then(( {url} ) => {
  console.log("Server listen on port: " + url);
});