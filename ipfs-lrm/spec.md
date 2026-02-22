# IPFS Content Viewer Application

## Overview
A web application that integrates IPFS functionality through a Motoko backend, providing content fetching, health monitoring, and file management capabilities. The application displays static content from IPFS links with specialized sections for Python files and referral transactions.

## Core Features

### Home Page
- Simple landing page with navigation to content sections
- Clear interface for accessing IPFS content viewer functionality
- Publicly accessible without authentication

### IPFS Content Management
- Backend integration of IPFS functionality translated from Node.js to Motoko
- Fetch static content from IPFS links through backend methods
- IPFS health monitoring and status checking via backend
- Content routing and management handled by Motoko backend
- Display general content from IPFS directories
- Handle loading states and error cases for IPFS requests
- Publicly accessible without authentication

### Python Files Display Section
- Identify and extract Python (.py) files from the IPFS content
- Display Python file contents as plain text in a dedicated section
- Show file names and their corresponding content clearly
- Publicly accessible without authentication

### Referral Transactions Section
- Display "1 M SEToken Txn" referral transactions found in the IPFS content
- Present transaction data in a readable format
- Organize transaction information in a structured layout
- Publicly accessible without authentication

### Specification File Management
- Check for existing spec.ml or .yaml files in the project
- If neither spec.ml nor .yaml files are present, convert the existing spec.md file to spec.ml format
- Ensure idempotent operation: do not overwrite or duplicate existing spec.ml or .yaml files
- Display status of specification file format conversion process
- Show current specification file format and conversion options
- Parse spec.md contents to detect and remove redundant or duplicate lines or sections based on text matching
- Replace spec.md with a cleaned version that preserves unique entries and formatting integrity
- Notify user when duplicates have been removed successfully through the SpecFileManager component
- Publicly accessible without authentication

### Project File Management
- Store and manage project files in the root directory
- Save JavaScript files (ipfs-lrm.node-1.js, ipfs-lrm.node.js, server.js) to project root
- Overwrite existing files with the same names when new versions are provided
- Maintain file versions and ensure accessibility for backend integration
- Provide file storage and retrieval functionality for Node.js files that may be translated to Motoko
- Publicly accessible without authentication

### Sitemap Management
- Extend the existing sitemap functionality with a manual pages management system
- Maintain existing auto-generated sitemap logic without modification
- Add manual page management through admin interface
- Merge auto-generated and manual pages for display
- Preserve existing routing for broadcast, remote, and live pages through Secoinfi-Apps list
- Sitemap viewing is publicly accessible without authentication
- Manual page management requires admin authentication

### Admin Interface
- Admin page for managing manual sitemap pages
- Form interface for adding new page slugs with validation
- Display current list of manual pages
- Access restricted to authenticated admin users only
- Requires Internet Identity login and admin role verification

### Authentication and Access Control
- Internet Identity integration for user authentication
- Role-based access control with admin role verification
- Admin and subscription-related pages (under `/admin`, `/payments`, `/subscription`) require user login
- All other routes are publicly accessible without authentication
- Frontend routing logic checks authentication requirements based on route patterns
- AdminPage component includes access restriction guards for authenticated and admin roles

## Backend Requirements
- Integrate IPFS functionality from the provided Node.js file into Motoko
- Translate core IPFS operations, health checks, and content routing to Motoko
- Expose IPFS-related methods that were previously handled by the Node.js/Express server
- Store specification file metadata and conversion status
- Handle file format detection and conversion logic
- Persist information about existing specification files in the project
- Implement utility to parse spec.md contents and detect duplicate lines or sections using text matching algorithms
- Remove redundant content while preserving unique entries and maintaining formatting integrity
- Replace original spec.md with cleaned version after duplicate removal
- Provide status updates on duplicate detection and removal operations
- Store and manage JavaScript files (ipfs-lrm.node-1.js, ipfs-lrm.node.js, server.js) in project root directory
- Provide file overwrite functionality for updating existing files with new versions
- Maintain file metadata and ensure files are accessible for future backend integration or Motoko translation
- Provide endpoints for IPFS content fetching, health monitoring, and file management
- Enable frontend to call Motoko backend methods for all IPFS operations
- Store manual sitemap pages in a stable variable initialized with predefined priority pages
- Implement getPages method to retrieve current manual pages list
- Implement addPage method with validation for lowercase, unique, no-spaces page slugs
- Enforce admin-only access control for page management operations
- Restrict modification of broadcast, remote, and live routes to admin approval with Secoinfi-Apps integration
- Maintain existing sitemap auto-generation functionality unchanged
- Implement user authentication and role verification methods
- Provide admin role checking functionality for access control
- Handle Internet Identity integration for user login

## Technical Requirements
- IPFS operations performed through Motoko backend methods instead of direct frontend HTTP calls
- Frontend calls Motoko backend for all IPFS-related functionality
- Backend handles all IPFS content processing and management
- File storage and management handled by backend with overwrite capabilities
- Duplicate detection and removal operations handled by backend with status reporting to frontend
- Internet Identity authentication integration
- Role-based access control with admin verification
- Route-based authentication requirements (admin and subscription routes require login)
- Public access for all other routes including sitemap viewing and IPFS content
- Input validation for page slugs (lowercase, unique, no spaces)
- Non-breaking extension to existing sitemap model
- Responsive design for different screen sizes
- English language interface
