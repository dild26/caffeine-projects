import { useState } from 'react';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useGetAllTopics, useCreateTopic, useVoteTopic, useAddReaction, useSearchTopicsByHashtag, useSearchTopicsByCategory } from '../hooks/useQueries';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { ThumbsUp, ThumbsDown, Heart, Search, Plus, Loader2, Hash, Filter } from 'lucide-react';
import type { Topic } from '../backend';

const CATEGORIES = [
  { value: 'field', label: 'Field' },
  { value: 'skill', label: 'Skill' },
  { value: 'interest', label: 'Interest' },
  { value: 'technology', label: 'Technology' },
  { value: 'business', label: 'Business' },
  { value: 'general', label: 'General' },
];

export default function TopicsPage() {
  const { identity } = useInternetIdentity();
  const { data: topics = [], isLoading } = useGetAllTopics();
  const createTopic = useCreateTopic();
  const voteTopic = useVoteTopic();
  const addReaction = useAddReaction();
  const searchByHashtag = useSearchTopicsByHashtag();
  const searchByCategory = useSearchTopicsByCategory();

  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [content, setContent] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('general');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [filteredTopics, setFilteredTopics] = useState<Topic[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchType, setSearchType] = useState<'hashtag' | 'category' | 'none'>('none');

  const isAuthenticated = !!identity;

  const handleCreateTopic = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!content.trim() || !description.trim()) {
      toast.error('Please fill in all fields');
      return;
    }

    try {
      await createTopic.mutateAsync({ content: content.trim(), description: description.trim(), category });
      toast.success('Topic created successfully!');
      setContent('');
      setDescription('');
      setCategory('general');
      setCreateDialogOpen(false);
    } catch (error: any) {
      console.error('Error creating topic:', error);
      toast.error(error.message || 'Failed to create topic');
    }
  };

  const handleVote = async (topicId: string, upvote: boolean) => {
    try {
      await voteTopic.mutateAsync({ topicId, upvote });
      toast.success(upvote ? 'Upvoted!' : 'Downvoted!');
    } catch (error: any) {
      console.error('Error voting:', error);
      toast.error(error.message || 'Failed to vote');
    }
  };

  const handleReaction = async (topicId: string, reaction: string) => {
    try {
      await addReaction.mutateAsync({ topicId, reaction });
      toast.success('Reaction added!');
    } catch (error: any) {
      console.error('Error adding reaction:', error);
      toast.error(error.message || 'Failed to add reaction');
    }
  };

  const handleHashtagSearch = async () => {
    if (!searchQuery.trim()) {
      setFilteredTopics([]);
      setIsSearching(false);
      setSearchType('none');
      return;
    }

    const hashtag = searchQuery.startsWith('#') ? searchQuery : `#${searchQuery}`;

    try {
      const results = await searchByHashtag.mutateAsync(hashtag);
      setFilteredTopics(results);
      setIsSearching(true);
      setSearchType('hashtag');
    } catch (error: any) {
      console.error('Error searching:', error);
      toast.error(error.message || 'Failed to search topics');
    }
  };

  const handleCategoryFilter = async (categoryValue: string) => {
    setSelectedCategory(categoryValue);

    if (categoryValue === 'all') {
      setFilteredTopics([]);
      setIsSearching(false);
      setSearchType('none');
      return;
    }

    try {
      const results = await searchByCategory.mutateAsync(categoryValue);
      setFilteredTopics(results);
      setIsSearching(true);
      setSearchType('category');
    } catch (error: any) {
      console.error('Error filtering:', error);
      toast.error(error.message || 'Failed to filter topics');
    }
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setFilteredTopics([]);
    setIsSearching(false);
    setSearchType('none');
  };

  const displayTopics = isSearching ? filteredTopics : topics;

  if (!isAuthenticated) {
    return (
      <div className="py-20">
        <div className="container text-center">
          <h1 className="text-4xl font-bold mb-4">Topics</h1>
          <p className="text-lg text-muted-foreground mb-8">Please login to view and create topics.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="py-12">
      <div className="container">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">Topics</h1>
            <p className="text-muted-foreground">Share your expertise and discover insights from others</p>
          </div>
          <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Create Topic
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Create New Topic</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleCreateTopic} className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label htmlFor="content">Content *</Label>
                  <Textarea
                    id="content"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Share your expertise... Use #hashtags to categorize"
                    rows={4}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Provide more details about your topic"
                    rows={3}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Category *</Label>
                  <Select value={category} onValueChange={setCategory}>
                    <SelectTrigger id="category">
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {CATEGORIES.map((cat) => (
                        <SelectItem key={cat.value} value={cat.value}>
                          {cat.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Button type="submit" className="w-full" disabled={createTopic.isPending}>
                  {createTopic.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    'Create Topic'
                  )}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <Tabs defaultValue="hashtag" className="mb-8">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="hashtag">Search by Hashtag</TabsTrigger>
            <TabsTrigger value="category">Filter by Category</TabsTrigger>
          </TabsList>
          <TabsContent value="hashtag" className="space-y-4">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleHashtagSearch()}
                  placeholder="Search by hashtag (e.g., #javascript)"
                  className="pl-10"
                />
              </div>
              <Button onClick={handleHashtagSearch} disabled={searchByHashtag.isPending}>
                {searchByHashtag.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Search'}
              </Button>
              {isSearching && searchType === 'hashtag' && (
                <Button variant="outline" onClick={handleClearSearch}>
                  Clear
                </Button>
              )}
            </div>
          </TabsContent>
          <TabsContent value="category" className="space-y-4">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Select value={selectedCategory} onValueChange={handleCategoryFilter}>
                  <SelectTrigger className="pl-10">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {CATEGORIES.map((cat) => (
                      <SelectItem key={cat.value} value={cat.value}>
                        {cat.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              {isSearching && searchType === 'category' && (
                <Button variant="outline" onClick={handleClearSearch}>
                  Clear
                </Button>
              )}
            </div>
          </TabsContent>
        </Tabs>

        {isLoading ? (
          <div className="text-center py-12">
            <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
            <p className="text-muted-foreground mt-4">Loading topics...</p>
          </div>
        ) : displayTopics.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              {isSearching ? 'No topics found for this search.' : 'No topics yet. Be the first to create one!'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {displayTopics.map((topic) => (
              <Card key={topic.id} className="border-2 hover:border-primary/30 transition-colors">
                <CardHeader>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <CardTitle className="text-xl">{topic.content}</CardTitle>
                        <Badge variant="outline">{CATEGORIES.find(c => c.value === topic.category)?.label || topic.category}</Badge>
                      </div>
                      <p className="text-muted-foreground text-sm">{topic.description}</p>
                    </div>
                    <Badge variant="outline" className="flex items-center gap-1">
                      <ThumbsUp className="h-3 w-3" />
                      {Number(topic.votes)}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {topic.hashtags.map((hashtag, idx) => (
                      <Badge key={idx} variant="secondary" className="gap-1">
                        <Hash className="h-3 w-3" />
                        {hashtag.replace('#', '')}
                      </Badge>
                    ))}
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleVote(topic.id, true)}
                      disabled={voteTopic.isPending}
                      className="gap-1"
                    >
                      <ThumbsUp className="h-4 w-4" />
                      Upvote
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleVote(topic.id, false)}
                      disabled={voteTopic.isPending}
                      className="gap-1"
                    >
                      <ThumbsDown className="h-4 w-4" />
                      Downvote
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleReaction(topic.id, '❤️')}
                      disabled={addReaction.isPending}
                      className="gap-1"
                    >
                      <Heart className="h-4 w-4" />
                      React
                    </Button>
                    {topic.reactions.length > 0 && (
                      <span className="text-sm text-muted-foreground ml-2">
                        {topic.reactions.length} reaction{topic.reactions.length !== 1 ? 's' : ''}
                      </span>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
