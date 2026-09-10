const encounters = [
  {
    // Encounter 1 — Lesson 1: любить + possessives
    primary: "Я очень люблю мою семью, а моя семья любит меня.",
    variation: "Моя семья любит меня, и я люблю мою семью.",
    catch: ["я", "меня", "моя семья", "мою семью", "любит", "люблю", "родители", "брат", "сестра"],
    meaningQuestion: "Who loves whom?",
    meaningChoices: [
      "I love my family, and my family loves me.",
      "My family loves me, but I do not love my family.",
      "My family loves another family."
    ],
    meaningAnswer: 0,
    inferQuestion: "Did the direction of the love change when the people were mentioned in a different order?",
    inferChoices: ["No.", "Yes.", "The speaker does not say."],
    inferAnswer: 0,
    respondQuestion: "Кого ты любишь?",
    respondChoices: ["Я люблю мою семью.", "Я люблю маму.", "Я люблю папу."],
    respondAnswer: 0,
    support: "Listen for я люблю = \"I love\" and любит меня = \"loves me.\"",
    transcript: "Я очень люблю мою семью, а моя семья любит меня."
  },
  {
    // Encounter 2 — Lesson 2: Сколько? + family size
    primary: "Сколько человек в вашей семье? В моей семье шесть человек.",
    variation: "Сколько человек в вашей семье? Нас в семье шестеро.",
    catch: ["сколько", "человек", "семье", "шесть", "три", "четыре", "пять", "семь", "девять", "десять"],
    meaningQuestion: "How many people are in the speaker's family?",
    meaningChoices: ["Four", "Six", "Seven"],
    meaningAnswer: 1,
    inferQuestion: "What information was the first speaker asking for?",
    inferChoices: ["The size of the family", "Where the family lives", "Who is the oldest"],
    inferAnswer: 0,
    respondQuestion: "Сколько человек в твоей семье?",
    respondChoices: ["один", "два", "три", "четыре", "пять", "шесть", "семь", "восемь", "девять", "десять", "10+"],
    respondAcceptsAny: true,
    support: "Listen for Сколько человек...? Then listen for the number in the response.",
    transcript: "Сколько человек в вашей семье? В моей семье шесть человек."
  },
  {
    // Encounter 3 — Lesson 2: counting siblings
    primary: "У меня есть два брата и одна сестра.",
    variation: "У меня одна сестра и два брата.",
    catch: ["один брат", "два брата", "три брата", "одна сестра", "две сестры", "четыре сестры"],
    meaningQuestion: "Who does the speaker have in the family?",
    meaningChoices: ["Two brothers and one sister", "One brother and two sisters", "Two brothers and two sisters"],
    meaningAnswer: 0,
    inferQuestion: "If the speaker says the sister first, does the family information change?",
    inferChoices: ["No, the same siblings are described", "Yes, the family changes", "We cannot tell"],
    inferAnswer: 0,
    respondQuestion: "У тебя есть брат или сестра?",
    respondChoices: ["Да, у меня есть брат.", "Да, у меня есть сестра.", "Да, у меня есть братья и сёстры.", "Нет."],
    respondAnswer: 0,
    // NOTE: also a free-response-style item in spirit — learner picks whichever is true for them.
    support: "Listen separately for the number and the family word.",
    transcript: "У меня есть два брата и одна сестра."
  },
  {
    // Encounter 4 — Lesson 2: identification dialogue
    primary: "Кто это? Твой брат? — Нет, это моя сестра.",
    variation: "Это твоя сестра? — Нет, это мой брат.",
    catch: ["брат", "сестра", "мама", "папа", "дедушка", "дядя"],
    meaningQuestion: "Who is the person?",
    meaningChoices: ["The speaker's brother", "The speaker's sister", "The speaker's mother"],
    meaningAnswer: 1,
    inferQuestion: "Was the first speaker's guess correct?",
    inferChoices: ["No", "Yes", "We don't know"],
    inferAnswer: 0,
    respondQuestion: "Кто это?",
    respondChoices: ["Это мой брат.", "Это моя сестра.", "Это моя мама.", "Это мой папа."],
    respondAnswer: 1,
    support: "Don't stop when you hear брат. Listen for what comes after нет.",
    transcript: "Кто это? Твой брат? — Нет, это моя сестра."
  },
  {
    // Encounter 5 — Lesson 2: жить + location contrast
    primary: "Мои бабушка и дедушка живут в Москве, а я живу здесь.",
    variation: "Я живу здесь, а мои бабушка с дедушкой — в Москве.",
    catch: ["Москва", "здесь", "бабушка и дедушка", "я", "Санкт-Петербург", "дядя", "тётя"],
    meaningQuestion: "Where do the grandparents live?",
    meaningChoices: ["In Moscow", "Here with the speaker", "The speaker doesn't say"],
    meaningAnswer: 0,
    inferQuestion: "Does the speaker live in the same place as the grandparents?",
    inferChoices: ["No", "Yes", "We cannot tell"],
    inferAnswer: 0,
    respondQuestion: "Где живут твои бабушка и дедушка?",
    respondChoices: ["Они живут в ___.", "Они живут здесь.", "Я не знаю."],
    respondAnswer: 0,
    // NOTE: free-response fill-in for the blank.
    support: "Listen for живут with бабушка и дедушка and живу with я.",
    transcript: "Мои бабушка и дедушка живут в Москве, а я живу здесь."
  },
  {
    // Encounter 6 — Lesson 3: любить (completed forms) + pronoun их
    primary: "Ты любишь бабушку и дедушку? Да, я их очень люблю.",
    variation: "Ты любишь бабушку и дедушку? Конечно. Я их очень люблю.",
    catch: ["я", "их", "бабушку", "дедушку", "люблю", "дядя", "тётя", "родители"],
    meaningQuestion: "Who does их refer to?",
    meaningChoices: ["The grandmother and grandfather", "The speaker", "The speaker's whole family"],
    meaningAnswer: 0,
    inferQuestion: "How does the answer avoid repeating бабушку и дедушку?",
    inferChoices: ["It uses их", "It uses я", "It uses ты"],
    inferAnswer: 0,
    respondQuestion: "Ты любишь твою семью?",
    respondChoices: ["Да, я очень люблю мою семью.", "Да, очень.", "Конечно."],
    respondAnswer: 0,
    support: "Listen to the people named in the question. Then ask yourself who их replaces in the answer.",
    transcript: "Ты любишь бабушку и дедушку? Да, я их очень люблю."
  }
];

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
    purpose: "This time, listen for the days and the actions."
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
  landing: document.getElementById("landingScreen"),
  experience: document.getElementById("experienceScreen"),
  completion: document.getElementById("completionScreen"),
  enter: document.getElementById("enterButton"),
  listen: document.getElementById("listenButton"),
  slower: document.getElementById("slowerButton"),
  audioStatus: document.getElementById("audioStatus"),
  progress: document.getElementById("encounterProgress"),
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
  window.speechSynthesis.speak(utterance);
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
  el.meaningFeedback.className = "feedback";
  el.inferFeedback.textContent = "";
  el.inferFeedback.className = "feedback";
  el.respondFeedback.textContent = "";
  el.respondFeedback.className = "feedback";
}

