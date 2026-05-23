const express = require('express');
const router = express.Router();
const recycleBinController = require('../controllers/recycleBinController');
const authMiddleware = require('../middleware/authMiddleware');

router.use(authMiddleware);

router.get('/', recycleBinController.getDeletedItems);
router.post('/restore', recycleBinController.restoreItem);
router.post('/permanent-delete', recycleBinController.permanentDelete);
router.post('/bulk-restore', recycleBinController.bulkRestore);
router.post('/bulk-permanent-delete', recycleBinController.bulkPermanentDelete);

module.exports = router;
