/*
 * Michael's Foundations — Shared Conversation Engine
 * All six characters use the same speech, assistance and discovery controls.
 * Edit spoken content in conversations.js, not in this file.
 */

import { conversations } from './conversations.js';
import { characters } from './avatar-registry.js';

const $ = (id) => document.getElementById(id);
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const characterKeys = Object.keys(conversations);

let characterKey = characterKeys[0];
let turnKey = 'opening';
let activeDetail = null;
let activeRecognition = null;
let practiceMode = false;
let audioToken = 0;

function currentConversation() {
    return conversations[characterKey];
}

function currentTurn() {
    return currentConversation().turns[turnKey];
}

function escapeHtml(value) {
    return String(value).replace(/[&<>"']/g, (character) => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;'
    })[character]);
}

function normalize(text) {
    return String(text)
        .toLocaleLowerCase('ru-RU')
        .replace(/ё/g, 'е')
        .replace(/[.,!?;:«»—–]/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
}

function setStatus(message) {
    $('feedback').textContent = message;
}

function setSpeaking(speaking) {
    $('light').classList.toggle('active', speaking);
    $('avatar-state').textContent = speaking
        ? `${currentConversation().character} is speaking…`
        : `${currentConversation().character} is ready`;
}

/*
 * Gallery navigation: scenario cards are the sole selection mechanism.
 * The address hash also allows direct links to an individual scenario.
 */
const galleryOrder = ['anna', 'dmitri', 'amina', 'timur', 'ruslan', 'elena', 'sofia'];
const avatarIds = {
    anna: 'AV01', dmitri: 'AV02', amina: 'AV03',
    timur: 'AV04', ruslan: 'AV06', elena: 'AV05', sofia: 'AV07'
};

function renderGallery() {
    const host = $('gallery-grid');
    host.replaceChildren();

    galleryOrder.forEach((key, index) => {
        const data = conversations[key];
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'gallery-card';
        button.innerHTML = `
            <img src="${data.portrait}" alt="${escapeHtml(data.character)}">
            <span class="gallery-card-copy">
                <small>SCENARIO ${index + 1}</small>
                <strong>${escapeHtml(data.scenario.split('–').pop().trim())}</strong>
                <span>Talk with ${escapeHtml(data.character)}</span>
            </span>
        `;
        button.addEventListener('click', () => {
            window.location.hash = key;
        });
        host.append(button);
    });
}

function route() {
    const key = window.location.hash.slice(1).toLowerCase();
    if (Object.hasOwn(conversations, key)) {
        $('gallery').hidden = true;
        $('experience').hidden = false;
        $('back-to-gallery').hidden = false;
        selectCharacter(key);
    } else {
        activeRecognition?.abort();
        cancelAudio();
        $('experience').hidden = true;
        $('gallery').hidden = false;
        $('back-to-gallery').hidden = true;
    }
}

function renderStage() {
    const data = currentTurn().discovery;
    const tiles = data.forms.map(([russian, english]) => `
        <div class="stage-box">
            <small>${escapeHtml(english)}</small>
            <strong lang="ru">${russian}</strong>
        </div>
    `).join('');

    $('visual-stage').innerHTML = `
        <div class="stage-head">${escapeHtml(data.title)}</div>
        <div class="stage-word" lang="ru">${escapeHtml(currentTurn().russian)}</div>
        <div class="stage-tiles">${tiles}</div>
    `;
}

function renderMeaning() {
    const data = currentTurn();
    const examples = data.meanings.map((entry) => `
        <div class="example">
            <div class="ru" lang="ru">${escapeHtml(entry.russian)}</div>
            <div class="en">${escapeHtml(entry.english)}</div>
        </div>
    `).join('');

    $('discovery-detail').innerHTML = `
        <h4>${escapeHtml(data.russian)}</h4>
        <p class="stage-sub">${escapeHtml(data.english)}</p>
        ${examples}
    `;
}

function renderDiscovery() {
    const data = currentTurn().discovery;
    const examples = data.forms.map(([russian, english]) => `
        <div class="stage-box">
            <small>${escapeHtml(english)}</small>
            <strong lang="ru">${russian}</strong>
        </div>
    `).join('');

    $('discovery-detail').innerHTML = `
        <h4>${escapeHtml(data.title)}</h4>
        <p>${escapeHtml(data.intro)}</p>
        <div class="stage-tiles">${examples}</div>
        <p class="rule">${escapeHtml(data.note)}</p>
        <h5>See what you remember</h5>
        <p>${escapeHtml(data.quiz[0])}</p>
        <div class="practice-choices">
            <button type="button" data-quiz="0" lang="ru">${escapeHtml(data.quiz[1])}</button>
            <button type="button" data-quiz="1" lang="ru">${escapeHtml(data.quiz[2])}</button>
        </div>
        <div class="practice-feedback" id="quiz-feedback" role="status"></div>
    `;

    $('discovery-detail').querySelectorAll('[data-quiz]').forEach((button) => {
        button.addEventListener('click', () => {
            const correct = button.dataset.quiz === '0';
            $('quiz-feedback').textContent = correct
                ? 'Exactly! You spotted the pattern.'
                : 'Look again at the highlighted change.';
        });
    });
}

function toggleDetail(mode) {
    if (activeDetail === mode) {
        activeDetail = null;
        $('discovery-detail').hidden = true;
    } else {
        activeDetail = mode;
        if (mode === 'meaning') {
            renderMeaning();
        } else {
            renderDiscovery();
        }
        $('discovery-detail').hidden = false;
    }

    $('show-meaning').setAttribute('aria-expanded', String(activeDetail === 'meaning'));
    $('show-discovery').setAttribute('aria-expanded', String(activeDetail === 'discovery'));
}

function renderAnswers() {
    const host = $('answers-panel');
    host.replaceChildren();

    for (const answer of currentTurn().answers) {
        const row = document.createElement('div');
        row.className = 'answer-item';

        const copy = document.createElement('div');
        copy.className = 'answer-copy';

        const russian = document.createElement('div');
        russian.className = 'answer-ru';
        russian.lang = 'ru';
        russian.textContent = answer.russian;

        const english = document.createElement('div');
        english.className = 'answer-en';
        english.textContent = answer.english;

        const level = document.createElement('div');
        level.className = 'answer-level';
        level.textContent = answer.level;

        copy.append(russian, english);
        row.append(copy, level);
        host.append(row);
    }
}

function setTurn(key) {
    turnKey = key;
    const data = currentTurn();
    const complete = data.answers.length === 0;

    $('russian').textContent = data.russian;
    $('translation').textContent = data.english;
    $('answer').disabled = complete;
    $('send').disabled = complete;
    $('typed').disabled = complete;

    activeDetail = null;
    $('discovery-detail').hidden = true;
    $('show-meaning').setAttribute('aria-expanded', 'false');
    $('show-discovery').setAttribute('aria-expanded', 'false');
    $('answers-panel').hidden = true;
    $('show-answers').setAttribute('aria-expanded', 'false');
    $('practice-status').textContent = '';

    renderStage();
    renderAnswers();
}

function cancelAudio() {
    audioToken += 1;
    window.speechSynthesis?.cancel();
    setSpeaking(false);
}

function speak() {
    if (!('speechSynthesis' in window)) {
        setStatus('Speech playback is unavailable in this browser.');
        return;
    }

    cancelAudio();
    const token = audioToken;
    const utterance = new SpeechSynthesisUtterance(currentTurn().russian);
    utterance.lang = 'ru-RU';
    utterance.rate = 0.86;

    const voice = window.speechSynthesis.getVoices().find((entry) =>
        entry.lang.toLowerCase().startsWith('ru')
    );

    if (voice) {
        utterance.voice = voice;
    } else {
        setStatus('No Russian voice found. Install a Russian voice for accurate pronunciation.');
    }

    utterance.onstart = () => {
        if (token === audioToken) setSpeaking(true);
    };

    utterance.onend = () => {
        if (token === audioToken) setSpeaking(false);
    };

    utterance.onerror = () => {
        if (token === audioToken) {
            setSpeaking(false);
            setStatus('Speech playback failed.');
        }
    };

    window.speechSynthesis.speak(utterance);
}

/*
 * Speech recognition is imperfect. First try exact suggested responses;
 * then accept short recognizable variations. Unrecognized replies do
 * not advance the dialogue, and the learner can always type instead.
 */
function detectIntent(raw) {
    const text = normalize(raw);
    if (!text) return null;

    const answers = currentTurn().answers;
    const exact = answers.find((answer) => normalize(answer.russian) === text);
    if (exact) return exact.intent;

    const near = answers.find((answer) => {
        const candidate = normalize(answer.russian);
        return text.length >= 5 && (candidate.includes(text) || text.includes(candidate));
    });
    if (near) return near.intent;

    const negative = /(^|\s)нет(\s|$)|не хочу|не нужно|не нравится|не люблю|не надо|лучше не/;
    const positive = /(^|\s)да(\s|$)|конечно|хорошо|отлично|пожалуйста|с удовольствием/;

    if (negative.test(text)) {
        const answer = answers.find((entry) => /нет|не хочу|не нужно|не нравится|не люблю/.test(normalize(entry.russian)));
        if (answer) return answer.intent;
    }

    if (positive.test(text)) {
        const answer = answers.find((entry) => /да|конечно|хорошо|отлично|пожалуйста/.test(normalize(entry.russian)));
        if (answer) return answer.intent;
    }

    // A partial response may contain a distinctive content word.
    const stopWords = new Set(['да', 'нет', 'я', 'ты', 'мы', 'это', 'мне', 'нам', 'ещё', 'очень', 'пожалуйста', 'хорошо']);
    const words = text.split(' ').filter((word) => word.length >= 5 && !stopWords.has(word));

    const matching = answers.filter((answer) =>
        words.some((word) => normalize(answer.russian).includes(word))
    );

    if (matching.length === 1) return matching[0].intent;
    return null;
}

function respond(raw) {
    $('transcript').textContent = raw;

    if (practiceMode) {
        practiceMode = false;
        $('practice-status').textContent = `I heard: ${raw}. Compare it with the character’s phrase; this is not a pronunciation score.`;
        setStatus('');
        return;
    }

    const intent = detectIntent(raw);
    if (!intent) {
        setStatus('I did not recognize that answer yet. Try another wording or open Possible Answers.');
        return;
    }

    const next = currentTurn().next[intent];
    if (!next) {
        setStatus('That response is not connected to a next turn yet.');
        return;
    }

    setTurn(next);
    $('typed').value = '';
    setStatus(currentTurn().answers.length === 0 ? 'Conversation complete.' : '');
    speak();
}

function listen(practice = false) {
    if (!SpeechRecognition) {
        setStatus('Microphone recognition is unavailable. You can type your response.');
        return;
    }

    cancelAudio();
    activeRecognition?.abort();
    practiceMode = practice;

    const recognition = new SpeechRecognition();
    activeRecognition = recognition;
    recognition.lang = 'ru-RU';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
        setStatus(practice ? 'Listening to your repetition…' : 'Listening…');
        $('answer').disabled = true;
    };

    recognition.onresult = (event) => respond(event.results[0][0].transcript);

    recognition.onerror = (event) => {
        practiceMode = false;
        setStatus(`Microphone: ${event.error}. You can type instead.`);
    };

    recognition.onend = () => {
        $('answer').disabled = currentTurn().answers.length === 0;
        if (activeRecognition === recognition) activeRecognition = null;
    };

    try {
        recognition.start();
    } catch {
        practiceMode = false;
        setStatus('Could not start the microphone.');
        $('answer').disabled = false;
    }
}

