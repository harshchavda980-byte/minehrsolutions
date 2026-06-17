const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');

function walkDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      if (file !== 'node_modules' && file !== '.git' && file !== '.vercel') {
        walkDir(fullPath);
      }
    } else if (file.endsWith('.html')) {
      updateFavicon(fullPath);
    }
  }
}

function updateFavicon(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let original = content;

  // Determine path depth relative to root
  const relPath = path.relative(rootDir, filePath);
  const depth = relPath.split(path.sep).length - 1;
  const prefix = depth > 0 ? '../'.repeat(depth) : '';

  // 1. Replace logo.png as rel="icon"
  // e.g. <link rel="icon" type="image/png" href="public/assets/logo.png" />
  // or <link rel="icon" type="image/png" href="../public/assets/logo.png" />
  const iconPattern = /<link rel="icon" type="image\/png" href="(?:\.\.\/)*public\/assets\/logo\.png"\s*\/?>/g;
  content = content.replace(iconPattern, `<link rel="icon" type="image/png" href="${prefix}public/favicon.png" />`);

  // 2. Replace custom or broken shortcut icon tags
  // e.g. <link rel="shortcut icon" href="favicon.jpeg" type="image/x-icon">
  // or <link rel="shortcut icon" href="public/favicon.png" type="image/x-icon">
  const shortcutPattern = /<link rel="shortcut icon" href="[^"]+" type="image\/x-icon"\s*\/?>/g;
  content = content.replace(shortcutPattern, `<link rel="shortcut icon" href="${prefix}public/favicon.png" type="image/x-icon" />`);

  if (content !== original) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated favicon links in: ${relPath}`);
  }
}

console.log('Updating favicon links across all HTML pages...');
walkDir(rootDir);
console.log('Favicon update completed successfully.');
