const express = require('express');
const router = express.Router();
const atsJobController = require('../controllers/atsJobController');
const authMiddleware = require('../middleware/authMiddleware');

router.use(authMiddleware);

router.get('/', atsJobController.getJobs);
router.post('/', atsJobController.createJob);
router.get('/:id', atsJobController.getJobDetails);
router.patch('/:id', atsJobController.updateJob);
router.delete('/:id', atsJobController.deleteJob);

module.exports = router;
