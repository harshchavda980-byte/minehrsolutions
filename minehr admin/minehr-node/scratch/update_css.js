const fs = require('fs');
const path = 'public/css/admin.css';
let content = fs.readFileSync(path, 'utf8');

// Add dark theme variables
content = content.replace(
    /--bg-topbar: rgba\(10, 12, 16, 0\.8\);/,
    '--bg-topbar: rgba(10, 12, 16, 0.8);\n    --bg-card: #0f1117;\n    --bg-card-hover: rgba(255, 255, 255, 0.03);'
);

// Add light theme variables
content = content.replace(
    /--bg-topbar: rgba\(255, 255, 255, 0\.8\);/,
    '--bg-topbar: rgba(255, 255, 255, 0.8);\n    --bg-card: #ffffff;\n    --bg-card-hover: rgba(0, 0, 0, 0.02);'
);

fs.writeFileSync(path, content);
console.log('Successfully updated admin.css');
