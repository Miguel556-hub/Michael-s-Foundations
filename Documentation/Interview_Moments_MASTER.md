# Michael's Foundations --- Interview Moments

> **Living record of the strongest interview stories, design decisions,
> debugging lessons, architectural discoveries, and engineering thinking
> developed while building Michael's Foundations.**

## Purpose

This document preserves interview evidence from Michael's Foundations.
These are **talking points to develop naturally in an interview, not
scripts to memorize**.

The record began during the first ten Coding Project days and now
continues as a living development-history document. New moments should
be added when they demonstrate meaningful growth in product thinking,
instructional design, software architecture, debugging, documentation,
AI collaboration, or professional judgment.

------------------------------------------------------------------------

# Part I --- Foundations Established Through Coding Project Day 10

## 1. Building a System, Not Just a Page

### Portfolio First: The Front Door

**Moment:** The project began as more than a collection of disconnected
exercises. The Portfolio Website became the front door to an ecosystem
of Foundation projects.

**What I did / why:** I organized the work around a repeatable
development cycle --- plan, design, build, test, improve, publish, and
document --- and treated Russian Foundations as the flagship project
that would help establish patterns for later Foundations.

**Interview takeaway:** I learned to think beyond the immediate page and
ask how today's decision would support the larger system.

### Vision → Architecture → Reusable Components → Code

**Moment:** As Michael's Foundations grew, it became clear that coding
first would create unnecessary duplication and inconsistency.

**What I did / why:** I began defining a common architecture, design
philosophy, component standards, spacing tokens, and reusable patterns
before multiplying pages across Russian, Spanish, Chess, Music, and
other Foundations.

**Interview takeaway:** Good engineering is not only about making
something work; it is about creating a structure that can grow without
becoming harder to maintain.

### Design Philosophy = Why; Framework = What; Component Standards = How

**Moment:** Several planning documents began to overlap.

**What I did / why:** I separated their responsibilities: the Design
Philosophy explains **why** decisions are made, the Foundation Framework
describes **what** the reusable system is, and Component Standards
define **how** components should behave and look.

**Interview takeaway:** Clear documentation architecture reduces
ambiguity just as clear software architecture does.

### Professional Asset and Documentation Habits

**Moment:** Early in the project I created Documentation resources such
as Coding Standards, journals, component standards, and asset
attribution records.

**What I did / why:** I treated sources, licenses, modifications, usage
locations, and status as information worth recording instead of leaving
them as afterthoughts.

**Interview takeaway:** Maintainability and professionalism include the
decisions around the code, not only the code itself.

------------------------------------------------------------------------

## 2. Learner-Centered Product Decisions

### Start Your Journey, Not Beginner

**Moment:** Traditional labels such as Beginner and Intermediate can
make a learner feel evaluated before learning even begins.

**What I did / why:** I replaced them with language such as **Start Your
Journey** and **Continue Your Journey**. The guiding question became:
**What does the learner need next?**

**Interview takeaway:** Small wording decisions are UX decisions. I
intentionally used language that encourages movement rather than labels
ability.

### Choose the Path That Fits You

**Moment:** I did not want Russian Foundations to force every learner
through one rigid route.

**What I did / why:** The landing experience was designed to explain
value quickly, show where to begin, make progress visible, and allow
learner choice. The interface guides rather than dictates.

**Interview takeaway:** Learner agency can be designed into navigation
and information architecture, not merely written into instructions.

### Make the Click Target Obvious

**Moment:** A learner should not have to guess where to click in a
learning-path row.

**What I did / why:** I used whole-row visual feedback and hover
behavior to communicate clickability. I also refined movement so the
interaction cue moved intentionally rather than making the whole card
feel unstable.

**Interview takeaway:** Motion should have meaning. Interaction design
should remove uncertainty rather than decorate the screen.

### Different Interactions for Different Purposes

**Moment:** I wanted sections to feel cohesive without making every
component behave identically.

