import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ThumbsUp, ThumbsDown, CheckCircle, XCircle, Clock, Shield, AlertTriangle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';

interface ProposedPage {
  id: string;
  name: string;
  url: string;
  category: string;
  appName: string;
  discoveredBy: 'AI' | 'Manual';
  timestamp: number;
  contentHash: string;
  status: 'pending' | 'approved' | 'rejected';
  aiConfidence: number;
}

const MOCK_PROPOSED_PAGES: ProposedPage[] = [
  {
    id: '1',
    name: 'About Us',
    url: 'https://secoin-ep6.caffeine.xyz/about',
    category: 'Information',
    appName: 'SECoin',
    discoveredBy: 'AI',
    timestamp: Date.now() - 3600000,
    contentHash: 'a1b2c3d4e5f6',
    status: 'pending',
    aiConfidence: 0.95
  },
  {
    id: '2',
    name: 'Features',
    url: 'https://sitemaps-fwh.caffeine.xyz/features',
    category: 'Product',
    appName: 'SitemapAi',
    discoveredBy: 'AI',
    timestamp: Date.now() - 7200000,
    contentHash: 'f6e5d4c3b2a1',
    status: 'pending',
    aiConfidence: 0.88
  },
];

export default function FixtureVotingSystem() {
  const [proposedPages, setProposedPages] = useState<ProposedPage[]>(MOCK_PROPOSED_PAGES);
  const [selectedPage, setSelectedPage] = useState<ProposedPage | null>(null);
  const [voteDialogOpen, setVoteDialogOpen] = useState(false);
  const [voteType, setVoteType] = useState<'approve' | 'reject'>('approve');
  const [adminNotes, setAdminNotes] = useState('');

  const handleVote = (page: ProposedPage, type: 'approve' | 'reject') => {
    setSelectedPage(page);
    setVoteType(type);
    setVoteDialogOpen(true);
  };

  const confirmVote = () => {
    if (!selectedPage) return;

    setProposedPages(prev =>
      prev.map(p =>
        p.id === selectedPage.id
          ? { ...p, status: voteType === 'approve' ? 'approved' : 'rejected' }
          : p
      )
    );

    toast.success(
      voteType === 'approve'
        ? `Page "${selectedPage.name}" approved and added to sitemap`
        : `Page "${selectedPage.name}" rejected`
    );

    setVoteDialogOpen(false);
    setSelectedPage(null);
    setAdminNotes('');
  };

  const pendingPages = proposedPages.filter(p => p.status === 'pending');
  const approvedPages = proposedPages.filter(p => p.status === 'approved');
  const rejectedPages = proposedPages.filter(p => p.status === 'rejected');

  return (
    <div className="space-y-6">
      <Card className="card-3d card-3d-hover border-4 border-primary/30">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-gradient flex items-center gap-2">
            <Shield className="w-8 h-8 text-primary animate-pulse-glow" />
            Fixture-Based Voting System
          </CardTitle>
          <CardDescription className="text-lg">
            AI proposes, Admin verifies - Every page requires approval before sitemap inclusion
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4 mb-6">
            <div className="card-3d p-4 rounded-lg text-center">
              <Clock className="w-8 h-8 text-primary mx-auto mb-2" />
              <div className="text-2xl font-bold text-gradient">{pendingPages.length}</div>
              <div className="text-xs text-muted-foreground">Pending Review</div>
            </div>
            <div className="card-3d p-4 rounded-lg text-center">
              <CheckCircle className="w-8 h-8 text-success mx-auto mb-2" />
              <div className="text-2xl font-bold text-gradient-secondary">{approvedPages.length}</div>
              <div className="text-xs text-muted-foreground">Approved</div>
            </div>
            <div className="card-3d p-4 rounded-lg text-center">
              <XCircle className="w-8 h-8 text-destructive mx-auto mb-2" />
              <div className="text-2xl font-bold">{rejectedPages.length}</div>
              <div className="text-xs text-muted-foreground">Rejected</div>
            </div>
          </div>

          <Alert className="mb-6">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              <strong>Voting Process:</strong> All AI-discovered pages require admin verification before being appended to the sitemap. Each vote is logged with timestamps, admin identity, and decision rationale for complete auditability.
            </AlertDescription>
          </Alert>

          <div className="space-y-4">
            <h3 className="text-xl font-bold flex items-center gap-2">
              <Clock className="w-5 h-5 text-primary" />
              Pending Review ({pendingPages.length})
            </h3>
            {pendingPages.length === 0 ? (
              <div className="card-3d p-8 rounded-lg text-center text-muted-foreground">
                No pages pending review
              </div>
            ) : (
              pendingPages.map(page => (
                <Card key={page.id} className="card-3d card-3d-hover">
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-lg">{page.name}</h4>
                          <Badge variant="secondary" className="text-xs">
                            {page.discoveredBy}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {page.appName}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground font-mono">{page.url}</p>
                        <div className="flex items-center gap-4 text-sm">
                          <span className="text-muted-foreground">
                            Category: <strong>{page.category}</strong>
                          </span>
                          <span className="text-muted-foreground">
                            AI Confidence: <strong className="text-primary">{(page.aiConfidence * 100).toFixed(0)}%</strong>
                          </span>
                          <span className="text-muted-foreground font-mono">
                            Hash: {page.contentHash}
                          </span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          onClick={() => handleVote(page, 'approve')}
                          size="sm"
                          className="neon-glow"
                        >
                          <ThumbsUp className="w-4 h-4 mr-2" />
                          Approve
                        </Button>
                        <Button
                          onClick={() => handleVote(page, 'reject')}
                          size="sm"
                          variant="destructive"
                        >
                          <ThumbsDown className="w-4 h-4 mr-2" />
                          Reject
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      <Dialog open={voteDialogOpen} onOpenChange={setVoteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {voteType === 'approve' ? 'Approve Page' : 'Reject Page'}
            </DialogTitle>
            <DialogDescription>
              {voteType === 'approve'
                ? 'This page will be added to the sitemap with Merkle-root verification.'
                : 'This page will be rejected and not added to the sitemap.'}
            </DialogDescription>
          </DialogHeader>
          {selectedPage && (
            <div className="space-y-4">
              <div className="card-3d p-4 rounded-lg space-y-2">
                <div><strong>Page:</strong> {selectedPage.name}</div>
                <div className="text-sm text-muted-foreground">{selectedPage.url}</div>
                <div><strong>App:</strong> {selectedPage.appName}</div>
                <div><strong>Category:</strong> {selectedPage.category}</div>
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Admin Notes (Optional)</label>
                <Textarea
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  placeholder="Add notes about this decision..."
                  rows={3}
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setVoteDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={confirmVote}
              variant={voteType === 'approve' ? 'default' : 'destructive'}
            >
              Confirm {voteType === 'approve' ? 'Approval' : 'Rejection'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
