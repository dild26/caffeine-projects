"""
Blockchain Verification Service for Infy AI
Handles hashing, verification, and decentralized data integrity
"""
import hashlib
import json
import time
from datetime import datetime
from typing import Dict, Any, List, Optional
from dataclasses import dataclass

@dataclass
class BlockchainRecord:
    """Represents a blockchain record for data verification"""
    content_hash: str
    timestamp: int
    block_number: Optional[int] = None
    transaction_hash: Optional[str] = None
    verification_status: str = 'pending'

class BlockchainService:
    """Service for blockchain-based data verification and integrity"""
    
    def __init__(self):
        self.chain = []  # Simplified blockchain for demo
        self.pending_transactions = []
        self.difficulty = 4  # Mining difficulty
        self.mining_reward = 1
        
    def create_genesis_block(self):
        """Create the first block in the chain"""
        genesis_block = {
            'index': 0,
            'timestamp': int(time.time()),
            'transactions': [],
            'previous_hash': '0',
            'nonce': 0,
            'hash': self.calculate_hash(0, int(time.time()), [], '0', 0)
        }
        self.chain.append(genesis_block)
        return genesis_block
    
    def calculate_hash(self, index: int, timestamp: int, transactions: List, 
                      previous_hash: str, nonce: int) -> str:
        """Calculate SHA-256 hash for a block"""
        block_string = f"{index}{timestamp}{json.dumps(transactions, sort_keys=True)}{previous_hash}{nonce}"
        return hashlib.sha256(block_string.encode()).hexdigest()
    
    def get_latest_block(self) -> Dict[str, Any]:
        """Get the latest block in the chain"""
        if not self.chain:
            return self.create_genesis_block()
        return self.chain[-1]
    
    def create_transaction(self, content_hash: str, data_type: str, 
                          admin_email: str, metadata: Dict = None) -> Dict[str, Any]:
        """Create a new transaction for data verification"""
        transaction = {
            'id': hashlib.sha256(f"{content_hash}{time.time()}".encode()).hexdigest()[:16],
            'content_hash': content_hash,
            'data_type': data_type,
            'admin_email': admin_email,
            'metadata': metadata or {},
            'timestamp': int(time.time()),
            'verification_status': 'pending'
        }
        
        self.pending_transactions.append(transaction)
        return transaction
    
    def mine_pending_transactions(self, mining_reward_address: str = 'system') -> Dict[str, Any]:
        """Mine pending transactions into a new block"""
        if not self.pending_transactions:
            return None
        
        # Add mining reward transaction
        reward_transaction = {
            'id': 'mining_reward',
            'content_hash': 'reward',
            'data_type': 'reward',
            'admin_email': mining_reward_address,
            'metadata': {'reward': self.mining_reward},
            'timestamp': int(time.time()),
            'verification_status': 'confirmed'
        }
        
        transactions = self.pending_transactions + [reward_transaction]
        
        # Create new block
        latest_block = self.get_latest_block()
        new_block = {
            'index': latest_block['index'] + 1,
            'timestamp': int(time.time()),
            'transactions': transactions,
            'previous_hash': latest_block['hash'],
            'nonce': 0,
            'hash': ''
        }
        
        # Mine the block (proof of work)
        new_block['hash'] = self.mine_block(new_block)
        
        # Add to chain
        self.chain.append(new_block)
        
        # Clear pending transactions
        self.pending_transactions = []
        
        return new_block
    
    def mine_block(self, block: Dict[str, Any]) -> str:
        """Mine a block using proof of work"""
        target = "0" * self.difficulty
        
        while True:
            hash_value = self.calculate_hash(
                block['index'],
                block['timestamp'],
                block['transactions'],
                block['previous_hash'],
                block['nonce']
            )
            
            if hash_value[:self.difficulty] == target:
                return hash_value
            
            block['nonce'] += 1
    
    def verify_content_hash(self, content_hash: str) -> Dict[str, Any]:
        """Verify if a content hash exists in the blockchain"""
        for block in self.chain:
            for transaction in block['transactions']:
                if transaction.get('content_hash') == content_hash:
                    return {
                        'verified': True,
                        'block_index': block['index'],
                        'block_hash': block['hash'],
                        'transaction': transaction,
                        'timestamp': transaction['timestamp']
                    }
        
        return {'verified': False, 'message': 'Content hash not found in blockchain'}
    
    def get_verification_proof(self, content_hash: str) -> Dict[str, Any]:
        """Get cryptographic proof of content verification"""
        verification = self.verify_content_hash(content_hash)
        
        if verification['verified']:
            # Create merkle proof (simplified)
            block = self.chain[verification['block_index']]
            proof_data = {
                'content_hash': content_hash,
                'block_index': verification['block_index'],
                'block_hash': verification['block_hash'],
                'previous_hash': block['previous_hash'],
                'timestamp': verification['timestamp'],
                'chain_length': len(self.chain)
            }
            
            # Generate proof hash
            proof_string = json.dumps(proof_data, sort_keys=True)
            proof_hash = hashlib.sha256(proof_string.encode()).hexdigest()
            
            return {
                'verified': True,
                'proof_hash': proof_hash,
                'proof_data': proof_data,
                'verification_path': self.get_merkle_path(content_hash, verification['block_index'])
            }
        
        return verification
    
    def get_merkle_path(self, content_hash: str, block_index: int) -> List[str]:
        """Get merkle tree path for verification (simplified implementation)"""
        if block_index >= len(self.chain):
            return []
        
        block = self.chain[block_index]
        transaction_hashes = [
            hashlib.sha256(json.dumps(tx, sort_keys=True).encode()).hexdigest()
            for tx in block['transactions']
        ]
        
        # Find the transaction hash
        target_hash = None
        for i, tx in enumerate(block['transactions']):
            if tx.get('content_hash') == content_hash:
                target_hash = transaction_hashes[i]
                break
        
        if not target_hash:
            return []
        
        # Build merkle path (simplified - just return all hashes)
        return transaction_hashes
    
    def validate_chain(self) -> Dict[str, Any]:
        """Validate the entire blockchain"""
        if not self.chain:
            return {'valid': False, 'error': 'Empty chain'}
        
        for i in range(1, len(self.chain)):
            current_block = self.chain[i]
            previous_block = self.chain[i - 1]
            
            # Check if current block's hash is valid
            calculated_hash = self.calculate_hash(
                current_block['index'],
                current_block['timestamp'],
                current_block['transactions'],
                current_block['previous_hash'],
                current_block['nonce']
            )
            
            if current_block['hash'] != calculated_hash:
                return {
                    'valid': False,
                    'error': f'Invalid hash at block {i}',
                    'block_index': i
                }
            
            # Check if previous hash matches
            if current_block['previous_hash'] != previous_block['hash']:
                return {
                    'valid': False,
                    'error': f'Invalid previous hash at block {i}',
                    'block_index': i
                }
        
        return {'valid': True, 'message': 'Blockchain is valid'}
    
    def get_chain_stats(self) -> Dict[str, Any]:
        """Get blockchain statistics"""
        total_blocks = len(self.chain)
        total_transactions = sum(len(block['transactions']) for block in self.chain)
        
        # Count verified content hashes
        verified_hashes = set()
        for block in self.chain:
            for tx in block['transactions']:
                if tx.get('content_hash') and tx.get('content_hash') != 'reward':
                    verified_hashes.add(tx['content_hash'])
        
        return {
            'total_blocks': total_blocks,
            'total_transactions': total_transactions,
            'verified_content_hashes': len(verified_hashes),
            'pending_transactions': len(self.pending_transactions),
            'chain_valid': self.validate_chain()['valid'],
            'latest_block_hash': self.get_latest_block()['hash'] if self.chain else None
        }
    
    def export_verification_certificate(self, content_hash: str) -> Dict[str, Any]:
        """Export a verification certificate for a content hash"""
        verification = self.get_verification_proof(content_hash)
        
        if verification['verified']:
            certificate = {
                'certificate_id': hashlib.sha256(f"cert_{content_hash}_{time.time()}".encode()).hexdigest(),
                'content_hash': content_hash,
                'verification_proof': verification,
                'issued_at': datetime.utcnow().isoformat(),
                'issuer': 'SECOINFI Infy AI Blockchain Verification System',
                'certificate_version': '1.0'
            }
            
            # Sign the certificate
            cert_string = json.dumps(certificate, sort_keys=True)
            certificate['signature'] = hashlib.sha256(cert_string.encode()).hexdigest()
            
            return certificate
        
        return {'error': 'Content not verified on blockchain'}