**What I did / why:** Skill Cards use restrained hover feedback,
Learning Paths use movement to support choice, and the Journey area can
use richer interaction to emphasize progress.

**Interview takeaway:** Consistency does not mean sameness. Interaction
intensity should match the purpose of the component.

### The Core Learning Cycle

**Moment:** Russian Foundations needed to teach more deeply than simply
presenting phrases.

**What I did / why:** I developed the reusable sequence:

> **See → Hear → Speak → Hear Again → Understand in Context → Type From
> Memory → Immediate Teaching Feedback → Authentic Conversation /
> Context**

**Interview takeaway:** I translated teaching practice into a repeatable
product interaction model.

### Assessment as Continued Learning

**Moment:** I did not want activities to feel like punitive tests.

**What I did / why:** Wrong answers trigger useful teaching feedback and
another opportunity. The design treats error as information: the learner
discovers what went wrong and how to improve.

**Interview takeaway:** Assessment can reinforce learning instead of
interrupting it.

### Backward-Building Pronunciation

**Moment:** Long Russian words can overwhelm a new learner.

**What I did / why:** I converted a teaching technique into the
interface: begin with the final syllable, add the preceding syllable,
continue backward until the whole word is assembled, then repeat the
complete word while gradually increasing speed.

**Interview takeaway:** Domain and teaching expertise can become
concrete software features rather than remaining background knowledge.

------------------------------------------------------------------------

## 3. Debugging and Engineering Thinking

### Rebuild from a Known-Good Foundation

**Moment:** Malformed HTML hierarchy created cascading problems that
were becoming harder to patch.

**What I did / why:** Instead of continuing to repair symptoms, I
stepped back, rebuilt the component from a known-good structure,
verified it piece by piece, and then continued.

**Interview takeaway:** Sometimes the fastest and safest fix is not
another patch; it is rebuilding the affected structure cleanly.

### Avoiding "Frankenstein" CSS

**Moment:** As the stylesheets grew, duplicate and competing rules made
behavior harder to reason about.

**What I did / why:** I began refactoring, using design tokens, reusable
component standards, and deliberate separation of responsibilities
rather than continuously adding overrides.

**Interview takeaway:** Technical debt often begins with small
convenient patches. I learned to stop and restore structure before the
stylesheet becomes unpredictable.

### Learning `:has()` Through a Real UI Problem

**Moment:** A two-button interaction needed each button's appearance to
respond to the state of its sibling.

**What I did / why:** Rather than treating a new selector as magic, I
learned what `:has()` was doing in the relationship and used it to
express the UI state more cleanly.

**Interview takeaway:** I learn new language features best when they
solve a real problem, and I want to understand why the solution works
rather than only paste it.

### Build Conversation Interactions That Can Be Revised

**Moment:** Activities needed to behave like learning tools, not one-way
quizzes.

**What I did / why:** Phrase selections fill blanks, learners can
reverse choices, used options become available again, stale feedback is
cleared, and checking the work produces teaching feedback.

**Interview takeaway:** Good interaction design anticipates revision.
Learners should be able to change their thinking without fighting the
interface.

### Activity 8: Browser Speech Recognition

**Moment:** The original **I Said It** interaction only recorded that a
learner claimed to have spoken.

**What I did / why:** I evolved it into a real speaking interaction
using browser speech recognition: the learner speaks, the interface
shows **I heard**, evaluates the response, and gives useful success or
retry feedback. During debugging, an upstream missing DOM target also
reinforced the need to trace behavior rather than assume the visible
failure is the source.

**Interview takeaway:** I turned a passive confirmation button into an
authentic interactive feature and debugged the system by following the
behavior through the DOM and JavaScript.

------------------------------------------------------------------------

## 4. Audio and Technology Tradeoffs

### Choosing Browser Speech for Version 1

**Moment:** The long-term audio goal includes varied Russian speakers
and strong pronunciation support, but the first implementation needed to
be practical for learners.

