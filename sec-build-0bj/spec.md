# Ethereum Visual Sandbox

## Overview
An interactive drag-and-drop visual programming environment for Ethereum blockchain concepts, allowing users to create, connect, and execute visual workflows using blockchain components. Enhanced with reactive state management, comprehensive cryptographic functionality, advanced project management capabilities, and high-performance WebGL/OpenGL-based rendering for smooth interactivity and dynamic visualizations with unlimited modular tools. Features a professional CAD-style 3D viewer UI layout with comprehensive control panels and interactive navigation, now enhanced with intelligent magnetic-style interaction dynamics and AI-powered connectivity validation. Includes a secure Stripe payment and subscription integration system with execution-based billing for premium access to the SEC-Visual Builder Dashboard. Now featuring an interactive CLI shortcut system for automated tool connections and executions using command-line syntax. Extended with an advanced sitemap management system providing admin-controlled page routing and app delegation capabilities.

## Core Features

### Enhanced Sitemap Management System
- **Parallel Pages Array**: Non-breaking extension to existing sitemap with dedicated `pages[]` array for admin-priority pages
  - Initialize with predefined pages: ["about","admin","apps","angel-vc","blog","block","broadcast","compare","contact","dash","dex","e-com","faq","finance","fix","fixture","footstep","lang","leader","live","main","map","milestone","pages","payments","pros","rank","referral","remote","resource","routes","secure","sitemap","terms","trust","what","verifySig","when","where","who","why","ZKProof"]
  - Unique entries only with no deletions or overwrites of auto-generated sitemap nodes
  - Admin-controlled ordering and priority management
- **Backend Data Model Integration**: Extended sitemap structure with controlled routing
  - Auto-generated sitemap preservation with existing functionality
  - Manual pages array for admin-controlled unique pages
  - Controlled routes delegation system for specialized app routing
  - Metadata support for page auditing with hash, signature, and timestamp tracking
- **Admin Access Control**: Strict role-based permissions for sitemap management
  - Only users with `#admin` role can append to `pages[]` array
  - Admin-only control over broadcast/remote/live route delegation
  - Access control guards preventing unauthorized sitemap modifications
- **Sitemap Resolution Order**: Hierarchical routing system with clear precedence
  - Primary: Auto-generated sitemap routes (existing system)
  - Secondary: Admin-priority `pages[]` list with custom ordering
  - Tertiary: App-controlled routes with delegation to Secoinfi-Apps
- **UI Management Interface**: Admin forms within `/admin` and `/sitemap` pages
  - Text input with slug format validation (no spaces, unique entries)
  - "+ Add Page" button for appending new pages to admin list
  - Display list of existing pages with system route protection
  - Disable editing/deleting of system-generated routes
- **Controlled Route Delegation**: Specialized routing for external app integration
  - `/broadcast`, `/remote`, `/live` routes delegated to Secoinfi-Apps
  - Admin authorization required for app controller binding
  - Secure delegation system with proper access control validation
- **Compatibility Maintenance**: Full backward compatibility with existing systems
  - Motoko backend pattern preservation with extended data structures
  - Frontend routing system integration without breaking changes
  - Existing sitemap functionality maintained with additive enhancements

### Interactive CLI Shortcut System
- **CLI Input Interface**: Fixed bottom workspace CLI input field with professional terminal-style appearance
  - Syntax highlighting for command chains using `>` operator (e.g., `text > toHex > toHash`)
  - Real-time auto-completion for tool names based on registered modules in blockDefinitions.ts
  - Command history navigation using arrow keys (up/down) with persistent session storage
  - Responsive design maintaining visibility across all viewport sizes and theme modes
- **Command Parser and Validation**: Intelligent parsing system for CLI command chains
  - Split command chains on `>` operator and validate each tool against registered block definitions
  - Real-time validation with inline error messages for invalid or incompatible tool connections
  - Visual color feedback and tooltips for connection compatibility using AI connectivity rules
  - Support for complex multi-step transformation chains with intermediate validation
- **Magnetic Physics Integration**: Automated tool placement and connection using existing magnetic system
  - Auto-align validated tools in 3D workspace using magnetic physics system (magneticPhysics.ts)
  - Visual connection creation between tools with animated magnetic snap feedback
  - Real-time highlights and pulsating glows around tools being connected through CLI
  - Preserve existing manual connections while adding CLI-generated connections
- **Execution Engine Integration**: Sequential execution of CLI command chains
  - Stream outputs between connected tools following the CLI chain sequence
  - Dynamic visual connector updates showing real-time data flow during execution
  - Integration with existing execution billing system for CLI-triggered executions
  - Error handling and rollback for failed CLI executions with visual feedback
- **AI-Enhanced Auto-Completion**: Intelligent suggestion system for CLI commands
  - Real-time auto-completion suggestions based on AI connectivity engine (aiConnectivityRules.ts)
  - Context-aware suggestions considering current workspace state and tool compatibility
  - Suggested completion chains displayed in dropdown with compatibility scoring
  - Learning system that adapts suggestions based on user CLI usage patterns
- **Keyboard Shortcuts and Navigation**: Comprehensive keyboard control system
  - Enter key executes the current CLI chain with visual confirmation
  - Escape key clears CLI input and cancels any active CLI operations
  - Tab key cycles through auto-completion suggestions with visual highlighting
  - Integration with global keyboard event handling system for consistent behavior
- **Theme and Accessibility Integration**: Full compatibility with existing theme system
  - CLI interface maintains visibility and contrast across Light, Dark, and VIBGYOR themes
  - Syntax highlighting colors adapt to current theme with sufficient contrast ratios
  - Screen reader compatibility with ARIA labels for CLI commands and suggestions
  - Keyboard navigation support with proper focus management and tab order
- **Visual Feedback System**: Enhanced visual indicators for CLI operations
  - Real-time highlighting of tools referenced in current CLI command
  - Animated connection previews showing proposed tool connections before execution
  - Color-coded validation states (valid: green, invalid: red, pending: yellow)
  - Pulsating glows and animations for tools being processed in CLI chain
