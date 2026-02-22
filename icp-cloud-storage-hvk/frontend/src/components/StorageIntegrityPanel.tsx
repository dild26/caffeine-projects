import { useState } from 'react';
import { useReindexStorage, useVerifyStorageIntegrity } from '../hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Alert, AlertDescription } from './ui/alert';
import { Progress } from './ui/progress';
import { Badge } from './ui/badge';
import { RefreshCw, Shield, CheckCircle, AlertTriangle, Database } from 'lucide-react';
import { toast } from 'sonner';

export default function StorageIntegrityPanel() {
  const reindexStorage = useReindexStorage();
  const verifyIntegrity = useVerifyStorageIntegrity();
  const [verificationResult, setVerificationResult] = useState<any>(null);

  const handleReindex = async () => {
    try {
      const result = await reindexStorage.mutateAsync();
      toast.success(`Reindexed ${result.restoredFiles} files and ${result.restoredFolders} folders`);
    } catch (error) {
      toast.error('Failed to reindex storage');
      console.error(error);
    }
  };

  const handleVerify = async () => {
    try {
      const result = await verifyIntegrity.mutateAsync();
      setVerificationResult(result);
      
      if (result.healthy) {
        toast.success(`Storage integrity verified: ${result.verified} files OK`);
      } else {
        toast.warning(`Found ${result.issues.length} integrity issues`);
      }
    } catch (error) {
      toast.error('Failed to verify storage integrity');
      console.error(error);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-primary" />
          Storage Integrity & Recovery
        </CardTitle>
        <CardDescription>
          Reindex storage, verify integrity, and restore missing file references
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Reindex Storage</h4>
            <p className="text-xs text-muted-foreground">
              Rebuild file and folder indexes from localStorage backup
            </p>
            <Button
              onClick={handleReindex}
              disabled={reindexStorage.isPending}
              className="w-full"
            >
              {reindexStorage.isPending ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Reindexing...
                </>
              ) : (
                <>
                  <Database className="h-4 w-4 mr-2" />
                  Reindex Now
                </>
              )}
            </Button>
          </div>

          <div className="space-y-2">
            <h4 className="text-sm font-medium">Verify Integrity</h4>
            <p className="text-xs text-muted-foreground">
              Check all files have valid blob references and metadata
            </p>
            <Button
              onClick={handleVerify}
              disabled={verifyIntegrity.isPending}
              variant="outline"
              className="w-full"
            >
              {verifyIntegrity.isPending ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Verifying...
                </>
              ) : (
                <>
                  <Shield className="h-4 w-4 mr-2" />
                  Verify Integrity
                </>
              )}
            </Button>
          </div>
        </div>

        {verificationResult && (
          <Alert variant={verificationResult.healthy ? 'default' : 'destructive'}>
            {verificationResult.healthy ? (
              <CheckCircle className="h-4 w-4" />
            ) : (
              <AlertTriangle className="h-4 w-4" />
            )}
            <AlertDescription>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-medium">
                    {verificationResult.healthy ? 'Storage Healthy' : 'Issues Found'}
                  </span>
                  <Badge variant={verificationResult.healthy ? 'default' : 'destructive'}>
                    {verificationResult.verified}/{verificationResult.totalFiles} verified
                  </Badge>
                </div>
                
                {verificationResult.issues.length > 0 && (
                  <div className="mt-2 space-y-1">
                    <p className="text-sm font-medium">Issues:</p>
                    <ul className="text-xs space-y-1">
                      {verificationResult.issues.map((issue: string, index: number) => (
                        <li key={index} className="text-muted-foreground">• {issue}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </AlertDescription>
          </Alert>
        )}

        <Alert>
          <AlertDescription className="text-xs">
            <strong>Note:</strong> This system uses browser localStorage as a backup index for file metadata.
            Files uploaded with proper checksums are stored with integrity verification.
            Run reindex after browser data loss or to restore missing references.
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );
}

