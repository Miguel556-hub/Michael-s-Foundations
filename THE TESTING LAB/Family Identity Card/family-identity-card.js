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

const CALL_TERM_DATA={
 mother:[{ru:"мама",note:"Feels like: Mom / Mum — normal, warm everyday term"},{ru:"мамочка",note:"Feels like: Mommy / dear Mom — very affectionate and tender"},{ru:"мамуля",note:"Feels like: Mama / Momma — especially warm and affectionate"},{ru:"мам",note:"Feels like: Mom! / Mum! — casual spoken address"}],
 father:[{ru:"папа",note:"Feels like: Dad / Papa — normal, warm everyday term"},{ru:"папочка",note:"Feels like: Daddy / dear Dad — very affectionate and tender"},{ru:"папуля",note:"Feels like: Papa / Dad — especially warm and affectionate"},{ru:"пап",note:"Feels like: Dad! — casual spoken address"}],
 grandmother:[{ru:"бабушка",note:"Feels like: Grandma — normal, warm everyday term"},{ru:"бабуля",note:"Feels like: Nana / Grandma — warm and affectionate"},{ru:"бабуся",note:"Feels like: Nana / dear Grandma — especially tender"},{ru:"бабуня",note:"Feels like: Granny / Nana — affectionate and homey"}],
 grandfather:[{ru:"дедушка",note:"Feels like: Grandpa — normal, warm everyday term"},{ru:"дедуля",note:"Feels like: Grandpa / Papa — especially warm and affectionate"},{ru:"дедуся",note:"Feels like: Granddad / dear Grandpa — tender and affectionate"},{ru:"дед",note:"Feels like: Granddad / Gramps — short and familiar"}],
 "great-grandmother":[{ru:"прабабушка",note:"Feels like: Great-Grandma — identifies the actual relationship"},{ru:"бабушка",note:"Feels like: Grandma — if that is what your family actually calls her"},{ru:"бабуля",note:"Feels like: Nana / Grandma — warm and affectionate"},{ru:"бабуся",note:"Feels like: Nana / dear Grandma — especially tender"}],
 "great-grandfather":[{ru:"прадедушка",note:"Feels like: Great-Grandpa — identifies the actual relationship"},{ru:"прадед",note:"Feels like: Great-Granddad — shorter and more neutral"},{ru:"дедушка",note:"Feels like: Grandpa — if that is what your family actually calls him"},{ru:"дедуля",note:"Feels like: Grandpa / Papa — warm and affectionate"}],
 sister:[{ru:"сестра",note:"sister — the normal, everyday word"},{ru:"сестрёнка",note:"little sis / sis — warm and affectionate"},{ru:"сестричка",note:"dear sister / sis — affectionate and tender"},{ru:"сеструха",note:"sis — very informal and slangy"}],
 brother:[{ru:"брат",note:"brother — the normal, everyday word"},{ru:"братишка",note:"little bro / dear brother — warm and affectionate"},{ru:"братец",note:"brother / bro — familiar and affectionate"},{ru:"братан",note:"bro / dude — very informal and slangy"}],
 aunt:[{ru:"тётя",note:"Feels like: Aunt / Auntie — normal, warm everyday term"},{ru:"тётушка",note:"Feels like: dear Aunt / Auntie — affectionate and somewhat traditional"}],
 uncle:[{ru:"дядя",note:"Feels like: Uncle — normal, warm everyday term"},{ru:"дядюшка",note:"Feels like: dear Uncle — affectionate and somewhat traditional"}],
 wife:[{ru:"жена",note:"Wife"}],husband:[{ru:"муж",note:"Husband"}],
 girlfriend:[{ru:"девушка",note:"Girlfriend"}],boyfriend:[{ru:"парень",note:"Boyfriend"}],
 "fiancée":[{ru:"невеста",note:"Fiancée"}],"fiancé":[{ru:"жених",note:"Fiancé"}],
 "ex-wife":[{ru:"бывшая жена",note:"Ex-wife"}],"ex-husband":[{ru:"бывший муж",note:"Ex-husband"}]
};
function callTerms(p){return CALL_TERM_DATA[p?.relationship]||[{ru:ruRel(p?.relationship||""),note:"Natural family term"}]}
function englishRelationship(rel){return String(rel||"").replaceAll("-"," ")}
function possessiveRelation(p){
 const rel=englishRelationship(p?.relationship);return rel?`Your ${rel}`:"Family member";
}
function callExampleFor(p){
 const examples={grandfather:"Grandpa, Granddad, Pop…",grandmother:"Grandma, Granny, Nana…",mother:"Mom, Momma, Mommy…",father:"Dad, Daddy, Papa…",brother:"Bro, Buddy, his name…",sister:"Sis, Sissy, her name…"};
 return examples[p?.relationship]||"Use the name or endearing term you really use.";
}
function renderCallThem(){
 const select=$("#callPerson"),previous=select.value;
 personOptions(select,"Choose a family member…");
 if(previous&&person(previous))select.value=previous;
 renderPersonalCallList();
 updateCallOptions();
}
let selectedPersonalCallId="";
function renderPersonalCallList(){
 const box=$("#personalCallList");
 box.innerHTML="";
 const h=document.createElement("h2");h.textContent="Your Personal List";box.append(h);
 const intro=document.createElement("p");intro.className="list-intro";intro.textContent="Click a person to select or change a saved choice.";box.append(intro);
 const scroll=document.createElement("div");scroll.className="personal-list-scroll";box.append(scroll);
 const chosen=state.people.filter(p=>p.callName);
 if(!chosen.some(p=>p.id===selectedPersonalCallId))selectedPersonalCallId="";
 if(!chosen.length){const e=document.createElement("p");e.className="personal-empty";e.textContent="Your choices will appear here as you build your personal family vocabulary.";scroll.append(e)}
 chosen.forEach(p=>{
   const row=document.createElement("div");row.className="personal-call-entry"+(p.id===selectedPersonalCallId?" selected":"");row.tabIndex=0;row.title=`Select ${p.name}`;
   if(p.photo){const img=document.createElement("img");img.src=p.photo;img.alt="";row.append(img)}else{const f=document.createElement("div");f.className="mini-fallback";f.textContent="👤";row.append(f)}
   const copy=document.createElement("div");const strong=document.createElement("strong");strong.textContent=`${p.name} — ${p.callName}`;copy.append(strong);
   const small=document.createElement("small");small.textContent=englishRelationship(p.relationship);copy.append(small);row.append(copy);
   const sp=document.createElement("button");sp.className="list-speaker no-print";sp.type="button";sp.textContent="🔊";sp.title=`Hear ${p.callName}`;sp.onclick=e=>{e.stopPropagation();speak(p.callName)};row.append(sp);
   const choose=()=>{selectedPersonalCallId=p.id;$("#callPerson").value=p.id;updateCallOptions();renderPersonalCallList()};row.onclick=choose;row.onkeydown=e=>{if(e.key==="Enter"||e.key===" "){e.preventDefault();choose()}};scroll.append(row);
 });
 const remove=document.createElement("button");remove.id="removePersonalCall";remove.className="personal-remove no-print";remove.type="button";remove.disabled=!selectedPersonalCallId;remove.textContent=selectedPersonalCallId?"Remove Selected Person":"Click a person to remove";
 remove.onclick=async()=>{const p=person(selectedPersonalCallId);if(!p)return;p.callEnglish="";p.callName="";selectedPersonalCallId="";await save();renderPersonalCallList();updateCallOptions()};box.append(remove);
}
function updateCallOptions(){
 const p=person($("#callPerson").value),selected=$("#callSelectedPerson"),o=$("#callOptions"),saveBtn=$("#saveCallName");
 o.innerHTML="";saveBtn.disabled=true;saveBtn.dataset.choice="";saveBtn.textContent="Choose a Russian option";
 if(!p){selected.hidden=true;$("#callOptionsHeading").textContent="Here are some natural Russian options:";return}
 selected.hidden=false;$("#callPersonName").textContent=p.name||"Unnamed";$("#callPersonRelation").textContent=possessiveRelation(p);$("#callPersonRussianRelation").textContent=`${ruRel(p.relationship)} (${englishRelationship(p.relationship)})`;
 const img=$("#callPersonPhoto"),fallback=$("#callPersonFallback");img.style.display=p.photo?"block":"none";img.src=p.photo||"";fallback.style.display=p.photo?"none":"grid";
 $("#callOptionsHeading").textContent=`Here are some natural Russian options for ${englishRelationship(p.relationship)}:`;
 callTerms(p).forEach(term=>{const b=document.createElement("button");b.type="button";b.dataset.ru=term.ru;b.innerHTML=`<span class="call-ru">${term.ru}</span><span class="call-note">${term.note}</span><span class="call-speaker">🔊</span>`;if(p.callName===term.ru){b.classList.add("selected");saveBtn.dataset.choice=term.ru;saveBtn.disabled=false;saveBtn.textContent=`I'll Call ${p.name}: ${term.ru}`}
   b.onclick=()=>{o.querySelectorAll("button").forEach(x=>x.classList.remove("selected"));b.classList.add("selected");saveBtn.dataset.choice=term.ru;saveBtn.disabled=false;saveBtn.textContent=`I'll Call ${p.name}: ${term.ru}`;speak(term.ru)};o.append(b)});
}
/* =========================================================
   SOMEONE SPECIAL — CURATED EXPRESSION BANK
   The learner chooses meaning. This bank supplies validated Russian.
   ========================================================= */
