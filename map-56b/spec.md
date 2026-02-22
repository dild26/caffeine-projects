# MOAP (Mother Of All Platforms) Private Invite Only Platform

## Project Overview
MOAP is a comprehensive platform management system owned by SECOINFI / Sudha Enterprises (PIN 560097) that serves as a centralized hub for creating, managing, and deploying multiple interconnected web applications and services. The platform legally explores and unifies the pros, USPs, functionalities, design, and business trends of the top 26 global domains, creating a high-performance, modular platform that can serve billions of users with on-demand products and services.

## Core Functionality

### Enhanced Apps Management Interface with SECOINFI Apps Section and Rebuilt Pages Registry Table
- **CRITICAL REBUILD**: Rebuild Pages Registry Table logic in `frontend/pages/MainControlPage.tsx` to start completely empty with no demo or placeholder data
- **CRITICAL REBUILD**: Implement fully functional inline editing where all rows can be edited (App/Page Name, URL) and clicking "Save" persists changes in component state and local storage
- **CRITICAL REBUILD**: Ensure SelectAll checkbox functions as master checkbox that selects/deselects all rows with each individual row checkbox toggling and tracking state correctly
- **CRITICAL REBUILD**: Implement bulk delete functionality where "Delete Selected (n)" button deletes all selected rows from state/local storage with confirmation dialog, showing success toast "Selected pages deleted locally" if backend deletion isn't implemented
- **FIXED SHARE SELECTED**: Fix "Share Selected (n)" button functionality to ensure successful data transfer instead of returning "Failed to share selected pages" message
- **FIXED SHARE SELECTED**: Implement proper backend and frontend integration to validate and successfully transfer selected rows from Pages Registry Table to Overview, Compare, Sites, and Apps tabs
- **FIXED SHARE SELECTED**: Replace old data in target tabs with selected Pages Registry Table data through validated backend operations
- **FIXED SHARE SELECTED**: Add detailed success/error feedback on completion with visual toast or popup confirming data sharing and tab updates
- **FIXED SHARE SELECTED**: Include logic to handle replacement failures by automatically clearing target tab data and re-populating with new shared rows for consistency
- **FIXED SHARE SELECTED**: Maintain SelectAll checkbox and individual row selection fully functional with selected count updated throughout interaction
- **FIXED SHARE SELECTED**: Execute sharing operation through robust shared handler that collects selectedPageIds, validates data integrity, calls dedicated update methods for each tab, and ensures immediate UI refresh
- **FIXED SHARE SELECTED**: Display comprehensive success notification "Selected data has been successfully shared across Overview, Compare, Sites, and Apps tabs." upon successful completion
- **FIXED SHARE SELECTED**: Implement error recovery mechanisms with fallback data clearing and repopulation when direct replacement fails
- **FIXED SHARE SELECTED**: Maintain all existing functionalities (SelectAll, Add Row, Edit, Delete) intact and visually consistent across table toolbar
- **CRITICAL REBUILD**: Ensure Add Row button correctly appends new row using current input values (App/Page Name, URL), clears inputs afterward, and re-renders table immediately
- **CRITICAL REMOVAL**: Remove "Empty & Repopulate" button entirely since repopulation isn't needed—only manual add/edit/delete operations should remain
- **NEW MULTI-FILE UPLOAD**: Add "Upload Dataset" button under Main Control → Pages section supporting `.json`, `.csv`, `.md`, `.mo`, and `.zip` file formats
- **NEW MULTI-FILE UPLOAD**: Implement client-side file parsing that overwrites existing table data with parsed entries from uploaded files
- **NEW MULTI-FILE UPLOAD**: Validate each parsed record has required `App/Page Name` and `URL` fields, auto-sort alphabetically by `App/Page Name`, and persist to local storage
- **NEW DATASETS MODAL**: Add small modal or pop-up labeled "Datasets" that lists uploaded file names and provides "Replace Table Data" action to confirm overwriting current dataset
- **NEW DATASETS MODAL**: Support dataset management with file name tracking and confirmation workflow for data replacement operations
- **NEW APPEND-ONLY INTEGRATION**: Extend data flow so that Sites tab → Secoinfi-Apps registry (26 apps) is used as append-only source for app links in Apps tab
- **NEW APPEND-ONLY INTEGRATION**: Append the latest 26 Secoinfi app links (name + canonical URL) to Apps tab existing list without removing, reordering, or mutating any pre-existing entries
- **NEW APPEND-ONLY INTEGRATION**: Preserve Version 84 behavior exactly with no UI redesign, no schema or table layout changes, no change to sorting, filters, pagination, or tab-specific logic
- **NEW APPEND-ONLY INTEGRATION**: Ensure appended links use canonical URLs from Sites registry, are deduplicated against existing entries by canonical URL, and render as clickable external links (anchor elements)
- **NEW APPEND-ONLY INTEGRATION**: Implement append logic at data-fetch/composition layer only (hooks/selectors), leaving all Apps tab components unchanged
- **NEW SECOINFI APPS SECTION**: Add dedicated "SECOINFI Apps" section under Apps Management panel with new table containing columns: `#`, `App Name`, `Sub‑Domain`, `Canonical URL`, `Status`, and `RBAC Visibility`
- **NEW SECOINFI APPS SECTION**: Populate first three columns with 26 SECOINFI apps automatically inferring Status and RBAC Visibility from existing app metadata
- **NEW SECOINFI APPS SECTION**: Include clickable links in each row to app's Overview, Sites, Sitemap, and Secure Routes pages within MOAP
- **NEW SECOINFI APPS SECTION**: Register all SECOINFI apps as first-class entries participating in audit, crypto, and verification flows
- **CRITICAL CLEANUP**: Remove all existing values from `secRegistry` array in `backend/main.mo`, leaving it as an empty array `let secRegistry : [Page] = [];`
- **CRITICAL CLEANUP**: Ensure no demo entries or placeholder data remain in the `secRegistry` declaration while maintaining valid syntax
- **CRITICAL CLEANUP**: Validate that the build compiles successfully after removing array contents without modifying other logic or declarations
- **NEW COMBINED APPS DISCOVERY**: Modify `frontend/src/components/AppsManagement.tsx` to merge both `originalPages` and `secoInfiApps` arrays into a single combined array named `allApps` using `const allApps = [...originalPages, ...secoInfiApps];`
- **NEW COMBINED APPS DISCOVERY**: Replace all button and discovery logic (including "Discover All (n)" label, progress bar, and discovery processes) to use `allApps` instead of filtering only `originalPages` with `rank === null`
- **NEW COMBINED APPS DISCOVERY**: Ensure all sorting, ranking, and progress metrics reference `allApps` so the displayed total updates automatically (e.g., "Discover All 38 Apps")
- **NEW COMBINED APPS DISCOVERY**: Implement discovery operations to run sequentially across all 38 combined apps while maintaining existing UI structure, filters, and progress tracking
- **NEW COMBINED APPS DISCOVERY**: Verify that discovery functionality works with the combined dataset without requiring changes to the main-control backend since the registry already contains all 38 apps with URLs and metadata
- Comprehensive Admin "Live Remote Pages" control panel integrated into existing Apps Management Interface
- Alphabetical sorting (A-Z) of all live SECOINFI subdomains with clickable formatted links
- Full CRUD operations for app entries: Add, Edit, Update, Modify, and Delete capabilities
- Status dropdown management with options: `[draft, publish, suspend, archive, error, pending, validate, approve, reject]`
- Real-time progress percentage display for each app link indicating AI validation completeness
- Bulk operations support for managing multiple app entries simultaneously
- Integration with YAML configuration system for persistent app management settings
- Live status updates and data synchronization progress tracking
- De-duplication logic to prevent duplicate app entries during management operations
- Auto-generation of AppManagementEntry records for new applications with verification status
- Automatic sitemap entry creation for all new applications

