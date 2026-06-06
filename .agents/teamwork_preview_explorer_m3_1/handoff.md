# Handoff: Token Refactoring in `src/app`

## Observation
I investigated the `src/app` directory to identify files that require refactoring to use the new CSS tokens defined in `src/app/tokens/primitive.css` and `src/app/tokens/semantic.css`. 

1. **`src/app/globals.css` and `src/app/layout.tsx`**:
   - `globals.css` does not `@import` the token files (`primitive.css` and `semantic.css`).
   - `globals.css` contains an extensive `@theme` block with hardcoded `hsl()` values, `rem` values, and CSS variable definitions that duplicate or conflict with the tokens (e.g., `--color-background: hsl(30 25% 97%)`, `--radius-sm: 0.375rem`). 
   - `globals.css` also contains hardcoded hex values in component classes (e.g., `#ffffff` and `#ececef` on line 541).

2. **`.tsx` Component Files**:
   - Multiple component files use hardcoded arbitrary `rem` values for typography (e.g., `src/app/page.tsx` uses `text-[0.875rem]`, `text-[0.75rem]`, `text-[0.9375rem]`, `text-[0.8125rem]`).
   - Extensive use of hardcoded arbitrary `px` values for spacing and sizing across almost all pages (e.g., `min-h-[44px]`, `w-[9px]`, `min-h-[280px]`, `w-[400px]`, `w-[320px]`, `min-w-[640px]`).
   - Specific files identified containing `[px]` arbitrary Tailwind classes include (but are not limited to):
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
     - `src/app/fahrzeuge/fahrzeuge-content.tsx`
     - `src/app/fahrzeuge/[id]/client.tsx`
     - `src/app/fahrzeuge/[id]/page.tsx`
     - `src/app/fahrzeuge/page.tsx`
     - `src/app/vergleich/page.tsx`

## Logic Chain
1. The project requires applying tokens from `primitive.css` and `semantic.css` to all components in `src/app`.
2. The tokens define specific primitive variables (`--color-*`, `--space-*`, `--t-*`, `--radius-*`) and semantic variables (`--surface-*`, `--text-*`, `--action-*`).
3. `globals.css` currently defines its own overriding color scale and spacing, which prevents the application from standardizing around the new tokens. It also fails to import the token files.
4. `.tsx` components are bypassing the design system by using Tailwind's arbitrary value syntax (`-[...]`) for padding, heights, widths, and font sizes (e.g., `min-h-[44px]`, `text-[0.875rem]`), which need to be mapped to the closest token variables.

## Caveats
- The `primitive.css` file defines spacing tokens up to `--space-32` (8rem / 128px). Some components use large hardcoded layout dimensions (e.g., `min-h-[500px]`, `w-[400px]`). We may need to decide whether to add layout-specific tokens, retain these as exceptions if they are strictly structural, or use percentage/viewport units instead.
- Many `text-[0.875rem]` (14px) and `min-h-[44px]` values exist, but `primitive.css` has `--t-sm` (12.8px) and `--t-base` (16px), as well as `--space-10` (40px) and `--space-12` (48px). The implementation will require snapping to the closest valid token or adding the missing token to the primitives.

## Conclusion
A codebase-wide refactor is required. 

**Recommended Fix Strategy:**
1. **Global CSS**: Add `@import "./tokens/primitive.css";` and `@import "./tokens/semantic.css";` at the top of `src/app/globals.css`.
2. **Tailwind Theme Mapping**: Replace all hardcoded `hsl()` and `rem` values inside the `@theme` block in `globals.css` with references to the semantic and primitive tokens (e.g., `--color-primary: var(--action-primary-bg);`).
3. **Refactor Hardcoded Hexes**: Replace hex values like `#ffffff` in `globals.css` with `var(--color-off-white-50)`.
4. **Refactor Components**: Run a find-and-replace across `src/app/**/*.tsx` for arbitrary bracket values:
   - Map `text-[0.875rem]` and similar typography to `text-[var(--t-sm)]` or `text-[var(--t-base)]`.
   - Map `min-h-[44px]` and similar small spacing constraints to `min-h-[var(--space-10)]`.
   - Review large layout widths/heights (e.g., `w-[400px]`) and refactor to use flex/grid ratios or large token variables where applicable.

## Verification Method
- **Inspection**: Check `src/app/globals.css` to verify the `@import` statements exist and `@theme` utilizes `var(--...)`.
- **Search**: Run `grep -r "\[[0-9]*\(px\|rem\)\]" src/app` to verify all hardcoded typography and small/medium spacing arbitrary values have been removed.
- **Build/Test**: Run `npm run build` or `npm run dev` to ensure styles are unbroken.
