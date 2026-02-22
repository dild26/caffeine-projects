# SECoin EP6 - Reverse Engineered Spec (v2)

## 1. Core Architecture
- **Framework**: React 18 + Vite
- **Routing**: @tanstack/react-router
- **State Management**: @tanstack/react-query
- **Styling**: Tailwind CSS + shadcn/ui (radix) + next-themes
- **Authentication**: Internet Identity (via `InternetIdentityProvider`)

## 2. Implemented Routes (Verified in App.tsx)
- **Public**:
    - `/` (Home - LoginPrompt, PropertyGrid)
    - `/about`, `/pros`, `/what-we-do`, `/why-us`
    - `/contact`, `/faq`, `/terms`, `/referral`
    - `/sitemap`, `/gallery`
    - `/blog`, `/blog/$postId`
    - `/leaderboard`
    - `/property/$propertyId`
    - `/proof-of-trust`
- **Admin/Protected**:
    - `/admin` (Guarded by `AdminRouteGuard`)
    - `/dashboard`
    - `/features` (FeatureCompare)
    - `/property/$propertyId/nodes` (NodeManagement)
    - `/live-status`
    - `/system-health`
    - `/specification-status`
    - `/bundle-optimization`
    - `/menu-analysis`

## 3. Key Components & Systems
- **Admin System**: Lazy-loaded admin modules (`AdminDashboard`, `FeatureCompare`, `NodeManagement`).
- **Data Integrity**: `validateRuntimeIntegrity` called on boot.
- **Performance**: `BundleOptimization` page suggests active focus on bundle size.
- **Properties**: Dynamic node management (`NodeManagement`), Property Grid.
- **Blog**: Full blog system structure (`BlogList`, `BlogPost`).

## 4. Observations vs Spec.md
- **Matching**:
    - "Live Status" page matches `spec.md` requirement for Merkle/Verkle verification.
    - "Node Management" matches the dynamic node system spec.
    - "Bundle Optimization" matches the Audit-Ready/Performance spec sections.
    - "Genesis Admin" logic likely resides in `AdminRouteGuard`/`useIsCallerAdmin`.
- **Pending/Unverified**:
    - "Unit-safe field enforcement" (Need to verify backend/data layer, frontend mentions `validateRuntimeIntegrity`).
    - "Merkle root nonce" depth (UI exists, backend implementation to be confirmed).

## 5. Upgrade Recommendations
1.  **Unit Tests**: Verify "Unit-safe" logic with tests.
2.  **Performance**: Ensure lazy-loaded admin chunks don't cause layout shift.
3.  **Strict Typing**: Ensure all TanStack Router routes are strictly typed.
