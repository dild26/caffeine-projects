# Cloud Storage ICP Application

## Overview
A multi-tenant cloud storage platform built on the Internet Computer, providing secure file storage, management, and billing capabilities with enterprise-grade features. The platform includes a comprehensive backup and restore subsystem inspired by MacOS Time Machine, offering efficient, Merkle-tree-based, incremental, encrypted backups with Nonce tracking. The system features advanced folder management, media handling with complete codec compatibility and auto-transcoding, real-time collaboration, comprehensive monetization for data creators, complete data loss prevention with multi-tier redundancy, automated backup scheduling, full binary integrity verification, server-side post-write verification, and modular incremental IPFS backup capabilities for enhanced decentralization and resilience.

## Backend Architecture

### Core Canisters
- **auth_canister**: Manages user authentication, session tokens, and role-based access control with tenant isolation
- **storage_gateway_canister**: Handles presigned URL generation for uploads/downloads and coordinates object operations with proper MIME type validation and video codec support
- **chunk_store_canister**: Stores binary file chunks with methods for putting, getting, and checking chunk existence
- **object_index_canister**: Maintains file metadata, supports search and filtering operations across tenant namespaces, includes folder-level organization and metadata
- **replication_coordinator_canister**: Ensures data replication across canisters and performs periodic integrity checks
- **billing_canister**: Tracks storage usage (GB-month) and egress bandwidth, generates invoices, manages monetization payments and payouts
- **admin_canister**: Provides governance interface for managing quotas, roles, and system policies
- **menu_canister**: Stores and manages dynamic menu configuration including page names, links, and admin-created pages
- **features_canister**: Manages feature status tracking with AI-detected completion status and admin verification flags
- **content_canister**: Stores static page content including compare page data, sitemap information, pros page content, terms page content, contact page content, and asset references
- **backup_canister**: Manages backup sessions, Merkle tree operations, and Nonce tracking for Time Machine-style backups
- **encryption_canister**: Handles Message-Locked Encryption (MLE) operations, block encryption/decryption, and content-hash-based key generation
- **folder_index_canister**: Manages folder metadata, hierarchy, and organization with sorting capabilities by name, size, type, and date operations
- **sharing_canister**: Handles permalink generation, embed code creation, sharing permissions, and inline download/share link generation for files and folders
- **monetization_canister**: Manages the trace-and-track system using Merkle roots and Nonce identifiers for data ownership monetization, creator rewards, and price-per-file/folder payment processing
- **collaboration_canister**: Manages real-time collaborative editing sessions using CRDT operations, operational transformation logging, and user synchronization for text and image-based files
- **permissions_canister**: Handles file and folder permission management including share, view, edit, collaborate, and monetize permissions with admin exemptions
- **redundancy_canister**: Manages multi-tier redundancy system with primary/secondary/tertiary replica storage, encryption, and automatic healing from healthy replicas
- **vault_canister**: Handles secure backup vault operations with environment key encryption, restricted permissions, and replica verification using stored checksums
- **transcoding_canister**: Manages server-side video transcoding operations using FFmpeg for codec conversion, format compatibility, and universal browser support
- **integrity_canister**: Manages comprehensive binary integrity verification including SHA-256 checksum calculation, byte length validation, corruption detection, and diagnostic routines
- **post_write_verification_canister**: Manages server-side post-write verification including SHA-256 checksum computation after file storage, corruption detection, quarantine management, and verification result logging
- **ipfs_backup_canister**: Manages modular incremental IPFS backup operations including periodic snapshots, Merkle root diff comparison, manifest storage, IPFS node integration, and automated recovery capabilities

### Binary Integrity and Corruption Prevention System
- **Upload Integrity Pipeline**: Backend calculates and stores SHA-256 checksum and exact byte length for every uploaded file, confirming correct write operations in storage backends
- **Download Integrity Pipeline**: Backend re-reads stored binary data, recomputes checksum and byte length, and compares to stored values before streaming; aborts stream and logs corruption if mismatched
- **Post-Write Verification**: Backend automatically computes SHA-256 checksums for all files immediately after storage completion, recalculates and compares checksums post-storage to detect corruption during write process
- **Automatic Quarantine System**: Backend automatically blocks or quarantines downloads when checksum mismatches are detected, with comprehensive logging and admin notification
- **Binary Response Validation**: Backend validates all binary responses with correct HTTP headers and ensures no middleware modifies binary bodies
- **Diagnostic Binary Diff System**: Backend implements diagnostic routines that collect sample pairs to perform binary diffs and record difference patterns for investigation
- **Continuous Integrity Verification**: Backend runs periodic jobs that check stored files' sizes and hashes, displaying results in "Integrity Checks" dashboard
- **Round-Trip Fidelity Testing**: Backend supports CI pipeline tests covering upload → download → checksum equality for multiple file types and sizes
- **Storage Environment Separation**: Backend separates ephemeral draft storage from persistent production storage to prevent auto-reset environments from deleting user files

