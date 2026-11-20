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