const SPECIAL_SENTIMENTS=[
 {key:"kind",label:"Kind / Caring"},
 {key:"funny",label:"Funny / Makes Me Laugh"},
 {key:"smart",label:"Smart"},
 {key:"beautiful",label:"Beautiful / Handsome"},
 {key:"happy",label:"Makes Me Happy"},
 {key:"important",label:"Important to Me"},
 {key:"admire",label:"I Admire Them"},
 {key:"love",label:"I Love Them"}
];
const SPECIAL_BANK={
 kind:{
  female:[
   {ru:"Она добрая и заботливая.",en:"She is kind and caring.",hi:"добрая и заботливая"},
   {ru:"Она очень отзывчивая.",en:"She is very caring and helpful.",hi:"очень отзывчивая"},
   {ru:"Она всегда готова помочь.",en:"She is always ready to help.",hi:"всегда готова помочь"},
   {ru:"У неё золотое сердце.",en:"She has a heart of gold.",hi:"золотое сердце"}
  ],
  male:[
   {ru:"Он добрый и заботливый.",en:"He is kind and caring.",hi:"добрый и заботливый"},
   {ru:"Он очень отзывчивый.",en:"He is very caring and helpful.",hi:"очень отзывчивый"},
   {ru:"Он всегда готов помочь.",en:"He is always ready to help.",hi:"всегда готов помочь"},
   {ru:"У него золотое сердце.",en:"He has a heart of gold.",hi:"золотое сердце"}
  ]
 },
 funny:{
  female:[
   {ru:"Она весёлая.",en:"She is cheerful and fun.",hi:"весёлая"},
   {ru:"Она умеет меня рассмешить.",en:"She knows how to make me laugh.",hi:"умеет меня рассмешить"},
   {ru:"С ней всегда весело.",en:"It's always fun with her.",hi:"всегда весело"},
   {ru:"У неё отличное чувство юмора.",en:"She has a great sense of humor.",hi:"отличное чувство юмора"}
  ],
  male:[
   {ru:"Он весёлый.",en:"He is cheerful and fun.",hi:"весёлый"},
   {ru:"Он умеет меня рассмешить.",en:"He knows how to make me laugh.",hi:"умеет меня рассмешить"},
   {ru:"С ним всегда весело.",en:"It's always fun with him.",hi:"всегда весело"},
   {ru:"У него отличное чувство юмора.",en:"He has a great sense of humor.",hi:"отличное чувство юмора"}
  ]
 },
 smart:{
  female:[
   {ru:"Она умная.",en:"She is smart.",hi:"умная"},
   {ru:"Она очень мудрая.",en:"She is very wise.",hi:"очень мудрая"},
   {ru:"Она невероятно умна.",en:"She is incredibly smart.",hi:"невероятно умна"},
   {ru:"У неё острый ум.",en:"She has a sharp mind.",hi:"острый ум"}
  ],
  male:[
   {ru:"Он умный.",en:"He is smart.",hi:"умный"},
   {ru:"Он очень мудрый.",en:"He is very wise.",hi:"очень мудрый"},
   {ru:"Он невероятно умён.",en:"He is incredibly smart.",hi:"невероятно умён"},
   {ru:"У него острый ум.",en:"He has a sharp mind.",hi:"острый ум"}
  ]
 },
 beautiful:{
  female:[
   {ru:"Она красивая.",en:"She is beautiful.",hi:"красивая"},
   {ru:"Она очень красивая.",en:"She is very beautiful.",hi:"очень красивая"},
   {ru:"Она выглядит великолепно.",en:"She looks gorgeous.",hi:"выглядит великолепно"},
   {ru:"Она невероятно красива.",en:"She is incredibly beautiful.",hi:"невероятно красива"}
  ],
  male:[
   {ru:"Он красивый.",en:"He is handsome.",hi:"красивый"},
   {ru:"Он очень симпатичный.",en:"He is very good-looking.",hi:"очень симпатичный"},
   {ru:"Он выглядит отлично.",en:"He looks great.",hi:"выглядит отлично"},
   {ru:"Он очень привлекательный.",en:"He is very attractive.",hi:"очень привлекательный"}
  ]
 },
 happy:{
  female:[
   {ru:"Она приносит мне радость.",en:"She brings me joy.",hi:"приносит мне радость"},
   {ru:"Она дарит мне счастье.",en:"She brings me happiness.",hi:"дарит мне счастье"},
   {ru:"Она всегда заставляет меня улыбаться.",en:"She always makes me smile.",hi:"заставляет меня улыбаться"},
   {ru:"Рядом с ней мне хорошо.",en:"I feel good and happy when I'm with her.",hi:"мне хорошо"}
  ],
  male:[
   {ru:"Он приносит мне радость.",en:"He brings me joy.",hi:"приносит мне радость"},
   {ru:"Он дарит мне счастье.",en:"He brings me happiness.",hi:"дарит мне счастье"},
   {ru:"Он всегда заставляет меня улыбаться.",en:"He always makes me smile.",hi:"заставляет меня улыбаться"},
   {ru:"Рядом с ним мне хорошо.",en:"I feel good and happy when I'm with him.",hi:"мне хорошо"}
  ]
 },
 important:{
  female:[
   {ru:"Она важна для меня.",en:"She is important to me.",hi:"важна для меня"},
   {ru:"Она очень много значит для меня.",en:"She means a lot to me.",hi:"очень много значит для меня"},
   {ru:"Она — важная часть моей жизни.",en:"She is an important part of my life.",hi:"важная часть моей жизни"},
   {ru:"Она мне очень дорога.",en:"She is very dear to me.",hi:"очень дорога"}
  ],
  male:[
   {ru:"Он важен для меня.",en:"He is important to me.",hi:"важен для меня"},
   {ru:"Он очень много значит для меня.",en:"He means a lot to me.",hi:"очень много значит для меня"},
   {ru:"Он — важная часть моей жизни.",en:"He is an important part of my life.",hi:"важная часть моей жизни"},
   {ru:"Он мне очень дорог.",en:"He is very dear to me.",hi:"очень дорог"}
  ]
 },
 admire:{
  female:[
   {ru:"Я восхищаюсь ею.",en:"I admire her.",hi:"восхищаюсь ею"},
   {ru:"Она меня вдохновляет.",en:"She inspires me.",hi:"меня вдохновляет"},
   {ru:"Я очень её уважаю.",en:"I respect her very much.",hi:"очень её уважаю"},
   {ru:"Я горжусь ею.",en:"I am proud of her.",hi:"горжусь ею"}
  ],
  male:[
   {ru:"Я восхищаюсь им.",en:"I admire him.",hi:"восхищаюсь им"},
   {ru:"Он меня вдохновляет.",en:"He inspires me.",hi:"меня вдохновляет"},
   {ru:"Я очень его уважаю.",en:"I respect him very much.",hi:"очень его уважаю"},
   {ru:"Я горжусь им.",en:"I am proud of him.",hi:"горжусь им"}
  ]
 },
 love:{
  female:[
   {ru:"Я люблю её.",en:"I love her.",hi:"люблю её"},
   {ru:"Я очень её люблю.",en:"I love her very much.",hi:"очень её люблю"},
   {ru:"Я всем сердцем люблю её.",en:"I love her with all my heart.",hi:"всем сердцем люблю её"},
   {ru:"Я её обожаю.",en:"I adore her.",hi:"её обожаю"}
  ],
  male:[
   {ru:"Я люблю его.",en:"I love him.",hi:"люблю его"},
   {ru:"Я очень его люблю.",en:"I love him very much.",hi:"очень его люблю"},
   {ru:"Я всем сердцем люблю его.",en:"I love him with all my heart.",hi:"всем сердцем люблю его"},
   {ru:"Я его обожаю.",en:"I adore him.",hi:"его обожаю"}
  ]
 }
};

