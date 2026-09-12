# Testing Lab → Lesson Integration: Portability Lessons Learned

## Context
During the Family Relationships integration (see
`listening-room-integration-notes.md`), the Listening Room worked
correctly once integrated, but caused three visible side effects on the
rest of the page. All three trace back to the same root problem:
**the Testing Lab files were written assuming they own the entire
page**, which is true when testing standalone, but false once embedded
inside a larger lesson file.

## The three symptoms and their real causes

### 1. Navy background/cream text bled across the whole Family
   Relationships page
**Cause:** `listening-room-actual.css` contains bare element selectors —
`html { background: var(--navy-950); }`, `body { background:
var(--navy-950); color: var(--text); font-family: Arial...; }`, and
`button { font: inherit; }`. These are global by nature. Wrapping the
*JS* in an IIFE (as we did) scopes JavaScript variables, but **CSS has
no equivalent automatic scoping** — a bare `html`/`body`/`button` rule
always applies page-wide, no matter where in the file it's defined or
how it's commented/marked.

**Why the earlier collision check missed this:** the check looked for
matching class names, IDs, and `--custom-properties`. It never checked
for bare element selectors, because those aren't things you'd normally
expect to collide by name — the danger with `html`/`body` isn't that
they collide with something else, it's that they're global by
definition and don't need to "collide" to cause damage.

### 2. The Listening Room's width affected the whole page's width
**Cause:** `--shell-width: min(96vw, 2000px);` on `.room-shell`. `vw`
units are relative to the **browser viewport**, not the element's
parent container. In the Testing Lab, the Listening Room IS the
viewport, so this is correct. Embedded inside Family Relationships'
normal content column, this rule ignores that column's width entirely
and sizes against the full browser window — which can force the column
(and therefore the whole page) wider to accommodate it.

### 3. Clicking "Enter the Listening Room" (or Reset) jumped to the very
   top of the whole Family Relationships page, with different-looking
   colors/fonts at that spot
**Cause:** three `window.scrollTo({ top: 0, behavior: "smooth" })`
calls (Enter button, Reset button, completion screen) — all mean
"scroll to the top of the page." Correct in the Testing Lab (page top =
Listening Room top). Wrong once embedded (page top = the very top of
the entire lesson, far above the Listening Room). The "different
colors/fonts" observed there is symptom #1 becoming visible for the
first time, once the jump forces that part of the page into view.

## Why this matters beyond Family Relationships
Every future lesson (Age & Dates, Colors, Days & Months, etc.) that
reuses this same Testing Lab Listening Room template will hit these
same three issues, in the same way, for the same reasons — because the
problem lives in the **reusable template itself**, not in anything
specific to Family Relationships. Fixing it once at the template level
means it never has to be re-diagnosed or re-patched per lesson.

## Recommended template-level fixes (not yet made — pending your
   go-ahead, since this touches the shared Testing Lab source, not
   just this one integration)

1. **Scope all CSS under one root class** instead of bare `html`/`body`.
   Testing Lab already has a natural root candidate: the outer
   `.room-screen`/`.room-shell` structure. Moving the background/font/
   color rules onto that root element (instead of `html`/`body`) would
   make the component self-contained — it would look identical in the
   standalone Testing Lab page (since that root fills the viewport
   there too) but stop leaking into whatever page it's embedded in.
   `button { font: inherit; }` would need the same treatment — scoped
   to `.room-button` or similar instead of every button on the page.

2. **Replace `vw`-based width with a container-relative approach** —
   e.g. `width: min(100%, 2000px)` instead of `min(96vw, 2000px)`, so
   the shell respects whatever container it's placed in rather than
   the raw browser viewport.

3. **Make the scroll-to-top calls target the component's own container,
   not the page.** Something like:
   ```js
   const scrollTarget = document.querySelector("#variation-2") || document.body;
   scrollTarget.scrollIntoView({ behavior: "smooth", block: "start" });
   ```
   This would fall back to `document.body` (page top) when tested
   standalone in the Testing Lab — since there's no `#variation-2`
   there — and correctly scroll to the Listening Room's own top once
   embedded in a real lesson page.

## Status
Both fixes are complete and verified:
- **Family Relationships**: `family-relationships.css`/`.js` patched —
  `html`/`body`/`button` rules rescoped to `.listening-room` /
  `.listening-room button`, `--shell-width` changed from `min(96vw,
  2000px)` to `min(100%, 2000px)`, and all three `scrollTo(top:0)`
  calls replaced with `el.room?.scrollIntoView({ behavior: "smooth",
  block: "start" })` where `el.room =
  document.querySelector(".listening-room")`. JS passes `node --check`,
  CSS braces balance, no bare global selectors remain in the Listening
  Room block.
- **Testing Lab**: `listening-room-actual.css`/`.js` received the
  identical fix — not just a compatible one, the *same* one. Both the
  Testing Lab's own `<main class="listening-room">` and Family
  Relationships' `<article id="variation-2" class="...listening-room">`
  already shared the `.listening-room` class, so scoping to that class
  works correctly in both the standalone Testing Lab page and embedded
  inside a lesson, with no per-context branching needed. This is now
  the authoritative version of the Listening Room template for all
  future lesson integrations.

See `listening-room-portability-instructions.md` for the general
integration checklist this incident produced.
