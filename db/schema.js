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

  type Product {
    _id: ID
    name: String
    inventory: Int
    price: Float
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

  input ProductInput {
    name: String!
    inventory: Int!
    price: Float!
  }

  input AuthenticateInput {
    email: String!
    password: String!
  }

  type Query {
    # Users
    getUser(token: String!) : User

    #Products
    getProducts: [Product]
    getProduct(id: ID!) : Product
  }

  type Mutation {
    # Users
    newUser(data: UserInput) : User
    authenticateUser(data: AuthenticateInput) : Token

    # Products
    newProduct(data: ProductInput) : Product
    updateProduct(id: ID!, data: ProductInput) : Product
    deleteProduct(id: ID!) : String
  }
`;

module.exports = typeDefs;