// =====================
// DADOS EDITÁVEIS - ALTERE AQUI
// =====================
const hotel = {
  nome: "Hotel Pousada Porto Feliz",
  telefone: "(69) 99315-2511",
  whatsapp: "5569993152511", 
  endereco: "R. Dom Pedro II, 2890 - São Cristóvão",
  cidade: "Porto Velho - RO",
  cep: "76804-116",
  googleMaps: "https://www.google.com/maps/search/?api=1&query=R.+Dom+Pedro+II,+2890+-+São+Cristóvão,+Porto+Velho+-+RO"
};

const bambus = {
  nome: "Bambus Gastronomia",
  telefone: "(69) 99315-2511",
  endereco: "R. Dom Pedro II, 2850 - São Cristóvão",
  instagram: "", // ex: https://instagram.com/bambusgastronomia
  whatsapp: "5569993152511",
  maps: "https://www.google.com/maps/search/?api=1&query=R.+Dom+Pedro+II,+2850+-+São+Cristóvão,+Porto+Velho+-+RO"
};

// Mensagem padrão WhatsApp
const msgHotel = encodeURIComponent(`Olá! Gostaria de reservar hospedagem no ${hotel.nome}. Poderia me informar disponibilidade e valores?`);
const msgBambus = encodeURIComponent(`Olá! Vi o ${bambus.nome} pelo site do ${hotel.nome} e gostaria de mais informações.`);

// =====================
// LINKS DINÂMICOS
// =====================
function applyData(){
  // hotel textos
  document.querySelectorAll('.js-hotel-endereco').forEach(el=> el.textContent = hotel.endereco);
  document.querySelectorAll('.js-hotel-cidade').forEach(el=> el.textContent = `${hotel.cidade} — ${hotel.cep || ''}`.trim());
  document.querySelectorAll('.js-hotel-telefone').forEach(el=> el.textContent = hotel.telefone);
  document.querySelectorAll('.js-bambus-endereco').forEach(el=> el.textContent = `${bambus.endereco}, Porto Velho — RO`);
  document.querySelectorAll('.js-bambus-telefone').forEach(el=> el.textContent = bambus.telefone);

  // whatsapp links
  const waHotel = hotel.whatsapp ? `https://wa.me/${hotel.whatsapp}?text=${msgHotel}` : `https://wa.me/?text=${msgHotel}`;
  const waBambus = bambus.whatsapp ? `https://wa.me/${bambus.whatsapp}?text=${msgBambus}` : `https://wa.me/?text=${msgBambus}`;
  document.querySelectorAll('.js-reservar').forEach(a=> { a.href = waHotel; a.target='_blank'; a.rel='noopener'; });
  document.querySelectorAll('.js-bambus-whatsapp').forEach(a=> { a.href = waBambus; a.target='_blank'; a.rel='noopener'; });
  document.querySelectorAll('.js-bambus-link').forEach(a=> {
    a.href = bambus.instagram || waBambus;
    a.target='_blank'; a.rel='noopener';
  });
  document.querySelectorAll('.js-maps').forEach(a=> { a.href = hotel.googleMaps; });
}

// =====================
// NAVBAR SCROLL + MOBILE
// =====================
const navbar = document.getElementById('navbar');
const burger = document.getElementById('burger');
const navMobile = document.getElementById('navMobile');

window.addEventListener('scroll', ()=>{
  navbar.classList.toggle('scrolled', window.scrollY > 40);
  revealOnScroll();
});

burger.addEventListener('click', ()=>{
  burger.classList.toggle('open');
  navMobile.classList.toggle('open');
});
navMobile.querySelectorAll('a').forEach(a=> a.addEventListener('click', ()=>{
  burger.classList.remove('open');
  navMobile.classList.remove('open');
}));

// scroll suave com easing e offset do menu fixo
document.querySelectorAll('a[href^="#"]').forEach(a=>{
  a.addEventListener('click', e=>{
    const id=a.getAttribute('href');
    if(!id || id==='#') return;
    const target=document.querySelector(id);
    if(!target) return;
    e.preventDefault();
    const top=target.getBoundingClientRect().top + window.pageYOffset - 72;
    const start=window.pageYOffset;
    const dist=top - start;
    const dur=700;
    let t0=null;
    function ease(p){ return p<0.5 ? 4*p*p*p : 1 - Math.pow(-2*p+2,3)/2; }
    function step(ts){
      if(!t0) t0=ts;
      const p=Math.min((ts - t0)/dur, 1);
      window.scrollTo(0, start + dist * ease(p));
      if(p < 1) requestAnimationFrame(step);
      else history.pushState(null,'',id);
    }
    requestAnimationFrame(step);
  });
});

