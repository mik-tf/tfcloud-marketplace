import React, { useContext, useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { AuthContext } from '@context/AuthContext';
import { FiUploadCloud, FiServer, FiSettings, FiShield, FiLogOut } from 'react-icons/fi';

const DashboardLayout: React.FC = () => {
  const { roles, isAuthenticated, logout } = useContext(AuthContext);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  
  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // If not authenticated, only render the Outlet (which will show the login prompt)
  if (!isAuthenticated) {
    return <Outlet />;
  }

  // If authenticated, render the full dashboard layout with sidebar
  return (
    <div className="flex min-h-screen">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div className="fixed inset-0 bg-black opacity-50" onClick={() => setSidebarOpen(false)} />
          <aside className="relative w-72 max-w-[80%] bg-gray-100 dark:bg-gray-900 p-4 overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">Dashboard</h2>
              <button
                onClick={() => setSidebarOpen(false)}
                className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-200 focus:outline-none"
                aria-label="Close menu"
              >
                <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <nav className="space-y-2">
              <NavLink to="/dashboard" end className={({ isActive }) => `flex items-center space-x-2 px-4 py-2 rounded ${isActive ? 'bg-green-200 dark:bg-green-700 text-gray-900 dark:text-gray-100' : 'text-gray-700 dark:text-gray-300 hover:text-green-600'}`}>
                <FiUploadCloud className="w-5 h-5" /><span>Deploy</span>
              </NavLink>
              {roles.includes('node-operator') && (
                <NavLink to="/dashboard/nodes" className={({ isActive }) => `flex items-center space-x-2 px-4 py-2 rounded ${isActive ? 'bg-green-200 dark:bg-green-700 text-gray-900 dark:text-gray-100' : 'text-gray-700 dark:text-gray-300 hover:text-green-600'}`}>
                  <FiServer className="w-5 h-5" /><span>Nodes</span>
                </NavLink>
              )}
              {roles.includes('admin') && (
                <NavLink to="/dashboard/ops" className={({ isActive }) => `flex items-center space-x-2 px-4 py-2 rounded ${isActive ? 'bg-green-200 dark:bg-green-700 text-gray-900 dark:text-gray-100' : 'text-gray-700 dark:text-gray-300 hover:text-green-600'}`}>
                  <FiShield className="w-5 h-5" /><span>Admin</span>
                </NavLink>
              )}
              <NavLink to="/dashboard/settings" className={({ isActive }) => `flex items-center space-x-2 px-4 py-2 rounded ${isActive ? 'bg-green-200 dark:bg-green-700 text-gray-900 dark:text-gray-100' : 'text-gray-700 dark:text-gray-300 hover:text-green-600'}`}>
                <FiSettings className="w-5 h-5" /><span>Settings</span>
              </NavLink>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 px-4 py-2 rounded text-gray-700 dark:text-gray-300 hover:text-red-600 w-full text-left"
              >
                <FiLogOut className="w-5 h-5" /><span>Log Out</span>
              </button>
            </nav>
          </aside>
        </div>
      )}
      <aside className="hidden md:block w-60 bg-gray-100 dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 p-6">
        <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-gray-100">Dashboard</h2>
        <nav className="space-y-2 flex-grow overflow-y-auto">
          <NavLink to="/dashboard" end className={({ isActive }) => `flex items-center space-x-2 px-4 py-2 rounded ${isActive ? 'bg-green-200 dark:bg-green-700 text-gray-900 dark:text-gray-100' : 'text-gray-700 dark:text-gray-300 hover:text-green-600'}`}>
            <FiUploadCloud className="w-5 h-5" />
            <span>Deploy</span>
          </NavLink>
          {roles.includes('node-operator') && (
            <NavLink to="/dashboard/nodes" className={({ isActive }) => `flex items-center space-x-2 px-4 py-2 rounded ${isActive ? 'bg-green-200 dark:bg-green-700 text-gray-900 dark:text-gray-100' : 'text-gray-700 dark:text-gray-300 hover:text-green-600'}`}>
              <FiServer className="w-5 h-5" />
              <span>Nodes</span>
            </NavLink>
          )}
          {roles.includes('admin') && (
            <NavLink to="/dashboard/ops" className={({ isActive }) => `flex items-center space-x-2 px-4 py-2 rounded ${isActive ? 'bg-green-200 dark:bg-green-700 text-gray-900 dark:text-gray-100' : 'text-gray-700 dark:text-gray-300 hover:text-green-600'}`}>
              <FiShield className="w-5 h-5" />
              <span>Admin</span>
            </NavLink>
          )}
          <NavLink to="/dashboard/settings" className={({ isActive }) => `flex items-center space-x-2 px-4 py-2 rounded ${isActive ? 'bg-green-200 dark:bg-green-700 text-gray-900 dark:text-gray-100' : 'text-gray-700 dark:text-gray-300 hover:text-green-600'}`}>
            <FiSettings className="w-5 h-5" />
            <span>Settings</span>
          </NavLink>
          <button
            onClick={handleLogout}
            className="flex items-center space-x-2 px-4 py-2 rounded text-gray-700 dark:text-gray-300 hover:text-red-600 w-full text-left mt-8"
          >
            <FiLogOut className="w-5 h-5" />
            <span>Log Out</span>
          </button>
        </nav>
      </aside>
      <main className="flex-1 p-4 sm:p-6 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 overflow-x-hidden">
        {/* Mobile navbar toggle */}
        <div className="md:hidden mb-4">
          <button onClick={() => setSidebarOpen(true)} className="flex items-center text-gray-700 dark:text-gray-200 focus:outline-none">
            <svg className="h-6 w-6 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
            <span className="font-semibold">Dashboard</span>
          </button>
        </div>
        <Outlet />
      </main>
    </div>
  );
};

export default DashboardLayout;
