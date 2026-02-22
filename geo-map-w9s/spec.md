# GPS Grid Maps App

## Overview
A mapping application that provides both 3D globe (ECEF projection) and 2D world map (Web Mercator projection) views with interactive grid overlays and geospatial operations. Features interactive image layer management with precise positioning controls in 3D and panoramic stitching in 2D. Includes subscription-based access to premium features, Pay As You Use (PAYU) plans, referral system with tracking, and comprehensive business pages. Enhanced with multiple overlay layers from OSM and other open-source providers for comprehensive geospatial visualization.

## Core Features

### Map Views
- 3D globe view using ECEF projection with Three.js integration
- Solid sphere mesh (not wireframe) with interactive image layer management
- Support for multiple user-uploaded or provided images that can be wrapped around the sphere
- Interactive image positioning with push-pull and scale controls along x, y, and z axes for each image layer
- Images must fill the entire sphere surface with no gaps or exploded view
- Sphere diameter matches the viewport with seamless image wrapping using 1:1 UV-mapped texture
- Smooth zoom and pan controls for 3D globe navigation
- 2D world map view using Web Mercator projection with interactive panoramic image stitching
- Support for up to 6 images in 2D view with move, scale, and align controls (x and y axes only)
- Seamless panoramic projection combining multiple images edge-to-edge to fill the entire rectangular viewport
- Image blending and snapping to grid intersections for perfect alignment in 2D view
- Globe rendering area displays as a true circle matching the sphere's diameter
- Both map views must zoom accurately and proportionally with user interactions, maintaining high visual fidelity
- Anti-aliasing, mipmaps, and high-quality image smoothing enabled for smooth zoom transitions
- Toggleable grid overlays with two types:
  - Axis-aligned grids
  - Geodesic/S2-style grids
- Scalable grid resolution controls with telescope-like zoom (10x to 1,000,000x)
- Admin/Subscriber configurable cell division and grid resolution for pin-point precision
- Toggle option for grid lines on/off in 3D view

### Geocoding System
- Primary geocoding API: Geoapify with autocomplete functionality
- Fallback geocoding API: OpenCage for redundancy
- Backend caching system to prevent quota and rate-limit issues
- Modular and pluggable provider architecture for easy API switching
- Address search with real-time suggestions and autocomplete
- Coordinate-to-address reverse geocoding
- Error handling and graceful fallback between providers
- Cache management with expiration and refresh logic

### Overlay Layer System
- Multiple overlay layers from OSM and other top free/open-source globe data providers
- Base layer using neutral-sphere-texture as foundation
- Available overlay types:
  - Roads and transportation networks
  - Railways and transit systems
  - Rivers and waterways
  - Vegetation and land cover
  - Climate data visualization
  - Flood alerts and warnings
  - Natural disaster alerts and monitoring
  - National borders and administrative boundaries
- Each overlay layer can be toggled on/off independently in both 3D globe and 2D panoramic views
- Scalable and measurable overlays that maintain accuracy across zoom levels
- Live-search functionality for property locations with demographic images and data
- Layer controls UI for enabling/disabling each overlay type
- Accurate mapping and zoomable overlays in both 3D and 2D views
- Integration with available APIs and open raster/vector data sources
- Robust error handling for overlay loading and rendering failures

### Interactive Coordinate Display
- Real-time tooltip system for both 3D globe and 2D panoramic map views
- Mouse hover tooltip appears after 3 seconds, displaying:
  - Precise latitude, longitude, and altitude coordinates
  - Current grid number and cell ID
  - X, Y, Z coordinate values
  - All calculations performed with maximum precision and accuracy
- Tooltip updates in real-time as mouse moves across the surface
- Advanced coordinate display similar to Google Maps context menu but with additional grid and coordinate data
- Robust, error-free coordinate conversion calculations between projection systems
- Futuristic, responsive UI design for tooltip display
- Works seamlessly for both pin and node placement operations

### Pin Management
- Pin and node placement logic imported from https://pointp.in/ for precise coordinate generation on 2D map
- Same marker style and real-time coordinate display as referenced canvas code
- Place pins by entering latitude, longitude, and altitude coordinates
- Place pins by clicking on the map
- Display pin coordinates and corresponding grid cell IDs
- Snap pins to nearest grid intersection (axis-aligned or geodesic)
- Visual pin markers on both 2D and 3D views
- Bulk pin/node access through subscription system and PAYU plans
- Robust error handling for pin placement operations

