# E Contracts Web Application

## Overview
A decentralized e-contracts platform that allows users to create, manage, and execute digital contracts with voice interaction capabilities and AI assistance. The platform features a comprehensive public website with informational pages, restricted admin functionality, and a modular template engine with multi-file upload capabilities and dynamic form generation. The system includes enterprise-grade data persistence, automated backup systems, integrated payment processing, and advanced theming capabilities with VIBGYOR color palette support.

## Core Features

### Advanced Theme System
- Multi-theme support with three distinct theme options: Normal, Dark, and VIBGYOR
- VIBGYOR theme featuring vibrant gradient-based color palette spanning the full spectrum (Red → Orange → Yellow → Green → Blue → Indigo → Violet)
- Light and dark variants available for VIBGYOR theme
- Enhanced theme switcher with smooth transitions and real-time preview capabilities
- Theme preference persistence across user sessions
- Proper contrast adjustments for dark theme ensuring text readability on all pages
- Theme consistency across all components including modals, overlays, and navigation elements
- Accessibility compliance with proper contrast ratios for all theme variants

### Navigation System
- Top navigation bar with right-aligned, toggleable, searchable menu list
- Bottom navigation bar with complete site navigation and built-in searchable sitemap display
- Real-time search functionality that filters menu items as user types
- One-click sitemap access from bottom navigation with real-time filtering and admin-only markers
- Admin-only link handling that shows restricted pages in menu but requires authentication to access
- Responsive design that adapts to different screen sizes
- Theme-aware navigation elements with proper contrast and visibility across all theme variants
- Accessible sitemap with the following pages:
  - Home: Landing page with hero section and overview
  - Dashboard: Admin-only contract management interface
  - Features: Admin-only detailed feature showcase with dynamic checklist
  - Templates: Public template browsing with subject list and images
  - Blog: E-contracts related articles and updates
  - About Us: Company information and mission
  - Pros of e-Contracts: Benefits and advantages
  - What We Do: Service descriptions and offerings
  - Why Us: Competitive advantages and differentiators
  - Contact Us: Contact form and SECOINFI company details with clickable links
  - FAQ: Frequently asked questions with two-page view and center-aligned topics
  - Terms & Conditions: Legal terms and policies
  - Referral: Referral program information
  - Proof of Trust: Trust indicators and testimonials
  - Sitemap: Complete site navigation structure with working live search filter
- Menu page transparency set to 30% opacity for better contrast and readability with theme-aware adjustments
- All logo text and logo images in headers and components are hyperlinks leading to the Home page

### Contact Information
- SECOINFI company contact details:
  - CEO & Founder: DILEEP KUMAR D
  - Primary Email: dild26@gmail.com
  - Business Phone & WhatsApp: +91-962-005-8644
  - Website: www.seco.in.net
  - Business Address: Sudha Enterprises, No. 157, V R VIHAR, VARADARAJ NAGAR, VIDYARANYAPUR PO, BANGALORE-560097
  - Payment Information: PayPal (newgoldenjewel@gmail.com), UPI ID (secoin@uboi), ETH ID (0x4a100E184ac1f17491Fbbcf549CeBfB676694eF7)
- Social media profile links (all platforms clickable):
  - Facebook: https://facebook.com/dild26
  - LinkedIn: https://www.linkedin.com/in/dild26
  - Telegram: https://t.me/dilee
  - Discord: https://discord.com/users/dild26
  - Blogspot: https://dildiva.blogspot.com/
  - Instagram: https://www.instagram.com/newgoldenjewel
  - X/Twitter: https://x.com/dil_sec
  - YouTube: https://www.youtube.com/@dileepkumard4484

### Access Control
- Admin authentication system for restricted pages
- Dashboard and Features pages require admin login
- Template creation, form filling, and contract code viewing require authenticated subscriber access
- Public access to template subject list and browsing without authentication
- External link access restricted to subscribers only - public users and guests cannot view premium or subscriber-exclusive links

### Enterprise Data Management
- Permanent storage system with automated backup capabilities
- Automated snapshot creation with version tagging for all user and application data
- One-click restore capability for data recovery
- Enterprise-grade upgrade management with versioned data persistence
- Secure migration handling ensuring zero data loss during live updates
- Robust field management system with persistent storage, version tracking, and error recovery for all contract and template form fields

