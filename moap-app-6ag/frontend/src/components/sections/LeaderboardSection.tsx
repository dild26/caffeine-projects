import { useGetLeaderboard, useGetApps } from '@/hooks/useQueries';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Trophy, Medal, Award, Info } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

export function LeaderboardSection() {
  const { data: leaderboard, isLoading: isLoadingLeaderboard } = useGetLeaderboard();
  const { data: apps, isLoading: isLoadingApps } = useGetApps(false);

  const isLoading = isLoadingLeaderboard || isLoadingApps;

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Alert className="bg-primary/5 border-primary/20">
          <Info className="h-4 w-4 text-primary" />
          <AlertDescription className="text-sm text-foreground/80">
            <strong>Leaderboard:</strong> This section ranks apps based on performance metrics, traffic, and feature usage. 
            Rankings are automatically generated from app rank values in spec.yaml or can be explicitly defined in the leaderboards section.
          </AlertDescription>
        </Alert>
        <Card>
          <CardHeader>
            <CardTitle>Leaderboard</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const rankings = leaderboard?.rankings || [];
  const appsList = apps || [];

  // Sort rankings by rank
  const sortedRankings = [...rankings].sort((a, b) => Number(a.rank - b.rank));

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Trophy className="h-5 w-5 text-yellow-500" />;
    if (rank === 2) return <Medal className="h-5 w-5 text-gray-400" />;
    if (rank === 3) return <Award className="h-5 w-5 text-amber-600" />;
    return null;
  };

  if (sortedRankings.length === 0) {
    return (
      <div className="space-y-6">
        <Alert className="bg-primary/5 border-primary/20">
          <Info className="h-4 w-4 text-primary" />
          <AlertDescription className="text-sm text-foreground/80">
            <strong>Leaderboard:</strong> This section ranks apps based on performance metrics, traffic, and feature usage. 
            Rankings are automatically generated from app rank values in spec.yaml or can be explicitly defined in the leaderboards section.
          </AlertDescription>
        </Alert>
        <Card>
          <CardHeader>
            <CardTitle>Leaderboard</CardTitle>
          </CardHeader>
          <CardContent>
            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                No leaderboard data available. Rankings are automatically generated from app data in the spec.yaml or spec.json configuration file.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Alert className="bg-primary/5 border-primary/20">
        <Info className="h-4 w-4 text-primary" />
        <AlertDescription className="text-sm text-foreground/80">
          <strong>Leaderboard:</strong> This section ranks apps based on performance metrics, traffic, and feature usage. 
          Rankings are automatically generated from app rank values in spec.yaml or can be explicitly defined in the leaderboards section.
        </AlertDescription>
      </Alert>

      <Card>
        <CardHeader>
          <CardTitle>Application Leaderboard</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-20">Rank</TableHead>
                <TableHead>Application</TableHead>
                <TableHead className="text-right">Score</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedRankings.map((ranking) => {
                const app = appsList.find((a) => a.id === ranking.appId);
                const rank = Number(ranking.rank);

                return (
                  <TableRow key={ranking.appId}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getRankIcon(rank)}
                        <span className="font-bold text-lg">#{rank}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{app?.name || ranking.appId}</div>
                        {app?.description && (
                          <div className="text-sm text-muted-foreground">{app.description}</div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <span className="font-mono text-lg font-semibold">
                        {Number(ranking.score).toLocaleString()}
                      </span>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
