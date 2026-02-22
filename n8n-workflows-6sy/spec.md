# n8n Workflows E Store

## Overview
A SaaS marketplace for n8n workflow templates where users can browse, search, and purchase workflow files. The platform allows workflow creators to upload their n8n JSON files and sell them through subscription or pay-per-run models. The application features a comprehensive multi-page structure with advanced navigation, referral tracking, trust verification systems, administrative management capabilities, comprehensive testing guides, enhanced schema validation with manifest logging, and an advanced sitemap management system with manual page control and app-controlled routes. All content is displayed in English language.

## Access Control System
The application implements a tiered access control system with three distinct user levels:

### Public Access (No Authentication Required)
- Home: Landing page with featured workflows, value proposition, and PAYU fee structure display
- Blog: Content marketing section for workflow tutorials and updates
- About: Company information and mission statement
- Pros: Benefits and advantages of using the platform
- What We Do: Service offerings and platform capabilities
- Why Us: Competitive advantages and unique selling points
- Contact: Contact page displaying genuine SECOINFI company details and information
- FAQ: Frequently asked questions and answers
- Terms: Terms of service and legal information
- Referral: Decentralized referral tracking system with campaign statistics and earnings display
- Trust: Proof-of-Trust section with cryptographic verification simulation
- Sitemap: Enhanced site navigation overview with manual page management and comprehensive page structure display
- Features: Feature comparison and validation system with public feature showcase
- **Dynamic Manual Pages**: All public pages defined in the manual `pages[]` array are accessible without authentication
- **Workflow Catalog**: Public browsing and preview access to workflow cards and metadata

### Subscriber Access (Authentication Required)
- Dashboard: Analytics and statistics display with subscriber-specific data and earnings tracking
- Subscribers: Subscriber management page with PAYU fee structure display
- **Workflow Downloads**: Access to download purchased workflows and forms
- **Enhanced Purchase System**: Full checkout and payment processing capabilities
- **Quantity Selection**: Advanced workflow selection with cart management
- **Form Customization**: Access to customize and fill workflow templates

### Admin Access (Admin Authentication Required)
- Admin: Administrative management tools with restricted access and enhanced sitemap management capabilities
- Gallery: Admin-only page displaying unmatched uploaded images as placeholders
- **Enhanced Sitemap Management Panel**: Admin interface for managing manual pages array and app-controlled routes
- **Spec Conversion Management**: Admin tools for schema validation and manifest logging
- **Advanced Deduplication Management**: Admin interface for managing spec.md file deduplication
- **Node Modules Optimization Panel**: Admin tools for dependency management and system optimization
- **Error Recovery Dashboard**: Comprehensive error monitoring and resolution tools
- **Feature Validation Controls**: Admin tools to manually validate and promote features

### Route Protection and Navigation
- **Public Route Access**: All public pages are accessible without login and appear normally in navigation and sitemap
- **Protected Route Guards**: Frontend route guards enforce authentication requirements for subscriber and admin pages
- **Visual Access Indicators**: Lock icons displayed only next to admin and subscriber pages in navigation and sitemap
- **Unauthorized Access Handling**: Proper fallback messaging for unauthorized attempts on restricted areas with informative but secure UX
- **Search Integration**: Public pages remain searchable in navigation and sitemap for unauthenticated users
- **Dynamic Menu Visibility**: Navigation adapts based on user authentication status and role permissions

## Core Features

### Enhanced Sitemap Management System with Manual Page Control
- **Manual Pages Array**: Backend storage of a `pages[]` array containing predefined entries: ["about","admin","apps","angel-vc","blog","block","broadcast","compare","contact","dash","dex","e-com","faq","finance","fix","fixture","footstep","lang","leader","live","main","map","milestone","pages","payments","pros","rank","referral","remote","resource","routes","secure","sitemap","terms","trust","what","verifySig","when","where","who","why","ZKProof"]
- **Access-Based Page Display**: Public pages from the manual array are accessible without authentication, while admin-controlled pages require appropriate permissions
- **Admin-Only Access Control**: Strict access control ensuring only administrators can modify the manual pages array
- **Admin Page Management Form**: New admin-accessible form with "+ Add Page" button available on both `/admin` and `/sitemap` pages for appending new slugs to the `pages[]` list
- **Page Slug Validation**: Comprehensive validation for new page slugs including lowercase enforcement, no spaces allowed, uniqueness checking, and reserved keyword protection
- **App-Controlled Routes**: Three special control routes (`/broadcast`, `/remote`, `/live`) that can only be managed by applications whitelisted in the `Secoinfi-Apps[]` list and require admin approval
- **Enhanced Sitemap Resolver**: Advanced sitemap generation that merges three sources: (1) autogenerated sitemap from existing pages, (2) manual `pages[]` entries, and (3) dynamic app-controlled routes while preserving order and avoiding collisions
- **Public Sitemap Access**: Enhanced sitemap display accessible to all users with appropriate access indicators for protected pages
- **Priority Pages UI**: Enhanced sitemap display with manual pages shown under a dedicated "Priority Pages" section with access level indicators
- **Runtime Route Marking**: Visual indicators for runtime-controlled routes in the sitemap interface with access permissions
- **System Preset Protection**: Prevention of deletion or overwriting of system preset pages and routes
- **Versioned Sitemap Snapshots**: Implementation of versioned sitemap snapshots for audit safety and rollback capabilities
- **Access Validation**: Comprehensive access validation system for all sitemap modification operations

### Multi-Page Structure with Access Control Integration
- **Public Pages**: Home, Blog, About, Pros, What We Do, Why Us, Contact, FAQ, Terms, Referral, Trust, Sitemap, Features accessible without authentication
- **Subscriber Pages**: Dashboard, Subscribers, enhanced purchase system, and workflow download access requiring subscriber authentication
- **Admin Pages**: Admin, Gallery, and all administrative management tools requiring admin authentication
- **Dynamic Manual Pages**: All pages defined in the manual `pages[]` array respect access control based on their classification
- **App-Controlled Routes**: Special routes (`/broadcast`, `/remote`, `/live`) managed by whitelisted applications with admin oversight

### Live Production Deployment
- All recent features, bug fixes, and admin validation controls are now active and fully visible to users and admins
- Complete feature set is promoted from draft to live production status with proper access control implementation
- All administrative tools and validation systems are operational and accessible to authorized users
- Enhanced functionality is available for immediate use by all user types with appropriate permissions
- System operates with full feature parity as specified in the comprehensive feature set with access control enforcement
- All testing guides and validation systems are active for admin and subscriber use
- Complete multi-page structure with all navigation and functionality enabled with proper access restrictions
- All payment systems, referral tracking, and administrative controls are live and operational with authentication requirements
- **Enhanced sitemap management system is fully operational with manual page control, app-controlled routes, and access-based visibility**

### Enhanced Schema Validation and Manifest Logging System with Advanced Deduplication
- Enforce schema validation for all workflow and spec file uploads with comprehensive validation rules
- Robust parser that converts spec.md files to clean, normalized YAML format before ingestion
- Manifest logging for every workflow including version, checksum, and dependencies tracking
- Validation status display in admin Spec Conversion panel with detailed error reporting
- Retry options for failed validation and conversion processes
- Precise ingestion and validation instructions for AI pipeline to eliminate ambiguity
- Consistent processing and tracking for all spec files (.md, .ml, .yaml)
- Schema compliance verification with detailed validation reports
- Manifest integrity checking with checksum validation
- Dependency tracking and validation for workflow requirements
- Version control and compatibility checking for spec files
- Automated validation pipeline with error categorization and resolution guidance
- Admin interface for reviewing validation results and managing failed conversions
- Comprehensive logging of all validation attempts, successes, and failures
- Schema evolution tracking and backward compatibility management
- **Advanced Deduplication System**: Content-based deduplication of spec.md files using SHA-256 hash comparison to identify and remove redundant files
- **Canonical Spec Retention**: Maintain one canonical copy per workflow spec group while removing all duplicate versions
- **Reference Integrity Validation**: Ensure deduplication does not break associated spec.ml or .yaml links or manifest references
- **Post-Deduplication Schema Validation**: Re-run schema validation and manifest generation for retained canonical specs to ensure integrity
- **Deduplication Audit Logging**: Comprehensive logging of deduplication results showing removed duplicates, affected file paths, and storage reclaimed
- **Admin Deduplication Panel**: Display deduplication results in admin dashboard with audit logs and visual feedback
- **Pre-Deduplication Backup**: Automatic backup of all specs before deduplication to support restore if rollback is required
- **Workflow Catalog Consistency**: Maintain consistency of references in Workflow Catalog and Spec Conversion system post-deduplication
- **Content Hash Database**: SHA-256 content hashing system to identify duplicate specifications across different filenames
- **Deduplication Reporting**: Admin interface showing deduplication results, removed duplicates, and preserved unique specifications

