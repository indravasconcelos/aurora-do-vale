// =====================
// DADOS DA PÁGINA (PROTÓTIPO FICTÍCIO)
// A base de conhecimento completa do empreendimento fica em
// data/empreendimento.php, que é a fonte única usada pelo chatbot.
// Aqui ficam apenas os valores que este script realmente aplica no HTML.
// =====================
const empreendimento = {
  googleMaps: "https://www.google.com/maps/search/?api=1&query=Rua+das+Acácias,+Nova+Esperança+RO"
};

// =====================
// LINKS DINÂMICOS
// =====================
function applyData(){
  document.querySelectorAll('.js-maps').forEach(a=> { a.href = empreendimento.googleMaps; });
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

// PRIMEIRA TELA: o hero ocupa a altura da tela MENOS o que divide a dobra com ele
// (regra "Hero de pagina: altura de tela cheia" do CLAUDE.md raiz).
// O menu e fixed, entao nao ocupa espaco no fluxo e nao entra na conta; quem
// entra e a barra de informacoes logo abaixo do hero. A medida precisa ser
// feita, nao chutada: muda por breakpoint, por safe-area e quando a fonte carrega.
// Nenhum dos elementos medidos recebe a propria altura desta variavel, entao o
// valor nao vira acumulador ao repetir o resize (ver regra do CLAUDE.md raiz).
(function(){
  var hero = document.querySelector('.hero-full');
  if(!hero) return;
  var nav  = document.getElementById('navbar');
  var info = document.querySelector('.infobar');
  function medirDobra(){
    var fora = 0;
    if(nav && getComputedStyle(nav).position !== 'fixed') fora += nav.offsetHeight;
    if(info) fora += info.offsetHeight;
    document.documentElement.style.setProperty('--fora-do-hero', Math.round(fora) + 'px');
  }
  medirDobra();
  window.addEventListener('load', medirDobra);
  window.addEventListener('resize', medirDobra);
  window.addEventListener('orientationchange', medirDobra);
  if(document.fonts && document.fonts.ready) document.fonts.ready.then(medirDobra);
})();

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
  const count=document.getElementById('galeriaCount');
  if(!cards.length || !btnPrev || !btnNext) return;

  const total=cards.length;
  let order=[0,1,2,3,4,5,6,7];

  // Promove data-src/data-srcset para os atributos reais. Os quatro cartoes que
  // nascem escondidos so baixam a foto quando entram em cena: sem isto o
  // primeiro carregamento traz as 8, e metade nunca e vista.
  function carregar(card){
    if(card.dataset.carregado) return;
    card.dataset.carregado='1';
    card.querySelectorAll('source[data-srcset], img[data-srcset]').forEach(function(el){
      el.srcset = el.dataset.srcset; delete el.dataset.srcset;
    });
    const img = card.querySelector('img[data-src]');
    if(img){ img.src = img.dataset.src; delete img.dataset.src; }
  }
  let busy=false;
  const posList=['center','left','right','back'];

  function applyPositions(stagger){
    cards.forEach((card,i)=>{
      const pos=order.indexOf(i);
      const target=pos<4 ? posList[pos] : 'hidden';
      if(target!=='hidden') carregar(card);
      if(stagger){
        const delay=pos*80;
        card.style.transitionDelay=delay+'ms';
        card.querySelector('img').style.transitionDelay=delay+'ms';
      }
      card.setAttribute('data-pos',target);
    });
    if(count) count.textContent=(order[0]+1)+' / '+total;
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

  btnNext.addEventListener('click',()=>rotate(-1));
  btnPrev.addEventListener('click',()=>rotate(1));

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
}

// harden
document.querySelectorAll('img').forEach(img=>{
  img.addEventListener('error', ()=>{ img.style.display='none'; });
  // Nunca marcar como lazy a imagem prioritaria: o hero e o LCP da pagina e ja
  // vem com preload + fetchpriority="high". As tres dicas juntas se contradizem.
  if(img.fetchPriority === 'high' || img.getAttribute('loading')) return;
  img.setAttribute('loading','lazy');
});
if(window.matchMedia('(prefers-reduced-motion: reduce)').matches){
  document.documentElement.style.setProperty('--motion','none');
}

// DEPOIMENTOS — carrossel em laco continuo (clona o conjunto e reposiciona sem animacao)
(function(){
  var wrap=document.getElementById('avaliacoesParallax');
  if(!wrap) return;
  var cards=Array.prototype.slice.call(wrap.querySelectorAll('.av-placeholder-card'));
  if(!cards.length) return;
  var total=cards.length;

  cards.forEach(function(c){
    if(c.querySelector('.instrument-tick')) return;
    ['t','r','b','l'].forEach(function(p){
      var s=document.createElement('span');
      s.className='instrument-tick instrument-tick--'+p;
      s.setAttribute('aria-hidden','true');
      c.appendChild(s);
    });
  });

  // Copia do conjunto: e ela que entra na tela enquanto o original sai,
  // entao nunca aparece espaco vazio nem "rebobinar" ao chegar no fim.
  cards.forEach(function(c){
    var clone=c.cloneNode(true);
    clone.setAttribute('aria-hidden','true');
    clone.removeAttribute('id');
    wrap.appendChild(clone);
  });
  var primeiroClone=wrap.children[total];

  var dots=document.getElementById('avDots');
  var idx=0, auto=null, passo=0, conjunto=0, visiveis=1, paginas=total;
  var reduceMotion=window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var LARGURA_MIN=280;   // abaixo disso o depoimento fica apertado demais
  function medir(){
    var cs=getComputedStyle(wrap);
    var gap=parseFloat(cs.columnGap)||14;
    var util=wrap.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight);
    // Quantas colunas cabem com cartao de pelo menos LARGURA_MIN. Os cartoes
    // dividem exatamente a largura util (ver --av-cols no CSS), entao nunca sobra
    // pedaco de cartao aparecendo na borda do trilho.
    visiveis=Math.max(1, Math.min(total, Math.floor((util+gap)/(LARGURA_MIN+gap))));
    wrap.style.setProperty('--av-cols', visiveis);
    // so depois de aplicar a largura e que a medida de rolagem vale
    passo=cards.length>1 ? cards[1].offsetLeft - cards[0].offsetLeft : cards[0].offsetWidth;
    conjunto=primeiroClone.offsetLeft - cards[0].offsetLeft;
    var novas=Math.ceil(total/visiveis);
    if(novas!==paginas || !dots || dots.children.length!==novas){
      paginas=novas;
      montarDots();
    }
  }
  function semAnimacao(fn){
    var antes=wrap.style.scrollBehavior;
    wrap.style.scrollBehavior='auto';
    fn();
    wrap.style.scrollBehavior=antes;
  }
  function normalizar(){
    if(!conjunto) return;
    if(wrap.scrollLeft>=conjunto-1) semAnimacao(function(){ wrap.scrollLeft-=conjunto; });
    else if(wrap.scrollLeft<0) semAnimacao(function(){ wrap.scrollLeft+=conjunto; });
  }
  function montarDots(){
    if(!dots) return;
    dots.innerHTML='';
    dots.hidden = paginas<=1;            // tudo visivel de uma vez: indicador nao serve pra nada
    if(paginas<=1) return;
    for(var i=0;i<paginas;i++){
      (function(i){
        var primeiro=i*visiveis+1;
        var ultimo=Math.min(total, primeiro+visiveis-1);
        var b=document.createElement('button');
        b.type='button'; b.setAttribute('role','tab');
        b.setAttribute('aria-label', primeiro===ultimo
          ? 'Ir para o depoimento '+primeiro
          : 'Ir para os depoimentos '+primeiro+' a '+ultimo);
        b.addEventListener('click',function(){ irPara(i*visiveis); stopAuto(); setTimeout(startAuto,4000); });
        dots.appendChild(b);
      })(i);
    }
    updateDots();
  }
  function updateDots(){
    if(!dots || dots.hidden) return;
    var ativa=Math.floor(idx/visiveis)%paginas;
    Array.prototype.forEach.call(dots.children,function(b,i){
      b.classList.toggle('is-active', i===ativa);
      b.setAttribute('aria-selected', i===ativa);
    });
  }
  function irPara(i){
    normalizar();
    idx=((i%total)+total)%total;
    wrap.scrollTo({left:cards[idx].offsetLeft - cards[0].offsetLeft, behavior:'smooth'});
    updateDots();
  }
  function next(){
    normalizar();
    // avanca uma pagina inteira; ao passar do fim entra nas copias e o
    // normalizar() da proxima chamada devolve o trilho ao inicio sem animacao
    var atual=passo ? Math.round(wrap.scrollLeft/passo) : 0;
    wrap.scrollTo({left:(atual+visiveis)*passo, behavior:'smooth'});
  }
  function startAuto(){ stopAuto(); if(reduceMotion || paginas<=1) return; auto=setInterval(next,4200); }
  function stopAuto(){ if(auto){ clearInterval(auto); auto=null; } }

  wrap.addEventListener('mouseenter',stopAuto);
  wrap.addEventListener('mouseleave',startAuto);
  wrap.addEventListener('touchstart',stopAuto,{passive:true});
  wrap.addEventListener('touchend',function(){ setTimeout(startAuto,2000); });
  wrap.addEventListener('scroll',function(){
    if(!passo) return;
    var i=Math.round(wrap.scrollLeft/passo)%total;
    if(i!==idx && i>=0){ idx=i; updateDots(); }
  },{passive:true});

  medir();
  window.addEventListener('resize',function(){ medir(); normalizar(); });
  if(document.fonts && document.fonts.ready) document.fonts.ready.then(medir);

  var io=new IntersectionObserver(function(entries){
    entries.forEach(function(e){ if(e.isIntersecting) startAuto(); else stopAuto(); });
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
// =====================
// INIT
// =====================
applyData();
revealOnScroll();
