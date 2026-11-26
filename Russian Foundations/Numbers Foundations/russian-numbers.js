// Main reactor: use the exact same completion signals as the operator nodules.
function updateQuantumReactorIllumination() {
    const scene = document.getElementById("reactor-landing");
    if (!scene) {
        return;
    }

    const operators = ["multiply", "divide", "fractions", "percent"];
    let completed = 0;
    for (const operator of operators) {
        const nodule = scene.querySelector(`.reactor-nodule--${operator}`);
        const energized = nodule.classList.contains("is-energized");
        scene.classList.toggle(`has-${operator}`, energized);
        if (energized) {
            completed += 1;
        }
    }

    scene.classList.toggle("is-fully-energized", completed === 4);
    scene.querySelector(".reactor-activation-status").textContent = completed === 4
        ? "Quantum Math Reactor fully energized!"
        : `${completed} of 4 reactor segments energized.`;
}

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
        use: { complete: 0, total: 1, id: "use-progress-count" }
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


// ============================================================
// NUMBERS LISTENING ROOM — FIFTEEN-EXPERIENCE NAVIGATION
// Navigation only: content and completion logic come later.
// All navigation buttons are explicitly authored in HTML.
// ============================================================
(() => {
    const room = document.querySelector(".listening-room");
    const landing = document.getElementById("landingScreen");
    const experience = document.getElementById("experienceScreen");
    const completion = document.getElementById("completionScreen");
    const enterButton = document.getElementById("enterButton");
    const restartButton = document.getElementById("restartButton");
    const buttons = Array.from(document.querySelectorAll(".encounter-nav-button"));
    const label = document.getElementById("moveLabel");
    const prompt = document.getElementById("movePrompt");
    const title = document.getElementById("encounterTitle");
    const hotel = document.getElementById("lr-hotel");
    const numberExperiences = Array.from(document.querySelectorAll(".lr-number"));
    const placeholder = document.getElementById("lr-placeholder");
    const cafe = document.getElementById("lr-cafe");
    const station = document.getElementById("lr-station");
    const remainingConversations = ["market", "pharmacy", "bus", "tools", "airport"].map((slug) => document.getElementById(`lr-${slug}`));

    const experienceNames = [
        "Hotel Room Number",
        "Train Number",
        "Team Score",
        "High Card",
        "Locker Number",
        "Seat Ticket Number",
        "Book Number",
        "Favorite Runner Number",
        "At the Café",
        "At the Train Station",
        "At the Market",
        "At the Pharmacy",
        "Taking the Bus",
        "At the Tool Shop",
        "At the Airport"
    ];

    function selectExperience(index) {
        if (!Number.isInteger(index) || index < 0 || index >= experienceNames.length) {
            return;
        }

        window.speechSynthesis?.cancel();
        label.textContent = `EXPERIENCE ${index + 1}`;
        prompt.textContent = experienceNames[index];
        title.textContent = "Listening For Meaning";
        hotel.hidden = index !== 0;
        numberExperiences.forEach((section) => {
            section.hidden = section.id !== `lr-number-${index + 1}`;
        });
        cafe.hidden = index !== 8;
        station.hidden = index !== 9;
        remainingConversations.forEach((section, offset) => {
            section.hidden = index !== offset + 10;
        });
        placeholder.hidden = true;

        buttons.forEach((button) => {
            const selected = Number(button.dataset.encounterIndex) === index;
            button.classList.toggle("encounter-nav-button--current", selected);
            button.setAttribute("aria-pressed", String(selected));
            const state = button.querySelector(".encounter-nav-button__state");
            if (state) {
                state.textContent = selected ? "You are here" : "Open";
            }
        });
    }

    buttons.forEach((button) => {
        button.addEventListener("click", () => {
            selectExperience(Number(button.dataset.encounterIndex));
        });
    });

    enterButton?.addEventListener("click", () => {
        landing.hidden = true;
        completion.hidden = true;
        experience.hidden = false;
        selectExperience(0);
        room?.scrollIntoView({ behavior: "smooth", block: "start" });
    });

    restartButton?.addEventListener("click", () => {
        completion.hidden = true;
        experience.hidden = true;
        landing.hidden = false;
        room?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
})();
// END THE LISTENING ROOM

// ============================================================
// LISTENING ROOM — EXPERIENCE 1: HOTEL ROOM NUMBER
// All answer hotspots and vocabulary buttons are in the HTML.
// ============================================================
(() => {
    const hotel = document.getElementById("lr-hotel");
    if (!hotel) return;

    const listen = document.getElementById("lr-hotel-listen");
    const reveal = document.getElementById("lr-hotel-reveal");
    const reset = document.getElementById("lr-hotel-reset");
    const transcript = document.getElementById("lr-hotel-transcript");
    const status = document.getElementById("lr-hotel-status");
    const feedback = document.getElementById("lr-hotel-feedback");
    const meaning = document.getElementById("lr-hotel-meaning");
    const choices = Array.from(hotel.querySelectorAll(".lr-hotel__hotspot"));

    listen.addEventListener("click", () => {
        if (!("speechSynthesis" in window)) {
            status.textContent = "Russian speech is not available in this browser.";
            return;
        }
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance("Ваш номер — четыреста семнадцать.");
        utterance.lang = "ru-RU";
        utterance.rate = 0.85;
        const voice = window.speechSynthesis.getVoices().find((item) => item.lang.toLowerCase().startsWith("ru"));
        if (voice) utterance.voice = voice;
        utterance.onstart = () => { status.textContent = "Listen carefully, then choose a room."; };
        utterance.onerror = () => { status.textContent = "Audio could not be played. Try Listen again."; };
        window.speechSynthesis.speak(utterance);
    });

    choices.forEach((button) => {
        button.addEventListener("click", () => {
            choices.forEach((choice) => {
                choice.classList.remove("lr-hotel__hotspot--correct", "lr-hotel__hotspot--incorrect");
                choice.setAttribute("aria-pressed", String(choice === button));
            });
            const correct = button.dataset.room === "417";
            button.classList.add(correct ? "lr-hotel__hotspot--correct" : "lr-hotel__hotspot--incorrect");
            feedback.textContent = correct ? "Correct! Your room number is 417. Отлично!" : `Not quite. You chose ${button.dataset.room}. Listen again and try another room.`;
            feedback.classList.toggle("lr-hotel__feedback--correct", correct);
        });
    });

    reveal.addEventListener("click", () => {
        transcript.hidden = !transcript.hidden;
        reveal.textContent = transcript.hidden ? "Reveal the Text" : "Hide the Text";
        reveal.setAttribute("aria-expanded", String(!transcript.hidden));
    });

    hotel.querySelectorAll(".lr-hotel__word").forEach((button) => {
        button.addEventListener("click", () => { meaning.textContent = button.dataset.meaning; });
    });

    reset.addEventListener("click", () => {
        window.speechSynthesis?.cancel();
        choices.forEach((choice) => {
            choice.classList.remove("lr-hotel__hotspot--correct", "lr-hotel__hotspot--incorrect");
            choice.setAttribute("aria-pressed", "false");
        });
        transcript.hidden = true;
        reveal.textContent = "Reveal the Text";
        reveal.setAttribute("aria-expanded", "false");
        feedback.textContent = "";
        feedback.classList.remove("lr-hotel__feedback--correct");
        meaning.textContent = "Select an underlined Russian word for its meaning.";
        status.textContent = "Press Listen to hear your room number.";
    });
})();





// ============================================================
// LISTENING ROOM — EXPERIENCES 2–8
// All answer hotspots and vocabulary buttons are authored in HTML.
// ============================================================
(() => {
    document.querySelectorAll(".lr-number").forEach((section) => {
        const listen = section.querySelector(".lr-number__listen");
        const reveal = section.querySelector(".lr-number__reveal");
        const reset = section.querySelector(".lr-number__reset");
        const transcript = section.querySelector(".lr-number__transcript");
        const status = section.querySelector(".lr-number__status");
        const feedback = section.querySelector(".lr-number__feedback");
        const meaning = section.querySelector(".lr-number__meaning");
        const choices = Array.from(section.querySelectorAll(".lr-number__hotspot"));

        listen.addEventListener("click", () => {
            if (!("speechSynthesis" in window)) {
                status.textContent = "Russian speech is not available in this browser.";
                return;
            }

            window.speechSynthesis.cancel();
            const utterance = new SpeechSynthesisUtterance(section.dataset.spoken);
            utterance.lang = "ru-RU";
            utterance.rate = 0.85;
            const voice = window.speechSynthesis.getVoices().find((item) => {
                return item.lang.toLowerCase().startsWith("ru");
            });
            if (voice) {
                utterance.voice = voice;
            }
            utterance.onstart = () => {
                status.textContent = "Listen carefully, then choose an answer.";
            };
            utterance.onerror = () => {
                status.textContent = "Audio could not be played. Try again.";
            };
            window.speechSynthesis.speak(utterance);
        });

        choices.forEach((button) => {
            button.addEventListener("click", () => {
                choices.forEach((choice) => {
                    choice.classList.remove("lr-number__hotspot--correct", "lr-number__hotspot--incorrect");
                    choice.setAttribute("aria-pressed", String(choice === button));
                });

                const correct = button.dataset.answer === section.dataset.correct;
                button.classList.add(correct ? "lr-number__hotspot--correct" : "lr-number__hotspot--incorrect");
                feedback.textContent = correct
                    ? `Correct! ${button.dataset.answer}. Отлично!`
                    : `Not quite. You chose ${button.dataset.answer}. Listen again and try another answer.`;
                feedback.classList.toggle("lr-hotel__feedback--correct", correct);
            });
        });

        reveal.addEventListener("click", () => {
            transcript.hidden = !transcript.hidden;
            reveal.textContent = transcript.hidden ? "Reveal the Text" : "Hide the Text";
            reveal.setAttribute("aria-expanded", String(!transcript.hidden));
        });

        section.querySelectorAll(".lr-hotel__word").forEach((button) => {
            button.addEventListener("click", () => {
                meaning.textContent = button.dataset.meaning;
            });
        });

        reset.addEventListener("click", () => {
            window.speechSynthesis?.cancel();
            choices.forEach((choice) => {
                choice.classList.remove("lr-number__hotspot--correct", "lr-number__hotspot--incorrect");
                choice.setAttribute("aria-pressed", "false");
            });
            transcript.hidden = true;
            reveal.textContent = "Reveal the Text";
            reveal.setAttribute("aria-expanded", "false");
            feedback.textContent = "";
            feedback.classList.remove("lr-hotel__feedback--correct");
            meaning.textContent = "Select an underlined Russian word for its meaning.";
            status.textContent = "Press Listen, then choose your answer.";
        });
    });
})();

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


// ============================================================
// PRACTICE ACTIVITY 2 — GOLDEN NUMBER LOCK (11–19)
// The left digit stays at 1; the right digit moves from 1 to 9.
// All controls and display elements are authored in HTML.
// ============================================================
(function initializeGoldenNumberLock() {
    const root = document.getElementById("practice-2");

    if (!root) {
        return;
    }

    const elements = {
        ones: document.getElementById("gold-lock-ones"),
        selected: document.getElementById("gold-lock-selected"),
        progress: document.getElementById("gold-lock-progress"),
        word: document.getElementById("gold-lock-word"),
        up: document.getElementById("gold-lock-up"),
        down: document.getElementById("gold-lock-down"),
        hear: document.getElementById("gold-lock-hear"),
        reveal: document.getElementById("gold-lock-reveal"),
        reset: document.getElementById("gold-lock-reset"),
        feedback: document.getElementById("gold-lock-feedback"),
        answer: document.getElementById("gold-lock-answer"),
        success: document.getElementById("gold-lock-success")
    };

    const russianTeens = [
        "одиннадцать",
        "двенадцать",
        "тринадцать",
        "четырнадцать",
        "пятнадцать",
        "шестнадцать",
        "семнадцать",
        "восемнадцать",
        "девятнадцать"
    ];

    let onesDigit = 1;
    const discovered = new Set();

    function updateDisplay() {
        const number = 10 + onesDigit;
        elements.ones.textContent = String(onesDigit);
        elements.selected.textContent = `Selected: ${number}`;
        elements.word.textContent = russianTeens[onesDigit - 1];
        elements.progress.textContent = `Discovered ${discovered.size} of 9 numbers`;
        elements.answer.hidden = true;
        elements.answer.textContent = "";
        elements.feedback.textContent = "Say the Russian word, then reveal its meaning.";
        elements.success.hidden = discovered.size !== 9;
    }

    function turnWheel(direction) {
        onesDigit = ((onesDigit - 1 + direction + 9) % 9) + 1;
        elements.ones.classList.remove("is-turning");
        void elements.ones.offsetWidth;
        elements.ones.classList.add("is-turning");
        updateDisplay();
    }

    function revealMeaning() {
        const number = 10 + onesDigit;
        discovered.add(number);
        elements.answer.textContent = `${russianTeens[onesDigit - 1]} = ${number} (${number} in English)`;
        elements.answer.hidden = false;
        elements.progress.textContent = `Discovered ${discovered.size} of 9 numbers`;
        elements.feedback.textContent = discovered.size === 9
            ? "All nine numbers discovered! The golden lock is open."
            : "Excellent! Turn the right wheel to discover another number.";
        elements.success.hidden = discovered.size !== 9;
    }

    function hearNumber() {
        if (!( "speechSynthesis" in window) || !window.SpeechSynthesisUtterance) {
            elements.feedback.textContent = "Russian speech playback is unavailable in this browser.";
            return;
        }

        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(russianTeens[onesDigit - 1]);
        utterance.lang = "ru-RU";
        utterance.rate = 0.85;
        const voice = window.speechSynthesis.getVoices().find((candidate) => {
            return candidate.lang.toLowerCase().startsWith("ru");
        });

        if (voice) {
            utterance.voice = voice;
        }

        window.speechSynthesis.speak(utterance);
    }

    function resetActivity() {
        discovered.clear();
        onesDigit = 1;
        elements.ones.classList.remove("is-turning");
        updateDisplay();
        elements.feedback.textContent = "Turn the right wheel to explore numbers 11–19.";
    }

    elements.up.addEventListener("click", () => turnWheel(1));
    elements.down.addEventListener("click", () => turnWheel(-1));
    elements.hear.addEventListener("click", hearNumber);
    elements.reveal.addEventListener("click", revealMeaning);
    elements.reset.addEventListener("click", resetActivity);

    resetActivity();
})();


// ============================================================
// PRACTICE ACTIVITY 3 — THE TENS (10–90)
// The tens wheel is interactive; the ones wheel stays at zero.
// The four arrow buttons and all number displays exist in HTML.
// ============================================================
(function initializeTensBagActivity() {
    const root = document.getElementById("practice-3");

    if (!root) {
        return;
    }

    const elements = {
        wheel: root.querySelector(".tens-bag-activity__wheel--tens"),
        previous: document.getElementById("tens-bag-tens-prev"),
        current: document.getElementById("tens-bag-tens-current"),
        next: document.getElementById("tens-bag-tens-next"),
        up: document.getElementById("tens-bag-tens-up"),
        down: document.getElementById("tens-bag-tens-down"),
        selected: document.getElementById("tens-bag-selected"),
        progress: document.getElementById("tens-bag-progress"),
        word: document.getElementById("tens-bag-word"),
        hear: document.getElementById("tens-bag-hear"),
        check: document.getElementById("tens-bag-check"),
        nextChallenge: document.getElementById("tens-bag-next"),
        reset: document.getElementById("tens-bag-reset"),
        feedback: document.getElementById("tens-bag-feedback"),
        success: document.getElementById("tens-bag-success")
    };

    const russianTens = {
        1: "десять",
        2: "двадцать",
        3: "тридцать",
        4: "сорок",
        5: "пятьдесят",
        6: "шестьдесят",
        7: "семьдесят",
        8: "восемьдесят",
        9: "девяносто"
    };

    let tensDigit = 1;
    let challengeIndex = 0;
    let challenges = [];
    let answered = false;

    function shuffleChallenges() {
        const values = [1, 2, 3, 4, 5, 6, 7, 8, 9];

        for (let index = values.length - 1; index > 0; index -= 1) {
            const randomIndex = Math.floor(Math.random() * (index + 1));
            [values[index], values[randomIndex]] = [values[randomIndex], values[index]];
        }

        return values;
    }

    function wrapDigit(value) {
        return ((value - 1 + 9) % 9) + 1;
    }

    function updateWheel() {
        elements.previous.textContent = String(wrapDigit(tensDigit - 1));
        elements.current.textContent = String(tensDigit);
        elements.next.textContent = String(wrapDigit(tensDigit + 1));
        elements.selected.textContent = `Selected: ${tensDigit * 10}`;

        // The Russian word always describes the number visible on the bag.
        elements.word.textContent = russianTens[tensDigit];
    }

    function turnWheel(direction) {
        tensDigit = wrapDigit(tensDigit + direction);
        answered = false;
        elements.wheel.classList.remove("is-rolling-up", "is-rolling-down");
        void elements.wheel.offsetWidth;
        elements.wheel.classList.add(direction > 0 ? "is-rolling-up" : "is-rolling-down");
        elements.check.disabled = false;
        elements.nextChallenge.disabled = true;
        elements.success.hidden = true;
        updateWheel();
        elements.feedback.textContent = "Read and say the Russian word, then check its meaning.";
    }

    function showChallenge() {
        answered = false;
        elements.progress.textContent = `Discovery ${challengeIndex + 1} of 9`;
        elements.feedback.textContent = "Turn the tens wheel to discover its Russian word.";
        elements.check.disabled = false;
        elements.nextChallenge.disabled = true;
        elements.up.disabled = false;
        elements.down.disabled = false;
        elements.success.hidden = true;
        updateWheel();
    }

    function checkAnswer() {
        if (answered) {
            return;
        }

        answered = true;
        elements.check.disabled = true;
        elements.nextChallenge.disabled = challengeIndex >= 8;
        elements.feedback.textContent = `${russianTens[tensDigit]} means ${tensDigit * 10} in English. Well done!`;

        if (challengeIndex === 8) {
            elements.success.hidden = false;
            elements.feedback.textContent += " You have completed all nine discoveries!";
        }
    }

    function hearNumber() {
        if (!( "speechSynthesis" in window) || !window.SpeechSynthesisUtterance) {
            elements.feedback.textContent = "Russian audio is unavailable in this browser.";
            return;
        }

        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(russianTens[tensDigit]);
        utterance.lang = "ru-RU";
        utterance.rate = 0.85;
        const voice = window.speechSynthesis.getVoices().find((candidate) => {
            return candidate.lang.toLowerCase().startsWith("ru");
        });

        if (voice) {
            utterance.voice = voice;
        }

        window.speechSynthesis.speak(utterance);
    }

    function resetActivity() {
        challengeIndex = 0;
        tensDigit = 1;
        elements.wheel.classList.remove("is-rolling-up", "is-rolling-down");
        showChallenge();
    }

    elements.up.addEventListener("click", () => turnWheel(1));
    elements.down.addEventListener("click", () => turnWheel(-1));
    elements.hear.addEventListener("click", hearNumber);
    elements.check.addEventListener("click", checkAnswer);
    elements.nextChallenge.addEventListener("click", () => {
        if (!answered || challengeIndex >= 8) {
            return;
        }

        challengeIndex += 1;
        tensDigit = wrapDigit(tensDigit + 1);
        showChallenge();
    });
    elements.reset.addEventListener("click", resetActivity);

    resetActivity();
})();


// ============================================================
// PRACTICE ACTIVITY 4 — THE BRONZE CODEBREAKER (21–99)
// All controls and wheel displays are authored directly in HTML.
// ============================================================

(() => {
    const root = document.getElementById("practice-4");

    if (!root) {
        return;
    }

    const byId = (id) => document.getElementById(id);
    const elements = {
        tensPrevious: byId("bronze-tens-previous"),
        tensCurrent: byId("bronze-tens-current"),
        tensNext: byId("bronze-tens-next"),
        onesPrevious: byId("bronze-ones-previous"),
        onesCurrent: byId("bronze-ones-current"),
        onesNext: byId("bronze-ones-next"),
        tensUp: byId("bronze-tens-up"),
        tensDown: byId("bronze-tens-down"),
        onesUp: byId("bronze-ones-up"),
        onesDown: byId("bronze-ones-down"),
        readout: byId("bronze-dial-readout"),
        hear: byId("bronze-hear"),
        slower: byId("bronze-slower"),
        unlock: byId("bronze-unlock"),
        hint: byId("bronze-hint"),
        hintText: byId("bronze-hint-text"),
        next: byId("bronze-next"),
        reset: byId("bronze-reset"),
        feedback: byId("bronze-feedback"),
        progress: byId("bronze-progress-label"),
        dots: [...root.querySelectorAll(".bronze-codebreaker__progress-dots span")],
        locked: byId("bronze-discovery-locked"),
        unlocked: byId("bronze-discovery-unlocked"),
        number: byId("bronze-discovery-number"),
        russian: byId("bronze-discovery-russian"),
        breakdown: byId("bronze-discovery-breakdown")
    };

    const tensWords = {
        2: "двадцать",
        3: "тридцать",
        4: "сорок",
        5: "пятьдесят",
        6: "шестьдесят",
        7: "семьдесят",
        8: "восемьдесят",
        9: "девяносто"
    };

    const onesWords = {
        0: "",
        1: "один",
        2: "два",
        3: "три",
        4: "четыре",
        5: "пять",
        6: "шесть",
        7: "семь",
        8: "восемь",
        9: "девять"
    };

    let tens = 2;
    let ones = 0;
    let targets = [];
    let challengeIndex = 0;
    let solved = false;
    let hintLevel = 0;

    function russianNumber(number) {
        const tensPart = Math.floor(number / 10);
        const onesPart = number % 10;
        return `${tensWords[tensPart]} ${onesWords[onesPart]}`.trim();
    }

    function wrap(value, minimum, maximum) {
        const length = maximum - minimum + 1;
        return ((value - minimum + length) % length) + minimum;
    }

    function updateWheels() {
        elements.tensPrevious.textContent = wrap(tens - 1, 2, 9);
        elements.tensCurrent.textContent = tens;
        elements.tensNext.textContent = wrap(tens + 1, 2, 9);
        elements.onesPrevious.textContent = wrap(ones - 1, 0, 9);
        elements.onesCurrent.textContent = ones;
        elements.onesNext.textContent = wrap(ones + 1, 0, 9);
        elements.readout.textContent = `Your combination: ${tens * 10 + ones}`;
    }

    function speakClue(rate) {
        if (!( "speechSynthesis" in window) || !window.SpeechSynthesisUtterance) {
            elements.feedback.textContent = "Russian speech playback is unavailable in this browser.";
            return;
        }

        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(russianNumber(targets[challengeIndex]));
        utterance.lang = "ru-RU";
        utterance.rate = rate;

        const voice = window.speechSynthesis.getVoices().find((candidate) => {
            return candidate.lang.toLowerCase().startsWith("ru");
        });

        if (voice) {
            utterance.voice = voice;
        }

        window.speechSynthesis.speak(utterance);
    }

    function updateProgress() {
        elements.progress.textContent = `Challenge ${challengeIndex + 1} of 5`;
        elements.dots.forEach((dot, index) => {
            dot.classList.toggle("is-complete", index < challengeIndex || (index === challengeIndex && solved));
            dot.classList.toggle("is-current", index === challengeIndex);
        });
    }

    function startChallenge() {
        solved = false;
        hintLevel = 0;
        elements.locked.hidden = false;
        elements.unlocked.hidden = true;
        elements.hintText.hidden = true;
        elements.hintText.textContent = "";
        elements.unlock.disabled = false;
        elements.next.disabled = true;
        elements.next.textContent = challengeIndex === 4 ? "Finish Round ✓" : "Next Challenge →";
        elements.feedback.textContent = "Listen to the Russian clue, then dial your answer.";
        updateProgress();
        updateWheels();
    }

    function turnWheel(place, direction) {
        if (solved) {
            return;
        }

        if (place === "tens") {
            tens = wrap(tens + direction, 2, 9);
        } else {
            ones = wrap(ones + direction, 0, 9);
        }

        updateWheels();
    }

    function checkCombination() {
        if (solved) {
            return;
        }

        const selected = tens * 10 + ones;
        const target = targets[challengeIndex];

        if (selected !== target) {
            elements.feedback.textContent = "Not quite! Listen again, adjust your number wheels, and press Unlock to try once more.";
            return;
        }

        solved = true;
        elements.unlock.disabled = true;
        elements.locked.hidden = true;
        elements.unlocked.hidden = false;
        elements.number.textContent = target;
        elements.russian.textContent = russianNumber(target);
        elements.breakdown.textContent = `${tensWords[tens]} (${tens * 10}) + ${onesWords[ones]} (${ones})`;
        elements.feedback.textContent = challengeIndex === 4
            ? "All five combinations unlocked! Select Reset & Shuffle to play again."
            : "You cracked the code! Отлично! Select Next Challenge to continue.";
        elements.next.disabled = challengeIndex === 4;
        updateProgress();
    }

    function showHint() {
        if (solved) {
            elements.feedback.textContent = "You've already unlocked this combination!";
            return;
        }

        hintLevel = Math.min(hintLevel + 1, 3);
        const target = targets[challengeIndex];
        const targetTens = Math.floor(target / 10);
        const targetOnes = target % 10;

        if (hintLevel === 1) {
            elements.hintText.textContent = `The tens word is «${tensWords[targetTens]}».`;
        } else if (hintLevel === 2) {
            elements.hintText.textContent = `The ones word is «${onesWords[targetOnes]}».`;
        } else {
            elements.hintText.textContent = `The full clue is «${russianNumber(target)}». Try dialing it now!`;
        }

        elements.hintText.hidden = false;
    }

    function resetRound() {
        const previous = targets.join(",");
        let nextTargets;

        do {
            const pool = [];

            for (let number = 21; number <= 99; number += 1) {
                if (number % 10 !== 0) {
                    pool.push(number);
                }
            }

            for (let index = pool.length - 1; index > 0; index -= 1) {
                const randomIndex = Math.floor(Math.random() * (index + 1));
                [pool[index], pool[randomIndex]] = [pool[randomIndex], pool[index]];
            }

            nextTargets = pool.slice(0, 5);
        } while (nextTargets.join(",") === previous);

        targets = nextTargets;
        challengeIndex = 0;
        tens = 2;
        ones = 0;
        startChallenge();
    }

    elements.tensUp.addEventListener("click", () => turnWheel("tens", 1));
    elements.tensDown.addEventListener("click", () => turnWheel("tens", -1));
    elements.onesUp.addEventListener("click", () => turnWheel("ones", 1));
    elements.onesDown.addEventListener("click", () => turnWheel("ones", -1));
    elements.hear.addEventListener("click", () => speakClue(0.85));
    elements.slower.addEventListener("click", () => speakClue(0.65));
    elements.unlock.addEventListener("click", checkCombination);
    elements.hint.addEventListener("click", showHint);
    elements.next.addEventListener("click", () => {
        if (!solved || challengeIndex >= 4) {
            return;
        }

        challengeIndex += 1;
        startChallenge();
    });
    elements.reset.addEventListener("click", resetRound);

    resetRound();
})();


// ============================================================
// PRACTICE ACTIVITY 5 — THE HUNDREDS COMBINATION LOCK
// Six arrow hotspots and three digit windows exist in HTML.
// JavaScript attaches behavior without creating any hotspots.
// ============================================================
(function initializeHundredsLockActivity() {
    const root = document.getElementById("practice-5");

    if (!root) {
        return;
    }

    const hundredsWords = ["", "сто", "двести", "триста", "четыреста", "пятьсот", "шестьсот", "семьсот", "восемьсот", "девятьсот"];
    const tensWords = ["", "десять", "двадцать", "тридцать", "сорок", "пятьдесят", "шестьдесят", "семьдесят", "восемьдесят", "девяносто"];
    const teenWords = ["десять", "одиннадцать", "двенадцать", "тринадцать", "четырнадцать", "пятнадцать", "шестнадцать", "семнадцать", "восемнадцать", "девятнадцать"];
    const onesWords = ["", "один", "два", "три", "четыре", "пять", "шесть", "семь", "восемь", "девять"];

    const displays = [
        document.getElementById("hundreds-lock-h"),
        document.getElementById("hundreds-lock-t"),
        document.getElementById("hundreds-lock-u")
    ];
    const progress = document.getElementById("hundreds-lock-progress");
    const progressDots = Array.from(document.querySelectorAll("#hundreds-lock-progress-dots span"));
    const clue = document.getElementById("hundreds-lock-clue");
    const feedback = document.getElementById("hundreds-lock-feedback");
    const result = document.getElementById("hundreds-lock-result");
    const resultIcon = document.getElementById("hundreds-lock-result-icon");
    const resultTitle = document.getElementById("hundreds-lock-result-title");
    const resultAnswer = document.getElementById("hundreds-lock-result-answer");
    const resultMessage = document.getElementById("hundreds-lock-result-message");
    const check = document.getElementById("hundreds-lock-check");
    const next = document.getElementById("hundreds-lock-next");
    const digits = [1, 0, 0];

    let challenges = [];
    let index = 0;
    let solved = false;

    function hideResult() {
        result.hidden = true;
        result.classList.remove("is-success", "is-retry");
        resultTitle.textContent = "";
        resultAnswer.textContent = "";
        resultMessage.textContent = "";
    }

    function showResult(type, title, answer, message) {
        result.classList.remove("is-success", "is-retry");
        result.classList.add(type === "success" ? "is-success" : "is-retry");
        resultIcon.textContent = type === "success" ? "🔓" : "🔒";
        resultTitle.textContent = title;
        resultAnswer.textContent = answer;
        resultAnswer.hidden = !answer;
        resultMessage.textContent = message;
        result.hidden = false;
    }

    function russianNumber(value) {
        const hundreds = Math.floor(value / 100);
        const remainder = value % 100;
        const tens = Math.floor(remainder / 10);
        const ones = remainder % 10;
        const parts = [hundredsWords[hundreds]];

        if (remainder >= 10 && remainder <= 19) {
            parts.push(teenWords[remainder - 10]);
        } else {
            if (tens > 0) {
                parts.push(tensWords[tens]);
            }
            if (ones > 0) {
                parts.push(onesWords[ones]);
            }
        }

        return parts.join(" ");
    }

    function selectedNumber() {
        return digits[0] * 100 + digits[1] * 10 + digits[2];
    }

    function updateDigits() {
        displays.forEach((display, position) => {
            display.textContent = String(digits[position]);
        });
    }

    function turnDigit(position, direction) {
        const minimum = position === 0 ? 1 : 0;
        const range = position === 0 ? 9 : 10;
        digits[position] = minimum + ((digits[position] - minimum + direction + range) % range);
        solved = false;
        check.disabled = false;
        next.disabled = true;
        hideResult();
        feedback.textContent = "Combination: " + selectedNumber() + ". Listen to the clue and try to unlock.";
        updateDigits();
    }

    function speakClue(slow) {
        if (!window.speechSynthesis || !window.SpeechSynthesisUtterance) {
            feedback.textContent = "Speech playback is unavailable in this browser.";
            return;
        }

        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(russianNumber(challenges[index]));
        utterance.lang = "ru-RU";
        utterance.rate = slow ? 0.6 : 0.85;
        const russianVoice = window.speechSynthesis.getVoices().find((voice) => voice.lang.toLowerCase().startsWith("ru"));

        if (russianVoice) {
            utterance.voice = russianVoice;
        }

        window.speechSynthesis.speak(utterance);
    }

    function showChallenge() {
        digits[0] = 1;
        digits[1] = 0;
        digits[2] = 0;
        solved = false;
        progress.textContent = "Challenge " + (index + 1) + " of " + challenges.length;
        progressDots.forEach((dot, dotIndex) => {
            dot.classList.toggle("is-current", dotIndex === index);
            dot.classList.toggle("is-complete", dotIndex < index);
        });
        clue.textContent = russianNumber(challenges[index]);
        hideResult();
        feedback.textContent = "Listen, turn the wheels, and unlock the number.";
        check.disabled = false;
        next.disabled = true;
        next.textContent = index === challenges.length - 1 ? "Finish Round ✓" : "Next Challenge →";
        updateDigits();
    }

    function shuffleChallenges() {
        const values = [105, 218, 326, 409, 537, 641, 754, 862, 993];

        for (let position = values.length - 1; position > 0; position -= 1) {
            const randomIndex = Math.floor(Math.random() * (position + 1));
            [values[position], values[randomIndex]] = [values[randomIndex], values[position]];
        }

        challenges = values;
        index = 0;
        showChallenge();
    }

    ["h", "t", "u"].forEach((part, position) => {
        document.getElementById("hundreds-lock-" + part + "-up").addEventListener("click", () => turnDigit(position, 1));
        document.getElementById("hundreds-lock-" + part + "-down").addEventListener("click", () => turnDigit(position, -1));
    });

    document.getElementById("hundreds-lock-hear").addEventListener("click", () => speakClue(false));
    document.getElementById("hundreds-lock-slow").addEventListener("click", () => speakClue(true));

    check.addEventListener("click", () => {
        if (selectedNumber() === challenges[index]) {
            solved = true;
            check.disabled = true;
            next.disabled = false;
            feedback.textContent = "";
            showResult(
                "success",
                "COMBINATION UNLOCKED!",
                challenges[index] + " — " + russianNumber(challenges[index]),
                "Excellent! You've cracked the Russian number."
            );
        } else {
            feedback.textContent = "";
            showResult(
                "retry",
                "NOT QUITE — STILL LOCKED!",
                "",
                "Listen again, read the Russian number, and adjust the wheels."
            );
        }
    });

    next.addEventListener("click", () => {
        if (!solved) {
            return;
        }

        if (index === challenges.length - 1) {
            feedback.textContent = "";
            showResult(
                "success",
                "ALL NINE COMBINATIONS UNLOCKED!",
                "",
                "Excellent work! Select Reset & Shuffle to play again."
            );
            next.disabled = true;
            return;
        }

        index += 1;
        showChallenge();
    });

    document.getElementById("hundreds-lock-reset").addEventListener("click", () => {
        if (window.speechSynthesis) {
            window.speechSynthesis.cancel();
        }
        shuffleChallenges();
    });

    shuffleChallenges();
})();


// ============================================================
// ACTIVITY 6 — THE GRAND NUMBERS CHALLENGE
// Three independent experiences; controls are authored in HTML.
// ============================================================
(() => {
    const root = document.getElementById("practice-6");
    if (!root) {
        return;
    }

    const hundreds = ["", "сто", "двести", "триста", "четыреста", "пятьсот", "шестьсот", "семьсот", "восемьсот", "девятьсот"];
    const teens = ["десять", "одиннадцать", "двенадцать", "тринадцать", "четырнадцать", "пятнадцать", "шестнадцать", "семнадцать", "восемнадцать", "девятнадцать"];
    const tens = ["", "", "двадцать", "тридцать", "сорок", "пятьдесят", "шестьдесят", "семьдесят", "восемьдесят", "девяносто"];
    const ones = ["", "один", "два", "три", "четыре", "пять", "шесть", "семь", "восемь", "девять"];
    const roundSize = 8;

    function partsFor(number) {
        if (number === 0) {
            return { hundreds: "", tens: "", ones: "ноль" };
        }
        const remainder = number % 100;
        return {
            hundreds: hundreds[Math.floor(number / 100)],
            tens: remainder >= 10 && remainder <= 19 ? teens[remainder - 10] : tens[Math.floor(remainder / 10)],
            ones: remainder >= 10 && remainder <= 19 ? "" : ones[remainder % 10]
        };
    }

    function russianNumber(number) {
        return Object.values(partsFor(number)).filter(Boolean).join(" ");
    }

    function shuffled(items) {
        const result = [...items];
        for (let index = result.length - 1; index > 0; index -= 1) {
            const other = Math.floor(Math.random() * (index + 1));
            [result[index], result[other]] = [result[other], result[index]];
        }
        return result;
    }

    function speak(number, rate = 0.85) {
        if (!window.speechSynthesis || !window.SpeechSynthesisUtterance) {
            return false;
        }
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(russianNumber(number));
        utterance.lang = "ru-RU";
        utterance.rate = rate;
        const russianVoice = window.speechSynthesis.getVoices().find((voice) => {
            return voice.lang.toLowerCase().startsWith("ru");
        });
        if (russianVoice) {
            utterance.voice = russianVoice;
        }
        window.speechSynthesis.speak(utterance);
        return true;
    }

    function feedback(id, message, type = "") {
        const element = document.getElementById(id);
        element.textContent = message;
        element.classList.remove("is-success", "is-retry");
        if (type) {
            element.classList.add(`is-${type}`);
        }
    }

    // Tabs: retain independent progress when changing experiences.
    const tabs = [...root.querySelectorAll("[data-grand-tab]")];
    function activateTab(name) {
        tabs.forEach((tab) => {
            const active = tab.dataset.grandTab === name;
            tab.classList.toggle("is-active", active);
            tab.setAttribute("aria-selected", String(active));
            tab.tabIndex = active ? 0 : -1;
            document.getElementById(`grand-panel-${tab.dataset.grandTab}`).hidden = !active;
        });
        window.speechSynthesis?.cancel();
    }
    tabs.forEach((tab, index) => {
        tab.addEventListener("click", () => activateTab(tab.dataset.grandTab));
        tab.addEventListener("keydown", (event) => {
            if (!["ArrowRight", "ArrowLeft", "Home", "End"].includes(event.key)) {
                return;
            }
            event.preventDefault();
            const target = event.key === "Home" ? 0 : event.key === "End" ? tabs.length - 1 :
                (index + (event.key === "ArrowRight" ? 1 : -1) + tabs.length) % tabs.length;
            activateTab(tabs[target].dataset.grandTab);
            tabs[target].focus();
        });
    });

    // TAB 1 — Listen without a written clue.
    const listenPool = [407, 470, 704, 18, 81, 108, 309, 930, 56, 65, 215, 512, 900, 90, 19, 119, 606, 660, 77, 707];
    let listenRound = [];
    let listenIndex = 0;
    let listenSolved = false;
    const listenButtons = [...root.querySelectorAll("[data-listen-choice]")];

    function updateListenDots() {
        const dots = root.querySelectorAll(".grand-six__listen-dots span");
        dots.forEach((dot, index) => {
            dot.classList.toggle("is-complete", index < listenIndex);
            dot.classList.toggle("is-current", index === listenIndex);
        });
    }

    function showListen() {
        const target = listenRound[listenIndex];
        listenSolved = false;
        const distractors = shuffled(listenPool.filter((value) => value !== target &&
            String(value).length === String(target).length &&
            value !== target)).slice(0, 2);
        const choices = shuffled([target, ...distractors]);
        listenButtons.forEach((button, index) => {
            button.textContent = choices[index];
            button.dataset.value = String(choices[index]);
            button.disabled = false;
            button.classList.remove("is-picked");
        });
        document.getElementById("grand-listen-next").disabled = true;
        document.getElementById("grand-listen-progress").textContent = `Challenge ${listenIndex + 1} of ${roundSize}`;
        updateListenDots();
        feedback("grand-listen-feedback", "");
    }

    function resetListen() {
        listenRound = shuffled(listenPool).slice(0, roundSize);
        listenIndex = 0;
        window.speechSynthesis?.cancel();
        showListen();
    }

    listenButtons.forEach((button) => {
        button.addEventListener("click", () => {
            if (listenSolved) {
                return;
            }
            const correct = Number(button.dataset.value) === listenRound[listenIndex];
            listenButtons.forEach((choice) => choice.classList.remove("is-picked"));
            button.classList.add("is-picked");
            if (correct) {
                listenSolved = true;
                listenButtons.forEach((choice) => { choice.disabled = true; });
                document.getElementById("grand-listen-next").disabled = false;
                feedback("grand-listen-feedback", "✓ Correct! You identified the spoken number. " +
                    (listenIndex === roundSize - 1 ? "All eight listening challenges solved!" : "Continue to the next challenge."), "success");
            } else {
                feedback("grand-listen-feedback", "Not quite — listen again and try another number.", "retry");
            }
        });
    });
    document.getElementById("grand-listen-hear").addEventListener("click", () => {
        if (!speak(listenRound[listenIndex])) {
            feedback("grand-listen-feedback", "Russian speech playback is unavailable in this browser.", "retry");
        }
    });
    document.getElementById("grand-listen-slow").addEventListener("click", () => {
        if (!speak(listenRound[listenIndex], 0.65)) {
            feedback("grand-listen-feedback", "Russian speech playback is unavailable in this browser.", "retry");
        }
    });
    document.getElementById("grand-listen-next").addEventListener("click", () => {
        if (!listenSolved) { return; }
        if (listenIndex === roundSize - 1) {
            feedback("grand-listen-feedback", "🏆 Listening round complete! Select Reset & Shuffle to play again.", "success");
            document.getElementById("grand-listen-next").disabled = true;
            return;
        }
        listenIndex += 1;
        showListen();
    });
    document.getElementById("grand-listen-reset").addEventListener("click", resetListen);

    // TAB 2 — Construct the Russian expression using HTML-authored word tiles.
    const buildPool = [526, 318, 745, 219, 94, 17, 600, 408, 901, 570, 82, 11, 999, 150, 260, 705];
    let buildRound = [];
    let buildIndex = 0;
    let buildSolved = false;
    let chosen = { hundreds: null, tens: null, ones: null };
    const wordButtons = [...root.querySelectorAll(".grand-six__word")];

    function updateAssembled() {
        const words = ["hundreds", "tens", "ones"]
            .map((part) => chosen[part]?.dataset.word)
            .filter(Boolean);
        document.getElementById("grand-build-assembled").textContent = words.join(" ") || "Select a word from each column to build your answer";
    }

    function updateGrandHeaderDots(panelId, currentIndex) {
        const panel = document.getElementById(panelId);
        if (!panel) {
            return;
        }
        panel.querySelectorAll(".grand-six__listen-dots span").forEach((dot, index) => {
            dot.classList.toggle("is-current", index === currentIndex);
            dot.classList.toggle("is-complete", index < currentIndex);
        });
    }

    function showBuild() {
        buildSolved = false;
        chosen = { hundreds: null, tens: null, ones: null };
        wordButtons.forEach((button) => {
            button.disabled = false;
            button.classList.remove("is-picked");
            button.setAttribute("aria-pressed", "false");
        });
        document.getElementById("grand-build-target").textContent = buildRound[buildIndex];
        document.getElementById("grand-build-next").disabled = true;
        document.getElementById("grand-build-check").disabled = false;
        document.getElementById("grand-build-progress").textContent = `Challenge ${buildIndex + 1} of ${roundSize}`;
        updateGrandHeaderDots("grand-panel-build", buildIndex);
        feedback("grand-build-feedback", "");
        updateAssembled();
    }

    wordButtons.forEach((button) => {
        button.setAttribute("aria-pressed", "false");
        button.addEventListener("click", () => {
            if (buildSolved) { return; }
            const part = button.dataset.part;
            root.querySelectorAll(`.grand-six__word[data-part="${part}"]`).forEach((tile) => {
                tile.classList.remove("is-picked");
                tile.setAttribute("aria-pressed", "false");
            });
            chosen[part] = button;
            button.classList.add("is-picked");
            button.setAttribute("aria-pressed", "true");
            updateAssembled();
            feedback("grand-build-feedback", "Ready? Select Check My Russian to test your construction.");
        });
    });
    document.getElementById("grand-build-check").addEventListener("click", () => {
        if (Object.values(chosen).some((value) => value === null)) {
            feedback("grand-build-feedback", "Choose one option in each column, including (none) where appropriate.", "retry");
            return;
        }
        const expected = partsFor(buildRound[buildIndex]);
        const correct = Object.keys(expected).every((part) => chosen[part].dataset.word === expected[part]);
        if (correct) {
            buildSolved = true;
            wordButtons.forEach((button) => { button.disabled = true; });
            document.getElementById("grand-build-next").disabled = false;
            document.getElementById("grand-build-check").disabled = true;
            feedback("grand-build-feedback", `✓ Excellent! ${buildRound[buildIndex]} — ${russianNumber(buildRound[buildIndex])}`, "success");
        } else {
            feedback("grand-build-feedback", "Not quite. Recheck the hundreds, tens, and ones. Try again!", "retry");
        }
    });
    document.getElementById("grand-build-hear").addEventListener("click", () => {
        if (!buildSolved) {
            feedback("grand-build-feedback", "Build and check your answer first; then hear the correct pronunciation.");
            return;
        }
        speak(buildRound[buildIndex]);
    });
    document.getElementById("grand-build-next").addEventListener("click", () => {
        if (!buildSolved) { return; }
        if (buildIndex === roundSize - 1) {
            feedback("grand-build-feedback", "🏆 Russian construction round complete! Reset & Shuffle to play again.", "success");
            document.getElementById("grand-build-next").disabled = true;
            return;
        }
        buildIndex += 1;
        showBuild();
    });
    document.getElementById("grand-build-reset").addEventListener("click", () => {
        buildRound = shuffled(buildPool).slice(0, roundSize);
        buildIndex = 0;
        showBuild();
    });

    // TAB 3 — Zeros, including omitted tens or ones and round hundreds.
    const zeroPool = [708, 305, 901, 670, 400, 509, 802, 190, 60, 204, 700, 103, 980, 406, 90, 101];
    let zeroRound = [];
    let zeroIndex = 0;
    let zeroSolved = false;
    const zeroButtons = [...root.querySelectorAll("[data-zero-choice]")];

    function showZero() {
        zeroSolved = false;
        const target = zeroRound[zeroIndex];
        const alternatives = shuffled(zeroPool.filter((value) => value !== target && russianNumber(value) !== russianNumber(target))).slice(0, 2);
        const choices = shuffled([target, ...alternatives]);
        zeroButtons.forEach((button, index) => {
            button.textContent = russianNumber(choices[index]);
            button.dataset.value = String(choices[index]);
            button.disabled = false;
            button.classList.remove("is-picked");
        });
        document.getElementById("grand-zero-target").textContent = target;
        document.getElementById("grand-zero-progress").textContent = `Challenge ${zeroIndex + 1} of ${roundSize}`;
        updateGrandHeaderDots("grand-panel-zero", zeroIndex);
        document.getElementById("grand-zero-next").disabled = true;
        feedback("grand-zero-feedback", "Choose the expression that matches the digits.");
    }

    zeroButtons.forEach((button) => {
        button.addEventListener("click", () => {
            if (zeroSolved) { return; }
            const correct = Number(button.dataset.value) === zeroRound[zeroIndex];
            zeroButtons.forEach((choice) => choice.classList.remove("is-picked"));
            button.classList.add("is-picked");
            if (correct) {
                zeroSolved = true;
                zeroButtons.forEach((choice) => { choice.disabled = true; });
                document.getElementById("grand-zero-next").disabled = false;
                feedback("grand-zero-feedback", "✓ Correct! A zero place does not require the word ноль inside a compound number.", "success");
            } else {
                feedback("grand-zero-feedback", "Not quite — look for the missing place value and try again.", "retry");
            }
        });
    });
    document.getElementById("grand-zero-hear").addEventListener("click", () => {
        if (!speak(zeroRound[zeroIndex])) {
            feedback("grand-zero-feedback", "Russian speech playback is unavailable in this browser.", "retry");
        }
    });
    document.getElementById("grand-zero-next").addEventListener("click", () => {
        if (!zeroSolved) { return; }
        if (zeroIndex === roundSize - 1) {
            feedback("grand-zero-feedback", "🏆 Zero Challenge complete! Reset & Shuffle to play again.", "success");
            document.getElementById("grand-zero-next").disabled = true;
            return;
        }
        zeroIndex += 1;
        showZero();
    });
    document.getElementById("grand-zero-reset").addEventListener("click", () => {
        zeroRound = shuffled(zeroPool).slice(0, roundSize);
        zeroIndex = 0;
        showZero();
    });

    resetListen();
    document.getElementById("grand-build-reset").click();
    document.getElementById("grand-zero-reset").click();
})();

// ============================================================
// USE ACTIVITY 1 — THE NOUN EXCHANGE
// Hotspot SVG paths are explicitly authored in HTML.
// JavaScript attaches interactions to the existing elements.
// ============================================================

const nounExchangeObjects = {
    chair: {
        name: "Chair",
        russian: "стул",
        gender: "Masculine · nominative singular"
    },
    book: {
        name: "Book",
        russian: "книга",
        gender: "Feminine · nominative singular"
    },
    apple: {
        name: "Apple",
        russian: "яблоко",
        gender: "Neuter · nominative singular"
    }
};

const nounExchangeLanding = document.getElementById("noun-exchange-landing");
const nounExchangeDestination = document.getElementById("noun-exchange-destination");
const nounExchangePlaque = document.getElementById("noun-exchange-plaque");

function showNounExchangePlaque(nounKey) {
    const noun = nounExchangeObjects[nounKey];

    if (!noun || !nounExchangePlaque) {
        return;
    }

    document.getElementById("noun-exchange-plaque-name").textContent = noun.name;
    document.getElementById("noun-exchange-plaque-russian").textContent = noun.russian;
    document.getElementById("noun-exchange-plaque-gender").textContent = noun.gender;
    nounExchangePlaque.hidden = false;
}

function hideNounExchangePlaque() {
    if (nounExchangePlaque) {
        nounExchangePlaque.hidden = true;
    }
}

function openNounExchangeObject(nounKey) {
    const noun = nounExchangeObjects[nounKey];

    if (!noun || !nounExchangeLanding || !nounExchangeDestination) {
        return;
    }

    hideNounExchangePlaque();
    nounExchangeLanding.hidden = true;
    nounExchangeDestination.hidden = false;

    document.getElementById("noun-exchange-destination-title").innerHTML =
        `<span class="noun-exchange__title-english">${noun.name}</span>` +
        `<span class="noun-exchange__title-russian" lang="ru">${noun.russian}</span>`;
    document.getElementById("noun-exchange-destination-description").innerHTML =
        `${noun.gender}.<br>Change the number to see its Russian form.`;
    nounExchangeCurrentObject = nounKey;
    updateNounExchangeSentence();
}

document.querySelectorAll(".noun-exchange__hotspot").forEach((hotspot) => {
    hotspot.addEventListener("mouseenter", () => {
        showNounExchangePlaque(hotspot.dataset.noun);
    });

    hotspot.addEventListener("mouseleave", hideNounExchangePlaque);
    hotspot.addEventListener("focus", () => {
        showNounExchangePlaque(hotspot.dataset.noun);
    });

    hotspot.addEventListener("blur", hideNounExchangePlaque);
    hotspot.addEventListener("click", (event) => {
        event.preventDefault();
        openNounExchangeObject(hotspot.dataset.noun);
    });
});

document.getElementById("noun-exchange-back")?.addEventListener("click", () => {
    nounExchangeDestination.hidden = true;
    nounExchangeLanding.hidden = false;
    hideNounExchangePlaque();
});


// ============================================================
// THE NOUN EXCHANGE — LIVE NUMBER AND NOUN AGREEMENT
// The controls and discovery buttons are defined in HTML.
// ============================================================

let nounExchangeCurrentObject = "chair";

const nounExchangeForms = {
    chair: ["стул", "стула", "стульев"],
    book: ["книга", "книги", "книг"],
    apple: ["яблоко", "яблока", "яблок"]
};

const nounExchangeEnglish = {
    chair: ["chair", "chairs"],
    book: ["book", "books"],
    apple: ["apple", "apples"]
};

const nounExchangePersonEnglish = {
    "меня": "I have",
    "тебя": "You have",
    "него": "He has",
    "неё": "She has",
    "нас": "We have",
    "вас": "You have",
    "них": "They have"
};

function nounExchangeNumberWords(number, gender) {
    const units = ["ноль", "один", "два", "три", "четыре", "пять", "шесть", "семь", "восемь", "девять"];
    const teens = ["десять", "одиннадцать", "двенадцать", "тринадцать", "четырнадцать", "пятнадцать", "шестнадцать", "семнадцать", "восемнадцать", "девятнадцать"];
    const tens = ["", "", "двадцать", "тридцать", "сорок", "пятьдесят", "шестьдесят", "семьдесят", "восемьдесят", "девяносто"];
    const hundreds = ["", "сто", "двести", "триста", "четыреста", "пятьсот", "шестьсот", "семьсот", "восемьсот", "девятьсот"];

    function underThousand(value, formGender) {
        const words = [];
        if (value >= 100) {
            words.push(hundreds[Math.floor(value / 100)]);
            value %= 100;
        }
        if (value >= 10 && value < 20) {
            words.push(teens[value - 10]);
        } else {
            if (value >= 20) {
                words.push(tens[Math.floor(value / 10)]);
                value %= 10;
            }
            if (value > 0) {
                if (value === 1 && formGender === "feminine") {
                    words.push("одна");
                } else if (value === 1 && formGender === "neuter") {
                    words.push("одно");
                } else if (value === 2 && formGender === "feminine") {
                    words.push("две");
                } else {
                    words.push(units[value]);
                }
            }
        }
        return words.join(" ");
    }

    if (number === 0) {
        return units[0];
    }
    const thousands = Math.floor(number / 1000);
    const remainder = number % 1000;
    const parts = [];
    if (thousands > 0) {
        const thousandForm = thousands === 1 ? "тысяча" : thousands >= 2 && thousands <= 4 ? "тысячи" : "тысяч";
        parts.push(`${underThousand(thousands, "feminine")} ${thousandForm}`);
    }
    if (remainder > 0) {
        parts.push(underThousand(remainder, gender));
    }
    return parts.join(" ");
}

function nounExchangeFormIndex(number) {
    const lastTwo = number % 100;
    const lastOne = number % 10;
    if (lastTwo >= 11 && lastTwo <= 14) {
        return 2;
    }
    if (lastOne === 1) {
        return 0;
    }
    if (lastOne >= 2 && lastOne <= 4) {
        return 1;
    }
    return 2;
}

function updateNounExchangeSentence() {
    const input = document.getElementById("noun-exchange-number");
    const person = document.getElementById("noun-exchange-person").value;
    const raw = input.value.trim();
    const number = Number(raw);
    const numberOutput = document.getElementById("noun-exchange-number-result");
    const nounOutput = document.getElementById("noun-exchange-form-result");

    document.getElementById("noun-exchange-person-result").textContent = person;
    if (raw === "" || !Number.isInteger(number) || number < 0 || number > 999) {
        numberOutput.textContent = "—";
        nounOutput.textContent = "";
        return;
    }

    const noun = nounExchangeObjects[nounExchangeCurrentObject];
    const gender = noun.gender.split(" ")[0].toLowerCase();
    const index = nounExchangeFormIndex(number);
    const form = nounExchangeForms[nounExchangeCurrentObject][index];
    numberOutput.textContent = nounExchangeNumberWords(number, gender);
    nounOutput.textContent = form;
}

document.getElementById("noun-exchange-number")?.addEventListener("input", updateNounExchangeSentence);
document.getElementById("noun-exchange-person")?.addEventListener("change", updateNounExchangeSentence);

[
    ["noun-exchange-why-est", "noun-exchange-est-note"],
    ["noun-exchange-why-teens", "noun-exchange-teens-note"]
].forEach(([buttonId, noteId]) => {
    document.getElementById(buttonId)?.addEventListener("click", () => {
        const button = document.getElementById(buttonId);
        const note = document.getElementById(noteId);
        note.hidden = !note.hidden;
        button.setAttribute("aria-expanded", String(!note.hidden));
    });
});

// ==========================================================
// UNCLE MISHA — NUMBER CYCLE INTRODUCTORY LEARNING SCREEN
// ==========================================================
const mishaCycleScreen = document.getElementById("misha-cycle");
const mishaCycleVideo = document.getElementById("misha-cycle-video");
const openMishaCycleButton = document.getElementById("open-misha-cycle");
const closeMishaCycleButton = document.getElementById("close-misha-cycle");

if (mishaCycleScreen && openMishaCycleButton && closeMishaCycleButton) {
    openMishaCycleButton.addEventListener("click", () => {
        mishaCycleScreen.hidden = false;
        document.body.style.overflow = "hidden";
        closeMishaCycleButton.focus();
    });

    closeMishaCycleButton.addEventListener("click", () => {
        if (mishaCycleVideo) {
            mishaCycleVideo.pause();
        }

        mishaCycleScreen.hidden = true;
        document.body.style.overflow = "";
        openMishaCycleButton.focus();
    });
}


// ============================================================
// FOUR DOORS — LANDING PAGE NAVIGATION
// Hotspots and return buttons are explicitly defined in HTML.
// ============================================================

const numbersFourDoorsHub = document.getElementById("numbers-four-doors");
const numbersDoorLandings = document.querySelectorAll(".numbers-door-landing");

document.querySelectorAll("[data-door-open]").forEach((button) => {
    button.addEventListener("click", () => {
        const destination = document.getElementById(
            `numbers-door-${button.dataset.doorOpen}-landing`
        );

        if (!destination || !numbersFourDoorsHub) {
            return;
        }

        document.getElementById("numbers-rover-landing").hidden = true;
        numbersFourDoorsHub.hidden = true;

        numbersDoorLandings.forEach((landing) => {
            landing.hidden = landing !== destination;
        });

        destination.scrollIntoView({ behavior: "smooth", block: "start" });
    });
});

document.querySelectorAll("[data-door-back]").forEach((button) => {
    button.addEventListener("click", () => {
        numbersDoorLandings.forEach((landing) => {
            landing.hidden = true;
        });

        if (numbersFourDoorsHub) {
            numbersFourDoorsHub.hidden = false;
            numbersFourDoorsHub.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });
        }
    });
});

