# Listening Room Portability & Integration Instructions

> **ACTUAL owns the reusable Listening Room. Migration Instructions own
> the adaptation required to make ACTUAL live safely inside a specific
> Foundation.**

------------------------------------------------------------------------

## 1. Purpose of This Document

Use this guide when integrating the authoritative Listening Room
**ACTUAL** implementation from the Testing Lab into a real Foundation
lesson.

This guide grew out of what the Family Relationships Listening Room
integration caught the hard way. The goal is not to rewrite ACTUAL for
every Foundation. The goal is to preserve the reusable component while
making the host-specific adjustments required for it to live safely
inside a larger lesson.

------------------------------------------------------------------------

## 2. Know What Belongs Where

### ACTUAL Owns the Reusable Listening Room

ACTUAL should own the behavior and design that belong to the Listening
Room itself, including its:

-   Listening Room screens and encounter structure
-   Encounter Navigator
-   current-location state
-   earned encounter-completion tracking
-   learner freedom to move among encounters
-   reset and Listen Again behavior
-   reusable visual identity
-   component-scoped CSS
-   component-local scrolling
-   reusable JavaScript behavior

> **Do not hardcode one Foundation's layout peculiarities into ACTUAL.**

### Migration Instructions Own Foundation-Specific Adaptation

Migration work may need to account for the host Foundation's:

-   content-column width
-   fixed Journey Rail
-   breakout geometry
-   intentional side breathing room
-   asset paths
-   Journey Rail labels and links
-   host completion controls
-   host HTML nesting
-   existing CSS and JavaScript
-   Foundation-specific progress behavior

A value that works in one Foundation is not automatically a reusable
component constant. For example, Family Relationships ultimately used a
`200px` allowance while fitting the Listening Room around its Journey
Rail. That is a **host-specific choice to test**, not a universal
Listening Room rule.

------------------------------------------------------------------------

# MIGRATION PROCEDURE

## 3. Before Writing Any Code: Confirm the Target Is Not Already Occupied

Check what currently exists at the destination in the target lesson.

Do **not** assume a section is an empty stub. It may already contain a
full, working feature that requires a deliberate decision rather than a
silent overwrite.

If the destination is occupied, decide before touching anything:

1.  **Full replacement**
2.  **Partial merge**
3.  **Side-by-side integration**

> **Preserve working host content unless there is an explicit reason to
> replace it.**

------------------------------------------------------------------------

## 4. Inspect the Host Foundation Before Inserting ACTUAL

Before copying the Listening Room into the lesson, identify the host
page's important structural constraints.

### Check the Host Layout

Determine:

-   Where does the main lesson content begin and end?
-   Is the lesson inside a fixed-width or max-width container?
-   Is there a fixed Journey Rail?
-   Are there right-side phase tabs or other fixed navigation?
-   Does the Listening Room need to remain inside the normal content
    column, or deliberately break out of it?
-   How much breathing room is needed between the component and
    surrounding navigation?

### Check Asset Locations

Confirm where the host Foundation stores shared assets such as:

-   `listening-room.svg`
-   images
-   audio
-   icons
-   other media required by the component

Update paths for the host project's folder structure. Do not assume the
Testing Lab path will work after migration.

------------------------------------------------------------------------

## 5. Run the Collision Checks

All four checks matter.

### 5.1 IDs

Check every `id="..."` in the Listening Room HTML against the rest of
the target lesson, excluding the section being deliberately replaced.

`document.getElementById()` is page-wide. A duplicate ID can silently
connect JavaScript to the wrong element.

### 5.2 CSS Classes and Custom Properties

Check Listening Room class names and CSS custom properties against the
host page.

Examples:

``` css
.listening-room
.room-shell
.room-button
--some-variable
```

ACTUAL should already be scoped, but migration should verify that no new
host collision has been introduced.

### 5.3 Bare Element Selectors

Explicitly search for selectors such as:

``` css
html { }
body { }
button { }
input { }
a { }
```

Bare selectors apply page-wide. They do not need to share a class name
with the host page to cause damage.

ACTUAL should normally scope these rules to the Listening Room wrapper,
for example:

``` css
.listening-room button { }
```

> **A name-collision search will not catch an unscoped selector. Check
> for bare selectors separately.**

### 5.4 JavaScript Top-Level Names

Check the Listening Room JavaScript against the host lesson's other
top-level variables and functions.

If the host uses IIFEs or another isolation convention, preserve that
convention. The authoritative Listening Room JavaScript should remain
isolated rather than leaking declarations into the host page.

------------------------------------------------------------------------

## 6. Insert the Listening Room as a Complete Component

