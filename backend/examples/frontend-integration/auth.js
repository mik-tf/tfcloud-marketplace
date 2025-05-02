/**
 * Auth0 Authentication Service for Frontend Integration
 * 
 * This file demonstrates how to integrate the Auth0 authentication flow
 * with the ThreeFold Cloud Marketplace backend.
 */

class Auth0Service {
  constructor(config) {
    this.config = config;
    this.accessToken = null;
    this.idToken = null;
    this.expiresAt = null;
    this.user = null;
    
    // Check if user is already authenticated (e.g., from localStorage)
    this.restoreAuthState();
  }

  /**
   * Restore authentication state from localStorage
   */
  restoreAuthState() {
    try {
      const authState = JSON.parse(localStorage.getItem('auth_state'));
      if (authState && authState.expiresAt > Date.now()) {
        this.accessToken = authState.accessToken;
        this.idToken = authState.idToken;
        this.expiresAt = authState.expiresAt;
        this.user = authState.user;
      } else {
        this.clearAuthState();
      }
    } catch (error) {
      console.error('Error restoring auth state:', error);
      this.clearAuthState();
    }
  }

  /**
   * Save authentication state to localStorage
   */
  saveAuthState() {
    try {
      const authState = {
        accessToken: this.accessToken,
        idToken: this.idToken,
        expiresAt: this.expiresAt,
        user: this.user
      };
      localStorage.setItem('auth_state', JSON.stringify(authState));
    } catch (error) {
      console.error('Error saving auth state:', error);
    }
  }

  /**
   * Clear authentication state
   */
  clearAuthState() {
    this.accessToken = null;
    this.idToken = null;
    this.expiresAt = null;
    this.user = null;
    localStorage.removeItem('auth_state');
  }

  /**
   * Login with Auth0
   */
  login() {
    // Store the current URL to redirect back after login
    const returnTo = encodeURIComponent(window.location.href);
    
    // Redirect to the backend login endpoint
    window.location.href = `${this.config.apiUrl}/auth/login?returnTo=${returnTo}`;
  }

  /**
   * Handle Auth0 callback
   */
  handleCallback() {
    // Parse URL parameters
    const params = new URLSearchParams(window.location.search);
    const accessToken = params.get('access_token');
    const idToken = params.get('id_token');
    const expiresIn = params.get('expires_in');
    
    if (accessToken && idToken && expiresIn) {
      // Calculate expiration time
      const expiresAt = Date.now() + parseInt(expiresIn) * 1000;
      
      // Set authentication state
      this.accessToken = accessToken;
      this.idToken = idToken;
      this.expiresAt = expiresAt;
      
      // Fetch user profile
      this.fetchUserProfile().then(() => {
        // Save auth state
        this.saveAuthState();
        
        // Remove URL parameters
        const url = new URL(window.location.href);
        url.search = '';
        window.history.replaceState({}, document.title, url.toString());
        
        // Dispatch authentication event
        window.dispatchEvent(new CustomEvent('auth:login', { detail: { user: this.user } }));
      });
    }
  }

  /**
   * Fetch user profile
   */
  async fetchUserProfile() {
    try {
      const response = await fetch(`${this.config.apiUrl}/auth/me`, {
        headers: {
          'Authorization': `Bearer ${this.accessToken}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch user profile');
      }
      
      const data = await response.json();
      this.user = {
        ...data.auth0Profile,
        ...data.userProfile
      };
      
      return this.user;
    } catch (error) {
      console.error('Error fetching user profile:', error);
      this.clearAuthState();
      throw error;
    }
  }

  /**
   * Logout
   */
  logout() {
    // Clear auth state
    this.clearAuthState();
    
    // Redirect to the backend logout endpoint
    const returnTo = encodeURIComponent(window.location.origin);
    window.location.href = `${this.config.apiUrl}/auth/logout?returnTo=${returnTo}`;
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated() {
    return this.accessToken !== null && this.expiresAt > Date.now();
  }

  /**
   * Get access token
   */
  getAccessToken() {
    return this.accessToken;
  }

  /**
   * Get user profile
   */
  getUser() {
    return this.user;
  }

  /**
   * Check if user has a specific role
   */
  hasRole(role) {
    if (!this.user || !this.user.permissions) {
      return false;
    }
    
    return this.user.permissions.includes(role);
  }
}

// Example usage
const auth0Service = new Auth0Service({
  apiUrl: 'http://localhost:8888/api'
});

// Check if we're handling a callback
if (window.location.search.includes('access_token=')) {
  auth0Service.handleCallback();
}

// Export the service
export default auth0Service;