'use strict';
const menuButton=document.querySelector('.menu-button');
const menu=document.querySelector('#menu');
function closeMenu(){menu.classList.remove('is-open');menuButton.setAttribute('aria-expanded','false')}
menuButton.addEventListener('click',()=>{const opened=menu.classList.toggle('is-open');menuButton.setAttribute('aria-expanded',String(opened))});
menu.querySelectorAll('a').forEach(link=>link.addEventListener('click',closeMenu));
document.addEventListener('keydown',event=>{if(event.key==='Escape'&&menu.classList.contains('is-open')){closeMenu();menuButton.focus()}});
const lift=document.querySelector('.lift-demo');
if(lift){
    const cabin = lift.querySelector('.lift-cabin');
    const display = lift.querySelector('.lift-display');
    const floorButtons = [...lift.querySelectorAll('[data-go]')];
    const pauseButton = lift.querySelector('.lift-pause');
    const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
    let paused = motionPreference.matches;
    let liftVisible = false;
    let floor = 0;
    let direction = 1;
    let travelTimer;
    let arrivalTimer;
    const syncPause = () => {
      pauseButton.textContent = paused ? 'Avvia' : 'Pausa';
      pauseButton.setAttribute('aria-label', paused ? 'Avvia animazione ascensore' : 'Ferma animazione ascensore');
      pauseButton.setAttribute('aria-pressed', String(paused));
    };
    const cancelTravel = () => { clearTimeout(travelTimer); clearTimeout(arrivalTimer); };
    function goToFloor(next) {
      cancelTravel();
      const arrow = next > floor ? '↑' : next < floor ? '↓' : '•';
      floor = next;
      lift.classList.remove('lift-arrived');
      cabin.style.transform = `translateY(${216 - floor * 108}px)`;
      display.textContent = `0${floor} ${arrow}`;
      floorButtons.forEach(button => button.setAttribute('aria-pressed', String(Number(button.dataset.go) === floor)));
      lift.querySelectorAll('.lift-floor').forEach(light => light.classList.remove('is-current'));
      arrivalTimer = setTimeout(() => {
        lift.classList.add('lift-arrived');
        display.textContent = `0${floor} •`;
        lift.querySelector(`.lift-floor[data-floor="${floor}"]`).classList.add('is-current');
        scheduleTravel();
      }, motionPreference.matches ? 0 : 1700);
    }
    function scheduleTravel() {
      clearTimeout(travelTimer);
      if (paused || !liftVisible || document.hidden) return;
      travelTimer = setTimeout(() => {
        if (floor === 2) direction = -1;
        if (floor === 0) direction = 1;
        goToFloor(floor + direction);
      }, 2400);
    }
    floorButtons.forEach(button => button.addEventListener('click', () => {
      paused = true;
      syncPause();
      goToFloor(Number(button.dataset.go));
    }));
    pauseButton.addEventListener('click', () => {
      paused = !paused;
      syncPause();
      clearTimeout(travelTimer);
      if (!paused) scheduleTravel();
    });
    motionPreference.addEventListener('change', () => {
      paused = motionPreference.matches;
      syncPause();
      goToFloor(floor);
    });
    document.addEventListener('visibilitychange', () => {
      clearTimeout(travelTimer);
      if (!document.hidden) scheduleTravel();
    });
    syncPause();
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(entries => {
        liftVisible = entries[0].isIntersecting;
        clearTimeout(travelTimer);
        if (liftVisible) scheduleTravel();
      }, {threshold: .15}).observe(lift);
      if (!motionPreference.matches) {
        const revealObserver = new IntersectionObserver(entries => entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            revealObserver.unobserve(entry.target);
          }
        }), {threshold: .08});
        document.querySelectorAll('.section-head,.service,.company-photo,.company-copy,.step,.contact-copy').forEach(element => {
          element.classList.add('reveal-on-scroll');
          revealObserver.observe(element);
        });
      }
    }


}
const serviceLabels={"manutenzione-assistenza":"Manutenzione e assistenza","installazione-ascensori":"Installazione ascensori","ammodernamento-ascensori":"Ammodernamento ascensori","piattaforme-elevatrici":"Piattaforme e pedane elevatrici","automatismi":"Automatismi","citofoni-videocitofoni":"Citofoni e videocitofoni"};
const context=document.querySelector('.contact-context');
if(context){
 const slug=new URLSearchParams(window.location.search).get('servizio');
 if(Object.prototype.hasOwnProperty.call(serviceLabels,slug)){
  const label=serviceLabels[slug];context.hidden=false;context.querySelector('.selected-service').textContent=label;
  document.querySelector('.contact-copy a[href^="mailto:"]').href='mailto:brasiellodomenico@gmail.com?subject='+encodeURIComponent('Informazioni: '+label);
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
