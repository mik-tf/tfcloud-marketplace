import { Request, Response, NextFunction } from 'express';
import { RateLimiterMemory } from 'rate-limiter-flexible';

/**
 * Rate limiter options
 */
const options = {
  points: 100, // Number of points
  duration: 60, // Per 60 seconds
};

/**
 * Create rate limiter instance
 */
const rateLimiter = new RateLimiterMemory(options);

/**
 * IP-based rate limiting middleware
 */
export const ipRateLimiter = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Get client IP
    const clientIp = req.ip || req.headers['x-forwarded-for'] || 'unknown';
    
    // Consume points
    await rateLimiter.consume(clientIp);
    
    next();
  } catch (error) {
    console.error('Rate limit exceeded:', req.ip);
    res.status(429).json({
      error: 'Too many requests',
      message: 'Please try again later'
    });
  }
};

/**
 * Create a route-specific rate limiter
 */
export const createRouteLimiter = (points: number, duration: number) => {
  const routeLimiter = new RateLimiterMemory({
    points,
    duration
  });
  
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Get client IP
      const clientIp = req.ip || req.headers['x-forwarded-for'] || 'unknown';
      
      // Create a key that combines IP and route
      const key = `${clientIp}:${req.path}`;
      
      // Consume points
      await routeLimiter.consume(key);
      
      next();
    } catch (error) {
      console.error('Route rate limit exceeded:', req.ip, req.path);
      res.status(429).json({
        error: 'Too many requests',
        message: 'Please try again later'
      });
    }
  };
};

/**
 * Auth endpoint rate limiter (more restrictive)
 */
export const authRateLimiter = createRouteLimiter(20, 60);

/**
 * Payment endpoint rate limiter (more restrictive)
 */
export const paymentRateLimiter = createRouteLimiter(30, 60);