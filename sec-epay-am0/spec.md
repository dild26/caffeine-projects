# Secoinfi ePay   Decentralized Financial Web Application

## Overview
Secoinfi ePay is a blockchain-inspired financial web application that enables QRC-based transactions, subscription management, and multi-level transaction processing with automated validation.

## Core Features

### User Registration & Authentication
- Users register using UPI/QRC/Mobile number
- Support for both individual and business accounts
- Authentication required only for admin and subscription-related functionality

### Access Control & Routing
- Public pages accessible without authentication: home, features, calc, contact, faq, terms, about, and other informational pages
- Restricted pages requiring authentication: admin, main-form, subscriptions, leaderboard (if subscription-related)
- Frontend routing guards that prompt for login only when accessing restricted areas
- Backend authentication checks enforced only on admin-level functions and approval-sensitive data queries
- Existing Motoko access control roles preserved and applied selectively

### Transaction Engine
- Multi-level transaction processing with unlimited depth
- Automatic running balance calculations that match transaction history
- Real-time grand total validation per transaction batch
- Transaction status tracking (OK/Pending/Rejected)
- Merkle root generation for transaction blocks
- Complete transaction audit trail with timestamps

### QRC Payment System
- Pay-in and pay-out functionality via QRC scanning or manual entry
- Support for recurring and one-time deposits
- Currency conversion between INR and USD (1 USD = 90 INR)
- Transaction verification and confirmation

### Subscription & Leaderboard System
- Users can subscribe to broadcast their QRC on a rotating leaderboard
- Time-based rotation cycles (minutes/hours/days/weeks)
- Subscription fees automatically determined by admin as average global price
- Leaderboard displays subscribers ranked by transaction totals or duration
- Viewer mode showing active subscribers with Unix and human-readable timestamps
- Authentication required for subscription management and related leaderboard features

### Terms of Service Management
- Versioned Terms of Service (TOS) system with complete version history
- User acceptance tracking linked to user principals
- Admin notices system with different types (info, critical, legal)
- Mandatory acceptance enforcement for critical updates
- Terms acceptance modal blocking app access until accepted
- Immutable storage of all previous versions
- Admin-only terms publication and management interface
- Terms page publicly accessible for viewing current terms and version history

### Theme System
- Three theme modes: light, dark, and VIBGYOR (rainbow color scheme)
- Default theme is VIBGYOR - automatically applied on first load for all users including guests
- Global theme toggle accessible from all pages allowing users to switch to light or dark modes
- Dynamic theme application to all UI elements, charts, tables, and components
- Theme preference persistence across user sessions
- Responsive theme switching with smooth transitions

### Manual Sitemap Extension System
- Extended sitemap structure with manual page management capabilities
- Non-breaking extension that preserves existing auto-generated sitemap functionality
- Admin-only access control for adding and managing custom pages
- Predefined unique page definitions including: about, admin, apps, angel-vc, blog, block, broadcast, compare, contact, dash, dex, e-com, faq, finance, fix, fixture, footstep, lang, leader, live, main, map, milestone, pages, payments, pros, rank, referral, remote, resource, routes, secure, sitemap, terms, trust, what, verifySig, when, where, who, why, ZKProof
- Controlled routes system for dynamic content management via whitelisted Secoinfi-Apps
- Three controlled routes: /broadcast, /remote, and /live with shell routes and dynamic content
- Sitemap resolution order: auto-generated pages first, then manual admin-priority pages, then runtime app-controlled pages
- Page uniqueness validation and collision prevention
- Audit logging with timestamps and admin principal tracking
- Optional versioning and Merkle hash metadata for audit trails

### Sitemap Management Interface
- Admin form on /sitemap and /admin pages for manual page management
- Text input for new page slug with validation (lowercase, unique, non-reserved)
- "Add Page" button for appending new pages to the manual pages array
- Read-only list displaying current pages with disabled system pages
- Integration with existing sitemap generation logic
- Real-time updates and backend synchronization
- Authentication required for sitemap management functions

### Calculation Tools (/calc page)
- Multi-tab profit scenario calculator
- Input parameters: number of users, deposit amounts, increments, profit percentages
- Interactive graphs showing potential earnings
- Comparison dashboard between Secoinfi model vs traditional systems
- System Comparison tab featuring:
  - Visual comparison chart using the Sec-ePay.png image
  - Detailed explanation of user payer deposits, running totals, and sorted pay-outs
  - Conversion rate information (1 USD = 90 INR)
  - Full promotional paragraph positioned directly above the "Why Choose Secoinfi?" heading:
    "Hi, 3 Billion Out of 8 Billion Global Users are YT Subscribers, But Earn Nothing. So to Bridge Digital, Economic Divide. We at #SECOINFI, Offer Lifetime Income to ALL Subscribers as Our Network of 109000 Users. Earn Early Bird Benefits by Subscribing to #SECOINFI with Subscription Amount sent to Our UPI ID secoin@uboi to get Unlimited Returns than Bank FDs by Sending the Txn ID / Receipt to https://wa.me/919620058644 / emailto:dild26@icloud.com. So Members must Bid before Monday with Min. Amount of Rs.10 Only in multiples of 10, To Get Loans at 0% Interest with NO Docs, Prefer Staking in ICP / e-Gold / SECOIN, etc. Pl. Visit https://sec-epay-am0.caffeine.xyz/calc for Millions of Immutable, Trust-less, Global Txns. Refer gPay at https://g.co/payinvite/Cq9dl #NaMoHind"
  - USP (Unique Selling Proposition) section highlighting Secoinfi advantages:
    - Transparency through blockchain-based verification
    - Merkle-root traceability for complete audit trails
    - Protection from fake e-chit operators
    - Automated transaction processing
    - Decentralized financial operations
    - Financial inclusivity and accessibility
