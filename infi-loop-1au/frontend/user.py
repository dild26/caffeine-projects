from flask import Blueprint, request, jsonify
from src.models.user import db, User

user_bp = Blueprint("user", __name__)

@user_bp.route("/users", methods=["GET"])
def get_users():
    """Get all users"""
    try:
        users = User.query.all()
        return jsonify([user.to_dict() for user in users])
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@user_bp.route("/users", methods=["POST"])
def create_user():
    """Create a new user"""
    try:
        data = request.get_json()
        username = data.get("username")
        email = data.get("email")
        
        if not username or not email:
            return jsonify({"error": "Username and email are required"}), 400
        
        # Check if user already exists
        existing_user = User.query.filter_by(username=username).first()
        if existing_user:
            return jsonify({"error": "Username already exists"}), 400
        
        existing_email = User.query.filter_by(email=email).first()
        if existing_email:
            return jsonify({"error": "Email already exists"}), 400
        
        user = User(username=username, email=email)
        db.session.add(user)
        db.session.commit()
        
        return jsonify({"message": "User created successfully", "user": user.to_dict()}), 201
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500

