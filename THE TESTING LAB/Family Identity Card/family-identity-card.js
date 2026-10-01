const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
const RELS=[
["mother","мама"],["father","папа"],["sister","сестра"],["brother","брат"],
["grandmother","бабушка"],["grandfather","дедушка"],["aunt","тётя"],["uncle","дядя"],
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
let state={owner:{name:"Michael",month:"February"},people:[],specialId:null,tryFeeling:"love",pet:"dog",petFeeling:"love"};
const DB="familyIdentityCardDB", STORE="state";
function openDB(){return new Promise((res,rej)=>{let r=indexedDB.open(DB,1);r.onupgradeneeded=()=>r.result.createObjectStore(STORE);r.onsuccess=()=>res(r.result);r.onerror=()=>rej(r.error)})}
async function save(){const db=await openDB();const tx=db.transaction(STORE,"readwrite");tx.objectStore(STORE).put(state,"app");return new Promise(r=>tx.oncomplete=r)}
async function load(){try{const db=await openDB();const tx=db.transaction(STORE,"readonly");const req=tx.objectStore(STORE).get("app");await new Promise(r=>tx.oncomplete=r);if(req.result)state=req.result}catch(e){}}
async function clearAll(){if(!confirm("Clear all Family Identity Card information and photos stored by this component in this browser?"))return;indexedDB.deleteDatabase(DB);state={owner:{name:"Michael",month:"February"},people:[],specialId:null,tryFeeling:"love",pet:"dog",petFeeling:"love"};renderAll();show("launch")}
function fillSelect(el,arr,placeholder){el.innerHTML=placeholder?`<option value="">${placeholder}</option>`:"";arr.forEach(([v,t])=>el.add(new Option(t,v)))}
function personOptions(el,placeholder="Choose a person"){el.innerHTML=`<option value="">${placeholder}</option>`;state.people.forEach(p=>el.add(new Option(`${p.name||"Unnamed"} — ${p.relationship}`,p.id)))}
function speak(t){if(!("speechSynthesis"in window))return; speechSynthesis.cancel();let u=new SpeechSynthesisUtterance(t);u.lang="ru-RU";speechSynthesis.speak(u)}
function photoData(file){return new Promise((res,rej)=>{if(!file)return res("");let r=new FileReader();r.onload=()=>res(r.result);r.onerror=rej;r.readAsDataURL(file)})}
function ruRel(rel){return RELS.find(x=>x[0]===rel)?.[1]||rel}
function show(id){$$(".screen").forEach(s=>s.classList.toggle("active",s.id===id)); if(id==="explore")renderExplore(); if(id==="people")renderTryPeople(); if(id==="pets")renderPets(); window.scrollTo(0,0)}
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
function renderConnections(){
 personOptions($("#connectionPerson"));personOptions($("#connectionTarget"),"Connect to...");
 let area=$("#treeNodes");area.innerHTML="";
 const pos=[[50,55],[27,46],[73,46],[16,28],[39,27],[62,27],[84,28],[30,70],[70,70],[12,66],[88,66]];
 state.people.slice(0,11).forEach((p,i)=>{let [x,y]=pos[i]||[50,50];let d=document.createElement("button");d.className="tree-node";d.style.left=x+"%";d.style.top=y+"%";d.innerHTML=`${p.photo?`<img src="${p.photo}">`:"👤"} <b>${p.name||"Unnamed"}</b><br>${ruRel(p.relationship)}${p.birthYear?`<br><small>${p.birthYear}</small>`:""}`;d.onclick=()=>{$("#connectionPerson").value=p.id};area.append(d)})
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
 $("#ownerName").value=state.owner.name||"";$("#ownerMonth").value=state.owner.month||"February";
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
 updateAddRussianPreview();fillSelect($("#connectionType"),[["parent","parent"],["child","child"],["spouse","spouse/partner"],["sibling","sibling"],["relative","relative"]]);fillSelect($("#specialRelationship"),RELS);fillSelect($("#tryRelationship"),RELS);
 $("#ownerMonth").innerHTML="";MONTHS.forEach(m=>$("#ownerMonth").add(new Option(monthLabels[m]||m,m)));
 await load();renderAll();
 $$("[data-go]").forEach(b=>b.onclick=()=>show(b.dataset.go));
 $("#homeBtn").onclick=()=>show("launch");$("#printBtn").onclick=()=>window.print();$("#clearBtn").onclick=clearAll;
 $("#ownerName").onchange=async e=>{state.owner.name=e.target.value;await save()};$("#ownerMonth").onchange=async e=>{state.owner.month=e.target.value;await save()};
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
 $("#connectionPerson").onchange=()=>{};$("#saveConnection").onclick=async()=>{let p=person($("#connectionPerson").value),t=person($("#connectionTarget").value),type=$("#connectionType").value;if(!p||!t||p.id===t.id)return alert("Choose two different people.");p.connections=p.connections||[];p.connections.push({target:t.id,type});await save();alert("Connection saved.");renderConnections()};
 $("#editSelected").onclick=()=>editPerson($("#connectionPerson").value);$("#removeSelected").onclick=async()=>{let id=$("#connectionPerson").value;if(!id)return;if(confirm("Remove this person?")){state.people=state.people.filter(p=>p.id!==id);if(state.specialId===id)state.specialId=null;await save();renderAll()}};
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


