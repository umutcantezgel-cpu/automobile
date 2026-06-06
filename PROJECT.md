# Project: Apex Motors Design System

## Architecture
- Move from hardcoded CSS values to a strict, token-based native CSS design system.
- Two core token files:
  - `src/app/tokens/primitive.css`: Contains scale-based variables (colors, typography, spacing, border-radius, shadows).
  - `src/app/tokens/semantic.css`: Maps primitive tokens to semantic meanings (surfaces, text, borders, interaction).
- Components will import and use these CSS variables. No SCSS, no Tailwind.

## Milestones
| # | Name | Scope | Dependencies | Status |
|---|------|-------|-------------|--------|
| 1 | Inventory & Extraction | Inventory hardcoded CSS values in the codebase and extract computed styles from live browser via `chrome-devtools`. Write `.antigravity/design-system/token-inventory.md`. | none | DONE |
| 2 | Token Architecture | Create `src/app/tokens/primitive.css` and `src/app/tokens/semantic.css` defining the required scales (Purist Off-White, Primary Red, Accent Gold, Space Grotesk/Inter/JetBrains, fluid clamp, reduced motion, etc.). | 1 | DONE |
| 3 | Codebase Integration | Apply the generated tokens to all existing components in `src/app`. Remove all hardcoded px/rem values for spacing, typography, colors. | 2 | FAILED_VALIDATION |
| 4 | Validation & Report | Validate the application of tokens. Visually test in standard, high contrast, reduced motion. Write `.antigravity/design-system/validation-report.md`. | 3 | DONE_WITH_FAILURES |
| 5 | Retry: Codebase Integration | Strictly remove ALL Tailwind usage, fix reduced-motion breaking layout, and remove remaining hardcoded values identified in M4. | 4 | IN_PROGRESS |
| 6 | Retry: Validation & Report | Generate a new passing validation-report.md. | 5 | PLANNED |

## Interface Contracts
### `tokens/primitive.css` ↔ `tokens/semantic.css`
- Semantic tokens must reference primitive tokens via `var(--...)`.
- Primitive tokens use raw values (px, rem, hex, etc.).

### Components ↔ `tokens/semantic.css`
- Components ideally use semantic tokens for colors and layout to support theming, but may use primitive tokens for specific layout spacing where semantic mapping is overkill.
- Hardcoded px, rem, or color values are strictly prohibited in component CSS after Milestone 3.

## Code Layout
- `.antigravity/design-system/token-inventory.md`
- `.antigravity/design-system/validation-report.md`
- `src/app/tokens/primitive.css`
- `src/app/tokens/semantic.css`