### Enhanced Site Management System with Canonical URL Validation and Clickable Hyperlinks
- **UNCHANGED**: Sites tab continues to show the full Secoinfi-Apps registry with ranks and canonical URLs
- **UNCHANGED**: Site Management view populated with categorized cards sorted A-Z by page link names using Apps tab data
- **UNCHANGED**: Fixed broken links in Sites tab grid cards using canonical URLs from Secoinfi-App Registry as single source of truth
- **UNCHANGED**: Implemented strict URL validation for Top App references ensuring all URLs match canonical mapping format
- **UNCHANGED**: Updated Top App field rendering in Sites cards to always output clickable anchor links with external-link icon using canonical URLs
- **UNCHANGED**: Added defensive fallback where if canonical URL cannot be resolved, Top App link is disabled visually with tooltip "URL not available"
- **UNCHANGED**: Ensured all 26 Sites cards are regenerated/rebound so every listed page points to valid SECOINFI app URL from canonical mapping
- **UNCHANGED**: Prevented URL reconstruction from app names by using only pre-validated canonical URLs from source-of-truth mapping
- **UNCHANGED**: Converted all displayed links in Sites tab grid to real, clickable hyperlinks using canonical URL format
- **UNCHANGED**: Ensured external app links open in new tab with `rel="noopener noreferrer"` and internal MOAP routes use router navigation
- **UNCHANGED**: Updated "View Page" button on every grid card to be actual clickable link or router navigation pointing to correct resolved page URL from canonical mapping
- **UNCHANGED**: Applied consistent hyperlink rendering logic across Sites cards ensuring no grid shows plain-text URLs
- **UNCHANGED**: Sanitized all grid card link sources to enforce canonical URL generation and remove duplicated protocol strings
- **UNCHANGED**: Deduplicated links and labels at the data-source level so each grid item has one valid label → one valid URL only
- **UNCHANGED**: Added defensive validation so malformed or unresolved URLs are dropped instead of rendered
- Dynamic card population based on top-performing pages from all available SECOINFI-app subdomains using leaderboard metrics for ranking
- Display comprehensive card information including app name, subdomain, top featured page, category, click/vote metrics, and leaderboard score comparison (SECOINFI vs global sites)
- Implement real-time comparator that automatically updates leaderboard rankings when SECOINFI pages surpass global scores based on combined feature/functional advantage analysis
- Enforce secure synchronization with vulnerability checks, strict validation, and domain/input sanitization before integration
- Maintain modular scalability architecture for future upgrades and expansion
- Ensure sitemap alignment where all active pages are auto-added and synchronized with Remote Page Integration, Broadcast Hub, and other modules
- Support English language content for all app pages and site management operations

### Enhanced Broadcast Hub Live Monitoring System with Independent Data Sources
- Create dedicated "Broadcast Hub" page/view for admins to manage live content distribution
- Enable admins to view live updates and push content instantly to connected SECOINFI apps
- Implement real-time monitoring of delivery status to all connected apps
- Display broadcast history, success rates, and delivery confirmations for all apps
- Provide instant broadcast capabilities with immediate delivery to all or selected apps
- Support broadcast scheduling and automated content distribution
- Include broadcast analytics and performance monitoring dashboard for all applications

### Enhanced Features Page with Dual Verification System
- **NEW**: Update the Features page (Table of Reports) to support dual verification with two separate checkboxes
- **NEW**: Automatically check the AI verification checkbox when a feature/task is successfully implemented
- **NEW**: Keep the second checkbox Admin-only, required for manual validation and final approval
- **NEW**: Ensure these verification states are persisted and reflected consistently across reloads and views
- **NEW**: Implement dual validation workflow where AI verification triggers automatically upon successful implementation
- **NEW**: Require manual Admin approval through the second checkbox for final feature validation
- **NEW**: Store verification states in backend with proper persistence and state management
- **NEW**: Display verification status clearly in Features page interface with visual indicators
- Auto-check features according to YAML-defined AI validation rules with automatic AI verification
- Track implementation status and validation workflows as specified in YAML feature management settings
- Generate validation checkboxes automatically from YAML configuration keys with dual verification support
- Require admin affirmation for all critical features as defined in YAML approval workflows

### Enhanced Fixtures Leaderboard System with Append-Only Secoinfi-Apps Integration
- **CRITICAL RESTORATION**: Restore Fixtures Leaderboard to its original pre-change behavior using independent data source as primary dataset
- **NEW APPEND-ONLY INTEGRATION**: Extend data flow so that Sites tab → Secoinfi-Apps registry (26 apps) is used as append-only source for app links in Fixtures Leaderboard
- **NEW APPEND-ONLY INTEGRATION**: Append the latest 26 Secoinfi app links (name + canonical URL) to Fixtures Leaderboard existing list without removing, reordering, or mutating any pre-existing entries
- **NEW APPEND-ONLY INTEGRATION**: Preserve Version 84 behavior exactly with no UI redesign, no schema or table layout changes, no change to sorting, filters, pagination, or tab-specific logic
- **NEW APPEND-ONLY INTEGRATION**: Ensure appended links use canonical URLs from Sites registry, are deduplicated against existing entries by canonical URL, and render as clickable external links (anchor elements)
- **NEW APPEND-ONLY INTEGRATION**: Implement append logic at data-fetch/composition layer only (hooks/selectors), leaving all Fixtures Leaderboard components unchanged
- Display leaderboard-style rankings based on metrics defined in YAML performance settings
- Create dynamic leaderboard system with real-time updates according to YAML monitoring configuration
- Integrate with existing systems based on YAML-defined integration settings
- Support clickable navigation to all verified applications with proper URL validation

### Enhanced Comparison Tab with Append-Only Secoinfi-Apps Integration and Dynamic Feature Integration
- **CRITICAL RESTORATION**: Restore Comparison tab to its original pre-change behavior using independent data source as primary dataset
- **NEW APPEND-ONLY INTEGRATION**: Extend data flow so that Sites tab → Secoinfi-Apps registry (26 apps) is used as append-only source for app links in Comparison tab
- **NEW APPEND-ONLY INTEGRATION**: Append the latest 26 Secoinfi app links (name + canonical URL) to Comparison tab existing list without removing, reordering, or mutating any pre-existing entries
- **NEW APPEND-ONLY INTEGRATION**: Preserve Version 84 behavior exactly with no UI redesign, no schema or table layout changes, no change to sorting, filters, pagination, or tab-specific logic
- **NEW APPEND-ONLY INTEGRATION**: Ensure appended links use canonical URLs from Sites registry, are deduplicated against existing entries by canonical URL, and render as clickable external links (anchor elements)
- **NEW APPEND-ONLY INTEGRATION**: Implement append logic at data-fetch/composition layer only (hooks/selectors), leaving all Comparison tab components unchanged
- **UNCHANGED**: Automatically include all implemented features from the Features tab (e.g., 22+ features) as comparison rows against original comparison headers
- **NEW**: Enable Admins to add new AI-prioritized features dynamically on each update or migration through admin interface
- **NEW**: Create dynamic comparison matrix with Features tab integration showing real-time feature implementation status across original apps
- **NEW**: Support bulk feature addition and AI-assisted feature prioritization for comparison analysis
- **NEW**: Implement real-time synchronization between Features tab and Comparison tab for consistent data display
- **CRITICAL FIX**: Fix table rendering issue where adding new columns or rows shows success but doesn't display updates
- **CRITICAL FIX**: Ensure real-time data rendering and table refresh after insertions with immediate UI updates
- **CRITICAL FIX**: Implement robust table state management to prevent display lag and ensure immediate visual feedback
- Support comprehensive feature comparison across original applications with dynamic feature matrix

