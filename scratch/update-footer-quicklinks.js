/**
 * Adds Career & Blog to the Quick Links footer section
 * on all HTML pages, and also adds data-page attributes
 * so JS can auto-hide the current page's link.
 *
 * Run with: node scratch/update-footer-quicklinks.js
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');

const files = [
  'index.html',
  'trust.html',
  'services.html',
  'career.html',
  'blog.html',
  'blog-detail.html',
  'contact.html',
  'ats.html',
  'crm.html',
  'ems.html',
];

// The complete updated Quick Links block (all 6 links with data-page attributes)
const OLD_QUICK_LINKS = `              <li><a href="index.html">Home</a></li>
              <li><a href="trust.html">Trust</a></li>
              <li><a href="services.html">Services</a></li>
              <li><a href="contact.html">Contact Us</a></li>`;

const NEW_QUICK_LINKS = `              <li><a href="index.html" data-footer-link="index.html">Home</a></li>
              <li><a href="trust.html" data-footer-link="trust.html">Trust</a></li>
              <li><a href="services.html" data-footer-link="services.html">Services</a></li>
              <li><a href="career.html" data-footer-link="career.html">Career</a></li>
              <li><a href="blog.html" data-footer-link="blog.html">Blog</a></li>
              <li><a href="contact.html" data-footer-link="contact.html">Contact Us</a></li>`;

let updatedCount = 0;

files.forEach(file => {
  const filePath = path.join(ROOT, file);
  if (!fs.existsSync(filePath)) {
    console.log(`⚠  Skipped (not found): ${file}`);
    return;
  }

  let content = fs.readFileSync(filePath, 'utf8');

  if (content.includes(OLD_QUICK_LINKS)) {
    content = content.replace(OLD_QUICK_LINKS, NEW_QUICK_LINKS);
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`✅ Updated: ${file}`);
    updatedCount++;
  } else if (content.includes('data-footer-link')) {
    console.log(`ℹ  Already updated: ${file}`);
  } else {
    console.log(`⚠  Pattern not matched: ${file} — check manually`);
  }
});

console.log(`\nDone. ${updatedCount} file(s) updated.`);
