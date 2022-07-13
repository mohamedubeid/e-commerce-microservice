const request = require('supertest');
const app = require('../app');
const User = require('../models/User');

beforeAll(async () => {
    await User.sync({ force: true });
    await User.create({
        name: 'Test User',
        email: 'test.user@gmail.com',
        password: '$2a$08$c58BVGy81PLggpJVHiQxleYK3PaguDMj9oEyhQmJIRfaKy5AcwLja',
    });
});

afterAll(() => {
    return User.drop();
});

describe('User Login', () => {
    const loginUser = ({ email = 'test.user@gmail.com', password = '123456' }) => {
        return request(app).post('/auth/login').send({
            email,
            password,
        });
    };

    it('returns 200 OK when login request is valid', async () => {
        const response = await loginUser({});
        expect(response.statusCode).toBe(200);
    });

    it('returns success message when login request is valid', async () => {
        const response = await loginUser({});
        expect(response.body.message).toBe('Logged In!');
    });

    it('returns 404 Bad Request when user is does not exist', async () => {
        const response = await loginUser({ email: 'test.user2@gmail.com' });
        expect(response.statusCode).toBe(404);
    });

    it('returns error message when user is does not exist', async () => {
        const response = await loginUser({ email: 'test.user2@gmail.com' });
        expect(response.body.message).toBe('User does not exit');
    });

    it('returns 401 Unauthorized when user login with incorrect password', async () => {
        const response = await loginUser({ password: '000000' });
        expect(response.statusCode).toBe(401);
    });

    it('returns error message when user login with incorrect password', async () => {
        const response = await loginUser({ password: '000000' });
        expect(response.body.message).toBe('Bad Credentials');
    });

    it('returns access token when user login with valid credentials', async () => {
        const response = await loginUser({});
        expect(response.body.token).toBe('eyJhbGciOiJIUzI1NiJ9.MQ.HdulHMcfbTVLoufon3j0Ke8s9KFQD_77m9Ye4zb_bag');
    });
});
