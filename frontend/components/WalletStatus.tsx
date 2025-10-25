// components/WalletStatus.tsx
'use client';

import { useAccount, useBalance } from 'wagmi';

export function WalletStatus() {
  const { address, isConnected, chain } = useAccount();
  const { data: balance } = useBalance({
    address: address,
  });

  if (!isConnected) {
    return (
      <div className="p-4 bg-gray-50 rounded-lg border">
        <p className="text-gray-600 text-sm">
          🔗 Connect your wallet to access real DeFi yield data and cross-chain bridging
        </p>
      </div>
    );
  }

  return (
    <div className="p-4 bg-green-50 rounded-lg border border-green-200">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-green-800">
            Connected to {chain?.name || 'Unknown Network'}
          </p>
          <p className="text-xs text-green-600">
            {address?.slice(0, 8)}...{address?.slice(-6)}
          </p>
        </div>
        {balance && (
          <div className="text-right">
            <p className="text-sm font-medium text-green-800">
              {parseFloat(balance.formatted).toFixed(4)} {balance.symbol}
            </p>
            <p className="text-xs text-green-600">Balance</p>
          </div>
        )}
      </div>
    </div>
  );
}