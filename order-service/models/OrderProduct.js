const { DataTypes } = require('sequelize');
const db = require('../database/config');

const OrderProduct = db.define(
    'OrderProduct',
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false,
            unique: true,
        },
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        product_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
    },
    {
        modelName: 'OrderProduct',
        tableName: 'OrderProducts',
    }
);

module.exports = OrderProduct;
