# 🚀 Contract Deployment Instructions

## Prerequisites

### 1. Install Foundry (Windows)

```powershell
# Option 1: Download and run foundryup-init.exe
# Visit: https://github.com/foundry-rs/foundry/releases
# Download foundryup-init.exe and run it

# Option 2: Using Git Bash
curl -L https://foundry.paradigm.xyz | bash
source ~/.bashrc
foundryup
```

### 2. Verify Installation

```bash
forge --version
cast --version
```

### 3. Get Sepolia Testnet ETH

Visit faucets:
- https://sepoliafaucet.com/
- https://www.alchemy.com/faucets/ethereum-sepolia
- https://faucets.chain.link/sepolia

## 🔑 Deployment Steps

### 1. Set Private Key

```bash
# Use a testnet-only wallet!
export PRIVATE_KEY=0x1234567890abcdef...
```

### 2. Deploy to Sepolia

```bash
cd contracts
./deploy.sh sepolia
```

### 3. Expected Output

```
🚀 Deploying CrossYieldVault to sepolia...
📦 Building contracts...
🔗 Deploying to sepolia...
✅ Contract deployed successfully!
📍 Address: 0x742d35Cc...
🔍 Explorer: https://sepolia.blockscout.com/address/0x742d35Cc...
📝 Updating frontend contract address...
🎉 Deployment complete!
```

## ⚠️ Alternative: Manual Deployment

If script fails, deploy manually:

```bash
# Build contract
forge build

# Deploy with verification
forge create CrossYieldVault \
  --rpc-url https://ethereum-sepolia.publicnode.com \
  --private-key $PRIVATE_KEY \
  --verify

# Update frontend manually
# Edit frontend/lib/contract.ts
# Replace: 0x742d35Cc6200000000000000000000000000000000
# With: YOUR_DEPLOYED_ADDRESS
```

## 🔧 Troubleshooting

### Error: "forge not found"
```bash
# Restart terminal and try:
source ~/.bashrc
forge --version
```

### Error: "insufficient funds"
```bash
# Get more Sepolia ETH from faucets
# Check balance:
cast balance $YOUR_ADDRESS --rpc-url https://ethereum-sepolia.publicnode.com
```

### Error: "deployment failed"
```bash
# Check gas price and network:
cast gas-price --rpc-url https://ethereum-sepolia.publicnode.com
```

## 📊 After Deployment

1. **Update Envio Config:**
```yaml
# indexer/config.yaml
contracts:
  - name: CrossYieldVault
    address: "YOUR_DEPLOYED_ADDRESS"
```

2. **Verify Contract:**
Visit Sepolia Blockscout and check your contract is verified

3. **Test Frontend:**
Connect wallet and check if contract integration works

## 🎯 Ready Files

- ✅ `CrossYieldVault.sol` - Smart contract ready
- ✅ `foundry.toml` - Configuration ready  
- ✅ `deploy.sh` - Deployment script ready
- ✅ Frontend integration - Will auto-update

**All systems ready for deployment!** 🚀