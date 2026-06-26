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

// Handle connection errors gracefully to prevent the process from crashing
db.on('error', (err) => {
  console.error('MySQL connection error occurred:', err.message);
});

db.connect((err) => {
  if (err) {
    console.error('MySQL connection error:', err.message);
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
  const { fullName, email, phone, location, jobTitle } = req.body;
  const resumeFile = req.file ? req.file.filename : null;

  if (!fullName || !email || !phone || !resumeFile) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  let dbInserted = false;
  let emailSent = false;

  // 1. Database insert
  try {
    await new Promise((resolve, reject) => {
      db.query(
        'INSERT INTO career (full_name, email, phone, location, resume, created_at) VALUES (?, ?, ?, ?, ?, NOW())',
        [fullName, email, phone, location, resumeFile],
        (err, result) => {
          if (err) {
            reject(err);
          } else {
            resolve(result);
          }
        }
      );
    });
    dbInserted = true;
  } catch (err) {
    console.warn('Database error (skipping database insert for career application):', err.message);
  }

  // 2. Send emails
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

    const hrEmailHtml = `
<div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f9fafb; border: 1px solid #e5e7eb; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);">
  <div style="background-color: #1e293b; padding: 30px 20px; text-align: center;">
    <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 700; letter-spacing: -0.5px;">MineHR Portal</h1>
    <p style="color: #94a3b8; margin: 5px 0 0 0; font-size: 14px; font-weight: 500;">New Job Application Received</p>
  </div>
  <div style="padding: 30px 25px; background-color: #ffffff;">
    <p style="margin-top: 0; color: #111827; font-size: 16px; line-height: 1.6;">Hello HR Team,</p>
    <p style="color: #4b5563; font-size: 15px; line-height: 1.6;">A new job application has been submitted through the careers page on the MineHR website. Below are the details of the candidate:</p>
    
    <div style="margin: 25px 0; padding: 20px; background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px;">
      <h3 style="margin-top: 0; color: #0f172a; font-size: 14px; text-transform: uppercase; letter-spacing: 0.5px; border-bottom: 1px solid #e2e8f0; padding-bottom: 8px;">Candidate Information</h3>
      <table style="width: 100%; font-size: 14px; border-collapse: collapse;">
        <tr>
          <td style="padding: 6px 0; color: #64748b; width: 120px; font-weight: 500;">Job Applied For:</td>
          <td style="padding: 6px 0; color: #0f172a; font-weight: 600;">${jobTitle || 'General Application'}</td>
        </tr>
        <tr>
          <td style="padding: 6px 0; color: #64748b; font-weight: 500;">Full Name:</td>
          <td style="padding: 6px 0; color: #0f172a; font-weight: 600;">${fullName}</td>
        </tr>
        <tr>
          <td style="padding: 6px 0; color: #64748b; font-weight: 500;">Email Address:</td>
          <td style="padding: 6px 0; color: #0f172a;"><a href="mailto:${email}" style="color: #4f46e5; text-decoration: none;">${email}</a></td>
        </tr>
        <tr>
          <td style="padding: 6px 0; color: #64748b; font-weight: 500;">Phone Number:</td>
          <td style="padding: 6px 0; color: #0f172a;"><a href="tel:${phone}" style="color: #4f46e5; text-decoration: none;">${phone}</a></td>
        </tr>
        <tr>
          <td style="padding: 6px 0; color: #64748b; font-weight: 500;">Current Location:</td>
          <td style="padding: 6px 0; color: #0f172a;">${location || 'Not Provided'}</td>
        </tr>
        <tr>
          <td style="padding: 6px 0; color: #64748b; font-weight: 500;">Submitted At:</td>
          <td style="padding: 6px 0; color: #0f172a;">${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}</td>
        </tr>
      </table>
    </div>

    <p style="color: #4b5563; font-size: 15px; line-height: 1.6;">The candidate's resume has been attached to this email for your review.</p>
  </div>
  <div style="background-color: #f8fafc; padding: 20px; text-align: center; border-top: 1px solid #e2e8f0; font-size: 12px; color: #64748b;">
    <p style="margin: 0;">This is an automated notification from the MineHR Web Portal.</p>
  </div>
</div>
`;

    const customerEmailHtml = `
<div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f9fafb; border: 1px solid #e5e7eb; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);">
  <div style="background-color: #4f46e5; padding: 30px 20px; text-align: center;">
    <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 700; letter-spacing: -0.5px;">MineHR Solutions</h1>
    <p style="color: #c7d2fe; margin: 5px 0 0 0; font-size: 14px; font-weight: 500;">Application Confirmation</p>
  </div>
  <div style="padding: 30px 25px; background-color: #ffffff;">
    <p style="margin-top: 0; color: #111827; font-size: 16px; font-weight: 600;">Dear ${fullName},</p>
    <p style="color: #4b5563; font-size: 15px; line-height: 1.6;">Thank you for your interest in joining MineHR Solutions! We have successfully received your application for the <strong>${jobTitle || 'General Application'}</strong> position.</p>
    
    <div style="margin: 25px 0; padding: 20px; background-color: #f3f4f6; border-radius: 6px;">
      <h3 style="margin-top: 0; color: #111827; font-size: 14px; text-transform: uppercase; letter-spacing: 0.5px; border-bottom: 1px solid #e5e7eb; padding-bottom: 8px;">Submission Summary</h3>
      <table style="width: 100%; font-size: 14px; border-collapse: collapse;">
        <tr>
          <td style="padding: 6px 0; color: #6b7280; width: 120px; font-weight: 500;">Position:</td>
          <td style="padding: 6px 0; color: #1f2937; font-weight: 600;">${jobTitle || 'General Application'}</td>
        </tr>
        <tr>
          <td style="padding: 6px 0; color: #6b7280; font-weight: 500;">Full Name:</td>
          <td style="padding: 6px 0; color: #1f2937;">${fullName}</td>
        </tr>
        <tr>
          <td style="padding: 6px 0; color: #6b7280; font-weight: 500;">Email:</td>
          <td style="padding: 6px 0; color: #1f2937;">${email}</td>
        </tr>
        <tr>
          <td style="padding: 6px 0; color: #6b7280; font-weight: 500;">Phone:</td>
          <td style="padding: 6px 0; color: #1f2937;">${phone}</td>
        </tr>
        <tr>
          <td style="padding: 6px 0; color: #6b7280; font-weight: 500;">Location:</td>
          <td style="padding: 6px 0; color: #1f2937;">${location || 'Not Provided'}</td>
        </tr>
      </table>
    </div>

    <p style="color: #4b5563; font-size: 15px; line-height: 1.6;">Our recruitment team will review your application and resume. If your profile matches our requirements, we will contact you to schedule an interview.</p>
    <p style="color: #4b5563; font-size: 15px; line-height: 1.6; margin-bottom: 0;">Best regards,<br><strong style="color: #111827;">The Recruitment Team</strong><br>MineHR Solutions</p>
  </div>
  <div style="background-color: #f9fafb; padding: 20px; text-align: center; border-top: 1px solid #e5e7eb; font-size: 12px; color: #6b7280;">
    <p style="margin: 0 0 5px 0;">MineHR Solutions Pvt. Ltd.</p>
    <p style="margin: 0;">509, Ananta Elysium, Nikol, Ahmedabad - 380049</p>
    <p style="margin: 5px 0 0 0;"><a href="https://www.minehrsolutions.com" style="color: #4f46e5; text-decoration: none; font-weight: 500;">www.minehrsolutions.com</a></p>
  </div>
</div>
`;

    // Send email to HR
    const hrMailOptions = {
      from: '"MineHR Solutions" <hr@minehrsolutions.com>',
      to: process.env.HR_EMAIL || 'hr@minehrsolutions.com',
      replyTo: email,
      subject: `New Job Application: ${fullName} (${jobTitle || 'General Application'})`,
      html: hrEmailHtml,
      attachments: [
        {
          filename: req.file.originalname,
          path: req.file.path
        }
      ]
    };

    // Send confirmation email to applicant
    const customerMailOptions = {
      from: '"MineHR Solutions" <hr@minehrsolutions.com>',
      to: email,
      replyTo: 'hr@minehrsolutions.com',
      subject: `Application Received: ${jobTitle || 'General Application'} - MineHR Solutions`,
      html: customerEmailHtml
    };

    await Promise.all([
      transporter.sendMail(hrMailOptions),
      transporter.sendMail(customerMailOptions)
    ]);
    emailSent = true;
  } catch (emailErr) {
    console.error('Nodemailer send error in career application:', emailErr.message);
  }

  res.json({ success: true, dbInserted, emailSent });
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
      
      // Send email notifications
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

        const hrContactHtml = `
<div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f9fafb; border: 1px solid #e5e7eb; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);">
  <div style="background-color: #1e293b; padding: 30px 20px; text-align: center;">
    <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 700; letter-spacing: -0.5px;">MineHR Portal</h1>
    <p style="color: #94a3b8; margin: 5px 0 0 0; font-size: 14px; font-weight: 500;">New Contact Form Submission</p>
  </div>
  <div style="padding: 30px 25px; background-color: #ffffff;">
    <p style="margin-top: 0; color: #111827; font-size: 16px; line-height: 1.6;">Hello HR Team,</p>
    <p style="color: #4b5563; font-size: 15px; line-height: 1.6;">A new inquiry has been submitted through the Contact Us form. Below are the details:</p>
    
    <div style="margin: 25px 0; padding: 20px; background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px;">
      <h3 style="margin-top: 0; color: #0f172a; font-size: 14px; text-transform: uppercase; letter-spacing: 0.5px; border-bottom: 1px solid #e2e8f0; padding-bottom: 8px;">Inquiry Information</h3>
      <table style="width: 100%; font-size: 14px; border-collapse: collapse;">
        <tr>
          <td style="padding: 6px 0; color: #64748b; width: 120px; font-weight: 500;">Name:</td>
          <td style="padding: 6px 0; color: #0f172a; font-weight: 600;">${name}</td>
        </tr>
        <tr>
          <td style="padding: 6px 0; color: #64748b; font-weight: 500;">Email Address:</td>
          <td style="padding: 6px 0; color: #0f172a;"><a href="mailto:${email}" style="color: #4f46e5; text-decoration: none;">${email}</a></td>
        </tr>
        <tr>
          <td style="padding: 6px 0; color: #64748b; font-weight: 500;">Contact Number:</td>
          <td style="padding: 6px 0; color: #0f172a;"><a href="tel:${contact_number}" style="color: #4f46e5; text-decoration: none;">${contact_number}</a></td>
        </tr>
        <tr>
          <td style="padding: 6px 0; color: #64748b; font-weight: 500;">Company:</td>
          <td style="padding: 6px 0; color: #0f172a;">${company}</td>
        </tr>
        <tr>
          <td style="padding: 6px 0; color: #64748b; font-weight: 500; vertical-align: top;">Message:</td>
          <td style="padding: 6px 0; color: #0f172a; line-height: 1.4;">${message || 'N/A'}</td>
        </tr>
        <tr>
          <td style="padding: 6px 0; color: #64748b; font-weight: 500;">Submitted At:</td>
          <td style="padding: 6px 0; color: #0f172a;">${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}</td>
        </tr>
      </table>
    </div>
  </div>
  <div style="background-color: #f8fafc; padding: 20px; text-align: center; border-top: 1px solid #e2e8f0; font-size: 12px; color: #64748b;">
    <p style="margin: 0;">This is an automated notification from the MineHR Web Portal.</p>
  </div>
</div>
`;

        const customerContactHtml = `
<div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f9fafb; border: 1px solid #e5e7eb; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);">
  <div style="background-color: #4f46e5; padding: 30px 20px; text-align: center;">
    <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 700; letter-spacing: -0.5px;">MineHR Solutions</h1>
    <p style="color: #c7d2fe; margin: 5px 0 0 0; font-size: 14px; font-weight: 500;">Inquiry Received</p>
  </div>
  <div style="padding: 30px 25px; background-color: #ffffff;">
    <p style="margin-top: 0; color: #111827; font-size: 16px; font-weight: 600;">Dear ${name},</p>
    <p style="color: #4b5563; font-size: 15px; line-height: 1.6;">Thank you for contacting MineHR Solutions. We have received your inquiry and our team is already reviewing the details.</p>
    
    <div style="margin: 25px 0; padding: 20px; background-color: #f3f4f6; border-radius: 6px;">
      <h3 style="margin-top: 0; color: #111827; font-size: 14px; text-transform: uppercase; letter-spacing: 0.5px; border-bottom: 1px solid #e5e7eb; padding-bottom: 8px;">Inquiry Summary</h3>
      <table style="width: 100%; font-size: 14px; border-collapse: collapse;">
        <tr>
          <td style="padding: 6px 0; color: #6b7280; width: 120px; font-weight: 500;">Name:</td>
          <td style="padding: 6px 0; color: #1f2937; font-weight: 600;">${name}</td>
        </tr>
        <tr>
          <td style="padding: 6px 0; color: #6b7280; font-weight: 500;">Email:</td>
          <td style="padding: 6px 0; color: #1f2937;">${email}</td>
        </tr>
        <tr>
          <td style="padding: 6px 0; color: #6b7280; font-weight: 500;">Phone:</td>
          <td style="padding: 6px 0; color: #1f2937;">${contact_number}</td>
        </tr>
        <tr>
          <td style="padding: 6px 0; color: #6b7280; font-weight: 500;">Company:</td>
          <td style="padding: 6px 0; color: #1f2937;">${company}</td>
        </tr>
        <tr>
          <td style="padding: 6px 0; color: #6b7280; font-weight: 500; vertical-align: top;">Message:</td>
          <td style="padding: 6px 0; color: #1f2937; line-height: 1.4;">${message || 'N/A'}</td>
        </tr>
      </table>
    </div>

    <p style="color: #4b5563; font-size: 15px; line-height: 1.6;">One of our business representatives will get in touch with you shortly to assist you further.</p>
    <p style="color: #4b5563; font-size: 15px; line-height: 1.6; margin-bottom: 0;">Best regards,<br><strong style="color: #111827;">Customer Relations Team</strong><br>MineHR Solutions</p>
  </div>
  <div style="background-color: #f9fafb; padding: 20px; text-align: center; border-top: 1px solid #e5e7eb; font-size: 12px; color: #6b7280;">
    <p style="margin: 0 0 5px 0;">MineHR Solutions Pvt. Ltd.</p>
    <p style="margin: 0;">509, Ananta Elysium, Nikol, Ahmedabad - 380049</p>
    <p style="margin: 5px 0 0 0;"><a href="https://www.minehrsolutions.com" style="color: #4f46e5; text-decoration: none; font-weight: 500;">www.minehrsolutions.com</a></p>
  </div>
</div>
`;

        // Send email to HR
        const hrMailOptions = {
          from: '"MineHR Solutions" <hr@minehrsolutions.com>',
          to: process.env.HR_EMAIL || 'hr@minehrsolutions.com',
          replyTo: email,
          subject: `New Contact Us Submission from ${name} - MineHR`,
          html: hrContactHtml
        };

        // Send confirmation email to client
        const customerMailOptions = {
          from: '"MineHR Solutions" <hr@minehrsolutions.com>',
          to: email,
          replyTo: 'hr@minehrsolutions.com',
          subject: `Thank You for Contacting MineHR Solutions`,
          html: customerContactHtml
        };

        await Promise.all([
          transporter.sendMail(hrMailOptions),
          transporter.sendMail(customerMailOptions)
        ]);
        emailSent = true;
      } catch (emailErr) {
        console.error('Nodemailer send error in contact submission:', emailErr.message);
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
