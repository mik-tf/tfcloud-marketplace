import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

// Define schemas and models
const userSchema = new mongoose.Schema({
  auth0Id: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  picture: String,
  createdAt: { type: String, required: true },
  updatedAt: { type: String, required: true },
  settings: {
    notifications: { type: Boolean, default: true }
  }
});

const deploymentSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  userId: { type: String, required: true },
  name: { type: String, required: true },
  description: String,
  status: { 
    type: String, 
    enum: ['pending', 'active', 'failed', 'terminated'],
    required: true 
  },
  createdAt: { type: String, required: true },
  updatedAt: { type: String, required: true },
  resources: {
    cpu: { type: Number, required: true },
    memory: { type: Number, required: true },
    storage: { type: Number, required: true }
  },
  billing: {
    planId: { type: String, required: true },
    amount: { type: Number, required: true },
    currency: { type: String, required: true },
    interval: { 
      type: String, 
      enum: ['hourly', 'daily', 'monthly'],
      required: true 
    }
  }
});

const providerRequestSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  userId: { type: String, required: true },
  status: { 
    type: String, 
    enum: ['pending', 'approved', 'rejected'],
    required: true 
  },
  createdAt: { type: String, required: true },
  updatedAt: { type: String, required: true },
  nodeDetails: {
    location: { type: String, required: true },
    resources: {
      cpu: { type: Number, required: true },
      memory: { type: Number, required: true },
      storage: { type: Number, required: true }
    }
  },
  contactInfo: {
    email: { type: String, required: true },
    phone: String
  }
});

const operatorSettingsSchema = new mongoose.Schema({
  dashboardTitle: { type: String, required: true },
  logoUrl: { type: String, required: true },
  primaryColor: { type: String, required: true },
  secondaryColor: { type: String, required: true },
  featuredApps: [String],
  maintenanceMode: { type: Boolean, default: false },
  createdAt: { type: String, required: true },
  updatedAt: { type: String, required: true }
});

const maintenanceWindowSchema = new mongoose.Schema({
  nodeId: { type: String, required: true },
  startTime: { type: String, required: true },
  endTime: { type: String, required: true },
  description: String,
  createdAt: { type: String, required: true },
  updatedAt: { type: String, required: true }
});

const pricingConfigurationSchema = new mongoose.Schema({
  cpu: {
    pricePerCore: { type: Number, required: true },
    currency: { type: String, required: true }
  },
  memory: {
    pricePerGB: { type: Number, required: true },
    currency: { type: String, required: true }
  },
  storage: {
    pricePerGB: { type: Number, required: true },
    currency: { type: String, required: true }
  },
  discountTiers: [{
    name: { type: String, required: true },
    discount: { type: Number, required: true },
    minimumStake: { type: Number, required: true }
  }],
  createdAt: { type: String, required: true },
  updatedAt: { type: String, required: true }
});

const transactionSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  amount: { type: Number, required: true },
  currency: { type: String, required: true },
  status: { type: String, required: true },
  createdAt: { type: String, required: true }
});

// Create models
const User = mongoose.model('User', userSchema);
const Deployment = mongoose.model('Deployment', deploymentSchema);
const ProviderRequest = mongoose.model('ProviderRequest', providerRequestSchema);
const OperatorSettings = mongoose.model('OperatorSettings', operatorSettingsSchema);
const MaintenanceWindow = mongoose.model('MaintenanceWindow', maintenanceWindowSchema);
const PricingConfiguration = mongoose.model('PricingConfiguration', pricingConfigurationSchema);
const Transaction = mongoose.model('Transaction', transactionSchema);

// Export interfaces (same as in faunaService.ts)
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

export class MongoService {
  constructor() {
    // Connect to MongoDB Atlas
    const uri = process.env.MONGODB_URI || '';
    mongoose.connect(uri)
      .then(() => console.log('Connected to MongoDB Atlas'))
      .catch(err => console.error('Error connecting to MongoDB Atlas:', err));
  }

  /**
   * Create a new user in the database
   */
  public createUser = async (user: User): Promise<User> => {
    try {
      const newUser = new User(user);
      await newUser.save();
      return user;
    } catch (error) {
      console.error('Error creating user in MongoDB:', error);
      throw error;
    }
  };

  /**
   * Get user profile by Auth0 ID
   */
  public getUserProfile = async (auth0Id: string): Promise<User | null> => {
    try {
      const user = await User.findOne({ auth0Id }).lean();
      return user as User | null;
    } catch (error) {
      console.error('Error fetching user from MongoDB:', error);
      throw error;
    }
  };

  /**
   * Update user profile
   */
  public updateUserProfile = async (auth0Id: string, updates: Partial<User>): Promise<User> => {
    try {
      const updatedUser = await User.findOneAndUpdate(
        { auth0Id },
        { ...updates, updatedAt: new Date().toISOString() },
        { new: true }
      ).lean();
      
      if (!updatedUser) {
        throw new Error('User not found');
      }
      
      return updatedUser as User;
    } catch (error) {
      console.error('Error updating user in MongoDB:', error);
      throw error;
    }
  };

