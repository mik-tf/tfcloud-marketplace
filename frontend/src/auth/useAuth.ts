import { useAuth0 } from '@auth0/auth0-react';
import { useEffect, useState } from 'react';
import axios from 'axios';

export interface UserProfile {
  sub: string;
  email: string;
  name: string;
  picture: string;
  roles?: string[];
  [key: string]: any;
}

export const useAuth = () => {
  const {
    isAuthenticated,
    isLoading,
    loginWithRedirect,
    logout,
    getAccessTokenSilently,
    user,
  } = useAuth0();
  
  const [token, setToken] = useState<string | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [tokenLoading, setTokenLoading] = useState(false);

  // Get access token when authenticated
  useEffect(() => {
    const getToken = async () => {
      if (isAuthenticated && user) {
        setTokenLoading(true);
        try {
          const accessToken = await getAccessTokenSilently();
          setToken(accessToken);
          
          // Set axios default authorization header
          axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
          
          // Set user profile
          setUserProfile({
            sub: user.sub || '',
            email: user.email || '',
            name: user.name || '',
            picture: user.picture || '',
            roles: user[`${import.meta.env.VITE_AUTH0_AUDIENCE}/roles`] || [],
            ...user
          });
        } catch (error) {
          console.error('Error getting access token', error);
        } finally {
          setTokenLoading(false);
        }
      }
    };

    getToken();
  }, [isAuthenticated, user, getAccessTokenSilently]);

  // Login function
  const login = () => {
    loginWithRedirect();
  };

  // Logout function
  const handleLogout = () => {
    logout({ 
      logoutParams: {
        returnTo: window.location.origin 
      }
    });
    setToken(null);
    setUserProfile(null);
    
    // Remove authorization header
    delete axios.defaults.headers.common['Authorization'];
  };

  // Check if user has a specific role
  const hasRole = (role: string): boolean => {
    if (!userProfile || !userProfile.roles) return false;
    return userProfile.roles.includes(role);
  };

  return {
    isAuthenticated,
    isLoading: isLoading || tokenLoading,
    login,
    logout: handleLogout,
    token,
    user: userProfile,
    hasRole,
  };
};

export default useAuth;