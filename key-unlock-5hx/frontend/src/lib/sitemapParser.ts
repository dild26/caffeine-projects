import { getDomainHash } from './domainHash';

export interface ParsedSitemapUrl {
  loc: string;
  lastmod?: string;
  changefreq?: string;
  priority?: string;
}

export interface SitemapImportResult {
  urls: ParsedSitemapUrl[];
  hash: string;
  timestamp: number;
  appName: string;
}

/**
 * Parses XML sitemap content and extracts all <loc> URLs
 * Also supports plain text format (one URL per line)
 * Robust error handling for malformed XML
 */
export function parseSitemapXML(xmlContent: string, appName: string): SitemapImportResult {
  try {
    // Check if content is plain text (not XML)
    const trimmedContent = xmlContent.trim();
    if (!trimmedContent.startsWith('<?xml') && !trimmedContent.startsWith('<urlset') && !trimmedContent.startsWith('<sitemapindex')) {
      // Parse as plain text URLs (one per line)
      return parsePlainTextUrls(xmlContent, appName);
    }

    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlContent, 'text/xml');
    
    // Check for parsing errors
    const parserError = xmlDoc.querySelector('parsererror');
    if (parserError) {
      throw new Error('Invalid XML format: Unable to parse sitemap content');
    }
    
    // Extract all <url> elements (standard sitemap format)
    let urlElements = xmlDoc.querySelectorAll('url');
    
    // If no <url> elements found, try to extract <loc> directly (alternative format)
    if (urlElements.length === 0) {
      const locElements = xmlDoc.querySelectorAll('loc');
      if (locElements.length > 0) {
        // Create pseudo-url elements for consistent processing
        const urls: ParsedSitemapUrl[] = [];
        locElements.forEach((locElement) => {
          const loc = locElement.textContent?.trim();
          if (loc) {
            urls.push({ loc });
          }
        });
        
        if (urls.length === 0) {
          throw new Error('No valid URLs found in sitemap');
        }
        
        const urlsString = urls.map(u => u.loc).join('|');
        const hash = getDomainHash(urlsString + appName);
        
        return {
          urls,
          hash,
          timestamp: Date.now(),
          appName,
        };
      }
      
      throw new Error('No URLs found in sitemap. Expected <url> or <loc> elements.');
    }
    
    const urls: ParsedSitemapUrl[] = [];
    
    urlElements.forEach((urlElement) => {
      try {
        const loc = urlElement.querySelector('loc')?.textContent?.trim();
        
        // Only add if <loc> exists and is not empty
        if (loc) {
          const lastmod = urlElement.querySelector('lastmod')?.textContent?.trim();
          const changefreq = urlElement.querySelector('changefreq')?.textContent?.trim();
          const priority = urlElement.querySelector('priority')?.textContent?.trim();
          
          urls.push({
            loc,
            lastmod: lastmod || undefined,
            changefreq: changefreq || undefined,
            priority: priority || undefined,
          });
        }
      } catch (error) {
        // Skip malformed entries but continue processing
        console.warn('Skipping malformed sitemap entry:', error);
      }
    });
    
    if (urls.length === 0) {
      throw new Error('No valid URLs found in sitemap');
    }
    
    // Generate Merkle root hash for integrity verification
    const urlsString = urls.map(u => u.loc).join('|');
    const hash = getDomainHash(urlsString + appName);
    
    return {
      urls,
      hash,
      timestamp: Date.now(),
      appName,
    };
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Failed to parse sitemap XML');
  }
}

/**
 * Parses plain text URLs (one per line)
 * Supports multiline text input
 */
function parsePlainTextUrls(textContent: string, appName: string): SitemapImportResult {
  const lines = textContent.split('\n').map(line => line.trim()).filter(Boolean);
  const urls: ParsedSitemapUrl[] = [];

  for (const line of lines) {
    // Skip comments and empty lines
    if (line.startsWith('#') || line.startsWith('//')) continue;

    // Basic URL validation
    if (line.startsWith('http://') || line.startsWith('https://') || line.startsWith('/')) {
      urls.push({ loc: line });
    }
  }

  if (urls.length === 0) {
    throw new Error('No valid URLs found in plain text. Each line should contain a URL starting with http://, https://, or /');
  }

  const urlsString = urls.map(u => u.loc).join('|');
  const hash = getDomainHash(urlsString + appName);

  return {
    urls,
    hash,
    timestamp: Date.now(),
    appName,
  };
}

