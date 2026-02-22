import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Trophy, TrendingUp, DollarSign, CheckCircle2, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useState } from 'react';

interface LeaderboardEntry {
  id: string;
  title: string;
  score: number;
  sales: number;
  completionRate: number;
  verified: boolean;
}

export default function LeaderboardPage() {
  const [currentPage, setCurrentPage] = useState(0);
  const pageSize = 10;

  // Mock data - in real app, fetch from backend
  const leaderboard: LeaderboardEntry[] = [
    { id: 'employment_contract', title: 'Employment Contract', score: 156, sales: 45, completionRate: 92, verified: true },
    { id: 'nda_agreement', title: 'NDA Agreement', score: 134, sales: 38, completionRate: 88, verified: true },
    { id: 'service_agreement', title: 'Service Agreement', score: 98, sales: 29, completionRate: 85, verified: false },
    { id: 'lease_agreement', title: 'Lease Agreement', score: 87, sales: 25, completionRate: 90, verified: true },
    { id: 'partnership_agreement', title: 'Partnership Agreement', score: 76, sales: 22, completionRate: 78, verified: false },
    { id: 'consulting_agreement', title: 'Consulting Agreement', score: 65, sales: 18, completionRate: 82, verified: true },
    { id: 'freelance_contract', title: 'Freelance Contract', score: 54, sales: 15, completionRate: 75, verified: false },
    { id: 'vendor_agreement', title: 'Vendor Agreement', score: 43, sales: 12, completionRate: 80, verified: true },
    { id: 'license_agreement', title: 'License Agreement', score: 32, sales: 9, completionRate: 70, verified: false },
    { id: 'sales_contract', title: 'Sales Contract', score: 21, sales: 6, completionRate: 68, verified: true },
    { id: 'purchase_order', title: 'Purchase Order', score: 15, sales: 4, completionRate: 65, verified: false },
    { id: 'rental_agreement', title: 'Rental Agreement', score: 10, sales: 3, completionRate: 60, verified: true },
  ];

  const totalPages = Math.ceil(leaderboard.length / pageSize);
  const paginatedLeaderboard = leaderboard.slice(
    currentPage * pageSize,
    (currentPage + 1) * pageSize
  );

  const getRankIcon = (index: number) => {
    const globalIndex = currentPage * pageSize + index;
    if (globalIndex === 0) return <Trophy className="h-6 w-6 text-yellow-500" />;
    if (globalIndex === 1) return <Trophy className="h-6 w-6 text-gray-400" />;
    if (globalIndex === 2) return <Trophy className="h-6 w-6 text-amber-600" />;
    return <span className="text-lg font-bold text-muted-foreground">{globalIndex + 1}</span>;
  };

  return (
    <div className="container py-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Leaderboard</h1>
        <p className="text-muted-foreground">
          Top performing e-contracts ranked by score, sales, and completion rate
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Top Score</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{leaderboard[0]?.score || 0}</div>
            <p className="text-xs text-muted-foreground">{leaderboard[0]?.title}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Most Sales</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{leaderboard[0]?.sales || 0}</div>
            <p className="text-xs text-muted-foreground">{leaderboard[0]?.title}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Best Completion</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{leaderboard[0]?.completionRate || 0}%</div>
            <p className="text-xs text-muted-foreground">{leaderboard[0]?.title}</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Top E-Contracts</CardTitle>
          <CardDescription>
            Ranked by overall performance metrics
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-16">Rank</TableHead>
                <TableHead>Contract</TableHead>
                <TableHead className="text-center">Score</TableHead>
                <TableHead className="text-center">Sales</TableHead>
                <TableHead className="text-center">Completion</TableHead>
                <TableHead className="text-center">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedLeaderboard.map((entry, index) => (
                <TableRow key={entry.id}>
                  <TableCell className="text-center">
                    {getRankIcon(index)}
                  </TableCell>
                  <TableCell className="font-medium">{entry.title}</TableCell>
                  <TableCell className="text-center">
                    <Badge variant="secondary">{entry.score}</Badge>
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge variant="outline">{entry.sales}</Badge>
                  </TableCell>
                  <TableCell className="text-center">
                    <span className={entry.completionRate >= 85 ? 'text-green-600 font-semibold' : 'text-muted-foreground'}>
                      {entry.completionRate}%
                    </span>
                  </TableCell>
                  <TableCell className="text-center">
                    {entry.verified ? (
                      <Badge className="bg-green-500">Verified</Badge>
                    ) : (
                      <Badge variant="outline">Pending</Badge>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 pt-4">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setCurrentPage(0)}
                disabled={currentPage === 0}
                title="First page"
              >
                <ChevronsLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setCurrentPage(prev => Math.max(0, prev - 1))}
                disabled={currentPage === 0}
                title="Previous page"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="text-sm text-muted-foreground px-4">
                Page {currentPage + 1} of {totalPages}
              </span>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setCurrentPage(prev => Math.min(totalPages - 1, prev + 1))}
                disabled={currentPage >= totalPages - 1}
                title="Next page"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setCurrentPage(totalPages - 1)}
                disabled={currentPage >= totalPages - 1}
                title="Last page"
              >
                <ChevronsRight className="h-4 w-4" />
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
