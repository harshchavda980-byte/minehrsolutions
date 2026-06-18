const fs = require('fs');
const path = require('path');

const SERVICES_DIR = path.join(__dirname, '..', 'services');

const files = fs.readdirSync(SERVICES_DIR).filter(file => file.endsWith('.html'));

const OLD_QUICK_LINKS = `                        <h3>Quick Links</h3>
                        <ul>
                            <li><a href="../index.html">Home</a></li>
                            <li><a href="../trust.html">Trust</a></li>
                            <li><a href="../services.html">Services</a></li>
                            <li><a href="../contact.html">Contact Us</a></li>
                        </ul>`;

const NEW_QUICK_LINKS = `                        <h3>Quick Links</h3>
                        <ul>
                            <li><a href="../index.html" data-footer-link="index.html">Home</a></li>
                            <li><a href="../trust.html" data-footer-link="trust.html">Trust</a></li>
                            <li><a href="../services.html" data-footer-link="services.html">Services</a></li>
                            <li><a href="../career.html" data-footer-link="career.html">Career</a></li>
                            <li><a href="../blog.html" data-footer-link="blog.html">Blog</a></li>
                            <li><a href="../contact.html" data-footer-link="contact.html">Contact Us</a></li>
                        </ul>`;

let updatedCount = 0;

files.forEach(file => {
  const filePath = path.join(SERVICES_DIR, file);
  let content = fs.readFileSync(filePath, 'utf8');

  // Let's normalize whitespace/newlines to ensure match
  const normalizedContent = content.replace(/\r\n/g, '\n');
  const normalizedOld = OLD_QUICK_LINKS.replace(/\r\n/g, '\n');

  if (normalizedContent.includes(normalizedOld)) {
    content = normalizedContent.replace(normalizedOld, NEW_QUICK_LINKS.replace(/\r\n/g, '\n'));
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`✅ Updated: services/${file}`);
    updatedCount++;
  } else if (content.includes('data-footer-link')) {
    console.log(`ℹ  Already updated: services/${file}`);
  } else {
    console.log(`⚠  Pattern not matched: services/${file} — checking variations`);
    // Try a more loose match
    const loosePattern = /<h3>Quick Links<\/h3>\s*<ul>\s*<li><a href="\.\.\/index\.html">Home<\/a><\/li>\s*<li><a href="\.\.\/trust\.html">Trust<\/a><\/li>\s*<li><a href="\.\.\/services\.html">Services<\/a><\/li>\s*<li><a href="\.\.\/contact\.html">Contact Us<\/a><\/li>\s*<\/ul>/i;
    if (loosePattern.test(content)) {
      content = content.replace(loosePattern, NEW_QUICK_LINKS);
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`✅ Updated (loose match): services/${file}`);
      updatedCount++;
    } else {
      console.log(`❌ Failed match even loosely for: services/${file}`);
    }
  }
});

console.log(`\nServices update complete. ${updatedCount} file(s) updated.`);
