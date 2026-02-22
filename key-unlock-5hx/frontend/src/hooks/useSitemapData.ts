import { useQuery } from '@tanstack/react-query';
import { useActor } from './useActor';
import { getDomainHash } from '../lib/domainHash';
import { useGetAllApps } from './useApps';

export interface SitemapEntry {
  id: number;
  name: string;
  url: string;
  category: string;
  parentId: number | null;
  children: number[];
  hash: string;
  lastUpdated: number;
  appName?: string;
  isAiDiscovered?: boolean;
}

// ============================================================================
// STEP 1: DOUBLE-SANITIZATION PIPELINE - Enhanced URL Normalization
// ============================================================================

/**
 * Phase 1: Strip .caffeine.xyz from app identifiers found in discovery logs
 * This prevents subdomain duplication at the source
 */
function sanitizeAppIdentifier(identifier: string): string {
  let sanitized = identifier.trim();
  
  // Handle multiple patterns of .caffeine.xyz
  sanitized = sanitized.replace(/\.caffeine\.xyz/gi, '');
  sanitized = sanitized.replace(/\.caffeine\.ai/gi, '');
  
  // Remove any trailing dots
  sanitized = sanitized.replace(/\.+$/, '');
  
  return sanitized;
}

/**
 * Phase 2: Ensure base URLs are always in format https://<subdomain>.caffeine.ai/
 * This is the canonical URL format for all SECOINFI apps
 */
function buildCanonicalUrl(subdomain: string, path: string = ''): string {
  const cleanSubdomain = sanitizeAppIdentifier(subdomain);
  
  let canonicalUrl = `https://${cleanSubdomain}.caffeine.ai`;
  
  if (path) {
    const cleanPath = path.startsWith('/') ? path : `/${path}`;
    canonicalUrl += cleanPath;
  } else {
    canonicalUrl += '/';
  }
  
  return canonicalUrl;
}

/**
 * Phase 3: Comprehensive URL normalization to eliminate ALL duplicate patterns
 */
function normalizeUrl(url: string): string {
  let normalized = url.trim();
  
  // Remove duplicate .caffeine.xyz segments
  while (normalized.includes('.caffeine.xyz.caffeine.xyz')) {
    normalized = normalized.replace(/\.caffeine\.xyz\.caffeine\.xyz/gi, '.caffeine.xyz');
  }
  
  // Remove duplicate .caffeine.ai segments
  while (normalized.includes('.caffeine.ai.caffeine.ai')) {
    normalized = normalized.replace(/\.caffeine\.ai\.caffeine\.ai/gi, '.caffeine.ai');
  }
  
  // Convert .caffeine.xyz to .caffeine.ai (canonical domain)
  normalized = normalized.replace(/\.caffeine\.xyz/gi, '.caffeine.ai');
  
  // Ensure consistent protocol (https)
  if (normalized.startsWith('http://')) {
    normalized = normalized.replace('http://', 'https://');
  }
  
  // Add protocol if missing for absolute URLs
  if (!normalized.startsWith('http') && !normalized.startsWith('/')) {
    normalized = `https://${normalized}`;
  }
  
  // Remove trailing slashes for consistency (except for root URLs)
  if (normalized.endsWith('/') && normalized.length > 1 && !normalized.endsWith('://')) {
    const pathPart = normalized.split('://')[1];
    if (pathPart && pathPart.includes('/') && pathPart.split('/').length > 2) {
      normalized = normalized.slice(0, -1);
    }
  }
  
  return normalized;
}

// ============================================================================
// STEP 2: POST-DISCOVERY VALIDATION & DEDUPLICATION
// ============================================================================

function deduplicateEntries(entries: SitemapEntry[]): SitemapEntry[] {
  const seenUrls = new Map<string, SitemapEntry>();
  const duplicatesRemoved: string[] = [];
  
  for (const entry of entries) {
    const normalizedUrl = normalizeUrl(entry.url).toLowerCase();
    
    if (!seenUrls.has(normalizedUrl)) {
      seenUrls.set(normalizedUrl, {
        ...entry,
        url: normalizeUrl(entry.url),
      });
    } else {
      const existing = seenUrls.get(normalizedUrl)!;
      if (entry.lastUpdated > existing.lastUpdated) {
        duplicatesRemoved.push(existing.url);
        seenUrls.set(normalizedUrl, {
          ...entry,
          url: normalizeUrl(entry.url),
        });
      } else {
        duplicatesRemoved.push(entry.url);
      }
    }
  }
  
  if (duplicatesRemoved.length > 0) {
    console.log(`[Deduplication] Removed ${duplicatesRemoved.length} duplicate URLs:`, duplicatesRemoved);
  }
  
  return Array.from(seenUrls.values());
}

