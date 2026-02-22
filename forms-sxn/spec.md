# Dynamic e Forms Application

## Overview
A schema-driven forms application that dynamically generates and renders forms based on configurable schemas. The application supports various input types, real-time calculations, validation, and cryptographic verification of form submissions. Features a comprehensive e-commerce portal interface with multi-tab management, theme customization, robust canister cycle management for Internet Computer deployment, and advanced sitemap management with admin-controlled page routing. Most pages are publicly accessible without authentication, with only admin and subscription-related areas requiring login.

## Core Features

### Dynamic Form Generation
- Generate forms from JSON/YAML schemas containing field definitions
- Support multiple input types: text, number, email, checkbox, radio buttons, switches, select dropdowns
- Auto-generate field labels from field names with bold formatting
- Render form headers as bold h2 elements
- Handle array fields by generating multiple input instances based on specified count

### Schema Management and Import
- Import JSON schemas from https://formio.github.io/formio.js/app/examples/
- Display imported schemas as selectable indices in the "Create Form Schema" section
- Schema JSON catalog section for defining and previewing each form schema in JSON format
- Schema import/export functionality for YAML and JSON formats
- Robust schema validation and normalization ensuring all expected arrays (fields, validations, options, calculations, visibilityRules) are present
- Default missing arrays to empty arrays to prevent runtime errors
- Comprehensive error handling for malformed or incomplete schemas with clear user feedback
- Schema normalization to match internal structure requirements for imported schemas from Form.io and other sources
- Deduplication and optimization processes for spec.md and YAML schema files by merging duplicate definitions and removing redundant metadata

### Multi-Tab Interface and E-Commerce Portal
- Tab-based interface where clicking an e-form opens its code in a new tab
- Tab labels display the e-form name with actions: add, edit, update, archive, and delete
- Code preview for public users, full code access for admins and subscribers
- Paginated navigation system with first and last page links
- Portal pre-filled with test data from JSON fixtures
- Display fields: id, app, template, title, url, created_at, content_hash, nonce, merkle_leaf, verification_status

### Access Control and Authentication
- Public access to most pages including forms, portal, about, contact, blog, and general content
- Restricted access to admin routes (`/admin`, `/subscriptions`) requiring authenticated users with `onlyAdmin` or `subscriber` roles
- Navigation guards that allow anonymous browsing of public pages while protecting privileged routes
- Session validation only required for restricted admin and subscription areas
- UI visibility controls that show appropriate content based on user authentication status

### Advanced Sitemap Management
- Extended sitemap functionality with parallel `pages[]` array containing unique prioritized routes
- Public pages marked as accessible anonymously in sitemap data
- Strict access control ensuring only admin users can manually append to, update, or remove items from the `pages[]` array
- "+ Add Page" form UI at `/admin` and `/sitemap` routes exclusively for admin users
- Form validation for new pages: lowercase enforcement, no spaces, uniqueness checks, reserved keyword protection
- Existing sitemap generation logic preserved with additive merging of `pages[]` content
- Admin-defined page order maintained in sitemap output
- Runtime-controlled pages (`/broadcast`, `/remote`, `/live`) managed by whitelisted Secoinfi-Apps with admin authorization required for bindings
- Read-only display of current `pages[]` list with admin-only controls for adding new entries
- System-protected routes cannot be edited or deleted by users
- Access policy transparency in sitemap manager UI showing public vs restricted route classifications
- Optional audit metadata (Merkle root, timestamp, admin signature) for each manual page addition for version tracking and verification

### Canister Management and Build Optimization
- Real-time canister status monitoring displaying cycle balance, memory usage, and deployment type
- Low cycle balance detection with user-friendly warning notifications
- Deployment failure handling with clear guidance for resolution
- Instructions for common deployment issues including cycle top-up procedures, memory allocation adjustments, and deployment type changes
- Automated build pipeline with compression of node_modules folder using Brotli or gzip compression
- Dependency optimization with latest stable and lightweight versions
- Tree-shaking and code-splitting during build to minimize bundle size
- Automated post-build reporting displaying total compressed size, number of unique packages, and space savings achieved

### Theme System and User Interface
- VIBGYOR theme implementation with theme toggle button supporting Light, Dark, and VIBGYOR themes
- Consistent theming across all interface components
- Automatically detect and convert text containing ://, @, or similar patterns into clickable links
- Infer numeric field types (integer, float, unsigned) from schema definitions
- Perform live calculations on numeric fields with formula display and real-time results
- Show units and apply rounding rules as specified in schema

### Form Management and Validation
- Multi-filter system: deduplicate entries, filter by type/tag/date range
- Sorting options: alphabetical (A-Z, a-z), numeric (0-9), by date, by length, custom sorting
- Conditional field visibility based on other field values
- Multi-layered validation: required fields, pattern matching, min/max values, enum validation
- Cross-field validation and uniqueness checks
- Display explicit error messages with accessibility support (aria-live="polite")
- Real-time validation feedback as users interact with forms

### Cryptographic Security and Accessibility
- Generate Merkle root hash for all field IDs and values (sorted A-Z, a-z, 0-9)
- Create per-field nonces using hash of fieldId, timestamp, and salt
- Include manifestHash, merkleRoot, nonces, timestamp, and signature in submissions
- Provide Merkle proof paths for field inclusion verification
- Support user/device signing and admin countersigning
- Full accessibility compliance with proper id, for, and aria-* attributes
- Responsive design for all screen sizes
- Offline-first functionality and multi-device compatibility
- Application content language: English

## Backend Data Storage
The backend stores:
- Form schemas with field definitions, validation rules, and calculation formulas
- Imported JSON schemas from external sources
- Form submissions with all field values and cryptographic verification data
- User sessions and authentication data with role-based permissions (public, admin, subscriber)
- Test data fixtures with complete field sets
- Tab management data, user preferences, and theme preferences
- Audit logs of all form interactions and submissions
- Canister metrics including cycle balance, memory usage, and deployment configuration
- Build optimization metadata and compression statistics
- Deduplicated schema definitions and optimized YAML configurations
- Sitemap data structure with automatic and manual page arrays
- Manual pages array with admin-defined prioritized routes
- Page access control metadata distinguishing public vs restricted routes
- Controlled routes configuration for runtime-managed pages
- Secoinfi-Apps whitelist and authorization bindings
- Audit metadata for manual page additions including Merkle roots, timestamps, and admin signatures

## Backend Operations
- Fetch and import JSON schemas from https://formio.github.io/formio.js/app/examples/
- Create, read, update, and delete form schemas
- Store and retrieve form submissions with full cryptographic verification
- Generate and validate Merkle proofs for submitted data
- Handle user authentication and authorization with role-based access control for restricted routes only
- Allow anonymous access to public routes without session validation
- Manage tab operations and store user theme preferences
- Provide paginated data for e-commerce portal interface
- Maintain audit trails for compliance requirements
- Monitor canister cycle balance and memory usage
- Track deployment status and handle deployment failures
- Generate deployment error reports with actionable resolution steps
- Process schema deduplication and optimization operations
- Execute build pipeline compression and optimization tasks
- Generate post-build reports with size metrics and optimization statistics
- Manage sitemap data with automatic generation and manual page administration
- Validate and store manual page additions with uniqueness and format checks
- Handle controlled route authorization for Secoinfi-Apps bindings
- Generate audit metadata for manual page operations
- Enforce admin-only access control for sitemap management operations
- Maintain access policy metadata for route classification and transparency

## Sitemap Data Model
The backend maintains sitemap data in the following structure with access control classifications for public and restricted routes.
