require('dotenv').config();
const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Product = require('../models/Product');
const OrderProduct = require('../models/OrderProduct');
const Activate_User = require('../models/Activate_User');
const checkToken = require('../middleware/checkToken');

router.post('/', checkToken, async (req, res) => {
    const { products } = req.body;
    const user = req.user;
    try {
        const isUserExist = await Activate_User.findOne({
            where: {
                user_id: user,
            },
        });
        if (!isUserExist) {
            return res.status(404).json({ message: 'User does not exit' });
        }

        const total_price = await Product.sum('price', {
            where: { id: products },
        });
        const newOrder = await Order.create({ user_id: user, total_price });

        const order_products = [];
        products.map((product) => {
            order_products.push({
                user_id: user,
                product_id: product,
            });
        });
        await OrderProduct.bulkCreate(order_products);
        return res.status(201).json(newOrder);
    } catch (error) {
        return res.status(500).send(error);
    }
});

module.exports = router;
