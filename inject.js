const fs = require('fs');
const files = ['index.html', 'ats.html', 'career.html', 'blog.html', 'contact.html', 'services.html', 'trust.html', 'crm.html', 'ems.html'];
files.forEach(file => {
  if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, 'utf8');
    // Nav menu injection
    if (!content.includes('<a href="crm.html"')) {
      content = content.replace(/<a href="ats\.html" class="nav-link(.*?)">ATS<\/a>/g, '<a href="ats.html" class="nav-link$1">ATS</a>\n          <a href="crm.html" class="nav-link">CRM</a>\n          <a href="ems.html" class="nav-link">EMS</a>');
    } else if (!content.includes('<a href="ems.html"')) {
      content = content.replace(/<a href="crm\.html" class="nav-link(.*?)">CRM<\/a>/g, '<a href="crm.html" class="nav-link$1">CRM</a>\n          <a href="ems.html" class="nav-link">EMS</a>');
    }
    // Footer injection
    if (!content.includes('<li><a href="crm.html">CRM</a></li>')) {
      content = content.replace(/<li><a href="ats\.html">ATS<\/a><\/li>/g, '<li><a href="ats.html">ATS</a></li>\n              <li><a href="crm.html">CRM</a></li>\n              <li><a href="ems.html">EMS</a></li>');
    } else if (!content.includes('<li><a href="ems.html">EMS</a></li>')) {
      content = content.replace(/<li><a href="crm\.html">CRM<\/a><\/li>/g, '<li><a href="crm.html">CRM</a></li>\n              <li><a href="ems.html">EMS</a></li>');
    }
    fs.writeFileSync(file, content);
    console.log('Updated', file);
  }
});
