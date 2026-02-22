import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Share2, Bookmark, Eye } from 'lucide-react';
import { toast } from 'sonner';
import type { Topic } from '../backend';

interface TopicModalProps {
  topic: Topic | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function TopicModal({ topic, open, onOpenChange }: TopicModalProps) {
  if (!topic) return null;

  const handleShare = () => {
    const url = `${window.location.origin}/topic/${topic.slug}`;
    navigator.clipboard.writeText(url);
    toast.success('Link copied to clipboard!');
  };

  const handleSave = () => {
    toast.success('Topic saved to watchlist!');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">{topic.title}</DialogTitle>
          <DialogDescription className="flex items-center gap-2">
            <Badge variant="secondary">{topic.category}</Badge>
            <span className="text-xs text-muted-foreground capitalize">
              {topic.trendIndicator}
            </span>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {topic.paragraphs.map((paragraph, index) => (
            <div key={index} className="space-y-2">
              <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
                {index === 0 && 'Overview'}
                {index === 1 && 'Why It\'s Trending'}
                {index === 2 && 'Key Facts'}
                {index === 3 && 'Future Outlook'}
              </h4>
              <p className="text-sm leading-relaxed">{paragraph.content}</p>
              {paragraph.sources.length > 0 && (
                <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                  {paragraph.sources.map((source, idx) => (
                    <a
                      key={idx}
                      href={source}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-primary transition-colors"
                    >
                      [{idx + 1}]
                    </a>
                  ))}
                </div>
              )}
            </div>
          ))}

          {topic.relatedQueries.length > 0 && (
            <div className="space-y-2 pt-4 border-t">
              <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
                Related Queries
              </h4>
              <div className="flex flex-wrap gap-2">
                {topic.relatedQueries.map((query, idx) => (
                  <Badge key={idx} variant="outline" className="text-xs">
                    {query}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          <div className="flex gap-2 pt-4">
            <Button onClick={handleShare} variant="outline" size="sm" className="gap-2">
              <Share2 className="h-4 w-4" />
              Share
            </Button>
            <Button onClick={handleSave} variant="outline" size="sm" className="gap-2">
              <Bookmark className="h-4 w-4" />
              Save
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
