/* ── MOBILE MENU ── */
const menuBtn=document.getElementById('menuBtn');
const navLinks=document.getElementById('nav-links');
menuBtn.addEventListener('click',()=>{
  const open=navLinks.classList.toggle('open');
  menuBtn.setAttribute('aria-expanded',open);
  menuBtn.querySelector('i').className=open?'fa fa-times':'fa fa-bars';
});
document.addEventListener('click',e=>{
  if(!menuBtn.contains(e.target)&&!navLinks.contains(e.target)){
    navLinks.classList.remove('open');
    menuBtn.setAttribute('aria-expanded','false');
    menuBtn.querySelector('i').className='fa fa-bars';
  }
});
 
/* ── COUNTER ANIMATION ── */
function animateCounter(el){
  const target=+el.dataset.target;
  const suffix=target>=1000?'+':'+';
  const duration=1800;
  const step=duration/60;
  let current=0;
  const increment=target/(duration/16);
  const timer=setInterval(()=>{
    current=Math.min(current+increment,target);
    el.textContent=(current>=1000?Math.round(current/100)*100:Math.round(current)).toLocaleString()+suffix;
    if(current>=target)clearInterval(timer);
  },16);
}
const counters=document.querySelectorAll('.metric-val[data-target]');
let countersStarted=false;
const metricObserver=new IntersectionObserver(entries=>{
  entries.forEach(e=>{
    if(e.isIntersecting&&!countersStarted){
      countersStarted=true;
      counters.forEach(animateCounter);
    }
  });
},{threshold:.3});
const band=document.querySelector('.metrics-band');
if(band)metricObserver.observe(band);
 
/* ── EXCEL SEE MORE ── */
const excelToggle=document.getElementById('excelToggle');
const programsGrid=document.querySelector('.courses-grid');
if(excelToggle&&programsGrid){
  excelToggle.addEventListener('click',()=>{
    const open=programsGrid.classList.toggle('is-excel-open');
    excelToggle.textContent=open?'See Less':'See More';
  });
}

/* ── REVEAL ON SCROLL ── */
const reveals=document.querySelectorAll('.reveal');
const revealObserver=new IntersectionObserver(entries=>{
  entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in-view');revealObserver.unobserve(e.target)}});
},{threshold:.1});
reveals.forEach(r=>revealObserver.observe(r));
 
/* ── TESTIMONIAL SLIDER ── */
(function(){
  const track=document.getElementById('testimTrack');
  const slider=document.getElementById('testimSlider');
  const dotsContainer=document.getElementById('sliderDots');
  if(!track)return;
 
  let current=0;
  let cardWidth=0;
  let visible=3;
  const cards=track.querySelectorAll('.testimonial-card');
  const total=cards.length;
 
  function getVisible(){
    const w=slider.offsetWidth;
    if(w<=640)return 1;
    if(w<=1024)return 2;
    return 3;
  }
 
  function buildDots(){
    dotsContainer.innerHTML='';
    const pages=total-visible+1;
    for(let i=0;i<Math.max(1,pages);i++){
      const btn=document.createElement('button');
      btn.setAttribute('aria-label',`Go to testimonial ${i+1}`);
      if(i===current)btn.classList.add('active');
      btn.addEventListener('click',()=>goTo(i));
      dotsContainer.appendChild(btn);
    }
  }
 
  function goTo(idx){
    visible=getVisible();
    const maxIdx=Math.max(0,total-visible);
    current=Math.max(0,Math.min(idx,maxIdx));
    const gap=16;
    cardWidth=track.parentElement.offsetWidth;
    const cw=(cardWidth-(visible-1)*gap)/visible;
    track.style.transform=`translateX(-${current*(cw+gap)}px)`;
    dotsContainer.querySelectorAll('button').forEach((b,i)=>b.classList.toggle('active',i===current));
  }
 
  function setup(){
    visible=getVisible();
    buildDots();
    goTo(0);
    clearInterval(window._testimTimer);
    window._testimTimer=setInterval(()=>{
      const maxIdx=Math.max(0,total-visible);
      goTo(current<maxIdx?current+1:0);
    },4500);
  }
 
  setup();

  const faqToggle = document.getElementById('faqToggle');
  const faqMore = document.getElementById('faqMore');
  if (faqToggle && faqMore) {
    faqToggle.addEventListener('click', () => {
      const isVisible = faqMore.classList.toggle('is-visible');
      faqToggle.setAttribute('aria-expanded', String(isVisible));
      faqToggle.textContent = isVisible ? 'See less' : 'See more';
    });
  }
  window.addEventListener('resize',()=>setup());
 
  let startX=0;
  slider.addEventListener('touchstart',e=>startX=e.touches[0].clientX,{passive:true});
  slider.addEventListener('touchend',e=>{
    const dx=startX-e.changedTouches[0].clientX;
    if(Math.abs(dx)>40)dx>0?goTo(current+1):goTo(current-1);
  },{passive:true});
})();
