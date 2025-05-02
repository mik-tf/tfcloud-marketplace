import express, { Request, Response } from 'express';
import serverless from 'serverless-http';
import dotenv from 'dotenv';
import authRoutes from '../src/routes/auth';
import cloudUserRoutes from '../src/routes/cloud-user';
import cloudProviderRoutes from '../src/routes/cloud-provider';
import cloudOperatorRoutes from '../src/routes/cloud-operator';
import paymentRoutes from '../src/routes/payments';
import { errorHandler } from '../src/middleware/errorHandler';
import { jwtCheck } from '../src/middleware/auth';
import { ipRateLimiter, authRateLimiter, paymentRateLimiter } from '../src/middleware/rateLimiter';
import { httpLogger, errorLogger } from '../src/middleware/logger';
import logger from '../src/utils/logger';

// Load environment variables
dotenv.config();

// Create Express app
const app = express();

// Middleware
app.use(httpLogger);
app.use(ipRateLimiter);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS headers
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', process.env.FRONTEND_URL);
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.header('Access-Control-Allow-Credentials', 'true');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  next();
});

// Health check endpoint
app.get('/api/health', (req: Request, res: Response) => {
  res.status(200).json({ status: 'ok', environment: process.env.NODE_ENV });
});

// API routes
app.use('/api/auth', authRateLimiter, authRoutes);
app.use('/api/cloud-user', jwtCheck, cloudUserRoutes);
app.use('/api/cloud-provider', jwtCheck, cloudProviderRoutes);
app.use('/api/cloud-operator', jwtCheck, cloudOperatorRoutes);
app.use('/api/payments', jwtCheck, paymentRateLimiter, paymentRoutes);

// Error logging middleware
app.use(errorLogger);

// Error handling middleware
app.use(errorHandler);

// Log application startup
logger.info(`API server initialized in ${process.env.NODE_ENV || 'development'} mode`);

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({ error: 'Not Found' });
});

// Export the serverless function
export const handler = serverless(app);