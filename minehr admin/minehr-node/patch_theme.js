const fs = require('fs');
const path = require('path');

const publicDir = path.join(__dirname, 'public');

function processFile(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;

    // Fix .stat-card backgrounds
    content = content.replace(/\.stat-card\s*\{[\s\S]*?background:\s*#(121624|111827|1a1f2e)[^;]*;/g, (match) => {
        return match.replace(/background:\s*#(121624|111827|1a1f2e)[^;]*;/, 'background: var(--bg-panel);');
    });

    // Fix .stat-info .value color
    content = content.replace(/\.stat-info\s*\.value\s*\{[\s\S]*?color:\s*#(f8fafc|ffffff|fff)[^;]*;/g, (match) => {
        return match.replace(/color:\s*#(f8fafc|ffffff|fff)[^;]*;/, 'color: var(--text-primary);');
    });

    // Fix .section-title color
    content = content.replace(/\.section-title\s*\{[\s\S]*?color:\s*#(f8fafc|ffffff|fff)[^;]*;/g, (match) => {
        return match.replace(/color:\s*#(f8fafc|ffffff|fff)[^;]*;/, 'color: var(--text-primary);');
    });

    // Remove any inline style colors enforcing white (like in festival-banners.html)
    // Wait, it might be safer to replace color: #fff with color: var(--text-primary) in certain contexts
    content = content.replace(/color:\s*(#fff|#ffffff|#f8fafc)\s*;/g, 'color: var(--text-primary);');
    
    // Also fixing text-muted colors that might have been hardcoded to a specific slate color like #64748b
    content = content.replace(/color:\s*#64748b\s*;/g, 'color: var(--text-muted);');

    if (content !== original) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`Updated theme variables in: ${path.basename(filePath)}`);
    }
}

fs.readdirSync(publicDir).forEach(file => {
    if (file.endsWith('.html')) {
        processFile(path.join(publicDir, file));
    }
});
console.log('Done!');
