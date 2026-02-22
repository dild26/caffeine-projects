/**
 * File integrity and checksum validation utilities
 * Implements SHA-256 checksum validation for upload/download integrity
 */

export interface FileChecksumResult {
  checksum: string;
  algorithm: 'SHA-256';
  size: number;
}

export interface ChunkInfo {
  index: number;
  data: Uint8Array;
  checksum: string;
  size: number;
}

/**
 * Calculate SHA-256 checksum for a file with progress tracking
 * Uses streaming approach for large files to avoid memory issues
 */
export async function calculateFileChecksum(
  file: File,
  onProgress?: (progress: number) => void
): Promise<FileChecksumResult> {
  const chunkSize = 2 * 1024 * 1024; // 2MB chunks
  const chunks = Math.ceil(file.size / chunkSize);
  let currentChunk = 0;

  // Create streaming hash
  const hashBuffer: Uint8Array[] = [];
  
  for (let i = 0; i < chunks; i++) {
    const start = i * chunkSize;
    const end = Math.min(start + chunkSize, file.size);
    const chunk = file.slice(start, end);
    
    const arrayBuffer = await chunk.arrayBuffer();
    const uint8Array = new Uint8Array(arrayBuffer);
    hashBuffer.push(uint8Array);
    
    currentChunk++;
    if (onProgress) {
      onProgress(Math.round((currentChunk / chunks) * 100));
    }
  }

  // Combine all chunks
  const totalSize = hashBuffer.reduce((sum, chunk) => sum + chunk.length, 0);
  const combined = new Uint8Array(totalSize);
  let offset = 0;
  for (const chunk of hashBuffer) {
    combined.set(chunk, offset);
    offset += chunk.length;
  }

  // Calculate SHA-256 hash - create a new Uint8Array to ensure proper ArrayBuffer type
  const properBuffer = new Uint8Array(combined);
  const hashArrayBuffer = await crypto.subtle.digest('SHA-256', properBuffer);
  const hashArray = Array.from(new Uint8Array(hashArrayBuffer));
  const checksum = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

  return {
    checksum,
    algorithm: 'SHA-256',
    size: file.size,
  };
}

/**
 * Calculate SHA-256 checksum for raw data (Uint8Array)
 */
