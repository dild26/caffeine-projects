import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { RefreshCw, FileText, Code, DollarSign, ExternalLink, AlertCircle, Settings, Activity } from 'lucide-react';
import { toast } from 'sonner';
import SpecFileManager from './SpecFileManager';
import { useFetchIPFSContent, useCheckIPFSHealth, useStorePythonFile, useStoreReferralTransaction } from '@/hooks/useQueries';

const IPFS_URL = 'https://ipfs.io/ipfs/bafybeid7ywkza6de7ltcq6qn5q2r3q2crwqeah7364bt2ivxa3kzogb42a/_setCoin';

interface IPFSContent {
  pythonFiles: Array<{ name: string; content: string }>;
  referralTransactions: Array<{ id: string; details: string }>;
  generalContent: string;
}

function parseIPFSContent(text: string): IPFSContent {
  // Parse Python files from the content
  const pythonFiles: Array<{ name: string; content: string }> = [];
  const pythonFileRegex = /(?:^|\n)(?:# |\/\/ |\/\* )?([^\n]*\.py)[\s\S]*?```python\n([\s\S]*?)```/gi;
  let match;
  
  while ((match = pythonFileRegex.exec(text)) !== null) {
    pythonFiles.push({
      name: match[1].trim() || `python_file_${pythonFiles.length + 1}.py`,
      content: match[2].trim()
    });
  }
  
  // Look for Python code blocks without explicit filenames
  const codeBlockRegex = /```python\n([\s\S]*?)```/gi;
  let codeMatch;
  let codeBlockIndex = 0;
  
  while ((codeMatch = codeBlockRegex.exec(text)) !== null) {
    // Check if this code block is already captured with a filename
    const isAlreadyCaptured = pythonFiles.some(file => 
      file.content === codeMatch[1].trim()
    );
    
    if (!isAlreadyCaptured) {
      pythonFiles.push({
        name: `code_block_${++codeBlockIndex}.py`,
        content: codeMatch[1].trim()
      });
    }
  }
  
  // Parse referral transactions
  const referralTransactions: Array<{ id: string; details: string }> = [];
  const transactionRegex = /1\s*M\s*SEToken\s*Txn[^\n]*(?:\n([^\n]+))?/gi;
  let txnMatch;
  let txnIndex = 0;
  
  while ((txnMatch = transactionRegex.exec(text)) !== null) {
    referralTransactions.push({
      id: `txn_${++txnIndex}`,
      details: txnMatch[0].trim()
    });
  }
  
  // Also look for transaction-like patterns
  const txnPatterns = [
    /referral[^\n]*transaction[^\n]*/gi,
    /transaction[^\n]*referral[^\n]*/gi,
    /SEToken[^\n]*transaction[^\n]*/gi
  ];
  
  txnPatterns.forEach(pattern => {
    let patternMatch;
    while ((patternMatch = pattern.exec(text)) !== null) {
      const isAlreadyCaptured = referralTransactions.some(txn => 
        txn.details === patternMatch[0].trim()
      );
      
      if (!isAlreadyCaptured) {
        referralTransactions.push({
          id: `txn_${++txnIndex}`,
          details: patternMatch[0].trim()
        });
      }
    }
  });
  
  return {
    pythonFiles,
    referralTransactions,
    generalContent: text
  };
}

export default function IPFSContentViewer() {
  const [activeTab, setActiveTab] = useState('overview');
  const [parsedContent, setParsedContent] = useState<IPFSContent | null>(null);
  
  const { data: ipfsContent, isLoading, error, refetch } = useFetchIPFSContent(IPFS_URL);
  const { data: healthStatus, isLoading: isHealthLoading } = useCheckIPFSHealth();
  const storePythonFile = useStorePythonFile();
  const storeReferralTransaction = useStoreReferralTransaction();

  // Parse content when it's fetched
  useEffect(() => {
    if (ipfsContent) {
      const parsed = parseIPFSContent(ipfsContent);
      setParsedContent(parsed);
      
      // Store parsed data in backend
      parsed.pythonFiles.forEach(file => {
        storePythonFile.mutate({ fileName: file.name, content: file.content });
      });
      
      parsed.referralTransactions.forEach(txn => {
        storeReferralTransaction.mutate({ transactionId: txn.id, details: txn.details });
      });
    }
  }, [ipfsContent]);

  const handleRefresh = () => {
    refetch();
    toast.success('Content refreshed successfully');
  };

  const isHealthy = healthStatus && !healthStatus.includes('error') && !healthStatus.includes('Error');

  if (error) {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">IPFS Content Explorer</h2>
          <p className="text-muted-foreground mb-6">
            Fetch and explore content from the InterPlanetary File System
          </p>
        </div>
        
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Failed to fetch IPFS content: {error instanceof Error ? error.message : 'Unknown error'}
          </AlertDescription>
        </Alert>
        
        <div className="text-center">
          <Button onClick={handleRefresh} variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Hero Section */}
      <div className="text-center gradient-bg p-8 rounded-lg">
        <h2 className="text-3xl font-bold mb-4">IPFS Content Explorer</h2>
        <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
          Explore decentralized content from the InterPlanetary File System. 
          View Python files, referral transactions, and general content from the specified IPFS hash.
        </p>
        
        <div className="flex items-center justify-center gap-4 mb-4">
          <Button onClick={handleRefresh} disabled={isLoading} variant="outline">
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh Content
          </Button>
          
          <Button variant="ghost" asChild>
            <a href={IPFS_URL} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="h-4 w-4 mr-2" />
              View on IPFS
            </a>
          </Button>
        </div>
        
        <div className="flex items-center justify-center gap-6 text-sm flex-wrap">
          {parsedContent && (
            <>
              <div className="flex items-center gap-2">
                <Code className="h-4 w-4 text-primary" />
                <span>{parsedContent.pythonFiles.length} Python files</span>
              </div>
              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-primary" />
                <span>{parsedContent.referralTransactions.length} Transactions</span>
              </div>
            </>
          )}
          <div className="flex items-center gap-2">
            <Activity className={`h-4 w-4 ${isHealthy ? 'text-green-500' : 'text-yellow-500'}`} />
            <span>
              {isHealthLoading ? 'Checking...' : isHealthy ? 'IPFS Healthy' : 'IPFS Status Unknown'}
            </span>
          </div>
        </div>
      </div>

      {/* Specification File Manager */}
      <SpecFileManager />

      {/* Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="python" className="flex items-center gap-2">
            <Code className="h-4 w-4" />
            Python Files
          </TabsTrigger>
          <TabsTrigger value="transactions" className="flex items-center gap-2">
            <DollarSign className="h-4 w-4" />
            Transactions
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Settings
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>General Content</CardTitle>
              <CardDescription>
                Raw content from the IPFS directory (fetched via Motoko backend)
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              ) : (
                <ScrollArea className="h-96 w-full">
                  <pre className="text-sm font-mono whitespace-pre-wrap break-words p-4 code-block">
                    {parsedContent?.generalContent || 'No content available'}
                  </pre>
                </ScrollArea>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="python" className="space-y-4">
          {isLoading ? (
            <div className="grid gap-4">
              {[1, 2].map((i) => (
                <Card key={i}>
                  <CardHeader>
                    <Skeleton className="h-6 w-48" />
                    <Skeleton className="h-4 w-32" />
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-32 w-full" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : !parsedContent || parsedContent.pythonFiles.length === 0 ? (
            <Card>
              <CardContent className="text-center py-8">
                <Code className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No Python files found in the IPFS content</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {parsedContent.pythonFiles.map((file, index) => (
                <Card key={index}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center gap-2">
                        <Code className="h-5 w-5 text-primary" />
                        {file.name}
                      </CardTitle>
                      <Badge variant="secondary">Python</Badge>
                    </div>
                    <CardDescription>
                      {file.content.split('\n').length} lines of code
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ScrollArea className="h-64 w-full">
                      <pre className="text-sm font-mono whitespace-pre-wrap break-words p-4 code-block">
                        {file.content}
                      </pre>
                    </ScrollArea>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="transactions" className="space-y-4">
          {isLoading ? (
            <div className="grid gap-4">
              {[1, 2, 3].map((i) => (
                <Card key={i}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <Skeleton className="h-5 w-32" />
                      <Skeleton className="h-5 w-20" />
                    </div>
                    <Skeleton className="h-4 w-full mt-2" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : !parsedContent || parsedContent.referralTransactions.length === 0 ? (
            <Card>
              <CardContent className="text-center py-8">
                <DollarSign className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No referral transactions found in the IPFS content</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {parsedContent.referralTransactions.map((transaction, index) => (
                <Card key={index}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <DollarSign className="h-4 w-4 text-primary" />
                        <span className="font-medium">Transaction {index + 1}</span>
                      </div>
                      <Badge variant="outline">SEToken</Badge>
                    </div>
                    <Separator className="my-2" />
                    <p className="text-sm font-mono bg-muted p-3 rounded border">
                      {transaction.details}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Application Settings</CardTitle>
              <CardDescription>
                Configure application behavior and view IPFS status
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-muted rounded-lg">
                  <h3 className="font-medium mb-2">IPFS Configuration</h3>
                  <p className="text-sm text-muted-foreground mb-2">Current IPFS URL:</p>
                  <code className="text-xs bg-background p-2 rounded block break-all">
                    {IPFS_URL}
                  </code>
                </div>
                
                <Separator />
                
                <div className="p-4 bg-muted rounded-lg">
                  <h3 className="font-medium mb-2 flex items-center gap-2">
                    <Activity className={`h-4 w-4 ${isHealthy ? 'text-green-500' : 'text-yellow-500'}`} />
                    IPFS Health Status
                  </h3>
                  {isHealthLoading ? (
                    <Skeleton className="h-4 w-48" />
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      Status: {isHealthy ? 'Healthy ✓' : 'Unknown'}
                    </p>
                  )}
                  {healthStatus && (
                    <code className="text-xs bg-background p-2 rounded block break-all mt-2">
                      {healthStatus.substring(0, 200)}...
                    </code>
                  )}
                </div>
                
                <Separator />
                
                <div className="p-4 bg-muted rounded-lg">
                  <h3 className="font-medium mb-2">Backend Integration</h3>
                  <p className="text-sm text-muted-foreground">
                    All IPFS operations are performed through the Motoko backend using HTTP outcalls.
                    Content is cached for 5 minutes to improve performance.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
