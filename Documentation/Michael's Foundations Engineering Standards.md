# Michael's Foundations Engineering Standards

> This document defines the engineering principles, development practices, and quality standards used throughout the Michael's Foundations ecosystem. Every project should follow these standards to ensure a consistent, maintainable, and learner-centered experience.

---

# Purpose

Michael's Foundations exists to create educational software that is organized, approachable, and enjoyable to use. These standards provide a consistent framework for designing, building, testing, and maintaining every project in the ecosystem.

Engineering decisions should support three goals:

- Create an excellent learner experience.
- Build software that is easy to maintain.
- Develop reusable components that scale across every Foundations project.

---

# Core Engineering Principles

## 1. Protect the Consistency

Once a design system has been established, new features should adapt to the system instead of forcing the system to adapt to individual features.

Consistency builds trust.

---

## 2. Motion Should Have Meaning

Animations exist to:

- Guide attention
- Communicate interaction
- Reinforce purpose

Animation should never be added simply because it is possible.

---

## 3. Shared DNA. Unique Personality.

Reusable components should share the same design language while maintaining behaviors appropriate to their individual purpose.

Every component belongs to the same family.

Every component serves a unique role.

---

## 4. Design Before Code

Before writing HTML or CSS, answer these questions:

- What problem are we solving?
- What experience should the learner have?
- How does this fit the design system?

Implementation begins only after the design has been intentionally considered.

---

## 5. One Change. One Test.

Avoid making multiple structural changes at once.

Small, testable improvements reduce complexity, simplify debugging, and prevent cascading errors.

---

## 6. Build for Future Michael

Code should be written so that it remains understandable months later.

Future maintainability is as important as present functionality.

---

## 7. Explain the Why

Code explains what the browser should do.

Documentation explains why the decision was made.

Future developers should understand both.

---

# Development Workflow

Every new feature follows the same engineering process.

1. Define the purpose.
2. Design the learner experience.
3. Implement the solution.
4. Refine the user experience.
5. Document lessons learned.

---

# Design System Philosophy

The Michael's Foundations Design System exists to reduce unnecessary decisions.

Reusable design tokens, semantic tokens, and component standards create a consistent experience across every project.

The design system should become stronger over time—not more complicated.

---

# Refactoring Philosophy

Refactoring should improve readability, consistency, and maintainability without changing intended behavior.

When possible:

- Replace hard-coded values with semantic tokens.
- Reuse existing standards.
- Remove duplication.
- Preserve working functionality.

---

# Documentation Philosophy

Documentation is considered part of the software.

Every major engineering decision should answer:

- What was built?
- Why was it built?
- What was learned?
- How should future projects apply this lesson?

---

# Definition of Success

A Michael's Foundations project is successful when it is:

- Learner-centered
- Consistent
- Maintainable
- Well documented
- Easy to extend
- Enjoyable to use

Software should not merely function.

It should communicate quality through every interaction.