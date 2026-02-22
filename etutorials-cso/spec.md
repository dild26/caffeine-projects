# E Tutorial MVP Demo

An educational tutorial platform for managing educational resources, instructors, learners, and appointments with CSV-based data management and hashtag search functionality.

## Authentication and Access Control
- Public access to all navigation, content pages, search, and browsing features
- Internet Identity authentication required only for:
  - Admin dashboard and resource approvals
  - Appointment booking and progress tracking
  - Page management (add/edit/delete pages)
  - Admin validation features
- Minimized, compact login page with responsive design
- Admin role verification for approval workflows

## Data Management System
- Upload and parse CSV files: resources.csv, instructors.csv, learners.csv, indices.csv, appointments.csv
- Support additional formats: JSON and MD files
- Store all parsed data in backend with validation
- Automatic fee conversion from Rs to USD (Rs / 90 = USD)
- Merkle root nonce mechanism for booking optimization
- Real-time synchronization between learners, instructors, and schedules

## Resource Management
- Resource catalog organized by categories (hardware, software, etc.)
- Resource matrix viewer grouped by category
- Admin verification workflow for new resources
- Hashtag tagging system with "In-Sync" status tracking
- Resources represented as arrays mapping books to topics

## Search and Discovery
- Hashtag-based search for resources and instructors
- Filter by category, duration, and fees
- Display instructor availability and resource topics
- Keyword-based filtering across all menu items

## Appointment and Progress Systems
- Booking form capturing learner, instructor, resource, and time slot details
- Track learner progress by topic, pace, language, and difficulty level
- Store appointment and progress data in backend

## Navigation and Routing System
- Complete A-to-Z searchable navigation menu in header
- Clickable logo redirecting to homepage
- Client-side routing with comprehensive validation
- Dedicated sitemap page displaying all navigation structure
- Auto-generated pages: about, blog, contact, dashboard, faq, features, pros, referral, sitemap, terms, who, what, why
- Clone navigation structure from https://etutorial-lgc.caffeine.xyz/
- Store navigation items and sitemap data in backend via getNavigationItems query

## Dynamic Page Management
- Admin-only +Add Pages button for creating new page links
- Hover to edit functionality for inline page updates
- Delete button beside menu items for page removal
- Real-time updates to sitemap and navigation
- AI-generated content for missing pages
- Store page modifications with timestamp logging

## Theme System with Accessibility
- Three themes: VIBGYOR, Dark, Light with smooth switching
- WCAG AA compliant contrast validation system
- Automatic contrast ratio calculations and adjustments
- Theme persistence for authenticated users in backend, localStorage for guests
- Real-time UI switching with validation
- Automatic fallback to contrast-safe colors
- Store theme preferences and validation results in backend

## App Initialization and Validation
- Mandatory initialization sequence validating critical data before rendering
- Pre-render validation for navigation items, theme data, and routing
- Automatic detection and correction of missing data
- Loading screen with progress indicators during validation
- Error boundary implementation with fallback UI
- Timeout mechanisms with fallback to cached data
- Runtime validation checking for missing components
- Auto-correction system for navigation and theme issues

## Features Validation System
- Features page displaying comprehensive list of implemented features
- Dual validation checkboxes per feature:
  - AI Validation: automatically marked when feature detected
  - Admin Validation: manually controllable by authenticated admins
- Store validation states permanently in backend
- Feature categories include menu visibility, sitemap pages, theme system, navigation, content management, search, authentication, data management

## Contact Integration
- Embed external contact page from https://networth-htm.caffeine.xyz/contact via iframe
- Store local contact details in backend
- Periodic verification with external data source
- Automatic sync with change detection and status indicators
- Graceful error handling with fallback static view

## Error Handling and Monitoring
- Comprehensive error boundary implementation
- Fallback UI components for failed operations
- Automatic error logging and reporting
- Progressive fallback system with recovery mechanisms
- Store error logs and failure patterns in backend
- Proactive monitoring with automatic alerts
- Performance monitoring and user interaction logging

## Backend Data Storage
- CSV parsed data and user records
- Static page content and metadata
- Navigation structure and menu data
- Theme data and validation status
- Contact details and synchronization metadata
- Feature validation states
- Page modification logs with timestamps
- Error logs and performance monitoring data
- App initialization and validation results
- WCAG compliance data and contrast measurements

## Frontend Interface
- File upload interface for data imports (admin only)
- Dynamic resource matrix viewer with category grouping
- Search bar with hashtag support and filtering
- Searchable navigation menu displaying complete index
- Admin dashboard for approvals (admin only)
- Progress dashboard and appointment booking (authenticated users)
- Theme selector with real-time switching
- Features page with validation checkboxes
- Contact page with sync indicators
- Error handling UI with recovery options
- Loading states and validation feedback
- Page management interface (admin only)
- Accessibility-compliant design across all themes