**What I did / why:** I evaluated quality, cost, licensing, reliability,
accessibility, browser dependence, and implementation complexity.
Browser Web Speech worked now, was free, and required no learner account
or subscription, so I chose it for Version 1 while recognizing its
voice-selection limitations.

**Interview takeaway:** A good technical decision is not always the most
sophisticated option. It is the option that best satisfies the current
product requirements and constraints.

### Research Before Committing to an Audio Architecture

**Moment:** I explored multiple TTS routes rather than choosing the
first service I found.

**What I did / why:** The seven routes explored were Google Cloud
Text-to-Speech, ElevenLabs, Microsoft Azure AI Speech / Speech Studio,
TTSMaker, Microsoft Edge / browser speech, FreeReadText, and Amazon
Polly. The comparison helped separate a future ideal from what Version 1
actually required.

**Interview takeaway:** I make technology choices by comparing tradeoffs
and gathering evidence, not by assuming the most impressive tool is
automatically the best fit.

### Designing for Future Multi-Speaker Audio

**Moment:** One browser Russian voice can support Version 1, but
language learners benefit from hearing more than one speaker and from
slower playback when needed.

**What I did / why:** I kept the architecture open to future prerecorded
or higher-quality multi-speaker audio, including normal and slower
versions, without making that complexity a prerequisite for the first
usable release.

**Interview takeaway:** Versioning lets me deliver a useful solution now
without closing the door on a stronger future implementation.

------------------------------------------------------------------------

## 5. AI, Teaching, and Professional Philosophy

### AI as a Workflow Amplifier

**Moment:** AI has been part of the development workflow, but the
project is intentionally not built around outsourcing judgment.

**What I did / why:** My guiding statement is:

> **AI is not a replacement for thinking. AI is a workflow amplifier for
> human intelligence.**

I use it to accelerate exploration and implementation while continuing
to question, test, revise, and make the final design decisions.

**Interview takeaway:** The value I bring is not simply access to AI; it
is the ability to use AI while retaining ownership of reasoning,
learning, and product decisions.

### The Productivity Architect

**Moment:** My Lean Six Sigma background and teaching experience began
converging with software development.

**What I did / why:** I started describing the direction as **The
Productivity Architect**: building tools and learning experiences that
reduce uncertainty, prioritize useful action, and help people do what
once seemed difficult.

**Interview takeaway:** My past careers are not disconnected chapters;
they provide different perspectives that now inform how I design
software and learning experiences.

------------------------------------------------------------------------

## 6. Highlight Interview Moment: The Deleted CSS Rebuild

### A Setback Became Version 0.2

**Moment:** The original Portfolio Website CSS was accidentally deleted.
Recreating the old page exactly would have restored the file, but it
would also have restored earlier design problems.

**What I did / why:** I used the setback to reassess what the Portfolio
Website --- the Front Door --- was supposed to do. We simplified and
rebuilt the HTML deliberately, rewrote the About Me story, separated
**The Learning Experience I Built** from the project destinations,
rebuilt the CSS from a cleaner foundation, and completed a full cohesion
review. Version 0.2 emerged with cleaner architecture, stronger visual
hierarchy, and a more coherent experience.

**Interview takeaway:** The professional story is not *I accidentally
deleted my CSS.* It is: **A setback prompted me to reassess rather than
blindly reconstruct. I rebuilt from a cleaner foundation and produced a
simpler, more coherent solution.** This is also the project's learning
philosophy in practice: getting something wrong can become the point
where deeper understanding begins.

------------------------------------------------------------------------

# Part II --- Architecture and Reusability Discoveries After Day 10

## 7. Russian Foundations as the Reference Implementation

### The Original Pancake

**Moment:** Greetings & Introductions became the first substantial
implementation where the learning architecture was discovered through
actual building rather than predetermined in advance.

