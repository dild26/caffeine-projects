import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { parseSitemapXML, fetchAndParseSitemap, convertToMenuItem, SitemapImportResult } from '../lib/sitemapParser';

export interface ImportedSitemap {
  id: string;
  appName: string;
  result: SitemapImportResult;
  menuItems: any[];
}

const STORAGE_KEY = 'moap-imported-sitemaps';

/**
 * Safely serialize data, converting BigInt to number/string
 */
function safeStringify(data: any): string {
  return JSON.stringify(data, (key, value) => {
    // Convert BigInt to number for serialization
    if (typeof value === 'bigint') {
      return Number(value);
    }
    return value;
  });
}

/**
 * Get all imported sitemaps from local storage
 */
function getImportedSitemaps(): ImportedSitemap[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error reading imported sitemaps:', error);
    return [];
  }
}

/**
 * Save imported sitemaps to local storage with safe serialization
 */
function saveImportedSitemaps(sitemaps: ImportedSitemap[]) {
  try {
    localStorage.setItem(STORAGE_KEY, safeStringify(sitemaps));
  } catch (error) {
    console.error('Error saving imported sitemaps:', error);
    throw new Error('Failed to save sitemap data. Storage may be full.');
  }
}

/**
 * Hook to get all imported sitemaps
 */
export function useImportedSitemaps() {
  return useQuery<ImportedSitemap[]>({
    queryKey: ['importedSitemaps'],
    queryFn: async () => {
      return getImportedSitemaps();
    },
    staleTime: Infinity,
    retry: false,
  });
}

/**
 * Hook to import a sitemap from XML content
 */
export function useImportSitemapFromXML() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ xmlContent, appName }: { xmlContent: string; appName: string }) => {
      if (!xmlContent.trim()) {
        throw new Error('XML content is empty. Please paste valid sitemap XML.');
      }
      
      if (!appName.trim()) {
        throw new Error('App name is required.');
      }
      
      const result = parseSitemapXML(xmlContent, appName);
      const menuItems = result.urls.map((url, index) => 
        convertToMenuItem(url, appName, index)
      );

      const imported: ImportedSitemap = {
        id: `${appName.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}`,
        appName,
        result,
        menuItems,
      };

      const existing = getImportedSitemaps();
      const updated = [...existing.filter(s => s.appName !== appName), imported];
      saveImportedSitemaps(updated);

      return imported;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['importedSitemaps'] });
      queryClient.invalidateQueries({ queryKey: ['menuItems'] });
    },
    onError: (error) => {
      console.error('XML import error:', error);
    },
  });
}

/**
 * Hook to import a sitemap from URL
 */
export function useImportSitemapFromURL() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ sitemapUrl, appName }: { sitemapUrl: string; appName: string }) => {
      if (!sitemapUrl.trim()) {
        throw new Error('Sitemap URL is required.');
      }
      
      if (!appName.trim()) {
        throw new Error('App name is required.');
      }
      
      const result = await fetchAndParseSitemap(sitemapUrl, appName);
      const menuItems = result.urls.map((url, index) => 
        convertToMenuItem(url, appName, index)
      );

      const imported: ImportedSitemap = {
        id: `${appName.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}`,
        appName,
        result,
        menuItems,
      };

      const existing = getImportedSitemaps();
      const updated = [...existing.filter(s => s.appName !== appName), imported];
      saveImportedSitemaps(updated);

      return imported;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['importedSitemaps'] });
      queryClient.invalidateQueries({ queryKey: ['menuItems'] });
    },
    onError: (error) => {
      console.error('URL import error:', error);
    },
  });
}

/**
 * Hook to delete an imported sitemap
 */
export function useDeleteImportedSitemap() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (appName: string) => {
      const existing = getImportedSitemaps();
      const updated = existing.filter(s => s.appName !== appName);
      saveImportedSitemaps(updated);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['importedSitemaps'] });
      queryClient.invalidateQueries({ queryKey: ['menuItems'] });
    },
    onError: (error) => {
      console.error('Delete error:', error);
    },
  });
}

/**
 * Hook to get imported menu items for a specific app
 */
export function useImportedMenuItems(appName?: string) {
  return useQuery({
    queryKey: ['importedMenuItems', appName],
    queryFn: async () => {
      const sitemaps = getImportedSitemaps();
      if (appName) {
        const sitemap = sitemaps.find(s => s.appName === appName);
        return sitemap?.menuItems || [];
      }
      return sitemaps.flatMap(s => s.menuItems);
    },
    staleTime: Infinity,
    retry: false,
  });
}
