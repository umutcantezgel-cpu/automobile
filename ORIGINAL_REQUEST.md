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
