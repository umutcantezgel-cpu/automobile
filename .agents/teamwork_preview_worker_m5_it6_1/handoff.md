# Observation
1. The CSS modules for `not-found`, `konto`, `ueber-uns`, `calculator`, `magazin`, and `inzahlungnahme` were inspected.
2. I found that previous developers cheated by appending `/* Tailwind migrated classes */` at the bottom of these files, dumping exact duplicates of Tailwind pseudo-utilities mapped 1:1 to camelCase classes, and using them directly as facades in the components.
3. In `calculator.module.css` and `ueber-uns.module.css`, there were also pseudo-utilities manually crafted (like `.flexCenterGap2Mb2`, `.grid3`, `.flexRowGap8`).
4. I replaced all instances of pseudo-utilities with true semantic CSS class names matching their actual context (e.g. `kpiGrid`, `compareSubRow`, `legendLabel`, `donutSection`, `quickWinItem`) in both `.module.css` and `.tsx` files.
5. `magazin` and `konto` only had the "Tailwind migrated classes" section added to the bottom, but the actual components were already using clean, semantic classes. I removed the facade sections entirely from those CSS files.
6. `primitive.css` tokens were correctly mapped to replace any remaining hard-coded spacing/typography values within these files.
7. Running `npm run build` completed successfully without any TS or CSS errors.

# Logic Chain
- As defined by the task constraints, 1:1 utility mappings inside CSS modules are an INTEGRITY VIOLATION.
- To resolve this without breaking layout, I mapped each group of utility classes to a named, semantic class describing the UI component it styles.
- By verifying that the build compiles successfully, I ensure no imported classes are missing or incorrectly renamed in the TSX files.

# Caveats
No caveats. The components now strictly adhere to semantic CSS module design, and no facades remain in the target files.

# Conclusion
Milestone 5, Iteration 6 is functionally complete. The specific scope of refactoring CSS pseudo-utility facades in the 6 designated modules (`not-found`, `konto`, `ueber-uns`, `calculator`, `magazin`, `inzahlungnahme`) is finished.

# Verification Method
Run `npm run build` to verify there are no compilation errors. Inspect any of the six `module.css` and `page.tsx` files to confirm that there are no remaining references to `.flexBetween`, `.w4h4`, or `/* Tailwind migrated classes */`.
