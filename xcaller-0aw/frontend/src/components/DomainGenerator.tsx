import { useState } from 'react';
import { useGenerateDomains, useIsAdmin } from '../hooks/useQueries';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Zap, Clock, Lock } from 'lucide-react';
import { toast } from 'sonner';
import { useInternetIdentity } from '../hooks/useInternetIdentity';

export default function DomainGenerator() {
  const { identity } = useInternetIdentity();
  const { data: isAdmin, isLoading: isAdminLoading } = useIsAdmin();
  const generateMutation = useGenerateDomains();
  const [mode, setMode] = useState<'instant' | 'scheduled'>('instant');
  const [domainInput, setDomainInput] = useState('');
  const [batchSize, setBatchSize] = useState('5');
  const [delay, setDelay] = useState('1000');

  const isAuthenticated = !!identity;

  const handleGenerate = async () => {
    if (!isAuthenticated) {
      toast.error('Please login to generate domains');
      return;
    }

    if (!isAdmin) {
      toast.error('Only admins can generate domains');
      return;
    }

    const urls = domainInput
      .split('\n')
      .map(url => url.trim())
      .filter(url => url.length > 0);

    if (urls.length === 0) {
      toast.error('Please enter at least one domain URL');
      return;
    }

    try {
      if (mode === 'instant') {
        await generateMutation.mutateAsync(urls);
        toast.success(`Generated ${urls.length} domains!`);
        setDomainInput('');
      } else {
        const size = parseInt(batchSize) || 5;
        const delayMs = parseInt(delay) || 1000;
        
        for (let i = 0; i < urls.length; i += size) {
          const batch = urls.slice(i, i + size);
          await generateMutation.mutateAsync(batch);
          toast.success(`Generated batch ${Math.floor(i / size) + 1} (${batch.length} domains)`);
          
          if (i + size < urls.length) {
            await new Promise(resolve => setTimeout(resolve, delayMs));
          }
        }
        
        toast.success('All batches generated successfully!');
        setDomainInput('');
      }
    } catch (error) {
      toast.error('Failed to generate domains');
    }
  };

  if (isAdminLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAuthenticated || !isAdmin) {
    return (
      <Alert className="border-destructive/50 bg-destructive/5">
        <Lock className="h-5 w-5 text-destructive" />
        <AlertDescription className="text-base">
          {!isAuthenticated 
            ? 'Please login to access domain generation features.'
            : 'Only administrators can generate domains. This feature is restricted to maintain data quality.'}
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex gap-2">
        <Button
          variant={mode === 'instant' ? 'default' : 'outline'}
          onClick={() => setMode('instant')}
          className="flex-1"
        >
          <Zap className="h-4 w-4 mr-2" />
          Instant Generation
        </Button>
        <Button
          variant={mode === 'scheduled' ? 'default' : 'outline'}
          onClick={() => setMode('scheduled')}
          className="flex-1"
        >
          <Clock className="h-4 w-4 mr-2" />
          Scheduled Batches
        </Button>
      </div>

      <Card className="p-4 space-y-4">
        <div className="space-y-2">
          <Label htmlFor="domains">Domain URLs (one per line)</Label>
          <Textarea
            id="domains"
            placeholder="https://example1.com&#10;https://example2.com&#10;https://example3.com"
            value={domainInput}
            onChange={(e) => setDomainInput(e.target.value)}
            rows={8}
            className="font-mono text-sm"
          />
          <p className="text-sm text-muted-foreground">
            Enter one domain URL per line. All URLs will be added to the collection.
          </p>
        </div>

        {mode === 'scheduled' && (
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="batchSize">Batch Size</Label>
              <Input
                id="batchSize"
                type="number"
                min="1"
                value={batchSize}
                onChange={(e) => setBatchSize(e.target.value)}
                placeholder="5"
              />
              <p className="text-xs text-muted-foreground">
                Number of domains per batch
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="delay">Delay (ms)</Label>
              <Input
                id="delay"
                type="number"
                min="0"
                value={delay}
                onChange={(e) => setDelay(e.target.value)}
                placeholder="1000"
              />
              <p className="text-xs text-muted-foreground">
                Delay between batches in milliseconds
              </p>
            </div>
          </div>
        )}

        <Button
          onClick={handleGenerate}
          disabled={generateMutation.isPending || !domainInput.trim()}
          className="w-full"
          size="lg"
        >
          {generateMutation.isPending ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              {mode === 'instant' ? <Zap className="h-4 w-4 mr-2" /> : <Clock className="h-4 w-4 mr-2" />}
              Generate Domains
            </>
          )}
        </Button>
      </Card>

      <Alert>
        <AlertDescription>
          <strong>Tip:</strong> Use instant generation for small batches. For large collections, use scheduled batches to avoid overwhelming the system.
        </AlertDescription>
      </Alert>
    </div>
  );
}
