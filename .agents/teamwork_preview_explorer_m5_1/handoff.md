# Milestone 5 Explorer Report

## Observation

**1. Tailwind Classes Found:**
There are over 300 unique Tailwind classes actively used in `.tsx` files inside `src/app`.
The most frequently used include:
- Layout/Flexbox: `flex` (299x), `items-center` (194x), `flex-col` (100x), `grid` (61x), `justify-center` (50x)
- Spacing: `gap-4` (48x), `mb-4` (52x), `p-6` (30x), `mt-10` (14x)
- Typography: `text-muted-foreground` (181x), `font-mono` (134x), `text-sm` (132x), `font-semibold` (131x), `tabular-nums` (104x)
- Colors/Borders: `border-border` (68x), `text-primary` (63x), `border` (55x)

**2. Hardcoded Values (Bracket Notation):**
Tailwind's arbitrary value bracket notation `[]` is extensively used in `src/app`:
- `duration-[350ms]` in `src/app/page.tsx:33`
- `min-h-[var(--layout-hero-lg)]` in `src/app/not-found.tsx` and `src/app/page.tsx`
- `aspect-[16/10]`, `aspect-[4/3]`, `w-[var(--layout-sidebar-md)]`, `w-[var(--layout-content-lg)]`
- `text-[length:var(--t-xs)]` (37x), `text-[length:var(--t-sm)]` (31x), `text-[length:var(--t-base)]` (15x)
- Custom bezier curves: `ease-[cubic-bezier(0.16,1,0.3,1)]`

**3. Hardcoded CSS Values in `globals.css`:**
Multiple animations and transitions use absolute hardcoded time values (e.g., `ms`):
- `180ms` (line 42)
- `600ms` (lines 43, 912, 999)
- `250ms` (lines 270, 684, 1471, 1483)
- `350ms` (line 328)
- `200ms` (lines 405, 425, 709, 1069, 1225)
- `150ms` (lines 499, 523, 1298, 1455)
- `300ms` (lines 862, 1508, 1522)
- `400ms` (line 992)
- `240ms` (line 1101)
Note: No absolute `px` values were found in `globals.css`—spacing correctly uses `calc(var(--space-*))`.

**4. Accessibility Issues:**
- **Missing High Contrast Mode**: `grep -i "prefers-contrast" src/app/globals.css` yields zero results. There is no standard high-contrast fallback for disabled states or interactive elements.
- **Wrong Reduced Motion in CSS**: `globals.css` (lines 1574-1581) uses a sledgehammer approach (`animation-duration: 0.01ms !important; transition-duration: 0.01ms !important;`) rather than gracefully disabling animations, and fails to override `scroll-behavior: smooth` (defined on line 85).
- **Missing `useReducedMotion` in Framer Motion**: A search for `framer-motion` reveals it is imported in 18 files across `src/app`. However, a search for `useReducedMotion` yields 0 results. Framer Motion components are ignoring system motion preferences.

## Logic Chain
- `SCOPE.md` mandates "Remove Tailwind CSS". Finding >300 unique Tailwind classes confirms widespread non-compliance.
- `SCOPE.md` requires fixing "hardcoded CSS values". Discovering explicit bracket syntax in `className` tags and hardcoded `ms` values in `globals.css` pinpoints exactly what needs refactoring.
- `SCOPE.md` specifies fixing reduced motion and adding high contrast mode. The absence of `prefers-contrast`, the brutalist `0.01ms` CSS fix, the un-reset `scroll-behavior: smooth`, and the 100% absence of `useReducedMotion` in 18 Framer Motion files perfectly map to the requested fixes.

## Caveats
- I did not document every single line number for the 300+ unique Tailwind classes as the sheer volume (over 1,500 occurrences) makes it impractical for a single report. The entire `src/app` directory needs a comprehensive sweep.
- I assumed that all instances of `[var(--...)]` count as hardcoded bracket notation that should be migrated to native CSS classes or inline style vars.

## Conclusion
The codebase heavily relies on Tailwind utility classes and arbitrary bracket notation in `src/app`. Hardcoded transition timings persist in `globals.css`. High contrast mode is entirely missing. Reduced motion is implemented via a naive CSS override (`0.01ms`), misses `scroll-behavior`, and is totally ignored by all 18 files using Framer Motion. A full architectural shift to native CSS classes (or CSS modules) with proper accessibility media queries is required.

## Verification Method
1. Run `grep -r "className=" src/app | grep -o '\[[^]]*\]'` to list all hardcoded Tailwind bracket values.
2. Run `grep -rn "ms" src/app/globals.css` to verify hardcoded transition durations.
3. Check `globals.css` for `@media (prefers-contrast: more)` (should be missing).
4. Run `grep -rl "framer-motion" src/app | xargs grep "useReducedMotion"` (should return nothing, proving omission).
