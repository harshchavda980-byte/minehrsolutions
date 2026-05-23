const express = require('express');
const router = express.Router();
const atsApplicationController = require('../controllers/atsApplicationController');
const authMiddleware = require('../middleware/authMiddleware');

router.use(authMiddleware);

router.get('/', atsApplicationController.getApplications);
router.post('/', atsApplicationController.createApplication);
router.get('/:id', atsApplicationController.getApplicationDetails);
router.patch('/:id', atsApplicationController.updateApplication);
router.post('/notes', atsApplicationController.addNote);
router.delete('/:id', atsApplicationController.deleteApplication);

module.exports = router;
