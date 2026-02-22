from src.models.user import db
from datetime import datetime
import json

class Domain(db.Model):
    __tablename__ = 'domains'
    
    id = db.Column(db.Integer, primary_key=True)
    domain_name = db.Column(db.String(255), nullable=False, index=True)
    protocol = db.Column(db.String(20), nullable=False, default='https://')
    full_url = db.Column(db.String(500), nullable=False, index=True)
    
    # SEO and ranking data
    domain_authority = db.Column(db.Integer, default=0)
    page_authority = db.Column(db.Integer, default=0)
    alexa_rank = db.Column(db.String(50), default='N/A')
    
    # Sitemap information
    sitemap_found = db.Column(db.Boolean, default=False)
    sitemap_url = db.Column(db.String(500))
    sitemap_pages_count = db.Column(db.Integer, default=0)
    
    # Indexing status
    google_indexed = db.Column(db.Boolean, default=False)
    bing_indexed = db.Column(db.Boolean, default=False)
    indexed_pages_count = db.Column(db.Integer, default=0)
    
    # Search engine integration
    google_search_console_verified = db.Column(db.Boolean, default=False)
    bing_webmaster_verified = db.Column(db.Boolean, default=False)
    
    # Link submission tracking
    submitted_directories = db.Column(db.Integer, default=0)
    pending_submissions = db.Column(db.Integer, default=0)
    
    # Analysis metadata
    last_analyzed = db.Column(db.DateTime)
    analysis_status = db.Column(db.String(50), default='pending')  # pending, analyzing, completed, failed
    analysis_notes = db.Column(db.Text)
    
    # Timestamps
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    is_active = db.Column(db.Boolean, default=True)
    
    def __init__(self, domain_name, protocol='https://'):
        self.domain_name = domain_name
        self.protocol = protocol
        self.full_url = f"{protocol}{domain_name}"
    
    def to_dict(self):
        return {
            'id': self.id,
            'domain_name': self.domain_name,
            'protocol': self.protocol,
            'full_url': self.full_url,
            'ranking': {
                'domain_authority': self.domain_authority,
                'page_authority': self.page_authority,
                'alexa_rank': self.alexa_rank
            },
            'sitemap': {
                'found': self.sitemap_found,
                'url': self.sitemap_url,
                'pages_count': self.sitemap_pages_count
            },
            'indexing': {
                'google_indexed': self.google_indexed,
                'bing_indexed': self.bing_indexed,
                'indexed_pages': self.indexed_pages_count
            },
            'search_engine_integration': {
                'google_search_console': 'Verified' if self.google_search_console_verified else 'Not verified',
                'bing_webmaster': 'Verified' if self.bing_webmaster_verified else 'Not verified'
            },
            'link_submissions': {
                'submitted_directories': self.submitted_directories,
                'pending_submissions': self.pending_submissions
            },
            'analysis': {
                'last_analyzed': self.last_analyzed.isoformat() if self.last_analyzed else None,
                'status': self.analysis_status,
                'notes': self.analysis_notes
            },
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat(),
            'is_active': self.is_active
        }

class DomainBatch(db.Model):
    __tablename__ = 'domain_batches'
    
    id = db.Column(db.Integer, primary_key=True)
    batch_name = db.Column(db.String(255), nullable=False)
    file_type = db.Column(db.String(10), nullable=False)  # csv, json
    total_domains = db.Column(db.Integer, default=0)
    processed_domains = db.Column(db.Integer, default=0)
    failed_domains = db.Column(db.Integer, default=0)
    
    # Batch processing status
    status = db.Column(db.String(50), default='pending')  # pending, processing, completed, failed
    progress_percentage = db.Column(db.Float, default=0.0)
    
    # File information
    original_filename = db.Column(db.String(255))
    file_size = db.Column(db.Integer)
    
    # Processing metadata
    started_at = db.Column(db.DateTime)
    completed_at = db.Column(db.DateTime)
    error_message = db.Column(db.Text)
    
    # Timestamps
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    def to_dict(self):
        return {
            'id': self.id,
            'batch_name': self.batch_name,
            'file_type': self.file_type,
            'total_domains': self.total_domains,
            'processed_domains': self.processed_domains,
            'failed_domains': self.failed_domains,
            'status': self.status,
            'progress_percentage': self.progress_percentage,
            'original_filename': self.original_filename,
            'file_size': self.file_size,
            'started_at': self.started_at.isoformat() if self.started_at else None,
            'completed_at': self.completed_at.isoformat() if self.completed_at else None,
            'error_message': self.error_message,
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat()
        }

class Protocol(db.Model):
    __tablename__ = 'protocols'
    
    id = db.Column(db.Integer, primary_key=True)
    protocol = db.Column(db.String(50), nullable=False, unique=True)
    description = db.Column(db.String(255))
    is_active = db.Column(db.Boolean, default=True)
    usage_count = db.Column(db.Integer, default=0)
    
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    def to_dict(self):
        return {
            'id': self.id,
            'protocol': self.protocol,
            'description': self.description,
            'is_active': self.is_active,
            'usage_count': self.usage_count,
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat()
        }

class DomainAnalysisQueue(db.Model):
    __tablename__ = 'domain_analysis_queue'
    
    id = db.Column(db.Integer, primary_key=True)
    domain_id = db.Column(db.Integer, db.ForeignKey('domains.id'), nullable=False)
    batch_id = db.Column(db.Integer, db.ForeignKey('domain_batches.id'), nullable=True)
    
    priority = db.Column(db.Integer, default=1)  # 1=low, 2=medium, 3=high, 4=urgent
    status = db.Column(db.String(50), default='queued')  # queued, processing, completed, failed
    
    # Processing metadata
    attempts = db.Column(db.Integer, default=0)
    max_attempts = db.Column(db.Integer, default=3)
    last_attempt = db.Column(db.DateTime)
    error_message = db.Column(db.Text)
    
    # Timestamps
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    domain = db.relationship('Domain', backref='analysis_queue_entries')
    batch = db.relationship('DomainBatch', backref='queued_domains')
    
    def to_dict(self):
        return {
            'id': self.id,
            'domain_id': self.domain_id,
            'batch_id': self.batch_id,
            'priority': self.priority,
            'status': self.status,
            'attempts': self.attempts,
            'max_attempts': self.max_attempts,
            'last_attempt': self.last_attempt.isoformat() if self.last_attempt else None,
            'error_message': self.error_message,
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat(),
            'domain': self.domain.to_dict() if self.domain else None
        }

