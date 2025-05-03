import React from 'react';
import { Link } from 'react-router-dom';
import useAuth from '../auth/useAuth';

const Unauthorized: React.FC = () => {
  const { logout } = useAuth();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-3xl font-extrabold text-gray-900">Access Denied</h1>
          <p className="mt-2 text-sm text-gray-600">
            You don't have permission to access this resource.
          </p>
        </div>
        <div className="mt-8 space-y-6">
          <div className="flex flex-col space-y-4">
            <Link
              to="/"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Go to Home
            </Link>
            <button
              onClick={() => logout()}
              className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Unauthorized;