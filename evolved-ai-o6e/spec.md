# Evolved AI Scaffold Platform

## Overview
A modular scaffold platform with a secure main-form admin page that provides real-time editing capabilities for all backend variables through dynamic, reactive forms with live synchronization and multi-admin collaboration support.

## Core Architecture

### Main Admin Module (main.mo)
- Central super-admin module that controls all other modules in the system
- Stores global configuration state and module relationships
- Manages dynamic module generation and updates
- Handles fixture imports and blueprint processing
- Provides API endpoints for real-time form synchronization with 3-second debounced auto-save
- Supports live updates for moduleConfigs, blueprints, and fixtures
- Defines core data structures: UserProfile, ModuleConfig, Blueprint, Fixture, MenuItem
- Provides CRUD operations for all data types with real-time persistence
- Implements Internet Identity authentication and role-based access control for admin users
- Supports live update channels for multi-admin collaboration

### Authentication System
- **Internet Identity Integration**: Secure authentication using Internet Identity
- **Admin-Only Access**: All *-form pages restricted to authenticated admin users only
- **Access Control**: Unauthenticated users are completely denied access to admin form pages
- **Session Management**: Persistent admin sessions with automatic verification

### Navigation System
- Global searchable menu list containing all CSV script items: Home, Search, Dashboard, Profile, Payments, Integrations, Moderation, Docs, API, Status, Localization, User actions, Contextual actions, Shortcuts, Help & support, Marketing, Legal, Developer
- Instant filtering capability as user types in search
- Top navigation with global search and profile dropdown
- Contextual side navigation grouping page links
- Multiple footer types: contextual, mobile, breadcrumb, and admin utility navbars
- Live search integration with direct navigation to relevant form tabs

### Main Routes

#### Secure Main-Form Admin Pages - Admin Only
**Authentication Required**: Only authenticated admin users via Internet Identity can access these pages

##### /main-form Page (Primary Admin Control Center)
- **Tabbed Interface**: Each tab corresponds to a different .mo submodule
- **Dynamic Reactive Forms**: React controlled components with onChange validation
- **Live Synchronization**: 3-second debounced auto-save after last field change
- **Multi-Admin Collaboration**: Live update channels showing changes from other admins instantly
- **Visual Sync Feedback**: Real-time indicators showing "Saving…", "Saved", or "Error" status per field and tab

**Tab Structure**:
- **AccessControl Tab**: User permissions and role management forms matching accesscontrol.mo schema
- **UserProfiles Tab**: Editable name and user metadata forms matching userprofiles.mo schema  
- **Modules Tab**: ModuleConfig forms with id, name, enabled toggle, and dynamic key-value settings matching modules.mo schema
- **Blueprints Tab**: Blueprint forms with id, name, and YAML instruction text areas with syntax highlighting matching blueprints.mo schema
- **Fixtures Tab**: Fixture forms with id, name, CSV/JSON data areas, import/upload, and preview functionality matching fixtures.mo schema
- **MenuItems Tab**: MenuItem forms with id, name, category, and live reordering capabilities matching menuitems.mo schema

##### Individual Form Pages (Alternative Access)
- **/modules-form**: Dedicated modules configuration page
- **/blueprints-form**: Dedicated blueprints editing page  
- **/fixtures-form**: Dedicated fixtures management page
- **/menuitems-form**: Dedicated menu items configuration page
- **/userprofiles-form**: Dedicated user profiles management page
- **/accesscontrol-form**: Dedicated access control configuration page

#### /admin Page (System Overview)
- Read-only dashboards showing system status and module health
- Inline quick-edit modal popups for admin-level controls:
  - Initialize modules
  - Delete items with confirmation
  - Assign user roles
- Same organizational structure as /main-form but with dashboard focus
- Real-time dashboard updates and monitoring displays

### Real-Time Form Sync System
- **Debounced Auto-Save**: Automatic backend synchronization 3 seconds after last field change
- **React Controlled Components**: All form inputs use controlled React components with onChange handlers
- **Live Update Channels**: WebSocket-like emulation or React Query polling for multi-admin collaboration
- **Optimistic UI Updates**: Immediate visual feedback with rollback on failure
- **Validation Isolation**: Hidden tabs do not produce validation errors for unmodified fields
- **Visual Status Indicators**: Per-field and per-tab sync status badges
- **Error Handling**: Retry mechanisms and user-friendly error messages
- **Type-Safe Binding**: Controlled components bound to Motoko backend fields with automatic validation