function reset() {
    activeRecognition?.abort();
    activeRecognition = null;
    practiceMode = false;
    cancelAudio();
    setTurn(currentConversation().start);
    $('transcript').textContent = '';
    $('typed').value = '';
    setStatus('');
}

function selectCharacter(key) {
    characterKey = key;
    const data = currentConversation();

    $('scenario').textContent = data.scenario;
    $('conversation-title').textContent = `Talk with ${data.character}`;
    $('speaker-label').textContent = `${data.character.toUpperCase()} SAYS`;
    $('hear').textContent = `▶ Hear ${data.character}`;
    $('hear-again').textContent = `Hear ${data.character} Again`;
    $('character-image').src = data.portrait;
    $('character-image').alt = `${data.character} — ${characters[avatarIds[key]]?.role || 'conversation partner'}`;
    reset();
}

/* EVENT HANDLERS */
$('hear').addEventListener('click', speak);
$('hear-again').addEventListener('click', speak);
$('answer').addEventListener('click', () => listen(false));
$('practice-phrase').addEventListener('click', () => listen(true));
$('repeat').addEventListener('click', reset);
$('show-meaning').addEventListener('click', () => toggleDetail('meaning'));
$('show-discovery').addEventListener('click', () => toggleDetail('discovery'));

$('show-answers').addEventListener('click', () => {
    const expanded = $('answers-panel').hidden;
    $('answers-panel').hidden = !expanded;
    $('show-answers').setAttribute('aria-expanded', String(expanded));
});

$('send').addEventListener('click', () => {
    const value = $('typed').value.trim();
    if (value) {
        practiceMode = false;
        respond(value);
    } else {
        setStatus('Type a Russian response.');
    }
});

$('typed').addEventListener('keydown', (event) => {
    if (event.key === 'Enter') $('send').click();
});

$('back-to-gallery').addEventListener('click', () => {
    window.location.hash = '';
});

window.addEventListener('hashchange', route);
renderGallery();
route();
