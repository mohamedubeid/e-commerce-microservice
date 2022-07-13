const request = require('supertest');
const app = require('../app');
const Activate_User = require('../models/Activate_User');
const Order = require('../models/Order');
const OrderProduct = require('../models/OrderProduct');
const Product = require('../models/Product');

beforeAll(async () => {
    await Activate_User.sync({ force: true });
    await Order.sync({ force: true });
    await OrderProduct.sync({ force: true });
    await Product.sync({ force: true });
    await Product.bulkCreate([
        { name: 'product1', description: 'this is desc1 for product1', price: 20 },
        { name: 'product2', description: 'this is desc2 for product2', price: 22 },
        { name: 'product3', description: 'this is desc3 for product3', price: 30 },
    ]);
    await Activate_User.create({ user_id: 1 });
});

beforeEach(async () => {
    await Order.destroy({ truncate: true });
    await OrderProduct.destroy({ truncate: true });
    await Activate_User.findOrCreate({
        where: { user_id: 1 },
    });
});

afterAll(async () => {
    await Activate_User.drop();
    await Order.drop();
    await OrderProduct.drop();
    await Product.drop();
});

describe('Add Order', () => {
    const makeOrder = () => {
        return request(app)
            .post('/order/')
            .set('Authorization', 'Bearer eyJhbGciOiJIUzI1NiJ9.MQ.HdulHMcfbTVLoufon3j0Ke8s9KFQD_77m9Ye4zb_bag')
            .send({
                products: [2, 3],
            });
    };
    it('returns 201 Created when add order request is valid', async () => {
        const order = await makeOrder();
        expect(order.statusCode).toBe(201);
    });
    it('returns 404 Not Found if user does not exist', async () => {
        await Activate_User.destroy({
            where: {
                id: 1,
            },
        });
        const order = await makeOrder();
        expect(order.statusCode).toBe(404);
    });

    it('saves the user_id to order table in database', async () => {
        const order = await makeOrder();
        const orderId = order.body.id;
        const response = await Order.findOne({
            where: {
                id: orderId,
            },
        });
        expect(response.user_id).toBe(1);
    });

    it('saves total product prices to database', async () => {
        const order = await makeOrder();
        const orderId = order.body.id;
        const response = await Order.findOne({
            where: {
                id: orderId,
            },
        });
        expect(response.total_price).toBe(52);
    });

    it('saves order products to database', async () => {
        const order = await makeOrder();
        const response = await OrderProduct.findAll({
            where: {
                user_id: 1,
            },
        });
        expect(response[0].dataValues.product_id).toBe(2);
        expect(response[1].dataValues.product_id).toBe(3);
    });
});
