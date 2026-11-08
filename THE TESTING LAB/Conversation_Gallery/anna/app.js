import { getCharacter } from './avatar-registry.js';

const anna = getCharacter('AV01');
const $ = (id) => document.getElementById(id);
const recognitionType = window.SpeechRecognition || window.webkitSpeechRecognition;
let turn = 'opening';
let activeRecognition = null;
let activePanel = null;
let practiceMode = false;

// Conversation turns: every turn has language support, including closing remarks.
const lines = {
  opening: {
    ru: 'Ты любишь борщ?', en: 'Do you like borscht?',
    answers: [['Да, я люблю борщ.', 'Yes, I like borscht.'], ['Нет, я не люблю борщ.', 'No, I do not like borscht.']],
    usage: 'Anna is asking about your food preferences. Ты is the familiar form of “you,” used with friends and family.',
    discovery: 'Любишь comes from любить (to love or like). Ты любишь ...? is a common way to ask whether someone likes something.'
  },
  yes: {
    ru: 'Замечательно! Хочешь ещё?', en: 'Wonderful! Would you like some more?',
    answers: [['Да, пожалуйста.', 'Yes, please.'], ['Нет, спасибо.', 'No, thank you.']],
    usage: 'Anna offers you another serving. Хочешь ещё? is a familiar, natural way to ask whether you want more.',
    discovery: 'Хочешь is the ты form of хотеть (to want). Ещё means “more” or “again,” depending on context.'
  },
  no: {
    ru: 'Понятно. А что ты любишь?', en: 'I see. And what do you like?',
    answers: [['Я люблю пельмени.', 'I like pelmeni.'], ['Мне нравится суп.', 'I like soup.']],
    usage: 'Anna is interested in what food you do enjoy. You can name your own favorite food.',
    discovery: 'А often introduces a contrasting or follow-up question: “And what about ...?” Мне нравится ... literally follows a different structure from Я люблю ....'
  },
  moreYes: {
    ru: 'Конечно! Угощайся!', en: 'Of course! Help yourself!',
    answers: [['Спасибо!', 'Thank you!'], ['С удовольствием!', 'With pleasure!']],
    usage: 'Угощайся! means “Help yourself!” or “Have some!” Anna is warmly inviting you to enjoy the food.',
    discovery: 'Угощайся is the informal singular imperative of the imperfective reflexive verb угощаться. The related perfective verb is угоститься. Угощайтесь is the polite or plural invitation. Although grammatically imperative, it is a friendly invitation here.'
  },
  moreNo: {
    ru: 'Хорошо! Если захочешь, скажи.', en: 'All right! Let me know if you want some.',
    answers: [['Спасибо!', 'Thank you!'], ['Хорошо, спасибо.', 'Okay, thank you.']],
    usage: 'Anna accepts your polite refusal and leaves the invitation open.',
    discovery: 'Если means “if.” Захочешь means “you will want” in a conditional future sense. Скажи is the informal singular imperative of сказать (“tell” or “say”).'
  },
  preference: {
    ru: 'Очень интересно! Спасибо, что рассказал!', en: 'How interesting! Thanks for telling me!',
    answers: [['Пожалуйста!', 'You’re welcome!'], ['А ты что любишь?', 'And what do you like?']],
    usage: 'Anna thanks you for sharing your preference. You can answer politely or ask her a question in return.',
    discovery: 'Рассказал is a masculine past-tense form. A female addressee would hear рассказала instead. In a future version Anna should adapt this form to the learner; this prototype uses one fixed line.'
  },
  closing: {
    ru: 'Спасибо за разговор! До скорого!', en: 'Thanks for the conversation! See you soon!',
    answers: [], usage: 'The conversation has ended. Start over to explore another branch.',
    discovery: 'До скорого! is a friendly farewell meaning “See you soon!”'
  }
};


