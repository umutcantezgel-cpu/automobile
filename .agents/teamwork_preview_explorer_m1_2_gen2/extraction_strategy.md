# Strategy for Extracting Hardcoded CSS Values into Design System Tokens

Based on the investigation, here is the recommended strategy for extracting the missed hardcoded values into the design system:

## 1. Colors & Gradients (hsl, hex, rgba)
**Findings:** 
- Over 80 unique hardcoded `hsl()` and `hex` values in `globals.css` (e.g., gradients for `.veh-img` alternates, `.meter-zone`, `.card-top-listing`, and `::selection`).
- Inline `style={{ backgroundColor: color.hex }}` in `filter-sidebar.tsx`.
- Hardcoded `hsl` values in `vehicles.ts` mock data (`hsl(142 50% 38%)`) and `map-view.tsx` arbitrary classes (`bg-[hsl(220,15%,13%)]`).

**Strategy:**
- **Centralize Theme Colors:** Expand the `@theme` directive or Tailwind config to include comprehensive semantic color tokens for specialized UI states (e.g., `--color-premium-start`, `--color-meter-good`, `--color-veh-alt-1`).
- **Refactor Mock Data:** Change mock data to return token references (e.g., `accent: 'success'`) instead of raw `hsl()`, and construct the style dynamically or via generic classes.
- **Remove Bracket Colors:** Replace arbitrary Tailwind classes like `bg-[hsl(220,15%,13%)]` with new design system tokens (e.g., `bg-map-base`).
- **Standardize Inline Colors:** For `filter-sidebar.tsx`, map hex colors to CSS variables (e.g., `var(--color-filter-red)`) to maintain the design system's source of truth.

## 2. Typography (Fractional & Bracket Font Sizes)
**Findings:**
- `globals.css` contains sizes like `font-size: 10.5px`, `11.5px`, and `13.5px` inside classes like `.adm-nav-section`, `.price-rating`, and `.badge-top-listing`.
- Components use arbitrary Tailwind sizes like `text-[10px]`, `text-[11px]`.

**Strategy:**
- **Add Micro-Typography Tokens:** Add new font-size tokens in Tailwind (e.g., `text-xxs` for 10px, `text-xs-minus` for 11px, `text-sm-minus` for 13.5px).
- **Replace CSS & Brackets:** Swap all instances of raw `px` font sizes and arbitrary `text-[...]` brackets with these standardized micro-typography utility classes.

## 3. Spacing & Layout (Raw px and Brackets)
**Findings:**
- `globals.css` defines explicit layout paddings, gaps, widths, and heights (e.g., `padding: 22px 28px` in `.adm-card-head`, `max-width: 1400px` in `.adm-content`).
- Inline styles use hardcoded layout dimensions (`style={{ width: 160, borderRadius: 8, marginTop: 2 }}` in `admin/fahrzeuge/[id]/page.tsx`).
- Components heavily use arbitrary sizing brackets (`min-h-[44px]`, `h-[72px]`, `max-w-[720px]`).

**Strategy:**
- **Convert to Standard Scales:** Many arbitrary sizes align with Tailwind's standard spacing scale (e.g., `44px` is `11` in Tailwind, `72px` is `18`). Replace `min-h-[44px]` with `min-h-11` and `h-[72px]` with `h-18`.
- **Abstract Large Layout Tokens:** For large structural bounds like `1400px` and `720px`, create semantic max-width tokens (e.g., `max-w-screen-admin`, `max-w-hero-content`).
- **Refactor Inline Styles:** Migrate static layout dimensions from `style={{}}` attributes to utility classes (e.g., `w-40`, `mt-0.5`).
- **CSS Spacing Replacement:** Replace raw px values for padding, margin, and gaps in `globals.css` with `@apply p-6` or CSS variable equivalents (e.g., `padding: var(--spacing-6)`).

## 4. Border Radius & Shadows
**Findings:**
- Hardcoded radius values in CSS: `border-radius: 9px` in `.adm-card-icon`, `border-radius: 6px` in `.badge-top-listing`.
- Raw shadow definitions in component arbitrary classes: `shadow-[0_4px_14px_hsl(38,60%,30%/0.4)]` in `map-view.tsx`.

**Strategy:**
- **Expand Radius Scale:** Introduce `--radius-xs` (6px) and `--radius-icon` (9px) into the central theme configuration.
- **Tokenize Custom Shadows:** Move complex shadows from `.veh-img-shape`, `.badge-top-listing`, and `map-view.tsx` into Tailwind's `boxShadow` theme config as named shadows (e.g., `shadow-premium-pin`).
