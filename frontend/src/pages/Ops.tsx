import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

interface Operator {
  id: string;
  name: string;
  status: string;
  createdAt: string;
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
      .catch(() => {});
  }, []);

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

  return (
    <div className="max-w-6xl mx-auto py-10 text-gray-900 dark:text-gray-100">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Dashboard Ops</h1>
      </div>
      <section className="mb-8">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-xl font-semibold">TFChain Mnemonic</h2>
          <button type="button" onClick={() => setShowMnemonic(!showMnemonic)} className="text-sm text-blue-500 hover:underline">
            {showMnemonic ? 'Hide' : 'Show'} Mnemonic
          </button>
        </div>
        <input
          type={showMnemonic ? 'text' : 'password'}
          className="w-full p-2 border rounded dark:bg-gray-700 dark:text-gray-100"
          value={mnemonic}
          onChange={e => setMnemonic(e.target.value)}
          placeholder="Enter your TFChain mnemonic"
        />
        <div className="flex items-center mt-2">
          <button onClick={handleSaveMnemonic} className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">
            Save Mnemonic
          </button>
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
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">ThreeFold Connect Automated Swap Payments</h2>
        <div className="flex items-center space-x-4">
          <button
            onClick={handleAutoSwap}
            disabled={!autoSwap}
            className={`px-4 py-2 rounded text-white ${autoSwap ? 'bg-green-500 hover:bg-green-600' : 'bg-gray-300 cursor-not-allowed'}`}
          >
            Initiate Automated Swap
          </button>
          <label className="inline-flex items-center">
            <input type="checkbox" checked={autoSwap} onChange={e => setAutoSwap(e.target.checked)} className="mr-2" />
            Enable auto-swap payments
          </label>
        </div>
        {autoSwap && (
          <div className="flex items-center space-x-4 mt-2">
            <input
              type="number"
              min="0"
              className="w-1/3 p-2 border rounded dark:bg-gray-700 dark:text-gray-100"
              value={swapAmount}
              onChange={e => setSwapAmount(parseFloat(e.target.value) || 0)}
              placeholder="Amount (USD)"
            />
            <select
              className="p-2 border rounded dark:bg-gray-700 dark:text-gray-100"
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
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Alerts</h2>
        <div className="flex items-center space-x-4">
          <button
            onClick={handleSendAlerts}
            disabled={!alertsEnabled}
            className={`px-4 py-2 rounded text-white ${alertsEnabled ? 'bg-green-500 hover:bg-green-600' : 'bg-gray-300 cursor-not-allowed'}`}
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
      {operators.length === 0 ? (
        <p className="text-gray-600 dark:text-gray-400">No operators yet.</p>
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
              {operators.map(op => (
                <tr key={op.id} className="border-b border-gray-200 dark:border-gray-700">
                  <td className="px-4 py-2 text-gray-900 dark:text-gray-100">{op.name}</td>
                  <td className="px-4 py-2 text-gray-900 dark:text-gray-100">{op.status}</td>
                  <td className="px-4 py-2 text-gray-900 dark:text-gray-100">{op.createdAt}</td>
                  <td className="px-4 py-2 text-right">
                    <Link to={`/ops/${op.id}`} className="text-green-500 dark:text-green-300 hover:underline">
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

export default Ops;
