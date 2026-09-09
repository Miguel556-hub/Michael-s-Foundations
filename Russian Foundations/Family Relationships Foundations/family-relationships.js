// ==================================================
// MICHAEL'S FOUNDATIONS
// Russian Foundations
// Greetings & Introductions — REMAKE
// ==================================================

console.log("Greetings & Introductions REMAKE connected!");


// ==================================================
// TEXT NORMALIZATION
// ==================================================

const normalize = (s) =>
    (s || "")
        .toLowerCase()
        .replace(/[.,!?;:«»"']/g, "")
        .replace(/\s+/g, " ")
        .trim();


// ==================================================
// RUSSIAN AUDIO — LISTEN BUTTONS
// ==================================================

function speakRussian(text) {

    if (!("speechSynthesis" in window)) {
        return;
    }

    speechSynthesis.cancel();

    const u = new SpeechSynthesisUtterance(text);

    u.lang = "ru-RU";
    u.rate = 0.86;

    const voices = speechSynthesis.getVoices();

    const ru = voices.find(
        (v) =>
            v.lang &&
            v.lang.toLowerCase().startsWith("ru")
    );

    if (ru) {
        u.voice = ru;
    }

    speechSynthesis.speak(u);
}


// Any button with class="listen" uses its data-speak value.
document.addEventListener("click", (e) => {

    const b = e.target.closest(".listen");

    if (b) {
        speakRussian(b.dataset.speak);
    }

});


// ==================================================
// SPEAKING PRACTICE — SAY IT BUTTONS
// ==================================================

const SR =
    window.SpeechRecognition ||
    window.webkitSpeechRecognition;

document.querySelectorAll(".say").forEach((btn) => {

    btn.addEventListener("click", () => {

        const originalButtonText = btn.textContent.trim();

        const container =
            btn.closest(".phrase-card") ||
            btn.parentElement;

        const heardBox =
            container?.querySelector(".speech-heard");

        const fb =
            container?.querySelector(".speech-feedback");

        if (!SR) {

            if (fb) {
                fb.textContent =
                    "Speaking practice is not available in this browser.";

                fb.className =
                    "speech-feedback bad";
            }

            return;
        }

        const r = new SR();

        r.lang = "ru-RU";
        r.interimResults = false;
        r.maxAlternatives = 3;

        btn.disabled = true;
        btn.textContent = "🎙️ Listening…";

        r.onresult = (ev) => {
            console.log("SAY IT RESULT:", ev.results[0][0].transcript);

            const heard =
                [...ev.results[0]].map(
                    (x) => x.transcript
                );

            const target =
                normalize(btn.dataset.target);

            const isPersonalName =
                target === normalize("Меня зовут");

            const ok =
                heard.some((x) => {

                    const recognized =
                        normalize(x);

                    if (isPersonalName) {
                        return recognized.includes(
                            normalize("Меня зовут")
                        );
                    }

                    return (
                        recognized.includes(target) ||
                        target.includes(recognized)
                    );

                });

            if (heardBox) {
                heardBox.textContent =
                    `I heard: ${heard[0]}`;
            }

            if (fb) {
                fb.textContent =
                    ok
                        ? "Well done!"
                        : "Not quite — listen and try again.";

                fb.className =
                    "speech-feedback " +
                    (ok ? "good" : "bad");
            }

        };

        r.onerror = (event) => {
            console.log("SAY IT ERROR:", event.error);

            if (fb) {

                fb.textContent =
                    "I couldn't hear that clearly. Check microphone permission and try again.";

                fb.className =
                    "speech-feedback bad";
            }

        };

        r.onend = () => {

            btn.disabled = false;

            btn.textContent = originalButtonText;

        };

        try {
            r.start();
        } catch { }

    });

});


// ==================================================
// CHOICE ACTIVITIES
// ==================================================

document.querySelectorAll(".choice-set").forEach((set) => {

    set.querySelectorAll("button").forEach((btn) => {

        btn.addEventListener("click", () => {

            set.querySelectorAll("button").forEach((x) => {
                x.classList.remove("selected");
            });

            btn.classList.add("selected");


            const fb =
                set.nextElementSibling;

            const ok =
                normalize(btn.textContent) ===
                normalize(set.dataset.answer);


            fb.textContent =
                ok
                    ? "Well done! That fits the situation."
                    : "Not quite. Think about what the situation is asking for.";

            fb.className =
                "feedback " +
                (ok ? "good" : "bad");

        });

    });

});


// ==================================================
// WORD BUILDERS
// ==================================================

document.querySelectorAll(".builder").forEach((builder) => {

    const answer =
        builder.querySelector(".builder__answer");

    const buttons =
        builder.querySelectorAll(".word-bank button");

    const selectedWords = [];

    const nameInput =
        builder.querySelector(".name-input");

    buttons.forEach((btn) => {

        btn.addEventListener("click", () => {

            const word =
                btn.textContent.trim();

            if (btn.classList.contains("selected")) {

                btn.classList.remove("selected");

                const wordIndex =
                    selectedWords.indexOf(word);

                if (wordIndex !== -1) {
                    selectedWords.splice(wordIndex, 1);
                }

            } else {

                btn.classList.add("selected");

                selectedWords.push(word);
            }

            const typedName =
                nameInput ? nameInput.value.trim() : "";

            answer.textContent =
                [selectedWords.join(" "), typedName]
                    .filter(Boolean)
                    .join(" ");

        });

    });

    if (nameInput) {

        nameInput.addEventListener("input", () => {

            const typedName =
                nameInput.value.trim();

            answer.textContent =
                [selectedWords.join(" "), typedName]
                    .filter(Boolean)
                    .join(" ");

        });

    }


    builder
        .querySelector(".check-builder")
        .addEventListener("click", () => {

            const fb =
                builder.querySelector(".feedback");

            const ok =
                builder.classList.contains("name-builder")
                    ? (
                        normalize(selectedWords.join(" ")) ===
                        normalize(builder.dataset.answer) &&
                        nameInput.value.trim() !== ""
                    )
                    : (
                        normalize(answer.textContent) ===
                        normalize(builder.dataset.answer)
                    );


            fb.textContent =
                ok
                    ? (
                        builder.classList.contains("name-builder")
                            ? "Excellent. Now add your own first name."
                            : "Excellent — you built it correctly."
                    )
                    : "Not quite. Look at the relationship and word order, then try again.";

            fb.className =
                "feedback " +
                (ok ? "good" : "bad");

        });

});


// ==================================================
// CONVERSATION BUILDERS
// ==================================================

document
    .querySelectorAll(".conversation-builder")
    .forEach((box) => {

        let active = null;

        const blanks =
            [...box.querySelectorAll(".blank")];

        const phrases =
            [...box.querySelectorAll(".phrase-bank button")];


        blanks.forEach((b) => {

            b.addEventListener("click", () => {

                active = b;

                blanks.forEach((x) => {
                    x.classList.remove("selected");
                });

                b.classList.add("selected");

            });

        });


        phrases.forEach((p) => {

            p.addEventListener("click", () => {

                if (!active) {

                    active =
                        blanks.find(
                            (b) =>
                                b.textContent.includes("_")
                        ) ||
                        blanks[0];

                }


                active.textContent =
                    p.textContent;

                active.classList.remove("selected");

                active = null;

            });

        });


        box
            .querySelector(".check-conversation")
            .addEventListener("click", () => {

                const expected =
                    box.dataset.answers
                        .split("|")
                        .map(normalize);

                const actual =
                    blanks.map(
                        (b) =>
                            normalize(b.textContent)
                    );

                const ok =
                    expected.every(
                        (x, i) =>
                            x === actual[i]
                    );

                const fb =
                    box.querySelector(".feedback");


                fb.textContent =
                    ok
                        ? "Excellent! The conversation fits together naturally."
                        : "Not quite. Check which phrase belongs in each turn.";

                fb.className =
                    "feedback " +
                    (ok ? "good" : "bad");

            });

    });


// ==================================================
// PRACTICE — CYRILLIC KEYBOARD
// ==================================================

// Define the Russian keyboard in three familiar Cyrillic rows.
const cyrillicRows = [
    ["Й", "Ц", "У", "К", "Е", "Н", "Г", "Ш", "Щ", "З", "Х", "Ъ"],
    ["Ф", "Ы", "В", "А", "П", "Р", "О", "Л", "Д", "Ж", "Э"],
    ["Я", "Ч", "С", "М", "И", "Т", "Ь", "Б", "Ю", "Ё"]
];

// Keep a flat copy of the letters for the current keyboard code.
const keys =
    cyrillicRows.flat();

document
    .querySelectorAll(".russian-keyboard")
    .forEach((kb) => {

        let target = null;

        document
            .querySelectorAll("input")
            .forEach((i) => {

                i.addEventListener("focus", () => {
                    target = i;
                });

            });

        // Build the three visible Cyrillic keyboard rows.
        cyrillicRows.forEach((row) => {

            const rowElement =
                document.createElement("div");

            rowElement.classList.add(
                "cyrillic-keyboard__row"
            );

            row.forEach((letter) => {

                const keyButton =
                    document.createElement("button");

                keyButton.type = "button";

                keyButton.classList.add(
                    "cyrillic-keyboard__key"
                );

                keyButton.textContent = letter;

                keyButton.addEventListener("mousedown", (e) => {
                    e.preventDefault();
                });

                keyButton.addEventListener("click", () => {

                    if (!target) {
                        return;
                    }

                    target.value +=
                        letter.toLowerCase();

                    target.focus();

                });

                rowElement.appendChild(keyButton);

            });

            kb.appendChild(rowElement);

        });

        // Build a separate keyboard-controls row.
        const controlsRow =
            document.createElement("div");

        controlsRow.classList.add(
            "cyrillic-keyboard__controls"
        );

        ["Back", "SPACE", "Clear"].forEach((label) => {

            const controlButton =
                document.createElement("button");

            controlButton.type = "button";

            controlButton.classList.add(
                "cyrillic-keyboard__control"
            );

            controlButton.textContent = label;

            // Same focus-protection the individual letter
            // keys already have above — without this, clicking
            // Back/SPACE/Clear blurs the input a moment before
            // the click itself runs, which can fire an input's
            // own blur-triggered checker too early.
            controlButton.addEventListener("mousedown", (e) => {
                e.preventDefault();
            });

            controlButton.addEventListener("click", () => {

                if (!target) {
                    return;
                }


                if (label === "SPACE") {

                    target.value += " ";

                } else if (label === "Back") {

                    target.value =
                        target.value.slice(0, -1);

                } else if (label === "Clear") {

                    target.value = "";

                }

                target.focus();

            });

            controlsRow.appendChild(controlButton);

        });


        kb.appendChild(controlsRow);

    });


// ==================================================
// PRACTICE ACTIVITY 1 — TYPE WHAT YOU KNOW
// Per-item checking: each row checks itself on
// blur or Enter. No batch "Check" button.
// ==================================================

document
    .querySelectorAll(".practice1-input")
    .forEach((input) => {

        const row =
            input.closest(".practice1-row");

        const fb =
            row?.querySelector(
                ".memory-response__feedback"
            );

        function checkRow() {

            if (!fb) {
                return;
            }

            if (!input.value.trim()) {

                fb.textContent = "";

                fb.classList.remove(
                    "memory-response__feedback--success",
                    "memory-response__feedback--try-again"
                );

                return;
            }

            const ok =
                normalize(input.value) ===
                normalize(input.dataset.answer);

            fb.textContent =
                ok
                    ? "Excellent! You remembered it."
                    : "Not quite — try again, or press Listen to hear it.";

            fb.classList.toggle(
                "memory-response__feedback--success",
                ok
            );

            fb.classList.toggle(
                "memory-response__feedback--try-again",
                !ok
            );

        }

        input.addEventListener("blur", checkRow);

        input.addEventListener("keydown", (e) => {

            if (e.key === "Enter") {

                e.preventDefault();
                checkRow();

            }

        });

    });


// ==================================================
// PRACTICE ACTIVITY 3 — ESCALATING SAY-IT FEEDBACK
// The shared .say handler above (used by Build too)
// always shows the same "Not quite" message. Activity
// 3's Outline calls for a different message on the
// 2nd+ miss. Rather than change that shared handler —
// which would also change Build's already-approved
// wording — this watches each row's own feedback text
// and swaps the wording in afterward, only inside
// Activity 3. Build is never touched.
// ==================================================

document
    .querySelectorAll("#practice-3 .say")
    .forEach((btn) => {

        const container =
            btn.closest(".phrase-card") ||
            btn.parentElement;

        const fb =
            container?.querySelector(".speech-feedback");

        if (!fb) {
            return;
        }

        let missCount = 0;

        const watchFeedback = new MutationObserver(() => {

            if (fb.classList.contains("good")) {

                missCount = 0;
                return;
            }

            if (fb.classList.contains("bad")) {

                missCount++;

                fb.textContent =
                    missCount === 1
                        ? "Not quite — try again."
                        : "Still not quite — press Listen and try repeating it.";

            }

        });

        watchFeedback.observe(fb, {
            attributes: true,
            attributeFilter: ["class"],
            childList: true
        });

    });


// ==================================================
// PRACTICE — MATCH WHAT YOU KNOW
// ==================================================

const pairs = [
    ["Это мой брат.", "This is my brother."],
    ["Это моя сестра.", "This is my sister."],
    ["Это моя мама и мой папа.", "This is my mom and my dad."],
    ["Это не мой брат, но это моя сестра.", "That's not my brother, but that's my sister."],
    ["Это мои родители.", "These are my parents."],
    ["Это моё имя.", "This is my name."],
    ["Это моя мать.", "This is my mother."],
    ["Это мой отец.", "This is my father."],
    ["Это моя семья.", "This is my family."]
];


const ru =
    document.querySelector(".match-col.russian");

const en =
    document.querySelector(".match-col.english");

let selected = null;
let matched = 0;


function shuffle(a) {

    return [...a].sort(
        () =>
            Math.random() - 0.5
    );

}


function buildMatch() {

    if (!ru) {
        return;
    }


    ru.innerHTML = "";
    en.innerHTML = "";

    selected = null;
    matched = 0;


    shuffle(pairs).forEach(([r]) => {

        // Each Russian card is now a phrase button plus its
        // own always-on Listen button, wrapped together so
        // the two can sit side by side.
        const item =
            document.createElement("div");

        item.className = "match-item";

        const b =
            document.createElement("button");

        b.type = "button";
        b.textContent = r;
        b.dataset.key = r;


        b.onclick = () => {

            if (
                b.classList.contains("matched")
            ) {
                return;
            }


            ru
                .querySelectorAll(".active")
                .forEach((x) => {

                    x.classList.remove("active");

                });


            b.classList.add("active");
            selected = b;

        };

        const listenButton =
            document.createElement("button");

        listenButton.type = "button";
        listenButton.className = "listen";
        listenButton.dataset.speak = r;
        listenButton.textContent = "🔊";

        item.append(b, listenButton);

        ru.appendChild(item);

    });


    shuffle(pairs).forEach(([r, e]) => {

        const b =
            document.createElement("button");

        b.textContent = e;
        b.dataset.key = r;


        b.onclick = () => {

            if (
                !selected ||
                b.classList.contains("matched")
            ) {
                return;
            }


            const fb =
                document.querySelector(
                    "#practice-2 .feedback"
                );


            if (
                selected.dataset.key ===
                b.dataset.key
            ) {

                selected.classList.add("matched");
                b.classList.add("matched");

                selected.classList.remove("active");

                selected = null;
                matched++;


                fb.textContent =
                    matched === pairs.length
                        ? "Excellent — every pair is matched!"
                        : "Correct match.";

                fb.className =
                    "feedback good";

            } else {

                fb.textContent =
                    "Not quite — try another meaning.";

                fb.className =
                    "feedback bad";

            }

        };


        en.appendChild(b);

    });

}


buildMatch();


document
    .querySelector(".reset-match")
    ?.addEventListener("click", () => {

        // Rebuild and reshuffle the matching activity.
        buildMatch();

        // Clear feedback from the previous attempt.
        const feedback =
            document.querySelector("#practice-2 .feedback");

        if (feedback) {
            feedback.textContent = "";
            feedback.className = "feedback";
        }

    });


// ==================================================
// JOURNEY RAIL — PROGRESS COUNTS
// ==================================================

function updateProgress() {

    const lessons =
        [
            ...document.querySelectorAll(
                ".lesson-complete"
            )
        ].filter(
            (x) => x.checked
        ).length;


    const practice =
        [
            ...document.querySelectorAll(
                ".practice-complete"
            )
        ].filter(
            (x) => x.checked
        ).length;


    const passes =
        [
            ...document.querySelectorAll(
                ".pass-complete"
            )
        ].filter(
            (x) => x.checked
        ).length;


    document.querySelector(
        "#lesson-progress-count"
    ).textContent =
        `${lessons}/3`;


    document.querySelector(
        "#practice-progress-count"
    ).textContent =
        `${practice}/3`;


    document.querySelector(
        "#pass-progress-count"
    ).textContent =
        `${passes}/3`;

    // Show or remove Journey Rail completion checkmarks.
    document.querySelectorAll(".lesson-complete").forEach((box) => {

        const link = document.querySelector(
            `.journey-rail a[href="#lesson-${box.dataset.lesson}"]`
        );

        const check = link?.querySelector(".journey-check");

        if (check) {
            check.textContent = box.checked ? "✓" : "";
        }

    });

    document.querySelectorAll(".practice-complete").forEach((box) => {

        const link = document.querySelector(
            `.journey-rail a[href="#practice-${box.dataset.practice}"]`
        );

        const check = link?.querySelector(".journey-check");

        if (check) {
            check.textContent = box.checked ? "✓" : "";
        }

    });

    document.querySelectorAll(".pass-complete").forEach((box) => {

        const link = document.querySelector(
            `.journey-rail a[href="#pass-${box.dataset.pass}"]`
        );

        const check = link?.querySelector(".journey-check");

        if (check) {
            check.textContent = box.checked ? "✓" : "";
        }

    });

    document.querySelectorAll(".variation-complete").forEach((box) => {
        const link = document.querySelector(
            `.journey-rail a[href="#variation-${box.dataset.variation}"]`
        );
        const check = link?.querySelector(".journey-check");
        if (check) {
            check.textContent = box.checked ? "✓" : "";
        }
    });

}

document
    .querySelectorAll(
        ".lesson-complete,.practice-complete,.variation-complete,.pass-complete"
    )
    .forEach((x) => {

        x.addEventListener(
            "change",
            updateProgress
        );

    });

updateProgress();

// ==================================================
// STAGE TABS + JOURNEY RAIL — SCROLL TRACKING
// ==================================================

const banners =
    [
        ...document.querySelectorAll(
            ".phase-banner"
        )
    ];

const tabs =
    [
        ...document.querySelectorAll(
            ".stage-tab"
        )
    ];

const rail =
    [
        ...document.querySelectorAll(
            ".journey-rail__section[data-stage]"
        )
    ];


function setStage(name) {

    tabs.forEach((t) => {

        t.classList.toggle(
            "stage-tab--active",
            t.dataset.stage === name
        );

    });


    rail.forEach((r) => {

        r.classList.toggle(
            "journey-rail__section--current",
            r.dataset.stage === name
        );

    });

}


function track() {

    const point =
        window.innerHeight * 0.35;

    let current =
        "learn";


    banners.forEach((b) => {

        if (
            b.getBoundingClientRect().top <=
            point
        ) {

            current =
                b
                    .closest(".learning-stage")
                    .dataset.stage;

        }

    });


    setStage(current);

}


window.addEventListener(
    "scroll",
    track,
    {
        passive: true
    }
);


track();


// ==================================================
// RIGHT-SIDE STAGE TABS — CLICK NAVIGATION
// ==================================================

tabs.forEach((t) => {

    t.addEventListener("click", () => {

        document
            .querySelector(
                `#${t.dataset.stage}-banner`
            )
            ?.scrollIntoView(
                {
                    behavior: "smooth",
                    block: "start"
                }
            );

    });

});



// ==================================================
// USE — FAMILY TREE PUZZLE — STAGE 1: IMMEDIATE FAMILY
// REVEAL THE EVIDENCE -> SOLVE THE RELATIONSHIP -> PROVE YOU UNDERSTAND THE TREE
// Click-to-fill word bank — no typing, so spelling and Cyrillic input
// are never the obstacle. The reasoning is still the whole exercise.
// ==================================================

(() => {

    const stage =
        document.querySelector("#variation-1");

    if (!stage) {
        return;
    }

    const boxes =
        [...stage.querySelectorAll(".tree-box")];

    const challenge =
        stage.querySelector("#tree-1-challenge");

    const completeCheckbox =
        stage.querySelector("#tree-1-complete-checkbox");

    const bankRoot =
        stage.querySelector("#tree-1-word-bank");


    function shuffle(arr) {

        for (let i = arr.length - 1; i > 0; i--) {

            const j =
                Math.floor(Math.random() * (i + 1));

            [arr[i], arr[j]] = [arr[j], arr[i]];

        }

        return arr;

    }


    // Every real piece the tree needs, each paired with a distractor that
    // looks right but isn't — either a real Russian word one letter off
    // (мать/мат, брат/брать), or a spelling that breaks an actual rule
    // (младшый instead of младший). Both flavors train close reading,
    // not just recall.
    const PIECES =
        ["отец", "отес", "мать", "мат", "брат", "брать", "сестра", "сестора",
            "старший", "старшый", "младший", "младшый",
            "старшая", "старшыя", "младшая", "младшыя",
            "мой", "моя"];


    // Set once Stage 1's boxes are all solved — while it's non-null, bank
    // clicks route to the Кто это? challenge instead of to a tree box.
    let challengeHandler = null;

    let activeBox = null;


    // A bank click either fills the current target's next open blank
    // (correct), does nothing (the piece is already satisfied there — no
    // penalty for a redundant click), or counts as a wrong attempt.
    function handleBankClick(word) {

        if (challengeHandler) {
            challengeHandler(word);
            return;
        }

        if (!activeBox) {
            return;
        }

        const blanks =
            blanksOf(activeBox);

        const openBlank =
            blanks.find(
                (b) => !b.classList.contains("is-filled") && b.dataset.accept === word
            );

        if (openBlank) {

            openBlank.textContent = word;
            openBlank.classList.add("is-filled");

            if (isBoxSolved(activeBox)) {
                lockBoxSolved(activeBox);
            }

            return;

        }

        const alreadySatisfied =
            blanks.some(
                (b) => b.classList.contains("is-filled") && b.dataset.accept === word
            );

        if (alreadySatisfied) {
            return;
        }

        registerWrongAttempt(activeBox);

    }


    // ---- Build the shared word bank (shuffled once per page load) ----

    shuffle([...PIECES]).forEach((word) => {

        const button =
            document.createElement("button");

        button.type = "button";
        button.dataset.value = word;
        button.textContent = word;

        button.addEventListener("click", () => {
            handleBankClick(word);
        });

        bankRoot.appendChild(button);

    });


    function blanksOf(box) {
        return [...box.querySelectorAll(".use-blank")];
    }


    function isBoxSolved(box) {
        return blanksOf(box).every((b) => b.classList.contains("is-filled"));
    }


    // The full tree is visible from the start (every box shows its clue),
    // but only one box at a time accepts clicks. The order is randomized
    // on every load — since all the clues are already on screen, the order
    // solved doesn't change what there is to understand.
    const order =
        shuffle([...boxes]);

    let current = 0;


    function activateNext() {

        if (current >= order.length) {

            activeBox = null;
            startChallenge();
            return;

        }

        activeBox = order[current];

        activeBox.classList.remove("tree-box--pending");
        activeBox.classList.add("tree-box--active");

    }


    function lockBoxSolved(box) {

        box.classList.remove("tree-box--active");
        box.classList.add("tree-box--solved");

        box.querySelector(".tree-box__help").hidden = true;
        box.querySelector(".feedback").textContent = "";

        current++;
        activateNext();

    }


    function registerWrongAttempt(box) {

        const attempts =
            Number(box.dataset.attempts) + 1;

        box.dataset.attempts = String(attempts);

        const feedback =
            box.querySelector(".feedback");

        feedback.textContent =
            "Not quite — try again.";

        feedback.className =
            "feedback bad";

        if (attempts >= 2) {
            box.querySelector(".tree-box__help").hidden = false;
        }

    }


    boxes.forEach((box) => {

        box.classList.add("tree-box--pending");
        box.dataset.attempts = "0";

        box.querySelector(".tree-box__hint")
            ?.addEventListener("click", () => {

                const feedback =
                    box.querySelector(".feedback");

                feedback.textContent =
                    box.dataset.hint || "";

                feedback.className =
                    "feedback hint";

            });

        box.querySelector(".tree-box__escape")
            ?.addEventListener("click", () => {

                blanksOf(box).forEach((blank) => {

                    if (!blank.classList.contains("is-filled")) {
                        blank.textContent = blank.dataset.accept;
                        blank.classList.add("is-filled");
                    }

                });

                lockBoxSolved(box);

            });

    });


    activateNext();


    // ==================================================
    // "PROVE YOU UNDERSTAND THE TREE" — Кто это?
    // Runs once, after every box in this Stage is solved.
    // Reuses the same word bank — no typing here either.
    // ==================================================

    // One masculine example and one feminine example, every time — so the
    // learner always practices both мой and моя, instead of leaving it to
    // chance which gender a single random pick would land on. Which one
    // comes first is still randomized.
    function startChallenge() {

        challenge.hidden = false;

        const masculine =
            boxes.filter((b) => b.dataset.possessive === "мой");

        const feminine =
            boxes.filter((b) => b.dataset.possessive === "моя");

        const pickOne =
            (list) => list[Math.floor(Math.random() * list.length)];

        const targets =
            shuffle([pickOne(masculine), pickOne(feminine)]);

        let round = 0;


        function runRound() {

            const target =
                targets[round];

            round++;

            challenge.querySelector("#tree-1-round").textContent =
                `Question ${round} of ${targets.length}`;

            const targetClue =
                target.querySelector(".tree-box__clue").textContent;

            challenge.querySelector("#tree-1-target").textContent =
                `→ ${targetClue}`;

            const possessive =
                target.dataset.possessive;

            const phraseWords =
                blanksOf(target).map((b) => b.dataset.accept);

            const blanksHost =
                challenge.querySelector("#tree-1-challenge-blanks");

            blanksHost.innerHTML = "";

            function makeBlank(accept) {

                const blank =
                    document.createElement("button");

                blank.type = "button";
                blank.className = "use-blank";
                blank.dataset.accept = accept;
                blank.textContent = "______";

                blanksHost.appendChild(blank);

                return blank;

            }

            const possBlank =
                makeBlank(possessive);

            const phraseBlanks =
                phraseWords.map(makeBlank);

            const challengeBlanks =
                [possBlank, ...phraseBlanks];

            const feedback =
                challenge.querySelector(".feedback");

            const help =
                challenge.querySelector(".tree-challenge__help");

            feedback.textContent = "";
            feedback.className = "feedback";
            help.hidden = true;

            let attempts = 0;


            function checkComplete() {

                if (!challengeBlanks.every((b) => b.classList.contains("is-filled"))) {
                    return;
                }

                help.hidden = true;

                if (round < targets.length) {

                    feedback.textContent =
                        "Right! Now the other one.";

                    feedback.className =
                        "feedback good";

                    runRound();
                    return;

                }

                feedback.textContent =
                    "That's right!";

                feedback.className =
                    "feedback good";

                challengeHandler = null;

                if (completeCheckbox) {
                    completeCheckbox.checked = true;
                    completeCheckbox.dispatchEvent(new Event("change"));
                }

            }


            challengeHandler = (word) => {

                const openBlank =
                    challengeBlanks.find(
                        (b) => !b.classList.contains("is-filled") && b.dataset.accept === word
                    );

                if (openBlank) {

                    openBlank.textContent = word;
                    openBlank.classList.add("is-filled");

                    checkComplete();
                    return;

                }

                const alreadySatisfied =
                    challengeBlanks.some(
                        (b) => b.classList.contains("is-filled") && b.dataset.accept === word
                    );

                if (alreadySatisfied) {
                    return;
                }

                attempts++;

                feedback.textContent =
                    "Not quite — try again.";

                feedback.className =
                    "feedback bad";

                if (attempts >= 2) {
                    help.hidden = false;
                }

            };


            // .onclick (not addEventListener) — these buttons are static
            // and reused every round, so this replaces last round's
            // handler instead of stacking a new one on top of it.
            help.querySelector(".tree-challenge__hint").onclick = () => {

                const genderWord =
                    possessive === "мой" ? "masculine" : "feminine";

                feedback.textContent =
                    `Hint: “${phraseWords.join(" ")}” is ${genderWord} — that decides мой or моя.`;

                feedback.className =
                    "feedback hint";

            };

            help.querySelector(".tree-challenge__escape").onclick = () => {

                challengeBlanks.forEach((blank) => {

                    if (!blank.classList.contains("is-filled")) {
                        blank.textContent = blank.dataset.accept;
                        blank.classList.add("is-filled");
                    }

                });

                checkComplete();

            };

        }

        runRound();

    }

})();



// ==================================================
// USE — VARIATION 2: THE LISTENING ROOM
// PART A — LISTEN AND FIND THE MEANING
// ==================================================

(() => {

    const root =
        document.querySelector("#variation-2");

    if (!root) {
        return;
    }

    const listeningItems = [
        {
            russian: "Как вас зовут",
            meaning: "What is your name",
            choices: [
                "What is your name",
                "How are you doing",
                "My name is Michael",
                "See you later"
            ]
        },

        {
            russian: "Меня зовут Майкл",
            meaning: "My name is Michael",
            choices: [
                "My name is Michael",
                "What is your name",
                "Nice to meet you",
                "Good morning"
            ]
        },

        {
            russian: "Доброе утро",
            meaning: "Good morning",
            choices: [
                "Good morning",
                "See you tomorrow",
                "Hello",
                "How are you doing"
            ]
        },

        {
            russian: "Увидимся",
            meaning: "See you later",
            choices: [
                "See you later",
                "See you tomorrow",
                "Goodbye",
                "Very nice to meet you"
            ]
        },

        {
            russian: "Очень приятно",
            meaning: "Very nice to meet you",
            choices: [
                "Very nice to meet you",
                "Nice to meet you",
                "My name is Michael",
                "How are you doing"
            ]
        },

        {
            russian: "До завтра",
            meaning: "See you tomorrow",
            choices: [
                "See you tomorrow",
                "See you later",
                "Goodbye",
                "Good morning"
            ]
        }
    ];

    let currentIndex = 0;
    let hasListened = false;

    const playButton =
        root.querySelector(".listening-play");

    const stage =
        root.querySelector(".listening-stage");

    const note =
        root.querySelector(".listening-stage__note");

    const progressText =
        root.querySelector("#listening-round-label");

    const progressFill =
        root.querySelector("#listening-progress-fill");

    let choicesBox =
        root.querySelector(".listening-choices");

    let revealBox =
        root.querySelector(".listening-reveal");


    function speakCurrentPhrase() {

        const item =
            listeningItems[currentIndex];

        speakRussian(item.russian);

        hasListened = true;

        showChoices();
    }


    function showChoices() {

        if (!choicesBox) {

            choicesBox =
                document.createElement("div");

            choicesBox.className =
                "listening-choices";

            stage.after(choicesBox);
        }

        choicesBox.innerHTML = "";
        choicesBox.hidden = false;

        const shuffled =
            [...listeningItems[currentIndex].choices]
                .sort(() => Math.random() - 0.5);

        shuffled.forEach((choiceText) => {

            const button =
                document.createElement("button");

            button.type = "button";

            button.className =
                "listening-choice";

            button.textContent =
                choiceText;

            button.addEventListener(
                "click",
                () => checkChoice(button, choiceText)
            );

            choicesBox.appendChild(button);
        });
    }


    function checkChoice(button, choiceText) {

        if (!hasListened) {
            return;
        }

        const item =
            listeningItems[currentIndex];

        if (
            normalize(choiceText) ===
            normalize(item.meaning)
        ) {

            button.classList.add(
                "listening-choice--correct"
            );

            showReveal();

        } else {

            button.classList.add(
                "listening-choice--try-again"
            );

            note.textContent =
                "Listen again and try another meaning";
        }
    }


    function showReveal() {

        const item =
            listeningItems[currentIndex];

        if (!revealBox) {

            revealBox =
                document.createElement("div");

            revealBox.className =
                "listening-reveal";

            choicesBox.after(revealBox);
        }

        revealBox.hidden = false;

        revealBox.innerHTML = `
            <div class="listening-reveal__label">
                What you heard
            </div>

            <p class="listening-reveal__russian">
                ${item.russian}
            </p>

            <p class="listening-reveal__meaning">
                ${item.meaning}
            </p>

            <div class="listening-reveal__actions">

                <button
                    type="button"
                    class="listening-hear-again"
                >
                    🔊 Hear It Again
                </button>

                <button
                    type="button"
                    class="listening-next"
                >
                    Next
                </button>

            </div>
        `;

        revealBox
            .querySelector(".listening-hear-again")
            .addEventListener("click", () => {

                speakRussian(item.russian);

            });

        revealBox
            .querySelector(".listening-next")
            .addEventListener("click", () => {

                moveNext();

            });

        note.textContent =
            "You understood it";
    }


    function moveNext() {

        if (
            currentIndex <
            listeningItems.length - 1
        ) {

            currentIndex++;

            hasListened = false;

            choicesBox.innerHTML = "";

            if (revealBox) {
                revealBox.innerHTML = "";
            }

            note.textContent =
                "The Russian is hidden";

            updateProgress();

        } else {

            finishPartA();
        }
    }


    function updateProgress() {

        if (progressText) {

            progressText.textContent =
                `Listen ${currentIndex + 1} of ${listeningItems.length}`;
        }

        if (progressFill) {

            progressFill.style.width =
                `${((currentIndex + 1) /
                    listeningItems.length) * 100
                }%`;
        }
    }


    function finishPartA() {

        if (choicesBox) {
            choicesBox.innerHTML = "";
        }

        if (revealBox) {

            revealBox.innerHTML = `
                <div class="listening-complete">

                    <h4>
                        You understood spoken Russian
                    </h4>

                    <p>
                        You listened without seeing the Russian first
                    </p>

                </div>
            `;
        }

        note.textContent = "";

        playButton.disabled = true;

        playButton.textContent =
            "Part A Complete";

        const partB =
            document.querySelector("#variation-2-part-b");

        if (partB) {
            partB.hidden = false;
            partB.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });
        }
    }


    const resetPartAButton =
        root.querySelector("#listening-reset-part-a");

    function resetPartA() {

        speechSynthesis.cancel();

        currentIndex = 0;
        hasListened = false;

        if (choicesBox) {
            choicesBox.innerHTML = "";
            choicesBox.hidden = true;
        }

        if (revealBox) {
            revealBox.innerHTML = "";
            revealBox.hidden = true;
        }

        note.textContent =
            "The Russian is hidden";

        playButton.disabled = false;
        playButton.textContent =
            "Hear the Russian";

        updateProgress();

        root.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });
    }

    resetPartAButton
        ?.addEventListener(
            "click",
            resetPartA
        );


    playButton
        ?.addEventListener(
            "click",
            speakCurrentPhrase
        );

    updateProgress();

})();

