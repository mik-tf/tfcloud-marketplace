import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

interface Deployment {
  id: string;
  name: string;
  status: string;
  createdAt: string;
}

const Dashboard: React.FC = () => {
  const [deployments, setDeployments] = useState<Deployment[]>([]);

  useEffect(() => {
    // TODO: fetch real data from API
    setDeployments([
      { id: '1', name: 'VM Deployment #1', status: 'Running', createdAt: '2025-04-26' },
      { id: '2', name: 'VM Deployment #2', status: 'Stopped', createdAt: '2025-04-25' },
    ]);
  }, []);

  return (
    <div className="max-w-6xl mx-auto py-10 text-gray-900 dark:text-gray-100">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Deploy</h1>
        <Link
          to="/dashboard/new"
          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
        >
          New Deployment
        </Link>
      </div>
      {deployments.length === 0 ? (
        <p className="text-gray-600 dark:text-gray-400">No deployments yet.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white shadow rounded-lg overflow-hidden dark:bg-gray-800">
            <thead className="bg-gray-100 dark:bg-gray-700">
              <tr>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400">Name</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400">Status</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400">Created At</th>
                <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 dark:text-gray-400">Actions</th>
              </tr>
            </thead>
            <tbody>
              {deployments.map(deployment => (
                <tr key={deployment.id} className="border-b border-gray-200 dark:border-gray-700">
                  <td className="px-4 py-2 text-gray-900 dark:text-gray-100">{deployment.name}</td>
                  <td className="px-4 py-2 text-gray-900 dark:text-gray-100">{deployment.status}</td>
                  <td className="px-4 py-2 text-gray-900 dark:text-gray-100">{deployment.createdAt}</td>
                  <td className="px-4 py-2 text-right">
                    <Link
                      to={`/dashboard/${deployment.id}`}
                      className="text-green-500 dark:text-green-300 hover:underline"
                    >
                      View
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