### Geometric Operations
- Draw great-circle arcs between pins
- Draw radii between pins
- Visualize intersections between arcs/radii and grid lines
- Create polygons by connecting multiple pins
- Polygon triangulation functionality
- Snap polygon vertices to grid intersections
- All mathematical operations designed to avoid bigInt and fraction issues

### Image Management
- Interactive image layer management system for both 3D and 2D views
- Support for user-uploaded or provided images
- 3D Globe image controls:
  - Push-pull and scale controls along x, y, and z axes for each image layer
  - Precise wrapping around sphere surface with no gaps
  - Multiple image layer support with individual positioning
- 2D Map image controls:
  - Move, scale, and align controls for x and y axes (no z-axis)
  - Support for up to 6 images with panoramic stitching
  - Image blending and grid intersection snapping
- Real-time adjustment with UI controls (sliders or drag handles)
- Session persistence for all manual adjustments
- Admin-only save functionality to preserve configurations permanently
- Reset-to-default functionality for image adjustments
- Robust error handling for image loading and processing

### Property Search and Demographics
- Live-search functionality for property locations using geocoding system
- Integration with demographic data and images
- Property location visualization on both 3D and 2D views
- Demographic data overlay with visual indicators
- Search results with property details and location coordinates
- Integration with geocoding cache for improved performance

### Subscription System
- User subscription plans for bulk access to nodes/pins
- Pay As You Use (PAYU) subscription plans:
  - Sale of 10 pins/nodes for $100
  - Rental of 100 pins/nodes for $100
  - Lease of 1000 pins/nodes for $100
- Multi-tab sections displaying PAYU options on Home, Features, and Subscribers pages
- Payment integration with Stripe, PayPal, UPI, and Demand Draft (DD)
- Subscription management and billing
- Robust error handling for payment processing

### Referral System
- Referral banners with unique tracking codes using Merkle root as UID
- Auto-assigned permalinks for referrers
- Top referrer payouts:
  - Top 10 Sales Referral: $100
  - Top 50 Rental Referral: $100
  - Top 100 Lease Referral: $100
- Predictable income table/form showing 12x returns in 12 months to attract clients
- UID, Nonce, and UserID tracking for all transactions
- Referral tracking and commission management

### Enhanced Sitemap System
- Extended sitemap system with non-breaking additive `pages[]` array containing unique page list:
  `["about","admin","apps","angel-vc","blog","block","broadcast","compare","contact","dash","dex","e-com","faq","finance","fix","fixture","footstep","lang","leader","live","main","map","milestone","pages","payments","pros","rank","referral","remote","resource","routes","secure","sitemap","terms","trust","what","verifySig","when","where","who","why","ZKProof"]`
- Existing auto-generated sitemap remains authoritative while `pages[]` represents manually prioritized unique pages
- Strict role-based access control: only admin users can add to or remove from `pages[]`
- Admin-only form accessible at `/admin` and `/sitemap` pages with:
  - Text input field (`Page Slug`) with validation for lowercase, uniqueness, and no spaces
  - "+ Add Page" button that appends validated entries to the `pages[]` array
  - Read-only list showing existing pages with disabled delete/edit options for system pages
- Integrated controlledRoutes object in sitemap data model with `/broadcast`, `/remote`, and `/live` delegates mapped to `Secoinfi-App` logic, accessible only by admin users
- Non-breaking sitemap resolution order: (1) auto-sitemap, (2) manual `pages[]`, (3) admin-controlled routes
- Merkle root-based page audit entries storing timestamps and admin signatures for `pages[]` updates
- Optional versioned snapshots for tracking sitemap evolution
- Frontend and backend enforce permissions consistently while maintaining backward compatibility

