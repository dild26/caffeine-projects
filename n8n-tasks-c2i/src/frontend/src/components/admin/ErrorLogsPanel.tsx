import { useState } from 'react';
import { useGetParsingErrors, useApplySuggestedFix } from '../../hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { toast } from 'sonner';
import { AlertTriangle, CheckCircle, Lightbulb, TrendingUp } from 'lucide-react';

export default function ErrorLogsPanel() {
  const { data: errors, isLoading } = useGetParsingErrors();
  const applySuggestedFix = useApplySuggestedFix();
  const [selectedError, setSelectedError] = useState<string | null>(null);

  const handleApplyFix = async (fileName: string, fix: string) => {
    try {
      await applySuggestedFix.mutateAsync({ fileName, fix });
      toast.success(`Applied fix to ${fileName}`);
    } catch (error) {
      toast.error('Failed to apply fix');
    }
  };

  const errorPatterns = errors?.reduce((acc, error) => {
    const pattern = error.errorMessage.split(':')[0];
    acc[pattern] = (acc[pattern] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const topErrors = errorPatterns
    ? Object.entries(errorPatterns)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 5)
    : [];

  if (isLoading) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <p>Loading error logs...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <img
              src="/assets/generated/learning-system-icon-transparent.dim_64x64.png"
              alt="Learning System"
              className="h-6 w-6"
            />
            Error Learning System
          </CardTitle>
          <CardDescription>
            Analyzing parsing errors to identify patterns and suggest improvements
          </CardDescription>
        </CardHeader>
        <CardContent>
          {topErrors.length > 0 ? (
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="h-5 w-5 text-primary" />
                <h3 className="font-semibold">Most Common Error Patterns</h3>
              </div>
              {topErrors.map(([pattern, count]) => (
                <div key={pattern} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <span className="font-mono text-sm">{pattern}</span>
                  <Badge variant="secondary">{count} occurrences</Badge>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <CheckCircle className="h-12 w-12 mx-auto mb-2 text-green-500" />
              <p>No errors logged yet - great job!</p>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <img
              src="/assets/generated/error-handling-icon-transparent.dim_64x64.png"
              alt="Error Handling"
              className="h-6 w-6"
            />
            Parsing Error Logs ({errors?.length || 0})
          </CardTitle>
          <CardDescription>Detailed error logs with suggested fixes</CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[500px] pr-4">
            {errors && errors.length > 0 ? (
              <div className="space-y-3">
                {errors.map((error, index) => (
                  <Alert
                    key={index}
                    variant={error.severity === 'error' ? 'destructive' : 'default'}
                    className="cursor-pointer hover:bg-muted/50 transition-colors"
                    onClick={() => setSelectedError(selectedError === error.fileName ? null : error.fileName)}
                  >
                    <AlertTriangle className="h-4 w-4" />
                    <AlertTitle className="flex items-center justify-between">
                      <span>{error.fileName}</span>
                      <Badge variant="outline">{error.severity}</Badge>
                    </AlertTitle>
                    <AlertDescription>
                      <p className="font-semibold mt-2">Error: {error.errorMessage}</p>
                      <div className="flex items-start gap-2 mt-2 p-2 bg-background rounded">
                        <Lightbulb className="h-4 w-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                        <div className="flex-1">
                          <p className="text-sm font-medium">Suggested Fix:</p>
                          <p className="text-sm">{error.suggestedFix}</p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between mt-3">
                        <span className="text-xs text-muted-foreground">
                          {new Date(Number(error.timestamp) / 1000000).toLocaleString()}
                        </span>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleApplyFix(error.fileName, error.suggestedFix);
                          }}
                          disabled={applySuggestedFix.isPending}
                        >
                          Apply Fix
                        </Button>
                      </div>
                    </AlertDescription>
                  </Alert>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                <CheckCircle className="h-16 w-16 mx-auto mb-4 text-green-500" />
                <p>No parsing errors logged</p>
              </div>
            )}
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}
