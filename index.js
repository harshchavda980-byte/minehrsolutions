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
app.get('/ems.html', (req, res) => res.sendFile(path.join(__dirname, 'ems.html')));

// Serve HTML pages from services directory
app.get('/services/ems.html', (req, res) => res.sendFile(path.join(__dirname, 'services/ems.html')));
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
  if (!contact_number) return res.status(400).json({ error: 'Phone number is required' });
  if (!company) return res.status(400).json({ error: 'Company name is required' });

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

/* ============================================================
   CSV EXPORT — Download all contact submissions as Excel/CSV
   Visit: /api/export/contacts?key=minehr2025
   ============================================================ */
app.get('/api/export/contacts', (req, res) => {
  const EXPORT_KEY = process.env.EXPORT_KEY || 'minehr2025';
  if (req.query.key !== EXPORT_KEY) {
    return res.status(401).json({ error: 'Unauthorized. Provide ?key=<export_key>' });
  }

  db.query('SELECT id, name, email, contact_number, company, message, created_at FROM contacts ORDER BY created_at DESC', (err, rows) => {
    if (err) {
      return res.status(500).json({ error: 'Database error: ' + err.message });
    }

    const headers = ['ID', 'Name', 'Email', 'Contact Number', 'Company', 'Message', 'Submitted At'];
    const escapeCSV = (val) => {
      if (val == null) return '';
      const str = String(val).replace(/"/g, '""');
      return /[,"\n\r]/.test(str) ? `"${str}"` : str;
    };

    const csvRows = [
      headers.join(','),
      ...rows.map(r => [
        r.id, r.name, r.email, r.contact_number, r.company, r.message,
        r.created_at ? new Date(r.created_at).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }) : ''
      ].map(escapeCSV).join(','))
    ];

    const csv = csvRows.join('\r\n');
    const filename = `MineHR_Contacts_${new Date().toISOString().slice(0,10)}.csv`;

    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.send('\uFEFF' + csv); // BOM for Excel UTF-8 compatibility
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
