// ==================================================
// NUMBERS FOUNDATION — FR-STYLE SHELL NAVIGATION
// This shell does not yet contain completed lesson activities.
// ==================================================

const numbersSections = [...document.querySelectorAll(".learning-stage")];
const numbersTabs = [...document.querySelectorAll(".stage-tab")];
const numbersRailSections = [...document.querySelectorAll(".journey-rail__section[data-stage]")];
const numbersProgressKey = "michaels-foundations-numbers-shell-progress-v1";

function readNumbersProgress() {
    try {
        return JSON.parse(localStorage.getItem(numbersProgressKey) || "{}");
    } catch (error) {
        return {};
    }
}

function saveNumbersProgress(progress) {
    try {
        localStorage.setItem(numbersProgressKey, JSON.stringify(progress));
    } catch (error) {
        console.warn("Numbers progress could not be saved.", error);
    }
}

function updateNumbersProgress() {
    const counts = {
        learn: { complete: 0, total: 4, id: "lesson-progress-count" },
        build: { complete: 0, total: 2, id: "exercise-progress-count" },
        practice: { complete: 0, total: 6, id: "practice-progress-count" },
        use: { complete: 0, total: 4, id: "use-progress-count" }
    };

    document.querySelectorAll("[data-progress-item]").forEach((section) => {
        const phase = section.dataset.progressItem;
        const checkbox = section.querySelector(".mark-complete");
        if (checkbox && checkbox.checked && counts[phase]) {
            counts[phase].complete++;
        }

        const railLink = document.querySelector(`.journey-rail a[href="#${section.id}"]`);
        const check = railLink?.querySelector(".journey-check");
        if (check) {
            check.textContent = checkbox?.checked ? "✓" : "";
        }
    });

    Object.values(counts).forEach((count) => {
        const element = document.getElementById(count.id);
        if (element) {
            element.textContent = `${count.complete}/${count.total}`;
        }
    });
}

function setNumbersActiveStage(stage) {
    numbersTabs.forEach((tab) => {
        const active = tab.dataset.stage === stage;
        tab.classList.toggle("stage-tab--active", active);
        tab.setAttribute("aria-pressed", String(active));
    });

    numbersRailSections.forEach((section) => {
        section.classList.toggle("journey-rail__section--current", section.dataset.stage === stage);
    });
}

numbersTabs.forEach((tab) => {
    tab.addEventListener("click", () => {
        const stage = tab.dataset.stage;
        document.getElementById(`${stage}-phase`)?.scrollIntoView({ behavior: "smooth" });
        setNumbersActiveStage(stage);
    });
});

const savedNumbersProgress = readNumbersProgress();
document.querySelectorAll(".mark-complete").forEach((checkbox) => {
    checkbox.checked = savedNumbersProgress[checkbox.dataset.completion] === true;
    checkbox.addEventListener("change", () => {
        savedNumbersProgress[checkbox.dataset.completion] = checkbox.checked;
        saveNumbersProgress(savedNumbersProgress);
        updateNumbersProgress();
    });
});

updateNumbersProgress();

// Keep the right-side tabs and Journey Rail synchronized while scrolling.
if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver((entries) => {
        const visible = entries.filter((entry) => entry.isIntersecting);
        if (visible.length) {
            visible.sort((a, b) => b.intersectionRatio - a.intersectionRatio);
            setNumbersActiveStage(visible[0].target.dataset.stage);
        }
    }, { rootMargin: "-10% 0px -40% 0px", threshold: [0, 0.1, 0.3] });
    numbersSections.forEach((section) => observer.observe(section));
}

// Existing shell's listen/speak controls are retained as optional hooks for
// future content, but are not fabricated in the empty lesson sections.
document.querySelectorAll(".listen-button[data-audio]").forEach((button) => {
    button.addEventListener("click", () => {
        const audio = new Audio(button.dataset.audio);
        audio.play().catch((error) => console.warn("Audio playback unavailable:", error));
    });
});

document.querySelectorAll(".speak-button[data-target]").forEach((button) => {
    button.addEventListener("click", () => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        const component = button.closest(".speaking-component");
        if (!SpeechRecognition || !component) {
            return;
        }

        const recognition = new SpeechRecognition();
        recognition.lang = "ru-RU";
        recognition.interimResults = false;
        recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            const heardBox = component.querySelector(".heard-text");
            const resultBox = component.querySelector(".result-text");
            if (heardBox) {
                heardBox.textContent = `I heard: ${transcript}`;
            }
            if (resultBox) {
                const correct = transcript.toLowerCase().includes(button.dataset.target.toLowerCase());
                resultBox.textContent = correct ? "You said it correctly" : "Almost! Try again";
                resultBox.style.color = correct ? "green" : "red";
            }
        };
        recognition.start();
    });
});


// ============================================================
// LESSON 1 — LISTENING AND NUMBER MATCHING
// All controls and matching choices are authored in HTML.
// ============================================================

const lessonOneSpeech = window.speechSynthesis || null;
const lessonOneAudioStatus = document.getElementById("numbers-audio-status");
const lessonOneNumbers = [
    "ноль",
    "один",
    "два",
    "три",
    "четыре",
    "пять",
    "шесть",
    "семь",
    "восемь",
    "девять",
    "десять"
];

let lessonOnePlayAllActive = false;

function stopLessonOneAudio() {
    lessonOnePlayAllActive = false;

    if (lessonOneSpeech) {
        lessonOneSpeech.cancel();
    }

    if (lessonOneAudioStatus) {
        lessonOneAudioStatus.textContent = "Playback stopped.";
    }
}

function speakLessonOneNumber(word, onFinished) {
    if (!lessonOneSpeech || !window.SpeechSynthesisUtterance) {
        lessonOneAudioStatus.textContent = "Speech playback is not available in this browser.";
        return;
    }

    const utterance = new SpeechSynthesisUtterance(word);
    utterance.lang = "ru-RU";
    utterance.rate = 0.85;

    const russianVoice = lessonOneSpeech.getVoices().find((voice) => {
        return voice.lang.toLowerCase().startsWith("ru");
    });

    if (russianVoice) {
        utterance.voice = russianVoice;
    }

    utterance.onend = () => {
        if (typeof onFinished === "function") {
            onFinished();
        }
    };

    utterance.onerror = () => {
        lessonOnePlayAllActive = false;
        lessonOneAudioStatus.textContent = "Speech playback was interrupted or unavailable.";
    };

    lessonOneAudioStatus.textContent = `Listening: ${word}`;
    lessonOneSpeech.speak(utterance);
}

function playLessonOneSequence(index) {
    if (!lessonOnePlayAllActive) {
        return;
    }

    if (index >= lessonOneNumbers.length) {
        lessonOnePlayAllActive = false;
        lessonOneAudioStatus.textContent = "Finished playing numbers 0–10.";
        return;
    }

    speakLessonOneNumber(lessonOneNumbers[index], () => {
        playLessonOneSequence(index + 1);
    });
}

document.querySelectorAll(".number-listen").forEach((button) => {
    button.addEventListener("click", () => {
        stopLessonOneAudio();
        speakLessonOneNumber(button.dataset.say);
    });
});

document.getElementById("numbers-play-all")?.addEventListener("click", () => {
    stopLessonOneAudio();
    lessonOnePlayAllActive = true;
    playLessonOneSequence(0);
});

document.getElementById("numbers-stop-audio")?.addEventListener("click", () => {
    stopLessonOneAudio();
});

const lessonOneMatchColumns = {
    russian: document.getElementById("numbers-russian-choices"),
    english: document.getElementById("numbers-english-choices")
};

const lessonOneMatchFeedback = document.getElementById("numbers-match-feedback");
let lessonOneMatchSelections = {
    russian: null,
    english: null
};
let lessonOneMatchedCount = 0;

function updateLessonOneMatchFeedback(message) {
    lessonOneMatchFeedback.textContent = message;
}

function clearLessonOneSelection() {
    Object.values(lessonOneMatchSelections).forEach((button) => {
        if (button) {
            button.classList.remove("is-selected");
            button.setAttribute("aria-pressed", "false");
        }
    });

    lessonOneMatchSelections = {
        russian: null,
        english: null
    };
}

function checkLessonOneMatch() {
    const russian = lessonOneMatchSelections.russian;
    const english = lessonOneMatchSelections.english;

    if (!russian || !english) {
        return;
    }

    if (russian.dataset.matchValue === english.dataset.matchValue) {
        russian.classList.add("is-matched");
        english.classList.add("is-matched");
        russian.disabled = true;
        english.disabled = true;
        lessonOneMatchedCount += 1;

        clearLessonOneSelection();

        if (lessonOneMatchedCount === 11) {
            updateLessonOneMatchFeedback("Excellent! You matched all 11 numbers. You can reset and replay.");
        } else {
            updateLessonOneMatchFeedback(`Correct! Matched: ${lessonOneMatchedCount} of 11 pairs.`);
        }
    } else {
        clearLessonOneSelection();
        updateLessonOneMatchFeedback(`Not quite. Try another pair. Matched: ${lessonOneMatchedCount} of 11.`);
    }
}


/**
 * Pronounce the selected matching tile in its own language.
 * English tiles use an English voice; Russian tiles use a Russian voice.
 */
function speakLessonOneMatchTile(button) {
    if (!lessonOneSpeech || !window.SpeechSynthesisUtterance) {
        updateLessonOneMatchFeedback("Speech playback is not supported by this browser.");
        return;
    }

    // Stop any earlier utterance or Play All sequence before speaking the tile.
    stopLessonOneAudio();

    const language = button.dataset.matchSide === "russian" ? "ru-RU" : "en-US";
    const word = button.textContent.trim();
    const utterance = new SpeechSynthesisUtterance(word);

    utterance.lang = language;
    utterance.rate = 0.85;

    const matchingVoice = lessonOneSpeech.getVoices().find((voice) => {
        return voice.lang.toLowerCase().startsWith(language.slice(0, 2).toLowerCase());
    });

    if (matchingVoice) {
        utterance.voice = matchingVoice;
    }

    lessonOneSpeech.speak(utterance);
}

document.querySelectorAll(".match-choice").forEach((button) => {
    button.setAttribute("aria-pressed", "false");

    button.addEventListener("click", () => {
        const side = button.dataset.matchSide;

        // Speak every tile as soon as it is selected, even if the pair is incorrect.
        // All tile buttons are defined in HTML; JavaScript only attaches behavior.
        speakLessonOneMatchTile(button);

        const previous = lessonOneMatchSelections[side];

        if (previous) {
            previous.classList.remove("is-selected");
            previous.setAttribute("aria-pressed", "false");
        }

        lessonOneMatchSelections[side] = button;
        button.classList.add("is-selected");
        button.setAttribute("aria-pressed", "true");
        checkLessonOneMatch();
    });
});

function shuffleLessonOneButtons(container) {
    const buttons = Array.from(container.querySelectorAll(".match-choice"));

    for (let index = buttons.length - 1; index > 0; index -= 1) {
        const randomIndex = Math.floor(Math.random() * (index + 1));
        [buttons[index], buttons[randomIndex]] = [buttons[randomIndex], buttons[index]];
    }

    buttons.forEach((button) => {
        container.appendChild(button);
    });
}

document.getElementById("numbers-match-reset")?.addEventListener("click", () => {
    clearLessonOneSelection();
    lessonOneMatchedCount = 0;

    document.querySelectorAll(".match-choice").forEach((button) => {
        button.disabled = false;
        button.classList.remove("is-matched");
        button.setAttribute("aria-pressed", "false");
    });

    shuffleLessonOneButtons(lessonOneMatchColumns.russian);
    shuffleLessonOneButtons(lessonOneMatchColumns.english);
    updateLessonOneMatchFeedback("New round! Matched: 0 of 11 pairs.");
});


// ============================================================
// LESSON 2 — NUMBERS 11–19: AUDIO AND NUMBER BUILDER
// The nine stem buttons and three ending buttons are in HTML.
// JavaScript only changes their order, state, and behavior.
// ============================================================

