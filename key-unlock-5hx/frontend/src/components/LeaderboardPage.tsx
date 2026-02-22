import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Trophy, Medal, Award, TrendingUp, MousePointerClick, Hash, ThumbsUp, ThumbsDown, Eye } from 'lucide-react';
import { useGetAllDomainReferences } from '../hooks/useDomainReferences';
import { useDomainClicks } from '../hooks/useDomainClicks';
import { useDomainVotes, useVoteDomain } from '../hooks/useDomainVotes';
import { getDomainHash } from '../lib/domainHash';
import DomainPreviewDialog from './DomainPreviewDialog';

export default function LeaderboardPage() {
  const { data: domainReferences = [] } = useGetAllDomainReferences();
  const { data: domainClicks = {} } = useDomainClicks();
  const { data: domainVotes = {} } = useDomainVotes();
  const voteDomain = useVoteDomain();
  const [previewDomain, setPreviewDomain] = useState<string | null>(null);

  // Sort domains by combined score (clicks + vote score)
  const sortedDomains = [...domainReferences]
    .map((domain) => {
      const votes = domainVotes[domain.domain] || { upvotes: 0, downvotes: 0 };
      const voteScore = votes.upvotes - votes.downvotes;
      const clicks = domainClicks[domain.domain] || 0;
      
      return {
        ...domain,
        clicks,
        votes,
        voteScore,
        totalScore: clicks + voteScore,
        hash: getDomainHash(domain.domain),
      };
    })
    .sort((a, b) => b.totalScore - a.totalScore);

  const totalClicks = Object.values(domainClicks).reduce((sum, count) => sum + count, 0);
  const totalVotes = Object.values(domainVotes).reduce((sum, v) => sum + v.upvotes + v.downvotes, 0);

  const getRankIcon = (index: number) => {
    if (index === 0) return <Trophy className="w-6 h-6 text-yellow-500" />;
    if (index === 1) return <Medal className="w-6 h-6 text-gray-400" />;
    if (index === 2) return <Award className="w-6 h-6 text-amber-600" />;
    return <span className="text-lg font-bold text-muted-foreground">#{index + 1}</span>;
  };

  const getRankBadge = (index: number) => {
    if (index === 0) return <Badge className="bg-yellow-500 hover:bg-yellow-600">🥇 1st Place</Badge>;
    if (index === 1) return <Badge className="bg-gray-400 hover:bg-gray-500">🥈 2nd Place</Badge>;
    if (index === 2) return <Badge className="bg-amber-600 hover:bg-amber-700">🥉 3rd Place</Badge>;
    return null;
  };

  const handleVote = (domain: string, voteType: 'up' | 'down') => {
    voteDomain.mutate({ domain, voteType });
  };

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <Card className="card-3d">
        <CardHeader>
          <div className="flex items-center gap-3">
            <Trophy className="w-8 h-8 text-primary" />
            <div>
              <CardTitle className="text-3xl text-gradient">Domain Leaderboard</CardTitle>
              <CardDescription className="text-base mt-1">
                Real-time rankings based on user interactions and democratized voting across all 26 domains
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            <div className="gradient-border p-4 rounded-lg text-center">
              <MousePointerClick className="w-6 h-6 text-primary mx-auto mb-2" />
              <div className="text-3xl font-bold text-gradient">{totalClicks}</div>
              <div className="text-sm text-muted-foreground mt-1">Total Clicks</div>
            </div>
            <div className="gradient-border p-4 rounded-lg text-center">
              <ThumbsUp className="w-6 h-6 text-success mx-auto mb-2" />
              <div className="text-3xl font-bold text-success">{totalVotes}</div>
              <div className="text-sm text-muted-foreground mt-1">Total Votes</div>
            </div>
            <div className="gradient-border p-4 rounded-lg text-center">
              <TrendingUp className="w-6 h-6 text-accent mx-auto mb-2" />
              <div className="text-3xl font-bold text-accent">{sortedDomains.length}</div>
              <div className="text-sm text-muted-foreground mt-1">Domains Tracked</div>
            </div>
            <div className="gradient-border p-4 rounded-lg text-center">
              <Trophy className="w-6 h-6 text-yellow-500 mx-auto mb-2" />
              <div className="text-3xl font-bold text-yellow-500">
                {sortedDomains[0]?.domain.split('.')[0] || 'N/A'}
              </div>
              <div className="text-sm text-muted-foreground mt-1">Current Leader</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Leaderboard Table */}
      <Card className="card-3d">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-primary" />
            Rankings
          </CardTitle>
          <CardDescription>
            Domains ranked by total score (clicks + votes). Vote to influence rankings democratically. Preview links open sites in secure sandboxed iframe.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {sortedDomains.map((domain, index) => (
              <div
                key={domain.domain}
                className={`p-4 rounded-lg border-2 transition-all ${
                  index === 0
                    ? 'border-yellow-500/50 bg-yellow-500/5'
                    : index === 1
                    ? 'border-gray-400/50 bg-gray-400/5'
                    : index === 2
                    ? 'border-amber-600/50 bg-amber-600/5'
                    : 'border-border bg-card hover:border-primary/30'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className="flex-shrink-0 w-12 flex items-center justify-center">
                    {getRankIcon(index)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <h3 className="text-lg font-bold truncate">{domain.domain}</h3>
                      {getRankBadge(index)}
                      <Badge variant="outline" className="text-xs">
                        {domain.category}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-1">
                      {domain.description}
                    </p>
                    <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground flex-wrap">
                      <div className="flex items-center gap-1">
                        <Hash className="w-3 h-3" />
                        <code className="font-mono">{domain.hash}</code>
                      </div>
                      <div className="flex items-center gap-1">
                        <MousePointerClick className="w-3 h-3" />
                        <span>{domain.clicks} clicks</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <ThumbsUp className="w-3 h-3" />
                        <span>{domain.votes.upvotes} up</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <ThumbsDown className="w-3 h-3" />
                        <span>{domain.votes.downvotes} down</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex-shrink-0 flex flex-col items-end gap-2">
                    <div className="text-right">
                      <div className="text-3xl font-bold text-gradient">
                        {domain.totalScore}
                      </div>
                      <div className="text-xs text-muted-foreground">total score</div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        onClick={() => handleVote(domain.domain, 'up')}
                        variant="outline"
                        size="sm"
                        className="gap-1"
                      >
                        <ThumbsUp className="w-3 h-3" />
                      </Button>
                      <Button
                        onClick={() => handleVote(domain.domain, 'down')}
                        variant="outline"
                        size="sm"
                        className="gap-1"
                      >
                        <ThumbsDown className="w-3 h-3" />
                      </Button>
                      <Button
                        onClick={() => setPreviewDomain(domain.domain)}
                        variant="default"
                        size="sm"
                        className="gap-1 neon-glow"
                      >
                        <Eye className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Info Card */}
      <Card className="card-3d">
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <Hash className="w-5 h-5 text-primary mt-0.5" />
              <div>
                <h4 className="font-semibold mb-2">Secure Hash-Based Tracking</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Each domain is assigned a unique cryptographic hash identifier (similar to Merkle root) 
                  to ensure tamper-proof ranking and secure tracking. This prevents manipulation and 
                  guarantees the integrity of the leaderboard data.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <ThumbsUp className="w-5 h-5 text-success mt-0.5" />
              <div>
                <h4 className="font-semibold mb-2">Democratized Ranking System</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Vote on domains to influence their ranking. The leaderboard combines click tracking with 
                  community voting to create a fair, democratized ranking system. Upvotes increase a domain's 
                  score while downvotes decrease it, allowing the community to shape the rankings in real-time.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Eye className="w-5 h-5 text-accent mt-0.5" />
              <div>
                <h4 className="font-semibold mb-2">Secure Preview Links</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Click the preview button to open any site in a sandboxed iframe with strict security measures. 
                  The preview prevents navigation escape, click-jacking, and breaking out of preview mode while 
                  ensuring full preview functionality for the user.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Preview Dialog */}
      {previewDomain && (
        <DomainPreviewDialog
          domain={previewDomain}
          open={!!previewDomain}
          onOpenChange={(open) => !open && setPreviewDomain(null)}
        />
      )}
    </div>
  );
}
