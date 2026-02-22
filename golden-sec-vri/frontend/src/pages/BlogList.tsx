import { useGetPublishedBlogPosts, useGetAllBlogPosts, useIsCallerAdmin, useCreateBlogPost, useSetBlogPostPublished } from '../hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useNavigate } from '@tanstack/react-router';
import { BookOpen, Plus, Calendar, Eye, EyeOff, FileText, Search, TrendingUp, Clock, User, RefreshCw } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { useState, useMemo, useEffect } from 'react';
import type { BlogPost } from '../backend';

export default function BlogList() {
  const { data: publishedPosts, isLoading: publishedLoading, refetch: refetchPublished } = useGetPublishedBlogPosts();
  const { data: allPosts, isLoading: allLoading, refetch: refetchAll } = useGetAllBlogPosts();
  const { data: isAdmin } = useIsCallerAdmin();
  const { mutate: createPost, isPending: createPending } = useCreateBlogPost();
  const { mutate: setPublished, isPending: publishPending } = useSetBlogPostPublished();
  const navigate = useNavigate();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  // Auto-refresh blog posts every 30 seconds to keep in sync
  useEffect(() => {
    const interval = setInterval(() => {
      if (isAdmin) {
        refetchAll();
      }
      refetchPublished();
    }, 30000);

    return () => clearInterval(interval);
  }, [isAdmin, refetchAll, refetchPublished]);

  const handleCreatePost = () => {
    if (title.trim() && content.trim()) {
      createPost({ title, content }, {
        onSuccess: () => {
          setTitle('');
          setContent('');
          setDialogOpen(false);
          // Force immediate refresh
          setTimeout(() => {
            refetchAll();
            refetchPublished();
          }, 500);
        },
      });
    }
  };

  const handleTogglePublish = (e: React.MouseEvent, postId: string, currentStatus: boolean) => {
    e.stopPropagation();
    setPublished({ id: postId, published: !currentStatus }, {
      onSuccess: () => {
        // Force immediate refresh
        setTimeout(() => {
          refetchAll();
          refetchPublished();
        }, 500);
      },
    });
  };

  const handleManualRefresh = () => {
    if (isAdmin) {
      refetchAll();
    }
    refetchPublished();
  };

  const formatDate = (timestamp: bigint) => {
    const date = new Date(Number(timestamp) / 1000000);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  const calculateReadingTime = (content: string) => {
    const wordsPerMinute = 200;
    const wordCount = content.trim().split(/\s+/).length;
    const minutes = Math.ceil(wordCount / wordsPerMinute);
    return minutes;
  };

  const getExcerpt = (content: string, maxLength: number = 150) => {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength).trim() + '...';
  };

  const draftPosts = allPosts?.filter(post => !post.published) || [];
  const isLoading = isAdmin ? allLoading : publishedLoading;

  // Filter posts based on search query
  const filteredPublishedPosts = useMemo(() => {
    if (!publishedPosts) return [];
    if (!searchQuery.trim()) return publishedPosts;
    
    const query = searchQuery.toLowerCase();
    return publishedPosts.filter(post => 
      post.title.toLowerCase().includes(query) || 
      post.content.toLowerCase().includes(query)
    );
  }, [publishedPosts, searchQuery]);

  const filteredDraftPosts = useMemo(() => {
    if (!draftPosts) return [];
    if (!searchQuery.trim()) return draftPosts;
    
    const query = searchQuery.toLowerCase();
    return draftPosts.filter(post => 
      post.title.toLowerCase().includes(query) || 
      post.content.toLowerCase().includes(query)
    );
  }, [draftPosts, searchQuery]);

  const renderPostCard = (post: BlogPost, showPublishButton = false) => {
    const readingTime = calculateReadingTime(post.content);
    const excerpt = getExcerpt(post.content);

    return (
      <Card
        key={post.id}
        className="group cursor-pointer border-2 shadow-lg transition-all hover:shadow-xl hover:border-primary hover:scale-[1.02]"
        onClick={() => navigate({ to: '/blog/$postId', params: { postId: post.id } })}
      >
        <CardHeader>
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 space-y-2">
              <CardTitle className="line-clamp-2 text-xl group-hover:text-primary transition-colors">
                {post.title}
              </CardTitle>
              <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {formatDate(post.createdAt)}
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {readingTime} min read
                </div>
                <div className="flex items-center gap-1">
                  <User className="h-3 w-3" />
                  Admin
                </div>
              </div>
            </div>
            {showPublishButton && isAdmin && (
              <Button
                variant={post.published ? 'outline' : 'default'}
                size="sm"
                className="gap-1 shrink-0"
                onClick={(e) => handleTogglePublish(e, post.id, post.published)}
                disabled={publishPending}
              >
                {post.published ? (
                  <>
                    <EyeOff className="h-3 w-3" />
                    Unpublish
                  </>
                ) : (
                  <>
                    <Eye className="h-3 w-3" />
                    Publish
                  </>
                )}
              </Button>
            )}
          </div>
          {!post.published && (
            <Badge variant="secondary" className="w-fit">
              Draft
            </Badge>
          )}
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground leading-relaxed">{excerpt}</p>
          <div className="mt-4 flex items-center gap-2">
            <Badge variant="outline" className="text-xs">
              <TrendingUp className="h-3 w-3 mr-1" />
              Real Estate
            </Badge>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="container px-4 py-8">
      {/* Hero Section */}
      <div className="mb-8 rounded-2xl bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10 p-8 border-2 border-primary/20">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-primary/20 border-2 border-primary">
              <BookOpen className="h-8 w-8 text-primary" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-foreground">SECoin Blog</h1>
              <p className="text-lg text-muted-foreground">Insights, updates, and real estate trends</p>
            </div>
          </div>

          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="lg" 
              onClick={handleManualRefresh}
              className="gap-2"
            >
              <RefreshCw className="h-5 w-5" />
              Refresh
            </Button>
            {isAdmin && (
              <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogTrigger asChild>
                  <Button size="lg" className="gap-2 shadow-lg">
                    <Plus className="h-5 w-5" />
                    Create New Post
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle className="text-2xl">Create Blog Post</DialogTitle>
                    <DialogDescription>
                      Write a new blog post. It will be created as a draft and you can publish it later.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-6 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="title" className="text-base font-semibold">Title</Label>
                      <Input
                        id="title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Enter an engaging post title..."
                        className="text-lg"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="content" className="text-base font-semibold">Content</Label>
                      <Textarea
                        id="content"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder="Write your post content here... (Markdown support coming soon)"
                        className="min-h-[400px] font-mono text-sm"
                      />
                      <p className="text-xs text-muted-foreground">
                        Estimated reading time: {calculateReadingTime(content)} minutes
                      </p>
                    </div>
                    <div className="flex gap-3">
                      <Button 
                        onClick={handleCreatePost} 
                        disabled={createPending || !title.trim() || !content.trim()}
                        className="flex-1"
                      >
                        {createPending ? 'Creating...' : 'Create Draft'}
                      </Button>
                      <Button 
                        variant="outline" 
                        onClick={() => setDialogOpen(false)}
                        className="flex-1"
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            )}
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative max-w-2xl mx-auto">
          <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search blog posts by title or content..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-12 h-12 text-base border-2"
          />
        </div>
      </div>

      {isAdmin ? (
        <Tabs defaultValue="published" className="w-full">
          <TabsList className="mb-6 grid w-full max-w-md mx-auto grid-cols-2 h-12">
            <TabsTrigger value="published" className="gap-2 text-base">
              <Eye className="h-4 w-4" />
              Published ({filteredPublishedPosts.length})
            </TabsTrigger>
            <TabsTrigger value="drafts" className="gap-2 text-base">
              <FileText className="h-4 w-4" />
              Drafts ({filteredDraftPosts.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="published">
            {publishedLoading ? (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {[...Array(6)].map((_, i) => (
                  <Skeleton key={i} className="h-72" />
                ))}
              </div>
            ) : filteredPublishedPosts.length > 0 ? (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {filteredPublishedPosts.map((post) => renderPostCard(post, true))}
              </div>
            ) : (
              <Card className="border-2">
                <CardContent className="flex min-h-[400px] flex-col items-center justify-center p-8 text-center">
                  <Eye className="mb-4 h-16 w-16 text-muted-foreground/50" />
                  <h3 className="mb-2 text-xl font-semibold text-foreground">
                    {searchQuery ? 'No Published Posts Found' : 'No Published Posts'}
                  </h3>
                  <p className="text-muted-foreground max-w-md">
                    {searchQuery 
                      ? 'Try adjusting your search query to find what you\'re looking for.'
                      : 'Published blog posts will appear here for all users to see.'
                    }
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="drafts">
            {allLoading ? (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {[...Array(6)].map((_, i) => (
                  <Skeleton key={i} className="h-72" />
                ))}
              </div>
            ) : filteredDraftPosts.length > 0 ? (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {filteredDraftPosts.map((post) => renderPostCard(post, true))}
              </div>
            ) : (
              <Card className="border-2">
                <CardContent className="flex min-h-[400px] flex-col items-center justify-center p-8 text-center">
                  <FileText className="mb-4 h-16 w-16 text-muted-foreground/50" />
                  <h3 className="mb-2 text-xl font-semibold text-foreground">
                    {searchQuery ? 'No Draft Posts Found' : 'No Draft Posts'}
                  </h3>
                  <p className="text-muted-foreground max-w-md">
                    {searchQuery 
                      ? 'Try adjusting your search query to find what you\'re looking for.'
                      : 'Create a new blog post to get started. Drafts are only visible to admins.'
                    }
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      ) : (
        <>
          {isLoading ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {[...Array(6)].map((_, i) => (
                <Skeleton key={i} className="h-72" />
              ))}
            </div>
          ) : filteredPublishedPosts.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredPublishedPosts.map((post) => renderPostCard(post))}
            </div>
          ) : (
            <Card className="border-2">
              <CardContent className="flex min-h-[400px] flex-col items-center justify-center p-8 text-center">
                <BookOpen className="mb-4 h-16 w-16 text-muted-foreground/50" />
                <h3 className="mb-2 text-xl font-semibold text-foreground">
                  {searchQuery ? 'No Blog Posts Found' : 'No Blog Posts Yet'}
                </h3>
                <p className="text-muted-foreground max-w-md">
                  {searchQuery 
                    ? 'Try adjusting your search query to find what you\'re looking for.'
                    : 'Blog posts will appear here once they are published. Check back soon for insights and updates!'
                  }
                </p>
              </CardContent>
            </Card>
          )}
        </>
      )}

      {/* Coming Soon Features Banner */}
      {isAdmin && (
        <Card className="mt-8 border-2 border-accent/30 bg-accent/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-accent" />
              Advanced Blog Features Coming Soon
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <div className="space-y-1">
                <h4 className="font-semibold text-sm">Categories & Tags</h4>
                <p className="text-xs text-muted-foreground">Organize posts with dynamic taxonomy</p>
              </div>
              <div className="space-y-1">
                <h4 className="font-semibold text-sm">Multi-Author Support</h4>
                <p className="text-xs text-muted-foreground">Role-based authoring system</p>
              </div>
              <div className="space-y-1">
                <h4 className="font-semibold text-sm">SEO Optimization</h4>
                <p className="text-xs text-muted-foreground">AI-generated meta tags & slugs</p>
              </div>
              <div className="space-y-1">
                <h4 className="font-semibold text-sm">Rich Text Editor</h4>
                <p className="text-xs text-muted-foreground">Markdown & WYSIWYG support</p>
              </div>
              <div className="space-y-1">
                <h4 className="font-semibold text-sm">Analytics Dashboard</h4>
                <p className="text-xs text-muted-foreground">Track views, engagement & conversions</p>
              </div>
              <div className="space-y-1">
                <h4 className="font-semibold text-sm">Comments System</h4>
                <p className="text-xs text-muted-foreground">AI-moderated discussions</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
