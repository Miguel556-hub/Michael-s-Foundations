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


## Encounter Navigator added — learner freedom without losing the path (2026-09-12)

The original Listening Room required learners to complete Encounter 
1 → 2 → 3 → 4 → 5 → 6 in order. Testing the integrated Room raised a new instructional-design 
question: should the recommended path also be a required path?

**Decision:** no. Preserve the instructional sequence as the recommended path while allowing 
learners to move freely among encounters.

> **The path is guidance, not a cage.**

### Pre-change Git checkpoint

Before beginning this coordinated HTML/CSS/JS change, Michael made a Git commit preserving the 
known-good Listening Room after the layout, `200px` breathing-room, transparent-background, and 
white encounter-title refinements.

This established a safe rollback point before a larger change affecting HTML, CSS, JavaScript, 
navigation state, and completion logic.

### What was added

1. **Encounter Navigator:** added six encounter buttons so learners can jump directly to 
any encounter.
2. **Current-location state:** the active encounter displays **You are here** and 
receives `aria-current`.
3. **Forward and backward navigation:** learners may move to any encounter without completing 
the current encounter first.
4. **Unfinished-encounter behavior:** returning to an unfinished encounter restarts it at HEAR 
rather than preserving every internal move.
5. **Per-encounter completion tracking:** completion is stored independently for each encounter.
6. **Earned completion:** visiting an encounter does not complete it; completion is earned only 
after successfully completing its final RESPOND step.
7. **Completed visual state:** completed encounters receive a checkmark and remain marked during 
the current Listening Room session.
8. **Navigator status:** current location and completed-count information are maintained by the 
navigator.
9. **Guided path preserved:** learners who do not use the Navigator may still proceed normally 
through Encounter 1 → 2 → 3 → 4 → 5 → 6.
10. **Next-unfinished routing:** if Encounter 6 is completed while earlier encounters remain 
unfinished, Next Encounter returns the learner to the next unfinished encounter.
11. **Overall completion integrity:** the Listening Room completion screen is available only 
after all six encounters have actually been completed.
12. **Finish state:** after the sixth earned completion, the control changes 
to **Finish Listening Room**.
13. **Reset behavior:** Reset Listening Room / Listen Again clears encounter-completion state 
and returns the learner to Encounter 1.
14. **Responsive Navigator:** six columns on wide screens, three on narrower screens, 
and two on small screens.
15. **Existing integration fixes preserved:** the host breakout, `200px` breathing-room 
allowance, transparent outer background, and white encounter titles remained intact.
16. **Existing structural comments preserved:** Navigator-specific HTML/CSS/JS comments 
were added without stripping the project's existing source comments.

### Verified before handoff

- JavaScript passed Node.js syntax validation.
- HTML passed Python `html.parser` validation.
- CSS brace balance passed.
- Navigator IDs/classes and completion logic were manually checked.
- Existing `family-relationships.css` and `family-relationships.js` links were preserved.

## Post-Navigator refinements found during live testing (2026-09-12)

### Refinement 1 — Navigator caused slight vertical overflow
**Observation:** adding the Navigator pushed the Experience screen just beyond its available 
vertical space and introduced an internal scrollbar.

**Instinct:** do not immediately shrink fonts, padding, or the Room itself. First determine 
whether the new Navigator has made any existing interface elements unnecessary.

**Fix:** removed the `LISTENING ROOM • FAMILY RELATIONSHIPS` eyebrow from the Experience 
screen only. It remains on the Listening Room landing screen.

**Result:** the recovered vertical space was enough to eliminate the scrollbar.

### Refinement 2 — old encounter-count badge became redundant
**Observation:** `Encounter 1 of 6` previously provided useful location information.

**Cause:** after adding the Navigator, the learner can already see all six encounters and 
the current encounter is explicitly marked **You are here**.

**Fix:** removed the old encounter-count badge.

### Refinement 3 — generic Experience title lacked instructional meaning
**Observation:** `Listening Encounter` described the interface rather than the purpose of 
the experience.

**Fix:** changed the title to `Listen for Meaning`.

**Reason:** the new title reinforces the Listening Room philosophy that learners should 
listen for meaning rather than expect word-for-word comprehension.

### Refinement 4 — Experience title color
**Observation:** the existing blue did not feel visually integrated with the Listening 
Room environment.

**Fix:** explicitly styled `.encounter-header h2` with `color: #8ac8f4`.

**Reason:** Michael selected `#8ac8f4` after visual testing because it harmonizes with 
the cool blue tones in the Listening Room window and armchair image.

