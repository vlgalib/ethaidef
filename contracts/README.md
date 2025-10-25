# CrossYield Smart Contracts

## Overview

The CrossYieldVault contract is a demonstration contract for the CrossYield Agent project. It allows users to:

- Deposit ETH and specify their preferred DeFi protocol
- Withdraw funds at any time
- Change their preferred protocol
- Track total deposits across the platform

**⚠️ Important**: This is a demo contract. Real yield optimization happens through established DeFi protocols (Aave V3, Compound V3, etc.) via their APIs and not through this contract.

## Contract Details

- **Contract Name**: CrossYieldVault
- **Minimum Deposit**: 0.001 ETH
- **Events**: Deposit, Withdraw, ProtocolChanged
- **Functions**: deposit, withdraw, changeProtocol, getBalance, getPreferredProtocol, getStats

## Deployment

### Prerequisites

1. Install Foundry:
```bash
curl -L https://foundry.paradigm.xyz | bash
foundryup
```

2. Set up environment variables:
```bash
export PRIVATE_KEY=0x... # Your testnet private key
export ETHERSCAN_API_KEY=... # Optional, for verification
```

### Deploy to Testnets

```bash
# Ethereum Sepolia
./deploy.sh sepolia

# Arbitrum Sepolia  
./deploy.sh arbitrum_sepolia

# Base Sepolia
./deploy.sh base_sepolia
```

### Manual Deployment

```bash
# Build
forge build

# Deploy to Sepolia
forge create CrossYieldVault \
  --rpc-url https://ethereum-sepolia.publicnode.com \
  --private-key $PRIVATE_KEY \
  --verify

# Deploy to Arbitrum Sepolia
forge create CrossYieldVault \
  --rpc-url https://arbitrum-sepolia.publicnode.com \
  --private-key $PRIVATE_KEY
```

## Testing

```bash
# Run tests
forge test

# Run tests with gas report
forge test --gas-report

# Run specific test
forge test --match-test testDeposit
```

## Integration

After deployment:

1. **Update Frontend**: The deployment script automatically updates `frontend/lib/contract.ts` with the new address
2. **Update Envio Indexer**: Add the contract address to `indexer/config.yaml`
3. **Verify on Explorer**: Check the contract on Blockscout or Etherscan

## Usage in CrossYield Agent

The contract integrates with the CrossYield Agent by:

1. Tracking user preferences for DeFi protocols
2. Emitting events that are indexed by Envio HyperIndex
3. Providing demo functionality for the Blockscout explorer integration
4. Serving as a simple example of vault mechanics

## Security

- ✅ ReentrancyGuard not needed (simple ETH transfers)
- ✅ Minimum deposit requirement
- ✅ Balance checks before withdrawal
- ✅ Event emission for transparency
- ⚠️ Demo contract - not audited for production use

## Real Protocol Integration

The actual yield optimization happens through:

- **Aave V3**: Direct API calls to lending pools
- **Compound V3**: Protocol-specific market interactions  
- **Uniswap V3**: Liquidity pool yield farming
- **Cross-chain**: Avail Nexus SDK for bridging

This contract serves as a user interface layer and preference storage system.