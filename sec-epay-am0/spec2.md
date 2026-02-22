# SEC-ePay AM0 - Reverse Engineered Spec (v2)

## 1. Core Architecture
- **Framework**: React 18 + Vite
- **Routing**: @tanstack/react-router
- **Styling**: Tailwind CSS + next-themes (Default: VIBGYOR)
- **Authentication**: Internet Identity (via `InternetIdentityProvider`)
- **State/Query**: @tanstack/react-query

## 2. Implemented Routes (Verified in App.tsx)
- **Public**:
    - `/` (Home)
    - `/calc` (Calculator/Features)
    - `/about`, `/contact`, `/faq`, `/blogs`
    - `/terms` (Terms of Service)
    - `/features`
    - `/sitemap`
- **Restricted/Admin**:
    - `/admin`
    - `/dashboard`
    - `/leaderboard`
    - `/main-form`
    - `/subscriptions`
    - `/transactions`

## 3. Key Components & Systems
- **Auth Guards**: `RESTRICTED_ROUTES` array in `App.tsx` controls access. `ApprovalPendingScreen` handles pending states.
- **Terms System**: `TermsModal` combined with `useGetCurrentTermsVersion` verifies user acceptance.
- **Profile System**: `ProfileSetupModal` handles user onboarding.
- **Themes**: Explicit `defaultTheme="vibgyor"` in `ThemeProvider` matches spec.
- **Sitemap**: `SitemapPage` implementation suggests manual/dynamic sitemap handling.

## 4. Observations vs Spec.md
- **Matching**:
    - "Terms of Service Management" is fully integrated with blocking modals (`TermsModal`).
    - "Public/Restricted Page" separation is implemented via `RESTRICTED_ROUTES`.
    - "VIBGYOR Theme" default is confirmed.
    - "Manual Sitemap" page exists.
- **Pending/Unverified**:
    - "Multi-level transaction processing" (Backend logic).
    - "QRC Payment System" specifics (frontend components exist, backend logic unverified).
    - "Merkle root" generation.

## 5. Upgrade Recommendations
1.  **Backend Verification**: Confirm QRC and Transaction logic in backend.
2.  **Admin Features**: Ensure `MainFormPage` correctly maps to all backend variables.
3.  **Performance**: Monitor `App.tsx` bundle size as it imports many pages directly (lazy loading recommended).
