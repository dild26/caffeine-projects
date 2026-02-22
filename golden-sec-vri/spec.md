# Gold‑N‑Secoinfi App

## Overview
A decentralized micro-investment dApp for ICP-based investments with gold tracking capabilities, featuring round-ups, recurring investments, and yield generation with comprehensive KYC integration and admin controls. Now includes an extensible sitemap management system for dynamic page routing with public access to general content.

## Frontend Features

### Authentication & User Management
- Internet Identity login integration (optional for general browsing)
- KYC badge integration for investment features with access gating
- User role management (regular user vs admin)
- KYC status display (NotStarted, Pending, Approved, Rejected)

### Public Access Pages
All pages are publicly accessible without authentication except Admin and Subscription-related pages:
- **Dashboard**: User portfolio overview, live APY display, TVL (Total Value Locked), balance display, investment value, pool statistics (public view available)
- **Round-Ups**: View feature information and simulate external purchases (investment requires authentication)
- **Plans**: View recurring investment plan information (configuration requires authentication)
- **Transactions**: Public transaction statistics (personal history requires authentication)
- **General Pages**: All sitemap-managed pages accessible to public users

### Restricted Access Pages
Authentication and role-based access required:
- **Admin Panel**: System controls for parameter configuration (admin users only)
- **Sitemap Management**: Admin-only interface for managing custom pages and viewing controlled routes
- **Subscription-related Pages**: All subscription functionality gated behind authentication

### Core Functionality
- Public browsing of platform information and statistics
- Deposit ICP to user wallet (requires authentication)
- Manual and automatic micro-investments (requires authentication and KYC)
- Investment redemption with optional early exit fees (requires authentication)
- Balance display in both ICP and gold milligram equivalent (requires authentication)
- Real-time pool statistics and yield/APY display (public)
- KYC-gated access to investment features

### Admin Controls
- Configure minimum deposit amounts
- Set APY percentages and yield parameters
- Adjust buy/sell spreads and investment thresholds
- Manage user KYC status and approvals
- Emergency pause/resume functionality
- Set gold price for mg equivalent calculations
- System parameter configuration interface
- Manage sitemap pages through dedicated UI form
- Configure Secoinfi-Apps whitelist for controlled routes

### Sitemap Management Interface
- Accessible at both `/sitemap` and `/admin` routes (admin-only for editing)
- Public viewing of static pages available to all users
- Single text input field for "Page Slug" with validation (admin only)
- "+ Add Page" button for adding new manual pages (admin only)
- Read-only list displaying all existing pages (public view available)
- Automatic enforcement of lowercase, uniqueness, and reserved-word validation
- Display of non-editable controlled routes (/broadcast, /remote, /live)

### Navigation & Access Control
- Header navigation shows all available pages to public users
- Login prompt only appears when accessing restricted features
- Admin users retain full administrative console access
- Conditional rendering based on authentication status and user role
- Route guards enforce access control for Admin and Subscription pages only

### UI Design
- Gold-themed responsive design consistent with MoAP-style layout
- Professional investment platform appearance
- Intuitive navigation and user experience
- Clear distinction between public and authenticated features

## Backend Data Storage

### User Registry
- User profiles with Internet Identity principals
- KYC status tracking and approval workflow
- Admin role assignments and permissions
- Access control based on KYC status for investment features

### Wallet Management
- User ICP deposits and available balances
- Individual user subaccount management
- Transaction history and comprehensive audit trails

### Investment Pool (GNST)
- GNST share token management (internal token system)
- Pool share pricing and valuation
- Investment and redemption processing with exit fees
- Total value locked (TVL) tracking
- Upgrade-safe storage structures

### Rewards System
- Deterministic yield calculation and distribution
- APY model implementation with configurable parameters
- User reward balance tracking
- Daily yield accrual processing

### Analytics
- Aggregated platform metrics (public access)
- Historical yield data (public access)
- User count and engagement statistics (public access)
- Performance tracking

### Sitemap Management
- Manual pages array storage with canonical structure: ["about","admin","apps","angel-vc","blog","block","broadcast","compare","contact","dash","dex","e-com","faq","finance","fix","fixture","footstep","lang","leader","live","main","map","milestone","pages","payments","pros","rank","referral","remote","resource","routes","secure","sitemap","terms","trust","what","verifySig","when","where","who","why","ZKProof"]
- Controlled routes mapping with "Secoinfi-App" designation for /broadcast, /remote, and /live
- Secoinfi-Apps whitelist for authorized app control
- Page validation and uniqueness enforcement

## Backend Operations

### Public Data Access
- Provide public read access to platform statistics and general information
- Serve public pages and general content without authentication
- Maintain public pool statistics and yield information

### Investment Flow
- Process user deposits into investment pool (requires authentication)
- Mint GNST shares based on current pool pricing (requires authentication and KYC)
- Apply configured buy/sell spreads
- Handle redemption requests with exit fee calculations (requires authentication)
- KYC verification for all investment operations

### Yield Generation
- Daily deterministic yield application
- Credit earned rewards to user accounts
- Maintain yield history for transparency (public access to aggregated data)
- Configurable APY parameters

### Round-Up Processing
- Accumulate simulated purchase round-ups (requires authentication)
- Auto-invest when user-defined thresholds are met (requires authentication)
- Track round-up sources and amounts

### Recurring Investments
- Process scheduled investment plans (requires authentication)
- Handle manual execution of recurring buys (requires authentication)
- Manage plan configuration and status

### Admin Operations
- Parameter configuration for APY, spreads, minimum deposits (admin only)
- KYC management and user approval workflows (admin only)
- System pause/resume controls (admin only)
- Audit log access and monitoring (admin only)

### Sitemap Operations
- Public read access to sitemap pages and general content
- Admin-only functions to append and remove entries from manual pages
- Lowercase conversion and uniqueness validation
- Reserved-word validation to prevent conflicts
- Controlled route management for Secoinfi-App designated paths
- Secoinfi-Apps whitelist management
- Sitemap resolution with priority: auto-generated → manual pages → app-controlled routes

### Access Control Enforcement
- Distinguish between public read operations and authenticated mutations
- Ensure no unauthorized data modification through public access
- Maintain security for investment operations and admin functions
- Validate user authentication and roles for restricted operations

## Security Requirements
- Integer-based math to prevent precision errors
- Comprehensive race condition protection for concurrent operations
- Immutable transaction logging for full auditability
- Principal-based access control for admin functions and investment operations
- Input validation and overflow prevention
- Secure KYC data handling
- Access control enforcement for sitemap management operations
- Public access validation to prevent unauthorized mutations
- Clear separation between public read access and authenticated operations

## Technical Specifications
- Modular Motoko canister architecture (registry, wallet, investment pool, rewards, analytics, sitemap)
- Upgrade-safe storage structures for future enhancements
- Public read APIs for portfolio and pool data
- Authenticated APIs for investment and admin operations
- Preparation for future ICRC-1 GNST tokenization
- Support for future custodian integrations
- Comprehensive error handling and user feedback
- English language content throughout the application
- Non-breaking additive sitemap extension maintaining backward compatibility
- Route-based access control with public and restricted sections

## Future Compatibility
- ICRC-1 token standard preparation for GNST
- Custodian integration readiness
- Scalable architecture for additional features
- Extensible sitemap system for dynamic routing needs
- Flexible access control system for future feature expansion
