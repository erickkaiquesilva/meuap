# Chave Imóveis — Project State

## Decisions (from PRD)

| ID | Decision | Date |
|----|----------|------|
| AD-PRD-01 | Marketplace regional; Chave = camada tecnológica | 2026-08-28 |
| AD-PRD-07 | Limite 3 anúncios ativos/usuário (plano gratuito) | 2026-08-28 |
| AD-PRD-08 | Meta beta: ≥50 imóveis cadastrados | 2026-08-28 |
| AD-PRD-09 | Moderação via portal admin | 2026-08-28 |
| AD-PRD-15 | SEO híbrido: SSR/prerender rotas públicas; SPA área logada | 2026-08-28 |
| AD-PRD-16 | Sentry (free tier) + PostHog + GA4 para observabilidade/analytics | 2026-08-28 |
| AD-PRD-17 | PRD aprovada → spec TLC `chave-imoveis` | 2026-08-28 |

## Decisions (from Design)

| ID | Decision | Date |
|----|----------|------|
| AD-DES-01 | SSR híbrido via Vite middleware — não rewrite Next.js | 2026-08-28 |
| AD-DES-02 | Portal admin em `chave/features/admin` com `User.isAdmin` | 2026-08-28 |
| AD-DES-03 | Contrato API = paridade MSW até versionamento explícito | 2026-08-28 |
| AD-DES-04 | Notificações via Outbox + Nest cron (sem Redis no beta) | 2026-08-28 |
| AD-DES-05 | Fotos via R2 presigned upload direto do browser | 2026-08-28 |

## Decisions (engineering standards)

| ID | Decision | Date |
|----|----------|------|
| AD-ENG-01 | Commits atômicos `T{n}-{type}: descrição` | 2026-09-01 |
| AD-ENG-02 | PR atualiza Changelog.md | 2026-09-01 |
| AD-ENG-03 | Merge só com CI + review humano | 2026-09-01 |
| AD-ENG-04 | Segredos só em env vars | 2026-09-01 |
| AD-ENG-05 | Sem comentários desnecessários no código | 2026-09-01 |
| AD-ENG-06 | Testes unitários obrigatórios + evidência | 2026-09-01 |
| AD-ENG-07 | Padrões iguais front e back | 2026-09-01 |

## Handoff

| Field | Value |
|-------|-------|
| **Phase** | Execute — Phase 2 T13 done; next Phase 3 T14 |
| **Branch** | `meuap`: `feat/tlc-t13-admin-route` |
| **PRD** | `docs/prd/2026-08-28-chave-imoveis-prd.md` (approved) |
| **Spec** | `.specs/features/chave-imoveis/spec.md` |
| **Design** | `.specs/features/chave-imoveis/design.md` (approved) |
| **Tasks** | `.specs/features/chave-imoveis/tasks.md` |
| **Front** | `chave/` — `/admin` com AdminGuard |
| **Back** | `chave-api/` — `isAdmin` no payload de auth |
| **Deadline** | Beta fechado dez/2026; público 2027 |
| **Next step** | Review das PRs do T13 → T14 favoritos |

## Open (product)

- OQ-09: Preço plano pago acima de 3 anúncios — não bloqueia beta
