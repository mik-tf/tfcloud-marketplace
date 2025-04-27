import React, { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';

interface DocsLayoutProps {
  children: ReactNode;
}

const DocsLayout: React.FC<DocsLayoutProps> = ({ children }) => {
  const location = useLocation();
  const links = [
    { to: '/docs', label: 'Welcome' },
    { to: '/docs/ecosystem', label: 'Ecosystem' },
    { to: '/docs/dashboard-user', label: 'Dashboard User' },
    { to: '/docs/dashboard-operator', label: 'Dashboard Operator' },
    { to: '/docs/node-operator', label: 'Node Operator' },
  ];

  return (
    <div className="flex min-h-screen">
      <aside className="w-64 bg-gray-100 dark:bg-gray-900 p-6">
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
      <main className="flex-1 p-6 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100">
        {children}
      </main>
    </div>
  );
};

export default DocsLayout;
