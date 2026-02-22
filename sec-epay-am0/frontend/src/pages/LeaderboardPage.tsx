import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useGetLeaderboard } from '../hooks/useQueries';
import { Trophy, Medal, Award, Clock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

export default function LeaderboardPage() {
  const { data: leaderboard = [], isLoading } = useGetLeaderboard();

  const formatTimestamp = (timestamp: bigint) => {
    const date = new Date(Number(timestamp) / 1_000_000);
    return date.toLocaleString();
  };

  const formatDuration = (duration: bigint) => {
    const seconds = Number(duration);
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${days}d ${hours}h ${minutes}m`;
  };

  const sortedLeaderboard = [...leaderboard].sort((a, b) => Number(b.totalAmount) - Number(a.totalAmount));

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="h-6 w-6 text-yellow-500" />;
      case 2:
        return <Medal className="h-6 w-6 text-gray-400" />;
      case 3:
        return <Medal className="h-6 w-6 text-amber-600" />;
      default:
        return <Award className="h-6 w-6 text-muted-foreground" />;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 text-center">
        <div className="flex justify-center mb-4">
          <img src="/assets/generated/leaderboard-trophy-transparent.dim_100x100.png" alt="Trophy" className="h-20 w-20" />
        </div>
        <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-yellow-500 via-yellow-400 to-yellow-600 bg-clip-text text-transparent">
          Leaderboard
        </h1>
        <p className="text-muted-foreground">Top performers ranked by transaction totals and duration</p>
      </div>

      {sortedLeaderboard.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {sortedLeaderboard.slice(0, 3).map((entry, index) => (
            <Card key={entry.user.toString()} className={`${index === 0 ? 'border-yellow-500/50 bg-gradient-to-br from-yellow-500/5 to-yellow-600/5' : index === 1 ? 'border-gray-400/50' : 'border-amber-600/50'}`}>
              <CardHeader className="text-center">
                <div className="flex justify-center mb-2">
                  {getRankIcon(index + 1)}
                </div>
                <CardTitle className="text-lg">Rank #{index + 1}</CardTitle>
                <CardDescription className="text-xs break-all">{entry.user.toString()}</CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-3xl font-bold mb-2">₹{Number(entry.totalAmount).toLocaleString()}</p>
                <div className="flex items-center justify-center text-sm text-muted-foreground">
                  <Clock className="h-4 w-4 mr-1" />
                  {formatDuration(entry.duration)}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>All Rankings</CardTitle>
          <CardDescription>Complete leaderboard with timestamps</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8 text-muted-foreground">Loading leaderboard...</div>
          ) : sortedLeaderboard.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">No entries yet</div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-16">Rank</TableHead>
                    <TableHead>User</TableHead>
                    <TableHead>Total Amount</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead>Timestamp</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedLeaderboard.map((entry, index) => (
                    <TableRow key={entry.user.toString()}>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          {index < 3 ? (
                            getRankIcon(index + 1)
                          ) : (
                            <span className="font-semibold">#{index + 1}</span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="font-mono text-xs">{entry.user.toString().slice(0, 20)}...</TableCell>
                      <TableCell className="font-semibold text-green-600">
                        ₹{Number(entry.totalAmount).toLocaleString()}
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">{formatDuration(entry.duration)}</Badge>
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">
                        {formatTimestamp(entry.timestamp)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
