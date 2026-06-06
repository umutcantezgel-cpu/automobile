const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// 1. First, fix the mangled variables
const mangledMap = {
    'var(--space-1)': '0.25rem',
    'var(--space-2)': '0.5rem',
    'var(--space-3)': '0.75rem',
    'var(--space-4)': '1rem',
    'var(--space-5)': '1.25rem',
    'var(--space-6)': '1.5rem',
    'var(--space-8)': '2rem',
    'var(--space-10)': '2.5rem',
    'var(--space-12)': '3rem',
    'var(--space-16)': '4rem',
    'var(--space-20)': '5rem',
    'var(--space-24)': '6rem',
    'var(--space-32)': '8rem',
};

function unmangle(content) {
    let result = content;
    // Fix concatenated decimals like `0.87var(--space-20)`
    for (const [v, rem] remStr of Object.entries(mangledMap)) {
        const val = parseFloat(remStr.replace('rem', ''));
        // Regex to match things like 0.87var(--space-20) or 1.12var(--space-20)
        const regex = new RegExp(`([0-9]*\\.[0-9]+)\\s*${v.replace('(', '\\(').replace(')', '\\)')}`, 'g');
        result = result.replace(regex, (match, decimalStr) => {
            return `${decimalStr}${val}rem`;
        });
        
        // Also fix integer mangles like 12var(--space-20) -> .125rem
        // This is trickier, so we just replace the pure token
        const regex2 = new RegExp(v.replace('(', '\\(').replace(')', '\\)'), 'g');
        result = result.replace(regex2, remStr);
    }
    return result;
}

// 2. We don't want to parse everything via regex automatically because we might break CSS logic again.
// BUT we CAN generate the breakpoint files.
// The implementer will use this script or just manually apply the fixes.
// Wait, I will write the actual script logic in the handoff.md for them to review and run.
