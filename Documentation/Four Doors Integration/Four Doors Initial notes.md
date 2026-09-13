### Four Doors ACTUAL — Confirmed Family Relationships Boundaries

| File       | Beginning | Ending    |
|------------|----------:|----------:|
| HTML       | Line 3434 | Line 4720 |
| CSS        | Line 2117 | Line 7198 |
| JavaScript | Line 3339 | Line 5191 |

### How These Boundaries Were Identified

The Four Doors boundaries were not chosen by visual guesswork alone. They were identified 
by comparing the authoritative Four Doors ACTUAL files against the Four Doors code embedded 
inside the current Family Relationships files.

The process was:

1. **Start with the authoritative ACTUAL file.**
   - Treat the standalone `four-doors-actual.html`, `.css`, and `.js` files as the reference source.

2. **Identify a distinctive boundary block in ACTUAL.**
   - For the ending boundary, use the final meaningful block of code in the authoritative file.
   - This final block acts as a fingerprint.

3. **Find that same block inside the Family Relationships file.**
   - Match the actual code structure, selectors, variables, comments, and closing braces/tags.
   - Do not rely only on section names or approximate line location.

4. **Mark the end of the matching block as the embedded ACTUAL boundary.**
   - Anything immediately after that matching block is treated as host-Foundation code unless 
   later evidence proves otherwise.

5. **Verify what follows the boundary.**
   - In CSS, the code after the matched ACTUAL ending changed into Family Relationships-specific 
   Grammar Candy and lesson styling.
   - In JavaScript, the code after the matched ACTUAL ending changed into Family Relationships-specific 
   Lesson 2 Cousin Grammar Candy behavior.
   - This confirmed that the Four Doors ACTUAL block had ended.

6. **Use the same logic for the beginning boundary.**
   - Match the first authoritative Four Doors block against its corresponding location in the integrated 
   Family Relationships file.
   - The first matching authoritative block establishes the beginning of the embedded component.

> **Boundary rule:** When a reusable ACTUAL component has been embedded inside a larger Foundation file, 
> use the authoritative ACTUAL source itself as the fingerprint for locating the embedded component. 
> Match the first and last authoritative blocks, then verify that the surrounding code belongs to the host Foundation.

> **Do not determine component boundaries only by nearby comments, phase labels, or approximate line ranges. 
> Exact source matching is the stronger evidence.**

> **Important:** These line numbers describe the current Family Relationships files and will shift as those files
> are edited. The permanent BEGIN/END FOUR DOORS ACTUAL comments are the durable migration boundaries; the line numbers 
> preserve where those boundaries were established at this point in development.
