# ThreeFold Cloud Marketplace Frontend

This is the frontend for the ThreeFold Cloud Marketplace, designed to work with the serverless backend implemented with Netlify Functions, Auth0, FaunaDB, and Stripe.

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

- **Frontend Framework**: React
- **State Management**: React Context API
- **Styling**: CSS Modules / Styled Components
- **Authentication**: Auth0
- **Payment Processing**: Stripe Elements
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
VITE_STRIPE_PUBLIC_KEY=your-stripe-public-key
```

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

## Backend Integration

The frontend integrates with the backend using the provided integration examples in `backend/examples/frontend-integration`. These examples have been adapted and implemented in the frontend codebase.

### Integration Files

The following files handle backend integration:

- `src/services/auth.js`: Authentication service for Auth0 integration
- `src/services/api.js`: API client for making requests to the backend
- `src/services/payment.js`: Service for Stripe payment integration

## Authentication

The frontend uses Auth0 for authentication. The authentication flow is as follows:

### 1. Setup Auth0Provider in your main application

```jsx
// src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { Auth0Provider } from './contexts/Auth0Context';
import App from './App';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Auth0Provider>
      <App />
    </Auth0Provider>
  </React.StrictMode>
);
```

### 2. Create an Auth0 Context

```jsx
// src/contexts/Auth0Context.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import authService from '../services/auth';

const Auth0Context = createContext();

export const useAuth0 = () => useContext(Auth0Context);

export const Auth0Provider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      if (authService.isAuthenticated()) {
        setIsAuthenticated(true);
        setUser(authService.getUser());
      }
      
      setIsLoading(false);
    };

    initAuth();
    
    // Handle authentication callback
    if (window.location.search.includes('access_token=')) {
      authService.handleCallback();
    }
    
    // Listen for auth events
    window.addEventListener('auth:login', (e) => {
      setIsAuthenticated(true);
      setUser(e.detail.user);
    });
    
    window.addEventListener('auth:unauthorized', () => {
      setIsAuthenticated(false);
      setUser(null);
    });
    
    return () => {
      window.removeEventListener('auth:login', () => {});
      window.removeEventListener('auth:unauthorized', () => {});
    };
  }, []);

  const login = () => authService.login();
  const logout = () => authService.logout();

  const value = {
    isAuthenticated,
    user,
    isLoading,
    login,
    logout
  };

  return (
    <Auth0Context.Provider value={value}>
      {children}
    </Auth0Context.Provider>
  );
};
```

### 3. Use the Auth0 Context in Components

```jsx
// src/components/LoginButton.jsx
import { useAuth0 } from '../contexts/Auth0Context';

const LoginButton = () => {
  const { isAuthenticated, login, logout } = useAuth0();

  return isAuthenticated ? (
    <button onClick={logout}>Log Out</button>
  ) : (
    <button onClick={login}>Log In</button>
  );
};

export default LoginButton;
```

### 4. Protect Routes

```jsx
// src/components/ProtectedRoute.jsx
import { Navigate } from 'react-router-dom';
import { useAuth0 } from '../contexts/Auth0Context';

const ProtectedRoute = ({ children, requiredRole }) => {
  const { isAuthenticated, user, isLoading } = useAuth0();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (requiredRole && (!user.permissions || !user.permissions.includes(requiredRole))) {
    return <Navigate to="/unauthorized" />;
  }

  return children;
};

export default ProtectedRoute;
```

## API Client

The API client handles communication with the backend API. It automatically includes authentication tokens in requests.

### Usage Example

```jsx
import { useState, useEffect } from 'react';
import apiClient from '../services/api';

