import React from 'react';
import SubscriptionTiers from '@/components/SubscriptionTiers';
import PayAsYouUsePurchase from '@/components/PayAsYouUsePurchase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CreditCard, Package, Zap, Shield, Star, TrendingUp } from 'lucide-react';

type Page = 'home' | 'about' | 'contact' | 'dashboard' | 'sitemaps' | 'subscription' | 'referrals' | 'admin';

interface SubscriptionPageProps {
  onNavigate: (page: Page) => void;
}

export default function SubscriptionPage({ onNavigate }: SubscriptionPageProps) {
  return (
    <div className="space-y-8 p-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
          Subscription Plans
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Choose the perfect plan for your sitemap intelligence needs. From flexible pay-per-use to comprehensive enterprise solutions.
        </p>
      </div>

      {/* Subscription Models Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
        <Card className="cyber-gradient border-primary/20">
          <CardHeader>
            <div className="flex items-center space-x-2">
              <CreditCard className="h-6 w-6 text-primary" />
              <CardTitle>Pay As You Use</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-muted-foreground">
              Perfect for one-time purchases with lifetime access to the highest quality domains. No recurring fees, instant access.
            </p>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Top 10 Domains:</span>
                <span className="font-semibold text-primary">$0.01</span>
              </div>
              <div className="flex justify-between">
                <span>Top 100 Domains:</span>
                <span className="font-semibold text-primary">$0.1</span>
              </div>
              <div className="flex justify-between">
                <span>Top 1,000 Domains:</span>
                <span className="font-semibold text-primary">$1</span>
              </div>
              <div className="flex justify-between">
                <span>Top 10,000 Domains:</span>
                <span className="font-semibold text-primary">$10</span>
              </div>
              <div className="flex justify-between">
                <span>Top 100,000 Domains:</span>
                <span className="font-semibold text-primary">$100</span>
              </div>
              <div className="flex justify-between">
                <span>Top 1,000,000 Domains:</span>
                <span className="font-semibold text-primary">$1,000</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="cyber-gradient border-accent/20">
          <CardHeader>
            <div className="flex items-center space-x-2">
              <Package className="h-6 w-6 text-accent" />
              <CardTitle>Standard Subscriptions</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-muted-foreground">
              Best value for regular users with predictable usage patterns. Includes enhanced features and priority support.
            </p>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Basic Plan:</span>
                <span className="font-semibold text-accent">$9/month</span>
              </div>
              <div className="flex justify-between">
                <span>Pro Plan:</span>
                <span className="font-semibold text-accent">$45/month</span>
              </div>
              <div className="flex justify-between">
                <span>Enterprise Plan:</span>
                <span className="font-semibold text-accent">$99/month</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Subscription Options */}
      <div className="max-w-6xl mx-auto">
        <Tabs defaultValue="pay-as-you-use" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="pay-as-you-use" className="flex items-center gap-2">
              <CreditCard className="h-4 w-4" />
              Pay As You Use
            </TabsTrigger>
            <TabsTrigger value="standard-plans" className="flex items-center gap-2">
              <Package className="h-4 w-4" />
              Standard Plans
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="pay-as-you-use" className="space-y-6">
            <PayAsYouUsePurchase />
          </TabsContent>
          
          <TabsContent value="standard-plans" className="space-y-6">
            <SubscriptionTiers />
          </TabsContent>
        </Tabs>
      </div>

      {/* Features Comparison */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
        <Card className="cyber-gradient border-primary/20">
          <CardHeader>
            <div className="flex items-center space-x-2">
              <Zap className="h-6 w-6 text-primary" />
              <CardTitle>Domain Batch Processing</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-3">
              Process multiple domains efficiently with our advanced batch processing system:
            </p>
            <ul className="space-y-2 text-sm">
              <li>• Parallel processing for maximum speed</li>
              <li>• Volume discounts on larger batches</li>
              <li>• Instant results and comprehensive reports</li>
              <li>• Multiple export formats (JSON, CSV, XML)</li>
              <li>• Real-time progress tracking</li>
              <li>• Priority queue for subscribers</li>
            </ul>
          </CardContent>
        </Card>

        <Card className="cyber-gradient border-accent/20">
          <CardHeader>
            <div className="flex items-center space-x-2">
              <Shield className="h-6 w-6 text-accent" />
              <CardTitle>Enhanced Features</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-3">
              Subscribers get access to advanced features and higher limits:
            </p>
            <ul className="space-y-2 text-sm">
              <li>• Higher API rate limits and quotas</li>
              <li>• Advanced filtering and search options</li>
              <li>• Historical data access and trends</li>
              <li>• Priority customer support (24/7)</li>
              <li>• Custom integrations and webhooks</li>
              <li>• Dedicated account management</li>
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* Value Proposition */}
      <Card className="cyber-gradient border-green-500/20 max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-center justify-center">
            <Star className="h-6 w-6 text-green-500" />
            Why Choose Our Platform?
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center space-y-2">
              <TrendingUp className="h-8 w-8 text-green-500 mx-auto" />
              <h3 className="font-semibold">Scalable Solutions</h3>
              <p className="text-sm text-muted-foreground">
                From individual researchers to enterprise teams, our platform scales with your needs
              </p>
            </div>
            <div className="text-center space-y-2">
              <Zap className="h-8 w-8 text-primary mx-auto" />
              <h3 className="font-semibold">Lightning Fast</h3>
              <p className="text-sm text-muted-foreground">
                Process thousands of domains in seconds with our optimized infrastructure
              </p>
            </div>
            <div className="text-center space-y-2">
              <Shield className="h-8 w-8 text-accent mx-auto" />
              <h3 className="font-semibold">Enterprise Ready</h3>
              <p className="text-sm text-muted-foreground">
                Built for reliability with 99.9% uptime and enterprise-grade security
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
