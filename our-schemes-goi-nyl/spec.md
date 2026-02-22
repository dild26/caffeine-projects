# ourSchemes   Government Schemes Search Application

## Overview
ourSchemes is a web application that helps users discover and search government schemes by parsing uploaded MHTML files and providing a searchable interface with filtering capabilities. The application features public access to general content and restricted access to admin and subscription-related functionality.

## Access Control Rules
- **Public Access**: HomePage, AboutPage, SearchSection, SchemesList, SchemeCard, and PinnedSchemes are accessible without authentication
- **Restricted Access**: Admin and Subscription-related pages require authentication via Internet Identity
- Navigation elements for restricted sections are hidden when user is not authenticated
- Clear separation between public and restricted functionality for easy maintenance

## Backend Requirements

### Authentication
- Internet Identity integration for user authentication
- Session management for authenticated users
- Access control validation for restricted endpoints

### Data Processing
- Parse uploaded MHTML files (starting with "Search Schemes-1.mhtml") to extract government scheme information
- Generate structured JSON data for each scheme containing:
  - Scheme name, ministry, category, description
  - Tags, eligibility criteria, benefits
  - Source URL to official government portal
- Output two data files:
  - `schemes.jsonl`: One JSON object per scheme (one per line)
  - `index.json`: Inverted index for search functionality with keywords, tags, and facets

### API Endpoints
- `GET /api/schemes`: List schemes with pagination and optional filters (category, ministry, scheme type) - Public
- `GET /api/schemes/{id}`: Retrieve single scheme details - Public
- `GET /api/search`: Full-text and faceted search using the generated index - Public
- Admin endpoints (authentication required):
  - Admin dashboard access
  - Scheme management operations
- Subscription endpoints (authentication required):
  - User subscription management
  - Premium features access

### Data Storage
- Store parsed scheme data persistently in the backend
- Maintain search index for efficient querying
- Store user authentication sessions and subscription data

## Frontend Requirements

### Core Interface
- Responsive web design with search bar for keyword input
- Filter controls for:
  - Category
  - Ministry
  - Scheme type
  - Tags
- Results display as scheme cards showing:
  - Scheme name
  - Ministry
  - Short description
  - Tags
  - "Go to official site" button linking to source_url

### Authentication & Access Control
- Internet Identity login/logout functionality
- Conditional navigation based on authentication status
- Public pages accessible without login
- Restricted pages redirect to login when accessed without authentication
- Clear visual indicators for authenticated vs public sections

### Key Features
- "Pin to My List" functionality for local bookmarking of schemes
- Pagination or infinite scroll for search results
- Navigation bar with app branding and conditional admin/subscription links
- About page explaining the application purpose
- Footer with disclaimer
- Admin dashboard (authenticated users only)
- Subscription management pages (authenticated users only)

### Required Disclaimers
- Prominent disclaimer: "ourSchemes is not an official government app; all links lead to official portals such as myscheme.gov.in"
- Clear non-affiliation statement in footer
- All external links must direct to official government portals only

## Technical Specifications
- Application language: English
- Initial dataset from provided "Search Schemes-1.mhtml" file
- Responsive design for mobile and desktop
- Local storage for user's pinned schemes list
- Internet Identity authentication for restricted features
- Clear access control configuration for future maintenance
