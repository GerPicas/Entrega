const express = require('express');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = 8080;

app.use(express.json());

// Rutas para el manejo de productos
const productsRouter = express.Router();

// Obtener todos los productos
productsRouter.get('/', (req, res) => {
  const limit = req.query.limit || 10; // Valor por defecto de límite: 10
  fs.readFile('productos.json', 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error al leer los productos');
    } else {
      const products = JSON.parse(data);
      res.json(products.slice(0, limit));
    }
  });
});

// Obtener un producto por ID
productsRouter.get('/:pid', (req, res) => {
  const pid = req.params.pid;
  fs.readFile('productos.json', 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error al leer los productos');
    } else {
      const products = JSON.parse(data);
      const product = products.find((p) => p.id === pid);
      if (product) {
        res.json(product);
      } else {
        res.status(404).send('Producto no encontrado');
      }
    }
  });
});

// Agregar un nuevo producto
productsRouter.post('/', (req, res) => {
  const newProduct = req.body;
  newProduct.id = uuidv4(); // Generar un nuevo ID único para el producto
  fs.readFile('productos.json', 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error al leer los productos');
    } else {
      const products = JSON.parse(data);
      products.push(newProduct);
      fs.writeFile('productos.json', JSON.stringify(products), (err) => {
        if (err) {
          console.error(err);
          res.status(500).send('Error al agregar el producto');
        } else {
          res.status(201).json(newProduct);
        }
      });
    }
  });
});

// Actualizar un producto por ID
productsRouter.put('/:pid', (req, res) => {
  const pid = req.params.pid;
  const updatedProduct = req.body;
  fs.readFile('productos.json', 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error al leer los productos');
    } else {
      let products = JSON.parse(data);
      const index = products.findIndex((p) => p.id === pid);
      if (index !== -1) {
        products[index] = { ...products[index], ...updatedProduct, id: pid };
        fs.writeFile('productos.json', JSON.stringify(products), (err) => {
          if (err) {
            console.error(err);
            res.status(500).send('Error al actualizar el producto');
          } else {
            res.json(products[index]);
          }
        });
      } else {
        res.status(404).send('Producto no encontrado');
      }
    }
  });
});

// Eliminar un producto por ID
productsRouter.delete('/:pid', (req, res) => {
  const pid = req.params.pid;
  fs.readFile('productos.json', 'utf8', (err, data) => {})
})