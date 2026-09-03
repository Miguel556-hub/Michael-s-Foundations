# Developer Journal  ----------------------------------------------------------------------------------------------------------

## Entry #1 – Beginning the Journey

**Date:** August 1, 2026

---

## Session Goal

Begin building my professional software development portfolio using HTML, CSS, Visual Studio Code, and GitHub.

The long-term goal is to build a collection of educational software projects while developing the skills of a professional software developer.

---

# What I Built Today

## Project Folder Structure

Created the main project folders:

- Portfolio Website
- Russian Foundations
- Chess Foundations
- Music Foundations
- Arm Wrestling Foundations
- Teacher's Toolkit
- Documentation
- Images
- Resources
- Lessons

This establishes a clean organization that will grow with the project.

---

## Portfolio Homepage

Created my first professional portfolio webpage.

The homepage now contains:

- Navigation Bar
- Hero Section
- Professional Titles
- Personal Mission Statement
- "View My Projects" button
- About Me section
- Featured Projects section

---

# New HTML Concepts Learned

Today I practiced using:

- `<header>`
- `<nav>`
- `<main>`
- `<section>`
- `<div>`
- CSS Classes
- IDs for page navigation
- Anchor links
- Semantic HTML

I also learned why semantic HTML improves organization and readability.

---

# New CSS Concepts Learned

## Flexbox

Used Flexbox to organize the navigation bar.

**Key Idea**

Flexbox organizes elements in **one direction**.

Examples:

- Navigation bars
- Toolbars
- Menus
- Rows of buttons

---

## CSS Grid

Introduced Grid for future Project Cards.

**Key Idea**

Grid organizes elements in **rows and columns**.

Examples:

- Project Cards
- Dashboards
- Image Galleries
- Product Layouts

---

## Margin

Learned that Margin creates space **outside** an element.

Example:

```css
margin: 10px auto 25px auto;
```

This controls spacing above, below, left, and right.

---

## Padding

Learned that Padding creates space **inside** an element.

Padding changes how much space exists between the content and the border.

---

## Border

Experimented with different border styles.

Originally tried:

```css
border-style: groove;
```

Then changed to:

```css
border: 2px solid #0B4F8A;
```

This created a cleaner and more modern appearance.

---

# Design Decisions

## Navigation

- Dark blue background
- White navigation links
- Simple and easy to read

---

## Hero Section

- Centered layout
- Professional titles
- Mission statement
- Primary action button

---

## Button Design Standard

Decided that all buttons throughout every Foundation Project will share the same design.

Current standard:

- Light gray background
- Dark blue text
- 2px solid dark blue border
- Rounded corners
- Smooth hover transition

Consistency will make every project feel like part of one software suite.

---

# User Experience (UX)

One important realization today:

> The user should never have to guess what to do next.

Good software should guide the user naturally.

Every design decision should improve clarity and usability.

---

# Biggest Lesson Today

I realized that professional web design is not just about writing HTML and CSS.

It is about making thoughtful design decisions that improve the user's experience.

I also discovered that spacing (margin and padding) has a major impact on how professional a webpage feels.

---

# Personal Reflection

Today I became much more comfortable using Visual Studio Code.

I learned to troubleshoot problems instead of becoming frustrated when something didn't work.

I also realized that I enjoy experimenting with CSS to see how small changes affect the appearance of a webpage.

One important milestone today was recognizing the value of consistency. Instead of thinking about styling one button, I started thinking about creating a consistent design language that can be used throughout every project.

That feels like an important step toward thinking like a software developer instead of simply writing code.

---

# Goals for the Next Session

- Transform the Featured Projects into professional Project Cards using CSS Grid.
- Continue refining the homepage spacing and layout.
- Add my personal logo.
- Add my professional photograph.
- Begin creating a reusable design system that will be used across all Foundation Projects.

# Developer Journal ----------------------------------------------------------------------------------------------------------

## Entry #2 – Establishing Professional Standards

**Date:** August 1, 2026

---

## Session Goal

Improve the quality, readability, and maintainability of the portfolio website by establishing professional coding standards rather than simply adding new features.

---

# What I Improved

## CSS Documentation

Expanded the stylesheet with detailed documentation for each major section.

Each section now explains:

- Purpose
- Design intent
- Future use

The stylesheet has become easier to understand and maintain.

---

## Coding Standards

Created a new document:

Coding Standards.md

This document establishes the standards that every Foundation Project will follow.

Topics include:

- Folder organization
- File naming
- HTML standards
- CSS standards
- Comment standards
- Design philosophy
- Developer principles

This document will become the reference guide for every future project.

---

## Markdown

Began learning Markdown for project documentation.

Learned how to use:

- Headings
- Lists
- Code blocks
- Quotes
- Horizontal rules

I now understand that Markdown is based on hierarchy rather than visual formatting.

---

## CSS Standards

Made the stylesheet more explicit and easier to read.

Examples:

Instead of:

```css
border: 2px solid #0B4F8A;
```

I chose:

```css
border-width: 2px;
border-style: solid;
border-color: #0B4F8A;
```

Although the shorthand version is shorter, I chose the expanded version because it clearly communicates the purpose of each property.

---

## New Personal Standards

Beginning with this project, I will:

- Prefer readability over shortcuts.
- Use meaningful comments.
- Keep consistent spacing.
- Use leading zeros for decimal values.
- Write code that another developer can easily understand.

---

## Biggest Lesson Today

Professional software development is not only about making code work.

It is about creating code that is organized, documented, consistent, and maintainable.

---

## Personal Reflection

Today I realized that coding standards are just as important as writing code.

As a teacher, I always emphasized organization and documentation for my students.

I now see that those same principles apply directly to professional software development.

Rather than treating documentation as an afterthought, I want documentation to become one of the defining characteristics of every Foundation Project.

---

# Interview & LinkedIn insights
## Day 3

- Learned to think in reusable UI components instead of isolated HTML elements.
- Introduced a badge component system using base classes and modifier classes.
- Realized that architecture should drive implementation, not the other way around.
- Discovered that documenting design decisions is as important as documenting code.

The Story Behind Today's Lessons - Today I experienced one of the biggest shifts since beginning Michael's Foundations.

At first, I believed I was simply improving the appearance of my project cards. As we continued developing the badge system, I realized we were doing something much larger—we were building reusable software components instead of individual webpage elements. One moment especially stood out to me. After creating the In Development badge, I found myself thinking, "We'll probably do the same thing for the Planning badge." That was the first time I naturally anticipated the architecture before being told the next step.

Later, after applying the Planning badge to every project, I laughed and said: "Oh no! All the status bars look alike now! We've become too proficient!" That comment led to another important realization. The problem wasn't the CSS. The architecture was working exactly as designed.

The real question became: "How should the user experience this information?"

Instead of focusing only on writing code, I began thinking about visual communication, component reuse, and how users perceive the interface. By the end of today's session, I realized we were no longer just creating project cards. We were creating the first pieces of a design system that will eventually support every Foundation Project and every future learning application within Michael's Foundations.

Perhaps the most important lesson of today was discovering that software development is not only about writing code. It is about designing systems that are reusable, scalable, understandable, and meaningful to the people who use them.

### Interview reflection
Today I learned that good software isn't created by adding more code. It's created by recognizing patterns, reducing duplication, and building reusable components that make future development easier. I also learned that user experience often begins with asking better design questions, not simply writing better code.

---