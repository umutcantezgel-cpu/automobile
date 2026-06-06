# Scope: Milestone 5 - Retry Codebase Integration

## Architecture
- Module/package boundaries: React/Next.js UI components and global CSS, specifically focusing on `src/app` and `globals.css` inside `apex-motors`.

## Milestones
| # | Name | Scope | Dependencies | Status |
|---|------|-------|-------------|--------|
| 5 | Retry Codebase Integration | Remove Tailwind CSS, fix hardcoded CSS values, fix reduced motion implementation, add high contrast mode preference. | none | DONE |

## Interface Contracts
- Native CSS usage only.
- Respect Design System tokens for sizing, colors, typography.
- Respect `prefers-contrast: more` and `prefers-reduced-motion: reduce`.
- Framer motion components must respect `useReducedMotion`.
