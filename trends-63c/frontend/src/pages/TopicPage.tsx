import { useEffect, useState } from 'react';
import { useParams, useNavigate } from '@tanstack/react-router';
import { useGetTopicBySlug, useVoteTopic, useIncrementClickCount, useGetCallerUserProfile } from '../hooks/useQueries';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import ProfileSetupModal from '../components/ProfileSetupModal';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, Share2, Bookmark, TrendingUp, TrendingDown, Minus, ThumbsUp, ThumbsDown, Heart, Trophy } from 'lucide-react';
import { toast } from 'sonner';
import { VoteAction } from '../backend';

export default function TopicPage() {
  const { slug } = useParams({ from: '/topic/$slug' });
  const navigate = useNavigate();
  const { identity } = useInternetIdentity();
  const { data: userProfile, isLoading: profileLoading, isFetched } = useGetCallerUserProfile();
  const { data: topic, isLoading } = useGetTopicBySlug(slug);
  const voteTopic = useVoteTopic();
  const incrementClick = useIncrementClickCount();
  const [showProfileSetup, setShowProfileSetup] = useState(false);

  const isAuthenticated = !!identity;

  useEffect(() => {
    if (topic) {
      incrementClick.mutate(topic.id);
    }
  }, [topic?.id]);

  const handleVote = async (action: VoteAction) => {
    if (!identity) {
      toast.error('Please login to vote');
      return;
    }

    // Check if user has a profile
    if (!profileLoading && isFetched && userProfile === null) {
      setShowProfileSetup(true);
      toast.error('Please set up your profile before voting');
      return;
    }

    if (!topic) return;

    try {
      await voteTopic.mutateAsync({ id: topic.id, action });
      toast.success(action === VoteAction.upvote ? 'Upvoted!' : 'Downvoted!');
    } catch (error: any) {
      console.error('Vote error:', error);
      if (error.message?.includes('Unauthorized')) {
        toast.error('Please login to vote');
      } else {
        toast.error('Failed to vote');
      }
    }
  };

  const handleShare = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    toast.success('Link copied to clipboard!');
  };

  const handleSave = () => {
    toast.success('Topic saved to watchlist!');
  };

  const getTrendIcon = () => {
    if (!topic) return null;
    switch (topic.trendIndicator) {
      case 'hot':
        return <TrendingUp className="h-5 w-5 text-destructive" />;
      case 'rising':
        return <TrendingUp className="h-5 w-5 text-chart-1" />;
      case 'stable':
        return <Minus className="h-5 w-5 text-muted-foreground" />;
      default:
        return <TrendingDown className="h-5 w-5 text-muted-foreground" />;
    }
  };

  if (isLoading) {
    return (
      <div className="container py-12 max-w-4xl">
        <Skeleton className="h-8 w-32 mb-8" />
        <div className="space-y-6">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    );
  }

  if (!topic) {
    return (
      <div className="container py-12 max-w-4xl text-center">
        <h1 className="text-2xl font-bold mb-4">Topic Not Found</h1>
        <p className="text-muted-foreground mb-6">The topic you're looking for doesn't exist.</p>
        <Button onClick={() => navigate({ to: '/' })}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Catalog
        </Button>
      </div>
    );
  }

  const vertices = Number(topic.polygonVertices);
  const upvotes = Number(topic.upvotes);
  const downvotes = Number(topic.downvotes);
  const totalVotes = Number(topic.totalVotes);
  const rank = Number(topic.rank);
  const clickCount = Number(topic.clickCount);

  const generatePolygonPoints = (numVertices: number) => {
    const points: string[] = [];
    const centerX = 50;
    const centerY = 50;
    const radius = 45;

    for (let i = 0; i < numVertices; i++) {
      const angle = (i * 2 * Math.PI) / numVertices - Math.PI / 2;
      const x = centerX + radius * Math.cos(angle);
      const y = centerY + radius * Math.sin(angle);
      points.push(`${x},${y}`);
    }

    return points.join(' ');
  };

  return (
    <>
      <div className="container py-12 max-w-4xl">
        <Button
          variant="ghost"
          onClick={() => navigate({ to: '/' })}
          className="mb-8 gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Catalog
        </Button>

        <article className="space-y-8">
          {/* Header */}
          <header className="space-y-4">
            <div className="flex items-start justify-between gap-4">
              <h1 className="text-4xl md:text-5xl font-bold leading-tight">{topic.title}</h1>
              <div className="flex-shrink-0">
                <svg viewBox="0 0 100 100" className="h-16 w-16">
                  <defs>
                    <linearGradient id="topic-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="oklch(var(--primary))" stopOpacity="0.8" />
                      <stop offset="100%" stopColor="oklch(var(--accent))" stopOpacity="0.8" />
                    </linearGradient>
                  </defs>
                  <polygon
                    points={generatePolygonPoints(vertices)}
                    fill="url(#topic-gradient)"
                  />
                </svg>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Badge variant="secondary" className="text-sm">
                {topic.category}
              </Badge>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                {getTrendIcon()}
                <span className="capitalize">{topic.trendIndicator}</span>
              </div>
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <span className="font-mono">{Number(topic.score)}</span>
                <span>points</span>
              </div>
              <div className="flex items-center gap-2">
                <Trophy className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium">Rank #{rank}</span>
              </div>
            </div>

            {/* Voting Card */}
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <Button
                      variant="outline"
                      size="lg"
                      onClick={() => handleVote(VoteAction.upvote)}
                      disabled={voteTopic.isPending || !isAuthenticated}
                      className="gap-2"
                    >
                      <ThumbsUp className="h-5 w-5" />
                      <span className="font-semibold">{upvotes}</span>
                    </Button>
                    <Button
                      variant="outline"
                      size="lg"
                      onClick={() => handleVote(VoteAction.downvote)}
                      disabled={voteTopic.isPending || !isAuthenticated}
                      className="gap-2"
                    >
                      <ThumbsDown className="h-5 w-5" />
                      <span className="font-semibold">{downvotes}</span>
                    </Button>
                    <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-muted">
                      <Heart className="h-5 w-5 text-destructive fill-destructive" />
                      <span className="font-semibold">{totalVotes}</span>
                      <span className="text-sm text-muted-foreground">total</span>
                    </div>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {clickCount} views
                  </div>
                </div>
                {!isAuthenticated && (
                  <p className="text-sm text-muted-foreground mt-4 text-center">
                    Login to vote on this topic
                  </p>
                )}
              </CardContent>
            </Card>

            <div className="flex gap-2">
              <Button onClick={handleShare} variant="outline" size="sm" className="gap-2">
                <Share2 className="h-4 w-4" />
                Share
              </Button>
              <Button onClick={handleSave} variant="outline" size="sm" className="gap-2">
                <Bookmark className="h-4 w-4" />
                Save
              </Button>
            </div>
          </header>

          {/* Content */}
          <div className="prose prose-neutral dark:prose-invert max-w-none space-y-8">
            {topic.paragraphs.map((paragraph, index) => (
              <section key={index} className="space-y-3">
                <h2 className="text-xl font-semibold text-primary">
                  {index === 0 && 'Overview'}
                  {index === 1 && "Why It's Trending Now"}
                  {index === 2 && 'Key Facts & Data Points'}
                  {index === 3 && 'Future Outlook'}
                </h2>
                <p className="text-base leading-relaxed text-foreground">{paragraph.content}</p>
                {paragraph.sources.length > 0 && (
                  <div className="flex flex-wrap gap-2 text-sm">
                    <span className="text-muted-foreground">Sources:</span>
                    {paragraph.sources.map((source, idx) => (
                      <a
                        key={idx}
                        href={source}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline"
                      >
                        [{idx + 1}]
                      </a>
                    ))}
                  </div>
                )}
              </section>
            ))}
          </div>

          {/* Related Queries */}
          {topic.relatedQueries.length > 0 && (
            <section className="space-y-4 pt-8 border-t">
              <h3 className="text-xl font-semibold">Related Queries</h3>
              <div className="flex flex-wrap gap-2">
                {topic.relatedQueries.map((query, idx) => (
                  <Badge key={idx} variant="outline">
                    {query}
                  </Badge>
                ))}
              </div>
            </section>
          )}

          {/* Metadata */}
          <section className="pt-8 border-t text-sm text-muted-foreground space-y-2">
            <div className="flex items-center gap-2">
              <span className="font-semibold">Topic ID:</span>
              <span className="font-mono">{topic.id.toString()}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-semibold">Hash:</span>
              <span className="font-mono text-xs">{topic.hashIdentifier}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-semibold">Merkle Root:</span>
              <span className="font-mono text-xs">{topic.merkleRoot}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-semibold">Status:</span>
              <Badge variant={topic.status === 'active' ? 'default' : 'secondary'} className="text-xs">
                {topic.status}
              </Badge>
            </div>
          </section>
        </article>
      </div>

      {/* Profile Setup Modal - only shown when user tries to vote without profile */}
      <ProfileSetupModal open={showProfileSetup} />
    </>
  );
}
