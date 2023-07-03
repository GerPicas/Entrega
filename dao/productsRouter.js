// En dao/productsRouter.js
const express = require('express');
const ProductModel = require('./models/productModel');

const productsRouter = express.Router();

// Rutas para productos
productsRouter.get('/', (req, res) => {
    let limit = req.query.limit || 10; // Valor por defecto: 10
    limit = parseInt(limit);

    ProductModel.find().limit(limit)
        .then((productos) => res.json(productos))
        .catch((err) => {
            console.error(err);
            res.status(500).json({ error: 'Error al leer los productos' });
        });
});

productsRouter.get('/:pid', (req, res) => {
    const pid = req.params.pid;

    ProductModel.findById(pid)
        .then((producto) => {
            if (!producto) {
                res.status(404).json({ error: 'Producto no encontrado' });
            } else {
                res.json(producto);
            }
        })
        .catch((err) => {
            console.error(err);
            res.status(500).json({ error: 'Error al buscar el producto' });
        });
});

productsRouter.post('/', (req, res) => {
    const {
        title,
        description,
        code,
        price,
        status = true,
        stock,
        category,
        thumbnails = [],
    } = req.body;

    const newProduct = new ProductModel({
        title,
        description,
        code,
        price,
        status,
        stock,
        category,
        thumbnails,
    });

    newProduct.save()
        .then((product) => res.json(product))
        .catch((err) => {
            console.error(err);
            res.status(500).json({ error: 'Error al agregar el producto' });
        });
});

productsRouter.put('/:pid', (req, res) => {
    const pid = req.params.pid;

    ProductModel.findByIdAndUpdate(pid, req.body, { new: true })
        .then((updatedProduct) => {
            if (!updatedProduct) {
                res.status(404).json({ error: 'Producto no encontrado' });
            } else {
                res.json(updatedProduct);
            }
        })
        .catch((err) => {
            console.error(err);
            res.status(500).json({ error: 'Error al actualizar el producto' });
        });
});

productsRouter.delete('/:pid', (req, res) => {
    const pid = req.params.pid;

    ProductModel.findByIdAndDelete(pid)
        .then((deletedProduct) => {
            if (!deletedProduct) {
                res.status(404).json({ error: 'Producto no encontrado' });
            } else {
                res.json({ message: 'Producto eliminado exitosamente' });
            }
        })
        .catch((err) => {
            console.error(err);
            res.status(500).json({ error: 'Error al eliminar el producto' });
        });
});

module.exports = productsRouter;
