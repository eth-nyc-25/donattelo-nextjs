# Walrus Storage Debugging Guide

## The 404 Error You're Seeing

When you get a 404 from `https://publisher.walrus-testnet.walrus.space/v1/blobs/[blob_id]`, it means:

1. **The blob doesn't exist on Walrus testnet**
2. **Your Flask backend isn't actually uploading to Walrus**
3. **The blob ID is fake/placeholder data**

## How to Debug This

### 1. Check Your Flask Backend Logs

Look at your Flask console when uploading an image. You should see something like:

```bash
# REAL Walrus upload logs should show:
✅ Walrus upload successful
📝 Blob ID: cZBN4GBk9aK180cuvZ6NOgGkphWfP9QSia24te5yllk
🔗 Walrus URL: https://publisher.walrus-testnet.walrus.space/v1/blobs/cZBN4GBk9aK180cuvZ6NOgGkphWfP9QSia24te5yllk

# FAKE data will show:
⚠️ Using placeholder data (Walrus not configured)
📝 Fake Blob ID: some_fake_id_12345
```

### 2. Verify Your Flask `/analyze/image` Endpoint

Your Flask backend should be making **real calls to Walrus API**, not returning fake data.

Check if your Flask backend has:

```python
# Real Walrus integration (GOOD)
import requests

def upload_to_walrus(image_data):
    walrus_url = "https://publisher.walrus-testnet.walrus.space/v1/store"
    
    response = requests.post(
        walrus_url,
        files={'file': image_data},
        headers={'Content-Type': 'multipart/form-data'}
    )
    
    if response.status_code == 200:
        result = response.json()
        return result['newlyCreated']['blobObject']['blobId']
    else:
        raise Exception(f"Walrus upload failed: {response.text}")

# Fake data (BAD - this is probably what you have)
def fake_walrus_upload():
    return {
        'image_blob_id': 'fake_blob_id_12345',
        'image_url': 'https://publisher.walrus-testnet.walrus.space/v1/blobs/fake_blob_id_12345'
    }
```

### 3. Test Walrus Directly

Try uploading directly to Walrus to verify it's working:

```bash
# Test Walrus upload directly
curl -X POST \
  https://publisher.walrus-testnet.walrus.space/v1/store \
  -F "file=@your_test_image.jpg"

# Should return something like:
{
  "newlyCreated": {
    "blobObject": {
      "blobId": "cZBN4GBk9aK180cuvZ6NOgGkphWfP9QSia24te5yllk",
      "size": 12345,
      "encodingType": "RedStuff",
      "certifiedEpoch": 123
    }
  }
}
```

## Common Issues & Solutions

### Issue 1: Flask Backend Using Fake Data

**Problem:** Your Flask backend returns fake blob IDs for testing
**Solution:** Implement real Walrus upload in your Flask backend

```python
# Add this to your Flask app.py
import requests
import os

@app.route('/analyze/image', methods=['POST'])
def analyze_image():
    if 'image' not in request.files:
        return jsonify({'error': 'No image file provided'}), 400
    
    image_file = request.files['image']
    
    try:
        # REAL Walrus upload
        walrus_response = upload_to_walrus_real(image_file)
        blob_id = walrus_response['newlyCreated']['blobObject']['blobId']
        
        # Verify the blob exists
        verify_url = f"https://publisher.walrus-testnet.walrus.space/v1/blobs/{blob_id}"
        verify_response = requests.get(verify_url)
        
        if verify_response.status_code != 200:
            raise Exception(f"Blob verification failed: {verify_response.status_code}")
        
        return jsonify({
            'success': True,
            'image_blob_id': blob_id,
            'image_url': verify_url,
            'verified': True
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

def upload_to_walrus_real(image_file):
    """Actually upload to Walrus testnet"""
    walrus_url = "https://publisher.walrus-testnet.walrus.space/v1/store"
    
    # Reset file pointer
    image_file.seek(0)
    
    response = requests.post(
        walrus_url,
        files={'file': (image_file.filename, image_file, image_file.content_type)}
    )
    
    if response.status_code == 200:
        return response.json()
    else:
        raise Exception(f"Walrus upload failed: {response.text}")
```

### Issue 2: Wrong Walrus Network

**Problem:** You're using mainnet URLs with testnet blob IDs
**Solution:** Ensure consistent network usage

```python
# Use the correct Walrus network consistently
WALRUS_PUBLISHER_URL = "https://publisher.walrus-testnet.walrus.space"
WALRUS_AGGREGATOR_URL = "https://aggregator.walrus-testnet.walrus.space"

# For testnet (what you should use)
upload_url = f"{WALRUS_PUBLISHER_URL}/v1/store"
blob_url = f"{WALRUS_PUBLISHER_URL}/v1/blobs/{blob_id}"
```

### Issue 3: Network/Connectivity Issues

**Problem:** Walrus testnet is down or unreachable
**Solution:** Add fallback and better error handling

```python
def upload_with_retry(image_file, max_retries=3):
    for attempt in range(max_retries):
        try:
            return upload_to_walrus_real(image_file)
        except Exception as e:
            if attempt == max_retries - 1:
                # Last attempt failed, use local storage as fallback
                return save_locally_as_fallback(image_file)
            time.sleep(2 ** attempt)  # Exponential backoff
```

## Enhanced Frontend Error Handling

Let me also add better error handling to your frontend to catch and display these issues properly.

### Check Blob Existence Before Displaying Links

The frontend should verify blob URLs before showing them to users:

```typescript
// Add this function to your flask-api.ts
export const verifyWalrusBlob = async (blobId: string): Promise<boolean> => {
  try {
    const response = await fetch(
      `https://publisher.walrus-testnet.walrus.space/v1/blobs/${blobId}`,
      { method: 'HEAD' } // Just check if it exists, don't download
    );
    return response.ok;
  } catch {
    return false;
  }
};
```

## Immediate Steps to Fix This

1. **Check Flask logs** when uploading - look for real vs fake Walrus responses
2. **Test Walrus directly** with curl to verify the service is working
3. **Implement real Walrus upload** in your Flask backend if it's using fake data
4. **Add blob verification** before showing URLs to users
5. **Add fallback storage** (local files) when Walrus is unavailable

The blob ID `cZBN4GBk9aK180cuvZ6NOgGkphWfP9QSia24te5yllk` in your error suggests your Flask backend is generating fake/placeholder IDs rather than actually uploading to Walrus.

## Next Steps

1. Share your Flask backend code for the `/analyze/image` endpoint
2. Check if you have actual Walrus integration or just placeholder responses
3. Test direct Walrus upload to verify the service is working

Would you like me to help you implement real Walrus integration in your Flask backend?
