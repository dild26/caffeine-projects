/**
 * Generate a hash-based identifier for a domain (similar to Merkle root concept)
 * This ensures tamper-proof tracking and secure identification
 */
export function getDomainHash(domain: string): string {
  // Simple hash function for demonstration
  // In production, you might use a more sophisticated algorithm
  let hash = 0;
  const str = `${domain}-moap-secure-hash`;
  
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  
  // Convert to hex and pad
  const hexHash = Math.abs(hash).toString(16).padStart(8, '0');
  
  // Format as a Merkle-like hash
  return `0x${hexHash}${domain.length.toString(16).padStart(4, '0')}`;
}