- Publicly accessible without authentication

### Features Status Tracking (/features page)
- Dynamic status reporting with completion checkboxes
- Auto-select completion checkbox after each implemented task
- Second checkbox for admin-only validation
- Real-time status updates for development progress
- Publicly accessible without authentication

### Admin Dashboard
- Approve, reject, pause, or archive QRC submissions
- View active/inactive users and transaction history
- Validate transactions and manage time periods
- Update system parameters (conversion rates, subscription fees)
- Export transaction audit logs
- Manage leaderboard rotation settings
- Authentication required for all admin functions

### Admin Main Form (/main-form page)
- Admin-only access to system configuration
- Form fields for all updatable variables from backend modules
- Real-time data binding with onChange events for immediate updates
- Tabbed sections organized by backend modules:
  - Main configuration tab (main.mo variables)
  - Authorization/Access Control tab (authorization/access-control.mo variables)
  - User Approval tab (user-approval/approval.mo variables)
  - Terms Management tab for creating, previewing, and publishing new terms versions and admin notices
- Structured forms mirroring each module's data model
- Live preview of changes before saving
- Terms management interface with ability to mark updates as critical requiring user re-acceptance
- Authentication required for access

### Frontend Pages
- Home page with company branding (publicly accessible)
- About, blogs, dashboard, FAQ pages (publicly accessible)
- Terms page (/terms) displaying current terms of service, version history, admin notices, and change logs (publicly accessible)
- Sitemap page (/sitemap) with admin interface for manual page management (admin functions require authentication)
- Contact page with verified company information (publicly accessible):
  - CEO & Founder: DILEEP KUMAR D, CEO of SECOINFI
  - Primary Email: dild26@gmail.com
  - Business Phone: +91-962-005-8644
  - Website: www.seco.in.net
  - WhatsApp: +91-962-005-8644
  - Business Address: Sudha Enterprises, No. 157, V R Vihar, Varadaraj Nagar, Vidyaranyapura PO, Bangalore-560097
  - Payment Information: PayPal (newgoldenjewel@gmail.com), UPI ID (secoin@uboi), ETH ID (0x4a100E184ac1f17491Fbbcf549CeBfB676694eF7)
  - Social media links for Facebook, LinkedIn, Telegram, Discord, Blog, Instagram, X/Twitter, YouTube
  - Interactive map integration with "Click to view on map" and "Click on the map to open in Google Maps for directions" functionality
- Controlled routes (/broadcast, /remote, /live) with shell routes and dynamic content management
- Responsive navigation menu with extended sitemap including manual pages and terms link
- Footer updated with terms link and legal disclaimer
- Tooltip guidance for onboarding and transactions
- Real-time data tables with hover tooltips
- All pages support dynamic theme switching with consistent styling and default to VIBGYOR theme
- Terms acceptance modal that blocks app access until user accepts updated terms
- Admin notices section displaying active and archived notices
- Frontend routing guards that differentiate between public and restricted pages
- Login prompts only appear when accessing admin or subscription-related functionality
- Application content displayed in English

## Backend Data Storage
- User profiles and registration data
- Transaction records with timestamps and validation status
- Subscription data and payment history
- QRC information and broadcast schedules
- Leaderboard rankings and rotation cycles
- Admin settings and system parameters
- Merkle roots and transaction blocks for audit trails
- Feature completion status and validation flags
- Main form configuration variables organized by module
- Contact information and company details
- User theme preferences and settings with VIBGYOR as default
- Terms of Service versions with metadata (id, slug, version, title, effectiveDate, content, changelog, isPublic, criticalUpdate, createdByAdmin)
- User terms acceptance records (userPrincipal, termsVersionId, acceptedAt, metadata)
- Admin notices (title, body, type, effectiveDate, requiresAcceptance, linked terms version)
- Terms publication and acceptance audit logs
- Extended sitemap data structure with auto-generated pages, manual pages array, and controlled routes configuration
- Manual page definitions and admin authorization records
- Sitemap audit logs with timestamps and admin principal tracking
- Controlled route delegations and whitelisted Secoinfi-Apps configuration
- Page uniqueness validation records and collision prevention data
- Access control configurations for public vs restricted pages

## Backend Operations
- Process QRC-based payments and validate transactions
- Calculate running balances and generate transaction summaries
- Manage subscription cycles and leaderboard rotations
- Generate Merkle roots for transaction validation
- Handle currency conversions
- Process admin approvals and system updates
- Generate audit reports and transaction exports
- Update feature completion status and admin validation
- Handle main form configuration updates with real-time data binding
- Manage contact information and company details
- Provide module-specific configuration management for main.mo, authorization/access-control.mo, and user-approval/approval.mo
- Store and retrieve user theme preferences with VIBGYOR as default for new users
- Manage system comparison data and USP content
- Create and publish new terms of service versions
- Record user acceptance of terms linked to user principals
- Query latest terms and user acceptance status
- Manage admin notices with different priority levels
- Enforce terms acceptance for critical updates
- Provide immutable storage and retrieval of all terms versions
- Generate terms publication and acceptance audit trails
- Validate admin privileges for terms management operations
- Manage extended sitemap structure with manual page additions and controlled routes
- Validate page slug uniqueness and enforce naming conventions
- Process manual page additions with admin authorization checks
- Handle controlled route content delegation to whitelisted Secoinfi-Apps
- Generate sitemap audit logs and maintain version history
- Provide sitemap resolution with proper precedence order
- Manage Merkle hash metadata for sitemap versioning and audit trails
- Implement selective authentication checks for admin and subscription-related functions only
- Provide public data access for informational pages without authentication requirements
- Maintain existing access control roles while applying them selectively based on page access requirements