### Video Transcoding and Media Compatibility System
- **FFmpeg Integration**: Backend implements FFmpeg-based video analysis and conversion for uploaded media files
- **Codec Detection Service**: Analyzes uploaded videos to detect H.264/AAC, VP8/VP9, OGG, and other codec formats
- **Auto-Conversion Pipeline**: Automatically converts incompatible codecs to H.264/AAC (MP4) or VP9 (WebM) for universal browser compatibility
- **Multi-Format Storage**: Stores both original and converted versions of video files with metadata tracking for format availability
- **Post-Conversion Validation**: FFprobe integration for verifying converted video integrity and playback compatibility
- **Transcoding Queue Management**: Background job processing for video conversion with priority handling and resource management
- **Format Fallback System**: Maintains multiple video formats for optimal browser compatibility
- **Streaming Protocol Support**: Implements Accept-Ranges: bytes and accurate Content-Length headers for reliable media streaming

### IPFS Backup and Decentralized Storage System
- **Periodic Snapshot Management**: Backend implements periodic snapshots of changed files using Merkle root diff comparison to identify modifications
- **Incremental Backup Manifests**: Storage of incremental backup manifests with metadata including nonce, version, size, timestamp, and file change tracking
- **IPFS Node Integration**: Automatic upload of new and modified chunks to IPFS nodes with pinning and replication across multiple nodes
- **Chunk Deduplication**: Content-addressed storage ensuring identical chunks are only stored once across all backup sessions
- **Pin Verification System**: Continuous verification that IPFS pins are maintained and accessible across the distributed network
- **Automated Recovery Engine**: Recovery system using manifests to verify backup completeness and restore missing data from IPFS
- **IPv4 Network Compatibility**: Full compatibility with existing IPv4-based networks and datacenter infrastructure
- **Global IP Camera Integration**: Support for integration with global IP camera backing systems and surveillance networks
- **Network Fault Tolerance**: Automatic failover and recovery mechanisms for network interruptions and node failures
- **Manifest Validation**: Cryptographic validation of backup manifests to ensure data integrity and completeness

### Data Loss Prevention and Redundancy System
- **Multi-Tier Redundancy Layer**: Backend implements IndexedDB as primary storage, localStorage as fallback, and encrypted server backup upload as tertiary protection
- **File Metadata Recording**: Comprehensive recording of filename, ID, size, hash (SHA-256), and storage locations across all redundancy tiers
- **Replica Verification System**: Stored checksum validation and automatic healing from healthy replicas when corruption is detected
- **Vault Directory Protection**: Restricted permissions (0o700) and environment key encryption using VAULT_KEY from .env configuration
- **Missing File Auto-Recovery**: Automatic detection and recovery of missing or corrupted files using healthy replicas
- **Automated Backup Scheduling**: Hourly and daily incremental backups with compression, encryption, and redundancy (3 replicas)
- **Full Backup Scheduling**: Weekly full backups with complete system state capture and verification
- **Backup Manifest Logging**: Comprehensive logging of backup manifests with size, checksum, and version metadata

### Real-Time Collaboration and Sharing System
- **CRDT Operations Management**: Backend implements Conflict-free Replicated Data Type operations using Y.js or similar technology for real-time synchronization
- **Collaborative Session Management**: Manages active collaboration sessions with user presence tracking and first-come-first-serve access logging
- **Operational Transformation Logging**: Comprehensive audit trail of all collaborative changes with timestamps, user attribution, and change history
- **Admin Exemption Logic**: Special handling for admin users to override collaboration locks and access restrictions
- **Permalink Generation**: Creates unique, shareable links for individual files and folders accessible to users and admins
- **Embed Code Creation**: Generates HTML embed codes for files and folders for external integration
- **Sharing Permissions Management**: Controls access levels for shared content including view-only, download, and edit permissions

