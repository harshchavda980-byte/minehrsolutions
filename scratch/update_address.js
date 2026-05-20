const fs = require('fs');
const path = require('path');

const oldAddress = "Ahmedabad, Gujarat – India";
const newAddress = "509, Ananta elysium , Hill town circle, ankur chokadi, New india colony , ankur tenament, Nikol, Ahmedabad, 380049";

function walk(dir) {
    const files = fs.readdirSync(dir);
    files.forEach(file => {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            if (file !== 'node_modules' && file !== '.git') {
                walk(fullPath);
            }
        } else if (file.endsWith('.html')) {
            let content = fs.readFileSync(fullPath, 'utf8');
            if (content.includes(oldAddress)) {
                console.log(`Updating ${fullPath}`);
                const newContent = content.split(oldAddress).join(newAddress);
                fs.writeFileSync(fullPath, newContent, 'utf8');
            } else if (content.includes("Ahmedabad, Gujarat - India")) {
                console.log(`Updating ${fullPath} (alt dash)`);
                const newContent = content.split("Ahmedabad, Gujarat - India").join(newAddress);
                fs.writeFileSync(fullPath, newContent, 'utf8');
            }
        }
    });
}

walk('.');
console.log('Done!');
