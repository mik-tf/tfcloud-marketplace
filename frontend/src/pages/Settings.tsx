import React, { useContext, useState } from 'react';
import { AuthContext } from '@context/AuthContext';

const Settings: React.FC = () => {
  const { roles, requestCloudProvider } = useContext(AuthContext);
  const [requesting, setRequesting] = useState(false);
  const [email] = useState('user@example.com'); // show registered email, read-only
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [providerEnabled, setProviderEnabled] = useState(false);
  const [showProviderModal, setShowProviderModal] = useState(false);

  const handlePasswordSubmit = (e: React.FormEvent) => { e.preventDefault(); /* TODO: validate & API call */ };
  
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      // Show modal when trying to check the box
      setShowProviderModal(true);
      // Don't enable yet - wait for confirmation in modal
    } else {
      // Allow unchecking without confirmation
      setProviderEnabled(false);
    }
  };
  
  const handleRequestProvider = async () => {
    if (!providerEnabled) {
      return;
    }
    
    setRequesting(true);
    await requestCloudProvider();
    setRequesting(false);
  };

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
        {roles.includes('cloud-provider') ? (
          <p className="text-green-600">Cloud Provider access granted. You'll see the Provider tab in your dashboard.</p>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center">
              <label className="inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={providerEnabled}
                  onChange={handleCheckboxChange}
                  className="mr-2"
                />
                <span>Enable Cloud Provider Request</span>
              </label>
            </div>
            <button
              onClick={handleRequestProvider}
              disabled={requesting || !providerEnabled}
              className={`px-4 py-2 rounded text-white ${providerEnabled ? 'bg-green-600 hover:bg-green-700' : 'bg-gray-300 cursor-not-allowed'}`}
            >
              {requesting ? 'Requesting...' : 'Request Cloud Provider Access'}
            </button>
          </div>
        )}
      </section>
      
      {/* Cloud Provider Info Modal */}
      {showProviderModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">Cloud Provider Information</h3>
              <button
                onClick={() => setShowProviderModal(false)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                aria-label="Close"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="space-y-4 mb-6">
              <p className="text-gray-700 dark:text-gray-300">
                To offer cloud resources on the ThreeFold Grid as a cloud provider, you need to request cloud provider access.
              </p>
              <p className="text-gray-700 dark:text-gray-300">
                This is only necessary if you want to host a node on the grid and offer cloud resources. If you're only deploying applications on the cloud, you don't need this access.
              </p>
              <p className="text-gray-700 dark:text-gray-300 font-semibold">
                As a Cloud Provider, you will:
              </p>
              <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-1">
                <li>Provision and maintain TFGrid nodes</li>
                <li>Earn 50% of the TFChain portion of deployment costs</li>
                <li>Form Cloud alliances with Cloud Operators</li>
                <li>Provide compute, storage, and network resources</li>
              </ul>
            </div>
            <div className="flex justify-between">
              <button
                onClick={() => setShowProviderModal(false)}
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setProviderEnabled(true);
                  setShowProviderModal(false);
                }}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
              >
                Enable & Continue
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Settings;