### Optimized Node Modules Management System
- **Dependency Optimization**: Remove unnecessary build artifacts from node_modules folder
- **Version Updates**: Update all outdated dependencies to their latest stable versions with compatibility checking
- **Compression System**: Enable compression to reduce overall node_modules size while maintaining deterministic builds
- **Integrity Validation**: Conduct comprehensive integrity checks to preserve compatibility and performance across frontend and backend modules
- **Build Artifact Cleanup**: Automatic removal of unnecessary files, documentation, and test files from production dependencies
- **Dependency Tree Optimization**: Flatten dependency tree structure to reduce redundancy and improve loading performance
- **Compatibility Preservation**: Ensure all module updates maintain backward compatibility with existing codebase
- **Performance Monitoring**: Track performance metrics before and after optimization to validate improvements
- **Deterministic Build System**: Maintain consistent builds across different environments after compression and updates

### Enhanced Workflow Catalog with Public Access and Quantity Selection System
- **Public Catalog Access**: Browse and preview workflow cards and metadata without authentication
- **Authenticated Purchase Flow**: Quantity selection and purchase functionality requires subscriber authentication
- Each workflow card includes an image placeholder with matching .png images when available
- Quantity (Qty) field (Nat/uint) on each workflow-form card for item selection (subscriber access)
- Heart emoji/checkbox for workflow selection with click-to-increment functionality (subscriber access)
- Clicking heart/checkbox increments quantity by 1 automatically (subscriber access)
- Subscribers can edit quantity with enforced minimum of 5 per item
- Background quantity incrementing with real-time display updates
- Editable quantity fields shown before subscribing with validation
- Multiple item selection per session with persistent cart state
- Total order value validation with minimum $0.50 requirement
- Real-time price calculations as quantities change
- Cart persistence across page navigation and user sessions
- Clear visual feedback for selected items and quantities
- Quantity validation with error messages for invalid inputs
- Bulk selection and quantity management tools
- Session-based cart management with secure state handling

### Multi-Task Authentication Button System
- Single button handling Register/Login/Subscribe/Logout operations
- onHover triggers Register/Login functionality with visual feedback
- onClick triggers Subscribe operation with confirmation
- onKeyDown/doubleClick triggers Logout with security confirmation
- 3-5 second delay for user confirmation on all operations
- Clear visual states for each operation mode
- User confirmation dialogs for critical operations
- State management during operation delays
- Error handling for authentication failures
- Progress indicators during processing delays
- Secure session management across all operations
- Operation cancellation capability during delay periods

### Enhanced Stripe Configuration with Motoko-Compatible Webhook Management
- Stripe public and secret key configuration with secure storage (admin access)
- Motoko-compatible webhook handling without relying on `/api/webhook` endpoints
- Backend webhook processing using Motoko HTTP request handlers and callback functions
- Webhook key configuration with secure masking (admin access)
- All configuration values saved directly to .env file
- Secure configuration panel with masked display for sensitive data (admin access)
- Automatic cleanup of old configuration values after updates
- Configuration validation before saving with error handling
- One-time setup persistence across system updates
- Admin-only access to configuration management
- Secure key handling with toggle visibility for verification
- Configuration backup and restore capabilities
- Motoko-based webhook URL validation and testing functionality

### System Webhook Configuration Tab
- Dedicated System > Webhook tab in admin interface (admin access)
- Text fields for webhook keys with secure input handling
- Integration with Motoko-compatible webhook configuration
- All webhook values saved to .env with encryption
- Secure masking of sensitive webhook data
- Cleanup of old webhook values after updates
- Webhook key validation and format checking
- Admin confirmation for webhook configuration changes
- Motoko-based webhook testing and verification tools
- Configuration persistence across system updates

### Multi-Payment Method Integration
- Stripe payment processing with enhanced configuration (subscriber access)
- UPI QR code payment display with secoin@uboi UPI ID (subscriber access)
- gPay/UPI integration with +919620058644 phone number (subscriber access)
- PayPal subscription button integration with provided code (subscriber access)
- Payment method selection interface with clear options
- Multi-currency support where applicable
- Payment confirmation across all methods
- Alternative payment method validation
- Seamless payment flow switching between methods
- Payment method preference persistence

### Enhanced Features Report with Admin Validation
- **Public Feature Display**: Feature comparison tools and showcase accessible to all users
- **Admin Validation System**: Admin validation checkbox always enabled and selectable (admin access)
- Dual validation system: AI auto-verification and admin manual validation
- Feature leaderboard with admin promotion capabilities (admin access)
- Binary/chain comparison system for democratic feature validation
- Feature checklist with multi-select validation options
- Admin controls for feature promotion and verification (admin access)
- Clear validation status display for all features
- Persistent admin validation selections across navigation
- Feature implementation tracking with comprehensive reporting

### Enhanced VIBGYOR Theme System
- VIBGYOR (rainbow) theme toggle with light and dark mode support
- Theme toggle positioned next to menu button with clear visual indicator
- User theme preference persistence across sessions
- Smooth theme transition animations with visual feedback
- Light mode and dark mode variants for VIBGYOR theme
- Theme selection restoration on page load
- Theme preference storage in user profile
- Comprehensive theme switching with immediate visual updates

### Persistent Admin Test Guide System
- Comprehensive testing guide for admins and subscribers (admin/subscriber access)
- Persistent admin selections and progress tracking
- Navigation without data loss during test flows
- Step-by-step walkthrough with progress saving
- Test completion tracking with validation results
- Admin test flow state management across pages
- Progress indicators and completion status
- Test result persistence and review capabilities
- Comprehensive testing checklist with saved progress
- Admin test data backup and restore functionality

### Enhanced Sitemap with Complete Page Structure and Manual Management
- **Public Sitemap Access**: Site navigation overview accessible to all users with appropriate access indicators
- All .tsx pages displayed as permalinks in tree-root structure with access level indicators
- Admin-only pages marked with lock icons for authenticated users
- **Priority Pages Section**: Dedicated section displaying manual pages from the `pages[]` array with access indicators
- **Runtime Route Indicators**: Visual markers for app-controlled routes (`/broadcast`, `/remote`, `/live`) with access permissions
- **Manual Page Management**: Admin interface for adding new pages to the manual array with validation (admin access)
- **System Preset Protection**: Prevention of deletion or modification of core system pages
- Complete site architecture visualization with enhanced manual page integration and access control
- Hierarchical page organization with clear navigation paths and permission indicators
- Search functionality within sitemap structure including manual pages with access filtering
- Page access level indicators for different user types
- Direct navigation links to all available pages including manual entries with proper access control
- Site structure export and documentation capabilities
- **Versioned Snapshots**: Audit trail of sitemap changes with rollback capabilities (admin access)

### Test Guide System
- Comprehensive test guide modal or page accessible to admins and subscribers (admin/subscriber access)
- Step-by-step walkthrough covering:
  1. Enhanced purchase flow testing with quantity selection, heart/checkbox mechanics, and minimum order validation
  2. Multi-payment method testing: Stripe, UPI QR code, gPay/UPI, and PayPal integration
  3. Multi-task authentication button functionality with hover/click/keydown operations
  4. Motoko-compatible webhook configuration and verification
  5. VIBGYOR theme toggle with light/dark mode functionality
  6. Admin validation system testing with persistent selections
  7. Schema validation and manifest logging system testing
  8. Spec.md to YAML conversion system testing and validation
  9. **Advanced deduplication system testing and validation**
  10. **Node modules optimization and integrity validation**
  11. **Deduplication panel functionality and audit log review**
  12. **Enhanced sitemap management system testing including manual page addition, app-controlled routes, and access validation**
  13. **Access control system testing for public, subscriber, and admin pages**
- Interactive guide with progress persistence and state management
- Test case validation with success/failure indicators
- Admin-specific testing procedures with saved progress
- Subscriber-focused testing with persistent state
- Clear confirmation messages and comprehensive error handling
- Test completion tracking with detailed reporting