const lessonTwoWords = [
    { number: 11, word: "одиннадцать", stem: "один" },
    { number: 12, word: "двенадцать", stem: "две" },
    { number: 13, word: "тринадцать", stem: "три" },
    { number: 14, word: "четырнадцать", stem: "четыр" },
    { number: 15, word: "пятнадцать", stem: "пят" },
    { number: 16, word: "шестнадцать", stem: "шест" },
    { number: 17, word: "семнадцать", stem: "сем" },
    { number: 18, word: "восемнадцать", stem: "восем" },
    { number: 19, word: "девятнадцать", stem: "девят" }
];

const lessonTwoSpeech = window.speechSynthesis || null;
const lessonTwoAudioStatus = document.getElementById("numbers-two-audio-status");
const lessonTwoFeedback = document.getElementById("numbers-two-feedback");
const lessonTwoProgress = document.getElementById("numbers-two-progress");
const lessonTwoTarget = document.getElementById("numbers-two-target");
const lessonTwoStemDisplay = document.getElementById("numbers-two-selected-stem");
const lessonTwoEndingDisplay = document.getElementById("numbers-two-selected-ending");
const lessonTwoStemBank = document.getElementById("numbers-two-stem-bank");
const lessonTwoCheckButton = document.getElementById("numbers-two-check");
const lessonTwoNextButton = document.getElementById("numbers-two-next");

let lessonTwoSpeechSequence = false;
let lessonTwoRound = [];
let lessonTwoRoundIndex = 0;
let lessonTwoSelectedStem = "";
let lessonTwoSelectedEnding = "";
let lessonTwoAnswerCorrect = false;
let lessonTwoRoundComplete = false;

function stopLessonTwoSpeech() {
    lessonTwoSpeechSequence = false;

    if (lessonTwoSpeech) {
        lessonTwoSpeech.cancel();
    }
}

function speakLessonTwo(word, onFinished) {
    if (!lessonTwoSpeech || !window.SpeechSynthesisUtterance) {
        if (lessonTwoAudioStatus) {
            lessonTwoAudioStatus.textContent =
                "Russian speech playback is unavailable in this browser.";
        }

        return;
    }

    const utterance = new SpeechSynthesisUtterance(word);
    utterance.lang = "ru-RU";
    utterance.rate = 0.85;

    const russianVoice = lessonTwoSpeech.getVoices().find((voice) => {
        return voice.lang.toLowerCase().startsWith("ru");
    });

    if (russianVoice) {
        utterance.voice = russianVoice;
    }

    utterance.onend = () => {
        if (typeof onFinished === "function") {
            onFinished();
        }
    };

    utterance.onerror = () => {
        lessonTwoSpeechSequence = false;

        if (lessonTwoAudioStatus) {
            lessonTwoAudioStatus.textContent =
                "Speech playback was interrupted or unavailable.";
        }
    };

    if (lessonTwoAudioStatus) {
        lessonTwoAudioStatus.textContent = `Listening: ${word}`;
    }

    lessonTwoSpeech.speak(utterance);
}

function playLessonTwoSequence(index) {
    if (!lessonTwoSpeechSequence) {
        return;
    }

    if (index >= lessonTwoWords.length) {
        lessonTwoSpeechSequence = false;
        lessonTwoAudioStatus.textContent = "Finished playing numbers 11–19.";
        return;
    }

    speakLessonTwo(lessonTwoWords[index].word, () => {
        playLessonTwoSequence(index + 1);
    });
}

document.querySelectorAll(".numbers-two-listen").forEach((button) => {
    button.addEventListener("click", () => {
        stopLessonTwoSpeech();
        speakLessonTwo(button.dataset.say);
    });
});

document.getElementById("numbers-two-play-all")?.addEventListener("click", () => {
    stopLessonTwoSpeech();
    lessonTwoSpeechSequence = true;
    playLessonTwoSequence(0);
});

document.getElementById("numbers-two-stop")?.addEventListener("click", () => {
    stopLessonTwoSpeech();
    lessonTwoAudioStatus.textContent = "Playback stopped.";
});

function shuffleLessonTwoItems(items) {
    const shuffled = [...items];

    for (let index = shuffled.length - 1; index > 0; index -= 1) {
        const randomIndex = Math.floor(Math.random() * (index + 1));

        [shuffled[index], shuffled[randomIndex]] = [
            shuffled[randomIndex],
            shuffled[index]
        ];
    }

    return shuffled;
}

function selectNewLessonTwoRound() {
    const previousNumbers = lessonTwoRound
        .map((item) => item.number)
        .sort((first, second) => first - second)
        .join(",");

    let candidates = [];
    let candidateNumbers = "";

    do {
        candidates = shuffleLessonTwoItems(lessonTwoWords).slice(0, 3);

        candidateNumbers = candidates
            .map((item) => item.number)
            .sort((first, second) => first - second)
            .join(",");
    } while (candidateNumbers === previousNumbers);

    lessonTwoRound = candidates;
    lessonTwoRoundIndex = 0;
    lessonTwoRoundComplete = false;
}

function shuffleLessonTwoStemButtons() {
    if (!lessonTwoStemBank) {
        return;
    }

    const buttons = shuffleLessonTwoItems(
        Array.from(lessonTwoStemBank.querySelectorAll(".numbers-two-stem"))
    );

    buttons.forEach((button) => {
        lessonTwoStemBank.appendChild(button);
    });
}

function updateLessonTwoSelection() {
    lessonTwoStemDisplay.textContent = lessonTwoSelectedStem || "?";
    lessonTwoEndingDisplay.textContent = lessonTwoSelectedEnding || "?";

    document.querySelectorAll(".numbers-two-stem").forEach((button) => {
        button.setAttribute(
            "aria-pressed",
            String(button.dataset.stem === lessonTwoSelectedStem)
        );
    });

    document.querySelectorAll(".numbers-two-ending").forEach((button) => {
        button.setAttribute(
            "aria-pressed",
            String(button.dataset.ending === lessonTwoSelectedEnding)
        );
    });
}

function showLessonTwoQuestion() {
    const question = lessonTwoRound[lessonTwoRoundIndex];

    lessonTwoSelectedStem = "";
    lessonTwoSelectedEnding = "";
    lessonTwoAnswerCorrect = false;

    lessonTwoTarget.textContent = question.number;
    lessonTwoProgress.textContent = `Number ${lessonTwoRoundIndex + 1} of 3`;
    lessonTwoFeedback.textContent = "Choose two pieces to begin.";
    lessonTwoCheckButton.disabled = false;
    lessonTwoNextButton.disabled = true;
    lessonTwoNextButton.textContent =
        lessonTwoRoundIndex === 2 ? "Finish Round ✓" : "Next Number →";

    shuffleLessonTwoStemButtons();
    updateLessonTwoSelection();
}

function selectLessonTwoPiece(button, type) {
    if (lessonTwoAnswerCorrect || lessonTwoRoundComplete) {
        return;
    }

    if (type === "stem") {
        lessonTwoSelectedStem = button.dataset.stem;
    } else {
        lessonTwoSelectedEnding = button.dataset.ending;
    }

    lessonTwoFeedback.textContent = "Ready to check your answer?";
    updateLessonTwoSelection();
}

document.querySelectorAll(".numbers-two-stem").forEach((button) => {
    button.addEventListener("click", () => {
        selectLessonTwoPiece(button, "stem");
    });
});

document.querySelectorAll(".numbers-two-ending").forEach((button) => {
    button.addEventListener("click", () => {
        selectLessonTwoPiece(button, "ending");
    });
});

lessonTwoCheckButton?.addEventListener("click", () => {
    if (!lessonTwoSelectedStem || !lessonTwoSelectedEnding) {
        lessonTwoFeedback.textContent =
            "Choose both a first piece and an ending.";
        return;
    }

    const question = lessonTwoRound[lessonTwoRoundIndex];
    const constructed = lessonTwoSelectedStem + lessonTwoSelectedEnding;

    if (constructed === question.word) {
        lessonTwoAnswerCorrect = true;
        lessonTwoFeedback.textContent =
            `Correct! ${question.word} means ${question.number}.`;
        lessonTwoCheckButton.disabled = true;
        lessonTwoNextButton.disabled = false;

        stopLessonTwoSpeech();
        speakLessonTwo(question.word);
    } else {
        lessonTwoFeedback.textContent =
            "Not quite. Look closely at the first piece and try again.";
    }
});

lessonTwoNextButton?.addEventListener("click", () => {
    if (!lessonTwoAnswerCorrect) {
        return;
    }

    if (lessonTwoRoundIndex === 2) {
        lessonTwoRoundComplete = true;
        lessonTwoProgress.textContent = "Round complete — 3 of 3!";
        lessonTwoFeedback.textContent =
            "Excellent! You built all three numbers. " +
            "Select Reset & New Numbers for another set.";
        lessonTwoNextButton.disabled = true;
        return;
    }

    lessonTwoRoundIndex += 1;
    showLessonTwoQuestion();
});

document.getElementById("numbers-two-reset")?.addEventListener("click", () => {
    stopLessonTwoSpeech();
    selectNewLessonTwoRound();
    showLessonTwoQuestion();
    lessonTwoFeedback.textContent =
        "New numbers, new challenge! Choose two pieces.";
});

if (lessonTwoTarget) {
    selectNewLessonTwoRound();
    showLessonTwoQuestion();
}


// ============================================================
// LESSON 3 — THE TENS DETECTIVE
// Three unique numbers per round, with a different set on reset.
// Answer buttons are authored in HTML; no controls are created.
// ============================================================

const lessonThreeNumbers = [
    {
        number: 20,
        word: "двадцать",
        distractors: ["двенадцать", "двести"],
        hint: "Twenty is двадцать. Compare it with twelve: двенадцать."
    },
    {
        number: 30,
        word: "тридцать",
        distractors: ["тринадцать", "триста"],
        hint: "Thirty ends in -дцать, not the teen ending -надцать."
    },
    {
        number: 40,
        word: "сорок",
        distractors: ["четырнадцать", "четыредесят"],
        hint: "Forty is a special form: сорок. It does not use -десят."
    },
    {
        number: 50,
        word: "пятьдесят",
        distractors: ["пятнадцать", "пятьсот"],
        hint: "Fifty uses the -десят pattern: пятьдесят."
    },
    {
        number: 60,
        word: "шестьдесят",
        distractors: ["шестнадцать", "шестьсот"],
        hint: "Sixty uses -десят: шестьдесят."
    },
    {
        number: 70,
        word: "семьдесят",
        distractors: ["семнадцать", "семьсот"],
        hint: "Seventy is семьдесят. Listen for stress on the first part."
    },
    {
        number: 80,
        word: "восемьдесят",
        distractors: ["восемнадцать", "восемьсот"],
        hint: "Eighty uses -десят: восемьдесят."
    },
    {
        number: 90,
        word: "девяносто",
        distractors: ["девятьдесят", "девятнадцать"],
        hint: "Ninety is another special form: девяносто."
    }
];

const lessonThreeSpeech = window.speechSynthesis || null;
const lessonThreeAudioStatus = document.getElementById("numbers-three-audio-status");
const lessonThreeProgress = document.getElementById("numbers-three-progress");
const lessonThreeTarget = document.getElementById("numbers-three-target");
const lessonThreeFeedback = document.getElementById("numbers-three-feedback");
const lessonThreeChoiceBank = document.getElementById("numbers-three-choice-bank");
const lessonThreeChoiceButtons = Array.from(
    document.querySelectorAll(".numbers-three-choice")
);
const lessonThreeCheckButton = document.getElementById("numbers-three-check");
const lessonThreeNextButton = document.getElementById("numbers-three-next");

const lessonThreeSpokenWords = [
    "десять",
    "двадцать",
    "тридцать",
    "сорок",
    "пятьдесят",
    "шестьдесят",
    "семьдесят",
    "восемьдесят",
    "девяносто"
];

let lessonThreePlayAllActive = false;
let lessonThreeRound = [];
let lessonThreeRoundIndex = 0;
let lessonThreeSelectedButton = null;
let lessonThreeAnswerCorrect = false;
let lessonThreeRoundComplete = false;

function stopLessonThreeSpeech() {
    lessonThreePlayAllActive = false;

    if (lessonThreeSpeech) {
        lessonThreeSpeech.cancel();
    }
}

