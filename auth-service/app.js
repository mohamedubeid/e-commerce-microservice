require('dotenv').config();
const express = require('express');
const app = express();
app.use(express.json());

const db = require('./database/config');
db.authenticate()
    .then(() => {
        console.log('Connection has been established successfully.');
    })
    .catch((err) => {
        console.error('Unable to connect to the database:', err);
    });
app.use('/auth', require('./routes/auth.js'));
app.get('/', (req, res) => res.send('auth-service'));

module.exports = app;
