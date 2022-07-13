require('dotenv').config();
const express = require('express');
const app = express();
app.use(express.json());
const { rabbitMQConnection } = require('./utils/rabbitMQ-connect');
const Activate_User = require('./models/Activate_User');
const db = require('./database/config');

const amqpServer = 'amqp://localhost:5672';
const queue_name = 'USERS';

(async () => {
    try {
        await db.authenticate();
        console.log('Connection has been established successfully.');
        const channel = await rabbitMQConnection(amqpServer, queue_name);
        await channel.consume(
            queue_name,
            async (data) => {
                if (data !== null) {
                    const message = JSON.parse(data.content);
                    if (message.event === 'add user') {
                        await Activate_User.create({ user_id: parseInt(message.user_id), email: message.email });
                    } else if (message.event === 'delete user') {
                        await Activate_User.destroy({
                            where: {
                                user_id: message.user_id,
                            },
                        });
                    }
                    channel.ack(data);
                }
            },
            {
                noAck: false,
            }
        );
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
})();
app.use('/order', require('./routes/order.js'));
app.get('/', (req, res) => res.send('order-service'));

module.exports = app;