// ==================================================
// USE — VARIATION 2: THE LISTENING ROOM
// PART B — READ THE SITUATION AND CHOOSE THE RUSSIAN
// ==================================================

(() => {

    const root =
        document.querySelector("#variation-2-part-b");

    if (!root) {
        return;
    }

    const situationItems = [
        {
            situation: "You meet someone for the first time and want to ask their name",
            russian: "Как вас зовут",
            meaning: "What is your name",
            choices: [
                "Как вас зовут",
                "Меня зовут Майкл",
                "Как дела",
                "Очень приятно"
            ]
        },
        {
            situation: "Someone asks your name and you want to introduce yourself",
            russian: "Меня зовут Майкл",
            meaning: "My name is Michael",
            choices: [
                "Меня зовут Майкл",
                "Как вас зовут",
                "Доброе утро",
                "До завтра"
            ]
        },
        {
            situation: "You want to ask someone how they are doing",
            russian: "Как дела",
            meaning: "How are you doing",
            choices: [
                "Как дела",
                "Очень приятно",
                "Увидимся",
                "Нормально"
            ]
        },
        {
            situation: "Someone tells you their name and you want to respond warmly",
            russian: "Очень приятно",
            meaning: "Very nice to meet you",
            choices: [
                "Очень приятно",
                "Как дела",
                "До завтра",
                "Меня зовут Майкл"
            ]
        },
        {
            situation: "You are leaving and expect to see the person again later",
            russian: "Увидимся",
            meaning: "See you later",
            choices: [
                "Увидимся",
                "Доброе утро",
                "Как вас зовут",
                "Неплохо"
            ]
        },
        {
            situation: "You are leaving and know you will see the person tomorrow",
            russian: "До завтра",
            meaning: "See you tomorrow",
            choices: [
                "До завтра",
                "Увидимся",
                "До свидания",
                "Доброе утро"
            ]
        }
    ];

    let currentIndex = 0;
    let roundComplete = false;

    const prompt =
        root.querySelector("#situation-prompt");

    const choicesBox =
        root.querySelector("#situation-choices");

    const feedback =
        root.querySelector("#situation-feedback");

    const reveal =
        root.querySelector("#situation-reveal");

    const revealRussian =
        root.querySelector("#situation-reveal-russian");

    const revealMeaning =
        root.querySelector("#situation-reveal-meaning");

    const hearButton =
        root.querySelector("#situation-hear");

    const nextButton =
        root.querySelector("#situation-next");

    const progressText =
        root.querySelector("#situation-round-label");

    const progressFill =
        root.querySelector("#situation-progress-fill");

    const completeBox =
        root.querySelector("#situation-complete");


    function shuffled(items) {
        return [...items].sort(
            () => Math.random() - 0.5
        );
    }


    function renderRound() {

        const item =
            situationItems[currentIndex];

        roundComplete = false;

        prompt.textContent =
            item.situation;

        feedback.textContent = "";

        reveal.hidden = true;

        choicesBox.innerHTML = "";

        shuffled(item.choices).forEach((choiceText) => {

            const button =
                document.createElement("button");

            button.type = "button";

            button.className =
                "situation-choice";

            button.textContent =
                choiceText;

            button.addEventListener(
                "click",
                () => checkChoice(button, choiceText)
            );

            choicesBox.appendChild(button);
        });

        updateProgress();
    }


    function checkChoice(button, choiceText) {

        if (roundComplete) {
            return;
        }

        const item =
            situationItems[currentIndex];

        if (
            normalize(choiceText) ===
            normalize(item.russian)
        ) {

            roundComplete = true;

            button.classList.add(
                "situation-choice--correct"
            );

            choicesBox
                .querySelectorAll("button")
                .forEach((choiceButton) => {
                    choiceButton.disabled = true;
                });

            feedback.textContent =
                "That Russian fits the situation";

            showReveal();

        } else {

            button.classList.add(
                "situation-choice--try-again"
            );

            feedback.textContent =
                "Think about what you would say in this situation and try another choice";
        }
    }


    function showReveal() {

        const item =
            situationItems[currentIndex];

        revealRussian.textContent =
            item.russian;

        revealMeaning.textContent =
            item.meaning;

        reveal.hidden = false;

        nextButton.textContent =
            currentIndex === situationItems.length - 1
                ? "Finish Part B"
                : "Next situation";
    }


    function moveNext() {

        if (!roundComplete) {
            return;
        }

        if (
            currentIndex <
            situationItems.length - 1
        ) {

            currentIndex++;

            renderRound();

            root.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });

        } else {

            finishPartB();
        }
    }


    function updateProgress() {

        progressText.textContent =
            `Situation ${currentIndex + 1} of ${situationItems.length}`;

        progressFill.style.width =
            `${((currentIndex + 1) /
                situationItems.length) * 100
            }%`;
    }


    function finishPartB() {

        choicesBox.innerHTML = "";

        feedback.textContent = "";

        reveal.hidden = true;

        completeBox.hidden = false;

        prompt.textContent =
            "Part B Complete";

        const partC =
            document.querySelector("#variation-2-part-c");

        if (partC) {
            partC.hidden = false;
            partC.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });
        }
    }


    hearButton.addEventListener(
        "click",
        () => {
            speakRussian(
                situationItems[currentIndex].russian
            );
        }
    );


    nextButton.addEventListener(
        "click",
        moveNext
    );


    const resetPartBButton =
        root.querySelector("#listening-reset-part-b");

    const backToPartAButton =
        root.querySelector("#listening-back-to-part-a");


    function resetPartB() {

        currentIndex = 0;
        roundComplete = false;

        completeBox.hidden = true;
        reveal.hidden = true;

        renderRound();

        root.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });
    }


    resetPartBButton
        ?.addEventListener(
            "click",
            resetPartB
        );


    backToPartAButton
        ?.addEventListener(
            "click",
            () => {

                document
                    .querySelector("#variation-2-part-a")
                    ?.scrollIntoView({
                        behavior: "smooth",
                        block: "start"
                    });
            }
        );


    renderRound();

})();


