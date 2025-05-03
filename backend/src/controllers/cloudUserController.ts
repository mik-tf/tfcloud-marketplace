import { Request, Response } from 'express';
import { MongoService, Deployment, User } from '../services/mongoService';
import { v4 as uuidv4 } from 'uuid';

export class CloudUserController {
  private mongoService: MongoService;

  constructor() {
    this.mongoService = new MongoService();
  }

  /**
   * Get all deployments for the authenticated user
   */
  public getDeployments = async (req: Request, res: Response) => {
    try {
      const userId = req.auth?.sub;
      
      if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      // Parse pagination parameters
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      
      // Validate pagination parameters
      if (page < 1 || limit < 1 || limit > 100) {
        return res.status(400).json({
          error: 'Invalid pagination parameters',
          message: 'Page must be >= 1 and limit must be between 1 and 100'
        });
      }

      const result = await this.mongoService.getUserDeployments(userId, page, limit);
      
      res.status(200).json({
        deployments: result.deployments,
        pagination: {
          page,
          limit,
          totalCount: result.totalCount,
          totalPages: result.totalPages
        }
      });
    } catch (error) {
      console.error('Error fetching deployments:', error);
      res.status(500).json({ error: 'Failed to fetch deployments' });
    }
  };

  /**
   * Create a new deployment
   */
  public createDeployment = async (req: Request, res: Response) => {
    try {
      const userId = req.auth?.sub;
      
      if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const {
        name,
        description,
        resources,
        billing
      } = req.body;

      // Validate required fields
      if (!name || !resources || !billing) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      // Create new deployment
      const newDeployment: Deployment = {
        id: uuidv4(),
        userId,
        name,
        description,
        status: 'pending',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        resources,
        billing
      };

      const deployment = await this.mongoService.createDeployment(newDeployment);
      
      res.status(201).json({ deployment });
    } catch (error) {
      console.error('Error creating deployment:', error);
      res.status(500).json({ error: 'Failed to create deployment' });
    }
  };

  /**
   * Get details of a specific deployment
   */
  public getDeploymentDetails = async (req: Request, res: Response) => {
    try {
      const userId = req.auth?.sub;
      const deploymentId = req.params.id;
      
      if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      // Get deployment by ID
      const deployment = await this.mongoService.getDeploymentById(deploymentId);
      
      if (!deployment) {
        return res.status(404).json({ error: 'Deployment not found' });
      }
      
      // Check if the deployment belongs to the user
      if (deployment.userId !== userId) {
        return res.status(403).json({ error: 'Forbidden' });
      }
      
      res.status(200).json({ deployment });
    } catch (error) {
      console.error('Error fetching deployment details:', error);
      res.status(500).json({ error: 'Failed to fetch deployment details' });
    }
  };

  /**
   * Update a deployment
   */
  public updateDeployment = async (req: Request, res: Response) => {
    try {
      const userId = req.auth?.sub;
      const deploymentId = req.params.id;
      
      if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      // Get deployment by ID
      const deployment = await this.mongoService.getDeploymentById(deploymentId);
      
      if (!deployment) {
        return res.status(404).json({ error: 'Deployment not found' });
      }
      
      // Check if the deployment belongs to the user
      if (deployment.userId !== userId) {
        return res.status(403).json({ error: 'Forbidden' });
      }
      
      // Extract update data
      const { name, description, resources, billing } = req.body;
      
      // Create update object
      const updates: Partial<Deployment> = {};
      
      if (name !== undefined) updates.name = name;
      if (description !== undefined) updates.description = description;
      if (resources !== undefined) updates.resources = resources;
      if (billing !== undefined) updates.billing = billing;
      
      // Update deployment
      const updatedDeployment = await this.mongoService.updateDeployment(deploymentId, updates);
      
      res.status(200).json({ deployment: updatedDeployment });
    } catch (error) {
      console.error('Error updating deployment:', error);
      res.status(500).json({ error: 'Failed to update deployment' });
    }
  };

  /**
   * Delete a deployment
   */
  public deleteDeployment = async (req: Request, res: Response) => {
    try {
      const userId = req.auth?.sub;
      const deploymentId = req.params.id;
      
      if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      // Get deployment by ID
      const deployment = await this.mongoService.getDeploymentById(deploymentId);
      
      if (!deployment) {
        return res.status(404).json({ error: 'Deployment not found' });
      }
      
      // Check if the deployment belongs to the user
      if (deployment.userId !== userId) {
        return res.status(403).json({ error: 'Forbidden' });
      }
      
      // Delete deployment
      await this.mongoService.deleteDeployment(deploymentId);
      
      res.status(200).json({
        success: true,
        message: `Deployment "${deployment.name}" deleted successfully`
      });
    } catch (error) {
      console.error('Error deleting deployment:', error);
      res.status(500).json({ error: 'Failed to delete deployment' });
    }
  };

  /**
   * Get user profile
   */
  public getUserProfile = async (req: Request, res: Response) => {
    try {
      const userId = req.auth?.sub;
      
      if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const userProfile = await this.mongoService.getUserProfile(userId);
      
      if (!userProfile) {
        return res.status(404).json({ error: 'User profile not found' });
      }
      
      res.status(200).json({ userProfile });
    } catch (error) {
      console.error('Error fetching user profile:', error);
      res.status(500).json({ error: 'Failed to fetch user profile' });
    }
  };

  /**
   * Update user profile
   */
  public updateUserProfile = async (req: Request, res: Response) => {
    try {
      const userId = req.auth?.sub;
      
      if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const { name, settings } = req.body;
      
      // Update user profile
      const updatedProfile = await this.mongoService.updateUserProfile(userId, {
        name,
        settings,
        updatedAt: new Date().toISOString()
      });
      
      res.status(200).json({ userProfile: updatedProfile });
    } catch (error) {
      console.error('Error updating user profile:', error);
      res.status(500).json({ error: 'Failed to update user profile' });
    }
  };
}