// ============================================================
// LISTENING ROOM — EXPERIENCE 9: AT THE CAFÉ
// All choices and vocabulary buttons are authored in HTML.
// ============================================================
(() => {
    const root = document.getElementById("lr-cafe");
    if (!root) {
        return;
    }

    const lines = [
        { speaker: "customer", text: "Сколько стоит чай?" },
        { speaker: "server", text: "Сто рублей." },
        { speaker: "customer", text: "А кофе?" },
        { speaker: "server", text: "Сто пятьдесят рублей." },
        { speaker: "customer", text: "Спасибо!" }
    ];
    const questions = [
        { question: "How much does the tea cost?", correct: "100" },
        { question: "Which drink costs more?", correct: "coffee" },
        { question: "How much do both drinks cost together?", correct: "250" }
    ];

    const status = document.getElementById("lr-cafe-status");
    const step = document.getElementById("lr-cafe-step");
    const question = document.getElementById("lr-cafe-question");
    const feedback = document.getElementById("lr-cafe-feedback");
    const next = document.getElementById("lr-cafe-next");
    const reveal = document.getElementById("lr-cafe-reveal");
    const transcript = document.getElementById("lr-cafe-transcript");
    const meaning = document.getElementById("lr-cafe-meaning");
    const customerIndicator = document.getElementById("lr-cafe-customer");
    const serverIndicator = document.getElementById("lr-cafe-server");
    const answerGroups = [1, 2, 3].map((number) => {
        return document.getElementById(`lr-cafe-answers-${number}`);
    });

    let questionIndex = 0;
    let playbackToken = 0;
    let answered = false;

    function clearSpeaker() {
        customerIndicator.classList.remove("lr-cafe__speaker--speaking");
        serverIndicator.classList.remove("lr-cafe__speaker--speaking");
    }

    function stopPlayback() {
        playbackToken += 1;
        window.speechSynthesis?.cancel();
        clearSpeaker();
    }

    function playLines(selectedLines) {
        stopPlayback();
        if (!window.speechSynthesis || !window.SpeechSynthesisUtterance) {
            status.textContent = "Russian speech is not available in this browser.";
            return;
        }

        const token = playbackToken;
        let position = 0;
        status.textContent = "Listening to Russian conversation…";

        function playNext() {
            if (token !== playbackToken) {
                return;
            }
            if (position >= selectedLines.length) {
                clearSpeaker();
                status.textContent = "Finished listening. Choose your answer, or replay the dialogue.";
                return;
            }

            const line = selectedLines[position];
            position += 1;
            const utterance = new SpeechSynthesisUtterance(line.text);
            utterance.lang = "ru-RU";
            utterance.rate = 0.85;
            const russianVoice = window.speechSynthesis.getVoices().find((voice) => {
                return voice.lang.toLowerCase().startsWith("ru");
            });
            if (russianVoice) {
                utterance.voice = russianVoice;
            }
            utterance.onstart = () => {
                if (token !== playbackToken) {
                    return;
                }
                clearSpeaker();
                const indicator = line.speaker === "customer" ? customerIndicator : serverIndicator;
                indicator.classList.add("lr-cafe__speaker--speaking");
            };
            utterance.onend = () => {
                if (token === playbackToken) {
                    playNext();
                }
            };
            utterance.onerror = () => {
                if (token === playbackToken) {
                    clearSpeaker();
                    status.textContent = "Speech playback was interrupted. Try Listen again.";
                }
            };
            window.speechSynthesis.speak(utterance);
        }

        playNext();
    }

    function showQuestion() {
        answered = false;
        step.textContent = `Question ${questionIndex + 1} of ${questions.length}`;
        question.textContent = questions[questionIndex].question;
        feedback.textContent = "";
        feedback.classList.remove("lr-cafe__feedback--correct");
        next.hidden = true;
        answerGroups.forEach((group, index) => {
            group.hidden = index !== questionIndex;
            group.querySelectorAll(".lr-cafe__answer").forEach((button) => {
                button.disabled = false;
                button.classList.remove("lr-cafe__answer--correct", "lr-cafe__answer--incorrect");
            });
        });
    }

    root.querySelectorAll(".lr-cafe__answer").forEach((button) => {
        button.addEventListener("click", () => {
            if (answered) {
                return;
            }
            const correct = button.dataset.cafeAnswer === questions[questionIndex].correct;
            button.classList.add(correct ? "lr-cafe__answer--correct" : "lr-cafe__answer--incorrect");
            feedback.textContent = correct
                ? "Correct! Отлично!"
                : "Not quite. Listen again and choose another answer.";
            feedback.classList.toggle("lr-cafe__feedback--correct", correct);
            if (correct) {
                answered = true;
                answerGroups[questionIndex].querySelectorAll(".lr-cafe__answer").forEach((choice) => {
                    choice.disabled = true;
                });
                next.textContent = questionIndex === 2 ? "Finish Experience" : "Next Question";
                next.hidden = false;
            }
        });
    });

    next.addEventListener("click", () => {
        if (questionIndex === questions.length - 1) {
            feedback.textContent = "All three questions complete! Отлично! You can replay or reset anytime.";
            next.hidden = true;
            return;
        }
        questionIndex += 1;
        showQuestion();
    });

    document.getElementById("lr-cafe-listen").addEventListener("click", () => playLines(lines));
    document.getElementById("lr-cafe-replay-customer").addEventListener("click", () => {
        playLines(lines.filter((line) => line.speaker === "customer"));
    });
    document.getElementById("lr-cafe-replay-server").addEventListener("click", () => {
        playLines(lines.filter((line) => line.speaker === "server"));
    });

    reveal.addEventListener("click", () => {
        transcript.hidden = !transcript.hidden;
        reveal.textContent = transcript.hidden ? "Reveal the Text" : "Hide the Text";
        reveal.setAttribute("aria-expanded", String(!transcript.hidden));
    });

    root.querySelectorAll(".lr-cafe__word").forEach((button) => {
        button.addEventListener("click", () => {
            meaning.textContent = `${button.textContent.trim()}: ${button.dataset.meaning}`;
        });
    });

    document.getElementById("lr-cafe-reset").addEventListener("click", () => {
        stopPlayback();
        questionIndex = 0;
        showQuestion();
        transcript.hidden = true;
        reveal.textContent = "Reveal the Text";
        reveal.setAttribute("aria-expanded", "false");
        meaning.textContent = "Select an underlined Russian word for its meaning.";
        status.textContent = "Listen to the whole conversation first.";
    });

    document.querySelectorAll(".encounter-nav-button").forEach((button) => {
        button.addEventListener("click", stopPlayback);
    });

    showQuestion();
})();


