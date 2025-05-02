import request from 'supertest';
import express from 'express';
import serverless from 'serverless-http';
import { v4 as uuidv4 } from 'uuid';

// Mock environment variables
process.env.AUTH0_DOMAIN = 'test-domain.auth0.com';
process.env.AUTH0_CLIENT_ID = 'test-client-id';
process.env.AUTH0_CLIENT_SECRET = 'test-client-secret';
process.env.AUTH0_CALLBACK_URL = 'http://localhost:8888/api/auth/callback';
process.env.AUTH0_AUDIENCE = 'https://test-api';
process.env.FRONTEND_URL = 'http://localhost:3000';
process.env.MONGODB_URI = 'mongodb://localhost:27017/test-db';
process.env.STRIPE_SECRET_KEY = 'test-stripe-secret';
process.env.STRIPE_WEBHOOK_SECRET = 'test-webhook-secret';

// Mock Auth0
jest.mock('auth0', () => ({
  AuthenticationClient: jest.fn().mockImplementation(() => ({
    oauth: {
      authorizationCodeGrant: jest.fn().mockResolvedValue({
        access_token: 'mock-access-token',
        id_token: 'mock-id-token',
        expires_in: 86400
      })
    },
    getProfile: jest.fn().mockResolvedValue({
      sub: 'auth0|123456789',
      email: 'test@example.com',
      name: 'Test User',
      picture: 'https://example.com/picture.jpg'
    })
  })),
  ManagementClient: jest.fn().mockImplementation(() => ({
    getUser: jest.fn().mockResolvedValue({
      user_id: 'auth0|123456789',
      email: 'test@example.com',
      name: 'Test User'
    })
  }))
}));

// Mock Mongoose
jest.mock('mongoose', () => {
  const mockUser = {
    auth0Id: 'auth0|123456789',
    email: 'test@example.com',
    name: 'Test User',
    picture: 'https://example.com/picture.jpg',
    createdAt: '2023-01-01T00:00:00.000Z',
    updatedAt: '2023-01-01T00:00:00.000Z',
    settings: { notifications: true }
  };

  const mockDeployment = {
    id: 'test-deployment-id',
    userId: 'auth0|123456789',
    name: 'Test Deployment',
    status: 'active',
    createdAt: '2023-01-01T00:00:00.000Z',
    updatedAt: '2023-01-01T00:00:00.000Z',
    resources: { cpu: 2, memory: 4, storage: 100 },
    billing: { planId: 'basic', amount: 10, currency: 'USD', interval: 'monthly' }
  };

  // Mock Schema class
  const mockSchema = jest.fn().mockImplementation(() => ({
    index: jest.fn().mockReturnThis()
  }));
  
  // Mock model function with different responses based on collection name
  const mockModel = jest.fn().mockImplementation((modelName) => {
    if (modelName === 'User') {
      return {
        findOne: jest.fn().mockImplementation(() => ({
          lean: jest.fn().mockResolvedValue(mockUser)
        })),
        create: jest.fn().mockResolvedValue(mockUser),
        save: jest.fn().mockResolvedValue(mockUser)
      };
    } else if (modelName === 'Deployment') {
      return {
        find: jest.fn().mockImplementation(() => ({
          skip: jest.fn().mockReturnThis(),
          limit: jest.fn().mockReturnThis(),
          lean: jest.fn().mockResolvedValue([mockDeployment])
        })),
        findOne: jest.fn().mockImplementation(() => ({
          lean: jest.fn().mockResolvedValue(mockDeployment)
        })),
        create: jest.fn().mockResolvedValue(mockDeployment),
        save: jest.fn().mockResolvedValue(mockDeployment),
        countDocuments: jest.fn().mockResolvedValue(1)
      };
    }
    
    return {
      find: jest.fn().mockReturnValue({
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        lean: jest.fn().mockResolvedValue([])
      }),
      findOne: jest.fn().mockReturnValue({
        lean: jest.fn().mockResolvedValue(null)
      }),
      create: jest.fn().mockResolvedValue({}),
      save: jest.fn().mockResolvedValue({})
    };
  });
  
  return {
    connect: jest.fn().mockResolvedValue({}),
    Schema: mockSchema,
    model: mockModel,
    models: {}
  };
});

