// =====================
// DADOS EDITÁVEIS — ALTERE AQUI (PROTÓTIPO FICTÍCIO)
// Troque apenas este bloco para atualizar todo o site.
// =====================
const empreendimento = {
  nome: "Residencial Aurora do Vale",
  cidade: "Nova Esperança — RO*",
  endereco: "Rua das Acácias, 1200 — Bairro Aurora*",
  cep: "76800-000*",
  whatsapp: "5569993152511",
  googleMaps: "https://www.google.com/maps/search/?api=1&query=Rua+das+Acácias,+Nova+Esperança+RO",
  precoBrisa: "a partir de R$ 189.900* — Modelo Essencial",
  precoSol: "a partir de R$ 219.900* — Modelo Plus",
  observacao: "*Valores, endereço e cidade fictícios — protótipo."
};

// Compatibilidade: hotel/bambus mantêm interface para applyData()
const hotel = {
  nome: empreendimento.nome,
  telefone: "(69) 99315-2511",
  whatsapp: empreendimento.whatsapp,
  endereco: empreendimento.endereco,
  cidade: empreendimento.cidade,
  cep: empreendimento.cep,
  googleMaps: empreendimento.googleMaps
};

const bambus = {
  nome: "Financiamento Aurora do Vale",
  telefone: "(69) 99315-2511",
  endereco: "Rua das Acácias, 1200 — Bairro Aurora",
  instagram: "",
  whatsapp: empreendimento.whatsapp,
  maps: empreendimento.googleMaps
};

// Mensagem padrão WhatsApp — funil para futuro agente de IA
const msgHotel = encodeURIComponent(`Olá! Tenho interesse no ${empreendimento.nome} em ${empreendimento.cidade}. Gostaria de saber sobre as casas de 2 e 3 quartos ${empreendimento.precoBrisa} / ${empreendimento.precoSol} e as condições de financiamento. Poderia me ajudar?`);
const msgBambus = encodeURIComponent(`Olá! Vi o ${empreendimento.nome} e queria simular o financiamento das casas. ${empreendimento.observacao}`);

// =====================
// LINKS DINÂMICOS
// =====================
function applyData(){
  document.querySelectorAll('.js-hotel-endereco').forEach(el=> el.textContent = hotel.endereco);
  document.querySelectorAll('.js-hotel-cidade').forEach(el=> el.textContent = `${hotel.cidade} — ${hotel.cep || ''}`.trim());
  document.querySelectorAll('.js-hotel-telefone').forEach(el=> el.textContent = hotel.telefone);
  document.querySelectorAll('.js-bambus-endereco').forEach(el=> el.innerHTML = `${bambus.endereco}, <span style="white-space:nowrap">Nova Esperança — RO*</span>`);
  document.querySelectorAll('.js-bambus-telefone').forEach(el=> el.textContent = bambus.telefone);

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

// HERO — parallax sutil no scroll (apenas desktop)
(function(){
  var bg=document.querySelector('.hero-full-bg img');
  if(!bg) return;
  if(window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  if(window.matchMedia('(hover: none)').matches) return;
  var ticking=false;
  window.addEventListener('scroll', function(){
    if(!ticking){
      requestAnimationFrame(function(){
        var scroll=window.pageYOffset;
        var h=window.innerHeight;
        if(scroll < h*1.2){
          bg.style.transform='scale('+(1.04 - scroll*0.00008)+') translateY('+(scroll*0.15)+'px)';
        }
        ticking=false;
      });
      ticking=true;
    }
  }, {passive:true});
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
// GALERIA — cards empilhados com rotação suave
// =====================
(function(){
  const stage=document.getElementById('galeriaStage');
  if(!stage) return;
  const cards=Array.from(stage.querySelectorAll('.galeria-ref-card'));
  const btnPrev=document.getElementById('galeriaPrev');
  const btnNext=document.getElementById('galeriaNext');
  if(!cards.length || !btnPrev || !btnNext) return;

  const total=cards.length;
  let order=[0,1,2,3,4,5,6,7];
  let busy=false;
  const posList=['center','left','right','back'];

  function applyPositions(stagger){
    cards.forEach((card,i)=>{
      const pos=order.indexOf(i);
      const target=pos<4 ? posList[pos] : 'hidden';
      if(stagger){
        const delay=pos*80;
        card.style.transitionDelay=delay+'ms';
        card.querySelector('img').style.transitionDelay=delay+'ms';
      }
      card.setAttribute('data-pos',target);
    });
    if(stagger){
      setTimeout(()=>{
        cards.forEach(card=>{
          card.style.transitionDelay='0ms';
          card.querySelector('img').style.transitionDelay='0ms';
        });
      },900);
    }
  }

  function rotate(dir){
    if(busy) return;
    busy=true;
    if(dir===1){
      const last=order.pop();
      order.unshift(last);
    } else {
      const first=order.shift();
      order.push(first);
    }
    applyPositions(true);
    setTimeout(()=>{ busy=false; },950);
  }

  btnNext.addEventListener('click',()=>rotate(1));
  btnPrev.addEventListener('click',()=>rotate(-1));

  applyPositions(false);
})();

// =====================
// FAQ — accordion suave
// =====================
(function(){
  const items=document.querySelectorAll('.faq-item');
  if(!items.length) return;
  items.forEach(item=>{
    const btn=item.querySelector('.faq-question');
    if(!btn) return;
    btn.addEventListener('click',()=>{
      const isOpen=item.classList.contains('open');
      // Fecha todos
      items.forEach(i=>{ i.classList.remove('open'); i.querySelector('.faq-question')?.setAttribute('aria-expanded','false'); });
      // Abre o clicado (se estava fechado)
      if(!isOpen){
        item.classList.add('open');
        btn.setAttribute('aria-expanded','true');
      }
    });
  });
})();

// =====================
// REVEAL ON SCROLL
// =====================
function revealOnScroll(){
  document.querySelectorAll('.reveal-img').forEach(el=>{
    const rect = el.getBoundingClientRect();
    if(rect.top < window.innerHeight - 80) el.classList.add('in');
  });
  document.querySelectorAll('.flow-line').forEach(el=>{
    const rect = el.getBoundingClientRect();
    if(rect.top < window.innerHeight - 40) el.classList.add('active');
  });
}

// harden
document.querySelectorAll('img').forEach(img=>{
  img.addEventListener('error', ()=>{ img.style.display='none'; });
  if(!img.getAttribute('loading')) img.setAttribute('loading','lazy');
});
if(window.matchMedia('(prefers-reduced-motion: reduce)').matches){
  document.documentElement.style.setProperty('--motion','none');
}

// DEPOIMENTOS — carrossel auto-scroll com dots + reduced-motion
(function(){
  var wrap=document.getElementById('avaliacoesParallax');
  if(!wrap) return;
  var cards=wrap.querySelectorAll('.av-placeholder-card');
  if(!cards.length) return;
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
  function next(){ centerTo(idx+1); }
  function startAuto(){
    stopAuto();
    if(reduceMotion) return;
    auto=setInterval(next,2800);
  }
  function stopAuto(){ if(auto){ clearInterval(auto); auto=null; } }
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

// Delight — feedback no CTA
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
