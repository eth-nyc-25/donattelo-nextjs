# OpenSea Integration for Donattelo

This document describes the OpenSea API integration that has been added to the Donattelo project without modifying the existing frontend code.

## 🎯 Project Goal

Create NFTs through an AI agent and automatically list them for sale on OpenSea, providing a seamless workflow from artwork creation to marketplace listing.

## 🏗 Architecture

The OpenSea integration is implemented as a separate module that doesn't interfere with the existing frontend:

```
donattelo-nextjs/
├── app/
│   ├── test/                    # New test route for OpenSea integration
│   │   └── page.tsx            # Test interface
│   └── api/
│       └── test/               # OpenSea API endpoints
│           ├── opensea-connection/
│           ├── collection-stats/
│           ├── create-test-nft/
│           └── enhanced-opensea/
├── lib/
│   └── opensea-service.ts      # OpenSea service class
└── opensea-config.example.ts   # Configuration template
```

## 🚀 Quick Start

### 1. Get OpenSea API Key

1. Visit [OpenSea API Documentation](https://docs.opensea.io/reference/api-overview)
2. Sign up for an API key
3. Copy your API key

### 2. Configure Environment Variables

Create a `.env.local` file in `packages/nextjs/` and add:

```bash
# OpenSea Configuration
OPENSEA_API_KEY=your_actual_api_key_here
OPENSEA_API_BASE=https://api.opensea.io/api/v2
OPENSEA_SANDBOX_BASE=https://testnets-api.opensea.io/api/v2

# Optional: Testnet Configuration
NEXT_PUBLIC_USE_TESTNET=false
NEXT_PUBLIC_TESTNET_CHAIN_ID=11155111
```

### 3. Access the Test Interface

Navigate to `/test` in your application to access the OpenSea integration test interface.

## 🔧 Available Features

### Basic API Testing
- **Connection Test**: Verify OpenSea API connectivity
- **Collection Stats**: Get statistics for NFT collections
- **NFT Creation**: Create test NFTs with metadata

### Advanced Features
- **Metadata Validation**: Ensure NFT metadata meets OpenSea standards
- **Pricing Recommendations**: Get suggested pricing based on collection data
- **Metadata Refresh**: Update NFT metadata on OpenSea
- **NFT Details**: Retrieve detailed information about specific NFTs

## 📡 API Endpoints

### 1. Test OpenSea Connection
```http
GET /api/test/opensea-connection
```

### 2. Get Collection Statistics
```http
POST /api/test/collection-stats
Content-Type: application/json

{
  "contractAddress": "0x1234..."
}
```

### 3. Create Test NFT
```http
POST /api/test/create-test-nft
Content-Type: application/json

{
  "creatorAddress": "0x1234...",
  "name": "My NFT",
  "description": "Description here",
  "imageUrl": "https://example.com/image.jpg"
}
```

### 4. Enhanced OpenSea Operations
```http
POST /api/test/enhanced-opensea
Content-Type: application/json

{
  "action": "create_nft_metadata",
  "name": "My NFT",
  "description": "Description here",
  "imageUrl": "https://example.com/image.jpg",
  "creator": "0x1234..."
}
```

Available actions:
- `test_connection`
- `get_collection_stats`
- `get_nft_details`
- `create_nft_metadata`
- `validate_metadata`
- `get_recommended_pricing`
- `refresh_metadata`

## 🎨 NFT Metadata Standards

The integration follows OpenSea's metadata standards:

```json
{
  "name": "NFT Name",
  "description": "NFT Description",
  "image": "https://example.com/image.jpg",
  "external_url": "https://donattelo.vercel.app",
  "attributes": [
    {
      "trait_type": "Creator",
      "value": "0x1234..."
    },
    {
      "trait_type": "Platform",
      "value": "Donattelo"
    }
  ]
}
```

## 🔄 Workflow Integration

### Current Workflow
1. User uploads artwork
2. AI agent analyzes and generates metadata
3. NFT is minted on blockchain
4. Metadata is uploaded to decentralized storage
5. NFT is listed on OpenSea

### Future Integration Points
- **AI Agent**: Integrate with Python backend for intelligent NFT creation
- **Smart Contracts**: Connect with Foundry contracts for on-chain operations
- **Storage**: Integrate with Walrus for decentralized file storage
- **Automation**: Full workflow automation from creation to listing

## 🧪 Testing

### Local Testing
1. Start the development server: `yarn start`
2. Navigate to `http://localhost:3000/test`
3. Test various OpenSea API functions
4. Verify responses and error handling

### API Testing
Use the test endpoints to verify:
- OpenSea API connectivity
- Metadata creation and validation
- Collection statistics retrieval
- NFT detail fetching

## 🔒 Security Considerations

- **API Key Protection**: Never expose API keys in client-side code
- **Rate Limiting**: Respect OpenSea API rate limits
- **Input Validation**: Validate all user inputs before API calls
- **Error Handling**: Implement proper error handling for API failures

## 🚧 Limitations & Future Improvements

### Current Limitations
- Test environment only (no actual NFT minting)
- Mock data for demonstration purposes
- Limited to OpenSea API v2 features

### Planned Improvements
- **Real NFT Minting**: Integrate with smart contracts
- **Automated Listing**: Direct OpenSea listing creation
- **Multi-Chain Support**: Support for Base, Polygon, etc.
- **AI Integration**: Full AI agent workflow
- **Real-time Updates**: Live NFT status monitoring

## 📚 Resources

- [OpenSea API Documentation](https://docs.opensea.io/reference/api-overview)
- [OpenSea Metadata Standards](https://docs.opensea.io/docs/metadata-standards)
- [NFT Metadata Schema](https://docs.opensea.io/docs/metadata-standards#nft-metadata)
- [OpenSea Testnets](https://docs.opensea.io/docs/testnets)

## 🤝 Contributing

To contribute to the OpenSea integration:

1. Follow the existing code structure
2. Add new features as separate modules
3. Maintain separation from existing frontend code
4. Include proper error handling and validation
5. Add tests for new functionality

## 📞 Support

For issues related to the OpenSea integration:
1. Check the OpenSea API documentation
2. Verify your API key and permissions
3. Test with the provided endpoints
4. Review error messages and logs

---

**Note**: This integration is designed to be completely separate from the existing Donattelo frontend, allowing for independent development and testing without affecting the main application functionality.
