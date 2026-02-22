# Domain Management Web Application

## Overview
A web application for managing and organizing domain URLs with automated generation, manual import/export capabilities, and community-driven ranking through voting.

## Core Features

### Multi-Tab Features Page
The main page contains multiple tabs, each providing:

#### Domain Generation
- Button to auto-generate domain URLs
- Options for automated generation:
  - Cron job scheduling
  - On-click manual generation
  - Configurable time delays between generations

#### Import/Export Functionality
- Manual upload of domain lists in multiple formats:
  - CSV files
  - JSON files
  - Markdown files
  - Other common text formats
- Export current domain collection in the same supported formats
- Data interaction capabilities for uploaded content

#### Voting System
- Upvote/downvote controls for each domain/website
- Click tracking for usage frequency
- Automatic sorting based on:
  - Vote rankings (highest voted first)
  - Most frequently clicked/accessed domains

### Terms Page
Dedicated page containing:
- Compliance information
- Data privacy policies
- Terms of service

## Access Control and Authentication

### Public Pages
All pages are publicly accessible without authentication except for admin and subscription-related pages:
- Main features page with domain management
- Terms page
- About, apps, FAQ, trust pages
- General navigation and content

### Admin-Protected Pages
Require Internet Identity authentication with admin role verification:
- Admin dashboard (`/admin`)
- Sitemap management (`/sitemap`)
- Broadcast controls (`/broadcast`)
- Remote management (`/remote`)
- Live controls (`/live`)

### Subscription-Protected Pages
Require user login or active subscription:
- Payment pages (`/payments`)
- Pro features (`/pros`)
- Angel VC access (`/angel-vc`)

### UI Access Indicators
- Lock icons or notice text displayed for restricted content when accessed by non-authorized users
- Clear visual indicators showing access level requirements
- Conditional rendering based on user authentication status and role

## Backend Data Storage
The backend must store:
- Domain URLs and their metadata
- Vote counts (upvotes/downvotes) for each domain
- Click/usage frequency counters
- User interaction history for ranking calculations
- User authentication data and role assignments
- Admin role permissions and access controls

## Backend Operations
- Generate domain URLs (either scheduled or on-demand)
- Process file uploads and parse different formats
- Update vote counts and click frequencies
- Calculate and maintain domain rankings
- Export data in requested formats
- Authenticate users via Internet Identity
- Verify admin roles and permissions
- Manage subscription status and access rights

## UI Structure
The interface should be modular with clear sections for:
- Automation controls (generation settings)
- Import/export tools
- Voting interface
- Sorting and ranking display
- Navigation between public and protected pages
- Authentication status indicators
- Access control visual cues

## Language
All application content and interface elements in English.
