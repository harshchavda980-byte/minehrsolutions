const fs = require('fs');
const path = require('path');

const servicesDir = path.join(__dirname, '../services');
const htmlFiles = fs.readdirSync(servicesDir).filter(f => f.endsWith('.html'));

const searchOverlayHtml = `
    <!-- Search Overlay -->
    <div class="search-overlay" id="searchOverlay">
      <div class="search-container">
        <div class="search-box">
          <svg class="search-box-icon" width="24" height="24" viewBox="0 0 20 20" fill="none" stroke="currentColor">
            <circle cx="9" cy="9" r="6" stroke-width="2" />
            <path d="M14 14L18 18" stroke-width="2" stroke-linecap="round" />
          </svg>
          <input type="text" class="search-input" placeholder="Search services, blog posts..." id="searchInput"
            autocomplete="off" />
          <button class="search-close" id="searchClose" aria-label="Close search">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor">
              <path d="M4 4L16 16M16 4L4 16" stroke-width="2" stroke-linecap="round" />
            </svg>
          </button>
        </div>
        <div class="search-suggestions">
          <div class="search-suggestion-item">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
              <path d="M8 0a8 8 0 100 16A8 8 0 008 0zm0 14a6 6 0 110-12 6 6 0 010 12z" />
            </svg>
            <span>HRMS Software</span>
          </div>
          <div class="search-suggestion-item">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
              <path d="M8 0a8 8 0 100 16A8 8 0 008 0zm0 14a6 6 0 110-12 6 6 0 010 12z" />
            </svg>
            <span>Payroll Management</span>
          </div>
          <div class="search-suggestion-item">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
              <path d="M8 0a8 8 0 100 16A8 8 0 008 0zm0 14a6 6 0 110-12 6 6 0 010 12z" />
            </svg>
            <span>Web Development</span>
          </div>
        </div>
      </div>
    </div>
  </header>
`;

let count = 0;
for (const file of htmlFiles) {
  const filePath = path.join(servicesDir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  
  if (!content.includes('id="searchOverlay"')) {
    content = content.replace('  </header>', searchOverlayHtml.trim());
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated ${file}`);
    count++;
  } else {
    console.log(`Skipped ${file} (already has search overlay)`);
  }
}
console.log(`Done. Updated ${count} files.`);
