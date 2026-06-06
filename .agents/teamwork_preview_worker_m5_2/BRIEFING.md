# BRIEFING — 2026-06-04T16:47:41-07:00

## Mission
Refactor 5 admin page files to replace Tailwind with CSS modules and add useReducedMotion for framer-motion.

## 🔒 My Identity
- Archetype: implementer
- Roles: implementer, qa, specialist
- Working directory: /Users/umurey/Downloads/apex 3/apex-motors/.agents/teamwork_preview_worker_m5_2
- Original parent: c9ae9f67-b417-4e2b-bffc-2713e58a79f3
- Milestone: Milestone 5: Retry Codebase Integration

## 🔒 Key Constraints
- Completely remove ALL Tailwind utility classes and hardcoded values.
- Replace with native CSS modules or standard classes (matching the established pattern).
- Ensure any `framer-motion` usages in these files import and use the `useReducedMotion` hook.
- DO NOT CHEAT. All implementations must be genuine.

## Current Parent
- Conversation ID: c9ae9f67-b417-4e2b-bffc-2713e58a79f3
- Updated: not yet

## Task Summary
- **What to build**: Refactor admin pages (anfragen/page, fahrzeuge/[id]/page, fahrzeuge/page, layout, page).
- **Success criteria**: No Tailwind classes remain. useReducedMotion added where framer-motion is used. CSS modules map to classes.
- **Interface contracts**: /Users/umurey/Downloads/apex 3/apex-motors/PROJECT.md
- **Code layout**: src/app/admin/

## Key Decisions Made
- Extracted inline styles inside React events (e.g. `onMouseEnter`) into standard CSS `:hover` module properties.
- Converted animation constants to functions passing `prefersReducedMotion` to cancel transitions dynamically.

## Change Tracker
- **Files modified**: `admin/layout.tsx`, `admin/page.tsx`, `admin/fahrzeuge/page.tsx`, `admin/anfragen/page.tsx`, `admin/fahrzeuge/[id]/page.tsx` (+ CSS modules)
- **Build status**: Pass.
- **Pending issues**: None.

## Quality Status
- **Build/test result**: Pass. Next.js build succeeds cleanly.
- **Lint status**: Pass.
- **Tests added/modified**: N/A (CSS refactor)
