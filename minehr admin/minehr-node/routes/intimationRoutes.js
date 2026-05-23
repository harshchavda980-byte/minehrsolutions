const express = require('express');
const router = express.Router();
const intimationController = require('../controllers/intimationController');
const authMiddleware = require('../middleware/authMiddleware');

router.use(authMiddleware);

router.get('/', intimationController.getIntimations);
router.post('/', intimationController.createIntimation);
router.patch('/:id', intimationController.updateIntimation);
router.delete('/:id', intimationController.deleteIntimation);
router.post('/:id/test', intimationController.triggerTest);

module.exports = router;
