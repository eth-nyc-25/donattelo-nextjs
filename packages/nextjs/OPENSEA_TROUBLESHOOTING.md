# OpenSea API Troubleshooting Guide

## 🚨 Common Issues and Solutions

### 1. API Key Not Working (404, 401, 403 Errors)

#### Problem: Getting 404, 401, or 403 errors when testing OpenSea API

#### Solutions:

**Step 1: Verify API Key Format**
- OpenSea API keys typically start with `2` and are around 64 characters long
- Make sure you copied the entire key without extra spaces
- Check that the key is in your `.env.local` file

**Step 2: Check Environment Variable**
```bash
# In packages/nextjs/.env.local
OPENSEA_API_KEY=your_actual_api_key_here
```

**Step 3: Verify API Key Permissions**
- Log into your OpenSea account
- Go to API settings
- Ensure your key has the necessary permissions:
  - Read access to collections
  - Read access to NFTs
  - Write access (if you plan to create listings)

**Step 4: Test with Different Endpoints**
The integration now uses `/collections` endpoint which is more reliable than `/chain/*` endpoints.

### 2. Environment Variable Not Loading

#### Problem: API key shows as "Not Set" in debug info

#### Solutions:

**Check File Location**
- Ensure `.env.local` is in `packages/nextjs/` directory
- Not in the root project directory

**Restart Development Server**
```bash
# Stop the server (Ctrl+C)
# Then restart
yarn start
```

**Check File Format**
```bash
# .env.local should look like this (no spaces around =)
OPENSEA_API_KEY=your_key_here
OPENSEA_API_BASE=https://api.opensea.io/api/v2
```

### 3. Network/Connection Issues

#### Problem: Network errors or timeouts

#### Solutions:

**Check Internet Connection**
- Ensure you can access other websites
- Try accessing https://api.opensea.io in your browser

**Check Firewall/Proxy**
- Some corporate networks block API calls
- Try from a different network if possible

**Rate Limiting**
- OpenSea has rate limits
- Wait a few minutes between requests
- Check if you've exceeded your plan's limits

### 4. API Key Expired or Invalid

#### Problem: Getting 401 Unauthorized errors

#### Solutions:

**Get a New API Key**
1. Visit [OpenSea API Documentation](https://docs.opensea.io/reference/api-overview)
2. Sign in to your account
3. Generate a new API key
4. Replace the old key in your `.env.local` file

**Check Account Status**
- Ensure your OpenSea account is active
- Check if there are any account restrictions

## 🔧 Debugging Steps

### 1. Use the API Key Validation Tool
- Go to `/test` page
- Click "🔑 Validate API Key" button
- Review the detailed validation results

### 2. Check Console Logs
- Open browser developer tools (F12)
- Check the Console tab for error messages
- Check the Network tab for API call details

### 3. Test API Key Manually
```bash
# Test with curl (replace YOUR_API_KEY)
curl -H "X-API-KEY: YOUR_API_KEY" \
     -H "Accept: application/json" \
     "https://api.opensea.io/api/v2/collections"
```

## 📋 Environment Variable Checklist

```bash
# Required
OPENSEA_API_KEY=your_64_character_api_key_here

# Optional (will use defaults if not set)
OPENSEA_API_BASE=https://api.opensea.io/api/v2
OPENSEA_SANDBOX_BASE=https://testnets-api.opensea.io/api/v2
NEXT_PUBLIC_USE_TESTNET=false
```

## 🧪 Testing Your Setup

### 1. Basic Test
```bash
# Start your development server
cd donattelo-nextjs/packages/nextjs
yarn start
```

### 2. Navigate to Test Page
- Go to `http://localhost:3000/test`
- Click "🔑 Validate API Key"
- Review the results

### 3. Expected Results
If everything is working:
- ✅ API key shows as "Configured"
- ✅ Validation shows "API key appears to be working correctly!"
- ✅ Connection test returns successful response

## 🆘 Still Having Issues?

### 1. Check OpenSea Status
- Visit [OpenSea Status Page](https://status.opensea.io/)
- Check if there are any service disruptions

### 2. Verify API Plan
- Check your OpenSea API plan limits
- Ensure you haven't exceeded rate limits

### 3. Contact Support
- OpenSea API Support: [docs.opensea.io](https://docs.opensea.io/)
- Check their troubleshooting guides

### 4. Common Error Codes
- **401**: Unauthorized - Invalid or expired API key
- **403**: Forbidden - Insufficient permissions
- **404**: Not Found - Endpoint doesn't exist
- **429**: Too Many Requests - Rate limit exceeded
- **500**: Internal Server Error - OpenSea server issue

## 🎯 Quick Fix Checklist

- [ ] API key is 64+ characters long
- [ ] API key starts with `2`
- [ ] `.env.local` file is in `packages/nextjs/` directory
- [ ] No spaces around `=` in environment variables
- [ ] Development server restarted after adding environment variables
- [ ] API key has proper permissions in OpenSea account
- [ ] Internet connection is working
- [ ] Not hitting rate limits

---

**Remember**: The OpenSea integration is designed to be completely separate from your existing frontend, so any issues here won't affect your main application functionality.
