# 🔗 Donatello System Architecture & Troubleshooting Guide

## 📋 **Complete System Flow**

### **1. Image Upload & Processing Flow**
```
User Uploads Image
       ↓
Next.js Frontend (/components/Messenger.tsx)
       ↓
API Route (/api/upload-image/route.ts)
       ↓
Flask Backend (127.0.0.1:5000/analyze/image)
       ↓
Image Analyzer + Walrus Storage
       ↓
Returns: {
  image_url,
  image_blob_id,
  metadata_blob_id,
  image_object_id,
  metadata_object_id,
  metadata
}
       ↓
Next.js Chat API (/api/chat/route.ts)
       ↓
Flask Chat Endpoint (/chat) → Gemini AI
       ↓
AI Response with Walrus URL displayed to user
```

### **2. Chat Flow (Text Messages)**
```
User Types Message
       ↓
Next.js Messenger Component
       ↓
API Route (/api/chat/route.ts)
       ↓
Flask Backend (/chat)
       ↓
Gemini AI Processing
       ↓
AI Response back to user
```

## 🔍 **Debug Points & Console Logs**

### **Frontend Debugging (Browser Console)**
```javascript
// Image Upload Success Logs:
🐋 Walrus Storage Success!
- Image URL: [Walrus URL]
- Blob ID: [blob_id]
- Metadata Blob ID: [metadata_blob_id]
- Object IDs: { image: [id], metadata: [id] }

// Chat API Logs:
🐋 Walrus Storage Details:
- Image Blob ID: [blob_id]
- Walrus URL: [full_url]
- Metadata: [analysis_data]
```

### **Backend Debugging (Flask Terminal)**
```python
# Add these debug prints to your Flask app:

@app.route('/analyze/image', methods=['POST'])
def analyze_image():
    print(f"📸 Image upload received: {file.filename}")
    print(f"🔍 File size: {file.size} bytes")
    
    # After analysis
    print(f"✅ Analysis complete: {metadata}")
    print(f"🐋 Walrus storage result: {upload_result}")
    
    return jsonify(response)

@app.route('/chat', methods=['POST'])
def chat_with_gemini():
    data = request.get_json()
    print(f"💬 Chat request: {data}")
    print(f"🖼️ Has image: {bool(data.get('image_blob_id'))}")
    
    return jsonify(response)
```

## 🧪 **Testing & Verification Steps**

### **Step 1: Health Check**
```bash
# Test Next.js → Flask connectivity
curl http://localhost:3000/api/health

# Expected Response:
{
  "success": true,
  "frontend": "Next.js frontend is healthy",
  "backend": { "status": "healthy", "service": "Image Analyzer with Walrus Storage" },
  "message": "Both frontend and backend are connected and healthy"
}
```

### **Step 2: Direct Flask Testing**
```bash
# Test Flask directly
curl http://127.0.0.1:5000/health

# Test image upload to Flask
curl -X POST -F "image=@test_image.png" http://127.0.0.1:5000/analyze/image
```

### **Step 3: Frontend Testing**
1. **Open Browser DevTools → Console**
2. **Upload an image in the messenger**
3. **Look for these console logs:**
   - `🐋 Walrus Storage Success!`
   - Image URL, Blob ID, Object IDs
4. **Check Network tab for API calls:**
   - `/api/upload-image` → Should return 200
   - `/api/chat` → Should return 200 with AI response

### **Step 4: Walrus URL Verification**
```javascript
// The Walrus URL should be displayed in:
// 1. Browser console logs
// 2. Chat response text (with 📍 emoji)
// 3. Network response in DevTools

// URL Format should be:
// http://127.0.0.1:5000/image/[blob_id]
// OR
// [Your Walrus Gateway]/[blob_id]
```

## 🚨 **Common Issues & Solutions**

### **Issue 1: Flask Backend Not Reachable**
```bash
# Symptoms:
- "Flask backend not reachable" in console
- Upload fails with connection error

# Solutions:
1. Ensure Flask is running: python app.py
2. Check Flask is on port 5000: http://127.0.0.1:5000/health
3. Check CORS settings in Flask
4. Verify firewall/network settings
```

### **Issue 2: Image Upload Fails**
```bash
# Symptoms:
- File validation errors
- Upload API returns 400/500

# Solutions:
1. Check file size < 16MB
2. Verify file type (PNG, JPG, JPEG, GIF, BMP, WEBP)
3. Check Flask temp directory permissions
4. Verify Walrus storage configuration
```

### **Issue 3: Gemini AI Not Responding**
```bash
# Symptoms:
- Fallback responses instead of AI
- "Gemini API error" in console

# Solutions:
1. Add /chat endpoint to Flask app.py
2. Configure Gemini API key
3. Install google-generativeai package
4. Check Flask /chat route is working
```

### **Issue 4: Walrus URLs Not Displaying**
```bash
# Symptoms:
- No Walrus URL in chat response
- Missing console logs

# Solutions:
1. Check image_url in Flask response
2. Verify upload-image API returns all fields
3. Check chat API passes image_url parameter
4. Ensure console.log statements are active
```

## 📁 **File Structure Reference**

```
📦 Donatello Project
├── 🌐 Frontend (Next.js)
│   ├── components/
│   │   └── Messenger.tsx          # Main chat interface
│   ├── app/api/
│   │   ├── upload-image/route.ts  # Image upload handler
│   │   ├── chat/route.ts          # Chat API with Gemini
│   │   └── health/route.ts        # System health check
│   └── app/page.tsx               # Landing page
│
├── 🐍 Backend (Flask - Separate Repo)
│   ├── app.py                     # Main Flask application
│   ├── image_analyzer.py          # Image analysis logic
│   ├── walrus_storage.py          # Walrus integration
│   └── /chat endpoint             # Gemini AI chat (add this)
│
└── 🔧 Integration Points
    ├── http://127.0.0.1:5000      # Flask backend
    ├── http://localhost:3000      # Next.js frontend
    └── Walrus Storage URLs        # Decentralized storage
```

## 📊 **Success Indicators**

### ✅ **Everything Working Correctly When:**
1. **Health check returns green** for both frontend and backend
2. **Image uploads show Walrus URLs** in console and chat
3. **Gemini AI provides creative responses** about uploaded images
4. **File validation works** for all supported formats
5. **Console logs show complete flow** from upload to storage
6. **Chat responses include storage details** and next steps

### 🔧 **Quick Verification Checklist:**
- [ ] Flask running on port 5000
- [ ] Next.js running on port 3000  
- [ ] Health endpoint returns success
- [ ] Image upload returns blob_id
- [ ] Walrus URL accessible
- [ ] Console logs appear
- [ ] AI responses are contextual
- [ ] File validation working

## 🚀 **Next Steps for Gemini Integration**

1. **Add the `/chat` endpoint** to your Flask `app.py` (see FLASK_CHAT_ENDPOINT.py)
2. **Install Gemini dependencies**: `pip install google-generativeai`
3. **Get Gemini API key** from Google AI Studio
4. **Configure API key** in your Flask environment
5. **Test with uploaded images** to see Gemini responses
6. **Monitor console logs** for complete debugging info

The system is now set up to show Walrus URLs prominently and let Gemini handle all AI responses!
