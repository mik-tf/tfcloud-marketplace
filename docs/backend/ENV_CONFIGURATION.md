# Backend Environment Configuration Guide

This guide provides detailed information about the backend environment variables in the `.env` file, explaining which variables should be changed and which should remain as is for local development and production environments.

## Overview

The backend of the ThreeFold Cloud Marketplace uses environment variables to configure various aspects of the application, including:

- Auth0 authentication
- MongoDB Atlas database connection
- Stripe payment processing
- Application settings

## Environment Variables

### Auth0 Configuration

```
# Auth0 Configuration
AUTH0_DOMAIN=your-auth0-domain.auth0.com
AUTH0_CLIENT_ID=your-auth0-client-id
AUTH0_CLIENT_SECRET=your-auth0-client-secret
AUTH0_CALLBACK_URL=http://localhost:8888/api/auth/callback
AUTH0_AUDIENCE=https://your-api-identifier
```

| Variable | Description | Local Development | Production |
|----------|-------------|-------------------|------------|
| `AUTH0_DOMAIN` | Your Auth0 tenant domain | **MUST CHANGE** to your Auth0 domain | **MUST CHANGE** to your Auth0 domain |
| `AUTH0_CLIENT_ID` | Client ID of your Auth0 application | **MUST CHANGE** to your Auth0 client ID | **MUST CHANGE** to your Auth0 client ID |
| `AUTH0_CLIENT_SECRET` | Client secret of your Auth0 application | **MUST CHANGE** to your Auth0 client secret | **MUST CHANGE** to your Auth0 client secret |
| `AUTH0_CALLBACK_URL` | URL Auth0 redirects to after login | **DO NOT CHANGE** for local development | **MUST CHANGE** to your production callback URL (e.g., `https://your-domain.com/api/auth/callback`) |
| `AUTH0_AUDIENCE` | Identifier for your Auth0 API | **MUST CHANGE** to your Auth0 API identifier | **MUST CHANGE** to your Auth0 API identifier |

### MongoDB Atlas Configuration

```
# MongoDB Configuration
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster-url>/<database-name>?retryWrites=true&w=majority
```

| Variable | Description | Local Development | Production |
|----------|-------------|-------------------|------------|
| `MONGODB_URI` | Connection string for MongoDB Atlas | **MUST CHANGE** to your MongoDB Atlas connection string | **MUST CHANGE** to your production MongoDB Atlas connection string |

### Stripe Configuration

```
# Stripe Configuration
STRIPE_SECRET_KEY=your-stripe-secret-key
STRIPE_WEBHOOK_SECRET=your-stripe-webhook-secret
```

| Variable | Description | Local Development | Production |
|----------|-------------|-------------------|------------|
| `STRIPE_SECRET_KEY` | Secret key for Stripe API access | **MUST CHANGE** to your Stripe secret key | **MUST CHANGE** to your production Stripe secret key |
| `STRIPE_WEBHOOK_SECRET` | Secret for verifying Stripe webhook events | **MUST CHANGE** to your Stripe webhook secret | **MUST CHANGE** to your production Stripe webhook secret |

### Application Settings

```
# Application Settings
NODE_ENV=development
API_URL=http://localhost:8888/api
FRONTEND_URL=http://localhost:3000
```

| Variable | Description | Local Development | Production |
|----------|-------------|-------------------|------------|
| `NODE_ENV` | Environment mode | **DO NOT CHANGE** for local development (keep as `development`) | **MUST CHANGE** to `production` |
| `API_URL` | URL of the backend API | **DO NOT CHANGE** for local development | **MUST CHANGE** to your production API URL (e.g., `https://your-domain.com/api`) |
| `FRONTEND_URL` | URL of the frontend application | **DO NOT CHANGE** for local development | **MUST CHANGE** to your production frontend URL (e.g., `https://your-domain.com`) |

## Important Notes

1. **Never commit your `.env` file to version control**. It contains sensitive information like API keys and secrets.

2. **Use different credentials for development and production environments**. This helps isolate any issues and prevents accidental modifications to production data.

3. **Rotate secrets regularly** for enhanced security, especially in production environments.

4. **For local development**, the URLs (`AUTH0_CALLBACK_URL`, `API_URL`, and `FRONTEND_URL`) should remain as shown above to ensure proper functionality.

5. **For production deployment**, update all URLs to use your actual domain name and HTTPS protocol.

## Setting Up Auth0 for Different Environments

It's recommended to create separate Auth0 applications for development and production:

1. **Development Application**:
   - Callback URL: `http://localhost:8888/api/auth/callback`
   - Logout URL: `http://localhost:3000`
   - Web Origins: `http://localhost:3000`

2. **Production Application**:
   - Callback URL: `https://your-domain.com/api/auth/callback`
   - Logout URL: `https://your-domain.com`
   - Web Origins: `https://your-domain.com`

This separation ensures that your development activities don't affect production users and vice versa.

## Setting Up Stripe for Different Environments

Stripe provides test and live API keys:

1. **Development**: Use Stripe test API keys and test webhook secrets.
2. **Production**: Use Stripe live API keys and live webhook secrets.

When testing payments in development, you can use Stripe's test card numbers (e.g., `4242 4242 4242 4242`) without being charged.

## Troubleshooting

If you encounter issues related to environment variables:

1. **Auth0 Connection Issues**:
   - Verify that your Auth0 domain, client ID, and client secret are correct
   - Check that the callback URL in your Auth0 dashboard matches the `AUTH0_CALLBACK_URL` in your `.env` file
   - Ensure that your Auth0 API identifier matches the `AUTH0_AUDIENCE` in your `.env` file

2. **MongoDB Connection Issues**:
   - Verify that your MongoDB Atlas connection string is correct
   - Check that the database user has the necessary permissions for your database
   - Ensure your IP address is whitelisted in the MongoDB Atlas network access settings

3. **Stripe Integration Issues**:
   - Verify that your Stripe API keys are correct
   - Ensure that your webhook endpoint is properly configured in the Stripe dashboard
   - Check that the webhook secret matches the `STRIPE_WEBHOOK_SECRET` in your `.env` file

4. **API Connection Issues**:
   - Verify that the `API_URL` and `FRONTEND_URL` are correctly set for your environment
   - Check that the Netlify Functions server is running (for local development)