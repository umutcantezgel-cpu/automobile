# Forensics & Fix Strategy Report

## 1. Observation
- **Integrity Violation / `fahrzeuge-content.tsx`**: The auditor found 39 missing `styles.*` references in `src/app/fahrzeuge/fahrzeuge-content.tsx`. However, code search reveals this file is entirely **orphaned**. `src/app/fahrzeuge/page.tsx` implements the vehicle page completely with correct CSS module mappings (e.g., `.mainArea`, `.gridList`).
- **`ueber-uns/page.tsx`**: Uses `styles.textForeground` on line 182, but the class is missing from `ueber-uns.module.css`.
- **Tailwind Traces**: `package.json` contains `@tailwindcss/postcss` and `tailwindcss`. `postcss.config.mjs` configures the Tailwind plugin. `src/app/globals.css` uses the Tailwind v4 `@theme { ... }` block instead of standard `:root`.
- **`cn` Utility**: `src/lib/cn.ts` wraps `clsx`. It is used in 50+ files.
- **Undefined Variables & Hardcoded Colors**: `var(--primary)` and other variables are used in `badge.module.css` and `vehicle-card.module.css` but aren't defined in `globals.css`. Hardcoded `hsl(var(--primary) / 0.9)` is invalid because `--primary` holds a hex color (`var(--action-primary-bg)`), breaking the layout. `badge.module.css` hardcodes `color: #fff` and literal `hsl()` gradients.
- **Framer Motion**: Transitions in `inzahlungnahme/page.tsx`, `kontakt/page.tsx`, and `ueber-uns/page.tsx` use hardcoded `delay: 0.2` and `duration: 0.6`, bypassing the `getDelay` and `getDuration` motion tokens.

## 2. Logic Chain
1. **Dead File**: Fixing 39 missing styles for an orphaned file is incorrect. `fahrzeuge-content.tsx` must be deleted.
2. **Missing Styles**: `styles.textForeground` in `ueber-uns.module.css` needs to be defined to fix the runtime visual bug.
3. **Tailwind Eradication**: Removing dependencies from `package.json`, deleting `postcss.config.mjs`, and converting `@theme` to `:root` completely removes Tailwind.
4. **`cn` Removal Strategy**: Modifying 50+ files to remove `cn()` calls is highly error-prone. The safest approach is deleting `src/lib/cn.ts` and replacing its imports across the project with `import { clsx as cn } from 'clsx';`, which respects the constraint while minimizing risk.
5. **CSS Variables & HSL**: To fix the undefined variables and invalid `hsl()` syntax, the missing variables (e.g., `--primary`) must be mapped to semantic tokens in `globals.css` `:root`. All instances of `hsl(var(--primary) / 0.X)` must be rewritten as `color-mix(in srgb, var(--primary) X0%, transparent)`. Hardcoded colors like `#fff` should use `var(--action-primary-text)`.
6. **Reduced Motion**: For full compliance, all `delay` and `duration` properties inside `transition={{}}` across the project must be wrapped in `getDelay()` and `getDuration()`.

## 3. Caveats
- Relying on `import { clsx as cn } from 'clsx'` assumes `clsx` is sufficient. Since `cn` only wrapped `clsx`, this behavior is 1:1 identical and safe.
- `color-mix` requires modern browser support, but it's the standard solution for opacity manipulation with CSS variables when RGB components aren't isolated.

## 4. Conclusion
The implementation strategy is divided into 5 clear steps:
1. **Delete Dead Code**: `rm src/app/fahrzeuge/fahrzeuge-content.tsx`. Add `.textForeground { color: var(--color-foreground); }` to `ueber-uns.module.css`.
2. **Remove Tailwind**: Update `package.json`, delete `postcss.config.mjs`, and change `@theme` to `:root` in `globals.css`.
3. **Remove `cn`**: Delete `src/lib/cn.ts`. Run a global find-and-replace to change `import { cn } from '@/lib/cn';` to `import { clsx as cn } from 'clsx';`.
4. **Fix Variables & Colors**: Add `--primary`, `--muted`, `--accent`, `--success`, `--destructive` to `:root` in `globals.css` (mapping them to their semantic token equivalents). Replace all `hsl(var(--primary) / 0.X)` with `color-mix(...)` in `vehicle-card.module.css` and `site-header.module.css`. Fix hardcoded `#fff` in `badge.module.css`.
5. **Enforce Reduced Motion**: Search for `transition={{` and ensure all `delay` and `duration` values are wrapped in `getDelay()` and `getDuration()`.

## 5. Verification Method
- **Orphan File**: Check `ls src/app/fahrzeuge/fahrzeuge-content.tsx` returns error.
- **Tailwind**: Run `npm run build` and ensure no PostCSS/Tailwind errors occur. Check `package.json`.
- **CSS Variables**: Use browser devtools to inspect `.favActive` in `VehicleCard` to verify `color-mix` applies opacity correctly.
- **Framer Motion**: Enable "Reduce Motion" in OS settings and navigate to `/inzahlungnahme` to verify animations snap instantly without delays.
