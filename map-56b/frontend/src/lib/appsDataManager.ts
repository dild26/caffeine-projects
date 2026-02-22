// Centralized Apps Data Manager - Single Source of Truth
// This module manages the unified app data with real-time synchronization

import { DEFAULT_APPS, type AppConfig } from '../data/defaultApps';

const STORAGE_KEY = 'secoinfi_apps_data';
const SYNC_EVENT = 'apps_data_sync';

export interface AppConfigExtended extends AppConfig {
  subdomain?: string;
}

// Custom event for cross-component synchronization
export class AppsDataSyncEvent extends CustomEvent<AppConfigExtended[]> {
  constructor(data: AppConfigExtended[]) {
    super(SYNC_EVENT, { detail: data });
  }
}

/**
 * Get current apps data from storage or default
 */
export function getAppsData(): AppConfigExtended[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      // Validate and merge with defaults to ensure all apps are present
      return mergeWithDefaults(parsed);
    }
  } catch (error) {
    console.error('[Apps Data Manager] Error reading from storage:', error);
  }
  return enhanceWithSubdomains(DEFAULT_APPS);
}

/**
 * Save apps data to storage and trigger sync event
 */
export function saveAppsData(data: AppConfigExtended[]): void {
  try {
    // Validate data before saving
    const validated = validateAppsData(data);
    
    // Save to localStorage
    localStorage.setItem(STORAGE_KEY, JSON.stringify(validated));
    
    // Dispatch sync event for real-time updates
    window.dispatchEvent(new AppsDataSyncEvent(validated));
    
    console.log('[Apps Data Manager] Data saved and sync event dispatched');
  } catch (error) {
    console.error('[Apps Data Manager] Error saving data:', error);
    throw error;
  }
}

/**
 * Update a single app
 */
export function updateApp(appId: string, updates: Partial<AppConfigExtended>): AppConfigExtended[] {
  const currentData = getAppsData();
  const updatedData = currentData.map(app => 
    app.id === appId ? { ...app, ...updates } : app
  );
  saveAppsData(updatedData);
  return updatedData;
}

/**
 * Add a new app
 */
export function addApp(newApp: AppConfigExtended): AppConfigExtended[] {
  const currentData = getAppsData();
  
  // Check for duplicate ID
  if (currentData.some(app => app.id === newApp.id)) {
    throw new Error(`App with ID "${newApp.id}" already exists`);
  }
  
  // Check for duplicate URL
  const normalizedUrl = normalizeUrl(newApp.url);
  if (currentData.some(app => normalizeUrl(app.url) === normalizedUrl)) {
    throw new Error(`App with URL "${newApp.url}" already exists`);
  }
  
  const updatedData = [...currentData, newApp];
  saveAppsData(updatedData);
  return updatedData;
}

/**
 * Delete an app
 */
export function deleteApp(appId: string): AppConfigExtended[] {
  const currentData = getAppsData();
  const updatedData = currentData.filter(app => app.id !== appId);
  saveAppsData(updatedData);
  return updatedData;
}

/**
 * Reset to default apps
 */
export function resetToDefaults(): AppConfigExtended[] {
  const defaultData = enhanceWithSubdomains(DEFAULT_APPS);
  saveAppsData(defaultData);
  return defaultData;
}

/**
 * Validate apps data
 */
function validateAppsData(data: AppConfigExtended[]): AppConfigExtended[] {
  if (!Array.isArray(data)) {
    console.warn('[Apps Data Manager] Invalid data format, returning defaults');
    return enhanceWithSubdomains(DEFAULT_APPS);
  }

  const validated: AppConfigExtended[] = [];
  const seenIds = new Set<string>();
  const seenUrls = new Set<string>();
  
  for (const app of data) {
    // Validate required fields
    if (!app.id || !app.name || !app.url) {
      console.warn('[Apps Data Manager] Skipping invalid app:', app);
      continue;
    }
    
    // Check for duplicate ID
    if (seenIds.has(app.id)) {
      console.warn('[Apps Data Manager] Duplicate ID detected:', app.id);
      continue;
    }
    
    // Normalize and check for duplicate URL
    const normalizedUrl = normalizeUrl(app.url);
    if (seenUrls.has(normalizedUrl)) {
      console.warn('[Apps Data Manager] Duplicate URL detected:', app.url);
      continue;
    }
    
    // Validate URL format
    if (!isValidUrl(app.url)) {
      console.warn('[Apps Data Manager] Invalid URL format:', app.url);
      continue;
    }
    
    seenIds.add(app.id);
    seenUrls.add(normalizedUrl);
    validated.push({
      ...app,
      url: normalizedUrl, // Store normalized URL
    });
  }
  
  // If no valid apps, return defaults
  if (validated.length === 0) {
    console.warn('[Apps Data Manager] No valid apps found, returning defaults');
    return enhanceWithSubdomains(DEFAULT_APPS);
  }
  
  return validated;
}

