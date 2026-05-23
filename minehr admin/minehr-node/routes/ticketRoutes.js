const express = require('express');
const router = express.Router();
const ticketController = require('../controllers/ticketController');
const authMiddleware = require('../middleware/authMiddleware');

router.use(authMiddleware);

router.get('/', ticketController.getAll);
router.get('/:id', ticketController.getOne);
router.post('/', ticketController.create);
router.patch('/:id/status', ticketController.updateStatus);

module.exports = router;
