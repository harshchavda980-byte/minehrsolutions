const express = require('express');
const router = express.Router();
const activityLogController = require('../controllers/activityLogController');
const authMiddleware = require('../middleware/authMiddleware');
const notificationService = require('../services/notificationService');

// Live Real-time notifications SSE Stream
router.get('/live', authMiddleware, (req, res) => {
    notificationService.addClient(req, res);
});

// Only Master Admin can access all logs
router.get('/', authMiddleware, (req, res, next) => {
    if (req.user.role !== 'Super Admin') {
        return res.status(403).json({ message: 'Access denied. Master Admin only.' });
    }
    next();
}, activityLogController.getAllLogs);

router.get('/:id', authMiddleware, (req, res, next) => {
    if (req.user.role !== 'Super Admin') {
        return res.status(403).json({ message: 'Access denied. Master Admin only.' });
    }
    next();
}, activityLogController.getLogById);

module.exports = router;
