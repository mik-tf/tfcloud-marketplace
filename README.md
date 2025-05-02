# ThreeFold Cloud Marketplace

A serverless marketplace application for deploying workloads to the ThreeFold Grid.

## Overview

The ThreeFold Cloud Marketplace is a complete solution that enables users to deploy workloads to the ThreeFold Grid. It consists of:

- **Backend**: A serverless API built with Netlify Functions, Auth0, FaunaDB, and Stripe
- **Frontend**: A React-based web application that interacts with the backend API

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

- [Backend Documentation](backend/README.md): Detailed instructions on setting up and using the backend
- [Frontend Documentation](frontend/README.md): Instructions for integrating with the backend API
- [Usage Guide](USAGE_GUIDE.md): Comprehensive guide covering both frontend and backend usage

## Features

- **Authentication**: User registration and login with role-based access control
- **Deployment Management**: Create, view, update, and delete deployments
- **Provider Management**: Register as a provider and manage nodes
- **Operator Dashboard**: Manage marketplace settings and monitor system health
- **Payment Processing**: Secure payment handling with Stripe

## User Roles

- **Cloud Users**: End users deploying applications
- **Cloud Providers**: Node operators providing infrastructure
- **Cloud Operators**: Dashboard operators managing the marketplace

## Getting Started

### Prerequisites

- Node.js (v16 or later)
- npm or yarn
- Netlify CLI
- Auth0 account
- FaunaDB account
- Stripe account (for payment processing)

### Quick Start

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/tfcloud-marketplace.git
   cd tfcloud-marketplace
   ```

2. Set up the backend:
   ```bash
   cd backend
   npm install
   cp .env.example .env
   # Edit .env with your credentials
   npm run setup:fauna
   npm run dev
   ```

3. Set up the frontend:
   ```bash
   cd ../frontend
   npm install
   cp .env.example .env
   # Edit .env with your credentials
   npm run dev
   ```

4. Access the application:
   - Backend API: http://localhost:8888/.netlify/functions/api
   - Frontend: http://localhost:3000

## Development

See the [Usage Guide](USAGE_GUIDE.md) for detailed development instructions.

## Deployment

The project includes GitHub Actions workflows for continuous integration and deployment:

- Backend is deployed to Netlify
- Frontend is deployed to GitHub Pages

See the [Usage Guide](USAGE_GUIDE.md) for detailed deployment instructions.

## Implementation Status

- **Phase 1**: ✅ Completed - Core infrastructure and standard integrations
- **Phase 2**: 🔄 Planned - ThreeFold-specific integrations

## License

This project is licensed under the Apache 2.0 License.