// ============================================================
// LISTENING ROOM — EXPERIENCE 10: AT THE TRAIN STATION
// All choices and vocabulary buttons are authored in HTML.
// ============================================================
(() => {
    const root = document.getElementById("lr-station");
    if (!root) {
        return;
    }

    const lines = [
        { speaker: "passenger", text: "Скажите, пожалуйста, какая платформа?" },
        { speaker: "attendant", text: "Платформа номер семь." },
        { speaker: "passenger", text: "Во сколько отправление?" },
        { speaker: "attendant", text: "В четырнадцать тридцать." },
        { speaker: "passenger", text: "А когда прибытие?" },
        { speaker: "attendant", text: "В шестнадцать сорок пять." },
        { speaker: "passenger", text: "Спасибо!" }
    ];
    const questions = [
        { question: "Which platform?", correct: "7" },
        { question: "What time does the train depart?", correct: "14:30" },
        { question: "What time does the train arrive?", correct: "16:45" }
    ];

    const status = document.getElementById("lr-station-status");
    const step = document.getElementById("lr-station-step");
    const question = document.getElementById("lr-station-question");
    const feedback = document.getElementById("lr-station-feedback");
    const next = document.getElementById("lr-station-next");
    const reveal = document.getElementById("lr-station-reveal");
    const transcript = document.getElementById("lr-station-transcript");
    const meaning = document.getElementById("lr-station-meaning");
    const passengerIndicator = document.getElementById("lr-station-passenger");
    const attendantIndicator = document.getElementById("lr-station-attendant");
    const answerGroups = [1, 2, 3].map((number) => {
        return document.getElementById(`lr-station-answers-${number}`);
    });

    let questionIndex = 0;
    let playbackToken = 0;
    let answered = false;

    function clearSpeaker() {
        passengerIndicator.classList.remove("lr-cafe__speaker--speaking");
        attendantIndicator.classList.remove("lr-cafe__speaker--speaking");
    }

    function stopPlayback() {
        playbackToken += 1;
        window.speechSynthesis?.cancel();
        clearSpeaker();
    }

    function playLines(selectedLines) {
        stopPlayback();
        if (!window.speechSynthesis || !window.SpeechSynthesisUtterance) {
            status.textContent = "Russian speech is not available in this browser.";
            return;
        }

        const token = playbackToken;
        let position = 0;
        status.textContent = "Listening to Russian conversation…";

        function playNext() {
            if (token !== playbackToken) {
                return;
            }
            if (position >= selectedLines.length) {
                clearSpeaker();
                status.textContent = "Finished listening. Choose your answer, or replay the dialogue.";
                return;
            }

            const line = selectedLines[position];
            position += 1;
            const utterance = new SpeechSynthesisUtterance(line.text);
            utterance.lang = "ru-RU";
            utterance.rate = 0.85;
            const russianVoice = window.speechSynthesis.getVoices().find((voice) => {
                return voice.lang.toLowerCase().startsWith("ru");
            });
            if (russianVoice) {
                utterance.voice = russianVoice;
            }
            utterance.onstart = () => {
                if (token !== playbackToken) {
                    return;
                }
                clearSpeaker();
                const indicator = line.speaker === "passenger" ? passengerIndicator : attendantIndicator;
                indicator.classList.add("lr-cafe__speaker--speaking");
            };
            utterance.onend = () => {
                if (token === playbackToken) {
                    playNext();
                }
            };
            utterance.onerror = () => {
                if (token === playbackToken) {
                    clearSpeaker();
                    status.textContent = "Speech playback was interrupted. Try Listen again.";
                }
            };
            window.speechSynthesis.speak(utterance);
        }

        playNext();
    }

    function showQuestion() {
        answered = false;
        step.textContent = `Question ${questionIndex + 1} of ${questions.length}`;
        question.textContent = questions[questionIndex].question;
        feedback.textContent = "";
        feedback.classList.remove("lr-cafe__feedback--correct");
        next.hidden = true;
        answerGroups.forEach((group, index) => {
            group.hidden = index !== questionIndex;
            group.querySelectorAll(".lr-cafe__answer").forEach((button) => {
                button.disabled = false;
                button.classList.remove("lr-cafe__answer--correct", "lr-cafe__answer--incorrect");
            });
        });
    }

    root.querySelectorAll(".lr-cafe__answer").forEach((button) => {
        button.addEventListener("click", () => {
            if (answered) {
                return;
            }
            const correct = button.dataset.stationAnswer === questions[questionIndex].correct;
            button.classList.add(correct ? "lr-cafe__answer--correct" : "lr-cafe__answer--incorrect");
            feedback.textContent = correct
                ? "Correct! Отлично!"
                : "Not quite. Listen again and choose another answer.";
            feedback.classList.toggle("lr-cafe__feedback--correct", correct);
            if (correct) {
                answered = true;
                answerGroups[questionIndex].querySelectorAll(".lr-cafe__answer").forEach((choice) => {
                    choice.disabled = true;
                });
                next.textContent = questionIndex === 2 ? "Finish Experience" : "Next Question";
                next.hidden = false;
            }
        });
    });

    next.addEventListener("click", () => {
        if (questionIndex === questions.length - 1) {
            feedback.textContent = "All three questions complete! Отлично! You can replay or reset anytime.";
            next.hidden = true;
            return;
        }
        questionIndex += 1;
        showQuestion();
    });

    document.getElementById("lr-station-listen").addEventListener("click", () => playLines(lines));
    document.getElementById("lr-station-replay-passenger").addEventListener("click", () => {
        playLines(lines.filter((line) => line.speaker === "passenger"));
    });
    document.getElementById("lr-station-replay-attendant").addEventListener("click", () => {
        playLines(lines.filter((line) => line.speaker === "attendant"));
    });

    reveal.addEventListener("click", () => {
        transcript.hidden = !transcript.hidden;
        reveal.textContent = transcript.hidden ? "Reveal the Text" : "Hide the Text";
        reveal.setAttribute("aria-expanded", String(!transcript.hidden));
    });

    root.querySelectorAll(".lr-cafe__word").forEach((button) => {
        button.addEventListener("click", () => {
            meaning.textContent = `${button.textContent.trim()}: ${button.dataset.meaning}`;
        });
    });

    document.getElementById("lr-station-reset").addEventListener("click", () => {
        stopPlayback();
        questionIndex = 0;
        showQuestion();
        transcript.hidden = true;
        reveal.textContent = "Reveal the Text";
        reveal.setAttribute("aria-expanded", "false");
        meaning.textContent = "Select an underlined Russian word for its meaning.";
        status.textContent = "Listen to the whole conversation first.";
    });

    document.querySelectorAll(".encounter-nav-button").forEach((button) => {
        button.addEventListener("click", stopPlayback);
    });

    showQuestion();
})();


// ============================================================
// LISTENING ROOM — EXPERIENCES 11–15: CONVERSATION ENGINE
// All answer choices and vocabulary hotspots are authored in HTML.
// ============================================================
initializeNumbersConversation("market", [
    {
        "speaker": 0,
        "text": "Здравствуйте! Сколько стоят два яблока?"
    },
    {
        "speaker": 1,
        "text": "Два яблока стоят восемьдесят рублей."
    },
    {
        "speaker": 0,
        "text": "А три груши?"
    },
    {
        "speaker": 1,
        "text": "Три груши стоят сто двадцать рублей."
    },
    {
        "speaker": 0,
        "text": "Сколько всего?"
    },
    {
        "speaker": 1,
        "text": "Всего двести рублей."
    }
], [
    {
        "question": "How many apples does the customer want?",
        "correct": "2"
    },
    {
        "question": "How much do three pears cost?",
        "correct": "120 ₽"
    },
    {
        "question": "What is the total price?",
        "correct": "200 ₽"
    }
]);

initializeNumbersConversation("pharmacy", [
    {
        "speaker": 0,
        "text": "Здравствуйте! Сколько стоит эта упаковка?"
    },
    {
        "speaker": 1,
        "text": "Сто восемьдесят рублей."
    },
    {
        "speaker": 0,
        "text": "Сколько таблеток в упаковке?"
    },
    {
        "speaker": 1,
        "text": "Десять таблеток."
    },
    {
        "speaker": 0,
        "text": "Мне нужны две упаковки."
    },
    {
        "speaker": 1,
        "text": "Тогда триста шестьдесят рублей."
    }
], [
    {
        "question": "How much is one package?",
        "correct": "180 ₽"
    },
    {
        "question": "How many tablets are in one package?",
        "correct": "10"
    },
    {
        "question": "How much do two packages cost?",
        "correct": "360 ₽"
    }
]);

initializeNumbersConversation("bus", [
    {
        "speaker": 0,
        "text": "Здравствуйте! Это автобус номер двадцать четыре?"
    },
    {
        "speaker": 1,
        "text": "Да, номер двадцать четыре."
    },
    {
        "speaker": 0,
        "text": "Во сколько мы приедем?"
    },
    {
        "speaker": 1,
        "text": "В девять сорок."
    },
    {
        "speaker": 0,
        "text": "Сколько стоит билет?"
    },
    {
        "speaker": 1,
        "text": "Пятьдесят рублей."
    }
], [
    {
        "question": "Which bus route is this?",
        "correct": "24"
    },
    {
        "question": "What time will they arrive?",
        "correct": "9:40"
    },
    {
        "question": "How much is the fare?",
        "correct": "50 ₽"
    }
]);

initializeNumbersConversation("tools", [
    {
        "speaker": 0,
        "text": "Здравствуйте! Где молоток?"
    },
    {
        "speaker": 1,
        "text": "Проход семь, секция двенадцать."
    },
    {
        "speaker": 0,
        "text": "А где отвёртки?"
    },
    {
        "speaker": 1,
        "text": "Проход восемь, секция пять."
    },
    {
        "speaker": 0,
        "text": "Спасибо!"
    }
], [
    {
        "question": "Which aisle has the hammer?",
        "correct": "7"
    },
    {
        "question": "Which section has the hammer?",
        "correct": "12"
    },
    {
        "question": "Where are the screwdrivers?",
        "correct": "Aisle 8, section 5"
    }
]);

initializeNumbersConversation("airport", [
    {
        "speaker": 0,
        "text": "Здравствуйте! Какой номер рейса?"
    },
    {
        "speaker": 1,
        "text": "Рейс двести сорок шесть."
    },
    {
        "speaker": 0,
        "text": "Какой выход?"
    },
    {
        "speaker": 1,
        "text": "Выход двенадцать."
    },
    {
        "speaker": 0,
        "text": "Во сколько посадка?"
    },
    {
        "speaker": 1,
        "text": "В шестнадцать двадцать."
    },
    {
        "speaker": 0,
        "text": "Спасибо!"
    }
], [
    {
        "question": "What is the flight number?",
        "correct": "246"
    },
    {
        "question": "Which departure gate?",
        "correct": "12"
    },
    {
        "question": "What time does boarding begin?",
        "correct": "16:20"
    }
]);

function initializeNumbersConversation(slug, lines, questions) {
    const id = `lr-${slug}`;
    const root = document.getElementById(id);
    if (!root) {
        return;
    }

    const speech = window.speechSynthesis;
    const status = document.getElementById(`${id}-status`);
    const step = document.getElementById(`${id}-step`);
    const question = document.getElementById(`${id}-question`);
    const feedback = document.getElementById(`${id}-feedback`);
    const next = document.getElementById(`${id}-next`);
    const reveal = document.getElementById(`${id}-reveal`);
    const transcript = document.getElementById(`${id}-transcript`);
    const meaning = document.getElementById(`${id}-meaning`);
    const speakers = [0, 1].map((index) => document.getElementById(`${id}-speaker-${index}`));
    const answerGroups = [1, 2, 3].map((number) => document.getElementById(`${id}-answers-${number}`));

    let questionIndex = 0;
    let playbackToken = 0;
    let answered = false;

    function clearSpeakers() {
        speakers.forEach((speaker) => speaker.classList.remove("lr-cafe__speaker--speaking"));
    }

    function stopPlayback() {
        playbackToken += 1;
        speech?.cancel();
        clearSpeakers();
    }

    function playLines(selectedLines) {
        stopPlayback();
        if (!speech || !window.SpeechSynthesisUtterance) {
            status.textContent = "Russian speech is not available in this browser.";
            return;
        }

        const token = playbackToken;
        let position = 0;
        status.textContent = "Listening to Russian conversation…";

        function playNext() {
            if (token !== playbackToken) {
                return;
            }
            if (position >= selectedLines.length) {
                clearSpeakers();
                status.textContent = "Finished listening. Choose an answer, or replay the conversation.";
                return;
            }

            const line = selectedLines[position];
            position += 1;
            const utterance = new SpeechSynthesisUtterance(line.text);
            utterance.lang = "ru-RU";
            utterance.rate = 0.85;
            const russianVoice = speech.getVoices().find((voice) => voice.lang.toLowerCase().startsWith("ru"));
            if (russianVoice) {
                utterance.voice = russianVoice;
            }

            utterance.onstart = () => {
                if (token !== playbackToken) {
                    return;
                }
                clearSpeakers();
                speakers[line.speaker].classList.add("lr-cafe__speaker--speaking");
            };
            utterance.onend = () => {
                if (token === playbackToken) {
                    playNext();
                }
            };
            utterance.onerror = () => {
                if (token === playbackToken) {
                    clearSpeakers();
                    status.textContent = "Speech was interrupted. Try listening again.";
                }
            };
            speech.speak(utterance);
        }

        playNext();
    }

    function showQuestion() {
        answered = false;
        step.textContent = `Question ${questionIndex + 1} of ${questions.length}`;
        question.textContent = questions[questionIndex].question;
        feedback.textContent = "";
        feedback.classList.remove("lr-cafe__feedback--correct");
        next.hidden = true;

        answerGroups.forEach((group, index) => {
            group.hidden = index !== questionIndex;
            group.querySelectorAll(".lr-cafe__answer").forEach((button) => {
                button.disabled = false;
                button.classList.remove("lr-cafe__answer--correct", "lr-cafe__answer--incorrect");
            });
        });
    }

    root.querySelectorAll(".lr-cafe__answer").forEach((button) => {
        button.addEventListener("click", () => {
            if (answered) {
                return;
            }
            const correct = button.dataset.conversationAnswer === questions[questionIndex].correct;
            button.classList.add(correct ? "lr-cafe__answer--correct" : "lr-cafe__answer--incorrect");
            feedback.textContent = correct
                ? "Correct! Отлично!"
                : "Not quite. Listen again and choose another answer.";
            feedback.classList.toggle("lr-cafe__feedback--correct", correct);

            if (correct) {
                answered = true;
                answerGroups[questionIndex].querySelectorAll(".lr-cafe__answer").forEach((choice) => {
                    choice.disabled = true;
                });
                next.textContent = questionIndex === questions.length - 1 ? "Finish Experience" : "Next Question";
                next.hidden = false;
            }
        });
    });

    next.addEventListener("click", () => {
        if (questionIndex === questions.length - 1) {
            feedback.textContent = "All three questions complete! Отлично! You can replay or reset anytime.";
            next.hidden = true;
            return;
        }
        questionIndex += 1;
        showQuestion();
    });

    document.getElementById(`${id}-listen`).addEventListener("click", () => playLines(lines));
    [0, 1].forEach((index) => {
        document.getElementById(`${id}-replay-${index}`).addEventListener("click", () => {
            playLines(lines.filter((line) => line.speaker === index));
        });
    });

    reveal.addEventListener("click", () => {
        transcript.hidden = !transcript.hidden;
        reveal.textContent = transcript.hidden ? "Reveal the Text" : "Hide the Text";
        reveal.setAttribute("aria-expanded", String(!transcript.hidden));
    });

    root.querySelectorAll(".lr-cafe__word").forEach((button) => {
        button.addEventListener("click", () => {
            meaning.textContent = `${button.textContent.trim()}: ${button.dataset.meaning}`;
        });
    });

    document.getElementById(`${id}-reset`).addEventListener("click", () => {
        stopPlayback();
        questionIndex = 0;
        showQuestion();
        transcript.hidden = true;
        reveal.textContent = "Reveal the Text";
        reveal.setAttribute("aria-expanded", "false");
        meaning.textContent = "Select an underlined Russian word for its meaning.";
        status.textContent = "Listen to the whole conversation first.";
    });

    document.querySelectorAll(".encounter-nav-button").forEach((button) => {
        button.addEventListener("click", stopPlayback);
    });

    showQuestion();
}

