const fs = require('fs');
const path = require('path');

const targetAddress = "509, Ananta elysium , Hill town circle, ankur chokadi, New india colony , ankur tenament, Nikol, Ahmedabad, 380049";
const formattedAddress = "509, Ananta Elysium, Hill Town Circle,<br>Ankur Chokadi, New India Colony,<br>Ankur Tenement, Nikol, Ahmedabad - 380049";

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
            if (content.includes(targetAddress)) {
                console.log(`Updating ${fullPath}`);
                const newContent = content.split(targetAddress).join(formattedAddress);
                fs.writeFileSync(fullPath, newContent, 'utf8');
            }
        }
    });
}

walk('.');
console.log('Done!');
