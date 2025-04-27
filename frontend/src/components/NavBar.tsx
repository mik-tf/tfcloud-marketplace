import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import logoLight from '../assets/img/logo_light.png';
import logoLightShort from '../assets/img/logo_light_short.png';
import logoDark from '../assets/img/logo_dark.png';
import logoDarkShort from '../assets/img/logo_dark_short.png';

const NavBar: React.FC = () => {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  useEffect(() => {
    const saved = localStorage.getItem('theme');
    if (saved === 'dark' || (!saved && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      setTheme('dark');
      document.documentElement.classList.add('dark');
    } else {
      setTheme('light');
      document.documentElement.classList.remove('dark');
    }
  }, []);
  const toggleTheme = () => {
    if (theme === 'light') {
      document.documentElement.classList.add('dark');
      setTheme('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      setTheme('light');
      localStorage.setItem('theme', 'light');
    }
  };
  return (
    <nav className="bg-white shadow p-4 dark:bg-gray-800">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link to="/" className="flex items-center mr-6">
            <img src={theme === 'dark' ? logoDark : logoLight} alt="ThreeFold Cloud Marketplace" className="h-8 hidden md:block" />
            <img src={theme === 'dark' ? logoDarkShort : logoLightShort} alt="TF" className="h-8 md:hidden" />
          </Link>
          <Link to="/" className="text-gray-700 dark:text-gray-200 hover:text-green-600">Home</Link>
          <Link to="/dashboard" className="text-gray-700 dark:text-gray-200 hover:text-green-600">Deploy</Link>
          <Link to="/dashboard-ops" className="text-gray-700 dark:text-gray-200 hover:text-green-600">Admin</Link>
          <Link to="/node-ops" className="text-gray-700 dark:text-gray-200 hover:text-green-600">Nodes</Link>
          <Link to="/docs" className="text-gray-700 dark:text-gray-200 hover:text-green-600">Docs</Link>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-4 pr-4 border-r border-gray-300 dark:border-gray-600">
            <Link to="/login" className="text-gray-700 dark:text-gray-200 hover:text-green-600">Login</Link>
            <Link to="/signup" className="text-gray-700 dark:text-gray-200 hover:text-green-600">Signup</Link>
          </div>
          <label className="inline-flex items-center cursor-pointer">
            <span className="mr-3 text-sm text-gray-700 dark:text-gray-300">Light</span>
            <div className="relative">
              <input type="checkbox" className="sr-only peer" checked={theme === 'dark'} onChange={toggleTheme} />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-green-500 rounded-full peer dark:bg-gray-600 peer-checked:bg-green-600"></div>
              <div className="absolute left-[2px] top-[2px] bg-white w-5 h-5 rounded-full shadow transition peer-checked:translate-x-[1.5rem]"></div>
            </div>
            <span className="ml-3 text-sm text-gray-700 dark:text-gray-300">Dark</span>
          </label>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
