import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useActor } from '../hooks/useActor';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { ArrowUp, ArrowDown, Activity, Pause, Play, AlertTriangle } from 'lucide-react';

// Local type definitions for missing backend types
interface LiveMonitoringAlert {
  id: bigint;
  metricType: string;
  threshold: bigint;
  currentValue: bigint;
  severity: string;
  message: string;
  timestamp: bigint;
  isResolved: boolean;
}

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

export default function LivePage() {
  const { actor, isFetching: actorFetching } = useActor();
  const [isPaused, setIsPaused] = useState(false);
  const [autoRefreshInterval, setAutoRefreshInterval] = useState(30);

  const { data: alerts = [], refetch: refetchAlerts } = useQuery<LiveMonitoringAlert[]>({
    queryKey: ['liveMonitoringAlerts'],
    queryFn: async () => {
      if (!actor) return [];
      // Backend method not available - using mock data
      console.warn('[LivePage] Backend getAllLiveMonitoringAlerts method not available, using mock data');
      return [];
    },
    enabled: !!actor && !actorFetching,
    refetchInterval: isPaused ? false : autoRefreshInterval * 1000,
  });

  const { data: rankingMetrics = [], refetch: refetchMetrics } = useQuery<RankingMetric[]>({
    queryKey: ['rankingMetrics'],
    queryFn: async () => {
      if (!actor) return [];
      // Backend method not available - using mock data
      console.warn('[LivePage] Backend getAllRankingMetrics method not available, using mock data');
      return [];
    },
    enabled: !!actor && !actorFetching,
    refetchInterval: isPaused ? false : autoRefreshInterval * 1000,
  });

  const activeAlerts = alerts.filter((alert) => !alert.isResolved);

  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className="space-y-2">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
          Live Monitoring & Broadcast
        </h1>
        <p className="text-muted-foreground text-lg">
          Real-time dashboard aggregating latest ranking signals, change deltas, and alerts
        </p>
      </div>

      <Card className="border-2 border-primary/20 shadow-lg">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-6 w-6 text-primary" />
                Live Monitoring Controls
              </CardTitle>
              <CardDescription>Auto-refresh every {autoRefreshInterval} seconds</CardDescription>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Switch checked={!isPaused} onCheckedChange={(checked) => setIsPaused(!checked)} id="auto-refresh" />
                <Label htmlFor="auto-refresh" className="flex items-center gap-2">
                  {isPaused ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                  {isPaused ? 'Paused' : 'Active'}
                </Label>
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-primary/20">
          <CardHeader>
            <CardTitle className="text-lg">Active Alerts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-8 w-8 text-yellow-600" />
              <p className="text-4xl font-bold text-yellow-600">{activeAlerts.length}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-primary/20">
          <CardHeader>
            <CardTitle className="text-lg">Total Metrics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Activity className="h-8 w-8 text-primary" />
              <p className="text-4xl font-bold text-primary">{rankingMetrics.length}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-primary/20">
          <CardHeader>
            <CardTitle className="text-lg">Refresh Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold text-green-600">{autoRefreshInterval}s</p>
          </CardContent>
        </Card>
      </div>

      <Card className="border-2 border-primary/20 shadow-lg">
        <CardHeader>
          <CardTitle>Active Alerts</CardTitle>
          <CardDescription>Real-time alerts for significant ranking changes and performance thresholds</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {activeAlerts.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">No active alerts</p>
            ) : (
              activeAlerts.map((alert) => (
                <Card key={Number(alert.id)} className="border-l-4 border-l-yellow-600">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <AlertTriangle className="h-5 w-5 text-yellow-600" />
                          <h3 className="font-semibold">{alert.metricType}</h3>
                          <Badge variant={alert.severity === 'high' ? 'destructive' : 'secondary'}>
                            {alert.severity}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{alert.message}</p>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <span>Threshold: {Number(alert.threshold)}</span>
                          <span>•</span>
                          <span>Current: {Number(alert.currentValue)}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      <Card className="border-2 border-primary/20 shadow-lg">
        <CardHeader>
          <CardTitle>Recent Rank Changes</CardTitle>
          <CardDescription>Latest ranking movements with visual indicators</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {rankingMetrics.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">No ranking metrics available</p>
            ) : (
              rankingMetrics.slice(0, 5).map((metric) => (
                <div key={Number(metric.id)} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <div className="flex items-center gap-3">
                    {Number(metric.rankDelta) > 0 ? (
                      <ArrowUp className="h-5 w-5 text-green-600" />
                    ) : (
                      <ArrowDown className="h-5 w-5 text-red-600" />
                    )}
                    <div>
                      <p className="font-medium">SEO Rank #{Number(metric.seoRank)}</p>
                      <p className="text-sm text-muted-foreground">{metric.dataSource}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">{Number(metric.rankDelta)}</p>
                    <p className="text-xs text-muted-foreground">Change</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
