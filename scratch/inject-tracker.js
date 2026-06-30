/**
 * inject-tracker.js
 * Adds tracker.js to all public HTML pages (not admin pages).
 * Run: node scratch/inject-tracker.js
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const TRACKER_TAG = '<script src="/public/js/tracker.js" defer></script>';

const TARGET_FILES = [
  'index.html',
  'contact.html',
  'blog.html',
  'blog-detail.html',
  'ats.html',
  'crm.html',
  'career.html',
  'services.html',
  'trust.html',
  'ems.html',
  'services/ems.html',
  'services/crm-solutions.html',
  'services/custom-software.html',
  'services/hr-services.html',
  'services/hrms-software.html',
  'services/it-support.html',
  'services/logo-branding.html',
  'services/payroll-management.html',
  'services/recruitment-staffing.html',
  'services/web-development.html',
  'services/employee-relations.html',
];

let updated = 0;
let skipped = 0;

for (const rel of TARGET_FILES) {
  const filePath = path.join(ROOT, rel);
  if (!fs.existsSync(filePath)) {
    console.log(`  SKIP (not found): ${rel}`);
    skipped++;
    continue;
  }
  let content = fs.readFileSync(filePath, 'utf8');
  if (content.includes('tracker.js')) {
    console.log(`  SKIP (already has tracker): ${rel}`);
    skipped++;
    continue;
  }
  // Insert before </body>
  content = content.replace('</body>', `  ${TRACKER_TAG}\n</body>`);
  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`  UPDATED: ${rel}`);
  updated++;
}

console.log(`\nDone. Updated: ${updated}, Skipped: ${skipped}`);