/* Curated two-sentiment combinations. The engine never glues arbitrary Russian
   sentences together; every pair below is deliberately written. */
const SPECIAL_COMBINATIONS={
 "kind|funny":{female:{ru:"Она <mark>добрая и заботливая</mark>, и с ней <mark>всегда весело</mark>.",plain:"Она добрая и заботливая, и с ней всегда весело.",en:"She is kind and caring, and it's always fun with her."},male:{ru:"Он <mark>добрый и заботливый</mark>, и с ним <mark>всегда весело</mark>.",plain:"Он добрый и заботливый, и с ним всегда весело.",en:"He is kind and caring, and it's always fun with him."}},
 "kind|smart":{female:{ru:"Она <mark>добрая</mark> и <mark>умная</mark>.",plain:"Она добрая и умная.",en:"She is kind and smart."},male:{ru:"Он <mark>добрый</mark> и <mark>умный</mark>.",plain:"Он добрый и умный.",en:"He is kind and smart."}},
 "kind|beautiful":{female:{ru:"Она <mark>добрая</mark> и <mark>красивая</mark>.",plain:"Она добрая и красивая.",en:"She is kind and beautiful."},male:{ru:"Он <mark>добрый</mark> и <mark>красивый</mark>.",plain:"Он добрый и красивый.",en:"He is kind and handsome."}},
 "kind|happy":{female:{ru:"Она <mark>очень заботливая</mark>, и рядом с ней <mark>мне хорошо</mark>.",plain:"Она очень заботливая, и рядом с ней мне хорошо.",en:"She is very caring, and I feel happy when I'm with her."},male:{ru:"Он <mark>очень заботливый</mark>, и рядом с ним <mark>мне хорошо</mark>.",plain:"Он очень заботливый, и рядом с ним мне хорошо.",en:"He is very caring, and I feel happy when I'm with him."}},
 "kind|important":{female:{ru:"У неё <mark>золотое сердце</mark>, и она <mark>очень много значит для меня</mark>.",plain:"У неё золотое сердце, и она очень много значит для меня.",en:"She has a heart of gold, and she means a lot to me."},male:{ru:"У него <mark>золотое сердце</mark>, и он <mark>очень много значит для меня</mark>.",plain:"У него золотое сердце, и он очень много значит для меня.",en:"He has a heart of gold, and he means a lot to me."}},
 "kind|admire":{female:{ru:"Она <mark>всегда готова помочь</mark>, и я <mark>очень её уважаю</mark>.",plain:"Она всегда готова помочь, и я очень её уважаю.",en:"She is always ready to help, and I respect her very much."},male:{ru:"Он <mark>всегда готов помочь</mark>, и я <mark>очень его уважаю</mark>.",plain:"Он всегда готов помочь, и я очень его уважаю.",en:"He is always ready to help, and I respect him very much."}},
 "kind|love":{female:{ru:"У неё <mark>золотое сердце</mark>, и я <mark>очень её люблю</mark>.",plain:"У неё золотое сердце, и я очень её люблю.",en:"She has a heart of gold, and I love her very much."},male:{ru:"У него <mark>золотое сердце</mark>, и я <mark>очень его люблю</mark>.",plain:"У него золотое сердце, и я очень его люблю.",en:"He has a heart of gold, and I love him very much."}},
 "funny|smart":{female:{ru:"Она <mark>умная</mark> и умеет <mark>меня рассмешить</mark>.",plain:"Она умная и умеет меня рассмешить.",en:"She is smart and knows how to make me laugh."},male:{ru:"Он <mark>умный</mark> и умеет <mark>меня рассмешить</mark>.",plain:"Он умный и умеет меня рассмешить.",en:"He is smart and knows how to make me laugh."}},
 "funny|beautiful":{female:{ru:"Она <mark>красивая</mark>, и у неё <mark>отличное чувство юмора</mark>.",plain:"Она красивая, и у неё отличное чувство юмора.",en:"She is beautiful and has a great sense of humor."},male:{ru:"Он <mark>красивый</mark>, и у него <mark>отличное чувство юмора</mark>.",plain:"Он красивый, и у него отличное чувство юмора.",en:"He is handsome and has a great sense of humor."}},
 "funny|happy":{female:{ru:"Она <mark>умеет меня рассмешить</mark> и всегда <mark>заставляет меня улыбаться</mark>.",plain:"Она умеет меня рассмешить и всегда заставляет меня улыбаться.",en:"She knows how to make me laugh and always makes me smile."},male:{ru:"Он <mark>умеет меня рассмешить</mark> и всегда <mark>заставляет меня улыбаться</mark>.",plain:"Он умеет меня рассмешить и всегда заставляет меня улыбаться.",en:"He knows how to make me laugh and always makes me smile."}},
 "funny|important":{female:{ru:"С ней <mark>всегда весело</mark>, и она <mark>очень много значит для меня</mark>.",plain:"С ней всегда весело, и она очень много значит для меня.",en:"It's always fun with her, and she means a lot to me."},male:{ru:"С ним <mark>всегда весело</mark>, и он <mark>очень много значит для меня</mark>.",plain:"С ним всегда весело, и он очень много значит для меня.",en:"It's always fun with him, and he means a lot to me."}},
 "funny|admire":{female:{ru:"У неё <mark>отличное чувство юмора</mark>, и она <mark>меня вдохновляет</mark>.",plain:"У неё отличное чувство юмора, и она меня вдохновляет.",en:"She has a great sense of humor, and she inspires me."},male:{ru:"У него <mark>отличное чувство юмора</mark>, и он <mark>меня вдохновляет</mark>.",plain:"У него отличное чувство юмора, и он меня вдохновляет.",en:"He has a great sense of humor, and he inspires me."}},
 "funny|love":{female:{ru:"С ней <mark>всегда весело</mark>, и я <mark>очень её люблю</mark>.",plain:"С ней всегда весело, и я очень её люблю.",en:"It's always fun with her, and I love her very much."},male:{ru:"С ним <mark>всегда весело</mark>, и я <mark>очень его люблю</mark>.",plain:"С ним всегда весело, и я очень его люблю.",en:"It's always fun with him, and I love him very much."}},
 "smart|beautiful":{female:{ru:"Она <mark>умная</mark> и <mark>красивая</mark>.",plain:"Она умная и красивая.",en:"She is smart and beautiful."},male:{ru:"Он <mark>умный</mark> и <mark>красивый</mark>.",plain:"Он умный и красивый.",en:"He is smart and handsome."}},
 "smart|happy":{female:{ru:"Она <mark>очень умная</mark> и <mark>приносит мне радость</mark>.",plain:"Она очень умная и приносит мне радость.",en:"She is very smart and brings me joy."},male:{ru:"Он <mark>очень умный</mark> и <mark>приносит мне радость</mark>.",plain:"Он очень умный и приносит мне радость.",en:"He is very smart and brings me joy."}},
 "smart|important":{female:{ru:"Я ценю её <mark>острый ум</mark>, и она <mark>очень много значит для меня</mark>.",plain:"Я ценю её острый ум, и она очень много значит для меня.",en:"I value her sharp mind, and she means a lot to me."},male:{ru:"Я ценю его <mark>острый ум</mark>, и он <mark>очень много значит для меня</mark>.",plain:"Я ценю его острый ум, и он очень много значит для меня.",en:"I value his sharp mind, and he means a lot to me."}},
 "smart|admire":{female:{ru:"Она <mark>невероятно умна</mark> и <mark>меня вдохновляет</mark>.",plain:"Она невероятно умна и меня вдохновляет.",en:"She is incredibly smart and inspires me."},male:{ru:"Он <mark>невероятно умён</mark> и <mark>меня вдохновляет</mark>.",plain:"Он невероятно умён и меня вдохновляет.",en:"He is incredibly smart and inspires me."}},
 "smart|love":{female:{ru:"Она <mark>невероятно умна</mark>, и я <mark>очень её люблю</mark>.",plain:"Она невероятно умна, и я очень её люблю.",en:"She is incredibly smart, and I love her very much."},male:{ru:"Он <mark>невероятно умён</mark>, и я <mark>очень его люблю</mark>.",plain:"Он невероятно умён, и я очень его люблю.",en:"He is incredibly smart, and I love him very much."}},
 "beautiful|happy":{female:{ru:"Она <mark>красивая</mark> и <mark>приносит мне радость</mark>.",plain:"Она красивая и приносит мне радость.",en:"She is beautiful and brings me joy."},male:{ru:"Он <mark>красивый</mark> и <mark>приносит мне радость</mark>.",plain:"Он красивый и приносит мне радость.",en:"He is handsome and brings me joy."}},
 "beautiful|important":{female:{ru:"Она <mark>невероятно красива</mark> и <mark>очень много значит для меня</mark>.",plain:"Она невероятно красива и очень много значит для меня.",en:"She is incredibly beautiful and means a lot to me."},male:{ru:"Он <mark>очень привлекательный</mark> и <mark>очень много значит для меня</mark>.",plain:"Он очень привлекательный и очень много значит для меня.",en:"He is very attractive and means a lot to me."}},
 "beautiful|admire":{female:{ru:"Она <mark>невероятно красива</mark>, и я <mark>восхищаюсь ею</mark>.",plain:"Она невероятно красива, и я восхищаюсь ею.",en:"She is incredibly beautiful, and I admire her."},male:{ru:"Он <mark>очень привлекательный</mark>, и я <mark>восхищаюсь им</mark>.",plain:"Он очень привлекательный, и я восхищаюсь им.",en:"He is very attractive, and I admire him."}},
 "beautiful|love":{female:{ru:"Она <mark>невероятно красива</mark>, и я <mark>всем сердцем люблю её</mark>.",plain:"Она невероятно красива, и я всем сердцем люблю её.",en:"She is incredibly beautiful, and I love her with all my heart."},male:{ru:"Он <mark>очень привлекательный</mark>, и я <mark>всем сердцем люблю его</mark>.",plain:"Он очень привлекательный, и я всем сердцем люблю его.",en:"He is very attractive, and I love him with all my heart."}},
 "happy|important":{female:{ru:"Она <mark>дарит мне счастье</mark> и <mark>очень много значит для меня</mark>.",plain:"Она дарит мне счастье и очень много значит для меня.",en:"She brings me happiness and means a lot to me."},male:{ru:"Он <mark>дарит мне счастье</mark> и <mark>очень много значит для меня</mark>.",plain:"Он дарит мне счастье и очень много значит для меня.",en:"He brings me happiness and means a lot to me."}},
 "happy|admire":{female:{ru:"Она <mark>приносит мне радость</mark> и <mark>меня вдохновляет</mark>.",plain:"Она приносит мне радость и меня вдохновляет.",en:"She brings me joy and inspires me."},male:{ru:"Он <mark>приносит мне радость</mark> и <mark>меня вдохновляет</mark>.",plain:"Он приносит мне радость и меня вдохновляет.",en:"He brings me joy and inspires me."}},
 "happy|love":{female:{ru:"Она <mark>дарит мне счастье</mark>, и я <mark>очень её люблю</mark>.",plain:"Она дарит мне счастье, и я очень её люблю.",en:"She brings me happiness, and I love her very much."},male:{ru:"Он <mark>дарит мне счастье</mark>, и я <mark>очень его люблю</mark>.",plain:"Он дарит мне счастье, и я очень его люблю.",en:"He brings me happiness, and I love him very much."}},
 "important|admire":{female:{ru:"Она <mark>очень много значит для меня</mark>, и я <mark>восхищаюсь ею</mark>.",plain:"Она очень много значит для меня, и я восхищаюсь ею.",en:"She means a lot to me, and I admire her."},male:{ru:"Он <mark>очень много значит для меня</mark>, и я <mark>восхищаюсь им</mark>.",plain:"Он очень много значит для меня, и я восхищаюсь им.",en:"He means a lot to me, and I admire him."}},
 "important|love":{female:{ru:"Она <mark>мне очень дорога</mark>, и я <mark>всем сердцем люблю её</mark>.",plain:"Она мне очень дорога, и я всем сердцем люблю её.",en:"She is very dear to me, and I love her with all my heart."},male:{ru:"Он <mark>мне очень дорог</mark>, и я <mark>всем сердцем люблю его</mark>.",plain:"Он мне очень дорог, и я всем сердцем люблю его.",en:"He is very dear to me, and I love him with all my heart."}},
 "admire|love":{female:{ru:"Я <mark>восхищаюсь ею</mark> и <mark>очень её люблю</mark>.",plain:"Я восхищаюсь ею и очень её люблю.",en:"I admire her and love her very much."},male:{ru:"Я <mark>восхищаюсь им</mark> и <mark>очень его люблю</mark>.",plain:"Я восхищаюсь им и очень его люблю.",en:"I admire him and love him very much."}}
};
/* =========================================================
   END SOMEONE SPECIAL — CURATED EXPRESSION BANK
   ========================================================= */
