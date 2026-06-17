const fs = require('fs');
const path = require('path');

const rootFiles = [
  'index.html',
  'ats.html',
  'career.html',
  'blog.html',
  'contact.html',
  'services.html',
  'trust.html',
  'blog-detail.html',
  'crm.html',
  'ems.html',
  'public/index.html',
  'public/components/navbar-premium.html'
];

const servicesDir = 'services';
const servicesFiles = fs.readdirSync(servicesDir)
  .filter(file => file.endsWith('.html'))
  .map(file => path.join(servicesDir, file));

const rootFooterHTML = `        <!-- Right Side: Links -->
        <div class="footer-links-section">
          <div class="footer-col">
            <h3>Quick Links</h3>
            <ul>
              <li><a href="index.html">Home</a></li>
              <li><a href="trust.html">Trust</a></li>
              <li><a href="services.html">Services</a></li>
              <li><a href="contact.html">Contact Us</a></li>
            </ul>
          </div>

          <div class="footer-col">
            <h3>Product</h3>
            <ul>
              <li><a href="ats.html">ATS</a></li>
              <li><a href="crm.html">CRM</a></li>
            </ul>
          </div>

          <div class="footer-col">
            <h3>Services</h3>
            <ul>
              <li><a href="services/hrms-software.html">HR Solutions</a></li>
              <li><a href="services/payroll-management.html">Payroll Management</a></li>
              <li><a href="services/recruitment-staffing.html">Talent Acquisition</a></li>
              <li><a href="services/employee-relations.html">Employee Relations</a></li>
            </ul>
          </div>

          <div class="footer-col contact-col">`;

const servicesFooterHTML = `                <!-- Right Side: Links -->
                <div class="footer-links-section">
                    <div class="footer-col">
                        <h3>Quick Links</h3>
                        <ul>
                            <li><a href="../index.html">Home</a></li>
                            <li><a href="../trust.html">Trust</a></li>
                            <li><a href="../services.html">Services</a></li>
                            <li><a href="../contact.html">Contact Us</a></li>
                        </ul>
                    </div>

                    <div class="footer-col">
                        <h3>Product</h3>
                        <ul>
                            <li><a href="../ats.html">ATS</a></li>
                            <li><a href="../crm.html">CRM</a></li>
                        </ul>
                    </div>

                    <div class="footer-col">
                        <h3>Services</h3>
                        <ul>
                            <li><a href="hrms-software.html">HR Solutions</a></li>
                            <li><a href="payroll-management.html">Payroll Management</a></li>
                            <li><a href="crm-solutions.html">CRM Solutions</a></li>
                            <li><a href="employee-relations.html">Employee Relations</a></li>
                        </ul>
                    </div>

                    <div class="footer-col contact-col">`;

function updateFooter(filePath, newFooterHTML) {
  if (!fs.existsSync(filePath)) {
    console.log(`File not found: ${filePath}`);
    return;
  }
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Regex to match the links section starting from "footer-links-section" up to "footer-col contact-col"
  const footerRegex = /<!--\s*Right Side:\s*Links\s*-->[\s\S]*?<div class="footer-col contact-col">/;
  
  if (footerRegex.test(content)) {
    content = content.replace(footerRegex, newFooterHTML);
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Successfully updated footer: ${filePath}`);
  } else {
    // Attempt fallback matching without the comment
    const fallbackRegex = /<div class="footer-links-section">[\s\S]*?<div class="footer-col contact-col">/;
    if (fallbackRegex.test(content)) {
      content = content.replace(fallbackRegex, newFooterHTML);
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`Successfully updated footer (fallback): ${filePath}`);
    } else {
      console.log(`Could not find footer section in: ${filePath}`);
    }
  }
}

// Update all root files
rootFiles.forEach(file => {
  updateFooter(file, rootFooterHTML);
});

// Update all services files
servicesFiles.forEach(file => {
  updateFooter(file, servicesFooterHTML);
});

console.log('All footers updated successfully.');
