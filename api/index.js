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

function hasPlaceholderMailConfig() {
  const emailUser = process.env.EMAIL_USER || '';
  const emailPass = process.env.EMAIL_PASS || '';
  return (
    !emailUser ||
    !emailPass ||
    emailUser.includes('your-gmail@gmail.com') ||
    emailPass.includes('your-16-char-app-password')
  );
}

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
  if (!name || !email || !contact_number || !company) {
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

  // Send email notifications
  let emailSent = false;
  try {
    if (hasPlaceholderMailConfig()) {
      throw new Error('EMAIL_USER / EMAIL_PASS are still placeholder values. Configure a real Gmail account or app password before sending mail.');
    }

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

  res.json({ success: true, emailSent });
});

// Job application form API
app.post('/api/apply', upload.single('resume'), async (req, res) => {
  const { fullName, email, phone, location, jobTitle } = req.body;
  const resumeBuffer = req.file ? req.file.buffer : null;
  const resumeFilename = req.file ? req.file.originalname : null;

  if (!fullName || !email || !phone || !resumeBuffer) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  let dbInserted = false;
  let emailSent = false;

  // 1. Try to insert into database
  try {
    const db = getPool();
    await db.query(
      'INSERT INTO career (full_name, email, phone, location, resume, resume_filename, created_at) VALUES (?, ?, ?, ?, ?, ?, NOW())',
      [fullName, email, phone, location, resumeBuffer, resumeFilename]
    );
    dbInserted = true;
  } catch (err) {
    console.warn('Database error (skipping database insert for career application):', err.message);
  }

  // 2. Send email notification with the attached resume
  try {
    if (hasPlaceholderMailConfig()) {
      throw new Error('EMAIL_USER / EMAIL_PASS are still placeholder values. Configure a real Gmail account or app password before sending mail.');
    }

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
          filename: resumeFilename || 'resume.pdf',
          content: resumeBuffer
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

  // If both database insert and email sending failed, return a 500 error
  if (!dbInserted && !emailSent) {
    return res.status(500).json({ error: 'Application submission failed' });
  }

  if (!emailSent) {
    return res.status(500).json({
      success: false,
      dbInserted,
      emailSent,
      error: 'Application was received, but email delivery failed. Please configure valid SMTP credentials.'
    });
  }

  res.json({ success: true, dbInserted, emailSent });
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

/* ============================================================
   ANALYTICS SYSTEM (Promise-based for Vercel Serverless)
   ============================================================ */

let tablesChecked = false;
async function ensureTables(db) {
  if (tablesChecked) return;
  try {
    const createVisitors = `
      CREATE TABLE IF NOT EXISTS analytics_visitors (
        id BIGINT AUTO_INCREMENT PRIMARY KEY,
        visitor_id CHAR(36) NOT NULL,
        first_seen DATETIME NOT NULL,
        last_seen DATETIME NOT NULL,
        visit_count INT DEFAULT 1,
        INDEX(visitor_id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `;

    const createSessions = `
      CREATE TABLE IF NOT EXISTS analytics_sessions (
        id BIGINT AUTO_INCREMENT PRIMARY KEY,
        visitor_id CHAR(36) NOT NULL,
        session_id CHAR(36) NOT NULL,
        started_at DATETIME NOT NULL,
        ended_at DATETIME,
        duration_seconds INT,
        INDEX(visitor_id),
        INDEX(session_id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `;

    const createEvents = `
      CREATE TABLE IF NOT EXISTS analytics_events (
        id BIGINT AUTO_INCREMENT PRIMARY KEY,
        visitor_id CHAR(36),
        session_id CHAR(36),
        event_type VARCHAR(64) NOT NULL,
        event_name VARCHAR(128),
        page VARCHAR(255),
        meta JSON,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        INDEX(event_type),
        INDEX(created_at)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `;

    await db.query(createVisitors);
    await db.query(createSessions);
    await db.query(createEvents);
    tablesChecked = true;
    console.log("Analytics tables verified/created");
  } catch (err) {
    console.error("Error creating analytics tables:", err.message);
  }
}

const fallbackAnalytics = {
  visitors: new Map(),
  sessions: new Map(),
  pageViews: new Map(),
  events: new Map(),
  recentEvents: []
};

function normalizeEmail(value) {
  if (!value) return null;
  const email = String(value).trim().toLowerCase();
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? email : null;
}

function normalizeHost(value) {
  if (!value) return null;
  return String(value).trim().toLowerCase();
}

function recordFallbackEvent({ visitor_id, session_id, event_type, event_name, page, email, host, full_url }) {
  const nowMs = Date.now();
  const normalizedEmail = normalizeEmail(email);
  const normalizedHost = normalizeHost(host);

  if (event_type === 'session_start' && visitor_id) {
    const existing = fallbackAnalytics.visitors.get(visitor_id);
    if (existing) {
      existing.lastSeen = nowMs;
      existing.visitCount += 1;
    } else {
      fallbackAnalytics.visitors.set(visitor_id, {
        firstSeen: nowMs,
        lastSeen: nowMs,
        visitCount: 1
      });
    }

    if (session_id) {
      fallbackAnalytics.sessions.set(session_id, {
        visitorId: visitor_id,
        startedAt: nowMs,
        endedAt: null,
        durationSeconds: null,
        host: normalizedHost
      });
    }
  }

  if (event_type === 'session_end' && session_id) {
    const session = fallbackAnalytics.sessions.get(session_id);
    if (session && session.startedAt) {
      session.endedAt = nowMs;
      session.durationSeconds = Math.max(0, Math.floor((nowMs - session.startedAt) / 1000));
    }
  }

  if (event_type === 'page_view' && page) {
    fallbackAnalytics.pageViews.set(page, (fallbackAnalytics.pageViews.get(page) || 0) + 1);
  }

  if ((event_type === 'click' || event_type === 'form_submit') && event_name) {
    const key = `${event_type}::${event_name}`;
    fallbackAnalytics.events.set(key, (fallbackAnalytics.events.get(key) || 0) + 1);
  }

  fallbackAnalytics.recentEvents.unshift({
    created_at: new Date(nowMs).toISOString(),
    visitor_id: visitor_id || null,
    session_id: session_id || null,
    event_type: event_type || null,
    event_name: event_name || null,
    page: page || null,
    email: normalizedEmail,
    host: normalizedHost,
    full_url: full_url || null
  });
  if (fallbackAnalytics.recentEvents.length > 1000) {
    fallbackAnalytics.recentEvents.length = 1000;
  }
}

function getHostFilter(rawHost) {
  const normalized = normalizeHost(rawHost);
  if (!normalized || normalized === 'all') return null;
  return normalized;
}

function buildFallbackSummary(hostFilter = null) {
  const normalizedHost = getHostFilter(hostFilter);
  if (normalizedHost) {
    const items = fallbackAnalytics.recentEvents.filter((item) => item.host === normalizedHost);
    const visitors = new Map();
    const pages = new Map();
    const events = new Map();

    for (const item of items) {
      if (item.event_type === 'session_start' && item.visitor_id) {
        visitors.set(item.visitor_id, (visitors.get(item.visitor_id) || 0) + 1);
      }
      if (item.event_type === 'page_view' && item.page) {
        pages.set(item.page, (pages.get(item.page) || 0) + 1);
      }
      if ((item.event_type === 'click' || item.event_type === 'form_submit') && item.event_name) {
        const key = `${item.event_type}::${item.event_name}`;
        events.set(key, (events.get(key) || 0) + 1);
      }
    }

    const totalVisitors = visitors.size;
    const returningVisitors = Array.from(visitors.values()).filter((count) => count > 1).length;
    const topPages = Array.from(pages.entries())
      .map(([page, cnt]) => ({ page, cnt }))
      .sort((a, b) => b.cnt - a.cnt)
      .slice(0, 10);
    const topEvents = Array.from(events.entries())
      .map(([key, cnt]) => {
        const splitAt = key.indexOf('::');
        return {
          event_type: splitAt >= 0 ? key.slice(0, splitAt) : 'click',
          event_name: splitAt >= 0 ? key.slice(splitAt + 2) : key,
          cnt
        };
      })
      .sort((a, b) => b.cnt - a.cnt)
      .slice(0, 20);

    return {
      total_visitors: totalVisitors,
      returning_visitors: returningVisitors,
      top_pages: topPages,
      top_events: topEvents,
      avg_session_seconds: 0,
      source: 'memory',
      host: normalizedHost
    };
  }

  const totalVisitors = fallbackAnalytics.visitors.size;
  let returningVisitors = 0;

  for (const v of fallbackAnalytics.visitors.values()) {
    if ((v.visitCount || 0) > 1) returningVisitors += 1;
  }

  const topPages = Array.from(fallbackAnalytics.pageViews.entries())
    .map(([page, cnt]) => ({ page, cnt }))
    .sort((a, b) => b.cnt - a.cnt)
    .slice(0, 10);

  const topEvents = Array.from(fallbackAnalytics.events.entries())
    .map(([key, cnt]) => {
      const splitAt = key.indexOf('::');
      const eventType = splitAt >= 0 ? key.slice(0, splitAt) : 'click';
      const eventName = splitAt >= 0 ? key.slice(splitAt + 2) : key;
      return {
        event_name: eventName,
        event_type: eventType,
        cnt
      };
    })
    .sort((a, b) => b.cnt - a.cnt)
    .slice(0, 20);

  const durationValues = [];
  for (const session of fallbackAnalytics.sessions.values()) {
    if (typeof session.durationSeconds === 'number') {
      durationValues.push(session.durationSeconds);
    }
  }

  const avg = durationValues.length > 0
    ? Math.round(durationValues.reduce((acc, cur) => acc + cur, 0) / durationValues.length)
    : 0;

  return {
    total_visitors: totalVisitors,
    returning_visitors: returningVisitors,
    top_pages: topPages,
    top_events: topEvents,
    avg_session_seconds: avg,
    source: 'memory',
    host: normalizedHost || 'all'
  };
}

function mapActivityRow(row) {
  let meta = row.meta || {};
  if (typeof meta === 'string') {
    try {
      meta = JSON.parse(meta);
    } catch (err) {
      meta = {};
    }
  }

  const email = normalizeEmail(meta.email || row.email || null);
  const host = normalizeHost(meta.host || null);
  return {
    created_at: row.created_at,
    visitor_id: row.visitor_id || null,
    session_id: row.session_id || null,
    event_type: row.event_type || null,
    event_name: row.event_name || null,
    page: row.page || null,
    email,
    host,
    full_url: meta.full_url || null
  };
}

function buildActivityPayload(items, hostFilter, source, limit) {
  const normalizedHost = getHostFilter(hostFilter);
  const filtered = normalizedHost
    ? items.filter((item) => normalizeHost(item.host) === normalizedHost)
    : items;

  const limited = filtered.slice(0, limit);
  const byEmailMap = new Map();

  for (const item of filtered) {
    if (!item.email) continue;
    byEmailMap.set(item.email, (byEmailMap.get(item.email) || 0) + 1);
  }

  const by_email = Array.from(byEmailMap.entries())
    .map(([email, cnt]) => ({ email, cnt }))
    .sort((a, b) => b.cnt - a.cnt)
    .slice(0, 50);

  return {
    source,
    host: normalizedHost || 'all',
    total_items: filtered.length,
    items: limited,
    by_email
  };
}

function getFallbackActivity(hostFilter = null, limit = 100) {
  return buildActivityPayload(fallbackAnalytics.recentEvents, hostFilter, 'memory', limit);
}

async function getDbActivity(hostFilter = null, limit = 100) {
  const db = getPool();
  await ensureTables(db);
  const normalizedHost = getHostFilter(hostFilter);
  // Filter by host directly in SQL so we don't miss events due to LIMIT
  let rows;
  if (normalizedHost) {
    // meta->>'$.host' works on MySQL 5.7+ / TiDB
    [rows] = await db.query(
      `SELECT visitor_id, session_id, event_type, event_name, page, meta, created_at
       FROM analytics_events
       WHERE JSON_UNQUOTE(JSON_EXTRACT(meta, '$.host')) = ?
       ORDER BY created_at DESC LIMIT ?`,
      [normalizedHost, Math.min(limit * 2, 1000)]
    );
  } else {
    [rows] = await db.query(
      'SELECT visitor_id, session_id, event_type, event_name, page, meta, created_at FROM analytics_events ORDER BY created_at DESC LIMIT ?',
      [Math.min(limit * 2, 1000)]
    );
  }
  const items = rows.map(mapActivityRow);
  return buildActivityPayload(items, hostFilter, 'mysql', limit);
}

async function getAnalyticsSummary(hostFilter = null) {
  try {
    const db = getPool();
    await ensureTables(db);

    const normalizedHost = getHostFilter(hostFilter);

    if (normalizedHost) {
      // Fetch all events for this host directly from DB with SQL filter
      const [allRows] = await db.query(
        `SELECT visitor_id, session_id, event_type, event_name, page, meta, created_at
         FROM analytics_events
         WHERE JSON_UNQUOTE(JSON_EXTRACT(meta, '$.host')) = ?
         ORDER BY created_at DESC LIMIT 5000`,
        [normalizedHost]
      );
      const allItems = allRows.map(mapActivityRow);

      const visitors = new Map();
      const pages = new Map();
      const events = new Map();

      for (const item of allItems) {
        if (item.event_type === 'session_start' && item.visitor_id) {
          visitors.set(item.visitor_id, (visitors.get(item.visitor_id) || 0) + 1);
        }
        if (item.event_type === 'page_view' && item.page) {
          pages.set(item.page, (pages.get(item.page) || 0) + 1);
        }
        if ((item.event_type === 'click' || item.event_type === 'form_submit') && item.event_name) {
          const key = `${item.event_type}::${item.event_name}`;
          events.set(key, (events.get(key) || 0) + 1);
        }
      }

      // Avg session duration from DB
      let avgSec = 0;
      try {
        const [sessRows] = await db.query(
          `SELECT AVG(duration_seconds) AS avg_d FROM analytics_sessions s
           INNER JOIN analytics_events e ON e.session_id = s.session_id
           WHERE JSON_UNQUOTE(JSON_EXTRACT(e.meta, '$.host')) = ? AND s.duration_seconds IS NOT NULL`,
          [normalizedHost]
        );
        avgSec = sessRows[0] ? Math.round(sessRows[0].avg_d || 0) : 0;
      } catch (_) {}

      return {
        total_visitors: visitors.size,
        returning_visitors: Array.from(visitors.values()).filter((count) => count > 1).length,
        top_pages: Array.from(pages.entries()).map(([page, cnt]) => ({ page, cnt })).sort((a, b) => b.cnt - a.cnt).slice(0, 10),
        top_events: Array.from(events.entries()).map(([key, cnt]) => {
          const splitAt = key.indexOf('::');
          return {
            event_type: splitAt >= 0 ? key.slice(0, splitAt) : 'click',
            event_name: splitAt >= 0 ? key.slice(splitAt + 2) : key,
            cnt
          };
        }).sort((a, b) => b.cnt - a.cnt).slice(0, 20),
        avg_session_seconds: avgSec,
        source: 'mysql',
        host: normalizedHost
      };
    }

    const qTotalVisitors = 'SELECT COUNT(*) AS cnt FROM analytics_visitors';
    const qReturning = 'SELECT COUNT(*) AS cnt FROM analytics_visitors WHERE visit_count > 1';
    const qTopPages = `SELECT page, COUNT(*) AS cnt FROM analytics_events WHERE event_type = 'page_view' GROUP BY page ORDER BY cnt DESC LIMIT 10`;
    const qTopEvents = `SELECT event_name, event_type, COUNT(*) AS cnt FROM analytics_events WHERE event_type IN ('click','form_submit') GROUP BY event_type, event_name ORDER BY cnt DESC LIMIT 20`;
    const qAvgSession = 'SELECT AVG(duration_seconds) AS avg_d FROM analytics_sessions WHERE duration_seconds IS NOT NULL';

    const [rRes, r2Res, r3Res, r4Res, r5Res] = await Promise.all([
      db.query(qTotalVisitors),
      db.query(qReturning),
      db.query(qTopPages),
      db.query(qTopEvents),
      db.query(qAvgSession)
    ]);

    const r = rRes[0];
    const r2 = r2Res[0];
    const r3 = r3Res[0];
    const r4 = r4Res[0];
    const r5 = r5Res[0];

    return {
      total_visitors: r[0] ? r[0].cnt : 0,
      returning_visitors: r2[0] ? r2[0].cnt : 0,
      top_pages: r3 || [],
      top_events: r4 || [],
      avg_session_seconds: !r5[0] ? 0 : Math.round(r5[0].avg_d || 0),
      source: 'mysql',
      host: normalizedHost || 'all'
    };
  } catch (err) {
    console.error('Analytics summary query error:', err.message);
    return buildFallbackSummary(hostFilter);
  }
}

app.post('/api/track', async (req, res) => {
  try {
    const { visitor_id, session_id, event_type, event_name, page, meta, email } = req.body || {};
    if (!event_type) return res.status(400).json({ error: 'event_type required' });

    const safeMeta = Object.assign({}, meta || {});
    const normalizedEmail = normalizeEmail(email || safeMeta.email || null);
    if (normalizedEmail) safeMeta.email = normalizedEmail;
    safeMeta.host = normalizeHost(safeMeta.host || null);
    safeMeta.full_url = safeMeta.full_url || null;

    // Keep memory fallback updated
    recordFallbackEvent({
      visitor_id,
      session_id,
      event_type,
      event_name,
      page,
      email: normalizedEmail,
      host: safeMeta.host,
      full_url: safeMeta.full_url
    });

    // Write to DB
    try {
      const db = getPool();
      await ensureTables(db);

      // Insert event
      const eventSql = 'INSERT INTO analytics_events (visitor_id, session_id, event_type, event_name, page, meta) VALUES (?, ?, ?, ?, ?, ?)';
      await db.query(eventSql, [visitor_id || null, session_id || null, event_type, event_name || null, page || null, JSON.stringify(safeMeta)]);

      // If session_start, upsert visitor and create session
      if (event_type === 'session_start') {
        const now = new Date();
        const sel = 'SELECT id, visit_count FROM analytics_visitors WHERE visitor_id = ? LIMIT 1';
        const [results] = await db.query(sel, [visitor_id]);
        if (results && results.length > 0) {
          const visitCount = (results[0].visit_count || 0) + 1;
          await db.query('UPDATE analytics_visitors SET last_seen = ?, visit_count = ? WHERE visitor_id = ?', [now, visitCount, visitor_id]);
        } else {
          await db.query('INSERT INTO analytics_visitors (visitor_id, first_seen, last_seen, visit_count) VALUES (?, ?, ?, ?)', [visitor_id, now, now, 1]);
        }

        await db.query('INSERT INTO analytics_sessions (visitor_id, session_id, started_at) VALUES (?, ?, ?)', [visitor_id, session_id, new Date()]);
      }

      // If session_end, update session duration
      if (event_type === 'session_end') {
        if (session_id) {
          const [sessionRows] = await db.query('SELECT started_at FROM analytics_sessions WHERE session_id = ? ORDER BY id DESC LIMIT 1', [session_id]);
          if (sessionRows && sessionRows.length > 0) {
            const startedAt = sessionRows[0].started_at;
            const endedAt = new Date();
            const duration = Math.max(0, Math.floor((endedAt - startedAt) / 1000));
            await db.query('UPDATE analytics_sessions SET ended_at = ?, duration_seconds = ? WHERE session_id = ? AND ended_at IS NULL', [endedAt, duration, session_id]);
          }
        }
      }

      res.json({ status: 'ok', source: 'mysql' });
    } catch (dbErr) {
      console.warn('Database analytics write error:', dbErr.message);
      res.json({ status: 'ok', source: 'memory' });
    }
  } catch (err) {
    console.error('Track endpoint error:', err.message);
    res.status(500).json({ error: 'server error' });
  }
});

app.get('/api/analytics/summary', async (req, res) => {
  try {
    const host = req.query.host || null;
    const summary = await getAnalyticsSummary(host);
    res.json(summary);
  } catch (err) {
    console.error('Analytics summary error:', err.message);
    res.status(500).json({ error: 'server error' });
  }
});

app.get('/api/analytics/activity', async (req, res) => {
  try {
    const host = req.query.host || 'www.minehrsolutions.com';
    const limit = Math.max(1, Math.min(500, parseInt(req.query.limit || '100', 10)));

    try {
      const activity = await getDbActivity(host, limit);
      res.json(activity);
    } catch (dbErr) {
      console.warn('Database analytics activity read error, falling back:', dbErr.message);
      res.json(getFallbackActivity(host, limit));
    }
  } catch (err) {
    console.error('Analytics activity error:', err.message);
    res.status(500).json({ error: 'server error' });
  }
});

module.exports = app;
