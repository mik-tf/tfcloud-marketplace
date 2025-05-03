# Netlify Setup Guide for ThreeFold Cloud Marketplace

This guide provides step-by-step instructions for setting up Netlify hosting for the ThreeFold Cloud Marketplace. It explains how to create a Netlify account, connect your GitHub repository, configure build settings, set up environment variables, and deploy both the frontend and backend serverless functions.

## Table of Contents

- [Netlify Setup Guide for ThreeFold Cloud Marketplace](#netlify-setup-guide-for-threefold-cloud-marketplace)
  - [Table of Contents](#table-of-contents)
  - [Prerequisites](#prerequisites)
  - [Creating a Netlify Account](#creating-a-netlify-account)
  - [Connecting Your GitHub Repository](#connecting-your-github-repository)
  - [Configuring Build Settings](#configuring-build-settings)
  - [Setting Up Environment Variables](#setting-up-environment-variables)
  - [Configuring Custom Domains](#configuring-custom-domains)
    - [Setting Up the Production Domain](#setting-up-the-production-domain)
    - [Setting Up the Development Domain](#setting-up-the-development-domain)
  - [Setting Up Branch Deploys](#setting-up-branch-deploys)
  - [Configuring Serverless Functions](#configuring-serverless-functions)
  - [Enabling HTTPS](#enabling-https)
  - [Setting Up Redirects and Headers](#setting-up-redirects-and-headers)
  - [Deploying Your Site](#deploying-your-site)
  - [Troubleshooting](#troubleshooting)
    - [Build Failures](#build-failures)
    - [Function Deployment Issues](#function-deployment-issues)
    - [Domain Configuration Issues](#domain-configuration-issues)
    - [Still Having Issues?](#still-having-issues)

## Prerequisites

- A GitHub account with your ThreeFold Cloud Marketplace repository
- Node.js (v18 or later)
- npm or yarn
- Basic knowledge of Git and GitHub
- Domain names for your production and development environments (optional but recommended)

## Creating a Netlify Account

1. Go to [Netlify's website](https://netlify.com) and click "Sign up"
2. Choose to sign up with GitHub (recommended), GitLab, Bitbucket, or email
3. If signing up with GitHub:
   - Authorize Netlify to access your GitHub account
   - You can choose to limit access to specific repositories if desired
4. Complete the account setup process by following the on-screen instructions

> **Note**: Signing up with GitHub makes it easier to connect your repositories later.

## Connecting Your GitHub Repository

1. Log in to your [Netlify Dashboard](https://app.netlify.com/)
2. Click "Add new site" and select "Import an existing project"
3. Choose GitHub as your Git provider
4. Select the ThreeFold Cloud Marketplace repository from the list
   - If you don't see your repository, click "Configure the Netlify app on GitHub" to grant access to the repository
5. Select the branch you want to deploy (typically `main` for production)

## Configuring Build Settings

Configure your build settings to properly build and deploy both the frontend and backend:

1. In the site settings page, configure the following:
   - **Base directory**: Leave empty (or set to `/` if required)
   - **Build command**: `cd frontend && npm install && npm run build`
   - **Publish directory**: `frontend/dist`
   - **Functions directory**: `backend/functions`

2. Expand the "Advanced build settings" section and add the following environment variables:
   - `NODE_VERSION`: `18` (or your preferred Node.js version)
   - `NPM_VERSION`: `9` (or your preferred npm version)

3. Click "Deploy site" to start the initial build and deployment

> **Note**: The build command first changes to the frontend directory, installs dependencies, and then builds the frontend application.

## Setting Up Environment Variables

1. After the initial deployment, go to "Site settings" > "Environment variables"
2. Click "Add variable" and add the following environment variables:

   **Frontend Variables**:
   - `VITE_AUTH0_DOMAIN`: Your Auth0 domain (e.g., `your-tenant.auth0.com`)
   - `VITE_AUTH0_CLIENT_ID`: Your Auth0 client ID
   - `VITE_AUTH0_AUDIENCE`: Your Auth0 API audience (e.g., `https://api.threefold.store`)
   - `VITE_AUTH0_CALLBACK_URL`: Your Auth0 callback URL (e.g., `https://threefold.store` for production)
   - `VITE_API_URL`: Your API URL (e.g., `https://threefold.store/.netlify/functions/api` for production)

   **Backend Variables**:
   - `AUTH0_DOMAIN`: Your Auth0 domain
   - `AUTH0_CLIENT_ID`: Your Auth0 client ID
   - `AUTH0_CLIENT_SECRET`: Your Auth0 client secret
   - `AUTH0_AUDIENCE`: Your Auth0 API audience
   - `FRONTEND_URL`: Your frontend URL (e.g., `https://threefold.store` for production)
   - `MONGODB_URI`: Your MongoDB connection string (if using MongoDB)
   - `FAUNADB_SECRET`: Your FaunaDB secret key (if using FaunaDB)
   - `STRIPE_SECRET_KEY`: Your Stripe secret key (if using Stripe)
   - `STRIPE_WEBHOOK_SECRET`: Your Stripe webhook secret (if using Stripe)

3. Click "Save" to apply the environment variables

> **Important**: Environment variables are encrypted and securely stored by Netlify. However, never commit sensitive values to your repository.

## Configuring Custom Domains

### Setting Up the Production Domain

1. Go to "Site settings" > "Domain management"
2. Click "Add custom domain"
3. Enter your domain name (e.g., `threefold.store`)
4. Choose whether to:
   - Purchase the domain through Netlify
   - Use a domain you already own
5. If using an existing domain:
   - Add the DNS records provided by Netlify to your domain registrar
   - Typically, this involves setting up a CNAME record pointing to your Netlify site
   - For apex domains (e.g., `threefold.store` without `www`), you may need to set up A records or use Netlify DNS

### Setting Up the Development Domain

1. Follow the same steps as above to add your development domain (e.g., `dev.threefold.store`)
2. This domain will be used for your development branch deployments

> **Note**: Using Netlify DNS for your domains simplifies the setup process and enables features like automatic SSL certificate renewal.

## Setting Up Branch Deploys

To set up separate deployments for your main and development branches:

1. Go to "Site settings" > "Build & deploy" > "Continuous deployment"
2. Under "Deploy contexts", configure:
   - **Production branch**: Set to `main` (deploys to your production domain)
   - **Branch deploys**: Set to "All" or "Let me specify" and add `development` (deploys to your development domain)
   - **Deploy previews**: Enable for pull requests (optional but recommended for testing changes)

3. For branch-specific environment variables:
   - Go to "Site settings" > "Environment variables"
   - Click "Add variable"
   - Select "Add a scope" and choose the branch (e.g., `development`)
   - Add branch-specific variables (e.g., different API URLs or Auth0 settings)

## Configuring Serverless Functions

Netlify Functions allow you to deploy serverless backend code:

1. Ensure your `netlify.toml` file in the root directory includes:

```toml
[functions]
  directory = "backend/functions"
  node_bundler = "esbuild"
  external_node_modules = ["express"]

[[redirects]]
  from = "/api/*"
  to = "/.netlify/functions/api/:splat"
  status = 200
  force = true
```

2. Make sure your backend functions are properly structured:
   - Each function should export a `handler` function
   - For Express apps, use `serverless-http` to wrap your Express app

3. To test functions locally:
   - Install the Netlify CLI: `npm install -g netlify-cli`
   - Run `netlify dev` to start a local development server
   - Your functions will be available at `http://localhost:8888/.netlify/functions/[function-name]`

## Enabling HTTPS

Netlify automatically provisions SSL certificates for your custom domains:

1. After adding your custom domain, Netlify will attempt to provision an SSL certificate
2. If using Netlify DNS, this happens automatically
3. If using external DNS, ensure your DNS records are correctly set up
4. You can check the status in "Site settings" > "Domain management" > "HTTPS"
5. Enable "Force HTTPS" to redirect all HTTP traffic to HTTPS

## Setting Up Redirects and Headers

Configure redirects and headers for your site:

1. For SPA (Single Page Application) routing, add this to your `netlify.toml`:

```toml
[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

2. For security headers, add:

```toml
[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-XSS-Protection = "1; mode=block"
    X-Content-Type-Options = "nosniff"
    Referrer-Policy = "strict-origin-when-cross-origin"
    Content-Security-Policy = "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; connect-src 'self' https://*.auth0.com https://*.netlify.app;"
```

3. Deploy your site again for the changes to take effect

## Deploying Your Site

After configuring everything:

1. Push changes to your repository:
   - Push to `main` for production deployment
   - Push to `development` for development deployment

2. Netlify will automatically build and deploy your site
   - You can monitor the build progress in the "Deploys" section of your Netlify dashboard
   - Each deployment gets a unique URL for testing before it goes live

3. To manually trigger a deployment:
   - Go to the "Deploys" section
   - Click "Trigger deploy" and select the deployment option

## Troubleshooting

### Build Failures

If your build fails:

1. Check the build logs in the "Deploys" section
2. Common issues include:
   - Missing dependencies
   - Incorrect build commands
   - Environment variable issues
   - Node.js version compatibility

3. To debug locally:
   - Install Netlify CLI: `npm install -g netlify-cli`
   - Run `netlify build` to simulate the build process locally

### Function Deployment Issues

If your serverless functions aren't working:

1. Check the function logs in the "Functions" section of your Netlify dashboard
2. Verify your `netlify.toml` configuration
3. Ensure your functions are properly structured and export a `handler` function
4. Check for dependencies that need to be included in `external_node_modules`
5. Test locally with `netlify dev`

### Domain Configuration Issues

If your custom domain isn't working:

1. Verify your DNS records are correctly set up
2. Check the SSL certificate status in "Site settings" > "Domain management" > "HTTPS"
3. Wait for DNS propagation (can take up to 48 hours, but usually much faster)
4. If using Netlify DNS, ensure your domain's nameservers are correctly set

### Still Having Issues?

If you're still experiencing problems:

1. Consult the [Netlify Documentation](https://docs.netlify.com/)
2. Check the [Netlify Status Page](https://www.netlifystatus.com/) for any service issues
3. Search the [Netlify Support Forums](https://answers.netlify.com/)
4. Reach out to the project maintainers for assistance

---

By following this guide, you should have successfully set up Netlify hosting for your ThreeFold Cloud Marketplace. The application should now be deployed with separate environments for production and development, with serverless functions for the backend API.