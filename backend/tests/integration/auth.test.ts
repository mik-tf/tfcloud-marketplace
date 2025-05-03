import request from 'supertest';
import express from 'express';
import authRoutes from '../../src/routes/auth';
import { jwtCheck } from '../../src/middleware/auth';
import { errorHandler } from '../../src/middleware/errorHandler';

// Mock middleware
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

describe('Auth Routes Integration Tests', () => {
  let app: express.Application;

  beforeEach(() => {
    // Create a new Express app for each test
    app = express();
    app.use(express.json());
    app.use('/api/auth', authRoutes);
    app.use(errorHandler);
  });

  describe('GET /api/auth/login', () => {
    it('should redirect to Auth0 login page', async () => {
      // Set environment variables for test
      process.env.AUTH0_DOMAIN = 'test-domain.auth0.com';
      process.env.AUTH0_CLIENT_ID = 'test-client-id';
      process.env.AUTH0_CALLBACK_URL = 'http://localhost:8888/api/auth/callback';
      process.env.AUTH0_AUDIENCE = 'https://test-api';
      process.env.FRONTEND_URL = 'http://localhost:3000';
      
      const response = await request(app).get('/api/auth/login');
      
      expect(response.status).toBe(302); // Redirect status code
      expect(response.header.location).toContain('test-domain.auth0.com/authorize');
    });
  });

  describe('GET /api/auth/session', () => {
    it('should return session information when authenticated', async () => {
      const response = await request(app).get('/api/auth/session');
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('authenticated', true);
      expect(response.body).toHaveProperty('user');
      expect(response.body.user).toHaveProperty('sub', 'auth0|123456789');
    });
  });

  describe('GET /api/auth/me', () => {
    it('should return user profile information when authenticated', async () => {
      // Mock Auth0 management client and FaunaService
      jest.mock('../../src/controllers/authController', () => {
        const originalModule = jest.requireActual('../../src/controllers/authController');
        
        return {
          ...originalModule,
          AuthController: jest.fn().mockImplementation(() => ({
            getUserInfo: jest.fn().mockImplementation((req, res) => {
              res.status(200).json({
                auth0Profile: {
                  user_id: 'auth0|123456789',
                  email: 'test@example.com',
                  name: 'Test User'
                },
                userProfile: {
                  auth0Id: 'auth0|123456789',
                  email: 'test@example.com',
                  name: 'Test User',
                  settings: { notifications: true }
                }
              });
            })
          }))
        };
      });
      
      const response = await request(app).get('/api/auth/me');
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('auth0Profile');
      expect(response.body).toHaveProperty('userProfile');
    });
  });
});