### Data Management
- Store all user operations in an append-only manifest log
- Log entries include: timestamp, userId, operation type, inputs, outputs, spatial reference system (SRS), resolution, and Ed25519 signature
- Operations logged: pin placement, grid snapping, arc/radius creation, polygon creation, image adjustments
- Store image adjustment configurations with user session data
- Store multiple image layers with positioning data for both 3D and 2D views
- Admin-saved image configurations stored permanently in backend
- Backup and secure storage of all unique data including property-catalog and referral details
- Modular, failure-resilient system architecture
- Referral tracking data with UID, Nonce, and UserID for transactions
- Store sitemap `pages[]` array with admin-only modification permissions
- Store controlledRoutes object with admin access controls
- Store page audit entries with Merkle root-based signatures and timestamps
- Store optional versioned snapshots of sitemap evolution
- Robust error handling and data integrity checks

### Administrative Controls
- Admin-only toggles for critical operations:
  - Grid definition changes
  - Polygon export functionality
  - Cell division and grid resolution configuration
  - Image adjustment configuration saving
  - Overlay layer management and configuration
  - Sitemap `pages[]` array management
  - ControlledRoutes object configuration
- Admin-only forms for secret/public key management and allowed countries configuration
- Admin-only sitemap management form with page slug validation and addition functionality
- Cryptographic hash storage of sensitive configuration data
- Auto-verification system for data integrity during updates/upgrades/migrations
- Live status banners for system state
- Error log display for troubleshooting
- Merkle root-based audit trail for sitemap modifications

### Business Pages
Complete business website structure including:
- Dashboard with user analytics, subscription status, and predictable income table (12x in 12 months)
- Features overview page with PAYU multi-tab sections
- Home page with PAYU multi-tab sections
- Subscribers page with PAYU multi-tab sections
- Blog section for updates and tutorials
- About Us company information
- Pros of e-Contracts educational content
- What We Do service descriptions
- Why Us competitive advantages
- Contact Us with SECOINFI business details including:
  - CEO & Founder: DILEEP KUMAR D
  - Primary Email: dild26@gmail.com
  - Business Phone & WhatsApp: +91-962-005-8644
  - Website: www.seco.in.net
  - Business Address: Sudha Enterprises, No. 157, V R VIHAR, VARADARAJ NAGAR, VIDYARANYAPUR PO, BANGALORE-560097
  - PayPal: newgoldenjewel@gmail.com
  - UPI ID: secoin@uboi
  - ETH ID: 0x4a100E184ac1f17491Fbbcf549CeBfB676694eF7
  - "Connect With Us" section with social media links:
    - Facebook: https://facebook.com/dild26
    - X (Twitter): https://x.com/dil_sec
    - LinkedIn: https://www.linkedin.com/in/dild26
    - Instagram: https://www.instagram.com/newgoldenjewel
    - Telegram: https://t.me/dilee
    - Discord: https://discord.com/users/dild26
    - Blogspot: https://dildiva.blogspot.com/
    - YouTube: https://www.youtube.com/@dileepkumard4484
- FAQ section for common questions
- Terms & Conditions legal documentation
- Referral program management with top referrer payouts section and predictable income table/form
- Proof of Trust credibility indicators
- Enhanced sitemap page with admin controls for `pages[]` management
- Templates library for common use cases
- Upload functionality for data import
- Analytics dashboard for usage metrics
- Reports generation and export
- Settings for user preferences and account management
- Help documentation and support

### Offline Support
- Local cache for grid indices
- Local cache for pin and polygon data
- Local cache for image adjustment configurations and layer data
- Local cache for overlay layer data and configurations
- Local cache for geocoding results
- Local cache for sitemap data and `pages[]` array
- Offline-first operation capability