### Contact Page Details
The Contact page must display the following genuine SECOINFI information (publicly accessible):
- CEO & Founder: DILEEP KUMAR D, CEO of SECOINFI
- Primary Email: dild26@gmail.com (for general inquiries & partnerships)
- Business Phone: +91-962-005-8644 (available during business hours)
- Website: www.seco.in.net (official company website)
- WhatsApp: +91-962-005-8644 (direct messaging support)
- Business Address: Sudha Enterprises, No. 157, V R VIHAR, VARADARAJ NAGAR, VIDYARANYAPUR PO, BANGALORE-560097 (with clickable map link to Google Maps)
- Payment Information section:
  - PayPal: newgoldenjewel@gmail.com (primary payment method)
  - UPI ID: secoin@uboi (Indian payments)
  - gPay/UPI Phone: +919620058644 (mobile payments)
  - ETH ID: 0x4a100E184ac1f17491Fbbcf549CeBfB676694eF7 (cryptocurrency payments)
- "Our Location" section with clickable map integration for directions
- Call-to-action: "Ready to Get Started? Contact us today to learn more about our property investment opportunities and how SECoin can help you achieve your investment goals."
- Prominent "Email Us" and "WhatsApp" action buttons
- Social media links section:
  - Facebook: https://facebook.com/dild26
  - LinkedIn: https://www.linkedin.com/in/dild26
  - Telegram: https://t.me/dilee
  - Discord: https://discord.com/users/dild26
  - Blog: https://dildiva.blogspot.com
  - Instagram: https://instagram.com/newgoldenjewel
  - Twitter/X: https://twitter.com/dil_sec
  - YouTube: https://m.youtube.com/@dileepkumard4484/videos

### Enhanced Admin Panel with Secure Configuration Management and Real-Time Evaluation Tools
- Administrative management tools with admin-only access
- User management: create, update, delete user accounts and credentials (admin access)
- Upload management: monitor and manage all file uploads (admin access)
- Download tracking: view and manage download statistics with UID, nonce, and UserID logging (admin access)
- System updates and upgrades management (admin access)
- Data migration tools and controls (admin access)
- Backup and restore functionality with automated catalog and referral data backup (admin access)
- Referral payout management and processing (admin access)
- Admin navigation links visible only to admin users
- Comprehensive administrative dashboard for system oversight (admin access)
- **Enhanced Sitemap Management Panel**: Admin interface for managing manual pages array, adding new pages with validation, and controlling app-controlled routes (admin access)
- **Manual Page Addition Form**: "+ Add Page" button and form for appending new slugs to the `pages[]` array with comprehensive validation (admin access)
- **App-Controlled Route Management**: Interface for managing whitelisted applications in `Secoinfi-Apps[]` list and approving app-controlled routes (admin access)
- **Sitemap Audit Dashboard**: Display of versioned sitemap snapshots, page hash tracking, and admin signature logs (admin access)
- Activity Log & Restore: Admin-only dashboard section that lists all backup snapshots, allows one-click restore, and provides visual diff of catalog changes for full transparency and resilience (admin access)
- Error Pattern Report: Admin-facing dashboard displaying all new features, fixes, and error patterns with checkboxes for auto-checked and admin-verified status (admin access)
- Feature Validation Controls: Admin tools to manually validate and promote features to the top of the Features/Fixture leaderboard using binary (auto/manual) system (admin access)
- Fixture Validation System: Admin interface to review AI auto-verified features and manually validate/promote them to the top of the leaderboard for streamlined UI and debugging before going live (admin access)
- Checkout Error Monitoring: Admin dashboard section displaying all checkout and payment errors with timestamps, user details, error types, and resolution status for comprehensive error tracking and learning (admin access)
- Secure Configuration Panel: Admin-only forms for secure entry and editing of configuration data (admin access)
- Configuration Management: After admin verification and saving, automatically forget/clear all submitted credentials from UI state and frontend memory (admin access)
- Secure Key Handling: Mask secret keys by default with toggle option for admin verification (admin access)
- Automatic Cleanup: Delete any old copies of configuration data after updates, ensuring only current values exist in .env (admin access)
- Configuration Validation: Validate all entered configuration values before saving with clear error messages (admin access)
- One-time Setup Persistence: Configuration persists across system updates and never prompts for re-entry unless explicitly reset by admin (admin access)
- Persistent Admin Input Saving: All admin selections, inputs, and progress are saved and restored across navigation (admin access)
- Real-Time Admin Evaluation Tools: Allow admin to review, re-verify, and test each implemented feature with status indicators (admin access)
- Feature Testing Interface: Admin tools to test individual features with real-time feedback and validation (admin access)
- Masked Stripe Key Display: Show masked Stripe secret key in admin panel with toggle visibility for verification (admin access)
- Payment Method Status Integration: Display status of all payment methods (Stripe, UPI, PayPal) in admin panel (admin access)
- Multi-Payment Processing Validation: Ensure all payment modules/scripts are included and tested for robust processing (admin access)
- Modular System Architecture: All changes are modular, persistent, and sustainable with robust error handling (admin access)
- Clear User/Admin Feedback: Comprehensive feedback system for every step of admin operations (admin access)
- Enhanced Spec Conversion Panel: Admin interface displaying schema validation status, manifest logs, conversion results, and retry options for all spec files (admin access)
- **Advanced Deduplication Management Panel**: Admin interface for managing spec.md file deduplication with detailed reports on removed duplicates, preserved canonical specifications, and storage reclaimed (admin access)
- **Deduplication Audit Dashboard**: Display comprehensive deduplication results, affected file paths, reference integrity validation, and post-deduplication schema validation status (admin access)
- **Pre-Deduplication Backup Management**: Admin tools for managing automatic backups created before deduplication operations with restore capabilities (admin access)
- **Node Modules Optimization Panel**: Admin tools for monitoring dependency updates, compression status, and integrity validation results (admin access)

### Gallery Page
- Admin-only page for managing unmatched uploaded images (admin access)
- Display all uploaded .png files that don't match any workflow filenames
- Image placeholder management for future workflow assignments
- Bulk image operations: delete, rename, or assign to workflows
- Image preview functionality with metadata display
- Search and filter capabilities for image management
- Restricted access marked with lock icon in navigation

### Dashboard Page
- Analytics display with visual charts and graphs (subscriber/admin access)
- User statistics: registration trends, active users, engagement metrics
- Usage statistics: workflow downloads, popular categories, search trends
- Referral analytics: conversion rates, referral performance, reward tracking
- Referrer earnings display: Top 10: $0.1, Top 100: $1, Top 1000: $10
- 12-month income prediction table with real-time updates as new data is entered
- Website analytics: page views, traffic sources, user behavior
- Real-time data visualization with interactive elements
- Performance metrics and system health indicators
- **System Optimization Metrics**: Display node modules compression ratios, dependency update status, and performance improvements
- **Advanced Deduplication Statistics**: Show spec.md file deduplication results, storage savings, processing efficiency gains, and canonical spec retention metrics
- **Sitemap Management Analytics**: Display manual page usage statistics, app-controlled route activity, and sitemap modification audit logs

### Enhanced Features Page with Auto-Validation System
- **Public Feature Showcase**: Feature comparison tools for different workflow functionalities accessible to all users
- Validation and verification system for workflow features (admin access for validation controls)
- Update and upgrade tracking for platform functionalities
- Fixtures-based testing and validation system
- Merkle root system integration for feature verification
- Modular system architecture highlights
- Resilient system features showcase
- Feature compatibility matrix and comparison tools
- PAYU fee structure display: Top 10: $1, Top 100: $10, Top 1000: $100
- Fixture section displaying implemented features with dual validation system:
  - First checkbox automatically selected for each new feature (AI-verified)
  - Second checkbox (Admin validation) always enabled and selectable (admin access)
  - Clear fixture status display showing both AI and admin validation states
- Feature leaderboard with admin promotion capabilities (admin access)
- Auto-validation system: new features automatically get first checkbox selected (AI-verified)
- Admin validation system: admins can always select second checkbox for full validation (admin access)
- Feature promotion logic: admin-validated features promoted to top of leaderboard (admin access)
- Clear confirmation messages for validation actions
- Robust error handling for validation processes
- Feature checklist table with multi-select validation options
- Report table showing incremental feature list with clear summary of implemented functionalities
- Binary/chain comparison system for democratic feature validation with admin promotion capabilities (admin access)
- Auto-fill checkboxes for critical features under appropriate topics/subjects
- Highlights best functionalities for resilient, democratic, scalable, sustainable, and futuristic website

### Subscribers Page
- Subscriber management and information display (subscriber/admin access)
- PAYU fee structure prominently displayed: Top 10: $1, Top 100: $10, Top 1000: $100
- Subscription benefits and access levels
- Payment history and billing information
- Account management tools for subscribers

