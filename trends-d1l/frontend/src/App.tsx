import { RouterProvider, createRouter, createRoute, createRootRoute, Outlet } from '@tanstack/react-router';
import { ThemeProvider } from 'next-themes';
import { Toaster } from '@/components/ui/sonner';
import Header from './components/Header';
import Footer from './components/Footer';
import CatalogPage from './pages/CatalogPage';
import TopicPage from './pages/TopicPage';
import AdminPage from './pages/AdminPage';
import BlogPage from './pages/BlogPage';
import AboutPage from './pages/AboutPage';
import ProsPage from './pages/ProsPage';
import WhatPage from './pages/WhatPage';
import WhyPage from './pages/WhyPage';
import HowPage from './pages/HowPage';
import ContactPage from './pages/ContactPage';
import FaqPage from './pages/FaqPage';
import TermsPage from './pages/TermsPage';
import ReferralPage from './pages/ReferralPage';
import TrustPage from './pages/TrustPage';
import LeaderboardPage from './pages/LeaderboardPage';
import ProtectedRoute from './components/ProtectedRoute';

const rootRoute = createRootRoute({
  component: () => (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  ),
});

const catalogRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: CatalogPage,
});

const topicRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/topic/$slug',
  component: TopicPage,
});

const adminRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin',
  component: () => (
    <ProtectedRoute>
      <AdminPage />
    </ProtectedRoute>
  ),
});

const leaderboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/leader',
  component: LeaderboardPage,
});

const blogRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/blog',
  component: BlogPage,
});

const aboutRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/about',
  component: AboutPage,
});

const prosRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/pros',
  component: ProsPage,
});

const whatRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/what',
  component: WhatPage,
});

const whyRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/why',
  component: WhyPage,
});

const howRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/how',
  component: HowPage,
});

const contactRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/contact',
  component: ContactPage,
});

const faqRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/faq',
  component: FaqPage,
});

const termsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/terms',
  component: TermsPage,
});

const referralRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/referral',
  component: ReferralPage,
});

const trustRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/trust',
  component: TrustPage,
});

const routeTree = rootRoute.addChildren([
  catalogRoute,
  topicRoute,
  adminRoute,
  leaderboardRoute,
  blogRoute,
  aboutRoute,
  prosRoute,
  whatRoute,
  whyRoute,
  howRoute,
  contactRoute,
  faqRoute,
  termsRoute,
  referralRoute,
  trustRoute,
]);

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
      <RouterProvider router={router} />
      <Toaster />
    </ThemeProvider>
  );
}