## Backend Requirements
- Store user pins with coordinates and metadata
- Store polygon data and triangulation results
- Store complete manifest log of all operations with cryptographic signatures including image adjustments
- Store image layer configurations for user sessions with positioning data for both 3D and 2D views
- Store admin-saved image configurations permanently with multiple layer support
- Store user-uploaded images and provided image references
- Manage user authentication and admin permissions
- Handle subscription management, PAYU plans, and payment processing
- Store encrypted configuration data (keys, allowed countries) with hash verification
- Handle grid cell ID calculations and lookups with maximum precision
- Process geometric calculations for arcs, radii, and intersections
- Perform real-time coordinate conversions between ECEF and Web Mercator projections
- Calculate precise latitude, longitude, altitude, and grid coordinates for mouse position queries
- Manage business page content and user-generated content
- Store SECOINFI business contact information and social media links
- Manage referral system with UID, Nonce, and UserID tracking
- Store referral banners, tracking codes, and commission data
- Handle property-catalog data storage with backup and security
- Implement modular, failure-resilient data storage system
- Store pin and node placement logic and coordinate generation data from pointp.in integration
- Integrate with OSM and other open-source geospatial data APIs
- Store overlay layer configurations and toggle states per user
- Cache overlay data from external sources for performance
- Handle property search queries and demographic data integration
- Store overlay layer metadata and source information
- Manage API keys and rate limiting for external data sources
- Implement geocoding cache system with Geoapify and OpenCage integration
- Store geocoding results with expiration timestamps
- Manage geocoding API quotas and rate limiting
- Provide modular geocoding provider interface for easy switching
- Handle geocoding error recovery and fallback logic
- Store sitemap `pages[]` array with admin-only modification permissions
- Store controlledRoutes object with `/broadcast`, `/remote`, and `/live` delegates mapped to `Secoinfi-App` logic
- Implement Merkle root-based page audit entries with timestamps and admin signatures for `pages[]` updates
- Store optional versioned snapshots for tracking sitemap evolution
- Enforce strict role-based access control for sitemap management
- Maintain non-breaking sitemap resolution order: (1) auto-sitemap, (2) manual `pages[]`, (3) admin-controlled routes
- Validate page slug entries for lowercase, uniqueness, and no spaces
- Include the geo-map-w9s.node.js file in the project root directory
- Create a server.js file at the project root that imports express and the geo-map-w9s.node.js module
- Set up Express app that mounts the geo-map-w9s.node.js routes at the root path
- Configure server to run on port 443 with appropriate logging
- Robust error handling and logging for all backend operations
- Data integrity validation and recovery mechanisms

## Technical Specifications
- Application language: English
- Support both ECEF and Web Mercator coordinate systems
- Three.js integration for 3D globe with solid mesh rendering (not wireframe)
- Interactive image layer management with precise positioning controls for 3D sphere wrapping
- Seamless panoramic projection for 2D image stitching with up to 6 images
- Image blending and grid intersection snapping algorithms for 2D view
- Pin and node placement integration from https://pointp.in/ with canvas code compatibility
- Implement Ed25519 digital signatures for operation verification
- Grid systems: axis-aligned and S2/geodesic cell structures
- Cryptographic hashing for sensitive configuration storage
- Payment gateway integrations for multiple payment methods
- Mathematical precision handling to avoid bigInt/fraction issues
- Merkle root UID generation for referral tracking and page audit entries
- Secure backup and storage systems for unique data preservation
- Interactive image adjustment system with real-time controls for multiple layers
- Session-based persistence and admin-level permanent storage for image configurations
- UI controls (sliders/drag handles) for x, y, z positioning, scaling, and rotation in 3D
- UI controls for x, y positioning and scaling in 2D panoramic view
- Real-time preview and reset-to-default functionality for image adjustments
- Solid sphere rendering with seamless image wrapping and no gaps
- Panoramic image alignment and scaling algorithms for seamless 2D view
- High-precision coordinate calculation algorithms for real-time mouse position tracking
- Robust error handling for coordinate conversion and grid lookup operations
- Futuristic UI design patterns for tooltip and coordinate display systems
- Integration with OSM APIs and other open-source geospatial data providers
- Layer control system for overlay management in both 3D and 2D views
- Scalable overlay rendering with zoom-level optimization
- Property search integration with demographic data visualization
- Overlay data caching and performance optimization
- API integration for roads, railways, rivers, vegetation, climate, flood alerts, disaster alerts, and borders
- Base layer integration using neutral-sphere-texture asset
- Geoapify API integration with autocomplete functionality
- OpenCage API integration as fallback geocoding provider
- Modular geocoding provider architecture with pluggable interfaces
- Enhanced sitemap system with `pages[]` array management and admin controls
- Page slug validation algorithms for lowercase, uniqueness, and no spaces
- Sitemap resolution algorithms maintaining non-breaking compatibility
- Versioned snapshot system for sitemap evolution tracking
- Express.js server setup with geo-map-w9s.node.js module integration
- Server configuration for port 443 with proper error handling and logging
- Comprehensive error handling and recovery mechanisms throughout the application
- Performance monitoring and optimization for all critical operations
- Data validation and integrity checks for all user inputs and operations