### Referral Page
- **Public Referral Information**: Decentralized referral tracking system with campaign statistics accessible to all users
- Referrer earnings display: Top 10: $0.1, Top 100: $1, Top 1000: $10
- 12-month income prediction table with real-time updates as new data is entered
- Multiple scalable referral banners with Merkle root-based UID/perm links
- Merkle root-based UID/Unique ID system for referral tracking
- Permalink generation for each referrer auto-assigned to subscribers
- Referral banner management and customization tools
- Campaign performance metrics and analytics

### Company Information Integration
- Replace all placeholder or demo contact and company information with real SECOINFI details
- Use genuine company information including CEO name, email, phone, website, WhatsApp, business address
- Include real payment information (PayPal, UPI, gPay/UPI, ETH addresses)
- Display authentic social media links
- Ensure consistency across all pages that reference company details
- Prominently affirm in the UI that real company details are being used

### Navigation System with Access Control Integration
- Robust, searchable menu system with real-time search filtering
- Browse and filter workflows by title, category, tags, and access type
- Mobile-first responsive navigation with collapsible menu
- Search functionality across all workflow metadata
- Real-time search filtering for both main and admin navigation menus
- **Access-Based Navigation**: Admin-only navigation links (Admin, Dashboard, and Gallery) hidden from non-admin users and marked with lock icons when visible
- **Public Navigation**: All public pages visible and searchable for unauthenticated users
- **Subscriber Navigation**: Subscriber-specific pages visible only to authenticated subscribers
- Dynamic menu visibility based on user permissions and authentication status
- All pages including Admin, Dashboard, Features, Subscribers, and Gallery are searchable and visible in the menu system with appropriate access controls
- Lock icons displayed next to Admin, Dashboard, and Gallery pages in navigation to indicate restricted access
- **Enhanced navigation integration with manual pages from the `pages[]` array** with access control enforcement
- **Dynamic route handling for app-controlled routes with proper access validation**
- **Unauthorized Access Messaging**: Proper fallback messaging for unauthorized attempts on restricted areas

### Theme System
- VIBGYOR (rainbow) theme toggle positioned next to the menu button/icon
- Allow users to switch between the current navy/white/violet theme and the VIBGYOR rainbow theme
- Enhanced VIBGYOR theme with both light and dark mode variants
- Theme preference persistence across user sessions and page navigation
- Smooth theme transition animations with immediate visual feedback
- Fully functional theme toggle with comprehensive mode switching
- Theme selection restoration on application load
- User theme preference storage and management

### Enhanced File Upload System with Auto-Save and Error Recovery
- Support for true multi-file upload of 3000+ .json, .md, and .png files simultaneously (admin access)
- Multi-file upload dialog clearly indicates support for .png files alongside .json and .md files
- Intelligent filename matching for .png files with workflow names (ignoring case, spaces, dashes, underscores, plus signs, and other extra characters)
- "Process Files" button positioned above the selected files list in the multi-file upload dialog
- Auto-save feature that automatically saves each successfully parsed form from uploaded .json files into the Workflow Catalog
- Advanced JSON parser with error recovery capabilities to handle common JSON errors (unterminated strings, unexpected tokens, malformed syntax)
- Skip and log any files that fail parsing while continuing to process remaining files
- Learning error handler that records new parsing errors, suggests fixes, and updates parser logic to prevent repetitive issues
- After successful processing, dynamically change the "Process Files" button to a "Save All Forms" button
- "Save All Forms" button allows users to save each parsed and processed file as workflow forms/templates for further filling and submission
- Intelligent file matching by base name across different extensions including .png image matching
- Unmatched .png files automatically moved to admin-only Gallery page as placeholders
- Bulk upload support for .zip files with streaming file processing
- Upload progress display with real-time status updates
- SHA-256 hashing integration for file integrity and deduplication
- Duplicate file prevention through hash comparison
- Batch processing capabilities for large file sets
- Proactive error handling with error logging and learning system
- Continue processing remaining files when individual file parsing errors occur

### Enhanced Spec.md to YAML Conversion System with Advanced Deduplication and Schema Validation
- Automatic detection of spec.md files during upload or processing (admin access)
- Robust parser that converts spec.md files to clean, normalized YAML format before ingestion
- Schema validation enforcement for all spec files with comprehensive validation rules
- Manifest logging for every workflow including version, checksum, and dependencies
- Check for existing spec.ml or .yaml files for each workflow before conversion
- Prevent duplicate conversions by verifying file existence
- Robust conversion process from spec.md to normalized YAML format
- Schema compliance verification with detailed validation reports
- Manifest integrity checking with checksum validation
- Dependency tracking and validation for workflow requirements
- Version control and compatibility checking for spec files
- Error logging and admin notifications for failed conversions and validations
- Admin interface to view conversion status, validation results, and trigger re-conversion (admin access)
- Workflow catalog display of spec.ml/.yaml file presence and validation status
- Manual conversion trigger for admins when needed (admin access)
- Conversion history tracking and status monitoring
- Error recovery and retry mechanisms for failed conversions
- Admin dashboard section for conversion management and monitoring (admin access)
- Precise ingestion and validation instructions for AI pipeline to eliminate ambiguity
- Consistent processing and tracking for all spec files (.md, .ml, .yaml)
- Automated validation pipeline with error categorization and resolution guidance
- Comprehensive logging of all validation attempts, successes, and failures
- Schema evolution tracking and backward compatibility management
- **Advanced Content-Based Deduplication**: Identify and remove duplicate spec.md files using SHA-256 content hashing while preserving canonical copies (admin access)
- **Canonical Spec Group Management**: Maintain one canonical copy per workflow spec group and remove all redundant versions
- **Reference Integrity Protection**: Validate that deduplication does not break associated spec.ml or .yaml links or manifest references
- **Post-Deduplication Validation**: Re-run schema validation and manifest generation for retained canonical specs to ensure integrity
- **Comprehensive Deduplication Audit**: Log deduplication results showing removed duplicates, affected file paths, and storage reclaimed
- **Admin Deduplication Dashboard**: Display deduplication results in admin panel with audit logs and visual feedback (admin access)
- **Automatic Pre-Deduplication Backup**: Create backups of all specs before deduplication to support restore if rollback is required
- **System Consistency Maintenance**: Ensure consistency of references in Workflow Catalog and Spec Conversion system post-deduplication

### Enhanced Workflow Catalog with Image Support and Access Control
- **Public Catalog Browsing**: Browse and preview workflow cards and metadata without authentication
- **Authenticated Features**: Quantity selection, cart management, and purchase functionality requires subscriber authentication
- Each workflow card includes an image placeholder
- Display matching .png images when available using intelligent filename matching
- Filename matching ignores case and extra characters (spaces, dashes, underscores, plus signs, etc.)
- Example: "Create 124.json" matches with "Create_124.png", "create-124.PNG", "Create+124.png"
- Default placeholder image shown when no matching .png file is found
- Image optimization and responsive display within workflow cards
- Searchable catalog with keyword search functionality
- Filter workflows by categories, tags, access type, and trigger type
- Display enhanced workflow cards with spec.md metadata and images
- Display spec.ml/.yaml file availability indicators and validation status on workflow cards
- Fully functional pagination system with optimized lazy-loading for large catalog browsing
- Complete pagination controls including First, Last, Next, Previous, and numbered page buttons that are fully responsive to user clicks
- Custom page number input field allowing users to jump directly to any valid page number within the catalog range
- Efficient pagination that eliminates redundant rendering and data fetching
- Dynamic UI updates as users navigate through pages or use custom page queries
- Seamless integration between pagination controls and lazy-loading features
- Pre-rendered and cached workflow metadata for CDN-style performance

### File Processing and Display System
- After processing, immediately display all processed files in a list with filenames shown with first character capitalized (admin access)
- All parsed forms and their previews are immediately listed and visible with public access to previews for all users (temporarily lifted restrictions for error handling and debugging)
- Parse and display all fields, values, formats, and units from processed .json files as complete form templates
- Include all formats, units, and nested data in form previews without skipping any data
- Ensure comprehensive parsing that captures every field and value from the .json files
- Form previews visible to all users during error handling and debugging phase
- "Subscribe to Publish" button functionality for subscribers to use, customize, and fill out forms (subscriber access)
- Robust error handling: log parsing errors, skip problematic files, continue processing remaining files
- Learning system that improves future parsing and proactively prevents similar issues with deterministic certainty

### Dynamic Form Generation System
- Recursive form generation with intelligent field type inference
- Tree structure support for nested and recursive fields
- Dynamic form creation based on file content and metadata
- Intelligent field type detection optimized for .mo code generation
- Template-based form generation with customizable field types

