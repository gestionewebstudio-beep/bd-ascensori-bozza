'use strict';
const menuButton=document.querySelector('.menu-button');
const menu=document.querySelector('#menu');
function closeMenu(){menu.classList.remove('is-open');menuButton.setAttribute('aria-expanded','false')}
menuButton.addEventListener('click',()=>{const opened=menu.classList.toggle('is-open');menuButton.setAttribute('aria-expanded',String(opened))});
menu.querySelectorAll('a').forEach(link=>link.addEventListener('click',closeMenu));
document.addEventListener('keydown',event=>{if(event.key==='Escape'&&menu.classList.contains('is-open')){closeMenu();menuButton.focus()}});
const lift=document.querySelector('.lift-demo');
if(lift){
 const cabin=lift.querySelector('.lift-cabin');
 const positionCabin=next=>{const step=Number(getComputedStyle(cabin).getPropertyValue('--lift-step'));cabin.style.transform=`translateY(${step*(2-next)}px)`;};
 const display=lift.querySelector('.lift-display');
 const cabinDisplay=lift.querySelector('.lift-cabin-display');
 const floorButtons=[...lift.querySelectorAll('[data-go]')];
 const pauseButton=lift.querySelector('.lift-pause');
 const preference=window.matchMedia('(prefers-reduced-motion: reduce)');
 let paused=preference.matches,visible=false,started=false,floor=0,destination=0,direction=1;
 let departureTimer,arrivalTimer,travelTimer;
 const syncPause=()=>{pauseButton.textContent=paused?'Avvia':'Pausa';pauseButton.setAttribute('aria-label',paused?'Avvia animazione ascensore':'Ferma animazione ascensore');pauseButton.setAttribute('aria-pressed',String(paused));};
 const cancelTimers=()=>{clearTimeout(departureTimer);clearTimeout(arrivalTimer);clearTimeout(travelTimer);};
 function schedule(){
  clearTimeout(travelTimer);
  if(paused||!visible||document.hidden)return;
  travelTimer=setTimeout(()=>{if(floor===2)direction=-1;if(floor===0)direction=1;goToFloor(floor+direction);},2600);
 }
 function arrive(next){
  floor=next;display.textContent=`0${floor} •`;cabinDisplay.textContent=`0${floor}`;
  lift.classList.remove('lift-moving');lift.classList.add('lift-arrived');
  lift.querySelectorAll('.lift-floor').forEach(light=>light.classList.toggle('is-current',Number(light.dataset.floor)===floor));
  schedule();
 }
 function goToFloor(next){
  cancelTimers();
  const previous=floor;
  const wasTravelling=destination!==floor;
  destination=next;
  const arrow=next>previous?'↑':next<previous?'↓':'•';
  floorButtons.forEach(button=>button.setAttribute('aria-pressed',String(Number(button.dataset.go)===next)));
  if(next===previous&&!wasTravelling){
   arrivalTimer=setTimeout(()=>arrive(next),preference.matches?0:700);
   return;
  }
  lift.classList.remove('lift-arrived');display.textContent=`0${next} ${arrow}`;
  lift.querySelectorAll('.lift-floor').forEach(light=>light.classList.remove('is-current'));
  departureTimer=setTimeout(()=>{
   lift.classList.add('lift-moving');
   positionCabin(next);
   arrivalTimer=setTimeout(()=>arrive(next),preference.matches?0:1650);
  },preference.matches?0:750);
 }
 floorButtons.forEach(button=>button.addEventListener('click',()=>{paused=true;syncPause();goToFloor(Number(button.dataset.go));}));
 pauseButton.addEventListener('click',()=>{paused=!paused;syncPause();clearTimeout(travelTimer);if(!paused)schedule();});
 preference.addEventListener('change',()=>{cancelTimers();paused=preference.matches;destination=floor;syncPause();positionCabin(floor);arrive(floor);});
 document.addEventListener('visibilitychange',()=>{clearTimeout(travelTimer);if(!document.hidden)schedule();});
 window.matchMedia('(max-width: 760px)').addEventListener('change',()=>{cancelTimers();destination=floor;positionCabin(floor);arrive(floor);});
 syncPause();
 if('IntersectionObserver' in window){
  new IntersectionObserver(entries=>{
   visible=entries[0].isIntersecting;clearTimeout(travelTimer);
   if(visible&&!started){started=true;goToFloor(0);}else if(visible)schedule();
  },{threshold:.15}).observe(lift);
 }else{visible=true;started=true;goToFloor(0);}
}


const serviceLabels={"manutenzione-assistenza":"Manutenzione e assistenza","installazione-ascensori":"Installazione ascensori","ammodernamento-ascensori":"Ammodernamento ascensori","piattaforme-elevatrici":"Piattaforme e pedane elevatrici","automatismi":"Automatismi","citofoni-videocitofoni":"Citofoni e videocitofoni"};
const context=document.querySelector('.contact-context');
if(context){
 const slug=new URLSearchParams(window.location.search).get('servizio');
 if(Object.prototype.hasOwnProperty.call(serviceLabels,slug)){
  const label=serviceLabels[slug];context.hidden=false;context.querySelector('.selected-service').textContent=label;
  document.querySelectorAll('.contact-email,.email-action').forEach(link=>{link.href='mailto:brasiellodomenico@gmail.com?subject='+encodeURIComponent('Informazioni: '+label)});
 }
}

const floatingContact=document.querySelector('.contact-floating');
const contactToggle=floatingContact.querySelector('.contact-toggle');
const contactPanel=floatingContact.querySelector('.contact-panel');
function closeContact(restoreFocus=false){
  contactPanel.hidden=true;
  contactToggle.setAttribute('aria-expanded','false');
  contactToggle.setAttribute('aria-label','Apri telefono e WhatsApp');
  contactPanel.querySelector('details').open=false;
  if(restoreFocus)contactToggle.focus();
}
contactToggle.addEventListener('click',()=>{
  const opened=contactToggle.getAttribute('aria-expanded')==='true';
  if(opened){closeContact(true);return;}
  contactPanel.hidden=false;
  contactToggle.setAttribute('aria-expanded','true');
  contactToggle.setAttribute('aria-label','Chiudi telefono e WhatsApp');
  contactPanel.querySelector('.contact-phone').focus({preventScroll:true});
});
floatingContact.querySelector('.contact-close').addEventListener('click',()=>closeContact(true));
document.addEventListener('pointerdown',event=>{
  if(!contactPanel.hidden&&!floatingContact.contains(event.target))closeContact();
});
document.addEventListener('keydown',event=>{
  if(event.key==='Escape'&&!contactPanel.hidden){event.preventDefault();closeContact(true);}
});
const scrollTopButton=document.querySelector('.scroll-top');
let scrollFrame=false;
const updateScrollTop=()=>{scrollTopButton.hidden=window.scrollY<500;scrollFrame=false;};
window.addEventListener('scroll',()=>{
  if(!scrollFrame){scrollFrame=true;requestAnimationFrame(updateScrollTop);}
},{passive:true});
updateScrollTop();
scrollTopButton.addEventListener('click',()=>{
  closeContact();
  const reduceMotion=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  window.scrollTo({top:0,behavior:reduceMotion?'auto':'smooth'});
  document.getElementById('contenuto').focus({preventScroll:true});
});
