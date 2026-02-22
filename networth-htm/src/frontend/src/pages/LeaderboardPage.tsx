import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useGetLeaderboard } from '../hooks/useQueries';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Trophy, Medal, Award, Loader2 } from 'lucide-react';

export default function LeaderboardPage() {
  const { identity } = useInternetIdentity();
  const { data: leaderboard = [], isLoading } = useGetLeaderboard();

  const isAuthenticated = !!identity;

  if (!isAuthenticated) {
    return (
      <div className="py-20">
        <div className="container text-center">
          <h1 className="text-4xl font-bold mb-4">Leaderboard</h1>
          <p className="text-lg text-muted-foreground mb-8">Please login to view the leaderboard.</p>
        </div>
      </div>
    );
  }

  const getRankIcon = (index: number) => {
    if (index === 0) return <Trophy className="h-6 w-6 text-yellow-500" />;
    if (index === 1) return <Medal className="h-6 w-6 text-gray-400" />;
    if (index === 2) return <Award className="h-6 w-6 text-amber-600" />;
    return null;
  };

  const getRankBadge = (index: number) => {
    if (index === 0) return <Badge className="bg-yellow-500 hover:bg-yellow-600">1st Place</Badge>;
    if (index === 1) return <Badge className="bg-gray-400 hover:bg-gray-500">2nd Place</Badge>;
    if (index === 2) return <Badge className="bg-amber-600 hover:bg-amber-700">3rd Place</Badge>;
    return <Badge variant="outline">#{index + 1}</Badge>;
  };

  return (
    <div className="py-12">
      <div className="container">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 mb-4">
            <Trophy className="h-10 w-10 text-primary" />
          </div>
          <h1 className="text-4xl font-bold mb-4">Global Leaderboard</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Top professionals ranked by total votes received on their topics. Climb the ranks by creating valuable content!
          </p>
        </div>

        {isLoading ? (
          <div className="text-center py-12">
            <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
            <p className="text-muted-foreground mt-4">Loading leaderboard...</p>
          </div>
        ) : leaderboard.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No users on the leaderboard yet. Be the first!</p>
          </div>
        ) : (
          <div className="max-w-4xl mx-auto space-y-4">
            {leaderboard.map((profile, index) => (
              <Card
                key={profile.referralId}
                className={`border-2 transition-all ${
                  index < 3 ? 'border-primary/50 shadow-lg' : 'hover:border-primary/30'
                }`}
              >
                <CardContent className="pt-6">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center justify-center w-16 h-16 rounded-full bg-muted">
                      {getRankIcon(index) || (
                        <span className="text-2xl font-bold text-muted-foreground">#{index + 1}</span>
                      )}
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-xl font-semibold">{profile.name}</h3>
                        {getRankBadge(index)}
                      </div>
                      <div className="flex flex-wrap gap-2 text-sm text-muted-foreground">
                        {profile.skills.slice(0, 3).map((skill, idx) => (
                          <Badge key={idx} variant="secondary">
                            {skill}
                          </Badge>
                        ))}
                        {profile.skills.length > 3 && (
                          <Badge variant="secondary">+{profile.skills.length - 3} more</Badge>
                        )}
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-3xl font-bold text-primary">{Number(profile.totalVotes)}</div>
                      <div className="text-sm text-muted-foreground">Total Votes</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
