import { createRootRoute, createRoute, Outlet } from '@tanstack/react-router';
import Layout from './components/Layout';
import MapPage from './pages/MapPage';
import Dashboard from './pages/Dashboard';
import Features from './pages/Features';
import Blog from './pages/Blog';
import AboutUs from './pages/AboutUs';
import ProsOfEContracts from './pages/ProsOfEContracts';
import WhatWeDo from './pages/WhatWeDo';
import WhyUs from './pages/WhyUs';
import ContactUs from './pages/ContactUs';
import FAQ from './pages/FAQ';
import Terms from './pages/Terms';
import Referral from './pages/Referral';
import ProofOfTrust from './pages/ProofOfTrust';
import Sitemap from './pages/Sitemap';
import Templates from './pages/Templates';
import Upload from './pages/Upload';
import Analytics from './pages/Analytics';
import Reports from './pages/Reports';
import Settings from './pages/Settings';
import Help from './pages/Help';
import PaymentSuccess from './pages/PaymentSuccess';
import PaymentFailure from './pages/PaymentFailure';
import Subscription from './pages/Subscription';

const rootRoute = createRootRoute({
  component: Layout,
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: MapPage,
});

const dashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/dashboard',
  component: Dashboard,
});

const featuresRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/features',
  component: Features,
});

const blogRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/blog',
  component: Blog,
});

const aboutRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/about',
  component: AboutUs,
});

const prosRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/pros-of-e-contracts',
  component: ProsOfEContracts,
});

const whatWeDoRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/what-we-do',
  component: WhatWeDo,
});

const whyUsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/why-us',
  component: WhyUs,
});

const contactRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/contact',
  component: ContactUs,
});

const faqRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/faq',
  component: FAQ,
});

const termsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/terms',
  component: Terms,
});

const referralRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/referral',
  component: Referral,
});

const proofRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/proof-of-trust',
  component: ProofOfTrust,
});

const sitemapRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/sitemap',
  component: Sitemap,
});

const templatesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/templates',
  component: Templates,
});

const uploadRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/upload',
  component: Upload,
});

const analyticsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/analytics',
  component: Analytics,
});

const reportsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/reports',
  component: Reports,
});

const settingsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/settings',
  component: Settings,
});

const helpRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/help',
  component: Help,
});

const paymentSuccessRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/payment-success',
  component: PaymentSuccess,
});

const paymentFailureRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/payment-failure',
  component: PaymentFailure,
});

const subscriptionRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/subscription',
  component: Subscription,
});

export const routeTree = rootRoute.addChildren([
  indexRoute,
  dashboardRoute,
  featuresRoute,
  blogRoute,
  aboutRoute,
  prosRoute,
  whatWeDoRoute,
  whyUsRoute,
  contactRoute,
  faqRoute,
  termsRoute,
  referralRoute,
  proofRoute,
  sitemapRoute,
  templatesRoute,
  uploadRoute,
  analyticsRoute,
  reportsRoute,
  settingsRoute,
  helpRoute,
  paymentSuccessRoute,
  paymentFailureRoute,
  subscriptionRoute,
]);
