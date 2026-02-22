/**
 * Server-side post-write verification utilities
 * Manages verification results, quarantine operations, and recovery
 */

import type { PostWriteVerificationResult, QuarantinedFile } from '../types';

const VERIFICATION_STORAGE_KEY = 'postWriteVerificationResults';
const QUARANTINE_STORAGE_KEY = 'quarantinedFiles';

// Store verification result
export function storeVerificationResult(result: PostWriteVerificationResult): void {
  try {
    const stored = JSON.parse(localStorage.getItem(VERIFICATION_STORAGE_KEY) || '[]');
    stored.push({
      ...result,
      timestamp: result.timestamp.toString(),
      size: result.size.toString(),
    });
    // Keep only last 1000 results
    if (stored.length > 1000) {
      stored.splice(0, stored.length - 1000);
    }
    localStorage.setItem(VERIFICATION_STORAGE_KEY, JSON.stringify(stored));
  } catch (error) {
    console.error('Failed to store verification result:', error);
  }
}

// Get all verification results
export function getVerificationResults(): PostWriteVerificationResult[] {
  try {
    const stored = JSON.parse(localStorage.getItem(VERIFICATION_STORAGE_KEY) || '[]');
    return stored.map((r: any) => ({
      ...r,
      timestamp: BigInt(r.timestamp),
      size: BigInt(r.size),
    }));
  } catch (error) {
    console.error('Failed to get verification results:', error);
    return [];
  }
}

// Get verification statistics
export function getVerificationStatistics() {
  const results = getVerificationResults();
  const total = results.length;
  const verified = results.filter(r => r.status === 'verified').length;
  const quarantined = results.filter(r => r.status === 'quarantined').length;
  const pending = results.filter(r => r.status === 'pending').length;
  
  return {
    total,
    verified,
    quarantined,
    pending,
    verificationRate: total > 0 ? (verified / total) * 100 : 0,
    quarantineRate: total > 0 ? (quarantined / total) * 100 : 0,
  };
}

// Add file to quarantine
export function quarantineFile(file: QuarantinedFile): void {
  try {
    const stored = JSON.parse(localStorage.getItem(QUARANTINE_STORAGE_KEY) || '[]');
    stored.push({
      ...file,
      quarantinedAt: file.quarantinedAt.toString(),
      size: file.size.toString(),
    });
    localStorage.setItem(QUARANTINE_STORAGE_KEY, JSON.stringify(stored));
  } catch (error) {
    console.error('Failed to quarantine file:', error);
  }
}

// Get all quarantined files
export function getQuarantinedFiles(): QuarantinedFile[] {
  try {
    const stored = JSON.parse(localStorage.getItem(QUARANTINE_STORAGE_KEY) || '[]');
    return stored.map((f: any) => ({
      ...f,
      quarantinedAt: BigInt(f.quarantinedAt),
      size: BigInt(f.size),
    }));
  } catch (error) {
    console.error('Failed to get quarantined files:', error);
    return [];
  }
}

// Remove file from quarantine
export function removeFromQuarantine(fileId: string): void {
  try {
    const stored = JSON.parse(localStorage.getItem(QUARANTINE_STORAGE_KEY) || '[]');
    const filtered = stored.filter((f: any) => f.fileId !== fileId);
    localStorage.setItem(QUARANTINE_STORAGE_KEY, JSON.stringify(filtered));
  } catch (error) {
    console.error('Failed to remove from quarantine:', error);
  }
}

// Clear all verification results
export function clearVerificationResults(): void {
  try {
    localStorage.removeItem(VERIFICATION_STORAGE_KEY);
  } catch (error) {
    console.error('Failed to clear verification results:', error);
  }
}

// Clear all quarantined files
export function clearQuarantine(): void {
  try {
    localStorage.removeItem(QUARANTINE_STORAGE_KEY);
  } catch (error) {
    console.error('Failed to clear quarantine:', error);
  }
}

// Simulate server-side post-write verification
export async function performPostWriteVerification(
  fileId: string,
  fileName: string,
  originalChecksum: string,
  size: bigint
): Promise<PostWriteVerificationResult> {
  // Simulate server-side checksum computation
  await new Promise(resolve => setTimeout(resolve, 100));
  
  // For demo purposes, randomly simulate verification success/failure
  const checksumMatch = Math.random() > 0.05; // 95% success rate
  const computedChecksum = checksumMatch ? originalChecksum : `corrupted_${originalChecksum.substring(0, 10)}`;
  
  const result: PostWriteVerificationResult = {
    id: `verification_${Date.now()}_${Math.random().toString(36).substring(7)}`,
    fileId,
    fileName,
    timestamp: BigInt(Date.now() * 1000000),
    checksumMatch,
    originalChecksum,
    computedChecksum,
    size,
    status: checksumMatch ? 'verified' : 'quarantined',
    errorMessage: checksumMatch ? undefined : 'Checksum mismatch detected during post-write verification',
  };
  
  storeVerificationResult(result);
  
  if (!checksumMatch) {
    const quarantined: QuarantinedFile = {
      id: `quarantine_${Date.now()}_${Math.random().toString(36).substring(7)}`,
      fileId,
      fileName,
      quarantinedAt: BigInt(Date.now() * 1000000),
      reason: 'Checksum mismatch detected during post-write verification',
      originalChecksum,
      computedChecksum,
      size,
      canRecover: false,
    };
    quarantineFile(quarantined);
  }
  
  return result;
}
