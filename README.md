# 🏡 Residencial Aurora do Vale — Landing Page

Landing page de captação de leads para um empreendimento de casas populares em
**Nova Esperança, RO**. Página estática de alta performance com **chatbot de IA**
que qualifica interessados em tempo real e transborda para o WhatsApp do vendedor.

> ⚠️ **Protótipo**: preços, endereço, depoimentos e notas são fictícios.
> Enquanto isso, a página é servida com `noindex, nofollow` — indexar oferta
> falsa no Google seria problema.

---

## ✨ Funcionalidades

| Seção | O que tem |
|---|---|
| **Hero** | Tela cheia com imagem responsiva, parallax sutil e CTA para o chat |
| **Modelos** | Essencial (48m²) e Plus (58m²) com destaque para o card principal |
| **Galeria** | Carrossel 3D de fotos empilhadas com navegação e contador |
| **Financiamento** | Copy de entrada facilitada e parcelas, CTA para o chat |
| **FAQ** | Acordeão acessível com `aria-expanded` e navegação por teclado |
| **Localização** | Mapa do Google embutido + fluxo da rua com links de rota |
| **Depoimentos** | Carrossel em loop infinito com dots de navegação |
| **CTA final + rodapé** | Última chamada com foto de fundo e links internos |
| **Chatbot "Ana"** | Agente com IA, qualificação de lead e passagem para o WhatsApp |

---

## 🤖 Chatbot com IA

Fluxo completo de atendimento automatizado:

1. Visitante clica em qualquer CTA → abre o painel de chat
2. A **Ana** responde dúvidas sobre o empreendimento com base no conhecimento em [`data/empreendimento.php`](data/empreendimento.php)
3. Em determinado momento, ela **qualifica o lead** (nome, telefone, financiamento, tipo de imóvel)
4. O atendimento é **transbordado para o WhatsApp** do vendedor com o contexto da conversa

**Arquitetura segura:**

```
chatbot.js (navegador)  ──POST──►  api/chat.php  ──►  API DeepSeek
        │                                │
        │                                ├── config/chatbot.php  (limites, prompt, personalidade)
        │                                └── data/empreendimento.php (base de conhecimento)
        └── nunca vê a chave da API
```

- 🔑 A chave da DeepSeek fica **somente no servidor** (`getenv()`)
- 🚦 Limite de **60 requisições/hora por IP** (evita estourar a conta da API)
- 📏 Limites de tamanho de mensagem (500 chars) e histórico (30 mensagens)
- 🧩 Fallback amigável caso a API esteja indisponível

---

## 🛠️ Stack

| Camada | Tecnologia |
|---|---|
| Estrutura | HTML5 semântico |
| Estilo | CSS3 puro (design system com variáveis) |
| Comportamento | JavaScript vanilla (zero dependências) |
| Backend | PHP 8 |
| IA | DeepSeek API (`deepseek-chat`) |
| Imagens | AVIF + WebP com `srcset` responsivo |
| Fontes | Cormorant Garamond + Inter, auto-hospedadas (woff2) |

---

## 📁 Estrutura

```
.
├── index.html            # Página única (todas as seções)
├── style.css             # Estilos globais + design system
├── script.js             # Nav, hero, galeria, FAQ, carrossel, reveal
├── chatbot.js            # Interface e lógica do chat
├── chatbot.css           # Estilos do painel de chat (carregado de forma assíncrona)
├── erro.php              # Página de erro 403/404
│
├── api/
│   └── chat.php          # Endpoint do chat (validação, rate limit, DeepSeek)
├── config/
│   └── chatbot.php       # Limites, personalidade e system prompt da Ana
├── data/
│   └── empreendimento.php# Base de conhecimento do empreendimento
│
├── assets/               # Imagens (AVIF/WebP), ícones e fontes
├── .env.example          # Modelo de configuração
├── .htaccess             # Headers, cache, compressão e URLs limpas
├── manifest.json         # PWA
├── sitemap.xml
└── robots.txt
```

