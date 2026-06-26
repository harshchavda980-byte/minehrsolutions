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

module.exports = app;
