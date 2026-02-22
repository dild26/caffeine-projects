/**
 * IPFS backup system utilities
 * Manages incremental backups, manifests, and IPFS node integration
 */

import type { IPFSBackupManifest, IPFSNode, IPFSBackupJob } from '../types';

const IPFS_MANIFEST_STORAGE_KEY = 'ipfsBackupManifests';
const IPFS_NODE_STORAGE_KEY = 'ipfsNodes';
const IPFS_JOB_STORAGE_KEY = 'ipfsBackupJobs';

// Store IPFS backup manifest
export function storeIPFSManifest(manifest: IPFSBackupManifest): void {
  try {
    const stored = JSON.parse(localStorage.getItem(IPFS_MANIFEST_STORAGE_KEY) || '[]');
    stored.push({
      ...manifest,
      timestamp: manifest.timestamp.toString(),
      fileCount: manifest.fileCount.toString(),
      size: manifest.size.toString(),
    });
    localStorage.setItem(IPFS_MANIFEST_STORAGE_KEY, JSON.stringify(stored));
  } catch (error) {
    console.error('Failed to store IPFS manifest:', error);
  }
}

// Get all IPFS manifests
export function getIPFSManifests(): IPFSBackupManifest[] {
  try {
    const stored = JSON.parse(localStorage.getItem(IPFS_MANIFEST_STORAGE_KEY) || '[]');
    return stored.map((m: any) => ({
      ...m,
      timestamp: BigInt(m.timestamp),
      fileCount: BigInt(m.fileCount),
      size: BigInt(m.size),
    }));
  } catch (error) {
    console.error('Failed to get IPFS manifests:', error);
    return [];
  }
}

// Get IPFS backup statistics
export function getIPFSBackupStatistics() {
  const manifests = getIPFSManifests();
  const total = manifests.length;
  const incremental = manifests.filter(m => m.type === 'incremental').length;
  const full = manifests.filter(m => m.type === 'full').length;
  const pinned = manifests.filter(m => m.pinStatus === 'pinned').length;
  const verified = manifests.filter(m => m.verificationStatus === 'verified').length;
  
  const totalSize = manifests.reduce((sum, m) => sum + Number(m.size), 0);
  const totalFiles = manifests.reduce((sum, m) => sum + Number(m.fileCount), 0);
  
  return {
    total,
    incremental,
    full,
    pinned,
    verified,
    totalSize,
    totalFiles,
    pinRate: total > 0 ? (pinned / total) * 100 : 0,
    verificationRate: total > 0 ? (verified / total) * 100 : 0,
  };
}

// Store IPFS node
export function storeIPFSNode(node: IPFSNode): void {
  try {
    const stored = JSON.parse(localStorage.getItem(IPFS_NODE_STORAGE_KEY) || '[]');
    const index = stored.findIndex((n: any) => n.id === node.id);
    const nodeData = {
      ...node,
      lastHealthCheck: node.lastHealthCheck.toString(),
      pinnedCount: node.pinnedCount.toString(),
      availableSpace: node.availableSpace.toString(),
    };
    
    if (index !== -1) {
      stored[index] = nodeData;
    } else {
      stored.push(nodeData);
    }
    localStorage.setItem(IPFS_NODE_STORAGE_KEY, JSON.stringify(stored));
  } catch (error) {
    console.error('Failed to store IPFS node:', error);
  }
}

// Get all IPFS nodes
export function getIPFSNodes(): IPFSNode[] {
  try {
    const stored = JSON.parse(localStorage.getItem(IPFS_NODE_STORAGE_KEY) || '[]');
    return stored.map((n: any) => ({
      ...n,
      lastHealthCheck: BigInt(n.lastHealthCheck),
      pinnedCount: BigInt(n.pinnedCount),
      availableSpace: BigInt(n.availableSpace),
    }));
  } catch (error) {
    console.error('Failed to get IPFS nodes:', error);
    return [];
  }
}

// Store IPFS backup job
export function storeIPFSJob(job: IPFSBackupJob): void {
  try {
    const stored = JSON.parse(localStorage.getItem(IPFS_JOB_STORAGE_KEY) || '[]');
    const index = stored.findIndex((j: any) => j.id === job.id);
    const jobData = {
      ...job,
      startedAt: job.startedAt.toString(),
      completedAt: job.completedAt?.toString(),
      filesProcessed: job.filesProcessed.toString(),
      totalFiles: job.totalFiles.toString(),
      bytesUploaded: job.bytesUploaded.toString(),
      totalBytes: job.totalBytes.toString(),
    };
    
    if (index !== -1) {
      stored[index] = jobData;
    } else {
      stored.push(jobData);
    }
    localStorage.setItem(IPFS_JOB_STORAGE_KEY, JSON.stringify(stored));
  } catch (error) {
    console.error('Failed to store IPFS job:', error);
  }
}