### Template Management System
- Filename-based template naming with first character capitalized
- Default category assignment as "Automation" when not specified (changed from "Legal")
- Template parsing status tracking and completion monitoring
- Enhanced field type inference for template optimization
- Batch template generation for matched file sets (3000+ files)
- Template versioning and update tracking
- Save processed files as workflow forms/templates for subscriber use (subscriber access)

### Workflow Management
- Upload n8n workflow .json files through a web interface (admin access)
- Upload spec.md files for enhanced workflow documentation with schema validation (admin access)
- Upload .png files for workflow card images with intelligent filename matching (admin access)
- Parse uploaded files to extract metadata including:
  - Title, category, description, tags, trigger type
  - From spec.md: inputs, outputs, API keys, use-cases, license information
- Store workflow files and metadata persistently in the backend
- Support for workflow versioning and updates
- Enhanced workflow cards with structured metadata display and image support
- Schema validation and manifest logging for all uploaded spec files

### Enhanced Workflow Preview System with Access Control
- **Public Users**: Only workflow-form view is displayed (no access to full JSON code)
- **Admins and Subscribers**: Both full JSON code view and web-form view are available
- Syntax-highlighted JSON viewer for authorized users only (Admins and Subscribers)
- Enhanced metadata display including spec.md extracted information and validation status
- Secure web-form view for each parsed .json file allowing users to view forms
- Public form previews visible to all users including non-subscribers
- "Download code" button for 1-Min Automation setup, visible only to Admins and Subscribers with access control (admin/subscriber access)
- Form filling and submission restricted to Admins and Subscribers only (admin/subscriber access)
- Download logging with UID, nonce, and UserID tracking for all download events
- No download access without purchase for non-subscribers

### Fixed Workflow Item Pricing System
- Enforced minimum price of $0.10 displayed in two-digit format ($0.10) for all workflow items
- Backend validation ensures no workflow can have a price below $0.10, with automatic correction if needed
- Frontend always displays prices formatted to two decimal places (e.g., $0.10, $1.50, $10.00)
- User-set Nat/uint multiplier value for subscribers to determine final price (subscriber access)
- Dynamic price increases: for each workflow-form, after every 10 units ordered, increase its price by $0.10 automatically
- All pricing calculations use integer math (Nat/uint) to avoid fraction or rounding errors
- Comprehensive math validation with min/max value limits enforcement and safe conversions
- Prevention of fractional values in pricing calculations with robust type checking
- Safe integer math operations to avoid division and conversion errors with overflow protection
- Clear error messages for invalid input or mathematical errors
- Real-time price updates in UI when multiplier values change
- Price history tracking for each workflow item
- Automatic price increment processing when order thresholds (10x multiples) are reached
- Overflow protection and boundary checking for all mathematical operations

### Enhanced Purchase System with Fixed Checkout Flow and Access Control
- **Subscriber-Only Purchase Access**: "Purchase Now" button and checkout functionality requires subscriber authentication
- "Purchase Now" button creates proper Stripe checkout sessions with comprehensive validation of all required parameters (subscriber access)
- Fixed checkout flow ensures clicking the Checkout button always routes to a valid payment page and never shows a blank "Not Found" error
- Robust checkout routing with proper error handling and fallback mechanisms
- Pre-checkout validation ensures no $0.00 or invalid prices are ever sent to Stripe
- Minimum purchase total requirement of $0.50 with clear validation and user feedback
- Enhanced quantity editing functionality with real-time price calculations (subscriber access)
- Heart/checkbox selection mechanics for workflow selection with quantity increment (subscriber access)
- Multiple item selection per session with persistent cart management (subscriber access)
- Quantity validation with minimum 5 per item for subscribers
- Background quantity incrementing with visual feedback
- Comprehensive error handling for payment processing including network failures, invalid parameters, Stripe API errors, and authentication issues
- Robust fallback logic to catch and display any unforeseen errors during the checkout process
- Proper handling of success and failure states with clear user feedback and guidance
- Integration with workflow item pricing system for accurate payment processing with mandatory price validation
- Validation of all payment parameters before creating checkout sessions with detailed error logging
- Secure handling of customer data and payment information
- Retry logic for failed payment attempts with exponential backoff and user notification
- Clear error messages and recovery options for users with actionable guidance
- Payment confirmation and receipt generation
- Integration with user account and purchase history tracking
- Auto-recovery mechanisms where possible with user guidance for manual intervention when needed
- Comprehensive checkout error logging for admin review and learning with error pattern analysis
- Full purchase flow testing for both admin and subscriber roles to ensure error-free operation
- Valid Stripe checkout session URL generation and navigation for authenticated users
- Session creation validation before redirect attempts to prevent navigation to invalid URLs
- Mandatory validation that authenticated users always receive a non-empty, valid Stripe checkout session URL
- Backend must return a valid session URL for all authenticated purchase attempts
- Comprehensive error handling and logging for all checkout and session creation steps
- Clear user-facing error messages with detailed admin logging for troubleshooting
- Graceful error handling that maintains app stability and user experience
- Purchase flow testing included in comprehensive test guide

### Multi-Payment Method Integration with Access Control
- Stripe payment processing with secure configuration management (subscriber access)
- UPI QR code payment integration for Indian market with secoin@uboi UPI ID (subscriber access)
- gPay/UPI integration with +919620058644 phone number display (subscriber access)
- PayPal payment processing integration with provided subscription button code (subscriber access)
- Payment method selection interface with clear options and visual indicators
- All payment methods included in test guide walkthrough
- Payment method validation and error handling
- Multi-currency support where applicable
- Payment confirmation across all methods
- Alternative payment method preference persistence
- Seamless switching between payment methods during checkout

### Multi-Tasking Button System
- Login/subscribe/logout functionality with built-in delays
- Enhanced multi-operation button: Register/Login/Subscribe/Logout
- onHover triggers Register/Login with visual state indication
- onClick triggers Subscribe operation with confirmation dialog
- onKeyDown/doubleClick triggers Logout with security confirmation
- 3-5 second delay for user confirmation on all operations
- State management during operations with progress indicators
- Visual feedback during processing delays with clear status messages
- Clear user feedback for each operation state
- Error handling for authentication operations with recovery options
- Multi-tasking button functionality included in test guide
- Operation cancellation capability during delay periods
- Secure session management across all authentication operations

### Motoko-Compatible Webhook Configuration System
- Primary webhook URL configuration for payment processing using Motoko HTTP handlers (admin access)
- Secondary webhook URL for backup/redundancy with Motoko callback functions (admin access)
- Webhook key configuration with secure storage and masking (admin access)
- Admin configuration interface for webhook URLs and keys without `/api/webhook` dependencies (admin access)
- Motoko-based webhook testing and validation tools (admin access)
- Webhook configuration included in test guide
- Error handling for webhook failures with retry logic using Motoko-compatible methods
- Webhook status monitoring and reporting
- All webhook values saved securely to .env file
- Automatic cleanup of old webhook configuration after updates
- Backend webhook processing using Motoko HTTP request handlers instead of traditional API endpoints

### Robust Automatic Backup System
- Automatic backup of all provided and catalog data (including .env/config, workflows, forms, referrals, etc.) as image snapshots before any write/overwrite operation (admin access)
- Instant restore capability from backup to prevent data loss during updates, upgrades, or migrations (admin access)
- All incremental changes applied only after backup completion to ensure no existing data is ever lost or overwritten
- Comprehensive backup coverage including configuration files, workflow data, form templates, referral tracking data, and user information

### Secure Payment Configuration
- Stripe integration for payment processing with secure configuration management (admin access)
- Stripe secret key stored securely in environment configuration, never exposed in frontend or domain code except in the secure admin panel
- Stripe secret key masked/hashed in any admin UI or logs for security, with toggleable visibility for admin verification (admin access)
- One-time Stripe setup that persists across updates, upgrades, migrations, and server failures
- Allowed countries configuration set to: "AU,AT,BE,BR,BG,CA,HR,CY,CZ,DK,EE,FI,FR,DE,GI,GR,HK,HU,IE,IT,JP,LV,LI,LT,LU,MY,MT,MX,NL,NZ,NO,PL,PT,RO,SG,SK,SI,ES,SE,CH,TH,AE,GB,US"
- Secure deletion of any previous or duplicate copies of Stripe secret key from domain and storage after updates
- System "forgets" old keys after updates, never exposing them again
- Persistent and secure Stripe configuration that survives system changes
- Admin-only Stripe key management with confirmation dialogs and security warnings (admin access)
- Exclusive storage of Stripe keys only in the secure admin panel section

