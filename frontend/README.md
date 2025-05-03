# ThreeFold Cloud Marketplace Frontend

This is the frontend for the ThreeFold Cloud Marketplace, designed to work with the serverless backend implemented with Netlify Functions, Auth0, MongoDB Atlas, and Stripe.

> **Note**: This frontend is currently in early development. The UI components and basic structure have been implemented, but the integration with backend services and third-party providers (Auth0, Stripe, etc.) is still in progress.

## Table of Contents

- [Technology Stack](#technology-stack)
- [Prerequisites](#prerequisites)
- [Setup and Installation](#setup-and-installation)
- [Development](#development)
- [Backend Integration](#backend-integration)
- [Authentication](#authentication)
- [API Client](#api-client)
- [Payment Processing](#payment-processing)
- [Deployment](#deployment)
- [Project Structure](#project-structure)
- [Available Components](#available-components)
- [Troubleshooting](#troubleshooting)
- [License](#license)

## Technology Stack

- **Frontend Framework**: React with TypeScript
- **State Management**: React Context API
- **Styling**: Tailwind CSS
- **Authentication**: Auth0 (planned)
- **Payment Processing**: Stripe Elements (planned)
- **Build Tool**: Vite

## Prerequisites

- Node.js (v16 or later)
- npm or yarn
- Backend API running (see [backend README](../backend/README.md))

## Setup and Installation

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/tfcloud-marketplace.git
cd tfcloud-marketplace/frontend
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

Edit the `.env` file with the following variables:

```
VITE_API_URL=http://localhost:8888/api
VITE_AUTH0_DOMAIN=your-auth0-domain.auth0.com
VITE_AUTH0_CLIENT_ID=your-auth0-client-id
VITE_AUTH0_AUDIENCE=https://your-api-identifier
```

> **Note**: These environment variables are set up in anticipation of future development phases when the frontend will be integrated with the backend and third-party services. They are not currently being used by the code.

## Development

### Start the Development Server

```bash
npm run dev
```

This will start the development server at `http://localhost:3000`.

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## Current Development Status

The frontend is currently in the first phase of development:

1. **Interface & Flow Integration** (Current Phase)
   - Core UI/UX interface has been implemented
   - End-to-end workflow for mock deployments is in place
   - Components are modular for easy extension

The following phases are planned but not yet implemented:

2. **Connect to TFChain** (Next Phase)
3. **Stripe Integration** (Planned)
4. **Backend Integration** (Planned)
5. **Documentation & CI** (Ongoing)
6. **Deployment** (Planned)

## Planned Backend Integration

The backend provides example code for frontend integration in `backend/examples/frontend-integration`. These examples will be adapted and implemented in the frontend codebase in future development phases.

### Planned Integration Files

The following files will handle backend integration:

- `src/services/auth.js`: Authentication service for Auth0 integration
- `src/services/api.js`: API client for making requests to the backend
- `src/services/payment.js`: Service for Stripe payment integration

## Planned Authentication

The frontend will use Auth0 for authentication in future development phases. The authentication flow will be implemented following the examples provided in the backend integration examples.

Currently, the frontend uses a mock authentication system with hardcoded credentials for demonstration purposes. The actual Auth0 integration will be implemented in the "Backend Integration" phase of development.

The planned authentication implementation will include:

1. An Auth0Provider component to manage authentication state
2. Context API for sharing authentication state across components
3. Protected routes that require authentication
4. Role-based access control for different user types (Cloud User, Cloud Provider, Cloud Operator)

## Planned API Client

An API client will be implemented in future development phases to handle communication with the backend API. It will automatically include authentication tokens in requests.

## Planned Payment Processing

Stripe integration for payment processing will be implemented in future development phases.

## Deployment

### Deploy to GitHub Pages

1. Update `vite.config.js` with your base URL:

```js
export default defineConfig({
  plugins: [react()],
  base: '/tfcloud-marketplace/'
});
```

2. Add a deploy script to `package.json`:

```json
"scripts": {
  "deploy": "npm run build && gh-pages -d dist"
}
```

3. Install gh-pages:

```bash
npm install --save-dev gh-pages
```

4. Deploy:

```bash
npm run deploy
```

### Deploy to Netlify

1. Connect your GitHub repository to Netlify
2. Configure build settings:
   - Build command: `npm run build`
   - Publish directory: `dist`
3. Configure environment variables in Netlify dashboard

## Current Project Structure

```
frontend/
├── public/              # Static assets
├── src/                 # Source code
│   ├── assets/          # Images, fonts, etc.
│   ├── components/      # Reusable components
│   │   ├── common/      # Common UI components
│   │   ├── layout/      # Layout components
│   │   └── forms/       # Form components
│   ├── context/         # React contexts
│   ├── docs/            # Documentation
│   ├── pages/           # Page components
│   ├── styles/          # Global styles
│   ├── App.tsx          # Main App component
│   ├── index.tsx        # Entry point
│   ├── index.css        # Global CSS
│   └── global.d.ts      # TypeScript declarations
├── .env                 # Environment variables
├── .env.example         # Example environment variables
├── index.html           # HTML template
├── package.json         # Dependencies and scripts
├── vite.config.ts       # Vite configuration
├── tsconfig.json        # TypeScript configuration
├── tailwind.config.js   # Tailwind CSS configuration
└── README.md            # This file
```

## Current Available Components

The frontend currently includes several pre-built UI components for the planned functionality:

### Layout Components

- `NavBar`: Navigation bar component
- `Footer`: Footer component
- `DashboardLayout`: Layout for dashboard pages
- `DocsLayout`: Layout for documentation pages

### User Interface Components

- `DeploymentsList`: Mock list of user deployments
- `DeploymentDetail`: Mock detailed view of a deployment
- `DeploymentForm`: Mock form for creating deployments
- `NodeDetail`: Mock node details view
- `OperatorDetail`: Mock operator details view
- `Settings`: Mock settings page

### Page Components

- `Home`: Homepage component
- `Login`: Login page component (mock)
- `Signup`: Signup page component (mock)
- `Dashboard`: Dashboard page component
- `Nodes`: Nodes management page
- `Ops`: Operator dashboard page

## Development Roadmap

The frontend development follows a phased approach:

1. **Interface & Flow Integration** ✅ (Current Phase)
   - Design and implement the core UI/UX interface
   - Create end-to-end workflow for mock deployments
   - Ensure components are modular for easy extension

2. **Connect to TFChain** 🔄 (Next Phase)
   - Integrate TFChain SDK for real deployments
   - Implement wallet management
   - Issue deployment transactions on TFChain

3. **Stripe Integration** 🔄 (Planned)
   - Set up Stripe SDK for fiat payments
   - Implement payment flow
   - Link payments to TFChain deployment credits

4. **Backend Integration** 🔄 (Planned)
   - Connect frontend with backend services
   - Implement authentication with Auth0
   - Set up database interactions

5. **Documentation & CI** 🔄 (Ongoing)
   - Update documentation at each milestone
   - Set up linting and formatting
   - Configure CI pipeline for tests and builds

6. **Deployment** 🔄 (Planned)
   - Configure GitHub Pages deployment
   - Set up multi-environment support (dev/prod)
   - Implement DNS and HTTPS configuration

## Troubleshooting

### Common Issues

1. **Development Server Issues**
   - Ensure Node.js version 16 or later is installed
   - Verify all dependencies are installed with `npm install`
   - Check for port conflicts (default port is 3000)
   - Review terminal output for error messages

2. **Build Issues**
   - Ensure all dependencies are installed
   - Check for TypeScript errors
   - Verify environment variables are properly set
   - Review build logs for detailed error information

3. **UI Rendering Issues**
   - Check browser console for JavaScript errors
   - Verify CSS is loading correctly
   - Test in different browsers to identify browser-specific issues
   - Check for responsive design issues at different screen sizes

### Getting Help

If you encounter issues not covered in this documentation, please:

1. Check the GitHub issues for similar problems
2. Review the browser console for error messages
3. Create a new issue with detailed information about the problem

## License

This project is licensed under the Apache 2.0 License.