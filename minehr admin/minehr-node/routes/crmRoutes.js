const express = require('express');
const router = express.Router();
const crmController = require('../controllers/crmController');
const authMiddleware = require('../middleware/authMiddleware');

router.use(authMiddleware);

// Leads Management
router.get('/leads', crmController.getLeads);
router.get('/leads/:id', crmController.getLeadDetails);
router.post('/leads', crmController.createLead);
router.patch('/leads/:id', crmController.updateLead);
router.delete('/leads/:id', crmController.deleteLead);

// Interactions
router.post('/leads/:id/interactions', crmController.addInteraction);

module.exports = router;
