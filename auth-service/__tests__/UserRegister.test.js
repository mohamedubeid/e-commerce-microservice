const request = require('supertest');
const app = require('../app');
const User = require('../models/User');

beforeAll(() => {
    return User.sync({ force: true });
});

beforeEach(() => {
    return User.destroy({ truncate: true });
});
afterAll(() => {
    return User.drop();
});
describe('User Register', () => {
    const registerUser = () => {
        return request(app)
            .post('/auth/register')
            .send({ name: 'New User', email: 'new_user@gmail.com', password: '123456' });
    };

    it('returns 201 OK when register request is valid', async () => {
        const response = await registerUser();
        expect(response.statusCode).toBe(201);
    });

    it('returns 409 conflict when user is exist', async () => {
        await registerUser();
        const response = await registerUser();
        expect(response.statusCode).toBe(409);
    });

    it('returns error message when user is exist', async () => {
        await registerUser();
        const response = await registerUser();
        expect(response.body.message).toBe('user is already exist');
    });

    it('saves the user to database', async () => {
        await registerUser();
        const userList = await User.findAll();
        expect(userList.length).toBe(1);
    });

    it('saves the username and email to database', async () => {
        await registerUser();
        const userList = await User.findOne({
            where: {
                email: 'new_user@gmail.com',
            },
        });
        const savedUser = userList.dataValues;
        expect(savedUser.name).toBe('New User');
        expect(savedUser.email).toBe('new_user@gmail.com');
    });

    it('hashes the password in database', async () => {
        await registerUser();
        const userList = await User.findOne({
            where: {
                email: 'new_user@gmail.com',
            },
        });
        const savedUser = userList.dataValues;
        expect(savedUser.password).not.toBe('123456');
    });
});
