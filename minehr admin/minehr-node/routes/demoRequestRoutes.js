const express = require('express');
const router = express.Router();
const demoRequestController = require('../controllers/demoRequestController');
const authMiddleware = require('../middleware/authMiddleware');

router.use(authMiddleware);

router.get('/', demoRequestController.getDemoRequests);
router.get('/:id', demoRequestController.getDemoRequestDetails);
router.patch('/:id', demoRequestController.updateDemoRequest);
router.delete('/:id', demoRequestController.deleteDemoRequest);

// Public or internal creation
router.post('/', demoRequestController.createDemoRequest);

module.exports = router;
