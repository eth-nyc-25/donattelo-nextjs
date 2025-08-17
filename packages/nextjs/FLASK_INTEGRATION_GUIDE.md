# Complete Flask + Gemini + Walrus Integration Guide

## Overview

Your Next.js application is now fully configured to work with your Flask backend for:
- 🖼️ **Image Upload & Analysis** via Flask `/analyze/image` endpoint
- 🐋 **Walrus Decentralized Storage** for permanent image storage
- 🤖 **Gemini AI Chat** via Flask `/chat` endpoint for intelligent conversations
- 🚀 **NFT Preparation** with comprehensive metadata generation

## Architecture

```
Next.js Frontend (Port 3000)
    ↓ API Routes
    ├── /api/upload-image → Flask /analyze/image
    ├── /api/chat → Flask /chat (Gemini AI)
    └── /api/health → Flask /health
    
Flask Backend (Port 5000)
    ├── /analyze/image → Walrus Storage
    ├── /chat → Gemini AI API
    └── /health → Status Check
```

## What's Been Implemented

### 1. TypeScript Interfaces (`types/flask-api.ts`)
- `WalrusUploadResponse` - Complete Walrus storage response
- `GeminiChatResponse` - Gemini AI chat responses
- `NFTMetadata` - OpenSea-compatible NFT metadata
- `ChatMessage` - Chat message with image context

### 2. API Client Functions (`lib/flask-api.ts`)
- `uploadImageToWalrus()` - Upload images to Flask backend
- `sendChatMessage()` - Send messages to Gemini AI
- `checkFlaskHealth()` - Monitor backend connectivity
- `generateNFTMetadata()` - Create NFT-ready metadata
- `validateImageFile()` - Validate image files before upload

### 3. React Hook (`hooks/useChat.ts`)
- Complete chat management with image upload
- Automatic Walrus storage logging
- Error handling with user-friendly messages
- Backend health monitoring

### 4. Enhanced API Routes

**Upload Route (`/api/upload-image`):**
- File validation (PNG, JPG, JPEG, GIF, BMP, WEBP up to 16MB)
- Direct Flask backend communication
- Comprehensive Walrus storage logging
- Error handling with troubleshooting hints

**Chat Route (`/api/chat`):**
- Gemini AI integration via Flask
- Image context handling
- Walrus URL display and logging
- Fallback responses when Gemini is unavailable

**Health Route (`/api/health`):**
- Frontend and backend status monitoring
- Troubleshooting information
- Service endpoint listing

### 5. Enhanced Messenger Component (`components/MessengerEnhanced.tsx`)
- Real-time backend health indicator
- Walrus storage info display
- File upload with validation
- Comprehensive error handling
- Responsive design with dark mode support

## Required Flask Backend Setup

Your Flask backend needs these endpoints for full integration:

### 1. `/chat` Endpoint (Add to your Flask app.py)

```python
from gemini_chat import GeminiChat

# Initialize Gemini chat
gemini_chat = GeminiChat()

@app.route('/chat', methods=['POST'])
def chat_with_gemini():
    """Chat with Gemini AI"""
    try:
        data = request.get_json()
        message = data.get('message', '')
        image_context = data.get('image_context', None)
        
        if not message:
            return jsonify({"error": "No message provided"}), 400
        
        result = gemini_chat.send_message(message, image_context)
        return jsonify(result), 200
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500
```

### 2. Gemini Chat Class (Create `gemini_chat.py`)

```python
import google.generativeai as genai
import os
from dotenv import load_dotenv

class GeminiChat:
    def __init__(self):
        load_dotenv()
        api_key = os.getenv('GEMINI_API_KEY')
        if not api_key:
            raise ValueError("GEMINI_API_KEY not found in environment variables")
        
        genai.configure(api_key=api_key)
        self.model = genai.GenerativeModel('gemini-pro')
        self.chat = self.model.start_chat(history=[])
    
    def send_message(self, message: str, image_context: dict = None):
        """Send a message to Gemini with optional image context"""
        try:
            # If image context is provided, include it in the prompt
            if image_context:
                enhanced_message = f"""
                User message: {message}
                
                Image context:
                - Filename: {image_context.get('filename', 'N/A')}
                - Dimensions: {image_context.get('size', {}).get('width', 'N/A')}x{image_context.get('size', {}).get('height', 'N/A')}
                - Format: {image_context.get('format', 'N/A')}
                - File size: {image_context.get('file_size', 'N/A')} bytes
                - Walrus Blob ID: {image_context.get('blob_id', 'N/A')}
                - Image URL: {image_context.get('image_url', 'N/A')}
                """
                message = enhanced_message
            
            response = self.chat.send_message(message)
            return {
                "success": True,
                "response": response.text,
                "message_id": len(self.chat.history)
            }
        except Exception as e:
            return {
                "success": False,
                "error": str(e)
            }
```

