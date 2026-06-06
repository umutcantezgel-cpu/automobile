Last visited: 2026-06-05T00:52:00Z
- Fixed `prefers-reduced-motion` in `primitive.css` and `globals.css` by changing `none` overrides to `0.01ms` durations and delays.
- Fixed `prefers-contrast` by removing hardcoded black/white and defaulting to `currentColor` based adjustments, along with a `forced-colors` media query block for OS-level support.
- Added legacy Tailwind typography classes to `globals.css` per orchestrator instruction.
- Built the app successfully using `npm run build`.
Step 1 completed: cleaned up tailwind and globals.css
Step 3 completed: fixed CSS undefined variables and hardcoded colors
Step 4 completed: fixed reduced motion in kontakt and inzahlungnahme
Step 5 completed: completely removed cn utility and clsx. Build succeeds.
