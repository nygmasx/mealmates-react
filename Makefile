COMPOSE=docker compose
COMPOSE_MAC=$(COMPOSE) -f docker-compose-sync.yml
EXEC=$(COMPOSE) exec node
ENVIRONMENT=$(shell uname -s)
SHELL := /bin/bash
MUTAGEN_NAME=react-app-sync

up:
	@if [ -n "$$(docker ps -q 2>/dev/null)" ]; then \
		echo "Arrêt des conteneurs en cours..."; \
		docker kill $$(docker ps -q); \
	else \
		echo "Aucun conteneur en cours d'exécution à arrêter"; \
	fi
ifeq ($(ENVIRONMENT),Darwin)
	@echo "Environnement Mac détecté"
	@if [ -f docker-compose-sync.yml ]; then \
		$(COMPOSE_MAC) up -d --build --remove-orphans; \
		if [ -f ./scripts/start-macos.sh ]; then \
			bash ./scripts/start-macos.sh; \
		else \
			echo "Le script start-macos.sh n'existe pas. Création du service Mutagen manuellement..."; \
			mutagen sync create --name=$(MUTAGEN_NAME) ./ docker://meal-mates-react-node-1/app; \
		fi \
	else \
		echo "Fichier docker-compose-sync.yml non trouvé, utilisation du docker-compose standard"; \
		$(COMPOSE) up -d --build --remove-orphans; \
	fi
else
	@echo "Environnement Linux/autre détecté"
	$(COMPOSE) up -d --build --remove-orphans
endif

stop:
ifeq ($(ENVIRONMENT),Darwin)
	@echo "Arrêt des conteneurs sur Mac..."
	@if [ -f docker-compose-sync.yml ]; then \
		$(COMPOSE_MAC) stop; \
		if command -v mutagen >/dev/null 2>&1; then \
			echo "Pause de la synchronisation Mutagen..."; \
			mutagen sync pause $(MUTAGEN_NAME) 2>/dev/null || true; \
		else \
			echo "Mutagen non installé. Ignoré."; \
		fi \
	else \
		$(COMPOSE) stop; \
	fi
else
	@echo "Arrêt des conteneurs..."
	$(COMPOSE) stop
endif

rm:
	@echo "Arrêt des conteneurs..."
	-make stop
ifeq ($(ENVIRONMENT),Darwin)
	@echo "Suppression des conteneurs sur Mac..."
	@if [ -f docker-compose-sync.yml ]; then \
		$(COMPOSE_MAC) rm -f; \
		if command -v mutagen >/dev/null 2>&1; then \
			echo "Arrêt de la synchronisation Mutagen..."; \
			mutagen sync terminate $(MUTAGEN_NAME) 2>/dev/null || true; \
		else \
			echo "Mutagen non installé. Ignoré."; \
		fi \
	else \
		$(COMPOSE) rm -f; \
	fi
else
	@echo "Suppression des conteneurs..."
	$(COMPOSE) rm -f
endif

ssh:
	$(EXEC) sh

install:
	$(EXEC) npm install

dev:
	$(EXEC) npm run dev -- --host 0.0.0.0

start:
	$(EXEC) npm start

build:
	$(EXEC) npm run build

test:
	$(EXEC) npm test

lint:
	$(EXEC) npm run lint

format:
	$(EXEC) npm run format

# Commandes de développement
setup-dev: up install dev

# Déploiement
deploy: build
	$(EXEC) npm run deploy

# Nettoyage des node_modules
clean-modules:
	$(EXEC) rm -rf node_modules

# Redémarrage complet
restart: stop up

# Logs
logs:
	$(COMPOSE) logs -f

logs-node:
	$(COMPOSE) logs -f node

# Aide
help:
	@echo "Commandes disponibles:"
	@echo "  make setup           - Configurer les fichiers Docker nécessaires"
	@echo "  make up              - Démarrer les conteneurs"
	@echo "  make stop            - Arrêter les conteneurs"
	@echo "  make rm              - Supprimer les conteneurs"
	@echo "  make ssh             - Se connecter au conteneur node"
	@echo "  make install         - Installer les dépendances npm"
	@echo "  make dev             - Démarrer le serveur de développement (npm run dev)"
	@echo "  make start           - Démarrer l'application React (npm start)"
	@echo "  make build           - Construire l'application React pour la production"
	@echo "  make test            - Exécuter les tests"
	@echo "  make lint            - Exécuter le linter"
	@echo "  make format          - Formater le code"
	@echo "  make setup-dev       - Démarrer l'environnement de développement complet"
	@echo "  make deploy          - Déployer l'application"
	@echo "  make clean-modules   - Supprimer le dossier node_modules"
	@echo "  make restart         - Redémarrer les conteneurs"
	@echo "  make logs            - Afficher les logs de tous les conteneurs"
	@echo "  make logs-node       - Afficher les logs du conteneur node"

.PHONY: up stop rm ssh install dev start build test lint format setup-dev deploy clean-modules restart logs logs-node help setup
