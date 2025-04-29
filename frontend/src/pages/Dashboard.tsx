import React, { useEffect, useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '@context/AuthContext';

interface Deployment {
  id: string;
  name: string;
  status: string;
  createdAt: string;
}

interface MaintenanceWindow {
  id: string;
  deploymentId: string;
  start: string;
  end: string;
  comment?: string;
}

const Dashboard: React.FC = () => {
  const { isAuthenticated } = useContext(AuthContext);
  const [deployments, setDeployments] = useState<Deployment[]>([]);
  const [maintenanceWindows, setMaintenanceWindows] = useState<MaintenanceWindow[]>([]);
  const [selectedWindow, setSelectedWindow] = useState<MaintenanceWindow | null>(null);

  useEffect(() => {
    // TODO: fetch real data from API
    setDeployments([
      { id: '1', name: 'App Alpha',    status: 'Running', createdAt: '2025-04-26' },
      { id: '2', name: 'App Beta',     status: 'Stopped', createdAt: '2025-04-25' },
      { id: '3', name: 'App Gamma',    status: 'Running', createdAt: '2025-04-24' },
      { id: '4', name: 'App Delta',    status: 'Stopped', createdAt: '2025-04-23' },
      { id: '5', name: 'App Epsilon',  status: 'Running', createdAt: '2025-04-22' },
      { id: '6', name: 'App Zeta',     status: 'Running', createdAt: '2025-04-21' },
      { id: '7', name: 'App Eta',      status: 'Stopped', createdAt: '2025-04-20' },
      { id: '8', name: 'App Theta',    status: 'Running', createdAt: '2025-04-19' },
      { id: '9', name: 'App Iota',     status: 'Stopped', createdAt: '2025-04-18' },
      { id: '10', name: 'App Kappa',   status: 'Running', createdAt: '2025-04-17' },
    ]);
  }, []);

  useEffect(() => {
    // TODO: fetch real maintenance data
    setMaintenanceWindows([
      { id: 'mw1', deploymentId: '3',  start: '2025-05-01T10:00', end: '2025-05-01T12:00', comment: 'Scheduled upgrade' },  // Scheduled
      { id: 'mw2', deploymentId: '5',  start: '2025-04-29T12:00', end: '2025-04-29T14:00', comment: 'Rolling update' },    // Ongoing
      { id: 'mw3', deploymentId: '7',  start: '2025-04-20T09:00', end: '2025-04-20T11:00', comment: 'Completed maintenance' },// Completed
      { id: 'mw4', deploymentId: '10', start: '2025-05-05T08:00', end: '2025-05-05T10:00', comment: 'Performance patch' },// Scheduled
    ]);
  }, []);

  if (!isAuthenticated) {
    return (
      <div className="max-w-6xl mx-auto py-20 text-center text-gray-900 dark:text-gray-100">
        <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-10 max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Welcome to ThreeFold Cloud Marketplace</h1>
          <p className="text-lg mb-8">
            Please log in or create an account to access the dashboard.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              to="/login"
              className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg font-medium text-lg transition-colors duration-200"
            >
              Log In
            </Link>
            <Link
              to="/signup"
              className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-medium text-lg transition-colors duration-200"
            >
              Sign Up
            </Link>
          </div>
          <div className="mt-10 border-t border-gray-200 dark:border-gray-700 pt-6">
            <h2 className="text-xl font-semibold mb-4">Why ThreeFold Cloud?</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
              <div className="p-4">
                <h3 className="font-medium mb-2">Decentralized</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Deploy on a truly decentralized infrastructure powered by the ThreeFold Grid.</p>
              </div>
              <div className="p-4">
                <h3 className="font-medium mb-2">Secure</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">End-to-end encryption and Zero-OS technology for maximum security.</p>
              </div>
              <div className="p-4">
                <h3 className="font-medium mb-2">Sustainable</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Up to 90% more energy-efficient than traditional cloud providers.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

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
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400">Maintenance Status</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400">Next Window</th>
                <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 dark:text-gray-400">Actions</th>
              </tr>
            </thead>
            <tbody>
              {deployments.map(deployment => {
                const mw = maintenanceWindows.find(w => w.deploymentId === deployment.id);
                const now = new Date();
                let statusLabel: 'None' | 'Scheduled' | 'Ongoing' | 'Completed' = 'None';
                if (mw) {
                  const start = new Date(mw.start);
                  const end = new Date(mw.end);
                  if (now < start) statusLabel = 'Scheduled';
                  else if (now >= start && now <= end) statusLabel = 'Ongoing';
                  else statusLabel = 'Completed';
                }
                return (
                  <tr key={deployment.id} className="border-b border-gray-200 dark:border-gray-700">
                    <td className="px-4 py-2 text-gray-900 dark:text-gray-100">{deployment.name}</td>
                    <td className="px-4 py-2 text-gray-900 dark:text-gray-100">{deployment.status}</td>
                    <td className="px-4 py-2 text-gray-900 dark:text-gray-100">{deployment.createdAt}</td>
                    <td className="px-4 py-2 text-gray-900 dark:text-gray-100">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          statusLabel === 'Ongoing'   ? 'bg-red-500 text-white' :
                          statusLabel === 'Scheduled' ? 'bg-yellow-300 text-gray-800' :
                          statusLabel === 'Completed' ? 'bg-blue-300 dark:bg-blue-700 text-white' :
                           'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                        } cursor-pointer`}
                        onClick={mw ? () => setSelectedWindow(mw) : undefined}
                      >{statusLabel}</span>
                    </td>
                    <td className="px-4 py-2 text-gray-900 dark:text-gray-100">
                      {mw ? `${new Date(mw.start).toLocaleString()} - ${new Date(mw.end).toLocaleString()}` : '—'}
                    </td>
                    <td className="px-4 py-2 text-right">
                      <Link to={`/dashboard/${deployment.id}`} className="text-green-500 dark:text-green-300 hover:underline">
                        View
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
      {selectedWindow && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg max-w-md w-full">
            <h3 className="text-lg font-bold mb-4">Maintenance Details</h3>
            <p><span className="font-semibold">Start:</span> {new Date(selectedWindow.start).toLocaleString()}</p>
            <p><span className="font-semibold">End:</span> {new Date(selectedWindow.end).toLocaleString()}</p>
            {selectedWindow.comment && (<p className="mt-2"><span className="font-semibold">Comment:</span> {selectedWindow.comment}</p>)}
            <button onClick={() => setSelectedWindow(null)} className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
