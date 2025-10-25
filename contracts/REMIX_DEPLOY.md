# 🌐 Deploy using Remix IDE (Alternative)

If Foundry installation is problematic, use Remix IDE:

## 1. Open Remix IDE
Visit: https://remix.ethereum.org/

## 2. Create Contract File
1. In file explorer, create `CrossYieldVault.sol`
2. Copy content from our `SimpleVault.sol` file
3. Change contract name from `SimpleVault` to `CrossYieldVault`

## 3. Compile Contract
1. Go to "Solidity Compiler" tab
2. Select compiler version: 0.8.20+
3. Click "Compile CrossYieldVault.sol"
4. Check for compilation success ✅

## 4. Deploy to Sepolia
1. Go to "Deploy & Run Transactions" tab
2. Environment: "Injected Provider - MetaMask"
3. Make sure MetaMask is connected to Sepolia network
4. Select contract: "CrossYieldVault"
5. Click "Deploy"
6. Confirm transaction in MetaMask

## 5. Copy Deployed Address
After successful deployment:
1. Copy contract address from Remix
2. Update `frontend/lib/contract.ts`:
   ```typescript
   export const CONTRACT_ADDRESS = "YOUR_DEPLOYED_ADDRESS";
   ```

## 6. Verify on Blockscout
Visit: https://sepolia.blockscout.com/
Search for your contract address to verify deployment.

**This method works without installing Foundry!** ✨