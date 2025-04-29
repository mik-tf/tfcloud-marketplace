import React, { useContext, useState } from 'react';
import { AuthContext } from '@context/AuthContext';

const Settings: React.FC = () => {
  const { roles, requestNodeOperator } = useContext(AuthContext);
  const [requesting, setRequesting] = useState(false);
  const [email] = useState('user@example.com'); // show registered email, read-only
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handlePasswordSubmit = (e: React.FormEvent) => { e.preventDefault(); /* TODO: validate & API call */ };

  return (
    <div className="max-w-6xl mx-auto py-10 text-gray-900 dark:text-gray-100">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Settings</h1>
      </div>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Profile</h2>
        <div className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-1">Email address</label>
            <input
              type="email"
              id="email"
              value={email}
              readOnly
              disabled
              className="w-full border border-gray-300 dark:border-gray-700 rounded px-3 py-2 bg-gray-100 dark:bg-gray-700 text-gray-500"
            />
          </div>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Security</h2>
        <form onSubmit={handlePasswordSubmit} className="space-y-4">
          <div>
            <label htmlFor="old-password" className="block text-sm font-medium mb-1">Current password</label>
            <input
              type="password"
              id="old-password"
              value={oldPassword}
              onChange={e => setOldPassword(e.target.value)}
              className="w-full border border-gray-300 dark:border-gray-700 rounded px-3 py-2 bg-white dark:bg-gray-800"
              required
            />
          </div>
          <div>
            <label htmlFor="new-password" className="block text-sm font-medium mb-1">New password</label>
            <input
              type="password"
              id="new-password"
              value={newPassword}
              onChange={e => setNewPassword(e.target.value)}
              className="w-full border border-gray-300 dark:border-gray-700 rounded px-3 py-2 bg-white dark:bg-gray-800"
              required
            />
          </div>
          <div>
            <label htmlFor="confirm-password" className="block text-sm font-medium mb-1">Confirm new password</label>
            <input
              type="password"
              id="confirm-password"
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              className="w-full border border-gray-300 dark:border-gray-700 rounded px-3 py-2 bg-white dark:bg-gray-800"
              required
            />
          </div>
          <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">Change Password</button>
        </form>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Access</h2>
        {roles.includes('node-operator') ? (
          <p className="text-green-600">Node-Operator access granted. You’ll see the Nodes tab in your dashboard.</p>
        ) : (
          <button
            onClick={async () => {
              setRequesting(true);
              await requestNodeOperator();
              setRequesting(false);
            }}
            disabled={requesting}
            className="bg-green-600 text-white px-4 py-2 rounded"
          >
            {requesting ? 'Requesting...' : 'Request Node-Operator Access'}
          </button>
        )}
      </section>
    </div>
  );
};

export default Settings;