- **Command History and Persistence**: Comprehensive command management system
  - Persistent command history stored across user sessions with backend integration
  - Quick access to frequently used command patterns with usage analytics
  - Command bookmarking system for saving complex CLI chains
  - Export/import functionality for sharing CLI command libraries

### Global Keyboard Event Handling System
- **Universal Keyboard Controls**: Global event handling system for consistent interaction across all tool modules, popups, and dashboard elements
  - **Esc Key Behavior**: Cancels or minimizes any active tool, configuration popup menu, dashboard dialog (GPU performance monitor, adjacency graph state, AI connectivity panels), and clears CLI input
  - **Enter Key Behavior**: Confirms, accepts, or saves input or configuration changes for tools, menus, and settings, and executes CLI commands when CLI is focused
  - **Focus Management**: Intelligent keyboard focus handling with proper tab order and focus trapping in modal dialogs, including CLI input field
  - **Event Propagation Control**: Proper event handling to prevent conflicts between global shortcuts, input fields, and CLI commands
- **Accessibility Integration**: Full keyboard navigation support with ARIA attributes and screen reader compatibility
  - Focus indicators for all interactive elements with high contrast visibility including CLI interface
  - Keyboard shortcuts announced to screen readers with appropriate ARIA labels including CLI commands
  - Tab navigation through all window controls and interactive elements including CLI auto-completion
  - Escape hatch functionality for users relying on keyboard navigation including CLI operations

### Enhanced Universal Window Control System
- **Standardized Window Controls**: All dashboard menus, lists, controls, and statistic windows feature consistent window control icons
  - **Minimize ('_') Icon**: Collapses tool window while retaining position for quick reopening with slide-up animation
  - **Close ('x') Icon**: Removes tool pop-up or minimizes visibility with smooth fade-out animation
  - **Zoom ('^') Icon**: Enlarges selected tool to 30% of display area for focused editing and connection visualization
  - **Double-Click Zoom Support**: Double-clicking tool header also triggers zoom functionality
- **Consistent Icon Implementation**: All window controls use standardized assets for visual consistency
  - Minimize icon: `minimize-window-icon-transparent.dim_16x16.png`
  - Close icon: `close-window-icon-transparent.dim_16x16.png`
  - Zoom icon: `zoom-window-icon-transparent.dim_16x16.png`
  - Consistent positioning and styling across all dashboard elements
- **Smooth Transition Animations**: GPU-accelerated animations for all window state changes
  - Minimize animation: Smooth slide-up collapse with position retention
  - Close animation: Fade-out with scale transition for visual feedback
  - Zoom animation: Smooth scale and position transition to 30% display area
  - CSS transform animations with hardware acceleration for optimal performance
- **Dashboard Element Coverage**: Window controls implemented across all interface elements
  - GPU performance monitor dialogs with minimize/close functionality
  - Adjacency graph state windows with full window control support
  - AI connectivity panels with consistent control behavior
  - Configuration popup menus with keyboard and mouse control integration
  - Statistics windows and analytics displays with standardized controls
  - CLI interface with integrated window controls for command history and settings
- **Theme Integration**: Window controls maintain visibility and proper contrast across all themes
  - Light mode: Standard contrast with appropriate hover states
  - Dark mode: High contrast icons with light hover effects
  - VIBGYOR mode: Enhanced visibility with gradient-compatible styling
  - Automatic contrast adjustment for accessibility compliance

### Secure Stripe Payment and Subscription System
- **Subscription Plans**: Three-tier subscription model with execution-based billing
  - Basic Plan: $9/month with limited executions
  - Pro Plan: $45/month with expanded execution quota
  - Enterprise Plan: $99/month with unlimited executions
- **Pay-As-You-Use Execution Batches**: Purchase execution credits in batches (10, 100, 1,000, 10,000 executions)
- **Execution Tracking**: Real-time monitoring of "Execute" button presses and CLI command executions per user to trigger billing events
- **Subscription Management Dashboard**: User interface displaying current plan, payment history, execution quota, and usage metrics
- **Payment Processing**: Secure Stripe Checkout Sessions for subscriptions and one-time execution batch purchases
- **Billing Operations**: Support for refunds, cancellations, subscription upgrades/downgrades with prorated billing
- **Admin Analytics**: Admin-only access to payment analytics, reports, and user usage tracking including CLI usage statistics
- **Role-Based Access**: Admin users bypass payment requirements while maintaining execution tracking for analytics
- **Security Compliance**: HTTPS/SSL enforcement, webhook verification, and environment-protected API keys

### Navigation and Theme System
- **Top Navigation Menu**: Persistent navigation bar visible on all pages including login and subscription
  - Logo image and logo text positioned on the left side
  - Searchable navigation links for easy access to all sections including Subscription page
  - Responsive design adapting to mobile, tablet, and desktop layouts
  - Functional across all theme modes with appropriate contrast
- **VIBGYOR Theme Toggle**: Three-mode theme system with local persistence and robust color management
  - Light mode: Clean, bright interface with standard contrast (white backgrounds, dark text)
  - Dark mode: Dark background with light text and elements (dark backgrounds, light text)
  - Rainbow mode: VIBGYOR gradient themes throughout the interface with high contrast text overlays
  - Theme preferences stored locally to persist across user sessions
  - **Enhanced Theme Toggle Visibility**: Theme toggle button (icon and label) always visible and clearly displayed in all themes
  - **Guaranteed Contrast System**: Text and background color pairs validated to ensure sufficient contrast and prevent invisible elements
  - **Robust Color System**: Verified primary and secondary color palettes for each theme ensuring sufficient contrast
  - **Visual Fallback Mechanism**: Automatic fallback to Light mode if theme variables fail to load or render
  - **Reliable Theme Toggle**: Functional theme toggle button with real-time UI updates and localStorage persistence
  - **Enhanced Icon and Hover States**: Theme toggle updates icon visuals and hover states correctly with intuitive color changes per mode
  - **Pre-render Theme Validation**: Theme persistence in localStorage loads and validates properly before rendering to prevent blank pages
  - **Contrast Validation**: All text and background colors maintain minimum contrast ratios across all themes including CLI interface
  - **Anti-Blank Screen Protection**: Prevents black-on-black or white-on-white rendering scenarios
  - **Responsive Theme Accessibility**: Theme switcher remains accessible and functional across all device sizes