**What I did / why:** I allowed the project to expose weaknesses,
duplicated patterns, interaction needs, and reusable ideas. Instead of
pretending the first implementation was already a template, I treated it
as the proving ground --- the **Original Pancake**.

**Interview takeaway:** A first implementation can be valuable precisely
because it reveals what should and should not become reusable.

### Family Relationships Proves Clonability

**Moment:** Copying Greetings & Introductions would not prove that
Michael's Foundations had a reusable architecture.

**What I did / why:** Family Relationships became the deliberate test of
**clonability**: could architecture discovered in Greetings &
Introductions be separated from lesson-specific content, adapted to a
new subject, improved, and reused without simply duplicating the
original lesson?

**Interview takeaway:** Reuse is not copying. Reuse requires identifying
stable architecture, separating it from content, and proving that it
survives a new context.

### A Three-Project Architecture-Discovery Sequence

**Moment:** The first three substantial Russian Foundations projects
developed distinct architectural roles.

**What I did / why:**

1.  **Greetings & Introductions** --- discover and prove the initial
    learning experience.
2.  **Family Relationships** --- test and refine clonability.
3.  **Days of the Week** --- use the stabilized architecture after the
    lessons from Family Relationships have been incorporated.

**Interview takeaway:** I began treating projects as controlled stages
of architectural maturity rather than independent pages.

------------------------------------------------------------------------

## 8. Reusable Component Architecture

### Portable Component Packages

**Moment:** A reusable component is not truly portable if only its
visible HTML can be copied.

**What I did / why:** I defined a portable component package as the
component's coordinated HTML, CSS, JavaScript, and every asset it
depends on, accompanied by a repeatable integration procedure.

**Interview takeaway:** Reusability includes dependencies and migration
knowledge, not merely reusable markup.

### Listening Room as a Self-Contained Learning Experience

**Moment:** The Listening Room began as a feature inside a Foundation
but showed potential to become reusable.

**What I did / why:** I separated its shared architecture --- state
behavior, controls, feedback, reset/replay, accessibility, responsive
behavior, visual identity, and integration pattern --- from
Foundation-specific listening content.

**Interview takeaway:** I learned to recognize when a feature should
stop being treated as page code and become an independently maintained
component.

### Four Doors as a Reusable Component

**Moment:** The same question arose with the Four Doors Explore
experience.

**What I did / why:** I treated the Four Doors as a reusable
architecture whose hallway, door-selection framework, visual identity,
return behavior, state management, accessibility, responsive behavior,
and integration pattern could remain stable while each Foundation
supplied its own instructional content.

**Interview takeaway:** Reusable architecture can preserve a
recognizable learner experience without forcing every implementation to
contain identical content.

------------------------------------------------------------------------

## 9. SHELL and ACTUAL: Two Different Kinds of Reuse

### Clean Abstraction + Proven Reference Implementation

**Moment:** A clean reusable shell alone turned out not to be enough.

**What I did / why:** I separated reusable components into two explicit
resources:

-   **SHELL** --- a clean, Foundation-independent reusable architecture.
-   **ACTUAL** --- a populated, proven reference implementation
    containing real content plus the CSS/JavaScript and instructional
    structures required to make that implementation work.

This pattern was established with Four Doors and successfully repeated
with the Listening Room.

**Interview takeaway:** Reusable systems benefit from both a clean
abstraction and a concrete proven reference. The shell shows what is
portable; the actual implementation preserves working knowledge and
lessons learned.

> **SHELL = reusable architecture. ACTUAL = proven implementation and
> reusable knowledge.**

------------------------------------------------------------------------

# Part III --- Listening Room Migration Milestone

## 10. Family Relationships as the Live Migration Test

### A Component Can Work Alone and Still Fail When Embedded

**Moment:** The authoritative Listening Room worked in the Testing Lab,
but integrating it into Family Relationships exposed problems that did
not exist in isolation.