### Payment Integration with Access Control
- Visually highlighted subscription-based and pay-as-you-use models
- Support for monthly/yearly subscription access (subscriber access)
- One-time purchase for individual workflow access (subscriber access)
- PAYU (Pay As You Use) fee structure: Top 10: $1, Top 100: $10, Top 1000: $100
- Dynamic pricing and payment triggers based on PAYU structure and workflow item pricing
- Associate Stripe customer IDs with user accounts
- Handle payment success/failure states with comprehensive error recovery
- Attach UID, nonce, and UserID to all payment transactions
- Integration with fixed workflow item pricing system for accurate payment processing

### Referral System with Public Access
- **Public Referral Access**: Decentralized, blockchain-inspired referral tracking accessible to all users
- Merkle root-based system for mapping referrer/referral relationships with UID/Unique ID
- Campaign statistics dashboard
- Simulate on-chain logic within Internet Computer constraints
- Track referral conversions and rewards
- Referrer earnings: Top 10: $0.1, Top 100: $1, Top 1000: $10
- Multiple scalable referral banners with Merkle root-based UID/perm links
- Permalink generation for referrers auto-assigned to subscribers
- Attach UID, nonce, and UserID to all referral events for tamper-proof tracking

### Trust Verification with Public Access
- **Public Trust Access**: Proof-of-Trust section with ZKProof/SigVerify simulation accessible to all users
- Allow users to submit cryptographic proof of workflow usage
- Verify referral claims through simulated ZK verification
- Display verification status and trust scores
- Simulate ZK verification UI and logic

### Performance Optimization
- Pre-render and cache workflow metadata
- localStorage/IndexedDB for repeat visitor caching
- CDN-style performance optimization
- Fast loading and smooth user experience
- Optimized lazy-loading implementation for catalog pagination with efficient data fetching
- Elimination of redundant rendering and data requests during pagination navigation
- **Optimized Node Modules**: Compressed and optimized dependencies for faster loading and reduced bundle size
- **Deterministic Builds**: Consistent build outputs across different environments after optimization
- **Performance Monitoring**: Real-time tracking of performance improvements from optimization efforts

### User Interface with Access Control Integration
- Mobile-first responsive design using TailwindCSS
- Trendy, minimalist three-color wide-border theme: navy, white, and violet
- Enhanced VIBGYOR rainbow theme option with light and dark mode variants
- Avoid large background images
- Clean, intuitive navigation and search interface with access control integration
- English language content throughout
- **Access Level Indicators**: Lock icons displayed next to admin-only pages in navigation and sitemap
- **Public Interface**: Clean, accessible interface for public pages without authentication barriers
- **Authenticated Interface**: Enhanced functionality and features for authenticated users
- **Role-Based UI**: Interface adapts based on user role (public, subscriber, admin) with appropriate feature visibility

## Backend Data Storage
The backend must persistently store:
- **Access Control Data**:
  - User authentication status and session management
  - User role assignments (public, subscriber, admin)
  - Page access permissions and restrictions
  - Authentication tokens and session data
  - Access attempt logs and unauthorized access tracking
  - Role-based feature access controls
  - Public page accessibility configurations
  - Protected route definitions and access requirements
- **Enhanced Sitemap Management Data**:
  - Manual pages array `pages[]` containing predefined entries with access level classifications
  - Whitelisted applications list `Secoinfi-Apps[]` for app-controlled routes management
  - Page hash tracking with Merkle root truncated to last 4 characters for audit purposes
  - Timestamp records for all sitemap modifications and page additions
  - Admin signature logs for comprehensive audit tracking of sitemap changes
  - Versioned sitemap snapshots for rollback capabilities and audit safety
  - Access validation records for all sitemap modification operations
  - App-controlled route approval status and management logs
  - Manual page validation records including slug validation results
  - System preset protection flags to prevent deletion of core pages
  - Public page accessibility flags and access control configurations
- Workflow files (n8n JSON format)
- Spec.md files and extracted metadata
- Spec.ml and .yaml files generated from spec.md conversion
- Schema validation results and compliance status for all spec files
- Manifest logs including version, checksum, and dependencies for each workflow
- Validation error logs and resolution tracking
- Schema evolution data and backward compatibility records
- Normalized YAML format data converted from spec.md files
- Dependency tracking and validation records for workflow requirements
- Version control and compatibility data for spec files
- Automated validation pipeline logs with error categorization
- Conversion status and history for spec.md to YAML transformations
- Conversion error logs and admin notifications
- File existence tracking for spec.ml/.yaml files per workflow
- Conversion retry attempts and success/failure records
- **Advanced Deduplication Records**: SHA-256 content hashes for all spec.md files, duplicate detection results, and canonical spec preservation logs
- **Deduplication Audit Trail**: Comprehensive logs of all deduplication operations, removed duplicates, affected file paths, and storage reclaimed
- **Content Hash Database**: SHA-256 hashes for all spec files to enable efficient duplicate detection across different filenames
- **Canonical Spec Registry**: Mapping of unique specifications to their canonical versions after deduplication
- **Reference Integrity Validation Data**: Records of spec.ml/.yaml link validation and manifest reference integrity checks post-deduplication
- **Pre-Deduplication Backup Metadata**: Backup snapshots created before deduplication operations with restore capability information
- **Post-Deduplication Validation Results**: Schema validation and manifest generation results for retained canonical specs
- **Workflow Catalog Consistency Records**: Reference consistency tracking in Workflow Catalog and Spec Conversion system post-deduplication
- **Node Modules Optimization Data**: Dependency update logs, compression ratios, and performance metrics
- **Build Artifact Cleanup Logs**: Records of removed unnecessary files and optimization results
- **Dependency Tree Optimization Records**: Flattened dependency structures and redundancy reduction data
- **Integrity Validation Results**: Compatibility checks and performance validation data after optimization
- **Deterministic Build Metadata**: Build consistency tracking and environment validation data
- Uploaded .png image files with filename matching data
- Image-to-workflow mapping relationships based on intelligent filename matching
- Unmatched .png files for admin Gallery page management
- Enhanced workflow metadata (title, category, description, tags, trigger type, inputs, outputs, API keys, use-cases, license)
- User accounts and associated Stripe customer IDs with admin role permissions and access control data
- Purchase records and access permissions with role-based restrictions
- Pricing information for each workflow including PAYU fee structure and workflow item pricing
- Fixed workflow item pricing data: enforced minimum base price ($0.10), user multipliers, automatic increment history, total units ordered
- Enhanced workflow catalog with quantity selection data: Qty fields (Nat/uint), heart/checkbox selections, cart state (subscriber access)
- Multi-item selection session data with persistent cart management (subscriber access)
- Quantity validation records and minimum order requirements
- Background quantity increment tracking with real-time updates
- Cart persistence data across user sessions and page navigation
- Price calculation history and mathematical operation logs with comprehensive overflow protection and validation
- Comprehensive math validation records for pricing calculations including type checking and boundary validation
- User accounts and associated Stripe customer IDs with admin role permissions and access control integration
- Purchase records and access permissions with detailed error handling logs and role-based restrictions
- Referral tracking data and Merkle root structures with UID/Unique ID system (public access)
- Trust verification records and proof submissions (public access)
- Static page content for all multi-page structure with access control classifications
- FAQ entries and terms of service content (public access)
- Real SECOINFI company information and contact details for the Contact page including gPay/UPI phone number (public access)
- Social media links and payment information (public access)
- File upload records with SHA-256 hashes for deduplication (admin access)
- Template parsing status and completion monitoring
- Batch processing job status and progress
- Administrative action logs and audit trails (admin access)
- Analytics data for dashboard display (subscriber/admin access)
- Feature validation and verification records with dual checkbox status (AI-verified and admin-verified)
- Admin validation checkbox state (always enabled and selectable) (admin access)
- System backup and restore metadata (admin access)
- Processed file data with complete field and value information from .json files
- Form template data with all nested structures, formats, and units
- Comprehensive error logs and learning data for proactive error handling and parsing improvement
- JSON parsing error patterns and recovery strategies
- Learning error handler data with suggested fixes and parser logic updates
- User theme preferences including VIBGYOR light/dark mode selections
- Theme preference persistence data across sessions and navigation
- Saved workflow forms/templates for subscriber customization and filling (subscriber access)
- Auto-saved parsed forms in the Workflow Catalog
- Feature implementation tracking data for report table generation with dual validation status
- Fixture section data with implemented feature checkboxes and dual validation status
- Referrer earnings data and 12-month projection calculations (public access)
- Referral banner data with Merkle root-based UID/perm links and permalinks (public access)
- UID, Nonce, and UserID for all transactions, workflow downloads, and referral events
- Robust automated backup system for all unique data including catalog and referral details (admin access)
- Download logs with access control tracking for Admins and Subscribers
- Feature checklist data with multi-select validation options
- Binary/chain comparison data for democratic feature validation
- Feature leaderboard data with admin promotion tracking (admin access)
- Admin validation records for feature promotion and verification (admin access)
- Error pattern reports with auto-checked and admin-verified status tracking (admin access)
- Secure configuration data including Stripe keys and webhook URLs stored in .env file (admin access)
- Enhanced webhook configuration: Motoko-compatible webhook URLs and webhook keys (admin access)
- System webhook tab configuration data with secure storage (admin access)
- Configuration validation and update history
- Webhook configuration and status monitoring data
- Multi-payment method configuration and processing logs including UPI QR, gPay/UPI, PayPal (subscriber access)
- Test guide completion tracking and validation results (admin/subscriber access)
- Persistent admin test guide progress and selections across navigation (admin access)
- Admin test flow state management data (admin access)
- Auto-validation system data for new features with AI-verified status
- Admin manual validation records for feature promotion (admin access)
- Comprehensive testing data for purchase flow, payment methods, and system functionality
- Backup snapshots with timestamps and metadata for Activity Log & Restore functionality (admin access)
- Catalog change history and visual diff data for transparency (admin access)
- Optimized pagination state and lazy-loading cache data for efficient catalog browsing
- Page range validation data for custom page number input functionality
- AI auto-verification data for features and fixture validation system records
- Admin manual validation records for promoted features in the leaderboard system (admin access)
- Stripe checkout session data and payment processing logs with comprehensive error tracking (subscriber access)
- Payment retry attempt logs and recovery state information
- Purchase confirmation and receipt generation data
- Comprehensive checkout error logs with timestamps, user details, error types, and resolution status for admin review and learning (admin access)
- Error pattern analysis data for checkout and payment processes (admin access)
- Auto-recovery attempt logs and success/failure tracking for payment errors
- Live production deployment status and feature activation records
- Multi-task authentication button operation logs and state management data
- Enhanced Stripe configuration with Motoko-compatible webhook management data (admin access)
- Sitemap structure data with complete .tsx page listings in tree-root format with access control integration
- Persistent admin input and selection data across all admin interfaces (admin access)
- All admin progress and configuration data with navigation persistence (admin access)
- Fixed checkout flow routing data and error handling logs
- Real-time admin evaluation tool data with feature testing results and status indicators (admin access)
- Masked Stripe key display preferences and toggle visibility settings (admin access)
- Payment method status integration data for all payment processors (admin access)
- Multi-payment processing validation logs and test results (admin access)
- Modular system architecture tracking and sustainability metrics
- User/admin feedback system data with comprehensive operation logging
- **Access Control Audit Logs**: Comprehensive logging of all access attempts, successful authentications, and unauthorized access attempts with user details and timestamps

