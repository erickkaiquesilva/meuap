# Chave Imóveis — Design System & Protótipo

Site de imóveis para **Sarandi e Maringá-PR**, desenvolvido do zero com design system próprio. O projeto nasce como resposta aos gaps de UX dos concorrentes locais (Granado Imóveis e Pedro Granado) e como aplicação prática de padrões de proptechs nacionais (QuintoAndar, Loft, Airbnb) em um contexto de mercado local.

---

## Identidade visual

| Elemento | Decisão |
|---|---|
| Cor primária | Blueberry `#243B8F` — ação, marca, confiança |
| Cor secundária | Cream Sode `#FFF0C9` — calor, destaque, fundos |
| Acento | Gold `#FFC11F` |
| Tipografia | Plus Jakarta Sans (única família — pesos 400/600/700/800) |
| Escala de espaçamento | 4px base (4, 8, 12, 16, 24, 32, 48, 64px) |
| Raios | sm 8px · md 12px · lg 16px · xl 24px · pill |

---

## Estrutura de pastas

```
meuap/
├── assets/
│   ├── css/
│   │   ├── tokens.css          # variáveis CSS (cores, tipografia, espaçamento, sombras)
│   │   ├── base.css            # reset e estilos globais
│   │   ├── components.css      # botões, inputs, badges, cards, modal, popover…
│   │   ├── animations.css      # hover lift, skeleton, favoritar, reveal on scroll
│   │   ├── responsive.css      # breakpoints (desktop 1080px · tablet 760px · mobile)
│   │   ├── documentation.css   # estilos exclusivos da página do design system
│   │   └── main.css            # ponto de entrada — importa todos os arquivos acima
│   └── js/
│       └── main.js             # comportamentos: modal, popover, favoritar, reveal
├── ds/
│   ├── index.html              # design system navegável + protótipo de home
│   └── analise-produto-design.md  # análise de produto (diagnóstico + decisões)
├── referencias/
│   ├── airbnb.com.br/          # capturas de tela do Airbnb
│   ├── quintoandar.com.br/     # capturas de tela do QuintoAndar
│   ├── loft.com.br/            # capturas de tela do Loft
│   ├── concorrentes/           # análise dos concorrentes locais
│   ├── img-reference/          # referências adicionais de layout
│   └── zips/                   # arquivos compactados de referência
└── README.md
```

---

## Como rodar localmente

O projeto é estático — não precisa de build, servidor ou dependências instaladas.

**Opção 1 — abrir diretamente no navegador:**
```
ds/index.html → arraste para o navegador ou dê duplo clique
```

**Opção 2 — servidor local (recomendado para evitar restrições de CORS):**
```bash
# com Python 3
python3 -m http.server 8080
# acesse http://localhost:8080/ds/

# ou com Node (npx sem instalar nada)
npx serve .
```

---

## O que está no protótipo (`ds/index.html`)

O arquivo único concentra o design system documentado e o protótipo de home aplicado:

| Seção | Conteúdo |
|---|---|
| Cores | Escala completa (50→900) das cores primária, secundária, neutra e semânticas |
| Tipografia | Amostras de todos os estilos (Display, H1–H3, Body, Caption, Numérico) |
| Tokens | Espaçamento, raios e sombras com visualização |
| Ícones | Sprite SVG próprio com 32 ícones em grade 24×24px |
| Grid | Sistema de 12 colunas com demonstração por breakpoint |
| Componentes | Botões (variantes + estados), inputs, badges, chips, avatar, rating, card de imóvel, skeleton, modal, popover, galeria mosaico |
| Animações | Hover lift, favoritar (pop elástico), skeleton, botão loading, reveal on scroll |
| Protótipo home | Nav, hero com busca flutuante, categorias, grid de destaques, bairros, value props, depoimentos, CTA banner, footer |

---

## Fases de evolução

| Fase | Escopo | Status |
|---|---|---|
| 1 | Design system + home responsiva | ✅ Completo |
| 2 | Listagem/resultados e página de detalhe do imóvel | Planejado |
| 3 | Mapa interativo, favoritos, área logada (requer back-end) | Futuro |

---

## Contexto de produto

A análise completa — diagnóstico dos concorrentes, decisões de tipografia/cor, trade-offs e estratégia de validação — está em [`ds/analise-produto-design.md`](ds/analise-produto-design.md).
