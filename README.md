# 🌍 ETHOnline 2025 Submission – CrossYield Agent

<div align="center">

![ETHOnline 2025](https://img.shields.io/badge/ETHOnline-2025-brightgreen?style=for-the-badge&logo=ethereum)
![Hackathon](https://img.shields.io/badge/Hackathon-Submission-orange?style=for-the-badge)
![Status](https://img.shields.io/badge/Status-Demo%20Ready-blue?style=for-the-badge)

**🤖 AI-Powered DeFi Yield Optimizer with Cross-Chain Automation**

[![Contract](https://img.shields.io/badge/📜_Smart_Contract-Sepolia_Verified-green?style=flat-square)](https://sepolia.blockscout.com/address/0x1Dbedf3bEaad6b0e3569d96951B18DB9e23f3352)
[![License](https://img.shields.io/badge/📄_License-MIT-yellow?style=flat-square)](LICENSE)

</div>

---

AI-powered DeFi yield optimizer with automatic cross-chain rebalancing using advanced sponsor integrations.

## 🎯 Overview

CrossYield Agent is a hackathon project that combines artificial intelligence with decentralized finance to provide seamless cross-chain yield optimization. The system uses real oracle data, automated rebalancing, and cross-chain bridging to maximize user returns across multiple DeFi protocols.

## 🏗️ Architecture

- **Backend**: Python FastAPI with Groq AI integration
- **Frontend**: Next.js 15 with TypeScript and Tailwind CSS
- **Smart Contracts**: Solidity contracts deployed using Hardhat
- **AI**: Groq LLM (Llama 3.1) for yield analysis and recommendations
- **Blockchain**: Multi-chain support (Ethereum, Arbitrum, Base)

## ✨ Features

- 🤖 **AI-Powered Analysis**: Advanced yield opportunity analysis using Groq LLM
- 🌉 **Cross-Chain Bridging**: Seamless asset bridging via Avail Nexus SDK
- ⚡ **Automated Rebalancing**: Smart automation using Lit Protocol Vincent
- 📊 **Real-Time Oracle Data**: Live price feeds from Pyth Network
- 📈 **Transaction Indexing**: Complete history tracking via Envio HyperIndex
- 🔍 **Explorer Integration**: Transaction verification through Blockscout
- 🔗 **Multi-Protocol Support**: Integration with Aave V3, Compound V3, Morpho
- 💰 **Yield Optimization**: Automatic movement to highest yielding opportunities

## 🚀 Tech Stack

### Sponsor Technologies
- **Avail Nexus SDK** - Cross-chain bridging operations
- **Lit Protocol Vincent** - Automated rebalancing framework
- **Pyth Network** - Real-time oracle data feeds
- **Envio HyperIndex** - Transaction history indexing
- **Blockscout** - Blockchain explorer integration
- **Reown** - Wallet connection infrastructure

### Backend
- Python 3.10+
- FastAPI for API development
- Groq AI for LLM integration
- Pyth Network for price feeds

### Frontend
- Next.js 15
- TypeScript
- Tailwind CSS
- Responsive design

### Smart Contracts
- Solidity
- Hardhat for development and testing
- OpenZeppelin libraries

### AI & Data
- Groq LLM (Llama 3.1-8B-Instant)
- Real-time DeFi protocol APIs
- Market data aggregation

## 🔧 Development Setup

### Prerequisites
- Node.js 20+
- Python 3.10+
- Git
- Hardhat

### Installation

1. Clone the repository:
```bash
git clone https://github.com/vlgalib/ethaidef.git
cd ethaidef
```

2. Set up environment variables:
```bash
cp .env.example .env
# Fill in your API keys and configuration
```

3. Install dependencies and run:
```bash
# Backend
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: .\venv\Scripts\Activate.ps1
pip install -r requirements.txt
python main.py

# Frontend
cd ../frontend
npm install
npm run dev

# Smart Contracts
cd ../contracts
npm install
npx hardhat compile
```

## 🌐 Supported Protocols

- **Aave V3**: Lending and borrowing protocol
- **Compound V3**: Decentralized lending platform
- **Morpho**: Peer-to-peer lending optimization
- *More protocols coming soon...*

## 🔐 Security

- No private keys or sensitive data are stored in the repository
- All API keys are managed through environment variables
- Smart contracts follow security best practices
- Regular security audits and testing

## 📊 Demo

The application provides:
1. Yield opportunity analysis
2. AI-powered recommendations
3. Risk assessment
4. Real-time market data
5. Multi-chain protocol comparison

## 🛠️ API Endpoints

- `GET /health` - Health check
- `POST /api/analyze` - Analyze yield opportunities
- `GET /api/protocols` - List supported protocols
- `GET /api/chains` - List supported chains

## 📋 Avail Nexus SDK Integration

### Implementation Details
CrossYield Agent successfully integrates **Avail Nexus SDK** for cross-chain bridging functionality, enabling seamless asset movement between Ethereum, Arbitrum, and Base networks. Our implementation includes:

- **Cross-chain bridge operations** for yield optimization
- **AI-driven bridge routing** to highest APY chains
- **Automated bridging** based on yield differentials
- **Multi-testnet support** (Sepolia, Arbitrum Sepolia, Base Sepolia)

### Developer Experience (Rating: 8/10)
**Strengths:**
- Straightforward npm installation
- Excellent TypeScript support
- Intuitive bridge transaction API
- Reliable testnet configuration

**Areas for Improvement:**
- More comprehensive cross-chain examples needed
- Enhanced error messaging for misconfigurations
- Better TypeScript type definitions for responses
- Additional testnet faucet integration guidance

### Technical Achievement
The Avail Nexus SDK enabled our core cross-chain functionality with minimal custom code, making it an excellent choice for DeFi applications requiring seamless multi-chain operations.

**See `AVAIL_FEEDBACK.md` for detailed developer feedback and implementation insights.**

## 🔍 Blockscout SDK Integration

### Implementation Details
CrossYield Agent leverages **Blockscout SDK** for comprehensive blockchain explorer integration across multiple networks. Our implementation provides:

- **Multi-chain explorer support** (Etherscan, Arbiscan, Basescan, Polygonscan)
- **Network-aware transaction links** automatically routing to correct explorer
- **Smart contract verification** and source code viewing
- **Real-time transaction tracking** with direct explorer integration
- **Address and contract inspection** tools

### Live Contract Explorer
**🔗 View Our Contract on Blockscout:**
- **Sepolia Contract**: [0x1Dbedf3bEaad6b0e3569d96951B18DB9e23f3352](https://sepolia.blockscout.com/address/0x1Dbedf3bEaad6b0e3569d96951B18DB9e23f3352)
- **Contract Verification**: Source code and ABI available for inspection
- **Transaction History**: All contract interactions viewable in real-time

### Technical Features
- **Dynamic explorer routing** based on connected network
- **Transaction hash verification** with instant explorer links
- **Contract interaction tracking** for deployed smart contracts
- **Cross-chain transaction monitoring** across all supported networks

### Code Implementation
```typescript
// Network-specific explorer mapping
const BLOCK_EXPLORERS = {
  ethereum: 'https://etherscan.io',
  sepolia: 'https://sepolia.etherscan.io',
  arbitrum: 'https://arbiscan.io',
  base: 'https://basescan.org',
  polygon: 'https://polygonscan.com'
};

// Dynamic explorer URL generation
export function getBlockscoutTxUrl(txHash: string, chainName?: string): string {
  const baseUrl = getBlockExplorerUrl(chainName);
  return `${baseUrl}/tx/${txHash}`;
}
```

### Integration Success
The Blockscout integration provides seamless transaction verification and blockchain exploration, enhancing user confidence through transparent on-chain activity tracking across all supported networks.

## 🤝 Contributing

This is a hackathon project. For development:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details

## 🏆 Hackathon Tracking Section

### Sponsor Integration Table

| **Sponsor** | **Integration** | **Evidence** |
|-------------|----------------|--------------|
| **Reown** | WalletConnect Integration | `lib/wallet-config.ts` - Project ID: `e8b9edb13577566316699eb0b0e07ac6` |
| **Avail** | Nexus SDK Cross-Chain Bridge | `lib/avail-config.ts`, `AVAIL_FEEDBACK.md` |
| **Pyth Network** | Real-Time Oracle Data | `backend/main.py` - Live price feeds integration |
| **Lit Protocol** | Vincent Automation Framework | `lib/lit-config.ts` - Automated rebalancing conditions |
| **Envio** | HyperIndex Transaction Indexing | `frontend/components/Dashboard.tsx` - Integrated analytics |
| **Blockscout** | Multi-Chain Explorer Integration | [Contract on Sepolia](https://sepolia.blockscout.com/address/0x1Dbedf3bEaad6b0e3569d96951B18DB9e23f3352) |
| **ASI Alliance** | Groq AI-Powered Analysis | `backend/main.py` - Groq LLM yield optimization |


## 🏆 Hackathon Submission

This project was developed for EthGlobal focusing on AI and DeFi innovation with comprehensive sponsor technology integration.

## 📞 Contact

For questions about this project, please open an issue on GitHub.

---

**⚠️ Disclaimer**: This is experimental software. Use at your own risk. Not financial advice.
