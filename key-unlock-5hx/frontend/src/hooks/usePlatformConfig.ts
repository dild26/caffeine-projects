import { useQuery } from '@tanstack/react-query';
import type { PlatformConfig } from '../types';

const DEFAULT_PLATFORM_CONFIG: PlatformConfig = {
  architecture: 'Modular microservices architecture with unified API gateway and shared authentication layer',
  security: 'OAuth 2.0 authentication, end-to-end encryption, regular security audits, and GDPR compliance',
  privacy: 'User data protection, transparent privacy policies, opt-in data collection, and right to deletion',
  monetization: 'Freemium model with premium features, enterprise licensing, and API usage-based pricing',
  performance: 'Sub-second response times, 99.9% uptime SLA, CDN integration, and horizontal scaling',
  seo: 'Server-side rendering, semantic HTML, structured data, and comprehensive meta tags',
  roadmap: 'Q1: Core platform launch, Q2: AI integration, Q3: Mobile apps, Q4: Enterprise features',
};

export function useGetPlatformConfig() {
  return useQuery<PlatformConfig | null>({
    queryKey: ['platformConfig'],
    queryFn: async () => {
      return DEFAULT_PLATFORM_CONFIG;
    },
    staleTime: Infinity,
  });
}
