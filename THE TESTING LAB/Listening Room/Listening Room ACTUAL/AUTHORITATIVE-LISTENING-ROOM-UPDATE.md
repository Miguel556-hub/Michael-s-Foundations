# Listening Room — Authoritative ACTUAL Update

**Date:** September 12, 2026

## Why this update happened
Family Relationships became the live proving environment for the Listening Room. The authoritative TESTING LAB ACTUAL version was updated only after the live integration exposed and resolved reusable architecture, navigation, styling, and dependency issues.

> **The path is guidance, not a cage.**

## Reusable changes migrated into the authoritative source
1. Scoped component design tokens and base CSS to `.listening-room` so future host pages are not restyled by bare `html`, `body`, `button`, or universal rules.
2. Added a Testing-Lab-only body class so the standalone page can still have its dark scaffold without leaking that rule into embedded Foundations.
3. Changed the reusable shell width from viewport-based `96vw` to parent-based `100%`, making the component embed-safe. Host-specific breakout geometry remains the host page's responsibility.
4. Kept the outer Listening Room background transparent so the host controls the surrounding environment.
5. Preserved the Listening Room image/shell itself and all six Family Relationships encounters.
6. Renamed generic `.feedback` classes to `.encounter-feedback` variants to reduce collision risk when embedded.
7. Added the learner-controlled Encounter Navigator with six encounter buttons.
8. Preserved the recommended 1 → 2 → 3 → 4 → 5 → 6 sequence while allowing forward/backward jumping at any time.
9. Added `You are here`, completed checkmarks, and a live completed-count status.
10. Added per-encounter completion tracking. Merely visiting an encounter does not count as completion.
11. Completion is earned only after the final RESPOND move succeeds.
12. Returning to an unfinished encounter restarts it at HEAR (Version 1 behavior).
13. If Encounter 6 is completed while earlier encounters remain unfinished, Next Encounter routes to the next unfinished encounter instead of falsely finishing the Room.
14. The completion screen is available only after all six encounters have been earned, regardless of order.
15. Reset / Listen Again clears all encounter-completion state and returns to Encounter 1.
16. Replaced the generic experience title `Listening Encounter` with `Listen for Meaning`.
17. Removed the experience-screen eyebrow because live testing showed it added redundant vertical weight after the Navigator was introduced. The landing-screen eyebrow remains.
18. Removed the old `Encounter 1 of 6` progress badge because the Navigator now owns location.
19. Removed the JavaScript dependency on `encounterProgress`, preventing the hidden null-reference bug discovered after that UI was removed.
20. Set the experience title color to `#8ac8f4`, the live-tested value selected to harmonize with the Listening Room image.
21. Set encounter task titles to white for clearer hierarchy.
22. Replaced standalone-page `window.scrollTo({top: 0})` behavior with component-local `scrollIntoView`, so the same JS works when embedded deep inside a Foundation page.
23. Wrapped the authoritative JavaScript in an IIFE to reduce top-level name collision risk during future integration.
24. Added responsive Navigator layouts: 6 columns wide, 3 columns medium, 2 columns small.

## Deliberately NOT migrated
- Family Relationships `#variation-2` breakout calculations using `--rail` and the live-tested `200px` breathing-room allowance. Those are host-page integration geometry, not portable Listening Room internals.
- Family Tree Puzzle completion-checkbox restructuring. That fix belongs to the Family Relationships host page, not the Listening Room component.
- Journey Rail wording/progress behavior. Journey Rail ownership remains with the host Foundation.

## Validation performed
- JavaScript syntax checked with Node.js.
- HTML parsed with Python `html.parser`.
- CSS brace balance checked.
- Verified no `encounterProgress` dependency remains.
- Verified navigator HTML, CSS, and JavaScript hooks are present.
- Verified all three authoritative filenames remain unchanged.
