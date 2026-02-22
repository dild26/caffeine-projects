# E Contracts Management System

## Overview
A comprehensive contract management platform with advanced file processing, template engine, analytics, and blockchain integration capabilities. The system supports multi-format technical specifications with real-time updates and dual navigation interfaces.

## Core Features

### Technical Specification Management
- Primary format: YAML (.yaml) with automatic conversion to ML (.ml) format
- Fallback to Markdown format (spec.md) only if both YAML and ML are unavailable or fail to parse
- **Automatic specification synchronization with deduplication**: on every app update, upgrade, or migration, automatically copy current spec.md, optimize and deduplicate content, and convert to both .ml and .yaml files in parallel
- **Auto-generation feature**: in YAML spec editor section, add feature to auto-generate equivalent .ml and .yaml code from current spec.md or from edited .yaml, keeping all three formats in sync
- **Content optimization and deduplication**: remove redundant content, compress verbose sections, and ensure unique well-structured definitions across all specification formats
- **Automated deduplication pass**: SpecificationManager includes self-optimization that removes duplicate headings, identical text blocks, and repeated feature descriptions before saving
- **Backup and version tracking**: backup original versions before writing new deduplicated files for integrity and rollback capability
- **Synchronized updates**: maintain real-time synchronization between spec.md and .yaml counterparts with automatic conflict resolution
- Real-time specification updates that automatically reflect throughout UI and backend logic
- Admin-only manual editing interface with syntax highlighting
- Version history and change tracking for all specification updates
- **Robust processing**: ensure deduplication of repeated content and automatic triggering on all relevant backend operations (update, upgrade, migration)
- **Admin-only access**: edit or restore specifications with proper access control
- **Optimization logging**: write all deduplication and optimization activities to manifest for admin verification

### Dependency Management and Optimization
- **Automatic dependency updates**: update all node_modules dependencies to latest compatible stable versions
- **Production optimization**: implement tree-shaking, minification, and dependency pruning for reduced bundle size
- **Unused package compression**: automatically compress and remove unused packages post-installation
- **Build artifact cleanup**: clean up redundant files and build artifacts to reduce deployment footprint
- **Internet Computer compatibility verification**: safety mechanism to verify all new dependencies against IC environment before final build
- **Dependency optimization logging**: log all dependency updates, optimizations, and compatibility checks to manifest for admin review
- **Size reduction tracking**: monitor and report node_modules directory size reduction and optimization metrics

### Enhanced Sitemap System
- **Extended sitemap architecture**: maintain existing sitemap logic while adding parallel `pages[]` array for admin-priority routes
- **Admin-controlled page management**: `pages[]` contains unique, admin-priority routes (e.g., "about","admin","apps","angel-vc","blog","block","broadcast","compare","contact","dash","dex","e-com","faq","finance","fix","fixture","footstep","lang","leader","live","main","map","milestone","pages","payments","pros","rank","referral","remote","resource","routes","secure","sitemap","terms","trust","what","verifySig","when","where","who","why","ZKProof")
- **Strict admin access control**: only users with admin privileges can modify (append or remove) items in `pages[]`
- **Admin UI for page management**: new admin form under `/sitemap` and `/admin` pages for manually appending unique page slugs to `pages[]`
- **Input validation**: lowercase input validation, unique entry checking, and reserved keyword control
- **Manual page addition**: "+ Add Page" button with validation and uniqueness enforcement
- **Read-only system pages**: display existing entries with disabled edit/delete for system pages
- **Non-breaking extension**: existing sitemap logic remains unchanged to ensure compatibility
- **Controlled routes management**: `controlledRoutes` mapping for `/broadcast`, `/remote`, and `/live` pages delegated to Secoinfi-App with admin-only control
- **Runtime route delegation**: route shells exist in sitemap but content injection enabled only for whitelisted Secoinfi-Apps under admin control
- **Sitemap resolution priority**: merge existing sitemap (auto-generated) with manual pages and controlled apps in order: auto → pages[] → controlledRoutes
- **Audit trail**: manifest logging and access control checks for each action with immutability without admin affirmation
- **Versioning metadata**: optional timestamp and admin signature for any modifications
- **Order preservation**: maintain uniqueness and order preservation without auto-deletion or overwriting of existing sitemap nodes

