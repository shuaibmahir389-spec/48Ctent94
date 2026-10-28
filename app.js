document.querySelectorAll('.faq-list details').forEach(item=>item.addEventListener('toggle',()=>{if(item.open){document.querySelectorAll('.faq-list details').forEach(other=>{if(other!==item)other.open=false})}}));
const previewTabs=[...document.querySelectorAll('.phone-tabs [data-tab]')];
const previewViews=[...document.querySelectorAll('.screen-view[data-screen]')];
const previewTitle=document.querySelector('#previewTitle');
const previewStatus=document.querySelector('#previewStatus');
const previewLabels={home:['48 Ctent','Server 1 · 12ms'],anime:['Anime','Anime 1'],player:['Now Playing','Server 2 · 1080p'],offline:['Downloads','Offline']};
const playerVideo=document.querySelector('#phonePlayerVideo');
function showPreview(name,focus=false){
  const activeView=previewViews.find(view=>view.dataset.screen===name);
  const label=previewLabels[name];
  if(!activeView||!label)return;
  previewViews.forEach(view=>{const active=view===activeView;view.hidden=!active;view.classList.toggle('active',active)});
  previewTabs.forEach(tab=>{const active=tab.dataset.tab===name;tab.classList.toggle('selected',active);tab.setAttribute('aria-selected',String(active));tab.tabIndex=active?0:-1;if(active&&focus)tab.focus()});
  previewTitle.textContent=label[0];previewStatus.textContent=label[1];
  if(playerVideo){
    if(name==='player'&&!document.hidden){const playback=playerVideo.play();if(playback&&typeof playback.catch==='function')playback.catch(()=>{})}
    else playerVideo.pause();
  }
}
previewTabs.forEach((tab,index)=>{
  tab.addEventListener('click',()=>showPreview(tab.dataset.tab));
  tab.addEventListener('keydown',event=>{
    let next=index;
    if(event.key==='ArrowRight'||event.key==='ArrowDown')next=(index+1)%previewTabs.length;
    else if(event.key==='ArrowLeft'||event.key==='ArrowUp')next=(index-1+previewTabs.length)%previewTabs.length;
    else if(event.key==='Home')next=0;
    else if(event.key==='End')next=previewTabs.length-1;
    else return;
    event.preventDefault();showPreview(previewTabs[next].dataset.tab,true);
  });
});
document.addEventListener('visibilitychange',()=>{
  if(!playerVideo)return;
  const playerSelected=previewTabs.some(tab=>tab.dataset.tab==='player'&&tab.getAttribute('aria-selected')==='true');
  if(playerSelected&&!document.hidden){const playback=playerVideo.play();if(playback&&typeof playback.catch==='function')playback.catch(()=>{})}
  else if(document.hidden)playerVideo.pause();
});
const initialPreview=previewTabs.some(tab=>tab.dataset.tab==='player')?'player':previewTabs[0]?.dataset.tab;
if(initialPreview)showPreview(initialPreview);
const installSteps=[
  {icon:'↓',label:'ANDROID DOWNLOAD',title:'Download 48Ctent.apk',body:'Tap Download on this page. Your browser may show a confirmation before saving the APK.',note:'The browser download prompt is a standard Android step. The prompt itself does not verify the APK.'},
  {icon:'⌑',label:'INSTALL PERMISSION',title:'Allow your browser',body:'If Android asks, allow the browser you used to download APK files to install apps.',note:'Only enable installs for a browser you trust. You can turn this setting off again after installation.'},
  {icon:'✓',label:'ANDROID INSTALLER',title:'Review and install',body:'Check the app name and package shown by Android, then continue if you trust this file.',note:'The rebranded APK identifies as 48 ctent; its package ID is com.ctent.app, version 2.3.0. It is signed with a new key.'},
  {icon:'✦',label:'READY TO OPEN',title:'Open 48 Ctent',body:'When installation finishes, open the app from your launcher.',note:'This page is a mobile-first web experience; installing the APK installs the rebranded app package.'}
];
const installTabs=[...document.querySelectorAll('.install-tabs [data-step]')];
const installStage=document.querySelector('#installStage');
const installNote=document.querySelector('#installNote');
let installIndex=0;
function showInstallStep(index){
  installIndex=(index+installSteps.length)%installSteps.length;
  const step=installSteps[installIndex];
  installStage.innerHTML=`<span class="stage-icon">${step.icon}</span><div><small>${step.label}</small><h3>${step.title}</h3><p>${step.body}</p></div>`;
  installStage.style.animation='none';requestAnimationFrame(()=>installStage.style.animation='');
  installNote.textContent=step.note;
  installTabs.forEach((tab,i)=>{const active=i===installIndex;tab.classList.toggle('active',active);tab.setAttribute('aria-selected',String(active))});
  document.querySelector('#nextStep').textContent=installIndex===installSteps.length-1?'Back to first step ↺':'Next step →';
}
installTabs.forEach(tab=>tab.addEventListener('click',()=>showInstallStep(Number(tab.dataset.step))));
document.querySelector('#nextStep').addEventListener('click',()=>showInstallStep(installIndex+1));
