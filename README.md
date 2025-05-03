# ThreeFold Cloud Marketplace

A marketplace for ThreeFold Cloud services.

## Development Setup

### Prerequisites

- Node.js (v18 or later)
- npm or yarn
- Netlify CLI (`npm install -g netlify-cli`)
- Auth0 account

### Local Development

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/tfcloud-marketplace.git
   cd tfcloud-marketplace
   ```

2. Install dependencies for both frontend and backend:
   ```bash
   # Install frontend dependencies
   cd frontend
   npm install
   
   # Install backend dependencies
   cd ../backend
   npm install
   ```

3. Set up environment variables:
   - Copy `.env.example` to `.env` in both frontend and backend directories
   - Update the values with your Auth0 credentials and other configuration

4. Start the development server:
   ```bash
   # From the root directory
   netlify dev
   ```

   This will start both the frontend and backend servers.

## Auth0 Setup

1. Create a new Auth0 application:
   - Go to [Auth0 Dashboard](https://manage.auth0.com/)
   - Create a new Application (Regular Web Application)
   - Configure the following settings:
     - Allowed Callback URLs: `http://localhost:3000, https://dev.threefold.store, https://threefold.store`
     - Allowed Logout URLs: `http://localhost:3000, https://dev.threefold.store, https://threefold.store`
     - Allowed Web Origins: `http://localhost:3000, https://dev.threefold.store, https://threefold.store`

2. Create an API:
   - Go to APIs in the Auth0 Dashboard
   - Create a new API with the following settings:
     - Name: ThreeFold Cloud Marketplace API
     - Identifier: `https://api.threefold.store`
     - Signing Algorithm: RS256

3. Set up roles and permissions:
   - Go to User Management > Roles
   - Create the following roles:
     - cloud-user
     - cloud-provider
     - cloud-operator

4. Update your environment variables with the Auth0 credentials.

## Netlify Deployment

### Manual Deployment

1. Build the project:
   ```bash
   # Build frontend
   cd frontend
   npm run build
   
   # Build backend
   cd ../backend
   npm run build
   ```

2. Deploy to Netlify:
   ```bash
   netlify deploy --prod
   ```

### Continuous Deployment

1. Connect your GitHub repository to Netlify:
   - Go to [Netlify](https://app.netlify.com/)
   - Click "New site from Git"
   - Select your repository
   - Configure build settings:
     - Build command: `cd frontend && npm install && npm run build`
     - Publish directory: `frontend/dist`
     - Functions directory: `backend/functions`

2. Configure environment variables in Netlify:
   - Go to Site settings > Build & deploy > Environment
   - Add the environment variables from your `.env` files

3. Set up branch deploys:
   - Go to Site settings > Build & deploy > Continuous Deployment
   - Configure branch deploys:
     - Production branch: `main` (deploys to threefold.store)
     - Branch deploys: `development` (deploys to dev.threefold.store)

4. Set up custom domains:
   - Go to Site settings > Domain management
   - Add custom domains:
     - threefold.store (for production)
     - dev.threefold.store (for development)

## Project Structure

```
tfcloud-marketplace/
├── .github/            # GitHub Actions workflows
├── backend/            # Backend code
│   ├── functions/      # Netlify serverless functions
│   ├── src/            # Backend source code
│   └── netlify.toml    # Backend Netlify configuration
├── frontend/           # Frontend code
│   ├── public/         # Static assets
│   ├── src/            # Frontend source code
│   └── netlify.toml    # Frontend Netlify configuration
├── netlify.toml        # Main Netlify configuration
└── README.md           # Project documentation
```

## License

[Apache 2.0](LICENSE)