### Monetization and Ownership Tracking System
- **Merkle Root Ownership Tracking**: Uses existing Merkle root hashes to establish unique file ownership and trace data provenance
- **Nonce-Based Reward System**: Implements reward mapping using Nonce identifiers to enable monetization for unique data creators
- **Price-Per-File/Folder Management**: Backend stores and manages USD pricing set by file/folder owners for download and reuse access
- **Payment Gateway Integration**: Integration with Stripe and PayPal for payment processing before file access
- **Paywall Implementation**: Backend enforces payment requirements before allowing download or reuse access to monetized content
- **Admin Payment Exemption**: Logic to exempt admin users from all monetization payments and paywalls
- **Payout Management**: Webhook integration for managing creator payouts and revenue distribution

### Comprehensive Permission Management
- **Granular Permission System**: Backend manages five permission types: share, view, edit, collaborate, and monetize for files and folders
- **User and Admin Permission Controls**: Separate permission handling for regular users and admin users with admin exemptions
- **Permission Inheritance**: Folder-level permissions cascade to contained files with override capabilities
- **Permission Validation**: Real-time permission checking for all file and folder operations

### Backup and Restore Subsystem
- **Backup Creation & Data Differencing**: Continuous and on-demand backup triggers with data splitting into Merkle leaves using Message-Locked Encryption (MLE)
- **Nonce Tracking and Storage Management**: Unique Nonce generation for each backup session with metadata for downloadable link generation
- **Upload Operations**: Multi-method uploads with validation by comparing Merkle roots and block checksums, encrypted block storage with deduplication
- **Restore Operations**: File and folder reconstruction using stored Merkle roots and encrypted blocks with downloadable link generation
- **Sync and Delta Updates**: Client synchronization by comparing Merkle roots with streaming of new or updated blocks
- **Encryption and Security**: Message-Locked Encryption with content-hash-based key generation and cryptographic proofs for Merkle verification

### Data Storage Model
- Tenant-based namespacing using tenant_id + file path structure
- Chunk sharding strategy based on 4-character hex prefixes
- Cross-canister replication with automatic repair mechanisms
- Support for autoscaling triggers based on storage demand
- Backup session storage with Nonce-based indexing and Merkle tree metadata
- Folder hierarchy storage with parent-child relationships and metadata
- Sharing and permalink data with access control information
- Monetization tracking data linking Merkle roots to creator rewards
- Real-time collaboration session data with CRDT operations and user presence tracking
- Permission management data with granular access controls and admin exemptions
- Video codec and MIME type validation data for enhanced media playback
- File integrity metadata including SHA-256 checksums, exact byte lengths, validation status, and corruption detection logs
- Binary diff diagnostic data and corruption pattern investigation data
- Recovery metadata including restoration operations and blob-to-index mapping repairs
- Multi-tier redundancy information including IndexedDB, localStorage, and server backup locations
- Automated backup scheduling data including job schedules, manifests, and execution logs
- Vault security data including encrypted vault keys, replica checksums, and healing operation logs
- Transcoding metadata including original and converted video formats, codec information, and format availability flags
- Post-write verification data including server-side verification results, checksum computations, and quarantine status
- IPFS backup metadata including backup manifests, incremental snapshot data, pin verification status, and recovery metadata
- Contact page content including CEO information, contact details, business address, payment information, and social media links

### Security Features
- Strict tenant isolation preventing cross-tenant data access
- Role-based permission system with granular access controls
- Client-side encryption support (recommended for sensitive data)
- Expirable presigned URLs for secure file access
- Rate limiting: maximum 1000 requests per minute per tenant
- Message-Locked Encryption for backup data with content-hash-based deduplication
- Vault key encryption with environment-based VAULT_KEY encryption for secure backup vault operations
- Restricted vault permissions (0o700) for vault directories to prevent unauthorized access
- Binary integrity protection with SHA-256 checksum validation and byte-level integrity verification
- Post-write verification security with automatic quarantine of corrupted files and secure verification logging
- IPFS security with cryptographic validation of IPFS backup manifests and secure pin management

