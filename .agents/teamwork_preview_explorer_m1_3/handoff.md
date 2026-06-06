# Handoff Report

## 1. Observation
- `PROJECT.md` indicates moving from hardcoded CSS to native CSS custom properties in `src/app/tokens/primitive.css` and `src/app/tokens/semantic.css`. "No SCSS, no Tailwind".
- **Global CSS Values**:
  - `src/app/globals.css` uses Tailwind 4 `@theme` block containing raw HSL color values, like `--color-background: hsl(30 25% 97%)`, `--color-primary: hsl(0 72% 42%)`, and `--color-premium: hsl(38 55% 42%)`.
  - It also contains raw spacing and border values: `--radius-DEFAULT: 0.625rem;`, `--radius-lg: 1rem;` (lines 26-29), shadow formulas using `rgba` and `hsl` (lines 31-35), font families (`'Space Grotesk'`, `'Inter'`, `'JetBrains Mono'`), and hardcoded media queries (`@media (min-width: 640px)`).
  - Component classes within `globals.css` hardcode dimensions, like `.btn-lg` (`height: 3rem; padding: 0 1.5rem`), `.container-x` (`max-width: 80rem; padding-left: 1rem`), `.veh-img-grid` (`background-size: 32px 32px`).
- **Inline Component Values (Tailwind utility classes)**:
  - `grep_search` found 128+ occurrences of `px]` and `rem]` within TS/TSX files.
  - Spacing/Sizing in px: `min-h-[44px]` (ubiquitous across buttons and inputs for touch targets, e.g., in `src/app/inzahlungnahme/page.tsx:190`), `max-w-[720px]` (`src/components/sections/hero.tsx:131`), `w-[320px]` (`src/app/fahrzeuge/fahrzeuge-content.tsx:198`), `w-[9px] h-[9px]` (`src/app/konto/page.tsx:143`).
  - Typography in rem: `text-[0.625rem]` (`src/app/calculator/page.tsx:154`, `src/app/preise/page.tsx:1109`), `text-[0.6875rem]`, `text-[0.75rem]`, `text-[0.8125rem]`, `text-[0.875rem]`, `text-[4rem]` (`src/app/ueber-uns/page.tsx:149`).
  - `src/app/globals.css:123` hardcodes clamps like `font-size: clamp(3.5rem, 8vw, 6rem);`.

## 2. Logic Chain
1. `PROJECT.md` mandates removing all Tailwind classes and standardizing on a two-tier CSS variable architecture (`primitive.css` and `semantic.css`).
2. The current codebase heavily relies on Tailwind utility classes using arbitrary bracket values (`[...]`) for both exact spacing/typography logic and layout definitions.
3. The `globals.css` `@theme` block serves as a primitive token foundation but it is intertwined with Tailwind 4 definitions and semantic use-cases.
4. To fulfill Milestone 2 and 3, all arbitrary bracket values (`px`, `rem`) must be translated into standard scale intervals in `primitive.css`.
5. Since we must support strict design system guidelines (fluid clamp, standard scaling, reduced motion), direct inline classes like `min-h-[44px]` must become references like `height: var(--size-min-touch);` or `min-height: var(--space-11);`.

## 3. Caveats
- I did not run extensive runtime `chrome-devtools` inspection to catalog the *computed* dynamic values, as the source code statically reveals all core CSS values injected through Tailwind arbitrary properties and `globals.css`. A runtime inspection might still be useful to verify dynamic responsive scale outputs (like the `clamp` boundaries).
- I did not search for hardcoded `em` values exhaustively, though some exist (e.g. `mr-[0.28em]`).
- Future integration requires refactoring Tailwind out entirely, meaning standard Tailwind classes (like `mt-6`, `pb-32`) must also be mapped to the new CSS token system, not just the bracketed arbitrary values.

## 4. Conclusion
The codebase is replete with hardcoded values disguised as Tailwind utility brackets, as well as monolithic standard values in `globals.css`. 
**Strategy for Extraction (Milestone 2 & 3 preparation)**:
1. **Primitive Tokenization (`primitive.css`)**: Extract all `hsl` colors, `rem` spacing (like `0.625rem`, `3rem`), `px` layout anchors (like `44px`, `320px`), and font families from `globals.css` and the inline bracket occurrences into discrete `--color-*`, `--space-*`, `--radius-*`, `--font-*` variables. Create a spacing scale (e.g., `--space-4: 1rem`, `--space-11: 2.75rem / 44px`).
2. **Semantic Tokenization (`semantic.css`)**: Define functional properties using the primitives. For example, `--color-surface-elevated: var(--color-background-offset);`, `--touch-target-min: var(--space-11);`.
3. **Component Migration**: Remove Tailwind classes (`className="min-h-[44px] text-[0.625rem]"`) and replace them with scoped vanilla CSS files or standard style blocks utilizing `min-height: var(--touch-target-min);` and `font-size: var(--text-xs);`.

## 5. Verification Method
- **Verify inline values**: Run `ripgrep -E '\[\d+(\.\d+)?(px|rem|em)\]' src/` to observe the prevalence of hardcoded layout and font sizes.
- **Verify global CSS**: Run `cat src/app/globals.css | head -n 100` to review the current `@theme` hardcoded color and layout constraints.
- **Validation criteria**: Once extracted, `ripgrep` for `\[.*\]` in `className=` should return 0 results. All colors and dimensions in `.css` files should reference `var(--...)`.
