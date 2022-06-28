const { DataTypes } = require('sequelize');
const db = require('../database/config');

const User = db.define('User', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
        unique: true
    },
    name: DataTypes.STRING,
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isEmail: {
                msg: 'Should be Valid Email'
            }
        }
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    }
}, {
    modelName: 'User',
    tableName: 'Users',
});

User.sync().then(() => {
    console.log('Users table created.');
});

module.exports = User;