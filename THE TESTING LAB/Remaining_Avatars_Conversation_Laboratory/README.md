# Six Remaining Avatars — Conversation Laboratory

## What is included

Six complete **first-pass scripted conversation prototypes**, using one reusable HTML/CSS/JavaScript engine:

| Avatar | Scenario | Dialogue turns | Suggested answers |
| --- | --- | ---: | ---: |
| Dmitri | Planning Dinner | 4 | 12 |
| Amina | Grocery Shopping | 4 | 12 |
| Timur | Cooking Together | 4 | 12 |
| Ruslan | Family Picnic | 4 | 11 |
| Elena | Visiting Relatives | 4 | 12 |
| Sofia | Vacation Restaurant | 4 | 12 |

Each conversation has a starting question, possible responses, alternate branches where indicated, word-by-word Meaning & Usage, visually highlighted word forms, a Language Discovery explanation, a two-choice pattern check, Russian speech playback, microphone recognition where supported, and a typed-response fallback.

## Open

1. Extract this ZIP into THE TESTING LAB.
2. Open the folder in VS Code.
3. Start Live Server and open `index.html`.
4. Select any character at the top. Use **See Possible Answers** to see responses to the current question.
5. Speak or type one of the suggested responses; the next turn is selected by its intent.

## Where to edit

- `index.html` — permanent interface labels and layout.
- `styles.css` — visual design, spacing, colors and responsive rules.
- `conversations.js` — **all Russian dialogue, possible answers, translations, explanations, highlighted endings, and branch destinations**.
- `app.js` — shared speaking, listening, response recognition and UI behavior.
- `avatar-registry.js` — existing character identities and scenario participation reference. The six-conversation demo does not import it yet.

## Important limitations for review

- **Portraits:** These six avatars currently have labeled typographic stand-ins rather than realistic portrait photographs. Anna's photograph was not copied or misrepresented as another character. Portrait art is a separate integration step.
- **Conversations:** These are authored, finite branches, not unrestricted AI dialogue. Speech recognition is browser-dependent and not a pronunciation assessment. Some unlisted responses will not be recognized.
- **Speech voices:** Browser text-to-speech uses an available Russian voice; it does not yet assign distinct, natural male/female voices to the characters.
- **Review status:** Syntax and branch references were checked. Full interactive browser behavior and Russian teaching accuracy still require your review and testing.
- **Anna:** This ZIP does not overwrite Anna's working laboratory.

## Source-code readability

All code files are plain text, with line breaks and indentation. The ZIP is for packaging only; no HTML, CSS, or JavaScript is minified.
