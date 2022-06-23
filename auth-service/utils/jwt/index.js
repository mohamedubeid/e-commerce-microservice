const { sign } = require('jsonwebtoken');



const signToken = (payload, secret) => new Promise((resolve, reject) => {
  sign(payload, secret, (err, token) => {
    if (err) {
      reject(err);
    } else resolve(token);
  });
});

module.exports = {
  signToken,
};