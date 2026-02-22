# n8n Workflows E Store SaaS Platform

## Overview
A comprehensive SaaS platform for buying and selling n8n workflow templates with subscription-based access, file management, and administrative tools.

## Core Features

### Multi-Page Structure
- **Public Pages**: Home, Blog, About, Pros, What We Do, Why Us, Contact, FAQ, Terms, Trust, Sitemap, Features, Referral (all publicly accessible without login)
- **Protected Pages**: Dashboard (subscriber access), Subscribers (subscriber access), Admin panel (admin access only)
- **Catalog**: Subscribers page with workflow browsing and purchasing (requires subscription)

### Access Control System
- **Public Access**: All pages except Admin, Dashboard, and Subscribers are publicly accessible without authentication
- **Subscriber Access**: Dashboard and Subscribers pages require authenticated users with subscriber or admin roles
- **Admin Access**: Admin panel requires authenticated users with admin role only
- **Authentication Guards**: Frontend routing protects only Admin, Dashboard, and Subscribers routes
- **Public Navigation**: Sitemap and navigation display all public pages to both guests and authenticated users
- **Security Boundaries**: Visual consistency maintained while preserving security for protected routes

### Enhanced Sitemap System
- **Dynamic Pages Array**: Admin-controlled `pages[]` array containing unique and priority routes
- **Admin-Only Access Control**: Only administrators can append new entries to the `pages[]` array
- **Admin UI Forms**: Text input for new page slugs with slug validation (unique, lowercase) and "+ Add Page" button available at `/sitemap` and `/admin` pages
- **Route Priority System**: Runtime sitemap resolution prioritizes existing auto sitemap, followed by `pages[]` entries, then app-controlled routes
- **Collision Detection**: Automatic checks to prevent route conflicts during sitemap resolution
- **Controlled Route Delegation**: `/broadcast`, `/remote`, and `/live` routes bindable only by whitelisted apps from `Secoinfi-Apps[]` array, modifiable solely by admin approval
- **Audit Logging**: All admin page additions logged to system logs and displayed in admin dashboard
- **Enhanced Transparency**: Optional admin signature, timestamps, and Merkle root hash for each manual addition in manifest logs
- **Public Sitemap Display**: All public pages visible in sitemap to both authenticated and unauthenticated users
- **Admin Sitemap Management**: Only admins can view and modify sitemap management interface and controlled routes

### Contact Page Details
The Contact page displays comprehensive SECOINFI company information:
- **Leadership**: CEO & Founder DILEEP KUMAR D details
- **Contact Information**: Primary email (dild26@gmail.com), business phone (+91-962-005-8644), WhatsApp (+91-962-005-8644)
- **Company Details**: Official website (www.seco.in.net), business address with clickable Google Maps integration
- **Payment Methods**: PayPal (newgoldenjewel@gmail.com), UPI ID (secoin@uboi), ETH ID (0x4a100E184ac1f17491Fbbcf549CeBfB676694eF7)
- **Interactive Elements**: Prominent "Email Us" and "WhatsApp" action buttons, clickable map for directions
- **Social Media Integration**: Links to Facebook, LinkedIn, Telegram, Discord, Blog, Instagram, Twitter/X, YouTube
- **Call-to-Action**: Investment opportunity messaging with contact encouragement

### User Authentication & Access Control
- User registration and login system
- Role-based access (public, subscriber, admin)
- Subscription status tracking
- Temporary access control override for testing purposes
- Access restrictions only for Admin, Dashboard, and Subscribers pages
- Public access for all other pages without authentication requirements

### Enhanced Workflow Catalog System
- Multi-file upload support for .json, .md, .ml, and .yaml files (up to 3000+ files)
- Robust JSON parser with malformed file handling
- Auto-save functionality during uploads
- SHA-256 file deduplication to prevent duplicates
- Error-tolerant batch processing that continues despite individual file failures
- Clear error messaging for problematic files
- Public and private workflow previews
- Advanced search and filtering capabilities
- Pagination and lazy-loading for large datasets

### Payment Integration
- Stripe subscription payments
- PAYU payment gateway integration
- Dynamic pricing system
- Subscription management and renewal tracking

### Referral System
- Referral link generation and tracking (publicly accessible)
- UID-based referral identification
- Referral reward calculation and distribution