### System Verification and Logging
- Auto-verification hooks that log and validate system updates including feature additions, changes, migrations, backups, and restorations
- Comprehensive audit trail for maintaining system resilience and sustainability
- Automated integrity checks and validation processes
- Non-blocking async verification checks on feature changes and upgrades
- AI auto-verification for backup sessions to check for corruption, missing leaves, and repair options
- Upload corruption logging with detailed logging for upload failures, checksum mismatches, and corruption detection
- Download integrity logging with comprehensive logging of download integrity verification and corruption detection
- Binary diff analysis logging with detailed logging of corruption pattern investigation
- Recovery operation logging with comprehensive logging of file recovery operations and metadata restoration
- Redundancy system logging with logging of multi-tier redundancy operations and automatic healing activities
- Backup schedule logging with comprehensive logging of automated backup job execution and integrity verification results
- Transcoding operation logging with comprehensive logging of video transcoding operations and post-conversion validation
- CI pipeline test logging with logging of round-trip fidelity tests covering upload → download → checksum equality verification
- Post-write verification logging with comprehensive logging of server-side verification operations and quarantine actions
- IPFS backup logging with detailed logging of IPFS backup operations, pin verification, and recovery activities

### Content Management
- Backend stores compare page provider data including rankings, pricing, types, and notes for top 10 cloud storage providers
- Pros page content storage with advantages of ICP Cloud Storage at Caffeine.ai
- Enhanced terms page content storage with updated terms and conditions including company rights and admin exemptions
- Contact page content storage with SECOINFI company information including CEO details, contact information, business address, payment methods, and social media links
- Sitemap data with all page links and routing information including pros, terms, and contact pages
- Asset reference management to ensure proper image and content rendering
- Page content validation and consistency checks

## Frontend Application

### Binary Integrity and Verification Interface
- **Upload Integrity Tracking**: Frontend displays real-time SHA-256 checksum calculation and byte length validation during file uploads using Web Crypto API
- **Download Integrity Verification**: Frontend shows integrity verification status before downloads and displays corruption warnings when checksum validation fails
- **Corruption Error Display**: Clear user-facing error messages when integrity checks fail with retry options
- **Binary Diff Diagnostics Interface**: Admin interface for viewing binary difference analysis results and corruption pattern investigation
- **Integrity Status Dashboard**: Real-time display of file integrity status (healthy / corrupted / missing) in admin interface
- **Post-Write Verification Interface**: Real-time display of server-side post-write verification results showing checksum computation status and corruption detection
- **Quarantine Management Interface**: Admin interface for managing quarantined files with options to review, restore, or permanently remove corrupted files
- **Verification Timeline Display**: Visual timeline showing verification checkpoints and results integrated with existing IntegrityChecksTab
- **Round-Trip Fidelity Testing**: Interface for CI pipeline tests covering upload → download → checksum equality verification

### IPFS Backup Dashboard Interface
- **IPFS Backup Status Display**: Real-time dashboard showing IPFS backup progress, queue status, and pin verification results
- **Incremental Snapshot Timeline**: Visual timeline of incremental backups with Merkle root diff comparison results
- **Backup Manifest Browser**: Interface for browsing backup manifests with metadata including nonce, version, size, and timestamp information
- **Pin Verification Interface**: Real-time display of IPFS pin status and verification results across distributed nodes
- **Recovery Management Interface**: User interface for initiating automated recovery using IPFS manifests and verifying backup completeness
- **IPFS Node Health Monitor**: Dashboard showing IPFS node connectivity, health status, and network performance metrics
- **Network Compatibility Display**: Interface showing IPv4 network compatibility status and datacenter integration health

### Video Codec Compatibility and Media System
- **VideoCodecDetector Class**: Frontend implements codec detection utility to check browser support for H.264/AAC, VP8/VP9, OGG, and other video formats
- **Codec Compatibility Interface**: User-friendly error panels displaying "⚠️ Codec Not Supported" messages with conversion and download options
- **Automatic Format Fallback**: Frontend automatically falls back to WebM or OGG versions when available for unsupported formats
- **Direct Download Fallback**: Option to download unsupported media files directly when playback is not possible
- **Real-Time Conversion Status**: Interface showing transcoding progress and availability of converted formats
- **Multi-Format Player Support**: Enhanced media player supporting multiple video formats with automatic format selection
- **Format Selection Interface**: User interface for selecting between available video formats (MP4, WebM, OGG)
- **Conversion Request Interface**: User interface for requesting video transcoding when unsupported formats are detected
- **Media Diagnostics Interface**: Accessible from Admin → Integrity Checks → Media Diagnostics for testing codec support
- **Auto-Conversion Upload Interface**: Frontend detects video codecs during upload and identifies compatibility requirements

