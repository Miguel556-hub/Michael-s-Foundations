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
