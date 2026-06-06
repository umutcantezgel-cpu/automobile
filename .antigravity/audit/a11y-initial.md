# Accessibility Audit Report
**Target**: `http://localhost:3000`  
**Standard**: WCAG 2.2 AA  
**Date**: 2026-06-04  

## 1. Executive Summary
An accessibility audit was performed using Chrome DevTools, Lighthouse, and manual accessibility tree inspections. The application scored **91/100** in the automated Lighthouse accessibility audit. The underlying semantic structure is robust with an excellent heading hierarchy and landmark usage. However, critical issues exist regarding form labeling, color contrast, and tap target sizes on mobile devices.

## 2. Automated Audit (Lighthouse)
- **Score**: 91
- **Passed Audits**: 51
- **Failed Audits**: 3

### Failures
1. **Color Contrast (`color-contrast`)**: Background and foreground colors do not have a sufficient contrast ratio.
   - **Element**: Trustpilot rating `4.9` in the footer (`<span class="font-mono tabular-nums">4.9</span>`).
   - **Details**: Contrast ratio is **3.57:1** (foreground `#a67b30`, background `#f9f7f5`). WCAG AA requires a minimum of **4.5:1** for normal text (size is ~11px).
2. **Missing Labels (`select-name` & Accessibility Tree)**: Select elements do not have associated label elements or accessible names.
   - **Elements**: 
     - Brand select ("Alle Marken")
     - Max Price select ("Keine Begrenzung")
     - Max Mileage select ("Keine Begrenzung")
   - **Details**: These lack a wrapping `<label>`, explicit `id`/`for` binding, or `aria-label`.
3. **Accessibility Tree (`agent-accessibility-tree`)**: Flagged as not well-formed due to the missing accessible names on the select elements mentioned above.

## 3. Semantics & Structure
- **Heading Hierarchy**: Perfectly structured. The page uses sequential headings (`H1` -> `H2` -> `H3` / `H4`) without any skipped levels.
- **Landmarks**: The page correctly implements semantic HTML5 landmarks (`<header>` / `banner`, `<main>`, `<footer>` / `contentinfo`, `<nav>` / `navigation`).
- **Global Settings**: 
  - The `lang` attribute is correctly set to `"de"`.
  - The page `<title>` is descriptive.
  - The viewport meta tag is well-configured and avoids the anti-pattern `user-scalable=no`.

## 4. Forms & Interactive Elements
A manual DOM query for orphaned inputs confirmed the Lighthouse findings and identified an additional issue:
- **Orphaned Text Input**: The Model search text input (`placeholder="z.B. RS6, 911, M3"`) lacks an associated label, `id`, `name`, or `aria-label`. 
- **Console Errors**: Chrome's native accessibility audits surfaced 4 warnings for missing labels and missing `id`/`name` attributes, corresponding exactly to the 3 `<select>` elements and 1 `<input>` element.
- **Pass**: The Newsletter email input in the footer is correctly labeled and passes checks.

## 5. Focus Management & Keyboard Navigation
- **Skip to Main Content**: An invisible "Zum Hauptinhalt springen" link is properly implemented as the very first focusable element, which is a fantastic accessibility feature.
- **Focus Indicators**: Interactive elements (like the search icon in the header) display a clear, visible focus ring (e.g., a prominent red outline), ensuring keyboard users can track their location.
- **Tab Order**: The DOM order matches the visual reading order. Tabbing sequentially navigates the UI logically.

## 6. Mobile Tap Targets
Measurements were taken in a simulated mobile viewport (390x844):
- **Menu and Header Buttons**: The primary mobile navigation buttons ("Fahrzeuge durchsuchen", "Merkliste", "Menü öffnen") measure **44x44px**. While this technically passes the WCAG 2.2 AA minimum (24x24px), it fails the standard web.dev best practice of **48x48px**.
- **Newsletter Button**: The subscribe button measures **40x40px**, which is slightly undersized for comfortable touch interaction.
- **Footer Links (Violation)**: The links in the footer (e.g., "Impressum", "Datenschutz") have a height of only **17px** with `0px` margin and padding. This is a violation of **WCAG 2.2 AA Success Criterion 2.5.8 (Target Size Minimum)**, as they are smaller than 24x24px and lack sufficient spacing between adjacent targets to prevent accidental taps.

## 7. Recommendations
1. **Increase Contrast**: Darken the gold text color (`#a67b30`) of the Trustpilot rating in the footer to achieve at least a 4.5:1 ratio against the background (`#f9f7f5`).
2. **Label Form Inputs**: Provide an accessible name for the 3 `<select>` dropdowns and the model text `<input>`. This can be done by wrapping them in `<label>`, using `<label for="...">` with matching `id`s, or adding descriptive `aria-label` attributes.
3. **Enlarge Tap Targets**: 
   - Add padding to the footer links so their clickable area is at least 24x24px (preferably 48x48px).
   - Consider slightly increasing the size or padding of the mobile header buttons and the newsletter button to hit the 48x48px best-practice threshold.
