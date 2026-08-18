# Análise de Produto — Novo Site de Imóveis (Sarandi/Maringá-PR)

**Papel:** Senior Product Designer
**Escopo:** Diagnóstico de sites locais + inspirações de mercado, e recomendação de solução (Design System + protótipo de home).

---

## 1. Entendimento do problema

**Problema central:** os sites de imobiliária da região não comunicam com clareza nem transmitem confiança suficiente para converter visitantes em leads qualificados (contato/proposta).

**Quem é afetado:** compradores e locatários em Sarandi e Maringá que pesquisam imóveis online — em geral em mobile, comparando 2-3 imobiliárias antes de decidir com quem falar.

**Contexto de negócio:** mercado local pequeno e competitivo, onde a percepção de profissionalismo do site influencia diretamente a credibilidade da imobiliária (efeito halo: site datado → percepção de operação amadora, mesmo que o atendimento seja bom).

**Restrições:** produto novo, sem base de imóveis/CMS ainda definido; precisa nascer responsivo e ser mantido por uma operação pequena (não uma big tech), o que limita a complexidade técnica aceitável.

---

## 2. Diagnóstico (sites locais analisados via código-fonte)

### Site A (plataforma Kenlo)
- Paleta com 3 cores de destaque competindo entre si (vinho `#7A263A`, amarelo `#FFDA00`, laranja `#F59B31`), sem uma cor primária clara — quebra hierarquia visual.
- Tipografia (Red Hat Display + Open Sans) é atual, ponto positivo.
- Busca da home é só "operação + campo único de texto" — não expõe os filtros que mais importam (bairro, valor, quartos).
- **Cards de imóvel não mostram quartos/m²/vagas na listagem** — usuário precisa abrir cada imóvel para saber o básico. Isso viola o **Hick's Law** (força uma decisão de clique com informação insuficiente) e aumenta o esforço cognitivo por item.
- Responsivo tecnicamente (130 media queries), mas isso não compensa a falta de hierarquia de informação.

### Site B
- Stack datada: Bootstrap 4, jQuery, slider Jssor, `owl-carousel`, `jssocials` — página com 6.246 linhas de HTML.
- Carrega a biblioteca inteira de Google Fonts (Bitter, Cabin, Lobster, Pacifico, Oswald, Playfair...) sem uso real — peso de página desperdiçado, prejudica performance em mobile/4G, que é o cenário real de boa parte do público local.
- Cor de marca (`#1d3561`) existe, mas convive com 5+ cores soltas sem sistema (`#5897fb`, `#31a2ff`, `#00a5bb`, `#DC3543`...) — sinal de ausência de design tokens.
- **Busca avançada (cidade, tipo, quartos) fica escondida atrás de um botão**, oculta por padrão — um caso de *progressive disclosure* aplicado ao contrário: esconde exatamente os critérios que deveriam estar em primeiro plano.
- Telefone grafado com espaços entre dígitos — tática antispam antiga que quebra o "toque para ligar" em mobile.
- Cards de imóvel são mais completos (ícones de cama/chuveiro/carro + preço) — ponto positivo a preservar — mas os CTAs misturam `btn-dark`, `btn-danger`, `btn-outline-*` sem padrão, gerando ruído sobre qual é a ação principal.

### Gaps comuns aos dois (evidência do problema)
- Nenhum expõe os filtros de maior valor (bairro, preço, quartos) na busca principal da home.
- Nenhum tem tokens de cor/tipografia centralizados — cada tela "reinventa" estilos.
- Excesso de elementos competindo por atenção (sliders, badges, ícones) sem uma ação primária evidente — carga cognitiva alta, **Von Restorff effect** mal aproveitado (tudo tenta se destacar, nada se destaca de fato).

---

## 3. Avaliação de oportunidade

Comparando com padrões de mercado em proptech (ver imagens em `img-reference/`), os três padrões que mais se repetem — e que os sites locais não têm — são:

1. **Busca objetiva com poucos critérios de alto valor** (Operação, Cidade, Bairro, Valor, Quartos) sobreposta a uma imagem "de vida" (não de imóvel vazio), criando contexto emocional antes da decisão racional.
2. **Cards ricos e escaneáveis**: foto grande, preço total (sem letras miúdas depois), specs (m², quartos, vagas) visíveis sem clique, e badges de status ("Exclusivo", "Novo", "Abaixo do mercado") usando o **efeito Von Restorff** para guiar o olho.
3. **Prova social e confiança**: avaliações, selos de destaque, depoimentos — algo ausente nos sites locais.

A referência `layout-figma.png` (paleta indigo + amarelo pastel) confirma que a combinação Blueberry + Cream Sode escolhida pelo Erick já é validada visualmente no setor de real estate/travel tech — não é uma aposta arriscada, é uma escolha alinhada ao que já funciona.

**Oportunidade de negócio:** ser a primeira imobiliária da região com um site no padrão de UX de plataformas de imóveis modernas. Isso eleva a percepção de preço/profissionalismo (importante para imóveis de médio/alto padrão) e reduz a fricção entre "pesquisar" e "chamar no WhatsApp".

