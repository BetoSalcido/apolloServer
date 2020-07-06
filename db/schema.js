const { gql } = require('apollo-server');
//Schema
const typeDefs = gql`
  type User {
    _id: ID
    name: String
    lastName: String
    email: String
    created: String
  }

  type Token {
    token: String
  }

  input UserInput {
    name: String!
    lastName: String!
    email: String!
    password: String!
  }

  input AuthenticateInput {
    email: String!
    password: String!
  }

  type Query {
    getUser(token: String!) : User
  }

  type Mutation {
    newUser(data: UserInput) : User
    authenticateUser(data: AuthenticateInput) : Token
  }
`;

module.exports = typeDefs;