import { Request, Response } from 'express';
import { AuthController } from '../../src/controllers/authController';
import { FaunaService } from '../../src/services/faunaService';

// Mock FaunaService
jest.mock('../../src/services/faunaService');

describe('AuthController', () => {
  let authController: AuthController;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockFaunaService: jest.Mocked<FaunaService>;

  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();
    
    // Setup mock request and response
    mockRequest = {
      query: {},
      auth: {
        sub: 'auth0|123456789'
      }
    };
    
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
      redirect: jest.fn().mockReturnThis()
    };
    
    // Setup mock FaunaService
    mockFaunaService = new FaunaService() as jest.Mocked<FaunaService>;
    mockFaunaService.getUserProfile = jest.fn().mockResolvedValue({
      auth0Id: 'auth0|123456789',
      email: 'test@example.com',
      name: 'Test User',
      picture: 'https://example.com/picture.jpg',
      createdAt: '2023-01-01T00:00:00.000Z',
      updatedAt: '2023-01-01T00:00:00.000Z',
      settings: {
        notifications: true
      }
    });
    
    // Initialize controller with mocked dependencies
    authController = new AuthController();
    (authController as any).faunaService = mockFaunaService;
  });

  describe('login', () => {
    it('should redirect to Auth0 authorization URL', () => {
      // Set environment variables for test
      process.env.AUTH0_DOMAIN = 'test-domain.auth0.com';
      process.env.AUTH0_CLIENT_ID = 'test-client-id';
      process.env.AUTH0_CALLBACK_URL = 'http://localhost:8888/api/auth/callback';
      process.env.AUTH0_AUDIENCE = 'https://test-api';
      process.env.FRONTEND_URL = 'http://localhost:3000';
      
      // Call the method
      authController.login(mockRequest as Request, mockResponse as Response);
      
      // Assertions
      expect(mockResponse.redirect).toHaveBeenCalled();
      const redirectUrl = (mockResponse.redirect as jest.Mock).mock.calls[0][0];
      expect(redirectUrl).toContain('test-domain.auth0.com/authorize');
      expect(redirectUrl).toContain('client_id=test-client-id');
      expect(redirectUrl).toContain('redirect_uri=http%3A%2F%2Flocalhost%3A8888%2Fapi%2Fauth%2Fcallback');
    });
  });

  describe('getSession', () => {
    it('should return authenticated status and user info', () => {
      // Call the method
      authController.getSession(mockRequest as Request, mockResponse as Response);
      
      // Assertions
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        authenticated: true,
        user: { sub: 'auth0|123456789' }
      });
    });
  });

  describe('getUserInfo', () => {
    it('should return user profile information', async () => {
      // Setup Auth0 management client mock
      (authController as any).management = {
        getUser: jest.fn().mockResolvedValue({
          user_id: 'auth0|123456789',
          email: 'test@example.com',
          name: 'Test User'
        })
      };
      
      // Call the method
      await authController.getUserInfo(mockRequest as Request, mockResponse as Response);
      
      // Assertions
      expect(mockFaunaService.getUserProfile).toHaveBeenCalledWith('auth0|123456789');
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        auth0Profile: {
          user_id: 'auth0|123456789',
          email: 'test@example.com',
          name: 'Test User'
        },
        userProfile: {
          auth0Id: 'auth0|123456789',
          email: 'test@example.com',
          name: 'Test User',
          picture: 'https://example.com/picture.jpg',
          createdAt: '2023-01-01T00:00:00.000Z',
          updatedAt: '2023-01-01T00:00:00.000Z',
          settings: {
            notifications: true
          }
        }
      });
    });

    it('should return 401 if user is not authenticated', async () => {
      // Setup request without auth
      mockRequest.auth = undefined;
      
      // Call the method
      await authController.getUserInfo(mockRequest as Request, mockResponse as Response);
      
      // Assertions
      expect(mockResponse.status).toHaveBeenCalledWith(401);
      expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Unauthorized' });
    });
  });
});