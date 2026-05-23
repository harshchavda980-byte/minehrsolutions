const express = require('express');
const router = express.Router();
const feedbackController = require('../controllers/feedbackController');
const authMiddleware = require('../middleware/authMiddleware');

// Public route for submitting feedback (optional, but Contact Us is usually public)
router.post('/submit', feedbackController.create);

// Protected routes for management
router.use(authMiddleware);
router.get('/', feedbackController.getAll);
router.get('/:id', feedbackController.getOne);
router.patch('/:id/escalate', feedbackController.escalate);
router.patch('/:id/resolve', feedbackController.resolve);

module.exports = router;