- **Bottom Navigation**: Consistent navigation controls
  - Menu icon positioned on left side for easy access
  - Responsive behavior across all device sizes
- **Public Access Routing**: All sitemap pages accessible without authentication
  - Public browsing and preview of all sections before login
  - Route guards distinguishing public vs authenticated content
  - Consistent UI/UX design maintained across all public pages
  - All cloned pages from https://map-56b.caffeine.xyz/ publicly accessible

### Professional CAD-Style UI Layout
- **Top Toolbar**: Comprehensive navigation and view controls with professional CAD interface
  - View preset buttons: Isometric (I), Front (F), Side (S), Top (T) with keyboard shortcuts
  - Navigation controls: Zoom In, Zoom Out, Reset View, Fit to View
  - Display mode toggles: Wireframe/Solid, Grid toggle, Perspective/Orthographic switch
  - Optional View Cube/Compass for 3D orientation visualization
- **Right Panel**: Dynamic contextual properties and tool settings
  - Real-time updates based on selected 3D block or module
  - Block configuration parameters with live preview
  - Connection properties and data flow settings
  - Live output preview panes for conversion blocks with dynamic updates
  - Collapsible sections for organized tool access
  - **AI Connectivity Panel**: Real-time compatibility analysis and suggestions
    - Data type compatibility matrix display
    - Connection validation status indicators
    - Suggested connection paths and workflow optimization
    - Rule configuration interface for custom validation logic
- **Bottom Status Bar**: Real-time workspace information display
  - Live cursor coordinates in 3D space
  - Current zoom level and view mode indicators
  - System notifications and execution status
  - Performance metrics and rendering information
  - **Magnetic Interaction Status**: Real-time feedback on connector states and attraction forces
  - **Execution Quota Display**: Real-time display of available executions and usage metrics
  - **CLI Status Indicator**: Current CLI command status and execution progress
- **Central 3D Viewport**: Large interactive OpenGL/WebGL workspace
  - Full rotation, pan, and zoom gesture support
  - Multi-touch and mouse interaction compatibility
  - Real-time block manipulation and connection editing
  - **Enhanced Magnetic Interaction Zone**: Visual feedback for attraction/repulsion fields
  - **CLI-Generated Connections**: Visual representation of CLI-created tool connections
- **Fixed CLI Interface**: Bottom-positioned command-line interface
  - Terminal-style input field with syntax highlighting and auto-completion
  - Command history navigation and persistent storage
  - Real-time validation and error feedback
  - Integration with workspace 3D viewport for visual tool highlighting
- **Workspace Management Controls**: Advanced view and session management
  - Save/Load View presets with custom naming
  - Split View toggle for multiple simultaneous viewports
  - Multi-viewport synchronization options
- **Enhanced Interactivity**: Professional user experience features
  - Smooth camera transition animations between view presets
  - Interactive tooltips with contextual help
  - Highlight indicators for active view modes
  - Responsive panel design with collapsible sections
  - Adaptive layout for different screen sizes
- **In-App Documentation Panel**: Contextual help and examples
  - Command-line examples for conversion tools (xxd, sha256sum, JavaScript usage)
  - Interactive documentation with code snippets and usage patterns
  - Tool-specific help content with practical examples
  - CLI command syntax documentation and examples

### Advanced Modular OpenGL Architecture with Magnetic Dynamics
- Unlimited modular tool system allowing dynamic addition of visual blockchain function blocks with full GPU acceleration
- Each module rendered as interactive 3D graphical object within WebGL scene using Three.js primitives (points, lines, polygons)
- **Dynamic 3D Node System**: Each tool/module represented as a 3D object with precise x, y, z coordinates in OpenGL space
- **Polarity-Assigned Connectors**: Input and output ports feature positive (+) and negative (-) polarity assignments for magnetic behavior
- **Magnetic Attraction/Repulsion Physics**: Compatible connectors attract and snap into place, incompatible ones repel or disable visually
- **Axis-Aligned Snapping System**: Configurable threshold distance for accurate alignment during drag-and-drop movement
- Independent rendering system for each module with reusable 3D components and real-time visual feedback
- **Modular Block API**: Extensible converter functions for data transformation blocks
  - Standardized interface for conversion operations (input validation, transformation, output formatting)
  - Reusable converter architecture supporting easy addition of new formats
  - Browser-native crypto and encoding APIs for all conversions (no external dependencies)
- Dynamic scene composition supporting on-the-fly addition/removal of visual tool components
- Scalable architecture designed for future module extensions by developers with comprehensive API documentation
- Event-driven pipeline updates ensuring every user action (drag, connect, input change, CLI command) immediately triggers visual rendering updates
- **CLI Integration**: Automated tool placement and connection system for CLI-generated workflows

### AI-Powered Connectivity Intelligence
- **AI Rule Evaluation Layer**: Intelligent compatibility checking between data types and logical flow validation
  - Data type compatibility analysis (e.g., numeric → hex allowed, numeric → contract disallowed)
  - Contextual tooltips, suggestions, and warnings during attempted connections
  - Logical flow validation preventing invalid circular dependencies
  - Real-time compatibility scoring and optimization suggestions
- **Dynamic Rule System**: Extensible rule definitions that evolve with user feedback and new tool types
  - Modular rule architecture supporting custom validation logic
  - Machine learning integration for pattern recognition in user workflows
  - Adaptive suggestions based on common connection patterns
- **Intelligent Connection Assistance**: AI-guided workflow optimization
  - Automatic path finding for complex data transformations
  - Suggested intermediate conversion steps for incompatible data types
  - Workflow efficiency analysis and optimization recommendations
- **CLI Auto-Completion Intelligence**: AI-enhanced command suggestions
  - Real-time analysis of CLI input for intelligent auto-completion
  - Context-aware suggestions based on current workspace state
  - Learning system that adapts to user CLI usage patterns
  - Compatibility scoring for suggested command chains

