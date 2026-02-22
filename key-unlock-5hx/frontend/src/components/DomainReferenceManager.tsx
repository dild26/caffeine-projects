import { useState } from 'react';
import { useGetAllDomainReferences } from '../hooks/useDomainReferences';
import { useGetAllSites } from '../hooks/useSites';
import { useDomainClicks, useTrackDomainClick } from '../hooks/useDomainClicks';
import { useDomainVotes, useVoteDomain } from '../hooks/useDomainVotes';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { ExternalLink, Search, Globe, TrendingUp, Zap, Shield, Star, CheckCircle2, Layers, Maximize2, MousePointerClick, ThumbsUp, ThumbsDown } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import DomainPreviewDialog from './DomainPreviewDialog';
import { sanitizeUrl } from '../lib/urlValidator';

interface DomainReferenceManagerProps {
  isAdmin: boolean;
}

export default function DomainReferenceManager({ isAdmin }: DomainReferenceManagerProps) {
  const { data: domainReferences = [], isLoading } = useGetAllDomainReferences();
  const { data: allSites = [] } = useGetAllSites();
  const { data: domainClicks = {} } = useDomainClicks();
  const { data: domainVotes = {} } = useDomainVotes();
  const trackClick = useTrackDomainClick();
  const voteDomain = useVoteDomain();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [previewDomain, setPreviewDomain] = useState<string | null>(null);

  const filteredDomains = domainReferences.filter((domain) => {
    const matchesSearch =
      domain.domain.toLowerCase().includes(searchQuery.toLowerCase()) ||
      domain.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      domain.notes.toLowerCase().includes(searchQuery.toLowerCase()) ||
      domain.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = selectedCategory === 'all' || domain.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const categories = ['all', ...Array.from(new Set(domainReferences.map(d => d.category)))];

  const handleDomainClick = (domain: string) => {
    trackClick.mutate(domain);
    // Sanitize URL before opening
    const url = sanitizeUrl(`https://${domain}`);
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handlePreviewClick = (domain: string) => {
    trackClick.mutate(domain);
    setPreviewDomain(domain);
  };

  const handleVote = (domain: string, voteType: 'up' | 'down') => {
    voteDomain.mutate({ domain, voteType });
  };

  const getVoteScore = (domain: string) => {
    const votes = domainVotes[domain] || { upvotes: 0, downvotes: 0 };
    return votes.upvotes - votes.downvotes;
  };

  if (isLoading) {
    return (
      <Card className="card-3d">
        <CardContent className="py-12">
          <div className="flex items-center justify-center">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Hero Stats Section */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="card-3d card-3d-hover">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Domains</CardTitle>
            <Globe className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gradient">{domainReferences.length}</div>
            <p className="text-xs text-muted-foreground mt-1">Global domain references</p>
          </CardContent>
        </Card>

        <Card className="card-3d card-3d-hover">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Categories</CardTitle>
            <Layers className="h-5 w-5 text-secondary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-secondary">{categories.length - 1}</div>
            <p className="text-xs text-muted-foreground mt-1">Unique categories</p>
          </CardContent>
        </Card>

        <Card className="card-3d card-3d-hover">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Features</CardTitle>
            <Star className="h-5 w-5 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-accent">
              {domainReferences.reduce((sum, d) => sum + d.features.length, 0)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Analyzed features</p>
          </CardContent>
        </Card>

        <Card className="card-3d card-3d-hover">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Clicks</CardTitle>
            <MousePointerClick className="h-5 w-5 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-success">
              {Object.values(domainClicks).reduce((sum, count) => sum + count, 0)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Across all domains</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content with Sidebar */}
      <div className="grid lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <Card className="card-3d lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Layers className="w-5 h-5 text-primary" />
              Domain List
            </CardTitle>
            <CardDescription>All 26 domains</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <ScrollArea className="h-[600px]">
              <div className="space-y-1 p-4">
                {domainReferences.map((domain) => (
                  <button
                    key={domain.domain}
                    onClick={() => {
                      const element = document.getElementById(`domain-${domain.domain}`);
                      element?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    }}
                    className="w-full text-left px-3 py-2 rounded-lg hover:bg-accent/10 transition-colors text-sm"
                  >
                    <div className="font-medium text-center">{domain.domain}</div>
                    <div className="text-xs text-muted-foreground text-center mt-1">{domain.category}</div>
                    {domainClicks[domain.domain] > 0 && (
                      <div className="text-xs text-primary text-center mt-1 font-bold">
                        {domainClicks[domain.domain]} clicks
                      </div>
                    )}
                    {getVoteScore(domain.domain) !== 0 && (
                      <div className="text-xs text-accent text-center mt-1 font-bold">
                        {getVoteScore(domain.domain) > 0 ? '+' : ''}{getVoteScore(domain.domain)} votes
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Main Content Area */}
        <div className="lg:col-span-3 space-y-6">
          {/* Search and Filter Bar */}
          <Card className="card-3d">
            <CardHeader>
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div>
                  <CardTitle className="flex items-center gap-2 text-2xl">
                    <Globe className="w-6 h-6 text-primary" />
                    Top 26 Global Domains
                  </CardTitle>
                  <CardDescription className="text-base mt-2">
                    Legal exploration of leading platforms with comprehensive feature analysis and validated URLs
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  placeholder="Search domains by name, category, features, or description..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 h-12 text-base border-2"
                />
              </div>

              <div className="flex flex-wrap gap-2">
                {categories.map((cat) => (
                  <Button
                    key={cat}
                    variant={selectedCategory === cat ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedCategory(cat)}
                    className={selectedCategory === cat ? 'neon-glow' : ''}
                  >
                    {cat === 'all' ? 'All Categories' : cat}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Domain Cards Grid */}
          {filteredDomains.length === 0 ? (
            <Card className="card-3d">
              <CardContent className="py-16">
                <div className="text-center">
                  <p className="text-muted-foreground text-lg">
                    {searchQuery ? 'No domains found matching your search' : 'No domain references available'}
                  </p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-6">
              {filteredDomains.map((domain) => {
                const votes = domainVotes[domain.domain] || { upvotes: 0, downvotes: 0 };
                const voteScore = votes.upvotes - votes.downvotes;
                
                return (
                  <Card key={domain.domain} id={`domain-${domain.domain}`} className="card-3d card-3d-hover">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="space-y-3 flex-1">
                          <div className="flex items-center gap-3 flex-wrap justify-center">
                            <CardTitle className="text-2xl flex items-center gap-2">
                              <ExternalLink className="w-5 h-5 text-primary" />
                              <span className="text-gradient">{domain.domain}</span>
                            </CardTitle>
                            <Badge variant="default" className="neon-glow text-sm px-3 py-1">
                              {domain.category}
                            </Badge>
                            {domainClicks[domain.domain] > 0 && (
                              <Badge variant="secondary" className="text-sm px-3 py-1">
                                <MousePointerClick className="w-3 h-3 mr-1" />
                                {domainClicks[domain.domain]} clicks
                              </Badge>
                            )}
                            {voteScore !== 0 && (
                              <Badge 
                                variant={voteScore > 0 ? 'default' : 'destructive'} 
                                className="text-sm px-3 py-1"
                              >
                                {voteScore > 0 ? '+' : ''}{voteScore} votes
                              </Badge>
                            )}
                          </div>
                          <CardDescription className="text-base leading-relaxed text-center">
                            {domain.description}
                          </CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      {/* Action Buttons with Voting */}
                      <div className="flex gap-3 justify-center flex-wrap">
                        <Button
                          onClick={() => handleDomainClick(domain.domain)}
                          className="gap-2 neon-glow"
                        >
                          <ExternalLink className="w-4 h-4" />
                          Visit Domain
                        </Button>
                        <Button
                          onClick={() => handlePreviewClick(domain.domain)}
                          variant="outline"
                          className="gap-2"
                        >
                          <Maximize2 className="w-4 h-4" />
                          Web Preview
                        </Button>
                        <div className="flex gap-2">
                          <Button
                            onClick={() => handleVote(domain.domain, 'up')}
                            variant="outline"
                            size="sm"
                            className="gap-1"
                          >
                            <ThumbsUp className="w-4 h-4" />
                            {votes.upvotes}
                          </Button>
                          <Button
                            onClick={() => handleVote(domain.domain, 'down')}
                            variant="outline"
                            size="sm"
                            className="gap-1"
                          >
                            <ThumbsDown className="w-4 h-4" />
                            {votes.downvotes}
                          </Button>
                        </div>
                      </div>

                      {/* Business Insights */}
                      {domain.notes && (
                        <div className="gradient-border p-4 rounded-lg">
                          <div className="flex items-start gap-3">
                            <TrendingUp className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                            <div>
                              <h4 className="font-semibold mb-2 text-primary">Business Trends & USPs</h4>
                              <p className="text-sm text-muted-foreground leading-relaxed">{domain.notes}</p>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Key Features & Functionalities */}
                      <div>
                        <div className="flex items-center gap-2 mb-3">
                          <Zap className="w-5 h-5 text-accent" />
                          <h4 className="font-semibold text-accent">Key Features & Functionalities</h4>
                          <Badge variant="secondary" className="ml-auto">
                            {domain.features.length} features
                          </Badge>
                        </div>
                        <div className="grid sm:grid-cols-2 gap-2">
                          {domain.features.map((feature, idx) => (
                            <div
                              key={idx}
                              className="flex items-start gap-2 p-3 rounded-lg bg-accent/5 border border-accent/20 hover:bg-accent/10 transition-colors"
                            >
                              <CheckCircle2 className="w-4 h-4 text-success mt-0.5 flex-shrink-0" />
                              <span className="text-sm">{feature}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Design & Performance Highlights */}
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div className="gradient-border p-4 rounded-lg">
                          <div className="flex items-center gap-2 mb-2">
                            <Shield className="w-4 h-4 text-secondary" />
                            <h5 className="font-semibold text-sm text-secondary">Design Excellence</h5>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            Modular architecture with scalable components and responsive design patterns
                          </p>
                        </div>
                        <div className="gradient-border p-4 rounded-lg">
                          <div className="flex items-center gap-2 mb-2">
                            <Zap className="w-4 h-4 text-accent" />
                            <h5 className="font-semibold text-sm text-accent">High Performance</h5>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            Optimized for billion-user capacity with advanced caching and CDN integration
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Bottom Navigation Bar */}
      <Card className="card-3d sticky bottom-4 z-50">
        <CardContent className="py-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Globe className="w-5 h-5 text-primary" />
              <span className="font-semibold">
                Showing {filteredDomains.length} of {domainReferences.length} domains
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              >
                Back to Top
              </Button>
              {isAdmin && (
                <Badge variant="default" className="neon-glow">
                  Admin Mode
                </Badge>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {previewDomain && (
        <DomainPreviewDialog
          domain={previewDomain}
          open={!!previewDomain}
          onOpenChange={(open) => !open && setPreviewDomain(null)}
        />
      )}
    </div>
  );
}
