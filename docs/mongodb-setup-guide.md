# MongoDB Atlas Setup Guide for ThreeFold Cloud Marketplace

This guide provides detailed instructions for setting up MongoDB Atlas as the serverless database for the ThreeFold Cloud Marketplace project.

## Table of Contents

- [MongoDB Atlas Setup Guide for ThreeFold Cloud Marketplace](#mongodb-atlas-setup-guide-for-threefold-cloud-marketplace)
  - [Table of Contents](#table-of-contents)
  - [Introduction](#introduction)
  - [Creating a MongoDB Atlas Account](#creating-a-mongodb-atlas-account)
  - [Setting Up a Cluster](#setting-up-a-cluster)
  - [Creating a Database User](#creating-a-database-user)
  - [Configuring Network Access](#configuring-network-access)
  - [Getting Your Connection String](#getting-your-connection-string)
  - [Setting Up Collections and Indexes](#setting-up-collections-and-indexes)
  - [Connecting to Your Database](#connecting-to-your-database)
  - [Troubleshooting](#troubleshooting)

## Introduction

MongoDB Atlas is a fully-managed cloud database service that handles all the complexity of deploying, managing, and healing your deployments on the cloud service provider of your choice. It's an ideal solution for the ThreeFold Cloud Marketplace as it provides:

- Serverless architecture
- Automatic scaling
- High availability
- Security features
- Easy integration with Node.js applications

## Creating a MongoDB Atlas Account

1. Go to the [MongoDB Atlas website](https://www.mongodb.com/cloud/atlas)
2. Click "Try Free" or "Start Free"
3. Fill in your information and create an account
4. Verify your email address

## Setting Up a Cluster

1. After logging in, you'll be prompted to create a new cluster
2. Select the "FREE" tier for development purposes
   - For production, choose an appropriate paid tier based on your needs
3. Select your preferred cloud provider (AWS, Google Cloud, or Azure)
4. Choose a region closest to your users for optimal performance
5. Leave the default cluster tier (M0 Sandbox for the free tier)
6. Name your cluster (e.g., "tfcloud-marketplace")
7. Click "Create Cluster"
   - Cluster creation may take a few minutes

## Creating a Database User

1. While your cluster is being created, navigate to the "Database Access" section under the Security tab
2. Click "Add New Database User"
3. Choose "Password" as the authentication method
4. Enter a username and a secure password
   - Make sure to save these credentials securely
5. Set the appropriate database user privileges
   - For development, you can use "Atlas admin" role
   - For production, use more restricted roles like "readWrite" on specific databases
6. Click "Add User"

## Configuring Network Access

1. Navigate to the "Network Access" section under the Security tab
2. Click "Add IP Address"
3. For development purposes, you can select "Allow Access from Anywhere" (0.0.0.0/0)
   - For production, restrict access to specific IP addresses
4. Click "Confirm"

## Getting Your Connection String

1. Once your cluster is created, click "Connect" on your cluster dashboard
2. Select "Connect your application"
3. Choose "Node.js" as your driver and the appropriate version
4. Copy the connection string
5. Replace `<password>` with your database user's password
6. Replace `<dbname>` with your database name (e.g., "tfcloud-marketplace")

Your connection string should look like this:
```
mongodb+srv://<username>:<password>@<cluster-url>/<database-name>?retryWrites=true&w=majority
```

## Setting Up Collections and Indexes

The ThreeFold Cloud Marketplace uses several collections to store data. You can set these up automatically using the provided setup script:

1. Update your `.env` file with your MongoDB connection string:
   ```
   MONGODB_URI=mongodb+srv://<username>:<password>@<cluster-url>/<database-name>?retryWrites=true&w=majority
   ```

2. Run the setup script:
   ```bash
   npm run setup:mongodb
   ```

This script will create the following collections and indexes:

- `users`: Stores user information
- `deployments`: Stores deployment information
- `providers`: Stores provider information
- `nodes`: Stores node information
- `transactions`: Stores transaction information

## Connecting to Your Database

Once your MongoDB Atlas cluster is set up and the connection string is added to your `.env` file, the application will automatically connect to the database when you start the backend:

```bash
npm run dev
```

## Troubleshooting

If you encounter issues connecting to your MongoDB Atlas cluster:

1. **Connection String Issues**:
   - Verify that you've replaced `<username>`, `<password>`, and `<dbname>` in the connection string
   - Check for any special characters in your password that might need URL encoding

2. **Network Access Issues**:
   - Ensure your IP address is whitelisted in the Network Access settings
   - If using a VPN or changing networks, you may need to update the IP whitelist

3. **Authentication Issues**:
   - Verify that the username and password are correct
   - Check that the user has the appropriate permissions

4. **Cluster Issues**:
   - Ensure your cluster is in the "Active" state
   - Check the MongoDB Atlas status page for any ongoing incidents

5. **Setup Script Issues**:
   - If the `setup:mongodb` script fails, check the error message for details
   - Verify that your connection string is correct in the `.env` file
   - Ensure you have the necessary permissions to create collections and indexes

For more detailed troubleshooting, refer to the [MongoDB Atlas documentation](https://docs.atlas.mongodb.com/) or contact MongoDB Atlas support.