### Enhanced 3D Workspace Navigation with CAD-Style Views
- Main workspace where users can drag, drop, and arrange visual blocks with GPU-accelerated 3D rendering
- Standard CAD-style view presets: isometric, x-axis (front), y-axis (side), and z-axis (top) perspectives
- Animated transitions between view presets with smooth camera movements
- Interactive navigation controls with zoom, reset, and scaling adjustment buttons
- Mouse and gesture controls for panning, rotation, and zooming in 3D space
- Split-screen multi-viewport support for simultaneous perspectives of the same workspace
- Real-time connection system with WebGL-rendered visual lines linking block inputs and outputs
- Interactive camera controls for zooming, panning, and orbiting to explore complex computation flows from multiple perspectives
- Grid-based layout with snap-to-grid functionality for precise block positioning in 3D space
- Advanced undo/redo support with deep stack history and persistent session restoration
- Intelligent diff-tracking for performance optimization during workspace changes
- State rollback capabilities for workspace modifications
- Adjustable 3D directional arrows showing data flow between connected nodes
- Node highlights and animated color transitions indicating active computation or error states
- **CLI Visual Integration**: Real-time highlighting and connection visualization for CLI-generated workflows

### Real-Time Data Flow Visualization with GPU Shaders and Magnetic Feedback
- Dynamic I/O data flow visualization showing input → conversion → output transformations with GPU shader acceleration
- Live visual connectors displaying each transformation step in real-time with enhanced shader effects
- Animated connection lines in WebGL canvas representing data flow between conversion blocks
- **Color-Coded Connector States**: Visual feedback system for magnetic interaction states
  - Active connections: Green highlighting for established data flow
  - Invalid connections: Red highlighting for incompatible or blocked connections
  - Hovering state: Blue highlighting during proximity detection
  - Connected state: Yellow highlighting for successful magnetic snap connections
  - CLI-generated connections: Purple highlighting for command-line created connections
- Event-driven rendering updates with visual feedback when input or intermediate data changes
- Connected modules and connectors update visually through color changes, animations, glows, or pulses
- Inter-module connectivity using adjacency graphs with directional flow arrows representing data dependencies
- Real-time color-coding for data uniqueness and processing states
- Animated execution traces through connected blocks using GPU acceleration
- Enhanced GPU shaders to visualize cryptographic operations and transformations in real-time
- **Force-Based Physics Simulation**: GPU-accelerated magnetic field visualization and interaction dynamics
- **CLI Execution Visualization**: Real-time visual feedback for CLI command execution progress

### Enhanced Block Library with GPU Rendering and Magnetic Properties
Categorized panel containing draggable 3D blocks organized by functionality, all with GPU-accelerated rendering and magnetic connector properties:

#### Input Blocks
- Text input, number input, address input, private key input with real-time 3D visual feedback and magnetic output connectors
- Binary, decimal, and hex input converters with dynamic visual updates and polarity-assigned ports

#### Logic Blocks  
- If/else conditions, loops, mathematical operations, comparisons with GPU-rendered visual states and magnetic I/O ports
- **Math**: arithmetic operations, logic gates, numeric computations with real-time visual feedback and compatible connector types
- **Hex**: conversion utilities between binary, decimal, and hexadecimal formats with animated transitions and magnetic snapping

#### Conversion Tools
- **toHex**: converts string or number input to hexadecimal format (0x-prefixed) with visual transformation effects and magnetic compatibility
- **toHash**: generates SHA256 or Keccak256 hash from input data with real-time visual feedback and secure output connectors
- **toBinary**: converts hex or string input to binary representation (grouped every 8 bits) with animated transitions and magnetic alignment
- **toDecimal**: converts various formats to decimal with visual confirmation and numeric output polarity
- **toAscii**: converts data to ASCII format with real-time display and text-compatible magnetic ports
- **toBase64**: encodes data to Base64 format with visual process flow and encoding-specific connector behavior
- Each converter as pluggable, reusable block integrated with visual flow system and AI compatibility checking
- Live results display through connected input/output nodes with magnetic snap feedback
- Modular structure supporting easy addition of future conversion formats with automatic AI rule integration
- **CLI Compatibility**: All conversion tools accessible via CLI command syntax

#### Cryptographic Blocks
- **Hash**: deterministic 64-character hex generator using Keccak256 with visual transformation effects and secure magnetic ports
- **Keypair**: Ethereum-compatible public/private key generation with 3D visual representation and cryptographic connector polarity
- **Sign**: message signing using Ethereum standards with private keys and visual confirmation through magnetic key-message pairing
- **Verify**: signature verification using public keys and messages with color-coded results and validation-specific magnetic behavior
- **Encryption**: asymmetric encryption/decryption using Ethereum key pairs with visual process flow and secure magnetic connections
- **Elliptic Curve**: additional elliptic curve variations for advanced cryptographic operations with specialized connector types
- **ZKP Visualization**: mock zero-knowledge proof visualization blocks for educational purposes with proof-specific magnetic properties

#### Ethereum Ecosystem Tools
- **Smart Contract Deployer**: deploy contracts with mainnet and testnet selection and blockchain-compatible magnetic interfaces
- **Smart Contract Caller**: interact with deployed contracts using ABI with contract-specific connector behavior
- **ABI Encoder/Decoder**: encode and decode contract function calls and events with ABI-compatible magnetic ports
- **Event Listener**: real-time monitoring of blockchain events with visual feedback and event-stream magnetic connections
- **Nonce Visualizer**: display and track transaction nonces with replay protection and sequential magnetic ordering
- **Gas Fee Estimator**: calculate and optimize transaction gas fees with real-time pricing and fee-compatible connectors
- **Solidity Editor**: code editor with syntax highlighting and live error detection with code-output magnetic interfaces
- **Transaction Debugger**: visualize transaction traces and execution steps with debug-specific connector types
- **Wallet Simulator**: simulate wallet operations for signing and sending transactions with wallet-compatible magnetic ports
- **Network Manager**: configure and switch between multiple Ethereum networks with network-specific connector behavior
- **Security Scanner**: detect vulnerabilities in smart contracts with visual warnings and security-focused magnetic connections

