#!/bin/bash

# CrossYield Vault Deployment Script
# Usage: ./deploy.sh [network]
# Example: ./deploy.sh sepolia

NETWORK=${1:-sepolia}

echo "🚀 Deploying CrossYieldVault to $NETWORK..."

# Check if forge is installed
if ! command -v forge &> /dev/null; then
    echo "❌ Foundry not found. Please install: https://book.getfoundry.sh/"
    exit 1
fi

# Build contracts
echo "📦 Building contracts..."
forge build

if [ $? -ne 0 ]; then
    echo "❌ Build failed"
    exit 1
fi

# Deploy contract
echo "🔗 Deploying to $NETWORK..."

case $NETWORK in
    sepolia)
        RPC_URL="https://ethereum-sepolia.publicnode.com"
        ;;
    arbitrum_sepolia)
        RPC_URL="https://arbitrum-sepolia.publicnode.com"
        ;;
    base_sepolia)
        RPC_URL="https://base-sepolia.publicnode.com"
        ;;
    *)
        echo "❌ Unsupported network: $NETWORK"
        echo "Supported networks: sepolia, arbitrum_sepolia, base_sepolia"
        exit 1
        ;;
esac

# Check if private key is set
if [ -z "$PRIVATE_KEY" ]; then
    echo "⚠️  PRIVATE_KEY environment variable not set"
    echo "🔐 Use a testnet-only wallet for deployment"
    echo "💡 Example: export PRIVATE_KEY=0x..."
    exit 1
fi

# Deploy contract
DEPLOYED_ADDRESS=$(forge create CrossYieldVault \
    --rpc-url $RPC_URL \
    --private-key $PRIVATE_KEY \
    --verify \
    --json | jq -r '.deployedTo')

if [ "$DEPLOYED_ADDRESS" != "null" ] && [ ! -z "$DEPLOYED_ADDRESS" ]; then
    echo "✅ Contract deployed successfully!"
    echo "📍 Address: $DEPLOYED_ADDRESS"
    echo "🔍 Explorer: https://${NETWORK}.blockscout.com/address/${DEPLOYED_ADDRESS}"
    
    # Update frontend contract address
    echo "📝 Updating frontend contract address..."
    sed -i "s/0x742d35Cc6200000000000000000000000000000000/$DEPLOYED_ADDRESS/g" ../frontend/lib/contract.ts
    
    echo "🎉 Deployment complete!"
    echo "💡 Add this address to your Envio indexer config:"
    echo "   contracts:"
    echo "     - name: CrossYieldVault"
    echo "       address: \"$DEPLOYED_ADDRESS\""
else
    echo "❌ Deployment failed"
    exit 1
fi