### Enhanced Administrative Tools
- User management (view, edit, suspend users)
- Upload and download monitoring
- System backup and restore functionality
- Analytics dashboard with user metrics
- Feature toggle management
- Activity logging with visual change tracking
- Error logging and monitoring
- **Feature Validation Dashboard**: Admin interface to review new features, error logs, and validation status
- **Fixture System**: Admin-configurable system to validate and promote features to leaderboard
- **Parsing Error Management**: Comprehensive error logging with learning system for error analysis
- **Access Control Override**: Temporary lifting of user restrictions for testing purposes
- **System Logs Section**: Displays compression results, dependency updates, bundle size reduction reports, specification deduplication statistics, and sitemap page additions
- **Sitemap Management Interface**: Admin controls for managing `pages[]` array and `Secoinfi-Apps[]` whitelist

### Enhanced Specification Management System
- **Automated Spec Detection**: System checks for presence of spec.ml or .yaml files before processing
- **Manifest Log System**: Comprehensive logging system that records validation status, errors, and schema compliance for each uploaded spec file (.md, .ml, .yaml)
- **Advanced Specification Deduplication**: Intelligent background process that identifies and removes redundant or outdated spec.md, spec.yaml, and spec.ml files to maintain a single source of truth
- **Schema Revision Comparison**: Backend automatically compares schema revisions and discards duplicate or conflicting data during validation and ingestion
- **Background Validation Process**: Automated normalization and merging of all specification data into clean, schema-controlled YAML format derived from spec.md, .ml, or .yaml files
- **Pre-Upload Deduplication Check**: Background validation job that runs during uploads to check for redundant or outdated spec files before allowing ingestion
- **Conversion Pipeline**: Automated detection of spec.md files with intelligent conversion workflow:
  - Checks for existing spec.ml or .yaml versions
  - If not present, automatically converts Markdown to clean, normalized YAML format
  - Logs all conversion activities and results
  - Validates converted files against backend schema
- **Schema Validation Enforcement**: Mandatory validation for all uploaded and ingested spec files with detailed compliance reporting
- **Normalized Processing**: All AI processing and ingestion uses only validated, normalized YAML versions to eliminate Markdown parsing ambiguity
- **Step-by-Step AI Instructions**: Precise ingestion and validation instructions for AI modules ensuring only schema-compliant, manifest-logged files are processed
- **Architecture Preservation**: Ensures all modular, scalable, and robust architecture requirements are maintained during conversion
- **Admin Review Process**: Converted specifications require admin review and approval through Fixture system before feature promotion
- **Leaderboard Integration**: Approved specifications can be promoted to leaderboard after validation
- **Deduplication Audit Trail**: Store deduplication logs and normalization metadata in the manifest log system for full auditability

### Module Optimization System
- **Module-Level Compression**: Automated compression of node_modules folder to reduce bundle size while maintaining dependency integrity
- **Dependency Auto-Update**: Background process that updates dependencies to latest stable, lightweight versions for enhanced performance
- **Build-Time Deduplication**: Automatic removal of redundant or duplicate module sub-dependencies during build process
- **Post-Compression Validation**: Integrity checking after compression with success/failure reporting
- **Size Reduction Reporting**: Detailed logs of bundle size reduction displayed in admin dashboard System Logs section

### Error Handling & Learning System
- Comprehensive parsing error logging with detailed error information
- Learning system that analyzes recurring errors and suggests fixes
- Automatic error pattern recognition and prevention
- Error fix suggestions and application system
- Batch processing continuation despite individual file failures
- **Manifest Error Tracking**: All validation errors and schema mismatches are logged in the manifest system

### Feature Leaderboard System
- Admin-controlled feature promotion system
- Validation status tracking for new features
- Leaderboard ranking based on robustness, decentralization, and modularity
- Manual promotion controls for validated features
- **Schema Compliance Requirements**: Only manifest-logged, schema-compliant files eligible for leaderboard promotion

### UI/UX Features
- VIBGYOR theme toggle with 7 color schemes
- Mobile-first responsive design
- Persistent user theme preferences
- Lock icons for premium/restricted content
- Custom navigation for large datasets
- Error status indicators and clear error messaging
- Admin dashboard for feature validation and error review
- **Public Navigation**: All public pages accessible in navigation for both guests and authenticated users
- **Protected Route Indicators**: Visual indicators for protected pages (Admin, Dashboard, Subscribers)
- **Manifest Log Viewer**: Interface for viewing validation status and schema compliance reports
- **Conversion Status Display**: Visual indicators showing conversion pipeline status and results
- **Compression Status Display**: Visual indicators showing module compression progress and results
- **SpecificationManagement Component**: Admin interface displaying deduplication progress, results, and validation confirmation
- **SpecDeduplication Component**: Visual display of deduplication actions with date, affected files, and results
- **Enhanced SystemLogs Component**: Displays compression and deduplication statistics for both specification and dependency modules with schema validation confirmation, YAML normalization summary, and sitemap page addition logs
- **Sitemap Management UI**: Admin forms for adding new pages to `pages[]` array with slug validation and uniqueness checks
- **Route Delegation Interface**: Admin controls for managing `Secoinfi-Apps[]` whitelist and route bindings