**Risco a monitorar:** sofisticação visual sem fotos profissionais dos imóveis perde o efeito — cards bonitos com fotos ruins quebram a promessa do design. Recomendo tratar fotografia profissional como pré-requisito de lançamento, não como item posterior.

---

## 4. Solução recomendada

### Direção de design
Combinar busca objetiva, cards informativos e hierarquia fotográfica clara, com uma camada de sofisticação visual própria (tipografia serifada nos títulos + paleta Blueberry/Cream) que diferencia o site dos demais da região — hoje nenhum deles usa serifa ou uma paleta com essa personalidade.

### Design System — fundações

**Cor:** `#243B8F` (Blueberry) como primária — ação, marca, links, elementos de confiança. `#FFF0C9` (Cream Sode) como secundária — calor, destaque suave, fundos de seção, badges. Ambas viraram escalas completas (50→900) para dar consistência a estados (hover, disabled, fundos, texto sobre cor). Neutros com leve subtom azulado para manter unidade com a primária. Cores semânticas (sucesso/erro/aviso/info) separadas da paleta de marca — decisão deliberada para nunca confundir "isso é a marca" com "isso é um alerta do sistema".

**Tipografia:** *Fraunces* (serifada, editorial) para títulos e *Inter* (sans, alta legibilidade, números tabulares) para UI/corpo/preços. Justificativa: os três sites de inspiração usam sans-serif de ponta a ponta — Fraunces nos títulos é o que dá "sofisticação" sem sacrificar a legibilidade funcional (preços, formulários, specs continuam em Inter, que é otimizada para telas pequenas e números).

**Espaçamento/raio/sombra:** escala de 4px, raios generosos (12–24px) e sombras suaves com tom azulado — reforça a identidade "premium, mas acessível" das referências.

### Componentes (Atomic Design)

| Nível | Componentes |
|---|---|
| Átomos | Botão (primário/secundário/ghost/ícone), Input, Select, Chip/Badge, Avatar, Rating, Ícone de spec |
| Moléculas | Campo de busca com label, Card de imóvel, Card de bairro, Card de depoimento, Tab de operação (Alugar/Comprar) |
| Organismos | Header/nav, Hero com busca flutuante, Grid de destaques, Seção de bairros, Faixa de prova social, Banner de CTA, Footer |
| Padrões | Busca (4 campos essenciais), Listagem em grid, Estado vazio de busca, Barra de filtros sticky (mobile) |

**Existentes reaproveitáveis:** nenhum — é um projeto novo, então o DS entregue já nasce como a base única de verdade (positivo: elimina a ausência de tokens comuns em sites da região).

**Novos componentes necessários:** Card de bairro, Card de depoimento, bloco de proposta de valor com ícone — não existem equivalentes reaproveitáveis porque o projeto começa do zero.

**Impacto no Design System:** positivo — centraliza tokens desde o dia 1. Isso barateia manutenção futura e permite expandir para novas cidades/bairros sem reescrever estilos.

**Estratégia de evolução:**
- **Fase 1 (este entregável):** fundações do DS + home/landing responsiva com busca, destaques, bairros, prova social e CTA.
- **Fase 2:** página de listagem/resultados (grid + filtros expostos) e página de detalhe do imóvel, reaproveitando os mesmos componentes de card, badge e botão.
- **Fase 3:** mapa interativo com preços nos pins, favoritos e área logada — funcionalidades que exigem back-end e ficam fora do escopo deste protótipo estático.

### Trade-offs e riscos
- Tipografia serifada em títulos exige atenção a tamanho mínimo e peso em mobile (mitigado: Fraunces só em headings grandes, nunca em corpo/UI).
- Paleta com apenas 2 cores de marca é mais disciplinada, mas exige cores semânticas separadas para não faltar vocabulário visual (resolvido no DS com sucesso/erro/aviso dedicados).
- Sofisticação visual eleva a régua de expectativa do usuário quanto à qualidade das fotos dos imóveis — ver risco na seção 3.

---

## 5. Estratégia de validação

- **Teste de usabilidade moderado (5 usuários locais, remoto ou presencial):** tarefa "encontre um apartamento de 2 quartos até R$ 1.500 em Sarandi ou Maringá" usando o protótipo (`index.html`). Medir: taxa de sucesso da tarefa, tempo até aplicar o primeiro filtro, pontos de confusão.
- **Teste A/B em produção (quando o site estiver com backend):** busca com 4 campos (Cidade, Bairro, Valor, Quartos) vs. busca simplificada de 2 campos — para confirmar que mais filtros objetivos aumentam taxa de contato em vez de gerar abandono (hipótese a validar com o público local).
- **Métricas de sucesso pós-lançamento:** taxa de contato (WhatsApp/formulário) por sessão, tempo médio na home, taxa de rejeição, e SUS (System Usability Scale) pré/pós lançamento.

---

## 6. Referências analisadas

- **Mercado local (código-fonte):** sites de imobiliárias da região
- **Inspirações (capturas de tela):** referências de home, listagem e detalhe em `referencias/`; `layout-figma.png` (paleta indigo/amarelo) e `galery-example.png` (grid de galeria de fotos)
- **Entregável associado:** `index.html` — Design System navegável + protótipo de home aplicando os tokens e componentes descritos acima.
