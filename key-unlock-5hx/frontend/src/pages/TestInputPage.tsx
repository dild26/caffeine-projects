import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useSubmitTestInput, useGetValidationRules } from '../hooks/useAppQueries';
import { toast } from 'sonner';
import { Send, AlertCircle, CheckCircle2, Shield, Info, XCircle } from 'lucide-react';
import type { TestInput } from '../backend';

export default function TestInputPage() {
  const [inputValue, setInputValue] = useState('');
  const [submissions, setSubmissions] = useState<TestInput[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { mutate: submitInput, isPending } = useSubmitTestInput();
  const { data: validationRules = [] } = useGetValidationRules();

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [submissions]);

  const parseValidationMessage = (message: string): string[] => {
    if (message === 'Input is valid') return [];
    
    const match = message.match(/Input contains restricted characters or patterns: (.+)/);
    if (match && match[1]) {
      return match[1].split(', ').map(p => p.trim());
    }
    
    return [];
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!inputValue.trim()) {
      toast.error('Please enter some text');
      return;
    }

    submitInput(inputValue, {
      onSuccess: (result) => {
        setSubmissions(prev => [...prev, result]);
        
        if (result.isValid) {
          toast.success('Input accepted! Your message is secure.');
          setInputValue('');
        } else {
          const problematicPatterns = parseValidationMessage(result.validationMessage);
          toast.error(
            <div className="space-y-2">
              <p className="font-semibold">Input validation failed</p>
              <p className="text-sm">Found {problematicPatterns.length} restricted pattern{problematicPatterns.length !== 1 ? 's' : ''}</p>
            </div>
          );
        }
      },
      onError: (error: any) => {
        toast.error(`Submission failed: ${error.message}`);
      }
    });
  };

  const formatTimestamp = (timestamp: bigint) => {
    const date = new Date(Number(timestamp) / 1000000);
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      second: '2-digit'
    });
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center gap-2">
            <Shield className="h-8 w-8 text-primary" />
            <h1 className="text-4xl font-bold">Test Input</h1>
          </div>
          <p className="text-xl text-muted-foreground">
            Secure data submission with real-time validation
          </p>
        </div>

        <Card className="border-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Info className="h-5 w-5 text-primary" />
              Security Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-muted-foreground">
              This interface validates your input in real-time to prevent potentially unsafe characters or code injection patterns.
            </p>
            <div className="space-y-2">
              <p className="text-sm font-medium">Restricted patterns include:</p>
              <div className="flex flex-wrap gap-2">
                {validationRules.map((rule, index) => (
                  <Badge key={index} variant="outline" className="font-mono text-xs">
                    {rule}
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2">
          <CardHeader>
            <CardTitle>Chat Interface</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <ScrollArea className="h-[400px] w-full rounded-lg border p-4 bg-muted/20" ref={scrollRef}>
              <div className="space-y-4">
                {submissions.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-center py-12">
                    <Shield className="h-12 w-12 text-muted-foreground/50 mb-4" />
                    <p className="text-muted-foreground">
                      No messages yet. Start by submitting your first secure message below.
                    </p>
                  </div>
                ) : (
                  submissions.map((submission) => {
                    const problematicPatterns = parseValidationMessage(submission.validationMessage);
                    
                    return (
                      <div
                        key={submission.id.toString()}
                        className={`flex gap-3 ${
                          submission.isValid ? 'justify-end' : 'justify-start'
                        }`}
                      >
                        <div
                          className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                            submission.isValid
                              ? 'bg-primary text-primary-foreground'
                              : 'bg-destructive/10 border border-destructive/20'
                          }`}
                        >
                          <div className="flex items-start gap-2 mb-1">
                            {submission.isValid ? (
                              <CheckCircle2 className="h-4 w-4 mt-0.5 flex-shrink-0" />
                            ) : (
                              <XCircle className="h-4 w-4 mt-0.5 flex-shrink-0 text-destructive" />
                            )}
                            <div className="flex-1 min-w-0">
                              <p className="text-sm break-words whitespace-pre-wrap">
                                {submission.content}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center justify-between gap-2 mt-2 pt-2 border-t border-current/20">
                            <span className="text-xs opacity-70">
                              {formatTimestamp(submission.timestamp)}
                            </span>
                            {!submission.isValid && (
                              <span className="text-xs font-medium text-destructive">
                                Rejected
                              </span>
                            )}
                          </div>
                          {!submission.isValid && problematicPatterns.length > 0 && (
                            <Alert className="mt-3 bg-destructive/5 border-destructive/20">
                              <AlertCircle className="h-4 w-4 text-destructive" />
                              <AlertDescription className="text-xs">
                                <p className="font-semibold text-destructive mb-2">
                                  Found {problematicPatterns.length} restricted pattern{problematicPatterns.length !== 1 ? 's' : ''}:
                                </p>
                                <div className="flex flex-wrap gap-1.5">
                                  {problematicPatterns.map((pattern, idx) => (
                                    <Badge 
                                      key={idx} 
                                      variant="destructive" 
                                      className="font-mono text-xs"
                                    >
                                      {pattern}
                                    </Badge>
                                  ))}
                                </div>
                                <p className="mt-2 text-destructive/80">
                                  Please remove or rephrase these patterns and try again.
                                </p>
                              </AlertDescription>
                            </Alert>
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </ScrollArea>

            <form onSubmit={handleSubmit} className="space-y-3">
              <Textarea
                placeholder="Type your message here... (will be validated for security)"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                className="min-h-[100px] resize-none"
                disabled={isPending}
              />
              <div className="flex items-center justify-between">
                <p className="text-xs text-muted-foreground">
                  {inputValue.length} characters
                </p>
                <Button
                  type="submit"
                  disabled={isPending || !inputValue.trim()}
                  className="gap-2"
                >
                  {isPending ? (
                    <>
                      <span className="animate-spin">⏳</span>
                      Validating...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4" />
                      Submit
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        <Card className="border-2 bg-muted/30">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <Shield className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="text-sm font-medium">Security Guard Active</p>
                <p className="text-xs text-muted-foreground">
                  All submissions are automatically scanned for unsafe characters and code injection patterns. 
                  Only validated content will be accepted and stored. When validation fails, all problematic patterns are listed at once.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
