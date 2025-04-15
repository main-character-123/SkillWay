const jwt = require('jsonwebtoken');

const generateAccessToken = (id, role) =>
  jwt.sign({ id }, process.env.JWT_SECRET_ACCESS, {
    expiresIn: process.env.JWT_EXPIRES_IN_ACCESS,
  });


module.exports = {
  generateAccessToken,

};
