import { useQuery } from '@tanstack/react-query';

export interface ProsData {
  id: number;
  project: string;
  title: string;
  description: string;
  advantages: string[];
  benefits: string[];
  uniqueSellingPoints: string[];
  lastUpdated: bigint;
}

const DEFAULT_PROS_DATA: Record<string, ProsData> = {
  secoin: {
    id: 1,
    project: 'SECoin',
    title: 'Pros of SECoin',
    description: 'Discover the comprehensive advantages and unique features of the SECoin platform',
    advantages: [
      'Unified platform architecture integrating best features from top 26 global domains',
      'Legal exploration and unification of e-commerce, search, social media, and streaming capabilities',
      'Modular and scalable design supporting billions of users worldwide',
      'Advanced security and privacy with blockchain-style verification',
      'High-performance infrastructure optimized for global scale',
      'Comprehensive feature integration from industry leaders',
    ],
    benefits: [
      'Access to unified products and services in one platform',
      'Seamless user experience across all integrated features',
      'Cost-effective solution combining multiple platform capabilities',
      'Future-ready technology stack with continuous updates',
      'Reliable and resilient architecture for 24/7 availability',
      'Community-driven development with user feedback integration',
    ],
    uniqueSellingPoints: [
      'Only platform legally exploring and unifying top 26 global domains',
      'Billion-user scalability with proven performance metrics',
      'Merkle root-based tracking for tamper-proof operations',
      'Real-time AI-driven content updates and personalization',
      'Cross-app data distribution with secure permission management',
      'Comprehensive referral system with blockchain-style remuneration',
    ],
    lastUpdated: BigInt(Date.now()),
  },
  moap: {
    id: 2,
    project: 'MOAP',
    title: 'Pros of MOAP',
    description: 'Explore the powerful advantages of the Mother Of All Platforms management system',
    advantages: [
      'Centralized hub for managing 26 interconnected sites and applications',
      'Comprehensive domain reference system with legal exploration documentation',
      'Modular sitemap distribution to all SECOINFI client apps',
      'Real-time updates with permission-based change management',
      'Hash-based tracking with Merkle root structure for security',
      'Scalable architecture supporting unlimited client app integration',
    ],
    benefits: [
      'Streamlined platform management from a single interface',
      'Automated sitemap and data distribution across all apps',
      'Reduced development time with reusable components',
      'Enhanced security with tamper-proof tracking systems',
      'Improved collaboration with permission management',
      'Future-proof design supporting continuous expansion',
    ],
    uniqueSellingPoints: [
      'First platform to unify management of 26+ interconnected sites',
      'Live-updatable sitemap structure with cross-app synchronization',
      'Matrix/loop system for automatic data distribution',
      'AI-driven content updates with intelligent permission requests',
      'Comprehensive USP analysis and business trend tracking',
      'Integrated referral and social link distribution system',
    ],
    lastUpdated: BigInt(Date.now()),
  },
  sitemapai: {
    id: 3,
    project: 'SiteMapAi',
    title: 'Pros of SiteMapAi',
    description: 'Discover the intelligent advantages of AI-powered sitemap management',
    advantages: [
      'AI-driven sitemap generation and optimization',
      'Automatic structure analysis and recommendations',
      'Real-time sitemap updates based on content changes',
      'Intelligent link distribution across multiple platforms',
      'Advanced SEO optimization with AI insights',
      'Automated cross-app sitemap synchronization',
    ],
    benefits: [
      'Save time with automated sitemap generation',
      'Improve SEO rankings with AI-optimized structure',
      'Reduce errors with intelligent validation',
      'Enhance user navigation with smart recommendations',
      'Scale effortlessly with automated distribution',
      'Stay current with real-time content updates',
    ],
    uniqueSellingPoints: [
      'First AI-powered sitemap system for multi-app platforms',
      'Intelligent content categorization and hierarchy',
      'Predictive analytics for sitemap optimization',
      'Automated permission management for distributed updates',
      'Machine learning-based structure recommendations',
      'Integration with MOAP for seamless cross-app distribution',
    ],
    lastUpdated: BigInt(Date.now()),
  },
};

export function useProsData(project: string) {
  return useQuery<ProsData | null>({
    queryKey: ['prosData', project],
    queryFn: async () => {
      // In a real implementation, this would fetch from the backend
      // For now, return default pros data
      const normalizedProject = project.toLowerCase();
      return DEFAULT_PROS_DATA[normalizedProject] || null;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