Migrate the authoritative HTML, CSS, JavaScript, and required assets as
a coordinated package.

Do not casually copy only the visible HTML and assume the rest will
follow.

Preserve:

-   structural comments
-   IDs required by JavaScript
-   classes required by CSS
-   accessibility attributes
-   navigator hooks
-   completion-state hooks
-   buttons and panels
-   required assets

> **A portable component travels with its behavior and dependencies, not
> just its markup.**

------------------------------------------------------------------------

## 7. Apply Host-Specific Layout Adaptation

This is where the Migration Instructions take over from ACTUAL.

### If the Host Content Column Is Too Narrow

Do not rewrite ACTUAL's reusable internal layout simply to compensate
for the host page.

Instead, create a **host-specific integration rule** that allows the
Listening Room to occupy the appropriate width in that Foundation.

### If the Host Has a Fixed Journey Rail

Account for the rail when calculating available horizontal space.

Preserve intentional breathing room between:

-   Journey Rail
-   Listening Room
-   right-side navigation or browser edge

Do not treat the Family Relationships `200px` allowance as universal.
Start from the host's actual geometry, test it visually, and adjust
deliberately.

### Keep Host Geometry Out of ACTUAL

Rules involving host-specific items such as:

``` css
--rail
#variation-2
```

belong in the Foundation's stylesheet or integration layer, **not** in
the authoritative Listening Room CSS.

------------------------------------------------------------------------

## 8. Preserve Host Navigation and Progress Systems

The Listening Room Navigator and the Foundation Journey Rail have
different jobs.

### Listening Room Navigator

ACTUAL owns navigation **inside the Listening Room**.

The recommended encounter path remains:

`1 → 2 → 3 → 4 → 5 → 6`

but the learner may move among encounters freely.

Completion is earned only by actually completing an encounter.

### Foundation Journey Rail

The host Foundation owns navigation and progress **across the larger
lesson**.

Migration must preserve:

-   the Journey Rail link to the Listening Room
-   the Foundation's label for the Listening Room
-   the Foundation's existing completion/progress behavior

> **Do not make the reusable Listening Room own the Foundation's Journey
> Rail.**

------------------------------------------------------------------------

## 9. Handle Host Completion Controls at the Correct Structural Level

Host completion controls should remain outside the reusable Listening
Room unless they truly belong to the Listening Room itself.

Family Relationships exposed an important structural rule when the
Family Tree Puzzle completion control disappeared from its expected
location.

The control was nested inside **Stage 3**, even though it represented
completion of the **entire Family Tree Puzzle**.

The successful fix was to move the existing control one structural level
outward so it belonged to the parent experience.

> **A control should live at the structural level of the thing it
> controls.**

Do not solve a host completion-control problem by casually moving the
control inside ACTUAL.

------------------------------------------------------------------------

# VERIFICATION

## 10. Check for Viewport-Relative Sizing

Search the integrated CSS for:

``` text
vw
vh
```

`vw` and `vh` are relative to the browser viewport, not the component's
parent container.

A width that is correct when the Testing Lab component owns the whole
page can become wrong when the component is embedded inside a
Foundation.

Prefer parent-aware sizing for reusable component internals, such as:

``` css
width: min(100%, 2000px);
```

Use host-specific breakout geometry only when the Foundation actually
requires it.

------------------------------------------------------------------------

## 11. Check Scroll and Focus Behavior

Search the JavaScript for:

``` text
scrollTo
scrollIntoView
location.hash
.focus()
```

A page-level call such as:

``` js
window.scrollTo({ top: 0 });
```

may be correct on a standalone Testing Lab page but wrong when the
Listening Room is embedded halfway down a lesson.

Component navigation should remain local to the component, for example:

``` js
wrapperEl.scrollIntoView({
  behavior: "smooth",
  block: "start"
});
```

Verify that entering, changing encounters, completing, resetting, and
listening again do not unexpectedly move the learner to the top of the
entire Foundation page.

------------------------------------------------------------------------

## 12. Check Removed UI for Hidden Dependencies

A visually successful deletion can still break behavior later.

Family Relationships proved this when the redundant `Encounter 1 of 6`
badge was removed from the HTML but JavaScript still referenced:

``` js
document.getElementById("encounterProgress")
```

and later attempted to update it.

The Listening Room displayed correctly but stopped functioning when
JavaScript reached the missing element.

> **When removing a UI element, check its HTML, CSS, and JavaScript
> dependencies.**

Do not assume the most recent visible change caused the newest bug.
Trace the dependency before rewriting working code.

------------------------------------------------------------------------

## 13. Run Technical Verification

After integration:

-   Run a JavaScript syntax check such as `node --check <file>`.
-   Confirm CSS braces balance.
-   Confirm the HTML wrapper tags touched during migration balance.
-   Compare against the original host file when investigating a mismatch
    so a pre-existing issue is not mistaken for a migration bug.
-   Confirm required IDs exist exactly once.
-   Confirm the Listening Room asset paths resolve.
-   Confirm no obsolete JavaScript dependency remains after removing
    host or component UI.

------------------------------------------------------------------------

## 14. Run the Full Learner Test

Load the **actual Foundation lesson page**, not only the Testing Lab
standalone page.

Test the entire Listening Room end to end.

### Landing

-   Listening Room renders correctly.
-   Background and image treatment are correct.
-   Enter the Listening Room works.

### Encounter Navigator

-   All six encounter buttons appear.
-   Encounter 1 begins as the current location.
-   The learner can jump forward.
-   The learner can jump backward.
-   The selected encounter becomes current.
-   Revisiting an unfinished encounter restarts it at HEAR.

### Completion

-   Merely visiting an encounter does not mark it complete.
-   Completion is earned only after successful RESPOND.
-   Completed encounters remain visibly complete.
-   The completed count updates correctly.
-   Guided Next Encounter behavior still works.
-   If encounters were skipped, the learner is routed to unfinished work
    rather than incorrectly ending the Room.
-   Overall completion appears only after all six encounters are earned.

### Reset / Listen Again

-   Reset clears encounter completion state.
-   Listen Again returns the learner to a clean Listening Room state.

### Host Foundation

-   Journey Rail still works.
-   Host completion controls still work.
-   Host labels remain correct.
-   Nothing outside the Listening Room changes appearance unexpectedly.
-   Page width is intact.
-   Backgrounds, fonts, buttons, and scrolling outside the component are
    unchanged.

------------------------------------------------------------------------

# FAILURE TRAPS DISCOVERED DURING FAMILY RELATIONSHIPS

## 15. Do Not Confuse a Host Problem with an ACTUAL Problem

Family Relationships taught several different classes of problem:

### Reusable Component Problems

These should be corrected in ACTUAL when proven:

-   global selector leakage
-   viewport-dependent reusable width
-   page-level scrolling
-   obsolete component JavaScript dependencies
-   reusable Navigator behavior
-   reusable completion-state behavior

### Host Integration Problems

These belong in Migration Instructions and the Foundation:

-   Journey Rail accommodation
-   breakout geometry
-   Foundation-specific breathing room
-   host asset paths
-   host completion-control ownership
-   Journey Rail wording
-   Foundation-specific layout boundaries

> **Promote reusable lessons back into ACTUAL. Document host-specific
> lessons here. Do not mix the two.**

------------------------------------------------------------------------

## 16. The Reusable Pattern

Give every Testing Lab component a clear outer wrapper such as:

``` css
.listening-room
```

Scope component styling and behavior to that wrapper.

Keep reusable sizing parent-aware.

Keep scrolling component-local.

Keep JavaScript isolated.

Then adapt the **host around the component** when the Foundation has
layout requirements that ACTUAL should not own.

The goal is not:

> "No per-integration adaptation will ever be needed."

The better rule is:

> **No rewriting of ACTUAL should normally be needed.
> Foundation-specific adaptation may still be required, and that
> adaptation belongs in the host Foundation and these Migration
> Instructions.**

------------------------------------------------------------------------

# FINAL MIGRATION CHECK

Before calling a Listening Room migration complete, confirm:

-   [ ] The destination was inspected before replacement.
-   [ ] ACTUAL HTML, CSS, JavaScript, and required assets were migrated
    together.
-   [ ] IDs were checked for collisions.
-   [ ] CSS classes and custom properties were checked.
-   [ ] Bare selectors were checked.
-   [ ] JavaScript isolation was checked.
-   [ ] Asset paths were updated for the host Foundation.
-   [ ] Host-specific width/breakout geometry was applied outside ACTUAL
    if needed.
-   [ ] Journey Rail behavior and labels were preserved.
-   [ ] Host completion controls remain at the correct structural level.
-   [ ] Removed UI has no remaining CSS/JavaScript dependencies.
-   [ ] JavaScript syntax was checked.
-   [ ] CSS and touched HTML structure were checked.
-   [ ] All six encounters were tested.
-   [ ] Jump-forward and jump-backward navigation were tested.
-   [ ] Earned completion was tested.
-   [ ] Reset and Listen Again were tested.
-   [ ] Overall Listening Room completion was tested.
-   [ ] The rest of the Foundation still looks and behaves exactly as
    intended.

> **If ACTUAL works, the host works, and neither one has contaminated
> the other, the migration is complete.**
