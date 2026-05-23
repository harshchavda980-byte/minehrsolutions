const express = require('express');
const router = express.Router();
const deviceController = require('../controllers/deviceController');
const authMiddleware = require('../middleware/authMiddleware');

router.use(authMiddleware);

router.get('/', deviceController.getAll);
router.get('/stats', deviceController.getStats);
router.get('/:id', deviceController.getOne);
router.post('/', deviceController.create);
router.put('/:id', deviceController.update);
router.delete('/:id', deviceController.delete);

module.exports = router;
