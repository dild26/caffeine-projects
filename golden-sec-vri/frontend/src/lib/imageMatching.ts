/**
 * Robust image matching utility for property gallery system
 * Ensures each property only displays its own matched images
 */

import { auditLogger } from './auditLogger';

/**
 * Normalize filename for robust matching:
 * - Remove file extension
 * - Convert to lowercase
 * - Remove hyphens, underscores, and spaces
 * - Trim whitespace
 */
export function normalizeFilename(filename: string): string {
  const normalized = filename
    .replace(/\.(png|jpg|jpeg|webp|gif|bmp|svg)$/i, '') // Remove extension
    .toLowerCase()
    .trim()
    .replace(/[-_\s]/g, ''); // Remove hyphens, underscores, and spaces
  
  auditLogger.debug('property_management', 'normalize_filename', {
    original: filename,
    normalized,
  });
  
  return normalized;
}

/**
 * Normalize property identifier (ID or name) for matching:
 * - Convert to lowercase
 * - Remove hyphens, underscores, and spaces
 * - Trim whitespace
 */
export function normalizePropertyIdentifier(text: string): string {
  const normalized = text
    .toLowerCase()
    .trim()
    .replace(/[-_\s]/g, ''); // Remove hyphens, underscores, and spaces
  
  return normalized;
}

/**
 * Match a filename to a property ID using robust, case-insensitive matching
 * Returns true if the filename matches the property ID
 */
export function matchesPropertyId(filename: string, propertyId: string): boolean {
  const normalizedFilename = normalizeFilename(filename);
  const normalizedPropertyId = normalizePropertyIdentifier(propertyId);
  
  // Exact match (case-insensitive, ignoring hyphens/underscores/spaces)
  const exactMatch = normalizedFilename === normalizedPropertyId;
  
  // Substring match (filename contains property ID or vice versa)
  // Only allow substring matches if both strings are at least 4 characters
  const substringMatch = 
    (normalizedFilename.length >= 4 && normalizedPropertyId.length >= 4) &&
    (normalizedFilename.includes(normalizedPropertyId) || normalizedPropertyId.includes(normalizedFilename));
  
  const matches = exactMatch || substringMatch;
  
  auditLogger.debug('property_management', 'match_property_id', {
    filename,
    propertyId,
    normalizedFilename,
    normalizedPropertyId,
    exactMatch,
    substringMatch,
    matches,
  });
  
  return matches;
}

/**
 * Generate a cache-busting URL for an image
 * Includes timestamp, property ID, and image index to ensure uniqueness
 */
export function generateCacheBustingUrl(
  baseUrl: string,
  propertyId: string,
  imageIndex: number,
  forceRefresh: boolean = false
): string {
  const timestamp = forceRefresh ? Date.now() : Math.floor(Date.now() / 60000) * 60000; // 1-minute cache
  const url = `${baseUrl}?t=${timestamp}&prop=${encodeURIComponent(propertyId)}&idx=${imageIndex}&v=2`;
  
  auditLogger.debug('property_management', 'generate_cache_busting_url', {
    baseUrl,
    propertyId,
    imageIndex,
    forceRefresh,
    timestamp,
    generatedUrl: url,
  });
  
  return url;
}

/**
 * Validate that an image URL belongs to a specific property
 * Checks URL parameters to ensure no cross-property contamination
 */
export function validateImageUrl(url: string, expectedPropertyId: string): boolean {
  try {
    const urlObj = new URL(url, window.location.origin);
    const propParam = urlObj.searchParams.get('prop');
    
    if (!propParam) {
      auditLogger.warn('property_management', 'image_url_missing_property_param', {
        url,
        expectedPropertyId,
      });
      return false;
    }
    
    const matches = propParam === expectedPropertyId;
    
    if (!matches) {
      auditLogger.error('property_management', 'image_url_property_mismatch', new Error('Property ID mismatch'), {
        url,
        expectedPropertyId,
        actualPropertyId: propParam,
      });
    }
    
    return matches;
  } catch (error) {
    auditLogger.error('property_management', 'image_url_validation_error', error as Error, {
      url,
      expectedPropertyId,
    });
    return false;
  }
}

/**
 * Extract property ID from an image URL
 */
export function extractPropertyIdFromUrl(url: string): string | null {
  try {
    const urlObj = new URL(url, window.location.origin);
    return urlObj.searchParams.get('prop');
  } catch (error) {
    auditLogger.error('property_management', 'extract_property_id_error', error as Error, { url });
    return null;
  }
}

/**
 * Force browser cache invalidation for property images
 * Useful after uploads or updates
 */
export function invalidatePropertyImageCache(propertyId: string): void {
  auditLogger.info('property_management', 'invalidate_image_cache', {
    propertyId,
    timestamp: Date.now(),
  });
  
  // Clear any cached image URLs for this property
  // This is a client-side operation that forces new URLs to be generated
  sessionStorage.removeItem(`property_images_${propertyId}`);
}

/**
 * Get cached image URLs for a property (if available and not expired)
 */
export function getCachedImageUrls(propertyId: string): string[] | null {
  try {
    const cached = sessionStorage.getItem(`property_images_${propertyId}`);
    if (!cached) return null;
    
    const { urls, timestamp } = JSON.parse(cached);
    const age = Date.now() - timestamp;
    
    // Cache expires after 5 minutes
    if (age > 5 * 60 * 1000) {
      sessionStorage.removeItem(`property_images_${propertyId}`);
      return null;
    }
    
    return urls;
  } catch (error) {
    auditLogger.error('property_management', 'get_cached_urls_error', error as Error, { propertyId });
    return null;
  }
}

/**
 * Cache image URLs for a property
 */
export function cacheImageUrls(propertyId: string, urls: string[]): void {
  try {
    sessionStorage.setItem(`property_images_${propertyId}`, JSON.stringify({
      urls,
      timestamp: Date.now(),
    }));
  } catch (error) {
    auditLogger.error('property_management', 'cache_urls_error', error as Error, { propertyId });
  }
}

