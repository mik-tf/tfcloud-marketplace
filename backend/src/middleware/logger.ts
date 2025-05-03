import { Request, Response, NextFunction } from 'express';
import logger from '../utils/logger';

/**
 * HTTP request logger middleware
 */
export const httpLogger = (req: Request, res: Response, next: NextFunction) => {
  // Start timer
  const start = Date.now();
  
  // Log request
  logger.http(`${req.method} ${req.url} [STARTED]`);
  
  // Log request body if present
  if (req.body && Object.keys(req.body).length > 0) {
    // Sanitize sensitive data
    const sanitizedBody = { ...req.body };
    
    // Remove sensitive fields
    if (sanitizedBody.password) sanitizedBody.password = '[REDACTED]';
    if (sanitizedBody.token) sanitizedBody.token = '[REDACTED]';
    if (sanitizedBody.accessToken) sanitizedBody.accessToken = '[REDACTED]';
    if (sanitizedBody.refreshToken) sanitizedBody.refreshToken = '[REDACTED]';
    if (sanitizedBody.card) sanitizedBody.card = '[REDACTED]';
    
    logger.debug(`Request Body: ${JSON.stringify(sanitizedBody)}`);
  }
  
  // Override response methods to log response
  const originalEnd = res.end;
  const originalJson = res.json;
  const originalSend = res.send;
  
  res.end = function(chunk?: any, encoding?: string, callback?: () => void): Response {
    const duration = Date.now() - start;
    logger.http(`${req.method} ${req.url} [${res.statusCode}] ${duration}ms`);
    return originalEnd.call(this, chunk, encoding, callback);
  };
  
  res.json = function(body?: any): Response {
    if (body) {
      // Sanitize sensitive data in response
      const sanitizedBody = { ...body };
      
      // Remove sensitive fields
      if (sanitizedBody.password) sanitizedBody.password = '[REDACTED]';
      if (sanitizedBody.token) sanitizedBody.token = '[REDACTED]';
      if (sanitizedBody.accessToken) sanitizedBody.accessToken = '[REDACTED]';
      if (sanitizedBody.refreshToken) sanitizedBody.refreshToken = '[REDACTED]';
      
      logger.debug(`Response Body: ${JSON.stringify(sanitizedBody)}`);
    }
    
    return originalJson.call(this, body);
  };
  
  res.send = function(body?: any): Response {
    return originalSend.call(this, body);
  };
  
  next();
};

/**
 * Error logger middleware
 */
export const errorLogger = (err: any, req: Request, res: Response, next: NextFunction) => {
  // Log error
  logger.error(`${req.method} ${req.url} [ERROR] ${err.message}`);
  logger.error(err.stack);
  
  // Pass to next error handler
  next(err);
};