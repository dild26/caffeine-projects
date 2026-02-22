# VoiceInvoice App for SECOINFI

## Overview
A blockchain-based temple management system that provides voice-enabled invoice creation, donation tracking, and audit capabilities for temple trusts with complete transaction traceability using Merkle tree verification. The system includes an advanced sitemap management system with admin-controlled page routing and Merkle-root auditing for transparency.

## Core Features

### Voice Invoice Creation
- Voice-to-text invoice generation supporting Malayalam, Hindi, English, and Kannada languages
- Automatic tax calculation (CGST, SGST) with religious donation exemptions
- Real-time invoice draft creation from voice input

### Pooja Ritual Management
- Itemized receipt system for specific pooja rituals
- Donor information collection including name and horoscope details
- Ritual categorization with personalized references
- Trust beneficiary account linking

### Blockchain Audit System
- Immutable transaction recording with Merkle tree structure
- Daily batch processing of transactions per trust
- Cryptographic proof generation for each transaction
- Hash-based donor identification showing first and last 4 characters

### Trust Governance Dashboard
- Transaction overview with recent donations and payments
- Tax reporting with automatic CGST/SGST calculations
- Exemption and rebate tracking based on government policies
- Administrative approval workflows

### Verification System
- Public verification interface for receipt authenticity
- Merkle proof validation using transaction hashes
- Digital signature verification for all receipts

### Advanced Sitemap Management System
- Dynamic sitemap with manual page array management
- Admin-only access control for page creation and modification
- Three-tier resolution order: system sitemap → manual pages array → app-controlled dynamic routes
- Merkle-root auditing for all sitemap changes with hash display (first/last 4 characters)
- Reserved keyword protection and validation for new pages
- Runtime-controlled routes for broadcast, remote, and live pages managed by Secoinfi-Apps delegation

## Access Control System
- Public access for all pages except admin and subscription-related sections
- Authentication required only for `/admin` routes and subscription management UI
- Access control guards protecting admin-only write, edit, and management operations
- Public visibility for pooja rituals, verification, sitemap, and general information pages
- Role-based verification for administrative privileges and sensitive operations

## Backend Data Storage
- Transaction records with amounts, taxes, and exemptions
- Donor information with generated hash identifiers
- Pooja ritual categories and pricing
- Merkle tree roots and cryptographic proofs
- Trust account information and beneficiary details
- Voice processing results and invoice drafts
- Manual pages array with admin-controlled entries
- Sitemap Merkle roots for audit trail
- User roles and admin permissions
- App delegation settings for runtime-controlled routes
- Public access permissions and route configurations

## Backend Operations
- Voice-to-text processing with multilingual support
- Automatic tax and exemption calculations
- Merkle tree generation and root anchoring
- Digital signature creation for receipts
- PDF receipt generation
- Transaction batch processing
- Cryptographic hash generation for donor identification
- Page array validation and uniqueness checking
- Merkle root calculation for sitemap changes
- Admin role verification for page management
- App delegation management for dynamic routes
- Public access validation and route permission checking

## User Interface Components
- Voice input interface with language selection
- Transaction dashboard with hash snippets (e.g., ab12...fe45)
- Receipt download functionality
- Verification page for Merkle proof checking
- Administrative panels for trust management (admin-only)
- Audit trail viewing with immutable records
- Admin sitemap management form at /sitemap and /admin routes (admin-only)
- Page slug input with validation (admin-only)
- Add Page button for admin users only
- Public read-only list of existing pages for all users
- System-reserved routes display (non-editable)
- Merkle hash display for sitemap audit trail
- Runtime-controlled route indicators for broadcast, remote, and live pages
- Public pooja ritual browsing and information display
- Publicly accessible verification interface

## Admin Features
- Strict access control for sitemap management
- Page slug validation with reserved keyword protection
- Manual page array management with uniqueness enforcement
- Merkle-root auditing for transparency of sitemap changes
- App delegation control for runtime-controlled routes
- Three-tier sitemap resolution system integration
- Subscription management interface (admin-only)
- Administrative dashboard with role verification

## Public Features
- Open access to pooja ritual information and categories
- Public verification system for receipt authenticity
- General temple information and services display
- Publicly accessible sitemap viewing
- Voice invoice creation interface (public)
- Transaction verification without authentication requirements

## Compliance Features
- Government-compliant tax reporting
- Religious donation exemption handling
- Immutable audit trail maintenance
- Digital receipt generation with cryptographic signatures
- Transparent sitemap change tracking with Merkle proofs
- Public transparency through open access to verification systems
