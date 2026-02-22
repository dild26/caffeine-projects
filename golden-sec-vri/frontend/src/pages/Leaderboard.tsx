import { useMemo } from 'react';
import { useGetFeatures, useGetAllFixtures } from '../hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Trophy, Medal, Award, TrendingUp, CheckCircle2, Bot, User } from 'lucide-react';
import type { Feature } from '../backend';

export default function Leaderboard() {
  const { data: features, isLoading: featuresLoading } = useGetFeatures();
  const { data: allFixtures, isLoading: fixturesLoading } = useGetAllFixtures();

  // Calculate feature scores based on dual verification
  const rankedFeatures = useMemo(() => {
    if (!features) return [];

    return features
      .map((feature) => {
        let score = 0;
        
        // Base score from completion percentage
        score += Number(feature.completionPercentage);
        
        // Bonus for AI verification
        if (feature.aiVerified) score += 20;
        
        // Bonus for manual verification
        if (feature.manuallyVerified) score += 30;
        
        // Bonus for both verifications (dual verification)
        if (feature.aiVerified && feature.manuallyVerified) score += 50;
        
        // Bonus for completion
        if (feature.completed) score += 100;
        
        // Priority weight (higher priority = more points)
        score += (6 - Number(feature.priority)) * 10;

        return {
          ...feature,
          score,
        };
      })
      .sort((a, b) => b.score - a.score)
      .slice(0, 20); // Top 20 features
  }, [features]);

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="h-6 w-6 text-yellow-500" />;
      case 2:
        return <Medal className="h-6 w-6 text-gray-400" />;
      case 3:
        return <Award className="h-6 w-6 text-amber-600" />;
      default:
        return <span className="text-lg font-bold text-muted-foreground">#{rank}</span>;
    }
  };

  const getRankBadgeVariant = (rank: number): "default" | "secondary" | "outline" => {
    if (rank <= 3) return "default";
    if (rank <= 10) return "secondary";
    return "outline";
  };

  if (featuresLoading || fixturesLoading) {
    return (
      <div className="container px-4 py-8">
        <Skeleton className="h-96" />
      </div>
    );
  }

  return (
    <div className="container px-4 py-8">
      <div className="mb-8 flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
          <TrendingUp className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-foreground">Feature Leaderboard</h1>
          <p className="text-muted-foreground">Top features ranked by dual verification score (AI + Manual)</p>
        </div>
      </div>

      {/* Scoring Legend */}
      <Card className="mb-6 border-2">
        <CardHeader>
          <CardTitle>Scoring System</CardTitle>
          <CardDescription>How features are ranked</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-lg border bg-muted/50 p-3">
              <p className="text-sm font-medium">Completion %</p>
              <p className="text-xs text-muted-foreground">Base score (0-100 points)</p>
            </div>
            <div className="rounded-lg border bg-muted/50 p-3">
              <p className="text-sm font-medium flex items-center gap-1">
                <Bot className="h-4 w-4 text-primary" />
                AI Verified
              </p>
              <p className="text-xs text-muted-foreground">+20 points</p>
            </div>
            <div className="rounded-lg border bg-muted/50 p-3">
              <p className="text-sm font-medium flex items-center gap-1">
                <User className="h-4 w-4 text-accent" />
                Manual Verified
              </p>
              <p className="text-xs text-muted-foreground">+30 points</p>
            </div>
            <div className="rounded-lg border bg-primary/10 p-3">
              <p className="text-sm font-medium flex items-center gap-1">
                <CheckCircle2 className="h-4 w-4 text-primary" />
                Dual Verification
              </p>
              <p className="text-xs text-muted-foreground">+50 bonus points</p>
            </div>
            <div className="rounded-lg border bg-muted/50 p-3">
              <p className="text-sm font-medium">Completed</p>
              <p className="text-xs text-muted-foreground">+100 points</p>
            </div>
            <div className="rounded-lg border bg-muted/50 p-3">
              <p className="text-sm font-medium">Priority Weight</p>
              <p className="text-xs text-muted-foreground">+10-50 points</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Leaderboard Table */}
      <Card className="border-2 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-yellow-500" />
            Top 20 Features
          </CardTitle>
          <CardDescription>Features with highest dual verification scores</CardDescription>
        </CardHeader>
        <CardContent>
          {rankedFeatures.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-20">Rank</TableHead>
                  <TableHead>Feature Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead className="text-center">Completion</TableHead>
                  <TableHead className="text-center">Verification</TableHead>
                  <TableHead className="text-right">Score</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rankedFeatures.map((feature, index) => {
                  const rank = index + 1;
                  return (
                    <TableRow key={feature.id} className={rank <= 3 ? 'bg-muted/50' : ''}>
                      <TableCell>
                        <div className="flex items-center justify-center">
                          {getRankIcon(rank)}
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          {feature.name}
                          {feature.completed && (
                            <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{feature.category}</Badge>
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="flex items-center justify-center gap-2">
                          <div className="h-2 w-16 overflow-hidden rounded-full bg-secondary">
                            <div
                              className="h-full bg-primary transition-all"
                              style={{ width: `${Number(feature.completionPercentage)}%` }}
                            />
                          </div>
                          <span className="text-sm font-medium">{Number(feature.completionPercentage)}%</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="flex items-center justify-center gap-2">
                          {feature.aiVerified && (
                            <Badge variant="default" className="gap-1">
                              <Bot className="h-3 w-3" />
                              AI
                            </Badge>
                          )}
                          {feature.manuallyVerified && (
                            <Badge variant="default" className="gap-1">
                              <User className="h-3 w-3" />
                              Manual
                            </Badge>
                          )}
                          {!feature.aiVerified && !feature.manuallyVerified && (
                            <Badge variant="outline">None</Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <Badge variant={getRankBadgeVariant(rank)} className="text-lg px-3 py-1">
                          {feature.score}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          ) : (
            <div className="py-12 text-center text-muted-foreground">
              <Trophy className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No features available for ranking yet.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
