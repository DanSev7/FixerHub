// const express = require('express');
// const router = express.Router();
// const { verifyId } = require('../controllers/verifyController');

// router.post('/verify-id', verifyId);

// module.exports = router;

const express = require('express');
const router = express.Router();
const { verifyId } = require('../controllers/verifyController');
const { authenticateToken } = require('../middleware/auth');

router.post('/verify-id', authenticateToken, verifyId);

module.exports = router;