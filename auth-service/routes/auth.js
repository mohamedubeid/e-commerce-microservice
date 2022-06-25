
const express = require('express');
const router = express.Router();
const { signToken } = require('../utils/jwt');
const { comparePasswords, hashPassword } = require('../utils/b-crypt');
const User = require('../models/User');
const { rabbitMQConnection } = require('../utils/rabbitMQ-connect');

const amqpServer = "amqp://localhost:5672";
const queue_name = "USERS";
const object1 = {};
(async () => {
    const channel = await rabbitMQConnection(amqpServer, queue_name);
    Object.defineProperty(object1, 'channel', {
        value: channel,
        writable: false
    });
})();

router.post('/login',
    async (req, res) => {
        const { email, password } = req.body;
        try {
            const user = await User.findAll({
                where: {
                    email: email,
                    isActive: true
                }
            });
            if (user.length === 0) {
                return res.status(404).json({ message: "User doesn't exit" });
            }
            const checkPassword = await comparePasswords(password, user[0].dataValues.password);
            if (checkPassword) {
                const SECRET_KEY = process.env.TOKEN_SECRET_KEY;
                const accessToken = await signToken(user[0].dataValues.id + "", SECRET_KEY);
                return res.status(200).send({ message: "Logged In!", token: accessToken })
            } else {
                return res.status(401).send({ message: "Bad Credentials" });
            }
        } catch (error) {
            return res.status(401).json(error);
        }
    })


router.post('/register',
    async (req, res) => {
        const { email, password, name } = req.body;
        try {
            const user = await User.findAll({
                where: {
                    email: email
                }
            });
            if (user.length > 0) {
                return res.status(409).send({ msg: "user is already exist" });
            }
            const hashedPassword = await hashPassword(password);
            const newUser = await User.create({ name, email, password: hashedPassword });
            const payload = {
                event: "add user",
                user_id: newUser.id,
            }
            const message = JSON.stringify(payload);
            object1.channel.sendToQueue(queue_name, Buffer.from(message), {
                persistent: true
            });
            return res.status(201).json(newUser);
        } catch (error) {
            return res.status(500).json(error);
        }
    }
);

router.delete('/user/:id',
    async (req, res) => {
        const user_id = parseInt(req.params.id);
        try {
            const user = await User.findAll({
                where: {
                    id: user_id,
                    isActive: true
                }
            });
            if (user.length === 0) {
                return res.status(404).send({ msg: "user does not exist" });
            }
            await User.update({ isActive: false }, {
                where: {
                    id: user_id
                }
            });
            const payload = {
                event: "delete user",
                user_id
            }
            const message = JSON.stringify(payload);
            object1.channel.sendToQueue(queue_name, Buffer.from(message), {
                persistent: true
            });
            return res.status(202).json({ msg: "User Deactivated Successfully" })
        } catch (error) {
            return res.status(500).json(error);
        }
    });


module.exports = router;