// Get all IPFS backup jobs
export function getIPFSJobs(): IPFSBackupJob[] {
  try {
    const stored = JSON.parse(localStorage.getItem(IPFS_JOB_STORAGE_KEY) || '[]');
    return stored.map((j: any) => ({
      ...j,
      startedAt: BigInt(j.startedAt),
      completedAt: j.completedAt ? BigInt(j.completedAt) : undefined,
      filesProcessed: BigInt(j.filesProcessed),
      totalFiles: BigInt(j.totalFiles),
      bytesUploaded: BigInt(j.bytesUploaded),
      totalBytes: BigInt(j.totalBytes),
    }));
  } catch (error) {
    console.error('Failed to get IPFS jobs:', error);
    return [];
  }
}

// Create incremental IPFS backup
export async function createIncrementalIPFSBackup(
  files: Array<{ id: string; name: string; checksum: string; size: number }>,
  previousMerkleRoot?: string
): Promise<IPFSBackupManifest> {
  const jobId = `ipfs_job_${Date.now()}_${Math.random().toString(36).substring(7)}`;
  const totalFiles = BigInt(files.length);
  const totalBytes = BigInt(files.reduce((sum, f) => sum + f.size, 0));
  
  // Create job
  const job: IPFSBackupJob = {
    id: jobId,
    status: 'running',
    progress: 0,
    startedAt: BigInt(Date.now() * 1000000),
    filesProcessed: BigInt(0),
    totalFiles,
    bytesUploaded: BigInt(0),
    totalBytes,
  };
  storeIPFSJob(job);
  
  // Simulate IPFS upload with progress
  const ipfsHashes: string[] = [];
  for (let i = 0; i < files.length; i++) {
    await new Promise(resolve => setTimeout(resolve, 50));
    const hash = `Qm${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`;
    ipfsHashes.push(hash);
    
    job.filesProcessed = BigInt(i + 1);
    job.bytesUploaded = BigInt(files.slice(0, i + 1).reduce((sum, f) => sum + f.size, 0));
    job.progress = Math.round(((i + 1) / files.length) * 100);
    storeIPFSJob(job);
  }
  
  // Complete job
  job.status = 'completed';
  job.completedAt = BigInt(Date.now() * 1000000);
  job.progress = 100;
  storeIPFSJob(job);
  
  // Create manifest
  const manifest: IPFSBackupManifest = {
    id: `ipfs_manifest_${Date.now()}_${Math.random().toString(36).substring(7)}`,
    timestamp: BigInt(Date.now() * 1000000),
    nonce: `nonce_${Date.now()}`,
    merkleRoot: `merkle_${Math.random().toString(36).substring(2, 15)}`,
    previousMerkleRoot,
    type: 'incremental',
    fileCount: totalFiles,
    size: totalBytes,
    ipfsHashes,
    pinStatus: 'pinned',
    verificationStatus: 'verified',
    metadata: [
      ['jobId', jobId],
      ['filesCount', files.length.toString()],
    ],
  };
  
  storeIPFSManifest(manifest);
  return manifest;
}

// Verify IPFS pins
export async function verifyIPFSPins(manifestId: string): Promise<boolean> {
  const manifests = getIPFSManifests();
  const manifest = manifests.find(m => m.id === manifestId);
  
  if (!manifest) {
    throw new Error('Manifest not found');
  }
  
  // Simulate pin verification
  await new Promise(resolve => setTimeout(resolve, 500));
  
  return manifest.pinStatus === 'pinned';
}

// Initialize default IPFS nodes
export function initializeDefaultIPFSNodes(): void {
  const existingNodes = getIPFSNodes();
  if (existingNodes.length === 0) {
    const defaultNodes: IPFSNode[] = [
      {
        id: 'node_1',
        address: '/ip4/104.131.131.82/tcp/4001/p2p/QmaCpDMGvV2BGHeYERUEnRQAwe3N8SzbUtfsmvsqQLuvuJ',
        status: 'online',
        lastHealthCheck: BigInt(Date.now() * 1000000),
        pinnedCount: BigInt(0),
        availableSpace: BigInt(1000000000000), // 1TB
        responseTime: 45,
      },
      {
        id: 'node_2',
        address: '/ip4/104.236.179.241/tcp/4001/p2p/QmSoLPppuBtQSGwKDZT2M73ULpjvfd3aZ6ha4oFGL1KrGM',
        status: 'online',
        lastHealthCheck: BigInt(Date.now() * 1000000),
        pinnedCount: BigInt(0),
        availableSpace: BigInt(2000000000000), // 2TB
        responseTime: 52,
      },
      {
        id: 'node_3',
        address: '/ip4/178.62.158.247/tcp/4001/p2p/QmSoLer265NRgSp2LA3dPaeykiS1J6DifTC88f5uVQKNAd',
        status: 'online',
        lastHealthCheck: BigInt(Date.now() * 1000000),
        pinnedCount: BigInt(0),
        availableSpace: BigInt(1500000000000), // 1.5TB
        responseTime: 38,
      },
    ];
    
    defaultNodes.forEach(node => storeIPFSNode(node));
  }
}

// Clear all IPFS data
export function clearIPFSData(): void {
  try {
    localStorage.removeItem(IPFS_MANIFEST_STORAGE_KEY);
    localStorage.removeItem(IPFS_NODE_STORAGE_KEY);
    localStorage.removeItem(IPFS_JOB_STORAGE_KEY);
  } catch (error) {
    console.error('Failed to clear IPFS data:', error);
  }
}
