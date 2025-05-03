// Netlify Build Plugin to handle environment variables for different branches
module.exports = {
  onPreBuild: ({ utils, constants }) => {
    const fs = require('fs');
    const path = require('path');
    
    // Get the current branch name
    const branch = process.env.BRANCH || 'development';
    console.log(`Current branch: ${branch}`);
    
    // Determine which environment file to use
    let envFile = '.env';
    if (branch === 'main') {
      envFile = '.env.production';
    } else if (branch === 'development') {
      envFile = '.env.development';
    }
    
    // Check if the environment file exists in the frontend directory
    const frontendEnvPath = path.join('frontend', envFile);
    if (fs.existsSync(frontendEnvPath)) {
      console.log(`Using environment file: ${frontendEnvPath}`);
      
      // Read the environment file
      const envContent = fs.readFileSync(frontendEnvPath, 'utf8');
      
      // Parse the environment variables
      const envVars = envContent
        .split('\n')
        .filter(line => line.trim() && !line.startsWith('#'))
        .reduce((acc, line) => {
          const [key, ...valueParts] = line.split('=');
          const value = valueParts.join('=').trim();
          if (key && value) {
            acc[key.trim()] = value;
          }
          return acc;
        }, {});
      
      // Set the environment variables
      Object.entries(envVars).forEach(([key, value]) => {
        process.env[key] = value;
        console.log(`Set environment variable: ${key}`);
      });
      
      console.log('Environment variables set successfully');
    } else {
      console.log(`Environment file not found: ${frontendEnvPath}`);
    }
  }
};