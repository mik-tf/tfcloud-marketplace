import React, { useEffect, useState, FormEvent } from 'react';
import { Link } from 'react-router-dom';

interface Node {
  id: string;
  name: string;
  status: string;
  createdAt: string;
}

interface PendingRequest {
  id: string;
  nodeId: string;
  network: string;
  apps: string[];
  email: string;
  slaAgreed: boolean;
  comment: string;
  requestedAt: string;
}

interface AcceptedNode {
  id: string;
  name: string;
  apps: string[];
}

interface MaintenanceRequest {
  id: string;
  nodeId: string;
  start: string;
  end: string;
  comment: string;
  requestedAt: string;
}

const Nodes: React.FC = () => {
  const [nodes, setNodes] = useState<Node[]>([]);
  const [showForm, setShowForm] = useState<boolean>(false);
  const [nodeIds, setNodeIds] = useState<string>('');
  const [network, setNetwork] = useState<string>('');
  const appsList = [
    { id: 'vm', name: 'Virtual Machine' },
    { id: 'kubernetes', name: 'Kubernetes' },
    { id: 'basic-storage', name: 'Basic Storage' },
    { id: 'quantum-safe-storage', name: 'Quantum Safe Storage' },
    { id: 'nextcloud', name: 'Nextcloud' },
    { id: 'open-webui', name: 'Open WebUI' },
    { id: 'livekit', name: 'Livekit' },
  ];
  const [appsSelected, setAppsSelected] = useState<string[]>([]);
  const [comment, setComment] = useState<string>('');
  const [emailInput, setEmailInput] = useState<string>('');
  const [slaAgreed, setSlaAgreed] = useState<boolean>(false);
  const [pendingRequests, setPendingRequests] = useState<PendingRequest[]>([]);
  const [acceptedNodes, setAcceptedNodes] = useState<AcceptedNode[]>([]);
  const [maintenanceRequests, setMaintenanceRequests] = useState<MaintenanceRequest[]>([]);
  const [scheduleNodeId, setScheduleNodeId] = useState<string>('');
  const [scheduleStart, setScheduleStart] = useState<string>('');
  const [scheduleEnd, setScheduleEnd] = useState<string>('');
  const [scheduleComment, setScheduleComment] = useState<string>('');

  useEffect(() => {
    setNodes([
      { id: '1', name: 'Node #1', status: 'Online', createdAt: '2025-04-26' },
      { id: '2', name: 'Node #2', status: 'Offline', createdAt: '2025-04-25' },
      { id: '13', name: 'Node #13', status: 'Online', createdAt: '2025-04-24' },
      { id: '14', name: 'Node #14', status: 'Offline', createdAt: '2025-04-23' },
      { id: '15', name: 'Node #15', status: 'Online', createdAt: '2025-04-22' },
    ]);
  }, []);

  useEffect(() => {
    setPendingRequests([
      { id: 'p1', nodeId: '1', network: 'Main', apps: ['Virtual Machine', 'Nextcloud'], email: 'user@example.com', slaAgreed: true, comment: 'Please add my node', requestedAt: '2025-04-27' },
      { id: 'p2', nodeId: '2', network: 'Test', apps: ['Livekit'], email: 'user2@example.com', slaAgreed: false, comment: '', requestedAt: '2025-04-26' },
    ]);
  }, []);

  useEffect(() => {
    setAcceptedNodes([
      { id: '1', name: 'Node #1', apps: ['Virtual Machine', 'Nextcloud'] },
      { id: '2', name: 'Node #2', apps: ['Basic Storage'] },
      { id: '13', name: 'Node #13', apps: ['Livekit', 'Open WebUI'] },
      { id: '14', name: 'Node #14', apps: ['Kubernetes'] },
      { id: '15', name: 'Node #15', apps: ['Quantum Safe Storage'] },
    ]);
  }, []);

  useEffect(() => {
    setMaintenanceRequests([
      { id: 'mw1', nodeId: '13', start: '2025-05-01T10:00', end: '2025-05-01T12:00', comment: '', requestedAt: '2025-04-27' },
    ]);
  }, []);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const appNames = appsList.filter(a => appsSelected.includes(a.id)).map(a => a.name).join(', ');
    alert(`Participation request submitted:
Node ID: ${nodeIds}
Network: ${network}
Apps: ${appNames}
Email: ${emailInput}
SLA Agreed: ${slaAgreed ? 'Yes' : 'No'}
Comment: ${comment}`);
    setShowForm(false);
  };

  const handleSchedule = (e: FormEvent) => {
    e.preventDefault();
    const newReq: MaintenanceRequest = {
      id: `mw-${Date.now()}`,
      nodeId: scheduleNodeId,
      start: scheduleStart,
      end: scheduleEnd,
      comment: scheduleComment,
      requestedAt: new Date().toISOString().split('T')[0],
    };
    setMaintenanceRequests(prev => [...prev, newReq]);
    alert(`Scheduled maintenance for Node ${scheduleNodeId} from ${scheduleStart} to ${scheduleEnd}`);
    setScheduleNodeId(''); setScheduleStart(''); setScheduleEnd(''); setScheduleComment('');
  };

  return (
    <div className="max-w-6xl mx-auto py-10 text-gray-900 dark:text-gray-100">
      <div className="flex flex-col gap-4 mb-6">
        <h1 className="text-3xl font-bold">Cloud Provider</h1>
        <p className="text-gray-600 dark:text-gray-400">
          As a Cloud Provider, you supply the foundational infrastructure for the ThreeFold Grid. Manage your nodes, form Cloud alliances with Cloud Operators, and earn revenue by providing compute, storage, and network resources to the ecosystem.
        </p>
      </div>
      <section className="mb-6">
        <h2 className="text-lg font-semibold mb-2">Service Level Agreement</h2>
        <div className="max-h-48 overflow-y-auto border p-4 rounded dark:bg-gray-700 dark:text-gray-100">
          <p>By requesting to participate in a co-op, you agree to:</p>
          <ul className="list-disc ml-5">
            <li>Maintain node uptime of at least 99.9%.</li>
            <li>Ensure your node is securely configured and updated.</li>
            <li>Provide support and timely communication for your node.</li>
            <li>Comply with the policies set by the cloud operator.</li>
          </ul>
        </div>
      </section>
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Request Cloud Alliance</h2>
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
                Node ID
                <input
                  type="text"
                  list="node-options"
                  value={nodeIds}
                  onChange={e => setNodeIds(e.target.value)}
                  required
                  placeholder="e.g., 1"
                  className="mt-1 p-2 border rounded w-full dark:bg-gray-700 dark:text-gray-100"
                />
                <datalist id="node-options">
                  {nodes.map(node => (
                    <option key={node.id} value={node.id}>{node.id}</option>
                  ))}
                </datalist>
              </label>
            </div>
            <div>
              <label className="block">
                Network
                <select
                  value={network}
                  onChange={e => setNetwork(e.target.value)}
                  required
                  className="mt-1 p-2 border rounded w-full dark:bg-gray-700 dark:text-gray-100"
                >
                  <option value="">Select network</option>
                  <option value="Main">Main</option>
                  <option value="Test">Test</option>
                </select>
              </label>
            </div>
            <div>
              <p className="font-medium mb-1">App(s)</p>
              <div className="space-x-4 mb-2">
                {appsList.map(app => (
                  <label key={app.id} className="inline-flex items-center mr-4">
                    <input
                      type="checkbox"
                      value={app.id}
                      checked={appsSelected.includes(app.id)}
                      onChange={e => {
                        const checked = e.target.checked;
                        setAppsSelected(prev =>
                          checked ? [...prev, app.id] : prev.filter(a => a !== app.id)
                        );
                      }}
                      className="mr-2"
                    />
                    {app.name}
                  </label>
                ))}
              </div>
            </div>
            <div>
              <label className="block">
                Comment
                <textarea
                  value={comment}
                  onChange={e => setComment(e.target.value)}
                  placeholder="Any message to the cloud operator"
                  className="mt-1 p-2 border rounded w-full dark:bg-gray-700 dark:text-gray-100"
                />
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
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Pending Participation Requests</h2>
        {pendingRequests.length === 0 ? (
          <p className="text-gray-600 dark:text-gray-400">No pending requests.</p>
        ) : (
          <div className="space-y-4">
            {pendingRequests.map(req => (
              <div key={req.id} className="p-4 bg-white dark:bg-gray-700 rounded shadow">
                <p className="font-medium text-gray-900 dark:text-gray-100">Node ID: {req.nodeId}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Network: {req.network}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Apps: {req.apps.join(', ')}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Email: {req.email}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">SLA Agreed: {req.slaAgreed ? 'Yes' : 'No'}</p>
                {req.comment && <p className="text-sm text-gray-600 dark:text-gray-400">Comment: {req.comment}</p>}
                <p className="text-xs text-gray-500 dark:text-gray-400">Requested At: {req.requestedAt}</p>
              </div>
            ))}
          </div>
        )}
      </section>
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Providers in Cloud Alliances</h2>
        {acceptedNodes.length === 0 ? (
          <p className="text-gray-600 dark:text-gray-400">No providers in Cloud alliances.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white shadow rounded-lg overflow-hidden dark:bg-gray-800">
              <thead className="bg-gray-100 dark:bg-gray-700">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400">Name</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400">Node ID</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400">Status</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400">Apps Accepted</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400">Maintenance</th>
                  <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 dark:text-gray-400">Actions</th>
                </tr>
              </thead>
              <tbody>
                {acceptedNodes.map(node => (
                  <tr key={node.id} className="border-b border-gray-200 dark:border-gray-700">
                    <td className="px-4 py-2 text-gray-900 dark:text-gray-100">{node.name}</td>
                    <td className="px-4 py-2 text-gray-900 dark:text-gray-100">{node.id}</td>
                    <td className="px-4 py-2 text-gray-900 dark:text-gray-100">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        nodes.find(n => n.id === node.id)?.status === 'Online'
                          ? 'bg-green-500 text-white'
                          : 'bg-red-500 text-white'
                      }`}>
                        {nodes.find(n => n.id === node.id)?.status || 'Offline'}
                      </span>
                    </td>
                    <td className="px-4 py-2 text-gray-900 dark:text-gray-100">{node.apps.join(', ')}</td>
                    <td className="px-4 py-2 text-gray-900 dark:text-gray-100">
                      {maintenanceRequests.filter(req => req.nodeId === node.id).length > 0
                        ? maintenanceRequests.filter(req => req.nodeId === node.id).map(req => (
                            <p key={req.id}>{req.start} to {req.end}</p>
                          ))
                        : <span className="text-gray-500 dark:text-gray-400">None</span>
                      }
                    </td>
                    <td className="px-4 py-2 text-center">
                      <button onClick={() => setScheduleNodeId(node.id)} className="px-2 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600">Schedule Maintenance</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
      {scheduleNodeId && (
        <section className="mb-8 p-4 border border-yellow-300 rounded">
          <h3 className="text-lg font-semibold mb-2">Schedule Maintenance for Node {scheduleNodeId}</h3>
          <form onSubmit={handleSchedule} className="space-y-4">
            <div>
              <label className="block">Start
                <input type="datetime-local" value={scheduleStart} onChange={e => setScheduleStart(e.target.value)} required className="mt-1 p-2 border rounded w-full dark:bg-gray-700 dark:text-gray-100" />
              </label>
            </div>
            <div>
              <label className="block">End
                <input type="datetime-local" value={scheduleEnd} onChange={e => setScheduleEnd(e.target.value)} required className="mt-1 p-2 border rounded w-full dark:bg-gray-700 dark:text-gray-100" />
              </label>
            </div>
            <div>
              <label className="block">Comment
                <textarea value={scheduleComment} onChange={e => setScheduleComment(e.target.value)} placeholder="Optional note" className="mt-1 p-2 border rounded w-full dark:bg-gray-700 dark:text-gray-100" />
              </label>
            </div>
            <div className="flex space-x-2">
              <button type="submit" className="px-4 py-2 bg-green-500 text-white rounded">Submit</button>
              <button type="button" onClick={() => setScheduleNodeId('')} className="px-4 py-2 bg-gray-300 rounded">Cancel</button>
            </div>
          </form>
        </section>
      )}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Pending Maintenance Windows</h2>
        {maintenanceRequests.length === 0 ? (
          <p className="text-gray-600 dark:text-gray-400">No pending maintenance windows.</p>
        ) : (
          <div className="space-y-4">
            {maintenanceRequests.map(req => (
              <div key={req.id} className="p-4 bg-white dark:bg-gray-700 rounded shadow">
                <p className="font-medium text-gray-900 dark:text-gray-100">Node ID: {req.nodeId}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Start: {req.start}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">End: {req.end}</p>
                {req.comment && <p className="text-sm text-gray-600 dark:text-gray-400">Comment: {req.comment}</p>}
                <p className="text-xs text-gray-500 dark:text-gray-400">Requested At: {req.requestedAt}</p>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Nodes;
