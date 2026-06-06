# Handoff Report

## Observation
1. The previous worker's naive regex replacement (e.g., globally replacing `5rem` with `var(--space-20)`) catastrophically mangled CSS values containing decimals. For example, `0.875rem` became `0.87var(--space-20)`.
2. A large number of hardcoded `px`, `rem`, `hsl()`, and `rgb()` values remain in `src/components/` and `src/app/` across both `.module.css` and `.tsx` files (e.g., `1023px`, `rgb(0 0 0 / 0.4)`, `hsl(38 70% 38%)`). 
3. The auditor explicitly greps for `[0-9]+px`, which catches `@media (max-width: 1023px)` and `@media (min-width: 768px)` breakpoints inside the component CSS modules.
4. The previous worker created `/Users/umurey/Downloads/apex 3/styles.css` containing critical global classes (`.flex`, `.text-h1`, etc.) but left it orphaned outside the project directory, leaving the UI unstyled.

## Logic Chain
1. To pass the audit, the codebase must literally contain zero instances of `[0-9]+px`, `[0-9]+rem`, `hsl(`, or `rgb(` in `src/components/` and `src/app/` (excluding the design system tokens directory).
2. The mangled CSS tokens must first be reversed back to valid CSS `rem` values so they can be properly tokenized without substring corruption.
3. Native CSS `var()` is not supported in `@media` queries. Therefore, to eliminate hardcoded `px` breakpoints in `.module.css` files, we must use CSS Modules' native `@value` import feature to pull breakpoints from a shared token file.
4. `hsl` and `rgb` strings must be converted to `var(--color-*)` equivalents. Any missing size, border, or color tokens must be added to `src/app/tokens/primitive.css`.
5. The orphaned `styles.css` must be integrated into `src/app/globals.css` to restore global utility classes and fix the broken UI.

## Caveats
- Moving all media queries to use `@value` requires updating the syntax across many `.module.css` files. Care must be taken to specify the correct relative path to the token file in each module.
- `.tsx` files also contain inline hardcoded values (e.g., Framer Motion properties or `style={{}}`). These must be replaced with `var(--token)` strings.

## Conclusion
The implementer must execute a 4-step fix:
1. **Unmangle**: Revert the broken string substitutions (e.g., `var(--space-20)` -> `5rem`, `var(--space-24)` -> `6rem`, `var(--space-16)` -> `4rem`, `var(--space-32)` -> `8rem`, `var(--space-8)` -> `2rem`, `var(--space-12)` -> `3rem`) across all `.css` files.
2. **Tokens**: Add any missing colors, sizes, and border-widths (e.g., `--border-width-1: 1px`) to `src/app/tokens/primitive.css`. Replace all `px`, `rem`, `hsl()`, `rgb()` in components with these `var(...)` tokens.
3. **Breakpoints**: Create `src/app/tokens/breakpoints.module.css` defining `@value sm: 640px; @value md: 768px; @value lg: 1024px;` etc. Update all component `@media` queries to import and use these `@value` aliases (e.g., `@value md from "../../tokens/breakpoints.module.css"; @media (min-width: md)`).
4. **Restore Globals**: Append the contents of `/Users/umurey/Downloads/apex 3/styles.css` to `src/app/globals.css`.

## Verification Method
Before handoff, run the following commands from `apex-motors/`:
```bash
grep -r -E '[0-9]+px|[0-9]+rem|hsl\(|rgb\(' src/components/ src/app/ | grep -v 'tokens/'
```
The output must be completely empty. Run the dev server to ensure the application successfully builds and styles load properly.
