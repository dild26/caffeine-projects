# E-Tutorials CSO - Reverse Engineered Spec (v2)

## 1. Core Architecture
- **Framework**: React 18 + Vite
- **Routing**: @tanstack/react-router (File-based routing structure logic in App.tsx)
- **State Management**: @tanstack/react-query
- **Styling**: Tailwind CSS + Radix UI Primitives
- **Authentication**: Internet Identity (via `InternetIdentityProvider`)

## 2. Implemented Routes (Verified in App.tsx)
- `/` (Home)
- `/dashboard` (User Dashboard)
- `/explore`
- `/resources` & `/instructors`
- `/appointments`
- `/admin` (Protected Admin Route)
- Content Pages: `/about`, `/features`, `/faq`, `/blogs`, `/contact`, `/join-us`, `/values`, `/info`
- Technical Pages: `/sitemap`, `/permissions`, `/queries`, `/responsive-design`, `/timestamp`, `/ui-ux`
- Dynamic/SEO Pages: `/keywords`, `/locations`, `/maps`, `/geo-map`, `/what-why-when-where-who`

## 3. Key Components & Systems
- **Data Management**: `DataSeeder` component suggests client-side data initialization/seeding.
- **Theme System**: `ThemeProvider` with `ContrastAlert` indicating accessibility focus.
- **Validation**: `ValidationAlert` component implies runtime checks.
- **Error Handling**: Custom `ErrorBoundary` wrapping the app with UI alerts.
- **Notifications**: `Toaster` (Sonner) for toast notifications.

## 4. Observations vs Spec.md
- **Matching**: 
    - Internet Identity integration (`InternetIdentityProvider`).
    - Comprehensive routing (`App.tsx` matches `spec.md` navigation requirements).
    - Accessibility focus (`ContrastAlert` matches WCAG mentions).
- **Missing/Gap**:
    - **CSV Upload**: `AdminPage.tsx` is a placeholder dashboard. actual CSV upload/parsing logic is **MISSING**.
    - Merkle root nonce mechanism (Codebase search confirms absence).
    - "Automatic fee conversion" logic.



## 5. Upgrade Recommendations
1.  **Refactor DataSeeder**: Ensure it handles large CSVs efficiently or moves logic to a web worker.
2.  **Strict Typing**: Ensure all TanStack Router routes are strictly typed.
3.  **Performance**: Verify `DataSeeder` doesn't block main thread on load.
