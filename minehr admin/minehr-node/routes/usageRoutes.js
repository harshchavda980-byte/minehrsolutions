const express = require('express');
const router = express.Router();
const usageController = require('../controllers/usageController');

router.get('/stats', usageController.getUsageStats);
router.post('/record', usageController.recordUsage);


module.exports = router;
