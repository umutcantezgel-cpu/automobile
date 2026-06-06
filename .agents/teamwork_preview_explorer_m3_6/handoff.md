# Handoff Report: Hardcoded Values in `src/app`

## Observation

1. Running `grep -nE "[0-9]+px|[0-9]+rem|[0-9]+em|hsl|rgba" src/app/globals.css | wc -l` yielded `269` matches. These primarily occur in the lower half of the file within custom classes like `.price-rating`, `.lightbox`, `.brand-row`, `.adm-card`, etc.
2. A single `rgba` usage remains in `src/app/globals.css:498` (`box-shadow: 0 2px 6px rgba(0,0,0,0.3);`).
3. Running `grep -rnIE "[0-9]+px|[0-9]+rem|[0-9]+em|hsl|rgba" src/app | grep "\.tsx"` found multiple hardcoded values across page components:
   - **Framer Motion Viewports**: `viewport={{ once: true, margin: '-60px' }}` (and `-40px`, `-100px`) found in `ueber-uns`, `kontakt`, `angebote`, `preise`, `finanzierung`, and `service` pages.
   - **Tailwind Arbitrary Values**: 
     - `src/app/kontakt/page.tsx:181`: `shadow-[0_0_20px_color-mix(in_srgb,var(--color-primary)_50%,transparent)]`
     - `src/app/preise/page.tsx`: lines `1109`, `1139`, `1263` contain `tracking-[0.14em]`
   - **Inline Styles**:
     - `src/app/kontakt/page.tsx:174`: `linear-gradient(...) 1px` and `backgroundSize: '40px 40px'`
     - `src/app/vergleich/page.tsx`: lines `234`, `318` use `gridTemplateColumns: \`200px repeat(...)\``
     - `src/app/admin/fahrzeuge/[id]/page.tsx`: uses explicit pixel inline styles on lines `490` (`0 4px 12px`), `551` (`2px solid`), `987` (`blur(12px)`), `988` (`1px solid`), `989` (`padding: '16px 28px'`).
     - `src/app/admin/layout.tsx`: lines `183`, `224`, `240` (e.g., `letterSpacing: '0.02em'`)
4. Inspecting `src/app/tokens/primitive.css` reveals that baseline tokens themselves are defined using forbidden units like `px`, `rem`, `hsl`, and `rgba` (e.g. `hsl(30, 25%, 98%)`, `1.25rem`, `9999px`).

## Logic Chain

1. The prompt strictly forbids `px`, `rem`, `em`, and `hsl`/`rgba` units, while permitting proportional units like `vh`, `vw`, `%`.
2. Based on the 269 grep results in `src/app/globals.css`, the lower half of the file contains hundreds of custom CSS classes that still heavily rely on `px` for spacing, borders, radius, and fonts. These need to be replaced by tokens (e.g., `var(--space-2)`, `var(--t-sm)`) or converted to proportional units.
3. In the TSX files, framer-motion `margin` properties, inline background sizes, and inline grid setups use pixel values instead of percentages or viewport units. These must be migrated to proportional logic or valid design tokens.
4. The tailwind arbitrary brackets (e.g. `tracking-[0.14em]`, `shadow-[0_0_20px...]`) are direct violations and should be replaced with valid tailwind configuration tokens or unitless/proportional utilities.
5. I intentionally ignored components in `src/components/` (where `style={{ width: 20 }}` might exist) to comply strictly with the scope constraints.

## Caveats

- **Scope boundary**: `src/components/` was explicitly excluded. The prompt mentioned "Various inline styles like `style={{ width: 20 }}` remaining in components". Since components were out of scope, the implementer will need to run the provided grep commands over `src/components/` if they are brought into scope later.
- **Tokens translation risk**: Foundational variables in `src/app/tokens/primitive.css` use `px`, `rem`, `hsl`. Changing these to proportional units or hex values might inadvertently break UI layout if not carefully translated or paired with CSS calc.
- **Inline numbers vs units**: Some inline styles like `style={{ opacity: 0.7, flexShrink: 0 }}` were found but are safe since they are unitless.

## Conclusion

Significant hardcoded pixel, rem, em, hsl, and rgba values remain scattered across `src/app/globals.css` (269 instances) and various page components in `src/app/**/*.tsx` (e.g., Framer Motion `viewport` margins, arbitrary tailwind `tracking`/`shadow` classes, and inline style configurations). 

**Recommended Fix Strategy:**
- **`globals.css`**: Replace all `px`, `rem`, `em` in custom classes with proportional values (`%`, `vw`) or unitless/valid vars. Convert the single `rgba(0,0,0,0.3)` usage to hex.
- **TSX Files (Framer Motion)**: Update `viewport={{ margin: "-60px" }}` to use percentages (e.g., `"-10%"`).
- **TSX Files (Arbitrary Tailwind)**: Replace arbitrary values like `-[0.14em]` and `-[0_0_20px...]` with valid token variables or tailwind utility classes.
- **TSX Files (Inline styles)**: Refactor inline styles that embed `px`/`em` (e.g., `gridTemplateColumns: '200px'`, `padding: '16px 28px'`) into Tailwind classes or valid CSS variables.

## Verification Method

To independently verify the remaining hardcoded values, run the following grep commands. If they return no output, the forbidden hardcoded values have been successfully removed.

1. **Verify `globals.css`:**
   ```sh
   grep -rnIE "[0-9]+px|[0-9]+rem|[0-9]+em|hsl|rgba" src/app/globals.css
   ```
2. **Verify TSX pages in `src/app`:**
   ```sh
   grep -rnIE "[0-9]+px|[0-9]+rem|[0-9]+em|hsl|rgba" src/app | grep "\.tsx"
   ```
3. **Verify tokens in `primitive.css`:**
   ```sh
   grep -rnIE "[0-9]+px|[0-9]+rem|[0-9]+em|hsl|rgba" src/app/tokens/primitive.css
   ```
