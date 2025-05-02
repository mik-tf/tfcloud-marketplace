# ThreeFold Cloud Marketplace Setup Guide

This guide provides comprehensive instructions for setting up and testing the ThreeFold Cloud Marketplace project, from cloning the repository to running both the frontend and backend components.

## Table of Contents

- [ThreeFold Cloud Marketplace Setup Guide](#threefold-cloud-marketplace-setup-guide)
  - [Table of Contents](#table-of-contents)
  - [Prerequisites](#prerequisites)
  - [Cloning the Repository](#cloning-the-repository)
  - [Backend Setup](#backend-setup)
    - [Backend Environment Variables](#backend-environment-variables)
    - [Auth0 Configuration](#auth0-configuration)
    - [FaunaDB Setup](#faunadb-setup)
    - [Stripe Setup](#stripe-setup)
    - [Starting the Backend](#starting-the-backend)
    - [Testing the Backend](#testing-the-backend)
  - [Frontend Setup](#frontend-setup)
    - [Frontend Environment Variables](#frontend-environment-variables)
    - [Starting the Frontend](#starting-the-frontend)
    - [Testing the Frontend](#testing-the-frontend)
  - [Smoke Testing](#smoke-testing)
  - [Troubleshooting](#troubleshooting)
    - [Backend Issues](#backend-issues)
    - [Frontend Issues](#frontend-issues)
    - [Authentication Issues](#authentication-issues)

## Prerequisites

Before you begin, ensure you have the following installed:

- Node.js (v16 or later)
- npm or yarn
- Netlify CLI (`npm install -g netlify-cli`)
- Git

You'll also need accounts with the following services:

- [Auth0](https://auth0.com/) - For authentication
- [FaunaDB](https://fauna.com/) - For database
- [Stripe](https://stripe.com/) - For payment processing (optional if you're not implementing payments)

## Cloning the Repository

1. Open your terminal and run:

```bash
git clone https://github.com/your-username/tfcloud-marketplace.git
cd tfcloud-marketplace
```

## Backend Setup

### Backend Environment Variables

1. Navigate to the backend directory:

```bash
cd backend
```

2. Create a `.env` file by copying the example:

```bash
cp .env.example .env
```

3. Open the `.env` file in your editor and update the following variables:

```
# Auth0 Configuration
AUTH0_DOMAIN=your-auth0-domain.auth0.com          # CHANGE: Your Auth0 domain
AUTH0_CLIENT_ID=your-auth0-client-id              # CHANGE: Your Auth0 client ID
AUTH0_CLIENT_SECRET=your-auth0-client-secret      # CHANGE: Your Auth0 client secret
AUTH0_CALLBACK_URL=http://localhost:8888/api/auth/callback  # DO NOT CHANGE for local development
AUTH0_AUDIENCE=https://your-api-identifier        # CHANGE: Your Auth0 API identifier

# FaunaDB Configuration
FAUNADB_SECRET=your-faunadb-secret-key            # CHANGE: Your FaunaDB secret key

# Stripe Configuration
STRIPE_SECRET_KEY=your-stripe-secret-key          # CHANGE: Your Stripe secret key
STRIPE_WEBHOOK_SECRET=your-stripe-webhook-secret  # CHANGE: Your Stripe webhook secret

# Application Settings
NODE_ENV=development                              # DO NOT CHANGE for local development
API_URL=http://localhost:8888/api                 # DO NOT CHANGE for local development
FRONTEND_URL=http://localhost:3000                # DO NOT CHANGE for local development
```

> **Important**: The variables marked with "DO NOT CHANGE" should remain as they are for local development. The variables marked with "CHANGE" need to be updated with your own credentials.

> For a more detailed explanation of each environment variable and configuration guidelines for both development and production environments, see the [Backend Environment Configuration Guide](backend/ENV_CONFIGURATION.md).

### Auth0 Configuration

1. Create a new Auth0 application:
   - Log in to your Auth0 account
   - Go to "Applications" > "Create Application"
   - Select "Regular Web Application"
   - Name it "ThreeFold Cloud Marketplace"

2. Configure the application settings:
   - Allowed Callback URLs: `http://localhost:8888/api/auth/callback`
   - Allowed Logout URLs: `http://localhost:8888`
   - Allowed Web Origins: `http://localhost:8888`

3. Create an API in Auth0:
   - Go to "APIs" > "Create API"
   - Name it "ThreeFold Cloud Marketplace API"
   - Set the identifier (this will be your `AUTH0_AUDIENCE` value)
   - Set the signing algorithm to RS256

4. Set up roles and permissions:
   - Go to "User Management" > "Roles"
   - Create the following roles:
     - `cloud-user`: For regular end users (can be assigned during signup)
     - `cloud-provider`: For infrastructure providers (assigned after approval)
     - `cloud-operator`: For marketplace administrators (manually assigned to trusted admins only)

5. Update your `.env` file with the Auth0 credentials:
   - `AUTH0_DOMAIN`: Your Auth0 domain (e.g., `your-tenant.auth0.com`)
   - `AUTH0_CLIENT_ID`: Your Auth0 application client ID
   - `AUTH0_CLIENT_SECRET`: Your Auth0 application client secret
   - `AUTH0_AUDIENCE`: Your Auth0 API identifier

### FaunaDB Setup

1. Create a new database in FaunaDB:
   - Log in to your FaunaDB account
   - Click "New Database"
   - Name it "tfcloud-marketplace"
   - Select your preferred region

2. Generate a server key:
   - Go to "Security" > "Keys"
   - Click "New Key"
   - Select "Server" role
   - Name it "tfcloud-marketplace-key"
   - Copy the secret key

3. Update your `.env` file with the FaunaDB secret key:
   - `FAUNADB_SECRET`: Your FaunaDB server key

4. Run the setup script to create collections and indexes:

```bash
npm run setup:fauna
```

### Stripe Setup

1. Create a Stripe account if you don't have one.

2. Get your API keys:
   - Log in to your Stripe dashboard
   - Go to "Developers" > "API keys"
   - Copy your secret key

3. Set up a webhook endpoint:
   - Go to "Developers" > "Webhooks"
   - Click "Add endpoint"
   - Set the endpoint URL to `http://localhost:8888/api/payments/webhook`
   - Select events to listen for (at minimum: `payment_intent.succeeded`, `payment_intent.payment_failed`)
   - Copy the webhook signing secret

4. Update your `.env` file with the Stripe credentials:
   - `STRIPE_SECRET_KEY`: Your Stripe secret key
   - `STRIPE_WEBHOOK_SECRET`: Your Stripe webhook signing secret

### Starting the Backend

1. Install dependencies:

```bash
npm install
```

2. Start the development server:

```bash
npm run dev
```

This will start the Netlify dev server at `http://localhost:8888`.

### Testing the Backend

1. Test the API endpoints:
   - Open your browser and navigate to `http://localhost:8888/.netlify/functions/api`
   - You should see a response indicating the API is running

2. Run the test suite:

```bash
npm test
```

For comprehensive testing instructions, including unit tests, integration tests, and end-to-end tests, see the [Testing Guide](TESTING_GUIDE.md).

## Frontend Setup

### Frontend Environment Variables

1. Navigate to the frontend directory:

```bash
cd ../frontend
```

2. Create a `.env` file:

```bash
touch .env
```

3. Open the `.env` file in your editor and add the following variables:

```
VITE_API_URL=http://localhost:8888/api                # DO NOT CHANGE for local development
VITE_AUTH0_DOMAIN=your-auth0-domain.auth0.com         # CHANGE: Your Auth0 domain
VITE_AUTH0_CLIENT_ID=your-auth0-client-id             # CHANGE: Your Auth0 client ID
VITE_AUTH0_AUDIENCE=https://your-api-identifier       # CHANGE: Your Auth0 API identifier
VITE_STRIPE_PUBLIC_KEY=your-stripe-public-key         # CHANGE: Your Stripe publishable key
```

> **Important**: The variables marked with "DO NOT CHANGE" should remain as they are for local development. The variables marked with "CHANGE" need to be updated with your own credentials.

> For a more detailed explanation of each environment variable and configuration guidelines for both development and production environments, see the [Frontend Environment Configuration Guide](frontend/ENV_CONFIGURATION.md).

### Starting the Frontend

1. Install dependencies:

```bash
npm install
```

2. Start the development server:

```bash
npm run dev
```

This will start the development server at `http://localhost:3000`.

### Testing the Frontend

1. Open your browser and navigate to `http://localhost:3000`
2. You should see the ThreeFold Cloud Marketplace homepage
3. Test the authentication flow:
   - Click the "Log In" button
   - You should be redirected to the Auth0 login page
   - After successful login, you should be redirected back to the application

For comprehensive testing instructions, including component tests, end-to-end tests, and manual testing procedures, see the [Testing Guide](TESTING_GUIDE.md).

## Smoke Testing

The project includes a Makefile for easy smoke testing:

1. From the project root, run:

```bash
make smoke
```

2. After the build, a static server will serve the `dist/` directory (default port 5000)
3. Open `http://localhost:5000` in your browser
4. Navigate to key routes (e.g., `/dashboard`, `/docs`) to verify SPA fallback

For more detailed smoke testing procedures and additional testing strategies, see the [Testing Guide](TESTING_GUIDE.md#smoke-testing).

## Troubleshooting

### Backend Issues

1. **API Connection Issues**
   - Verify the backend API is running (`npm run dev` in the backend directory)
   - Check the terminal for any error messages
   - Ensure the `API_URL` in both backend and frontend `.env` files is set to `http://localhost:8888/api`

2. **FaunaDB Connection Issues**
   - Verify your FaunaDB secret key in the `.env` file
   - Check if collections and indexes are created correctly
   - Run `npm run setup:fauna` to recreate collections and indexes

3. **Netlify Function Errors**
   - Check the terminal for function logs
   - Verify environment variables are set correctly
   - Check for function timeout or memory limit issues

### Frontend Issues

1. **Build Errors**
   - Check the terminal for build error messages
   - Ensure all dependencies are installed (`npm install`)
   - Verify the `.env` file has all required variables

2. **Runtime Errors**
   - Check the browser console for error messages
   - Verify the API URL is correct and the backend is running
   - Check for CORS errors (ensure the backend is properly configured)

### Authentication Issues

1. **Auth0 Configuration Issues**
   - Verify Auth0 credentials in both backend and frontend `.env` files
   - Check that callback URLs, logout URLs, and web origins are correctly set up in Auth0 dashboard
   - Ensure the Auth0 API is properly configured with the correct permissions

2. **Login Redirect Issues**
   - Check that `AUTH0_CALLBACK_URL` in the backend `.env` file is set to `http://localhost:8888/api/auth/callback`
   - Verify that `FRONTEND_URL` in the backend `.env` file is set to `http://localhost:3000`
   - Check browser console for any error messages during the authentication flow

3. **Role-Based Access Issues**
   - Ensure roles are properly set up in Auth0
   - Check that permissions are correctly assigned to roles
   - Verify that the user has the appropriate role assigned

---

By following this guide, you should be able to set up and test the ThreeFold Cloud Marketplace project successfully. If you encounter any issues not covered in the troubleshooting section, please refer to the project's GitHub issues or create a new issue with detailed information about the problem.