**What I did / why:** I debugged the integration rather than assuming
the component or host was universally wrong. The work exposed issues
involving layout boundaries, Journey Rail accommodation, background
ownership, component sizing, scrolling behavior, completion controls,
and stale JavaScript dependencies.

**Interview takeaway:** Standalone success does not prove integration
safety. Reusable components must be tested inside real host
environments.

### Learner Freedom Without Sacrificing Earned Completion

**Moment:** The Listening Room originally forced the learner through
Encounters 1 → 2 → 3 → 4 → 5 → 6.

**What I did / why:** I preserved that sequence as the **recommended
path** while adding an Encounter Navigator that lets learners jump
forward or backward at any time. Merely visiting an encounter does not
count as completion; completion is earned only by actually completing
that encounter.

The design principle became:

> **The path is guidance, not a cage.**

**Interview takeaway:** Learner agency and meaningful progress tracking
do not have to conflict. Navigation can be flexible while completion
remains evidence-based.

### Unfinished Work Restarts Cleanly

**Moment:** Allowing learners to jump among encounters created a
state-management question: what should happen when they leave an
encounter halfway through?

**What I did / why:** For Version 1, an unfinished encounter restarts at
HEAR when revisited rather than persisting partial move-by-move state.

**Interview takeaway:** State persistence should be intentional. More
persistence is not automatically better if it adds complexity without
improving the learner experience.

------------------------------------------------------------------------

## 11. Component Ownership vs. Host Ownership

### The Architectural Ownership Principle

**Moment:** During Family Relationships integration, some fixes clearly
belonged to the reusable Listening Room while others existed only
because of the host Foundation.

**What I did / why:** I formalized the boundary:

> **ACTUAL owns the reusable Listening Room. Migration Instructions own
> the adaptation required to make ACTUAL live safely inside a specific
> Foundation.**

Reusable fixes were promoted back into authoritative ACTUAL.
Family-specific accommodations stayed in Family Relationships and were
documented in Migration Instructions.

**Interview takeaway:** Maintainable reuse requires explicit ownership.
A reusable component should not accumulate host-specific hacks simply
because they solved one integration problem.

### Promote Reusable Lessons Back to Authority

**Moment:** Family Relationships exposed reusable problems such as
global selector leakage, viewport-relative sizing, page-level scrolling,
and obsolete DOM dependencies.

**What I did / why:** Once those problems were understood and proven, I
corrected them at the authoritative component source rather than leaving
the improved behavior trapped inside one Foundation.

**Interview takeaway:** A reference implementation should learn from
downstream use. Proven reusable improvements should flow back to the
authoritative source.

### Keep Foundation Geometry Out of ACTUAL

**Moment:** Family Relationships needed specific layout allowances to
coexist with its Journey Rail and surrounding page geometry.

**What I did / why:** I kept those host-specific values in the
Foundation integration layer rather than making them universal constants
inside ACTUAL.

**Interview takeaway:** A value that works in one host environment is
not automatically a component requirement.

------------------------------------------------------------------------

## 12. Debugging Lessons from the Listening Room Integration

### Removing Visible UI Can Leave Invisible Dependencies

**Moment:** The redundant `Encounter 1 of 6` indicator was removed from
the interface. The room looked correct, but later stopped working.

**What I did / why:** I traced the behavior into JavaScript and found
that the removed DOM element was still referenced through
`document.getElementById("encounterProgress")` and updated during
rendering. Removing the obsolete dependency restored the room.

**Interview takeaway:** When removing UI, check all three layers ---
HTML, CSS, and JavaScript. A visual deletion can leave a behavioral
dependency behind.

### Debug the Dependency, Not the Most Recent Change

**Moment:** A later visible change appeared to have broken the Listening
Room, but the actual cause was an older hidden dependency.

**What I did / why:** Instead of repeatedly undoing recent styling
changes, I followed the execution path and found the missing DOM target.

**Interview takeaway:** Temporal proximity is not proof of causation.
Trace the system before blaming the last edit.

