
## 2026-06-07T15:09:07Z
Fix all mobile responsiveness, layout overlap, and scaling issues across the entire Apex Motors Next.js codebase to ensure a pixel-perfect experience on all devices.

Working directory: /Users/umurey/Downloads/apex 3/apex-motors
Integrity mode: development

## Requirements

### R1. CSS-Only Adjustments
Resolve all overlapping elements, overflowing text, and layout breaks (especially on mobile viewports like 375px) exclusively by adjusting Tailwind CSS properties (paddings, margins, flex-wrap, text sizes). Do not delete elements or fundamentally restructure the HTML/React component hierarchies.

### R2. Global Site Audit
The agent team must systematically inspect all 17 pages (focusing heavily on `page.tsx`, `fahrzeuge/page.tsx`, `kontakt/page.tsx`, `preise/page.tsx`) and fix header overlap, unreadable text, and misaligned components on mobile screens.

## Acceptance Criteria

### Audit & Verification (Agent-as-Judge)
- [ ] An Audit Agent starts a local Next.js development server on a free port (e.g., 3006).
- [ ] The Audit Agent uses a headless browser (or DOM bounding box analysis script) to simulate mobile viewports (e.g., iPhone 12/13/14 widths).
- [ ] The Audit Agent explicitly verifies that the SiteHeader no longer overlaps page content on mobile.
- [ ] The Audit Agent explicitly verifies that no text overflows its container on mobile.
- [ ] The implementation agents continue iterating until the Audit Agent certifies that zero layout overlap issues remain on the checked pages.
