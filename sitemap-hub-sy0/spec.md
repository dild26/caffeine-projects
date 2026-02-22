# Sitemap Subscription Platform

## Overview
A comprehensive sitemap search and subscription platform that allows users to search through sitemaps with tiered access levels and subscription-based features.

## Authentication & User Management
- Internet Identity authentication integration
- Role-based access control with two roles: admin and user
- User profile management with subscription status tracking
- Authentication required only for restricted pages: `/admin`, `/feature-checklist`, `/dashboard`, and `/subscription`

## Public Access System
- All pages are publicly accessible without login except admin and subscription-related pages
- Public pages include: home, sitemap, about, contact, referrals (read-only view), and all custom manual pages from `pages[]`
- Authentication prompts displayed only for restricted pages or actions
- Backend provides public endpoints for accessing sitemap data, referral information, and manual pages without authentication

## Subscription System
- Three subscription tiers: Basic ($9/month), Pro ($45/month), Enterprise ($99/month)
- Pay As You Use option for non-subscribers
- Stripe payment integration for subscription management with secure payment session creation and verification
- Subscription status affects search result limits and feature access
- Subscription upgrade/downgrade management

## Sitemap Management
- Admin can upload sitemaps in JSON and XML formats
- Backend stores all sitemap data with full URL path indexing
- Sitemap data includes URLs, metadata, and categorization
- Extended sitemap data model with additive `pages[]` array for manual page entries
- Manual pages array enforces no duplication, preserves admin-defined order for priority
- Non-admins cannot delete or overwrite auto-generated sitemap nodes
- Controlled routes object mapping `/broadcast`, `/remote`, and `/live` to whitelisted "Secoinfi-Apps" with validation
- Route resolution priority: existing sitemap → manual pages → app-controlled routes
- Backup and restore functionality for sitemap data
- Public access to sitemap data and manual pages without authentication

## Search Functionality
- Public search with limited results for non-subscribers
- Enhanced search for authenticated users based on subscription tier
- Dual search fields with debounced input
- Full URL path search capabilities
- TLD filtering with real-time URL count display
- Advanced pagination with first/last/previous/next navigation and direct page input

## Admin Panel
- Sitemap upload and management interface
- Manual page management form with text input for new page slugs (lowercase, unique, validated)
- Submit button labeled "+ Add Page" for adding manual pages
- Read-only list displaying existing manual pages
- Admin-only access to manual page creation functionality
- User management and subscription oversight
- Payment configuration management
- System backup and restore controls
- Feature checklist page for implementation tracking
- Analytics dashboard for platform usage
- Restricted to authenticated admin users only

## Referral System
- Multi-level referral program with commission tracking
- Real-time analytics for referral performance
- Token-based payout management
- Export capabilities for referral data in CSV, XLSX, JSON, and ZIP formats
- Public read-only view of referral information without authentication

## Link Preview System
- Secure link preview functionality with object-based rendering
- Internet Archive integration as fallback
- Screenshot capture fallback option
- Progressive loading in responsive modal interface

## User Interface & Navigation
- Responsive design for all device types
- Fixed top and bottom navigation with collapsible sidebar
- Theme switching capability (light/dark modes)
- WCAG 2.1 AA accessibility compliance
- Modern UI with Tailwind CSS styling
- Router configuration enforces public access to most pages with authentication guards only on restricted pages

## Public Pages
- God's Eye summary page showing platform statistics
- About page with business information
- Contact page with social media and payment links
- All content displayed in English

## Data Persistence
Backend stores:
- User profiles and authentication data
- Subscription information and payment history
- Sitemap data with full indexing
- Manual pages array with unique entries and preserved order
- Controlled routes object with whitelisted app mappings
- Referral relationships and commission data
- System configuration and settings
- Analytics and usage data
- All data persisted in stable variables with upgrade hooks
- Public endpoints for accessing non-sensitive data without authentication

## Payment Integration
- Secure Stripe integration with environment variable management for API keys
- Payment verification and webhook handling
