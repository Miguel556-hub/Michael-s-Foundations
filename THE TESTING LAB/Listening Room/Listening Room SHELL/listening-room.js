"use strict";

// ==================================================
// MICHAEL'S FOUNDATIONS
// LISTENING ROOM — PORTABLE COMPONENT SHELL
// ==================================================
//
// The shell owns:
// - Landing / entry behavior
// - Listening moves
// - Audio controls
// - Catch / meaning / infer / respond flow
// - Progressive support
// - Reset / restart behavior
// - Accessibility-focused focus movement
//
// A Foundation supplies its own encounter content.
// The demo encounter below exists only so the shell can
// be opened and tested without another Foundation.
// ==================================================


// ==================================================
// FOUNDATION-SPECIFIC CONTENT SLOT
// Replace this demo content when adapting the shell.
// ==================================================

const listeningEncounters = [
  {
    title: "Shell Test Encounter",

    // Replace with Foundation-specific spoken language.
    primary: "Это пример.",

    // At least one variation is recommended for INFER.
    variations: [
      "Это другой пример."
    ],

    catchWords: [
      "это",
      "пример"
    ],

    meaningQuestion:
      "What is the purpose of this encounter?",

    meaningChoices: [
      "To verify that the reusable Listening Room shell works.",
      "To test a Foundation-specific lesson.",
      "To complete a vocabulary examination."
    ],

    meaningAnswer: 0,

    inferQuestion:
      "What changed in the variation?",

    inferChoices: [
      "The example changed.",
      "Nothing changed.",
      "A new person was introduced."
    ],

    inferAnswer: 0,

    respondQuestion:
      "What should happen after the shell is verified?",

    respondChoices: [
      "Supply Foundation-specific listening content.",
      "Delete the Listening Room architecture.",
      "Hard-code the shell into every Foundation."
    ],

    respondAnswer: 0,

    support:
      "This is only a shell test. Listen for the short familiar words and use the meaning of the interface to continue."
  }
];

// END Foundation-Specific Content Slot


// ==================================================
// LISTENING ROOM REUSABLE STATE
// ==================================================

const state = {
  encounterIndex: 0,
  moveIndex: 0,
  hasListened: false,
  selectedCatchWords: new Set(),
  currentVariationIndex: 0
};

const moves = [
  "HEAR",
  "CATCH",
  "LISTEN AGAIN",
  "BUILD MEANING",
  "INFER",
  "RESPOND"
];

const elements = {
  landing: document.getElementById("listeningLanding"),
  experience: document.getElementById("listeningExperience"),
  completion: document.getElementById("listeningCompletion"),

  enterButton: document.getElementById("enterListeningRoom"),

  encounterTitle: document.getElementById("encounterTitle"),
  encounterProgress: document.getElementById("encounterProgress"),

  move: document.getElementById("listeningMove"),
  prompt: document.getElementById("listeningPrompt"),
  purpose: document.getElementById("listeningPurpose"),

  listenButton: document.getElementById("listenButton"),
  slowerButton: document.getElementById("slowerButton"),
  audioStatus: document.getElementById("audioStatus"),

  catchPanel: document.getElementById("catchPanel"),
  catchGrid: document.getElementById("catchGrid"),
  catchContinueButton: document.getElementById("catchContinueButton"),

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
  revealTranscriptButton: document.getElementById("revealTranscriptButton"),
  transcriptText: document.getElementById("transcriptText"),

  nextMoveButton: document.getElementById("nextMoveButton"),
  nextEncounterButton: document.getElementById("nextEncounterButton"),
  resetButton: document.getElementById("resetButton"),
  restartButton: document.getElementById("restartButton")
};

// END Listening Room Reusable State


// ==================================================
// CONTENT HELPERS
// ==================================================

function getEncounter() {
  return listeningEncounters[state.encounterIndex];
}


// ==================================================
// PANEL RESET
// ==================================================

function resetPanels() {

  [
    elements.catchPanel,
    elements.meaningPanel,
    elements.inferPanel,
    elements.respondPanel,
    elements.supportPanel
  ].forEach((panel) => {
    panel.hidden = true;
  });

  elements.transcriptText.hidden = true;
  elements.transcriptText.textContent = "";

  elements.meaningFeedback.textContent = "";
  elements.meaningFeedback.className = "listening-room__feedback";

  elements.inferFeedback.textContent = "";
  elements.inferFeedback.className = "listening-room__feedback";

  elements.respondFeedback.textContent = "";
  elements.respondFeedback.className = "listening-room__feedback";

  elements.nextMoveButton.hidden = true;
  elements.nextEncounterButton.hidden = true;
}


// ==================================================
// ENCOUNTER RENDERING
// ==================================================

function renderEncounter() {

  const encounter = getEncounter();

  state.moveIndex = 0;
  state.hasListened = false;
  state.selectedCatchWords.clear();
  state.currentVariationIndex = 0;

  resetPanels();

  elements.encounterTitle.textContent = encounter.title;

  elements.encounterProgress.textContent =
    `Encounter ${state.encounterIndex + 1} of ${listeningEncounters.length}`;

  elements.slowerButton.hidden = true;
  elements.supportButton.hidden = true;
  elements.audioStatus.textContent = "Ready when you are.";

  renderMove();
}