#### Blockchain Blocks
- Wallet connection, balance checker, transaction sender, smart contract caller, block explorer with 3D representations and blockchain-compatible magnetic ports
- **Transaction**: creation and configuration of Ethereum transactions with nonce tracking and visual flow through transaction-specific magnetic interfaces
- **Ledger**: transaction execution and blockchain state visualization with GPU-accelerated updates and ledger-compatible connector behavior
- **Smart Contract**: interaction with deployed contracts using ABI and web3 integration with visual feedback and contract-specific magnetic properties
- **Object**: visualization and creation of transaction and blockchain data structures with object-compatible magnetic ports
- **Block Chaining**: visualization of transaction block propagation and nonce handling simulation with chain-specific magnetic connections

#### Display Blocks
- Text display, number display, transaction hash display, balance display with enhanced 3D rendering and display-compatible magnetic inputs
- Structured data visualization for complex objects with GPU acceleration and data-structure-specific connector types

### Interactive UI Overlays with Visual Validation and Magnetic Feedback
- Real-time data input/output controls including text entry, file load, and slider inputs with magnetic connector integration
- UI overlays that bind to visual elements in real-time with GPU rendering and magnetic interaction feedback
- Interactive controls integrated with 3D scene elements and magnetic field visualization
- Drag-and-drop interactivity optimized for 3D environment with magnetic snap assistance
- Visual validation overlays with color-coded warnings and icons for detecting invalid operations or data inconsistencies
- Real-time error detection with visual feedback through highlights, red glows, or warning icons enhanced by magnetic repulsion
- CAD-style navigation panels with intuitive icons and tooltips for magnetic interaction controls
- Modular plug-and-play UI design for all tools and views with magnetic compatibility indicators
- **CLI Interface Integration**: Terminal-style command input with syntax highlighting and auto-completion overlays

### Optimized GPU Performance System with Physics Simulation
- WebGL/OpenGL-based rendering layer using React Three Fiber for enhanced interactivity and magnetic dynamics
- GPU-accelerated rendering of block nodes, connection lines, and data flow visualization with magnetic field effects
- Enhanced shader-based visual effects for hashing process visualization and intermediate states with magnetic interaction feedback
- Hardware acceleration for block geometry, connection curves, and animated execution traces with force-based physics
- **Force-Based Physics Engine**: GPU-accelerated magnetic attraction/repulsion simulation with configurable field strength
- **Real-Time Collision Detection**: Optimized spatial partitioning for efficient magnetic interaction calculations
- Optimized GPU performance using custom shaders for real-time effects and transformations including magnetic field visualization
- Smooth frame-rate animations with comprehensive performance optimization for complex magnetic interactions
- Runtime performance monitoring and optimization for complex scenes with dynamic magnetic fields
- Event-driven pipeline architecture ensuring immediate visual updates for all user interactions and magnetic state changes
- GPU shader programming for real-time rendering and data flow animations with magnetic force visualization
- **CLI Performance Optimization**: Efficient parsing and execution of CLI commands with minimal performance impact

### Error Validation and Enhanced Visual Feedback with AI Integration
- Robust error-validation system integrated into WebGL scene with GPU-accelerated visual indicators and AI-powered suggestions
- Visual marking of invalid data or operations using highlights, red glows, or warning icons enhanced by magnetic repulsion feedback
- Real-time validation of connections and data types with enhanced visual feedback and AI compatibility scoring
- Comprehensive error boundaries to isolate block errors with color-coded visual states and intelligent error recovery suggestions
- Visual debugging overlays with performance metrics and connection state monitoring enhanced by AI analysis
- Animated error indicators and success confirmations with GPU rendering and magnetic interaction feedback
- Color-coded warnings in 3D views for enhanced error handling with AI-powered resolution suggestions
- **CLI Error Handling**: Real-time validation and error feedback for CLI command syntax and tool compatibility

### Reactive Block System with Real-Time Updates and Magnetic Intelligence
- Centralized reactive state system for synchronized updates across interconnected blocks with magnetic interaction tracking
- Event-driven architecture with inter-module locking during block execution and magnetic state management
- Each block has defined input and output ports with type validation and visual indicators enhanced by magnetic polarity assignment
- Visual connection system allowing data flow between compatible ports with GPU-rendered connections and magnetic snap feedback
- Block configuration panels for setting parameters with real-time visual feedback and magnetic compatibility analysis
- Dynamic module updates as users manipulate input/output data with immediate 3D visual response and magnetic field updates
- **AI-Enhanced Connectivity**: Intelligent suggestion system for optimal block connections and workflow patterns
- **CLI Integration**: Automated block creation and connection based on CLI command parsing

### Execution Engine with Visual Feedback and Magnetic Validation
- Play/pause/stop controls for workflow execution with GPU-accelerated visual states and magnetic connection validation
- Step-by-step execution with visual highlighting of active blocks using enhanced shader effects and magnetic flow indicators
- Queued task management for large complex workspaces with visual progress indicators and magnetic dependency tracking
- Integration with Ethereum public APIs for real blockchain data with magnetic compatibility validation
- Mock data mode for testing without network calls with simulated magnetic interaction behavior
- Comprehensive error handling with detailed error messages and enhanced visual feedback through magnetic repulsion indicators
- Deterministic test vectors for cryptographic function verification with visual validation and magnetic compatibility checking
- **AI-Powered Execution Optimization**: Intelligent workflow analysis and performance optimization suggestions
- **Execution Billing Integration**: Real-time tracking of Execute button presses and CLI executions with billing event triggers and quota management
- **CLI Execution Engine**: Sequential execution of CLI command chains with visual progress tracking

### Workspace Management with Magnetic Configuration Persistence
- Save current workspace design to backend storage with version tracking and magnetic interaction configurations
- Load previously saved workspaces with version selection and magnetic field state restoration
- Workspace naming and organization with metadata including magnetic rule configurations
- Import/export functionality in JSON format for sharing designs with magnetic interaction settings
- Workspace conflict detection and basic version comparison features including magnetic compatibility analysis
- In-session event listeners for real-time updates with magnetic state synchronization
- Save and load 3D view configurations and camera positions with magnetic field visualization settings
- Save and load custom view presets with user-defined names and magnetic interaction preferences
- Multi-viewport configuration persistence with magnetic field synchronization across views
- **CLI Command Persistence**: Save and load CLI command history and bookmarked command chains