// ==================================================
// USE — VARIATION 2: THE LISTENING ROOM
// PART C — HEAR THE CONVERSATION
// ==================================================

(() => {

    const root =
        document.querySelector("#variation-2-part-c");

    if (!root) {
        return;
    }

    const conversations = [
        {
            lines: [
                { speaker: "a", russian: "Здравствуйте" },
                { speaker: "b", russian: "Как вас зовут" },
                { speaker: "a", russian: "Меня зовут Майкл" },
                { speaker: "b", russian: "Очень приятно" }
            ],
            meaning:
                "Hello What is your name My name is Michael Very nice to meet you",
            concepts: [
                ["hello", "hi", "greetings"],
                ["name"],
                ["michael"],
                ["nice", "meet"]
            ]
        },
        {
            lines: [
                { speaker: "a", russian: "Привет" },
                { speaker: "b", russian: "Как дела" },
                { speaker: "a", russian: "Хорошо спасибо" },
                { speaker: "a", russian: "А у вас" },
                { speaker: "b", russian: "Отлично" }
            ],
            meaning:
                "Hi How are you Good thank you And you Excellent",
            concepts: [
                ["hello", "hi"],
                ["how are", "doing"],
                ["good", "well"],
                ["thank"],
                ["and you", "you"],
                ["excellent", "great"]
            ]
        },
        {
            lines: [
                { speaker: "a", russian: "Доброе утро" },
                { speaker: "b", russian: "Как вас зовут" },
                { speaker: "a", russian: "Меня зовут Майкл" },
                { speaker: "b", russian: "Очень приятно" },
                { speaker: "a", russian: "Как дела" },
                { speaker: "b", russian: "Неплохо" },
                { speaker: "a", russian: "До завтра" }
            ],
            meaning:
                "Good morning What is your name My name is Michael Very nice to meet you How are you Not bad See you tomorrow",
            concepts: [
                ["morning"],
                ["name"],
                ["michael"],
                ["nice", "meet"],
                ["how are", "doing"],
                ["not bad", "okay"],
                ["tomorrow"]
            ]
        }
    ];

    let currentIndex = 0;
    let hasPlayed = false;
    let submitted = false;
    let playToken = 0;

    const progressText =
        root.querySelector("#conversation-round-label");

    const progressFill =
        root.querySelector("#conversation-progress-fill");

    const playButton =
        root.querySelector("#conversation-play");

    const audioNote =
        root.querySelector("#conversation-audio-note");

    const input =
        root.querySelector("#conversation-understanding");

    const checkButton =
        root.querySelector("#conversation-check");

    const feedback =
        root.querySelector("#conversation-feedback");

    const reveal =
        root.querySelector("#conversation-reveal");

    const transcript =
        root.querySelector("#conversation-transcript");

    const meaning =
        root.querySelector("#conversation-meaning");

    const learnerText =
        root.querySelector("#conversation-you");

    const hearAgain =
        root.querySelector("#conversation-hear-again");

    const nextButton =
        root.querySelector("#conversation-next");

    const completeBox =
        root.querySelector("#conversation-complete");

    const speakerA =
        root.querySelector("#conversation-speaker-a");

    const speakerB =
        root.querySelector("#conversation-speaker-b");

    const resetButton =
        root.querySelector("#listening-reset-part-c");

    const backButton =
        root.querySelector("#listening-back-to-part-b");


    function updateProgress() {

        progressText.textContent =
            `Conversation ${currentIndex + 1} of ${conversations.length}`;

        progressFill.style.width =
            `${((currentIndex + 1) / conversations.length) * 100}%`;
    }


    function clearSpeakerLights() {

        speakerA.classList.remove(
            "conversation-speaker--active"
        );

        speakerB.classList.remove(
            "conversation-speaker--active"
        );
    }


    function getRussianVoices() {

        const voices =
            window.speechSynthesis?.getVoices?.() || [];

        return voices.filter(
            (voice) =>
                voice.lang &&
                voice.lang.toLowerCase().startsWith("ru")
        );
    }


    function playConversation() {

        if (!("speechSynthesis" in window)) {

            audioNote.textContent =
                "Conversation audio is not available in this browser";

            return;
        }

        speechSynthesis.cancel();

        const token = ++playToken;
        const item = conversations[currentIndex];
        const russianVoices = getRussianVoices();

        hasPlayed = true;

        playButton.disabled = true;
        playButton.textContent =
            "Listening";

        audioNote.textContent =
            "Listen for the whole meaning";

        let lineIndex = 0;

        const speakNextLine = () => {

            if (
                token !== playToken ||
                lineIndex >= item.lines.length
            ) {

                clearSpeakerLights();

                playButton.disabled = false;
                playButton.innerHTML =
                    "<span aria-hidden='true'>▶</span> Play the Conversation";

                audioNote.textContent =
                    "Type what the whole exchange meant to you";

                return;
            }

            const line = item.lines[lineIndex];

            clearSpeakerLights();

            const activeSpeaker =
                line.speaker === "a"
                    ? speakerA
                    : speakerB;

            activeSpeaker.classList.add(
                "conversation-speaker--active"
            );

            const utterance =
                new SpeechSynthesisUtterance(
                    line.russian
                );

            utterance.lang = "ru-RU";
            utterance.rate = 0.86;

            if (russianVoices.length > 1) {

                utterance.voice =
                    line.speaker === "a"
                        ? russianVoices[0]
                        : russianVoices[1];

            } else if (russianVoices.length === 1) {

                utterance.voice =
                    russianVoices[0];

                utterance.pitch =
                    line.speaker === "a"
                        ? 0.95
                        : 1.08;
            }

            utterance.onend = () => {

                lineIndex++;

                setTimeout(
                    speakNextLine,
                    260
                );
            };

            utterance.onerror = () => {

                lineIndex++;

                setTimeout(
                    speakNextLine,
                    120
                );
            };

            speechSynthesis.speak(
                utterance
            );
        };

        speakNextLine();
    }


    function conceptScore(text, concepts) {

        const normalized =
            normalize(text);

        let hits = 0;

        concepts.forEach((group) => {

            if (
                group.some(
                    (word) =>
                        normalized.includes(
                            normalize(word)
                        )
                )
            ) {
                hits++;
            }
        });

        return hits / concepts.length;
    }


    function buildTranscript(lines) {

        return lines
            .map(
                (line) =>
                    `<div class="conversation-transcript__line">
                        <span>${line.speaker === "a" ? "A" : "B"}</span>
                        <strong>${line.russian}</strong>
                    </div>`
            )
            .join("");
    }


    function checkUnderstanding() {

        const response =
            input.value.trim();

        if (!hasPlayed) {

            feedback.textContent =
                "Listen to the conversation first";

            feedback.className =
                "conversation-feedback conversation-feedback--notice";

            return;
        }

        if (!response) {

            feedback.textContent =
                "Tell us what you understood in your own words";

            feedback.className =
                "conversation-feedback conversation-feedback--notice";

            input.focus();

            return;
        }

        submitted = true;

        const item =
            conversations[currentIndex];

        const score =
            conceptScore(
                response,
                item.concepts
            );

        if (score >= 0.65) {

            feedback.textContent =
                "You caught the heart of the conversation";

            feedback.className =
                "conversation-feedback conversation-feedback--strong";

        } else if (score >= 0.3) {

            feedback.textContent =
                "You caught important pieces Now compare them with the whole exchange";

            feedback.className =
                "conversation-feedback conversation-feedback--partial";

        } else {

            feedback.textContent =
                "You caught what you could Now use the reveal to connect the sounds with the meaning";

            feedback.className =
                "conversation-feedback conversation-feedback--notice";
        }

        transcript.innerHTML =
            buildTranscript(item.lines);

        meaning.textContent =
            item.meaning;

        learnerText.textContent =
            response;

        reveal.hidden = false;

        input.disabled = true;
        checkButton.disabled = true;

        nextButton.textContent =
            currentIndex === conversations.length - 1
                ? "Finish the Listening Room"
                : "Next Conversation";

        reveal.scrollIntoView({
            behavior: "smooth",
            block: "nearest"
        });
    }


    function renderConversation() {

        speechSynthesis?.cancel?.();
        playToken++;

        hasPlayed = false;
        submitted = false;

        clearSpeakerLights();

        input.disabled = false;
        input.value = "";

        checkButton.disabled = false;

        feedback.textContent = "";
        feedback.className =
            "conversation-feedback";

        reveal.hidden = true;
        completeBox.hidden = true;

        playButton.disabled = false;
        playButton.innerHTML =
            "<span aria-hidden='true'>▶</span> Play the Conversation";

        audioNote.textContent =
            "The Russian stays hidden until you tell us what you understood";

        updateProgress();
    }


    function moveNext() {

        if (!submitted) {
            return;
        }

        if (
            currentIndex <
            conversations.length - 1
        ) {

            currentIndex++;
            renderConversation();

            root.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });

        } else {

            finishPartC();
        }
    }


    function finishPartC() {

        speechSynthesis?.cancel?.();
        playToken++;

        reveal.hidden = true;
        feedback.textContent = "";

        completeBox.hidden = false;

        playButton.disabled = true;
        playButton.textContent =
            "Part C Complete";

        input.disabled = true;
        checkButton.disabled = true;

        completeBox.scrollIntoView({
            behavior: "smooth",
            block: "center"
        });
    }


    function resetPartC() {

        speechSynthesis?.cancel?.();
        playToken++;

        currentIndex = 0;

        renderConversation();

        root.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });
    }


    playButton
        ?.addEventListener(
            "click",
            playConversation
        );

    checkButton
        ?.addEventListener(
            "click",
            checkUnderstanding
        );

    hearAgain
        ?.addEventListener(
            "click",
            playConversation
        );

    nextButton
        ?.addEventListener(
            "click",
            moveNext
        );

    resetButton
        ?.addEventListener(
            "click",
            resetPartC
        );

    backButton
        ?.addEventListener(
            "click",
            () => {

                document
                    .querySelector("#variation-2-part-b")
                    ?.scrollIntoView({
                        behavior: "smooth",
                        block: "start"
                    });
            }
        );


    renderConversation();

})();

