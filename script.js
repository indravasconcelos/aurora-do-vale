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
  document.querySelectorAll('.js-bambus-endereco').forEach(el=> el.innerHTML = `${bambus.endereco}, <span style="white-space:nowrap">Porto Velho — RO</span>`);
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

burger.addEventListener('click', (e)=>{
  e.stopPropagation();
  burger.classList.toggle('open');
  navMobile.classList.toggle('open');
});
navMobile.querySelectorAll('a').forEach(a=> a.addEventListener('click', ()=>{
  burger.classList.remove('open');
  navMobile.classList.remove('open');
}));
document.addEventListener('click', (e)=>{
  if(!navMobile.classList.contains('open')) return;
  if(burger.contains(e.target) || navMobile.contains(e.target)) return;
  burger.classList.remove('open');
  navMobile.classList.remove('open');
});
document.addEventListener('keydown', (e)=>{
  if(e.key==='Escape' && navMobile.classList.contains('open')){
    burger.classList.remove('open');
    navMobile.classList.remove('open');
  }
});

// OVERDRIVE B — ticks acendem com scroll (sem agulha sobre imagem)
(function(){
  var hero=document.querySelector('.hero--overdrive .hero-media');
  var ticks=document.querySelectorAll('.hero--overdrive .hero-tick');
  if(!hero||!ticks.length) return;
  if(window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  function onScroll(){
    var r=hero.getBoundingClientRect();
    var vh=window.innerHeight;
    var p=1 - Math.max(0, Math.min(1, (r.top + r.height) / (vh + r.height)));
    ticks.forEach(function(t,i){
      var thr=(i+1)/ticks.length;
      t.classList.toggle('is-lit', p >= thr - 0.08);
    });
  }
  window.addEventListener('scroll', onScroll, {passive:true});
  window.addEventListener('resize', onScroll);
  onScroll();
})();
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
  const prog=document.getElementById('galeriaProgress');
  function updProg(){
    if(!prog) return;
    const max=viewport.scrollWidth - viewport.clientWidth;
    const p=max>0? viewport.scrollLeft / max : 0;
    prog.style.transform='translateX('+(p*200)+'%)';
  }
  viewport.addEventListener('scroll', ()=>{ if(!ticking){ requestAnimationFrame(()=>{ setActiveByCenter(); updProg(); ticking=false; }); ticking=true; } }, {passive:true});
  window.addEventListener('resize', ()=>{ setActiveByCenter(); updProg(); });
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

// DEPOIMENTOS — carrossel auto-scroll centralizado com dots + reduced-motion
(function(){
  var wrap=document.getElementById('avaliacoesParallax');
  if(!wrap) return;
  var cards=wrap.querySelectorAll('.av-placeholder-card');
  if(!cards.length) return;
  // injeta ticks do painel em cada card (evita 8 edições manuais)
  cards.forEach(function(c){
    if(c.querySelector('.instrument-tick')) return;
    ['t','r','b','l'].forEach(function(p){
      var s=document.createElement('span');
      s.className='instrument-tick instrument-tick--'+p;
      s.setAttribute('aria-hidden','true');
      c.appendChild(s);
    });
  });
  var dots=document.getElementById('avDots');
  var idx=0;
  var auto=null;
  var reduceMotion=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  function updateDots(){
    if(!dots) return;
    Array.from(dots.children).forEach(function(b,i){ b.classList.toggle('is-active', i===idx); b.setAttribute('aria-selected', i===idx); });
  }
  function centerTo(i){
    idx=(i+cards.length)%cards.length;
    var card=cards[idx];
    if(!card) return;
    var left=card.offsetLeft - (wrap.clientWidth - card.offsetWidth)/2;
    wrap.scrollTo({left:left,behavior:'smooth'});
    updateDots();
  }
  function next(){
    centerTo(idx+1);
  }
  function startAuto(){
    stopAuto();
    if(reduceMotion) return;
    auto=setInterval(next,2800);
  }
  function stopAuto(){
    if(auto){ clearInterval(auto); auto=null; }
  }
  if(dots){
    cards.forEach(function(_,i){
      var b=document.createElement('button');
      b.type='button'; b.setAttribute('role','tab'); b.setAttribute('aria-label','Ir para depoimento '+(i+1));
      b.addEventListener('click', function(){ centerTo(i); stopAuto(); setTimeout(startAuto,4000); });
      dots.appendChild(b);
    });
    updateDots();
  }
  wrap.addEventListener('mouseenter',stopAuto);
  wrap.addEventListener('touchstart',stopAuto,{passive:true});
  wrap.addEventListener('touchend',function(){ setTimeout(startAuto,2000); });
  wrap.addEventListener('mouseleave',startAuto);
  wrap.addEventListener('scroll', function(){
    var c=Math.round(wrap.scrollLeft / (cards[0].offsetWidth+14));
    if(c!==idx && c>=0 && c<cards.length){ idx=c; updateDots(); }
  }, {passive:true});
  setTimeout(function(){ centerTo(0); }, 300);
  var io=new IntersectionObserver(function(entries){
    entries.forEach(function(e){
      if(e.isIntersecting) startAuto(); else stopAuto();
    });
  },{threshold:0.2});
  io.observe(wrap);
})();


// LOCALIZAÇÃO 3D — tilt sutil no mapa (desktop)
(function(){
  var card=document.querySelector('.localizacao-visual');
  if(!card) return;
  if(window.matchMedia('(hover: none)').matches) return;
  if(window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  var raf=0;
  card.addEventListener('mousemove', function(e){
    var r=card.getBoundingClientRect();
    var rx=((e.clientY - r.top)/r.height -0.5)*-10;
    var ry=((e.clientX - r.left)/r.width -0.5)*12;
    if(!raf){
      raf=1;
      requestAnimationFrame(function(){ card.style.transform='perspective(1200px) rotateX('+rx+'deg) rotateY('+ry+'deg) translateZ(14px)'; raf=0; });
    }
  }, {passive:true});
  card.addEventListener('mouseleave', function(){ card.style.transform=''; });
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

// Delight — feedback preciso no CTA (microinteração sutil)
document.querySelectorAll('.js-reservar.btn').forEach(function(b){
  b.addEventListener('click', function(){
    var orig=b.textContent;
    if(b.dataset.delight) return;
    b.dataset.delight='1';
    b.textContent='Abrindo WhatsApp ✓';
    b.style.letterSpacing='0.06em';
    setTimeout(function(){ b.textContent=orig; delete b.dataset.delight; b.style.letterSpacing=''; }, 1800);
  });
});
// smooth anchor offset handled by CSS scroll-padding
