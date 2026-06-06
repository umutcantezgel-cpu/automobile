# Hard Handoff for Worker: Fix Remaining Hardcoded Styles

## Observation
- The Reviewers and Auditor found remaining occurrences of 'white', 'black', and `w-[40%]` arbitrary strings.
- Using `grep_search` and `view_file` on the target codebase `src/app`:
  - `src/app/admin/fahrzeuge/[id]/page.tsx` line 561: `background: 'white',`
  - `src/app/admin/layout.tsx` line 179: `color: 'white',`
  - `src/app/admin/page.tsx` line 333: `color: 'white',`
  - `src/app/ueber-uns/page.tsx` line 344: `... text-white ...`
  - `src/app/service/page.tsx` line 406: `... text-white ...`
  - `src/app/angebote/page.tsx` line 141: `... text-white ...`
  - `src/app/globals.css` line 537: `border: solid white;`
  - `src/app/globals.css` line 498: `... black 30% ...`
  - `src/app/globals.css` line 616: `... black 30% ...`
  - `src/app/fahrzeuge/fahrzeuge-content.tsx` line 210: `bg-black/40`
  - `src/app/preise/page.tsx` line 1243: `w-[40%]`

## Logic Chain
- To respect the contract in `SCOPE.md`, these must use appropriate tokens (`var(--text-inverse)`, `var(--text-default)`, `w-2/5`).
- The inline styles in `admin` should replace `white` with `'var(--text-inverse)'`.
- The Tailwind utility classes `text-white` should become `text-[color:var(--text-inverse)]`.
- The CSS usages of `white` in `globals.css` should use `var(--text-inverse)`.
- The CSS usages of `black` in `globals.css` should use `var(--text-default)`.
- The Tailwind utility class `bg-black/40` should become `bg-[color-mix(in_srgb,var(--text-default)_40%,transparent)]`.
- The bracket fraction `w-[40%]` should become the standard fraction `w-2/5`.

## Caveats
- I am providing the exact file paths and replacement plans. The Worker should run `replace_file_content` or `multi_replace_file_content` referencing these exact strings.
- We must not touch `src/components/` or `src/app/tokens/`.

## Conclusion
The implementation strategy is ready. The Worker should execute the following edits:

### Edit Plan:

1. **`src/app/admin/fahrzeuge/[id]/page.tsx`**
   - Replace `background: 'white',` with `background: 'var(--text-inverse)',` (around line 561).
   
2. **`src/app/admin/layout.tsx`**
   - Replace `color: 'white',` with `color: 'var(--text-inverse)',` (around line 179).
   
3. **`src/app/admin/page.tsx`**
   - Replace `color: 'white',` with `color: 'var(--text-inverse)',` (around line 333).

4. **`src/app/ueber-uns/page.tsx`**
   - Replace `text-white` with `text-[color:var(--text-inverse)]` (around line 344).

5. **`src/app/service/page.tsx`**
   - Replace `text-white` with `text-[color:var(--text-inverse)]` (around line 406).

6. **`src/app/angebote/page.tsx`**
   - Replace `text-white` with `text-[color:var(--text-inverse)]` (around line 141).

7. **`src/app/globals.css`**
   - Replace `border: solid white;` with `border: solid var(--text-inverse);` (around line 537).
   - Replace `black` with `var(--text-default)` (around lines 498 and 616).
     - Target 1: `box-shadow: 0 calc(var(--space-1) * 0.5) calc(var(--space-1) * 1.5) color-mix(in srgb, black 30%, transparent);` -> replace `black` with `var(--text-default)`.
     - Target 2: `mask-image: radial-gradient(ellipse 80% 60% at 50% 50%, black 30%, transparent 80%);` -> replace `black` with `var(--text-default)`.

8. **`src/app/fahrzeuge/fahrzeuge-content.tsx`**
   - Replace `bg-black/40` with `bg-[color-mix(in_srgb,var(--text-default)_40%,transparent)]` (around line 210).

9. **`src/app/preise/page.tsx`**
   - Replace `w-[40%]` with `w-2/5` (around line 1243).

## Verification Method
- Ensure you do NOT modify `src/components/` or `src/app/tokens/`.
- Run `npm run build` or the relevant build command for the project.
- Run `grep_search` across `src/app` for 'white' and 'black' to confirm 0 raw color occurrences.
- Use `git diff` to ensure changes align with this strategy.
