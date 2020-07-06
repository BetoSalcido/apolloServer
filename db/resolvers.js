const User = require('../models/users');
const Product = require('../models/products');
const Client = require('../models/clients');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config({path: 'variables.env'});

const createToken = (user, secretKey, expiresIn) => {
  const {_id, name, lastName, email} = user;
  return jwt.sign({_id, name , lastName, email}, secretKey, {expiresIn})
};

//Resolvers
const resolvers = {
  Query: {
    getUser: async (_, {token}) => {
      const userId = await jwt.verify(token, process.env.SECRET_KEY_TOKEN);
      return userId;
    },
    getProducts: async () => {
      try {
        const products = await Product.find({});
        return products;
      } catch (error) {
        console.log(error);
      }
    },
    getProduct: async (_,{id}) => {
      const product = await Product.findById(id);
      if (product) {
        return product;
      } else {
        throw new Error("The product does not exist");
      }
    },
    getClients: async () => {
      try {
        const clients = await Client.find({});
        return clients;
      } catch (error) {
        console.log(error);
      }
    },
    getClientsFromSeller: async (_,{}, ctx) => {
      try {
        const clients = await Client.find({seller: ctx.user._id.toString()});
        return clients;
      } catch (error) {
        console.log(error);
      }
    },
    getClient: async (_,{id}, ctx) => {
      try {
        const client = await Client.findById(id);
        if (!client) {
          throw new Error("The client does not exist");
        }

        if (client.seller.toString() !== ctx.user._id.toString()) {
          throw new Error("Invalid credentials");
        }

        return client;

      } catch (error) {
        throw new Error(error);
      }
    }
   },
  Mutation: {
    newUser: async (_, {data}) => {
      const {email, password} = data;
      const userExist = await User.findOne({email});

      if (userExist) {
        throw new Error("The user already exist");

      } else {
        const salt = await bcryptjs.genSaltSync(10);
        data.password = await bcryptjs.hashSync(password, salt);

        try {
          const user = new User(data);
          user.save();
          return user;

        } catch (error) {
          console.log(error)
        }
      }
    },
    authenticateUser: async (_, {data}) => {
      const {email, password} = data;
      const userExist = await User.findOne({email});

      if (userExist) {
        const correctPassword = await bcryptjs.compare(password, userExist.password);
        if (correctPassword) {
          return {
            token: createToken(userExist, process.env.SECRET_KEY_TOKEN, '24h')
          }
        } else {
          throw new Error("The data is incorrect");
        }
      } else {
        throw new Error("The user does not exist");
      }

    },
    newProduct: async (_, {data} ) => {
      try {
        const newProduct = new Product(data);
        const response = await newProduct.save();
        return response

      } catch (error) {
        console.log(error)
      }
    },
    updateProduct: async (_,{id, data}) => {
      try {
        let product = await Product.findById(id);
        if (product) {
          product = await Product.findOneAndUpdate({_id: id}, data, {new: true});
          return product;
        } else {
          throw new Error("The product does not exist");
        }

      } catch (error) {
        console.log(error);
      }
    },
    deleteProduct: async (_, {id}) => {
      let product = await Product.findById(id);
      if (product) {
        product = await Product.findOneAndDelete({_id: id});
        return "Product deleted successfully"
      } else {
        throw new Error("The product does not exist");
      }
    },
    newClient: async (_, {data}, ctx) => {
      const {email} = data;
      const clientExist = await Client.findOne({email});

      if (clientExist) {
        throw new Error("The client already exist");

      } else {
        const newClient = new Client(data);
        newClient.seller = ctx.user._id

        try {
          const response = await newClient.save()
          return response;

        } catch (error) {
          console.log(error)
        }
      }
    },
    updateClient: async (_,{id,data}, ctx) => {
        let client = await Client.findById(id);
        if (!client) {
          throw new Error("The client does not exist");
        }

        if (client.seller.toString() !== ctx.user._id.toString()) {
          throw new Error("Invalid credentials");
        }

        client = await Client.findOneAndUpdate({_id: id}, data, {new: true});
        return client;

    },
    deleteClient: async (_, {id}, ctx) => {
      let client = await Client.findById(id);

      if (!client) {
        throw new Error("The client does not exist");
      }

      if (client.seller.toString() !== ctx.user._id.toString()) {
        throw new Error("Invalid credentials");
      }

      client = await Client.findOneAndDelete({_id: id});
      return "Client deleted successfully"
    },
  }
};

module.exports = resolvers;