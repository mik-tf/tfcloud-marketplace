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
          <Link to="/dashboard" className="text-gray-700 dark:text-gray-200 hover:text-green-600">Dashboard</Link>
          <Link to="/docs" className="text-gray-700 dark:text-gray-200 hover:text-green-600">Docs</Link>
        </div>
        <div className="hidden md:flex items-center space-x-4 pr-4 border-r border-gray-300 dark:border-gray-600">
          <Link to="/login" className="text-gray-700 dark:text-gray-200 hover:text-green-600">Login</Link>
          <Link to="/signup" className="text-gray-700 dark:text-gray-200 hover:text-green-600">Signup</Link>
        </div>
        <div className="flex md:hidden items-center justify-between w-full">
          <Link to="/" onClick={() => setMenuOpen(false)}>
            <img src={theme === 'dark' ? logoDarkShort : logoLightShort} alt="TF" className="h-8" />
          </Link>
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
        <div className="fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-black opacity-50" onClick={() => setMenuOpen(false)} />
          <div className="relative ml-auto w-64 h-full bg-white dark:bg-gray-800 p-4 flex flex-col">
            <button onClick={() => setMenuOpen(false)} className="self-end text-gray-700 dark:text-gray-200 focus:outline-none" aria-label="Close menu">
              <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <nav className="mt-4 space-y-1 flex-1 overflow-y-auto">
              <Link to="/" onClick={() => setMenuOpen(false)} className="block px-3 py-2 text-gray-700 dark:text-gray-200 hover:text-green-600 rounded">Home</Link>
              <Link to="/dashboard" onClick={() => setMenuOpen(false)} className="block px-3 py-2 text-gray-700 dark:text-gray-200 hover:text-green-600 rounded">Dashboard</Link>
              <Link to="/docs" onClick={() => setMenuOpen(false)} className="block px-3 py-2 text-gray-700 dark:text-gray-200 hover:text-green-600 rounded">Docs</Link>
            </nav>
            <div className="pt-4 border-t border-gray-200 dark:border-gray-700 space-y-1">
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
        </div>
      )}
    </nav>
  );
};

export default NavBar;
