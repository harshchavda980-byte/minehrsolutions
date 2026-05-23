const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/stats', dashboardController.getStats);
router.get('/growth', authMiddleware, dashboardController.getGrowthData);
router.get('/recent-activity', authMiddleware, dashboardController.getRecentActivity);
router.get('/search', dashboardController.globalSearch);

module.exports = router;
