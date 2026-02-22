"""
Blockchain Verification Routes for Infy AI
Handles blockchain verification, hashing, and decentralized data integrity
"""
import json
from flask import Blueprint, request, jsonify
from src.services.blockchain_service import BlockchainService, HashingService
from src.models.knowledge import db, BlockchainVerification, KnowledgeBase

blockchain_bp = Blueprint('blockchain', __name__)
blockchain_service = BlockchainService()

# Initialize genesis block
blockchain_service.create_genesis_block()

@blockchain_bp.route('/blockchain/verify-content', methods=['POST'])
def verify_content():
    """Verify content hash on blockchain"""
    try:
        data = request.get_json()
        content_hash = data.get('content_hash')
        
        if not content_hash:
            return jsonify({'error': 'Content hash is required'}), 400
        
        verification = blockchain_service.verify_content_hash(content_hash)
        
        return jsonify({
            'verification': verification,
            'blockchain_stats': blockchain_service.get_chain_stats()
        })
        
    except Exception as e:
        return jsonify({'error': f'Verification error: {str(e)}'}), 500

@blockchain_bp.route('/blockchain/add-to-chain', methods=['POST'])
def add_to_blockchain():
    """Add content hash to blockchain for verification"""
    try:
        data = request.get_json()
        content_hash = data.get('content_hash')
        data_type = data.get('data_type', 'knowledge')
        admin_email = data.get('admin_email')
        metadata = data.get('metadata', {})
        
        if not content_hash or not admin_email:
            return jsonify({'error': 'Content hash and admin email are required'}), 400
        
        # Create transaction
        transaction = blockchain_service.create_transaction(
            content_hash, data_type, admin_email, metadata
        )
        
        # Mine the block
        new_block = blockchain_service.mine_pending_transactions(admin_email)
        
        # Update database
        verification_record = BlockchainVerification(
            content_hash=content_hash,
            ethereum_hash=new_block['hash'] if new_block else None,
            block_number=new_block['index'] if new_block else None,
            verification_status='verified' if new_block else 'pending'
        )
        db.session.add(verification_record)
        
        # Update knowledge base entry
        kb_entry = KnowledgeBase.query.filter_by(content_hash=content_hash).first()
        if kb_entry:
            kb_entry.blockchain_hash = new_block['hash'] if new_block else None
            kb_entry.verification_status = 'verified' if new_block else 'pending'
        
        db.session.commit()
        
        return jsonify({
            'message': 'Content added to blockchain successfully',
            'transaction': transaction,
            'block': new_block,
            'verification_record': verification_record.to_dict()
        })
        
    except Exception as e:
        return jsonify({'error': f'Blockchain addition error: {str(e)}'}), 500

@blockchain_bp.route('/blockchain/batch-verify', methods=['POST'])
def batch_verify():
    """Batch verify multiple content hashes"""
    try:
        data = request.get_json()
        content_hashes = data.get('content_hashes', [])
        admin_email = data.get('admin_email')
        
        if not content_hashes or not admin_email:
            return jsonify({'error': 'Content hashes and admin email are required'}), 400
        
        results = []
        
        for content_hash in content_hashes:
            # Create transaction
            transaction = blockchain_service.create_transaction(
                content_hash, 'batch_verification', admin_email
            )
            results.append({
                'content_hash': content_hash,
                'transaction': transaction
            })
        
        # Mine all pending transactions
        new_block = blockchain_service.mine_pending_transactions(admin_email)
        
        # Update database records
        for content_hash in content_hashes:
            verification_record = BlockchainVerification(
                content_hash=content_hash,
                ethereum_hash=new_block['hash'] if new_block else None,
                block_number=new_block['index'] if new_block else None,
                verification_status='verified' if new_block else 'pending'
            )
            db.session.add(verification_record)
            
            # Update knowledge base entry
            kb_entry = KnowledgeBase.query.filter_by(content_hash=content_hash).first()
            if kb_entry:
                kb_entry.blockchain_hash = new_block['hash'] if new_block else None
                kb_entry.verification_status = 'verified' if new_block else 'pending'
        
        db.session.commit()
        
        return jsonify({
            'message': f'Batch verified {len(content_hashes)} content hashes',
            'results': results,
            'block': new_block,
            'blockchain_stats': blockchain_service.get_chain_stats()
        })
        
    except Exception as e:
        return jsonify({'error': f'Batch verification error: {str(e)}'}), 500

