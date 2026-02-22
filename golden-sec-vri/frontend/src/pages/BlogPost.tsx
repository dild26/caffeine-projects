import { useGetBlogPost, useIsCallerAdmin, useUpdateBlogPost, useSetBlogPostPublished } from '../hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { useNavigate, useParams } from '@tanstack/react-router';
import { ArrowLeft, Calendar, Edit, Eye, EyeOff, Clock, User, Share2, Bookmark, TrendingUp } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useState } from 'react';
import { toast } from 'sonner';

export default function BlogPost() {
  const { postId } = useParams({ from: '/blog/$postId' });
  const { data: post, isLoading } = useGetBlogPost(postId);
  const { data: isAdmin } = useIsCallerAdmin();
  const { mutate: updatePost, isPending: updatePending } = useUpdateBlogPost();
  const { mutate: setPublished, isPending: publishPending } = useSetBlogPostPublished();
  const navigate = useNavigate();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

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

  const handleEdit = () => {
    if (post) {
      setTitle(post.title);
      setContent(post.content);
      setDialogOpen(true);
    }
  };

  const handleUpdate = () => {
    if (title.trim() && content.trim() && post) {
      updatePost({ id: post.id, title, content }, {
        onSuccess: () => {
          setDialogOpen(false);
        },
      });
    }
  };

  const handleTogglePublish = () => {
    if (post) {
      const newStatus = !post.published;
      setPublished({ id: post.id, published: newStatus }, {
        onSuccess: () => {
          if (newStatus) {
            toast.success('Blog post is now live and visible to all users!');
          }
        },
      });
    }
  };

  const handleShare = () => {
    if (navigator.share && post) {
      navigator.share({
        title: post.title,
        text: post.content.substring(0, 150) + '...',
        url: window.location.href,
      }).catch(() => {
        // Fallback: copy to clipboard
        navigator.clipboard.writeText(window.location.href);
        toast.success('Link copied to clipboard!');
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard!');
    }
  };

  if (isLoading) {
    return (
      <div className="container px-4 py-8 max-w-4xl">
        <Skeleton className="mb-4 h-10 w-32" />
        <Skeleton className="mb-8 h-16 w-full" />
        <Skeleton className="h-96" />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="container px-4 py-8 max-w-4xl">
        <Card className="border-destructive border-2">
          <CardHeader>
            <CardTitle>Post Not Found</CardTitle>
            <CardDescription>The blog post you're looking for doesn't exist.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => navigate({ to: '/blog' })}>Back to Blog</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Non-admin users can't see unpublished posts
  if (!post.published && !isAdmin) {
    return (
      <div className="container px-4 py-8 max-w-4xl">
        <Card className="border-destructive border-2">
          <CardHeader>
            <CardTitle>Post Not Available</CardTitle>
            <CardDescription>This blog post is not published yet.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => navigate({ to: '/blog' })}>Back to Blog</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const readingTime = calculateReadingTime(post.content);

  return (
    <div className="container px-4 py-8 max-w-4xl">
      <Button variant="ghost" className="mb-6 gap-2" onClick={() => navigate({ to: '/blog' })}>
        <ArrowLeft className="h-4 w-4" />
        Back to Blog
      </Button>

      <article>
        <Card className="border-2 shadow-xl">
          <CardHeader className="space-y-6 pb-8">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 space-y-4">
                <div className="flex flex-wrap items-center gap-2">
                  {!post.published && (
                    <Badge variant="secondary" className="text-sm">
                      Draft
                    </Badge>
                  )}
                  <Badge variant="outline" className="text-sm">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    Real Estate
                  </Badge>
                </div>
                <CardTitle className="text-4xl md:text-5xl leading-tight">
                  {post.title}
                </CardTitle>
                <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    <span>Admin</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <span>{formatDate(post.createdAt)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    <span>{readingTime} min read</span>
                  </div>
                </div>
                {post.updatedAt !== post.createdAt && (
                  <p className="text-xs text-muted-foreground">
                    Last updated: {formatDate(post.updatedAt)}
                  </p>
                )}
              </div>
              {isAdmin && (
                <div className="flex flex-col gap-2">
                  <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm" className="gap-2" onClick={handleEdit}>
                        <Edit className="h-4 w-4" />
                        Edit
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle className="text-2xl">Edit Blog Post</DialogTitle>
                        <DialogDescription>Update the blog post content</DialogDescription>
                      </DialogHeader>
                      <div className="space-y-6 py-4">
                        <div className="space-y-2">
                          <Label htmlFor="edit-title" className="text-base font-semibold">Title</Label>
                          <Input
                            id="edit-title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="text-lg"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="edit-content" className="text-base font-semibold">Content</Label>
                          <Textarea
                            id="edit-content"
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            className="min-h-[400px] font-mono text-sm"
                          />
                          <p className="text-xs text-muted-foreground">
                            Estimated reading time: {calculateReadingTime(content)} minutes
                          </p>
                        </div>
                        <div className="flex gap-3">
                          <Button 
                            onClick={handleUpdate} 
                            disabled={updatePending || !title.trim() || !content.trim()}
                            className="flex-1"
                          >
                            {updatePending ? 'Updating...' : 'Update Post'}
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
                  <Button
                    variant={post.published ? 'outline' : 'default'}
                    size="sm"
                    className="gap-2"
                    onClick={handleTogglePublish}
                    disabled={publishPending}
                  >
                    {publishPending ? (
                      'Processing...'
                    ) : post.published ? (
                      <>
                        <EyeOff className="h-4 w-4" />
                        Unpublish
                      </>
                    ) : (
                      <>
                        <Eye className="h-4 w-4" />
                        Publish Now
                      </>
                    )}
                  </Button>
                </div>
              )}
            </div>

            <Separator />

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" size="sm" className="gap-2" onClick={handleShare}>
                <Share2 className="h-4 w-4" />
                Share
              </Button>
              <Button variant="outline" size="sm" className="gap-2">
                <Bookmark className="h-4 w-4" />
                Save for Later
              </Button>
            </div>
          </CardHeader>

          <CardContent className="space-y-8">
            {/* Main Content */}
            <div className="prose prose-lg dark:prose-invert max-w-none">
              <div className="whitespace-pre-wrap leading-relaxed text-foreground">
                {post.content}
              </div>
            </div>

            <Separator />

            {/* Footer Actions */}
            <div className="flex items-center justify-between">
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={handleShare}>
                  Share this post
                </Button>
              </div>
              <Button variant="ghost" size="sm" onClick={() => navigate({ to: '/blog' })}>
                View all posts
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Coming Soon: Related Posts */}
        {isAdmin && (
          <Card className="mt-8 border-2 border-accent/30 bg-accent/5">
            <CardHeader>
              <CardTitle className="text-lg">Coming Soon: Enhanced Blog Features</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3 text-sm">
                <p>• Related posts recommendations</p>
                <p>• Comments and discussions</p>
                <p>• Social media integration</p>
                <p>• Analytics and engagement metrics</p>
                <p>• Property linking for real estate content</p>
              </div>
            </CardContent>
          </Card>
        )}
      </article>
    </div>
  );
}
