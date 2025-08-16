# � Donattelo

<h4 align="center">
  <a href="https://github.com/eth-nyc-25/donattelo-nextjs">GitHub</a> |
  <a href="https://donattelo.vercel.app">Live Demo</a>
</h4>

� **AI agent assistant that helps artists take their artworks on-chain and launch them on OpenSea.** 

Donattelo eliminates the technical barriers that prevent artists from entering the NFT space by providing a completely automated, user-friendly experience powered by AI.

⚙️ Built using Next.js, OnchainKit, RainbowKit, Foundry, Wagmi, Viem, and TypeScript.

## ✨ Features

- 🎨 **AI Art Analysis**: Smart evaluation and pricing suggestions for artwork
- 📦 **Walrus Storage**: Decentralized storage for artwork files and metadata
- 💰 **Coinbase Integration**: Seamless onboarding with familiar Web2 UX
- � **Automated Minting**: AI handles all blockchain interactions and gas optimization
- 🛒 **OpenSea Integration**: Automatic marketplace listing with AI-generated metadata
- 🌐 **Multi-Chain Support**: Deploy on Ethereum, Base, Polygon, Arbitrum, and Optimism
- 🔐 **Multi-Wallet Support**: MetaMask, Coinbase Wallet, WalletConnect, Ledger, and more

![Donattelo AI Assistant](https://via.placeholder.com/800x400/1a1a1a/ffffff?text=Donattelo+AI+Assistant)

## 🚀 How It Works

1. **Upload Artwork**: Artists simply upload their digital artwork to the platform
2. **AI Analysis**: Our AI agent analyzes the artwork and suggests optimal pricing and metadata
3. **Decentralized Storage**: Artwork and metadata are automatically stored on Walrus
4. **Smart Minting**: AI handles blockchain interactions, gas optimization, and NFT creation
5. **Marketplace Launch**: NFTs are automatically listed on OpenSea with AI-generated descriptions

## 🛠 Technology Stack

- **Frontend**: Next.js 15, TypeScript, Tailwind CSS, DaisyUI
- **Web3**: Scaffold-ETH 2, RainbowKit, Wagmi, Viem
- **Wallet Integration**: OnchainKit (Coinbase), MetaMask, WalletConnect
- **Storage**: Walrus (Sui) for decentralized artwork and metadata storage
- **Marketplace**: OpenSea SDK for automated NFT listing
- **Smart Contracts**: Foundry for gas-efficient NFT minting
- **AI**: LLM integration for artwork analysis and market insights

## 📋 Requirements

Before you begin, you need to install the following tools:

- [Node (>= v20.18.3)](https://nodejs.org/en/download/)
- [Python (>= 3.8)](https://www.python.org/downloads/) - Required for AI backend services
- Yarn ([v1](https://classic.yarnpkg.com/en/docs/install/) or [v2+](https://yarnpkg.com/getting-started/install))
- [Git](https://git-scm.com/downloads)

## 🚀 Quick Start

To get started with Donattelo, follow these steps:

1. **Clone the repositories:**

```bash
# Clone the main frontend repository
git clone https://github.com/eth-nyc-25/donattelo-nextjs.git
cd donattelo-nextjs

# Clone the Python AI backend (in a separate terminal)
git clone https://github.com/eth-nyc-25/donattelo-flaskpy.git
cd donattelo-flaskpy
```

2. **Set up the Python AI Backend:**

```bash
# In the donattelo-flaskpy directory
cd donattelo-flaskpy
pip install -r requirements.txt
python app.py
```

3. **Set up the Frontend (in a new terminal):**

```bash
# Return to the main project directory
cd donattelo-nextjs
yarn install
```

4. **Set up environment variables:**

Create a `.env.local` file in `packages/nextjs/` and add:

```bash
NEXT_PUBLIC_ONCHAINKIT_API_KEY=your_coinbase_api_key
NEXT_PUBLIC_WALRUS_API_KEY=your_walrus_api_key
NEXT_PUBLIC_OPENSEA_API_KEY=your_opensea_api_key
NEXT_PUBLIC_AI_BACKEND_URL=http://localhost:5000
```

5. **Run a local blockchain network:**

```bash
yarn chain
```

6. **Deploy smart contracts:**

```bash
yarn deploy
```

7. **Start the development server:**

```bash
yarn start
```

Visit your app at: `http://localhost:3000`

> **Note**: Make sure both the Python Flask backend (`http://localhost:5000`) and the Next.js frontend (`http://localhost:3000`) are running for full functionality.

## 🏗 Project Structure

```
donattelo-nextjs/          # Frontend repository
├── packages/
│   ├── foundry/          # Smart contracts (Foundry)
│   │   ├── contracts/    # NFT minting contracts
│   │   └── script/       # Deployment scripts
│   └── nextjs/           # Frontend application
│       ├── app/          # Next.js app router
│       ├── components/   # React components
│       └── services/     # Web3 services
├── cspell.json          # Spell checking config
└── README.md

donattelo-flaskpy/         # AI Backend repository
├── app.py               # Flask application
├── requirements.txt     # Python dependencies
├── models/              # AI models and logic
└── utils/               # Helper functions
```

## 🧪 Available Commands

```bash
# Frontend Development
yarn start              # Start the frontend development server
yarn chain              # Run local blockchain network
yarn deploy             # Deploy smart contracts
yarn foundry:test       # Run smart contract tests

# Python AI Backend
python app.py           # Start the Flask AI backend server
pip install -r requirements.txt  # Install Python dependencies

# Code Quality
yarn lint               # Run ESLint
yarn format             # Format code with Prettier
yarn type-check         # TypeScript type checking
```

## 🌟 Key Features Explained

### AI-Powered Workflow
- **Smart Analysis**: AI evaluates artwork quality, suggests pricing, and generates metadata
- **Market Intelligence**: Real-time analytics and recommendations based on current NFT trends
- **Automated Optimization**: Gas price monitoring and transaction optimization

### Seamless User Experience
- **One-Click Minting**: Upload artwork and let AI handle the rest
- **Multi-Wallet Support**: Connect with MetaMask, Coinbase Wallet, WalletConnect, and more
- **Cross-Chain Deployment**: Choose the best blockchain based on current gas prices

### Decentralized Infrastructure
- **Walrus Storage**: Permanent, censorship-resistant storage for artwork and metadata
- **Multi-Chain Support**: Deploy on Ethereum, Base, Polygon, Arbitrum, or Optimism
- **OpenSea Integration**: Automatic marketplace listing with optimized metadata

## 🤝 Contributing

We welcome contributions to Donattelo! Please feel free to submit issues, feature requests, or pull requests.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🔗 Links

- **Website**: [donattelo.vercel.app](https://donattelo.vercel.app)
- **GitHub**: [eth-nyc-25/donattelo-nextjs](https://github.com/eth-nyc-25/donattelo-nextjs)
- **Built for**: ETH Global Hackathon

---

**Made with ❤️ by the Donattelo team**