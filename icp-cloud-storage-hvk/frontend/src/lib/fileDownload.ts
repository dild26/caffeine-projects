/**
 * Robust file download utility with streaming support, progress tracking,
 * binary integrity verification, and proper blob handling for large files
 */

import { 
  validateBinaryResponse, 
  verifyDownloadIntegrity, 
  storeIntegrityReport,
  createSafeBlobWithValidation 
} from './binaryIntegrity';

export interface DownloadOptions {
  onProgress?: (progress: number) => void;
  signal?: AbortSignal;
  expectedChecksum?: string;
  expectedSize?: number;
  originalData?: Uint8Array;
}

export interface DownloadResult {
  success: boolean;
  error?: string;
  bytesDownloaded?: number;
  integrityVerified?: boolean;
  corruptionDetected?: boolean;
}

/**
 * Download a file with streaming support, progress tracking, and integrity verification
 * Handles large files by using ReadableStream and chunked processing
 */
export async function downloadFileWithProgress(
  url: string,
  filename: string,
  options: DownloadOptions = {}
): Promise<DownloadResult> {
  const { onProgress, signal, expectedChecksum, expectedSize, originalData } = options;

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': '*/*',
        'Range': 'bytes=0-',
      },
      signal,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // Validate binary response headers
    const validation = validateBinaryResponse(response, expectedSize);
    if (!validation.valid) {
      throw new Error(validation.error);
    }

    // Get content length from headers
    const contentLength = response.headers.get('Content-Length');
    const total = contentLength ? parseInt(contentLength, 10) : 0;

    // Verify expected size
    if (expectedSize && total !== expectedSize) {
      throw new Error(`Content-Length (${total}) does not match expected size (${expectedSize})`);
    }

    if (!response.body) {
      throw new Error('Response body is null');
    }

    // Use ReadableStream for chunked processing
    const reader = response.body.getReader();
    const chunks: Uint8Array[] = [];
    let receivedLength = 0;

    while (true) {
      const { done, value } = await reader.read();

      if (done) break;

      chunks.push(value);
      receivedLength += value.length;

      // Report progress
      if (onProgress && total > 0) {
        const progress = (receivedLength / total) * 100;
        onProgress(Math.round(progress));
      }
    }

    // Combine all chunks into a single Uint8Array
    const allChunks = new Uint8Array(receivedLength);
    let position = 0;
    for (const chunk of chunks) {
      allChunks.set(chunk, position);
      position += chunk.length;
    }

    // Verify downloaded size matches expected size
    if (total > 0 && receivedLength !== total) {
      throw new Error(`Downloaded size (${receivedLength}) does not match Content-Length (${total})`);
    }

    // Verify integrity if original data and checksum provided
    let integrityVerified = false;
    let corruptionDetected = false;

    if (originalData && expectedChecksum) {
      const report = await verifyDownloadIntegrity(
        filename,
        filename,
        originalData,
        allChunks,
        expectedChecksum
      );

      storeIntegrityReport(report);

      if (report.corruptionDetected) {
        corruptionDetected = true;
        throw new Error(`File corrupted on server; please re-upload. ${report.errorDetails}`);
      }

      integrityVerified = true;
    }

    // Get content type from response headers
    const contentType = response.headers.get('Content-Type') || 'application/octet-stream';

    // Create blob with integrity validation
    const { blob, valid, error: blobError } = createSafeBlobWithValidation(
      allChunks,
      contentType,
      receivedLength
    );

    if (!valid) {
      throw new Error(`Blob creation failed: ${blobError}`);
    }

    // Verify blob size
    if (blob.size !== receivedLength) {
      throw new Error(`Blob size (${blob.size}) does not match downloaded size (${receivedLength})`);
    }

    // Create download link
    const blobUrl = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = blobUrl;
    link.download = filename;
    link.style.display = 'none';

    // Trigger download
    document.body.appendChild(link);
    link.click();

    // Cleanup
    setTimeout(() => {
      document.body.removeChild(link);
      URL.revokeObjectURL(blobUrl);
    }, 100);

    return {
      success: true,
      bytesDownloaded: receivedLength,
      integrityVerified,
      corruptionDetected: false,
    };
  } catch (error) {
    console.error('Download error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      corruptionDetected: error instanceof Error && error.message.includes('corrupted'),
    };
  }
}

/**
 * Create a blob URL for media playback with proper MIME type validation
 */
export function createMediaBlobUrl(
  data: Uint8Array | ArrayBuffer,
  mimeType: string
): string {
  // Validate MIME type
  const validMimeTypes = [
    'video/mp4',
    'video/webm',
    'video/ogg',
    'audio/mpeg',
    'audio/wav',
    'audio/ogg',
    'audio/flac',
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/webp',
    'application/pdf',
    'application/zip',
  ];

  if (!validMimeTypes.includes(mimeType)) {
    console.warn(`Unvalidated MIME type: ${mimeType}`);
  }

  // Convert to Uint8Array if needed, then slice to create a properly-typed copy
  const uint8Data = data instanceof ArrayBuffer ? new Uint8Array(data) : data;
  const properlyTypedData = uint8Data.slice(0);
  
  // Create blob with the properly typed Uint8Array
  const blob = new Blob([properlyTypedData], { type: mimeType });
  return URL.createObjectURL(blob);
}

/**
 * Validate video codec support in the browser
 */
export function validateVideoCodec(mimeType: string): {
  supported: boolean;
  message: string;
  codecs: string[];
} {
  const video = document.createElement('video');

  // Define codec strings for different formats
  const codecTests: Record<string, string[]> = {
    'video/mp4': [
      'video/mp4; codecs="avc1.42E01E, mp4a.40.2"', // H.264 Baseline + AAC
      'video/mp4; codecs="avc1.4D401E, mp4a.40.2"', // H.264 Main + AAC
      'video/mp4; codecs="avc1.64001E, mp4a.40.2"', // H.264 High + AAC
    ],
    'video/webm': [
      'video/webm; codecs="vp8, vorbis"', // VP8 + Vorbis
      'video/webm; codecs="vp9, opus"', // VP9 + Opus
    ],
    'video/ogg': [
      'video/ogg; codecs="theora, vorbis"', // Theora + Vorbis
    ],
  };

  const tests = codecTests[mimeType] || [];
  const supportedCodecs: string[] = [];

  for (const codec of tests) {
    const support = video.canPlayType(codec);
    if (support === 'probably' || support === 'maybe') {
      supportedCodecs.push(codec);
    }
  }

  if (supportedCodecs.length > 0) {
    return {
      supported: true,
      message: `Codec support detected: ${supportedCodecs.join(', ')}`,
      codecs: supportedCodecs,
    };
  }

  return {
    supported: false,
    message: `No codec support detected for ${mimeType}`,
    codecs: [],
  };
}

/**
 * Download file with retry logic for failed downloads
 */
export async function downloadFileWithRetry(
  url: string,
  filename: string,
  options: DownloadOptions & { maxRetries?: number } = {}
): Promise<DownloadResult> {
  const { maxRetries = 3, ...downloadOptions } = options;
  let lastError: string | undefined;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    const result = await downloadFileWithProgress(url, filename, downloadOptions);

    if (result.success) {
      return result;
    }

    lastError = result.error;
    console.warn(`Download attempt ${attempt} failed:`, result.error);

    if (attempt < maxRetries) {
      // Wait before retrying (exponential backoff)
      await new Promise((resolve) => setTimeout(resolve, Math.pow(2, attempt) * 1000));
    }
  }

  return {
    success: false,
    error: `Failed after ${maxRetries} attempts. Last error: ${lastError}`,
  };
}