### Data Loss Prevention and Recovery Interface
- **Redundancy Status Dashboard**: Real-time display of multi-tier redundancy health showing IndexedDB, localStorage, and server backup status
- **File Metadata Tracking**: Interface displaying filename, ID, size, hash (SHA-256), and storage locations across all redundancy tiers
- **Auto-Recovery Notifications**: User notifications for automatic file recovery operations and healing from healthy replicas
- **Recovery Status Dashboard**: Dedicated interface showing progress of metadata reconstruction and file recovery operations
- **Missing File Detection**: Visual indicators highlighting files that are missing from search results or storage lists
- **Recovery Progress Tracking**: Real-time progress bars showing metadata rebuilding, blob-to-index mapping repair, and file restoration status
- **Automated Backup Scheduling Interface**: Interface for configuring incremental (hourly/daily) and full (weekly) backup schedules
- **Backup Manifest Display**: Real-time display of backup manifests with size, checksum, and version metadata
- **Vault Security Indicators**: Display of vault directory protection status and environment key encryption validation

### Real-Time Collaboration and Sharing Interface
- **Live Collaborative Editing**: Real-time collaborative editing interface for text and image-based files using Y.js or similar CRDT technology
- **User Presence Indicators**: Visual indicators showing active collaborators with real-time presence tracking
- **First-Come-First-Serve Access**: UI elements displaying file access priority with first-come-first-serve logging
- **Admin Override Interface**: Special admin controls to override collaboration locks and access restrictions
- **Operational Transformation Display**: Audit trail interface showing collaborative changes with timestamps and user attribution
- **Permalink Generation Interface**: Generate unique shareable links for individual files and folders accessible to users and admins
- **Embed Code Creation**: Generate HTML embed codes for files and folders with copy-to-clipboard functionality
- **Sharing Controls**: Manage sharing permissions including public/private modes and access levels

### Monetization and Permission Management Interface
- **Price Setting Interface**: User interface for uploaders/owners to define USD pricing per file and folder for download and reuse access
- **Payment Gateway Integration**: Integrated Stripe and PayPal payment interface with paywall implementation before file access
- **Admin Payment Exemption**: Clear UI indicators showing admin users are exempt from all monetization payments
- **Revenue Dashboard**: Interface for creators to track monetization revenue, payments, and payouts
- **Settings Sub-Tab**: Dedicated Settings sub-tab in the dashboard allowing users and admins to configure file and folder permissions
- **Granular Permission Controls**: Interface for setting five permission types: share, view, edit, collaborate, and monetize for individual files and folders
- **Admin Permission Management**: Special admin interface for overriding and managing all user permissions with exemption controls
- **Permission Inheritance Settings**: UI for managing folder-level permission inheritance and override capabilities

### Enhanced File and Folder Management
- **Multi-File and Folder Upload System**: Drag-and-drop zones supporting multiple files and entire folders with batch processing capabilities
- **Upload Progress Tracking**: Real-time progress bars showing percentage, upload speed, and remaining time for each file and overall batch
- **MIME Type Preservation**: Frontend maintains and validates MIME types and file metadata during upload process
- **Folder Structure Handling**: Preserves folder hierarchy and file paths when uploading entire directories
- **Inline Download and Share Links**: Direct download and share links embedded in Files and Folders table entries for immediate access
- **Working Download Endpoints**: Functional download buttons with proper authentication and permission validation
- **Sortable Index Lists**: Both Files and Folders tabs feature sortable columns by Name, Size, Type, and various Date operations
- **Selection System**: Per-file and per-folder selection capabilities with multi-select support
- **Context Menu Actions**: Right-click context menus for file and folder operations including share, copy, move, delete

### Dashboard Tab System
- **Files Tab**: Enhanced file management interface with sortable columns for Name, Size, Type, and Date operations (Added, Edited, Cut, Copied, Pasted, Shared, Archived, Deleted)
- **Folders Tab**: Dedicated folder management interface with identical sorting and indexing features as Files tab for consistency
- **Backup Tab**: Enhanced backup and restore interface with Time Machine-style functionality and IPFS backup integration
- **Admin Tab**: Administrative controls and system management (admin users only)
- **Integrity Checks Tab**: Enhanced admin panel for backup/replication status monitoring, file health verification, binary integrity monitoring, post-write verification results, and IPFS backup status

