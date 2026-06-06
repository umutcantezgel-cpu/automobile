# BRIEFING — 2026-06-04T19:37:41-07:00

## Mission
Investigate remaining hardcoded CSS values (`rem`, `px`, `hsl`, `rgb`) in `src/components/` and `src/app/` CSS modules and propose a fix strategy to replace them with global tokens.

## 🔒 My Identity
- Archetype: Explorer
- Roles: Read-only investigator
- Working directory: /Users/umurey/Downloads/apex 3/apex-motors/.agents/explorer_m6_1_gen2
- Original parent: 38ab5574-b6b5-45d3-b877-503a616b527f
- Milestone: Fix hardcoded CSS values integration

## 🔒 Key Constraints
- Read-only investigation — do NOT implement
- Find all remaining hardcoded values and identify the correct global tokens for replacement.
- Report strategy in handoff.md and send_message.

## Current Parent
- Conversation ID: 38ab5574-b6b5-45d3-b877-503a616b527f
- Updated: not yet

## Investigation State
- **Explored paths**: `src/components/`, `src/app/tokens/`, `.tsx` files, orphaned `styles.css`.
- **Key findings**: 
  - Hundreds of `px`, `em`, `hsl`, `rgb` instances remain in CSS modules and `.tsx` files.
  - Media queries contain `px` which triggers the regex.
  - Previous worker orphaned `styles.css` containing vital global classes.
- **Unexplored areas**: N/A

## Key Decisions Made
- Proposed AST-based replacement using `postcss` to avoid substring corruption.
- Proposed `postcss-custom-media` to fix media query breakpoints without failing the audit.
- Mapped remaining hardcoded values to new or existing tokens using `color-mix`.
- Identified `px` usage in `.tsx` files that must also be cleaned.

## Artifact Index
- `.agents/explorer_m6_1_gen2/handoff.md` — Proposed fix strategy
- `.agents/explorer_m6_1_gen2/postcss-plugin.js` — Proposed PostCSS plugin skeleton for the implementer
