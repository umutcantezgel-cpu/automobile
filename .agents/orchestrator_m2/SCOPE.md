# Scope: Token Architecture

## Architecture
- `src/app/tokens/primitive.css`: Contains raw values (colors 50-950, font sizes, spacing, border-radius, shadows).
- `src/app/tokens/semantic.css`: Maps primitive tokens to contextual names (surfaces, text, borders, interaction, status).
- Typography: Fluid Typography with clamp(), Modular Scale 1.25. (Space Grotesk, Inter, JetBrains Mono).
- Motion: Easing functions and duration steps. prefers-reduced-motion fallback.

## Milestones
| # | Name | Scope | Dependencies | Status |
|---|------|-------|-------------|--------|
| 1 | Token Architecture | Create primitive.css and semantic.css | none | DONE |
