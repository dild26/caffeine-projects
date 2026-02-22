import { useState } from 'react';
import { useGetDomains, useUpvoteDomain, useDownvoteDomain, useIncrementClickCount, useDeleteDomain, useAddDomain, useIsAdmin } from '../hooks/useQueries';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ThumbsUp, ThumbsDown, ExternalLink, Trash2, Plus, Loader2, Lock } from 'lucide-react';
import { toast } from 'sonner';
import { useInternetIdentity } from '../hooks/useInternetIdentity';

export default function DomainList() {
  const { identity } = useInternetIdentity();
  const { data: domains = [], isLoading } = useGetDomains();
  const { data: isAdmin } = useIsAdmin();
  const upvoteMutation = useUpvoteDomain();
  const downvoteMutation = useDownvoteDomain();
  const clickMutation = useIncrementClickCount();
  const deleteMutation = useDeleteDomain();
  const addMutation = useAddDomain();
  const [newDomain, setNewDomain] = useState('');
  const [sortBy, setSortBy] = useState<'votes' | 'clicks'>('votes');

  const isAuthenticated = !!identity;

  const sortedDomains = [...domains].sort((a, b) => {
    if (sortBy === 'votes') {
      const aScore = Number(a.upvotes) - Number(a.downvotes);
      const bScore = Number(b.upvotes) - Number(b.downvotes);
      return bScore - aScore;
    } else {
      return Number(b.clickCount) - Number(a.clickCount);
    }
  });

  const handleUpvote = async (url: string) => {
    try {
      await upvoteMutation.mutateAsync(url);
      toast.success('Upvoted!');
    } catch (error) {
      toast.error('Failed to upvote');
    }
  };

  const handleDownvote = async (url: string) => {
    try {
      await downvoteMutation.mutateAsync(url);
      toast.success('Downvoted!');
    } catch (error) {
      toast.error('Failed to downvote');
    }
  };

  const handleClick = async (url: string) => {
    try {
      await clickMutation.mutateAsync(url);
      window.open(url, '_blank', 'noopener,noreferrer');
    } catch (error) {
      console.error('Failed to track click:', error);
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };

  const handleDelete = async (url: string) => {
    if (!isAdmin) {
      toast.error('Only admins can delete domains');
      return;
    }
    try {
      await deleteMutation.mutateAsync(url);
      toast.success('Domain deleted');
    } catch (error) {
      toast.error('Failed to delete domain');
    }
  };

  const handleAddDomain = async () => {
    if (!newDomain.trim()) {
      toast.error('Please enter a domain URL');
      return;
    }
    if (!isAuthenticated) {
      toast.error('Please login to add domains');
      return;
    }
    try {
      await addMutation.mutateAsync(newDomain.trim());
      setNewDomain('');
      toast.success('Domain added!');
    } catch (error) {
      toast.error('Failed to add domain');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 flex gap-2">
          <Input
            placeholder="Enter domain URL (e.g., https://example.com)"
            value={newDomain}
            onChange={(e) => setNewDomain(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAddDomain()}
            disabled={!isAuthenticated}
          />
          <Button 
            onClick={handleAddDomain} 
            disabled={addMutation.isPending || !isAuthenticated}
            className="shrink-0"
          >
            {addMutation.isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <>
                <Plus className="h-4 w-4 mr-2" />
                Add
              </>
            )}
          </Button>
        </div>
        <div className="flex gap-2">
          <Button
            variant={sortBy === 'votes' ? 'default' : 'outline'}
            onClick={() => setSortBy('votes')}
            size="sm"
          >
            Sort by Votes
          </Button>
          <Button
            variant={sortBy === 'clicks' ? 'default' : 'outline'}
            onClick={() => setSortBy('clicks')}
            size="sm"
          >
            Sort by Clicks
          </Button>
        </div>
      </div>

      {!isAuthenticated && (
        <Alert className="border-muted-foreground/30 bg-muted/30">
          <Lock className="h-4 w-4" />
          <AlertDescription>
            Login to add new domains. Voting is available to all users.
          </AlertDescription>
        </Alert>
      )}

      {sortedDomains.length === 0 ? (
        <Card className="p-12 text-center">
          <p className="text-muted-foreground">
            No domains yet. {isAuthenticated ? 'Add your first domain above!' : 'Login to add the first domain!'}
          </p>
        </Card>
      ) : (
        <div className="space-y-3">
          {sortedDomains.map((domain) => {
            const score = Number(domain.upvotes) - Number(domain.downvotes);
            return (
              <Card key={domain.url} className="p-4 hover:shadow-md transition-shadow">
                <div className="flex items-center gap-4">
                  <div className="flex flex-col items-center gap-1 min-w-[60px]">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleUpvote(domain.url)}
                      disabled={upvoteMutation.isPending}
                      className="h-8 w-8 p-0"
                    >
                      <ThumbsUp className="h-4 w-4" />
                    </Button>
                    <Badge variant={score > 0 ? 'default' : score < 0 ? 'destructive' : 'secondary'}>
                      {score > 0 ? '+' : ''}{score}
                    </Badge>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDownvote(domain.url)}
                      disabled={downvoteMutation.isPending}
                      className="h-8 w-8 p-0"
                    >
                      <ThumbsDown className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="flex-1 min-w-0">
                    <button
                      onClick={() => handleClick(domain.url)}
                      className="text-left w-full group"
                    >
                      <p className="font-medium text-foreground group-hover:text-primary transition-colors truncate">
                        {domain.url}
                      </p>
                      <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <ThumbsUp className="h-3 w-3" />
                          {domain.upvotes.toString()}
                        </span>
                        <span className="flex items-center gap-1">
                          <ThumbsDown className="h-3 w-3" />
                          {domain.downvotes.toString()}
                        </span>
                        <span className="flex items-center gap-1">
                          <ExternalLink className="h-3 w-3" />
                          {domain.clickCount.toString()} clicks
                        </span>
                      </div>
                    </button>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleClick(domain.url)}
                      className="shrink-0"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                    {isAdmin && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(domain.url)}
                        disabled={deleteMutation.isPending}
                        className="shrink-0 text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