### Enhanced Overview Tab with Append-Only Secoinfi-Apps Integration
- **CRITICAL RESTORATION**: Restore Overview tab to its original pre-change behavior using independent data source as primary dataset
- **NEW APPEND-ONLY INTEGRATION**: Extend data flow so that Sites tab → Secoinfi-Apps registry (26 apps) is used as append-only source for app links in Overview tab
- **NEW APPEND-ONLY INTEGRATION**: Append the latest 26 Secoinfi app links (name + canonical URL) to Overview tab existing list without removing, reordering, or mutating any pre-existing entries
- **NEW APPEND-ONLY INTEGRATION**: Preserve Version 84 behavior exactly with no UI redesign, no schema or table layout changes, no change to sorting, filters, pagination, or tab-specific logic
- **NEW APPEND-ONLY INTEGRATION**: Ensure appended links use canonical URLs from Sites registry, are deduplicated against existing entries by canonical URL, and render as clickable external links (anchor elements)
- **NEW APPEND-ONLY INTEGRATION**: Implement append logic at data-fetch/composition layer only (hooks/selectors), leaving all Overview tab components unchanged
- Display comprehensive overview of original applications with clickable navigation to each app
- Support real-time synchronization with original data for consistent app information display

### Enhanced Hierarchical Sitemap Management System with Independent Data Sources
- **CRITICAL REFACTOR**: Remove "General" root node completely from hierarchical sitemap tree viewer
- **CRITICAL REFACTOR**: Display every app explicitly with its correct name as individual root nodes in hierarchical tree using original data sources
- **CRITICAL REFACTOR**: Each app domain dynamically fetch and update their sitemaps in real-time using original URLs
- **CRITICAL REFACTOR**: Implement real-time synchronization between "Found pages" count and hierarchical tree pages with 100% consistency
- **CRITICAL REFACTOR**: Fix mapping logic to display true app-specific root nodes with accurate sub-page listings using original URL validation
- **CRITICAL REFACTOR**: Eliminate all duplication and grouping errors in hierarchical sitemap display
- **CRITICAL REFACTOR**: Strengthen hierarchical reconciliation logic in `useSitemapData` to show only verified app links from original mapping
- **CRITICAL REFACTOR**: Optimize sitemap UI in `SitemapPage.tsx` for instant dynamic tree view updates after discovery, import, or AI verification
- **CRITICAL REFACTOR**: Add comprehensive error-checking and reload mechanisms to prevent stale states
- **CRITICAL REFACTOR**: Enforce 100% consistency between AI discovery results, CSV/XML imports, and hierarchical sitemap structure using original URLs
- **ENHANCED DISCOVERY INTEGRATION**: When discovery button retrieves data showing "Found X pages," automatically append discovered page names as clickable links directly under each corresponding app in the hierarchical tree
- **ENHANCED DISCOVERY INTEGRATION**: Style discovered page links as underlined links with hover tooltips showing page metadata and click functionality to open pages in sandboxed viewer
- **ENHANCED DISCOVERY INTEGRATION**: Implement incremental sitemap synchronization that merges new AI discoveries into the hierarchy automatically, maintaining URL and title associations intact
- **ENHANCED DISCOVERY INTEGRATION**: Apply visual improvements with compact "Sample URL Pattern" previews featuring underlined hover links styled as active states in the discovery log, matching futuristic MOAP aesthetic
- **ENHANCED DISCOVERY INTEGRATION**: Ensure all hierarchical tree updates reflect discovered pages in real-time without delays or stalled updates, accurately showing total page count across all apps
- **ENHANCED DISCOVERY INTEGRATION**: Integrate discovered page display with existing MerkleTreeVisualization and verify updates through broadcast message system for consistency across apps
- **ENHANCED**: Implement full hierarchical sitemap viewer in Sitemap tab that automatically includes all apps as individual named root nodes with visual expansion for child URLs
- **ENHANCED**: Extend AI sitemap generation system to auto-populate and update sitemaps for all apps in real-time with manual Admin triggering capability
- **NEW**: Add Admin form controls to upload .csv files containing sitemap structures for each subdomain and parse them to populate site URLs automatically
- **NEW**: Include option selector for apps with hyperlinks and sample URL patterns (e.g., `blog`, `about`, `pros`, `what`, `why`, `how`, `contact`, `faq`, `terms`, `referral`, `trust`)
- **NEW**: Ensure imported sitemap entries are auto-linked to each app in the system and reflected in hierarchical view under corresponding domains
- **NEW**: Implement cross-verification and error handling for invalid or duplicate entries during CSV import and AI discovery
- **NEW**: Integrate sitemap visualization with Merkle-based web-tree visualization for real-time sync, validation, and consistent page inclusion across all listed subapps
- **ENHANCED CSV IMPORT**: Update sitemap CSV import processor to automatically skip any "url" header or field in uploaded .csv files
- **ENHANCED CSV IMPORT**: Allow sitemap CSV importer to accept data arrays even if provided in .csv format (sample: [blog, about, pros, what, why, how, contact, faq, terms, referral, trust])
- **ENHANCED CSV UPLOAD DIALOG**: Enhance CSV upload dialog (SitemapCSVUploadDialog) to include two input text fields:
  1. A raw array text field for manually entering links in list form (e.g., [blog, about, ...])
  2. A Markdown-type text field accepting inputs like `[Blog](https://example.com/blog)` to parse and validate valid Markdown links into proper sitemap entries
- **ENHANCED NORMALIZATION**: Add internal normalization logic to merge data from both fields, generate valid URLs by joining them with the selected app base URLs, and validate each resulting link
- **ENHANCED CONSISTENCY**: Ensure these modifications apply to both manual and AI-driven sitemap import workflows for consistency across all apps
- Implement auto-discovery of unique pages across all app domains using keyword pinging, deduplication, and HTTP/canonical verification
- Store discovered pages as Page objects with metadata including URL, title, description, content hash, discovery timestamp, and verification status
- Construct hierarchical sitemap for each app using Merkle-leaf hashes with root hash calculation, updating on every mutation
- **CRITICAL FIX**: Ensure total sitemap entry count always matches hierarchical sitemap structure count with real-time synchronization
- **CRITICAL FIX**: Immediately reflect all manually and automatically added pages (including projects for InfiTask App) in both flat and hierarchical views
- **CRITICAL FIX**: Rebuild hierarchical sitemap tree in real-time after any page addition to include ALL pages, not just subsets
- **CRITICAL FIX**: Add robust error handling and automatic discrepancy detection between sitemap entries card and hierarchical structure
- **CRITICAL FIX**: Implement automatic resolution of count mismatches with real-time sync mechanisms
- Require fixture-based voting system where AI proposes discovered pages and Admin verifies or overrides before appending to sitemap
- Log all votes, decisions, and page discovery operations in manifest system with timestamps and verification proofs
- Enable Super-Admin to create, update, archive, or delete pages across all apps with signed operations and Merkle-root verification
- Broadcast all changes via signed message bus, atomically updating spec.ml/.yaml files for each app
- Write manifest logs for every operation including timestamps, hashes, proofs, and confirmations
- Enforce strict schema validation, deterministic hashing, idempotency, and rollback on failure for all spec file updates
- Integrate with existing manifest log and audit trail system ensuring every step is logged and verifiable
- Support English language content for all app pages and discovery operations
- **AUTO-AFFIRMATION**: Once fix is verified, automatically affirm the update in features page and publish app live

### Auto-Update Mechanism for Dynamic Synchronization
- **NEW**: Implement comprehensive auto-update mechanism in MOAP app that updates page lists, sitemap, and linked sections automatically
- **NEW**: Enable automatic synchronization whenever Admins modify apps or URLs ensuring system-wide consistency
- **NEW**: Create real-time update propagation system that refreshes all dependent components when data changes
- **NEW**: Implement automatic refresh of Fixtures Leaderboard, Comparison Tab, Site Management cards, and AI Discovery systems
- **NEW**: Support automatic sitemap regeneration and page list updates across all platform components
- **NEW**: Ensure resilience and consistency through automated synchronization mechanisms
- **NEW**: Create update notification system to inform admins of successful synchronization operations
- **NEW**: Implement rollback mechanisms for failed auto-update operations with error recovery

### AI-Assisted Remote Page Integration System
- Implement automated discovery and synchronization of unique remote contact pages and metadata from all app links
- Create dynamic fetching module that automatically retrieves verified business contact data (CEO name, email, phone, address, etc.) from each subdomain's `contact` or `about` page
- Process contact data from all subdomains
- Format subdomain URLs as `https://<subdomain>.caffeine.xyz` for consistent access using canonical mapping
- Integrate real-time AI-assisted analysis modules that compare and verify fetched data across all apps
- Display structured comparisons of features, functionalities, and accuracy across all applications
- Implement continuous sync every 60 seconds to keep fetched data, comparisons, and status updates live
- Support English language content for all remote page integration and analysis operations

