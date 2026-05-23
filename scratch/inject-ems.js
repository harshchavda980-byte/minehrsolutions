const fs = require('fs');
const path = require('path');

// Root files to update
const rootFiles = [
  'index.html',
  'ats.html',
  'crm.html',
  'career.html',
  'blog.html',
  'contact.html',
  'services.html',
  'trust.html'
];

rootFiles.forEach(file => {
  if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, 'utf8');
    
    // 1. Header Navigation Injection
    // Replace CRM nav link with CRM and EMS nav links
    if (!content.includes('<a href="ems.html"')) {
      // Case 1: active CRM link
      content = content.replace(
        /<a href="crm\.html" class="nav-link active">CRM<\/a>/g,
        '<a href="crm.html" class="nav-link">CRM</a>\n          <a href="ems.html" class="nav-link">EMS</a>'
      );
      // Case 2: standard CRM link
      content = content.replace(
        /<a href="crm\.html" class="nav-link">CRM<\/a>/g,
        '<a href="crm.html" class="nav-link">CRM</a>\n          <a href="ems.html" class="nav-link">EMS</a>'
      );
    }
    
    // 2. Footer Injection
    // Replace CRM footer link with CRM and EMS
    if (!content.includes('<li><a href="ems.html">EMS</a></li>')) {
      content = content.replace(
        /<li><a href="crm\.html">CRM<\/a><\/li>/g,
        '<li><a href="crm.html">CRM</a></li>\n              <li><a href="ems.html">EMS</a></li>'
      );
    }
    
    fs.writeFileSync(file, content, 'utf8');
    console.log(`Successfully updated navigation and footer in ${file}`);
  } else {
    console.warn(`File ${file} not found`);
  }
});