### Navigation System
- **Compact dual navigation**: top navbar and bottom navbar with compact menu design
- **Complete page visibility**: ensure all pages (Dashboard, Features, Blog, About Us, Pros of e-Contracts, What We Do, Why Us, Contact Us, FAQ, Terms & Conditions, Referral, Proof of Trust, Sitemap, Templates, Upload, Analytics, Reports, Settings, Help) are visible in both main menu and Quick Links
- **Strict duplicate prevention**: enforce no duplicate page links across main menu and Quick Links
- Real-time search functionality across both navigation bars
- Admin-only link handling with role-based access control
- Toggleable sitemap menu accessible from navigation bars
- VIBGYOR (rainbow) theme toggle affecting entire application
- Responsive design for all screen sizes
- **Dynamic navigation updates**: automatically detect and insert missing pages/links into sitemap and navbars with search indexing
- **Navigation validation**: verify all pages are properly linked and accessible through all navigation methods
- **Public navigation filtering**: exclude Admin-only and Subscription-only pages from public view in sitemap and quick link menus
- **Consistent public access**: ensure public pages appear in headers, quick links, and footers for all users regardless of authentication status

### Business Information Management
- **Centralized business data storage**: store all business, contact, social, and payment information in backend stable variables
- **Global business information**: replace all placeholder or generic company data with authentic Sudha Enterprises information
- **Real-time synchronization**: ensure business information updates propagate across entire application
- **Contact information**: Company name (Sudha Enterprises), business address with clickable map link, phone, website, WhatsApp, email
- **Payment details**: UPI ID, ETH ID, PayPal contact information
- **Social media integration**: Facebook, LinkedIn, Telegram, Discord, Blogspot, Instagram, X (Twitter), YouTube links
- **CEO information**: DILEEP KUMAR D (CEO of SECOINFI)
- **Clickable links**: ensure all contact, social, and payment links are accurate and functional
- **Consistent display**: maintain uniform business information presentation across all pages and components

### Page Management System
- **Complete page structure**: Dashboard, Features, Blog, About Us, Pros of e-Contracts, What We Do, Why Us, Contact Us, FAQ, Terms & Conditions, Referral, Proof of Trust, Sitemap, Templates, Upload, Analytics, Reports, Settings, Help
- **Contact Us page enhancement**: display comprehensive Sudha Enterprises business information with clickable map, contact details, payment information, and social media links
- **Strict duplicate prevention**: ensure no duplicate pages exist in the system across all navigation areas
- **Full integration**: all pages integrated into sitemap, top menu, Quick Links, and bottom navigation bars
- **Search indexing**: each page indexed for search functionality across navigation bars
- **Access control compliance**: pages accessible according to role-based permissions (public or admin as appropriate)
- **Modern responsive layouts**: each page scaffolded with modern, responsive design matching app's design system
- **Placeholder content**: ready-to-expand structure with navigation links for future content development
- **English language content**: all page content in English throughout application
- **Navigation consistency**: ensure identical page availability across top menu, Quick Links, and bottom navbar

### Advanced File Upload System
- Support for 51+ files in single upload session
- Accepted formats: .json, .md, .txt, .zip files
- Chunked and streaming upload for large files
- SHA-256 hash-based deduplication with 32-byte length validation
- On hash collision, keep latest file and link to existing
- Robust error handling with detailed progress indicators and retry mechanism
- Real-time upload progress tracking and status updates
- Raw markdown storage without form parsing
- File sanitization: normalize (NFKC, LF), strip scripts from markdown, allow only headings, lists, links, emphasis
- **Enhanced file processing pipeline with strict enforcement**: .json files parsed exclusively for Tab 1 form fields, .md files injected as raw text only in Tab 3 without parsing, case-insensitive base filename pairing while respecting file extensions
- **Input normalization**: lowercase filenames for matching, UTF-8 encoding validation, size limits enforcement (max 50,000 chars for .md files)
- **Manifest-driven processing**: log every pairing attempt, parse status, validation results, AI auto-verification, and admin affirmation status per contract with explicit error messages for mismatches or parse failures
- **Pre-flight dry-run validation**: parse all .json and .md files, validate schema/content, and report issues before UI updates
- **Admin affirmation system**: require admin confirmation for critical file pairings with dual-checkbox verification (AI auto-check and admin manual) on Features page
- **Health panel integration**: display manifest parse results, successes, warnings, and failures with links to manifest entries
- **Comprehensive error surfacing**: ensure all errors (file type mismatch, parse errors) are surfaced in UI and manifest without causing React crashes or silent failures

