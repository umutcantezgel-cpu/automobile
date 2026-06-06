# Handoff Report: Hardcoded CSS Audit

## 1. Observation
- Using `grep -r "style={{" src/ | wc -l`, we found **130 instances** of inline styles across **16 files**.
- Using `grep -r "hsl(" src/ | grep -v "app/tokens" | wc -l`, we found **168 instances** of hardcoded `hsl()` colors outside of token files across **17 files**.
- **Specific examples found:**
  - `width: 36, height: 36, borderRadius: 9, fontSize: 12` found in `src/app/admin/layout.tsx` (line 175) and `src/app/admin/page.tsx` (line 334).
  - `width: 160, flexShrink: 0` found in `src/app/admin/fahrzeuge/[id]/page.tsx` (line 727).
  - `gridTemplateColumns: '1.6fr 1fr'` found in `src/app/admin/page.tsx` (line 191).
  - `backgroundSize: '48px 48px'` found in `src/components/sections/map-view.tsx` (line 48).
  - Raw `hsl` gradients and strokes (e.g., `hsl(30, 20%, 93%)`, `hsl(0, 72%, 42%)`) found in `src/app/calculator/page.tsx` (lines 80, 183, 544), `src/app/kontakt/page.tsx` (line 181), and many others.
- The project is using **Tailwind CSS v4** (`tailwindcss@^4` in `package.json`). Tailwind v4 does not use `tailwind.config.ts` but relies entirely on CSS variables and the new `@theme` directive in CSS files.

## 2. Logic Chain
- The presence of 130 inline `style={{...}}` blocks and 168 `hsl()` values confirms that hardcoded CSS is prevalent throughout the Next.js `src/` directory.
- Since Tailwind v4 is configured, the ideal architecture dictates that static styling should be applied via utility classes (e.g., `className="w-9 h-9 rounded-[9px] text-xs"` instead of `style={{ width: 36, height: 36, ... }}`).
- Complex grid layouts (like `gridTemplateColumns: '1.6fr 1fr'`) can be handled via arbitrary Tailwind classes (e.g., `grid-cols-[1.6fr_1fr]`).
- Raw `hsl()` color codes in components break the theme system. They should be extracted into CSS variables (either in `src/app/globals.css` or `src/app/tokens/primitive.css`) and referenced via standard Tailwind utility classes (`bg-[var(--color-...)]`, `text-[var(--color-...)]`).
- Some `style={{...}}` properties are dynamic (e.g., `style={{ width: \`\${percentage}%\` }}`). These must remain inline but should be stripped of static properties. For instance, `style={{ minHeight: '44px', width: \`\${percentage}%\` }}` should be refactored to `className="min-[44px]"` and `style={{ width: \`\${percentage}%\` }}`.

## 3. Caveats
- No changes were implemented as per the constraints ("Do NOT implement the changes yourself").
- I specifically excluded `src/app/tokens` when counting `hsl()` values, as that is the correct place for raw color definitions.
- We did not manually inspect every single one of the 130 inline styles, but the pattern is consistent across the codebase.

## 4. Conclusion
There is a widespread pattern of mixed inline styles and hardcoded raw HSL values in the `.tsx` files. 

**Recommended Extraction Strategy:**
1. **Migrate Static Layout to Tailwind v4:** Convert static inline styles (`width`, `height`, `borderRadius`, `gridTemplateColumns`, `backgroundSize`) into Tailwind utility classes (e.g., `w-[36px]`, `rounded-[9px]`, `grid-cols-[1.6fr_1fr]`, `bg-[size:48px_48px]`).
2. **Isolate Dynamic Styles:** Retain `style={{...}}` only for strictly dynamic properties calculated at runtime (like progress bar widths). Move accompanying static properties to `className`.
3. **Extract Colors to CSS Variables:** Move all `hsl(...)` color strings into semantic variables in `src/app/tokens/primitive.css` or `src/app/globals.css`. 
4. **Apply Semantic Color Classes:** Replace hardcoded colors in React components with semantic Tailwind classes (e.g., `text-[var(--color-muted-foreground)]` or custom defined theme utility classes).

## 5. Verification Method
1. Run `grep -r "style={{" src/` to find all inline styles.
2. Run `grep -r "hsl(" src/ | grep -v "app/tokens"` to find all hardcoded colors in component files.
3. Check `package.json` to verify the presence of `tailwindcss@^4`.