const DeploymentsList = () => {
  const [deployments, setDeployments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDeployments = async () => {
      try {
        const response = await apiClient.getUserDeployments();
        setDeployments(response.deployments);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDeployments();
  }, []);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h2>Your Deployments</h2>
      {deployments.length === 0 ? (
        <p>No deployments found.</p>
      ) : (
        <ul>
          {deployments.map(deployment => (
            <li key={deployment.id}>
              <h3>{deployment.name}</h3>
              <p>{deployment.description}</p>
              <p>Status: {deployment.status}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default DeploymentsList;
```

## Payment Processing

The payment service integrates with Stripe for payment processing.

### 1. Set up Stripe Elements

```jsx
import { useState, useEffect } from 'react';
import paymentService from '../services/payment';

const PaymentForm = () => {
  const [isStripeReady, setIsStripeReady] = useState(false);
  
  useEffect(() => {
    const initStripe = async () => {
      try {
        await paymentService.initialize(import.meta.env.VITE_STRIPE_PUBLIC_KEY);
        setIsStripeReady(true);
      } catch (error) {
        console.error('Failed to initialize Stripe:', error);
      }
    };
    
    initStripe();
  }, []);
  
  useEffect(() => {
    if (isStripeReady) {
      paymentService.mountCardElement('card-element');
    }
  }, [isStripeReady]);
  
  return (
    <div>
      <h2>Payment Information</h2>
      <div id="card-element" className="card-element"></div>
      <div id="card-errors" className="card-errors" role="alert"></div>
    </div>
  );
};

export default PaymentForm;
```

### 2. Process Payment

```jsx
const handlePayment = async () => {
  try {
    // Create payment method
    await paymentService.createPaymentMethod({
      name: user.name,
      email: user.email
    });
    
    // Process payment
    const result = await paymentService.processPayment(
      amount,
      'usd',
      `Payment for ${deploymentName}`
    );
    
    console.log('Payment successful:', result);
  } catch (error) {
    console.error('Payment failed:', error);
  }
};
```

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

## Project Structure

```
frontend/
├── public/              # Static assets
├── src/                 # Source code
│   ├── assets/          # Images, fonts, etc.
│   ├── components/      # Reusable components
│   │   ├── common/      # Common UI components
│   │   ├── layout/      # Layout components
│   │   └── forms/       # Form components
│   ├── contexts/        # React contexts
│   ├── hooks/           # Custom React hooks
│   ├── pages/           # Page components
│   ├── services/        # API and service integrations
│   ├── styles/          # Global styles
│   ├── utils/           # Utility functions
│   ├── App.jsx          # Main App component
│   ├── main.jsx         # Entry point
│   └── routes.jsx       # Route definitions
├── .env.example         # Example environment variables
├── index.html           # HTML template
├── package.json         # Dependencies and scripts
├── vite.config.js       # Vite configuration
└── README.md            # This file
```

## Available Components

The frontend includes several pre-built components for common functionality:

### Authentication Components

- `LoginButton`: Button for login/logout
- `UserProfile`: Display user profile information
- `ProtectedRoute`: Route that requires authentication

### Deployment Components

- `DeploymentsList`: List of user deployments
- `DeploymentDetail`: Detailed view of a deployment
- `DeploymentForm`: Form for creating/editing deployments

### Payment Components

- `PaymentForm`: Form for payment information
- `PaymentMethodsList`: List of saved payment methods
- `TransactionHistory`: Display transaction history

## Troubleshooting

### Common Issues

1. **Authentication Issues**
   - Check Auth0 configuration in `.env` file
   - Verify callback URLs are correctly set up in Auth0 dashboard
   - Check browser console for CORS errors

2. **API Connection Issues**
   - Verify the backend API is running
   - Check API URL in `.env` file
   - Check browser console for network errors

3. **Stripe Payment Issues**
   - Check Stripe public key in `.env` file
   - Verify the card element is mounted correctly
   - Check browser console for Stripe Elements errors

### Getting Help

If you encounter issues not covered in this documentation, please:

1. Check the GitHub issues for similar problems
2. Review the browser console for error messages
3. Create a new issue with detailed information about the problem

## License

This project is licensed under the Apache 2.0 License.