const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/login', authController.login);
router.post('/logout', authController.logout);
router.post('/register', authController.register);
router.get('/me', authMiddleware, authController.me);
router.get('/users', authMiddleware, authController.getUsers);
router.put('/users/:id', authMiddleware, authController.updateUser);
router.delete('/users/:id', authMiddleware, authController.deleteUser);
router.post('/users/bulk-delete', authMiddleware, authController.bulkDelete);
router.post('/users/bulk-deactivate', authMiddleware, authController.bulkDeactivate);
router.get('/users/:id', authMiddleware, authController.getUser);
module.exports = router;
