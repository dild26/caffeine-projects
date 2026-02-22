/**
 * Subdomain Normalization Utility
 * Ensures clean subdomain values by stripping protocol artifacts and validating format
 */

/**
 * Normalize subdomain by removing protocol artifacts and validating format
 * @param subdomain - Raw subdomain string that may contain protocol artifacts
 * @returns Clean subdomain value (e.g., "infytask-mia", "e-contracts-bqe", "map-56b")
 */
export function normalizeSubdomain(subdomain: string): string {
  if (!subdomain || typeof subdomain !== 'string') {
    return '';
  }

  let cleaned = subdomain.trim();

  // Strip all protocol artifacts: https:////, http://, https://
  cleaned = cleaned.replace(/^https?:\/\/+/gi, '');

  // Remove any remaining slashes
  cleaned = cleaned.replace(/\//g, '');

  // Extract only the subdomain part (before first dot)
  const parts = cleaned.split('.');
  if (parts.length > 0) {
    cleaned = parts[0];
  }

  // Convert to lowercase
  cleaned = cleaned.toLowerCase();

  // Validate against regex: only lowercase alphanumeric and hyphens
  const validPattern = /^[a-z0-9-]+$/;
  if (!validPattern.test(cleaned)) {
    // If invalid, try to extract valid characters only
    cleaned = cleaned.replace(/[^a-z0-9-]/g, '');
  }

  return cleaned;
}

/**
 * Normalize canonical URL by removing protocol artifacts and ensuring proper format
 * @param url - Raw URL string that may contain malformed protocol artifacts
 * @returns Clean canonical URL (e.g., "https://subdomain.caffeine.xyz/")
 */
export function normalizeCanonicalUrl(url: string): string {
  if (!url || typeof url !== 'string') {
    return '';
  }

  let cleaned = url.trim();

  // Strip all protocol artifacts: https:////, http:////, https://, http://
  cleaned = cleaned.replace(/^https?:\/\/+/gi, 'https://');

  // Ensure it starts with https://
  if (!cleaned.startsWith('https://') && !cleaned.startsWith('http://')) {
    cleaned = 'https://' + cleaned;
  }

  // Convert http to https
  if (cleaned.startsWith('http://')) {
    cleaned = cleaned.replace('http://', 'https://');
  }

  // Ensure trailing slash for root URLs
  if (!cleaned.endsWith('/') && !cleaned.includes('/', 8)) {
    cleaned += '/';
  }

  // Convert to lowercase (host part only)
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
 * Validate subdomain format
 * @param subdomain - Subdomain string to validate
 * @returns True if subdomain matches the valid pattern
 */
export function isValidSubdomain(subdomain: string): boolean {
  if (!subdomain || typeof subdomain !== 'string') {
    return false;
  }

  const validPattern = /^[a-z0-9-]+$/;
  return validPattern.test(subdomain);
}

/**
 * Extract subdomain from full URL
 * @param url - Full URL string
 * @returns Extracted and normalized subdomain
 */
export function extractSubdomainFromUrl(url: string): string {
  if (!url || typeof url !== 'string') {
    return '';
  }

  try {
    const urlObj = new URL(url);
    const hostname = urlObj.hostname;
    const parts = hostname.split('.');
    
    if (parts.length >= 3) {
      // Extract first part (subdomain)
      return normalizeSubdomain(parts[0]);
    }
    
    return normalizeSubdomain(hostname);
  } catch {
    // If URL parsing fails, try to extract manually
    let cleaned = url.replace(/^https?:\/\/+/gi, '');
    const firstDot = cleaned.indexOf('.');
    if (firstDot > 0) {
      cleaned = cleaned.substring(0, firstDot);
    }
    return normalizeSubdomain(cleaned);
  }
}

/**
 * Batch normalize subdomains
 * @param subdomains - Array of subdomain strings
 * @returns Array of normalized subdomains
 */
export function batchNormalizeSubdomains(subdomains: string[]): string[] {
  if (!Array.isArray(subdomains)) {
    return [];
  }

  return subdomains.map(normalizeSubdomain).filter(s => s.length > 0);
}

/**
 * Batch normalize canonical URLs
 * @param urls - Array of URL strings
 * @returns Array of normalized canonical URLs
 */
export function batchNormalizeCanonicalUrls(urls: string[]): string[] {
  if (!Array.isArray(urls)) {
    return [];
  }

  return urls.map(normalizeCanonicalUrl).filter(u => u.length > 0);
}

