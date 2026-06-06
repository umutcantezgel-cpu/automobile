const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const dir = '/Users/umurey/Downloads/apex 3/apex-motors/src';

function findFiles(startPath, filter, callback) {
    if (!fs.existsSync(startPath)) return;
    const files = fs.readdirSync(startPath);
    for (let i = 0; i < files.length; i++) {
        const filename = path.join(startPath, files[i]);
        const stat = fs.lstatSync(filename);
        if (stat.isDirectory()) {
            findFiles(filename, filter, callback);
        } else if (filter.test(filename)) {
            callback(filename);
        }
    }
}

const tailwindArbitraryValues = new Set();
const inlineStyles = new Set();

findFiles(dir, /\.tsx$/, (filename) => {
    const content = fs.readFileSync(filename, 'utf8');
    
    // Find Tailwind arbitrary values like [44px], [#ff0000], [10vw]
    const tailwindMatches = content.match(/[a-z0-9]+-\[([^\]]+)\]/g);
    if (tailwindMatches) {
        tailwindMatches.forEach(m => tailwindArbitraryValues.add(m));
    }
    
    // Find Inline styles
    const styleMatches = content.match(/style=\{\{([^}]+)\}\}/g);
    if (styleMatches) {
        styleMatches.forEach(m => inlineStyles.add(m));
    }
});

console.log("=== Tailwind Arbitrary Values ===");
Array.from(tailwindArbitraryValues).sort().forEach(v => console.log(v));

console.log("\n=== Inline Styles ===");
Array.from(inlineStyles).sort().forEach(v => console.log(v));
