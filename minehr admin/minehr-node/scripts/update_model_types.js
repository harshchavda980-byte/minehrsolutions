const fs = require('fs');
const path = require('path');

const modelsDir = path.join(__dirname, '..', 'models');

function updateModels(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            updateModels(fullPath);
        } else if (file.endsWith('.js')) {
            let content = fs.readFileSync(fullPath, 'utf8');
            // Regex to find any field ending with _by or _to or _id
            const fieldRegex = /([a-zA-Z0-9_]+_(?:by|to|id)):\s*{\s*type:\s*DataTypes\.INTEGER/g;
            
            if (fieldRegex.test(content)) {
                content = content.replace(fieldRegex, (match, p1) => {
                    return `${p1}: {\n        type: DataTypes.BIGINT.UNSIGNED`;
                });
                fs.writeFileSync(fullPath, content);
                console.log(`Updated ${file}`);
            }
        }
    }
}

updateModels(modelsDir);
console.log("Done updating models.");
