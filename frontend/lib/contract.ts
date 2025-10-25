// lib/contract.ts
export const BLOCKSCOUT_BASE_URL = 'https://sepolia.blockscout.com';

export function getBlockscoutTxUrl(txHash: string): string {
  return `${BLOCKSCOUT_BASE_URL}/tx/${txHash}`;
}

export function getBlockscoutAddressUrl(address: string): string {
  return `${BLOCKSCOUT_BASE_URL}/address/${address}`;
}

export function getBlockscoutContractUrl(address: string): string {
  return `${BLOCKSCOUT_BASE_URL}/address/${address}?tab=contract`;
}

// Demo contract address for testing
export const CONTRACT_ADDRESS = "0x742d35Cc6200000000000000000000000000000000";