// Mock Stripe
jest.mock('stripe', () => {
  return jest.fn().mockImplementation(() => ({
    paymentIntents: {
      create: jest.fn().mockResolvedValue({
        id: 'pi_mock_id',
        client_secret: 'pi_mock_secret',
        status: 'requires_payment_method'
      })
    }
  }));
});

// Mock JWT middleware
jest.mock('../../src/middleware/auth', () => ({
  jwtCheck: jest.fn((req, res, next) => {
    req.auth = {
      sub: 'auth0|123456789',
      permissions: ['cloud-user']
    };
    next();
  }),
  checkRole: jest.fn().mockImplementation((role) => (req, res, next) => next()),
  ROLES: {
    CLOUD_USER: 'cloud-user',
    CLOUD_PROVIDER: 'cloud-provider',
    CLOUD_OPERATOR: 'cloud-operator'
  }
}));

describe('End-to-End User Flow Tests', () => {
  let app: express.Application;
  let handler: any;

  beforeAll(async () => {
    // Import the API handler
    const apiModule = await import('../../functions/api');
    handler = apiModule.handler;
    
    // Create Express app for testing
    app = express();
    app.use(express.json());
    app.use('/.netlify/functions/api', (req, res, next) => {
      return handler(req, res, next);
    });
  });

  describe('User Authentication and Deployment Flow', () => {
    it('should authenticate and create a deployment', async () => {
      // Step 1: Login (redirects to Auth0)
      const loginResponse = await request(app)
        .get('/.netlify/functions/api/api/auth/login');
      
      expect(loginResponse.status).toBe(302);
      expect(loginResponse.header.location).toContain('test-domain.auth0.com/authorize');
      
      // Step 2: Simulate Auth0 callback
      const callbackResponse = await request(app)
        .get('/.netlify/functions/api/api/auth/callback')
        .query({ code: 'test-auth-code', state: Buffer.from(JSON.stringify({ returnTo: 'http://localhost:3000' })).toString('base64') });
      
      expect(callbackResponse.status).toBe(302);
      expect(callbackResponse.header.location).toContain('http://localhost:3000');
      expect(callbackResponse.header.location).toContain('access_token=');
      
      // Step 3: Get user profile
      const profileResponse = await request(app)
        .get('/.netlify/functions/api/api/auth/me');
      
      expect(profileResponse.status).toBe(200);
      expect(profileResponse.body).toHaveProperty('auth0Profile');
      expect(profileResponse.body).toHaveProperty('userProfile');
      
      // Step 4: Create a deployment
      const deploymentData = {
        name: 'Test Deployment',
        description: 'E2E test deployment',
        resources: {
          cpu: 2,
          memory: 4,
          storage: 100
        },
        billing: {
          planId: 'basic',
          amount: 10,
          currency: 'USD',
          interval: 'monthly'
        }
      };
      
      const createDeploymentResponse = await request(app)
        .post('/.netlify/functions/api/api/cloud-user/deployments')
        .send(deploymentData);
      
      expect(createDeploymentResponse.status).toBe(201);
      expect(createDeploymentResponse.body).toHaveProperty('deployment');
      expect(createDeploymentResponse.body.deployment).toHaveProperty('name', 'Test Deployment');
      
      // Step 5: List deployments
      const listDeploymentsResponse = await request(app)
        .get('/.netlify/functions/api/api/cloud-user/deployments');
      
      expect(listDeploymentsResponse.status).toBe(200);
      expect(listDeploymentsResponse.body).toHaveProperty('deployments');
      expect(Array.isArray(listDeploymentsResponse.body.deployments)).toBe(true);
      
      // Step 6: Create payment intent
      const paymentData = {
        amount: 10,
        currency: 'usd',
        description: 'Payment for Test Deployment'
      };
      
      const paymentResponse = await request(app)
        .post('/.netlify/functions/api/api/payments/create-intent')
        .send(paymentData);
      
      expect(paymentResponse.status).toBe(200);
      expect(paymentResponse.body).toHaveProperty('clientSecret');
    });
  });
});