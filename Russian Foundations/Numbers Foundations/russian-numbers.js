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
