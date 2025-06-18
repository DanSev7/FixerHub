const express = require('express');
const router = express.Router();
const { signup, verifyEmail, login, resendVerification } = require('../controllers/authController');
const { authenticateToken } = require('../middleware/auth');
const supabase = require('../config/db');

// Auth routes
router.post('/signup', signup);
router.post('/verify-email', verifyEmail);
router.post('/login', login);
router.post('/resend-verification', resendVerification);

// Get user profile
router.get('/me', authenticateToken, async (req, res) => {
  try {
    const { data: user, error } = await supabase
      .from('users')
      .select('user_id, username, email, phone_number, role, is_verified, location')
      .eq('user_id', req.user.user_id)
      .single();

    if (error) {
      console.error('Error fetching user profile:', error);
      return res.status(500).json({ error: 'Failed to fetch user profile' });
    }

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    console.error('Error in /me endpoint:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;