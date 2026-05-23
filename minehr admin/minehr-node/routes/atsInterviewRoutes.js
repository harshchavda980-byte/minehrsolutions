const express = require('express');
const router = express.Router();
const atsInterviewController = require('../controllers/atsInterviewController');
const authMiddleware = require('../middleware/authMiddleware');

router.use(authMiddleware);

router.get('/', atsInterviewController.getInterviews);
router.post('/', atsInterviewController.scheduleInterview);
router.patch('/:id', atsInterviewController.updateInterview);
router.delete('/:id', atsInterviewController.deleteInterview);

module.exports = router;