## Backend Operations
- **Access Control Operations**:
  - User authentication and session management
  - Role-based access validation for all pages and features
  - Public page access without authentication requirements
  - Subscriber authentication and permission validation
  - Admin authentication and elevated permission validation
  - Route protection enforcement with proper access control
  - Unauthorized access attempt logging and response handling
  - Session timeout and security management
  - Access level determination and permission checking
  - Role assignment and management operations
  - Public content serving without authentication barriers
  - Protected content access validation and enforcement
- **Enhanced Sitemap Management Operations**:
  - Manual pages array management with CRUD operations for the `pages[]` array with access control integration
  - Page slug validation processing including lowercase enforcement, space removal, uniqueness checking, and reserved keyword protection
  - Admin access control validation for all sitemap modification operations
  - App-controlled route management for `/broadcast`, `/remote`, `/live` routes with whitelist validation and access control
  - Whitelisted application management in `Secoinfi-Apps[]` list with admin approval workflows
  - Sitemap resolver operations that merge autogenerated sitemap, manual pages array, and app-controlled routes with access level indicators
  - Page hash generation using Merkle root truncated to last 4 characters for audit tracking
  - Timestamp recording for all sitemap modifications and page additions
  - Admin signature logging for comprehensive audit tracking of sitemap changes
  - Versioned sitemap snapshot creation and management for rollback capabilities
  - System preset protection enforcement to prevent deletion or modification of core pages
  - Priority pages section generation and management for enhanced sitemap display with access control
  - Runtime route marking and validation for app-controlled routes with access permissions
  - Access validation processing for all sitemap-related operations
  - Public sitemap generation with appropriate access level indicators
