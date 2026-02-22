/**
 * Secure Backup Vault with Multi-Tier Redundancy
 * Implements encrypted storage with primary, secondary, and tertiary replicas
 */

const VAULT_KEY_STORAGE = 'vault_encryption_key';
const BACKUP_MANIFEST_KEY = 'backup_manifests';
const REPLICA_INDEX_KEY = 'replica_index';

// Generate or retrieve vault encryption key
function getVaultKey(): string {
  let key = localStorage.getItem(VAULT_KEY_STORAGE);
  if (!key) {
    // Generate a new key (in production, this should come from environment or secure key management)
    key = Array.from(crypto.getRandomValues(new Uint8Array(32)))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
    localStorage.setItem(VAULT_KEY_STORAGE, key);
  }
  return key;
}

// Simple XOR encryption (for demonstration; use proper encryption in production)
async function encryptData(data: Uint8Array, key: string): Promise<Uint8Array> {
  const keyBytes = new TextEncoder().encode(key);
  const encrypted = new Uint8Array(data.length);
  
  for (let i = 0; i < data.length; i++) {
    encrypted[i] = data[i] ^ keyBytes[i % keyBytes.length];
  }
  
  return encrypted;
}

async function decryptData(data: Uint8Array, key: string): Promise<Uint8Array> {
  // XOR encryption is symmetric
  return encryptData(data, key);
}

// Compress data using native CompressionStream API
async function compressData(data: Uint8Array): Promise<Uint8Array> {
  try {
    // Use native compression if available
    if (typeof CompressionStream !== 'undefined') {
      // Create a proper copy to satisfy TypeScript
      const dataCopy = new Uint8Array(data);
      const stream = new Blob([dataCopy]).stream();
      const compressedStream = stream.pipeThrough(new CompressionStream('gzip'));
      const compressedBlob = await new Response(compressedStream).blob();
      const arrayBuffer = await compressedBlob.arrayBuffer();
      return new Uint8Array(arrayBuffer);
    }
    // Fallback: return original data if compression not available
    return data;
  } catch (error) {
    console.warn('Compression failed, using uncompressed data:', error);
    return data;
  }
}

// Decompress data using native DecompressionStream API
async function decompressData(data: Uint8Array): Promise<Uint8Array> {
  try {
    // Use native decompression if available
    if (typeof DecompressionStream !== 'undefined') {
      // Create a proper copy to satisfy TypeScript
      const dataCopy = new Uint8Array(data);
      const stream = new Blob([dataCopy]).stream();
      const decompressedStream = stream.pipeThrough(new DecompressionStream('gzip'));
      const decompressedBlob = await new Response(decompressedStream).blob();
      const arrayBuffer = await decompressedBlob.arrayBuffer();
      return new Uint8Array(arrayBuffer);
    }
    // Fallback: return original data if decompression not available
    return data;
  } catch (error) {
    console.warn('Decompression failed, using original data:', error);
    return data;
  }
}

