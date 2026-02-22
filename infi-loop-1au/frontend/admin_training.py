"""
Admin Training Routes for Infy AI
Handles file uploads, training data management, and email-based authentication
"""
import os
import json
import hashlib
from datetime import datetime
from flask import Blueprint, request, jsonify
from werkzeug.utils import secure_filename
from src.models.knowledge import (
    db, KnowledgeBase, AdminUser, TrainingSession, 
    TopicIndex, BlockchainVerification
)
from src.services.data_processor import DataProcessor

admin_training_bp = Blueprint('admin_training', __name__)
data_processor = DataProcessor()

# Allowed file extensions
ALLOWED_EXTENSIONS = {'.md', '.json', '.csv', '.txt', '.zip'}

def allowed_file(filename):
    """Check if file extension is allowed"""
    return os.path.splitext(filename)[1].lower() in ALLOWED_EXTENSIONS

@admin_training_bp.route('/admin/authenticate-email', methods=['POST'])
def authenticate_admin_email():
    """Authenticate admin by email and create/update admin user"""
    try:
        data = request.get_json()
        if not data:
            return jsonify({'error': 'No JSON data provided'}), 400
        
        email = data.get('email', '').strip().lower()
        name = data.get('name', '').strip()
        ethereum_address = data.get('ethereum_address', '').strip()
        
        if not email:
            return jsonify({'error': 'Email is required'}), 400
        
        if not name:
            return jsonify({'error': 'Name is required'}), 400
        
        # Check if admin exists
        admin = AdminUser.query.filter_by(email=email).first()
        
        if not admin:
            # Create new admin
            admin = AdminUser(
                email=email,
                name=name,
                ethereum_address=ethereum_address,
                role='admin'
            )
            db.session.add(admin)
        else:
            # Update existing admin
            admin.name = name
            admin.ethereum_address = ethereum_address or admin.ethereum_address
            admin.last_login = datetime.utcnow()
        
        db.session.commit()
        
        return jsonify({
            'message': 'Authentication successful',
            'admin': admin.to_dict(),
            'authenticated': True
        })
        
    except Exception as e:
        return jsonify({'error': f'Authentication error: {str(e)}'}), 500

@admin_training_bp.route('/admin/upload-training-data', methods=['POST'])
def upload_training_data():
    """Upload and process training data files"""
    try:
        # Check if admin is authenticated
        admin_email = request.form.get('admin_email')
        if not admin_email:
            return jsonify({'error': 'Admin email is required'}), 401
        
        admin = AdminUser.query.filter_by(email=admin_email, is_active=True).first()
        if not admin:
            return jsonify({'error': 'Admin not found or inactive'}), 401
        
        # Check if files are provided
        if 'files' not in request.files:
            return jsonify({'error': 'No files provided'}), 400
        
        files = request.files.getlist('files')
        if not files or all(f.filename == '' for f in files):
            return jsonify({'error': 'No files selected'}), 400
        
        # Create training session
        session_name = f"Training_{datetime.utcnow().strftime('%Y%m%d_%H%M%S')}"
        training_session = TrainingSession(
            session_name=session_name,
            admin_email=admin_email,
            file_count=len(files)
        )
        db.session.add(training_session)
        db.session.commit()
        
        processed_topics = []
        total_topics = 0
        
        for file in files:
            if file and file.filename and allowed_file(file.filename):
                try:
                    filename = secure_filename(file.filename)
                    content = file.read().decode('utf-8')
                    
                    # Process file content
                    topics = data_processor.process_file_content(content, filename)
                    
                    for topic_data in topics:
                        # Create knowledge base entry
                        kb_entry = KnowledgeBase(
                            topic=topic_data['topic'],
                            content=topic_data['content'],
                            file_type=topic_data['file_type'],
                            source_file=topic_data['source_file'],
                            category=topic_data['category'],
                            tags=topic_data['hashtags'],
                            legal_text=topic_data['legal_text'],
                            created_by=admin_email
                        )
                        db.session.add(kb_entry)
                        db.session.flush()  # Get the ID
                        
                        # Create topic index entry
                        topic_index = TopicIndex(
                            topic_name=topic_data['topic'],
                            category=topic_data['category'],
                            knowledge_base_id=kb_entry.id,
                            hashtags=json.dumps(topic_data['hashtags']),
                            is_legal_document=topic_data['is_legal_document']
                        )
                        db.session.add(topic_index)
                        
                        processed_topics.append({
                            'topic': topic_data['topic'],
                            'category': topic_data['category'],
                            'hashtags': topic_data['hashtags'],
                            'content_hash': kb_entry.content_hash
                        })
                        total_topics += 1
                
                except Exception as e:
                    print(f"Error processing file {file.filename}: {e}")
        
        # Update training session
        training_session.topics_added = total_topics
        training_session.status = 'completed'
        training_session.completed_at = datetime.utcnow()
        db.session.commit()
        
        return jsonify({
            'message': f'Successfully processed {total_topics} topics from {len(files)} files',
            'training_session': training_session.to_dict(),
            'processed_topics': processed_topics[:10]  # Return first 10 for preview
        })
        
    except Exception as e:
        return jsonify({'error': f'Upload error: {str(e)}'}), 500

