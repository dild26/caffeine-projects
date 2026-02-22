# Multi Subdomain Authentication System

## Overview
A centralized authentication system that handles OAuth callbacks for multiple SECOINFI caffeine.xyz subdomains, with secure token exchange and cookie management. Features a comprehensive navigation system with reliable global theme switching, detailed contact information, a feature management system with admin validation, a secure test input interface with comprehensive validation feedback, ready-to-use integration documentation for connecting SECOINFI apps to the Key-Unlock Auth system, a dual directory structure monitoring system with admin alerts, enhanced multi-file upload capabilities with auto-tracking validation, real-time authentication optimization monitoring, optimized build pipeline with compression and dependency management, and an additive sitemap extension system with admin-controlled manual page management.

## Core Features

### Public Access Control System
- Public pages accessible without authentication: `/home`, `/about`, `/contact`, `/blog`, `/pros`, `/faq`, `/sitemap`, `/terms`, `/what-we-do`, `/why-us`, `/test-input`, and all other non-restricted pages
- Restricted pages requiring authentication or admin privileges: `/admin`, `/features`, `/dashboard`, `/subscription`, `/referral`, `/proof-of-trust`
- Frontend routing system that loads public pages regardless of login state
- Backend route guards that enforce role checks and redirect to login prompt only for restricted pages
- Navigation menu, sitemap, and theme toggle remain visible and functional on all public pages
- Authentication flow only triggered when accessing restricted pages

### Authentication Flow
- Each subdomain has its own callback route that handles OAuth authorization codes
- Authorization codes are exchanged for tokens at a central auth server
- PKCE (Proof Key for Code Exchange) verifiers are stored and validated per session
- Secure cookies are set with HttpOnly, SameSite=strict attributes, scoped to individual subdomains
- Authentication checks only performed for restricted admin and subscription-related pages

### Integration Documentation System
- Complete integration instructions and code snippets for connecting each SECOINFI app (MOAP, Business Management, IPFS, etc.) to the Key-Unlock Auth system
- Ready-to-use callback route templates for each app that exchange authorization codes for session tokens with the central Key-Unlock Auth server
- Secure cookie implementation templates with HttpOnly, SameSite=strict configuration scoped to each app's subdomain
- Dashboard redirect functionality after successful authentication
- Environment template variables for each app: AUTH_BASE, CLIENT_ID, CALLBACK_URI, COOKIE_DOMAIN, SESSION_SECRET
- Step-by-step integration guide for developers covering login button implementation, central auth redirection, callback handling, and secure session management
- Production-ready code snippets tailored for all listed SECOINFI caffeine.xyz subdomains
- Developer documentation with complete implementation examples and best practices

### Enhanced Multi-File Upload System with Auto-Tracking
- Multi-file uploader in Dashboard supporting simultaneous uploads of `.js`, `.md`, `.yaml`, and `.zip` files
- Drag-and-drop interface with bulk file selection capabilities
- Real-time auto-tracking system that cross-checks each uploaded file against required filenames immediately upon upload success
- File upload table displaying file type, size in KB, upload status, hash edges (first and last characters), and validation checkmarks
- Live checkmarks (`✅`) displayed beside matched filenames in the Server Structure table when files are successfully validated
- Progress bar showing percentage completion based on matched file count versus total expected files, updating dynamically during uploads
- Automatic validation logic matching files by filename (case-insensitive) with immediate status updates
- Duplicate file detection flagging same filename uploads as "⚠ Duplicate" with most recent version validated
- Auto-comparison against backend's required dual directory structure from FileCheckStatus
- Visual highlighting of missing or mismatched files only
- Batch upload processing with progress tracking
- File validation and type checking before upload acceptance
- Tooltips showing "n of N files matched" with dynamic list of unmatched files at the bottom
- Corrected folder path mapping recognizing `.js` files at root `/routes/` instead of nested `/server/routes/`
- Automatic path reassignment for uploaded `.js` files from subfolders to expected `/routes/` destination internally
- Inline warnings for incorrect file extensions, unexpected folder placements, or failed uploads
- Retry buttons for transient upload failures with error recovery mechanisms