// Calculate SHA-256 checksum
async function calculateChecksum(data: Uint8Array): Promise<string> {
  // Create a proper ArrayBuffer copy to satisfy TypeScript
  const buffer = new Uint8Array(data).buffer;
  const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

export interface ReplicaLocation {
  type: 'indexeddb' | 'localstorage' | 'server';
  path: string;
  checksum: string;
  size: number;
  encrypted: boolean;
  compressed: boolean;
  createdAt: number;
}

export interface BackupVaultEntry {
  fileId: string;
  fileName: string;
  originalSize: number;
  replicas: ReplicaLocation[];
  primaryChecksum: string;
  createdAt: number;
  lastVerified: number;
  status: 'healthy' | 'degraded' | 'critical';
}

// Store data with triple redundancy
export async function storeWithRedundancy(
  fileId: string,
  fileName: string,
  data: Uint8Array,
  options: {
    compress?: boolean;
    encrypt?: boolean;
    replicaCount?: number;
  } = {}
): Promise<BackupVaultEntry> {
  const {
    compress = true,
    encrypt = true,
    replicaCount = 3
  } = options;

  const vaultKey = getVaultKey();
  const originalSize = data.length;
  const primaryChecksum = await calculateChecksum(data);
  
  let processedData = data;
  
  // Compress if enabled
  if (compress) {
    processedData = await compressData(processedData);
  }
  
  // Encrypt if enabled
  if (encrypt) {
    processedData = await encryptData(processedData, vaultKey);
  }
  
  const replicas: ReplicaLocation[] = [];
  const timestamp = Date.now();
  
  // Primary replica: IndexedDB
  if (replicaCount >= 1) {
    try {
      await storeInIndexedDB(fileId, processedData);
      replicas.push({
        type: 'indexeddb',
        path: `indexeddb://vault/${fileId}`,
        checksum: await calculateChecksum(processedData),
        size: processedData.length,
        encrypted: encrypt,
        compressed: compress,
        createdAt: timestamp,
      });
    } catch (error) {
      console.error('Failed to store primary replica:', error);
    }
  }
  
  // Secondary replica: localStorage (for smaller files)
  if (replicaCount >= 2 && processedData.length < 5 * 1024 * 1024) {
    try {
      const base64Data = btoa(String.fromCharCode(...processedData));
      localStorage.setItem(`vault_replica_${fileId}`, base64Data);
      replicas.push({
        type: 'localstorage',
        path: `localstorage://vault_replica_${fileId}`,
        checksum: await calculateChecksum(processedData),
        size: processedData.length,
        encrypted: encrypt,
        compressed: compress,
        createdAt: timestamp,
      });
    } catch (error) {
      console.error('Failed to store secondary replica:', error);
    }
  }
  
  // Tertiary replica: Server backup (simulated)
  if (replicaCount >= 3) {
    try {
      // In production, this would upload to backend canister
      sessionStorage.setItem(`vault_server_${fileId}`, btoa(String.fromCharCode(...processedData)));
      replicas.push({
        type: 'server',
        path: `server://backup/${fileId}`,
        checksum: await calculateChecksum(processedData),
        size: processedData.length,
        encrypted: encrypt,
        compressed: compress,
        createdAt: timestamp,
      });
    } catch (error) {
      console.error('Failed to store tertiary replica:', error);
    }
  }
  
  const entry: BackupVaultEntry = {
    fileId,
    fileName,
    originalSize,
    replicas,
    primaryChecksum,
    createdAt: timestamp,
    lastVerified: timestamp,
    status: replicas.length >= 2 ? 'healthy' : replicas.length === 1 ? 'degraded' : 'critical',
  };
  
  // Update replica index
  updateReplicaIndex(entry);
  
  return entry;
}

// Retrieve data with automatic healing
export async function retrieveWithHealing(fileId: string): Promise<Uint8Array | null> {
  const entry = getReplicaEntry(fileId);
  if (!entry) return null;
  
  const vaultKey = getVaultKey();
  let processedData: Uint8Array | null = null;
  let successfulReplica: ReplicaLocation | null = null;
  
  // Try each replica in order
  for (const replica of entry.replicas) {
    try {
      let data: Uint8Array | null = null;
      
      if (replica.type === 'indexeddb') {
        data = await retrieveFromIndexedDB(fileId);
      } else if (replica.type === 'localstorage') {
        const base64Data = localStorage.getItem(`vault_replica_${fileId}`);
        if (base64Data) {
          const binaryString = atob(base64Data);
          data = new Uint8Array(binaryString.length);
          for (let i = 0; i < binaryString.length; i++) {
            data[i] = binaryString.charCodeAt(i);
          }
        }
      } else if (replica.type === 'server') {
        const base64Data = sessionStorage.getItem(`vault_server_${fileId}`);
        if (base64Data) {
          const binaryString = atob(base64Data);
          data = new Uint8Array(binaryString.length);
          for (let i = 0; i < binaryString.length; i++) {
            data[i] = binaryString.charCodeAt(i);
          }
        }
      }
      
      if (data) {
        // Verify checksum
        const checksum = await calculateChecksum(data);
        if (checksum === replica.checksum) {
          processedData = data;
          successfulReplica = replica;
          break;
        }
      }
    } catch (error) {
      console.error(`Failed to retrieve from ${replica.type}:`, error);
    }
  }
  
  if (!processedData) return null;
  
  // Decrypt if needed
  if (successfulReplica?.encrypted) {
    processedData = await decryptData(processedData, vaultKey);
  }
  
  // Decompress if needed
  if (successfulReplica?.compressed) {
    processedData = await decompressData(processedData);
  }
  
  // Verify final checksum
  const finalChecksum = await calculateChecksum(processedData);
  if (finalChecksum !== entry.primaryChecksum) {
    console.error('Final checksum mismatch after decryption/decompression');
    return null;
  }
  
  // Auto-heal missing replicas
  await healMissingReplicas(entry, processedData);
  
  return processedData;
}

// Verify replica integrity
export async function verifyReplicaIntegrity(fileId: string): Promise<{
  healthy: boolean;
  replicas: Array<{ type: string; status: 'healthy' | 'corrupted' | 'missing' }>;
}> {
  const entry = getReplicaEntry(fileId);
  if (!entry) {
    return { healthy: false, replicas: [] };
  }
  
  const results: Array<{ type: string; status: 'healthy' | 'corrupted' | 'missing' }> = [];
  
  for (const replica of entry.replicas) {
    try {
      let data: Uint8Array | null = null;
      
      if (replica.type === 'indexeddb') {
        data = await retrieveFromIndexedDB(fileId);
      } else if (replica.type === 'localstorage') {
        const base64Data = localStorage.getItem(`vault_replica_${fileId}`);
        if (base64Data) {
          const binaryString = atob(base64Data);
          data = new Uint8Array(binaryString.length);
          for (let i = 0; i < binaryString.length; i++) {
            data[i] = binaryString.charCodeAt(i);
          }
        }
      } else if (replica.type === 'server') {
        const base64Data = sessionStorage.getItem(`vault_server_${fileId}`);
        if (base64Data) {
          const binaryString = atob(base64Data);
          data = new Uint8Array(binaryString.length);
          for (let i = 0; i < binaryString.length; i++) {
            data[i] = binaryString.charCodeAt(i);
          }
        }
      }
      
      if (!data) {
        results.push({ type: replica.type, status: 'missing' });
      } else {
        const checksum = await calculateChecksum(data);
        if (checksum === replica.checksum) {
          results.push({ type: replica.type, status: 'healthy' });
        } else {
          results.push({ type: replica.type, status: 'corrupted' });
        }
      }
    } catch (error) {
      results.push({ type: replica.type, status: 'missing' });
    }
  }
  
  const healthy = results.some(r => r.status === 'healthy');
  return { healthy, replicas: results };
}

// Heal missing or corrupted replicas
async function healMissingReplicas(entry: BackupVaultEntry, data: Uint8Array): Promise<void> {
  const vaultKey = getVaultKey();
  let processedData = data;
  
  // Re-compress and encrypt
  const shouldCompress = entry.replicas[0]?.compressed || false;
  const shouldEncrypt = entry.replicas[0]?.encrypted || false;
  
  if (shouldCompress) {
    processedData = await compressData(processedData);
  }
  
  if (shouldEncrypt) {
    processedData = await encryptData(processedData, vaultKey);
  }
  
  // Check and heal each replica type
  const hasIndexedDB = entry.replicas.some(r => r.type === 'indexeddb');
  const hasLocalStorage = entry.replicas.some(r => r.type === 'localstorage');
  const hasServer = entry.replicas.some(r => r.type === 'server');
  
  if (!hasIndexedDB) {
    try {
      await storeInIndexedDB(entry.fileId, processedData);
      console.log(`Healed IndexedDB replica for ${entry.fileName}`);
    } catch (error) {
      console.error('Failed to heal IndexedDB replica:', error);
    }
  }
  
  if (!hasLocalStorage && processedData.length < 5 * 1024 * 1024) {
    try {
      const base64Data = btoa(String.fromCharCode(...processedData));
      localStorage.setItem(`vault_replica_${entry.fileId}`, base64Data);
      console.log(`Healed localStorage replica for ${entry.fileName}`);
    } catch (error) {
      console.error('Failed to heal localStorage replica:', error);
    }
  }
  
  if (!hasServer) {
    try {
      sessionStorage.setItem(`vault_server_${entry.fileId}`, btoa(String.fromCharCode(...processedData)));
      console.log(`Healed server replica for ${entry.fileName}`);
    } catch (error) {
      console.error('Failed to heal server replica:', error);
    }
  }
}

// IndexedDB helpers
const DB_NAME = 'BackupVaultDB';
const DB_VERSION = 1;
const VAULT_STORE = 'vault';

async function openVaultDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
    
    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(VAULT_STORE)) {
        db.createObjectStore(VAULT_STORE);
      }
    };
  });
}

