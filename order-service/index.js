const app = require('./app');
const sequelize = require('./database/config');
const PORT = process.env.PORT || 7000;

sequelize.sync().then(() => {
    console.log('Tables created.');
});
app.listen(PORT, () => console.log(`Auth-Service app listening on port ${PORT}!`));
