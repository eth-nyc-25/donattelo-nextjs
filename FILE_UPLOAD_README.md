# Donatello AI - File Upload & NFT Minting Feature

## Overview

This feature allows users to upload PNG images through the chat interface, which are then processed by the Python backend to convert them to SVG format, stored on Walrus, and optionally minted as NFTs.

## Architecture

```
Frontend (Next.js) -> API Routes -> Python Backend -> Walrus Storage -> NFT Minting -> OpenSea
```

## Frontend Components

### 1. Updated Messenger Component
- **File Upload Button**: PhotoIcon button that opens file picker
- **File Preview**: Shows selected PNG with filename and size
- **Image Display**: Shows uploaded images in chat messages
- **Validation**: PNG only, max 10MB file size

### 2. API Routes Created

#### `/api/upload-image`
- Handles PNG file uploads
- Validates file type and size
- Converts to base64 and sends to Python backend
- Returns Walrus URL of stored SVG

#### `/api/chat`
- Handles chat messages with optional image context
- Communicates with Python AI backend
- Returns AI responses and minting capabilities

#### `/api/mint-nft`
- Handles NFT minting requests
- Communicates with Python backend for blockchain operations
- Returns transaction details and OpenSea URLs

### 3. Utility Functions (`utils/nft-utils.ts`)
- `uploadImageFile()`: Handle file uploads
- `mintNFT()`: Mint NFTs from frontend
- `validatePNGFile()`: Client-side file validation

## Backend Requirements (Python Flask)

### 1. Dependencies
```bash
pip install -r python-backend-requirements.txt
```

### 2. Required Endpoints

#### `POST /api/convert-to-svg`
```json
{
  "image": "base64_encoded_png",
  "filename": "artwork.png",
  "mimeType": "image/png"
}
```

Response:
```json
{
  "success": true,
  "walrusUrl": "https://walrus-storage-url/artwork.svg",
  "svgContent": "<svg>...</svg>",
  "message": "Image successfully converted to SVG"
}
```

#### `POST /api/chat`
```json
{
  "message": "User message",
  "hasImage": true,
  "svgUrl": "https://walrus-storage-url/artwork.svg"
}
```

#### `POST /api/mint-nft`
```json
{
  "svgUrl": "https://walrus-storage-url/artwork.svg",
  "userAddress": "0x...",
  "title": "My Artwork",
  "description": "AI-generated artwork"
}
```

## Environment Variables

### Frontend (.env.local)
```bash
PYTHON_BACKEND_URL=http://localhost:5000
NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID=your_project_id
NEXT_PUBLIC_ALCHEMY_API_KEY=your_alchemy_key
OPENSEA_API_KEY=your_opensea_key
```

### Backend
```bash
WALRUS_API_KEY=your_walrus_key
BLOCKCHAIN_RPC_URL=your_rpc_url
NFT_CONTRACT_ADDRESS=0x...
PRIVATE_KEY=your_private_key  # For minting operations
```

## Usage Flow

1. **User uploads PNG**: Clicks photo icon, selects PNG file
2. **File validation**: Frontend validates file type and size
3. **File preview**: Shows preview with option to remove
4. **Send message**: User can add text description and send
5. **Backend processing**: 
   - Receives base64 image
   - Converts PNG to SVG using AI
   - Stores SVG on Walrus
   - Returns Walrus URL
6. **AI response**: Backend provides contextual response about the artwork
7. **NFT minting** (optional): User can request to mint as NFT
8. **OpenSea listing**: NFT is minted and listed on OpenSea

## Implementation Status

### ✅ Completed
- Frontend file upload UI
- File validation and preview
- API route structure
- Message display with images
- Utility functions

### 🔄 Requires Implementation
- Python Flask backend (`python-backend-example.py` shows structure)
- AI image-to-SVG conversion logic
- Walrus storage integration
- Smart contract for NFT minting
- OpenSea integration

## Next Steps

1. **Set up Python backend** using the provided example
2. **Implement AI image-to-SVG conversion** 
3. **Integrate Walrus storage** for SVG files
4. **Deploy NFT smart contract** 
5. **Configure OpenSea integration**
6. **Test end-to-end workflow**

## Security Considerations

- File size limits (10MB max)
- File type validation (PNG only)
- Rate limiting for API calls
- Secure handling of private keys
- Input sanitization for all user data

## Error Handling

The system includes comprehensive error handling for:
- Invalid file types
- File size limits
- Network failures
- Backend processing errors
- Blockchain transaction failures
