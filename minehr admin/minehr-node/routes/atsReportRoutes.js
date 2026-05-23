const express = require('express');
const router = express.Router();
const atsReportController = require('../controllers/atsReportController');
const authMiddleware = require('../middleware/authMiddleware');

router.use(authMiddleware);

router.get('/metrics', atsReportController.getHiringMetrics);

module.exports = router;
