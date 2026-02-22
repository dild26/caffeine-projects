from src.models.user import db
from datetime import datetime
import hashlib

class NavigationSession(db.Model):
    __tablename__ = 'navigation_sessions'
    
    id = db.Column(db.Integer, primary_key=True)
    session_id = db.Column(db.String(255), nullable=False, unique=True)
    current_index = db.Column(db.Integer, default=0)
    topic = db.Column(db.String(255), nullable=False)
    query_results = db.Column(db.Text)  # JSON string of query results
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    def to_dict(self):
        return {
            'id': self.id,
            'session_id': self.session_id,
            'current_index': self.current_index,
            'topic': self.topic,
            'query_results': self.query_results,
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat()
        }

class TopicQuery(db.Model):
    __tablename__ = 'topic_queries'
    
    id = db.Column(db.Integer, primary_key=True)
    index_num = db.Column(db.Integer, nullable=False)
    hex_hash = db.Column(db.String(66), nullable=False)  # 0x prefix + 64 hex chars
    topic = db.Column(db.String(255), nullable=False)
    query = db.Column(db.Text, nullable=False)
    answer = db.Column(db.Text, nullable=False)
    is_active = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    def __init__(self, index_num, topic, query, answer):
        self.index_num = index_num
        self.topic = topic
        self.query = query
        self.answer = answer
        # Auto-generate hex hash based on index
        self.hex_hash = self.generate_hex_hash(index_num)
    
    @staticmethod
    def generate_hex_hash(index_num):
        """Generate deterministic hex hash from index number"""
        return f"0x{index_num:x}"
    
    def to_dict(self):
        return {
            'id': self.id,
            'index_num': self.index_num,
            'hex_hash': self.hex_hash,
            'topic': self.topic,
            'query': self.query,
            'answer': self.answer,
            'is_active': self.is_active,
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat()
        }

class AdminAuth(db.Model):
    __tablename__ = 'admin_auth'
    
    id = db.Column(db.Integer, primary_key=True)
    topic_hash = db.Column(db.String(66), nullable=False, unique=True)
    topic_name = db.Column(db.String(255), nullable=False)
    is_authorized = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    def to_dict(self):
        return {
            'id': self.id,
            'topic_hash': self.topic_hash,
            'topic_name': self.topic_name,
            'is_authorized': self.is_authorized,
            'created_at': self.created_at.isoformat()
        }

