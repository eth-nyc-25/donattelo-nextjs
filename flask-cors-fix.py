# Flask CORS Fix for donatello-flaskpy/app.py
# 
# Add this to the top of your app.py file in Sites/donatello-flaskpy/

from flask_cors import CORS

# After creating your Flask app, add:
app = Flask(__name__)

# Enable CORS for all routes and origins
CORS(app, origins=["http://localhost:3000", "http://localhost:3001", "http://127.0.0.1:3000", "http://127.0.0.1:3001"])

# OR if you want to allow all origins (less secure but easier for development):
# CORS(app)

# If you don't have flask-cors installed, install it with:
# pip install flask-cors

# Alternative manual CORS setup (if you don't want to install flask-cors):
"""
@app.after_request
def after_request(response):
    response.headers.add('Access-Control-Allow-Origin', '*')
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
    response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
    return response
"""

print("✅ CORS configuration added successfully!")
print("🔄 Restart your Flask backend for changes to take effect")
