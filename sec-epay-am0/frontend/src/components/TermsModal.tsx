import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { useAcceptTerms } from '../hooks/useQueries';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useQueryClient } from '@tanstack/react-query';
import { AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';
import type { TermsVersion } from '../backend';

interface TermsModalProps {
  terms: TermsVersion;
}

export default function TermsModal({ terms }: TermsModalProps) {
  const [hasRead, setHasRead] = useState(false);
  const acceptTerms = useAcceptTerms();
  const { clear } = useInternetIdentity();
  const queryClient = useQueryClient();

  const formatDate = (timestamp: bigint) => {
    return new Date(Number(timestamp) / 1_000_000).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const handleAccept = async () => {
    try {
      const metadata = JSON.stringify({
        userAgent: navigator.userAgent,
        timestamp: Date.now(),
        version: Number(terms.version),
      });

      await acceptTerms.mutateAsync({
        termsVersionId: terms.id,
        metadata,
      });

      toast.success('Terms accepted successfully');
      queryClient.invalidateQueries({ queryKey: ['hasAcceptedTerms'] });
    } catch (error) {
      toast.error('Failed to accept terms');
      console.error(error);
    }
  };

  const handleLogout = async () => {
    await clear();
    queryClient.clear();
    toast.info('Logged out successfully');
  };

  return (
    <Dialog open={true} modal>
      <DialogContent className="max-w-3xl max-h-[90vh]" onPointerDownOutside={(e) => e.preventDefault()} onEscapeKeyDown={(e) => e.preventDefault()}>
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-2xl flex items-center">
              {terms.criticalUpdate && (
                <AlertTriangle className="mr-2 h-6 w-6 text-destructive" />
              )}
              {terms.title}
            </DialogTitle>
            <div className="flex gap-2">
              {terms.criticalUpdate && (
                <Badge variant="destructive">Critical Update</Badge>
              )}
              <Badge variant="outline">v{Number(terms.version)}</Badge>
            </div>
          </div>
          <DialogDescription>
            Effective {formatDate(terms.effectiveDate)} • Please review and accept to continue
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="h-[400px] pr-4 border border-border rounded-md p-4">
          <div className="prose prose-sm dark:prose-invert max-w-none">
            <div className="whitespace-pre-wrap text-sm">{terms.content}</div>
          </div>

          {terms.changelog && (
            <div className="mt-6 pt-6 border-t border-border">
              <h3 className="text-sm font-semibold mb-2">What's Changed</h3>
              <div className="text-sm text-muted-foreground whitespace-pre-wrap">
                {terms.changelog}
              </div>
            </div>
          )}
        </ScrollArea>

        <div className="flex items-center space-x-2 py-2">
          <Checkbox
            id="terms-read"
            checked={hasRead}
            onCheckedChange={(checked) => setHasRead(checked === true)}
          />
          <label
            htmlFor="terms-read"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
          >
            I have read and agree to the Terms of Service
          </label>
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-2">
          <Button
            variant="outline"
            onClick={handleLogout}
            disabled={acceptTerms.isPending}
            className="w-full sm:w-auto"
          >
            Logout
          </Button>
          <Button
            onClick={handleAccept}
            disabled={!hasRead || acceptTerms.isPending}
            className="w-full sm:w-auto"
          >
            {acceptTerms.isPending ? 'Accepting...' : 'Accept & Continue'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
