const fs = require('fs');
const path = require('path');

const tokenMap = {
    'var(--color-primary)': 'var(--action-primary-bg)',
    'var(--color-primary-foreground)': 'var(--action-primary-text)',
    'var(--color-secondary)': 'var(--action-secondary-bg)',
    'var(--color-secondary-foreground)': 'var(--action-secondary-text)',
    'var(--color-accent)': 'var(--text-accent)',
    'var(--color-accent-foreground)': 'var(--text-default)',
    'var(--color-card)': 'var(--surface-default)',
    'var(--color-card-elevated)': 'var(--surface-raised)',
    'var(--color-muted)': 'var(--surface-sunken)',
    'var(--color-muted-foreground)': 'var(--text-muted)',
    'var(--color-foreground)': 'var(--text-default)',
    'var(--color-background)': 'var(--surface-default)',
    'var(--color-border)': 'var(--border-default)',
    'var(--color-border-strong)': 'var(--border-focus)',
    'var(--color-ring)': 'var(--border-focus)',
    'var(--color-destructive)': 'var(--status-error)',
    'var(--color-premium)': 'var(--text-accent)',
    'var(--color-white)': 'var(--color-off-white-50)',
    'var(--color-black)': 'var(--color-off-white-950)',
    
    'var(--shadow-card)': 'var(--shadow-2)',
    'var(--shadow-card-hover)': 'var(--shadow-3)',
    'var(--shadow-glow-primary)': 'var(--shadow-2)',
    'var(--shadow-premium)': 'var(--shadow-4)',
    
    'var(--radius-DEFAULT, 0.5rem)': 'var(--radius-md)',
    'var(--radius-DEFAULT)': 'var(--radius-md)',

    '0.25rem': 'var(--space-1)',
    '0.5rem': 'var(--space-2)',
    '0.75rem': 'var(--space-3)',
    '1rem': 'var(--space-4)',
    '1.25rem': 'var(--space-5)',
    '1.5rem': 'var(--space-6)',
    '2rem': 'var(--space-8)',
    '2.5rem': 'var(--space-10)',
    '3rem': 'var(--space-12)',
    '4rem': 'var(--space-16)',
    '5rem': 'var(--space-20)',
    '6rem': 'var(--space-24)',
    '8rem': 'var(--space-32)',
    '0.125rem': 'var(--space-1)', 
    '0.375rem': 'calc(var(--space-1) * 1.5)',
    '0.625rem': 'calc(var(--space-2) * 1.25)',
    '0.875rem': 'calc(var(--space-3) * 1.16)',
    '1.125rem': 'calc(var(--space-4) * 1.125)',
    '1.75rem': 'calc(var(--space-6) * 1.16)',
    '2.25rem': 'calc(var(--space-8) * 1.125)',
    '2.75rem': 'calc(var(--space-10) * 1.1)',
    '3.5rem': 'calc(var(--space-12) * 1.16)',
    '0.512rem': 'var(--t-2xs)',
    '0.64rem': 'var(--t-xs)',
    '0.8rem': 'var(--t-sm)',
    '1.563rem': 'var(--t-xl)',
    '1.875rem': 'var(--t-xl)',
    '1.953rem': 'var(--t-2xl)',
    '2.441rem': 'calc(var(--t-2xl) * 1.25)',
    '3.052rem': 'var(--t-4xl)',
    
    '180ms': 'var(--duration-200)',
    '250ms': 'var(--duration-300)',
};

function processDir(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            processDir(fullPath);
        } else if (file.endsWith('.module.css') || file.endsWith('globals.css')) {
            let content = fs.readFileSync(fullPath, 'utf8');
            let newContent = content;
            
            for (const [key, value] of Object.entries(tokenMap)) {
                newContent = newContent.split(key).join(value);
            }
            
            newContent = newContent.replace(/\b12px\b/g, 'var(--space-3)');
            newContent = newContent.replace(/\b16px\b/g, 'var(--space-4)');
            newContent = newContent.replace(/\b20px\b/g, 'calc(var(--space-4) * 1.25)');
            newContent = newContent.replace(/\b24px\b/g, 'var(--space-6)');
            newContent = newContent.replace(/\b32px\b/g, 'var(--space-8)');
            newContent = newContent.replace(/\b40px\b/g, 'var(--space-10)');
            newContent = newContent.replace(/\b44px\b/g, 'calc(var(--space-10) * 1.1)');
            newContent = newContent.replace(/\b48px\b/g, 'var(--space-12)');
            
            if (newContent !== content) {
                fs.writeFileSync(fullPath, newContent);
                console.log('Updated ' + fullPath);
            }
        }
    }
}

processDir('src');
