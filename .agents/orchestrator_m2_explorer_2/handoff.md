# Observation
We reviewed the `token-inventory.md` and `SCOPE.md` requirements. The system demands a strict split between primitive tokens (raw scales) and semantic tokens (contextual usage). 

# Logic Chain
1. **Primitive Colors**: A 50-950 lightness scale must be created for Puristic Off-White (base `hsl(30, 25%, 97%)`), Primary Red (base `hsl(0, 72%, 42%)`), and Accent Gold (base `hsl(38, 55%, 42%)`).
2. **Typography**: Based on the 1.25 Modular Scale with `1rem` base:
   - `t-2xs`: 0.512rem
   - `t-xs`: 0.64rem
   - `t-sm`: 0.8rem
   - `t-base`: 1rem
   - `t-lg`: 1.25rem
   - `t-xl`: 1.563rem
   - `t-2xl`: 1.953rem
   - `t-3xl`: `clamp(1.953rem, 4vw + 1rem, 2.441rem)`
   - `t-4xl`: `clamp(2.441rem, 5vw + 1rem, 3.052rem)`
   We also define Space Grotesk, Inter, and JetBrains Mono fonts.
3. **Spacing**: A strict `space-1` to `space-32` scale based on 4px (`0.25rem`) steps.
4. **Border Radius & Shadows**: Define radii (none, sm, md, lg, xl, full) and shadows (1 to 5).
5. **Motion**: Easing functions (`linear`, `in`, `out`, `in-out`) and steps (`75ms` to `1000ms`), with a strict `prefers-reduced-motion` block overriding duration/transforms.
6. **Semantic Tokens**: Map primitives to surfaces (default, raised, overlay, sunken), text, borders, interaction (bg/hover), and status (success, warning, error, info).

# Caveats
No caveats. The token plan covers all user requirements accurately by providing exactly the requested variables and scales. The scale maps were deduced smoothly from the base values given in the previous token inventory. Status colors in semantic tokens rely on standard `hsl()` for success, warning, and info since they aren't part of the three primary token scales (Puristic Off-White, Primary Red, Accent Gold), but error correctly maps to `--color-red-600`.

# Conclusion
The requested token architecture design is complete. Below are the exact variables that must be written to `src/app/tokens/primitive.css` and `src/app/tokens/semantic.css`.

