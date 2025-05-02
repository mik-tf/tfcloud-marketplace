import dotenv from 'dotenv';
import { jest } from '@jest/globals';

// Load environment variables from .env.test file if it exists
dotenv.config({ path: '.env.test' });

// Mock FaunaDB
jest.mock('faunadb', () => {
  const originalModule = jest.requireActual('faunadb');
  
  return {
    __esModule: true,
    ...originalModule,
    Client: jest.fn().mockImplementation(() => ({
      query: jest.fn().mockImplementation(() => Promise.resolve({}))
    }))
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