### Auth Optimization Panel
- Live authentication performance metrics display showing latency, success rate, and error rate
- On-demand client ping checks for all SECOINFI subdomain apps at `https://<subdomain>.caffeine.xyz`
- Live status verification for `.js` modules across all subdomain applications
- Round-trip ping testing to `/login-health` endpoints with active/inactive state logging
- Automatic route status polling for all defined route modules (`*.node.js`) including ia-niqaw-947, ipfs-lrm, networth-htm, geo-map-w9s, e-contract-lwf, secoin-ep6, n8n-tasks-c2i, n8n-workflows-6sy, e-contracts-bqe, infytask-mia, sitemaps-fwh, key-unlock-5hx, xcaller-0aw, forms-sxn, terror-uproot-97d
- Visual status indicators with green/red status display for each route module
- onChange event tracking for route modifications with automatic reverification
- Cached results with auto-refresh functionality for optimized performance

### Performance Optimization System
- Backend result caching for login/auth checks to reduce redundant network calls
- Frontend batched data fetching for Feature and File Verification tabs using React Query
- Optimized Dashboard onLoad rendering with reduced rerenders and batched backend queries
- Lazy loading implementation for non-critical tables including history and logs
- Cached ping results with configurable refresh intervals
- Performance metrics tracking and display
- Optimized data loading and refresh mechanisms

### Build Pipeline Optimization System
- Module-level compression and optimization integrated into the build pipeline to reduce node_modules folder size and overall file weight
- Dependency updater that fetches the latest stable module versions, removes duplicates and unused packages, ensuring compatibility and minimal package footprint
- Pre-deployment compression routine that minifies JavaScript files and compresses node_modules using gzip or brotli compression to speed up deployment and reduce storage
- Deduplication operations for spec.md and spec.yaml that unify redundant or mirrored content, especially manifest blocks, while preserving YAML correctness
- Compression and deduplication operations that preserve full functionality and metadata integrity for auditing and manifest consistency
- Automated package optimization that maintains compatibility while reducing deployment size
- Build artifact compression with integrity verification to ensure no functionality loss during optimization

### Dual Directory Structure Management System
- Automated file placement system that organizes all provided .node.js files into their correct dual directory structure
- SECOINFI dual structure implementation with server and client directories:
  - `/server/` directories created for each app (e.g., `/server/key-unlock/`, `/server/ipfs/`, `/server/ia-niqaw-947/`, etc.)
  - Main route modules placed under `/routes/` folder for each app (corrected from `/server/routes/`)
  - Primary config files using server-specific naming (e.g., `key-unlock-server.js` for server version)
  - Default entry files (`server.js`) maintained for apps that also act as clients
- Directory structure enforcement with proper folder creation and file placement:
  - server.js placed in root directory (/) as default entry
  - compliance.js placed in utils/ folder
  - App-specific server config files placed in respective `/server/` directories
  - All subdomain-based route files placed in `/routes/` folders with live SECOINFI subdomain names using .node.js suffix:
    - ia-niqaw-947.node.js (Business Management Platform)
    - ipfs-lrm.node.js (IPFS)
    - networth-htm.node.js (Your Networth)
    - geo-map-w9s.node.js (Geo-Map)
    - e-contract-lwf.node.js (e-Contract)
    - secoin-ep6.node.js (SECOIN Realty)
    - n8n-tasks-c2i.node.js (N8n Tasks)
    - n8n-workflows-6sy.node.js (N8N Workflows)
    - e-contracts-bqe.node.js (e-Contracts)
    - infytask-mia.node.js (Infytask)
    - sitemaps-fwh.node.js (SitemapAi)
    - key-unlock-5hx.node.js (KeyUnlock)
    - xcaller-0aw.node.js (DomainHub)
    - forms-sxn.node.js (Dynamic e-Forms)
    - terror-uproot-97d.node.js (Terror Uproot)
  - logs/ folder creation for manifest-audit.log
- File presence validation that verifies all required .node.js files are correctly placed in their designated dual directory structure using live subdomain names
- Admin alert system that notifies when files are missing from their expected locations or when directory structure is incomplete
- Real-time dual directory structure monitoring and validation reporting
- File placement verification with detailed status reporting for each .node.js file and folder in both server and client structures