### Multi-File Upload System
- Multi-file upload interface supporting simultaneous upload of .json and .md files
- Intelligent file matching system that pairs files by base name (ignoring file extensions)
- Support for .json, .md, .txt, and .zip files
- Bulk .zip upload system that processes and displays files contained within the archive
- SHA-256 hash computation for all uploaded files with automatic deduplication
- Content sanitization and validation for all file types to prevent security threats
- Real-time upload progress indicators and status feedback
- Error handling and validation for multi-file uploads

### Template Generation and Processing
- Auto-generation of web forms from uploaded .json files by analyzing structure and data types
- Template naming system using filename (without extension) with first character capitalized
- Default category assignment to "Legal" when category is not specified in template data
- Dynamic form field creation including text, textarea, number, select, checkbox, date, email, url, signature, group/array fields
- Cross-referencing system that matches .json files with corresponding .md/.txt files by base name
- Batch template generation that processes matching file sets
- Markdown files (.md) are extracted as raw content for display purposes only, never parsed as forms
- Template metadata generation including field mappings and validation rules

### Template Detail View
- Template detail pages feature a three-tab interface:
  - Tab 1: "Form" - Dynamic web form generated from .json schema
  - Tab 2: "Metadata" - Template information including title, category, creation date, version
  - Tab 3: "Details of e-Contracts" - Raw markdown content from matched .md files rendered for guidance
- Markdown content is rendered with proper formatting including headers, lists, links, and emphasis
- All content displayed in English language

### Dynamic Features Checklist (Admin Only)
- Dedicated Feature Checklist admin page integrated into the main admin dashboard
- Comprehensive checklist displaying all major application features for ongoing implementation tracking
- Each feature record includes:
  - Feature name and description
  - Status dropdown with options: ["pending", "started", "cancelled", "failure", "completed", "updated", "upgraded", "modified", "migrated", "verified", "deleted", "archived"]
  - "Verified" column with radio button/checkbox for manual admin confirmation
  - Timestamp of last status change
- AI-powered auto-completion logic that monitors user requests and admin actions
- Admin can manually override AI status updates and mark features as verified
- Feature implementation tracking and transparency for ongoing development

### Payment Processing System
- Stripe payment processing integration with lazy loading for performance optimization
- Secure subscription model with automated billing and management
- Pay As You Use (PAYU) model for flexible pricing options
- Admin-only payment control panel for enhanced security and user management
- Payment history tracking and invoice generation
- Subscription status management and renewal handling

### Preview Modal System
- Fully responsive full-viewport preview modal system
- View contracts, templates, or uploaded files without leaving the active page
- Modal supports various file types and content formats
- Responsive design adapting to different screen sizes and devices
- Theme-aware modal styling with proper contrast and visibility

### Enhanced Pagination System
- Comprehensive pagination system implemented across all list views (contracts, templates, reports)
- Templates page features smooth and functional pagination for e-contracts catalog browsing
- Mandatory "First" and "Last" navigation buttons for quick page traversal alongside numbered page buttons
- Dynamic pagination updates when search, filter, or sorting actions are applied
- Consistent pagination display when browsing template lists
- Page number display and direct page navigation
- Items per page configuration options
- React Query integration for efficient data fetching and state management
- Smooth interaction with backend data fetching for optimal rendering performance

### ETH Signature and ZK Proof Integration
- ETH signature verification for all form submissions
- ZK proof verification capabilities for enhanced security
- Verification status storage for all submitted forms
- Cryptographic signature validation for contract authenticity

### Analytics and Import Records
- Analytics dashboard accessible from admin dashboard and Templates page
- Import statistics including total uploads, successful imports, failed imports, and deduplication counts
- SHA-256 deduplication tracking with hash collision reports
- Import job status monitoring with real-time updates
- Detailed error and warning reports for each import operation
- Historical import records with timestamps and admin user tracking

