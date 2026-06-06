const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Read replacements.sed
const sedContent = fs.readFileSync('replacements.sed', 'utf8');
const lines = sedContent.split('\n').filter(Boolean);

const map = [];
for (const line of lines) {
  // Format: s/[[:<:]]0\.125rem[[:>:]]/var(--global-val-3000)/g
  // or s|hsl\(var\(--primary\)\)|var(--global-val-3099)|g
  
  let match;
  if (line.startsWith('s/')) {
    const parts = line.split('/');
    if (parts.length >= 4) {
      let original = parts[1].replace(/\[\[:<:\]\]/g, '').replace(/\[\[:>:]]/g, '').replace(/\\./g, (m) => m[1]);
      let replacement = parts[2];
      map.push({ search: replacement, replace: original });
    }
  } else if (line.startsWith('s|')) {
    const parts = line.split('|');
    if (parts.length >= 4) {
      let original = parts[1].replace(/\\./g, (m) => m[1]);
      let replacement = parts[2];
      map.push({ search: replacement, replace: original });
    }
  }
}

// Find all .module.css files
const filesStr = execSync('find src -name "*.module.css"', { encoding: 'utf8' });
const files = filesStr.split('\n').filter(Boolean);

console.log(`Found ${files.length} module files. Applying reverse mapping...`);

let changedFiles = 0;
for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');
  let originalContent = content;
  
  for (const { search, replace } of map) {
    // Escape search string for regex if it contains parentheses
    const escapedSearch = search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(escapedSearch, 'g');
    content = content.replace(regex, replace);
  }
  
  if (content !== originalContent) {
    fs.writeFileSync(file, content, 'utf8');
    changedFiles++;
  }
}

console.log(`Fixed ${changedFiles} files!`);
