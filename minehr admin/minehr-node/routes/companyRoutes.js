const express = require('express');
const router = express.Router();
const companyController = require('../controllers/companyController');
const authMiddleware = require('../middleware/authMiddleware');

router.use(authMiddleware);

router.get('/', companyController.getAll);
router.get('/analytics', companyController.getAnalytics);
router.get('/:id', companyController.getOne);
router.post('/', companyController.create);
router.post('/register', companyController.register);
router.post('/:id/approve', companyController.approve);
router.post('/:id/reject', companyController.reject);
router.patch('/:id/suspend', companyController.suspend);
router.put('/:id', companyController.update);
router.delete('/:id', companyController.delete);

module.exports = router;