### Additive Sitemap Extension System
- Non-breaking sitemap extension that introduces admin-controlled manual page management while preserving existing sitemap generation
- Manual pages array storing unique, prioritized manual pages initialized with predefined list: about, admin, apps, angel-vc, blog, block, broadcast, compare, contact, dash, dex, e-com, faq, finance, fix, fixture, footstep, lang, leader, live, main, map, milestone, pages, payments, pros, rank, referral, remote, resource, routes, secure, sitemap, terms, trust, what, verifySig, when, where, who, why, ZKProof
- Admin-only page addition functionality with validation for uniqueness, lowercase format, and space/duplicate prevention
- Admin-only removal capability for manual-only pages with system-reserved page protection
- Controlled routes mapping system identifying dynamically controlled routes: broadcast, remote, and live routes controlled by Secoinfi-App
- Route access control ensuring `/broadcast`, `/remote`, and `/live` routes are accessible only when whitelisted by admin
- Combined sitemap generation returning both automatic and manual pages
- Order preservation for manual page additions with audit compatibility for future Merkle root hashing

### User Interface
- Home page displays complete navigation menu with all sitemap links, Login/Sign Up controls, and theme toggle button
- Reliable global theme toggle button in header allowing any user to switch between Light, Dark, and VIBGYOR color themes with immediate visual changes across the entire application
- Theme changes apply globally and instantly to all UI elements, backgrounds, text colors, and components across all pages without errors
- Theme state persists across page navigation and browser sessions with proper error handling
- Bottom navigation bar with Menu icon in bottom left corner for quick access to navigation
- Searchable navigation menu with sitemap pages: Home, Dashboard (Admin Only), Features (Admin Only), Blog, About Us, Pros of SECoin, What We Do, Why Us, Contact Us, FAQ, Terms & Conditions, Referral, Proof of Trust, Test Input, Integration Guide, Sitemap
- Public pages accessible without authentication: Home, Blog, About Us, Pros of SECoin, What We Do, Why Us, Contact Us, FAQ, Terms & Conditions, Test Input, Integration Guide, Sitemap
- Restricted pages requiring authentication: Dashboard (Admin Only), Features (Admin Only), Referral, Proof of Trust
- Integration Guide page displaying comprehensive developer documentation with code snippets, templates, and step-by-step instructions for connecting SECOINFI apps to the Key-Unlock Auth system
- Contact Us page displaying exclusively genuine SECOINFI contact information with the following structure:
  - Section header: "Contact Us – Get in touch with SECOINFI"
  - CEO & Founder: DILEEP KUMAR D, CEO of SECOINFI
  - Contact Information section with Primary Email (dild26@gmail.com), Business Phone (+91-962-005-8644), Website (www.seco.in.net), and WhatsApp (+91-962-005-8644) with clickable links
  - Business Address section with full address (Sudha Enterprises, No. 157, V R VIHAR, VARADARAJ NAGAR, VIDYARANYAPUR PO, BANGALORE-560097) and clickable map links to OpenStreetMap and Google Maps
  - Payment Information section with PayPal (newgoldenjewel@gmail.com), UPI ID (secoin@uboi), and ETH ID (0x4a100E184ac1f17491Fbbcf549CeBfB676694eF7)
  - "Ready to Get Started?" section with call to action and contact details
  - Social media links with icons for Facebook, LinkedIn, Telegram, Discord, Blogspot, Instagram, X (Twitter), and YouTube with correct URLs
- Pros page displaying all Key-Unlock App advantages in a zig-zag card layout with each card header as a hyperlink to dedicated 1-word pages
- Individual pro pages for each advantage (secure, private, decentralised, universal, profile, identity, and other 1-word pros) populated with related data from the Pros page
- Dashboard page with texts 'authenticated', 'Blockchain-based', 'Cryptographic Security', 'Multi-device Support', 'Protected Identity' converted to links to their respective pages (restricted access)
- Enhanced Dashboard with optimized multi-file uploader supporting drag-and-drop and bulk selection for `.js`, `.md`, `.yaml`, and `.zip` files (restricted access)
- Dashboard File Upload & Verification tab displays dual directory structure side-by-side with server and client directories (restricted access)
- Server Structure auto-fill system with real-time file validation and progress tracking (restricted access)
- File upload table showing file name, type, size in KB, upload path (server or client), upload status, hash edges (first and last characters), and validation checkmarks (restricted access)
- Live progress bar displaying percentage completion based on matched files versus total expected files (restricted access)
- Auto-comparison against expected dual directory structure highlighting only missing `.js`, `.yaml`, `.md`, and `.zip` files (restricted access)
- Duplicate file hints indicating whether files like `server.js` and `key-unlock-server.js` are server or client versions (restricted access)
- Dashboard Auth Optimization panel displaying live performance metrics, ping check results, and route status indicators (restricted access)
- Dashboard page displays admin alert banner or notification system showing missing files when file presence check detects incomplete dual directory structure (restricted access)
- Settings page displays admin alert banner or notification system showing missing files when file presence check detects incomplete dual directory structure (restricted access)
- Admin alert notifications list missing .node.js files explicitly with clear identification and upload instructions for both server and client structures (restricted access)
- Features page with enhanced dual-checkbox system and real-time diff fixture for comprehensive feature management (restricted access)
- Test Input page with chat-like interface for secure data submission with comprehensive input validation and detailed feedback (publicly accessible)
- Enhanced Admin page with sitemap management section displaying (restricted access):
  - "+ Add Page" form visible only to admins with text input for page slug validation (lowercase, unique, no spaces, reserved keywords blocked) and submit button labeled "+ Add Page"
  - Existing pages grouped into "auto" and "manual" lists with distinct headings
  - Checkmark indicators and disabled editing/removal for system-reserved pages
  - Small info panel showing controlled routes and which apps own `/broadcast`, `/remote`, and `/live`
