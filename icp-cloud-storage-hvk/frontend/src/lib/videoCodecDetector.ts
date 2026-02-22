/**
 * Video Codec Detection and Browser Compatibility Utility
 * Detects supported video codecs and formats across different browsers
 */

import type { VideoCodec, VideoFormat } from '../backend';

export interface CodecSupport {
  codec: VideoCodec;
  format: VideoFormat;
  mimeType: string;
  supported: boolean;
  confidence: 'probably' | 'maybe' | 'no';
}

export interface BrowserCodecCapabilities {
  browserId: string;
  browserName: string;
  browserVersion: string;
  supportedCodecs: CodecSupport[];
  recommendedFormat: VideoFormat | null;
  testedAt: Date;
}

export class VideoCodecDetector {
  private videoElement: HTMLVideoElement;
  private capabilities: BrowserCodecCapabilities | null = null;

  constructor() {
    this.videoElement = document.createElement('video');
  }

  /**
   * Test if a specific MIME type with codec is supported
   */
  private canPlayType(mimeType: string): 'probably' | 'maybe' | 'no' {
    const result = this.videoElement.canPlayType(mimeType);
    if (result === 'probably') return 'probably';
    if (result === 'maybe') return 'maybe';
    return 'no';
  }

  /**
   * Detect all supported codecs and formats
   */
  detectCapabilities(): BrowserCodecCapabilities {
    if (this.capabilities) {
      return this.capabilities;
    }

    const codecTests: Array<{ codec: VideoCodec; format: VideoFormat; mimeTypes: string[] }> = [
      {
        codec: 'H264_AAC' as VideoCodec,
        format: 'MP4' as VideoFormat,
        mimeTypes: [
          'video/mp4; codecs="avc1.42E01E, mp4a.40.2"', // H.264 Baseline + AAC
          'video/mp4; codecs="avc1.4D401E, mp4a.40.2"', // H.264 Main + AAC
          'video/mp4; codecs="avc1.64001E, mp4a.40.2"', // H.264 High + AAC
          'video/mp4',
        ],
      },
      {
        codec: 'VP9' as VideoCodec,
        format: 'WEBM' as VideoFormat,
        mimeTypes: [
          'video/webm; codecs="vp9, opus"',
          'video/webm; codecs="vp09.00.10.08"',
          'video/webm',
        ],
      },
      {
        codec: 'VP8' as VideoCodec,
        format: 'WEBM' as VideoFormat,
        mimeTypes: [
          'video/webm; codecs="vp8, vorbis"',
          'video/webm; codecs="vp8, opus"',
        ],
      },
      {
        codec: 'OGG' as VideoCodec,
        format: 'OGG' as VideoFormat,
        mimeTypes: [
          'video/ogg; codecs="theora, vorbis"',
          'video/ogg',
        ],
      },
    ];

    const supportedCodecs: CodecSupport[] = [];

    for (const test of codecTests) {
      let bestConfidence: 'probably' | 'maybe' | 'no' = 'no';
      let bestMimeType = test.mimeTypes[0];

      for (const mimeType of test.mimeTypes) {
        const confidence = this.canPlayType(mimeType);
        if (confidence === 'probably') {
          bestConfidence = 'probably';
          bestMimeType = mimeType;
          break;
        } else if (confidence === 'maybe' && bestConfidence === 'no') {
          bestConfidence = 'maybe';
          bestMimeType = mimeType;
        }
      }

      supportedCodecs.push({
        codec: test.codec,
        format: test.format,
        mimeType: bestMimeType,
        supported: bestConfidence !== 'no',
        confidence: bestConfidence,
      });
    }

    // Determine recommended format (prefer H.264/AAC for best compatibility)
    let recommendedFormat: VideoFormat | null = null;
    const h264Support = supportedCodecs.find(c => c.codec === 'H264_AAC');
    const vp9Support = supportedCodecs.find(c => c.codec === 'VP9');
    const vp8Support = supportedCodecs.find(c => c.codec === 'VP8');

    if (h264Support?.supported) {
      recommendedFormat = 'MP4' as VideoFormat;
    } else if (vp9Support?.supported) {
      recommendedFormat = 'WEBM' as VideoFormat;
    } else if (vp8Support?.supported) {
      recommendedFormat = 'WEBM' as VideoFormat;
    }

    const browserInfo = this.detectBrowser();

    this.capabilities = {
      browserId: this.generateBrowserId(),
      browserName: browserInfo.name,
      browserVersion: browserInfo.version,
      supportedCodecs,
      recommendedFormat,
      testedAt: new Date(),
    };

    return this.capabilities;
  }

  /**
   * Check if a specific codec is supported
   */
  isCodecSupported(codec: VideoCodec): boolean {
    const capabilities = this.detectCapabilities();
    const support = capabilities.supportedCodecs.find(c => c.codec === codec);
    return support?.supported || false;
  }

  /**
   * Check if a specific format is supported
   */
  isFormatSupported(format: VideoFormat): boolean {
    const capabilities = this.detectCapabilities();
    return capabilities.supportedCodecs.some(c => c.format === format && c.supported);
  }

  /**
   * Get the best supported format for playback
   */
  getBestFormat(): VideoFormat | null {
    const capabilities = this.detectCapabilities();
    return capabilities.recommendedFormat;
  }