### Structural Ownership of Completion Controls

**Moment:** The Family Tree Puzzle's **Mark Complete** control appeared
to disappear behind the Listening Room.

**What I did / why:** The real issue was structural: the completion
control was nested inside Stage 3 even though it represented completion
of the entire Family Tree Puzzle. I moved the existing control one
structural level outward so its DOM ownership matched its conceptual
ownership.

**Interview takeaway:** A control should live at the structural level of
the thing it controls. Layout bugs can reveal architecture problems.

------------------------------------------------------------------------

# Part IV --- Four Doors Migration and the ACTUAL Fingerprint Method

## 13. Finding Reliable Component Boundaries

### The Problem with Semantic Guessing

**Moment:** Before migrating the Four Doors authoritative version, I
needed to identify exactly where its HTML, CSS, and JavaScript began and
ended inside the much larger Family Relationships source files.

**What I did / why:** An initial CSS assumption treated the broad
`EXPLORE PHASE` region as the Four Doors boundary. That was too broad
because the region also contained host-Foundation infrastructure and
later Family-specific additions.

**Interview takeaway:** Nearby comments and conceptual section names are
useful navigation aids, but they are not sufficient evidence for a
migration boundary.

### The ACTUAL Fingerprint Method

**Moment:** I realized that if Four Doors ACTUAL was truly
self-contained, the authoritative source itself could tell us exactly
where its embedded counterpart ended.

**What I did / why:** I used the final distinctive code block in each
authoritative ACTUAL file as a **fingerprint**, found its exact
counterpart inside the Family Relationships file, and verified that the
code immediately following it belonged to the host Foundation.

The procedure became:

1.  Start with the authoritative ACTUAL source.
2.  Identify a distinctive first or final meaningful code block.
3.  Find the same structure inside the integrated Foundation file.
4.  Match actual selectors, variables, comments, tags, and closing
    structure rather than relying on approximate location.
5.  Mark the matching block as the component boundary.
6.  Verify that surrounding code belongs to the host rather than the
    reusable component.

**Interview takeaway:** When documentation or comments are insufficient,
source comparison can provide stronger architectural evidence.

> **Boundary rule:** When a reusable ACTUAL component has been embedded
> inside a larger Foundation file, use the authoritative ACTUAL source
> itself as the fingerprint for locating the embedded component. Match
> the first and last authoritative blocks, then verify that the
> surrounding code belongs to the host Foundation.

> **Do not determine component boundaries only by nearby comments, phase
> labels, or approximate line ranges. Exact source matching is the
> stronger evidence.**

### Family Relationships Four Doors Boundaries at This Checkpoint

At the time the boundaries were established, the embedded Four Doors
ACTUAL regions in the current Family Relationships files were:

  File           Beginning      Ending
  ------------ ----------- -----------
  HTML           Line 3434   Line 4720
  CSS            Line 2117   Line 7198
  JavaScript     Line 3339   Line 5191

> **These line numbers are historical coordinates for the files at this
> checkpoint. Permanent BEGIN/END comments are the durable migration
> boundaries because line numbers will shift as the files evolve.**

### Turning a Discovery into Migration Knowledge

**Moment:** The boundary-finding exercise could have remained a one-time
debugging trick.

**What I did / why:** I documented not only the final line ranges but
also how they were derived, so future component migrations can repeat
the method instead of trusting an unexplained number.

**Interview takeaway:** Good documentation preserves reasoning, not
merely conclusions.

------------------------------------------------------------------------

# Part V --- Documentation as Executable Process

## 14. Migration Instructions Became a Working Checklist

### From Notes to Procedure

**Moment:** The Listening Room Migration Instructions had accumulated
valuable lessons but were becoming difficult to read and mixed
reusable-component responsibilities with host-specific adaptations.

**What I did / why:** I reorganized the document around architectural
ownership, pre-migration inspection, collision checks, integration,
host-specific adaptation, verification, failure traps, and a final
Markdown task checklist.

