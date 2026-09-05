---
name: Hotel Pousada Porto Feliz
description: Retiro de passagem ao lado da rodoviária — prático, confiável e editorialmente calmo.
colors:
  terra-queimada: "#6B3E26"
  terra-profunda: "#4e2d1a"
  terra-clara: "#a67c52"
  musgo: "#2E8B57"
  musgo-profundo: "#236b43"
  musgo-claro: "#3CB371"
  musgo-nevoa: "#dff0e6"
  barro: "#8B2A2A"
  barro-hover: "#6f2222"
  ivory: "#f9f3e6"
  sand: "#efe6d0"
  sand-deep: "#e8ddd2"
  line: "#e8d5c0"
  line-deep: "#d1b89a"
  mid: "#7a6e5d"
  mid-soft: "#9a8e7d"
  white: "#ffffff"
typography:
  display:
    fontFamily: "Cormorant Garamond, Georgia, serif"
    fontSize: "clamp(32px, 4.5vw, 48px)"
    fontWeight: 400
    lineHeight: 0.92
    letterSpacing: "-0.04em"
  headline:
    fontFamily: "Cormorant Garamond, Georgia, serif"
    fontSize: "clamp(32px, 4vw, 44px)"
    fontWeight: 400
    lineHeight: 0.92
    letterSpacing: "-0.04em"
  body:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: "16px"
    fontWeight: 300
    lineHeight: 1.75
    letterSpacing: "0.01em"
  label:
    fontFamily: "Space Grotesk, sans-serif"
    fontSize: "11px"
    fontWeight: 500
    lineHeight: 1
    letterSpacing: "0.18em"
rounded:
  sm: "10px"
  md: "12px"
  lg: "14px"
  xl: "18px"
  pill: "999px"
spacing:
  xs: "8px"
  sm: "12px"
  md: "16px"
  lg: "32px"
  xl: "56px"
  xxl: "80px"
components:
  button-primary:
    backgroundColor: "{colors.musgo}"
    textColor: "{colors.white}"
    rounded: "{rounded.sm}"
    padding: "14px 26px"
  button-primary-hover:
    backgroundColor: "{colors.musgo-profundo}"
    textColor: "{colors.white}"
    rounded: "{rounded.sm}"
  button-outline:
    backgroundColor: "transparent"
    textColor: "{colors.terra-queimada}"
    rounded: "{rounded.sm}"
    padding: "14px 26px"
  button-light:
    backgroundColor: "{colors.white}"
    textColor: "{colors.terra-queimada}"
    rounded: "{rounded.sm}"
    padding: "14px 26px"
  card-delicate:
    backgroundColor: "{colors.white}"
    textColor: "{colors.terra-queimada}"
    rounded: "{rounded.lg}"
    padding: "22px 16px 18px"
  nav-cta:
    backgroundColor: "{colors.musgo}"
    textColor: "{colors.white}"
    rounded: "{rounded.sm}"
    padding: "10px 18px"
---

# Design System: Hotel Pousada Porto Feliz

## Overview

**Creative North Star: "Retiro de Passagem"**

Um sistema prático e confiável que transforma a pausa entre viagens em descanso. Não é resort nem boutique — é um retiro urbano de passagem, editorialmente calmo, com ar de revista local: tipografia serif generosa, respiro branco ivory, e detalhes amazônicos contidos (terra queimada como base, musgo como sinal de ação). A interface decide rápido: localização primeiro, prova depois, ação sempre à mão.

Estética de baixa fricção: grade limpa, bordas suavemente arredondadas (10–18px), sem ruído visual. O hotel não compete com o Bambus — coexistem lado a lado no layout e no mapa, com separação tipográfica e cromática explícita.

**Key Characteristics:**
- Editorialmente calmo com hierarquia serif forte
- Paleta terrosa contida + musgo como único acento de ação
- Densidade média-baixa, respiro ivory e linhas areia
- Componentes refinados e contidos, sem exagero
- Movimento restrito a reveal suave e carrosséis snap

## Colors

Paleta terrosa amazônica ancorada no ivory, com musgo como acento funcional e barro apenas em toques.

