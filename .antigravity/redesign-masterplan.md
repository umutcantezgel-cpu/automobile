# Apex Motors – Redesign Masterplan

Basierend auf den vier parallel durchgeführten Tiefenanalysen (Design/UX, Accessibility, Performance und LCP) wurde der folgende priorisierte, 14-wöchige Masterplan für das Redesign erstellt. Er greift alle gefundenen Anti-Patterns, A11y-Verletzungen und LCP-Blocker auf.

---

## REDESIGN MASTERPLAN — WOCHENPLANUNG

### Woche 01-02: Design System Fundament
- **Token-Architektur definieren:** Konsolidierung der CSS-Variablen in `globals.css` und Auflösung unnötig komplexer Utilities.
- **Typografie-System aufbauen:** Behebung des typografischen "Eyebrow"-Anti-Patterns (`text-transform: uppercase`, `letter-spacing: 0.16em`). Ersetzen durch echte typografische Größenkontraste.
- **Farbsystem bereinigen und dokumentieren:** Entfernen des standardisierten "AI-Default" Sand-Hintergrunds (`hsl(30 25% 97%)`). Umstellung auf ein entschlosseneres "Committed"-Farbmodell (z.B. puristisches Off-White oder ein sattes Dark-Theme, passend zum Premium-Fahrzeugsegment).
- **Spacing und Grid System festlegen:** Eliminierung der "Ghost-Cards" (der illegitime Mix aus `border: 1px solid border` und weitem 40px `box-shadow` Blur). Reduktion übermäßiger Abrundungen (`--radius-xl` auf max 12–16px).
- **Motion-System Grundlagen:** Definition performanter Animationskurven (Vermeidung von Shadow- oder Layout-Animationen on-hover, welche aktuell potenzielles Tearing verursachen).

### Woche 03-04: Komponentenbibliothek
- **Alle bestehenden Komponenten auflisten und kategorisieren:** Fokus auf Kern-Komponenten wie `VehicleCard`, `FilterSidebar` und `SiteHeader`.
- **Jede Komponente nach Protokoll aufwerten:** Brechen der "Monotonie in der Fahrzeug-Auflistung" durch Implementierung asymmetrischer Grid-Varianten für `BigFeatured` Cards (Vermeidung repetitiver "Tapeten").
- **Varianten, Zustände, Accessibility vollständig:** 
  - Erhöhung des Farbkontrasts des Trustpilot-Ratings im Footer (aktuell 3.57:1) auf den WCAG AA Standard von mind. 4.5:1.
  - Implementierung fehlender `<label>` und `aria-label` Bindungen für alle Dropdowns (Marke, Preis, Laufleistung) und das Modell-Search-Input.
  - Vergrößerung der Tap-Targets für Mobile: Footer-Links (aktuell 17px) müssen auf mind. 24x24px (Best Practice 48x48px) angehoben werden.

### Woche 05-06: Seitenredesign (kritische Seiten)
- **Seiten nach Nutzungsfrequenz und Geschäftskritikalität priorisiert:** Fokus auf Homepage (`/`), Suchergebnisseite (`/fahrzeuge`) und Fahrzeugdetail (`/fahrzeuge/[id]`).
- **LCP-Optimierung (Homepage):** Beseitigung der massiven "Element Render Delay" (~1.680 ms auf Mobile). Entfernen der `framer-motion` Initial-States (`opacity: 0`) und künstlichen Verzögerungen (`delayChildren: 0.3`) für LCP-kritischen Text im Hero-Header. Der Text muss auf der Homepage Server-Side-Rendered (SSR) und sofort lesbar sein, bevor JS hydriert.

### Woche 07-08: Seitenredesign (alle weiteren Seiten)
- **Jede verbleibende Seite vollständig behandelt:** Anwendung der neuen UX/UI Tokens auf Informationsseiten (`/service`, `/preise`), Formulare (`/probefahrt`, `/inzahlungnahme`) und Admin-Dashboards.

### Woche 09-10: Animations- und Interaktionssystem
- **Motion-System vollständig implementiert:** Fokus auf performante, Hardware-beschleunigte `transform` und `opacity` Übergänge.
- **Seiten-Übergänge, Mikro-Interaktionen, Scroll-Animationen:** Entfernen von Tearing-auslösenden `hover:-translate-y-px` combined mit Shadow-Expansions. Sanftere Stagger-Einblendungen der Fahrzeugkarten.

### Woche 11-12: Accessibility-Härtung und Performance
- **WCAG 2.2 AA vollständig verifiziert:** Erneuter Lighthouse und manueller Audit. Fokus auf Keyboard-Traps in Modal/Drawer Menüs und Focus-State Klarheit.
- **Core Web Vitals im grünen Bereich auf allen Seiten:** Sicherstellen, dass FCP (aktuell 96ms) und TTFB (aktuell 2ms) weiterhin so performant bleiben und die JS-Payload (~1.18 MB) nicht weiter anwächst.

### Woche 13-14: Qualitätssicherung und Dokumentation
- **Alle Quality Gates aktiv:** CI/CD Integration von Lighthouse CI und automatisierter Bundle-Size Analyse.
- **Vollständige Design-System-Dokumentation:** Festhalten der Brand-Regeln im internen `DESIGN.md`.
- **Komponentenbibliothek-Dokumentation fertig:** Finale Übergabe.
