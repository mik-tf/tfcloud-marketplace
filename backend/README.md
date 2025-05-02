# ThreeFold Cloud Marketplace Backend

This is the backend for the ThreeFold Cloud Marketplace, implemented using a serverless architecture with Netlify Functions, Auth0 for authentication, MongoDB Atlas for database, and Stripe for payment processing.

## Table of Contents

- [Technology Stack](#technology-stack)
- [Prerequisites](#prerequisites)
- [Setup and Installation](#setup-and-installation)
- [Development](#development)
- [Testing](#testing)
- [API Documentation](#api-documentation)
- [Frontend Integration](#frontend-integration)
- [Deployment](#deployment)
- [Project Structure](#project-structure)
- [Security Features](#security-features)
- [Troubleshooting](#troubleshooting)
- [License](#license)

## Technology Stack

- **Authentication**: Auth0 for user management and role-based access control
- **Serverless Functions**: Netlify Functions for API endpoints and business logic
- **Database**: MongoDB Atlas for persistent data storage
- **Payment Processing**: Stripe for secure payment handling
- **Testing**: Jest for unit, integration, and end-to-end testing
- **Security**: Rate limiting, input validation, and logging

## Role-Based Access Control

The system implements three distinct user roles:

| Role | Description | Assignment |
|------|-------------|------------|
| `cloud-user` | Regular end users who deploy applications | Can be assigned during signup |
| `cloud-provider` | Node operators providing infrastructure | Assigned after approval by a cloud operator |
| `cloud-operator` | Marketplace administrators | Manually assigned to trusted admins only |

**Important**: The Cloud Operator role should only be assigned to trusted administrators who deploy and manage the marketplace. This role has full administrative access to the platform and controls which users can become cloud providers.

## Prerequisites

- Node.js (v16 or later)
- npm or yarn
- Netlify CLI (`npm install -g netlify-cli`)
- Auth0 account
- MongoDB Atlas account
- Stripe account (for payment processing)

## Setup and Installation

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/tfcloud-marketplace.git
cd tfcloud-marketplace/backend
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env` file based on `.env.example`:

```bash
cp .env.example .env
```

Edit the `.env` file and fill in your credentials.

### 4. Auth0 Setup

1. Create a new Auth0 application (Regular Web Application)
2. Configure the following settings:
   - Allowed Callback URLs: `http://localhost:8888/api/auth/callback`
   - Allowed Logout URLs: `http://localhost:8888`
   - Allowed Web Origins: `http://localhost:8888`
3. Create an API in Auth0
4. Set up the following permissions in your API:
   - `cloud-user`
   - `cloud-provider`
   - `cloud-operator`
5. Create the following roles in Auth0:
   - `cloud-user`: For regular end users (can be assigned during signup)
   - `cloud-provider`: For infrastructure providers (assigned after approval)
   - `cloud-operator`: For marketplace administrators (manually assigned to trusted admins only)
6. Assign appropriate permissions to each role
7. Update your `.env` file with the Auth0 credentials

**Note**: The `cloud-operator` role should be manually assigned in Auth0 only to trusted administrators who deploy and manage the marketplace. This role has full administrative access to the platform.

### 5. MongoDB Atlas Setup

1. Create a free MongoDB Atlas account and set up a cluster
2. Create a database user with appropriate permissions
3. Get your connection string and add it to your `.env` file
4. Run the setup script to create collections and indexes:

```bash
npm run setup:mongodb
```

### 6. Stripe Setup

1. Create a Stripe account
2. Get your API keys from the Stripe dashboard
3. Add the secret key to your `.env` file
4. Set up a webhook endpoint in Stripe pointing to `http://localhost:8888/api/payments/webhook`
5. Add the webhook signing secret to your `.env` file

## Development

### Start the Development Server

```bash
npm run dev
```

This will start the Netlify dev server at `http://localhost:8888`.

### Linting and Formatting

```bash
# Run ESLint
npm run lint

# Fix ESLint issues
npm run lint:fix

# Format code with Prettier
npm run format

# Type checking
npm run check-types
```

## Testing

The project includes unit, integration, and end-to-end tests.

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run specific test types
npm run test:unit
npm run test:integration
npm run test:e2e
```

## API Documentation

### Authentication Endpoints

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/api/auth/login` | Redirect to Auth0 login page | Public |
| GET | `/api/auth/callback` | Handle Auth0 callback after login | Public |
| GET | `/api/auth/logout` | Log out user and clear session | Public |
| GET | `/api/auth/session` | Get current user session information | Private |
| GET | `/api/auth/me` | Get user profile information | Private |

### Cloud User Endpoints

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/api/cloud-user/deployments` | Get all deployments for the authenticated user | Cloud User |
| POST | `/api/cloud-user/deployments` | Create a new deployment | Cloud User |
| GET | `/api/cloud-user/deployments/:id` | Get details of a specific deployment | Cloud User |
| PUT | `/api/cloud-user/deployments/:id` | Update a deployment | Cloud User |
| DELETE | `/api/cloud-user/deployments/:id` | Delete a deployment | Cloud User |
| GET | `/api/cloud-user/profile` | Get user profile | Cloud User |
| PUT | `/api/cloud-user/profile` | Update user profile | Cloud User |

### Cloud Provider Endpoints

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/api/cloud-provider/register` | Register as a cloud provider | Authenticated |
| GET | `/api/cloud-provider/nodes` | Get all nodes for the authenticated provider | Cloud Provider |
| POST | `/api/cloud-provider/nodes` | Add a new node | Cloud Provider |
| POST | `/api/cloud-provider/maintenance` | Schedule maintenance for a node | Cloud Provider |
| GET | `/api/cloud-provider/maintenance` | Get all scheduled maintenance for provider's nodes | Cloud Provider |
| GET | `/api/cloud-provider/profile` | Get provider profile | Cloud Provider |
| PUT | `/api/cloud-provider/profile` | Update provider profile | Cloud Provider |

### Cloud Operator Endpoints

These endpoints are restricted to users with the `cloud-operator` role, which should only be assigned to trusted administrators who deploy and manage the marketplace.

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/api/cloud-operator/settings` | Get dashboard settings | Cloud Operator |
| PUT | `/api/cloud-operator/settings` | Update dashboard settings | Cloud Operator |
| GET | `/api/cloud-operator/pricing` | Get pricing configuration | Cloud Operator |
| PUT | `/api/cloud-operator/pricing` | Update pricing configuration | Cloud Operator |
| GET | `/api/cloud-operator/provider-requests` | Get all provider requests | Cloud Operator |
| PUT | `/api/cloud-operator/provider-requests/:id` | Update provider request status | Cloud Operator |
| GET | `/api/cloud-operator/users` | Get all users | Cloud Operator |
| GET | `/api/cloud-operator/deployments` | Get all deployments | Cloud Operator |

### Payment Endpoints

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/api/payments/create-intent` | Create a payment intent | Cloud User |
| GET | `/api/payments/methods` | Get user's payment methods | Cloud User |
| POST | `/api/payments/methods` | Add a payment method | Cloud User |
| DELETE | `/api/payments/methods/:id` | Delete a payment method | Cloud User |
| GET | `/api/payments/transactions` | Get user's transaction history | Cloud User |
| POST | `/api/payments/webhook` | Handle Stripe webhook events | Public |

## Frontend Integration

The backend includes example code for frontend integration in the `examples/frontend-integration` directory:

- `auth.js`: Authentication service for Auth0 integration
- `api-client.js`: API client for making requests to the backend
- `payment-service.js`: Service for Stripe payment integration
- `DeploymentForm.jsx`: Example React component for creating deployments

### Authentication Flow

1. User clicks login button, which calls `auth0Service.login()`
2. User is redirected to Auth0 login page
3. After successful login, Auth0 redirects back to the callback URL
4. The callback handler extracts tokens and user info
5. The frontend stores the authentication state
6. Protected API requests include the access token in the Authorization header

### API Client Usage

```javascript
import apiClient from './api-client';

// Get user profile
const userProfile = await apiClient.getUserProfile();

// Get user deployments
const deployments = await apiClient.getUserDeployments();

// Create a deployment
const newDeployment = await apiClient.createDeployment({
  name: 'My Deployment',
  description: 'Test deployment',
  resources: {
    cpu: 2,
    memory: 4,
    storage: 100
  },
  billing: {
    planId: 'basic',
    amount: 10,
    currency: 'USD',
    interval: 'monthly'
  }
});
```

### Payment Integration

```javascript
import paymentService from './payment-service';

// Initialize Stripe
await paymentService.initialize('your-stripe-public-key');

// Mount card element
paymentService.mountCardElement('card-element');

// Create payment method
await paymentService.createPaymentMethod({
  name: 'John Doe',
  email: 'john@example.com'
});

// Process payment
const paymentResult = await paymentService.processPayment(
  10.00,
  'usd',
  'Payment for deployment'
);
```

## Deployment

### Continuous Integration and Deployment

The project includes a GitHub Actions workflow for CI/CD in `.github/workflows/ci-cd.yml`.

### Manual Deployment to Netlify

```bash
# Deploy to production
netlify deploy --prod

# Deploy to a preview environment
netlify deploy
```

### Environment Variables

Configure the following environment variables in Netlify:

```
# Auth0 Configuration
AUTH0_DOMAIN=your-auth0-domain.auth0.com
AUTH0_CLIENT_ID=your-auth0-client-id
AUTH0_CLIENT_SECRET=your-auth0-client-secret
AUTH0_CALLBACK_URL=https://your-site.netlify.app/api/auth/callback
AUTH0_AUDIENCE=https://your-api-identifier

# MongoDB Configuration
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster-url>/<database-name>?retryWrites=true&w=majority

# Stripe Configuration
STRIPE_SECRET_KEY=your-stripe-secret-key
STRIPE_WEBHOOK_SECRET=your-stripe-webhook-secret

# Application Settings
NODE_ENV=production
API_URL=https://your-site.netlify.app/api
FRONTEND_URL=https://your-site.netlify.app
```

## Project Structure

```
backend/
├── .github/workflows/    # GitHub Actions workflows
├── examples/             # Example code for frontend integration
├── functions/            # Netlify Functions
│   └── api.ts            # Main API function
├── logs/                 # Log files (gitignored)
├── public/               # Static files
├── scripts/              # Setup scripts
│   ├── setup-fauna.js    # Legacy FaunaDB setup script
│   └── setup-mongodb.js  # MongoDB setup script
├── src/                  # Source code
│   ├── controllers/      # Request handlers
│   ├── middleware/       # Express middleware
│   ├── routes/           # API routes
│   ├── services/         # Business logic
│   └── utils/            # Utility functions
├── tests/                # Test files
│   ├── controllers/      # Controller tests
│   ├── e2e/              # End-to-end tests
│   └── integration/      # Integration tests
├── .env.example          # Example environment variables
├── .eslintrc.js          # ESLint configuration
├── .prettierrc           # Prettier configuration
├── jest.config.js        # Jest configuration
├── netlify.env.toml      # Netlify environment variables
├── netlify.toml          # Netlify configuration
├── package.json          # Dependencies and scripts
├── tsconfig.json         # TypeScript configuration
├── IMPLEMENTATION.md     # Implementation details
├── PHASE1_COMPLETION.md  # Phase 1 completion summary
└── README.md             # This file
```

## Security Features

The backend includes several security features:

- **JWT Authentication**: Secure API access with JWT validation
- **Role-Based Access Control**: Different permissions for different user roles
- **Rate Limiting**: Prevents abuse and DDoS attacks
- **Input Validation**: Validates all request data
- **Error Handling**: Centralized error handling
- **Logging**: Structured logging for monitoring and debugging
- **CORS Configuration**: Restricts cross-origin requests

## Troubleshooting

### Common Issues

1. **Auth0 Authentication Issues**
   - Check Auth0 configuration in `.env` file
   - Verify callback URLs are correctly set up in Auth0 dashboard
   - Check browser console for CORS errors

2. **MongoDB Connection Issues**
   - Verify MongoDB connection string in `.env` file
   - Check if collections and indexes are created correctly
   - Run `npm run setup:mongodb` to recreate collections and indexes

3. **Stripe Payment Issues**
   - Check Stripe API keys in `.env` file
   - Verify webhook endpoint is correctly set up in Stripe dashboard
   - Check browser console for Stripe Elements errors

4. **Netlify Function Errors**
   - Check Netlify function logs in Netlify dashboard
   - Verify environment variables are set correctly in Netlify
   - Check for function timeout or memory limit issues

### Getting Help

If you encounter issues not covered in this documentation, please:

1. Check the GitHub issues for similar problems
2. Review the logs for error messages
3. Create a new issue with detailed information about the problem

## License

This project is licensed under the Apache 2.0 License.