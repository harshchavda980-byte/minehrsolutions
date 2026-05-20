const fs = require('fs');
const files = ['index.html', 'ats.html', 'career.html', 'blog.html', 'contact.html', 'services.html', 'trust.html'];
files.forEach(file => {
  if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, 'utf8');
    // Nav menu injection
    if (!content.includes('<a href="crm.html"')) {
      content = content.replace(/<a href="ats\.html" class="nav-link(.*?)">ATS<\/a>/g, '<a href="ats.html" class="nav-link$1">ATS</a>\n          <a href="crm.html" class="nav-link">CRM</a>');
    }
    // Footer injection
    if (!content.includes('<li><a href="crm.html">CRM</a></li>')) {
      content = content.replace(/<li><a href="ats\.html">ATS<\/a><\/li>/g, '<li><a href="ats.html">ATS</a></li>\n              <li><a href="crm.html">CRM</a></li>');
    }
    fs.writeFileSync(file, content);
    console.log('Updated', file);
  }
});