const visualScenes = {
  opening: `<div class="stage-eyebrow">A question of taste</div><div class="stage-russian" lang="ru">Ты люб<span class="ending">ишь</span> борщ?</div><div class="stage-english">Do you like borscht?</div><div class="stage-row"><div class="stage-tile"><small>THE VERB</small><strong lang="ru">любить</strong></div><div class="stage-tile"><small>WHEN SPEAKING TO ТЫ</small><strong lang="ru">люб<span class="ending">ишь</span></strong></div></div>`,
  yes: `<div class="stage-eyebrow">At the dinner table</div><div class="stage-russian" lang="ru">Хоч<span class="ending">ешь</span> ещё?</div><div class="stage-row"><div class="stage-tile"><small>YES, PLEASE</small><strong lang="ru">Да, пожалуйста.</strong></div><div class="stage-tile"><small>NO, THANK YOU</small><strong lang="ru">Нет, спасибо.</strong></div></div><div class="stage-hint">A warm offer. Two polite ways to respond.</div>`,
  no: `<div class="stage-eyebrow">Your turn to choose</div><div class="stage-russian" lang="ru">А что ты любишь?</div><div class="stage-row"><div class="stage-tile"><small>I LIKE…</small><strong lang="ru">Я люблю…</strong></div><div class="stage-tile"><small>I ENJOY…</small><strong lang="ru">Мне нравится…</strong></div></div><div class="stage-hint">Two natural ways to share a preference.</div>`,
  moreYes: `<div class="stage-eyebrow">A Russian invitation</div><div class="stage-russian" lang="ru">Угощайся!</div><div class="stage-english">Help yourself!</div><div class="stage-row"><div class="stage-tile"><small>ONE PERSON · FAMILIAR</small><strong lang="ru">Угоща<span class="ending">йся</span>!</strong></div><div class="stage-tile"><small>POLITE OR PLURAL</small><strong lang="ru">Угоща<span class="ending">йтесь</span>!</strong></div></div><div class="stage-hint">Notice how the invitation changes with the person you address.</div>`,
  moreNo: `<div class="stage-eyebrow">A gentle invitation</div><div class="stage-russian" lang="ru">Если захочешь, скажи.</div><div class="stage-row"><div class="stage-tile"><small>IF</small><strong lang="ru">Если</strong></div><div class="stage-tile"><small>TELL ME</small><strong lang="ru">Скаж<span class="ending">и</span></strong></div></div><div class="stage-hint">Anna respects your answer and leaves the door open.</div>`,
  preference: `<div class="stage-eyebrow">An interesting difference</div><div class="stage-russian" lang="ru">Спасибо, что рассказал!</div><div class="stage-row"><div class="stage-tile"><small>MASCULINE FORM</small><strong lang="ru">рассказа<span class="ending">л</span></strong></div><div class="stage-tile"><small>FEMININE FORM</small><strong lang="ru">рассказа<span class="ending">ла</span></strong></div></div><div class="stage-hint">Russian past-tense forms can reflect the person being addressed.</div>`,
  closing: `<div class="stage-eyebrow">Until next time</div><div class="stage-russian" lang="ru">До скорого!</div><div class="stage-english">See you soon!</div><div class="stage-hint">A warm way to finish a conversation.</div>`
};
function renderVisualStage() { $('visual-stage').innerHTML = visualScenes[turn]; }

