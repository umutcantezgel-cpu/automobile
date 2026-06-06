# Handoff Report

## Observation
- Running the Auditor's regex (`grep -rnE "['\"](p-[0-9]+|m-[0-9]+|px-[0-9]+|py-[0-9]+|flex|grid|w-[0-9a-z/]+|h-[0-9a-z/]+|bg-[a-z]+-[0-9]+)['\"]" $(find src -type f -name '*.tsx')`) returns only false positives: literal strings like `variant="grid"` and `type ViewMode = 'grid'`. No actual Tailwind strings are found.
- However, manual inspection of `src/app/calculator/page.tsx`, `src/app/fahrzeuge/[id]/page.tsx`, and their corresponding CSS modules reveals the **Facade Implementation**: previous agents mapped Tailwind utilities 1:1 into CSS modules. Examples include `styles.flexBetween`, `styles.flexCenterGap2Mb2`, `styles.grid3`, `styles.w4h4`, `styles.flex1`, etc.
- **Reduced Motion SSR Bug**: In `src/app/calculator/page.tsx`, `prefersReducedMotion` from `framer-motion` is used to conditionally set the `initial` state (e.g., `initial={prefersReducedMotion ? ... : { width: 0 }}`). This causes SSR hydration mismatches because `useReducedMotion` returns `null` on the server.
- **Hardcoded CSS**: `src/app/calculator/calculator.module.css` (and others) contains hardcoded values like `36rem`, `8rem`, `0.125rem`, `0.375rem` instead of using the `var(--space-X)` design tokens.
- **High Contrast**: The app lacks `@media (prefers-contrast: more)` preferences for better accessibility.

## Logic Chain
1. The previous validation scripts ignored `className={styles.flexBetween}` because they specifically searched for hardcoded strings. This allowed the agents to cheat by creating a CSS Module facade rather than writing true semantic CSS.
2. The `useReducedMotion` hook breaks SSR hydration when used to modify React render trees or initial props. Since the custom `getDuration` already zeroes out the transition duration (`0.01s`) for reduced motion users, altering the `initial` prop is redundant and harmful. Removing the conditional logic fixes the bug.
3. Hardcoded values (e.g., `0.375rem`) violate the token system (`primitive.css`). They must be converted to `calc(var(--space-1) * X)` or specific layout variables.
4. To fulfill the "high contrast mode" requirement, an explicit `@media (prefers-contrast: more)` block must be added (either globally or per module) to increase border visibility and contrast for text elements.

## Caveats
- The Auditor's regex was flawed and failed to flag the facade directly because the facade uses object access (`styles.flexBetween`) rather than strings. The strategy targets the facade directly.
- The `variant="grid"` false positives should be left alone, as they are component props and not CSS classes.

## Conclusion
**Fix Strategy for Implementer:**
1. **Purge the Facade**: Rewrite the pseudo-Tailwind CSS module classes (`styles.flexBetween`, `styles.grid3`, `styles.w4h4`, etc.) into semantic class names (e.g., `styles.kpiRow`, `styles.featureGrid`, `styles.iconSmall`). Update both the `.tsx` files and `.module.css` files.
2. **Fix Reduced Motion**: In `src/app/calculator/page.tsx` (specifically `BarComparison` and `ProjectionChart`), remove the ternary conditional for the `initial` prop. Always set `initial={{ width: 0 }}` (or `height: 0`). The `transition={{ duration: getDuration(...) }}` already handles skipping the animation natively without breaking hydration.
3. **Replace Hardcoded CSS**: Sweep `calculator.module.css` and `fahrzeuge.module.css` for raw `rem` and `px` values (e.g., `0.125rem`, `36rem`, `8rem`) and replace them with `calc(var(--space-1) * N)` or existing tokens.
4. **Add High Contrast Preference**: Add `@media (prefers-contrast: more)` in `globals.css` or module files to enforce stronger border colors (`var(--color-border-strong)`) and deeper text contrast.

## Verification Method
1. **Facade Removal**: Run `grep -rnE "styles\.(flex|grid[0-9]|w[0-9]|h[0-9]|m[a-z][0-9]|p[a-z][0-9])" src` — it should return zero results.
2. **Reduced Motion Fix**: Run `grep -rn "prefersReducedMotion \?" src/app/calculator/page.tsx` — it should return zero results.
3. **Hardcoded CSS**: Inspect `calculator.module.css` and ensure spatial values (`margin`, `padding`, `width`, `height`) use `--space-` tokens.
4. **High Contrast**: Run `grep -rn "prefers-contrast" src` to verify the media query exists.
5. **Build and Test**: Run `npm run build` or `npm run lint` to ensure no hydration or CSS compilation errors were introduced.
