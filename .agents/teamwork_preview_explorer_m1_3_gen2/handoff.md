# Handoff Report: CSS Value Tokenization Strategy

**Core Findings:** Over 100 hardcoded static layout styles, hex/hsl values, and arbitrary px values remain untokenized across `globals.css`, React component inline styles, and mock data.

## 1. Observation
- **`globals.css` (lines 543-549)**: Uses raw hex color values for vehicle image backgrounds (`#ffffff`, `#ececef`, etc., inside `.veh-img.alt-*`).
- **`globals.css` (lines 766-768)**: Uses raw `hsl()` inside linear gradients for `.meter-zone` styles (`hsl(142 55% 80%)`, etc.).
- **`globals.css` (lines 1205-1460)**: The `.adm-*` block contains completely hardcoded pixel values rather than spacing variables. Examples: `font-size: 10.5px;` in `.adm-env`, `padding: 28px;` in `.adm-card-body`, `width: 38px; height: 38px; border-radius: 9px;` in `.adm-card-icon`, and `max-width: 1400px;` in `.adm-content`.
- **Inline Styles (`style={{}}`)**: Extensive static inline styles exist. `src/app/admin/fahrzeuge/[id]/page.tsx` uses them heavily, e.g., `style={{ fontFamily: 'var(--font-display)' }}`, `style={{ color: 'var(--color-muted-foreground)' }}`, and `style={{ gridTemplateColumns: 'repeat(2, 1fr)' }}`.
- **Mock Data (`src/lib/mock/vehicles.ts`, lines 359-363)**: Hardcodes CSS `hsl()` values into the `accent` field of mock data.
- **React Components (`src/components/sections/map-view.tsx`, lines 34, 94, 132)**: Hardcodes `hsl()` using arbitrary values in Tailwind strings like `bg-[hsl(220,15%,13%)]` and `from-[hsl(40,70%,78%)]`.

## 2. Logic Chain
1. *Missing tokens in globals:* The `.adm-*` CSS classes and specific color variants (`.meter-zone`, `.veh-img`) were written as distinct "magic numbers" and bypass the CSS custom properties root (`@theme`). By lifting these values to root CSS variables (`--spacing-*`, `--color-meter-*`, `--color-veh-alt-*`), they can be globally managed.
2. *Static Inline Styles bypass Tailwind:* `style={{ color: 'var(--color-muted-foreground)' }}` defeats the purpose of Tailwind's abstraction. It causes runtime overhead and prevents utility-class-based design system enforcement. These should be statically compiled classes (`text-muted-foreground`).
3. *Data Layer Pollution:* Injecting literal `hsl()` strings into mock data couples the application logic directly to the presentation layer. Replacing `hsl(...)` with a semantic string (e.g. `success`, `premium`) allows the UI components to map the data state to current token values.
4. *Arbitrary Brackets in Components:* Usage of `bg-[hsl(...)]` indicates a missing theme property. Tailwind should be configured with these colors so developers can write `bg-map-surface` or `bg-premium-light`.

## 3. Caveats
- Some inline styles may legitimately require `style={{}}` if the value is derived dynamically from JS calculations (e.g., `width: ${percentage}%`).
- Extracting `.adm-*` structural CSS into Tailwind utility classes entirely would be a large refactor. The strategy assumes we only update the hardcoded `px`/`hsl()` properties inside `globals.css` to reference variables, keeping the BEM-like class structure intact for now.

## 4. Conclusion & Recommended Extraction Strategy
To finalize the design system tokenization, the implementer should follow this 4-step strategy:

1. **Extract Root Variables:** 
   - Define new CSS variables in the `@theme` block of `globals.css` for the hex/hsl colors found in `.veh-img.alt-*`, `.meter-zone`, and `.card-top-listing`.
   - Substitute hardcoded `px` values in `.adm-*` classes with standard CSS spacing variables (e.g., replace `10.5px` with a mapped rem token or use `clamp()` if responsive).
2. **Remove Static Inline Styles:** 
   - Audit `src/app/admin/fahrzeuge/[id]/page.tsx`. Replace all static `style={{}}` declarations with their Tailwind equivalents (e.g., `text-muted-foreground`, `font-display`, `grid-cols-2`).
3. **Decouple Data Layer from CSS:** 
   - Refactor `src/lib/mock/vehicles.ts` to provide semantic keys (e.g. `accentKey: 'success'`) rather than raw `hsl()` strings. 
   - Update any consuming component to render the correct class based on the key.
4. **Clean up Arbitrary Component Values:** 
   - Move the custom map colors in `map-view.tsx` out of arbitrary square brackets and into the theme configuration as named semantic colors.

## 5. Verification Method
1. `grep_search` `globals.css` for `#`, `hsl(`, and `px` to ensure only standard CSS functions (like translations/calc) or theme declarations remain.
2. `grep_search` `src/app/admin/fahrzeuge/[id]/page.tsx` for `style={{` to confirm only dynamic interpolation variants remain.
3. Review `src/lib/mock/vehicles.ts` to ensure `hsl(` does not appear in the data object.
4. Run standard build `npm run build` (or equivalent) to ensure no typing errors were introduced from the mock data refactor.