// ==================================================
// EXPLORE — DOOR NAVIGATION
// ==================================================

const exploreHallway =
    document.querySelector("#explore-hallway");

const explorePersonalRoom =
    document.querySelector("#explore-personal");


// Open Door 1 — Make It More Personal
document
    .querySelector('.explore-door[data-door="personal"]')
    ?.addEventListener("click", () => {

        if (exploreHallway) {
            exploreHallway.hidden = true;
        }

        if (explorePersonalRoom) {
            explorePersonalRoom.hidden = false;

            explorePersonalRoom.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });
        }

    });


// Return from Door 1 to the EXPLORE hallway
document
    .querySelectorAll("#explore-personal .explore-return-hallway")
    .forEach((button) => {

        button.addEventListener("click", () => {

            if (explorePersonalRoom) {
                explorePersonalRoom.hidden = true;
            }

            if (exploreHallway) {
                exploreHallway.hidden = false;

                exploreHallway.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });
            }

        });

    });

// ==================================================
// EXPLORE — DOOR 1 DISCOVERY ONE
// REVEAL THE MEANING
// ==================================================

const personalReveal1 =
    document.querySelector("#personal-reveal-1");

const personalMeaning1 =
    document.querySelector("#personal-meaning-1");

const personalExploreMore1 =
    document.querySelector("#personal-explore-more-1");

const personalQuestionWordsExplorer =
    document.querySelector("#personal-question-words-explorer");

const personalPrediction1 =
    document.querySelector("#personal-prediction-1");

personalReveal1?.addEventListener("click", () => {
    if (!personalMeaning1) return;
    personalMeaning1.hidden = false;
});

// ==================================================
// EXPLORE — DOOR 1
// EXPLORE MORE — QUESTION WORD FAMILY
// ==================================================

personalExploreMore1?.addEventListener("click", () => {
    if (!personalQuestionWordsExplorer) return;

    const willShow = personalQuestionWordsExplorer.hidden;
    personalQuestionWordsExplorer.hidden = !willShow;
    personalExploreMore1.textContent = willShow ? "Close Explore More" : "🍬 Explore More";

    if (willShow) {
        personalQuestionWordsExplorer.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
});

const personalQuestionWordDetails = {
    "что": { word: "Что?", meaning: "What?", example: "Что это?", english: "What is this?", note: "Use it when you are asking what something is." },
    "как": { word: "Как?", meaning: "How?", example: "Как вас зовут?", english: "What is your name?", note: "This is the featured question word in Door 1. You already know it from asking someone's name.", featured: true },
    "когда": { word: "Когда?", meaning: "When?", example: "Когда?", english: "When?", note: "Use it when you are asking about time." },
    "почему": { word: "Почему?", meaning: "Why?", example: "Почему?", english: "Why?", note: "Use it when you want to know the reason." },
    "откуда": { word: "Откуда?", meaning: "From where?", example: "Откуда вы?", english: "Where are you from?", note: "It points toward where someone or something comes from." },
    "кто": { word: "Кто?", meaning: "Who?", example: "Кто это?", english: "Who is this?", note: "Use it when you are asking about a person." },
    "куда": { word: "Куда?", meaning: "Where to?", example: "Куда?", english: "Where to?", note: "It points toward a destination or direction." },
    "где": { word: "Где?", meaning: "Where?", example: "Где вы живёте?", english: "Where do you live?", note: "Use it when you are asking where someone or something is." },
    "сколько": { word: "Сколько?", meaning: "How many / how much?", example: "Сколько?", english: "How many? / How much?", note: "Use it when you are asking about an amount or number." }
};

const personalQuestionWordInfo =
    document.querySelector("#personal-question-word-info");

const personalKakCandy =
    document.querySelector("#personal-kak-candy");

document
    .querySelectorAll("#personal-question-words-explorer .question-word-tile")
    .forEach((button) => {
        button.addEventListener("click", () => {
            document
                .querySelectorAll("#personal-question-words-explorer .question-word-tile")
                .forEach((tile) => tile.classList.remove("selected"));

            button.classList.add("selected");

            const detail =
                personalQuestionWordDetails[button.dataset.personalQuestionWord];

            if (!detail || !personalQuestionWordInfo) return;

            personalQuestionWordInfo.innerHTML = `
                <div class="question-word-info__detail">
                    <h5 lang="ru">${detail.word}</h5>
                    <p class="question-word-info__meaning">${detail.meaning}</p>
                    <div class="question-word-info__example">
                        <strong lang="ru">${detail.example}</strong>
                        <span>${detail.english}</span>
                    </div>
                    <p class="question-word-info__note">${detail.note}</p>
                    ${detail.featured ? '<button type="button" class="question-word-info__candy-button" id="open-personal-kak-candy">🍬 Unlock the Grammar Candy</button>' : ''}
                </div>`;

            document
                .querySelector("#open-personal-kak-candy")
                ?.addEventListener("click", () => {
                    if (!personalKakCandy) return;
                    personalKakCandy.hidden = false;
                    personalKakCandy.scrollIntoView({ behavior: "smooth", block: "nearest" });
                });
        });
    });

// ==================================================
// EXPLORE — DOOR 1
// КАК? GRAMMAR CANDY — INFORMAL / FORMAL SWITCH
// ==================================================

const personalKakGraphic =
    document.querySelector("#personal-kak-candy-graphic");

const personalKakListen =
    document.querySelector("#personal-kak-listen");

const personalKakStates = {
    informal: {
        src: "../../Images/grammar-candy-YOU-informal_explanation.svg",
        alt: "Informal Grammar Candy card explaining Как тебя зовут?",
        speak: "Как тебя зовут?"
    },
    formal: {
        src: "../../Images/grammar-candy-YOU-formal_explanation.svg",
        alt: "Formal Grammar Candy card explaining Как вас зовут?",
        speak: "Как вас зовут?"
    }
};

function setPersonalKakState(register, animate = true) {
    const state = personalKakStates[register];
    if (!state) return;

    document
        .querySelectorAll(".personal-kak-choice")
        .forEach((button) => {
            button.classList.toggle("selected", button.dataset.kakRegister === register);
        });

    if (personalKakListen) {
        personalKakListen.dataset.speak = state.speak;
    }

    if (!personalKakGraphic) return;

    const applyGraphic = () => {
        personalKakGraphic.src = state.src;
        personalKakGraphic.alt = state.alt;
        personalKakGraphic.classList.remove("is-changing");
    };

    if (animate) {
        personalKakGraphic.classList.add("is-changing");
        window.setTimeout(applyGraphic, 140);
    } else {
        applyGraphic();
    }
}

document.querySelectorAll(".personal-kak-choice").forEach((button) => {
    button.addEventListener("click", () => {
        setPersonalKakState(button.dataset.kakRegister, true);
    });
});

document.querySelector("#personal-kak-reset")?.addEventListener("click", () => {
    setPersonalKakState("informal", false);

    if (personalKakCandy) {
        personalKakCandy.hidden = true;
    }
});

// ==================================================
// EXPLORE — DOOR 1 - RESTORE THIS DOOR
// ==================================================

document
    .querySelectorAll("#explore-personal .explore-reset-room")
    .forEach((button) => {
        button.addEventListener("click", () => {
            if (personalPrediction1) {
                personalPrediction1.value = "";
            }

            if (personalMeaning1) {
                personalMeaning1.hidden = true;
            }

            if (personalQuestionWordsExplorer) {
                personalQuestionWordsExplorer.hidden = true;
            }

            if (personalExploreMore1) {
                personalExploreMore1.textContent = "🍬 Explore More";
            }

            if (personalQuestionWordInfo) {
                personalQuestionWordInfo.innerHTML = `
                    <div class="question-word-info__prompt">
                        <span class="question-word-info__icon">?</span>
                        <strong>Select a Question Word</strong>
                        <p>You'll see what it means, a short example, and how it's used.</p>
                    </div>`;
            }

            document
                .querySelectorAll("#personal-question-words-explorer .question-word-tile")
                .forEach((tile) => tile.classList.remove("selected"));

            setPersonalKakState("informal", false);

            if (personalKakCandy) {
                personalKakCandy.hidden = true;
            }
        });
    });


// ==================================================
// EXPLORE — DOOR 2 - MEET SOMEONE NEW
// ==================================================

const explorePeopleRoom =
    document.querySelector("#explore-people");


// Open Door 2 — Meet Someone New
document
    .querySelector('.explore-door[data-door="people"]')
    ?.addEventListener("click", () => {

        if (exploreHallway) {
            exploreHallway.hidden = true;
        }

        if (explorePeopleRoom) {
            explorePeopleRoom.hidden = false;

            explorePeopleRoom.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });
        }

    });


// Return from Door 2 to the EXPLORE hallway
document
    .querySelectorAll("#explore-people .explore-return-hallway")
    .forEach((button) => {

        button.addEventListener("click", () => {

            if (explorePeopleRoom) {
                explorePeopleRoom.hidden = true;
            }

            if (exploreHallway) {
                exploreHallway.hidden = false;

                exploreHallway.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });
            }

        });

    });

// ==================================================
// EXPLORE — DOOR 2
// DISCOVERY ONE — PREDICT AND REVEAL
// ==================================================

const peoplePatternPrediction1 =
    document.querySelector("#people-pattern-prediction-1");

const peoplePatternCheck1 =
    document.querySelector("#people-pattern-check-1");

const peoplePatternFeedback1 =
    document.querySelector("#people-pattern-feedback-1");

const peopleDiscoveryMeaning1 =
    document.querySelector("#people-discovery-meaning-1");

function revealPeoplePattern1() {

    if (!peoplePatternPrediction1 || !peopleDiscoveryMeaning1) {
        return;
    }

    const prediction =
        peoplePatternPrediction1.value.trim();

    if (!prediction) {

        if (peoplePatternFeedback1) {
            peoplePatternFeedback1.textContent =
                "Make a prediction first. There is no penalty for being unsure.";
        }

        peoplePatternPrediction1.focus();
        return;
    }

    if (peoplePatternFeedback1) {
        peoplePatternFeedback1.textContent =
            "Now compare your prediction with the pattern you discovered.";
    }

    peopleDiscoveryMeaning1.hidden = false;

    peopleDiscoveryMeaning1.scrollIntoView({
        behavior: "smooth",
        block: "nearest"
    });
}

peoplePatternCheck1?.addEventListener(
    "click",
    revealPeoplePattern1
);

