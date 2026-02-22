# latestTrends Trending Topics Application

## Overview
A full-stack application that simulates trending topic ingestion and displays them as interactive polygon cards with auto-generated blog content, featuring comprehensive site navigation, pagination, advanced search, voting system, and leaderboards with role-based access control.

## Core Features

### Access Control & Authentication
- Public access to all pages except admin and subscription-related routes
- Internet Identity authentication required only for:
  - `/admin` routes and admin panel functionality
  - Subscription-specific routes and features
- Public pages accessible without login:
  - Catalog page with topic listings and search
  - Individual topic pages with voting functionality
  - Static informational pages (blog, about, pros, what, why, how, contact, faq, terms, referral, trust)
  - Leaderboard page
  - Sitemap and SEO pages
- Authentication state management for restricted routes
- Role-based authorization for admin users

### Topic Management
- Generate 100 unique trending topics using mock data simulating Google Trends and competitor feeds
- Auto-generate 4-paragraph blog content for each topic:
  1. Overview/definition (60-110 words)
  2. Why it's trending now (60-110 words) 
  3. Key facts or data points (60-110 words)
  4. Future outlook or call-to-action (60-110 words)
- Include 1-3 placeholder source links per paragraph
- Topic scoring based on: recency × mock search volume × cross-platform presence
- Generate unique hash identifier for each topic for vote tracking
- Compute Merkle root reference from hash first and last characters for voter/topic linkage

### Advanced Search System
- Dynamic search functionality across all topics on CatalogPage
- Multiple search filters:
  - Type and category filtering
  - Date and time range selection
  - Popularity and click count filtering
  - Relevance scoring
  - Trending status
  - Author and source filtering
- Real-time search results with pagination support
- Search query persistence across page navigation

### Voting System
- Upvote/downvote functionality on topic cards and topic pages
- Emoji and heart icons for vote interactions
- Vote aggregation across all users with grand total display
- Ranking system: upvotes move topics toward rank #1, downvotes reduce rank
- Vote tracking per user with hash-based voter/topic linkage
- Click tracking for popularity metrics

### Frontend Display
- Render topics as interactive polygon cards (3-12 vertices based on topic score)
- Hover animations: polygon morph, subtle rotation, "screw-thread" rotation effect
- Card views:
  - Compact: title, subtitle, sparkline/trend indicator, hot/rising/stable badge, vote controls
  - Expanded modal: all 4 paragraphs, related queries, share/save/watchlist controls, vote controls
- Responsive fallbacks (rounded rectangles on mobile)
- Accessible labels and keyboard navigation
- Vote buttons with emoji and heart icons integrated into card design

### Navigation & Layout
- Catalog page with polygon-aware masonry layout and advanced search interface
- Pagination controls with "First", "Previous", "Next", and "Last" navigation buttons for topic listings
- Topics grouped by simulated categories (AI, sports, entertainment, etc.)
- Individual topic pages at `/topic/{slug}` with voting functionality
- Leaderboard page at `/leader` displaying top-ranked topics and top voters
- Searchable navigation menu with sitemap pages: blog, about, pros, what, why, how, contact, faq, terms, referral, trust, leader
- Responsive design with SVG/CSS polygons
- Route protection for admin and subscription pages with authentication redirects

### Leaderboard System
- Top-ranked topics based on vote aggregation and ranking algorithm
- Top voters based on accumulated votes and referral activity
- Real-time leaderboard updates synchronized with vote actions
- Leaderboard data integration with referral system

### Site Pages
- Static content pages for: blog, about, pros, what, why, how, contact, faq, terms, referral, trust, leader
- Content and layout references from https://map-56b.caffeine.xyz for design consistency
- Contact page with iframe integration from e-contract-lwf.caffeine.xyz with CORS whitelisting
- Enhanced ReferralPage with remuneration system (points/badges) for voters and referrers
- Dynamic link generation pattern: `https://{prefix}.caffeine.ai/` for cross-domain integration
- Modular UI components with consistent responsive design
- SEO metadata propagation (titles, descriptions, canonical tags) for all pages

### SEO Features
- Auto-generate `/sitemap.xml` with topic entries and static pages (slug, lastmod, priority)
- JSON-LD structured data for articles
- Canonical URLs and SEO-optimized content

### Simulation & Updates
- Hourly mock refresh to rotate topics and simulate new trends
- Visual "nut" animation effect during topic rotation
- Remove older topics and add new ones
- Vote and ranking updates synchronized with refresh cycles

### Admin Panel
- Simple interface to regenerate content (admin authentication required)
- Hide/show topics
- Trigger manual refresh
- Track approval and confidence scores for mock moderation
- Vote management and leaderboard oversight
- Access restricted to authenticated admin users only

## Backend Requirements
The backend must store:
- Topic metadata (title, slug, category, score, timestamps, hash identifier)
- Auto-generated blog content (4 paragraphs per topic)
- Source links and related queries
- Topic status and moderation flags
- Vote data (upvotes, downvotes, total votes per topic)
- User vote tracking with hash-based linkage
- Topic rankings and click counts
- Leaderboard data (top topics, top voters)
- Referral activity and remuneration points/badges
- Static page content and metadata
- Pagination state and page counts
- Search filter configurations and results
- User authentication state and admin role permissions
- Access control rules for route protection

Backend operations:
- Retrieve topics with pagination and search filtering support
- Get individual topic by slug with vote data
- Handle vote submissions and aggregation
- Update topic rankings based on votes
- Generate and update leaderboard data
- Track voter/topic linkage using Merkle root references
- Refresh/rotate topic data with vote preservation
- Admin content management (with authentication check)
- Serve static page content
- Handle CORS configuration for iframe integration
- Process search queries with multiple filter criteria
- Validate user authentication and admin permissions
- Enforce access control for protected routes

## API Endpoints
- `GET /api/topics?page=1&limit=20&search=query&filters={}` - List topics with pagination and search (public)
- `GET /api/topic/{slug}` - Get specific topic details with vote data (public)
- `POST /api/topic/{slug}/vote` - Submit upvote/downvote for topic (public)
- `GET /api/leaderboard` - Get top topics and voters (public)
- `GET /api/page/{slug}` - Get static page content (public)
- `POST /api/refresh` - Trigger mock data refresh (admin only)
- `GET /api/sitemap` - Generate sitemap data (public)
- `GET /api/search/filters` - Get available search filter options (public)
- `GET /api/auth/status` - Check authentication status
- `POST /api/auth/validate` - Validate admin permissions

## Cross-Domain Integration
- CORS whitelisting for URLs: ia-niqaw-947, xcaller-0aw, e-contract-lwf, e-contracts-bqe, geo-map-w9s, infytask-mia, ipfs-lrm, key-unlock-5hx, n8n-tasks-c2i, n8n-workflows-6sy, secoin-ep6, sitemaps-fwh, terror-uproot-97d, networth-htm, map-56b
- Dynamic URL pattern support for caffeine.ai subdomains
- Iframe and object tag integration for contact page functionality using e-contract-lwf.caffeine.xyz
