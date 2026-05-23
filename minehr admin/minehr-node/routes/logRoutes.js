const express = require('express');
const router = express.Router();
const logController = require('../controllers/logController');
const authMiddleware = require('../middleware/authMiddleware');

router.use(authMiddleware);

router.get('/whatsapp', logController.getWhatsAppLogs);
router.get('/execution', logController.getExecutionHistory);

module.exports = router;
