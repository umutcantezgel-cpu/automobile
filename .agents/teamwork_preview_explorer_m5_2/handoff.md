# Handoff Report: Tailwind, Hardcoded Values, and A11y

## 1. Observation
- **Tailwind Scope**: A `grep` for `className=` in `src/app/**/*.tsx` yielded **1,592 lines** containing Tailwind utilities across 23 `tsx` files (e.g., `src/app/page.tsx`, `src/app/konto/page.tsx`, etc.). Common classes include `flex`, `py-24`, `min-h-[80vh]`, `grid`, `text-sm`, `font-medium`.
- **Hardcoded Values in `.tsx`**: Numerous arbitrary Tailwind values (brackets) are used to inject hardcoded layouts/designs:
  - Sizes: `min-h-[80vh]`, `w-[var(--layout-sidebar-md)]`, `min-h-[var(--layout-hero-lg)]`
  - Typography: `text-[length:var(--t-2xs)]`, `text-[length:var(--t-4xl)]`
  - Transitions/Animations: `duration-[350ms]`, `ease-[cubic-bezier(0.16,1,0.3,1)]`
- **Hardcoded Values in CSS**: `src/app/globals.css` bypasses standard tokens for timings. Searching for `ms` and `s` revealed:
  - `megaIn 180ms` (line 42)
  - `fadeInUp 600ms` (line 43)
  - `shimmer 1.5s` (line 44)
  - Raw transition speeds like `250ms`, `350ms`, `200ms`, `150ms`, `400ms` scattered across `.btn`, `.card`, `.input`, `.mag-tile` definitions. (Tokens exist in `primitive.css` like `--duration-150`, but are not used).
- **Reduced Motion (CSS)**: `src/app/globals.css` uses the `0.01ms !important` anti-pattern for `@media (prefers-reduced-motion: reduce)` on lines 1575-1579. `src/app/tokens/primitive.css` also overrides duration tokens to `0.01ms`.
- **Reduced Motion (React)**: A search for `framer-motion` shows 18 imports across `src/app`, yet a search for `useReducedMotion` returned `0` results.
- **High Contrast**: A search for `prefers-contrast` in `src/app/globals.css` and `tokens/*.css` returned `0` results.

## 2. Logic Chain
1. The objective is to enforce **Native CSS only**. The 1,592 instances of Tailwind classes inside `.tsx` files prove that a massive dependency on Tailwind utility classes remains. They must be extracted into standard CSS selectors (e.g., `.admin-shell`, `.hero-container`) in `globals.css` or component modules.
2. Hardcoded Tailwind brackets (e.g., `min-h-[80vh]`, `duration-[350ms]`) demonstrate that values are being passed ad-hoc instead of relying on central `globals.css` utility variables.
3. Hardcoded values in `globals.css` (e.g., `180ms`, `250ms`) violate the design system logic established in `primitive.css` (`--duration-***`), requiring an update to map all transition timings to their respective CSS variables.
4. Setting animation duration to `0.01ms !important` is considered a flaky anti-pattern as it can fire JavaScript transition-end events instantaneously or cause layout thrashing. Best practice dictates `animation: none !important; transition: none !important;`.
5. Framer Motion components completely bypass CSS media queries for animations. Since `useReducedMotion` is entirely absent, components like `<motion.div>` will still animate, critically failing WCAG requirements for reduced motion.
6. The absence of `@media (prefers-contrast: more)` confirms the high contrast mode preference ticket is outstanding.

## 3. Caveats
- Since there are nearly 1,600 lines containing Tailwind classes, they were not individually listed in this report. A full rewrite of the React components' class hierarchies is required.
- The `node` script to programmatically extract unique classes was not executed due to interactive permission timeouts; bash-level searches were heavily utilized instead.

## 4. Conclusion
The codebase remains heavily dependent on Tailwind CSS (1,592 occurrences). To resolve Milestone 5:
1. Strip all Tailwind classes from `src/app/**/*.tsx` and replace them with semantic Native CSS classes.
2. Replace hardcoded duration values in `globals.css` with `--duration-*` variables from `primitive.css`.
3. Rewrite the `@media (prefers-reduced-motion: reduce)` block in `globals.css` to use `none` instead of `0.01ms`.
4. Import and wrap `useReducedMotion` around all Framer Motion `<motion.*>` animation props to disable animations when requested.
5. Add `@media (prefers-contrast: more)` rules to `globals.css` to handle accessible text and border thresholds.

## 5. Verification Method
- Run `grep -rn 'className="' src/app` and verify no Tailwind utility classes remain.
- Run `grep -rn 'ms' src/app/globals.css` to ensure no hardcoded numerical values exist outside of `var(--duration-...)`.
- Run `grep -rn 'useReducedMotion' src/app` to verify Framer Motion is respecting the system accessibility settings.
- Manually review `globals.css` to confirm the presence of `@media (prefers-contrast: more)` and proper `none` handling in `@media (prefers-reduced-motion: reduce)`.