async function storeInIndexedDB(fileId: string, data: Uint8Array): Promise<void> {
  const db = await openVaultDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([VAULT_STORE], 'readwrite');
    const store = transaction.objectStore(VAULT_STORE);
    const request = store.put(data, fileId);
    
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve();
  });
}

async function retrieveFromIndexedDB(fileId: string): Promise<Uint8Array | null> {
  const db = await openVaultDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([VAULT_STORE], 'readonly');
    const store = transaction.objectStore(VAULT_STORE);
    const request = store.get(fileId);
    
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result || null);
  });
}

// Replica index management
function updateReplicaIndex(entry: BackupVaultEntry): void {
  try {
    const indexStr = localStorage.getItem(REPLICA_INDEX_KEY) || '{}';
    const index = JSON.parse(indexStr);
    index[entry.fileId] = {
      ...entry,
      replicas: entry.replicas.map(r => ({ ...r })),
    };
    localStorage.setItem(REPLICA_INDEX_KEY, JSON.stringify(index));
  } catch (error) {
    console.error('Failed to update replica index:', error);
  }
}

function getReplicaEntry(fileId: string): BackupVaultEntry | null {
  try {
    const indexStr = localStorage.getItem(REPLICA_INDEX_KEY) || '{}';
    const index = JSON.parse(indexStr);
    return index[fileId] || null;
  } catch (error) {
    console.error('Failed to get replica entry:', error);
    return null;
  }
}

export function getAllReplicaEntries(): BackupVaultEntry[] {
  try {
    const indexStr = localStorage.getItem(REPLICA_INDEX_KEY) || '{}';
    const index = JSON.parse(indexStr);
    return Object.values(index);
  } catch (error) {
    console.error('Failed to get all replica entries:', error);
    return [];
  }
}

