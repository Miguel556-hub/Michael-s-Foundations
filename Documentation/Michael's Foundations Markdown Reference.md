# Michael's Foundations Markdown Reference

> The official Markdown guide for the Michael's Foundations Developer Handbook.

---

# Purpose

This guide explains the Markdown syntax and documentation style used throughout the Michael's Foundations ecosystem.

## Headings

```md
# Document Title

## Major Section

### Subsection

#### Topic
```

**Rules**
- One `#` heading per document.
- Leave a blank line after headings.

---

## Text Formatting

```md
**Bold**
*Italic*
***Bold Italic***
`inline code`
```

---

## Lists

```md
- Bullet
- Bullet

1. First
2. Second

- [ ] Task
- [x] Complete
```

---

## Block Quotes

```md
> Protect the Consistency
```

---

## Horizontal Rule

```md
---
```

---

## Links

```md
[GitHub](https://github.com)
```

---

## Images

```md
![Screenshot](images/example.png)
```

---

## Code Blocks

````md
```css
.skill-card {
    padding: var(--card-padding);
}
```
````

---

## Tables

```md
| Item | Status |
|------|--------|
| Hero | Complete |
```

---

# Michael's Foundations Document Template

````md
# Document Title

> One-sentence purpose.

---

# Purpose

Explain why this document exists.

---

## Main Sections

### Topic

#### Purpose

...

#### Design Intent

...
````

---

# Documentation Standards

- Explain **why**, not just **what**.
- Use headings generously.
- Prefer bullet lists over long paragraphs.
- Keep naming consistent.
- Protect the consistency.
- Documentation is part of the software.