### User Interface with Enhanced 3D Interactivity and Magnetic Dynamics
- Clean, educational interface with intuitive drag-and-drop controls maintained with GPU acceleration and magnetic assistance
- Interactive camera controls for zoom, rotation, and panning of complex blockchain flows with magnetic field visualization
- Customizable block visuals and dynamic theming with light/dark modes enhanced by magnetic interaction indicators
- Accessibility enhancements including keyboard navigation, contrast options, and screen reader labels for magnetic interaction states
- Responsive design optimized for desktop and tablet devices with magnetic interaction touch support
- Collapsible block library sidebar with search and filtering enhanced by magnetic compatibility indicators
- Properties panel for selected blocks with real-time configuration and visual feedback including magnetic polarity settings
- Execution status console with detailed output and error reporting enhanced by magnetic interaction analysis
- Custom block builder UI for user-defined logic scripts with 3D preview and magnetic connector configuration
- **CLI Interface**: Fixed bottom terminal-style interface with syntax highlighting, auto-completion, and command history

### Expanded Extensibility Framework with Developer API and Magnetic Integration
- Comprehensive modular rendering APIs for creating custom 3D block types with full documentation and magnetic property configuration
- Specification system for defining block input/output ports and computation logic with magnetic compatibility rules
- Versioning and metadata support for user-created custom blocks with magnetic interaction definitions
- Modular architecture supporting plugin-style block additions with GPU acceleration and magnetic behavior integration
- Expanded developer documentation for scalability, maintainability, and reactive data flow connectivity with magnetic dynamics
- API documentation for OpenGL-based blockchain tools development with magnetic interaction programming guides
- Guidelines for implementing custom visual effects and shader integration with magnetic field visualization
- **AI Rule Development Kit**: Tools for creating and testing custom AI validation rules and magnetic interaction behaviors
- **CLI Extension API**: Framework for adding custom CLI commands and tool integrations

### Production Deployment Features
- Production-ready build configuration with optimized asset bundling including magnetic interaction libraries
- Performance monitoring and analytics for production environment with magnetic interaction performance metrics
- Error tracking and logging for production debugging including magnetic state error analysis
- Scalable hosting configuration for high availability with magnetic interaction load balancing
- CDN integration for optimal asset delivery including magnetic interaction shader libraries
- Browser compatibility testing across all major browsers with magnetic interaction fallback support
- Mobile responsiveness optimization for tablet and desktop devices with magnetic interaction touch optimization
- SEO optimization for educational blockchain content discovery with magnetic interaction feature descriptions
- Production security headers and HTTPS enforcement with magnetic interaction data protection
- Automated deployment pipeline with rollback capabilities including magnetic configuration versioning

## Backend Requirements
The backend must store:
- User workspace designs (block positions, connections, configurations, metadata) with magnetic interaction states
- Saved workspace metadata (names, creation dates, descriptions, version history) including magnetic rule configurations
- Custom block definitions and their associated logic specifications with magnetic connector properties
- Workspace version comparison data for conflict detection including magnetic compatibility analysis
- 3D view configurations and camera positions for saved workspaces with magnetic field visualization settings
- Custom view presets with user-defined names and camera settings including magnetic interaction preferences
- Multi-viewport configuration settings with magnetic field synchronization data
- UI panel layout preferences and collapsible state with magnetic interaction panel configurations
- Smart contract deployment records and ABI definitions with magnetic connector compatibility metadata
- Network configuration settings and preferences with magnetic interaction network-specific rules
- User theme preferences (light, dark, rainbow mode) with magnetic interaction visual settings
- Navigation menu customization settings with magnetic interaction accessibility options
- Public page content and routing configuration with magnetic interaction feature documentation
- Tool window states and positions (normal, minimized, zoomed configurations) with magnetic interaction preservation
- Window control preferences and default behaviors for tool pop-ups with magnetic snap settings
- **Stripe Payment Integration Data**: User subscription status, payment history, execution quotas, and billing records
- **Subscription Plan Management**: Plan details (Basic $9/mo, Pro $45/mo, Enterprise $99/mo) and feature access mappings
- **Execution Tracking Data**: Real-time Execute button press counts and CLI execution counts per user with billing event triggers
- **Payment Transaction Logs**: Stripe transaction records, refunds, cancellations, and prorated billing calculations
- **Admin Analytics Data**: Payment reports, user usage statistics, execution metrics, and CLI usage analytics for administrative access
- **User Entitlements**: Current subscription status, execution quotas, and access level permissions
- **Stripe Configuration**: Environment-protected API keys (secret key, publishable key, webhook secret)
- **AI Rule Configurations**: Custom validation rules, compatibility matrices, and learning model parameters
- **Magnetic Interaction Settings**: Force field strengths, attraction/repulsion thresholds, and snapping distances
- **Physics Simulation Parameters**: Collision detection settings, animation speeds, and performance optimization configurations
- **CLI Command History**: Persistent storage of user CLI command history across sessions
- **CLI Bookmarks**: Saved CLI command chains with user-defined names and descriptions
- **CLI Usage Analytics**: Statistics on CLI command usage patterns and frequency for optimization
- **CLI Auto-Completion Data**: Learning model data for personalized CLI suggestions and patterns
- **Enhanced Sitemap Data Structure**: Extended sitemap configuration with admin-controlled routing
  - Auto-generated sitemap nodes (existing functionality preserved)
  - Manual pages array with admin-priority ordering and unique entries
  - Controlled routes configuration for app delegation (broadcast, remote, live)
  - Page metadata including hash, admin signature, and timestamp for auditing
  - Admin role assignments and access control permissions
  - Route delegation mappings to external applications (Secoinfi-Apps)
- **Admin Role Management**: User role assignments and permissions for sitemap control
  - Admin role verification and access control validation
  - Permission matrices for sitemap modification operations
  - Audit logs for admin actions and sitemap changes
- **Page Management System**: Comprehensive page routing and metadata management
  - Slug format validation and uniqueness enforcement
  - Page creation timestamps and modification history
  - Admin signature verification for page authenticity
  - Route resolution priority and conflict detection

