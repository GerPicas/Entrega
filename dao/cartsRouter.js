// En dao/cartsRouter.js
const express = require('express');
const CartModel = require('./models/cartModel');
const ProductModel = require('./models/productModel');

const cartsRouter = express.Router();

// Rutas para carritos
cartsRouter.post('/', (req, res) => {
    const newCart = new CartModel({
        products: [],
    });

    newCart.save()
        .then((cart) => res.json(cart))
        .catch((err) => {
            console.error(err);
            res.status(500).json({ error: 'Error al crear el carrito' });
        });
});

cartsRouter.get('/:cid', (req, res) => {
    const cid = req.params.cid;

    CartModel.findById(cid)
        .populate('products.product')
        .then((cart) => {
            if (!cart) {
                res.status(404).json({ error: 'Carrito no encontrado' });
            } else {
                res.json(cart.products);
            }
        })
        .catch((err) => {
            console.error(err);
            res.status(500).json({ error: 'Error al buscar el carrito' });
        });
});

cartsRouter.post('/:cid/product/:pid', (req, res) => {
    const cid = req.params.cid;
    const pid = req.params.pid;

    CartModel.findById(cid)
        .then((cart) => {
            if (!cart) {
                res.status(404).json({ error: 'Carrito no encontrado' });
                return;
            }

            const productIndex = cart.products.findIndex((p) => p.product == pid);

            if (productIndex === -1) {
                cart.products.push({
                    product: pid,
                    quantity: 1,
                });
            } else {
                cart.products[productIndex].quantity++;
            }

            cart.save()
                .then(() => {
                    res.json(cart.products);
                })
                .catch((err) => {
                    console.error(err);
                    res.status(500).json({ error: 'Error al agregar el producto al carrito' });
                });
        })
        .catch((err) => {
            console.error(err);
            res.status(500).json({ error: 'Error al buscar el carrito' });
        });
});

module.exports = cartsRouter;
