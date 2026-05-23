const express = require('express');
const router = express.Router();
const industryTypeController = require('../controllers/industryTypeController');
const authMiddleware = require('../middleware/authMiddleware');

router.use(authMiddleware);

router.get('/', industryTypeController.getIndustryTypes);
router.post('/', industryTypeController.createIndustryType);
router.patch('/:id', industryTypeController.updateIndustryType);
router.delete('/:id', industryTypeController.deleteIndustryType);

module.exports = router;
