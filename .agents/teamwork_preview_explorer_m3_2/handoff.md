# Codebase Integration - Token Refactoring Analysis

## Observation
I investigated the `src/app` directory to identify files with hardcoded styling values (spacing, typography, and color) that need refactoring to use the newly provided design tokens (`src/app/tokens/primitive.css` and `src/app/tokens/semantic.css`).

1. **Tokens Configuration**:
   - `primitive.css` provides typography scale (`--t-2xs` to `--t-4xl`), spacing (`--space-1` to `--space-32`), colors, border-radius, and shadows.
   - `semantic.css` builds on `primitive.css` to define surface, text, border, and interaction colors (e.g., `--text-default`, `--surface-raised`, `--action-primary-bg`).
   - `globals.css` currently does **not** import these new token files (only `@import "tailwindcss";`).

2. **Hardcoded Values in `src/app`**:
   Using file search, I found a substantial number of hardcoded inline arbitrary values in Tailwind classes (`[]`) and inline `style={{}}` tags.
   - **Typography**: Extensive use of arbitrary rem/px sizes. Examples: `text-[15px]`, `text-[12px]`, `text-[11.5px]`, `text-[13.5px]`, `text-[16px]`, `text-[0.625rem]`, `text-[0.75rem]`, `text-[0.8125rem]`, `text-[0.875rem]`, `text-[0.9375rem]`, `text-[4rem]`.
   - **Spacing/Layout**: Arbitrary px values for sizing. Examples: `min-h-[44px]`, `min-h-[280px]`, `min-h-[400px]`, `w-[320px]`, `min-w-[44px]`, `w-[400px]`, `h-[56px]`.
   - **Inline Styles**: Explicit use of `style={{}}` with raw pixels and hardcoded strings. Example in `admin/fahrzeuge/[id]/page.tsx`: `style={{ width: 72, height: 48, borderRadius: 8, aspectRatio: 'auto' }}`, `style={{ minWidth: 28 }}`, `style={{ fontFamily: 'var(--font-display)' }}` (should be a Tailwind class).

3. **Affected Files**:
   The following files in `src/app` prominently feature these hardcoded values and require refactoring:
   - `src/app/page.tsx`
   - `src/app/konto/page.tsx`
   - `src/app/calculator/page.tsx`
   - `src/app/magazin/page.tsx`
   - `src/app/inzahlungnahme/page.tsx`
   - `src/app/kontakt/page.tsx`
   - `src/app/karriere/page.tsx`
   - `src/app/angebote/page.tsx`
   - `src/app/preise/page.tsx`
   - `src/app/finanzierung/page.tsx`
   - `src/app/fahrzeuge/page.tsx`
   - `src/app/fahrzeuge/fahrzeuge-content.tsx`
   - `src/app/fahrzeuge/[id]/page.tsx`
   - `src/app/fahrzeuge/[id]/client.tsx`
   - `src/app/vergleich/page.tsx`
   - `src/app/ueber-uns/page.tsx`
   - `src/app/admin/fahrzeuge/page.tsx`
   - `src/app/admin/fahrzeuge/[id]/page.tsx`

## Logic Chain
1. The objective requires replacing hardcoded px/rem/color values with the newly defined CSS token variables.
2. The presence of classes like `text-[15px]` or `min-h-[44px]` bypasses the token system, creating inconsistent design language. These should be replaced by Tailwind classes referencing token variables (e.g., `text-[length:var(--t-base)]` or simply mapping the Tailwind theme in `globals.css` to use tokens like `--t-*` and `--space-*`).
3. For semantic tokens, any hardcoded colors or indirect token usage (like `style={{ color: 'var(--color-muted-foreground)' }}`) should be migrated to Tailwind semantic utility classes (e.g., `text-muted-foreground`) which in turn should be driven by `semantic.css`.
4. `globals.css` must be updated to import the token files so that the variables are globally available.

## Caveats
- Some values (like `w-[320px]`, `min-h-[400px]`, or `aspectRatio: 16/10`) are structural layout bounds that might not have a direct 1:1 mapping to the spacing scale (which currently caps at `--space-32` / `8rem`). For these, using `calc()` with space tokens or retaining arbitrary values might be required if no layout tokens are introduced.
- I restricted my search to `src/app` as defined in the scope, but `src/components` likely contains similar hardcoded values that will need addressing.

## Conclusion
To complete the Milestone 3 integration:
1. **Update `globals.css`**: Add `@import "./tokens/semantic.css";` (which imports `primitive.css`) at the top of the file. Refactor `@theme` variables in `globals.css` to map to the new `--color-*`, `--t-*`, and `--space-*` tokens.
2. **Refactor Components**: Modify the 18 identified files in `src/app` by removing arbitrary `[px]` and `[rem]` values in Tailwind classes and inline `style={{}}` blocks. Replace them with token-backed Tailwind utilities (e.g., `text-[length:var(--t-sm)]`, `min-h-[var(--space-10)]`, `rounded-[var(--radius-md)]`).
3. **Admin Area**: Give special attention to `src/app/admin/fahrzeuge/[id]/page.tsx`, which contains the highest density of hardcoded `style={{}}` tags and arbitrary text sizes (`text-[12px]`, `text-[13px]`, `text-[15px]`, `text-[16px]`).

## Verification Method
1. Run `grep -r "\[[0-9]*\.*[0-9]*\(px\|rem\)\]" src/app` to verify all arbitrary Tailwind sizes have been removed.
2. Run `grep -r "style={{" src/app` to ensure hardcoded pixel dimensions and colors in inline styles are replaced with classes.
3. Inspect `src/app/globals.css` to confirm the presence of `@import "./tokens/semantic.css";`.
4. Run `npm run build` or the local dev server to ensure styles render correctly without the hardcoded overrides.