### Global Search Integration
- Searchable menu bar that filters among all menu items
- Highlights editable entries for direct navigation
- Quick access to relevant form tabs based on search results
- Real-time filtering as user types
- Navigation shortcuts to specific configuration sections

## Key Features

### Secure Admin Authentication
- Internet Identity integration for secure admin access
- Complete access denial for unauthenticated users on all *-form pages
- Role-based restrictions ensuring only authorized admins can modify configurations
- Session persistence and automatic verification

### Dynamic Reactive Forms
- **Real-Time Reactivity**: All input fields update live as admin types
- **Controlled Components**: React controlled components with proper state management
- **onChange Validation**: Immediate validation feedback as user interacts with forms
- **Debounced Synchronization**: 3-second delay after last change before backend sync
- **Multi-Admin Support**: Live updates visible to all connected admins without page reload

### Visual Feedback System
- **Per-Field Status**: Individual sync indicators for each form field
- **Per-Tab Status**: Overall sync status for each tab section  
- **Status Types**: "Saving…", "Saved", "Error" with appropriate visual styling
- **Responsive Design**: Smooth editing experience across desktop and mobile
- **Easy Navigation**: Intuitive tabbed interface for organized admin controls

### Dynamic Module Management
- Import CSV fixture files containing blueprint instructions (indexes 10-200)
- Parse YAML/Markdown pipeline instructions for module definitions
- Generate module templates dynamically based on imported fixtures
- Support "Module of Modules" and "Fixture of Fixtures" behavior

### Comprehensive Form Management
- **UserProfile Forms**: Editable user name and metadata with real-time updates
- **ModuleConfig Forms**: Toggle-enabled modules with dynamic key-value pair management
- **Blueprint Forms**: YAML syntax-highlighted instruction editing with live preview
- **Fixture Forms**: CSV/JSON data management with import/upload and data preview
- **MenuItem Forms**: Category-based organization with drag-and-drop reordering
- **AccessControl Forms**: User permission and role assignment interfaces

### Sample Functional Modules
Generate scaffold modules for:
- Onboarding
- Search
- Payments
- Analytics
- Integrations
- Moderation
- Localization
- Performance
- Security

Each module includes:
- Configuration forms that mirror the admin structure
- Dynamic field generation based on main.mo configuration
- Automatic updates when admin changes related settings

## Data Storage (Backend)
- Global configuration state in main.mo
- Internet Identity authentication data and admin role assignments
- UserProfile data with metadata and preferences
- ModuleConfig definitions with dynamic settings
- Blueprint instructions with YAML/Markdown content
- Fixture data with CSV/JSON import history
- MenuItem definitions with categories and ordering
- AccessControl permissions and role definitions
- Real-time variable states for each module
- Form state synchronization data with debounced save timestamps
- Navigation structure and search indexes
- Live update channel state for multi-admin collaboration

## User Interface
- English language content throughout the application
- Responsive design supporting desktop and mobile layouts
- Consistent styling across all *-form routes
- Interactive dashboards with real-time data updates
- Accessible form controls with proper validation feedback
- Visual status indicators for sync states (saving/saved/error)
- YAML syntax highlighting for blueprint editing
- CSV/JSON preview functionality for fixture management
- Drag-and-drop interface for menu item reordering
- Tabbed navigation interface for organized admin controls
- Protected admin interface with Internet Identity authentication gates
- Smooth transitions and loading states for optimal user experience

## Scalability Design
- Support for adding new modules dynamically
- Expandable fixture system for new capabilities
- Modular architecture allowing independent module development
- Dynamic template generation for unlimited module types
- Scalable navigation system supporting additional menu items
- Type-safe form system supporting new data structures
- Real-time sync architecture supporting high-frequency updates with debouncing
- Extensible authentication system for additional user roles
- Multi-admin collaboration support with conflict resolution
