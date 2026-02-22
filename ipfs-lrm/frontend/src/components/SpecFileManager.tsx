import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { Textarea } from '@/components/ui/textarea';
import { FileText, CheckCircle, AlertCircle, RefreshCw, Trash2 } from 'lucide-react';
import { useGetSpecFileStatus, useCheckAndConvertSpecFile, useDeduplicateSpecFile } from '@/hooks/useQueries';
import { toast } from 'sonner';
import { useState } from 'react';

export default function SpecFileManager() {
  const { data: specStatus, isLoading, error } = useGetSpecFileStatus();
  const convertMutation = useCheckAndConvertSpecFile();
  const deduplicateMutation = useDeduplicateSpecFile();
  const [specContent, setSpecContent] = useState('');
  const [showDeduplicateSection, setShowDeduplicateSection] = useState(false);

  const handleConvert = async () => {
    try {
      const result = await convertMutation.mutateAsync();
      if (result === 'No conversion needed') {
        toast.info('Specification file already in correct format');
      } else {
        toast.success('Successfully converted spec.md to spec.ml');
      }
    } catch (error) {
      toast.error('Failed to convert specification file');
      console.error('Conversion error:', error);
    }
  };

  const handleRemoveDuplicates = async () => {
    if (!specContent.trim()) {
      toast.error('Please paste your spec.md content first');
      return;
    }

    try {
      const cleanedContent = await deduplicateMutation.mutateAsync(specContent);
      setSpecContent(cleanedContent);
      toast.success('Duplicates removed successfully! The cleaned content is shown below.');
    } catch (error) {
      toast.error('Failed to remove duplicates from specification file');
      console.error('Deduplication error:', error);
    }
  };

  const getStatusBadge = () => {
    if (!specStatus) return null;
    
    if (specStatus === 'spec.ml') {
      return <Badge variant="default" className="bg-green-600">spec.ml</Badge>;
    } else if (specStatus === 'yaml') {
      return <Badge variant="default" className="bg-blue-600">.yaml</Badge>;
    } else {
      return <Badge variant="secondary">spec.md</Badge>;
    }
  };

  const needsConversion = specStatus === 'spec.md';

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Specification File Management
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Failed to load specification file status
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Specification File Management
        </CardTitle>
        <CardDescription>
          Manage and convert specification file formats, remove duplicates
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {isLoading ? (
          <div className="space-y-3">
            <Skeleton className="h-4 w-48" />
            <Skeleton className="h-10 w-full" />
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
              <div className="space-y-1">
                <p className="text-sm font-medium">Current Format</p>
                <div className="flex items-center gap-2">
                  {getStatusBadge()}
                  {!needsConversion && (
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  )}
                </div>
              </div>
              
              {needsConversion && (
                <Button 
                  onClick={handleConvert}
                  disabled={convertMutation.isPending}
                  size="sm"
                >
                  {convertMutation.isPending ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      Converting...
                    </>
                  ) : (
                    <>
                      <FileText className="h-4 w-4 mr-2" />
                      Convert to spec.ml
                    </>
                  )}
                </Button>
              )}
            </div>

            {needsConversion ? (
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Your specification file is in Markdown format. Convert it to spec.ml for enhanced functionality.
                </AlertDescription>
              </Alert>
            ) : (
              <Alert className="border-green-600/20 bg-green-50 dark:bg-green-950/20">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-800 dark:text-green-200">
                  Your specification file is already in the correct format. No conversion needed.
                </AlertDescription>
              </Alert>
            )}

            <div className="border-t pt-4 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium">Remove Duplicate Lines</h3>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowDeduplicateSection(!showDeduplicateSection)}
                >
                  {showDeduplicateSection ? 'Hide' : 'Show'}
                </Button>
              </div>

              {showDeduplicateSection && (
                <div className="space-y-3">
                  <p className="text-sm text-muted-foreground">
                    Paste your spec.md content below to detect and remove duplicate lines while preserving formatting.
                  </p>
                  
                  <Textarea
                    placeholder="Paste your spec.md content here..."
                    value={specContent}
                    onChange={(e) => setSpecContent(e.target.value)}
                    className="min-h-[200px] font-mono text-sm"
                  />

                  <Button
                    onClick={handleRemoveDuplicates}
                    disabled={deduplicateMutation.isPending || !specContent.trim()}
                    className="w-full"
                  >
                    {deduplicateMutation.isPending ? (
                      <>
                        <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                        Removing Duplicates...
                      </>
                    ) : (
                      <>
                        <Trash2 className="h-4 w-4 mr-2" />
                        Remove Duplicate Lines
                      </>
                    )}
                  </Button>

                  {deduplicateMutation.isSuccess && (
                    <Alert className="border-green-600/20 bg-green-50 dark:bg-green-950/20">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <AlertDescription className="text-green-800 dark:text-green-200">
                        Duplicates removed successfully! Copy the cleaned content above and replace your spec.md file.
                      </AlertDescription>
                    </Alert>
                  )}
                </div>
              )}
            </div>

            <div className="text-xs text-muted-foreground space-y-1">
              <p>• spec.ml or .yaml files are preferred formats</p>
              <p>• Conversion is idempotent and won't overwrite existing files</p>
              <p>• The process checks for existing spec.ml or .yaml before converting</p>
              <p>• Duplicate removal preserves unique entries and formatting integrity</p>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
