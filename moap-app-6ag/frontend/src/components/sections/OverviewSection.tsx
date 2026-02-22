import { useGetOverviewCards } from '@/hooks/useQueries';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Trophy, Medal, Award, Info } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

export function OverviewSection() {
  const { data: overviewCards, isLoading } = useGetOverviewCards();

  const cards = overviewCards?.cards || [];
  const sortedCards = [...cards].sort((a, b) => Number(a.rank - b.rank));

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Alert className="bg-primary/5 border-primary/20">
          <Info className="h-4 w-4 text-primary" />
          <AlertDescription className="text-sm text-foreground/80">
            This area shows key platform stats and app summaries derived from the spec configuration.
          </AlertDescription>
        </Alert>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-3/4" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-20 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (sortedCards.length === 0) {
    return (
      <div className="space-y-6">
        <Alert className="bg-primary/5 border-primary/20">
          <Info className="h-4 w-4 text-primary" />
          <AlertDescription className="text-sm text-foreground/80">
            This area shows key platform stats and app summaries derived from the spec configuration.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Alert className="bg-primary/5 border-primary/20">
        <Info className="h-4 w-4 text-primary" />
        <AlertDescription className="text-sm text-foreground/80">
          This area shows key platform stats and app summaries derived from the spec configuration.
        </AlertDescription>
      </Alert>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {sortedCards.map((card) => {
          const rank = Number(card.rank);
          const icon = rank === 1 ? <Trophy className="h-6 w-6 text-yellow-500" /> :
                       rank === 2 ? <Medal className="h-6 w-6 text-gray-400" /> :
                       rank === 3 ? <Award className="h-6 w-6 text-amber-600" /> : null;

          return (
            <Card key={card.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{card.title}</CardTitle>
                  {icon && <div className="flex-shrink-0">{icon}</div>}
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{card.summary}</p>
                <div className="mt-4 flex items-center gap-2">
                  <span className="text-xs font-medium text-muted-foreground">Rank:</span>
                  <span className="text-sm font-bold text-primary">#{rank}</span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