function status(message) { $('feedback').textContent = message; }
function textParagraph(parent, value, className = '') {
  const p = document.createElement('p');
  p.textContent = value;
  if (className) p.className = className;
  parent.append(p);
}
function renderAssistance() {
  const line = lines[turn];
  const answers = $('help-content');
  answers.replaceChildren();
  if (line.answers.length) {
    for (const [ru, en] of line.answers) {
      const p = document.createElement('p');
      const russian = document.createElement('span');
      russian.lang = 'ru';
      russian.className = 'russian-example';
      russian.textContent = ru;
      const english = document.createElement('span');
      english.className = 'english-example';
      english.textContent = ` — ${en}`;
      p.append(russian, english);
      answers.append(p);
    }
  } else {
    textParagraph(answers, 'No response needed. This exchange is complete.');
  }
  $('meaning-content').replaceChildren();
  textParagraph($('meaning-content'), `${line.ru} — ${line.en}`, 'russian-example');
  textParagraph($('meaning-content'), line.usage);
  $('discovery-content').replaceChildren();
  textParagraph($('discovery-content'), line.discovery);
  closePanels();
  renderVisualStage();
  $('practice-status').textContent = '';
}
function closePanels() {
  activePanel = null;
  for (const [button, panel] of [['show-answers','answers-panel'],['show-meaning','meaning-panel'],['show-discovery','discovery-panel']]) {
    $(panel).hidden = true;
    $(button).setAttribute('aria-expanded','false');
  }
}
function togglePanel(button, panel) {
  const open = activePanel !== panel;
  closePanels();
  if (open) {
    $(panel).hidden = false;
    $(button).setAttribute('aria-expanded','true');
    activePanel = panel;
  }
}
function setLine(key) {
  turn = key;
  $('russian').textContent = lines[key].ru;
  $('translation').textContent = lines[key].en;
  renderAssistance();
  $('answer').disabled = key === 'closing';
  $('send').disabled = key === 'closing';
}
function animateSpeaking(on) {
  $('portrait').classList.toggle('speaking', on);
  $('light').classList.toggle('active', on);
  $('avatar-state').textContent = on ? `${anna.name} is speaking…` : `${anna.name} is ready`;
}
function speak() {
  if (!('speechSynthesis' in window)) { status('This browser does not support text-to-speech.'); return; }
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(lines[turn].ru);
  utterance.lang = anna.voiceLanguage;
  utterance.rate = .85;
  const russianVoice = window.speechSynthesis.getVoices().find(v => v.lang.toLowerCase().startsWith('ru'));
  if (russianVoice) utterance.voice = russianVoice;
  else status('No Russian voice detected; pronunciation may not be accurate.');
  utterance.onstart = () => animateSpeaking(true);
  utterance.onend = () => animateSpeaking(false);
  utterance.onerror = () => { animateSpeaking(false); status('Speech playback failed. Check your audio and voices.'); };
  window.speechSynthesis.speak(utterance);
}
function classify(raw) {
  const t = raw.toLocaleLowerCase('ru-RU').replace(/[.,!?]/g,' ').trim();
  if (turn === 'opening' || turn === 'yes') {
    if (/\bнет\b|не люблю|не хочу|не надо|не нужно/.test(t)) return 'no';
    if (/\bда\b|люблю|конечно|хочу|пожалуйста|очень/.test(t)) return 'yes';
    return null;
  }
  if (turn === 'no') return t.length > 2 ? 'preference' : null;
  if (['moreYes','moreNo','preference'].includes(turn)) return t.length > 1 ? 'closing' : null;
  return null;
}
function respond(raw) {
  $('transcript').textContent = raw;
  if (practiceMode) {
    practiceMode = false;
    $('practice-status').textContent = `You said: ${raw}. Compare what you heard with Anna’s phrase; speech recognition is not a pronunciation score.`;
    status('Phrase practice complete. You can answer Anna or practice again.');
    return;
  }
  const kind = classify(raw);
  if (!kind) { status('I could not match that response. Open Possible Answers, or try again.'); return; }
  let next;
  if (turn === 'opening') next = kind === 'yes' ? 'yes' : 'no';
  else if (turn === 'yes') next = kind === 'yes' ? 'moreYes' : 'moreNo';
  else if (turn === 'no') next = 'preference';
  else next = 'closing';
  setLine(next);
  $('typed').value = '';
  status(next === 'closing' ? 'Conversation complete. Start over to try another branch.' : 'Anna has responded. Speak again, or explore the help for this turn.');
  speak();
}
function listen(practice = false) {
  if (!recognitionType) { status('Speech recognition is unavailable. Use the typed-response fallback.'); return; }
  window.speechSynthesis?.cancel();
  animateSpeaking(false);
  if (activeRecognition) { activeRecognition.abort(); activeRecognition = null; }
  practiceMode = practice;
  const recognition = new recognitionType();
  activeRecognition = recognition;
  recognition.lang = 'ru-RU';
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;
  recognition.onstart = () => { status(practice ? 'Listening: repeat Anna’s phrase aloud.' : 'Listening: answer Anna in Russian.'); $('answer').disabled = true; };
  recognition.onresult = (event) => respond(event.results[0][0].transcript);
  recognition.onerror = (event) => { practiceMode = false; status(`Speech recognition: ${event.error}. You can type instead.`); };
  recognition.onend = () => { $('answer').disabled = turn === 'closing'; activeRecognition = null; };
  try { recognition.start(); } catch { practiceMode = false; status('Could not start the microphone. Try the typed fallback.'); $('answer').disabled = false; }
}
function reset() {
  activeRecognition?.abort(); activeRecognition = null; practiceMode = false;
  window.speechSynthesis?.cancel(); animateSpeaking(false);
  setLine('opening');
  $('transcript').textContent = '—';
  $('typed').value = '';
  status('Ready to begin.');
}
$('hear').addEventListener('click', speak);
$('hear-again').addEventListener('click', speak);
$('answer').addEventListener('click', () => listen(false));
$('practice-phrase').addEventListener('click', () => listen(true));
$('repeat').addEventListener('click', reset);
$('show-answers').addEventListener('click', () => togglePanel('show-answers','answers-panel'));
$('show-meaning').addEventListener('click', () => togglePanel('show-meaning','meaning-panel'));
$('show-discovery').addEventListener('click', () => togglePanel('show-discovery','discovery-panel'));
$('send').addEventListener('click', () => {
  const value = $('typed').value.trim();
  if (value) { practiceMode = false; respond(value); }
  else status('Type a Russian response first.');
});
reset();