peoplePatternPrediction1?.addEventListener(
    "keydown",
    (event) => {

        if (event.key === "Enter") {
            event.preventDefault();
            revealPeoplePattern1();
        }

    }
);


// ==================================================
// EXPLORE — DOOR 2
// DISCOVERY TWO — PREDICT AND REVEAL
// ==================================================

const peoplePatternPrediction2 =
    document.querySelector("#people-pattern-prediction-2");

const peoplePatternCheck2 =
    document.querySelector("#people-pattern-check-2");

const peoplePatternFeedback2 =
    document.querySelector("#people-pattern-feedback-2");

const peopleDiscoveryMeaning2 =
    document.querySelector("#people-discovery-meaning-2");


function revealPeoplePattern2() {

    if (!peoplePatternPrediction2 || !peopleDiscoveryMeaning2) {
        return;
    }

    const prediction =
        peoplePatternPrediction2.value.trim();

    if (!prediction) {

        if (peoplePatternFeedback2) {
            peoplePatternFeedback2.textContent =
                "Make a prediction first. There is no penalty for being unsure.";
        }

        peoplePatternPrediction2.focus();
        return;
    }

    if (peoplePatternFeedback2) {
        peoplePatternFeedback2.textContent =
            "Now compare your prediction with the pattern you discovered.";
    }

    peopleDiscoveryMeaning2.hidden = false;

    peopleDiscoveryMeaning2.scrollIntoView({
        behavior: "smooth",
        block: "nearest"
    });
}


peoplePatternCheck2?.addEventListener(
    "click",
    revealPeoplePattern2
);


peoplePatternPrediction2?.addEventListener(
    "keydown",
    (event) => {

        if (event.key === "Enter") {
            event.preventDefault();
            revealPeoplePattern2();
        }

    }
);

// ==================================================
// EXPLORE — DOOR 2
// DISCOVERY THREE — PREDICT AND REVEAL
// ==================================================

const peoplePrediction3 =
    document.querySelector("#people-prediction-3");

const peopleReveal3 =
    document.querySelector("#people-reveal-3");

const peopleMeaning3 =
    document.querySelector("#people-meaning-3");

const peopleGrammarCandy3 =
    document.querySelector("#people-grammar-candy-3");


function revealPeopleDiscovery3() {

    if (!peoplePrediction3 || !peopleMeaning3) {
        return;
    }

    const prediction =
        peoplePrediction3.value.trim();

    if (!prediction) {

        peoplePrediction3.placeholder =
            "Make a prediction first. There is no penalty for being unsure.";

        peoplePrediction3.focus();
        return;
    }

    peopleMeaning3.hidden = false;

    if (peopleGrammarCandy3) {
        peopleGrammarCandy3.hidden = false;
    }

    peopleMeaning3.scrollIntoView({
        behavior: "smooth",
        block: "nearest"
    });
}


peopleReveal3?.addEventListener(
    "click",
    revealPeopleDiscovery3
);

// ==================================================
// EXPLORE — DOOR 2
// DISCOVERY THREE — GRAMMAR CANDY
// ==================================================

const peopleGrammarExplanation3 =
    document.querySelector("#people-grammar-explanation-3");


peopleGrammarCandy3?.addEventListener("click", () => {

    if (!peopleGrammarExplanation3) {
        return;
    }

    peopleGrammarExplanation3.hidden = false;

    peopleGrammarExplanation3.scrollIntoView({
        behavior: "smooth",
        block: "nearest"
    });

});

// ==================================================
// EXPLORE — DOOR 2
// RESTORE THIS DOOR
// ==================================================

document
    .querySelectorAll("#explore-people .explore-reset-room")
    .forEach((button) => {

        button.addEventListener("click", () => {

            // Stop any Russian audio that may be playing.
            window.speechSynthesis?.cancel?.();


            // ------------------------------------------
            // DISCOVERY ONE
            // ------------------------------------------

            if (peoplePatternPrediction1) {
                peoplePatternPrediction1.value = "";
            }

            if (peoplePatternFeedback1) {
                peoplePatternFeedback1.textContent = "";
            }

            if (peopleDiscoveryMeaning1) {
                peopleDiscoveryMeaning1.hidden = true;
            }


            // ------------------------------------------
            // DISCOVERY TWO
            // ------------------------------------------

            if (peoplePatternPrediction2) {
                peoplePatternPrediction2.value = "";
            }

            if (peoplePatternFeedback2) {
                peoplePatternFeedback2.textContent = "";
            }

            if (peopleDiscoveryMeaning2) {
                peopleDiscoveryMeaning2.hidden = true;
            }


            // ------------------------------------------
            // DISCOVERY THREE
            // ------------------------------------------

            if (peoplePrediction3) {
                peoplePrediction3.value = "";
                peoplePrediction3.placeholder =
                    "Type your prediction here";
            }

            if (peopleMeaning3) {
                peopleMeaning3.hidden = true;
            }

            if (peopleGrammarCandy3) {
                peopleGrammarCandy3.hidden = true;
            }

            if (peopleGrammarExplanation3) {
                peopleGrammarExplanation3.hidden = true;
            }


            // ------------------------------------------
            // RETURN TO THE TOP OF DOOR 2
            // ------------------------------------------

            if (explorePeopleRoom) {

                explorePeopleRoom.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });

            }

        });

    });

const exploreMoreIsButton = document.getElementById("people-explore-more-is");
const exploreMoreIsReveal = document.getElementById("people-explore-more-is-reveal");

if (exploreMoreIsButton && exploreMoreIsReveal) {
    exploreMoreIsButton.addEventListener("click", () => {
        const isHidden = exploreMoreIsReveal.hasAttribute("hidden");

        if (isHidden) {
            exploreMoreIsReveal.removeAttribute("hidden");
            exploreMoreIsButton.textContent = "🍬 Hide Grammar";
        } else {
            exploreMoreIsReveal.setAttribute("hidden", "");
            exploreMoreIsButton.textContent = "🍬 Explore More";
        }
    });
}


// ==================================================
// EXPLORE — DOOR 3
// WHERE COULD THE CONVERSATION GO?
// ==================================================

const exploreConversationRoom =
    document.querySelector("#explore-conversation");


// Open Door 3 — Where Could the Conversation Go?
document
    .querySelector('.explore-door[data-door="conversation"]')
    ?.addEventListener("click", () => {

        if (exploreHallway) {
            exploreHallway.hidden = true;
        }

        if (exploreConversationRoom) {
            exploreConversationRoom.hidden = false;

            exploreConversationRoom.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });
        }

    });


// Return from Door 3 to the EXPLORE hallway
document
    .querySelectorAll("#explore-conversation .explore-return-hallway")
    .forEach((button) => {

        button.addEventListener("click", () => {

            if (exploreConversationRoom) {
                exploreConversationRoom.hidden = true;
            }

            if (exploreHallway) {
                exploreHallway.hidden = false;

                exploreHallway.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });
            }

        });

    });


// ==================================================
// DOOR 3 — PREDICTION / REVEAL HELPER
// ==================================================

function wireConversationReveal(predictionId, revealId, meaningId) {

    const prediction =
        document.querySelector(`#${predictionId}`);

    const revealButton =
        document.querySelector(`#${revealId}`);

    const meaning =
        document.querySelector(`#${meaningId}`);

    revealButton?.addEventListener("click", () => {

        if (!prediction || !meaning) {
            return;
        }

        if (!prediction.value.trim()) {
            prediction.placeholder =
                "Make a prediction first — there is no penalty for being unsure.";

            prediction.focus();
            return;
        }

        meaning.hidden = false;

        meaning.scrollIntoView({
            behavior: "smooth",
            block: "nearest"
        });

    });
}


wireConversationReveal(
    "conversation-prediction-1",
    "conversation-reveal-1",
    "conversation-meaning-1"
);

wireConversationReveal(
    "conversation-prediction-2",
    "conversation-reveal-2",
    "conversation-meaning-2"
);

wireConversationReveal(
    "conversation-prediction-3",
    "conversation-reveal-3",
    "conversation-meaning-3"
);


// ==================================================
// DOOR 3 — DISCOVERY ONE
// EXPLORE MORE — QUESTION-WORD FAMILY
// ==================================================

const conversationExploreMore1 =
    document.querySelector("#conversation-explore-more-1");

const conversationExploreMoreReveal1 =
    document.querySelector("#conversation-explore-more-reveal-1");

