# Handoff Report: CSS Hardcoded Values Investigation

## 1. Observation
1. **`globals.css` - Raw dimensions**: Dozens of classes (`.adm-nav-badge`, `.adm-env`, `.adm-nav-section`, `.badge-top-listing`) hardcode `font-size: 10.5px`. Other classes define strict padding/gaps (`28px`, `22px 28px`), border-radius (`9px`), and max-widths (`max-width: 1400px`).
2. **`globals.css` - Hardcoded Colors**: Over 80 unique `hsl()` and hex colors exist outside the `@theme` token definitions. Examples include `.veh-img.alt-*` radial gradients (e.g., `#ffffff` to `#ececef`), `.meter-zone` backgrounds (`linear-gradient(90deg, hsl(142 55% 80%), hsl(142 50% 70%))`), and `.badge-top-listing` backgrounds. Shadows like `--shadow-card` use `rgba(40,20,20,0.06)` instead of relying on theme variables. Alpha values in badges use explicit `hsl(0 72% 42% / 0.15)` instead of variable modifiers.
3. **TSX Inline Styles**: Extensive use of inline `style={{}}` attributes passing explicitly hardcoded dimensions rather than utility classes. For example, `src/app/admin/fahrzeuge/[id]/page.tsx` uses `style={{ width: 160 }}`, `style={{ width: 120 }}`, `style={{ borderRadius: '16px 16px 0 0' }}`, `style={{ maxWidth: 1400 }}`, and `style={{ gridTemplateColumns: 'repeat(2, 1fr)' }}`.
4. **TS/TSX Hardcoded `hsl()`**: `src/lib/mock/vehicles.ts` contains `PRICE_RATING_MAP` with explicitly hardcoded `accent: 'hsl(142 50% 38%)'`, etc. Similarly, `src/components/sections/map-view.tsx` relies heavily on arbitrary values in class names like `bg-[hsl(220,15%,13%)]`, `from-[hsl(40,70%,78%)]`, and inline styles for gradients using `hsl(0 0% 100% / 0.4)`.

## 2. Logic Chain
1. The project uses Tailwind CSS v4, initialized by `@import "tailwindcss";` and a local `@theme` block in `globals.css`.
2. By defining hardcoded `px`, `#hex`, and `hsl()` values across CSS and TSX files, the UI circumvents the design system defined in the `@theme` block, creating maintenance debt and limiting themeability (e.g., dark mode support).
3. The inline `style={{}}` properties for dimensions (`width`, `borderRadius`, `maxWidth`, `gridTemplateColumns`) bypass Tailwind's responsive sizing utility tokens and JIT compiler entirely.
4. Data definitions (`mock/vehicles.ts`) injecting raw `hsl()` strings into UI components break the separation of concerns. UI tokens should be resolved at the theme level, not data level.

## 3. Caveats
- I did not search every single TSX file exhaustively for every single `px` or `hsl` string, but `grep` sampling indicates the issue is systemic across the `admin` and `sections` components.
- The `PRICE_RATING_MAP` is mock data, but it dictates production UI styling. If a backend supplies these `hsl()` strings in production, the data model itself may need adapting to return token keys instead of raw color codes.

## 4. Conclusion
To safely extract these hardcoded values into the design system without changing functionality, the following strategy is recommended:
1. **Extend the `@theme` block:** Add granular primitives for typography (`--text-micro: 10.5px;`), spacing/radius (`--radius-md: 9px;`), and specific UI colors (e.g., `--color-map-bg`, `--color-meter-good-start`) inside `globals.css`.
2. **Convert `globals.css` static variables:** Refactor hardcoded alphas to use Tailwind's native color-mix/opacity modifiers on base tokens (`var(--color-primary) / 0.15` or equivalent Tailwind syntax). Replace `hex` codes in gradients with theme-mapped token names.
3. **Migrate inline `style={{}}` to Tailwind Utilities:** Replace `style={{ width: 160 }}` with `w-40` or `w-[160px]`, `style={{ borderRadius: '16px 16px 0 0' }}` with `rounded-t-2xl`, etc.
4. **Refactor TS Hardcoded Colors:** In `PRICE_RATING_MAP` (`mock/vehicles.ts`), change raw `hsl` values to semantic token references (e.g., `accent: 'var(--color-success-dark)'`) or map them to existing standard colors. Do the same for `map-view.tsx` by replacing `bg-[hsl(...)]` with semantic utility classes (e.g., `bg-map-dark`).

## 5. Verification Method
- Run `grep -ri "style={{" src/` to confirm inline layout attributes (width, height, padding, border-radius, max-width) are removed.
- Run `grep -rE "hsl\(|#[0-9a-fA-F]{3,6}" src/app/globals.css` (excluding the main `@theme` color definitions) to verify no stray hex/hsl values remain in standard CSS blocks or gradients.
- Inspect `src/lib/mock/vehicles.ts` and `src/components/sections/map-view.tsx` to verify `hsl(` is fully absent.
- Ensure `npm run dev` builds successfully and visually test the admin layout and map section to ensure layout widths and gradient colors match the original hardcoded visuals.