function validateUrlSet(entries: SitemapEntry[]): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];
  const urlPattern = /^https:\/\/[a-z0-9-]+\.caffeine\.ai(\/.*)?$/i;
  
  entries.forEach(entry => {
    if (entry.url.includes('.caffeine.xyz.caffeine.xyz')) {
      errors.push(`Malformed URL detected (duplicate domain): ${entry.url}`);
    }
    
    if (entry.url.includes('.caffeine.ai.caffeine.ai')) {
      errors.push(`Malformed URL detected (duplicate domain): ${entry.url}`);
    }
    
    if (entry.url.startsWith('http') && !urlPattern.test(entry.url) && !entry.url.startsWith('/')) {
      errors.push(`Non-canonical URL format: ${entry.url}`);
    }
  });
  
  return {
    isValid: errors.length === 0,
    errors,
  };
}

// ============================================================================
// STEP 3: AI-POWERED URL-TO-APP MATCHING WITH SAFE SUBDOMAIN EXTRACTION
// ============================================================================

function extractSubdomain(url: string): string {
  try {
    const normalized = normalizeUrl(url);
    
    if (normalized.startsWith('http://') || normalized.startsWith('https://')) {
      const urlObj = new URL(normalized);
      const hostname = urlObj.hostname;
      
      return sanitizeAppIdentifier(hostname);
    }
    
    return '';
  } catch (error) {
    console.warn('[Subdomain Extraction] Failed to extract subdomain from URL:', url, error);
    return '';
  }
}

const matchUrlToApp = (url: string, name: string, apps: any[]): string => {
  const normalizedUrl = normalizeUrl(url);
  const lowerUrl = normalizedUrl.toLowerCase();
  const lowerName = name.toLowerCase();
  
  const subdomain = extractSubdomain(normalizedUrl);
  
  // Build subdomain map from live apps data
  const subdomainMap: Record<string, string> = {};
  apps.forEach(app => {
    const appSubdomain = app.subdomain || extractSubdomain(app.url);
    if (appSubdomain) {
      subdomainMap[appSubdomain] = app.name;
    }
  });
  
  // Direct subdomain match
  if (subdomainMap[subdomain]) {
    return subdomainMap[subdomain];
  }
  
  // Match by URL patterns
  for (const [sub, appName] of Object.entries(subdomainMap)) {
    if (lowerUrl.includes(`${sub}.caffeine.ai`)) {
      return appName;
    }
  }
  
  // Match by name patterns
  for (const app of apps) {
    if (lowerName.includes(app.name.toLowerCase())) {
      return app.name;
    }
  }
  
  // Match by relative paths
  if (lowerUrl.startsWith('/') && !lowerUrl.startsWith('//')) {
    if (lowerUrl.includes('/pros/secoin')) return 'SECOIN Realty';
    if (lowerUrl.includes('/pros/moap')) return 'MOAP App';
    if (lowerUrl.includes('/pros/sitemapai')) return 'SitemapAi';
    
    if (lowerUrl.includes('/dashboard') || lowerUrl.includes('/features') || 
        lowerUrl.includes('/sitemap') || lowerUrl.includes('/leaderboard') ||
        lowerUrl.includes('/payment') || lowerUrl.includes('/fixtures')) {
      return 'MOAP App';
    }
  }
  
  // Default: try to find matching app by URL
  for (const app of apps) {
    const normalizedAppUrl = normalizeUrl(app.url).toLowerCase();
    if (lowerUrl.includes(normalizedAppUrl) || normalizedAppUrl.includes(lowerUrl)) {
      return app.name;
    }
  }
  
  return 'MOAP App';
};

