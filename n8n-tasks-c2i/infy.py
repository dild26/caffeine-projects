from flask import Blueprint, request, jsonify, current_app
from src.models.knowledge import db, KnowledgeBase, ConversationLog
import json
import re
from datetime import datetime

infy_bp = Blueprint("infy", __name__)

class InfyAI:
    def __init__(self):
        pass
    
    def initialize_knowledge_base(self):
        """Initialize the knowledge base with SECOINFI information"""
        # Check if knowledge base is already populated
        if KnowledgeBase.query.count() > 0:
            return
        
        # SECOINFI basic information
        secoinfi_info = [
            {
                "topic": "company_overview",
                "content": "SECOINFI is a blockchain business development service company under Sudha Enterprises, Bangalore 560097. Led by CEO Dileep Kumar D, the company focuses on futuristic products and services using blockchain technology.",
                "source": "company_profile",
                "priority": 4
            },
            {
                "topic": "contact_information",
                "content": "CEO: Dileep Kumar D. Phone/WhatsApp: +91 9620058644. Website: seco.in.net. Metamask Address: 0x4a100E184ac1f17491Fbbcf549CeBfB676694eF7",
                "source": "company_profile",
                "priority": 4
            },
            {
                "topic": "services",
                "content": "SECOINFI offers premium backlink services with access to top 1 million domain sitemap links database, blockchain business development, data mining operations, and web3 promotion services.",
                "source": "company_profile",
                "priority": 4
            },
            {
                "topic": "data_mining",
                "content": "SECOINFI has completed extensive data mining operations including processing up to 1 billion links for website sitemap indices. They promote 1,000 company domains daily and have served over 8 billion global online users.",
                "source": "company_profile",
                "priority": 4
            },
            {
                "topic": "investment_model",
                "content": "SECOINFI offers investment opportunities with promised returns of up to 7500%. Minimum investment starts from Re.1/- up to Rs.1 CRORE. Two payment options: gPay to 9620058644 or Metamask (0.0175 ETH). Returns depend on business transactions and client base.",
                "source": "company_profile",
                "priority": 4
            },