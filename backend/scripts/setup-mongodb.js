/**
 * MongoDB Setup Script
 * 
 * This script sets up the necessary collections and indexes in MongoDB Atlas
 * for the ThreeFold Cloud Marketplace backend.
 * 
 * Usage:
 * 1. Set the MONGODB_URI environment variable
 * 2. Run: node setup-mongodb.js
 */

const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

// Connect to MongoDB
const uri = process.env.MONGODB_URI;
if (!uri) {
  console.error('MONGODB_URI environment variable is not set');
  process.exit(1);
}

mongoose.connect(uri)
  .then(() => console.log('Connected to MongoDB Atlas'))
  .catch(err => {
    console.error('Error connecting to MongoDB Atlas:', err);
    process.exit(1);
  });

// Define schemas (simplified versions of what's in the service)
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

// Create indexes
async function createIndexes() {
  console.log('Creating indexes...');
  
  try {
    // Create indexes for User collection
    await User.collection.createIndex({ auth0Id: 1 }, { unique: true });
    await User.collection.createIndex({ email: 1 }, { unique: true });
    
    // Create indexes for Deployment collection
    await Deployment.collection.createIndex({ id: 1 }, { unique: true });
    await Deployment.collection.createIndex({ userId: 1 });
    await Deployment.collection.createIndex({ status: 1 });
    
    // Create indexes for ProviderRequest collection
    await ProviderRequest.collection.createIndex({ id: 1 }, { unique: true });
    await ProviderRequest.collection.createIndex({ userId: 1 });
    await ProviderRequest.collection.createIndex({ status: 1 });
    
    // Create indexes for MaintenanceWindow collection
    await MaintenanceWindow.collection.createIndex({ nodeId: 1 });
    
    // Create indexes for Transaction collection
    await Transaction.collection.createIndex({ userId: 1 });
    
    console.log('Indexes created successfully');
  } catch (error) {
    console.error('Error creating indexes:', error);
  }
}

// Create initial operator settings
async function createInitialSettings() {
  console.log('Creating initial operator settings...');
  
  try {
    const existingSettings = await OperatorSettings.findOne();
    
    if (!existingSettings) {
      await OperatorSettings.create({
        dashboardTitle: 'ThreeFold Cloud Marketplace',
        logoUrl: 'https://example.com/logo.png',
        primaryColor: '#3498db',
        secondaryColor: '#2ecc71',
        featuredApps: [],
        maintenanceMode: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
      
      console.log('Initial operator settings created');
    } else {
      console.log('Operator settings already exist');
    }
  } catch (error) {
    console.error('Error creating initial operator settings:', error);
  }
}

// Create initial pricing configuration
async function createInitialPricing() {
  console.log('Creating initial pricing configuration...');
  
  try {
    const existingPricing = await PricingConfiguration.findOne();
    
    if (!existingPricing) {
      await PricingConfiguration.create({
        cpu: {
          pricePerCore: 5,
          currency: 'USD'
        },
        memory: {
          pricePerGB: 2,
          currency: 'USD'
        },
        storage: {
          pricePerGB: 0.1,
          currency: 'USD'
        },
        discountTiers: [
          {
            name: 'Standard',
            discount: 0,
            minimumStake: 0
          },
          {
            name: 'Silver',
            discount: 10,
            minimumStake: 1000
          },
          {
            name: 'Gold',
            discount: 20,
            minimumStake: 5000
          },
          {
            name: 'Platinum',
            discount: 30,
            minimumStake: 10000
          }
        ],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
      
      console.log('Initial pricing configuration created');
    } else {
      console.log('Pricing configuration already exists');
    }
  } catch (error) {
    console.error('Error creating initial pricing configuration:', error);
  }
}

// Main function
async function main() {
  try {
    console.log('Setting up MongoDB for ThreeFold Cloud Marketplace...');
    
    // Create indexes
    await createIndexes();
    
    // Create initial data
    await createInitialSettings();
    await createInitialPricing();
    
    console.log('MongoDB setup completed successfully!');
  } catch (error) {
    console.error('Error setting up MongoDB:', error);
  } finally {
    // Close the connection
    mongoose.connection.close();
  }
}

// Run the script
main().catch(console.error);