function speakLessonThreeNumber(word, onFinished) {
    if (!lessonThreeSpeech || !window.SpeechSynthesisUtterance) {
        if (lessonThreeAudioStatus) {
            lessonThreeAudioStatus.textContent =
                "Russian speech playback is unavailable in this browser.";
        }

        return;
    }

    const utterance = new SpeechSynthesisUtterance(word);
    utterance.lang = "ru-RU";
    utterance.rate = 0.85;

    const russianVoice = lessonThreeSpeech.getVoices().find((voice) => {
        return voice.lang.toLowerCase().startsWith("ru");
    });

    if (russianVoice) {
        utterance.voice = russianVoice;
    }

    utterance.onend = () => {
        if (typeof onFinished === "function") {
            onFinished();
        }
    };

    utterance.onerror = () => {
        lessonThreePlayAllActive = false;

        if (lessonThreeAudioStatus) {
            lessonThreeAudioStatus.textContent =
                "Speech playback was interrupted or unavailable.";
        }
    };

    if (lessonThreeAudioStatus) {
        lessonThreeAudioStatus.textContent = `Listening: ${word}`;
    }

    lessonThreeSpeech.speak(utterance);
}

function playLessonThreeSequence(index) {
    if (!lessonThreePlayAllActive) {
        return;
    }

    if (index >= lessonThreeSpokenWords.length) {
        lessonThreePlayAllActive = false;
        lessonThreeAudioStatus.textContent =
            "Finished playing the tens from 10 to 90.";
        return;
    }

    speakLessonThreeNumber(lessonThreeSpokenWords[index], () => {
        playLessonThreeSequence(index + 1);
    });
}

document.querySelectorAll(".numbers-three-listen").forEach((button) => {
    button.addEventListener("click", () => {
        stopLessonThreeSpeech();
        speakLessonThreeNumber(button.dataset.say);
    });
});

document.getElementById("numbers-three-play-all")?.addEventListener("click", () => {
    stopLessonThreeSpeech();
    lessonThreePlayAllActive = true;
    playLessonThreeSequence(0);
});

document.getElementById("numbers-three-stop")?.addEventListener("click", () => {
    stopLessonThreeSpeech();
    lessonThreeAudioStatus.textContent = "Playback stopped.";
});

function shuffleLessonThreeItems(items) {
    const shuffled = [...items];

    for (let index = shuffled.length - 1; index > 0; index -= 1) {
        const randomIndex = Math.floor(Math.random() * (index + 1));

        [shuffled[index], shuffled[randomIndex]] = [
            shuffled[randomIndex],
            shuffled[index]
        ];
    }

    return shuffled;
}

function selectNewLessonThreeRound() {
    const previousNumbers = lessonThreeRound.map((item) => item.number);
    const previousKey = [...previousNumbers].sort((a, b) => a - b).join(",");

    let newRound = [];
    let newKey = "";

    do {
        newRound = shuffleLessonThreeItems(lessonThreeNumbers).slice(0, 3);
        newKey = newRound
            .map((item) => item.number)
            .sort((a, b) => a - b)
            .join(",");
    } while (newKey === previousKey);

    lessonThreeRound = newRound;
    lessonThreeRoundIndex = 0;
    lessonThreeRoundComplete = false;
}

function clearLessonThreeSelection() {
    lessonThreeSelectedButton = null;

    lessonThreeChoiceButtons.forEach((button) => {
        button.setAttribute("aria-pressed", "false");
    });
}

function showLessonThreeQuestion() {
    const question = lessonThreeRound[lessonThreeRoundIndex];
    const options = shuffleLessonThreeItems([
        question.word,
        ...question.distractors
    ]);

    clearLessonThreeSelection();
    lessonThreeAnswerCorrect = false;

    lessonThreeTarget.textContent = question.number;
    lessonThreeProgress.textContent = `Number ${lessonThreeRoundIndex + 1} of 3`;
    lessonThreeFeedback.textContent = "Select an answer to begin.";
    lessonThreeCheckButton.disabled = false;
    lessonThreeNextButton.disabled = true;
    lessonThreeNextButton.textContent =
        lessonThreeRoundIndex === 2 ? "Finish Round ✓" : "Next Number →";

    lessonThreeChoiceButtons.forEach((button, index) => {
        button.textContent = options[index];
        button.dataset.answer = options[index];
        button.disabled = false;
    });

    // Rearrange existing HTML-authored buttons rather than creating new ones.
    shuffleLessonThreeItems(lessonThreeChoiceButtons).forEach((button) => {
        lessonThreeChoiceBank.appendChild(button);
    });
}

lessonThreeChoiceButtons.forEach((button) => {
    button.addEventListener("click", () => {
        if (lessonThreeAnswerCorrect || lessonThreeRoundComplete) {
            return;
        }

        clearLessonThreeSelection();
        lessonThreeSelectedButton = button;
        button.setAttribute("aria-pressed", "true");
        lessonThreeFeedback.textContent = "Ready to check your answer?";
    });
});

lessonThreeCheckButton?.addEventListener("click", () => {
    if (!lessonThreeSelectedButton) {
        lessonThreeFeedback.textContent = "Choose one of the three answers.";
        return;
    }

    const question = lessonThreeRound[lessonThreeRoundIndex];

    if (lessonThreeSelectedButton.dataset.answer === question.word) {
        lessonThreeAnswerCorrect = true;
        lessonThreeFeedback.textContent =
            `Correct! ${question.word} means ${question.number}. ${question.hint}`;
        lessonThreeCheckButton.disabled = true;
        lessonThreeNextButton.disabled = false;

        stopLessonThreeSpeech();
        speakLessonThreeNumber(question.word);
    } else {
        lessonThreeFeedback.textContent =
            `Not quite. ${question.hint} Try another answer.`;
    }
});

lessonThreeNextButton?.addEventListener("click", () => {
    if (!lessonThreeAnswerCorrect) {
        return;
    }

    if (lessonThreeRoundIndex === 2) {
        lessonThreeRoundComplete = true;
        lessonThreeProgress.textContent = "Round complete — 3 of 3!";
        lessonThreeFeedback.textContent =
            "Excellent detective work! You solved all three numbers. " +
            "Select Reset & New Numbers for another set.";
        lessonThreeNextButton.disabled = true;
        return;
    }

    lessonThreeRoundIndex += 1;
    showLessonThreeQuestion();
});

document.getElementById("numbers-three-reset")?.addEventListener("click", () => {
    stopLessonThreeSpeech();
    selectNewLessonThreeRound();
    showLessonThreeQuestion();
    lessonThreeFeedback.textContent =
        "A new set of three numbers is ready. Find the first answer!";
});

if (lessonThreeTarget && lessonThreeChoiceButtons.length === 3) {
    selectNewLessonThreeRound();
    showLessonThreeQuestion();
}

// ============================================================
// LESSON 4 — HUNDREDS WORKSHOP
// Three different numbers per round. Reset changes the set.
// All answer buttons already exist in the HTML.
// ============================================================

const lessonFourNumbers = [
    { number: 100, word: "сто", distractors: ["сто́т", "десять"], hint: "One hundred is simply сто." },
    { number: 200, word: "двести", distractors: ["двасот", "двадцать"], hint: "Two hundred has a special form: двести." },
    { number: 300, word: "триста", distractors: ["тридцать", "тринадцать"], hint: "Three hundred is триста, with -ста." },
    { number: 400, word: "четыреста", distractors: ["четыресот", "сорок"], hint: "Four hundred is четыреста, with -ста." },
    { number: 500, word: "пятьсот", distractors: ["пятьдесят", "пятнадцать"], hint: "Five hundred uses -сот: пятьсот." },
    { number: 600, word: "шестьсот", distractors: ["шестьдесят", "шестнадцать"], hint: "Six hundred uses -сот: шестьсот." },
    { number: 700, word: "семьсот", distractors: ["семьдесят", "семнадцать"], hint: "Seven hundred uses -сот: семьсот." },
    { number: 800, word: "восемьсот", distractors: ["восемьдесят", "восемнадцать"], hint: "Eight hundred uses -сот: восемьсот." },
    { number: 900, word: "девятьсот", distractors: ["девяносто", "девятнадцать"], hint: "Nine hundred uses -сот: девятьсот." }
];

const lessonFourSpeech = window.speechSynthesis || null;
const lessonFourAudioStatus = document.getElementById("numbers-four-audio-status");
const lessonFourProgress = document.getElementById("numbers-four-progress");
const lessonFourTarget = document.getElementById("numbers-four-target");
const lessonFourFeedback = document.getElementById("numbers-four-feedback");
const lessonFourChoiceBank = document.getElementById("numbers-four-choice-bank");
const lessonFourChoiceButtons = Array.from(document.querySelectorAll(".numbers-four-choice"));
const lessonFourCheck = document.getElementById("numbers-four-check");
const lessonFourNext = document.getElementById("numbers-four-next");

let lessonFourPlayAll = false;
let lessonFourRound = [];
let lessonFourIndex = 0;
let lessonFourSelection = null;
let lessonFourCorrect = false;
let lessonFourComplete = false;

function stopLessonFourSpeech() {
    lessonFourPlayAll = false;

    if (lessonFourSpeech) {
        lessonFourSpeech.cancel();
    }
}

function speakLessonFourNumber(word, finished) {
    if (!lessonFourSpeech || !window.SpeechSynthesisUtterance) {
        lessonFourAudioStatus.textContent = "Speech playback is unavailable in this browser.";
        return;
    }

    const utterance = new SpeechSynthesisUtterance(word);
    utterance.lang = "ru-RU";
    utterance.rate = 0.85;

    const voice = lessonFourSpeech.getVoices().find((item) => {
        return item.lang.toLowerCase().startsWith("ru");
    });

    if (voice) {
        utterance.voice = voice;
    }

    utterance.onend = () => {
        if (typeof finished === "function") {
            finished();
        }
    };

    utterance.onerror = () => {
        lessonFourPlayAll = false;
        lessonFourAudioStatus.textContent = "Speech playback was interrupted or unavailable.";
    };

    lessonFourAudioStatus.textContent = `Listening: ${word}`;
    lessonFourSpeech.speak(utterance);
}

function playLessonFourSequence(index) {
    if (!lessonFourPlayAll) {
        return;
    }

    if (index >= lessonFourNumbers.length) {
        lessonFourPlayAll = false;
        lessonFourAudioStatus.textContent = "Finished playing hundreds 100–900.";
        return;
    }

    speakLessonFourNumber(lessonFourNumbers[index].word, () => {
        playLessonFourSequence(index + 1);
    });
}

document.querySelectorAll(".numbers-four-listen").forEach((button) => {
    button.addEventListener("click", () => {
        stopLessonFourSpeech();
        speakLessonFourNumber(button.dataset.say);
    });
});

document.getElementById("numbers-four-play-all")?.addEventListener("click", () => {
    stopLessonFourSpeech();
    lessonFourPlayAll = true;
    playLessonFourSequence(0);
});

document.getElementById("numbers-four-stop")?.addEventListener("click", () => {
    stopLessonFourSpeech();
    lessonFourAudioStatus.textContent = "Playback stopped.";
});

function shuffleLessonFour(items) {
    const result = [...items];

    for (let index = result.length - 1; index > 0; index -= 1) {
        const randomIndex = Math.floor(Math.random() * (index + 1));
        [result[index], result[randomIndex]] = [result[randomIndex], result[index]];
    }

    return result;
}

function newLessonFourRound() {
    const previousKey = lessonFourRound
        .map((item) => item.number)
        .sort((a, b) => a - b)
        .join(",");

    let candidate = [];
    let candidateKey = "";

    do {
        candidate = shuffleLessonFour(lessonFourNumbers).slice(0, 3);
        candidateKey = candidate
            .map((item) => item.number)
            .sort((a, b) => a - b)
            .join(",");
    } while (candidateKey === previousKey);

    lessonFourRound = candidate;
    lessonFourIndex = 0;
    lessonFourComplete = false;
}

function clearLessonFourSelection() {
    lessonFourSelection = null;

    lessonFourChoiceButtons.forEach((button) => {
        button.setAttribute("aria-pressed", "false");
    });
}

