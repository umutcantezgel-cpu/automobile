# Handoff Report

## 1. Observation
During a full audit of the codebase, 130 instances of inline `style={{` and 56 instances of raw `hsl(` were found within `src/**/*.tsx` and `src/**/*.ts` files. The usage spans multiple components and pages:

**Examples of `style={{`:**
- `src/app/admin/fahrzeuge/[id]/page.tsx`: Layout properties (`width: 100`, `flexShrink: 0`, `gridTemplateColumns: 'repeat(2, 1fr)'`) and typograph/color (`fontFamily: 'var(--font-display)'`, `color: 'var(--color-muted-foreground)'`).
- `src/app/calculator/page.tsx`: Static dimensional settings (`minHeight: '44px'`, `maxHeight: '100%'`) and dynamic values (`width: \`\${percentage}%\``).
- `src/app/admin/fahrzeuge/page.tsx`: Explicit dimensions (`width: 40`, `width: 60`, `maxWidth: 460`).
- `src/components/sections/map-view.tsx`: Complex background gradients (`backgroundImage: 'linear-gradient(...)'`, `backgroundSize: '48px 48px'`).
- `src/app/preise/page.tsx` & `src/app/kontakt/page.tsx`: Transitions (`transitionTimingFunction: 'cubic-bezier(...)'`).

**Examples of `hsl(`:**
- `src/app/calculator/page.tsx`: Hardcoded properties directly (`color: 'hsl(0, 72%, 42%)'`).
- `src/app/admin/fahrzeuge/[id]/page.tsx`: Colors in variable configs (`accent: 'hsl(142 60% 36% / 0.1)'`).
- `src/components/sections/map-view.tsx`: Tailwind arbitrary values (`bg-[hsl(220,15%,13%)]`, `from-[hsl(40,70%,78%)]`).
- `src/components/ui/card.tsx`: Gradients (`from-[hsl(38_55%_48%)]`).

## 2. Logic Chain
1. The project leverages Tailwind CSS (v4 based on `package.json`).
2. Hardcoded raw inline styles (`style={{`) for layout/typography (e.g., `width: 40`, `gridTemplateColumns`) contradict the standard Tailwind utility-first approach, making them hard to maintain and inconsistent with responsive design variables.
3. Raw `hsl(` colors bypass the theme system's design tokens (like those in `src/app/tokens/primitive.css` or CSS custom properties like `var(--color-primary)`).
4. Extracting these into semantic classes or utilities will ensure consistency across the application.
5. Dynamic styles based on component state (`width: \`\${percentage}%\``) cannot easily be extracted to static CSS without CSS variables, so they are structurally appropriate to remain inline.

## 3. Caveats
- Some inline styles are genuinely dynamic (e.g. `style={{ width: \`\${percentage}%\` }}` in calculators, or framer-motion values like `style={{ y: vehicleY }}`). These should be ignored during extraction.
- Tailwind v4 handles configuration mostly in CSS instead of `tailwind.config.ts`, so theme extractions should be placed in `src/app/globals.css` using standard v4 `@theme` mappings or custom utility classes.

## 4. Conclusion
We must extract static `style={{}}` layout/color definitions and raw `hsl()` values into standard CSS / Tailwind utilities.

**Recommended Extraction Strategy:**
1. **Utility Conversion**: Convert static inline sizes (`width: 40` -> `w-10`), layout (`flexShrink: 0` -> `shrink-0`), text sizes, and radii to equivalent Tailwind classes.
2. **Semantic Colors**: Replace hardcoded `hsl()` strings with existing CSS variables (e.g. `var(--color-primary)` or `var(--color-muted-foreground)`) or define new variables in `globals.css` if they represent a new semantic token.
3. **Complex Backgrounds**: Abstract large `backgroundImage` styles (like grid line patterns or radial glows in `map-view.tsx`) into dedicated CSS classes in `globals.css` (e.g., `.bg-map-grid`) and apply via `className`.
4. **Preserve Dynamic State**: Leave inline styles containing runtime variables (`left: \`\${pos.x}%\``) as they are.

## 5. Verification Method
Run `grep -rIn "style={{" src/` and `grep -rIn "hsl(" src/` to verify that no static hardcoded instances remain in the `.tsx` files. Only dynamic inline styles should be left behind. Review the UI rendering (`npm run dev`) to ensure visual regression did not occur.