const SPECIAL_FEMALE_RELS=new Set(["mother","sister","grandmother","great-grandmother","aunt","wife","girlfriend","fiancée","ex-wife"]);
const SPECIAL_MALE_RELS=new Set(["father","brother","grandfather","great-grandfather","uncle","husband","boyfriend","fiancé","ex-husband"]);
const SPECIAL_NEW_RELS=[
 ["girlfriend","Girlfriend — девушка"],["boyfriend","Boyfriend — парень"],
 ["fiancée","Fiancée — невеста"],["fiancé","Fiancé — жених"],
 ["wife","Wife — жена"],["husband","Husband — муж"],
 ["friend-female","Friend (female) — подруга"],["friend-male","Friend (male) — друг"]
];
let specialSelections=[];
let specialVariantIndex=0;
let specialEditingIndex=null;
function special(){return person(state.specialId)||state.people[0]}
function specialGender(p){
 if(!p)return"female";
 if(p.specialGender)return p.specialGender;
 if(SPECIAL_FEMALE_RELS.has(p.relationship))return"female";
 if(SPECIAL_MALE_RELS.has(p.relationship))return"male";
 return"female";
}
function specialPairKey(keys){return [...keys].sort((a,b)=>SPECIAL_SENTIMENTS.findIndex(x=>x.key===a)-SPECIAL_SENTIMENTS.findIndex(x=>x.key===b)).join("|")}
function specialIdentityRelationship(p){
 if(!p)return{ru:"",en:""};
 const gender=specialGender(p);
 const relMap={
  mother:["моя мама","my mother"],father:["мой папа","my father"],sister:["моя сестра","my sister"],brother:["мой брат","my brother"],
  grandmother:["моя бабушка","my grandmother"],grandfather:["мой дедушка","my grandfather"],
  "great-grandmother":["моя прабабушка","my great-grandmother"],"great-grandfather":["мой прадедушка","my great-grandfather"],
  aunt:["моя тётя","my aunt"],uncle:["мой дядя","my uncle"],wife:["моя жена","my wife"],husband:["мой муж","my husband"],
  girlfriend:["моя девушка","my girlfriend"],boyfriend:["мой парень","my boyfriend"],fiancée:["моя невеста","my fiancée"],fiancé:["мой жених","my fiancé"],
  "ex-wife":["моя бывшая жена","my ex-wife"],"ex-husband":["мой бывший муж","my ex-husband"]
 };
 if(p.relationship==="friend")return gender==="female"?{ru:"Это моя подруга.",en:"This is my friend."}:{ru:"Это мой друг.",en:"This is my friend."};
 const pair=relMap[p.relationship];
 if(pair)return{ru:`Это ${pair[0]}.`,en:`This is ${pair[1]}.`};
 const fallback=englishRelationship(p.relationship);
 return{ru:`Это ${ruRel(p.relationship)}.`,en:`This is my ${fallback}.`};
}
function renderSpecialIntroduction(p){
 const intro=$("#specialIntroduction"),question=$("#specialBuilderQuestion");if(!intro||!question)return;
 if(!p){intro.hidden=true;question.textContent="What would you like to say?";return}
 const name=p.name||"this person",gender=specialGender(p),rel=specialIdentityRelationship(p);
 const nameRu=gender==="male"?`Его зовут ${name}.`:`Её зовут ${name}.`;
 const nameEn=gender==="male"?`His name is ${name}.`:`Her name is ${name}.`;
 intro.hidden=false;$("#specialIntroName").textContent=name;$("#specialIntroRelationRu").textContent=rel.ru;$("#specialIntroRelationEn").textContent=rel.en;$("#specialIntroNameRu").textContent=nameRu;$("#specialIntroNameEn").textContent=nameEn;
 $("#specialIntroRelationSpeak").dataset.speak=rel.ru;$("#specialIntroNameSpeak").dataset.speak=nameRu;question.textContent=`What would you like to say about ${name}?`;
}

