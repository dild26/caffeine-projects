/**
 * Binary Integrity Verification System
 * Implements comprehensive checksum validation, binary diff analysis,
 * and corruption detection across upload/download pipelines
 */

export interface BinaryIntegrityReport {
  fileId: string;
  fileName: string;
  originalSize: number;
  downloadedSize: number;
  originalChecksum: string;
  downloadedChecksum: string;
  checksumMatch: boolean;
  sizeMatch: boolean;
  corruptionDetected: boolean;
  binaryDiff?: BinaryDiffResult;
  timestamp: number;
  errorDetails?: string;
}

export interface BinaryDiffResult {
  totalBytes: number;
  differingBytes: number;
  differencePercentage: number;
  differencePatterns: DifferencePattern[];
  firstDifferenceOffset: number;
  lastDifferenceOffset: number;
}

export interface DifferencePattern {
  offset: number;
  length: number;
  originalBytes: number[];
  downloadedBytes: number[];
  patternType: 'truncation' | 'corruption' | 'insertion' | 'deletion';
}

export interface IntegrityValidationResult {
  valid: boolean;
  error?: string;
  checksum: string;
  size: number;
  contentType: string;
  headers: Record<string, string>;
}

/**
 * Calculate SHA-256 checksum with progress tracking
 */
export async function calculateChecksumWithProgress(
  data: Uint8Array,
  onProgress?: (progress: number) => void
): Promise<string> {
  const chunkSize = 1024 * 1024; // 1MB chunks
  const totalChunks = Math.ceil(data.length / chunkSize);
  const chunks: Uint8Array[] = [];

  for (let i = 0; i < totalChunks; i++) {
    const start = i * chunkSize;
    const end = Math.min(start + chunkSize, data.length);
    chunks.push(data.slice(start, end));
    
    if (onProgress) {
      onProgress(Math.round(((i + 1) / totalChunks) * 100));
    }
  }

  // Combine all chunks
  const combined = new Uint8Array(data.length);
  let offset = 0;
  for (const chunk of chunks) {
    combined.set(chunk, offset);
    offset += chunk.length;
  }

  // Calculate SHA-256
  const hashBuffer = await crypto.subtle.digest('SHA-256', combined.buffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Perform binary diff between original and downloaded data
 */
export function performBinaryDiff(
  original: Uint8Array,
  downloaded: Uint8Array
): BinaryDiffResult {
  const totalBytes = Math.max(original.length, downloaded.length);
  const differingBytes: number[] = [];
  const patterns: DifferencePattern[] = [];
  
  let firstDiff = -1;
  let lastDiff = -1;
  let currentPattern: DifferencePattern | null = null;

  for (let i = 0; i < totalBytes; i++) {
    const origByte = i < original.length ? original[i] : undefined;
    const downByte = i < downloaded.length ? downloaded[i] : undefined;

    if (origByte !== downByte) {
      differingBytes.push(i);
      
      if (firstDiff === -1) {
        firstDiff = i;
      }
      lastDiff = i;

      // Detect pattern type
      let patternType: DifferencePattern['patternType'] = 'corruption';
      if (origByte === undefined) {
        patternType = 'insertion';
      } else if (downByte === undefined) {
        patternType = 'deletion';
      } else if (i >= original.length - 100 && downloaded.length < original.length) {
        patternType = 'truncation';
      }

      // Group consecutive differences into patterns
      if (!currentPattern || i > currentPattern.offset + currentPattern.length + 10) {
        if (currentPattern) {
          patterns.push(currentPattern);
        }
        currentPattern = {
          offset: i,
          length: 1,
          originalBytes: [origByte ?? 0],
          downloadedBytes: [downByte ?? 0],
          patternType,
        };
      } else {
        currentPattern.length++;
        currentPattern.originalBytes.push(origByte ?? 0);
        currentPattern.downloadedBytes.push(downByte ?? 0);
      }
    }
  }

  if (currentPattern) {
    patterns.push(currentPattern);
  }

  return {
    totalBytes,
    differingBytes: differingBytes.length,
    differencePercentage: (differingBytes.length / totalBytes) * 100,
    differencePatterns: patterns.slice(0, 10), // Limit to first 10 patterns
    firstDifferenceOffset: firstDiff,
    lastDifferenceOffset: lastDiff,
  };
}

/**
 * Validate binary response with HTTP headers
 */
export function validateBinaryResponse(
  response: Response,
  expectedSize?: number,
  expectedType?: string
): IntegrityValidationResult {
  const headers: Record<string, string> = {};
  response.headers.forEach((value, key) => {
    headers[key] = value;
  });

  const contentLength = response.headers.get('Content-Length');
  const contentType = response.headers.get('Content-Type') || 'application/octet-stream';
  const acceptRanges = response.headers.get('Accept-Ranges');

  // Validate Content-Length
  if (expectedSize && contentLength) {
    const actualSize = parseInt(contentLength, 10);
    if (actualSize !== expectedSize) {
      return {
        valid: false,
        error: `Content-Length mismatch: expected ${expectedSize}, got ${actualSize}`,
        checksum: '',
        size: actualSize,
        contentType,
        headers,
      };
    }
  }

  // Validate Content-Type
  if (expectedType && contentType !== expectedType) {
    return {
      valid: false,
      error: `Content-Type mismatch: expected ${expectedType}, got ${contentType}`,
      checksum: '',
      size: parseInt(contentLength || '0', 10),
      contentType,
      headers,
    };
  }

  // Check for Accept-Ranges support
  if (!acceptRanges || acceptRanges === 'none') {
    console.warn('Server does not support range requests');
  }

  return {
    valid: true,
    checksum: '',
    size: parseInt(contentLength || '0', 10),
    contentType,
    headers,
  };
}

/**
 * Verify downloaded file integrity
 */
export async function verifyDownloadIntegrity(
  fileId: string,
  fileName: string,
  originalData: Uint8Array,
  downloadedData: Uint8Array,
  expectedChecksum: string
): Promise<BinaryIntegrityReport> {
  const timestamp = Date.now();

  // Calculate checksums
  const originalChecksum = await calculateChecksumWithProgress(originalData);
  const downloadedChecksum = await calculateChecksumWithProgress(downloadedData);

  // Compare sizes
  const sizeMatch = originalData.length === downloadedData.length;
  const checksumMatch = originalChecksum === downloadedChecksum && originalChecksum === expectedChecksum;

  // Detect corruption
  const corruptionDetected = !sizeMatch || !checksumMatch;

  let binaryDiff: BinaryDiffResult | undefined;
  let errorDetails: string | undefined;

  if (corruptionDetected) {
    // Perform binary diff
    binaryDiff = performBinaryDiff(originalData, downloadedData);

    // Generate error details
    if (!sizeMatch) {
      errorDetails = `Size mismatch: expected ${originalData.length} bytes, got ${downloadedData.length} bytes`;
    } else if (!checksumMatch) {
      errorDetails = `Checksum mismatch: expected ${expectedChecksum}, got ${downloadedChecksum}`;
    }

    if (binaryDiff.differencePercentage > 0) {
      errorDetails += `. Binary diff: ${binaryDiff.differingBytes} bytes differ (${binaryDiff.differencePercentage.toFixed(2)}%)`;
    }
  }

  return {
    fileId,
    fileName,
    originalSize: originalData.length,
    downloadedSize: downloadedData.length,
    originalChecksum,
    downloadedChecksum,
    checksumMatch,
    sizeMatch,
    corruptionDetected,
    binaryDiff,
    timestamp,
    errorDetails,
  };
}

/**
 * Store integrity report in session storage
 */
export function storeIntegrityReport(report: BinaryIntegrityReport): void {
  try {
    const reports = getIntegrityReports();
    reports.push(report);
    
    // Keep only last 100 reports
    if (reports.length > 100) {
      reports.shift();
    }
    
    sessionStorage.setItem('integrityReports', JSON.stringify(reports));
  } catch (error) {
    console.error('Failed to store integrity report:', error);
  }
}

/**
 * Get all integrity reports
 */
export function getIntegrityReports(): BinaryIntegrityReport[] {
  try {
    const reportsStr = sessionStorage.getItem('integrityReports');
    return reportsStr ? JSON.parse(reportsStr) : [];
  } catch (error) {
    console.error('Failed to get integrity reports:', error);
    return [];
  }
}

/**
 * Clear integrity reports
 */
export function clearIntegrityReports(): void {
  try {
    sessionStorage.removeItem('integrityReports');
  } catch (error) {
    console.error('Failed to clear integrity reports:', error);
  }
}

/**
 * Get corruption statistics
 */
export function getCorruptionStatistics(): {
  totalFiles: number;
  corruptedFiles: number;
  corruptionRate: number;
  commonPatterns: string[];
} {
  const reports = getIntegrityReports();
  const corruptedReports = reports.filter(r => r.corruptionDetected);

  const patternCounts: Record<string, number> = {};
  corruptedReports.forEach(report => {
    if (report.binaryDiff) {
      report.binaryDiff.differencePatterns.forEach(pattern => {
        patternCounts[pattern.patternType] = (patternCounts[pattern.patternType] || 0) + 1;
      });
    }
  });

  const commonPatterns = Object.entries(patternCounts)
    .sort((a, b) => b[1] - a[1])
    .map(([pattern]) => pattern);

  return {
    totalFiles: reports.length,
    corruptedFiles: corruptedReports.length,
    corruptionRate: reports.length > 0 ? (corruptedReports.length / reports.length) * 100 : 0,
    commonPatterns,
  };
}

/**
 * Create safe blob with integrity validation
 */
export function createSafeBlobWithValidation(
  data: Uint8Array,
  mimeType: string,
  expectedSize: number
): { blob: Blob; valid: boolean; error?: string } {
  // Validate size
  if (data.length !== expectedSize) {
    // Create a properly typed copy using slice
    const safeCopy = data.slice(0);
    return {
      blob: new Blob([safeCopy], { type: mimeType }),
      valid: false,
      error: `Size mismatch: expected ${expectedSize}, got ${data.length}`,
    };
  }

  // Create properly typed copy using slice to ensure ArrayBuffer type
  const safeCopy = data.slice(0);

  // Validate MIME type
  const validMimeTypes = [
    'video/mp4',
    'video/webm',
    'video/ogg',
    'audio/mpeg',
    'audio/wav',
    'image/jpeg',
    'image/png',
    'image/gif',
    'application/pdf',
    'application/zip',
    'application/x-zip-compressed',
    'application/octet-stream',
  ];

  const safeMimeType = validMimeTypes.includes(mimeType) ? mimeType : 'application/octet-stream';

  // Create blob with no encoding transformations
  const blob = new Blob([safeCopy], { type: safeMimeType });

  // Verify blob size matches input
  if (blob.size !== data.length) {
    return {
      blob,
      valid: false,
      error: `Blob size (${blob.size}) does not match input size (${data.length})`,
    };
  }

  return {
    blob,
    valid: true,
  };
}

/**
 * Validate file before upload with comprehensive checks
 */
export async function validateFileForUpload(
  file: File,
  maxSize?: number
): Promise<{
  valid: boolean;
  error?: string;
  checksum: string;
  size: number;
  contentType: string;
}> {
  // Check file size
  if (maxSize && file.size > maxSize) {
    return {
      valid: false,
      error: `File size (${formatBytes(file.size)}) exceeds maximum (${formatBytes(maxSize)})`,
      checksum: '',
      size: file.size,
      contentType: file.type,
    };
  }

  // Read file data
  const arrayBuffer = await file.arrayBuffer();
  const data = new Uint8Array(arrayBuffer);

  // Calculate checksum
  const checksum = await calculateChecksumWithProgress(data);

  // Verify size consistency
  if (data.length !== file.size) {
    return {
      valid: false,
      error: `Size inconsistency: file.size=${file.size}, data.length=${data.length}`,
      checksum,
      size: data.length,
      contentType: file.type,
    };
  }

  return {
    valid: true,
    checksum,
    size: file.size,
    contentType: file.type || 'application/octet-stream',
  };
}

/**
 * Format bytes to human-readable size
 */
function formatBytes(bytes: number): string {
  const units = ['B', 'KB', 'MB', 'GB', 'TB'];
  let size = bytes;
  let unitIndex = 0;
  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex++;
  }
  return `${size.toFixed(2)} ${units[unitIndex]}`;
}

/**
 * Continuous integrity verification job
 */
export async function runContinuousIntegrityCheck(
  files: Array<{ id: string; name: string; checksum: string; size: number }>,
  onProgress?: (current: number, total: number) => void
): Promise<{
  totalFiles: number;
  verifiedFiles: number;
  corruptedFiles: number;
  issues: Array<{ fileId: string; fileName: string; error: string }>;
}> {
  const issues: Array<{ fileId: string; fileName: string; error: string }> = [];
  let verifiedFiles = 0;
  let corruptedFiles = 0;

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    
    if (onProgress) {
      onProgress(i + 1, files.length);
    }

    try {
      // Retrieve file data from IndexedDB
      const db = await openDB();
      const data = await getFileData(db, file.id);

      if (!data) {
        issues.push({
          fileId: file.id,
          fileName: file.name,
          error: 'File data missing from storage',
        });
        corruptedFiles++;
        continue;
      }

      // Verify size
      if (data.length !== file.size) {
        issues.push({
          fileId: file.id,
          fileName: file.name,
          error: `Size mismatch: expected ${file.size}, got ${data.length}`,
        });
        corruptedFiles++;
        continue;
      }

      // Verify checksum
      const actualChecksum = await calculateChecksumWithProgress(data);
      if (actualChecksum !== file.checksum) {
        issues.push({
          fileId: file.id,
          fileName: file.name,
          error: `Checksum mismatch: expected ${file.checksum}, got ${actualChecksum}`,
        });
        corruptedFiles++;
        continue;
      }

      verifiedFiles++;
    } catch (error) {
      issues.push({
        fileId: file.id,
        fileName: file.name,
        error: error instanceof Error ? error.message : 'Unknown error',
      });
      corruptedFiles++;
    }
  }

  return {
    totalFiles: files.length,
    verifiedFiles,
    corruptedFiles,
    issues,
  };
}

// IndexedDB helpers
const DB_NAME = 'FileStorageDB';
const DB_VERSION = 1;
const FILE_STORE = 'files';

async function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(FILE_STORE)) {
        db.createObjectStore(FILE_STORE);
      }
    };
  });
}

async function getFileData(db: IDBDatabase, fileId: string): Promise<Uint8Array | null> {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([FILE_STORE], 'readonly');
    const store = transaction.objectStore(FILE_STORE);
    const request = store.get(fileId);
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result || null);
  });
}
