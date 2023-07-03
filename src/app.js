const express = require('express');
const mongoose = require('mongoose');
const hbs = require('hbs');
const productsRouter = require('./dao/productsRouter');
const cartsRouter = require('./dao/cartsRouter');

mongoose.connect('mongodb://localhost:27017/ecommerce', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('Conexión a MongoDB establecida'))
  .catch((err) => console.error('Error al conectar con MongoDB:', err));

const app = express();
app.use(express.json());
app.set('view engine', 'hbs');

app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);

