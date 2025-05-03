# ThreeFold Cloud Marketplace

FOSS GitHub repo for a three-layer Cloud Marketplace on the ThreeFold Grid, enabling users to deploy cloud apps via fiat payments, co-op collaborations, and automated TFT top-ups.

## Features

- **Dashboard User**:
  - Signup / login
  - Register credit/debit card (Stripe)
  - Deploy Apps (VM with optional backup)
  - Advanced node selection
- **Dashboard Operator**:
  - Collect fiat via Stripe
  - Auto-top TFT wallet (USDC→TFT via TF Connect)
  - Configure Node Pools
  - Earn margin & up to 60% discount on TFT costs
- **Node Operator**:
  - Register TFGrid nodes & metadata
  - Opt into dashboard pools
  - Earn 50% of TFChain deployment cost

## Project Roadmap

- Phase 1:
  - Frontend UX and components
- Phase 2:
  - Backend setup
- Phase 3:
  - Frontend Organized into Usable Templates
- Phase 4:
  - Backend connection with frontend for test/dev environment
- Phase 5
  - Frontend and backend for test/dev environment
- Phase 6
  - Frontend and backend minimal production environment

## Cloud Product Offering

The Cloud product offering is as follows:

- Virtual machine
  - Full virtual machine
- Orchestrator
  - Kubernetes
- Apps
  - Nextcloud
  - Livekit
  - Open WebUI
- Storage
  - Basic storage
    - SSD storage
  - Quantum safe file system storage
    - HDD storage

## Architecture & Docs

See [docs/overview.md](docs/overview.md) for full design, UX flows, and technical details.

## Tech Stack

- **Frontend**: Next.js, TypeScript, Tailwind CSS (or MUI), Stripe Elements, ethers.js
- **Backend**: Node.js, Express (or NestJS), PostgreSQL, Prisma (or TypeORM), Stripe SDK, TF Connect SDK, JWT auth
- **Infra & CI**: Docker, docker-compose, GitHub Actions, HTTPS (Let’s Encrypt), Vault/env-vars

## Getting Started

### Prerequisites

- Node.js >=16.x
- npm or yarn
- Git
- (Optional) Docker & docker-compose for containerized setup

### Clone the repository

```bash
git clone https://github.com/mik-tf/tfcloud-marketplace.git
cd tfcloud-marketplace
```

### Setup environment variables

Copy the example and edit:

```bash
cp .env.example .env
```

Provide the following in `.env`:

```
REACT_APP_API_URL=http://localhost:4000
STRIPE_PUBLISHABLE_KEY=your_stripe_key
TF_CONNECT_API_KEY=your_tf_connect_key
```

### Install dependencies

```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

### Running locally

```bash
# Start backend (port 4000)
cd backend
npm run dev

# Start frontend (port 3000)
cd ../frontend
npm run dev
```

Open http://localhost:3000 in your browser.

### Building for production

```bash
# Frontend build
cd frontend
npm run build

# Start backend
cd ../backend
npm start
```

## Contributing

Contributions welcome! Please open issues and submit PRs. Follow code style and include tests.

## License

Apache 2.0. See [LICENSE](LICENSE).