@blockchain_bp.route('/blockchain/get-proof', methods=['POST'])
def get_verification_proof():
    """Get cryptographic proof of content verification"""
    try:
        data = request.get_json()
        content_hash = data.get('content_hash')
        
        if not content_hash:
            return jsonify({'error': 'Content hash is required'}), 400
        
        proof = blockchain_service.get_verification_proof(content_hash)
        
        return jsonify({
            'proof': proof
        })
        
    except Exception as e:
        return jsonify({'error': f'Proof generation error: {str(e)}'}), 500

@blockchain_bp.route('/blockchain/certificate', methods=['POST'])
def get_verification_certificate():
    """Get verification certificate for content"""
    try:
        data = request.get_json()
        content_hash = data.get('content_hash')
        
        if not content_hash:
            return jsonify({'error': 'Content hash is required'}), 400
        
        certificate = blockchain_service.export_verification_certificate(content_hash)
        
        return jsonify({
            'certificate': certificate
        })
        
    except Exception as e:
        return jsonify({'error': f'Certificate generation error: {str(e)}'}), 500

@blockchain_bp.route('/blockchain/stats', methods=['GET'])
def get_blockchain_stats():
    """Get blockchain statistics"""
    try:
        stats = blockchain_service.get_chain_stats()
        
        # Add database stats
        db_verified = BlockchainVerification.query.filter_by(verification_status='verified').count()
        db_pending = BlockchainVerification.query.filter_by(verification_status='pending').count()
        
        stats.update({
            'database_verified': db_verified,
            'database_pending': db_pending
        })
        
        return jsonify({
            'blockchain_stats': stats
        })
        
    except Exception as e:
        return jsonify({'error': f'Stats error: {str(e)}'}), 500

@blockchain_bp.route('/blockchain/validate', methods=['GET'])
def validate_blockchain():
    """Validate the entire blockchain"""
    try:
        validation = blockchain_service.validate_chain()
        
        return jsonify({
            'validation': validation,
            'chain_length': len(blockchain_service.chain)
        })
        
    except Exception as e:
        return jsonify({'error': f'Validation error: {str(e)}'}), 500

@blockchain_bp.route('/blockchain/hash-content', methods=['POST'])
def hash_content():
    """Generate hash for content"""
    try:
        data = request.get_json()
        content = data.get('content')
        algorithm = data.get('algorithm', 'sha256')
        
        if not content:
            return jsonify({'error': 'Content is required'}), 400
        
        content_hash = HashingService.generate_content_hash(content, algorithm)
        
        return jsonify({
            'content_hash': content_hash,
            'algorithm': algorithm,
            'content_length': len(content)
        })
        
    except Exception as e:
        return jsonify({'error': f'Hashing error: {str(e)}'}), 500

@blockchain_bp.route('/blockchain/batch-hash', methods=['POST'])
def batch_hash_content():
    """Generate batch hash for multiple content items"""
    try:
        data = request.get_json()
        content_list = data.get('content_list', [])
        
        if not content_list:
            return jsonify({'error': 'Content list is required'}), 400
        
        batch_hash = HashingService.generate_batch_hash(content_list)
        
        return jsonify({
            'batch_hash': batch_hash
        })
        
    except Exception as e:
        return jsonify({'error': f'Batch hashing error: {str(e)}'}), 500

@blockchain_bp.route('/blockchain/verify-integrity', methods=['POST'])
def verify_content_integrity():
    """Verify content integrity using hash"""
    try:
        data = request.get_json()
        content = data.get('content')
        provided_hash = data.get('hash')
        algorithm = data.get('algorithm', 'sha256')
        
        if not content or not provided_hash:
            return jsonify({'error': 'Content and hash are required'}), 400
        
        is_valid = HashingService.verify_content_integrity(content, provided_hash, algorithm)
        calculated_hash = HashingService.generate_content_hash(content, algorithm)
        
        return jsonify({
            'integrity_valid': is_valid,
            'provided_hash': provided_hash,
            'calculated_hash': calculated_hash,
            'algorithm': algorithm
        })
        
    except Exception as e:
        return jsonify({'error': f'Integrity verification error: {str(e)}'}), 500

