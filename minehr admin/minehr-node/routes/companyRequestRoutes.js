const express = require('express');
const router = express.Router();
const companyRequestController = require('../controllers/companyRequestController');
const authMiddleware = require('../middleware/authMiddleware');

// Public route for submitting requests
router.post('/submit', companyRequestController.create);

// Protected routes for management
router.use(authMiddleware);
router.get('/', companyRequestController.getAll);
router.get('/:id', companyRequestController.getOne);
router.patch('/:id/solve', companyRequestController.markSolved);
router.delete('/:id', companyRequestController.delete);

module.exports = router;
