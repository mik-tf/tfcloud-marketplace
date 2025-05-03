/**
 * API Client for ThreeFold Cloud Marketplace
 * 
 * This file demonstrates how to integrate with the ThreeFold Cloud Marketplace API
 * for various operations like managing deployments, providers, etc.
 */

import auth0Service from './auth';

class ApiClient {
  constructor(config) {
    this.config = config;
    this.baseUrl = config.apiUrl;
  }

  /**
   * Get headers for API requests
   */
  getHeaders() {
    const headers = {
      'Content-Type': 'application/json'
    };

    // Add authorization header if user is authenticated
    if (auth0Service.isAuthenticated()) {
      headers['Authorization'] = `Bearer ${auth0Service.getAccessToken()}`;
    }

    return headers;
  }

  /**
   * Make API request
   */
  async request(endpoint, options = {}) {
    const url = `${this.baseUrl}${endpoint}`;
    const headers = this.getHeaders();

    const config = {
      ...options,
      headers: {
        ...headers,
        ...options.headers
      }
    };

    try {
      const response = await fetch(url, config);

      // Handle unauthorized error
      if (response.status === 401) {
        auth0Service.clearAuthState();
        window.dispatchEvent(new CustomEvent('auth:unauthorized'));
        throw new Error('Unauthorized');
      }

      // Parse response
      const data = await response.json();

      // Handle API errors
      if (!response.ok) {
        throw new Error(data.error || 'API request failed');
      }

      return data;
    } catch (error) {
      console.error(`API request failed: ${endpoint}`, error);
      throw error;
    }
  }

  /**
   * Get user profile
   */
  async getUserProfile() {
    return this.request('/auth/me');
  }

  /**
   * Get user deployments
   */
  async getUserDeployments() {
    return this.request('/cloud-user/deployments');
  }

  /**
   * Get deployment details
   */
  async getDeploymentDetails(deploymentId) {
    return this.request(`/cloud-user/deployments/${deploymentId}`);
  }

  /**
   * Create deployment
   */
  async createDeployment(deploymentData) {
    return this.request('/cloud-user/deployments', {
      method: 'POST',
      body: JSON.stringify(deploymentData)
    });
  }

  /**
   * Update deployment
   */
  async updateDeployment(deploymentId, deploymentData) {
    return this.request(`/cloud-user/deployments/${deploymentId}`, {
      method: 'PUT',
      body: JSON.stringify(deploymentData)
    });
  }

  /**
   * Delete deployment
   */
  async deleteDeployment(deploymentId) {
    return this.request(`/cloud-user/deployments/${deploymentId}`, {
      method: 'DELETE'
    });
  }

  /**
   * Register as provider
   */
  async registerProvider(providerData) {
    return this.request('/cloud-provider/register', {
      method: 'POST',
      body: JSON.stringify(providerData)
    });
  }

  /**
   * Get provider nodes
   */
  async getProviderNodes() {
    return this.request('/cloud-provider/nodes');
  }

  /**
   * Schedule maintenance
   */
  async scheduleMaintenance(maintenanceData) {
    return this.request('/cloud-provider/maintenance', {
      method: 'POST',
      body: JSON.stringify(maintenanceData)
    });
  }

  /**
   * Create payment intent
   */
  async createPaymentIntent(paymentData) {
    return this.request('/payments/create-intent', {
      method: 'POST',
      body: JSON.stringify(paymentData)
    });
  }

  /**
   * Get payment methods
   */
  async getPaymentMethods() {
    return this.request('/payments/methods');
  }

  /**
   * Get transaction history
   */
  async getTransactionHistory() {
    return this.request('/payments/transactions');
  }
}

// Create API client instance
const apiClient = new ApiClient({
  apiUrl: 'http://localhost:8888/api'
});

// Export the client
export default apiClient;