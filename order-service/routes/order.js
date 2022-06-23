require('dotenv').config()
const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Activate_User = require('../models/Activate_User');
const checkToken = require('../middleware/checkToken');


router.post('/',
    checkToken,
    async (req, res) => {
        const { products, total_price } = req.body;
        const user = req.user
        try {
            const isUserExist = await Activate_User.findAll({
                where: {
                    user_id: user,
                }
            });
            if (isUserExist.length === 0) {
                return res.status(404).json({ message: "User doesn't exit" })
            }
            const newOrder = await Order.create({ user_id: user, products, total_price });
            return res.status(201).json(newOrder);
        } catch (error) {
            return res.status(500).send(error);
        }
    }
);



module.exports = router;