conversationExploreMore1?.addEventListener("click", () => {

    if (!conversationExploreMoreReveal1) return;

    const willShow = conversationExploreMoreReveal1.hidden;
    conversationExploreMoreReveal1.hidden = !willShow;
    conversationExploreMore1.textContent = willShow ? "Close Explore More" : "🍬 Explore More";

    if (willShow) {
        conversationExploreMoreReveal1.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
});

const questionWordDetails = {
    "что": { word: "Что?", meaning: "What?", example: "Что это?", english: "What is this?", note: "Use it when you are asking what something is." },
    "где": { word: "Где?", meaning: "Where?", example: "Где вы живёте?", english: "Where do you live?", note: "This is the featured question word in Door 3.", featured: true },
    "когда": { word: "Когда?", meaning: "When?", example: "Когда?", english: "When?", note: "Use it when you are asking about time." },
    "почему": { word: "Почему?", meaning: "Why?", example: "Почему?", english: "Why?", note: "Use it when you want to know the reason." },
    "откуда": { word: "Откуда?", meaning: "From where?", example: "Откуда вы?", english: "Where are you from?", note: "It points toward where someone or something comes from." },
    "кто": { word: "Кто?", meaning: "Who?", example: "Кто это?", english: "Who is this?", note: "Use it when you are asking about a person." },
    "куда": { word: "Куда?", meaning: "Where to?", example: "Куда?", english: "Where to?", note: "It points toward a destination or direction." },
    "как": { word: "Как?", meaning: "How?", example: "Как вас зовут?", english: "What is your name?", note: "You've already met this question word in the lesson." },
    "сколько": { word: "Сколько?", meaning: "How many / how much?", example: "Сколько?", english: "How many? / How much?", note: "Use it when you are asking about an amount or number." }
};

const questionWordInfo = document.querySelector("#conversation-question-word-info");
const whereCandy = document.querySelector("#conversation-where-candy");

document.querySelectorAll("#conversation-explore-more-reveal-1 .question-word-tile").forEach((button) => {
    button.addEventListener("click", () => {
        document.querySelectorAll("#conversation-explore-more-reveal-1 .question-word-tile").forEach((tile) => tile.classList.remove("selected"));
        button.classList.add("selected");
        const detail = questionWordDetails[button.dataset.questionWord];
        if (!detail || !questionWordInfo) return;
        questionWordInfo.innerHTML = `
            <div class="question-word-info__detail">
                <h5 lang="ru">${detail.word}</h5>
                <p class="question-word-info__meaning">${detail.meaning}</p>
                <div class="question-word-info__example">
                    <strong lang="ru">${detail.example}</strong>
                    <span>${detail.english}</span>
                </div>
                <p class="question-word-info__note">${detail.note}</p>
                ${detail.featured ? '<button type="button" class="question-word-info__candy-button" id="open-where-candy">🍬 Unlock the Grammar Candy</button>' : ''}
            </div>`;

        document.querySelector("#open-where-candy")?.addEventListener("click", () => {
            if (!whereCandy) return;
            whereCandy.hidden = false;
            whereCandy.scrollIntoView({ behavior: "smooth", block: "nearest" });
        });
    });
});

const wherePeople = {
    i: { pronoun: "Я", verb: "живу", en: "I" },
    we: { pronoun: "Мы", verb: "живём", en: "We" },
    they: { pronoun: "Они", verb: "живут", en: "They" }
};
const wherePlaces = {
    phoenix: { ru: "в Финиксе.", en: "Phoenix" },
    moscow: { ru: "в Москве.", en: "Moscow" },
    london: { ru: "в Лондоне.", en: "London" }
};
let wherePerson = "i";
let wherePlace = "phoenix";

function updateWhereCandy(animatePattern = false) {
    const person = wherePeople[wherePerson];
    const place = wherePlaces[wherePlace];
    const pronoun = document.querySelector("#where-live-pronoun");
    const verb = document.querySelector("#where-live-verb");
    const placeWord = document.querySelector("#where-live-place");
    const english = document.querySelector("#where-live-english");
    const result = document.querySelector("#where-live-result");
    const listen = document.querySelector("#where-live-listen");
    if (pronoun) pronoun.textContent = person.pronoun;
    if (verb) verb.textContent = person.verb;
    if (placeWord) placeWord.textContent = place.ru;
    if (english) english.textContent = `${person.en} live${wherePerson === "i" || wherePerson === "we" || wherePerson === "they" ? "" : "s"} in ${place.en}.`;
    const russian = `${person.pronoun} ${person.verb} ${place.ru}`;
    if (result) result.textContent = russian;
    if (listen) listen.dataset.speak = russian;
    if (animatePattern) {
        [pronoun, verb].forEach((el) => {
            if (!el) return;
            el.classList.remove("where-pattern-change");
            void el.offsetWidth;
            el.classList.add("where-pattern-change");
        });
    }
}

document.querySelectorAll(".where-person-choice").forEach((button) => {
    button.addEventListener("click", () => {
        wherePerson = button.dataset.person;
        document.querySelectorAll(".where-person-choice").forEach((b) => b.classList.remove("selected"));
        button.classList.add("selected");
        updateWhereCandy(true);
    });
});

document.querySelectorAll(".where-candy-place").forEach((button) => {
    button.addEventListener("click", () => {
        wherePlace = button.dataset.place;
        document.querySelectorAll(".where-candy-place").forEach((b) => b.classList.remove("selected"));
        button.classList.add("selected");
        updateWhereCandy(false);
    });
});

updateWhereCandy();

// Reset only the WHERE Grammar Candy.
document.querySelector("#where-candy-reset")?.addEventListener("click", () => {
    wherePerson = "i";
    wherePlace = "phoenix";
    document.querySelectorAll(".where-person-choice").forEach((button) => {
        button.classList.toggle("selected", button.dataset.person === "i");
    });
    document.querySelectorAll(".where-candy-place").forEach((button) => {
        button.classList.toggle("selected", button.dataset.place === "phoenix");
    });
    updateWhereCandy(true);
    if (whereCandy) whereCandy.hidden = true;
});

// ==================================================
// DOOR 3 — DISCOVERY THREE
// CHOOSE AN AUTHENTIC RESPONSE
// ==================================================

const conversationPersonalResponse =
    document.querySelector("#conversation-personal-response");

const conversationPersonalResponseRussian =
    document.querySelector("#conversation-personal-response-russian");

const conversationPersonalResponseEnglish =
    document.querySelector("#conversation-personal-response-english");

const conversationPersonalResponseListen =
    document.querySelector("#conversation-personal-response-listen");

document
    .querySelectorAll(".conversation-ability__choice")
    .forEach((button) => {

        button.addEventListener("click", () => {

            document
                .querySelectorAll(".conversation-ability__choice")
                .forEach((choice) => {
                    choice.classList.remove("selected");
                });

            button.classList.add("selected");

            const russian =
                button.dataset.response || "";

            const english =
                button.dataset.meaning || "";

            if (conversationPersonalResponseRussian) {
                conversationPersonalResponseRussian.textContent =
                    russian;
            }

            if (conversationPersonalResponseEnglish) {
                conversationPersonalResponseEnglish.textContent =
                    english;
            }

            if (conversationPersonalResponseListen) {
                conversationPersonalResponseListen.dataset.speak =
                    russian;
            }

            if (conversationPersonalResponse) {
                conversationPersonalResponse.hidden = false;
            }

        });

    });


// ==================================================
// DOOR 3 — DISCOVERY THREE
// ESSENTIAL VERBS + ГОВОРИТЬ GRAMMAR CANDY
// ==================================================

const conversationExploreVerbs3 =
    document.querySelector("#conversation-explore-verbs-3");

const essentialVerbsExplorer =
    document.querySelector("#conversation-essential-verbs");

const essentialVerbInfo =
    document.querySelector("#conversation-essential-verb-info");

const speakCandy =
    document.querySelector("#conversation-speak-candy");

conversationExploreVerbs3?.addEventListener("click", () => {
    if (!essentialVerbsExplorer) return;
    const willShow = essentialVerbsExplorer.hidden;
    essentialVerbsExplorer.hidden = !willShow;
    conversationExploreVerbs3.textContent = willShow ? "Close Explore More" : "🍬 Explore More";
    if (willShow) {
        essentialVerbsExplorer.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
});

const essentialVerbDetails = {
    "быть": { word: "быть", meaning: "to be", example: "быть дома", english: "to be at home", note: "Russian has a verb meaning ‘to be,’ even though present-tense sentences often work differently from English." },
    "есть": { word: "есть", meaning: "to eat", example: "Я ем.", english: "I eat / I am eating.", note: "Use it when talking about eating food." },
    "пить": { word: "пить", meaning: "to drink", example: "Я пью.", english: "I drink / I am drinking.", note: "Use it when talking about drinking something." },
    "делать": { word: "делать", meaning: "to do / to make", example: "Что вы делаете?", english: "What are you doing?", note: "A very useful verb for actions and things people do." },
    "говорить": { word: "говорить", meaning: "to speak / to say", example: "Вы говорите по-русски?", english: "Do you speak Russian?", note: "This is the featured verb in Door 3.", featured: true },
    "понимать": { word: "понимать", meaning: "to understand", example: "Я понимаю.", english: "I understand.", note: "Use it when talking about understanding words, ideas, or people." },
    "хотеть": { word: "хотеть", meaning: "to want", example: "Я хочу...", english: "I want...", note: "A high-value verb for saying what you want." },
    "любить": { word: "любить", meaning: "to like / to love", example: "Я люблю...", english: "I like / love...", note: "Use it for people and things you genuinely like or love." },
    "жить": { word: "жить", meaning: "to live", example: "Я живу в Финиксе.", english: "I live in Phoenix.", note: "You've already met this verb while exploring where someone lives." }
};

document.querySelectorAll("#conversation-essential-verbs .essential-verb-tile").forEach((button) => {
    button.addEventListener("click", () => {
        document.querySelectorAll("#conversation-essential-verbs .essential-verb-tile").forEach((tile) => tile.classList.remove("selected"));
        button.classList.add("selected");
        const detail = essentialVerbDetails[button.dataset.verb];
        if (!detail || !essentialVerbInfo) return;
        essentialVerbInfo.innerHTML = `
            <div class="essential-verb-info__detail">
                <h5 lang="ru">${detail.word}</h5>
                <p class="essential-verb-info__meaning">${detail.meaning}</p>
                <div class="essential-verb-info__example">
                    <strong lang="ru">${detail.example}</strong>
                    <span>${detail.english}</span>
                </div>
                <p class="essential-verb-info__note">${detail.note}</p>
                ${detail.featured ? '<button type="button" class="essential-verb-info__candy-button" id="open-speak-candy">🍬 Unlock the Grammar Candy</button>' : ''}
            </div>`;

        document.querySelector("#open-speak-candy")?.addEventListener("click", () => {
            if (!speakCandy) return;
            speakCandy.hidden = false;
            speakCandy.scrollIntoView({ behavior: "smooth", block: "nearest" });
        });
    });
});

const speakPeople = {
    i: { pronoun: "Я", verb: "говорю", en: "I" },
    you: { pronoun: "Вы", verb: "говорите", en: "You" },
    we: { pronoun: "Мы", verb: "говорим", en: "We" },
    they: { pronoun: "Они", verb: "говорят", en: "They" }
};

const speakLanguages = {
    russian: { ru: "по-русски.", en: "Russian" },
    english: { ru: "по-английски.", en: "English" },
    spanish: { ru: "по-испански.", en: "Spanish" }
};

let speakPerson = "i";
let speakLanguage = "russian";

function updateSpeakCandy(animatePattern = false) {
    const person = speakPeople[speakPerson];
    const language = speakLanguages[speakLanguage];
    const pronoun = document.querySelector("#speak-live-pronoun");
    const verb = document.querySelector("#speak-live-verb");
    const languageWord = document.querySelector("#speak-live-language");
    const english = document.querySelector("#speak-live-english");
    const listen = document.querySelector("#speak-live-listen");

    if (pronoun) pronoun.textContent = person.pronoun;
    if (verb) verb.textContent = person.verb;
    if (languageWord) languageWord.textContent = language.ru;
    if (english) english.textContent = `${person.en} speak${speakPerson === "i" || speakPerson === "you" || speakPerson === "we" || speakPerson === "they" ? "" : "s"} ${language.en}.`;

    const russian = `${person.pronoun} ${person.verb} ${language.ru}`;
    if (listen) listen.dataset.speak = russian;

    if (animatePattern) {
        [pronoun, verb].forEach((el) => {
            if (!el) return;
            el.classList.remove("speak-pattern-change");
            void el.offsetWidth;
            el.classList.add("speak-pattern-change");
        });
    }
}

document.querySelectorAll(".speak-person-choice").forEach((button) => {
    button.addEventListener("click", () => {
        speakPerson = button.dataset.person;
        document.querySelectorAll(".speak-person-choice").forEach((b) => b.classList.remove("selected"));
        button.classList.add("selected");
        updateSpeakCandy(true);
    });
});

document.querySelectorAll(".speak-language-choice").forEach((button) => {
    button.addEventListener("click", () => {
        speakLanguage = button.dataset.language;
        document.querySelectorAll(".speak-language-choice").forEach((b) => b.classList.remove("selected"));
        button.classList.add("selected");
        updateSpeakCandy(false);
    });
});

updateSpeakCandy();

document.querySelector("#speak-candy-reset")?.addEventListener("click", () => {
    speakPerson = "i";
    speakLanguage = "russian";
    document.querySelectorAll(".speak-person-choice").forEach((button) => {
        button.classList.toggle("selected", button.dataset.person === "i");
    });
    document.querySelectorAll(".speak-language-choice").forEach((button) => {
        button.classList.toggle("selected", button.dataset.language === "russian");
    });
    updateSpeakCandy(true);
    if (speakCandy) speakCandy.hidden = true;
});


// ==================================================
// DOOR 3 — RESTORE THIS DOOR
// ==================================================

document
    .querySelectorAll("#explore-conversation .explore-reset-room")
    .forEach((button) => {

        button.addEventListener("click", () => {

            [
                "#conversation-prediction-1",
                "#conversation-prediction-2",
                "#conversation-prediction-3"
            ].forEach((selector) => {

                const field =
                    document.querySelector(selector);

                if (field) {
                    field.value = "";
                }

            });


            [
                "#conversation-meaning-1",
                "#conversation-meaning-2",
                "#conversation-meaning-3",
                "#conversation-explore-more-reveal-1",
                "#conversation-grammar-reveal-3",
                "#conversation-personal-response"
            ].forEach((selector) => {

                const panel =
                    document.querySelector(selector);

                if (panel) {
                    panel.hidden = true;
                }

            });


            if (conversationExploreMore1) {
                conversationExploreMore1.textContent =
                    "🍬 Explore More";
            }

            if (whereCandy) whereCandy.hidden = true;
            wherePerson = "i";
            wherePlace = "phoenix";
            document.querySelectorAll(".where-person-choice").forEach((b, i) => b.classList.toggle("selected", i === 0));
            document.querySelectorAll(".where-candy-place").forEach((b, i) => b.classList.toggle("selected", i === 0));
            document.querySelectorAll("#conversation-explore-more-reveal-1 .question-word-tile").forEach((b) => b.classList.remove("selected"));
            if (questionWordInfo) {
                questionWordInfo.innerHTML = '<div class="question-word-info__prompt"><span class="question-word-info__icon">?</span><strong>Select a Question Word</strong><p>You\'ll see what it means, a short example, and how it\'s used.</p></div>';
            }
            updateWhereCandy();

            if (conversationExploreVerbs3) {
                conversationExploreVerbs3.textContent = "🍬 Explore More";
            }
            if (essentialVerbsExplorer) essentialVerbsExplorer.hidden = true;
            if (speakCandy) speakCandy.hidden = true;
            speakPerson = "i";
            speakLanguage = "russian";
            document.querySelectorAll(".speak-person-choice").forEach((b) => b.classList.toggle("selected", b.dataset.person === "i"));
            document.querySelectorAll(".speak-language-choice").forEach((b) => b.classList.toggle("selected", b.dataset.language === "russian"));
            document.querySelectorAll("#conversation-essential-verbs .essential-verb-tile").forEach((b) => b.classList.remove("selected"));
            if (essentialVerbInfo) {
                essentialVerbInfo.innerHTML = '<div class="essential-verb-info__prompt"><span class="essential-verb-info__icon">✦</span><strong>Select an Essential Verb</strong><p>You\'ll see what it means, a short example, and how it\'s used.</p></div>';
            }
            updateSpeakCandy();



            document
                .querySelectorAll(".conversation-ability__choice")
                .forEach((choice) => {
                    choice.classList.remove("selected");
                });


            exploreConversationRoom?.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });

        });

    });

// ==================================================
// EXPLORE — DOOR 4
// THE LANGUAGE LABORATORY — CORE
// ==================================================

const exploreRussianRoom =
    document.querySelector("#explore-russian");

const russianReveal1 =
    document.querySelector("#russian-reveal-1");

const russianReveal2 =
    document.querySelector("#russian-reveal-2");

const russianReveal3 =
    document.querySelector("#russian-reveal-3");

const russianResult1 =
    document.querySelector("#russian-result-1");

const russianResult2 =
    document.querySelector("#russian-result-2");

const russianResult3 =
    document.querySelector("#russian-result-3");

const russianBuildParagraph =
    document.querySelector("#russian-build-paragraph");

const russianParagraphStage =
    document.querySelector("#russian-paragraph-stage");

const russianShowMeaning =
    document.querySelector("#russian-show-meaning");

const russianParagraphMeaning =
    document.querySelector("#russian-paragraph-meaning");

const russianReadingAchievement =
    document.querySelector("#russian-reading-achievement");


// Discovery 1 Grammar Candy uses three choice buttons and one shared display area.
const discovery1GrammarCandy =
    document.querySelector("#discovery-1-grammar-candy");

const discovery1GrammarCandyDisplay =
    document.querySelector("#grammar-candy-display-1");


// Open Door 4 — The Language Laboratory
document
    .querySelector('.explore-door[data-door="russian"]')
    ?.addEventListener("click", () => {

        if (exploreHallway) {
            exploreHallway.hidden = true;
        }

        if (exploreRussianRoom) {
            exploreRussianRoom.hidden = false;

            exploreRussianRoom.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });
        }

    });


// Return from Door 4 to the EXPLORE hallway
document
    .querySelectorAll("#explore-russian .explore-return-hallway")
    .forEach((button) => {

        button.addEventListener("click", () => {

            if (exploreRussianRoom) {
                exploreRussianRoom.hidden = true;
            }

            if (exploreHallway) {
                exploreHallway.hidden = false;

                exploreHallway.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });
            }

        });

    });


// ==================================================
// DOOR 4 — DISCOVERY 1 & 2
// DRAG-AND-DROP THOUGHT ORDERING
// ==================================================

const languageLabOrderingChallenges =
    [...document.querySelectorAll(".language-lab__ordering")];


function shuffleLanguageLabPieces(challenge) {

    const bank =
        challenge?.querySelector('[data-role="bank"]');

    if (!bank) {
        return;
    }

    const pieces =
        [...challenge.querySelectorAll(".language-lab__drag-piece")];

    // Keep shuffling until the starting order is not already the answer.
    const expected =
        (challenge.dataset.answer || "").split("|");

    let shuffled = [...pieces];

    for (let attempt = 0; attempt < 12; attempt++) {
        shuffled = [...pieces].sort(() => Math.random() - 0.5);

        const keys =
            shuffled.map((piece) => piece.dataset.key);

        if (keys.join("|") !== expected.join("|")) {
            break;
        }
    }

    shuffled.forEach((piece) => {
        piece.classList.remove("is-correct", "is-dragging");
        bank.appendChild(piece);
    });
}


function updateLanguageLabPlaceholder(challenge) {

    const sequence =
        challenge?.querySelector('[data-role="sequence"]');

    const placeholder =
        sequence?.querySelector(".language-lab__drop-placeholder");

    if (!sequence || !placeholder) {
        return;
    }

    const hasPieces =
        Boolean(sequence.querySelector(".language-lab__drag-piece"));

    placeholder.hidden = hasPieces;
}


function moveLanguageLabPiece(piece, container, beforePiece = null) {

    if (!piece || !container) {
        return;
    }

    if (beforePiece && beforePiece !== piece) {
        container.insertBefore(piece, beforePiece);
    } else {
        container.appendChild(piece);
    }

    const challenge =
        container.closest(".language-lab__ordering");

    if (challenge) {
        updateLanguageLabPlaceholder(challenge);

        const feedback =
            challenge.querySelector(".language-lab__ordering-feedback");

        if (feedback) {
            feedback.textContent = "";
            feedback.className = "language-lab__ordering-feedback";
        }
    }
}


