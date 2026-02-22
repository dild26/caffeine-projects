import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useActor } from '../hooks/useActor';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ArrowUpDown, RefreshCw, Filter, TrendingUp, TrendingDown } from 'lucide-react';

// Local type definition for missing backend type
interface RankingMetric {
  id: bigint;
  seoRank: bigint;
  visitors: bigint;
  avgSessionDuration: bigint;
  totalPagesIndexed: bigint;
  popularityScore: bigint;
  loadSpeed: bigint;
  revisitRate: bigint;
  searchEngineSource: string;
  crawledPages: bigint;
  rankDelta: bigint;
  ppcIndicator: boolean;
  ttl: bigint;
  searchVolume: bigint;
  contentQualityScore: bigint;
  dataSource: string;
  lastUpdated: bigint;
  isAiCollected: boolean;
  isAdminVerified: boolean;
}

export default function RankPage() {
  const { actor, isFetching: actorFetching } = useActor();
  const [sortColumn, setSortColumn] = useState<string>('seoRank');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [filterDataSource, setFilterDataSource] = useState<string>('all');

  const { data: rankingMetrics = [], isLoading, refetch } = useQuery<RankingMetric[]>({
    queryKey: ['rankingMetrics'],
    queryFn: async () => {
      if (!actor) return [];
      // Backend method not available - using mock data
      console.warn('[RankPage] Backend getAllRankingMetrics method not available, using mock data');
      return [];
    },
    enabled: !!actor && !actorFetching,
  });

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  const filteredAndSortedMetrics = React.useMemo(() => {
    let filtered = rankingMetrics;
    if (filterDataSource !== 'all') {
      filtered = rankingMetrics.filter((m) => m.dataSource === filterDataSource);
    }

    return [...filtered].sort((a, b) => {
      const aVal = a[sortColumn as keyof typeof a];
      const bVal = b[sortColumn as keyof typeof b];
      if (typeof aVal === 'bigint' && typeof bVal === 'bigint') {
        return sortDirection === 'asc' ? Number(aVal - bVal) : Number(bVal - aVal);
      }
      return 0;
    });
  }, [rankingMetrics, sortColumn, sortDirection, filterDataSource]);

  if (isLoading || actorFetching) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading ranking data...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className="space-y-2">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
          Ranking & Indices
        </h1>
        <p className="text-muted-foreground text-lg">
          MOAP website rankings from third-party SEO/analytics domains with comprehensive metrics
        </p>
      </div>

      <Card className="border-2 border-primary/20 shadow-lg">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Ranking Metrics</CardTitle>
              <CardDescription>Sortable and filterable ranking data from multiple sources</CardDescription>
            </div>
            <div className="flex gap-2">
              <Select value={filterDataSource} onValueChange={setFilterDataSource}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by source" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Sources</SelectItem>
                  <SelectItem value="Google Analytics">Google Analytics</SelectItem>
                  <SelectItem value="SEMrush">SEMrush</SelectItem>
                  <SelectItem value="Ahrefs">Ahrefs</SelectItem>
                </SelectContent>
              </Select>
              <Button onClick={() => refetch()} variant="outline" size="icon">
                <RefreshCw className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {filteredAndSortedMetrics.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No ranking metrics available</p>
              <p className="text-sm text-muted-foreground mt-2">Backend integration pending</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>
                      <Button variant="ghost" onClick={() => handleSort('seoRank')} className="flex items-center gap-1">
                        SEO Rank
                        <ArrowUpDown className="h-3 w-3" />
                      </Button>
                    </TableHead>
                    <TableHead>
                      <Button variant="ghost" onClick={() => handleSort('visitors')} className="flex items-center gap-1">
                        Visitors
                        <ArrowUpDown className="h-3 w-3" />
                      </Button>
                    </TableHead>
                    <TableHead>Avg Session</TableHead>
                    <TableHead>Pages Indexed</TableHead>
                    <TableHead>Popularity</TableHead>
                    <TableHead>Load Speed</TableHead>
                    <TableHead>Rank Δ</TableHead>
                    <TableHead>Data Source</TableHead>
                    <TableHead>Verification</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAndSortedMetrics.map((metric) => (
                    <TableRow key={Number(metric.id)}>
                      <TableCell className="font-medium">#{Number(metric.seoRank)}</TableCell>
                      <TableCell>{Number(metric.visitors).toLocaleString()}</TableCell>
                      <TableCell>{Number(metric.avgSessionDuration)}s</TableCell>
                      <TableCell>{Number(metric.totalPagesIndexed)}</TableCell>
                      <TableCell>{Number(metric.popularityScore)}</TableCell>
                      <TableCell>{Number(metric.loadSpeed)}ms</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          {Number(metric.rankDelta) > 0 ? (
                            <TrendingUp className="h-4 w-4 text-green-600" />
                          ) : (
                            <TrendingDown className="h-4 w-4 text-red-600" />
                          )}
                          <span>{Number(metric.rankDelta)}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{metric.dataSource}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          {metric.isAiCollected && <Badge variant="secondary">AI</Badge>}
                          {metric.isAdminVerified && <Badge variant="default">Admin</Badge>}
                        </div>
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