- File upload and JSON/spec.md parsing with multi-file support (admin access)
- .png file upload processing with intelligent filename matching logic (admin access)
- Image-to-workflow mapping based on filename similarity (ignoring case, spaces, dashes, underscores, plus signs, etc.)
- Unmatched image management for admin Gallery page (admin access)
- Enhanced spec.md to YAML conversion processing with schema validation and manifest logging (admin access)
- Automatic detection of spec.md files during upload or workflow processing
- Robust parser that converts spec.md files to clean, normalized YAML format before ingestion
- Schema validation enforcement for all spec files with comprehensive validation rules
- Manifest logging for every workflow including version, checksum, and dependencies
- Schema compliance verification with detailed validation reports
- Manifest integrity checking with checksum validation
- Dependency tracking and validation for workflow requirements
- Version control and compatibility checking for spec files
- Automated validation pipeline with error categorization and resolution guidance
- Check for existing spec.ml or .yaml files before initiating conversion
- Robust conversion from spec.md to normalized YAML format with error handling
- Conversion error logging and admin notification system (admin access)
- Conversion status tracking and history maintenance
- Manual re-conversion trigger processing for admin requests (admin access)
- Workflow catalog updates to reflect spec.ml/.yaml file availability and validation status
- Precise ingestion and validation instructions for AI pipeline to eliminate ambiguity
- Consistent processing and tracking for all spec files (.md, .ml, .yaml)
- Comprehensive logging of all validation attempts, successes, and failures
- Schema evolution tracking and backward compatibility management
- **Advanced Spec.md Deduplication Processing**: Content-based duplicate detection using SHA-256 hashing for spec.md files to identify and remove redundant files (admin access)
- **Canonical Spec Group Management**: Process to maintain one canonical copy per workflow spec group while removing all duplicate versions
- **Reference Integrity Validation Operations**: Validate that deduplication does not break associated spec.ml or .yaml links or manifest references
- **Post-Deduplication Schema Validation**: Re-run schema validation and manifest generation for retained canonical specs to ensure integrity
- **Comprehensive Deduplication Audit Operations**: Log deduplication results showing removed duplicates, affected file paths, and storage reclaimed (admin access)
- **Pre-Deduplication Backup Operations**: Automatic backup of all specs before deduplication to support restore if rollback is required (admin access)
- **Workflow Catalog Consistency Operations**: Maintain consistency of references in Workflow Catalog and Spec Conversion system post-deduplication
- **Content Hash Generation and Comparison**: Generate and store SHA-256 hashes for all spec.md files to enable efficient duplicate detection across different filenames
- **Deduplication Reporting Operations**: Generate comprehensive reports on deduplication results, removed duplicates, and preserved unique specifications (admin access)
- **Node Modules Optimization Operations**: Remove unnecessary build artifacts, update dependencies, and enable compression (admin access)
- **Dependency Update Processing**: Update all outdated dependencies to latest stable versions with compatibility validation (admin access)
- **Build Artifact Cleanup**: Automatic removal of unnecessary files, documentation, and test files from production dependencies
- **Compression System Operations**: Enable and manage compression to reduce node_modules size while maintaining deterministic builds
- **Integrity Validation Processing**: Comprehensive compatibility and performance checks after optimization
- **Dependency Tree Optimization**: Flatten dependency structures to reduce redundancy and improve performance
- **Performance Monitoring Operations**: Track and validate performance improvements from optimization efforts
- Advanced JSON parsing with error recovery for common JSON errors (unterminated strings, unexpected tokens, malformed syntax)
- Learning error handler that records parsing errors, suggests fixes, and updates parser logic
- Auto-save functionality for successfully parsed forms into the Workflow Catalog
- Skip and log files that fail parsing while continuing batch processing
- Metadata extraction and validation from multiple file types
- Search and filtering operations across enhanced metadata with access control integration
- User account management with admin role handling and access control integration
- Enhanced workflow catalog operations with quantity selection system (subscriber access)
- Quantity (Qty) field management with Nat/uint validation (subscriber access)
- Heart/checkbox selection processing with click-to-increment functionality (subscriber access)
- Multi-item selection session management with persistent cart state (subscriber access)
- Quantity validation with minimum 5 per item for subscribers
- Background quantity incrementing with real-time updates
- Cart persistence across user sessions and page navigation
- Total order value validation with minimum $0.50 requirement
- Real-time price calculations as quantities change
- Secure configuration management: save Stripe keys and webhook URLs directly to .env file (admin access)
- Enhanced webhook configuration: Motoko-compatible webhook URLs and webhook keys (admin access)
- System webhook tab operations with secure storage and validation (admin access)
- Configuration validation and secure storage operations
- Automatic cleanup of old configuration data after updates
- Configuration masking and secure display for admin interface (admin access)
- Auto-forget functionality: clear submitted credentials from UI state after admin verification and saving (admin access)
- Motoko-compatible webhook configuration and validation operations without `/api/webhook` dependencies
- Multi-payment method processing: Stripe, UPI QR, gPay/UPI, PayPal (subscriber access)
- Multi-tasking authentication button operations: Register/Login/Subscribe/Logout with delays and state management
- Enhanced multi-operation button processing with hover/click/keydown event handling
- Operation confirmation and delay management with user feedback
- Test guide system operations: walkthrough tracking, validation, and completion monitoring (admin/subscriber access)
- Persistent admin test guide progress tracking across navigation (admin access)
- Admin test flow state management and data preservation (admin access)
- Payment processing integration with Stripe including PAYU fee calculations with dynamic pricing triggers (subscriber access)
- Fixed workflow item pricing calculations with enforced minimum $0.10 base price and robust integer math (Nat/uint) handling
- Comprehensive math validation for all pricing operations including type checking, boundary validation, and overflow protection
- Safe integer math operations for pricing calculations to avoid division/conversion errors and overflow
- Min/max value validation for user multiplier inputs with comprehensive boundary checking
- Automatic price increment processing when order thresholds (10x multiples) are reached
- Price history tracking and mathematical operation logging with overflow protection
- Enhanced Stripe checkout session creation with comprehensive parameter validation, pre-checkout price validation, and robust error handling (subscriber access)
- Fixed checkout flow processing to ensure valid payment page routing and prevent "Not Found" errors
- Checkout routing validation and error handling with proper fallback mechanisms
- Mandatory validation that no $0.00 or invalid prices are sent to Stripe with automatic correction
- Minimum purchase total validation ($0.50) with clear error handling
- Payment success/failure state handling with retry logic, user feedback, and auto-recovery mechanisms
- Purchase confirmation processing and receipt generation
- Access control for purchased workflows with admin permissions and role-based restrictions
- Content access control: public users see only workflow-form view, Admins and Subscribers see both full code and web-form view
- Referral tracking and reward calculation with payout processing (public access with subscriber benefits)
- Trust verification and proof validation simulation (public access)
- Content management for static pages including Contact page data with enhanced payment information (public access)
- Performance optimization through caching and pre-rendering
- Management and serving of real company information across all relevant pages (public access)
- Serving of Contact page with genuine SECOINFI details, social media links, and enhanced payment options (public access)
- Multi-file upload processing with intelligent file matching (admin access)
- SHA-256 hash generation and duplicate detection
- Zip file extraction and streaming processing
- Dynamic form generation and template creation
- Batch processing management for large file sets
- Analytics data collection and aggregation (subscriber/admin access)
- Administrative operations for system management (admin access)
- Feature validation and verification processing with dual checkbox management (AI-verified and admin-verified)
- Admin validation checkbox management (always enabled and selectable) (admin access)
- Auto-validation system: automatically select first checkbox for new features (AI-verified)
- Admin manual validation system: allow admin to always select second checkbox for full validation (admin access)
- Feature promotion and leaderboard management with admin controls (admin access)
- Error pattern report generation for admin dashboard (admin access)
- Backup and restore operations with automated catalog and referral data backup (admin access)
- Comprehensive .json file parsing with complete field and value extraction without skipping any data
- Form template generation with all nested data structures, formats, and units
- Robust error handling system: log parsing errors, skip problematic files, continue processing
- Learning system that analyzes errors and improves future parsing capabilities with deterministic certainty
- Theme preference management and persistence including VIBGYOR light/dark mode variants
- Enhanced theme system operations with comprehensive mode switching and preference storage
- Save processed files as workflow forms/templates for subscriber access and customization (subscriber access)
- Generate and maintain report table data with auto-selected checkboxes for implemented features
- Track and update feature implementation status for Fixture section display with dual validation tracking
- Manage incremental feature list with clear summary of implemented functionalities
- Calculate and track referrer earnings based on PAYU fee structure (public access with subscriber benefits)
- Generate 12-month income projections for referrers with real-time updates (public access)
- Manage referral banner creation with Merkle root-based UID/perm links (public access)
- Generate and maintain permalinks for referrer-subscriber assignments
- Implement UID, Nonce, and UserID tracking for all transactions, downloads, and referral events
- Maintain robust automated backup systems for catalog and referral data security (admin access)
- Auto-fill feature checkboxes in report tables under appropriate topics/subjects
- Access control enforcement for workflow downloads with logging (admin/subscriber access)
- Multi-select validation processing for feature checklists
- Binary/chain comparison processing for democratic feature validation with admin promotion capabilities (admin access)
- Default workflow type assignment as "Automation" before saving forms/workflows
- Automatic backup creation before any write/overwrite operations (admin access)
- Instant restore functionality from backup snapshots (admin access)
- Activity Log & Restore management with backup listing and one-click restore (admin access)
- Visual diff generation for catalog changes (admin access)
- Optimized pagination and lazy-loading support for workflow catalog with efficient data fetching
- Custom page number validation and range checking for direct page navigation
- Elimination of redundant data requests during pagination operations
- Dynamic catalog view updates for seamless user navigation experience
- Content filtering based on user authorization level for catalog display
- AI auto-verification processing for new features and functionalities including pricing and purchase system fixes
- Admin manual validation system for promoting AI auto-verified features to leaderboard top (admin access)
- Fixture validation system operations: streamline UI and debug entire app before going live (admin access)
- Robust mathematical operations with integer-only calculations and comprehensive error handling for all pricing logic
- Auto-verification of new pricing and purchase features as fixtures for admin validation and promotion
- Comprehensive checkout error logging with detailed error information, timestamps, user context, and error categorization (admin access)
- Error pattern analysis and learning for checkout and payment processes (admin access)
- Auto-recovery attempt processing for payment errors with fallback mechanisms
- Valid Stripe checkout session URL generation with mandatory validation before navigation (subscriber access)
- Session creation error handling with detailed logging and user guidance
- Full purchase flow validation for both admin and subscriber roles with comprehensive testing
- Fallback logic implementation for unforeseen checkout errors with user-friendly error display
- Mandatory backend validation that authenticated users always receive a non-empty, valid Stripe checkout session URL
- Comprehensive error handling and logging for all checkout and session creation steps with detailed admin reporting (admin access)
- Clear user-facing error messages with actionable guidance while maintaining detailed backend error logs
- Graceful error handling that preserves app stability and provides positive user experience during purchase flow issues
- Test guide operations: track user progress through testing procedures, validate test completion, and provide feedback (admin/subscriber access)
- Comprehensive testing validation for all system components including purchase flow, payment methods, and functionality
- Live production deployment operations: activate all features, enable admin controls, and make all functionality visible and operational with proper access control
- Feature promotion from draft to live status with full system activation and access control integration
- Production readiness validation and deployment confirmation
- Complete system activation with all administrative and user-facing features enabled with proper access restrictions
- Sitemap generation with complete .tsx page structure in tree-root format with access control integration
- Persistent admin data management across all interfaces and navigation (admin access)
- Admin input and selection persistence operations with comprehensive state management (admin access)
- Real-time admin evaluation tool operations: feature testing, validation, and status reporting (admin access)
- Feature testing interface operations with real-time feedback and validation (admin access)
- Masked Stripe key display operations with toggle visibility for admin verification (admin access)
- Payment method status integration operations for all payment processors (admin access)
- Multi-payment processing validation operations with comprehensive testing (admin access)
- Modular system architecture operations with sustainability and persistence tracking
- User/admin feedback system operations with comprehensive logging and response handling
- Motoko HTTP request handler operations for webhook processing without traditional API endpoint dependencies
- Backend webhook processing using Motoko callback functions instead of `/api/webhook` endpoints
- **Public Content Operations**: Serve all public pages and content without authentication requirements
- **Access Control Enforcement**: Validate user permissions for all protected operations and content access
- **Role-Based Feature Access**: Enable or restrict features based on user authentication status and role
- **Unauthorized Access Handling**: Process and respond to unauthorized access attempts with appropriate messaging and logging
