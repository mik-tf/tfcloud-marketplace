import { expressjwt as jwt } from 'express-jwt';
import jwksRsa from 'jwks-rsa';
import { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';

dotenv.config();

// Auth0 configuration
const domain = process.env.AUTH0_DOMAIN || '';
const audience = process.env.AUTH0_AUDIENCE || '';

// JWT validation middleware
export const jwtCheck = jwt({
  secret: jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: `https://${domain}/.well-known/jwks.json`
  }),
  audience: audience,
  issuer: `https://${domain}/`,
  algorithms: ['RS256']
});

// Role-based access control middleware
export const checkRole = (role: string) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = req.auth;
    
    // Check if user exists and has the required role
    if (user && user.permissions && user.permissions.includes(role)) {
      return next();
    }
    
    return res.status(403).json({ error: 'Insufficient permissions' });
  };
};

// Role constants
export const ROLES = {
  CLOUD_USER: 'cloud-user',
  CLOUD_PROVIDER: 'cloud-provider',
  CLOUD_OPERATOR: 'cloud-operator'
};