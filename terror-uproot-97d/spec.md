# Terror Uproot   Security Research & Emergency Response Platform

## Overview
Terror Uproot is a security research, data visualization, and emergency response coordination platform that provides real-time crisis management capabilities and public safety data analysis tools. The platform uses a YAML-based configuration system for dynamic content management and synchronization.

## Core Features

### YAML Configuration Management
- Primary configuration source through `spec.yaml` file
- Real-time parsing and integration of YAML specification data
- Automatic de-duplication of overlapping configuration entries
- Dynamic synchronization of app configuration and metadata
- Support for modules, compliance settings, AI specifications, and network policies
- Automatic updates to internal data structures when YAML spec changes
- Live UI component updates reflecting configuration changes

### Crisis Management Dashboard
- Real-time visualization of incidents including natural disasters, emergencies, and security alerts
- Interactive map displaying affected areas, response units, and severity levels
- Filtering capabilities by region, incident type, and response status
- Incident status tracking and updates
- Dashboard configuration driven by YAML specifications

### Public Safety Data Tracker
- Collection and display of anonymized, verified data from public safety sources
- Trend analysis showing emergency response times, resource usage, and recovery progress
- CSV and JSON dataset upload functionality for data analysis
- Data source management and verification
- Configuration-driven data source definitions

### Data Visualization Tools
- Dynamic charts including bar charts, line graphs, and pie charts
- Geospatial heatmaps for location-based data visualization
- Exportable reports for research and policy planning purposes
- Interactive data filtering and drill-down capabilities
- Visualization components that adapt to YAML configuration changes

### User Role Management
- **Admin users**: Manage data sources, approve data updates, oversee platform operations, and modify YAML configurations
- **Researcher users**: Access advanced analysis tools and create detailed visualizations
- **Public users**: View aggregated, anonymized insights and basic visualizations

### File Management System
- Upload and management of JavaScript files in the project root directory
- File renaming and replacement capabilities for uploaded assets
- Support for overwriting existing files with new versions
- Preservation of file content during rename operations
- Automatic detection and relocation of specific JavaScript files (`key-unlock-5hx.node.js` and `server.js`) to the `/frontend` directory
- File visibility verification in the Code tab after relocation operations
- Automatic processing of `.mov` files to rename them to `.js` extensions
- Detection of `key-unlock-5hx.node.mov` and `server.mov` files in uploaded assets for conversion
- Relocation of both `key-unlock-5hx.node.js` and `server.js` to `/frontend` directory with overwrite capability

## Backend Data Storage
The backend stores:
- YAML configuration files and version history
- Parsed configuration metadata and validation status
- Incident records with location, type, severity, and status information
- Public safety datasets and metadata
- User accounts and role assignments
- Data source configurations and verification status
- Generated reports and visualization configurations
- Configuration synchronization logs and change tracking
- JavaScript files and project assets in root directory

## Backend Operations
- YAML file parsing, validation, and integration
- Configuration change detection and synchronization
- Data de-duplication and conflict resolution
- Incident data ingestion and validation
- User authentication and authorization
- Data aggregation and anonymization processes
- Report generation and export functionality
- Data source management and approval workflows
- Real-time configuration updates to frontend components
- File upload, rename, and replacement operations
- Root directory file management and organization
- Automatic detection of `key-unlock-5hx.node.mov` and `server.mov` files in uploaded assets
- Conversion of `.mov` files to `.js` extensions during processing
- Relocation of both `key-unlock-5hx.node.js` and `server.js` to `/frontend` directory with overwrite capability
- File visibility verification and Code tab integration

## Ethical Safeguards
- No collection of personal or identifying information
- All data is anonymized and aggregated before display
- Focus on prevention, coordination, and transparency
- Verification requirements for all data sources

## Language Configuration
- Application content language: English
- Multi-language support configurable through YAML specifications