// PLANETARY EXPLORATION — HTML-authored waypoints and navigation
(() => {
    const words = [
        {
                "ordinal": "пе́рвый",
                "cardinal": "оди́н",
                "english": "first",
                "phonetic": "PYER-vy",
                "note": "A new word: first is not formed from один."
        },
        {
                "ordinal": "второ́й",
                "cardinal": "два",
                "english": "second",
                "phonetic": "fta-ROY",
                "note": "Second has a different stem from два."
        },
        {
                "ordinal": "тре́тий",
                "cardinal": "три",
                "english": "third",
                "phonetic": "TRYE-tee",
                "note": "Third has the distinctive ending -ий."
        },
        {
                "ordinal": "четвёртый",
                "cardinal": "четы́ре",
                "english": "fourth",
                "phonetic": "che-TVYOR-ty",
                "note": "Notice ё: it carries the stress."
        },
        {
                "ordinal": "пя́тый",
                "cardinal": "пять",
                "english": "fifth",
                "phonetic": "PYA-ty",
                "note": "The final soft sign in пять disappears."
        },
        {
                "ordinal": "шесто́й",
                "cardinal": "шесть",
                "english": "sixth",
                "phonetic": "shes-TOY",
                "note": "Compare шесть with шесто́й: stress moves to the ending."
        },
        {
                "ordinal": "седьмо́й",
                "cardinal": "семь",
                "english": "seventh",
                "phonetic": "seed-MOY",
                "note": "Notice the spelling седь- and the stressed ending -ой."
        },
        {
                "ordinal": "восьмо́й",
                "cardinal": "во́семь",
                "english": "eighth",
                "phonetic": "vas-MOY",
                "note": "Compare во́семь with восьмо́й: the stem and stress change."
        },
        {
                "ordinal": "девя́тый",
                "cardinal": "де́вять",
                "english": "ninth",
                "phonetic": "dye-VYA-ty",
                "note": "Notice the stress on я."
        },
        {
                "ordinal": "деся́тый",
                "cardinal": "де́сять",
                "english": "tenth",
                "phonetic": "dye-SYA-ty",
                "note": "Notice the stress on я, unlike де́сять."
        }
];
    const root = document.getElementById("numbers-rover-landing");
    const door = document.getElementById("numbers-door-one-landing");
    const hub = document.getElementById("numbers-four-doors");
    const get = (id) => document.getElementById(id);
    const beacons = Array.from(root.querySelectorAll("[data-rover-waypoint]"));
    const visited = new Set();
    let selected = 0;
    let round = [];
    let step = 0;
    let mode = "discover";
    let answered = false;

    function speak(word) {
        if (!window.speechSynthesis || !window.SpeechSynthesisUtterance) {
            get("rover-insight").textContent = "Russian audio is unavailable in this browser.";
            return;
        }
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(word.replace(/\u0301/g, ""));
        utterance.lang = "ru-RU";
        utterance.rate = 0.85;
        const voice = speechSynthesis.getVoices().find((item) => item.lang.toLowerCase().startsWith("ru"));
        if (voice) {
            utterance.voice = voice;
        }
        speechSynthesis.speak(utterance);
    }

    function briefing(heading, status, instruction, insight) {
        get("rover-heading").textContent = heading;
        get("rover-status").textContent = status;
        get("rover-instruction").textContent = instruction;
        get("rover-insight").textContent = insight;
    }

    function showExamples(index) {
        get("rover-examples").hidden = index === null;
        root.querySelectorAll("[data-rover-examples]").forEach((group) => {
            group.hidden = Number(group.dataset.roverExamples) !== index;
        });
    }

    function discover(index) {
        selected = index;
        showExamples(index);
        const word = words[index];
        visited.add(index);
        beacons.forEach((button, i) => {
            button.classList.toggle("is-visited", visited.has(i));
            button.setAttribute("aria-pressed", String(i === index));
        });
        get("rover-cardinal").disabled = false;
        get("rover-ordinal").disabled = false;
        get("rover-cardinal").textContent = word.cardinal;
        get("rover-ordinal").textContent = word.ordinal;
        get("rover-pronunciation").textContent = `${word.english} · ${word.phonetic}`;
        get("rover-discovery").firstElementChild.textContent = "How many? → Which position?";
        get("rover-progress").textContent = `Waypoints discovered: ${visited.size} / 10`;
        get("rover-start").disabled = visited.size !== 10;
        briefing("Language Discovery", `WAYPOINT ${String(index + 1).padStart(2, "0")}`, `This beacon is ${word.english} in our route. Listen and repeat. Select either Russian word to hear it.`, word.note);
        speak(word.ordinal);
    }

    function question() {
        showExamples(null);
        answered = false;
        get("rover-next").hidden = true;
        get("rover-listen").disabled = false;
        get("rover-question").textContent = `Signal ${step + 1} of 5`;
        beacons.forEach((button) => button.setAttribute("aria-pressed", "false"));
        briefing("Mission Instructions", "LISTENING CHECK", "Listen to the Russian ordinal and select its numbered flag.", "Replay the signal as often as needed.");
    }

    function reset() {
        showExamples(null);
        mode = "discover";
        visited.clear();
        get("rover-discovery").hidden = false;
        get("rover-quiz").hidden = true;
        get("rover-start").hidden = false;
        get("rover-start").disabled = true;
        get("rover-cardinal").disabled = true;
        get("rover-ordinal").disabled = true;
        get("rover-cardinal").textContent = "—";
        get("rover-ordinal").textContent = "—";
        get("rover-pronunciation").textContent = "";
        get("rover-discovery").firstElementChild.textContent = "Select your first waypoint.";
        get("rover-progress").textContent = "Waypoints discovered: 0 / 10";
        beacons.forEach((button) => {
            button.classList.remove("is-visited");
            button.setAttribute("aria-pressed", "false");
        });
        briefing("Mission Briefing", "BASE CAMP // DISCOVERY", "Cardinal numbers tell us how many. Ordinal numbers tell us position or order. Select a waypoint to discover its Russian ordinal.", "Listen to each word and repeat it aloud. Explore all ten beacons before your listening mission.");
    }

    beacons.forEach((button) => {
        button.addEventListener("click", () => {
            const index = Number(button.dataset.roverWaypoint);
            if (mode === "discover") {
                discover(index);
            } else if (mode === "complete") {
                showExamples(index);
                beacons.forEach((beacon, i) => {
                    beacon.setAttribute("aria-pressed", String(i === index));
                });
                speak(words[index].ordinal);
            } else if (mode === "quiz" && !answered) {
                if (index === round[step]) {
                    answered = true;
                    button.setAttribute("aria-pressed", "true");
                    briefing("Mission Feedback", "SIGNAL CONFIRMED", "Correct! Отлично!", `${words[index].ordinal} means ${words[index].english}.`);
                    get("rover-next").textContent = step === 4 ? "Finish Mission" : "Next Signal";
                    get("rover-next").hidden = false;
                } else {
                    get("rover-insight").textContent = "Not quite. Replay the signal and try another flag.";
                }
            }
        });
    });
    get("rover-cardinal").addEventListener("click", () => speak(words[selected].cardinal));
    get("rover-ordinal").addEventListener("click", () => speak(words[selected].ordinal));
    get("rover-start").addEventListener("click", () => {
        round = Array.from({ length: 10 }, (_, i) => i);
        for (let i = round.length - 1; i > 0; i--) {
            const k = Math.floor(Math.random() * (i + 1));
            [round[i], round[k]] = [round[k], round[i]];
        }
        round = round.slice(0, 5);
        step = 0;
        mode = "quiz";
        get("rover-start").hidden = true;
        get("rover-discovery").hidden = true;
        get("rover-quiz").hidden = false;
        question();
    });
    get("rover-listen").addEventListener("click", () => speak(words[round[step]].ordinal));
    get("rover-next").addEventListener("click", () => {
        if (step === 4) {
            mode = "complete";
            showExamples(round[step]);
            get("rover-next").hidden = true;
            get("rover-listen").disabled = true;
            get("rover-question").textContent = "Mission accomplished — 5 of 5 signals confirmed!";
            briefing("Mission Accomplished", "EXPLORATION COMPLETE", "You discovered ten ordinals and identified five Russian signals.", "Explore a bonus hatch or reset the mission to practice again.");
        } else {
            step++;
            question();
        }
    });
    get("rover-reset").addEventListener("click", reset);
    // Bonus Hatch 2 — all question and answer controls are authored in HTML.
    const trap = get("rover-hatch-two");
    const trapState = {};
    const trapBriefs = [
        ["Under the Microscope", "COMPARE THE SIGNALS", "Select the Russian words to hear the cardinal and ordinal forms.", "Gold letters draw attention to spelling changes. Notice how the stem and stress can change."],
        ["Stress Detective", "LISTEN AND IDENTIFY", "Listen to the ordinal, then select its stressed vowel.", "Replay the audio as often as needed. The letter ё always carries stress in these words."],
        ["Repair the Signal", "SPELLING CHALLENGE", "Choose the correctly spelled Russian ordinal for the English clue.", "Pay attention to stems, soft signs and endings. Incorrect choices can be retried."]
    ];

    function trapReset(mode) {
        const order = Array.from({ length: 10 }, (_, index) => index);
        for (let index = order.length - 1; index > 0; index--) {
            const other = Math.floor(Math.random() * (index + 1));
            [order[index], order[other]] = [order[other], order[index]];
        }
        trapState[mode] = { order, step: 0, answered: false };
        trapQuestion(mode);
    }

    function trapQuestion(mode) {
        const state = trapState[mode];
        state.answered = false;
        trap.querySelectorAll(`[data-trap-question^="${mode}-"]`).forEach((question) => {
            question.hidden = question.dataset.trapQuestion !== `${mode}-${state.order[state.step]}`;
            question.querySelectorAll("[data-trap-answer]").forEach((button) => {
                button.disabled = false;
                button.removeAttribute("aria-pressed");
            });
        });
        get(`trap-progress-${mode}`).textContent = `Signal ${state.step + 1} / 10`;
        get(`trap-feedback-${mode}`).textContent = "";
        trap.querySelector(`[data-trap-next="${mode}"]`).hidden = true;
    }

    function trapTab(mode) {
        trap.querySelectorAll("[data-trap-tab]").forEach((button) => {
            button.setAttribute("aria-pressed", String(Number(button.dataset.trapTab) === mode));
        });
        trap.querySelectorAll("[data-trap-panel]").forEach((panel) => {
            panel.hidden = Number(panel.dataset.trapPanel) !== mode;
        });
        briefing(...trapBriefs[mode]);
        if (mode && !trapState[mode]) {
            trapReset(mode);
        }
    }

    trap.querySelectorAll("[data-trap-tab]").forEach((button) => {
        button.addEventListener("click", () => trapTab(Number(button.dataset.trapTab)));
    });
    trap.querySelectorAll("[data-trap-answer]").forEach((button) => {
        button.addEventListener("click", () => {
            const mode = Number(button.closest("[data-trap-panel]").dataset.trapPanel);
            const state = trapState[mode];
            if (state.answered) {
                return;
            }
            const word = words[state.order[state.step]];
            const feedback = get(`trap-feedback-${mode}`);
            if (button.dataset.trapAnswer === "true") {
                state.answered = true;
                button.setAttribute("aria-pressed", "true");
                feedback.textContent = `Correct! ${word.ordinal}`;
                get("rover-insight").textContent = word.note;
                speak(word.ordinal);
                const next = trap.querySelector(`[data-trap-next="${mode}"]`);
                next.textContent = state.step === 9 ? "Finish Challenge" : "Next Signal";
                next.hidden = false;
            } else {
                feedback.textContent = mode === 1 ? "Not quite. Listen again and try another vowel." : "Signal corrupted. Check the spelling and try again.";
            }
        });
    });
    trap.querySelectorAll("[data-trap-next]").forEach((button) => {
        button.addEventListener("click", () => {
            const mode = Number(button.dataset.trapNext);
            const state = trapState[mode];
            if (state.step === 9) {
                trap.querySelectorAll(`[data-trap-question^="${mode}-"]`).forEach((question) => {
                    question.hidden = true;
                });
                get(`trap-feedback-${mode}`).textContent = "Mission accomplished! All ten signals confirmed.";
                button.hidden = true;
                briefing("Mission Accomplished", "10 / 10 SIGNALS CONFIRMED", "Excellent work! You completed the challenge.", "Replay the challenge or explore another experience.");
            } else {
                state.step++;
                trapQuestion(mode);
                briefing(...trapBriefs[mode]);
            }
        });
    });
    trap.querySelectorAll("[data-trap-reset]").forEach((button) => {
        button.addEventListener("click", () => {
            const mode = Number(button.dataset.trapReset);
            trapReset(mode);
            briefing(...trapBriefs[mode]);
        });
    });
    // BONUS HATCH 1 — adjective agreement discovery.
    const secret = get("rover-hatch-one");
    const secretForms = [
        ["пе́рв", "ый", "ая", "ое", "ые"],
        ["втор", "о́й", "а́я", "о́е", "ы́е"],
        ["тре́т", "ий", "ья", "ье", "ьи"],
        ["четвёрт", "ый", "ая", "ое", "ые"],
        ["пя́т", "ый", "ая", "ое", "ые"],
        ["шест", "о́й", "а́я", "о́е", "ы́е"],
        ["седьм", "о́й", "а́я", "о́е", "ы́е"],
        ["восьм", "о́й", "а́я", "о́е", "ы́е"],
        ["девя́т", "ый", "ая", "ое", "ые"],
        ["деся́т", "ый", "ая", "ое", "ые"]
    ];
    const secretNouns = [
        [["автомоби́ль", "car"], ["кни́га", "book"], ["ме́сто", "place"], ["кни́ги", "books"]],
        [["дом", "house"], ["ко́мната", "room"], ["окно́", "window"], ["ко́мнаты", "rooms"]],
        [["уро́к", "lesson"], ["неде́ля", "week"], ["зада́ние", "assignment"], ["зада́ния", "assignments"]]
    ];
    const secretGenders = ["masculine", "feminine", "neuter", "plural"];
    let secretNumber = 0;
    let secretGender = 0;
    let secretMode = 0;
    let secretRound = [];
    let secretStep = 0;
    let secretSolved = false;

    function secretNoun(number, gender) {
        return secretNouns[number < 3 ? 0 : number < 6 ? 1 : 2][gender];
    }

    function secretWord(number, gender) {
        return secretForms[number][0] + secretForms[number][gender + 1];
    }

    function secretRender() {
        const form = secretForms[secretNumber];
        secret.querySelectorAll("[data-secret-number]").forEach((button) => {
            button.setAttribute("aria-pressed", String(Number(button.dataset.secretNumber) === secretNumber));
        });
        secret.querySelectorAll("[data-secret-form]").forEach((button) => {
            const gender = Number(button.dataset.secretForm);
            button.children[0].textContent = form[0];
            button.children[1].textContent = form[gender + 1];
        });
        secret.querySelectorAll("[data-secret-example]").forEach((button) => {
            const gender = Number(button.dataset.secretExample);
            button.children[0].textContent = form[0];
            button.children[1].textContent = form[gender + 1];
            button.children[2].textContent = " " + secretNoun(secretNumber, gender)[0];
        });
        secret.querySelectorAll("[data-secret-noun]").forEach((button) => {
            const gender = Number(button.dataset.secretNoun);
            const noun = secretNoun(secretNumber, gender);
            button.textContent = noun.join(" — ");
            button.setAttribute("aria-pressed", String(gender === secretGender));
        });
        const phrase = get("secret-phrase");
        phrase.children[0].textContent = form[0];
        phrase.children[1].textContent = form[secretGender + 1];
        phrase.children[2].textContent = " " + secretNoun(secretNumber, secretGender)[0];
        get("secret-translation").textContent = words[secretNumber].english + " " + secretNoun(secretNumber, secretGender)[1];
        if (secretMode === 1) {
            get("rover-insight").textContent = `The noun is ${secretGenders[secretGender]}. The ordinal takes the ending -${form[secretGender + 1]} to agree with it.`;
        }
    }

    function secretQuestion() {
        const { number, gender } = secretRound[secretStep];
        secretSolved = false;
        get("secret-progress").textContent = `Challenge ${secretStep + 1} of 10`;
        get("secret-prompt").textContent = "? " + secretNoun(number, gender)[0];
        get("secret-english").textContent = words[number].english + " " + secretNoun(number, gender)[1];
        get("secret-feedback").textContent = "";
        get("secret-next").hidden = true;
        const choices = [0, 1, 2, 3];
        for (let i = 3; i > 0; i--) {
            const k = Math.floor(Math.random() * (i + 1));
            [choices[i], choices[k]] = [choices[k], choices[i]];
        }
        secret.querySelectorAll("[data-secret-answer]").forEach((button, i) => {
            button.dataset.gender = choices[i];
            button.textContent = secretWord(number, choices[i]);
            button.disabled = false;
            button.setAttribute("aria-pressed", "false");
        });
    }

    function secretReset() {
        secretRound = secretForms.map((form, number) => ({ number, gender: number % 4 }));
        for (let i = 9; i > 0; i--) {
            const k = Math.floor(Math.random() * (i + 1));
            [secretRound[i], secretRound[k]] = [secretRound[k], secretRound[i]];
        }
        secretStep = 0;
        secretQuestion();
    }

    function secretTab(tab) {
        secretMode = tab;
        secret.querySelectorAll("[data-secret-tab]").forEach((button) => {
            button.setAttribute("aria-pressed", String(Number(button.dataset.secretTab) === tab));
        });
        secret.querySelectorAll("[data-secret-panel]").forEach((panel) => {
            panel.hidden = Number(panel.dataset.secretPanel) !== tab;
        });
        get("secret-picker").hidden = tab === 2;
        const briefs = [
            ["Discover the Secret", "LANGUAGE DISCOVERY", "Choose an ordinal and listen to its four forms. Compare the gold endings.", "Russian ordinals behave like adjectives. They agree with nouns in gender and number."],
            ["The Perfect Partnership", "WATCH THE TRANSFORMATION", "Choose an ordinal, then select a familiar noun. Listen to the resulting phrase.", ""],
            ["Find the Perfect Match", "AGREEMENT CHALLENGE", "Choose the correct ordinal for the noun. Complete ten challenges.", "Look at the noun and decide which form agrees with it."]
        ];
        briefing(...briefs[tab]);
        secretRender();
        if (tab === 2 && !secretRound.length) {
            secretReset();
        }
    }

    secret.querySelectorAll("[data-secret-tab]").forEach((button) => {
        button.addEventListener("click", () => secretTab(Number(button.dataset.secretTab)));
    });
    secret.querySelectorAll("[data-secret-number]").forEach((button) => {
        button.addEventListener("click", () => {
            secretNumber = Number(button.dataset.secretNumber);
            secretRender();
        });
    });
    secret.querySelectorAll("[data-secret-form], [data-secret-example]").forEach((button) => {
        button.addEventListener("click", () => speak(button.textContent.trim()));
    });
    secret.querySelectorAll("[data-secret-noun]").forEach((button) => {
        button.addEventListener("click", () => {
            secretGender = Number(button.dataset.secretNoun);
            secretRender();
            speak(get("secret-phrase").textContent.trim());
        });
    });
    get("secret-phrase").addEventListener("click", () => speak(get("secret-phrase").textContent.trim()));
    secret.querySelectorAll("[data-secret-answer]").forEach((button) => {
        button.addEventListener("click", () => {
            if (secretSolved) {
                return;
            }
            const { number, gender } = secretRound[secretStep];
            if (Number(button.dataset.gender) !== gender) {
                get("secret-feedback").textContent = `Try again. The noun is ${secretGenders[gender]}.`;
                return;
            }
            secretSolved = true;
            button.setAttribute("aria-pressed", "true");
            const phrase = secretWord(number, gender) + " " + secretNoun(number, gender)[0];
            get("secret-feedback").textContent = "Correct! " + phrase;
            get("rover-insight").textContent = `Both forms agree: ${secretGenders[gender]}.`;
            speak(phrase);
            get("secret-next").textContent = secretStep === 9 ? "Finish Challenge" : "Next Challenge";
            get("secret-next").hidden = false;
        });
    });
    get("secret-next").addEventListener("click", () => {
        if (secretStep === 9) {
            get("secret-progress").textContent = "10 / 10 complete";
            get("secret-feedback").textContent = "Mission accomplished!";
            get("secret-next").hidden = true;
            briefing("Mission Accomplished", "10 / 10 COMPLETE", "You matched all ten ordinals correctly.", "Explore the full agreement system at the Energy Core.");
        } else {
            secretStep++;
            secretQuestion();
        }
    });
    get("secret-reset").addEventListener("click", () => {
        secretReset();
        secretTab(2);
    });
    let savedBriefing = null;
    root.querySelectorAll("[data-rover-hatch]").forEach((button) => {
        button.addEventListener("click", () => {
            const target = button.dataset.roverHatch;
            if (!get("rover-main").hidden) {
                savedBriefing = ["rover-heading", "rover-status", "rover-instruction", "rover-insight"].map((id) => get(id).textContent);
            }
            get("rover-main").hidden = target !== "main";
            get("rover-hatch-one").hidden = target !== "one";
            get("rover-hatch-two").hidden = target !== "two";
            if (target === "main" && savedBriefing) {
                briefing(...savedBriefing);
            } else if (target === "one") {
                secretTab(0);
            } else if (target === "two") {
                trapTab(0);
            } else if (target !== "main") {
                briefing("Bonus Exploration", "OPTIONAL DISCOVERY", "Investigate the language clues in this hatch.", "Select a Russian word to hear it, then return to your mission.");
            }
        });
    });
    root.querySelectorAll("[data-rover-say]").forEach((button) => {
        button.addEventListener("click", () => speak(button.dataset.roverSay));
    });
    door.querySelector(".numbers-rover-open").addEventListener("click", () => {
        door.hidden = true;
        root.hidden = false;
        root.scrollIntoView({ block: "start" });
    });
    root.querySelectorAll("[data-rover-back]").forEach((button) => {
        button.addEventListener("click", () => {
            window.speechSynthesis?.cancel();
            root.hidden = true;
            const destination = button.dataset.roverBack === "door" ? door : hub;
            destination.hidden = false;
            destination.scrollIntoView({ block: "start" });
        });
    });
})();

