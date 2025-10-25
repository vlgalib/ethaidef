// lib/contract.ts

// Network-specific block explorers
const BLOCK_EXPLORERS: Record<string, string> = {
  ethereum: 'https://etherscan.io',
  sepolia: 'https://sepolia.etherscan.io',
  arbitrum: 'https://arbiscan.io', 
  'arbitrum-sepolia': 'https://sepolia.arbiscan.io',
  base: 'https://basescan.org',
  'base-sepolia': 'https://sepolia.basescan.org',
  polygon: 'https://polygonscan.com',
  optimism: 'https://optimistic.etherscan.io'
};

export function getBlockExplorerUrl(chainName?: string): string {
  const chain = chainName?.toLowerCase() || 'sepolia';
  return BLOCK_EXPLORERS[chain] || BLOCK_EXPLORERS.sepolia;
}

export function getBlockscoutTxUrl(txHash: string, chainName?: string): string {
  const baseUrl = getBlockExplorerUrl(chainName);
  return `${baseUrl}/tx/${txHash}`;
}

export function getBlockscoutAddressUrl(address: string, chainName?: string): string {
  const baseUrl = getBlockExplorerUrl(chainName);
  return `${baseUrl}/address/${address}`;
}

export function getBlockscoutContractUrl(address: string, chainName?: string): string {
  const baseUrl = getBlockExplorerUrl(chainName);
  return `${baseUrl}/address/${address}`;
}

// Demo contract address for testing
export const CONTRACT_ADDRESS = "0x1Dbedf3bEaad6b0e3569d96951B18DB9e23f3352";