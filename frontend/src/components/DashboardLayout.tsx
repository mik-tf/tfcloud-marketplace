import React, { useContext, useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { AuthContext } from '@context/AuthContext';
import { FiUploadCloud, FiServer, FiSettings, FiShield } from 'react-icons/fi';

const DashboardLayout: React.FC = () => {
  const { roles } = useContext(AuthContext);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="md:hidden fixed inset-0 z-40 flex">
          <div className="fixed inset-0 bg-black opacity-50" onClick={() => setSidebarOpen(false)} />
          <aside className="relative w-60 bg-gray-100 dark:bg-gray-900 p-6 overflow-y-auto">
            <button onClick={() => setSidebarOpen(false)} className="absolute top-4 right-4 text-gray-700 dark:text-gray-200 focus:outline-none" aria-label="Close menu">
              <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-gray-100">Dashboard</h2>
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
        </nav>
      </aside>
      <main className="flex-1 p-6 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100">
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
