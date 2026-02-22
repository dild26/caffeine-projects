# Secoinfi Sitemap Management Application

## Overview

A sitemap management application that provides both automatic and manual page routing with admin controls. The application manages page routing through multiple layers: automatic discovery, manual admin-controlled pages, and controlled routes for specific applications.

## Core Features

### Sitemap Management
- Multi-layered sitemap resolution with priority order: automatic > manual pages > controlled routes
- Admin-only manual page management with validation and access controls
- Protected controlled routes for Secoinfi-App integration
- Real-time sitemap updates and persistence

### Admin Interface
- Admin-only form for adding new page slugs to the manual pages array
- Validation for lowercase, unique, and non-reserved page slugs
- Read-only display of existing manual pages
- Prevention of modification/deletion of controlled routes

### Access Control
- Admin-only write access to manual pages array
- Public access to all pages except admin and subscription-related sections
- Admin and subscription-related sections require login authentication
- Public and app-level read-only access to sitemap data
- Protected controlled routes that cannot be modified through admin interface

## Data Models

### Sitemap Structure
The backend stores sitemap data with the following structure:
- `auto`: Automatically discovered pages
- `manualPages`: Admin-controlled array of page slugs with predefined prioritized pages
- `controlledRoutes`: Fixed routes controlled by Secoinfi-Apps with mappings

### Manual Pages Array
Initial manual pages include: "about", "admin", "apps", "angel-vc", "blog", "block", "broadcast", "compare", "contact", "dash", "dex", "e-com", "faq", "finance", "fix", "fixture", "footstep", "lang", "leader", "live", "main", "map", "milestone", "pages", "payments", "pros", "rank", "referral", "remote", "resource", "routes", "secure", "sitemap", "terms", "trust", "what", "verifySig", "when", "where", "who", "why", "ZKProof"

### Controlled Routes
Fixed mappings: "broadcast": "Secoinfi-App", "remote": "Secoinfi-App", "live": "Secoinfi-App"

## Backend Operations

### Sitemap Data Management
- Store and retrieve sitemap structure with all three components
- Validate new page slug additions (lowercase, unique, non-reserved)
- Append new slugs to manual pages array
- Prevent modification of controlled routes through admin interface
- Maintain sitemap resolution priority order
- Implement optimized rebuild methods for deployment reliability
- Ensure actor integrity during redeployment sequences

### Access Control Enforcement
- Verify admin permissions for write operations to admin and subscription-related sections
- Allow public access to all other pages without login requirements
- Allow read-only access for public and app-level requests
- Protect controlled routes from unauthorized modifications

## User Interface

### Admin Routes
- Admin interface accessible at both `/admin` and `/sitemap` routes with login requirement
- Form with text input for new page slug entry
- "+ Add Page" button for appending validated slugs
- Read-only list display of existing manual pages
- Clear indication of protected controlled routes

### Public Access
- All pages except admin and subscription-related sections accessible without login
- Content displayed in English language
- Optimized frontend asset compilation with dependency optimization

### Validation and Feedback
- Real-time validation of page slug format and uniqueness
- Error messages for invalid or duplicate entries
- Success confirmation for successful additions
- Visual distinction between manual pages and controlled routes

## Technical Requirements

- Strict slug validation (lowercase, alphanumeric with hyphens)
- Uniqueness checking across all sitemap layers
- Persistence of manual pages array without affecting existing sitemap structure
- Resolution order enforcement: auto > manualPages > controlledRoutes
- Admin authentication and authorization for write operations on protected sections
- Optimized build cache parameters and dependency management
- Best-practice Internet Computer canister deployment sequence
- English language content throughout the application
