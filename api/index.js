const express = require('express');
const mysql = require('mysql2/promise');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const cors = require('cors');
const multer = require('multer');
const crypto = require('crypto');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Multer with memory storage (Vercel has read-only filesystem)
const upload = multer({ storage: multer.memoryStorage() });

// TiDB Cloud connection pool with SSL
let pool;
function getPool() {
  if (!pool) {
    pool = mysql.createPool({
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT || '4000'),
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME || 'minehr',
      ssl: {
        minVersion: 'TLSv1.2',
        rejectUnauthorized: true
      },
      waitForConnections: true,
      connectionLimit: 5,
      queueLimit: 0
    });
  }
  return pool;
}

// Contact form API
app.post('/api/contact', async (req, res) => {
  const { name, email, contact_number, company, message } = req.body;
  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  // Insert into DB (wrapped in try-catch so database issues don't crash email delivery)
  try {
    const db = getPool();
    await db.query(
      'INSERT INTO contacts (name, email, contact_number, company, message, created_at, updated_at) VALUES (?, ?, ?, ?, ?, NOW(), NOW())',
      [name, email, contact_number, company, message]
    );
  } catch (dbErr) {
    console.warn('Database error (skipping database insert):', dbErr.message);
  }

  // Send email notification to hr@minehrsolutions.com
  let emailSent = false;
  try {
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    const mailOptions = {
      from: email,
      to: process.env.HR_EMAIL || 'hr@minehrsolutions.com',
      replyTo: email,
      subject: `New Contact Us Submission from ${name} - MineHR`,
      text: `Name: ${name}\nEmail: ${email}\nContact Number: ${contact_number}\nCompany: ${company}\nMessage: ${message}`
    };

    await transporter.sendMail(mailOptions);
    emailSent = true;
  } catch (emailErr) {
    console.error('Nodemailer send error:', emailErr.message);
  }

  res.json({ success: true, emailSent });
});

// Job application form API
app.post('/api/apply', upload.single('resume'), async (req, res) => {
  const { fullName, email, phone, location } = req.body;
  const resumeBuffer = req.file ? req.file.buffer : null;
  const resumeFilename = req.file ? req.file.originalname : null;

  if (!fullName || !email || !phone || !resumeBuffer) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const db = getPool();
    await db.query(
      'INSERT INTO career (full_name, email, phone, location, resume, resume_filename, created_at) VALUES (?, ?, ?, ?, ?, ?, NOW())',
      [fullName, email, phone, location, resumeBuffer, resumeFilename]
    );
    res.json({ success: true });
  } catch (err) {
    console.error('Apply API error:', err);
    res.status(500).json({ error: 'Database error' });
  }
});

// Health check
app.get('/api/health', async (req, res) => {
  try {
    const db = getPool();
    const [rows] = await db.query('SELECT 1');
    res.json({ status: 'ok', db: 'connected' });
  } catch (err) {
    res.status(500).json({ status: 'error', db: err.message });
  }
});

module.exports = app;
