# ThreeFold Cloud Marketplace Usage Guide

This guide provides comprehensive instructions on how to use the ThreeFold Cloud Marketplace, covering both the frontend and backend components. It's designed for developers, operators, and users who want to understand how to work with the platform.

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
├── USAGE_GUIDE.md          # This file
└── README.md               # Project overview
```

## Table of Contents

- [Overview](#overview)
- [Getting Started](#getting-started)
- [User Roles](#user-roles)
- [Development Environment Setup](#development-environment-setup)
- [Backend Usage](#backend-usage)
- [Frontend Usage](#frontend-usage)
- [Integration Points](#integration-points)
- [Common Workflows](#common-workflows)
- [Deployment Guide](#deployment-guide)
- [Troubleshooting](#troubleshooting)
- [Next Steps](#next-steps)

## Overview

The ThreeFold Cloud Marketplace is a serverless application that enables users to deploy workloads to the ThreeFold Grid. It consists of:

- **Backend**: A serverless API built with Netlify Functions, Auth0, FaunaDB, and Stripe
- **Frontend**: A React-based web application that interacts with the backend API

The application supports three user roles:
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

## User Roles

### Cloud User

Cloud Users can:
- Register and log in
- Browse available deployments
- Create, view, update, and delete their deployments
- Manage payment methods
- View transaction history

### Cloud Provider

Cloud Providers can:
- Register as a provider
- Manage their nodes
- Schedule maintenance windows
- View node performance metrics

### Cloud Operator

The Cloud Operator is the person who deploys and manages the ThreeFold Cloud Marketplace. This role should be restricted to the marketplace administrator(s) only.

Cloud Operators can:
- Manage dashboard settings
- Update pricing configuration
- Approve or reject provider requests
- View all users and deployments
- Monitor system health
- Control which cloud providers can deploy on the platform

**Important**: The Cloud Operator role should be manually assigned in Auth0 only to trusted administrators who deploy and manage the marketplace. This role has full administrative access to the platform.

## Development Environment Setup

### Backend Setup

1. **Auth0 Configuration**:
   - Create a new Auth0 application (Regular Web Application)
   - Configure callback URLs, logout URLs, and web origins
   - Create an API with the required permissions
   - Create the following roles in Auth0:
     - `cloud-user`: For regular end users (can be assigned during signup)
     - `cloud-provider`: For infrastructure providers (assigned after approval)
     - `cloud-operator`: For marketplace administrators (manually assigned to trusted admins only)
   - Assign appropriate permissions to each role

2. **FaunaDB Setup**:
   - Create a new database
   - Generate a server key
   - Run the setup script: `npm run setup:fauna`

3. **Stripe Setup**:
   - Create a Stripe account
   - Get API keys
   - Set up webhook endpoint

4. **Environment Variables**:
   - Copy `.env.example` to `.env`
   - Fill in Auth0, FaunaDB, and Stripe credentials

### Frontend Setup

1. **Environment Variables**:
   - Copy `.env.example` to `.env`
   - Set API URL, Auth0, and Stripe configuration

2. **Development Server**:
   - Run `npm run dev` to start the development server

## Backend Usage

### Starting the Backend

```bash
cd backend
npm run dev
```

This starts the Netlify dev server at `http://localhost:8888`.

### API Endpoints

The backend provides the following API endpoints:

#### Authentication

- `GET /api/auth/login`: Redirect to Auth0 login page
- `GET /api/auth/callback`: Handle Auth0 callback after login
- `GET /api/auth/logout`: Log out user and clear session
- `GET /api/auth/session`: Get current user session information
- `GET /api/auth/me`: Get user profile information

#### Cloud User Endpoints

- `GET /api/cloud-user/deployments`: Get all deployments for the authenticated user
- `POST /api/cloud-user/deployments`: Create a new deployment
- `GET /api/cloud-user/deployments/:id`: Get details of a specific deployment
- `PUT /api/cloud-user/deployments/:id`: Update a deployment
- `DELETE /api/cloud-user/deployments/:id`: Delete a deployment
- `GET /api/cloud-user/profile`: Get user profile
- `PUT /api/cloud-user/profile`: Update user profile

#### Cloud Provider Endpoints

