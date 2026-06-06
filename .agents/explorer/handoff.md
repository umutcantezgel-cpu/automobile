# Forensic Audit & Refactoring Strategy: Tailwind Removal & Accessibility

## 1. Observation
The previous worker failed by missing Tailwind utility classes embedded within `cn()` function calls, inline gradient configurations, and string literals containing multiple classes. They also used a fake verification command to mask these failures. 

**Verified Tailwind Leaks Found:**
- **`src/app/calculator/page.tsx`**: Contains `w-full h-11 rounded-[var(--radius-DEFAULT)] bg-muted pl-9 pr-3 text-sm text-foreground` (line 594), `p-1.5 rounded-md` (line 668), `text-success` / `text-destructive`, and `bg-success/10`.
- **`src/app/fahrzeuge/[id]/page.tsx`**: Contains `flex items-center gap-3 p-4 rounded-lg border border-border bg-card` (line 81) and `border-primary/20 bg-primary/[0.03]` (line 82).
- **`src/app/fahrzeuge/fahrzeuge-content.tsx`**: Contains `mb-6` (line 102) and `opacity-50` (line 113).
- **`src/app/preise/page.tsx`**: Contains `color: 'bg-primary'` (lines 504-508), injected directly via `cn()`.
- **`src/app/page.tsx`, `src/app/magazin/page.tsx`, `src/components/sections/vehicle-card.tsx`**: Contain `'group'` and `'group-hover:bg-primary/10'` which rely on Tailwind hover logic.
- **`src/app/ueber-uns/page.tsx`, `src/app/service/page.tsx`**: Contain hardcoded gradients `from-primary/90 to-accent/60`.

**Hardcoded CSS Values Found:**
- **`src/components/sections/vehicle-card.tsx`**: Inline styles `style={{ marginTop: '0.5rem' }}` and `style={{ marginTop: '0.25rem' }}`.
- **`src/app/admin/fahrzeuge/[id]/page.tsx`**: Inline styles with `style={{ color: 'var(--color-premium)' }}` and `flexShrink: 0`.

**Reduced Motion & High Contrast Implementations:**
- **`src/app/tokens/primitive.css`**: `transform: none !important;` completely strips transforms, which breaks layout elements relying on `translate(-50%, -50%)`.
- **`src/app/globals.css`**: `animation: none !important; transition: none !important;` breaks `animationend` and `transitionend` events in JavaScript components.
- **High Contrast**: The `prefers-contrast: more` media query in `globals.css` only hardcodes `#000` background and `#fff` foreground, failing to handle theme context.

## 2. Logic Chain
1. By bypassing the flawed regex from the previous iteration, I searched specifically for string literals passed to `cn()` containing known Tailwind prefixes (`bg-`, `text-`, `flex`, `p-`, `group`, `w-full`).
2. This revealed that the application still relies heavily on the Tailwind compiler for hover states (`group-hover`), arbitrary values (`rounded-[var(--radius-DEFAULT)]`), opacity modifiers (`bg-success/10`), and gradients (`from-*/to-*`).
3. To fully remove Tailwind, these remaining stragglers must be extracted into explicit CSS classes in their respective `.module.css` files.
4. Analyzing the CSS, the reduced motion `@media` queries were found to use `none !important`, which destructively breaks layout transforms and JS events instead of merely zeroing the duration.
5. High Contrast mode needs better CSS token implementation to handle both forced-colors and theme-aware contrast.
6. The `style={{ marginTop: ... }}` inline usages contradict the goal of removing hardcoded CSS values.

## 3. Caveats
- I did not run the build command because I am acting purely as an exploratory investigator under CODE_ONLY.
- `useReducedMotion` hook in `src/lib/motion.ts` works well for Framer Motion, but native CSS transitions will break unless the CSS `@media` queries are fixed.

## 4. Conclusion
To complete Milestone 5 successfully, the implementer must:
1. **Remove remaining Tailwind**: Move the 15+ inline Tailwind strings discovered above into `.module.css` files. Use conditional classes for dynamic logic (`isSuccess ? styles.successBadge : styles.errorBadge`) and `.parent:hover .child` for `group-hover`.
2. **Fix hardcoded CSS**: Move `style={{ marginTop: '0.5rem' }}` and inline `color` to their respective CSS modules.
3. **Fix reduced motion**: Change `transform: none !important;` to `transition-duration: 0.01ms !important;` and `animation-duration: 0.01ms !important;` inside `prefers-reduced-motion` to keep layouts intact.
4. **Fix high contrast**: Implement a robust `prefers-contrast: more` block that uses `currentColor` or specific CSS variables rather than hardcoding `#000000`, and add `forced-colors: active` fallbacks if necessary.

## 5. Verification Method
- **Verify Tailwind Removal**: Run `grep -rnE "['\"][^'\"]*\b(flex|grid|w-[a-z]+|h-[0-9]+|bg-[a-z]+|text-[a-z]+|p-[0-9]+|m-[0-9]+|px-[0-9]+|py-[0-9]+|pt-[0-9]+|pb-[0-9]+|mt-[0-9]+|mb-[0-9]+|items-[a-z]+|justify-[a-z]+|rounded-[a-z]+|group(-hover)?|from-[a-z]+|to-[a-z]+)\b[^'\"]*['\"]" $(find src -type f -name '*.tsx')` and ensure it returns NO matches (excluding legitimate English words that happen to collide, but there shouldn't be any).
- **Verify Reduced Motion**: Inspect `src/app/tokens/primitive.css` and `src/app/globals.css` to confirm `transform: none` and `transition: none` have been replaced with `0.01ms` durations.
- **Verify Hardcoded CSS**: Run `grep -rn "style={{.*marginTop.*}}" src/` and `grep -rn "style={{.*color.*}}" src/` to ensure no inline layout/color overrides remain.
