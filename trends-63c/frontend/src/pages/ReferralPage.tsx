import { Gift } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useGetCallerUserProfile } from '../hooks/useQueries';
import { SiFacebook, SiX, SiLinkedin } from 'react-icons/si';
import StaticPageLayout from '../components/StaticPageLayout';

export default function ReferralPage() {
  const { identity } = useInternetIdentity();
  const { data: userProfile } = useGetCallerUserProfile();

  const isAuthenticated = !!identity;
  const referralPoints = userProfile?.referralPoints || 0;
  const badges = userProfile?.badges || [];
  const totalVotes = userProfile?.totalVotes || 0;

  const shareUrl = typeof window !== 'undefined' ? window.location.origin : '';
  const shareText = 'Check out latestTrends - discover what\'s trending now!';

  const handleShare = (platform: string) => {
    const encodedUrl = encodeURIComponent(shareUrl);
    const encodedText = encodeURIComponent(shareText);

    const urls: Record<string, string> = {
      twitter: `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    };

    if (urls[platform]) {
      window.open(urls[platform], '_blank', 'width=600,height=400');
    }
  };

  return (
    <StaticPageLayout
      title="Referral Program"
      subtitle="Earn rewards by sharing and participating"
      icon={Gift}
    >
      <div className="space-y-6">
        {isAuthenticated && userProfile && (
          <Card className="border-primary/50 bg-primary/5">
            <CardHeader>
              <CardTitle>Your Rewards</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary">{referralPoints}</div>
                  <div className="text-sm text-muted-foreground">Referral Points</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary">{totalVotes}</div>
                  <div className="text-sm text-muted-foreground">Total Votes</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary">{badges.length}</div>
                  <div className="text-sm text-muted-foreground">Badges Earned</div>
                </div>
              </div>
              {badges.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {badges.map((badge, index) => (
                    <Badge key={index} variant="secondary">
                      {badge}
                    </Badge>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle>How It Works</CardTitle>
          </CardHeader>
          <CardContent className="prose prose-neutral dark:prose-invert max-w-none">
            <p>
              Participate in the latestTrends community and earn rewards through voting and referrals. The more you
              engage, the more you earn!
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Earning Points</CardTitle>
          </CardHeader>
          <CardContent className="prose prose-neutral dark:prose-invert max-w-none">
            <ul>
              <li>
                <strong>Vote on Topics:</strong> Earn 1 point for each upvote or downvote
              </li>
              <li>
                <strong>Refer Friends:</strong> Earn 10 points when someone signs up using your referral
              </li>
              <li>
                <strong>Daily Engagement:</strong> Bonus points for consistent daily participation
              </li>
              <li>
                <strong>Quality Contributions:</strong> Extra points for helpful voting patterns
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Badges & Achievements</CardTitle>
          </CardHeader>
          <CardContent className="prose prose-neutral dark:prose-invert max-w-none">
            <p>Unlock special badges as you reach milestones:</p>
            <ul>
              <li>
                <strong>Newcomer:</strong> Cast your first vote
              </li>
              <li>
                <strong>Active Voter:</strong> Cast 50 votes
              </li>
              <li>
                <strong>Trend Spotter:</strong> Cast 100 votes
              </li>
              <li>
                <strong>Community Leader:</strong> Cast 500 votes
              </li>
              <li>
                <strong>Referral Champion:</strong> Refer 10 friends
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Share latestTrends</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4 text-muted-foreground">
              Share latestTrends with your network and help others discover trending topics!
            </p>
            <div className="flex flex-wrap gap-2">
              <Button onClick={() => handleShare('twitter')} variant="outline" className="gap-2">
                <SiX className="h-4 w-4" />
                Share on X
              </Button>
              <Button onClick={() => handleShare('facebook')} variant="outline" className="gap-2">
                <SiFacebook className="h-4 w-4" />
                Share on Facebook
              </Button>
              <Button onClick={() => handleShare('linkedin')} variant="outline" className="gap-2">
                <SiLinkedin className="h-4 w-4" />
                Share on LinkedIn
              </Button>
            </div>
          </CardContent>
        </Card>

        {!isAuthenticated && (
          <Card className="border-primary/50 bg-primary/5">
            <CardHeader>
              <CardTitle>Get Started</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Log in to start earning rewards and tracking your progress in the latestTrends community!
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </StaticPageLayout>
  );
}
