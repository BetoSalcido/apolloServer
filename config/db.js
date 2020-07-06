const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const connection = () => {
  mongoose.connect('mongodb://localhost:27017/clientes',{useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true})
  .then(() => {
    console.log('Connected to mongoDB');
  }).catch((err) => {
    throw err
  });
};


module.exports = connection;