### Public Template Display
- Public site displays only indexed template subjects with no PII or raw contract content
- Template listings show title, summary, category, thumbnail, price type, tags, and permalink
- Auto-generated or admin-uploaded attractive images for each template

### Monetization and Referral System
- Multiple pricing models: auction, fixed price, subscription, pay-per-use
- Referral program with payout logic and tracking
- Admin configuration for pricing strategies and referral rates

### Contract Management (Admin Only)
- Create new contracts using processed templates or custom forms
- View and browse existing contracts with status indicators
- Edit draft contracts before finalization
- Delete contracts (draft status only)
- Search and filter contracts by status, date, or keywords

### Contract Lifecycle
- Draft: Editable contracts not yet finalized
- Active: Finalized contracts awaiting signatures or execution
- Completed: Fully executed contracts
- Cancelled: Terminated contracts

### Voice Integration
- Voice command support for navigation and contract operations
- Text-to-Speech (TTS) responses for user interactions
- Hover-activated TTS for contract previews and summaries

### User Interface
- Modular, scalable, and futuristic design system with advanced theming capabilities
- Multi-theme support including Normal, Dark, and VIBGYOR themes with smooth transitions
- Enhanced theme switcher with real-time preview and preference persistence
- VIBGYOR gradient-based color palette with light and dark variants
- Dual navigation system with top and bottom navbars
- Real-time search functionality in both navigation bars
- Multi-file upload interface for admin users with prominent upload buttons
- Dynamic features checklist interface with status dropdowns and verification controls
- Consistent color scheme and visual hierarchy across all pages with theme awareness
- Fully responsive layout for desktop and mobile devices
- Accessibility features including keyboard navigation and ARIA labels
- Dashboard with contract overview and statistics
- Modern template browsing interface with grid layout and preview images
- Dynamic form generation interface displaying auto-created web forms
- Three-tab template detail view with Form, Metadata, and Details tabs
- Import report display with error review and fix tools
- Analytics dashboard with comprehensive import statistics and visualizations
- FAQ page with two-page view and center-aligned topics
- Full-viewport preview modal system for contracts, templates, and files
- Enhanced pagination interface with smooth navigation and dynamic updates
- Theme-consistent styling across all components, modals, and overlays

## Backend Data Storage
- Enterprise-grade permanent storage with automated backup system
- Versioned data snapshots with automated tagging and restore capabilities
- Migration-safe data persistence ensuring zero data loss during upgrades
- User theme preferences with persistence across sessions
- Theme configuration data for Normal, Dark, and VIBGYOR variants
- Features checklist data with status tracking, timestamps, and admin verification records
- Multi-file upload records with processing metadata
- Template engine data with SHA-256 hashes and deduplication records
- Raw zip file storage with secure hash-based organization
- Extracted and processed file content (markdown, JSON, Solidity, text)
- Intelligent file matching records for files paired by base name
- Dynamic form generation data including field mappings and validation rules
- Auto-generated web form configurations with field types and properties
- Template naming data using filename-based naming with capitalization
- Template category data with "Legal" default assignment
- Template parsing status and completion tracking
- Template metadata including title, category, size, format, creation date, version
- Markdown content storage for template details tab display (raw plain text, never parsed as forms)
- ETH signature verification data and status records
- ZK proof verification data and cryptographic validation records
- Form submission data with verification status and cryptographic signatures
- Import analytics data including statistics, job status, and historical records
- User contracts with metadata (title, status, creation date, parties involved)
- Contract content and terms generated from processed templates
- Admin user authentication and session management
- Subscriber authentication and access control
- Static content for public pages
- Blog posts and articles
- Contact form submissions
- SECOINFI company contact information and details
- Payment processing data including Stripe integration records
- Subscription management data and billing history
- Pay As You Use transaction records and usage tracking
- Field management system data with version tracking and error recovery
- Backup and restore system metadata and version control
- Pagination state and configuration data for template browsing
- Template catalog pagination metadata and page size settings

