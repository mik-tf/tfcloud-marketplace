import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';

interface Operator {
  id: string;
  name: string;
  status: string;
  createdAt: string;
}

interface JoinRequest {
  id: string;
  nodeId: string;
  network: string;
  apps: string[];
  email: string;
  slaAgreed: boolean;
  comment: string;
  requestedAt: string;
}

interface NodeEntry {
  id: string;
  specs: string;
  apps: string[];
  status: string;
}

interface MaintenanceRequest {
  id: string;
  nodeId: string;
  start: string;
  end: string;
  comment?: string;
  requestedAt: string;
}

const Ops: React.FC = () => {
  const [operators, setOperators] = useState<Operator[]>([]);
  const [mnemonic, setMnemonic] = useState<string>('');
  const [showMnemonic, setShowMnemonic] = useState<boolean>(false);
  const [totalCost, setTotalCost] = useState<number>(0);
  const [autoSwap, setAutoSwap] = useState<boolean>(false);
  const [alertsEnabled, setAlertsEnabled] = useState<boolean>(false);
  const [swapAmount, setSwapAmount] = useState<number>(() => parseFloat(localStorage.getItem('swapAmount') || '0'));
  const [swapPeriod, setSwapPeriod] = useState<string>(() => localStorage.getItem('swapPeriod') || 'hour');
  const [tftPrice, setTftPrice] = useState<number>(0);
  const [tftBalance, setTftBalance] = useState<number>(0);
  const [joinRequests, setJoinRequests] = useState<JoinRequest[]>([]);
  const [messageDrafts, setMessageDrafts] = useState<{ [key: string]: string }>({});
  const [acceptedNodes, setAcceptedNodes] = useState<NodeEntry[]>([]);
  const [maintenanceRequests, setMaintenanceRequests] = useState<MaintenanceRequest[]>([]);
  const appList = useMemo(() => [
    { id: 'vm', name: 'Virtual Machine', defaultPrice: 10 },
    { id: 'kubernetes', name: 'Kubernetes', defaultPrice: 20 },
    { id: 'basic-storage', name: 'Basic Storage', defaultPrice: 5 },
    { id: 'quantum-safe-storage', name: 'Quantum Safe Storage', defaultPrice: 7 },
    { id: 'nextcloud', name: 'Nextcloud', defaultPrice: 8 },
    { id: 'open-webui', name: 'Open WebUI', defaultPrice: 6 },
    { id: 'livekit', name: 'LiveKit', defaultPrice: 9 },
  ], []);
  const [pricingConfig, setPricingConfig] = useState<Record<string, { percent: number; amount: number }>>(() => {
    const saved = localStorage.getItem('pricingConfig');
    if (saved) return JSON.parse(saved);
    const initial: Record<string, { percent: number; amount: number }> = {};
    appList.forEach(app => { initial[app.id] = { percent: 0, amount: 0 }; });
    return initial;
  });
  useEffect(() => { localStorage.setItem('pricingConfig', JSON.stringify(pricingConfig)); }, [pricingConfig]);

  useEffect(() => {
    // TODO: fetch real data for operators
    setOperators([
      { id: '1', name: 'Operator #1', status: 'Active', createdAt: '2025-04-26' },
      { id: '2', name: 'Operator #2', status: 'Pending', createdAt: '2025-04-25' },
    ]);
  }, []);

  useEffect(() => {
    const saved = localStorage.getItem('mnemonic') || '';
    setMnemonic(saved);
  }, []);

  useEffect(() => {
    const savedAuto = localStorage.getItem('autoSwap') === 'true';
    setAutoSwap(savedAuto);
    const savedAlerts = localStorage.getItem('alertsEnabled') === 'true';
    setAlertsEnabled(savedAlerts);
  }, []);

  useEffect(() => {
    // TODO: fetch total hourly cost for this dashboard instance
    setTotalCost(0);
  }, []);

  useEffect(() => {
    localStorage.setItem('autoSwap', String(autoSwap));
  }, [autoSwap]);

  useEffect(() => {
    localStorage.setItem('alertsEnabled', String(alertsEnabled));
  }, [alertsEnabled]);

  useEffect(() => {
    localStorage.setItem('swapAmount', String(swapAmount));
  }, [swapAmount]);

  useEffect(() => {
    localStorage.setItem('swapPeriod', swapPeriod);
  }, [swapPeriod]);

  useEffect(() => {
    fetch('https://api.coingecko.com/api/v3/simple/price?ids=threefold-token&vs_currencies=usd')
      .then(res => res.json())
      .then(data => setTftPrice(data['threefold-token']?.usd || 0))
      .catch(() => { });
  }, []);

  useEffect(() => {
    // Load TFT balance (placeholder - replace with TFChain API)
    const saved = parseFloat(localStorage.getItem('tftBalance') || '0');
    setTftBalance(saved);
  }, []);

  useEffect(() => {
    setJoinRequests([
      { id: 'req1', nodeId: '1', network: 'Main', apps: ['Virtual Machine', 'Nextcloud'], email: 'node1@example.com', slaAgreed: true, comment: 'Please review my node for co-op', requestedAt: '2025-04-27' },
      { id: 'req2', nodeId: '2', network: 'Test', apps: ['LiveKit'], email: 'node2@example.com', slaAgreed: false, comment: '', requestedAt: '2025-04-26' },
    ]);
  }, []);

  useEffect(() => {
    setAcceptedNodes([
      { id: '1', specs: '4 cores, 16GB RAM', apps: ['HDD-backed QSFS Storage'], status: 'Online' },
      { id: '2', specs: '2 cores, 8GB RAM', apps: ['Basic Storage'], status: 'Offline' },
      { id: '13', specs: '8 cores, 32GB RAM', apps: ['LiveKit Video Conferencing', 'GPU-optimized AI & WebUI'], status: 'Online' },
      { id: '14', specs: '6 cores, 16GB RAM', apps: ['Kubernetes'], status: 'Offline' },
      { id: '15', specs: '12 cores, 48GB RAM', apps: ['Quantum Safe Storage'], status: 'Online' },
      { id: '432', specs: '16 cores, 64GB RAM', apps: ['GPU-optimized AI & WebUI'], status: 'Offline' },
    ]);
  }, []);

  useEffect(() => {
    setMaintenanceRequests([
      { id: 'mw1', nodeId: '13', start: '2025-05-01T10:00', end: '2025-05-01T12:00', comment: 'Storage update', requestedAt: '2025-04-27' },
      { id: 'mw2', nodeId: '432', start: '2025-05-02T02:00', end: '2025-05-02T04:00', requestedAt: '2025-04-27' },
    ]);
  }, []);

  const discountTiers = useMemo(() => {
    const hoursPerMonth = 24 * 30;
    return [
      { months: 0, discount: 0, required: 0 },
      { months: 3, discount: 20, required: totalCost * hoursPerMonth * 3 },
      { months: 6, discount: 30, required: totalCost * hoursPerMonth * 6 },
      { months: 12, discount: 40, required: totalCost * hoursPerMonth * 12 },
      { months: 36, discount: 60, required: totalCost * hoursPerMonth * 36 },
    ];
  }, [totalCost]);
  const currentTier = discountTiers.filter(t => t.required <= tftBalance).pop() || discountTiers[0];
  const nextTier = discountTiers.find(t => t.required > tftBalance);

  const handleSaveMnemonic = () => {
    localStorage.setItem('mnemonic', mnemonic);
    alert('Mnemonic saved');
  };

  const handleAutoSwap = () => {
    if (!autoSwap) {
      alert('Please enable auto-swap payments before initiating an automated swap.');
      return;
    }
    alert(`Automated swap initiated: $${swapAmount} per ${swapPeriod}`);
  };

  const handleSendAlerts = () => {
    if (!alertsEnabled) {
      alert('Please enable low-balance alerts before sending alerts.');
      return;
    }
    alert('Low-balance alerts sent');
  };

  const handleDraftChange = (id: string, msg: string) => {
    setMessageDrafts(prev => ({ ...prev, [id]: msg }));
  };

  const handleAcceptRequest = (id: string) => {
    const msg = messageDrafts[id] || '';
    setJoinRequests(prev => prev.filter(r => r.id !== id));
    alert(`Accepted request ${id}${msg ? ` with message: ${msg}` : ''}`);
  };

  const handleRejectRequest = (id: string) => {
    const msg = messageDrafts[id] || '';
    setJoinRequests(prev => prev.filter(r => r.id !== id));
    alert(`Rejected request ${id}${msg ? ` with message: ${msg}` : ''}`);
  };

  return (
    <div className="w-full max-w-6xl mx-auto py-6 px-4 sm:px-6 md:py-10 text-gray-900 dark:text-gray-100">
      <div className="flex flex-col gap-4 mb-6">
        <h1 className="text-3xl font-bold">Cloud Operator</h1>
        <p className="text-gray-600 dark:text-gray-400">
          As a Cloud Operator, you bridge the gap between infrastructure and users. Configure pricing, manage Cloud alliances with Cloud Providers, and create a seamless experience for Cloud Users while benefiting from staking discounts and revenue sharing.
        </p>
      </div>
      {/* TFChain Mnemonic */}
      <section className="mb-6 md:mb-8">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-2 gap-2">
          <h2 className="text-xl font-semibold">TFChain Mnemonic</h2>
          <button type="button" onClick={() => setShowMnemonic(!showMnemonic)} className="text-sm text-green-500 hover:underline self-start sm:self-auto">
            {showMnemonic ? 'Hide' : 'Show'} Mnemonic
          </button>
        </div>
        <input
          type={showMnemonic ? 'text' : 'password'}
          className="w-full p-2 border border-gray-300 rounded bg-white dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400"
          value={mnemonic}
          onChange={e => setMnemonic(e.target.value)}
          placeholder="Enter your TFChain mnemonic"
        />
        <div className="flex items-center mt-2">
          <button onClick={handleSaveMnemonic} className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">
            Save Mnemonic
          </button>
        </div>
        <div className="mt-4 p-4 bg-gray-100 dark:bg-gray-800 rounded">
          <p className="text-gray-900 dark:text-gray-100">Current TFChain balance: <strong>{tftBalance} TFT</strong></p>
          <p className="text-gray-900 dark:text-gray-100">Current discount: <strong>{currentTier.discount}%</strong></p>
          {nextTier && (
            <p className="text-gray-900 dark:text-gray-100">
              Stake <strong>{(nextTier.required - tftBalance).toFixed(2)} TFT</strong> more to reach the {nextTier.discount}% tier ({nextTier.months} months).
            </p>
          )}
        </div>
      </section>
      {/* Pricing Settings */}
      <section className="mb-6 md:mb-8">
        <h2 className="text-xl font-semibold mb-2">Pricing Settings</h2>
        <div className="overflow-x-auto bg-white dark:bg-gray-800 p-2 sm:p-4 rounded-lg">
          <table className="w-full table-auto text-sm md:text-base">
            <thead>
              <tr>
                <th className="px-2 sm:px-4 py-2 text-left">App</th>
                <th className="px-2 sm:px-4 py-2 text-left">% Markup</th>
                <th className="px-2 sm:px-4 py-2 text-left">$ Markup</th>
                <th className="px-2 sm:px-4 py-2 text-left">Base</th>
                <th className="px-2 sm:px-4 py-2 text-left">Final</th>
              </tr>
            </thead>
            <tbody>
              {appList.map(app => {
                const cfg = pricingConfig[app.id];
                const base = app.defaultPrice;
                const final = base * (1 + cfg.percent/100) + cfg.amount;
                return (
                  <tr key={app.id} className="border-t border-gray-200 dark:border-gray-700">
                    <td className="px-2 sm:px-4 py-2 whitespace-nowrap">{app.name}</td>
                    <td className="px-2 sm:px-4 py-2">
                      <input type="number" value={cfg.percent} onChange={e => {
                        const v = parseFloat(e.target.value)||0;
                        setPricingConfig(prev => ({ ...prev, [app.id]: { ...prev[app.id], percent: v } }));
                      }} className="w-16 sm:w-20 p-1 border rounded bg-white dark:bg-gray-700 dark:text-gray-100" />
                    </td>
                    <td className="px-2 sm:px-4 py-2">
                      <input type="number" value={cfg.amount} onChange={e => {
                        const v = parseFloat(e.target.value)||0;
                        setPricingConfig(prev => ({ ...prev, [app.id]: { ...prev[app.id], amount: v } }));
                      }} className="w-16 sm:w-24 p-1 border rounded bg-white dark:bg-gray-700 dark:text-gray-100" />
                    </td>
                    <td className="px-2 sm:px-4 py-2">${base.toFixed(2)}</td>
                    <td className="px-2 sm:px-4 py-2">${final.toFixed(2)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Tokens per Hour</h2>
        <p className="text-gray-900 dark:text-gray-100">
          Estimated token usage per hour: <span className="font-bold">{totalCost}</span> TFT
          {tftPrice > 0 && (
            <span> (~${(totalCost * tftPrice).toFixed(2)} USD)</span>
          )}
        </p>
      </section>
      <section className="mb-6 md:mb-8">
        <h2 className="text-xl font-semibold mb-2">ThreeFold Connect Automated Swap Payments</h2>
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-2">
          <button
            onClick={handleAutoSwap}
            disabled={!autoSwap}
            className={`px-4 py-2 rounded text-white ${autoSwap ? 'bg-green-500 hover:bg-green-600' : 'bg-gray-300 cursor-not-allowed'} w-full sm:w-auto`}
          >
            Initiate Automated Swap
          </button>
          <label className="inline-flex items-center">
            <input type="checkbox" checked={autoSwap} onChange={e => setAutoSwap(e.target.checked)} className="mr-2" />
            Enable auto-swap payments
          </label>
        </div>
        {autoSwap && (
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 mt-2">
            <input
              type="number"
              min="0"
              className="w-full sm:w-1/3 p-2 border border-gray-300 rounded bg-white dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400"
              value={swapAmount}
              onChange={e => setSwapAmount(parseFloat(e.target.value) || 0)}
              placeholder="Amount (USD)"
            />
            <select
              className="w-full sm:w-auto p-2 border border-gray-300 rounded bg-white dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600"
              value={swapPeriod}
              onChange={e => setSwapPeriod(e.target.value)}
            >
              <option value="hour">Hour</option>
              <option value="day">Day</option>
              <option value="week">Week</option>
            </select>
          </div>
        )}
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
          This cross-swap swaps USDC (on Stellar) to TFT and bridges it to TFChain for a specified amount every period (e.g., per hour or day) to pay for TFChain deployments.
        </p>
      </section>
      <section className="mb-6 md:mb-8">
        <h2 className="text-xl font-semibold mb-2">Alerts</h2>
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-2">
          <button
            onClick={handleSendAlerts}
            disabled={!alertsEnabled}
            className={`px-4 py-2 rounded text-white ${alertsEnabled ? 'bg-green-500 hover:bg-green-600' : 'bg-gray-300 cursor-not-allowed'} w-full sm:w-auto`}
          >
            Send Low-Balance Alerts
          </button>
          <label className="inline-flex items-center">
            <input type="checkbox" checked={alertsEnabled} onChange={e => setAlertsEnabled(e.target.checked)} className="mr-2" />
            Enable low-balance alerts
          </label>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
          Send low-balance alerts to TF Connect App (if TFT balance &lt; threshold within 24h)
        </p>
      </section>
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Cloud Provider Join Requests</h2>
        {joinRequests.length === 0 ? (
          <p className="text-gray-600 dark:text-gray-400">No pending requests.</p>
        ) : (
          <div className="space-y-4">
            {joinRequests.map(req => (
              <div key={req.id} className="p-4 bg-white dark:bg-gray-700 rounded shadow">
                <div className="mb-2">
                  <p className="font-medium text-gray-900 dark:text-gray-100">Node ID: {req.nodeId}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Network: {req.network}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Apps: {req.apps.join(', ')}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Email: {req.email}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">SLA Agreed: {req.slaAgreed ? 'Yes' : 'No'}</p>
                  {req.comment && <p className="text-sm text-gray-600 dark:text-gray-400">Comment: {req.comment}</p>}
                  <p className="text-xs text-gray-500 dark:text-gray-400">Requested At: {req.requestedAt}</p>
                </div>
                <textarea
                  className="w-full p-2 mb-2 border border-gray-300 rounded bg-white dark:bg-gray-800 dark:text-gray-100"
                  placeholder="Message to requester"
                  value={messageDrafts[req.id] || ''}
                  onChange={e => handleDraftChange(req.id, e.target.value)}
                />
                <div className="flex space-x-2">
                  <button onClick={() => handleAcceptRequest(req.id)} className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">Accept</button>
                  <button onClick={() => handleRejectRequest(req.id)} className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600">Reject</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
      <section className="mb-6 md:mb-8">
        <h2 className="text-xl font-semibold mb-2">Accepted Cloud Alliance Providers</h2>
        {acceptedNodes.length === 0 ? (
          <p className="text-gray-600 dark:text-gray-400">No cloud providers accepted yet.</p>
        ) : (
          <div className="overflow-x-auto -mx-4 sm:mx-0">
            <div className="inline-block min-w-full align-middle">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 bg-white shadow rounded-lg overflow-hidden dark:bg-gray-800">
                <thead className="bg-gray-100 dark:bg-gray-700">
                  <tr>
                    <th scope="col" className="px-2 sm:px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400">Node ID</th>
                    <th scope="col" className="px-2 sm:px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400">Specs</th>
                    <th scope="col" className="px-2 sm:px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400">Status</th>
                    <th scope="col" className="px-2 sm:px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400">Apps</th>
                    <th scope="col" className="px-2 sm:px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400">Maintenance</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {acceptedNodes.map(node => (
                    <tr key={node.id} className="hover:bg-gray-50 dark:hover:bg-gray-750">
                      <td className="px-2 sm:px-4 py-2 text-sm text-gray-900 dark:text-gray-100">{node.id}</td>
                      <td className="px-2 sm:px-4 py-2 text-sm text-gray-900 dark:text-gray-100">{node.specs}</td>
                      <td className="px-2 sm:px-4 py-2 text-sm text-gray-900 dark:text-gray-100">
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          node.status === 'Online' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
                        }`}>
                          {node.status}
                        </span>
                      </td>
                      <td className="px-2 sm:px-4 py-2 text-sm text-gray-900 dark:text-gray-100 max-w-[150px] truncate">{node.apps.join(', ')}</td>
                      <td className="px-2 sm:px-4 py-2 text-sm text-gray-900 dark:text-gray-100">
                        {maintenanceRequests.filter(req => req.nodeId === node.id).length > 0
                          ? maintenanceRequests.filter(req => req.nodeId === node.id).map(req => (
                              <p key={req.id} className="text-xs">{req.start} to {req.end}</p>
                            ))
                          : <span className="text-gray-500 dark:text-gray-400">None</span>
                        }
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </section>
    </div>
  );
};

export default Ops;
