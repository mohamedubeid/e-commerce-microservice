const amqp = require('amqplib');

const createConnection = async (amqpServer) => {
    try {
        const connection = await amqp.connect(amqpServer);
        return connection;
    } catch (error) {
        throw error;
    }
};

const createChannel = async (connection) => {
    try {
        const channel = await connection.createChannel();
        return channel;
    } catch (error) {
        throw error;
    }
};

const channelAssertQueue = async (channel, queue_name) => {
    try {
        await channel.assertQueue(queue_name, {
            durable: true,
        });
        return;
    } catch (error) {
        throw error;
    }
};

const rabbitMQConnection = async (amqpServer, queue_name) => {
    try {
        const connection = await createConnection(amqpServer);
        const channel = await createChannel(connection);
        await channelAssertQueue(channel, queue_name);
        return channel;
    } catch (error) {
        throw error;
    }
};

module.exports = { rabbitMQConnection };
