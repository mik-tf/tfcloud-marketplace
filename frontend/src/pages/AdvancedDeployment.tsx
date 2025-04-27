import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AdvancedDeployment: React.FC = () => {
  const [nodes, setNodes] = useState<string[]>([]);
  const [selectedNode, setSelectedNode] = useState<string>('');
  const [backup, setBackup] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // TODO: fetch available node list from API
    const mockNodes = ['node-1', 'node-2', 'node-3'];
    setNodes(mockNodes);
    setSelectedNode(mockNodes[0]);
  }, []);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log({ node: selectedNode, backup });
    // TODO: integrate advanced deployment API
    navigate('/dashboard');
  };

  return (
    <div className="max-w-md mx-auto py-10">
      <h1 className="text-2xl font-bold mb-4">Advanced Deployment</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-gray-700">Select Node</label>
          <select
            className="w-full px-3 py-2 border rounded"
            value={selectedNode}
            onChange={e => setSelectedNode(e.target.value)}
            required
          >
            {nodes.map(node => (
              <option key={node} value={node}>{node}</option>
            ))}
          </select>
        </div>
        <div className="flex items-center">
          <input
            id="backup"
            type="checkbox"
            className="mr-2"
            checked={backup}
            onChange={e => setBackup(e.target.checked)}
          />
          <label htmlFor="backup" className="text-gray-700">Enable Backup</label>
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded"
        >
          Deploy
        </button>
      </form>
    </div>
  );
};

export default AdvancedDeployment;
