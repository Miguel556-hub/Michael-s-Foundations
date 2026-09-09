const encounters = [
  {
    primary: "В понедельник я работаю, а во вторник я отдыхаю.",
    variation: "Я работаю в понедельник, а во вторник отдыхаю.",
    catch: ["понедельник", "работаю", "вторник", "отдыхаю", "суббота", "учусь"],
    meaningQuestion: "What is the speaker telling you?",
    meaningChoices: [
      "They work Monday and rest Tuesday.",
      "They rest Monday and work Tuesday.",
      "They work on the weekend."
    ],
    meaningAnswer: 0,
    inferQuestion: "The word order changed. Did the basic meaning change?",
    inferChoices: ["No. The same two activities happen on the same days.", "Yes. Monday and Tuesday switched."],
    inferAnswer: 0,
    respondQuestion: "When does the speaker rest?",
    respondChoices: ["В понедельник.", "Во вторник.", "На выходных."],
    respondAnswer: 1,
    support: "Listen for the day words and the two activity verbs.",
    transcript: "В понедельник я работаю, а во вторник я отдыхаю."
  },
  {
    primary: "По понедельникам я работаю, а по субботам отдыхаю.",
    variation: "Ты работаешь по субботам или отдыхаешь?",
    catch: ["понедельникам", "работаю", "субботам", "отдыхаю", "или", "среда"],
    meaningQuestion: "What weekly pattern did you hear?",
    meaningChoices: [
      "The speaker regularly works Mondays and rests Saturdays.",
      "The speaker worked one Monday and one Saturday.",
      "The speaker rests every Monday."
    ],
    meaningAnswer: 0,
    inferQuestion: "In the variation, what is или doing?",
    inferChoices: ["Offering an alternative: work or rest.", "Adding two actions together.", "Showing a contrast like но."],
    inferAnswer: 0,
    respondQuestion: "Which expression sounds like a repeated weekly pattern?",
    respondChoices: ["В понедельник.", "По понедельникам.", "Сегодня понедельник."],
    respondAnswer: 1,
    support: "Listen for по + the day form. That pattern points to something recurring.",
    transcript: "По понедельникам я работаю, а по субботам отдыхаю."
  },
  {
    primary: "Сегодня среда. Вчера был вторник, а завтра четверг.",
    variation: "Завтра пятница. Какой сегодня день?",
    catch: ["сегодня", "среда", "вчера", "вторник", "завтра", "четверг"],
    meaningQuestion: "Where are we in the week?",
    meaningChoices: ["Today is Wednesday.", "Today is Tuesday.", "Today is Thursday."],
    meaningAnswer: 0,
    inferQuestion: "If tomorrow is Friday, what is today?",
    inferChoices: ["среда", "четверг", "суббота"],
    inferAnswer: 1,
    respondQuestion: "What comes after среда?",
    respondChoices: ["вторник", "четверг", "пятница"],
    respondAnswer: 1,
    support: "Use the week sequence rather than translating every word.",
    transcript: "Сегодня среда. Вчера был вторник, а завтра четверг."
  },
  {
    primary: "В будни я работаю и учусь, а на выходных отдыхаю.",
    variation: "На выходных ты работаешь или отдыхаешь?",
    catch: ["будни", "работаю", "учусь", "выходных", "отдыхаю", "или"],
    meaningQuestion: "What is different about weekdays and weekends?",
    meaningChoices: [
      "The speaker works and studies on weekdays, then rests on weekends.",
      "The speaker rests on weekdays and studies on weekends.",
      "The speaker works every day."
    ],
    meaningAnswer: 0,
    inferQuestion: "What question is the variation asking?",
    inferChoices: ["Do you work or rest on weekends?", "Where do you live?", "What day is today?"],
    inferAnswer: 0,
    respondQuestion: "When does the speaker rest?",
    respondChoices: ["В будни.", "На выходных.", "По понедельникам."],
    respondAnswer: 1,
    support: "Listen for the larger week chunks: будни and выходные.",
    transcript: "В будни я работаю и учусь, а на выходных отдыхаю."
  },
  {
    primary: "Когда ты работаешь? Я работаю в понедельник, среду и пятницу.",
    variation: "Во вторник я не работаю. Я учусь.",
    catch: ["когда", "работаешь", "понедельник", "среду", "пятницу", "учусь"],
    meaningQuestion: "Which days does the speaker work?",
    meaningChoices: [
      "Monday, Wednesday, and Friday.",
      "Tuesday and Thursday.",
      "Saturday and Sunday."
    ],
    meaningAnswer: 0,
    inferQuestion: "What changed in the variation?",
    inferChoices: ["Tuesday is a study day, not a work day.", "Tuesday became a weekend.", "The speaker stopped studying."],
    inferAnswer: 0,
    respondQuestion: "When does the speaker study in the variation?",
    respondChoices: ["Во вторник.", "В пятницу.", "В воскресенье."],
    respondAnswer: 0,
    support: "Listen for the list of day names after the work question.",
    transcript: "Когда ты работаешь? Я работаю в понедельник, среду и пятницу."
  },
  {
    primary: "В субботу я хочу отдыхать, но в воскресенье хочу работать.",
    variation: "Ты хочешь отдыхать в субботу или в воскресенье?",
    catch: ["субботу", "хочу", "отдыхать", "но", "воскресенье", "работать", "или"],
    meaningQuestion: "What does the speaker want to do?",
    meaningChoices: [
      "Rest Saturday but work Sunday.",
      "Work Saturday and rest Sunday.",
      "Rest both days."
    ],
    meaningAnswer: 0,
    inferQuestion: "What does или do in the variation?",
    inferChoices: ["It offers Saturday or Sunday as alternatives.", "It means both days.", "It means because."],
    inferAnswer: 0,
    respondQuestion: "When does the speaker want to rest?",
    respondChoices: ["В субботу.", "В воскресенье.", "В будни."],
    respondAnswer: 0,
    support: "Listen for хочу + the activity and then the day attached to it.",
    transcript: "В субботу я хочу отдыхать, но в воскресенье хочу работать."
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

function makeChoiceButtons(container, choices, answerIndex, feedbackEl, successText) {
  container.innerHTML = "";

  choices.forEach((choice, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "choice-button";
    button.textContent = choice;

    button.addEventListener("click", () => {
      if (index === answerIndex) {
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
      "Well done. You responded to what you understood."
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
