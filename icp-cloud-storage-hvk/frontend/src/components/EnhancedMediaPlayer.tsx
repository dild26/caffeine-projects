import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Alert, AlertDescription } from './ui/alert';
import { Badge } from './ui/badge';
import { Download, AlertTriangle, CheckCircle, RefreshCw } from 'lucide-react';
import { getVideoCodecDetector, detectCodecFromMimeType, canPlayVideo } from '../lib/videoCodecDetector';
import { downloadFileWithProgress } from '../lib/fileDownload';
import { toast } from 'sonner';
import type { VideoCodec, VideoFormat } from '../backend';

interface EnhancedMediaPlayerProps {
  fileId: string;
  fileName: string;
  contentType: string;
  blobUrl: string;
  availableFormats?: Array<{ format: VideoFormat; fileId: string; url: string }>;
  onFormatChange?: (fileId: string) => void;
}

export default function EnhancedMediaPlayer({
  fileId,
  fileName,
  contentType,
  blobUrl,
  availableFormats = [],
  onFormatChange,
}: EnhancedMediaPlayerProps) {
  const [codecSupported, setCodecSupported] = useState<boolean | null>(null);
  const [selectedFormat, setSelectedFormat] = useState<VideoFormat | null>(null);
  const [currentUrl, setCurrentUrl] = useState(blobUrl);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const detector = getVideoCodecDetector();

  useEffect(() => {
    checkCodecSupport();
  }, [contentType, blobUrl]);

  const checkCodecSupport = () => {
    try {
      // Check if the current content type is supported
      const supported = canPlayVideo(contentType);
      setCodecSupported(supported);

      if (!supported) {
        // Try to find an alternative format
        const capabilities = detector.detectCapabilities();
        const { codec } = detectCodecFromMimeType(contentType);
        
        // Check if we have alternative formats available
        if (availableFormats.length > 0) {
          const bestFormat = availableFormats.find(f => {
            const formatSupported = capabilities.supportedCodecs.find(
              c => c.format === f.format && c.supported
            );
            return formatSupported;
          });

          if (bestFormat) {
            setSelectedFormat(bestFormat.format);
            setCurrentUrl(bestFormat.url);
            setCodecSupported(true);
            if (onFormatChange) {
              onFormatChange(bestFormat.fileId);
            }
          }
        }
      }
    } catch (err) {
      console.error('Codec detection error:', err);
      setError('Failed to detect codec support');
    }
  };

  const handleDownload = async () => {
    setIsDownloading(true);
    setDownloadProgress(0);

    try {
      const result = await downloadFileWithProgress(currentUrl, fileName, {
        onProgress: (progress) => setDownloadProgress(progress),
      });

      if (result.success) {
        toast.success('Video downloaded successfully');
      } else {
        toast.error(`Download failed: ${result.error}`);
      }
    } catch (error) {
      toast.error('Download failed');
      console.error(error);
    } finally {
      setIsDownloading(false);
      setDownloadProgress(0);
    }
  };

  const handleFormatSwitch = (format: VideoFormat) => {
    const formatData = availableFormats.find(f => f.format === format);
    if (formatData) {
      setSelectedFormat(format);
      setCurrentUrl(formatData.url);
      setCodecSupported(true);
      if (onFormatChange) {
        onFormatChange(formatData.fileId);
      }
    }
  };

  const handleVideoError = (e: React.SyntheticEvent<HTMLVideoElement, Event>) => {
    const videoElement = e.currentTarget;
    const error = videoElement.error;
    
    if (error) {
      let errorMessage = 'Video playback error';
      switch (error.code) {
        case error.MEDIA_ERR_ABORTED:
          errorMessage = 'Video playback was aborted';
          break;
        case error.MEDIA_ERR_NETWORK:
          errorMessage = 'Network error while loading video';
          break;
        case error.MEDIA_ERR_DECODE:
          errorMessage = 'Video decoding error - codec may not be supported';
          break;
        case error.MEDIA_ERR_SRC_NOT_SUPPORTED:
          errorMessage = 'Video format or codec not supported';
          break;
      }
      setError(errorMessage);
      setCodecSupported(false);
    }
  };

  const { codec } = detectCodecFromMimeType(contentType);
  const capabilities = detector.detectCapabilities();

  // If codec is not supported and no alternatives available
  if (codecSupported === false && availableFormats.length === 0) {
    return (
      <Card className="border-yellow-500/50 bg-yellow-500/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-yellow-600">
            <AlertTriangle className="h-5 w-5" />
            Codec Not Supported
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert variant="default" className="border-yellow-500/50">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              <p className="font-medium mb-2">
                {detector.getUnsupportedCodecMessage(codec)}
              </p>
              <p className="text-sm text-muted-foreground">
                {detector.getConversionRecommendation()}
              </p>
            </AlertDescription>
          </Alert>

          <div className="space-y-2">
            <p className="text-sm font-medium">Your browser supports:</p>
            <div className="flex flex-wrap gap-2">
              {capabilities.supportedCodecs
                .filter(c => c.supported)
                .map(c => (
                  <Badge key={c.codec} variant="outline">
                    {c.format} ({c.codec})
                  </Badge>
                ))}
            </div>
          </div>

          <div className="flex gap-2">
            <Button onClick={handleDownload} disabled={isDownloading} className="flex-1">
              {isDownloading ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Downloading... {downloadProgress}%
                </>
              ) : (
                <>
                  <Download className="h-4 w-4 mr-2" />
                  Download Video
                </>
              )}
            </Button>
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {availableFormats.length > 0 && (
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">Available formats:</span>
          <div className="flex gap-2">
            {availableFormats.map(format => (
              <Button
                key={format.format}
                variant={selectedFormat === format.format ? 'default' : 'outline'}
                size="sm"
                onClick={() => handleFormatSwitch(format.format)}
              >
                {format.format}
              </Button>
            ))}
          </div>
        </div>
      )}

      {codecSupported && (
        <div className="flex items-center gap-2 text-sm text-green-600">
          <CheckCircle className="h-4 w-4" />
          <span>Codec supported - Ready to play</span>
        </div>
      )}

      <video
        ref={videoRef}
        controls
        muted
        playsInline
        preload="metadata"
        className="w-full rounded-lg bg-black"
        onError={handleVideoError}
      >
        <source src={currentUrl} type={contentType} />
        {availableFormats.map(format => (
          <source
            key={format.format}
            src={format.url}
            type={detector.getMimeTypeForFormat(format.format)}
          />
        ))}
        Your browser does not support the video tag.
      </video>

      <div className="flex gap-2">
        <Button
          variant="outline"
          onClick={handleDownload}
          disabled={isDownloading}
          className="flex-1"
        >
          {isDownloading ? (
            <>
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              {downloadProgress}%
            </>
          ) : (
            <>
              <Download className="h-4 w-4 mr-2" />
              Download
            </>
          )}
        </Button>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
    </div>
  );
}
