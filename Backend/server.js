const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const verifyRoutes = require('./routes/verifyRoutes');

const app = express();

app.use(cors());
app.use(express.json({ limit: '10mb' })); // Default limit for most routes
app.use('/api', authRoutes);

// Custom middleware for /verify-id with higher limit
app.use('/api/verify-id', (req, res, next) => {
  express.json({ limit: '50mb' })(req, res, next); // Increase limit to 50MB
});
app.use('/api', verifyRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  // console.error('Server Error:', err.stack);
  console.error('Server Error:', err.message);
  res.status(500).json({ message: 'Internal server error', error: err.message });
});

app.listen(3000, () => console.log('Server running on port 3000')); 