### Primary
- **Terra Queimada** (#6B3E26): base tipográfica, nav, botões outline e footer. Onde há decisão, há terra.
- **Musgo** (#2E8B57): ação primária (CTAs, links, ticks, marcadores). Nunca como fundo grande.
- **Barro** (#8B2A2A): detalhe de alerta/calor (borda esquerda do selo ano, tag churrascaria). Uso ≤5% da tela.

### Secondary
- **Musgo Profundo** (#236b43): hover do musgo, borda ativa de galeria.
- **Terra Clara** (#a67c52): bordas do hero-media e molduras sutis.

### Tertiary
- **Musgo Névoa** (#dff0e6): fundos suaves de galeria e infobar (soft).

### Neutral
- **Ivory** (#f9f3e6): fundo global, respiro editorial.
- **Sand** (#efe6d0): seções alternadas (conexão, footer).
- **Sand Deep** (#e8ddd2): variação de apoio.
- **Line Areia** (#e8d5c0): divisores e bordas (1px).
- **Line Deep** (#d1b89a): bordas de botões claros e ícones.
- **Mid** (#7a6e5d): texto secundário/labels.
- **Mid Soft** (#9a8e7d): meta/hints.
- **White** (#ffffff): cards e superfícies elevadas.

**The Musgo-Only Action Rule.** Só o musgo (#2E8B57) pode ser fundo de CTA primário. Terra e barro nunca competem como botão de ação.

## Typography

**Display Font:** Cormorant Garamond, Georgia, serif
**Body Font:** Inter, system-ui, sans-serif
**Label/Mono Font:** Space Grotesk, sans-serif

**Character:** Serif editorial de alto contraste para títulos (leve itálico como ênfase), Inter leve para corpo longo e Space Grotesk mono para rótulos/especificações. Par com contraste clássico que comunica confiança sem formalidade excessiva.

### Hierarchy
- **Display** (400, clamp 36px/4.5vw/48px, 0.92): hero `Praticidade para chegar.` Duas linhas, última em musgo 600.
- **Headline** (400, clamp 32px/4vw/44px, 0.92, -0.04em): títulos de seção `O essencial...`, `Conheça por dentro.` com `em` itálico em musgo.
- **Title** (600 mono, 11px, 0.12–0.18em, uppercase): `h3` dos cards diferenciais e `strong` de steps.
- **Body** (300, 16px, 1.75, 0.01em, max 62ch): `.lead` e parágrafos, cor `mid` (#7a6e5d), em seções escuras `rgba(255,255,255,0.78)`.
- **Label** (500 mono, 11px, 0.18em, uppercase): `.eyebrow` “— Diferenciais”, kicker hero, meta.

**The Serif-Only Headline Rule.** Títulos `h1/h2` sempre Cormorant Garamond. Nunca usar Inter ou Space Grotesk em headlines.

## Layout

Modelo de container único centrado: `.container{max-width:1280px; margin:0 auto; padding:0 32px}` (20px em 768px). `.section{padding:80px 0}` (56px em 768px). Grid principal: hero `6.2fr 5.8fr`, diferenciais `repeat(3,1fr)`, bambino/localização `0.9fr 1.1fr / 0.95fr 1.05fr`, galeria full-bleed com `padding:0 28vw`. Ritmo: gaps 8/12/14/16px em componentes, 32px entre blocos, 56–80px entre seções. Full-bleed controlado: depoimentos usa `width:100vw; margin-left:calc(-50vw+50%); padding:0 calc(50vw - 170px)` para atravessar sem quebrar grid. Breakpoints: 1100px (hero 1col), 1024px (grids 1col), 768px (nav burger, grids 1–2col), 640px/430px (galeria 76vw, pq 2col), 390px (títulos 38px).

## Elevation & Depth

Sistema **misto: flat por padrão, elevação como resposta.** Superfícies em repouso são planas, separadas por tom (ivory → sand) e linha areia 1px, não por sombra.

### Shadow Vocabulary
- **Card Ativo Galeria** (`box-shadow: 0 18px 40px rgba(46,139,87,0.14)`): só no `.galeria-card.is-active` (scale 1.18).
- **Card Hover Suave** (`box-shadow: 0 12px 32px rgba(107,62,38,0.10)`): em `av-placeholder-card:hover` e `pq-card`.
- **Imagem Bambus** (`box-shadow: 0 8px 20px rgba(107,62,38,0.06)`): contorno branco com padding 7px.
- **Hero Media** (`box-shadow: 0 18px 48px rgba(30,51,49,0.14), 0 2px 14px rgba(30,51,49,0.08)`): único elemento com sombra dupla em repouso.
- **Nav** (`box-shadow: 0 1px 18px rgba(107,62,38,0.07)` / `0 4px 24px` scrolled): separação sutil.

**The Flat-By-Default Rule.** Nenhum card ou seção recebe sombra em repouso além do hero. Sombras só aparecem no hover/ativo/focus.

## Shapes

Linguagem de forma suavemente arredondada e contida, sem cantos vivos nem pills excessivos.

- **Nav logo** 10px, hero-media 18px com borda dupla (externa 1px wood-light + interna 1px rgba(201,154,95,0.28) a 10px), pq/diferenciais 14px, avaliacoes cards 12px, botões/nav-cta 10px, tags Bambus 20px pill, ícones circulares 999px (42px). Galeria cards 14px + moldura interna 1px teal a 6px. Imagens secundárias com recess 10px/8px. Bordas sempre 1–1.5px em `line`/`line-deep`; nunca 2px+ exceto selo ano `border-left:3px solid barro`. Silhueta recorrente: retângulo com respiro branco e filete superior teal 2px nos depoimentos.

## Components

### Buttons
Refinados e contidos, sem sombra em repouso além do primário.

- **Shape:** 10px radius, 1.5px border, 14px 26px padding, uppercase 13px 0.08em 600.
- **Primary** (`.btn-dark` / `.nav-cta`): fundo musgo (#2E8B57) texto white, sombra 0 2px 10px rgba(46,139,87,0.14). Hover musgo-profundo + sombra 0 4px 14-16px. Transição .3s.
- **Hover / Focus:** `background:#236b43; border-color:#236b43;` com `transform:translateY(-4px)` apenas em cards, não em botões.
- **Outline** (`.btn-outline`): transparente, texto terra, border terra. Hover inverte para terra fundo white texto.
- **Light** (`.btn-light`): white fundo terra texto border line-deep. Hover terra fundo white texto.
- **Ghost Light** (`.btn-ghost-light`): border rgba(255,255,255,0.6) texto white. Hover white fundo terra texto.

### Cards / Containers
- **Corner Style:** diferenciais 14px, avaliacoes 12px, galeria 14px.
- **Background:** white sobre ivory/sand; avaliacoes section dark (#6B3E26) para contraste.
- **Shadow Strategy:** ver Elevation — flat, sombra só hover/ativo.
- **Border:** 1px solid line (#e8d5c0), hover line-deep; galeria 1.5px teal.
- **Internal Padding:** pq 22px 16px 18px, avaliacoes 20px 18px, galeria 6px outer + overflow hidden inner.

### Chips / Tags
- **Style:** Bambus tags `border:1.5px solid line-deep` bg rgba(253,250,242,0.9) radius 20px, 8px 12px, mono 11px 0.12em 600; primeira tag barro texto/borda.
- **State:** sem selected; são descritivos.

### Navigation
- **Style:** fixa 72px, `background:rgba(253,250,242,0.96) backdrop-blur(12px)` borda line, mono-links 13px 0.06em, underline animado width 0→100% 1px terra. CTA musgo 10px. Mobile burger 3 linhas 22×1.5px terra, drawer `translateY(-10px)→0` opacity 0→1, links coluna 18px gap.

### Galeria Signature
- **Track** flex gap 14px (10px mobile) padding 0 28vw (12vw mobile), `scroll-snap-type:x mandatory`, cards 300×200 (76vw 190px mobile), `transform:scale(0.88) translateY(16px) opacity:0.82` → `is-active scale(1.18) translateY(-14px) opacity:1`. Lightbox fixed inset 0 rgba(18,30,29,0.92) com img max 92vw/860px.

## Do's and Don'ts

### Do:
- **Do** manter CTA primário sempre em musgo (#2E8B57) com radius 10px e sombra suave — consistência de ação.
- **Do** usar white-space:nowrap em “Porto Velho” e “Porto Velho — RO” para evitar viúva em mobile.
- **Do** reutilizar `calc(50vw - 170px)` para carrosséis full-bleed atravessarem a seção sem quebrar container.
- **Do** preservar `overflow:hidden` apenas em containers de imagem com radius; texto sempre `overflow:visible`.
- **Do** aplicar `prefers-reduced-motion:reduce` desligando `transform` em hero-media.

### Don't:
- **Don't** usar terra ou barro como fundo de botão primário — só musgo é ação.
- **Don't** adicionar sombra em repouso a cards diferenciais/avaliacoes — apenas hover/ativo.
- **Don't** quebrar Bambus como parte do hotel — mantenha “Estabelecimento separado” e endereços distintos (2890 vs 2850).
- **Don't** inventar depoimentos ou fotos — só 8 cards existentes e assets .webp/.jpg reais.
- **Don't** introduzir nova família tipográfica além de Cormorant/Inter/Space Grotesk sem brief de redesign.
