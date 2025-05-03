# Auth0 Setup Guide for ThreeFold Cloud Marketplace

This guide provides step-by-step instructions for setting up Auth0 authentication for the ThreeFold Cloud Marketplace. It explains how to create an Auth0 account, configure an application, set up an API, define roles and permissions, and integrate with your frontend and backend.

## Table of Contents

- [Auth0 Setup Guide for ThreeFold Cloud Marketplace](#auth0-setup-guide-for-threefold-cloud-marketplace)
  - [Table of Contents](#table-of-contents)
  - [Prerequisites](#prerequisites)
  - [Creating an Auth0 Account](#creating-an-auth0-account)
  - [Creating an Auth0 Application](#creating-an-auth0-application)
    - [Application Settings](#application-settings)
  - [Creating an Auth0 API](#creating-an-auth0-api)
  - [Setting Up Roles and Permissions](#setting-up-roles-and-permissions)
    - [Creating Roles](#creating-roles)
    - [Assigning Permissions to Roles](#assigning-permissions-to-roles)
  - [Setting Up Rules](#setting-up-rules)
    - [Adding Roles to Tokens](#adding-roles-to-tokens)
  - [Configuring Environment Variables](#configuring-environment-variables)
    - [Frontend Environment Variables](#frontend-environment-variables)
    - [Backend Environment Variables](#backend-environment-variables)
  - [Testing the Integration](#testing-the-integration)
  - [User Management](#user-management)
    - [Creating Users](#creating-users)
    - [Assigning Roles to Users](#assigning-roles-to-users)
  - [Going to Production](#going-to-production)
  - [Troubleshooting](#troubleshooting)
    - [Authentication Issues](#authentication-issues)
    - [Token Issues](#token-issues)
    - [CORS Issues](#cors-issues)
    - [Still Having Issues?](#still-having-issues)

## Prerequisites

- A ThreeFold Cloud Marketplace project set up with Netlify
- Node.js (v18 or later)
- npm or yarn
- Basic understanding of authentication concepts

## Creating an Auth0 Account

1. Go to [Auth0's website](https://auth0.com/) and click "Sign Up"
2. Fill in the registration form with your email, name, and password
3. Verify your email address by clicking the link sent to your email
4. Complete the account setup process:
   - Choose a tenant domain (e.g., `threefold-marketplace`)
   - Select your region (choose the one closest to your users)
   - Answer the account setup questions

> **Note**: Your tenant domain will be used in your Auth0 domain, which will look like `threefold-marketplace.auth0.com`.

## Creating an Auth0 Application

1. Log in to your [Auth0 Dashboard](https://manage.auth0.com/)
2. Navigate to **Applications > Applications** in the left sidebar
3. Click **Create Application**
4. Enter a name for your application (e.g., "ThreeFold Cloud Marketplace")
5. Select "Single Page Application" as the application type
6. Click **Create**

### Application Settings

After creating the application, configure its settings:

1. Go to the **Settings** tab of your application
2. Configure the following fields:
   - **Allowed Callback URLs**: URLs where Auth0 will redirect after authentication
     - Local: `http://localhost:3000`
     - Development: `https://dev.threefold.store`
     - Production: `https://threefold.store`
   - **Allowed Logout URLs**: URLs where Auth0 will redirect after logout
     - Local: `http://localhost:3000`
     - Development: `https://dev.threefold.store`
     - Production: `https://threefold.store`
   - **Allowed Web Origins**: URLs where your application runs
     - Local: `http://localhost:3000`
     - Development: `https://dev.threefold.store`
     - Production: `https://threefold.store`
   - **Allowed Origins (CORS)**: Same as Allowed Web Origins

3. Scroll down and click **Save Changes**

4. Note down the following values from the **Basic Information** section:
   - **Domain**: Your Auth0 domain (e.g., `threefold-marketplace.auth0.com`)
   - **Client ID**: Your application's client ID

## Creating an Auth0 API

1. Navigate to **Applications > APIs** in the left sidebar
2. Click **Create API**
3. Configure the API:
   - **Name**: "ThreeFold Cloud Marketplace API"
   - **Identifier**: A unique identifier for your API (e.g., `https://api.threefold.store`)
   - **Signing Algorithm**: RS256 (recommended)
4. Click **Create**

5. Go to the **Settings** tab of your API
6. Enable the following settings:
   - **Allow Offline Access**: Enabled (for refresh tokens)
   - **RBAC**: Enabled (for role-based access control)
   - **Add Permissions in the Access Token**: Enabled

7. Scroll down and click **Save**

8. Go to the **Permissions** tab
9. Add the following permissions:
   - `read:profile` - Read user profile information
   - `update:profile` - Update user profile information
   - `read:deployments` - Read deployment information
   - `create:deployments` - Create new deployments
   - `update:deployments` - Update existing deployments
   - `delete:deployments` - Delete deployments
   - `read:providers` - Read cloud provider information
   - `manage:providers` - Manage cloud providers
   - `read:operators` - Read cloud operator information
   - `manage:operators` - Manage cloud operators

10. Click **Add** for each permission

## Setting Up Roles and Permissions

### Creating Roles

1. Navigate to **User Management > Roles** in the left sidebar
2. Click **Create Role**
3. Create the following roles:
   - **cloud-user**: Basic user role
     - Name: "cloud-user"
     - Description: "Regular cloud user with basic permissions"
   - **cloud-provider**: Cloud provider role
     - Name: "cloud-provider"
     - Description: "Cloud provider with permissions to manage their resources"
   - **cloud-operator**: Cloud operator role
     - Name: "cloud-operator"
     - Description: "Cloud operator with administrative permissions"

### Assigning Permissions to Roles

1. Click on the "cloud-user" role
2. Go to the **Permissions** tab
3. Click **Add Permissions**
4. Select your API from the dropdown
5. Assign the following permissions:
   - `read:profile`
   - `update:profile`
   - `read:deployments`
   - `create:deployments`
   - `update:deployments`
   - `delete:deployments`
6. Click **Add Permissions**

7. Repeat the process for the "cloud-provider" role, adding:
   - All cloud-user permissions
   - `read:providers`
   - `manage:providers`

8. Repeat the process for the "cloud-operator" role, adding:
   - All cloud-provider permissions
   - `read:operators`
   - `manage:operators`

## Setting Up Rules

Rules allow you to customize the authentication flow in Auth0.

### Adding Roles to Tokens

1. Navigate to **Auth Pipeline > Rules** in the left sidebar
2. Click **Create Rule**
3. Select the "Empty rule" template
4. Name the rule "Add roles to tokens"
5. Replace the script with the following code:

```javascript
function addRolesToTokens(user, context, callback) {
  // Get the user's roles
  const namespace = 'https://api.threefold.store';
  const assignedRoles = (context.authorization || {}).roles || [];

  // Add the roles to the ID token and access token
  context.idToken[`${namespace}/roles`] = assignedRoles;
  context.accessToken[`${namespace}/roles`] = assignedRoles;

  callback(null, user, context);
}
```

6. Click **Save Changes**

## Configuring Environment Variables

### Frontend Environment Variables

Update your frontend environment variables in your Netlify dashboard or local `.env` file:

```
VITE_AUTH0_DOMAIN=your-tenant.auth0.com
VITE_AUTH0_CLIENT_ID=your-client-id
VITE_AUTH0_AUDIENCE=https://api.threefold.store
VITE_AUTH0_CALLBACK_URL=http://localhost:3000
```

For production, update `VITE_AUTH0_CALLBACK_URL` to your production URL.

### Backend Environment Variables

Update your backend environment variables:

```
AUTH0_DOMAIN=your-tenant.auth0.com
AUTH0_CLIENT_ID=your-client-id
AUTH0_CLIENT_SECRET=your-client-secret
AUTH0_AUDIENCE=https://api.threefold.store
AUTH0_CALLBACK_URL=http://localhost:8888/.netlify/functions/auth/callback
```

For production, update `AUTH0_CALLBACK_URL` to your production URL.

## Testing the Integration

To verify that your Auth0 integration is working correctly:

1. Start your development server:
   ```bash
   netlify dev
   ```

2. Open your application in a browser
3. Click the "Sign In" button
4. You should be redirected to the Auth0 login page
5. After logging in, you should be redirected back to your application
6. Check that you can access protected routes based on your role

## User Management

### Creating Users

1. Navigate to **User Management > Users** in the left sidebar
2. Click **Create User**
3. Fill in the user details:
   - **Email**: User's email address
   - **Password**: Initial password
   - **Connection**: Username-Password-Authentication
4. Click **Create**

### Assigning Roles to Users

1. Click on the user you want to assign roles to
2. Go to the **Roles** tab
3. Click **Assign Roles**
4. Select the roles you want to assign (e.g., "cloud-user")
5. Click **Assign**

## Going to Production

When you're ready to go to production:

1. Review your Auth0 application settings:
   - Ensure all production URLs are included in the allowed URLs
   - Check that your rules are working as expected

2. Update your environment variables for production:
   - Update callback URLs to your production domain
   - Ensure your API audience is correctly set

3. Consider implementing additional security measures:
   - Multi-factor authentication
   - Brute force protection
   - Advanced login flows

## Troubleshooting

### Authentication Issues

If users can't log in:

1. Check your Auth0 application settings:
   - Verify the allowed callback URLs
   - Ensure the client ID and domain are correct

2. Check your browser console for errors
3. Verify that your Auth0 tenant is active and not in trial mode

### Token Issues

If you're having issues with tokens:

1. Check that your API audience is correctly set
2. Verify that your rules are working correctly
3. Use the [Auth0 JWT Debugger](https://jwt.io/) to inspect tokens
4. Check that your backend is correctly validating tokens

### CORS Issues

If you're experiencing CORS errors:

1. Verify that your Auth0 application has the correct allowed origins
2. Check that your API server has the correct CORS headers
3. Ensure your frontend is making requests from an allowed origin

### Still Having Issues?

If you're still experiencing problems:

1. Consult the [Auth0 Documentation](https://auth0.com/docs/)
2. Check the [Auth0 Community](https://community.auth0.com/) for similar issues
3. Review the Auth0 logs in your dashboard
4. Reach out to the project maintainers for assistance

---

By following this guide, you should have successfully set up Auth0 authentication for your ThreeFold Cloud Marketplace. The application should now support user authentication, role-based access control, and secure API access.