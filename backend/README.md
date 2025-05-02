# ThreeFold Cloud Marketplace Backend

This is the backend for the ThreeFold Cloud Marketplace, implemented using a serverless architecture with Netlify Functions, Auth0 for authentication, FaunaDB for database, and Stripe for payment processing.

## Technology Stack

- **Authentication**: Auth0
- **Serverless Functions**: Netlify Functions
- **Database**: FaunaDB
- **Payment Processing**: Stripe

## Prerequisites

- Node.js (v16 or later)
- npm or yarn
- Netlify CLI
- Auth0 account
- FaunaDB account
- Stripe account

## Setup

1. Clone the repository
2. Install dependencies:
   ```
   cd backend
   npm install
   ```
3. Create a `.env` file based on `.env.example` and fill in your credentials:
   ```
   cp .env.example .env
   ```

### Auth0 Setup

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
5. Update your `.env` file with the Auth0 credentials

### FaunaDB Setup

1. Create a new database in FaunaDB
2. Generate a server key and add it to your `.env` file
3. Run the setup script to create collections and indexes:
   ```
   node scripts/setup-fauna.js
   ```

### Stripe Setup

1. Create a Stripe account
2. Get your API keys from the Stripe dashboard
3. Add the secret key to your `.env` file
4. Set up a webhook endpoint in Stripe pointing to `http://localhost:8888/api/payments/webhook`
5. Add the webhook signing secret to your `.env` file

## Development

Start the development server:

```
npm run dev
```

This will start the Netlify dev server at `http://localhost:8888`.

## API Endpoints

### Authentication

- `GET /api/auth/login` - Redirect to Auth0 login page
- `GET /api/auth/callback` - Handle Auth0 callback after login
- `GET /api/auth/logout` - Log out user and clear session
- `GET /api/auth/session` - Get current user session information
- `GET /api/auth/me` - Get user profile information

### Cloud User

- `GET /api/cloud-user/deployments` - Get all deployments for the authenticated user
- `POST /api/cloud-user/deployments` - Create a new deployment
- `GET /api/cloud-user/deployments/:id` - Get details of a specific deployment
- `PUT /api/cloud-user/deployments/:id` - Update a deployment
- `DELETE /api/cloud-user/deployments/:id` - Delete a deployment
- `GET /api/cloud-user/profile` - Get user profile
- `PUT /api/cloud-user/profile` - Update user profile

### Cloud Provider

- `POST /api/cloud-provider/register` - Register as a cloud provider
- `GET /api/cloud-provider/nodes` - Get all nodes for the authenticated provider
- `POST /api/cloud-provider/nodes` - Add a new node
- `POST /api/cloud-provider/maintenance` - Schedule maintenance for a node
- `GET /api/cloud-provider/maintenance` - Get all scheduled maintenance for provider's nodes
- `GET /api/cloud-provider/profile` - Get provider profile
- `PUT /api/cloud-provider/profile` - Update provider profile

### Cloud Operator

- `GET /api/cloud-operator/settings` - Get dashboard settings
- `PUT /api/cloud-operator/settings` - Update dashboard settings
- `GET /api/cloud-operator/pricing` - Get pricing configuration
- `PUT /api/cloud-operator/pricing` - Update pricing configuration
- `GET /api/cloud-operator/provider-requests` - Get all provider requests
- `PUT /api/cloud-operator/provider-requests/:id` - Update provider request status
- `GET /api/cloud-operator/users` - Get all users
- `GET /api/cloud-operator/deployments` - Get all deployments

### Payments

- `POST /api/payments/create-intent` - Create a payment intent
- `GET /api/payments/methods` - Get user's payment methods
- `POST /api/payments/methods` - Add a payment method
- `DELETE /api/payments/methods/:id` - Delete a payment method
- `GET /api/payments/transactions` - Get user's transaction history
- `POST /api/payments/webhook` - Handle Stripe webhook events

## Deployment

Deploy to Netlify:

```
netlify deploy --prod
```

## Environment Variables

The following environment variables are required:

```
# Auth0 Configuration
AUTH0_DOMAIN=your-auth0-domain.auth0.com
AUTH0_CLIENT_ID=your-auth0-client-id
AUTH0_CLIENT_SECRET=your-auth0-client-secret
AUTH0_CALLBACK_URL=http://localhost:8888/api/auth/callback
AUTH0_AUDIENCE=https://your-api-identifier

# FaunaDB Configuration
FAUNADB_SECRET=your-faunadb-secret-key

# Stripe Configuration
STRIPE_SECRET_KEY=your-stripe-secret-key
STRIPE_WEBHOOK_SECRET=your-stripe-webhook-secret

# Application Settings
NODE_ENV=development
API_URL=http://localhost:8888/api
FRONTEND_URL=http://localhost:3000
```

## Project Structure

```
backend/
├── functions/           # Netlify Functions
│   └── api.ts           # Main API function
├── scripts/             # Setup scripts
│   └── setup-fauna.js   # FaunaDB setup script
├── src/                 # Source code
│   ├── controllers/     # Request handlers
│   ├── middleware/      # Express middleware
│   ├── routes/          # API routes
│   └── services/        # Business logic
├── .env.example         # Example environment variables
├── netlify.toml         # Netlify configuration
├── package.json         # Dependencies and scripts
└── tsconfig.json        # TypeScript configuration
```

## License

This project is licensed under the Apache 2.0 License.