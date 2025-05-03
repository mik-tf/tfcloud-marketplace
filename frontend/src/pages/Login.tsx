import React from 'react';
import { Navigate } from 'react-router-dom';
import useAuth from '../auth/useAuth';

const Login: React.FC = () => {
  const { isAuthenticated, isLoading, login } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-3xl font-extrabold text-gray-900">Welcome to ThreeFold Cloud Marketplace</h1>
          <p className="mt-2 text-sm text-gray-600">
            Sign in to access the marketplace
          </p>
        </div>
        <div className="mt-8 space-y-6">
          <button
            onClick={() => login()}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Sign in with Auth0
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