### Enhanced Media Player Interface
- **HTML5 Video Attributes**: Video player components with controls, muted, playsinline, and preload="metadata" attributes for instant loading and cross-browser compatibility
- **H.264/AAC Codec Support**: Frontend validates and displays MP4 files encoded with H.264 video and AAC audio codecs with proper playback handling
- **Source Type Validation**: Proper source type="video/mp4" handling with MIME type validation for video elements
- **Cross-Browser Compatibility**: Video playback tested and optimized for Chrome, Safari, Firefox, and Edge browsers
- **Built-in Media Player**: Integrated video player with Play, Pause, Stop, Forward, Backward, Rewind, Fast forward, and Time-shift controls
- **External Player Integration**: Seamless compatibility with external media players like VLC through proper file handling
- **Media Preview**: Thumbnail previews and metadata display for video, audio, and image files

### Public Content and Navigation
- **Unauthenticated Navigation**: /pros, /terms, and /contact pages are permanently accessible without login requirements
- **Public Menu Integration**: Main navigation menu includes /pros, /terms, and /contact links visible to all visitors regardless of authentication status
- **Static Route Handling**: Public pages load immediately without authentication checks or login redirects
- **Compare Page**: Comprehensive comparison table showing top 10 traditional cloud/file hosting providers versus ICP blockchain-based storage approach
- **Pros Page**: Dedicated page displaying advantages of ICP Cloud Storage at Caffeine.ai with bullet points styled under existing theme
- **Enhanced Terms Page**: Complete terms and conditions page with updated language including company rights and admin exemptions
- **Contact Page**: Complete contact page with SECOINFI company information including CEO details (DILEEP KUMAR D), contact information (email: dild26@gmail.com, phone: +91-962-005-8644, website: www.seco.in.net, WhatsApp: +91-962-005-8644), business address with Google Maps integration, payment information (PayPal: newgoldenjewel@gmail.com, UPI: secoin@uboi, ETH: 0x4a100E184ac1f17491Fbbcf549CeBfB676694eF7), and social media links
- **Sitemap Page**: Complete site navigation with functional links including verified compare, pros, terms, and contact page routing

### Enhanced Features Page
- Status index list for every prompt, feature, and pros entry with optimized rendering
- Two checkboxes per item: first auto-selected by AI when detecting completed/functional features, second for admin manual verification
- Dynamic status updates when implementation is verified as done/ok, with stable state management
- Integration with features_canister for status persistence
- Binary integrity verification tracking, download integrity fix tracking, media playback fix tracking, frontend streaming fix tracking
- Cross-browser testing tracking, collaboration system tracking, download and share links tracking, permission system tracking
- Monetization system tracking, updated terms tracking, fix tracking, backup system tracking, public page implementation tracking
- Folder management tracking, media handling tracking, file integrity and corruption prevention tracking
- Missing file recovery tracking, continuous integrity monitoring tracking, data loss prevention tracking
- Automated backup scheduling tracking, secure backup vault tracking, media codec compatibility tracking
- Auto-transcoding on upload tracking, server-side post-write verification tracking, IPFS backup system tracking

### Admin User Management Interface
- **User Management Tab**: Dedicated section in Admin Dashboard displaying comprehensive user list with Principal IDs and profile details
- **Interactive User List**: Clear display of all users showing Principal values alongside profile information including username, email, current tenant assignment, and storage usage
- **Tenant Assignment Interface**: Dropdown selector or input box for selecting or entering tenants to assign to users via assignTenantToUser backend method
- **Principal ID Access**: Direct access to user Principal IDs for administrative linking and management operations
- **Real-time Assignment**: Tenant assignment operations execute immediately without requiring app reloads, with instant UI updates
- **Storage Testing Toggle**: Admin interface includes toggle for testing unrestricted storage capabilities, bypassing tenant quota and storage limits for administrative accounts