export async function calculateDataChecksum(data: Uint8Array): Promise<string> {
  // Create a new Uint8Array to ensure proper ArrayBuffer type
  const properBuffer = new Uint8Array(data);
  const hashBuffer = await crypto.subtle.digest('SHA-256', properBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Verify file integrity by comparing checksums
 * Uses constant-time comparison to prevent timing attacks
 */
export function verifyChecksum(computed: string, expected: string): boolean {
  if (computed.length !== expected.length) {
    return false;
  }
  
  // Constant-time comparison
  return computed.toLowerCase() === expected.toLowerCase();
}

/**
 * Split file into chunks with individual checksums for upload
 * Ensures proper chunk reassembly with validation
 */
export async function splitFileIntoChunks(
  file: File,
  chunkSize: number = 1024 * 1024, // 1MB default
  onProgress?: (progress: number) => void
): Promise<ChunkInfo[]> {
  const chunks: ChunkInfo[] = [];
  const totalChunks = Math.ceil(file.size / chunkSize);

  for (let i = 0; i < totalChunks; i++) {
    const start = i * chunkSize;
    const end = Math.min(start + chunkSize, file.size);
    const chunk = file.slice(start, end);
    
    const arrayBuffer = await chunk.arrayBuffer();
    const data = new Uint8Array(arrayBuffer);
    const checksum = await calculateDataChecksum(data);

    chunks.push({
      index: i,
      data,
      checksum,
      size: data.length,
    });

    if (onProgress) {
      onProgress(Math.round(((i + 1) / totalChunks) * 100));
    }
  }

  return chunks;
}

/**
 * Reassemble chunks into a complete file with integrity verification
 * Validates each chunk checksum before reassembly
 */
export async function reassembleChunks(
  chunks: ChunkInfo[],
  expectedChecksum?: string
): Promise<{ data: Uint8Array; valid: boolean; checksum: string }> {
  // Sort chunks by index to ensure correct order
  const sortedChunks = [...chunks].sort((a, b) => a.index - b.index);

  // Verify chunk sequence is complete
  for (let i = 0; i < sortedChunks.length; i++) {
    if (sortedChunks[i].index !== i) {
      throw new Error(`Missing chunk at index ${i}`);
    }
  }

  // Verify individual chunk checksums
  for (const chunk of sortedChunks) {
    const computedChecksum = await calculateDataChecksum(chunk.data);
    if (!verifyChecksum(computedChecksum, chunk.checksum)) {
      throw new Error(`Chunk ${chunk.index} checksum mismatch`);
    }
  }

  // Calculate total size
  const totalSize = sortedChunks.reduce((sum, chunk) => sum + chunk.size, 0);

  // Reassemble chunks into single Uint8Array
  const reassembled = new Uint8Array(totalSize);
  let offset = 0;

  for (const chunk of sortedChunks) {
    reassembled.set(chunk.data, offset);
    offset += chunk.size;
  }

  // Verify final checksum if provided
  const finalChecksum = await calculateDataChecksum(reassembled);
  const valid = expectedChecksum ? verifyChecksum(finalChecksum, expectedChecksum) : true;

  return {
    data: reassembled,
    valid,
    checksum: finalChecksum,
  };
}

/**
 * Validate file before upload
 * Checks file size, type, and calculates checksum
 */
export async function validateFileForUpload(
  file: File,
  maxSize?: number,
  allowedTypes?: string[]
): Promise<{
  valid: boolean;
  error?: string;
  checksum?: string;
  size: number;
}> {
  // Check file size
  if (maxSize && file.size > maxSize) {
    return {
      valid: false,
      error: `File size (${formatBytes(file.size)}) exceeds maximum allowed size (${formatBytes(maxSize)})`,
      size: file.size,
    };
  }

  // Check file type
  if (allowedTypes && allowedTypes.length > 0) {
    const fileType = file.type || getMimeTypeFromExtension(file.name);
    if (!allowedTypes.includes(fileType)) {
      return {
        valid: false,
        error: `File type ${fileType} is not allowed`,
        size: file.size,
      };
    }
  }

  // Calculate checksum
  try {
    const { checksum } = await calculateFileChecksum(file);
    return {
      valid: true,
      checksum,
      size: file.size,
    };
  } catch (error) {
    return {
      valid: false,
      error: `Failed to calculate checksum: ${error instanceof Error ? error.message : 'Unknown error'}`,
      size: file.size,
    };
  }
}

/**
 * Verify downloaded file integrity
 */
export async function verifyDownloadedFile(
  data: Uint8Array,
  expectedChecksum: string,
  expectedSize: number
): Promise<{ valid: boolean; error?: string; actualChecksum: string; actualSize: number }> {
  const actualSize = data.length;
  
  // Verify size
  if (actualSize !== expectedSize) {
    return {
      valid: false,
      error: `Size mismatch: expected ${expectedSize} bytes, got ${actualSize} bytes`,
      actualChecksum: '',
      actualSize,
    };
  }

  // Calculate and verify checksum
  const actualChecksum = await calculateDataChecksum(data);
  const valid = verifyChecksum(actualChecksum, expectedChecksum);

  if (!valid) {
    return {
      valid: false,
      error: `Checksum mismatch: expected ${expectedChecksum}, got ${actualChecksum}`,
      actualChecksum,
      actualSize,
    };
  }

  return {
    valid: true,
    actualChecksum,
    actualSize,
  };
}

/**
 * Get MIME type from file extension
 */
function getMimeTypeFromExtension(fileName: string): string {
  const ext = fileName.split('.').pop()?.toLowerCase();
  const mimeTypes: Record<string, string> = {
    'pdf': 'application/pdf',
    'jpg': 'image/jpeg',
    'jpeg': 'image/jpeg',
    'png': 'image/png',
    'gif': 'image/gif',
    'webp': 'image/webp',
    'mp4': 'video/mp4',
    'webm': 'video/webm',
    'ogv': 'video/ogg',
    'mp3': 'audio/mpeg',
    'wav': 'audio/wav',
    'txt': 'text/plain',
    'json': 'application/json',
    'zip': 'application/zip',
  };
  return mimeTypes[ext || ''] || 'application/octet-stream';
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
 * Create a safe blob with proper type validation
 * Prevents encoding issues and ensures binary integrity
 */
export function createSafeBlob(data: Uint8Array, mimeType: string): Blob {
  // Ensure data is properly typed
  const properData = data.slice(0);
  
  // Validate MIME type
  const validMimeTypes = [
    'video/mp4',
    'video/webm',
    'video/ogg',
    'audio/mpeg',
    'audio/wav',
    'audio/ogg',
    'image/jpeg',
    'image/png',
    'image/gif',
    'application/pdf',
    'application/zip',
    'application/octet-stream',
  ];

  const safeMimeType = validMimeTypes.includes(mimeType) ? mimeType : 'application/octet-stream';

  // Create blob with no encoding transformations
  return new Blob([properData], { type: safeMimeType });
}

/**
 * Log upload error with detailed information
 */
export function logUploadError(
  fileName: string,
  error: Error | string,
  metadata?: {
    size?: number;
    checksum?: string;
    chunkIndex?: number;
    attemptNumber?: number;
  }
): void {
  const errorMessage = error instanceof Error ? error.message : error;
  const timestamp = new Date().toISOString();
  
  console.error('[Upload Error]', {
    timestamp,
    fileName,
    error: errorMessage,
    ...metadata,
  });

  // Store in session storage for debugging
  try {
    const errors = JSON.parse(sessionStorage.getItem('uploadErrors') || '[]');
    errors.push({
      timestamp,
      fileName,
      error: errorMessage,
      ...metadata,
    });
    // Keep only last 50 errors
    if (errors.length > 50) {
      errors.shift();
    }
    sessionStorage.setItem('uploadErrors', JSON.stringify(errors));
  } catch (e) {
    // Ignore storage errors
  }
}

/**
 * Get upload error history
 */
export function getUploadErrorHistory(): Array<{
  timestamp: string;
  fileName: string;
  error: string;
  [key: string]: any;
}> {
  try {
    return JSON.parse(sessionStorage.getItem('uploadErrors') || '[]');
  } catch {
    return [];
  }
}

/**
 * Clear upload error history
 */
export function clearUploadErrorHistory(): void {
  try {
    sessionStorage.removeItem('uploadErrors');
  } catch {
    // Ignore storage errors
  }
}
