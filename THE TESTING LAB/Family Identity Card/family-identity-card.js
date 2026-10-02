const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
const RELS=[
["mother","мама"],["father","папа"],["sister","сестра"],["brother","брат"],
["grandmother","бабушка"],["grandfather","дедушка"],["great-grandmother","прабабушка"],["great-grandfather","прадедушка"],["aunt","тётя"],["uncle","дядя"],
["cousin","двоюродный брат / двоюродная сестра"],["wife","жена"],["husband","муж"],
["girlfriend","девушка"],["boyfriend","парень"],["fiancée","невеста"],["fiancé","жених"],
["ex-wife","бывшая жена"],["ex-husband","бывший муж"],["friend","друг / подруга"]
];
const MONTHS=["January","February","March","April","May","June","July","August","September","October","November","December"];
const monthLabels = {
  "January": "January — Январь",
  "February": "February — Февраль",
  "March": "March — Март",
  "April": "April — Апрель",
  "May": "May — Май",
  "June": "June — Июнь",
  "July": "July — Июль",
  "August": "August — Август",
  "September": "September — Сентябрь",
  "October": "October — Октябрь",
  "November": "November — Ноябрь",
  "December": "December — Декабрь"
};
const FEELINGS=[
{en:"I like you.",ru:"Ты мне нравишься.",key:"like"},
{en:"I really like you.",ru:"Ты мне очень нравишься.",key:"really"},
{en:"I love you.",ru:"Я тебя люблю.",key:"love"},
{en:"I adore you.",ru:"Я тебя просто обожаю.",key:"adore"}
];
let state={owner:{name:"Michael",month:"February",birthYear:""},people:[],specialId:null,tryFeeling:"love",pet:"dog",petFeeling:"love"};
const DB="familyIdentityCardDB", STORE="state";
function openDB(){return new Promise((res,rej)=>{let r=indexedDB.open(DB,1);r.onupgradeneeded=()=>r.result.createObjectStore(STORE);r.onsuccess=()=>res(r.result);r.onerror=()=>rej(r.error)})}
async function save(){const db=await openDB();const tx=db.transaction(STORE,"readwrite");tx.objectStore(STORE).put(state,"app");return new Promise(r=>tx.oncomplete=r)}
async function load(){try{const db=await openDB();const tx=db.transaction(STORE,"readonly");const req=tx.objectStore(STORE).get("app");await new Promise(r=>tx.oncomplete=r);if(req.result)state=req.result}catch(e){}}
async function clearAll(){if(!confirm("Clear all Family Identity Card information and photos stored by this component in this browser?"))return;indexedDB.deleteDatabase(DB);state={owner:{name:"Michael",month:"February",birthYear:""},people:[],specialId:null,tryFeeling:"love",pet:"dog",petFeeling:"love"};renderAll();show("launch")}
function fillSelect(el,arr,placeholder){el.innerHTML=placeholder?`<option value="">${placeholder}</option>`:"";arr.forEach(([v,t])=>el.add(new Option(t,v)))}
function personOptions(el,placeholder="Choose a person"){el.innerHTML=`<option value="">${placeholder}</option>`;state.people.forEach(p=>el.add(new Option(`${p.name||"Unnamed"} — ${p.relationship}`,p.id)))}
function speak(t){if(!("speechSynthesis"in window))return; speechSynthesis.cancel();let u=new SpeechSynthesisUtterance(t);u.lang="ru-RU";speechSynthesis.speak(u)}
function photoData(file){return new Promise((res,rej)=>{if(!file)return res("");let r=new FileReader();r.onload=()=>res(r.result);r.onerror=rej;r.readAsDataURL(file)})}
function ruRel(rel){return RELS.find(x=>x[0]===rel)?.[1]||rel}
function show(id){
 $$(".screen").forEach(s=>s.classList.toggle("active",s.id===id));
 if(id==="connections")resetConnectionsEntryState();
 if(id==="explore")renderExplore();
 if(id==="people")renderTryPeople();
 if(id==="pets")renderPets();
 window.scrollTo(0,0)
}
function person(id){return state.people.find(p=>p.id===id)}
function callSuggestions(p){
 const map={mother:["мама","мамочка"],father:["папа","папочка"],grandfather:["дедуля","дедушка"],grandmother:["бабуля","бабушка"],brother:["братишка","брат"],sister:["сестрёнка","сеструшка"]};
 return map[p?.relationship]||[ruRel(p?.relationship||""),"дорогой / дорогая"];
}
function renderPeople(){
 $("#peopleList").innerHTML=state.people.length?"":"<p>No people added yet.</p>";
 state.people.forEach(p=>{let d=document.createElement("div");d.className="person-row";d.innerHTML=`${p.photo?`<img src="${p.photo}">`:`<div class="avatar">👤</div>`}<div><b>${p.name||"Unnamed"}</b><br>${ruRel(p.relationship)} — ${p.relationship}</div><button data-edit="${p.id}">✎</button>`;$("#peopleList").append(d)});
 $$("[data-edit]").forEach(b=>b.onclick=()=>editPerson(b.dataset.edit));
}
async function editPerson(id){let p=person(id);if(!p)return;let n=prompt("Name:",p.name);if(n===null)return;let y=prompt("Birth year (optional):",p.birthYear||"");if(y===null)return;p.name=n.trim()||p.name;p.birthYear=y.trim();await save();renderAll()}
function siblingRussian(p){
 const base=p.relationship==="sister"?"сестра":"брат";
 const female=p.relationship==="sister";
 const mine=parseInt(state.owner.birthYear,10), theirs=parseInt(p.birthYear,10);
 if(!mine||!theirs)return base;
 if(theirs<mine)return female?"старшая сестра":"старший брат";
 if(theirs>mine)return female?"младшая сестра":"младший брат";
 if(p.siblingOrder==="before")return female?"старшая сестра":"старший брат";
 if(p.siblingOrder==="after")return female?"младшая сестра":"младший брат";
 return base;
}
function familyRussian(p){return ["brother","sister"].includes(p?.relationship)?siblingRussian(p):ruRel(p?.relationship||"")}
const FAMILY_LAYOUT={
 "great-grandfather":[[7.5,12],[28.5,12],[55.5,12],[76.5,12]],
 "great-grandmother":[[16.5,12],[37.5,12],[64.5,12],[85.5,12]],
 grandfather:[[20.5,34],[66.5,34]],
 grandmother:[[30.5,34],[56.5,34]],
 uncle:[[29.5,56],[21.5,56],[13.5,56],[5.5,56]],
 mother:[[37.5,56]],father:[[49.5,56]],
 aunt:[[57.5,56],[65.5,56],[73.5,56],[81.5,56]]
};
const SIBLING_POSITIONS=[[28,77],[58,77],[20,77],[66,77]];
const FAMILY_CLUES={mother:"Mother",father:"Father",grandmother:"Grandmother",grandfather:"Grandfather","great-grandmother":"Great-grandmother","great-grandfather":"Great-grandfather",brother:"Brother",sister:"Sister",aunt:"Aunt",uncle:"Uncle",cousin:"Cousin"};
const FAMILY_GENDER={mother:"female",father:"male",grandmother:"female",grandfather:"male","great-grandmother":"female","great-grandfather":"male",brother:"male",sister:"female",aunt:"female",uncle:"male"};
let activeFamilyEdit=null;
let pendingSiblingBlank=false;
function peopleForRelationship(rel){return state.people.filter(p=>p.relationship===rel)}
function siblingPeople(){return state.people.filter(p=>["brother","sister"].includes(p.relationship))}
function maxForRelationship(rel){return ["aunt","uncle","cousin","great-grandmother","great-grandfather"].includes(rel)?4:(["grandmother","grandfather"].includes(rel)?2:1)}
function parentSiblingPeople(branch){
 const all=state.people.filter(p=>["aunt","uncle"].includes(p.relationship));
 const tagged=all.filter(p=>p.parentSiblingBranch===branch);
 const untagged=all.filter(p=>!p.parentSiblingBranch);
 // Preserve existing prototype data sensibly: untagged uncles begin on Anna's side,
 // untagged aunts begin on John's side, matching the previous left/right layout.
 return [...tagged,...untagged.filter(p=>branch==="maternal"?p.relationship==="uncle":p.relationship==="aunt")].slice(0,4);
}
function familySlots(){
 const slots=[];
 Object.entries(FAMILY_LAYOUT).forEach(([rel,positions])=>{
  if(rel==="aunt"||rel==="uncle")return;
  const people=peopleForRelationship(rel), max=Math.min(maxForRelationship(rel),positions.length);
  const permanentGreatGrandparents=["great-grandfather","great-grandmother"].includes(rel);
  const visible=permanentGreatGrandparents ? max : Math.min(max,Math.max(1,people.length+(people.length<max?1:0)));
  for(let i=0;i<visible;i++)slots.push({rel,index:i,pos:positions[i],person:people[i]||null});
 });
 // Parent-generation sibling branches: one next-available placeholder per side,
 // beginning nearest Anna/John and expanding outward. Each side owns its own limit of four.
 const maternal=parentSiblingPeople("maternal");
 const paternal=parentSiblingPeople("paternal");
 maternal.forEach((p,i)=>slots.push({rel:p.relationship,index:i,pos:FAMILY_LAYOUT.uncle[i],person:p,parentSiblingBranch:"maternal"}));
 paternal.forEach((p,i)=>slots.push({rel:p.relationship,index:i,pos:FAMILY_LAYOUT.aunt[i],person:p,parentSiblingBranch:"paternal"}));
 if(maternal.length<4)slots.push({rel:"parent-sibling",index:maternal.length,pos:FAMILY_LAYOUT.uncle[maternal.length],person:null,parentSiblingBranch:"maternal"});
 if(paternal.length<4)slots.push({rel:"parent-sibling",index:paternal.length,pos:FAMILY_LAYOUT.aunt[paternal.length],person:null,parentSiblingBranch:"paternal"});

 const siblings=siblingPeople().slice(0,4);
 siblings.forEach((p,i)=>slots.push({rel:p.relationship,index:i,pos:SIBLING_POSITIONS[i],person:p,siblingSlot:true}));
 const initialBlankCount=Math.max(0,2-siblings.length);
 for(let i=0;i<initialBlankCount;i++){
  const posIndex=siblings.length+i;
  slots.push({rel:"sibling",index:posIndex,pos:SIBLING_POSITIONS[posIndex],person:null,siblingSlot:true});
 }
 if(pendingSiblingBlank && siblings.length<4 && initialBlankCount===0){
  slots.push({rel:"sibling",index:siblings.length,pos:SIBLING_POSITIONS[siblings.length],person:null,siblingSlot:true,pending:true});
 }
 return slots;
}
function addFamilyPath(svg,points,cls=""){
 const path=document.createElementNS("http://www.w3.org/2000/svg","path");
 path.setAttribute("d",points);if(cls)path.setAttribute("class",cls);svg.append(path);
}
function renderFamilyLines(slots){
 const svg=$("#familyLines");if(!svg)return;svg.innerHTML="";
 const has=(...rels)=>slots.some(s=>s.person&&rels.includes(s.rel));
 const siblingSlots=slots.filter(s=>s.siblingSlot&&s.person);
 if(has("mother","father")||siblingSlots.length){
  // Mother + Father couple rail and descent to the children rail.
  addFamilyPath(svg,"M 375 390 L 495 390","parent-couple");
  addFamilyPath(svg,"M 435 390 L 435 468");
  // ME is always one of their children.
  addFamilyPath(svg,"M 435 468 L 435 520");
  // Each added brother/sister joins the same white children rail as ME.
  if(siblingSlots.length){
   const xs=siblingSlots.map(s=>s.pos[0]*10);
   const minX=Math.min(435,...xs), maxX=Math.max(435,...xs);
   addFamilyPath(svg,`M ${minX} 468 L ${maxX} 468`);
   siblingSlots.forEach(s=>{const x=s.pos[0]*10;addFamilyPath(svg,`M ${x} 468 L ${x} 500`)});
  }
 }
 if(has("grandmother","grandfather")){
  // Mirror the great-grandparent → grandparent stepped geometry:
  // Larry + Rose → Anna, and Sarah + Tomas → John.
  addFamilyPath(svg,"M 205 245 L 305 245");
  addFamilyPath(svg,"M 255 245 L 255 315 L 375 315 L 375 370");
  addFamilyPath(svg,"M 565 245 L 665 245");
  addFamilyPath(svg,"M 615 245 L 615 315 L 495 315 L 495 370");
 }
 // Four permanent great-grandparent couples, each connected to the grandparent who is their child.
 const greatPairs=[
  {left:75,right:165,child:205},
  {left:285,right:375,child:305},
  {left:555,right:645,child:565},
  {left:765,right:855,child:665}
 ];
 greatPairs.forEach(pair=>{
  const mid=(pair.left+pair.right)/2;
  // Every great-grandparent couple uses the same two-part connector:
  // one centered couple rail, then one clean centered descent to the grandparent.
  // A diagonal descent avoids four different-looking stepped elbows while leaving every card fixed.
  addFamilyPath(svg,`M ${pair.left} 105 L ${pair.right} 105`);
  addFamilyPath(svg,`M ${mid} 105 L ${pair.child} 225`);
 });
 const maternalParentSiblings=slots.filter(s=>s.parentSiblingBranch==="maternal"&&s.person);
 const paternalParentSiblings=slots.filter(s=>s.parentSiblingBranch==="paternal"&&s.person);
 if(maternalParentSiblings.length){
  const xs=maternalParentSiblings.map(s=>s.pos[0]*10);
  const minX=Math.min(375,...xs);
  addFamilyPath(svg,`M ${minX} 315 L 375 315`);
  maternalParentSiblings.forEach(s=>{const x=s.pos[0]*10;addFamilyPath(svg,`M ${x} 315 L ${x} 370`)});
 }
 if(paternalParentSiblings.length){
  const xs=paternalParentSiblings.map(s=>s.pos[0]*10);
  const maxX=Math.max(495,...xs);
  addFamilyPath(svg,`M 495 315 L ${maxX} 315`);
  paternalParentSiblings.forEach(s=>{const x=s.pos[0]*10;addFamilyPath(svg,`M ${x} 315 L ${x} 370`)});
 }
 if(has("cousin")){
  addFamilyPath(svg,"M 180 390 L 180 590");
  addFamilyPath(svg,"M 820 390 L 820 590");
 }
}
function renderConnections(){
 let area=$("#treeNodes");if(!area)return;area.innerHTML="";
 const slots=familySlots();
 slots.forEach(s=>{
  const d=document.createElement("button");d.type="button";const isSiblingCard=!!s.person&&(!!s.siblingSlot||!!s.parentSiblingBranch);d.className="family-slot "+(s.person?"populated":"empty")+(s.person?" "+(FAMILY_GENDER[s.rel]||""):"")+(isSiblingCard?" sibling-family-card":"");d.style.left=s.pos[0]+"%";d.style.top=s.pos[1]+"%";
  if(s.person){const p=s.person;d.innerHTML=`${p.photo?`<img src="${p.photo}" alt="">`:`<span class="slot-avatar">👤</span>`}<span class="slot-name">${p.name||"Unnamed"}</span><span class="slot-russian">${familyRussian(p)}</span>${p.birthYear?`<span class="slot-year">${p.birthYear}</span>`:""}`}
  else if(s.siblingSlot)d.innerHTML=`<span class="slot-clue">Add Family Member</span><span class="slot-add">Click to add</span>`;
  else if(s.rel==="parent-sibling")d.innerHTML=`<span class="slot-clue">Add Family Member</span><span class="slot-add">Click to add</span>`;
  else if(s.rel==="great-grandfather")d.innerHTML=`<span class="slot-clue">Grandfather</span>`;
  else if(s.rel==="great-grandmother")d.innerHTML=`<span class="slot-clue">Grandmother</span>`;
  else d.innerHTML=`<span class="slot-clue">${FAMILY_CLUES[s.rel]||s.rel}</span><span class="slot-add">Click to add</span>`;
  d.onclick=()=>openFamilyEditor(s.rel,s.index,s.person?.id||null,s.parentSiblingBranch||null);area.append(d)
 });
 renderFamilyLines(slots);
 const meName=$("#connectionsOwnerName");if(meName)meName.textContent=state.owner.name||"ME";
}
const EDITABLE_RELATIONSHIPS=["father","mother","brother","sister","grandfather","grandmother","great-grandfather","great-grandmother"];
function relationshipWord(rel){
 const labels={father:"father",mother:"mother",brother:"brother",sister:"sister",grandfather:"grandfather",grandmother:"grandmother","great-grandfather":"great-grandfather","great-grandmother":"great-grandmother",uncle:"uncle",aunt:"aunt"};
 return labels[rel]||rel||"family member";
}
function parentBranchPersonName(branch){
 const rel=branch==="maternal"?"mother":"father";
 return peopleForRelationship(rel)[0]?.name || (branch==="maternal"?"Mother":"Father");
}
function setRelationshipChoices(mode="all",selected=""){
 const select=$("#editorRelationshipChoice");
 if(!select)return;
 const choices=mode==="siblings"?["brother","sister"]:EDITABLE_RELATIONSHIPS;
 const labels={father:"Father — отец",mother:"Mother — мать",brother:"Brother — брат",sister:"Sister — сестра",grandfather:"Grandfather — дедушка",grandmother:"Grandmother — бабушка","great-grandfather":"Great Grandfather — прадедушка","great-grandmother":"Great Grandmother — прабабушка"};
 select.innerHTML='<option value="">Choose / change…</option>';
 choices.forEach(rel=>select.add(new Option(labels[rel],rel)));
 select.value=selected||"";
}
function updateConnectionContext(){
 const box=$("#connectionContextStatement");if(!box)return;
 if(!activeFamilyEdit){box.textContent="";return}
 const {rel,personId,parentSiblingBranch}=activeFamilyEdit;
 const p=personId?person(personId):null;
 const chosen=$("#editorRelationshipChoice")?.value||"";
 if(rel==="parent-sibling"||parentSiblingBranch){
  const parentName=parentBranchPersonName(parentSiblingBranch);
  const siblingRel=chosen || (p?.relationship==="aunt"?"sister":p?.relationship==="uncle"?"brother":"");
  if(siblingRel==="brother")box.textContent=`${parentName}'s brother is your uncle — дядя`;
  else if(siblingRel==="sister")box.textContent=`${parentName}'s sister is your aunt — тётя`;
  else box.textContent=`${parentName}'s sibling`;
  return;
 }
 const displayRel=chosen || (rel==="sibling"?"":(p?.relationship||rel));
 if(rel==="sibling"&&!displayRel){box.textContent="Your sibling";return}
 if(!displayRel){box.textContent="";return}
 const name=p?.name?.trim();
 box.textContent=name?`${name} is your ${relationshipWord(displayRel)} — ${ruRel(displayRel)}`:`This is your ${relationshipWord(displayRel)} — ${ruRel(displayRel)}`;
}
function resetConnectionsEntryState(){
 activeFamilyEdit=null;
 pendingSiblingBlank=false;
 const launcher=$("#connectionsMenuLauncher"), tools=$(".connection-tools");
 if(launcher){launcher.hidden=false;launcher.style.display=""}
 if(tools){tools.hidden=true;tools.style.display=""}
 setRelationshipChoices("all","");
 const context=$("#connectionContextStatement");if(context)context.textContent="";
 $("#editorName").value="";$("#editorBirthYear").value="";$("#editorPhoto").value="";
 $("#removeFamilyMember").hidden=true;
}
function openConnectionsMenu(){
 const launcher=$("#connectionsMenuLauncher"), tools=$(".connection-tools");
 if(launcher){launcher.hidden=true;launcher.style.display="none"}
 if(tools){tools.hidden=false;tools.removeAttribute("hidden");tools.style.display="block"}
 activeFamilyEdit=null;
 setRelationshipChoices("all","");
 const context=$("#connectionContextStatement");if(context)context.textContent="";
 $("#editorName").value="";$("#editorBirthYear").value="";$("#editorPhoto").value="";
 $("#removeFamilyMember").hidden=true;
}
function collapseConnectionsMenu(){
 activeFamilyEdit=null;pendingSiblingBlank=false;
 const launcher=$("#connectionsMenuLauncher"), tools=$(".connection-tools");
 if(tools){tools.hidden=true;tools.style.display="none"}
 if(launcher){launcher.hidden=false;launcher.style.display=""}
 setRelationshipChoices("all","");
 const context=$("#connectionContextStatement");if(context)context.textContent="";
 $("#editorName").value="";$("#editorBirthYear").value="";$("#editorPhoto").value="";
 $("#removeFamilyMember").hidden=true;
}
function openFamilyEditor(rel,index,personId,parentSiblingBranch=null){
 const launcher=$("#connectionsMenuLauncher"), tools=$(".connection-tools");
 if(launcher){launcher.hidden=true;launcher.style.display="none"}
 if(tools){tools.hidden=false;tools.removeAttribute("hidden");tools.style.display="block"}
 const p=personId?person(personId):null;
 const genericSibling=rel==="sibling";
 const parentSibling=rel==="parent-sibling"||parentSiblingBranch!=null;
 activeFamilyEdit={rel,index,personId,parentSiblingBranch};
 let selected="";
 if(parentSibling)selected=p?.relationship==="aunt"?"sister":p?.relationship==="uncle"?"brother":"";
 else if(genericSibling)selected=p?.relationship||"";
 else selected=p?.relationship||rel;
 setRelationshipChoices((genericSibling||parentSibling)?"siblings":"all",selected);
 $("#editorName").value=p?.name||"";$("#editorBirthYear").value=p?.birthYear||"";$("#editorPhoto").value="";$("#removeFamilyMember").hidden=!p;
 updateConnectionContext();
 updateSameYearChoice();
}
function closeFamilyEditor(){
 activeFamilyEdit=null;pendingSiblingBlank=false;
 setRelationshipChoices("all","");
 const context=$("#connectionContextStatement");if(context)context.textContent="";
 $("#editorName").value="";$("#editorBirthYear").value="";$("#editorPhoto").value="";$("#removeFamilyMember").hidden=true;
 renderConnections();
}
function updateSameYearChoice(){
 const box=$("#sameYearChoice");if(!box||!activeFamilyEdit){if(box)box.hidden=true;return}
 const chosen=$("#editorRelationshipChoice")?.value;
 const sibling=activeFamilyEdit.rel==="sibling"||activeFamilyEdit.rel==="parent-sibling"||activeFamilyEdit.parentSiblingBranch!=null||["brother","sister"].includes(chosen);
 const mine=String(state.owner.birthYear||""), theirs=String($("#editorBirthYear").value||"");box.hidden=!(sibling&&mine&&theirs&&mine===theirs);
 if(!box.hidden){const p=activeFamilyEdit.personId?person(activeFamilyEdit.personId):null;const r=box.querySelector(`input[value="${p?.siblingOrder||""}"]`);if(r)r.checked=true}
}

