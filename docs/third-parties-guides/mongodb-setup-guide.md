# MongoDB Setup Guide for ThreeFold Cloud Marketplace

This guide provides step-by-step instructions for setting up MongoDB Atlas for the ThreeFold Cloud Marketplace backend. It explains how to create a MongoDB Atlas account, set up a cluster, create a database user, and configure the necessary environment variables.

## Table of Contents

- [MongoDB Setup Guide for ThreeFold Cloud Marketplace](#mongodb-setup-guide-for-threefold-cloud-marketplace)
  - [Table of Contents](#table-of-contents)
  - [Prerequisites](#prerequisites)
  - [Creating a MongoDB Atlas Account](#creating-a-mongodb-atlas-account)
  - [Setting Up a Cluster](#setting-up-a-cluster)
  - [Creating a Database User](#creating-a-database-user)
  - [Getting Your Connection String](#getting-your-connection-string)
  - [Configuring Environment Variables](#configuring-environment-variables)
  - [Running the Setup Script](#running-the-setup-script)
  - [Verifying the Connection](#verifying-the-connection)
  - [Troubleshooting](#troubleshooting)
    - [Connection Issues](#connection-issues)
    - [Setup Script Errors](#setup-script-errors)
    - [Still Having Issues?](#still-having-issues)

## Prerequisites

- Node.js (v16 or later)
- npm or yarn
- Access to the ThreeFold Cloud Marketplace backend code

## Creating a MongoDB Atlas Account

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) and click "Try Free"
2. Fill in the registration form or sign up with Google/GitHub
3. Complete the "Tell us a few things..." form:
   - Select "I'm learning MongoDB" or the appropriate option
   - Choose your preferred programming language (JavaScript/TypeScript)
   - Click "Finish"

## Setting Up a Cluster

1. In the MongoDB Atlas dashboard, click "Build a Database"
2. Choose the "FREE" tier (M0 Sandbox)
3. Select your preferred cloud provider (AWS, Google Cloud, or Azure)
4. Choose a region closest to your users or development location
5. Click "Create Cluster" (this may take a few minutes to provision)

## Creating a Database User

1. While your cluster is being created, go to the "Database Access" section in the left sidebar
2. Click "Add New Database User"
3. Choose "Password" as the authentication method
4. Enter a username and a secure password
   - **Important**: Save this username and password securely; you'll need them for your connection string
5. Under "Database User Privileges", select "Read and write to any database"
6. Click "Add User"

## Getting Your Connection String

1. Once your cluster is created, click "Connect" on your cluster
2. Select "Connect your application"
3. Choose "Node.js" as your driver and the appropriate version
4. Copy the connection string provided
   - It will look like: `mongodb+srv://<username>:<password>@<cluster-url>/<database-name>?retryWrites=true&w=majority`
5. Replace `<username>` and `<password>` with the credentials you created earlier
6. Replace `<database-name>` with your preferred database name (e.g., `tfcloud-marketplace`)

## Configuring Environment Variables

1. In your project's backend directory, locate the `.env` file (or create one based on `.env.example` if it doesn't exist)
2. Update the MongoDB configuration section with your connection string:

```
# MongoDB Configuration
MONGODB_URI=mongodb+srv://your-username:your-password@your-cluster-url/tfcloud-marketplace?retryWrites=true&w=majority
```

**Important**: Never commit your `.env` file with real credentials to version control. Make sure it's included in your `.gitignore` file.

## Running the Setup Script

After configuring your environment variables, run the MongoDB setup script to create the necessary collections and indexes:

```bash
cd backend
npm run setup:mongodb
```

This script will:
1. Connect to your MongoDB Atlas cluster
2. Create the required collections
3. Set up indexes for optimal query performance
4. Create initial data (operator settings and pricing configuration)

You should see output confirming that the setup was successful:
```
Setting up MongoDB for ThreeFold Cloud Marketplace...
Connected to MongoDB Atlas
Creating indexes...
Indexes created successfully
Creating initial operator settings...
Initial operator settings created
Creating initial pricing configuration...
Initial pricing configuration created
MongoDB setup completed successfully!
```

## Verifying the Connection

To verify that your MongoDB connection is working correctly:

1. Start the backend development server:
   ```bash
   npm run dev
   ```

2. Check the console output for the message:
   ```
   Connected to MongoDB Atlas
   ```

3. If you see this message, your connection is successful!

## Troubleshooting

### Connection Issues

If you encounter connection issues:

1. **Check your network**: MongoDB Atlas requires network access. Make sure your IP address is whitelisted:
   - Go to "Network Access" in the MongoDB Atlas dashboard
   - Click "Add IP Address"
   - Add your current IP or use "Allow Access from Anywhere" for development

2. **Verify credentials**: Double-check your username and password in the connection string

3. **Check connection string format**: Ensure the connection string is properly formatted with no extra spaces

4. **Database name**: Make sure you've specified a database name in the connection string

### Setup Script Errors

If the setup script fails:

1. Check the error message for specific issues
2. Verify that your MongoDB user has write permissions
3. Try running the script again with more verbose logging:
   ```bash
   DEBUG=mongodb:* npm run setup:mongodb
   ```

### Still Having Issues?

If you're still experiencing problems:

1. Check the MongoDB Atlas status page for any ongoing service issues
2. Review the MongoDB connection logs in your application
3. Consult the MongoDB Atlas documentation for specific error codes
4. Reach out to the project maintainers for assistance

---

By following this guide, you should have successfully set up MongoDB Atlas for your ThreeFold Cloud Marketplace backend. The application should now be able to connect to the database and perform all necessary operations.