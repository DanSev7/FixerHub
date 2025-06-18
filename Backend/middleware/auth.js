const jwt = require('jsonwebtoken');

// JWT Configuration
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret'; // Fallback for development

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  console.log('Received Authorization header:', authHeader);
  console.log('Extracted token:', token);

  if (!token) return res.status(401).json({ message: 'Access denied. No token provided.' });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = { user_id: decoded.user_id, role: decoded.role };
    console.log('Decoded user:', req.user);
    next();
  } catch (error) {
    console.error('Token verification error:', error.message);
    res.status(401).json({ message: 'Invalid token' });
  }
};

module.exports = { authenticateToken };