function makeChoiceButtons(container, choices, answerIndex, feedbackEl, successText, acceptAny = false) {
  container.innerHTML = "";

  choices.forEach((choice, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "choice-button";
    button.textContent = choice;

    button.addEventListener("click", () => {
      if (acceptAny || index === answerIndex) {
        feedbackEl.textContent = successText;
        feedbackEl.className = "feedback feedback--success";
        [...container.querySelectorAll("button")].forEach((item) => {
          item.disabled = true;
        });
        el.nextMove.hidden = false;
      } else {
        feedbackEl.textContent = "Not quite. Listen again and use what you do understand.";
        feedbackEl.className = "feedback feedback--try";
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

  el.progress.textContent = `Encounter ${encounterIndex + 1} of ${encounters.length}`;
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
      Boolean(encounter.respondAcceptsAny)
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

function advanceEncounter() {
  if (encounterIndex < encounters.length - 1) {
    encounterIndex += 1;
    moveIndex = 0;
    renderMove();
    return;
  }

  showCompletion();
}

function showCompletion() {
  window.speechSynthesis?.cancel();
  el.landing.hidden = true;
  el.experience.hidden = true;
  el.completion.hidden = false;
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function resetRoom() {
  window.speechSynthesis?.cancel();
  encounterIndex = 0;
  moveIndex = 0;
  el.completion.hidden = true;
  el.landing.hidden = false;
  el.experience.hidden = true;
  window.scrollTo({ top: 0, behavior: "smooth" });
}

el.enter.addEventListener("click", () => {
  el.landing.hidden = true;
  el.completion.hidden = true;
  el.experience.hidden = false;
  encounterIndex = 0;
  moveIndex = 0;
  renderMove();
  window.scrollTo({ top: 0, behavior: "smooth" });
});

el.nextMove.addEventListener("click", advanceMove);

el.nextEncounter.addEventListener("click", () => {
  if (encounterIndex < encounters.length - 1) {
    encounterIndex += 1;
    moveIndex = 0;
    renderMove();
  } else {
    showCompletion();
  }
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