### Contract Template Catalog System
- **Fixed catalog data persistence**: ensure uploaded contract templates persist through app updates, upgrades, and migrations
- **Deterministic template generation**: create contract cards from successfully paired .json and .md files using case-insensitive base filename matching
- **Catalog display restoration**: restore and display all 43 paired contract templates in the Contracts page catalog
- **Template card generation**: generate public "Form Cards" from .json files with title (capitalized basename), summary, category (default "Legal"), scalable preview image, price (minimum $0.5), tags, permalink
- **Resilient pairing validation**: implement defensive checks to prevent template generation failures and ensure successful .json/.md file pairing
- **Migration process management**: pause or disable problematic migration processes that could freeze execution or corrupt catalog data
- **Data integrity verification**: verify template data integrity after system operations and restore from backup if necessary
- **Catalog availability check**: ensure "No contracts available" message only appears when genuinely no templates exist, not due to rendering failures

### Manifest Log and Backup System
- Comprehensive logging per file: status, errors, pairing results, hash, size, type, user, timestamp
- **Enhanced manifest logging with detailed tracking**: record every file match attempt, pairing status, parse results, validation outcomes, AI auto-verification status, and admin affirmation status
- **Explicit error messaging**: log specific error types (file type mismatch, parse failures, validation errors) with descriptive messages
- **Optimization activity logging**: record all specification deduplication, dependency optimization, and compatibility verification activities
- Admin manifest viewer with filtering capabilities for pairing status and errors
- Backup and restore functionality for all data and configurations
- Audit trail with timestamps and user attribution
- System state snapshots and rollback capabilities
- Data integrity verification and corruption detection
- **Health monitoring integration**: provide manifest data for health panel display with success/warning/failure categorization
- **Template catalog backup**: maintain backup of all template catalog data to restore after migrations or system updates

### Dynamic Template Engine
- Parse .json files into public "Form Cards" with title (capitalized basename), summary, category (default "Legal"), scalable preview image, price (minimum $0.5), tags, permalink
- **Multi-tab page views**: replace popup modals with full page views containing tabs, each tab closeable with 'X' button
- **Fixed three-tab detail view with strict pipeline enforcement**:
  - **Tab 1 (e-Contract Form)**: exclusively process .json files for form field generation, strict JSON schema parsing only, no .md content mixing
  - **Tab 2 (Metadata)**: title, category, version, creation date, hashes, md preview
  - **Tab 3 (Details)**: exclusively inject raw .md content as plain text/markdown, no parsing or transformation, case-insensitive base filename matching with .json files
- **Strict file type separation**: ensure .json files never appear in Tab 3, .md files never parsed for Tab 1 forms
- **Case-insensitive base filename pairing**: match files by lowercase base filename while respecting file extensions (.json for Tab 1, .md for Tab 3)
- **Pre-flight validation integration**: validate all files before template generation with comprehensive error reporting
- **Admin affirmation workflow**: require admin confirmation for critical template pairings before processing
- **Robust error handling for template rendering**: implement error boundaries and descriptive warnings for missing or mismatched files instead of crashes or generic errors
- **Missing file handling**: display descriptive warnings in tabs when .json or .md files are missing or mismatched
- Cross-referencing between .json and .md files using normalized basename matching with strict file type enforcement
- Deterministic error-free processing with fallback mechanisms and graceful degradation
- Template rendering with dynamic content injection from validated sources
- Schema validation and comprehensive error reporting with descriptive messages
- **No demo or placeholder data**: ensure all contract forms and details generated exclusively from uploaded files
- **Template rendering error prevention**: eliminate "Template rendering error" messages through comprehensive error boundaries and defensive programming

### Template Preview and Interactive Features
- **Admin and Subscriber scrollbars**: add scrollbars to template preview mode, visible only to Admins and Subscribers
- **Full-page template expansion**: enable expanding templates to full-page size with enhanced interactive features
- **Interactive template actions**: Submit button (to submit the form), Save as PDF, Print to file, Send as email, and Forward/Share Files
- **Role-based template access**: interactive features available only to Admins and Subscribers
- **Template form submission**: allow Subscribers to fill and submit forms with validation
- **Custom template download**: enable Subscribers to download custom e-contract templates as .json files

