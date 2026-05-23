const express = require('express');
const router = express.Router();
const engagementController = require('../controllers/engagementController');
const authMiddleware = require('../middleware/authMiddleware');

router.use(authMiddleware);

router.get('/stats', engagementController.getDashboardStats);
router.get('/report', engagementController.getDetailedReport);

module.exports = router;