- Enhanced Sitemap page with admin-controlled page management displaying (publicly accessible with admin controls visible only to authenticated admins):
  - Combined listing of automatic and manual pages with clear grouping
  - Admin-only controls for adding and removing manual pages (visible only to authenticated admins)
  - Visual indicators for controlled routes and their ownership status
  - Page validation feedback and error handling for invalid page additions
- Application content in English language
- Persistent navigation elements (menu, sitemap links, login/sign-up, theme toggle) across all pages with consistent theme application

### Enhanced Features Page System
- Real-time diff fixture panel permanently positioned at the top of the Features page displaying only features where Admin validation and AI completion checkboxes differ (restricted access)
- Diff fixture updates live as checkbox states change, providing immediate visibility of pending tasks requiring admin attention (restricted access)
- Strict dual-checkbox design implementation (restricted access):
  - Left checkbox: Admin validation (editable only by Admins for manual validation)
  - Right checkbox: AI completion status (read-only, automatically reflects backend completion status)
- Visual distinction between the diff fixture panel and the main features list for clear separation (restricted access)
- Action assignment system for each pending task in the diff fixture with dropdown or quick-select interface for Admins (restricted access)
- Color-coded action tags with unique hex color backgrounds (restricted access):
  - Redo (#F0A)
  - Edit (#0AF)
  - Update (#FA0)
  - Modify (#A0F)
  - Draft (#0FA)
  - Error (#F00)
  - Publish (#0F0)
  - Archive (#AAA)
  - Delete (#000)
- Action labels update dynamically with corresponding color backgrounds when assigned or changed by Admins (restricted access)
- Features list populated with the complete, unique, indexed list of all topics, instructions, inputs, features, and functionalities from the latest specification document, ensuring each entry from the spec is represented as a feature (restricted access)
- Merkle-root verification integration for all feature completions and admin validations (restricted access)
- Real-time UI synchronization reflecting all checkbox state changes and action assignments (restricted access)

### Test Input System
- Chat-like form interface for user data submission (publicly accessible)
- Real-time input sanitization that removes or escapes potentially unsafe characters including <, >, `, ${}, ;, |, &&, ||, and code injection patterns (publicly accessible)
- Comprehensive validation feedback that lists all problematic symbols or sequences found in the input at once, not just the first occurrence (publicly accessible)
- Clear validation messages displayed when input contains restricted characters, showing complete list of issues to address (publicly accessible)
- Security guard that prevents submission of unsafe content (publicly accessible)
- Only sanitized and validated input is accepted for submission (publicly accessible)
- Chat UI experience with message bubbles and detailed real-time feedback (publicly accessible)

### Key-Unlock App Subscription System
- Subscription prompt for new users when 'Authenticated' is checked but 'Blockchain-based' is not (restricted access)
- Subscription tracking using Merkle root for each Principal ID (restricted access)
- Nonce inclusion for proactive security against data misuse (restricted access)
- Subscription status management and verification (restricted access)

### Token Management
- Shared helper utility for token exchange and cookie setting across all subdomains
- Session-based PKCE verifier storage and matching
- Secure cookie configuration preventing cross-site access
- Authentication checks only performed for restricted pages

### Configuration Management
- Environment template generation for each app containing:
  - AUTH_BASE: Base authentication server URL
  - CLIENT_ID: OAuth client identifier
  - CALLBACK_URI: Subdomain-specific callback URL
  - COOKIE_DOMAIN: Subdomain scope for cookies
  - SESSION_SECRET: Session encryption key
- Configuration mapping matches SECOINFI domain structure
- Manifest.yaml file stored in the root directory for configuration, documentation, and deployment purposes

### Manifest Integration System
- Unified spec.md and spec.yaml deduplication that eliminates redundant or mirrored content, especially manifest blocks, while preserving YAML correctness
- Automatic manifest.yaml data inclusion in spec.md under a dedicated "Manifest" section within a fenced YAML block
- Manifest data appended to spec.md without overwriting existing content when manifest.yaml exists
- Reverse parsing capability to generate spec.yaml from spec.md's YAML block when manifest.yaml is missing
- Interoperability between spec.yaml and manifest.yaml with manifest.yaml as the single source of truth
- Configuration binding that points spec.yaml to manifest.yaml for compliance checks, polling, and /login-health integrations
- Human-readable spec.md maintenance with latest manifest data always included

### Deployment System
- Automated deploy script with environment validation
- YAML to JSON configuration conversion
- Auth service restart functionality
- Health panel integration with manifest summary posting
- Alternate deployment method implementation with fallback strategies for failed deployments
- Complete backend and frontend artifact rebuilding and repackaging process with integrated compression
- Clean production deployment pipeline with error recovery mechanisms and optimized build artifacts
- Deployment retry logic with alternate deployment pathways when primary deployment fails
- Comprehensive deployment validation and verification system
- Production environment health checks and deployment status monitoring
- Pre-deployment compression and optimization that maintains functionality while reducing deployment size

### Security Policies
- CORS policies restricted to SECOINFI domains only
- Content Security Policy (CSP) locked to approved domains
- Cross-site cookie prevention
- Subdomain-scoped cookie isolation
- Route-based access control distinguishing public and restricted pages

## Backend Data Storage
- PKCE verifiers stored temporarily per session
- OAuth state parameters for request validation
- Session data for authentication flow tracking
- Configuration mappings for subdomain routing
- Page access control definitions distinguishing public and restricted routes
- User theme preferences stored persistently and synchronized across sessions with proper error handling
- Global theme state management for immediate application-wide updates with reliable persistence
- Integration documentation templates and code snippets for each SECOINFI app
- Callback route templates with secure token exchange implementation
- Environment configuration templates for all SECOINFI caffeine.xyz subdomains
- Step-by-step developer integration guides with production-ready examples
- Authentication flow documentation and best practices for secure session management
- Multi-file upload metadata including file type, size, upload status, upload path (server/client), hash edges, validation results, and auto-tracking status
- Real-time file validation records with checkmark status and progress tracking data
- Batch upload processing records and progress tracking data with duplicate detection
- File comparison results against dual directory structure requirements with mismatch highlighting
- Live authentication performance metrics including latency, success rate, and error rate measurements
- On-demand ping check results for all SECOINFI subdomain apps with timestamp and status tracking
- Route module status records for all `.node.js` files with active/inactive state logging
- `/login-health` endpoint availability tracking with round-trip ping results
- onChange event logs for route modifications with automatic reverification timestamps
- Cached ping results with configurable refresh intervals and performance optimization data
- Backend caching records for login/auth checks to reduce redundant network calls
- Frontend batched data fetching optimization records for Feature and File Verification tabs using React Query
- Build pipeline optimization records including module compression status, dependency updates, and package deduplication results
- Compressed build artifact metadata with integrity verification records
- Deduplication operation logs for spec.md and spec.yaml unification with YAML correctness preservation
- Package optimization records maintaining compatibility while reducing deployment size
- Dual directory structure definitions and file placement mappings
- FileCheckStatus.expectedFiles list using live SECOINFI subdomain names with .node.js suffix and corrected directory structure
- File placement validation records and dual directory structure compliance tracking using live subdomain names with .node.js suffix
- Admin alert status and notification history for missing or misplaced .node.js files in both server and client structures
- Dual directory structure validation timestamps and file placement verification logs
- File metadata storage including file type (.node.js), file size in KB, upload path (server/client), upload status, hash verification data, and auto-tracking validation status
- Duplicate file tracking with server/client designation hints for files like `server.js` and `key-unlock-server.js`
- Live Merkle verification records for all moved files with preserved upload history metadata
- Progress tracking data showing matched file count versus total expected files with percentage calculations
- Tooltip data for "n of N files matched" with dynamic unmatched file lists
- Path correction records for automatic reassignment of `.js` files from subfolders to `/routes/` destination
- Error handling records for incorrect file extensions, unexpected folder placements, and failed uploads with retry attempt tracking
- Genuine SECOINFI contact information with exact structure
- Navigation menu structure and access permissions
- Key-Unlock App advantages and pros data for zig-zag card layout
- Individual pro page content for each 1-word advantage page
- Subscription records with Merkle root tracking per Principal ID
- Nonce values for security enhancement
- Complete, unique, indexed feature definitions sourced directly from the latest specification document containing all topics, instructions, inputs, features, and functionalities from the spec
- Enhanced dual-checkbox state tracking for each feature
- Real-time diff tracking identifying features where Admin and AI checkbox states differ
- Action assignments for pending tasks with color-coded labels and hex color mappings
- Merkle-root verification records for all feature completions and admin validations
- Manifest records for all feature-related activities, validations, and action assignments
- Live state synchronization data for real-time diff fixture updates
- Sanitized test input submissions with timestamps and validation status
- Security validation rules and patterns for input filtering with comprehensive error tracking
- Manual pages array storing unique, prioritized manual pages with predefined initialization list
- Controlled routes mapping identifying dynamically controlled routes (broadcast, remote, live) and their ownership by Secoinfi-App
- Admin-controlled page addition and removal records with validation tracking
- Combined sitemap data including both automatic and manual pages
- Page validation records for uniqueness, format compliance, and reserved keyword blocking
- Route access control records for whitelisted admin-controlled routes
- Order preservation tracking for manual page additions with audit compatibility
- Manifest.yaml file content stored and accessible for configuration and deployment operations
- Unified spec.yaml file content generated from deduplicated spec.md YAML blocks when manifest.yaml is missing
- Configuration bindings mapping spec.yaml to manifest.yaml for interoperability
- Deployment configuration and alternate method settings for fallback deployment strategies with compression optimization
- Build artifact metadata and packaging information for clean redeployment with compression records
- Production deployment logs and error recovery tracking with optimization metrics

## Backend Operations
- OAuth callback processing per subdomain
- Token exchange with central auth server
- Cookie generation and secure setting
- Environment validation and configuration parsing
- Health status reporting and manifest generation
- Route-based access control enforcement distinguishing public and restricted pages
- Authentication bypass for public routes
- Integration documentation generation and management for all SECOINFI apps
- Callback route template generation with secure token exchange implementation
- Environment configuration template creation for each subdomain
- Developer guide generation with step-by-step integration instructions
- Production-ready code snippet generation tailored for SECOINFI caffeine.xyz subdomains
- Authentication flow documentation and secure session management best practices
- Multi-file upload processing for `.js`, `.md`, `.yaml`, and `.zip` files with batch handling and auto-tracking validation
- Real-time file validation processing with immediate checkmark updates and progress calculation
- File validation and type checking operations before upload acceptance with duplicate detection and flagging
- Hash edge calculation (first and last characters) for uploaded files
- Auto-comparison processing against dual directory structure requirements with mismatch detection
- Drag-and-drop file handling and bulk selection processing
- Progress tracking operations calculating matched file count versus total expected files with percentage updates
- Tooltip data generation for "n of N files matched" with dynamic unmatched file list updates
- Automatic path correction processing for `.js` files uploaded to subfolders, reassigning to `/routes/` destination
- Error handling operations for incorrect file extensions, unexpected folder placements, and failed uploads with retry mechanisms
- Live authentication performance metrics collection including latency, success rate, and error rate tracking
- On-demand ping check execution for all SECOINFI subdomain apps at `https://<subdomain>.caffeine.xyz`
- Route module status verification for all `.node.js` files with active/inactive state determination
- `/login-health` endpoint availability testing with round-trip ping processing
- Automatic route status polling operations for all defined route modules
- onChange event detection and automatic reverification processing for route modifications
- Result caching operations with configurable refresh intervals for performance optimization
- Backend caching implementation for login/auth checks to reduce redundant network calls
- Frontend batched data fetching coordination for Feature and File Verification tabs using React Query
- Dashboard performance optimization with reduced rerenders and lazy loading for non-critical tables
- Module-level compression and optimization operations integrated into the build pipeline to reduce node_modules folder size and overall file weight
- Dependency update operations that fetch the latest stable module versions, remove duplicates and unused packages, ensuring compatibility and minimal package footprint
- Pre-deployment compression routine execution that minifies JavaScript files and compresses node_modules using gzip or brotli compression
- Deduplication processing for spec.md and spec.yaml that unifies redundant or mirrored content, especially manifest blocks, while preserving YAML correctness
- Compression and deduplication operations that preserve full functionality and metadata integrity for auditing and manifest consistency
- Automated package optimization operations that maintain compatibility while reducing deployment size
- Build artifact compression with integrity verification to ensure no functionality loss during optimization
- Automated file placement operations for all provided .node.js files into correct dual directory structure
- Dual directory structure validation and file presence verification across all required locations using live subdomain names with .node.js suffix
- File placement status tracking and validation reporting for each .node.js file and designated folder in both server and client structures
- Admin alert generation and notification management for missing or misplaced .node.js files in dual directory structure
- Project dual directory integrity monitoring and compliance enforcement
- File metadata processing including file type detection (.node.js), file size calculation in KB, upload path determination (server/client), upload status tracking, hash generation for Merkle root verification, and auto-tracking validation status
- Cross-checking operations between uploaded .node.js files and expected dual directory structure with visual differentiation for missing items
- Duplicate file identification and server/client designation processing for files like `server.js` and `key-unlock-server.js`
- Live Merkle verification maintenance for all moved files with preserved upload history metadata
- Reliable global theme preference management and persistence for all users with error handling
- Theme state synchronization across all application components and pages without failures
- Genuine SECOINFI contact information retrieval with exact formatting and structure as specified
- Navigation menu filtering based on user permissions and page access levels
- Key-Unlock App pros data retrieval and management
- Individual pro page content serving
- Subscription management and Merkle root generation
- Nonce generation and validation for security
- Complete feature list retrieval and management sourced from the latest specification document with all topics, instructions, inputs, features, and functionalities represented as indexed features
- Enhanced dual-checkbox state management with strict Admin/AI separation
- Real-time diff calculation and fixture data generation for features with mismatched checkbox states
- Action assignment processing and storage for pending tasks with color-coded label management
- Live state change detection and real-time UI synchronization for diff fixture updates
- Merkle-root verification processing for all feature completions and admin validations
- Manifest generation and recording for all feature activities, validations, and action assignments
- Persistent UI element management across all pages with consistent theme application
- Comprehensive input sanitization and validation processing for test submissions
- Security pattern matching and filtering for unsafe characters and code injection attempts with complete error reporting
- Test input submission processing and storage with detailed validation status tracking that identifies all problematic elements
- Manual page management operations including addition, removal, and validation processing
- Combined sitemap generation returning both automatic and manual pages
- Page validation processing for uniqueness, lowercase format, space prevention, and reserved keyword blocking
- Controlled routes management and access control enforcement for `/broadcast`, `/remote`, and `/live` routes
- Admin-only page addition processing with comprehensive validation and duplicate prevention
- Admin-only page removal processing with system-reserved page protection
- Route ownership tracking and whitelisting management for dynamically controlled routes
- Order preservation processing for manual page additions with audit compatibility maintenance
- Manifest.yaml file reading, parsing, and serving operations for configuration and deployment purposes
- Automatic manifest.yaml data appending to spec.md under "Manifest" section in fenced YAML blocks with deduplication
- Unified spec.yaml generation from deduplicated spec.md YAML block parsing when manifest.yaml is missing
- Configuration binding management to establish spec.yaml to manifest.yaml interoperability
- Manifest.yaml enforcement as single source of truth for compliance checks, polling, and /login-health integrations
- Alternate deployment method execution with fallback deployment strategies when primary deployment fails, including compression optimization
- Complete backend and frontend artifact rebuilding and repackaging operations with integrated compression
- Clean production deployment processing with comprehensive error recovery mechanisms and optimized build artifacts
- Deployment retry logic implementation with alternate pathway selection and execution
- Production environment validation and deployment verification operations with compression metrics
- Deployment health monitoring and status reporting for successful production deployment with optimization tracking

## Manifest
