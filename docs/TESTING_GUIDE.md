# ThreeFold Cloud Marketplace Testing Guide

This guide provides comprehensive instructions for testing the ThreeFold Cloud Marketplace, covering both the frontend and backend components.

## Table of Contents

- [ThreeFold Cloud Marketplace Testing Guide](#threefold-cloud-marketplace-testing-guide)
  - [Table of Contents](#table-of-contents)
  - [Prerequisites](#prerequisites)
  - [Backend Testing](#backend-testing)
    - [Backend Unit Tests](#backend-unit-tests)
    - [Backend Integration Tests](#backend-integration-tests)
    - [Backend End-to-End Tests](#backend-end-to-end-tests)
    - [Manual API Testing](#manual-api-testing)
  - [Frontend Testing](#frontend-testing)
    - [Frontend Unit Tests](#frontend-unit-tests)
    - [Component Tests](#component-tests)
    - [Frontend End-to-End Tests](#frontend-end-to-end-tests)
    - [Manual Testing](#manual-testing)
  - [Authentication Testing](#authentication-testing)
  - [Payment Processing Testing](#payment-processing-testing)
  - [Smoke Testing](#smoke-testing)
  - [Troubleshooting](#troubleshooting)
    - [Backend Test Issues](#backend-test-issues)
    - [Frontend Test Issues](#frontend-test-issues)
    - [End-to-End Test Issues](#end-to-end-test-issues)

## Prerequisites

Before you begin testing, ensure you have:

1. Completed the setup process as described in the [Setup Guide](SETUP_GUIDE.md)
2. Both backend and frontend running locally
3. Configured Auth0 and FaunaDB as described in the setup guide
4. Configured Stripe if you're testing payment functionality

## Backend Testing

### Backend Unit Tests

Unit tests verify that individual functions and components work correctly in isolation.

1. Navigate to the backend directory:

```bash
cd backend
```

2. Run the unit tests:

```bash
npm run test:unit
```

These tests focus on individual functions and services, mocking external dependencies.

### Backend Integration Tests

Integration tests verify that different parts of the application work together correctly.

1. Run the integration tests:

```bash
npm run test:integration
```

These tests focus on API endpoints and database interactions, using test databases and mocked authentication.

### Backend End-to-End Tests

End-to-end tests verify the complete flow of the application from API request to database and back.

1. Run the end-to-end tests:

```bash
npm run test:e2e
```

These tests simulate real user interactions with the API, including authentication and database operations.

### Manual API Testing

You can manually test the API endpoints using tools like Postman or curl.

1. Start the backend server:

```bash
npm run dev
```

2. Test the API endpoints:

- Base URL: `http://localhost:8888/.netlify/functions/api`
- Authentication: Include the Auth0 token in the Authorization header

Example curl request:

```bash
curl -X GET \
  http://localhost:8888/.netlify/functions/api/auth/session \
  -H 'Authorization: Bearer YOUR_AUTH0_TOKEN'
```

## Frontend Testing

### Frontend Unit Tests

Unit tests verify that individual components and functions work correctly in isolation.

1. Navigate to the frontend directory:

```bash
cd frontend
```

2. Run the unit tests:

```bash
npm test
```

These tests focus on individual components, hooks, and utility functions.

### Component Tests

Component tests verify that React components render correctly and respond to user interactions.

1. Run the component tests:

```bash
npm run test:components
```

These tests render components in isolation and simulate user interactions.

### Frontend End-to-End Tests

End-to-end tests verify the complete user flow through the application.

1. Run the end-to-end tests:

```bash
npm run test:e2e
```

These tests simulate real user interactions with the frontend, including authentication and API calls.

### Manual Testing

Manual testing is essential for verifying the user experience and catching issues that automated tests might miss.

1. Start both the backend and frontend servers:

```bash
# Terminal 1
cd backend
npm run dev

# Terminal 2
cd frontend
npm run dev
```

2. Open your browser and navigate to `http://localhost:3000`

3. Test the following user flows:
   - User registration and login
   - Creating, viewing, updating, and deleting deployments
   - Provider registration and node management
   - Operator dashboard functionality (if you have operator access)
   - Payment processing (using Stripe test cards)

## Authentication Testing

Testing authentication requires valid Auth0 credentials and proper configuration.

1. Test user registration:
   - Click "Sign Up" on the login page
   - Complete the registration form
   - Verify that you're redirected back to the application
   - Check that you have the `cloud-user` role

2. Test user login:
   - Click "Log In" on the login page
   - Enter your credentials
   - Verify that you're redirected back to the application
   - Check that your user profile is loaded correctly

3. Test role-based access control:
   - Try accessing provider-only routes as a regular user
   - Try accessing operator-only routes as a regular user
   - Verify that you're redirected to an unauthorized page

## Payment Processing Testing

Testing payment processing requires Stripe test credentials.

1. Test adding a payment method:
   - Navigate to the payment methods page
   - Add a new payment method using Stripe test card numbers:
     - Successful payment: `4242 4242 4242 4242`
     - Failed payment: `4000 0000 0000 0002`
   - Verify that the payment method is added successfully

2. Test processing a payment:
   - Create a new deployment
   - Select a paid plan
   - Complete the payment process
   - Verify that the payment is processed successfully
   - Check that the deployment is created

## Smoke Testing

Smoke testing verifies that the core functionality of the application works correctly.

1. From the project root, run:

```bash
make smoke
```

2. After the build, a static server will serve the `dist/` directory (default port 5000)
3. Open `http://localhost:5000` in your browser
4. Navigate to key routes (e.g., `/dashboard`, `/docs`) to verify SPA fallback
5. Test core functionality to ensure everything works as expected

## Troubleshooting

### Backend Test Issues

1. **Database Connection Issues**
   - Verify that your FaunaDB secret key is correct
   - Check that the test database exists
   - Run `npm run setup:fauna:test` to recreate the test database

2. **Authentication Issues**
   - Verify that your Auth0 credentials are correct
   - Check that the test users exist in Auth0
   - Verify that the test tokens are valid

3. **Test Timeouts**
   - Increase the test timeout in `jest.config.js`
   - Check for slow database operations or API calls

### Frontend Test Issues

1. **Component Rendering Issues**
   - Check for missing dependencies
   - Verify that the component props are correct
   - Check for DOM manipulation outside of React

2. **API Connection Issues**
   - Verify that the API URL is correct
   - Check that the backend server is running
   - Check for CORS issues

3. **Authentication Issues**
   - Verify that the Auth0 configuration is correct
   - Check that the test tokens are valid
   - Verify that the callback URL is correct

### End-to-End Test Issues

1. **Browser Automation Issues**
   - Check for browser compatibility issues
   - Verify that the browser driver is installed correctly
   - Check for timing issues in the tests

2. **Test Data Issues**
   - Verify that the test data is correctly set up
   - Check for data conflicts between tests
   - Ensure that tests clean up after themselves

---

By following this guide, you should be able to thoroughly test the ThreeFold Cloud Marketplace and ensure that it works correctly. If you encounter any issues not covered in the troubleshooting section, please refer to the project's GitHub issues or create a new issue with detailed information about the problem.