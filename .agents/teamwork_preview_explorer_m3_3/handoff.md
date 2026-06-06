# Handoff Report

## 1. Observation
Based on a filesystem audit of `src/app`, the following unrefactored hardcoded values persist:
- **Hardcoded Tailwind `-[...px]` and `-[...rem]` classes** found in:
  - `src/app/admin/anfragen/page.tsx`
  - `src/app/admin/fahrzeuge/[id]/page.tsx`
  - `src/app/angebote/page.tsx`
  - `src/app/fahrzeuge/page.tsx`
  - `src/app/konto/page.tsx`
- **Hardcoded `style={{ ...px }}`** found in:
  - `src/app/calculator/page.tsx`
- **Hardcoded `hsl(...)` string literals** (in arrays, object values, or tailwind arbitrary classes) found in:
  - `src/app/admin/fahrzeuge/[id]/page.tsx`
  - `src/app/admin/fahrzeuge/page.tsx`
  - `src/app/admin/page.tsx`
  - `src/app/calculator/page.tsx`
  - `src/app/fahrzeuge/page.tsx`
  - `src/app/finanzierung/page.tsx`
  - `src/app/kontakt/page.tsx`
  - `src/app/preise/page.tsx`
- **Hardcoded `px`, `rem`, and `hsl(...)`** found extensively in:
  - `src/app/globals.css` (over 400 instances).

The previous worker only logged the findings in text files but failed to modify the actual source files, leading to the integrity violation.

## 2. Logic Chain
1. The project requires moving all design values (spacing, sizing, colors) to the new token system (`tokens/primitive.css` and `tokens/semantic.css`).
2. The presence of `px` and `rem` directly inside Tailwind brackets (e.g. `top-[57px]`) bypasses the token scale. These must be replaced with standard Tailwind classes (e.g., `top-14`) or the new CSS variable references (e.g., `top-[var(--space-14)]`).
3. Inline styles like `style={{ minHeight: '44px' }}` bypass both Tailwind and the token CSS variables. They should be rewritten using classes like `min-h-[var(--space-11)]` or `className="min-h-11"`.
4. Hardcoded `hsl` values, such as `color: 'hsl(0, 72%, 42%)'`, bypass the semantic tokens. These need to reference variables defined in `primitive.css`/`semantic.css` (e.g., `color: 'var(--color-primary)'` or `color: 'var(--color-red-600)'`). Opacity modifiers on `hsl` should be handled via `color-mix` or separate semantic tokens, rather than hardcoding the `hsl` and opacity manually in the files.
5. `globals.css` contains the bulk of the unrefactored rules. It must be updated to replace all bare `hsl()`, `px`, and `rem` instances with their respective `--color-...`, `--space-...`, and `--radius-...` variables.

## 3. Caveats
- `src/app/tokens/primitive.css` and `src/app/tokens/semantic.css` are intentionally allowed to contain `hsl(...)`, `px`, and `rem` values, as these are the source of truth for the tokens.
- Some specific layouts might break if a hardcoded value doesn't exactly match a token in the scale. In such cases, the closest token should be used, or a new token should be added to the scale.

## 4. Conclusion
The implementation agent must stop logging and start editing the files. The recommended strategy is:
1. **Remove hardcoded Tailwind brackets**: Use exact or closest matching Tailwind equivalents (e.g., replace `rounded-[20px]` with `rounded-xl`).
2. **Remove inline style px/rem**: Move `style={{ minHeight: '44px' }}` to `className="min-h-11"`.
3. **Map `hsl` to tokens in `.tsx` files**: Replace strings like `'hsl(0, 72%, 42%)'` with `'var(--color-red-600)'` or `'var(--color-primary)'`. For opacity (e.g., `hsl(0 72% 42% / 0.08)`), use CSS features like `color-mix(in srgb, var(--color-primary) 8%, transparent)` or create an alpha token.
4. **Scrub `globals.css`**: Replace all `px`/`rem` with `var(--radius-...)` or `var(--space-...)`, and replace all `hsl(...)` with the corresponding variables defined in `tokens/primitive.css`.

## 5. Verification Method
1. Run `grep -rE "\[(-?[0-9]+(\.[0-9]+)?(px|rem))\]" src/app/ | grep -v tokens` to ensure no arbitrary px/rem tailwind brackets remain.
2. Run `grep -rE "style=\{\{.*(px|rem).*\}\}" src/app/ | grep -v tokens` to ensure no inline px/rem styles remain.
3. Run `grep -rn "hsl(" src/app/ | grep -v globals.css | grep -v tokens` to ensure all `.tsx` components use CSS variable references instead of raw `hsl()`.
4. Inspect `src/app/globals.css` manually or via `grep -E "px|rem|hsl" src/app/globals.css` to verify the count of hardcoded values has dropped to zero (or only valid declarations remain).
