import React, { createContext, useState, useEffect } from 'react';

interface AuthContextValue {
  roles: string[];
  requestNodeOperator: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextValue>({
  roles: ['user'],
  requestNodeOperator: async () => {},
});

export const AuthProvider: React.FC = ({ children }) => {
  const [roles, setRoles] = useState<string[]>(() => {
    const saved = localStorage.getItem('roles');
    return saved ? JSON.parse(saved) : ['user'];
  });

  const requestNodeOperator = async () => {
    // TODO: replace with real API call
    await new Promise(resolve => setTimeout(resolve, 500));
    if (!roles.includes('node-operator')) {
      const updated = [...roles, 'node-operator'];
      setRoles(updated);
    }
  };

  useEffect(() => {
    localStorage.setItem('roles', JSON.stringify(roles));
  }, [roles]);

  return (
    <AuthContext.Provider value={{ roles, requestNodeOperator }}>
      {children}
    </AuthContext.Provider>
  );
};
