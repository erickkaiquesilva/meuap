# ==============================================================
#  Chave — Makefile
#  Execute a partir da raiz do projeto (meuap/)
#  Uso: make <target>
#  Exemplo: make start
# ==============================================================

SHELL    := /bin/bash
APP_DIR  := chave
.DEFAULT_GOAL := help

# Cores ANSI
BOLD   := \033[1m
RESET  := \033[0m
BLUE   := \033[0;34m
GREEN  := \033[0;32m
YELLOW := \033[0;33m
RED    := \033[0;31m
CYAN   := \033[0;36m

# Caminho para node_modules dentro de chave/
NODE_MODULES := $(APP_DIR)/node_modules/.package-lock.json

# ==============================================================
#  TARGETS
# ==============================================================

.PHONY: help start install test test-run coverage build build-staging lint check-node clean

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
		printf "$(CYAN)→ Instalando dependências em $(APP_DIR)/...$(RESET)\n"; \
		cd $(APP_DIR) && npm install; \
		printf "$(GREEN)✓ Dependências instaladas.$(RESET)\n"; \
	else \
		printf "$(GREEN)✓ Dependências já instaladas.$(RESET)\n"; \
	fi

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
			if [ ! -f "$(APP_DIR)/.env.mock" ]; then \
				printf "$(YELLOW)⚠ .env.mock não encontrado. Criando a partir de .env.example...$(RESET)\n"; \
				cp $(APP_DIR)/.env.example $(APP_DIR)/.env.mock 2>/dev/null || true; \
			fi; \
			if [ ! -f "$(APP_DIR)/.env.development" ]; then \
				cp $(APP_DIR)/.env.example $(APP_DIR)/.env.development 2>/dev/null || true; \
			fi; \
			printf "$(GREEN)→ Subindo em ambiente $(BOLD)MOCK$(RESET)$(GREEN) (MSW ativo, sem backend)$(RESET)\n\n"; \
			cd $(APP_DIR) && npm run dev:mock \
			;; \
		2|staging) \
			if [ ! -f "$(APP_DIR)/.env.staging" ]; then \
				printf "$(YELLOW)⚠ .env.staging não encontrado. Criando a partir de .env.example...$(RESET)\n"; \
				cp $(APP_DIR)/.env.example $(APP_DIR)/.env.staging 2>/dev/null || true; \
				printf "$(YELLOW)  → Edite chave/.env.staging com os valores de staging.$(RESET)\n\n"; \
			fi; \
			printf "$(GREEN)→ Subindo em ambiente $(BOLD)STAGING$(RESET)\n\n"; \
			cd $(APP_DIR) && npm run dev:staging \
			;; \
		3|production) \
			if [ ! -f "$(APP_DIR)/.env.production" ]; then \
				printf "$(YELLOW)⚠ .env.production não encontrado. Criando a partir de .env.example...$(RESET)\n"; \
				cp $(APP_DIR)/.env.example $(APP_DIR)/.env.production 2>/dev/null || true; \
				printf "$(YELLOW)  → Edite chave/.env.production com os valores reais.$(RESET)\n\n"; \
			fi; \
			printf "$(YELLOW)⚠ Você está subindo em $(BOLD)PRODUCTION$(RESET)$(YELLOW) localmente.$(RESET)\n"; \
			read -rp "  Confirma? [s/N]: " CONFIRM; \
			if [[ "$$CONFIRM" =~ ^[sS]$$ ]]; then \
				printf "$(GREEN)→ Subindo em ambiente $(BOLD)PRODUCTION$(RESET)\n\n"; \
				cd $(APP_DIR) && npm run dev; \
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
	@cd $(APP_DIR) && npm run test

## Roda testes uma vez (para CI)
test-run: install
	@printf "$(CYAN)→ Rodando suite de testes...$(RESET)\n\n"
	@cd $(APP_DIR) && npm run test:run

## Gera relatório de cobertura de testes
coverage: install
	@printf "$(CYAN)→ Gerando cobertura de testes...$(RESET)\n\n"
	@cd $(APP_DIR) && npm run test:coverage

## Build de produção
build: install
	@printf "$(CYAN)→ Build de produção...$(RESET)\n\n"
	@cd $(APP_DIR) && npm run build
	@printf "$(GREEN)✓ Build concluído em chave/dist/$(RESET)\n"

## Build de staging
build-staging: install
	@printf "$(CYAN)→ Build de staging...$(RESET)\n\n"
	@cd $(APP_DIR) && npm run build:staging
	@printf "$(GREEN)✓ Build de staging concluído em chave/dist/$(RESET)\n"

## Roda o linter
lint: install
	@printf "$(CYAN)→ Rodando linter...$(RESET)\n\n"
	@cd $(APP_DIR) && npm run lint

## Remove node_modules e dist
clean:
	@printf "$(YELLOW)→ Removendo chave/node_modules e chave/dist...$(RESET)\n"
	@rm -rf $(APP_DIR)/node_modules $(APP_DIR)/dist
	@printf "$(GREEN)✓ Limpeza concluída.$(RESET)\n"
