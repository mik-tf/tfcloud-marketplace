import dotenv from 'dotenv';
import { jest } from '@jest/globals';

// Load environment variables from .env.test file if it exists
dotenv.config({ path: '.env.test' });

// Mock Mongoose
jest.mock('mongoose', () => {
  const originalModule = jest.requireActual('mongoose');
  
  // Mock Schema class
  const mockSchema = jest.fn().mockImplementation(() => ({
    index: jest.fn().mockReturnThis()
  }));
  
  // Mock model function
  const mockModel = jest.fn().mockImplementation(() => ({
    find: jest.fn().mockReturnValue({
      skip: jest.fn().mockReturnThis(),
      limit: jest.fn().mockReturnThis(),
      lean: jest.fn().mockResolvedValue([])
    }),
    findOne: jest.fn().mockReturnValue({
      lean: jest.fn().mockResolvedValue(null)
    }),
    findOneAndUpdate: jest.fn().mockReturnValue({
      lean: jest.fn().mockResolvedValue({})
    }),
    countDocuments: jest.fn().mockResolvedValue(0),
    deleteOne: jest.fn().mockResolvedValue({ deletedCount: 1 }),
    save: jest.fn().mockResolvedValue({}),
    collection: {
      createIndex: jest.fn().mockResolvedValue({})
    }
  }));
  
  // Mock document instance
  const mockDocument = {
    save: jest.fn().mockResolvedValue({})
  };
  
  return {
    __esModule: true,
    ...originalModule,
    connect: jest.fn().mockResolvedValue({}),
    Schema: mockSchema,
    model: mockModel,
    models: {},
    Document: mockDocument
  };
});

// Mock Auth0
jest.mock('auth0', () => {
  return {
    __esModule: true,
    AuthenticationClient: jest.fn().mockImplementation(() => ({
      oauth: {
        authorizationCodeGrant: jest.fn().mockImplementation(() => Promise.resolve({
          access_token: 'mock-access-token',
          id_token: 'mock-id-token',
          expires_in: 86400
        }))
      },
      getProfile: jest.fn().mockImplementation(() => Promise.resolve({
        sub: 'auth0|123456789',
        email: 'test@example.com',
        name: 'Test User',
        picture: 'https://example.com/picture.jpg'
      }))
    })),
    ManagementClient: jest.fn().mockImplementation(() => ({
      getUser: jest.fn().mockImplementation(() => Promise.resolve({
        user_id: 'auth0|123456789',
        email: 'test@example.com',
        name: 'Test User'
      }))
    }))
  };
});

// Mock Stripe
jest.mock('stripe', () => {
  return jest.fn().mockImplementation(() => ({
    paymentIntents: {
      create: jest.fn().mockImplementation(() => Promise.resolve({
        id: 'pi_mock_id',
        client_secret: 'pi_mock_secret',
        status: 'requires_payment_method'
      }))
    },
    webhooks: {
      constructEvent: jest.fn().mockImplementation(() => ({
        type: 'payment_intent.succeeded',
        data: {
          object: {
            id: 'pi_mock_id',
            status: 'succeeded',
            metadata: {
              userId: 'auth0|123456789'
            }
          }
        }
      }))
    }
  }));
});

// Mock Express
jest.mock('express', () => {
  const originalModule = jest.requireActual('express');
  const mockResponse = () => {
    const res: any = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    res.redirect = jest.fn().mockReturnValue(res);
    res.header = jest.fn().mockReturnValue(res);
    return res;
  };
  
  const mockRequest = () => {
    return {
      auth: {
        sub: 'auth0|123456789'
      },
      query: {},
      body: {},
      params: {},
      headers: {}
    };
  };
  
  return {
    __esModule: true,
    ...originalModule,
    mockRequest,
    mockResponse
  };
});

// Global test environment setup
global.beforeEach(() => {
  jest.clearAllMocks();
});