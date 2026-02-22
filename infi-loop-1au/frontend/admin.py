from flask import Blueprint, request, jsonify
from src.models.navigation import db, TopicQuery, AdminAuth
import json
import csv
import io
import hashlib
from datetime import datetime

admin_bp = Blueprint("admin", __name__)

# Admin authentication code (in production, this should be in environment variables)
ADMIN_AUTH_CODE = "SECOINFI2024"

class AdminManager:
    def __init__(self):
        pass
    
    def auto_authorize_topic(self, topic_name):
        """Auto-authorize a topic hash for admin access"""
        topic_hash = self.generate_topic_hash(topic_name)
        
        existing_auth = AdminAuth.query.filter_by(topic_hash=topic_hash).first()
        if not existing_auth:
            auth_entry = AdminAuth(
                topic_hash=topic_hash,
                topic_name=topic_name,
                is_authorized=True
            )
            db.session.add(auth_entry)
            db.session.commit()
        
        return topic_hash
    
    def generate_topic_hash(self, topic_name):
        """Generate deterministic hash for topic"""
        return f"0x{hashlib.sha256(topic_name.encode()).hexdigest()[:16]}"
    
    def validate_data_integrity(self, data):
        """Validate that index and hex lists are same length and queries match answers"""
        if not data:
            return False, "No data provided"
        
        indices = [item.get("index") for item in data]
        hex_hashes = [item.get("hex") for item in data]
        queries = [item.get("query") for item in data]
        answers = [item.get("answer") for item in data]
        
        # Check lengths
        if not (len(indices) == len(hex_hashes) == len(queries) == len(answers)):
            return False, f"Data length mismatch: {len(indices)} indices, {len(hex_hashes)} hex, {len(queries)} queries, {len(answers)} answers"
        
        # Check for None values
        if any(x is None for x in indices + hex_hashes + queries + answers):
            return False, "Missing required fields in data"
        
        return True, "Data validation passed"
    
    def bulk_import_queries(self, topic, data, replace_existing=False):
        """Import queries in bulk from JSON/CSV data"""
        # Validate data integrity
        is_valid, message = self.validate_data_integrity(data)
        if not is_valid:
            return False, message
        
        # Auto-authorize topic
        topic_hash = self.auto_authorize_topic(topic)
        
        # Remove existing queries if replace_existing is True
        if replace_existing:
            TopicQuery.query.filter_by(topic=topic).delete()
        
        imported_count = 0
        for item in data:
            try:
                # Check if query already exists
                existing = TopicQuery.query.filter_by(
                    topic=topic,
                    index_num=item["index"]
                ).first()
                
                if existing and not replace_existing:
                    continue
                
                if existing and replace_existing:
                    existing.query = item["query"]
                    existing.answer = item["answer"]
                    existing.hex_hash = item["hex"]
                    existing.updated_at = datetime.utcnow()
                else:
                    topic_query = TopicQuery(
                        index_num=item["index"],
                        topic=topic,
                        query=item["query"],
                        answer=item["answer"]
                    )
                    # Override auto-generated hex with provided hex
                    topic_query.hex_hash = item["hex"]
                    db.session.add(topic_query)
                
                imported_count += 1
            except Exception as e:
                continue
        
        db.session.commit()
        return True, f"Successfully imported {imported_count} queries for topic {topic}"
    
    def export_queries(self, topic=None, format_type="json"):
        """Export queries in JSON or CSV format"""
        query = TopicQuery.query.filter_by(is_active=True)
        if topic:
            query = query.filter_by(topic=topic)
        
        queries = query.order_by(TopicQuery.topic, TopicQuery.index_num).all()
        
        if format_type == "json":
            return json.dumps([{
                "index": q.index_num,
                "hex": q.hex_hash,
                "topic": q.topic,
                "query": q.query,
                "answer": q.answer
            } for q in queries], indent=2)
        
        elif format_type == "csv":
            output = io.StringIO()
            writer = csv.writer(output)
            writer.writerow(["Index", "Hex", "Topic", "Query", "Answer"])
            for q in queries:
                writer.writerow([q.index_num, q.hex_hash, q.topic, q.query, q.answer])
            return output.getvalue()
        
        return None

# Initialize admin manager
admin_manager = AdminManager()

