const { Sequelize } = require('sequelize');

module.exports = new Sequelize(
    process.env.NODE_ENV === 'test' ? process.env.DB_DATABASE_test : process.env.DB_DATABASE,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST,
        dialect: process.env.DB_DIALECT,
        port: process.env.DB_PORT,
        logging: false,
    }
);