### Subscription System
- **Subscriber role management**: create and manage Subscriber user role with specific permissions
- **Interactive form access**: enable Subscribers to fill and submit forms, access enhanced template features
- **Template download privileges**: allow Subscribers to download custom e-contract templates as .json format
- **Referral program participation**: enable Subscribers to participate in referral program and earn royalties on GBV (Gross Business Value)
- **Subscription prompts**: display prompts on referral page and relevant areas encouraging users to subscribe for enhanced benefits
- **Role-based feature access**: ensure subscription features are accessible only to appropriate user roles

### Dynamic Features Checklist
- Interactive checklist with progress tracking for all features
- Status tracking (pending, started, completed)
- **Dual verification columns (Auto/AI, Manual/Admin)** with admin override capability
- **Auto-create checklist items** for new features and implemented functionality
- AI auto-completion suggestions for incomplete items
- Real-time status updates and completion indicators
- **File processing pipeline fix verification**: dual-checkbox verification (AI auto-check and admin manual) for strict .json/.md separation, input normalization, manifest-driven processing, admin affirmation system, and three-tab contract view fix
- **Optimization verification**: track specification deduplication, dependency optimization, and compatibility verification activities
- **Health panel integration**: display health panel status and manifest parse results in Features checklist
- **Catalog restoration verification**: track successful restoration of contract template catalog and display confirmation

### Analytics Dashboard
- Comprehensive usage statistics and metrics
- Real-time data visualization and reporting
- User activity tracking and engagement analytics
- Performance monitoring and system health indicators
- **Optimization metrics**: track dependency size reduction, specification deduplication efficiency, and build performance improvements
- Export capabilities for analytics data
- **Health panel integration**: display file processing health metrics, parse success rates, and error statistics

### Contract Lifecycle Management
- Complete contract creation, editing, and approval workflow
- Status tracking through all lifecycle stages
- Document versioning and change management
- Automated notifications and reminders
- Integration with approval processes and digital signatures
- Public access to Contracts page (no authentication required)

### E-Commerce and Payment System
- Shopping cart functionality with "List of Form-Item" tab
- **Emoji-based cart and voting**: onClick heart (❤️) or contract (📄) icon increments cart quantity for that template, updates grand total
- Multiple clicks increment quantity and update grand total
- **Minimum price enforcement**: block publish if minPrice < $0.5 per e-contract
- **Secure credential management**: admin-only forms for entering payment gateway credentials with hashing and .env storage
- **Payment gateway configuration**: guide user through setup for Stripe, PayPal (newgoldenjewel@gmail.com), UPI (secoin@uboi), and ETH (0x4a100E184ac1f17491Fbbcf549CeBfB676694eF7)
- **Payment gateway validation**: require config presence and validation before enabling payments
- **Credential restoration**: automatic restore of payment credentials on app update/upgrade/migration by matching admin input to stored hashes
- Checkout process with cart totals, price validation, gateway routing
- Confirmation and receipt ID generation

### Voting and Rating System
- **Emoji-based voting**: +vote / -vote functionality for each e-contract with onClick support
- **Per-session and per-user vote tracking** (if logged in) with debounce protection
- Aggregate score display with spam prevention debouncing
- **Leaderboard**: promote best e-contracts by score, sales, and completion rate, updating on status and admin verification

### Monetization and Referral System
- **Enhanced referral tracking**: comprehensive referral tracking and commission management for Subscribers
- **GBV royalty system**: enable Subscribers to earn royalties on Gross Business Value through referral program
- **Referral program visibility**: integrate referral and royalty logic with clear visibility for users
- **Subscription incentives**: display prompts encouraging subscription for referral program benefits
- Payment processing integration
- Usage-based billing and subscription management
- Revenue analytics and reporting

### Blockchain Integration
- Ethereum signature verification and validation
- Zero-Knowledge (ZK) proof integration for privacy
- Smart contract interaction capabilities
- Blockchain-based document integrity verification

### Voice and Text-to-Speech Features
- Voice input for contract data entry
- Text-to-speech for document reading
- Multi-language voice support
- Accessibility compliance for voice features

### Configuration Validation and Go-Live
- Validate payment gateway configurations before enabling payments
- Validate contact information: email, phone/WhatsApp, map, social media links
- **Pre-go-live validation**: cross-check all critical configs (payment, contact links, etc.)
- **Interactive config completion**: if any configs are missing, prompt for user input
- **Go-live enablement**: once all configs validated, publish Contracts page and enable payments
- Request clarification for missing critical values before proceeding live

### Pagination and Display Features
- **Pagination controls**: add "First" and "Last" page buttons to all paginated lists (contracts, templates, leaderboard)
- **Hash privacy**: display only first and last 4 characters of any hash (file, template, transaction), masking middle for privacy