### Automatic Sitemap Integration System
- Automatically include all newly created pages (e.g., `angel-vc`, `contact`, `blog`) into the MOAP app's sitemap for consistent indexing and navigation visibility
- Implement real-time sitemap updates when new pages are created or modified
- Ensure all broadcast pages are automatically indexed in the main MOAP sitemap
- Maintain sitemap consistency across all page creation and modification operations
- Support automatic sitemap regeneration when pages are added through the broadcast system

### Admin-Only Broadcast Page Management System
- Implement Admin-only form in the dashboard allowing submission of unique broadcast pages
- Enable admins to add, edit, update, modify, or delete broadcast pages across all subdomains
- Provide comprehensive CRUD operations for broadcast page management with proper authentication
- Support page content creation, modification, and deletion with version control
- Integrate broadcast page management with existing admin authentication and authorization system
- Include page metadata management (title, description, content, target apps, broadcast settings)

### Cross-Subdomain Broadcast Page System
- Build broadcast page system that lets the server push new or updated pages to client apps across all subdomains
- Support broadcasting to all listed subdomains
- Enable real-time content distribution and synchronization across all connected apps
- Implement broadcast scheduling and delivery confirmation system
- Support selective broadcasting to specific subdomains or all subdomains simultaneously
- Handle broadcast failures and retry mechanisms for reliable content delivery

### Cross-Origin Embed System
- Implement cross-origin-enabled embed system allowing broadcast pages to be displayed within client apps
- Support `<iframe>` and `<object>` snippets for embedding broadcast content
- Apply proper CORS whitelist for `*.caffeine.xyz` domains to enable cross-origin embedding
- Provide embed code generation for easy integration into client applications
- Support responsive embed sizing and styling options
- Handle embed security and content validation for safe cross-origin display

### HTTP Outcalls System with Fixed Transform Function
- **CRITICAL FIX**: Fix the transform function in backend/http-outcalls/outcall.mo to correctly return the modified response instead of leaving it unreturned
- **CRITICAL FIX**: Verify all async functions in the file return valid values and complete execution without freezing
- **CRITICAL FIX**: Ensure proper error handling and response transformation for all HTTP outcall operations
- **CRITICAL FIX**: Implement robust async function completion validation to prevent execution freeze
- **CRITICAL FIX**: Add comprehensive logging for HTTP outcall operations to track execution flow
- Enable reliable HTTP outcalls for external API integration with proper response handling
- Support secure HTTP communication with external services and APIs
- Implement timeout handling and retry mechanisms for failed HTTP requests
- Provide comprehensive error reporting for HTTP outcall failures
- Ensure all HTTP outcall functions complete execution and return appropriate responses
- Support remote page fetching for AI-assisted integration system with contact page retrieval

### Angel/VC Investment Opportunities Page System
- Create dedicated `angel-vc` page titled "Angel / VC Investment Opportunities List"
- Implement hero section with title, subtitle "World's Top 26 Digital Domains Unified Into One Future-Proof Platform by SECOINFI", and link to https://map-56b.caffeine.xyz
- Display comprehensive investor-focused content sections as scrollable document with anchor navigation
- Include 20 structured content sections covering category breakthrough, massive TAM, modular architecture, market leadership, AI-native positioning, competitive moat, revenue stack, scalability blueprint, plug-in system, distribution strategy, investor narrative, defensibility, traction-readiness, SECOINFI advantage, investor-specific angles, global visibility, viral positioning, future-proof factors, growth path, and ultimate pitch line
- Implement call-to-action section with placeholder buttons for "Investor Pitch Deck", "VC Email Template", "Investor One-Pager", "Executive Summary", and "Landing Page"
- Provide direct access link to https://map-56b.caffeine.xyz in call-to-action section
- Integrate page into navigation menu under "MOAP App" section
- Apply futuristic UI theme with gradient cards, 3D headers, and neon highlights for investor-focused showcase
- Support English language content for all investor-focused materials and documentation

### Investor Outreach System
- **NEW**: Create comprehensive "Investor Outreach" module integrated with existing `/angel-vc` page
- **NEW**: Dynamically display MOAP's 26-domain global opportunity, AI-native modularity, and cross-domain scalability for profitability using existing page descriptions
- **NEW**: Implement interactive actions including "Join Now", "Request Demo", and "Meet the Founders" buttons with embedded forms
- **NEW**: Add automated email triggers for investor outreach with form submission handling
- **NEW**: Include investor outreach pages in sitemap and broadcast hub for cross-platform distribution
- **NEW**: Enable streaming across all apps via pre-approved iframe/object snippets with CORS-safe whitelisting
- **NEW**: Extend BroadcastHub component to auto-broadcast new investor pages (e.g., "/angel-vc", "/contact") across all subdomains
- **NEW**: Ensure investor pages are synced with sitemap hierarchy and automatically distributed
- **NEW**: Add admin form for managing broadcasted investor pages with target app selection and delivery status tracking
- **NEW**: Support both raw and Markdown link inputs for investor page management
- **NEW**: Integrate with existing futuristic theme using provided assets (angel-vc-hero-banner, investment-opportunity-icon-transparent, paypal-logo-transparent)
- **NEW**: Connect with leaderboard and sitemap systems for enhanced visibility and tracking
- **NEW**: Implement real-time delivery monitoring for investor outreach campaigns across all apps
- **NEW**: Support automated investor engagement tracking and response management
- **NEW**: Enable selective broadcasting of investor content to specific subdomains based on admin preferences

