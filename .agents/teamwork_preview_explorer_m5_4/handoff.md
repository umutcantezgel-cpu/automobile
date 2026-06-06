# Observation

- **Tailwind classes in `src/components/`**: Widespread presence of pure Tailwind utilities across all 29 component files. For example, `src/components/sections/buying-card.tsx` uses `card p-6 space-y-5 w-full`, and `src/components/sections/hero.tsx` uses `max-w-[720px]`.
- **Residual Tailwind classes in `src/app/`**:
  - `src/app/inzahlungnahme/page.tsx`: `max-w-4xl`, `flex-1`, `!grid-cols-1`
  - `src/app/kontakt/page.tsx`: `min-h-screen`
  - `src/app/not-found.tsx`: `mb-4`, `mx-auto`, `max-w-md`, `text-lg`
  - `src/app/fahrzeuge/[id]/page.tsx`: `w-10`, `h-10`, `rounded-lg`, `bg-muted`, `flex`, `p-4`, etc.
  - `src/app/fahrzeuge/fahrzeuge-content.tsx`: `mb-6`, `flex`, `items-center`, `gap-1.5`, etc.
- **`tailwind-merge` usage**: `src/lib/cn.ts` still explicitly imports and relies on `twMerge` from `tailwind-merge`.
- **Hardcoded CSS durations**:
  - `src/app/globals.css`: Contains `--duration-180: 180ms;`, `--duration-350: 350ms;`, and `--animate-shimmer: shimmer 1.5s linear infinite;`.
  - CSS modules: Several files hardcode transitions/animations, e.g., `src/app/home.module.css` (`300ms`, `150ms`, `200ms`), `src/app/calculator/calculator.module.css` (`150ms`, `700ms`), `src/app/service/service.module.css` (`2s`), and others (`angebote`, `inzahlungnahme`, `karriere`, `preise`).
- **Missing `useReducedMotion` & Hardcoded JS durations**: The following Framer Motion components completely lack `useReducedMotion` and hardcode unitless duration values (e.g., `duration: 0.5`):
  - `src/components/sections/buying-card.tsx`
  - `src/components/sections/magazine-gallery.tsx`
  - `src/components/sections/filter-sidebar.tsx`
  - `src/components/sections/vehicle-card.tsx`
  - `src/components/sections/site-header.tsx`
  - `src/components/sections/detailed-timeline.tsx`
  - `src/components/sections/feature-grid.tsx`
  - `src/components/sections/quick-search.tsx`
- Additionally, JS animations in `src/app/` pages hardcode raw numerical durations instead of utilizing centralized duration constants (e.g., `prefersReducedMotion ? 0.01 : 0.6`).

# Logic Chain

- The presence of utility strings like `w-10`, `mb-4`, and `flex-1` directly contradicts the requirement to completely remove Tailwind. `src/lib/cn.ts` facilitates this by still combining them via `tailwind-merge`.
- The existence of raw values like `180ms` in `globals.css` and `300ms` in `.module.css` files bypasses the centralized `--duration-*` token system and breaks style consistency.
- Framer Motion components lacking `useReducedMotion` and hardcoding properties like `duration: 0.5` directly violate the a11y reduced motion mandate.
- To fulfill the milestone requirements, a comprehensive sweep and replace is necessary across all three vectors: CSS structure (Tailwind -> CSS Modules), CSS values (raw ms/s -> var tokens), and JS animation (raw numbers -> JS tokens & conditional hooks).

# Caveats

- Removing Tailwind from `src/components/` and the remaining `src/app/` files requires authoring new CSS Module files for those components, mapping utility classes to standard CSS properties.
- When replacing hardcoded JS animation numbers, the exact values might not map 1:1 to an existing `--duration-*` token, meaning nearest-neighbor approximations or new token additions may be necessary.

# Conclusion

The codebase is only partially refactored and retains critical legacy artifacts. Recommended fix strategy:
1. **Remove `tailwind-merge`**: Refactor `src/lib/cn.ts` to only use `clsx` and remove the `tailwind-merge` dependency.
2. **Eliminate Utility Classes**: Migrate all remaining Tailwind classes in `src/components/` and `src/app/` into localized `.module.css` stylesheets and apply them via standard `styles.*` references.
3. **Tokenize CSS Durations**: Find all `ms` and `s` strings in `globals.css` and CSS Modules and replace them with standard `var(--duration-*)` tokens.
4. **Enforce `useReducedMotion`**: Import and wrap the duration assignments in all 8 identified `src/components/sections/` files.
5. **Tokenize JS Durations**: Replace all raw numbers (e.g., `0.5`, `0.8`) inside `framer-motion` `transition` objects with imported JS duration tokens across the entire `src/` directory.

# Verification Method

- Run `grep -RE "tailwind-merge" src/lib/` to confirm its absence.
- Run `grep -REn 'className="[^"]+"' src/ | grep -E "\b(flex-|mb-|mt-|p-|max-w-|min-h-|w-|h-)\b"` to ensure standard Tailwind prefixes are gone.
- Run `grep -Rn "ms;" src/` and `grep -Rn "s;" src/` to verify no raw time units exist in stylesheets.
- Run `grep -R "framer-motion" src/components | xargs grep -L "useReducedMotion"` to verify all Framer Motion implementations respect the hook.
