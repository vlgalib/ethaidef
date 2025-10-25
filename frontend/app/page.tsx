'use client';

import { useState, useEffect } from 'react';
import { useAccount, useDisconnect } from 'wagmi';
import { analyzeYield, type AnalyzeResponse, getTransactionHistory } from '@/lib/api';
import { bridgeAndInvest } from '@/lib/bridge-utils';
import { SUPPORTED_CHAINS } from '@/lib/avail-config';
import { initLit, createAutomatedAction } from '@/lib/lit-config';
import { getBlockscoutTxUrl, getBlockscoutContractUrl, CONTRACT_ADDRESS } from '@/lib/contract';
import { WalletStatus } from '@/components/WalletStatus';
import { AlertBox, AlertContent, AlertNote } from '@/components/AlertBox';
import { ToastContainer, useToast } from '@/components/Toast';

export default function Home() {
  const { address, isConnected, chain } = useAccount();
  const { disconnect } = useDisconnect();
  const { toasts, removeToast, showSuccess, showError, showWarning, showInfo } = useToast();
  
  const [amount, setAmount] = useState('1000');
  const [minApy, setMinApy] = useState('5.0');
  const [selectedCurrency, setSelectedCurrency] = useState('ETH');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalyzeResponse | null>(null);
  const [currentProtocolIndex, setCurrentProtocolIndex] = useState(0);
  const [error, setError] = useState('');
  const [bridgeInProgress, setBridgeInProgress] = useState(false);
  const [selectedChain, setSelectedChain] = useState<string>('ethereum');
  const [automationEnabled, setAutomationEnabled] = useState(false);
  const [litInitialized, setLitInitialized] = useState(false);
  const [history, setHistory] = useState<any>(null);
  const [lastTxHash, setLastTxHash] = useState<string>('');

  useEffect(() => {
    // Disconnect any existing wallet connection on mount
    if (isConnected) {
      disconnect();
    }
    
    // Initialize Lit on mount (with error handling)
    initLit()
      .then(() => setLitInitialized(true))
      .catch((error) => {
        console.error('Lit initialization failed:', error);
        setLitInitialized(false);
      });
  }, []); // Only run on mount

  useEffect(() => {
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
        token: selectedCurrency,
        amount: parseFloat(amount),
        min_apy: parseFloat(minApy),
      });
      setResult(response);
      setCurrentProtocolIndex(0); // Reset to first protocol
      
      // Show success toast if protocols found
      if (response.success && response.all_opportunities && response.all_opportunities.length > 0) {
        showSuccess(`Found ${response.all_opportunities.length} yield opportunities`, 'Analysis Complete!');
      } else if (response.success && (!response.all_opportunities || response.all_opportunities.length === 0)) {
        showWarning(`No protocols found with minimum ${minApy}% APY`, 'No Results');
      }
    } catch (err) {
      setError('Failed to analyze. Make sure backend is running on port 5000.');
      showError('Please check your connection and try again', 'Analysis Failed');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handlePreviousProtocol = () => {
    if (result?.all_opportunities && currentProtocolIndex > 0) {
      setCurrentProtocolIndex(currentProtocolIndex - 1);
    }
  };

  const handleNextProtocol = () => {
    if (result?.all_opportunities && currentProtocolIndex < result.all_opportunities.length - 1) {
      setCurrentProtocolIndex(currentProtocolIndex + 1);
    }
  };

  const getCurrentOpportunity = () => {
    if (result?.all_opportunities && result.all_opportunities.length > 0) {
      return result.all_opportunities[currentProtocolIndex];
    }
    return result?.best_opportunity;
  };

  const handleBridge = async () => {
    if (!result) return;
    
    const currentOpp = getCurrentOpportunity() || result.best_opportunity;
    
    setBridgeInProgress(true);
    try {
      const bridgeResult = await bridgeAndInvest({
        fromChain: 'ethereum',
        toChain: selectedChain as keyof typeof SUPPORTED_CHAINS,
        amount: '0.01',
        targetProtocol: currentOpp.protocol,
      });
      
      if (bridgeResult.success) {
        const demoTxHash = '0x' + Math.random().toString(16).substring(2) + Math.random().toString(16).substring(2);
        setLastTxHash(demoTxHash);
        showSuccess(`Transaction hash: ${demoTxHash}`, 'Bridge Successful!');
      } else {
        showError(bridgeResult.error || 'Unknown bridge error', 'Bridge Failed');
      }
    } catch (error) {
      console.error(error);
      showError('Please check your connection and try again', 'Bridge Operation Failed');
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
        showSuccess('Agent will rebalance when APY drops below 5%', 'Automation Enabled!');
      } else {
        setAutomationEnabled(false);
        showInfo('Automatic rebalancing has been turned off', 'Automation Disabled');
      }
    } catch (error) {
      console.error('Automation error:', error);
      showError('Please try again or check your connection', 'Failed to Toggle Automation');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      {/* Toast Notifications */}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
      
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
              <label className="block text-sm font-medium mb-2">Currency</label>
              <select
                value={selectedCurrency}
                onChange={(e) => setSelectedCurrency(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg text-black"
              >
                <option value="ETH">ETH - Ethereum</option>
                <option value="USDC">USDC - USD Coin</option>
                <option value="PYUSD">PYUSD - PayPal USD</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Amount ({selectedCurrency})</label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg text-black"
                placeholder={`Enter amount in ${selectedCurrency}`}
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
            <AlertBox type="error">
              {error}
            </AlertBox>
          )}

          {/* No opportunities found - API returned success: false */}
          {result && !result.success && (
            <AlertBox type="warning" title="No Suitable Protocols Found">
              <AlertContent>
                <p>{result.message}</p>
                <p className="mt-2">Your search criteria:</p>
                <ul className="list-disc list-inside ml-4 mt-1">
                  <li>Minimum APY: <strong>{minApy}%</strong></li>
                  <li>Token: <strong>{selectedCurrency}</strong></li>
                  <li>Amount: <strong>${parseFloat(amount).toLocaleString()}</strong></li>
                </ul>
              </AlertContent>
              <AlertNote>
                💡 Try lowering your minimum APY requirement or check back later for new opportunities.
              </AlertNote>
            </AlertBox>
          )}

          {/* No opportunities found - API returned success: true but empty results */}
          {result && result.success && (!result.all_opportunities || result.all_opportunities.length === 0) && (
            <AlertBox type="warning" title="No Suitable Protocols Found">
              <AlertContent>
                <p>No protocols found matching your requirements:</p>
                <ul className="list-disc list-inside ml-4">
                  <li>Minimum APY: <strong>{minApy}%</strong></li>
                  <li>Token: <strong>{selectedCurrency}</strong></li>
                  <li>Amount: <strong>${parseFloat(amount).toLocaleString()}</strong></li>
                </ul>
              </AlertContent>
              <AlertNote>
                💡 Try lowering your minimum APY requirement or check back later for new opportunities.
              </AlertNote>
            </AlertBox>
          )}

          {result && result.success && result.all_opportunities && result.all_opportunities.length > 0 && (
            <AlertBox type="success" className="p-6">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xl font-semibold text-green-800">
                  {currentProtocolIndex === 0 ? 'Best' : 'Alternative'} Opportunity Found
                </h3>
                
                {/* Navigation arrows */}
                {result.all_opportunities && result.all_opportunities.length > 1 && (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handlePreviousProtocol}
                      disabled={currentProtocolIndex === 0}
                      className="p-2 rounded-full bg-white border hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      ←
                    </button>
                    <span className="text-sm text-gray-600">
                      {currentProtocolIndex + 1} / {result.all_opportunities.length}
                    </span>
                    <button
                      onClick={handleNextProtocol}
                      disabled={currentProtocolIndex === result.all_opportunities.length - 1}
                      className="p-2 rounded-full bg-white border hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      →
                    </button>
                  </div>
                )}
              </div>
              
              {(() => {
                const currentOpp = getCurrentOpportunity();
                return currentOpp ? (
                  <div className="space-y-2 text-gray-700 mb-4">
                    <p><strong>Protocol:</strong> {currentOpp.protocol}</p>
                    <p><strong>Chain:</strong> {currentOpp.chain}</p>
                    <p><strong>APY:</strong> <span className="text-2xl font-bold text-green-600">{currentOpp.apy}%</span></p>
                    <p><strong>TVL:</strong> ${currentOpp.tvl.toLocaleString()}</p>
                    {currentOpp.price_confidence && (
                      <p><strong>Price Confidence:</strong> {(currentOpp.price_confidence * 100).toFixed(1)}%</p>
                    )}
                  </div>
                ) : null;
              })()}

              <AlertNote>
                {result.message}
              </AlertNote>
              
              {/* Show total opportunities count */}
              {result.all_opportunities && result.all_opportunities.length > 1 && (
                <div className="mt-3 text-center text-sm text-gray-500">
                  Found {result.all_opportunities.length} opportunities above {minApy}% APY
                </div>
              )}
            </AlertBox>
          )}

          {/* Cross-Chain Bridge Section */}
          {result && result.success && result.all_opportunities && result.all_opportunities.length > 0 && (
            <AlertBox type="info" className="mt-4">
              <h4 className="font-semibold mb-2">Cross-Chain Investment</h4>
              <p className="text-sm mb-3">
                Selected yield is on {getCurrentOpportunity()?.chain || result.best_opportunity.chain}
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
            </AlertBox>
          )}

          {/* Blockscout Explorer Links */}
          {lastTxHash && (
            <AlertBox type="success" className="mt-2">
              <AlertContent>
                <p>Investment successful!</p>
                <div className="mt-2 space-y-1">
                  <a 
                    href={getBlockscoutTxUrl(lastTxHash, chain?.name)}
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
              </AlertContent>
            </AlertBox>
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
              {automationEnabled && (
                <p className="text-xs text-green-600 mt-1">
                  ✓ Active - Will rebalance when APY drops below 5%
                </p>
              )}
            </div>
            
            {/* Toggle Switch */}
            <div className="flex items-center gap-3">
              <span className={`text-sm ${automationEnabled ? 'text-gray-500' : 'text-gray-700 font-medium'}`}>
                Off
              </span>
              <button
                onClick={handleToggleAutomation}
                disabled={!litInitialized}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed ${
                  automationEnabled ? 'bg-green-600' : 'bg-gray-200'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    automationEnabled ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
              <span className={`text-sm ${automationEnabled ? 'text-gray-700 font-medium' : 'text-gray-500'}`}>
                On
              </span>
            </div>
          </div>
          
          {!litInitialized && (
            <div className="mt-3 p-2 bg-yellow-50 border border-yellow-200 rounded text-xs text-yellow-800">
              ⏳ Initializing Lit Protocol automation framework...
            </div>
          )}
        </div>

        {/* Transaction History Section */}
        {isConnected && history && (
          <div className="mt-6 bg-white rounded-lg shadow p-4 min-h-[200px]">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold">Transaction History</h3>
              <span className="text-xs text-gray-500">
                {(history.data?.deposits?.length || 0) + (history.data?.withdrawals?.length || 0)} transactions
              </span>
            </div>
            
            {(!history.data?.deposits?.length && !history.data?.withdrawals?.length) ? (
              <div className="text-center py-8 text-gray-500">
                <p className="text-sm">No transactions found</p>
                <p className="text-xs mt-1">Transactions will appear here after you start using the platform</p>
              </div>
            ) : (
              <div className="space-y-3">
                {history.data?.deposits?.map((d: any) => (
                  <div key={d.id} className="p-3 bg-green-50 rounded-lg border border-green-200">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-medium text-green-700">📈 Deposit</p>
                          {d.hash && (
                            <a 
                              href={getBlockscoutTxUrl(d.hash, chain?.name)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs text-blue-600 hover:underline"
                            >
                              View TX ↗
                            </a>
                          )}
                        </div>
                        <p className="text-xs text-gray-600 mt-1">
                          {new Date(Number(d.timestamp) * 1000).toLocaleString()}
                        </p>
                        {d.from && (
                          <p className="text-xs text-gray-500 mt-1">
                            From: {d.from.slice(0, 6)}...{d.from.slice(-4)}
                          </p>
                        )}
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-green-700">
                          +{(parseFloat(d.amount) / 1e18).toFixed(4)} {(isConnected && chain?.nativeCurrency?.symbol) || 'ETH'}
                        </p>
                        {d.gasUsed && (
                          <p className="text-xs text-gray-500">
                            Gas: {parseInt(d.gasUsed).toLocaleString()}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                
                {history.data?.withdrawals?.map((w: any) => (
                  <div key={w.id} className="p-3 bg-red-50 rounded-lg border border-red-200">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-medium text-red-700">📉 Withdrawal</p>
                          {w.hash && (
                            <a 
                              href={getBlockscoutTxUrl(w.hash, chain?.name)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs text-blue-600 hover:underline"
                            >
                              View TX ↗
                            </a>
                          )}
                        </div>
                        <p className="text-xs text-gray-600 mt-1">
                          {new Date(Number(w.timestamp) * 1000).toLocaleString()}
                        </p>
                        {w.to && (
                          <p className="text-xs text-gray-500 mt-1">
                            To: {w.to.slice(0, 6)}...{w.to.slice(-4)}
                          </p>
                        )}
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-red-700">
                          -{(parseFloat(w.amount) / 1e18).toFixed(4)} {(isConnected && chain?.nativeCurrency?.symbol) || 'ETH'}
                        </p>
                        {w.gasUsed && (
                          <p className="text-xs text-gray-500">
                            Gas: {parseInt(w.gasUsed).toLocaleString()}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Spacer when wallet not connected to maintain consistent spacing */}
        {!isConnected && (
          <div className="mt-6" style={{ minHeight: '200px' }}></div>
        )}

        {/* Platform Features - Fixed spacing from content above */}
        <div className="mt-8 grid grid-cols-3 gap-4">
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
