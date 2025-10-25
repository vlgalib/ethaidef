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
export const CONTRACT_ADDRESS = "0x1Dbedf3bEaad6b0e3569d96951B18DB9e23f3352";