Backend operations:
- Save workspace data with advanced version tracking and diff storage including magnetic interaction states
- Load workspace data with version selection and comparison including magnetic field restoration
- List user's saved workspaces with filtering and search including magnetic compatibility indicators
- Delete workspaces and associated versions with magnetic configuration cleanup
- Store and retrieve custom block definitions with magnetic connector specifications
- Handle workspace conflict detection and resolution including magnetic compatibility analysis
- Support import/export operations for JSON workspace data with magnetic interaction settings
- Save and restore 3D camera positions and view configurations with magnetic field visualization states
- Save and load custom view presets with metadata including magnetic interaction preferences
- Store multi-viewport configuration settings with magnetic field synchronization parameters
- Manage UI layout preferences and panel states with magnetic interaction configurations
- Store smart contract deployment information and ABIs with magnetic connector compatibility data
- Manage network configuration data with magnetic interaction network-specific rules
- Store and retrieve user theme preferences with magnetic interaction visual settings
- Manage navigation menu settings and customizations with magnetic interaction accessibility features
- Serve public page content and handle routing configuration with magnetic interaction documentation
- Store and retrieve tool window states and control preferences with magnetic snap configurations
- Manage window positioning and sizing data for workspace restoration with magnetic interaction preservation
- **Stripe Payment Processing**: Create Checkout Sessions for subscriptions and Pay-As-You-Use execution batches
- **Payment Validation**: Validate Stripe payments and update user entitlements and execution quotas
- **Execution Billing**: Track Execute button presses and CLI executions and trigger billing events based on usage
- **Subscription Management**: Handle refunds, cancellations, upgrades/downgrades with prorated billing
- **Transaction Logging**: Maintain comprehensive payment history and transaction records per user
- **Admin Operations**: Provide admin-only access to payment analytics, reports, user usage data, and CLI analytics
- **Webhook Processing**: Validate and process Stripe webhooks for transaction authenticity
- **Quota Management**: Real-time tracking and updating of execution quotas and usage limits
- **Role-Based Access**: Implement admin role checks and bypass payment requirements for admin users
- **Security Operations**: Secure storage and retrieval of Stripe API keys using environment variables
- **AI Rule Management**: Store, retrieve, and update custom validation rules and compatibility matrices
- **Magnetic Configuration Management**: Save and load magnetic field parameters, force settings, and interaction thresholds
- **Physics State Persistence**: Store and restore physics simulation parameters and performance optimization settings
- **Learning Model Data**: Manage AI training data, user interaction patterns, and adaptive rule improvements
- **CLI Command Management**: Store, retrieve, and manage CLI command history with session persistence
- **CLI Bookmark Operations**: Save, load, update, and delete CLI command bookmarks with metadata
- **CLI Analytics Processing**: Track and analyze CLI usage patterns for optimization and personalization
- **CLI Auto-Completion Learning**: Store and update learning model data for personalized CLI suggestions
- **Enhanced Sitemap Management Operations**: Comprehensive sitemap administration and routing control
  - Store and retrieve extended sitemap data structure with auto/manual/controlled routing
  - Validate admin role permissions for sitemap modification operations
  - Append new pages to admin-priority pages array with uniqueness validation
  - Manage controlled route delegation to external applications
  - Store and retrieve page metadata including hash, signature, and timestamp
  - Audit logging for all admin sitemap operations and changes
  - Route resolution with hierarchical priority (auto > manual > controlled)
- **Admin Access Control Operations**: Role-based permission management and validation
  - Verify admin role assignments for sitemap control operations
  - Validate user permissions for page creation and route delegation
  - Enforce access control guards for sensitive sitemap operations
  - Maintain audit trails for admin actions and permission changes
- **Page Management Operations**: Comprehensive page lifecycle and metadata management
  - Validate slug format and enforce uniqueness across all page types
  - Store page creation metadata with timestamps and admin signatures
  - Manage page modification history and version tracking
  - Handle route conflict detection and resolution across sitemap layers
  - Support page metadata queries for auditing and administration

## Technical Notes
- All blockchain interactions happen in the frontend using public Ethereum APIs and web3 providers with magnetic compatibility validation
- Execution state and active workflow data remain in frontend only with reactive updates and magnetic interaction tracking
- Cryptographic operations use secure, audited libraries with proper entropy sources and magnetic connector security validation
- Nonce-based transaction models provide replay protection with magnetic sequential ordering assistance
- Cross-browser compatibility with performance monitoring including magnetic interaction fallback support
- Architecture designed for future real-time synchronization and multi-user collaboration with magnetic interaction synchronization
- No user authentication required for public pages - workspaces are stored anonymously with session-based identification including magnetic preferences
- **Stripe Integration Security**: All API keys stored as environment variables and never exposed on frontend
- **HTTPS Enforcement**: SSL/TLS required for all payment-related data transmission and Stripe API communications
- **Webhook Verification**: Stripe webhook signatures validated for transaction authenticity and security
- **Admin Role Security**: Sensitive payment operations restricted to admin role with proper authorization checks
- **Frontend Payment Libraries**: Stripe.js and React Stripe.js integrated for secure payment UI components
- **Payment Error Handling**: Comprehensive error states, retry mechanisms, and user feedback for failed payments
- **Responsive Payment UI**: Payment components maintain responsive design across all device sizes
- **Real-time Quota Updates**: Dynamic display of execution quotas and usage metrics with live updates
- WebGL/OpenGL rendering integrated within React Three Fiber framework with enhanced GPU acceleration and magnetic physics simulation
- Backward compatibility maintained with existing React and TypeScript architecture with magnetic interaction layer integration
- Hardware acceleration fallback ensures functionality across all devices with magnetic interaction graceful degradation
- Enhanced WebGLCanvas.tsx and rendering loop for dynamic scene composition with real-time updates and magnetic field visualization
- Comprehensive testing for drag-and-drop interactivity, frame-rate optimization, real-time updates, and modular scalability including magnetic interaction performance
- Event-driven pipeline ensures immediate visual rendering updates for all user interactions and magnetic state changes
- Enhanced shader system for real-time visualization of cryptographic transformations with magnetic field effects
- Optimized GPU performance for unlimited modular tool support with magnetic interaction physics simulation
- CAD-style UI components with professional keyboard shortcuts and gesture support enhanced by magnetic interaction controls
- Responsive panel system with adaptive layouts for different screen sizes with magnetic interaction touch optimization
- Production deployment maintains all development features with enhanced performance and reliability including magnetic interaction optimization
- Browser-native crypto and encoding APIs used for all conversion operations (no external dependencies) with magnetic compatibility validation
- Modular converter architecture supports easy extension without modifying existing code paths with automatic magnetic rule integration
- **Global Keyboard Event System Requirements**:
  - Document-level event listeners for Esc and Enter key handling with proper event propagation control
  - Focus management system with tab order preservation and focus trapping in modal dialogs
  - Event delegation pattern for efficient keyboard handling across dynamic UI elements
  - Conflict prevention between global shortcuts and active input fields with context-aware event handling
  - Accessibility integration with ARIA announcements for keyboard shortcuts and focus changes
  - Cross-browser compatibility for keyboard event handling with proper key code normalization
