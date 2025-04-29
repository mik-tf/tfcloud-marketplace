import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '@context/AuthContext';

interface RequireRoleProps {
  role: string;
  children: React.ReactElement;
}

const RequireRole: React.FC<RequireRoleProps> = ({ role, children }) => {
  const { roles } = useContext(AuthContext);
  if (!roles.includes(role)) {
    return <Navigate to="/dashboard" replace />;
  }
  return children;
};

export default RequireRole;