  /**
   * Get MIME type for a format
   */
  getMimeTypeForFormat(format: VideoFormat): string {
    const capabilities = this.detectCapabilities();
    const support = capabilities.supportedCodecs.find(c => c.format === format && c.supported);
    return support?.mimeType || this.getDefaultMimeType(format);
  }

  /**
   * Get default MIME type for a format
   */
  private getDefaultMimeType(format: VideoFormat): string {
    switch (format) {
      case 'MP4':
        return 'video/mp4';
      case 'WEBM':
        return 'video/webm';
      case 'OGG':
        return 'video/ogg';
      default:
        return 'video/mp4';
    }
  }

  /**
   * Detect browser information
   */
  private detectBrowser(): { name: string; version: string } {
    const ua = navigator.userAgent;
    let name = 'Unknown';
    let version = 'Unknown';

    if (ua.includes('Chrome') && !ua.includes('Edg')) {
      name = 'Chrome';
      const match = ua.match(/Chrome\/(\d+)/);
      version = match ? match[1] : 'Unknown';
    } else if (ua.includes('Safari') && !ua.includes('Chrome')) {
      name = 'Safari';
      const match = ua.match(/Version\/(\d+)/);
      version = match ? match[1] : 'Unknown';
    } else if (ua.includes('Firefox')) {
      name = 'Firefox';
      const match = ua.match(/Firefox\/(\d+)/);
      version = match ? match[1] : 'Unknown';
    } else if (ua.includes('Edg')) {
      name = 'Edge';
      const match = ua.match(/Edg\/(\d+)/);
      version = match ? match[1] : 'Unknown';
    }

    return { name, version };
  }

  /**
   * Generate a unique browser ID
   */
  private generateBrowserId(): string {
    const browserInfo = this.detectBrowser();
    const platform = navigator.platform || 'Unknown';
    return `${browserInfo.name}-${browserInfo.version}-${platform}-${Date.now()}`;
  }

  /**
   * Get a user-friendly error message for unsupported codecs
   */
  getUnsupportedCodecMessage(codec: VideoCodec): string {
    switch (codec) {
      case 'H264_AAC':
        return 'Your browser does not support H.264/AAC video playback. Please try a different browser or download the video.';
      case 'VP9':
        return 'Your browser does not support VP9 video playback. An H.264 version may be available.';
      case 'VP8':
        return 'Your browser does not support VP8 video playback. An H.264 version may be available.';
      case 'OGG':
        return 'Your browser does not support OGG/Theora video playback. An H.264 version may be available.';
      default:
        return 'Your browser does not support this video codec. Please try downloading the video or using a different browser.';
    }
  }

  /**
   * Get conversion recommendation
   */
  getConversionRecommendation(): string {
    const capabilities = this.detectCapabilities();
    if (capabilities.recommendedFormat === 'MP4') {
      return 'For best compatibility, convert your videos to MP4 with H.264 video and AAC audio codecs.';
    } else if (capabilities.recommendedFormat === 'WEBM') {
      return 'Your browser supports WebM format. Consider converting to WebM with VP9 codec for better compression.';
    }
    return 'Your browser has limited video codec support. Consider using a modern browser like Chrome, Firefox, or Safari.';
  }
}

// Singleton instance
let detectorInstance: VideoCodecDetector | null = null;

export function getVideoCodecDetector(): VideoCodecDetector {
  if (!detectorInstance) {
    detectorInstance = new VideoCodecDetector();
  }
  return detectorInstance;
}

/**
 * Quick check if a video file can be played
 */
export function canPlayVideo(contentType: string): boolean {
  const video = document.createElement('video');
  const result = video.canPlayType(contentType);
  return result === 'probably' || result === 'maybe';
}

/**
 * Detect codec from file extension
 */
export function detectCodecFromFilename(filename: string): { codec: VideoCodec; format: VideoFormat } {
  const ext = filename.toLowerCase().split('.').pop() || '';
  
  switch (ext) {
    case 'mp4':
    case 'm4v':
      return { codec: 'H264_AAC' as VideoCodec, format: 'MP4' as VideoFormat };
    case 'webm':
      return { codec: 'VP9' as VideoCodec, format: 'WEBM' as VideoFormat };
    case 'ogv':
    case 'ogg':
      return { codec: 'OGG' as VideoCodec, format: 'OGG' as VideoFormat };
    default:
      return { codec: 'UNKNOWN' as VideoCodec, format: 'MP4' as VideoFormat };
  }
}

/**
 * Detect codec from MIME type
 */
export function detectCodecFromMimeType(mimeType: string): { codec: VideoCodec; format: VideoFormat } {
  if (mimeType.includes('mp4')) {
    return { codec: 'H264_AAC' as VideoCodec, format: 'MP4' as VideoFormat };
  } else if (mimeType.includes('webm')) {
    if (mimeType.includes('vp9')) {
      return { codec: 'VP9' as VideoCodec, format: 'WEBM' as VideoFormat };
    }
    return { codec: 'VP8' as VideoCodec, format: 'WEBM' as VideoFormat };
  } else if (mimeType.includes('ogg')) {
    return { codec: 'OGG' as VideoCodec, format: 'OGG' as VideoFormat };
  }
  return { codec: 'UNKNOWN' as VideoCodec, format: 'MP4' as VideoFormat };
}
