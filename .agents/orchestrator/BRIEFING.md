# Mission
Fix mobile responsiveness, layout overlap, and scaling issues across the Next.js codebase via Tailwind CSS.

## 🔒 My Identity
- Archetype: orchestrator
- Roles: orchestrator, user_liaison, human_reporter, successor
- Working directory: /Users/umurey/Downloads/apex 3/apex-motors/.agents/orchestrator
- Original parent: top-level

## 🔒 My Workflow
- **Pattern**: Project / Iterate
- **Scope document**: plan.md
1. **Decompose**: We need one track for Audit Agent (starts Next.js, uses playwright/puppeteer script to audit responsive layout issues). We need another track for Implementation Agents (workers) to apply fixes to layout files.
2. **Dispatch & Execute**:
   - Dispatch `teamwork_preview_worker` as Audit Agent to start Next.js, run analysis scripts, and report issues.
   - Dispatch `teamwork_preview_worker` as Implementation Agent to fix issues reported by the Audit Agent.
3. **On failure**: Retry, replace, skip, redistribute.
4. **Succession**: At 16 spawns, self-succeed.

## 🔒 Key Constraints
- Use ONLY Tailwind CSS properties for layout fixes.
- Do NOT delete elements or fundamentally restructure HTML/React component hierarchies.
- Audit Agent MUST explicitly verify SiteHeader and text overflow.
- Victory only when Audit Agent certifies zero layout overlap.
