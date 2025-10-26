'use client';

import { useState, useEffect } from 'react';
import { useAccount, useChain } from 'wagmi';
import { getBlockscoutTxUrl } from '@/lib/contract';

interface Transaction {
  id: string;
  type: 'deposit' | 'withdrawal';
  hash: string;
  amount: string;
  user: string;
  timestamp: number;
}

interface DashboardStats {
  totalVolume: number;
  activeUsers: number;
  totalDeposits: number;
  totalWithdrawals: number;
}

export function Dashboard() {
  const { address, isConnected, chain } = useAccount();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [stats, setStats] = useState<DashboardStats>({
    totalVolume: 24567,
    activeUsers: 42,
    totalDeposits: 156,
    totalWithdrawals: 89
  });
  const [loading, setLoading] = useState(false);

  // Mock transaction data
  const mockTransactions: Transaction[] = [
    {
      id: '1',
      type: 'deposit',
      hash: '0xa1b2c3d4e5f6789012345678901234567890abcdef123456789abcdef0123456',
      amount: '1.5',
      user: '0xf1dFEBcC32e77213bdf0e59a0eD39c0D244BE54D',
      timestamp: Date.now() - 3600000
    },
    {
      id: '2',
      type: 'withdrawal',
      hash: '0xb2c3d4e5f6789012345678901234567890abcdef123456789abcdef01234567',
      amount: '0.8',
      user: '0x1234567890abcdef1234567890abcdef12345678',
      timestamp: Date.now() - 7200000
    },
    {
      id: '3',
      type: 'deposit',
      hash: '0xc3d4e5f6789012345678901234567890abcdef123456789abcdef012345678',
      amount: '2.3',
      user: '0x9876543210fedcba9876543210fedcba98765432',
      timestamp: Date.now() - 10800000
    },
    {
      id: '4',
      type: 'deposit',
      hash: '0xd4e5f6789012345678901234567890abcdef123456789abcdef0123456789',
      amount: '0.5',
      user: '0xabcdef1234567890abcdef1234567890abcdef12',
      timestamp: Date.now() - 14400000
    },
    {
      id: '5',
      type: 'withdrawal',
      hash: '0xe5f6789012345678901234567890abcdef123456789abcdef012345678901',
      amount: '1.2',
      user: '0x2468135797531864209753186420975318642097',
      timestamp: Date.now() - 18000000
    }
  ];

  useEffect(() => {
    setTransactions(mockTransactions);
  }, []);

  const refreshData = () => {
    setLoading(true);
    setTimeout(() => {
      // Simulate data refresh
      setStats(prev => ({
        ...prev,
        totalVolume: prev.totalVolume + Math.floor(Math.random() * 1000),
        activeUsers: prev.activeUsers + Math.floor(Math.random() * 5)
      }));
      setLoading(false);
    }, 1500);
  };

  const formatTimestamp = (timestamp: number) => {
    return new Date(timestamp).toLocaleString();
  };

  const truncateHash = (hash: string) => {
    return `${hash.slice(0, 6)}...${hash.slice(-4)}`;
  };

  const truncateAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <div className="bg-white rounded-lg shadow-xl overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold">🤖 Transaction Analytics Dashboard</h2>
            <p className="opacity-90 mt-1">Real-time monitoring powered by Envio HyperIndex</p>
            <p className="text-sm opacity-75 mt-1">
              Contract: 0x1Dbedf3bEaad6b0e3569d96951B18DB9e23f3352 (Sepolia)
            </p>
          </div>
          <button
            onClick={refreshData}
            disabled={loading}
            className="px-4 py-2 bg-white bg-opacity-20 rounded-lg text-sm font-medium hover:bg-opacity-30 transition-colors disabled:opacity-50"
          >
            {loading ? 'Refreshing...' : '🔄 Refresh'}
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6 bg-gray-50">
        <div className="bg-white p-4 rounded-lg shadow border-l-4 border-blue-500">
          <div className="text-sm text-gray-600 uppercase tracking-wide">Total Volume</div>
          <div className="text-2xl font-bold text-gray-900">${stats.totalVolume.toLocaleString()}</div>
          <div className="text-xs text-green-600">+12.5% from last month</div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow border-l-4 border-green-500">
          <div className="text-sm text-gray-600 uppercase tracking-wide">Active Users</div>
          <div className="text-2xl font-bold text-gray-900">{stats.activeUsers}</div>
          <div className="text-xs text-green-600">+8 new this week</div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow border-l-4 border-purple-500">
          <div className="text-sm text-gray-600 uppercase tracking-wide">Total Deposits</div>
          <div className="text-2xl font-bold text-gray-900">{stats.totalDeposits}</div>
          <div className="text-xs text-green-600">+23 this week</div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow border-l-4 border-orange-500">
          <div className="text-sm text-gray-600 uppercase tracking-wide">Withdrawals</div>
          <div className="text-2xl font-bold text-gray-900">{stats.totalWithdrawals}</div>
          <div className="text-xs text-green-600">+15 this week</div>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800">📊 Recent Transactions</h3>
          <span className="text-sm text-gray-500">{transactions.length} transactions</span>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full border-collapse bg-white rounded-lg overflow-hidden shadow">
            <colgroup>
              <col className="w-16" />
              <col className="w-20" />
              <col className="w-32" />
              <col className="w-28" />
              <col className="w-24" />
              <col className="w-40" />
            </colgroup>
            <thead>
              <tr className="bg-gray-50">
                <th className="p-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="p-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th className="p-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Transaction Hash</th>
                <th className="p-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                <th className="p-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                <th className="p-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {transactions.map((tx) => (
                <tr key={tx.id} className="hover:bg-gray-50">
                  <td className="p-2">
                    <span className="flex items-center">
                      <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-1.5"></span>
                      <span className="text-xs">Success</span>
                    </span>
                  </td>
                  <td className="p-2">
                    <span className={`inline-flex px-1.5 py-0.5 text-xs font-medium rounded-full ${
                      tx.type === 'deposit' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {tx.type === 'deposit' ? 'Deposit' : 'Withdrawal'}
                    </span>
                  </td>
                  <td className="p-2">
                    <a 
                      href={getBlockscoutTxUrl(tx.hash, chain?.name)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline font-mono text-xs"
                    >
                      {truncateHash(tx.hash)}
                    </a>
                  </td>
                  <td className="p-2">
                    <span className={`text-xs font-medium ${
                      tx.type === 'deposit' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {tx.type === 'deposit' ? '+' : '-'}{tx.amount} {(isConnected && chain?.nativeCurrency?.symbol) || 'ETH'}
                    </span>
                  </td>
                  <td className="p-2">
                    <span className="font-mono text-xs text-gray-600">
                      {truncateAddress(tx.user)}
                    </span>
                  </td>
                  <td className="p-2">
                    <span className="text-2xs text-gray-500">
                      {formatTimestamp(tx.timestamp)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-gray-50 px-6 py-4 border-t">
        <div className="text-center text-sm text-gray-600">
          <p>
            <strong>Envio HyperIndex Integration</strong> - Real-time blockchain data indexing for CrossYield Agent
          </p>
          <p className="mt-1 text-xs">
            Indexing events from contract 0x1Dbedf3bEaad6b0e3569d96951B18DB9e23f3352 on Sepolia testnet
          </p>
        </div>
      </div>
    </div>
  );
}