# ETH AI Defense - AI-Powered DeFi Yield Optimizer

An AI-powered application for optimizing DeFi yields across multiple protocols and chains using advanced machine learning algorithms.

## 🎯 Overview

ETH AI Defense is a hackathon project that combines artificial intelligence with decentralized finance to help users find the best yield opportunities across various DeFi protocols. The system analyzes yield rates, TVL, risk factors, and market conditions to provide intelligent recommendations.

## 🏗️ Architecture

- **Backend**: Python FastAPI with Groq AI integration
- **Frontend**: Next.js 14 with TypeScript and Tailwind CSS
- **Smart Contracts**: Solidity contracts deployed using Foundry
- **AI**: Groq LLM (Llama 3.1) for yield analysis and recommendations
- **Blockchain**: Multi-chain support (Ethereum, Arbitrum, Base)

## ✨ Features

- **AI-Powered Analysis**: Advanced yield opportunity analysis using machine learning
- **Multi-Protocol Support**: Integration with Aave V3, Compound V3, Morpho, and others
- **Cross-Chain**: Support for multiple blockchain networks
- **Real-Time Data**: Live yield rates and TVL monitoring
- **Risk Assessment**: Intelligent risk evaluation for each opportunity
- **User-Friendly Interface**: Clean, intuitive web interface

## 🚀 Tech Stack

### Backend
- Python 3.10+
- FastAPI for API development
- Groq AI for LLM integration
- Web3 libraries for blockchain interaction

### Frontend
- Next.js 14
- TypeScript
- Tailwind CSS
- Responsive design

### Smart Contracts
- Solidity
- Foundry for development and testing
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
- Foundry

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
forge build
forge test
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

## 🤝 Contributing

This is a hackathon project. For development:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details

## 🏆 Hackathon

This project was developed for EthGlobal focusing on AI and DeFi innovation.

## 📞 Contact

For questions about this project, please open an issue on GitHub.

---

**⚠️ Disclaimer**: This is experimental software. Use at your own risk. Not financial advice.