// Ultimate Rover Challenge — all interactive controls are authored in HTML.
(() => {
    const get = (id) => document.getElementById(id);
    const root = get("ultimate-rover");
    const rover = get("numbers-rover-landing");
    const words = ["пе́рвый", "второ́й", "тре́тий", "четвёртый", "пя́тый", "шесто́й", "седьмо́й", "восьмо́й", "девя́тый", "деся́тый"];
    const english = ["First", "Second", "Third", "Fourth", "Fifth", "Sixth", "Seventh", "Eighth", "Ninth", "Tenth"];
    const titles = ["Recall the Signal", "Reconstruct the Signal", "Decode the Signal"];
    const instructions = ["Click Speak It and say the Russian ordinal aloud.", "Type the Russian ordinal from memory.", "Listen to the Russian ordinal and type what you hear."];
    let phase = 0;
    let step = 0;
    let order = [];
    let scores = [0, 0, 0];
    let locked = false;
    const input = get("ultimate-answer");

    function normalize(word) {
        return word.toLowerCase().normalize("NFC").replace(/\u0301/g, "").trim();
    }

    function speak() {
        if (!window.speechSynthesis || !window.SpeechSynthesisUtterance) {
            get("ultimate-feedback").textContent = "Russian audio is unavailable in this browser.";
            return;
        }
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(normalize(words[order[step]]));
        utterance.lang = "ru-RU";
        utterance.rate = 0.85;
        const voice = window.speechSynthesis.getVoices().find((item) => item.lang.toLowerCase().startsWith("ru"));
        if (voice) {
            utterance.voice = voice;
        }
        window.speechSynthesis.speak(utterance);
    }

    function shuffle() {
        order = Array.from({ length: 10 }, (_, index) => index);
        for (let index = 9; index > 0; index -= 1) {
            const other = Math.floor(Math.random() * (index + 1));
            [order[index], order[other]] = [order[other], order[index]];
        }
    }

    function showQuestion() {
        locked = false;
        input.value = "";
        input.disabled = false;
        get("ultimate-check").disabled = false;
        get("ultimate-title").textContent = titles[phase];
        get("ultimate-progress").textContent = `Challenge ${phase + 1} of 3 · Signal ${step + 1} of 10`;
        get("ultimate-instruction").textContent = instructions[phase];
        get("ultimate-prompt").textContent = phase === 2 ? "Incoming Russian signal" : english[order[step]];
        get("ultimate-writing").hidden = phase === 0;
        get("ultimate-listen").hidden = phase !== 2;
        stopRecognition();
        get("ultimate-speech").hidden = phase !== 0;
        get("ultimate-speak").disabled = false;
        get("ultimate-heard").textContent = "I heard: —";
        get("ultimate-next").hidden = true;
        get("ultimate-feedback").textContent = "";
    }

    function start() {
        phase = 0;
        step = 0;
        scores = [0, 0, 0];
        get("ultimate-center").querySelectorAll("button, input").forEach((button) => {
            button.disabled = false;
        });
        resetSequence();
        resetAgreement();
        selectInput(agreementInput);
        shuffle();
        get("ultimate-brief").hidden = true;
        get("ultimate-results").hidden = true;
        get("ultimate-task").hidden = false;
        showQuestion();
    }

    function finishAnswer(correct) {
        if (locked) {
            return;
        }
        locked = true;
        scores[phase] += Number(correct);
        input.disabled = true;
        get("ultimate-check").disabled = true;
        get("ultimate-speak").disabled = true;
        get("ultimate-feedback").textContent = `${correct ? "Correct!" : "Keep practicing."} ${words[order[step]]}`;
        get("ultimate-next").hidden = false;
        get("ultimate-next").textContent = step === 9 ? (phase === 2 ? "View Results" : "Next Challenge") : "Next Signal";
    }

    get("ultimate-open").addEventListener("click", () => {
        window.speechSynthesis?.cancel();
        rover.hidden = true;
        root.hidden = false;
        get("ultimate-brief").hidden = false;
        get("ultimate-task").hidden = true;
        get("ultimate-results").hidden = true;
        root.scrollIntoView({ block: "start" });
    });
    get("ultimate-back").addEventListener("click", () => {
        stopRecognition();
        window.speechSynthesis?.cancel();
        root.hidden = true;
        rover.hidden = false;
        rover.scrollIntoView({ block: "start" });
    });
    get("ultimate-accept").addEventListener("click", start);
    get("ultimate-restart").addEventListener("click", start);
    get("ultimate-listen").addEventListener("click", speak);
    let recognition = null;

    function stopRecognition() {
        if (recognition) {
            const previous = recognition;
            recognition = null;
            previous.abort();
        }
    }

    get("ultimate-speak").addEventListener("click", () => {
        if (locked || phase !== 0 || recognition) {
            return;
        }
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        const heard = get("ultimate-heard");
        const button = get("ultimate-speak");
        if (!SpeechRecognition) {
            heard.textContent = "Speech recognition is unavailable in this browser.";
            return;
        }
        window.speechSynthesis?.cancel();
        const session = new SpeechRecognition();
        recognition = session;
        session.lang = "ru-RU";
        session.interimResults = false;
        session.continuous = false;
        button.disabled = true;
        heard.textContent = "I heard: Listening…";
        get("ultimate-feedback").textContent = "";
        let received = false;
        session.onresult = (event) => {
            if (recognition !== session || locked || phase !== 0) {
                return;
            }
            received = true;
            const transcript = event.results[0][0].transcript;
            heard.textContent = `I heard: ${transcript}`;
            const speechForm = (value) => normalize(value).replace(/[.!?,…]/g, "").replace(/ё/g, "е").trim();
            if (speechForm(transcript) === speechForm(words[order[step]])) {
                finishAnswer(true);
            } else {
                get("ultimate-feedback").textContent = "Not quite. Click Speak It to try again.";
            }
        };
        session.onerror = (event) => {
            if (recognition !== session) {
                return;
            }
            received = true;
            heard.textContent = `Speech recognition unavailable (${event.error}). Please retry.`;
        };
        session.onend = () => {
            if (recognition !== session) {
                return;
            }
            recognition = null;
            button.disabled = locked;
            if (!received) {
                heard.textContent = "I heard: No speech detected. Try again.";
            }
        };
        try {
            session.start();
        } catch (error) {
            recognition = null;
            button.disabled = false;
            heard.textContent = "Could not start microphone. Please retry.";
        }
    });
    const agreementInput = get("agreement-answer");
    let activeInput = null;
    function selectInput(field) {
        activeInput = field;
        [input, agreementInput].forEach((item) => {
            item.classList.toggle("ultimate-active-input", item === field);
        });
        get("keyboard-target").textContent = field === input ? "Keyboard → Signal Operations" : "Keyboard → Agreement Challenge";
    }
    [input, agreementInput].forEach((field) => {
        field.addEventListener("focus", () => selectInput(field));
    });
    function editKey(key) {
        if (!activeInput || activeInput.disabled || activeInput.closest("[hidden]")) {
            return;
        }
        const field = activeInput;
        const start = field.selectionStart;
        const end = field.selectionEnd;
        if (key === "clear") {
            field.value = "";
        } else if (key === "delete") {
            field.setRangeText("", start === end ? Math.max(0, start - 1) : start, end, "end");
        } else {
            field.setRangeText(key, start, end, "end");
        }
        field.focus();
    }
    root.querySelectorAll("[data-ultimate-key]").forEach((button) => {
        button.addEventListener("click", () => editKey(button.dataset.ultimateKey));
    });
    get("ultimate-delete").addEventListener("click", () => editKey("delete"));
    get("ultimate-clear").addEventListener("click", () => editKey("clear"));
    get("ultimate-space").addEventListener("click", () => editKey(" "));
    const sequence = get("ultimate-sequence");
    const sequenceTiles = () => Array.from(sequence.querySelectorAll("button[data-sequence]"));
    function placeTiles(tiles) {
        Array.from(sequence.children).forEach((slot, index) => {
            slot.appendChild(tiles[index]);
        });
    }
    let selected = null;
    function swap(first, second) {
        if (first && second && first !== second) {
            const tiles = sequenceTiles();
            const a = tiles.indexOf(first);
            const b = tiles.indexOf(second);
            [tiles[a], tiles[b]] = [tiles[b], tiles[a]];
            placeTiles(tiles);
        }
        selected?.classList.remove("selected");
        selected = null;
        get("sequence-feedback").textContent = "";
    }
    sequenceTiles().forEach((tile) => {
        tile.addEventListener("dragstart", (event) => {
            event.dataTransfer.setData("text/plain", tile.dataset.sequence);
        });
        tile.addEventListener("dragover", (event) => event.preventDefault());
        tile.addEventListener("drop", (event) => {
            event.preventDefault();
            swap(sequenceTiles().find((item) => item.dataset.sequence === event.dataTransfer.getData("text/plain")), tile);
        });
        tile.addEventListener("click", () => {
            if (selected) {
                swap(selected, tile);
            } else {
                selected = tile;
                tile.classList.add("selected");
            }
        });
    });
    function resetSequence() {
        const tiles = sequenceTiles();
        for (let i = tiles.length - 1; i > 0; i -= 1) {
            const k = Math.floor(Math.random() * (i + 1));
            [tiles[i], tiles[k]] = [tiles[k], tiles[i]];
        }
        placeTiles(tiles);
        selected?.classList.remove("selected");
        selected = null;
        get("sequence-feedback").textContent = "";
    }
    get("sequence-reset").addEventListener("click", resetSequence);
    get("sequence-check").addEventListener("click", () => {
        const count = sequenceTiles().filter((tile, index) => Number(tile.dataset.sequence) === index).length;
        get("sequence-feedback").textContent = count === 10 ? "★ Sequence complete!" : `${count}/10 in position. Try again.`;
    });
    const agreement = [
        ["First car", "автомоби́ль", "пе́рвый"],
        ["Second book", "кни́га", "втора́я"],
        ["Third place", "ме́сто", "тре́тье"],
        ["Fourth room", "ко́мната", "четвёртая"],
        ["Fifth house", "дом", "пя́тый"],
        ["Sixth window", "окно́", "шесто́е"],
        ["Seventh lessons", "уро́ки", "седьмы́е"],
        ["Eighth week", "неде́ля", "восьма́я"],
        ["Ninth assignment", "зада́ние", "девя́тое"],
        ["Tenth assignments", "зада́ния", "деся́тые"]
    ];
    let agreementOrder = [];
    let agreementStep = 0;
    let agreementScore = 0;
    function showAgreement() {
        const item = agreementOrder[agreementStep];
        get("agreement-progress").textContent = `Signal ${agreementStep + 1}/10`;
        get("agreement-prompt").textContent = item[0];
        get("agreement-noun").textContent = item[1];
        agreementInput.value = "";
        agreementInput.disabled = false;
        get("agreement-check").disabled = false;
        get("agreement-next").hidden = true;
        get("agreement-feedback").textContent = "";
    }
    function resetAgreement() {
        agreementOrder = [...agreement];
        for (let i = 9; i > 0; i -= 1) {
            const k = Math.floor(Math.random() * (i + 1));
            [agreementOrder[i], agreementOrder[k]] = [agreementOrder[k], agreementOrder[i]];
        }
        agreementStep = 0;
        agreementScore = 0;
        showAgreement();
    }
    function checkAgreement() {
        if (agreementInput.disabled || !agreementInput.value.trim()) {
            return;
        }
        const answer = agreementOrder[agreementStep][2];
        const correct = normalize(agreementInput.value) === normalize(answer);
        agreementScore += Number(correct);
        get("agreement-feedback").textContent = `${correct ? "Correct!" : "Correct form:"} ${answer}`;
        agreementInput.disabled = true;
        get("agreement-check").disabled = true;
        get("agreement-next").hidden = false;
    }
    get("agreement-check").addEventListener("click", checkAgreement);
    agreementInput.addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
            event.preventDefault();
            checkAgreement();
        }
    });
    get("agreement-next").addEventListener("click", () => {
        agreementStep += 1;
        if (agreementStep === 10) {
            get("agreement-progress").textContent = `★ Complete: ${agreementScore}/10`;
            get("agreement-next").hidden = true;
        } else {
            showAgreement();
        }
    });
    function check() {
        if (!locked && input.value.trim()) {
            finishAnswer(normalize(input.value) === normalize(words[order[step]]));
        }
    }
    get("ultimate-check").addEventListener("click", check);
    input.addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
            event.preventDefault();
            check();
        }
    });
    get("ultimate-next").addEventListener("click", () => {
        window.speechSynthesis?.cancel();
        step += 1;
        if (step === 10) {
            phase += 1;
            step = 0;
            if (phase === 3) {
                get("ultimate-center").querySelectorAll("button, input").forEach((button) => { button.disabled = true; });
                get("ultimate-title").textContent = "Signal Operations Complete ★";
                get("ultimate-next").hidden = true;
                get("ultimate-feedback").textContent = `Speaking: ${scores[0]}/10 · Spelling: ${scores[1]}/10 · Listening: ${scores[2]}/10`;
                return;
            }
            shuffle();
        }
        showQuestion();
    });
})();

// DOOR TWO — integrated teaching and activation.
(() => {
    const get = (id) => document.getElementById(id);
    const door = get("numbers-door-two-landing");
    const lab = get("math-android-landing");
    const challenge = get("math-challenge-landing");
    const tasks = [
        { prompt: "Listen. Which equation did you hear?", audio: "семь плюс три равно десять", choices: ["7 − 3 = 4", "7 + 3 = 10", "3 + 4 = 7"], correct: 1, answer: "семь плюс три равно десять" },
        { prompt: "Listen. Identify the subtraction.", audio: "девять минус два будет семь", choices: ["9 − 2 = 7", "9 + 2 = 11", "7 − 2 = 5"], correct: 0, answer: "девять минус два будет семь" },
        { prompt: "Construct 4 + 2 = 6. Choose the Russian expression.", audio: "четыре плюс два равно шесть", choices: ["четыре минус два равно два", "два плюс три равно пять", "четыре плюс два равно шесть"], correct: 2, answer: "четыре плюс два равно шесть" },
        { prompt: "Listen to the question. Which question is it?", audio: "Сколько будет восемь минус три?", choices: ["How much is 8 + 3?", "How much is 8 − 3?", "How much is 3 + 5?"], correct: 1, answer: "Сколько будет восемь минус три?" },
        { prompt: "Listen, choose the Russian answer, then say it aloud.", audio: "Сколько будет шесть плюс два?", choices: ["Будет восемь.", "Будет четыре.", "Будет девять."], correct: 0, answer: "Будет восемь." }
    ];
    let step = 0;
    let locked = false;
    const choices = Array.from(lab.querySelectorAll("[data-math-choice]"));
    function show(destination) {
        window.speechSynthesis?.cancel();
        numbersDoorLandings.forEach((landing) => {
            landing.hidden = landing !== destination;
        });
        destination.scrollIntoView({ behavior: "smooth", block: "start" });
    }
    function speak(word) {
        if (!window.speechSynthesis || !window.SpeechSynthesisUtterance) {
            get("math-feedback").textContent = "Audio unavailable. Use Show Russian text.";
            return;
        }
        speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(word);
        utterance.lang = "ru-RU";
        utterance.rate = 0.85;
        const voice = speechSynthesis.getVoices().find((item) => item.lang.toLowerCase().startsWith("ru"));
        if (voice) {
            utterance.voice = voice;
        }
        speechSynthesis.speak(utterance);
    }
    function render() {
        locked = false;
        const task = tasks[step];
        get("math-task-count").textContent = `Activation task ${step + 1} of 5`;
        get("math-task-prompt").textContent = task.prompt;
        get("math-transcript").textContent = task.audio;
        get("math-transcript").hidden = true;
        get("math-feedback").textContent = "";
        get("math-next").hidden = true;
        choices.forEach((button, index) => {
            button.textContent = task.choices[index];
            button.disabled = false;
        });
    }
    function power(value) {
        get("math-portrait").dataset.power = value;
        get("math-power").value = value;
        get("math-power-label").textContent = `${value * 20}% · ${value === 5 ? "Fully online" : value === 0 ? "Offline" : "Activating"}`;
    }
    choices.forEach((button, index) => {
        button.addEventListener("click", () => {
            if (locked) {
                return;
            }
            const task = tasks[step];
            if (index !== task.correct) {
                get("math-feedback").textContent = "Try again. Listen for the operator and numbers.";
                return;
            }
            locked = true;
            power(step + 1);
            choices.forEach((choice) => { choice.disabled = true; });
            get("math-feedback").textContent = `Correct! ${task.answer} ${step === 4 ? "— Android fully activated!" : "— Repeat aloud."}`;
            speak(task.answer);
            get("math-next").hidden = step === 4;
        });
    });
    get("math-next").addEventListener("click", () => {
        step += 1;
        render();
    });
    get("math-reset").addEventListener("click", () => {
        step = 0;
        power(0);
        render();
    });
    get("math-listen").addEventListener("click", () => speak(tasks[step].audio));
    get("math-reveal").addEventListener("click", () => {
        get("math-transcript").hidden = !get("math-transcript").hidden;
    });
    lab.querySelectorAll("[data-math-say]").forEach((button) => {
        button.addEventListener("click", () => speak(button.dataset.mathSay));
    });
    get("math-android-open").addEventListener("click", () => show(lab));
    get("math-door-two").addEventListener("click", () => show(door));
    get("math-challenge-open").addEventListener("click", () => show(challenge));
    get("math-challenge-back").addEventListener("click", () => show(lab));
    render();
})();

// Door Two — full-body activation, independent of the head challenge.
(() => {
    const get = (id) => document.getElementById(id);
    const tasks = [
        ["Listen. Identify the equation.", "двенадцать плюс семь равно девятнадцать", ["12 + 7 = 19", "12 − 7 = 5", "12 + 6 = 18"], 0],
        ["Listen. Identify the equation.", "двадцать минус восемь равно двенадцать", ["20 + 8 = 28", "20 − 8 = 12", "20 − 9 = 11"], 1],
        ["Choose the Russian expression for 15 + 6 = 21.", "пятнадцать плюс шесть равно двадцать один", ["пятнадцать минус шесть равно девять", "пятнадцать плюс пять равно двадцать", "пятнадцать плюс шесть равно двадцать один"], 2],
        ["Listen and answer in Russian.", "Сколько будет тридцать минус семь?", ["Будет двадцать три.", "Будет двадцать семь.", "Будет тридцать семь."], 0],
        ["Listen. Which question did you hear?", "Сколько будет сорок плюс девять?", ["How much is 40 − 9?", "How much is 40 + 9?", "How much is 14 + 9?"], 1],
        ["Listen and answer in Russian.", "Сколько будет пятьдесят плюс двадцать?", ["Будет тридцать.", "Будет шестьдесят.", "Будет семьдесят."], 2],
        ["Choose the Russian expression for 80 − 30 = 50.", "восемьдесят минус тридцать равно пятьдесят", ["восемьдесят минус тридцать равно пятьдесят", "восемьдесят плюс тридцать равно сто десять", "восемьдесят минус двадцать равно шестьдесят"], 0],
        ["Listen. Identify the equation.", "сто плюс двадцать пять равно сто двадцать пять", ["100 − 25 = 75", "100 + 25 = 125", "100 + 15 = 115"], 1],
        ["Listen and answer in Russian.", "Сколько будет двести минус пятьдесят?", ["Будет двести пятьдесят.", "Будет сто пять.", "Будет сто пятьдесят."], 2],
        ["Final activation: listen, answer and repeat aloud.", "Сколько будет триста плюс двести?", ["Будет пятьсот.", "Будет сто.", "Будет шестьсот."], 0]
    ];
    const choices = Array.from(document.querySelectorAll("[data-full-choice]"));
    const lights = Array.from(document.querySelectorAll("[data-full-light]"));
    let step = 0;
    let locked = false;
    function speak(word) {
        if (!window.speechSynthesis || !window.SpeechSynthesisUtterance) {
            get("math-full-feedback").textContent = "Audio unavailable. Use Show Russian text.";
            return;
        }
        speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(word);
        utterance.lang = "ru-RU";
        utterance.rate = 0.85;
        const voice = speechSynthesis.getVoices().find((item) => item.lang.toLowerCase().startsWith("ru"));
        if (voice) {
            utterance.voice = voice;
        }
        speechSynthesis.speak(utterance);
    }
    const portrait = get("math-full-portrait");
    const turn = get("math-full-turn");
    const rewardTimers = [];
    let rewardRun = 0;
    function stopReward() {
        rewardRun += 1;
        rewardTimers.forEach(clearTimeout);
        rewardTimers.length = 0;
        portrait.classList.remove("is-surging", "is-turning", "is-final-pulse");
        turn.hidden = true;
        turn.removeAttribute("src");
    }
    function completionReward() {
        stopReward();
        const run = rewardRun;
        const later = (callback, delay) => {
            rewardTimers.push(setTimeout(() => {
                if (run === rewardRun && !get("math-full-core").hidden && !portrait.closest("[hidden]")) {
                    callback();
                }
            }, delay));
        };
        const finish = () => {
            portrait.classList.remove("is-turning", "is-surging");
            turn.hidden = true;
            portrait.classList.add("is-final-pulse");
            get("math-full-label").textContent = "100% · Fully operational";
            speak("Системы активированы. Я готов к работе!");
        };
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
            later(finish, 1400);
            return;
        }
        lights.forEach((light) => {
            const top = parseFloat(light.style.top);
            light.style.setProperty("--surge-delay", `${Math.round((65 - top) * 12)}ms`);
        });
        portrait.classList.add("is-surging");
        later(() => {
            portrait.classList.remove("is-surging");
            turn.onload = () => {
                if (run !== rewardRun || get("math-full-core").hidden || portrait.closest("[hidden]")) {
                    return;
                }
                turn.hidden = false;
                portrait.classList.add("is-turning");
                later(finish, 2240);
            };
            turn.onerror = finish;
            turn.src = "../../Images/numbers/door-2-android-turn.gif?run=" + run;
        }, 1500);
    }
    function power(value) {
        lights.forEach((light) => {
            light.classList.toggle("is-online", Number(light.dataset.fullLight) <= value);
        });
        get("math-full-power").value = value;
        get("math-full-label").textContent = `${value * 10}% · ${value === 10 ? "Fully online" : value === 0 ? "Offline" : "Activating"}`;
    }
    function render() {
        locked = false;
        const task = tasks[step];
        get("math-full-count").textContent = `Activation task ${step + 1} of 10`;
        get("math-full-prompt").textContent = task[0];
        get("math-full-transcript").textContent = task[1];
        get("math-full-transcript").hidden = true;
        get("math-full-feedback").textContent = "";
        get("math-full-next").hidden = true;
        choices.forEach((button, index) => {
            button.textContent = task[2][index];
            button.disabled = false;
        });
    }
    choices.forEach((button, index) => {
        button.addEventListener("click", () => {
            if (locked) {
                return;
            }
            const task = tasks[step];
            if (index !== task[3]) {
                get("math-full-feedback").textContent = "Try again. Listen for the numbers and operator.";
                return;
            }
            locked = true;
            power(step + 1);
            choices.forEach((choice) => {
                choice.disabled = true;
            });
            get("math-full-feedback").textContent = step === 9 ? "Correct! Full android activation complete!" : "Correct! Repeat aloud.";
            speak(/^[А-Яа-яЁё]/.test(task[2][index]) ? task[2][index] : task[1]);
            get("math-full-next").hidden = step === 9;
            if (step === 9) {
                completionReward();
            }
        });
    });
    get("math-full-next").addEventListener("click", () => {
        step += 1;
        render();
    });
    get("math-full-reset").addEventListener("click", () => {
        stopReward();
        window.speechSynthesis?.cancel();
        step = 0;
        power(0);
        render();
    });
    get("math-full-listen").addEventListener("click", () => speak(tasks[step][1]));
    get("math-full-reveal").addEventListener("click", () => {
        get("math-full-transcript").hidden = !get("math-full-transcript").hidden;
    });
    get("math-full-open").addEventListener("click", () => {
        window.speechSynthesis?.cancel();
        get("math-head-core").hidden = true;
        get("math-full-core").hidden = false;
    });
    get("math-full-back").addEventListener("click", () => {
        stopReward();
        window.speechSynthesis?.cancel();
        get("math-full-core").hidden = true;
        get("math-head-core").hidden = false;
    });
    render();
})();

// Door Two — Conversational Math. All interactive controls are authored in HTML.
(() => {
    const get = (id) => document.getElementById(id);
    const hatch = get("math-conversation-hatch");
    const tasks = Array.from(hatch.querySelectorAll(".cm-task"));
    let index = 0;
    let selected = [];
    let locked = false;
    function speak(text, rate = 0.85) {
        if (!window.speechSynthesis || !window.SpeechSynthesisUtterance) {
            get("cm-meaning").textContent = "Russian audio is unavailable in this browser.";
            return;
        }
        speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text.replace(/\u0301/g, ""));
        utterance.lang = "ru-RU";
        utterance.rate = rate;
        const voice = speechSynthesis.getVoices().find((item) => item.lang.toLowerCase().startsWith("ru"));
        if (voice) {
            utterance.voice = voice;
        }
        speechSynthesis.speak(utterance);
    }
    function show(destination) {
        window.speechSynthesis?.cancel();
        numbersDoorLandings.forEach((landing) => {
            landing.hidden = landing !== destination;
        });
        destination.scrollIntoView({ behavior: "smooth", block: "start" });
    }
    get("cm-open").addEventListener("click", () => show(hatch));
    get("cm-back").addEventListener("click", () => show(get("math-android-landing")));
    hatch.querySelectorAll(".cm-word").forEach((button) => {
        button.addEventListener("click", () => {
            hatch.querySelectorAll(".cm-word").forEach((word) => word.setAttribute("aria-pressed", String(word === button)));
            get("cm-meaning").textContent = `${button.textContent} — ${button.dataset.meaning}`;
            speak(button.textContent);
        });
    });
    hatch.querySelectorAll("[data-cm-audio]").forEach((button) => {
        button.addEventListener("click", () => speak(button.dataset.cmAudio, button.hasAttribute("data-cm-slow") ? 0.6 : 0.85));
    });
    function check(task, value) {
        if (locked) {
            return;
        }
        const feedback = task.querySelector(".cm-feedback");
        if (value !== task.dataset.key) {
            feedback.textContent = "Not quite. Try again. For a sentence builder, clear your selection first.";
            return;
        }
        locked = true;
        feedback.textContent = "Correct! — Правильно!";
        task.querySelector(".cm-explanation").hidden = false;
        speak(task.dataset.answer.split(" — ")[0]);
        task.querySelectorAll("[data-cm-choice], [data-cm-check], [data-cm-clear]").forEach((button) => {
            button.disabled = true;
        });
        get("cm-progress").value = index + 1;
        get("cm-next").hidden = index === tasks.length - 1;
        get("cm-done").hidden = index !== tasks.length - 1;
    }
    function clear(task) {
        selected = [];
        task.querySelectorAll("[data-cm-choice]").forEach((button) => {
            button.disabled = false;
        });
        const built = task.querySelector(".cm-built");
        if (built) {
            built.textContent = "";
        }
    }
    tasks.forEach((task) => {
        task.querySelectorAll("[data-cm-choice]").forEach((button) => {
            button.addEventListener("click", () => {
                if (locked) {
                    return;
                }
                if (task.dataset.key.includes(",")) {
                    selected.push(button.dataset.cmChoice);
                    button.disabled = true;
                    task.querySelector(".cm-built").textContent += `${button.textContent} `;
                } else {
                    check(task, button.dataset.cmChoice);
                }
            });
        });
        task.querySelector("[data-cm-clear]")?.addEventListener("click", () => clear(task));
        task.querySelector("[data-cm-check]")?.addEventListener("click", () => check(task, selected.join(",")));
    });
    function render() {
        locked = false;
        selected = [];
        tasks.forEach((task, position) => {
            task.hidden = position !== index;
            clear(task);
            task.querySelector(".cm-feedback").textContent = "";
            task.querySelector(".cm-explanation").hidden = true;
            task.querySelectorAll("details").forEach((detail) => {
                detail.open = false;
            });
            task.querySelectorAll("[data-cm-check], [data-cm-clear]").forEach((button) => {
                button.disabled = false;
            });
        });
        get("cm-count").textContent = `Exercise ${index + 1} of ${tasks.length}`;
        get("cm-next").hidden = true;
        get("cm-done").hidden = true;
    }
    get("cm-next").addEventListener("click", () => {
        if (locked && index < tasks.length - 1) {
            index += 1;
            render();
        }
    });
    get("cm-reset").addEventListener("click", () => {
        window.speechSynthesis?.cancel();
        index = 0;
        get("cm-progress").value = 0;
        render();
    });
})();