  /**
   * Create a new deployment
   */
  public createDeployment = async (deployment: Deployment): Promise<Deployment> => {
    try {
      const newDeployment = new Deployment(deployment);
      await newDeployment.save();
      return deployment;
    } catch (error) {
      console.error('Error creating deployment in MongoDB:', error);
      throw error;
    }
  };

  /**
   * Get deployments by user ID with pagination
   */
  public getUserDeployments = async (
    userId: string,
    page: number = 1,
    limit: number = 10
  ): Promise<{ deployments: Deployment[]; totalCount: number; totalPages: number }> => {
    try {
      const skip = (page - 1) * limit;
      
      const deployments = await Deployment.find({ userId })
        .skip(skip)
        .limit(limit)
        .lean();
      
      const totalCount = await Deployment.countDocuments({ userId });
      const totalPages = Math.ceil(totalCount / limit);
      
      return {
        deployments: deployments as Deployment[],
        totalCount,
        totalPages
      };
    } catch (error) {
      console.error('Error fetching deployments from MongoDB:', error);
      throw error;
    }
  };

  /**
   * Create a new provider request
   */
  public createProviderRequest = async (request: ProviderRequest): Promise<ProviderRequest> => {
    try {
      const newRequest = new ProviderRequest(request);
      await newRequest.save();
      return request;
    } catch (error) {
      console.error('Error creating provider request in MongoDB:', error);
      throw error;
    }
  };

  /**
   * Get provider requests by status with pagination
   */
  public getProviderRequestsByStatus = async (
    status: string,
    page: number = 1,
    limit: number = 10
  ): Promise<{ requests: ProviderRequest[]; totalCount: number; totalPages: number }> => {
    try {
      const skip = (page - 1) * limit;
      
      const requests = await ProviderRequest.find({ status })
        .skip(skip)
        .limit(limit)
        .lean();
      
      const totalCount = await ProviderRequest.countDocuments({ status });
      const totalPages = Math.ceil(totalCount / limit);
      
      return {
        requests: requests as ProviderRequest[],
        totalCount,
        totalPages
      };
    } catch (error) {
      console.error('Error fetching provider requests from MongoDB:', error);
      throw error;
    }
  };
  
  /**
   * Get deployment by ID
   */
  public getDeploymentById = async (deploymentId: string): Promise<Deployment | null> => {
    try {
      const deployment = await Deployment.findOne({ id: deploymentId }).lean();
      return deployment as Deployment | null;
    } catch (error) {
      console.error('Error fetching deployment from MongoDB:', error);
      throw error;
    }
  };
  
  /**
   * Update deployment
   */
  public updateDeployment = async (deploymentId: string, updates: Partial<Deployment>): Promise<Deployment> => {
    try {
      const updatedDeployment = await Deployment.findOneAndUpdate(
        { id: deploymentId },
        { ...updates, updatedAt: new Date().toISOString() },
        { new: true }
      ).lean();
      
      if (!updatedDeployment) {
        throw new Error('Deployment not found');
      }
      
      return updatedDeployment as Deployment;
    } catch (error) {
      console.error('Error updating deployment in MongoDB:', error);
      throw error;
    }
  };
  
  /**
   * Delete deployment
   */
  public deleteDeployment = async (deploymentId: string): Promise<boolean> => {
    try {
      const result = await Deployment.deleteOne({ id: deploymentId });
      return result.deletedCount > 0;
    } catch (error) {
      console.error('Error deleting deployment from MongoDB:', error);
      throw error;
    }
  };
  
  /**
   * Get all users with pagination
   */
  public getAllUsers = async (
    page: number = 1,
    limit: number = 10
  ): Promise<{ users: User[]; totalCount: number; totalPages: number }> => {
    try {
      const skip = (page - 1) * limit;
      
      const users = await User.find()
        .skip(skip)
        .limit(limit)
        .lean();
      
      const totalCount = await User.countDocuments();
      const totalPages = Math.ceil(totalCount / limit);
      
      return {
        users: users as User[],
        totalCount,
        totalPages
      };
    } catch (error) {
      console.error('Error fetching users from MongoDB:', error);
      throw error;
    }
  };
  
  /**
   * Get all deployments with pagination
   */
  public getAllDeployments = async (
    page: number = 1,
    limit: number = 10
  ): Promise<{ deployments: Deployment[]; totalCount: number; totalPages: number }> => {
    try {
      const skip = (page - 1) * limit;
      
      const deployments = await Deployment.find()
        .skip(skip)
        .limit(limit)
        .lean();
      
      const totalCount = await Deployment.countDocuments();
      const totalPages = Math.ceil(totalCount / limit);
      
      return {
        deployments: deployments as Deployment[],
        totalCount,
        totalPages
      };
    } catch (error) {
      console.error('Error fetching deployments from MongoDB:', error);
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
      const updatedRequest = await ProviderRequest.findOneAndUpdate(
        { id: requestId },
        { status, updatedAt: new Date().toISOString() },
        { new: true }
      ).lean();
      
      if (!updatedRequest) {
        throw new Error('Provider request not found');
      }
      
      return updatedRequest as ProviderRequest;
    } catch (error) {
      console.error('Error updating provider request in MongoDB:', error);
      throw error;
    }
  };
}