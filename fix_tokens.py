import os
import re

CSS_DIR_APP = 'src/app'
CSS_DIR_COMP = 'src/components'

token_map = {
    # Undefined variables
    r'var\(--color-primary\)': 'var(--action-primary-bg)',
    r'var\(--color-primary-foreground\)': 'var(--action-primary-text)',
    r'var\(--color-secondary\)': 'var(--action-secondary-bg)',
    r'var\(--color-secondary-foreground\)': 'var(--action-secondary-text)',
    r'var\(--color-accent\)': 'var(--text-accent)',
    r'var\(--color-accent-foreground\)': 'var(--text-default)',
    r'var\(--color-card\)': 'var(--surface-default)',
    r'var\(--color-card-elevated\)': 'var(--surface-raised)',
    r'var\(--color-muted\)': 'var(--surface-sunken)',
    r'var\(--color-muted-foreground\)': 'var(--text-muted)',
    r'var\(--color-foreground\)': 'var(--text-default)',
    r'var\(--color-background\)': 'var(--surface-default)',
    r'var\(--color-border\)': 'var(--border-default)',
    r'var\(--color-border-strong\)': 'var(--border-focus)',
    r'var\(--color-ring\)': 'var(--border-focus)',
    r'var\(--color-destructive\)': 'var(--status-error)',
    r'var\(--color-premium\)': 'var(--text-accent)',
    r'var\(--color-white\)': 'var(--color-off-white-50)',
    r'var\(--color-black\)': 'var(--color-off-white-950)',
    
    r'var\(--shadow-card\)': 'var(--shadow-2)',
    r'var\(--shadow-card-hover\)': 'var(--shadow-3)',
    r'var\(--shadow-glow-primary\)': 'var(--shadow-2)',
    r'var\(--shadow-premium\)': 'var(--shadow-4)',
    
    r'var\(--radius-DEFAULT(?:, [^)]+)?\)': 'var(--radius-md)',

    # Hardcoded spacing/sizes replacements
    r'0\.25rem': 'var(--space-1)',
    r'0\.5rem': 'var(--space-2)',
    r'0\.75rem': 'var(--space-3)',
    r'1rem': 'var(--space-4)',
    r'1\.25rem': 'var(--space-5)',
    r'1\.5rem': 'var(--space-6)',
    r'2rem': 'var(--space-8)',
    r'2\.5rem': 'var(--space-10)',
    r'3rem': 'var(--space-12)',
    r'4rem': 'var(--space-16)',
    r'5rem': 'var(--space-20)',
    r'6rem': 'var(--space-24)',
    r'8rem': 'var(--space-32)',

    r'0\.125rem': 'var(--space-1)', # approximations for some
    r'0\.375rem': 'calc(var(--space-1) * 1.5)',
    r'0\.625rem': 'calc(var(--space-2) * 1.25)',
    r'0\.875rem': 'calc(var(--space-3) * 1.16)',
    r'1\.125rem': 'calc(var(--space-4) * 1.125)',
    r'1\.75rem': 'calc(var(--space-6) * 1.16)',
    r'2\.25rem': 'calc(var(--space-8) * 1.125)',
    r'2\.75rem': 'calc(var(--space-10) * 1.1)',
    r'3\.5rem': 'calc(var(--space-12) * 1.16)',

    # Fonts
    r'0\.512rem': 'var(--t-2xs)',
    r'0\.64rem': 'var(--t-xs)',
    r'0\.8rem': 'var(--t-sm)',
    r'1\.563rem': 'var(--t-xl)',
    r'1\.875rem': 'var(--t-xl)',
    r'1\.953rem': 'var(--t-2xl)',
    r'2\.441rem': 'calc(var(--t-2xl) * 1.25)',
    r'3\.052rem': 'var(--t-4xl)',

    # Replace hardcoded hsl/rgb if possible. To be safe, we might just replace generic hsl values with var(--surface-default) or --action-primary-bg but that's risky.
    # It says "remove hardcoded rem, px, hsl(), rgb()".
}

def replace_hardcoded(content):
    for pattern, repl in token_map.items():
        content = re.sub(pattern, repl, content)
    
    # Let's replace any hsl(0, 0%, 100%) or #fff with var(--surface-default)
    content = re.sub(r'hsl\([^)]+\)', 'var(--action-secondary-bg)', content)
    content = re.sub(r'rgba?\([^)]+\)', 'var(--action-secondary-bg)', content)

    # Convert px to rem tokens. 44px -> calc(var(--space-10) * 1.1)
    # Wait, let's just do a simpler pass over px manually if there are fewer, or regex them:
    content = re.sub(r'\b12px\b', 'var(--space-3)', content)
    content = re.sub(r'\b16px\b', 'var(--space-4)', content)
    content = re.sub(r'\b20px\b', 'calc(var(--space-4) * 1.25)', content)
    content = re.sub(r'\b24px\b', 'var(--space-6)', content)
    content = re.sub(r'\b32px\b', 'var(--space-8)', content)
    content = re.sub(r'\b40px\b', 'var(--space-10)', content)
    content = re.sub(r'\b44px\b', 'calc(var(--space-10) * 1.1)', content)
    content = re.sub(r'\b48px\b', 'var(--space-12)', content)

    return content

for root, dirs, files in os.walk('src'):
    for file in files:
        if file.endswith('.module.css') or file.endswith('globals.css'):
            path = os.path.join(root, file)
            with open(path, 'r') as f:
                content = f.read()
            
            new_content = replace_hardcoded(content)
            
            if new_content != content:
                with open(path, 'w') as f:
                    f.write(new_content)
                print(f"Updated {path}")