// ============================================================================
// STEP 4: HIERARCHICAL STRUCTURE WITH EXPLICIT ROOT NODES
// ============================================================================

function initializeAppRootNodes(apps: any[]): SitemapEntry[] {
  const rootNodes: SitemapEntry[] = [];
  let idCounter = 1000;
  
  apps.forEach((app) => {
    const subdomain = sanitizeAppIdentifier(
      app.url.replace('https://', '').replace('http://', '').split('.')[0]
    );
    const canonicalUrl = buildCanonicalUrl(subdomain);
    
    rootNodes.push({
      id: idCounter++,
      name: app.name,
      url: canonicalUrl,
      category: 'Apps',
      parentId: null,
      children: [],
      hash: getDomainHash(canonicalUrl),
      lastUpdated: Date.now(),
      appName: app.name,
      isAiDiscovered: false,
    });
  });
  
  return rootNodes;
}

const MOAP_INTERNAL_PAGES: SitemapEntry[] = [
  {
    id: 1,
    name: 'Dashboard',
    url: '/dashboard',
    category: 'Main',
    parentId: null,
    children: [],
    hash: getDomainHash('dashboard'),
    lastUpdated: Date.now(),
    appName: 'MOAP App',
  },
  {
    id: 2,
    name: 'Leaderboard',
    url: '/leaderboard',
    category: 'Main',
    parentId: null,
    children: [],
    hash: getDomainHash('leaderboard'),
    lastUpdated: Date.now(),
    appName: 'MOAP App',
  },
  {
    id: 3,
    name: 'Features Management',
    url: '/features',
    category: 'Management',
    parentId: null,
    children: [],
    hash: getDomainHash('features'),
    lastUpdated: Date.now(),
    appName: 'MOAP App',
  },
  {
    id: 4,
    name: 'Sitemap Management',
    url: '/sitemap',
    category: 'Management',
    parentId: null,
    children: [],
    hash: getDomainHash('sitemap'),
    lastUpdated: Date.now(),
    appName: 'MOAP App',
  },
  {
    id: 5,
    name: 'About Us',
    url: '/about-us',
    category: 'Information',
    parentId: null,
    children: [],
    hash: getDomainHash('about-us'),
    lastUpdated: Date.now(),
    appName: 'MOAP App',
  },
  {
    id: 6,
    name: 'Contact Us',
    url: '/contact-us',
    category: 'Support',
    parentId: null,
    children: [],
    hash: getDomainHash('contact-us'),
    lastUpdated: Date.now(),
    appName: 'MOAP App',
  },
  {
    id: 7,
    name: 'FAQ',
    url: '/faq',
    category: 'Support',
    parentId: null,
    children: [],
    hash: getDomainHash('faq'),
    lastUpdated: Date.now(),
    appName: 'MOAP App',
  },
  {
    id: 8,
    name: 'Blog',
    url: '/blog',
    category: 'Content',
    parentId: null,
    children: [],
    hash: getDomainHash('blog'),
    lastUpdated: Date.now(),
    appName: 'MOAP App',
  },
];

// ============================================================================
// STEP 5: BUILD HIERARCHICAL STRUCTURE WITH INCREMENTAL SYNC
// ============================================================================

function buildHierarchy(entries: SitemapEntry[]): SitemapEntry[] {
  const entryMap = new Map<number, SitemapEntry>();
  const result: SitemapEntry[] = [];
  
  entries.forEach(entry => {
    entryMap.set(entry.id, { ...entry, children: [] });
  });
  
  entries.forEach(entry => {
    const mappedEntry = entryMap.get(entry.id);
    if (!mappedEntry) return;
    
    if (entry.parentId === null) {
      result.push(mappedEntry);
    } else {
      const parent = entryMap.get(entry.parentId);
      if (parent && !parent.children.includes(entry.id)) {
        parent.children.push(entry.id);
      }
    }
  });
  
  return Array.from(entryMap.values());
}

// ============================================================================
// STEP 6: SELF-HEALING CONSISTENCY MODULE
// ============================================================================