function showLessonFourQuestion() {
    const question = lessonFourRound[lessonFourIndex];
    const choices = shuffleLessonFour([question.word, ...question.distractors]);

    clearLessonFourSelection();
    lessonFourCorrect = false;
    lessonFourTarget.textContent = question.number;
    lessonFourProgress.textContent = `Number ${lessonFourIndex + 1} of 3`;
    lessonFourFeedback.textContent = "Select an answer to begin.";
    lessonFourCheck.disabled = false;
    lessonFourNext.disabled = true;
    lessonFourNext.textContent = lessonFourIndex === 2 ? "Finish Round ✓" : "Next Number →";

    lessonFourChoiceButtons.forEach((button, index) => {
        button.textContent = choices[index];
        button.dataset.answer = choices[index];
    });

    shuffleLessonFour(lessonFourChoiceButtons).forEach((button) => {
        lessonFourChoiceBank.appendChild(button);
    });
}

lessonFourChoiceButtons.forEach((button) => {
    button.addEventListener("click", () => {
        if (lessonFourCorrect || lessonFourComplete) {
            return;
        }

        clearLessonFourSelection();
        lessonFourSelection = button;
        button.setAttribute("aria-pressed", "true");
        lessonFourFeedback.textContent = "Ready to check your answer?";
    });
});

lessonFourCheck?.addEventListener("click", () => {
    if (!lessonFourSelection) {
        lessonFourFeedback.textContent = "Choose one of the three answers.";
        return;
    }

    const question = lessonFourRound[lessonFourIndex];

    if (lessonFourSelection.dataset.answer === question.word) {
        lessonFourCorrect = true;
        lessonFourFeedback.textContent = `Correct! ${question.word} means ${question.number}. ${question.hint}`;
        lessonFourCheck.disabled = true;
        lessonFourNext.disabled = false;
        stopLessonFourSpeech();
        speakLessonFourNumber(question.word);
    } else {
        lessonFourFeedback.textContent = `Not quite. ${question.hint} Try another answer.`;
    }
});

lessonFourNext?.addEventListener("click", () => {
    if (!lessonFourCorrect) {
        return;
    }

    if (lessonFourIndex === 2) {
        lessonFourComplete = true;
        lessonFourProgress.textContent = "Round complete — 3 of 3!";
        lessonFourFeedback.textContent =
            "Excellent! You solved all three hundreds. Select Reset & New Numbers for another set.";
        lessonFourNext.disabled = true;
        return;
    }

    lessonFourIndex += 1;
    showLessonFourQuestion();
});

document.getElementById("numbers-four-reset")?.addEventListener("click", () => {
    stopLessonFourSpeech();
    newLessonFourRound();
    showLessonFourQuestion();
    lessonFourFeedback.textContent = "A different set of three hundreds is ready!";
});

if (lessonFourTarget && lessonFourChoiceButtons.length === 3) {
    newLessonFourRound();
    showLessonFourQuestion();
}

// =============================================================
// BUILD EXERCISE 1 — 21–99: interactive workshops
// All interactive controls and word-bank tiles are authored in HTML.
// =============================================================
(() => {
    const root = document.getElementById("exercise-1");
    if (!root) return;

    const tensWords = ["двадцать", "тридцать", "сорок", "пятьдесят", "шестьдесят", "семьдесят", "восемьдесят", "девяносто"];
    const unitWords = ["", "один", "два", "три", "четыре", "пять", "шесть", "семь", "восемь", "девять"];
    const $ = (id) => document.getElementById(id);
    const teens = { 11: "одиннадцать", 12: "двенадцать", 13: "тринадцать", 14: "четырнадцать", 15: "пятнадцать", 16: "шестнадцать", 17: "семнадцать", 18: "восемнадцать", 19: "девятнадцать" };
    const smallWords = ["ноль", "один", "два", "три", "четыре", "пять", "шесть", "семь", "восемь", "девять", "десять"];
    const word = (number) => {
        if (number <= 10) return smallWords[number];
        if (teens[number]) return teens[number];
        const tens = Math.floor(number / 10);
        const units = number % 10;
        return `${tensWords[tens - 2]}${units ? " " + unitWords[units] : ""}`;
    };
    const say = (text) => {
        if (!window.speechSynthesis || !window.SpeechSynthesisUtterance) return false;
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = "ru-RU";
        utterance.rate = 0.83;
        const voice = window.speechSynthesis.getVoices().find((item) => item.lang.toLowerCase().startsWith("ru"));
        if (voice) utterance.voice = voice;
        window.speechSynthesis.speak(utterance);
        return true;
    };
    const randomNumber = (except = []) => {
        const available = [];
        for (let number = 21; number <= 99; number += 1) {
            if (number % 10 !== 0 && !except.includes(number)) available.push(number);
        }
        return available[Math.floor(Math.random() * available.length)];
    };

    const rules = Array.from(root.querySelectorAll(".build-one-rule"));
    $("build-one-expand").addEventListener("click", () => rules.forEach((rule) => rule.open = true));
    $("build-one-collapse").addEventListener("click", () => rules.forEach((rule) => rule.open = false));

    $("build-one-demo-tens").value = "30";
    $("build-one-demo-units").value = "7";
    const updateDemo = () => {
        const number = Number($("build-one-demo-tens").value) + Number($("build-one-demo-units").value);
        $("build-one-demo-number").textContent = String(number);
        $("build-one-demo-russian").textContent = word(number);
        $("build-one-demo-note").textContent = `${Math.floor(number / 10) * 10} + ${number % 10} = ${number}. In Russian: ${word(number)}.`;
    };
    $("build-one-demo-tens").addEventListener("change", updateDemo);
    $("build-one-demo-units").addEventListener("change", updateDemo);
    $("build-one-demo-hear").addEventListener("click", () => say($("build-one-demo-russian").textContent));
    updateDemo();

    let guidedTarget = 47;
    const nextGuided = () => {
        guidedTarget = randomNumber([guidedTarget]);
        $("build-one-guided-target").textContent = String(guidedTarget);
        $("build-one-guided-tens").value = "";
        $("build-one-guided-units").value = "";
        $("build-one-guided-feedback").textContent = "New number! Select its tens and units.";
    };
    $("build-one-guided-check").addEventListener("click", () => {
        const t = Number($("build-one-guided-tens").value);
        const u = Number($("build-one-guided-units").value);
        if (!t || !u) {
            $("build-one-guided-feedback").textContent = "Choose both parts before checking.";
        } else if (t + u === guidedTarget) {
            $("build-one-guided-feedback").textContent = `Correct! ${guidedTarget} = ${t} + ${u}: ${word(guidedTarget)}.`;
            say(word(guidedTarget));
        } else {
            $("build-one-guided-feedback").textContent = `Not quite. Break ${guidedTarget} into ${Math.floor(guidedTarget / 10) * 10} and ${guidedTarget % 10}, then try again.`;
        }
    });
    $("build-one-guided-hint").addEventListener("click", () => {
        $("build-one-guided-feedback").textContent = `Hint: ${guidedTarget} = ${Math.floor(guidedTarget / 10) * 10} + ${guidedTarget % 10}. Which Russian words match those parts?`;
    });
    $("build-one-guided-next").addEventListener("click", nextGuided);
    $("build-one-guided-hear").addEventListener("click", () => say(word(guidedTarget)));

    let listenTarget = randomNumber();
    const nextListening = () => {
        listenTarget = randomNumber([listenTarget]);
        $("build-one-listen-tens").value = "";
        $("build-one-listen-units").value = "";
        $("build-one-listen-prompt").textContent = "?";
        $("build-one-listen-feedback").textContent = "Press Play Russian Number, then choose the two parts you hear.";
    };
    $("build-one-listen-play").addEventListener("click", () => {
        if (!say(word(listenTarget))) $("build-one-listen-feedback").textContent = "Speech is not supported here. Select Show Written Hint.";
    });
    $("build-one-listen-hint").addEventListener("click", () => {
        $("build-one-listen-prompt").textContent = word(listenTarget);
        $("build-one-listen-feedback").textContent = "Look at the two Russian words and match their tens and units.";
    });
    $("build-one-listen-check").addEventListener("click", () => {
        const t = Number($("build-one-listen-tens").value);
        const u = Number($("build-one-listen-units").value);
        if (!t || !u) $("build-one-listen-feedback").textContent = "Choose both parts first.";
        else if (t + u === listenTarget) {
            $("build-one-listen-feedback").textContent = `Correct! You heard ${word(listenTarget)} (${listenTarget}).`;
            $("build-one-listen-prompt").textContent = word(listenTarget);
        } else $("build-one-listen-feedback").textContent = `Not quite. Replay the number. Listen for the tens word first, then the units word.`;
    });
    $("build-one-listen-next").addEventListener("click", nextListening);

    // Independent four-number challenge: fixed HTML rows, shuffled targets.
    const rows = Array.from(root.querySelectorAll(".build-one-answer-row"));
    const tiles = Array.from(root.querySelectorAll(".build-one-word"));
    let independentNumbers = [37, 54, 68, 91];
    let independentAnswers = Array.from({ length: 4 }, () => ({ tens: null, units: null }));
    let activeRow = 0;
    const drawIndependent = () => {
        rows.forEach((row, index) => {
            row.classList.toggle("is-active", index === activeRow);
            row.querySelector(".build-one-target").textContent = independentNumbers[index];
            const answer = independentAnswers[index];
            row.querySelector('[data-piece="tens"]').textContent = answer.tens ? tensWords[answer.tens / 10 - 2] : "Choose tens";
            row.querySelector('[data-piece="units"]').textContent = answer.units ? unitWords[answer.units] : "Choose units";
        });
        tiles.forEach((tile) => {
            tile.classList.toggle("is-selected", independentAnswers[activeRow][tile.dataset.part] === Number(tile.dataset.value));
            tile.setAttribute("aria-pressed", String(tile.classList.contains("is-selected")));
        });
    };
    rows.forEach((row, index) => {
        row.addEventListener("click", () => { activeRow = index; drawIndependent(); });
        row.querySelector(".build-one-row-clear").addEventListener("click", (event) => {
            event.stopPropagation();
            independentAnswers[index] = { tens: null, units: null };
            row.querySelector(".build-one-row-feedback").textContent = "";
            drawIndependent();
        });
    });
    tiles.forEach((tile) => tile.addEventListener("click", () => {
        independentAnswers[activeRow][tile.dataset.part] = Number(tile.dataset.value);
        rows[activeRow].querySelector(".build-one-row-feedback").textContent = "";
        drawIndependent();
    }));
    $("build-one-independent-check").addEventListener("click", () => {
        let correct = 0;
        rows.forEach((row, index) => {
            const answer = independentAnswers[index];
            const target = independentNumbers[index];
            const complete = answer.tens !== null && answer.units !== null;
            const success = complete && answer.tens + answer.units === target;
            if (success) correct += 1;
            row.querySelector(".build-one-row-feedback").textContent = success
                ? `✓ Correct! ${word(target)}.`
                : complete
                    ? `Try again: ${target} = ${Math.floor(target / 10) * 10} + ${target % 10}.`
                    : "Choose a tens word and a units word.";
        });
        $("build-one-independent-feedback").textContent = `${correct} of 4 correct. ${correct === 4 ? "Excellent! Reset for four new numbers." : "Review the hints and try again."}`;
        if (correct === 4) say(word(independentNumbers[activeRow]));
    });
    $("build-one-independent-reset").addEventListener("click", () => {
        const oldSet = [...independentNumbers].sort((a, b) => a - b).join(",");
        let nextSet;
        do {
            nextSet = [];
            for (let i = 0; i < 4; i += 1) nextSet.push(randomNumber(nextSet));
        } while ([...nextSet].sort((a, b) => a - b).join(",") === oldSet);
        independentNumbers = nextSet;
        independentAnswers = Array.from({ length: 4 }, () => ({ tens: null, units: null }));
        activeRow = 0;
        rows.forEach((row) => row.querySelector(".build-one-row-feedback").textContent = "");
        $("build-one-independent-feedback").textContent = "Four new numbers are ready. Select a row to begin.";
        drawIndependent();
    });
    drawIndependent();

    const situations = [{"title": "Apples", "en": "I have {a} apples, and you have {b}.", "ru": "У меня {a} {an}, а у тебя {b} {bn}.", "forms": ["яблоко", "яблока", "яблок"], "a": 2, "b": 32}, {"title": "Pencils", "en": "I have {a} pencils, and you have {b}.", "ru": "У меня {a} {an}, а у тебя {b} {bn}.", "forms": ["карандаш", "карандаша", "карандашей"], "a": 24, "b": 36}, {"title": "Books", "en": "There are {a} books on my shelf, and {b} on yours.", "ru": "На моей полке {a} {an}, а на твоей — {b} {bn}.", "forms": ["книга", "книги", "книг"], "a": 47, "b": 29}, {"title": "Chairs", "en": "We have {a} chairs, and they have {b}.", "ru": "У нас {a} {an}, а у них — {b} {bn}.", "forms": ["стул", "стула", "стульев"], "a": 53, "b": 64}, {"title": "Photographs", "en": "I have {a} photographs, and you have {b}.", "ru": "У меня {a} {an}, а у тебя {b} {bn}.", "forms": ["фотография", "фотографии", "фотографий"], "a": 68, "b": 21}, {"title": "Students", "en": "Our school has {a} students, and theirs has {b}.", "ru": "В нашей школе {a} {an}, а в их школе — {b} {bn}.", "forms": ["ученик", "ученика", "учеников"], "a": 91, "b": 75}, {"title": "Trees", "en": "Our park has {a} trees, and their park has {b}.", "ru": "В нашем парке {a} {an}, а в их парке — {b} {bn}.", "forms": ["дерево", "дерева", "деревьев"], "a": 75, "b": 47}, {"title": "Flowers", "en": "I have {a} flowers, and you have {b}.", "ru": "У меня {a} {an}, а у тебя {b} {bn}.", "forms": ["цветок", "цветка", "цветов"], "a": 29, "b": 54}, {"title": "Windows", "en": "Our building has {a} windows, and theirs has {b}.", "ru": "В нашем здании {a} {an}, а в их здании — {b} {bn}.", "forms": ["окно", "окна", "окон"], "a": 82, "b": 36}, {"title": "Cars", "en": "There are {a} cars in our parking lot, and {b} in theirs.", "ru": "На нашей парковке {a} {an}, а на их парковке — {b} {bn}.", "forms": ["машина", "машины", "машин"], "a": 64, "b": 32}];
    // In nominative quantity expressions, 1 and 2 agree with the noun's gender.
    // These 10 nouns are masculine, feminine, or neuter as appropriate.
    const genders = ["n", "m", "f", "m", "f", "m", "n", "m", "n", "f"];
    const oneWords = { m: "один", f: "одна", n: "одно" };
    const twoWords = { m: "два", f: "две", n: "два" };
    const quantityWord = (number, gender) => {
        const unit = number % 10;
        const base = word(number);
        if (unit === 1) return base.replace(/один$/, oneWords[gender]);
        if (unit === 2) return base.replace(/два$/, twoWords[gender]);
        return base;
    };
    const nounForm = (number, forms) => {
        const lastTwo = number % 100;
        const last = number % 10;
        if (lastTwo >= 11 && lastTwo <= 14) return forms[2];
        if (last === 1) return forms[0];
        if (last >= 2 && last <= 4) return forms[1];
        return forms[2];
    };
    let situationIndex = 0;
    let revealed = false;
    const quantities = [1, 2, 3, 4, 5, 6, 7, 8, 9, 11, 12, 13, 14, 15, 17, 19, 21, 22, 23, 24, 25, 29, 31, 32, 34, 35, 36, 37, 41, 42, 44, 47, 51, 53, 54, 55, 59, 61, 64, 68, 71, 75, 79, 81, 82, 84, 89, 91, 92, 94, 99];
    [$("build-one-living-a"), $("build-one-living-b")].forEach((select) => {
        quantities.forEach((number) => {
            const option = document.createElement("option");
            option.value = String(number);
            option.textContent = String(number);
            select.appendChild(option);
        });
    });
    const renderLiving = () => {
        const s = situations[situationIndex];
        const a = Number($("build-one-living-a").value);
        const b = Number($("build-one-living-b").value);
        const gender = genders[situationIndex];
        $("build-one-situation-progress").textContent = `Situation ${situationIndex + 1} of 10`;
        $("build-one-situation-title").textContent = s.title;
        $("build-one-living-english").textContent = s.en.replace("{a}", a).replace("{b}", b)
            .replace(/\b1 apples\b/g, "1 apple")
            .replace(/\b1 pencils\b/g, "1 pencil")
            .replace(/\b1 books\b/g, "1 book")
            .replace(/\b1 chairs\b/g, "1 chair")
            .replace(/\b1 photographs\b/g, "1 photograph")
            .replace(/\b1 students\b/g, "1 student")
            .replace(/\b1 trees\b/g, "1 tree")
            .replace(/\b1 flowers\b/g, "1 flower")
            .replace(/\b1 windows\b/g, "1 window")
            .replace(/\b1 cars\b/g, "1 car");
        const russian = $("build-one-living-russian");
        russian.replaceChildren();
        if (!revealed) {
            russian.textContent = "Select Reveal Russian to see the sentence.";
            return;
        }
        const parts = s.ru.split(/(\{a\}|\{b\}|\{an\}|\{bn\})/g);
        parts.forEach((part) => {
            if (part === "{a}" || part === "{b}") {
                const bold = document.createElement("strong");
                bold.textContent = quantityWord(part === "{a}" ? a : b, gender);
                russian.appendChild(bold);
            } else if (part === "{an}" || part === "{bn}") {
                russian.appendChild(document.createTextNode(nounForm(part === "{an}" ? a : b, s.forms)));
            } else {
                russian.appendChild(document.createTextNode(part));
            }
        });
    };
    const setSituation = (index) => {
        situationIndex = (index + situations.length) % situations.length;
        const s = situations[situationIndex];
        $("build-one-situation").value = String(situationIndex);
        $("build-one-living-a").value = String(s.a);
        $("build-one-living-b").value = String(s.b);
        revealed = false;
        renderLiving();
    };
    $("build-one-situation").addEventListener("change", (event) => setSituation(Number(event.target.value)));
    [$("build-one-living-a"), $("build-one-living-b")].forEach((select) => select.addEventListener("change", () => {
        revealed = false;
        renderLiving();
    }));
    $("build-one-switch").addEventListener("click", () => {
        const a = $("build-one-living-a").value;
        $("build-one-living-a").value = $("build-one-living-b").value;
        $("build-one-living-b").value = a;
        revealed = false;
        renderLiving();
    });
    $("build-one-reveal").addEventListener("click", () => { revealed = true; renderLiving(); });
    $("build-one-living-hear").addEventListener("click", () => {
        if (!revealed) { revealed = true; renderLiving(); }
        say($("build-one-living-russian").textContent);
    });
    $("build-one-living-reset").addEventListener("click", () => setSituation(situationIndex));
    $("build-one-previous").addEventListener("click", () => setSituation(situationIndex - 1));
    $("build-one-next").addEventListener("click", () => setSituation(situationIndex + 1));
    setSituation(0);
})();