@admin_bp.route("/authenticate", methods=["POST"])
def authenticate_admin():
    """Authenticate admin access"""
    try:
        data = request.get_json()
        auth_code = data.get("auth_code")
        
        if auth_code == ADMIN_AUTH_CODE:
            return jsonify({"message": "Authentication successful", "authenticated": True})
        else:
            return jsonify({"error": "Invalid authentication code", "authenticated": False}), 401
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@admin_bp.route("/import", methods=["POST"])
def import_queries():
    """Import queries from JSON or CSV data"""
    try:
        data = request.get_json()
        topic = data.get("topic")
        queries_data = data.get("data")
        replace_existing = data.get("replace_existing", False)
        
        if not topic or not queries_data:
            return jsonify({"error": "topic and data are required"}), 400
        
        success, message = admin_manager.bulk_import_queries(topic, queries_data, replace_existing)
        
        if success:
            return jsonify({"message": message})
        else:
            return jsonify({"error": message}), 400
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@admin_bp.route("/export", methods=["GET"])
def export_queries():
    """Export queries in JSON or CSV format"""
    try:
        topic = request.args.get("topic")
        format_type = request.args.get("format", "json")
        
        result = admin_manager.export_queries(topic, format_type)
        
        if result:
            if format_type == "csv":
                return result, 200, {"Content-Type": "text/csv"}
            else:
                return result, 200, {"Content-Type": "application/json"}
        else:
            return jsonify({"error": "Invalid format type"}), 400
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@admin_bp.route("/topics", methods=["GET"])
def get_authorized_topics():
    """Get all authorized topics sorted alphabetically"""
    try:
        # Get unique topics from TopicQuery table and sort alphabetically
        topics_query = db.session.query(TopicQuery.topic).distinct().order_by(TopicQuery.topic).all()
        topics = [{"id": i+1, "topic_name": topic[0]} for i, topic in enumerate(topics_query)]
        
        return jsonify({"topics": topics})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@admin_bp.route("/topics", methods=["POST"])
def authorize_topic():
    """Authorize a new topic"""
    try:
        data = request.get_json()
        topic_name = data.get("topic_name")
        
        if not topic_name:
            return jsonify({"error": "topic_name is required"}), 400
        
        # Check if topic already exists
        existing = TopicQuery.query.filter_by(topic=topic_name).first()
        if existing:
            return jsonify({"error": "Topic already exists"}), 400
        
        topic_hash = admin_manager.auto_authorize_topic(topic_name)
        
        # Create a default query for the new topic
        default_query = TopicQuery(
            index_num=1,
            topic=topic_name,
            query=f"What is {topic_name}?",
            answer=f"{topic_name} is a new topic. Please add more information through the admin panel."
        )
        db.session.add(default_query)
        db.session.commit()
        
        return jsonify({
            "message": f"Topic {topic_name} created successfully",
            "topic_hash": topic_hash
        })
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@admin_bp.route("/queries", methods=["POST"])
def add_single_query():
    """Add a single query"""
    try:
        data = request.get_json()
        topic = data.get("topic")
        index_num = data.get("index")
        query = data.get("query")
        answer = data.get("answer")
        hex_hash = data.get("hex")
        
        if not all([topic, index_num, query, answer]):
            return jsonify({"error": "topic, index, query, and answer are required"}), 400
        
        # Auto-authorize topic
        admin_manager.auto_authorize_topic(topic)
        
        # Check if query already exists
        existing = TopicQuery.query.filter_by(topic=topic, index_num=index_num).first()
        if existing:
            return jsonify({"error": "Query with this index already exists for this topic"}), 400
        
        topic_query = TopicQuery(
            index_num=index_num,
            topic=topic,
            query=query,
            answer=answer
        )
        
        # Override hex if provided, otherwise auto-generate
        if hex_hash:
            topic_query.hex_hash = hex_hash
        else:
            topic_query.hex_hash = f"0x{index_num}"
        
        db.session.add(topic_query)
        db.session.commit()
        
        return jsonify({
            "message": "Query added successfully",
            "query": topic_query.to_dict()
        })
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@admin_bp.route("/queries/<int:query_id>", methods=["PUT"])
def update_query(query_id):
    """Update an existing query"""
    try:
        data = request.get_json()
        query_obj = TopicQuery.query.get_or_404(query_id)
        
        query_obj.query = data.get("query", query_obj.query)
        query_obj.answer = data.get("answer", query_obj.answer)
        query_obj.hex_hash = data.get("hex_hash", query_obj.hex_hash)
        query_obj.updated_at = datetime.utcnow()
        
        db.session.commit()
        
        return jsonify({
            "message": "Query updated successfully",
            "query": query_obj.to_dict()
        })
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@admin_bp.route("/queries/<int:query_id>", methods=["DELETE"])
def delete_query(query_id):
    """Delete a query"""
    try:
        query_obj = TopicQuery.query.get_or_404(query_id)
        db.session.delete(query_obj)
        db.session.commit()
        
        return jsonify({"message": "Query deleted successfully"})
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500

