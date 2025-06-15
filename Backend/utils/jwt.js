const jwt = require('jsonwebtoken');

const generateToken = (payload) => {
  const secret = process.env.JWT_SECRET || 'your-secret-key'; // Use environment variable in production
  const options = { expiresIn: '24h' }; // Changed from '1h' to '24h'
  return jwt.sign(payload, secret, options);
};

module.exports = { generateToken };