# Makefile for common dev tasks
.PHONY: dev up down build logs dev-frontend logs-frontend

dev: up
	@echo "Dev environment started. Open http://localhost:8080/hoi4-innova.html"

up:
	@if command -v docker >/dev/null 2>&1; then \
		echo "Starting docker compose..."; \
		docker compose up --build -d || docker-compose up --build -d; \
		echo "Dev environment started. Open http://localhost:8080/hoi4-innova.html"; \
	else \
		echo "Docker not available; cannot start dev environment"; \
		exit 2; \
	fi

down:
	@if command -v docker >/dev/null 2>&1; then \
		docker compose down || docker-compose down || true; \
		echo "Compose stopped"; \
	else \
		echo "Docker not available; nothing to stop"; \
	fi

build:
	@if command -v docker >/dev/null 2>&1; then \
		echo "Building images via docker compose..."; \
		docker compose build || docker-compose build; \
		echo "Compose images built"; \
	else \
		echo "Docker not available; cannot build images"; \
	fi

logs:
	@docker compose logs --follow || docker-compose logs --follow || echo "No compose logs available"

# Frontend dev helpers
dev-frontend:
	@if command -v docker >/dev/null 2>&1; then \
		echo "Starting frontend dev server via docker compose..."; \
		docker compose up --build frontend; \
	else \
		echo "Docker not available; cannot start frontend dev"; \
		exit 2; \
	fi

logs-frontend:
	@docker compose logs --follow frontend || echo "No frontend logs available"