// ==================================================
// LISTENING MOVES
// ==================================================

function renderMove() {

  const encounter = getEncounter();
  const move = moves[state.moveIndex];

  resetPanels();

  elements.move.textContent = move;
  elements.slowerButton.hidden = state.moveIndex === 0;

  const moveCopy = {

    "HEAR": {
      prompt:
        "Listen once. Do not try to catch every word.",
      purpose:
        "First, listen for the overall shape of the message. The spoken language stays hidden."
    },

    "CATCH": {
      prompt:
        "What did you catch?",
      purpose:
        "Notice language that already belongs to you. Partial understanding counts."
    },

    "LISTEN AGAIN": {
      prompt:
        "Listen again — this time with a purpose.",
      purpose:
        "Return to the same message and listen for one useful relationship."
    },

    "BUILD MEANING": {
      prompt:
        "Build the meaning from what you heard.",
      purpose:
        "Use the pieces you caught. You do not need a word-for-word translation."
    },

    "INFER": {
      prompt:
        "Now the language changes.",
      purpose:
        "Listen to a natural variation and decide what changed in the meaning."
    },

    "RESPOND": {
      prompt:
        "Respond to what you understood.",
      purpose:
        "Use the meaning you built to make a decision or choose an appropriate response."
    }
  };

  elements.prompt.textContent = moveCopy[move].prompt;
  elements.purpose.textContent = moveCopy[move].purpose;


  if (move === "HEAR") {
    elements.supportButton.hidden = true;
  }


  if (move === "CATCH") {
    renderCatchPanel(encounter);
  }


  if (move === "LISTEN AGAIN") {
    elements.supportButton.hidden = false;
    elements.nextMoveButton.hidden = false;

    elements.audioStatus.textContent =
      "Listen again for one specific relationship.";
  }


  if (move === "BUILD MEANING") {
    renderChoicePanel("meaning", encounter);
    elements.supportButton.hidden = false;
  }


  if (move === "INFER") {

    state.currentVariationIndex =
      Math.min(
        state.encounterIndex % encounter.variations.length,
        encounter.variations.length - 1
      );

    renderChoicePanel("infer", encounter);

    elements.supportButton.hidden = false;

    elements.audioStatus.textContent =
      "Listen to the variation. Something meaningful has changed.";
  }


  if (move === "RESPOND") {
    renderChoicePanel("respond", encounter);
    elements.supportButton.hidden = false;
  }
}


// ==================================================
// CATCH PANEL
// ==================================================

function renderCatchPanel(encounter) {

  elements.catchPanel.hidden = false;
  elements.catchGrid.innerHTML = "";

  encounter.catchWords.forEach((word) => {

    const button = document.createElement("button");

    button.type = "button";
    button.className = "listening-room__catch-chip";
    button.textContent = word;
    button.setAttribute("aria-pressed", "false");

    button.addEventListener("click", () => {

      const selected =
        button.getAttribute("aria-pressed") === "true";

      button.setAttribute(
        "aria-pressed",
        String(!selected)
      );

      if (selected) {
        state.selectedCatchWords.delete(word);
      } else {
        state.selectedCatchWords.add(word);
      }

    });

    elements.catchGrid.appendChild(button);
  });
}


// ==================================================
// CHOICE PANELS
// ==================================================

function renderChoicePanel(type, encounter) {

  const config = {

    meaning: {
      panel: elements.meaningPanel,
      question: elements.meaningQuestion,
      choices: elements.meaningChoices,
      feedback: elements.meaningFeedback,
      prompt: encounter.meaningQuestion,
      options: encounter.meaningChoices,
      answer: encounter.meaningAnswer
    },

    infer: {
      panel: elements.inferPanel,
      question: elements.inferQuestion,
      choices: elements.inferChoices,
      feedback: elements.inferFeedback,
      prompt: encounter.inferQuestion,
      options: encounter.inferChoices,
      answer: encounter.inferAnswer
    },

    respond: {
      panel: elements.respondPanel,
      question: elements.respondQuestion,
      choices: elements.respondChoices,
      feedback: elements.respondFeedback,
      prompt: encounter.respondQuestion,
      options: encounter.respondChoices,
      answer: encounter.respondAnswer
    }

  }[type];

  config.panel.hidden = false;
  config.question.textContent = config.prompt;
  config.choices.innerHTML = "";

  config.options.forEach((option, index) => {

    const button = document.createElement("button");

    button.type = "button";
    button.className = "listening-room__choice";
    button.textContent = option;

    button.addEventListener("click", () => {

      if (index === config.answer) {

        config.feedback.textContent =
          type === "respond"
            ? "That response fits what you understood."
            : "Yes. You followed the meaning, not just the words.";

        config.feedback.className =
          "listening-room__feedback listening-room__feedback--success";

        if (type === "respond") {
          elements.nextEncounterButton.hidden = false;
        } else {
          elements.nextMoveButton.hidden = false;
        }

      } else {

        config.feedback.textContent =
          "Not quite. Listen again for the relationship that matters, then try once more.";

        config.feedback.className =
          "listening-room__feedback listening-room__feedback--try-again";
      }

    });

    config.choices.appendChild(button);
  });
}