---

## 🚀 Rodando localmente

A parte estática funciona abrindo o `index.html` direto no navegador, mas o
**chatbot precisa de PHP**.

### Opção 1 — XAMPP (como o projeto foi desenvolvido)

1. Coloque a pasta em `htdocs/`
2. Acesse `http://localhost/aurora-do-vale/`

### Opção 2 — Servidor PHP embutido

```bash
php -S localhost:8000
```

---

## ⚙️ Configuração

### 1. Chave da API DeepSeek

```bash
cp .env.example .env
```

Preencha no `.env`:

```
DEEPSEEK_API_KEY=sk-...
WHATSAPP_VENDEDOR=5511999999999
```

O backend lê a chave com `getenv()`, então a variável precisa estar disponível
para o PHP — configure no painel da hospedagem ou via `SetEnv` no Apache.

> Sem chave configurada, o chat responde com a mensagem de fallback e continua
> funcional (sem custo de API).

### 2. WhatsApp do vendedor

O número precisa ser preenchido em **dois lugares** (propositalmente, para
evitar link quebrado enquanto o campo está vazio):

- [`config/chatbot.php`](config/chatbot.php) → `'numero' => '5511999999999'`
- [`chatbot.js`](chatbot.js) → `CONFIG.whatsapp_numero = '5511999999999'`

### 3. Conteúdo do empreendimento

Todo o texto que a Ana usa para responder está em
[`data/empreendimento.php`](data/empreendimento.php) — preços, modelos,
financiamento e localização.

---

## ⚡ Performance

Imagens otimizadas para os dispositivos e conexões reais:

- **3,0 MB** de assets no total, distribuídos em 68 arquivos
- Formatos modernos **AVIF** com fallback **WebP**
- `srcset` + `sizes` para servir o tamanho certo de tela
- **Lazy loading** nas imagens fora da dobra
- Hero com `fetchpriority="high"` (é o LCP da página)
- Fontes auto-hospedadas com `preload` só das duas usadas acima da dobra
- `chatbot.css` carregado de forma **assíncrona** (não bloqueia a primeira pintura)
- Cache longo de 30 dias nos assets e `no-cache` no HTML (via versionamento `?v=`)
- Compressão **gzip** habilitada no Apache

## 🔍 SEO

- Dados estruturados **JSON-LD** (`HousingComplex`) com endereço e geo-coordenadas
- Open Graph + Twitter Card completos com imagem de compartilhamento
- `canonical`, `sitemap.xml` e `robots.txt`
- Título e meta description otimizados para a região

## ♿ Acessibilidade

- Link **"Pular para o conteúdo"**
- Navegação completa por **teclado**
- ARIA corretos no FAQ (`aria-expanded`, `aria-controls`) e no carrossel de depoimentos
- Respeito a **`prefers-reduced-motion`** (desliga animações para quem pedir)
- Imagens com `alt` descritivo e `aria-hidden` nas decorativas

## 🔒 Segurança

- Cabeçalhos de segurança (`X-Frame-Options`, `nosniff`, `Referrer-Policy`, `Permissions-Policy`)
- Bloqueio de arquivos internos (`.env`, `.md`, `.sql`) via `.htaccess`
- Validação de método, tipo e tamanho de payload no endpoint do chat
- Rate limiting por IP
- Sem listagem de diretórios (`Options -Indexes`)

---

## 🗺️ Próximos passos

- [ ] Trocar dados fictícios pelos reais e liberar `index, follow`
- [ ] Comprar o domínio e atualizar `canonical`, `robots.txt`, `sitemap.xml` e JSON-LD
- [ ] Configurar o número real de WhatsApp
- [ ] Conectar o formulário de leads a um CRM / planilha
- [ ] Testar com Lighthouse em 3G/4G lento

---

## 📄 Licença

Projeto desenvolvido para fins de portfólio. Todos os direitos reservados.