// =============================================================
// BUILD EXERCISE 2 — HUNDREDS + TENS + UNITS (100–999)
// =============================================================
(() => {
    const root = document.getElementById("exercise-2");
    if (!root) return;
    const $ = (id) => document.getElementById(id);
    const hundreds = {100:"сто",200:"двести",300:"триста",400:"четыреста",500:"пятьсот",600:"шестьсот",700:"семьсот",800:"восемьсот",900:"девятьсот"};
    const tens = {0:"",10:"десять",20:"двадцать",30:"тридцать",40:"сорок",50:"пятьдесят",60:"шестьдесят",70:"семьдесят",80:"восемьдесят",90:"девяносто"};
    const units = {0:"",1:"один",2:"два",3:"три",4:"четыре",5:"пять",6:"шесть",7:"семь",8:"восемь",9:"девять"};
    const teens = {11:"одиннадцать",12:"двенадцать",13:"тринадцать",14:"четырнадцать",15:"пятнадцать",16:"шестнадцать",17:"семнадцать",18:"восемнадцать",19:"девятнадцать"};
    const word = (number) => {
        const h = Math.floor(number / 100) * 100;
        const remainder = number % 100;
        const t = Math.floor(remainder / 10) * 10;
        const u = remainder % 10;
        const pieces = [hundreds[h]];
        if (remainder >= 11 && remainder <= 19) pieces.push(teens[remainder]);
        else {
            if (t) pieces.push(tens[t]);
            if (u) pieces.push(units[u]);
        }
        return pieces.filter(Boolean).join(" ");
    };
    const parts = (number) => ({h: Math.floor(number / 100) * 100, t: Math.floor(number % 100 / 10) * 10, u: number % 10});
    const say = (russian, onEnd) => {
        if (!window.speechSynthesis || !window.SpeechSynthesisUtterance) return;
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(russian);
        utterance.lang = "ru-RU";
        utterance.rate = .82;
        const voice = window.speechSynthesis.getVoices().find((v) => v.lang.toLowerCase().startsWith("ru"));
        if (voice) utterance.voice = voice;
        if (onEnd) utterance.onend = onEnd;
        window.speechSynthesis.speak(utterance);
    };
    const fillSelect = (id, values, label) => {
        const select = $(id);
        select.innerHTML = "";
        for (const [value, text] of Object.entries(values)) {
            const option = document.createElement("option");
            option.value = value;
            option.textContent = `${value} — ${text || "(none)"}`;
            select.appendChild(option);
        }
        select.setAttribute("aria-label", label);
    };
    const selectValues = {h: hundreds, t: tens, u: units};
    ["demo", "guided", "listen"].forEach((name) => {
        fillSelect(`build-two-${name}-hundreds`, hundreds, "Hundreds");
        fillSelect(`build-two-${name}-tens`, tens, "Tens");
        fillSelect(`build-two-${name}-units`, units, "Units");
    });
    const getSelection = (name) => {
        const h = Number($(`build-two-${name}-hundreds`).value);
        const t = Number($(`build-two-${name}-tens`).value);
        const u = Number($(`build-two-${name}-units`).value);
        return {h,t,u,number:h+t+u};
    };
    const setSelection = (name, number) => {
        const {h,t,u} = parts(number);
        $(`build-two-${name}-hundreds`).value = String(h);
        $(`build-two-${name}-tens`).value = String(t);
        $(`build-two-${name}-units`).value = String(u);
    };
    const showFeedback = (id, message, correct) => {
        const element = $(id);
        element.textContent = message;
        element.style.color = correct ? "#24743b" : "#a04a17";
    };
    const explainError = (selection, target) => {
        const expected = parts(target);
        const errors = [];
        if (selection.h !== expected.h) errors.push("hundreds");
        if (selection.t !== expected.t) errors.push("tens");
        if (selection.u !== expected.u) errors.push("units");
        return `Not quite. Check your ${errors.join(" and ")} selection${errors.length > 1 ? "s" : ""}. Remember: 11–19 are spoken as one teen word.`;
    };
    const shuffle = (items) => {
        const result = [...items];
        for (let i = result.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [result[i], result[j]] = [result[j], result[i]];
        }
        return result;
    };
    const allNumbers = Array.from({length:900}, (_, i) => i + 100);
    const newSet = (count, old = []) => {
        const oldKey = [...old].sort((a,b) => a-b).join(",");
        let result;
        do {
            result = shuffle(allNumbers).slice(0, count);
        } while ([...result].sort((a,b) => a-b).join(",") === oldKey);
        return result;
    };

    // Explanation cards and the optional historical callout.
    const explanations = [...root.querySelectorAll("#build-two-explain .build-two-rule")];
    $("build-two-expand").addEventListener("click", () => explanations.forEach((card) => card.open = true));
    $("build-two-collapse").addEventListener("click", () => explanations.forEach((card) => card.open = false));
    const historyHearButton = $("build-two-history-hear");
    const historyStopButton = $("build-two-history-stop");
    let historyUtterance = null;

    function stopHistoryAudio() {
        if (historyUtterance && window.speechSynthesis) {
            window.speechSynthesis.cancel();
        }

        historyUtterance = null;
        historyStopButton.disabled = true;
    }

    $("build-two-history-toggle").addEventListener("click", () => {
        const body = $("build-two-history-body");
        const closing = !body.hidden;

        if (closing) {
            stopHistoryAudio();
        }

        body.hidden = closing;
        $("build-two-history-toggle").setAttribute("aria-expanded", String(!closing));
    });

    historyHearButton.addEventListener("click", () => {
        stopHistoryAudio();

        if (!window.speechSynthesis || !window.SpeechSynthesisUtterance) {
            return;
        }

        // Speak the nine hundreds as one sequence so the learner can interrupt it.
        const utterance = new SpeechSynthesisUtterance(Object.values(hundreds).join(". "));
        utterance.lang = "ru-RU";
        utterance.rate = 0.82;

        const russianVoice = window.speechSynthesis.getVoices().find((voice) => {
            return voice.lang.toLowerCase().startsWith("ru");
        });

        if (russianVoice) {
            utterance.voice = russianVoice;
        }

        historyUtterance = utterance;
        historyStopButton.disabled = false;

        const finish = () => {
            if (historyUtterance === utterance) {
                historyUtterance = null;
                historyStopButton.disabled = true;
            }
        };

        utterance.onend = finish;
        utterance.onerror = finish;
        window.speechSynthesis.cancel();
        window.speechSynthesis.speak(utterance);
    });

    historyStopButton.addEventListener("click", stopHistoryAudio);

    // Discovery laboratory.
    setSelection("demo", 343);
    const updateDemo = () => {
        const {h,t,u,number} = getSelection("demo");
        $("build-two-demo-number").textContent = number;
        $("build-two-demo-russian").textContent = word(number);
        const values = [h,t,u].filter(Boolean);
        $("build-two-demo-note").textContent = `${values.join(" + ")} = ${number}. In Russian: ${word(number)}.`;
    };
    ["hundreds","tens","units"].forEach((part) => {
        $(`build-two-demo-${part}`).addEventListener("change", updateDemo);
    });
    $("build-two-demo-hear").addEventListener("click", () => say(word(getSelection("demo").number)));
    updateDemo();

    // Guided construction: the initial sequence intentionally spans all patterns.
    const examples = [101,121,232,343,454,565,676,787,888,999];
    let guidedRound = [...examples];
    let guidedIndex = 0;
    let guidedCorrect = false;
    const guidedShow = () => {
        const target = guidedRound[guidedIndex];
        setSelection("guided", 100);
        guidedCorrect = false;
        $("build-two-guided-target").textContent = target;
        $("build-two-guided-progress").textContent = `Number ${guidedIndex + 1} of ${guidedRound.length}`;
        $("build-two-guided-answer").textContent = "Choose the pieces";
        $("build-two-guided-feedback").textContent = "";
        $("build-two-guided-next").disabled = true;
    };
    ["hundreds","tens","units"].forEach((part) => {
        $(`build-two-guided-${part}`).addEventListener("change", () => {
            guidedCorrect = false;
            $("build-two-guided-next").disabled = true;
            $("build-two-guided-answer").textContent = word(getSelection("guided").number);
            $("build-two-guided-feedback").textContent = "";
        });
    });
    $("build-two-guided-check").addEventListener("click", () => {
        const selection = getSelection("guided");
        const target = guidedRound[guidedIndex];
        guidedCorrect = selection.number === target;
        $("build-two-guided-next").disabled = !guidedCorrect;
        showFeedback("build-two-guided-feedback", guidedCorrect ? `Exactly! ${target} is ${word(target)}. You put the pieces together!` : explainError(selection,target), guidedCorrect);
    });
    $("build-two-guided-hear").addEventListener("click", () => say(word(getSelection("guided").number)));
    $("build-two-guided-next").addEventListener("click", () => {
        if (!guidedCorrect) return;
        if (guidedIndex === guidedRound.length - 1) {
            guidedRound = newSet(10, guidedRound);
            guidedIndex = 0;
        } else guidedIndex++;
        guidedShow();
    });
    $("build-two-guided-reset").addEventListener("click", () => {
        guidedRound = newSet(10, guidedRound);
        guidedIndex = 0;
        guidedShow();
    });
    guidedShow();

    // Listening reconstruction: target stays hidden until checked.
    let listenTarget = 0;
    let previousListen = 0;
    let listenCount = 0;
    const nextListening = () => {
        do { listenTarget = 100 + Math.floor(Math.random() * 900); } while (listenTarget === previousListen);
        previousListen = listenTarget;
        listenCount++;
        setSelection("listen", 100);
        $("build-two-listen-progress").textContent = `Listening challenge ${listenCount}`;
        $("build-two-listen-feedback").textContent = "Press Play Russian Number to begin.";
    };
    $("build-two-listen-play").addEventListener("click", () => say(word(listenTarget)));
    $("build-two-listen-replay").addEventListener("click", () => say(word(listenTarget)));
    $("build-two-listen-check").addEventListener("click", () => {
        const selection = getSelection("listen");
        const correct = selection.number === listenTarget;
        showFeedback("build-two-listen-feedback", correct ? `Correct! You heard ${listenTarget} — ${word(listenTarget)}.` : `${explainError(selection,listenTarget)} Listen again, then try again.`, correct);
    });
    $("build-two-listen-next").addEventListener("click", nextListening);
    nextListening();

    // Independent challenge: word bank consists of HTML-authored buttons at runtime
    // for non-hotspot word choices. Learner answers are held per row.
    const bank = $("build-two-word-bank");
    const bankItems = [
        ...Object.entries(hundreds).map(([value,label]) => ({part:"h",value:Number(value),label})),
        ...Object.entries(tens).filter(([value]) => Number(value) >= 20).map(([value,label]) => ({part:"t",value:Number(value),label})),
        ...Object.entries(teens).map(([value,label]) => ({part:"teen",value:Number(value),label})),
        ...Object.entries(units).filter(([value]) => Number(value) > 0).map(([value,label]) => ({part:"u",value:Number(value),label}))
    ];
    bankItems.forEach((item) => {
        const button = document.createElement("button");
        button.type = "button";
        button.textContent = item.label;
        button.lang = "ru";
        button.dataset.part = item.part;
        button.dataset.value = String(item.value);
        button.setAttribute("aria-pressed", "false");
        bank.appendChild(button);
    });
    const rows = [...root.querySelectorAll(".build-two-answer-row")];
    let activeRow = 0;
    let independentTargets = [232,343,454,565];
    let independentAnswers = [];
    const answerWord = (answer) => {
        const result = [hundreds[answer.h]];
        if (answer.teen) result.push(teens[answer.teen]);
        else {
            if (answer.t) result.push(tens[answer.t]);
            if (answer.u) result.push(units[answer.u]);
        }
        return result.filter(Boolean).join(" ");
    };
    const renderRows = () => {
        rows.forEach((row,index) => {
            const answer = independentAnswers[index];
            row.classList.toggle("is-active", index === activeRow);
            row.querySelector(".build-two-target").textContent = independentTargets[index];
            row.querySelector(".build-two-answer").textContent = answerWord(answer) || "Choose words above";
        });
        bank.querySelectorAll("button").forEach((button) => {
            const answer = independentAnswers[activeRow];
            const part = button.dataset.part;
            button.setAttribute("aria-pressed", String(answer[part] === Number(button.dataset.value)));
        });
    };
    const clearRowFeedback = () => rows.forEach((row) => row.querySelector(".build-two-row-feedback").textContent = "");
    const resetIndependent = (newNumbers) => {
        if (newNumbers) independentTargets = newSet(4, independentTargets);
        independentAnswers = Array.from({length:4}, () => ({h:0,t:0,u:0,teen:0}));
        activeRow = 0;
        clearRowFeedback();
        $("build-two-independent-feedback").textContent = "Select a row and begin building.";
        renderRows();
    };
    rows.forEach((row,index) => {
        row.addEventListener("click", (event) => {
            if (event.target.closest(".build-two-row-clear")) return;
            activeRow = index;
            renderRows();
        });
        row.querySelector(".build-two-row-clear").addEventListener("click", () => {
            independentAnswers[index] = {h:0,t:0,u:0,teen:0};
            row.querySelector(".build-two-row-feedback").textContent = "";
            activeRow = index;
            renderRows();
        });
    });
    bank.addEventListener("click", (event) => {
        const button = event.target.closest("button[data-part]");
        if (!button) return;
        const answer = independentAnswers[activeRow];
        const part = button.dataset.part;
        const value = Number(button.dataset.value);
        const already = answer[part] === value;
        answer[part] = already ? 0 : value;
        if (part === "teen" && !already) {answer.t = 0; answer.u = 0;}
        if ((part === "t" || part === "u") && !already) answer.teen = 0;
        rows[activeRow].querySelector(".build-two-row-feedback").textContent = "";
        renderRows();
    });
    $("build-two-independent-check").addEventListener("click", () => {
        let correct = 0;
        rows.forEach((row,index) => {
            const answer = independentAnswers[index];
            const target = independentTargets[index];
            const assembled = answer.h + (answer.teen || answer.t + answer.u);
            const isCorrect = assembled === target && answerWord(answer) === word(target);
            if (isCorrect) correct++;
            row.querySelector(".build-two-row-feedback").textContent = isCorrect ? "✓ Correct!" : "Try again: check the hundreds and the final one or two pieces.";
            row.querySelector(".build-two-row-feedback").style.color = isCorrect ? "#24743b" : "#a04a17";
        });
        showFeedback("build-two-independent-feedback", correct === 4 ? "Excellent! All four are correct. Reset for four new numbers." : `${correct} of 4 correct. Review the highlighted rows and try again.`, correct === 4);
    });
    $("build-two-independent-reset").addEventListener("click", () => resetIndependent(true));
    resetIndependent(false);

    // Everyday-life noun agreement is intentionally limited to nominative
    // quantity statements, so the focus remains on number construction.
    const situations = [
        {title:"Books on the shelf",en:"There are {n} books on the shelf.",ruBefore:"На полке ",ruAfter:"",noun:["книга","книги","книг"],gender:"f"},
        {title:"Pencils in a box",en:"There are {n} pencils in the box.",ruBefore:"В коробке ",ruAfter:"",noun:["карандаш","карандаша","карандашей"],gender:"m"},
        {title:"Chairs in the hall",en:"There are {n} chairs in the hall.",ruBefore:"В зале ",ruAfter:"",noun:["стул","стула","стульев"],gender:"m"},
        {title:"Photographs",en:"There are {n} photographs in the album.",ruBefore:"В альбоме ",ruAfter:"",noun:["фотография","фотографии","фотографий"],gender:"f"},
        {title:"Students at school",en:"There are {n} students at the school.",ruBefore:"В школе ",ruAfter:"",noun:["ученик","ученика","учеников"],gender:"m"},
        {title:"Trees in the park",en:"There are {n} trees in the park.",ruBefore:"В парке ",ruAfter:"",noun:["дерево","дерева","деревьев"],gender:"n"},
        {title:"Flowers in the garden",en:"There are {n} flowers in the garden.",ruBefore:"В саду ",ruAfter:"",noun:["цветок","цветка","цветов"],gender:"m"},
        {title:"Windows in a building",en:"There are {n} windows in the building.",ruBefore:"В здании ",ruAfter:"",noun:["окно","окна","окон"],gender:"n"},
        {title:"Cars in the parking lot",en:"There are {n} cars in the parking lot.",ruBefore:"На парковке ",ruAfter:"",noun:["машина","машины","машин"],gender:"f"},
        {title:"Apples in a basket",en:"There are {n} apples in the basket.",ruBefore:"В корзине ",ruAfter:"",noun:["яблоко","яблока","яблок"],gender:"n"}
    ];
    const quantities = [101,111,121,132,143,154,165,176,187,198,200,201,202,211,221,232,243,254,265,276,287,298,321,343,454,565,676,787,888,999];
    const nounForm = (number, forms) => {
        const lastTwo = number % 100;
        const last = number % 10;
        if (lastTwo >= 11 && lastTwo <= 14) return forms[2];
        if (last === 1) return forms[0];
        if (last >= 2 && last <= 4) return forms[1];
        return forms[2];
    };
    const contextualNumber = (number, gender) => {
        let result = word(number);
        if (number % 100 < 11 || number % 100 > 14) {
            if (number % 10 === 1) result = result.replace(/один$/, gender === "f" ? "одна" : gender === "n" ? "одно" : "один");
            if (number % 10 === 2 && gender === "f") result = result.replace(/два$/, "две");
        }
        return result;
    };
    let situationIndex = 0;
    let revealed = false;
    situations.forEach((s,index) => {
        const option = document.createElement("option");
        option.value = String(index);
        option.textContent = `${index + 1} · ${s.title}`;
        $("build-two-situation").appendChild(option);
    });
    quantities.forEach((number) => {
        const option = document.createElement("option");
        option.value = String(number);
        option.textContent = String(number);
        $("build-two-quantity").appendChild(option);
    });
    const renderLiving = () => {
        const s = situations[situationIndex];
        const n = Number($("build-two-quantity").value);
        $("build-two-situation-title").textContent = s.title;
        $("build-two-situation-progress").textContent = `Situation ${situationIndex + 1} of ${situations.length}`;
        $("build-two-english").textContent = s.en.replace("{n}", String(n));
        const russian = $("build-two-russian");
        russian.replaceChildren();
        if (!revealed) {
            russian.textContent = "Select Reveal Russian to see the sentence.";
            return;
        }
        russian.append(document.createTextNode(s.ruBefore));
        const boldNumber = document.createElement("strong");
        boldNumber.textContent = contextualNumber(n,s.gender);
        russian.append(boldNumber);
        russian.append(document.createTextNode(` ${nounForm(n,s.noun)}${s.ruAfter}.`));
    };
    const setSituation = (index) => {
        situationIndex = (index + situations.length) % situations.length;
        $("build-two-situation").value = String(situationIndex);
        $("build-two-quantity").value = String(quantities[(situationIndex * 3 + 2) % quantities.length]);
        revealed = false;
        renderLiving();
    };
    $("build-two-situation").addEventListener("change", (event) => setSituation(Number(event.target.value)));
    $("build-two-quantity").addEventListener("change", () => {revealed = false; renderLiving();});
    $("build-two-reveal").addEventListener("click", () => {revealed = true; renderLiving();});
    $("build-two-living-hear").addEventListener("click", () => {revealed = true; renderLiving(); say($("build-two-russian").textContent);});
    $("build-two-living-reset").addEventListener("click", () => setSituation(situationIndex));
    $("build-two-previous").addEventListener("click", () => setSituation(situationIndex - 1));
    $("build-two-next").addEventListener("click", () => setSituation(situationIndex + 1));
    setSituation(0);
})();