- `POST /api/cloud-provider/register`: Register as a cloud provider
- `GET /api/cloud-provider/nodes`: Get all nodes for the authenticated provider
- `POST /api/cloud-provider/nodes`: Add a new node
- `POST /api/cloud-provider/maintenance`: Schedule maintenance for a node
- `GET /api/cloud-provider/maintenance`: Get all scheduled maintenance for provider's nodes
- `GET /api/cloud-provider/profile`: Get provider profile
- `PUT /api/cloud-provider/profile`: Update provider profile

#### Cloud Operator Endpoints

- `GET /api/cloud-operator/settings`: Get dashboard settings
- `PUT /api/cloud-operator/settings`: Update dashboard settings
- `GET /api/cloud-operator/pricing`: Get pricing configuration
- `PUT /api/cloud-operator/pricing`: Update pricing configuration
- `GET /api/cloud-operator/provider-requests`: Get all provider requests
- `PUT /api/cloud-operator/provider-requests/:id`: Update provider request status
- `GET /api/cloud-operator/users`: Get all users
- `GET /api/cloud-operator/deployments`: Get all deployments

#### Payment Endpoints

- `POST /api/payments/create-intent`: Create a payment intent
- `GET /api/payments/methods`: Get user's payment methods
- `POST /api/payments/methods`: Add a payment method
- `DELETE /api/payments/methods/:id`: Delete a payment method
- `GET /api/payments/transactions`: Get user's transaction history
- `POST /api/payments/webhook`: Handle Stripe webhook events

### Testing

```bash
# Run all tests
npm test

# Run specific test types
npm run test:unit
npm run test:integration
npm run test:e2e
```

## Frontend Usage

### Starting the Frontend

```bash
cd frontend
npm run dev
```

This starts the development server at `http://localhost:3000`.

### Key Components

The frontend includes several pre-built components:

#### Authentication Components

- `LoginButton`: Button for login/logout
- `UserProfile`: Display user profile information
- `ProtectedRoute`: Route that requires authentication

#### Deployment Components

- `DeploymentsList`: List of user deployments
- `DeploymentDetail`: Detailed view of a deployment
- `DeploymentForm`: Form for creating/editing deployments

#### Payment Components

- `PaymentForm`: Form for payment information
- `PaymentMethodsList`: List of saved payment methods
- `TransactionHistory`: Display transaction history

### Authentication Flow

1. User clicks login button, which calls `auth0Service.login()`
2. User is redirected to Auth0 login page
3. After successful login, Auth0 redirects back to the callback URL
4. The callback handler extracts tokens and user info
5. The frontend stores the authentication state
6. Protected API requests include the access token in the Authorization header

## Integration Points

### Backend to Frontend Integration

The frontend integrates with the backend using the provided services:

- `auth.js`: Authentication service for Auth0 integration
- `api.js`: API client for making requests to the backend
- `payment.js`: Service for Stripe payment integration

### Example: Creating a Deployment

```javascript
// Frontend code
import apiClient from '../services/api';

const createDeployment = async (deploymentData) => {
  try {
    const response = await apiClient.createDeployment(deploymentData);
    return response.deployment;
  } catch (error) {
    console.error('Error creating deployment:', error);
    throw error;
  }
};

// Usage in a component
const handleSubmit = async (event) => {
  event.preventDefault();
  
  const deploymentData = {
    name: deploymentName,
    description: deploymentDescription,
    resources: {
      cpu: cpuCount,
      memory: memoryGB,
      storage: storageGB
    },
    billing: {
      planId: 'basic',
      amount: price,
      currency: 'USD',
      interval: 'monthly'
    }
  };
  
  try {
    const deployment = await createDeployment(deploymentData);
    console.log('Deployment created:', deployment);
  } catch (error) {
    console.error('Failed to create deployment:', error);
  }
};
```

### Example: Processing a Payment

```javascript
// Frontend code
import paymentService from '../services/payment';

const processPayment = async (amount, description) => {
  try {
    // Create payment method
    await paymentService.createPaymentMethod({
      name: user.name,
      email: user.email
    });
    
    // Process payment
    const result = await paymentService.processPayment(
      amount,
      'usd',
      description
    );
    
    return result;
  } catch (error) {
    console.error('Payment failed:', error);
    throw error;
  }
};
```

## Common Workflows

### User Registration and Login

1. User navigates to the login page
2. User clicks "Sign Up" on the Auth0 login page
3. User completes registration form
4. User is redirected back to the application
5. Frontend stores authentication state
6. Backend creates user profile in FaunaDB

### Creating a Deployment

