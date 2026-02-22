# Multi Apps Unify App

## Overview
Multi-Apps-Unify App is a platform management application that provides two-way synchronization between YAML and Markdown specification files, with admin controls for manual synchronization triggers and centralized route-level authentication. The application dynamically populates Secoinfi-Apps data from spec.yaml into the Apps tab, sitemap page, and global search menu with structured grid display and real-time app counting.

## Core Features

### Specification File Management
- The application manages two specification files: `spec.yaml` and `spec.md`
- `spec.yaml` serves as the authoritative source of truth for all configurations and specifications
- `spec.md` provides a human-readable markdown representation of the specifications
- Both files are stored and managed in the backend
- `spec.yaml` contains a Secoinfi-Apps list with 26 entries that is used throughout the application
- Each Secoinfi-App entry includes name, description, and external URL field

### Two-Way Synchronization with Duplicate Cleanup
- Real-time synchronization ensures changes to `spec.yaml` automatically propagate to `spec.md`
- The synchronization process converts YAML structure to formatted markdown content with automatic duplicate removal
- The `syncToMarkdown()` function includes deduplication logic to ensure each Secoinfi-App or configuration item appears only once in the generated markdown
- All application functionality and configurations respect the data defined in `spec.yaml`
- Synchronization status is tracked and displayed to users
- Changes to the Secoinfi-Apps list in `spec.yaml` automatically update the Apps tab, sitemap page, and global search menu in real-time
- `spec.md` is regenerated with clean, unique entries every time synchronization occurs (both real-time and manual)

### Dynamic Secoinfi-Apps Integration with Grid Display
- The Secoinfi-Apps list with all 26 entries is parsed from `spec.yaml` and the total count is calculated
- Apps are displayed under the "26+ Secoinfi-Apps" tab (`/Apps` page) in a structured grid format
- Each app entry shows name, description, and external link (url field) in English
- The total app count ("26+ Secoinfi‑Apps") is visibly displayed at the top of the /Apps page header
- The same Secoinfi-Apps data is displayed on the `/sitemap` page grouped under a "Secoinfi‑Apps" section with clickable links and app counts
- All Secoinfi-App names are integrated into the global menu search functionality
- Real-time updates ensure that changes to `spec.yaml` immediately reflect in all three locations (Apps tab, sitemap page, and searchable menu)
- The `/Apps` tab remains a public page with no authentication required (`requiresAuth: false`)
- The `/sitemap` page remains a public page with no authentication required (`requiresAuth: false`)

### Route-Level Authentication System
- Central authentication middleware runs on every navigation
- Authentication is enforced only on routes under `/admin`, `/settings/admin`, or routes explicitly marked with `requiresAuth: true` in `spec.json`
- Each route definition in `spec.json` includes `requiresAuth` (default: false) and `role` ("public" or "admin") properties
- Admin and sensitive routes are marked with `requiresAuth: true` and `role: "admin"`
- Unauthenticated users accessing protected routes are redirected to login page
- Routes with `requiresAuth: false` are accessible to anonymous users
- Authentication rules apply to sitemap-driven pages, tabs, and sub-tabs
- Anonymous users can browse public content (Home, Blog, Pros, Apps, "26+ Secoinfi-Apps", Sitemap, etc.) without login requirements

### Admin Dashboard with Cleanup Controls
- Admin-only access control restricts sensitive operations to authorized users
- Dashboard provides overview of current synchronization status
- Manual "Sync" button allows administrators to trigger synchronization on demand
- Manual "Clean Duplicates" button allows administrators to trigger Markdown regeneration with duplicate removal
- Displays last synchronization timestamp and status
- Protected by route-level authentication requiring admin role

### File Operations
- Backend stores both `spec.yaml` and `spec.md` files
- Support for reading, updating, and retrieving both specification files
- Version tracking for changes made to specification files
- Backup and restore capabilities for specification files
- Duplicate detection and removal during markdown generation

## Backend Data Storage
- Specification files (`spec.yaml` and `spec.md`)
- Secoinfi-Apps list data from `spec.yaml` with all 26 parsed app details (names, descriptions, external URLs)
- Route configuration with authentication requirements (`spec.json`)
- User authentication data and session management
- Synchronization logs and timestamps
- Admin user permissions and access controls
- File version history and change tracking
- App count calculations and grid display data

## Backend Operations
- File read/write operations for specification files
- Secoinfi-Apps list parsing, counting, and serving from `spec.yaml` with all 26 entries
- App data extraction including names, descriptions, and external URLs in English
- Route configuration management for authentication rules
- User authentication and session validation
- YAML to Markdown conversion processing with duplicate removal logic
- Synchronization trigger and status management
- Admin authentication and authorization
- File backup and version control operations
- Real-time data updates for Secoinfi-Apps changes
- App count calculation and grid formatting operations
- Global search functionality for Secoinfi-App names
- Duplicate detection and cleanup operations for markdown generation
- Manual cleanup trigger processing for admin users

## User Interface
- Central authentication middleware for route protection
- Login page for authentication when accessing protected routes
- Admin dashboard with synchronization controls and cleanup options (admin-only)
- File content viewers for both YAML and Markdown formats
- Synchronization status indicators
- Manual sync trigger button (admin-only)
- Manual "Clean Duplicates" button for markdown regeneration (admin-only)
- File history and change log display
- Public navigation menu accessible to anonymous users
- Sitemap-driven navigation respecting authentication requirements
- Dynamic Apps tab displaying all 26 Secoinfi-Apps from `spec.yaml` in structured grid format (public access, `requiresAuth: false`)
- "26+ Secoinfi‑Apps" count display at the top of the /Apps page header
- Grid layout showing app names, descriptions, and external links (url field) in English
- Sitemap page showing Secoinfi-Apps list grouped under "Secoinfi‑Apps" section with clickable links and app counts (public access, `requiresAuth: false`)
- Global search menu integration with all Secoinfi-App names for searchability
- Real-time UI updates when `spec.yaml` changes including count and grid refresh across Apps and Sitemap pages
