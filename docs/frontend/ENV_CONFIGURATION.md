# Frontend Environment Configuration Guide

This guide provides detailed information about the frontend environment variables in the `.env` file, explaining which variables should be changed and which should remain as is for local development and production environments.

## Overview

The frontend of the ThreeFold Cloud Marketplace uses environment variables to configure various aspects of the application, including:

- API connection
- Auth0 authentication
- Stripe payment processing

## Environment Variables

The frontend uses Vite as its build tool, which requires environment variables to be prefixed with `VITE_` to be accessible in the client-side code.

```
VITE_API_URL=http://localhost:8888/api
VITE_AUTH0_DOMAIN=your-auth0-domain.auth0.com
VITE_AUTH0_CLIENT_ID=your-auth0-client-id
VITE_AUTH0_AUDIENCE=https://your-api-identifier
VITE_STRIPE_PUBLIC_KEY=your-stripe-public-key
```

| Variable | Description | Local Development | Production |
|----------|-------------|-------------------|------------|
| `VITE_API_URL` | URL of the backend API | **DO NOT CHANGE** for local development | **MUST CHANGE** to your production API URL (e.g., `https://your-domain.com/api`) |
| `VITE_AUTH0_DOMAIN` | Your Auth0 tenant domain | **MUST CHANGE** to your Auth0 domain | **MUST CHANGE** to your Auth0 domain |
| `VITE_AUTH0_CLIENT_ID` | Client ID of your Auth0 application | **MUST CHANGE** to your Auth0 client ID | **MUST CHANGE** to your Auth0 client ID |
| `VITE_AUTH0_AUDIENCE` | Identifier for your Auth0 API | **MUST CHANGE** to your Auth0 API identifier | **MUST CHANGE** to your Auth0 API identifier |
| `VITE_STRIPE_PUBLIC_KEY` | Publishable key for Stripe | **MUST CHANGE** to your Stripe publishable key | **MUST CHANGE** to your production Stripe publishable key |

## Important Notes

1. **Never commit your `.env` file to version control**. It contains sensitive information like API keys.

2. **Use different credentials for development and production environments**. This helps isolate any issues and prevents accidental modifications to production data.

3. **For local development**, the `VITE_API_URL` should remain as shown above to ensure proper connectivity to the local backend.

4. **For production deployment**, update all URLs to use your actual domain name and HTTPS protocol.

5. **Auth0 configuration** in the frontend must match the corresponding Auth0 application settings in the backend.

## Setting Up Auth0 for Different Environments

It's recommended to create separate Auth0 applications for development and production:

1. **Development Application**:
   - Allowed Callback URLs: `http://localhost:3000/callback`
   - Allowed Logout URLs: `http://localhost:3000`
   - Allowed Web Origins: `http://localhost:3000`

2. **Production Application**:
   - Allowed Callback URLs: `https://your-domain.com/callback`
   - Allowed Logout URLs: `https://your-domain.com`
   - Allowed Web Origins: `https://your-domain.com`

This separation ensures that your development activities don't affect production users and vice versa.

## Setting Up Stripe for Different Environments

Stripe provides test and live API keys:

1. **Development**: Use Stripe test publishable key.
2. **Production**: Use Stripe live publishable key.

When testing payments in development, you can use Stripe's test card numbers (e.g., `4242 4242 4242 4242`) without being charged.

## Troubleshooting

If you encounter issues related to environment variables:

1. **API Connection Issues**:
   - Verify that the backend API is running
   - Check that `VITE_API_URL` is correctly set
   - Check browser console for network errors or CORS issues

2. **Auth0 Authentication Issues**:
   - Verify that your Auth0 domain, client ID, and audience are correct
   - Check that the Auth0 application settings match your frontend configuration
   - Check browser console for authentication errors

3. **Stripe Integration Issues**:
   - Verify that your Stripe publishable key is correct
   - Check browser console for Stripe Elements errors
   - Ensure you're using the correct key type (test vs. live) for your environment

4. **Environment Variable Access Issues**:
   - Make sure all environment variables are prefixed with `VITE_`
   - Restart the development server after changing environment variables
   - Access environment variables in code using `import.meta.env.VITE_VARIABLE_NAME`

## Example Usage in Code

Here's how to access these environment variables in your React components:

```jsx
// Example of using environment variables in a component
import { useEffect } from 'react';

const ApiService = () => {
  useEffect(() => {
    const apiUrl = import.meta.env.VITE_API_URL;
    const auth0Domain = import.meta.env.VITE_AUTH0_DOMAIN;
    
    console.log('API URL:', apiUrl);
    console.log('Auth0 Domain:', auth0Domain);
  }, []);
  
  return <div>API Service Initialized</div>;
};

export default ApiService;
```

Remember that all environment variables are exposed to the client, so never include sensitive secrets that should remain private.