// =====================
// GALERIA — carrossel foco central (cresce e sobe) + lightbox
// =====================
(function(){
  const viewport=document.getElementById('galeriaCarousel');
  const track=document.getElementById('galeriaTrack');
  const cards=track? track.querySelectorAll('.galeria-card'): [];
  if(!viewport || !track || !cards.length) return;
  // lightbox
  const lb=document.getElementById('galeriaLightbox');
  const lbImg=document.getElementById('galeriaLightboxImg');
  const lbClose=document.getElementById('galeriaClose');
  cards.forEach(card=>{
    card.style.cursor='zoom-in';
    card.addEventListener('click', ()=>{
      if(card._drag) return;
      const img=card.querySelector('img');
      if(!img || !lb || !lbImg) return;
      lbImg.src=img.src; lbImg.alt=img.alt;
      lb.classList.add('open'); lb.setAttribute('aria-hidden','false');
      document.body.style.overflow='hidden';
    });
  });
  function closeLb(){ if(!lb) return; lb.classList.remove('open'); lb.setAttribute('aria-hidden','true'); document.body.style.overflow=''; }
  lbClose?.addEventListener('click', closeLb);
  lb?.addEventListener('click', e=>{ if(e.target===lb || e.target===lbImg) closeLb(); });
  document.addEventListener('keydown', e=>{ if(e.key==='Escape') closeLb(); });
  // foco central
  function setActiveByCenter(){
    const vr=viewport.getBoundingClientRect();
    const vc=vr.left + vr.width/2;
    let best=null, bestDist=Infinity;
    cards.forEach(c=>{
      const r=c.getBoundingClientRect();
      const cc=r.left + r.width/2;
      const d=Math.abs(cc - vc);
      if(d < bestDist){ bestDist=d; best=c; }
    });
    cards.forEach(c=> c.classList.toggle('is-active', c===best));
  }
  let ticking=false;
  viewport.addEventListener('scroll', ()=>{ if(!ticking){ requestAnimationFrame(()=>{ setActiveByCenter(); ticking=false; }); ticking=true; } }, {passive:true});
  window.addEventListener('resize', setActiveByCenter);
  // auto contínuo
  let idx=1; // começa com segundo centralizado
  function centerTo(i){
    const c=cards[i % cards.length];
    if(!c) return;
    const left = c.offsetLeft - (viewport.clientWidth - c.offsetWidth)/2;
    viewport.scrollTo({left, behavior:'smooth'});
  }
  function next(){
    idx=(idx+1) % cards.length;
    centerTo(idx);
  }
  let auto=setInterval(next, 3400);
  viewport.addEventListener('mouseenter', ()=> clearInterval(auto));
  viewport.addEventListener('mouseleave', ()=> auto=setInterval(next, 2600));
  viewport.addEventListener('touchstart', ()=> clearInterval(auto), {passive:true});
  viewport.addEventListener('touchend', ()=> setTimeout(()=> auto=setInterval(next, 3400), 2000));
  // drag distinguido de clique
  let downX=0;
  viewport.addEventListener('mousedown', e=>{ downX=e.clientX; cards.forEach(c=> c._drag=false); });
  viewport.addEventListener('mousemove', e=>{ if(Math.abs(e.clientX-downX)>6) cards.forEach(c=> c._drag=true); });
  // init
  setTimeout(()=>{ centerTo(1); setActiveByCenter(); }, 300);
  viewport.addEventListener('scroll', setActiveByCenter);
})();

// =====================
// REVEAL ON SCROLL
// =====================
function revealOnScroll(){
  document.querySelectorAll('.reveal-img').forEach(el=>{
    const rect = el.getBoundingClientRect();
    if(rect.top < window.innerHeight - 80) el.classList.add('in');
  });
  // flow line animation
  document.querySelectorAll('.flow-line').forEach(el=>{
    const rect = el.getBoundingClientRect();
    if(rect.top < window.innerHeight - 40) el.classList.add('active');
  });
}








// harden — fallback para imagens e prefers-reduced-motion
document.querySelectorAll('img').forEach(img=>{
  img.addEventListener('error', ()=>{ img.style.display='none'; });
  if(!img.getAttribute('loading')) img.setAttribute('loading','lazy');
});
if(window.matchMedia('(prefers-reduced-motion: reduce)').matches){
  document.documentElement.style.setProperty('--motion','none');
}

// DEPOIMENTOS — carrossel auto-scroll (desktop + mobile) centralizado
(function(){
  var wrap=document.getElementById('avaliacoesParallax');
  if(!wrap) return;
  var cards=wrap.querySelectorAll('.av-placeholder-card');
  if(!cards.length) return;
  var idx=0;
  var auto=null;
  function centerTo(i){
    var card=cards[i % cards.length];
    if(!card) return;
    var left=card.offsetLeft - (wrap.clientWidth - card.offsetWidth)/2;
    wrap.scrollTo({left:left,behavior:'smooth'});
  }
  function next(){
    idx=(idx+1)%cards.length;
    centerTo(idx);
  }
  function startAuto(){
    stopAuto();
    auto=setInterval(next,2800);
  }
  function stopAuto(){
    if(auto){ clearInterval(auto); auto=null; }
  }
  wrap.addEventListener('mouseenter',stopAuto);
  wrap.addEventListener('touchstart',stopAuto,{passive:true});
  wrap.addEventListener('touchend',function(){ setTimeout(startAuto,2000); });
  wrap.addEventListener('mouseleave',startAuto);
  // centraliza primeiro card ao carregar
  setTimeout(function(){ centerTo(0); }, 300);
  // pausa quando fora da viewport (performance)
  var io=new IntersectionObserver(function(entries){
    entries.forEach(function(e){
      if(e.isIntersecting) startAuto(); else stopAuto();
    });
  },{threshold:0.2});
  io.observe(wrap);
})();


// onboard — empty-state galeria
(function(){
  const track=document.getElementById('galeriaTrack');
  if(track && !track.children.length){
    track.innerHTML='<p style="padding:24px;color:var(--mid)">Galeria em atualização — novas fotos em breve.</p>';
  }
})();

// =====================
// INIT
// =====================
applyData();
revealOnScroll();

// smooth anchor offset handled by CSS scroll-padding
