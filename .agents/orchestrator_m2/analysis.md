# Synthesized Token Architecture

We will implement the following CSS structure based on the explorers' reports.

### `src/app/tokens/primitive.css`
```css
:root {
  /* Colors: Puristic Off-White */
  --color-off-white-50: hsl(30, 25%, 98%);
  --color-off-white-100: hsl(30, 25%, 97%);
  --color-off-white-200: hsl(30, 25%, 92%);
  --color-off-white-300: hsl(30, 25%, 85%);
  --color-off-white-400: hsl(30, 25%, 75%);
  --color-off-white-500: hsl(30, 25%, 65%);
  --color-off-white-600: hsl(30, 25%, 50%);
  --color-off-white-700: hsl(30, 25%, 40%);
  --color-off-white-800: hsl(30, 25%, 25%);
  --color-off-white-900: hsl(30, 25%, 15%);
  --color-off-white-950: hsl(30, 25%, 10%);

  /* Colors: Primary Red */
  --color-red-50: hsl(0, 72%, 95%);
  --color-red-100: hsl(0, 72%, 90%);
  --color-red-200: hsl(0, 72%, 80%);
  --color-red-300: hsl(0, 72%, 70%);
  --color-red-400: hsl(0, 72%, 60%);
  --color-red-500: hsl(0, 72%, 50%);
  --color-red-600: hsl(0, 72%, 42%);
  --color-red-700: hsl(0, 72%, 35%);
  --color-red-800: hsl(0, 72%, 25%);
  --color-red-900: hsl(0, 72%, 15%);
  --color-red-950: hsl(0, 72%, 10%);

  /* Colors: Accent Gold */
  --color-gold-50: hsl(38, 55%, 95%);
  --color-gold-100: hsl(38, 55%, 90%);
  --color-gold-200: hsl(38, 55%, 80%);
  --color-gold-300: hsl(38, 55%, 70%);
  --color-gold-400: hsl(38, 55%, 60%);
  --color-gold-500: hsl(38, 55%, 50%);
  --color-gold-600: hsl(38, 55%, 42%);
  --color-gold-700: hsl(38, 55%, 35%);
  --color-gold-800: hsl(38, 55%, 25%);
  --color-gold-900: hsl(38, 55%, 15%);
  --color-gold-950: hsl(38, 55%, 10%);

  /* Status Primitives */
  --color-green-600: hsl(142, 60%, 36%);
  --color-orange-600: hsl(32, 90%, 44%);
  --color-blue-600: hsl(217, 80%, 48%);

  /* Typography: Fonts */
  --font-display: 'Space Grotesk', system-ui, sans-serif;
  --font-body: 'Inter', system-ui, sans-serif;
  --font-mono: 'JetBrains Mono', 'SF Mono', monospace;

  /* Typography: Font Sizes */
  --t-2xs: 0.512rem;
  --t-xs: 0.64rem;
  --t-sm: 0.8rem;
  --t-base: 1rem;
  --t-lg: 1.25rem;
  --t-xl: 1.563rem;
  --t-2xl: 1.953rem;
  --t-3xl: clamp(1.953rem, 4vw + 1rem, 2.441rem);
  --t-4xl: clamp(2.441rem, 5vw + 1rem, 3.052rem);

  /* Spacing */
  --space-1: 0.25rem;
  --space-2: 0.5rem;
  --space-3: 0.75rem;
  --space-4: 1rem;
  --space-5: 1.25rem;
  --space-6: 1.5rem;
  --space-8: 2rem;
  --space-10: 2.5rem;
  --space-12: 3rem;
  --space-16: 4rem;
  --space-20: 5rem;
  --space-24: 6rem;
  --space-32: 8rem;

  /* Border Radius */
  --radius-none: 0px;
  --radius-sm: 0.125rem;
  --radius-md: 0.375rem;
  --radius-lg: 0.5rem;
  --radius-xl: 0.75rem;
  --radius-full: 9999px;

  /* Shadows */
  --shadow-1: 0 1px 2px rgba(0,0,0,0.05);
  --shadow-2: 0 4px 6px rgba(0,0,0,0.1);
  --shadow-3: 0 10px 15px rgba(0,0,0,0.1);
  --shadow-4: 0 20px 25px rgba(0,0,0,0.15);
  --shadow-5: 0 25px 50px rgba(0,0,0,0.25);

  /* Motion */
  --ease-in: cubic-bezier(0.4, 0, 1, 1);
  --ease-out: cubic-bezier(0, 0, 0.2, 1);
  --ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);
  --duration-75: 75ms;
  --duration-100: 100ms;
  --duration-150: 150ms;
  --duration-200: 200ms;
  --duration-300: 300ms;
  --duration-500: 500ms;
  --duration-700: 700ms;
  --duration-1000: 1000ms;
}

@media (prefers-reduced-motion: reduce) {
  :root {
    --duration-75: 0.01ms !important;
    --duration-100: 0.01ms !important;
    --duration-150: 0.01ms !important;
    --duration-200: 0.01ms !important;
    --duration-300: 0.01ms !important;
    --duration-500: 0.01ms !important;
    --duration-700: 0.01ms !important;
    --duration-1000: 0.01ms !important;
  }
  *, *::before, *::after {
    transform: none !important;
  }
}
```

### `src/app/tokens/semantic.css`
```css
@import './primitive.css';

:root {
  /* Surfaces */
  --surface-default: var(--color-off-white-100);
  --surface-raised: var(--color-off-white-50);
  --surface-overlay: var(--color-off-white-50);
  --surface-sunken: var(--color-off-white-200);

  /* Text */
  --text-default: var(--color-off-white-950);
  --text-muted: var(--color-off-white-700);
  --text-inverse: var(--color-off-white-50);
  --text-accent: var(--color-gold-600);
  --text-primary: var(--color-red-600);

  /* Borders */
  --border-default: var(--color-off-white-300);
  --border-subtle: var(--color-off-white-200);
  --border-focus: var(--color-gold-600);
  --border-destructive: var(--color-red-600);

  /* Interaction */
  --action-primary-bg: var(--color-red-600);
  --action-primary-hover: var(--color-red-700);
  --action-primary-active: var(--color-red-800);
  --action-primary-text: var(--color-off-white-50);

  --action-secondary-bg: var(--color-off-white-200);
  --action-secondary-hover: var(--color-off-white-300);
  --action-secondary-active: var(--color-off-white-400);
  --action-secondary-text: var(--color-off-white-950);

  /* Status */
  --status-success: var(--color-green-600);
  --status-warning: var(--color-orange-600);
  --status-info: var(--color-blue-600);
  --status-error: var(--color-red-600);
}
```