### Design lesson
The Encounter Navigator changed more than navigation. It changed the Room's information 
hierarchy:

- Navigator = **location**
- `Listen for Meaning` = **purpose**
- Listening Move label = **phase/task identity**
- Encounter prompt = **immediate instruction**

> **Integration should not only add. It should also reveal what is no longer needed.**

### Bug — Removing Redundant UI Left a Hidden JavaScript Dependency

**Symptom:**  
The Listening Room displayed correctly, but the Room stopped functioning when the learner 
attempted to use it.

**Initial suspicion:**  
The failure appeared immediately after experimenting with moving the `Mark Variation 2 Complete` 
checkbox, so the first hypothesis was that relocating the checkbox had broken the Listening Room.

The checkbox was returned to its original location, but the Listening Room still did not work.

**Actual cause:**  
The earlier removal of the redundant `Encounter 1 of 6` indicator had removed the HTML element with the ID:

`encounterProgress`

However, JavaScript still contained two references to that deleted element:

`progress: document.getElementById("encounterProgress"),`

and:

`el.progress.textContent = ...`

When `renderMove()` attempted to update the element that no longer existed, JavaScript execution stopped.

**Fix:**  
Removed both obsolete JavaScript dependencies on `encounterProgress`:

1. Removed the `progress` reference from the Listening Room `el` object.
2. Removed the `el.progress.textContent` update from `renderMove()`.

The new Encounter Navigator now owns the responsibility for showing the learner's current location.

**Result:**  
The Listening Room immediately returned to normal operation.

### Debugging Lesson

The most recent change is not necessarily the cause of the newest bug.

In this case, timing made the completion-checkbox experiment appear responsible. Reversing that 
change did not restore functionality, which showed that the failure originated elsewhere.

Tracing the JavaScript revealed that an earlier, visually successful UI cleanup had left 
behind a behavioral dependency.

> **When removing a UI element, remove the element — then check its HTML, CSS, and JavaScript dependencies.**

A component can look correct after an element is removed while still containing code that 
expects that element to exist.


### Bug — Family Tree Completion Control Was Attached to the Wrong Structural Level

**Observation:**  
After the Listening Room integration, the `Mark Family Tree Puzzles Complete` control 
appeared to have disappeared.

The Journey Rail still contained the Family Tree Puzzle entry, and inspection confirmed 
that the completion control still existed in the HTML.

**Initial hypothesis:**  
Because the control should have appeared immediately before the Listening Room, the first 
suspicion was that the expanded Listening Room was visually covering or crowding it.

A temporary `margin-top: 48px` experiment was applied to the Listening Room to test that 
hypothesis.

**Result:**  
The additional spacing produced no meaningful change.

**Decision:**  
The `48px` experiment was reversed. The problem was not the boundary spacing.

### Actual Cause

Inspection of the HTML revealed that the completion control was still 
nested **inside Stage 3 — Your Dad's Family**:

`Mark Family Tree Puzzles Complete`

But the control does not represent completion of Stage 3 alone.

It represents completion of the **entire Family Tree Puzzle**, which contains 
Stages 1, 2, and 3.

The HTML structure therefore did not match the instructional structure.

### Fix

The existing completion control was moved **one structural level outward**.

It was moved from inside:

`Stage 3 — Your Dad's Family`

to immediately after the Stage 3 closing `</article>` and before:

`Variation 2 — The Listening Room`

No JavaScript behavior was rewritten, and the existing completion-control 
classes, ID, and `data-variation="1"` value were preserved.

The resulting structure is:

`Family Tree Puzzle`
→ `Stage 1`
→ `Stage 2`
→ `Stage 3`
→ `Mark Family Tree Puzzles Complete`
→ `Listening Room`

### Result

The `Mark Family Tree Puzzles Complete` control became visible again in the 
correct transition location.

The control remains connected to the existing completion system and Journey Rail.

Its visual location now also matches its instructional meaning: the learner 
completes the **whole Family Tree Puzzle**, marks that experience complete, and 
then moves into the Listening Room.

### Architecture Lesson

This was not ultimately a spacing problem.

It was a **parent-child ownership problem in the HTML structure**.

The completion control had been attached to a child activity even though it 
represented completion of the parent experience.

> **A control should live at the structural level of the thing it controls.**

When interface behavior or placement seems inexplicably wrong, inspect not 
only CSS positioning but also the semantic ownership created by the HTML nesting.

Correcting the structure can eliminate the visual problem without adding 
compensating CSS or rewriting working JavaScript.