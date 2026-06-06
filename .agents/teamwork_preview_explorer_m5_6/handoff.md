# Investigation Handoff: Milestone 5 Iteration 2

## 1. Observation

### Tailwind and `tailwind-merge` remaining instances
- **`src/lib/cn.ts`**: Still uses `twMerge` and imports `tailwind-merge`.
- **`src/components/ui/*.tsx`**: `card.tsx`, `button.tsx`, `badge.tsx`, `input.tsx`, `placeholder.tsx`, `separator.tsx`, `skeleton.tsx` all heavily use Tailwind utilities and variants (e.g., `hover:-translate-y-1`, `bg-primary`, `px-3`).
- **`src/components/sections/*.tsx`**: Almost every section file uses `className=` with Tailwind utilities (e.g., `feature-grid.tsx`, `quick-search.tsx`, `detailed-timeline.tsx`, `market-price-meter.tsx`, `dealer-signals.tsx`, `site-header.tsx`, etc.).
- **`src/components/admin/*.tsx`**: `admin-card.tsx`, `field.tsx`, `status-pill.tsx`, `toggle.tsx`, `tip.tsx` use Tailwind utilities.
- **`src/app/inzahlungnahme/inzahlungnahme.module.css`**: Line 50 contains `/* 0.5 tailwind */`.
- Numerous `src/app` files still import and use `cn()` to apply utility classes (e.g., `src/app/konto/page.tsx`, `src/app/inzahlungnahme/page.tsx`, etc.).

### Hardcoded Durations (ms, s, or unitless in JS)
- **`src/app/globals.css`**:
  - Line 38: `--duration-180: 180ms;`
  - Line 43: `--duration-350: 350ms;`
  - Line 53: `--animate-shimmer: shimmer 1.5s linear infinite;`
- **`src/app/home.module.css`**: 
  - Lines 130, 162, 167, 281 use explicit values like `300ms`, `150ms`, `200ms`.
- **Framer Motion Hardcoded Unitless Durations**:
  - `src/components/sections/buying-card.tsx`: `duration: 0.5`, `duration: 0.3`
  - `src/components/sections/feature-grid.tsx`: `duration: 0.5`, `duration: 0.8`
  - `src/components/sections/quick-search.tsx`: `duration: 0.7`
  - `src/components/sections/detailed-timeline.tsx`: `duration: 0.45`
  - `src/components/sections/site-header.tsx`: `duration: 0.18`, `duration: 0.2`
  - `src/components/sections/magazine-gallery.tsx`: `duration: 0.24`, `duration: 0.18`
  - `src/components/sections/filter-sidebar.tsx`: `duration: 0.25`, `duration: 0.2`, `duration: 0.35`
  - `src/components/sections/vehicle-card.tsx`: `duration: 0.5`
  - `src/app/...` files: Almost all page files in `src/app` still hardcode durations in their `transition` props (e.g., `src/app/preise/page.tsx` uses `0.25`, `0.3`, `0.4`, `0.5`, `0.6`).

### Framer Motion missing `useReducedMotion`
The following components import `motion` from `framer-motion` and use `<motion.div>` etc. but completely lack the `useReducedMotion` hook:
- `src/components/sections/hero.tsx`
- `src/components/sections/buying-card.tsx`
- `src/components/sections/magazine-gallery.tsx`
- `src/components/sections/filter-sidebar.tsx`
- `src/components/sections/vehicle-card.tsx`
- `src/components/sections/site-header.tsx`
- `src/components/sections/detailed-timeline.tsx`
- `src/components/sections/feature-grid.tsx`
- `src/components/sections/quick-search.tsx`

## 2. Logic Chain
1. The goal is to enforce the interface contract: "Native CSS usage only" and "Respect Design System tokens".
2. `tailwind-merge` and Tailwind utility classes directly violate "Native CSS usage only".
3. Literal `180ms` or `0.5` values violate "Respect Design System tokens for sizing, colors, typography" (which extends to animation variables).
4. Missing `useReducedMotion` violates the contract "Framer motion components must respect useReducedMotion".
5. Based on `grep` outputs, the entire `src/components` directory is essentially untouched from a Tailwind removal perspective, meaning the refactor must extend deeply into these shared components.

## 3. Caveats
- I did not manually verify every single page under `src/app` for tailwind usage, but `grep` confirms `cn()` is still imported in over a dozen files there, which implies residual utility classes.
- The project tokens may need to be expanded to export design system duration tokens in JS (e.g., `TOKENS.duration.medium`) so Framer Motion can use them without hardcoding `0.5`.

## 4. Conclusion
The codebase still heavily relies on Tailwind in the `src/components/` directory, and hardcoded animation values are pervasive throughout both CSS and JS files. Framer Motion accessibility (`useReducedMotion`) has only been applied to `src/app/` but ignored in `src/components/sections/`. 

**Fix Strategy:**
1. **Purge Tailwind**: Rewrite all `src/components/ui/`, `src/components/sections/`, and `src/components/admin/` components to use CSS Modules. Remove `tailwind-merge` from `src/lib/cn.ts` and use a generic `clsx` wrapper or string concatenation.
2. **Tokenize Durations**: Replace all literal `ms` and `s` values in `globals.css` and `*.module.css` with CSS variables (`var(--duration-...)`). For JS files, create a JS token mapping for durations and replace all `duration: 0.5` instances with the token.
3. **Apply `useReducedMotion`**: Add the hook to all 9 affected components in `src/components/sections/` and ensure the transitions fallback to `duration: 0.01` (or `duration: 0`) when `prefersReducedMotion` is true.

## 5. Verification Method
1. Run `grep -r "tailwind-merge" src/` (Should return nothing).
2. Run `grep -rn "className=[\"'][^\"']*?[sm:|md:|hover:|flex |px-|py-]...[\"']" src/components/` (Should return nothing, as they should use CSS Module classes like `styles.card`).
3. Run `grep -E "([0-9]+ms|[0-9\.]+s)" src/app/globals.css src/**/*.module.css` (Should return no hardcoded times outside of token definitions).
4. Run `grep -r "duration: [0-9]" src/` (Should return nothing).
5. Open all files listed under "Framer Motion missing useReducedMotion" and verify `useReducedMotion()` is imported and used in transition configurations.