1. User navigates to the deployments page
2. User clicks "Create Deployment"
3. User fills out deployment form
4. User submits form
5. Frontend sends request to backend
6. Backend creates deployment in FaunaDB
7. Backend returns deployment details
8. Frontend displays success message

### Processing a Payment

1. User selects a deployment plan
2. User enters payment information
3. Frontend creates payment method
4. Frontend sends payment intent request to backend
5. Backend creates payment intent with Stripe
6. Frontend confirms payment with Stripe
7. Backend processes payment and updates database
8. Frontend displays success message

### Provider Registration

1. User navigates to provider registration page
2. User fills out provider registration form
3. User submits form
4. Frontend sends request to backend
5. Backend creates provider request in FaunaDB
6. Cloud operator reviews request through the cloud operator dashboard
7. Cloud operator approves or rejects request
8. If approved, user is automatically assigned the cloud-provider role in Auth0

This workflow ensures that only the cloud operator (marketplace administrator) can control which users become cloud providers, maintaining the security and integrity of the platform.

## Deployment Guide

### CI/CD Workflows

The project includes GitHub Actions workflows for continuous integration and deployment:

1. **Backend Workflow** (`.github/workflows/backend-ci-cd.yml`):
   - Triggered by changes to backend files
   - Runs tests and linting
   - Deploys to Netlify on successful merge to main branch
   - Sets up FaunaDB collections and indexes

2. **Frontend Workflow** (`.github/workflows/frontend-ci-cd.yml`):
   - Triggered by changes to frontend files
   - Runs tests and linting
   - Builds the frontend application
   - Deploys to GitHub Pages on successful merge to main branch

### Backend Deployment

1. **Netlify Setup**:
   - Connect your GitHub repository to Netlify
   - Configure build settings:
     - Build command: `cd backend && npm install && npm run build`
     - Publish directory: `backend/functions`
   - Configure environment variables in Netlify dashboard

2. **FaunaDB Setup**:
   - Run the setup script to create collections and indexes:
     ```bash
     FAUNADB_SECRET=your-secret node backend/scripts/setup-fauna.js
     ```

3. **Auth0 Configuration**:
   - Update callback URLs, logout URLs, and web origins with production URLs

4. **Stripe Configuration**:
   - Update webhook endpoint with production URL

### Frontend Deployment

1. **Build the Frontend**:
   ```bash
   cd frontend
   npm run build
   ```

2. **Deploy to GitHub Pages**:
   ```bash
   npm run deploy
   ```

3. **Or Deploy to Netlify**:
   - Connect your GitHub repository to Netlify
   - Configure build settings:
     - Build command: `cd frontend && npm install && npm run build`
     - Publish directory: `frontend/dist`
   - Configure environment variables in Netlify dashboard

## Troubleshooting

### Common Issues

1. **Authentication Issues**
   - Check Auth0 configuration
   - Verify callback URLs are correctly set up
   - Check browser console for CORS errors

2. **API Connection Issues**
   - Verify the backend API is running
   - Check API URL in environment variables
   - Check browser console for network errors

3. **Database Issues**
   - Verify FaunaDB secret key
   - Check if collections and indexes are created correctly
   - Run setup script to recreate collections and indexes

4. **Payment Issues**
   - Check Stripe API keys
   - Verify webhook endpoint is correctly set up
   - Check browser console for Stripe Elements errors

### Debugging

1. **Backend Debugging**:
   - Check Netlify function logs
   - Enable debug logging in the backend
   - Use the logger middleware to track requests

2. **Frontend Debugging**:
   - Use browser developer tools
   - Check network requests and responses
   - Enable debug logging in the frontend

## Next Steps

With Phase 1 successfully completed, the project is ready to move on to Phase 2, which will focus on ThreeFold-specific integrations:

1. **TF Connect Integration**
   - USDC→TFT swap functionality
   - Wallet balance monitoring
   - Auto-top up configuration

2. **TFChain & Grid Deployment**
   - TFChain wallet connection
   - Deployment of workloads to TFGrid nodes
   - Resource monitoring and scaling

3. **Cloud Provider Alliance System**
   - Alliance formation workflow
   - Node contribution management
   - Revenue sharing implementation

4. **Advanced Features**
   - Staking discount tier implementation
   - Backup VM and QSFS configuration
   - Advanced node selection criteria

For more information on the implementation details, refer to the [IMPLEMENTATION.md](backend/IMPLEMENTATION.md) and [PHASE1_COMPLETION.md](backend/PHASE1_COMPLETION.md) files.