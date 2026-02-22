export function maskHash(hash: string): string {
  if (!hash || hash.length <= 8) {
    return hash;
  }
  
  const first4 = hash.slice(0, 4);
  const last4 = hash.slice(-4);
  
  return `${first4}****${last4}`;
}