// Door Two — Above & Below Zero. Controls are authored in HTML.
(() => {
    const get = (id) => document.getElementById(id);
    const root = get("zero-lab");
    const units = [["по", "ло", "жи́", "тель", "ное"], ["от", "ри", "ца́", "тель", "ное"]];
    const numbers = ["ноль", "один", "два", "три", "четыре", "пять", "шесть", "семь", "восемь", "девять", "десять", "одиннадцать", "двенадцать", "тринадцать", "четырнадцать", "пятнадцать", "шестнадцать", "семнадцать", "восемнадцать", "девятнадцать", "двадцать"];
    const tasks = [5, -5, 0, 10, -10, 20, -20, 30, -15, 25];
    let number = 0;
    let word = 0;
    let stage = 0;
    let task = 0;
    let solved = false;
    function russian(value) {
        const magnitude = Math.abs(value);
        const name = magnitude <= 20 ? numbers[magnitude] : magnitude === 30 ? "тридцать" : "двадцать " + numbers[magnitude - 20];
        return value === 0 ? name : (value < 0 ? "минус " : "плюс ") + name;
    }
    function signed(value) {
        return value > 0 ? `+${value}` : String(value);
    }
    function speak(text, rate = 0.85) {
        if (!window.speechSynthesis || !window.SpeechSynthesisUtterance) {
            get("zero-meaning").textContent = "Russian audio is unavailable in this browser.";
            return;
        }
        speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text.replace(/\u0301/g, ""));
        utterance.lang = "ru-RU";
        utterance.rate = rate;
        const voice = speechSynthesis.getVoices().find((item) => item.lang.toLowerCase().startsWith("ru"));
        if (voice) {
            utterance.voice = voice;
        }
        speechSynthesis.speak(utterance);
    }
    function show(destination) {
        window.speechSynthesis?.cancel();
        numbersDoorLandings.forEach((landing) => {
            landing.hidden = landing !== destination;
        });
        destination.scrollIntoView({ behavior: "smooth", block: "start" });
    }
    function renderNumber(value, audio = true) {
        number = Math.max(-5, Math.min(5, value));
        get("zero-value").textContent = signed(number);
        get("zero-value").style.color = number < 0 ? "#91caff" : number > 0 ? "#ff9e81" : "white";
        get("zero-russian").textContent = russian(number);
        get("zero-definition").textContent = number < 0 ? "Negative: less than zero." : number > 0 ? "Positive: greater than zero." : "Zero is neither positive nor negative.";
        root.querySelectorAll("[data-zero-number]").forEach((button) => {
            button.setAttribute("aria-pressed", String(Number(button.dataset.zeroNumber) === number));
        });
        get("zero-left").disabled = number === -5;
        get("zero-right").disabled = number === 5;
        if (audio) {
            speak(russian(number));
        }
    }
    function chain() {
        return units[word].slice(4 - stage).join("");
    }
    function renderGuide(audio = true) {
        get("zero-stage").textContent = `Stage ${stage + 1} of 5`;
        get("zero-full-word").querySelectorAll("span").forEach((span, index) => {
            span.textContent = units[word][index];
            span.classList.toggle("active-unit", index >= 4 - stage);
        });
        root.querySelectorAll(".zero-units span").forEach((span, index) => {
            span.textContent = index >= 4 - stage ? units[word][index] : "··";
            span.classList.toggle("new-unit", index >= 4 - stage);
        });
        root.querySelectorAll("[data-zero-guide]").forEach((button) => {
            button.setAttribute("aria-pressed", String(Number(button.dataset.zeroGuide) === word));
        });
        get("zero-prev").disabled = stage === 0;
        get("zero-add").disabled = stage === 4;
        get("zero-phrase").hidden = stage !== 4;
        get("zero-phrase").textContent = `${chain()} число́ — ${word === 0 ? "positive" : "negative"} number. Now say the full expression.`;
        if (audio) {
            speak(chain(), 1);
        }
    }
    function renderTemperature() {
        const value = Number(get("zero-temp").value);
        get("zero-temp-value").textContent = `${signed(value)}°C`;
        get("zero-temp-value").style.color = value < 0 ? "#91caff" : value > 0 ? "#ff9e81" : "white";
        get("zero-marker").style.top = `${(30 - value) * 2}%`;
    }
    function renderTask() {
        solved = false;
        get("zero-progress").textContent = `Exercise ${task + 1} of ${tasks.length}`;
        get("zero-clue").textContent = `${russian(tasks[task])} — ${signed(tasks[task])}°C`;
        get("zero-hint").open = false;
        get("zero-temp").value = 0;
        get("zero-temp").disabled = false;
        get("zero-check").disabled = false;
        get("zero-next").hidden = true;
        get("zero-feedback").textContent = "Set the temperature, then check your answer.";
        renderTemperature();
    }
    get("zero-open").addEventListener("click", () => show(root));
    get("zero-back").addEventListener("click", () => show(get("math-android-landing")));
    root.querySelectorAll("[data-zero-number]").forEach((button) => {
        button.addEventListener("click", () => renderNumber(Number(button.dataset.zeroNumber)));
    });
    get("zero-left").addEventListener("click", () => renderNumber(number - 1));
    get("zero-right").addEventListener("click", () => renderNumber(number + 1));
    get("zero-reset").addEventListener("click", () => renderNumber(0));
    get("zero-listen").addEventListener("click", () => speak(russian(number)));
    get("zero-slow").addEventListener("click", () => speak(russian(number), 0.6));
    root.querySelectorAll("[data-zero-word]").forEach((button) => {
        button.addEventListener("click", () => {
            get("zero-meaning").textContent = `${button.textContent} — ${button.dataset.meaning}`;
            speak(button.dataset.zeroWord);
        });
    });
    get("zero-pronounce").addEventListener("click", () => {
        get("zero-teach").hidden = true;
        get("zero-guide").hidden = false;
        renderGuide();
    });
    get("zero-guide-back").addEventListener("click", () => {
        window.speechSynthesis?.cancel();
        get("zero-guide").hidden = true;
        get("zero-teach").hidden = false;
    });
    root.querySelectorAll("[data-zero-guide]").forEach((button) => {
        button.addEventListener("click", () => {
            word = Number(button.dataset.zeroGuide);
            stage = 0;
            renderGuide();
        });
    });
    root.querySelectorAll("[data-zero-rate]").forEach((button) => {
        button.addEventListener("click", () => speak(chain(), Number(button.dataset.zeroRate)));
    });
    get("zero-prev").addEventListener("click", () => {
        stage = Math.max(0, stage - 1);
        renderGuide();
    });
    get("zero-add").addEventListener("click", () => {
        stage = Math.min(4, stage + 1);
        renderGuide();
    });
    get("zero-temp").addEventListener("input", renderTemperature);
    get("zero-question").addEventListener("click", () => speak("Какая сегодня температура?"));
    get("zero-task-listen").addEventListener("click", () => speak(russian(tasks[task])));
    get("zero-task-slow").addEventListener("click", () => speak(russian(tasks[task]), 0.6));
    get("zero-check").addEventListener("click", () => {
        if (solved) {
            return;
        }
        if (Number(get("zero-temp").value) !== tasks[task]) {
            get("zero-feedback").textContent = "Not quite. Listen again and adjust the thermometer.";
            return;
        }
        solved = true;
        get("zero-check").disabled = true;
        get("zero-temp").disabled = true;
        get("zero-feedback").textContent = task === tasks.length - 1 ? "Отлично! All ten exercises complete!" : "Верно! Correct. Say the temperature aloud.";
        get("zero-next").hidden = task === tasks.length - 1;
        speak(russian(tasks[task]));
    });
    get("zero-next").addEventListener("click", () => {
        if (solved && task < tasks.length - 1) {
            task += 1;
            renderTask();
        }
    });
    get("zero-practice-reset").addEventListener("click", () => {
        task = 0;
        renderTask();
    });
    renderNumber(0, false);
    renderGuide(false);
    renderTask();
})();

// Quantum Math Reactor — navigation only. All controls are authored in HTML.
(() => {
    const hub = document.getElementById("reactor-landing");
    const door = document.getElementById("numbers-door-two-landing");

    function show(destination) {
        if (!destination) {
            return;
        }
        numbersDoorLandings.forEach((landing) => {
            landing.hidden = landing !== destination;
        });
        if (destination === hub) {
            updateQuantumReactorIllumination();
        }
        destination.scrollIntoView({ behavior: "smooth", block: "start" });
    }

    document.getElementById("reactor-open").addEventListener("click", () => show(hub));
    document.getElementById("reactor-door-back").addEventListener("click", () => show(door));
    hub.querySelectorAll("[data-reactor-target]").forEach((button) => {
        button.addEventListener("click", () => {
            show(document.getElementById(`reactor-${button.dataset.reactorTarget}`));
        });
    });
    document.querySelectorAll(".reactor-return").forEach((button) => {
        button.addEventListener("click", () => show(hub));
    });
})();

// Multiplication — persistent two-stage energy activation.
(() => {
    const questions = [
        {
            "instruction": "Identify the Russian expression for multiplication.",
            "prompt": "Which expression means “multiply by”?",
            "audio": "умножить на",
            "meaning": "The preposition на introduces the multiplier.",
            "choices": [
                "плюс",
                "умножить на",
                "минус"
            ],
            "correct": 1,
            "model": "умножить на"
        },
        {
            "instruction": "Complete the expression with the correct preposition.",
            "prompt": "Три умножить ___ четыре.",
            "audio": "три умножить на четыре",
            "meaning": "Three multiplied by four.",
            "choices": [
                "в",
                "с",
                "на"
            ],
            "correct": 2,
            "model": "три умножить на четыре"
        },
        {
            "instruction": "Match the Russian expression to its notation.",
            "prompt": "Пять умножить на два.",
            "audio": "пять умножить на два",
            "meaning": "Five multiplied by two.",
            "choices": [
                "5 × 2",
                "5 + 2",
                "5 − 2"
            ],
            "correct": 0,
            "model": "пять умножить на два равно десять"
        },
        {
            "instruction": "Listen first, then choose the expression you heard.",
            "prompt": "🎧 Listen to the expression.",
            "audio": "семь умножить на три",
            "meaning": "Seven multiplied by three.",
            "choices": [
                "3 × 7",
                "7 × 3",
                "7 + 3"
            ],
            "correct": 1,
            "model": "семь умножить на три равно двадцать один"
        },
        {
            "instruction": "Choose the Russian reading of the equation.",
            "prompt": "4 × 6",
            "audio": "четыре умножить на шесть",
            "meaning": "Four multiplied by six.",
            "choices": [
                "шесть плюс четыре",
                "четыре минус шесть",
                "четыре умножить на шесть"
            ],
            "correct": 2,
            "model": "четыре умножить на шесть равно двадцать четыре"
        },
        {
            "instruction": "Identify the multiplier (the number after на).",
            "prompt": "Восемь умножить на пять.",
            "audio": "восемь умножить на пять",
            "meaning": "Eight multiplied by five.",
            "choices": [
                "пять",
                "восемь",
                "сорок"
            ],
            "correct": 0,
            "model": "восемь умножить на пять равно сорок"
        },
        {
            "instruction": "Complete the equation in Russian.",
            "prompt": "Девять умножить на два равно ___.",
            "audio": "девять умножить на два равно",
            "meaning": "Nine multiplied by two equals…",
            "choices": [
                "девятнадцать",
                "восемнадцать",
                "одиннадцать"
            ],
            "correct": 1,
            "model": "девять умножить на два равно восемнадцать"
        },
        {
            "instruction": "Recognize a conversational question.",
            "prompt": "Сколько будет шесть умножить на три?",
            "audio": "сколько будет шесть умножить на три",
            "meaning": "How much is six times three?",
            "choices": [
                "Будет девять.",
                "Будет шестнадцать.",
                "Будет восемнадцать."
            ],
            "correct": 2,
            "model": "будет восемнадцать"
        },
        {
            "instruction": "Listen and identify the complete equation.",
            "prompt": "🎧 Listen to the complete equation.",
            "audio": "десять умножить на четыре равно сорок",
            "meaning": "Ten times four equals forty.",
            "choices": [
                "10 × 4 = 40",
                "10 + 4 = 14",
                "4 × 4 = 16"
            ],
            "correct": 0,
            "model": "десять умножить на четыре равно сорок"
        },
        {
            "instruction": "Choose the correct Russian instruction for 12 × 3.",
            "prompt": "12 × 3",
            "audio": "двенадцать умножить на три",
            "meaning": "Multiply twelve by three.",
            "choices": [
                "три плюс двенадцать",
                "двенадцать умножить на три",
                "двенадцать умножить три"
            ],
            "correct": 1,
            "model": "двенадцать умножить на три равно тридцать шесть"
        },
        {
            "instruction": "Interpret the groups and select the equation.",
            "prompt": "В каждой коробке четыре яблока. Всего три коробки.",
            "audio": "в каждой коробке четыре яблока. всего три коробки",
            "meaning": "Four apples in each box; three boxes altogether.",
            "choices": [
                "4 + 3",
                "4 − 3",
                "4 × 3"
            ],
            "correct": 2,
            "model": "четыре умножить на три равно двенадцать"
        },
        {
            "instruction": "Calculate the total cost and choose a Russian answer.",
            "prompt": "Один билет стоит двадцать рублей. Нужно пять билетов. Сколько всего?",
            "audio": "один билет стоит двадцать рублей. нужно пять билетов. сколько всего",
            "meaning": "One ticket costs 20 rubles; five tickets are needed.",
            "choices": [
                "Сто рублей.",
                "Двадцать пять рублей.",
                "Пятьдесят рублей."
            ],
            "correct": 0,
            "model": "двадцать умножить на пять равно сто. сто рублей"
        },
        {
            "instruction": "Listen to the order and identify the total.",
            "prompt": "🎧 Listen to the order.",
            "audio": "три пакета, в каждом по шесть яблок. сколько всего яблок",
            "meaning": "Three bags, six apples in each.",
            "choices": [
                "девять яблок",
                "восемнадцать яблок",
                "шестнадцать яблок"
            ],
            "correct": 1,
            "model": "восемнадцать яблок"
        },
        {
            "instruction": "Interpret the repeated daily quantity.",
            "prompt": "Каждый день я читаю десять страниц. Сколько страниц за семь дней?",
            "audio": "каждый день я читаю десять страниц. сколько страниц за семь дней",
            "meaning": "I read ten pages each day. How many in seven days?",
            "choices": [
                "семнадцать страниц",
                "шестьдесят страниц",
                "семьдесят страниц"
            ],
            "correct": 2,
            "model": "десять умножить на семь равно семьдесят"
        },
        {
            "instruction": "Choose the instruction that doubles the quantity.",
            "prompt": "Увеличьте число восемь в два раза.",
            "audio": "увеличьте число восемь в два раза",
            "meaning": "Increase eight twofold (double it).",
            "choices": [
                "Восемь умножить на два.",
                "Восемь плюс два.",
                "Восемь минус два."
            ],
            "correct": 0,
            "model": "восемь умножить на два равно шестнадцать"
        },
        {
            "instruction": "Find the total number of seats.",
            "prompt": "В зале шесть рядов, в каждом ряду по десять мест.",
            "audio": "в зале шесть рядов, в каждом ряду по десять мест",
            "meaning": "Six rows, ten seats in each row.",
            "choices": [
                "шестнадцать мест",
                "шестьдесят мест",
                "семьдесят мест"
            ],
            "correct": 1,
            "model": "шестьдесят мест"
        },
        {
            "instruction": "Interpret the price question.",
            "prompt": "Две книги стоят по сто рублей. Сколько стоят обе книги?",
            "audio": "две книги стоят по сто рублей. сколько стоят обе книги",
            "meaning": "Two books cost 100 rubles each. How much for both?",
            "choices": [
                "сто два рубля",
                "сто рублей",
                "двести рублей"
            ],
            "correct": 2,
            "model": "сто умножить на два равно двести"
        },
        {
            "instruction": "Listen to the work schedule and choose the total.",
            "prompt": "🎧 Listen to the schedule.",
            "audio": "он работает по восемь часов в день, пять дней в неделю. сколько часов в неделю",
            "meaning": "He works eight hours a day, five days a week.",
            "choices": [
                "сорок часов",
                "тринадцать часов",
                "пятьдесят часов"
            ],
            "correct": 0,
            "model": "сорок часов"
        },
        {
            "instruction": "Choose the correct response to a quantity question.",
            "prompt": "В каждой упаковке по двенадцать бутылок. Сколько бутылок в четырёх упаковках?",
            "audio": "в каждой упаковке по двенадцать бутылок. сколько бутылок в четырёх упаковках",
            "meaning": "Twelve bottles per pack; how many in four packs?",
            "choices": [
                "шестнадцать бутылок",
                "сорок восемь бутылок",
                "сорок бутылок"
            ],
            "correct": 1,
            "model": "двенадцать умножить на четыре равно сорок восемь"
        },
        {
            "instruction": "Final reactor challenge: interpret the delivery.",
            "prompt": "Привезли девять ящиков, в каждом по двадцать деталей. Сколько всего деталей?",
            "audio": "привезли девять ящиков, в каждом по двадцать деталей. сколько всего деталей",
            "meaning": "Nine crates arrived, each containing twenty parts.",
            "choices": [
                "двадцать девять деталей",
                "девяносто деталей",
                "сто восемьдесят деталей"
            ],
            "correct": 2,
            "model": "девять умножить на двадцать равно сто восемьдесят"
        }
    ];
    const get = (id) => document.getElementById(id);
    const root = get("reactor-multiplication");
    const key = "numbers-reactor-multiplication-v1";
    let counts = [0, 0];
    try {
        const stored = JSON.parse(localStorage.getItem(key) || "0");
        counts = Array.isArray(stored) ? [0, 1].map(i => Math.max(0, Math.min(10, Math.floor(Number(stored[i]) || 0)))) : [Math.min(10, Math.max(0, Number(stored) || 0)), Math.min(10, Math.max(0, (Number(stored) || 0) - 10))];
    } catch (error) {
        console.warn("Multiplication progress unavailable", error);
    }
    let activeSet = 0;
    let index = Math.min(counts[0], 9);
    let solved = counts[0] === 10;
    let stage = 0;
    const units = ["у", "мно́", "жить", " на"];
    function speak(text, rate = 1) {
        if (!window.speechSynthesis || !window.SpeechSynthesisUtterance) {
            get("mul-feedback").textContent = "Russian audio is unavailable. Use Help to continue.";
            return;
        }
        speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text.replace(/\u0301/g, ""));
        utterance.lang = "ru-RU";
        utterance.rate = rate;
        const voice = speechSynthesis.getVoices().find((item) => item.lang.toLowerCase().startsWith("ru"));
        if (voice) {
            utterance.voice = voice;
        }
        speechSynthesis.speak(utterance);
    }
    function save() {
        try {
            localStorage.setItem(key, JSON.stringify(counts));
        } catch (error) {
            console.warn("Multiplication progress could not be saved", error);
        }
    }
    function energy() {
        root.querySelectorAll("[data-mul-wheel]").forEach((wheel) => {
            const set = Number(wheel.dataset.mulWheel) - 1;
            wheel.hidden = set !== activeSet;
            wheel.classList.toggle("is-complete", counts[set] === 10);
            wheel.querySelectorAll("[data-mul-cell]").forEach((cell) => {
                cell.classList.toggle("is-lit", Number(cell.dataset.mulCell) <= counts[set]);
            });
        });
        const complete = counts.every(count => count === 10);
        document.querySelector(".reactor-nodule--multiply").classList.toggle("is-energized", complete);
        updateQuantumReactorIllumination();
        document.querySelector(".reactor-multiply").setAttribute("aria-label", complete ? "Multiplication — fully energized" : "Multiplication");
    }
    function renderVocabulary() {
        const step = index % 10 + 1;
        const panel = root.querySelector(".mul-vocab-scroll");
        let newest = null;
        panel.querySelectorAll("[data-vocab-set]").forEach((entry) => {
            const sameSet = Number(entry.dataset.vocabSet) === activeSet + 1;
            const introduced = Number(entry.dataset.vocabStep);
            const visible = sameSet && introduced <= step;
            entry.hidden = !visible;
            entry.classList.toggle("is-new", visible && introduced === step);
            if (visible && introduced === step && !newest) {
                newest = entry;
            }
        });
        requestAnimationFrame(() => {
            if (newest && panel.clientHeight) {
                panel.scrollTop = newest.offsetTop;
            } else if (panel.clientHeight) {
                panel.scrollTop = panel.scrollHeight;
            }
        });
    }
    function renderMathSupport() {
        const support = get("mul-math-support");
        const button = get("mul-math-help");
        let available = false;
        support.querySelectorAll("[data-math-index]").forEach((entry) => {
            const current = Number(entry.dataset.mathIndex) === index;
            entry.hidden = !current;
            entry.querySelector(".reactor-math-hint").hidden = true;
            available = available || current;
        });
        support.hidden = !available;
        button.setAttribute("aria-expanded", "false");
        button.textContent = ([0, 1, 2, 3, 4, 5, 8, 9, 10, 14].includes(index) ? "Help — Understand It" : "Help — Solve It");
    }
    get("mul-math-help").addEventListener("click", () => {
        const entry = get("mul-math-support").querySelector("[data-math-index]:not([hidden])");
        if (!entry) {
            return;
        }
        const hint = entry.querySelector(".reactor-math-hint");
        hint.hidden = !hint.hidden;
        const button = get("mul-math-help");
        button.setAttribute("aria-expanded", String(!hint.hidden));
        button.textContent = hint.hidden ? ([0, 1, 2, 3, 4, 5, 8, 9, 10, 14].includes(index) ? "Help — Understand It" : "Help — Solve It") : "Close Math Help";
    });
    function render() {
        renderVocabulary();
        const question = questions[index];
        get("mul-title").textContent = `${activeSet === 0 ? "Foundational Understanding" : "Applied Understanding"} · ${index % 10 + 1}/10`;
        get("mul-instruction").textContent = question.instruction;
        get("mul-prompt").textContent = question.prompt;
        get("mul-meaning").textContent = question.meaning + " — " + question.audio;
        get("mul-meaning").hidden = true;
        renderMathSupport();
        get("mul-feedback").textContent = "";
        root.querySelectorAll("[data-mul-choice]").forEach((button) => {
            button.textContent = question.choices[Number(button.dataset.mulChoice)];
            button.disabled = solved;
        });
        root.querySelectorAll("[data-mul-set]").forEach((button) => {
            button.setAttribute("aria-pressed", String(Number(button.dataset.mulSet) === activeSet + 1));
        });
        get("mul-reset").textContent = `Restart Set ${activeSet + 1}`;
        get("mul-switch").textContent = `Go to Set ${2 - activeSet}`;
        get("mul-next").hidden = true;
        get("mul-model").hidden = !solved;
        energy();
    }
    function selectSet(set) {
        activeSet = set;
        index = set * 10 + Math.min(counts[set], 9);
        solved = counts[set] === 10;
        get("mul-guide").hidden = true;
        get("mul-exercises").hidden = false;
        render();
    }
    root.querySelectorAll("[data-mul-set]").forEach((button) => {
        button.addEventListener("click", () => selectSet(Number(button.dataset.mulSet) - 1));
    });
    get("mul-switch").addEventListener("click", () => selectSet(1 - activeSet));
    root.querySelectorAll("[data-mul-choice]").forEach((button) => {
        button.addEventListener("click", () => {
            if (solved) {
                return;
            }
            if (Number(button.dataset.mulChoice) !== questions[index].correct) {
                get("mul-feedback").textContent = "Попробуйте ещё раз.";
                return;
            }
            solved = true;
            counts[activeSet] = index % 10 + 1;
            save();
            energy();
            root.querySelectorAll("[data-mul-choice]").forEach((choice) => {
                choice.disabled = true;
            });
            get("mul-model").hidden = false;
            get("mul-feedback").textContent = "Верно!";
            get("mul-next").hidden = counts[activeSet] === 10;
            get("mul-next").textContent = "Next exercise →";
            speak(questions[index].model);
        });
    });
    get("mul-next").addEventListener("click", () => selectSet(activeSet));
    get("mul-reset").addEventListener("click", () => {
        if (!window.confirm(`Restart Set ${activeSet + 1}?`)) {
            return;
        }
        counts[activeSet] = 0;
        save();
        selectSet(activeSet);
    });
    get("mul-listen").addEventListener("click", () => speak(questions[index].audio));
    get("mul-slow").addEventListener("click", () => speak(questions[index].audio, 0.55));
    get("mul-model").addEventListener("click", () => speak(questions[index].model));
    get("mul-help").addEventListener("click", () => {
        get("mul-meaning").hidden = !get("mul-meaning").hidden;
    });
    root.querySelectorAll("[data-mul-say]").forEach((button) => {
        button.addEventListener("click", () => speak(button.dataset.mulSay));
    });
    function chain() {
        return units.slice(3 - stage).join("").trim();
    }
    function guide(audio = true) {
        get("mul-stage").textContent = `Stage ${stage + 1} of 4`;
        get("mul-full-word").querySelectorAll("span").forEach((span, i) => {
            span.classList.toggle("active-unit", i >= 3 - stage);
        });
        get("mul-guide").querySelectorAll(".zero-units span").forEach((span, i) => {
            span.textContent = i >= 3 - stage ? units[i] : "··";
            span.classList.toggle("new-unit", i >= 3 - stage);
        });
        get("mul-prev").disabled = stage === 0;
        get("mul-add").disabled = stage === 3;
        if (audio) {
            speak(chain());
        }
    }
    get("mul-guide-open").addEventListener("click", () => {
        get("mul-exercises").hidden = true;
        get("mul-guide").hidden = false;
        stage = 0;
        guide();
    });
    get("mul-guide-back").addEventListener("click", () => {
        window.speechSynthesis?.cancel();
        get("mul-guide").hidden = true;
        get("mul-exercises").hidden = false;
    });
    get("mul-prev").addEventListener("click", () => {
        stage = Math.max(0, stage - 1);
        guide();
    });
    get("mul-add").addEventListener("click", () => {
        stage = Math.min(3, stage + 1);
        guide();
    });
    root.querySelectorAll("[data-mul-rate]").forEach((button) => {
        button.addEventListener("click", () => speak(chain(), Number(button.dataset.mulRate)));
    });
    root.querySelector(".reactor-return").addEventListener("click", () => window.speechSynthesis?.cancel());
    render();
})();