function validateConsistency(entries: SitemapEntry[]): { 
  isValid: boolean; 
  errors: string[];
  needsHealing: boolean;
} {
  const errors: string[] = [];
  const entryMap = new Map(entries.map(e => [e.id, e]));
  let needsHealing = false;
  
  entries.forEach(entry => {
    if (entry.parentId !== null && !entryMap.has(entry.parentId)) {
      errors.push(`Entry "${entry.name}" (ID: ${entry.id}) has invalid parent ID: ${entry.parentId}`);
      needsHealing = true;
    }
  });
  
  entries.forEach(entry => {
    entry.children.forEach(childId => {
      if (!entryMap.has(childId)) {
        errors.push(`Entry "${entry.name}" (ID: ${entry.id}) references non-existent child ID: ${childId}`);
        needsHealing = true;
      }
    });
  });
  
  const urlMap = new Map<string, number>();
  entries.forEach(entry => {
    const normalizedUrl = normalizeUrl(entry.url).toLowerCase();
    if (urlMap.has(normalizedUrl)) {
      errors.push(`Duplicate URL detected: "${entry.url}" (normalized: "${normalizedUrl}") appears in entries ${urlMap.get(normalizedUrl)} and ${entry.id}`);
      needsHealing = true;
    } else {
      urlMap.set(normalizedUrl, entry.id);
    }
  });
  
  const urlValidation = validateUrlSet(entries);
  if (!urlValidation.isValid) {
    errors.push(...urlValidation.errors);
    needsHealing = true;
  }
  
  return {
    isValid: errors.length === 0,
    errors,
    needsHealing,
  };
}

function healSitemapData(entries: SitemapEntry[]): SitemapEntry[] {
  console.log('[Self-Healing] Starting sitemap data healing process...');
  
  const normalizedEntries = entries.map(entry => ({
    ...entry,
    url: normalizeUrl(entry.url),
  }));
  
  const deduplicatedEntries = deduplicateEntries(normalizedEntries);
  const healedEntries = buildHierarchy(deduplicatedEntries);
  
  const validation = validateConsistency(healedEntries);
  
  if (validation.isValid) {
    console.log('[Self-Healing] Healing successful! Data is now consistent.');
  } else {
    console.error('[Self-Healing] Healing failed. Remaining errors:', validation.errors);
  }
  
  return healedEntries;
}

// ============================================================================
// STEP 7: INCREMENTAL SYNCHRONIZATION - REAL-TIME APPEND
// ============================================================================

function mergeEntries(existing: SitemapEntry[], newEntries: SitemapEntry[]): SitemapEntry[] {
  const existingMap = new Map(existing.map(e => [normalizeUrl(e.url).toLowerCase(), e]));
  const merged = [...existing];
  let addedCount = 0;
  let updatedCount = 0;
  
  newEntries.forEach(entry => {
    const normalizedUrl = normalizeUrl(entry.url);
    const key = normalizedUrl.toLowerCase();
    
    if (!existingMap.has(key)) {
      merged.push({
        ...entry,
        url: normalizedUrl,
      });
      existingMap.set(key, entry);
      addedCount++;
    } else {
      const existingEntry = existingMap.get(key)!;
      if (entry.lastUpdated > existingEntry.lastUpdated) {
        const index = merged.findIndex(e => e.id === existingEntry.id);
        if (index !== -1) {
          merged[index] = { 
            ...entry, 
            id: existingEntry.id,
            url: normalizedUrl,
          };
          updatedCount++;
        }
      }
    }
  });
  
  if (addedCount > 0 || updatedCount > 0) {
    console.log(`[Incremental Sync] Added: ${addedCount}, Updated: ${updatedCount}`);
  }
  
  return merged;
}

// ============================================================================
// MAIN QUERY HOOKS
// ============================================================================