## Environment Setup

### 1. Add to your Flask `.env` file:
```
GEMINI_API_KEY=your_gemini_api_key_here
```

### 2. Install required Python packages:
```bash
pip install google-generativeai python-dotenv
```

## Testing the Integration

### 1. Start Both Services
```bash
# Terminal 1: Start Flask backend
cd your-flask-directory
python app.py

# Terminal 2: Start Next.js frontend
cd packages/nextjs
npm run dev
```

### 2. Test Endpoints

**Health Check:**
```bash
curl http://localhost:3000/api/health
```

**Image Upload:**
```bash
curl -X POST -F "image=@test.jpg" http://localhost:3000/api/upload-image
```

**Chat:**
```bash
curl -X POST -H "Content-Type: application/json" \
  -d '{"message":"Hello Donatello!"}' \
  http://localhost:3000/api/chat
```

## Console Logging

The system provides comprehensive logging:

### Upload Success:
```
🐋 Walrus Storage Success:
- Image Blob ID: blob_xyz123
- Metadata Blob ID: metadata_abc456
- Direct Walrus URL: https://publisher.walrus-testnet.walrus.space/v1/blobs/blob_xyz123
- Flask Proxy URL: http://127.0.0.1:5000/image/blob_xyz123
```

### Chat with Gemini:
```
🤖 Sending to Gemini AI...
✅ Gemini AI Response: [AI response text]
```

### Health Monitoring:
```
✅ Flask backend is healthy
⚠️ Flask backend health check failed: [error details]
```

## Usage in Your App

### Using the Enhanced Messenger:
```tsx
import { MessengerEnhanced } from "~~/components/MessengerEnhanced";

// Replace your existing Messenger with MessengerEnhanced
<MessengerEnhanced isOpen={isMessengerOpen} onClose={() => setIsMessengerOpen(false)} />
```

### Using the Hook Directly:
```tsx
import { useChat } from "~~/hooks/useChat";

const MyComponent = () => {
  const { messages, sendMessage, isLoading, isHealthy } = useChat();
  
  const handleImageUpload = async (file: File) => {
    await sendMessage("Analyze this image", file);
  };
};
```

### Using API Functions:
```tsx
import { uploadImageToWalrus, generateNFTMetadata } from "~~/lib/flask-api";

const handleNFTCreation = async (imageFile: File) => {
  const walrusResult = await uploadImageToWalrus(imageFile);
  const nftMetadata = generateNFTMetadata(
    walrusResult,
    "My Artwork",
    "A beautiful digital creation",
    [{ trait_type: "Artist", value: "Your Name" }]
  );
  
  // Now you can mint the NFT using the metadata
};
```

## Troubleshooting

### Common Issues:

1. **"Cannot find module" errors:**
   - Check that path aliases use `~~/` (not `@/`)
   - Ensure TypeScript files are in correct directories

2. **Flask backend not reachable:**
   - Verify Flask is running on http://127.0.0.1:5000
   - Check CORS settings in Flask
   - Look for firewall/port issues

3. **Gemini API errors:**
   - Verify GEMINI_API_KEY in Flask .env file
   - Check API quota and usage limits
   - Ensure gemini_chat.py is properly imported

4. **Image upload failures:**
   - Check file size (max 16MB)
   - Verify file type (PNG, JPG, JPEG, GIF, BMP, WEBP)
   - Ensure Walrus storage is accessible

## Next Steps

1. **Add the Flask `/chat` endpoint** using the code above
2. **Configure your Gemini API key** in Flask environment
3. **Test the complete flow**: Upload image → Walrus storage → Gemini chat
4. **Implement NFT minting** using the generated metadata
5. **Add more features** like image editing, variations, or batch processing

Your system is now ready for production-grade AI-powered image analysis with permanent decentralized storage!