function specialCurrentExpression(){
 const p=special();if(!p||!specialSelections.length)return null;
 const gender=specialGender(p);
 if(specialSelections.length===1){
  const variants=SPECIAL_BANK[specialSelections[0]]?.[gender]||[];if(!variants.length)return null;
  const v=variants[specialVariantIndex%variants.length];
  const escaped=v.hi.replace(/[.*+?^${}()|[\]\\]/g,"\\$&");
  return{ru:v.ru.replace(new RegExp(escaped),`<mark>${v.hi}</mark>`),plain:v.ru,en:v.en,sentiments:[...specialSelections]};
 }
 const combo=SPECIAL_COMBINATIONS[specialPairKey(specialSelections)]?.[gender];
 return combo?{...combo,sentiments:[...specialSelections]}:null;
}
function specialPersonOptions(){
 const el=$("#specialPerson");if(!el)return;el.innerHTML='<option value="">Choose a person…</option>';
 state.people.forEach(p=>el.add(new Option(`${p.name||"Unnamed"} — ${englishRelationship(p.relationship)}`,p.id)));
 const add=new Option("＋ Add Someone Special","__new__");el.add(add);
}
function renderSpecialSentiments(){
 const box=$("#specialSentiments");if(!box)return;box.innerHTML="";
 SPECIAL_SENTIMENTS.forEach(s=>{const b=document.createElement("button");b.type="button";b.className="special-sentiment"+(specialSelections.includes(s.key)?" selected":"");b.textContent=s.label;b.onclick=()=>toggleSpecialSentiment(s.key);box.append(b)});
}
function toggleSpecialSentiment(key){
 if(specialSelections.includes(key))specialSelections=specialSelections.filter(x=>x!==key);
 else if(specialSelections.length<2)specialSelections.push(key);
 else{$("#specialSentimentHint").textContent="Choose no more than two feelings for one sentence.";return}
 specialVariantIndex=0;specialEditingIndex=null;renderSpecialSentiments();renderSpecialPreview();
}
function renderSpecialPreview(){
 const preview=$("#specialExpressionPreview"),x=specialCurrentExpression();if(!preview)return;
 preview.hidden=!x;if(!x)return;
 $("#specialRussian").innerHTML=x.ru;$("#specialEnglish").textContent=x.en;
 $("#specialTryAnother").style.display=specialSelections.length===1?"":"none";
 $("#specialSaveExpression").textContent=specialEditingIndex===null?"Add to My Expressions":"Save Changes";
}
function renderSpecialSaved(){
 const p=special(),box=$("#specialSavedExpressions"),heading=$("#specialSavedHeading");if(!box)return;box.innerHTML="";
 heading.textContent=p?`My Expressions About ${p.name||"This Person"}`:"My Expressions";
 const saved=p?.specialExpressions||[];
 if(!saved.length){box.innerHTML='<p class="special-saved-empty">Your saved Russian expressions will appear here.</p>';return}
 saved.forEach((x,i)=>{const card=document.createElement("div");card.className="special-saved-card";card.innerHTML=`<b>${x.plain}</b><small>${x.en}</small><div class="special-saved-actions no-print"><button type="button" data-listen>🔊 Listen</button><button type="button" data-modify>✏ Modify</button><button type="button" data-delete>🗑 Delete</button></div>`;card.querySelector("[data-listen]").onclick=()=>speak(x.plain);card.querySelector("[data-modify]").onclick=()=>{specialSelections=[...(x.sentiments||[])];specialEditingIndex=i;specialVariantIndex=0;renderSpecialSentiments();renderSpecialPreview()};card.querySelector("[data-delete]").onclick=async()=>{p.specialExpressions.splice(i,1);await save();renderSpecialSaved()};box.append(card)});
}
function renderSpecial(){
 specialPersonOptions();renderSpecialSentiments();
 const p=special();if(p){state.specialId=p.id;$("#specialPerson").value=p.id}
 const img=$("#specialPhoto"),fallback=$("#specialPortraitFallback"),label=$("#specialPhotoLabel");
 if(p){$("#specialName").textContent=p.name||"Unnamed";$("#specialRelLabel").textContent=englishRelationship(p.relationship);img.style.display=p.photo?"block":"none";img.src=p.photo||"";fallback.style.display=p.photo?"none":"grid";label.textContent=p.photo?"Change Photo":"Add Photo"}
 else{$("#specialName").textContent="Someone Special";$("#specialRelLabel").textContent="";img.style.display="none";fallback.style.display="grid";label.textContent="Add Photo"}
 renderSpecialIntroduction(p);renderSpecialPreview();renderSpecialSaved();
}
function openSpecialNewPanel(){
 const panel=$("#specialNewPanel");panel.hidden=false;$("#specialNewName").value="";$("#specialNewPhoto").value="";fillSelect($("#specialNewRelationship"),SPECIAL_NEW_RELS,"Choose a relationship…");
}
function closeSpecialNewPanel(){$("#specialNewPanel").hidden=true;if(special())$("#specialPerson").value=special().id}
async function saveSpecialNewPerson(){
 const name=$("#specialNewName").value.trim(),raw=$("#specialNewRelationship").value;if(!name)return alert("Enter a name.");if(!raw)return alert("Choose a relationship.");
 let relationship=raw,specialGender="";if(raw==="friend-female"){relationship="friend";specialGender="female"}if(raw==="friend-male"){relationship="friend";specialGender="male"}
 const photo=await photoData($("#specialNewPhoto").files[0]);const p={id:crypto.randomUUID(),name,relationship,photo,birthYear:"",callName:"",connections:[],specialGender,specialOnly:true,specialExpressions:[]};state.people.push(p);state.specialId=p.id;specialSelections=[];specialEditingIndex=null;await save();closeSpecialNewPanel();renderAll();
}
async function saveSpecialExpression(){
 const p=special(),x=specialCurrentExpression();if(!p||!x)return;if(!p.specialExpressions)p.specialExpressions=[];
 const record={plain:x.plain,en:x.en,sentiments:[...x.sentiments]};
 if(specialEditingIndex!==null)p.specialExpressions[specialEditingIndex]=record;
 else{if(p.specialExpressions.length>=4)return alert("You can save up to four expressions for this person.");p.specialExpressions.push(record)}
 specialEditingIndex=null;await save();renderSpecialSaved();renderSpecialPreview();
}

