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
};