"""
Data Processing Service for Infy AI Training
Handles .md, .json, .csv, and other file types
"""
import os
import json
import csv
import hashlib
import re
from datetime import datetime
from typing import List, Dict, Any, Tuple
from io import StringIO

class DataProcessor:
    """Process various file types for Infy AI training"""
    
    def __init__(self):
        self.supported_formats = ['.md', '.json', '.csv', '.txt']
        self.legal_keywords = [
            'agreement', 'contract', 'deed', 'legal', 'terms', 'conditions',
            'liability', 'warranty', 'indemnity', 'arbitration', 'jurisdiction',
            'signature', 'witness', 'notary', 'ethereum', 'blockchain'
        ]
    
    def process_markdown_file(self, content: str, filename: str) -> List[Dict[str, Any]]:
        """Process markdown file and extract topics"""
        topics = []
        
        # Split content by headers
        sections = re.split(r'^#+\s+(.+)$', content, flags=re.MULTILINE)
        
        current_topic = None
        current_content = ""
        
        for i, section in enumerate(sections):
            if i % 2 == 1:  # Header
                if current_topic:
                    # Save previous topic
                    topics.append(self._create_topic_entry(
                        current_topic, current_content, filename, 'md'
                    ))
                current_topic = section.strip()
                current_content = ""
            elif i % 2 == 0 and section.strip():  # Content
                current_content += section.strip() + "\n"
        
        # Add last topic
        if current_topic and current_content:
            topics.append(self._create_topic_entry(
                current_topic, current_content, filename, 'md'
            ))
        
        # If no headers found, treat entire content as one topic
        if not topics and content.strip():
            topic_name = self._extract_title_from_filename(filename)
            topics.append(self._create_topic_entry(
                topic_name, content, filename, 'md'
            ))
        
        return topics
    
    def process_json_file(self, content: str, filename: str) -> List[Dict[str, Any]]:
        """Process JSON file and extract topics"""
        topics = []
        
        try:
            data = json.loads(content)
            
            if isinstance(data, list):
                # Array of objects
                for i, item in enumerate(data):
                    if isinstance(item, dict):
                        topic_name = item.get('topic', item.get('title', f"Item {i+1}"))
                        topic_content = item.get('content', item.get('description', str(item)))
                        topics.append(self._create_topic_entry(
                            topic_name, topic_content, filename, 'json'
                        ))
            elif isinstance(data, dict):
                # Single object or key-value pairs
                for key, value in data.items():
                    if isinstance(value, (str, dict, list)):
                        content_str = json.dumps(value, indent=2) if not isinstance(value, str) else value
                        topics.append(self._create_topic_entry(
                            key, content_str, filename, 'json'
                        ))
        except json.JSONDecodeError as e:
            # If JSON is invalid, treat as plain text
            topic_name = self._extract_title_from_filename(filename)
            topics.append(self._create_topic_entry(
                topic_name, content, filename, 'json'
            ))
        
        return topics
    
    def process_csv_file(self, content: str, filename: str) -> List[Dict[str, Any]]:
        """Process CSV file and extract topics"""
        topics = []
        
        try:
            csv_reader = csv.DictReader(StringIO(content))
            
            for i, row in enumerate(csv_reader):
                # Try to find topic and content columns
                topic_col = None
                content_col = None
                
                for col in row.keys():
                    col_lower = col.lower()
                    if 'topic' in col_lower or 'title' in col_lower or 'name' in col_lower:
                        topic_col = col
                    elif 'content' in col_lower or 'description' in col_lower or 'text' in col_lower:
                        content_col = col
                
                if topic_col and content_col:
                    topic_name = row[topic_col]
                    topic_content = row[content_col]
                elif topic_col:
                    topic_name = row[topic_col]
                    # Use all other columns as content
                    other_data = {k: v for k, v in row.items() if k != topic_col}
                    topic_content = json.dumps(other_data, indent=2)
                else:
                    # Use first column as topic, rest as content
                    cols = list(row.keys())
                    topic_name = row[cols[0]] if cols else f"Row {i+1}"
                    other_data = {k: v for k, v in row.items() if k != cols[0]}
                    topic_content = json.dumps(other_data, indent=2)
                
                topics.append(self._create_topic_entry(
                    topic_name, topic_content, filename, 'csv'
                ))
        
        except Exception as e:
            # If CSV parsing fails, treat as plain text
            topic_name = self._extract_title_from_filename(filename)
            topics.append(self._create_topic_entry(
                topic_name, content, filename, 'csv'
            ))
        
        return topics
    
    def process_text_file(self, content: str, filename: str) -> List[Dict[str, Any]]:
        """Process plain text file"""
        topic_name = self._extract_title_from_filename(filename)
        return [self._create_topic_entry(topic_name, content, filename, 'txt')]
    
    def _create_topic_entry(self, topic: str, content: str, filename: str, file_type: str) -> Dict[str, Any]:
        """Create a standardized topic entry"""
        # Extract hashtags from content
        hashtags = self._extract_hashtags(content)
        
        # Determine if it's a legal document
        is_legal = self._is_legal_document(topic, content, filename)
        
        # Extract legal text if applicable
        legal_text = content if is_legal else None
        
        # Determine category
        category = self._determine_category(topic, content, filename)
        
        return {
            'topic': topic.strip(),
            'content': content.strip(),
            'file_type': file_type,
            'source_file': filename,
            'category': category,
            'hashtags': hashtags,
            'legal_text': legal_text,
            'is_legal_document': is_legal
        }
    
    def _extract_hashtags(self, content: str) -> List[str]:
        """Extract hashtags from content"""
        # Find hashtags in format #tag
        hashtags = re.findall(r'#(\w+)', content)
        
        # Add automatic hashtags based on content
        content_lower = content.lower()
        auto_tags = []
        
        if any(word in content_lower for word in ['contract', 'agreement', 'legal']):
            auto_tags.append('legal')
        if any(word in content_lower for word in ['blockchain', 'ethereum', 'crypto']):
            auto_tags.append('blockchain')
        if any(word in content_lower for word in ['secoinfi', 'company', 'business']):
            auto_tags.append('secoinfi')
        if any(word in content_lower for word in ['domain', 'website', 'seo']):
            auto_tags.append('domain')
        
        return list(set(hashtags + auto_tags))
    
    def _is_legal_document(self, topic: str, content: str, filename: str) -> bool:
        """Determine if this is a legal document"""
        text_to_check = f"{topic} {content} {filename}".lower()
        return any(keyword in text_to_check for keyword in self.legal_keywords)
    
    def _determine_category(self, topic: str, content: str, filename: str) -> str:
        """Determine the category of the content"""
        text_to_check = f"{topic} {content} {filename}".lower()
        
        if any(word in text_to_check for word in ['contract', 'agreement', 'deed', 'legal']):
            return 'legal'
        elif any(word in text_to_check for word in ['blockchain', 'ethereum', 'crypto']):
            return 'blockchain'
        elif any(word in text_to_check for word in ['domain', 'seo', 'website']):
            return 'domain'
        elif any(word in text_to_check for word in ['secoinfi', 'company', 'business']):
            return 'company'
        else:
            return 'general'
    
    def _extract_title_from_filename(self, filename: str) -> str:
        """Extract a readable title from filename"""
        # Remove extension and path
        name = os.path.splitext(os.path.basename(filename))[0]
        
        # Replace underscores and hyphens with spaces
        name = re.sub(r'[_-]', ' ', name)
        
        # Capitalize words
        return ' '.join(word.capitalize() for word in name.split())
    
    def generate_content_hash(self, content: str) -> str:
        """Generate SHA-256 hash for content verification"""
        return hashlib.sha256(content.encode('utf-8')).hexdigest()
    
    def process_file_content(self, content: str, filename: str) -> List[Dict[str, Any]]:
        """Main method to process file content based on extension"""
        file_ext = os.path.splitext(filename)[1].lower()
        
        if file_ext == '.md':
            return self.process_markdown_file(content, filename)
        elif file_ext == '.json':
            return self.process_json_file(content, filename)
        elif file_ext == '.csv':
            return self.process_csv_file(content, filename)
        elif file_ext in ['.txt', '.text']:
            return self.process_text_file(content, filename)
        else:
            # Default to text processing
            return self.process_text_file(content, filename)
    
    def batch_process_directory(self, directory_path: str) -> List[Dict[str, Any]]:
        """Process all supported files in a directory"""
        all_topics = []
        
        for root, dirs, files in os.walk(directory_path):
            for file in files:
                file_path = os.path.join(root, file)
                file_ext = os.path.splitext(file)[1].lower()
                
                if file_ext in self.supported_formats:
                    try:
                        with open(file_path, 'r', encoding='utf-8') as f:
                            content = f.read()
                        
                        topics = self.process_file_content(content, file)
                        all_topics.extend(topics)
                    except Exception as e:
                        print(f"Error processing {file_path}: {e}")
        
        return all_topics

