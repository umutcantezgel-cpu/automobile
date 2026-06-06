const fs = require('fs');
const path = require('path');
const glob = require('glob'); // Not available? I'll use child_process.execSync

const { execSync } = require('child_process');

const files = execSync("find src/components src/app -name '*.css' -o -name '*.tsx'").toString().split('\n').filter(Boolean);

let changedFiles = 0;

const map = {
  8: '2',
  12: '3',
  16: '4',
  20: '5',
  24: '6',
  32: '8'
};

for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');
  let original = content;

  content = content.replace(/([0-9\.]+)var\(--space-(8|12|16|20|24|32)\)/g, (match, p1, p2) => {
    return `${p1}${map[p2]}rem`;
  });

  if (content !== original) {
    fs.writeFileSync(file, content);
    changedFiles++;
    console.log(`Unmangled ${file}`);
  }
}

console.log(`Unmangled ${changedFiles} files.`);