### User Interface Requirements
- Responsive design for desktop, tablet, and mobile devices
- Accessibility compliance (WCAG 2.1 AA standards)
- Modern, intuitive user interface design
- VIBGYOR theme toggle with application-wide color scheme changes
- Real-time progress indicators for all operations
- Contact and social media information display
- **English language content** throughout application
- Features page and Leaderboard included in sitemap and navigation

## Access Control

### Public Access (No Authentication Required)
- **Public pages**: Home, Sitemap, Templates, Blog, About Us, Pros of e-Contracts, What We Do, Why Us, Contact Us, FAQ, Terms & Conditions, Referral, Proof of Trust, Leaderboard, Help, Contracts, Upload
- **Contract viewing and creation**: public access to view contract templates and create contracts
- **Template browsing**: public access to browse contract template catalog
- **File upload**: public access to upload files for contract creation
- **Voting and rating**: public access to vote on contracts and view ratings
- **Shopping cart**: public access to add items to cart and view pricing

### Subscriber Access (Authentication Required)
- **Enhanced template features**: form submission, download privileges, interactive template actions
- **Template preview**: scrollbars and full-page expansion for template preview mode
- **Interactive template actions**: Submit button, Save as PDF, Print to file, Send as email, Forward/Share Files
- **Custom template download**: download custom e-contract templates as .json files
- **Referral program participation**: earn royalties on GBV through referral program
- **Subscription dashboard**: access to subscription-specific features and settings

### Admin Access (Admin Authentication Required)
- **Protected admin pages**: Dashboard, Features, Analytics, Reports, Settings, Backup, Admin Dashboard, Subscription management
- **Specification management**: editing and restoring specifications with proper access control
- **System configuration**: analytics, manifest viewer, payment credential management
- **File preview and affirmation**: critical pairing affirmation, optimization logs, health panel
- **Sitemap management**: page management interface with add/remove capabilities
- **Payment gateway configuration**: secure credential management and validation
- **Advanced features**: template processing pipeline management, catalog restoration, system optimization

### Access Control Implementation
- **Role-based permissions**: enforce different access levels for Public, Subscriber, and Admin users
- **Authentication enforcement**: require login only for Admin and Subscription-related pages
- **Access-denied prompts**: display appropriate prompts for unauthorized users attempting to access protected pages
- **Navigation filtering**: exclude Admin-only and Subscription-only pages from public navigation menus
- **Consistent public navigation**: ensure public pages appear in headers, quick links, and footers for all users
- **Secure authentication mechanisms**: implement proper authentication and authorization for protected areas

