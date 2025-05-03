import React from 'react';
import useAuth from '../auth/useAuth';

const Profile: React.FC = () => {
  const { user, isLoading, logout } = useAuth();

  if (isLoading || !user) {
    return (
      <div className="flex items-center justify-center p-4">
        <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="bg-white shadow rounded-lg p-4">
      <div className="flex items-center space-x-4">
        {user.picture && (
          <img
            src={user.picture}
            alt={user.name || 'User'}
            className="h-12 w-12 rounded-full"
          />
        )}
        <div>
          <h3 className="text-lg font-medium text-gray-900">{user.name}</h3>
          <p className="text-sm text-gray-500">{user.email}</p>
        </div>
      </div>
      
      {user.roles && user.roles.length > 0 && (
        <div className="mt-4">
          <h4 className="text-sm font-medium text-gray-900">Roles:</h4>
          <div className="mt-1 flex flex-wrap gap-2">
            {user.roles.map((role: string) => (
              <span
                key={role}
                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
              >
                {role}
              </span>
            ))}
          </div>
        </div>
      )}
      
      <div className="mt-4">
        <button
          onClick={() => logout()}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Sign Out
        </button>
      </div>
    </div>
  );
};

export default Profile;