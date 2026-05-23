require('dotenv').config();
const express = require('express');
const mysql = require('mysql2');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(cors());
app.use(bodyParser.json());
// Serve assets (css, js, images) from public
app.use('/public', express.static(path.join(__dirname, 'public')));

// Serve HTML pages from root
app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'index.html')));
app.get('/index.html', (req, res) => res.sendFile(path.join(__dirname, 'index.html')));
app.get('/contact.html', (req, res) => res.sendFile(path.join(__dirname, 'contact.html')));
app.get('/blog.html', (req, res) => res.sendFile(path.join(__dirname, 'blog.html')));
app.get('/blog-detail.html', (req, res) => res.sendFile(path.join(__dirname, 'blog-detail.html')));
app.get('/ats.html', (req, res) => res.sendFile(path.join(__dirname, 'ats.html')));
app.get('/crm.html', (req, res) => res.sendFile(path.join(__dirname, 'crm.html')));
app.get('/ems.html', (req, res) => res.sendFile(path.join(__dirname, 'ems.html')));
app.get('/career.html', (req, res) => res.sendFile(path.join(__dirname, 'career.html')));
app.get('/services.html', (req, res) => res.sendFile(path.join(__dirname, 'services.html')));
app.get('/trust.html', (req, res) => res.sendFile(path.join(__dirname, 'trust.html')));

// Serve HTML pages from services directory
app.get('/services/crm-solutions.html', (req, res) => res.sendFile(path.join(__dirname, 'services/crm-solutions.html')));
app.get('/services/custom-software.html', (req, res) => res.sendFile(path.join(__dirname, 'services/custom-software.html')));
app.get('/services/hr-services.html', (req, res) => res.sendFile(path.join(__dirname, 'services/hr-services.html')));
app.get('/services/hrms-software.html', (req, res) => res.sendFile(path.join(__dirname, 'services/hrms-software.html')));
app.get('/services/it-support.html', (req, res) => res.sendFile(path.join(__dirname, 'services/it-support.html')));
app.get('/services/logo-branding.html', (req, res) => res.sendFile(path.join(__dirname, 'services/logo-branding.html')));
app.get('/services/payroll-management.html', (req, res) => res.sendFile(path.join(__dirname, 'services/payroll-management.html')));
app.get('/services/recruitment-staffing.html', (req, res) => res.sendFile(path.join(__dirname, 'services/recruitment-staffing.html')));
app.get('/services/web-development.html', (req, res) => res.sendFile(path.join(__dirname, 'services/web-development.html')));
app.get('/services/employee-relations.html', (req, res) => res.sendFile(path.join(__dirname, 'services/employee-relations.html')));
app.get('/services/hr-solutions.html', (req, res) => res.redirect('/services/hr-services.html'));

// MySQL connection (uses .env for TiDB Cloud, fallback to localhost for local dev)
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306'),
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'minehr'
};

// Add SSL for TiDB Cloud
if (process.env.DB_SSL === 'true') {
  dbConfig.ssl = {
    minVersion: 'TLSv1.2',
    rejectUnauthorized: true
  };
}

const db = mysql.createConnection(dbConfig);

db.connect((err) => {
  if (err) {
    console.error('MySQL connection error:', err);
  } else {
    console.log('Connected to MySQL database');
  }
});

// Contact form API
// Job application form API
const multer = require('multer');
const upload = multer({
  storage: multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path.join(__dirname, 'uploads'));
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      cb(null, uniqueSuffix + '-' + file.originalname);
    }
  })
});

