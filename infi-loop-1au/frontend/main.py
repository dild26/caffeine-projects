import os
import sys
import json
import hashlib
import random
from datetime import datetime
from flask import Flask, request, jsonify, send_from_directory, send_file
from flask_cors import CORS

# Initialize Flask app
app = Flask(__name__, static_folder='../static', static_url_path='/static')

# Configuration
app.config['SECRET_KEY'] = 'secoinfi-ai-voice-assistant-2024'
CORS(app, origins="*")

# Simple in-memory storage for demo purposes
# In production, this would be replaced with a proper database
data_store = {
    'admin_codes': ['SECOINFI2024'],
    'knowledge_base': {
        'SECOINFI': 'SECOINFI is a blockchain business development company led by CEO Dileep Kumar D. We provide comprehensive blockchain services, domain analysis, and AI-powered solutions for businesses looking to integrate blockchain technology.',
        'Services': 'SECOINFI offers blockchain development, smart contract creation, domain analysis and ranking, SEO optimization, and AI voice assistant services. We help businesses leverage blockchain technology for growth and innovation.',
        'Domain Analysis': 'Our domain analysis service provides comprehensive insights including domain authority, page authority, sitemap analysis, search engine indexing status, and link submission tracking. We support multiple protocols and can process thousands of domains in bulk.',
        'Contact': 'CEO: Dileep Kumar D, Phone/WhatsApp: +91 9620058644, Website: seco.in.net, Metamask: 0x4a100E184ac1f17491Fbbcf549CeBfB676694eF7'
    },
    'protocols': [
        {'protocol': 'http://', 'description': 'Standard HTTP protocol'},
        {'protocol': 'https://', 'description': 'Secure HTTPS protocol'},
        {'protocol': 'http://www.', 'description': 'HTTP with www subdomain'},
        {'protocol': 'https://www.', 'description': 'HTTPS with www subdomain'},
        {'protocol': 'wsl://', 'description': 'Windows Subsystem for Linux protocol'},
        {'protocol': 'upi://', 'description': 'Unified Payments Interface protocol'}
    ],
    'conversations': [],
    'domains': {},
    'batches': []
}

def find_knowledge_response(message):
    """Find relevant response from knowledge base"""
    message_lower = message.lower()
    
    # Check for specific keywords
    if any(word in message_lower for word in ['secoinfi', 'company', 'what is']):
        return data_store['knowledge_base']['SECOINFI']
    elif any(word in message_lower for word in ['service', 'offer', 'provide']):
        return data_store['knowledge_base']['Services']
    elif any(word in message_lower for word in ['domain', 'analysis', 'ranking']):
        return data_store['knowledge_base']['Domain Analysis']
    elif any(word in message_lower for word in ['contact', 'phone', 'email', 'reach']):
        return data_store['knowledge_base']['Contact']
    else:
        return "I'm Infy, your AI assistant for SECOINFI! I can help you with blockchain services, domain analysis, and more. How can I assist you today?"

@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'message': 'SECOINFI AI Voice Assistant API is running',
        'frontend_url': 'https://bpwwlqhp.manus.space',
        'api_base': '/api',
        'timestamp': datetime.utcnow().isoformat()
    })

@app.route('/api/infy/chat', methods=['POST'])
def infy_chat():
    """Chat endpoint for Infy AI"""
    try:
        data = request.get_json()
        if not data:
            return jsonify({'error': 'No JSON data provided'}), 400
            
        message = data.get('message', '').strip()
        session_id = data.get('session_id', 'default')
        
        if not message:
            return jsonify({'error': 'Message is required'}), 400
        
        # Find response
        response = find_knowledge_response(message)
        
        # Log conversation
        conversation = {
            'session_id': session_id,
            'user_message': message,
            'bot_response': response,
            'timestamp': datetime.utcnow().isoformat()
        }
        data_store['conversations'].append(conversation)
        
        return jsonify({
            'response': response,
            'timestamp': datetime.utcnow().isoformat(),
            'session_id': session_id
        })
        
    except Exception as e:
        return jsonify({'error': f'Chat error: {str(e)}'}), 500

@app.route('/api/admin/authenticate', methods=['POST'])
def admin_authenticate():
    """Admin authentication endpoint"""
    try:
        data = request.get_json()
        if not data:
            return jsonify({'error': 'No JSON data provided'}), 400
            
        auth_code = data.get('auth_code', '').strip()
        
        if not auth_code:
            return jsonify({'error': 'Authentication code is required'}), 400
        
        if auth_code not in data_store['admin_codes']:
            return jsonify({'error': 'Invalid authentication code'}), 401
        
        # Generate simple QR code data (in production, use proper QR library)
        qr_data = f"otpauth://totp/SECOINFI:admin?secret=SECOINFI2024&issuer=SECOINFI"
        
        return jsonify({
            'message': 'Authentication successful',
            'qr_code': f'data:text/plain;base64,{qr_data}',  # Simplified for demo
            'authenticated': True
        })
        
    except Exception as e:
        return jsonify({'error': f'Authentication error: {str(e)}'}), 500

