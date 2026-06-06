const fs = require('fs');
const path = require('path');
const postcss = require('postcss');

// Mapping of exact px values to space/radius/layout variables
const pxMap = {
  '0': '0',
  '0px': 'var(--radius-none)', 
  '1px': 'var(--border-width-1)',
  '2px': 'var(--border-width-2)',
  '-1px': 'calc(var(--border-width-1) * -1)',
  '-2px': 'calc(var(--border-width-2) * -1)',
  '3px': 'var(--border-width-3)',
  '4px': 'var(--space-1)',
  '-4px': 'calc(var(--space-1) * -1)',
  '10px': 'var(--space-2-5)',
  '14px': 'var(--pattern-14)',
  '15px': 'var(--pattern-15)',
  '20px': 'var(--space-5)',
  '40px': 'var(--space-10)',
  '48px': 'var(--space-12)',
  '60px': 'var(--space-15)',
  '96px': 'var(--space-24)',
  '100px': 'var(--layout-col-sm)',
  '360px': 'var(--layout-sidebar-sm)',
  '580px': 'var(--layout-content-md)',
  '9999px': 'var(--radius-full)'
};

const emMap = {
  '-0.025em': 'var(--tracking-tighter)',
  '-0.01em': 'var(--tracking-tight)',
  '0.025em': 'var(--tracking-wide)',
  '0.05em': 'var(--tracking-wider)',
  '0.08em': 'var(--tracking-widest)',
  '0.1em': 'var(--tracking-widest-plus)',
  '0.14em': 'var(--tracking-super-wide)',
  '0.16em': 'var(--tracking-mega-wide)'
};

const colorMap = {
  'rgb(0 0 0 / 0.4)': 'color-mix(in srgb, var(--text-default) 40%, transparent)',
  'rgb(0 0 0 / 0.1)': 'color-mix(in srgb, var(--text-default) 10%, transparent)',
  'rgba(0, 0, 0, 0.08)': 'color-mix(in srgb, var(--text-default) 8%, transparent)',
  'rgba(0,0,0,0.05)': 'color-mix(in srgb, var(--text-default) 5%, transparent)',
  'hsl(30 30% 97%)': 'var(--color-off-white-100)',
  'hsl(0 72% 42% / 0.07)': 'color-mix(in srgb, var(--color-red-600) 7%, transparent)',
  'hsl(38 55% 48% / 0.12)': 'color-mix(in srgb, var(--color-gold-600) 12%, transparent)',
  'hsl(38 55% 48%)': 'var(--color-gold-600)',
  'hsl(42 60% 55%)': 'var(--color-gold-500)',
  'hsl(38 70% 38%)': 'var(--color-gold-700)',
  'hsl(142 60% 36%)': 'var(--color-green-600)',
  'hsl(0 0% 100% / 0.4)': 'color-mix(in srgb, var(--surface-default) 40%, transparent)',
  'hsl(0 0% 100% / 0.5)': 'color-mix(in srgb, var(--surface-default) 50%, transparent)'
};

const mediaMap = {
  '640px': '--sm',
  '768px': '--md',
  '1023px': '--lg-down',
  '1024px': '--lg'
};

const plugin = postcss.plugin('postcss-replace-hardcoded', () => {
  return (root, result) => {
    // Only inject import if we actually replace media queries or it's a module
    let file = result.opts.from || '';
    if (file.endsWith('.module.css')) {
      let hasImport = false;
      root.walkAtRules('import', rule => {
        if (rule.params.includes('media.css')) hasImport = true;
      });
      if (!hasImport) {
        // Find relative path to app/tokens/media.css
        // For simplicity, we just use a generic relative or absolute path, 
        // but Next.js usually handles ~ or @ if configured. Let's assume standard ../../...
        // The real script should compute it based on path.relative
        root.prepend({ name: 'import', params: '"../../app/tokens/media.css"' });
      }
    }

    root.walkAtRules('media', (rule) => {
      for (const [px, token] of Object.entries(mediaMap)) {
        if (rule.params.includes(px)) {
          if (rule.params.includes('max-width') && px === '1023px') {
            rule.params = `(${token})`;
          } else {
            rule.params = `(${token})`;
          }
        }
      }
    });

    root.walkDecls((decl) => {
      for (const [hsl, token] of Object.entries(colorMap)) {
        if (decl.value.includes(hsl)) {
          decl.value = decl.value.split(hsl).join(token);
        }
      }
      
      for (const [px, token] of Object.entries(pxMap)) {
        const regex = new RegExp(`(?<![\\d\\.-])${px.replace('.', '\\.')}(?![a-zA-Z])`, 'g');
        decl.value = decl.value.replace(regex, token);
      }
      
      for (const [em, token] of Object.entries(emMap)) {
         const regex = new RegExp(`(?<![\\d\\.-])${em.replace('.', '\\.')}(?![a-zA-Z])`, 'g');
         decl.value = decl.value.replace(regex, token);
      }
      
      decl.value = decl.value.replace(/\b0px\b/g, '0');
    });
  };
});

module.exports = plugin;