// ==================================================
// THE LISTENING ROOM — 6-ENCOUNTER LISTEN/BUILD/RESPOND VERSION
// Replaces the old "Part A/B/C" Listening Room JS.
// Wrapped in an IIFE to match this file's existing scoping convention.
// NOTE 1: .feedback class renamed to .encounter-feedback throughout to
// avoid colliding with the site-wide .feedback class used elsewhere.
// NOTE 2 (2026-09-10 fix): scrollTo(top:0) calls changed to scroll the
// .listening-room wrapper into view instead of the whole page — see
// integration notes for why.
// ==================================================
(() => {
    // Content-free data placeholders: navigation and interactions remain testable.
    // Replace these six objects with Days of the Week content later.
    const encounters = Array.from({ length: 6 }, (_, index) => ({
        primary: "",
        variation: "",
        catch: ["Content pending"],
        meaningQuestion: `Encounter ${index + 1} — meaning activity pending`,
        meaningChoices: ["Continue through the shell"],
        meaningAnswer: 0,
        inferQuestion: "Inference activity pending",
        inferChoices: ["Continue through the shell"],
        inferAnswer: 0,
        respondQuestion: "Response activity pending",
        respondChoices: ["Continue through the shell"],
        respondAnswer: 0,
        support: "Numbers listening content will be added here.",
        transcript: "Content pending."
    }));

    const moves = [
        {
            label: "HEAR",
            prompt: "Listen once. Do not try to catch every word.",
            purpose: "First, listen for the overall shape of the message."
        },
        {
            label: "CATCH",
            prompt: "What did your ears catch?",
            purpose: "Recognize familiar Russian without requiring the whole sentence."
        },
        {
            label: "LISTEN AGAIN",
            prompt: "Listen again with a purpose.",
            purpose: "This time, listen for the numbers and the context."
        },
        {
            label: "BUILD MEANING",
            prompt: "Put the pieces together.",
            purpose: "Use what you understood to decide what the message means."
        },
        {
            label: "INFER",
            prompt: "Listen for what changed.",
            purpose: "The Russian changed naturally. Follow the meaning, not a memorized sentence."
        },
        {
            label: "RESPOND",
            prompt: "Respond to what you understood.",
            purpose: "Use the meaning you built to choose the response that fits."
        }
    ];

    const el = {
        room: document.querySelector(".listening-room"),
        landing: document.getElementById("landingScreen"),
        experience: document.getElementById("experienceScreen"),
        completion: document.getElementById("completionScreen"),
        enter: document.getElementById("enterButton"),
        listen: document.getElementById("listenButton"),
        slower: document.getElementById("slowerButton"),
        audioStatus: document.getElementById("audioStatus"),

        navigator: document.getElementById("encounterNavigator"),
        navigatorButtons: [...document.querySelectorAll(".encounter-nav-button")],
        navigatorStatus: document.getElementById("encounterNavigatorStatus"),
        moveLabel: document.getElementById("moveLabel"),
        movePrompt: document.getElementById("movePrompt"),
        movePurpose: document.getElementById("movePurpose"),
        catchPanel: document.getElementById("catchPanel"),
        catchGrid: document.getElementById("catchGrid"),
        catchContinue: document.getElementById("catchContinueButton"),
        meaningPanel: document.getElementById("meaningPanel"),
        meaningQuestion: document.getElementById("meaningQuestion"),
        meaningChoices: document.getElementById("meaningChoices"),
        meaningFeedback: document.getElementById("meaningFeedback"),
        inferPanel: document.getElementById("inferPanel"),
        inferQuestion: document.getElementById("inferQuestion"),
        inferChoices: document.getElementById("inferChoices"),
        inferFeedback: document.getElementById("inferFeedback"),
        respondPanel: document.getElementById("respondPanel"),
        respondQuestion: document.getElementById("respondQuestion"),
        respondChoices: document.getElementById("respondChoices"),
        respondFeedback: document.getElementById("respondFeedback"),
        supportPanel: document.getElementById("supportPanel"),
        supportText: document.getElementById("supportText"),
        supportButton: document.getElementById("supportButton"),
        revealTranscript: document.getElementById("revealTranscriptButton"),
        transcript: document.getElementById("transcriptText"),
        nextMove: document.getElementById("nextMoveButton"),
        nextEncounter: document.getElementById("nextEncounterButton"),
        reset: document.getElementById("resetButton"),
        restart: document.getElementById("restartButton")
    };

    let encounterIndex = 0;
    let moveIndex = 0;
    let lastSpokenText = "";
    let lastRate = 0.86;

    // Completion belongs to individual encounters, not to their position
    // in a forced sequence. A learner may jump around freely; an encounter
    // is earned only after its final RESPOND choice is completed successfully.
    const completedEncounters = new Set();

    function updateEncounterNavigator() {
        el.navigatorButtons.forEach((button) => {
            const index = Number(button.dataset.encounterIndex);
            const isCurrent = index === encounterIndex;
            const isComplete = completedEncounters.has(index);
            const state = button.querySelector(".encounter-nav-button__state");

            button.classList.toggle("encounter-nav-button--current", isCurrent);
            button.classList.toggle("encounter-nav-button--complete", isComplete);

            if (isCurrent) {
                button.setAttribute("aria-current", "step");
            } else {
                button.removeAttribute("aria-current");
            }

            if (state) {
                if (isCurrent && isComplete) {
                    state.textContent = "✓ Complete • You are here";
                } else if (isCurrent) {
                    state.textContent = "You are here";
                } else if (isComplete) {
                    state.textContent = "✓ Complete";
                } else {
                    state.textContent = "Open";
                }
            }
        });

        if (el.navigatorStatus) {
            el.navigatorStatus.textContent =
                `You are in Encounter ${encounterIndex + 1}. Completed: ${completedEncounters.size} of ${encounters.length}.`;
        }
    }

    function jumpToEncounter(index) {
        if (index < 0 || index >= encounters.length) {
            return;
        }

        window.speechSynthesis?.cancel();
        encounterIndex = index;

        // Version 1 rule: if a learner leaves an unfinished encounter midway,
        // returning to it restarts that encounter at HEAR rather than preserving
        // every internal Listening Move state.
        moveIndex = 0;
        renderMove();
    }

    function markCurrentEncounterComplete() {
        completedEncounters.add(encounterIndex);
        updateEncounterNavigator();

        el.nextMove.hidden = true;
        el.nextEncounter.hidden = false;
        el.nextEncounter.textContent =
            completedEncounters.size === encounters.length
                ? "Finish Listening Room"
                : "Next Encounter";
    }

    function nextRecommendedEncounterIndex() {
        // Keep the normal recommended forward path when possible. If the learner
        // is at Encounter 6 but earlier encounters remain unfinished, wrap to the
        // first unfinished encounter instead of falsely completing the Room.
        for (let offset = 1; offset <= encounters.length; offset += 1) {
            const candidate = (encounterIndex + offset) % encounters.length;
            if (!completedEncounters.has(candidate)) {
                return candidate;
            }
        }

        return null;
    }

    function speak(text, rate = 0.86) {
        if (!("speechSynthesis" in window)) {
            el.audioStatus.textContent = "Speech synthesis is not available in this browser.";
            return;
        }

        window.speechSynthesis.cancel();

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = "ru-RU";
        utterance.rate = rate;

        const voices = window.speechSynthesis.getVoices();
        const russianVoice = voices.find((voice) => voice.lang && voice.lang.toLowerCase().startsWith("ru"));
        if (russianVoice) {
            utterance.voice = russianVoice;
        }

        utterance.onstart = () => {
            el.audioStatus.textContent = "Listening...";
        };

        utterance.onend = () => {
            el.audioStatus.textContent = "Ready to listen again.";
        };

        utterance.onerror = () => {
            el.audioStatus.textContent = "The browser could not play this Russian audio.";
        };

        lastSpokenText = text;
        lastRate = rate;
        if (text && text.trim()) {
            window.speechSynthesis.speak(utterance);
        } else {
            el.audioStatus.textContent = "Audio content pending.";
        }
    }

    function clearPanels() {
        [
            el.catchPanel,
            el.meaningPanel,
            el.inferPanel,
            el.respondPanel,
            el.supportPanel
        ].forEach((panel) => {
            panel.hidden = true;
        });

        el.slower.hidden = true;
        el.supportButton.hidden = true;
        el.nextMove.hidden = true;
        el.nextEncounter.hidden = true;

        el.meaningFeedback.textContent = "";
        el.meaningFeedback.className = "encounter-feedback";
        el.inferFeedback.textContent = "";
        el.inferFeedback.className = "encounter-feedback";
        el.respondFeedback.textContent = "";
        el.respondFeedback.className = "encounter-feedback";
    }

    function makeChoiceButtons(
        container,
        choices,
        answerIndex,
        feedbackEl,
        successText,
        acceptAny = false,
        onSuccess = null,
        showNextMove = true
    ) {
        container.innerHTML = "";

        choices.forEach((choice, index) => {
            const button = document.createElement("button");
            button.type = "button";
            button.className = "choice-button";
            button.textContent = choice;

            button.addEventListener("click", () => {
                if (acceptAny || index === answerIndex) {
                    feedbackEl.textContent = successText;
                    feedbackEl.className = "encounter-feedback encounter-feedback--success";
                    [...container.querySelectorAll("button")].forEach((item) => {
                        item.disabled = true;
                    });
                    if (showNextMove) {
                        el.nextMove.hidden = false;
                    }

                    if (onSuccess) {
                        onSuccess();
                    }
                } else {
                    feedbackEl.textContent = "Not quite. Listen again and use what you do understand.";
                    feedbackEl.className = "encounter-feedback encounter-feedback--try";
                }
            });

            container.appendChild(button);
        });
    }

    function renderCatch(encounter) {
        el.catchGrid.innerHTML = "";

        encounter.catch.forEach((word) => {
            const button = document.createElement("button");
            button.type = "button";
            button.className = "catch-chip";
            button.textContent = word;
            button.setAttribute("aria-pressed", "false");

            button.addEventListener("click", () => {
                const pressed = button.getAttribute("aria-pressed") === "true";
                button.setAttribute("aria-pressed", String(!pressed));
            });

            el.catchGrid.appendChild(button);
        });
    }

    function renderMove() {
        const encounter = encounters[encounterIndex];
        const move = moves[moveIndex];

        clearPanels();

        updateEncounterNavigator();
        el.moveLabel.textContent = move.label;
        el.movePrompt.textContent = move.prompt;
        el.movePurpose.textContent = move.purpose;
        el.audioStatus.textContent = "Ready when you are.";

        if (moveIndex === 0) {
            el.listen.onclick = () => speak(encounter.primary, 0.86);
            el.nextMove.hidden = false;
        }

        if (moveIndex === 1) {
            renderCatch(encounter);
            el.catchPanel.hidden = false;
            el.listen.onclick = () => speak(encounter.primary, 0.86);
            el.catchContinue.onclick = () => {
                moveIndex += 1;
                renderMove();
            };
        }

        if (moveIndex === 2) {
            el.listen.onclick = () => speak(encounter.primary, 0.86);
            el.slower.hidden = false;
            el.slower.onclick = () => speak(encounter.primary, 0.68);
            el.supportButton.hidden = false;
            el.nextMove.hidden = false;
        }

        if (moveIndex === 3) {
            el.meaningPanel.hidden = false;
            el.meaningQuestion.textContent = encounter.meaningQuestion;
            makeChoiceButtons(
                el.meaningChoices,
                encounter.meaningChoices,
                encounter.meaningAnswer,
                el.meaningFeedback,
                "Yes. You followed the meaning."
            );
            el.listen.onclick = () => speak(encounter.primary, 0.86);
            el.supportButton.hidden = false;
        }

        if (moveIndex === 4) {
            el.inferPanel.hidden = false;
            el.inferQuestion.textContent = encounter.inferQuestion;
            makeChoiceButtons(
                el.inferChoices,
                encounter.inferChoices,
                encounter.inferAnswer,
                el.inferFeedback,
                "Exactly. You followed the change without needing the original wording."
            );
            el.listen.onclick = () => speak(encounter.variation, 0.86);
            el.slower.hidden = false;
            el.slower.onclick = () => speak(encounter.variation, 0.68);
            el.supportButton.hidden = false;
        }

        if (moveIndex === 5) {
            el.respondPanel.hidden = false;
            el.respondQuestion.textContent = encounter.respondQuestion;
            makeChoiceButtons(
                el.respondChoices,
                encounter.respondChoices,
                encounter.respondAnswer,
                el.respondFeedback,
                "Well done. You responded to what you understood.",
                Boolean(encounter.respondAcceptsAny),
                markCurrentEncounterComplete,
                false
            );
            el.listen.onclick = () => speak(encounter.variation, 0.86);
            el.supportButton.hidden = false;
        }

        el.supportText.textContent = encounter.support;
        el.transcript.textContent = encounter.transcript;
        el.transcript.hidden = true;

        if (moveIndex === 5) {
            el.nextMove.hidden = true;
        }
    }

    function advanceMove() {
        if (moveIndex < moves.length - 1) {
            moveIndex += 1;
            renderMove();
            return;
        }

        el.nextEncounter.hidden = false;
    }


    function showCompletion() {
        window.speechSynthesis?.cancel();
        el.landing.hidden = true;
        el.experience.hidden = true;
        el.completion.hidden = false;
        el.room?.scrollIntoView({ behavior: "smooth", block: "start" });
    }

    function resetRoom() {
        window.speechSynthesis?.cancel();
        completedEncounters.clear();
        encounterIndex = 0;
        moveIndex = 0;
        updateEncounterNavigator();
        el.completion.hidden = true;
        el.landing.hidden = false;
        el.experience.hidden = true;
        el.room?.scrollIntoView({ behavior: "smooth", block: "start" });
    }

    el.enter.addEventListener("click", () => {
        el.landing.hidden = true;
        el.completion.hidden = true;
        el.experience.hidden = false;
        completedEncounters.clear();
        encounterIndex = 0;
        moveIndex = 0;
        renderMove();
        el.room?.scrollIntoView({ behavior: "smooth", block: "start" });
    });

    el.nextMove.addEventListener("click", advanceMove);

    el.nextEncounter.addEventListener("click", () => {
        if (completedEncounters.size === encounters.length) {
            showCompletion();
            return;
        }

        const nextIndex = nextRecommendedEncounterIndex();
        if (nextIndex !== null) {
            jumpToEncounter(nextIndex);
        }
    });

    el.navigatorButtons.forEach((button) => {
        button.addEventListener("click", () => {
            jumpToEncounter(Number(button.dataset.encounterIndex));
        });
    });

    el.supportButton.addEventListener("click", () => {
        el.supportPanel.hidden = false;
    });

    el.revealTranscript.addEventListener("click", () => {
        el.transcript.hidden = false;
    });

    el.reset.addEventListener("click", resetRoom);
    el.restart.addEventListener("click", resetRoom);

    el.slower.addEventListener("click", () => {
        if (lastSpokenText) {
            speak(lastSpokenText, 0.68);
        }
    });
})();
// END THE LISTENING ROOM