## Backend Operations
- Enterprise data backup and restore operations with automated scheduling
- Version control and migration management for zero-downtime upgrades
- User theme preference management and persistence operations
- Theme configuration processing and validation
- Features checklist management with AI-powered auto-completion and status tracking
- Admin authentication and authorization
- Subscriber authentication and access control
- Multi-file upload processing with simultaneous handling of .json and .md files
- Intelligent file matching system that pairs files by base name
- Bulk zip file upload processing with streaming extraction
- Dynamic form generation from JSON structure analysis
- Template naming processing using filename with first character capitalized
- Default category assignment to "Legal" when not specified
- Cross-referencing operations between matching file sets
- Batch template generation processing for matched file pairs
- Template parsing status tracking and completion management
- Dynamic template form generation and display from parsed .json schema
- Markdown content processing and storage for template details tab display (raw content extraction only)
- ETH signature verification processing for form submissions
- ZK proof generation and verification operations
- Cryptographic validation and off-chain verification processing
- Content normalization and canonicalization
- File content sanitization and security threat prevention
- SHA-256 deduplication processing with collision detection
- Template metadata management and storage operations
- Analytics data collection and statistics computation
- CRUD operations for contracts and templates
- Contract generation from processed template data
- Blockchain write operations for contract deployment
- Contract status management and transitions
- Search and filtering functionality for contracts, templates, and site content
- Content management for public pages
- Contact form processing
- Blog post management
- Stripe payment processing operations with lazy loading
- Subscription management and billing operations
- Pay As You Use transaction processing and tracking
- Field management operations with persistent storage and version tracking
- External link access control for subscriber-only content
- Paginated template data fetching with dynamic filtering and sorting support
- Template catalog pagination processing with efficient data retrieval

## Technical Requirements
- Enterprise-grade data persistence with automated backup and restore capabilities
- Version control system for zero-downtime upgrades and migrations
- Advanced theming system with multi-theme support and smooth transitions
- Theme preference persistence and real-time theme switching capabilities
- Proper contrast management for accessibility across all theme variants
- Mobile-responsive design with touch-friendly interfaces
- Dual navigation system with top and bottom navbars
- Real-time search filtering for both navigation menu systems
- Built-in searchable sitemap display in bottom navigation
- Multi-file upload system supporting simultaneous upload of .json and .md files
- Intelligent file matching by base name across different file extensions
- Bulk upload system for .zip files with streaming file processing
- SHA-256 hashing and deduplication system for uploaded files
- Dynamic form generation system with intelligent field type inference
- Template naming system using filename-based naming with first character capitalized
- Default category assignment system for "Legal" category
- Template parsing status tracking and completion management
- Three-tab template detail view system with Form, Metadata, and Details tabs
- Markdown rendering system for template details tab (raw plain text processing only)
- ETH signature verification integration with cryptographic validation
- ZK proof generation and verification system
- Dynamic features checklist with AI auto-completion and admin verification
- Voice recognition for command input
- Text-to-Speech engine integration
- Secure upload systems with comprehensive sanitization
- Content normalization and canonicalization systems
- File sanitization and security validation systems
- Real-time analytics and statistics tracking
- Privacy-compliant public template display with no PII exposure
- Monetization system integration with multiple pricing models
- Referral program tracking and payout systems
- Blockchain integration for contract deployment
- Keyboard navigation support throughout the application
- ARIA labels and accessibility compliance
- Admin and subscriber session management and security
- SEO-optimized public pages
- English language support for all content and voice interactions
- Modern, professional visual design with advanced theming capabilities
- Comprehensive audit logging and security measures
- Real-time processing status and progress indicators
- FAQ page with two-page view and center-aligned topics
- Memory-efficient processing to prevent issues with large files
- Stripe payment integration with lazy loading for performance
- Subscription and Pay As You Use payment models
- Admin-only payment control panel for security and management
- Robust field management system with persistent storage and version tracking
- Full-viewport preview modal system for responsive viewing
- Enhanced pagination with mandatory first and last page navigation
- External link access restriction for subscriber-only content
- Logo hyperlinks leading to Home page throughout the application
- 30% opacity menu page transparency for improved readability with theme awareness
- React Query integration for efficient data fetching and caching
- Smooth pagination functionality with dynamic updates for search, filter, and sort operations
- Consistent pagination display across template catalog browsing
- Theme-aware component styling with proper contrast ratios and accessibility compliance
