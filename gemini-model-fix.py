# Gemini Model Name Fix for Flask Backend
# 
# The issue is that your Flask backend is using an outdated Gemini model name.
# Google has updated their model names. Here's what to change:

# OLD (causing the error):
# model = genai.GenerativeModel('gemini-pro')

# NEW (working models):
# model = genai.GenerativeModel('gemini-1.5-flash')  # Faster, cheaper
# or
# model = genai.GenerativeModel('gemini-1.5-pro')   # More capable

"""
In your Flask app.py file, find the line that looks like:
    model = genai.GenerativeModel('gemini-pro')

And replace it with:
    model = genai.GenerativeModel('gemini-1.5-flash')

Available Gemini models as of 2024:
- gemini-1.5-flash (recommended for most use cases)
- gemini-1.5-pro (for complex tasks)
- gemini-1.0-pro (legacy)

The error you're seeing:
"404 models/gemini-pro is not found for API version v1beta"

Means the model name 'gemini-pro' has been deprecated/moved.
"""

# Quick test to verify working models:
import google.generativeai as genai
import os

def test_gemini_models():
    # Set your API key
    api_key = os.getenv('GOOGLE_AI_API_KEY')
    if not api_key:
        print("❌ Please set GOOGLE_AI_API_KEY environment variable")
        return
    
    genai.configure(api_key=api_key)
    
    # Test working models
    models_to_test = [
        'gemini-1.5-flash',
        'gemini-1.5-pro',
    ]
    
    for model_name in models_to_test:
        try:
            model = genai.GenerativeModel(model_name)
            response = model.generate_content("Hello, can you respond?")
            print(f"✅ {model_name}: Working")
        except Exception as e:
            print(f"❌ {model_name}: {str(e)}")

if __name__ == "__main__":
    test_gemini_models()