@admin_training_bp.route('/admin/process-econtract-data', methods=['POST'])
def process_econtract_data():
    """Process the uploaded e-contract templates"""
    try:
        admin_email = request.json.get('admin_email')
        if not admin_email:
            return jsonify({'error': 'Admin email is required'}), 401
        
        admin = AdminUser.query.filter_by(email=admin_email, is_active=True).first()
        if not admin:
            return jsonify({'error': 'Admin not found or inactive'}), 401
        
        # Process e-contract files
        econtract_dir = '/home/ubuntu/e-contracts'
        topics = data_processor.batch_process_directory(econtract_dir)
        
        # Create training session
        session_name = f"EContract_Training_{datetime.utcnow().strftime('%Y%m%d_%H%M%S')}"
        training_session = TrainingSession(
            session_name=session_name,
            admin_email=admin_email,
            file_count=len(topics),
            topics_added=len(topics)
        )
        db.session.add(training_session)
        
        processed_topics = []
        
        for topic_data in topics:
            # Create knowledge base entry
            kb_entry = KnowledgeBase(
                topic=topic_data['topic'],
                content=topic_data['content'],
                file_type=topic_data['file_type'],
                source_file=topic_data['source_file'],
                category=topic_data['category'],
                tags=topic_data['hashtags'],
                legal_text=topic_data['legal_text'],
                created_by=admin_email
            )
            db.session.add(kb_entry)
            db.session.flush()
            
            # Create topic index entry
            topic_index = TopicIndex(
                topic_name=topic_data['topic'],
                category=topic_data['category'],
                knowledge_base_id=kb_entry.id,
                hashtags=json.dumps(topic_data['hashtags']),
                is_legal_document=topic_data['is_legal_document']
            )
            db.session.add(topic_index)
            
            processed_topics.append({
                'topic': topic_data['topic'],
                'category': topic_data['category'],
                'hashtags': topic_data['hashtags'],
                'content_hash': kb_entry.content_hash
            })
        
        training_session.status = 'completed'
        training_session.completed_at = datetime.utcnow()
        db.session.commit()
        
        return jsonify({
            'message': f'Successfully processed {len(topics)} e-contract topics',
            'training_session': training_session.to_dict(),
            'processed_topics': processed_topics
        })
        
    except Exception as e:
        return jsonify({'error': f'E-contract processing error: {str(e)}'}), 500

@admin_training_bp.route('/admin/topics', methods=['GET'])
def get_all_topics():
    """Get all topics sorted alphabetically with hashtags"""
    try:
        # Get query parameters
        category = request.args.get('category')
        search = request.args.get('search', '').strip()
        page = int(request.args.get('page', 1))
        per_page = int(request.args.get('per_page', 50))
        
        # Build query
        query = TopicIndex.query
        
        if category:
            query = query.filter(TopicIndex.category == category)
        
        if search:
            query = query.filter(TopicIndex.topic_name.contains(search))
        
        # Order alphabetically
        query = query.order_by(TopicIndex.topic_name.asc())
        
        # Paginate
        topics = query.paginate(
            page=page, 
            per_page=per_page, 
            error_out=False
        )
        
        return jsonify({
            'topics': [topic.to_dict() for topic in topics.items],
            'pagination': {
                'page': page,
                'per_page': per_page,
                'total': topics.total,
                'pages': topics.pages,
                'has_next': topics.has_next,
                'has_prev': topics.has_prev
            }
        })
        
    except Exception as e:
        return jsonify({'error': f'Topics retrieval error: {str(e)}'}), 500

@admin_training_bp.route('/admin/topic/<int:topic_id>', methods=['GET'])
def get_topic_details(topic_id):
    """Get detailed information about a specific topic"""
    try:
        topic_index = TopicIndex.query.get_or_404(topic_id)
        knowledge_entry = topic_index.knowledge_entry
        
        return jsonify({
            'topic_index': topic_index.to_dict(),
            'knowledge_entry': knowledge_entry.to_dict()
        })
        
    except Exception as e:
        return jsonify({'error': f'Topic details error: {str(e)}'}), 500

@admin_training_bp.route('/admin/categories', methods=['GET'])
def get_categories():
    """Get all available categories"""
    try:
        categories = db.session.query(TopicIndex.category).distinct().all()
        category_list = [cat[0] for cat in categories]
        
        return jsonify({
            'categories': sorted(category_list)
        })
        
    except Exception as e:
        return jsonify({'error': f'Categories error: {str(e)}'}), 500

@admin_training_bp.route('/admin/training-sessions', methods=['GET'])
def get_training_sessions():
    """Get all training sessions"""
    try:
        admin_email = request.args.get('admin_email')
        
        query = TrainingSession.query
        if admin_email:
            query = query.filter(TrainingSession.admin_email == admin_email)
        
        sessions = query.order_by(TrainingSession.created_at.desc()).all()
        
        return jsonify({
            'training_sessions': [session.to_dict() for session in sessions]
        })
        
    except Exception as e:
        return jsonify({'error': f'Training sessions error: {str(e)}'}), 500

@admin_training_bp.route('/admin/stats', methods=['GET'])
def get_admin_stats():
    """Get admin dashboard statistics"""
    try:
        total_topics = TopicIndex.query.count()
        total_legal_docs = TopicIndex.query.filter(TopicIndex.is_legal_document == True).count()
        total_admins = AdminUser.query.filter(AdminUser.is_active == True).count()
        total_sessions = TrainingSession.query.count()
        
        # Category breakdown
        category_stats = db.session.query(
            TopicIndex.category, 
            db.func.count(TopicIndex.id)
        ).group_by(TopicIndex.category).all()
        
        return jsonify({
            'total_topics': total_topics,
            'total_legal_documents': total_legal_docs,
            'total_admins': total_admins,
            'total_training_sessions': total_sessions,
            'category_breakdown': {cat: count for cat, count in category_stats}
        })
        
    except Exception as e:
        return jsonify({'error': f'Stats error: {str(e)}'}), 500

