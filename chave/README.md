# Chave — Imóveis em Maringá e Sarandi

Plataforma imobiliária para conectar proprietários e compradores/locatários nas cidades de Maringá e Sarandi, PR.

## Pré-requisitos

- Node.js 20+
- npm 10+

## Como rodar

```bash
# Instalar dependências
npm install

# Desenvolvimento com mock (MSW — sem backend necessário)
npm run dev:mock

# Desenvolvimento (aponta para VITE_API_URL do .env)
npm run dev

# Build de produção
npm run build

# Build de staging
npm run build:staging

# Rodar testes
npm test

# Cobertura de testes
npm run test:coverage
```

## Configuração de ambiente

Copiar `.env.example` para `.env.mock` / `.env.staging` / `.env.production` e preencher os valores reais.

```bash
cp .env.example .env.mock
```

**Nunca comitar arquivos `.env` com valores reais.**

## Estrutura do projeto

```
chave/
├── public/               # mockServiceWorker.js (MSW)
├── src/
│   ├── assets/ds/        # Design System CSS
│   ├── core/             # API client, auth, router, React Query
│   ├── features/         # home, auth, listings, property
│   ├── shared/           # DS component wrappers, hooks, utils
│   ├── mocks/            # MSW handlers e dados mock
│   └── test/             # setup e utilitários de teste
├── docs/
│   ├── architecture.md
│   ├── components.md
│   └── technical-debt.md
└── Changelog.md
```

Consultar [`docs/architecture.md`](docs/architecture.md) para decisões técnicas detalhadas.

## Git workflow

- Branches: `feat/T001`, `fix/T001`, `release/v1.0.0`
- Commits: `feat-T001: descrição`, `fix-T001: descrição`
- Nunca comitar direto na `main`
- PRs abertas pelo usuário após revisão da branch