languageLabOrderingChallenges.forEach((challenge) => {

    const bank =
        challenge.querySelector('[data-role="bank"]');

    const sequence =
        challenge.querySelector('[data-role="sequence"]');

    const checkButton =
        challenge.querySelector(".language-lab__check-order");

    const showButton =
        challenge.querySelector(".language-lab__show-order");

    const feedback =
        challenge.querySelector(".language-lab__ordering-feedback");

    const revealButton =
        challenge.id === "russian-ordering-1"
            ? russianReveal1
            : russianReveal2;

    let draggedPiece = null;

    const pieces =
        [...challenge.querySelectorAll(".language-lab__drag-piece")];

    pieces.forEach((piece) => {

        piece.addEventListener("dragstart", () => {
            draggedPiece = piece;
            piece.classList.add("is-dragging");
        });

        piece.addEventListener("dragend", () => {
            piece.classList.remove("is-dragging");
            draggedPiece = null;
            bank?.classList.remove("is-drag-over");
            sequence?.classList.remove("is-drag-over");
        });

        // Click is a keyboard/mouse fallback: bank -> sequence, sequence -> bank.
        piece.addEventListener("click", () => {

            if (piece.parentElement === bank) {
                moveLanguageLabPiece(piece, sequence);
            } else {
                moveLanguageLabPiece(piece, bank);
            }
        });

    });


    [bank, sequence].forEach((container) => {

        if (!container) {
            return;
        }

        container.addEventListener("dragover", (event) => {
            event.preventDefault();
            container.classList.add("is-drag-over");
        });

        container.addEventListener("dragleave", (event) => {
            if (!container.contains(event.relatedTarget)) {
                container.classList.remove("is-drag-over");
            }
        });

        container.addEventListener("drop", (event) => {
            event.preventDefault();
            container.classList.remove("is-drag-over");

            if (!draggedPiece) {
                return;
            }

            const targetPiece =
                event.target.closest(".language-lab__drag-piece");

            if (targetPiece && targetPiece !== draggedPiece && targetPiece.parentElement === container) {

                const rect =
                    targetPiece.getBoundingClientRect();

                const before =
                    event.clientY < rect.top + rect.height / 2 ||
                    (Math.abs(event.clientY - (rect.top + rect.height / 2)) < rect.height / 3 &&
                        event.clientX < rect.left + rect.width / 2);

                if (before) {
                    moveLanguageLabPiece(draggedPiece, container, targetPiece);
                } else {
                    moveLanguageLabPiece(draggedPiece, container, targetPiece.nextElementSibling);
                }

            } else {
                moveLanguageLabPiece(draggedPiece, container);
            }
        });

    });


    checkButton?.addEventListener("click", () => {

        const expected =
            (challenge.dataset.answer || "").split("|");

        const actual =
            [...sequence.querySelectorAll(".language-lab__drag-piece")]
                .map((piece) => piece.dataset.key);

        const allPlaced =
            actual.length === expected.length;

        const correct =
            allPlaced && expected.every((key, index) => key === actual[index]);

        if (correct) {

            feedback.textContent =
                "You connected the ideas. Now watch what Russian can do with them.";

            feedback.className =
                "language-lab__ordering-feedback good";

            sequence
                .querySelectorAll(".language-lab__drag-piece")
                .forEach((piece) => piece.classList.add("is-correct"));

            checkButton.disabled = true;

            if (showButton) {
                showButton.hidden = true;
            }

            if (revealButton) {
                revealButton.disabled = false;
            }

        } else {

            feedback.textContent = allPlaced
                ? "Not quite — let's try again. Look at the English situation above and check which idea comes next."
                : "Almost there — move every Russian thought into your story, then check the order. Let's try again.";

            feedback.className =
                "language-lab__ordering-feedback bad";

            if (showButton) {
                showButton.hidden = false;
            }
        }

    });


    showButton?.addEventListener("click", () => {

        const expected =
            (challenge.dataset.answer || "").split("|");

        expected.forEach((key) => {
            const piece =
                challenge.querySelector(`.language-lab__drag-piece[data-key="${key}"]`);

            if (piece) {
                sequence.appendChild(piece);
                piece.classList.add("is-correct");
            }
        });

        updateLanguageLabPlaceholder(challenge);

        feedback.textContent =
            "Here is the sequence. Now watch how Russian connects these separate thoughts.";

        feedback.className =
            "language-lab__ordering-feedback good";

        checkButton.disabled = true;
        showButton.hidden = true;

        if (revealButton) {
            revealButton.disabled = false;
        }

    });


    shuffleLanguageLabPieces(challenge);
    updateLanguageLabPlaceholder(challenge);

});


// Reveal each Language Laboratory discovery.
function revealLanguageLabResult(result, button) {

    if (!result) {
        return;
    }

    result.hidden = false;

    if (button) {
        button.disabled = true;
        button.textContent = "Discovery Connected";
    }

    result.scrollIntoView({
        behavior: "smooth",
        block: "nearest"
    });
}


russianReveal1?.addEventListener("click", () => {
    revealLanguageLabResult(russianResult1, russianReveal1);
});


russianReveal2?.addEventListener("click", () => {
    revealLanguageLabResult(russianResult2, russianReveal2);
});


russianReveal3?.addEventListener("click", () => {

    revealLanguageLabResult(russianResult3, russianReveal3);

    if (russianBuildParagraph) {
        russianBuildParagraph.hidden = false;
    }
});


// ==================================================
// DOOR 4 — DISCOVERY 1 — GRAMMAR CANDY
// One shared display area; click a Candy again to close it.
// ==================================================

discovery1GrammarCandy
    ?.querySelectorAll(".grammar-candy-choice")
    .forEach((button) => {

        button.addEventListener("click", () => {

            const candyKey = button.dataset.candy;
            const wasActive = button.classList.contains("is-active");

            discovery1GrammarCandy
                .querySelectorAll(".grammar-candy-choice")
                .forEach((choice) => {
                    choice.classList.remove("is-active");
                    choice.setAttribute("aria-pressed", "false");
                });

            discovery1GrammarCandy
                .querySelectorAll("[data-candy-panel]")
                .forEach((panel) => {
                    panel.hidden = true;
                });

            if (wasActive) {
                if (discovery1GrammarCandyDisplay) {
                    discovery1GrammarCandyDisplay.hidden = true;
                }
                return;
            }

            const selectedPanel =
                discovery1GrammarCandy.querySelector(
                    `[data-candy-panel="${candyKey}"]`
                );

            button.classList.add("is-active");
            button.setAttribute("aria-pressed", "true");

            if (selectedPanel) {
                selectedPanel.hidden = false;
            }

            if (discovery1GrammarCandyDisplay) {
                discovery1GrammarCandyDisplay.hidden = false;
            }
        });
    });


// Discovery 1 — collapse whichever Grammar Candy is currently open.
document
    .querySelector("#grammar-candy-collapse-1")
    ?.addEventListener("click", () => {

        discovery1GrammarCandy
            ?.querySelectorAll(".grammar-candy-choice")
            .forEach((choice) => {
                choice.classList.remove("is-active");
                choice.setAttribute("aria-pressed", "false");
            });

        discovery1GrammarCandy
            ?.querySelectorAll("[data-candy-panel]")
            .forEach((panel) => {
                panel.hidden = true;
            });

        if (discovery1GrammarCandyDisplay) {
            discovery1GrammarCandyDisplay.hidden = true;
        }

    });


// Assemble the three discoveries into the final paragraph.
russianBuildParagraph?.addEventListener("click", () => {

    if (!russianParagraphStage) {
        return;
    }

    russianParagraphStage.hidden = false;
    russianBuildParagraph.hidden = true;

    russianParagraphStage.scrollIntoView({
        behavior: "smooth",
        block: "start"
    });
});


// Reveal the English only after the learner has tried reading the Russian.
russianShowMeaning?.addEventListener("click", () => {

    if (russianParagraphMeaning) {
        russianParagraphMeaning.hidden = false;
    }

    if (russianReadingAchievement) {
        russianReadingAchievement.hidden = false;
    }

    if (russianShowMeaning) {
        russianShowMeaning.disabled = true;
        russianShowMeaning.textContent = "Meaning Revealed";
    }

    russianParagraphMeaning?.scrollIntoView({
        behavior: "smooth",
        block: "nearest"
    });
});


// Restore Door 4 to its original learner state.
document
    .querySelectorAll("#explore-russian .explore-reset-room")
    .forEach((button) => {

        button.addEventListener("click", () => {

            speechSynthesis?.cancel?.();

            // Close Discovery 1 Grammar Candy and clear the selected Candy button.
            discovery1GrammarCandy
                ?.querySelectorAll(".grammar-candy-choice")
                .forEach((choice) => {
                    choice.classList.remove("is-active");
                    choice.setAttribute("aria-pressed", "false");
                });

            discovery1GrammarCandy
                ?.querySelectorAll("[data-candy-panel]")
                .forEach((panel) => {
                    panel.hidden = true;
                });

            if (discovery1GrammarCandyDisplay) {
                discovery1GrammarCandyDisplay.hidden = true;
            }

            [russianResult1, russianResult2, russianResult3].forEach((result) => {
                if (result) {
                    result.hidden = true;
                }
            });

            // Restore both drag-and-drop ordering challenges.
            languageLabOrderingChallenges.forEach((challenge) => {

                const bank =
                    challenge.querySelector('[data-role="bank"]');

                const checkButton =
                    challenge.querySelector(".language-lab__check-order");

                const showButton =
                    challenge.querySelector(".language-lab__show-order");

                const feedback =
                    challenge.querySelector(".language-lab__ordering-feedback");

                challenge
                    .querySelectorAll(".language-lab__drag-piece")
                    .forEach((piece) => {
                        piece.classList.remove("is-correct", "is-dragging");
                        bank?.appendChild(piece);
                    });

                shuffleLanguageLabPieces(challenge);
                updateLanguageLabPlaceholder(challenge);

                if (checkButton) {
                    checkButton.disabled = false;
                }

                if (showButton) {
                    showButton.hidden = true;
                }

                if (feedback) {
                    feedback.textContent = "";
                    feedback.className = "language-lab__ordering-feedback";
                }
            });

            [russianReveal1, russianReveal2, russianReveal3].forEach((revealButton, index) => {
                if (!revealButton) {
                    return;
                }

                // Discovery 1 and 2 must be solved (or shown) before their reveal buttons unlock.
                revealButton.disabled = index < 2;
                revealButton.textContent = [
                    "Connect the Ideas",
                    "Create the Connected Thought",
                    "Explain Why"
                ][index];
            });

            if (russianBuildParagraph) {
                russianBuildParagraph.hidden = true;
            }

            if (russianParagraphStage) {
                russianParagraphStage.hidden = true;
            }

            if (russianParagraphMeaning) {
                russianParagraphMeaning.hidden = true;
            }

            if (russianReadingAchievement) {
                russianReadingAchievement.hidden = true;
            }

            if (russianShowMeaning) {
                russianShowMeaning.disabled = false;
                russianShowMeaning.textContent = "See What It Means";
            }

            exploreRussianRoom?.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });
        });

    });


// ==================================================
// LESSON 2 — COUSIN GRAMMAR CANDY
// Two choice buttons; one shared display area.
// Click the active Candy again to close it.
// ==================================================

const cousinGrammarCandy =
    document.querySelector("#lesson-2-cousin-grammar-candy");

const cousinGrammarCandyDisplay =
    document.querySelector("#lesson-2-cousin-grammar-candy-display");


cousinGrammarCandy
    ?.querySelectorAll("[data-cousin-candy]")
    .forEach((button) => {

        button.addEventListener("click", () => {

            const candyKey =
                button.dataset.cousinCandy;

            const wasActive =
                button.classList.contains("is-active");


            // Clear both buttons first.
            cousinGrammarCandy
                .querySelectorAll("[data-cousin-candy]")
                .forEach((choice) => {

                    choice.classList.remove("is-active");
                    choice.setAttribute("aria-pressed", "false");

                });


            // Hide both graphics first.
            cousinGrammarCandy
                .querySelectorAll("[data-cousin-candy-panel]")
                .forEach((panel) => {

                    panel.hidden = true;

                });


            // Clicking the currently open Candy closes the display.
            if (wasActive) {

                if (cousinGrammarCandyDisplay) {
                    cousinGrammarCandyDisplay.hidden = true;
                }

                return;
            }


            // Find the graphic that belongs to the selected Candy.
            const selectedPanel =
                cousinGrammarCandy.querySelector(
                    `[data-cousin-candy-panel="${candyKey}"]`
                );


            button.classList.add("is-active");
            button.setAttribute("aria-pressed", "true");


            if (selectedPanel) {
                selectedPanel.hidden = false;
            }


            if (cousinGrammarCandyDisplay) {
                cousinGrammarCandyDisplay.hidden = false;
            }

        });

    });


// One universal control closes whichever cousin Grammar Candy is open.
document
    .querySelector("#lesson-2-cousin-grammar-candy-collapse")
    ?.addEventListener("click", () => {

        cousinGrammarCandy
            ?.querySelectorAll("[data-cousin-candy]")
            .forEach((choice) => {

                choice.classList.remove("is-active");
                choice.setAttribute("aria-pressed", "false");

            });


        cousinGrammarCandy
            ?.querySelectorAll("[data-cousin-candy-panel]")
            .forEach((panel) => {

                panel.hidden = true;

            });


        if (cousinGrammarCandyDisplay) {
            cousinGrammarCandyDisplay.hidden = true;
        }

    });


// ==================================================
// LESSON 3 — IN-LAW & MARITAL STATUS GRAMMAR CANDY
// Four choice buttons; one shared display area.
// Click the active Candy again to close it.
// Same pattern as the Lesson 2 cousin Grammar Candy
// above — only the id/data-attribute names change.
// ==================================================

const inlawGrammarCandy =
    document.querySelector("#lesson-3-inlaw-grammar-candy");

const inlawGrammarCandyDisplay =
    document.querySelector("#lesson-3-inlaw-grammar-candy-display");


inlawGrammarCandy
    ?.querySelectorAll("[data-inlaw-candy]")
    .forEach((button) => {

        button.addEventListener("click", () => {

            const candyKey =
                button.dataset.inlawCandy;

            const wasActive =
                button.classList.contains("is-active");


            // Clear all four buttons first.
            inlawGrammarCandy
                .querySelectorAll("[data-inlaw-candy]")
                .forEach((choice) => {

                    choice.classList.remove("is-active");
                    choice.setAttribute("aria-pressed", "false");

                });


            // Hide all four graphics first.
            inlawGrammarCandy
                .querySelectorAll("[data-inlaw-candy-panel]")
                .forEach((panel) => {

                    panel.hidden = true;

                });


            // Clicking the currently open Candy closes the display.
            if (wasActive) {

                if (inlawGrammarCandyDisplay) {
                    inlawGrammarCandyDisplay.hidden = true;
                }

                return;
            }


            // Find the graphic that belongs to the selected Candy.
            const selectedPanel =
                inlawGrammarCandy.querySelector(
                    `[data-inlaw-candy-panel="${candyKey}"]`
                );


            button.classList.add("is-active");
            button.setAttribute("aria-pressed", "true");


            if (selectedPanel) {
                selectedPanel.hidden = false;
            }


            if (inlawGrammarCandyDisplay) {
                inlawGrammarCandyDisplay.hidden = false;
            }

        });

    });


// One universal control closes whichever in-law Grammar Candy is open.
document
    .querySelector("#lesson-3-inlaw-grammar-candy-collapse")
    ?.addEventListener("click", () => {

        inlawGrammarCandy
            ?.querySelectorAll("[data-inlaw-candy]")
            .forEach((choice) => {

                choice.classList.remove("is-active");
                choice.setAttribute("aria-pressed", "false");

            });


        inlawGrammarCandy
            ?.querySelectorAll("[data-inlaw-candy-panel]")
            .forEach((panel) => {

                panel.hidden = true;

            });


        if (inlawGrammarCandyDisplay) {
            inlawGrammarCandyDisplay.hidden = true;
        }

    });


// ==================================================
// LESSON 1 — GRAMMAR CANDY
// Four choice buttons; one shared display area.
// Click the active Candy again to close it.
// Same pattern as the Lesson 2 cousin and Lesson 3
// in-law Grammar Candy above — only the id/data-
// attribute names change.
// ==================================================

const lesson1GrammarCandy =
    document.querySelector("#lesson-1-grammar-candy");

const lesson1GrammarCandyDisplay =
    document.querySelector("#lesson-1-grammar-candy-display");


lesson1GrammarCandy
    ?.querySelectorAll("[data-lesson1-candy]")
    .forEach((button) => {

        button.addEventListener("click", () => {

            const candyKey =
                button.dataset.lesson1Candy;

            const wasActive =
                button.classList.contains("is-active");


            // Clear all four buttons first.
            lesson1GrammarCandy
                .querySelectorAll("[data-lesson1-candy]")
                .forEach((choice) => {

                    choice.classList.remove("is-active");
                    choice.setAttribute("aria-pressed", "false");

                });


            // Hide all four graphics first.
            lesson1GrammarCandy
                .querySelectorAll("[data-lesson1-candy-panel]")
                .forEach((panel) => {

                    panel.hidden = true;

                });


            // Clicking the currently open Candy closes the display.
            if (wasActive) {

                if (lesson1GrammarCandyDisplay) {
                    lesson1GrammarCandyDisplay.hidden = true;
                }

                return;
            }


            // Find the graphic that belongs to the selected Candy.
            const selectedPanel =
                lesson1GrammarCandy.querySelector(
                    `[data-lesson1-candy-panel="${candyKey}"]`
                );


            button.classList.add("is-active");
            button.setAttribute("aria-pressed", "true");


            if (selectedPanel) {
                selectedPanel.hidden = false;
            }


            if (lesson1GrammarCandyDisplay) {
                lesson1GrammarCandyDisplay.hidden = false;
            }

        });

    });


