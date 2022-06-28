const { DataTypes } = require('sequelize');
const db = require('../database/config');

const Product = db.define('Product', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
        unique: true
    },
    name: DataTypes.STRING,
    description: DataTypes.STRING,
    price: {
        type: DataTypes.INTEGER,
    }
}, {
    modelName: 'Product',
    tableName: 'Products',
    timestamps: false,
});

Product.sync().then(() => {
    console.log('Products table created.');
});

module.exports = Product;