// ==================================================
// AUDIO
// ==================================================

function getSpokenText() {

  const encounter = getEncounter();

  if (moves[state.moveIndex] === "INFER") {
    return encounter.variations[state.currentVariationIndex];
  }

  return encounter.primary;
}


function speakCurrentText(rate = 0.9) {

  const text = getSpokenText();

  if (
    !("speechSynthesis" in window) ||
    typeof SpeechSynthesisUtterance === "undefined"
  ) {

    elements.audioStatus.textContent =
      "Speech synthesis is unavailable in this browser. Use transcript support while testing.";

    if (state.moveIndex === 0) {
      elements.nextMoveButton.hidden = false;
    }

    return;
  }

  window.speechSynthesis.cancel();

  const utterance =
    new SpeechSynthesisUtterance(text);

  /*
    SHELL DEFAULT:
    Russian is preserved because this component currently serves
    Russian Foundations. If the Listening Room expands to another
    language, this should become Foundation configuration.
  */
  utterance.lang = "ru-RU";
  utterance.rate = rate;


  utterance.onstart = () => {
    elements.audioStatus.textContent = "Listening...";
  };


  utterance.onend = () => {

    state.hasListened = true;

    elements.audioStatus.textContent =
      "What did you understand?";

    if (state.moveIndex === 0) {
      elements.nextMoveButton.hidden = false;
    }
  };


  utterance.onerror = () => {

    elements.audioStatus.textContent =
      "The browser could not play this voice. Try Listen again or use support.";

    elements.nextMoveButton.hidden = false;
  };


  window.speechSynthesis.speak(utterance);
}


// ==================================================
// PROGRESSIVE SUPPORT
// ==================================================

function showSupport() {

  const encounter = getEncounter();

  elements.supportPanel.hidden = false;
  elements.supportText.textContent = encounter.support;

  elements.supportPanel.scrollIntoView({
    behavior: "smooth",
    block: "nearest"
  });
}


function showTranscript() {

  elements.transcriptText.textContent =
    getSpokenText();

  elements.transcriptText.hidden = false;
}


// ==================================================
// NAVIGATION
// ==================================================

function advanceMove() {

  if (state.moveIndex >= moves.length - 1) {
    return;
  }

  state.moveIndex += 1;
  renderMove();
}


function advanceEncounter() {

  if (
    state.encounterIndex >=
    listeningEncounters.length - 1
  ) {

    elements.experience.hidden = true;
    elements.completion.hidden = false;

    elements.completion.focus();

    return;
  }

  state.encounterIndex += 1;

  renderEncounter();

  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
}


// ==================================================
// RESET / RESTART
// ==================================================

function resetListeningRoom() {

  window.speechSynthesis?.cancel();

  state.encounterIndex = 0;
  state.moveIndex = 0;
  state.hasListened = false;
  state.selectedCatchWords.clear();
  state.currentVariationIndex = 0;

  elements.experience.hidden = true;
  elements.completion.hidden = true;
  elements.landing.hidden = false;

  elements.enterButton.focus();
}


function startListeningRoom() {

  elements.landing.hidden = true;
  elements.completion.hidden = true;
  elements.experience.hidden = false;

  renderEncounter();

  elements.listenButton.focus();
}


// ==================================================
// EVENT WIRING
// ==================================================

elements.enterButton.addEventListener(
  "click",
  startListeningRoom
);

elements.listenButton.addEventListener(
  "click",
  () => speakCurrentText(0.9)
);

elements.slowerButton.addEventListener(
  "click",
  () => speakCurrentText(0.72)
);

elements.catchContinueButton.addEventListener(
  "click",
  () => {

    elements.audioStatus.textContent =
      state.selectedCatchWords.size > 0
        ? `You caught ${state.selectedCatchWords.size} piece${state.selectedCatchWords.size === 1 ? "" : "s"}. That's enough to keep building.`
        : "You do not have to select anything. Listening for partial meaning still counts.";

    elements.nextMoveButton.hidden = false;
  }
);

elements.supportButton.addEventListener(
  "click",
  showSupport
);

elements.revealTranscriptButton.addEventListener(
  "click",
  showTranscript
);

elements.nextMoveButton.addEventListener(
  "click",
  advanceMove
);

elements.nextEncounterButton.addEventListener(
  "click",
  advanceEncounter
);

elements.resetButton.addEventListener(
  "click",
  resetListeningRoom
);

elements.restartButton.addEventListener(
  "click",
  startListeningRoom
);

// END Listening Room Event Wiring
// END LISTENING ROOM — PORTABLE COMPONENT SHELL
