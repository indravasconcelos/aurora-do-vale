# Product

<!-- impeccable:product-schema 1 -->

## Platform
web

## Stack
delegated: vanilla HTML/CSS/JS estático atual; manter sem framework até que escala justifique Astro/Next. Usuário delegou escolha futura.

## Users
Primário: viajante de passagem por Porto Velho (RO) que chega/sai pela rodoviária e precisa de pernoite prático, sem deslocamento.
Secundários confirmados: turista/família em visita à cidade que busca conforto simples e previsível; corporativo/motorista em rota de trabalho que precisa estacionamento e descanso rápido.
Job: decidir em minutos se a hospedagem é prática (localização), confiável (prova social/depoimentos) e acionável (WhatsApp/ligação) para reservas de última hora ou planejadas.

## Product Purpose
Landing page de conversão para o Hotel Pousada Porto Feliz: apresentar a hospedagem de forma direta e acolhedora, reduzir atrito de decisão e converter visitante em contato via WhatsApp (wa.me/5569993152511) ou ligação (69 99315-2511). Sucesso = lead qualificado que inicia conversa para verificar disponibilidade/valores e fecha reserva.

## Positioning
Localização + praticidade imbatível: ao lado da Rodoviária de Porto Velho (R. Dom Pedro II, 2890 — São Cristóvão), com estacionamento exclusivo, quartos climatizados, supermercados/farmácias próximos e restaurante Bambus Gastronomia vizinho (R. Dom Pedro II, 2850). Um concorrente não pode copiar o endereço e a conveniência lado a lado de hospedagem + gastronomia sem deslocamento.

## Operating Context
Fluxos: Início → Diferenciais → Galeria (carrossel com lightbox) → Bambus (estabelecimento separado, ao lado) → Localização (mapa Google, flow rodoviária→hotel→Bambus, “Como chegar”) → Depoimentos (carrossel full-bleed auto-scroll) → CTA final → Footer.
Ambientes: mobile-first (320/375/390/430px), 768px, 1024px, desktop. Imagens reais .webp/.jpg em assets/, lazy loading, scroll suave com offset de nav fixa (72px).
Rituais: atualização de fotos de galeria, manutenção de depoimentos e validação de links WhatsApp/Maps antes de publicar.

## Capabilities and Constraints
Capacidades confirmadas: nav fixa com blur, hero editorial, barra info (Estacionamento/Quartos climatizados/Wi-Fi/Acessibilidade), grade diferenciais (6 cards: Localização estratégica, Conforto, Estacionamento, Supermercados, Farmácias, Restaurante ao lado), galeria carrossel com foco central, seção Bambus com tags Churrascaria/Pizzaria, conexão visual Hotel↔Bambus, mapa embed + link rota, depoimentos carrossel infinito (8 cards, scroll-snap, auto), CTA final, footer e WhatsApp float.
Restrições: manter nome “Hotel Pousada Porto Feliz”, Bambus Gastronomia como negócio separado (nunca implicar propriedade), não quebrar desktop ao ajustar mobile, preservar cores/tipografia atuais até redesign explícito. Domínio canônico ainda não comprado — remover placeholders até compra. Stack atual sem build; performance depende de hero.jpg (760KB) a otimizar para WebP.
Terminologia: “Diferenciais”, “Bambus”, “Localização”, “Depoimentos”.
Indecisos: formulário de reserva futuro; PWA/manifest pendente.

## Brand Commitments
Nome: Hotel Pousada Porto Feliz (Porto Velho — RO). Personalidade: acolhedora, prática, sem complicação.
Paleta amazônica atual a preservar: --bg #f9f3e6, --bg2 #efe6d0, --dark #6B3E26, --teal #2E8B57, --red #8B2A2A, wood-light #a67c52, teal-soft #dff0e6.
Tipografia: Cormorant Garamond (serif/display), Inter (sans/corpo), Space Grotesk (mono/labels).
Assets: fotos reais (hero.jpg, quarto-*.webp, hotel-*.webp, galeria-*.webp, localizacao.webp, restaurante-*.jpg) em assets/; logo PF SVG inline; CTA svg.
Voz: simples, direta, “Praticidade para chegar. Conforto para ficar.”
Referências visuais citadas: Slow House / Hero321 / LuxHotel 2025 para hero editorial (manter se não houver redesign).

## Evidence on Hand
Conteúdo real: 8 depoimentos (G.A, W.M, O.D.R x2, F.S, M.R, J.L, C.P), endereço hotel e Bambus, telefone/WhatsApp 5569993152511, Google Maps queries, fotos em assets/ (18 arquivos, ~1.7MB).
Prova social: rating 4.6 (189 avaliações) em schema (a confirmar com fonte real).
Ausências: testimonials sem data/fonte verificável — não fabricar novos; domínio/canonical pendente; favicon.ico ausente (SVG inline usado).

## Product Principles
1. Praticidade antes de promessa — localização e conveniência explicadas em segundos.
2. Confiança sem ficção — só prova e fotos reais, sem depoimentos inventados.
3. Conversão de um toque — todo CTA leva a WhatsApp/ligação sem fricção.
4. Separação clara — Hotel e Bambus vizinhos, nunca o mesmo negócio.

## Accessibility & Inclusion
Exigência: estrutura pensada para receber todos (Acessibilidade listada na infobar e amenidades). Padrão alvo: WCAG AA (contraste, navegação por teclado, alt em 17/17 imagens, aria-labels, prefers-reduced-motion, lazy loading). Manter foco visível e rotas acessíveis.
