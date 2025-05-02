import React, { useState, useEffect } from 'react';
import apiClient from './api-client';
import paymentService from './payment-service';
import auth0Service from './auth';

/**
 * Deployment Form Component
 * 
 * This component demonstrates how to create a deployment and process payment
 * using the ThreeFold Cloud Marketplace API.
 */
const DeploymentForm = () => {
  // State
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [deploymentName, setDeploymentName] = useState('');
  const [deploymentDescription, setDeploymentDescription] = useState('');
  const [cpuCount, setCpuCount] = useState(1);
  const [memoryGB, setMemoryGB] = useState(2);
  const [storageGB, setStorageGB] = useState(50);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [price, setPrice] = useState(0);
  const [stripeInitialized, setStripeInitialized] = useState(false);

  // Initialize component
  useEffect(() => {
    // Check authentication status
    const checkAuth = () => {
      const isAuth = auth0Service.isAuthenticated();
      setIsAuthenticated(isAuth);
      
      if (isAuth) {
        setUser(auth0Service.getUser());
      }
    };

    // Initialize Stripe
    const initStripe = async () => {
      try {
        await paymentService.initialize('pk_test_your_stripe_public_key');
        setStripeInitialized(true);
      } catch (error) {
        console.error('Failed to initialize Stripe:', error);
        setError('Failed to initialize payment system');
      }
    };

    // Check auth and initialize Stripe
    checkAuth();
    initStripe();

    // Calculate initial price
    calculatePrice(cpuCount, memoryGB, storageGB);

    // Listen for auth events
    window.addEventListener('auth:login', checkAuth);
    window.addEventListener('auth:unauthorized', checkAuth);

    return () => {
      window.removeEventListener('auth:login', checkAuth);
      window.removeEventListener('auth:unauthorized', checkAuth);
    };
  }, []);

  // Calculate price based on resources
  const calculatePrice = (cpu, memory, storage) => {
    // Simple pricing model: $5 per CPU, $2 per GB of RAM, $0.1 per GB of storage
    const cpuPrice = cpu * 5;
    const memoryPrice = memory * 2;
    const storagePrice = storage * 0.1;
    const totalPrice = cpuPrice + memoryPrice + storagePrice;
    setPrice(totalPrice);
  };

  // Handle resource changes
  useEffect(() => {
    calculatePrice(cpuCount, memoryGB, storageGB);
  }, [cpuCount, memoryGB, storageGB]);

  // Handle login
  const handleLogin = () => {
    auth0Service.login();
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      // Create deployment
      const deploymentData = {
        name: deploymentName,
        description: deploymentDescription,
        resources: {
          cpu: cpuCount,
          memory: memoryGB,
          storage: storageGB
        },
        billing: {
          planId: 'basic',
          amount: price,
          currency: 'USD',
          interval: 'monthly'
        }
      };

      const { deployment } = await apiClient.createDeployment(deploymentData);

      // Process payment
      if (stripeInitialized) {
        // Create payment method from card element
        await paymentService.createPaymentMethod({
          name: user?.name,
          email: user?.email
        });

        // Process payment
        await paymentService.processPayment(
          price,
          'usd',
          `Payment for deployment: ${deploymentName}`
        );
      }

      // Show success message
      setSuccess(`Deployment "${deployment.name}" created successfully!`);
      
      // Reset form
      setDeploymentName('');
      setDeploymentDescription('');
      setCpuCount(1);
      setMemoryGB(2);
      setStorageGB(50);
    } catch (error) {
      console.error('Deployment creation failed:', error);
      setError(error.message || 'Failed to create deployment');
    } finally {
      setIsLoading(false);
    }
  };

  // Render login prompt if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="auth-prompt">
        <h2>Authentication Required</h2>
        <p>Please log in to create a deployment</p>
        <button onClick={handleLogin} className="login-button">
          Log In
        </button>
      </div>
    );
  }

  return (
    <div className="deployment-form-container">
      <h2>Create New Deployment</h2>
      
      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}
      
      <form onSubmit={handleSubmit} className="deployment-form">
        <div className="form-group">
          <label htmlFor="deploymentName">Deployment Name</label>
          <input
            type="text"
            id="deploymentName"
            value={deploymentName}
            onChange={(e) => setDeploymentName(e.target.value)}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="deploymentDescription">Description</label>
          <textarea
            id="deploymentDescription"
            value={deploymentDescription}
            onChange={(e) => setDeploymentDescription(e.target.value)}
            rows="3"
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="cpuCount">CPU Cores</label>
          <input
            type="number"
            id="cpuCount"
            value={cpuCount}
            onChange={(e) => setCpuCount(parseInt(e.target.value))}
            min="1"
            max="16"
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="memoryGB">Memory (GB)</label>
          <input
            type="number"
            id="memoryGB"
            value={memoryGB}
            onChange={(e) => setMemoryGB(parseInt(e.target.value))}
            min="1"
            max="64"
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="storageGB">Storage (GB)</label>
          <input
            type="number"
            id="storageGB"
            value={storageGB}
            onChange={(e) => setStorageGB(parseInt(e.target.value))}
            min="10"
            max="1000"
            required
          />
        </div>
        
        <div className="price-summary">
          <h3>Price Summary</h3>
          <p>CPU: ${(cpuCount * 5).toFixed(2)}</p>
          <p>Memory: ${(memoryGB * 2).toFixed(2)}</p>
          <p>Storage: ${(storageGB * 0.1).toFixed(2)}</p>
          <p className="total-price">Total: ${price.toFixed(2)} / month</p>
        </div>
        
        <div className="form-group">
          <label htmlFor="card-element">Payment Method</label>
          <div id="card-element" className="card-element"></div>
          <div id="card-errors" className="card-errors" role="alert"></div>
        </div>
        
        <button
          type="submit"
          className="submit-button"
          disabled={isLoading}
        >
          {isLoading ? 'Creating...' : 'Create Deployment'}
        </button>
      </form>
    </div>
  );
};

export default DeploymentForm;