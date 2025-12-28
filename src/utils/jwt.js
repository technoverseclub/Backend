const jwt = require('jsonwebtoken');
exports.signJwt = (payload) =>
  jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