// ============================================================
// PRACTICE ACTIVITY 1 — RED COMBINATION LOCK
// All interaction elements are explicitly authored in HTML.
// Edit instructional wording in HTML and feedback strings here.
// ============================================================
(function initializeRedNumberLock() {
    const root = document.getElementById("practice-1");

    if (!root) {
        return;
    }

    const elements = {
        dial: document.getElementById("number-lock-dial"),
        centerNumber: document.getElementById("number-lock-center-number"),
        drag: document.getElementById("number-lock-drag"),
        selected: document.getElementById("number-lock-selected"),
        progress: document.getElementById("number-lock-progress"),
        word: document.getElementById("number-lock-word"),
        hear: document.getElementById("number-lock-hear"),
        left: document.getElementById("number-lock-left"),
        right: document.getElementById("number-lock-right"),
        check: document.getElementById("number-lock-check"),
        next: document.getElementById("number-lock-next"),
        reset: document.getElementById("number-lock-reset"),
        feedback: document.getElementById("number-lock-feedback"),
        answer: document.getElementById("number-lock-answer"),
        success: document.getElementById("number-lock-success")
    };

    const words = [
        "ноль", "один", "два", "три", "четыре", "пять",
        "шесть", "семь", "восемь", "девять", "десять"
    ];

    // The dial PNG contains tick marks only. It rotates as a rigid image.
    // The center number is an independent, stationary HTML text element.
    const degreesPerSpin = 45;
    let currentDialRotation = 0;
    let selectedNumber = 0;
    let round = [];
    let roundIndex = 0;
    let answerAccepted = false;
    let dragStartAngle = null;
    let dragPreviousAngle = null;
    let dragAccumulatedDegrees = 0;

    function shuffledNumbers() {
        const values = words.map((word, number) => number);

        for (let index = values.length - 1; index > 0; index -= 1) {
            const randomIndex = Math.floor(Math.random() * (index + 1));
            [values[index], values[randomIndex]] = [values[randomIndex], values[index]];
        }

        return values;
    }

    function displaySelectedNumber(number) {
        selectedNumber = number;
        elements.centerNumber.textContent = String(number);
        elements.selected.textContent = `Selected: ${number}`;
        // Keep the Russian word synchronized with the center number.
        elements.word.textContent = words[number];
        elements.drag.setAttribute("aria-label", `Spin the dial. Selected number ${number}. Use arrow keys.`);
    }

    function chooseDifferentRandomNumber() {
        // Eleven possibilities (0–10), excluding the currently displayed value.
        const offset = 1 + Math.floor(Math.random() * 10);
        return (selectedNumber + offset) % 11;
    }

    function spinDial(direction) {
        if (answerAccepted) {
            return;
        }

        currentDialRotation += direction * degreesPerSpin;
        elements.dial.style.transform =
            `translate(-50%, -50%) rotate(${currentDialRotation}deg)`;
        displaySelectedNumber(chooseDifferentRandomNumber());
    }

    function setFeedback(message, status) {
        elements.feedback.textContent = message;
        elements.feedback.classList.toggle("is-correct", status === "correct");
        elements.feedback.classList.toggle("is-incorrect", status === "incorrect");
    }

    function showChallenge() {
        answerAccepted = false;
        elements.progress.textContent = `Challenge ${roundIndex + 1} of ${round.length}`;
        elements.check.disabled = false;
        elements.next.disabled = true;
        elements.next.textContent = roundIndex === round.length - 1
            ? "Open the Lock →"
            : "Next Challenge →";
        elements.answer.hidden = true;
        elements.success.hidden = true;
        displaySelectedNumber(round[roundIndex]);
        setFeedback("Turn the dial to discover a number and its Russian word.");
    }

    function checkAnswer() {
        if (answerAccepted) {
            return;
        }

        // Synchronized discovery: the word always matches the selected number.
        // Checking reveals the English meaning and advances the activity.
        answerAccepted = true;
        elements.check.disabled = true;
        elements.next.disabled = false;
        elements.answer.textContent = `${words[selectedNumber]} = ${selectedNumber}`;
        elements.answer.hidden = false;
        setFeedback("Correct! You revealed the Russian number and its meaning.", "correct");
    }

    function advanceChallenge() {
        if (!answerAccepted) {
            return;
        }

        if (roundIndex === round.length - 1) {
            elements.success.hidden = false;
            elements.next.disabled = true;
            elements.check.disabled = true;
            setFeedback("All eleven discovery rounds completed!", "correct");
            return;
        }

        roundIndex += 1;
        showChallenge();
    }

    function resetChallenge() {
        round = shuffledNumbers();
        roundIndex = 0;
        showChallenge();
    }

    function speakChallenge() {
        if (!("speechSynthesis" in window) || !window.SpeechSynthesisUtterance) {
            setFeedback("Speech playback is unavailable in this browser.", "incorrect");
            return;
        }

        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(words[selectedNumber]);
        utterance.lang = "ru-RU";
        utterance.rate = 0.85;
        const russianVoice = window.speechSynthesis.getVoices().find((voice) => {
            return voice.lang.toLowerCase().startsWith("ru");
        });

        if (russianVoice) {
            utterance.voice = russianVoice;
        }

        window.speechSynthesis.speak(utterance);
    }

    function pointerAngle(event) {
        const rectangle = elements.drag.getBoundingClientRect();
        const centerX = rectangle.left + rectangle.width / 2;
        const centerY = rectangle.top + rectangle.height / 2;
        return Math.atan2(event.clientY - centerY, event.clientX - centerX);
    }

    elements.drag.addEventListener("pointerdown", (event) => {
        if (event.button !== 0) {
            return;
        }

        dragStartAngle = pointerAngle(event);
        dragPreviousAngle = dragStartAngle;
        dragAccumulatedDegrees = 0;
        elements.drag.setPointerCapture(event.pointerId);
    });

    elements.drag.addEventListener("pointermove", (event) => {
        if (dragStartAngle === null) {
            return;
        }

        const currentAngle = pointerAngle(event);
        let angleDifference = currentAngle - dragPreviousAngle;
        angleDifference = Math.atan2(Math.sin(angleDifference), Math.cos(angleDifference));
        dragAccumulatedDegrees += angleDifference * 180 / Math.PI;
        dragPreviousAngle = currentAngle;

        // Each complete gesture step spins the dial and reveals a new value.
        if (Math.abs(dragAccumulatedDegrees) >= degreesPerSpin) {
            spinDial(dragAccumulatedDegrees > 0 ? 1 : -1);
            dragAccumulatedDegrees = 0;
        }
    });

    function finishDragging() {
        dragStartAngle = null;
        dragPreviousAngle = null;
        dragAccumulatedDegrees = 0;
    }

    elements.drag.addEventListener("pointerup", finishDragging);
    elements.drag.addEventListener("pointercancel", finishDragging);
    elements.drag.addEventListener("lostpointercapture", finishDragging);

    elements.drag.addEventListener("keydown", (event) => {
        if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
            event.preventDefault();
            spinDial(event.key === "ArrowRight" ? 1 : -1);
        }
    });

    elements.left.addEventListener("click", () => spinDial(-1));
    elements.right.addEventListener("click", () => spinDial(1));
    elements.check.addEventListener("click", checkAnswer);
    elements.next.addEventListener("click", advanceChallenge);
    elements.reset.addEventListener("click", resetChallenge);
    elements.hear.addEventListener("click", speakChallenge);

    resetChallenge();
})();