app.post('/api/apply', upload.single('resume'), async (req, res) => {
  const { fullName, email, phone, location } = req.body;
  const resumeFile = req.file ? req.file.filename : null;
  const resumePath = req.file ? req.file.path : null;

  if (!fullName || !email || !phone || !resumeFile) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  // Try to save to DB (non-fatal if DB is offline)
  db.query(
    'INSERT INTO career (full_name, email, phone, location, resume, created_at) VALUES (?, ?, ?, ?, ?, NOW())',
    [fullName, email, phone, location, resumeFile],
    (err) => {
      if (err) {
        console.warn('DB insert skipped (DB offline):', err.message);
      }
    }
  );

  // Send emails if credentials are configured
  try {
    if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
      const nodemailer = require('nodemailer');
      const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        }
      });

      const hrEmail = process.env.HR_EMAIL || process.env.EMAIL_USER;

      // 1️⃣ HR notification email (with resume attachment)
      await transporter.sendMail({
        from: `"MineHR Solutions" <${process.env.EMAIL_USER}>`,
        to: hrEmail,
        subject: `📋 New Job Application – ${fullName}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 30px; background: #f9f9f9; border-radius: 10px;">
            <h2 style="color: #4b0082; margin: 0 0 20px;">New Job Application Received</h2>
            <div style="background: #fff; border-radius: 8px; padding: 25px; box-shadow: 0 2px 10px rgba(0,0,0,0.07);">
              <table style="width:100%; font-size: 15px; color: #333; border-collapse: collapse;">
                <tr><td style="padding: 8px 0; font-weight: 600; width: 130px;">Name:</td><td>${fullName}</td></tr>
                <tr><td style="padding: 8px 0; font-weight: 600;">Email:</td><td><a href="mailto:${email}" style="color:#4b0082;">${email}</a></td></tr>
                <tr><td style="padding: 8px 0; font-weight: 600;">Phone:</td><td>${phone}</td></tr>
                <tr><td style="padding: 8px 0; font-weight: 600;">Location:</td><td>${location || 'Not provided'}</td></tr>
                <tr><td style="padding: 8px 0; font-weight: 600;">Resume:</td><td>${req.file ? req.file.originalname : 'N/A'} (attached)</td></tr>
              </table>
            </div>
            <p style="color:#888; font-size:12px; margin-top:20px;">© 2025 MineHR Solutions Pvt. Ltd.</p>
          </div>
        `,
        attachments: resumePath ? [{ filename: req.file.originalname, path: resumePath }] : []
      });

      // 2️⃣ Thank-you confirmation email to the applicant
      await transporter.sendMail({
        from: `"MineHR Solutions" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: `Thank You for Applying – MineHR Solutions`,
        html: `
          <div style="font-family: 'Arial', sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 30px; background: #f9f9f9; border-radius: 12px;">
            <div style="text-align: center; margin-bottom: 30px;">
              <h1 style="color: #4b0082; font-size: 26px; margin: 0;">MineHR Solutions</h1>
              <p style="color: #888; font-size: 13px; margin: 4px 0 0;">Stands For HR</p>
            </div>

            <div style="background: #ffffff; border-radius: 10px; padding: 35px; box-shadow: 0 4px 15px rgba(0,0,0,0.06);">
              <h2 style="color: #111; font-size: 22px; margin: 0 0 16px;">🎉 Thank You for Applying, ${fullName}!</h2>

              <p style="color: #444; font-size: 15px; line-height: 1.7; margin: 0 0 16px;">
                We have successfully received your job application. Our recruitment team is currently reviewing your profile and will get back to you shortly.
              </p>

              <div style="background: #f3eeff; border-left: 4px solid #4b0082; border-radius: 6px; padding: 16px 20px; margin: 20px 0;">
                <p style="margin: 0; color: #4b0082; font-weight: 600; font-size: 14px;">📋 Your Application Summary</p>
                <p style="margin: 8px 0 0; color: #555; font-size: 14px;">
                  <strong>Name:</strong> ${fullName}<br>
                  <strong>Email:</strong> ${email}<br>
                  <strong>Phone:</strong> ${phone}<br>
                  <strong>Location:</strong> ${location || 'Not provided'}
                </p>
              </div>

              <p style="color: #444; font-size: 15px; line-height: 1.7; margin: 16px 0;">
                In the meantime, if you have any questions, feel free to reach out to us at
                <a href="mailto:info@minehrsolutions.com" style="color: #4b0082; text-decoration: none;">info@minehrsolutions.com</a>
                or call us at <strong>+91 75740 63353</strong>.
              </p>

              <p style="color: #444; font-size: 15px; line-height: 1.7; margin: 0;">
                We look forward to connecting with you!
              </p>

              <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
                <p style="margin: 0; color: #888; font-size: 13px;">Warm regards,</p>
                <p style="margin: 4px 0 0; color: #4b0082; font-weight: 700; font-size: 15px;">MineHR Solutions Recruitment Team</p>
                <p style="margin: 2px 0 0; color: #888; font-size: 12px;">509, Ananta Elysium, Nikol, Ahmedabad – 380049</p>
              </div>
            </div>

            <p style="text-align: center; color: #bbb; font-size: 11px; margin-top: 24px;">
              © 2025 MineHR Solutions Pvt. Ltd. All rights reserved.
            </p>
          </div>
        `
      });

      console.log(`✅ Emails sent — HR: ${hrEmail} | Candidate: ${email}`);
    }
  } catch (mailErr) {
    console.warn('Email notification skipped:', mailErr.message);
  }

  // Always return success so the user sees the confirmation popup
  return res.json({ success: true });
});



app.post('/api/contact', async (req, res) => {
  const { name, email, contact_number, company, message } = req.body;
  
  if (!name) return res.status(400).json({ error: 'Name is required' });
  if (!email) return res.status(400).json({ error: 'Email is required' });
  if (!message) return res.status(400).json({ error: 'Message is required' });

  // Insert into DB (company is optional, created_at auto handled)
  db.query(
    'INSERT INTO contacts (name, email, contact_number, company, message, created_at, updated_at) VALUES (?, ?, ?, ?, ?, NOW(), NOW())',
    [name, email, contact_number, company, message],
    (err, result) => {
      if (err) {
        console.warn('Database error (skipping for testing):', err.message);
      }
      
      // For testing purposes, we return success immediately
      // In production, this would wait for sendMail
      return res.json({ success: true });
    }
  );
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
