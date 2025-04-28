import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import logoLight from '../assets/img/logo_light.png';
import logoLightShort from '../assets/img/logo_light_short.png';
import logoDark from '../assets/img/logo_dark.png';
import logoDarkShort from '../assets/img/logo_dark_short.png';

const NavBar: React.FC = () => {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [menuOpen, setMenuOpen] = useState(false);
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
        <div className="hidden md:flex items-center space-x-4">
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
        <div className="hidden md:flex items-center space-x-4 pr-4 border-r border-gray-300 dark:border-gray-600">
          <Link to="/login" className="text-gray-700 dark:text-gray-200 hover:text-green-600">Login</Link>
          <Link to="/signup" className="text-gray-700 dark:text-gray-200 hover:text-green-600">Signup</Link>
        </div>
        <div className="flex md:hidden items-center">
          <button onClick={() => setMenuOpen(!menuOpen)} className="text-gray-700 dark:text-gray-200 focus:outline-none" aria-label="Toggle menu">
            {menuOpen ? (
              <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
        <div className="hidden md:flex items-center space-x-4">
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
      {menuOpen && (
        <div className="md:hidden bg-white dark:bg-gray-800">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <Link to="/" onClick={() => setMenuOpen(false)} className="block text-gray-700 dark:text-gray-200 hover:text-green-600 px-3 py-2 rounded">Home</Link>
            <Link to="/dashboard" onClick={() => setMenuOpen(false)} className="block text-gray-700 dark:text-gray-200 hover:text-green-600 px-3 py-2 rounded">Deploy</Link>
            <Link to="/dashboard-ops" onClick={() => setMenuOpen(false)} className="block text-gray-700 dark:text-gray-200 hover:text-green-600 px-3 py-2 rounded">Admin</Link>
            <Link to="/node-ops" onClick={() => setMenuOpen(false)} className="block text-gray-700 dark:text-gray-200 hover:text-green-600 px-3 py-2 rounded">Nodes</Link>
            <Link to="/docs" onClick={() => setMenuOpen(false)} className="block text-gray-700 dark:text-gray-200 hover:text-green-600 px-3 py-2 rounded">Docs</Link>
          </div>
          <div className="px-2 pb-3 space-y-1 border-t border-gray-200 dark:border-gray-700">
            <Link to="/login" onClick={() => setMenuOpen(false)} className="block px-3 py-2 text-gray-700 dark:text-gray-200 hover:text-green-600 rounded">Login</Link>
            <Link to="/signup" onClick={() => setMenuOpen(false)} className="block px-3 py-2 text-gray-700 dark:text-gray-200 hover:text-green-600 rounded">Signup</Link>
            <label className="inline-flex items-center cursor-pointer px-3 py-2">
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
      )}
    </nav>
  );
};

export default NavBar;
