// lib/wallet-config.ts
import { createAppKit } from '@reown/appkit'
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi'
import { mainnet, arbitrum, base, sepolia, arbitrumSepolia, baseSepolia } from 'wagmi/chains'
import { http } from 'wagmi'

// Get projectId from environment variables
const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || 'e8b9edb13577566316699eb0b0e07ac6'

if (!projectId) {
  throw new Error('Missing NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID')
}

// Define chains array explicitly
const chains = [mainnet, arbitrum, base, sepolia, arbitrumSepolia, baseSepolia];

// Create wagmi adapter
const wagmiAdapter = new WagmiAdapter({
  ssr: true,
  projectId,
  chains,
  networks: chains,
  transports: {
    [mainnet.id]: http('https://ethereum.publicnode.com'),
    [arbitrum.id]: http('https://arbitrum.publicnode.com'),
    [base.id]: http('https://base.publicnode.com'),
    [sepolia.id]: http('https://ethereum-sepolia.publicnode.com'),
    [arbitrumSepolia.id]: http('https://arbitrum-sepolia.publicnode.com'),
    [baseSepolia.id]: http('https://base-sepolia.publicnode.com'),
  }
})

// Create modal
export const modal = createAppKit({
  adapters: [wagmiAdapter],
  projectId,
  networks: chains,
  metadata: {
    name: 'CrossYield Agent',
    description: 'AI-Powered DeFi Yield Optimizer',
    url: 'https://ethaidef.vercel.app',
    icons: ['https://ethaidef.vercel.app/favicon.ico']
  },
  features: {
    analytics: true,
  },
  enableOnramp: false,
  enableSwaps: false,
})

export { wagmiAdapter }
export const config = wagmiAdapter.wagmiConfig