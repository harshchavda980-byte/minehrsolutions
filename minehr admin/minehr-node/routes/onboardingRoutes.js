const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/onboardingController');
const batchCtrl = require('../controllers/trainingBatchController');

const auth = require('../middleware/authMiddleware');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/'),
    filename: (req, file, cb) => cb(null, `welcome_${Date.now()}${path.extname(file.originalname)}`)
});
const upload = multer({ storage });

router.use(auth);

// Training Batch Routes (Must be before generic :id routes to avoid conflict)
router.get('/batches',                 batchCtrl.getAll);
router.get('/batches/:id',             batchCtrl.getOne);
router.post('/batches',                batchCtrl.create);
router.put('/batches/:id',             batchCtrl.update);
router.delete('/batches/:id',          batchCtrl.delete);

router.get('/dashboard-stats',      ctrl.getDashboardStats);
router.get('/',                        ctrl.getAll);
router.get('/:id',                     ctrl.getOne);
router.post('/welcome-email/:id',      upload.single('attachment'), ctrl.sendWelcomeEmail);
router.post('/whatsapp/:id',           ctrl.markWhatsApp);
router.put('/status/:id',              ctrl.updateStatus);
router.post('/feedback-url/:id',       ctrl.generateFeedbackUrl);
router.put('/schedule/:id',            ctrl.updateSchedule);
router.put('/training/:id',            ctrl.updateTraining);
router.put('/batch/:id',               ctrl.updateBatch);
router.get('/timeline/:id',            ctrl.getTimeline);
router.get('/setup-status/:id',        ctrl.getSetupStatus);
router.put('/setup-status/:id',        ctrl.saveSetupStatus);

module.exports = router;
