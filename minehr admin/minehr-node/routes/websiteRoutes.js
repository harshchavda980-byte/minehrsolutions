const express = require('express');
const router = express.Router();
const Contact = require('../models/Contact');
const Career = require('../models/Career');
const nodemailer = require('nodemailer');
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });

router.post('/contact', async (req, res) => {
    const { name, email, contact_number, company, message } = req.body;
    try {
        await Contact.create({ name, email, contact_number, company, message });

        // Email notification (optional, based on env)
        if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
            const transporter = nodemailer.createTransport({
                host: 'smtp.gmail.com', port: 465, secure: true,
                auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS }
            });
            await transporter.sendMail({
                from: process.env.EMAIL_USER,
                to: process.env.EMAIL_USER,
                subject: 'New Contact Submission - MineHR',
                text: `Name: ${name}\nEmail: ${email}\nPhone: ${contact_number}\nCompany: ${company}\nMessage: ${message}`
            });
        }
        res.json({ success: true });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

router.post('/apply', upload.single('resume'), async (req, res) => {
    const { fullName, email, phone, location } = req.body;
    const resume = req.file ? req.file.buffer : null;
    const resume_filename = req.file ? req.file.originalname : null;

    try {
        await Career.create({ full_name: fullName, email, phone, location, resume, resume_filename });
        res.json({ success: true });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

module.exports = router;