// Division — persistent two-stage energy activation.
(() => {
    const questions = [
        {
            "instruction": "Calculate and choose the Russian answer.",
            "prompt": "Шесть разделить на два.",
            "audio": "Шесть разделить на два.",
            "meaning": "Six divided by two.",
            "choices": [
                "три",
                "четыре",
                "восемь"
            ],
            "correct": 0,
            "model": "три"
        },
        {
            "instruction": "Calculate and choose the Russian answer.",
            "prompt": "Десять разделить на пять.",
            "audio": "Десять разделить на пять.",
            "meaning": "Ten divided by five.",
            "choices": [
                "пятнадцать",
                "два",
                "пять"
            ],
            "correct": 1,
            "model": "два"
        },
        {
            "instruction": "Calculate and choose the Russian answer.",
            "prompt": "Двенадцать разделить на четыре.",
            "audio": "Двенадцать разделить на четыре.",
            "meaning": "Twelve divided by four.",
            "choices": [
                "четыре",
                "восемь",
                "три"
            ],
            "correct": 2,
            "model": "три"
        },
        {
            "instruction": "Calculate and choose the Russian answer.",
            "prompt": "Восемнадцать разделить на три равно ___.",
            "audio": "Восемнадцать разделить на три равно .",
            "meaning": "Eighteen divided by three equals…",
            "choices": [
                "шесть",
                "девять",
                "пятнадцать"
            ],
            "correct": 0,
            "model": "шесть"
        },
        {
            "instruction": "Calculate and choose the Russian answer.",
            "prompt": "Сколько будет двадцать разделить на четыре?",
            "audio": "Сколько будет двадцать разделить на четыре?",
            "meaning": "How much is twenty divided by four?",
            "choices": [
                "восемь",
                "пять",
                "шесть"
            ],
            "correct": 1,
            "model": "пять"
        },
        {
            "instruction": "Calculate and choose the Russian answer.",
            "prompt": "Двадцать четыре разделить на шесть.",
            "audio": "Двадцать четыре разделить на шесть.",
            "meaning": "Twenty-four divided by six.",
            "choices": [
                "шесть",
                "восемь",
                "четыре"
            ],
            "correct": 2,
            "model": "четыре"
        },
        {
            "instruction": "Calculate and choose the Russian answer.",
            "prompt": "Тридцать разделить на пять.",
            "audio": "Тридцать разделить на пять.",
            "meaning": "Thirty divided by five.",
            "choices": [
                "шесть",
                "пять",
                "десять"
            ],
            "correct": 0,
            "model": "шесть"
        },
        {
            "instruction": "Calculate and choose the Russian answer.",
            "prompt": "Уменьшите число сорок в два раза.",
            "audio": "Уменьшите число сорок в два раза.",
            "meaning": "Halve the number forty.",
            "choices": [
                "восемьдесят",
                "двадцать",
                "тридцать восемь"
            ],
            "correct": 1,
            "model": "двадцать"
        },
        {
            "instruction": "Calculate and choose the Russian answer.",
            "prompt": "Сорок девять разделить на семь.",
            "audio": "Сорок девять разделить на семь.",
            "meaning": "Forty-nine divided by seven.",
            "choices": [
                "восемь",
                "девять",
                "семь"
            ],
            "correct": 2,
            "model": "семь"
        },
        {
            "instruction": "Calculate and choose the Russian answer.",
            "prompt": "Сто разделить на десять.",
            "audio": "Сто разделить на десять.",
            "meaning": "One hundred divided by ten.",
            "choices": [
                "десять",
                "двадцать",
                "пятьдесят"
            ],
            "correct": 0,
            "model": "десять"
        },
        {
            "instruction": "Interpret the Russian and choose the correct answer.",
            "prompt": "Разделите двенадцать яблок поровну между тремя детьми. Сколько каждому?",
            "audio": "Разделите двенадцать яблок поровну между тремя детьми. Сколько каждому?",
            "meaning": "Share twelve apples equally among three children. How many for each?",
            "choices": [
                "шесть",
                "четыре",
                "три"
            ],
            "correct": 1,
            "model": "четыре"
        },
        {
            "instruction": "Interpret the Russian and choose the correct answer.",
            "prompt": "Шесть билетов стоят триста рублей. Сколько стоит один билет?",
            "audio": "Шесть билетов стоят триста рублей. Сколько стоит один билет?",
            "meaning": "Six tickets cost 300 rubles. How much is one?",
            "choices": [
                "шестьдесят рублей",
                "сто рублей",
                "пятьдесят рублей"
            ],
            "correct": 2,
            "model": "пятьдесят рублей"
        },
        {
            "instruction": "Interpret the Russian and choose the correct answer.",
            "prompt": "В коробке двадцать четыре карандаша. Разложите их в четыре пакета поровну.",
            "audio": "В коробке двадцать четыре карандаша. Разложите их в четыре пакета поровну.",
            "meaning": "There are 24 pencils in a box. Put them equally into four bags.",
            "choices": [
                "шесть",
                "восемь",
                "десять"
            ],
            "correct": 0,
            "model": "шесть"
        },
        {
            "instruction": "Interpret the Russian and choose the correct answer.",
            "prompt": "За пять дней он прочитал пятьдесят страниц. Сколько в день в среднем?",
            "audio": "За пять дней он прочитал пятьдесят страниц. Сколько в день в среднем?",
            "meaning": "He read fifty pages in five days. How many per day on average?",
            "choices": [
                "двадцать",
                "десять",
                "пять"
            ],
            "correct": 1,
            "model": "десять"
        },
        {
            "instruction": "Interpret the Russian and choose the correct answer.",
            "prompt": "Автобус проехал сто двадцать километров за три часа. Какова средняя скорость?",
            "audio": "Автобус проехал сто двадцать километров за три часа. Какова средняя скорость?",
            "meaning": "A bus traveled 120 km in three hours. What was its average speed?",
            "choices": [
                "30 км/ч",
                "60 км/ч",
                "40 км/ч"
            ],
            "correct": 2,
            "model": "40 км/ч"
        },
        {
            "instruction": "Interpret the Russian and choose the correct answer.",
            "prompt": "В зале восемьдесят мест в десяти одинаковых рядах. Сколько мест в ряду?",
            "audio": "В зале восемьдесят мест в десяти одинаковых рядах. Сколько мест в ряду?",
            "meaning": "A hall has 80 seats in ten identical rows. How many per row?",
            "choices": [
                "восемь",
                "десять",
                "двенадцать"
            ],
            "correct": 0,
            "model": "восемь"
        },
        {
            "instruction": "Interpret the Russian and choose the correct answer.",
            "prompt": "Четыре друга делят счёт на восемьсот рублей поровну. Сколько платит каждый?",
            "audio": "Четыре друга делят счёт на восемьсот рублей поровну. Сколько платит каждый?",
            "meaning": "Four friends split an 800-ruble bill equally. How much does each pay?",
            "choices": [
                "четыреста рублей",
                "двести рублей",
                "сто рублей"
            ],
            "correct": 1,
            "model": "двести рублей"
        },
        {
            "instruction": "Interpret the Russian and choose the correct answer.",
            "prompt": "На складе девяносто бутылок. В каждый ящик кладут по десять. Сколько ящиков нужно?",
            "audio": "На складе девяносто бутылок. В каждый ящик кладут по десять. Сколько ящиков нужно?",
            "meaning": "There are 90 bottles in storage. Ten go into each crate. How many crates are needed?",
            "choices": [
                "десять",
                "восемь",
                "девять"
            ],
            "correct": 2,
            "model": "девять"
        },
        {
            "instruction": "Interpret the Russian and choose the correct answer.",
            "prompt": "Уменьшите число девяносто в три раза.",
            "audio": "Уменьшите число девяносто в три раза.",
            "meaning": "Reduce ninety by a factor of three.",
            "choices": [
                "тридцать",
                "восемьдесят семь",
                "двадцать"
            ],
            "correct": 0,
            "model": "тридцать"
        },
        {
            "instruction": "Interpret the Russian and choose the correct answer.",
            "prompt": "Рабочие изготовили двести сорок деталей за восемь часов. Сколько деталей в час в среднем?",
            "audio": "Рабочие изготовили двести сорок деталей за восемь часов. Сколько деталей в час в среднем?",
            "meaning": "Workers made 240 parts in eight hours. How many per hour on average?",
            "choices": [
                "двадцать",
                "тридцать",
                "сорок"
            ],
            "correct": 1,
            "model": "тридцать"
        }
    ];
    const get = (id) => document.getElementById(id);
    const root = get("reactor-division");
    const key = "numbers-reactor-division-v1";
    let counts = [0, 0];
    try {
        const stored = JSON.parse(localStorage.getItem(key) || "0");
        counts = Array.isArray(stored) ? [0, 1].map(i => Math.max(0, Math.min(10, Math.floor(Number(stored[i]) || 0)))) : [Math.min(10, Math.max(0, Number(stored) || 0)), Math.min(10, Math.max(0, (Number(stored) || 0) - 10))];
    } catch (error) {
        console.warn("Division progress unavailable", error);
    }
    let activeSet = 0;
    let index = Math.min(counts[0], 9);
    let solved = counts[0] === 10;
    let stage = 0;
    const units = ["раз", "де", "ли́ть", " на"];
    function speak(text, rate = 1) {
        if (!window.speechSynthesis || !window.SpeechSynthesisUtterance) {
            get("div-feedback").textContent = "Russian audio is unavailable. Use Help to continue.";
            return;
        }
        speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text.replace(/\u0301/g, ""));
        utterance.lang = "ru-RU";
        utterance.rate = rate;
        const voice = speechSynthesis.getVoices().find((item) => item.lang.toLowerCase().startsWith("ru"));
        if (voice) {
            utterance.voice = voice;
        }
        speechSynthesis.speak(utterance);
    }
    function save() {
        try {
            localStorage.setItem(key, JSON.stringify(counts));
        } catch (error) {
            console.warn("Division progress could not be saved", error);
        }
    }
    function energy() {
        root.querySelectorAll("[data-div-wheel]").forEach((wheel) => {
            const set = Number(wheel.dataset.divWheel) - 1;
            wheel.hidden = set !== activeSet;
            wheel.classList.toggle("is-complete", counts[set] === 10);
            wheel.querySelectorAll("[data-div-cell]").forEach((cell) => {
                cell.classList.toggle("is-lit", Number(cell.dataset.divCell) <= counts[set]);
            });
        });
        const complete = counts.every(count => count === 10);
        document.querySelector(".reactor-nodule--divide").classList.toggle("is-energized", complete);
        updateQuantumReactorIllumination();
        document.querySelector(".reactor-divide").setAttribute("aria-label", complete ? "Division — fully energized" : "Division");
    }
    function renderVocabulary() {
        const step = index % 10 + 1;
        const panel = root.querySelector(".div-vocab-scroll");
        let newest = null;
        panel.querySelectorAll("[data-vocab-set]").forEach((entry) => {
            const sameSet = Number(entry.dataset.vocabSet) === activeSet + 1;
            const introduced = Number(entry.dataset.vocabStep);
            const visible = sameSet && introduced <= step;
            entry.hidden = !visible;
            entry.classList.toggle("is-new", visible && introduced === step);
            if (visible && introduced === step && !newest) {
                newest = entry;
            }
        });
        requestAnimationFrame(() => {
            if (newest && panel.clientHeight) {
                panel.scrollTop = newest.offsetTop;
            } else if (panel.clientHeight) {
                panel.scrollTop = panel.scrollHeight;
            }
        });
    }
    function renderMathSupport() {
        const support = get("div-math-support");
        const button = get("div-math-help");
        let available = false;
        support.querySelectorAll("[data-math-index]").forEach((entry) => {
            const current = Number(entry.dataset.mathIndex) === index;
            entry.hidden = !current;
            entry.querySelector(".reactor-math-hint").hidden = true;
            available = available || current;
        });
        support.hidden = !available;
        button.setAttribute("aria-expanded", "false");
        button.textContent = "Help — Solve It";
    }
    get("div-math-help").addEventListener("click", () => {
        const entry = get("div-math-support").querySelector("[data-math-index]:not([hidden])");
        if (!entry) {
            return;
        }
        const hint = entry.querySelector(".reactor-math-hint");
        hint.hidden = !hint.hidden;
        const button = get("div-math-help");
        button.setAttribute("aria-expanded", String(!hint.hidden));
        button.textContent = hint.hidden ? "Help — Solve It" : "Close Math Help";
    });
    function render() {
        renderVocabulary();
        const question = questions[index];
        get("div-title").textContent = `${activeSet === 0 ? "Foundational Understanding" : "Applied Understanding"} · ${index % 10 + 1}/10`;
        get("div-instruction").textContent = question.instruction;
        get("div-prompt").textContent = question.prompt;
        get("div-meaning").textContent = question.meaning + " — " + question.audio;
        get("div-meaning").hidden = true;
        renderMathSupport();
        get("div-feedback").textContent = "";
        root.querySelectorAll("[data-div-choice]").forEach((button) => {
            button.textContent = question.choices[Number(button.dataset.divChoice)];
            button.disabled = solved;
        });
        root.querySelectorAll("[data-div-set]").forEach((button) => {
            button.setAttribute("aria-pressed", String(Number(button.dataset.divSet) === activeSet + 1));
        });
        get("div-reset").textContent = `Restart Set ${activeSet + 1}`;
        get("div-switch").textContent = `Go to Set ${2 - activeSet}`;
        get("div-next").hidden = true;
        get("div-model").hidden = !solved;
        energy();
    }
    function selectSet(set) {
        activeSet = set;
        index = set * 10 + Math.min(counts[set], 9);
        solved = counts[set] === 10;
        get("div-guide").hidden = true;
        get("div-exercises").hidden = false;
        render();
    }
    root.querySelectorAll("[data-div-set]").forEach((button) => {
        button.addEventListener("click", () => selectSet(Number(button.dataset.divSet) - 1));
    });
    get("div-switch").addEventListener("click", () => selectSet(1 - activeSet));
    root.querySelectorAll("[data-div-choice]").forEach((button) => {
        button.addEventListener("click", () => {
            if (solved) {
                return;
            }
            if (Number(button.dataset.divChoice) !== questions[index].correct) {
                get("div-feedback").textContent = "Попробуйте ещё раз.";
                return;
            }
            solved = true;
            counts[activeSet] = index % 10 + 1;
            save();
            energy();
            root.querySelectorAll("[data-div-choice]").forEach((choice) => {
                choice.disabled = true;
            });
            get("div-model").hidden = false;
            get("div-feedback").textContent = "Верно!";
            get("div-next").hidden = counts[activeSet] === 10;
            get("div-next").textContent = "Next exercise →";
            speak(questions[index].model);
        });
    });
    get("div-next").addEventListener("click", () => selectSet(activeSet));
    get("div-reset").addEventListener("click", () => {
        if (!window.confirm(`Restart Set ${activeSet + 1}?`)) {
            return;
        }
        counts[activeSet] = 0;
        save();
        selectSet(activeSet);
    });
    get("div-listen").addEventListener("click", () => speak(questions[index].audio));
    get("div-slow").addEventListener("click", () => speak(questions[index].audio, 0.55));
    get("div-model").addEventListener("click", () => speak(questions[index].model));
    get("div-help").addEventListener("click", () => {
        get("div-meaning").hidden = !get("div-meaning").hidden;
    });
    root.querySelectorAll("[data-div-say]").forEach((button) => {
        button.addEventListener("click", () => speak(button.dataset.divSay));
    });
    function chain() {
        return units.slice(3 - stage).join("").trim();
    }
    function guide(audio = true) {
        get("div-stage").textContent = `Stage ${stage + 1} of 4`;
        get("div-full-word").querySelectorAll("span").forEach((span, i) => {
            span.classList.toggle("active-unit", i >= 3 - stage);
        });
        get("div-guide").querySelectorAll(".zero-units span").forEach((span, i) => {
            span.textContent = i >= 3 - stage ? units[i] : "··";
            span.classList.toggle("new-unit", i >= 3 - stage);
        });
        get("div-prev").disabled = stage === 0;
        get("div-add").disabled = stage === 3;
        if (audio) {
            speak(chain());
        }
    }
    get("div-guide-open").addEventListener("click", () => {
        get("div-exercises").hidden = true;
        get("div-guide").hidden = false;
        stage = 0;
        guide();
    });
    get("div-guide-back").addEventListener("click", () => {
        window.speechSynthesis?.cancel();
        get("div-guide").hidden = true;
        get("div-exercises").hidden = false;
    });
    get("div-prev").addEventListener("click", () => {
        stage = Math.max(0, stage - 1);
        guide();
    });
    get("div-add").addEventListener("click", () => {
        stage = Math.min(3, stage + 1);
        guide();
    });
    root.querySelectorAll("[data-div-rate]").forEach((button) => {
        button.addEventListener("click", () => speak(chain(), Number(button.dataset.divRate)));
    });
    root.querySelector(".reactor-return").addEventListener("click", () => window.speechSynthesis?.cancel());
    render();
})();