### Ranking & Indices Page System (/rank)
- **NEW**: Create dedicated `/rank` page titled "Ranking & Indices" for MOAP website rankings
- **NEW**: Implement sortable, filterable table displaying MOAP website rankings sourced from third-party SEO/analytics domains
- **NEW**: Include frontend REST fetchers to pull publicly available metrics with structured manual/admin inputs as fallback
- **NEW**: Support columns: SEO Rank, Visitors, Avg Session Duration, Total Pages Indexed, Popularity Score, Load Speed, Revisit Rate, Search Engine Source, Crawled Pages, Rank Δ, PPC Indicator, TTL, Search Volume, Content Quality Score
- **NEW**: Enable multi-column sorting (A–Z and by Rank #1 → #1,000,000) with sortable and filterable functionality
- **NEW**: Display clear data source labels per row and last-updated timestamps for transparency
- **NEW**: Implement client-side caching with refresh controls to avoid rate limits and improve performance
- **NEW**: Integrate with existing broadcast system for cross-platform distribution to all apps
- **NEW**: Support iframe-safe embedding with proper sandboxing for secure cross-origin display
- **NEW**: Include admin controls for data source management and manual override capabilities
- **NEW**: Apply futuristic UI theme consistent with MOAP design aesthetic
- **NEW**: Register `/rank` route in router and add searchable menu entry for navigation
- **NEW**: Support English language content for all ranking data and interface elements

### Live Monitoring & Broadcast Page System (/live)
- **NEW**: Create dedicated `/live` page titled "Live Monitoring & Broadcast" for real-time dashboard view
- **NEW**: Implement real-time dashboard aggregating latest ranking signals, change deltas, and alerts
- **NEW**: Support auto-refresh interval with pause/resume functionality for continuous monitoring
- **NEW**: Display visual indicators (up/down arrows, heat colors) for rank changes and performance metrics
- **NEW**: Include broadcast toggle to push the page to all apps via existing Broadcast Hub
- **NEW**: Integrate with `/rank` page data sources for consistent ranking information display
- **NEW**: Implement real-time synchronization with ranking data and change detection algorithms
- **NEW**: Support alert system for significant ranking changes and performance thresholds
- **NEW**: Include admin controls for monitoring configuration and broadcast management
- **NEW**: Apply futuristic UI theme with real-time visualization elements and dynamic indicators
- **NEW**: Register `/live` route in router and add searchable menu entry for navigation
- **NEW**: Support iframe-safe embedding with proper sandboxing for secure cross-origin display
- **NEW**: Support English language content for all monitoring data and interface elements

### Enhanced Ranking System Admin Controls
- **NEW**: Implement Admin-only panel for managing third-party data sources and weighting rules
- **NEW**: Support manual override capabilities for ranking data with admin validation
- **NEW**: Include dual validation states: AI-collected (auto-checked) + Admin-verified (manual checkbox)
- **NEW**: Persist admin settings as single source of truth and reuse across both `/rank` and `/live` pages
- **NEW**: Integrate with existing Features page dual verification system for consistency
- **NEW**: Support data source configuration including API endpoints, authentication, and refresh intervals
- **NEW**: Include weighting rule management for combining multiple data sources into unified rankings
- **NEW**: Provide comprehensive audit trail for all admin modifications and data source changes
- **NEW**: Support bulk data import and export capabilities for ranking information management
- **NEW**: Integrate with existing YAML configuration system for persistent settings storage

### Home Page Layout Enhancement
- **NEW**: Modify the Home page layout to reduce the displayed size of hero/architecture images to 50% of their current rendered size
- **NEW**: Apply responsive frontend styling (width/height, max-width, or CSS transform) to scale images without changing underlying asset files
- **NEW**: Ensure scaling applies specifically to images used on `/home` route, including `modular-architecture-3d.dim_1024x768.png`
- **NEW**: Preserve aspect ratio, responsiveness, and existing lazy-loading/performance optimizations
- **NEW**: Maintain visual hierarchy and layout balance while reducing image prominence
- **NEW**: Support English language content for all home page elements

### Authentication & RBAC System
- **NEW**: Implement Passkey/WebAuthn as primary authentication method with OAuth2 + TOTP as fallback
- **NEW**: Support short-lived JWTs with refresh tokens and secure session storage
- **NEW**: Define RBAC roles: Guest, Subscriber, AppOwner, Admin with role-based access control
- **NEW**: Map RBAC roles to critical routes and SECOINFI apps including `/secure`, `/vault`, `/manifest`
- **NEW**: Integrate authentication system with all 26 SECOINFI apps for unified access control
- **NEW**: Support role-based visibility and access permissions across all platform features
- **NEW**: Implement secure session management with automatic token refresh and expiration handling
- **NEW**: Provide comprehensive user management interface for role assignment and permission control

### Route Protection & Secure Routes System
- **NEW**: Mark protected routes (`/secure`, `/features`, `/admin`, `/vault`, `/secoinfi`) with required roles and authentication methods
- **NEW**: Implement sitemap visibility rules per role ensuring appropriate content access
- **NEW**: Support route-level security enforcement with automatic redirection for unauthorized access
- **NEW**: Integrate secure routes with RBAC system for comprehensive access control
- **NEW**: Provide secure route management interface for administrators
- **NEW**: Support dynamic route protection configuration through YAML settings
- **NEW**: Implement audit logging for all secure route access attempts and authorization decisions

### P2P Data-Sharing Module
- **NEW**: Create `/secure` dashboard supporting create/revoke/approve shares functionality
- **NEW**: Implement per-app targeting using 26 SECOINFI apps for granular sharing control
- **NEW**: Support AES-256-GCM + split-key encryption for secure data sharing
- **NEW**: Provide comprehensive share management interface with approval workflows
- **NEW**: Integrate P2P sharing with RBAC system for role-based sharing permissions
- **NEW**: Support encrypted data transmission and secure key exchange protocols
- **NEW**: Implement share audit trails and activity monitoring for compliance
- **NEW**: Enable selective data sharing across SECOINFI apps with encryption verification

### Cryptography & ZK-Proof Engine
- **NEW**: Implement Ed25519 `verifySig` hook for digital signature verification
- **NEW**: Support optional Groth16/PLONK ZK verification for high-sensitivity apps (Secoin-ePay, Voice-Invoice, Key-Unlock)
- **NEW**: Enforce TLS 1.3 for all communications with key rotation policy
- **NEW**: Integrate HSM/KMS usage for secure key management and storage
- **NEW**: Provide cryptographic verification interface for sensitive operations
- **NEW**: Support zero-knowledge proof generation and verification workflows
- **NEW**: Implement comprehensive cryptographic audit logging and verification trails
- **NEW**: Enable cryptographic integrity checks for all sensitive data operations

### Manifest Logs & Audit Trail System
- **NEW**: Implement append-only logs for signatures, hashes, and admin decisions
- **NEW**: Support correlation IDs and filters by app, route, role, and crypto operation
- **NEW**: Provide comprehensive audit trail interface with search and filtering capabilities
- **NEW**: Integrate manifest logging with all platform operations for complete traceability
- **NEW**: Support audit report generation and compliance documentation
- **NEW**: Implement cryptographic integrity verification for audit logs
- **NEW**: Enable real-time audit monitoring and alerting for security events
- **NEW**: Support audit log export and backup with integrity preservation

### SECOINFI Integration Framework
- **NEW**: Store app ID, public key, ZK schema (if any), and royalty configuration for each SECOINFI app
- **NEW**: Register auto-verification workflow for all 26 SECOINFI apps
- **NEW**: Implement REST endpoints: `/api/apps/register`, `/api/apps/:id/verify`, `/api/apps/:id/royalty`, `/api/share/*`, `/api/auth/*`, `/api/audit/*`
- **NEW**: Apply appropriate RBAC and crypto requirements to all API endpoints
- **NEW**: Support comprehensive app registration and verification workflows
- **NEW**: Integrate royalty management and distribution system for SECOINFI apps
- **NEW**: Provide app-specific configuration management and monitoring capabilities
- **NEW**: Enable automated verification and compliance checking for registered apps

### Canonical YAML Configuration System with Schema Validation
- Auto-detect existing configuration files on system initialization: check for spec.yaml, spec.ml, or spec.md
- If only spec.md exists, automatically parse and convert to normalized YAML format (spec.yaml) as canonical source
- Implement comprehensive schema validation for all YAML configuration including app metadata, sitemap configuration, security settings, P2P sharing, features, admin panels, API definitions, SECOINFI integration, auditability, backend storage, operations, UI configuration, and reliability settings
- Store spec.yaml as the single source of truth for all platform operations, feature flags, RBAC permissions, and security policies
- Runtime YAML validation: validate all configuration changes against schema before applying
- Display clear validation status and error messages in admin panel with detailed feedback
- Wire YAML configuration into application runtime to drive all feature flags, RBAC permissions, fixtures management, admin panels, and validation workflows
- Auto-generate validation checkboxes in features page from YAML configuration keys with real-time synchronization
- Sync all route access controls with YAML security configuration ensuring proper authentication and authorization
- Ensure all new features and fixtures require admin affirmation through YAML-driven approval workflows
- Provide YAML configuration editor interface with syntax highlighting, real-time validation, and schema documentation
- Support YAML configuration version control with change history and rollback capabilities
- Enable YAML configuration import/export functionality with comprehensive validation and error handling
- Include AI-assisted remote page integration settings and app management configuration

### Append-Only Manifest Logging System
- Implement append-only manifest logs for all platform configuration changes and feature management operations
- Log all YAML configuration modifications with timestamps, user identification, and change details
- Comprehensive audit trails tracking all admin operations, feature activations, and security policy changes
- Cryptographic verification of manifest log integrity using hash-based validation
- Immutable logging system ensuring complete accountability and traceability for all configuration changes
- Display manifest logs and audit trails in admin panel with search and filtering capabilities
- Generate audit reports and compliance documentation from manifest logs
- Handle manifest log backup and recovery with cryptographic integrity preservation
- Log all AI-assisted remote page integration operations and app management activities

### Enhanced Security and Access Control with YAML-Driven Policies
- Implement comprehensive RBAC system based entirely on YAML security configuration
- Secure all restricted routes including secure, features, admin, vault, and secoinfi using YAML-defined access controls
- Hide restricted routes from public sitemaps while displaying lock icons for authenticated users as specified in YAML
- Implement cryptographic operations for secure data handling using YAML-defined security policies
- Process all security configurations through YAML schema validation with mandatory admin approval for critical changes
- Maintain security policy enforcement based on YAML configuration with real-time validation
- Handle security audit logs and access control violations according to YAML-defined policies

### P2P Sharing and Royalty System
- Implement peer-to-peer sharing capabilities as defined in YAML configuration
- Royalty logic and distribution system for content sharing and monetization based on YAML-defined algorithms
- Integration with applications for revenue sharing and tracking according to YAML configuration
- P2P network configuration and management through YAML-driven settings and protocols
- Secure sharing protocols with cryptographic validation and audit trails as specified in YAML security configuration

### Platform Management
- Create and manage a catalog of interconnected sites with pre-filled domain references using YAML configuration
- Store project configurations, features, and MVP definitions for each site in YAML format
- Maintain integration notes and dependencies between sites through YAML-defined relationships
- Track development status and priorities using YAML-driven project management settings
- Map real-world domains to MOAP site categories for reference and inspiration through YAML configuration
- Showcase modular system architecture and unified features inspired by top 26 domains as defined in YAML

### Live Applications Management System
- Manage comprehensive catalog of applications with confirmed URLs using YAML configuration
- Store live links, descriptions, and detailed information for each application with URL verification through YAML settings
- Maintain global apps array with all current and future applications for scalability as defined in YAML configuration
- Track application status, features, and integration capabilities with live connectivity checks according to YAML monitoring settings
- Support dynamic addition of new applications without code changes through YAML configuration updates
- Provide centralized management interface for all applications based on YAML-defined app metadata
- Integrate with AI-assisted remote page integration system for automated contact data synchronization
- Include de-duplication logic to prevent duplicate app entries in the management system

### All App Features Comparison Analytics System
- Implement comprehensive analytics page with dynamic x/y axis table configuration managed through YAML settings
- Support Admin control for table management operations based on YAML-defined admin permissions
- Provide AI assistant admin capabilities with auto-fill functionality according to YAML AI integration settings
- Monitor and validate all AI actions through Admin oversight as specified in YAML approval workflows
- Support subscriber interactions and rate-limiting based on YAML-defined user management policies
- Integrate AI-assisted comparison data from remote page integration system

### Advanced Filter Management System with AI Auto-Population
- Implement filter management system with operations defined in YAML configuration
- Support both manual and AI auto-population based on YAML AI integration settings
- Enable dynamic filter creation according to YAML-defined filter policies
- Provide bulk operations and user preference management as specified in YAML user settings

### Enhanced PayPal Payment Integration System
- Integrate PayPal subscription payment options for all applications using YAML payment configuration
- Create dedicated payment sections with configurations defined in YAML payment settings
- Implement modular payment architecture based on YAML-defined payment policies
- Support subscription management and financial reporting according to YAML payment tracking settings

### Advanced AI-Powered Sitemap Management System
- Implement comprehensive sitemap management with AI auto-discovery based on YAML AI configuration
- Support multiple input methods according to YAML-defined sitemap import settings
- Process hierarchical sitemap structures as specified in YAML sitemap organization rules
- Enable admin controls and auto-verification based on YAML admin permission settings

### Enhanced Features Management with Dual AI and Admin Validation
- Implement dual validation system with AI and admin verification based on YAML validation configuration
- Auto-check features according to YAML-defined AI validation rules
- Track implementation status and validation workflows as specified in YAML feature management settings
- Generate validation checkboxes automatically from YAML configuration keys
- Require admin affirmation for all critical features as defined in YAML approval workflows

### Robust Error Handling and Application Reliability
- Implement comprehensive error boundaries and fallback mechanisms based on YAML reliability configuration
- Provide graceful degradation according to YAML-defined fallback policies
- Display clear error messages and validation failures with detailed feedback in admin panel
- Handle all error scenarios with user-friendly feedback according to YAML error handling configuration

## Backend Data Storage

The backend must store:
- **CRITICAL REBUILD**: Empty Pages Registry Table data structure with no demo or placeholder entries
- **CRITICAL REBUILD**: Local storage persistence data for Pages Registry Table including inline editing states, selection states, and row data
- **CRITICAL REBUILD**: Row selection state data for individual and SelectAll checkboxes in Pages Registry Table
- **CRITICAL REBUILD**: Bulk delete confirmation and success state data for selected rows
- **CRITICAL REBUILD**: Add Row form state data and input validation for new entries
- **FIXED SHARE SELECTED**: Share Selected button state data including dynamic count updates and validation status
- **FIXED SHARE SELECTED**: Robust shared handler configuration data for collecting selectedPageIds, validating data integrity, and fetching corresponding rows
- **FIXED SHARE SELECTED**: Enhanced tab update method data for Overview, Compare, Sites, and Apps tabs with immediate UI refresh and error recovery
- **FIXED SHARE SELECTED**: Comprehensive success/error notification state data for sharing operation completion feedback with detailed messaging
- **FIXED SHARE SELECTED**: Advanced data replacement and clearing logic state data for handling schema mismatches, permission restrictions, and fallback operations
- **FIXED SHARE SELECTED**: Error recovery mechanism data for automatic data clearing and repopulation when direct replacement fails
- **FIXED SHARE SELECTED**: Data integrity validation state data ensuring successful transfer between Pages Registry Table and target tabs
- **NEW MULTI-FILE UPLOAD**: Multi-file upload support data for `.json`, `.csv`, `.md`, `.mo`, and `.zip` file formats
- **NEW MULTI-FILE UPLOAD**: Client-side file parsing state data and validation results for uploaded datasets
- **NEW MULTI-FILE UPLOAD**: Dataset replacement confirmation state data and file name tracking
- **NEW DATASETS MODAL**: Datasets modal state data including uploaded file names and replacement actions
- **NEW DATASETS MODAL**: File management state data for dataset operations and confirmations
- **CRITICAL RESTORATION**: Independent data sources for Apps, Overview, and Comparison tabs as primary datasets
- **NEW APPEND-ONLY INTEGRATION**: Append-only integration data from Sites tab → Secoinfi-Apps registry (26 apps) for Apps, Overview, and Comparison tabs
- **NEW APPEND-ONLY INTEGRATION**: Canonical URL mapping data from Sites registry for append-only integration across tabs
- **NEW APPEND-ONLY INTEGRATION**: Deduplication tracking data to prevent duplicate entries when appending Secoinfi app links
- **NEW APPEND-ONLY INTEGRATION**: Version 84 behavior preservation data ensuring no UI redesign or schema changes
- **NEW APPEND-ONLY INTEGRATION**: Data-fetch/composition layer configuration for append logic implementation
- **UNCHANGED**: Sites tab data continuing to show the full Secoinfi-Apps registry with ranks and canonical URLs
- **NEW**: Dual verification system data for Features page including AI verification checkbox states and Admin-only approval checkbox states
- **NEW**: Verification state persistence data ensuring consistency across reloads and views for both AI and Admin verification
- **NEW**: Automatic AI verification trigger data when features/tasks are successfully implemented
- **NEW**: Manual Admin approval workflow data for final feature validation through second checkbox
- **NEW SECOINFI APPS SECTION**: SECOINFI Apps table data with columns: `#`, `App Name`, `Sub‑Domain`, `Canonical URL`, `Status`, and `RBAC Visibility`
- **NEW SECOINFI APPS SECTION**: App metadata for automatic inference of Status and RBAC Visibility for 26 SECOINFI apps
- **NEW SECOINFI APPS SECTION**: Clickable link configuration data for Overview, Sites, Sitemap, and Secure Routes pages within MOAP
- **NEW SECOINFI APPS SECTION**: First-class entry registration data for audit, crypto, and verification flows participation
- **CRITICAL CLEANUP**: Empty `secRegistry` array data structure in backend maintaining valid syntax for other consumers
- **NEW COMBINED APPS DISCOVERY**: Combined apps array data structure merging `originalPages` and `secoInfiApps` into `allApps` for unified discovery operations
- **NEW COMBINED APPS DISCOVERY**: Discovery operation state data for all 38 combined apps including progress tracking and sequential processing
- **NEW COMBINED APPS DISCOVERY**: Button label and count data reflecting total combined apps (e.g., "Discover All 38 Apps")
- **NEW COMBINED APPS DISCOVERY**: Sorting, ranking, and progress metrics data for the combined `allApps` dataset
- **NEW**: User authentication data including Passkey/WebAuthn credentials, OAuth2 tokens, TOTP secrets, and session information
- **NEW**: RBAC role assignments and permissions data for Guest, Subscriber, AppOwner, Admin roles
- **NEW**: Route protection configuration data with required roles, authentication methods, and sitemap visibility rules
- **NEW**: P2P sharing data including share configurations, approval states, encryption keys, and per-app targeting settings
- **NEW**: Cryptographic data including Ed25519 signatures, ZK proofs, key rotation schedules, and HSM/KMS configurations
- **NEW**: Manifest logs and audit trail data with append-only structure, correlation IDs, and cryptographic integrity verification
- **NEW**: SECOINFI app integration data including app IDs, public keys, ZK schemas, royalty configurations, and auto-verification workflows
- Enhanced Site Management data including categorized cards sorted A-Z by page link names with dynamic population based on top-performing pages
- **NEW**: Clickable link data for each site card including "View Page" button configurations and URL routing information using canonical URLs
- **NEW**: Link preview metadata and navigation data for site management cards with proper URL validation
- Leaderboard metrics and ranking data for all app subdomains with real-time comparison tracking
- Card information including app name, subdomain, top featured page, category, click/vote metrics, and leaderboard score comparison
- Real-time comparator data that automatically updates leaderboard rankings when pages surpass global scores
- Combined feature/functional advantage analysis results for leaderboard ranking calculations
- **NEW**: Ranking & Indices page data including SEO rankings, visitor metrics, session duration, page indexing, popularity scores, load speeds, revisit rates, search engine sources, crawled pages, rank deltas, PPC indicators, TTL, search volumes, and content quality scores
- **NEW**: Third-party SEO/analytics data sources configuration and API endpoint information for ranking data retrieval
- **NEW**: Manual admin input data and override settings for ranking information with validation states
- **NEW**: Client-side cache data for ranking metrics with refresh control settings and rate limit management
- **NEW**: Live monitoring dashboard data including real-time ranking signals, change deltas, and alert configurations
- **NEW**: Auto-refresh interval settings and pause/resume state data for live monitoring functionality
- **NEW**: Visual indicator configuration data for rank changes including up/down arrows and heat color mappings
- **NEW**: Broadcast toggle state data for pushing live monitoring pages to all apps via Broadcast Hub
- **NEW**: Admin panel configuration data for third-party data sources, weighting rules, and manual override settings
- **NEW**: Dual validation state data for ranking system: AI-collected (auto-checked) + Admin-verified (manual checkbox)
- **NEW**: Data source weighting and combination rules for unified ranking calculations across multiple sources
- **NEW**: Audit trail data for all admin modifications and data source changes in ranking system
- All existing backend data storage requirements from the original specification

## Backend Operations

The backend must process:
- **CRITICAL REBUILD**: Pages Registry Table operations starting with empty data structure and no demo entries
- **CRITICAL REBUILD**: Local storage persistence operations for Pages Registry Table state management
- **CRITICAL REBUILD**: Inline editing operations including edit mode activation, input validation, and save persistence
- **CRITICAL REBUILD**: Row selection operations for individual and SelectAll checkboxes with state tracking
- **CRITICAL REBUILD**: Bulk delete operations with confirmation dialog and success feedback
- **CRITICAL REBUILD**: Add Row operations with input validation, state updates, and immediate re-rendering
- **FIXED SHARE SELECTED**: Enhanced Share Selected button operations with dynamic count updates, data validation, and error handling
- **FIXED SHARE SELECTED**: Robust shared handler operations for collecting selectedPageIds, validating data integrity, and fetching corresponding row data with comprehensive error recovery
- **FIXED SHARE SELECTED**: Advanced tab data replacement operations for Overview, Compare, Sites, and Apps tabs with immediate UI refresh, fallback mechanisms, and consistency validation
- **FIXED SHARE SELECTED**: Comprehensive success/error notification operations for sharing completion feedback with detailed status reporting
- **FIXED SHARE SELECTED**: Enhanced data clearing and reloading operations for handling schema mismatches, permission restrictions, and automatic recovery workflows
- **FIXED SHARE SELECTED**: Data integrity validation operations ensuring successful transfer and consistency between Pages Registry Table and target tabs
- **FIXED SHARE SELECTED**: Error recovery operations with automatic fallback to data clearing and repopulation when direct replacement fails
- **NEW MULTI-FILE UPLOAD**: Multi-file upload processing operations for `.json`, `.csv`, `.md`, `.mo`, and `.zip` formats
- **NEW MULTI-FILE UPLOAD**: Client-side file parsing operations with validation and data extraction
- **NEW MULTI-FILE UPLOAD**: Dataset replacement operations with confirmation workflow and state management
- **NEW DATASETS MODAL**: Datasets modal operations including file name tracking and replacement actions
- **NEW DATASETS MODAL**: File management operations for dataset handling and confirmations
- Enhanced Apps Management Operations with SECOINFI Apps Section and Row Selection
- **NEW SECOINFI APPS SECTION**: Process SECOINFI Apps table operations with automatic metadata inference
- **NEW SECOINFI APPS SECTION**: Handle clickable link operations for Overview, Sites, Sitemap, and Secure Routes pages
- **NEW SECOINFI APPS SECTION**: Process first-class entry registration operations for audit, crypto, and verification flows
- **CRITICAL CLEANUP**: Maintain empty `secRegistry` array operations ensuring compatibility with existing consumers while removing all demo/placeholder data
- **NEW COMBINED APPS DISCOVERY**: Process combined apps array operations merging `originalPages` and `secoInfiApps` into `allApps`
- **NEW COMBINED APPS DISCOVERY**: Handle discovery operations across all 38 combined apps with sequential processing and progress tracking
- **NEW COMBINED APPS DISCOVERY**: Process button label and count updates reflecting total combined apps
- **NEW COMBINED APPS DISCOVERY**: Handle sorting, ranking, and progress metrics operations for the combined dataset
- Authentication & RBAC Operations
- Route Protection & Secure Routes Operations
- P2P Data-Sharing Operations
- Cryptography & ZK-Proof Operations
- Manifest Logs & Audit Trail Operations
- SECOINFI Integration Framework Operations
- Enhanced Site Management Operations with Canonical URL Validation
- Enhanced Broadcast Hub Operations with Independent Data Sources
- Enhanced Features Page Operations with Dual Verification System
- Enhanced Fixtures Leaderboard Operations with Append-Only Secoinfi-Apps Integration
- Enhanced Comparison Tab Operations with Append-Only Secoinfi-Apps Integration
- Enhanced Overview Tab Operations with Append-Only Secoinfi-Apps Integration
- Ranking & Indices Page Operations (/rank)
- Live Monitoring & Broadcast Page Operations (/live)
- Enhanced Ranking System Admin Operations
- All other existing backend operations from the original specification

## Key Features

The platform includes:
- **CRITICAL REBUILD**: Rebuilt Pages Registry Table with empty initialization, full CRUD operations, and local storage persistence
- **FIXED SHARE SELECTED**: Fixed Share Selected functionality with robust data validation, cross-tab data replacement, error recovery, and comprehensive success/error feedback
- **NEW MULTI-FILE UPLOAD**: Multi-file upload system supporting `.json`, `.csv`, `.md`, `.mo`, and `.zip` formats with client-side parsing
- **NEW DATASETS MODAL**: Datasets management modal with file tracking and replacement confirmation workflow
- Enhanced Apps Management System with SECOINFI Apps Section, Row Selection, and Inline Editing
- **NEW COMBINED APPS DISCOVERY**: Combined apps discovery system merging `originalPages` and `secoInfiApps` into unified `allApps` array for comprehensive discovery operations across all 38 apps
- Enhanced Site Management System with Canonical URL Validation and Clickable Hyperlinks
- Enhanced Broadcast Hub System with Independent Data Sources
- Enhanced Features Page System with Dual Verification
- Enhanced Fixtures Leaderboard System with Append-Only Secoinfi-Apps Integration
- Enhanced Comparison Tab with Append-Only Secoinfi-Apps Integration and Dynamic Feature Integration
- Enhanced Overview Tab with Append-Only Secoinfi-Apps Integration
- Ranking & Indices Page System (/rank)
- Live Monitoring & Broadcast Page System (/live)
- Enhanced Ranking System Admin Controls
- Home Page Layout Enhancement
- Authentication & RBAC System
- Route Protection & Secure Routes System
- P2P Data-Sharing Module
- Cryptography & ZK-Proof Engine
- Manifest Logs & Audit Trail System
- SECOINFI Integration Framework
- All other existing key features from the original specification

## User Interface

The user interface provides:
- **CRITICAL REBUILD**: Rebuilt Pages Registry Table interface with empty initialization, inline editing, row selection, and bulk operations
- **FIXED SHARE SELECTED**: Fixed Share Selected button interface with dynamic count display, robust cross-tab data sharing functionality, comprehensive error handling, and detailed success/error feedback
- **NEW MULTI-FILE UPLOAD**: Multi-file upload interface supporting multiple file formats with drag-and-drop functionality
- **NEW DATASETS MODAL**: Datasets management modal interface with file listing and replacement confirmation
- Enhanced Apps Management Interface with SECOINFI Apps Section, Row Selection, and Inline Editing
- **NEW COMBINED APPS DISCOVERY**: Combined apps discovery interface displaying unified "Discover All 38 Apps" functionality with progress tracking across merged `originalPages` and `secoInfiApps` datasets
- Enhanced Site Management Interface with Canonical URL Validation and Clickable Hyperlinks
- Enhanced Broadcast Hub Interface with Independent Data Sources
- Enhanced Features Page Interface with Dual Verification System
- Enhanced Fixtures Leaderboard Interface with Append-Only Secoinfi-Apps Integration
- Enhanced Comparison Tab Interface with Append-Only Secoinfi-Apps Integration and Dynamic Feature Integration
- Enhanced Overview Tab Interface with Append-Only Secoinfi-Apps Integration
- Enhanced Sitemap Interface with Independent Data Sources
- Ranking & Indices Page Interface (/rank)
- Live Monitoring & Broadcast Page Interface (/live)
- Enhanced Ranking System Admin Interface
- Home Page Layout Enhancement Interface
- Authentication & RBAC Interface
- Route Protection & Secure Routes Interface
- P2P Data-Sharing Interface
- Cryptography & ZK-Proof Interface
- Manifest Logs & Audit Trail Interface
- SECOINFI Integration Framework Interface
- All other existing user interface components from the original specification

## Export and Integration

The platform supports:
- **CRITICAL REBUILD**: Rebuilt Pages Registry Table export with local storage persistence and multi-format support
- **FIXED SHARE SELECTED**: Fixed Share Selected export functionality with robust cross-tab data replacement, immediate UI refresh, and comprehensive error recovery
- **NEW MULTI-FILE UPLOAD**: Multi-file upload export supporting `.json`, `.csv`, `.md`, `.mo`, and `.zip` formats
- **NEW DATASETS MODAL**: Datasets management export with file tracking and replacement workflows
- Enhanced Apps Management Export with SECOINFI Apps Section, Row Selection, and Inline Editing
- **NEW COMBINED APPS DISCOVERY**: Combined apps discovery export functionality supporting unified dataset operations across all 38 merged apps
- Enhanced Site Management Export with Canonical URL Validation
- Enhanced Broadcast Hub Export with Independent Data Sources
- Enhanced Features Page Export with Dual Verification System
- Enhanced Fixtures Leaderboard Export with Append-Only Secoinfi-Apps Integration
- Enhanced Comparison Tab Export with Append-Only Secoinfi-Apps Integration
- Enhanced Overview Tab Export with Append-Only Secoinfi-Apps Integration
- Ranking & Indices Page Export (/rank)
- Live Monitoring & Broadcast Page Export (/live)
- Enhanced Ranking System Admin Export
- Authentication & RBAC Export
- P2P Data-Sharing Export
- Cryptography & ZK-Proof Export
- Manifest Logs & Audit Trail Export
- SECOINFI Integration Framework Export
- All other existing export and integration features from the original specification

## Application Reliability Requirements

The platform ensures:
- **CRITICAL REBUILD**: Rebuilt Pages Registry Table reliability with robust state management and error handling
- **FIXED SHARE SELECTED**: Fixed Share Selected reliability with comprehensive error handling, data validation, cross-tab operation consistency, automatic recovery mechanisms, and detailed feedback systems
- **NEW MULTI-FILE UPLOAD**: Multi-file upload reliability with validation, error handling, and recovery mechanisms
- **NEW DATASETS MODAL**: Datasets management reliability with confirmation workflows and state consistency
- Enhanced Apps Management Reliability with SECOINFI Apps Section, Row Selection, and Inline Editing
- **NEW COMBINED APPS DISCOVERY**: Combined apps discovery reliability ensuring consistent operation across merged datasets with proper error handling and progress tracking
- Enhanced Site Management Reliability with Canonical URL Validation
- Enhanced Broadcast Hub Reliability with Independent Data Sources
- Enhanced Features Page Reliability with Dual Verification System
- Enhanced Fixtures Leaderboard Reliability with Append-Only Secoinfi-Apps Integration
- Enhanced Comparison Tab Reliability with Append-Only Secoinfi-Apps Integration
- Enhanced Overview Tab Reliability with Append-Only Secoinfi-Apps Integration
- Ranking & Indices Page Reliability (/rank)
- Live Monitoring & Broadcast Page Reliability (/live)
- Enhanced Ranking System Admin Reliability
- Home Page Layout Enhancement Reliability
- Authentication & RBAC Reliability
- P2P Data-Sharing Reliability
- Cryptography & ZK-Proof Reliability
- Manifest Logs & Audit Trail Reliability
- SECOINFI Integration Framework Reliability
- All other existing reliability requirements from the original specification

## Data Seeding Requirements

The platform initializes with:
- **CRITICAL REBUILD**: Empty Pages Registry Table initialization with no demo or placeholder data
- **FIXED SHARE SELECTED**: Fixed Share Selected functionality initialization with proper button state, robust cross-tab integration setup, error handling configuration, and comprehensive feedback systems
- **NEW MULTI-FILE UPLOAD**: Multi-file upload system initialization with supported format configurations
- **NEW DATASETS MODAL**: Datasets management modal initialization with empty file tracking state
- Enhanced Apps Management Seeding with SECOINFI Apps Section, Row Selection, and Inline Editing
- **NEW COMBINED APPS DISCOVERY**: Combined apps discovery seeding with merged `originalPages` and `secoInfiApps` datasets initialization for unified operations
- Enhanced Site Management Seeding with Canonical URL Validation
- Enhanced Broadcast Hub Seeding with Independent Data Sources
- Enhanced Features Page Seeding with Dual Verification System
- Enhanced Fixtures Leaderboard Seeding with Append-Only Secoinfi-Apps Integration
- Enhanced Comparison Tab Seeding with Append-Only Secoinfi-Apps Integration
- Enhanced Overview Tab Seeding with Append-Only Secoinfi-Apps Integration
- Enhanced Sitemap Seeding with Independent Data Sources
- Ranking & Indices Page Seeding (/rank)
- Live Monitoring & Broadcast Page Seeding (/live)
- Enhanced Ranking System Admin Seeding
- Home Page Layout Enhancement Seeding
- Authentication & RBAC Seeding
- P2P Data-Sharing Seeding
- Cryptography & ZK-Proof Seeding
- Manifest Logs & Audit Trail Seeding
- SECOINFI Integration Framework Seeding
- All other existing data seeding requirements from the original specification
