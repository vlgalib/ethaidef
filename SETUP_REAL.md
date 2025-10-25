# Real Integration Setup Guide

## 🔧 Setting Up Real Integrations

This guide helps you configure CrossYield Agent with real DeFi protocols, wallet connection, and live data.

### 1. Get Required API Keys

#### Reown (WalletConnect) Project ID
1. Go to [Reown Cloud](https://cloud.reown.com)
2. Create a new project
3. Copy your Project ID
4. Add to `frontend/.env.local`:
   ```
   NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your-project-id-here
   ```

#### Groq API Key (Already configured)
- Already set in `backend/.env`
- For new key: [Groq Console](https://console.groq.com/)

### 2. Real DeFi Protocol APIs

The app now fetches real yield data from:
- **DefiLlama API**: Live TVL and APY data
- **Aave V3 Subgraphs**: Real lending rates
- **Compound V3**: Protocol rates
- **Uniswap V3**: Liquidity pool yields

### 3. Pyth Network Integration

Real-time price feeds already integrated:
- USDC/USD price feed
- ETH/USD price feed
- Price confidence scoring

### 4. Start With Real Data

```bash
# 1. Frontend with wallet connection
cd frontend
npm install
npm run dev

# 2. Backend with real APIs
cd ../backend
pip install -r requirements.txt
python main.py
```

### 5. Test Real Functionality

1. **Connect Wallet**: Click "Connect Wallet" button
2. **Real Yield Analysis**: Get live APY data from protocols
3. **Cross-Chain Bridge**: Test with small amounts on testnets
4. **Transaction History**: View real on-chain data

### 6. Real vs Demo Mode

| Feature | Demo Mode | Real Mode |
|---------|-----------|-----------|
| Yield Data | Mock APYs | Live DefiLlama + Subgraph APIs |
| Wallet | Not connected | Real wallet connection |
| Bridge | Simulated | Avail Nexus SDK integration |
| Prices | Static | Pyth Network oracles |
| History | Mock data | Envio GraphQL indexer |

### 7. Testnet Configuration

Current testnet support:
- Ethereum Sepolia
- Arbitrum Sepolia  
- Base Sepolia

### 8. Production Considerations

For mainnet deployment:
1. Update chain configurations
2. Add mainnet RPC endpoints
3. Configure production API endpoints
4. Add proper error handling
5. Implement rate limiting

### 9. Troubleshooting

**Wallet not connecting?**
- Check Project ID in .env.local
- Ensure HTTPS in production

**No yield data?**
- APIs might be rate limited
- Check console for errors
- Backend might be offline

**Bridge fails?**
- Ensure sufficient testnet tokens
- Check network compatibility
- Verify contract addresses

### 10. Security Notes

- Never commit real API keys
- Use environment variables
- Test on testnets first
- Audit smart contract interactions

---

Your app now has:
✅ Real wallet connection (Reown)  
✅ Live DeFi yield data (DefiLlama, Aave, etc.)  
✅ Real price feeds (Pyth Network)  
✅ Cross-chain bridging (Avail Nexus)  
✅ On-chain transaction indexing (Envio)  
✅ Blockchain explorer integration (Blockscout)