## Backend Requirements
- **Enhanced access control system**: implement role-based access control with Public, Subscriber, and Admin permission levels
- **Authentication validation**: provide endpoints to validate user authentication status and role permissions
- **Public route handling**: ensure public pages are accessible without authentication requirements
- **Protected route enforcement**: enforce authentication requirements only for Admin and Subscription-related pages
- **Navigation data filtering**: provide filtered navigation data based on user role and authentication status
- **Session management**: handle user sessions and authentication state across public and protected areas
- **Enhanced sitemap management system**: extend existing sitemap with parallel `pages[]` array for admin-priority routes while maintaining non-breaking compatibility
- **Admin-controlled page storage**: store and manage `pages[]` array with unique, admin-priority routes and strict access control
- **Controlled routes backend**: implement `controlledRoutes` mapping for `/broadcast`, `/remote`, and `/live` pages with delegation to Secoinfi-App under admin control
- **Sitemap resolution engine**: merge existing sitemap (auto-generated) with manual pages and controlled apps in priority order: auto → pages[] → controlledRoutes
- **Admin access validation**: enforce strict access control for `pages[]` modifications with admin privilege verification
- **Input validation backend**: implement lowercase validation, unique entry checking, and reserved keyword control for page additions
- **Audit trail system**: manifest logging and access control checks for each sitemap action with immutability requirements
- **Versioning metadata storage**: store optional timestamp and admin signature for sitemap modifications
- **Route delegation logic**: implement runtime logic where controlled route shells exist but content injection enabled only for whitelisted Secoinfi-Apps
- **Order preservation system**: maintain uniqueness and order preservation without auto-deletion or overwriting of existing sitemap nodes
- **Specification optimization engine**: implement automatic deduplication and optimization of spec.md and .yaml files with content compression and redundancy removal
- **Automated deduplication system**: SpecificationManager includes self-optimization that removes duplicate headings, identical text blocks, and repeated feature descriptions before saving
- **Backup and version control**: backup original versions before writing new deduplicated files for integrity and rollback capability
- **Dependency management system**: update all node_modules dependencies to latest compatible stable versions with production optimization
- **Build optimization pipeline**: implement tree-shaking, minification, dependency pruning, and unused package compression
- **Internet Computer compatibility verification**: safety mechanism to verify all new dependencies against IC environment before final build
- **Optimization logging system**: write all deduplication, optimization, and compatibility verification activities to manifest for admin review
- **Fixed file processing pipeline with strict enforcement**: implement strict separation where .json files are parsed only for Tab 1 form generation, .md files are injected as raw text only in Tab 3, case-insensitive base filename pairing while respecting file extensions
- **Input normalization system**: lowercase filenames for matching, UTF-8 encoding validation, size limits enforcement (max 50,000 chars for .md files)
- **Manifest-driven processing engine**: log every pairing attempt, parse status, validation results, AI auto-verification status, and admin affirmation status per contract with explicit error messages
- **Pre-flight dry-run validation**: parse and validate all .json and .md files, check schema/content integrity, report issues before UI updates
- **Admin affirmation system**: provide backend endpoints for admin confirmation of critical file pairings with dual-checkbox verification tracking
- **Health monitoring backend**: collect and provide manifest parse results, success/warning/failure statistics, error categorization for health panel display
- **Comprehensive error handling**: ensure all file processing errors are logged with descriptive messages and surfaced through API responses
- **React state management support**: provide stable API endpoints with consistent response formats to prevent frontend render loops
- **Robust template pairing validation**: validate file type matching and content integrity before template generation
- **Missing file handling**: provide clear error responses when .json or .md files are missing or mismatched for template rendering
- **Template catalog persistence**: ensure contract template data persists through app updates, upgrades, and migrations with automatic backup and restore
- **Migration process control**: pause or disable problematic migration processes that could freeze execution or corrupt catalog data
- **Catalog data integrity**: implement defensive checks and validation to prevent template generation failures and ensure successful pairing
- **Template rendering error prevention**: provide robust error handling to eliminate "Template rendering error" messages
- **Deterministic template generation**: ensure reliable creation of contract cards from paired .json and .md files
- **Subscription management**: store and manage Subscriber user roles and permissions
- **Enhanced referral system**: track referral relationships, calculate GBV royalties, manage commission payments for Subscribers
- **Template interaction tracking**: log form submissions, downloads, and interactive feature usage by Subscribers
- **Role-based access control**: enforce Subscriber and Admin permissions for enhanced template features, preview mode, affirmation system, and sitemap management
- **Business information storage**: store Sudha Enterprises business data, contact information, social media links, and payment details in stable variables
- **Global data replacement**: replace all placeholder or generic company data with authentic business information
- **Real-time business data synchronization**: ensure business information updates propagate throughout application
- **Complete page routing system**: handle all unique pages with proper routing and access control
- **Compact navigation management**: ensure all pages are visible in both main menu and Quick Links with no duplicates
- **Page management**: store page metadata, content, and access control rules
- **Search indexing backend**: maintain searchable index of all pages for navigation search functionality
- **Strict duplicate prevention**: ensure no duplicate page routes or content exist across all navigation areas
- **Navigation validation system**: verify all pages are properly accessible through top menu, Quick Links, and bottom navbar
- **Automatic specification processing**: on every app update, upgrade, or migration, copy current spec.md, optimize and deduplicate content, convert to .ml and .yaml formats in parallel
- **Specification synchronization**: maintain all three formats (.md, .ml, .yaml) with automatic conversion and deduplication
- **Fallback hierarchy**: use spec.md only when .yaml and .ml are missing or fail to parse, not as primary source
- Store and manage technical specifications in multiple formats (YAML, ML, Markdown)
- Handle advanced file upload processing with SHA-256 hashing, chunking, deduplication, and sanitization
- Implement raw markdown storage without parsing
- **Template generation from validated files**: ensure contract cards and forms are created from .json files using strict JSON parsing, with .md files paired by case-insensitive base filename for Details tab raw text injection
- Maintain comprehensive audit logs and backup systems
- Provide analytics data collection and processing
- Support contract lifecycle management workflows
- **Shopping cart and emoji-based payment processing** integration with validation
- **Voting system with debounce protection** and per-session/user tracking
- **Secure credential storage**: hash and store payment gateway credentials in .env files with permalink generation
- **Credential restoration system**: automatic restore of payment credentials on app updates by hash matching
- **Payment gateway configuration** with validation requirements for Stripe, PayPal, UPI, and Crypto systems
- **Pre-go-live validation system** for all critical configurations
- Integrate with blockchain networks for signature and proof verification
- Handle voice processing and text-to-speech conversion
- Manage user roles and access control
- Store referral and monetization data
- Real-time specification broadcasting for live UI updates
- **Features checklist management** with auto-detection and dual verification columns
- **File processing pipeline fix tracking**: track implementation status of strict .json/.md separation, input normalization, manifest-driven processing, admin affirmation system, and three-tab contract view fix
- **Leaderboard data management** with score, sales, and completion rate tracking
- **Pagination support** for all list endpoints with first/last page navigation
- **Hash masking** for privacy in all API responses

