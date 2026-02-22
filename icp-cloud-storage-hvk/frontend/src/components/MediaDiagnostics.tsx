import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Alert, AlertDescription } from './ui/alert';
import { CheckCircle, XCircle, Info, RefreshCw } from 'lucide-react';
import { getVideoCodecDetector, type BrowserCodecCapabilities } from '../lib/videoCodecDetector';
import { useSubmitMediaDiagnostics } from '../hooks/useQueries';
import { toast } from 'sonner';
import type { MediaDiagnostics as MediaDiagnosticsType } from '../backend';

export default function MediaDiagnostics() {
  const [diagnostics, setDiagnostics] = useState<BrowserCodecCapabilities | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const submitDiagnostics = useSubmitMediaDiagnostics();

  const runDiagnostics = async () => {
    setIsRunning(true);
    try {
      const detector = getVideoCodecDetector();
      const capabilities = detector.detectCapabilities();
      setDiagnostics(capabilities);

      // Submit to backend
      const diagnosticsData: MediaDiagnosticsType = {
        browserId: capabilities.browserId,
        supportedCodecs: capabilities.supportedCodecs
          .filter(c => c.supported)
          .map(c => c.codec),
        supportedFormats: capabilities.supportedCodecs
          .filter(c => c.supported)
          .map(c => c.format)
          .filter((v, i, a) => a.indexOf(v) === i), // unique
        testedAt: BigInt(capabilities.testedAt.getTime() * 1000000),
        metadata: [
          ['browserName', capabilities.browserName],
          ['browserVersion', capabilities.browserVersion],
          ['recommendedFormat', capabilities.recommendedFormat || 'none'],
        ],
      };

      await submitDiagnostics.mutateAsync(diagnosticsData);
      toast.success('Diagnostics submitted successfully');
    } catch (error) {
      console.error('Diagnostics error:', error);
      toast.error('Failed to run diagnostics');
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Media Codec Diagnostics</CardTitle>
        <CardDescription>
          Test your browser's video codec support and compatibility
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button onClick={runDiagnostics} disabled={isRunning}>
          {isRunning ? (
            <>
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              Running Diagnostics...
            </>
          ) : (
            <>
              <Info className="h-4 w-4 mr-2" />
              Run Diagnostics
            </>
          )}
        </Button>

        {diagnostics && (
          <div className="space-y-4">
            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                <div className="space-y-1">
                  <p><strong>Browser:</strong> {diagnostics.browserName} {diagnostics.browserVersion}</p>
                  <p><strong>Recommended Format:</strong> {diagnostics.recommendedFormat || 'None'}</p>
                  <p><strong>Tested:</strong> {diagnostics.testedAt.toLocaleString()}</p>
                </div>
              </AlertDescription>
            </Alert>

            <div>
              <h4 className="text-sm font-medium mb-2">Codec Support</h4>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Codec</TableHead>
                    <TableHead>Format</TableHead>
                    <TableHead>MIME Type</TableHead>
                    <TableHead>Support</TableHead>
                    <TableHead>Confidence</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {diagnostics.supportedCodecs.map((codec, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{codec.codec}</TableCell>
                      <TableCell>{codec.format}</TableCell>
                      <TableCell className="text-xs text-muted-foreground">
                        {codec.mimeType}
                      </TableCell>
                      <TableCell>
                        {codec.supported ? (
                          <Badge variant="default" className="gap-1">
                            <CheckCircle className="h-3 w-3" />
                            Supported
                          </Badge>
                        ) : (
                          <Badge variant="destructive" className="gap-1">
                            <XCircle className="h-3 w-3" />
                            Not Supported
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge variant={
                          codec.confidence === 'probably' ? 'default' :
                          codec.confidence === 'maybe' ? 'secondary' : 'outline'
                        }>
                          {codec.confidence}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
