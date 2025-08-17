#!/usr/bin/env python3
"""
Test script for Gemini API and Walrus integration
Run this in your ~/Sites/donatello-flaskpy directory to debug issues
"""

import os
import sys
try:
    import google.generativeai as genai
    print("✅ google.generativeai imported successfully")
except ImportError:
    print("❌ google.generativeai not found. Install with: pip install google-generativeai")
    sys.exit(1)

def test_gemini_api():
    """Test Gemini API with updated model names"""
    print("\n🤖 Testing Gemini API...")
    
    # Check for API key
    api_key = os.getenv('GOOGLE_AI_API_KEY')
    if not api_key:
        print("❌ GOOGLE_AI_API_KEY environment variable not set")
        print("Set it with: export GOOGLE_AI_API_KEY='your_api_key'")
        return False
    
    print(f"✅ API key found: {api_key[:10]}...")
    
    # Configure Gemini
    genai.configure(api_key=api_key)
    
    # Test different models
    models_to_test = [
        'gemini-1.5-flash',
        'gemini-1.5-pro',
        'gemini-pro'  # This will fail
    ]
    
    for model_name in models_to_test:
        try:
            print(f"\n🧪 Testing model: {model_name}")
            model = genai.GenerativeModel(model_name)
            response = model.generate_content("Hello! Just testing if you work.")
            print(f"✅ {model_name}: Working! Response: {response.text[:50]}...")
            return True
        except Exception as e:
            print(f"❌ {model_name}: Failed - {str(e)}")
    
    return False

def test_walrus_cli():
    """Test if Walrus CLI is available"""
    print("\n🐋 Testing Walrus CLI...")
    
    import subprocess
    try:
        result = subprocess.run(['walrus', '--version'], 
                              capture_output=True, text=True, timeout=10)
        if result.returncode == 0:
            print(f"✅ Walrus CLI found: {result.stdout.strip()}")
            return True
        else:
            print(f"❌ Walrus CLI error: {result.stderr}")
            return False
    except FileNotFoundError:
        print("❌ Walrus CLI not found. Install from: https://docs.walrus.site/")
        return False
    except subprocess.TimeoutExpired:
        print("❌ Walrus CLI timeout")
        return False

def test_flask_cors():
    """Test if flask-cors is available"""
    print("\n🌐 Testing Flask CORS...")
    
    try:
        from flask_cors import CORS
        print("✅ flask-cors imported successfully")
        return True
    except ImportError:
        print("❌ flask-cors not found. Install with: pip install flask-cors")
        return False

def main():
    print("🔍 Donatello Flask Backend Diagnostics")
    print("=====================================")
    
    gemini_ok = test_gemini_api()
    walrus_ok = test_walrus_cli()
    cors_ok = test_flask_cors()
    
    print("\n📊 Summary:")
    print(f"Gemini API: {'✅' if gemini_ok else '❌'}")
    print(f"Walrus CLI: {'✅' if walrus_ok else '❌'}")
    print(f"Flask CORS: {'✅' if cors_ok else '❌'}")
    
    if all([gemini_ok, walrus_ok, cors_ok]):
        print("\n🎉 All systems ready! Your Flask backend should work properly.")
    else:
        print("\n⚠️  Some components need attention. Fix the issues above.")
        
    print("\n💡 Next steps:")
    print("1. Fix any failed components above")
    print("2. Update your app.py with working model names")
    print("3. Restart your Flask server")
    print("4. Test your Next.js frontend")

if __name__ == "__main__":
    main()
