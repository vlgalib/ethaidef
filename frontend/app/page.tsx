'use client';

import { useState } from 'react';
import { analyzeYield, type AnalyzeResponse } from '@/lib/api';

export default function Home() {
  const [amount, setAmount] = useState('1000');
  const [minApy, setMinApy] = useState('5.0');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalyzeResponse | null>(null);
  const [error, setError] = useState('');

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-800 mb-8">
          ETH AI Defense 🤖
        </h1>

        <div className="bg-white rounded-lg shadow-xl p-8 mb-6">
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
        </div>

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
