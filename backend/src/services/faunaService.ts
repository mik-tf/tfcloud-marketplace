import faunadb, { query as q } from 'faunadb';
import dotenv from 'dotenv';

dotenv.config();

export interface User {
  auth0Id: string;
  email: string;
  name: string;
  picture?: string;
  createdAt: string;
  updatedAt: string;
  settings: {
    notifications: boolean;
  };
}

export interface Deployment {
  id: string;
  userId: string;
  name: string;
  description?: string;
  status: 'pending' | 'active' | 'failed' | 'terminated';
  createdAt: string;
  updatedAt: string;
  resources: {
    cpu: number;
    memory: number;
    storage: number;
  };
  billing: {
    planId: string;
    amount: number;
    currency: string;
    interval: 'hourly' | 'daily' | 'monthly';
  };
}

export interface ProviderRequest {
  id: string;
  userId: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  updatedAt: string;
  nodeDetails: {
    location: string;
    resources: {
      cpu: number;
      memory: number;
      storage: number;
    };
  };
  contactInfo: {
    email: string;
    phone?: string;
  };
}

export class FaunaService {
  private client: faunadb.Client;

  constructor() {
    // Initialize FaunaDB client
    this.client = new faunadb.Client({
      secret: process.env.FAUNADB_SECRET || ''
    });
  }

  /**
   * Create a new user in the database
   */
  public createUser = async (user: User): Promise<User> => {
    try {
      const result = await this.client.query<{ data: User }>(
        q.Create(
          q.Collection('users'),
          { data: user }
        )
      );
      
      return result.data;
    } catch (error) {
      console.error('Error creating user in FaunaDB:', error);
      throw error;
    }
  };

  /**
   * Get user profile by Auth0 ID
   */
  public getUserProfile = async (auth0Id: string): Promise<User | null> => {
    try {
      const result = await this.client.query<{ data: User }>(
        q.Get(
          q.Match(q.Index('users_by_auth0_id'), auth0Id)
        )
      );
      
      return result.data;
    } catch (error) {
      // If user not found, return null
      if ((error as any).name === 'NotFound') {
        return null;
      }
      
      console.error('Error fetching user from FaunaDB:', error);
      throw error;
    }
  };

  /**
   * Update user profile
   */
  public updateUserProfile = async (auth0Id: string, updates: Partial<User>): Promise<User> => {
    try {
      // Get the reference to the user document
      const userRef = await this.client.query<{ ref: any }>(
        q.Select(
          'ref',
          q.Get(q.Match(q.Index('users_by_auth0_id'), auth0Id))
        )
      );
      
      // Update the user document
      const result = await this.client.query<{ data: User }>(
        q.Update(
          userRef,
          {
            data: {
              ...updates,
              updatedAt: new Date().toISOString()
            }
          }
        )
      );
      
      return result.data;
    } catch (error) {
      console.error('Error updating user in FaunaDB:', error);
      throw error;
    }
  };

  /**
   * Create a new deployment
   */
  public createDeployment = async (deployment: Deployment): Promise<Deployment> => {
    try {
      const result = await this.client.query<{ data: Deployment }>(
        q.Create(
          q.Collection('deployments'),
          { data: deployment }
        )
      );
      
      return result.data;
    } catch (error) {
      console.error('Error creating deployment in FaunaDB:', error);
      throw error;
    }
  };

  /**
   * Get deployments by user ID
   */
  public getUserDeployments = async (userId: string): Promise<Deployment[]> => {
    try {
      const result = await this.client.query<{ data: { data: Deployment }[] }>(
        q.Map(
          q.Paginate(q.Match(q.Index('deployments_by_user_id'), userId)),
          q.Lambda('deploymentRef', q.Get(q.Var('deploymentRef')))
        )
      );
      
      return result.data.map(item => item.data);
    } catch (error) {
      console.error('Error fetching deployments from FaunaDB:', error);
      throw error;
    }
  };

  /**
   * Create a new provider request
   */
  public createProviderRequest = async (request: ProviderRequest): Promise<ProviderRequest> => {
    try {
      const result = await this.client.query<{ data: ProviderRequest }>(
        q.Create(
          q.Collection('provider_requests'),
          { data: request }
        )
      );
      
      return result.data;
    } catch (error) {
      console.error('Error creating provider request in FaunaDB:', error);
      throw error;
    }
  };

  /**
   * Get provider requests by status
   */
  public getProviderRequestsByStatus = async (status: string): Promise<ProviderRequest[]> => {
    try {
      const result = await this.client.query<{ data: { data: ProviderRequest }[] }>(
        q.Map(
          q.Paginate(q.Match(q.Index('provider_requests_by_status'), status)),
          q.Lambda('requestRef', q.Get(q.Var('requestRef')))
        )
      );
      
      return result.data.map(item => item.data);
    } catch (error) {
      console.error('Error fetching provider requests from FaunaDB:', error);
      throw error;
    }
  };

  /**
   * Update provider request status
   */
  public updateProviderRequestStatus = async (
    requestId: string, 
    status: 'pending' | 'approved' | 'rejected'
  ): Promise<ProviderRequest> => {
    try {
      const result = await this.client.query<{ data: ProviderRequest }>(
        q.Update(
          q.Ref(q.Collection('provider_requests'), requestId),
          {
            data: {
              status,
              updatedAt: new Date().toISOString()
            }
          }
        )
      );
      
      return result.data;
    } catch (error) {
      console.error('Error updating provider request in FaunaDB:', error);
      throw error;
    }
  };
}