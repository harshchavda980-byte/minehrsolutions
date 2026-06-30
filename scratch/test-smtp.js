require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const nodemailer = require('nodemailer');

const user = process.env.EMAIL_USER || process.env.MAIL_USERNAME;
const pass = process.env.EMAIL_PASS || process.env.MAIL_PASSWORD;

console.log('User:', user);
console.log('Pass:', pass);

const transporter = nodemailer.createTransport({
  host: 'smtp.hostinger.com',
  port: 587,
  secure: false,
  requireTLS: true,
  auth: { user, pass },
  tls: { rejectUnauthorized: false }
});

transporter.verify((err, success) => {
  if (err) {
    console.log('FAIL:', err.message);
    console.log('Code:', err.code);
    process.exit(1);
  } else {
    console.log('SUCCESS: SMTP verified! Sending test email...');
    transporter.sendMail({
      from: '"MineHR Solutions" <' + user + '>',
      to: user,
      subject: 'SMTP Test - MineHR Solutions',
      text: 'SMTP is working correctly! This is a test email.'
    }, (sendErr, info) => {
      if (sendErr) {
        console.log('Send FAIL:', sendErr.message);
      } else {
        console.log('Email sent successfully! ID:', info.messageId);
      }
    });
  }
});
