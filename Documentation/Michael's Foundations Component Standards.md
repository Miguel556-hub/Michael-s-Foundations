# Michael's Foundations Component Standards

> This document defines the implementation standards for reusable user interface components throughout the Michael's Foundations ecosystem.
>
> While the **Design Philosophy** explains *why* components are designed the way they are, and the **Foundation Framework** explains *what* the learner experiences, this document explains *how* components are built and reused.

---

# Purpose

Reusable components reduce unnecessary design decisions while creating a familiar, predictable experience for learners across every Foundations project.

Every reusable component should:

- Be visually consistent.
- Clearly communicate its purpose.
- Be reusable across multiple projects.
- Support the learner before showcasing the technology.

> **Every component should answer one question:**
>
> **"Does this help the learner?"**

---

# Shared Design Tokens

Reusable components should reference existing design tokens whenever possible.

### Card Tokens

```css
--card-border
--card-radius
--card-padding
--card-shadow
--card-hover-shadow
--card-transition-speed
```

Component-specific values should only be introduced when they represent genuinely unique behavior.

---

# Reusable Card Standard

## Purpose

Cards organize related information into clear, approachable learning units.

Cards should invite exploration without overwhelming the learner.

---

## Visual Standards

### Border

```css
var(--card-border)
```

### Border Radius

```css
var(--card-radius)
```

### Padding

```css
var(--card-padding)
```

### Shadow

```css
var(--card-shadow)
```

---

## Interaction Standards

Cards should acknowledge learner interaction through subtle motion.

Hover effects should:

- Lift slightly
- Increase shadow appropriately
- Never distract from the content

Motion should communicate interaction—not decoration.

---

## Transition

```css
var(--card-transition-speed)
```

All transitions should feel smooth and intentional.

---

# Component Implementations

## Journey Card

### Purpose

Present a learner with a selectable learning destination.

### Standard

- Three-column grid
- Left-aligned content
- Large icon
- Blue title
- Supporting description
- Action link
- Card lifts on hover
- Icon scales slightly

---

## Process Card

### Purpose

Explain the learner's learning process.

### Standard

- Three-column grid
- Centered content
- Circular icon
- Icon enlarges on hover
- Circular background receives subtle blue tint
- Card lifts slightly
- Action link at bottom

---

## Journey Timeline Card

### Purpose

Visually communicate learner progress through a Foundation.

### Standard

- Horizontal layout
- Circular icon
- Connecting timeline
- Hover emphasizes icon and title
- Strongest interaction on the page

---

## Skill Card

### Purpose

Introduce major learning areas.

### Standard

- Clean presentation
- Minimal interaction
- Focus on clarity

---

# Hero Standard

Hero sections should establish the learner's confidence before presenting content.

Every hero should include:

- Primary title
- Encouraging tagline
- Supporting message
- Clear visual hierarchy
- Calm visual appearance

Hero sections should avoid unnecessary animation or visual clutter.

---

# Section Standard

Every major section should contain:

- Section title
- Supporting paragraph
- Primary content

### Alignment

Titles and supporting paragraphs are left-aligned.

Individual components determine their own internal alignment.

---

# Hover Standards

Hover effects should reinforce interaction rather than attract attention.

| Component        | Hover Behavior                                         |
|------------------|--------------------------------------------------------|
| Journey Card     | Card lifts, icon grows slightly, action link moves     |
| Process Card     | Card lifts, icon grows, circular background tints blue |
| Journey Timeline | Card lifts, icon grows, title scales slightly          |

---

# HTML Organization Standard

Major structural containers should be documented with HTML comments.

Example:

```html
<!-- Begin Vocabulary Journeys -->

<section>

...

<!-- End Vocabulary Journeys -->
```

### Guidelines

- Comment major structural containers.
- Use Begin / End comments.
- Do not comment every `<div>`.
- Comments should describe structure rather than implementation.

---

# CSS Organization Standard

Stylesheets should follow a predictable hierarchy.

Recommended order:

1. Design Tokens
2. Global Styles
3. Layout
4. Reusable Components
5. Page Components
6. Utilities
7. Media Queries

Each major section should be identified using standardized comment blocks.

---

# Definition of Success

A Michael's Foundations component should:

- Feel familiar
- Behave predictably
- Support the learner
- Reuse existing standards
- Strengthen the consistency of the ecosystem

Consistency is one of the defining characteristics of Michael's Foundations.

Every new page should feel like it belongs to the same learning environment without requiring the learner to relearn the interface.