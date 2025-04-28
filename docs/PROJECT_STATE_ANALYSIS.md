# Project State Analysis

This document provides an overview of the current state of the **tfcloud-marketplace** project and outlines the recommended next steps for backend implementation.

## 1. Frontend Status

- Framework: React + TypeScript + Vite + Tailwind CSS
- Features Completed:
  - Responsive navigation with mobile hamburger menu, light/dark mode toggle
  - Documentation pages rendered from Markdown (`.md`) with right-side TOC
  - SPA routing with GitHub Pages SPA fallback (404→index.html)
  - Pages implemented: Welcome, Ecosystem, Dashboard Users, Dashboard Operators, Node Operators
  - Makefile and smoke-test documentation added
- Quality:
  - Modular component architecture (DocsLayout, NavBar, FAQ)
  - Theming via Tailwind `darkMode: 'class'`
  - Unit tests pending (recommend adding Jest/React Testing Library)

**Conclusion:** Frontend is feature-complete for v1 with documentation, routing, and theming. Next steps should focus on backend integration and end-to-end workflows.

## 2. Backend Next Steps

The backend will power payment processing, on-chain operations, and inter-service communication. Recommended architecture:

### 2.1. Payments (Stripe)

- Integrate Stripe SDK in a secure Node.js (or NestJS) microservice
- Endpoints:
  - `POST /api/payments/create-intent` → create payment intent for Dashboard User
  - `POST /api/payments/webhook` → handle Stripe webhooks (success, failure)
- Secure with API keys & webhook signing

### 2.2. On-chain Operations (TFChain & TFGrid)

- Service to sync Dashboard Operator actions with TFChain:
  - `POST /api/deployments` → create deployment via TFChain wallet (node operator co-op)
  - `DELETE /api/deployments/:id` → remove deployment
  - `PUT /api/deployments/:id` → update deployment parameters
- Use `threefold-ts` or official TFChain SDK
- Maintain mapping between internal deployment IDs and on-chain transaction hashes

### 2.3. Token Swap (TFConnect)

- Integrate TFConnect SDK to swap USDC → TFT for payments
- Provide UX flow to Dashboard Operator:
  1. User pays with credit/debit (Stripe)
  2. Backend swaps USDC to TFT via TFConnect API
  3. Funds credited to Dashboard Operator’s TFChain wallet

### 2.4. Node Operator Access & Co-op Workflow

- Identity & Authentication:
  - JWT-based auth (Auth0 or custom) for Node Operators and Dashboard Operators
  - Role-based access control (RBAC)
- Node Onboarding:
  - Node Operator logs in → requests access (via `POST /api/nodes/request`)
  - Dashboard Operator approves/rejects requests (`PUT /api/nodes/:id/status`)
- Notifications & Sync:
  - Event-driven architecture (e.g. RabbitMQ or Kafka) to propagate status updates
  - Email/webhook notifications for request approvals

### 2.5. Infrastructure & DevOps

- Containerize services with Docker, orchestrate with Kubernetes (EKS/GKE)
- CI/CD pipeline (GitHub Actions) for backend builds, tests, and deployments
- Monitoring & Logging (Prometheus, Grafana, ELK)
- Security audits, vulnerability scanning (Snyk)

## 3. Best Practices & Modular Evolution

- Use TypeScript across frontend & backend for type safety
- Adhere to RESTful patterns or GraphQL depending on client requirements
- Write comprehensive unit/integration tests
- Use Swagger/OpenAPI for API documentation
- Follow semantic versioning (SemVer)
- Ensure microservices are loosely coupled and independently deployable
- Use environment variables and a 12-factor app methodology

---

This plan provides a roadmap to evolve the project from a complete frontend to a full-stack, production-ready marketplace.
