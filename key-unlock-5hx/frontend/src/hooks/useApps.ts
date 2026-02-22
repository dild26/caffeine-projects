import { useQuery } from '@tanstack/react-query';
import { useGetAppsFromPages } from './useAppQueries';
import { DEFAULT_APPS } from '../data/defaultApps';
import { validateAndResolveUrl, getCanonicalUrl } from '../lib/urlValidator';

export interface AppConfig {
  id: string;
  name: string;
  url: string;
  description: string;
  status: 'live' | 'development' | 'planned';
  features: string[];
  integration: string[];
  sitemapUrl?: string;
  isVerified: boolean;
  subdomain?: string;
}

/**
 * Get all apps from canonical DEFAULT_APPS registry (single source of truth)
 * This is the primary source for all app data
 */
export function useGetAllApps() {
  return useQuery<AppConfig[]>({
    queryKey: ['apps', 'canonical'],
    queryFn: async () => {
      // Return canonical apps from DEFAULT_APPS with validated URLs
      return DEFAULT_APPS.map(app => ({
        ...app,
        url: validateAndResolveUrl(app.url, app.name),
      }));
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Get only live/verified apps from canonical registry
 */
export function useGetLiveApps() {
  const { data: allApps = [], isLoading, error } = useGetAllApps();

  return useQuery<AppConfig[]>({
    queryKey: ['liveApps', allApps.length],
    queryFn: async () => {
      return allApps.filter(app => app.isVerified && app.status === 'live');
    },
    enabled: allApps.length > 0,
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * Get app by name from canonical registry
 */
export function useGetAppByName(appName: string) {
  const { data: allApps = [] } = useGetAllApps();

  return useQuery<AppConfig | null>({
    queryKey: ['app', appName],
    queryFn: async () => {
      const app = allApps.find(a => a.name.toLowerCase() === appName.toLowerCase());
      return app || null;
    },
    enabled: allApps.length > 0 && !!appName,
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * Get canonical URL for an app name
 */
export function useGetCanonicalUrl(appName: string): string | null {
  return getCanonicalUrl(appName);
}

