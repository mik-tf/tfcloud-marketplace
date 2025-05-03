# ThreeFold Cloud Marketplace

A serverless marketplace application for deploying workloads to the ThreeFold Grid.

## Overview

The ThreeFold Cloud Marketplace is a complete solution that enables users to deploy workloads to the ThreeFold Grid. It consists of:

- **Backend**: A serverless API built with Netlify Functions, Auth0, MongoDB Atlas, and Stripe
- **Frontend**: A React-based web application built with Vite and TypeScript that interacts with the backend API

## Current Development Status

This project is currently in early development. The frontend UI components and basic structure have been implemented, but the integration with backend services and third-party providers (Auth0, Stripe, etc.) is still in progress.

## Repository Structure

```
tfcloud-marketplace/
├── .github/                # GitHub configuration
│   └── workflows/          # GitHub Actions workflows
│       ├── backend-ci-cd.yml   # Backend CI/CD workflow
│       └── frontend-ci-cd.yml  # Frontend CI/CD workflow
├── backend/                # Backend code
│   ├── functions/          # Netlify Functions
│   ├── scripts/            # Setup scripts
│   ├── src/                # Source code
│   └── tests/              # Test files
├── frontend/               # Frontend code
│   ├── public/             # Static assets
│   └── src/                # Source code
├── USAGE_GUIDE.md          # Comprehensive usage guide
└── README.md               # This file
```

## Documentation

- [Project Overview](docs/overview.md): Comprehensive overview of the project goals, architecture, and roadmap
- [Development Steps](docs/steps.md): Detailed development roadmap and current status
- [Backend Documentation](backend/README.md): Detailed instructions on setting up and using the backend
- [Frontend Documentation](frontend/README.md): Instructions for integrating with the backend API

## Features

- **Authentication**: User registration and login with role-based access control
- **Deployment Management**: Create, view, update, and delete deployments
- **Provider Management**: Register as a provider and manage nodes
- **Operator Dashboard**: Manage marketplace settings and monitor system health
- **Payment Processing**: Secure payment handling with Stripe

## User Roles

- **Cloud Users**: End users deploying applications
- **Cloud Providers**: Node operators providing infrastructure
- **Cloud Operators**: Marketplace administrators who deploy and manage the platform

## Development Roadmap

The project follows a modular, phased approach to development:

1. **Interface & Flow Integration** ✅ (Current Phase)
   - Design and implement the core UI/UX interface
   - Create end-to-end workflow for mock deployments
   - Ensure components are modular for easy extension

2. **Connect to TFChain** 🔄 (Next Phase)
   - Integrate TFChain SDK for real deployments
   - Implement wallet management
   - Issue deployment transactions on TFChain

3. **Stripe Integration** 🔄 (Planned)
   - Set up Stripe SDK for fiat payments
   - Implement payment flow
   - Link payments to TFChain deployment credits

4. **Backend Integration** 🔄 (Planned)
   - Connect frontend with backend services
   - Implement authentication with Auth0
   - Set up database interactions

5. **Documentation & CI** 🔄 (Ongoing)
   - Update documentation at each milestone
   - Set up linting and formatting
   - Configure CI pipeline for tests and builds

6. **Deployment** 🔄 (Planned)
   - Configure GitHub Pages deployment
   - Set up multi-environment support (dev/prod)
   - Implement DNS and HTTPS configuration

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

**Note**: The Cloud Operator role should only be assigned to trusted administrators who deploy the marketplace. This role has full administrative access to the platform and controls which users can become cloud providers.

## Getting Started

For a comprehensive overview of the project, see the [Project Overview](docs/overview.md). For detailed development steps and current status, see the [Development Steps](docs/steps.md).

### Prerequisites

- Node.js (v16 or later)
- npm or yarn
- Netlify CLI
  - `npm install -g netlify-cli`
- Auth0 account
- MongoDB Atlas account
- Stripe account (for payment processing)

### Quick Start

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/tfcloud-marketplace.git
   cd tfcloud-marketplace
   ```

2. Set up the frontend:
   ```bash
   cd ../frontend
   npm install
   npm run dev
   ```

3. Set up the backend:
   ```bash
   cd backend
   npm install
   cp .env.example .env
   # Edit .env with your credentials (see Setup Guide for details)
   npm run setup:mongodb
   npm run dev
   ```

4. Access the application:
   - Backend API: http://localhost:8888/.netlify/functions/api
   - Frontend: http://localhost:3000

## Development

See the [Development Steps](docs/steps.md) for detailed development instructions and current project status.

## Deployment

The project includes GitHub Actions workflows for continuous integration and deployment:

- Backend is deployed to Netlify
- Frontend is deployed to GitHub Pages with multi-domain support:
  - Production environment (main branch) → threefold.store
  - Development environment (dev branch) → dev.threefold.store

This multi-domain setup allows for testing features in a development environment before deploying to production, including testing integrations like Stripe webhooks with a dedicated development domain.

## Environment Setup

### Backend Environment

The backend requires a `.env` file in the `backend/` directory with the following variables:

```
# Auth0 Configuration
AUTH0_DOMAIN=your-auth0-domain.auth0.com
AUTH0_CLIENT_ID=your-auth0-client-id
AUTH0_CLIENT_SECRET=your-auth0-client-secret
AUTH0_CALLBACK_URL=http://localhost:8888/api/auth/callback
AUTH0_AUDIENCE=https://your-api-identifier

# MongoDB Configuration
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster-url>/<database-name>?retryWrites=true&w=majority

# Stripe Configuration
STRIPE_SECRET_KEY=your-stripe-secret-key
STRIPE_WEBHOOK_SECRET=your-stripe-webhook-secret

# Application Settings
NODE_ENV=development
API_URL=http://localhost:8888/api
FRONTEND_URL=http://localhost:3000
```

### Frontend Environment

The frontend has a `.env` file in the `frontend/` directory, but it's not currently being used by the code. It's set up in anticipation of future development phases when the frontend will be integrated with the backend and third-party services. The expected variables are:

```
VITE_API_URL=http://localhost:8888/api
VITE_AUTH0_DOMAIN=your-auth0-domain.auth0.com
VITE_AUTH0_CLIENT_ID=your-auth0-client-id
VITE_AUTH0_AUDIENCE=https://your-api-identifier
```

## License

This project is licensed under the Apache 2.0 License.