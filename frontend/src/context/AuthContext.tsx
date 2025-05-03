import React, { createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface AuthContextValue {
  roles: string[];
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  requestCloudProvider: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextValue>({
  roles: ['user'],
  isAuthenticated: false,
  login: async () => false,
  signup: async () => false,
  logout: () => {},
  requestCloudProvider: async () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [roles, setRoles] = useState<string[]>(() => {
    const saved = localStorage.getItem('roles');
    return saved ? JSON.parse(saved) : ['user'];
  });
  
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('isAuthenticated') === 'true';
  });

  const login = async (email: string, password: string): Promise<boolean> => {
    // TODO: replace with real API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Check for cloud operator credentials
    if (email === 'operator@example.com' && password === 'password') {
      setRoles(['user', 'cloud-provider', 'cloud-operator']);
      setIsAuthenticated(true);
      return true;
    }
    
    // Check for cloud provider credentials
    if (email === 'provider@example.com' && password === 'password') {
      setRoles(['user', 'cloud-provider']);
      setIsAuthenticated(true);
      return true;
    }
    
    // Regular user login logic (mock for now)
    setRoles(['user']);
    setIsAuthenticated(true);
    return true;
  };
  
  const signup = async (name: string, email: string, password: string): Promise<boolean> => {
    // TODO: replace with real API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // For now, just create a regular user account
    setRoles(['user']);
    setIsAuthenticated(true);
    return true;
  };
  
  const logout = () => {
    setRoles(['user']);
    setIsAuthenticated(false);
  };

  const requestCloudProvider = async () => {
    // TODO: replace with real API call
    await new Promise(resolve => setTimeout(resolve, 500));
    if (!roles.includes('cloud-provider')) {
      const updated = [...roles, 'cloud-provider'];
      setRoles(updated);
    }
  };

  useEffect(() => {
    localStorage.setItem('roles', JSON.stringify(roles));
    localStorage.setItem('isAuthenticated', isAuthenticated.toString());
  }, [roles, isAuthenticated]);

  return (
    <AuthContext.Provider value={{ roles, isAuthenticated, login, signup, logout, requestCloudProvider }}>
      {children}
    </AuthContext.Provider>
  );
};
