import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';

// SLA Disclaimer component to avoid duplication
const SLADisclaimer: React.FC = () => (
  <div className="mb-4 p-4 bg-gray-100 dark:bg-gray-800 rounded">
    <h3 className="text-lg font-semibold mb-2">Service Level Agreement</h3>
    <ul className="list-disc list-inside text-sm space-y-1 text-gray-700 dark:text-gray-300">
      <li>The app you are deploying is on the ThreeFold Grid deployed on a node from one of our Cloud provider partners.</li>
      <li>Cloud providers aim to ensure 99.9% uptime for their nodes, and maintenance windows may arise.</li>
      <li>In the case of a maintenance window, you will be notified on this Dashboard.</li>
      <li>You can set a basic or quantum safe storage backup of your app, the same uptime applies for those nodes.</li>
      <li>You can also make local backup to your own machine if you want.</li>
      <li>Apart from this, if the app VM and the backup VM go down, you can lose all your data and progress.</li>
      <li>Be aware of this before continuing.</li>
    </ul>
  </div>
);

const NewDeployment: React.FC = () => {
  const { appType } = useParams<{ appType?: string }>();
  // Available application templates
  const appCategories = [
    { category: 'Compute', apps: [{ id: 'vm', name: 'Virtual Machine' }, { id: 'kubernetes', name: 'Kubernetes' }] },
    { category: 'Storage', apps: [
      { id: 'basic-storage', name: 'Basic Storage' },
      { id: 'quantum-safe-storage', name: 'Quantum Safe Storage' },
    ]},
    { category: 'Applications', apps: [{ id: 'nextcloud', name: 'Nextcloud' }, { id: 'open-webui', name: 'Open WebUI' }, { id: 'livekit', name: 'Livekit' }] },
  ];
  const selectedApp = appCategories.flatMap(cat => cat.apps).find(app => app.id === appType);
  const appName = selectedApp?.name || 'Deployment';

  // Prefix mapping for appType
  const prefixMap: Record<string, string> = {
    vm: 'vm',
    kubernetes: 'k8s',
    'quantum-safe-storage': 'qs',
    'basic-storage': 'bs',
    nextcloud: 'nc',
    'open-webui': 'ow',
    livekit: 'lk',
  };

  // Icon mapping for deployment apps
  const appIcons: Record<string, string> = {
    vm: '🖥️',
    kubernetes: '☸️',
    'quantum-safe-storage': '🔐',
    'basic-storage': '🗄️',
    nextcloud: '☁️',
    'open-webui': '🌐',
    livekit: '🎥',
  };

  // Deployment name state
  const [name, setName] = useState<string>('');
  // Regenerate default name when appType changes
  useEffect(() => {
    if (!appType) {
      setName('');
    } else {
      const prefix = prefixMap[appType] || appType;
      const rand = Math.random().toString(36).substr(2, 6);
      setName(`${prefix}-${rand}`);
    }
  }, [appType]);
  const [region, setRegion] = useState('north-america');
  const [backup, setBackup] = useState(false);
  const [storageType, setStorageType] = useState<'basic'|'quantum'>('basic');
  const [mode, setMode] = useState<'basic' | 'advanced'>('basic');
  const [slaAgreed, setSlaAgreed] = useState<boolean>(false);
  const [nodes, setNodes] = useState<string[]>([]);
  const [selectedNode, setSelectedNode] = useState<string>('');
  const navigate = useNavigate();

  useEffect(() => {
    const mockNodes = ['node-1', 'node-2', 'node-3'];
    setNodes(mockNodes);
    setSelectedNode(mockNodes[0]);
  }, []);

  const handleBasicSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log({ name, region, backup, storageType });
    // TODO: integrate deployment API
    navigate('/dashboard');
  };

  const handleAdvancedSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log({ name, node: selectedNode, backup, storageType });
    // TODO: integrate advanced deployment API
    navigate('/dashboard');
  };

  if (!appType) {
    return (
      <div className="max-w-6xl mx-auto py-10 text-gray-900 dark:text-gray-100">
        <h1 className="text-3xl font-bold mb-6">Select Application to Deploy</h1>
        {appCategories.map(cat => (
          <div key={cat.category} className="mb-8">
            <h2 className="text-xl font-semibold mb-4">{cat.category}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {cat.apps.map(app => (
                <Link key={app.id} to={`/dashboard/new/${app.id}`} className="flex flex-col items-center p-6 border rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 dark:border-gray-700 dark:bg-gray-800">
                  <span className="text-4xl mb-2">{appIcons[app.id]}</span>
                  <span className="font-medium mt-2">{app.name}</span>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }

  const handleBasicSwitch = () => {
    setMode('basic');
    setSlaAgreed(false);
  };

  const handleAdvancedSwitch = () => {
    setMode('advanced');
    setSlaAgreed(false);
  };

  return (
    <div className="max-w-md mx-auto py-10">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold mb-4">New {appName}</h1>
        <div className="flex justify-center space-x-4">
          <button
            type="button"
            className={`px-4 py-2 rounded ${mode === 'basic' ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-700'}`}
            onClick={handleBasicSwitch}
          >
            Basic
          </button>
          <button
            type="button"
            className={`px-4 py-2 rounded ${mode === 'advanced' ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-700'}`}
            onClick={handleAdvancedSwitch}
          >
            Advanced
          </button>
        </div>
      </div>
      {mode === 'basic' ? (
        <form onSubmit={handleBasicSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700">Deployment Name</label>
            <p className="text-sm text-gray-500 mb-1">Default: <span className="font-mono">{name}</span> (editable)</p>
            <input
              type="text"
              className="w-full px-3 py-2 border rounded bg-white dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600"
              value={name}
              onChange={e => setName(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-gray-700">Region</label>
            <select
              className="w-full px-3 py-2 border rounded bg-white dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600"
              value={region}
              onChange={e => setRegion(e.target.value)}
            >
              <option value="north-america">North America</option>
              <option value="south-america">South America</option>
              <option value="africa">Africa</option>
              <option value="europe">Europe</option>
              <option value="australia">Australia</option>
            </select>
          </div>
          <div className="flex items-center mb-4">
            <button type="button" onClick={() => setBackup(!backup)} className={`px-3 py-1 rounded ${backup ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-700'}`}>
              {backup ? 'Backup: ON' : 'Backup: OFF'}
            </button>
          </div>
          {backup && (
            <div className="flex justify-around mt-4">
              <label htmlFor="storage-basic" className="flex items-center">
                <input id="storage-basic" name="storageType" type="radio" value="basic" checked={storageType==='basic'} onChange={() => setStorageType('basic')} className="mr-2" />
                <span>🗄️ Basic Storage</span>
              </label>
              <label htmlFor="storage-quantum" className="flex items-center">
                <input id="storage-quantum" name="storageType" type="radio" value="quantum" checked={storageType==='quantum'} onChange={() => setStorageType('quantum')} className="mr-2" />
                <span>🔒 Quantum Safe Storage</span>
              </label>
            </div>
          )}
          <SLADisclaimer />
          <div className="flex items-center mb-4">
            <input id="sla-basic" type="checkbox" checked={slaAgreed} onChange={e => setSlaAgreed(e.target.checked)} className="mr-2" />
            <label htmlFor="sla-basic" className="text-gray-700 dark:text-gray-300">I have read and agree to the SLA</label>
          </div>
          <button
            type="submit"
            disabled={!slaAgreed}
            className={`w-full px-3 py-2 rounded text-white ${slaAgreed ? 'bg-green-500 hover:bg-green-600' : 'bg-gray-300 cursor-not-allowed'}`}
          >
            Deploy
          </button>
        </form>
      ) : (
        <form onSubmit={handleAdvancedSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700">Deployment Name</label>
            <p className="text-sm text-gray-500 mb-1">Default: <span className="font-mono">{name}</span> (editable)</p>
            <input
              type="text"
              className="w-full px-3 py-2 border rounded bg-white dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600"
              value={name}
              onChange={e => setName(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-gray-700">Node Selection</label>
            <select
              className="w-full px-3 py-2 border rounded bg-white dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600"
              value={selectedNode}
              onChange={e => setSelectedNode(e.target.value)}
            >
              {nodes.map(node => {
                const id = node.split('-')[1];
                return (
                  <option key={node} value={node}>Node ID: {id}</option>
                );
              })}
            </select>
          </div>
          <div className="flex items-center mb-4">
            <button type="button" onClick={() => setBackup(!backup)} className={`px-3 py-1 rounded ${backup ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-700'}`}>
              {backup ? 'Backup: ON' : 'Backup: OFF'}
            </button>
          </div>
          {backup && (
            <div className="flex justify-around mt-4">
              <label htmlFor="storage-basic-adv" className="flex items-center">
                <input id="storage-basic-adv" name="storageType" type="radio" value="basic" checked={storageType==='basic'} onChange={() => setStorageType('basic')} className="mr-2" />
                <span>🗄️ Basic Storage</span>
              </label>
              <label htmlFor="storage-quantum-adv" className="flex items-center">
                <input id="storage-quantum-adv" name="storageType" type="radio" value="quantum" checked={storageType==='quantum'} onChange={() => setStorageType('quantum')} className="mr-2" />
                <span>🔒 Quantum Safe Storage</span>
              </label>
            </div>
          )}
          <SLADisclaimer />
          <div className="flex items-center mb-4">
            <input id="sla-adv" type="checkbox" checked={slaAgreed} onChange={e => setSlaAgreed(e.target.checked)} className="mr-2" />
            <label htmlFor="sla-adv" className="text-gray-700 dark:text-gray-300">I have read and agree to the SLA</label>
          </div>
          <button
            type="submit"
            disabled={!slaAgreed}
            className={`w-full px-3 py-2 rounded text-white ${slaAgreed ? 'bg-green-500 hover:bg-green-600' : 'bg-gray-300 cursor-not-allowed'}`}
          >
            Deploy
          </button>
        </form>
      )}
    </div>
  );
};

export default NewDeployment;