- **Enhanced Theme System Requirements**: 
  - Theme preferences stored in localStorage for persistence across sessions with pre-render validation and magnetic interaction visual settings
  - Theme toggle button (icon and label) guaranteed visibility across all themes with enhanced contrast and magnetic interaction indicators
  - Robust color palette system with verified contrast ratios preventing invisible text scenarios including magnetic field visualization
  - Anti-blank screen protection with comprehensive black-on-black and white-on-white prevention including magnetic interaction fallbacks
  - Real-time theme switching with immediate UI updates, enhanced icon states, and localStorage synchronization including magnetic visual updates
  - VIBGYOR rainbow theme uses high-contrast gradient color schemes with readable text overlays and magnetic field color coding
  - Automatic Light mode fallback when theme variables fail to load or render properly including magnetic interaction visual preservation
  - Enhanced hover states and visual feedback for theme toggle with intuitive color changes per mode including magnetic interaction highlights
  - Pre-render theme validation ensures localStorage loads properly before rendering to prevent blank pages including magnetic configuration validation
  - Responsive theme accessibility testing across all device sizes to maintain functionality including magnetic interaction touch support
- Public routing system allows access to all sitemap pages without authentication with magnetic interaction feature previews
- Route guards implemented to distinguish between public and authenticated content with magnetic interaction access levels
- Navigation system maintains functionality across all theme modes with appropriate contrast and visibility including magnetic interaction indicators
- **Payment System Requirements**:
  - Stripe Checkout Sessions created via backend APIs for secure payment processing
  - Real-time execution tracking with billing event triggers and quota management including CLI executions
  - Subscription management dashboard with payment history and usage analytics
  - Admin analytics with comprehensive payment reports, user usage statistics, and CLI usage data
  - Role-based access control with admin bypass for payment requirements
  - Secure environment variable storage for all Stripe API keys and configuration
  - Webhook signature verification for transaction authenticity and security compliance
  - Prorated billing calculations for subscription upgrades, downgrades, and cancellations
- **Window Control System Requirements**:
  - GPU-accelerated CSS transforms for smooth window state transitions with magnetic interaction preservation
  - Window control icons maintain visibility and contrast across all theme modes with magnetic interaction indicators
  - Accessibility compliance with ARIA labels and keyboard navigation support including magnetic interaction accessibility
  - Tool connectivity preserved across all window states (normal, minimized, zoomed) with magnetic interaction maintenance
  - Window state persistence integrated with workspace save/load functionality including magnetic configuration preservation
  - Double-click zoom functionality with 30% display area sizing and magnetic interaction scaling
  - Smooth animation system using hardware acceleration for optimal performance including magnetic interaction animations
  - **Keyboard Integration**: Window controls respond to global Esc (minimize/close) and Enter (confirm/save) key events
  - **Focus Management**: Proper tab order and focus indicators for all window control elements
  - **Event Handling**: Keyboard events properly handled without conflicts with other UI interactions
- **Magnetic Interaction System Requirements**:
  - Force-based physics simulation with configurable attraction/repulsion strengths and threshold distances
  - Real-time collision detection optimized for performance with spatial partitioning algorithms
  - Color-coded visual feedback system for connector states (active, invalid, hovering, connected) with GPU shader acceleration
  - AI-powered compatibility validation with extensible rule definitions and machine learning integration
  - Axis-aligned snapping system with configurable precision and magnetic field strength adjustment
  - GPU-accelerated magnetic field visualization with real-time force vector display and interaction feedback
  - Extensible modular rule architecture supporting custom validation logic and adaptive learning capabilities
  - Cross-platform compatibility with touch and gesture support for magnetic interaction on mobile and tablet devices
- **CLI System Requirements**:
  - Command parser with support for `>` operator chain syntax and tool validation against blockDefinitions.ts
  - Real-time syntax highlighting with theme-compatible color schemes and contrast validation
  - Auto-completion system with AI-powered suggestions based on aiConnectivityRules.ts
  - Command history navigation with persistent storage and session management
  - Integration with magnetic physics system for automated tool placement and connection
  - Visual feedback system with real-time highlighting and connection previews
  - Error handling with inline validation messages and visual color feedback
  - Keyboard shortcut integration (Enter for execution, Esc for clearing, Tab for auto-completion)
  - Execution engine integration with sequential data flow and visual progress tracking
  - Billing integration for CLI-triggered executions with quota management
  - Performance optimization for real-time parsing and execution with minimal UI impact
  - Accessibility support with screen reader compatibility and keyboard navigation
  - Cross-browser compatibility with fallback support for older browsers
- **Enhanced Sitemap System Requirements**:
  - Non-breaking extension maintaining full backward compatibility with existing sitemap functionality
  - Parallel pages array implementation with admin-controlled priority ordering and unique entry enforcement
  - Extended backend data model supporting auto/manual/controlled routing with hierarchical resolution
  - Admin role-based access control with strict permission validation for sitemap operations
  - UI form integration within /admin and /sitemap pages with slug validation and uniqueness checking
  - Controlled route delegation system for external app integration with secure authorization
  - Metadata support for page auditing including hash, signature, and timestamp tracking
  - Motoko backend pattern compatibility with extended data structures and operations
  - Frontend routing integration without breaking changes to existing navigation system
  - Cross-browser compatibility and responsive design for sitemap management interfaces
