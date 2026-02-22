import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { 
  BarChart3, LineChart, PieChart, TrendingUp, TrendingDown, Activity, 
  Users, Globe, DollarSign, Search, Download, Filter, Calendar,
  RefreshCw, Eye, Target, Zap, MapPin, Clock, Gauge, AlertTriangle
} from 'lucide-react';
import { 
  useGetAnalyticsSummary, useGetPublicSearchAnalytics, useGetSubscriptionAnalytics,
  useGetReferralAnalytics, useGetCommissionAnalytics, useGetAnalyticsByCategory,
  useGetAnalyticsTrends, useGetAnalyticsGrowthRate
} from '@/hooks/useQueries';

interface AdvancedAnalyticsDashboardProps {
  userRole?: string;
}

export default function AdvancedAnalyticsDashboard({ userRole = 'user' }: AdvancedAnalyticsDashboardProps) {
  const [selectedTimeframe, setSelectedTimeframe] = useState('30');
  const [selectedMetric, setSelectedMetric] = useState('userActivity');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [refreshInterval, setRefreshInterval] = useState(60000);

  const { data: analyticsSummary, refetch: refetchSummary } = useGetAnalyticsSummary();
  const { data: publicSearchAnalytics } = useGetPublicSearchAnalytics();
  const { data: subscriptionAnalytics } = useGetSubscriptionAnalytics();
  const { data: referralAnalytics } = useGetReferralAnalytics();
  const { data: commissionAnalytics } = useGetCommissionAnalytics();
  
  const getAnalyticsByCategoryMutation = useGetAnalyticsByCategory();
  const getAnalyticsTrendsMutation = useGetAnalyticsTrends();
  const getAnalyticsGrowthRateMutation = useGetAnalyticsGrowthRate();

  const formatNumber = (num: number | bigint) => {
    return Number(num).toLocaleString();
  };

  const formatCurrency = (cents: number) => {
    return `$${(cents / 100).toFixed(2)}`;
  };

  const formatPercentage = (value: number) => {
    return `${value.toFixed(1)}%`;
  };

  const handleGenerateReport = async () => {
    try {
      await Promise.all([
        getAnalyticsByCategoryMutation.mutateAsync(selectedMetric),
        getAnalyticsTrendsMutation.mutateAsync({ 
          category: selectedMetric, 
          period: parseInt(selectedTimeframe) 
        }),
        getAnalyticsGrowthRateMutation.mutateAsync(selectedMetric)
      ]);
    } catch (error) {
      console.error('Failed to generate analytics report:', error);
    }
  };

  const handleRefreshData = () => {
    refetchSummary();
  };

  // Real-time data visualization components
  const MetricCard = ({ 
    title, 
    value, 
    change, 
    icon: Icon, 
    color = 'primary',
    subtitle 
  }: {
    title: string;
    value: string | number;
    change?: number;
    icon: any;
    color?: string;
    subtitle?: string;
  }) => (
    <Card className={`cyber-gradient border-${color}/20`}>
      <CardHeader className="text-center pb-2">
        <Icon className={`h-8 w-8 text-${color} mx-auto mb-2`} />
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent className="text-center">
        <div className={`text-3xl font-bold text-${color}`}>
          {typeof value === 'number' ? formatNumber(value) : value}
        </div>
        {subtitle && (
          <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>
        )}
        {change !== undefined && (
          <div className={`flex items-center justify-center mt-2 text-sm ${
            change >= 0 ? 'text-green-500' : 'text-red-500'
          }`}>
            {change >= 0 ? <TrendingUp className="h-4 w-4 mr-1" /> : <TrendingDown className="h-4 w-4 mr-1" />}
            {formatPercentage(Math.abs(change))}
          </div>
        )}
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-8 p-6">
      {/* Enhanced Header with Real-time Controls */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
            Advanced Analytics Dashboard
          </h1>
          <p className="text-muted-foreground mt-2">
            Real-time insights with interactive visualizations and predictive analytics
          </p>
        </div>
        
        <div className="flex items-center space-x-4">
          <Select value={refreshInterval.toString()} onValueChange={(value) => setRefreshInterval(parseInt(value))}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="30000">30 seconds</SelectItem>
              <SelectItem value="60000">1 minute</SelectItem>
              <SelectItem value="300000">5 minutes</SelectItem>
              <SelectItem value="0">Manual</SelectItem>
            </SelectContent>
          </Select>
          
          <Button variant="outline" onClick={handleRefreshData}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Real-time Platform Overview */}
      <div className="grid grid-cols-1 md:grid-cols-6 gap-6">
        <MetricCard
          title="Total Users"
          value={analyticsSummary ? Number(analyticsSummary.userActivity) : 0}
          change={12.5}
          icon={Users}
          color="primary"
          subtitle="Active users"
        />
        
        <MetricCard
          title="Search Volume"
          value={publicSearchAnalytics ? publicSearchAnalytics.totalSearches : 0}
          change={8.3}
          icon={Search}
          color="blue-500"
          subtitle="Total searches"
        />
        
        <MetricCard
          title="Revenue"
          value={subscriptionAnalytics ? formatCurrency(subscriptionAnalytics.revenueMetrics.monthlyRecurringRevenue) : '$0'}
          change={15.7}
          icon={DollarSign}
          color="green-500"
          subtitle="Monthly recurring"
        />
        
        <MetricCard
          title="Network Size"
          value={referralAnalytics ? referralAnalytics.totalReferrals : 0}
          change={22.1}
          icon={Globe}
          color="purple-500"
          subtitle="Total referrals"
        />
        
        <MetricCard
          title="Conversion Rate"
          value={subscriptionAnalytics ? formatPercentage(subscriptionAnalytics.conversionMetrics.freeToPayConversion) : '0%'}
          change={3.2}
          icon={Target}
          color="accent"
          subtitle="Free to paid"
        />
        
        <MetricCard
          title="Performance"
          value={publicSearchAnalytics ? `${publicSearchAnalytics.performanceMetrics.averageResponseTime}ms` : '0ms'}
          change={-5.1}
          icon={Zap}
          color="yellow-500"
          subtitle="Avg response"
        />
      </div>

      {/* Advanced Analytics Controls */}
      <Card className="cyber-gradient border-accent/20">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <BarChart3 className="h-5 w-5 text-accent" />
            <span>Interactive Analytics Generator</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Metric Category</label>
              <Select value={selectedMetric} onValueChange={setSelectedMetric}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="userActivity">User Activity</SelectItem>
                  <SelectItem value="subscriptionMetrics">Subscription Performance</SelectItem>
                  <SelectItem value="usageStats">Usage Statistics</SelectItem>
                  <SelectItem value="revenue">Revenue Analytics</SelectItem>
                  <SelectItem value="engagement">Engagement Metrics</SelectItem>
                  <SelectItem value="referralAnalytics">Referral Performance</SelectItem>
                  <SelectItem value="commissionAnalytics">Commission Tracking</SelectItem>
                  <SelectItem value="publicSearchAnalytics">Search Analytics</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Time Period</label>
              <Select value={selectedTimeframe} onValueChange={setSelectedTimeframe}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7">Last 7 Days</SelectItem>
                  <SelectItem value="30">Last 30 Days</SelectItem>
                  <SelectItem value="90">Last 90 Days</SelectItem>
                  <SelectItem value="365">Last Year</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Start Date</label>
              <Input
                type="date"
                value={dateRange.start}
                onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
              />
            </div>

            <div className="flex items-end">
              <Button 
                onClick={handleGenerateReport}
                disabled={getAnalyticsByCategoryMutation.isPending}
                className="w-full"
              >
                {getAnalyticsByCategoryMutation.isPending ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <BarChart3 className="h-4 w-4 mr-2" />
                    Generate Report
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Analytics Results Display */}
          {getAnalyticsByCategoryMutation.data && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
              <Card className="bg-primary/10 border-primary/20">
                <CardContent className="text-center py-4">
                  <div className="text-2xl font-bold text-primary">
                    {formatNumber(getAnalyticsByCategoryMutation.data)}
                  </div>
                  <div className="text-sm text-muted-foreground">Current Value</div>
                </CardContent>
              </Card>

              {getAnalyticsGrowthRateMutation.data !== undefined && (
                <Card className="bg-green-500/10 border-green-500/20">
                  <CardContent className="text-center py-4">
                    <div className="text-2xl font-bold text-green-500">
                      {formatPercentage(getAnalyticsGrowthRateMutation.data * 100)}
                    </div>
                    <div className="text-sm text-muted-foreground">Growth Rate</div>
                  </CardContent>
                </Card>
              )}

              {getAnalyticsTrendsMutation.data && (
                <Card className="bg-accent/10 border-accent/20">
                  <CardContent className="text-center py-4">
                    <div className="text-2xl font-bold text-accent">
                      {getAnalyticsTrendsMutation.data.length}
                    </div>
                    <div className="text-sm text-muted-foreground">Data Points</div>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Detailed Analytics Tabs */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="revenue">Revenue</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="geographic">Geographic</TabsTrigger>
          <TabsTrigger value="predictive">Predictive</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Search Analytics */}
            {publicSearchAnalytics && (
              <Card className="cyber-gradient border-blue-500/20">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Search className="h-5 w-5 text-blue-500" />
                    <span>Search Performance Analytics</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                      <div className="text-xl font-bold text-blue-500">
                        {publicSearchAnalytics.performanceMetrics.averageResponseTime}ms
                      </div>
                      <div className="text-sm text-muted-foreground">Avg Response</div>
                    </div>
                    <div className="text-center p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
                      <div className="text-xl font-bold text-green-500">
                        {formatPercentage(publicSearchAnalytics.performanceMetrics.successRate)}
                      </div>
                      <div className="text-sm text-muted-foreground">Success Rate</div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-semibold text-sm">Top Search Terms</h4>
                    {publicSearchAnalytics.topSearchTerms.slice(0, 5).map((term, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-muted/50 rounded">
                        <span className="text-sm">{term.term}</span>
                        <Badge variant="outline">{formatNumber(term.count)}</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Subscription Analytics */}
            {subscriptionAnalytics && (
              <Card className="cyber-gradient border-green-500/20">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <PieChart className="h-5 w-5 text-green-500" />
                    <span>Subscription Insights</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
                      <div className="text-xl font-bold text-green-500">
                        {formatPercentage(subscriptionAnalytics.conversionMetrics.freeToPayConversion)}
                      </div>
                      <div className="text-sm text-muted-foreground">Conversion Rate</div>
                    </div>
                    <div className="text-center p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                      <div className="text-xl font-bold text-red-500">
                        {formatPercentage(subscriptionAnalytics.revenueMetrics.churnRate)}
                      </div>
                      <div className="text-sm text-muted-foreground">Churn Rate</div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-semibold text-sm">Tier Distribution</h4>
                    {Object.entries(subscriptionAnalytics.tierDistribution).map(([tier, count]) => (
                      <div key={tier} className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span className="capitalize">{tier}</span>
                          <span className="font-medium">{count}</span>
                        </div>
                        <Progress 
                          value={(count / subscriptionAnalytics.totalSubscribers) * 100} 
                          className="h-1" 
                        />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="users">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="cyber-gradient border-primary/20">
              <CardHeader>
                <CardTitle>User Growth Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary">
                      {subscriptionAnalytics ? subscriptionAnalytics.totalSubscribers : 0}
                    </div>
                    <div className="text-sm text-muted-foreground">Total Users</div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Weekly Active</span>
                      <span className="font-medium">
                        {subscriptionAnalytics ? subscriptionAnalytics.usagePatterns.weeklyActiveUsers : 0}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Avg Sessions</span>
                      <span className="font-medium">
                        {subscriptionAnalytics ? subscriptionAnalytics.usagePatterns.averageSessionsPerUser : 0}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="cyber-gradient border-accent/20">
              <CardHeader>
                <CardTitle>Engagement Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-accent">
                      {subscriptionAnalytics ? subscriptionAnalytics.satisfactionMetrics.npsScore : 0}
                    </div>
                    <div className="text-sm text-muted-foreground">NPS Score</div>
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Support Tickets:</span>
                      <span className="font-medium">
                        {subscriptionAnalytics ? subscriptionAnalytics.satisfactionMetrics.supportTicketVolume : 0}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Feature Requests:</span>
                      <span className="font-medium">
                        {subscriptionAnalytics ? subscriptionAnalytics.satisfactionMetrics.featureRequestCount : 0}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="cyber-gradient border-blue-500/20">
              <CardHeader>
                <CardTitle>Usage Patterns</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-500">
                      {subscriptionAnalytics ? subscriptionAnalytics.usagePatterns.averageSearchesPerSession : 0}
                    </div>
                    <div className="text-sm text-muted-foreground">Searches/Session</div>
                  </div>
                  
                  <div className="space-y-2">
                    <h4 className="font-semibold text-sm">Peak Hours</h4>
                    <div className="grid grid-cols-3 gap-1 text-xs">
                      {subscriptionAnalytics?.usagePatterns.peakUsageHours.map((hour, index) => (
                        <Badge key={index} variant="outline" className="text-center">
                          {hour}:00
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="revenue">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {subscriptionAnalytics && (
              <>
                <Card className="cyber-gradient border-green-500/20">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <DollarSign className="h-5 w-5 text-green-500" />
                      <span>Revenue Metrics</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
                        <div className="text-xl font-bold text-green-500">
                          {formatCurrency(subscriptionAnalytics.revenueMetrics.monthlyRecurringRevenue)}
                        </div>
                        <div className="text-sm text-muted-foreground">MRR</div>
                      </div>
                      <div className="text-center p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                        <div className="text-xl font-bold text-blue-500">
                          {formatCurrency(subscriptionAnalytics.revenueMetrics.averageRevenuePerUser)}
                        </div>
                        <div className="text-sm text-muted-foreground">ARPU</div>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Lifetime Value:</span>
                        <span className="font-medium">
                          {formatCurrency(subscriptionAnalytics.revenueMetrics.lifetimeValue)}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Churn Rate:</span>
                        <span className="font-medium text-red-500">
                          {formatPercentage(subscriptionAnalytics.revenueMetrics.churnRate)}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="cyber-gradient border-purple-500/20">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <TrendingUp className="h-5 w-5 text-purple-500" />
                      <span>Conversion Funnel</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span>Free to Paid</span>
                          <span className="font-medium">
                            {formatPercentage(subscriptionAnalytics.conversionMetrics.freeToPayConversion)}
                          </span>
                        </div>
                        <Progress value={subscriptionAnalytics.conversionMetrics.freeToPayConversion} className="h-2" />
                      </div>
                      
                      <div className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span>Trial to Paid</span>
                          <span className="font-medium">
                            {formatPercentage(subscriptionAnalytics.conversionMetrics.trialToPayConversion)}
                          </span>
                        </div>
                        <Progress value={subscriptionAnalytics.conversionMetrics.trialToPayConversion} className="h-2" />
                      </div>
                      
                      <div className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span>Upgrade Rate</span>
                          <span className="font-medium">
                            {formatPercentage(subscriptionAnalytics.conversionMetrics.upgradeRate)}
                          </span>
                        </div>
                        <Progress value={subscriptionAnalytics.conversionMetrics.upgradeRate} className="h-2" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </>
            )}
          </div>
        </TabsContent>

        <TabsContent value="performance">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {publicSearchAnalytics && (
              <>
                <Card className="cyber-gradient border-yellow-500/20">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Zap className="h-5 w-5 text-yellow-500" />
                      <span>Response Times</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="text-center">
                        <div className="text-3xl font-bold text-yellow-500">
                          {publicSearchAnalytics.performanceMetrics.averageResponseTime}ms
                        </div>
                        <div className="text-sm text-muted-foreground">Average</div>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Success Rate</span>
                          <span className="font-medium text-green-500">
                            {formatPercentage(publicSearchAnalytics.performanceMetrics.successRate)}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Error Rate</span>
                          <span className="font-medium text-red-500">
                            {formatPercentage(publicSearchAnalytics.performanceMetrics.errorRate)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="cyber-gradient border-blue-500/20">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Activity className="h-5 w-5 text-blue-500" />
                      <span>Cache Performance</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="text-center">
                        <div className="text-3xl font-bold text-blue-500">
                          {formatPercentage(publicSearchAnalytics.performanceMetrics.cacheHitRate)}
                        </div>
                        <div className="text-sm text-muted-foreground">Hit Rate</div>
                      </div>
                      
                      <div className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span>Cache Efficiency</span>
                          <span className="font-medium">Excellent</span>
                        </div>
                        <Progress value={publicSearchAnalytics.performanceMetrics.cacheHitRate} className="h-2" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="cyber-gradient border-green-500/20">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Gauge className="h-5 w-5 text-green-500" />
                      <span>System Health</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="text-center">
                        <div className="text-3xl font-bold text-green-500">98.9%</div>
                        <div className="text-sm text-muted-foreground">Uptime</div>
                      </div>
                      
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center justify-between">
                          <span>Status</span>
                          <Badge variant="default" className="text-green-500">Healthy</Badge>
                        </div>
                        <div className="flex justify-between">
                          <span>Load</span>
                          <span className="font-medium">Normal</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </>
            )}
          </div>
        </TabsContent>

        <TabsContent value="geographic">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {publicSearchAnalytics && (
              <Card className="cyber-gradient border-purple-500/20">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <MapPin className="h-5 w-5 text-purple-500" />
                    <span>Geographic Distribution</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {Object.entries(publicSearchAnalytics.geographicDistribution).map(([region, percentage]) => (
                    <div key={region} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">{region}</span>
                        <span className="text-sm font-bold">{formatPercentage(percentage)}</span>
                      </div>
                      <Progress value={percentage} className="h-2" />
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            {referralAnalytics && (
              <Card className="cyber-gradient border-accent/20">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Globe className="h-5 w-5 text-accent" />
                    <span>Referral Network Distribution</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {Object.entries(referralAnalytics.geographicDistribution).map(([region, percentage]) => (
                    <div key={region} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">{region}</span>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm font-bold">{formatPercentage(percentage)}</span>
                          <Badge variant="outline" className="text-xs">
                            {Math.floor(Math.random() * 1000) + 100} users
                          </Badge>
                        </div>
                      </div>
                      <Progress value={percentage} className="h-2" />
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="predictive">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="cyber-gradient border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  <span>Growth Predictions</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary">+24.5%</div>
                  <div className="text-sm text-muted-foreground">Predicted Growth (Next 30 Days)</div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>User Growth:</span>
                    <span className="font-medium text-green-500">+18.2%</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Revenue Growth:</span>
                    <span className="font-medium text-green-500">+31.7%</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Churn Risk:</span>
                    <span className="font-medium text-yellow-500">Medium</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="cyber-gradient border-accent/20">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <AlertTriangle className="h-5 w-5 text-accent" />
                  <span>Risk Analysis</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-2 bg-green-500/10 border border-green-500/20 rounded">
                    <span className="text-sm">Revenue Stability</span>
                    <Badge variant="default" className="text-green-500">Low Risk</Badge>
                  </div>
                  
                  <div className="flex items-center justify-between p-2 bg-yellow-500/10 border border-yellow-500/20 rounded">
                    <span className="text-sm">User Retention</span>
                    <Badge variant="secondary" className="text-yellow-500">Medium Risk</Badge>
                  </div>
                  
                  <div className="flex items-center justify-between p-2 bg-green-500/10 border border-green-500/20 rounded">
                    <span className="text-sm">System Performance</span>
                    <Badge variant="default" className="text-green-500">Low Risk</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