function renderCallThem(){
 personOptions($("#callPerson"));let box=$("#personalCallList");box.innerHTML="<h3>Your personal list</h3>";
 state.people.filter(p=>p.callName).forEach(p=>box.innerHTML+=`<div>🔊 ${ruRel(p.relationship)} — <b>${p.callName}</b></div>`);
 updateCallOptions();
}
function updateCallOptions(){let p=person($("#callPerson").value);let o=$("#callOptions");o.innerHTML="";if(!p)return;callSuggestions(p).forEach(s=>{let b=document.createElement("button");b.textContent="🔊 "+s;b.onclick=()=>{$("#callEnglish").value=s;speak(s)};o.append(b)})}
function special(){return person(state.specialId)||state.people[0]}
function renderSpecial(){
 personOptions($("#specialPerson"));fillSelect($("#specialRelationship"),RELS);
 let p=special();if(p){state.specialId=p.id;$("#specialPerson").value=p.id;$("#specialRelationship").value=p.relationship;$("#specialName").textContent=p.name;$("#specialRelLabel").textContent=p.relationship;$("#specialPhoto").style.display=p.photo?"block":"none";$("#specialPhoto").src=p.photo||"";$("#specialPortraitFallback").style.display=p.photo?"none":"block"}
 let ex=$("#expressionList");ex.innerHTML="";if(!p)return;
 const rr=ruRel(p.relationship), n=p.name||"";
 const lines=[[`Это ${["wife","mother","sister","grandmother","aunt","girlfriend","fiancée","ex-wife"].includes(p.relationship)?"моя":"мой"} ${rr}, ${n}.`,`This is my ${p.relationship}, ${n}.`],[`Е${["wife","mother","sister","grandmother","aunt","girlfriend","fiancée","ex-wife"].includes(p.relationship)?"ё":"го"} зовут ${n}.`,`Their name is ${n}.`],[`Я очень люблю ${n}.`,`I love ${n} very much.`]];
 lines.forEach(([r,e])=>{let d=document.createElement("div");d.className="expression";d.innerHTML=`<b>${r}</b><i>${e}</i> <button class="speaker no-print">🔊</button>`;d.querySelector("button").onclick=()=>speak(r);ex.append(d)})
}
function renderExplore(){
 let p=special();$("#exploreName").textContent=p?.name||"Someone Special";$("#exploreRel").textContent=p?.relationship||"";$("#explorePhoto").style.display=p?.photo?"block":"none";$("#explorePhoto").src=p?.photo||"";$("#exploreFallback").style.display=p?.photo?"none":"block";
 $("#feelingCards").innerHTML="";FEELINGS.forEach(f=>{let d=document.createElement("div");d.className="feeling-card";d.innerHTML=`<b>${f.ru}</b><span>${f.en}</span><button class="speaker no-print">🔊</button>`;d.querySelector("button").onclick=()=>speak(f.ru);$("#feelingCards").append(d)})
}
function loveSentence(p,key){
 if(!p)return["",""];
 let female=["wife","mother","sister","grandmother","aunt","girlfriend","fiancée","ex-wife"].includes(p.relationship);
 let obj=p.name||"";
 if(key==="like")return[`Мне нравится ${obj}.`,`I like ${obj}.`];
 if(key==="really")return[`Мне очень нравится ${obj}.`,`I really like ${obj}.`];
 if(key==="adore")return[`Я просто обожаю ${obj}.`,`I adore ${obj}.`];
 return[`Я люблю ${obj}.`,`I love ${obj}.`];
}
function renderTryPeople(){
 personOptions($("#tryPerson"));fillSelect($("#tryRelationship"),RELS);let p=special();if(p){$("#tryPerson").value=p.id;$("#tryRelationship").value=p.relationship}
 let q=$("#quickPeople");q.innerHTML="";let rels=[["mother","Mom"],["father","Dad"],["brother","Brother"],["sister","Sister"],["girlfriend","Girlfriend"],["boyfriend","Boyfriend"]];
 rels.forEach(([r,l])=>{let b=document.createElement("button");b.innerHTML=`👤<br>${l}<br><small>${ruRel(r)}</small>`;b.onclick=()=>{let p=state.people.find(x=>x.relationship===r);if(p){$("#tryPerson").value=p.id;$("#tryRelationship").value=p.relationship;updateTrySentence()}else alert(`Add a ${l.toLowerCase()} in My People first.`)};q.append(b)});
 let add=document.createElement("button");add.textContent="＋ Someone New";add.onclick=()=>show("launch");q.append(add);
 let f=$("#tryFeelings");f.innerHTML="";FEELINGS.forEach(x=>{let b=document.createElement("button");b.textContent=x.en;b.onclick=()=>{state.tryFeeling=x.key;updateTrySentence();save()};f.append(b)});updateTrySentence()
}
function updateTrySentence(){let p=person($("#tryPerson").value)||special();if(!p)return;$("#tryRelationship").value=p.relationship;let [r,e]=loveSentence(p,state.tryFeeling);$("#tryRussian").textContent=r;$("#tryEnglish").textContent=e;$("#trySpeak").onclick=()=>speak(r)}
function renderPets(){
 const pets=[["dog","🐶","Dog","собака"],["cat","🐱","Cat","кошка"],["pet","🐾","Pet","питомец"],["other","＋","Another Pet",""]];
 let pc=$("#petChoices");pc.innerHTML="";pets.forEach(([k,em,en,ru])=>{let b=document.createElement("button");b.innerHTML=`<span class="emoji">${em}</span>${en}<br><small>${ru}</small>`;b.onclick=()=>{state.pet=k;updatePet();save()};pc.append(b)});
 let pf=$("#petFeelings");pf.innerHTML="";FEELINGS.forEach(x=>{let b=document.createElement("button");b.textContent=x.en;b.onclick=()=>{state.petFeeling=x.key;updatePet();save()};pf.append(b)});updatePet()
}
function updatePet(){
 let map={dog:["🐶","собаку","my dog"],cat:["🐱","кошку","my cat"],pet:["🐾","питомца","my pet"],other:["🐾","питомца","my pet"]};let [em,ru,en]=map[state.pet]||map.dog;$("#petPic").textContent=em;
 let r,e;if(state.petFeeling==="like"){r=`Мне нравится мой питомец.`;e=`I like ${en}.`}else if(state.petFeeling==="really"){r=`Мне очень нравится мой питомец.`;e=`I really like ${en}.`}else if(state.petFeeling==="adore"){r=`Я просто обожаю ${ru}.`;e=`I adore ${en}.`}else{r=`Я очень люблю ${ru}.`;e=`I love ${en} very much.`}
 $("#petRussian").textContent=r;$("#petEnglish").textContent=e;$("#petSpeak").onclick=()=>speak(r)
}
function renderAll(){
 $("#ownerName").value=state.owner.name||"";$("#ownerMonth").value=state.owner.month||"February";if($("#ownerBirthYear"))$("#ownerBirthYear").value=state.owner.birthYear||"";
 const ownerPhoto=$("#ownerPhoto"), ownerFallback=$("#ownerPhotoFallback");
 const connectionsOwnerPhoto=$("#connectionsOwnerPhoto"), connectionsOwnerFallback=$("#connectionsOwnerPhotoFallback");
 const hasPhoto=!!state.owner.photo;
 if(ownerPhoto&&ownerFallback){
  ownerPhoto.style.display=hasPhoto?"block":"none";
  ownerPhoto.src=hasPhoto?state.owner.photo:"";
  ownerFallback.style.display=hasPhoto?"none":"flex";
 }
 if(connectionsOwnerPhoto&&connectionsOwnerFallback){
  connectionsOwnerPhoto.style.display=hasPhoto?"block":"none";
  connectionsOwnerPhoto.src=hasPhoto?state.owner.photo:"";
  connectionsOwnerFallback.style.display=hasPhoto?"none":"flex";
 }
 renderPeople();renderConnections();renderCallThem();renderSpecial()
}
async function init(){
 const russianNameInput=$("#ownerNameRussian");

 fillSelect($("#addRelationship"),RELS);
 const updateAddRussianPreview=()=>{
  const rel=$("#addRelationship").value;
  const preview=$("#addRussianPreview");
  if(preview)preview.textContent=rel?ruRel(rel):"Выберите отношение";
 };
 $("#addRelationship").onchange=updateAddRussianPreview;
 updateAddRussianPreview();fillSelect($("#specialRelationship"),RELS);fillSelect($("#tryRelationship"),RELS);
 $("#ownerMonth").innerHTML="";MONTHS.forEach(m=>$("#ownerMonth").add(new Option(monthLabels[m]||m,m)));
 await load();renderAll();
 $$("[data-go]").forEach(b=>b.onclick=()=>show(b.dataset.go));
 $("#homeBtn").onclick=()=>show("launch");$("#printBtn").onclick=()=>window.print();$("#clearBtn").onclick=clearAll;
 $("#ownerName").onchange=async e=>{state.owner.name=e.target.value;await save()};$("#ownerMonth").onchange=async e=>{state.owner.month=e.target.value;await save()};if($("#ownerBirthYear"))$("#ownerBirthYear").onchange=async e=>{state.owner.birthYear=e.target.value.replace(/\D/g,"").slice(0,4);e.target.value=state.owner.birthYear;await save();renderConnections()};
 $("#workspaceAddMode").onclick=()=>{$("#addRelationship").focus()};
 $("#workspaceEditMode").onclick=()=>{const first=state.people[0];if(first)editPerson(first.id);else alert("Add a person first.")};
 $("#workspaceRemoveMode").onclick=async()=>{const first=state.people[0];if(!first)return alert("Add a person first.");if(confirm(`Remove ${first.name||"this person"}?`)){state.people=state.people.filter(p=>p.id!==first.id);await save();renderAll()}};
 $("#workspaceListen").onclick=()=>{const rel=$("#addRelationship").value;if(rel)speak(ruRel(rel));else alert("Choose a relationship first.")};
 $("#addRussianSpeak").onclick=()=>{const rel=$("#addRelationship").value;if(rel)speak(ruRel(rel));};
 if(russianNameInput){
  russianNameInput.value=state.owner.russianName||"";
  russianNameInput.oninput=async e=>{state.owner.russianName=e.target.value;await save();};
 }
 $("#ownerPhotoInput").onchange=async e=>{
  const file=e.target.files[0];
  if(!file)return;
  state.owner.photo=await photoData(file);
  await save();
  renderAll();
 };
 $("#addPersonBtn").onclick=async()=>{let name=$("#addName").value.trim(),relationship=$("#addRelationship").value;if(!relationship)return alert("Choose a relationship.");let photo=await photoData($("#addPhoto").files[0]);state.people.push({id:crypto.randomUUID(),name:name||"Unnamed",relationship,photo,birthYear:"",callName:"",connections:[]});$("#addName").value="";$("#addPhoto").value="";await save();renderAll()};
 $("#connectionsHomeBtn").onclick=()=>show("launch");$("#connectionsPrintBtn").onclick=()=>window.print();$("#connectionsClearBtn").onclick=clearAll;
 const connectionsMenuLauncher=$("#connectionsMenuLauncher");
 if(connectionsMenuLauncher)connectionsMenuLauncher.onclick=openConnectionsMenu;
 const collapseConnectionsMenuBtn=$("#collapseConnectionsMenu");
 if(collapseConnectionsMenuBtn)collapseConnectionsMenuBtn.onclick=collapseConnectionsMenu;
 $("#editorRelationshipChoice").onchange=()=>{updateConnectionContext();updateSameYearChoice()};
 $("#editorBirthYear").oninput=updateSameYearChoice;$("#cancelFamilyEdit").onclick=closeFamilyEditor;
 $("#saveFamilyMember").onclick=async()=>{if(!activeFamilyEdit)return;let {rel,personId,parentSiblingBranch}=activeFamilyEdit;const isParentSibling=rel==="parent-sibling"||parentSiblingBranch!=null;const isSiblingSlot=rel==="sibling"||["brother","sister"].includes(rel);const choice=$("#editorRelationshipChoice").value;if(!choice)return alert("Choose a relationship.");if(isParentSibling){const branchPeople=parentSiblingPeople(parentSiblingBranch);if(!personId&&branchPeople.length>=4)return alert("This parent can have up to four siblings on this family tree.");rel=choice==="sister"?"aunt":"uncle"}else if(isSiblingSlot){if(!personId&&siblingPeople().length>=4)return alert("You can add up to four siblings.");rel=choice}else rel=choice;let p=personId?person(personId):null;const name=$("#editorName").value.trim(),birthYear=$("#editorBirthYear").value.replace(/\D/g,"").slice(0,4),file=$("#editorPhoto").files[0];if(!p){p={id:crypto.randomUUID(),name:name||"Unnamed",relationship:rel,photo:"",birthYear:"",callName:"",connections:[]};state.people.push(p)}p.relationship=rel;if(isParentSibling)p.parentSiblingBranch=parentSiblingBranch;p.name=name||p.name||"Unnamed";p.birthYear=birthYear;if(file)p.photo=await photoData(file);if(["brother","sister"].includes(rel)&&String(state.owner.birthYear||"")===birthYear){const checked=document.querySelector('input[name="siblingOrder"]:checked');p.siblingOrder=checked?.value||p.siblingOrder||""}else p.siblingOrder="";pendingSiblingBlank=false;await save();closeFamilyEditor();renderAll()};
 $("#removeFamilyMember").onclick=async()=>{if(!activeFamilyEdit?.personId)return;const p=person(activeFamilyEdit.personId);if(confirm(`Remove ${p?.name||"this person"} from My People?`)){state.people=state.people.filter(x=>x.id!==activeFamilyEdit.personId);await save();closeFamilyEditor();renderAll()}};
 $("#callPerson").onchange=updateCallOptions;$("#saveCallName").onclick=async()=>{let p=person($("#callPerson").value);if(!p)return alert("Choose a person.");p.callName=$("#callEnglish").value.trim();await save();renderCallThem()};
 $("#specialPerson").onchange=async e=>{state.specialId=e.target.value;await save();renderSpecial()};$("#specialRelationship").onchange=async e=>{let p=special();if(p){p.relationship=e.target.value;await save();renderAll()}};
 $("#specialNew").onclick=()=>show("launch");$("#tryPerson").onchange=updateTrySentence;$("#tryRelationship").onchange=async e=>{let p=person($("#tryPerson").value);if(p){p.relationship=e.target.value;await save();renderAll();renderTryPeople()}};
}
init();

/* PASS #13 — My People utility navigation
   Existing "My People" utility control returns to the Launch/Home screen.
   No data is cleared or reloaded. */
document.addEventListener("click", function (event) {
  const control = event.target.closest("button, a");
  if (!control) return;
  if (control.textContent.trim() !== "My People") return;

  event.preventDefault();

  // Use the prototype's existing screen-navigation function when available.
  if (typeof showScreen === "function") {
    showScreen("launch");
    return;
  }

  // Safe fallback: activate Launch and deactivate sibling app screens.
  const launch = document.getElementById("launch");
  if (!launch) return;

  document.querySelectorAll("section[id]").forEach(function (section) {
    section.classList.remove("active");
    section.hidden = true;
  });
  launch.hidden = false;
  launch.classList.add("active");
  window.scrollTo({ top: 0, left: 0, behavior: "auto" });
});