function renderExplore(){
  const cards=[
    [
      ["Ты мне нравишься.","I like you."],
      ["Я тебе нравлюсь.","You like me."]
    ],
    [
      ["Ты мне очень нравишься.","I really like you."],
      ["Я тебе очень нравлюсь.","You really like me."]
    ],
    [
      ["Я тебя люблю.","I love you."],
      ["Ты меня любишь.","You love me."]
    ],
    [
      ["Я тебя просто обожаю.","I simply adore you."],
      ["Ты меня просто обожаешь.","You simply adore me."]
    ]
  ];
  const host=$("#feelingCards");
  if(!host)return;
  host.innerHTML=cards.map(pairs=>`
    <article class="feeling-card">
      ${pairs.map(([ru,en])=>`
        <div class="feeling-pair">
          <strong>${ru}</strong>
          <em>${en}</em>
          <button class="speaker no-print" type="button" data-say="${ru}" aria-label="Listen to ${ru}">🔊 Listen</button>
        </div>
      `).join("")}
    </article>
  `).join("");
  host.querySelectorAll("[data-say]").forEach(btn=>{
    btn.addEventListener("click",()=>speak(btn.dataset.say));
  });
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
 updateAddRussianPreview();fillSelect($("#tryRelationship"),RELS);
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
 $("#callPerson").onchange=updateCallOptions;
 $("#saveCallName").onclick=async()=>{const p=person($("#callPerson").value);if(!p)return alert("Choose a family member.");const choice=$("#saveCallName").dataset.choice;if(!choice)return alert("Choose a Russian option.");p.callName=choice;await save();renderPersonalCallList();updateCallOptions()};
 $("#callPrintBtn").onclick=()=>window.print();$("#callClearBtn").onclick=clearAll;
 $("#specialPerson").onchange=async e=>{if(e.target.value==="__new__"){openSpecialNewPanel();return}state.specialId=e.target.value;specialSelections=[];specialEditingIndex=null;await save();renderSpecial()};
 $("#specialPhotoInput").onchange=async e=>{const p=special(),file=e.target.files[0];if(!p||!file)return;p.photo=await photoData(file);e.target.value="";await save();renderAll()};
 $("#specialSaveNew").onclick=saveSpecialNewPerson;$("#specialCancelNew").onclick=closeSpecialNewPanel;
 $("#specialIntroRelationSpeak").onclick=e=>speak(e.currentTarget.dataset.speak||"");
 $("#specialIntroNameSpeak").onclick=e=>speak(e.currentTarget.dataset.speak||"");
 $("#specialSpeak").onclick=()=>{const x=specialCurrentExpression();if(x)speak(x.plain)};
 $("#specialTryAnother").onclick=()=>{if(specialSelections.length!==1)return;specialVariantIndex=(specialVariantIndex+1)%4;renderSpecialPreview()};
 $("#specialSaveExpression").onclick=saveSpecialExpression;
 $("#specialPrintBtn").onclick=()=>window.print();$("#specialClearBtn").onclick=clearAll;
 $("#tryPerson").onchange=updateTrySentence;$("#tryRelationship").onchange=async e=>{let p=person($("#tryPerson").value);if(p){p.relationship=e.target.value;await save();renderAll();renderTryPeople()}};
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


