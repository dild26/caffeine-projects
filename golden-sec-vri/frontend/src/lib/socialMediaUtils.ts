/**
 * Extracts clean domain name from any URL to match backend logic
 * Removes protocols, www, ports, paths, queries, and symbols
 * Returns only the main domain part (e.g., "facebook", "telegram", "refresh")
 * @param url - Full URL string
 * @returns Clean domain name (lowercase)
 */
export function extractDomain(url: string): string {
  try {
    // Remove protocol (http:// or https://)
    let cleanUrl = url.replace(/^https?:\/\//, '');
    
    // Remove www. prefix
    cleanUrl = cleanUrl.replace(/^www\./, '');
    
    // Split by / to get domain part only (removes paths and everything after)
    const domainPart = cleanUrl.split('/')[0];
    
    // Split by ? to remove query strings
    const domainWithoutQuery = domainPart.split('?')[0];
    
    // Split by # to remove fragments
    const domainWithoutFragment = domainWithoutQuery.split('#')[0];
    
    // Remove port if present (e.g., :8080)
    const domainWithoutPort = domainWithoutFragment.split(':')[0];
    
    // Split by dots to get domain parts
    const parts = domainWithoutPort.split('.');
    
    // Get the second-to-last part (main domain name)
    // For "facebook.com" → "facebook"
    // For "t.me" → "t"
    // For "refresh.me" → "refresh"
    if (parts.length >= 2) {
      return parts[parts.length - 2].toLowerCase();
    }
    
    // Fallback to the whole domain if only one part
    return domainWithoutPort.toLowerCase();
  } catch (error) {
    console.error('Error extracting domain:', error);
    return url.toLowerCase();
  }
}

/**
 * Generates platform name with first character capitalized
 * Matches backend's capitalizeFirstChar function
 * @param domain - Clean domain name (lowercase)
 * @returns Capitalized platform name (e.g., "Facebook", "Telegram", "Refresh")
 */
export function getPlatformName(domain: string): string {
  if (!domain || domain.length === 0) {
    return domain;
  }
  
  const cleanDomain = domain.toLowerCase();
  return cleanDomain.charAt(0).toUpperCase() + cleanDomain.slice(1);
}

/**
 * Gets platform icon URL using local assets first, then Clearbit with fallback
 * @param iconName - Clean domain name from backend (lowercase, e.g., "facebook", "refresh")
 * @returns Icon URL
 */
export function getPlatformIcon(iconName: string): string {
  const cleanDomain = iconName.toLowerCase();
  
  // Map of known platforms to local asset icons
  const localIconMap: Record<string, string> = {
    'facebook': '/assets/generated/facebook-icon-transparent.dim_64x64.png',
    'linkedin': '/assets/generated/linkedin-icon-transparent.dim_64x64.png',
    'telegram': '/assets/generated/telegram-icon-transparent.dim_64x64.png',
    't': '/assets/generated/telegram-icon-transparent.dim_64x64.png',
    'discord': '/assets/generated/discord-icon-transparent.dim_64x64.png',
    'blogspot': '/assets/generated/blogspot-icon-transparent.dim_64x64.png',
    'instagram': '/assets/generated/instagram-icon-transparent.dim_64x64.png',
    'twitter': '/assets/generated/twitter-icon-transparent.dim_64x64.png',
    'x': '/assets/generated/twitter-icon-transparent.dim_64x64.png',
    'youtube': '/assets/generated/youtube-icon-transparent.dim_64x64.png',
  };
  
  // Return local asset if available
  if (localIconMap[cleanDomain]) {
    return localIconMap[cleanDomain];
  }
  
  // For unknown platforms, construct full domain for external services
  // Use Clearbit logo API which provides high-quality logos
  const fullDomain = `${cleanDomain}.com`;
  return `https://logo.clearbit.com/${fullDomain}`;
}

/**
 * Gets fallback icon URL for error cases
 * @returns Default contact icon URL
 */
export function getFallbackIcon(): string {
  return '/assets/generated/contact-us-icon-transparent.dim_64x64.png';
}

/**
 * Preview what the backend will extract from a URL
 * Useful for showing users what will be auto-filled
 * @param url - Full URL string
 * @returns Object with extracted domain, platform name, and icon name
 */
export function previewDomainExtraction(url: string): {
  domain: string;
  platformName: string;
  iconName: string;
} {
  const domain = extractDomain(url);
  const platformName = getPlatformName(domain);
  const iconName = domain;
  
  return {
    domain,
    platformName,
    iconName,
  };
}
