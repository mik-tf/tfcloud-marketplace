# Auth0 Configuration Guide for Cloud Operators

This guide provides detailed instructions for setting up Auth0 authentication for the ThreeFold Cloud Marketplace. It is primarily intended for cloud operators who need to configure Auth0 for the marketplace.

## Table of Contents

- [Auth0 Configuration Guide for Cloud Operators](#auth0-configuration-guide-for-cloud-operators)
  - [Table of Contents](#table-of-contents)
  - [Overview](#overview)
  - [Prerequisites](#prerequisites)
  - [Step 1: Create a New Auth0 Application](#step-1-create-a-new-auth0-application)
  - [Step 2: Configure Application URLs](#step-2-configure-application-urls)
    - [For Development Environment:](#for-development-environment)
    - [For Production Environment:](#for-production-environment)
  - [Step 3: Create an Auth0 API](#step-3-create-an-auth0-api)
  - [Step 4: Create and Configure Roles](#step-4-create-and-configure-roles)
    - [cloud-user Role](#cloud-user-role)
    - [cloud-provider Role](#cloud-provider-role)
    - [cloud-operator Role](#cloud-operator-role)
  - [Step 5: Configure Environment Variables](#step-5-configure-environment-variables)
    - [Backend Environment Variables (.env)](#backend-environment-variables-env)
    - [Frontend Environment Variables (.env)](#frontend-environment-variables-env)
  - [Configuring User Registration and Role Assignment](#configuring-user-registration-and-role-assignment)
    - [Automatic Role Assignment for New Users](#automatic-role-assignment-for-new-users)
    - [Manual Role Assignment for Providers and Operators](#manual-role-assignment-for-providers-and-operators)
  - [Troubleshooting](#troubleshooting)
    - [Common Issues](#common-issues)
    - [Checking Auth0 Logs](#checking-auth0-logs)

## Overview

Auth0 is used for authentication and authorization in the ThreeFold Cloud Marketplace. This guide will walk you through the process of setting up Auth0 for both development and production environments, including creating the necessary roles and permissions.

## Prerequisites

- An Auth0 account (you can sign up at [auth0.com](https://auth0.com))
- Access to the ThreeFold Cloud Marketplace backend and frontend code repositories
- Administrative privileges to configure Auth0

## Step 1: Create a New Auth0 Application

1. Log in to your [Auth0 Dashboard](https://manage.auth0.com/)
2. Navigate to **Applications > Applications** in the left sidebar
3. Click the **Create Application** button
4. Enter a name for your application (e.g., "ThreeFold Cloud Marketplace")
5. Select **Regular Web Applications** as the application type
6. Click **Create**

## Step 2: Configure Application URLs

After creating the application, you need to configure the URLs:

1. In your Auth0 application settings, scroll down to the **Application URIs** section
2. Configure the following URLs:

### For Development Environment:

```
Allowed Callback URLs: http://localhost:8888/api/auth/callback, http://localhost:3000/callback
Allowed Logout URLs: http://localhost:3000
Allowed Web Origins: http://localhost:3000
```

### For Production Environment:

```
Allowed Callback URLs: https://your-domain.com/api/auth/callback, https://your-domain.com/callback
Allowed Logout URLs: https://your-domain.com
Allowed Web Origins: https://your-domain.com
```

3. Scroll down and click **Save Changes**

> **Note**: Replace `your-domain.com` with your actual production domain.

## Step 3: Create an Auth0 API

1. Navigate to **Applications > APIs** in the left sidebar
2. Click the **Create API** button
3. Enter a name for your API (e.g., "ThreeFold Cloud Marketplace API")
4. Set an identifier (audience) for the API (e.g., `https://api.your-domain.com`)
   - This will be used as the `AUTH0_AUDIENCE` environment variable
   - For development, you can use any URL-formatted identifier (it doesn't have to be a real URL)
5. Select the signing algorithm (RS256 is recommended)
6. Click **Create**

After creating the API:

1. Go to the **Permissions** tab of your API
2. Add the following permissions:
   - `read:marketplace` - Access marketplace listings
   - `write:marketplace` - Create and update marketplace listings
   - `delete:marketplace` - Remove marketplace listings
   - `approve:providers` - Approve infrastructure providers
   - `manage:users` - Manage user accounts and roles
3. Click **Add** after entering each permission
4. Click **Save**

## Step 4: Create and Configure Roles

1. Navigate to **User Management > Roles** in the left sidebar
2. Create the following roles by clicking **Create Role** for each:

### cloud-user Role

1. Name: `cloud-user`
2. Description: "Regular end users of the cloud marketplace"
3. Click **Create**
4. After creation, click on the role to configure permissions
5. Go to the **Permissions** tab
6. Click **Add Permissions**
7. Select your API
8. Assign the following permissions:
   - `read:marketplace`
9. Click **Add Permissions**

### cloud-provider Role

1. Name: `cloud-provider`
2. Description: "Infrastructure providers for the cloud marketplace"
3. Click **Create**
4. After creation, click on the role to configure permissions
5. Go to the **Permissions** tab
6. Click **Add Permissions**
7. Select your API
8. Assign the following permissions:
   - `read:marketplace`
   - `write:marketplace`
   - `delete:marketplace`
9. Click **Add Permissions**

### cloud-operator Role

1. Name: `cloud-operator`
2. Description: "Administrators of the cloud marketplace"
3. Click **Create**
4. After creation, click on the role to configure permissions
5. Go to the **Permissions** tab
6. Click **Add Permissions**
7. Select your API
8. Assign the following permissions:
   - `read:marketplace`
   - `write:marketplace`
   - `delete:marketplace`
   - `approve:providers`
   - `manage:users`
9. Click **Add Permissions**

## Step 5: Configure Environment Variables

After setting up Auth0, you need to update the environment variables in your backend and frontend applications.

### Backend Environment Variables (.env)

```
# Auth0 Configuration
AUTH0_DOMAIN=your-tenant.auth0.com
AUTH0_CLIENT_ID=your-client-id
AUTH0_CLIENT_SECRET=your-client-secret
AUTH0_CALLBACK_URL=http://localhost:8888/api/auth/callback
AUTH0_AUDIENCE=https://your-api-identifier
```

Where to find these values:

- `AUTH0_DOMAIN`: Found in your Auth0 application settings under "Domain"
- `AUTH0_CLIENT_ID`: Found in your Auth0 application settings under "Client ID"
- `AUTH0_CLIENT_SECRET`: Found in your Auth0 application settings under "Client Secret"
- `AUTH0_CALLBACK_URL`: The URL you configured in Step 2
- `AUTH0_AUDIENCE`: The API identifier you set in Step 3

### Frontend Environment Variables (.env)

```
VITE_AUTH0_DOMAIN=your-tenant.auth0.com
VITE_AUTH0_CLIENT_ID=your-client-id
VITE_AUTH0_AUDIENCE=https://your-api-identifier
```

Where to find these values:

- `VITE_AUTH0_DOMAIN`: Same as `AUTH0_DOMAIN` in the backend
- `VITE_AUTH0_CLIENT_ID`: Same as `AUTH0_CLIENT_ID` in the backend
- `VITE_AUTH0_AUDIENCE`: Same as `AUTH0_AUDIENCE` in the backend

## Configuring User Registration and Role Assignment

### Automatic Role Assignment for New Users

To automatically assign the `cloud-user` role to new users during signup:

1. Navigate to **Actions > Flows** in the left sidebar
2. Click on the **Login** flow
3. Click **+ Add Action** and select **Build Custom**
4. Name the action "Assign Default Role"
5. Replace the code with:

```javascript
exports.onExecutePostLogin = async (event, api) => {
  // Check if it's a new user
  if (event.stats.logins_count === 1) {
    const ManagementClient = require('auth0').ManagementClient;
    const management = new ManagementClient({
      domain: event.secrets.domain,
      clientId: event.secrets.clientId,
      clientSecret: event.secrets.clientSecret,
    });
    
    try {
      // Assign the cloud-user role to the new user
      await management.assignRolestoUser(
        { id: event.user.user_id },
        { roles: ['rol_cloud_user_id'] }
      );
    } catch (error) {
      console.log('Error assigning role:', error);
    }
  }
};
```

6. Replace `'rol_cloud_user_id'` with the actual Role ID of your `cloud-user` role (found in the Role settings)
7. Add the following secrets:
   - `domain`: Your Auth0 domain
   - `clientId`: A Machine-to-Machine application client ID with Management API permissions
   - `clientSecret`: The corresponding client secret
8. Deploy the action
9. Add the action to your Login flow and ensure it's enabled

### Manual Role Assignment for Providers and Operators

For the `cloud-provider` and `cloud-operator` roles, you'll need to manually assign these roles:

1. Navigate to **User Management > Users** in the left sidebar
2. Find and select the user you want to assign a role to
3. Go to the **Roles** tab
4. Click **Assign Roles**
5. Select the appropriate role (`cloud-provider` or `cloud-operator`)
6. Click **Assign**

## Troubleshooting

### Common Issues

1. **Authentication Fails**:
   - Verify that your Auth0 domain, client ID, and client secret are correct
   - Check that the callback URL in your Auth0 dashboard matches the `AUTH0_CALLBACK_URL` in your `.env` file
   - Ensure that your Auth0 API identifier matches the `AUTH0_AUDIENCE` in your `.env` file

2. **Role Assignment Issues**:
   - Check that the roles are correctly created in Auth0
   - Verify that the permissions are correctly assigned to each role
   - Check the Auth0 logs for any errors during role assignment

3. **API Authorization Issues**:
   - Verify that the API is correctly set up with the required permissions
   - Check that the roles have the correct permissions assigned
   - Ensure that the `AUTH0_AUDIENCE` matches your API identifier

### Checking Auth0 Logs

To troubleshoot authentication issues:

1. Navigate to **Monitoring > Logs** in the Auth0 dashboard
2. Use the filters to find relevant log entries
3. Check for error messages related to authentication, role assignment, or API authorization

---

This documentation is maintained by the ThreeFold Cloud Marketplace team. If you find any issues or have suggestions for improvement, please create an issue in the project repository.