const fs = require('fs');
const path = require('path');

const SRC_DIR = path.join(__dirname, 'src');
const OUTPUT_FILE = path.join(__dirname, '.antigravity', 'design-system', 'token-inventory.md');

function walk(dir) {
    let results = [];
    if (!fs.existsSync(dir)) return results;
    const list = fs.readdirSync(dir);
    for (const file of list) {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);
        if (stat && stat.isDirectory()) {
            results = results.concat(walk(filePath));
        } else {
            if (/\.(jsx?|tsx?|css|scss)$/i.test(file)) {
                results.push(filePath);
            }
        }
    }
    return results;
}

function extractTokens() {
    const files = walk(SRC_DIR);
    
    const hslTokens = {};
    const styleTokens = {};
    
    const hslRegex = /hsla?\([^)]+\)/g;
    const styleRegex = /style=\{\{([\s\S]*?)\}\}/g;

    for (const file of files) {
        const content = fs.readFileSync(file, 'utf8');
        const relativePath = path.relative(__dirname, file);

        let hslMatch;
        while ((hslMatch = hslRegex.exec(content)) !== null) {
            const token = hslMatch[0].trim().replace(/\s+/g, ' ');
            if (!hslTokens[token]) hslTokens[token] = [];
            if (!hslTokens[token].includes(relativePath)) {
                hslTokens[token].push(relativePath);
            }
        }

        let styleMatch;
        while ((styleMatch = styleRegex.exec(content)) !== null) {
            const token = styleMatch[1].trim().replace(/\s+/g, ' ');
            if (!styleTokens[token]) styleTokens[token] = [];
            if (!styleTokens[token].includes(relativePath)) {
                styleTokens[token].push(relativePath);
            }
        }
    }

    return { hslTokens, styleTokens };
}

function generateMarkdown({ hslTokens, styleTokens }) {
    let md = '# Token Inventory\n\n';
    
    md += '## HSL Colors\n\n';
    md += '| Color | Files |\n';
    md += '|---|---|\n';
    const hslKeys = Object.keys(hslTokens).sort();
    if (hslKeys.length === 0) {
        md += '| None found | |\n';
    } else {
        for (const token of hslKeys) {
            md += `| \`${token}\` | ${hslTokens[token].join(', ')} |\n`;
        }
    }

    md += '\n## Inline Styles (`style={{...}}`)\n\n';
    md += '| Style Object | Files |\n';
    md += '|---|---|\n';
    const styleKeys = Object.keys(styleTokens).sort();
    if (styleKeys.length === 0) {
        md += '| None found | |\n';
    } else {
        for (const token of styleKeys) {
            md += `| \`{ ${token} }\` | ${styleTokens[token].join(', ')} |\n`;
        }
    }

    return md;
}

function main() {
    console.log('Extracting tokens from src/ ...');
    const data = extractTokens();
    const md = generateMarkdown(data);
    
    const outDir = path.dirname(OUTPUT_FILE);
    if (!fs.existsSync(outDir)) {
        fs.mkdirSync(outDir, { recursive: true });
    }
    
    fs.writeFileSync(OUTPUT_FILE, md, 'utf8');
    console.log(`Inventory written to ${OUTPUT_FILE}`);
}

main();
