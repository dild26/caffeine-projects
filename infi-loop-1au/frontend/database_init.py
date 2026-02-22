"""
Database initialization script for SECOINFI AI Voice Assistant
Creates all required tables and initializes with sample data
"""

from src.models.user import db, User, AdminAuth
from src.models.knowledge import KnowledgeBase, ConversationLog, TopicQuery
from src.models.navigation import NavigationItem
from src.models.domain import Domain, DomainBatch, Protocol, DomainAnalysisQueue
import hashlib
from datetime import datetime

def init_database(app):
    """Initialize database with all tables and sample data"""
    with app.app_context():
        # Create all tables
        db.create_all()
        
        # Initialize admin authentication
        if not AdminAuth.query.first():
            admin_auth = AdminAuth(
                auth_code="SECOINFI2024",
                is_active=True,
                created_at=datetime.utcnow()
            )
            db.session.add(admin_auth)
        
        # Initialize default protocols
        default_protocols = [
            {"protocol": "http://", "description": "Standard HTTP protocol"},
            {"protocol": "https://", "description": "Secure HTTPS protocol"},
            {"protocol": "http://www.", "description": "HTTP with www subdomain"},
            {"protocol": "https://www.", "description": "HTTPS with www subdomain"},
            {"protocol": "wsl://", "description": "Windows Subsystem for Linux protocol"},
            {"protocol": "upi://", "description": "Unified Payments Interface protocol"}
        ]
        
        for proto_data in default_protocols:
            if not Protocol.query.filter_by(protocol=proto_data["protocol"]).first():
                protocol = Protocol(
                    protocol=proto_data["protocol"],
                    description=proto_data["description"],
                    is_active=True,
                    usage_count=0,
                    created_at=datetime.utcnow()
                )
                db.session.add(protocol)
        
        # Initialize knowledge base with SECOINFI information
        knowledge_entries = [
            {
                "topic": "SECOINFI",
                "content": "SECOINFI is a blockchain business development company led by CEO Dileep Kumar D. We provide comprehensive blockchain services, domain analysis, and AI-powered solutions for businesses looking to integrate blockchain technology."
            },
            {
                "topic": "Services",
                "content": "SECOINFI offers blockchain development, smart contract creation, domain analysis and ranking, SEO optimization, and AI voice assistant services. We help businesses leverage blockchain technology for growth and innovation."
            },
            {
                "topic": "Domain Analysis",
                "content": "Our domain analysis service provides comprehensive insights including domain authority, page authority, sitemap analysis, search engine indexing status, and link submission tracking. We support multiple protocols and can process thousands of domains in bulk."
            },
            {
                "topic": "Contact",
                "content": "CEO: Dileep Kumar D, Phone/WhatsApp: +91 9620058644, Website: seco.in.net, Metamask: 0x4a100E184ac1f17491Fbbcf549CeBfB676694eF7"
            }
        ]
        
        for entry in knowledge_entries:
            if not KnowledgeBase.query.filter_by(topic=entry["topic"]).first():
                kb_entry = KnowledgeBase(
                    topic=entry["topic"],
                    content=entry["content"],
                    is_active=True,
                    created_at=datetime.utcnow()
                )
                db.session.add(kb_entry)
        
        # Initialize topic queries for navigation
        topic_queries = [
            {
                "topic": "SECOINFI Services",
                "query": "What services does SECOINFI provide?",
                "answer": "SECOINFI provides blockchain development, smart contract creation, domain analysis, SEO optimization, and AI voice assistant services."
            },
            {
                "topic": "Domain Analysis",
                "query": "How does domain analysis work?",
                "answer": "Our domain analysis examines domain authority, page authority, sitemap structure, search engine indexing, and provides comprehensive SEO insights."
            },
            {
                "topic": "Contact Information",
                "query": "How can I contact SECOINFI?",
                "answer": "You can contact CEO Dileep Kumar D at +91 9620058644 or visit our website at seco.in.net"
            }
        ]
        
        for i, query_data in enumerate(topic_queries):
            query_hash = hashlib.md5(query_data["query"].encode()).hexdigest()
            if not TopicQuery.query.filter_by(hex_hash=query_hash).first():
                topic_query = TopicQuery(
                    index_num=i + 1,
                    hex_hash=query_hash,
                    topic=query_data["topic"],
                    query=query_data["query"],
                    answer=query_data["answer"],
                    is_active=True,
                    created_at=datetime.utcnow()
                )
                db.session.add(topic_query)
        
        # Initialize navigation items
        nav_items = [
            {"title": "Home", "url": "/", "order": 1},
            {"title": "Chat", "url": "/chat", "order": 2},
            {"title": "Domain Analysis", "url": "/domain", "order": 3},
            {"title": "Admin", "url": "/admin", "order": 4}
        ]
        
        for nav_data in nav_items:
            if not NavigationItem.query.filter_by(title=nav_data["title"]).first():
                nav_item = NavigationItem(
                    title=nav_data["title"],
                    url=nav_data["url"],
                    order=nav_data["order"],
                    is_active=True,
                    created_at=datetime.utcnow()
                )
                db.session.add(nav_item)
        
        # Commit all changes
        try:
            db.session.commit()
            print("Database initialized successfully!")
            return True
        except Exception as e:
            db.session.rollback()
            print(f"Error initializing database: {e}")
            return False

def reset_database(app):
    """Reset database by dropping and recreating all tables"""
    with app.app_context():
        db.drop_all()
        db.create_all()
        return init_database(app)