// One universal control closes whichever Lesson 1 Grammar Candy is open.
document
    .querySelector("#lesson-1-grammar-candy-collapse")
    ?.addEventListener("click", () => {

        lesson1GrammarCandy
            ?.querySelectorAll("[data-lesson1-candy]")
            .forEach((choice) => {

                choice.classList.remove("is-active");
                choice.setAttribute("aria-pressed", "false");

            });


        lesson1GrammarCandy
            ?.querySelectorAll("[data-lesson1-candy-panel]")
            .forEach((panel) => {

                panel.hidden = true;

            });


        if (lesson1GrammarCandyDisplay) {
            lesson1GrammarCandyDisplay.hidden = true;
        }

    });


// ==================================================
// LESSON 2 — EMBEDDED LANGUAGE DISCOVERIES
// Notice → Try → Understand
// These are NOT Grammar Candy.
// ==================================================


// --------------------------------------------------
// DISCOVERY 1 — ADD INFORMATION
// Older / Younger / Twin
// --------------------------------------------------

document
    .querySelectorAll("#family-descriptor-discovery [data-descriptor-demo]")
    .forEach((demo) => {

        const button =
            demo.querySelector(".descriptor-reveal");

        const result =
            demo.querySelector(".descriptor-demo__result");

        const russian =
            result?.querySelector("strong");

        const meaning =
            result?.querySelector("span");


        button?.addEventListener("click", () => {

            const isOpen =
                !result.hidden;


            if (isOpen) {

                result.hidden = true;
                button.classList.remove("is-active");
                return;
            }


            russian.textContent =
                button.dataset.result;

            meaning.textContent =
                button.dataset.meaning;

            result.hidden = false;
            button.classList.add("is-active");

        });

    });


// --------------------------------------------------
// DISCOVERY 2 — WHOSE FAMILY?
// твой / его / её / их
// --------------------------------------------------

const ownerChoices =
    document.querySelectorAll(
        "#family-owner-discovery .owner-choice"
    );

const ownerRussian =
    document.querySelector("#owner-live-russian");

const ownerEnglish =
    document.querySelector("#owner-live-english");

const ownerListen =
    document.querySelector("#owner-live-listen");


ownerChoices.forEach((button) => {

    button.addEventListener("click", () => {

        ownerChoices.forEach((choice) => {
            choice.classList.remove("is-active");
        });


        button.classList.add("is-active");


        const word =
            button.dataset.ownerWord;

        const meaning =
            button.dataset.ownerMeaning;

        const sentence =
            button.dataset.ownerSentence;


        if (ownerRussian) {
            ownerRussian.textContent = sentence;
        }


        if (ownerEnglish) {
            ownerEnglish.textContent =
                `${meaning.charAt(0).toUpperCase() + meaning.slice(1)} brother lives in Moscow.`;
        }


        if (ownerListen) {
            ownerListen.dataset.speak = sentence;
            ownerListen.disabled = false;
        }

    });

});


// Quick Try — Anna's brother = её брат
document
    .querySelectorAll(
        "#family-owner-discovery [data-owner-answer]"
    )
    .forEach((button) => {

        button.addEventListener("click", () => {

            const feedback =
                document.querySelector(
                    "#owner-challenge-feedback"
                );

            const buttons =
                document.querySelectorAll(
                    "#family-owner-discovery [data-owner-answer]"
                );


            buttons.forEach((choice) => {
                choice.classList.remove("selected");
            });


            button.classList.add("selected");


            const isCorrect =
                button.dataset.ownerAnswer === "её";


            if (feedback) {

                feedback.textContent =
                    isCorrect
                        ? "Exactly — Anna is female, so you are talking about her brother: её брат."
                        : "Not quite. The family belongs to Anna. Which word means \"her\"?";

                feedback.className =
                    "feedback " +
                    (isCorrect ? "good" : "bad");

            }

        });

    });


// --------------------------------------------------
// DISCOVERY 3 — ASK AND ANSWER
// жить stays живёт no matter whose family it is
// --------------------------------------------------

const familyLiveChoices =
    document.querySelectorAll(
        "#live-verb-discovery .owner-choice"
    );

const familyLiveQuestionRu =
    document.querySelector("#family-live-question-ru");

const familyLiveQuestionEn =
    document.querySelector("#family-live-question-en");

const familyLiveAnswerRu =
    document.querySelector("#family-live-answer-ru");

const familyLiveAnswerEn =
    document.querySelector("#family-live-answer-en");

const familyLiveListen =
    document.querySelector("#family-live-listen");

const familyLivePayoff =
    document.querySelector("#live-verb-payoff");

const familyLiveCompareLabel =
    document.querySelector("#family-live-compare-label");

const familyLiveCompareSentence =
    document.querySelector("#family-live-compare-sentence");


familyLiveChoices.forEach((button) => {

    button.addEventListener("click", () => {

        familyLiveChoices.forEach((choice) => {
            choice.classList.remove("is-active");
        });


        button.classList.add("is-active");


        const questionRu =
            button.dataset.familyQuestionRu;

        const questionEn =
            button.dataset.familyQuestionEn;

        const answerRu =
            button.dataset.familyAnswerRu;

        const answerEn =
            button.dataset.familyAnswerEn;

        const personLabel =
            button.dataset.familyPersonLabel;


        if (familyLiveQuestionRu) {
            familyLiveQuestionRu.textContent = questionRu;
        }


        if (familyLiveQuestionEn) {
            familyLiveQuestionEn.textContent = questionEn;
        }


        if (familyLiveAnswerRu) {
            familyLiveAnswerRu.textContent = answerRu;
        }


        if (familyLiveAnswerEn) {
            familyLiveAnswerEn.textContent = answerEn;
        }


        if (familyLiveListen) {
            familyLiveListen.dataset.speak = answerRu;
            familyLiveListen.disabled = false;
        }


        if (familyLiveCompareLabel) {
            familyLiveCompareLabel.textContent = personLabel;
        }


        if (familyLiveCompareSentence) {
            familyLiveCompareSentence.textContent = answerRu;
        }


        if (familyLivePayoff) {
            familyLivePayoff.hidden = false;
        }

    });

});


// --------------------------------------------------
// LESSON 3 — WATCH ЛЮБИТЬ CHANGE WITH EVERY SUBJECT
// Same owner-choice mechanic as Lesson 2 Discovery 2,
// except the object is fixed (свою семью) so only the
// subject/verb pair changes on screen.
// --------------------------------------------------

const lyubitChoices =
    document.querySelectorAll(
        "#lyubit-subject-discovery .owner-choice"
    );

const lyubitLiveRussian =
    document.querySelector("#lyubit-live-russian");

const lyubitLiveEnglish =
    document.querySelector("#lyubit-live-english");

const lyubitLiveListen =
    document.querySelector("#lyubit-live-listen");


lyubitChoices.forEach((button) => {

    button.addEventListener("click", () => {

        lyubitChoices.forEach((choice) => {
            choice.classList.remove("is-active");
        });


        button.classList.add("is-active");


        const sentence =
            button.dataset.lyubitSentence;

        const english =
            button.dataset.lyubitEnglish;


        if (lyubitLiveRussian) {
            lyubitLiveRussian.textContent = sentence;
        }


        if (lyubitLiveEnglish) {
            lyubitLiveEnglish.textContent = english;
        }


        if (lyubitLiveListen) {
            lyubitLiveListen.dataset.speak = sentence;
            lyubitLiveListen.disabled = false;
        }

    });

});


// Quick Try — они любят свою семью
document
    .querySelectorAll(
        "#lyubit-subject-discovery [data-lyubit-answer]"
    )
    .forEach((button) => {

        button.addEventListener("click", () => {

            const feedback =
                document.querySelector(
                    "#lyubit-challenge-feedback"
                );

            const buttons =
                document.querySelectorAll(
                    "#lyubit-subject-discovery [data-lyubit-answer]"
                );


            buttons.forEach((choice) => {
                choice.classList.remove("selected");
            });


            button.classList.add("selected");


            const isCorrect =
                button.dataset.lyubitAnswer === "любят";


            if (feedback) {

                feedback.textContent =
                    isCorrect
                        ? "Exactly — они (they) takes любят."
                        : "Not quite. The subject is они (they). Which ending goes with они?";

                feedback.className =
                    "feedback " +
                    (isCorrect ? "good" : "bad");

            }

        });

    });


// ==================================================
// PASS 1 — THE COMBINATOR
// Two independent dials: possessive + family noun
// ==================================================

(() => {

    const root =
        document.querySelector("#pass-1-combinator");

    if (!root) {
        return;
    }

    const dialButtons =
        [...root.querySelectorAll(".owner-choice[data-dial]")];

    const livePhrase =
        root.querySelector("#pass1-live-phrase");

    const listenBtn =
        root.querySelector("#pass1-listen");

    const sayBtn =
        root.querySelector("#pass1-say");

    const feedback =
        root.querySelector("#pass1-feedback");

    let selectedPossessive = null;
    let selectedNoun = null;
    let selectedNounGender = null;

    const wrongAttemptsByNoun = {};


    function updatePhrase() {

        const possessiveText =
            selectedPossessive || "___";

        const nounText =
            selectedNoun || "___";

        livePhrase.textContent =
            `${possessiveText} ${nounText}`;


        if (!selectedPossessive || !selectedNoun) {

            listenBtn.disabled = true;
            listenBtn.dataset.speak = "";

            sayBtn.disabled = true;
            sayBtn.dataset.target = "";

            feedback.textContent = "";
            feedback.className = "feedback";

            return;
        }


        listenBtn.disabled = false;
        listenBtn.dataset.speak =
            `${selectedPossessive} ${selectedNoun}`;


        const isCorrect =
            selectedPossessive === selectedNounGender;


        if (isCorrect) {

            sayBtn.disabled = false;
            sayBtn.dataset.target =
                `${selectedPossessive} ${selectedNoun}`;

            feedback.textContent =
                "That's right!";

            feedback.className =
                "feedback good";

            return;
        }


        sayBtn.disabled = true;
        sayBtn.dataset.target = "";

        const attempts =
            (wrongAttemptsByNoun[selectedNoun] || 0) + 1;

        wrongAttemptsByNoun[selectedNoun] = attempts;

        feedback.textContent =
            attempts === 1
                ? "Does that sound right to you? Have you chosen the right pronoun?"
                : `${selectedNoun} is a word that needs ${selectedNounGender} — try choosing it again.`;

        feedback.className =
            "feedback bad";

    }


    dialButtons.forEach((button) => {

        button.addEventListener("click", () => {

            const dial =
                button.dataset.dial;

            root
                .querySelectorAll(`.owner-choice[data-dial="${dial}"]`)
                .forEach((choice) => {
                    choice.classList.remove("is-active");
                });

            button.classList.add("is-active");


            if (dial === "possessive") {

                selectedPossessive =
                    button.dataset.value;

            } else {

                selectedNoun =
                    button.dataset.value;

                selectedNounGender =
                    button.dataset.gender;

            }

            updatePhrase();

        });

    });

})();

// ==================================================
// PASS 2 — TYPE IT YOURSELF
// Typed possessive blanks: мать, отец, семья
// ==================================================

(() => {

    const container =
        document.querySelector("#pass2-rows");

    if (!container) {
        return;
    }

    const rows =
        [...container.querySelectorAll(".pass2-row")];

    // Reuse the same shuffle() already defined for
    // the Match What You Know practice activity.
    shuffle(rows).forEach((row) => {
        container.appendChild(row);
    });


    const wrongAttemptsByNoun = {};


    rows.forEach((row) => {

        const noun =
            row.dataset.noun;

        const gender =
            row.dataset.gender;

        const input =
            row.querySelector(".pass2-input");

        const listenBtn =
            row.querySelector(".listen");

        const sayBtn =
            row.querySelector(".say");

        const feedback =
            row.querySelector(".feedback");


        function checkAnswer() {

            const typed =
                normalize(input.value);

            if (!typed) {
                return;
            }


            listenBtn.disabled = false;
            listenBtn.dataset.speak =
                `${input.value.trim()} ${noun}`;


            const isCorrect =
                typed === normalize(gender);


            if (isCorrect) {

                sayBtn.disabled = false;
                sayBtn.dataset.target =
                    `${gender} ${noun}`;

                feedback.textContent =
                    "That's right!";

                feedback.className =
                    "feedback good";

                return;
            }


            sayBtn.disabled = true;
            sayBtn.dataset.target = "";

            const attempts =
                (wrongAttemptsByNoun[noun] || 0) + 1;

            wrongAttemptsByNoun[noun] = attempts;

            feedback.textContent =
                attempts === 1
                    ? "Does that sound right to you? Have you chosen the right pronoun?"
                    : `${noun} is a word that needs ${gender} — try typing it again.`;

            feedback.className =
                "feedback bad";

        }


        input.addEventListener("keydown", (e) => {

            if (e.key === "Enter") {
                checkAnswer();
            }

        });

        input.addEventListener("blur", checkAnswer);

    });

})();



// ==================================================
// PASS 3 — INSIDE A REAL SENTENCE
// Predict -> Reveal -> Produce, one item at a time
// ==================================================

(() => {

    const root =
        document.querySelector("#pass-3");

    if (!root) {
        return;
    }

    root.querySelectorAll(".reveal-btn").forEach((button) => {

        button.addEventListener("click", () => {

            const box =
                button.nextElementSibling;

            if (box) {
                box.hidden = false;
            }

            button.disabled = true;

        });

    });


    root.querySelectorAll(".pass3-reveal").forEach((box) => {

        const input =
            box.querySelector(".pass3-input");

        const answer =
            input.dataset.answer;

        const rule =
            box.dataset.rule;

        const listenBtn =
            box.querySelector(".listen");

        const sayBtn =
            box.querySelector(".say");

        const feedback =
            box.querySelector(".feedback");

        let attempts = 0;


        function fullSentence() {

            const before =
                input.previousSibling ? input.previousSibling.textContent : "";

            const after =
                input.nextSibling ? input.nextSibling.textContent : "";

            return `${before}${input.value.trim()}${after}`.trim();

        }


        function checkAnswer() {

            const typed =
                normalize(input.value);

            if (!typed) {
                return;
            }


            listenBtn.disabled = false;
            listenBtn.dataset.speak =
                fullSentence();


            const isCorrect =
                typed === normalize(answer);


            if (isCorrect) {

                sayBtn.disabled = false;
                sayBtn.dataset.target =
                    fullSentence();

                feedback.textContent =
                    "That's right!";

                feedback.className =
                    "feedback good";

                return;
            }


            sayBtn.disabled = true;
            sayBtn.dataset.target = "";

            attempts++;

            feedback.textContent =
                attempts === 1
                    ? "Does that sound right to you? Have you chosen the right pronoun?"
                    : rule;

            feedback.className =
                "feedback bad";

        }


        input.addEventListener("keydown", (e) => {

            if (e.key === "Enter") {
                checkAnswer();
            }

        });

        input.addEventListener("blur", checkAnswer);

    });

})();

