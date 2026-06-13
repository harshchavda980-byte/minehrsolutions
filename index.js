require('dotenv').config();
const express = require('express');
const mysql = require('mysql2');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const crypto = require('crypto');

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

app.post('/api/apply', upload.single('resume'), (req, res) => {
  const { fullName, email, phone, location } = req.body;
  const resumeFile = req.file ? req.file.filename : null;

  if (!fullName || !email || !phone || !resumeFile) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  db.query(
    'INSERT INTO career (full_name, email, phone, location, resume, created_at) VALUES (?, ?, ?, ?, ?, NOW())',
    [fullName, email, phone, location, resumeFile],
    (err, result) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }
      res.json({ success: true });
    }
  );
});
app.post('/api/contact', async (req, res) => {
  const { name, email, contact_number, company, message } = req.body;
  
  if (!name) return res.status(400).json({ error: 'Name is required' });
  if (!email) return res.status(400).json({ error: 'Email is required' });
  if (!message) return res.status(400).json({ error: 'Message is required' });

  // Insert into DB (wrapped in try-catch/callback error check so database issues don't crash email delivery)
  db.query(
    'INSERT INTO contacts (name, email, contact_number, company, message, created_at, updated_at) VALUES (?, ?, ?, ?, ?, NOW(), NOW())',
    [name, email, contact_number, company, message],
    async (err, result) => {
      if (err) {
        console.warn('Database error (skipping database insert):', err.message);
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

      return res.json({ success: true, emailSent });
    }
  );
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
