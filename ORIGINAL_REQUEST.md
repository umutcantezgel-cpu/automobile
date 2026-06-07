# Original User Request

## Initial Request — 2026-06-04T21:58:07Z

Working directory: /Users/umurey/Downloads/apex 3/apex-motors
Integrity mode: development

## Requirements

### R1. Design System Inventory & Extraction
- Führe eine Inventarisierung der aktuell hartkodierten Werte im Codebase (Farben, Typografie, Spacing, Shadows, Border-Radius, Motion) durch.
- Extrahiere die Computed Styles aus dem Live-Browser via `chrome-devtools`.
- Exportiere die Ergebnisse nach `.antigravity/design-system/token-inventory.md`.

### R2. Primitive & Semantic Tokens (`tokens/primitive.css`, `tokens/semantic.css`)
- Definiere Primitive Tokens: Farben (Helligkeitsskala 50-950 für Puristisches Off-White, Primary Red, Accent Gold), Schriftgrößen (t-2xs bis t-4xl in rem), Abstände (space-1 bis space-32 als 4px Vielfache), Border-Radius (none bis full), Schatten (1 bis 5).
- Definiere Semantic Tokens: Oberflächen (default, raised, overlay, sunken), Text, Rahmen, Interaktion, Status.
- Die CSS-Methodik ist natives CSS in diesen zwei dedizierten Dateien (kein Tailwind oder SCSS).

### R3. Typografie- und Motion-System
- Typografie: Fluid Typography mit `clamp()` ab `text-3xl`, Modular Scale 1.25. (Space Grotesk für Display, Inter für Text, JetBrains Mono für Code).
- Motion: Easing-Funktionen (`ease-appear`, etc.) und Dauer-Stufen (`duration-instant` bis `deliberate`).
- Vollständige Implementierung von `prefers-reduced-motion: reduce` (Duration auf 0.01ms, Transforms deaktiviert).

### R4. Anwendung & Validierung
- Wende alle generierten Tokens auf die bestehenden Komponenten an. Es dürfen keine hartkodierten Werte mehr vorhanden sein.
- Führe eine Validierung durch und exportiere den Bericht nach `.antigravity/design-system/validation-report.md`.
- Führe visuelle Tests im Browser (Standard, High Contrast, Reduced Motion) durch und dokumentiere Abweichungen.

## Acceptance Criteria

### Audit & Inventory
- [ ] `token-inventory.md` existiert und enthält die extrahierten Baseline-Werte.

### Token Architecture
- [ ] `src/app/tokens/primitive.css` existiert und enthält alle primitiven Tokens.
- [ ] `src/app/tokens/semantic.css` existiert und mappt semantische Bedeutungen auf primitive Tokens.
- [ ] Typografie-Skala implementiert Fluid Typography für große Überschriften.
- [ ] Motion-Tokens enthalten vollständige `prefers-reduced-motion` Fallbacks.

### Codebase Integration
- [ ] Keine hartkodierten `px` oder `rem` Werte für Spacing, Typography oder Colors in den Komponenten. Alles nutzt die neuen CSS Variables.

### Validation
- [ ] `validation-report.md` existiert und bestätigt die lückenlose Anwendung der Tokens.

## Follow-up — 2026-06-07T15:09:07Z

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