### Trust & Verification
- Trust verification simulation system (publicly accessible)
- Company information display (SECOINFI details)
- Social media integration and links

### Express Server Integration
- Express.js server setup with n8n-tasks-c2i.node.js module integration
- Server runs on port 443 with proper module mounting at root route
- Server startup logging and status monitoring

## Backend Data Storage
- User accounts and authentication data
- Subscription status and payment history
- Workflow files and metadata
- Upload/download logs and analytics
- Referral tracking data
- System configuration and feature flags
- Activity logs and error reports
- Backup and restore data
- **Public page access control settings and route configurations**
- **Protected route definitions and role-based access mappings**
- **Sitemap pages array with admin-controlled entries and metadata**
- **Secoinfi-Apps whitelist array for route delegation control**
- **Sitemap audit logs with admin signatures, timestamps, and Merkle root hashes**
- **Route collision detection and resolution logs**
- **Manifest logs with validation status, errors, and schema compliance data for each spec file**
- **Conversion pipeline logs and normalized file versions**
- **Schema validation results and compliance reports**
- **AI processing instruction logs and execution status**
- **Specification deduplication logs and single source of truth maintenance records**
- **Deduplication audit trail with normalization metadata**
- **Schema revision comparison results and conflict resolution logs**
- **Module compression logs and dependency update tracking**
- **Bundle size reduction metrics and integrity validation results**
- Parsing error logs with detailed error information
- Feature validation status and leaderboard rankings
- Error pattern analysis and fix suggestions
- Access control override settings and logs
- Specification file metadata and conversion history
- Spec.ml validation results and schema alignment data
- Conversion process logs and admin approval status
- Express server configuration and n8n module integration settings

## Backend Operations
- Enhanced file upload processing with robust error handling
- JSON parsing with malformed file detection and recovery
- Payment processing and subscription management
- User authentication and authorization
- Analytics data aggregation
- Backup and restore operations
- Search indexing and filtering
- Referral tracking and reward calculation
- **Public route access validation and role-based authorization for protected routes only**
- **Route access control logic for Admin, Dashboard, and Subscribers pages**
- **Public page serving without authentication requirements**
- **Sitemap pages array management with admin access control verification**
- **Route priority resolution and collision detection processing**
- **Secoinfi-Apps whitelist management and route delegation control**
- **Admin page addition logging with optional signature and hash generation**
- **Runtime sitemap generation with priority ordering**
- **Manifest log system management and validation status tracking**
- **Automated conversion pipeline execution with schema validation**
- **Normalized file processing and AI instruction enforcement**
- **Schema compliance checking and error reporting**
- **Step-by-Step AI module instruction processing**
- **Advanced specification deduplication and normalization processing**
- **Schema revision comparison and duplicate data discarding during validation and ingestion**
- **Pre-upload background validation job for redundant spec file detection**
- **Automated module compression and dependency management**
- **Build-time deduplication and integrity validation**
- **System logs generation for compression and optimization results**
- Comprehensive error logging and pattern analysis
- Feature validation and leaderboard management
- Access control override management
- Error learning system with fix suggestion and application
- Batch processing with error tolerance and continuation
- Specification file detection and format checking
- Automated spec.md to spec.ml conversion processing
- Schema validation and consistency checking for converted specifications
- Conversion process logging and admin notification system
- Express server initialization and n8n-tasks-c2i module mounting
- Server startup on port 443 with logging functionality

## Simulated ML Features
- Workflow parsing and categorization using deterministic logic
- Content-based recommendations based on user activity
- Automated error detection and handling
- Analytics pattern recognition using rule-based systems
- Error pattern learning and fix suggestion system
- Feature validation scoring based on robustness and modularity
- **Schema-compliant AI processing using only validated, normalized YAML versions**
- **Manifest-based feature extraction and workflow updates**

## Project Structure
- Root directory contains n8n-tasks-c2i.node.js file for n8n task integration
- Root directory contains server.js file with Express server configuration
- Server.js imports Express framework and n8n-tasks-c2i module
- Application content and interface language: English
