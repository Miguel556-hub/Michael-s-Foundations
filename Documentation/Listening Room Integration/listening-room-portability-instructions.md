# Portability & Integration Checklist — Testing Lab → Lesson

Use this before integrating any Testing Lab component (Listening Room or
future ones built the same way) into a real lesson file. Grew out of
what the Family Relationships Listening Room integration caught the
hard way — see `testing-lab-portability-lessons.md` for the full story.

## Before writing any code: confirm the target isn't already occupied
Check what currently exists at the destination line range in the target
lesson file. Don't assume a section is an empty stub — it may be a
full, working feature that needs a deliberate replace decision, not a
silent overwrite. If it is a real feature, confirm with the project
owner: full replace, partial merge, or side-by-side, before touching
anything.

## Collision checks to run (all three matter — none is optional)

1. **IDs** — every `id="..."` in the Testing Lab HTML, checked against
   the *rest* of the target file (excluding whatever's being replaced).
   `document.getElementById()` is page-wide; a duplicate ID silently
   grabs the wrong element.

2. **CSS class names and custom properties** — every `.class` and
   `--variable` in the Testing Lab CSS, checked the same way. A
   same-named class elsewhere on the page will fight the new styles
   for specificity, sometimes invisibly.

3. **Bare element selectors — the one that's easy to miss.**
   `html { }`, `body { }`, `button { }`, `input { }`, `a { }`, or any
   other selector with no class/ID attached. These **always** apply
   page-wide, everywhere, full stop — they don't need to "collide"
   with anything by name to cause damage, because they were never
   scoped to begin with. A Testing Lab page is the entire page, so
   these selectors are harmless there. Embedded in a lesson, they leak
   into everything else on that page. **Check for these explicitly —
   they won't show up in a name-collision search, since the danger
   isn't the name, it's the lack of scope.**
   Fix: rescope every bare element selector to the component's own
   wrapper class (e.g. `.listening-room`, `.listening-room button`)
   before integrating, not after.

4. **JS top-level variable/function names** — checked against the
   target file's other top-level declarations. Usually low-risk if the
   target file already wraps its own sections in IIFEs (check first —
   if it does, follow that convention for the new code too).

## Sizing: check for viewport-relative units
Search the Testing Lab CSS for `vw` and `vh`. `vw`/`vh` are relative to
the **browser viewport**, not the parent container — correct when the
component owns the whole page (Testing Lab), wrong once nested inside
a larger page's content column (a real lesson). Before integrating,
convert `vw`-based widths to `%` or `min(100%, <max-px>)` so the
component respects its container instead of the raw browser window.
Height (`vh`) is lower-risk — a tall nested section usually doesn't
distort the rest of the page the way a too-wide one does — but check
it too if the component is meant to feel "full-screen" once embedded.

## Navigation: check for page-level scroll/focus calls
Search the Testing Lab JS for `scrollTo`, `scrollIntoView`,
`location.hash`, and `.focus()`. Any call that scrolls or jumps to "the
top of the page" is correct in the Testing Lab (where the component
*is* the page) and wrong once embedded (where it yanks the user to the
top of the whole lesson, away from the component). Fix: scroll/focus
relative to the component's own wrapper element instead of the page —
e.g. `wrapperEl.scrollIntoView({ behavior: "smooth", block: "start" })`
rather than `window.scrollTo({ top: 0 })`.

## After integrating: verification steps
- Run a real syntax check on the spliced JS (`node --check <file>` or
  equivalent) — don't just eyeball it. A single dropped comma at a
  splice seam breaks the whole file silently until you try to load it.
- Confirm CSS braces balance (open-brace count == close-brace count).
- Confirm HTML tags balance for whatever wrapper tags you touched
  (opening/closing counts match) — note some mismatch may be
  *pre-existing* elsewhere in a large file; check the original file's
  count too so you're not chasing a bug you didn't introduce.
- Load the actual lesson page (not just the Testing Lab standalone
  page) and click through the full component end to end — not just
  "does it render," but every button, every panel, every path a
  learner could take.
- Specifically check: does anything outside the component's own
  boundaries look different than before (background, fonts, button
  styles, page width, scroll behavior)? That's the signature of a
  scoping leak, and it's easy to miss if you only look at the
  component itself.

## The reusable pattern this produced
Give every Testing Lab component's outermost element a single wrapper
class (e.g. `.listening-room`). Scope every otherwise-bare
selector — backgrounds, fonts, button resets — to that class instead
of `html`/`body`/bare tag names. Point every scroll/focus call at
`document.querySelector(".wrapper-class")` instead of the page. Done
this way, the *same* CSS/JS works correctly both standalone in the
Testing Lab (where the wrapper happens to fill the whole page) and
embedded in any lesson (where the wrapper is just one section of a
much bigger page) — no per-integration rewriting needed, just this
checklist to confirm it still holds for whatever's new in that
component.
