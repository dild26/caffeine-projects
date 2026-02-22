import { useState } from 'react';
import { Link } from '@tanstack/react-router';
import { TrendingUp, TrendingDown, Minus, ThumbsUp, ThumbsDown, Heart } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useVoteTopic } from '../hooks/useQueries';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { toast } from 'sonner';
import type { TopicSummary } from '../backend';
import { VoteAction } from '../backend';

interface PolygonCardProps {
  topic: TopicSummary;
  index: number;
}

export default function PolygonCard({ topic, index }: PolygonCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const { identity } = useInternetIdentity();
  const voteTopic = useVoteTopic();

  const vertices = Number(topic.polygonVertices);
  const score = Number(topic.score);
  const upvotes = Number(topic.upvotes);
  const downvotes = Number(topic.downvotes);
  const totalVotes = Number(topic.totalVotes);
  const rank = Number(topic.rank);

  const handleVote = async (e: React.MouseEvent, action: VoteAction) => {
    e.preventDefault();
    e.stopPropagation();

    if (!identity) {
      toast.error('Please login to vote');
      return;
    }

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

  const getBadgeIcon = () => {
    switch (topic.trendIndicator) {
      case 'hot':
        return <img src="/assets/generated/hot-badge-transparent.dim_32x32.png" alt="Hot" className="h-4 w-4" />;
      case 'rising':
        return <img src="/assets/generated/rising-badge-transparent.dim_32x32.png" alt="Rising" className="h-4 w-4" />;
      case 'stable':
        return <img src="/assets/generated/stable-badge-transparent.dim_32x32.png" alt="Stable" className="h-4 w-4" />;
      default:
        return null;
    }
  };

  const getTrendIcon = () => {
    switch (topic.trendIndicator) {
      case 'hot':
        return <TrendingUp className="h-4 w-4 text-destructive" />;
      case 'rising':
        return <TrendingUp className="h-4 w-4 text-chart-1" />;
      case 'stable':
        return <Minus className="h-4 w-4 text-muted-foreground" />;
      default:
        return <TrendingDown className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const generatePolygonPoints = (numVertices: number, morphFactor: number = 0) => {
    const points: string[] = [];
    const centerX = 50;
    const centerY = 50;
    const radius = 45;

    for (let i = 0; i < numVertices; i++) {
      const angle = (i * 2 * Math.PI) / numVertices - Math.PI / 2;
      const morphOffset = morphFactor * Math.sin(i * 2) * 5;
      const r = radius + morphOffset;
      const x = centerX + r * Math.cos(angle);
      const y = centerY + r * Math.sin(angle);
      points.push(`${x},${y}`);
    }

    return points.join(' ');
  };

  const animationDelay = index * 0.05;

  return (
    <Link
      to="/topic/$slug"
      params={{ slug: topic.slug }}
      className="group block"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className="relative overflow-hidden rounded-lg border border-border/50 bg-card p-6 shadow-sm transition-all duration-300 hover:shadow-lg hover:border-primary/50"
        style={{
          animationDelay: `${animationDelay}s`,
        }}
      >
        {/* Polygon Background */}
        <div className="absolute inset-0 flex items-center justify-center opacity-10 transition-opacity duration-300 group-hover:opacity-20">
          <svg
            viewBox="0 0 100 100"
            className="h-full w-full transition-transform duration-500"
            style={{
              transform: isHovered ? 'rotate(15deg) scale(1.1)' : 'rotate(0deg) scale(1)',
            }}
          >
            <defs>
              <linearGradient id={`gradient-${topic.id}`} x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="oklch(var(--primary))" stopOpacity="0.8" />
                <stop offset="100%" stopColor="oklch(var(--accent))" stopOpacity="0.8" />
              </linearGradient>
            </defs>
            <polygon
              points={generatePolygonPoints(vertices, isHovered ? 1 : 0)}
              fill={`url(#gradient-${topic.id})`}
              className="transition-all duration-500"
            />
          </svg>
        </div>

        {/* Content */}
        <div className="relative z-10 space-y-3">
          <div className="flex items-start justify-between gap-2">
            <h3 className="text-lg font-semibold leading-tight transition-colors group-hover:text-primary line-clamp-2">
              {topic.title}
            </h3>
            <div className="flex-shrink-0">
              {getBadgeIcon()}
            </div>
          </div>

          <div className="flex items-center gap-2">
            {getTrendIcon()}
            <span className="text-sm text-muted-foreground capitalize">
              {topic.trendIndicator}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <Badge variant="secondary" className="text-xs">
              {topic.category}
            </Badge>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <span className="font-mono">{score}</span>
              <span>pts</span>
            </div>
          </div>

          {/* Voting Section */}
          <div className="flex items-center justify-between pt-2 border-t border-border/50">
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0"
                onClick={(e) => handleVote(e, VoteAction.upvote)}
                disabled={voteTopic.isPending}
              >
                <ThumbsUp className="h-4 w-4" />
              </Button>
              <span className="text-sm font-medium">{upvotes}</span>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0"
                onClick={(e) => handleVote(e, VoteAction.downvote)}
                disabled={voteTopic.isPending}
              >
                <ThumbsDown className="h-4 w-4" />
              </Button>
              <span className="text-sm font-medium">{downvotes}</span>
            </div>
            <div className="flex items-center gap-2">
              <Heart className="h-4 w-4 text-destructive fill-destructive" />
              <span className="text-sm font-medium">{totalVotes}</span>
            </div>
          </div>

          {/* Rank Badge */}
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Rank: #{rank}</span>
            <span>{Number(topic.clickCount)} clicks</span>
          </div>

          {/* Sparkline */}
          <div className="h-8 w-full opacity-60">
            <img
              src="/assets/generated/sparkline-up.dim_100x30.png"
              alt="Trend"
              className="h-full w-full object-contain"
            />
          </div>
        </div>

        {/* Hover Effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      </div>
    </Link>
  );
}
