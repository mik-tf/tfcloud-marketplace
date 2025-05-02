import { Request, Response } from 'express';
import { AuthenticationClient, ManagementClient } from 'auth0';
import dotenv from 'dotenv';
import { FaunaService } from '../services/faunaService';

dotenv.config();

export class AuthController {
  private auth0: AuthenticationClient;
  private management: ManagementClient;
  private faunaService: FaunaService;

  constructor() {
    // Initialize Auth0 clients
    this.auth0 = new AuthenticationClient({
      domain: process.env.AUTH0_DOMAIN || '',
      clientId: process.env.AUTH0_CLIENT_ID || '',
      clientSecret: process.env.AUTH0_CLIENT_SECRET || ''
    });

    this.management = new ManagementClient({
      domain: process.env.AUTH0_DOMAIN || '',
      clientId: process.env.AUTH0_CLIENT_ID || '',
      clientSecret: process.env.AUTH0_CLIENT_SECRET || '',
      scope: 'read:users update:users'
    });

    // Initialize FaunaDB service
    this.faunaService = new FaunaService();
  }

  /**
   * Redirect to Auth0 login page
   */
  public login = (req: Request, res: Response) => {
    const returnTo = req.query.returnTo as string || process.env.FRONTEND_URL;
    const state = Buffer.from(JSON.stringify({ returnTo })).toString('base64');

    const authorizationUrl = `https://${process.env.AUTH0_DOMAIN}/authorize?` +
      `response_type=code&` +
      `client_id=${process.env.AUTH0_CLIENT_ID}&` +
      `redirect_uri=${encodeURIComponent(process.env.AUTH0_CALLBACK_URL || '')}&` +
      `scope=openid profile email&` +
      `audience=${encodeURIComponent(process.env.AUTH0_AUDIENCE || '')}&` +
      `state=${state}`;

    res.redirect(authorizationUrl);
  };

  /**
   * Handle Auth0 callback after login
   */
  public callback = async (req: Request, res: Response) => {
    try {
      const { code, state } = req.query;
      
      if (!code || !state) {
        return res.status(400).json({ error: 'Missing required parameters' });
      }

      // Exchange authorization code for tokens
      const tokenResponse = await this.auth0.oauth.authorizationCodeGrant({
        code: code as string,
        redirect_uri: process.env.AUTH0_CALLBACK_URL || ''
      });

      // Get user info
      const userInfo = await this.auth0.getProfile(tokenResponse.access_token);
      
      // Check if user exists in FaunaDB, create if not
      await this.ensureUserInDatabase(userInfo);

      // Parse state to get returnTo URL
      const stateParams = JSON.parse(Buffer.from(state as string, 'base64').toString());
      const returnTo = stateParams.returnTo || process.env.FRONTEND_URL;

      // Redirect to frontend with tokens
      res.redirect(`${returnTo}?` +
        `access_token=${tokenResponse.access_token}&` +
        `id_token=${tokenResponse.id_token}&` +
        `expires_in=${tokenResponse.expires_in}`);
    } catch (error) {
      console.error('Auth0 callback error:', error);
      res.status(500).json({ error: 'Authentication failed' });
    }
  };

  /**
   * Log out user and clear session
   */
  public logout = (req: Request, res: Response) => {
    const returnTo = req.query.returnTo as string || process.env.FRONTEND_URL;
    
    const logoutUrl = `https://${process.env.AUTH0_DOMAIN}/v2/logout?` +
      `client_id=${process.env.AUTH0_CLIENT_ID}&` +
      `returnTo=${encodeURIComponent(returnTo)}`;

    res.redirect(logoutUrl);
  };

  /**
   * Get current user session information
   */
  public getSession = (req: Request, res: Response) => {
    // This endpoint will be protected by jwtCheck middleware
    // so if we get here, the user is authenticated
    res.status(200).json({ 
      authenticated: true,
      user: req.auth
    });
  };

  /**
   * Get user profile information
   */
  public getUserInfo = async (req: Request, res: Response) => {
    try {
      // This endpoint will be protected by jwtCheck middleware
      const userId = req.auth?.sub;
      
      if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      // Get user from Auth0
      const user = await this.management.getUser({ id: userId });
      
      // Get user from FaunaDB to get additional profile data
      const userProfile = await this.faunaService.getUserProfile(userId);

      res.status(200).json({
        auth0Profile: user,
        userProfile: userProfile
      });
    } catch (error) {
      console.error('Error fetching user info:', error);
      res.status(500).json({ error: 'Failed to fetch user information' });
    }
  };

  /**
   * Ensure user exists in FaunaDB
   */
  private ensureUserInDatabase = async (userInfo: any) => {
    try {
      // Check if user exists
      const existingUser = await this.faunaService.getUserProfile(userInfo.sub);
      
      if (!existingUser) {
        // Create new user in FaunaDB
        await this.faunaService.createUser({
          auth0Id: userInfo.sub,
          email: userInfo.email,
          name: userInfo.name,
          picture: userInfo.picture,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          settings: {
            notifications: true
          }
        });
      }
    } catch (error) {
      console.error('Error ensuring user in database:', error);
      throw error;
    }
  };
}