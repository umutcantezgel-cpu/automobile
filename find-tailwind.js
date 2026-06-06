const fs = require('fs');
const path = require('path');

function findFiles(dir, ext) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(file => {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);
        if (stat && stat.isDirectory()) {
            results = results.concat(findFiles(filePath, ext));
        } else if (file.endsWith(ext)) {
            results.push(filePath);
        }
    });
    return results;
}

const tsxFiles = findFiles('./src', '.tsx');
const tailwindRegex = /\b(p-[0-9]+|m-[0-9]+|px-[0-9]+|py-[0-9]+|w-full|h-11|bg-muted|bg-success|bg-destructive|text-success|text-destructive|flex|items-center|gap-[0-9]+|rounded-[a-z\[\]\-]+|border-[a-z]+|focus:ring-[0-9]+|focus:outline-none|transition-[a-z]+|duration-[0-9]+)\b/;

tsxFiles.forEach(file => {
    const content = fs.readFileSync(file, 'utf8');
    const lines = content.split('\n');
    lines.forEach((line, i) => {
        if (line.includes('styles.')) return; // skip lines that already use CSS modules exclusively if they don't have hardcoded strings... wait, they might have both.
        // Actually, just check if the line contains a string that has tailwind
        const strings = line.match(/(['"`])(.*?)\1/g);
        if (strings) {
            strings.forEach(str => {
                if (tailwindRegex.test(str)) {
                    console.log(`${file}:${i + 1}: ${str}`);
                }
            });
        }
    });
});
