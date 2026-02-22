import { useEffect } from 'react';
import { useGetLeaderboard } from '../hooks/useQueries';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Trophy, TrendingUp, Users, Award, Medal, Crown } from 'lucide-react';
import { Link } from '@tanstack/react-router';

export default function LeaderboardPage() {
  const { data: leaderboard, isLoading } = useGetLeaderboard();

  useEffect(() => {
    document.title = 'Leaderboard - latestTrends';
  }, []);

  const getRankIcon = (index: number) => {
    switch (index) {
      case 0:
        return <Crown className="h-6 w-6 text-yellow-500" />;
      case 1:
        return <Medal className="h-6 w-6 text-gray-400" />;
      case 2:
        return <Medal className="h-6 w-6 text-amber-700" />;
      default:
        return <Award className="h-5 w-5 text-muted-foreground" />;
    }
  };

  if (isLoading) {
    return (
      <div className="container py-12">
        <div className="max-w-6xl mx-auto space-y-8">
          <Skeleton className="h-12 w-64 mx-auto" />
          <div className="grid md:grid-cols-2 gap-6">
            <Skeleton className="h-96" />
            <Skeleton className="h-96" />
          </div>
        </div>
      </div>
    );
  }

  const topTopics = leaderboard?.topTopics || [];
  const topVoters = leaderboard?.topVoters || [];

  return (
    <div className="container py-12">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Hero Section */}
        <div className="space-y-4 text-center">
          <div className="flex items-center justify-center gap-3">
            <div className="relative">
              <Trophy className="h-12 w-12 text-primary" />
              <div className="absolute inset-0 animate-pulse bg-primary/30 blur-2xl" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
              Leaderboard
            </h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Top trending topics and most active community members
          </p>
        </div>

        {/* Leaderboards Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Top Topics */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                Top Trending Topics
              </CardTitle>
            </CardHeader>
            <CardContent>
              {topTopics.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">No topics yet</p>
              ) : (
                <div className="space-y-4">
                  {topTopics.map((entry, index) => (
                    <Link
                      key={entry.topicId.toString()}
                      to="/topic/$slug"
                      params={{ slug: entry.title.toLowerCase().replace(/\s+/g, '-') }}
                      className="block"
                    >
                      <div className="flex items-start gap-3 p-4 rounded-lg border border-border hover:border-primary/50 transition-colors">
                        <div className="flex-shrink-0 w-8 flex items-center justify-center">
                          {getRankIcon(index)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold line-clamp-2 mb-2">{entry.title}</h3>
                          <div className="flex flex-wrap items-center gap-2 text-sm">
                            <Badge variant="secondary">Rank #{Number(entry.rank)}</Badge>
                            <span className="text-muted-foreground">
                              {Number(entry.totalVotes)} votes
                            </span>
                            <span className="text-muted-foreground">
                              {Number(entry.score)} pts
                            </span>
                          </div>
                          <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                            <span>↑ {Number(entry.upvotes)}</span>
                            <span>↓ {Number(entry.downvotes)}</span>
                            <span>{Number(entry.clickCount)} views</span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Top Voters */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                Top Voters
              </CardTitle>
            </CardHeader>
            <CardContent>
              {topVoters.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">No voters yet</p>
              ) : (
                <div className="space-y-4">
                  {topVoters.map((voter, index) => (
                    <div
                      key={voter.voter.toString()}
                      className="flex items-start gap-3 p-4 rounded-lg border border-border"
                    >
                      <div className="flex-shrink-0 w-8 flex items-center justify-center">
                        {getRankIcon(index)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold mb-2 font-mono text-sm truncate">
                          {voter.voter.toString().slice(0, 20)}...
                        </h3>
                        <div className="flex flex-wrap items-center gap-2 text-sm">
                          <Badge variant="secondary">
                            {Number(voter.totalVotes)} total votes
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                          <span>↑ {Number(voter.upvotesGiven)} upvotes</span>
                          <span>↓ {Number(voter.downvotesGiven)} downvotes</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Info Section */}
        <Card>
          <CardHeader>
            <CardTitle>How Rankings Work</CardTitle>
          </CardHeader>
          <CardContent className="prose prose-neutral dark:prose-invert max-w-none">
            <ul>
              <li>
                <strong>Topic Rankings:</strong> Topics are ranked based on their total votes (upvotes - downvotes).
                Higher vote counts move topics toward rank #1.
              </li>
              <li>
                <strong>Voter Rankings:</strong> Voters are ranked by their total voting activity and engagement with
                the community.
              </li>
              <li>
                <strong>Vote Impact:</strong> Each upvote improves a topic's rank, while downvotes reduce it. The
                ranking system ensures the most popular topics rise to the top.
              </li>
              <li>
                <strong>Merkle Root Tracking:</strong> Each topic has a unique hash identifier and Merkle root
                reference for secure vote tracking and verification.
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
