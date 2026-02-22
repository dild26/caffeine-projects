/**
 * URL Validation and Canonical Mapping Utility
 * Enforces single source of truth for all Secoinfi-App URLs with comprehensive sanitization
 */

import { DEFAULT_APPS } from '../data/defaultApps';

// Canonical URL mapping from verified defaultApps registry
const CANONICAL_URL_MAP = new Map<string, string>(
  DEFAULT_APPS.map(app => [app.name.toLowerCase(), app.url])
);

/**
 * Sanitize URL by removing duplicate protocols and malformed artifacts
 */
export function sanitizeUrl(url: string): string {
  if (!url || typeof url !== 'string') {
    return '';
  }

  let cleaned = url.trim();

  // Remove any leading/trailing whitespace
  cleaned = cleaned.replace(/\s+/g, '');

  // Remove duplicate protocol strings (https://https://, http://http://, etc.)
  cleaned = cleaned.replace(/^(https?:\/\/)+/gi, 'https://');

  // Remove malformed protocol artifacts like "Evolved-Ai App.https://"
  cleaned = cleaned.replace(/^[^h]*https?:\/\//gi, 'https://');

  // Remove any remaining protocol-like strings in the middle
  cleaned = cleaned.replace(/([^:])https?:\/\//gi, '$1');

  // Ensure single protocol at start
  if (!cleaned.startsWith('https://') && !cleaned.startsWith('http://')) {
    cleaned = 'https://' + cleaned;
  }

  // Convert http to https
  if (cleaned.startsWith('http://')) {
    cleaned = cleaned.replace('http://', 'https://');
  }

  // Remove duplicate slashes (except after protocol)
  cleaned = cleaned.replace(/([^:]\/)\/+/g, '$1');

  // Ensure trailing slash for root URLs
  try {
    const urlObj = new URL(cleaned);
    if (urlObj.pathname === '' || urlObj.pathname === '/') {
      cleaned = `${urlObj.protocol}//${urlObj.host}/`;
    }
  } catch {
    // If URL parsing fails, add trailing slash if missing
    if (!cleaned.endsWith('/') && !cleaned.includes('/', 8)) {
      cleaned += '/';
    }
  }

  // Convert hostname to lowercase
  try {
    const urlObj = new URL(cleaned);
    urlObj.hostname = urlObj.hostname.toLowerCase();
    cleaned = urlObj.toString();
  } catch {
    // If URL parsing fails, just lowercase the whole thing
    cleaned = cleaned.toLowerCase();
  }

  return cleaned;
}

/**
 * Validate URL format strictly
 * Must start with https:// and match *.caffeine.xyz pattern
 */
export function validateUrl(url: string): boolean {
  if (!url || typeof url !== 'string') {
    return false;
  }

  // Sanitize first
  const sanitized = sanitizeUrl(url);

  // Must start with https://
  if (!sanitized.startsWith('https://')) {
    return false;
  }

  // Must contain .caffeine.xyz
  if (!sanitized.includes('.caffeine.xyz')) {
    return false;
  }

  // Must not contain spaces or %20
  if (sanitized.includes(' ') || sanitized.includes('%20')) {
    return false;
  }

  // Must not contain duplicate https (after sanitization)
  if (sanitized.indexOf('https://') !== sanitized.lastIndexOf('https://')) {
    return false;
  }

  // Must not contain duplicate domain
  const domainCount = (sanitized.match(/\.caffeine\.xyz/g) || []).length;
  if (domainCount > 1) {
    return false;
  }

  return true;
}

/**
 * Get canonical URL from the verified mapping
 * Returns null if app name not found in registry
 */
export function getCanonicalUrl(appName: string): string | null {
  if (!appName || typeof appName !== 'string') {
    return null;
  }

  const normalized = appName.toLowerCase().trim();
  const canonicalUrl = CANONICAL_URL_MAP.get(normalized);
  
  if (canonicalUrl) {
    // Ensure canonical URL is also sanitized
    return sanitizeUrl(canonicalUrl);
  }
  
  return null;
}

/**
 * Validate and resolve URL with fallback to canonical mapping
 * Drops malformed URLs that cannot be resolved
 */
export function validateAndResolveUrl(url: string, appName?: string): string {
  // First, sanitize the URL
  const sanitized = sanitizeUrl(url);

  // Try to validate the sanitized URL
  if (validateUrl(sanitized)) {
    return sanitized;
  }

  // Log warning about invalid URL
  console.warn(`[URL Validator] Invalid Secoinfi-App URL detected: "${url}". Attempting canonical resolution...`);

  // If app name provided, try to resolve from canonical mapping
  if (appName) {
    const canonicalUrl = getCanonicalUrl(appName);
    if (canonicalUrl) {
      console.warn(`[URL Validator] Resolved to canonical URL: ${canonicalUrl}`);
      return canonicalUrl;
    }
  }

  // Last resort: try to extract app name from URL and resolve
  try {
    const urlObj = new URL(sanitized.startsWith('http') ? sanitized : `https://${sanitized}`);
    const hostname = urlObj.hostname;
    const parts = hostname.split('.');
    if (parts.length >= 3) {
      const subdomain = parts[0];
      // Try to find matching app by subdomain
      const matchingApp = DEFAULT_APPS.find(app => {
        try {
          const appUrl = new URL(app.url);
          const appSubdomain = appUrl.hostname.split('.')[0];
          return appSubdomain === subdomain;
        } catch {
          return false;
        }
      });
      if (matchingApp) {
        const resolvedUrl = sanitizeUrl(matchingApp.url);
        console.warn(`[URL Validator] Resolved via subdomain match: ${resolvedUrl}`);
        return resolvedUrl;
      }
    }
  } catch (error) {
    console.error(`[URL Validator] Failed to parse URL: ${url}`, error);
  }

  // If all else fails, drop the URL (return empty string to indicate invalid)
  console.error(`[URL Validator] Could not resolve canonical URL for: ${url}. Dropping malformed URL.`);
  return ''; // Return empty string to indicate invalid URL
}

/**
 * Get all canonical URLs from the registry
 */
export function getAllCanonicalUrls(): string[] {
  return Array.from(CANONICAL_URL_MAP.values()).map(sanitizeUrl);
}

/**
 * Get all app names from the registry
 */
export function getAllAppNames(): string[] {
  return DEFAULT_APPS.map(app => app.name);
}

/**
 * Check if an app name exists in the canonical registry
 */
export function isValidAppName(appName: string): boolean {
  if (!appName || typeof appName !== 'string') {
    return false;
  }
  return CANONICAL_URL_MAP.has(appName.toLowerCase().trim());
}

/**
 * Extract subdomain from URL
 */
export function extractSubdomain(url: string): string | null {
  try {
    const sanitized = sanitizeUrl(url);
    const urlObj = new URL(sanitized.startsWith('http') ? sanitized : `https://${sanitized}`);
    const hostname = urlObj.hostname;
    const parts = hostname.split('.');
    if (parts.length >= 3) {
      return parts[0];
    }
    return null;
  } catch {
    return null;
  }
}

/**
 * Batch validate URLs
 * Returns array of validation results with resolved URLs
 * Filters out malformed URLs that cannot be resolved
 */
export function batchValidateUrls(urls: Array<{ url: string; appName?: string }>): Array<{
  original: string;
  resolved: string;
  isValid: boolean;
  wasResolved: boolean;
}> {
  return urls
    .map(({ url, appName }) => {
      const sanitized = sanitizeUrl(url);
      const isValid = validateUrl(sanitized);
      const resolved = isValid ? sanitized : validateAndResolveUrl(url, appName);
      return {
        original: url,
        resolved,
        isValid,
        wasResolved: !isValid && resolved !== '' && resolved !== url,
      };
    })
    .filter(result => result.resolved !== ''); // Drop malformed URLs
}

/**
 * Deduplicate URLs by normalized form
 * Returns unique URLs only
 */
export function deduplicateUrls(urls: string[]): string[] {
  const seen = new Set<string>();
  const result: string[] = [];

  for (const url of urls) {
    const sanitized = sanitizeUrl(url);
    if (sanitized && !seen.has(sanitized)) {
      seen.add(sanitized);
      result.push(sanitized);
    }
  }

  return result;
}

/**
 * Deduplicate items by URL property
 * Returns unique items only, keeping first occurrence
 */
export function deduplicateByUrl<T extends { url: string }>(items: T[]): T[] {
  const seen = new Set<string>();
  const result: T[] = [];

  for (const item of items) {
    const sanitized = sanitizeUrl(item.url);
    if (sanitized && !seen.has(sanitized)) {
      seen.add(sanitized);
      result.push(item);
    }
  }

  return result;
}

/**
 * Resolve Top App URL from app name using canonical registry
 * Returns null if app not found or URL is invalid
 */
export function resolveTopAppUrl(topAppName: string): string | null {
  if (!topAppName || typeof topAppName !== 'string') {
    return null;
  }

  const canonicalUrl = getCanonicalUrl(topAppName);
  if (canonicalUrl && validateUrl(canonicalUrl)) {
    return canonicalUrl;
  }

  return null;
}
