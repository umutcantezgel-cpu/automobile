# Handoff Report

## 1. Observation
- `src/app/globals.css` contains numerous hardcoded `px` values, particularly in the lower half (e.g. lines 790+, like `height: 10px`, `border-radius: 9999px`, `width: 260px`). It also contains `rgba` at line 498: `box-shadow: 0 2px 6px rgba(0,0,0,0.3);`.
- `src/app/kontakt/page.tsx` line 181 has `shadow-[0_0_20px_color-mix(in_srgb,var(--color-primary)_50%,transparent)]`.
- `src/app/preise/page.tsx` lines 1109, 1139, 1263 contain `tracking-[0.14em]`.
- Various `.tsx` files in `src/app/admin/` use inline `style={{ ... }}` with bare numbers that act as pixel values, e.g., `width: 20`, `height: 20`, `borderRadius: 9`, `width: 56`, `height: 38`.

## 2. Logic Chain
- The project scope prohibits the use of hardcoded `px`, `rem`, `em`, and `hsl`/`rgba` in `src/app` and `globals.css` (excluding layout proportional units and the raw tokens in `src/app/tokens/primitive.css`).
- `globals.css` contains hardcoded `px` dimensions that should be mapped to the `var(--space-*)` and `var(--radius-*)` tokens.
- The `rgba` color should be mapped using `color-mix` and semantic color variables.
- Tailwind arbitrary properties like `-[...px]` and `-[...em]` should be converted into token-backed classes or standard Tailwind utilities (e.g., `tracking-widest`).
- Inline React styles with numeric pixel mappings (e.g. `width: 20`) bypass the token system and should be rewritten to use Tailwind classes like `w-5`, `h-5`, `rounded-lg`, or removed in favor of CSS variables.

## 3. Caveats
- `src/app/tokens/primitive.css` was intentionally excluded from the fix strategy because it is the base dictionary defining the CSS variables (which require `px`, `rem`, `hsl`).
- Some unitless values inside inline styles may be legitimate (e.g. `flexShrink: 0`, `opacity: 0.7`) and should not be blindly replaced.
- Proportional units (`%`, `vh`, `vw`) are explicitly allowed for layout grids and have been ignored in this assessment.

## 4. Conclusion
There are still hundreds of hardcoded `px` values, mostly concentrated in `globals.css` (from the `.market-meter` definitions downwards) and inline React style objects in `.tsx` components within `src/app/admin/`. Additionally, there are scattered occurrences of Tailwind arbitrary pixel/em values (`shadow-[...px]`, `tracking-[...em]`) in `kontakt/page.tsx` and `preise/page.tsx`.

### Recommended Fix Strategy
1. **globals.css**: Map `px` constraints to `var(--space-*)` and `var(--radius-*)` tokens. Convert `rgba(...)` to `color-mix`.
2. **Tailwind Arbitrary Strings**: Extract custom shadows like `[0_0_20px_...]` into custom shadow tokens in `globals.css` and reference them as classes (e.g., `shadow-glow-primary`). Replace `[0.14em]` with standard Tailwind tracking utilities.
3. **Inline Styles**: Replace hardcoded inline numbers `style={{ width: 20, height: 20 }}` with matching Tailwind spacing classes (e.g., `w-5 h-5`) and remove them from the `style` object.

## 5. Verification Method
Run the following `grep` commands to locate remaining issues:

1. Locate all `px`, `rem`, `em`, `hsl`, `rgba` in `globals.css`:
```bash
grep -n -E '[0-9.]+(px|rem|em)|hsl\(|rgba\(' src/app/globals.css
```

2. Locate Tailwind arbitrary `px`/`rem`/`em` values in all `.tsx` files:
```bash
grep -nro -E '\[[^]]*[0-9]+(px|rem|em)[^]]*\]' src/app
```

3. Locate inline numeric dimensional styles in `.tsx` files:
```bash
grep -nro -E '(width|height|borderRadius): [0-9]+' src/app
```

To invalidate: Verify that none of the commands above yield any results that fall under the prohibited criteria.
