const { verify } = require('jsonwebtoken');

const verifyToken = (token, secret) => new Promise((resolve, reject) => {
  verify(token, secret, (err, decode) => {
    if (err) {
      reject(err);
    } else resolve(decode);
  });
});



module.exports = {
  verifyToken,
};