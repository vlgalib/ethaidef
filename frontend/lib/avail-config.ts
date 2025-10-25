// lib/avail-config.ts
import { NexusSDK } from '@avail-project/nexus';

export const nexusClient = new NexusSDK({
  network: 'testnet', // Use testnet for development
});

export const SUPPORTED_CHAINS = {
  ethereum: {
    id: 11155111, // Sepolia
    name: 'Ethereum Sepolia',
  },
  arbitrum: {
    id: 421614, // Arbitrum Sepolia
    name: 'Arbitrum Sepolia',
  },
  base: {
    id: 84532, // Base Sepolia
    name: 'Base Sepolia',
  },
  polygon: {
    id: 80002, // Polygon Amoy (testnet)
    name: 'Polygon Amoy',
  },
  optimism: {
    id: 11155420, // Optimism Sepolia
    name: 'Optimism Sepolia',
  },
  bsc: {
    id: 97, // BSC Testnet
    name: 'BSC Testnet',
  },
};

// Mainnet chains configuration (ready for production)
export const MAINNET_CHAINS = {
  ethereum: {
    id: 1,
    name: 'Ethereum',
  },
  arbitrum: {
    id: 42161,
    name: 'Arbitrum One',
  },
  base: {
    id: 8453,
    name: 'Base',
  },
  polygon: {
    id: 137,
    name: 'Polygon',
  },
  optimism: {
    id: 10,
    name: 'Optimism',
  },
  bsc: {
    id: 56,
    name: 'BNB Smart Chain',
  },
  avalanche: {
    id: 43114,
    name: 'Avalanche',
  },
};