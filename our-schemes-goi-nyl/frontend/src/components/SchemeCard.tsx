import { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ExternalLinkIcon, BookmarkIcon, BookmarkCheckIcon } from 'lucide-react';
import { usePinnedSchemes } from '@/hooks/usePinnedSchemes';
import type { Scheme } from '@/backend';
import { toast } from 'sonner';

interface SchemeCardProps {
  scheme: Scheme;
}

export default function SchemeCard({ scheme }: SchemeCardProps) {
  const { isPinned, togglePin } = usePinnedSchemes();
  const pinned = isPinned(Number(scheme.id));

  const handleTogglePin = () => {
    togglePin(scheme);
    if (!pinned) {
      toast.success('Scheme added to your list');
    } else {
      toast.info('Scheme removed from your list');
    }
  };

  return (
    <Card className="flex flex-col transition-shadow hover:shadow-md">
      <CardHeader>
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="line-clamp-2 text-lg">{scheme.name}</CardTitle>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleTogglePin}
            className="shrink-0"
            aria-label={pinned ? 'Remove from list' : 'Add to list'}
          >
            {pinned ? (
              <BookmarkCheckIcon className="h-5 w-5 fill-primary text-primary" />
            ) : (
              <BookmarkIcon className="h-5 w-5" />
            )}
          </Button>
        </div>
        <CardDescription className="text-sm">{scheme.ministry}</CardDescription>
      </CardHeader>

      <CardContent className="flex-1 space-y-3">
        <p className="line-clamp-3 text-sm text-muted-foreground">{scheme.description}</p>

        {scheme.tags && scheme.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {scheme.tags.slice(0, 3).map((tag, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
            {scheme.tags.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{scheme.tags.length - 3}
              </Badge>
            )}
          </div>
        )}

        <div className="space-y-1 text-xs text-muted-foreground">
          <p>
            <span className="font-medium">Category:</span> {scheme.category}
          </p>
        </div>
      </CardContent>

      <CardFooter>
        <Button asChild className="w-full gap-2">
          <a href={scheme.sourceUrl} target="_blank" rel="noopener noreferrer">
            Go to Official Site
            <ExternalLinkIcon className="h-4 w-4" />
          </a>
        </Button>
      </CardFooter>
    </Card>
  );
}