@app.route('/api/domain/analyze', methods=['POST'])
def analyze_domain():
    """Domain analysis endpoint"""
    try:
        data = request.get_json()
        if not data:
            return jsonify({'error': 'No JSON data provided'}), 400
            
        domain = data.get('domain', '').strip()
        protocol = data.get('protocol', 'https://').strip()
        
        if not domain:
            return jsonify({'error': 'Domain is required'}), 400
        
        full_url = f"{protocol}{domain}"
        domain_key = f"{protocol}{domain}"
        
        # Check if already analyzed
        if domain_key in data_store['domains']:
            analysis_result = data_store['domains'][domain_key]
        else:
            # Simulate analysis
            analysis_result = {
                'domain': domain,
                'protocol': protocol,
                'full_url': full_url,
                'ranking': {
                    'domain_authority': random.randint(20, 95),
                    'page_authority': random.randint(15, 85)
                },
                'sitemap': {
                    'found': random.choice([True, False]),
                    'pages_count': random.randint(10, 1000)
                },
                'indexing': {
                    'google_indexed': random.choice([True, False]),
                    'bing_indexed': random.choice([True, False])
                },
                'status': 'completed',
                'analyzed_at': datetime.utcnow().isoformat()
            }
            
            # Store result
            data_store['domains'][domain_key] = analysis_result
        
        return jsonify({'analysis': analysis_result})
        
    except Exception as e:
        return jsonify({'error': f'Domain analysis error: {str(e)}'}), 500

@app.route('/api/domain/protocols', methods=['GET'])
def get_protocols():
    """Get available protocols"""
    try:
        return jsonify({'protocols': data_store['protocols']})
    except Exception as e:
        return jsonify({'error': f'Protocols error: {str(e)}'}), 500

@app.route('/api/domain/bulk-upload', methods=['POST'])
def bulk_upload_domains():
    """Bulk domain upload endpoint"""
    try:
        data = request.get_json()
        if not data:
            return jsonify({'error': 'No JSON data provided'}), 400
            
        file_type = data.get('file_type', 'json')
        domains_data = data.get('domains_data', [])
        batch_name = data.get('batch_name', f'Batch_{datetime.utcnow().strftime("%Y%m%d_%H%M%S")}')
        
        if not domains_data:
            return jsonify({'error': 'Domains data is required'}), 400
        
        # Create batch record
        batch = {
            'id': len(data_store['batches']) + 1,
            'batch_name': batch_name,
            'total_domains': len(domains_data),
            'processed_domains': 0,
            'status': 'processing',
            'created_at': datetime.utcnow().isoformat()
        }
        
        # Process domains
        processed_count = 0
        for domain_info in domains_data:
            try:
                domain = domain_info.get('domain', '').strip()
                protocol = domain_info.get('protocol', 'https://').strip()
                
                if domain:
                    domain_key = f"{protocol}{domain}"
                    if domain_key not in data_store['domains']:
                        data_store['domains'][domain_key] = {
                            'domain': domain,
                            'protocol': protocol,
                            'full_url': f"{protocol}{domain}",
                            'status': 'queued',
                            'queued_at': datetime.utcnow().isoformat()
                        }
                        processed_count += 1
            except Exception as e:
                print(f"Error processing domain {domain_info}: {e}")
        
        # Update batch
        batch['processed_domains'] = processed_count
        batch['status'] = 'completed'
        data_store['batches'].append(batch)
        
        return jsonify({
            'message': f'Successfully queued {processed_count} domains for analysis',
            'batch': batch
        })
        
    except Exception as e:
        return jsonify({'error': f'Bulk upload error: {str(e)}'}), 500

@app.route('/', methods=['GET'])
def serve_frontend():
    """Serve frontend or API info"""
    try:
        # Try to serve static index.html if it exists
        static_path = os.path.join(app.static_folder, 'index.html')
        if os.path.exists(static_path):
            return send_file(static_path)
    except:
        pass
    
    # Return API information
    return jsonify({
        'message': 'SECOINFI AI Voice Assistant API',
        'status': 'running',
        'frontend_url': 'https://bpwwlqhp.manus.space',
        'api_endpoints': [
            '/api/health',
            '/api/infy/chat',
            '/api/admin/authenticate',
            '/api/domain/analyze',
            '/api/domain/protocols',
            '/api/domain/bulk-upload'
        ],
        'timestamp': datetime.utcnow().isoformat()
    })

@app.route('/<path:path>', methods=['GET'])
def serve_static_files(path):
    """Serve static files"""
    try:
        return send_from_directory(app.static_folder, path)
    except:
        return serve_frontend()

@app.errorhandler(404)
def not_found(error):
    """Handle 404 errors"""
    return jsonify({
        'error': 'Not found',
        'message': 'The requested resource was not found',
        'frontend_url': 'https://bpwwlqhp.manus.space'
    }), 404

@app.errorhandler(500)
def internal_error(error):
    """Handle 500 errors"""
    return jsonify({
        'error': 'Internal server error',
        'message': 'An internal error occurred',
        'frontend_url': 'https://bpwwlqhp.manus.space'
    }), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=False)