/**
 * Fetches and parses a sitemap from a URL with comprehensive error handling
 */
export async function fetchAndParseSitemap(sitemapUrl: string, appName: string): Promise<SitemapImportResult> {
  try {
    // Validate URL format
    try {
      new URL(sitemapUrl);
    } catch {
      throw new Error('Invalid URL format. Please enter a valid sitemap URL.');
    }
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout
    
    let response: Response;
    try {
      response = await fetch(sitemapUrl, {
        signal: controller.signal,
        mode: 'cors',
        headers: {
          'Accept': 'application/xml, text/xml, text/plain, */*',
        },
      });
    } catch (fetchError: any) {
      clearTimeout(timeoutId);
      
      if (fetchError.name === 'AbortError') {
        throw new Error('Request timeout: The sitemap took too long to load. Please try again.');
      }
      
      if (fetchError.message?.includes('CORS')) {
        throw new Error('CORS Error: The sitemap server does not allow cross-origin requests. Try downloading the sitemap and pasting the XML content instead.');
      }
      
      if (fetchError.message?.includes('Failed to fetch')) {
        throw new Error('Network Error: Unable to reach the sitemap URL. Please check your internet connection and the URL.');
      }
      
      throw new Error(`Network Error: ${fetchError.message || 'Failed to fetch sitemap'}`);
    }
    
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('Sitemap not found (404). Please verify the URL is correct.');
      }
      if (response.status === 403) {
        throw new Error('Access forbidden (403). The server denied access to the sitemap.');
      }
      if (response.status === 500) {
        throw new Error('Server error (500). The sitemap server is experiencing issues.');
      }
      throw new Error(`HTTP Error ${response.status}: ${response.statusText}`);
    }
    
    const contentType = response.headers.get('content-type');
    if (contentType && !contentType.includes('xml') && !contentType.includes('text')) {
      console.warn('Warning: Response content-type is not XML:', contentType);
    }
    
    const xmlContent = await response.text();
    
    if (!xmlContent || xmlContent.trim().length === 0) {
      throw new Error('Empty response: The sitemap URL returned no content.');
    }
    
    return parseSitemapXML(xmlContent, appName);
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Failed to fetch and parse sitemap');
  }
}

/**
 * Converts a parsed sitemap URL to a menu item format
 * Uses string/number types only to avoid BigInt serialization issues
 */
export function convertToMenuItem(url: ParsedSitemapUrl, appName: string, index: number) {
  // Extract path from full URL
  let path = url.loc;
  try {
    const urlObj = new URL(url.loc);
    path = urlObj.pathname;
  } catch {
    // If not a full URL, use as-is
  }
  
  // Generate a readable label from the path
  const label = path
    .split('/')
    .filter(Boolean)
    .pop()
    ?.replace(/-/g, ' ')
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (l) => l.toUpperCase()) || 'Home';
  
  return {
    id: `${appName.toLowerCase().replace(/\s+/g, '-')}-imported-${index}`,
    menuLabel: label,
    path,
    url: url.loc,
    adminOnly: false,
    order: 1000 + index, // Use number instead of BigInt
    isExternal: true,
    hash: getDomainHash(url.loc),
    lastmod: url.lastmod,
    changefreq: url.changefreq,
    priority: url.priority,
  };
}

/**
 * Validates sitemap integrity using hash verification
 */
export function verifySitemapIntegrity(
  importResult: SitemapImportResult,
  storedHash: string
): boolean {
  return importResult.hash === storedHash;
}

/**
 * Sample sitemap XML for testing
 */
export const SAMPLE_SECOIN_SITEMAP = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://secoin.app/</loc>
    <lastmod>2025-01-15</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://secoin.app/about</loc>
    <lastmod>2025-01-15</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://secoin.app/features</loc>
    <lastmod>2025-01-15</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://secoin.app/pricing</loc>
    <lastmod>2025-01-15</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>https://secoin.app/blog</loc>
    <lastmod>2025-01-15</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>https://secoin.app/contact</loc>
    <lastmod>2025-01-15</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>
</urlset>`;

