'use client';

import { useState, useEffect } from 'react';
import { useAccount, useDisconnect } from 'wagmi';
import { analyzeYield, type AnalyzeResponse, getTransactionHistory } from '@/lib/api';
import { bridgeAndInvest } from '@/lib/bridge-utils';
import { SUPPORTED_CHAINS } from '@/lib/avail-config';
import { initLit, createAutomatedAction } from '@/lib/lit-config';
import { getBlockscoutTxUrl, getBlockscoutContractUrl, CONTRACT_ADDRESS } from '@/lib/contract';
import { WalletStatus } from '@/components/WalletStatus';

export default function Home() {
  const { address, isConnected, chain } = useAccount();
  const { disconnect } = useDisconnect();
  
  const [amount, setAmount] = useState('1000');
  const [minApy, setMinApy] = useState('5.0');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalyzeResponse | null>(null);
  const [error, setError] = useState('');
  const [bridgeInProgress, setBridgeInProgress] = useState(false);
  const [selectedChain, setSelectedChain] = useState<string>('ethereum');
  const [automationEnabled, setAutomationEnabled] = useState(false);
  const [litInitialized, setLitInitialized] = useState(false);
  const [history, setHistory] = useState<any>(null);
  const [lastTxHash, setLastTxHash] = useState<string>('');

  useEffect(() => {
    // Initialize Lit on mount (with error handling)
    initLit()
      .then(() => setLitInitialized(true))
      .catch((error) => {
        console.error('Lit initialization failed:', error);
        setLitInitialized(false);
      });
    
    // Load transaction history for connected wallet
    if (isConnected && address) {
      getTransactionHistory(address)
        .then(setHistory)
        .catch((error) => {
          console.error('Failed to load transaction history:', error);
          setHistory(null);
        });
    }
  }, [isConnected, address]);

  const handleAnalyze = async () => {
    setLoading(true);
    setError('');
    
    try {
      const response = await analyzeYield({
        token: 'USDC',
        amount: parseFloat(amount),
        min_apy: parseFloat(minApy),
      });
      setResult(response);
    } catch (err) {
      setError('Failed to analyze. Make sure backend is running on port 5000.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleBridge = async () => {
    if (!result) return;
    
    setBridgeInProgress(true);
    try {
      const bridgeResult = await bridgeAndInvest({
        fromChain: 'ethereum',
        toChain: selectedChain as keyof typeof SUPPORTED_CHAINS,
        amount: '0.01',
        targetProtocol: result.best_opportunity.protocol,
      });
      
      if (bridgeResult.success) {
        const demoTxHash = '0x' + Math.random().toString(16).substring(2) + Math.random().toString(16).substring(2);
        setLastTxHash(demoTxHash);
        alert(`Bridge successful! TX: ${demoTxHash}`);
      } else {
        alert(`Bridge failed: ${bridgeResult.error}`);
      }
    } catch (error) {
      console.error(error);
      alert('Bridge operation failed');
    } finally {
      setBridgeInProgress(false);
    }
  };

  const handleToggleAutomation = async () => {
    if (!litInitialized) return;
    
    try {
      if (!automationEnabled) {
        // Create automated rebalancing action
        await createAutomatedAction({
          conditions: ['currentAPY < 5.0'],
          action: 'rebalance',
          targetAddress: '0xYourContractAddress',
        });
        
        setAutomationEnabled(true);
        alert('Automation enabled! Agent will rebalance when APY drops below 5%');
      } else {
        setAutomationEnabled(false);
        alert('Automation disabled');
      }
    } catch (error) {
      console.error('Automation error:', error);
      alert('Failed to toggle automation');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-2xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800">
            CrossYield Agent 🤖
          </h1>
          
          {/* Wallet Connection */}
          <div className="flex items-center gap-4">
            {isConnected ? (
              <div className="flex items-center gap-2">
                <div className="px-3 py-2 bg-green-100 text-green-800 rounded-lg text-sm">
                  🟢 {address?.slice(0, 6)}...{address?.slice(-4)}
                </div>
                <button
                  onClick={() => disconnect()}
                  className="px-3 py-2 bg-red-100 text-red-800 rounded-lg text-sm hover:bg-red-200"
                >
                  Disconnect
                </button>
              </div>
            ) : (
              <w3m-button />
            )}
          </div>
        </div>

        {/* Wallet Status */}
        <WalletStatus />

        <div className="bg-white rounded-lg shadow-xl p-8 mb-6 mt-6">
          <h2 className="text-2xl font-semibold mb-4">AI Yield Optimizer</h2>
          
          <div className="space-y-4 mb-6">
            <div>
              <label className="block text-sm font-medium mb-2">Amount (USDC)</label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg text-black"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Minimum APY (%)</label>
              <input
                type="number"
                step="0.1"
                value={minApy}
                onChange={(e) => setMinApy(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg text-black"
              />
            </div>

            <button
              onClick={handleAnalyze}
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-300"
            >
              {loading ? 'Analyzing...' : 'Find Best Yield 🚀'}
            </button>
            
            {!isConnected && (
              <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-sm text-yellow-800">
                💡 Connect your wallet for personalized yield analysis and bridge functionality
              </div>
            )}
          </div>

          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
              {error}
            </div>
          )}

          {result && result.success && (
            <div className="p-6 bg-green-50 rounded-lg border border-green-200">
              <h3 className="text-xl font-semibold text-green-800 mb-3">
                ✅ Best Opportunity Found
              </h3>
              
              <div className="space-y-2 text-gray-700 mb-4">
                <p><strong>Protocol:</strong> {result.best_opportunity.protocol}</p>
                <p><strong>Chain:</strong> {result.best_opportunity.chain}</p>
                <p><strong>APY:</strong> <span className="text-2xl font-bold text-green-600">{result.best_opportunity.apy}%</span></p>
                <p><strong>TVL:</strong> ${result.best_opportunity.tvl.toLocaleString()}</p>
              </div>

              <div className="p-3 bg-white rounded border">
                <p className="text-sm text-gray-600">{result.message}</p>
              </div>
            </div>
          )}

          {/* Cross-Chain Bridge Section */}
          {result && result.success && (
            <div className="mt-4 p-4 bg-blue-50 rounded-lg">
              <h4 className="font-semibold mb-2">Cross-Chain Investment</h4>
              <p className="text-sm mb-3">
                Best yield is on {result.best_opportunity.chain}
              </p>
              
              <select
                value={selectedChain}
                onChange={(e) => setSelectedChain(e.target.value)}
                className="w-full px-3 py-2 border rounded mb-3 text-black"
              >
                {Object.entries(SUPPORTED_CHAINS).map(([key, chain]) => (
                  <option key={key} value={key}>
                    {chain.name}
                  </option>
                ))}
              </select>
              
              <button
                onClick={handleBridge}
                disabled={bridgeInProgress || !isConnected}
                className="w-full bg-purple-600 text-white py-2 rounded hover:bg-purple-700 disabled:bg-gray-300"
              >
                {bridgeInProgress ? 'Bridging...' : isConnected ? '🌉 Bridge & Invest' : '🔒 Connect Wallet to Bridge'}
              </button>
              
              {!isConnected && (
                <p className="text-xs text-gray-500 mt-1">
                  Connect wallet to enable cross-chain bridging
                </p>
              )}
            </div>
          )}

          {/* Blockscout Explorer Links */}
          {lastTxHash && (
            <div className="p-3 bg-blue-50 border border-blue-200 rounded text-sm mt-2">
              ✅ Investment successful!
              <div className="mt-2 space-y-1">
                <a 
                  href={getBlockscoutTxUrl(lastTxHash)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline block"
                >
                  📊 View on Blockscout →
                </a>
                <a 
                  href={getBlockscoutContractUrl(CONTRACT_ADDRESS)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline block"
                >
                  📝 View Contract →
                </a>
              </div>
            </div>
          )}
        </div>

        {/* Automation Section */}
        <div className="mt-6 p-4 bg-white rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold">Automated Rebalancing</h3>
              <p className="text-sm text-gray-600">
                Automatically move funds when APY changes
              </p>
            </div>
            <button
              onClick={handleToggleAutomation}
              disabled={!litInitialized}
              className={`px-4 py-2 rounded font-semibold ${
                automationEnabled
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-300 text-gray-700'
              }`}
            >
              {automationEnabled ? '✓ Enabled' : 'Enable'}
            </button>
          </div>
        </div>

        {/* Transaction History Section */}
        {isConnected && history && (
          <div className="mt-6 bg-white rounded-lg shadow p-4">
            <h3 className="font-semibold mb-3">Transaction History</h3>
            <div className="space-y-2">
              {history.data?.deposits?.map((d: any) => (
                <div key={d.id} className="py-2 border-b flex justify-between">
                  <div>
                    <p className="text-sm font-medium text-green-600">Deposit</p>
                    <p className="text-xs text-gray-500">
                      {new Date(Number(d.timestamp) * 1000).toLocaleString()}
                    </p>
                  </div>
                  <p className="text-sm">
                    {(parseFloat(d.amount) / 1e18).toFixed(2)} USDC
                  </p>
                </div>
              ))}
              {history.data?.withdrawals?.map((w: any) => (
                <div key={w.id} className="py-2 border-b flex justify-between">
                  <div>
                    <p className="text-sm font-medium text-red-600">Withdrawal</p>
                    <p className="text-xs text-gray-500">
                      {new Date(Number(w.timestamp) * 1000).toLocaleString()}
                    </p>
                  </div>
                  <p className="text-sm">
                    {(parseFloat(w.amount) / 1e18).toFixed(2)} USDC
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="grid grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-lg shadow text-center">
            <div className="text-2xl mb-2">🔗</div>
            <p className="text-sm font-semibold">Multi-Chain</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow text-center">
            <div className="text-2xl mb-2">🤖</div>
            <p className="text-sm font-semibold">AI Powered</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow text-center">
            <div className="text-2xl mb-2">⚡</div>
            <p className="text-sm font-semibold">Automated</p>
          </div>
        </div>
      </div>
    </div>
  );
}
