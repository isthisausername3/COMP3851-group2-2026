from flask import Flask, request, jsonify, session
from flask_cors import CORS
import re
import json
import os
from datetime import datetime

app = Flask(__name__)
# Secret key for sessions (change this to a random string in production)
app.secret_key = 'your-secret-key-here-change-this-12345'
CORS(app, supports_credentials=True)  # Allow sessions

# File to store users
DATA_FILE = 'users.json'
API_URL = 'http://localhost:5000/api'

def load_users():
    """Load users from JSON file"""
    if os.path.exists(DATA_FILE):
        with open(DATA_FILE, 'r') as f:
            return json.load(f)
    return []

def save_users(users):
    """Save users to JSON file"""
    with open(DATA_FILE, 'w') as f:
        json.dump(users, f, indent=2)

# Load existing users
users_db = load_users()

@app.route('/api/register', methods=['POST'])
def register():
    data = request.get_json()
    
    username = data.get('username', '').strip()
    email = data.get('email', '').strip()
    password = data.get('password', '')
    confirm_password = data.get('confirmPassword', '')
    
    errors = {}
    
    if not username:
        errors['username'] = 'Username is required'
    elif len(username) < 3:
        errors['username'] = 'Username must be at least 3 characters'
    
    if not email:
        errors['email'] = 'Email is required'
    elif '@' not in email or '.' not in email:
        errors['email'] = 'Please enter a valid email address'
    
    if not password:
        errors['password'] = 'Password is required'
    elif len(password) < 6:
        errors['password'] = 'Password must be at least 6 characters'
    
    if password != confirm_password:
        errors['confirmPassword'] = 'Passwords do not match'
    
    # Check if email already exists
    for user in users_db:
        if user['email'] == email:
            errors['email'] = 'Email already registered'
            break
    
    # Check if username already exists
    for user in users_db:
        if user['username'] == username:
            errors['username'] = 'Username already taken'
            break
    
    if errors:
        return jsonify({'success': False, 'errors': errors}), 400
    
    # Save user
    new_user = {
        'username': username,
        'email': email,
        'password': password,  # In production, hash this!
        'created_at': datetime.now().isoformat()
    }
    users_db.append(new_user)
    save_users(users_db)
    
    return jsonify({'success': True, 'message': 'Registration successful!'}), 201

@app.route('/api/login', methods=['POST'])
def login():
    """Login endpoint - verifies user credentials"""
    data = request.get_json()
    
    email = data.get('email', '').strip()
    password = data.get('password', '')
    
    errors = {}
    
    if not email:
        errors['email'] = 'Email is required'
    if not password:
        errors['password'] = 'Password is required'
    
    if errors:
        return jsonify({'success': False, 'errors': errors}), 400
    
    # Find user by email
    user = None
    for u in users_db:
        if u['email'] == email:
            user = u
            break
    
    if not user:
        return jsonify({
            'success': False,
            'message': 'Invalid email or password'
        }), 401
    
    # Check password (in production, compare hashed passwords)
    if user['password'] != password:
        return jsonify({
            'success': False,
            'message': 'Invalid email or password'
        }), 401
    
    # Store user info in session
    session['user_id'] = user['email']
    session['username'] = user['username']
    
    return jsonify({
        'success': True,
        'message': 'Login successful!',
        'user': {
            'username': user['username'],
            'email': user['email']
        }
    }), 200

@app.route('/api/logout', methods=['POST'])
def logout():
    """Logout endpoint - clear session"""
    session.clear()
    return jsonify({'success': True, 'message': 'Logged out successfully'}), 200

@app.route('/api/check-auth', methods=['GET'])
def check_auth():
    """Check if user is logged in"""
    if 'user_id' in session:
        return jsonify({
            'authenticated': True,
            'user': {
                'username': session['username'],
                'email': session['user_id']
            }
        }), 200
    else:
        return jsonify({'authenticated': False}), 200

@app.route('/api/users', methods=['GET'])
def get_users():
    """Get all registered users (admin only in production)"""
    safe_users = []
    for user in users_db:
        safe_users.append({
            'username': user['username'],
            'email': user['email'],
            'created_at': user.get('created_at', 'N/A')
        })
    return jsonify(safe_users)

if __name__ == '__main__':
    print("=" * 50)
    print("🐍 Python Backend Server Starting...")
    print("📍 Running at: " + API_URL)
    print("📝 Endpoints:")
    print("   POST /api/register - Register new user")
    print("   POST /api/login - Login user")
    print("   POST /api/logout - Logout user")
    print("   GET  /api/check-auth - Check login status")
    print("   GET  /api/users - View all users")
    print("=" * 50)
    app.run(debug=True, port=5000)