export function useSitemapData() {
  const { actor, isFetching } = useActor();
  const { data: apps = [] } = useGetAllApps();

  return useQuery<SitemapEntry[]>({
    queryKey: ['sitemapData', apps.length],
    queryFn: async () => {
      let allEntries = [...initializeAppRootNodes(apps), ...MOAP_INTERNAL_PAGES];
      
      if (actor) {
        try {
          // Backend method getAllSitemapEntries not available - use localStorage
          console.warn('[Sitemap Data] Backend getAllSitemapEntries method not available, using localStorage');
          
          const stored = localStorage.getItem('sitemapEntries');
          if (stored) {
            const backendEntries = JSON.parse(stored);
            
            const convertedEntries = backendEntries.map((entry: any) => {
              const rawUrl = String(entry.url);
              const normalizedUrl = normalizeUrl(rawUrl);
              const appName = matchUrlToApp(normalizedUrl, entry.name, apps);
              
              const rootNode = allEntries.find(e => e.appName === appName && e.parentId === null);
              
              return {
                id: Number(entry.id),
                name: entry.name,
                url: normalizedUrl,
                category: entry.category,
                parentId: rootNode ? rootNode.id : null,
                children: Array.isArray(entry.children) ? entry.children.map((id: any) => Number(id)) : [],
                hash: entry.hash || getDomainHash(normalizedUrl),
                lastUpdated: Number(entry.lastUpdated),
                appName,
                isAiDiscovered: true,
              };
            });

            allEntries = mergeEntries(allEntries, convertedEntries);
          }
        } catch (error) {
          console.error('[Sitemap Data] Error fetching from backend:', error);
        }
      }
      
      allEntries = deduplicateEntries(allEntries);
      const hierarchicalEntries = buildHierarchy(allEntries);
      
      const validation = validateConsistency(hierarchicalEntries);
      
      if (!validation.isValid) {
        console.warn('[Consistency Check] Issues detected:', validation.errors);
        
        if (validation.needsHealing) {
          console.log('[Self-Healing] Triggering automatic healing...');
          return healSitemapData(hierarchicalEntries);
        }
      }
      
      return hierarchicalEntries;
    },
    enabled: !!actor && !isFetching && apps.length > 0,
    staleTime: 30 * 1000,
    refetchInterval: 60 * 1000,
  });
}

export function useSitemapByApp() {
  const { data: sitemapData = [] } = useSitemapData();
  const { data: apps = [] } = useGetAllApps();

  return useQuery<Record<string, SitemapEntry[]>>({
    queryKey: ['sitemapByApp', sitemapData.length, apps.length],
    queryFn: async () => {
      const grouped: Record<string, SitemapEntry[]> = {};
      
      sitemapData.forEach(entry => {
        const app = entry.appName || 'MOAP App';
        if (!grouped[app]) {
          grouped[app] = [];
        }
        grouped[app].push(entry);
      });
      
      apps.forEach(app => {
        if (!grouped[app.name]) {
          const rootNode = sitemapData.find(e => e.appName === app.name && e.parentId === null);
          if (rootNode) {
            grouped[app.name] = [rootNode];
          }
        }
      });
      
      const totalGrouped = Object.values(grouped).reduce((sum, entries) => sum + entries.length, 0);
      if (totalGrouped !== sitemapData.length) {
        console.error(`[Sitemap By App] Count mismatch: Total=${sitemapData.length}, Grouped=${totalGrouped}`);
      }
      
      return grouped;
    },
    staleTime: 30 * 1000,
  });
}

export function useSitemapStats() {
  const { data: sitemapData = [] } = useSitemapData();
  const { data: sitemapByApp = {} } = useSitemapByApp();

  return useQuery({
    queryKey: ['sitemapStats', sitemapData.length],
    queryFn: async () => {
      const totalEntries = sitemapData.length;
      const rootEntries = sitemapData.filter(e => e.parentId === null).length;
      const childEntries = sitemapData.filter(e => e.parentId !== null).length;
      const appCount = Object.keys(sitemapByApp).length;
      const aiDiscoveredCount = sitemapData.filter(e => e.isAiDiscovered).length;
      const groupedTotal = Object.values(sitemapByApp).reduce((sum, entries) => sum + entries.length, 0);
      
      const isConsistent = totalEntries === (rootEntries + childEntries) && totalEntries === groupedTotal;
      const uniqueUrls = new Set(sitemapData.map(e => normalizeUrl(e.url).toLowerCase())).size;
      
      return {
        totalEntries,
        rootEntries,
        childEntries,
        appCount,
        aiDiscoveredCount,
        isConsistent,
        groupedTotal,
        uniqueUrls,
      };
    },
    staleTime: 30 * 1000,
  });
}

