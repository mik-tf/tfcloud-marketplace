/**
 * FaunaDB Setup Script
 * 
 * This script sets up the necessary collections and indexes in FaunaDB
 * for the ThreeFold Cloud Marketplace backend.
 * 
 * Usage:
 * 1. Set the FAUNADB_SECRET environment variable
 * 2. Run: node setup-fauna.js
 */

const faunadb = require('faunadb');
const q = faunadb.query;
require('dotenv').config();

// Initialize FaunaDB client
const client = new faunadb.Client({
  secret: process.env.FAUNADB_SECRET
});

// Collections to create
const collections = [
  { name: 'users' },
  { name: 'deployments' },
  { name: 'provider_requests' },
  { name: 'operator_settings' },
  { name: 'maintenance_windows' },
  { name: 'pricing_configurations' },
  { name: 'transactions' }
];

// Indexes to create
const indexes = [
  {
    name: 'users_by_auth0_id',
    source: q.Collection('users'),
    terms: [{ field: ['data', 'auth0Id'] }],
    unique: true
  },
  {
    name: 'users_by_email',
    source: q.Collection('users'),
    terms: [{ field: ['data', 'email'] }],
    unique: true
  },
  {
    name: 'deployments_by_user_id',
    source: q.Collection('deployments'),
    terms: [{ field: ['data', 'userId'] }]
  },
  {
    name: 'deployments_by_status',
    source: q.Collection('deployments'),
    terms: [{ field: ['data', 'status'] }]
  },
  {
    name: 'provider_requests_by_user_id',
    source: q.Collection('provider_requests'),
    terms: [{ field: ['data', 'userId'] }]
  },
  {
    name: 'provider_requests_by_status',
    source: q.Collection('provider_requests'),
    terms: [{ field: ['data', 'status'] }]
  },
  {
    name: 'maintenance_windows_by_node_id',
    source: q.Collection('maintenance_windows'),
    terms: [{ field: ['data', 'nodeId'] }]
  },
  {
    name: 'transactions_by_user_id',
    source: q.Collection('transactions'),
    terms: [{ field: ['data', 'userId'] }]
  }
];

/**
 * Create collections
 */
async function createCollections() {
  console.log('Creating collections...');
  
  for (const collection of collections) {
    try {
      await client.query(
        q.If(
          q.Exists(q.Collection(collection.name)),
          true,
          q.CreateCollection({ name: collection.name })
        )
      );
      console.log(`Collection '${collection.name}' created or already exists`);
    } catch (error) {
      console.error(`Error creating collection '${collection.name}':`, error);
    }
  }
}

/**
 * Create indexes
 */
async function createIndexes() {
  console.log('Creating indexes...');
  
  for (const index of indexes) {
    try {
      await client.query(
        q.If(
          q.Exists(q.Index(index.name)),
          true,
          q.CreateIndex(index)
        )
      );
      console.log(`Index '${index.name}' created or already exists`);
    } catch (error) {
      console.error(`Error creating index '${index.name}':`, error);
    }
  }
}

/**
 * Create initial operator settings
 */
async function createInitialSettings() {
  console.log('Creating initial operator settings...');
  
  try {
    const exists = await client.query(
      q.Exists(
        q.Match(q.Index('all_operator_settings'))
      )
    ).catch(() => false);
    
    if (!exists) {
      await client.query(
        q.Create(
          q.Collection('operator_settings'),
          {
            data: {
              dashboardTitle: 'ThreeFold Cloud Marketplace',
              logoUrl: 'https://example.com/logo.png',
              primaryColor: '#3498db',
              secondaryColor: '#2ecc71',
              featuredApps: [],
              maintenanceMode: false,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString()
            }
          }
        )
      );
      console.log('Initial operator settings created');
    } else {
      console.log('Operator settings already exist');
    }
  } catch (error) {
    console.error('Error creating initial operator settings:', error);
  }
}

/**
 * Create initial pricing configuration
 */
async function createInitialPricing() {
  console.log('Creating initial pricing configuration...');
  
  try {
    const exists = await client.query(
      q.Exists(
        q.Match(q.Index('all_pricing_configurations'))
      )
    ).catch(() => false);
    
    if (!exists) {
      await client.query(
        q.Create(
          q.Collection('pricing_configurations'),
          {
            data: {
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
            }
          }
        )
      );
      console.log('Initial pricing configuration created');
    } else {
      console.log('Pricing configuration already exists');
    }
  } catch (error) {
    console.error('Error creating initial pricing configuration:', error);
  }
}

/**
 * Main function
 */
async function main() {
  try {
    console.log('Setting up FaunaDB for ThreeFold Cloud Marketplace...');
    
    // Create all_operator_settings index for checking if settings exist
    try {
      await client.query(
        q.If(
          q.Exists(q.Index('all_operator_settings')),
          true,
          q.CreateIndex({
            name: 'all_operator_settings',
            source: q.Collection('operator_settings')
          })
        )
      );
    } catch (error) {
      console.error('Error creating all_operator_settings index:', error);
    }
    
    // Create all_pricing_configurations index for checking if pricing exists
    try {
      await client.query(
        q.If(
          q.Exists(q.Index('all_pricing_configurations')),
          true,
          q.CreateIndex({
            name: 'all_pricing_configurations',
            source: q.Collection('pricing_configurations')
          })
        )
      );
    } catch (error) {
      console.error('Error creating all_pricing_configurations index:', error);
    }
    
    // Create collections and indexes
    await createCollections();
    await createIndexes();
    
    // Create initial data
    await createInitialSettings();
    await createInitialPricing();
    
    console.log('FaunaDB setup completed successfully!');
  } catch (error) {
    console.error('Error setting up FaunaDB:', error);
  }
}

// Run the script
main().catch(console.error);