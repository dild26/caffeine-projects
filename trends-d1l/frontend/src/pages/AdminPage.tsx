import { useState } from 'react';
import { useGetAllTopics, useGetTopicCount, useRefreshTopics, useHideTopic, useDeleteTopic, useCreateTopic } from '../hooks/useQueries';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { RefreshCw, Eye, EyeOff, Trash2, Plus, Shield } from 'lucide-react';
import { toast } from 'sonner';
import { generateMockTopics } from '../lib/mockData';
import type { TopicInput } from '../backend';

export default function AdminPage() {
  const { data: topics, isLoading } = useGetAllTopics(100);
  const { data: topicCount } = useGetTopicCount();
  const refreshMutation = useRefreshTopics();
  const hideMutation = useHideTopic();
  const deleteMutation = useDeleteTopic();
  const createMutation = useCreateTopic();
  const [isGenerating, setIsGenerating] = useState(false);

  const handleRefresh = async () => {
    try {
      await refreshMutation.mutateAsync();
      toast.success('Topics refreshed successfully!');
    } catch (error) {
      toast.error('Failed to refresh topics');
    }
  };

  const handleHide = async (id: bigint) => {
    try {
      await hideMutation.mutateAsync(id);
      toast.success('Topic hidden successfully!');
    } catch (error) {
      toast.error('Failed to hide topic');
    }
  };

  const handleDelete = async (id: bigint) => {
    try {
      await deleteMutation.mutateAsync(id);
      toast.success('Topic deleted successfully!');
    } catch (error) {
      toast.error('Failed to delete topic');
    }
  };

  const handleGenerateMockData = async () => {
    setIsGenerating(true);
    try {
      const mockTopics = generateMockTopics(100);
      
      for (const topic of mockTopics) {
        await createMutation.mutateAsync(topic);
      }
      
      toast.success('100 mock topics generated successfully!');
    } catch (error) {
      toast.error('Failed to generate mock topics');
    } finally {
      setIsGenerating(false);
    }
  };

  if (isLoading) {
    return (
      <div className="container py-12 max-w-6xl">
        <Skeleton className="h-12 w-64 mb-8" />
        <div className="grid gap-6">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-32 rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container py-12 max-w-6xl">
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <Shield className="h-8 w-8 text-primary" />
              <h1 className="text-3xl font-bold">Admin Panel</h1>
            </div>
            <p className="text-muted-foreground">
              Manage trending topics and content
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={handleGenerateMockData}
              disabled={isGenerating}
              variant="outline"
              className="gap-2"
            >
              {isGenerating ? (
                <RefreshCw className="h-4 w-4 animate-spin" />
              ) : (
                <Plus className="h-4 w-4" />
              )}
              Generate 100 Topics
            </Button>
            <Button
              onClick={handleRefresh}
              disabled={refreshMutation.isPending}
              className="gap-2"
            >
              {refreshMutation.isPending ? (
                <RefreshCw className="h-4 w-4 animate-spin" />
              ) : (
                <RefreshCw className="h-4 w-4" />
              )}
              Refresh Topics
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Topics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{topicCount?.toString() || '0'}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Active Topics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {topics?.filter((t) => t.status === 'active').length || 0}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Hidden Topics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {topics?.filter((t) => t.status === 'hidden').length || 0}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Topics List */}
        <Card>
          <CardHeader>
            <CardTitle>All Topics</CardTitle>
            <CardDescription>
              Manage visibility and content for all trending topics
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topics?.map((topic) => (
                <div
                  key={topic.id.toString()}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold">{topic.title}</h3>
                      <Badge variant="secondary" className="text-xs">
                        {topic.category}
                      </Badge>
                      <Badge
                        variant={topic.status === 'active' ? 'default' : 'outline'}
                        className="text-xs"
                      >
                        {topic.status}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>ID: {topic.id.toString()}</span>
                      <span>Score: {Number(topic.score)}</span>
                      <span className="capitalize">{topic.trendIndicator}</span>
                      <span>{Number(topic.polygonVertices)} vertices</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleHide(topic.id)}
                      disabled={hideMutation.isPending}
                      className="gap-2"
                    >
                      {topic.status === 'hidden' ? (
                        <>
                          <Eye className="h-4 w-4" />
                          Show
                        </>
                      ) : (
                        <>
                          <EyeOff className="h-4 w-4" />
                          Hide
                        </>
                      )}
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(topic.id)}
                      disabled={deleteMutation.isPending}
                      className="gap-2"
                    >
                      <Trash2 className="h-4 w-4" />
                      Delete
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
