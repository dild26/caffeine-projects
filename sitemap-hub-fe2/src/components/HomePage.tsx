import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Search, Shield, Zap, Globe, ArrowRight, CreditCard, Package } from 'lucide-react';
import SearchInterface from '@/components/SearchInterface';

type Page = 'home' | 'about' | 'contact' | 'dashboard' | 'sitemaps' | 'subscription' | 'referrals' | 'admin';

interface HomePageProps {
  onNavigate: (page: Page) => void;
}

export default function HomePage({ onNavigate }: HomePageProps) {
  return (
    <div className="space-y-16 p-6">
      {/* Hero Section */}
      <section className="hero-gradient py-20 rounded-lg">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
              The Future of Sitemap Intelligence
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-8 leading-relaxed">
              Discover, analyze, and monitor billions of URLs across millions of domains with our 
              next-generation sitemap subscription platform powered by AI.
            </p>
          </div>
        </div>
      </section>

      {/* Subscription Options Cards */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Choose Your Subscription Model
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Flexible pricing options designed to scale with your needs, from individual searches to enterprise domain batches.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Card className="cyber-gradient border-primary/20 hover:border-primary/40 transition-all duration-300 hover:scale-105">
              <CardHeader className="text-center">
                <div className="flex justify-center mb-4">
                  <CreditCard className="h-12 w-12 text-primary" />
                </div>
                <CardTitle className="text-2xl">Pay As You Use</CardTitle>
                <CardDescription className="text-base">
                  One-time payment for lifetime access to highest quality domains
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center space-y-4">
                <div className="text-3xl font-bold text-primary">$0.01 - $1,000</div>
                <div className="text-muted-foreground">per batch (lifetime access)</div>
                <div className="bg-accent/10 p-4 rounded-lg">
                  <p className="text-sm font-semibold text-accent">
                    🚀 Top Quality Domain Batches Available
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    From Top 10 to Top 1,000,000 highest quality domains with instant access
                  </p>
                </div>
                <Button 
                  className="w-full neon-glow" 
                  onClick={() => onNavigate('subscription')}
                >
                  Get Started
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>

            <Card className="cyber-gradient border-accent/20 hover:border-accent/40 transition-all duration-300 hover:scale-105">
              <CardHeader className="text-center">
                <div className="flex justify-center mb-4">
                  <Package className="h-12 w-12 text-accent" />
                </div>
                <CardTitle className="text-2xl">Standard Subscription</CardTitle>
                <CardDescription className="text-base">
                  Best value for regular users and growing businesses
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center space-y-4">
                <div className="text-3xl font-bold text-accent">$9</div>
                <div className="text-muted-foreground">per month</div>
                <div className="bg-primary/10 p-4 rounded-lg">
                  <p className="text-sm font-semibold text-primary">
                    ⚡ Enhanced Domain Batch Limits
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Higher limits and priority processing for domain batches
                  </p>
                </div>
                <Button 
                  variant="outline" 
                  className="w-full border-accent text-accent hover:bg-accent hover:text-accent-foreground" 
                  onClick={() => onNavigate('subscription')}
                >
                  Choose Plan
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Public Advanced Sitemap Search - MOVED HERE */}
      <section className="py-16 bg-gradient-to-br from-primary/5 via-accent/5 to-primary/5 rounded-lg border-2 border-primary/20 shadow-xl">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <div className="inline-block mb-4">
              <div className="flex items-center justify-center space-x-2 bg-gradient-to-r from-primary to-accent text-white px-6 py-2 rounded-full shadow-lg">
                <Search className="h-5 w-5" />
                <span className="font-bold text-lg">Featured Search</span>
              </div>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
              Advanced Sitemap Search
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Search through millions of sitemaps instantly with our powerful unified search engine. 
              Filter by extension (.com, .net, .org, etc.), discover URLs with inurl-style keywords, 
              and preview content securely. No registration required for basic searches.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <div className="bg-white dark:bg-gray-800 px-4 py-2 rounded-full shadow-md border border-primary/20">
                <span className="text-sm font-semibold text-primary">✓ 2.5M+ Domains</span>
              </div>
              <div className="bg-white dark:bg-gray-800 px-4 py-2 rounded-full shadow-md border border-accent/20">
                <span className="text-sm font-semibold text-accent">✓ 1.2B+ URLs</span>
              </div>
              <div className="bg-white dark:bg-gray-800 px-4 py-2 rounded-full shadow-md border border-primary/20">
                <span className="text-sm font-semibold text-primary">✓ All TLDs Supported</span>
              </div>
            </div>
          </div>

          <div className="max-w-5xl mx-auto">
            <SearchInterface />
          </div>
        </div>
      </section>

      {/* Pay As You Use Section */}
      <section className="py-16 bg-muted/30 rounded-lg">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Pay As You Use - Domain Batches
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Choose from our carefully curated domain batches with one-time payment and lifetime access to the highest quality domains.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto mb-12">
            {/* Top 10 */}
            <Card className="cyber-gradient border-primary/20 hover:border-primary/40 transition-all duration-300">
              <CardHeader className="text-center">
                <div className="flex justify-center mb-2">
                  <Package className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="text-lg">Top 10</CardTitle>
                <div className="text-2xl font-bold text-primary">$0.01</div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="text-center">
                  <div className="text-sm font-semibold">One-time/Lifetime Access</div>
                  <div className="text-xs text-muted-foreground">Top 10 highest quality domains</div>
                </div>
                <ul className="text-xs space-y-1">
                  <li>• Instant access</li>
                  <li>• Full sitemap data</li>
                  <li>• Quality scores</li>
                  <li>• Backlink info</li>
                </ul>
              </CardContent>
            </Card>

            {/* Top 100 - Best Value */}
            <Card className="cyber-gradient border-accent/20 hover:border-accent/40 transition-all duration-300 relative">
              <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
                <div className="bg-accent text-accent-foreground px-3 py-1 rounded-full text-xs font-semibold">
                  Best Value
                </div>
              </div>
              <CardHeader className="text-center pt-6">
                <div className="flex justify-center mb-2">
                  <Package className="h-8 w-8 text-accent" />
                </div>
                <CardTitle className="text-lg">Top 100</CardTitle>
                <div className="text-2xl font-bold text-accent">$0.1</div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="text-center">
                  <div className="text-sm font-semibold">One-time/Lifetime Access</div>
                  <div className="text-xs text-muted-foreground">Top 100 highest quality domains</div>
                </div>
                <ul className="text-xs space-y-1">
                  <li>• Instant access</li>
                  <li>• Full sitemap data</li>
                  <li>• Quality scores</li>
                  <li>• Backlink info</li>
                </ul>
              </CardContent>
            </Card>

            {/* Top 1,000 */}
            <Card className="cyber-gradient border-primary/20 hover:border-primary/40 transition-all duration-300">
              <CardHeader className="text-center">
                <div className="flex justify-center mb-2">
                  <Package className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="text-lg">Top 1,000</CardTitle>
                <div className="text-2xl font-bold text-primary">$1</div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="text-center">
                  <div className="text-sm font-semibold">One-time/Lifetime Access</div>
                  <div className="text-xs text-muted-foreground">Top 1,000 highest quality domains</div>
                </div>
                <ul className="text-xs space-y-1">
                  <li>• Instant access</li>
                  <li>• Full sitemap data</li>
                  <li>• Quality scores</li>
                  <li>• Backlink info</li>
                </ul>
              </CardContent>
            </Card>

            {/* Top 10,000 */}
            <Card className="cyber-gradient border-primary/20 hover:border-primary/40 transition-all duration-300">
              <CardHeader className="text-center">
                <div className="flex justify-center mb-2">
                  <Package className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="text-lg">Top 10,000</CardTitle>
                <div className="text-2xl font-bold text-primary">$10</div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="text-center">
                  <div className="text-sm font-semibold">One-time/Lifetime Access</div>
                  <div className="text-xs text-muted-foreground">Top 10,000 highest quality domains</div>
                </div>
                <ul className="text-xs space-y-1">
                  <li>• Instant access</li>
                  <li>• Full sitemap data</li>
                  <li>• Quality scores</li>
                  <li>• Backlink info</li>
                </ul>
              </CardContent>
            </Card>

            {/* Top 100,000 */}
            <Card className="cyber-gradient border-primary/20 hover:border-primary/40 transition-all duration-300">
              <CardHeader className="text-center">
                <div className="flex justify-center mb-2">
                  <Package className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="text-lg">Top 100,000</CardTitle>
                <div className="text-2xl font-bold text-primary">$100</div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="text-center">
                  <div className="text-sm font-semibold">One-time/Lifetime Access</div>
                  <div className="text-xs text-muted-foreground">Top 100,000 highest quality domains</div>
                </div>
                <ul className="text-xs space-y-1">
                  <li>• Instant access</li>
                  <li>• Full sitemap data</li>
                  <li>• Quality scores</li>
                  <li>• Backlink info</li>
                </ul>
              </CardContent>
            </Card>

            {/* Top 1,000,000 */}
            <Card className="cyber-gradient border-primary/20 hover:border-primary/40 transition-all duration-300">
              <CardHeader className="text-center">
                <div className="flex justify-center mb-2">
                  <Package className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="text-lg">Top 1,000,000</CardTitle>
                <div className="text-2xl font-bold text-primary">$1,000</div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="text-center">
                  <div className="text-sm font-semibold">One-time/Lifetime Access</div>
                  <div className="text-xs text-muted-foreground">Top 1,000,000 highest quality domains</div>
                </div>
                <ul className="text-xs space-y-1">
                  <li>• Instant access</li>
                  <li>• Full sitemap data</li>
                  <li>• Quality scores</li>
                  <li>• Backlink info</li>
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Why Choose Pay As You Use */}
          <Card className="cyber-gradient border-accent/20 max-w-4xl mx-auto">
            <CardHeader>
              <CardTitle className="text-center text-2xl">Why Choose Pay As You Use?</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                <div className="space-y-2">
                  <div className="text-4xl">💰</div>
                  <h3 className="font-semibold">No Recurring Fees</h3>
                  <p className="text-sm text-muted-foreground">
                    Pay once and access your purchased domains forever. No monthly subscriptions or hidden costs.
                  </p>
                </div>
                <div className="space-y-2">
                  <div className="text-4xl">⚡</div>
                  <h3 className="font-semibold">Instant Access</h3>
                  <p className="text-sm text-muted-foreground">
                    Get immediate access to your domain data with lightning-fast processing and real-time results.
                  </p>
                </div>
                <div className="space-y-2">
                  <div className="text-4xl">🔒</div>
                  <h3 className="font-semibold">Lifetime Access</h3>
                  <p className="text-sm text-muted-foreground">
                    Your purchased domain data remains accessible forever with lifetime access to all features.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Built for Scale, Designed for Speed
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Our platform handles billions of users and millions of domains with enterprise-grade 
              performance and reliability.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="cyber-gradient border-primary/20">
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <Globe className="h-8 w-8 text-primary" />
                  <CardTitle>Global Coverage</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  Access sitemap data from millions of domains worldwide with real-time updates 
                  and comprehensive coverage across all major TLDs.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="cyber-gradient border-accent/20">
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <Zap className="h-8 w-8 text-accent" />
                  <CardTitle>Lightning Fast</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  Powered by the Internet Computer blockchain for instant queries and 
                  sub-second response times, even with billions of indexed URLs.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="cyber-gradient border-primary/20">
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <Shield className="h-8 w-8 text-primary" />
                  <CardTitle>Secure & Private</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  Built on Internet Identity for secure authentication without compromising 
                  privacy. Your data stays protected with blockchain-level security.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