**Interview takeaway:** Documentation becomes more valuable when it can
guide actual execution rather than merely describe what happened.

### The Next Migration Is the Test

**Moment:** A well-written checklist can still be wrong.

**What I did / why:** I deliberately did **not** declare the Listening
Room Migration Instructions proven simply because they looked complete.
The next real migration will be the validation run. We will observe
which instructions prevent problems, which are unclear or unnecessary,
and which missing steps are exposed.

**Interview takeaway:** Procedures should be validated empirically just
like software. Documentation is also a hypothesis until repeated use
proves it.

------------------------------------------------------------------------

# Part VI --- Broader Professional Development

## 15. Building Evidence for an AI-Collaboration Philosophy

### Michael's Foundations as a Lived Laboratory

**Moment:** The longer-term Productivity Architect / TEDx-level goal is
not to manufacture an abstract argument about AI and education first.

**What I did / why:** I began treating Michael's Foundations as the
lived laboratory that can generate the eventual evidence: mistakes,
design decisions, debugging sessions, tradeoffs, successful
collaborations, failures, and examples of where human judgment remained
essential.

**Interview takeaway:** A mature professional philosophy should emerge
from evidence and experience, not slogans alone.

### AI Collaboration Without Surrendering Ownership

**Moment:** The project repeatedly requires questioning AI suggestions,
rejecting incorrect boundaries, testing hypotheses, and using working
code as evidence.

**What I did / why:** I use AI as a collaborator for analysis and
implementation while retaining responsibility for deciding what is
correct. The Four Doors boundary investigation is one concrete example:
an initial AI boundary conclusion was challenged, a better
source-comparison hypothesis was proposed, and the evidence changed the
answer.

**Interview takeaway:** Effective AI collaboration includes
disagreement, verification, and correction. Human judgment remains part
of the engineering loop.

------------------------------------------------------------------------

# Part VII --- Themes to Carry Into Future Interviews

-   **Learner first:** ask what the person using the software needs
    next.
-   **Build systems, not isolated pages.**
-   **Reuse is not copying:** separate stable architecture from
    context-specific content.
-   **SHELL and ACTUAL serve different purposes:** preserve both
    abstraction and proven implementation.
-   **A component and its host have different ownership
    responsibilities.**
-   **Promote proven reusable fixes back to the authoritative source.**
-   **Consistency should create familiarity without forcing every
    component to look or behave the same.**
-   **Debug behavior before blindly changing code.**
-   **Trace dependencies instead of assuming the latest edit caused the
    failure.**
-   **Rebuild cleanly when patches are creating cascading complexity.**
-   **Use mistakes as information and opportunities to improve.**
-   **Choose technology based on requirements and tradeoffs, not
    novelty.**
-   **Design for revision, feedback, confidence, learner agency, and
    measurable progress.**
-   **Use AI to amplify human reasoning, not replace it.**
-   **Challenge AI output when the evidence does not support it.**
-   **Document the reasoning behind decisions so the portfolio shows how
    I think, not only what I built.**
-   **Treat migration procedures and documentation as systems that must
    themselves be tested.**

------------------------------------------------------------------------

# Living Interview-Moment Template

Use this structure when a new significant moment occurs:

``` markdown
## [Interview Moment Title]

**Moment:** What happened? What problem, decision, discovery, or opportunity appeared?

**What I did / why:** What did I decide or build, and what reasoning drove the decision?

**Evidence / result:** What happened after the decision? What proved or disproved the idea?

**Interview takeaway:** What does this reveal about how I think or work?
```

> **Preserve the development story, not just the finished product. The
> evolution of Michael's Foundations is evidence of how I learn, reason,
> design, debug, and improve.**

------------------------------------------------------------------------

**Current checkpoint:** September 12, 2026 --- Living Interview Moments
consolidated from the original Day 10 Word document and subsequent
Michael's Foundations development milestones.