/**
 * Normalize URL to prevent duplicates
 */
function normalizeUrl(url: string): string {
  if (!url || typeof url !== 'string') {
    return '';
  }

  let normalized = url.trim();
  
  // Remove duplicate .caffeine.xyz segments
  while (normalized.includes('.caffeine.xyz.caffeine.xyz')) {
    normalized = normalized.replace(/\.caffeine\.xyz\.caffeine\.xyz/gi, '.caffeine.xyz');
  }
  
  // Remove duplicate .caffeine.ai segments
  while (normalized.includes('.caffeine.ai.caffeine.ai')) {
    normalized = normalized.replace(/\.caffeine\.ai\.caffeine\.ai/gi, '.caffeine.ai');
  }
  
  // Ensure https protocol
  if (normalized.startsWith('http://')) {
    normalized = normalized.replace('http://', 'https://');
  }
  
  // Add protocol if missing
  if (!normalized.startsWith('http')) {
    normalized = `https://${normalized}`;
  }
  
  // Ensure trailing slash for root URLs
  if (!normalized.includes('/', 8)) {
    normalized += '/';
  }
  
  return normalized;
}

/**
 * Validate URL format
 */
function isValidUrl(url: string): boolean {
  if (!url || typeof url !== 'string') {
    return false;
  }

  try {
    const urlObj = new URL(url);
    return urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
  } catch {
    return false;
  }
}

/**
 * Extract subdomain from URL
 */
function extractSubdomain(url: string): string {
  if (!url || typeof url !== 'string') {
    return '';
  }

  try {
    const urlObj = new URL(url);
    const hostname = urlObj.hostname;
    const parts = hostname.split('.');
    if (parts.length >= 3) {
      return parts[0];
    }
    return hostname;
  } catch {
    return '';
  }
}

/**
 * Enhance apps with subdomain field
 */
function enhanceWithSubdomains(apps: AppConfig[]): AppConfigExtended[] {
  if (!Array.isArray(apps)) {
    console.error('[Apps Data Manager] Invalid apps array');
    return [];
  }

  return apps.map(app => ({
    ...app,
    subdomain: extractSubdomain(app.url),
  }));
}

/**
 * Merge stored data with defaults to ensure all apps are present
 */
function mergeWithDefaults(stored: AppConfigExtended[]): AppConfigExtended[] {
  if (!Array.isArray(stored)) {
    return enhanceWithSubdomains(DEFAULT_APPS);
  }

  const defaultApps = enhanceWithSubdomains(DEFAULT_APPS);
  const storedMap = new Map(stored.map(app => [app.id, app]));
  
  // Start with defaults and override with stored data
  const merged = defaultApps.map(defaultApp => {
    const storedApp = storedMap.get(defaultApp.id);
    return storedApp || defaultApp;
  });
  
  // Add any new apps from stored data that aren't in defaults
  stored.forEach(storedApp => {
    if (!merged.some(app => app.id === storedApp.id)) {
      merged.push(storedApp);
    }
  });
  
  return merged;
}

/**
 * Subscribe to data changes
 */
export function subscribeToChanges(callback: (data: AppConfigExtended[]) => void): () => void {
  const handler = (event: Event) => {
    if (event instanceof AppsDataSyncEvent) {
      callback(event.detail);
    }
  };
  
  window.addEventListener(SYNC_EVENT, handler);
  
  // Return unsubscribe function
  return () => {
    window.removeEventListener(SYNC_EVENT, handler);
  };
}
