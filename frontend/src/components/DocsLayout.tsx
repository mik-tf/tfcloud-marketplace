import React, { ReactNode, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

interface DocsLayoutProps {
  children: ReactNode;
}

const DocsLayout: React.FC<DocsLayoutProps> = ({ children }) => {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const links = [
    { to: '/docs', label: 'Welcome' },
    { to: '/docs/the-big-picture', label: 'The Big Picture' },
    { to: '/docs/ecosystem', label: 'Ecosystem' },
    { to: '/docs/cloud-user', label: 'Cloud User' },
    { to: '/docs/cloud-operator', label: 'Cloud Operator' },
    { to: '/docs/cloud-provider', label: 'Cloud Provider' },
  ];

  return (
    <div className="flex min-h-screen">
      <aside className="hidden md:block w-64 bg-gray-100 dark:bg-gray-900 p-6">
        <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-gray-100">Docs</h2>
        <nav className="space-y-2">
          {links.map(link => (
            <Link
              key={link.to}
              to={link.to}
              className={`block px-2 py-1 rounded ${location.pathname === link.to ? 'bg-green-200 dark:bg-green-700 text-gray-900 dark:text-gray-100' : 'text-gray-700 dark:text-gray-300 hover:text-green-600'}`}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </aside>
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 flex">
          <div className="fixed inset-0 bg-black opacity-50" onClick={() => setSidebarOpen(false)}></div>
          <aside className="relative w-64 bg-gray-100 dark:bg-gray-900 p-6 overflow-y-auto">
            <button onClick={() => setSidebarOpen(false)} className="absolute top-4 right-4 text-gray-700 dark:text-gray-200 focus:outline-none" aria-label="Close menu">
              <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-gray-100">Docs</h2>
            <nav className="space-y-2">
              {links.map(link => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setSidebarOpen(false)}
                  className={`block px-2 py-1 rounded ${location.pathname === link.to ? 'bg-green-200 dark:bg-green-700 text-gray-900 dark:text-gray-100' : 'text-gray-700 dark:text-gray-300 hover:text-green-600'}`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </aside>
        </div>
      )}
      <main className="flex-1 p-6 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100">
        {/* Mobile docs toggle */}
        <div className="md:hidden mb-4">
          <button onClick={() => setSidebarOpen(true)} className="flex items-center text-gray-700 dark:text-gray-200 focus:outline-none">
            <svg className="h-6 w-6 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
            <span className="font-semibold">Docs</span>
          </button>
        </div>
        {children}
      </main>
    </div>
  );
};

export default DocsLayout;
