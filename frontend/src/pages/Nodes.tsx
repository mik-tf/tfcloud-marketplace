import React, { useEffect, useState, FormEvent } from 'react';
import { Link } from 'react-router-dom';

interface Node {
  id: string;
  name: string;
  status: string;
  createdAt: string;
}

const Nodes: React.FC = () => {
  const [nodes, setNodes] = useState<Node[]>([]);
  const [showForm, setShowForm] = useState<boolean>(false);
  const [nodeIds, setNodeIds] = useState<string>('');
  const [emailInput, setEmailInput] = useState<string>('');
  const [slaAgreed, setSlaAgreed] = useState<boolean>(false);

  useEffect(() => {
    // TODO: fetch real data for nodes
    setNodes([
      { id: '1', name: 'Node #1', status: 'Active', createdAt: '2025-04-26' },
      { id: '2', name: 'Node #2', status: 'Offline', createdAt: '2025-04-25' },
    ]);
  }, []);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    // TODO: send participation request for multiple IDs
    alert(`Participation request submitted for Node IDs: ${nodeIds}`);
    setShowForm(false);
  };

  return (
    <div className="max-w-6xl mx-auto py-10 text-gray-900 dark:text-gray-100">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Node Ops</h1>
      </div>
      <section className="mb-6">
        <h2 className="text-lg font-semibold mb-2">Service Level Agreement</h2>
        <div className="max-h-48 overflow-y-auto border p-4 rounded dark:bg-gray-700 dark:text-gray-100">
          <p>By requesting to participate in a co-op, you agree to:</p>
          <ul className="list-disc ml-5">
            <li>Maintain node uptime of at least 99.9%.</li>
            <li>Ensure your node is securely configured and updated.</li>
            <li>Provide support and timely communication for your node.</li>
            <li>Comply with the policies set by the dashboard operator.</li>
          </ul>
        </div>
      </section>
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Request Node Participation</h2>
        {!showForm ? (
          <button
            onClick={() => setShowForm(true)}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            Request Participation
          </button>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block">
                Node IDs
                <input
                  type="text"
                  list="node-options"
                  value={nodeIds}
                  onChange={e => setNodeIds(e.target.value)}
                  required
                  placeholder="e.g., 1,2,3"
                  className="mt-1 p-2 border rounded w-full dark:bg-gray-700 dark:text-gray-100"
                />
                <datalist id="node-options">
                  {nodes.map(node => (
                    <option key={node.id} value={node.id}>{node.name}</option>
                  ))}
                </datalist>
                <p className="text-sm text-gray-500 mt-1 dark:text-gray-400">
                  Enter one or more Node IDs separated by commas.
                </p>
              </label>
            </div>
            <div>
              <label className="block">
                Contact Email
                <input
                  type="email"
                  value={emailInput}
                  onChange={e => setEmailInput(e.target.value)}
                  required
                  className="mt-1 p-2 border rounded w-full dark:bg-gray-700 dark:text-gray-100"
                />
              </label>
            </div>
            <div>
              <label className="inline-flex items-center">
                <input
                  type="checkbox"
                  checked={slaAgreed}
                  onChange={e => setSlaAgreed(e.target.checked)}
                  required
                  className="mr-2"
                />
                I have read and agree to the Service Level Agreement above
              </label>
            </div>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Submit Request
            </button>
          </form>
        )}
      </section>
      {nodes.length === 0 ? (
        <p className="text-gray-600 dark:text-gray-400">No nodes yet.</p>
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
              {nodes.map(node => (
                <tr key={node.id} className="border-b border-gray-200 dark:border-gray-700">
                  <td className="px-4 py-2 text-gray-900 dark:text-gray-100">{node.name}</td>
                  <td className="px-4 py-2 text-gray-900 dark:text-gray-100">{node.status}</td>
                  <td className="px-4 py-2 text-gray-900 dark:text-gray-100">{node.createdAt}</td>
                  <td className="px-4 py-2 text-right">
                    <Link to={`/node-ops/${node.id}`} className="text-green-500 dark:text-green-300 hover:underline">
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

export default Nodes;
