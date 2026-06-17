const fs = require('fs');
const path = require('path');

// Social media links
const FB_LINK = 'https://www.facebook.com/profile.php?id=61580893096733';
const INSTA_LINK = 'https://www.instagram.com/minehr_solutions?igsh=bDVjZjZyODV5dG8x';
const LINKEDIN_LINK = 'https://www.linkedin.com/feed/update/urn:li:activity:7465706552369508352';
const TWITTER_LINK = '#'; // to be provided later

const socialIconsHTML = `            <div class="social-icons">
              <a href="${FB_LINK}" target="_blank" rel="noopener noreferrer" class="social-btn facebook"><svg viewBox="0 0 24 24">
                  <path fill="currentColor" d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z">
                  </path>
                </svg></a>
              <a href="${INSTA_LINK}" target="_blank" rel="noopener noreferrer" class="social-btn instagram"><svg viewBox="0 0 24 24">
                  <path fill="currentColor" d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.051.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z">
                  </path>
                </svg></a>
              <a href="${TWITTER_LINK}" class="social-btn twitter"><svg viewBox="0 0 24 24">
                  <path fill="currentColor"
                    d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z">
                  </path>
                </svg></a>
              <a href="${LINKEDIN_LINK}" target="_blank" rel="noopener noreferrer" class="social-btn linkedin"><svg viewBox="0 0 24 24">
                  <path fill="currentColor"
                    d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2zM4 2a2 2 0 1 1-2 2 2 2 0 0 1 2-2z">
                  </path>
                </svg></a>
            </div>`;

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');

  // Check if it contains the contact column
  if (!content.includes('contact-col')) {
    return;
  }

  // 1. Remove existing social-icons block if present
  const socialIconsRegex = /<div class="social-icons">[\s\S]*?<\/div>/g;
  content = content.replace(socialIconsRegex, '');

  // 2. Find the contact column list block (from "footer-col contact-col" to the closing "</ul>")
  const contactColRegex = /(<div class="[^"]*contact-col[^"]*">[\s\S]*?<\/ul>)/;

  if (contactColRegex.test(content)) {
    content = content.replace(contactColRegex, `$1\n${socialIconsHTML}`);
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated social links in: ${filePath}`);
  } else {
    console.log(`Failed to parse contact-col structure in: ${filePath}`);
  }
}

function walkDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      if (file !== 'node_modules' && file !== '.git') {
        walkDir(filePath);
      }
    } else if (file.endsWith('.html')) {
      processFile(filePath);
    }
  }
}

// Start processing from root
const projectRoot = path.join(__dirname, '..');
walkDir(projectRoot);
console.log('All footers updated successfully.');
