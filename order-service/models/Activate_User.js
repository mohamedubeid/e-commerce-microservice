const { DataTypes } = require('sequelize');
const db = require('../database/config');

const Activate_User = db.define(
    'Activate_User',
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
            unique: true,
        },
    },
    {
        modelName: 'Activate_User',
        tableName: 'Activate_Users',
        timestamps: false,
    }
);

module.exports = Activate_User;
