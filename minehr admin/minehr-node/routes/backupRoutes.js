const express = require('express');
const router = express.Router();
const backupController = require('../controllers/backupController');
const authMiddleware = require('../middleware/authMiddleware');

router.use(authMiddleware);

router.get('/items', backupController.getRecycleBinItems);
router.post('/restore/:type/:id', backupController.restoreItem);

module.exports = router;
