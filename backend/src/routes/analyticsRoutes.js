const express = require('express');
const { getAnalyticsSummary } = require('../controllers/analyticsController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(protect); // Analytics routes are protected by JWT

router.get('/summary', getAnalyticsSummary);

module.exports = router;