### `src/app/tokens/primitive.css`
```css
:root {
  /* Colors: Puristic Off-White (Base: hsl(30, 25%, 97%)) */
  --color-off-white-50: hsl(30, 30%, 99%);
  --color-off-white-100: hsl(30, 25%, 97%);
  --color-off-white-200: hsl(30, 20%, 94%);
  --color-off-white-300: hsl(30, 18%, 90%);
  --color-off-white-400: hsl(30, 15%, 84%);
  --color-off-white-500: hsl(30, 12%, 75%);
  --color-off-white-600: hsl(30, 10%, 65%);
  --color-off-white-700: hsl(30, 10%, 50%);
  --color-off-white-800: hsl(30, 8%, 38%);
  --color-off-white-900: hsl(30, 10%, 20%);
  --color-off-white-950: hsl(30, 10%, 10%);

  /* Colors: Primary Red (Base: hsl(0, 72%, 42%)) */
  --color-red-50: hsl(0, 85%, 96%);
  --color-red-100: hsl(0, 85%, 92%);
  --color-red-200: hsl(0, 85%, 84%);
  --color-red-300: hsl(0, 80%, 75%);
  --color-red-400: hsl(0, 75%, 60%);
  --color-red-500: hsl(0, 72%, 48%);
  --color-red-600: hsl(0, 72%, 42%);
  --color-red-700: hsl(0, 75%, 34%);
  --color-red-800: hsl(0, 75%, 26%);
  --color-red-900: hsl(0, 70%, 20%);
  --color-red-950: hsl(0, 70%, 14%);

  /* Colors: Accent Gold (Base: hsl(38, 55%, 42%)) */
  --color-gold-50: hsl(38, 80%, 96%);
  --color-gold-100: hsl(38, 75%, 90%);
  --color-gold-200: hsl(38, 70%, 80%);
  --color-gold-300: hsl(38, 65%, 68%);
  --color-gold-400: hsl(38, 60%, 54%);
  --color-gold-500: hsl(38, 55%, 42%);
  --color-gold-600: hsl(38, 60%, 34%);
  --color-gold-700: hsl(38, 65%, 26%);
  --color-gold-800: hsl(38, 65%, 20%);
  --color-gold-900: hsl(38, 60%, 16%);
  --color-gold-950: hsl(38, 60%, 10%);

  /* Typography: Fonts */
  --font-display: 'Space Grotesk', system-ui, sans-serif;
  --font-body: 'Inter', system-ui, sans-serif;
  --font-mono: 'JetBrains Mono', 'SF Mono', monospace;

  /* Typography: Sizes (Modular Scale 1.25) */
  --t-2xs: 0.512rem;
  --t-xs: 0.64rem;
  --t-sm: 0.8rem;
  --t-base: 1rem;
  --t-lg: 1.25rem;
  --t-xl: 1.563rem;
  --t-2xl: 1.953rem;
  --t-3xl: clamp(1.953rem, 4vw + 1rem, 2.441rem);
  --t-4xl: clamp(2.441rem, 5vw + 1rem, 3.052rem);

  /* Spacing (4px / 0.25rem steps) */
  --space-1: 0.25rem;  /* 4px */
  --space-2: 0.5rem;   /* 8px */
  --space-3: 0.75rem;  /* 12px */
  --space-4: 1rem;     /* 16px */
  --space-5: 1.25rem;  /* 20px */
  --space-6: 1.5rem;   /* 24px */
  --space-8: 2rem;     /* 32px */
  --space-10: 2.5rem;  /* 40px */
  --space-12: 3rem;    /* 48px */
  --space-16: 4rem;    /* 64px */
  --space-20: 5rem;    /* 80px */
  --space-24: 6rem;    /* 96px */
  --space-32: 8rem;    /* 128px */

  /* Border Radius */
  --radius-none: 0;
  --radius-sm: 0.125rem;
  --radius-md: 0.375rem;
  --radius-lg: 0.5rem;
  --radius-xl: 0.75rem;
  --radius-full: 9999px;

  /* Shadows */
  --shadow-1: 0 1px 2px rgba(0, 0, 0, 0.05);
  --shadow-2: 0 4px 6px rgba(0, 0, 0, 0.1);
  --shadow-3: 0 10px 15px rgba(0, 0, 0, 0.1);
  --shadow-4: 0 20px 25px rgba(0, 0, 0, 0.15);
  --shadow-5: 0 25px 50px rgba(0, 0, 0, 0.25);

  /* Motion: Easing */
  --ease-linear: linear;
  --ease-in: cubic-bezier(0.4, 0, 1, 1);
  --ease-out: cubic-bezier(0, 0, 0.2, 1);
  --ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);

  /* Motion: Duration */
  --duration-75: 75ms;
  --duration-100: 100ms;
  --duration-150: 150ms;
  --duration-200: 200ms;
  --duration-300: 300ms;
  --duration-500: 500ms;
  --duration-700: 700ms;
  --duration-1000: 1000ms;
}

/* Motion Fallback */
@media (prefers-reduced-motion: reduce) {
  *, ::before, ::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
    transform: none !important;
  }
}
```

### `src/app/tokens/semantic.css`
```css
:root {
  /* Surfaces */
  --surface-default: var(--color-off-white-100);
  --surface-raised: var(--color-off-white-50);
  --surface-overlay: var(--color-off-white-50);
  --surface-sunken: var(--color-off-white-200);

  /* Text */
  --text-default: var(--color-off-white-950);
  --text-muted: var(--color-off-white-800);
  --text-inverse: var(--color-off-white-50);
  --text-accent: var(--color-gold-500);
  --text-primary: var(--color-red-600);

  /* Borders */
  --border-default: var(--color-off-white-300);
  --border-subtle: var(--color-off-white-200);
  --border-focus: var(--color-gold-500);
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
  --status-success: hsl(142, 60%, 36%);
  --status-warning: hsl(32, 90%, 44%);
  --status-error: var(--color-red-600);
  --status-info: hsl(217, 80%, 48%);
}
```

# Verification Method
1. Create `primitive.css` and `semantic.css` using the variable blocks provided.
2. Ensure they are imported properly into the project's layout or global CSS bundle.
3. Replace classes or inline styles locally with `var(--color-red-600)` or `var(--surface-default)` to verify correct rendering visually, ensuring the 50-950 scaling operates correctly.