// Fractions — persistent two-stage energy activation.
(() => {
    const questions = [
        {
            "instruction": "Choose the matching fraction.",
            "prompt": "Одна вторая.",
            "audio": "Одна вторая.",
            "meaning": "One half.",
            "choices": [
                "1/2",
                "1/3",
                "2/1"
            ],
            "correct": 0,
            "model": "1/2"
        },
        {
            "instruction": "Choose the matching fraction.",
            "prompt": "Одна третья.",
            "audio": "Одна третья.",
            "meaning": "One third.",
            "choices": [
                "1/4",
                "1/3",
                "3/1"
            ],
            "correct": 1,
            "model": "1/3"
        },
        {
            "instruction": "Choose the matching fraction.",
            "prompt": "Две третьих.",
            "audio": "Две третьих.",
            "meaning": "Two thirds.",
            "choices": [
                "3/2",
                "2/4",
                "2/3"
            ],
            "correct": 2,
            "model": "2/3"
        },
        {
            "instruction": "Choose the matching fraction.",
            "prompt": "Одна четвёртая.",
            "audio": "Одна четвёртая.",
            "meaning": "One fourth.",
            "choices": [
                "1/4",
                "4/1",
                "1/5"
            ],
            "correct": 0,
            "model": "1/4"
        },
        {
            "instruction": "Choose the matching fraction.",
            "prompt": "Три четвёртых.",
            "audio": "Три четвёртых.",
            "meaning": "Three fourths.",
            "choices": [
                "3/5",
                "3/4",
                "4/3"
            ],
            "correct": 1,
            "model": "3/4"
        },
        {
            "instruction": "Choose the matching fraction.",
            "prompt": "Две пятых.",
            "audio": "Две пятых.",
            "meaning": "Two fifths.",
            "choices": [
                "5/2",
                "2/6",
                "2/5"
            ],
            "correct": 2,
            "model": "2/5"
        },
        {
            "instruction": "Choose the matching fraction.",
            "prompt": "Пять шестых.",
            "audio": "Пять шестых.",
            "meaning": "Five sixths.",
            "choices": [
                "5/6",
                "6/5",
                "5/7"
            ],
            "correct": 0,
            "model": "5/6"
        },
        {
            "instruction": "Choose the matching fraction.",
            "prompt": "Три восьмых.",
            "audio": "Три восьмых.",
            "meaning": "Three eighths.",
            "choices": [
                "3/7",
                "3/8",
                "8/3"
            ],
            "correct": 1,
            "model": "3/8"
        },
        {
            "instruction": "Choose the matching fraction.",
            "prompt": "Семь десятых.",
            "audio": "Семь десятых.",
            "meaning": "Seven tenths.",
            "choices": [
                "10/7",
                "7/9",
                "7/10"
            ],
            "correct": 2,
            "model": "7/10"
        },
        {
            "instruction": "Choose the matching fraction.",
            "prompt": "Девять сотых.",
            "audio": "Девять сотых.",
            "meaning": "Nine hundredths.",
            "choices": [
                "9/100",
                "9/10",
                "100/9"
            ],
            "correct": 0,
            "model": "9/100"
        },
        {
            "instruction": "Interpret the Russian and choose the correct answer.",
            "prompt": "Половина от двадцати яблок.",
            "audio": "Половина от двадцати яблок.",
            "meaning": "Half of twenty apples.",
            "choices": [
                "двадцать",
                "десять",
                "пять"
            ],
            "correct": 1,
            "model": "десять"
        },
        {
            "instruction": "Interpret the Russian and choose the correct answer.",
            "prompt": "Четверть от сорока рублей.",
            "audio": "Четверть от сорока рублей.",
            "meaning": "A quarter of forty rubles.",
            "choices": [
                "двадцать рублей",
                "пять рублей",
                "десять рублей"
            ],
            "correct": 2,
            "model": "десять рублей"
        },
        {
            "instruction": "Interpret the Russian and choose the correct answer.",
            "prompt": "Треть от тридцати страниц.",
            "audio": "Треть от тридцати страниц.",
            "meaning": "A third of thirty pages.",
            "choices": [
                "десять",
                "двадцать",
                "три"
            ],
            "correct": 0,
            "model": "десять"
        },
        {
            "instruction": "Interpret the Russian and choose the correct answer.",
            "prompt": "Две третьих от двенадцати литров.",
            "audio": "Две третьих от двенадцати литров.",
            "meaning": "Two thirds of twelve liters.",
            "choices": [
                "шесть",
                "восемь",
                "четыре"
            ],
            "correct": 1,
            "model": "восемь"
        },
        {
            "instruction": "Interpret the Russian and choose the correct answer.",
            "prompt": "Три четвёртых от двадцати билетов.",
            "audio": "Три четвёртых от двадцати билетов.",
            "meaning": "Three quarters of twenty tickets.",
            "choices": [
                "пять",
                "десять",
                "пятнадцать"
            ],
            "correct": 2,
            "model": "пятнадцать"
        },
        {
            "instruction": "Interpret the Russian and choose the correct answer.",
            "prompt": "Мы съели половину пиццы. Какая часть осталась?",
            "audio": "Мы съели половину пиццы. Какая часть осталась?",
            "meaning": "We ate half the pizza. What fraction remains?",
            "choices": [
                "1/2",
                "1/4",
                "3/4"
            ],
            "correct": 0,
            "model": "1/2"
        },
        {
            "instruction": "Interpret the Russian and choose the correct answer.",
            "prompt": "Из десяти заданий выполнено семь. Какая часть выполнена?",
            "audio": "Из десяти заданий выполнено семь. Какая часть выполнена?",
            "meaning": "Seven of ten tasks are completed. What fraction is completed?",
            "choices": [
                "7/100",
                "7/10",
                "3/10"
            ],
            "correct": 1,
            "model": "7/10"
        },
        {
            "instruction": "Interpret the Russian and choose the correct answer.",
            "prompt": "В бутылке литр воды. Выпили одну четвёртую. Какая часть осталась?",
            "audio": "В бутылке литр воды. Выпили одну четвёртую. Какая часть осталась?",
            "meaning": "A bottle contains a liter of water. One quarter was drunk. What fraction remains?",
            "choices": [
                "1/4",
                "1/2",
                "3/4"
            ],
            "correct": 2,
            "model": "3/4"
        },
        {
            "instruction": "Interpret the Russian and choose the correct answer.",
            "prompt": "Две пятых от пятидесяти деталей.",
            "audio": "Две пятых от пятидесяти деталей.",
            "meaning": "Two fifths of fifty parts.",
            "choices": [
                "двадцать",
                "десять",
                "тридцать"
            ],
            "correct": 0,
            "model": "двадцать"
        },
        {
            "instruction": "Interpret the Russian and choose the correct answer.",
            "prompt": "Из восьмидесяти мест заняты три четвёртых. Сколько мест занято?",
            "audio": "Из восьмидесяти мест заняты три четвёртых. Сколько мест занято?",
            "meaning": "Three quarters of eighty seats are occupied. How many seats are occupied?",
            "choices": [
                "сорок",
                "шестьдесят",
                "двадцать"
            ],
            "correct": 1,
            "model": "шестьдесят"
        }
    ];
    const get = (id) => document.getElementById(id);
    const root = get("reactor-fractions");
    const key = "numbers-reactor-fractions-v1";
    let counts = [0, 0];
    try {
        const stored = JSON.parse(localStorage.getItem(key) || "0");
        counts = Array.isArray(stored) ? [0, 1].map(i => Math.max(0, Math.min(10, Math.floor(Number(stored[i]) || 0)))) : [Math.min(10, Math.max(0, Number(stored) || 0)), Math.min(10, Math.max(0, (Number(stored) || 0) - 10))];
    } catch (error) {
        console.warn("Fractions progress unavailable", error);
    }
    let activeSet = 0;
    let index = Math.min(counts[0], 9);
    let solved = counts[0] === 10;
    let stage = 0;
    const units = ["две", " тре́", "ть", "их"];
    function speak(text, rate = 1) {
        if (!window.speechSynthesis || !window.SpeechSynthesisUtterance) {
            get("fra-feedback").textContent = "Russian audio is unavailable. Use Help to continue.";
            return;
        }
        speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text.replace(/\u0301/g, ""));
        utterance.lang = "ru-RU";
        utterance.rate = rate;
        const voice = speechSynthesis.getVoices().find((item) => item.lang.toLowerCase().startsWith("ru"));
        if (voice) {
            utterance.voice = voice;
        }
        speechSynthesis.speak(utterance);
    }
    function save() {
        try {
            localStorage.setItem(key, JSON.stringify(counts));
        } catch (error) {
            console.warn("Fractions progress could not be saved", error);
        }
    }
    function energy() {
        root.querySelectorAll("[data-fra-wheel]").forEach((wheel) => {
            const set = Number(wheel.dataset.fraWheel) - 1;
            wheel.hidden = set !== activeSet;
            wheel.classList.toggle("is-complete", counts[set] === 10);
            wheel.querySelectorAll("[data-fra-cell]").forEach((cell) => {
                cell.classList.toggle("is-lit", Number(cell.dataset.fraCell) <= counts[set]);
            });
        });
        const complete = counts.every(count => count === 10);
        document.querySelector(".reactor-nodule--fractions").classList.toggle("is-energized", complete);
        updateQuantumReactorIllumination();
        document.querySelector(".reactor-fractions").setAttribute("aria-label", complete ? "Fractions — fully energized" : "Fractions");
    }
    function renderVocabulary() {
        const step = index % 10 + 1;
        const panel = root.querySelector(".fra-vocab-scroll");
        let newest = null;
        panel.querySelectorAll("[data-vocab-set]").forEach((entry) => {
            const sameSet = Number(entry.dataset.vocabSet) === activeSet + 1;
            const introduced = Number(entry.dataset.vocabStep);
            const visible = sameSet && introduced <= step;
            entry.hidden = !visible;
            entry.classList.toggle("is-new", visible && introduced === step);
            if (visible && introduced === step && !newest) {
                newest = entry;
            }
        });
        requestAnimationFrame(() => {
            if (newest && panel.clientHeight) {
                panel.scrollTop = newest.offsetTop;
            } else if (panel.clientHeight) {
                panel.scrollTop = panel.scrollHeight;
            }
        });
    }
    function renderMathSupport() {
        const support = get("fra-math-support");
        const button = get("fra-math-help");
        let available = false;
        support.querySelectorAll("[data-math-index]").forEach((entry) => {
            const current = Number(entry.dataset.mathIndex) === index;
            entry.hidden = !current;
            entry.querySelector(".reactor-math-hint").hidden = true;
            available = available || current;
        });
        support.hidden = !available;
        button.setAttribute("aria-expanded", "false");
        button.textContent = ([0, 1, 2, 3, 4, 5, 6, 7, 8, 9].includes(index) ? "Help — Understand It" : "Help — Solve It");
    }
    get("fra-math-help").addEventListener("click", () => {
        const entry = get("fra-math-support").querySelector("[data-math-index]:not([hidden])");
        if (!entry) {
            return;
        }
        const hint = entry.querySelector(".reactor-math-hint");
        hint.hidden = !hint.hidden;
        const button = get("fra-math-help");
        button.setAttribute("aria-expanded", String(!hint.hidden));
        button.textContent = hint.hidden ? ([0, 1, 2, 3, 4, 5, 6, 7, 8, 9].includes(index) ? "Help — Understand It" : "Help — Solve It") : "Close Math Help";
    });
    function render() {
        renderVocabulary();
        const question = questions[index];
        get("fra-title").textContent = `${activeSet === 0 ? "Foundational Understanding" : "Applied Understanding"} · ${index % 10 + 1}/10`;
        get("fra-instruction").textContent = question.instruction;
        get("fra-prompt").textContent = question.prompt;
        get("fra-meaning").textContent = question.meaning + " — " + question.audio;
        get("fra-meaning").hidden = true;
        renderMathSupport();
        get("fra-feedback").textContent = "";
        root.querySelectorAll("[data-fra-choice]").forEach((button) => {
            button.textContent = question.choices[Number(button.dataset.fraChoice)];
            button.disabled = solved;
        });
        root.querySelectorAll("[data-fra-set]").forEach((button) => {
            button.setAttribute("aria-pressed", String(Number(button.dataset.fraSet) === activeSet + 1));
        });
        get("fra-reset").textContent = `Restart Set ${activeSet + 1}`;
        get("fra-switch").textContent = `Go to Set ${2 - activeSet}`;
        get("fra-next").hidden = true;
        get("fra-model").hidden = !solved;
        energy();
    }
    function selectSet(set) {
        activeSet = set;
        index = set * 10 + Math.min(counts[set], 9);
        solved = counts[set] === 10;
        get("fra-guide").hidden = true;
        get("fra-exercises").hidden = false;
        render();
    }
    root.querySelectorAll("[data-fra-set]").forEach((button) => {
        button.addEventListener("click", () => selectSet(Number(button.dataset.fraSet) - 1));
    });
    get("fra-switch").addEventListener("click", () => selectSet(1 - activeSet));
    root.querySelectorAll("[data-fra-choice]").forEach((button) => {
        button.addEventListener("click", () => {
            if (solved) {
                return;
            }
            if (Number(button.dataset.fraChoice) !== questions[index].correct) {
                get("fra-feedback").textContent = "Попробуйте ещё раз.";
                return;
            }
            solved = true;
            counts[activeSet] = index % 10 + 1;
            save();
            energy();
            root.querySelectorAll("[data-fra-choice]").forEach((choice) => {
                choice.disabled = true;
            });
            get("fra-model").hidden = false;
            get("fra-feedback").textContent = "Верно!";
            get("fra-next").hidden = counts[activeSet] === 10;
            get("fra-next").textContent = "Next exercise →";
            speak(questions[index].model);
        });
    });
    get("fra-next").addEventListener("click", () => selectSet(activeSet));
    get("fra-reset").addEventListener("click", () => {
        if (!window.confirm(`Restart Set ${activeSet + 1}?`)) {
            return;
        }
        counts[activeSet] = 0;
        save();
        selectSet(activeSet);
    });
    get("fra-listen").addEventListener("click", () => speak(questions[index].audio));
    get("fra-slow").addEventListener("click", () => speak(questions[index].audio, 0.55));
    get("fra-model").addEventListener("click", () => speak(questions[index].model));
    get("fra-help").addEventListener("click", () => {
        get("fra-meaning").hidden = !get("fra-meaning").hidden;
    });
    root.querySelectorAll("[data-fra-say]").forEach((button) => {
        button.addEventListener("click", () => speak(button.dataset.fraSay));
    });
    function chain() {
        return units.slice(3 - stage).join("").trim();
    }
    function guide(audio = true) {
        get("fra-stage").textContent = `Stage ${stage + 1} of 4`;
        get("fra-full-word").querySelectorAll("span").forEach((span, i) => {
            span.classList.toggle("active-unit", i >= 3 - stage);
        });
        get("fra-guide").querySelectorAll(".zero-units span").forEach((span, i) => {
            span.textContent = i >= 3 - stage ? units[i] : "··";
            span.classList.toggle("new-unit", i >= 3 - stage);
        });
        get("fra-prev").disabled = stage === 0;
        get("fra-add").disabled = stage === 3;
        if (audio) {
            speak(chain());
        }
    }
    get("fra-guide-open").addEventListener("click", () => {
        get("fra-exercises").hidden = true;
        get("fra-guide").hidden = false;
        stage = 0;
        guide();
    });
    get("fra-guide-back").addEventListener("click", () => {
        window.speechSynthesis?.cancel();
        get("fra-guide").hidden = true;
        get("fra-exercises").hidden = false;
    });
    get("fra-prev").addEventListener("click", () => {
        stage = Math.max(0, stage - 1);
        guide();
    });
    get("fra-add").addEventListener("click", () => {
        stage = Math.min(3, stage + 1);
        guide();
    });
    root.querySelectorAll("[data-fra-rate]").forEach((button) => {
        button.addEventListener("click", () => speak(chain(), Number(button.dataset.fraRate)));
    });
    root.querySelector(".reactor-return").addEventListener("click", () => window.speechSynthesis?.cancel());
    render();
})();


// Percentages — persistent two-stage energy activation.
(() => {
    const questions = [
        {
            "instruction": "Choose the matching percentage.",
            "prompt": "Один процент.",
            "audio": "Один процент.",
            "meaning": "One percent.",
            "choices": [
                "1%",
                "10%",
                "11%"
            ],
            "correct": 0,
            "model": "1%"
        },
        {
            "instruction": "Choose the matching percentage.",
            "prompt": "Два процента.",
            "audio": "Два процента.",
            "meaning": "Two percent.",
            "choices": [
                "20%",
                "2%",
                "12%"
            ],
            "correct": 1,
            "model": "2%"
        },
        {
            "instruction": "Choose the matching percentage.",
            "prompt": "Пять процентов.",
            "audio": "Пять процентов.",
            "meaning": "Five percent.",
            "choices": [
                "15%",
                "50%",
                "5%"
            ],
            "correct": 2,
            "model": "5%"
        },
        {
            "instruction": "Choose the matching percentage.",
            "prompt": "Одиннадцать процентов.",
            "audio": "Одиннадцать процентов.",
            "meaning": "Eleven percent.",
            "choices": [
                "11%",
                "1%",
                "21%"
            ],
            "correct": 0,
            "model": "11%"
        },
        {
            "instruction": "Choose the matching percentage.",
            "prompt": "Двадцать один процент.",
            "audio": "Двадцать один процент.",
            "meaning": "Twenty-one percent.",
            "choices": [
                "20%",
                "21%",
                "12%"
            ],
            "correct": 1,
            "model": "21%"
        },
        {
            "instruction": "Choose the matching percentage.",
            "prompt": "Двадцать четыре процента.",
            "audio": "Двадцать четыре процента.",
            "meaning": "Twenty-four percent.",
            "choices": [
                "42%",
                "14%",
                "24%"
            ],
            "correct": 2,
            "model": "24%"
        },
        {
            "instruction": "Choose the matching percentage.",
            "prompt": "Пятьдесят процентов.",
            "audio": "Пятьдесят процентов.",
            "meaning": "Fifty percent.",
            "choices": [
                "50%",
                "15%",
                "5%"
            ],
            "correct": 0,
            "model": "50%"
        },
        {
            "instruction": "Choose the matching percentage.",
            "prompt": "Семьдесят пять процентов.",
            "audio": "Семьдесят пять процентов.",
            "meaning": "Seventy-five percent.",
            "choices": [
                "70%",
                "75%",
                "57%"
            ],
            "correct": 1,
            "model": "75%"
        },
        {
            "instruction": "Choose the matching percentage.",
            "prompt": "Девяносто процентов.",
            "audio": "Девяносто процентов.",
            "meaning": "Ninety percent.",
            "choices": [
                "19%",
                "9%",
                "90%"
            ],
            "correct": 2,
            "model": "90%"
        },
        {
            "instruction": "Choose the matching percentage.",
            "prompt": "Сто процентов.",
            "audio": "Сто процентов.",
            "meaning": "One hundred percent.",
            "choices": [
                "100%",
                "10%",
                "1%"
            ],
            "correct": 0,
            "model": "100%"
        },
        {
            "instruction": "Interpret the Russian and choose the correct answer.",
            "prompt": "Десять процентов от двухсот рублей.",
            "audio": "Десять процентов от двухсот рублей.",
            "meaning": "Ten percent of 200 rubles.",
            "choices": [
                "сто рублей",
                "двадцать рублей",
                "десять рублей"
            ],
            "correct": 1,
            "model": "двадцать рублей"
        },
        {
            "instruction": "Interpret the Russian and choose the correct answer.",
            "prompt": "Половина — это сколько процентов?",
            "audio": "Половина — это сколько процентов?",
            "meaning": "Half is what percentage?",
            "choices": [
                "25%",
                "10%",
                "50%"
            ],
            "correct": 2,
            "model": "50%"
        },
        {
            "instruction": "Interpret the Russian and choose the correct answer.",
            "prompt": "Четверть — это сколько процентов?",
            "audio": "Четверть — это сколько процентов?",
            "meaning": "A quarter is what percentage?",
            "choices": [
                "25%",
                "50%",
                "75%"
            ],
            "correct": 0,
            "model": "25%"
        },
        {
            "instruction": "Interpret the Russian and choose the correct answer.",
            "prompt": "Цена сто рублей. Скидка двадцать процентов. Какова новая цена?",
            "audio": "Цена сто рублей. Скидка двадцать процентов. Какова новая цена?",
            "meaning": "Price is 100 rubles. Discount is 20%. What is the new price?",
            "choices": [
                "сто двадцать рублей",
                "восемьдесят рублей",
                "двадцать рублей"
            ],
            "correct": 1,
            "model": "восемьдесят рублей"
        },
        {
            "instruction": "Interpret the Russian and choose the correct answer.",
            "prompt": "Цена двести рублей. Она выросла на десять процентов.",
            "audio": "Цена двести рублей. Она выросла на десять процентов.",
            "meaning": "Price is 200 rubles. It increased by 10%.",
            "choices": [
                "сто восемьдесят рублей",
                "двести десять рублей",
                "двести двадцать рублей"
            ],
            "correct": 2,
            "model": "двести двадцать рублей"
        },
        {
            "instruction": "Interpret the Russian and choose the correct answer.",
            "prompt": "Из ста учеников восемьдесят сдали экзамен. Какой процент сдал экзамен?",
            "audio": "Из ста учеников восемьдесят сдали экзамен. Какой процент сдал экзамен?",
            "meaning": "Eighty out of 100 students passed the exam. What percentage passed?",
            "choices": [
                "80%",
                "20%",
                "8%"
            ],
            "correct": 0,
            "model": "80%"
        },
        {
            "instruction": "Interpret the Russian and choose the correct answer.",
            "prompt": "Батарея заряжена на семьдесят процентов. Сколько процентов не хватает до ста?",
            "audio": "Батарея заряжена на семьдесят процентов. Сколько процентов не хватает до ста?",
            "meaning": "Battery is charged to 70%. How many percentage points remain to 100%?",
            "choices": [
                "20%",
                "30%",
                "70%"
            ],
            "correct": 1,
            "model": "30%"
        },
        {
            "instruction": "Interpret the Russian and choose the correct answer.",
            "prompt": "В магазине скидка пятьдесят процентов на товар за шестьсот рублей. Сколько стоит товар со скидкой?",
            "audio": "В магазине скидка пятьдесят процентов на товар за шестьсот рублей. Сколько стоит товар со скидкой?",
            "meaning": "A shop offers 50% off an item priced at 600 rubles. What is the sale price?",
            "choices": [
                "пятьсот рублей",
                "сто рублей",
                "триста рублей"
            ],
            "correct": 2,
            "model": "триста рублей"
        },
        {
            "instruction": "Interpret the Russian and choose the correct answer.",
            "prompt": "Двадцать пять процентов от восьмидесяти мест свободны. Сколько свободных мест?",
            "audio": "Двадцать пять процентов от восьмидесяти мест свободны. Сколько свободных мест?",
            "meaning": "25% of 80 seats are free. How many free seats?",
            "choices": [
                "двадцать",
                "сорок",
                "шестьдесят"
            ],
            "correct": 0,
            "model": "двадцать"
        },
        {
            "instruction": "Interpret the Russian and choose the correct answer.",
            "prompt": "Из четырёхсот деталей пять процентов бракованные. Сколько бракованных деталей?",
            "audio": "Из четырёхсот деталей пять процентов бракованные. Сколько бракованных деталей?",
            "meaning": "Five percent of 400 parts are defective. How many defective parts?",
            "choices": [
                "пять",
                "двадцать",
                "сорок"
            ],
            "correct": 1,
            "model": "двадцать"
        }
    ];
    const get = (id) => document.getElementById(id);
    const root = get("reactor-percentages");
    const key = "numbers-reactor-percentages-v1";
    let counts = [0, 0];
    try {
        const stored = JSON.parse(localStorage.getItem(key) || "0");
        counts = Array.isArray(stored) ? [0, 1].map(i => Math.max(0, Math.min(10, Math.floor(Number(stored[i]) || 0)))) : [Math.min(10, Math.max(0, Number(stored) || 0)), Math.min(10, Math.max(0, (Number(stored) || 0) - 10))];
    } catch (error) {
        console.warn("Percentages progress unavailable", error);
    }
    let activeSet = 0;
    let index = Math.min(counts[0], 9);
    let solved = counts[0] === 10;
    let stage = 0;
    const units = ["про", "це́н", "т", "ов"];
    function speak(text, rate = 1) {
        if (!window.speechSynthesis || !window.SpeechSynthesisUtterance) {
            get("pct-feedback").textContent = "Russian audio is unavailable. Use Help to continue.";
            return;
        }
        speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text.replace(/\u0301/g, ""));
        utterance.lang = "ru-RU";
        utterance.rate = rate;
        const voice = speechSynthesis.getVoices().find((item) => item.lang.toLowerCase().startsWith("ru"));
        if (voice) {
            utterance.voice = voice;
        }
        speechSynthesis.speak(utterance);
    }
    function save() {
        try {
            localStorage.setItem(key, JSON.stringify(counts));
        } catch (error) {
            console.warn("Percentages progress could not be saved", error);
        }
    }
    function energy() {
        root.querySelectorAll("[data-pct-wheel]").forEach((wheel) => {
            const set = Number(wheel.dataset.pctWheel) - 1;
            wheel.hidden = set !== activeSet;
            wheel.classList.toggle("is-complete", counts[set] === 10);
            wheel.querySelectorAll("[data-pct-cell]").forEach((cell) => {
                cell.classList.toggle("is-lit", Number(cell.dataset.pctCell) <= counts[set]);
            });
        });
        const complete = counts.every(count => count === 10);
        document.querySelector(".reactor-nodule--percent").classList.toggle("is-energized", complete);
        updateQuantumReactorIllumination();
        document.querySelector(".reactor-percent").setAttribute("aria-label", complete ? "Percentages — fully energized" : "Percentages");
    }
    function renderVocabulary() {
        const step = index % 10 + 1;
        const panel = root.querySelector(".pct-vocab-scroll");
        let newest = null;
        panel.querySelectorAll("[data-vocab-set]").forEach((entry) => {
            const sameSet = Number(entry.dataset.vocabSet) === activeSet + 1;
            const introduced = Number(entry.dataset.vocabStep);
            const visible = sameSet && introduced <= step;
            entry.hidden = !visible;
            entry.classList.toggle("is-new", visible && introduced === step);
            if (visible && introduced === step && !newest) {
                newest = entry;
            }
        });
        requestAnimationFrame(() => {
            if (newest && panel.clientHeight) {
                panel.scrollTop = newest.offsetTop;
            } else if (panel.clientHeight) {
                panel.scrollTop = panel.scrollHeight;
            }
        });
    }
    function renderMathSupport() {
        const support = get("pct-math-support");
        const button = get("pct-math-help");
        let available = false;
        support.querySelectorAll("[data-math-index]").forEach((entry) => {
            const current = Number(entry.dataset.mathIndex) === index;
            entry.hidden = !current;
            entry.querySelector(".reactor-math-hint").hidden = true;
            available = available || current;
        });
        support.hidden = !available;
        button.setAttribute("aria-expanded", "false");
        button.textContent = ([0, 1, 2, 3, 4, 5, 6, 7, 8, 9].includes(index) ? "Help — Understand It" : "Help — Solve It");
    }
    get("pct-math-help").addEventListener("click", () => {
        const entry = get("pct-math-support").querySelector("[data-math-index]:not([hidden])");
        if (!entry) {
            return;
        }
        const hint = entry.querySelector(".reactor-math-hint");
        hint.hidden = !hint.hidden;
        const button = get("pct-math-help");
        button.setAttribute("aria-expanded", String(!hint.hidden));
        button.textContent = hint.hidden ? ([0, 1, 2, 3, 4, 5, 6, 7, 8, 9].includes(index) ? "Help — Understand It" : "Help — Solve It") : "Close Math Help";
    });
    function render() {
        renderVocabulary();
        const question = questions[index];
        get("pct-title").textContent = `${activeSet === 0 ? "Foundational Understanding" : "Applied Understanding"} · ${index % 10 + 1}/10`;
        get("pct-instruction").textContent = question.instruction;
        get("pct-prompt").textContent = question.prompt;
        get("pct-meaning").textContent = question.meaning + " — " + question.audio;
        get("pct-meaning").hidden = true;
        renderMathSupport();
        get("pct-feedback").textContent = "";
        root.querySelectorAll("[data-pct-choice]").forEach((button) => {
            button.textContent = question.choices[Number(button.dataset.pctChoice)];
            button.disabled = solved;
        });
        root.querySelectorAll("[data-pct-set]").forEach((button) => {
            button.setAttribute("aria-pressed", String(Number(button.dataset.pctSet) === activeSet + 1));
        });
        get("pct-reset").textContent = `Restart Set ${activeSet + 1}`;
        get("pct-switch").textContent = `Go to Set ${2 - activeSet}`;
        get("pct-next").hidden = true;
        get("pct-model").hidden = !solved;
        energy();
    }
    function selectSet(set) {
        activeSet = set;
        index = set * 10 + Math.min(counts[set], 9);
        solved = counts[set] === 10;
        get("pct-guide").hidden = true;
        get("pct-exercises").hidden = false;
        render();
    }
    root.querySelectorAll("[data-pct-set]").forEach((button) => {
        button.addEventListener("click", () => selectSet(Number(button.dataset.pctSet) - 1));
    });
    get("pct-switch").addEventListener("click", () => selectSet(1 - activeSet));
    root.querySelectorAll("[data-pct-choice]").forEach((button) => {
        button.addEventListener("click", () => {
            if (solved) {
                return;
            }
            if (Number(button.dataset.pctChoice) !== questions[index].correct) {
                get("pct-feedback").textContent = "Попробуйте ещё раз.";
                return;
            }
            solved = true;
            counts[activeSet] = index % 10 + 1;
            save();
            energy();
            root.querySelectorAll("[data-pct-choice]").forEach((choice) => {
                choice.disabled = true;
            });
            get("pct-model").hidden = false;
            get("pct-feedback").textContent = "Верно!";
            get("pct-next").hidden = counts[activeSet] === 10;
            get("pct-next").textContent = "Next exercise →";
            speak(questions[index].model);
        });
    });
    get("pct-next").addEventListener("click", () => selectSet(activeSet));
    get("pct-reset").addEventListener("click", () => {
        if (!window.confirm(`Restart Set ${activeSet + 1}?`)) {
            return;
        }
        counts[activeSet] = 0;
        save();
        selectSet(activeSet);
    });
    get("pct-listen").addEventListener("click", () => speak(questions[index].audio));
    get("pct-slow").addEventListener("click", () => speak(questions[index].audio, 0.55));
    get("pct-model").addEventListener("click", () => speak(questions[index].model));
    get("pct-help").addEventListener("click", () => {
        get("pct-meaning").hidden = !get("pct-meaning").hidden;
    });
    root.querySelectorAll("[data-pct-say]").forEach((button) => {
        button.addEventListener("click", () => speak(button.dataset.pctSay));
    });
    function chain() {
        return units.slice(3 - stage).join("").trim();
    }
    function guide(audio = true) {
        get("pct-stage").textContent = `Stage ${stage + 1} of 4`;
        get("pct-full-word").querySelectorAll("span").forEach((span, i) => {
            span.classList.toggle("active-unit", i >= 3 - stage);
        });
        get("pct-guide").querySelectorAll(".zero-units span").forEach((span, i) => {
            span.textContent = i >= 3 - stage ? units[i] : "··";
            span.classList.toggle("new-unit", i >= 3 - stage);
        });
        get("pct-prev").disabled = stage === 0;
        get("pct-add").disabled = stage === 3;
        if (audio) {
            speak(chain());
        }
    }
    get("pct-guide-open").addEventListener("click", () => {
        get("pct-exercises").hidden = true;
        get("pct-guide").hidden = false;
        stage = 0;
        guide();
    });
    get("pct-guide-back").addEventListener("click", () => {
        window.speechSynthesis?.cancel();
        get("pct-guide").hidden = true;
        get("pct-exercises").hidden = false;
    });
    get("pct-prev").addEventListener("click", () => {
        stage = Math.max(0, stage - 1);
        guide();
    });
    get("pct-add").addEventListener("click", () => {
        stage = Math.min(3, stage + 1);
        guide();
    });
    root.querySelectorAll("[data-pct-rate]").forEach((button) => {
        button.addEventListener("click", () => speak(chain(), Number(button.dataset.pctRate)));
    });
    root.querySelector(".reactor-return").addEventListener("click", () => window.speechSynthesis?.cancel());
    render();
})();

// Also synchronize after all four operator initializers and on class changes.
(() => {
    const scene = document.getElementById("reactor-landing");
    const observer = new MutationObserver(updateQuantumReactorIllumination);
    scene.querySelectorAll(".reactor-nodule").forEach((nodule) => {
        observer.observe(nodule, { attributes: true, attributeFilter: ["class"] });
    });
    updateQuantumReactorIllumination();
})();
