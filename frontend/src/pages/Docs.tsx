import React from 'react';
import { Link } from 'react-router-dom';
import DocsLayout from '@components/DocsLayout';

const Docs: React.FC = () => (
  <DocsLayout>
    <div className="max-w-4xl mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Documentation</h1>
      <ul className="space-y-4">
        <li>
          <Link to="/docs/dashboard-user" className="text-green-500 hover:underline">Dashboard User</Link>
        </li>
        <li>
          <Link to="/docs/dashboard-operator" className="text-green-500 hover:underline">Dashboard Operator</Link>
        </li>
        <li>
          <Link to="/docs/node-operator" className="text-green-500 hover:underline">Node Operator</Link>
        </li>
      </ul>
    </div>
  </DocsLayout>
);

export default Docs;
