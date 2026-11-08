import {getCharacter} from './avatar-registry.js';
const anna=getCharacter('AV01'), $=id=>document.getElementById(id);
const SpeechRecognition=window.SpeechRecognition||window.webkitSpeechRecognition;
let turn='opening', activeRecognition=null, practiceMode=false, activeDetail=null, audioToken=0;
const item=(ru,en,level,intent)=>({ru,en,level,intent});
const scenes={
 opening:{ru:'Ты любишь борщ?',en:'Do you like borscht?',answers:[item('Да, я люблю борщ.','Yes, I like borscht.','Simple','yes'),item('Да, очень люблю!','Yes, I like it very much!','Expanded','yes'),item('Обожаю борщ!','I love borscht!','Natural','yes'),item('Нет, я не люблю борщ.','No, I don’t like borscht.','Simple','no'),item('Нет, не очень.','No, not really.','Natural','no'),item('Я никогда не пробовал борщ.','I’ve never tried borscht. (male speaker)','Challenge','unknown'),item('А что такое борщ?','What is borscht?','Curious','what')],
  meaning:{title:'Ты любишь борщ?',summary:'Do you like borscht?',blocks:[['Ты','You — informal, for someone you know well.'],['любишь','You like / love — the ты form of любить.'],['борщ','Borscht, a beet-based soup.']]},
  discovery:{title:'How the verb changes',intro:'Russian verbs change depending on who is doing the action.',compare:[['Я люб<span class="ending">лю</span>','I like'],['Ты люб<span class="ending">ишь</span>','You like']],note:'The ending tells us who likes something. Listen for the change.',quiz:{prompt:'How would you say “I like”?',options:['Я люблю','Ты любишь'],correct:0}}},
 yes:{ru:'Замечательно! Хочешь ещё борща?',en:'Wonderful! Would you like some more borscht?',answers:[item('Да, хочу ещё.','Yes, I want more.','Simple','yes'),item('Да, я хочу ещё борща.','Yes, I want more borscht.','Expanded','yes'),item('Да, пожалуйста, дай мне ещё.','Yes, please, give me some more.','Natural','yes'),item('Можно немного борща?','May I have a little borscht?','Challenge','yes'),item('Нет, спасибо.','No, thank you.','Simple','no'),item('Нет, я больше не хочу.','No, I don’t want any more.','Expanded','no'),item('Спасибо, я уже сыт.','Thanks, I’m already full. (male speaker)','Natural','no'),item('Спасибо, я уже сыта.','Thanks, I’m already full. (female speaker)','Natural','no')],
  meaning:{title:'Хочешь ещё борща?',summary:'Would you like more borscht?',blocks:[['Хочешь','Do you want? Informal ты form of хотеть.'],['ещё','More / another serving, in this context.'],['борща','Of borscht — a genitive form of борщ, used with an unspecified amount.']]},
  discovery:{title:'A little more borscht',intro:'When we talk about an unspecified amount, Russian often uses the genitive.',compare:[['борщ','borscht'],['ещё борщ<span class="ending">а</span>','more borscht']],note:'The noun changes: борщ → борща. Also notice дай (informal) versus дайте (polite/plural).',quiz:{prompt:'Which means “more borscht”?',options:['ещё борщ','ещё борща'],correct:1}}},
 no:{ru:'Понятно. А что ты любишь?',en:'I see. And what do you like?',answers:[item('Я люблю пельмени.','I like pelmeni.','Simple','pelmeni'),item('Мне нравится суп.','I like soup.','Expanded','soup'),item('Я люблю пироги.','I like pies.','Expanded','pies'),item('Я люблю картошку.','I like potatoes.','Natural','potatoes'),item('Я предпочитаю салат.','I prefer salad.','Challenge','salad'),item('А что ты любишь?','And what do you like?','Curious','ask')],
  meaning:{title:'А что ты любишь?',summary:'And what do you like?',blocks:[['А','And / but — often shifts or contrasts the topic.'],['что','What.'],['ты любишь','You like — informal.']]},
  discovery:{title:'Two ways to say “I like”',intro:'Both are natural Russian, but they are built differently.',compare:[['Я люб<span class="ending">лю</span> суп.','I like soup.'],['Мне нрав<span class="ending">ится</span> суп.','I like soup.']],note:'Мне нравится literally follows a “pleases me” pattern. With a plural subject: Мне нравятся пельмени.',quiz:{prompt:'Which expression means “I like soup”?',options:['Мне нравится суп.','Мне нравятся суп.'],correct:0}}},
 unknown:{ru:'Тогда попробуй! Это очень вкусно.',en:'Then give it a try! It’s very tasty.',answers:[item('Хорошо, попробую.','Okay, I’ll try it.','Simple','yes'),item('Спасибо, попробую немного.','Thanks, I’ll try a little.','Expanded','yes'),item('Нет, спасибо.','No, thank you.','Simple','no')],
  meaning:{title:'Попробуй!',summary:'Give it a try!',blocks:[['попробуй','Try it! Informal singular imperative of попробовать.'],['вкусно','Tasty / delicious.']]},
  discovery:{title:'A friendly invitation',intro:'The imperative is not always a harsh command. It can be a warm invitation.',compare:[['Попробу<span class="ending">й</span>!','Try it! (informal)'],['Попробу<span class="ending">йте</span>!','Try it! (polite/plural)']],note:'The polite or plural form adds -те.',quiz:{prompt:'Which would you say to several guests?',options:['Попробуй!','Попробуйте!'],correct:1}}},
 what:{ru:'Борщ — это суп со свёклой. Хочешь попробовать?',en:'Borscht is a soup with beets. Would you like to try it?',answers:[item('Да, хочу попробовать.','Yes, I want to try it.','Simple','yes'),item('Да, пожалуйста.','Yes, please.','Simple','yes'),item('Нет, спасибо.','No, thank you.','Simple','no')],
  meaning:{title:'Что такое борщ?',summary:'What is borscht?',blocks:[['Что такое…?','What is …? A very useful question for unfamiliar words.'],['суп со свёклой','Soup with beets.'],['попробовать','To try / taste (perfective infinitive).']]},
  discovery:{title:'Ask about anything',intro:'Что такое…? is a powerful question when you encounter a new word.',compare:[['Что такое борщ?','What is borscht?'],['Что такое пельмени?','What are pelmeni?']],note:'Use this pattern to keep the conversation going even when you don’t know a word.',quiz:{prompt:'How do you ask “What is pelmeni?”',options:['Что такое пельмени?','Ты пельмени?'],correct:0}}},
 moreYes:{ru:'Конечно! Угощайся!',en:'Of course! Help yourself!',answers:[item('Спасибо!','Thank you!','Simple','thanks'),item('Большое спасибо!','Thank you very much!','Expanded','thanks'),item('С удовольствием!','With pleasure!','Natural','thanks'),item('Как вкусно!','How delicious!','Natural','thanks')],
  meaning:{title:'Угощайся!',summary:'Help yourself! / Have some!',blocks:[['угощайся','A friendly invitation to enjoy food or drink offered by a host.'],['угощаться','Imperfective reflexive infinitive: to help oneself / enjoy a treat.'],['угоститься','Related perfective infinitive.']]},
  discovery:{title:'An invitation, not an order',intro:'Russian changes the invitation depending on whom you address.',compare:[['Угоща<span class="ending">йся</span>!','One person, informal'],['Угоща<span class="ending">йтесь</span>!','Polite or several people']],note:'The informal imperative comes from угощаться. The polite/plural form is угощайтесь. The highlighted forms show the contrast.',quiz:{prompt:'You are welcoming several guests. Which fits?',options:['Угощайся!','Угощайтесь!'],correct:1}}},
 moreNo:{ru:'Хорошо! Если захочешь, скажи.',en:'All right! Let me know if you want some.',answers:[item('Спасибо!','Thank you!','Simple','thanks'),item('Хорошо, спасибо.','Okay, thank you.','Expanded','thanks'),item('Обязательно!','Certainly! / I will!','Natural','thanks')],
  meaning:{title:'Если захочешь, скажи.',summary:'If you want some, let me know.',blocks:[['если','If.'],['захочешь','You come to want / will want — perfective future of захотеть.'],['скажи','Tell me / say — informal imperative of сказать.']]},
  discovery:{title:'A gentle conditional',intro:'Anna leaves the invitation open.',compare:[['Хоч<span class="ending">ешь</span>?','Do you want?'],['За<span class="ending">хочешь</span> — скажи.','If you want to — tell me.']],note:'The prefix за- helps create the perfective verb захотеть. The meaning is not just a changed ending.',quiz:{prompt:'Which word means “if”?',options:['если','скажи'],correct:0}}},
 preference:{ru:'Как интересно! Спасибо, что поделился!',en:'How interesting! Thanks for sharing!',answers:[item('Пожалуйста!','You’re welcome!','Simple','thanks'),item('Спасибо!','Thank you!','Simple','thanks'),item('А ты что любишь?','And what do you like?','Curious','ask')],
  meaning:{title:'Спасибо, что поделился!',summary:'Thanks for sharing!',blocks:[['спасибо, что…','Thank you for … / Thanks that …'],['поделился','Shared — masculine past-tense form.'],['поделилась','Shared — feminine past-tense form.']]},
  discovery:{title:'Past tense can change',intro:'Russian past-tense verbs can reflect the gender of the person being described.',compare:[['подели<span class="ending">лся</span>','Masculine'],['подели<span class="ending">лась</span>','Feminine']],note:'Anna’s prototype currently uses one fixed form. Later we can make it adapt to the learner.',quiz:{prompt:'Which form is feminine?',options:['поделился','поделилась'],correct:1}}},
 closing:{ru:'Спасибо за разговор! До скорого!',en:'Thanks for the conversation! See you soon!',answers:[],
  meaning:{title:'До скорого!',summary:'See you soon!',blocks:[['до','Until / up to. Here: “until.”'],['скорого','Genitive singular form of the adjective скорый — soon / near / forthcoming.'],['скоро','The separate adverb “soon.” It is NOT the word form used in this farewell.']]},
  discovery:{title:'Why скорого?',intro:'До скорого! is a shortened farewell, traditionally understood as До скорого свидания! (“Until we meet again soon”).',compare:[['скор<span class="ending">ый</span>','Basic masculine adjective'],['скор<span class="ending">ого</span>','Genitive adjective after до']],note:'До takes the genitive case. Скорого agrees with the understood noun свидания (also genitive). The everyday expression is simply До скорого! Compare До завтра! and До встречи!',quiz:{prompt:'Which is the natural farewell?',options:['До скоро!','До скорого!'],correct:1}}}
};
function escapeHtml(v){return String(v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
function renderStage(){
 const s=scenes[turn],d=s.discovery;
 if(turn==='closing'){
  $('visual-stage').innerHTML=`<div class="stage-head">Until next time</div><div class="stage-word" lang="ru">До скор<span class="ending">ого</span>!</div><div class="stage-sub">See you soon!</div><div class="stage-tiles"><div class="stage-box"><small>UNTIL</small><strong lang="ru">до</strong></div><div class="stage-box"><small>FROM СКОРЫЙ</small><strong lang="ru">скор<span class="ending">ого</span></strong></div></div><div class="stage-note">Select Language Discovery to see why the ending changes.</div>`;
 }else if(turn==='moreYes'){
  $('visual-stage').innerHTML=`<div class="stage-head">At Anna’s table</div><div class="stage-word" lang="ru">Угощайся!</div><div class="stage-sub">Help yourself!</div><div class="stage-tiles"><div class="stage-box"><small>FAMILIAR</small><strong lang="ru">Угоща<span class="ending">йся</span>!</strong></div><div class="stage-box"><small>POLITE / PLURAL</small><strong lang="ru">Угоща<span class="ending">йтесь</span>!</strong></div></div>`;
 }else if(turn==='yes'){
  $('visual-stage').innerHTML=`<div class="stage-head">A second helping?</div><div class="stage-word" lang="ru">ещё борщ<span class="ending">а</span></div><div class="stage-sub">more borscht</div><div class="stage-tiles"><div class="stage-box"><small>THE FOOD</small><strong lang="ru">борщ</strong></div><div class="stage-box"><small>MORE OF IT</small><strong lang="ru">борщ<span class="ending">а</span></strong></div></div>`;
 }else{
  const cards=d.compare.map(([ru,en])=>`<div class="stage-box"><small>${escapeHtml(en)}</small><strong lang="ru">${ru}</strong></div>`).join('');
  $('visual-stage').innerHTML=`<div class="stage-head">Russian in focus</div><div class="stage-word" lang="ru">${escapeHtml(s.ru)}</div><div class="stage-tiles">${cards}</div>`;
 }
}
function renderDetail(mode){
 const s=scenes[turn], d=s[mode], host=$('discovery-detail');
 if(mode==='meaning'){
  host.innerHTML=`<h4>${escapeHtml(d.title)}</h4><p class="stage-sub">${escapeHtml(d.summary)}</p>${d.blocks.map(([ru,en])=>`<div class="example"><div class="ru" lang="ru">${escapeHtml(ru)}</div><div class="en">${escapeHtml(en)}</div></div>`).join('')}`;
 }else{
  host.innerHTML=`<h4>${escapeHtml(d.title)}</h4><p>${escapeHtml(d.intro)}</p><div class="stage-tiles">${d.compare.map(([ru,en])=>`<div class="stage-box"><small>${escapeHtml(en)}</small><strong lang="ru">${ru}</strong></div>`).join('')}</div><p class="rule">${escapeHtml(d.note)}</p><h5>See what you remember</h5><p>${escapeHtml(d.quiz.prompt)}</p><div class="practice-choices">${d.quiz.options.map((v,i)=>`<button type="button" data-quiz="${i}" lang="ru">${escapeHtml(v)}</button>`).join('')}</div><div class="practice-feedback" id="quiz-feedback" role="status"></div>`;
  host.querySelectorAll('[data-quiz]').forEach(btn=>btn.addEventListener('click',()=>{host.querySelectorAll('[data-quiz]').forEach(b=>b.classList.remove('selected'));btn.classList.add('selected');$('quiz-feedback').textContent=Number(btn.dataset.quiz)===d.quiz.correct?'Exactly! You spotted the pattern.':'Try the other form. Look at the highlighted change.';}));
 }
 host.hidden=false;
}
function toggleDetail(mode){if(activeDetail===mode){activeDetail=null;$('discovery-detail').hidden=true;}else{activeDetail=mode;renderDetail(mode);}updateButtons();}
function updateButtons(){for(const [id,mode] of [['show-meaning','meaning'],['show-discovery','discovery']])$(id).setAttribute('aria-expanded',String(activeDetail===mode));}
function renderAnswers(){const host=$('answers-panel'),s=scenes[turn];host.replaceChildren();for(const a of s.answers){const el=document.createElement('div');el.className='answer-item';const copy=document.createElement('div');copy.className='answer-copy';const ru=document.createElement('div');ru.className='answer-ru';ru.lang='ru';ru.textContent=a.ru;const en=document.createElement('div');en.className='answer-en';en.textContent=a.en;copy.append(ru,en);const level=document.createElement('div');level.className='answer-level';level.textContent=a.level;el.append(copy,level);host.append(el);}if(!s.answers.length)host.textContent='До скорого!';}
function setLine(key){turn=key;const s=scenes[key];$('russian').textContent=s.ru;$('translation').textContent=s.en;activeDetail=null;$('discovery-detail').hidden=true;updateButtons();$('answers-panel').hidden=true;$('show-answers').setAttribute('aria-expanded','false');renderAnswers();renderStage();$('practice-status').textContent='';$('answer').disabled=key==='closing';$('send').disabled=key==='closing';$('typed').disabled=key==='closing';}
function status(msg){$('feedback').textContent=msg;}
function speaking(on){$('light').classList.toggle('active',on);$('avatar-state').textContent=on?'Anna is speaking…':'Anna is ready';}
function speak(){if(!('speechSynthesis' in window)){status('Speech playback is unavailable in this browser.');return;}const token=++audioToken;window.speechSynthesis.cancel();const utterance=new SpeechSynthesisUtterance(scenes[turn].ru);utterance.lang=anna.voiceLanguage||'ru-RU';utterance.rate=.86;const voice=window.speechSynthesis.getVoices().find(v=>v.lang.toLowerCase().startsWith('ru'));if(voice)utterance.voice=voice;else status('No Russian voice found. Install a Russian voice for accurate pronunciation.');utterance.onstart=()=>{if(token===audioToken)speaking(true)};utterance.onend=()=>{if(token===audioToken)speaking(false)};utterance.onerror=()=>{if(token===audioToken){speaking(false);status('Speech playback failed.')}};window.speechSynthesis.speak(utterance);}
function normalize(raw){return raw.toLocaleLowerCase('ru-RU').replace(/ё/g,'е').replace(/[.,!?;:«»]/g,' ').replace(/\s+/g,' ').trim();}
function detect(raw){const t=normalize(raw);if(!t)return null;
 if(turn==='opening'){
  if(/что такое|что это|что за/.test(t))return 'what';
  if(/никогда не проб|не пробовал|не пробовала/.test(t))return 'unknown';
  if(/\bнет\b|не люблю|не очень|не нравится|не хочу/.test(t))return 'no';
  if(/\bда\b|люблю|обожаю|нравится|очень/.test(t))return 'yes';return null;
 }
 if(turn==='yes'||turn==='what'||turn==='unknown'){
  if(/\bнет\b|не хочу|не надо|не нужно|не буду|не очень|сыт|сыта|больше не/.test(t))return 'no';
  if(/\bда\b|хочу|дай|дайте|можно|пожалуйста|попробую|конечно|немного/.test(t))return 'yes';return null;
 }
 if(turn==='no'){
  if(/а ты|а что ты/.test(t))return 'ask';
  if(/пельмен/.test(t))return 'pelmeni';if(/суп/.test(t))return 'soup';if(/пирог/.test(t))return 'pies';if(/картош/.test(t))return 'potatoes';if(/салат/.test(t))return 'salad';
  if(/люблю|нравится|предпочитаю/.test(t))return 'other';return null;
 }
 if(turn==='preference'&&/а ты|что ты любишь/.test(t))return 'ask';
 if(['moreYes','moreNo','preference'].includes(turn)&&/спасибо|пожалуйста|удовольствием|вкусно|обязательно|хорошо/.test(t))return 'thanks';
 return null;
}
function respond(raw){$('transcript').textContent=raw;
 if(practiceMode){practiceMode=false;$('practice-status').textContent=`I heard: ${raw}. Compare with Anna’s words; recognition is not a pronunciation score.`;status('');return;}
 const intent=detect(raw);if(!intent){status('Anna did not recognize that answer yet. Try another wording or see Possible Answers.');return;}
 let next;
 if(turn==='opening')next=intent==='yes'?'yes':intent==='no'?'no':intent;
 else if(['yes','what','unknown'].includes(turn))next=intent==='yes'?'moreYes':'moreNo';
 else if(turn==='no')next='preference';
 else if(['moreYes','moreNo','preference'].includes(turn))next='closing';
 if(!next)return;
 setLine(next);$('typed').value='';status(next==='closing'?'Conversation complete.':'');speak();
}
function listen(practice=false){if(!SpeechRecognition){status('Microphone recognition unavailable. You can type your response.');return;}window.speechSynthesis?.cancel();++audioToken;speaking(false);activeRecognition?.abort();practiceMode=practice;const rec=new SpeechRecognition();activeRecognition=rec;rec.lang='ru-RU';rec.interimResults=false;rec.maxAlternatives=1;rec.onstart=()=>{status(practice?'Listening to your repetition…':'Listening…');$('answer').disabled=true;};rec.onresult=e=>respond(e.results[0][0].transcript);rec.onerror=e=>{practiceMode=false;status(`Microphone: ${e.error}. You can type instead.`)};rec.onend=()=>{$('answer').disabled=turn==='closing';if(activeRecognition===rec)activeRecognition=null;};try{rec.start()}catch{practiceMode=false;status('Could not start the microphone.');$('answer').disabled=false;}}
function reset(){activeRecognition?.abort();activeRecognition=null;practiceMode=false;++audioToken;window.speechSynthesis?.cancel();speaking(false);setLine('opening');$('transcript').textContent='';$('typed').value='';status('');}
$('hear').addEventListener('click',speak);$('hear-again').addEventListener('click',speak);$('answer').addEventListener('click',()=>listen(false));$('practice-phrase').addEventListener('click',()=>listen(true));$('repeat').addEventListener('click',reset);$('show-meaning').addEventListener('click',()=>toggleDetail('meaning'));$('show-discovery').addEventListener('click',()=>toggleDetail('discovery'));$('show-answers').addEventListener('click',()=>{const show=$('answers-panel').hidden;$('answers-panel').hidden=!show;$('show-answers').setAttribute('aria-expanded',String(show));});$('send').addEventListener('click',()=>{const value=$('typed').value.trim();if(value){practiceMode=false;respond(value);}else status('Type a Russian response.');});$('typed').addEventListener('keydown',e=>{if(e.key==='Enter')$('send').click()});reset();
