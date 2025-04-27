import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

interface Node {
  id: string;
  name: string;
  status: string;
  createdAt: string;
}

const mockNodes: Node[] = [
  { id: '1', name: 'Node #1', status: 'Active', createdAt: '2025-04-26' },
  { id: '2', name: 'Node #2', status: 'Offline', createdAt: '2025-04-25' },
];

const NodeDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [node, setNode] = useState<Node | undefined>(undefined);

  useEffect(() => {
    const found = mockNodes.find(n => n.id === id);
    setNode(found);
  }, [id]);

  if (!node) {
    return (
      <div className="max-w-xl mx-auto py-10 text-gray-900 dark:text-gray-100">
        <p>Node not found.</p>
        <Link to="/node-ops" className="text-blue-500 hover:underline">Back to Node Ops</Link>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto py-10 text-gray-900 dark:text-gray-100">
      <h1 className="text-2xl font-bold mb-4">Node {node.id} Details</h1>
      <p><span className="font-semibold">Name:</span> {node.name}</p>
      <p><span className="font-semibold">Status:</span> {node.status}</p>
      <p><span className="font-semibold">Created At:</span> {node.createdAt}</p>
      <div className="mt-6">
        <a
          href={`https://grafana.threefold.grid/node/${node.id}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-500 hover:underline"
        >
          View metrics on Grafana
        </a>
      </div>
      <div className="mt-4">
        <Link to="/node-ops" className="text-gray-500 hover:underline">Back to Node Ops</Link>
      </div>
    </div>
  );
};

export default NodeDetail;
