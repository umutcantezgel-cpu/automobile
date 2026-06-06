# Scope: Milestone 3: Codebase Integration

## Architecture
- Target components in `src/app`
- Apply tokens from `src/app/tokens/primitive.css` and `src/app/tokens/semantic.css`

## Milestones
| # | Name | Scope | Dependencies | Status |
|---|------|-------|-------------|--------|
| 3 | Codebase Integration | Refactor all components in `src/app` to use token CSS variables instead of hardcoded px/rem/color values. Ensure token CSS files are imported in `globals.css` or layout. | M1, M2 | DONE |

## Interface Contracts
### Existing Components ↔ Tokens
- Components will consume CSS custom properties defined in `primitive.css` and `semantic.css`.
- Examples: `var(--color-background-primary)`, `var(--spacing-4)`, `var(--font-size-base)`.
