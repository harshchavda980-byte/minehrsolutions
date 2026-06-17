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

const rootNavHTML = `        <nav class="navbar-menu" id="navMenu">
          <a href="index.html" class="nav-link">Home</a>
          <a href="services.html" class="nav-link">Services</a>
          <a href="trust.html" class="nav-link">Trust</a>
          <a href="career.html" class="nav-link">Career</a>
          <a href="blog.html" class="nav-link">Blog</a>
          <div class="nav-dropdown">
            <a href="#" class="nav-link dropdown-toggle" onclick="return false;">
              Product
              <svg class="dropdown-chevron" width="10" height="10" viewBox="0 0 10 6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M1 1L5 5L9 1" />
              </svg>
            </a>
            <div class="dropdown-menu">
              <a href="ats.html" class="dropdown-item">
                <span class="item-title">ATS</span>
                <span class="item-desc">Applicant Tracking System</span>
              </a>
              <a href="crm.html" class="dropdown-item">
                <span class="item-title">CRM</span>
                <span class="item-desc">Customer Relations</span>
              </a>
            </div>
          </div>
          <!-- Contact Us CTA for mobile menu -->
          <a href="contact.html" class="nav-cta-btn mobile-only">
            <span>Contact Us</span>
            <svg class="cta-arrow" width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M6 12L10 8L6 4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
          </a>
        </nav>`;

const servicesNavHTML = `                <nav class="navbar-menu" id="navMenu">
                    <a href="../index.html" class="nav-link">Home</a>
                    <a href="../services.html" class="nav-link">Services</a>
                    <a href="../trust.html" class="nav-link">Trust</a>
                    <a href="../career.html" class="nav-link">Career</a>
                    <a href="../blog.html" class="nav-link">Blog</a>
                    <div class="nav-dropdown">
                        <a href="#" class="nav-link dropdown-toggle" onclick="return false;">
                            Product
                            <svg class="dropdown-chevron" width="10" height="10" viewBox="0 0 10 6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <path d="M1 1L5 5L9 1" />
                            </svg>
                        </a>
                        <div class="dropdown-menu">
                            <a href="../ats.html" class="dropdown-item">
                                <span class="item-title">ATS</span>
                                <span class="item-desc">Applicant Tracking System</span>
                            </a>
                            <a href="../crm.html" class="dropdown-item">
                                <span class="item-title">CRM</span>
                                <span class="item-desc">Customer Relations</span>
                            </a>
                        </div>
                    </div>
                    <!-- Contact Us CTA for mobile menu -->
                    <a href="../contact.html" class="nav-cta-btn mobile-only">
                        <span>Contact Us</span>
                        <svg class="cta-arrow" width="16" height="16" viewBox="0 0 16 16" fill="none">
                            <path d="M6 12L10 8L6 4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                        </svg>
                    </a>
                </nav>`;

// Helper function to replace nav bar in a file
function updateFile(filePath, newNavHTML) {
  if (!fs.existsSync(filePath)) {
    console.log(`File not found: ${filePath}`);
    return;
  }
  let content = fs.readFileSync(filePath, 'utf8');
  const navRegex = /<nav class="navbar-menu"\s+id="navMenu">[\s\S]*?<\/nav>/;
  if (navRegex.test(content)) {
    content = content.replace(navRegex, newNavHTML);
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Successfully updated: ${filePath}`);
  } else {
    console.log(`Could not find navbar in: ${filePath}`);
  }
}

// Update all root files
rootFiles.forEach(file => {
  updateFile(file, rootNavHTML);
});

// Update all services files
servicesFiles.forEach(file => {
  updateFile(file, servicesNavHTML);
});

console.log('All navigation bars updated successfully.');
