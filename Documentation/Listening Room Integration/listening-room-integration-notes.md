# Listening Room Integration — Family Relationships

## What this was
Replaced the old "Part A/B/C" Listening Room (a listen → reveal → complete
flow) with the new 6-Encounter Listen/Build/Respond version built and
tested in the Testing Lab (`listening-room-actual.html/.css/.js`).

## Decision: full replace, not merge
Confirmed with the project owner — this was a full swap, not a partial
merge. The old implementation was fully functional, not a placeholder, so
this was a deliberate decision to replace it, not clean up dead code.

## What was removed
- **HTML**: lines 2199–2424 (original file) — the old header, Part A
  (listen/reveal), Part B, and Part C conversation sections.
- **CSS**: lines 1567–2834 (original file) — all `.listening-room`,
  `.listening-stage`, `.listening-reveal`, `.conversation-*` etc. rules
  tied to the old implementation.
- **JS**: lines 2764–4094 (original file) — the old
  `document.querySelector("#variation-2")`-scoped IIFE and all its
  supporting functions.

## What was preserved (not touched)
- The `<article class="use-variation listening-room" id="variation-2">`
  wrapper tag itself — kept as-is, since the Journey Rail link
  (`#variation-2`) and other page navigation depend on this ID.
- The "Mark Variation 2 Complete" checkbox
  (`<input type="checkbox" class="variation-complete" data-variation="2">`)
  — kept exactly where it was, since this feeds the site-wide progress
  tracker (`.variation-complete` listener elsewhere in the file). This is
  unrelated to the Listening Room's own internal logic.

## What was added
The three Testing Lab HTML sections (`landingScreen`, `experienceScreen`,
`completionScreen`), the full Testing Lab CSS, and the full Testing Lab JS
— including both fixes made this session:
- `respondAcceptsAny` support in `makeChoiceButtons` (Encounter 2's
  self-report tile fix)
- свою → твою in Encounter 6's respond question

## Collision check performed before integration
Checked every ID, CSS class, CSS custom property, and top-level JS
variable/function name from the Testing Lab files against the rest of
`family-relationships.html/.css/.js` (excluding the block being removed).

**Found:** one real collision — `.feedback` (and its base rule) is
already used by unrelated activities elsewhere on the page (tree
challenge, phrase bank). No other collisions found (0 ID collisions,
0 real CSS variable collisions, 0 JS name collisions — `el` and `speak`
appeared elsewhere but only as local forEach parameters / method calls,
not top-level declarations).

**Fix:** renamed the Testing Lab's `.feedback` / `.feedback--success` /
`.feedback--try` to `.encounter-feedback` / `.encounter-feedback--success`
/ `.encounter-feedback--try`, throughout the CSS and JS. This is a pure
rename — no behavior change.

