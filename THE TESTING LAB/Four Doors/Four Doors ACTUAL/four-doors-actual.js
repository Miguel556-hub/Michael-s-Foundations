// ==================================================
// MICHAEL'S FOUNDATIONS
// FOUR DOORS ACTUAL — G&I REFERENCE IMPLEMENTATION
// ==================================================

const normalize = (s) =>
  (s || "")
    .toLowerCase()
    .replace(/[.,!?;:«»"']/g, "")
    .replace(/\s+/g, " ")
    .trim();

function speakRussian(text) {
  if (!("speechSynthesis" in window)) return;
  speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "ru-RU";
  utterance.rate = 0.86;
  const voices = speechSynthesis.getVoices();
  const russianVoice = voices.find((voice) =>
    voice.lang && voice.lang.toLowerCase().startsWith("ru")
  );
  if (russianVoice) utterance.voice = russianVoice;
  speechSynthesis.speak(utterance);
}

document.addEventListener("click", (event) => {
  const listenButton = event.target.closest(".listen");
  if (listenButton?.dataset.speak) {
    speakRussian(listenButton.dataset.speak);
  }
});

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
