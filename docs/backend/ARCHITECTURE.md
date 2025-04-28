# Backend Architecture & Best Practices

This section outlines an industry-standard, modular, and evolutive backend design for production.

---

## 1. Technology Stack

- **Platform**: Node.js (LTS) with TypeScript
- **Framework**: NestJS (decorators, modular, DI) or Express with TypeScript
- **API Style**: REST (OpenAPI/Swagger) or GraphQL (Apollo)
- **ORM/DB**: Prisma + PostgreSQL or TypeORM
- **Messaging**: RabbitMQ / Kafka for events
- **Cache**: Redis for sessions & rate-limit
- **Payments**: Stripe SDK + secure webhooks
- **Token Swap**: `stellar-sdk` Path Payment Strict Receive (USDC→TFT)
- **On-chain**: `threefold-ts` or TFConnect SDK for TFChain interactions
- **Auth**: JWT (passport.js) or OAuth2 (Auth0)

## 2. Microservice Modules

1. **Auth Service**
   - Login/signup, JWT issuance, RBAC
   - Uses Redis for session store & revocation lists

2. **Payments Service**
   - Endpoints:
     - `POST /payments/create-intent`
     - `POST /payments/webhook`
   - Idempotency keys, webhook signature validation

3. **Swap Service**
   - Listens for USDC deposits on Stellar
   - Calls Path Payment Strict Receive on Horizon
   - Emits TFT→TFChain handoff event

4. **Deployments Service**
   - `POST/PUT/DELETE /deployments`
   - Calls TFChain via threefold-ts, tracks tx hashes
   - Stores state in PostgreSQL with Prisma models

5. **Node-Onboarding Service**
   - NodeOperator requests, DashboardOperator approvals
   - Event bus for status changes, email/webhooks

6. **Notification Service**
   - Webhooks, email (SendGrid/Mailgun), SMS

## 3. Communication & Events

- Event-driven: RabbitMQ or Kafka topics
- Use domain events (e.g. `UserPaid`, `SwapCompleted`, `DeploymentCreated`)
- Consumers subscribe per microservice

## 4. DevOps & CI/CD

- **Containerization**: Docker for each service
- **Orchestration**: Kubernetes (Helm charts)
- **CI**: GitHub Actions for build/test/lint
- **CD**: ArgoCD or GitOps for deployments
- **IaC**: Terraform (EKS/GKE, RDS, VPC)
- **Monitoring**: Prometheus + Grafana
- **Logging**: ELK stack or Loki
- **Tracing**: OpenTelemetry + Jaeger

## 5. Security & Compliance

- 12-Factor App (env vars, clean logs)
- Secret Management (Vault / AWS Secrets Manager)
- Rate limiting (API Gateway or middleware)
- Input validation (class-validator)
- OWASP best practices, Snyk vulnerability scans
- CORS, Helmet, CSP headers

## 6. Testing Strategy

- **Unit Tests**: Jest + SuperTest
- **Contract Tests**: Pact for APIs
- **Integration Tests**: Docker Compose with real services
- **E2E Tests**: Cypress or Playwright
- **Coverage**: Aim ≥ 80%

## 7. Documentation

- OpenAPI YAML + Swagger UI served by API Gateway
- Typedoc for TypeScript code docs

## 8. Serverless + Static Deployment

- **Static Frontend**: Single-page app (React/Vite) deployed as static assets (GitHub Pages, Vercel, Netlify, Cloudflare Pages) with CDN caching.
- **Serverless Backend**: Short-lived functions (AWS Lambda, Netlify Functions, Vercel Functions) for all API operations (Auth, Payments, Swap, Deploy, Node-Onboarding).
- **Client vs Backend**: UI runs entirely in the browser, but secret operations (Stripe intents, webhook validation, Stellar path-payment, TFChain calls) run in serverless functions—this is not pure client-only code.
- **CI/CD**:
  - **Frontend**: On push to `main`, build static bundle and deploy assets.
  - **Functions**: Build & deploy serverless functions in same pipeline (e.g. Netlify/Vercel integration).
- Auto-scaling, pay-per-invocation; no dedicated IPv4 server required
- Secure secrets via environment variables; HTTP-triggered endpoints via API Gateway or edge functions

---

*This architecture is designed for high maintainability, scalability, and security, ready to evolve as new services and integrations arise.*
