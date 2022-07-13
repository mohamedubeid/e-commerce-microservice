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

describe('Delete User', () => {
    const deleteUser = (id = 1) => {
        return request(app).delete(`/auth/user/${id}`);
    };

    const insertUser = () => {
        return User.create({
            name: 'Test User',
            email: 'test.user@gmail.com',
            password: '$2a$08$c58BVGy81PLggpJVHiQxleYK3PaguDMj9oEyhQmJIRfaKy5AcwLja',
        });
    };
    it('returns 202 deleted when delete request is valid', async () => {
        const user = await insertUser();
        const userID = user.dataValues.id;
        const response = await deleteUser(userID);
        expect(response.statusCode).toBe(202);
    });

    it('returns 404 when user is does not exist', async () => {
        const response = await deleteUser();
        expect(response.statusCode).toBe(404);
    });

    it('returns 404 when user does not activate', async () => {
        const user = await User.create({
            name: 'Test User',
            email: 'test.user@gmail.com',
            password: '$2a$08$c58BVGy81PLggpJVHiQxleYK3PaguDMj9oEyhQmJIRfaKy5AcwLja',
            isActive: false,
        });
        const userID = user.dataValues.id;
        const response = await deleteUser(userID);
        expect(response.statusCode).toBe(404);
    });
    it('deactivates the user if the passed user ID is valid', async () => {
        const user = await insertUser();
        const userID = user.dataValues.id;
        await deleteUser(userID);
        const deletedUser = await User.findOne({
            where: {
                id: userID,
            },
        });
        expect(deletedUser.dataValues.isActive).toBe(false);
    });
});
