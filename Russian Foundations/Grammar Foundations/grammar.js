// ============================================================
// GRAMMAR FOUNDATION — REUSABLE LEARNING SHELL
// Navigation and completion tracking only; no lesson content.
// ============================================================

const foundationSections = [...document.querySelectorAll(".learning-stage")];
const foundationTabs = [...document.querySelectorAll(".stage-tab")];
const foundationRailSections = [...document.querySelectorAll(".journey-rail__section[data-stage]")];
const foundationProgressKey = "michaels-foundations-grammar-progress-v1";

function readFoundationProgress() {
    try {
        return JSON.parse(localStorage.getItem(foundationProgressKey) || "{}");
    } catch (error) {
        return {};
    }
}

function saveFoundationProgress(progress) {
    try {
        localStorage.setItem(foundationProgressKey, JSON.stringify(progress));
    } catch (error) {
        console.warn("Progress could not be saved.", error);
    }
}

function updateFoundationProgress() {
    const counts = {
        learn: { complete: 0, total: 6, id: "lesson-progress-count" },
        build: { complete: 0, total: 2, id: "exercise-progress-count" },
        practice: { complete: 0, total: 6, id: "practice-progress-count" },
        use: { complete: 0, total: 4, id: "use-progress-count" }
    };

    document.querySelectorAll("[data-progress-item]").forEach((section) => {
        const phase = section.dataset.progressItem;
        const checkbox = section.querySelector(".mark-complete");

        if (checkbox && checkbox.checked && counts[phase]) {
            counts[phase].complete += 1;
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

function setFoundationActiveStage(stage) {
    foundationTabs.forEach((tab) => {
        const active = tab.dataset.stage === stage;
        tab.classList.toggle("stage-tab--active", active);
        tab.setAttribute("aria-pressed", String(active));
    });

    foundationRailSections.forEach((section) => {
        section.classList.toggle("journey-rail__section--current", section.dataset.stage === stage);
    });
}

foundationTabs.forEach((tab) => {
    tab.addEventListener("click", () => {
        const stage = tab.dataset.stage;
        document.getElementById(`${stage}-phase`)?.scrollIntoView({ behavior: "smooth" });
        setFoundationActiveStage(stage);
    });
});

const savedFoundationProgress = readFoundationProgress();

document.querySelectorAll(".mark-complete").forEach((checkbox) => {
    checkbox.checked = savedFoundationProgress[checkbox.dataset.completion] === true;

    checkbox.addEventListener("change", () => {
        savedFoundationProgress[checkbox.dataset.completion] = checkbox.checked;
        saveFoundationProgress(savedFoundationProgress);
        updateFoundationProgress();
    });
});

updateFoundationProgress();

if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver((entries) => {
        const visible = entries.filter((entry) => entry.isIntersecting);

        if (visible.length) {
            visible.sort((a, b) => b.intersectionRatio - a.intersectionRatio);
            setFoundationActiveStage(visible[0].target.dataset.stage);
        }
    }, { rootMargin: "-10% 0px -40% 0px", threshold: [0, 0.1, 0.3] });

    foundationSections.forEach((section) => observer.observe(section));
}


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
    // Replace these six objects with Grammar content later.
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
        support: "Grammar listening content will be added here.",
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
            purpose: "This time, listen for color words and important details."
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
