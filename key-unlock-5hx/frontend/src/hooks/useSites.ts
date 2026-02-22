import { useQuery } from '@tanstack/react-query';
import { DEFAULT_SITES } from '../data/defaultSites';
import type { SiteConfig } from '../types';

export function useGetAllSites() {
  return useQuery<SiteConfig[]>({
    queryKey: ['sites', 'all'],
    queryFn: async () => {
      try {
        return DEFAULT_SITES as SiteConfig[];
      } catch (error) {
        console.error('Error loading sites:', error);
        return [];
      }
    },
    staleTime: Infinity,
    retry: 1,
  });
}

export function useGetTopPrioritySites() {
  return useQuery<SiteConfig[]>({
    queryKey: ['sites', 'top'],
    queryFn: async () => {
      try {
        return (DEFAULT_SITES as SiteConfig[])
          .filter((site) => Number(site.priority) <= 10)
          .sort((a, b) => Number(a.priority) - Number(b.priority));
      } catch (error) {
        console.error('Error loading top sites:', error);
        return [];
      }
    },
    staleTime: Infinity,
    retry: 1,
  });
}

export function useGetSiteConfig(siteId: string) {
  return useQuery<SiteConfig | undefined>({
    queryKey: ['sites', 'config', siteId],
    queryFn: async () => {
      try {
        return (DEFAULT_SITES as SiteConfig[]).find((site) => site.id === siteId);
      } catch (error) {
        console.error('Error loading site config:', error);
        return undefined;
      }
    },
    staleTime: Infinity,
    retry: 1,
  });
}