## Frontend Requirements
- **Enhanced access control interface**: implement role-based access control with proper authentication checks for Admin and Subscription-related pages only
- **Public route accessibility**: ensure all public pages are accessible without login requirements
- **Authentication prompts**: display access-denied prompts only for unauthorized users attempting to access protected pages
- **Navigation filtering interface**: exclude Admin-only and Subscription-only pages from public navigation menus (sitemap and quick links)
- **Consistent public navigation**: ensure public pages appear in headers, quick links, and footers for all users regardless of authentication status
- **Protected page routing**: implement route guards that require authentication only for Dashboard, Features, Analytics, Reports, Settings, Backup, Admin Dashboard, and Subscription pages
- **Enhanced sitemap interface**: implement admin UI forms under `/sitemap` and `/admin` pages for manually appending unique page slugs to `pages[]`
- **Admin page management form**: provide "+ Add Page" button with validation for lowercase input, unique entry check, and reserved keyword control
- **Read-only system pages display**: show existing entries with disabled edit/delete for system pages
- **Controlled routes interface**: display route shells for `/broadcast`, `/remote`, and `/live` with content injection status for whitelisted Secoinfi-Apps
- **Sitemap resolution display**: show merged sitemap with priority order visualization (auto → pages[] → controlledRoutes)
- **Admin access enforcement**: ensure only admin users can access and modify sitemap page management interface
- **Audit trail interface**: display manifest logging and access control checks for sitemap actions
- **Versioning metadata display**: show optional timestamp and admin signature for sitemap modifications
- **Non-breaking compatibility**: maintain existing sitemap functionality while adding new admin features
- **Optimization interface**: display specification deduplication progress, dependency optimization status, and compatibility verification results
- **Manifest optimization viewer**: show optimization logs and activities in admin manifest viewer with filtering capabilities
- **Features page optimization tracking**: display optimization verification status in Features checklist with dual-checkbox verification
- **Automated deduplication interface**: display deduplication progress and results in SpecificationManager interface
- **Backup and version interface**: show backup status and version tracking for deduplicated specifications
- **Fixed React state management**: implement reducers and guarded effects to prevent render/update loops, no setState in render, stable effect dependencies, debounced async parsing, error boundaries for Tabs
- **Strict file processing interface**: enforce .json files for Tab 1 form generation only, .md files for Tab 3 raw text display only, case-insensitive base filename pairing with file extension respect
- **Input normalization interface**: implement lowercase filename matching, UTF-8 validation display, size limit warnings (max 50,000 chars for .md)
- **Manifest-driven processing UI**: display pairing attempts, parse status, validation results, AI auto-verification, and admin affirmation status with explicit error messages
- **Pre-flight validation interface**: show dry-run validation results, schema/content issues before UI updates
- **Admin affirmation interface**: provide dual-checkbox verification (AI auto-check and admin manual) on Features page for critical file pairings
- **Health panel implementation**: display manifest parse results, successes, warnings, failures with links to manifest entries
- **Comprehensive error display**: surface all file processing errors in UI and manifest without causing React crashes or silent failures
- **Error boundaries for Tabs**: implement React error boundaries to prevent crashes in Tab components
- **Debounced async processing**: implement debouncing for file parsing operations to prevent performance issues
- **Stable effect dependencies**: ensure React useEffect hooks have stable dependencies to prevent infinite loops
- **Fixed ContractsPage and template rendering**: ensure clicking any e-Contract card always shows three-tab view with strict content separation and error handling
- **Missing file handling interface**: display descriptive warnings in tabs when .json or .md files are missing or mismatched instead of crashes
- **Robust template error boundaries**: implement error boundaries specifically for template rendering to prevent React crashes
- **Template catalog display restoration**: restore display of all 43 paired contract templates in the Contracts page catalog
- **Catalog availability interface**: ensure proper display of contract templates and eliminate false "No contracts available" messages
- **Template rendering error elimination**: implement comprehensive error handling to prevent "Template rendering error" messages
- **Deterministic template display**: ensure reliable rendering of contract cards from paired .json and .md files
- **Subscription interface**: provide subscription management interface and role-based access controls
- **Enhanced template preview**: implement scrollbars for template preview mode, visible only to Admins and Subscribers
- **Full-page template expansion**: enable expanding templates to full-page size with interactive features (Submit, Save as PDF, Print, Send email, Forward/Share)
- **Interactive form functionality**: allow Subscribers to fill and submit forms with validation and feedback
- **Template download interface**: enable Subscribers to download custom e-contract templates as .json files
- **Referral program interface**: display referral tracking, GBV royalty information, and subscription prompts
- **Role-based feature visibility**: ensure subscription features, preview mode, affirmation interface, and sitemap management are accessible only to appropriate user roles
- **Compact navigation implementation**: render compact dual navigation with all pages visible in both main menu and Quick Links
- **Duplicate prevention interface**: ensure no duplicate page links across main menu and Quick Links
- **Contact Us page enhancement**: display comprehensive Sudha Enterprises business information including company name, address with clickable map link, phone, website, WhatsApp, email, UPI ID, ETH ID, PayPal, social media links, and CEO information
- **Business information integration**: display authentic Sudha Enterprises data consistently across all pages and components
- **Clickable contact links**: ensure all contact, social, and payment links are functional and accurate
- **Complete page implementation**: render all unique pages with modern, responsive layouts matching app design system
- **Navigation integration**: integrate all pages into sitemap, top menu, Quick Links, and bottom navigation bars with proper access control
- **Navigation consistency enforcement**: ensure identical page availability and no duplicates across all navigation areas
- **Search functionality**: implement search across all pages in both navigation bars
- **Placeholder content structure**: scaffold each page with ready-to-expand content and navigation links
- **Strict duplicate prevention**: ensure no duplicate page components or routes across all navigation methods
- **Navigation validation interface**: verify and display all pages are properly linked and accessible
- **Specification editor with auto-generation**: in YAML spec editor section, add feature to auto-generate equivalent .ml and .yaml code from current spec.md or edited .yaml
- **Admin specification management**: provide interface for editing and restoring specifications with proper access control
- Dual navigation system with search capabilities and auto-detection
- Advanced file upload interface with progress tracking and error handling
- **Template Cards display from validated files**: display template cards generated from .json files using strict JSON parsing, with .md files paired by case-insensitive base filename for Details tab raw text display
- **Multi-tab template detail views with strict separation**: closeable tabs with enforced content separation - .json files for Tab 1 forms, metadata for Tab 2, raw .md text for Tab 3
- **Shopping cart with emoji actions** and quantity management
- **Voting interface with emoji support** and aggregate score display
- Interactive analytics dashboard with data visualization
- Contract management interface with lifecycle tracking
- **Features page with dynamic checklist** and dual verification columns for file processing pipeline fix
- **Health panel integration**: display health monitoring data with parse results and error statistics
- **Leaderboard display** for top e-contracts with real-time updates and pagination controls
- Admin manifest viewer with filtering for pairing status and comprehensive error display
- Voice input and text-to-speech controls
- Admin panel for specification and system management
- **Secure admin forms for payment credential entry** with Stripe, PayPal, UPI, and Crypto configuration
- **Credential restoration interface** for app updates with hash verification
- **Pre-go-live validation interface** with config completion prompts
- Responsive design with accessibility features
- VIBGYOR theme toggle and application-wide styling
- Real-time updates and progress indicators
- **Enhanced error handling** with descriptive notifications for file processing failures, not generic errors
- Contact and social media integration
- Payment gateway integration and checkout process
- **Pagination controls with First/Last buttons** for all paginated lists
- **Hash privacy display** showing only first and last 4 characters of hashes
- **Admin-only visibility** for payment gateway credentials, configuration, preview mode, affirmation interface, optimization logs, health panel, and sitemap management
- **Catalog restoration confirmation**: display confirmation on Features page once contract template catalog is successfully restored and visible
