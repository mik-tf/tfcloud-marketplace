# Makefile for tfcloud-marketplace

.PHONY: help dev build preview smoke

help:
	@echo "Available targets:"
	@echo "  dev     Install deps & start development server"
	@echo "  build   Install deps & build production assets"
	@echo "  preview Preview production build locally (SPA fallback via vite preview)"
	@echo "  smoke   Build & serve production build for smoke testing (static server)"

# Launch local dev server
dev:
	cd frontend && npm ci && npm run dev

# Build for production
build:
	cd frontend && npm ci && npm run build

# Preview production build
preview:
	cd frontend && npm ci && npm run serve

# Smoke test: build + static serve with SPA fallback
smoke:
	cd frontend && npm ci && npm run build
	# requires 'serve' (npm install -g serve) or uses npx
	npx serve -s frontend/dist
