// const express = require('express');
// const router = express.Router();
// const { verifyId } = require('../controllers/verifyController');
// const { authenticateToken } = require('../middleware/auth');

// router.post('/verify-id', authenticateToken, verifyId);

// module.exports = router;

const express = require('express');
const router = express.Router();
const { verifyId, createJob } = require('../controllers/verifyController');
const { authenticateToken } = require('../middleware/auth');

router.post('/verify-id', authenticateToken, verifyId);
router.post('/create-job', authenticateToken, createJob); // New endpoint

module.exports = router;