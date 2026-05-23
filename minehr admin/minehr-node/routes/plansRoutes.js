const express = require('express');
const router = express.Router();
const plansController = require('../controllers/plansController');
const authMiddleware = require('../middleware/authMiddleware');

router.use(authMiddleware);

router.get('/', plansController.getAll);
router.get('/:id/details', plansController.getDetails);
router.post('/:id/update', plansController.updatePlan);
router.post('/renew', plansController.renew);

module.exports = router;