## Other changes made during integration
- **JS wrapped in an IIFE** (`(() => { ... })();`), matching the
  convention already used for every other major section in
  `family-relationships.js`. The Testing Lab file didn't need this
  (it's the only script on its own standalone page), but the full lesson
  file has many top-level scripts, so scoping was added for safety even
  though no direct name collision was found.
- **Image path updated**: `url("listening-room.svg")` →
  `url("../../Images/listening-room.svg")`, matching the existing
  reference convention used by every other image in this file (e.g. the
  свою/твою Grammar Candy image at line ~472). This assumes
  `listening-room.svg` has been copied into the shared `/Images` folder —
  confirm that copy happened before testing.
- Marked the start and end of the new block in all three files with
  `THE LISTENING ROOM` / `END THE LISTENING ROOM` comments, per the
  marking convention already used elsewhere in these files.

## Verified before handoff
- New JS passes `node --check` (valid syntax, no dropped commas/braces)
- CSS braces balanced (980 open / 980 close)
- HTML `<article>` tags balanced (28/28); pre-existing `<section>` tag
  count mismatch (46 open/44 close in the *original* file) is unchanged
  after integration — not something this edit introduced
- Zero remaining `.feedback`-vs-`.encounter-feedback` collisions

## Post-integration bugs found — and fixed at the source (2026-09-10)

After the first integration, testing inside Family Relationships surfaced
three problems. All three traced back to the same root cause: **the
Testing Lab CSS/JS was written assuming the Listening Room IS the whole
page** (true in the Testing Lab's standalone `.html` file), which breaks
once the Listening Room becomes one section embedded partway down a much
longer lesson page.

### Bug 1 — dark background/text/font bled across the entire lesson page
**Cause:** `listening-room-actual.css` had bare `html { }`, `body { }`,
and `button { }` rules — no class needed, so these applied to the *whole
page* the moment the CSS was loaded, not just the Listening Room section.
The earlier pre-integration collision check only looked for class names,
IDs, and CSS custom properties — it didn't check for bare element
selectors, which is how this got through.
**Fix:** scoped these rules to the `.listening-room` class instead —
`.listening-room { background: ...; color: ...; font-family: ...; }` and
`.listening-room button { font: inherit; }`. This class already exists as
a shared wrapper in *both* contexts (the Testing Lab's own `<main
class="listening-room">` and every lesson's `<article class="use-variation
listening-room">`), so no new markup was needed — just narrower selectors.

### Bug 2 — Listening Room was too wide and stretched the whole page
**Cause:** `--shell-width: min(96vw, 2000px)` — `vw` sizes against the
full browser viewport, not the element's parent container. Correct when
the Listening Room owns the whole page; wrong once it's nested inside a
narrower content column, since it ignores that column's width entirely
and forces the page wider to fit it.
**Fix:** changed to `--shell-width: min(100%, 2000px)` — sizes against
its actual parent container instead.

### Bug 3 — "Enter"/"Reset" jumped to the very top of the whole lesson page
**Cause:** three places in the JS called `window.scrollTo({ top: 0 })` —
correct when "top of page" and "top of Listening Room" are the same place
(Testing Lab), wrong once the Listening Room sits deep inside a longer
page (Family Relationships). This is what made Bug 1 visible/jarring —
jumping to the literal top of the page revealed the leaked dark styling
on content that was never meant to have it.
**Fix:** added `room: document.querySelector(".listening-room")` to the
`el` object, and changed all three `window.scrollTo({ top: 0 })` calls to
`el.room?.scrollIntoView({ behavior: "smooth", block: "start" })` —
scrolls to the Listening Room's own position on the page, wherever that
is. This also now matches the scroll pattern already used elsewhere in
`family-relationships.js` for its other embedded interactive sections.

### Where these fixes live
All three were made **in the Testing Lab source files themselves**
(`listening-room-actual.css` / `.js`), not just patched into the Family
Relationships copy — the intent is that any future migration (Spanish
Foundations, another Russian lesson, etc.) starts from an already
embed-safe version and doesn't hit these same three bugs again.
`family-relationships.html/.css/.js` were then regenerated from this
corrected source, so both stay in sync.

## Still to do (not done here — needs to happen in your live environment)
1. Copy `listening-room.svg` into the shared `/Images` folder if not
   already there.
2. Replace your live `family-relationships.html/.css/.js` with these
   three files, **and** replace your Testing Lab
   `listening-room-actual.css/.js` with the corrected versions, so the
   template itself is fixed for next time.
3. Test the full Listening Room flow inside Family Relationships
   (not just the Testing Lab) — click through all 6 encounters, confirm
   Encounter 2's tiles accept any answer, confirm Encounter 6 shows
   твою, confirm the page no longer turns dark/widens when the Listening
   Room is entered, confirm Enter/Reset scroll to the Listening Room
   (not the top of the page), and confirm the "Mark Variation 2
   Complete" checkbox and Journey Rail link still work.
4. Commit to git once confirmed.