class HashingService:
    """Service for content hashing and integrity verification"""
    
    @staticmethod
    def generate_content_hash(content: str, algorithm: str = 'sha256') -> str:
        """Generate hash for content"""
        if algorithm == 'sha256':
            return hashlib.sha256(content.encode('utf-8')).hexdigest()
        elif algorithm == 'md5':
            return hashlib.md5(content.encode('utf-8')).hexdigest()
        elif algorithm == 'sha1':
            return hashlib.sha1(content.encode('utf-8')).hexdigest()
        else:
            raise ValueError(f"Unsupported algorithm: {algorithm}")
    
    @staticmethod
    def generate_merkle_root(hashes: List[str]) -> str:
        """Generate merkle root from list of hashes"""
        if not hashes:
            return ''
        
        if len(hashes) == 1:
            return hashes[0]
        
        # Ensure even number of hashes
        if len(hashes) % 2 != 0:
            hashes.append(hashes[-1])
        
        next_level = []
        for i in range(0, len(hashes), 2):
            combined = hashes[i] + hashes[i + 1]
            next_level.append(hashlib.sha256(combined.encode()).hexdigest())
        
        return HashingService.generate_merkle_root(next_level)
    
    @staticmethod
    def verify_content_integrity(original_content: str, provided_hash: str, 
                                algorithm: str = 'sha256') -> bool:
        """Verify content integrity using hash"""
        calculated_hash = HashingService.generate_content_hash(original_content, algorithm)
        return calculated_hash == provided_hash
    
    @staticmethod
    def generate_batch_hash(content_list: List[str]) -> Dict[str, Any]:
        """Generate batch hash for multiple content items"""
        individual_hashes = [
            HashingService.generate_content_hash(content) 
            for content in content_list
        ]
        
        merkle_root = HashingService.generate_merkle_root(individual_hashes)
        
        return {
            'individual_hashes': individual_hashes,
            'merkle_root': merkle_root,
            'batch_size': len(content_list),
            'timestamp': int(time.time())
        }

