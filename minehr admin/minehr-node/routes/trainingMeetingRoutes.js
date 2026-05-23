const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/trainingMeetingController');
const auth = require('../middleware/authMiddleware');

router.use(auth);

router.get('/', ctrl.getAll);
router.post('/', ctrl.create);
router.put('/:id', ctrl.update);
router.delete('/:id', ctrl.delete);
router.post('/:id/start', ctrl.startMeeting);

module.exports = router;
