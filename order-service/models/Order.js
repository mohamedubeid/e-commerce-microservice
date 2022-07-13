const { DataTypes } = require('sequelize');
const db = require('../database/config');

const Order = db.define(
    'Order',
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
        total_price: {
            type: DataTypes.INTEGER,
        },
    },
    {
        modelName: 'Order',
        tableName: 'Orders',
        timestamps: true,
        updatedAt: false,
    }
);

module.exports = Order;
