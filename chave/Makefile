# ==============================================================
#  Chave — Makefile
#  Uso: make <target>
#  Exemplo: make start
# ==============================================================

SHELL := /bin/bash
.DEFAULT_GOAL := help

# Cores ANSI
BOLD   := \033[1m
RESET  := \033[0m
BLUE   := \033[0;34m
GREEN  := \033[0;32m
YELLOW := \033[0;33m
RED    := \033[0;31m
CYAN   := \033[0;36m

# Detecta se node_modules existe
NODE_MODULES := node_modules/.package-lock.json

# ==============================================================
#  TARGETS
# ==============================================================

.PHONY: help start install test coverage build build-staging lint check-node check-env clean

## Exibe esta ajuda
help:
	@echo ""
	@printf "$(BOLD)$(BLUE)  Chave — Comandos disponíveis$(RESET)\n"
	@echo "  ─────────────────────────────────────────────────"
	@printf "  $(GREEN)make start$(RESET)          Instala deps e inicia o dev server\n"
	@printf "  $(GREEN)make install$(RESET)        Instala dependências npm\n"
	@printf "  $(GREEN)make test$(RESET)           Roda a suite de testes (watch)\n"
	@printf "  $(GREEN)make test-run$(RESET)       Roda testes uma vez (CI)\n"
	@printf "  $(GREEN)make coverage$(RESET)       Gera relatório de cobertura de testes\n"
	@printf "  $(GREEN)make build$(RESET)          Build de produção\n"
	@printf "  $(GREEN)make build-staging$(RESET)  Build de staging\n"
	@printf "  $(GREEN)make lint$(RESET)           Roda o linter (oxlint)\n"
	@printf "  $(GREEN)make clean$(RESET)          Remove node_modules e dist\n"
	@echo "  ─────────────────────────────────────────────────"
	@echo ""

## Verifica pré-requisitos (Node.js e npm)
check-node:
	@command -v node >/dev/null 2>&1 || { \
		printf "$(RED)✗ Node.js não encontrado.$(RESET) Instale em https://nodejs.org\n"; \
		exit 1; \
	}
	@command -v npm >/dev/null 2>&1 || { \
		printf "$(RED)✗ npm não encontrado.$(RESET)\n"; \
		exit 1; \
	}
	@node_version=$$(node -v | sed 's/v//'); \
	major=$$(echo $$node_version | cut -d. -f1); \
	if [ "$$major" -lt 20 ]; then \
		printf "$(YELLOW)⚠ Node.js $$node_version detectado. Recomendamos v20+.$(RESET)\n"; \
	fi

## Instala dependências se necessário
install: check-node
	@if [ ! -f "$(NODE_MODULES)" ]; then \
		printf "$(CYAN)→ Instalando dependências...$(RESET)\n"; \
		npm install; \
		printf "$(GREEN)✓ Dependências instaladas.$(RESET)\n"; \
	else \
		printf "$(GREEN)✓ Dependências já instaladas.$(RESET)\n"; \
	fi

## Verifica e prepara o arquivo .env para o ambiente escolhido
define ensure-env
	@if [ ! -f ".env.$(1)" ]; then \
		if [ -f ".env.example" ]; then \
			printf "$(YELLOW)⚠ .env.$(1) não encontrado. Criando a partir de .env.example...$(RESET)\n"; \
			cp .env.example .env.$(1); \
			printf "$(YELLOW)  → Edite .env.$(1) antes de continuar em produção!$(RESET)\n"; \
		else \
			printf "$(RED)✗ .env.example não encontrado. Crie o arquivo .env.$(1) manualmente.$(RESET)\n"; \
			exit 1; \
		fi; \
	fi
endef

## Inicia o servidor de desenvolvimento (pergunta o ambiente)
start: install
	@echo ""
	@printf "$(BOLD)$(BLUE)  Em qual ambiente você quer subir o projeto?$(RESET)\n"
	@echo ""
	@printf "  $(GREEN)1$(RESET)  mock        Dados simulados pelo MSW, sem backend necessário\n"
	@printf "  $(GREEN)2$(RESET)  staging     Aponta para a API de staging\n"
	@printf "  $(GREEN)3$(RESET)  production  Aponta para a API de produção\n"
	@echo ""
	@read -rp "  Escolha [1/2/3]: " CHOICE; \
	echo ""; \
	case "$$CHOICE" in \
		1|mock) \
			if [ ! -f ".env.mock" ]; then \
				printf "$(YELLOW)⚠ .env.mock não encontrado. Criando a partir de .env.example...$(RESET)\n"; \
				cp .env.example .env.mock 2>/dev/null || true; \
			fi; \
			printf "$(GREEN)→ Subindo em ambiente $(BOLD)MOCK$(RESET)$(GREEN) (MSW ativo, sem backend)$(RESET)\n\n"; \
			npm run dev:mock \
			;; \
		2|staging) \
			if [ ! -f ".env.staging" ]; then \
				printf "$(YELLOW)⚠ .env.staging não encontrado. Criando a partir de .env.example...$(RESET)\n"; \
				cp .env.example .env.staging 2>/dev/null || true; \
				printf "$(YELLOW)  → Edite .env.staging com os valores de staging antes de continuar.$(RESET)\n\n"; \
			fi; \
			printf "$(GREEN)→ Subindo em ambiente $(BOLD)STAGING$(RESET)\n\n"; \
			npm run dev:staging \
			;; \
		3|production) \
			if [ ! -f ".env.production" ]; then \
				printf "$(YELLOW)⚠ .env.production não encontrado. Criando a partir de .env.example...$(RESET)\n"; \
				cp .env.example .env.production 2>/dev/null || true; \
				printf "$(YELLOW)  → Edite .env.production com os valores reais antes de continuar.$(RESET)\n\n"; \
			fi; \
			printf "$(YELLOW)⚠ Você está subindo em $(BOLD)PRODUCTION$(RESET)$(YELLOW) localmente.$(RESET)\n"; \
			read -rp "  Confirma? [s/N]: " CONFIRM; \
			if [[ "$$CONFIRM" =~ ^[sS]$$ ]]; then \
				printf "$(GREEN)→ Subindo em ambiente $(BOLD)PRODUCTION$(RESET)\n\n"; \
				npm run dev; \
			else \
				printf "$(YELLOW)Cancelado.$(RESET)\n"; \
			fi \
			;; \
		*) \
			printf "$(RED)✗ Opção inválida: '$$CHOICE'. Use 1 (mock), 2 (staging) ou 3 (production).$(RESET)\n"; \
			exit 1 \
			;; \
	esac

## Roda testes em modo watch
test: install
	@printf "$(CYAN)→ Iniciando testes em modo watch...$(RESET)\n\n"
	@npm run test

## Roda testes uma vez (para CI)
test-run: install
	@printf "$(CYAN)→ Rodando suite de testes...$(RESET)\n\n"
	@npm run test:run

## Gera relatório de cobertura de testes
coverage: install
	@printf "$(CYAN)→ Gerando cobertura de testes...$(RESET)\n\n"
	@npm run test:coverage

## Build de produção
build: install
	@printf "$(CYAN)→ Build de produção...$(RESET)\n\n"
	@npm run build
	@printf "$(GREEN)✓ Build concluído em dist/$(RESET)\n"

## Build de staging
build-staging: install
	@printf "$(CYAN)→ Build de staging...$(RESET)\n\n"
	@npm run build:staging
	@printf "$(GREEN)✓ Build de staging concluído em dist/$(RESET)\n"

## Roda o linter
lint: install
	@printf "$(CYAN)→ Rodando linter...$(RESET)\n\n"
	@npm run lint

## Remove node_modules e dist
clean:
	@printf "$(YELLOW)→ Removendo node_modules e dist...$(RESET)\n"
	@rm -rf node_modules dist
	@printf "$(GREEN)✓ Limpeza concluída.$(RESET)\n"
