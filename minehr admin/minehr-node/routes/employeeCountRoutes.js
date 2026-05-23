const express = require('express');
const router = express.Router();
const employeeCountController = require('../controllers/employeeCountController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/', authMiddleware, employeeCountController.getAllStats);
router.get('/history', authMiddleware, employeeCountController.getHistory);
router.put('/:id/limit', authMiddleware, employeeCountController.updateLimit);

module.exports = router;
