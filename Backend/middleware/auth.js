const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  console.log('Received Authorization header:', authHeader); // Debug log
  console.log('Extracted token:', token); // Debug log

  if (!token) return res.status(401).json({ message: 'Access denied. No token provided.' });

  try {
    const secret = process.env.JWT_SECRET || 'your-secret-key';
    const decoded = jwt.verify(token, secret);
    req.user = decoded;
    console.log('Decoded user:', req.user); // Debug log
    next();
  } catch (error) {
    console.error('Token verification error:', error.message); // Debug error
    res.status(401).json({ message: 'Invalid token' });
  }
};

module.exports = { authenticateToken };