### Performance Optimization and Stability
- **Render Loop Prevention**: Eliminate all re-render loops causing multiple refreshes in authentication, profile setup, and menu rendering components
- **Static Memoization**: Implement useRef, useMemo, and useCallback hooks in critical components to ensure stable mount cycles
- **Context-Based Persistence**: Use React Context for state management to prevent unnecessary component re-renders and maintain stable state across navigation
- **Modal Stability**: Ensure all modals and pop-ups open once and remain stable without re-trigger loops or flicker
- **Theme Stability**: Maintain stable rendering across light, dark, and VIBGYOR theme transitions without causing refresh loops
- **Immediate Content Loading**: All pages load content immediately after login without lazy loading delays
- **Code Splitting at Route Level**: Implement React Router-based code splitting to prevent all module imports pre-login
- **Synchronous Data Loading**: Critical page content loads synchronously to prevent blank page states

### Navigation and Layout
- Consistent header navigation across all pages including login page with visible menu list, optimized to prevent unnecessary re-renders
- Menu list displays on login page showing all auto-generated AI links and admin-manageable links
- Clickable application logo (both text and image) that opens in new browser tab, visible on all pages including login page
- Unified styling between authenticated and unauthenticated states
- Dynamic menu system with auto-generated links from page names: ["about", "blog", "compare", "contact", "dashboard", "faq", "features", "pros", "referral", "sitemap", "terms", "who", "what", "why"]
- Theme switcher component in header navigation allowing cycling through light, dark, and VIBGYOR themes with optimized state management
- Static UI behavior with all menu interactions, modal state changes, and theme toggles occurring instantaneously without CSS transitions, animations, or keyframes
- Bottom navbar marquee with sitemap list scrolling smoothly as horizontal marquee while keeping Menu icon static and clickable
- Public page navigation with /pros, /terms, and /contact links permanently visible in main menu and accessible from sitemap regardless of authentication status

### System Feedback and Notifications
- Success messages for linking users and tenants, confirming assignment completion
- Warning system for missing or misconfigured tenants or users during assignment operations
- Assignment status with real-time display of tenant assignment status and storage permission updates
- Error handling with comprehensive error messages for failed assignments with troubleshooting guidance
- Upload integrity notifications, download integrity notifications, recovery progress notifications
- Redundancy status notifications, backup schedule notifications, transcoding progress notifications
- Binary integrity alerts, post-write verification notifications, IPFS backup notifications

## Integration Capabilities
- Provisioning APIs for automated tenant creation
- Webhook endpoints for external system integration
- Billing notification webhooks for payment events
- Caffeine.ai integration endpoints for automated workflows
- Backup and restore API endpoints for external backup clients
- Sharing and permalink APIs for external integration
- Monetization APIs for creator reward distribution
- Real-time collaboration APIs for external integration
- Payment gateway webhooks for Stripe and PayPal integration
- Permission management APIs for external access control
- File integrity validation APIs for external upload verification
- Data loss prevention APIs for redundancy system integration
- Automated backup scheduling APIs for external backup management
- Secure vault APIs for encrypted backup operations
- Video transcoding APIs for external media processing integration
- Codec compatibility APIs for external media validation
- Binary integrity verification APIs for external corruption detection and prevention
- Post-write verification APIs for external integrity validation
- IPFS backup APIs for external decentralized backup integration

## Monitoring and Operations
- Canister health monitoring including cycles, latency, and error rates
- Upgrade mechanisms with snapshot and rollback capabilities
- Performance metrics and usage analytics
- Automated alerting for system issues
- System verification and audit logging
- Backup system monitoring including Merkle tree integrity checks and encryption validation
- Folder management monitoring and performance tracking
- Monetization system monitoring and reward distribution tracking
- Real-time collaboration session monitoring and performance tracking
- Video playback and media handling performance monitoring
- File integrity monitoring including SHA-256 checksum validation and corruption detection tracking
- Missing file detection and recovery operation monitoring
- Continuous integrity verification monitoring and automated repair tracking
- Multi-tier redundancy monitoring including IndexedDB, localStorage, and server backup health tracking
- Automated backup scheduling monitoring including job execution, success rates, and integrity verification tracking
- Secure backup vault monitoring including environment key validation, replica health, and healing operation tracking
- Video transcoding monitoring including conversion progress, codec detection, and post-conversion validation tracking
- Binary integrity monitoring including SHA-256 checksum validation, byte length verification, corruption detection, and diagnostic routine tracking
- CI pipeline monitoring including round-trip fidelity test execution and upload → download → checksum equality verification tracking
- Post-write verification monitoring including server-side verification operations, quarantine management, and corruption detection tracking
- IPFS backup monitoring including backup operations, pin verification, manifest validation, and recovery activities tracking

## Application Language
- All content and interface elements are in English
